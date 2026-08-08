"""GitHub REST client with an aggressive on-disk cache.

Two constraints shape this file:

  RATE LIMITS. Authenticated callers get 5000 requests/hour; unauthenticated get 60.
  Full history of a large repo runs to thousands of requests, so the token is effectively
  mandatory and the client blocks (rather than failing) when the budget runs out.

  RE-RUNS. Ingestion gets re-run constantly during development. Every response is cached
  to disk by URL+params, so the first run costs the full request budget and every
  subsequent run is free and instant. This is also what makes the pipeline reproducible
  after the fact -- the cache is a frozen snapshot of the repo's history.
"""

from __future__ import annotations

import hashlib
import json
import time
from pathlib import Path
from typing import Any, Iterator

import httpx
from tenacity import retry, stop_after_attempt, wait_exponential

from . import config

_cfg = config.load()
_CACHE = config.CACHE_DIR / "github"

API = "https://api.github.com"


class MissingTokenError(RuntimeError):
    """Raised with setup instructions when GITHUB_TOKEN is absent."""

    def __init__(self) -> None:
        super().__init__(
            "GITHUB_TOKEN is not set in .env\n"
            "  -> github.com/settings/tokens -> Generate new token (classic)\n"
            "  -> scope: public_repo (nothing else needed)\n"
            "  -> add to .env as GITHUB_TOKEN=ghp_...\n"
            "  Without it the API allows 60 requests/hour instead of 5000,\n"
            "  which is not enough to ingest a repo's history."
        )


def _headers() -> dict[str, str]:
    if not _cfg.github_token:
        raise MissingTokenError()
    return {
        "Authorization": f"Bearer {_cfg.github_token}",
        "Accept": "application/vnd.github+json",
        "X-GitHub-Api-Version": "2022-11-28",
    }


def _cache_path(url: str, params: dict | None) -> Path:
    key = json.dumps({"url": url, "params": params or {}}, sort_keys=True)
    digest = hashlib.sha256(key.encode()).hexdigest()
    return _CACHE / digest[:2] / f"{digest}.json"


@retry(stop=stop_after_attempt(4), wait=wait_exponential(min=2, max=60))
def _request(client: httpx.Client, url: str, params: dict | None) -> httpx.Response:
    resp = client.get(url, params=params, headers=_headers(), timeout=30.0)

    # Primary rate limit: wait it out rather than dying halfway through an ingest.
    if resp.status_code == 403 and resp.headers.get("x-ratelimit-remaining") == "0":
        reset = int(resp.headers.get("x-ratelimit-reset", "0"))
        wait = max(0, reset - int(time.time())) + 5
        print(f"  rate limit hit; sleeping {wait}s until reset")
        time.sleep(wait)
        return _request(client, url, params)

    # Secondary (abuse) rate limit.
    if resp.status_code in (403, 429) and "retry-after" in resp.headers:
        wait = int(resp.headers["retry-after"]) + 1
        print(f"  secondary rate limit; sleeping {wait}s")
        time.sleep(wait)
        return _request(client, url, params)

    resp.raise_for_status()
    return resp


def get(url: str, params: dict | None = None, *, client: httpx.Client | None = None) -> Any:
    """GET a single URL, cached to disk."""
    path = _cache_path(url, params)
    if path.exists():
        return json.loads(path.read_text())

    owned = client is None
    client = client or httpx.Client(follow_redirects=True)
    try:
        data = _request(client, url, params).json()
    finally:
        if owned:
            client.close()

    path.parent.mkdir(parents=True, exist_ok=True)
    path.write_text(json.dumps(data))
    return data


def paginate(
    path: str, params: dict | None = None, *, max_pages: int | None = None
) -> Iterator[dict]:
    """Yield items across all pages of a paginated endpoint.

    Each page is cached independently, so an interrupted ingest resumes from where it
    stopped rather than restarting.
    """
    params = dict(params or {})
    params.setdefault("per_page", 100)
    url = f"{API}{path}"

    with httpx.Client(follow_redirects=True) as client:
        page = 1
        while True:
            if max_pages is not None and page > max_pages:
                return
            page_params = {**params, "page": page}
            data = get(url, page_params, client=client)
            if not isinstance(data, list) or not data:
                return
            yield from data
            if len(data) < params["per_page"]:
                return
            page += 1


# --- endpoint helpers -------------------------------------------------------

def repo(full_name: str) -> dict:
    return get(f"{API}/repos/{full_name}")


def commits(
    full_name: str,
    *,
    max_pages: int | None = None,
    since: str | None = None,
    until: str | None = None,
) -> Iterator[dict]:
    """Commits, newest first.

    `since`/`until` (ISO 8601) exist to keep a bounded ingest coherent. The issues
    endpoint is paged oldest-first while this one is newest-first, so a naive
    `--max-pages 10` on both captures the repo's FIRST 1000 issues and its LAST 1000
    commits -- on fastapi/fastapi that is 2019 discussion against 2026 code, with no
    temporal overlap at all. Traversal from a commit could then never reach the
    discussion that motivated it. Pinning `until` to the end of the issue window makes a
    bounded ingest one coherent slice of history instead of two disjoint ones.
    """
    params: dict[str, Any] = {}
    if since:
        params["since"] = since
    if until:
        params["until"] = until
    yield from paginate(f"/repos/{full_name}/commits", params or None, max_pages=max_pages)


def commit_detail(full_name: str, sha: str) -> dict:
    """Full commit including per-file changes. One request per commit -- the expensive
    part of ingestion, and the reason the cache matters."""
    return get(f"{API}/repos/{full_name}/commits/{sha}")


def issues(full_name: str, *, max_pages: int | None = None) -> Iterator[dict]:
    """Issues and PRs. GitHub's issues endpoint returns both; PRs carry a
    `pull_request` key. state=all to include closed history."""
    yield from paginate(
        f"/repos/{full_name}/issues",
        {"state": "all", "sort": "created", "direction": "asc"},
        max_pages=max_pages,
    )


def issue_comments(full_name: str, number: int) -> Iterator[dict]:
    yield from paginate(f"/repos/{full_name}/issues/{number}/comments")


def pull_files(full_name: str, number: int) -> Iterator[dict]:
    yield from paginate(f"/repos/{full_name}/pulls/{number}/files")


def pull_reviews(full_name: str, number: int) -> Iterator[dict]:
    yield from paginate(f"/repos/{full_name}/pulls/{number}/reviews")


def pull_review_comments(full_name: str, number: int) -> Iterator[dict]:
    yield from paginate(f"/repos/{full_name}/pulls/{number}/comments")


def timeline(full_name: str, number: int) -> Iterator[dict]:
    """Timeline events for an issue/PR: cross-references, closes, renames, commits.

    This is how PR->issue links are recovered properly. The alternative -- regexing
    "fixes #123" out of PR bodies -- only catches GitHub's closing-keyword syntax written
    in the body itself, and misses links made in comments, via the UI, or by referencing
    a commit. On fastapi/fastapi the regex found 26 links; the timeline exposes an order
    of magnitude more, and they are recorded events rather than parsed prose, so they stay
    in Layer 1.
    """
    yield from paginate(f"/repos/{full_name}/issues/{number}/timeline")


def rate_limit() -> dict:
    """Current rate-limit budget. Uncached -- always live."""
    with httpx.Client() as client:
        return _request(client, f"{API}/rate_limit", None).json()
