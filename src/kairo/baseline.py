"""Chunk-and-embed baseline: conventional vector RAG, built to be beaten fairly.

THE POINT OF THIS FILE IS TO LOSE HONESTLY. The project's claim is that a temporal
knowledge graph outperforms vector RAG on root-cause and temporal questions. That claim
is worthless if the baseline is a strawman, and a panelist's first question will be
whether the comparison was rigged. So this implements the baseline the way someone
building only a vector RAG would actually build it:

  - Same source text the graph layer reads. Neither system gets material the other
    cannot see.
  - Same embedding model (local MiniLM), so the comparison isolates *retrieval
    structure* rather than measuring one provider's embeddings against another's.
  - Whole discussion threads chunked with overlap, not truncated to first comments --
    rationale usually appears deep in a thread, and cutting it off would manufacture the
    result.
  - Retrieval returns the top-k most similar chunks, which is what these systems do.

WHERE THE BASELINE SHOULD WIN. Single-hop questions ("why was X decided?") where the
answer sits in one thread. Embedding retrieval is genuinely good at that, and if the
graph loses there, the finding is that traversal costs more than it returns for simple
lookups -- worth reporting, not worth hiding.

WHERE IT SHOULD STRUCTURALLY FAIL, and why it is not a tuning problem:

  TEMPORAL. A superseded decision and its replacement are near-identical in embedding
  space -- they are about the same topic, in similar words. Nothing in a chunk records
  that one stopped being true in October 2019. "As of March 2019" cannot be expressed as
  a similarity query, so the baseline retrieves both and has no basis to prefer either.
  More chunks, better embeddings, and a bigger k all fail to fix this: the information is
  absent from the representation, not merely ranked low.

  MULTI-HOP. When a file name and the rationale for changing it never co-occur in any
  single chunk, no top-k over chunks contains the answer. Chunking cannot join.
"""

from __future__ import annotations

from typing import Any

from rich.console import Console
from rich.progress import BarColumn, Progress, SpinnerColumn, TaskProgressColumn, TextColumn

from . import db, llm

console = Console()

CHUNK_CHARS = 1200
OVERLAP = 200


def _split(text: str) -> list[str]:
    """Fixed-size character chunks with overlap.

    Overlap exists so a decision straddling a boundary is not lost from both sides --
    the standard mitigation, included because leaving it out would weaken the baseline
    for no honest reason.
    """
    text = text.strip()
    if not text:
        return []
    if len(text) <= CHUNK_CHARS:
        return [text]

    out: list[str] = []
    start = 0
    while start < len(text):
        out.append(text[start : start + CHUNK_CHARS])
        start += CHUNK_CHARS - OVERLAP
    return out


def _thread_text(item: dict, comments: list[dict]) -> str:
    parts = [f"{item['kind'].upper()} #{item['number']}: {item['title']}"]
    if item.get("author_login"):
        parts.append(f"opened by {item['author_login']} on {item['created_at']:%Y-%m-%d}")
    if item.get("body"):
        parts.append(item["body"])
    for c in comments:
        who = c.get("author_login") or "unknown"
        parts.append(f"\n--- comment by {who} on {c['created_at']:%Y-%m-%d} ---\n{c['body']}")
    return "\n".join(p for p in parts if p)


def build(repo_id: int, *, batch: int = 64) -> dict[str, int]:
    """Chunk every discussion thread and embed it.

    Runs over the same threads the extractor sees, so neither system has an information
    advantage over the other.
    """
    items = db.query(
        """SELECT i.id, i.number, i.kind, i.title, i.body, i.created_at,
                  p.login AS author_login
           FROM items i LEFT JOIN people p ON p.id = i.author_id
           WHERE i.repo_id = %s ORDER BY i.number""",
        (repo_id,),
    )

    with db.connect() as conn, conn.cursor() as cur:
        cur.execute("DELETE FROM chunks WHERE repo_id = %s", (repo_id,))
        conn.commit()

        pending: list[tuple[str, int, int]] = []   # text, item_id, ordinal
        total = 0

        def flush() -> None:
            nonlocal pending, total
            if not pending:
                return
            vectors = llm.embed([p[0] for p in pending])
            for (text, item_id, ordinal), vec in zip(pending, vectors):
                cur.execute(
                    """INSERT INTO chunks (repo_id, source_item_id, ordinal, content, embedding)
                       VALUES (%s, %s, %s, %s, %s)""",
                    (repo_id, item_id, ordinal, text, str(vec)),
                )
            total += len(pending)
            conn.commit()
            pending = []

        with Progress(
            SpinnerColumn(), TextColumn("[progress.description]{task.description}"),
            BarColumn(), TaskProgressColumn(), console=console,
        ) as prog:
            task = prog.add_task("  chunking", total=len(items))
            for item in items:
                comments = db.query(
                    """SELECT c.body, c.created_at, p.login AS author_login
                       FROM comments c LEFT JOIN people p ON p.id = c.author_id
                       WHERE c.item_id = %s ORDER BY c.created_at""",
                    (item["id"],),
                )
                for ordinal, chunk in enumerate(_split(_thread_text(item, comments))):
                    pending.append((chunk, item["id"], ordinal))
                if len(pending) >= batch:
                    flush()
                prog.advance(task)
            flush()

    return {"items": len(items), "chunks": total}


def search(repo_id: int, question: str, *, k: int = 8) -> list[dict]:
    """Top-k chunks by cosine similarity -- the baseline's entire retrieval strategy.

    Note what cannot be passed in: a date. There is nowhere to put one. That is the
    structural limitation the temporal questions are designed to expose, not an
    omission in this function.
    """
    vector = llm.embed([question])[0]
    return db.query(
        """
        SELECT c.content, c.ordinal, i.number, i.title,
               c.embedding <=> %s::vector AS distance
        FROM chunks c
        JOIN items i ON i.id = c.source_item_id
        WHERE c.repo_id = %s
        ORDER BY c.embedding <=> %s::vector
        LIMIT %s
        """,
        (str(vector), repo_id, str(vector), k),
    )


def answer(repo_id: int, question: str, *, k: int = 8, model: str | None = None) -> dict[str, Any]:
    """Retrieve then generate -- standard RAG, for head-to-head comparison."""
    chunks = search(repo_id, question, k=k)
    if not chunks:
        return {"answer": "No relevant context found.", "chunks": [], "context_chars": 0}

    context = "\n\n---\n\n".join(
        f"[#{c['number']} {c['title']}]\n{c['content']}" for c in chunks
    )
    prompt = (
        f"Context from project discussions:\n\n{context}\n\n"
        f"Question: {question}\n\n"
        "Answer using only the context above. If the context does not contain the "
        "answer, say so."
    )
    return {
        "answer": llm.complete(prompt, model=model),
        "chunks": [{"number": c["number"], "distance": float(c["distance"])} for c in chunks],
        "context_chars": len(context),
    }
