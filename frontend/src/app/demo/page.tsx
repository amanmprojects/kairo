"use client";

import React from "react";
import Link from "next/link";
import {
  Activity,
  GitPullRequest,
  Search,
  ShieldAlert,
  GitCommit,
  FileText,
  TrendingUp,
  Layers,
  ArrowRight,
  Clock,
  CheckCircle2,
  AlertTriangle,
} from "lucide-react";

export default function DemoOverview() {
  return (
    <div className="max-w-6xl mx-auto space-y-8">
      {/* Page Title & Context */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
            Workspace Overview
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Real-time bitemporal intelligence for repository{" "}
            <span className="font-semibold text-slate-700">sharvarianand/kairo</span>
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Link
            href="/demo/impact"
            className="flex items-center gap-1.5 px-3 py-1.5 bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-200 rounded-lg text-xs font-semibold transition-colors"
          >
            <ShieldAlert className="w-3.5 h-3.5 text-amber-600" />
            <span>3 PRs Need Impact Review</span>
          </Link>
          <Link
            href="/demo/ask"
            className="flex items-center gap-1.5 px-3.5 py-1.5 bg-teal-600 hover:bg-teal-700 text-white rounded-lg text-xs font-semibold transition-colors shadow-xs"
          >
            <Search className="w-3.5 h-3.5" />
            <span>Ask KAIRO</span>
          </Link>
        </div>
      </div>

      {/* 4 Key Intelligence Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Metric 1 */}
        <div className="bg-white border border-slate-200/80 p-5 rounded-2xl shadow-xs hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
              Active Sprint
            </span>
            <div className="w-7 h-7 rounded-lg bg-teal-50 flex items-center justify-center text-teal-600">
              <Activity className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-bold text-slate-900 mb-1">Sprint 42</div>
          <div className="flex items-center text-xs text-slate-500 gap-1.5">
            <Clock className="w-3 h-3 text-slate-400" />
            <span>Ends in 3 days (18/24 pts done)</span>
          </div>
        </div>

        {/* Metric 2: DDI */}
        <div className="bg-white border border-amber-200/80 p-5 rounded-2xl shadow-xs hover:shadow-md transition-shadow relative overflow-hidden">
          <div className="absolute top-0 right-0 w-24 h-24 bg-amber-50 rounded-full blur-2xl pointer-events-none" />
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold text-amber-700 uppercase tracking-wider">
              Decision Drift (DDI)
            </span>
            <div className="w-7 h-7 rounded-lg bg-amber-100/60 flex items-center justify-center text-amber-700">
              <AlertTriangle className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-bold text-amber-700 mb-1 flex items-baseline gap-1">
            <span>72</span>
            <span className="text-xs font-medium text-slate-400">/ 100</span>
          </div>
          <div className="text-xs font-semibold text-amber-700 flex items-center gap-1">
            <span>Elevated risk in auth layer</span>
          </div>
        </div>

        {/* Metric 3: EES */}
        <div className="bg-white border border-emerald-200/80 p-5 rounded-2xl shadow-xs hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold text-emerald-700 uppercase tracking-wider">
              Eng. Evolution (EES)
            </span>
            <div className="w-7 h-7 rounded-lg bg-emerald-50 flex items-center justify-center text-emerald-600">
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-bold text-emerald-700 mb-1">85</div>
          <div className="text-xs font-medium text-emerald-700">
            Stable delivery & author ownership
          </div>
        </div>

        {/* Metric 4: Open PRs */}
        <div className="bg-white border border-slate-200/80 p-5 rounded-2xl shadow-xs hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
              Open Pull Requests
            </span>
            <div className="w-7 h-7 rounded-lg bg-indigo-50 flex items-center justify-center text-indigo-600">
              <GitPullRequest className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-bold text-slate-900 mb-1">14</div>
          <div className="text-xs font-medium text-slate-500">
            3 require architectural review
          </div>
        </div>
      </div>

      {/* Trust-Isolated Two-Layer Graph Telemetry */}
      <div className="bg-white border border-slate-200/80 rounded-2xl p-6 shadow-xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-100">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-teal-50 flex items-center justify-center text-teal-600">
              <Layers className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-slate-900">
                Two-Layer Knowledge Graph Status
              </h2>
              <p className="text-xs text-slate-500">
                Guaranteed zero AI hallucinations in factual structural telemetry
              </p>
            </div>
          </div>
          <Link
            href="/demo/graph"
            className="text-xs font-semibold text-teal-600 hover:text-teal-700 flex items-center gap-1"
          >
            <span>Explore Full Graph</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4">
          <div className="p-4 bg-slate-50/80 rounded-xl border border-slate-200/60">
            <div className="flex items-center justify-between mb-1">
              <span className="text-xs font-bold text-slate-700 uppercase">
                Layer 1: Deterministic Code Facts
              </span>
              <span className="text-[10px] bg-emerald-100 text-emerald-800 font-bold px-2 py-0.5 rounded-full">
                100% Verifiable
              </span>
            </div>
            <p className="text-xs text-slate-500 mb-3">
              Direct GitHub REST & GraphQL timeline events (Commits, Authors, Diffs)
            </p>
            <div className="flex items-center gap-4 text-xs font-mono font-semibold text-slate-700">
              <span>1,420 Commits</span>
              <span>•</span>
              <span>184 PRs</span>
              <span>•</span>
              <span>12 Contributors</span>
            </div>
          </div>

          <div className="p-4 bg-teal-50/40 rounded-xl border border-teal-200/60">
            <div className="flex items-center justify-between mb-1">
              <span className="text-xs font-bold text-teal-900 uppercase">
                Layer 2: Interpreted Decisions
              </span>
              <span className="text-[10px] bg-teal-100 text-teal-800 font-bold px-2 py-0.5 rounded-full">
                Verbatim Citations
              </span>
            </div>
            <p className="text-xs text-teal-700 mb-3">
              LLM-extracted architectural decisions with strict bitemporal valid times
            </p>
            <div className="flex items-center gap-4 text-xs font-mono font-semibold text-teal-800">
              <span>42 Decisions</span>
              <span>•</span>
              <span>3 Drift Alerts</span>
              <span>•</span>
              <span>Hub Degree: ≤20</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content Grid: Activity Feed & Recent Decisions */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column (2/3): Activity Feed */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-bold text-slate-900">
              Recent Engineering Activity
            </h2>
            <span className="text-xs text-slate-400">Live Webhook Stream</span>
          </div>

          <div className="bg-white border border-slate-200/80 rounded-2xl divide-y divide-slate-100 shadow-xs overflow-hidden">
            {/* Activity 1 */}
            <div className="p-4 flex items-start gap-3.5 hover:bg-slate-50/50 transition-colors">
              <div className="w-8 h-8 rounded-full bg-teal-50 flex items-center justify-center shrink-0 text-teal-600 mt-0.5">
                <GitCommit className="w-4 h-4" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-2">
                  <p className="text-xs font-semibold text-slate-900">
                    Merged commit <span className="font-mono text-teal-600">a8f9b2c</span> into main
                  </p>
                  <span className="text-[11px] text-slate-400 shrink-0">2h ago</span>
                </div>
                <p className="text-xs text-slate-500 mt-0.5">
                  Refactored authentication middleware to use JWT tokens
                </p>
              </div>
            </div>

            {/* Activity 2 */}
            <div className="p-4 flex items-start gap-3.5 hover:bg-slate-50/50 transition-colors">
              <div className="w-8 h-8 rounded-full bg-amber-50 flex items-center justify-center shrink-0 text-amber-600 mt-0.5">
                <ShieldAlert className="w-4 h-4" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-2">
                  <p className="text-xs font-semibold text-slate-900">
                    Pre-merge Impact Scan completed for PR #412
                  </p>
                  <span className="text-[11px] text-slate-400 shrink-0">4h ago</span>
                </div>
                <p className="text-xs text-amber-700 font-medium mt-0.5">
                  Detected conflict with ADR-042 (Session vs JWT architectural standard)
                </p>
              </div>
            </div>

            {/* Activity 3 */}
            <div className="p-4 flex items-start gap-3.5 hover:bg-slate-50/50 transition-colors">
              <div className="w-8 h-8 rounded-full bg-indigo-50 flex items-center justify-center shrink-0 text-indigo-600 mt-0.5">
                <FileText className="w-4 h-4" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-2">
                  <p className="text-xs font-semibold text-slate-900">
                    Extracted ADR-043: Transition to PostgreSQL pgvector
                  </p>
                  <span className="text-[11px] text-slate-400 shrink-0">Yesterday</span>
                </div>
                <p className="text-xs text-slate-500 mt-0.5">
                  Status: ACCEPTED (Valid time: 2026-03-12 to present)
                </p>
              </div>
            </div>

            {/* Activity 4 */}
            <div className="p-4 flex items-start gap-3.5 hover:bg-slate-50/50 transition-colors">
              <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center shrink-0 text-slate-600 mt-0.5">
                <GitPullRequest className="w-4 h-4" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-2">
                  <p className="text-xs font-semibold text-slate-900">
                    Opened PR #415: Implement dynamic hub suppression
                  </p>
                  <span className="text-[11px] text-slate-400 shrink-0">2d ago</span>
                </div>
                <p className="text-xs text-slate-500 mt-0.5">
                  Reduced result overlap from 56% to 27% across CTE queries
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column (1/3): Decisions & Query Box */}
        <div className="space-y-6">
          {/* Active Decisions */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-base font-bold text-slate-900">
                Active Architecture Decisions
              </h2>
              <Link
                href="/demo/graph"
                className="text-xs text-teal-600 hover:text-teal-700 font-semibold"
              >
                View Graph
              </Link>
            </div>

            <div className="space-y-3">
              <div className="p-3.5 bg-white border border-amber-200/90 rounded-xl shadow-xs">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs font-bold text-slate-900">
                    ADR-042: Session-based Auth Standard
                  </span>
                  <span className="text-[10px] font-bold bg-amber-100 text-amber-800 px-1.5 py-0.5 rounded">
                    DRIFT DETECTED
                  </span>
                </div>
                <p className="text-xs text-slate-500 mt-1">
                  Documented 6 months ago. 3 recent PRs introduced JWT without updating ADR.
                </p>
              </div>

              <div className="p-3.5 bg-white border border-slate-200 rounded-xl shadow-xs">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs font-bold text-slate-900">
                    ADR-038: Native SQL Recursive CTEs
                  </span>
                  <span className="text-[10px] font-bold bg-emerald-100 text-emerald-800 px-1.5 py-0.5 rounded">
                    HEALTHY
                  </span>
                </div>
                <p className="text-xs text-slate-500 mt-1">
                  Replaced standalone graph DB with Postgres 16 recursive CTE queries.
                </p>
              </div>

              <div className="p-3.5 bg-white border border-slate-200 rounded-xl shadow-xs">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs font-bold text-slate-900">
                    ADR-035: Content-Hash Response Caching
                  </span>
                  <span className="text-[10px] font-bold bg-emerald-100 text-emerald-800 px-1.5 py-0.5 rounded">
                    HEALTHY
                  </span>
                </div>
                <p className="text-xs text-slate-500 mt-1">
                  Deduplicates LLM calls across PR discussions with zero token waste.
                </p>
              </div>
            </div>
          </div>

          {/* Quick Ask Box */}
          <div className="p-5 bg-gradient-to-br from-teal-500/10 via-teal-50 to-indigo-50/30 border border-teal-200 rounded-2xl">
            <div className="flex items-center gap-2 mb-2 text-teal-800 font-bold text-sm">
              <Search className="w-4 h-4 text-teal-600" />
              <span>Ask KAIRO Anything</span>
            </div>
            <p className="text-xs text-slate-600 mb-3 leading-relaxed">
              Synthesize answers directly from the temporal knowledge graph.
            </p>
            <Link
              href="/demo/ask"
              className="block w-full py-2 px-3 bg-white hover:bg-slate-50 border border-teal-300 rounded-xl text-xs text-slate-500 shadow-xs transition-colors"
            >
              Why did we switch to JWT in auth.py?
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
