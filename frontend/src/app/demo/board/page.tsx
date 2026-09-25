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

          {/* Filter Pills */}
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

      {/* 2. Board Columns (Scrollable horizontally) */}
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
    </div>
  );
}
