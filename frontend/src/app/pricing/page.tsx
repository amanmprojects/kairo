"use client";

import KairoLogo from "@/components/KairoLogo";
import React, { useState } from "react";
import Link from "next/link";
import { 
  Menu, X, Check, ChevronDown, ChevronUp
} from "lucide-react";

const GithubIcon = ({ size = 24, className = "" }: { size?: number; className?: string }) => (
  <svg width={size} height={size} className={className} viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z"/>
  </svg>
);

export default function PricingPage() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  const faqs = [
    {
      question: "What counts as a repository?",
      answer: "A repository is any single Git repository connected to KAIRO. Monorepos are treated as a single repository regardless of their size."
    },
    {
      question: "Can I try Team features for free?",
      answer: "Yes, we offer a 14-day free trial for the Team plan. You will have full access to all features during the trial period."
    },
    {
      question: "Do you offer academic discounts?",
      answer: "Yes, we offer significant discounts for students, educators, and academic institutions. Please contact our support team with your academic email."
    },
    {
      question: "How does billing work?",
      answer: "We bill monthly or annually based on the number of active users in your organization. Annual billing includes a 20% discount."
    },
    {
      question: "Is my code safe?",
      answer: "Security is our top priority. We use industry-standard encryption in transit and at rest. KAIRO only reads your code and metadata, we never modify your repositories."
    }
  ];

  return (
    <div className="min-h-screen bg-white text-slate-900 font-sans selection:bg-teal-100 selection:text-teal-900">
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
              <Link href="/pricing" className="text-sm font-medium text-teal-600 transition-colors">Pricing</Link>
              <Link href="/docs" className="text-sm font-medium text-slate-600 hover:text-teal-600 transition-colors">Docs</Link>
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
              <Link href="/pricing" className="block px-3 py-2 rounded-md text-base font-medium text-teal-600 bg-teal-50">Pricing</Link>
              <Link href="/docs" className="block px-3 py-2 rounded-md text-base font-medium text-slate-700 hover:text-teal-600 hover:bg-slate-50">Docs</Link>
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
        <section className="pt-20 pb-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto text-center">
          <h1 className="text-4xl md:text-5xl font-extrabold text-slate-900 tracking-tight mb-6">
            Simple, transparent pricing
          </h1>
          <p className="text-xl text-slate-600 max-w-2xl mx-auto">
            Start free. Scale as your team grows.
          </p>
        </section>

        {/* Pricing Cards */}
        <section className="px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto pb-24">
          <div className="grid md:grid-cols-3 gap-8 lg:gap-12 items-start max-w-6xl mx-auto">
            {/* Free Plan */}
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-8 hover:shadow-md transition-shadow">
              <h3 className="text-xl font-bold text-slate-900 mb-2">Free</h3>
              <div className="flex items-baseline mb-6">
                <span className="text-4xl font-extrabold text-slate-900">$0</span>
                <span className="text-slate-500 ml-2">/month</span>
              </div>
              <p className="text-slate-600 mb-8 h-12">Perfect for individuals and small open source projects.</p>
              
              <Link href="/demo" className="block w-full py-3 px-4 rounded-lg text-center font-semibold text-teal-600 border-2 border-teal-600 hover:bg-teal-50 transition-colors mb-8">Take Tour</Link>
              
              <ul className="space-y-4">
                <li className="flex items-start">
                  <Check className="h-5 w-5 text-teal-600 shrink-0 mr-3 mt-0.5" />
                  <span className="text-slate-700">Up to 3 repositories</span>
                </li>
                <li className="flex items-start">
                  <Check className="h-5 w-5 text-teal-600 shrink-0 mr-3 mt-0.5" />
                  <span className="text-slate-700">Basic knowledge graph</span>
                </li>
                <li className="flex items-start">
                  <Check className="h-5 w-5 text-teal-600 shrink-0 mr-3 mt-0.5" />
                  <span className="text-slate-700">Community support</span>
                </li>
                <li className="flex items-start">
                  <Check className="h-5 w-5 text-teal-600 shrink-0 mr-3 mt-0.5" />
                  <span className="text-slate-700">100 GraphRAG queries/month</span>
                </li>
              </ul>
            </div>

            {/* Team Plan */}
            <div className="bg-white rounded-2xl border-2 border-teal-600 shadow-xl p-8 relative transform md:-translate-y-4">
              <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                <span className="bg-teal-600 text-white text-xs font-bold uppercase tracking-wider py-1 px-3 rounded-full">
                  Most Popular
                </span>
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-2">Team</h3>
              <div className="flex items-baseline mb-6">
                <span className="text-4xl font-extrabold text-slate-900">$12</span>
                <span className="text-slate-500 ml-2">/user/month</span>
              </div>
              <p className="text-slate-600 mb-8 h-12">For growing engineering teams that need deep code intelligence.</p>
              
              <Link href="/signup?plan=team" className="block w-full py-3 px-4 rounded-lg text-center font-semibold text-white bg-teal-600 hover:bg-teal-700 shadow-md hover:shadow-lg transition-all mb-8">
                Start Free Trial
              </Link>
              
              <ul className="space-y-4">
                <li className="flex items-start">
                  <Check className="h-5 w-5 text-teal-600 shrink-0 mr-3 mt-0.5" />
                  <span className="text-slate-700 font-medium">Unlimited repositories</span>
                </li>
                <li className="flex items-start">
                  <Check className="h-5 w-5 text-teal-600 shrink-0 mr-3 mt-0.5" />
                  <span className="text-slate-700 font-medium">Full temporal knowledge graph</span>
                </li>
                <li className="flex items-start">
                  <Check className="h-5 w-5 text-teal-600 shrink-0 mr-3 mt-0.5" />
                  <span className="text-slate-700">Three-Mode GraphRAG</span>
                </li>
                <li className="flex items-start">
                  <Check className="h-5 w-5 text-teal-600 shrink-0 mr-3 mt-0.5" />
                  <span className="text-slate-700">Decision Drift Index</span>
                </li>
                <li className="flex items-start">
                  <Check className="h-5 w-5 text-teal-600 shrink-0 mr-3 mt-0.5" />
                  <span className="text-slate-700">Change Impact Scanner</span>
                </li>
                <li className="flex items-start">
                  <Check className="h-5 w-5 text-teal-600 shrink-0 mr-3 mt-0.5" />
                  <span className="text-slate-700">Priority support</span>
                </li>
                <li className="flex items-start">
                  <Check className="h-5 w-5 text-teal-600 shrink-0 mr-3 mt-0.5" />
                  <span className="text-slate-700">Unlimited queries</span>
                </li>
              </ul>
            </div>

            {/* Enterprise Plan */}
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-8 hover:shadow-md transition-shadow">
              <h3 className="text-xl font-bold text-slate-900 mb-2">Enterprise</h3>
              <div className="flex items-baseline mb-6">
                <span className="text-4xl font-extrabold text-slate-900">Custom</span>
              </div>
              <p className="text-slate-600 mb-8 h-12">For large organizations with complex compliance and security needs.</p>
              
              <Link href="/contact" className="block w-full py-3 px-4 rounded-lg text-center font-semibold text-slate-700 border-2 border-slate-300 hover:bg-slate-50 transition-colors mb-8">
                Contact Sales
              </Link>
              
              <ul className="space-y-4">
                <li className="flex items-start">
                  <Check className="h-5 w-5 text-teal-600 shrink-0 mr-3 mt-0.5" />
                  <span className="text-slate-700 font-medium">Everything in Team</span>
                </li>
                <li className="flex items-start">
                  <Check className="h-5 w-5 text-teal-600 shrink-0 mr-3 mt-0.5" />
                  <span className="text-slate-700">On-premise deployment</span>
                </li>
                <li className="flex items-start">
                  <Check className="h-5 w-5 text-teal-600 shrink-0 mr-3 mt-0.5" />
                  <span className="text-slate-700">Custom integrations</span>
                </li>
                <li className="flex items-start">
                  <Check className="h-5 w-5 text-teal-600 shrink-0 mr-3 mt-0.5" />
                  <span className="text-slate-700">Dedicated support</span>
                </li>
                <li className="flex items-start">
                  <Check className="h-5 w-5 text-teal-600 shrink-0 mr-3 mt-0.5" />
                  <span className="text-slate-700">SSO and SAML</span>
                </li>
                <li className="flex items-start">
                  <Check className="h-5 w-5 text-teal-600 shrink-0 mr-3 mt-0.5" />
                  <span className="text-slate-700">SLA guarantees</span>
                </li>
              </ul>
            </div>
          </div>
        </section>

        {/* FAQ Section */}
        <section className="bg-slate-50 py-24">
          <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl font-bold text-slate-900 text-center mb-12">Frequently Asked Questions</h2>
            <div className="space-y-4">
              {faqs.map((faq, index) => (
                <div 
                  key={index} 
                  className="bg-white border border-slate-200 rounded-lg overflow-hidden transition-all duration-200"
                >
                  <button
                    onClick={() => setOpenFaq(openFaq === index ? null : index)}
                    className="w-full px-6 py-4 text-left flex justify-between items-center focus:outline-none"
                  >
                    <span className="font-semibold text-slate-900">{faq.question}</span>
                    {openFaq === index ? (
                      <ChevronUp className="h-5 w-5 text-teal-600 shrink-0 ml-4" />
                    ) : (
                      <ChevronDown className="h-5 w-5 text-slate-400 shrink-0 ml-4" />
                    )}
                  </button>
                  {openFaq === index && (
                    <div className="px-6 pb-4">
                      <p className="text-slate-600">{faq.answer}</p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Bottom CTA */}
        <section className="py-24 bg-white">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-3xl font-bold text-slate-900 mb-6">Ready to transform how you understand code?</h2>
            <p className="text-xl text-slate-600 mb-10 max-w-2xl mx-auto">
              Join thousands of developers using KAIRO to navigate complex codebases with ease.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/demo" className="bg-teal-600 text-white px-8 py-4 rounded-lg font-semibold text-lg hover:bg-teal-700 transition-colors shadow-sm">Take Tour</Link>
              <Link href="/contact" className="bg-slate-100 text-slate-800 px-8 py-4 rounded-lg font-semibold text-lg hover:bg-slate-200 transition-colors">
                Contact Sales
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
