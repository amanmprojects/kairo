"use client";

import React, { useState, useEffect } from 'react';
import { Compass, LayoutDashboard, Kanban, MessageSquare, ShieldAlert, X } from 'lucide-react';

const steps = [
  {
    icon: Compass,
    title: 'Welcome to KAIRO',
    body: 'KAIRO is an engineering intelligence platform that helps you understand the reasoning behind your codebase. Let us show you around.'
  },
  {
    icon: LayoutDashboard,
    title: 'Your Workspace Overview',
    body: 'The Overview page shows your sprint status, Decision Drift Index, Engineering Evolution Score, and recent activity. Keep an eye on the DDI score - it tells you when your code is drifting from its intended architecture.'
  },
  {
    icon: Kanban,
    title: 'Sprint Board',
    body: 'Manage your sprint with a Kanban board. Issues flagged with impact warnings have been analyzed by KAIRO and may affect existing architectural decisions.'
  },
  {
    icon: MessageSquare,
    title: 'Ask Anything',
    body: 'Query your engineering memory graph with natural language. KAIRO uses Three-Mode GraphRAG to find the right context - whether you need structural dependencies, historical decisions, or semantic search.'
  },
  {
    icon: ShieldAlert,
    title: 'Pre-Merge Intelligence',
    body: 'Before you merge, the Impact Scanner analyzes modified files against historical telemetry. It detects decision conflicts, fragile file patterns, and ownership gaps to prevent architectural decay.'
  }
];

export default function Onboarding() {
  const [isVisible, setIsVisible] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    const hasOnboarded = localStorage.getItem('kairo-onboarded');
    if (!hasOnboarded) {
      setIsVisible(true);
    }
  }, []);

  const handleDismiss = () => {
    localStorage.setItem('kairo-onboarded', 'true');
    setIsVisible(false);
  };

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep((prev) => prev + 1);
    } else {
      handleDismiss();
    }
  };

  const handleSkip = () => {
    handleDismiss();
  };

  if (!isMounted || !isVisible) return null;

  const StepIcon = steps[currentStep].icon;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div className="w-full max-w-lg bg-zinc-900 border border-zinc-800 rounded-xl shadow-2xl overflow-hidden relative animate-in fade-in zoom-in duration-200">
        <button
          onClick={handleSkip}
          className="absolute top-4 right-4 text-zinc-400 hover:text-white transition-colors"
          aria-label="Close"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="p-8">
          <div className="flex justify-center space-x-2 mb-8">
            {steps.map((_, index) => (
              <div
                key={index}
                className={`w-2.5 h-2.5 rounded-full transition-colors ${
                  index === currentStep ? 'bg-teal-500' : 'bg-zinc-700'
                }`}
              />
            ))}
          </div>

          <div className="flex flex-col items-center text-center space-y-4">
            <div className="w-16 h-16 rounded-2xl bg-teal-500/10 flex items-center justify-center text-teal-400 mb-2">
              <StepIcon className="w-8 h-8" />
            </div>
            
            <h2 className="text-2xl font-bold text-white">
              {steps[currentStep].title}
            </h2>
            
            <p className="text-zinc-400 leading-relaxed min-h-[80px]">
              {steps[currentStep].body}
            </p>
          </div>
        </div>

        <div className="px-8 py-5 bg-zinc-950/50 border-t border-zinc-800 flex items-center justify-between">
          <button
            onClick={handleSkip}
            className="text-sm text-zinc-500 hover:text-zinc-300 font-medium transition-colors"
          >
            Skip Tour
          </button>
          
          <button
            onClick={handleNext}
            className="px-6 py-2.5 bg-teal-600 hover:bg-teal-500 text-white font-medium rounded-lg transition-colors shadow-lg shadow-teal-500/20"
          >
            {currentStep === steps.length - 1 ? 'Get Started' : 'Next'}
          </button>
        </div>
      </div>
    </div>
  );
}
