"""The GraphRAG arm: retrieve by traversal and validity, not by similarity alone.

This is what the baseline is measured against. The two systems are given the same corpus,
the same embedding model, and the same generator, so any difference between them comes
from *how context is selected* -- which is the only thing the research claim is about.

Three retrieval modes, chosen by what the question needs:

  ANCHORED. The question names a file. Walk the graph from it (file -> commits/PRs ->
  the discussions and decisions attached to them) and return what is structurally
  connected. This is the mode a chunk retriever cannot imitate: it returns a decision
  whose text may share no vocabulary at all with the file's name.

  AS-OF. The question names a time. Filter decisions by validity interval, so a
  superseded decision is returned when the question is about the period it governed and
  withheld when it is not. There is no similarity threshold that expresses this.

  SEMANTIC. No anchor, no date. Fall back to embedding similarity over decisions --
  deliberately the same tool the baseline uses. When the question offers no structure to
  exploit, honesty requires admitting the graph has no special advantage, and the
  evaluation should show the two arms converging here.

WHY DECISIONS AND NOT RAW TEXT. The graph arm answers from Layer 2 rows, which are
compressed (one sentence plus rationale, versus a 1200-character chunk). That is an
advantage worth naming explicitly: the same token budget holds far more distinct
decisions than chunks. It is also a risk -- extraction can drop or distort a decision,
while a chunk is verbatim. Both arms therefore carry provenance in their output so a
wrong answer can be traced to whichever stage produced it.
"""

from __future__ import annotations

import re
from typing import Any

from . import db, graph, llm

# A file path mentioned in a question: "why does fastapi/security/oauth2.py ...".
# Requires a slash or a known code extension so ordinary prose ("the auth layer") does
# not get mistaken for a path.
_PATH_RE = re.compile(r"[\w./-]+\.(?:py|js|ts|md|yml|yaml|toml|cfg|txt|json)\b")

# Dates the question is asking "as of". Matches "March 2019", "2019-03", "in 2019".
_MONTHS = ("january february march april may june july august september october "
           "november december").split()
_DATE_RE = re.compile(
    r"\b(?:(" + "|".join(_MONTHS) + r")\s+(\d{4})|(\d{4})-(\d{2})|as of\s+(\d{4}))\b",
    re.IGNORECASE,
)


def parse_anchor(question: str) -> str | None:
    m = _PATH_RE.search(question)
    return m.group(0) if m else None


def parse_as_of(question: str) -> str | None:
    """Extract an 'as of' date, if the question has one.

    Deliberately conservative: a false positive silently narrows retrieval to a time
    window the asker never intended, which looks like the graph missing information
    rather than the parser overreaching.
    """
    m = _DATE_RE.search(question)
    if not m:
        return None
    if m.group(1):
        month = _MONTHS.index(m.group(1).lower()) + 1
        return f"{m.group(2)}-{month:02d}-01"
    if m.group(3):
        return f"{m.group(3)}-{m.group(4)}-01"
    if m.group(5):
        return f"{m.group(5)}-01-01"
    return None


def _decisions_semantic(repo_id: int, question: str, k: int) -> list[dict]:
    vector = llm.embed([question])[0]
    return db.query(
        """
        SELECT d.id, d.statement, d.rationale, d.scope, d.valid_from, d.valid_to,
               d.confidence, i.number, i.title,
               d.embedding <=> %s::vector AS distance
        FROM decisions d
        LEFT JOIN items i ON i.id = d.source_item_id
        WHERE d.repo_id = %s AND d.embedding IS NOT NULL
        ORDER BY d.embedding <=> %s::vector
        LIMIT %s
        """,
        (str(vector), repo_id, str(vector), k),
    )


def _decisions_for_file(repo_id: int, path: str, k: int) -> list[dict]:
    """Decisions reachable from a file through the deterministic graph.

    The join is the whole argument for this project: `edges` carries file -> item links
    built from GitHub facts, and `decisions` hangs off those items. Neither table alone
    can answer "why did this file change", and no amount of embedding similarity
    reconstructs the link.
    """
    # find_file returns ranked candidates, best first -- a question says "oauth2.py",
    # the graph stores "fastapi/security/oauth2.py". Taking [0] mirrors the `history`
    # command rather than inventing a second resolution rule.
    matches = graph.find_file(repo_id, path)
    if not matches:
        return []
    resolved = matches[0]
    return db.query(
        """
        SELECT DISTINCT d.id, d.statement, d.rationale, d.scope, d.valid_from,
               d.valid_to, d.confidence, i.number, i.title
        FROM edges e
        JOIN decisions d ON d.source_item_id = e.src_id AND d.repo_id = e.repo_id
        LEFT JOIN items i ON i.id = d.source_item_id
        WHERE e.repo_id = %s AND e.src_type = 'item'
          AND e.rel = 'MODIFIED' AND e.dst_type = 'file' AND e.dst_id = %s
        ORDER BY d.confidence DESC
        LIMIT %s
        """,
        (repo_id, resolved["id"], k),
    )


