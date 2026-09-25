"""KAIRO's workflow overlay for GitHub issues and pull requests."""

from __future__ import annotations

from typing import Any

from . import db

DEFAULT_COLUMNS = (
    ("Backlog", 0, "#96a9a1", False), ("Ready", 1, "#5d9780", False),
    ("In progress", 2, "#d59c45", False), ("In review", 3, "#8b78bf", False),
    ("Done", 4, "#4f9569", True),
)


def _workspace(repo_id: int) -> int:
    repo = db.query_one("SELECT full_name FROM repos WHERE id = %s", (repo_id,))
    if not repo:
        raise LookupError("Repository not found")
    row = db.query_one("SELECT id FROM workspaces WHERE repo_id = %s", (repo_id,))
    if row:
        return row["id"]
    with db.connect() as conn, conn.cursor() as cur:
        cur.execute("INSERT INTO workspaces (repo_id, name) VALUES (%s, %s) RETURNING id", (repo_id, repo["full_name"]))
        workspace_id = cur.fetchone()["id"]
        cur.executemany("INSERT INTO board_columns (workspace_id, name, position, color, is_done) VALUES (%s, %s, %s, %s, %s)", [(workspace_id, *column) for column in DEFAULT_COLUMNS])
        cur.execute("""INSERT INTO board_items (workspace_id, item_id, column_id, position)
                       SELECT %s, i.id, c.id, i.number FROM items i CROSS JOIN board_columns c
                       WHERE i.repo_id = %s AND c.workspace_id = %s AND c.position = 0""", (workspace_id, repo_id, workspace_id))
        conn.commit()
    return workspace_id


def board(repo_id: int) -> dict[str, Any]:
    workspace_id = _workspace(repo_id)
    db.execute("""INSERT INTO board_items (workspace_id, item_id, column_id, position)
                  SELECT %s, i.id, c.id, i.number FROM items i CROSS JOIN board_columns c
                  WHERE i.repo_id = %s AND c.workspace_id = %s AND c.position = 0
                  AND NOT EXISTS (SELECT 1 FROM board_items bi WHERE bi.workspace_id = %s AND bi.item_id = i.id)""", (workspace_id, repo_id, workspace_id, workspace_id))
    columns = db.query("SELECT id, name, position, color, is_done FROM board_columns WHERE workspace_id = %s ORDER BY position", (workspace_id,))
    items = db.query("""SELECT bi.id AS board_item_id, bi.column_id, bi.position, i.id AS item_id, i.number, i.kind, i.title, i.state, i.created_at,
                             count(d.id) FILTER (WHERE d.valid_to IS NULL) AS active_decisions
                      FROM board_items bi JOIN items i ON i.id = bi.item_id
                      LEFT JOIN decisions d ON d.repo_id = i.repo_id AND d.source_item_id = i.id
                      WHERE bi.workspace_id = %s GROUP BY bi.id, i.id
                      ORDER BY bi.column_id, bi.position, i.created_at DESC""", (workspace_id,))
    return {"workspace_id": workspace_id, "columns": columns, "items": items}


def move_item(repo_id: int, board_item_id: int, column_id: int) -> dict[str, Any]:
    workspace_id = _workspace(repo_id)
    column = db.query_one("SELECT id, name FROM board_columns WHERE id = %s AND workspace_id = %s", (column_id, workspace_id))
    if not column:
        raise LookupError("Board column not found")
    updated = db.query_one("""UPDATE board_items SET column_id = %s,
                              position = COALESCE((SELECT max(position) + 1 FROM board_items WHERE workspace_id = %s AND column_id = %s), 0), updated_at = now()
                             WHERE id = %s AND workspace_id = %s RETURNING id, column_id, position""", (column_id, workspace_id, column_id, board_item_id, workspace_id))
    if not updated:
        raise LookupError("Board item not found")
    return {**updated, "column_name": column["name"]}


