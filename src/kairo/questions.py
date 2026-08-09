"""Draft evaluation questions grounded in what the graph actually contains.

WHAT THIS IS AND IS NOT. This generates *candidates*. The final question set should be
owned by a human, and the README says so: an evaluation instrument that the system under
test also authored invites the obvious objection, and "the model wrote the questions" is
a bad answer to a panelist asking how they were chosen. The intended workflow is to
generate a surplus here, then cut, rewrite, and add by hand.

WHY GENERATE AT ALL. Questions invented without looking at the data are the worse
failure. They tend to be answerable by any system, or by none, and either way they
measure nothing. Every question below is derived from a specific row or path in the
graph, so its ground truth is a database fact rather than a matter of opinion -- which is
what makes automated scoring meaningful later.

THE FOUR CATEGORIES exist to separate capabilities that a vector baseline confuses:

  single_hop   Answerable from one document. The baseline SHOULD win or tie here, and if
               the graph loses badly something is wrong with retrieval, not with RAG.

  multi_hop    Requires joining artifacts that never co-occur in one document -- a file to
               the discussion that motivated it, via commits and PRs. This is where
               traversal earns its cost.

  temporal     Requires knowing a fact stopped being true. The specific failure of
               embedding retrieval: a superseded decision embeds identically to a live
               one, so the baseline cannot express "as of March 2019" at all.

  recurrence   Requires recognising the same problem appearing repeatedly over time.
               Needs both structure (what links these) and chronology (in what order).

A set weighted toward `temporal` and `multi_hop` would be rigging the result. Report the
per-category breakdown, and expect -- and publish -- the categories where the baseline
wins.
"""

from __future__ import annotations

import json
from pathlib import Path
from typing import Any

from rich.console import Console

from . import config, db

console = Console()


def _single_hop(repo_id: int, limit: int) -> list[dict]:
    """Questions answerable from one discussion thread.

    Ground truth is the decision row and the item it came from. Deliberately included so
    the evaluation can show where the graph does NOT help -- a comparison that only
    contains questions the graph wins is not a comparison.
    """
    rows = db.query(
        """
        SELECT d.id, d.statement, d.rationale, d.scope, i.number, i.title
        FROM decisions d
        JOIN items i ON i.id = d.source_item_id
        WHERE d.repo_id = %s AND d.rationale IS NOT NULL
        ORDER BY d.confidence DESC
        LIMIT %s
        """,
        (repo_id, limit),
    )
    return [
        {
            "category": "single_hop",
            "question": f"Why did the project decide: {r['statement']}",
            "ground_truth": r["rationale"],
            "evidence": {"kind": "decision", "decision_id": r["id"],
                         "item_number": r["number"], "item_title": r["title"]},
            "note": "answerable from one thread; baseline should do well",
        }
        for r in rows
    ]


def _multi_hop(repo_id: int, limit: int) -> list[dict]:
    """Questions requiring a file -> PR -> issue -> discussion path.

    The join is the point: the file name and the rationale never appear in the same
    document, so a retriever that only ranks documents has nothing to rank.
    """
    # Two constraints that a naive version of this query gets wrong:
    #
    #   ASSETS. A PR that changes a decision also touches screenshots, lockfiles, and
    #   .mo translations. "What decision drove the changes to image01.png" is not a
    #   multi-hop question, it is noise with a file path in it.
    #
    #   DISTINCT ON. Without it, one decision spanning 30 files yields 30 near-identical
    #   questions with identical ground truth -- which inflates the question count without
    #   adding a single new capability test. One question per decision, anchored on its
    #   least-churned file (via the ORDER BY), which is the most specific anchor available.
    rows = db.query(
        """
        SELECT DISTINCT ON (d.id)
               f.path, i.number, i.title, d.statement, d.rationale, d.id AS decision_id,
               (SELECT count(*) FROM edges e2
                 WHERE e2.repo_id = e.repo_id AND e2.dst_type = 'file'
                   AND e2.dst_id = f.id AND e2.rel = 'MODIFIED') AS file_churn
        FROM decisions d
        JOIN items i ON i.id = d.source_item_id
        JOIN edges e ON e.repo_id = d.repo_id
                    AND e.src_type = 'item' AND e.src_id = i.id
                    AND e.rel = 'MODIFIED' AND e.dst_type = 'file'
        JOIN files f ON f.id = e.dst_id
        WHERE d.repo_id = %s AND d.rationale IS NOT NULL
          AND f.path ~ '\\.(py|md)$'
          AND f.path NOT LIKE 'docs/img/%%'
          AND f.path NOT LIKE '%%/__init__.py'
        ORDER BY d.id, file_churn ASC, d.confidence DESC
        LIMIT %s
        """,
        (repo_id, limit),
    )
    return [
        {
            "category": "multi_hop",
            "question": f"What decision drove the changes to {r['path']}, and why?",
            "ground_truth": f"{r['statement']} -- {r['rationale']}",
            "evidence": {"kind": "path", "file": r["path"],
                         "item_number": r["number"], "decision_id": r["decision_id"]},
            "note": "file and rationale never co-occur in one document",
        }
        for r in rows
    ]


