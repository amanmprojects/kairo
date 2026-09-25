"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  Layers,
  ChevronDown,
  ChevronRight,
  GitBranch,
  CheckCircle2,
  Clock,
  FolderKanban,
  Target,
  Filter,
  BarChart3,
  ExternalLink,
  ShieldAlert
} from "lucide-react";

interface HierarchyNode {
  id: string;
  title: string;
  type: "objective" | "project" | "epic" | "issue" | "bug" | "subtask";
  points: number;
  completedPoints: number;
  status: "In Progress" | "Completed" | "Planning";
  repo?: string;
  assignee?: string;
  impactWarning?: string;
  children?: HierarchyNode[];
}

const HIERARCHY_DATA: HierarchyNode[] = [
  {
    id: "OBJ-2026-Q3",
    title: "Enterprise Reliability & Knowledge Automation",
    type: "objective",
    points: 84,
    completedPoints: 58,
    status: "In Progress",
    children: [
      {
        id: "PROJ-1",
        title: "Stateless Security & Identity Migration",
        type: "project",
        points: 32,
        completedPoints: 24,
        status: "In Progress",
        children: [
          {
            id: "EPIC-101",
            title: "Auth Modernization & Stateless Tokens",
            type: "epic",
            points: 24,
            completedPoints: 16,
            status: "In Progress",
            repo: "sharvarianand/kairo",
            children: [
              {
                id: "PR-142",
                title: "Refactor authentication middleware to use stateless JWTs",
                type: "issue",
                points: 8,
                completedPoints: 0,
                status: "In Progress",
                repo: "sharvarianand/kairo",
                assignee: "Aman Mehtar",
                impactWarning: "Conflicts with ADR-042 (Session-based auth standard)",
                children: [
                  {
                    id: "SUB-142-1",
                    title: "Implement RSA-256 public key verification cache",
                    type: "subtask",
                    points: 3,
                    completedPoints: 3,
                    status: "Completed",
                  },
                  {
                    id: "SUB-142-2",
                    title: "Benchmark cold-start overhead under 100 RPS load",
                    type: "subtask",
                    points: 5,
                    completedPoints: 0,
                    status: "In Progress",
                  },
                ],
              },
              {
                id: "ISSUE-388",
                title: "Session token validation causes high latency on cold starts",
                type: "bug",
                points: 3,
                completedPoints: 3,
                status: "Completed",
                repo: "sharvarianand/kairo",
                assignee: "Sharvari Bhondekar",
              },
            ],
          },
        ],
      },
      {
        id: "PROJ-2",
        title: "Bitemporal Knowledge Graph Engine",
        type: "project",
        points: 52,
        completedPoints: 34,
        status: "In Progress",
        children: [
          {
            id: "EPIC-102",
            title: "Knowledge Graph Temporal Engine v2",
            type: "epic",
            points: 42,
            completedPoints: 28,
            status: "In Progress",
            repo: "sharvarianand/kairo",
            children: [
              {
                id: "PR-147",
                title: "Implement temporal validity interval clipping on superseded edges",
                type: "issue",
                points: 5,
                completedPoints: 5,
                status: "Completed",
                repo: "sharvarianand/kairo",
                assignee: "Shruti Gauchandra",
              },
              {
                id: "ISSUE-402",
                title: "Define pgvector similarity threshold parameters for chunk ranking",
                type: "issue",
                points: 5,
                completedPoints: 0,
                status: "In Progress",
                repo: "sharvarianand/kairo",
                assignee: "Sarah K.",
              },
            ],
          },
        ],
      },
    ],
  },
];

