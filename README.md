# KIARO — Bitemporal Engineering Intelligence & Agile Delivery Platform

> **Branch: `shruti1`**  
> An engineering intelligence and multi-level project management platform over GitHub history. Reconstructs **why** codebases evolve using a bitemporal knowledge graph, integrated natively with **multi-level work hierarchies, agile boards, and velocity reports**.

---

## 📑 Table of Contents
1. [Overview & What KIARO Does](#-overview--what-kiaro-does)
2. [Dual Architecture: Deterministic Substrate + Interpreted Decisions](#-dual-architecture)
   - [Layer 1: Deterministic Facts](#layer-1--deterministic-facts)
   - [Layer 2: Interpreted Decisions](#layer-2--interpreted-decisions)
   - [Bitemporality: Valid Time vs. Ingestion Time](#bitemporality-valid-time-vs-ingestion-time)
   - [Technology Stack](#technology-stack)
3. [Hard-Won Findings & Failure Modes](#-hard-won-findings--failure-modes)
4. [Agile Project Management Suite](#-agile-project-management-suite)
   - [Multi-Level Work Hierarchy (5 Tiers)](#1-multi-level-work-hierarchy-5-tiers)
   - [Multi-Repository Agile Kanban Board](#2-multi-repository-agile-kanban-board)
   - [Sprint Velocity & Burndown Analytics](#3-sprint-velocity--burndown-analytics)
   - [Planning Poker & Story Estimation](#4-planning-poker--story-estimation)
   - [Releases, Dependencies & Workflow Rules](#5-releases-dependencies--workflow-rules)
5. [Quick Start: Running the Frontend UI](#-quick-start-running-the-frontend-ui)
6. [Backend, Database & Ingestion Setup](#-backend-database--ingestion-setup)
   - [CLI Commands & Usage](#cli-commands--usage)
7. [Evaluation & Baseline Comparison](#-evaluation--baseline-comparison)
8. [Open Questions](#-open-questions)
9. [Repository File Layout](#-repository-file-layout)

---

## 🌟 Overview & What KIARO Does

Traditional Git logs record *what* changed, while standard issue trackers only record *what* needs to be built. Neither system records **why** design decisions were made, nor do they notify developers when an upcoming change contradicts past architectural intent.

**KIARO** bridges this fundamental gap by connecting code, discussion, and delivery into a unified bitemporal knowledge graph:

```
[ Objective ] ──> [ Project ] ──> [ Epic ] ──> [ Issue / PR #142 ] ──> [ Sub-tasks ]
                                                        │
                                                  (MODIFIED)
                                                        ▼
                                                  auth_middleware.py
                                                        │
                                                  (CONTRADICTS)
                                                        ▼
                                              Decision #42 (Stateless JWTs)
```

### Questions This Answers That Search Boxes & Issue Trackers Cannot:
- **Architectural Traceability:** Why does the authentication layer use stateless JWTs instead of Redis sessions? (*Walk back from the file to the historical PR discussion and recorded decision*).
- **Failure Hotspot Reasoning:** Why does a particular module break constantly across releases? (*Trace every PR that touched it, every issue it closed, and related commits*).
- **Temporal Querying ("As-Of" History):** What did the team believe about caching in March 2023? (*Filters on decisions whose validity interval contained that date, avoiding temporal blindness*).
- **Decision Drift Alerts:** Does an open Pull Request violate an active architectural invariant before being merged into production?
- **Multi-Level Alignment:** How do daily sub-tasks and pull requests roll up into high-level enterprise Objectives and executive milestones?

---

## 🏗 Dual Architecture

KAIRO maintains two distinct graphs, deliberately isolated into physically separate database tables:

```
                                 ┌────────────────────────┐
                                 │   GitHub API Ingest    │
                                 └───────────┬────────────┘
                                             │
                       ┌─────────────────────┴─────────────────────┐
                       ▼                                           ▼
       ┌───────────────────────────────┐           ┌───────────────────────────────┐
       │     Layer 1: Deterministic    │           │     Layer 2: Interpreted      │
       │     (gh_*, edges)             │           │     (decisions, supersessions)│
       ├───────────────────────────────┤           ├───────────────────────────────┤
       │ • Commits, PRs, Issues, Files │           │ • LLM-extracted decisions     │
       │ • Verifiable facts only       │           │ • Carries confidence & span   │
       │ • Zero hallucination risk     │           │ • Bitemporal validity window  │
       └───────────────┬───────────────┘           └───────────────┬───────────────┘
                       │                                           │
                       └─────────────────────┬─────────────────────┘
                                             ▼
                               ┌───────────────────────────┐
                               │ Recursive CTE Traversal   │
                               │  + pgvector Semantic RAG  │
                               └─────────────┬─────────────┘
                                             ▼
                               ┌───────────────────────────┐
                               │ KIARO Enterprise Web UI   │
                               │  & Multi-Level Hierarchy  │
                               └───────────────────────────┘
```

### Layer 1 -- Deterministic Facts
Stored in tables `gh_*` and `edges`. Built straight from the GitHub API:
- "PR #42 modified `auth.py`"
- "Issue #388 was closed by PR #412"
- "Commit `a1b2c3d` authored by Jane Doe touched `config.py`"
*Characteristics:* Always accurate, deterministic, and free of LLM hallucinations.

### Layer 2 -- Interpreted Decisions
Stored in tables `decisions` and `decision_edges`. Extracted using structured LLM prompts:
- "Issue #17 decided to use JWTs over sessions."
*Characteristics:* Every row carries verifiable provenance:
- `confidence`: extraction confidence metric
- `extracted_by`: extraction model identifier
- `source_span`: exact verbatim text quote from the source comment or PR
*Why this matters:* The UI can display **"KIARO flagged this because of this exact comment"**, transforming potential hallucinations into inspectable, clickable evidence.

### Bitemporality: Valid Time vs. Ingestion Time
Decisions carry two independent time axes:
1. **Valid Time** (`valid_from` / `valid_to` / `superseded_by`): When the decision was active and true in the project. A decision adopted in Jan 2023 and superseded in Sep 2024 has a closed interval `[2023-01, 2024-09]`.
2. **Ingestion Time** (`ingested_at`): When KIARO indexed the repository. Ingesting four years of git history in a single day yields identical `ingested_at` timestamps but widely varying `valid_from` windows.

> **Why Vector Search Alone Fails (Temporal Blindness):**  
> Embeddings have no concept of time or supersession. An embedding for a deprecated 2020 decision matches a query just as strongly as a 2025 decision. KIARO solves this by filtering on validity intervals in SQL before ranking by semantic relevance.

### Technology Stack
- **Database:** PostgreSQL 16 + `pgvector` for relational data, graph traversal via recursive CTEs, and vector embeddings in a single resilient store (replacing fragile Neo4j + Redis architectures).
- **Core Engine:** Python 3.11 with Typer CLI, psycopg connection pooling, and disk-cached LLM client (`.cache/`).
- **Web Interface:** Next.js 16 (App Router), React 19, Tailwind CSS, Google Material Symbols, Newsreader, and Plus Jakarta Sans.

---

## 🔍 Hard-Won Findings & Failure Modes

During extensive indexing runs on complex open-source projects (such as `fastapi/fastapi`):

1. **Hub Domination is the Central Retrieval Problem:**  
   Unrestricted depth-3 traversals from unrelated files produced 91-99% overlapping results. Cause: bridging through high-degree nodes (e.g. a release commit editing 200 files) connects everything to everything.  
   *Fix:* Node degree suppression (`max_degree`). Refusing to expand through nodes above degree threshold cut cross-file overlap from 56% down to 27%.

2. **Result Ordering Decides Answer Quality:**  
   PostgreSQL `DISTINCT ON` sorts by its own key; without an outer `ORDER BY depth`, callers receive random node-id order. Sorting strictly by depth prioritizes depth-1 direct commits over depth-3 dependency bumps.

3. **Misattribution is More Dangerous Than Hallucination:**  
   Quote filters easily reject fabricated text. The catastrophic failure is attributing an external contributor's opinion as project policy. A contributor writing *"I found SQLAlchemy Core difficult so I used PonyORM"* passed verbatim-quote verification and almost superseded 3 legitimate FastAPI decisions.  
   *Fix:* Prompts explicitly discriminate based on speaker authority and binding intent.

4. **Conservative Supersession Detection:**  
   Every false-positive supersession closes an interval and permanently conceals historical decisions. Candidate filtering (cosine distance < 0.45) followed by conservative LLM judge validation maintains a strict 7% supersession rate.

5. **Timeline API Over Regex for PR-to-Issue Links:**  
   Regex over closing keywords found 26 `CLOSES` edges across 1000 items. GitHub's official Timeline API found 186 `CLOSES` and 394 `MENTIONS` edges, capturing links made in comments and commit references.

6. **Bounded Ingests Desynchronize:**  
   GitHub pages issues oldest-first and commits newest-first. A naive limit of 10 pages pairs 2019 issues with 2026 commits. Ingests now strictly pin commit time windows to item boundaries with `until`.

7. **Extraction Confidence Requires Verification:**  
   Raw LLM self-reported confidence clusters into coarse buckets (0.9, 0.95, 1.0). High-precision filtering must rely on prompt structure and quote verification rather than arbitrary numeric cutoffs.

8. **A Fair Baseline Matters:**  
   The vector comparison arm indexes identical threads using the same local embedding model. Any retrieval advantage demonstrated by KIARO originates from topological graph structure rather than prompt or model variance.

---

## 🚀 Agile Project Management Suite

In addition to core engineering intelligence, `shruti1` incorporates an enterprise-grade Agile Project Management suite:

### 1. Multi-Level Work Hierarchy (5 Tiers)
* Hierarchical decomposition across 5 distinct tiers:  
  $$\text{Objectives} \longrightarrow \text{Projects} \longrightarrow \text{Epics} \longrightarrow \text{Tasks / Issues} \longrightarrow \text{Sub-tasks}$$
* Automated story point rollups, completion percentage indicators, and expandable tree views.

### 2. Multi-Repository Agile Kanban Board
* 6-column delivery pipeline: `Backlog`, `Ready for Dev`, `In Progress` (with WIP limits), `In Review`, and `Done`.
* Fibonacci story point scoring ($1, 2, 3, 5, 8, 13$).
* Interactive drawer modals displaying full hierarchy breadcrumbs, assignees, linked PRs, and architectural risks.

### 3. Sprint Velocity & Burndown Analytics
* **Sprint Burndown Chart:** Visual ideal vs. actual remaining points over the 14-day cadence.
* **Rolling Velocity:** 3-month velocity tracking ($23\text{ pts}$ average, $91\%\text{ predictability}$).
* **Agile KPIs:** Mean Cycle Time ($2.8\text{d}$), Mean Lead Time ($6.2\text{d}$), and PR Review Turnaround ($18\text{h}$).

### 4. Planning Poker & Story Estimation
* Interactive Fibonacci estimation room allowing developers to vote, inspect team consensus, and apply story points directly to GitHub issues.

### 5. Releases, Dependencies & Workflow Rules
* **Releases Hub:** Track multi-repo milestones (e.g. `v2.0.0-rc1 Enterprise Intelligence`) with scope creep tracking (+4 pts post-freeze).
* **Dependencies Matrix:** Map prerequisite chains (e.g. `PR-147` unblocks `ISSUE-402`).
* **Automated Rules Engine:** Automatic status progression when PRs open, pass review, or merge.

---

## 💻 Quick Start: Running the Frontend UI

The Next.js 16 frontend is self-contained:

```powershell
# 1. Navigate to frontend directory
cd frontend

# 2. Install dependencies
npm install

# 3. Start development server
npm run dev
```

Open **[http://localhost:3000](http://localhost:3000)** (or **[http://localhost:3000/demo](http://localhost:3000/demo)**) in your browser.

- Launch the interactive product tour by clicking the **Walkthrough** button in the top navigation bar.
- Switch between **Overview & Portfolio**, **Roadmap & Sprints**, **Active Tasks & Board**, **Team & Capacity**, and **Analytics & Velocity**.
- Open the **Intelligence & Tools** drawer to explore **PR Drift & Invariants** and **Ask KIARO AI**.

---

## 🐳 Backend, Database & Ingestion Setup

### 1. Prerequisites
- Docker & Docker Compose
- Python 3.11+
- GitHub Personal Access Token (classic, `public_repo` scope)

### 2. Initialize Database & Virtual Environment
```powershell
# 1. Copy environment variables
cp .env.example .env

# 2. Start PostgreSQL with pgvector
docker-compose up -d

# 3. Apply database schema
Get-Content schema.sql -Raw | docker exec -i kairo-db psql -U kairo -d kairo

# 4. Create virtual environment and install packages
python -m venv .venv
.\.venv\Scripts\activate
pip install -e .
```

### CLI Commands & Usage

```powershell
# Check database and ingestion status
kairo stats

# Ingest repository history (e.g., fastapi/fastapi)
kairo ingest fastapi/fastapi --max-pages 10

# Analyze file churn hotspots
kairo churn -n 15

# Inspect historical reasoning behind any source file
kairo history fastapi/applications.py

# Query the temporal knowledge graph
kairo ask "Why was authentication switched to JWT?"

# Run comparative evaluation against vector baseline
kairo eval
```

---

## 📊 Evaluation & Baseline Comparison

KAIRO includes an evaluation harness comparing GraphRAG against a dense vector baseline on temporal and multi-hop queries:

| Query Type | Dense Vector Baseline | KIARO GraphRAG | Key Advantage |
| :--- | :--- | :--- | :--- |
| **Direct Semantic Search** | High accuracy | High accuracy | Parity on direct lookups |
| **Multi-Hop Traversal** | Fails (isolated chunks) | High accuracy | Follows `file -> commit -> PR -> issue` edges |
| **Superseded Decisions** | Retrieves obsolete data | Filters by validity | Bitemporal awareness prevents outdated answers |

---

## ❓ Open Questions

- **Ingestion Scope:** Currently validated on slices of 1500 items and 1065 commits. Full histories of mature frameworks (~50k commits) require chunked background workers.
- **Extraction Recall:** Precision is verified through quote spans; formal recall measurement requires hand-annotated ground-truth corpuses.
- **Evaluation Question Review:** Synthetic questions are drafted from database rows; human validation ensures question difficulty and realism.

---

## 📁 Repository File Layout

```
kairo/
├── frontend/                     # Next.js 16 + React 19 + Tailwind CSS Web UI
│   ├── src/app/
│   │   ├── demo/
│   │   │   ├── page.tsx          # Multi-Level Hierarchy, Board, Velocity & Executive Dashboard
│   │   │   └── Tour.tsx          # Interactive Onboarding Walkthrough
│   │   ├── connect/page.tsx      # GitHub Repository Selector & Ingestion Portal
│   │   ├── page.tsx              # Landing Page with Feature Matrix
│   │   ├── layout.tsx            # Root Layout with Plus Jakarta Sans & Material Symbols
│   │   └── globals.css           # Linearis Enterprise Color Tokens & Styles
│   ├── package.json
│   └── tsconfig.json
├── src/kairo/                    # Python Backend & Knowledge Graph Engine
│   ├── baseline.py               # Vector baseline implementation for evaluation
│   ├── cli.py                    # Typer CLI application entry point
│   ├── config.py                 # Configuration and environment management
│   ├── db.py                     # PostgreSQL connection pool and query helpers
│   ├── evaluate.py               # Head-to-head evaluation harness
│   ├── extract.py                # LLM decision extraction & verbatim verification
│   ├── github.py                 # Disk-cached, rate-limit aware GitHub client
│   ├── graph.py                  # Recursive-CTE graph traversal & hub suppression
│   ├── graphrag.py               # 3-mode GraphRAG answer synthesis
│   ├── ingest.py                 # Deterministic Layer 1 ingestion engine
│   ├── llm.py                    # Cached LLM wrapper
│   ├── questions.py              # Grounded synthetic evaluation question generator
│   └── supersede.py              # Bitemporal supersession detection
├── docker-compose.yml            # PostgreSQL 16 + pgvector container definition
├── schema.sql                    # Two-layer deterministic & interpreted graph schema
├── pyproject.toml                # Python package build specifications
└── README.md                     # Comprehensive system documentation
```

---

## 👥 Branch Information
* **Branch:** `shruti1`
* **Features:** Bitemporal Knowledge Graph, Executive Portfolio Overview, Multi-Level Work Hierarchy (5 Tiers), Native Agile Kanban, Sprint Velocity Analytics, and Linearis Enterprise Design System.
