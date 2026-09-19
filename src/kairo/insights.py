"""Read-only product insights built on KAIRO's deterministic graph.

These functions deliberately produce evidence, not opaque scores.  The web application
can therefore show a useful X-Ray and PR impact brief even before an LLM is involved.
"""

from __future__ import annotations

from typing import Any

from . import db, graph


def repositories() -> list[dict[str, Any]]:
    return db.query(
        """SELECT r.id, r.full_name, r.ingested_at,
                  count(DISTINCT i.id) AS items, count(DISTINCT f.id) AS files,
                  count(DISTINCT d.id) AS decisions
           FROM repos r
           LEFT JOIN items i ON i.repo_id = r.id
           LEFT JOIN files f ON f.repo_id = r.id
           LEFT JOIN decisions d ON d.repo_id = r.id
           GROUP BY r.id ORDER BY r.ingested_at DESC"""
    )


def overview(repo_id: int) -> dict[str, Any]:
    row = db.query_one(
        """SELECT r.id, r.full_name, r.ingested_at,
                  count(DISTINCT i.id) AS items,
                  count(DISTINCT i.id) FILTER (WHERE i.state = 'open') AS open_items,
                  count(DISTINCT i.id) FILTER (WHERE i.kind = 'pr' AND i.state = 'open') AS open_prs,
                  count(DISTINCT f.id) AS files, count(DISTINCT d.id) AS decisions,
                  count(DISTINCT d.id) FILTER (WHERE d.valid_to IS NULL) AS active_decisions
           FROM repos r
           LEFT JOIN items i ON i.repo_id = r.id
           LEFT JOIN files f ON f.repo_id = r.id
           LEFT JOIN decisions d ON d.repo_id = r.id
           WHERE r.id = %s GROUP BY r.id""",
        (repo_id,),
    )
    if not row:
        raise LookupError("Repository not found")
    row["hotspots"] = xray(repo_id, limit=5)
    row["recent_items"] = db.query(
        """SELECT number, kind, title, state, created_at FROM items
           WHERE repo_id = %s ORDER BY created_at DESC LIMIT 6""", (repo_id,)
    )
    return row


def xray(repo_id: int, *, limit: int = 20) -> list[dict[str, Any]]:
    """Rank files by explainable fragility signals.

    This is a conservative first X-Ray: change volume is real evidence; the score is a
    prioritisation hint, not a claim that a file contains a defect.
    """
    return db.query(
        """WITH activity AS (
             SELECT f.id, f.path,
                    count(e.id) AS changes,
                    count(DISTINCT c.author_id) FILTER (WHERE c.author_id IS NOT NULL) AS authors,
                    count(DISTINCT e.src_id) FILTER (WHERE e.src_type = 'item') AS pr_changes
             FROM files f
             LEFT JOIN edges e ON e.repo_id = f.repo_id
               AND e.dst_type = 'file' AND e.dst_id = f.id AND e.rel = 'MODIFIED'
             LEFT JOIN commits c ON c.id = e.src_id AND e.src_type = 'commit'
             WHERE f.repo_id = %s
             GROUP BY f.id, f.path
           ), maximum AS (SELECT greatest(max(changes), 1) AS changes FROM activity)
           SELECT a.path, a.changes, a.pr_changes, a.authors,
                  round((70.0 * a.changes / maximum.changes +
                         CASE WHEN a.authors <= 1 THEN 30 ELSE 0 END)::numeric, 0) AS risk_score,
                  CASE WHEN a.authors <= 1 THEN 'knowledge concentration'
                       WHEN a.changes > maximum.changes * .6 THEN 'high change volume'
                       ELSE 'monitor change history' END AS signal
           FROM activity a CROSS JOIN maximum
           WHERE a.changes > 0
           ORDER BY risk_score DESC, a.changes DESC LIMIT %s""",
        (repo_id, limit),
    )


def decisions(repo_id: int, *, limit: int = 20) -> list[dict[str, Any]]:
    return db.query(
        """SELECT d.id, d.statement, d.rationale, d.scope, d.valid_from, d.valid_to,
                  d.confidence, i.number, i.kind, i.title
           FROM decisions d LEFT JOIN items i ON i.id = d.source_item_id
           WHERE d.repo_id = %s
           ORDER BY d.valid_to NULLS FIRST, d.valid_from DESC LIMIT %s""",
        (repo_id, limit),
    )


def impact_scan(repo_id: int, paths: list[str]) -> dict[str, Any]:
    """Produce a deterministic, source-linked pre-merge impact report for paths."""
    findings: list[dict[str, Any]] = []
    all_decisions: dict[int, dict[str, Any]] = {}
    total_changes = 0
    concentrated = 0
    for requested in paths:
        matches = graph.find_file(repo_id, requested)
        if not matches:
            findings.append({"path": requested, "found": False, "message": "Not present in ingested history."})
            continue
        file = matches[0]
        metrics = db.query_one(
            """SELECT count(*) AS changes,
                      count(DISTINCT c.author_id) FILTER (WHERE c.author_id IS NOT NULL) AS authors
               FROM edges e LEFT JOIN commits c ON c.id = e.src_id AND e.src_type = 'commit'
               WHERE e.repo_id = %s AND e.dst_type = 'file' AND e.dst_id = %s
                 AND e.rel = 'MODIFIED'""",
            (repo_id, file["id"]),
        ) or {"changes": 0, "authors": 0}
        linked = db.query(
            """SELECT DISTINCT d.id, d.statement, d.scope, d.valid_to, d.confidence,
                      i.number, i.title
               FROM edges e JOIN decisions d ON d.repo_id = e.repo_id
                    AND d.source_item_id = e.src_id
               LEFT JOIN items i ON i.id = d.source_item_id
               WHERE e.repo_id = %s AND e.dst_type = 'file' AND e.dst_id = %s
                 AND e.src_type = 'item' AND e.rel = 'MODIFIED'""",
            (repo_id, file["id"]),
        )
        for decision in linked:
            all_decisions[decision["id"]] = decision
        total_changes += metrics["changes"]
        concentrated += int(metrics["authors"] <= 1 and metrics["changes"] > 0)
        findings.append({"path": file["path"], "found": True, **metrics, "decisions": linked})

    score = min(100, total_changes * 3 + len(all_decisions) * 15 + concentrated * 15)
    level = "high" if score >= 55 else "medium" if score >= 25 else "low"
    recommendations = ["Review the linked decision evidence before merging."] if all_decisions else []
    if concentrated:
        recommendations.append("Request review from a contributor familiar with the affected module.")
    if total_changes >= 12:
        recommendations.append("Run focused regression tests: this area has substantial change history.")
    if not recommendations:
        recommendations.append("No strong historical risk signal was found; run the normal test suite.")
    return {"risk_score": score, "risk_level": level, "files": findings,
            "decisions": list(all_decisions.values()), "recommendations": recommendations}
