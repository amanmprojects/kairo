"""Run both arms over the question set and score them.

WHAT MAKES A COMPARISON MEAN ANYTHING. Both arms get the same corpus, the same embedding
model, the same generator, and the same k. The only difference is how context is selected.
That is the entire experimental variable, and everything here exists to keep it that way.

SCORING. An LLM judge, given the question, the ground truth, and one answer at a time.
Three properties, each chosen because it fails differently:

  correct     Does the answer match the ground truth? The headline number.
  grounded    Is it supported by retrieved context, or invented? Separates a retrieval
              failure from a generation failure -- a system that retrieves nothing and
              then guesses correctly should not be credited with a win.
  temporal    Only asked of temporal questions: does the answer respect the period the
              question asked about? A system can be "correct" about today's state and
              still wrong about March 2019, and averaging that into `correct` alone would
              hide the exact effect this project is about.

WHY BLIND, AND WHY ONE AT A TIME. The judge is never told which arm produced an answer,
and never sees the two answers together. Told the arms apart, a judge can flatter the
elaborate one; shown both at once, position bias and direct comparison creep in. Judging
each answer against the ground truth alone keeps the two scores independent.

WHAT WOULD FALSIFY THE CLAIM. If the graph does not beat the baseline on `temporal` and
`multi_hop`, the claim is wrong and the write-up says so. Per-category results are
reported separately for exactly this reason: a single blended average lets a win in one
category paper over a loss in another, which is how an evaluation flatters its author.
The baseline is expected to win or tie on `single_hop`, and that result is kept.
"""

from __future__ import annotations

import json
from pathlib import Path
from typing import Any

from rich.console import Console
from rich.progress import BarColumn, Progress, SpinnerColumn, TaskProgressColumn, TextColumn

from . import baseline, config, graphrag, llm

console = Console()

JUDGE_SYSTEM = """You grade one answer to a question about a software project's history.

You are given the QUESTION, the REFERENCE ANSWER (ground truth, derived from the
project's database and treated as correct), and a CANDIDATE ANSWER from a retrieval
system.

Grade only the candidate against the reference. You do not know which system produced it.

  correct    true if the candidate conveys the substance of the reference answer.
             Wording may differ freely. Extra detail is fine if it does not contradict.
             A candidate that says it has no information is NOT correct.

  grounded   true if the candidate's claims are specific and consistent with the
             reference. false if it is vague filler, or asserts specifics that the
             reference contradicts.

  temporal   Only if the question asks about a specific time. true if the answer reflects
             what was true THEN. A candidate describing a later state of the world is
             temporally wrong even if that later state is accurate today.
             Use null when the question is not time-scoped.

Honestly reporting a lack of information is better than a confident wrong answer: score
it correct=false, grounded=true.

Return JSON:
{
  "correct": true or false,
  "grounded": true or false,
  "temporal": true or false or null,
  "reasoning": "one sentence"
}"""


def _judge(question: str, reference: str, candidate: str,
           model: str | None = None) -> dict[str, Any] | None:
    prompt = (
        f"QUESTION: {question}\n\n"
        f"REFERENCE ANSWER: {reference}\n\n"
        f"CANDIDATE ANSWER: {candidate}\n\n"
        "Grade the candidate."
    )
    try:
        result = llm.complete_json(prompt, system=JUDGE_SYSTEM, model=model)
    except Exception as e:
        console.print(f"  [yellow]judge failed: {type(e).__name__}[/yellow]")
        return None
    return result if isinstance(result, dict) else None


def load_questions(path: Path | None = None) -> list[dict]:
    """Load the question set, preferring the hand-reviewed file over the draft.

    `questions.json` is the human-owned set; `questions.draft.json` is machine output.
    Preferring the former means that once a person has curated the set, an evaluation run
    cannot silently fall back to ungraded generated questions -- but it still works before
    that curation happens, with a warning loud enough to keep the distinction honest.
    """
    if path:
        return json.loads(path.read_text())

    curated = config.ROOT / "eval" / "questions.json"
    if curated.exists():
        rows = json.loads(curated.read_text())
        return [q for q in rows if q.get("status") != "rejected"]

    draft = config.ROOT / "eval" / "questions.draft.json"
    if not draft.exists():
        raise FileNotFoundError(
            "no question set found; run `kairo questions` to draft one"
        )
    console.print(
        "[yellow]using questions.draft.json -- machine-generated and not yet "
        "human-reviewed. Results are indicative, not final.[/yellow]"
    )
    return json.loads(draft.read_text())


