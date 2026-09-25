"use client";

import React, { useState } from "react";
import {
  Settings,
  Database,
  Bell,
  Users,
  AlertTriangle,
  Save,
  Shield,
  Layers,
} from "lucide-react";

const Toggle = ({
  checked,
  onChange,
}: {
  checked: boolean;
  onChange?: () => void;
}) => (
  <button
    type="button"
    onClick={onChange}
    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none ${
      checked ? "bg-teal-600" : "bg-slate-300"
    }`}
  >
    <span
      className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
        checked ? "translate-x-6" : "translate-x-1"
      }`}
    />
  </button>
);

export default function SettingsPage() {
  const [autoSync, setAutoSync] = useState(true);
  const [llmExtraction, setLlmExtraction] = useState(true);
  const [hubSuppression, setHubSuppression] = useState(true);
  const [driftAlerts, setDriftAlerts] = useState(true);
  const [impactScan, setImpactScan] = useState(true);
  const [weeklyReports, setWeeklyReports] = useState(false);
  const [threshold, setThreshold] = useState(20);

  const teamMembers = [
    { name: "Sharvari Bhondekar", role: "Team Lead", status: "Active", initials: "SB" },
    { name: "Aman Mehtar", role: "Architect", status: "Active", initials: "AM" },
    { name: "Shruti Gauchandra", role: "Core Engineer", status: "Active", initials: "SG" },
    { name: "Prof. Kranti Gule", role: "Faculty Mentor", status: "Active", initials: "KG" },
    { name: "Dr. Tatwadarshi P. N.", role: "Principal Advisor", status: "Active", initials: "TN" },
  ];

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-12">
      {/* Title */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-6 border-b border-slate-200">
        <div>
          <div className="flex items-center gap-2">
            <Settings className="w-6 h-6 text-teal-600" />
            <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
              Workspace Settings
            </h1>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Configure bitemporal retention, trust isolation, and GitHub webhooks
          </p>
        </div>
        <button
          onClick={() => alert("Settings saved for repository sharvarianand/kairo")}
          className="flex items-center gap-2 bg-teal-600 hover:bg-teal-700 text-white px-4 py-2 rounded-xl font-semibold text-xs transition-colors shadow-xs"
        >
          <Save className="w-3.5 h-3.5" />
          <span>Save Changes</span>
        </button>
      </div>

      {/* 1. General Section */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div>
          <h2 className="text-sm font-bold text-slate-900">General Repository</h2>
          <p className="text-xs text-slate-500 mt-1">
            Repository connection and branch tracking metadata.
          </p>
        </div>
        <div className="md:col-span-2 bg-white border border-slate-200/80 rounded-2xl p-6 shadow-xs space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Connected GitHub Repository
            </label>
            <input
              type="text"
              readOnly
              value="sharvarianand/kairo"
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2 text-xs font-mono text-slate-800"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Default Trunk Branch
            </label>
            <input
              type="text"
              readOnly
              value="main"
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2 text-xs font-mono text-slate-800"
            />
          </div>
        </div>
      </div>

      {/* 2. Knowledge Graph Engine */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div>
          <h2 className="text-sm font-bold text-slate-900">Two-Layer Graph Engine</h2>
          <p className="text-xs text-slate-500 mt-1">
            Control automated decision extraction and hub degree suppression.
          </p>
        </div>
        <div className="md:col-span-2 bg-white border border-slate-200/80 rounded-2xl p-6 shadow-xs space-y-5">
          <div className="flex items-center justify-between">
            <div>
              <h4 className="text-xs font-semibold text-slate-900">
                Layer 1: Deterministic Sync
              </h4>
              <p className="text-[11px] text-slate-500">
                Poll GitHub REST & GraphQL events on every push/merge
              </p>
            </div>
            <Toggle checked={autoSync} onChange={() => setAutoSync(!autoSync)} />
          </div>

          <div className="flex items-center justify-between pt-4 border-t border-slate-100">
            <div>
              <h4 className="text-xs font-semibold text-slate-900">
                Layer 2: LLM Decision Extraction
              </h4>
              <p className="text-[11px] text-slate-500">
                Parse PR threads & discussions to generate bitemporal ADR nodes
              </p>
            </div>
            <Toggle checked={llmExtraction} onChange={() => setLlmExtraction(!llmExtraction)} />
          </div>

          <div className="pt-4 border-t border-slate-100">
            <div className="flex items-center justify-between mb-2">
              <div>
                <h4 className="text-xs font-semibold text-slate-900">
                  Dynamic Hub Suppression
                </h4>
                <p className="text-[11px] text-slate-500">
                  Cap recursive CTE degree to avoid graph hub domination
                </p>
              </div>
              <Toggle checked={hubSuppression} onChange={() => setHubSuppression(!hubSuppression)} />
            </div>
            {hubSuppression && (
              <div className="mt-3 p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs flex items-center justify-between">
                <span className="text-slate-600">Threshold Degree:</span>
                <span className="font-mono font-bold text-teal-800">≤ {threshold}</span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* 3. AI Model & Provider */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div>
          <h2 className="text-sm font-bold text-slate-900">LLM Intelligence Model</h2>
          <p className="text-xs text-slate-500 mt-1">
            Active provider and model for decision extraction and GraphRAG.
          </p>
        </div>
        <div className="md:col-span-2 bg-white border border-slate-200/80 rounded-2xl p-6 shadow-xs space-y-4">
          <div className="flex items-center justify-between p-3.5 bg-slate-50 border border-slate-200/80 rounded-xl">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-teal-100 text-teal-700 flex items-center justify-center font-bold text-xs">
                OR
              </div>
              <div>
                <h4 className="text-xs font-bold text-slate-900">OpenRouter Gateway</h4>
                <p className="text-[11px] font-mono text-slate-500">https://openrouter.ai/api/v1</p>
              </div>
            </div>
            <span className="text-[10px] font-bold bg-emerald-100 text-emerald-800 px-2.5 py-0.5 rounded-full">
              Connected
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
            <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl">
              <span className="text-slate-500 text-[11px] block mb-1">Active Model</span>
              <span className="font-mono font-bold text-teal-800 text-xs">cohere/north-mini-code:free</span>
            </div>
            <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl">
              <span className="text-slate-500 text-[11px] block mb-1">Context Length & Role</span>
              <span className="font-semibold text-slate-800 text-xs">256k tokens (Code Specialist)</span>
            </div>
          </div>
        </div>
      </div>

      {/* 3. Team Members */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div>
          <h2 className="text-sm font-bold text-slate-900">Team & Authors</h2>
          <p className="text-xs text-slate-500 mt-1">
            Contributors linked to repository ownership telemetry.
          </p>
        </div>
        <div className="md:col-span-2 bg-white border border-slate-200/80 rounded-2xl p-6 shadow-xs">
          <div className="divide-y divide-slate-100">
            {teamMembers.map((member) => (
              <div key={member.name} className="py-2.5 flex items-center justify-between first:pt-0 last:pb-0">
                <div className="flex items-center gap-2.5">
                  <div className="w-7 h-7 rounded-full bg-slate-900 text-white font-bold text-[10px] flex items-center justify-center">
                    {member.initials}
                  </div>
                  <div>
                    <h5 className="text-xs font-semibold text-slate-900">{member.name}</h5>
                    <span className="text-[10px] text-slate-400">{member.role}</span>
                  </div>
                </div>
                <span className="text-[10px] font-bold bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-full">
                  {member.status}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
