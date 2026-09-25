# KIARO — Multi-Level Engineering Intelligence & Agile Platform

> **Branch: `shruti1`**  
> An engineering intelligence and multi-level project management platform over GitHub history. Reconstructs **why** codebases evolve using a bitemporal knowledge graph, integrated natively with **multi-level work hierarchies, agile boards, and velocity reports**.

---

## 🌟 What This Platform Does

Traditional Git logs record *what* changed, while standard issue trackers only record *what* needs to be built. **KIARO** unifies delivery tracking with architectural reasoning:

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

### Key Questions Answered:
* **Multi-Level Hierarchy:** How do daily sub-tasks and pull requests roll up into high-level enterprise Objectives?
* **Architectural Reasoning:** Why was authentication switched from sessions to JWTs? (Walk back from the file to historical decisions and discussion).
* **Delivery Predictability:** What is our team's average velocity across multi-repository sprints?
* **Decision Drift:** Does an open Pull Request contradict past architectural choices before being merged?

---

## 🚀 Features (Agile Project Management + KIARO Intelligence)

### 1. Multi-Level Work Hierarchy
* Seamlessly manage work across 5 distinct tiers:  
  **`Objectives` $\rightarrow$ `Projects` $\rightarrow$ `Epics` $\rightarrow$ `Tasks / Bugs` $\rightarrow$ `Sub-tasks`**.
* Interactive tree explorer with automated progress rollups, story point totals, and status tracking.

### 2. Multi-Repository Agile Kanban Board
* 6-column automated workflow pipeline:
  * `New Issues` $\rightarrow$ `Product Backlog` $\rightarrow$ `Sprint Backlog` $\rightarrow$ `In Progress [WIP: 3]` $\rightarrow$ `In Review` $\rightarrow$ `Done`.
* **WIP Limits:** Automatic warnings when work-in-progress exceeds team threshold.
* **Story Point Estimations:** Fibonacci scoring ($1, 2, 3, 5, 8, 13\text{ pts}$).
* **Interactive Drawer Modal:** Click any card to inspect full hierarchy breadcrumbs, blockers, and decisions.

### 3. Sprint Velocity & Burndown Analytics
* **Sprint Burndown Chart:** Visual ideal vs. actual remaining points over the 14-day sprint.
* **Velocity Tracking:** 3-month rolling velocity tracking ($23\text{ story points}$ team average, $91\%\text{ predictability}$).
* **Agile KPIs:** Mean Cycle Time ($2.8\text{d}$), Mean Lead Time ($6.2\text{d}$), and PR Review Turnaround ($18\text{h}$).

### 4. Interactive Planning Poker & Consensus Sync
* Interactive Fibonacci estimation room allowing developers to vote anonymously, inspect team consensus, and apply story points directly to GitHub issues.

### 5. Multi-Repo Releases & Milestone Tracking
* Track cross-repository release targets (e.g. `v2.0.0-rc1 Enterprise Intelligence`) with scope creep tracking (+4 pts post-freeze) and burnup progress.

### 6. Visual Dependencies & Blockers Matrix
* Map cross-repository prerequisite chains (e.g. `PR-147` unblocks `ISSUE-402`) to resolve bottlenecks before sprint execution.

### 7. Automated Workflow Rules Engine
* Configurable rule triggers (PR merge auto-closes issue, PR review moves to In Review, Blockers auto-flag sprint alerts).

### 8. KIARO PR Impact & Decision Drift Scanner
* **Decision Drift Index (DDI):** Detects divergence between current commit history and recorded architectural decisions.
* **Engineering Evolution Score (EES):** Evaluates modular stability, code review turnaround, and low file churn cycles.

### 9. Grounded Natural Language Search ("Ask KIARO AI")
* Natural language graph querying backed by deterministic citations and graph provenance.

---

## 💻 Quick Start: Running the Frontend

The modern Next.js frontend is **100% self-contained** and can be run immediately:

```powershell
# 1. Navigate to the frontend directory
cd frontend

# 2. Install dependencies (if not already installed)
npm install

# 3. Start the development server
npm run dev
```

Open **[http://localhost:3000](http://localhost:3000)** (or **[http://localhost:3000/demo](http://localhost:3000/demo)**) in your browser.

---

## 🐳 Backend & Database Setup

To run the background GitHub ingestion and Postgres knowledge graph engine:

### 1. Start the PostgreSQL Vector Database
```powershell
docker-compose up -d
```

### 2. Initialize Database Schema
```powershell
Get-Content schema.sql -Raw | docker exec -i kairo-db psql -U kairo -d kairo
```

### 3. Run the KIARO CLI
```powershell
# Health check
.\.venv\Scripts\kairo stats

# Ingest a repository (e.g. fastapi/fastapi)
.\.venv\Scripts\kairo ingest fastapi/fastapi --max-pages 10

# View file churn ranking
.\.venv\Scripts\kairo churn -n 15

# Traverse historical reasoning behind any file
.\.venv\Scripts\kairo history fastapi/applications.py
```

---

## 📁 Repository Structure

```
kairo/
├── frontend/                     # Next.js 16 + React 19 + Tailwind CSS Web UI
│   ├── src/app/
│   │   ├── demo/
│   │   │   ├── page.tsx          # Multi-Level Hierarchy, Board, Velocity & Reports
│   │   │   └── Tour.tsx          # Interactive Onboarding Walkthrough
│   │   ├── connect/page.tsx      # GitHub Repository Selector & Ingestion Portal
│   │   ├── page.tsx              # Modern Slate-Indigo Landing Page
│   │   ├── layout.tsx            # Root Layout with Google Geist Fonts
│   │   └── globals.css           # Custom Dark Slate Theme Styles
│   ├── package.json
│   └── tsconfig.json
├── src/kairo/                    # Python Backend & Knowledge Graph Engine
│   ├── cli.py                    # Typer CLI application
│   ├── graph.py                  # Multi-hop graph traversal
│   ├── ingest.py                 # GitHub API deterministic ingestion
│   ├── extract.py                # LLM decision extraction & validity intervals
│   └── db.py                     # PostgreSQL connection pool & pgvector queries
├── docker-compose.yml            # PostgreSQL 16 + pgvector container definition
├── schema.sql                    # Two-layer deterministic & interpreted graph schema
├── pyproject.toml                # Python package configuration
└── README.md                     # Project documentation
```

---

## 👥 Branch Information
* **Branch:** `shruti1`
* **Focus:** Multi-Level Project Management (Objectives $\rightarrow$ Projects $\rightarrow$ Epics $\rightarrow$ Tasks $\rightarrow$ Sub-tasks), Native Agile Integration, Independent UI, and Velocity Analytics.
