"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Activity,
  Kanban,
  Search,
  Network,
  ShieldAlert,
  Settings as SettingsIcon,
  GitBranch,
  ExternalLink,
  Sparkles,
} from "lucide-react";
import KairoLogo from "@/components/KairoLogo";
import OnboardingGuide from "./OnboardingGuide";

export default function DemoLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  const navLinks = [
    { name: "Overview", href: "/demo", icon: Activity, badge: null },
    { name: "Sprint Board", href: "/demo/board", icon: Kanban, badge: "3 PRs" },
    { name: "Ask KAIRO", href: "/demo/ask", icon: Search, badge: "AI" },
    { name: "Knowledge Graph", href: "/demo/graph", icon: Network, badge: "2-Layer" },
    { name: "Impact Scan", href: "/demo/impact", icon: ShieldAlert, badge: "Risk" },
    { name: "Settings", href: "/demo/settings", icon: SettingsIcon, badge: null },
  ];

  return (
    <div className="flex flex-col h-screen bg-slate-50 text-slate-900 font-sans overflow-hidden">
      {/* 1. ZenHub-style Top Announcement Banner */}
      <div className="h-9 bg-gradient-to-r from-teal-600 via-teal-700 to-indigo-700 text-white text-xs px-4 flex items-center justify-between shrink-0 font-medium">
        <div className="flex items-center gap-2">
          <span className="bg-white/20 px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider">
            Live Interactive Workspace
          </span>
          <span>
            Explore how KAIRO prevents architectural decay with bitemporal graphs.
          </span>
        </div>
        <div className="flex items-center gap-3">
          <Link
            href="/connect"
            className="bg-white text-teal-800 hover:bg-slate-100 font-semibold px-3 py-1 rounded text-xs transition-colors shadow-sm"
          >
            Connect GitHub Repo
          </Link>
          <Link
            href="/"
            className="text-white/80 hover:text-white flex items-center gap-1 text-xs transition-colors"
          >
            <span>Exit Demo</span>
            <ExternalLink className="w-3 h-3" />
          </Link>
        </div>
      </div>

      <div className="flex flex-1 overflow-hidden">
        {/* 2. Left Sidebar (Light SaaS Theme) */}
        <aside className="w-64 bg-white border-r border-slate-200 flex flex-col justify-between shrink-0 shadow-sm">
          <div>
            {/* Brand Logo Header */}
            <div className="h-16 flex items-center px-6 border-b border-slate-100 gap-3">
              <KairoLogo className="w-7 h-7" />
              <div className="flex flex-col">
                <span className="font-bold text-lg tracking-tight text-slate-900">
                  KAIRO
                </span>
                <span className="text-[10px] font-medium text-teal-700 -mt-1 tracking-wider uppercase">
                  Intelligence Demo
                </span>
              </div>
            </div>

            {/* Navigation Links */}
            <nav className="p-3 space-y-1">
              <div className="px-3 pt-2 pb-1 text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                Workspace
              </div>
              {navLinks.map((link) => {
                const isActive = pathname === link.href;
                const Icon = link.icon;
                return (
                  <Link
                    key={link.name}
                    href={link.href}
                    className={`flex items-center justify-between px-3 py-2 rounded-xl text-xs font-semibold transition-all ${
                      isActive
                        ? "bg-teal-50 text-teal-800 border border-teal-200/80 shadow-xs"
                        : "text-slate-600 hover:bg-slate-100/80 hover:text-slate-900"
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <Icon
                        className={`w-4 h-4 ${
                          isActive ? "text-teal-600" : "text-slate-400"
                        }`}
                      />
                      <span>{link.name}</span>
                    </div>
                    {link.badge && (
                      <span
                        className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${
                          isActive
                            ? "bg-teal-200/70 text-teal-900"
                            : link.badge === "Risk"
                            ? "bg-amber-100 text-amber-800"
                            : "bg-slate-100 text-slate-600"
                        }`}
                      >
                        {link.badge}
                      </span>
                    )}
                  </Link>
                );
              })}
            </nav>
          </div>

          {/* User and Repo Context Footer */}
          <div className="p-4 border-t border-slate-100 bg-slate-50/50">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-full bg-slate-900 text-white font-bold text-xs flex items-center justify-center shadow-xs">
                  SB
                </div>
                <div className="flex flex-col">
                  <span className="text-xs font-semibold text-slate-900">
                    Demo Workspace
                  </span>
                  <span className="text-[10px] text-slate-500">
                    VCET Paper-a-Thon 2026
                  </span>
                </div>
              </div>
              <div className="w-2 h-2 rounded-full bg-emerald-500 ring-4 ring-emerald-100" />
            </div>
          </div>
        </aside>

        {/* 3. Main Workspace Area */}
        <main className="flex-1 flex flex-col overflow-hidden bg-slate-50">
          {/* Top Header Bar */}
          <header className="h-14 bg-white border-b border-slate-200 flex items-center justify-between px-6 shrink-0 shadow-xs">
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-1.5 text-xs text-slate-500 font-medium">
                <span className="text-slate-400">repo /</span>
                <span className="font-semibold text-slate-900">sharvarianand / kairo</span>
              </div>
              <div className="flex items-center gap-1 bg-slate-100 text-slate-600 px-2 py-0.5 rounded text-[11px] font-mono border border-slate-200/60">
                <GitBranch className="w-3 h-3 text-slate-500" />
                <span>main</span>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <div className="hidden sm:flex items-center gap-2 bg-emerald-50 border border-emerald-200 text-emerald-800 px-3 py-1 rounded-full text-xs font-medium">
                <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                <span>Readiness: 85% (Healthy)</span>
              </div>

              <Link
                href="/demo/ask"
                className="hidden md:flex items-center gap-2 text-xs text-slate-500 bg-slate-100 hover:bg-slate-200 px-3 py-1.5 rounded-lg border border-slate-200 transition-colors"
              >
                <Search className="w-3.5 h-3.5 text-slate-400" />
                <span>Ask KAIRO anything...</span>
                <kbd className="bg-white px-1.5 py-0.5 rounded text-[10px] text-slate-400 border border-slate-200 shadow-2xs font-mono">
                  ⌘K
                </kbd>
              </Link>

              <div className="w-8 h-8 rounded-full bg-teal-600 text-white font-bold text-xs flex items-center justify-center shadow-xs">
                AI
              </div>
            </div>
          </header>

          {/* Scrollable Page Body */}
          <div className="flex-1 overflow-auto p-6 md:p-8 relative">
            {children}
          </div>
        </main>
      </div>

      {/* 4. ZenHub-style Docked Onboarding Tour Popup */}
      <OnboardingGuide />
    </div>
  );
}
