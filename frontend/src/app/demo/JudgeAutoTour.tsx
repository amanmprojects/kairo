"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import {
  Play,
  Pause,
  ChevronRight,
  ChevronLeft,
  X,
  GitPullRequest,
  ShieldAlert,
  Search,
  Activity,
  Layers,
  CheckCircle2,
  AlertTriangle,
  FileCode,
  ArrowRight,
  RotateCcw,
  Zap,
  Users
} from "lucide-react";

interface JudgeStep {
  id: string;
  badge: string;
  badgeColor: string;
  title: string;
  featureName: string;
  description: string;
  judgeTakeaway: string;
  routeHint: string;
}

const JUDGE_STEPS: JudgeStep[] = [
  {
    id: "pr_incoming",
    badge: "Step 1 of 6 • GitHub Ingestion",
    badgeColor: "bg-blue-100 text-blue-800 border-blue-200",
    featureName: "Layer 1 Deterministic Sync",
    title: "GitHub Pull Request #412 Received",
    description: "Developer @aman opens PR #412 proposing to replace session-based auth with stateless JWTs in auth/middleware.py (+142, -89 lines).",
    judgeTakeaway: "Unlike black-box AI tools, KAIRO's Layer 1 records absolute Git facts (commits, diffs, AST entities) into PostgreSQL with 0% hallucination.",
    routeHint: "/connect",
  },
  {
    id: "impact_scan",
    badge: "Step 2 of 6 • Pre-Merge Defense",
    badgeColor: "bg-amber-100 text-amber-800 border-amber-200",
    featureName: "Change Impact Scanner",
    title: "Architectural Blast Radius Intercepted",
    description: "Before merge, KAIRO inspects historical telemetry: auth/middleware.py has 47 historical changes and 23% bug correlation. High risk flagged!",
    judgeTakeaway: "KAIRO detects conflict with ADR-042: 'Session-based auth standard'. Standard CI passes tests; KAIRO prevents architectural decay.",
    routeHint: "/demo/impact",
  },
  {
    id: "graphrag_ask",
    badge: "Step 3 of 6 • Temporal GraphRAG",
    badgeColor: "bg-teal-100 text-teal-800 border-teal-200",
    featureName: "Three-Mode GraphRAG",
    title: "Instant Retrieval of Historical Rationale",
    description: "Query: 'Why did we standardize on session cookies in ADR-042?' KAIRO executes an Anchored SQL recursive CTE walk with bitemporal filtering.",
    judgeTakeaway: "Standard vector RAG has temporal blindness and returns outdated info. KAIRO reconstructs the exact evidence chain: ADR-042 accepted in Nov 2023.",
    routeHint: "/demo/ask",
  },
  {
    id: "ddi_spike",
    badge: "Step 4 of 6 • Novel Metric",
    badgeColor: "bg-rose-100 text-rose-800 border-rose-200",
    featureName: "Decision Drift Index (DDI)",
    title: "Decision Drift Metric Spikes to 72 / 100",
    description: "Because PR #412 contradicts active architecture without an ADR update, the workspace DDI increases from 18 to 72 (Elevated Drift Risk).",
    judgeTakeaway: "A quantifiable score representing codebase divergence from documented intent. Enables engineering managers to measure tech debt objectively.",
    routeHint: "/demo",
  },
  {
    id: "hierarchy_rollup",
    badge: "Step 5 of 6 • Agile Intelligence",
    badgeColor: "bg-purple-100 text-purple-800 border-purple-200",
    featureName: "Multi-Level Work Hierarchy",
    title: "Objective -> Project -> Epic Rollup",
    description: "PR #412 links directly into Objective Q3: 'Enterprise Reliability' -> Project: 'Stateless Security' -> Epic #101: 'Auth Modernization'.",
    judgeTakeaway: "Eliminates tool fragmentation. Product objectives, engineering issues, and code telemetry synchronize automatically in real-time.",
    routeHint: "/demo/hierarchy",
  },
  {
    id: "consensus_clear",
    badge: "Step 6 of 6 • Resolution & Clearance",
    badgeColor: "bg-emerald-100 text-emerald-800 border-emerald-200",
    featureName: "Planning Poker & Clearance",
    title: "Consensus Story Points & Merge Clearance",
    description: "Team reaches Fibonacci consensus (8 pts). Team updates ADR-042 with superseded validity and drafts ADR-048. Readiness hits 96%!",
    judgeTakeaway: "KAIRO transforms PR reviews from subjective arguments into evidence-grounded architectural evolution.",
    routeHint: "/demo/board",
  },
];