def run(
    repo_id: int,
    *,
    k: int = 8,
    limit: int | None = None,
    model: str | None = None,
    questions_path: Path | None = None,
) -> dict[str, Any]:
    """Answer every question with both arms, judge blind, return per-category results."""
    questions = load_questions(questions_path)
    if limit:
        questions = questions[:limit]

    results: list[dict] = []
    with Progress(
        SpinnerColumn(), TextColumn("[progress.description]{task.description}"),
        BarColumn(), TaskProgressColumn(), console=console,
    ) as prog:
        task = prog.add_task("  questions", total=len(questions))
        for q in questions:
            question, reference = q["question"], str(q["ground_truth"])

            # Both arms answer the same question with the same k and the same generator.
            g = graphrag.answer(repo_id, question, k=k, model=model)
            b = baseline.answer(repo_id, question, k=k, model=model)

            row = {
                "id": q.get("id"),
                "category": q.get("category"),
                "question": question,
                "ground_truth": reference,
                "graph": {
                    "answer": g["answer"],
                    "modes": g.get("modes"),
                    "context_chars": g.get("context_chars"),
                    "grade": _judge(question, reference, g["answer"], model=model),
                },
                "baseline": {
                    "answer": b["answer"],
                    "context_chars": b.get("context_chars"),
                    "grade": _judge(question, reference, b["answer"], model=model),
                },
            }
            results.append(row)
            prog.advance(task)

    return {"results": results, "summary": summarise(results)}


def summarise(results: list[dict]) -> dict[str, Any]:
    """Per-category scores for each arm, plus counts of judge failures.

    Per-category is the only shape that can falsify the claim. A blended average would
    let a graph win on multi_hop paper over a baseline win on single_hop, and the whole
    point of the evaluation is that the two systems are good at different things.
    """
    cats: dict[str, dict[str, Any]] = {}
    for r in results:
        cat = r["category"]
        c = cats.setdefault(cat, {"n": 0,
                                  "g": {"correct": 0, "grounded": 0, "temporal": 0},
                                  "b": {"correct": 0, "grounded": 0, "temporal": 0},
                                  "temporal_n": 0, "judge_failures": 0})
        c["n"] += 1

        # `temporal` is null on questions that are not time-scoped, so it needs its own
        # denominator. Dividing it by the category size would report 0.0 -- indistinguishable
        # from "got every temporal question wrong" -- on categories where the judge was
        # never asked the question at all.
        if any(r[a]["grade"] and r[a]["grade"].get("temporal") is not None
               for a in ("graph", "baseline")):
            c["temporal_n"] += 1

        for arm, prefix in (("graph", "g"), ("baseline", "b")):
            grade = r[arm]["grade"]
            if grade is None:
                c["judge_failures"] += 1
                continue
            for key in ("correct", "grounded", "temporal"):
                if grade.get(key) is True:
                    c[prefix][key] += 1

    summary: dict[str, Any] = {}
    for cat, c in sorted(cats.items()):
        n, tn = c["n"], c["temporal_n"]

        def scores(p: str) -> dict[str, Any]:
            out: dict[str, Any] = {
                "correct": round(c[p]["correct"] / n, 3),
                "grounded": round(c[p]["grounded"] / n, 3),
            }
            out["temporal"] = round(c[p]["temporal"] / tn, 3) if tn else None
            return out

        summary[cat] = {
            "n": n,
            "temporal_n": tn,
            "graph": scores("g"),
            "baseline": scores("b"),
            "judge_failures": c["judge_failures"],
        }
    summary["total"] = {"n": len(results)}
    return summary


def write(payload: dict[str, Any], path: Path | None = None) -> Path:
    """Persist the full run, per-question answers included.

    The summary alone is not a result anyone should trust. Keeping every answer and every
    judge rationale means a surprising number can be traced to the specific question that
    produced it -- and a reader who disagrees with the judge can check it.
    """
    path = path or config.ROOT / "eval" / "results.json"
    path.parent.mkdir(parents=True, exist_ok=True)
    path.write_text(json.dumps(payload, indent=2, default=str))
    return path


