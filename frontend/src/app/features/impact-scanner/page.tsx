"use client";

import KairoLogo from "@/components/KairoLogo";
import React from "react";
import Link from "next/link";
import { 
  Network, 
  ShieldAlert,
  GitPullRequest,
  Activity,
  FileText,
  AlertOctagon,
  Users,
  Eye,
  AlertTriangle
} from "lucide-react";

export default function ImpactScannerPage() {
  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans text-slate-900">
      {/* Navbar */}
      <header className="sticky top-0 z-50 w-full border-b border-slate-200 bg-white/80 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-8">
            <Link href="/" className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-teal-600 flex items-center justify-center">
                <Network className="w-5 h-5 text-white" />
              </div>
              <span className="font-bold text-xl tracking-tight text-slate-900">KAIRO</span>
            </Link>
            <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-slate-600">
              <Link href="/product" className="hover:text-teal-600 transition-colors">Product</Link>
              <Link href="/features" className="text-teal-600 transition-colors">Features</Link>
              <Link href="/pricing" className="hover:text-teal-600 transition-colors">Pricing</Link>
              <Link href="/docs" className="hover:text-teal-600 transition-colors">Docs</Link>
            </nav>
          </div>
          <div className="flex items-center gap-4">
            <Link href="/login" className="text-sm font-medium text-slate-600 hover:text-teal-600 transition-colors hidden sm:block">
              Sign In
            </Link>
            <Link href="/demo" className="text-sm font-medium bg-teal-600 text-white px-4 py-2 rounded-lg hover:bg-teal-700 transition-colors shadow-sm">Take Tour</Link>
          </div>
        </div>
      </header>

      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative pt-24 pb-20 overflow-hidden bg-white border-b border-slate-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-rose-50 border border-rose-100 text-rose-700 text-sm font-medium mb-8">
              <ShieldAlert className="w-4 h-4" />
              Pre-Merge Intelligence
            </div>
            <h1 className="text-5xl md:text-6xl font-extrabold tracking-tight text-slate-900 mb-6 leading-tight max-w-4xl mx-auto">
              Know the blast radius <span className="text-teal-600">before you merge</span>
            </h1>
            <p className="text-xl text-slate-600 max-w-3xl mx-auto leading-relaxed">
              The Change Impact Scanner analyzes modified files against historical telemetry to predict architectural risk and surface hidden dependencies.
            </p>
          </div>
        </section>

        {/* How it works flow */}
        <section className="py-24 bg-slate-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col md:flex-row items-start justify-between gap-8 relative">
              <div className="hidden md:block absolute top-8 left-[10%] right-[10%] h-0.5 bg-gradient-to-r from-slate-200 via-teal-200 to-slate-200 z-0"></div>
              
              <div className="flex-1 relative z-10 flex flex-col items-center text-center group">
                <div className="w-16 h-16 rounded-2xl bg-white border-2 border-slate-200 flex items-center justify-center mb-6 group-hover:border-teal-500 group-hover:shadow-lg transition-all">
                  <GitPullRequest className="w-7 h-7 text-slate-600 group-hover:text-teal-600 transition-colors" />
                </div>
                <h3 className="text-lg font-bold text-slate-900 mb-2">1. PR Created</h3>
                <p className="text-sm text-slate-600 px-4">Developer opens a pull request.</p>
              </div>

              <div className="flex-1 relative z-10 flex flex-col items-center text-center group">
                <div className="w-16 h-16 rounded-2xl bg-white border-2 border-slate-200 flex items-center justify-center mb-6 group-hover:border-teal-500 group-hover:shadow-lg transition-all">
                  <FileText className="w-7 h-7 text-slate-600 group-hover:text-teal-600 transition-colors" />
                </div>
                <h3 className="text-lg font-bold text-slate-900 mb-2">2. Files Analyzed</h3>
                <p className="text-sm text-slate-600 px-4">Scanner identifies all modified files and historical context.</p>
              </div>

              <div className="flex-1 relative z-10 flex flex-col items-center text-center group">
                <div className="w-16 h-16 rounded-2xl bg-white border-2 border-slate-200 flex items-center justify-center mb-6 group-hover:border-teal-500 group-hover:shadow-lg transition-all">
                  <Network className="w-7 h-7 text-slate-600 group-hover:text-teal-600 transition-colors" />
                </div>
                <h3 className="text-lg font-bold text-slate-900 mb-2">3. Graph Traversal</h3>
                <p className="text-sm text-slate-600 px-4">Walks the knowledge graph to find related decisions and ownership patterns.</p>
              </div>

              <div className="flex-1 relative z-10 flex flex-col items-center text-center group">
                <div className="w-16 h-16 rounded-2xl bg-white border-2 border-slate-200 flex items-center justify-center mb-6 group-hover:border-teal-500 group-hover:shadow-lg transition-all">
                  <ShieldAlert className="w-7 h-7 text-slate-600 group-hover:text-teal-600 transition-colors" />
                </div>
                <h3 className="text-lg font-bold text-slate-900 mb-2">4. Risk Report</h3>
                <p className="text-sm text-slate-600 px-4">Produces an impact assessment with specific warnings and citations.</p>
              </div>
            </div>
          </div>
        </section>

        {/* What it detects & Mock Output */}
        <section className="py-24 bg-white border-t border-slate-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid lg:grid-cols-2 gap-16 items-start">
            
            <div>
              <h2 className="text-3xl font-bold text-slate-900 mb-8">What KAIRO detects</h2>
              <div className="grid sm:grid-cols-2 gap-6">
                <div className="bg-slate-50 p-6 rounded-xl border border-slate-200">
                  <AlertOctagon className="w-6 h-6 text-rose-500 mb-4" />
                  <h3 className="font-bold text-slate-900 mb-2">Decision Conflicts</h3>
                  <p className="text-sm text-slate-600">Flags when changes contradict documented architectural decisions.</p>
                </div>
                <div className="bg-slate-50 p-6 rounded-xl border border-slate-200">
                  <Activity className="w-6 h-6 text-amber-500 mb-4" />
                  <h3 className="font-bold text-slate-900 mb-2">Fragile File Patterns</h3>
                  <p className="text-sm text-slate-600">Identifies files with high churn rates and bug correlations.</p>
                </div>
                <div className="bg-slate-50 p-6 rounded-xl border border-slate-200">
                  <Users className="w-6 h-6 text-indigo-500 mb-4" />
                  <h3 className="font-bold text-slate-900 mb-2">Ownership Gaps</h3>
                  <p className="text-sm text-slate-600">Surfaces modules where the original authors are no longer active.</p>
                </div>
                <div className="bg-slate-50 p-6 rounded-xl border border-slate-200">
                  <Eye className="w-6 h-6 text-teal-500 mb-4" />
                  <h3 className="font-bold text-slate-900 mb-2">Hidden Dependencies</h3>
                  <p className="text-sm text-slate-600">Discovers non-obvious connections through the knowledge graph.</p>
                </div>
              </div>
            </div>

            <div className="bg-slate-900 rounded-2xl border border-slate-800 shadow-2xl overflow-hidden font-sans">
              <div className="bg-slate-950 px-4 py-3 flex items-center justify-between border-b border-slate-800">
                <div className="flex items-center gap-2">
                  <ShieldAlert className="w-4 h-4 text-rose-500" />
                  <span className="text-sm font-semibold text-slate-200">Impact Analysis: PR #892</span>
                </div>
                <span className="text-xs bg-rose-500/20 text-rose-400 px-2 py-1 rounded font-medium">High Risk</span>
              </div>
              <div className="p-6 space-y-6">
                
                <div>
                  <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3">Modified Files (3)</h4>
                  <ul className="space-y-2">
                    <li className="flex items-center justify-between text-sm bg-slate-800/50 p-2 rounded">
                      <span className="text-slate-300 font-mono text-xs">src/auth/jwt.ts</span>
                      <span className="text-rose-400 text-xs font-medium">Fragile Component</span>
                    </li>
                    <li className="flex items-center justify-between text-sm bg-slate-800/50 p-2 rounded">
                      <span className="text-slate-300 font-mono text-xs">src/api/routes.ts</span>
                      <span className="text-slate-500 text-xs font-medium">Normal</span>
                    </li>
                  </ul>
                </div>

                <div className="space-y-3">
                  <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Warnings (2)</h4>
                  
                  <div className="bg-rose-500/10 border border-rose-500/20 rounded-lg p-4">
                    <div className="flex items-start gap-3">
                      <AlertTriangle className="w-5 h-5 text-rose-500 shrink-0 mt-0.5" />
                      <div>
                        <h5 className="text-sm font-semibold text-rose-200">Architectural Decision Conflict</h5>
                        <p className="text-xs text-rose-300/70 mt-1 mb-2">This PR introduces local session state in `routes.ts`, which conflicts with ADR-014: "Stateless API Tier".</p>
                        <Link href="#" className="text-xs text-rose-400 hover:text-rose-300 underline underline-offset-2">View ADR-014 in Graph</Link>
                      </div>
                    </div>
                  </div>

                  <div className="bg-amber-500/10 border border-amber-500/20 rounded-lg p-4">
                    <div className="flex items-start gap-3">
                      <Users className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />
                      <div>
                        <h5 className="text-sm font-semibold text-amber-200">Ownership Warning</h5>
                        <p className="text-xs text-amber-300/70 mt-1">`jwt.ts` was originally authored by `@sarah-dev` (inactive). Current modifier has no prior commits to this module.</p>
                      </div>
                    </div>
                  </div>

                </div>

                <div className="pt-4 border-t border-slate-800 flex justify-end">
                  <button className="bg-slate-800 text-slate-300 hover:bg-slate-700 text-xs font-medium px-4 py-2 rounded transition-colors">
                    View Full Report
                  </button>
                </div>
              </div>
            </div>

          </div>
        </section>

        {/* CTA */}
        <section className="py-24 bg-slate-900 text-center">
          <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl font-bold text-white mb-6">Deploy with confidence</h2>
            <p className="text-lg text-slate-400 mb-8">
              Catch architectural regressions before they hit production. Integrate KAIRO into your CI pipeline.
            </p>
            <div className="flex justify-center gap-4">
              <Link href="/demo" className="px-6 py-3 bg-teal-500 text-white font-medium rounded-lg hover:bg-teal-400 transition-colors">
                Start Free Trial
              </Link>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-slate-200 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-8">
          <div className="col-span-2 lg:col-span-2">
            <Link href="/" className="flex items-center gap-2 mb-4">
              <div className="w-6 h-6 rounded bg-teal-600 flex items-center justify-center">
                <Network className="w-3.5 h-3.5 text-white" />
              </div>
              <span className="font-bold text-lg text-slate-900">KAIRO</span>
            </Link>
            <p className="text-sm text-slate-500 max-w-xs">
              Context-aware intelligence for modern engineering teams.
            </p>
          </div>
          <div>
            <h3 className="font-semibold text-slate-900 mb-4">Product</h3>
            <ul className="space-y-3 text-sm text-slate-600">
              <li><Link href="/features/graphrag" className="hover:text-teal-600">GraphRAG</Link></li>
              <li><Link href="/features/drift-index" className="hover:text-teal-600">Drift Index</Link></li>
              <li><Link href="/features/impact-scanner" className="hover:text-teal-600">Impact Scanner</Link></li>
            </ul>
          </div>
          <div>
            <h3 className="font-semibold text-slate-900 mb-4">Company</h3>
            <ul className="space-y-3 text-sm text-slate-600">
              <li><Link href="/about" className="hover:text-teal-600">About</Link></li>
              <li><Link href="/blog" className="hover:text-teal-600">Blog</Link></li>
              <li><Link href="/contact" className="hover:text-teal-600">Contact</Link></li>
            </ul>
          </div>
          <div>
            <h3 className="font-semibold text-slate-900 mb-4">Legal</h3>
            <ul className="space-y-3 text-sm text-slate-600">
              <li><Link href="/privacy" className="hover:text-teal-600">Privacy Policy</Link></li>
              <li><Link href="/terms" className="hover:text-teal-600">Terms of Service</Link></li>
            </ul>
          </div>
        </div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-12 pt-8 border-t border-slate-100 flex flex-col md:flex-row items-center justify-between">
          <p className="text-sm text-slate-500">© {new Date().getFullYear()} KAIRO Inc. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
