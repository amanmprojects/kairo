import Link from "next/link";

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen bg-black text-zinc-50 font-sans selection:bg-teal-500/30">
      <main className="flex-1 flex flex-col items-center justify-center relative overflow-hidden px-6 py-24">
        {/* Abstract Background Elements */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] opacity-30 pointer-events-none">
          <div className="absolute inset-0 bg-gradient-to-r from-teal-500 to-emerald-500 blur-[100px] rounded-full" />
        </div>
        
        <div className="z-10 flex flex-col items-center text-center max-w-4xl space-y-8 animate-in fade-in slide-in-from-bottom-8 duration-1000">
          <div className="inline-flex items-center px-3 py-1 rounded-full border border-teal-500/30 bg-teal-500/10 text-teal-300 text-sm font-medium tracking-wide">
            <span className="flex h-2 w-2 rounded-full bg-teal-400 mr-2 animate-pulse"></span>
            Decision-aware engineering workspace
          </div>
          
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-transparent bg-clip-text bg-gradient-to-b from-white to-zinc-400 pb-2 leading-tight">
            KIARO: A Temporal Knowledge Graph Based Engineering Intelligence Platform <br className="hidden md:block" /> for Software Project Reasoning
          </h1>
          
          <p className="max-w-3xl text-xl leading-relaxed text-zinc-400">
            KIARO connects project delivery with the historical reasoning behind your codebase.
            Track work, scan PR impacts, and explore an evidence-backed repository memory.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 pt-8">
            <Link
              href="/connect"
              className="group flex h-12 items-center justify-center gap-2 rounded-full bg-white px-8 font-medium text-black transition-all hover:bg-zinc-200 hover:scale-105"
            >
              Connect with GitHub
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="transition-transform group-hover:translate-x-1"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>
            </Link>
            <Link
              href="/demo"
              className="flex h-12 items-center justify-center rounded-full border border-zinc-700 bg-zinc-900/50 backdrop-blur-sm px-8 font-medium text-white transition-all hover:bg-zinc-800 hover:border-zinc-600"
            >
              View Demo Workspace
            </Link>
          </div>
        </div>
        
        {/* Feature Highlights */}
        <div className="z-10 grid grid-cols-1 md:grid-cols-3 gap-8 mt-32 max-w-5xl w-full">
          {[
            {
              title: "What are we building?",
              description: "Planning, boards, sprints, and roadmaps seamlessly integrated with GitHub."
            },
            {
              title: "Why is the code this way?",
              description: "Ask KIARO anything. Get evidence-backed repository answers with timeline citations."
            },
            {
              title: "What happens if we change it?",
              description: "Pre-merge impact scans detecting decision conflicts, historical bugs, and fragile files."
            }
          ].map((feature, i) => (
            <div key={i} className="p-6 rounded-2xl border border-zinc-800 bg-zinc-900/40 backdrop-blur-sm hover:border-zinc-700 transition-colors">
              <h3 className="text-lg font-semibold text-white mb-2">{feature.title}</h3>
              <p className="text-zinc-400 leading-relaxed">{feature.description}</p>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}
