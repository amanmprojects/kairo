# KAIRO

Engineering intelligence over GitHub history. Reconstructs *why* a codebase looks the way
it does by building a temporal knowledge graph from commits, PRs, issues, and discussion,
then reasoning over it.

## What it does

Git records what changed. It does not record why. KAIRO reconstructs the reasoning by
connecting artifacts into a graph and traversing it:

    auth.py  <--MODIFIED--  PR #412  --CLOSES-->  Issue #388  <--COMMENTED_ON--  the argument

Questions this answers that a search box cannot:

- Why does the auth layer use JWTs? (walk back from the file to the discussion)
- Why does this file break constantly? (every PR that touched it, every issue they closed)
- What did the team believe about caching in March 2023? (temporal query -- see below)

## Status

Working: ingestion, deterministic graph, multi-hop traversal, CLI, decision extraction,
supersession detection (bitemporal intervals close).
Not built yet: hybrid retrieval, evaluation harness, DDI/EES metrics, frontend.

## Setup

    cp .env.example .env       # fill in keys
    docker-compose up -d
    docker exec -i kairo-db psql -U kairo -d kairo < schema.sql
    uv venv --python 3.11 && uv pip install -e .

`.env` needs an OpenAI-compatible endpoint (base URL, key, model) and a GitHub token
(github.com/settings/tokens, classic, scope `public_repo`). Without the token the API
allows 60 requests/hour instead of 5000, which is not enough to ingest a repo.

## Use

    kairo ingest fastapi/fastapi --max-pages 10   # omit --max-pages for full history
    kairo stats
    kairo churn -n 15
    kairo history src/click/core.py

## Web workspace

KAIRO also includes a responsive engineering-intelligence workspace. It exposes the
existing temporal graph as an evidence-backed Q&A surface, Codebase X-Ray, and a
deterministic pre-merge Change Impact Scan.

    kairo-web

Then open http://127.0.0.1:8000. Ingest a repository first; the workspace reads the
same PostgreSQL graph as the CLI and does not create a parallel data store.

## Architecture

Two graphs, deliberately kept in separate tables.

**Layer 1 -- deterministic** (`gh_*`, `edges`). Straight from the GitHub API. "PR #42
modified auth.py." Never wrong, no LLM involved.

**Layer 2 -- interpreted** (`decisions`, `decision_edges`). LLM-extracted. "Issue #17
decided to use JWTs over sessions." Every row can be wrong, so every row carries
`confidence`, `extracted_by`, and `source_span` -- the verbatim text it came from. That
last field is what lets the UI say "KAIRO thinks this *because of this comment*", turning
a hallucination from a silent lie into a visible, clickable one.

Conflating these layers is the main way a system like this starts quietly lying: the
skeleton feels solid, so the interpretations inherit unearned trust.

### Bitemporality

Decisions carry two independent time axes:

- **valid time** (`valid_from` / `valid_to` / `superseded_by`) -- when the fact was true
  in the world. A JWT decision made in Jan 2023 and reversed in Sep 2024 has a closed
  interval.
- **ingestion time** (`ingested_at`) -- when KAIRO learned it. Backfilling four years of
  history today gives thousands of rows with identical `ingested_at` and wildly different
  `valid_from`.

Both are needed to answer "what did the team believe in March 2023?" -- ask for decisions
whose validity interval *contains* that date, not ones created then. A vector store
cannot do this at all: embeddings have no representation of a fact ceasing to be true, so
a superseded decision retrieves exactly as well as a live one. That is "temporal
blindness", and it is the specific failure the evaluation targets.

### Stack

Postgres (+pgvector) for everything -- relational, vector, and graph. The proposal
specified Neo4j + Redis + Postgres; recursive CTEs cover the graph traversal and a job
table covers the queue, so one service replaces three. Fewer moving parts to break on
demo day.

No LangGraph. The extraction and retrieval pipelines are acyclic -- read, prompt, parse,
write -- so a graph orchestration framework adds indirection without benefit, and makes
the content-hash LLM cache harder to implement. Worth revisiting only if root-cause
reasoning later needs a genuine loop.

## Findings so far

**Hub domination is the central retrieval problem.** Unrestricted depth-3 traversal from
four unrelated files returned result sets overlapping 91-99% -- the walk had stopped being
about the start node. Cause: bridging through high-degree nodes (a commit touching 200
files, a changelog every release edits) connects everything to everything.

Two wrong diagnoses preceded the right one, both worth recording because they look
plausible: person nodes as hubs (filtering them changed almost nothing), and `PARENT`
commit-ancestry edges (removing them helped marginally). The actual mechanism is
`file -> commit -> file`, where any sweeping commit is a bridge.

Fix is `max_degree`: refuse to *expand through* nodes above a degree threshold, while
still returning them as answers when directly connected. Tuned on fastapi/fastapi
(1000 commits, 16k edges), Jaccard overlap across four unrelated source files:

    max_degree   avg nodes   overlap
    None               786       56%
    100                306       39%
    50                 203       37%
    30                 149       30%
    20                 130       27%     <- default
    10                  35        3%

**Two measurement traps**, both of which produced misleading numbers first. Normalising
overlap by `min(|A|,|B|)` makes aggressive pruning look *worse* -- small result sets of
shared core files score high -- so use Jaccard. And leaving `limit` at its default
truncates unsuppressed walks, flattering the baseline. Tuning on a 100-commit sample is
useless: every file is proportionally a hub, and the threshold has no working range.

