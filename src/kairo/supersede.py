"""Detect when a later decision overturns an earlier one, and close its valid interval.

This is the half of Layer 2 that makes bitemporality mean something. Without it every
decision has `valid_to = NULL` -- the graph believes every decision it has ever seen is
still in force, including the ones that were explicitly reversed. "What did the team
believe in March 2023?" would return the March 2023 answer *and* its 2024 replacement,
which is exactly the temporal blindness the project claims to fix. Extraction alone does
not buy the claim; closing the intervals does.

THE COST PROBLEM. Asking an LLM to compare every pair of decisions is O(n^2) calls --
1000 decisions is half a million comparisons, which is neither affordable nor necessary.
Almost every pair is trivially unrelated ("use hyphens in header names" cannot supersede
"update the SQLAlchemy tutorial"). So candidates are narrowed with two cheap filters
first, and the LLM only ever adjudicates pairs that survive both:

  1. TIME. Supersession is directional. Only a strictly later decision can overturn an
     earlier one, which halves the space for free and encodes the one part of the
     relation we are certain about.

  2. SIMILARITY. Cosine distance over the decision embeddings. Two decisions that
     overturn each other are, by construction, about the same thing -- so they land near
     each other in embedding space. This is the one place vector similarity is genuinely
     the right tool: it is a recall filter feeding a precise judge, not the judge itself.

The LLM's only job is the last step, on a handful of pairs: given two decisions about the
same area, did the second actually reverse the first, or do they merely coexist? That
distinction is real and easy to get wrong -- "add auto_error=False" and "add auto_error to
security utils" are the same decision restated, not a supersession, while "drop Python
3.7" genuinely closes "support Python 3.7+".

FAILURE MODE THIS GUARDS AGAINST. An over-eager detector marks every refinement as a
supersession and quietly erases the project's history: intervals close that should have
stayed open, and a temporal query returns nothing at all for periods where plenty was
true. The prompt therefore treats "unrelated" and "coexists" as the expected answers, and
the confidence threshold is applied before anything is written.
"""

from __future__ import annotations

from typing import Any

from rich.console import Console
from rich.progress import BarColumn, Progress, SpinnerColumn, TaskProgressColumn, TextColumn

from . import db, llm

console = Console()

SYSTEM = """You judge whether one engineering decision SUPERSEDES another.

You are given an EARLIER decision and a LATER decision from the same project.

SUPERSEDES means the later decision makes the earlier one no longer true: it reverses it,
replaces it, or removes what it established.
  - "Drop Python 3.7 support" supersedes "Support Python 3.7 and up"
  - "Revert to server-side sessions" supersedes "Use JWTs instead of sessions"
  - "Move auth into middleware" supersedes "Handle auth in each route"

NOT supersedes:
  - The same decision restated, or announced again later
  - A refinement, extension, or follow-up that leaves the original in force
    ("also support scopes" does not supersede "add OAuth2")
  - Two decisions about different subsystems
  - A decision that merely mentions the same topic

Most pairs are NOT supersessions. Answering false is the common and correct outcome.
Reversing a decision is a notable event; do not infer one from topical similarity.

Return JSON:
{
  "supersedes": true or false,
  "reasoning": "one sentence",
  "confidence": 0.0 to 1.0
}"""


def _embed_missing(repo_id: int) -> int:
    """Embed decisions that don't have a vector yet.

    Kept separate from extraction so that re-running detection never re-embeds, and so a
    change of embedding model is a single backfill rather than a re-extraction.
    """
    rows = db.query(
        """SELECT id, statement, scope FROM decisions
           WHERE repo_id = %s AND embedding IS NULL""",
        (repo_id,),
    )
    if not rows:
        return 0

    # Scope is included in the embedded text because supersession is scope-local: it
    # pushes "auth" decisions away from "docs" decisions that use similar words.
    texts = [f"{r['scope'] or ''}: {r['statement']}" for r in rows]
    vectors = llm.embed(texts)

    with db.connect() as conn, conn.cursor() as cur:
        for row, vec in zip(rows, vectors):
            cur.execute(
                "UPDATE decisions SET embedding = %s WHERE id = %s",
                (str(vec), row["id"]),
            )
        conn.commit()
    return len(rows)


def _candidates(repo_id: int, *, max_distance: float, per_decision: int) -> list[dict]:
    """Later/earlier decision pairs that are close in embedding space.

    The `d2.valid_from > d1.valid_from` clause is what makes this O(n * k) instead of
    O(n^2): each decision is compared only against its nearest neighbours, and only in
    the one direction time allows.
    """
    return db.query(
        """
        SELECT * FROM (
            SELECT d1.id  AS earlier_id,
                   d1.statement AS earlier_statement,
                   d1.rationale AS earlier_rationale,
                   d1.scope AS earlier_scope,
                   d1.valid_from AS earlier_at,
                   d2.id AS later_id,
                   d2.statement AS later_statement,
                   d2.rationale AS later_rationale,
                   d2.scope AS later_scope,
                   d2.valid_from AS later_at,
                   d1.embedding <=> d2.embedding AS distance,
                   row_number() OVER (
                       PARTITION BY d2.id ORDER BY d1.embedding <=> d2.embedding
                   ) AS rank
            FROM decisions d1
            JOIN decisions d2
              ON d2.repo_id = d1.repo_id
             AND d2.valid_from > d1.valid_from
             AND d2.id <> d1.id
            WHERE d1.repo_id = %(repo_id)s
              AND d1.embedding IS NOT NULL
              AND d2.embedding IS NOT NULL
              AND d1.valid_to IS NULL
              AND d1.embedding <=> d2.embedding < %(max_distance)s
        ) ranked
        WHERE rank <= %(per_decision)s
        ORDER BY distance
        """,
        {
            "repo_id": repo_id,
            "max_distance": max_distance,
            "per_decision": per_decision,
        },
    )