export default function HierarchyPage() {
  const [expandedNodes, setExpandedNodes] = useState<Record<string, boolean>>({
    "OBJ-2026-Q3": true,
    "PROJ-1": true,
    "EPIC-101": true,
    "PR-142": true,
    "PROJ-2": true,
    "EPIC-102": true,
  });

  const toggleNode = (id: string) => {
    setExpandedNodes((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const expandAll = () => {
    setExpandedNodes({
      "OBJ-2026-Q3": true,
      "PROJ-1": true,
      "EPIC-101": true,
      "PR-142": true,
      "PROJ-2": true,
      "EPIC-102": true,
    });
  };

  const collapseAll = () => {
    setExpandedNodes({});
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <div className="flex items-center gap-2">
            <Layers className="w-6 h-6 text-teal-600" />
            <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
              Multi-Level Work Hierarchy
            </h1>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Align high-level Objectives down to Projects, Epics, Issues, and Sub-tasks with automated progress rollups
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={expandAll}
            className="text-xs font-semibold px-3 py-1.5 rounded-lg border border-slate-200 bg-white text-slate-700 hover:bg-slate-50 shadow-xs transition-colors"
          >
            Expand All
          </button>
          <button
            onClick={collapseAll}
            className="text-xs font-semibold px-3 py-1.5 rounded-lg border border-slate-200 bg-white text-slate-700 hover:bg-slate-50 shadow-xs transition-colors"
          >
            Collapse All
          </button>
        </div>
      </div>

      {/* Metric Cards Banner */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <div className="p-4 bg-white border border-slate-200/90 rounded-2xl shadow-xs">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
            Strategic Objectives
          </span>
          <div className="flex items-baseline gap-2 mt-1">
            <span className="text-2xl font-bold text-slate-900">1</span>
            <span className="text-xs text-teal-600 font-medium">Q3 Active</span>
          </div>
        </div>

        <div className="p-4 bg-white border border-slate-200/90 rounded-2xl shadow-xs">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
            Projects In Flight
          </span>
          <div className="flex items-baseline gap-2 mt-1">
            <span className="text-2xl font-bold text-slate-900">2</span>
            <span className="text-xs text-slate-500">Security &amp; Graph</span>
          </div>
        </div>

        <div className="p-4 bg-white border border-slate-200/90 rounded-2xl shadow-xs">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
            Epics Tracked
          </span>
          <div className="flex items-baseline gap-2 mt-1">
            <span className="text-2xl font-bold text-slate-900">2</span>
            <span className="text-xs text-indigo-600 font-medium">66 Pts Total</span>
          </div>
        </div>

        <div className="p-4 bg-white border border-slate-200/90 rounded-2xl shadow-xs">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
            Overall Completion
          </span>
          <div className="flex items-baseline gap-2 mt-1">
            <span className="text-2xl font-bold text-teal-700">69%</span>
            <span className="text-xs font-mono text-slate-500">58/84 Pts</span>
          </div>
        </div>
      </div>

      {/* Main Hierarchy Tree */}
      <div className="space-y-4">
        {HIERARCHY_DATA.map((obj) => {
          const objPct = Math.round((obj.completedPoints / obj.points) * 100);
          return (
            <div
              key={obj.id}
              className="bg-white border border-slate-200/90 rounded-2xl shadow-xs overflow-hidden"
            >
              {/* Level 1: Objective */}
              <div className="p-5 border-b border-slate-100 bg-slate-50/60 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => toggleNode(obj.id)}
                    className="w-7 h-7 rounded-lg border border-slate-200 bg-white flex items-center justify-center text-slate-600 hover:text-slate-900 shadow-2xs transition-colors"
                  >
                    <ChevronDown
                      size={16}
                      className={`transition-transform duration-200 ${
                        expandedNodes[obj.id] ? "" : "-rotate-90"
                      }`}
                    />
                  </button>

                  <div>
                    <div className="flex items-center gap-2">
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-teal-100 text-teal-800">
                        OBJECTIVE
                      </span>
                      <span className="font-mono text-xs text-slate-400">{obj.id}</span>
                      <span className="text-[10px] font-semibold bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-full">
                        {obj.status}
                      </span>
                    </div>
                    <h2 className="text-base font-bold text-slate-900 mt-1">
                      {obj.title}
                    </h2>
                  </div>
                </div>

                <div className="text-right">
                  <span className="text-xs font-mono font-bold text-slate-700">
                    {obj.completedPoints} / {obj.points} pts ({objPct}%)
                  </span>
                  <div className="w-36 h-2 rounded-full bg-slate-200 mt-1.5 overflow-hidden">
                    <div
                      className="h-full bg-teal-600 transition-all duration-300"
                      style={{ width: `${objPct}%` }}
                    />
                  </div>
                </div>
              </div>

              {/* Level 2: Projects */}
              {expandedNodes[obj.id] && obj.children && (
                <div className="p-5 space-y-4 bg-white">
                  {obj.children.map((proj) => {
                    const projPct = Math.round((proj.completedPoints / proj.points) * 100);
                    return (
                      <div
                        key={proj.id}
                        className="rounded-xl border border-slate-200/90 bg-slate-50/40 p-4 space-y-3"
                      >
                        <div className="flex items-start justify-between">
                          <div className="flex items-start gap-2.5">
                            <button
                              onClick={() => toggleNode(proj.id)}
                              className="mt-0.5 w-6 h-6 rounded-md bg-white border border-slate-200 flex items-center justify-center text-slate-500 hover:text-slate-900 shadow-2xs"
                            >
                              <ChevronDown
                                size={14}
                                className={`transition-transform duration-200 ${
                                  expandedNodes[proj.id] ? "" : "-rotate-90"
                                }`}
                              />
                            </button>

                            <div>
                              <div className="flex items-center gap-2">
                                <span className="px-1.5 py-0.5 rounded text-[9px] font-bold bg-indigo-100 text-indigo-800">
                                  PROJECT
                                </span>
                                <span className="font-mono text-xs text-slate-400">{proj.id}</span>
                              </div>
                              <h3 className="text-sm font-bold text-slate-900 mt-0.5">
                                {proj.title}
                              </h3>
                            </div>
                          </div>

                          <div className="text-right">
                            <span className="text-[11px] font-mono font-semibold text-slate-600">
                              {proj.completedPoints} / {proj.points} pts ({projPct}%)
                            </span>
                            <div className="w-28 h-1.5 rounded-full bg-slate-200 mt-1 overflow-hidden">
                              <div
                                className="h-full bg-indigo-600"
                                style={{ width: `${projPct}%` }}
                              />
                            </div>
                          </div>
                        </div>

                        {/* Level 3: Epics */}
                        {expandedNodes[proj.id] && proj.children && (
                          <div className="pl-6 border-l-2 border-slate-200 space-y-3 pt-2">
                            {proj.children.map((epic) => {
                              const epicPct = Math.round((epic.completedPoints / epic.points) * 100);
                              return (
                                <div
                                  key={epic.id}
                                  className="rounded-xl border border-slate-200 bg-white p-3.5 space-y-3 shadow-2xs"
                                >
                                  <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-2.5">
                                      <button
                                        onClick={() => toggleNode(epic.id)}
                                        className="w-5 h-5 rounded bg-slate-100 flex items-center justify-center text-slate-500 hover:text-slate-900"
                                      >
                                        <ChevronDown
                                          size={12}
                                          className={`transition-transform duration-200 ${
                                            expandedNodes[epic.id] ? "" : "-rotate-90"
                                          }`}
                                        />
                                      </button>
                                      <span className="px-1.5 py-0.5 rounded text-[9px] font-bold bg-purple-100 text-purple-800">
                                        EPIC
                                      </span>
                                      <span className="text-xs font-bold text-slate-900">
                                        {epic.title}
                                      </span>
                                      {epic.repo && (
                                        <span className="text-[10px] font-mono bg-slate-100 text-slate-600 px-1.5 py-0.5 rounded">
                                          {epic.repo}
                                        </span>
                                      )}
                                    </div>
                                    <span className="text-[10px] font-mono font-bold bg-slate-100 text-slate-700 px-2 py-0.5 rounded">
                                      {epic.completedPoints} / {epic.points} pts ({epicPct}%)
                                    </span>
                                  </div>

                                  {/* Level 4: Issues / PRs */}
                                  {expandedNodes[epic.id] && epic.children && (
                                    <div className="pl-5 border-l-2 border-teal-200/80 space-y-2 pt-1">
                                      {epic.children.map((item) => (
                                        <div
                                          key={item.id}
                                          className="p-3 rounded-lg bg-slate-50 border border-slate-200/80 space-y-2"
                                        >
                                          <div className="flex items-start justify-between gap-3 text-xs">
                                            <div className="flex items-start gap-2">
                                              {item.children && item.children.length > 0 && (
                                                <button
                                                  onClick={() => toggleNode(item.id)}
                                                  className="mt-0.5 text-slate-400 hover:text-slate-700"
                                                >
                                                  <ChevronDown
                                                    size={12}
                                                    className={`transition-transform duration-200 ${
                                                      expandedNodes[item.id] ? "" : "-rotate-90"
                                                    }`}
                                                  />
                                                </button>
                                              )}
                                              <span
                                                className={`px-1.5 py-0.5 rounded text-[8px] font-bold uppercase ${
                                                  item.type === "bug"
                                                    ? "bg-rose-100 text-rose-800"
                                                    : "bg-teal-100 text-teal-800"
                                                }`}
                                              >
                                                {item.type}
                                              </span>
                                              <span className="font-mono text-[11px] font-bold text-slate-600">
                                                {item.id}
                                              </span>
                                              <span className="font-semibold text-slate-800">
                                                {item.title}
                                              </span>
                                            </div>

                                            <div className="flex items-center gap-2 shrink-0">
                                              {item.assignee && (
                                                <span className="text-[10px] font-medium text-slate-500 bg-white border border-slate-200 px-2 py-0.5 rounded">
                                                  {item.assignee}
                                                </span>
                                              )}
                                              <span className="font-mono text-[10px] font-bold text-slate-700">
                                                {item.points} pts
                                              </span>
                                            </div>
                                          </div>

                                          {/* Impact Warning Pill if detected */}
                                          {item.impactWarning && (
                                            <div className="flex items-center gap-1.5 p-2 bg-amber-50 border border-amber-200 rounded text-[11px] text-amber-800 font-medium">
                                              <ShieldAlert size={13} className="text-amber-600 shrink-0" />
                                              <span>{item.impactWarning}</span>
                                            </div>
                                          )}

                                          {/* Level 5: Sub-Tasks */}
                                          {expandedNodes[item.id] && item.children && (
                                            <div className="pl-4 border-l border-slate-200 space-y-1.5 pt-1">
                                              {item.children.map((sub) => (
                                                <div
                                                  key={sub.id}
                                                  className="flex items-center justify-between text-[11px] p-1.5 rounded bg-white border border-slate-200/60"
                                                >
                                                  <div className="flex items-center gap-2">
                                                    <span className="text-slate-400 font-mono text-[10px]">
                                                      {sub.id}
                                                    </span>
                                                    <span className="text-slate-700 font-normal">
                                                      {sub.title}
                                                    </span>
                                                  </div>
                                                  <div className="flex items-center gap-2">
                                                    <span
                                                      className={`text-[9px] font-bold px-1.5 py-0.5 rounded ${
                                                        sub.status === "Completed"
                                                          ? "bg-emerald-100 text-emerald-800"
                                                          : "bg-slate-100 text-slate-600"
                                                      }`}
                                                    >
                                                      {sub.status}
                                                    </span>
                                                    <span className="font-mono text-[10px] text-slate-500">
                                                      {sub.points} pts
                                                    </span>
                                                  </div>
                                                </div>
                                              ))}
                                            </div>
                                          )}
                                        </div>
                                      ))}
                                    </div>
                                  )}
                                </div>
                              );
                            })}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
