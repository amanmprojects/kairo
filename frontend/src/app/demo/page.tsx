import Link from "next/link";
import { Activity, GitMerge, GitPullRequest, Search, ShieldAlert, Zap } from "lucide-react";
import Tour from "./Tour";

export default function DemoWorkspace() {
  return (
    <div className="flex h-screen bg-black text-white font-sans">
      <Tour />
      {/* Sidebar */}
      <aside className="w-64 border-r border-zinc-800 bg-zinc-950 flex flex-col">
        <div className="h-16 flex items-center px-6 border-b border-zinc-800">
          <span className="flex h-2 w-2 rounded-full bg-teal-400 mr-3 animate-pulse"></span>
          <span className="font-bold tracking-wider">KIARO</span>
        </div>
        <nav className="flex-1 px-4 py-6 space-y-2">
          {[
            { name: "Overview", icon: Activity, active: true },
            { name: "Board", icon: GitPullRequest },
            { name: "Ask KAIRO", icon: Search },
            { name: "Codebase X-Ray", icon: Zap },
            { name: "Impact Scan", icon: ShieldAlert },
          ].map((item) => (
            <Link
              key={item.name}
              href="#"
              className={`flex items-center gap-3 px-3 py-2 rounded-md transition-colors ${
                item.active ? "bg-teal-500/10 text-teal-400" : "text-zinc-400 hover:text-white hover:bg-zinc-900"
              }`}
            >
              <item.icon size={18} />
              <span className="text-sm font-medium">{item.name}</span>
            </Link>
          ))}
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <header className="h-16 flex items-center justify-between px-8 border-b border-zinc-800 bg-zinc-950/50 backdrop-blur-md">
          <div className="flex items-center gap-2">
            <span className="text-zinc-400 text-sm">amanmprojects / </span>
            <span className="font-semibold">kairo</span>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 text-sm text-zinc-400">
              <span className="h-2 w-2 rounded-full bg-emerald-500"></span>
              Readiness: 85%
            </div>
            <div className="h-8 w-8 rounded-full bg-gradient-to-tr from-teal-500 to-emerald-500"></div>
          </div>
        </header>

        {/* Dashboard */}
        <div className="flex-1 overflow-auto p-8">
          <div className="max-w-6xl mx-auto space-y-8">
            <h1 className="text-3xl font-bold">Workspace Overview</h1>
            
            {/* Top Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 tour-overview">
              {[
                { label: "Active Sprint", value: "Sprint 42", sub: "Ends in 3 days" },
                { label: "Decision Drift (DDI)", value: "72/100", sub: "Elevated risk in auth", alert: true },
                { label: "Eng. Evolution (EES)", value: "85", sub: "Stable delivery" },
                { label: "Open PRs", value: "14", sub: "3 require impact review" },
              ].map((m, i) => (
                <div key={i} className="p-5 rounded-xl border border-zinc-800 bg-zinc-900/50">
                  <div className="text-sm text-zinc-400 mb-2">{m.label}</div>
                  <div className={`text-3xl font-bold ${m.alert ? "text-amber-400" : ""}`}>{m.value}</div>
                  <div className="text-xs text-zinc-500 mt-2">{m.sub}</div>
                </div>
              ))}
            </div>

            {/* Main Area: Board Preview & Recent Decisions */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Kanban Preview */}
              <div className="col-span-2 space-y-4 tour-board">
                <h2 className="text-xl font-semibold flex items-center justify-between">
                  Board 
                  <span className="text-sm text-teal-400 hover:underline cursor-pointer">View Full Board</span>
                </h2>
                <div className="grid grid-cols-3 gap-4">
                  {["To Do", "In Progress", "In Review"].map((col) => (
                    <div key={col} className="rounded-lg bg-zinc-900 border border-zinc-800 p-3 min-h-[300px]">
                      <h3 className="text-sm font-medium text-zinc-400 mb-3">{col}</h3>
                      {col === "In Progress" && (
                        <div className="bg-zinc-800/50 border border-zinc-700 p-3 rounded-md space-y-2 hover:border-zinc-500 cursor-pointer transition-colors tour-pr">
                          <div className="flex items-center gap-2">
                            <GitMerge size={14} className="text-amber-400" />
                            <span className="text-xs font-mono text-zinc-400">PR-142</span>
                          </div>
                          <p className="text-sm">Refactor authentication middleware to use JWT</p>
                          <div className="flex justify-between items-center pt-2">
                            <span className="text-[10px] uppercase bg-amber-500/20 text-amber-400 px-2 py-0.5 rounded-full">High Impact</span>
                            <div className="h-5 w-5 rounded-full bg-zinc-600"></div>
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Recent Decisions & Activity */}
              <div className="space-y-6">
                <div className="tour-decisions">
                  <h2 className="text-xl font-semibold mb-4">Recent Decisions</h2>
                  <div className="space-y-3">
                    {[
                      { text: "Adopt JWT over sessions", date: "2 days ago", risk: true },
                      { text: "Use Postgres for vector store", date: "Last week" },
                      { text: "Deprecate Redis cache", date: "2 weeks ago" },
                    ].map((d, i) => (
                      <div key={i} className="p-3 rounded-lg border border-zinc-800 bg-zinc-900/30 flex justify-between items-start">
                        <div>
                          <p className="text-sm text-zinc-200">{d.text}</p>
                          <p className="text-xs text-zinc-500 mt-1">{d.date}</p>
                        </div>
                        {d.risk && <ShieldAlert size={16} className="text-amber-400" />}
                      </div>
                    ))}
                  </div>
                </div>

                <div className="p-5 rounded-xl border border-teal-500/30 bg-teal-500/5 tour-ask">
                  <div className="flex items-center gap-2 mb-2">
                    <Search size={18} className="text-teal-400" />
                    <h3 className="font-medium text-teal-400">Ask KIARO</h3>
                  </div>
                  <p className="text-sm text-zinc-400 mb-4">Query the engineering memory graph directly.</p>
                  <div className="relative">
                    <input 
                      type="text" 
                      placeholder="Why is auth modified so often?" 
                      className="w-full bg-black border border-zinc-700 rounded-full py-2 px-4 text-sm text-white focus:outline-none focus:border-teal-500"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