def _decisions_as_of(repo_id: int, when: str, question: str, k: int) -> list[dict]:
    """Decisions in force at `when`, ranked by relevance to the question.

    The time filter and the similarity ranking have to COMPOSE. An earlier version called
    `supersede.as_of()` and sliced the first k, but that function orders by `valid_from
    DESC` -- so a temporal question got the k most *recent* decisions before the cutoff,
    whatever they were about. Asking about async endpoints in September 2019 returned
    decisions on default parameter values and 204 responses, and the arm reported "the
    decisions do not contain this information" while the answer sat further down the list.

    Filtering to the window and *then* ranking within it is the whole point: validity is
    the thing embeddings cannot express, relevance is the thing they express well, and
    each is applied where it is actually good.
    """
    vector = llm.embed([question])[0]
    return db.query(
        """
        SELECT d.id, d.statement, d.rationale, d.scope, d.valid_from, d.valid_to,
               d.confidence, i.number, i.title,
               d.embedding <=> %s::vector AS distance
        FROM decisions d
        LEFT JOIN items i ON i.id = d.source_item_id
        WHERE d.repo_id = %s
          AND d.embedding IS NOT NULL
          AND d.valid_from <= %s
          AND (d.valid_to IS NULL OR d.valid_to > %s)
        ORDER BY d.embedding <=> %s::vector
        LIMIT %s
        """,
        (str(vector), repo_id, when, when, str(vector), k),
    )


def retrieve(repo_id: int, question: str, *, k: int = 8) -> dict[str, Any]:
    """Select context for a question, recording which mode was used and why.

    The mode is returned rather than hidden because the evaluation needs to report it:
    "the graph wins on temporal questions" means little without showing that those
    questions actually took the as-of path.
    """
    anchor = parse_anchor(question)
    as_of_date = parse_as_of(question)
    modes: list[str] = []
    rows: list[dict] = []

    if anchor:
        rows = _decisions_for_file(repo_id, anchor, k)
        if rows:
            modes.append("anchored")

    if as_of_date:
        temporal = _decisions_as_of(repo_id, as_of_date, question, k)
        if temporal:
            modes.append("as_of")
            seen = {r["id"] for r in rows}
            rows += [r for r in temporal if r["id"] not in seen]

    if not rows:
        rows = _decisions_semantic(repo_id, question, k)
        modes.append("semantic")

    return {"decisions": rows[:k], "modes": modes,
            "anchor": anchor, "as_of": as_of_date}


def answer(repo_id: int, question: str, *, k: int = 8, model: str | None = None) -> dict[str, Any]:
    """Retrieve by structure, then generate. The graph arm of the comparison."""
    result = retrieve(repo_id, question, k=k)
    rows = result["decisions"]
    if not rows:
        return {"answer": "No relevant decisions found.", **result, "context_chars": 0}

    lines = []
    for r in rows:
        window = f"{r['valid_from']:%Y-%m}"
        if r.get("valid_to"):
            window += f" to {r['valid_to']:%Y-%m} (later superseded)"
        else:
            window += " onwards (still in force)"
        lines.append(
            f"- DECISION [{window}] {r['statement']}\n"
            f"  Rationale: {r.get('rationale') or 'not stated'}\n"
            f"  Source: #{r.get('number')} {r.get('title') or ''}"
        )
    context = "\n".join(lines)

    prompt = (
        f"Engineering decisions from the project's history:\n\n{context}\n\n"
        f"Question: {question}\n\n"
        "Answer using only the decisions above. Each carries the period it was in "
        "force -- respect it: if the question asks about a specific time, answer with "
        "what was true then, not with what is true now. If the decisions do not "
        "contain the answer, say so."
    )
    return {
        "answer": llm.complete(prompt, model=model),
        **result,
        "context_chars": len(context),
    }
