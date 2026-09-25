"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { CheckCircle2, Circle, X, ChevronRight, Compass } from "lucide-react";

interface TourStep {
  id: string;
  name: string;
  tagline: string;
  description: string;
  href: string;
}

const TOUR_STEPS: TourStep[] = [
  {
    id: "overview",
    name: "ANALYZE",
    tagline: "Workspace Overview & DDI",
    description: "Inspect sprint health, Decision Drift Index (72/100), and repository evolution metrics.",
    href: "/demo",
  },
  {
    id: "board",
    name: "PLAN",
    tagline: "Architecture-Aware Board",
    description: "Manage backlog with automated impact badges and Fibonacci Planning Poker estimation.",
    href: "/demo/board",
  },
  {
    id: "hierarchy",
    name: "ALIGN",
    tagline: "Multi-Level Hierarchy",
    description: "Align Objectives down to Projects, Epics, and Sub-tasks with automated progress rollups.",
    href: "/demo/hierarchy",
  },
  {
    id: "ask",
    name: "REASON",
    tagline: "Ask KAIRO (GraphRAG)",
    description: "Query repository memory with Three-Mode GraphRAG and bitemporal citations.",
    href: "/demo/ask",
  },
  {
    id: "graph",
    name: "EXPLORE",
    tagline: "Temporal Knowledge Graph",
    description: "Traverse deterministic code facts and interpreted decisions with hub suppression.",
    href: "/demo/graph",
  },
  {
    id: "impact",
    name: "PREVENT",
    tagline: "Change Impact Scanner",
    description: "Scan PR blast radius to block architectural drift before merging.",
    href: "/demo/impact",
  },
];

export default function OnboardingGuide() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(true);
  const [visited, setVisited] = useState<string[]>([]);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    const stored = localStorage.getItem("kairo_demo_visited");
    if (stored) {
      try {
        setVisited(JSON.parse(stored));
      } catch {
        setVisited(["overview"]);
      }
    } else {
      setVisited(["overview"]);
    }
  }, []);

  useEffect(() => {
    if (!isMounted) return;
    const current = TOUR_STEPS.find((s) => s.href === pathname);
    if (current && !visited.includes(current.id)) {
      const next = [...visited, current.id];
      setVisited(next);
      localStorage.setItem("kairo_demo_visited", JSON.stringify(next));
    }
  }, [pathname, isMounted, visited]);

  if (!isMounted) return null;

  const progress = Math.round((visited.length / TOUR_STEPS.length) * 100);

  return (
    <>
      {/* Minimized Pill Button */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="fixed bottom-6 left-6 z-50 flex items-center gap-2.5 px-4 py-2.5 bg-slate-900 hover:bg-slate-800 text-white rounded-full shadow-2xl border border-slate-700 text-xs font-semibold tracking-wide transition-all hover:scale-105"
        >
          <div className="w-2 h-2 rounded-full bg-teal-400 animate-pulse" />
          <Compass className="w-4 h-4 text-teal-400" />
          <span>Interactive Tour Guide</span>
          <span className="bg-teal-500/20 text-teal-300 px-2 py-0.5 rounded-full text-[10px]">
            {progress}%
          </span>
        </button>
      )}

      {/* Floating ZenHub-style Tour Widget */}
      {isOpen && (
        <div className="fixed bottom-6 left-6 z-50 w-80 sm:w-96 bg-white rounded-2xl shadow-2xl border border-slate-200/90 overflow-hidden animate-in fade-in slide-in-from-bottom-6 duration-300">
          {/* Header */}
          <div className="p-4 bg-slate-50 border-b border-slate-200/80">
            <div className="flex items-start justify-between gap-3 mb-2">
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 rounded-lg bg-teal-500/10 flex items-center justify-center text-teal-600">
                  <Compass className="w-3.5 h-3.5" />
                </div>
                <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                  Interactive Demo Guide
                </h4>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="text-slate-400 hover:text-slate-600 p-1 rounded-md hover:bg-slate-200/60 transition-colors"
                title="Minimize tour"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <p className="text-xs text-slate-600 leading-relaxed font-medium">
              Work your way through the list one at a time or skip ahead to a specific area of interest:
            </p>

            {/* Progress Bar */}
            <div className="mt-3">
              <div className="flex justify-between text-[11px] font-semibold text-slate-500 mb-1">
                <span>Tour Progress</span>
                <span className="text-teal-600">{progress}%</span>
              </div>
              <div className="w-full bg-slate-200/80 rounded-full h-1.5 overflow-hidden">
                <div
                  className="bg-gradient-to-r from-teal-500 to-emerald-500 h-1.5 rounded-full transition-all duration-500"
                  style={{ width: `${progress}%` }}
                />
              </div>
            </div>
          </div>

          {/* Steps List */}
          <div className="divide-y divide-slate-100 max-h-80 overflow-y-auto p-2">
            {TOUR_STEPS.map((step) => {
              const isCurrent = pathname === step.href;
              const isDone = visited.includes(step.id);

              return (
                <Link
                  key={step.id}
                  href={step.href}
                  className={`group flex items-start gap-3 p-3 rounded-xl transition-all ${
                    isCurrent
                      ? "bg-teal-50/80 border border-teal-200/70"
                      : "hover:bg-slate-50"
                  }`}
                >
                  <div className="pt-0.5 shrink-0">
                    {isDone ? (
                      <CheckCircle2 className="w-4 h-4 text-teal-600" />
                    ) : (
                      <Circle className="w-4 h-4 text-slate-300 group-hover:text-teal-500 transition-colors" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-bold text-teal-700 bg-teal-100/60 px-1.5 py-0.5 rounded tracking-wider">
                        {step.name}
                      </span>
                      <span className="text-xs font-semibold text-slate-900 truncate">
                        {step.tagline}
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-500 leading-tight mt-1 line-clamp-2">
                      {step.description}
                    </p>
                  </div>
                  <ChevronRight
                    className={`w-4 h-4 mt-1 transition-transform ${
                      isCurrent
                        ? "text-teal-600 translate-x-0.5"
                        : "text-slate-300 group-hover:text-slate-600 group-hover:translate-x-0.5"
                    }`}
                  />
                </Link>
              );
            })}
          </div>

          {/* Footer Controls */}
          <div className="p-3 bg-slate-50 border-t border-slate-200/80 flex items-center justify-between text-xs">
            <span className="text-slate-500 font-medium">
              Step {TOUR_STEPS.findIndex((s) => s.href === pathname) + 1 || 1} of {TOUR_STEPS.length}
            </span>
            <div className="flex items-center gap-2">
              <Link
                href="/connect"
                className="px-3 py-1.5 bg-slate-900 hover:bg-slate-800 text-white font-medium rounded-lg text-xs transition-colors shadow-sm"
              >
                Connect GitHub
              </Link>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
