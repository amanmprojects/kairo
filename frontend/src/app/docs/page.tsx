"use client";

import KairoLogo from "@/components/KairoLogo";
import React, { useState } from "react";
import Link from "next/link";
import { 
  Menu, X, Rocket, BookOpen, Search, Code, Terminal, Server, ArrowRight
} from "lucide-react";

const GithubIcon = ({ size = 24, className = "" }: { size?: number; className?: string }) => (
  <svg width={size} height={size} className={className} viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z"/>
  </svg>
);

export default function DocsPage() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const categories = [
    {
      title: "Getting Started",
      description: "Quick setup guide, connecting GitHub, first knowledge graph",
      icon: Rocket,
      readTime: "5 min read",
      href: "/docs/getting-started",
      color: "text-blue-600",
      bgColor: "bg-blue-100"
    },
    {
      title: "Core Concepts",
      description: "Temporal Knowledge Graphs, Bitemporality, Two-Layer Architecture",
      icon: BookOpen,
      readTime: "10 min read",
      href: "/docs/concepts",
      color: "text-purple-600",
      bgColor: "bg-purple-100"
    },
    {
      title: "GraphRAG Guide",
      description: "Understanding the three retrieval modes, query syntax, hub suppression",
      icon: Search,
      readTime: "12 min read",
      href: "/docs/graphrag",
      color: "text-teal-600",
      bgColor: "bg-teal-100"
    },
    {
      title: "API Reference",
      description: "REST API endpoints, authentication, webhooks",
      icon: Code,
      readTime: "15 min read",
      href: "/docs/api",
      color: "text-amber-600",
      bgColor: "bg-amber-100"
    },
    {
      title: "CLI Reference",
      description: "Command line tools, ingestion, stats, churn analysis",
      icon: Terminal,
      readTime: "8 min read",
      href: "/docs/cli",
      color: "text-rose-600",
      bgColor: "bg-rose-100"
    },
    {
      title: "Deployment",
      description: "Self-hosted setup, Docker, PostgreSQL configuration",
      icon: Server,
      readTime: "20 min read",
      href: "/docs/deployment",
      color: "text-indigo-600",
      bgColor: "bg-indigo-100"
    }
  ];

  const popularArticles = [
    {
      title: "How to connect your first repository",
      readTime: "3 min",
      href: "/docs/getting-started/connect-repo"
    },
    {
      title: "Understanding Decision Drift Index",
      readTime: "7 min",
      href: "/docs/concepts/decision-drift"
    },
    {
      title: "Configuring hub suppression thresholds",
      readTime: "5 min",
      href: "/docs/graphrag/hub-suppression"
    },
    {
      title: "Setting up the Change Impact Scanner",
      readTime: "4 min",
      href: "/docs/guides/change-impact-scanner"
    }
  ];

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans selection:bg-teal-100 selection:text-teal-900">
      {/* Navigation */}
      <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <Link href="/" className="flex items-center gap-2 group">
                <KairoLogo className="w-7 h-7" />
                <span className="font-bold text-xl tracking-tight text-slate-900">KAIRO</span>
              </Link>
            </div>
            
            <div className="hidden md:flex items-center space-x-8">
              <Link href="/product" className="text-sm font-medium text-slate-600 hover:text-teal-600 transition-colors">Product</Link>
              <Link href="/features" className="text-sm font-medium text-slate-600 hover:text-teal-600 transition-colors">Features</Link>
              <Link href="/pricing" className="text-sm font-medium text-slate-600 hover:text-teal-600 transition-colors">Pricing</Link>
              <Link href="/docs" className="text-sm font-medium text-teal-600 transition-colors">Docs</Link>
            </div>

            <div className="hidden md:flex items-center space-x-4">
              <Link href="/login" className="text-sm font-medium text-slate-600 hover:text-teal-600 transition-colors">
                Sign In
              </Link>
              <Link href="/demo" className="text-sm font-medium bg-teal-600 text-white px-4 py-2 rounded-lg hover:bg-teal-700 transition-all shadow-sm hover:shadow">Take Tour</Link>
            </div>

            <div className="md:hidden flex items-center">
              <button 
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="text-slate-600 hover:text-teal-600 p-2"
              >
                {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden bg-white border-b border-slate-200">
            <div className="px-4 pt-2 pb-4 space-y-1">
              <Link href="/product" className="block px-3 py-2 rounded-md text-base font-medium text-slate-700 hover:text-teal-600 hover:bg-slate-50">Product</Link>
              <Link href="/features" className="block px-3 py-2 rounded-md text-base font-medium text-slate-700 hover:text-teal-600 hover:bg-slate-50">Features</Link>
              <Link href="/pricing" className="block px-3 py-2 rounded-md text-base font-medium text-slate-700 hover:text-teal-600 hover:bg-slate-50">Pricing</Link>
              <Link href="/docs" className="block px-3 py-2 rounded-md text-base font-medium text-teal-600 bg-teal-50">Docs</Link>
              <div className="mt-4 pt-4 border-t border-slate-200 flex flex-col space-y-3 px-3">
                <Link href="/login" className="text-base font-medium text-slate-700 hover:text-teal-600">Sign In</Link>
                <Link href="/demo" className="text-base font-medium text-center bg-teal-600 text-white px-4 py-2 rounded-lg hover:bg-teal-700">Take Tour</Link>
              </div>
            </div>
          </div>
        )}
      </nav>

      <main>
        {/* Hero Section */}
        <section className="bg-white border-b border-slate-200 pt-16 pb-20 px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl font-extrabold text-slate-900 tracking-tight mb-6">
              Documentation
            </h1>
            <p className="text-xl text-slate-600">
              Everything you need to get started with KAIRO
            </p>
            
            {/* Search Bar Placeholder */}
            <div className="mt-10 max-w-2xl mx-auto relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-slate-400" />
              </div>
              <input
                type="text"
                className="block w-full pl-11 pr-4 py-4 border border-slate-300 rounded-xl leading-5 bg-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500 sm:text-lg shadow-sm"
                placeholder="Search documentation..."
              />
            </div>
          </div>
        </section>

        {/* Content Section */}
        <section className="py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            
            {/* Categories Grid (2/3 width on large screens) */}
            <div className="lg:col-span-2">
              <h2 className="text-2xl font-bold text-slate-900 mb-8">Browse Categories</h2>
              <div className="grid sm:grid-cols-2 gap-6">
                {categories.map((category, index) => {
                  const Icon = category.icon;
                  return (
                    <Link 
                      key={index} 
                      href={category.href}
                      className="group bg-white p-6 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md hover:border-teal-200 transition-all"
                    >
                      <div className="flex items-center justify-between mb-4">
                        <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${category.bgColor}`}>
                          <Icon className={`h-6 w-6 ${category.color}`} />
                        </div>
                        <span className="text-xs font-medium text-slate-500 bg-slate-100 px-2.5 py-1 rounded-full">
                          {category.readTime}
                        </span>
                      </div>
                      <h3 className="text-lg font-bold text-slate-900 mb-2 group-hover:text-teal-600 transition-colors">
                        {category.title}
                      </h3>
                      <p className="text-slate-600 text-sm mb-4 line-clamp-2">
                        {category.description}
                      </p>
                      <div className="flex items-center text-sm font-semibold text-teal-600">
                        Explore <ArrowRight className="ml-1 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                      </div>
                    </Link>
                  )
                })}
              </div>
            </div>

            {/* Sidebar (1/3 width on large screens) */}
            <div>
              <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm sticky top-24">
                <h2 className="text-lg font-bold text-slate-900 mb-6 flex items-center">
                  <span className="w-1.5 h-6 bg-teal-500 rounded-full mr-3"></span>
                  Popular Articles
                </h2>
                <ul className="space-y-6">
                  {popularArticles.map((article, index) => (
                    <li key={index}>
                      <Link href={article.href} className="group block">
                        <h4 className="text-slate-800 font-medium group-hover:text-teal-600 transition-colors mb-1">
                          {article.title}
                        </h4>
                        <div className="flex items-center text-xs text-slate-500">
                          <BookOpen className="h-3.5 w-3.5 mr-1.5" />
                          {article.readTime}
                        </div>
                      </Link>
                    </li>
                  ))}
                </ul>
                
                <div className="mt-8 pt-6 border-t border-slate-200">
                  <h3 className="font-semibold text-slate-900 mb-3">Need more help?</h3>
                  <p className="text-sm text-slate-600 mb-4">
                    Can't find what you're looking for? Our community is here to help.
                  </p>
                  <Link href="/community" className="inline-flex items-center justify-center w-full px-4 py-2 text-sm font-medium text-teal-700 bg-teal-50 hover:bg-teal-100 rounded-lg transition-colors">
                    Join our Discord
                  </Link>
                </div>
              </div>
            </div>
            
          </div>
        </section>

        {/* Bottom CTA */}
        <section className="py-20 bg-teal-900">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-3xl font-bold text-white mb-6">Start building with KAIRO today</h2>
            <p className="text-lg text-teal-100 mb-10 max-w-2xl mx-auto">
              Set up your first knowledge graph in minutes and completely transform your code comprehension.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/demo" className="bg-teal-400 text-teal-950 px-8 py-3 rounded-lg font-semibold hover:bg-teal-300 transition-colors">Take Tour</Link>
              <Link href="/docs/getting-started" className="bg-teal-800 text-white px-8 py-3 rounded-lg font-semibold border border-teal-700 hover:bg-teal-700 transition-colors">
                Read the Quickstart
              </Link>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-slate-900 text-slate-300 py-16 border-t border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 lg:grid-cols-5 gap-12">
            <div className="lg:col-span-2">
              <Link href="/" className="flex items-center gap-2 mb-6 group">
                <div className="w-8 h-8 rounded-lg bg-teal-500 flex items-center justify-center">
                  <span className="text-slate-900 font-bold text-xl leading-none">K</span>
                </div>
                <span className="font-bold text-xl tracking-tight text-white">KAIRO</span>
              </Link>
              <p className="text-slate-400 mb-6 max-w-sm">
                The temporal code intelligence platform. Understand your codebase as a living, breathing entity.
              </p>
              <div className="flex space-x-4">
                <a href="#" className="text-slate-400 hover:text-white transition-colors">
                  <div className="w-5 h-5 rounded bg-slate-400/30" />
                  <span className="sr-only">Twitter</span>
                </a>
                <a href="#" className="text-slate-400 hover:text-white transition-colors">
                  <GithubIcon className="h-5 w-5" />
                  <span className="sr-only">GitHub</span>
                </a>
                <a href="#" className="text-slate-400 hover:text-white transition-colors">
                  <div className="w-5 h-5 rounded bg-slate-400/30" />
                  <span className="sr-only">LinkedIn</span>
                </a>
              </div>
            </div>
            
            <div>
              <h4 className="text-white font-semibold mb-4">Product</h4>
              <ul className="space-y-3">
                <li><Link href="/features" className="hover:text-teal-400 transition-colors">Features</Link></li>
                <li><Link href="/pricing" className="hover:text-teal-400 transition-colors">Pricing</Link></li>
                <li><Link href="/changelog" className="hover:text-teal-400 transition-colors">Changelog</Link></li>
                <li><Link href="/integrations" className="hover:text-teal-400 transition-colors">Integrations</Link></li>
              </ul>
            </div>
            
            <div>
              <h4 className="text-white font-semibold mb-4">Resources</h4>
              <ul className="space-y-3">
                <li><Link href="/docs" className="hover:text-teal-400 transition-colors">Documentation</Link></li>
                <li><Link href="/blog" className="hover:text-teal-400 transition-colors">Blog</Link></li>
                <li><Link href="/community" className="hover:text-teal-400 transition-colors">Community</Link></li>
                <li><Link href="/guides" className="hover:text-teal-400 transition-colors">Guides</Link></li>
              </ul>
            </div>
            
            <div>
              <h4 className="text-white font-semibold mb-4">Company</h4>
              <ul className="space-y-3">
                <li><Link href="/about" className="hover:text-teal-400 transition-colors">About Us</Link></li>
                <li><Link href="/careers" className="hover:text-teal-400 transition-colors">Careers</Link></li>
                <li><Link href="/contact" className="hover:text-teal-400 transition-colors">Contact</Link></li>
                <li><Link href="/legal" className="hover:text-teal-400 transition-colors">Legal & Privacy</Link></li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-slate-800 mt-16 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-slate-500 text-sm">
              &copy; {new Date().getFullYear()} KAIRO Inc. All rights reserved.
            </p>
            <div className="flex space-x-6 text-sm text-slate-500">
              <Link href="/privacy" className="hover:text-white transition-colors">Privacy Policy</Link>
              <Link href="/terms" className="hover:text-white transition-colors">Terms of Service</Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
