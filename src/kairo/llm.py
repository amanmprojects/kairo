"""Thin cached wrapper over the OpenAI-compatible API.

Deliberately not a framework. Two functions, one cache, no abstraction between you and
the wire format -- because the two things this project needs most from its LLM layer are:

  1. Aggressive caching. Extraction gets re-run dozens of times during development, and
     a content-hash cache makes every re-run after the first one free and instant.
  2. Legible failures. When a panelist asks why KAIRO produced a wrong edge, the answer
     should be "here is the prompt, here is the raw response, here is the parse" --
     not a walk through framework state.

Works against OpenAI proper or any compatible proxy. `complete_json` degrades gracefully
when the endpoint doesn't support response_format, which many proxies don't.
"""

from __future__ import annotations

import hashlib
import json
import os
import re
from pathlib import Path
from typing import Any

from openai import OpenAI
from tenacity import retry, stop_after_attempt, wait_exponential

from . import config

_cfg = config.load()
_client = OpenAI(base_url=_cfg.openai_base_url, api_key=_cfg.openai_api_key)
_embed_client = OpenAI(base_url=_cfg.embedding_base_url, api_key=_cfg.embedding_api_key)

_CACHE = config.CACHE_DIR / "llm"


def _cache_path(kind: str, key: str) -> Path:
    digest = hashlib.sha256(key.encode()).hexdigest()
    # Shard by prefix: some filesystems degrade badly with tens of thousands of entries
    # in a single directory, and full-history extraction will produce exactly that.
    return _CACHE / kind / digest[:2] / f"{digest}.json"


def _cache_get(kind: str, key: str) -> Any | None:
    path = _cache_path(kind, key)
    if path.exists():
        return json.loads(path.read_text())["value"]
    return None


def _cache_put(kind: str, key: str, value: Any) -> None:
    path = _cache_path(kind, key)
    path.parent.mkdir(parents=True, exist_ok=True)
    path.write_text(json.dumps({"key": key, "value": value}))


@retry(stop=stop_after_attempt(4), wait=wait_exponential(min=1, max=30))
def _chat(messages: list[dict], model: str, json_mode: bool) -> str:
    kwargs: dict[str, Any] = {"model": model, "messages": messages, "temperature": 0}
    if json_mode:
        kwargs["response_format"] = {"type": "json_object"}
    resp = _client.chat.completions.create(**kwargs)
    return resp.choices[0].message.content or ""


def complete(prompt: str, *, system: str | None = None, model: str | None = None) -> str:
    """Single-turn completion. Cached by (model, system, prompt)."""
    model = model or _cfg.openai_model
    messages = ([{"role": "system", "content": system}] if system else []) + [
        {"role": "user", "content": prompt}
    ]
    key = json.dumps({"model": model, "messages": messages}, sort_keys=True)

    cached = _cache_get("chat", key)
    if cached is not None:
        return cached

    out = _chat(messages, model, json_mode=False)
    _cache_put("chat", key, out)
    return out


def _extract_json(text: str) -> Any:
    """Best-effort JSON recovery from a model response.

    Needed because not every OpenAI-compatible endpoint honours response_format, and
    models wrap JSON in prose or code fences often enough to matter at scale.
    """
    try:
        return json.loads(text)
    except json.JSONDecodeError:
        pass

    fenced = re.search(r"```(?:json)?\s*(.*?)```", text, re.DOTALL)
    if fenced:
        try:
            return json.loads(fenced.group(1))
        except json.JSONDecodeError:
            pass

    # Fall back to the outermost brace/bracket pair.
    for opener, closer in (("{", "}"), ("[", "]")):
        start, end = text.find(opener), text.rfind(closer)
        if start != -1 and end > start:
            try:
                return json.loads(text[start : end + 1])
            except json.JSONDecodeError:
                continue

    raise ValueError(f"could not parse JSON from response: {text[:500]}")


