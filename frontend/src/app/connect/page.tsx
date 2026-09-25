import Link from "next/link";
import { HardDrive, RefreshCw } from "lucide-react";

function GithubIcon({ size = 24, className = "" }: { size?: number; className?: string }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="currentColor"
      className={className}
    >
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"
      />
    </svg>
  );
}

export default function Connect() {
  return (
    <div className="flex h-screen items-center justify-center bg-black text-white font-sans">
      <div className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-l from-zinc-900/80 to-transparent pointer-events-none" />
      
      <div className="z-10 w-full max-w-lg p-8 rounded-2xl border border-zinc-800 bg-zinc-950/80 backdrop-blur-xl shadow-2xl">
        <div className="flex justify-center mb-8">
          <div className="h-12 w-12 rounded-full border border-zinc-800 flex items-center justify-center bg-zinc-900">
            <GithubIcon size={24} className="text-white" />
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
