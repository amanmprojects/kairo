-- KAIRO schema
--
-- The single most important idea in this file: there are TWO graphs here, and they are
-- kept physically separate because they have completely different reliability profiles.
--
--   LAYER 1 (deterministic)  -- tables prefixed `gh_` and the `edges` table.
--     Straight from the GitHub API. "PR #42 modified auth.py", "Aman authored PR #42".
--     These are never wrong. No LLM ever touches them.
--
--   LAYER 2 (interpreted)    -- `decisions`, `decision_edges`.
--     LLM-extracted. "Issue #17 decided to use JWTs over sessions." Every row can be
--     wrong, so every row carries provenance: which model produced it, how confident it
--     was, and the exact source text it came from.
--
-- Conflating these is the main way a project like this quietly starts lying. The
-- skeleton feels solid, so the interpretations inherit unearned trust. Separate tables
-- make the boundary impossible to forget, and let the UI render interpreted claims with
-- a "because of THIS comment" link the user can click and disagree with.

CREATE EXTENSION IF NOT EXISTS vector;

-- ============================================================================
-- LAYER 1: DETERMINISTIC
-- ============================================================================

CREATE TABLE repos (
    id           BIGSERIAL PRIMARY KEY,
    full_name    TEXT NOT NULL UNIQUE,        -- "fastapi/fastapi"
    ingested_at  TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE people (
    id           BIGSERIAL PRIMARY KEY,
    repo_id      BIGINT NOT NULL REFERENCES repos(id) ON DELETE CASCADE,
    login        TEXT NOT NULL,
    UNIQUE (repo_id, login)
);

-- Files are tracked by path. Renames are a known wrinkle: git records them as
-- delete+add, so a renamed file becomes a new node and history appears to stop at the
-- rename. Handled later via GitHub's rename detection -> `files.renamed_from`.
CREATE TABLE files (
    id           BIGSERIAL PRIMARY KEY,
    repo_id      BIGINT NOT NULL REFERENCES repos(id) ON DELETE CASCADE,
    path         TEXT NOT NULL,
    renamed_from BIGINT REFERENCES files(id),
    UNIQUE (repo_id, path)
);

CREATE TABLE commits (
    id           BIGSERIAL PRIMARY KEY,
    repo_id      BIGINT NOT NULL REFERENCES repos(id) ON DELETE CASCADE,
    sha          TEXT NOT NULL,
    author_id    BIGINT REFERENCES people(id),
    message      TEXT NOT NULL,
    committed_at TIMESTAMPTZ NOT NULL,
    UNIQUE (repo_id, sha)
);

-- PRs and issues share a table: on GitHub they share a number space, and unifying them
-- keeps cross-references (a PR closing an issue) simple to traverse.
CREATE TABLE items (
    id           BIGSERIAL PRIMARY KEY,
    repo_id      BIGINT NOT NULL REFERENCES repos(id) ON DELETE CASCADE,
    number       INTEGER NOT NULL,
    kind         TEXT NOT NULL CHECK (kind IN ('pr', 'issue')),
    title        TEXT NOT NULL,
    body         TEXT,
    state        TEXT NOT NULL,
    author_id    BIGINT REFERENCES people(id),
    created_at   TIMESTAMPTZ NOT NULL,
    closed_at    TIMESTAMPTZ,
    merged_at    TIMESTAMPTZ,
    UNIQUE (repo_id, number)
);

-- Comments and review comments. This is the prose corpus the interpretation layer reads,
-- and the main thing the vector-RAG baseline will be built over.
CREATE TABLE comments (
    id           BIGSERIAL PRIMARY KEY,
    repo_id      BIGINT NOT NULL REFERENCES repos(id) ON DELETE CASCADE,
    item_id      BIGINT NOT NULL REFERENCES items(id) ON DELETE CASCADE,
    author_id    BIGINT REFERENCES people(id),
    body         TEXT NOT NULL,
    created_at   TIMESTAMPTZ NOT NULL,
    is_review    BOOLEAN NOT NULL DEFAULT FALSE,
    github_id    BIGINT NOT NULL,
    UNIQUE (repo_id, github_id, is_review)
);

-- The deterministic edge table. Generic (src_type, src_id) -> (dst_type, dst_id) so one
-- recursive CTE can traverse everything without a UNION per relationship type.
--
-- `occurred_at` is when the relationship came into being in the real world. Layer 1
-- facts don't get retracted -- a commit that touched a file always touched it -- so
-- these need only one time axis. Layer 2 is where bitemporality becomes necessary.
CREATE TABLE edges (
    id           BIGSERIAL PRIMARY KEY,
    repo_id      BIGINT NOT NULL REFERENCES repos(id) ON DELETE CASCADE,
    src_type     TEXT NOT NULL,
    src_id       BIGINT NOT NULL,
    rel          TEXT NOT NULL,
    dst_type     TEXT NOT NULL,
    dst_id       BIGINT NOT NULL,
    occurred_at  TIMESTAMPTZ NOT NULL,
    UNIQUE (repo_id, src_type, src_id, rel, dst_type, dst_id)
);

-- Traversal happens in both directions ("what did this PR touch", "what touched this
-- file"), so both directions get an index.
CREATE INDEX edges_fwd ON edges (repo_id, src_type, src_id, occurred_at);
CREATE INDEX edges_rev ON edges (repo_id, dst_type, dst_id, occurred_at);
CREATE INDEX edges_rel ON edges (repo_id, rel);

-- ============================================================================
-- LAYER 2: INTERPRETED
-- ============================================================================

-- A decision is a claim that a team chose something for a reason. Extracted from prose,
-- therefore fallible, therefore heavily provenanced.
--
-- BITEMPORALITY -- the part that carries the research claim:
--
--   valid_from / valid_to : when this was true IN THE WORLD. A JWT decision made in
--     Jan 2023 and reversed in Sep 2024 has valid_from=2023-01, valid_to=2024-09.
--     valid_to IS NULL means "still believed to be true".
--
--   ingested_at : when KAIRO learned it. Backfilling four years of history today means
--     thousands of rows with wildly different valid_from and identical ingested_at.
--
-- Two axes are what let a query answer "what did the team believe in March 2023?" -- ask
-- for decisions whose validity interval CONTAINS March 2023, not decisions created then.
-- A vector store cannot do this at all: embeddings have no representation of a fact
-- ceasing to be true, so a superseded decision retrieves exactly as well as a live one.
-- That is "temporal blindness", and it is the specific failure the evaluation targets.
CREATE TABLE decisions (
    id                BIGSERIAL PRIMARY KEY,
    repo_id           BIGINT NOT NULL REFERENCES repos(id) ON DELETE CASCADE,

    statement         TEXT NOT NULL,          -- "Use JWT bearer tokens rather than server-side sessions"
    rationale         TEXT,                   -- why, in the team's own framing
    scope             TEXT,                   -- area it governs, e.g. "auth"; drives DDI

    -- valid time
    valid_from        TIMESTAMPTZ NOT NULL,
    valid_to          TIMESTAMPTZ,
    superseded_by     BIGINT REFERENCES decisions(id),

    -- ingestion time
    ingested_at       TIMESTAMPTZ NOT NULL DEFAULT now(),

    -- provenance: every interpreted row must be able to answer "why do you believe this?"
    source_item_id    BIGINT REFERENCES items(id),
    source_comment_id BIGINT REFERENCES comments(id),
    source_span       TEXT NOT NULL,          -- verbatim text the claim came from
    confidence        REAL NOT NULL CHECK (confidence BETWEEN 0 AND 1),
    extracted_by      TEXT NOT NULL,          -- model id, so a bad model's output can be purged
    extracted_at      TIMESTAMPTZ NOT NULL DEFAULT now(),

    -- 384 dims = sentence-transformers/all-MiniLM-L6-v2, the local embedding fallback.
    -- The configured LLM proxy serves chat but not /embeddings, and a local model makes
    -- the vector-RAG baseline reproducible without any API. Change to 1536 if switching
    -- to OpenAI's text-embedding-3-small.
    embedding         vector(384)
);

CREATE INDEX decisions_valid ON decisions (repo_id, valid_from, valid_to);
CREATE INDEX decisions_scope ON decisions (repo_id, scope);

-- Interpreted edges, kept apart from `edges` so a traversal can never silently mix a
-- guess into a chain of facts. Same provenance discipline.
--   rel: 'DECIDED_IN' | 'SUPERSEDES' | 'VIOLATED_BY' | 'RECURRENCE_OF' | 'CAUSED_BY'
CREATE TABLE decision_edges (
    id           BIGSERIAL PRIMARY KEY,
    repo_id      BIGINT NOT NULL REFERENCES repos(id) ON DELETE CASCADE,
    src_type     TEXT NOT NULL,
    src_id       BIGINT NOT NULL,
    rel          TEXT NOT NULL,
    dst_type     TEXT NOT NULL,
    dst_id       BIGINT NOT NULL,

    valid_from   TIMESTAMPTZ NOT NULL,
    valid_to     TIMESTAMPTZ,

    source_span  TEXT,
    confidence   REAL NOT NULL CHECK (confidence BETWEEN 0 AND 1),
    extracted_by TEXT NOT NULL,
    ingested_at  TIMESTAMPTZ NOT NULL DEFAULT now(),

    UNIQUE (repo_id, src_type, src_id, rel, dst_type, dst_id)
);

CREATE INDEX decision_edges_fwd ON decision_edges (repo_id, src_type, src_id);
CREATE INDEX decision_edges_rev ON decision_edges (repo_id, dst_type, dst_id);

-- ============================================================================
-- BASELINE CORPUS (for the evaluation)
-- ============================================================================

-- Flat chunks + embeddings: the vector-RAG arm of the comparison. Deliberately built
-- over the SAME source text as the graph, with sane chunking and a real embedding model.
-- A strawman baseline would invalidate the whole result -- and a panelist who knows the
-- field would spot it immediately.
CREATE TABLE chunks (
    id             BIGSERIAL PRIMARY KEY,
    repo_id        BIGINT NOT NULL REFERENCES repos(id) ON DELETE CASCADE,
    source_item_id BIGINT NOT NULL REFERENCES items(id) ON DELETE CASCADE,
    ordinal        INTEGER NOT NULL,        -- position within the thread
    content        TEXT NOT NULL,
    embedding      vector(384)      -- see note on decisions.embedding
);

CREATE INDEX chunks_src ON chunks (repo_id, source_item_id);
