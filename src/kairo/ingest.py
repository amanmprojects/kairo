"""Ingest a GitHub repo into Layer 1 (deterministic) tables and build the skeleton graph.

No LLM is involved anywhere in this file. Everything written here comes straight from the
GitHub API and is, barring a bug, factually correct. That property is what makes the
skeleton a trustworthy substrate for the interpreted layer to hang off.

Edges built here:
    person  --AUTHORED-->  item | commit
    item    --MODIFIED-->  file        (PRs, via changed files)
    commit  --MODIFIED-->  file
    item    --CLOSES-->    item        (regex pass; the timeline pass adds far more)
    item    --MENTIONS-->  item        (same-repo cross-references that don't resolve)
    item    --COMMENTED_BY--> person
    commit  --PARENT-->    commit
"""

from __future__ import annotations

import re
from datetime import datetime, timedelta, timezone
from typing import Any, Iterable

from rich.console import Console
from rich.progress import Progress, SpinnerColumn, TextColumn, BarColumn, TaskProgressColumn

from . import db, github

console = Console()

# "closes #123", "fixes #45", "resolved #7" -- GitHub's closing-keyword syntax.
CLOSES_RE = re.compile(
    r"\b(?:close[sd]?|fix(?:e[sd])?|resolve[sd]?)\b[:\s]+#(\d+)", re.IGNORECASE
)


def _parse_ts(value: str | None) -> datetime | None:
    """GitHub's "2020-05-15T00:55:08Z" -> an aware datetime.

    Needed only where a timestamp is compared in Python; everywhere else the raw ISO
    string is handed to psycopg, which parses it server-side. Aware, because it gets
    compared against TIMESTAMPTZ values coming back from Postgres.
    """
    if not value:
        return None
    try:
        return datetime.fromisoformat(value.replace("Z", "+00:00"))
    except ValueError:
        return None


def _upsert_repo(cur, full_name: str) -> int:
    cur.execute(
        """
        INSERT INTO repos (full_name) VALUES (%s)
        ON CONFLICT (full_name) DO UPDATE SET ingested_at = now()
        RETURNING id
        """,
        (full_name,),
    )
    return cur.fetchone()["id"]


