"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Activity,
  AlertTriangle,
  ArrowRight,
  BarChart3,
  Boxes,
  Calendar,
  Check,
  CheckCircle2,
  ChevronDown,
  ChevronRight,
  Clock,
  CornerDownRight,
  Eye,
  FileCode2,
  Filter,
  FolderKanban,
  Gauge,
  GitBranch,
  GitCommit,
  GitFork,
  GitMerge,
  GitPullRequest,
  Info,
  Layers,
  Link2,
  Lock,
  PieChart,
  Play,
  Plus,
  RefreshCw,
  Search,
  ShieldAlert,
  Sparkles,
  Tag,
  Target,
  Timer,
  TrendingUp,
  User,
  Users,
  Workflow,
  X,
  Zap,
} from "lucide-react";
import Tour from "./Tour";

type TabType =
  | "hierarchy"
  | "board"
  | "velocity"
  | "poker"
  | "releases"
  | "dependencies"
  | "automations"
  | "impact"
  | "ask";

interface HierarchyNode {
  id: string;
  title: string;
  type: "objective" | "project" | "epic" | "issue" | "bug" | "subtask";
  points: number;
  completedPoints: number;
  status: "In Progress" | "Completed" | "Planning";
  repo?: string;
  assignee?: string;
  children?: HierarchyNode[];
}

interface BoardCard {
  id: string;
  title: string;
  repo: string;
  type: "issue" | "pr" | "bug";
  column: "New Issues" | "Product Backlog" | "Sprint Backlog" | "In Progress" | "In Review" | "Done";
  points: number;
  epic?: string;
  priority: "Low" | "Medium" | "High" | "Urgent";
  assignee: string;
  avatarBg: string;
  blockedBy?: string;
  blocks?: string;
  impactRisk?: "Low" | "Moderate" | "High";
  description?: string;
}

interface Release {
  id: string;
  tag: string;
  title: string;
  targetDate: string;
  totalPoints: number;
  completedPoints: number;
  scopeAddedPoints: number;
  status: "On Track" | "At Risk" | "Released";
  repos: string[];
}

const INITIAL_HIERARCHY: HierarchyNode[] = [
  {
    id: "OBJ-2026-Q3",
    title: "Enterprise Reliability & Knowledge Automation",
    type: "objective",
    points: 84,
    completedPoints: 58,
    status: "In Progress",
    children: [
      {
        id: "PROJ-1",
        title: "Stateless Security & Identity Migration",
        type: "project",
        points: 32,
        completedPoints: 24,
        status: "In Progress",
        children: [
          {
            id: "EPIC-101",
            title: "Auth Modernization & Stateless Tokens",
            type: "epic",
            points: 24,
            completedPoints: 16,
            status: "In Progress",
            repo: "kairo/auth",
            children: [
              {
                id: "PR-142",
                title: "Refactor authentication middleware to use stateless JWTs",
                type: "issue",
                points: 8,
                completedPoints: 0,
                status: "In Progress",
                repo: "kairo/auth",
                assignee: "aman",
                children: [
                  {
                    id: "SUB-142-1",
                    title: "Implement RSA-256 public key verification cache",
                    type: "subtask",
                    points: 3,
                    completedPoints: 3,
                    status: "Completed",
                  },
                  {
                    id: "SUB-142-2",
                    title: "Benchmark cold-start overhead under 100 RPS load",
                    type: "subtask",
                    points: 5,
                    completedPoints: 0,
                    status: "In Progress",
                  },
                ],
              },
              {
                id: "ISSUE-388",
                title: "Session token validation causes high latency on cold starts",
                type: "bug",
                points: 3,
                completedPoints: 3,
                status: "Completed",
                repo: "kairo/auth",
                assignee: "alex",
              },
            ],
          },
        ],
      },
      {
        id: "PROJ-2",
        title: "Bitemporal Knowledge Graph Engine",
        type: "project",
        points: 52,
        completedPoints: 34,
        status: "In Progress",
        children: [
          {
            id: "EPIC-102",
            title: "Knowledge Graph Temporal Engine v2",
            type: "epic",
            points: 42,
            completedPoints: 28,
            status: "In Progress",
            repo: "kairo/core",
            children: [
              {
                id: "PR-147",
                title: "Implement temporal validity interval clipping on superseded edges",
                type: "issue",
                points: 5,
                completedPoints: 5,
                status: "Completed",
                repo: "kairo/core",
                assignee: "sharvari",
              },
              {
                id: "ISSUE-402",
                title: "Define pgvector similarity threshold parameters for chunk ranking",
                type: "issue",
                points: 5,
                completedPoints: 0,
                status: "In Progress",
                repo: "kairo/core",
                assignee: "sarah",
              },
            ],
          },
        ],
      },
    ],
  },
];

const INITIAL_CARDS: BoardCard[] = [
  {
    id: "ISSUE-388",
    title: "Session token validation causes high latency on cold starts",
    repo: "kairo/auth",
    type: "bug",
    column: "New Issues",
    points: 3,
    epic: "Auth Modernization",
    priority: "Medium",
    assignee: "alex",
    avatarBg: "bg-blue-600",
    description: "Database-backed sessions add 48ms overhead on initial lambda invocation.",
  },
  {
    id: "ISSUE-402",
    title: "Define pgvector similarity threshold parameters for chunk ranking",
    repo: "kairo/core",
    type: "issue",
    column: "Product Backlog",
    points: 5,
    epic: "Graph Engine v2",
    priority: "High",
    assignee: "sarah",
    avatarBg: "bg-purple-600",
    blockedBy: "PR-147",
    description: "Establish cosine distance thresholds to filter spurious semantic matches.",
  },
  {
    id: "ISSUE-419",
    title: "Automate burndown velocity calculations across cross-repo epics",
    repo: "kairo/frontend",
    type: "issue",
    column: "Sprint Backlog",
    points: 5,
    epic: "Multi-Level Agile Sync",
    priority: "Medium",
    assignee: "aman",
    avatarBg: "bg-teal-600",
    description: "Multi-repo weighted averages for accurate cross-project capacity planning.",
  },
  {
    id: "PR-142",
    title: "Refactor authentication middleware to use stateless JWTs",
    repo: "kairo/auth",
    type: "pr",
    column: "In Progress",
    points: 8,
    epic: "Auth Modernization",
    priority: "Urgent",
    assignee: "aman",
    avatarBg: "bg-teal-600",
    impactRisk: "High",
    blocks: "ISSUE-402",
    description: "Alters applications.py authentication handlers to verify asymmetric tokens.",
  },
  {
    id: "PR-147",
    title: "Implement temporal validity interval clipping on superseded edges",
    repo: "kairo/core",
    type: "pr",
    column: "In Review",
    points: 5,
    epic: "Graph Engine v2",
    priority: "High",
    assignee: "sharvari",
    avatarBg: "bg-emerald-600",
    impactRisk: "Moderate",
    description: "Closes valid_to timestamps when a newer architectural decision is recorded.",
  },
  {
    id: "ISSUE-310",
    title: "Migrate legacy CI GitHub actions to unified test matrix",
    repo: "fastapi/fastapi",
    type: "issue",
    column: "Done",
    points: 2,
    epic: "Developer Experience",
    priority: "Low",
    assignee: "alex",
    avatarBg: "bg-blue-600",
    description: "Unified matrix for Python 3.11 and 3.12 runners with cached dependencies.",
  },
  {
    id: "ISSUE-426",
    title: "Multi-repo automated release planning poker estimator",
    repo: "kairo/frontend",
    type: "issue",
    column: "Sprint Backlog",
    points: 3,
    epic: "Multi-Level Agile Sync",
    priority: "Medium",
    assignee: "sharvari",
    avatarBg: "bg-emerald-600",
    description: "Real-time team consensus voting room with instant story-point sync.",
  },
];

