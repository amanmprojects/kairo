"""Layer 2: extract engineering decisions from prose.

This is the only place an LLM writes to the graph, and everything about the design is
shaped by the fact that it can be wrong.

Three rules, enforced by the schema:

  1. PROVENANCE OR IT DIDN'T HAPPEN. Every decision stores `source_span` -- the verbatim
     text it was extracted from -- plus the model that produced it and a confidence. A
     claim that cannot point at its evidence is indistinguishable from a hallucination,
     and the UI is expected to show the span so a human can disagree with it.

  2. QUOTES MUST BE REAL. The extractor is asked for a verbatim quote, and any decision
     whose quote does not actually appear in the source text is DISCARDED. This is a
     cheap, mechanical hallucination filter: a model inventing a decision will usually
     also invent its evidence, and inventing a span that survives an exact-substring
     check against the source is much harder than inventing a plausible sentence.

  3. NEVER MIX WITH LAYER 1. These rows go to `decisions` / `decision_edges`, never to
     `edges`. A traversal over facts must not silently pick up guesses.

What counts as a decision: a choice between alternatives with reasoning attached.
"We switched to JWT because sessions don't scale across our workers" is a decision.
"Fixed a typo" is not. The prompt leans hard on this distinction because the failure mode
is a model that dutifully finds a "decision" in every issue it is shown.
"""

from __future__ import annotations

import json
from typing import Any

from rich.console import Console
from rich.progress import BarColumn, Progress, SpinnerColumn, TaskProgressColumn, TextColumn

from . import db, llm

console = Console()

# Closed vocabulary for `scope`.
#
# Free text does not work here. Asked for "e.g. auth, routing, deps", the model returns
# "FastAPI framework: class-based views feature" and "API key header naming / Nginx
# deployment" -- accurate descriptions, but every one is unique, so scope groups nothing.
# That breaks the two things scope exists for: the Decision Drift Index, which measures
# how much churn an AREA has seen, and supersession candidate filtering, which needs two
# decisions about the same area to be recognisably about the same area.
#
# A short closed list trades descriptive precision for the ability to aggregate, which is
# the entire point of the field. "other" is deliberate -- forcing a bad fit is worse than
# admitting the taxonomy missed.
SCOPES = [
    "auth", "routing", "validation", "serialization", "deps", "testing",
    "docs", "performance", "deployment", "api-design", "tooling", "other",
]

SYSTEM = f"""You extract engineering decisions from software project discussions.

A DECISION is a choice between alternatives, with reasoning. Examples:
- "We'll use JWTs instead of server-side sessions because sessions don't scale across workers"
- "Dropping Python 3.7 support -- maintaining the compat shims costs more than it's worth"
- "Reverting the async rewrite; the latency win didn't materialise under real load"

NOT decisions:
- Bug reports, feature requests, questions
- Status updates ("this is now merged")
- Cosmetic changes, typo fixes, dependency bumps
- Vague intentions with no alternative considered ("we should improve performance")

Most discussions contain NO decision. Returning an empty list is the correct and common
answer. Do not manufacture a decision to seem useful.

WHOSE DECISION. Extract only decisions about THIS PROJECT, made by the people who
maintain it. Discussion threads are full of users describing choices in their OWN
codebases, and those are not project decisions no matter how clearly they are stated:

- "I switched from SQLAlchemy to PonyORM and it works better for me"  -> NOT a decision
- "We'll keep SQLAlchemy in the tutorial; Pony doesn't cover enough"  -> a decision
- "In my app I just subclass the router"                              -> NOT a decision

The tell is authority and subject. First-person-singular reports about someone's own
application ("I decided", "I went with", "in my project") are user experience reports.
A project decision governs the project's own code, docs, or policy. If you cannot tell
who is deciding or what it binds, do not extract it.

Return JSON:
{{
  "decisions": [
    {{
      "statement": "the choice made, one sentence, in your own words",
      "rationale": "why, as stated in the discussion (null if not stated)",
      "scope": "EXACTLY ONE of: {', '.join(SCOPES)}",
      "quote": "VERBATIM text from the discussion that shows this decision -- copy it exactly, do not paraphrase",
      "confidence": 0.0 to 1.0
    }}
  ]
}}

"scope" must be one of the listed values, copied exactly. Use "other" if none fit; do not
invent a new one.

The "quote" MUST appear character-for-character in the text you were given. A decision
with an inexact quote will be discarded."""


