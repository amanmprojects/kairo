"""KAIRO's web product API and single-page workspace.

It is intentionally a thin presentation layer over the existing CLI services: the
knowledge graph remains the source of truth, while this module makes it usable by a
team during planning and review.
"""

from __future__ import annotations

from pathlib import Path

from fastapi import FastAPI, HTTPException, BackgroundTasks, Request
from pydantic import BaseModel, Field

from fastapi.middleware.cors import CORSMiddleware

from . import db, graphrag, insights, config

app = FastAPI(title="KAIRO", version="0.1.0", description="Decision-aware engineering workspace")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


class AskRequest(BaseModel):
    question: str = Field(min_length=3, max_length=2000)


class ImpactRequest(BaseModel):
    paths: list[str] = Field(min_length=1, max_length=30)


def _not_found(exc: Exception) -> None:
    if isinstance(exc, LookupError):
        raise HTTPException(404, str(exc)) from exc
    raise exc





@app.get("/api/health")
def health() -> dict:
    try:
        db.query_one("SELECT 1 AS ok")
        return {"status": "ready"}
    except Exception as exc:  # noqa: BLE001 - setup errors belong in the UI, not a traceback.
        return {"status": "degraded", "detail": str(exc)}


@app.get("/api/repositories")
def list_repositories() -> list[dict]:
    return insights.repositories()


@app.get("/api/repositories/{repo_id}/overview")
def repository_overview(repo_id: int) -> dict:
    try:
        return insights.overview(repo_id)
    except LookupError as exc:
        _not_found(exc)


@app.get("/api/repositories/{repo_id}/xray")
def repository_xray(repo_id: int) -> dict:
    return {"hotspots": insights.xray(repo_id)}


@app.get("/api/repositories/{repo_id}/decisions")
def repository_decisions(repo_id: int) -> dict:
    return {"decisions": insights.decisions(repo_id)}


@app.post("/api/repositories/{repo_id}/ask")
def ask_kairo(repo_id: int, request: AskRequest) -> dict:
    try:
        result = graphrag.answer(repo_id, request.question)
        # A UI needs the raw evidence as well as prose, so each answer is inspectable.
        return result
    except Exception as exc:
        raise HTTPException(503, f"KAIRO could not answer this question: {exc}") from exc


@app.post("/api/repositories/{repo_id}/impact-scan")
def scan_impact(repo_id: int, request: ImpactRequest) -> dict:
    return insights.impact_scan(repo_id, request.paths)



class AuthRequest(BaseModel):
    code: str

@app.post("/auth/github")
def auth_github(request: AuthRequest) -> dict:
    return {"token": "dummy-jwt-token", "user": {"id": 1, "login": "testuser"}}

class GitHubConnectRequest(BaseModel):
    token: str = Field(min_length=1)
    target_repo: str = "sharvarianand/kairo"

@app.post("/api/github/connect")
def connect_github(request: GitHubConnectRequest) -> dict:
    import httpx
    import re

    headers = {
        "Authorization": f"Bearer {request.token}",
        "Accept": "application/vnd.github+json",
        "X-GitHub-Api-Version": "2022-11-28",
    }
    try:
        with httpx.Client(timeout=10.0) as client:
            user_resp = client.get("https://api.github.com/user", headers=headers)
            if user_resp.status_code != 200:
                raise HTTPException(400, "Invalid GitHub token or insufficient permissions")
            user_data = user_resp.json()

            repo_resp = client.get(f"https://api.github.com/repos/{request.target_repo}", headers=headers)
            repo_data = repo_resp.json() if repo_resp.status_code == 200 else {}
            rate_limit = user_resp.headers.get("x-ratelimit-remaining", "5000")

        # Save to .env so CLI, services, and ingest have it
        env_path = config.ROOT / ".env"
        if env_path.exists():
            content = env_path.read_text(encoding="utf-8")
            if "GITHUB_TOKEN=" in content:
                content = re.sub(r"GITHUB_TOKEN=.*", f"GITHUB_TOKEN={request.token}", content)
            else:
                content += f"\nGITHUB_TOKEN={request.token}\n"
            if "TARGET_REPO=" in content:
                content = re.sub(r"TARGET_REPO=.*", f"TARGET_REPO={request.target_repo}", content)
            else:
                content += f"\nTARGET_REPO={request.target_repo}\n"
            env_path.write_text(content, encoding="utf-8")

        return {
            "status": "connected",
            "user": user_data.get("login"),
            "name": user_data.get("name") or user_data.get("login"),
            "avatar_url": user_data.get("avatar_url"),
            "rate_limit_remaining": rate_limit,
            "target_repo": request.target_repo,
            "repo_stars": repo_data.get("stargazers_count", 0),
        }
    except HTTPException:
        raise
    except Exception as exc:
        raise HTTPException(400, f"GitHub connection failed: {exc}")

@app.post("/repositories/{repo_id}/ingest")
def ingest_repo(repo_id: int, background_tasks: BackgroundTasks) -> dict:
    repo = db.query_one("SELECT full_name FROM repos WHERE id = %s", (repo_id,))
    if not repo:
        raise HTTPException(404, "Repository not found")
    # background_tasks.add_task(ingest.run, repo["full_name"], "dummy-token")
    return {"status": "ingesting"}

@app.get("/repositories/{repo_id}/readiness")
def readiness(repo_id: int) -> dict:
    return {"score": 85, "status": "ready"}

@app.get("/workspaces/{workspace_id}/board")
def workspace_board(workspace_id: int) -> dict:
    repo = db.query_one("SELECT repo_id FROM workspaces WHERE id = %s", (workspace_id,))
    if not repo:
        raise HTTPException(404, "Workspace not found")
    # Using existing planning logic
    from . import planning
    return planning.board(repo["repo_id"])

class BoardItemPatch(BaseModel):
    column_id: int

@app.patch("/board-items/{item_id}")
def patch_board_item(item_id: int, request: BoardItemPatch) -> dict:
    row = db.query_one("SELECT bi.workspace_id, w.repo_id FROM board_items bi JOIN workspaces w ON w.id = bi.workspace_id WHERE bi.id = %s", (item_id,))
    if not row:
         raise HTTPException(404, "Board item not found")
    from . import planning
    return planning.move_item(row["repo_id"], item_id, request.column_id)

@app.get("/workspaces/{workspace_id}/roadmap")
def roadmap(workspace_id: int) -> dict:
    return {"epics": []}

@app.post("/sprints")
def create_sprint() -> dict:
    return {"status": "created"}

@app.get("/reports/velocity")
def velocity() -> dict:
    return {"velocity": 12, "burndown": []}

@app.get("/decisions/{decision_id}")
def get_decision(decision_id: int) -> dict:
    decision = db.query_one("SELECT * FROM decisions WHERE id = %s", (decision_id,))
    if not decision:
        raise HTTPException(404, "Decision not found")
    return decision

@app.get("/decisions/{decision_id}/timeline")
def decision_timeline(decision_id: int) -> dict:
    return {"timeline": []}

@app.get("/impact-scans/{scan_id}")
def get_impact_scan(scan_id: int) -> dict:
    return {"status": "completed", "findings": []}

@app.get("/repositories/{repo_id}/metrics")
def get_metrics(repo_id: int) -> dict:
    return {"ddi": 72, "ees": 85}

@app.post("/webhooks/github")
def github_webhook(request: Request) -> dict:
    return {"status": "received"}

def serve() -> None:
    """Run the local development workspace via the installed ``kairo-web`` command."""
    import uvicorn

    uvicorn.run("kairo.web:app", host="127.0.0.1", port=8000, reload=True)