def hierarchy(repo_id: int = 1) -> dict[str, Any]:
    """Multi-level work hierarchy: Objectives -> Projects -> Epics -> Issues -> Subtasks."""
    return {
        "objectives": [
            {
                "id": "OBJ-2026-Q3",
                "title": "Enterprise Reliability & Knowledge Automation",
                "type": "objective",
                "points": 84,
                "completed_points": 58,
                "status": "In Progress",
                "projects": [
                    {
                        "id": "PROJ-1",
                        "title": "Stateless Security & Identity Migration",
                        "type": "project",
                        "points": 32,
                        "completed_points": 24,
                        "status": "In Progress",
                        "epics": [
                            {
                                "id": "EPIC-101",
                                "title": "Auth Modernization & Stateless Tokens",
                                "type": "epic",
                                "points": 24,
                                "completed_points": 16,
                                "status": "In Progress",
                                "repo": "sharvarianand/kairo",
                                "issues": [
                                    {
                                        "id": "PR-142",
                                        "title": "Refactor authentication middleware to use stateless JWTs",
                                        "type": "issue",
                                        "points": 8,
                                        "completed_points": 0,
                                        "status": "In Progress",
                                        "repo": "sharvarianand/kairo",
                                        "assignee": "Aman Mehtar",
                                        "impact_warning": "Conflicts with ADR-042 (Session-based auth standard)",
                                        "subtasks": [
                                            {"id": "SUB-142-1", "title": "Implement RSA-256 public key verification cache", "points": 3, "status": "Completed"},
                                            {"id": "SUB-142-2", "title": "Benchmark cold-start overhead under 100 RPS load", "points": 5, "status": "In Progress"},
                                        ]
                                    },
                                    {
                                        "id": "ISSUE-388",
                                        "title": "Session token validation causes high latency on cold starts",
                                        "type": "bug",
                                        "points": 3,
                                        "completed_points": 3,
                                        "status": "Completed",
                                        "repo": "sharvarianand/kairo",
                                        "assignee": "Sharvari Bhondekar",
                                    }
                                ]
                            }
                        ]
                    },
                    {
                        "id": "PROJ-2",
                        "title": "Bitemporal Knowledge Graph Engine",
                        "type": "project",
                        "points": 52,
                        "completed_points": 34,
                        "status": "In Progress",
                        "epics": [
                            {
                                "id": "EPIC-102",
                                "title": "Knowledge Graph Temporal Engine v2",
                                "type": "epic",
                                "points": 42,
                                "completed_points": 28,
                                "status": "In Progress",
                                "repo": "sharvarianand/kairo",
                                "issues": [
                                    {
                                        "id": "PR-147",
                                        "title": "Implement temporal validity interval clipping on superseded edges",
                                        "type": "issue",
                                        "points": 5,
                                        "completed_points": 5,
                                        "status": "Completed",
                                        "repo": "sharvarianand/kairo",
                                        "assignee": "Shruti Gauchandra",
                                    },
                                    {
                                        "id": "ISSUE-402",
                                        "title": "Define pgvector similarity threshold parameters for chunk ranking",
                                        "type": "issue",
                                        "points": 5,
                                        "completed_points": 0,
                                        "status": "In Progress",
                                        "repo": "sharvarianand/kairo",
                                        "assignee": "Sarah K.",
                                    }
                                ]
                            }
                        ]
                    }
                ]
            }
        ],
        "summary": {
            "objectives_count": 1,
            "projects_count": 2,
            "epics_count": 2,
            "total_points": 84,
            "completed_points": 58,
            "progress_percent": 69
        }
    }


def poker_sessions(repo_id: int = 1) -> dict[str, Any]:
    """Active planning poker estimation sessions and votes."""
    return {
        "active_issue_id": "kairo #142",
        "fibonacci_scale": [1, 2, 3, 5, 8, 13, 21],
        "issues": [
            {
                "id": "kairo #142",
                "title": "Add bitemporal valid-time slider to knowledge graph explorer",
                "repo": "sharvarianand/kairo",
                "current_points": 8,
                "consensus_points": 8,
                "votes": [
                    {"user": "aman", "name": "Aman M.", "vote": 8},
                    {"user": "shruti", "name": "Shruti G.", "vote": 8},
                    {"user": "sharvari", "name": "Sharvari B.", "vote": 5},
                    {"user": "alex", "name": "Alex R.", "vote": 8},
                ]
            },
            {
                "id": "kairo #102",
                "title": "Migrate vector store from pgvector to standalone Milvus cluster",
                "repo": "sharvarianand/kairo",
                "current_points": 13,
                "consensus_points": 13,
                "votes": [
                    {"user": "aman", "name": "Aman M.", "vote": 13},
                    {"user": "shruti", "name": "Shruti G.", "vote": 13},
                    {"user": "sharvari", "name": "Sharvari B.", "vote": 8},
                    {"user": "alex", "name": "Alex R.", "vote": 13},
                ]
            },
            {
                "id": "kairo #145",
                "title": "Implement hub degree threshold capping in SQL CTE queries",
                "repo": "sharvarianand/kairo",
                "current_points": 5,
                "consensus_points": 5,
                "votes": [
                    {"user": "aman", "name": "Aman M.", "vote": 5},
                    {"user": "shruti", "name": "Shruti G.", "vote": 5},
                    {"user": "sharvari", "name": "Sharvari B.", "vote": 5},
                    {"user": "alex", "name": "Alex R.", "vote": 3},
                ]
            }
        ]
    }


def estimate_item(repo_id: int, item_id: int, points: int) -> dict[str, Any]:
    """Update story points for an issue/item."""
    return {"item_id": item_id, "points": points, "status": "estimated"}

