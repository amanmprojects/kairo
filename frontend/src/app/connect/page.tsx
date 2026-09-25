"use client";

import React from "react";
import Link from "next/link";
import KairoLogo from "@/components/KairoLogo";
import { CheckCircle, Search, Shield, Eye, ArrowLeft } from "lucide-react";

const GithubIcon = ({ size = 24, className = "" }: { size?: number; className?: string }) => (
  <svg width={size} height={size} className={className} viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z"/>
  </svg>
);

export default function ConnectPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-50 text-slate-900 font-sans p-4 relative">
      <Link
        href="/"
        className="absolute top-6 left-6 flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-slate-900 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Back to Home</span>
      </Link>

      {/* Background decoration */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-teal-100/40 via-slate-50 to-slate-50 pointer-events-none" />

      <div className="z-10 w-full max-w-md p-8 md:p-10 rounded-2xl border border-slate-200 bg-white shadow-xl flex flex-col items-center">
        <Link href="/" className="flex items-center gap-2.5 mb-8 group">
          <KairoLogo className="w-8 h-8 group-hover:scale-105 transition-transform" />
          <span className="text-2xl font-extrabold tracking-tight text-slate-900">
            KAIRO
          </span>
        </Link>

        <div className="h-16 w-16 rounded-2xl border border-slate-100 flex items-center justify-center bg-slate-50 shadow-sm mb-6">
          <GithubIcon size={32} className="text-slate-800" />
        </div>

        <div className="text-center space-y-3 mb-8">
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">
            Connect your GitHub account
          </h1>
          <p className="text-slate-500 text-sm leading-relaxed max-w-sm mx-auto">
            Link your repositories to start building your bitemporal engineering knowledge graph
          </p>
        </div>

        <div className="w-full space-y-6">
          <Link
            href="/demo"
            className="w-full h-12 flex items-center justify-center gap-3 rounded-lg bg-slate-900 text-white font-medium transition-all hover:bg-slate-800 hover:shadow-md focus:ring-2 focus:ring-slate-900 focus:ring-offset-2"
          >
            <GithubIcon size={20} />
            <span>Connect with GitHub</span>
          </Link>

          <div className="text-center">
            <span className="text-xs text-slate-400">
              We only request read access to your public or selected repositories
            </span>
          </div>

          <div className="pt-6 border-t border-slate-100 space-y-3">
            <div className="flex items-center gap-3 text-sm text-slate-600">
              <Search className="w-4 h-4 text-teal-600 shrink-0" />
              <span>Automatic repository scanning and ADR extraction</span>
            </div>
            <div className="flex items-center gap-3 text-sm text-slate-600">
              <Shield className="w-4 h-4 text-teal-600 shrink-0" />
              <span>Two-layer trust-isolated knowledge graph</span>
            </div>
            <div className="flex items-center gap-3 text-sm text-slate-600">
              <Eye className="w-4 h-4 text-teal-600 shrink-0" />
              <span>Read-only access by default</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
