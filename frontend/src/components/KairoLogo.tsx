import React from "react";

export default function KairoLogo({ className = "w-7 h-7" }: { className?: string }) {
  return (
    <svg viewBox="0 0 36 36" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
      <defs>
        <linearGradient id="kairo-grad-slate" x1="0" y1="0" x2="36" y2="36" gradientUnits="userSpaceOnUse">
          <stop stopColor="#0f172a" />
          <stop offset="1" stopColor="#1e293b" />
        </linearGradient>
        <linearGradient id="kairo-grad-teal" x1="6" y1="6" x2="30" y2="30" gradientUnits="userSpaceOnUse">
          <stop stopColor="#0d9488" />
          <stop offset="1" stopColor="#06b6d4" />
        </linearGradient>
      </defs>
      {/* Rounded container with subtle border */}
      <rect width="36" height="36" rx="9" fill="url(#kairo-grad-slate)" />
      <rect x="0.5" y="0.5" width="35" height="35" rx="8.5" stroke="#334155" strokeWidth="1" />
      
      {/* Knowledge Graph Edges forming letter 'K' */}
      <path d="M11 9.5V26.5" stroke="#f8fafc" strokeWidth="3" strokeLinecap="round" />
      <path d="M12 18L23.5 9.5" stroke="url(#kairo-grad-teal)" strokeWidth="3" strokeLinecap="round" />
      <path d="M15 15.5L25 26.5" stroke="url(#kairo-grad-teal)" strokeWidth="3" strokeLinecap="round" />
      
      {/* Graph Node Vertices */}
      <circle cx="11" cy="9.5" r="2.2" fill="#38bdf8" />
      <circle cx="11" cy="18" r="2.2" fill="#2dd4bf" />
      <circle cx="11" cy="26.5" r="2.2" fill="#38bdf8" />
      <circle cx="23.5" cy="9.5" r="2.4" fill="#2dd4bf" />
      <circle cx="25" cy="26.5" r="2.4" fill="#38bdf8" />
    </svg>
  );
}