export default function JudgeAutoTour({
  isOpen,
  onClose,
}: {
  isOpen: boolean;
  onClose: () => void;
}) {
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const [progress, setProgress] = useState(0);
  const stepDuration = 6000; // 6 seconds per step

  const currentStep = JUDGE_STEPS[currentStepIndex];

  useEffect(() => {
    if (!isOpen) return;

    let startTime = Date.now();
    let animFrame: number;

    const tick = () => {
      if (!isPlaying) {
        animFrame = requestAnimationFrame(tick);
        return;
      }

      const elapsed = Date.now() - startTime;
      const pct = Math.min((elapsed / stepDuration) * 100, 100);
      setProgress(pct);

      if (elapsed >= stepDuration) {
        setCurrentStepIndex((prev) => {
          if (prev < JUDGE_STEPS.length - 1) {
            startTime = Date.now();
            return prev + 1;
          } else {
            setIsPlaying(false);
            return prev;
          }
        });
      } else {
        animFrame = requestAnimationFrame(tick);
      }
    };

    animFrame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(animFrame);
  }, [isOpen, isPlaying, currentStepIndex]);

  const handleNext = () => {
    if (currentStepIndex < JUDGE_STEPS.length - 1) {
      setCurrentStepIndex(currentStepIndex + 1);
      setProgress(0);
    } else {
      setIsPlaying(false);
    }
  };

  const handlePrev = () => {
    if (currentStepIndex > 0) {
      setCurrentStepIndex(currentStepIndex - 1);
      setProgress(0);
    }
  };

  const handleRestart = () => {
    setCurrentStepIndex(0);
    setProgress(0);
    setIsPlaying(true);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-950/70 backdrop-blur-md animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl border border-slate-200/90 shadow-2xl max-w-4xl w-full flex flex-col overflow-hidden max-h-[92vh]">
        {/* Top Control Bar */}
        <div className="px-6 py-4 bg-slate-900 text-white flex items-center justify-between gap-4 border-b border-slate-800">
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-8 h-8 rounded-xl bg-teal-500 text-slate-950 font-extrabold flex items-center justify-center shrink-0 text-sm shadow-sm shadow-teal-500/30">
              K
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-teal-400 uppercase tracking-wider">
                  Judge Automated Demo
                </span>
                <span className="text-[10px] bg-slate-800 text-slate-300 px-2 py-0.5 rounded font-mono">
                  PR #412 Inbuilt Run
                </span>
              </div>
              <h3 className="text-sm font-semibold text-white truncate">
                Simulated Architecture Defense Lifecycle
              </h3>
            </div>
          </div>

          {/* Media Player Controls */}
          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={() => setIsPlaying(!isPlaying)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-teal-600 hover:bg-teal-500 text-white text-xs font-semibold transition-all shadow-xs"
            >
              {isPlaying ? <Pause size={14} /> : <Play size={14} />}
              <span>{isPlaying ? "Pause" : "Play"}</span>
            </button>

            <button
              onClick={handleRestart}
              title="Restart Tour"
              className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors"
            >
              <RotateCcw size={14} />
            </button>

            <button
              onClick={onClose}
              className="p-1.5 rounded-lg bg-slate-800 hover:bg-rose-900/60 text-slate-400 hover:text-white transition-colors"
            >
              <X size={16} />
            </button>
          </div>
        </div>

        {/* Global Progress Bar */}
        <div className="w-full bg-slate-800 h-1 relative overflow-hidden">
          <div
            className="h-full bg-teal-400 transition-all duration-100 ease-linear"
            style={{
              width: `${((currentStepIndex + progress / 100) / JUDGE_STEPS.length) * 100}%`,
            }}
          />
        </div>

        {/* Main Content Area */}
        <div className="p-6 sm:p-8 flex-1 overflow-y-auto space-y-6">
          {/* Step Badge & Title Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-100">
            <div>
              <div className="flex items-center gap-2">
                <span
                  className={`text-[11px] font-bold px-2.5 py-0.5 rounded-full border ${currentStep.badgeColor}`}
                >
                  {currentStep.badge}
                </span>
                <span className="text-xs font-semibold text-teal-700 font-mono">
                  {currentStep.featureName}
                </span>
              </div>
              <h2 className="text-2xl font-bold text-slate-900 mt-1 tracking-tight">
                {currentStep.title}
              </h2>
            </div>

            {/* Quick Step Indicators */}
            <div className="flex items-center gap-1.5 self-start sm:self-center">
              {JUDGE_STEPS.map((step, idx) => (
                <button
                  key={step.id}
                  onClick={() => {
                    setCurrentStepIndex(idx);
                    setProgress(0);
                  }}
                  className={`h-2 rounded-full transition-all ${
                    currentStepIndex === idx
                      ? "w-8 bg-teal-600"
                      : idx < currentStepIndex
                      ? "w-2 bg-teal-300"
                      : "w-2 bg-slate-200"
                  }`}
                  title={step.title}
                />
              ))}
            </div>
          </div>

          {/* Interactive Feature Visual Simulation */}
          <div className="rounded-2xl border border-slate-200/90 bg-slate-50/70 p-5 shadow-inner">
            {currentStepIndex === 0 && (
              /* STEP 1: GitHub PR View */
              <div className="space-y-4">
                <div className="flex items-center justify-between p-3.5 bg-white border border-slate-200 rounded-xl shadow-xs">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center">
                      <GitPullRequest size={18} />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-slate-900">
                          PR #412: Refactor auth middleware to stateless JWTs
                        </span>
                        <span className="text-[10px] bg-emerald-100 text-emerald-800 font-bold px-1.5 py-0.2 rounded-full">
                          Open
                        </span>
                      </div>
                      <span className="text-[11px] text-slate-500 font-mono">
                        sharvarianand/kairo: feat/jwt-auth &rarr; main • by @aman
                      </span>
                    </div>
                  </div>
                  <span className="text-xs font-mono text-emerald-700 font-semibold bg-emerald-50 px-2 py-1 rounded border border-emerald-200">
                    +142 / -89 lines
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                  <div className="p-3 bg-white border border-slate-200 rounded-xl">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
                      Modified Files Intercepted
                    </span>
                    <ul className="space-y-1 font-mono text-slate-700 text-[11px]">
                      <li className="flex items-center justify-between">
                        <span>src/auth/middleware.py</span>
                        <span className="text-rose-600 font-bold">+120 -82</span>
                      </li>
                      <li className="flex items-center justify-between">
                        <span>src/config/settings.py</span>
                        <span className="text-teal-600 font-bold">+22 -7</span>
                      </li>
                    </ul>
                  </div>

                  <div className="p-3 bg-white border border-slate-200 rounded-xl">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
                      Layer 1 Deterministic Capture
                    </span>
                    <p className="text-[11px] text-slate-600 leading-relaxed">
                      GitHub REST webhook event indexed into PostgreSQL graph with commit SHA hash and AST symbols. Zero hallucination guarantee.
                    </p>
                  </div>
                </div>
              </div>
            )}

            {currentStepIndex === 1 && (
              /* STEP 2: Change Impact Scanner View */
              <div className="space-y-4">
                <div className="p-4 bg-amber-50 border border-amber-200 rounded-xl flex items-start gap-3">
                  <AlertTriangle className="w-5 h-5 text-amber-700 shrink-0 mt-0.5" />
                  <div>
                    <h4 className="text-xs font-bold text-amber-900">
                      Architectural Conflict Detected by Impact Scanner
                    </h4>
                    <p className="text-[11px] text-amber-800 leading-relaxed mt-0.5">
                      PR #412 modifies <strong>auth/middleware.py</strong>, directly contradicting <strong>ADR-042</strong> (Stateful Session Architecture).
                      Historical telemetry: 47 churn commits, 23% bug correlation rate.
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-3 text-center">
                  <div className="p-3 bg-white border border-slate-200 rounded-xl">
                    <span className="text-[10px] text-slate-400 uppercase font-bold block">Churn Frequency</span>
                    <span className="text-lg font-bold text-rose-600">47 Commits</span>
                    <span className="text-[10px] text-slate-500 block">Top 2% Hotspot</span>
                  </div>
                  <div className="p-3 bg-white border border-slate-200 rounded-xl">
                    <span className="text-[10px] text-slate-400 uppercase font-bold block">Bug Correlation</span>
                    <span className="text-lg font-bold text-amber-600">23.4%</span>
                    <span className="text-[10px] text-slate-500 block">Requires extra review</span>
                  </div>
                  <div className="p-3 bg-white border border-slate-200 rounded-xl">
                    <span className="text-[10px] text-slate-400 uppercase font-bold block">Mitigation Status</span>
                    <span className="text-lg font-bold text-indigo-700">Blocked</span>
                    <span className="text-[10px] text-slate-500 block">Needs ADR update</span>
                  </div>
                </div>
              </div>
            )}

            {currentStepIndex === 2 && (
              /* STEP 3: Three-Mode GraphRAG View */
              <div className="space-y-4">
                <div className="p-3 bg-white border border-slate-200 rounded-xl flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Search className="w-4 h-4 text-teal-600" />
                    <span className="text-xs font-bold text-slate-900">
                      &quot;Why did we standardize on session cookies in ADR-042?&quot;
                    </span>
                  </div>
                  <span className="text-[10px] font-mono font-bold bg-teal-100 text-teal-800 px-2 py-0.5 rounded">
                    Anchored + As-Of Walk
                  </span>
                </div>

                <div className="p-4 bg-white border border-slate-200 rounded-xl space-y-2.5">
                  <p className="text-xs text-slate-700 leading-relaxed">
                    <strong>KAIRO Answer:</strong> In PR #287 (November 2023), the architecture team evaluated JWTs but unanimously accepted <strong>ADR-042</strong> mandating server-side session cookies. The primary rationale was strict instantaneous token revocation requirements for HIPAA compliance and cold-start latency mitigation.
                  </p>
                  <div className="flex flex-wrap gap-2 pt-2 border-t border-slate-100 text-[10px]">
                    <span className="font-mono bg-slate-100 text-slate-700 px-2 py-0.5 rounded font-semibold">
                      Citation: ADR-042
                    </span>
                    <span className="font-mono bg-slate-100 text-slate-700 px-2 py-0.5 rounded font-semibold">
                      PR #287 (Accepted)
                    </span>
                    <span className="font-mono bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded font-bold">
                      Confidence: 94.2%
                    </span>
                  </div>
                </div>
              </div>
            )}

            {currentStepIndex === 3 && (
              /* STEP 4: Decision Drift Index View */
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 bg-white border border-slate-200 rounded-xl">
                  <div>
                    <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block">
                      Repository Decision Drift Index (DDI)
                    </span>
                    <div className="flex items-baseline gap-2 mt-1">
                      <span className="text-3xl font-extrabold text-amber-700">72 / 100</span>
                      <span className="text-xs font-bold text-rose-600 bg-rose-50 px-2 py-0.5 rounded border border-rose-200">
                        +54 Drift Spike
                      </span>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="text-xs text-slate-400 font-mono block">Baseline: 18 / 100</span>
                    <span className="text-xs font-semibold text-slate-700">Status: Elevated Risk</span>
                  </div>
                </div>

                <div className="p-3 bg-white border border-slate-200 rounded-xl text-xs space-y-1.5">
                  <span className="font-bold text-slate-800">Primary Contributor to Drift:</span>
                  <div className="flex items-center justify-between text-[11px] text-slate-600 bg-slate-50 p-2 rounded">
                    <span>auth/middleware.py (Undocumented stateless JWT migration)</span>
                    <span className="font-bold text-amber-700">78% of score</span>
                  </div>
                </div>
              </div>
            )}

            {currentStepIndex === 4 && (
              /* STEP 5: Work Hierarchy View */
              <div className="space-y-3">
                <div className="p-3.5 bg-white border border-slate-200 rounded-xl flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Layers className="w-4 h-4 text-purple-600" />
                    <div>
                      <span className="text-[10px] font-bold text-purple-800 bg-purple-100 px-1.5 py-0.5 rounded">
                        OBJECTIVE Q3
                      </span>
                      <h4 className="text-xs font-bold text-slate-900 mt-0.5">
                        Enterprise Reliability &amp; Knowledge Automation
                      </h4>
                    </div>
                  </div>
                  <span className="text-xs font-mono font-bold text-slate-700">58 / 84 Pts (69%)</span>
                </div>

                <div className="pl-6 border-l-2 border-slate-200 space-y-2">
                  <div className="p-2.5 bg-white border border-slate-200 rounded-lg flex items-center justify-between text-xs">
                    <span className="font-semibold text-slate-800">
                      Project 1: Stateless Security &amp; Identity Migration
                    </span>
                    <span className="font-mono text-[11px] text-indigo-700">24/32 pts</span>
                  </div>
                  <div className="pl-5 border-l-2 border-indigo-200 p-2 bg-white border border-slate-200 rounded-lg flex items-center justify-between text-xs">
                    <span className="text-slate-700">PR #412: Auth Middleware JWT Refactor</span>
                    <span className="text-[10px] font-bold bg-amber-100 text-amber-800 px-2 py-0.5 rounded">
                      Needs Architecture Signoff
                    </span>
                  </div>
                </div>
              </div>
            )}

            {currentStepIndex === 5 && (
              /* STEP 6: Resolution & Clearance */
              <div className="space-y-4">
                <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-xl flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-emerald-700 shrink-0 mt-0.5" />
                  <div>
                    <h4 className="text-xs font-bold text-emerald-900">
                      Architectural Governance Complete: Cleared for Merge!
                    </h4>
                    <p className="text-[11px] text-emerald-800 leading-relaxed mt-0.5">
                      1. Planning Poker reached team consensus: <strong>8 Story Points</strong> assigned.<br />
                      2. New <strong>ADR-048</strong> created formally approving JWT for Edge compatibility.<br />
                      3. Repository Readiness cleared at <strong>96% (Green)</strong>.
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3 text-xs">
                  <div className="p-3 bg-white border border-slate-200 rounded-xl flex items-center justify-between">
                    <div>
                      <span className="text-[10px] text-slate-400 block font-semibold">PLANNING POKER</span>
                      <span className="font-bold text-slate-900 text-sm">8 Story Points</span>
                    </div>
                    <Zap className="w-4 h-4 text-indigo-600" />
                  </div>
                  <div className="p-3 bg-white border border-slate-200 rounded-xl flex items-center justify-between">
                    <div>
                      <span className="text-[10px] text-slate-400 block font-semibold">READINESS CLEARANCE</span>
                      <span className="font-bold text-emerald-700 text-sm">96% Ready</span>
                    </div>
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Judge Takeaway Card */}
          <div className="p-4 bg-teal-50/70 border border-teal-200/90 rounded-2xl flex items-start gap-3 shadow-2xs">
            <Zap className="w-5 h-5 text-teal-700 shrink-0 mt-0.5" />
            <div className="space-y-1">
              <span className="text-xs font-bold text-teal-900 uppercase tracking-wider block">
                Why this matters for engineering teams &amp; judges:
              </span>
              <p className="text-xs text-teal-950 leading-relaxed">
                {currentStep.judgeTakeaway}
              </p>
            </div>
          </div>
        </div>

        {/* Footer Navigation Buttons */}
        <div className="px-6 py-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between gap-3">
          <button
            onClick={handlePrev}
            disabled={currentStepIndex === 0}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl border border-slate-300 text-slate-700 hover:bg-white text-xs font-semibold disabled:opacity-40 transition-all"
          >
            <ChevronLeft size={16} />
            <span>Previous</span>
          </button>

          <div className="text-xs text-slate-500 font-mono">
            {currentStepIndex + 1} / {JUDGE_STEPS.length}
          </div>

          {currentStepIndex < JUDGE_STEPS.length - 1 ? (
            <button
              onClick={handleNext}
              className="flex items-center gap-1.5 px-5 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold transition-all shadow-md"
            >
              <span>Next Feature</span>
              <ChevronRight size={16} />
            </button>
          ) : (
            <button
              onClick={onClose}
              className="flex items-center gap-1.5 px-5 py-2 rounded-xl bg-teal-600 hover:bg-teal-700 text-white text-xs font-bold transition-all shadow-md hover:shadow-lg"
            >
              <span>Explore Workspace</span>
              <ArrowRight size={16} />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
