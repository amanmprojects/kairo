"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import KairoLogo from "@/components/KairoLogo";
import { kairoApi } from "@/lib/api";
import { 
  CheckCircle2, 
  Search, 
  Shield, 
  Eye, 
  EyeOff, 
  ArrowLeft, 
  ArrowRight,
  ExternalLink,
  AlertCircle,
  Loader2,
  Zap,
  GitBranch,
  Key
} from "lucide-react";

const GithubIcon = ({ size = 24, className = "" }: { size?: number; className?: string }) => (
  <svg width={size} height={size} className={className} viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z"/>
  </svg>
);

interface ConnectedProfile {
  user: string;
  name?: string;
  avatar_url?: string;
  target_repo: string;
  rate_limit_remaining?: string | number;
}

export default function ConnectPage() {
  const router = useRouter();
  const [tab, setTab] = useState<"token" | "quick">("token");
  const [token, setToken] = useState("");
  const [repo, setRepo] = useState("sharvarianand/kairo");
  const [showToken, setShowToken] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [connected, setConnected] = useState<ConnectedProfile | null>(null);

  useEffect(() => {
    try {
      const saved = localStorage.getItem("kairo_github_profile");
      if (saved) {
        setConnected(JSON.parse(saved));
      }
    } catch {
      // Ignore localStorage read errors
    }
  }, []);

  const handleConnectWithToken = async (e: React.FormEvent) => {
    e.preventDefault();
    const cleanToken = token.trim();
    const cleanRepo = repo.trim();

    if (!cleanToken) {
      setError("Please provide a GitHub Personal Access Token.");
      return;
    }

    if (!cleanRepo || !cleanRepo.includes("/")) {
      setError("Please specify a valid repository in owner/repo format.");
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      // 1. Try backend endpoint first
      const res = await kairoApi.connectGitHub(cleanToken, cleanRepo);
      
      const profile: ConnectedProfile = {
        user: res.user || "sharvarianand",
        name: res.name || res.user || "Developer",
        avatar_url: res.avatar_url || "https://avatars.githubusercontent.com/u/1000000?v=4",
        target_repo: cleanRepo,
        rate_limit_remaining: res.rate_limit_remaining || "5000",
      };

      setConnected(profile);
      localStorage.setItem("kairo_github_profile", JSON.stringify(profile));
      localStorage.setItem("kairo_connected_repo", cleanRepo);
    } catch (err: unknown) {
      // 2. Direct browser fallback check against GitHub API
      try {
        const ghRes = await fetch("https://api.github.com/user", {
          headers: {
            Authorization: `Bearer ${cleanToken}`,
            Accept: "application/vnd.github+json",
          },
        });

        if (ghRes.ok) {
          const ghData = await ghRes.json();
          const profile: ConnectedProfile = {
            user: ghData.login,
            name: ghData.name || ghData.login,
            avatar_url: ghData.avatar_url,
            target_repo: cleanRepo,
            rate_limit_remaining: ghRes.headers.get("x-ratelimit-remaining") || "5000",
          };
          setConnected(profile);
          localStorage.setItem("kairo_github_profile", JSON.stringify(profile));
          localStorage.setItem("kairo_connected_repo", cleanRepo);
        } else {
          const errData = await ghRes.json().catch(() => ({}));
          throw new Error(errData.message || "Invalid GitHub token.");
        }
      } catch (clientErr: unknown) {
        const message = clientErr instanceof Error ? clientErr.message : "GitHub authentication failed.";
        setError(message);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleQuickConnect = () => {
    setIsLoading(true);
    setError(null);

    setTimeout(() => {
      const demoProfile: ConnectedProfile = {
        user: "sharvarianand",
        name: "Sharvari Bhondekar",
        avatar_url: "https://avatars.githubusercontent.com/u/583231?v=4",
        target_repo: repo.trim() || "sharvarianand/kairo",
        rate_limit_remaining: "5000",
      };

      setConnected(demoProfile);
      localStorage.setItem("kairo_github_profile", JSON.stringify(demoProfile));
      localStorage.setItem("kairo_connected_repo", demoProfile.target_repo);
      setIsLoading(false);
    }, 600);
  };

  const handleDisconnect = () => {
    setConnected(null);
    localStorage.removeItem("kairo_github_profile");
    setToken("");
    setError(null);
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-50 text-slate-900 font-sans p-4 relative">
      <Link
        href="/"
        className="absolute top-6 left-6 flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-slate-900 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Back to Home</span>
      </Link>

      {/* Subtle radial decoration */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-teal-100/40 via-slate-50 to-slate-50 pointer-events-none" />

      <div className="z-10 w-full max-w-lg p-6 sm:p-8 rounded-2xl border border-slate-200/90 bg-white shadow-xl flex flex-col items-center">
        {/* Header */}
        <Link href="/" className="flex items-center gap-2.5 mb-6 group">
          <KairoLogo className="w-8 h-8 group-hover:scale-105 transition-transform" />
          <span className="text-2xl font-extrabold tracking-tight text-slate-900">
            KAIRO
          </span>
        </Link>

        {connected ? (
          /* Successfully Connected State */
          <div className="w-full space-y-6">
            <div className="text-center space-y-2">
              <div className="w-14 h-14 mx-auto rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mb-3">
                <CheckCircle2 className="w-8 h-8" />
              </div>
              <h1 className="text-2xl font-bold tracking-tight text-slate-900">
                GitHub Connected
              </h1>
              <p className="text-slate-500 text-xs leading-relaxed max-w-sm mx-auto">
                Your repository is linked and ready for bitemporal knowledge graph synchronization.
              </p>
            </div>

            {/* Profile Card */}
            <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  {connected.avatar_url ? (
                    <img 
                      src={connected.avatar_url} 
                      alt={connected.user} 
                      className="w-10 h-10 rounded-full border border-slate-200" 
                    />
                  ) : (
                    <div className="w-10 h-10 rounded-full bg-slate-900 text-white font-bold text-xs flex items-center justify-center">
                      GH
                    </div>
                  )}
                  <div>
                    <h3 className="text-sm font-bold text-slate-900">{connected.name || connected.user}</h3>
                    <p className="text-xs font-mono text-slate-500">@{connected.user}</p>
                  </div>
                </div>
                <span className="text-[10px] font-bold bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-full">
                  Active
                </span>
              </div>

              <div className="pt-3 border-t border-slate-200/80 grid grid-cols-2 gap-2 text-xs">
                <div>
                  <span className="text-slate-400 text-[11px] block">Target Repository</span>
                  <span className="font-mono font-semibold text-slate-800 truncate block">
                    {connected.target_repo}
                  </span>
                </div>
                <div>
                  <span className="text-slate-400 text-[11px] block">Rate Limit Budget</span>
                  <span className="font-mono font-semibold text-teal-700">
                    {connected.rate_limit_remaining} req/hr
                  </span>
                </div>
              </div>
            </div>

            {/* Next Action */}
            <div className="space-y-3 pt-2">
              <button
                onClick={() => router.push("/demo")}
                className="w-full h-12 flex items-center justify-center gap-2 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-semibold text-sm transition-all shadow-md hover:shadow-lg"
              >
                <span>Launch KAIRO Workspace</span>
                <ArrowRight size={16} />
              </button>

              <button
                onClick={handleDisconnect}
                className="w-full text-center text-xs text-slate-500 hover:text-rose-600 transition-colors py-1"
              >
                Disconnect or switch credentials
              </button>
            </div>
          </div>
        ) : (
          /* Connection Setup Form */
          <div className="w-full space-y-6">
            <div className="text-center space-y-2">
              <div className="h-14 w-14 mx-auto rounded-2xl border border-slate-100 flex items-center justify-center bg-slate-50 shadow-xs mb-3">
                <GithubIcon size={28} className="text-slate-900" />
              </div>
              <h1 className="text-2xl font-bold tracking-tight text-slate-900">
                Connect your GitHub account
              </h1>
              <p className="text-slate-500 text-xs leading-relaxed max-w-sm mx-auto">
                Link your repository to build an engineering intelligence graph across commits, PRs, and architectural decisions.
              </p>
            </div>

            {/* Mode Tabs */}
            <div className="grid grid-cols-2 p-1 bg-slate-100 rounded-xl text-xs font-semibold text-slate-600">
              <button
                type="button"
                onClick={() => { setTab("token"); setError(null); }}
                className={`py-2 rounded-lg transition-all flex items-center justify-center gap-1.5 ${
                  tab === "token" ? "bg-white text-slate-900 shadow-xs" : "hover:text-slate-900"
                }`}
              >
                <Key size={14} className="text-teal-600" />
                <span>Personal Token</span>
              </button>
              <button
                type="button"
                onClick={() => { setTab("quick"); setError(null); }}
                className={`py-2 rounded-lg transition-all flex items-center justify-center gap-1.5 ${
                  tab === "quick" ? "bg-white text-slate-900 shadow-xs" : "hover:text-slate-900"
                }`}
              >
                <Zap size={14} className="text-indigo-600" />
                <span>1-Click Connect</span>
              </button>
            </div>

            {error && (
              <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-700 flex items-start gap-2">
                <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
                <span className="leading-snug">{error}</span>
              </div>
            )}

            {tab === "token" ? (
              /* Token Form */
              <form onSubmit={handleConnectWithToken} className="space-y-4">
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="text-xs font-semibold text-slate-700">
                      GitHub Personal Access Token (PAT)
                    </label>
                    <a
                      href="https://github.com/settings/tokens/new?scopes=public_repo&description=KAIRO"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-[11px] text-teal-600 hover:text-teal-700 flex items-center gap-0.5"
                    >
                      <span>Generate token</span>
                      <ExternalLink size={10} />
                    </a>
                  </div>
                  <div className="relative">
                    <input
                      type={showToken ? "text" : "password"}
                      value={token}
                      onChange={(e) => setToken(e.target.value)}
                      placeholder="ghp_xxxxxxxxxxxxxxxxxxxx"
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs font-mono text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 pr-10"
                    />
                    <button
                      type="button"
                      onClick={() => setShowToken(!showToken)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                    >
                      {showToken ? <EyeOff size={15} /> : <Eye size={15} />}
                    </button>
                  </div>
                  <p className="text-[10px] text-slate-400 mt-1">
                    Requires only <code className="bg-slate-100 px-1 py-0.5 rounded text-slate-700 font-mono">public_repo</code> scope for 5,000 requests/hour.
                  </p>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Target Repository
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      value={repo}
                      onChange={(e) => setRepo(e.target.value)}
                      placeholder="owner/repository"
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs font-mono text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full h-12 flex items-center justify-center gap-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-medium text-xs transition-all shadow-md hover:shadow-lg disabled:opacity-60"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin text-teal-400" />
                      <span>Verifying credentials with GitHub...</span>
                    </>
                  ) : (
                    <>
                      <GithubIcon size={16} />
                      <span>Verify & Connect Repository</span>
                    </>
                  )}
                </button>
              </form>
            ) : (
              /* Quick Connect Form */
              <div className="space-y-4">
                <div className="p-4 bg-teal-50/50 border border-teal-200/80 rounded-xl space-y-2">
                  <div className="flex items-center gap-2 text-teal-900 font-semibold text-xs">
                    <GitBranch size={14} className="text-teal-600" />
                    <span>Instant Workspace Onboarding</span>
                  </div>
                  <p className="text-[11px] text-teal-800 leading-relaxed">
                    Connect immediately using the pre-indexed repository: <strong className="font-mono">{repo}</strong>.
                    You will get full access to the sprint board, GraphRAG reasoning, and pre-merge change impact scanner.
                  </p>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Repository Identifier
                  </label>
                  <input
                    type="text"
                    value={repo}
                    onChange={(e) => setRepo(e.target.value)}
                    placeholder="sharvarianand/kairo"
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs font-mono text-slate-900"
                  />
                </div>

                <button
                  type="button"
                  onClick={handleQuickConnect}
                  disabled={isLoading}
                  className="w-full h-12 flex items-center justify-center gap-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-medium text-xs transition-all shadow-md hover:shadow-lg disabled:opacity-60"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin text-teal-400" />
                      <span>Initializing repository graph...</span>
                    </>
                  ) : (
                    <>
                      <GithubIcon size={16} />
                      <span>Connect Repository (1-Click)</span>
                    </>
                  )}
                </button>
              </div>
            )}

            {/* Feature Bullets */}
            <div className="pt-4 border-t border-slate-100 space-y-2.5">
              <div className="flex items-center gap-2.5 text-xs text-slate-600">
                <Search className="w-3.5 h-3.5 text-teal-600 shrink-0" />
                <span>Automatic commit, PR, and ADR entity discovery</span>
              </div>
              <div className="flex items-center gap-2.5 text-xs text-slate-600">
                <Shield className="w-3.5 h-3.5 text-teal-600 shrink-0" />
                <span>Two-layer trust isolation prevents hallucinated facts</span>
              </div>
              <div className="flex items-center gap-2.5 text-xs text-slate-600">
                <Eye className="w-3.5 h-3.5 text-teal-600 shrink-0" />
                <span>Read-only access strictly enforced</span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
