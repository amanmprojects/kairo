"use client";

import KairoLogo from "@/components/KairoLogo";
import React, { useState } from "react";
import Link from "next/link";
import { 
  Menu, X, ChevronRight, GitPullRequest, Search, Activity, 
  TrendingUp, ShieldAlert, Kanban, MessageSquare, Database,
  Terminal, Layers, CheckCircle2, ArrowRight
} from "lucide-react";

const GithubIcon = ({ size = 24, className = "" }: { size?: number; className?: string }) => (
  <svg width={size} height={size} className={className} viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z"/>
  </svg>
);

export default function ProductPage() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <div className="min-h-screen bg-white text-slate-900 font-sans selection:bg-teal-100 selection:text-teal-900">
      {/* Navigation */}
      <header className="sticky top-0 z-50 w-full border-b border-slate-200 bg-white/80 backdrop-blur-md">
        <div className="container mx-auto px-4 md:px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <KairoLogo className="w-7 h-7" />
            <span className="text-xl font-bold tracking-tight text-slate-900">KAIRO</span>
          </div>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-8">
            <Link href="/product" className="text-sm font-medium text-teal-600">Product</Link>
            <Link href="/features" className="text-sm font-medium text-slate-600 hover:text-slate-900 transition-colors">Features</Link>
            <Link href="/pricing" className="text-sm font-medium text-slate-600 hover:text-slate-900 transition-colors">Pricing</Link>
            <Link href="/docs" className="text-sm font-medium text-slate-600 hover:text-slate-900 transition-colors">Docs</Link>
          </nav>

          <div className="hidden md:flex items-center gap-4">
            <Link href="/login" className="text-sm font-medium text-slate-600 hover:text-slate-900 transition-colors">
              Sign In
            </Link>
            <Link href="/demo" className="text-sm font-medium bg-slate-900 text-white px-4 py-2 rounded-md hover:bg-slate-800 transition-colors shadow-sm">Take Tour</Link>
          </div>

          {/* Mobile Menu Toggle */}
          <button 
            className="md:hidden p-2 text-slate-600"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Nav */}
        {mobileMenuOpen && (
          <div className="md:hidden absolute top-16 left-0 w-full bg-white border-b border-slate-200 p-4 flex flex-col gap-4 shadow-lg">
            <Link href="/product" className="text-sm font-medium text-teal-600 p-2">Product</Link>
            <Link href="/features" className="text-sm font-medium text-slate-600 p-2">Features</Link>
            <Link href="/pricing" className="text-sm font-medium text-slate-600 p-2">Pricing</Link>
            <Link href="/docs" className="text-sm font-medium text-slate-600 p-2">Docs</Link>
            <hr className="border-slate-100" />
            <Link href="/login" className="text-sm font-medium text-slate-600 p-2">Sign In</Link>
            <Link href="/demo" className="text-sm font-medium bg-slate-900 text-white px-4 py-2 rounded-md text-center">Take Tour</Link>
          </div>
        )}
      </header>

      <main>
        {/* Hero Section */}
        <section className="pt-24 pb-16 md:pt-32 md:pb-24 px-4 md:px-6 container mx-auto max-w-5xl text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-teal-50 text-teal-700 text-sm font-medium mb-6 border border-teal-100">
            <Layers className="w-4 h-4" />
            Engineering Intelligence Platform
          </div>
          <h1 className="text-4xl md:text-6xl font-extrabold text-slate-900 tracking-tight leading-tight mb-6">
            Everything you need to manage projects with <span className="text-teal-600">architectural awareness</span>
          </h1>
          <p className="text-lg md:text-xl text-slate-600 mb-10 max-w-3xl mx-auto leading-relaxed">
            KAIRO combines project management, code intelligence, and temporal reasoning into one platform built natively for GitHub.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link href="/demo" className="w-full sm:w-auto px-8 py-4 bg-slate-900 hover:bg-slate-800 text-white rounded-lg font-medium transition-all shadow-md hover:shadow-lg flex items-center justify-center gap-2 text-lg">
              Start Free Trial
              <ChevronRight className="w-5 h-5" />
            </Link>
          </div>
        </section>

        {/* Feature Grid */}
        <section className="py-20 bg-slate-50 border-y border-slate-200">
          <div className="container mx-auto px-4 md:px-6 max-w-6xl">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              
              {/* Card 1 */}
              <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
                <div className="w-12 h-12 rounded-xl bg-teal-50 text-teal-600 flex items-center justify-center mb-6">
                  <GitPullRequest className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-3">Temporal Knowledge Graph</h3>
                <p className="text-slate-600 mb-6 leading-relaxed">
                  Reconstructs the reasoning behind every line of code by mapping commits, PRs, issues, and discussions into a bitemporal graph.
                </p>
                <Link href="#" className="inline-flex items-center gap-1 text-teal-600 font-medium hover:text-teal-700">
                  Learn more <ArrowRight className="w-4 h-4" />
                </Link>
              </div>

              {/* Card 2 */}
              <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
                <div className="w-12 h-12 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center mb-6">
                  <Search className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-3">Three-Mode GraphRAG</h3>
                <p className="text-slate-600 mb-6 leading-relaxed">
                  Dynamically selects between Anchored, As-Of, and Semantic retrieval to always surface the right context.
                </p>
                <Link href="#" className="inline-flex items-center gap-1 text-indigo-600 font-medium hover:text-indigo-700">
                  Learn more <ArrowRight className="w-4 h-4" />
                </Link>
              </div>

              {/* Card 3 */}
              <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
                <div className="w-12 h-12 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center mb-6">
                  <Activity className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-3">Decision Drift Index</h3>
                <p className="text-slate-600 mb-6 leading-relaxed">
                  A quantifiable metric measuring how far your codebase has drifted from its documented architecture.
                </p>
                <Link href="#" className="inline-flex items-center gap-1 text-rose-600 font-medium hover:text-rose-700">
                  Learn more <ArrowRight className="w-4 h-4" />
                </Link>
              </div>

              {/* Card 4 */}
              <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
                <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center mb-6">
                  <TrendingUp className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-3">Engineering Evolution Score</h3>
                <p className="text-slate-600 mb-6 leading-relaxed">
                  Track repository health over time with delivery stability, ownership diversity, and drift metrics.
                </p>
                <Link href="#" className="inline-flex items-center gap-1 text-emerald-600 font-medium hover:text-emerald-700">
                  Learn more <ArrowRight className="w-4 h-4" />
                </Link>
              </div>

              {/* Card 5 */}
              <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
                <div className="w-12 h-12 rounded-xl bg-orange-50 text-orange-600 flex items-center justify-center mb-6">
                  <ShieldAlert className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-3">Change Impact Scanner</h3>
                <p className="text-slate-600 mb-6 leading-relaxed">
                  Pre-merge analysis that predicts architectural risk by cross-referencing historical telemetry.
                </p>
                <Link href="#" className="inline-flex items-center gap-1 text-orange-600 font-medium hover:text-orange-700">
                  Learn more <ArrowRight className="w-4 h-4" />
                </Link>
              </div>

              {/* Card 6 */}
              <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
                <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center mb-6">
                  <Kanban className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-3">GitHub-Native Workspace</h3>
                <p className="text-slate-600 mb-6 leading-relaxed">
                  Boards, sprints, and roadmaps that sync bidirectionally with GitHub Issues and PRs.
                </p>
                <Link href="#" className="inline-flex items-center gap-1 text-blue-600 font-medium hover:text-blue-700">
                  Learn more <ArrowRight className="w-4 h-4" />
                </Link>
              </div>

            </div>
          </div>
        </section>

        {/* Large Feature Block */}
        <section className="py-24">
          <div className="container mx-auto px-4 md:px-6 max-w-6xl">
            <div className="grid lg:grid-cols-2 gap-16 items-center">
              <div>
                <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-6 leading-tight">
                  Built on a Two-Layer Trust-Isolated Graph
                </h2>
                <p className="text-lg text-slate-600 mb-8 leading-relaxed">
                  KAIRO separates immutable engineering facts from AI interpretations, ensuring hallucination-free dependency analysis while still unlocking semantic reasoning.
                </p>
                <div className="space-y-6">
                  <div className="flex gap-4">
                    <div className="mt-1 bg-indigo-100 p-2 rounded-lg h-fit text-indigo-700">
                      <Database className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="font-bold text-slate-900 text-lg mb-1">Layer 1: Deterministic Truth</h4>
                      <p className="text-slate-600">Strictly maps API facts like commits, files, AST representations, and issue connections. This layer acts as the absolute source of truth.</p>
                    </div>
                  </div>
                  <div className="flex gap-4">
                    <div className="mt-1 bg-teal-100 p-2 rounded-lg h-fit text-teal-700">
                      <Layers className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="font-bold text-slate-900 text-lg mb-1">Layer 2: Interpreted Intelligence</h4>
                      <p className="text-slate-600">LLM-derived classifications, design pattern extractions, and architectural decisions stored as soft edges over the deterministic graph.</p>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-br from-indigo-100 to-teal-100 rounded-3xl transform rotate-2 scale-105 opacity-50"></div>
                <div className="relative bg-white rounded-2xl border border-slate-200 shadow-xl p-8 overflow-hidden">
                  
                  {/* Mockup UI */}
                  <div className="space-y-8">
                    {/* Layer 2 */}
                    <div className="relative z-10 bg-white/80 backdrop-blur border border-teal-200 rounded-xl p-5 shadow-sm">
                      <div className="flex items-center gap-3 mb-4">
                        <div className="bg-teal-500 w-2 h-2 rounded-full"></div>
                        <span className="font-semibold text-teal-800 text-sm tracking-wide uppercase">Layer 2: Interpreted</span>
                      </div>
                      <div className="space-y-3">
                        <div className="h-10 bg-teal-50 rounded-lg border border-teal-100 flex items-center px-4">
                          <span className="text-sm text-teal-700 font-medium">Extracted Strategy: Microservices Migration</span>
                        </div>
                        <div className="h-10 bg-teal-50 rounded-lg border border-teal-100 flex items-center px-4">
                          <span className="text-sm text-teal-700 font-medium">Predicted Risk: High Coupling</span>
                        </div>
                      </div>
                    </div>

                    {/* Connecting lines */}
                    <div className="absolute left-16 top-[130px] h-12 w-px bg-slate-300 border-l-2 border-dashed border-slate-300 z-0"></div>
                    <div className="absolute left-32 top-[130px] h-12 w-px bg-slate-300 border-l-2 border-dashed border-slate-300 z-0"></div>

                    {/* Layer 1 */}
                    <div className="relative z-10 bg-white/80 backdrop-blur border border-indigo-200 rounded-xl p-5 shadow-sm">
                      <div className="flex items-center gap-3 mb-4">
                        <div className="bg-indigo-500 w-2 h-2 rounded-full"></div>
                        <span className="font-semibold text-indigo-800 text-sm tracking-wide uppercase">Layer 1: Deterministic</span>
                      </div>
                      <div className="space-y-3">
                        <div className="flex gap-3">
                          <div className="h-10 flex-1 bg-indigo-50 rounded-lg border border-indigo-100 flex items-center px-4">
                            <span className="text-sm text-indigo-700 font-mono">Commit a83j29</span>
                          </div>
                          <div className="h-10 flex-1 bg-indigo-50 rounded-lg border border-indigo-100 flex items-center px-4">
                            <span className="text-sm text-indigo-700 font-mono">PR #402</span>
                          </div>
                        </div>
                        <div className="h-10 w-2/3 bg-indigo-50 rounded-lg border border-indigo-100 flex items-center px-4">
                          <span className="text-sm text-indigo-700 font-mono">auth.service.ts</span>
                        </div>
                      </div>
                    </div>
                  </div>

                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Integrations Section */}
        <section className="py-20 bg-slate-900 text-white border-y border-slate-800">
          <div className="container mx-auto px-4 md:px-6 max-w-5xl text-center">
            <h2 className="text-3xl font-bold mb-12">Works where your team already works</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              
              <div className="flex flex-col items-center p-6 bg-slate-800/50 rounded-2xl border border-slate-700 hover:bg-slate-800 transition-colors">
                <GithubIcon className="w-12 h-12 mb-4 text-white" />
                <h4 className="font-semibold mb-2">GitHub</h4>
                <p className="text-sm text-slate-400">Deep bidirectional sync</p>
              </div>

              <div className="flex flex-col items-center p-6 bg-slate-800/50 rounded-2xl border border-slate-700 hover:bg-slate-800 transition-colors">
                <Terminal className="w-12 h-12 mb-4 text-blue-400" />
                <h4 className="font-semibold mb-2">VS Code</h4>
                <p className="text-sm text-slate-400">In-editor context</p>
              </div>

              <div className="flex flex-col items-center p-6 bg-slate-800/50 rounded-2xl border border-slate-700 hover:bg-slate-800 transition-colors">
                <MessageSquare className="w-12 h-12 mb-4 text-purple-400" />
                <h4 className="font-semibold mb-2">Slack</h4>
                <p className="text-sm text-slate-400">Drift alerts</p>
              </div>

              <div className="flex flex-col items-center p-6 bg-slate-800/50 rounded-2xl border border-slate-700 hover:bg-slate-800 transition-colors">
                <Database className="w-12 h-12 mb-4 text-blue-300" />
                <h4 className="font-semibold mb-2">PostgreSQL</h4>
                <p className="text-sm text-slate-400">Self-hostable backend</p>
              </div>

            </div>
          </div>
        </section>

        {/* Bottom CTA */}
        <section className="py-24 bg-white text-center">
          <div className="container mx-auto px-4 max-w-3xl">
            <h2 className="text-3xl md:text-5xl font-bold text-slate-900 mb-6">Ready to understand your codebase?</h2>
            <p className="text-xl text-slate-600 mb-10">
              Join leading engineering teams using KAIRO to stop architectural decay and ship faster.
            </p>
            <Link href="/demo" className="inline-flex items-center gap-2 px-8 py-4 bg-teal-600 hover:bg-teal-700 text-white rounded-lg font-medium transition-all shadow-md hover:shadow-lg text-lg">
              Get Started Free
              <ChevronRight className="w-5 h-5" />
            </Link>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-slate-50 border-t border-slate-200 py-12 md:py-16">
        <div className="container mx-auto px-4 md:px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-12">
            <div className="col-span-2 md:col-span-1">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-6 h-6 rounded bg-slate-900 flex items-center justify-center text-white font-bold text-xs">
                  K
                </div>
                <span className="text-lg font-bold tracking-tight text-slate-900">KAIRO</span>
              </div>
              <p className="text-sm text-slate-500 leading-relaxed max-w-xs">
                The engineering intelligence platform for teams that want to ship faster without breaking architecture.
              </p>
            </div>
            
            <div>
              <h4 className="font-semibold text-slate-900 mb-4">Product</h4>
              <ul className="space-y-3">
                <li><Link href="/features" className="text-sm text-slate-600 hover:text-teal-600">Features</Link></li>
                <li><Link href="/pricing" className="text-sm text-slate-600 hover:text-teal-600">Pricing</Link></li>
                <li><Link href="/changelog" className="text-sm text-slate-600 hover:text-teal-600">Changelog</Link></li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold text-slate-900 mb-4">Resources</h4>
              <ul className="space-y-3">
                <li><Link href="/docs" className="text-sm text-slate-600 hover:text-teal-600">Documentation</Link></li>
                <li><Link href="/blog" className="text-sm text-slate-600 hover:text-teal-600">Blog</Link></li>
                <li><Link href="/community" className="text-sm text-slate-600 hover:text-teal-600">Community</Link></li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold text-slate-900 mb-4">Legal</h4>
              <ul className="space-y-3">
                <li><Link href="/privacy" className="text-sm text-slate-600 hover:text-teal-600">Privacy Policy</Link></li>
                <li><Link href="/terms" className="text-sm text-slate-600 hover:text-teal-600">Terms of Service</Link></li>
              </ul>
            </div>
          </div>
          
          <div className="pt-8 border-t border-slate-200 flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-sm text-slate-500">
              © {new Date().getFullYear()} KAIRO Inc. All rights reserved.
            </p>
            <div className="flex gap-4">
              <Link href="https://github.com/KAIRO" className="text-slate-400 hover:text-slate-600">
                <GithubIcon className="w-5 h-5" />
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
