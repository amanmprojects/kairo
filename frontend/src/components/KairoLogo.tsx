import React from "react";

export default function KairoLogo({ className = "w-7 h-7" }: { className?: string }) {
  return (
    <svg viewBox="0 0 36 36" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
      <defs>
        <linearGradient id="kairo-logo-grad-slate" x1="0" y1="0" x2="36" y2="36" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#090d16" />
          <stop offset="100%" stopColor="#111827" />
        </linearGradient>
      </defs>
      {/* Rounded container with subtle border */}
      <rect width="36" height="36" rx="9" fill="#0b1120" />
      <rect width="36" height="36" rx="9" fill="url(#kairo-logo-grad-slate)" />
      <rect x="0.5" y="0.5" width="35" height="35" rx="8.5" stroke="#1e293b" strokeWidth={1} />
      
      {/* Knowledge Graph Edges forming letter 'K' */}
      <path d="M11 9.5L11 26.5" stroke="#f8fafc" strokeWidth={2.75} strokeLinecap="round" />
      <path d="M11 18L23.5 9.5" stroke="#2dd4bf" strokeWidth={2.75} strokeLinecap="round" />
      <path d="M11 18L24.5 26.5" stroke="#38bdf8" strokeWidth={2.75} strokeLinecap="round" />
      
      {/* Graph Node Vertices */}
      <circle cx="11" cy="9.5" r={2.25} fill="#38bdf8" />
      <circle cx="11" cy="18" r={2.6} fill="#2dd4bf" />
      <circle cx="11" cy="26.5" r={2.25} fill="#38bdf8" />
      <circle cx="23.5" cy="9.5" r={2.25} fill="#2dd4bf" />
      <circle cx="24.5" cy="26.5" r={2.25} fill="#38bdf8" />
    </svg>
  );
}
