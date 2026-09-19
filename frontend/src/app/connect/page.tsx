import Link from "next/link";
import { Github, HardDrive, RefreshCw } from "lucide-react";

export default function Connect() {
  return (
    <div className="flex h-screen items-center justify-center bg-black text-white font-sans">
      <div className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-l from-zinc-900/80 to-transparent pointer-events-none" />
      
      <div className="z-10 w-full max-w-lg p-8 rounded-2xl border border-zinc-800 bg-zinc-950/80 backdrop-blur-xl shadow-2xl">
        <div className="flex justify-center mb-8">
          <div className="h-12 w-12 rounded-full border border-zinc-800 flex items-center justify-center bg-zinc-900">
            <Github size={24} className="text-white" />
          </div>
        </div>
        
        <div className="text-center space-y-2 mb-10">
          <h1 className="text-2xl font-bold tracking-tight">Connect Repository</h1>
          <p className="text-zinc-400 text-sm">Select an organization and repository for KIARO to analyze.</p>
        </div>
        
        <div className="space-y-6">
          <div className="space-y-2">
            <label className="text-xs font-semibold uppercase text-zinc-500 tracking-wider">Organization</label>
            <select className="w-full bg-zinc-900 border border-zinc-800 rounded-lg py-3 px-4 text-white appearance-none focus:outline-none focus:border-teal-500">
              <option>amanmprojects</option>
              <option>acme-corp</option>
            </select>
          </div>
          
          <div className="space-y-2">
            <label className="text-xs font-semibold uppercase text-zinc-500 tracking-wider">Repository</label>
            <select className="w-full bg-zinc-900 border border-zinc-800 rounded-lg py-3 px-4 text-white appearance-none focus:outline-none focus:border-teal-500">
              <option>kairo</option>
              <option>next-pwa-template</option>
              <option>fastapi-backend</option>
            </select>
          </div>
          
          <div className="p-4 rounded-lg bg-teal-500/10 border border-teal-500/30 flex gap-4">
            <HardDrive className="text-teal-400 flex-shrink-0" size={20} />
            <div className="text-sm">
              <span className="block font-medium text-teal-400 mb-1">Ingestion Process</span>
              <span className="text-teal-400/80">KIARO will securely index commits, PRs, issues, and discussions. This may take a few minutes.</span>
            </div>
          </div>
          
          <Link href="/demo" className="block">
            <button className="w-full h-12 flex items-center justify-center gap-2 rounded-lg bg-white text-black font-semibold transition-all hover:bg-zinc-200 hover:scale-[1.02]">
              <RefreshCw size={18} />
              Start Ingestion
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
}
