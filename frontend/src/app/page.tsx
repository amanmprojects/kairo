import Link from "next/link";
import { ArrowRight, BarChart3, CheckCircle2, FolderKanban, GitBranch, GitPullRequest, Layers, ShieldCheck, Sparkles, Workflow } from "lucide-react";

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen bg-[#0B0F17] text-slate-100 font-sans selection:bg-indigo-500/30">
      {/* Navbar */}
      <header className="h-16 border-b border-slate-800/80 bg-[#0B0F17]/80 backdrop-blur-md px-8 flex items-center justify-between sticky top-0 z-50">
        <div className="flex items-center gap-3">
          <div className="h-8 w-8 rounded-lg bg-gradient-to-tr from-indigo-500 to-cyan-400 flex items-center justify-center font-bold text-sm text-black shadow-lg shadow-indigo-500/20">
            K
          </div>
          <span className="font-extrabold text-lg tracking-tight text-white">
            KIARO <span className="text-slate-500 font-normal">| Multi-Level Agile</span>
          </span>
        </div>

        <nav className="hidden md:flex items-center gap-6 text-sm text-slate-400 font-medium">
          <Link href="/demo" className="hover:text-white transition-colors">Hierarchy</Link>
          <Link href="/demo" className="hover:text-white transition-colors">Agile Board</Link>
          <Link href="/demo" className="hover:text-white transition-colors">Velocity</Link>
          <Link href="/demo" className="hover:text-white transition-colors">Automations</Link>
        </nav>

        <div className="flex items-center gap-3">
          <Link
            href="/demo"
            className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs transition-all shadow-md shadow-indigo-600/25"
          >
            Open Workspace <ArrowRight size={14} />
          </Link>
        </div>
      </header>

      {/* Hero Section */}
      <main className="flex-1 flex flex-col items-center justify-center relative px-6 py-20 overflow-hidden text-center">
        {/* Glow Gradients */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[350px] bg-gradient-to-tr from-indigo-600/20 via-purple-600/15 to-cyan-400/20 blur-[120px] rounded-full pointer-events-none" />

        <div className="relative z-10 max-w-4xl space-y-6">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-indigo-500/30 bg-indigo-500/10 text-indigo-300 text-xs font-semibold tracking-wide">
            <Sparkles size={14} /> Multi-Level Project Management for GitHub
          </div>

          <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight text-white leading-tight">
            Manage <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-purple-300 to-cyan-400">Objectives &rarr; Projects &rarr; Epics</span> in GitHub Harmony
          </h1>

          <p className="max-w-2xl mx-auto text-base sm:text-lg text-slate-400 leading-relaxed">
            Eliminate project complexity with multi-level work hierarchies, automated sprint tracking, and KIARO&apos;s decision-aware repository memory.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
            <Link
              href="/demo"
              className="flex items-center gap-2 px-7 py-3 rounded-xl bg-gradient-to-r from-indigo-600 to-cyan-500 text-white font-semibold text-sm hover:opacity-95 transition-all shadow-lg shadow-indigo-500/20"
            >
              Explore Live Hierarchy Demo <ArrowRight size={16} />
            </Link>
            <Link
              href="/connect"
              className="flex items-center gap-2 px-6 py-3 rounded-xl border border-slate-700 bg-slate-900/60 hover:bg-slate-800 text-slate-200 font-semibold text-sm transition-all"
            >
              Connect GitHub Repository
            </Link>
          </div>

          {/* Feature Pillars Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 pt-16 text-left">
            <div className="p-6 rounded-2xl border border-slate-800 bg-slate-900/40 backdrop-blur-sm space-y-3">
              <div className="h-10 w-10 rounded-xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400">
                <Layers size={20} />
              </div>
              <h3 className="font-bold text-white text-base">Multi-Level Hierarchy</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Break high-level Objectives down into Projects, Epics, Tasks, and Sub-tasks with automated progress rollups.
              </p>
            </div>

            <div className="p-6 rounded-2xl border border-slate-800 bg-slate-900/40 backdrop-blur-sm space-y-3">
              <div className="h-10 w-10 rounded-xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center text-cyan-400">
                <BarChart3 size={20} />
              </div>
              <h3 className="font-bold text-white text-base">Sprint Velocity Reports</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Measure team velocity across rolling 2-week sprints with predictability ratings and burndown tracking.
              </p>
            </div>

            <div className="p-6 rounded-2xl border border-slate-800 bg-slate-900/40 backdrop-blur-sm space-y-3">
              <div className="h-10 w-10 rounded-xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-400">
                <Workflow size={20} />
              </div>
              <h3 className="font-bold text-white text-base">Pipeline Automations</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Automate PR movements, synchronize dependencies, and flag architectural contradictions with KIARO intelligence.
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
