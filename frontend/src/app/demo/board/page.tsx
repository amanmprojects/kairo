"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  Filter,
  Plus,
  ShieldAlert,
  Search,
  SlidersHorizontal,
  GitPullRequest,
  CheckCircle2,
  Clock,
  AlertTriangle,
  ChevronDown,
  Layers,
  Zap,
  Kanban,
  Users,
  Check
} from "lucide-react";

interface BoardCard {
  id: string;
  repo: string;
  title: string;
  points: number;
  author: string;
  avatarColor: string;
  labels: { name: string; bg: string; text: string }[];
  impact?: {
    level: "high" | "medium" | "low";
    message: string;
  };
}

export default function DemoBoard() {
  const [filter, setFilter] = useState("all");
  const [viewMode, setViewMode] = useState<"kanban" | "poker">("kanban");
  const [selectedIssueIndex, setSelectedIssueIndex] = useState(0);
  const [selectedPokerPoint, setSelectedPokerPoint] = useState<number | null>(8);
  const [pokerRevealed, setPokerRevealed] = useState(false);
  const [pokerApplied, setPokerApplied] = useState(false);

  const ESTIMATION_ISSUES = [
    {
      id: "kairo #142",
      title: "Add bitemporal valid-time slider to knowledge graph explorer",
      repo: "sharvarianand/kairo",
      desc: "Allow engineers to rewind and query past architectural decisions as of any git tag or timestamp.",
      currentPoints: 8,
      consensus: 8,
      votes: [
        { user: "aman", name: "Aman M.", vote: 8 },
        { user: "shruti", name: "Shruti G.", vote: 8 },
        { user: "sharvari", name: "Sharvari B.", vote: 5 },
        { user: "alex", name: "Alex R.", vote: 8 },
      ]
    },
    {
      id: "kairo #102",
      title: "Migrate vector store from pgvector to standalone Milvus cluster",
      repo: "sharvarianand/kairo",
      desc: "Evaluate whether standalone Milvus cluster is required or if native Postgres pgvector suffices.",
      currentPoints: 13,
      consensus: 13,
      votes: [
        { user: "aman", name: "Aman M.", vote: 13 },
        { user: "shruti", name: "Shruti G.", vote: 13 },
        { user: "sharvari", name: "Sharvari B.", vote: 8 },
        { user: "alex", name: "Alex R.", vote: 13 },
      ]
    },
    {
      id: "kairo #145",
      title: "Implement hub degree threshold capping in SQL CTE queries",
      repo: "sharvarianand/kairo",
      desc: "Prune mega-nodes with degree > 20 to eliminate graph hub domination during recursive CTE queries.",
      currentPoints: 5,
      consensus: 5,
      votes: [
        { user: "aman", name: "Aman M.", vote: 5 },
        { user: "shruti", name: "Shruti G.", vote: 5 },
        { user: "sharvari", name: "Sharvari B.", vote: 5 },
        { user: "alex", name: "Alex R.", vote: 3 },
      ]
    }
  ];

  const columns = [
    {
      name: "Icebox",
      limit: "No limit",
      points: "9 Issues / 47 Pts",
      cards: [
        {
          id: "kairo #102",
          repo: "sharvarianand/kairo",
          title: "Migrate vector store from pgvector to standalone Milvus cluster",
          points: 13,
          author: "Alex R.",
          avatarColor: "bg-slate-700",
          labels: [
            { name: "architecture", bg: "bg-purple-100", text: "text-purple-800" },
            { name: "database", bg: "bg-slate-100", text: "text-slate-700" },
          ],
          impact: {
            level: "high",
            message: "Conflicts with ADR-038 (Native Postgres CTE standard)",
          },
        },
        {
          id: "kairo #108",
          repo: "sharvarianand/kairo",
          title: "Add telemetry exporter for Prometheus & OpenTelemetry",
          points: 5,
          author: "Priya S.",
          avatarColor: "bg-teal-700",
          labels: [
            { name: "infra", bg: "bg-blue-100", text: "text-blue-800" },
            { name: "observability", bg: "bg-emerald-100", text: "text-emerald-800" },
          ],
        },
      ] as BoardCard[],
    },
    {
      name: "Product Backlog",
      limit: "8 Issues",
      points: "4 Issues / 18 Pts",
      cards: [
        {
          id: "kairo #142",
          repo: "sharvarianand/kairo",
          title: "Add bitemporal valid-time slider to knowledge graph explorer",
          points: 8,
          author: "Sharvari B.",
          avatarColor: "bg-indigo-700",
          labels: [
            { name: "frontend", bg: "bg-teal-100", text: "text-teal-800" },
            { name: "graphrag", bg: "bg-indigo-100", text: "text-indigo-800" },
          ],
        },
        {
          id: "kairo #145",
          repo: "sharvarianand/kairo",
          title: "Implement hub degree threshold capping in SQL CTE queries",
          points: 5,
          author: "Aman M.",
          avatarColor: "bg-emerald-700",
          labels: [
            { name: "backend", bg: "bg-slate-100", text: "text-slate-800" },
            { name: "performance", bg: "bg-amber-100", text: "text-amber-800" },
          ],
        },
      ] as BoardCard[],
    },
    {
      name: "In Progress",
      limit: "WIP: 4",
      points: "3 Issues / 15 Pts",
      cards: [
        {
          id: "kairo #139",
          repo: "sharvarianand/kairo",
          title: "PR #412: Refactor auth middleware to JWT tokens",
          points: 8,
          author: "Shruti G.",
          avatarColor: "bg-rose-700",
          labels: [
            { name: "security", bg: "bg-rose-100", text: "text-rose-800" },
            { name: "auth", bg: "bg-amber-100", text: "text-amber-800" },
          ],
          impact: {
            level: "high",
            message: "12 files affected • ADR-042 conflict • Bug risk 23%",
          },
        },
        {
          id: "kairo #140",
          repo: "sharvarianand/kairo",
          title: "Build Three-Mode GraphRAG query synthesization interface",
          points: 5,
          author: "Sharvari B.",
          avatarColor: "bg-indigo-700",
          labels: [
            { name: "feature", bg: "bg-teal-100", text: "text-teal-800" },
            { name: "ai-llm", bg: "bg-purple-100", text: "text-purple-800" },
          ],
        },
      ] as BoardCard[],
    },
    {
      name: "Architecture Review",
      limit: "3 Issues",
      points: "2 Issues / 10 Pts",
      cards: [
        {
          id: "kairo #134",
          repo: "sharvarianand/kairo",
          title: "ADR-044 Proposal: Asynchronous Redis event-bus for webhooks",
          points: 5,
          author: "Dr. Nagarhalli",
          avatarColor: "bg-slate-900",
          labels: [
            { name: "adr-review", bg: "bg-amber-100", text: "text-amber-800" },
            { name: "rfc", bg: "bg-blue-100", text: "text-blue-800" },
          ],
          impact: {
            level: "medium",
            message: "Needs sign-off from 2 senior owners before merge",
          },
        },
      ] as BoardCard[],
    },
    {
      name: "Done (Sprint 42)",
      limit: "Completed",
      points: "12 Issues / 48 Pts",
      cards: [
        {
          id: "kairo #128",
          repo: "sharvarianand/kairo",
          title: "Fix race condition in bitemporal transaction-time stamp logger",
          points: 3,
          author: "Aman M.",
          avatarColor: "bg-emerald-700",
          labels: [
            { name: "bugfix", bg: "bg-emerald-100", text: "text-emerald-800" },
            { name: "postgres", bg: "bg-slate-100", text: "text-slate-800" },
          ],
        },
        {
          id: "kairo #130",
          repo: "sharvarianand/kairo",
          title: "Export DDI (Decision Drift Index) scoring formula to API",
          points: 5,
          author: "Prof. Gule",
          avatarColor: "bg-purple-700",
          labels: [
            { name: "metrics", bg: "bg-teal-100", text: "text-teal-800" },
            { name: "fastapi", bg: "bg-blue-100", text: "text-blue-800" },
          ],
        },
      ] as BoardCard[],
    },
  ];

  return (
    <div className="h-full flex flex-col space-y-4">
      {/* 1. ZenHub-style Filter Bar & Breadcrumb Controls */}
      <div className="bg-white p-3.5 rounded-2xl border border-slate-200/80 shadow-xs flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2 flex-wrap">
          <div className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-100 text-slate-700 rounded-lg text-xs font-semibold">
            <span>Views: All Pipelines</span>
            <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
          </div>
          <div className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-100 text-slate-700 rounded-lg text-xs font-semibold">
            <span>Repo (1/1): kairo</span>
            <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
          </div>

          <div className="h-4 w-px bg-slate-200 mx-1 hidden sm:block" />

          {/* View Mode Switcher: Kanban vs Planning Poker */}
          <div className="flex bg-slate-100 p-0.5 rounded-lg text-xs font-semibold">
            <button
              onClick={() => setViewMode("kanban")}
              className={`px-3 py-1 rounded-md flex items-center gap-1.5 transition-colors ${
                viewMode === "kanban"
                  ? "bg-white text-slate-900 shadow-2xs font-bold"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              <Kanban className="w-3.5 h-3.5 text-teal-600" />
              <span>Kanban Board</span>
            </button>
            <button
              onClick={() => setViewMode("poker")}
              className={`px-3 py-1 rounded-md flex items-center gap-1.5 transition-colors ${
                viewMode === "poker"
                  ? "bg-white text-indigo-900 shadow-2xs font-bold"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              <Zap className="w-3.5 h-3.5 text-indigo-600" />
              <span>Planning Poker</span>
              <span className="text-[9px] bg-indigo-100 text-indigo-800 px-1.5 py-0.2 rounded-full font-bold">Live</span>
            </button>
          </div>

          {/* Filter Pills (only when in kanban mode) */}
          {viewMode === "kanban" && (
            <div className="flex bg-slate-100 p-0.5 rounded-lg text-xs font-medium">
              <button
                onClick={() => setFilter("all")}
                className={`px-3 py-1 rounded-md transition-colors ${
                  filter === "all"
                    ? "bg-white text-slate-900 shadow-2xs font-semibold"
                    : "text-slate-600 hover:text-slate-900"
                }`}
              >
                All Issues
              </button>
              <button
                onClick={() => setFilter("impact")}
                className={`px-3 py-1 rounded-md flex items-center gap-1.5 transition-colors ${
                  filter === "impact"
                    ? "bg-amber-100 text-amber-900 shadow-2xs font-semibold"
                    : "text-slate-600 hover:text-slate-900"
                }`}
              >
                <ShieldAlert className="w-3 h-3 text-amber-600" />
                <span>Architectural Risks Only</span>
              </button>
            </div>
          )}
        </div>

        <div className="flex items-center gap-2">
          <div className="relative">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              placeholder="Filter issues (f)..."
              className="pl-8 pr-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-teal-500 w-44 sm:w-56"
            />
          </div>
          <button className="flex items-center gap-1 px-3 py-1.5 bg-teal-600 hover:bg-teal-700 text-white rounded-lg text-xs font-semibold shadow-xs transition-colors">
            <Plus className="w-3.5 h-3.5" />
            <span>Create Issue</span>
          </button>
        </div>
      </div>

      {viewMode === "poker" ? (
        /* PLANNING POKER ESTIMATOR */
        <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs space-y-6 flex-1 overflow-y-auto">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-4 border-b border-slate-100">
            <div>
              <div className="flex items-center gap-2">
                <Zap className="w-5 h-5 text-indigo-600" />
                <h2 className="text-lg font-bold text-slate-900">
                  Interactive Planning Poker &amp; Story Point Estimation
                </h2>
              </div>
              <p className="text-xs text-slate-500 mt-0.5">
                Vote asynchronously or in real-time on issue complexity to build consensus using the Fibonacci sequence.
              </p>
            </div>

            {/* Select which issue to estimate */}
            <div className="flex items-center gap-2">
              <span className="text-xs text-slate-500 font-medium">Sprint Issue:</span>
              <div className="flex bg-slate-100 p-0.5 rounded-lg text-xs font-semibold">
                {ESTIMATION_ISSUES.map((issue, idx) => (
                  <button
                    key={issue.id}
                    onClick={() => {
                      setSelectedIssueIndex(idx);
                      setSelectedPokerPoint(issue.consensus);
                      setPokerRevealed(false);
                      setPokerApplied(false);
                    }}
                    className={`px-2.5 py-1 rounded-md transition-colors ${
                      selectedIssueIndex === idx
                        ? "bg-white text-indigo-900 shadow-2xs font-bold"
                        : "text-slate-600 hover:text-slate-900"
                    }`}
                  >
                    {issue.id.replace("kairo ", "")}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Active Estimating Issue Card */}
          {(() => {
            const currentIssue = ESTIMATION_ISSUES[selectedIssueIndex];
            return (
              <div className="space-y-6 max-w-4xl">
                <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-mono font-bold text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded border border-indigo-100">
                      CURRENTLY ESTIMATING: {currentIssue.id}
                    </span>
                    <span className="text-xs font-mono font-semibold text-slate-600">
                      Target Repository: {currentIssue.repo}
                    </span>
                  </div>
                  <h3 className="text-sm font-bold text-slate-900">
                    {currentIssue.title}
                  </h3>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    {currentIssue.desc}
                  </p>
                </div>

                {/* Fibonacci Story Point Cards */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block">
                      Select Your Story Point Estimate (Fibonacci):
                    </label>
                    {selectedPokerPoint && (
                      <span className="text-xs font-semibold text-indigo-600">
                        Selected: {selectedPokerPoint} Story Points
                      </span>
                    )}
                  </div>

                  <div className="flex flex-wrap gap-3">
                    {[1, 2, 3, 5, 8, 13, 21].map((pt) => {
                      const isSelected = selectedPokerPoint === pt;
                      return (
                        <button
                          key={pt}
                          onClick={() => {
                            setSelectedPokerPoint(pt);
                            setPokerApplied(false);
                          }}
                          className={`h-24 w-16 sm:w-20 rounded-2xl border font-mono font-extrabold text-xl flex flex-col items-center justify-center gap-1 transition-all shadow-xs ${
                            isSelected
                              ? "bg-indigo-600 text-white border-indigo-500 scale-105 shadow-md shadow-indigo-600/20"
                              : "bg-white text-slate-800 border-slate-200 hover:border-indigo-300 hover:bg-slate-50"
                          }`}
                        >
                          <span>{pt}</span>
                          <span
                            className={`text-[9px] font-sans font-medium uppercase tracking-wider ${
                              isSelected ? "text-indigo-200" : "text-slate-400"
                            }`}
                          >
                            pts
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Team Consensus & Teammate Votes */}
                <div className="pt-4 border-t border-slate-100 space-y-4">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <Users className="w-4 h-4 text-slate-500" />
                      <span className="text-xs font-bold text-slate-700">
                        Teammate Consensus Votes ({currentIssue.votes.length} Members):
                      </span>
                    </div>

                    <div className="flex items-center gap-3">
                      <button
                        onClick={() => setPokerRevealed(!pokerRevealed)}
                        className="text-xs font-bold text-indigo-600 hover:text-indigo-800 transition-colors"
                      >
                        {pokerRevealed ? "Hide Team Cards" : "Reveal Team Cards"}
                      </button>

                      <button
                        disabled={pokerApplied}
                        onClick={() => {
                          setPokerApplied(true);
                          setPokerRevealed(true);
                        }}
                        className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all shadow-xs ${
                          pokerApplied
                            ? "bg-emerald-100 text-emerald-800 cursor-default"
                            : "bg-teal-600 hover:bg-teal-700 text-white"
                        }`}
                      >
                        {pokerApplied ? (
                          <>
                            <Check className="w-3.5 h-3.5" />
                            <span>Assigned ({currentIssue.consensus} pts)</span>
                          </>
                        ) : (
                          <>
                            <Zap className="w-3.5 h-3.5" />
                            <span>Apply Consensus ({currentIssue.consensus} pts)</span>
                          </>
                        )}
                      </button>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    {currentIssue.votes.map((v) => (
                      <div
                        key={v.user}
                        className="p-3 rounded-xl bg-slate-50 border border-slate-200/80 flex items-center justify-between text-xs"
                      >
                        <div className="flex items-center gap-2">
                          <div className="w-6 h-6 rounded-full bg-slate-800 text-white text-[10px] font-bold flex items-center justify-center">
                            {v.name[0]}
                          </div>
                          <div>
                            <span className="text-slate-800 font-semibold block leading-tight">
                              {v.name}
                            </span>
                            <span className="text-[10px] text-slate-400 font-mono">
                              @{v.user}
                            </span>
                          </div>
                        </div>

                        <span
                          className={`font-mono font-bold px-2 py-0.5 rounded text-xs ${
                            pokerRevealed
                              ? "bg-indigo-100 text-indigo-800"
                              : "bg-emerald-100 text-emerald-800"
                          }`}
                        >
                          {pokerRevealed ? `${v.vote} pts` : "Voted"}
                        </span>
                      </div>
                    ))}
                  </div>

                  {pokerRevealed && (
                    <div className="p-3 bg-indigo-50/60 border border-indigo-200/80 rounded-xl flex items-center justify-between text-xs">
                      <div className="flex items-center gap-2 text-indigo-900 font-medium">
                        <CheckCircle2 className="w-4 h-4 text-indigo-600" />
                        <span>High Consensus Reached: Team median estimation is <strong>{currentIssue.consensus} Story Points</strong>.</span>
                      </div>
                      <span className="font-mono text-indigo-700 font-bold bg-white px-2 py-0.5 rounded border border-indigo-200">
                        {currentIssue.consensus} Pts
                      </span>
                    </div>
                  )}
                </div>
              </div>
            );
          })()}
        </div>
      ) : (
        /* 2. Board Columns (Scrollable horizontally) */
        <div className="flex-1 overflow-x-auto pb-4">
          <div className="flex gap-4 min-w-[1280px] h-full items-start">
            {columns.map((column) => {
              const visibleCards =
                filter === "impact"
                  ? column.cards.filter((c) => !!c.impact)
                  : column.cards;

              return (
                <div
                  key={column.name}
                  className="w-80 bg-slate-100/70 border border-slate-200/80 rounded-2xl p-3 flex flex-col max-h-full shrink-0 shadow-2xs"
                >
                  {/* Column Header */}
                  <div className="flex items-center justify-between pb-3 px-1 border-b border-slate-200/60 mb-3">
                    <div>
                      <h3 className="font-bold text-xs text-slate-800 uppercase tracking-wider flex items-center gap-2">
                        <span>{column.name}</span>
                        <span className="text-[10px] bg-slate-200 text-slate-700 font-bold px-1.5 py-0.5 rounded-full">
                          {visibleCards.length}
                        </span>
                      </h3>
                      <p className="text-[10px] text-slate-400 font-medium mt-0.5">
                        {column.points}
                      </p>
                    </div>
                    <button className="text-slate-400 hover:text-slate-600 p-1 rounded hover:bg-slate-200">
                      <Plus className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  {/* Cards List */}
                  <div className="space-y-2.5 overflow-y-auto pr-1 flex-1">
                    {visibleCards.map((card) => (
                      <div
                        key={card.id}
                        className="bg-white border border-slate-200/90 hover:border-teal-300 rounded-xl p-3.5 shadow-2xs hover:shadow-md transition-all cursor-pointer group"
                      >
                        {/* Card Repo & ID */}
                        <div className="flex items-center justify-between gap-2 text-[11px] text-slate-400 mb-1.5">
                          <span className="font-mono">{card.id}</span>
                          <span className="text-[10px] font-semibold bg-slate-100 px-1.5 py-0.5 rounded text-slate-600">
                            {card.points} pts
                          </span>
                        </div>

                        {/* Card Title */}
                        <h4 className="text-xs font-semibold text-slate-900 group-hover:text-teal-700 leading-snug mb-2.5">
                          {card.title}
                        </h4>

                        {/* Impact Warning Banner (KAIRO Feature) */}
                        {card.impact && (
                          <div className="mb-2.5 p-2 bg-amber-50/80 border border-amber-200 rounded-lg flex items-start gap-1.5">
                            <AlertTriangle className="w-3 h-3 text-amber-700 shrink-0 mt-0.5" />
                            <p className="text-[10px] font-medium text-amber-800 leading-tight">
                              {card.impact.message}
                            </p>
                          </div>
                        )}

                        {/* Labels & Assignee */}
                        <div className="flex items-center justify-between gap-2 pt-2 border-t border-slate-100 text-[10px]">
                          <div className="flex flex-wrap gap-1">
                            {card.labels.map((lbl) => (
                              <span
                                key={lbl.name}
                                className={`px-1.5 py-0.5 rounded font-semibold ${lbl.bg} ${lbl.text}`}
                              >
                                {lbl.name}
                              </span>
                            ))}
                          </div>
                          <div
                            className={`w-5 h-5 rounded-full ${card.avatarColor} text-white font-bold text-[9px] flex items-center justify-center shrink-0 shadow-2xs`}
                            title={`Assigned to ${card.author}`}
                          >
                            {card.author[0]}
                          </div>
                        </div>
                      </div>
                    ))}

                    {visibleCards.length === 0 && (
                      <div className="p-6 text-center text-xs text-slate-400 border border-dashed border-slate-200 rounded-xl">
                        No issues in this pipeline
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
