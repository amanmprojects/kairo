"""Database access. Thin psycopg wrapper -- no ORM.

An ORM would buy little here: the schema is fixed, the queries are hand-written recursive
CTEs that no ORM expresses well, and the write path is bulk upserts. Raw SQL keeps the
graph traversals readable, which matters when explaining them to a panel.
"""

from __future__ import annotations

from contextlib import contextmanager
from typing import Any, Iterator

import psycopg
from psycopg.rows import dict_row

from . import config

_cfg = config.load()


@contextmanager
def connect() -> Iterator[psycopg.Connection]:
    with psycopg.connect(_cfg.database_url, row_factory=dict_row) as conn:
        yield conn


def query(sql: str, params: tuple | dict = ()) -> list[dict[str, Any]]:
    with connect() as conn, conn.cursor() as cur:
        cur.execute(sql, params)
        return cur.fetchall()


def query_one(sql: str, params: tuple | dict = ()) -> dict[str, Any] | None:
    rows = query(sql, params)
    return rows[0] if rows else None


def execute(sql: str, params: tuple | dict = ()) -> None:
    with connect() as conn, conn.cursor() as cur:
        cur.execute(sql, params)
        conn.commit()


def reset() -> None:
    """Drop all rows, keeping the schema. Used when re-ingesting from scratch."""
    with connect() as conn, conn.cursor() as cur:
        cur.execute(
            """
            TRUNCATE repos, people, files, commits, items, comments, edges,
                     decisions, decision_edges, chunks
            RESTART IDENTITY CASCADE
            """
        )
        conn.commit()
