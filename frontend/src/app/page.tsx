import Link from "next/link";
import { ArrowRight, BarChart3, Layers, Sparkles, Users, Workflow } from "lucide-react";

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen bg-[#f8f9fb] text-[#1e1e2f] font-sans selection:bg-purple-200">
      {/* Navbar */}
      <header className="h-16 border-b border-gray-200 bg-white/90 backdrop-blur-md px-6 sm:px-8 flex items-center justify-between sticky top-0 z-50">
        <div className="flex items-center gap-3">
          <div className="h-8 w-8 rounded-lg bg-[#321c64] flex items-center justify-center font-bold text-sm text-white shadow-sm">
            K
          </div>
          <span className="font-semibold text-base tracking-tight text-[#1e1e2f] flex items-center gap-2">
            KIARO <span className="text-[11px] font-mono text-gray-400 font-normal px-2 py-0.5 rounded-full bg-gray-100 border border-gray-200">ENTERPRISE</span>
          </span>
        </div>

        <nav className="hidden md:flex items-center gap-6 text-xs text-gray-500 font-medium">
          <Link href="/demo" className="hover:text-[#321c64] transition-colors">Overview & Portfolio</Link>
          <Link href="/demo" className="hover:text-[#321c64] transition-colors">Active Tasks & Board</Link>
          <Link href="/demo" className="hover:text-[#321c64] transition-colors">Team & Capacity</Link>
          <Link href="/demo" className="hover:text-[#321c64] transition-colors">Analytics & Velocity</Link>
        </nav>

        <div className="flex items-center gap-3">
          <Link
            href="/demo"
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-[#321c64] hover:bg-[#25144b] text-white font-medium text-xs transition-all shadow-sm"
          >
            Open Workspace <ArrowRight size={13} />
          </Link>
        </div>
      </header>

      {/* Hero Section */}
      <main className="flex-1 flex flex-col items-center justify-center relative px-6 py-20 sm:py-24 overflow-hidden text-center">
        {/* Subtle Ambient Glow */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[300px] bg-purple-200/30 blur-[130px] rounded-full pointer-events-none" />

        <div className="relative z-10 max-w-4xl space-y-6">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-purple-200 bg-purple-50 text-[#321c64] text-[11px] font-medium tracking-wide">
            <Sparkles size={13} /> Multi-Level Project Management & Engineering Intelligence
          </div>

          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-[#1e1e2f] leading-tight">
            Connect <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#321c64] via-purple-600 to-indigo-600">Objectives &rarr; Epics &rarr; Code</span> seamlessly
          </h1>

          <p className="max-w-2xl mx-auto text-sm sm:text-base text-gray-500 leading-relaxed font-normal">
            Eliminate delivery friction with a 5-tier work hierarchy, native multi-repo Kanban boards, automated velocity reports, and decision-aware repository memory.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-3">
            <Link
              href="/demo"
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#321c64] hover:bg-[#25144b] text-white font-medium text-xs sm:text-sm transition-all shadow-md shadow-purple-300/30"
            >
              Explore Live Workspace <ArrowRight size={15} />
            </Link>
            <Link
              href="/connect"
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl border border-gray-300 bg-white hover:bg-gray-50 text-gray-700 font-medium text-xs sm:text-sm transition-all"
            >
              Connect Repository
            </Link>
          </div>

          {/* Feature Pillars Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-14 text-left">
            <div className="p-5 rounded-2xl border border-gray-200 bg-white shadow-sm space-y-2.5 hover:shadow-md transition-shadow">
              <div className="h-9 w-9 rounded-xl bg-purple-50 border border-purple-200 flex items-center justify-center text-[#5b3cc4]">
                <Layers size={18} />
              </div>
              <h3 className="font-semibold text-[#1e1e2f] text-sm">Multi-Level Hierarchy</h3>
              <p className="text-xs text-gray-500 leading-relaxed">
                Break high-level Objectives down into Projects, Epics, Tasks, and Sub-tasks with automated progress rollups.
              </p>
            </div>

            <div className="p-5 rounded-2xl border border-gray-200 bg-white shadow-sm space-y-2.5 hover:shadow-md transition-shadow">
              <div className="h-9 w-9 rounded-xl bg-blue-50 border border-blue-200 flex items-center justify-center text-blue-600">
                <BarChart3 size={18} />
              </div>
              <h3 className="font-semibold text-[#1e1e2f] text-sm">Sprint Velocity Reports</h3>
              <p className="text-xs text-gray-500 leading-relaxed">
                Track rolling velocity, burndown metrics, and delivery predictability across multi-repository sprints.
              </p>
            </div>

            <div className="p-5 rounded-2xl border border-gray-200 bg-white shadow-sm space-y-2.5 hover:shadow-md transition-shadow">
              <div className="h-9 w-9 rounded-xl bg-indigo-50 border border-indigo-200 flex items-center justify-center text-indigo-600">
                <Workflow size={18} />
              </div>
              <h3 className="font-semibold text-[#1e1e2f] text-sm">Workflow Automations</h3>
              <p className="text-xs text-gray-500 leading-relaxed">
                Synchronize cross-repo dependencies, auto-move PR cards, and detect decision drift before merging.
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