def _format_thread(item: dict, comments: list[dict]) -> str:
    parts = [
        f"[{item['kind'].upper()} #{item['number']}] {item['title']}",
        f"opened by {item.get('author_login') or 'unknown'} on {item['created_at']:%Y-%m-%d}",
        "",
        (item.get("body") or "")[:4000],
    ]
    for c in comments[:30]:
        parts.append("")
        parts.append(f"--- comment by {c.get('author_login') or 'unknown'} on {c['created_at']:%Y-%m-%d} ---")
        parts.append((c["body"] or "")[:2000])
    return "\n".join(parts)


def _threads(repo_id: int, *, min_comments: int, limit: int | None) -> list[dict]:
    """Candidate discussions, richest first.

    Filtering by comment count is a deliberate cost control: a thread nobody replied to
    rarely contains a debated decision, and extraction is the expensive pass. Ordering by
    comment count puts the most argument-dense threads first, so a truncated run still
    sees the discussions most likely to contain rationale.
    """
    return db.query(
        """
        SELECT i.id, i.number, i.kind, i.title, i.body, i.created_at,
               p.login AS author_login,
               count(c.id) AS n_comments
        FROM items i
        LEFT JOIN people p ON p.id = i.author_id
        LEFT JOIN comments c ON c.item_id = i.id
        WHERE i.repo_id = %s
        GROUP BY i.id, p.login
        HAVING count(c.id) >= %s
        ORDER BY count(c.id) DESC
        LIMIT %s
        """,
        (repo_id, min_comments, limit if limit is not None else 100000),
    )


def _comments_for(item_id: int) -> list[dict]:
    return db.query(
        """SELECT c.body, c.created_at, p.login AS author_login
           FROM comments c LEFT JOIN people p ON p.id = c.author_id
           WHERE c.item_id = %s ORDER BY c.created_at""",
        (item_id,),
    )


def _normalise(text: str) -> str:
    """Collapse whitespace for quote verification.

    Models reliably reproduce wording but not line breaks or indentation, especially from
    markdown. Comparing on collapsed whitespace keeps the check strict about CONTENT
    while tolerating formatting drift -- otherwise the filter rejects correct extractions
    for cosmetic reasons.
    """
    return " ".join(text.split()).lower()


def _coerce_scope(value: Any) -> str:
    """Force `scope` into the closed vocabulary.

    The prompt asks for one of `SCOPES`, but a prompt is a request, not a constraint, and
    a single stray value silently creates a group of one. Unrecognised values collapse to
    "other" rather than being stored verbatim -- a decision landing in the wrong bucket is
    recoverable, a vocabulary that quietly grows back into free text is not.
    """
    if not isinstance(value, str):
        return "other"
    v = value.strip().lower()
    if v in SCOPES:
        return v
    # Models often answer with a listed scope wrapped in extra words ("auth/security").
    for scope in SCOPES:
        if scope != "other" and scope in v:
            return scope
    return "other"


