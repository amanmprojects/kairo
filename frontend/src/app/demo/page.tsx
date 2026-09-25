"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Activity,
  AlertTriangle,
  ArrowRight,
  BarChart3,
  Bell,
  Boxes,
  Calendar,
  Check,
  CheckCircle2,
  ChevronDown,
  ChevronRight,
  Clock,
  CornerDownRight,
  Download,
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
  LayoutGrid,
  Link2,
  Lock,
  PieChart,
  Play,
  Plus,
  RefreshCw,
  Search,
  Settings,
  Shield,
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
  | "overview"
  | "hierarchy"
  | "board"
  | "team"
  | "velocity"
  | "poker"
  | "releases"
  | "dependencies"
  | "automations"
  | "xray"
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
  column: "Backlog & Triaged" | "In Progress" | "In Review & Testing" | "Completed / Shipped";
  points: number;
  epic?: string;
  tag: string;
  tagColor: string;
  priority: "Critical P0" | "High Priority" | "P1 Priority" | "Medium" | "Low" | "Shipped" | "Verified";
  priorityColor: string;
  assignee: string;
  avatarBg: string;
  dueDate?: string;
  checklist?: string;
  checklistPct?: number;
  reviewStatus?: string;
  impactNote?: string;
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

interface XRayHotspot {
  path: string;
  changes: number;
  authors: number;
  pr_changes: number;
  risk_score: number;
  signal: "knowledge concentration" | "high change volume" | "monitor change history";
  lastModified: string;
  activePr?: string;
}

interface TeamMember {
  name: string;
  role: string;
  avatar: string;
  status: "Balanced" | "Heavy Load" | "Available";
  loadSP: string;
  loadPct: number;
  tasks: number;
  urgentCount: number;
  activeEpics: string[];
  actionLabel?: string;
}

const INITIAL_BOARD_CARDS: BoardCard[] = [
  // 1. Backlog & Triaged
  {
    id: "STR-1082",
    title: "Define GraphQL schema for real-time collaboration",
    repo: "kairo/auth",
    type: "issue",
    column: "Backlog & Triaged",
    points: 5,
    epic: "Core Platform",
    tag: "Backend",
    tagColor: "bg-purple-50 text-purple-700 border-purple-200",
    priority: "High Priority",
    priorityColor: "bg-orange-50 text-orange-600 border-orange-200",
    assignee: "aman",
    avatarBg: "bg-indigo-600",
    checklist: "0/3 schema validations",
    checklistPct: 0,
    description: "Establish subscription endpoints for optimistic task status broadcasts and delta sync.",
  },
  {
    id: "STR-1499",
    title: "Accessibility audit for high-contrast ratios",
    repo: "kairo/frontend",
    type: "bug",
    column: "Backlog & Triaged",
    points: 3,
    epic: "Design System",
    tag: "Design QA",
    tagColor: "bg-blue-50 text-blue-700 border-blue-200",
    priority: "Medium",
    priorityColor: "bg-slate-100 text-slate-600 border-slate-200",
    assignee: "alex",
    avatarBg: "bg-blue-600",
    checklist: "0/6 checks passed",
    checklistPct: 0,
    description: "Audit WCAG 2.1 AA compliant color pairings on data visualization widgets.",
  },

  // 2. In Progress
  {
    id: "STR-1491",
    title: "Implement optimistic UI updates for task status changes",
    repo: "kairo/frontend",
    type: "pr",
    column: "In Progress",
    points: 8,
    epic: "Multi-Level Agile Sync",
    tag: "Frontend",
    tagColor: "bg-blue-50 text-blue-700 border-blue-200",
    priority: "Critical P0",
    priorityColor: "bg-red-50 text-red-600 border-red-200",
    assignee: "aman",
    avatarBg: "bg-indigo-600",
    checklist: "Checklist progress: 3/4 done (75%)",
    checklistPct: 75,
    dueDate: "Tomorrow, 5 PM",
    description: "Immediate drag-and-drop state reflection with rollback logic on server socket rejection.",
  },
  {
    id: "STR-1498",
    title: "PostgreSQL read-replica latency monitoring integration",
    repo: "kairo/core",
    type: "issue",
    column: "In Progress",
    points: 5,
    epic: "Knowledge Graph Engine",
    tag: "DevOps",
    tagColor: "bg-amber-50 text-amber-700 border-amber-200",
    priority: "High Priority",
    priorityColor: "bg-orange-50 text-orange-600 border-orange-200",
    assignee: "david",
    avatarBg: "bg-amber-600",
    checklist: "Grafana Dashboard config 80%",
    checklistPct: 80,
    description: "Track replication lag on temporal validity edge tables and trigger autoscaling alerts.",
  },

  // 3. In Review & Testing
  {
    id: "STR-1496",
    title: "Dark/Light mode seamless transition tokens",
    repo: "kairo/frontend",
    type: "pr",
    column: "In Review & Testing",
    points: 3,
    epic: "Design System",
    tag: "Design System",
    tagColor: "bg-purple-50 text-purple-700 border-purple-200",
    priority: "P1 Priority",
    priorityColor: "bg-orange-50 text-orange-600 border-orange-200",
    assignee: "sarah",
    avatarBg: "bg-emerald-600",
    reviewStatus: "Peer review: 2 of 2 Approvals",
    description: "CSS variable token system with zero flash of unstyled content during runtime transitions.",
  },
  {
    id: "STR-1477",
    title: "Webhook payloads signing for external integrations",
    repo: "kairo/auth",
    type: "issue",
    column: "In Review & Testing",
    points: 6,
    epic: "Enterprise Security",
    tag: "Security",
    tagColor: "bg-slate-100 text-slate-700 border-slate-200",
    priority: "Medium",
    priorityColor: "bg-slate-100 text-slate-600 border-slate-200",
    assignee: "sharvari",
    avatarBg: "bg-purple-600",
    reviewStatus: "Automated QA Passed",
    description: "HMAC SHA-256 signature verification headers on outbound repository webhook dispatches.",
  },

  // 4. Completed / Shipped
  {
    id: "STR-1065",
    title: "Multi-factor authentication via WebAuthn/Passkeys",
    repo: "kairo/auth",
    type: "pr",
    column: "Completed / Shipped",
    points: 8,
    epic: "Enterprise Security",
    tag: "Infra",
    tagColor: "bg-emerald-50 text-emerald-700 border-emerald-200",
    priority: "Shipped",
    priorityColor: "bg-emerald-50 text-emerald-600 border-emerald-200",
    assignee: "alex",
    avatarBg: "bg-blue-600",
    impactNote: "Merged in v4.2-rc2",
    description: "Hardware token FIDO2/WebAuthn credentials authentication with fallback SMS recovery.",
  },
  {
    id: "STR-1459",
    title: "Customer onboarding flow step 3 optimization",
    repo: "kairo/frontend",
    type: "issue",
    column: "Completed / Shipped",
    points: 5,
    epic: "Growth & Analytics",
    tag: "Growth",
    tagColor: "bg-cyan-50 text-cyan-700 border-cyan-200",
    priority: "Verified",
    priorityColor: "bg-emerald-50 text-emerald-600 border-emerald-200",
    assignee: "sarah",
    avatarBg: "bg-emerald-600",
    impactNote: "+14% completion rate measured",
    description: "Streamlined 4-click workspace setup reducing friction for initial GitHub organization ingest.",
  },
];

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

const INITIAL_XRAY_HOTSPOTS: XRayHotspot[] = [
  {
    path: "src/kairo/auth_middleware.py",
    changes: 47,
    authors: 1,
    pr_changes: 19,
    risk_score: 92,
    signal: "knowledge concentration",
    lastModified: "2 hours ago",
    activePr: "PR-142",
  },
  {
    path: "fastapi/applications.py",
    changes: 38,
    authors: 3,
    pr_changes: 14,
    risk_score: 78,
    signal: "high change volume",
    lastModified: "Yesterday",
    activePr: "PR-142",
  },
  {
    path: "src/kairo/graph.py",
    changes: 29,
    authors: 2,
    pr_changes: 11,
    risk_score: 65,
    signal: "monitor change history",
    lastModified: "3 days ago",
  },
  {
    path: "src/kairo/extract.py",
    changes: 24,
    authors: 1,
    pr_changes: 8,
    risk_score: 58,
    signal: "knowledge concentration",
    lastModified: "5 days ago",
  },
  {
    path: "src/kairo/db.py",
    changes: 19,
    authors: 4,
    pr_changes: 6,
    risk_score: 42,
    signal: "monitor change history",
    lastModified: "1 week ago",
  },
];

const TEAM_MEMBERS: TeamMember[] = [
  {
    name: "Elena Vance",
    role: "VP Product / Release",
    avatar: "EV",
    status: "Balanced",
    loadSP: "10 / 12 SP",
    loadPct: 83,
    tasks: 4,
    urgentCount: 1,
    activeEpics: ["OS Spec'd Governance"],
  },
  {
    name: "David Chen",
    role: "Lead Backend Engineer",
    avatar: "DC",
    status: "Heavy Load",
    loadSP: "24 / 20 SP",
    loadPct: 120,
    tasks: 7,
    urgentCount: 3,
    activeEpics: ["Auth Engine", "gRPC Mesh"],
    actionLabel: "Rebalance",
  },
  {
    name: "Sarah Jenkins",
    role: "Senior Product Manager",
    avatar: "SJ",
    status: "Balanced",
    loadSP: "16 / 18 SP",
    loadPct: 88,
    tasks: 5,
    urgentCount: 1,
    activeEpics: ["Design Tokens", "Fluid Canvas"],
  },
  {
    name: "Marcus Thompson",
    role: "Staff Infra Architect",
    avatar: "MT",
    status: "Available",
    loadSP: "12 / 20 SP",
    loadPct: 60,
    tasks: 3,
    urgentCount: 0,
    activeEpics: ["K8s Cluster Autoscaler"],
    actionLabel: "+ Assign",
  },
  {
    name: "Amara Diallo",
    role: "QA & DevOps Lead",
    avatar: "AD",
    status: "Balanced",
    loadSP: "18 / 20 SP",
    loadPct: 90,
    tasks: 6,
    urgentCount: 1,
    activeEpics: ["Realtime Regression"],
  },
];

const KANBAN_COLUMNS = [
  "Backlog & Triaged",
  "In Progress",
  "In Review & Testing",
  "Completed / Shipped",
] as const;

