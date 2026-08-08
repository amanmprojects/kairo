"""Multi-hop traversal over the skeleton graph.

This is the file that carries the research claim, so it is worth being precise about what
it does that a vector store cannot.

A vector store retrieves by SIMILARITY: text that resembles the query. Ask "why does auth
work this way" and it returns passages that talk about auth. If the answer lives in an
issue that never uses the word "auth" -- but is reachable in three hops from the file --
similarity search cannot find it at any k.

Traversal retrieves by CONNECTION: file <- modified by <- PR <- closes <- issue <-
discussed in <- comment. Each hop is a fact, and the chain is the answer. That is the
"multi-hop relational reasoning" the proposal claims, expressed as a recursive CTE.

The `as_of` parameter is the temporal half: restrict traversal to edges that had already
occurred at a given instant, and the graph answers "what did this look like in March
2023?" rather than "what does it look like now?".
"""

from __future__ import annotations

from datetime import datetime
from typing import Any

from . import db

# Node types are (type, id) pairs throughout; a node is identified by both.
Node = tuple[str, int]


def neighbours(
    repo_id: int,
    node: Node,
    *,
    rels: list[str] | None = None,
    direction: str = "both",
    as_of: datetime | None = None,
) -> list[dict[str, Any]]:
    """One hop out from a node."""
    node_type, node_id = node
    clauses = ["repo_id = %(repo_id)s"]
    params: dict[str, Any] = {"repo_id": repo_id, "nt": node_type, "ni": node_id}

    if direction == "out":
        clauses.append("src_type = %(nt)s AND src_id = %(ni)s")
    elif direction == "in":
        clauses.append("dst_type = %(nt)s AND dst_id = %(ni)s")
    else:
        clauses.append(
            "((src_type = %(nt)s AND src_id = %(ni)s) OR "
            " (dst_type = %(nt)s AND dst_id = %(ni)s))"
        )

    if rels:
        clauses.append("rel = ANY(%(rels)s)")
        params["rels"] = rels
    if as_of:
        clauses.append("occurred_at <= %(as_of)s")
        params["as_of"] = as_of

    return db.query(
        f"SELECT * FROM edges WHERE {' AND '.join(clauses)} ORDER BY occurred_at",
        params,
    )


