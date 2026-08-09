"""KAIRO command line."""

from __future__ import annotations

import typer
from rich.console import Console
from rich.table import Table

from . import config, db, graph, ingest

app = typer.Typer(add_completion=False, help="KAIRO - engineering intelligence over GitHub history")
console = Console()
_cfg = config.load()


@app.command("ingest")
def ingest_cmd(
    repo: str = typer.Argument(None, help="owner/name; defaults to TARGET_REPO in .env"),
    max_pages: int = typer.Option(None, "--max-pages", help="limit pages per endpoint (testing)"),
    reset: bool = typer.Option(False, "--reset", help="wipe all rows before ingesting"),
    no_timeline: bool = typer.Option(
        False, "--no-timeline",
        help="skip the timeline pass (saves 1 request/item, loses most PR->issue links)",
    ),
) -> None:
    """Fetch a repo's history into the deterministic layer."""
    repo = repo or _cfg.target_repo
    if reset:
        db.reset()
        console.print("[yellow]database reset[/yellow]")
    stats = ingest.ingest(repo, max_pages=max_pages, use_timeline=not no_timeline)

    table = Table(title=f"ingested {repo}")
    table.add_column("table")
    table.add_column("rows", justify="right")
    for k, v in stats.items():
        table.add_row(k, str(v))
    console.print(table)


@app.command("churn")
def churn_cmd(
    repo: str = typer.Argument(None),
    limit: int = typer.Option(15, "--limit", "-n"),
) -> None:
    """Files ranked by how often they change."""
    repo = repo or _cfg.target_repo
    rid = graph.repo_id_for(repo)
    if not rid:
        console.print(f"[red]{repo} not ingested[/red]")
        raise typer.Exit(1)

    table = Table(title=f"churn - {repo}")
    table.add_column("file")
    table.add_column("commits", justify="right")
    table.add_column("PRs", justify="right")
    for r in graph.churn_ranking(rid, limit=limit):
        table.add_row(r["path"], str(r["commit_changes"]), str(r["pr_changes"]))
    console.print(table)


@app.command("history")
def history_cmd(
    path: str = typer.Argument(..., help="file path or fragment"),
    repo: str = typer.Argument(None),
    depth: int = typer.Option(3, "--depth", "-d"),
    max_degree: int = typer.Option(25, "--max-degree", help="hub suppression threshold"),
) -> None:
    """Traverse the graph from a file: what changed it, and why."""
    repo = repo or _cfg.target_repo
    rid = graph.repo_id_for(repo)
    if not rid:
        console.print(f"[red]{repo} not ingested[/red]")
        raise typer.Exit(1)

    matches = graph.find_file(rid, path)
    if not matches:
        console.print(f"[red]no file matching {path!r}[/red]")
        raise typer.Exit(1)
    if matches[0]["path"] != path and len(matches) > 1:
        console.print(f"[dim]matched {matches[0]['path']}[/dim]")

    result = graph.file_history(rid, matches[0]["path"], max_degree=max_degree)
    console.print(f"[bold]{result['file']}[/bold] -> {len(result['nodes'])} related nodes\n")

    for n in result["nodes"][:40]:
        c = n["content"] or {}
        label = (
            c.get("title")
            or c.get("path")
            or c.get("login")
            or (c.get("message") or "").split("\n")[0]
        )
        via = " -> ".join(n["rels"])
        console.print(f"  [dim]d{n['depth']}[/dim] [cyan]{n['node_type']}[/cyan] {str(label)[:70]}")
        console.print(f"       [dim]via {via}[/dim]")


@app.command("stats")
def stats_cmd(repo: str = typer.Argument(None)) -> None:
    """Row counts and edge distribution."""
    repo = repo or _cfg.target_repo
    rid = graph.repo_id_for(repo)
    if not rid:
        console.print(f"[red]{repo} not ingested[/red]")
        raise typer.Exit(1)

    table = Table(title=f"{repo}")
    table.add_column("table")
    table.add_column("rows", justify="right")
    for t in ("people", "files", "commits", "items", "comments", "edges", "decisions"):
        row = db.query_one(f"SELECT count(*) AS n FROM {t} WHERE repo_id = %s", (rid,))
        table.add_row(t, str(row["n"]))
    console.print(table)

    edges = Table(title="edges by type")
    edges.add_column("rel")
    edges.add_column("src -> dst")
    edges.add_column("count", justify="right")
    for r in db.query(
        """SELECT rel, src_type, dst_type, count(*) AS n FROM edges
           WHERE repo_id = %s GROUP BY 1,2,3 ORDER BY 4 DESC""",
        (rid,),
    ):
        edges.add_row(r["rel"], f"{r['src_type']} -> {r['dst_type']}", str(r["n"]))
    console.print(edges)


@app.command("extract")
def extract_cmd(
    repo: str = typer.Argument(None),
    min_comments: int = typer.Option(3, "--min-comments", help="skip thin threads"),
    limit: int = typer.Option(None, "--limit", help="cap threads (testing)"),
) -> None:
    """Extract decisions from discussions into the interpreted layer."""
    from . import extract as extract_mod

    repo = repo or _cfg.target_repo
    rid = graph.repo_id_for(repo)
    if not rid:
        console.print(f"[red]{repo} not ingested[/red]")
        raise typer.Exit(1)

    stats = extract_mod.extract(rid, min_comments=min_comments, limit=limit)

    # Embed here rather than leaving it to `supersede`. Retrieval filters on
    # `embedding IS NOT NULL`, so an un-embedded decision is invisible to the graph arm
    # -- which showed up as the as-of mode silently degrading to semantic search because
    # a different command had not been run yet. Extraction owns its own rows.
    from . import supersede as sup
    embedded = sup._embed_missing(rid)

    table = Table(title="extraction")
    table.add_column("metric")
    table.add_column("value", justify="right")
    for k, v in stats.items():
        table.add_row(k, str(v))
    table.add_row("embedded", str(embedded))
    console.print(table)