**Result ordering decides answer quality.** `DISTINCT ON` must sort by its own key, so
without an outer `ORDER BY depth` the caller gets node-id order -- and depth-3 dependency
bumps outrank the depth-1 commits that actually changed the file. Before the fix,
`oauth2.py` returned ten "Bump python-packages" commits. After, it returns "OAuth2 scopes
revamped", "Implement OAuth2 authorization_code integration", "Use 401 with
WWW-Authenticate for OAuth2". Same graph, same traversal, entirely different usefulness.
This matters most when results are truncated to fit an LLM prompt.

**Hallucination is not the interesting failure mode; misattribution is.** The quote
filter (discard any decision whose verbatim quote is absent from the source) rejected 1
of 102 extractions -- a real but weak signal. The damaging error passed the filter
cleanly: "Switch from SQLAlchemy Core to PonyORM" was extracted as a FastAPI decision
from issue #891, where the quote is a *user* writing "I have found SQLAlchemy.core rather
difficult to work with and decided to go another route". The quote is genuinely present.
It is simply not evidence of a project decision.

The consequence was not cosmetic. That phantom decision then superseded three real
decisions about FastAPI's SQLAlchemy support, retroactively closing their validity
intervals -- so a query for "what did the team believe about SQLAlchemy in 2020?" would
have returned nothing, on the authority of one user's blog-post-in-a-comment.

Verbatim-quote verification proves evidence *exists*. It says nothing about whether the
speaker had authority to bind the project. The prompt now separates project decisions
from user experience reports, and issue #891 correctly yields zero decisions.

**Supersession detection has to be conservative by construction.** 57 candidate pairs
(cosine distance < 0.45, later-than-earlier only) produced 4 supersessions -- a 7% rate.
A detector that says yes often is the alarming outcome, not a stingy one: every false
positive closes an interval, and a closed interval silently deletes a period of history
from every temporal query. Embedding similarity is a recall filter feeding an LLM judge,
never the judge itself -- "will not support Pydantic models as query params" and "will not
support JSON-encoded complex types in query params" sit at distance 0.283 and are two
coexisting refusals, not a replacement.

**Timeline API over regex for PR->issue links.** Closing-keyword regex over titles and
bodies found 26 CLOSES edges across 1000 items. GitHub's timeline API -- which records
cross-references as events rather than prose -- found 186 across 1500 items, plus 394
MENTIONS. Links made in comments, through the UI, or via commits are invisible to the
regex. Three filters keep the edges honest: same-repo only (issue #12 collects
cross-references from unrelated tutorial repos, which would make every popular issue a
hub), PRs only for CLOSES, and the reference must precede the close.

**Bounded ingests silently desynchronise.** GitHub pages issues oldest-first and commits
newest-first, so `--max-pages 10` on both captured fastapi's *first* 1000 issues (2019)
and its *last* 1000 commits (2026) -- disjoint eras, 153 shared files, and no path from a
commit to the discussion that motivated it. Bounded runs now pin commits to the item
window with `until`. After the fix both halves span 2018-12 to 2020-06: 1500 items, 1065
commits, 4705 commit->file edges, and 266 files with four or more distinct item histories
-- the substrate multi-hop and recurrence questions need.

**Extraction confidence is not calibrated.** Across a full run the extractor emits only
three distinct values -- 1.0 (67%), 0.95, and 0.9 -- so `confidence` is a coarse
self-report, not a probability, and any extraction threshold below 0.9 is inert. It is
still worth storing for provenance, and it retains some discriminative power in
supersession detection, where the judge answers a harder yes/no question. Filtering bad
extractions has to be done by the prompt and by verification, not by thresholding a number
the model is not able to produce meaningfully.

**A competent baseline is a load-bearing part of the claim.** The vector arm indexes the
same 1500 threads into 7817 chunks with the same local embedding model, and it retrieves
well: "why use async def instead of def" returns the right thread at distance 0.334. It
also spends ~18% of its retrieval slots on repeat chunks from one thread, an honest cost
of chunk overlap. Any win the graph shows against this has to come from structure, because
the corpus, embeddings, and generator are held constant.

## Open questions

- **Ingestion scope.** Currently 1500 items and 1065 commits of fastapi/fastapi, spanning
  2018-12 to 2020-06. Full history is ~50k commits and days of wall-clock at 5000
  req/hour. The current slice covers the framework's formative period, which is where the
  interesting reversals are.
- **Extraction recall is unmeasured.** Precision is inspectable by reading the rows;
  recall needs threads hand-labelled for what *should* have been found. This is the
  weakest part of the evaluation and should be stated as such rather than hidden.
- **The evaluation question set is not yet human-reviewed.** `kairo questions` drafts
  candidates grounded in database rows so ground truth is checkable, but a set authored by
  the system under test is not a credible instrument until a person has cut and rewritten
  it. That review is owed before any number gets reported.

## Layout

    src/kairo/
      config.py    settings from .env
      db.py        psycopg wrapper, no ORM
      github.py    REST client, disk-cached, rate-limit aware
      ingest.py    GitHub -> Layer 1 + skeleton edges (no LLM)
      graph.py     recursive-CTE traversal, hub suppression, named queries
      llm.py       cached OpenAI-compatible wrapper
      cli.py       typer entry point

Every GitHub response and LLM completion is cached to `.cache/` by content hash. The first
ingest costs the full request budget; every re-run after it is free and instant. This is
also what makes results reproducible after the fact -- the cache is a frozen snapshot.