def traverse(
    repo_id: int,
    start: Node,
    *,
    max_depth: int = 3,
    rels: list[str] | None = None,
    as_of: datetime | None = None,
    limit: int = 500,
    max_degree: int | None = None,
) -> list[dict[str, Any]]:
    """Breadth-first traversal up to `max_depth` hops, returning reachable nodes with
    the path taken to reach each.

    Undirected: edges are followed in both directions, because the interesting chains run
    against the arrows as often as with them (a file is reached from a PR via the reverse
    of MODIFIED).

    The `path` array doubles as cycle protection -- a node already on the current path is
    not re-expanded -- and as the explanation shown to the user. A traversal result that
    cannot show its path is indistinguishable from a guess, which is exactly the property
    this project is trying to avoid.

    HUB SUPPRESSION (`max_degree`) is what makes the results mean anything.

    Software artifact graphs are dominated by a few extremely high-degree nodes: a
    changelog touched by every release, a commit that reformats 200 files, a lockfile
    every PR bumps. Traversal through one of those is technically valid and practically
    useless -- it says "these two files are related" when the only relation is that some
    sweeping commit touched both.

    `max_degree` fixes this by refusing to EXPAND THROUGH any node with more than N
    edges. Hubs still appear in results when directly connected -- a file's own
    high-churn commits are real answers -- they just stop acting as bridges to the rest
    of the repo. This is the standard remedy for hub domination in knowledge graphs.

    Measured on fastapi/fastapi (1000 commits, 16k edges), depth-3 traversal from four
    unrelated source files, Jaccard overlap between result sets:

        max_degree   avg nodes   overlap
        None               786       56%
        100                306       39%
        50                 203       37%
        30                 149       30%
        20                 130       27%     <- default
        10                  35        3%
        5                   16        4%

    20 keeps enough context to answer a question while making results genuinely specific
    to the start node. Below ~10 the walk barely leaves where it started.

    Two measurement traps, both of which produced misleading numbers before being fixed:
    normalising overlap by min(|A|,|B|) makes aggressive pruning look WORSE (small sets
    of shared core files score high), so use Jaccard; and leaving `limit` at its default
    truncates unsuppressed walks, flattering the baseline. On a 100-commit sample the
    threshold has no usable range at all -- every file is proportionally a hub -- so this
    must be tuned against realistically-sized data.
    """
    params: dict[str, Any] = {
        "repo_id": repo_id,
        "start_type": start[0],
        "start_id": start[1],
        "max_depth": max_depth,
        "limit": limit,
    }
    rel_filter = ""
    if rels:
        rel_filter = "AND e.rel = ANY(%(rels)s)"
        params["rels"] = rels
    time_filter = ""
    if as_of:
        time_filter = "AND e.occurred_at <= %(as_of)s"
        params["as_of"] = as_of

    # Degree is computed over the same rel/time slice being traversed, so a node counts
    # as a hub only with respect to this query's view of the graph.
    degree_join = ""
    degree_cond = ""
    if max_degree is not None:
        params["max_degree"] = max_degree
        degree_join = f"""
        , degree AS (
            SELECT node_type, node_id, count(*) AS deg FROM (
                SELECT e.src_type AS node_type, e.src_id AS node_id FROM edges e
                WHERE e.repo_id = %(repo_id)s {rel_filter} {time_filter}
                UNION ALL
                SELECT e.dst_type, e.dst_id FROM edges e
                WHERE e.repo_id = %(repo_id)s {rel_filter} {time_filter}
            ) x GROUP BY node_type, node_id
        )"""
        # Applied to the node being expanded FROM, not the node arrived at: hubs remain
        # reachable as answers, but are never used as bridges. The start node (depth 0)
        # is always exempt -- the query is explicitly about it, so blocking its expansion
        # would return nothing at all.
        degree_cond = """
          AND (w.depth = 0 OR NOT EXISTS (
              SELECT 1 FROM degree d
              WHERE d.node_type = w.node_type AND d.node_id = w.node_id
                AND d.deg > %(max_degree)s
          ))"""

    sql = f"""
    WITH RECURSIVE walk AS (
        SELECT
            %(start_type)s::text AS node_type,
            %(start_id)s::bigint AS node_id,
            0 AS depth,
            ARRAY[%(start_type)s || ':' || %(start_id)s] AS path,
            ARRAY[]::text[] AS rels,
            NULL::timestamptz AS reached_at

        UNION ALL

        SELECT
            nxt.node_type,
            nxt.node_id,
            w.depth + 1,
            w.path || (nxt.node_type || ':' || nxt.node_id),
            w.rels || nxt.rel,
            nxt.occurred_at
        FROM walk w
        CROSS JOIN LATERAL (
            -- Follow outgoing edges...
            SELECT e.dst_type AS node_type, e.dst_id AS node_id, e.rel, e.occurred_at
            FROM edges e
            WHERE e.repo_id = %(repo_id)s
              AND e.src_type = w.node_type AND e.src_id = w.node_id
              {rel_filter} {time_filter}
            UNION ALL
            -- ...and incoming ones.
            SELECT e.src_type, e.src_id, e.rel, e.occurred_at
            FROM edges e
            WHERE e.repo_id = %(repo_id)s
              AND e.dst_type = w.node_type AND e.dst_id = w.node_id
              {rel_filter} {time_filter}
        ) nxt
        WHERE w.depth < %(max_depth)s
          AND NOT (nxt.node_type || ':' || nxt.node_id) = ANY(w.path)
          {degree_cond}
    ){degree_join}
    SELECT node_type, node_id, depth, path, rels, reached_at
    FROM (
        SELECT DISTINCT ON (node_type, node_id)
            node_type, node_id, depth, path, rels, reached_at
        FROM walk
        WHERE depth > 0
        ORDER BY node_type, node_id, depth
    ) shortest
    -- Nearest-first. DISTINCT ON must sort by its own key, so the relevance ordering
    -- has to happen outside it: without this the caller receives results in node-id
    -- order and a depth-3 dependency bump outranks the depth-1 commit that actually
    -- changed the file. When the result is truncated for an LLM prompt, that ordering
    -- decides what the model gets to see.
    ORDER BY depth, reached_at DESC NULLS LAST
    LIMIT %(limit)s
    """
    return db.query(sql, params)