@app.command("supersede")
def supersede_cmd(
    repo: str = typer.Argument(None),
    max_distance: float = typer.Option(0.45, "--max-distance"),
    min_confidence: float = typer.Option(0.7, "--min-confidence"),
) -> None:
    """Detect superseded decisions and close their validity intervals."""
    from . import supersede as sup

    repo = repo or _cfg.target_repo
    rid = graph.repo_id_for(repo)
    if not rid:
        console.print(f"[red]{repo} not ingested[/red]")
        raise typer.Exit(1)

    stats = sup.detect(rid, max_distance=max_distance, min_confidence=min_confidence)
    table = Table(title="supersession")
    table.add_column("metric")
    table.add_column("value", justify="right")
    for k, v in stats.items():
        table.add_row(k, str(v))
    console.print(table)


@app.command("as-of")
def as_of_cmd(
    when: str = typer.Argument(..., help="date, e.g. 2019-08-01"),
    repo: str = typer.Argument(None),
    scope: str = typer.Option(None, "--scope"),
) -> None:
    """What the project believed at a point in time.

    The query the bitemporal design exists for: filters on VALID time, so a decision
    counts only if it was made by then and had not yet been superseded.
    """
    from . import supersede as sup

    repo = repo or _cfg.target_repo
    rid = graph.repo_id_for(repo)
    if not rid:
        console.print(f"[red]{repo} not ingested[/red]")
        raise typer.Exit(1)

    rows = sup.as_of(rid, when, scope=scope)
    table = Table(title=f"believed as of {when} - {repo}")
    table.add_column("since")
    table.add_column("scope")
    table.add_column("decision")
    for r in rows[:40]:
        table.add_row(f"{r['valid_from']:%Y-%m}", r["scope"] or "", r["statement"][:88])
    console.print(table)
    console.print(f"{len(rows)} decisions in force")


@app.command("questions")
def questions_cmd(
    repo: str = typer.Argument(None),
    single: int = typer.Option(15, "--single"),
    multi: int = typer.Option(15, "--multi"),
    temporal: int = typer.Option(10, "--temporal"),
    recurrence: int = typer.Option(10, "--recurrence"),
) -> None:
    """Draft evaluation questions grounded in the graph.

    Writes candidates to eval/questions.draft.json for hand-editing. These are a
    starting point, not the evaluation set -- the final set should be human-owned.
    """
    from . import questions as q

    repo = repo or _cfg.target_repo
    rid = graph.repo_id_for(repo)
    if not rid:
        console.print(f"[red]{repo} not ingested[/red]")
        raise typer.Exit(1)

    drafted = q.draft(rid, single=single, multi=multi,
                      temporal=temporal, recurrence=recurrence)
    path = q.write(drafted)

    counts: dict[str, int] = {}
    for item in drafted:
        counts[item["category"]] = counts.get(item["category"], 0) + 1

    table = Table(title=f"drafted {len(drafted)} candidate questions")
    table.add_column("category")
    table.add_column("count", justify="right")
    for k, v in sorted(counts.items()):
        table.add_row(k, str(v))
    console.print(table)
    console.print(f"[yellow]draft[/yellow] written to {path}")
    console.print("Review and edit by hand before using as an evaluation set.")


@app.command("index")
def index_cmd(repo: str = typer.Argument(None)) -> None:
    """Build the vector-RAG baseline corpus (chunks + embeddings)."""
    from . import baseline

    repo = repo or _cfg.target_repo
    rid = graph.repo_id_for(repo)
    if not rid:
        console.print(f"[red]{repo} not ingested[/red]")
        raise typer.Exit(1)

    stats = baseline.build(rid)
    table = Table(title="baseline corpus")
    table.add_column("metric")
    table.add_column("value", justify="right")
    for k, v in stats.items():
        table.add_row(k, str(v))
    console.print(table)


@app.command("ask")
def ask_cmd(
    question: str = typer.Argument(...),
    repo: str = typer.Argument(None),
    k: int = typer.Option(8, "--k"),
    arm: str = typer.Option("both", "--arm", help="graph | vector | both"),
) -> None:
    """Ask both retrieval arms the same question and show them side by side.

    The comparison is the deliverable, so the default runs both. Retrieval mode is
    printed for the graph arm because a temporal win means nothing without evidence that
    the question actually took the as-of path.
    """
    from . import baseline, graphrag

    repo = repo or _cfg.target_repo
    rid = graph.repo_id_for(repo)
    if not rid:
        console.print(f"[red]{repo} not ingested[/red]")
        raise typer.Exit(1)

    if arm in ("graph", "both"):
        g = graphrag.answer(rid, question, k=k)
        console.print("[bold cyan]GRAPH[/bold cyan] "
                      f"[dim]modes={'+'.join(g['modes'])} "
                      f"anchor={g['anchor'] or '-'} as_of={g['as_of'] or '-'} "
                      f"context={g['context_chars']} chars[/dim]")
        console.print(g["answer"] + "\n")

    if arm in ("vector", "both"):
        v = baseline.answer(rid, question, k=k)
        console.print("[bold magenta]VECTOR[/bold magenta] "
                      f"[dim]{len(v['chunks'])} chunks from "
                      f"{len({c['number'] for c in v['chunks']})} threads, "
                      f"context={v['context_chars']} chars[/dim]")
        console.print(v["answer"])


if __name__ == "__main__":
    app()
