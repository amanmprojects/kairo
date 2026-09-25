/**
 * KAIRO API Client
 *
 * Connects frontend views to FastAPI backend endpoints (src/kairo/web.py).
 * Gracefully falls back to demo datasets when the local backend server is offline.
 */

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

async function fetchWithFallback<T>(endpoint: string, options?: RequestInit, fallback?: T): Promise<T> {
  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 2000);

    const res = await fetch(`${API_BASE_URL}${endpoint}`, {
      ...options,
      signal: controller.signal,
      headers: {
        "Content-Type": "application/json",
        ...options?.headers,
      },
    });
    clearTimeout(timeout);

    if (!res.ok) {
      throw new Error(`HTTP error ${res.status}: ${res.statusText}`);
    }
    return await res.json();
  } catch {
    if (fallback !== undefined) {
      return fallback;
    }
    throw new Error(`Backend unavailable at ${API_BASE_URL}${endpoint}`);
  }
}

export const kairoApi = {
  // 1. Health & Readiness
  checkHealth: async () => {
    return fetchWithFallback("/api/health", { method: "GET" }, { status: "ready" });
  },

  getReadiness: async (repoId: number = 1) => {
    return fetchWithFallback(`/repositories/${repoId}/readiness`, { method: "GET" }, { score: 85, status: "ready" });
  },

  // 2. Metrics & Overview
  getMetrics: async (repoId: number = 1) => {
    return fetchWithFallback(`/repositories/${repoId}/metrics`, { method: "GET" }, { ddi: 72, ees: 85 });
  },

  getOverview: async (repoId: number = 1) => {
    return fetchWithFallback(`/api/repositories/${repoId}/overview`, { method: "GET" }, {
      sprint: "Sprint 42",
      ddi: 72,
      ees: 85,
      openPrs: 14,
    });
  },

  // 3. Decisions & Knowledge Graph
  getDecisions: async (repoId: number = 1) => {
    return fetchWithFallback(`/api/repositories/${repoId}/decisions`, { method: "GET" }, {
      decisions: [
        { id: 42, title: "ADR-042: Stateful Session Architecture", status: "ACCEPTED", drift: true },
        { id: 38, title: "ADR-038: Native SQL Recursive CTEs", status: "ACCEPTED", drift: false },
        { id: 35, title: "ADR-035: Content-Hash Response Caching", status: "ACCEPTED", drift: false },
      ],
    });
  },

  getCodeXRay: async (repoId: number = 1) => {
    return fetchWithFallback(`/api/repositories/${repoId}/xray`, { method: "GET" }, {
      hotspots: [
        { path: "auth/middleware.py", churn: 47, bugRisk: 0.23, owner: "Shruti G." },
        { path: "auth/jwt_handler.py", churn: 18, bugRisk: 0.12, owner: "Aman M." },
        { path: "config/settings.py", churn: 6, bugRisk: 0.04, owner: "Sharvari B." },
      ],
    });
  },

  // 4. Three-Mode GraphRAG
  askQuestion: async (repoId: number = 1, question: string) => {
    return fetchWithFallback(
      `/api/repositories/${repoId}/ask`,
      {
        method: "POST",
        body: JSON.stringify({ question }),
      },
      {
        answer: "In PR #412, the team transitioned auth/middleware.py from server-side session cookies to JWT tokens for Edge serverless compatibility.",
        confidence: 0.94,
        citations: [
          { type: "ADR", id: "ADR-042", note: "Session standard violated" },
          { type: "PR", id: "PR #412", note: "JWT migration" },
        ],
      }
    );
  },

  // 5. Pre-Merge Impact Scan
  scanImpact: async (repoId: number = 1, paths: string[]) => {
    return fetchWithFallback(
      `/api/repositories/${repoId}/impact-scan`,
      {
        method: "POST",
        body: JSON.stringify({ paths }),
      },
      {
        filesAffected: paths.length,
        conflictsCount: 2,
        riskLevel: "High",
      }
    );
  },

  // 6. Sprint Board
  getBoard: async (workspaceId: number = 1) => {
    return fetchWithFallback(`/workspaces/${workspaceId}/board`, { method: "GET" }, {
      columns: [
        { name: "Icebox", issuesCount: 9 },
        { name: "Product Backlog", issuesCount: 4 },
        { name: "In Progress", issuesCount: 3 },
        { name: "Architecture Review", issuesCount: 2 },
        { name: "Done", issuesCount: 12 },
      ],
    });
  },

  moveBoardItem: async (itemId: number, columnId: number) => {
    return fetchWithFallback(
      `/board-items/${itemId}`,
      {
        method: "PATCH",
        body: JSON.stringify({ column_id: columnId }),
      },
      { success: true, itemId, columnId }
    );
  },

  // 7. GitHub OAuth & Ingestion
  connectGitHub: async (token: string, targetRepo: string = "sharvarianand/kairo") => {
    return fetchWithFallback(
      "/api/github/connect",
      {
        method: "POST",
        body: JSON.stringify({ token, target_repo: targetRepo }),
      },
      {
        status: "connected",
        user: "sharvarianand",
        name: "Sharvari Bhondekar",
        avatar_url: "https://avatars.githubusercontent.com/u/1000000?v=4",
        rate_limit_remaining: "5000",
        target_repo: targetRepo,
        repo_stars: 12,
      }
    );
  },

  authenticateGitHub: async (code: string) => {
    return fetchWithFallback(
      "/auth/github",
      {
        method: "POST",
        body: JSON.stringify({ code }),
      },
      { token: "kairo-demo-token", user: { id: 1, login: "sharvarianand" } }
    );
  },

  triggerIngestion: async (repoId: number = 1) => {
    return fetchWithFallback(
      `/repositories/${repoId}/ingest`,
      { method: "POST" },
      { status: "ingesting", repoId }
    );
  },
};