def extract_item(
    repo_id: int, item: dict, model: str | None = None
) -> tuple[list[dict], int]:
    """Extract decisions from one discussion.

    Returns (verified decisions, count rejected by quote verification). The rejection
    count is worth surfacing: it is the only direct measurement of how often the model
    fabricates evidence, and a rate near zero means the filter is not being tested.
    """
    comments = _comments_for(item["id"])
    thread = _format_thread(item, comments)

    if len(thread) < 200:
        return [], 0

    try:
        result = llm.complete_json(thread, system=SYSTEM, model=model)
    except Exception as e:
        console.print(f"  [yellow]#{item['number']}: extraction failed: {type(e).__name__}[/yellow]")
        return [], 0

    raw = result.get("decisions", []) if isinstance(result, dict) else []
    haystack = _normalise(thread)
    verified: list[dict] = []
    rejected = 0

    for d in raw:
        if not isinstance(d, dict) or not d.get("statement"):
            rejected += 1
            continue
        quote = (d.get("quote") or "").strip()
        if not quote:
            rejected += 1
            continue
        # The hallucination filter. A model that invents a decision usually invents its
        # evidence too, and an invented span rarely survives exact substring matching.
        if _normalise(quote) not in haystack:
            rejected += 1
            continue
        verified.append(
            {
                "statement": d["statement"],
                "rationale": d.get("rationale"),
                "scope": _coerce_scope(d.get("scope")),
                "quote": quote,
                "confidence": float(d.get("confidence", 0.5)),
            }
        )

    return verified, rejected


def _store(cur, repo_id: int, item: dict, decisions: list[dict], model: str) -> int:
    stored = 0
    for d in decisions:
        # Idempotency. Extraction gets re-run over overlapping slices constantly during
        # development (different min_comments, different limits), and without this guard
        # each re-run appends a second copy of every decision it has already found. The
        # damage is not cosmetic: duplicates inflate the Decision Drift Index, and the
        # supersession detector will happily compare a decision against its own clone.
        #
        # (source_item_id, source_span) is the natural key -- the same claim drawn from
        # the same evidence in the same thread is the same decision. Not a UNIQUE
        # constraint on the table because a genuine re-extraction with a better model
        # should be able to replace rows, which `extracted_by` makes possible.
        cur.execute(
            """SELECT 1 FROM decisions
               WHERE repo_id = %s AND source_item_id = %s AND source_span = %s
                 AND extracted_by = %s""",
            (repo_id, item["id"], d["quote"], model),
        )
        if cur.fetchone():
            continue

        cur.execute(
            """
            INSERT INTO decisions
                (repo_id, statement, rationale, scope, valid_from, source_item_id,
                 source_span, confidence, extracted_by)
            VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s)
            RETURNING id
            """,
            (
                repo_id, d["statement"], d["rationale"], d["scope"],
                # valid_from is the discussion date: when the team made the call, not
                # when KAIRO read it. `ingested_at` defaults to now() and captures the
                # other axis.
                item["created_at"], item["id"], d["quote"],
                d["confidence"], model,
            ),
        )
        decision_id = cur.fetchone()["id"]
        cur.execute(
            """
            INSERT INTO decision_edges
                (repo_id, src_type, src_id, rel, dst_type, dst_id,
                 valid_from, source_span, confidence, extracted_by)
            VALUES (%s, 'decision', %s, 'DECIDED_IN', 'item', %s, %s, %s, %s, %s)
            ON CONFLICT DO NOTHING
            """,
            (repo_id, decision_id, item["id"], item["created_at"],
             d["quote"], d["confidence"], model),
        )
        stored += 1
    return stored


def extract(
    repo_id: int,
    *,
    min_comments: int = 3,
    limit: int | None = None,
    model: str | None = None,
) -> dict[str, int]:
    """Run extraction over a repo's discussions."""
    from . import config

    model = model or config.load().openai_model
    threads = _threads(repo_id, min_comments=min_comments, limit=limit)
    console.print(f"extracting from {len(threads)} discussions (>= {min_comments} comments)")

    stats = {"threads": len(threads), "with_decisions": 0, "decisions": 0, "rejected": 0}

    with db.connect() as conn, conn.cursor() as cur:
        with Progress(
            SpinnerColumn(), TextColumn("[progress.description]{task.description}"),
            BarColumn(), TaskProgressColumn(), console=console,
        ) as prog:
            task = prog.add_task("  threads", total=len(threads))
            for item in threads:
                decisions, rejected = extract_item(repo_id, item, model=model)
                stats["rejected"] += rejected
                if decisions:
                    stats["with_decisions"] += 1
                    stats["decisions"] += _store(cur, repo_id, item, decisions, model)
                    conn.commit()
                prog.advance(task)

    return stats
