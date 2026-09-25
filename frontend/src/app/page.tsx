"use client";

import KairoLogo from "@/components/KairoLogo";
import React, { useState, useEffect } from 'react';
import { 
  ArrowRight, 
  Menu, 
  X, 
  ChevronRight,
  Database,
  GitBranch,
  ShieldAlert,
  Search,
  Activity,
  GitCommit,
  CheckCircle2,
  Box,
  Layers,
  Network
} from 'lucide-react';
import Link from 'next/link';

const GithubIcon = ({ size = 24, className = '' }: { size?: number; className?: string }) => (
  <svg width={size} height={size} className={className} viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z"/>
  </svg>
);


export default function LandingPage() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="min-h-screen bg-white text-slate-900 font-sans selection:bg-teal-100 selection:text-teal-900">
      {/* 1. Navbar */}
      <nav className={`fixed top-0 w-full z-50 transition-all duration-300 border-b ${isScrolled ? 'bg-white/90 backdrop-blur-md border-slate-200 py-3' : 'bg-white border-transparent py-5'}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-2">
              <KairoLogo className="w-7 h-7" />
              <span className="text-xl font-bold tracking-tight text-slate-900">KAIRO</span>
            </div>
            
            <div className="hidden md:flex items-center space-x-8">
              <Link href="#product" className="text-sm font-medium text-slate-600 hover:text-teal-600 transition-colors">Product</Link>
              <Link href="#features" className="text-sm font-medium text-slate-600 hover:text-teal-600 transition-colors">Features</Link>
              <Link href="#pricing" className="text-sm font-medium text-slate-600 hover:text-teal-600 transition-colors">Pricing</Link>
              <Link href="#docs" className="text-sm font-medium text-slate-600 hover:text-teal-600 transition-colors">Docs</Link>
            </div>

            <div className="hidden md:flex items-center space-x-4">
              <Link href="/login" className="text-sm font-medium text-slate-600 hover:text-slate-900 transition-colors px-3 py-2">
                Sign In
              </Link>
              <Link href="/demo" className="text-sm font-medium bg-teal-500 hover:bg-teal-600 text-white px-5 py-2.5 rounded-lg transition-colors shadow-sm shadow-teal-500/20">Take Tour</Link>
            </div>

            <div className="md:hidden flex items-center">
              <button 
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="text-slate-600 hover:text-slate-900 focus:outline-none"
              >
                {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden fixed top-[60px] left-0 w-full bg-white border-b border-slate-200 z-40 px-4 py-6 shadow-xl">
          <div className="flex flex-col space-y-4">
            <Link href="#product" className="text-base font-medium text-slate-600 hover:text-teal-600" onClick={() => setMobileMenuOpen(false)}>Product</Link>
            <Link href="#features" className="text-base font-medium text-slate-600 hover:text-teal-600" onClick={() => setMobileMenuOpen(false)}>Features</Link>
            <Link href="#pricing" className="text-base font-medium text-slate-600 hover:text-teal-600" onClick={() => setMobileMenuOpen(false)}>Pricing</Link>
            <Link href="#docs" className="text-base font-medium text-slate-600 hover:text-teal-600" onClick={() => setMobileMenuOpen(false)}>Docs</Link>
            <hr className="border-slate-100" />
            <Link href="/login" className="text-base font-medium text-slate-600 hover:text-slate-900" onClick={() => setMobileMenuOpen(false)}>Sign In</Link>
            <Link href="/demo" className="text-base font-medium bg-teal-500 text-white px-4 py-3 rounded-lg text-center" onClick={() => setMobileMenuOpen(false)}>Take Tour</Link>
          </div>
        </div>
      )}

      {/* 2. Hero Section */}
      <section className="relative pt-32 pb-20 md:pt-36 md:pb-28 overflow-hidden bg-white">
        {/* Subtle grid pattern background */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#f1f5f9_1px,transparent_1px),linear-gradient(to_bottom,#f1f5f9_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] pointer-events-none -z-10" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 mb-16">
          {/* 2-Column Split Hero (Editorial Left + Interactive Portals Right) */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
            
            {/* Left Column: 7 cols - Editorial Typography & Actions */}
            <div className="lg:col-span-7 text-left space-y-6">
              {/* Live Badge */}
              {/* Monumental Architectural Headline */}
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-slate-900 leading-[1.08]">
                Project management <br />
                that <span className="text-teal-600">understands</span> <br />
                your codebase.
              </h1>

              {/* Editorial Description */}
              <p className="text-base sm:text-lg text-slate-600 leading-relaxed max-w-xl font-normal">
                KAIRO reconstructs engineering memory across commits, PRs, and architectural decisions. Stop undocumented drift before merging.
              </p>

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center gap-3.5 pt-2">
                <Link
                  href="/demo"
                  className="flex items-center gap-2 bg-slate-900 hover:bg-slate-800 text-white px-7 py-3.5 rounded-xl text-sm font-semibold transition-all shadow-lg hover:shadow-xl hover:-translate-y-0.5"
                >
                  <span>Explore Live Demo</span>
                  <ArrowRight size={16} />
                </Link>
                <Link
                  href="/connect"
                  className="flex items-center gap-2.5 bg-white hover:bg-slate-50 text-slate-800 border border-slate-300 px-6 py-3.5 rounded-xl text-sm font-semibold transition-all shadow-xs hover:border-slate-400"
                >
                  <GithubIcon size={18} className="text-slate-800" />
                  <span>Connect with GitHub</span>
                </Link>
              </div>

              {/* Telemetry Annotation Counters */}
              <div className="grid grid-cols-3 gap-4 pt-6 border-t border-slate-200/80">
                <div>
                  <div className="text-[10px] font-mono font-bold text-slate-400 uppercase tracking-wider">RETRIEVAL</div>
                  <div className="text-sm font-bold text-slate-900 mt-0.5">3-Mode GraphRAG</div>
                  <div className="text-[11px] text-teal-600 font-medium">Anchored • As-Of</div>
                </div>
                <div>
                  <div className="text-[10px] font-mono font-bold text-amber-700 uppercase tracking-wider">DECISION DRIFT</div>
                  <div className="text-sm font-bold text-amber-700 mt-0.5">72 / 100 DDI</div>
                  <div className="text-[11px] text-amber-600 font-medium">Elevated Auth Risk</div>
                </div>
                <div>
                  <div className="text-[10px] font-mono font-bold text-slate-400 uppercase tracking-wider">ISOLATION</div>
                  <div className="text-sm font-bold text-slate-900 mt-0.5">Two-Layer Graph</div>
                  <div className="text-[11px] text-emerald-600 font-medium">0% Hallucination</div>
                </div>
              </div>
            </div>

            {/* Right Column: 5 cols - Vertical Interactive Portal Carousel */}
            <div className="lg:col-span-5 flex flex-col gap-3 text-left">
              <div className="text-xs font-bold text-slate-400 uppercase tracking-wider pl-1 mb-1 flex items-center justify-between">
                <span>Engineering Intelligence Portals</span>
                <span className="text-[10px] text-teal-600 bg-teal-50 px-2 py-0.5 rounded font-mono font-semibold">Live Sync</span>
              </div>

              {/* Portal 1 */}
              <Link
                href="/demo/graph"
                className="group p-3.5 bg-white hover:bg-teal-50/40 border border-slate-200/90 hover:border-teal-300 rounded-2xl shadow-2xs hover:shadow-md transition-all flex items-center gap-3.5"
              >
                <div className="w-12 h-12 rounded-xl bg-teal-50 text-teal-600 border border-teal-200/60 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                  <Network className="w-5 h-5" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-900 group-hover:text-teal-700">
                      Temporal Knowledge Graph
                    </span>
                    <span className="text-[10px] font-mono text-teal-700 font-semibold bg-teal-100/60 px-1.5 py-0.5 rounded">
                      Degree ≤ 20
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-500 truncate mt-0.5">
                    Bitemporal links connecting code facts to LLM decisions
                  </p>
                </div>
                <ChevronRight className="w-4 h-4 text-slate-300 group-hover:text-teal-600 group-hover:translate-x-0.5 transition-all shrink-0" />
              </Link>

              {/* Portal 2 */}
              <Link
                href="/demo"
                className="group p-3.5 bg-white hover:bg-amber-50/40 border border-amber-200/80 hover:border-amber-300 rounded-2xl shadow-2xs hover:shadow-md transition-all flex items-center gap-3.5"
              >
                <div className="w-12 h-12 rounded-xl bg-amber-50 text-amber-700 border border-amber-200/60 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                  <ShieldAlert className="w-5 h-5" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-900 group-hover:text-amber-800">
                      Decision Drift Index (DDI)
                    </span>
                    <span className="text-[10px] font-mono text-amber-800 font-bold bg-amber-100/80 px-1.5 py-0.5 rounded">
                      72 / 100
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-500 truncate mt-0.5">
                    Detects when PRs contradict active architecture ADRs
                  </p>
                </div>
                <ChevronRight className="w-4 h-4 text-slate-300 group-hover:text-amber-600 group-hover:translate-x-0.5 transition-all shrink-0" />
              </Link>

              {/* Portal 3 */}
              <Link
                href="/demo/impact"
                className="group p-3.5 bg-white hover:bg-rose-50/40 border border-slate-200/90 hover:border-rose-300 rounded-2xl shadow-2xs hover:shadow-md transition-all flex items-center gap-3.5"
              >
                <div className="w-12 h-12 rounded-xl bg-rose-50 text-rose-600 border border-rose-200/60 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                  <GitBranch className="w-5 h-5" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-900 group-hover:text-rose-700">
                      Change Impact Scanner
                    </span>
                    <span className="text-[10px] font-mono text-rose-700 font-semibold bg-rose-100/70 px-1.5 py-0.5 rounded">
                      12 Files
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-500 truncate mt-0.5">
                    Pre-merge blast radius with regression bug prediction
                  </p>
                </div>
                <ChevronRight className="w-4 h-4 text-slate-300 group-hover:text-rose-600 group-hover:translate-x-0.5 transition-all shrink-0" />
              </Link>

              {/* Portal 4 */}
              <Link
                href="/demo/ask"
                className="group p-3.5 bg-white hover:bg-indigo-50/40 border border-slate-200/90 hover:border-indigo-300 rounded-2xl shadow-2xs hover:shadow-md transition-all flex items-center gap-3.5"
              >
                <div className="w-12 h-12 rounded-xl bg-indigo-50 text-indigo-600 border border-indigo-200/60 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                  <Search className="w-5 h-5" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-900 group-hover:text-indigo-700">
                      Three-Mode GraphRAG
                    </span>
                    <span className="text-[10px] font-mono text-emerald-700 font-semibold bg-emerald-100/70 px-1.5 py-0.5 rounded">
                      94% Conf.
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-500 truncate mt-0.5">
                    Synthesize repository answers with verbatim timeline citations
                  </p>
                </div>
                <ChevronRight className="w-4 h-4 text-slate-300 group-hover:text-indigo-600 group-hover:translate-x-0.5 transition-all shrink-0" />
              </Link>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="relative mx-auto max-w-5xl group text-left">
            {/* Ambient glow backdrop */}
            <div className="absolute -inset-1.5 bg-gradient-to-r from-teal-500/25 via-cyan-400/20 to-indigo-500/25 rounded-3xl blur-2xl opacity-75 group-hover:opacity-100 transition duration-1000 -z-10" />

            {/* Window Container */}
            <div className="relative rounded-2xl border border-slate-200/90 bg-white shadow-2xl overflow-hidden">
              {/* Window Chrome Header */}
              <div className="bg-slate-100/90 border-b border-slate-200/80 px-4 py-3 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="flex gap-1.5">
                    <div className="w-3 h-3 rounded-full bg-rose-400/80" />
                    <div className="w-3 h-3 rounded-full bg-amber-400/80" />
                    <div className="w-3 h-3 rounded-full bg-emerald-400/80" />
                  </div>
                </div>
                <div className="bg-white border border-slate-200 rounded-lg px-3 py-1 flex items-center gap-2 text-xs text-slate-600 font-mono shadow-2xs">
                  <span className="w-2 h-2 rounded-full bg-emerald-500" />
                  <span>app.kairo.dev/sharvarianand/kairo</span>
                </div>
                <div className="text-[11px] font-semibold text-slate-500">
                  Sprint 42 Active
                </div>
              </div>

              {/* Product Dashboard Inner View */}
              <div className="p-6 bg-slate-50/50 space-y-5">
                {/* 4 Telemetry Metrics */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  <div className="bg-white p-3 rounded-xl border border-slate-200 shadow-2xs">
                    <div className="text-[10px] font-bold uppercase text-slate-400">Active Sprint</div>
                    <div className="text-base font-bold text-slate-900 mt-0.5">Sprint 42</div>
                    <div className="text-[10px] text-teal-600 font-semibold">3 days remaining</div>
                  </div>
                  <div className="bg-white p-3 rounded-xl border border-amber-200 shadow-2xs">
                    <div className="text-[10px] font-bold uppercase text-amber-700">Decision Drift (DDI)</div>
                    <div className="text-base font-bold text-amber-700 mt-0.5">72 / 100</div>
                    <div className="text-[10px] text-amber-600 font-semibold">Elevated risk in auth</div>
                  </div>
                  <div className="bg-white p-3 rounded-xl border border-emerald-200 shadow-2xs">
                    <div className="text-[10px] font-bold uppercase text-emerald-700">Evolution Score (EES)</div>
                    <div className="text-base font-bold text-emerald-700 mt-0.5">85 / 100</div>
                    <div className="text-[10px] text-emerald-600 font-semibold">Stable delivery health</div>
                  </div>
                  <div className="bg-white p-3 rounded-xl border border-slate-200 shadow-2xs">
                    <div className="text-[10px] font-bold uppercase text-slate-400">Open PRs</div>
                    <div className="text-base font-bold text-slate-900 mt-0.5">14 Active</div>
                    <div className="text-[10px] text-slate-500 font-semibold">3 need impact scan</div>
                  </div>
                </div>

                {/* Dual-Pane Core Showcase */}
                <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
                  {/* Left: Two-Layer Knowledge Graph Explorer */}
                  <div className="md:col-span-3 bg-white p-5 rounded-2xl border border-slate-200 shadow-xs relative overflow-hidden flex flex-col justify-between">
                    <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                      <div className="flex items-center gap-2">
                        <span className="w-2.5 h-2.5 rounded-full bg-teal-500 animate-pulse" />
                        <span className="text-xs font-bold text-slate-900">Two-Layer Bitemporal Graph</span>
                      </div>
                      <span className="text-[10px] font-mono bg-teal-50 text-teal-800 font-bold px-2 py-0.5 rounded border border-teal-200/60">
                        Hub Degree ≤ 20
                      </span>
                    </div>

                    {/* Nodes Network Graphic */}
                    <div className="py-6 relative min-h-[180px] flex items-center justify-center">
                      <svg className="absolute inset-0 w-full h-full stroke-slate-200" strokeWidth="2">
                        <line x1="25%" y1="50%" x2="50%" y2="25%" />
                        <line x1="25%" y1="50%" x2="50%" y2="75%" />
                        <line x1="50%" y1="25%" x2="75%" y2="50%" />
                        <line x1="50%" y1="75%" x2="75%" y2="50%" />
                      </svg>

                      {/* Node 1: File */}
                      <div className="absolute left-[8%] top-1/2 -translate-y-1/2 bg-white border-2 border-teal-500 p-2.5 rounded-xl shadow-md text-xs z-10">
                        <span className="text-[9px] font-bold text-teal-700 uppercase block">Layer 1: Code</span>
                        <span className="font-mono font-bold text-slate-900">auth/middleware.py</span>
                      </div>

                      {/* Node 2: ADR */}
                      <div className="absolute top-[8%] left-1/2 -translate-x-1/2 bg-amber-50 border border-amber-300 p-2.5 rounded-xl shadow-md text-xs z-10">
                        <span className="text-[9px] font-bold text-amber-800 uppercase block">Layer 2: Decision</span>
                        <span className="font-semibold text-slate-900">ADR-042: Session Auth</span>
                      </div>

                      {/* Node 3: PR */}
                      <div className="absolute bottom-[8%] left-1/2 -translate-x-1/2 bg-indigo-50 border border-indigo-200 p-2.5 rounded-xl shadow-md text-xs z-10">
                        <span className="text-[9px] font-bold text-indigo-700 uppercase block">Layer 1: PR</span>
                        <span className="font-semibold text-slate-900">PR #412 (JWT Migration)</span>
                      </div>

                      {/* Node 4: Owner */}
                      <div className="absolute right-[8%] top-1/2 -translate-y-1/2 bg-white border border-slate-300 p-2.5 rounded-xl shadow-md text-xs z-10">
                        <span className="text-[9px] font-bold text-slate-500 uppercase block">Author Ownership</span>
                        <span className="font-semibold text-slate-900">Shruti G. (67%)</span>
                      </div>
                    </div>

                    <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500">
                      <span>Dynamic hub suppression reduces result overlap: 56% → 27%</span>
                      <Link href="/demo/graph" className="text-teal-600 font-bold hover:underline">
                        Explore Graph →
                      </Link>
                    </div>
                  </div>

                  {/* Right: Live Impact & Question Synthesis */}
                  <div className="md:col-span-2 space-y-3 flex flex-col justify-between">
                    <div className="bg-amber-50/70 border border-amber-200 p-4 rounded-2xl shadow-2xs">
                      <div className="flex items-center justify-between text-xs mb-1">
                        <span className="font-bold text-amber-900 flex items-center gap-1.5">
                          <ShieldAlert className="w-3.5 h-3.5 text-amber-600" />
                          <span>Pre-Merge Drift Detected</span>
                        </span>
                        <span className="text-[10px] bg-rose-100 text-rose-800 font-bold px-1.5 py-0.5 rounded">High Risk</span>
                      </div>
                      <p className="text-xs text-slate-600 leading-snug mt-1.5">
                        PR #412 modifies auth layer to JWT, contradicting active decision <span className="font-semibold text-slate-900">ADR-042</span>.
                      </p>
                    </div>

                    <div className="bg-white border border-slate-200 p-4 rounded-2xl shadow-2xs space-y-2">
                      <div className="flex items-center gap-1.5 text-xs text-teal-800 font-bold">
                        <Search className="w-3.5 h-3.5 text-teal-600" />
                        <span>Ask KAIRO (GraphRAG)</span>
                      </div>
                      <div className="bg-slate-50 p-2 rounded-lg text-xs font-mono text-slate-600">
                        Why did we switch to JWT in auth.py?
                      </div>
                      <p className="text-xs text-slate-500 leading-snug">
                        "Transitioned for serverless Edge compatibility; Redis session reads had 180ms latency."
                      </p>
                      <div className="text-[10px] font-bold text-teal-700 bg-teal-50 px-2 py-0.5 rounded inline-block">
                        ✓ Verified Citation: PR #412 & ADR-042
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3. Logos/Trust Bar */}
      <section className="py-10 border-y border-slate-100 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <p className="text-center text-sm font-medium text-slate-500 mb-6">Trusted by engineering teams at</p>
          <div className="flex flex-wrap justify-center items-center gap-8 md:gap-16 opacity-50 grayscale">
            {/* Grey placeholder logos */}
            <div className="flex items-center gap-2 text-xl font-bold text-slate-700"><Box size={24} /> Acme Corp</div>
            <div className="flex items-center gap-2 text-xl font-bold text-slate-700"><Layers size={24} /> StackFlow</div>
            <div className="flex items-center gap-2 text-xl font-bold text-slate-700"><Database size={24} /> DataSync</div>
            <div className="flex items-center gap-2 text-xl font-bold text-slate-700"><Network size={24} /> PolyScale</div>
            <div className="flex items-center gap-2 text-xl font-bold text-slate-700 hidden sm:flex"><Activity size={24} /> PulseNet</div>
          </div>
        </div>
      </section>

      {/* 4. Three Challenges Section */}
      
      <section className="py-32 relative overflow-hidden bg-white" id="product">
        {/* Abstract Background Blobs */}
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none z-0">
          <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[60%] bg-teal-50 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-blob"></div>
          <div className="absolute top-[20%] right-[-10%] w-[30%] h-[50%] bg-indigo-50 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-blob animation-delay-2000"></div>
          <div className="absolute bottom-[-20%] left-[20%] w-[50%] h-[50%] bg-rose-50 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-blob animation-delay-4000"></div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center max-w-3xl mx-auto mb-20">
            <h2 className="text-4xl md:text-5xl font-bold text-slate-900 mb-6 tracking-tight">The challenges KAIRO solves</h2>
            <p className="text-xl text-slate-600 font-light">Modern engineering teams move fast, but structural knowledge gets left behind. We built KAIRO to bridge the gap.</p>
          </div>

          <div className="flex flex-col md:flex-row gap-12 lg:gap-16 items-center justify-center">
            
            {/* Challenge 1: Blob shape instead of box */}
            <div className="relative group w-full md:w-1/3">
              <div className="absolute inset-0 bg-gradient-to-tr from-rose-100 to-orange-50 rounded-[3rem] transform rotate-3 transition-transform group-hover:rotate-6 opacity-60 blur-lg"></div>
              <div className="relative bg-white/60 backdrop-blur-xl border border-white/40 p-10 rounded-[3rem] shadow-[0_8px_30px_rgb(0,0,0,0.04)] h-full flex flex-col items-start transition-all hover:-translate-y-2">
                <div className="w-16 h-16 bg-gradient-to-br from-rose-400 to-rose-600 text-white rounded-full flex items-center justify-center mb-8 shadow-lg shadow-rose-200">
                  <Box size={28} />
                </div>
                <h3 className="text-2xl font-bold text-slate-900 mb-4 tracking-tight">Engineering Memory Loss</h3>
                <p className="text-slate-600 text-lg leading-relaxed font-light">
                  Teams lose the reasoning behind architectural decisions. Context becomes buried in closed PRs and forgotten threads.
                </p>
              </div>
            </div>

            {/* Challenge 2 */}
            <div className="relative group w-full md:w-1/3 md:-mt-12">
              <div className="absolute inset-0 bg-gradient-to-tr from-amber-100 to-yellow-50 rounded-[3rem] transform -rotate-2 transition-transform group-hover:-rotate-4 opacity-60 blur-lg"></div>
              <div className="relative bg-white/60 backdrop-blur-xl border border-white/40 p-10 rounded-[3rem] shadow-[0_8px_30px_rgb(0,0,0,0.04)] h-full flex flex-col items-start transition-all hover:-translate-y-2">
                <div className="w-16 h-16 bg-gradient-to-br from-amber-400 to-amber-600 text-white rounded-full flex items-center justify-center mb-8 shadow-lg shadow-amber-200">
                  <Search size={28} />
                </div>
                <h3 className="text-2xl font-bold text-slate-900 mb-4 tracking-tight">Temporal Blindness</h3>
                <p className="text-slate-600 text-lg leading-relaxed font-light">
                  Standard AI retrieves outdated decisions as confidently as current ones. Simple vector search doesn't understand time.
                </p>
              </div>
            </div>

            {/* Challenge 3 */}
            <div className="relative group w-full md:w-1/3 md:mt-12">
              <div className="absolute inset-0 bg-gradient-to-tr from-indigo-100 to-blue-50 rounded-[3rem] transform rotate-2 transition-transform group-hover:rotate-4 opacity-60 blur-lg"></div>
              <div className="relative bg-white/60 backdrop-blur-xl border border-white/40 p-10 rounded-[3rem] shadow-[0_8px_30px_rgb(0,0,0,0.04)] h-full flex flex-col items-start transition-all hover:-translate-y-2">
                <div className="w-16 h-16 bg-gradient-to-br from-indigo-500 to-blue-600 text-white rounded-full flex items-center justify-center mb-8 shadow-lg shadow-indigo-200">
                  <GitBranch size={28} />
                </div>
                <h3 className="text-2xl font-bold text-slate-900 mb-4 tracking-tight">Invisible Decision Drift</h3>
                <p className="text-slate-600 text-lg leading-relaxed font-light">
                  Codebases silently diverge from documented architecture. Technical debt accumulates invisibly until it becomes a crisis.
                </p>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* 5. Feature Showcase Section */}
      <section className="py-24 bg-slate-50 border-y border-slate-200" id="features">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-32">
          
          {/* Feature 1 */}
          <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-20">
            <div className="flex-1 space-y-6">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-teal-100 text-teal-800 text-sm font-medium">
                Smart Retrieval
              </div>
              <h2 className="text-3xl md:text-4xl font-bold text-slate-900">Three-Mode GraphRAG</h2>
              <p className="text-lg text-slate-600 leading-relaxed">
                KAIRO dynamically selects between Anchored, As-Of, and Semantic retrieval modes to always find the right context. It understands when a decision was made, what it applied to, and if it's still relevant today.
              </p>
              <ul className="space-y-3 pt-4">
                <li className="flex items-start gap-3">
                  <CheckCircle2 className="text-teal-500 mt-1" size={20} />
                  <span className="text-slate-700"><strong>Anchored:</strong> Pinpoint exact dependencies and cross-references.</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle2 className="text-teal-500 mt-1" size={20} />
                  <span className="text-slate-700"><strong>As-Of:</strong> View architecture exactly as it was at a specific commit.</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle2 className="text-teal-500 mt-1" size={20} />
                  <span className="text-slate-700"><strong>Semantic:</strong> Natural language querying across the knowledge graph.</span>
                </li>
              </ul>
            </div>
            <div className="flex-1 w-full">
              <div className="bg-white rounded-2xl border border-slate-200 shadow-xl overflow-hidden p-6 relative">
                <div className="absolute top-0 right-0 p-4 flex gap-2">
                  <div className="px-2 py-1 text-xs font-medium bg-teal-100 text-teal-700 rounded-md">Mode: As-Of</div>
                </div>
                <div className="space-y-4 pt-4">
                  <div className="flex gap-3 items-center border-b border-slate-100 pb-4">
                    <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center"><Search size={16} className="text-slate-500"/></div>
                    <div className="flex-1 bg-slate-50 border border-slate-200 rounded-lg px-4 py-2 text-sm text-slate-600">
                      Why did we choose Redis over Memcached for session storage?
                    </div>
                  </div>
                  <div className="pl-11 space-y-3">
                    <div className="bg-slate-50 border border-slate-200 rounded-lg p-4">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-xs font-semibold text-slate-500">RETRIEVED FROM ADR-042 (Mar 2023)</span>
                        <span className="text-xs text-indigo-500 flex items-center gap-1"><GitCommit size={12}/> a8f9b2c</span>
                      </div>
                      <p className="text-sm text-slate-700">We selected Redis primarily for its persistence options and support for complex data structures which we need for the real-time presence feature...</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Feature 2 */}
          <div className="flex flex-col lg:flex-row-reverse items-center gap-12 lg:gap-20">
            <div className="flex-1 space-y-6">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-100 text-indigo-800 text-sm font-medium">
                Health Metrics
              </div>
              <h2 className="text-3xl md:text-4xl font-bold text-slate-900">Decision Drift Index</h2>
              <p className="text-lg text-slate-600 leading-relaxed">
                Quantify how far your codebase has drifted from documented architectural decisions with a single metric. Stop technical debt before it becomes systemic by tracking drift continuously.
              </p>
              <div className="pt-6">
                <Link href="#" className="inline-flex items-center gap-2 text-indigo-600 font-medium hover:text-indigo-700 transition-colors">
                  Learn more about Drift Index <ChevronRight size={16} />
                </Link>
              </div>
            </div>
            <div className="flex-1 w-full">
              <div className="bg-white rounded-2xl border border-slate-200 shadow-xl overflow-hidden p-6">
                <div className="flex items-center justify-between mb-6">
                  <h4 className="font-semibold text-slate-800">System Drift Analysis</h4>
                  <select className="text-sm border-slate-200 rounded-md text-slate-600 bg-slate-50 px-2 py-1 border">
                    <option>Last 30 Days</option>
                  </select>
                </div>
                
                <div className="flex items-end gap-4 h-40 mb-6 border-b border-slate-100 pb-2 px-2">
                  {[2, 4, 3, 7, 5, 8, 12, 14, 11, 15, 13, 18, 16, 21].map((val, i) => (
                    <div key={i} className="flex-1 flex flex-col justify-end group">
                      <div 
                        className={`w-full rounded-t-sm transition-all duration-300 ${val > 15 ? 'bg-rose-400' : val > 8 ? 'bg-amber-400' : 'bg-teal-400'}`} 
                        style={{ height: `${val * 4}px` }}
                      ></div>
                    </div>
                  ))}
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-slate-50 p-4 rounded-lg border border-slate-100">
                    <div className="text-sm text-slate-500 mb-1">Current Drift Index</div>
                    <div className="text-2xl font-bold text-slate-800">21.4%</div>
                    <div className="text-xs text-rose-500 mt-1 flex items-center gap-1">↑ +4.2% this sprint</div>
                  </div>
                  <div className="bg-slate-50 p-4 rounded-lg border border-slate-100">
                    <div className="text-sm text-slate-500 mb-1">Top Drift Source</div>
                    <div className="text-base font-semibold text-slate-800 truncate">PaymentService.ts</div>
                    <div className="text-xs text-slate-500 mt-1">Deviates from ADR-08</div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Feature 3 */}
          <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-20">
            <div className="flex-1 space-y-6">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-rose-100 text-rose-800 text-sm font-medium">
                PR Intelligence
              </div>
              <h2 className="text-3xl md:text-4xl font-bold text-slate-900">Change Impact Scanner</h2>
              <p className="text-lg text-slate-600 leading-relaxed">
                Before you merge, KAIRO scans modified files and predicts architectural risk using historical telemetry. It alerts reviewers to potential side-effects that aren't obvious from the diff alone.
              </p>
              <div className="pt-4 flex gap-4">
                <div className="flex flex-col">
                  <span className="text-3xl font-bold text-slate-900">100%</span>
                  <span className="text-sm text-slate-500">Automated PR checks</span>
                </div>
                <div className="w-px bg-slate-200"></div>
                <div className="flex flex-col">
                  <span className="text-3xl font-bold text-slate-900">0</span>
                  <span className="text-sm text-slate-500">Configuration needed</span>
                </div>
              </div>
            </div>
            <div className="flex-1 w-full">
              <div className="bg-white rounded-2xl border border-slate-200 shadow-xl overflow-hidden">
                <div className="bg-slate-50 border-b border-slate-200 px-6 py-4 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <GithubIcon size={20} className="text-slate-700" />
                    <span className="font-medium text-slate-700">Pull Request #412</span>
                  </div>
                  <div className="bg-green-100 text-green-700 text-xs font-bold px-2 py-1 rounded-full">Open</div>
                </div>
                <div className="p-6">
                  <div className="mb-6">
                    <h4 className="font-semibold text-slate-900 text-lg">Refactor authentication flow</h4>
                    <p className="text-sm text-slate-500">Opened 2 hours ago by @devteam</p>
                  </div>
                  
                  {/* KAIRO Bot Comment */}
                  <div className="border border-indigo-100 rounded-lg overflow-hidden bg-indigo-50/30">
                    <div className="bg-indigo-50 border-b border-indigo-100 px-4 py-3 flex items-center gap-2">
                      <div className="w-6 h-6 rounded bg-slate-900 flex items-center justify-center text-white font-bold text-xs">K</div>
                      <span className="font-semibold text-indigo-900 text-sm">KAIRO Intelligence</span>
                    </div>
                    <div className="p-4 space-y-3">
                      <div className="flex items-start gap-3">
                        <ShieldAlert size={18} className="text-amber-500 mt-0.5 flex-shrink-0" />
                        <div>
                          <p className="text-sm text-slate-700 font-medium">Architectural Impact Detected</p>
                          <p className="text-sm text-slate-600 mt-1">This PR modifies <code>auth/jwt.ts</code>, which is a dependency for 14 downstream microservices. According to ADR-12, changes here require updating the shared schema registry.</p>
                        </div>
                      </div>
                      <div className="bg-white border border-slate-200 rounded p-3 mt-2">
                        <p className="text-xs font-mono text-slate-600">Missing expected changes in: <span className="text-rose-500">schemas/auth.proto</span></p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* 6. How It Works Section */}
      <section className="py-24 bg-white" id="how-it-works">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">How it works</h2>
            <p className="text-lg text-slate-600">Get started in minutes. KAIRO does the heavy lifting in the background.</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 relative">
            {/* Connecting line for desktop */}
            <div className="hidden md:block absolute top-12 left-[15%] right-[15%] h-0.5 bg-slate-100 -z-10"></div>
            
            {/* Step 1 */}
            <div className="relative text-center">
              <div className="w-24 h-24 mx-auto bg-white border-4 border-slate-50 rounded-full flex items-center justify-center shadow-lg mb-6 relative z-10">
                <GithubIcon size={32} className="text-slate-700" />
                <div className="absolute -top-2 -right-2 w-8 h-8 bg-teal-500 rounded-full flex items-center justify-center text-white font-bold border-2 border-white">1</div>
              </div>
              <h3 className="text-xl font-semibold text-slate-900 mb-2">Connect GitHub</h3>
              <p className="text-slate-600 px-4">Link your repositories with a few clicks. We request minimal permissions needed to read your history.</p>
            </div>

            {/* Step 2 */}
            <div className="relative text-center">
              <div className="w-24 h-24 mx-auto bg-white border-4 border-slate-50 rounded-full flex items-center justify-center shadow-lg mb-6 relative z-10">
                <Network size={32} className="text-indigo-600" />
                <div className="absolute -top-2 -right-2 w-8 h-8 bg-teal-500 rounded-full flex items-center justify-center text-white font-bold border-2 border-white">2</div>
              </div>
              <h3 className="text-xl font-semibold text-slate-900 mb-2">Build Knowledge Graph</h3>
              <p className="text-slate-600 px-4">KAIRO ingests commits, PRs, and issues to build a massive temporal knowledge graph of your architecture.</p>
            </div>

            {/* Step 3 */}
            <div className="relative text-center">
              <div className="w-24 h-24 mx-auto bg-white border-4 border-slate-50 rounded-full flex items-center justify-center shadow-lg mb-6 relative z-10">
                <Search size={32} className="text-teal-600" />
                <div className="absolute -top-2 -right-2 w-8 h-8 bg-teal-500 rounded-full flex items-center justify-center text-white font-bold border-2 border-white">3</div>
              </div>
              <h3 className="text-xl font-semibold text-slate-900 mb-2">Ask Anything</h3>
              <p className="text-slate-600 px-4">Query your engineering memory with natural language, get PR reviews, and track decision drift instantly.</p>
            </div>
          </div>
        </div>
      </section>

      {/* 7. Stats Section */}
      <section className="py-20 bg-slate-900 text-white overflow-hidden relative">
        <div className="absolute top-0 right-0 w-1/2 h-full bg-teal-900/20 blur-[100px] pointer-events-none"></div>
        <div className="absolute bottom-0 left-0 w-1/2 h-full bg-indigo-900/20 blur-[100px] pointer-events-none"></div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid md:grid-cols-3 gap-12 text-center divide-y md:divide-y-0 md:divide-x divide-slate-800">
            <div className="p-4">
              <div className="text-5xl font-extrabold text-teal-400 mb-2">7.1x</div>
              <div className="text-lg font-medium text-slate-300 mb-2">Cross-references recovered</div>
              <p className="text-sm text-slate-400">Compared to standard semantic search on documentation.</p>
            </div>
            <div className="p-4 pt-12 md:pt-4">
              <div className="text-5xl font-extrabold text-indigo-400 mb-2">-51%</div>
              <div className="text-lg font-medium text-slate-300 mb-2">Result-set overlap reduction</div>
              <p className="text-sm text-slate-400">Dropping from 56% to 27% overlap means you find the exact context faster.</p>
            </div>
            <div className="p-4 pt-12 md:pt-4">
              <div className="text-5xl font-extrabold text-teal-400 mb-2">&lt;1%</div>
              <div className="text-lg font-medium text-slate-300 mb-2">Hallucination rejection rate</div>
              <p className="text-sm text-slate-400">Our Anchored Retrieval ensures AI responses are grounded in actual codebase reality.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Docs Section */}
      <section className="py-24 bg-white border-t border-slate-200" id="docs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">Documentation & Guides</h2>
            <p className="text-lg text-slate-600">Everything you need to integrate and master KAIRO engineering intelligence.</p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="p-6 bg-slate-50 border border-slate-200/90 rounded-2xl hover:border-teal-300 transition-all shadow-2xs">
              <div className="w-10 h-10 rounded-xl bg-teal-100/60 text-teal-700 flex items-center justify-center font-bold mb-4">01</div>
              <h3 className="font-bold text-slate-900 text-base mb-2">Getting Started</h3>
              <p className="text-xs text-slate-600 leading-relaxed mb-4">Quick setup guide, linking your GitHub organization, and first graph scan.</p>
              <Link href="/docs" className="text-xs font-semibold text-teal-600 hover:underline">Read Guide →</Link>
            </div>

            <div className="p-6 bg-slate-50 border border-slate-200/90 rounded-2xl hover:border-teal-300 transition-all shadow-2xs">
              <div className="w-10 h-10 rounded-xl bg-indigo-100/60 text-indigo-700 flex items-center justify-center font-bold mb-4">02</div>
              <h3 className="font-bold text-slate-900 text-base mb-2">Two-Layer Graph</h3>
              <p className="text-xs text-slate-600 leading-relaxed mb-4">Understanding deterministic code facts (Layer 1) vs LLM decisions (Layer 2).</p>
              <Link href="/docs" className="text-xs font-semibold text-indigo-600 hover:underline">Read Architecture →</Link>
            </div>

            <div className="p-6 bg-slate-50 border border-slate-200/90 rounded-2xl hover:border-teal-300 transition-all shadow-2xs">
              <div className="w-10 h-10 rounded-xl bg-amber-100/60 text-amber-700 flex items-center justify-center font-bold mb-4">03</div>
              <h3 className="font-bold text-slate-900 text-base mb-2">GraphRAG & Hubs</h3>
              <p className="text-xs text-slate-600 leading-relaxed mb-4">Configuring Anchored and As-Of retrieval with dynamic hub degree suppression.</p>
              <Link href="/docs" className="text-xs font-semibold text-amber-700 hover:underline">Read GraphRAG →</Link>
            </div>

            <div className="p-6 bg-slate-50 border border-slate-200/90 rounded-2xl hover:border-teal-300 transition-all shadow-2xs">
              <div className="w-10 h-10 rounded-xl bg-slate-200 text-slate-800 flex items-center justify-center font-bold mb-4">04</div>
              <h3 className="font-bold text-slate-900 text-base mb-2">REST API & CLI</h3>
              <p className="text-xs text-slate-600 leading-relaxed mb-4">FastAPI endpoints, webhook integrations, and python command-line tooling.</p>
              <Link href="/docs" className="text-xs font-semibold text-slate-800 hover:underline">View API Spec →</Link>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section className="py-24 bg-slate-50 border-t border-slate-200" id="pricing">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">Simple, transparent pricing</h2>
            <p className="text-lg text-slate-600">Start free. Scale with your engineering team.</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 items-start max-w-5xl mx-auto">
            {/* Free */}
            <div className="bg-white rounded-2xl border border-slate-200 p-8 shadow-xs hover:shadow-md transition-shadow">
              <h3 className="text-xl font-bold text-slate-900 mb-1">Community Free</h3>
              <div className="flex items-baseline my-4">
                <span className="text-4xl font-extrabold text-slate-900">$0</span>
                <span className="text-slate-500 text-sm ml-2">/ month</span>
              </div>
              <p className="text-xs text-slate-500 mb-6">Up to 3 repositories with basic knowledge graph ingestion.</p>
              <Link href="/demo" className="block w-full py-2.5 px-4 rounded-xl text-center text-xs font-semibold text-slate-800 border border-slate-300 hover:bg-slate-50 mb-6">
                Take Demo Tour
              </Link>
              <ul className="space-y-3 text-xs text-slate-600">
                <li className="flex items-center gap-2">✓ 3 Git repositories</li>
                <li className="flex items-center gap-2">✓ 100 GraphRAG queries/mo</li>
                <li className="flex items-center gap-2">✓ Community support</li>
              </ul>
            </div>

            {/* Team (Featured) */}
            <div className="bg-white rounded-2xl border-2 border-teal-500 p-8 shadow-xl relative">
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-teal-600 text-white font-bold text-[10px] uppercase px-3 py-1 rounded-full tracking-wider">
                Most Popular
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-1">Team</h3>
              <div className="flex items-baseline my-4">
                <span className="text-4xl font-extrabold text-slate-900">$12</span>
                <span className="text-slate-500 text-sm ml-2">/ user / mo</span>
              </div>
              <p className="text-xs text-slate-500 mb-6">Unlimited repositories with full temporal reasoning & scanner.</p>
              <Link href="/demo" className="block w-full py-2.5 px-4 rounded-xl text-center text-xs font-semibold text-white bg-teal-600 hover:bg-teal-700 shadow-sm mb-6">
                Start Free Trial
              </Link>
              <ul className="space-y-3 text-xs text-slate-700 font-medium">
                <li className="flex items-center gap-2">✓ Unlimited repositories</li>
                <li className="flex items-center gap-2">✓ Three-Mode GraphRAG</li>
                <li className="flex items-center gap-2">✓ Decision Drift Index (DDI)</li>
                <li className="flex items-center gap-2">✓ Pre-Merge Impact Scanner</li>
                <li className="flex items-center gap-2">✓ Priority support</li>
              </ul>
            </div>

            {/* Enterprise */}
            <div className="bg-white rounded-2xl border border-slate-200 p-8 shadow-xs hover:shadow-md transition-shadow">
              <h3 className="text-xl font-bold text-slate-900 mb-1">Enterprise</h3>
              <div className="flex items-baseline my-4">
                <span className="text-4xl font-extrabold text-slate-900">Custom</span>
              </div>
              <p className="text-xs text-slate-500 mb-6">Self-hosted on-premise deployment with custom SLAs.</p>
              <Link href="/connect" className="block w-full py-2.5 px-4 rounded-xl text-center text-xs font-semibold text-slate-800 border border-slate-300 hover:bg-slate-50 mb-6">
                Contact Sales
              </Link>
              <ul className="space-y-3 text-xs text-slate-600">
                <li className="flex items-center gap-2">✓ Everything in Team</li>
                <li className="flex items-center gap-2">✓ On-premise Docker / K8s</li>
                <li className="flex items-center gap-2">✓ Custom SAML & SSO</li>
                <li className="flex items-center gap-2">✓ 99.9% Uptime SLA</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* 8. CTA Section */}
      <section className="py-24 bg-white relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-teal-50 to-indigo-50/50"></div>
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
          <h2 className="text-4xl md:text-5xl font-bold text-slate-900 mb-6">Start understanding your codebase today</h2>
          <p className="text-xl text-slate-600 mb-10">Join forward-thinking engineering teams who are ending architectural amnesia.</p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link href="/demo" className="w-full sm:w-auto bg-teal-500 hover:bg-teal-600 text-white px-8 py-4 rounded-xl text-lg font-medium transition-all shadow-lg shadow-teal-500/25">Take Tour</Link>
            <span className="text-sm text-slate-500">No credit card required.</span>
          </div>
        </div>
      </section>

      {/* 9. Footer */}
      <footer className="bg-white border-t border-slate-200 pt-16 pb-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-12">
            <div className="col-span-2 md:col-span-1">
              <div className="flex items-center gap-2 mb-4">
                <KairoLogo className="w-7 h-7" />
                <span className="text-xl font-bold tracking-tight text-slate-900">KAIRO</span>
              </div>
              <p className="text-slate-500 text-sm mb-6 max-w-xs">
                Project management that understands your codebase. Plan, track, and reason without losing context.
              </p>
              <div className="flex gap-4">
                <Link href="#" className="text-slate-400 hover:text-slate-600 transition-colors">
                  <GithubIcon size={20} />
                  <span className="sr-only">GitHub</span>
                </Link>
                {/* Social icons placeholders */}
                <div className="w-5 h-5 bg-slate-400 rounded-sm hover:bg-slate-600 transition-colors cursor-pointer"></div>
                <div className="w-5 h-5 bg-slate-400 rounded-full hover:bg-slate-600 transition-colors cursor-pointer"></div>
              </div>
            </div>
            
            <div>
              <h4 className="font-semibold text-slate-900 mb-4">Product</h4>
              <ul className="space-y-3">
                <li><Link href="#" className="text-sm text-slate-600 hover:text-teal-600 transition-colors">Features</Link></li>
                <li><Link href="#" className="text-sm text-slate-600 hover:text-teal-600 transition-colors">Pricing</Link></li>
                <li><Link href="#" className="text-sm text-slate-600 hover:text-teal-600 transition-colors">Integrations</Link></li>
                <li><Link href="#" className="text-sm text-slate-600 hover:text-teal-600 transition-colors">Changelog</Link></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold text-slate-900 mb-4">Resources</h4>
              <ul className="space-y-3">
                <li><Link href="#" className="text-sm text-slate-600 hover:text-teal-600 transition-colors">Documentation</Link></li>
                <li><Link href="#" className="text-sm text-slate-600 hover:text-teal-600 transition-colors">API Reference</Link></li>
                <li><Link href="#" className="text-sm text-slate-600 hover:text-teal-600 transition-colors">Blog</Link></li>
                <li><Link href="#" className="text-sm text-slate-600 hover:text-teal-600 transition-colors">Community</Link></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold text-slate-900 mb-4">Company</h4>
              <ul className="space-y-3">
                <li><Link href="#" className="text-sm text-slate-600 hover:text-teal-600 transition-colors">About Us</Link></li>
                <li><Link href="#" className="text-sm text-slate-600 hover:text-teal-600 transition-colors">Careers</Link></li>
                <li><Link href="#" className="text-sm text-slate-600 hover:text-teal-600 transition-colors">Privacy Policy</Link></li>
                <li><Link href="#" className="text-sm text-slate-600 hover:text-teal-600 transition-colors">Terms of Service</Link></li>
              </ul>
            </div>
          </div>
          
          <div className="pt-8 border-t border-slate-100 flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-sm text-slate-500">
              © {new Date().getFullYear()} KAIRO Inc. All rights reserved.
            </p>
            <div className="flex items-center gap-2 text-sm text-slate-500">
              <span className="w-2 h-2 rounded-full bg-green-500"></span>
              All systems operational
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
