"use client";

import KairoLogo from "@/components/KairoLogo";
import React from "react";
import Link from "next/link";
import { 
  Network, 
  GitCommit, 
  GitPullRequest, 
  FileText, 
  Clock, 
  Search,
  Database,
  CheckCircle2,
  Zap
} from "lucide-react";

export default function GraphRAGPage() {
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
        <section className="relative pt-24 pb-20 overflow-hidden bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-teal-50 border border-teal-100 text-teal-700 text-sm font-medium mb-8">
              <Database className="w-4 h-4" />
              Core Technology
            </div>
            <h1 className="text-5xl md:text-6xl font-extrabold tracking-tight text-slate-900 mb-6 leading-tight max-w-4xl mx-auto">
              Three retrieval modes. <span className="text-teal-600">One intelligent system.</span>
            </h1>
            <p className="text-xl text-slate-600 max-w-3xl mx-auto leading-relaxed">
              KAIRO goes beyond simple vector search. Our GraphRAG engine dynamically selects the optimal retrieval strategy for every query.
            </p>
          </div>
        </section>

        {/* Modes Explained */}
        <section className="py-24 bg-slate-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-32">
            
            {/* Mode 1 */}
            <div className="grid md:grid-cols-2 gap-16 items-center">
              <div>
                <div className="w-12 h-12 bg-indigo-100 rounded-xl flex items-center justify-center mb-6">
                  <Network className="w-6 h-6 text-indigo-600" />
                </div>
                <h2 className="text-3xl font-bold text-slate-900 mb-4">Anchored Retrieval</h2>
                <p className="text-lg text-slate-600 mb-6 leading-relaxed">
                  Walks the knowledge graph structurally from a specific file to discover related decisions, even when they share zero vocabulary with your query. Perfect for understanding why a specific file exists or was changed.
                </p>
                <ul className="space-y-3">
                  {['Structural context tracing', 'Bypasses vocabulary mismatch', 'Exposes hidden dependencies'].map((item, i) => (
                    <li key={i} className="flex items-start gap-3">
                      <CheckCircle2 className="w-5 h-5 text-indigo-600 shrink-0 mt-0.5" />
                      <span className="text-slate-700">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="bg-white rounded-2xl p-6 shadow-xl shadow-slate-200/50 border border-slate-100">
                <div className="flex flex-col gap-4">
                  <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-lg border border-slate-200">
                    <FileText className="w-5 h-5 text-slate-500" />
                    <span className="font-mono text-sm text-slate-700">api/cache/redis.ts</span>
                  </div>
                  <div className="flex justify-center">
                    <div className="w-0.5 h-6 bg-indigo-200"></div>
                  </div>
                  <div className="flex items-center gap-3 p-3 bg-indigo-50 rounded-lg border border-indigo-100">
                    <GitCommit className="w-5 h-5 text-indigo-500" />
                    <span className="font-mono text-sm text-indigo-700">Commit: f83b9a1 (Switch to Redis cluster)</span>
                  </div>
                  <div className="flex justify-center">
                    <div className="w-0.5 h-6 bg-indigo-200"></div>
                  </div>
                  <div className="flex items-center gap-3 p-3 bg-indigo-50 rounded-lg border border-indigo-100">
                    <GitPullRequest className="w-5 h-5 text-indigo-500" />
                    <span className="font-medium text-sm text-indigo-700">PR #402: Scaling cache infrastructure</span>
                  </div>
                  <div className="flex justify-center">
                    <div className="w-0.5 h-6 bg-teal-200"></div>
                  </div>
                  <div className="flex items-center gap-3 p-4 bg-teal-50 rounded-lg border border-teal-200">
                    <Database className="w-5 h-5 text-teal-600" />
                    <div>
                      <div className="font-medium text-teal-900 text-sm">Architectural Decision</div>
                      <div className="text-teal-700 text-xs mt-1">"Must use distributed caching for sessions"</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Mode 2 */}
            <div className="grid md:grid-cols-2 gap-16 items-center">
              <div className="order-2 md:order-1 bg-white rounded-2xl p-6 shadow-xl shadow-slate-200/50 border border-slate-100">
                <div className="space-y-6">
                  <div className="flex justify-between text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
                    <span>2022</span>
                    <span>2023</span>
                    <span>2024</span>
                  </div>
                  
                  <div className="relative h-12 flex items-center">
                    <div className="absolute left-0 w-full h-1 bg-slate-100 rounded-full"></div>
                    <div className="absolute left-0 w-1/3 h-2 bg-slate-300 rounded-full top-1/2 -translate-y-1/2"></div>
                    <div className="absolute left-4 top-full mt-2 text-xs text-slate-500">Local Cache</div>
                  </div>
                  
                  <div className="relative h-12 flex items-center">
                    <div className="absolute left-0 w-full h-1 bg-slate-100 rounded-full"></div>
                    <div className="absolute left-[30%] w-2/3 h-2 bg-teal-500 rounded-full top-1/2 -translate-y-1/2 shadow-sm shadow-teal-500/20"></div>
                    <div className="absolute left-[30%] top-full mt-2 text-xs font-medium text-teal-700">Redis Cluster</div>
                    
                    {/* Vertical marker */}
                    <div className="absolute left-[45%] top-[-20px] bottom-[-40px] w-0.5 bg-indigo-500 border-x border-white"></div>
                    <div className="absolute left-[45%] top-[-30px] -translate-x-1/2 bg-indigo-600 text-white text-[10px] px-2 py-1 rounded font-mono shadow-sm">
                      Mar 2023
                    </div>
                  </div>
                  
                  <div className="p-3 mt-8 bg-slate-50 rounded-lg border border-slate-200 text-sm text-slate-700 italic">
                    "Query resolved against context active in March 2023."
                  </div>
                </div>
              </div>
              <div className="order-1 md:order-2">
                <div className="w-12 h-12 bg-teal-100 rounded-xl flex items-center justify-center mb-6">
                  <Clock className="w-6 h-6 text-teal-600" />
                </div>
                <h2 className="text-3xl font-bold text-slate-900 mb-4">As-Of Retrieval</h2>
                <p className="text-lg text-slate-600 mb-6 leading-relaxed">
                  Filters decisions by their bitemporal validity interval to answer historical queries. Ask 'What did we believe about caching in March 2023?' and get only decisions that were active at that time.
                </p>
                <ul className="space-y-3">
                  {['Point-in-time context recreation', 'Bitemporal data modeling', 'Historical auditing'].map((item, i) => (
                    <li key={i} className="flex items-start gap-3">
                      <CheckCircle2 className="w-5 h-5 text-teal-600 shrink-0 mt-0.5" />
                      <span className="text-slate-700">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Mode 3 */}
            <div className="grid md:grid-cols-2 gap-16 items-center">
              <div>
                <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center mb-6">
                  <Search className="w-6 h-6 text-blue-600" />
                </div>
                <h2 className="text-3xl font-bold text-slate-900 mb-4">Semantic Retrieval</h2>
                <p className="text-lg text-slate-600 mb-6 leading-relaxed">
                  Fallback pgvector similarity search for unstructured queries. Uses the same embeddings as standard RAG but benefits from the graph's filtered context.
                </p>
                <ul className="space-y-3">
                  {['pgvector similarity search', 'Context-aware embeddings', 'Natural language queries'].map((item, i) => (
                    <li key={i} className="flex items-start gap-3">
                      <CheckCircle2 className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" />
                      <span className="text-slate-700">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="bg-white rounded-2xl p-6 shadow-xl shadow-slate-200/50 border border-slate-100">
                <div className="space-y-4">
                  <div className="flex items-center gap-2 p-3 bg-slate-50 rounded-lg border border-slate-200">
                    <Search className="w-4 h-4 text-slate-400" />
                    <span className="text-sm text-slate-600">How do we handle rate limiting?</span>
                  </div>
                  
                  <div className="space-y-3 pl-4 border-l-2 border-slate-100">
                    <div className="p-3 bg-blue-50/50 rounded-lg border border-blue-100">
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-xs font-semibold text-blue-700">98% Match</span>
                        <span className="text-[10px] text-slate-400">ADR-042</span>
                      </div>
                      <p className="text-sm text-slate-700">Implemented token bucket rate limiting on API gateway.</p>
                    </div>
                    <div className="p-3 bg-slate-50 rounded-lg border border-slate-100">
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-xs font-semibold text-slate-500">85% Match</span>
                        <span className="text-[10px] text-slate-400">PR #891</span>
                      </div>
                      <p className="text-sm text-slate-600">Adding rate limit headers to responses.</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </section>

        {/* Hub Suppression */}
        <section className="py-24 bg-white border-y border-slate-100">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-3xl mx-auto mb-16">
              <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">Dynamic Hub Suppression</h2>
              <p className="text-lg text-slate-600">
                Unrestricted graph traversal causes hub domination. KAIRO automatically suppresses overly connected nodes to maintain high signal-to-noise ratios.
              </p>
            </div>
            
            <div className="max-w-4xl mx-auto bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
              <div className="grid grid-cols-3 bg-slate-50 border-b border-slate-200 text-sm font-semibold text-slate-700">
                <div className="p-4 text-center">Max Degree Allowed</div>
                <div className="p-4 text-center border-l border-slate-200">Context Overlap</div>
                <div className="p-4 text-center border-l border-slate-200">Retrieval Quality</div>
              </div>
              <div className="divide-y divide-slate-100">
                <div className="grid grid-cols-3 text-sm">
                  <div className="p-4 text-center font-mono text-slate-600 flex items-center justify-center">None (Infinite)</div>
                  <div className="p-4 text-center border-l border-slate-200">
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-red-50 text-red-700 font-medium">
                      56% Noise
                    </span>
                  </div>
                  <div className="p-4 text-center border-l border-slate-200 text-slate-500">Poor (Hub Domination)</div>
                </div>
                <div className="grid grid-cols-3 text-sm">
                  <div className="p-4 text-center font-mono text-slate-600 flex items-center justify-center">20 Edges</div>
                  <div className="p-4 text-center border-l border-slate-200">
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-amber-50 text-amber-700 font-medium">
                      27% Noise
                    </span>
                  </div>
                  <div className="p-4 text-center border-l border-slate-200 text-slate-600">Acceptable</div>
                </div>
                <div className="grid grid-cols-3 text-sm bg-teal-50/30">
                  <div className="p-4 text-center font-mono text-teal-700 font-medium flex items-center justify-center">10 Edges</div>
                  <div className="p-4 text-center border-l border-slate-200">
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-teal-100 text-teal-800 font-bold">
                      3% Noise
                    </span>
                  </div>
                  <div className="p-4 text-center border-l border-slate-200 text-teal-700 font-medium flex items-center justify-center gap-2">
                    <Zap className="w-4 h-4" /> Optimal Signal
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="py-24 bg-slate-900 text-center">
          <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl font-bold text-white mb-6">Experience intelligent retrieval</h2>
            <p className="text-lg text-slate-400 mb-8">
              Start using GraphRAG to uncover the deep context of your codebase today.
            </p>
            <div className="flex justify-center gap-4">
              <Link href="/demo" className="px-6 py-3 bg-teal-500 text-white font-medium rounded-lg hover:bg-teal-400 transition-colors">
                Start Free Trial
              </Link>
              <Link href="/docs" className="px-6 py-3 bg-slate-800 text-slate-300 font-medium rounded-lg hover:bg-slate-700 hover:text-white transition-colors">
                Read the Docs
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
