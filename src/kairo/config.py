"""Configuration, loaded from .env."""

from __future__ import annotations

import os
from dataclasses import dataclass
from pathlib import Path

from dotenv import load_dotenv

ROOT = Path(__file__).resolve().parents[2]
# override=True so .env beats whatever is already exported in the shell. Without it,
# python-dotenv leaves pre-existing environment variables untouched -- so a shell profile
# that exports OPENAI_BASE_URL/API_KEY/MODEL silently shadows this project's .env, and
# the app talks to an endpoint the config file never mentions. Project config should win
# over ambient shell state.
load_dotenv(ROOT / ".env", override=True)

CACHE_DIR = ROOT / ".cache"


class ConfigError(RuntimeError):
    """Raised when a required setting is missing, with a pointer to the fix."""


def _require(name: str, hint: str) -> str:
    val = os.getenv(name)
    if not val:
        raise ConfigError(f"{name} is not set in .env\n  -> {hint}")
    return val


@dataclass(frozen=True)
class Config:
    openai_base_url: str
    openai_api_key: str
    openai_model: str
    embedding_model: str
    embedding_base_url: str
    embedding_api_key: str
    github_token: str | None
    database_url: str
    target_repo: str


def load() -> Config:
    api_key = os.getenv("OPENROUTER_API_KEY") or os.getenv("OPENAI_API_KEY")
    if not api_key:
        raise ConfigError(
            "Neither OPENAI_API_KEY nor OPENROUTER_API_KEY is set in .env\n"
            "  -> add your key to .env (see .env.example)"
        )

    default_base_url = (
        "https://openrouter.ai/api/v1"
        if os.getenv("OPENROUTER_API_KEY")
        else "https://api.openai.com/v1"
    )
    base_url = os.getenv("OPENAI_BASE_URL", default_base_url)

    return Config(
        openai_base_url=base_url,
        openai_api_key=api_key,
        openai_model=_require(
            "OPENAI_MODEL",
            "e.g. OPENAI_MODEL=cohere/north-mini-code:free or qwen/qwen3.8-27b:free",
        ),
        embedding_model=os.getenv("EMBEDDING_MODEL", "text-embedding-3-small"),
        # Some proxies serve chat and embeddings from different endpoints; fall back to
        # the chat endpoint when they don't.
        embedding_base_url=os.getenv("EMBEDDING_BASE_URL", base_url),
        embedding_api_key=os.getenv("EMBEDDING_API_KEY", api_key),
        # Optional here so that non-ingest commands still run without it; the GitHub
        # client raises with setup instructions if it's actually needed.
        github_token=os.getenv("GITHUB_TOKEN"),
        database_url=os.getenv(
            "DATABASE_URL", "postgresql://kairo:kairo@localhost:5433/kairo"
        ),
        target_repo=os.getenv("TARGET_REPO", "sharvarianand/kairo"),
    )
