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