def complete_json(
    prompt: str, *, system: str | None = None, model: str | None = None
) -> Any:
    """Completion parsed as JSON. Cached by (model, system, prompt)."""
    model = model or _cfg.openai_model
    messages = ([{"role": "system", "content": system}] if system else []) + [
        {"role": "user", "content": prompt}
    ]
    key = json.dumps({"model": model, "messages": messages, "json": True}, sort_keys=True)

    cached = _cache_get("chat_json", key)
    if cached is not None:
        return cached

    try:
        raw = _chat(messages, model, json_mode=True)
    except Exception:
        # Endpoint likely rejected response_format; retry without it and lean on the
        # recovery parser.
        raw = _chat(messages, model, json_mode=False)

    value = _extract_json(raw)
    _cache_put("chat_json", key, value)
    return value


@retry(stop=stop_after_attempt(4), wait=wait_exponential(min=1, max=30))
def _embed_batch_api(texts: list[str], model: str) -> list[list[float]]:
    resp = _embed_client.embeddings.create(model=model, input=texts)
    return [d.embedding for d in resp.data]


# Local embedding fallback.
#
# Many OpenAI-compatible proxies serve /chat/completions but not /embeddings -- the
# configured endpoint here exposes 25 chat models and zero embedding models. Embeddings
# are not needed for graph traversal (that is pure SQL), but they ARE needed for the
# vector-RAG baseline the whole research claim is measured against. No baseline, no
# comparison, no result.
#
# A local sentence-transformer removes the dependency entirely and is arguably better for
# an academic result: the baseline becomes reproducible by anyone with the repo, with no
# API key, no rate limit, and no provider that might change its model behind the name.
_local_model = None


def _get_local_model():
    global _local_model
    if _local_model is None:
        try:
            from sentence_transformers import SentenceTransformer
        except ImportError as e:
            raise RuntimeError(
                "No embedding backend available.\n"
                "  The configured endpoint does not serve /embeddings, so the local\n"
                "  fallback is required:  uv pip install sentence-transformers\n"
                "  (CPU is fine; the default model is ~90MB.)"
            ) from e
        name = os.getenv("LOCAL_EMBEDDING_MODEL", "sentence-transformers/all-MiniLM-L6-v2")
        _local_model = SentenceTransformer(name)
    return _local_model


def _embed_batch_local(texts: list[str]) -> list[list[float]]:
    model = _get_local_model()
    return [v.tolist() for v in model.encode(texts, show_progress_bar=False)]


_use_local_embeddings: bool | None = None


def _embed_batch(texts: list[str], model: str) -> list[list[float]]:
    """Embed via API, falling back to a local model when the endpoint lacks /embeddings.

    The probe result is cached for the process so a missing endpoint costs one failed
    request rather than one per batch.
    """
    global _use_local_embeddings

    if _use_local_embeddings is None:
        try:
            out = _embed_batch_api(texts, model)
            _use_local_embeddings = False
            return out
        except Exception:
            _use_local_embeddings = True

    if _use_local_embeddings:
        return _embed_batch_local(texts)
    return _embed_batch_api(texts, model)


def embedding_backend() -> str:
    """Which backend embeddings will use. Recorded in evaluation output, since the
    baseline's quality depends on it."""
    if _use_local_embeddings is None:
        try:
            _embed_batch_api(["probe"], _cfg.embedding_model)
            return f"api:{_cfg.embedding_model}"
        except Exception:
            return f"local:{os.getenv('LOCAL_EMBEDDING_MODEL', 'all-MiniLM-L6-v2')}"
    return (
        f"local:{os.getenv('LOCAL_EMBEDDING_MODEL', 'all-MiniLM-L6-v2')}"
        if _use_local_embeddings
        else f"api:{_cfg.embedding_model}"
    )


def embed(texts: list[str], *, model: str | None = None) -> list[list[float]]:
    """Embed a list of texts. Cached per-text, so partial re-runs stay cheap."""
    model = model or _cfg.embedding_model
    out: list[list[float] | None] = [None] * len(texts)
    todo: list[tuple[int, str]] = []

    for i, text in enumerate(texts):
        key = json.dumps({"model": model, "text": text}, sort_keys=True)
        cached = _cache_get("embed", key)
        if cached is not None:
            out[i] = cached
        else:
            todo.append((i, text))

    for start in range(0, len(todo), 100):
        batch = todo[start : start + 100]
        vectors = _embed_batch([t for _, t in batch], model)
        for (i, text), vec in zip(batch, vectors):
            out[i] = vec
            _cache_put("embed", json.dumps({"model": model, "text": text}, sort_keys=True), vec)

    return [v for v in out if v is not None]
