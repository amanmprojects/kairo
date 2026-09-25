"use client";

import React, { useState } from "react";
import {
  Network,
  Filter,
  FileCode2,
  BookOpen,
  GitMerge,
  User,
  Activity,
  AlertCircle,
  Clock,
  Layers,
  Sliders,
  CheckCircle2,
  GitCommit,
  ArrowRight,
  ShieldCheck,
} from "lucide-react";

interface GraphNode {
  id: number;
  type: "file" | "decision" | "pr" | "author";
  name: string;
  date: string;
  degree: number;
  layer: 1 | 2;
  risk?: "high" | "medium" | "low";
  connectedTo: number[];
}

export default function KnowledgeGraphPage() {
  const [activeFilter, setActiveFilter] = useState("All");
  const [maxDegree, setMaxDegree] = useState(20);
  const [selectedNodeId, setSelectedNodeId] = useState<number>(1);

  const filters = ["All", "Layer 1 (Code)", "Layer 2 (Decisions)", "Files", "PRs", "Authors"];

  const nodes: GraphNode[] = [
    {
      id: 1,
      type: "file",
      name: "auth/middleware.py",
      date: "2h ago",
      degree: 18,
      layer: 1,
      risk: "high",
      connectedTo: [2, 3, 4],
    },
    {
      id: 2,
      type: "decision",
      name: "ADR-042: Session Auth",
      date: "Mar 2023",
      degree: 12,
      layer: 2,
      risk: "high",
      connectedTo: [1, 3],
    },
    {
      id: 3,
      type: "pr",
      name: "PR #412 (JWT Migration)",
      date: "4h ago",
      degree: 14,
      layer: 1,
      risk: "high",
      connectedTo: [1, 2, 4],
    },
    {
      id: 4,
      type: "author",
      name: "Shruti G. (Primary Owner)",
      date: "Active",
      degree: 9,
      layer: 1,
      connectedTo: [1, 3],
    },
    {
      id: 5,
      type: "file",
      name: "db/knowledge_graph.py",
      date: "Yesterday",
      degree: 15,
      layer: 1,
      risk: "low",
      connectedTo: [6, 7, 8],
    },
    {
      id: 6,
      type: "decision",
      name: "ADR-038: Native SQL CTEs",
      date: "Jan 2024",
      degree: 8,
      layer: 2,
      risk: "low",
      connectedTo: [5, 7],
    },
    {
      id: 7,
      type: "pr",
      name: "PR #388 (Recursive CTEs)",
      date: "3w ago",
      degree: 10,
      layer: 1,
      connectedTo: [5, 6, 8],
    },
    {
      id: 8,
      type: "author",
      name: "Aman M. (Architect)",
      date: "Active",
      degree: 16,
      layer: 1,
      connectedTo: [5, 7],
    },
    {
      id: 9,
      type: "file",
      name: "graphrag/hub_suppression.py",
      date: "3d ago",
      degree: 7,
      layer: 1,
      connectedTo: [10, 11, 12],
    },
    {
      id: 10,
      type: "decision",
      name: "ADR-045: Degree Capping",
      date: "Feb 2024",
      degree: 6,
      layer: 2,
      connectedTo: [9, 11],
    },
    {
      id: 11,
      type: "pr",
      name: "PR #415 (Hub Suppression)",
      date: "2d ago",
      degree: 8,
      layer: 1,
      connectedTo: [9, 10, 12],
    },
    {
      id: 12,
      type: "author",
      name: "Sharvari B. (Lead)",
      date: "Active",
      degree: 19,
      layer: 1,
      connectedTo: [9, 11],
    },
  ];

  const selectedNode = nodes.find((n) => n.id === selectedNodeId) || nodes[0];

  const filteredNodes = nodes.filter((node) => {
    if (activeFilter === "All") return true;
    if (activeFilter === "Layer 1 (Code)") return node.layer === 1;
    if (activeFilter === "Layer 2 (Decisions)") return node.layer === 2;
    if (activeFilter === "Files") return node.type === "file";
    if (activeFilter === "PRs") return node.type === "pr";
    if (activeFilter === "Authors") return node.type === "author";
    return true;
  });

  return (
    <div className="h-full flex flex-col space-y-4">
      {/* 1. Header & Telemetry Controls */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <Network className="w-5 h-5 text-teal-600" />
            <h1 className="text-xl font-bold text-slate-900 tracking-tight">
              Temporal Knowledge Graph Explorer
            </h1>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            Bitemporal traversal connecting code artifacts (Layer 1) to LLM-reasoned decisions (Layer 2)
          </p>
        </div>

        {/* Hub Suppression Control */}
        <div className="flex items-center gap-3 bg-slate-50 px-3.5 py-1.5 rounded-xl border border-slate-200 text-xs">
          <Sliders className="w-3.5 h-3.5 text-teal-600" />
          <div className="flex items-center gap-2 font-medium">
            <span className="text-slate-600">Hub Degree Cap:</span>
            <span className="font-bold font-mono text-teal-800">≤ {maxDegree}</span>
          </div>
          <input
            type="range"
            min="5"
            max="50"
            value={maxDegree}
            onChange={(e) => setMaxDegree(Number(e.target.value))}
            className="w-20 accent-teal-600 cursor-pointer"
          />
          <span className="text-[10px] bg-emerald-100 text-emerald-800 font-bold px-1.5 py-0.5 rounded">
            27% Overlap
          </span>
        </div>
      </div>

      {/* 2. Filter Pills */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs">
        <span className="text-slate-400 font-bold uppercase text-[10px] mr-1">Filter:</span>
        {filters.map((f) => (
          <button
            key={f}
            onClick={() => setActiveFilter(f)}
            className={`px-3 py-1 rounded-lg font-semibold transition-all shrink-0 ${
              activeFilter === f
                ? "bg-teal-600 text-white shadow-xs"
                : "bg-white text-slate-600 border border-slate-200 hover:bg-slate-50"
            }`}
          >
            {f}
          </button>
        ))}
      </div>

      {/* 3. Main Workspace: Graph Visualization + Node Inspector */}
      <div className="flex-1 grid grid-cols-1 lg:grid-cols-3 gap-6 min-h-0">
        {/* Graph Visual Canvas */}
        <div className="lg:col-span-2 bg-white border border-slate-200/80 rounded-2xl p-6 shadow-xs overflow-y-auto">
          <div className="flex items-center justify-between mb-4 pb-2 border-b border-slate-100 text-xs text-slate-400">
            <span>Graph Nodes ({filteredNodes.length} visible)</span>
            <div className="flex items-center gap-3">
              <span className="flex items-center gap-1 text-[11px] text-teal-700">
                <span className="w-2 h-2 rounded-full bg-teal-500" />
                Layer 1: Code
              </span>
              <span className="flex items-center gap-1 text-[11px] text-indigo-700">
                <span className="w-2 h-2 rounded-full bg-indigo-500" />
                Layer 2: Decisions
              </span>
            </div>
          </div>

          {/* Node Grid representation */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            {filteredNodes.map((node) => {
              const isSelected = node.id === selectedNodeId;

              return (
                <div
                  key={node.id}
                  onClick={() => setSelectedNodeId(node.id)}
                  className={`p-4 rounded-xl border transition-all cursor-pointer relative ${
                    isSelected
                      ? "border-teal-500 bg-teal-50/40 shadow-xs ring-2 ring-teal-200"
                      : "border-slate-200/90 bg-slate-50/60 hover:bg-white hover:border-slate-300"
                  }`}
                >
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider ${
                        node.layer === 1
                          ? "bg-teal-100 text-teal-800"
                          : "bg-indigo-100 text-indigo-800"
                      }`}
                    >
                      Layer {node.layer} • {node.type}
                    </span>

                    {node.risk === "high" && (
                      <span className="text-[10px] font-bold bg-amber-100 text-amber-800 px-1.5 py-0.5 rounded">
                        Drift Risk
                      </span>
                    )}
                  </div>

                  <h3 className="font-semibold text-xs text-slate-900 mb-1 truncate">
                    {node.name}
                  </h3>

                  <div className="flex items-center justify-between text-[11px] text-slate-400 pt-2 border-t border-slate-100">
                    <span>Degree: {node.degree}</span>
                    <span>{node.date}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Inspector Panel */}
        <div className="bg-white border border-slate-200/80 rounded-2xl p-5 shadow-xs flex flex-col justify-between space-y-4">
          <div className="space-y-4">
            <div className="pb-3 border-b border-slate-100">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                Node Inspector
              </span>
              <h3 className="text-base font-bold text-slate-900 mt-1">
                {selectedNode.name}
              </h3>
              <div className="flex items-center gap-2 mt-2">
                <span className="text-xs font-semibold bg-slate-100 px-2 py-0.5 rounded text-slate-700">
                  Type: {selectedNode.type}
                </span>
                <span className="text-xs font-semibold bg-teal-50 text-teal-800 px-2 py-0.5 rounded">
                  Layer {selectedNode.layer}
                </span>
              </div>
            </div>

            {/* Properties */}
            <div className="space-y-2 text-xs">
              <div className="flex justify-between py-1 border-b border-slate-100">
                <span className="text-slate-500">Degree Centrality:</span>
                <span className="font-mono font-semibold text-slate-900">{selectedNode.degree}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-100">
                <span className="text-slate-500">Bitemporal Valid Time:</span>
                <span className="font-semibold text-slate-900">{selectedNode.date}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-100">
                <span className="text-slate-500">Provenance Isolation:</span>
                <span className="font-bold text-emerald-600 flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  Verified Deterministic
                </span>
              </div>
            </div>

            {/* Connected Nodes */}
            <div>
              <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                Connected Edges ({selectedNode.connectedTo.length})
              </h4>
              <div className="space-y-1.5">
                {selectedNode.connectedTo.map((targetId) => {
                  const target = nodes.find((n) => n.id === targetId);
                  if (!target) return null;
                  return (
                    <div
                      key={target.id}
                      onClick={() => setSelectedNodeId(target.id)}
                      className="p-2 bg-slate-50 hover:bg-teal-50/50 rounded-lg border border-slate-200 text-xs flex items-center justify-between cursor-pointer transition-colors"
                    >
                      <span className="font-medium text-slate-800 truncate pr-2">
                        {target.name}
                      </span>
                      <span className="text-[10px] text-slate-400 uppercase font-mono">
                        {target.type}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          <div className="pt-3 border-t border-slate-100">
            <button
              onClick={() => alert(`Running recursive CTE walk from ${selectedNode.name}`)}
              className="w-full py-2 bg-teal-600 hover:bg-teal-700 text-white font-semibold rounded-xl text-xs transition-colors shadow-xs"
            >
              Run CTE Walk From Node
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
