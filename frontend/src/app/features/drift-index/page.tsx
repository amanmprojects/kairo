"use client";

import KairoLogo from "@/components/KairoLogo";
import React from "react";
import Link from "next/link";
import { 
  Network, 
  BarChart3,
  GitPullRequest,
  Activity,
  Users,
  AlertTriangle,
  Search
} from "lucide-react";

export default function DriftIndexPage() {
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
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-indigo-50 border border-indigo-100 text-indigo-700 text-sm font-medium mb-8">
              <BarChart3 className="w-4 h-4" />
              Novel Metric
            </div>
            <h1 className="text-5xl md:text-6xl font-extrabold tracking-tight text-slate-900 mb-6 leading-tight max-w-4xl mx-auto">
              Measure the gap between <span className="text-teal-600">intent and implementation</span>
            </h1>
            <p className="text-xl text-slate-600 max-w-3xl mx-auto leading-relaxed">
              The Decision Drift Index (DDI) quantifies how far your current codebase has diverged from documented architectural decisions.
            </p>
          </div>
        </section>

        {/* How it works */}
        <section className="py-24 bg-slate-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-3xl font-bold text-slate-900 mb-4">How it works</h2>
              <p className="text-slate-600">Continuous monitoring of architectural fidelity.</p>
            </div>
            
            <div className="grid md:grid-cols-3 gap-8 relative">
              <div className="absolute top-1/2 left-0 w-full h-0.5 bg-slate-200 -translate-y-1/2 hidden md:block z-0"></div>
              
              <div className="relative z-10 bg-white rounded-2xl p-8 border border-slate-200 shadow-sm flex flex-col items-center text-center">
                <div className="w-16 h-16 rounded-full bg-blue-100 flex items-center justify-center mb-6 shadow-sm border-4 border-white">
                  <Search className="w-7 h-7 text-blue-600" />
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-3">1. Extract Decisions</h3>
                <p className="text-slate-600 text-sm">
                  KAIRO uses LLMs to extract architectural decisions from PR discussions, issue comments, and code reviews automatically.
                </p>
              </div>

              <div className="relative z-10 bg-white rounded-2xl p-8 border border-slate-200 shadow-sm flex flex-col items-center text-center">
                <div className="w-16 h-16 rounded-full bg-indigo-100 flex items-center justify-center mb-6 shadow-sm border-4 border-white">
                  <Activity className="w-7 h-7 text-indigo-600" />
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-3">2. Track Validity</h3>
                <p className="text-slate-600 text-sm">
                  Each decision carries bitemporal timestamps tracking when it was made and when it was superseded.
                </p>
              </div>

              <div className="relative z-10 bg-white rounded-2xl p-8 border border-slate-200 shadow-sm flex flex-col items-center text-center">
                <div className="w-16 h-16 rounded-full bg-teal-100 flex items-center justify-center mb-6 shadow-sm border-4 border-white">
                  <BarChart3 className="w-7 h-7 text-teal-600" />
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-3">3. Measure Drift</h3>
                <p className="text-slate-600 text-sm">
                  Compare current code patterns against active decisions to produce a continuous drift score over time.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Engineering Evolution Score */}
        <section className="py-24 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid md:grid-cols-2 gap-16 items-center">
            <div>
              <h2 className="text-3xl font-bold text-slate-900 mb-4">Engineering Evolution Score</h2>
              <p className="text-lg text-slate-600 mb-6">
                The Decision Drift Index acts as a component of the overarching Engineering Evolution Score (EES). It is a companion metric combining delivery stability, ownership diversity, and drift to provide a holistic health assessment of your architecture.
              </p>
              <div className="space-y-4 mt-8">
                <div className="flex items-center gap-4">
                  <div className="w-2 h-2 rounded-full bg-teal-500"></div>
                  <span className="font-medium text-slate-700">Delivery Stability</span>
                </div>
                <div className="flex items-center gap-4">
                  <div className="w-2 h-2 rounded-full bg-indigo-500"></div>
                  <span className="font-medium text-slate-700">Ownership Diversity</span>
                </div>
                <div className="flex items-center gap-4">
                  <div className="w-2 h-2 rounded-full bg-rose-500"></div>
                  <span className="font-medium text-slate-700">Decision Drift Index (DDI)</span>
                </div>
              </div>
            </div>
            
            <div className="bg-slate-900 rounded-3xl p-8 text-white shadow-2xl relative overflow-hidden">
              <div className="absolute top-0 right-0 w-64 h-64 bg-teal-500/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
              <div className="absolute bottom-0 left-0 w-64 h-64 bg-indigo-500/10 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2"></div>
              
              <div className="relative z-10">
                <div className="flex justify-between items-center mb-8">
                  <span className="text-slate-400 font-medium">Platform Engineering</span>
                  <span className="bg-teal-500/20 text-teal-400 px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wide">Excellent</span>
                </div>
                
                <div className="flex items-end gap-4 mb-10">
                  <span className="text-6xl font-bold text-white tracking-tight">85</span>
                  <span className="text-slate-400 pb-2">/100 EES</span>
                </div>
                
                <div className="space-y-6">
                  <div>
                    <div className="flex justify-between text-sm mb-2">
                      <span className="text-slate-300">Delivery Stability</span>
                      <span className="text-white font-medium">92/100</span>
                    </div>
                    <div className="h-2 w-full bg-slate-800 rounded-full overflow-hidden">
                      <div className="h-full bg-teal-500 w-[92%] rounded-full"></div>
                    </div>
                  </div>
                  
                  <div>
                    <div className="flex justify-between text-sm mb-2">
                      <span className="text-slate-300">Ownership Diversity</span>
                      <span className="text-white font-medium">78/100</span>
                    </div>
                    <div className="h-2 w-full bg-slate-800 rounded-full overflow-hidden">
                      <div className="h-full bg-indigo-500 w-[78%] rounded-full"></div>
                    </div>
                  </div>
                  
                  <div>
                    <div className="flex justify-between text-sm mb-2">
                      <span className="text-slate-300">Drift Index (Inverted)</span>
                      <span className="text-white font-medium">85/100</span>
                    </div>
                    <div className="h-2 w-full bg-slate-800 rounded-full overflow-hidden">
                      <div className="h-full bg-rose-500 w-[85%] rounded-full"></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Use Cases */}
        <section className="py-24 bg-slate-50 border-t border-slate-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-3xl font-bold text-slate-900">Why track drift?</h2>
            </div>
            
            <div className="grid md:grid-cols-3 gap-8">
              <div className="bg-white p-8 rounded-2xl border border-slate-200 hover:border-teal-300 transition-colors group">
                <Users className="w-8 h-8 text-teal-600 mb-6 group-hover:scale-110 transition-transform" />
                <h3 className="text-xl font-bold text-slate-900 mb-3">Onboarding</h3>
                <p className="text-slate-600 leading-relaxed">
                  New developers instantly understand why the codebase looks the way it does, saving days of context gathering and reducing early mistakes.
                </p>
              </div>
              
              <div className="bg-white p-8 rounded-2xl border border-slate-200 hover:border-indigo-300 transition-colors group">
                <GitPullRequest className="w-8 h-8 text-indigo-600 mb-6 group-hover:scale-110 transition-transform" />
                <h3 className="text-xl font-bold text-slate-900 mb-3">Code Reviews</h3>
                <p className="text-slate-600 leading-relaxed">
                  Reviewers can easily see if a PR contradicts an existing architectural decision, catching structural regressions before they merge.
                </p>
              </div>
              
              <div className="bg-white p-8 rounded-2xl border border-slate-200 hover:border-amber-300 transition-colors group">
                <AlertTriangle className="w-8 h-8 text-amber-500 mb-6 group-hover:scale-110 transition-transform" />
                <h3 className="text-xl font-bold text-slate-900 mb-3">Technical Debt</h3>
                <p className="text-slate-600 leading-relaxed">
                  Track and prioritize areas where the code has drifted furthest from intent, allowing strategic technical debt repayment.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="py-24 bg-slate-900 text-center">
          <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl font-bold text-white mb-6">Stop guessing about technical debt</h2>
            <p className="text-lg text-slate-400 mb-8">
              Quantify your architecture's fidelity and guide your team effectively.
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