def _temporal(repo_id: int, limit: int) -> list[dict]:
    """Questions that require knowing a decision stopped being true.

    Each superseded decision yields a matched pair -- asked before and after the
    supersession date -- so a system that always returns the latest answer is visibly
    wrong on the first, and one that ignores time is wrong on the second. Single
    questions would let either failure hide.
    """
    rows = db.query(
        """
        SELECT d.id, d.statement, d.valid_from, d.valid_to,
               s.id AS successor_id, s.statement AS successor
        FROM decisions d
        JOIN decisions s ON s.id = d.superseded_by
        WHERE d.repo_id = %s AND d.valid_to IS NOT NULL
        ORDER BY d.valid_to
        LIMIT %s
        """,
        (repo_id, limit),
    )
    out: list[dict] = []
    for r in rows:
        changed_on = r["valid_to"].strftime("%Y-%m-%d")

        # Ask as of the MIDPOINT of the validity interval, not `valid_from`. An as-of date
        # equal to valid_from sits exactly on a boundary, where an off-by-one in interval
        # semantics (`<=` vs `<`) would still return the right row by luck. The midpoint is
        # unambiguously inside the window, so a passing answer means the interval logic is
        # actually right.
        midpoint = r["valid_from"] + (r["valid_to"] - r["valid_from"]) / 2
        out.append({
            "category": "temporal",
            "question": (
                f"As of {midpoint:%B %Y}, what was the project's position on: "
                f"{r['statement'][:70]}?"
            ),
            "ground_truth": r["statement"],
            "evidence": {"kind": "as_of", "decision_id": r["id"],
                         "as_of": midpoint.strftime("%Y-%m-%d"),
                         "valid_from": r["valid_from"].strftime("%Y-%m-%d"),
                         "superseded_on": changed_on},
            "note": "correct answer is the SUPERSEDED decision; the later one is wrong here",
        })
        out.append({
            "category": "temporal",
            "question": (
                f"Did the project's position change on: {r['statement'][:70]}? "
                "If so, what replaced it and when?"
            ),
            "ground_truth": (
                f"Yes. Replaced on {changed_on} by: {r['successor']}"
            ),
            "evidence": {"kind": "supersession", "decision_id": r["id"],
                         "successor_id": r["successor_id"], "changed_on": changed_on},
            "note": "requires representing that a fact ceased to be true",
        })
    return out


def _recurrence(repo_id: int, limit: int) -> list[dict]:
    """Questions about problems that recur across separate discussions.

    Ground truth here is a COUNT and a set of item numbers rather than a sentence,
    because "how often" and "which ones" are checkable while "is this a recurring
    problem?" is not.
    """
    rows = db.query(
        """
        SELECT f.path,
               count(DISTINCT i.id) AS n_items,
               array_agg(DISTINCT i.number ORDER BY i.number) AS numbers
        FROM edges e
        JOIN files f ON f.id = e.dst_id
        JOIN items i ON i.id = e.src_id
        WHERE e.repo_id = %s AND e.src_type = 'item'
          AND e.rel = 'MODIFIED' AND e.dst_type = 'file'
        GROUP BY f.path
        HAVING count(DISTINCT i.id) >= 4
        ORDER BY count(DISTINCT i.id) DESC
        LIMIT %s
        """,
        (repo_id, limit),
    )
    return [
        {
            "category": "recurrence",
            "question": f"Which pull requests and issues repeatedly touched {r['path']}?",
            "ground_truth": (
                f"{r['n_items']} items: "
                + ", ".join(f"#{n}" for n in r["numbers"][:12])
            ),
            "evidence": {"kind": "recurrence", "file": r["path"],
                         "item_numbers": list(r["numbers"])},
            "note": "checkable as a set, not a judgement",
        }
        for r in rows
    ]


def draft(
    repo_id: int,
    *,
    single: int = 15,
    multi: int = 15,
    temporal: int = 10,
    recurrence: int = 10,
) -> list[dict]:
    """Generate candidate questions across all four categories."""
    questions = (
        _single_hop(repo_id, single)
        + _multi_hop(repo_id, multi)
        + _temporal(repo_id, temporal)
        + _recurrence(repo_id, recurrence)
    )
    for i, q in enumerate(questions, 1):
        q["id"] = i
        q["status"] = "draft"   # a human flips this to "accepted" or deletes the row
    return questions


def write(questions: list[dict], path: Path | None = None) -> Path:
    """Write candidates to JSON for hand-editing.

    JSON rather than a database table on purpose: the question set is meant to be edited
    by a person, reviewed in a diff, and committed. Putting it in Postgres would make the
    one artifact that most needs human authorship the hardest one to touch.
    """
    path = path or config.ROOT / "eval" / "questions.draft.json"
    path.parent.mkdir(parents=True, exist_ok=True)
    path.write_text(json.dumps(questions, indent=2, default=str))
    return path