def _judge(pair: dict, model: str | None = None) -> dict[str, Any] | None:
    prompt = f"""EARLIER decision ({pair['earlier_at']:%Y-%m-%d}, scope: {pair['earlier_scope']}):
{pair['earlier_statement']}
Rationale: {pair['earlier_rationale'] or '(none given)'}

LATER decision ({pair['later_at']:%Y-%m-%d}, scope: {pair['later_scope']}):
{pair['later_statement']}
Rationale: {pair['later_rationale'] or '(none given)'}

Does the LATER decision supersede the EARLIER one?"""

    try:
        result = llm.complete_json(prompt, system=SYSTEM, model=model)
    except Exception as e:
        console.print(f"  [yellow]judge failed: {type(e).__name__}[/yellow]")
        return None
    return result if isinstance(result, dict) else None


def detect(
    repo_id: int,
    *,
    max_distance: float = 0.45,
    per_decision: int = 3,
    min_confidence: float = 0.7,
    model: str | None = None,
) -> dict[str, Any]:
    """Find supersessions and close the superseded decisions' valid intervals.

    `max_distance` is a cosine-distance ceiling on candidate pairs and `per_decision`
    caps how many earlier decisions each later one is compared against -- together they
    set the LLM budget. `min_confidence` gates writes: a low-confidence supersession that
    closes an interval is worse than a missed one, because it silently deletes a period
    of history from every temporal query.
    """
    from . import config

    model = model or config.load().openai_model

    embedded = _embed_missing(repo_id)
    if embedded:
        console.print(f"  embedded {embedded} decisions ({llm.embedding_backend()})")

    pairs = _candidates(repo_id, max_distance=max_distance, per_decision=per_decision)
    console.print(f"judging {len(pairs)} candidate pairs (distance < {max_distance})")

    stats = {
        "candidates": len(pairs),
        "supersessions": 0,
        "rejected_by_judge": 0,
        "rejected_low_confidence": 0,
    }

    with db.connect() as conn, conn.cursor() as cur:
        with Progress(
            SpinnerColumn(), TextColumn("[progress.description]{task.description}"),
            BarColumn(), TaskProgressColumn(), console=console,
        ) as prog:
            task = prog.add_task("  pairs", total=len(pairs))
            for pair in pairs:
                verdict = _judge(pair, model=model)
                prog.advance(task)
                if not verdict:
                    continue

                if not verdict.get("supersedes"):
                    stats["rejected_by_judge"] += 1
                    continue

                confidence = float(verdict.get("confidence", 0.0))
                if confidence < min_confidence:
                    stats["rejected_low_confidence"] += 1
                    continue

                # Close the earlier decision's valid interval at the moment the later one
                # was made. This is the write that gives `as_of` queries something to
                # filter on.
                #
                # The `valid_to IS NULL` guard makes this idempotent and keeps the FIRST
                # supersession authoritative: if three later decisions all claim to
                # overturn one earlier decision, the earliest claim is the one that ends
                # its validity. A re-run cannot walk the interval forward.
                cur.execute(
                    """
                    UPDATE decisions
                    SET valid_to = %s, superseded_by = %s
                    WHERE id = %s AND valid_to IS NULL
                    """,
                    (pair["later_at"], pair["later_id"], pair["earlier_id"]),
                )
                if cur.rowcount == 0:
                    continue

                cur.execute(
                    """
                    INSERT INTO decision_edges
                        (repo_id, src_type, src_id, rel, dst_type, dst_id,
                         valid_from, source_span, confidence, extracted_by)
                    VALUES (%s, 'decision', %s, 'SUPERSEDES', 'decision', %s, %s, %s, %s, %s)
                    ON CONFLICT DO NOTHING
                    """,
                    (
                        repo_id, pair["later_id"], pair["earlier_id"], pair["later_at"],
                        verdict.get("reasoning"), confidence, model,
                    ),
                )
                stats["supersessions"] += 1
                conn.commit()

    return stats


def timeline(repo_id: int, scope: str | None = None) -> list[dict]:
    """Decisions with their validity intervals, for inspecting what detection did."""
    return db.query(
        """
        SELECT d.id, d.statement, d.scope, d.valid_from, d.valid_to,
               s.statement AS superseded_by_statement
        FROM decisions d
        LEFT JOIN decisions s ON s.id = d.superseded_by
        WHERE d.repo_id = %s AND (%s::text IS NULL OR d.scope = %s)
        ORDER BY d.valid_from
        """,
        (repo_id, scope, scope),
    )


def as_of(repo_id: int, when, scope: str | None = None) -> list[dict]:
    """What the project believed at a point in time.

    The query the whole bitemporal design exists to serve, and the one a vector store
    cannot express: a decision counts as believed at `when` if it was made at or before
    that moment and had not yet been superseded. Note this filters on VALID time, not
    ingestion time -- rows written today can be true of 2019.
    """
    return db.query(
        """
        SELECT id, statement, rationale, scope, valid_from, valid_to, confidence
        FROM decisions
        WHERE repo_id = %s
          AND valid_from <= %s
          AND (valid_to IS NULL OR valid_to > %s)
          AND (%s::text IS NULL OR scope = %s)
        ORDER BY valid_from DESC
        """,
        (repo_id, when, when, scope, scope),
    )
