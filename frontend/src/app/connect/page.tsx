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
    <div className="flex h-screen items-center justify-center bg-[#f8f9fb] text-[#1e1e2f] font-sans selection:bg-purple-200">
      <div className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-l from-purple-50/50 to-transparent pointer-events-none" />
      
      <div className="z-10 w-full max-w-lg p-8 rounded-2xl border border-gray-200 bg-white shadow-xl">
        <div className="flex justify-center mb-6">
          <div className="h-11 w-11 rounded-xl border border-gray-200 flex items-center justify-center bg-gray-50">
            <GithubIcon size={22} className="text-[#1e1e2f]" />
          </div>
        </div>
        
        <div className="text-center space-y-1.5 mb-8">
          <h1 className="text-xl font-bold tracking-tight text-[#1e1e2f]">Connect Repository</h1>
          <p className="text-gray-500 text-xs">Select a GitHub organization and repository to ingest into KIARO.</p>
        </div>
        
        <div className="space-y-5">
          <div className="space-y-1.5">
            <label className="text-[11px] font-semibold uppercase text-gray-500 tracking-wider">Organization</label>
            <select className="w-full bg-gray-50 border border-gray-200 rounded-xl py-2.5 px-3.5 text-xs text-gray-700 focus:outline-none focus:border-[#321c64] focus:ring-1 focus:ring-purple-200">
              <option>amanmprojects</option>
              <option>acme-corp</option>
            </select>
          </div>
          
          <div className="space-y-1.5">
            <label className="text-[11px] font-semibold uppercase text-gray-500 tracking-wider">Repository</label>
            <select className="w-full bg-gray-50 border border-gray-200 rounded-xl py-2.5 px-3.5 text-xs text-gray-700 focus:outline-none focus:border-[#321c64] focus:ring-1 focus:ring-purple-200">
              <option>kairo</option>
              <option>next-pwa-template</option>
              <option>fastapi-backend</option>
            </select>
          </div>
          
          <div className="p-3.5 rounded-xl bg-purple-50 border border-purple-200 flex gap-3 text-xs">
            <HardDrive className="text-[#321c64] flex-shrink-0 mt-0.5" size={16} />
            <div>
              <span className="block font-medium text-[#321c64] mb-0.5">Ingestion Pipeline</span>
              <span className="text-gray-500 leading-relaxed text-[11px]">KIARO indexes commit graphs, issues, and pull requests to establish historical decisions.</span>
            </div>
          </div>
          
          <Link href="/demo" className="block pt-1">
            <button className="w-full h-11 flex items-center justify-center gap-2 rounded-xl bg-[#321c64] hover:bg-[#25144b] text-white font-medium text-xs transition-all shadow-md shadow-purple-300/25">
              <RefreshCw size={15} />
              Start Ingestion
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
}