export default function DemoWorkspace() {
  const [activeTab, setActiveTab] = useState<TabType>("overview");
  const [runTour, setRunTour] = useState(false);
  const [showAdvancedTools, setShowAdvancedTools] = useState(false);
  const [cards, setCards] = useState<BoardCard[]>(INITIAL_BOARD_CARDS);
  const [releases, setReleases] = useState<Release[]>(INITIAL_RELEASES);
  const [xrayHotspots, setXrayHotspots] = useState<XRayHotspot[]>(INITIAL_XRAY_HOTSPOTS);
  const [selectedCardForDrawer, setSelectedCardForDrawer] = useState<BoardCard | null>(null);

  // Filter States
  const [selectedRepoFilter, setSelectedRepoFilter] = useState("All Repos");
  const [selectedPriorityFilter, setSelectedPriorityFilter] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");

  // View Mode States
  const [boardViewMode, setBoardViewMode] = useState<"board" | "list" | "gantt" | "calendar">("board");
  const [calendarMonth, setCalendarMonth] = useState<string>("August 2026");
  const [roadmapHorizon, setRoadmapHorizon] = useState<"months" | "quarters" | "years">("quarters");

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
  const [selectedPokerIssue, setSelectedPokerIssue] = useState<string>("STR-1491");
  const [selectedPokerPoint, setSelectedPokerPoint] = useState<number | null>(5);
  const [pokerRevealed, setPokerRevealed] = useState(false);
  const [pokerAppliedSuccess, setPokerAppliedSuccess] = useState(false);

  // Workflow Automations State
  const [rules, setRules] = useState([
    {
      id: 1,
      title: "Auto-close on PR Merge",
      trigger: "When a Pull Request is merged into default branch",
      action: "Automatically move all linked GitHub issues to 'Completed / Shipped'",
      enabled: true,
    },
    {
      id: 2,
      title: "In Review Stage Transition",
      trigger: "When a PR review is requested or opened",
      action: "Move card to 'In Review & Testing' and assign configured code owners",
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
      text: "Hello! I am KIARO. Ask me anything about multi-level project hierarchies, sprint velocity burndown, releases, or PR architectural contradictions.",
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
        const currentIndex = KANBAN_COLUMNS.indexOf(c.column);
        const nextIndex =
          direction === "next"
            ? Math.min(KANBAN_COLUMNS.length - 1, currentIndex + 1)
            : Math.max(0, currentIndex - 1);
        return { ...c, column: KANBAN_COLUMNS[nextIndex] };
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
    const matchesSearch =
      searchQuery === "" ||
      c.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.tag.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.repo.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesRepo && matchesSearch;
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

  return (
    <div className="flex h-screen bg-[#f8f9fb] text-slate-900 font-sans selection:bg-purple-200 overflow-hidden">
      <Tour
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        runTour={runTour}
        setRunTour={setRunTour}
      />

      {/* ── Left Navigation Sidebar (User-Specified Linearis Design System) ── */}
      <aside className="fixed left-0 top-0 h-full w-72 bg-surface-container-lowest shadow-[0_1px_8px_rgba(0,0,0,0.04)] z-50 flex flex-col justify-between overflow-y-auto select-none">
        <div className="flex flex-col gap-y-4 p-4">
          {/* Brand Header */}
          <div className="flex items-center justify-between px-1 py-1">
            <div className="flex items-center gap-x-2.5">
              <div className="h-8 w-8 rounded-lg bg-primary-container flex items-center justify-center text-white shadow-sm font-bold text-xs">
                <Check size={18} strokeWidth={3} />
              </div>
              <div className="flex flex-col">
                <div className="flex items-center gap-x-1.5">
                  <span className="font-headline-sm text-headline-sm text-on-surface tracking-tight font-bold">
                    KIARO
                  </span>
                  <span className="px-1.5 py-0.5 rounded-full bg-primary-fixed text-on-primary-fixed font-label-md text-label-md font-semibold uppercase">
                    Enterprise
                  </span>
                </div>
              </div>
            </div>
            <button className="text-on-surface-variant hover:text-on-surface p-1 rounded-lg transition-colors" type="button">
              <span className="material-symbols-outlined text-[20px]">unfold_more</span>
            </button>
          </div>

          {/* Active Workspace */}
          <div className="bg-surface-container-low rounded-lg p-3 flex flex-col gap-y-1">
            <div className="flex items-center justify-between text-on-surface-variant">
              <span className="font-label-md text-label-md uppercase tracking-wider font-semibold">Active Workspace</span>
              <span className="material-symbols-outlined text-[16px]">corporate_fare</span>
            </div>
            <div className="flex items-center justify-between cursor-pointer">
              <span className="font-label-lg text-label-lg text-on-surface truncate font-medium">Starlight OS v4.2 / Core Product</span>
              <span className="material-symbols-outlined text-[18px] text-on-surface-variant">expand_more</span>
            </div>
          </div>

          {/* New Initiative Button */}
          <button
            onClick={() => setActiveTab("overview")}
            className="w-full flex items-center justify-center gap-x-2 bg-primary-container text-on-primary font-label-lg text-label-lg py-2.5 px-4 rounded-lg shadow-sm hover:opacity-95 transition-opacity"
            type="button"
          >
            <span className="material-symbols-outlined text-[18px]">add_circle</span>
            <span>New Initiative</span>
          </button>

          {/* Primary Navigation */}
          <nav className="flex flex-col gap-y-1 mt-1">
            {[
              { id: "overview", name: "Overview & Portfolio", icon: "view_quilt" },
              { id: "hierarchy", name: "Roadmap & Sprints", icon: "timeline" },
              { id: "board", name: "Active Tasks & Board", icon: "view_kanban" },
              { id: "team", name: "Team & Capacity", icon: "group" },
              { id: "velocity", name: "Analytics & Velocity", icon: "monitoring" },
            ].map((item) => {
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id as TabType)}
                  className={`flex items-center gap-x-3 px-3 py-2 rounded-lg font-label-lg text-label-lg transition-all text-left ${
                    isActive
                      ? "bg-primary-container text-on-primary font-semibold shadow-sm"
                      : "text-on-surface-variant hover:bg-surface-container-high hover:text-on-surface"
                  }`}
                  type="button"
                >
                  <span className="material-symbols-outlined text-[20px]">{item.icon}</span>
                  <span>{item.name}</span>
                </button>
              );
            })}

            {/* Intelligence & Workflows Expandable Row */}
            <div className="pt-1">
              <button
                onClick={() => setShowAdvancedTools((prev) => !prev)}
                className="w-full flex items-center justify-between px-3 py-2 rounded-lg text-on-surface-variant hover:bg-surface-container-high hover:text-on-surface font-label-lg text-label-lg transition-all"
                type="button"
              >
                <span className="flex items-center gap-x-3">
                  <span className="material-symbols-outlined text-[20px]">smart_toy</span>
                  <span>Intelligence &amp; Tools</span>
                </span>
                <span className={`material-symbols-outlined text-[18px] transition-transform ${showAdvancedTools ? "rotate-180" : ""}`}>
                  expand_more
                </span>
              </button>

              {showAdvancedTools && (
                <div className="pl-4 pr-1 pt-1 space-y-1">
                  {[
                    { id: "impact", name: "PR Drift & Invariants", icon: "shield" },
                    { id: "ask", name: "Ask KIARO AI", icon: "psychology" },
                    { id: "xray", name: "Codebase X-Ray", icon: "bolt" },
                    { id: "poker", name: "Planning Poker", icon: "style" },
                    { id: "releases", name: "Releases & Delivery", icon: "package_2" },
                    { id: "dependencies", name: "Dependencies", icon: "account_tree" },
                    { id: "automations", name: "Workflow Rules", icon: "settings_suggest" },
                  ].map((item) => {
                    const isActive = activeTab === item.id;
                    return (
                      <button
                        key={item.id}
                        onClick={() => setActiveTab(item.id as TabType)}
                        className={`w-full flex items-center gap-x-2.5 px-2.5 py-1.5 rounded-lg text-xs font-medium transition-all text-left ${
                          isActive
                            ? "bg-primary-fixed text-on-primary-fixed font-semibold"
                            : "text-on-surface-variant hover:bg-surface-container hover:text-on-surface"
                        }`}
                        type="button"
                      >
                        <span className="material-symbols-outlined text-[16px]">{item.icon}</span>
                        <span>{item.name}</span>
                      </button>
                    );
                  })}
                </div>
              )}
            </div>
          </nav>
        </div>

        {/* Sidebar Footer Vault */}
        <div className="p-4 flex flex-col gap-y-4">
          <div className="bg-surface-container-low rounded-lg p-3 flex flex-col gap-y-2">
            <div className="flex items-center justify-between text-on-surface-variant">
              <span className="font-label-md text-label-md uppercase font-semibold">Initiative Vault</span>
              <span className="font-body-sm text-body-sm text-on-surface">78.4 GB / 100 GB</span>
            </div>
            <div className="w-full bg-surface-container-highest h-1.5 rounded-full overflow-hidden">
              <div className="bg-primary h-full w-[78%]"></div>
            </div>
            <div className="flex items-center justify-between pt-1">
              <span className="font-label-md text-label-md text-on-surface-variant">Tier Status</span>
              <span className="font-label-md text-label-md text-secondary font-semibold">Enterprise Core</span>
            </div>
          </div>

          <div className="flex items-center justify-between px-1 text-on-surface-variant font-label-md text-label-md">
            <span className="hover:text-on-surface transition-colors flex items-center gap-1 cursor-pointer">
              <span className="material-symbols-outlined text-[16px]">help</span>
              <span>Support</span>
            </span>
            <span className="hover:text-on-surface transition-colors flex items-center gap-1 cursor-pointer">
              <span className="material-symbols-outlined text-[16px]">terminal</span>
              <span>API Docs</span>
            </span>
            <span className="hover:text-on-surface transition-colors flex items-center gap-1 cursor-pointer">
              <span className="material-symbols-outlined text-[16px]">verified_user</span>
              <span>Security</span>
            </span>
          </div>
        </div>
      </aside>

      {/* ── Main Area with Fixed Header & Fluid Content ── */}
      <div className="pl-72 flex-1 flex flex-col min-h-screen bg-surface">
        {/* Top Control Bar matching User Specification */}
        <header className="fixed top-0 left-72 right-0 h-16 bg-surface/85 backdrop-blur-xl shadow-[0_1px_8px_rgba(0,0,0,0.04)] z-40 flex items-center justify-between px-8">
          <div className="flex items-center gap-x-4">
            <div className="relative flex items-center">
              <span className="material-symbols-outlined absolute left-3 text-[18px] text-on-surface-variant">search</span>
              <input
                className="w-80 bg-surface-container-lowest font-body-sm text-body-sm text-on-surface pl-9 pr-14 py-1.5 rounded-lg focus:outline-none shadow-[0_1px_3px_rgba(15,23,42,0.03)] placeholder:text-on-surface-variant/70 border border-slate-200/60"
                placeholder="Search tasks, roadmaps, or milestones..."
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <span className="absolute right-2.5 px-1.5 py-0.5 rounded bg-surface-container font-label-md text-label-md text-on-surface-variant">
                ⌘K
              </span>
            </div>

            <div className="flex items-center gap-x-1.5 px-2.5 py-1 rounded-lg bg-surface-container-low text-on-surface-variant font-label-md text-label-md cursor-pointer hover:bg-surface-container-high transition-colors">
              <span className="material-symbols-outlined text-[16px] text-secondary">domain</span>
              <span>Production Env</span>
              <span className="material-symbols-outlined text-[16px]">arrow_drop_down</span>
            </div>

            <div className="flex items-center gap-x-1.5 px-2.5 py-1 rounded-lg bg-surface-container-low text-on-surface-variant font-label-md text-label-md cursor-pointer hover:bg-surface-container-high transition-colors">
              <span className="material-symbols-outlined text-[16px]">event_repeat</span>
              <span>Q3 Sprint Cycle 14</span>
              <span className="material-symbols-outlined text-[16px]">expand_more</span>
            </div>
          </div>

          <div className="flex items-center gap-x-4">
            <div className="flex items-center gap-x-2">
              <button
                onClick={() => window.print()}
                className="flex items-center gap-x-1.5 px-3 py-1.5 bg-surface-container-lowest hover:bg-surface-container-low text-on-surface font-label-lg text-label-lg rounded-lg shadow-sm transition-all border border-slate-200/80"
                type="button"
              >
                <span className="material-symbols-outlined text-[18px]">download</span>
                <span>Export Report</span>
              </button>

              {/* Guided Walkthrough CTA */}
              <button
                onClick={() => {
                  setActiveTab("overview");
                  setRunTour(true);
                }}
                className="flex items-center gap-x-1.5 px-3 py-1.5 bg-primary-fixed hover:opacity-95 text-on-primary-fixed font-label-lg text-label-lg rounded-lg shadow-sm transition-all"
                type="button"
                title="Launch Guided Product Walkthrough"
              >
                <span className="material-symbols-outlined text-[18px]">auto_awesome</span>
                <span>Walkthrough</span>
              </button>

              <button
                onClick={() => setActiveTab("board")}
                className="flex items-center gap-x-1.5 px-3 py-1.5 bg-primary-container text-on-primary font-label-lg text-label-lg rounded-lg shadow-sm hover:opacity-95 transition-all"
                type="button"
              >
                <span className="material-symbols-outlined text-[18px]">add</span>
                <span>Add Task</span>
              </button>
            </div>

            <button className="relative p-2 rounded-lg text-on-surface-variant hover:bg-surface-container-low hover:text-on-surface transition-all" type="button">
              <span className="material-symbols-outlined text-[22px]">notifications</span>
              <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-secondary ring-2 ring-surface"></span>
            </button>

            <div className="flex items-center gap-x-3 pl-2 cursor-pointer">
              <div className="relative">
                <div className="w-8 h-8 rounded-full bg-primary-fixed text-on-primary-fixed flex items-center justify-center font-bold text-xs shadow-sm">
                  EV
                </div>
                <span className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full bg-emerald-500 ring-2 ring-surface"></span>
              </div>
              <div className="flex flex-col text-left">
                <span className="font-label-lg text-label-lg text-on-surface leading-tight font-semibold">Elena Vance</span>
                <span className="font-label-md text-label-md text-on-surface-variant">VP of Product</span>
              </div>
            </div>
          </div>
        </header>

        {/* Viewport Content */}
        <main className="w-full pt-20 px-8 pb-16 min-h-screen bg-surface">
          <div className="flex flex-col w-full space-y-8 max-w-[1440px] mx-auto">
            {/* ═══════════════════════════════════════════ */}
            {/* 0. EXECUTIVE PORTFOLIO OVERVIEW (Exact User HTML) */}
            {/* ═══════════════════════════════════════════ */}
            {activeTab === "overview" && (
              <div className="flex flex-col w-full space-y-8">
                {/* Editorial Hero Banner */}
                <div className="relative w-full rounded-2xl bg-surface-container-lowest p-8 shadow-sm overflow-hidden tour-overview">
                  <div className="absolute -right-24 -top-24 w-96 h-96 bg-primary-fixed/30 rounded-full blur-3xl pointer-events-none"></div>
                  <div className="absolute right-1/3 -bottom-20 w-80 h-80 bg-secondary-fixed/20 rounded-full blur-2xl pointer-events-none"></div>
                  <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
                    <div className="max-w-3xl space-y-3">
                      <div className="flex items-center gap-2">
                        <span className="px-2.5 py-1 rounded-full bg-primary-fixed text-on-primary-fixed font-label-md text-label-md font-semibold tracking-wide uppercase">
                          Q3 Performance Cadence
                        </span>
                        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-surface-container text-on-surface-variant font-label-md text-label-md">
                          <span className="material-symbols-outlined text-[15px] text-secondary">calendar_today</span>
                          July 1 – Sept 30, 2025
                        </span>
                      </div>
                      <h1 className="font-display-lg text-display-lg text-on-surface tracking-tight leading-tight">
                        Executive Portfolio Overview
                      </h1>
                      <p className="font-body-lg text-body-lg text-on-surface-variant max-w-2xl leading-relaxed">
                        Track quarterly initiatives, delivery health, and cross-functional team allocation across 6 active product lines with calibrated governance.
                      </p>
                    </div>
                    <div className="flex items-center gap-3 self-start lg:self-center shrink-0">
                      <button
                        onClick={() => window.print()}
                        className="flex items-center gap-2 px-4 py-2.5 rounded-lg bg-surface-container-low hover:bg-surface-container text-on-surface font-label-lg text-label-lg transition-all shadow-sm"
                        type="button"
                      >
                        <span className="material-symbols-outlined text-[18px]">picture_as_pdf</span>
                        <span>Download PDF Brief</span>
                      </button>
                      <button
                        onClick={() => setActiveTab("board")}
                        className="flex items-center gap-2 px-4 py-2.5 rounded-lg bg-primary-container text-on-primary font-label-lg text-label-lg shadow-sm hover:opacity-95 transition-all"
                        type="button"
                      >
                        <span className="material-symbols-outlined text-[18px]">add_task</span>
                        <span>+ New Initiative</span>
                      </button>
                    </div>
                  </div>
                </div>

                {/* Executive KPI Metric Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
                  {/* Card 1: Active Initiatives */}
                  <div className="bg-surface-container-lowest rounded-2xl p-6 shadow-sm flex flex-col justify-between hover:shadow-md transition-shadow">
                    <div className="flex items-start justify-between">
                      <span className="font-label-md text-label-md uppercase tracking-wider text-on-surface-variant font-semibold">Active Initiatives</span>
                      <div className="p-2 rounded-xl bg-surface-container-low text-primary">
                        <span className="material-symbols-outlined text-[20px]">layers</span>
                      </div>
                    </div>
                    <div className="my-4">
                      <div className="flex items-baseline gap-2">
                        <span className="font-metric-display text-metric-display font-medium text-on-surface">18</span>
                        <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700">+3 this month</span>
                      </div>
                      <p className="font-body-sm text-body-sm text-on-surface-variant mt-1">14 on target &middot; 3 at risk &middot; 1 delayed</p>
                    </div>
                    <div className="w-full bg-surface-container h-1.5 rounded-full overflow-hidden flex">
                      <div className="bg-emerald-600 h-full" style={{ width: "78%" }}></div>
                      <div className="bg-amber-500 h-full" style={{ width: "16%" }}></div>
                      <div className="bg-error h-full" style={{ width: "6%" }}></div>
                    </div>
                  </div>

                  {/* Card 2: Sprint Health */}
                  <div className="bg-surface-container-lowest rounded-2xl p-6 shadow-sm flex flex-col justify-between hover:shadow-md transition-shadow">
                    <div className="flex items-start justify-between">
                      <span className="font-label-md text-label-md uppercase tracking-wider text-on-surface-variant font-semibold">Sprint Health</span>
                      <div className="p-2 rounded-xl bg-surface-container-low text-emerald-700">
                        <span className="material-symbols-outlined text-[20px]">verified</span>
                      </div>
                    </div>
                    <div className="my-4">
                      <div className="flex items-baseline gap-2">
                        <span className="font-metric-display text-metric-display font-medium text-on-surface">94.2%</span>
                        <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700">+4.8%</span>
                      </div>
                      <p className="font-body-sm text-body-sm text-on-surface-variant mt-1">Cycle 14 commit reliability nominal</p>
                    </div>
                    <div className="w-full bg-surface-container h-1.5 rounded-full overflow-hidden">
                      <div className="bg-emerald-600 h-full rounded-full" style={{ width: "94.2%" }}></div>
                    </div>
                  </div>

                  {/* Card 3: Team Allocation */}
                  <div className="bg-surface-container-lowest rounded-2xl p-6 shadow-sm flex flex-col justify-between hover:shadow-md transition-shadow">
                    <div className="flex items-start justify-between">
                      <span className="font-label-md text-label-md uppercase tracking-wider text-on-surface-variant font-semibold">Resource Utilization</span>
                      <div className="p-2 rounded-xl bg-surface-container-low text-primary-container">
                        <span className="material-symbols-outlined text-[20px]">groups_3</span>
                      </div>
                    </div>
                    <div className="my-4">
                      <div className="flex items-baseline gap-2">
                        <span className="font-metric-display text-metric-display font-medium text-on-surface">88%</span>
                        <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-primary-fixed text-on-primary-fixed">Balanced</span>
                      </div>
                      <p className="font-body-sm text-body-sm text-on-surface-variant mt-1">42 active contributors &middot; 8 open slots</p>
                    </div>
                    <div className="w-full bg-surface-container h-1.5 rounded-full overflow-hidden">
                      <div className="bg-primary-container h-full rounded-full" style={{ width: "88%" }}></div>
                    </div>
                  </div>

                  {/* Card 4: Run-Rate */}
                  <div className="bg-surface-container-lowest rounded-2xl p-6 shadow-sm flex flex-col justify-between hover:shadow-md transition-shadow">
                    <div className="flex items-start justify-between">
                      <span className="font-label-md text-label-md uppercase tracking-wider text-on-surface-variant font-semibold">Quarterly Run-Rate</span>
                      <div className="p-2 rounded-xl bg-surface-container-low text-secondary">
                        <span className="material-symbols-outlined text-[20px]">account_balance_wallet</span>
                      </div>
                    </div>
                    <div className="my-4">
                      <div className="flex items-baseline gap-2">
                        <span className="font-metric-display text-metric-display font-medium text-on-surface">$482k</span>
                        <span className="text-xs text-on-surface-variant">of $550k</span>
                      </div>
                      <p className="font-body-sm text-body-sm text-on-surface-variant mt-1">$68,000 remaining &middot; On track</p>
                    </div>
                    <div className="w-full bg-surface-container h-1.5 rounded-full overflow-hidden">
                      <div className="bg-secondary h-full rounded-full" style={{ width: "87.6%" }}></div>
                    </div>
                  </div>
                </div>

                {/* Main 2-Column Showcase */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                  {/* Left Column (Wide, 8 cols): Strategic Initiatives Table */}
                  <div className="lg:col-span-8 bg-surface-container-lowest rounded-2xl shadow-sm p-6 space-y-6">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                      <div>
                        <h2 className="font-headline-md text-headline-md text-on-surface font-semibold tracking-tight">
                          High-Priority Strategic Initiatives
                        </h2>
                        <p className="font-body-sm text-body-sm text-on-surface-variant">
                          Cross-functional deliverable status against Q3 executive milestones
                        </p>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="relative">
                          <span className="material-symbols-outlined absolute left-2.5 top-2 text-[16px] text-on-surface-variant">filter_list</span>
                          <select className="pl-8 pr-7 py-1.5 rounded-lg bg-surface-container-low text-on-surface font-label-md text-label-md focus:outline-none appearance-none cursor-pointer">
                            <option>All Product Lines</option>
                            <option>Mobile Core</option>
                            <option>Intelligence Lab</option>
                            <option>FinOps Portal</option>
                            <option>Cloud Infrastructure</option>
                          </select>
                        </div>
                        <button className="p-1.5 rounded-lg bg-surface-container-low text-on-surface-variant hover:text-on-surface transition-colors" type="button">
                          <span className="material-symbols-outlined text-[18px]">view_column</span>
                        </button>
                      </div>
                    </div>

                    {/* Rich Data Table Container */}
                    <div className="overflow-x-auto">
                      <table className="w-full text-left">
                        <thead>
                          <tr className="text-on-surface-variant font-label-md text-label-md uppercase tracking-wider border-b border-surface-container">
                            <th className="pb-3 px-2">Initiative</th>
                            <th className="pb-3 px-3">Lead</th>
                            <th className="pb-3 px-3">Progress</th>
                            <th className="pb-3 px-3">Target Date</th>
                            <th className="pb-3 px-3">Status</th>
                            <th className="pb-3 px-2 text-right"></th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-surface-container font-body-md text-body-md text-on-surface">
                          {/* Row 1 */}
                          <tr className="hover:bg-surface-container-low/40 transition-colors group">
                            <td className="py-4 px-2">
                              <div className="flex items-center gap-3">
                                <div className="w-9 h-9 rounded-xl bg-primary-fixed/50 flex items-center justify-center text-primary shrink-0">
                                  <span className="material-symbols-outlined text-[18px]">phone_iphone</span>
                                </div>
                                <div>
                                  <span className="font-semibold text-on-surface group-hover:text-primary transition-colors block text-[15px]">
                                    Mobile App Architecture Replatforming
                                  </span>
                                  <span className="font-body-sm text-body-sm text-on-surface-variant">Core Native Migration &middot; Sprint 14</span>
                                </div>
                              </div>
                            </td>
                            <td className="py-4 px-3">
                              <div className="flex items-center gap-2">
                                <div className="w-7 h-7 rounded-full bg-indigo-100 text-indigo-700 flex items-center justify-center font-bold text-[10px]">
                                  MC
                                </div>
                                <span className="font-label-lg text-label-lg text-on-surface">M. Chen</span>
                              </div>
                            </td>
                            <td className="py-4 px-3">
                              <div className="w-28 space-y-1.5">
                                <div className="flex justify-between text-xs font-label-md text-on-surface-variant">
                                  <span className="font-semibold text-on-surface">78%</span>
                                  <span>18/23</span>
                                </div>
                                <div className="w-full bg-surface-container h-1.5 rounded-full overflow-hidden">
                                  <div className="bg-primary-container h-full rounded-full" style={{ width: "78%" }}></div>
                                </div>
                              </div>
                            </td>
                            <td className="py-4 px-3 text-on-surface-variant font-label-lg text-label-lg whitespace-nowrap">
                              Aug 28, 2025
                            </td>
                            <td className="py-4 px-3">
                              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-800 font-label-md text-label-md font-semibold">
                                <span className="w-1.5 h-1.5 rounded-full bg-emerald-600"></span>
                                On Track
                              </span>
                            </td>
                            <td className="py-4 px-2 text-right">
                              <button className="p-1.5 rounded-lg text-on-surface-variant hover:text-on-surface hover:bg-surface-container transition-colors" type="button">
                                <span className="material-symbols-outlined text-[18px]">more_vert</span>
                              </button>
                            </td>
                          </tr>

                          {/* Row 2 */}
                          <tr className="hover:bg-surface-container-low/40 transition-colors group">
                            <td className="py-4 px-2">
                              <div className="flex items-center gap-3">
                                <div className="w-9 h-9 rounded-xl bg-secondary-fixed/50 flex items-center justify-center text-secondary shrink-0">
                                  <span className="material-symbols-outlined text-[18px]">psychology</span>
                                </div>
                                <div>
                                  <span className="font-semibold text-on-surface group-hover:text-secondary transition-colors block text-[15px]">
                                    AI Semantic Search &amp; Workflow Automation
                                  </span>
                                  <span className="font-body-sm text-body-sm text-on-surface-variant">RAG Embedding Pipeline &middot; Sprint 15</span>
                                </div>
                              </div>
                            </td>
                            <td className="py-4 px-3">
                              <div className="flex items-center gap-2">
                                <div className="w-7 h-7 rounded-full bg-amber-100 text-amber-700 flex items-center justify-center font-bold text-[10px]">
                                  SA
                                </div>
                                <span className="font-label-lg text-label-lg text-on-surface">S. Al-Mansoor</span>
                              </div>
                            </td>
                            <td className="py-4 px-3">
                              <div className="w-28 space-y-1.5">
                                <div className="flex justify-between text-xs font-label-md text-on-surface-variant">
                                  <span className="font-semibold text-on-surface">62%</span>
                                  <span>24/38</span>
                                </div>
                                <div className="w-full bg-surface-container h-1.5 rounded-full overflow-hidden">
                                  <div className="bg-secondary h-full rounded-full" style={{ width: "62%" }}></div>
                                </div>
                              </div>
                            </td>
                            <td className="py-4 px-3 text-on-surface-variant font-label-lg text-label-lg whitespace-nowrap">
                              Sep 15, 2025
                            </td>
                            <td className="py-4 px-3">
                              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-amber-50 text-amber-800 font-label-md text-label-md font-semibold">
                                <span className="w-1.5 h-1.5 rounded-full bg-amber-600"></span>
                                Monitor
                              </span>
                            </td>
                            <td className="py-4 px-2 text-right">
                              <button className="p-1.5 rounded-lg text-on-surface-variant hover:text-on-surface hover:bg-surface-container transition-colors" type="button">
                                <span className="material-symbols-outlined text-[18px]">more_vert</span>
                              </button>
                            </td>
                          </tr>

                          {/* Row 3 */}
                          <tr className="hover:bg-surface-container-low/40 transition-colors group">
                            <td className="py-4 px-2">
                              <div className="flex items-center gap-3">
                                <div className="w-9 h-9 rounded-xl bg-tertiary-fixed/50 flex items-center justify-center text-tertiary shrink-0">
                                  <span className="material-symbols-outlined text-[18px]">security</span>
                                </div>
                                <div>
                                  <span className="font-semibold text-on-surface group-hover:text-primary transition-colors block text-[15px]">
                                    SOC-2 Compliance &amp; Infrastructure Hardening
                                  </span>
                                  <span className="font-body-sm text-body-sm text-on-surface-variant">Type II Audit Readiness &middot; Sprint 14</span>
                                </div>
                              </div>
                            </td>
                            <td className="py-4 px-3">
                              <div className="flex items-center gap-2">
                                <div className="w-7 h-7 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold text-[10px]">
                                  JR
                                </div>
                                <span className="font-label-lg text-label-lg text-on-surface">J. Rivera</span>
                              </div>
                            </td>
                            <td className="py-4 px-3">
                              <div className="w-28 space-y-1.5">
                                <div className="flex justify-between text-xs font-label-md text-on-surface-variant">
                                  <span className="font-semibold text-on-surface">91%</span>
                                  <span>41/45</span>
                                </div>
                                <div className="w-full bg-surface-container h-1.5 rounded-full overflow-hidden">
                                  <div className="bg-tertiary h-full rounded-full" style={{ width: "91%" }}></div>
                                </div>
                              </div>
                            </td>
                            <td className="py-4 px-3 text-on-surface-variant font-label-lg text-label-lg whitespace-nowrap">
                              Aug 14, 2025
                            </td>
                            <td className="py-4 px-3">
                              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-800 font-label-md text-label-md font-semibold">
                                <span className="w-1.5 h-1.5 rounded-full bg-emerald-600"></span>
                                On Track
                              </span>
                            </td>
                            <td className="py-4 px-2 text-right">
                              <button className="p-1.5 rounded-lg text-on-surface-variant hover:text-on-surface hover:bg-surface-container transition-colors" type="button">
                                <span className="material-symbols-outlined text-[18px]">more_vert</span>
                              </button>
                            </td>
                          </tr>

                          {/* Row 4 */}
                          <tr className="hover:bg-surface-container-low/40 transition-colors group">
                            <td className="py-4 px-2">
                              <div className="flex items-center gap-3">
                                <div className="w-9 h-9 rounded-xl bg-error-container/40 flex items-center justify-center text-error shrink-0">
                                  <span className="material-symbols-outlined text-[18px]">receipt_long</span>
                                </div>
                                <div>
                                  <span className="font-semibold text-on-surface group-hover:text-primary transition-colors block text-[15px]">
                                    Customer Billing Portal 2.0
                                  </span>
                                  <span className="font-body-sm text-body-sm text-on-surface-variant">Self-serve Invoicing &middot; Sprint 13</span>
                                </div>
                              </div>
                            </td>
                            <td className="py-4 px-3">
                              <div className="flex items-center gap-2">
                                <div className="w-7 h-7 rounded-full bg-rose-100 text-rose-700 flex items-center justify-center font-bold text-[10px]">
                                  PP
                                </div>
                                <span className="font-label-lg text-label-lg text-on-surface">P. Patel</span>
                              </div>
                            </td>
                            <td className="py-4 px-3">
                              <div className="w-28 space-y-1.5">
                                <div className="flex justify-between text-xs font-label-md text-on-surface-variant">
                                  <span className="font-semibold text-on-surface">43%</span>
                                  <span>12/28</span>
                                </div>
                                <div className="w-full bg-surface-container h-1.5 rounded-full overflow-hidden">
                                  <div className="bg-error h-full rounded-full" style={{ width: "43%" }}></div>
                                </div>
                              </div>
                            </td>
                            <td className="py-4 px-3 text-on-surface-variant font-label-lg text-label-lg whitespace-nowrap">
                              Oct 04, 2025
                            </td>
                            <td className="py-4 px-3">
                              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-error-container text-on-error-container font-label-md text-label-md font-semibold">
                                <span className="w-1.5 h-1.5 rounded-full bg-error"></span>
                                High Risk
                              </span>
                            </td>
                            <td className="py-4 px-2 text-right">
                              <button className="p-1.5 rounded-lg text-on-surface-variant hover:text-on-surface hover:bg-surface-container transition-colors" type="button">
                                <span className="material-symbols-outlined text-[18px]">more_vert</span>
                              </button>
                            </td>
                          </tr>
                        </tbody>
                      </table>
                    </div>

                    {/* Table Footer / Strategic Pagination */}
                    <div className="flex items-center justify-between pt-2">
                      <span className="font-label-md text-label-md text-on-surface-variant">Showing 4 of 18 High-Priority Initiatives</span>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => setActiveTab("hierarchy")}
                          className="px-3 py-1.5 rounded-lg bg-surface-container-low text-on-surface font-label-md text-label-md hover:bg-surface-container transition-colors"
                          type="button"
                        >
                          View All in Portfolio Explorer
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Right Column (4 cols): Milestones, Velocity & Activity Feed */}
                  <div className="lg:col-span-4 space-y-6">
                    {/* Card A: Upcoming Critical Milestones */}
                    <div className="bg-surface-container-lowest rounded-2xl p-6 shadow-sm space-y-5">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className="material-symbols-outlined text-secondary text-[20px]">flag</span>
                          <h3 className="font-headline-sm text-headline-sm text-on-surface font-semibold">Critical Milestones</h3>
                        </div>
                        <span className="px-2.5 py-0.5 rounded-full bg-secondary-fixed text-on-secondary-fixed-variant font-label-md text-label-md font-semibold">
                          3 Imminent
                        </span>
                      </div>
                      <div className="divide-y divide-surface-container space-y-3 pt-1">
                        {/* Milestone 1 */}
                        <div className="pt-3 first:pt-0 space-y-1">
                          <div className="flex items-center justify-between">
                            <span className="font-semibold text-on-surface text-[15px]">Code Freeze (v4.2)</span>
                            <span className="font-label-md text-label-md text-secondary font-bold">Aug 18</span>
                          </div>
                          <p className="font-body-sm text-body-sm text-on-surface-variant">Mobile architecture staging lock</p>
                          <div className="flex items-center gap-3 pt-1 text-xs font-label-md text-on-surface-variant">
                            <span>T-minus 6 days</span>
                            <span>&bull;</span>
                            <span className="text-emerald-700 font-semibold">On Track</span>
                          </div>
                        </div>

                        {/* Milestone 2 */}
                        <div className="pt-3 space-y-1">
                          <div className="flex items-center justify-between">
                            <span className="font-semibold text-on-surface text-[15px]">Enterprise Beta Release</span>
                            <span className="font-label-md text-label-md text-on-surface font-semibold">Sep 02</span>
                          </div>
                          <p className="font-body-sm text-body-sm text-on-surface-variant">AI semantic engine pilot partner rollout</p>
                          <div className="flex items-center gap-3 pt-1 text-xs font-label-md text-on-surface-variant">
                            <span>T-minus 21 days</span>
                            <span>&bull;</span>
                            <span className="text-amber-800 font-semibold">Pending Validation</span>
                          </div>
                        </div>

                        {/* Milestone 3 */}
                        <div className="pt-3 space-y-1">
                          <div className="flex items-center justify-between">
                            <span className="font-semibold text-on-surface text-[15px]">Security Audit Signing</span>
                            <span className="font-label-md text-label-md text-on-surface font-semibold">Sep 12</span>
                          </div>
                          <p className="font-body-sm text-body-sm text-on-surface-variant">SOC-2 Type II auditor final signoff</p>
                          <div className="flex items-center gap-3 pt-1 text-xs font-label-md text-on-surface-variant">
                            <span>T-minus 31 days</span>
                            <span>&bull;</span>
                            <span className="text-emerald-700 font-semibold">91% Prepared</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Card B: Sprint Velocity & Burndown */}
                    <div className="bg-surface-container-lowest rounded-2xl p-6 shadow-sm space-y-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <h3 className="font-headline-sm text-headline-sm text-on-surface font-semibold">Sprint Velocity</h3>
                          <p className="font-body-sm text-body-sm text-on-surface-variant">Cycle delivery trend</p>
                        </div>
                        <span className="text-emerald-700 font-semibold font-label-md text-label-md bg-emerald-50 px-2.5 py-1 rounded-full">
                          +12% Surge
                        </span>
                      </div>
                      <div className="pt-2">
                        <div className="flex items-center justify-between text-xs font-label-md text-on-surface-variant mb-3">
                          <div className="flex items-center gap-3">
                            <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-primary-container inline-block"></span>Completed</span>
                            <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-surface-dim inline-block"></span>Planned</span>
                          </div>
                          <span className="font-semibold text-on-surface">94 pts/wk</span>
                        </div>
                        <svg className="w-full h-28" preserveAspectRatio="none" viewBox="0 0 300 100">
                          <line stroke="#eceef0" strokeWidth="1" x1="0" x2="300" y1="20" y2="20"></line>
                          <line stroke="#eceef0" strokeWidth="1" x1="0" x2="300" y1="60" y2="60"></line>
                          <line stroke="#eceef0" strokeWidth="1" x1="0" x2="300" y1="90" y2="90"></line>
                          {/* Cycle 11 */}
                          <rect fill="#d8dadc" height="45" rx="2" width="14" x="25" y="45"></rect>
                          <rect fill="#3730a3" height="42" rx="2" width="14" x="43" y="48"></rect>
                          {/* Cycle 12 */}
                          <rect fill="#d8dadc" height="52" rx="2" width="14" x="95" y="38"></rect>
                          <rect fill="#3730a3" height="56" rx="2" width="14" x="113" y="34"></rect>
                          {/* Cycle 13 */}
                          <rect fill="#d8dadc" height="60" rx="2" width="14" x="165" y="30"></rect>
                          <rect fill="#3730a3" height="64" rx="2" width="14" x="183" y="26"></rect>
                          {/* Cycle 14 */}
                          <rect fill="#d8dadc" height="65" rx="2" width="14" x="235" y="25"></rect>
                          <rect fill="#fd8a42" height="68" rx="2" width="14" x="253" y="22"></rect>
                        </svg>
                        <div className="flex justify-between items-center text-[11px] font-label-md text-on-surface-variant pt-2 px-1">
                          <span>Cycle 11</span>
                          <span>Cycle 12</span>
                          <span>Cycle 13</span>
                          <span className="font-bold text-on-surface">Cycle 14 (Now)</span>
                        </div>
                      </div>
                    </div>

                    {/* Card C: Recent Activity & Governance */}
                    <div className="bg-surface-container-lowest rounded-2xl p-6 shadow-sm space-y-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className="material-symbols-outlined text-primary text-[20px]">history</span>
                          <h3 className="font-headline-sm text-headline-sm text-on-surface font-semibold">Governance Activity</h3>
                        </div>
                        <button className="text-primary hover:underline text-xs font-label-md font-semibold" type="button">View All</button>
                      </div>
                      <div className="divide-y divide-surface-container text-body-sm font-body-sm space-y-3 pt-1">
                        {/* Item 1 */}
                        <div className="pt-3 first:pt-0 space-y-1">
                          <p className="text-on-surface leading-snug">
                            <strong className="font-semibold">Elena Vance</strong> approved scope expansion for <span className="text-primary font-medium">AI Semantic Search</span>
                          </p>
                          <div className="flex items-center gap-2 text-[11px] text-on-surface-variant font-label-md">
                            <span>14m ago</span>
                            <span>&bull;</span>
                            <span className="text-emerald-700 font-medium">Executive Signoff</span>
                          </div>
                        </div>
                        {/* Item 2 */}
                        <div className="pt-3 space-y-1">
                          <p className="text-on-surface leading-snug">
                            <strong className="font-semibold">PR #4892 merged</strong> into <code className="px-1 py-0.5 rounded bg-surface-container font-mono text-[11px]">release/core-v4.2</code>
                          </p>
                          <div className="flex items-center gap-2 text-[11px] text-on-surface-variant font-label-md">
                            <span>1h ago by M. Chen</span>
                          </div>
                        </div>
                        {/* Item 3 */}
                        <div className="pt-3 space-y-1">
                          <p className="text-on-surface leading-snug">
                            <strong className="font-semibold">Schedule adjustment</strong> flagged on Billing Portal 2.0
                          </p>
                          <div className="flex items-center gap-2 text-[11px] text-on-surface-variant font-label-md">
                            <span>3h ago</span>
                            <span>&bull;</span>
                            <span className="text-amber-800 font-medium">High Risk Triage</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* ═══════════════════════════════════════════ */}
            {/* 1. ROADMAP & SPRINTS (Gantt + Hierarchy)   */}
            {/* ═══════════════════════════════════════════ */}
            {activeTab === "hierarchy" && (
              <div className="space-y-6">
                {/* Header matching Screenshot 3 */}
                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                  <div>
                    <div className="text-[10px] font-mono uppercase tracking-wider text-slate-400 mb-1">
                      STRATEGIC PORTFOLIOS &gt; FY2025 HORIZON
                    </div>
                    <h1 className="editorial-title text-4xl sm:text-5xl text-slate-900 tracking-tight font-serif font-normal">
                      Product Roadmap &amp; Sprint Timeline
                    </h1>
                  </div>

                  <div className="flex flex-wrap items-center gap-2">
                    <div className="flex items-center bg-white border border-slate-200 rounded-lg p-0.5 shadow-sm text-xs text-slate-600 font-medium">
                      <button
                        onClick={() => setRoadmapHorizon("months")}
                        className={`px-3 py-1 rounded transition-colors ${
                          roadmapHorizon === "months"
                            ? "bg-[#321c64] text-white font-semibold shadow-sm"
                            : "text-slate-500 hover:text-slate-900"
                        }`}
                      >
                        Months
                      </button>
                      <button
                        onClick={() => setRoadmapHorizon("quarters")}
                        className={`px-3 py-1 rounded transition-colors ${
                          roadmapHorizon === "quarters"
                            ? "bg-[#321c64] text-white font-semibold shadow-sm"
                            : "text-slate-500 hover:text-slate-900"
                        }`}
                      >
                        Quarters
                      </button>
                      <button
                        onClick={() => setRoadmapHorizon("years")}
                        className={`px-3 py-1 rounded transition-colors ${
                          roadmapHorizon === "years"
                            ? "bg-[#321c64] text-white font-semibold shadow-sm"
                            : "text-slate-500 hover:text-slate-900"
                        }`}
                      >
                        Years
                      </button>
                    </div>
                    <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white border border-slate-200 text-xs font-medium text-slate-700 hover:bg-slate-50 shadow-sm">
                      <MilestoneIcon /> Milestones
                    </button>
                    <button className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-[#321c64] hover:bg-[#25144b] text-white text-xs font-semibold shadow-sm transition-all">
                      <Plus size={14} strokeWidth={2.5} /> New Milestone
                    </button>
                  </div>
                </div>

                {/* Stream Filter Pills */}
                <div className="flex flex-wrap items-center justify-between gap-3 text-xs border-b border-slate-200 pb-3">
                  <div className="flex items-center gap-2">
                    <span className="text-[11px] font-semibold uppercase text-slate-400">STREAMS:</span>
                    {["All Streams", "Core Platform", "Mobile Apps", "Enterprise Cloud", "Growth & Analytics"].map((st, i) => (
                      <button
                        key={i}
                        className={`px-3 py-1 rounded-full font-medium transition-colors ${
                          i === 0
                            ? "bg-purple-100 text-[#4f46e5] font-semibold"
                            : "bg-white border border-slate-200 text-slate-600 hover:bg-slate-50"
                        }`}
                      >
                        {st}
                      </button>
                    ))}
                  </div>

                  <div className="flex items-center gap-4 text-xs text-slate-500">
                    <span className="flex items-center gap-1.5"><span className="h-2.5 w-2.5 rounded bg-indigo-600"></span> Sprint 14 In Progress</span>
                    <span className="flex items-center gap-1.5"><span className="h-2.5 w-2.5 rounded bg-amber-500"></span> Strategic Release Node</span>
                  </div>
                </div>

                {/* Timeline Gantt Grid (Matching Screenshot 3) */}
                <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-x-auto p-5 space-y-4">
                  <div className="min-w-[800px] space-y-4">
                    {/* Month Columns Header */}
                    <div className="grid grid-cols-6 gap-2 text-center text-xs pb-3 border-b border-slate-200 text-slate-500 font-medium">
                      <div>
                        <div className="font-semibold text-slate-800">July</div>
                        <div className="text-[10px] text-slate-400">Q3 &middot; W27-W31</div>
                      </div>
                      <div>
                        <div className="font-semibold text-slate-800">August</div>
                        <div className="text-[10px] text-slate-400">Q3 &middot; W32-W35</div>
                      </div>
                      <div>
                        <div className="font-semibold text-slate-800">September</div>
                        <div className="text-[10px] text-slate-400">Q3 &middot; W36-W39</div>
                      </div>
                      <div>
                        <div className="font-semibold text-slate-800">October</div>
                        <div className="text-[10px] text-slate-400">Q4 &middot; W40-W44</div>
                      </div>
                      <div>
                        <div className="font-semibold text-slate-800">November</div>
                        <div className="text-[10px] text-slate-400">Q4 &middot; W45-W48</div>
                      </div>
                      <div>
                        <div className="font-semibold text-slate-800">December</div>
                        <div className="text-[10px] text-slate-400">Q4 &middot; W49-W52</div>
                      </div>
                    </div>

                    {/* Stream 1: User Experience & Workflows */}
                    <div className="space-y-2 pt-2">
                      <div className="flex items-center justify-between text-xs">
                        <div className="font-semibold text-slate-900 flex items-center gap-2">
                          <LayoutGrid size={14} className="text-amber-500" />
                          <span>User Experience &amp; Workflows</span>
                          <span className="text-[10px] text-slate-400 font-normal">Component primitives, natural language flow engines</span>
                        </div>
                        <div className="flex items-center gap-3 text-[11px] text-slate-400">
                          <span>2 Active Epics</span>
                          <span className="text-emerald-600 font-medium">51% velocity</span>
                        </div>
                      </div>

                      <div className="grid grid-cols-6 gap-2 relative h-14 bg-slate-50/60 rounded-lg p-1.5 items-center">
                        {/* Design System Complete pill */}
                        <div className="col-start-1 col-span-2 bg-emerald-50 border border-emerald-200 rounded-lg p-2 text-xs flex items-center justify-between shadow-sm">
                          <div>
                            <span className="font-semibold text-emerald-800">Design System v2</span>
                            <div className="text-[9px] text-emerald-600">01 - Aug 12 &middot; 100% Shipped</div>
                          </div>
                          <span className="text-[9px] bg-emerald-600 text-white font-bold px-1.5 py-0.5 rounded">
                            Complete
                          </span>
                        </div>

                        {/* Natural Language Automation (At Risk) */}
                        <div className="col-start-2 col-span-3 bg-amber-50 border border-amber-200 rounded-lg p-2 text-xs flex items-center justify-between shadow-sm">
                          <div>
                            <span className="font-semibold text-amber-800">Natural Language Automation</span>
                            <div className="text-[9px] text-amber-600">Aug 01 - Oct 20 &middot; 44% complete</div>
                          </div>
                          <span className="text-[9px] bg-amber-500 text-white font-bold px-1.5 py-0.5 rounded">
                            At Risk
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Stream 2: Enterprise & Security */}
                    <div className="space-y-2 pt-2">
                      <div className="flex items-center justify-between text-xs">
                        <div className="font-semibold text-slate-900 flex items-center gap-2">
                          <Shield size={14} className="text-[#4f46e5]" />
                          <span>Enterprise &amp; Security</span>
                          <span className="text-[10px] text-slate-400 font-normal">Multi-tenant compliance, FedRAMP, zero-trust RBAC</span>
                        </div>
                        <div className="flex items-center gap-3 text-[11px] text-slate-400">
                          <span>2 Active Epics</span>
                          <span className="text-slate-600 font-medium">On Schedule</span>
                        </div>
                      </div>

                      <div className="grid grid-cols-6 gap-2 relative h-14 bg-slate-50/60 rounded-lg p-1.5 items-center">
                        {/* Zero-Trust RBAC */}
                        <div className="col-start-3 col-span-2 bg-indigo-50 border border-indigo-200 rounded-lg p-2 text-xs flex items-center justify-between shadow-sm">
                          <div>
                            <span className="font-semibold text-indigo-900">Zero-Trust Role-Based Access</span>
                            <div className="text-[9px] text-indigo-600">Sep 01 - Nov 15 &middot; Security Guild</div>
                          </div>
                          <span className="text-[9px] bg-[#4f46e5] text-white font-bold px-1.5 py-0.5 rounded">
                            Planned
                          </span>
                        </div>

                        {/* HIPAA & FedRAMP */}
                        <div className="col-start-4 col-span-2 bg-slate-100 border border-slate-200 rounded-lg p-2 text-xs flex items-center justify-between shadow-sm">
                          <div>
                            <span className="font-semibold text-slate-800">HIPAA &amp; FedRAMP Readiness</span>
                            <div className="text-[9px] text-slate-500">Oct 15 - Dec 30 &middot; Audit Window Q4</div>
                          </div>
                          <span className="text-[9px] bg-slate-400 text-white font-bold px-1.5 py-0.5 rounded">
                            Discovery
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Bottom Split: OKRs Alignment + Major Core Release Card (Matching Screenshot 3) */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  {/* Quarterly Objectives (OKRs) Alignment */}
                  <div className="lg:col-span-2 p-5 bg-white rounded-xl border border-slate-200 shadow-sm space-y-4">
                    <div className="flex items-center justify-between">
                      <h3 className="editorial-title text-lg text-slate-900 font-serif font-normal flex items-center gap-2">
                        <Target size={16} className="text-[#4f46e5]" /> Quarterly Objectives (OKRs) Alignment
                      </h3>
                      <span className="text-[10px] font-semibold text-slate-400 bg-slate-100 px-2 py-0.5 rounded">
                        Q3 SCORECARD
                      </span>
                    </div>
                    <p className="text-xs text-slate-500 font-normal">
                      Continuous tracking of technical indicators and revenue targets mapped directly to active swimlane deliverables.
                    </p>

                    <div className="space-y-4 pt-1">
                      {/* KR 1 */}
                      <div className="space-y-1.5">
                        <div className="flex items-center justify-between text-xs">
                          <span className="font-semibold text-slate-800">KR1: Reduce API p99 latency to &lt;80ms globally</span>
                          <span className="font-mono font-bold text-indigo-600 text-sm">92%</span>
                        </div>
                        <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                          <div className="h-full bg-gradient-to-r from-indigo-500 to-emerald-500 rounded-full w-[92%]"></div>
                        </div>
                        <div className="flex items-center justify-between text-[10px] text-slate-400">
                          <span>Impacted by: Next-Gen Sync Engine</span>
                          <span className="text-emerald-600 font-medium">Exceeding Pace</span>
                        </div>
                      </div>

                      {/* KR 2 */}
                      <div className="space-y-1.5">
                        <div className="flex items-center justify-between text-xs">
                          <span className="font-semibold text-slate-800">KR2: Expand active enterprise ARR accounts by 35%</span>
                          <span className="font-mono font-bold text-indigo-600 text-sm">74%</span>
                        </div>
                        <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                          <div className="h-full bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full w-[74%]"></div>
                        </div>
                        <div className="flex items-center justify-between text-[10px] text-slate-400">
                          <span>Impacted by: Single-Sign-On &amp; RBAC</span>
                          <span className="text-slate-600 font-medium">On Track</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Strategic Target Card (Deep Royal Purple Card) */}
                  <div className="p-6 rounded-xl bg-gradient-to-br from-[#24134b] to-[#170c33] text-white space-y-4 shadow-md flex flex-col justify-between">
                    <div className="space-y-2">
                      <span className="text-[10px] uppercase font-semibold text-purple-300 tracking-wider">
                        STRATEGIC TARGET
                      </span>
                      <h3 className="text-xl font-bold tracking-tight text-white leading-tight">
                        v4.5 Major Core Release
                      </h3>
                      <p className="text-xs text-purple-200/80 leading-relaxed font-normal">
                        Target launch date: <strong className="text-white font-medium">September 28, 2026</strong>. Consolidates Sync v2 and Natural Language Workflow engines into production availability.
                      </p>
                    </div>

                    <div className="space-y-3 pt-2 border-t border-white/10">
                      <div>
                        <div className="text-[10px] text-purple-300 uppercase tracking-wider">READINESS METRIC</div>
                        <div className="text-2xl font-bold font-mono text-white">68% Composite Score</div>
                      </div>
                      <button className="w-full py-2 rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-900 font-semibold text-xs shadow-sm transition-colors">
                        Release Checklist
                      </button>
                    </div>
                  </div>
                </div>

                {/* 5-Tier Expandable Tree */}
                <div className="space-y-3 pt-4">
                  <div className="flex items-center justify-between">
                    <h3 className="editorial-title text-xl text-slate-900 font-serif font-normal">
                      Full Work Hierarchy Tree (5-Tier Rollup)
                    </h3>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={expandAllNodes}
                        className="px-2.5 py-1 rounded border border-slate-200 bg-white text-xs text-slate-600 hover:bg-slate-50"
                      >
                        Expand All
                      </button>
                      <button
                        onClick={collapseAllNodes}
                        className="px-2.5 py-1 rounded border border-slate-200 bg-white text-xs text-slate-600 hover:bg-slate-50"
                      >
                        Collapse All
                      </button>
                    </div>
                  </div>

                  {INITIAL_HIERARCHY.map((obj) => (
                    <div key={obj.id} className="p-4 rounded-xl border border-slate-200 bg-white shadow-sm space-y-3">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => toggleNode(obj.id)}
                            className="p-1 rounded bg-slate-100 hover:bg-slate-200 text-slate-600"
                          >
                            <ChevronDown size={14} className={expandedNodes[obj.id] ? "" : "-rotate-90"} />
                          </button>
                          <span className="text-[10px] font-mono font-semibold bg-purple-50 text-[#4f46e5] border border-purple-200 px-1.5 py-0.5 rounded">
                            OBJECTIVE
                          </span>
                          <span className="font-semibold text-slate-900 text-sm">{obj.title}</span>
                        </div>
                        <span className="font-mono text-xs text-slate-500">
                          {obj.completedPoints}/{obj.points} pts
                        </span>
                      </div>

                      {expandedNodes[obj.id] && obj.children && (
                        <div className="pl-6 border-l-2 border-purple-200 space-y-3">
                          {obj.children.map((proj) => (
                            <div key={proj.id} className="p-3 rounded-lg border border-slate-200 bg-slate-50/50 space-y-2">
                              <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                  <button
                                    onClick={() => toggleNode(proj.id)}
                                    className="p-0.5 rounded bg-slate-200 text-slate-600"
                                  >
                                    <ChevronDown size={12} className={expandedNodes[proj.id] ? "" : "-rotate-90"} />
                                  </button>
                                  <span className="text-[9px] font-mono bg-blue-50 text-blue-700 border border-blue-200 px-1.5 py-0.2 rounded font-semibold">
                                    PROJECT
                                  </span>
                                  <span className="text-xs font-semibold text-slate-800">{proj.title}</span>
                                </div>
                                <span className="font-mono text-[11px] text-slate-500">
                                  {proj.completedPoints}/{proj.points} pts
                                </span>
                              </div>

                              {expandedNodes[proj.id] && proj.children && (
                                <div className="pl-4 border-l-2 border-blue-200 space-y-2">
                                  {proj.children.map((epic) => (
                                    <div key={epic.id} className="p-2.5 rounded bg-white border border-slate-200 space-y-1.5">
                                      <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-2">
                                          <button
                                            onClick={() => toggleNode(epic.id)}
                                            className="p-0.5 text-slate-400"
                                          >
                                            <ChevronDown size={11} className={expandedNodes[epic.id] ? "" : "-rotate-90"} />
                                          </button>
                                          <span className="text-[9px] font-mono bg-purple-50 text-[#4f46e5] px-1.5 py-0.2 rounded font-semibold">
                                            EPIC
                                          </span>
                                          <span className="text-xs font-medium text-slate-800">{epic.title}</span>
                                        </div>
                                        <span className="text-[10px] font-mono text-slate-400">
                                          {epic.completedPoints}/{epic.points} pts
                                        </span>
                                      </div>

                                      {expandedNodes[epic.id] && epic.children && (
                                        <div className="pl-4 space-y-1 pt-1">
                                          {epic.children.map((task) => (
                                            <div key={task.id} className="flex items-center justify-between text-xs py-1 px-2 rounded bg-slate-50 border border-slate-100">
                                              <span className="font-mono text-[11px] text-slate-600">
                                                <strong className="text-[#4f46e5]">{task.id}</strong>: {task.title}
                                              </span>
                                              <span className="text-[10px] font-mono text-slate-400">{task.points} pts</span>
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
                  ))}
                </div>
              </div>
            )}

            {/* ═══════════════════════════════════════════ */}
            {/* 2. ACTIVE TASKS & BOARD (Matching Screen 2) */}
            {/* ═══════════════════════════════════════════ */}
            {activeTab === "board" && (
              <div className="space-y-6">
                {/* Header Trail matching Screenshot 2 */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div>
                    <div className="text-[10px] font-mono uppercase tracking-wider text-slate-400 mb-1">
                      INITIATIVES &gt; Starlight OS v4.2 &gt; Core Sprint 14 &middot;{" "}
                      <span className="text-emerald-600 font-semibold">&bull; Active Cadence</span>
                    </div>
                    <h1 className="editorial-title text-4xl sm:text-5xl text-slate-900 tracking-tight font-serif font-normal">
                      Active Tasks <span className="font-sans text-3xl font-light text-slate-400">&amp; Board</span>
                    </h1>
                    <p className="text-xs sm:text-sm text-slate-500 mt-1 font-normal">
                      High-conviction engineering workstreams and QA sign-offs synchronized for the Starlight OS milestone.
                    </p>
                  </div>

                  <div className="flex items-center gap-2.5">
                    <div className="flex items-center gap-2 text-xs bg-amber-50 border border-amber-200 px-3 py-1.5 rounded-lg text-amber-800 font-medium shadow-sm">
                      <Clock size={13} className="text-amber-600" />
                      <span>7 Days Remaining</span>
                      <span className="text-amber-400">&vert;</span>
                      <span className="text-[11px] text-amber-700">Cycle ends Nov 04</span>
                      <Info size={12} className="text-amber-500" />
                    </div>
                  </div>
                </div>

                {/* View Switchers + Filter Bar */}
                <div className="flex flex-wrap items-center justify-between gap-3 text-xs bg-white border border-slate-200 rounded-xl p-3 shadow-sm">
                  {/* View Toggles */}
                  <div className="flex items-center gap-1 bg-slate-100 p-0.5 rounded-lg">
                    <button
                      onClick={() => setBoardViewMode("board")}
                      className={`flex items-center gap-1.5 px-3 py-1.5 rounded transition-all ${
                        boardViewMode === "board"
                          ? "bg-white text-slate-900 font-semibold shadow-sm border border-slate-200"
                          : "text-slate-500 hover:text-slate-900"
                      }`}
                    >
                      <FolderKanban size={13} className={boardViewMode === "board" ? "text-[#321c64]" : ""} /> Board View
                    </button>
                    <button
                      onClick={() => setBoardViewMode("list")}
                      className={`flex items-center gap-1.5 px-3 py-1.5 rounded transition-all ${
                        boardViewMode === "list"
                          ? "bg-white text-slate-900 font-semibold shadow-sm border border-slate-200"
                          : "text-slate-500 hover:text-slate-900"
                      }`}
                    >
                      List View
                    </button>
                    <button
                      onClick={() => setBoardViewMode("gantt")}
                      className={`flex items-center gap-1.5 px-3 py-1.5 rounded transition-all ${
                        boardViewMode === "gantt"
                          ? "bg-white text-slate-900 font-semibold shadow-sm border border-slate-200"
                          : "text-slate-500 hover:text-slate-900"
                      }`}
                    >
                      Gantt
                    </button>
                    <button
                      onClick={() => setBoardViewMode("calendar")}
                      className={`flex items-center gap-1.5 px-3 py-1.5 rounded transition-all ${
                        boardViewMode === "calendar"
                          ? "bg-white text-slate-900 font-semibold shadow-sm border border-slate-200"
                          : "text-slate-500 hover:text-slate-900"
                      }`}
                    >
                      <Calendar size={13} className={boardViewMode === "calendar" ? "text-[#321c64]" : ""} /> Calendar
                    </button>
                  </div>

                  {/* Filter Dropdowns */}
                  <div className="flex flex-wrap items-center gap-2">
                    <select
                      value={selectedRepoFilter}
                      onChange={(e) => setSelectedRepoFilter(e.target.value)}
                      className="bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5 text-xs text-slate-700 focus:outline-none focus:border-indigo-500"
                    >
                      <option value="All Repos">All Repos (4)</option>
                      <option value="kairo/auth">kairo/auth</option>
                      <option value="kairo/frontend">kairo/frontend</option>
                      <option value="kairo/core">kairo/core</option>
                    </select>

                    <div className="flex items-center gap-1 bg-slate-50 border border-slate-200 px-2.5 py-1.5 rounded-lg text-slate-600">
                      <span>Priority</span>
                      <ChevronDown size={12} className="text-slate-400" />
                    </div>

                    <div className="flex items-center gap-1 bg-slate-50 border border-slate-200 px-2.5 py-1.5 rounded-lg text-slate-600">
                      <span>Epics 3</span>
                    </div>

                    <button
                      onClick={() => setActiveTab("board")}
                      className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-[#321c64] hover:bg-[#25144b] text-white text-xs font-semibold shadow-sm transition-all"
                    >
                      <Plus size={14} strokeWidth={2.5} /> Create Task
                    </button>
                  </div>
                </div>

                {/* ── 0. BOARD VIEW (Default 4-Column Kanban) ── */}
                {boardViewMode === "board" && (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 overflow-x-auto pb-4 tour-board">
                    {KANBAN_COLUMNS.map((colName) => {
                      const colCards = filteredCards.filter((c) => c.column === colName);
                      const colPoints = colCards.reduce((acc, c) => acc + c.points, 0);

                      const dotColor =
                        colName === "Backlog & Triaged"
                          ? "bg-slate-400"
                          : colName === "In Progress"
                          ? "bg-blue-500"
                          : colName === "In Review & Testing"
                          ? "bg-amber-500"
                          : "bg-emerald-500";

                      return (
                        <div
                          key={colName}
                          className="bg-slate-100/60 border border-slate-200 rounded-xl p-3 flex flex-col min-h-[550px]"
                        >
                          {/* Column Header */}
                          <div className="flex items-center justify-between pb-2.5 mb-2.5 border-b border-slate-200">
                            <div className="flex items-center gap-2">
                              <span className={`h-2.5 w-2.5 rounded-full ${dotColor}`}></span>
                              <span className="text-xs font-bold text-slate-800">{colName}</span>
                              <span className="text-[10px] font-mono text-slate-500 bg-white border border-slate-200 px-1.5 py-0.2 rounded">
                                {colCards.length}
                              </span>
                            </div>
                            <span className="text-[10px] font-mono text-slate-500 font-medium">
                              {colPoints} pts
                            </span>
                          </div>

                          {/* Column Cards List */}
                          <div className="space-y-3 flex-1">
                            {colCards.map((card) => (
                              <div
                                key={card.id}
                                onClick={() => setSelectedCardForDrawer(card)}
                                className={`p-3.5 rounded-xl bg-white border border-slate-200 shadow-sm hover:shadow-md hover:border-indigo-300 transition-all cursor-pointer space-y-2.5 group ${
                                  card.id === "STR-1491" ? "tour-pr ring-2 ring-indigo-500/40" : ""
                                }`}
                              >
                                {/* Top Tag & ID */}
                                <div className="flex items-center justify-between">
                                  <div className="flex items-center gap-1.5">
                                    <span className={`text-[9px] font-semibold px-2 py-0.5 rounded border uppercase tracking-wide ${card.tagColor}`}>
                                      {card.tag}
                                    </span>
                                    <span className={`text-[9px] font-semibold px-2 py-0.5 rounded border ${card.priorityColor}`}>
                                      {card.priority}
                                    </span>
                                  </div>
                                  <span className="text-[10px] font-mono text-slate-400 font-semibold">
                                    {card.id}
                                  </span>
                                </div>

                                {/* Title */}
                                <h3 className="text-xs font-bold text-slate-900 group-hover:text-[#4f46e5] transition-colors leading-snug">
                                  {card.title}
                                </h3>

                                {/* Snippet / Subtitle */}
                                <p className="text-[11px] text-slate-500 line-clamp-2 leading-relaxed font-normal">
                                  {card.description}
                                </p>

                                {/* Progress bar / Review status if applicable */}
                                {card.checklist && (
                                  <div className="space-y-1 pt-1 border-t border-slate-100">
                                    <div className="flex items-center justify-between text-[10px] text-slate-500 font-mono">
                                      <span>{card.checklist}</span>
                                    </div>
                                    {card.checklistPct !== undefined && (
                                      <div className="w-full h-1 bg-slate-100 rounded-full overflow-hidden">
                                        <div
                                          className="h-full bg-[#4f46e5] rounded-full"
                                          style={{ width: `${card.checklistPct}%` }}
                                        ></div>
                                      </div>
                                    )}
                                  </div>
                                )}

                                {card.reviewStatus && (
                                  <div className="pt-1 border-t border-slate-100 flex items-center gap-1.5 text-[10px] text-slate-600 font-medium">
                                    <CheckCircle2 size={12} className="text-emerald-500" />
                                    <span>{card.reviewStatus}</span>
                                  </div>
                                )}

                                {card.impactNote && (
                                  <div className="pt-1 border-t border-slate-100 text-[10px] text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded font-mono font-medium">
                                    {card.impactNote}
                                  </div>
                                )}

                                {/* Bottom Footer: Points, Date & Assignee Avatar */}
                                <div
                                  className="flex items-center justify-between pt-2 border-t border-slate-100 text-xs"
                                  onClick={(e) => e.stopPropagation()}
                                >
                                  <div className="flex items-center gap-2">
                                    <span className="font-mono text-[10px] bg-slate-100 text-slate-700 px-1.5 py-0.5 rounded font-semibold border border-slate-200">
                                      {card.points} pts
                                    </span>
                                    {card.dueDate && (
                                      <span className="text-[9px] text-slate-400 font-mono">{card.dueDate}</span>
                                    )}
                                  </div>

                                  <div className="flex items-center gap-1.5">
                                    <div className={`h-5 w-5 rounded-full ${card.avatarBg} text-white text-[9px] flex items-center justify-center font-bold uppercase shadow-xs`}>
                                      {card.assignee.charAt(0)}
                                    </div>
                                    {/* Shift controls */}
                                    <div className="flex items-center gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity">
                                      {colName !== "Backlog & Triaged" && (
                                        <button
                                          onClick={() => moveCard(card.id, "prev")}
                                          title="Move column left"
                                          className="h-4 w-4 rounded bg-slate-100 hover:bg-slate-200 text-slate-600 text-[9px] flex items-center justify-center font-bold"
                                        >
                                          &larr;
                                        </button>
                                      )}
                                      {colName !== "Completed / Shipped" && (
                                        <button
                                          onClick={() => moveCard(card.id, "next")}
                                          title="Move column right"
                                          className="h-4 w-4 rounded bg-slate-100 hover:bg-slate-200 text-slate-600 text-[9px] flex items-center justify-center font-bold"
                                        >
                                          &rarr;
                                        </button>
                                      )}
                                    </div>
                                  </div>
                                </div>
                              </div>
                            ))}

                            {/* Dropzone / Add button */}
                            <button
                              onClick={() => {
                                const newCard: BoardCard = {
                                  id: `STR-${Math.floor(1000 + Math.random() * 9000)}`,
                                  title: "Newly planned task",
                                  repo: "kairo/frontend",
                                  type: "issue",
                                  column: colName,
                                  points: 3,
                                  tag: "Sprint",
                                  tagColor: "bg-slate-100 text-slate-700 border-slate-200",
                                  priority: "Medium",
                                  priorityColor: "bg-slate-100 text-slate-600 border-slate-200",
                                  assignee: "aman",
                                  avatarBg: "bg-indigo-600",
                                  description: "Fast-tracked sprint package.",
                                };
                                setCards((prev) => [newCard, ...prev]);
                              }}
                              className="w-full py-2.5 rounded-lg border-2 border-dashed border-slate-200 hover:border-indigo-300 text-slate-400 hover:text-[#4f46e5] text-xs font-medium flex items-center justify-center gap-1 transition-all bg-white/40 hover:bg-white"
                            >
                              <Plus size={13} /> Add item to {colName}
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}

                {/* ── 1. CALENDAR VIEW ── */}
                {boardViewMode === "calendar" && (
                  <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6 space-y-5">
                    {/* Calendar Header */}
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-200 pb-4">
                      <div className="flex items-center gap-3">
                        <div className="h-9 w-9 rounded-lg bg-purple-50 text-[#4f46e5] flex items-center justify-center font-bold">
                          <Calendar size={18} />
                        </div>
                        <div>
                          <h2 className="editorial-title text-2xl text-slate-900 font-serif font-normal">
                            {calendarMonth}
                          </h2>
                          <p className="text-xs text-slate-400">
                            Sprint Cycle 14 &middot; Showing {filteredCards.length} scheduled delivery deliverables
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => setCalendarMonth("July 2026")}
                          className="px-2.5 py-1.5 rounded-lg border border-slate-200 text-xs font-medium text-slate-600 hover:bg-slate-50"
                        >
                          &larr; Prev
                        </button>
                        <button
                          onClick={() => setCalendarMonth("August 2026")}
                          className="px-3 py-1.5 rounded-lg bg-slate-100 text-xs font-semibold text-slate-800"
                        >
                          Today (Aug 10)
                        </button>
                        <button
                          onClick={() => setCalendarMonth("September 2026")}
                          className="px-2.5 py-1.5 rounded-lg border border-slate-200 text-xs font-medium text-slate-600 hover:bg-slate-50"
                        >
                          Next &rarr;
                        </button>
                      </div>
                    </div>

                    {/* Day Names Grid */}
                    <div className="grid grid-cols-7 gap-2 text-center text-xs font-bold text-slate-500 uppercase tracking-wider py-1 border-b border-slate-100">
                      <div>Mon</div>
                      <div>Tue</div>
                      <div>Wed</div>
                      <div>Thu</div>
                      <div>Fri</div>
                      <div>Sat</div>
                      <div>Sun</div>
                    </div>

                    {/* Calendar Days Matrix (August 2026) */}
                    <div className="grid grid-cols-7 gap-2">
                      {/* Aug 1 starts on Sat, so 5 empty slots for Mon-Fri */}
                      <div className="h-28 rounded-lg bg-slate-50/40 border border-dashed border-slate-100 p-2 text-slate-300 text-xs">27</div>
                      <div className="h-28 rounded-lg bg-slate-50/40 border border-dashed border-slate-100 p-2 text-slate-300 text-xs">28</div>
                      <div className="h-28 rounded-lg bg-slate-50/40 border border-dashed border-slate-100 p-2 text-slate-300 text-xs">29</div>
                      <div className="h-28 rounded-lg bg-slate-50/40 border border-dashed border-slate-100 p-2 text-slate-300 text-xs">30</div>
                      <div className="h-28 rounded-lg bg-slate-50/40 border border-dashed border-slate-100 p-2 text-slate-300 text-xs">31</div>

                      {/* Day 1: Sat */}
                      <div className="h-28 rounded-lg border border-slate-200 bg-white p-2 space-y-1 overflow-y-auto hover:border-indigo-300 transition-colors">
                        <div className="flex items-center justify-between text-xs">
                          <span className="font-semibold text-slate-700">1</span>
                          <span className="text-[9px] text-[#4f46e5] font-mono font-medium">Sprint Start</span>
                        </div>
                        <div
                          onClick={() => setSelectedCardForDrawer(cards.find(c => c.id === "STR-1082") || cards[0])}
                          className="p-1 rounded bg-purple-50 border border-purple-200 text-[10px] text-purple-900 font-medium truncate cursor-pointer hover:bg-purple-100"
                        >
                          STR-1082 (5pt) GraphQL
                        </div>
                      </div>

                      {/* Day 2: Sun */}
                      <div className="h-28 rounded-lg border border-slate-100 bg-slate-50/20 p-2 text-xs text-slate-400">2</div>

                      {/* Week 2: Days 3 to 9 */}
                      <div className="h-28 rounded-lg border border-slate-200 bg-white p-2 text-xs text-slate-700">3</div>
                      <div className="h-28 rounded-lg border border-slate-200 bg-white p-2 space-y-1 overflow-y-auto hover:border-indigo-300 transition-colors">
                        <div className="flex items-center justify-between text-xs">
                          <span className="font-semibold text-slate-700">4</span>
                        </div>
                        <div
                          onClick={() => setSelectedCardForDrawer(cards.find(c => c.id === "STR-1499") || cards[0])}
                          className="p-1 rounded bg-blue-50 border border-blue-200 text-[10px] text-blue-900 font-medium truncate cursor-pointer hover:bg-blue-100"
                        >
                          STR-1499 (3pt) Contrast QA
                        </div>
                      </div>
                      <div className="h-28 rounded-lg border border-slate-200 bg-white p-2 text-xs text-slate-700">5</div>
                      <div className="h-28 rounded-lg border border-slate-200 bg-white p-2 text-xs text-slate-700">6</div>
                      <div className="h-28 rounded-lg border border-slate-200 bg-white p-2 space-y-1 overflow-y-auto hover:border-indigo-300 transition-colors">
                        <div className="flex items-center justify-between text-xs">
                          <span className="font-semibold text-slate-700">7</span>
                        </div>
                        <div
                          onClick={() => setSelectedCardForDrawer(cards.find(c => c.id === "STR-1498") || cards[0])}
                          className="p-1 rounded bg-amber-50 border border-amber-200 text-[10px] text-amber-900 font-medium truncate cursor-pointer hover:bg-amber-100"
                        >
                          STR-1498 (5pt) PostgreSQL replica
                        </div>
                      </div>
                      <div className="h-28 rounded-lg border border-slate-100 bg-slate-50/20 p-2 text-xs text-slate-400">8</div>
                      <div className="h-28 rounded-lg border border-slate-100 bg-slate-50/20 p-2 text-xs text-slate-400">9</div>

                      {/* Week 3: Days 10 to 16 */}
                      <div className="h-28 rounded-lg border-2 border-[#4f46e5] bg-purple-50/30 p-2 space-y-1 overflow-y-auto shadow-sm">
                        <div className="flex items-center justify-between text-xs">
                          <span className="font-bold text-[#4f46e5]">10</span>
                          <span className="text-[9px] bg-[#4f46e5] text-white font-bold px-1.5 py-0.2 rounded">TODAY</span>
                        </div>
                        <div
                          onClick={() => setSelectedCardForDrawer(cards.find(c => c.id === "STR-1491") || cards[0])}
                          className="p-1 rounded bg-red-50 border border-red-200 text-[10px] text-red-900 font-semibold truncate cursor-pointer hover:bg-red-100"
                        >
                          STR-1491 (8pt) P0 Optimistic UI
                        </div>
                      </div>
                      <div className="h-28 rounded-lg border border-slate-200 bg-white p-2 text-xs text-slate-700">11</div>
                      <div className="h-28 rounded-lg border border-slate-200 bg-white p-2 space-y-1 overflow-y-auto hover:border-indigo-300 transition-colors">
                        <div className="flex items-center justify-between text-xs">
                          <span className="font-semibold text-slate-700">12</span>
                        </div>
                        <div
                          onClick={() => setSelectedCardForDrawer(cards.find(c => c.id === "STR-1496") || cards[0])}
                          className="p-1 rounded bg-purple-50 border border-purple-200 text-[10px] text-purple-900 font-medium truncate cursor-pointer"
                        >
                          STR-1496 (3pt) Tokens
                        </div>
                        <div
                          onClick={() => setSelectedCardForDrawer(cards.find(c => c.id === "STR-1477") || cards[0])}
                          className="p-1 rounded bg-slate-100 border border-slate-200 text-[10px] text-slate-900 font-medium truncate cursor-pointer"
                        >
                          STR-1477 (6pt) Webhooks
                        </div>
                      </div>
                      <div className="h-28 rounded-lg border border-slate-200 bg-white p-2 text-xs text-slate-700">13</div>
                      <div className="h-28 rounded-lg border border-slate-200 bg-white p-2 space-y-1 overflow-y-auto hover:border-indigo-300 transition-colors">
                        <div className="flex items-center justify-between text-xs">
                          <span className="font-semibold text-slate-700">14</span>
                          <span className="text-[9px] text-emerald-600 font-semibold">Sprint Cut</span>
                        </div>
                        <div
                          onClick={() => setSelectedCardForDrawer(cards.find(c => c.id === "STR-1459") || cards[0])}
                          className="p-1 rounded bg-emerald-50 border border-emerald-200 text-[10px] text-emerald-900 font-medium truncate cursor-pointer"
                        >
                          STR-1459 (5pt) Onboarding
                        </div>
                      </div>
                      <div className="h-28 rounded-lg border border-slate-100 bg-slate-50/20 p-2 text-xs text-slate-400">15</div>
                      <div className="h-28 rounded-lg border border-slate-100 bg-slate-50/20 p-2 text-xs text-slate-400">16</div>

                      {/* Week 4: Days 17 to 23 */}
                      <div className="h-28 rounded-lg border border-slate-200 bg-white p-2 text-xs text-slate-700">17</div>
                      <div className="h-28 rounded-lg border border-amber-300 bg-amber-50/30 p-2 space-y-1">
                        <div className="flex items-center justify-between text-xs">
                          <span className="font-bold text-amber-900">18</span>
                          <span className="text-[9px] bg-amber-500 text-white font-bold px-1 rounded">MILESTONE</span>
                        </div>
                        <div className="p-1 rounded bg-amber-100 text-[10px] font-semibold text-amber-900 leading-tight">
                          Code Freeze (v4.2)
                        </div>
                      </div>
                      <div className="h-28 rounded-lg border border-slate-200 bg-white p-2 text-xs text-slate-700">19</div>
                      <div className="h-28 rounded-lg border border-slate-200 bg-white p-2 text-xs text-slate-700">20</div>
                      <div className="h-28 rounded-lg border border-slate-200 bg-white p-2 text-xs text-slate-700">21</div>
                      <div className="h-28 rounded-lg border border-slate-100 bg-slate-50/20 p-2 text-xs text-slate-400">22</div>
                      <div className="h-28 rounded-lg border border-slate-100 bg-slate-50/20 p-2 text-xs text-slate-400">23</div>

                      {/* Week 5: Days 24 to 30 */}
                      <div className="h-28 rounded-lg border border-slate-200 bg-white p-2 text-xs text-slate-700">24</div>
                      <div className="h-28 rounded-lg border border-slate-200 bg-white p-2 text-xs text-slate-700">25</div>
                      <div className="h-28 rounded-lg border border-slate-200 bg-white p-2 text-xs text-slate-700">26</div>
                      <div className="h-28 rounded-lg border border-slate-200 bg-white p-2 text-xs text-slate-700">27</div>
                      <div className="h-28 rounded-lg border border-purple-300 bg-purple-50/30 p-2 space-y-1">
                        <div className="flex items-center justify-between text-xs">
                          <span className="font-bold text-purple-900">28</span>
                          <span className="text-[9px] bg-[#4f46e5] text-white font-bold px-1 rounded">TARGET</span>
                        </div>
                        <div className="p-1 rounded bg-purple-100 text-[10px] font-semibold text-purple-900 leading-tight">
                          Mobile App Replatforming
                        </div>
                      </div>
                      <div className="h-28 rounded-lg border border-slate-100 bg-slate-50/20 p-2 text-xs text-slate-400">29</div>
                      <div className="h-28 rounded-lg border border-slate-100 bg-slate-50/20 p-2 text-xs text-slate-400">30</div>
                    </div>
                  </div>
                )}

                {/* ── 2. LIST VIEW ── */}
                {boardViewMode === "list" && (
                  <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
                    <div className="px-5 py-4 border-b border-slate-200 flex items-center justify-between">
                      <h2 className="editorial-title text-xl text-slate-900 font-serif font-normal">
                        Active Tasks &amp; Deliverables List ({filteredCards.length})
                      </h2>
                      <span className="text-xs text-slate-500 font-mono">
                        Total Points: {filteredCards.reduce((acc, c) => acc + c.points, 0)} pts
                      </span>
                    </div>

                    <table className="w-full text-xs">
                      <thead>
                        <tr className="bg-slate-50 border-b border-slate-200 text-[10px] uppercase tracking-wider text-slate-500 font-semibold">
                          <th className="text-left py-3 px-5">ID</th>
                          <th className="text-left py-3 px-3">Title</th>
                          <th className="text-left py-3 px-3">Stage / Status</th>
                          <th className="text-left py-3 px-3">Tag &amp; Priority</th>
                          <th className="text-left py-3 px-3">Assignee</th>
                          <th className="text-left py-3 px-3">Story Points</th>
                          <th className="text-left py-3 px-4">Action</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100">
                        {filteredCards.map((c) => (
                          <tr
                            key={c.id}
                            onClick={() => setSelectedCardForDrawer(c)}
                            className="hover:bg-slate-50/70 transition-colors cursor-pointer"
                          >
                            <td className="py-3 px-5 font-mono font-bold text-[#4f46e5]">{c.id}</td>
                            <td className="py-3 px-3">
                              <div className="font-semibold text-slate-900">{c.title}</div>
                              <div className="text-[10px] text-slate-400">{c.repo}</div>
                            </td>
                            <td className="py-3 px-3" onClick={(e) => e.stopPropagation()}>
                              <select
                                value={c.column}
                                onChange={(e) => {
                                  const targetCol = e.target.value as any;
                                  setCards((prev) => prev.map((item) => item.id === c.id ? { ...item, column: targetCol } : item));
                                }}
                                className="bg-slate-50 border border-slate-200 rounded px-2 py-1 text-xs text-slate-700 font-medium"
                              >
                                {KANBAN_COLUMNS.map((col) => (
                                  <option key={col} value={col}>{col}</option>
                                ))}
                              </select>
                            </td>
                            <td className="py-3 px-3">
                              <div className="flex items-center gap-1.5">
                                <span className={`text-[9px] px-1.5 py-0.5 rounded font-semibold border ${c.tagColor}`}>{c.tag}</span>
                                <span className={`text-[9px] px-1.5 py-0.5 rounded font-semibold border ${c.priorityColor}`}>{c.priority}</span>
                              </div>
                            </td>
                            <td className="py-3 px-3">
                              <div className="flex items-center gap-1.5">
                                <div className={`h-5 w-5 rounded-full ${c.avatarBg} text-white text-[9px] flex items-center justify-center font-bold`}>
                                  {c.assignee.charAt(0)}
                                </div>
                                <span className="text-slate-700 font-medium">@{c.assignee}</span>
                              </div>
                            </td>
                            <td className="py-3 px-3 font-mono font-bold text-slate-800">{c.points} pts</td>
                            <td className="py-3 px-4">
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setSelectedCardForDrawer(c);
                                }}
                                className="text-xs text-[#4f46e5] hover:underline font-semibold"
                              >
                                View Details &rarr;
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}

                {/* ── 3. GANTT VIEW ── */}
                {boardViewMode === "gantt" && (
                  <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-5 space-y-4">
                    <div className="flex items-center justify-between border-b border-slate-200 pb-3">
                      <div>
                        <h2 className="editorial-title text-xl text-slate-900 font-serif font-normal">
                          Sprint 14 Gantt Workstream Schedule
                        </h2>
                        <p className="text-xs text-slate-400">
                          14-Day Delivery Timeline (Cycle ends Nov 04 &middot; 7 Days Remaining)
                        </p>
                      </div>
                      <span className="text-xs font-semibold text-emerald-600 bg-emerald-50 border border-emerald-200 px-2.5 py-1 rounded-full">
                        Nominal Velocity Track
                      </span>
                    </div>

                    <div className="overflow-x-auto space-y-3">
                      <div className="min-w-[700px] space-y-2">
                        {/* Day Numbers 1 to 14 */}
                        <div className="grid grid-cols-14 gap-1 text-center text-[10px] font-mono font-bold text-slate-400 pb-2 border-b border-slate-100">
                          {Array.from({ length: 14 }).map((_, i) => (
                            <div key={i} className={i === 9 ? "text-[#4f46e5] bg-purple-50 rounded" : ""}>
                              D{i + 1}
                            </div>
                          ))}
                        </div>

                        {/* Task Gantt Bars */}
                        {filteredCards.map((c, i) => {
                          const startCol = (i % 6) + 1;
                          const spanCol = Math.min(6, (c.points || 3) + 1);
                          return (
                            <div
                              key={c.id}
                              onClick={() => setSelectedCardForDrawer(c)}
                              className="p-2 rounded-lg bg-slate-50 border border-slate-200 hover:border-indigo-300 transition-colors cursor-pointer space-y-1"
                            >
                              <div className="flex items-center justify-between text-xs">
                                <span className="font-semibold text-slate-900">{c.id}: {c.title}</span>
                                <span className="font-mono text-[10px] text-slate-500 font-semibold">{c.column} &middot; {c.points} pt</span>
                              </div>
                              <div className="grid grid-cols-14 gap-1 h-3.5 bg-slate-200/50 rounded-full p-0.5 items-center">
                                <div
                                  className="h-full rounded-full bg-gradient-to-r from-indigo-500 to-purple-500 shadow-xs"
                                  style={{
                                    gridColumnStart: startCol,
                                    gridColumnEnd: `span ${spanCol}`,
                                  }}
                                ></div>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* ═══════════════════════════════════════════ */}
            {/* 3. TEAM & CAPACITY (Matching Screen 4)      */}
            {/* ═══════════════════════════════════════════ */}
            {activeTab === "team" && (
              <div className="space-y-6">
                {/* Header Area matching Screenshot 4 */}
                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                  <div>
                    <div className="text-[10px] font-mono uppercase tracking-wider text-slate-400 mb-1">
                      CAPACITY MANAGEMENT &middot; Starlight OS v4.2
                    </div>
                    <h1 className="editorial-title text-4xl sm:text-5xl text-slate-900 tracking-tight font-serif font-normal">
                      Team Capacity &amp; Velocity Insights
                    </h1>
                    <p className="text-xs sm:text-sm text-slate-500 mt-1 max-w-2xl font-normal leading-relaxed">
                      Algorithmic workload distribution, sprint burnup telemetry, and real-time guild bandwidth balancing.
                    </p>
                  </div>

                  <div className="flex flex-wrap items-center gap-3">
                    <div className="text-xs bg-white border border-slate-200 px-3 py-1.5 rounded-lg shadow-sm">
                      <span className="text-[9px] uppercase font-semibold text-slate-400 block">SELECTED GUILD</span>
                      <span className="font-semibold text-slate-800">Engineering &amp; Product (14)</span>
                    </div>
                    <div className="text-xs bg-white border border-slate-200 px-3 py-1.5 rounded-lg shadow-sm">
                      <span className="text-[9px] uppercase font-semibold text-slate-400 block">CURRENT SPRINT</span>
                      <span className="font-semibold text-slate-800">Cycle 14 (Aug 1 – Aug 14)</span>
                    </div>
                  </div>
                </div>

                {/* 4 Capacity Metrics Cards matching Screenshot 4 */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  {/* Metric 1 */}
                  <div className="p-5 rounded-xl border border-slate-200/90 bg-white shadow-sm space-y-2 hover:shadow-md transition-shadow">
                    <div className="text-[10px] font-semibold uppercase tracking-wider text-slate-400">
                      TOTAL AVAILABLE CAPACITY
                    </div>
                    <div className="text-3xl font-bold text-slate-900 font-mono">
                      340<span className="text-base text-slate-400 ml-1">hrs</span>
                    </div>
                    <div className="text-[11px] text-slate-500 font-medium">
                      Committed: 298 hrs &middot; <strong className="text-slate-800">87.6% load</strong>
                    </div>
                    <p className="text-[10px] text-slate-400">
                      Optimal band (80% - 90% target benchmark)
                    </p>
                  </div>

                  {/* Metric 2 */}
                  <div className="p-5 rounded-xl border border-slate-200/90 bg-white shadow-sm space-y-2 hover:shadow-md transition-shadow">
                    <div className="text-[10px] font-semibold uppercase tracking-wider text-slate-400">
                      SPRINT VELOCITY FORECAST
                    </div>
                    <div className="flex items-baseline gap-2">
                      <span className="text-3xl font-bold text-[#4f46e5] font-mono">86</span>
                      <span className="text-base text-slate-400 font-mono">SP</span>
                      <span className="text-[10px] font-semibold text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded">
                        +4.6% vs C13
                      </span>
                    </div>
                    <div className="text-[11px] text-slate-500">
                      Target Range: 80 - 90 SP
                    </div>
                    <p className="text-[10px] text-emerald-600 font-medium">
                      Accuracy Rating: 96.0% high
                    </p>
                  </div>

                  {/* Metric 3 */}
                  <div className="p-5 rounded-xl border border-amber-200 bg-amber-50/30 shadow-sm space-y-2 hover:shadow-md transition-shadow">
                    <div className="text-[10px] font-semibold uppercase tracking-wider text-amber-700">
                      OVERALLOCATED RESOURCE
                    </div>
                    <div className="text-3xl font-bold text-amber-700 font-mono flex items-center gap-2">
                      <AlertTriangle size={24} className="text-amber-500" />
                      1 <span className="text-sm font-sans font-normal text-amber-600">Engineer flagged</span>
                    </div>
                    <div className="text-[11px] text-amber-800 font-medium">
                      D. Chen (+4 SP overflow)
                    </div>
                    <p className="text-[10px] text-amber-700 font-semibold uppercase tracking-wider">
                      REBALANCE REQUIRED
                    </p>
                  </div>

                  {/* Metric 4 */}
                  <div className="p-5 rounded-xl border border-slate-200/90 bg-white shadow-sm space-y-2 hover:shadow-md transition-shadow">
                    <div className="text-[10px] font-semibold uppercase tracking-wider text-slate-400">
                      ON-TIME DELIVERY RATE
                    </div>
                    <div className="text-3xl font-bold text-emerald-600 font-mono">
                      94.2%
                    </div>
                    <div className="text-[11px] text-slate-500">
                      16 cycles measured
                    </div>
                    <p className="text-[10px] text-slate-400">
                      S9 - S14 Consistency: Steady
                    </p>
                  </div>
                </div>

                {/* Main Split: Workload & Assignment Matrix Table + Cadence Sidebar */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  {/* Table (2 cols) */}
                  <div className="lg:col-span-2 bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden space-y-0">
                    <div className="px-5 py-4 border-b border-slate-200 flex items-center justify-between">
                      <div>
                        <h2 className="editorial-title text-xl text-slate-900 font-serif font-normal">
                          Workload &amp; Assignment Matrix
                        </h2>
                        <p className="text-xs text-slate-400 mt-0.5">
                          Cycle 14 personal quotas, commitment thresholds, and assigned work packages
                        </p>
                      </div>
                      <span className="text-xs text-slate-400 font-mono">Filter by member or role...</span>
                    </div>

                    <table className="w-full text-xs">
                      <thead>
                        <tr className="bg-slate-50 border-b border-slate-200 text-[10px] uppercase tracking-wider text-slate-500 font-semibold">
                          <th className="text-left py-3 px-5">Team Member</th>
                          <th className="text-left py-3 px-3">Status</th>
                          <th className="text-left py-3 px-3">Load / Ceiling</th>
                          <th className="text-left py-3 px-3">Tasks &amp; Priority</th>
                          <th className="text-left py-3 px-3">Active Epics</th>
                          <th className="text-left py-3 px-4">Action</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100">
                        {TEAM_MEMBERS.map((m, i) => (
                          <tr key={i} className="hover:bg-slate-50/60 transition-colors">
                            {/* Member */}
                            <td className="py-3.5 px-5">
                              <div className="flex items-center gap-3">
                                <div className="h-8 w-8 rounded-full bg-purple-100 text-[#4f46e5] font-bold text-xs flex items-center justify-center shrink-0 border border-purple-200">
                                  {m.avatar}
                                </div>
                                <div>
                                  <div className="font-semibold text-slate-900">{m.name}</div>
                                  <div className="text-[10px] text-slate-400">{m.role}</div>
                                </div>
                              </div>
                            </td>

                            {/* Status */}
                            <td className="py-3.5 px-3">
                              <span
                                className={`inline-flex items-center gap-1.5 text-[10px] font-semibold px-2 py-0.5 rounded-full border ${
                                  m.status === "Balanced"
                                    ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                                    : m.status === "Heavy Load"
                                    ? "bg-rose-50 text-rose-700 border-rose-200"
                                    : "bg-blue-50 text-blue-700 border-blue-200"
                                }`}
                              >
                                <span
                                  className={`h-1.5 w-1.5 rounded-full ${
                                    m.status === "Balanced"
                                      ? "bg-emerald-500"
                                      : m.status === "Heavy Load"
                                      ? "bg-rose-500"
                                      : "bg-blue-500"
                                  }`}
                                ></span>
                                {m.status}
                              </span>
                            </td>

                            {/* Load / Ceiling */}
                            <td className="py-3.5 px-3">
                              <div className="font-mono font-semibold text-slate-800">{m.loadSP}</div>
                              <div className="flex items-center gap-2 pt-0.5">
                                <div className="w-16 h-1.5 bg-slate-100 rounded-full overflow-hidden">
                                  <div
                                    className={`h-full rounded-full ${
                                      m.loadPct > 100 ? "bg-rose-500" : "bg-[#4f46e5]"
                                    }`}
                                    style={{ width: `${Math.min(100, m.loadPct)}%` }}
                                  ></div>
                                </div>
                                <span className={`text-[10px] font-mono font-semibold ${m.loadPct > 100 ? "text-rose-600" : "text-slate-500"}`}>
                                  {m.loadPct}%
                                </span>
                              </div>
                            </td>

                            {/* Tasks & Priority */}
                            <td className="py-3.5 px-3">
                              <div className="flex items-center gap-2">
                                <span className="font-mono font-semibold text-slate-800">{m.tasks}</span>
                                <div className="flex items-center gap-0.5">
                                  {Array.from({ length: m.urgentCount }).map((_, ui) => (
                                    <span key={ui} className="h-3 w-1.5 rounded-xs bg-amber-500" title="Urgent Task"></span>
                                  ))}
                                  {Array.from({ length: Math.max(0, m.tasks - m.urgentCount) }).map((_, ni) => (
                                    <span key={ni} className="h-3 w-1.5 rounded-xs bg-slate-200" title="Normal Task"></span>
                                  ))}
                                </div>
                              </div>
                            </td>

                            {/* Active Epics */}
                            <td className="py-3.5 px-3">
                              <div className="flex flex-wrap gap-1">
                                {m.activeEpics.map((ep, ei) => (
                                  <span key={ei} className="text-[9px] bg-purple-50 text-[#4f46e5] border border-purple-200 px-1.5 py-0.5 rounded font-medium">
                                    {ep}
                                  </span>
                                ))}
                              </div>
                            </td>

                            {/* Action */}
                            <td className="py-3.5 px-4">
                              {m.actionLabel ? (
                                <button
                                  onClick={() => alert(`Rebalancing initiated for ${m.name}`)}
                                  className={`px-2.5 py-1 rounded text-[11px] font-semibold transition-colors ${
                                    m.actionLabel === "Rebalance"
                                      ? "bg-rose-100 hover:bg-rose-200 text-rose-800"
                                      : "bg-blue-100 hover:bg-blue-200 text-blue-800"
                                  }`}
                                >
                                  {m.actionLabel}
                                </button>
                              ) : (
                                <span className="text-[11px] text-slate-400 font-mono">&mdash;</span>
                              )}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>

                  {/* Right Sidebar: Velocity Cadence & Cycle Time Breakdown */}
                  <div className="space-y-4">
                    {/* Velocity Cadence */}
                    <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm space-y-3">
                      <div className="flex items-center justify-between">
                        <h3 className="editorial-title text-lg text-slate-900 font-serif font-normal">
                          Velocity Cadence
                        </h3>
                        <span className="text-[10px] text-slate-400 font-mono">Sprints 9-14</span>
                      </div>
                      <p className="text-[10px] text-slate-400">Planned vs. Completed Story Points</p>

                      {/* Mocked clean bar chart */}
                      <div className="flex items-end justify-between h-28 pt-4 pb-2 border-b border-slate-100 px-2 gap-2">
                        {[
                          { sprint: "S9", planned: 60, done: 58 },
                          { sprint: "S10", planned: 70, done: 68 },
                          { sprint: "S11", planned: 75, done: 74 },
                          { sprint: "S12", planned: 75, done: 72 },
                          { sprint: "S13", planned: 80, done: 82 },
                          { sprint: "S14 (Curr)", planned: 86, done: 76, current: true },
                        ].map((b, bi) => (
                          <div key={bi} className="flex-1 flex flex-col items-center gap-1">
                            <div className="w-full flex items-end justify-center gap-1 h-20">
                              <div
                                className="w-2.5 bg-slate-200 rounded-t"
                                style={{ height: `${b.planned}%` }}
                                title={`Planned: ${b.planned}`}
                              ></div>
                              <div
                                className={`w-2.5 rounded-t ${b.current ? "bg-[#4f46e5]" : "bg-indigo-400"}`}
                                style={{ height: `${b.done}%` }}
                                title={`Completed: ${b.done}`}
                              ></div>
                            </div>
                            <span className="text-[9px] font-mono text-slate-500 font-medium truncate max-w-[40px]">
                              {b.sprint}
                            </span>
                          </div>
                        ))}
                      </div>

                      <div className="flex items-center justify-between text-xs pt-1">
                        <span className="text-slate-500">Running Avg Velocity:</span>
                        <span className="font-mono font-bold text-[#4f46e5] text-sm">82.4 SP / cycle</span>
                      </div>
                    </div>

                    {/* Cycle Time Breakdown */}
                    <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm space-y-3">
                      <div className="flex items-center justify-between">
                        <h3 className="editorial-title text-lg text-slate-900 font-serif font-normal flex items-center gap-1.5">
                          <Timer size={16} className="text-[#4f46e5]" /> Cycle Time Breakdown
                        </h3>
                      </div>

                      <div className="space-y-3 text-xs">
                        {[
                          { stage: "Backlog to In-Development", duration: "1.2 days", color: "bg-blue-500" },
                          { stage: "Peer Code Review", duration: "0.8 days", badge: "OPTIMAL", color: "bg-emerald-500" },
                          { stage: "QA Verification to Prod", duration: "1.1 days", color: "bg-purple-500" },
                        ].map((st, si) => (
                          <div key={si} className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <span className={`h-2 w-2 rounded-full ${st.color}`}></span>
                              <span className="text-slate-600">{st.stage}</span>
                            </div>
                            <div className="flex items-center gap-2">
                              {st.badge && (
                                <span className="text-[9px] font-bold text-emerald-700 bg-emerald-50 px-1.5 py-0.2 rounded">
                                  {st.badge}
                                </span>
                              )}
                              <span className="font-mono font-semibold text-slate-900">{st.duration}</span>
                            </div>
                          </div>
                        ))}
                      </div>

                      <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-400">
                        <span>MEAN LEAD TIME:</span>
                        <span className="font-mono font-bold text-slate-800">3.1 days</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* ═══════════════════════════════════════════ */}
            {/* 4. ANALYTICS & VELOCITY                    */}
            {/* ═══════════════════════════════════════════ */}
            {activeTab === "velocity" && (
              <div className="space-y-6">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-5">
                  <div>
                    <h1 className="editorial-title text-4xl sm:text-5xl text-slate-900 font-serif font-normal">
                      Analytics &amp; Velocity
                    </h1>
                    <p className="text-xs sm:text-sm text-slate-500 mt-1 max-w-xl font-normal">
                      Measure capacity accuracy, burndown cadence, and delivery predictability across multi-repository teams.
                    </p>
                  </div>
                  <div className="bg-white border border-slate-200 rounded-xl p-4 text-center shrink-0 shadow-sm">
                    <span className="text-[10px] uppercase font-semibold text-slate-400 tracking-wider">Average Velocity</span>
                    <div className="text-2xl font-bold text-[#4f46e5] font-mono mt-0.5">23 pts</div>
                    <span className="text-[10px] text-slate-500 font-medium">91% team predictability</span>
                  </div>
                </div>

                {/* KPIs */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="p-4 rounded-xl border border-slate-200 bg-white space-y-1 shadow-sm">
                    <div className="flex items-center gap-1.5 text-xs text-slate-500 font-medium">
                      <Timer size={14} className="text-[#4f46e5]" /> Mean Cycle Time
                    </div>
                    <div className="text-2xl font-bold text-slate-900 font-mono">2.8 days</div>
                    <div className="text-[10px] text-emerald-600 font-medium">-0.4d vs last sprint</div>
                  </div>

                  <div className="p-4 rounded-xl border border-slate-200 bg-white space-y-1 shadow-sm">
                    <div className="flex items-center gap-1.5 text-xs text-slate-500 font-medium">
                      <Clock size={14} className="text-blue-500" /> Mean Lead Time
                    </div>
                    <div className="text-2xl font-bold text-slate-900 font-mono">6.2 days</div>
                    <div className="text-[10px] text-slate-400 font-medium">Backlog to Done</div>
                  </div>

                  <div className="p-4 rounded-xl border border-slate-200 bg-white space-y-1 shadow-sm">
                    <div className="flex items-center gap-1.5 text-xs text-slate-500 font-medium">
                      <GitPullRequest size={14} className="text-purple-500" /> PR Review Turnaround
                    </div>
                    <div className="text-2xl font-bold text-slate-900 font-mono">18 hours</div>
                    <div className="text-[10px] text-emerald-600 font-medium">Top 10% benchmark</div>
                  </div>
                </div>

                {/* Velocity History Table */}
                <div className="p-6 rounded-xl border border-slate-200 bg-white shadow-sm space-y-4">
                  <h3 className="editorial-title text-xl text-slate-900 font-serif font-normal">
                    Rolling Velocity History
                  </h3>
                  <table className="w-full text-xs">
                    <thead>
                      <tr className="border-b border-slate-200 text-slate-400 text-[10px] uppercase tracking-wider font-semibold">
                        <th className="text-left pb-2.5">Sprint</th>
                        <th className="text-left pb-2.5">Committed</th>
                        <th className="text-left pb-2.5">Completed</th>
                        <th className="text-left pb-2.5">Accuracy</th>
                        <th className="text-left pb-2.5">Trend</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {[
                        { sprint: "Sprint 42", committed: 26, completed: 18, accuracy: 69, trend: "active" },
                        { sprint: "Sprint 41", committed: 24, completed: 23, accuracy: 96, trend: "up" },
                        { sprint: "Sprint 40", committed: 22, completed: 22, accuracy: 100, trend: "stable" },
                        { sprint: "Sprint 39", committed: 28, completed: 24, accuracy: 86, trend: "down" },
                      ].map((s, i) => (
                        <tr key={i} className="text-slate-600 hover:bg-slate-50/50">
                          <td className="py-3 font-semibold text-slate-900">{s.sprint}</td>
                          <td className="py-3 font-mono">{s.committed} pts</td>
                          <td className="py-3 font-mono">{s.completed} pts</td>
                          <td className="py-3 font-mono font-semibold">
                            <span className={s.accuracy >= 90 ? "text-emerald-600" : s.accuracy >= 80 ? "text-amber-600" : "text-rose-600"}>
                              {s.accuracy}%
                            </span>
                          </td>
                          <td className="py-3">
                            <span
                              className={`text-[10px] font-semibold px-2 py-0.5 rounded ${
                                s.trend === "up"
                                  ? "bg-emerald-50 text-emerald-700"
                                  : s.trend === "stable"
                                  ? "bg-blue-50 text-blue-700"
                                  : s.trend === "active"
                                  ? "bg-purple-50 text-[#4f46e5]"
                                  : "bg-amber-50 text-amber-700"
                              }`}
                            >
                              {s.trend === "active" ? "In Progress" : s.trend === "up" ? "↑ Improving" : s.trend === "stable" ? "→ Stable" : "↓ Declining"}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* ═══════════════════════════════════════════ */}
            {/* 5. PLANNING POKER                          */}
            {/* ═══════════════════════════════════════════ */}
            {activeTab === "poker" && (
              <div className="space-y-6">
                <div>
                  <h1 className="editorial-title text-4xl sm:text-5xl text-slate-900 font-serif font-normal">
                    Planning Poker
                  </h1>
                  <p className="text-xs sm:text-sm text-slate-500 mt-1 font-normal">
                    Real-time multi-participant Fibonacci story point estimation with team consensus voting.
                  </p>
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider block">
                    Select Issue to Estimate:
                  </label>
                  <select
                    value={selectedPokerIssue}
                    onChange={(e) => {
                      setSelectedPokerIssue(e.target.value);
                      setPokerRevealed(false);
                      setPokerAppliedSuccess(false);
                    }}
                    className="w-full max-w-md bg-white border border-slate-200 rounded-xl py-2.5 px-3 text-xs text-slate-800 focus:outline-none focus:border-indigo-500 shadow-sm"
                  >
                    {cards.filter((c) => c.column !== "Completed / Shipped").map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.id}: {c.title.slice(0, 50)}...
                      </option>
                    ))}
                  </select>
                </div>

                <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-1.5 shadow-sm">
                  <span className="text-[10px] font-mono text-[#4f46e5] font-semibold">
                    ESTIMATING {selectedPokerIssue}
                  </span>
                  <h3 className="text-sm sm:text-base font-semibold text-slate-900">
                    {cards.find((c) => c.id === selectedPokerIssue)?.title}
                  </h3>
                  <p className="text-xs text-slate-500 font-normal">
                    {cards.find((c) => c.id === selectedPokerIssue)?.description}
                  </p>
                </div>

                {/* Fibonacci Cards */}
                <div className="space-y-3">
                  <label className="text-xs font-semibold text-slate-700 uppercase tracking-wider block">
                    Select Your Estimate Card:
                  </label>
                  <div className="flex flex-wrap gap-2.5">
                    {[1, 2, 3, 5, 8, 13, 21].map((pt) => (
                      <button
                        key={pt}
                        onClick={() => setSelectedPokerPoint(pt)}
                        className={`h-16 w-12 rounded-xl border font-mono font-bold text-base flex items-center justify-center transition-all ${
                          selectedPokerPoint === pt
                            ? "bg-[#4f46e5] text-white border-[#4f46e5] scale-105 shadow-md shadow-indigo-300/40"
                            : "bg-white text-slate-700 border-slate-200 hover:border-purple-300 hover:bg-purple-50"
                        }`}
                      >
                        {pt}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Votes & Consensus */}
                <div className="pt-4 border-t border-slate-200 space-y-4">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-slate-500 font-medium">Teammate Votes (4 Submitted):</span>
                    <button
                      onClick={() => setPokerRevealed(!pokerRevealed)}
                      className="text-xs font-semibold text-[#4f46e5] hover:text-[#4338ca] transition-colors"
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
                        className="p-3 rounded-xl bg-white border border-slate-200 flex items-center justify-between text-xs shadow-sm"
                      >
                        <span className="text-slate-700 font-medium">{t.user}</span>
                        <span className="font-mono font-semibold bg-purple-50 text-[#4f46e5] border border-purple-200 px-2 py-0.5 rounded-md">
                          {pokerRevealed ? `${t.vote} pts` : "Voted ✓"}
                        </span>
                      </div>
                    ))}
                  </div>

                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-2">
                    <div className="text-xs text-slate-600">
                      Consensus: <strong className="text-slate-900 font-semibold">5 Story Points</strong> (Strong Agreement)
                    </div>
                    <button
                      onClick={applyConsensusEstimate}
                      className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#4f46e5] hover:bg-[#4338ca] text-white font-semibold text-xs shadow-sm transition-all"
                    >
                      <Check size={14} /> Apply {selectedPokerPoint || 5} pts to Issue
                    </button>
                  </div>

                  {pokerAppliedSuccess && (
                    <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-800 flex items-center gap-2 font-medium">
                      <CheckCircle2 size={15} /> Successfully updated {selectedPokerIssue} to {selectedPokerPoint} story points in Board &amp; Hierarchy!
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* ═══════════════════════════════════════════ */}
            {/* 6. RELEASES & MILESTONES                   */}
            {/* ═══════════════════════════════════════════ */}
            {activeTab === "releases" && (
              <div className="space-y-6">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div>
                    <h1 className="editorial-title text-4xl sm:text-5xl text-slate-900 font-serif font-normal">
                      Multi-Repo Releases &amp; Milestones
                    </h1>
                    <p className="text-xs sm:text-sm text-slate-500 mt-1 font-normal">
                      Track multi-repository release targets, scope creep, and delivery burnup towards code freeze.
                    </p>
                  </div>
                  <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#4f46e5] hover:bg-[#4338ca] text-white text-xs font-semibold shadow-sm transition-all">
                    <Plus size={14} /> Create Release Target
                  </button>
                </div>

                <div className="space-y-4">
                  {releases.map((rel) => {
                    const pct = Math.round((rel.completedPoints / rel.totalPoints) * 100);
                    return (
                      <div
                        key={rel.id}
                        className="p-5 rounded-xl border border-slate-200 bg-white space-y-4 shadow-sm hover:shadow-md transition-shadow"
                      >
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                          <div className="flex items-center gap-2.5">
                            <span className="font-mono text-xs font-semibold bg-purple-50 text-[#4f46e5] px-2 py-0.5 rounded border border-purple-200">
                              {rel.tag}
                            </span>
                            <h3 className="text-base font-bold text-slate-900">{rel.title}</h3>
                          </div>
                          <span className="text-xs font-medium px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 w-max">
                            {rel.status}
                          </span>
                        </div>

                        <div className="space-y-1.5">
                          <div className="flex justify-between text-xs">
                            <span className="text-slate-500 font-normal">Release Scope Completion</span>
                            <span className="font-mono font-medium text-slate-800">
                              {rel.completedPoints} / {rel.totalPoints} pts ({pct}%)
                            </span>
                          </div>
                          <div className="w-full h-1.5 rounded-full bg-slate-100 overflow-hidden">
                            <div
                              className="h-full bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full"
                              style={{ width: `${pct}%` }}
                            ></div>
                          </div>
                        </div>

                        <div className="flex flex-wrap items-center justify-between gap-3 pt-2 text-xs text-slate-500 border-t border-slate-100">
                          <div className="flex items-center gap-2">
                            <Calendar size={13} className="text-[#4f46e5]" /> Target Release:{" "}
                            <strong className="text-slate-800 font-semibold">{rel.targetDate}</strong>
                          </div>
                          <div className="flex items-center gap-1.5">
                            <GitFork size={13} className="text-slate-400" /> Repos:{" "}
                            <span className="font-mono text-slate-700">{rel.repos.join(", ")}</span>
                          </div>
                          <div className="text-[11px] font-mono text-amber-700">
                            Scope Creep: +{rel.scopeAddedPoints} pts post-freeze
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* ═══════════════════════════════════════════ */}
            {/* 7. DEPENDENCIES & BLOCKERS                 */}
            {/* ═══════════════════════════════════════════ */}
            {activeTab === "dependencies" && (
              <div className="space-y-6">
                <div>
                  <h1 className="editorial-title text-4xl sm:text-5xl text-slate-900 font-serif font-normal">
                    Dependencies &amp; Blockers Matrix
                  </h1>
                  <p className="text-xs sm:text-sm text-slate-500 mt-1 font-normal">
                    Map cross-repository prerequisite chains to eliminate engineering bottlenecks before sprint start.
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="p-5 rounded-xl border border-rose-200 bg-rose-50/40 space-y-3 shadow-sm">
                    <div className="flex items-center gap-2 text-rose-700 font-semibold text-xs uppercase tracking-wider">
                      <Lock size={15} /> Blocked Item Dependency #1
                    </div>
                    <div className="space-y-2 text-xs">
                      <div className="p-3 rounded-lg bg-white border border-slate-200 shadow-xs">
                        <span className="font-mono text-rose-700 font-bold">STR-1499</span>: Accessibility audit for high-contrast ratios
                      </div>
                      <div className="text-slate-600 pl-3.5 border-l-2 border-rose-300 text-[11px]">
                        Is blocked by: <span className="font-mono text-[#4f46e5] font-bold">STR-1496</span> (Dark/Light transition tokens)
                      </div>
                    </div>
                    <div className="text-[11px] text-slate-500 pt-1 font-normal">
                      Status: STR-1496 is in peer review. Merging STR-1496 will automatically clear this blocker flag.
                    </div>
                  </div>

                  <div className="p-5 rounded-xl border border-amber-200 bg-amber-50/40 space-y-3 shadow-sm">
                    <div className="flex items-center gap-2 text-amber-800 font-semibold text-xs uppercase tracking-wider">
                      <AlertTriangle size={15} /> Blocking Item Dependency #2
                    </div>
                    <div className="space-y-2 text-xs">
                      <div className="p-3 rounded-lg bg-white border border-slate-200 shadow-xs">
                        <span className="font-mono text-amber-800 font-bold">STR-1491</span>: Implement optimistic UI updates
                      </div>
                      <div className="text-slate-600 pl-3.5 border-l-2 border-amber-400 text-[11px]">
                        Blocks downstream: <span className="font-mono text-slate-700 font-bold">STR-1082</span> in <code className="bg-slate-100 px-1 rounded">kairo/auth</code>
                      </div>
                    </div>
                    <div className="text-[11px] text-slate-500 pt-1 font-normal">
                      Status: High priority PR requiring decision drift validation.
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* ═══════════════════════════════════════════ */}
            {/* 8. WORKFLOW AUTOMATIONS                    */}
            {/* ═══════════════════════════════════════════ */}
            {activeTab === "automations" && (
              <div className="space-y-6">
                <div>
                  <h1 className="editorial-title text-4xl sm:text-5xl text-slate-900 font-serif font-normal">
                    Automated Workflow Rules Engine
                  </h1>
                  <p className="text-xs sm:text-sm text-slate-500 mt-1 font-normal">
                    Set up triggers and actions between GitHub pull requests, commits, and kanban pipeline columns.
                  </p>
                </div>

                <div className="space-y-3">
                  {rules.map((rule) => (
                    <div
                      key={rule.id}
                      className="p-4 sm:p-5 rounded-xl border border-slate-200 bg-white flex items-center justify-between hover:shadow-sm transition-shadow"
                    >
                      <div className="space-y-1">
                        <div className="flex items-center gap-2 text-xs font-bold text-[#4f46e5]">
                          <Sparkles size={13} /> Rule #{rule.id}: {rule.title}
                        </div>
                        <div className="text-xs text-slate-700">
                          <span className="text-slate-400 font-medium">Trigger:</span> {rule.trigger}
                        </div>
                        <div className="text-xs text-slate-500">
                          <span className="text-slate-400 font-medium">Action:</span> {rule.action}
                        </div>
                      </div>

                      <button
                        onClick={() => toggleRule(rule.id)}
                        className={`px-3 py-1 rounded-full text-xs font-semibold transition-all ${
                          rule.enabled
                            ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                            : "bg-slate-100 text-slate-400 border border-slate-200"
                        }`}
                      >
                        {rule.enabled ? "Active" : "Disabled"}
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* ═══════════════════════════════════════════ */}
            {/* 9. CODEBASE X-RAY                          */}
            {/* ═══════════════════════════════════════════ */}
            {activeTab === "xray" && (
              <div className="space-y-6">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div>
                    <h1 className="editorial-title text-4xl sm:text-5xl text-slate-900 font-serif font-normal">
                      Codebase X-Ray &amp; Fragility Signals
                    </h1>
                    <p className="text-xs sm:text-sm text-slate-500 mt-1 font-normal">
                      Rank codebase files by explainable fragility signals, change velocity, and author knowledge concentration.
                    </p>
                  </div>
                  <button
                    onClick={() => setActiveTab("impact")}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#4f46e5] hover:bg-[#4338ca] text-white text-xs font-semibold shadow-sm transition-all"
                  >
                    <ShieldAlert size={14} /> Run Impact Scan
                  </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="p-4 rounded-xl border border-slate-200 bg-white space-y-1 shadow-sm">
                    <div className="flex items-center gap-1.5 text-xs text-slate-500 font-medium">
                      <FileCode2 size={14} className="text-[#4f46e5]" /> Monitored Files
                    </div>
                    <div className="text-2xl font-bold text-slate-900 font-mono">14 modules</div>
                    <div className="text-[10px] text-slate-400">Across 4 connected repositories</div>
                  </div>

                  <div className="p-4 rounded-xl border border-slate-200 bg-white space-y-1 shadow-sm">
                    <div className="flex items-center gap-1.5 text-xs text-slate-500 font-medium">
                      <Users size={14} className="text-purple-500" /> Knowledge Concentration
                    </div>
                    <div className="text-2xl font-bold text-purple-700 font-mono">2 files</div>
                    <div className="text-[10px] text-purple-600">&le; 1 primary contributor</div>
                  </div>

                  <div className="p-4 rounded-xl border border-slate-200 bg-white space-y-1 shadow-sm">
                    <div className="flex items-center gap-1.5 text-xs text-slate-500 font-medium">
                      <Activity size={14} className="text-amber-500" /> High Churn Volume
                    </div>
                    <div className="text-2xl font-bold text-amber-700 font-mono">3 hotspots</div>
                    <div className="text-[10px] text-amber-600">&gt; 60% of total repo edits</div>
                  </div>
                </div>

                <div className="p-6 rounded-xl border border-slate-200 bg-white space-y-4 shadow-sm">
                  <div className="flex items-center justify-between">
                    <h3 className="editorial-title text-xl text-slate-900 font-serif font-normal">
                      Explainable Fragility Hotspots
                    </h3>
                    <span className="text-xs text-slate-400">Ranked by composite change and author risk</span>
                  </div>

                  <div className="space-y-3">
                    {xrayHotspots.map((item, idx) => {
                      const signalBadge =
                        item.signal === "knowledge concentration"
                          ? "bg-purple-50 text-purple-700 border-purple-200"
                          : item.signal === "high change volume"
                          ? "bg-amber-50 text-amber-700 border-amber-200"
                          : "bg-slate-100 text-slate-600 border-slate-200";

                      return (
                        <div
                          key={idx}
                          className="p-4 rounded-lg border border-slate-200 bg-slate-50/50 hover:bg-white hover:shadow-sm transition-all space-y-3"
                        >
                          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                            <div className="flex items-center gap-2 min-w-0">
                              <FileCode2 size={16} className="text-[#4f46e5] shrink-0" />
                              <span className="font-mono text-xs text-slate-900 font-semibold truncate">
                                {item.path}
                              </span>
                              {item.activePr && (
                                <span className="text-[9px] font-mono bg-purple-50 text-[#4f46e5] border border-purple-200 px-1.5 py-0.5 rounded shrink-0 font-semibold">
                                  {item.activePr} Active
                                </span>
                              )}
                            </div>
                            <div className="flex items-center gap-2 shrink-0">
                              <span className={`text-[10px] font-mono px-2 py-0.5 rounded border capitalize ${signalBadge}`}>
                                {item.signal}
                              </span>
                              <span className="font-mono text-xs font-bold text-amber-700 bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
                                Risk {item.risk_score}
                              </span>
                            </div>
                          </div>

                          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-2 border-t border-slate-200 text-[11px] text-slate-500">
                            <div>
                              <span className="text-slate-400 block text-[10px]">Changes</span>
                              <strong className="text-slate-800 font-mono">{item.changes} edits</strong>
                            </div>
                            <div>
                              <span className="text-slate-400 block text-[10px]">Contributors</span>
                              <strong className="text-slate-800 font-mono">{item.authors} authors</strong>
                            </div>
                            <div>
                              <span className="text-slate-400 block text-[10px]">PR Modifications</span>
                              <strong className="text-slate-800 font-mono">{item.pr_changes} PRs</strong>
                            </div>
                            <div>
                              <span className="text-slate-400 block text-[10px]">Last Churned</span>
                              <span className="text-slate-700 font-mono">{item.lastModified}</span>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            )}

            {/* ═══════════════════════════════════════════ */}
            {/* 10. IMPACT & DECISION DRIFT                */}
            {/* ═══════════════════════════════════════════ */}
            {activeTab === "impact" && (
              <div className="space-y-6 tour-decisions">
                <div>
                  <h1 className="editorial-title text-4xl sm:text-5xl text-slate-900 font-serif font-normal">
                    Decision Drift &amp; PR Impact Scanner
                  </h1>
                  <p className="text-xs sm:text-sm text-slate-500 mt-1 font-normal">
                    Scans pull requests for contradictions against historical architectural decisions.
                  </p>
                </div>

                <div className="p-4 sm:p-5 rounded-xl border border-amber-200 bg-amber-50/50 space-y-2.5 shadow-sm">
                  <div className="flex items-center gap-2 text-amber-800 font-semibold text-xs sm:text-sm">
                    <AlertTriangle size={16} /> High Impact Risk Flagged on PR #142
                  </div>
                  <p className="text-xs text-slate-600 leading-relaxed font-normal">
                    PR #142 alters <code className="bg-white border border-slate-200 px-1 py-0.2 rounded font-mono">fastapi/applications.py</code> and modifies authentication handler interfaces.
                    This conflicts with architectural decision #42 (&quot;Stateless JWT requirement&quot;) and introduces
                    potential backward-incompatibility for third-party middleware plugins.
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
                  <div className="p-5 rounded-xl border border-slate-200 bg-white space-y-2 shadow-sm">
                    <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-400">Decision Drift Index</h3>
                    <div className="flex items-center gap-4 pt-1">
                      <div className="text-3xl font-bold text-amber-600 font-mono">72 / 100</div>
                      <div className="text-xs text-slate-500 font-normal">
                        Elevated divergence detected between recent commit delta and recorded decision interval.
                      </div>
                    </div>
                  </div>

                  <div className="p-5 rounded-xl border border-slate-200 bg-white space-y-2 shadow-sm">
                    <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-400">Engineering Evolution Score</h3>
                    <div className="flex items-center gap-4 pt-1">
                      <div className="text-3xl font-bold text-emerald-600 font-mono">88 / 100</div>
                      <div className="text-xs text-slate-500 font-normal">
                        Steady commit cadence, healthy code review turnaround, and low file churn cycles.
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* ═══════════════════════════════════════════ */}
            {/* 11. ASK KIARO AI                           */}
            {/* ═══════════════════════════════════════════ */}
            {activeTab === "ask" && (
              <div className="space-y-6 tour-ask">
                <div>
                  <h1 className="editorial-title text-4xl sm:text-5xl text-slate-900 font-serif font-normal">
                    Ask KIARO Knowledge Graph
                  </h1>
                  <p className="text-xs sm:text-sm text-slate-500 mt-1 font-normal">
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
                      className="text-xs bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 px-3 py-1.5 rounded-full transition-colors shadow-sm font-medium"
                    >
                      &quot;{sugg}&quot;
                    </button>
                  ))}
                </div>

                <div className="rounded-xl border border-slate-200 bg-white p-5 min-h-[350px] max-h-[500px] overflow-y-auto space-y-3.5 shadow-sm">
                  {chatHistory.map((msg, idx) => (
                    <div
                      key={idx}
                      className={`flex flex-col ${msg.role === "user" ? "items-end" : "items-start"}`}
                    >
                      <div
                        className={`max-w-2xl rounded-2xl px-4 py-3 text-xs leading-relaxed ${
                          msg.role === "user"
                            ? "bg-[#4f46e5] text-white font-medium"
                            : "bg-slate-50 border border-slate-200 text-slate-800"
                        }`}
                      >
                        <p className="whitespace-pre-line">{msg.text}</p>
                        {msg.citations && msg.citations.length > 0 && (
                          <div className="mt-3 pt-2.5 border-t border-slate-200 space-y-1">
                            <span className="text-[10px] font-bold uppercase tracking-wider text-[#4f46e5] block">
                              Grounded Citations &amp; Graph Provenance:
                            </span>
                            {msg.citations.map((c, cIdx) => (
                              <div key={cIdx} className="text-[10px] text-slate-500 font-mono">
                                &bull; {c}
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
                  className="flex gap-2.5"
                >
                  <input
                    type="text"
                    value={chatInput}
                    onChange={(e) => setChatInput(e.target.value)}
                    placeholder="Ask about project hierarchy, velocity, sprint decisions..."
                    className="flex-1 bg-white border border-slate-200 rounded-xl px-4 py-2.5 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-200 transition-all shadow-sm"
                  />
                  <button
                    type="submit"
                    className="px-5 py-2.5 rounded-xl bg-[#4f46e5] text-white font-semibold text-xs hover:bg-[#4338ca] transition-colors shrink-0 shadow-sm"
                  >
                    Query Graph
                  </button>
                </form>
              </div>
            )}
          </div>
        </main>

        {/* Bottom Status Bar matching Reference Status Bar */}
        <div className="h-9 flex items-center justify-between px-6 border-t border-slate-200 bg-white text-[11px] text-slate-400 shrink-0 select-none shadow-[0_-1px_2px_rgba(0,0,0,0.02)]">
          <div className="flex items-center gap-3">
            <span className="flex items-center gap-1.5 font-mono text-slate-600 font-medium">
              <GitBranch size={13} className="text-[#4f46e5]" /> shruti1
            </span>
            <span className="flex items-center gap-1 text-emerald-600 font-semibold">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse"></span> Synced
            </span>
          </div>
          <div className="flex items-center gap-4 text-slate-500 font-mono text-[10px]">
            <span>INITIATIVE VAULT: 78.4 GB / 100 GB</span>
          </div>
        </div>
      </div>

      {/* Card Detail Modal */}
      {selectedCardForDrawer && (
        <div
          className="fixed inset-0 bg-slate-900/30 backdrop-blur-xs z-50 flex items-center justify-center p-4 transition-all"
          onClick={() => setSelectedCardForDrawer(null)}
        >
          <div
            className="bg-white border border-slate-200 rounded-2xl max-w-lg w-full p-6 space-y-5 shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-start justify-between gap-3">
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-mono text-xs text-[#4f46e5] font-bold">
                    {selectedCardForDrawer.id}
                  </span>
                  <span className="text-[10px] bg-slate-100 text-slate-600 border border-slate-200 px-2 py-0.5 rounded font-mono font-medium">
                    {selectedCardForDrawer.repo}
                  </span>
                </div>
                <h3 className="text-base font-bold text-slate-900 mt-1">{selectedCardForDrawer.title}</h3>
              </div>
              <button
                onClick={() => setSelectedCardForDrawer(null)}
                className="text-slate-400 hover:text-slate-600 p-1 rounded-lg hover:bg-slate-100 transition-colors"
              >
                <X size={18} />
              </button>
            </div>

            <p className="text-xs text-slate-600 leading-relaxed font-normal">
              {selectedCardForDrawer.description || "No extended description provided."}
            </p>

            <div className="grid grid-cols-2 gap-3 p-3.5 rounded-xl bg-slate-50 border border-slate-200 text-xs">
              <div>
                <span className="text-[10px] uppercase font-semibold text-slate-400 block mb-0.5">Stage</span>
                <span className="text-slate-800 font-semibold">{selectedCardForDrawer.column}</span>
              </div>
              <div>
                <span className="text-[10px] uppercase font-semibold text-slate-400 block mb-0.5">Estimate</span>
                <span className="font-mono text-[#4f46e5] font-bold">
                  {selectedCardForDrawer.points} Story Points
                </span>
              </div>
              <div>
                <span className="text-[10px] uppercase font-semibold text-slate-400 block mb-0.5">Assignee</span>
                <span className="text-slate-700 font-medium">@{selectedCardForDrawer.assignee}</span>
              </div>
              <div>
                <span className="text-[10px] uppercase font-semibold text-slate-400 block mb-0.5">Priority</span>
                <span className="text-amber-600 font-semibold">{selectedCardForDrawer.priority}</span>
              </div>
            </div>

            <div className="p-3.5 rounded-xl bg-purple-50 border border-purple-200 text-xs space-y-1">
              <span className="text-[10px] uppercase font-bold text-[#4f46e5] block">Hierarchy Linkage</span>
              <div className="text-purple-800 flex items-center gap-1.5 flex-wrap font-mono text-[11px]">
                <span>OBJ-2026-Q3</span> &rarr; <span>PROJ-1</span> &rarr;{" "}
                <span>{selectedCardForDrawer.epic || "Direct Task"}</span> &rarr;{" "}
                <strong className="text-slate-900 font-bold">{selectedCardForDrawer.id}</strong>
              </div>
            </div>

            <div className="flex justify-end pt-2">
              <button
                onClick={() => setSelectedCardForDrawer(null)}
                className="px-4 py-2 rounded-lg bg-slate-100 hover:bg-slate-200 border border-slate-200 text-xs text-slate-700 font-semibold transition-colors"
              >
                Close Details
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function MilestoneIcon() {
  return (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M18 6L6 18M6 6l12 12" />
    </svg>
  );
}
