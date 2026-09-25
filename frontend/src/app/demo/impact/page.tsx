"use client";

import React, { useState } from "react";
import {
  AlertTriangle,
  ShieldAlert,
  FileText,
  CheckCircle2,
  ChevronDown,
  Activity,
  FileCode2,
  Users,
  GitPullRequest,
  CheckSquare,
  Square,
  ArrowRight,
  ExternalLink,
} from "lucide-react";

export default function ChangeImpactScannerPage() {
  const [checklist, setChecklist] = useState<Record<string, boolean>>({
    ownerReview: true,
    adrUpdate: false,
    refreshTest: false,
    archMeeting: false,
  });

  const toggleCheck = (key: string) => {
    setChecklist((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2 mb-1">
          <ShieldAlert className="w-6 h-6 text-amber-600" />
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
            Change Impact Scanner
          </h1>
        </div>
        <p className="text-xs sm:text-sm text-slate-500">
          Pre-merge blast radius intelligence cross-referencing code diffs with historical ADRs
        </p>
      </div>

      {/* PR Selector Banner */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-amber-50 flex items-center justify-center text-amber-700">
            <GitPullRequest className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
              Analyzed Pull Request
            </span>
            <div className="flex items-center gap-2">
              <h3 className="font-bold text-sm text-slate-900">
                PR #412: Refactor auth middleware to JWT
              </h3>
              <span className="text-[10px] bg-amber-100 text-amber-800 font-bold px-2 py-0.5 rounded-full">
                High Risk
              </span>
            </div>
          </div>
        </div>

        <div className="text-xs text-slate-500 font-mono">
          Branch: <span className="font-semibold text-slate-700">feat/jwt-auth</span> → <span className="font-semibold text-slate-700">main</span>
        </div>
      </div>

      {/* 3 Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white border border-slate-200/80 p-5 rounded-2xl shadow-xs">
          <div className="flex items-center gap-2 text-slate-500 text-xs font-semibold mb-2">
            <FileCode2 className="w-4 h-4 text-teal-600" />
            <span>Files in Blast Radius</span>
          </div>
          <div className="text-2xl font-bold text-slate-900">12</div>
          <p className="text-[11px] text-slate-400 mt-1">4 core modules, 8 dependencies</p>
        </div>

        <div className="bg-white border border-amber-200 p-5 rounded-2xl shadow-xs">
          <div className="flex items-center gap-2 text-amber-700 text-xs font-semibold mb-2">
            <AlertTriangle className="w-4 h-4 text-amber-600" />
            <span>Decision Conflicts</span>
          </div>
          <div className="text-2xl font-bold text-amber-700">2</div>
          <p className="text-[11px] text-amber-600 font-medium mt-1">
            Violates ADR-042 (Session standard)
          </p>
        </div>

        <div className="bg-white border border-slate-200/80 p-5 rounded-2xl shadow-xs">
          <div className="flex items-center gap-2 text-slate-500 text-xs font-semibold mb-2">
            <Activity className="w-4 h-4 text-rose-600" />
            <span>Predicted Bug Risk</span>
          </div>
          <div className="text-2xl font-bold text-rose-600">23%</div>
          <p className="text-[11px] text-slate-400 mt-1">Based on 47 historical regressions</p>
        </div>
      </div>

      {/* Detailed Impact Report */}
      <div className="bg-white border border-slate-200/80 rounded-2xl shadow-xs overflow-hidden divide-y divide-slate-100">
        {/* Section 1: Modified Files */}
        <div className="p-6 space-y-3">
          <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
            1. Modified Files Analysis
          </h3>
          <div className="border border-slate-200 rounded-xl overflow-hidden text-xs">
            <table className="w-full text-left">
              <thead className="bg-slate-50 text-slate-500 border-b border-slate-200 font-semibold">
                <tr>
                  <th className="p-3">File</th>
                  <th className="p-3">Diff</th>
                  <th className="p-3">Churn Risk</th>
                  <th className="p-3">Primary Owner</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                <tr className="hover:bg-slate-50/50">
                  <td className="p-3 font-mono font-medium text-slate-900">auth/middleware.py</td>
                  <td className="p-3 text-emerald-600 font-mono">+142 / -89</td>
                  <td className="p-3">
                    <span className="text-[10px] font-bold bg-rose-100 text-rose-800 px-2 py-0.5 rounded">
                      High Churn (47 edits)
                    </span>
                  </td>
                  <td className="p-3 text-slate-700">Shruti G.</td>
                </tr>
                <tr className="hover:bg-slate-50/50">
                  <td className="p-3 font-mono font-medium text-slate-900">auth/jwt_handler.py</td>
                  <td className="p-3 text-emerald-600 font-mono">+67 / -12</td>
                  <td className="p-3">
                    <span className="text-[10px] font-bold bg-amber-100 text-amber-800 px-2 py-0.5 rounded">
                      Medium
                    </span>
                  </td>
                  <td className="p-3 text-slate-700">Aman M.</td>
                </tr>
                <tr className="hover:bg-slate-50/50">
                  <td className="p-3 font-mono font-medium text-slate-900">config/settings.py</td>
                  <td className="p-3 text-slate-600 font-mono">+8 / -3</td>
                  <td className="p-3">
                    <span className="text-[10px] font-bold bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded">
                      Low
                    </span>
                  </td>
                  <td className="p-3 text-slate-700">Sharvari B.</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* Section 2: Decision Conflicts Detected */}
        <div className="p-6 space-y-3 bg-amber-50/30">
          <div className="flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-amber-700" />
            <h3 className="text-sm font-bold text-amber-900 uppercase tracking-wider">
              2. Architectural Decision Conflicts
            </h3>
          </div>
          <div className="space-y-3">
            <div className="p-4 bg-white border border-amber-200 rounded-xl shadow-2xs space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold text-slate-900">
                  Conflict with ADR-042: Stateful Session Architecture
                </span>
                <span className="text-[10px] bg-rose-100 text-rose-800 font-bold px-2 py-0.5 rounded">
                  Undocumented Drift
                </span>
              </div>
              <p className="text-xs text-slate-600 leading-relaxed">
                ADR-042 explicitly mandates stateful Redis sessions for SOC2 compliance. This PR replaces sessions with stateless JWTs without superseding ADR-042.
              </p>
            </div>
          </div>
        </div>

        {/* Section 3: Recommended Actions */}
        <div className="p-6 space-y-3">
          <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
            3. Recommended Mitigation Actions
          </h3>
          <div className="space-y-2 text-xs">
            {[
              {
                key: "ownerReview",
                label: "Request explicit sign-off from module owner (Shruti G.)",
              },
              {
                key: "adrUpdate",
                label: "Author ADR-046 to formally supersede ADR-042 before merging",
              },
              {
                key: "refreshTest",
                label: "Add automated integration tests for token refresh flow",
              },
              {
                key: "archMeeting",
                label: "Verify edge-runtime compatibility across auth cluster",
              },
            ].map((item) => (
              <div
                key={item.key}
                onClick={() => toggleCheck(item.key)}
                className="flex items-center gap-3 p-3 bg-slate-50 hover:bg-slate-100/80 rounded-xl border border-slate-200/80 cursor-pointer transition-colors"
              >
                {checklist[item.key] ? (
                  <CheckSquare className="w-4 h-4 text-teal-600 shrink-0" />
                ) : (
                  <Square className="w-4 h-4 text-slate-400 shrink-0" />
                )}
                <span
                  className={
                    checklist[item.key]
                      ? "text-slate-900 font-medium line-through text-slate-400"
                      : "text-slate-800 font-medium"
                  }
                >
                  {item.label}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
