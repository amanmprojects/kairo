"use client";

import React, { useState } from "react";
import {
  Search,
  Bot,
  Zap,
  FileText,
  GitCommit,
  GitPullRequest,
  ArrowRight,
  Clock,
  ShieldCheck,
  CheckCircle2,
  Calendar,
  Layers,
} from "lucide-react";

export default function DemoAsk() {
  const [query, setQuery] = useState("Why did we switch auth to JWT in auth.py?");
  const [retrievalMode, setRetrievalMode] = useState<"anchored" | "as-of" | "semantic">("anchored");
  const [showResult, setShowResult] = useState(true);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      setShowResult(true);
    }
  };

  const handleChipClick = (text: string, mode: "anchored" | "as-of" | "semantic") => {
    setQuery(text);
    setRetrievalMode(mode);
    setShowResult(true);
  };

  return (
    <div className="max-w-4xl mx-auto py-4 space-y-6">
      {/* Title */}
      <div className="text-center max-w-xl mx-auto space-y-2">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-teal-100 text-teal-800 text-xs font-semibold">
          <Zap className="w-3.5 h-3.5 text-teal-600" />
          <span>Three-Mode GraphRAG Query Engine</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
          Ask KAIRO
        </h1>
        <p className="text-xs sm:text-sm text-slate-500">
          Query the repository engineering memory graph with natural language
        </p>
      </div>

      {/* Mode Selector */}
      <div className="flex justify-center">
        <div className="bg-slate-200/80 p-1 rounded-xl flex gap-1 text-xs font-semibold text-slate-600">
          <button
            onClick={() => setRetrievalMode("anchored")}
            className={`px-3 py-1.5 rounded-lg transition-all ${
              retrievalMode === "anchored"
                ? "bg-white text-teal-800 shadow-2xs"
                : "hover:text-slate-900"
            }`}
          >
            Anchored (File Structure)
          </button>
          <button
            onClick={() => setRetrievalMode("as-of")}
            className={`px-3 py-1.5 rounded-lg transition-all ${
              retrievalMode === "as-of"
                ? "bg-white text-teal-800 shadow-2xs"
                : "hover:text-slate-900"
            }`}
          >
            As-Of (Bitemporal Filter)
          </button>
          <button
            onClick={() => setRetrievalMode("semantic")}
            className={`px-3 py-1.5 rounded-lg transition-all ${
              retrievalMode === "semantic"
                ? "bg-white text-teal-800 shadow-2xs"
                : "hover:text-slate-900"
            }`}
          >
            Semantic (pgvector)
          </button>
        </div>
      </div>

      {/* Query Search Form */}
      <form onSubmit={handleSearch} className="relative">
        <div className="relative flex items-center">
          <Search className="w-5 h-5 text-slate-400 absolute left-4" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Ask about architectural decisions, rationale, or code ownership..."
            className="w-full bg-white border-2 border-slate-200 focus:border-teal-500 rounded-2xl py-4 pl-12 pr-28 text-sm text-slate-900 placeholder-slate-400 focus:outline-none shadow-sm transition-all"
          />
          <button
            type="submit"
            className="absolute right-2.5 px-4 py-2 bg-teal-600 hover:bg-teal-700 text-white font-semibold rounded-xl text-xs shadow-xs transition-colors"
          >
            Synthesize
          </button>
        </div>
      </form>

      {/* Suggested Prompt Chips */}
      <div className="space-y-2">
        <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider pl-1">
          Suggested Intent-Aware Prompts:
        </span>
        <div className="flex flex-wrap gap-2">
          {[
            {
              text: "Why did we switch auth to JWT in auth.py?",
              mode: "anchored" as const,
              tag: "Anchored",
            },
            {
              text: "What caching decisions were active in March 2023?",
              mode: "as-of" as const,
              tag: "As-Of",
            },
            {
              text: "Show decisions that conflict with current auth implementation",
              mode: "anchored" as const,
              tag: "Drift",
            },
            {
              text: "Who has primary architectural ownership of payment routing?",
              mode: "semantic" as const,
              tag: "Ownership",
            },
          ].map((item) => (
            <button
              key={item.text}
              onClick={() => handleChipClick(item.text, item.mode)}
              className="text-xs bg-white hover:bg-slate-50 border border-slate-200/90 text-slate-700 px-3 py-1.5 rounded-lg shadow-2xs hover:border-teal-300 transition-all text-left flex items-center gap-1.5"
            >
              <span className="text-[10px] font-bold bg-slate-100 text-slate-600 px-1 py-0.5 rounded">
                {item.tag}
              </span>
              <span>{item.text}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Synthesized Answer Output */}
      {showResult && (
        <div className="bg-white border border-slate-200/90 rounded-2xl p-6 shadow-sm space-y-5 animate-in fade-in duration-300">
          {/* Header Metadata */}
          <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-slate-100">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-teal-50 flex items-center justify-center text-teal-600">
                <Bot className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                  Synthesized Graph Evidence
                </h3>
                <span className="text-[11px] text-slate-400">
                  Recursive CTE Traversal • Hub Suppression Max Degree ≤20
                </span>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-[11px] font-bold bg-teal-50 text-teal-800 border border-teal-200 px-2 py-0.5 rounded-full">
                Mode: {retrievalMode.toUpperCase()}
              </span>
              <span className="text-[11px] font-bold bg-emerald-50 text-emerald-800 border border-emerald-200 px-2 py-0.5 rounded-full flex items-center gap-1">
                <ShieldCheck className="w-3 h-3 text-emerald-600" />
                <span>Confidence: 94%</span>
              </span>
            </div>
          </div>

          {/* Answer Body */}
          <div className="space-y-3 text-xs sm:text-sm text-slate-700 leading-relaxed">
            <p>
              In PR <span className="font-semibold text-slate-900 font-mono">#412</span>, 
              the team transitioned <code className="bg-slate-100 px-1.5 py-0.5 rounded text-xs font-mono text-teal-800">auth/middleware.py</code> 
              from server-side session cookies to JWT tokens. According to architectural discussions, 
              this change was driven by the migration to edge-rendered serverless functions where Redis session reads caused a 180ms latency spike.
            </p>
            <div className="p-3 bg-amber-50/70 border border-amber-200 rounded-xl text-xs text-amber-900 space-y-1">
              <p className="font-bold flex items-center gap-1">
                <span>⚠️ Decision Drift Warning:</span>
              </p>
              <p>
                This change directly contradicts <span className="font-bold">ADR-042</span> ("Session-Based Authentication Standard"), which has not been formally updated or superseded. The current codebase has an elevated Decision Drift Index (DDI: 72/100).
              </p>
            </div>
          </div>

          {/* Citations & Provenance Sources */}
          <div className="space-y-2 pt-2">
            <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
              Verifiable Provenance Sources (Layer 1 & Layer 2):
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="p-3 bg-slate-50 border border-slate-200/80 rounded-xl text-xs space-y-1">
                <div className="flex items-center justify-between text-slate-500">
                  <span className="font-bold flex items-center gap-1">
                    <FileText className="w-3 h-3 text-indigo-500" />
                    <span>ADR-042</span>
                  </span>
                  <span className="text-[10px]">Doc Decision</span>
                </div>
                <p className="text-[11px] text-slate-700 font-medium">
                  "Maintain stateful sessions via Redis for compliance auditing"
                </p>
                <div className="text-[10px] text-slate-400">Valid: 2023-09 to Present</div>
              </div>

              <div className="p-3 bg-slate-50 border border-slate-200/80 rounded-xl text-xs space-y-1">
                <div className="flex items-center justify-between text-slate-500">
                  <span className="font-bold flex items-center gap-1">
                    <GitPullRequest className="w-3 h-3 text-teal-600" />
                    <span>PR #412</span>
                  </span>
                  <span className="text-[10px]">GitHub PR</span>
                </div>
                <p className="text-[11px] text-slate-700 font-medium">
                  "Refactor auth middleware to JWT for Edge compatibility"
                </p>
                <div className="text-[10px] text-slate-400">Author: Shruti G. • Merged</div>
              </div>

              <div className="p-3 bg-slate-50 border border-slate-200/80 rounded-xl text-xs space-y-1">
                <div className="flex items-center justify-between text-slate-500">
                  <span className="font-bold flex items-center gap-1">
                    <GitCommit className="w-3 h-3 text-slate-700" />
                    <span>commit a8f9b2c</span>
                  </span>
                  <span className="text-[10px]">Git Diff</span>
                </div>
                <p className="text-[11px] text-slate-700 font-medium">
                  +142 / -89 lines across auth/middleware.py
                </p>
                <div className="text-[10px] text-slate-400">2 hours ago on main</div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