const INITIAL_RELEASES: Release[] = [
  {
    id: "REL-200",
    tag: "v2.0.0-rc1",
    title: "Enterprise Intelligence & Temporal Graph",
    targetDate: "Oct 28, 2026",
    totalPoints: 68,
    completedPoints: 47,
    scopeAddedPoints: 4,
    status: "On Track",
    repos: ["kairo/core", "kairo/auth", "kairo/frontend"],
  },
  {
    id: "REL-190",
    tag: "v1.9.0",
    title: "Multi-Repo Agile Stabilization",
    targetDate: "Sep 30, 2026",
    totalPoints: 34,
    completedPoints: 31,
    scopeAddedPoints: 2,
    status: "On Track",
    repos: ["kairo/frontend", "fastapi/fastapi"],
  },
];

const COLUMNS = [
  "New Issues",
  "Product Backlog",
  "Sprint Backlog",
  "In Progress",
  "In Review",
  "Done",
] as const;

export default function DemoWorkspace() {
  const [activeTab, setActiveTab] = useState<TabType>("hierarchy");
  const [cards, setCards] = useState<BoardCard[]>(INITIAL_CARDS);
  const [releases, setReleases] = useState<Release[]>(INITIAL_RELEASES);
  const [selectedCardForDrawer, setSelectedCardForDrawer] = useState<BoardCard | null>(null);

  // Filter States
  const [selectedRepoFilter, setSelectedRepoFilter] = useState("All Repos");
  const [selectedPriorityFilter, setSelectedPriorityFilter] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");

  // Hierarchy Expansion State
  const [expandedNodes, setExpandedNodes] = useState<Record<string, boolean>>({
    "OBJ-2026-Q3": true,
    "PROJ-1": true,
    "EPIC-101": true,
    "PR-142": true,
    "PROJ-2": true,
    "EPIC-102": true,
  });

  // Planning Poker State
  const [selectedPokerIssue, setSelectedPokerIssue] = useState<string>("ISSUE-426");
  const [selectedPokerPoint, setSelectedPokerPoint] = useState<number | null>(5);
  const [pokerRevealed, setPokerRevealed] = useState(false);
  const [pokerAppliedSuccess, setPokerAppliedSuccess] = useState(false);

  // Workflow Automations State
  const [rules, setRules] = useState([
    {
      id: 1,
      title: "Auto-close on PR Merge",
      trigger: "When a Pull Request is merged into default branch",
      action: "Automatically move all linked GitHub issues to 'Done'",
      enabled: true,
    },
    {
      id: 2,
      title: "In Review Stage Transition",
      trigger: "When a PR review is requested or opened",
      action: "Move card to 'In Review' and assign configured code owners",
      enabled: true,
    },
    {
      id: 3,
      title: "Blocker Flagging",
      trigger: "When an issue dependency is declared unfinished",
      action: "Flag card with visual 🔒 Blocked badge and alert sprint channel",
      enabled: true,
    },
    {
      id: 4,
      title: "Rollup Progress Calculation",
      trigger: "When any Sub-task or Task changes status",
      action: "Auto-recalculate parent Epic, Project, and Objective completion %",
      enabled: true,
    },
    {
      id: 5,
      title: "WIP Limit Alert",
      trigger: "When 'In Progress' exceeds column limit (3 cards)",
      action: "Highlight column in amber warning and throttle new dispatches",
      enabled: true,
    },
  ]);

  // Chat State
  const [chatInput, setChatInput] = useState("");
  const [chatHistory, setChatHistory] = useState([
    {
      role: "assistant",
      text: "Hello Shruti! I am KIARO. Ask me anything about multi-level project hierarchies, sprint velocity burndown, releases, or PR architectural contradictions.",
      citations: [] as string[],
    },
  ]);

  const toggleNode = (id: string) => {
    setExpandedNodes((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const expandAllNodes = () => {
    setExpandedNodes({
      "OBJ-2026-Q3": true,
      "PROJ-1": true,
      "EPIC-101": true,
      "PR-142": true,
      "PROJ-2": true,
      "EPIC-102": true,
      "PR-147": true,
      "ISSUE-402": true,
    });
  };

  const collapseAllNodes = () => {
    setExpandedNodes({});
  };

  const moveCard = (id: string, direction: "next" | "prev") => {
    setCards((prev) =>
      prev.map((c) => {
        if (c.id !== id) return c;
        const currentIndex = COLUMNS.indexOf(c.column);
        const nextIndex =
          direction === "next"
            ? Math.min(COLUMNS.length - 1, currentIndex + 1)
            : Math.max(0, currentIndex - 1);
        return { ...c, column: COLUMNS[nextIndex] };
      })
    );
  };

  const applyConsensusEstimate = () => {
    if (selectedPokerPoint === null) return;
    setCards((prev) =>
      prev.map((c) => (c.id === selectedPokerIssue ? { ...c, points: selectedPokerPoint } : c))
    );
    setPokerAppliedSuccess(true);
    setTimeout(() => setPokerAppliedSuccess(false), 3000);
  };

  const toggleRule = (id: number) => {
    setRules((prev) => prev.map((r) => (r.id === id ? { ...r, enabled: !r.enabled } : r)));
  };

  const filteredCards = cards.filter((c) => {
    const matchesRepo = selectedRepoFilter === "All Repos" || c.repo === selectedRepoFilter;
    const matchesPriority = selectedPriorityFilter === "All" || c.priority === selectedPriorityFilter;
    const matchesSearch =
      searchQuery === "" ||
      c.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.repo.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesRepo && matchesPriority && matchesSearch;
  });

  const handleAskQuestion = (questionText?: string) => {
    const q = questionText || chatInput;
    if (!q.trim()) return;

    const userMessage = { role: "user", text: q, citations: [] };
    let aiResponse = {
      role: "assistant",
      text: "Querying repository temporal knowledge graph...",
      citations: [] as string[],
    };

    if (q.toLowerCase().includes("hierarchy") || q.toLowerCase().includes("objective")) {
      aiResponse = {
        role: "assistant",
        text: "Objective 'Enterprise Reliability & Knowledge Automation' (OBJ-2026-Q3) is 69% complete (58/84 pts). Its child project 'Stateless Security' has 1 active PR (#142) requiring impact review.",
        citations: ["Work Hierarchy Tree: 2 Projects, 4 Epics", "Rollup status: 58/84 points delivered"],
      };
    } else if (q.toLowerCase().includes("velocity") || q.toLowerCase().includes("points")) {
      aiResponse = {
        role: "assistant",
        text: "The team's average velocity is 23 story points per 2-week rolling sprint, with a 91% predictability rate across 4 connected GitHub repositories.",
        citations: ["Velocity Ledger: Sprints 39-42", "Average: 23 story points"],
      };
    } else if (q.toLowerCase().includes("block") || q.toLowerCase().includes("dependency")) {
      aiResponse = {
        role: "assistant",
        text: "Active Blocker: ISSUE-402 ('Define pgvector similarity threshold') is blocked by PR-147 ('Implement temporal validity clipping'). PR-147 is currently In Review awaiting approval.",
        citations: ["Dependency Graph: PR-147 ──blocks──> ISSUE-402", "Repo: kairo/core"],
      };
    } else if (q.toLowerCase().includes("release") || q.toLowerCase().includes("milestone")) {
      aiResponse = {
        role: "assistant",
        text: "Release v2.0.0-rc1 is currently On Track at 69% completion (47/68 pts). Scope added after freeze is minimal (+4 pts). Target release date is Oct 28, 2026.",
        citations: ["Releases Hub: REL-200", "Multi-repo scope: core, auth, frontend"],
      };
    } else {
      aiResponse = {
        role: "assistant",
        text: `Graph traversal complete for "${q}". Found 14 related nodes across 3 PRs and 5 issues with zero breaking architectural contradictions.`,
        citations: ["Deterministic Layer: 14 connected edges", "Interpreted Layer: 0 active conflicts"],
      };
    }

    setChatHistory((prev) => [...prev, userMessage, aiResponse]);
    setChatInput("");
  };

  const inProgressCount = filteredCards.filter((c) => c.column === "In Progress").length;

  return (
    <div className="flex h-screen bg-[#0B0F17] text-slate-100 font-sans selection:bg-indigo-500/30 overflow-hidden">
      <Tour />

      {/* Left Navigation Sidebar */}
      <aside className="w-64 border-r border-slate-800/80 bg-[#070A0F] flex flex-col shrink-0">
        <div className="h-16 flex items-center px-5 border-b border-slate-800/80 justify-between">
          <div className="flex items-center gap-2.5">
            <div className="h-8 w-8 rounded-lg bg-gradient-to-tr from-indigo-500 via-purple-500 to-cyan-400 flex items-center justify-center text-black font-extrabold text-sm shadow-lg shadow-indigo-500/20">
              K
            </div>
            <div>
              <div className="font-extrabold tracking-tight text-sm text-white">
                KIARO <span className="text-indigo-400 text-xs font-semibold">| Shruti</span>
              </div>
              <div className="text-[10px] text-slate-400">Multi-Level Agile Platform</div>
            </div>
          </div>
          <span className="text-[9px] font-bold uppercase tracking-wider bg-indigo-500/10 text-indigo-400 border border-indigo-500/30 px-2 py-0.5 rounded-full">
            v2.2
          </span>
        </div>

        {/* Navigation Tabs */}
        <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
          <div className="px-3 pb-2 text-[10px] font-bold uppercase tracking-wider text-slate-500">
            Work Hierarchy &amp; Agile Suite
          </div>
          {[
            { id: "hierarchy", name: "Work Hierarchy", icon: Target, badge: "5-Tier" },
            { id: "board", name: "Multi-Repo Board", icon: FolderKanban, badge: `${cards.length}` },
            { id: "velocity", name: "Sprint & Velocity", icon: BarChart3, badge: "23 pts" },
            { id: "poker", name: "Planning Poker", icon: Zap, badge: "Live" },
            { id: "releases", name: "Releases & Milestones", icon: Boxes, badge: "v2.0" },
            { id: "dependencies", name: "Dependencies & Blockers", icon: Link2, badge: "2" },
            { id: "automations", name: "Workflow Rules", icon: Workflow, badge: "5" },
          ].map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id as TabType)}
              className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs font-semibold transition-all ${
                activeTab === item.id
                  ? "bg-gradient-to-r from-indigo-600/20 to-cyan-500/10 text-white border border-indigo-500/30 shadow-sm"
                  : "text-slate-400 hover:text-white hover:bg-slate-900/60"
              }`}
            >
              <div className="flex items-center gap-2.5">
                <item.icon size={16} className={activeTab === item.id ? "text-indigo-400" : "text-slate-500"} />
                <span>{item.name}</span>
              </div>
              {item.badge && (
                <span className="text-[10px] bg-slate-800/80 px-2 py-0.5 rounded-full text-slate-300 font-mono">
                  {item.badge}
                </span>
              )}
            </button>
          ))}

          <div className="pt-5 px-3 pb-2 text-[10px] font-bold uppercase tracking-wider text-slate-500">
            Engineering Intelligence
          </div>
          {[
            { id: "impact", name: "PR Impact & Drift", icon: ShieldAlert, alert: true },
            { id: "ask", name: "Ask KIARO AI", icon: Search },
          ].map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id as TabType)}
              className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs font-semibold transition-all ${
                activeTab === item.id
                  ? "bg-gradient-to-r from-indigo-600/20 to-cyan-500/10 text-white border border-indigo-500/30"
                  : "text-slate-400 hover:text-white hover:bg-slate-900/60"
              }`}
            >
              <div className="flex items-center gap-2.5">
                <item.icon size={16} className={activeTab === item.id ? "text-indigo-400" : "text-slate-500"} />
                <span>{item.name}</span>
              </div>
              {item.alert && <span className="h-2 w-2 rounded-full bg-amber-400 animate-pulse"></span>}
            </button>
          ))}
        </nav>

        {/* Branch & Live Status Indicator */}
        <div className="p-3 border-t border-slate-800/80 bg-slate-950/40">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span className="flex items-center gap-1.5 font-mono text-[11px]">
              <GitBranch size={13} className="text-indigo-400" /> branch: shruti1
            </span>
            <span className="flex items-center gap-1 text-[10px] text-emerald-400 font-medium">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-400"></span> Synced
            </span>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col overflow-hidden">
        {/* Top Control Bar */}
        <header className="h-16 flex items-center justify-between px-8 border-b border-slate-800/80 bg-[#0B0F17]/80 backdrop-blur-md shrink-0">
          <div className="flex items-center gap-2 text-xs">
            <span className="text-slate-400 font-medium">Multi-Level Platform</span>
            <ChevronRight size={14} className="text-slate-600" />
            <span className="text-white font-bold capitalize">{activeTab} Hub</span>
          </div>

          <div className="flex items-center gap-4">
            <div className="hidden sm:flex items-center gap-2 text-xs bg-slate-900/80 border border-slate-800 px-3 py-1.5 rounded-full text-slate-300">
              <span className="h-2 w-2 rounded-full bg-indigo-400 animate-ping"></span>
              <span>Sprint 42: <strong>18/26 pts</strong> (3d left)</span>
            </div>

            <Link
              href="/"
              className="text-xs text-slate-400 hover:text-white px-2.5 py-1.5 rounded-lg hover:bg-slate-900 transition-colors"
            >
              Exit
            </Link>

            <div className="h-8 w-8 rounded-full bg-gradient-to-tr from-indigo-500 to-cyan-400 flex items-center justify-center font-bold text-xs text-black shadow-md">
              S
            </div>
          </div>
        </header>

        {/* Tab Viewport */}
        <div className="flex-1 overflow-auto p-6 lg:p-8">
          <div className="max-w-7xl mx-auto space-y-8">
            {/* 1. MULTI-LEVEL WORK HIERARCHY */}
            {activeTab === "hierarchy" && (
              <div className="space-y-6">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div>
                    <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-300 text-[10px] font-bold uppercase tracking-wider mb-2">
                      Work Hierarchy Architecture
                    </div>
                    <h1 className="text-3xl font-extrabold tracking-tight text-white flex items-center gap-2.5">
                      <Target className="text-indigo-400" /> Multi-Level Project Management
                    </h1>
                    <p className="text-xs sm:text-sm text-slate-400 mt-1 max-w-2xl">
                      Seamlessly manage <strong>Objectives &rarr; Projects &rarr; Epics &rarr; Tasks &rarr; Sub-tasks</strong> in perfect harmony with GitHub.
                    </p>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={expandAllNodes}
                      className="px-2.5 py-1.5 rounded-lg bg-slate-900 border border-slate-800 text-[11px] font-semibold text-slate-300 hover:bg-slate-800"
                    >
                      Expand All
                    </button>
                    <button
                      onClick={collapseAllNodes}
                      className="px-2.5 py-1.5 rounded-lg bg-slate-900 border border-slate-800 text-[11px] font-semibold text-slate-300 hover:bg-slate-800"
                    >
                      Collapse All
                    </button>
                    <button
                      onClick={() => setActiveTab("board")}
                      className="flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold shadow-md shadow-indigo-600/25 transition-all"
                    >
                      <FolderKanban size={14} /> View on Board
                    </button>
                  </div>
                </div>

                {/* 5-Tier Level Visual Guide */}
                <div className="flex flex-wrap items-center gap-2 p-3 rounded-xl bg-slate-900/50 border border-slate-800/80 text-xs">
                  <span className="text-slate-400 font-semibold text-[11px] uppercase tracking-wider mr-2">
                    Hierarchy Levels:
                  </span>
                  <span className="px-2.5 py-1 rounded-md bg-purple-500/20 text-purple-300 font-bold border border-purple-500/30">
                    1. Objective
                  </span>
                  <span className="text-slate-600">&rarr;</span>
                  <span className="px-2.5 py-1 rounded-md bg-blue-500/20 text-blue-300 font-bold border border-blue-500/30">
                    2. Project
                  </span>
                  <span className="text-slate-600">&rarr;</span>
                  <span className="px-2.5 py-1 rounded-md bg-indigo-500/20 text-indigo-300 font-bold border border-indigo-500/30">
                    3. Epic
                  </span>
                  <span className="text-slate-600">&rarr;</span>
                  <span className="px-2.5 py-1 rounded-md bg-cyan-500/20 text-cyan-300 font-bold border border-cyan-500/30">
                    4. Task / Bug
                  </span>
                  <span className="text-slate-600">&rarr;</span>
                  <span className="px-2.5 py-1 rounded-md bg-emerald-500/20 text-emerald-300 font-bold border border-emerald-500/30">
                    5. Sub-task
                  </span>
                </div>

                {/* Interactive Multi-Tier Tree */}
                <div className="space-y-4">
                  {INITIAL_HIERARCHY.map((obj) => {
                    const objPct = Math.round((obj.completedPoints / obj.points) * 100);
                    return (
                      <div
                        key={obj.id}
                        className="rounded-2xl border border-slate-800 bg-slate-900/40 p-6 space-y-5 shadow-xl"
                      >
                        {/* Level 1: Objective */}
                        <div className="flex items-start justify-between">
                          <div className="flex items-start gap-3">
                            <button
                              onClick={() => toggleNode(obj.id)}
                              className="mt-1 h-6 w-6 rounded-md bg-slate-800 flex items-center justify-center text-slate-300 hover:text-white"
                            >
                              <ChevronDown
                                size={16}
                                className={`transition-transform duration-200 ${
                                  expandedNodes[obj.id] ? "" : "-rotate-90"
                                }`}
                              />
                            </button>
                            <div>
                              <div className="flex items-center gap-2">
                                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-purple-500/20 text-purple-300 border border-purple-500/30">
                                  OBJECTIVE
                                </span>
                                <span className="font-mono text-xs text-slate-500">{obj.id}</span>
                              </div>
                              <h2 className="text-xl font-bold text-white mt-1">{obj.title}</h2>
                            </div>
                          </div>

                          <div className="text-right">
                            <span className="text-xs font-mono text-slate-400 font-semibold">
                              {obj.completedPoints} / {obj.points} pts ({objPct}%)
                            </span>
                            <div className="w-36 h-2 rounded-full bg-slate-800 mt-1.5 overflow-hidden">
                              <div
                                className="h-full bg-gradient-to-r from-purple-500 to-indigo-500"
                                style={{ width: `${objPct}%` }}
                              ></div>
                            </div>
                          </div>
                        </div>

                        {/* Level 2: Projects */}
                        {expandedNodes[obj.id] && obj.children && (
                          <div className="pl-6 border-l-2 border-slate-800/80 space-y-4 pt-2">
                            {obj.children.map((proj) => {
                              const projPct = Math.round((proj.completedPoints / proj.points) * 100);
                              return (
                                <div
                                  key={proj.id}
                                  className="rounded-xl border border-slate-800/80 bg-slate-950/60 p-4 space-y-3"
                                >
                                  <div className="flex items-start justify-between">
                                    <div className="flex items-start gap-2.5">
                                      <button
                                        onClick={() => toggleNode(proj.id)}
                                        className="mt-0.5 h-5 w-5 rounded bg-slate-800 flex items-center justify-center text-slate-400 hover:text-white"
                                      >
                                        <ChevronDown
                                          size={14}
                                          className={`transition-transform duration-200 ${
                                            expandedNodes[proj.id] ? "" : "-rotate-90"
                                          }`}
                                        />
                                      </button>
                                      <div>
                                        <div className="flex items-center gap-2">
                                          <span className="px-1.5 py-0.5 rounded text-[9px] font-bold bg-blue-500/20 text-blue-300 border border-blue-500/30">
                                            PROJECT
                                          </span>
                                          <span className="font-mono text-[11px] text-slate-500">{proj.id}</span>
                                        </div>
                                        <h3 className="text-sm font-bold text-slate-200 mt-0.5">{proj.title}</h3>
                                      </div>
                                    </div>
                                    <span className="text-[11px] font-mono text-slate-400">
                                      {proj.completedPoints} / {proj.points} pts ({projPct}%)
                                    </span>
                                  </div>

                                  {/* Level 3: Epics */}
                                  {expandedNodes[proj.id] && proj.children && (
                                    <div className="pl-5 border-l-2 border-slate-800/60 space-y-3 pt-2">
                                      {proj.children.map((epic) => (
                                        <div
                                          key={epic.id}
                                          className="rounded-lg border border-slate-800 bg-[#0F1522] p-3 space-y-3"
                                        >
                                          <div className="flex items-center justify-between">
                                            <div className="flex items-center gap-2">
                                              <button
                                                onClick={() => toggleNode(epic.id)}
                                                className="h-4 w-4 rounded bg-slate-800 flex items-center justify-center text-slate-400"
                                              >
                                                <ChevronDown
                                                  size={12}
                                                  className={`transition-transform duration-200 ${
                                                    expandedNodes[epic.id] ? "" : "-rotate-90"
                                                  }`}
                                                />
                                              </button>
                                              <span className="px-1.5 py-0.5 rounded text-[9px] font-bold bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                                                EPIC
                                              </span>
                                              <span className="text-xs font-semibold text-slate-200">{epic.title}</span>
                                            </div>
                                            <span className="text-[10px] font-mono text-slate-400 bg-slate-800 px-2 py-0.5 rounded">
                                              {epic.completedPoints}/{epic.points} pts
                                            </span>
                                          </div>

                                          {/* Level 4: Tasks / Bugs / Issues */}
                                          {expandedNodes[epic.id] && epic.children && (
                                            <div className="pl-4 border-l-2 border-indigo-500/20 space-y-2 pt-1">
                                              {epic.children.map((task) => (
                                                <div
                                                  key={task.id}
                                                  className="p-2.5 rounded bg-slate-900/80 border border-slate-800/80 space-y-2"
                                                >
                                                  <div className="flex items-center justify-between text-xs">
                                                    <div className="flex items-center gap-2">
                                                      <span
                                                        className={`px-1.5 py-0.2 rounded text-[8px] font-bold uppercase ${
                                                          task.type === "bug"
                                                            ? "bg-rose-500/20 text-rose-300 border border-rose-500/30"
                                                            : "bg-cyan-500/20 text-cyan-300 border border-cyan-500/30"
                                                        }`}
                                                      >
                                                        {task.type}
                                                      </span>
                                                      <span className="font-mono text-[11px] text-indigo-400 font-semibold">
                                                        {task.id}
                                                      </span>
                                                      <span className="text-slate-300 font-medium">{task.title}</span>
                                                    </div>
                                                    <span className="font-mono text-[10px] text-slate-400">
                                                      {task.points} pts
                                                    </span>
                                                  </div>

                                                  {/* Level 5: Sub-Tasks */}
                                                  {task.children && task.children.length > 0 && (
                                                    <div className="pl-4 space-y-1.5 pt-1">
                                                      {task.children.map((sub) => (
                                                        <div
                                                          key={sub.id}
                                                          className="flex items-center justify-between text-[11px] py-1 px-2 rounded bg-slate-950/70 border border-slate-800/60"
                                                        >
                                                          <div className="flex items-center gap-2 text-slate-400">
                                                            <CornerDownRight size={12} className="text-emerald-400" />
                                                            <span className="font-mono text-[10px] text-slate-500">
                                                              {sub.id}
                                                            </span>
                                                            <span
                                                              className={
                                                                sub.status === "Completed"
                                                                  ? "line-through text-slate-500"
                                                                  : "text-slate-300"
                                                              }
                                                            >
                                                              {sub.title}
                                                            </span>
                                                          </div>
                                                          <span className="text-[9px] px-1.5 py-0.2 rounded bg-emerald-500/10 text-emerald-400 font-semibold">
                                                            {sub.status}
                                                          </span>
                                                        </div>
                                                      ))}
                                                    </div>
                                                  )}
                                                </div>
                                              ))}
                                            </div>
                                          )}
                                        </div>
                                      ))}
                                    </div>
                                  )}
                                </div>
                              );
                            })}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* 2. MULTI-REPO AGILE KANBAN BOARD */}
            {activeTab === "board" && (
              <div className="space-y-6">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div>
                    <h1 className="text-2xl font-bold flex items-center gap-2 text-white">
                      <FolderKanban className="text-indigo-400" /> Multi-Repo Agile Kanban Board
                    </h1>
                    <p className="text-xs text-slate-400 mt-1">
                      Automated 6-column pipeline with story point estimates, WIP limit controls, and dependency locks.
                    </p>
                  </div>

                  {/* Filters */}
                  <div className="flex items-center gap-3">
                    <select
                      value={selectedRepoFilter}
                      onChange={(e) => setSelectedRepoFilter(e.target.value)}
                      className="bg-slate-900 border border-slate-800 rounded-lg px-2.5 py-1.5 text-xs text-slate-200"
                    >
                      <option value="All Repos">All Repos (4)</option>
                      <option value="kairo/auth">kairo/auth</option>
                      <option value="kairo/core">kairo/core</option>
                      <option value="kairo/frontend">kairo/frontend</option>
                      <option value="fastapi/fastapi">fastapi/fastapi</option>
                    </select>

                    <div className="text-xs bg-slate-900 border border-slate-800 px-3 py-1.5 rounded-lg text-slate-300 font-mono">
                      Points: <strong>{filteredCards.reduce((acc, c) => acc + c.points, 0)} pts</strong>
                    </div>
                  </div>
                </div>

                {/* WIP Limit Alert Banner */}
                {inProgressCount >= 3 && (
                  <div className="p-3 rounded-xl border border-amber-500/30 bg-amber-500/10 flex items-center justify-between text-xs text-amber-300">
                    <div className="flex items-center gap-2">
                      <Gauge size={16} />
                      <span>
                        <strong>WIP Limit Warning:</strong> &apos;In Progress&apos; has reached maximum capacity (
                        {inProgressCount}/3 cards). Focus on completing items before pulling new work.
                      </span>
                    </div>
                    <span className="font-mono text-[10px] font-bold uppercase bg-amber-500/20 px-2 py-0.5 rounded">
                      Limit Active
                    </span>
                  </div>
                )}

                {/* Search */}
                <div className="relative">
                  <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search issues, PRs, epics (e.g. JWT, PR-142, auth)..."
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg pl-10 pr-4 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
                  />
                </div>

                {/* 6-Column Pipeline */}
                <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-3.5 overflow-x-auto pb-4">
                  {COLUMNS.map((colName) => {
                    const colCards = filteredCards.filter((c) => c.column === colName);
                    const colPoints = colCards.reduce((acc, c) => acc + c.points, 0);

                    return (
                      <div
                        key={colName}
                        className="bg-slate-950/80 border border-slate-800/80 rounded-xl p-3 flex flex-col min-h-[520px]"
                      >
                        <div className="flex items-center justify-between pb-2 mb-3 border-b border-slate-800/60">
                          <span className="text-xs font-semibold text-slate-300 truncate" title={colName}>
                            {colName}
                          </span>
                          <span className="text-[10px] font-mono text-indigo-400 bg-indigo-500/10 px-1.5 py-0.5 rounded">
                            {colPoints}pt
                          </span>
                        </div>

                        <div className="space-y-3 flex-1">
                          {colCards.map((card) => (
                            <div
                              key={card.id}
                              onClick={() => setSelectedCardForDrawer(card)}
                              className="p-3 rounded-lg bg-slate-900/90 border border-slate-800 hover:border-indigo-500/50 transition-all space-y-2 shadow-sm cursor-pointer"
                            >
                              <div className="flex items-center justify-between">
                                <span className="flex items-center gap-1 text-[11px] font-mono font-medium text-slate-400">
                                  {card.type === "pr" ? (
                                    <GitMerge size={12} className="text-indigo-400" />
                                  ) : (
                                    <GitPullRequest size={12} className="text-cyan-400" />
                                  )}
                                  {card.id}
                                </span>
                                <span className="text-[10px] font-semibold font-mono bg-slate-800 text-slate-300 px-1.5 py-0.5 rounded">
                                  {card.points} pts
                                </span>
                              </div>

                              <p className="text-xs font-medium text-slate-200 leading-snug">{card.title}</p>

                              <div className="flex flex-wrap gap-1">
                                <span className="text-[9px] font-mono bg-slate-800/80 text-slate-400 px-1.5 py-0.5 rounded">
                                  {card.repo}
                                </span>
                                {card.epic && (
                                  <span className="text-[9px] text-indigo-300 bg-indigo-500/10 border border-indigo-500/20 px-1.5 py-0.5 rounded truncate max-w-[120px]">
                                    {card.epic}
                                  </span>
                                )}
                              </div>

                              {card.blockedBy && (
                                <div className="flex items-center gap-1 text-[9px] text-rose-400 bg-rose-500/10 px-1.5 py-0.5 rounded font-medium">
                                  <Lock size={10} /> Blocked by {card.blockedBy}
                                </div>
                              )}

                              {card.impactRisk && (
                                <div className="flex items-center gap-1 text-[9px] font-semibold text-amber-400 bg-amber-500/10 px-1.5 py-0.5 rounded">
                                  <AlertTriangle size={10} /> {card.impactRisk} Drift
                                </div>
                              )}

                              <div
                                className="flex items-center justify-between pt-1 border-t border-slate-800/80"
                                onClick={(e) => e.stopPropagation()}
                              >
                                <span className="text-[10px] text-slate-500 font-mono">@{card.assignee}</span>
                                <div className="flex items-center gap-1">
                                  {colName !== "New Issues" && (
                                    <button
                                      onClick={() => moveCard(card.id, "prev")}
                                      className="h-5 w-5 rounded bg-slate-800 text-slate-400 hover:text-white flex items-center justify-center text-xs"
                                    >
                                      &larr;
                                    </button>
                                  )}
                                  {colName !== "Done" && (
                                    <button
                                      onClick={() => moveCard(card.id, "next")}
                                      className="h-5 w-5 rounded bg-slate-800 text-slate-400 hover:text-white flex items-center justify-center text-xs"
                                    >
                                      &rarr;
                                    </button>
                                  )}
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Card Detail Drawer Modal */}
                {selectedCardForDrawer && (
                  <div
                    className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
                    onClick={() => setSelectedCardForDrawer(null)}
                  >
                    <div
                      className="bg-slate-950 border border-slate-800 rounded-2xl max-w-lg w-full p-6 space-y-5 shadow-2xl"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <div className="flex items-start justify-between">
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-mono text-xs text-indigo-400 font-bold">
                              {selectedCardForDrawer.id}
                            </span>
                            <span className="text-[10px] bg-slate-800 text-slate-400 px-2 py-0.5 rounded font-mono">
                              {selectedCardForDrawer.repo}
                            </span>
                          </div>
                          <h3 className="text-base font-bold text-white mt-1">{selectedCardForDrawer.title}</h3>
                        </div>
                        <button
                          onClick={() => setSelectedCardForDrawer(null)}
                          className="text-slate-500 hover:text-white"
                        >
                          <X size={18} />
                        </button>
                      </div>

                      <p className="text-xs text-slate-400 leading-relaxed">
                        {selectedCardForDrawer.description || "No extended description provided."}
                      </p>

                      <div className="grid grid-cols-2 gap-3 p-3 rounded-xl bg-slate-900/60 border border-slate-800 text-xs">
                        <div>
                          <span className="text-[10px] uppercase font-bold text-slate-500 block">Stage</span>
                          <span className="text-slate-200 font-semibold">{selectedCardForDrawer.column}</span>
                        </div>
                        <div>
                          <span className="text-[10px] uppercase font-bold text-slate-500 block">Estimate</span>
                          <span className="font-mono text-indigo-400 font-bold">
                            {selectedCardForDrawer.points} Story Points
                          </span>
                        </div>
                        <div>
                          <span className="text-[10px] uppercase font-bold text-slate-500 block">Assignee</span>
                          <span className="text-slate-200">@{selectedCardForDrawer.assignee}</span>
                        </div>
                        <div>
                          <span className="text-[10px] uppercase font-bold text-slate-500 block">Priority</span>
                          <span className="text-amber-400 font-semibold">{selectedCardForDrawer.priority}</span>
                        </div>
                      </div>

                      {/* Hierarchy Breadcrumb */}
                      <div className="p-3 rounded-xl bg-indigo-500/10 border border-indigo-500/20 text-xs space-y-1">
                        <span className="text-[10px] uppercase font-bold text-indigo-400 block">Hierarchy Linkage</span>
                        <div className="text-indigo-200 flex items-center gap-1.5 flex-wrap">
                          <span>OBJ-2026-Q3</span> &rarr; <span>PROJ-1</span> &rarr;{" "}
                          <span>{selectedCardForDrawer.epic || "Direct Task"}</span> &rarr;{" "}
                          <strong className="text-white">{selectedCardForDrawer.id}</strong>
                        </div>
                      </div>

                      <div className="flex justify-end">
                        <button
                          onClick={() => setSelectedCardForDrawer(null)}
                          className="px-4 py-2 rounded-lg bg-slate-800 text-xs text-white font-semibold hover:bg-slate-700"
                        >
                          Close Details
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* 3. SPRINT & VELOCITY ANALYTICS HUB */}
            {activeTab === "velocity" && (
              <div className="space-y-6">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-5">
                  <div>
                    <h1 className="text-2xl font-bold tracking-tight text-white flex items-center gap-2">
                      <BarChart3 className="text-indigo-400" /> Sprint &amp; Velocity Analytics
                    </h1>
                    <p className="text-xs text-slate-400 mt-1 max-w-xl">
                      Measure capacity accuracy, burndown cadence, and delivery predictability across multi-repository teams.
                    </p>
                  </div>
                  <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 text-center shrink-0">
                    <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Average Velocity</span>
                    <div className="text-2xl font-extrabold text-indigo-400 font-mono mt-0.5">23 story points</div>
                    <span className="text-[10px] text-slate-500">91% team predictability</span>
                  </div>
                </div>

                {/* Key KPIs */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="p-4 rounded-xl border border-slate-800 bg-slate-900/50 space-y-1">
                    <div className="flex items-center gap-1.5 text-xs text-slate-400 font-medium">
                      <Timer size={14} className="text-indigo-400" /> Mean Cycle Time
                    </div>
                    <div className="text-2xl font-extrabold text-white font-mono">2.8 days</div>
                    <div className="text-[10px] text-emerald-400">-0.4d vs last sprint</div>
                  </div>

                  <div className="p-4 rounded-xl border border-slate-800 bg-slate-900/50 space-y-1">
                    <div className="flex items-center gap-1.5 text-xs text-slate-400 font-medium">
                      <Clock size={14} className="text-cyan-400" /> Mean Lead Time
                    </div>
                    <div className="text-2xl font-extrabold text-white font-mono">6.2 days</div>
                    <div className="text-[10px] text-slate-500">Backlog to Done</div>
                  </div>

                  <div className="p-4 rounded-xl border border-slate-800 bg-slate-900/50 space-y-1">
                    <div className="flex items-center gap-1.5 text-xs text-slate-400 font-medium">
                      <GitPullRequest size={14} className="text-purple-400" /> PR Review Turnaround
                    </div>
                    <div className="text-2xl font-extrabold text-white font-mono">18 hours</div>
                    <div className="text-[10px] text-emerald-400">Top 10% benchmark</div>
                  </div>
                </div>

                {/* Burndown Chart Preview */}
                <div className="p-6 rounded-2xl border border-slate-800 bg-slate-900/40 space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="text-sm font-bold flex items-center gap-2 text-white">
                      <TrendingUp size={16} className="text-indigo-400" /> Sprint 42 Burndown (Points Remaining)
                    </h3>
                    <div className="flex items-center gap-4 text-xs">
                      <div className="flex items-center gap-1.5">
                        <span className="h-0.5 w-4 bg-slate-600"></span>
                        <span className="text-slate-400">Ideal Guideline</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <span className="h-2 w-2 rounded-full bg-cyan-400"></span>
                        <span className="text-cyan-400 font-semibold">Actual Remaining</span>
                      </div>
                    </div>
                  </div>

                  {/* Burndown chart visualization */}
                  <div className="h-44 flex items-end justify-between gap-3 pt-6 px-4 border-b border-slate-800 pb-3 font-mono text-[10px]">
                    {[
                      { day: "Day 1", pts: 26 },
                      { day: "Day 3", pts: 24 },
                      { day: "Day 5", pts: 21 },
                      { day: "Day 7", pts: 18 },
                      { day: "Day 9", pts: 14 },
                      { day: "Day 11 (Now)", pts: 8 },
                      { day: "Day 14", pts: 0 },
                    ].map((step, i) => (
                      <div key={i} className="flex-1 flex flex-col items-center gap-2">
                        <span className="text-slate-400">{step.pts}pt</span>
                        <div className="w-full flex justify-center h-28 items-end">
                          <div
                            className="w-4 rounded-t bg-gradient-to-t from-indigo-600 to-cyan-400"
                            style={{ height: `${(step.pts / 26) * 100}%` }}
                          ></div>
                        </div>
                        <span className="text-slate-500">{step.day}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Historical Sprint Velocity Table */}
                <div className="p-6 rounded-2xl border border-slate-800 bg-slate-900/40 space-y-4">
                  <h3 className="text-sm font-bold text-white">Sprint Velocity Ledger</h3>
                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs font-mono">
                      <thead className="text-slate-500 border-b border-slate-800">
                        <tr>
                          <th className="pb-2 font-sans">Sprint</th>
                          <th className="pb-2 text-right">Committed</th>
                          <th className="pb-2 text-right">Completed</th>
                          <th className="pb-2 text-right">Scope Delta</th>
                          <th className="pb-2 text-right">Predictability</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-800/60">
                        <tr>
                          <td className="py-2.5 font-sans font-medium text-slate-200">Sprint 42 (Active)</td>
                          <td className="py-2.5 text-right text-slate-400">26 pts</td>
                          <td className="py-2.5 text-right text-indigo-400 font-bold">18 pts</td>
                          <td className="py-2.5 text-right text-slate-500">+0</td>
                          <td className="py-2.5 text-right text-emerald-400">69% (In flight)</td>
                        </tr>
                        <tr>
                          <td className="py-2.5 font-sans font-medium text-slate-200">Sprint 41</td>
                          <td className="py-2.5 text-right text-slate-400">28 pts</td>
                          <td className="py-2.5 text-right text-indigo-400 font-bold">27 pts</td>
                          <td className="py-2.5 text-right text-slate-500">+1</td>
                          <td className="py-2.5 text-right text-emerald-400">96%</td>
                        </tr>
                        <tr>
                          <td className="py-2.5 font-sans font-medium text-slate-200">Sprint 40</td>
                          <td className="py-2.5 text-right text-slate-400">25 pts</td>
                          <td className="py-2.5 text-right text-indigo-400 font-bold">24 pts</td>
                          <td className="py-2.5 text-right text-slate-500">+2</td>
                          <td className="py-2.5 text-right text-emerald-400">96%</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            )}

            {/* 4. PLANNING POKER ESTIMATOR */}
            {activeTab === "poker" && (
              <div className="space-y-6">
                <div>
                  <h1 className="text-2xl font-bold text-white flex items-center gap-2">
                    <Zap className="text-indigo-400" /> Interactive Planning Poker &amp; Estimation
                  </h1>
                  <p className="text-xs text-slate-400 mt-1">
                    Vote anonymously on GitHub issue difficulty to build consensus on story points.
                  </p>
                </div>

                <div className="p-6 rounded-2xl border border-slate-800 bg-slate-900/40 space-y-6">
                  {/* Select issue to estimate */}
                  <div className="flex items-center gap-3">
                    <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Select Issue:</span>
                    <select
                      value={selectedPokerIssue}
                      onChange={(e) => setSelectedPokerIssue(e.target.value)}
                      className="bg-slate-950 border border-slate-800 rounded-lg px-3 py-1.5 text-xs text-slate-200 focus:outline-none"
                    >
                      {cards.map((c) => (
                        <option key={c.id} value={c.id}>
                          {c.id}: {c.title.slice(0, 50)}...
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Selected Issue Preview Card */}
                  <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
                    <span className="text-[10px] font-mono text-indigo-400 font-bold">ESTIMATING {selectedPokerIssue}</span>
                    <h3 className="text-base font-bold text-white">
                      {cards.find((c) => c.id === selectedPokerIssue)?.title}
                    </h3>
                    <p className="text-xs text-slate-400">
                      {cards.find((c) => c.id === selectedPokerIssue)?.description ||
                        "Synchronize real-time WebSocket poker votes into GitHub issue metadata."}
                    </p>
                  </div>

                  {/* Fibonacci Card Selector */}
                  <div className="space-y-3">
                    <label className="text-xs font-bold text-slate-300 uppercase tracking-wider block">
                      Select Your Estimate Card (Fibonacci):
                    </label>
                    <div className="flex flex-wrap gap-3">
                      {[1, 2, 3, 5, 8, 13, 21].map((pt) => (
                        <button
                          key={pt}
                          onClick={() => setSelectedPokerPoint(pt)}
                          className={`h-20 w-14 rounded-xl border font-mono font-extrabold text-lg flex items-center justify-center transition-all ${
                            selectedPokerPoint === pt
                              ? "bg-indigo-600 text-white border-indigo-400 scale-105 shadow-lg shadow-indigo-600/30"
                              : "bg-slate-950 text-slate-300 border-slate-800 hover:border-slate-700"
                          }`}
                        >
                          {pt}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Teammate votes & consensus */}
                  <div className="pt-4 border-t border-slate-800 space-y-4">
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-slate-400 font-semibold">Teammate Votes (4 Submitted):</span>
                      <button
                        onClick={() => setPokerRevealed(!pokerRevealed)}
                        className="text-xs font-bold text-indigo-400 hover:underline"
                      >
                        {pokerRevealed ? "Hide Cards" : "Reveal Team Cards"}
                      </button>
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                      {[
                        { user: "aman (Dev)", vote: 5 },
                        { user: "sarah (Lead)", vote: 5 },
                        { user: "alex (QA)", vote: 5 },
                        { user: "sharvari (Dev)", vote: 3 },
                      ].map((t, idx) => (
                        <div
                          key={idx}
                          className="p-3 rounded-lg bg-slate-950 border border-slate-800 flex items-center justify-between text-xs"
                        >
                          <span className="text-slate-300 font-medium">{t.user}</span>
                          <span className="font-mono font-bold bg-indigo-500/10 text-indigo-400 px-2 py-0.5 rounded">
                            {pokerRevealed ? `${t.vote} pts` : "Voted ✓"}
                          </span>
                        </div>
                      ))}
                    </div>

                    {/* Consensus Action */}
                    <div className="flex items-center justify-between pt-2">
                      <div className="text-xs text-slate-400">
                        Consensus: <strong className="text-white">5 Story Points</strong> (Strong Agreement)
                      </div>
                      <button
                        onClick={applyConsensusEstimate}
                        className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs shadow-md shadow-indigo-600/25 transition-all"
                      >
                        <Check size={14} /> Accept &amp; Apply {selectedPokerPoint} pts to Issue
                      </button>
                    </div>

                    {pokerAppliedSuccess && (
                      <div className="p-3 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-xs text-emerald-400 flex items-center gap-2">
                        <CheckCircle2 size={16} /> Successfully updated {selectedPokerIssue} to {selectedPokerPoint} story points in Board &amp; Hierarchy!
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* 5. RELEASES & MILESTONES */}
            {activeTab === "releases" && (
              <div className="space-y-6">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div>
                    <h1 className="text-2xl font-bold text-white flex items-center gap-2">
                      <Boxes className="text-indigo-400" /> Multi-Repo Releases &amp; Milestones
                    </h1>
                    <p className="text-xs text-slate-400 mt-1">
                      Track multi-repository release targets, scope creep, and delivery burnup towards code freeze.
                    </p>
                  </div>
                  <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold">
                    <Plus size={14} /> Create Release Target
                  </button>
                </div>

                <div className="space-y-4">
                  {releases.map((rel) => {
                    const pct = Math.round((rel.completedPoints / rel.totalPoints) * 100);
                    return (
                      <div
                        key={rel.id}
                        className="p-6 rounded-2xl border border-slate-800 bg-slate-900/40 space-y-4 shadow-sm"
                      >
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                          <div className="flex items-center gap-2.5">
                            <span className="font-mono text-xs font-bold bg-indigo-500/20 text-indigo-300 px-2 py-0.5 rounded border border-indigo-500/30">
                              {rel.tag}
                            </span>
                            <h3 className="text-base font-bold text-white">{rel.title}</h3>
                          </div>
                          <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 w-max">
                            {rel.status}
                          </span>
                        </div>

                        {/* Progress Bar */}
                        <div className="space-y-1.5">
                          <div className="flex justify-between text-xs">
                            <span className="text-slate-400">Release Scope Completion</span>
                            <span className="font-mono font-bold text-white">
                              {rel.completedPoints} / {rel.totalPoints} pts ({pct}%)
                            </span>
                          </div>
                          <div className="w-full h-2 rounded-full bg-slate-800 overflow-hidden">
                            <div
                              className="h-full bg-gradient-to-r from-indigo-500 to-cyan-400"
                              style={{ width: `${pct}%` }}
                            ></div>
                          </div>
                        </div>

                        {/* Metadata Pills */}
                        <div className="flex flex-wrap items-center justify-between gap-3 pt-2 text-xs text-slate-400 border-t border-slate-800">
                          <div className="flex items-center gap-2">
                            <Calendar size={14} className="text-indigo-400" /> Target Release:{" "}
                            <strong className="text-slate-200">{rel.targetDate}</strong>
                          </div>
                          <div className="flex items-center gap-1.5">
                            <GitFork size={14} className="text-slate-500" /> Repos:{" "}
                            <span className="font-mono text-slate-300">{rel.repos.join(", ")}</span>
                          </div>
                          <div className="text-[11px] font-mono text-amber-400">
                            Scope Creep: +{rel.scopeAddedPoints} pts post-freeze
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* 6. ISSUE DEPENDENCIES & BLOCKERS */}
            {activeTab === "dependencies" && (
              <div className="space-y-6">
                <div>
                  <h1 className="text-2xl font-bold text-white flex items-center gap-2">
                    <Link2 className="text-indigo-400" /> Visual Dependencies &amp; Blockers Matrix
                  </h1>
                  <p className="text-xs text-slate-400 mt-1">
                    Map cross-repository prerequisite chains to eliminate engineering bottlenecks before sprint start.
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="p-5 rounded-2xl border border-rose-500/30 bg-rose-500/5 space-y-3">
                    <div className="flex items-center gap-2 text-rose-400 font-bold text-xs uppercase tracking-wider">
                      <Lock size={16} /> Blocked Item Dependency #1
                    </div>
                    <div className="space-y-2 text-xs">
                      <div className="p-3 rounded-lg bg-slate-950 border border-slate-800">
                        <span className="font-mono text-rose-400 font-bold">ISSUE-402</span>: Define pgvector similarity threshold
                      </div>
                      <div className="text-slate-400 pl-4 border-l-2 border-rose-500/40 text-[11px]">
                        Is currently blocked by: <span className="font-mono text-indigo-400 font-bold">PR-147</span> (Validity interval clipping)
                      </div>
                    </div>
                    <div className="text-[10px] text-slate-400 pt-1">
                      Status: PR-147 is in review. Merging PR-147 will auto-clear this dependency flag.
                    </div>
                  </div>

                  <div className="p-5 rounded-2xl border border-amber-500/30 bg-amber-500/5 space-y-3">
                    <div className="flex items-center gap-2 text-amber-400 font-bold text-xs uppercase tracking-wider">
                      <AlertTriangle size={16} /> Blocking Item Dependency #2
                    </div>
                    <div className="space-y-2 text-xs">
                      <div className="p-3 rounded-lg bg-slate-950 border border-slate-800">
                        <span className="font-mono text-amber-400 font-bold">PR-142</span>: Refactor auth middleware to stateless JWTs
                      </div>
                      <div className="text-slate-400 pl-4 border-l-2 border-amber-500/40 text-[11px]">
                        Blocks downstream: <span className="font-mono text-slate-300 font-bold">ISSUE-402</span> in <code>kairo/core</code>
                      </div>
                    </div>
                    <div className="text-[10px] text-slate-400 pt-1">
                      Status: High impact PR requiring decision drift approval.
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* 7. WORKFLOW AUTOMATIONS */}
            {activeTab === "automations" && (
              <div className="space-y-6">
                <div>
                  <h1 className="text-2xl font-bold text-white flex items-center gap-2">
                    <Workflow className="text-indigo-400" /> Automated Workflow Rules Engine
                  </h1>
                  <p className="text-xs text-slate-400 mt-1">
                    Set up triggers and actions between GitHub pull requests, commits, and kanban pipeline columns.
                  </p>
                </div>

                <div className="space-y-3">
                  {rules.map((rule) => (
                    <div
                      key={rule.id}
                      className="p-5 rounded-xl border border-slate-800 bg-slate-900/40 flex items-center justify-between"
                    >
                      <div className="space-y-1">
                        <div className="flex items-center gap-2 text-xs font-bold text-indigo-400">
                          <Sparkles size={14} /> Rule #{rule.id}: {rule.title}
                        </div>
                        <div className="text-xs text-slate-300">
                          <strong>Trigger:</strong> {rule.trigger}
                        </div>
                        <div className="text-xs text-slate-400">
                          <strong>Action:</strong> {rule.action}
                        </div>
                      </div>

                      <button
                        onClick={() => toggleRule(rule.id)}
                        className={`px-3 py-1 rounded-full text-xs font-semibold transition-all ${
                          rule.enabled
                            ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30"
                            : "bg-slate-800 text-slate-500"
                        }`}
                      >
                        {rule.enabled ? "Active" : "Disabled"}
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* 8. IMPACT & DECISION DRIFT */}
            {activeTab === "impact" && (
              <div className="space-y-6">
                <div>
                  <h1 className="text-2xl font-bold text-white flex items-center gap-2">
                    <ShieldAlert className="text-amber-400" /> Decision Drift &amp; Pull Request Impact Scanner
                  </h1>
                  <p className="text-xs text-slate-400 mt-1">
                    Scans pull requests for contradictions against historical architectural decisions.
                  </p>
                </div>

                <div className="p-5 rounded-xl border border-amber-500/30 bg-amber-500/5 space-y-3">
                  <div className="flex items-center gap-2 text-amber-400 font-semibold text-sm">
                    <AlertTriangle size={18} /> High Impact Risk Flagged on PR #142
                  </div>
                  <p className="text-xs text-slate-300 leading-relaxed">
                    PR #142 alters <code>fastapi/applications.py</code> and modifies authentication handler interfaces.
                    This conflicts with architectural decision #42 (&quot;Stateless JWT requirement&quot;) and introduces
                    potential backward-incompatibility for third-party middleware plugins.
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="p-5 rounded-xl border border-slate-800 bg-slate-900/40 space-y-3">
                    <h3 className="text-sm font-semibold text-slate-200">Decision Drift Index (DDI)</h3>
                    <div className="flex items-center gap-4">
                      <div className="text-4xl font-extrabold text-amber-400 font-mono">72 / 100</div>
                      <div className="text-xs text-slate-400">
                        Elevated divergence detected between recent commit delta and recorded decision interval.
                      </div>
                    </div>
                  </div>

                  <div className="p-5 rounded-xl border border-slate-800 bg-slate-900/40 space-y-3">
                    <h3 className="text-sm font-semibold text-slate-200">Engineering Evolution Score (EES)</h3>
                    <div className="flex items-center gap-4">
                      <div className="text-4xl font-extrabold text-emerald-400 font-mono">88 / 100</div>
                      <div className="text-xs text-slate-400">
                        Steady commit cadence, healthy code review turnaround, and low file churn cycles.
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* 9. ASK KIARO AI */}
            {activeTab === "ask" && (
              <div className="space-y-6">
                <div>
                  <h1 className="text-2xl font-bold text-white flex items-center gap-2">
                    <Search className="text-indigo-400" /> Ask KIARO Knowledge Graph
                  </h1>
                  <p className="text-xs text-slate-400 mt-1">
                    Grounded natural language answers traversed across git commits, issues, PRs, and decisions.
                  </p>
                </div>

                <div className="flex flex-wrap gap-2">
                  {[
                    "What is the status of our work hierarchy?",
                    "What is our team's average velocity?",
                    "Are there any active blockers or dependencies?",
                    "What is the target date for release v2.0?",
                  ].map((sugg, i) => (
                    <button
                      key={i}
                      onClick={() => handleAskQuestion(sugg)}
                      className="text-xs bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-300 px-3 py-1.5 rounded-full transition-colors"
                    >
                      &quot;{sugg}&quot;
                    </button>
                  ))}
                </div>

                <div className="rounded-xl border border-slate-800 bg-slate-950 p-6 min-h-[350px] max-h-[500px] overflow-y-auto space-y-4">
                  {chatHistory.map((msg, idx) => (
                    <div
                      key={idx}
                      className={`flex flex-col ${msg.role === "user" ? "items-end" : "items-start"}`}
                    >
                      <div
                        className={`max-w-2xl rounded-2xl px-4 py-3 text-xs leading-relaxed ${
                          msg.role === "user"
                            ? "bg-indigo-600 text-white font-medium"
                            : "bg-slate-900 border border-slate-800 text-slate-200"
                        }`}
                      >
                        <p className="whitespace-pre-line">{msg.text}</p>
                        {msg.citations && msg.citations.length > 0 && (
                          <div className="mt-3 pt-2.5 border-t border-slate-800 space-y-1">
                            <span className="text-[10px] font-semibold uppercase tracking-wider text-indigo-400 block">
                              Grounded Citations &amp; Graph Provenance:
                            </span>
                            {msg.citations.map((c, cIdx) => (
                              <div key={cIdx} className="text-[10px] text-slate-400 font-mono">
                                • {c}
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>

                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    handleAskQuestion();
                  }}
                  className="flex gap-3"
                >
                  <input
                    type="text"
                    value={chatInput}
                    onChange={(e) => setChatInput(e.target.value)}
                    placeholder="Ask about project hierarchy, velocity, sprint decisions..."
                    className="flex-1 bg-slate-900 border border-slate-800 rounded-xl px-4 py-3 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
                  />
                  <button
                    type="submit"
                    className="px-6 py-3 rounded-xl bg-indigo-600 text-white font-semibold text-xs hover:bg-indigo-500 transition-colors shrink-0"
                  >
                    Query Graph
                  </button>
                </form>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