def hydrate(repo_id: int, nodes: list[dict[str, Any]]) -> list[dict[str, Any]]:
    """Attach human-readable content to traversal results.

    Traversal returns (type, id) pairs; this turns them into things a person or an LLM
    can actually read. Done as one query per type rather than per node to avoid N+1.
    """
    by_type: dict[str, list[int]] = {}
    for n in nodes:
        by_type.setdefault(n["node_type"], []).append(n["node_id"])

    content: dict[tuple[str, int], dict] = {}

    if ids := by_type.get("item"):
        for r in db.query(
            """SELECT id, number, kind, title, body, state, created_at, closed_at
               FROM items WHERE repo_id = %s AND id = ANY(%s)""",
            (repo_id, ids),
        ):
            content[("item", r["id"])] = r

    if ids := by_type.get("commit"):
        for r in db.query(
            """SELECT id, sha, message, committed_at
               FROM commits WHERE repo_id = %s AND id = ANY(%s)""",
            (repo_id, ids),
        ):
            content[("commit", r["id"])] = r

    if ids := by_type.get("file"):
        for r in db.query(
            "SELECT id, path FROM files WHERE repo_id = %s AND id = ANY(%s)",
            (repo_id, ids),
        ):
            content[("file", r["id"])] = r

    if ids := by_type.get("person"):
        for r in db.query(
            "SELECT id, login FROM people WHERE repo_id = %s AND id = ANY(%s)",
            (repo_id, ids),
        ):
            content[("person", r["id"])] = r

    out = []
    for n in nodes:
        key = (n["node_type"], n["node_id"])
        out.append({**n, "content": content.get(key)})
    return out


# --- named query patterns ---------------------------------------------------
# The proposal's "four agents" are these: not separate systems, but different traversal
# shapes over one substrate. Unifying them is both less work and a more honest
# architecture than four parallel pipelines that share nothing.


def file_history(
    repo_id: int,
    path: str,
    *,
    as_of: datetime | None = None,
    through_people: bool = False,
    max_degree: int | None = 20,
) -> dict:
    """Everything that ever touched a file, and why.

    The backbone of root-cause analysis: file -> PRs/commits that changed it -> issues
    those PRs closed -> the discussion in those issues.

    `through_people` is off by default, and that default matters. Person nodes are hubs:
    a prolific maintainer connects to thousands of commits, so a traversal that passes
    THROUGH a person reaches most of the repo in three hops via chains like
    MODIFIED -> AUTHORED -> AUTHORED ("some commit by someone who once touched this
    file"). Those nodes are reachable but not relevant.

    PARENT is excluded for a stronger reason: the commit DAG is essentially a linear
    chain, so a single PARENT hop lets the walk run along the entire history. Measured on
    a 100-commit sample, including PARENT made every starting file reach all 100 commits
    -- traversal from `core.py` and from `CHANGES.md` returned identical result sets,
    which is the clearest possible sign the walk had stopped being about the start node.

    What remains -- MODIFIED and CLOSES -- is the causal artifact graph: file <- commit,
    file <- PR, PR -> issue. Every hop answers "this changed that" or "this resolved
    that". Authors and commit ancestry are still available via `neighbours()` when a
    query genuinely wants them; they just no longer act as bridges that flood the walk.
    """
    row = db.query_one(
        "SELECT id FROM files WHERE repo_id = %s AND path = %s", (repo_id, path)
    )
    if not row:
        return {"file": path, "found": False, "nodes": []}

    rels = None if through_people else ["MODIFIED", "CLOSES"]
    nodes = traverse(
        repo_id, ("file", row["id"]), max_depth=3, rels=rels, as_of=as_of,
        max_degree=max_degree,
    )
    return {
        "file": path,
        "found": True,
        "file_id": row["id"],
        "nodes": hydrate(repo_id, nodes),
    }


def find_file(repo_id: int, fragment: str) -> list[dict]:
    """Fuzzy file lookup, so callers can say 'auth' instead of a full path."""
    return db.query(
        """SELECT id, path FROM files
           WHERE repo_id = %s AND path ILIKE %s
           ORDER BY length(path) LIMIT 20""",
        (repo_id, f"%{fragment}%"),
    )


def churn_ranking(repo_id: int, *, limit: int = 20) -> list[dict]:
    """Files ranked by how often they change, with distinct-author counts.

    Feeds both the 'why is this file cursed' demo and the churn component of EES.
    """
    return db.query(
        """
        SELECT f.path,
               count(*) FILTER (WHERE e.src_type = 'commit') AS commit_changes,
               count(*) FILTER (WHERE e.src_type = 'item')   AS pr_changes,
               count(DISTINCT e.src_id)                      AS distinct_sources
        FROM files f
        JOIN edges e ON e.dst_type = 'file' AND e.dst_id = f.id AND e.rel = 'MODIFIED'
        WHERE f.repo_id = %s
        GROUP BY f.path
        ORDER BY count(*) DESC
        LIMIT %s
        """,
        (repo_id, limit),
    )


def repo_id_for(full_name: str) -> int | None:
    row = db.query_one("SELECT id FROM repos WHERE full_name = %s", (full_name,))
    return row["id"] if row else None