class Ingester:
    def __init__(
        self,
        full_name: str,
        *,
        max_pages: int | None = None,
        use_timeline: bool = True,
    ) -> None:
        self.full_name = full_name
        self.max_pages = max_pages
        # The timeline pass costs one request per item. Worth it by default -- it is where
        # most PR->issue links actually live -- but skippable when the request budget is
        # the binding constraint on a large backfill.
        self.use_timeline = use_timeline
        self.repo_id: int = 0
        # Caches so repeated lookups don't round-trip to the DB during a run.
        self._people: dict[str, int] = {}
        self._files: dict[str, int] = {}
        self._items: dict[int, int] = {}   # github number -> db id
        self._commits: dict[str, int] = {}  # sha -> db id

    # --- node helpers -------------------------------------------------------

    def person_id(self, cur, login: str | None) -> int | None:
        """Resolve a login to a person id, creating the row on first sight.

        Returns None for deleted/bot-less authors -- GitHub gives null user objects for
        accounts that no longer exist, and those must not become a person node.
        """
        if not login:
            return None
        if login in self._people:
            return self._people[login]
        cur.execute(
            """
            INSERT INTO people (repo_id, login) VALUES (%s, %s)
            ON CONFLICT (repo_id, login) DO UPDATE SET login = EXCLUDED.login
            RETURNING id
            """,
            (self.repo_id, login),
        )
        pid = cur.fetchone()["id"]
        self._people[login] = pid
        return pid

    def file_id(self, cur, path: str) -> int:
        if path in self._files:
            return self._files[path]
        cur.execute(
            """
            INSERT INTO files (repo_id, path) VALUES (%s, %s)
            ON CONFLICT (repo_id, path) DO UPDATE SET path = EXCLUDED.path
            RETURNING id
            """,
            (self.repo_id, path),
        )
        fid = cur.fetchone()["id"]
        self._files[path] = fid
        return fid

    def add_edge(
        self, cur, src_type: str, src_id: int, rel: str, dst_type: str, dst_id: int, when
    ) -> None:
        cur.execute(
            """
            INSERT INTO edges (repo_id, src_type, src_id, rel, dst_type, dst_id, occurred_at)
            VALUES (%s, %s, %s, %s, %s, %s, %s)
            ON CONFLICT (repo_id, src_type, src_id, rel, dst_type, dst_id) DO NOTHING
            """,
            (self.repo_id, src_type, src_id, rel, dst_type, dst_id, when),
        )

    # --- ingestion passes ---------------------------------------------------

    def ingest_items(self, cur) -> None:
        """Issues and PRs, their comments, and PR file changes."""
        raw = list(github.issues(self.full_name, max_pages=self.max_pages))
        console.print(f"  fetched {len(raw)} issues/PRs")

        with Progress(
            SpinnerColumn(), TextColumn("[progress.description]{task.description}"),
            BarColumn(), TaskProgressColumn(), console=console,
        ) as prog:
            task = prog.add_task("  items", total=len(raw))

            for it in raw:
                is_pr = "pull_request" in it
                kind = "pr" if is_pr else "issue"
                author = self.person_id(cur, (it.get("user") or {}).get("login"))
                merged_at = (it.get("pull_request") or {}).get("merged_at") if is_pr else None

                cur.execute(
                    """
                    INSERT INTO items (repo_id, number, kind, title, body, state,
                                       author_id, created_at, closed_at, merged_at)
                    VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s)
                    ON CONFLICT (repo_id, number) DO UPDATE SET
                        title = EXCLUDED.title, body = EXCLUDED.body, state = EXCLUDED.state
                    RETURNING id
                    """,
                    (
                        self.repo_id, it["number"], kind, it["title"], it.get("body"),
                        it["state"], author, it["created_at"], it.get("closed_at"), merged_at,
                    ),
                )
                item_id = cur.fetchone()["id"]
                self._items[it["number"]] = item_id

                if author:
                    self.add_edge(cur, "person", author, "AUTHORED", "item", item_id,
                                  it["created_at"])

                self._ingest_comments(cur, it["number"], item_id)
                if is_pr:
                    self._ingest_pr_files(cur, it["number"], item_id,
                                          merged_at or it["created_at"])

                prog.advance(task)

    def _ingest_comments(self, cur, number: int, item_id: int) -> None:
        for c in github.issue_comments(self.full_name, number):
            author = self.person_id(cur, (c.get("user") or {}).get("login"))
            cur.execute(
                """
                INSERT INTO comments (repo_id, item_id, author_id, body, created_at,
                                      is_review, github_id)
                VALUES (%s, %s, %s, %s, %s, FALSE, %s)
                ON CONFLICT (repo_id, github_id, is_review) DO NOTHING
                """,
                (self.repo_id, item_id, author, c.get("body") or "", c["created_at"], c["id"]),
            )
            if author:
                self.add_edge(cur, "person", author, "COMMENTED_ON", "item", item_id,
                              c["created_at"])

    def _ingest_pr_files(self, cur, number: int, item_id: int, when) -> None:
        for f in github.pull_files(self.full_name, number):
            fid = self.file_id(cur, f["filename"])
            self.add_edge(cur, "item", item_id, "MODIFIED", "file", fid, when)

    def link_closes(self, cur) -> None:
        """PR -> issue CLOSES edges, parsed from closing keywords in titles and bodies.

        Deliberately deterministic (regex over GitHub's documented syntax) rather than
        LLM-extracted: this is a Layer 1 fact when the keyword is present. Cross-repo
        references and prose-only links ("this addresses the thing in 17") are missed by
        design -- the interpreted layer can add those later, with confidence attached.
        """
        cur.execute(
            "SELECT id, number, title, body, created_at FROM items WHERE repo_id = %s",
            (self.repo_id,),
        )
        rows = cur.fetchall()
        linked = 0
        for row in rows:
            text = f"{row['title']}\n{row['body'] or ''}"
            for m in CLOSES_RE.finditer(text):
                target = self._items.get(int(m.group(1)))
                if target and target != row["id"]:
                    self.add_edge(cur, "item", row["id"], "CLOSES", "item", target,
                                  row["created_at"])
                    linked += 1
        console.print(f"  linked {linked} CLOSES edges")

    def link_timeline(self, cur) -> None:
        """PR <-> issue links recovered from GitHub's timeline API.

        The regex pass above only sees closing keywords written in an item's own title or
        body. Most real links are not written that way: they are made in a comment, via
        the UI's "link an issue" control, or by a commit message. GitHub records all of
        them as timeline events, so this stays a Layer 1 fact -- an event GitHub logged,
        not prose someone parsed.

        Three filters, each removing a specific kind of false edge:

          SAME REPO ONLY. `cross-referenced` fires whenever anyone anywhere links to the
          issue. fastapi/fastapi issue #12 collects references from unrelated tutorial
          repos and downstream projects. Those are real events but they are not this
          project's reasoning, and a graph full of them would make every popular issue a
          hub -- the exact failure `max_degree` exists to contain.

          PRS ONLY, for CLOSES. A PR referencing an issue plausibly resolves it. An issue
          referencing another issue is a different relationship, so it becomes MENTIONS.

          BEFORE THE CLOSE. A cross-reference made two years after an issue closed is a
          later discussion citing it, not the thing that resolved it. Only references at
          or before `closed_at` can be CLOSES.

        Costs one request per item, which is why it is cached like everything else.
        """
        cur.execute(
            "SELECT id, number, closed_at FROM items WHERE repo_id = %s ORDER BY number",
            (self.repo_id,),
        )
        rows = cur.fetchall()

        closes = mentions = 0
        with Progress(
            SpinnerColumn(), TextColumn("[progress.description]{task.description}"),
            BarColumn(), TaskProgressColumn(), console=console,
        ) as prog:
            task = prog.add_task("  timeline", total=len(rows))
            for row in rows:
                try:
                    events = list(github.timeline(self.full_name, row["number"]))
                except Exception:
                    # A single unavailable timeline (deleted/transferred item) must not
                    # abort an ingest that is otherwise fine.
                    prog.advance(task)
                    continue

                for ev in events:
                    if ev.get("event") != "cross-referenced":
                        continue
                    issue = (ev.get("source") or {}).get("issue") or {}
                    if (issue.get("repository") or {}).get("full_name") != self.full_name:
                        continue

                    src = self._items.get(issue.get("number"))
                    if not src or src == row["id"]:
                        continue

                    when = _parse_ts(ev.get("created_at"))
                    if when is None:
                        continue

                    is_pr = bool(issue.get("pull_request"))
                    closed_at = row["closed_at"]
                    # Grace window: the close event and the merge that caused it are
                    # logged seconds apart, and ordering between them is not guaranteed.
                    resolves = (
                        is_pr
                        and closed_at is not None
                        and when <= closed_at + timedelta(minutes=5)
                    )

                    if resolves:
                        self.add_edge(cur, "item", src, "CLOSES", "item", row["id"], when)
                        closes += 1
                    else:
                        self.add_edge(cur, "item", src, "MENTIONS", "item", row["id"], when)
                        mentions += 1

                prog.advance(task)

        console.print(f"  timeline: {closes} CLOSES, {mentions} MENTIONS")

    def ingest_commits(self, cur) -> None:
        """Commits and their file changes.

        The per-commit detail fetch is one request each, making this the most expensive
        pass by far. max_pages exists precisely to keep test runs cheap.

        When the ingest is bounded, commits are pinned to the window the items already
        cover -- see `github.commits` for why. Without that, a bounded run pairs the
        oldest issues with the newest commits and the two never meet.
        """
        until = None
        if self.max_pages is not None:
            cur.execute(
                "SELECT max(created_at) AS last FROM items WHERE repo_id = %s",
                (self.repo_id,),
            )
            row = cur.fetchone()
            if row and row["last"]:
                # A month of slack past the last issue: the PRs that resolve a
                # discussion usually land shortly after it, and losing those commits
                # would break exactly the links this window exists to preserve.
                until = (row["last"] + timedelta(days=30)).isoformat()
                console.print(f"  pinning commits to items window (until {until[:10]})")

        raw = list(github.commits(self.full_name, max_pages=self.max_pages, until=until))
        console.print(f"  fetched {len(raw)} commits")

        with Progress(
            SpinnerColumn(), TextColumn("[progress.description]{task.description}"),
            BarColumn(), TaskProgressColumn(), console=console,
        ) as prog:
            task = prog.add_task("  commits", total=len(raw))

            for c in raw:
                sha = c["sha"]
                author = self.person_id(cur, (c.get("author") or {}).get("login"))
                committed_at = c["commit"]["committer"]["date"]

                cur.execute(
                    """
                    INSERT INTO commits (repo_id, sha, author_id, message, committed_at)
                    VALUES (%s, %s, %s, %s, %s)
                    ON CONFLICT (repo_id, sha) DO UPDATE SET message = EXCLUDED.message
                    RETURNING id
                    """,
                    (self.repo_id, sha, author, c["commit"]["message"], committed_at),
                )
                commit_id = cur.fetchone()["id"]
                self._commits[sha] = commit_id

                if author:
                    self.add_edge(cur, "person", author, "AUTHORED", "commit", commit_id,
                                  committed_at)

                detail = github.commit_detail(self.full_name, sha)
                for f in detail.get("files") or []:
                    fid = self.file_id(cur, f["filename"])
                    self.add_edge(cur, "commit", commit_id, "MODIFIED", "file", fid,
                                  committed_at)

                prog.advance(task)

        # PARENT edges need a second pass: the API returns commits newest-first, so a
        # commit's parent has not been inserted yet when the commit itself is processed.
        parents = 0
        for c in raw:
            commit_id = self._commits.get(c["sha"])
            if not commit_id:
                continue
            for parent in c.get("parents") or []:
                pid = self._commits.get(parent["sha"])
                if pid:
                    self.add_edge(cur, "commit", commit_id, "PARENT", "commit", pid,
                                  c["commit"]["committer"]["date"])
                    parents += 1
        console.print(f"  linked {parents} PARENT edges")

    # --- driver -------------------------------------------------------------

    def run(self) -> dict[str, int]:
        with db.connect() as conn, conn.cursor() as cur:
            self.repo_id = _upsert_repo(cur, self.full_name)
            conn.commit()

            console.print(f"[bold]ingesting {self.full_name}[/bold]")
            self.ingest_items(cur)
            conn.commit()

            self.link_closes(cur)
            conn.commit()

            if self.use_timeline:
                self.link_timeline(cur)
                conn.commit()

            self.ingest_commits(cur)
            conn.commit()

            return self.stats(cur)

    def stats(self, cur) -> dict[str, int]:
        out: dict[str, int] = {}
        for table in ("people", "files", "commits", "items", "comments", "edges"):
            cur.execute(f"SELECT count(*) AS n FROM {table} WHERE repo_id = %s",
                        (self.repo_id,))
            out[table] = cur.fetchone()["n"]
        return out


def ingest(
    full_name: str, *, max_pages: int | None = None, use_timeline: bool = True
) -> dict[str, int]:
    return Ingester(full_name, max_pages=max_pages, use_timeline=use_timeline).run()
