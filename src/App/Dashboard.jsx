import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import Chatbot from "../components/chatbot/VityaChatbot";
import ChatHistory from "../components/chatbot/ChatHistory";
import Presentation from "../components/presentation/Presentation";
import { resolveAssetUrl } from "../services/api";
import { useAuth } from "../context/AuthContext";
import "./Dashboard.css";

import NotesApp from "../components/apps/NotesApp";
import CalendarApp from "../components/apps/CalendarApp";
import FilesApp from "../components/apps/FilesApp";
import TasksApp from "../components/apps/TasksApp";
import AnalyticsApp from "../components/apps/AnalyticsApp";
import SavingsApp from "../components/apps/SavingsApp";
import SubscriptionsApp from "../components/apps/SubscriptionsApp";
import FinancialHealthApp from "../components/apps/FinancialHealthApp";
import DoraHealthApp from "../components/apps/DoraHealthApp";
import FinanceApp from "../components/apps/FinanceApp";
import ResearchApp from "../components/apps/ResearchApp";
import ScanLedgerApp from "../components/apps/ScanLedgerApp";
import AutomationsApp from "../components/apps/AutomationsApp";
import VoiceNotesApp from "../components/apps/VoiceNotesApp";
import Profile from "../components/auth/Profile";
import ProfileEdit from "../components/auth/ProfileEdit";
import Sidebar from "../components/sidebar/Sidebar";
import AppsWorkspace from "../components/apps/AppsWorkspace";
import CommandPalette from "../components/common/CommandPalette";
import AmbientVoiceOrbModal from "../components/common/AmbientVoiceOrbModal";
import NotificationBell from "../components/notifications/NotificationBell";
import { Search, Columns, Mic } from "lucide-react";
import {
  SettingsPage,
  HelpSupportPage,
  SecurityPrivacyPage,
  SubscriptionPage,
  NotificationsPage,
  AppearancePage,
  AboutPage,
} from "../components/profile";

const APP_REGISTRY = [
  {
    id: "chat",
    name: "AI Chat",
    desc: "Get instant answers, generate content, and solve problems with advanced AI.",
    icon: "chat",
    type: "internal",
    category: "ai",
    tags: ["AI", "Productivity"],
    keywords: ["chat", "gpt", "chatbot", "ai", "assistant", "conversation", "prompt", "answers"],
    iconBg: "linear-gradient(135deg, #7c3aed 0%, #6366f1 100%)",
    context: "Continue your last conversation",
    popularity: 100,
  },
  {
    id: "presentation",
    name: "Prompt to PPT",
    desc: "Turn your ideas into beautiful presentations in seconds with AI.",
    icon: "presentation",
    type: "internal",
    category: "productivity",
    tags: ["AI", "Productivity"],
    keywords: ["presentation", "ppt", "powerpoint", "slides", "deck", "pitch", "export", "ai"],
    iconBg: "linear-gradient(135deg, #ea580c 0%, #f97316 50%, #ef4444 100%)",
    context: "Create stunning presentations with AI",
    popularity: 98,
  },
  {
    id: "notes",
    name: "Smart Notes",
    desc: "Take notes, organize ideas and summarize content with AI assistance.",
    icon: "notes",
    type: "internal",
    category: "productivity",
    tags: ["Productivity", "AI"],
    keywords: ["notes", "ideas", "writing", "scratchpad", "text", "docs", "smart notes"],
    iconBg: "linear-gradient(135deg, #f59e0b 0%, #d97706 100%)",
    context: "Access quick scratchpad & formatted docs",
    popularity: 92,
    component: NotesApp,
  },
  {
    id: "tasks",
    name: "Task Manager",
    desc: "Organize tasks, set reminders and boost your productivity.",
    icon: "tasks",
    type: "internal",
    category: "productivity",
    tags: ["Productivity"],
    keywords: ["tasks", "todos", "work", "checklist", "tracking", "goals", "manager"],
    iconBg: "linear-gradient(135deg, #10b981 0%, #059669 100%)",
    context: "Review open checklists & action items",
    popularity: 90,
    component: TasksApp,
  },
  {
    id: "finance",
    name: "Financial Planner",
    desc: "Plan budgets, track expenses and build financial models with ease.",
    icon: "finance",
    type: "internal",
    category: "finance",
    tags: ["Finance", "Productivity"],
    keywords: ["finance", "expenses", "income", "money", "budget", "cashflow", "tracking", "planner", "fei"],
    iconBg: "linear-gradient(135deg, #2563eb 0%, #0284c7 100%)",
    context: "Manage budget, expenses & cashflow",
    popularity: 88,
    component: FinanceApp,
  },
  {
    id: "analytics",
    name: "Analytics Studio",
    desc: "Visualize data, create charts and gain insights from your data.",
    icon: "analytics",
    type: "internal",
    category: "finance",
    tags: ["Analytics", "Data"],
    keywords: ["analytics", "charts", "graphs", "statistics", "reports", "insights", "data"],
    iconBg: "linear-gradient(135deg, #ec4899 0%, #db2777 100%)",
    context: "Visualize activity & metric trends",
    popularity: 84,
    component: AnalyticsApp,
  },
  {
    id: "files",
    name: "Cloud Files",
    desc: "Store, manage and access your files from anywhere in the cloud.",
    icon: "files",
    type: "internal",
    category: "productivity",
    tags: ["Cloud", "Storage"],
    keywords: ["files", "documents", "storage", "upload", "pdf", "folders", "cloud"],
    iconBg: "linear-gradient(135deg, #0284c7 0%, #0ea5e9 100%)",
    context: "Browse workspace files & storage",
    popularity: 82,
    component: FilesApp,
  },
  {
    id: "research",
    name: "News & Research",
    desc: "Get latest news, research articles and insights from trusted sources.",
    icon: "research",
    type: "internal",
    category: "ai",
    tags: ["Research", "News"],
    keywords: ["research", "papers", "pdf", "documents", "deep research", "citations", "concept graph", "study", "analysis", "news"],
    iconBg: "linear-gradient(135deg, #0d9488 0%, #06b6d4 100%)",
    context: "Explore synthesized research papers",
    popularity: 86,
    component: ResearchApp,
  },
  {
    id: "dora",
    name: "DORA Health AI",
    desc: "Doctor AI, Symptom Diagnosis & Clinical Wellness Triage",
    icon: "dora",
    type: "internal",
    category: "ai",
    tags: ["AI", "Healthcare"],
    keywords: ["health", "doctor", "symptoms", "diagnosis", "medical", "dora", "ai", "wellness"],
    iconBg: "linear-gradient(135deg, #06b6d4 0%, #0284c7 50%, #2563eb 100%)",
    context: "Check clinical health & lab report insights",
    popularity: 89,
    component: DoraHealthApp,
  },
  {
    id: "scan-ledger",
    name: "AI Vision & Receipt Ledger",
    desc: "Scan receipts & bills with Gemini Vision, extract items and auto-post to database.",
    icon: "scan-ledger",
    type: "internal",
    category: "finance",
    tags: ["Finance", "AI"],
    keywords: ["receipt", "scan", "ledger", "invoice", "vision", "camera", "bills", "ocr", "bookkeeping", "expenses", "income"],
    iconBg: "linear-gradient(135deg, #10b981 0%, #059669 50%, #047857 100%)",
    context: "Scan physical receipts with Gemini OCR",
    popularity: 85,
    component: ScanLedgerApp,
  },
  {
    id: "automations",
    name: "Neural Automations",
    desc: "Cross-app triggers, autonomous task generation & scheduled routines.",
    icon: "automations",
    type: "internal",
    category: "ai",
    tags: ["AI", "Productivity"],
    keywords: ["automations", "routines", "triggers", "workflow", "mother routines", "zapier", "scheduler", "cron", "ai"],
    iconBg: "linear-gradient(135deg, #8b5cf6 0%, #ec4899 50%, #f59e0b 100%)",
    context: "Automate background workflow triggers",
    popularity: 80,
    component: AutomationsApp,
  },
  {
    id: "voice-notes",
    name: "Voice Notes & Audio Brain",
    desc: "In-browser ambient voice recorder, Whisper speech transcription & automated workspace injection.",
    icon: "voice-notes",
    type: "internal",
    category: "ai",
    tags: ["AI", "Productivity"],
    keywords: ["voice", "audio", "recording", "meeting", "whisper", "speech", "transcription", "microphone", "sound", "notes", "action items"],
    iconBg: "linear-gradient(135deg, #a855f7 0%, #6366f1 50%, #38bdf8 100%)",
    context: "Record meetings & transcribe voice notes",
    popularity: 81,
    component: VoiceNotesApp,
  },
  {
    id: "calendar",
    name: "Calendar",
    desc: "Meetings, schedules and calendar events planner.",
    icon: "calendar",
    type: "internal",
    category: "productivity",
    tags: ["Productivity"],
    keywords: ["calendar", "events", "meetings", "schedule", "planner", "time"],
    iconBg: "linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)",
    context: "Review agenda & upcoming events",
    popularity: 76,
    component: CalendarApp,
  },
  {
    id: "savings",
    name: "Savings Goals",
    desc: "Target savings, milestones & emergency funds tracker.",
    icon: "savings",
    type: "internal",
    category: "finance",
    tags: ["Finance"],
    keywords: ["savings", "goals", "funds", "targets", "emergency", "money"],
    iconBg: "linear-gradient(135deg, #10b981 0%, #047857 100%)",
    context: "Track progress on savings milestones",
    popularity: 73,
    component: SavingsApp,
  },
  {
    id: "subscriptions",
    name: "Subscriptions",
    desc: "Recurring bills, active plans & renewal tracker.",
    icon: "subscriptions",
    type: "internal",
    category: "finance",
    tags: ["Finance"],
    keywords: ["subscriptions", "recurring", "bills", "membership", "renewal"],
    iconBg: "linear-gradient(135deg, #8b5cf6 0%, #6d28d9 100%)",
    context: "Audit recurring renewals & expenses",
    popularity: 71,
    component: SubscriptionsApp,
  },
  {
    id: "financial-health",
    name: "Financial Health",
    desc: "AI Financial Health Score & Intelligence Briefings.",
    icon: "financial-health",
    type: "internal",
    category: "finance",
    tags: ["Finance", "AI"],
    keywords: ["financial health", "score", "advisor", "briefings", "budget", "ai"],
    iconBg: "linear-gradient(135deg, #ec4899 0%, #be185d 100%)",
    context: "Inspect financial health score",
    popularity: 74,
    component: FinancialHealthApp,
  },
  {
    id: "settings",
    name: "System Settings",
    desc: "System preferences, security & user profile.",
    icon: "settings",
    type: "internal",
    category: "system",
    tags: ["System"],
    keywords: ["settings", "preferences", "config", "account", "profile", "options"],
    iconBg: "linear-gradient(135deg, #64748b 0%, #475569 100%)",
    context: "Configure system preferences",
    popularity: 67,
    component: SettingsPage,
  },
  {
    id: "vitya-expense",
    name: "Vitya Expense",
    desc: "Automated receipt scanning & expense ledger.",
    icon: "vitya-expense",
    type: "external",
    category: "finance",
    isExternal: true,
    tags: ["Finance", "Cloud"],
    keywords: ["vitya expense", "receipts", "tracking", "business", "money"],
    iconBg: "linear-gradient(135deg, #10b981 0%, #059669 100%)",
    context: "Enterprise receipt scanning service",
    url: "https://vitya-expense.onrender.com",
    popularity: 63,
  },
  {
    id: "Security-vitya",
    name: "Vitya Tourist Security",
    desc: "Tourist safety, SOS emergency & web monitoring.",
    icon: "Security-vitya",
    type: "external",
    category: "cloud",
    isExternal: true,
    tags: ["Security", "Cloud"],
    keywords: ["security", "tourist", "safety", "alert", "emergency", "protection"],
    iconBg: "linear-gradient(135deg, #ef4444 0%, #dc2626 100%)",
    context: "Perimeter safety & emergency SOS",
    url: "https://security-vitya.onrender.com",
    popularity: 56,
  },
  {
    id: "vitya-admin-dashboard",
    name: "Vitya Admin",
    desc: "System administration & user control panel.",
    icon: "vitya-admin-dashboard",
    type: "external",
    category: "cloud",
    isAdmin: true,
    isExternal: true,
    tags: ["Admin", "Security"],
    keywords: ["admin", "control", "dashboard", "moderation", "system", "vitya"],
    iconBg: "linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%)",
    context: "Platform administration & metrics",
    url: "https://admin-vitya.onrender.com",
    popularity: 52,
  },
  {
    id: "vitya-tourist-travel-assistant",
    name: "Vitya Assistant",
    desc: "AI Tourist Travel Guide & Local Itinerary Assistant.",
    icon: "vitya-tourist-travel-assistant",
    type: "external",
    category: "ai",
    isExternal: true,
    tags: ["AI", "Travel"],
    keywords: ["assistant", "travel", "tourist", "guide", "ai", "trip", "places"],
    iconBg: "linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)",
    context: "AI tourist guide & local itinerary",
    url: "https://tourist-vitya.onrender.com",
    popularity: 59,
  },
  {
    id: "vitya-monitor",
    name: "Vitya Monitor",
    desc: "Real-time telemetry, server health & live status.",
    icon: "vitya-monitor",
    type: "external",
    category: "cloud",
    isExternal: true,
    tags: ["Monitoring", "Cloud"],
    keywords: ["monitor", "realtime", "telemetry", "system", "status", "ai", "analytics"],
    iconBg: "linear-gradient(135deg, #f97316 0%, #ea580c 100%)",
    context: "Live server telemetry & node status",
    url: "https://monitor-vitya.onrender.com",
    popularity: 54,
  },
  {
    id: "drive",
    name: "Google Drive",
    desc: "Cloud file storage, shared drives and backups.",
    icon: "drive",
    type: "external",
    category: "cloud",
    isExternal: true,
    tags: ["Cloud", "Storage"],
    keywords: ["google drive", "drive", "cloud", "google", "storage", "backup"],
    iconBg: "linear-gradient(135deg, #fbbc04 0%, #f29900 100%)",
    context: "Google Drive files & shared backups",
    url: "https://drive.google.com/",
    popularity: 66,
  },
  {
    id: "gmail",
    name: "Gmail",
    desc: "Google Mail inbox & message communications.",
    icon: "gmail",
    type: "external",
    category: "cloud",
    isExternal: true,
    tags: ["Cloud", "Productivity"],
    keywords: ["gmail", "email", "mail", "google", "inbox", "messages"],
    iconBg: "linear-gradient(135deg, #ea4335 0%, #c5221f 100%)",
    context: "Google Mail inbox & communications",
    url: "https://mail.google.com/",
    popularity: 68,
  },
  {
    id: "calendar-web",
    name: "Google Calendar",
    desc: "Google Cloud Calendar events & appointments.",
    icon: "calendar-web",
    type: "external",
    category: "cloud",
    isExternal: true,
    tags: ["Cloud", "Productivity"],
    keywords: ["google calendar", "calendar", "google", "events", "web", "schedule"],
    iconBg: "linear-gradient(135deg, #4285f4 0%, #1a73e8 100%)",
    context: "Google Calendar schedule & meetings",
    url: "https://calendar.google.com/",
    popularity: 65,
  },
];

const getIsMobile = () =>
  typeof window !== "undefined" ? window.innerWidth < 1024 : false;

const safeReadArrayLength = (key) => {
  if (typeof window === "undefined") return 0;

  try {
    const raw = window.localStorage.getItem(`vitya_${key}`) || window.localStorage.getItem(key);
    if (!raw) return 0;

    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed.length : 0;
  } catch {
    return 0;
  }
};

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="contentCard">
          <h2>Something went wrong</h2>
          <p>The app failed to load. Please try again.</p>
        </div>
      );
    }

    return this.props.children;
  }
}

const Dashboard = ({ initialTab: propTab, initialApp: propApp }) => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const getInitialTab = () => {
    if (propTab) {
      if (propTab === "apps" && (propApp === "chat" || propApp === "presentation")) {
        return propApp;
      }
      return propTab;
    }
    const fromUrl = searchParams.get("tab");
    if (fromUrl) {
      if (fromUrl === "apps") {
        const appFromUrl = searchParams.get("app");
        if (appFromUrl === "chat" || appFromUrl === "presentation") return appFromUrl;
      }
      return fromUrl;
    }
    if (typeof window !== "undefined") {
      const storedTab = localStorage.getItem("vitya_activeTab");
      const storedApp = localStorage.getItem("vitya_activeApp");
      if (storedTab === "apps" && (storedApp === "chat" || storedApp === "presentation")) {
        return storedApp;
      }
      return storedTab || "chat";
    }
    return "chat";
  };

  const getInitialApp = (currentTab) => {
    if (propApp) {
      if (propApp === "chat" || propApp === "presentation") return null;
      return propApp;
    }
    if (currentTab === "apps") {
      const fromUrl = searchParams.get("app");
      if (fromUrl) {
        if (fromUrl === "chat" || fromUrl === "presentation") return null;
        return fromUrl;
      }
      if (typeof window !== "undefined") {
        const storedApp = localStorage.getItem("vitya_activeApp");
        if (storedApp === "chat" || storedApp === "presentation") return null;
        return storedApp || null;
      }
    }
    return null;
  };

  const getInitialConvId = (currentTab) => {
    if (currentTab === "chat") {
      const fromUrl = searchParams.get("c");
      if (fromUrl) return fromUrl;
    }
    return null;
  };

  const [activeTab, setActiveTabState] = useState(getInitialTab);
  const [activeApp, setActiveAppState] = useState(() => getInitialApp(getInitialTab()));
  const [activeConversationId, setActiveConversationIdState] = useState(() =>
    getInitialConvId(getInitialTab())
  );

  const [searchText, setSearchText] = useState("");
  const [isMobile, setIsMobile] = useState(getIsMobile());
  const [sidebarOpen, setSidebarOpen] = useState(() => !getIsMobile());
  const [historyRefreshKey, setHistoryRefreshKey] = useState(0);
  const [chatInitialPrompt, setChatInitialPrompt] = useState("");
  const [commandPaletteOpen, setCommandPaletteOpen] = useState(false);
  const [ambientVoiceOpen, setAmbientVoiceOpen] = useState(false);
  const [isSplitView, setIsSplitView] = useState(() => {
    try {
      return localStorage.getItem("vitya_split_view") === "true";
    } catch {
      return false;
    }
  });

  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setCommandPaletteOpen((prev) => !prev);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  const prevIsMobileRef = useRef(getIsMobile());
  const { user: authUser } = useAuth();
  const user = authUser || {};

  const userInitial = (user?.name || user?.username || "U").charAt(0).toUpperCase();
  const defaultAvatar = `data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='100' height='100' viewBox='0 0 100 100'><circle cx='50' cy='50' r='50' fill='%236366f1'/><text x='50%' y='55%' dominant-baseline='middle' text-anchor='middle' fill='%23ffffff' font-size='45' font-weight='bold' font-family='sans-serif'>${userInitial}</text></svg>`;
  const rawPic = user?.profile_pic || user?.avatar;
  const profilePicSrc = rawPic ? resolveAssetUrl(rawPic) : defaultAvatar;

  const updateNavigationState = useCallback(
    (newTab, newApp = null, newConvId = null) => {
      setActiveTabState(newTab);
      setActiveAppState(newApp);
      setActiveConversationIdState(newConvId);

      if (typeof window !== "undefined") {
        localStorage.setItem("vitya_activeTab", newTab);
        if (newApp) {
          localStorage.setItem("vitya_activeApp", newApp);
        } else {
          localStorage.removeItem("vitya_activeApp");
        }
        if (newConvId) {
          localStorage.setItem("vitya_activeConversationId", newConvId);
        } else {
          localStorage.removeItem("vitya_activeConversationId");
        }
      }

      let targetPath = "/dashboard";
      if (newTab === "chat") targetPath = "/chatbot";
      else if (newTab === "presentation") targetPath = "/presentation";
      else if (newTab === "apps") {
        if (newApp === "dora") targetPath = "/dora";
        else if (newApp === "finance") targetPath = "/finance";
        else targetPath = newApp ? `/apps/${newApp}` : "/apps";
      }
      else if (newTab === "history") targetPath = "/dashboard?tab=history";
      else if (newTab === "profile") targetPath = "/profile";
      else if (newTab === "profile/edit") targetPath = "/profile/edit";
      else if (newTab === "settings") targetPath = "/settings";
      else if (newTab && newTab.startsWith("settings/")) targetPath = `/${newTab}`;
      else if (newTab === "help") targetPath = "/settings/help";

      const search = newTab === "chat" && newConvId ? `?c=${newConvId}` : "";
      navigate(`${targetPath}${search}`, { replace: true });
    },
    [navigate]
  );

  useEffect(() => {
    const tabParam = searchParams.get("tab");
    const appParam = searchParams.get("app");
    const cParam = searchParams.get("c");

    let tab = propTab || tabParam || "chat";
    let app =
      tab === "apps"
        ? propApp ||
          appParam ||
          (typeof window !== "undefined"
            ? localStorage.getItem("vitya_activeApp")
            : null)
        : null;

    if (tab === "apps" && (app === "chat" || app === "presentation")) {
      tab = app;
      app = null;
    }

    const c = tab === "chat" ? (cParam || null) : null;

    setActiveTabState((prev) => (prev !== tab ? tab : prev));
    setActiveAppState((prev) => (prev !== app ? app : prev));
    setActiveConversationIdState((prev) => (prev !== c ? c : prev));
  }, [propTab, propApp, searchParams]);

  const analyticsData = useMemo(
    () => ({
      notesCount: safeReadArrayLength("notes"),
      tasksCount: safeReadArrayLength("tasks"),
      chatsCount: safeReadArrayLength("chats"),
    }),
    []
  );

  useEffect(() => {
    const handleResize = () => {
      const mobile = getIsMobile();
      setIsMobile(mobile);

      if (mobile !== prevIsMobileRef.current) {
        setSidebarOpen(!mobile);
        prevIsMobileRef.current = mobile;
      }
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const closeSidebarIfMobile = useCallback(() => {
    if (isMobile) setSidebarOpen(false);
  }, [isMobile]);

  const handleTabClick = useCallback(
    (tab) => {
      const convId = tab === "chat" ? activeConversationId : null;
      updateNavigationState(tab, null, convId);
      closeSidebarIfMobile();
    },
    [closeSidebarIfMobile, activeConversationId, updateNavigationState]
  );

  const handleNewChat = useCallback(() => {
    if (typeof window !== "undefined") {
      localStorage.removeItem("vitya_activeConversationId");
    }
    updateNavigationState("chat", null, null);
    setChatInitialPrompt("");
    closeSidebarIfMobile();
  }, [closeSidebarIfMobile, updateNavigationState]);

  const openConversation = useCallback(
    (conversationId) => {
      updateNavigationState("chat", null, conversationId);
      setHistoryRefreshKey((value) => value + 1);
    },
    [updateNavigationState]
  );

  const handleQuickToolClick = useCallback(
    (toolType) => {
      if (toolType === "presentation") {
        updateNavigationState("presentation", null, null);
      } else if (toolType === "image") {
        setChatInitialPrompt("/image ");
        updateNavigationState("chat", null, activeConversationId);
      } else if (toolType === "code") {
        setChatInitialPrompt("Write clean code for ");
        updateNavigationState("chat", null, activeConversationId);
      } else if (toolType === "apps") {
        updateNavigationState("apps", null, null);
      }
      closeSidebarIfMobile();
    },
    [activeConversationId, closeSidebarIfMobile, updateNavigationState]
  );


  const openApp = useCallback(
    (app) => {
      if (!app) return;
      if (app.type === "external") {
        window.open(app.url, "_blank", "noopener,noreferrer");
      } else if (app.id === "chat") {
        updateNavigationState("chat", null, null);
      } else if (app.id === "presentation") {
        updateNavigationState("presentation", null, null);
      } else {
        updateNavigationState("apps", app.id, null);
      }

      closeSidebarIfMobile();
    },
    [closeSidebarIfMobile, updateNavigationState]
  );

  const currentApp = useMemo(
    () => APP_REGISTRY.find((app) => app.id === activeApp) || null,
    [activeApp]
  );

  const renderAppPanel = () => {
    if (!currentApp) return null;

    if (currentApp.type === "external") {
      return (
        <div className="appPanel">
          <div className="appPanelTopBar">
            <button className="backBtn" onClick={() => updateNavigationState("apps", null, null)}>
              ← Back to Apps
            </button>
            <div className="appBreadcrumb">
              <span>Apps</span> <span className="bcSep">/</span> <strong className="bcCurrent">{currentApp.name}</strong>
            </div>
          </div>

          <div className="panelHeader">
            <div className="appHeaderIconBox" style={{ background: currentApp.iconBg }}>
              {currentApp.icon}
            </div>
            <div>
              <h2>{currentApp.name}</h2>
              <p>{currentApp.desc}</p>
            </div>
          </div>

          <button
            className="smallBtn"
            style={{ marginTop: 12 }}
            onClick={() =>
              window.open(currentApp.url, "_blank", "noopener,noreferrer")
            }
          >
            Open {currentApp.name} ↗
          </button>
        </div>
      );
    }

    const isSovereignApp = ["dora", "finance", "research", "scan-ledger", "automations", "voice-notes"].includes(currentApp.id);
    const AppComponent = currentApp.component;

    return (
      <div className={`appPanel ${isSovereignApp ? "appPanelSovereign" : ""}`}>
        {!isSovereignApp && (
          <div className="appPanelTopBar">
            <button className="backBtn" onClick={() => updateNavigationState("apps", null, null)}>
              ← Back to Apps
            </button>
            <div className="appBreadcrumb">
              <span>Apps</span> <span className="bcSep">/</span> <strong className="bcCurrent">{currentApp.name}</strong>
            </div>
          </div>
        )}

        {!["analytics", "dora", "finance", "research", "scan-ledger", "automations", "voice-notes"].includes(currentApp.id) && (
          <div className="panelHeader">
            <div className="appHeaderIconBox" style={{ background: currentApp.iconBg }}>
              {currentApp.icon}
            </div>
            <div>
              <h2>{currentApp.name}</h2>
              <p>{currentApp.desc}</p>
            </div>
          </div>
        )}

        <div className={`miniAppContent ${isSovereignApp ? "miniAppContentSovereign" : ""}`}>
          <ErrorBoundary>
            {currentApp.id === "analytics" ? (
              <AppComponent {...analyticsData} />
            ) : currentApp.id === "research" ? (
              <AppComponent onNavigateToPresentation={() => updateNavigationState("presentation")} />
            ) : currentApp.id === "scan-ledger" ? (
              <AppComponent onNavigateToFinance={() => updateNavigationState("apps", "finance")} />
            ) : currentApp.id === "automations" ? (
              <AppComponent
                onNavigateToTasks={() => updateNavigationState("apps", "tasks")}
                onNavigateToCalendar={() => updateNavigationState("apps", "calendar")}
                onNavigateToPresentation={() => updateNavigationState("presentation")}
                onNavigateToFinance={() => updateNavigationState("apps", "finance")}
              />
            ) : currentApp.id === "voice-notes" ? (
              <AppComponent
                onNavigateToTasks={() => updateNavigationState("apps", "tasks")}
                onNavigateToCalendar={() => updateNavigationState("apps", "calendar")}
                onNavigateToNotes={() => updateNavigationState("apps", "notes")}
              />
            ) : (
              <AppComponent />
            )}
          </ErrorBoundary>
        </div>
      </div>
    );
  };

  return (
    <div className="dashboard">
      {sidebarOpen && isMobile && (
        <div className="overlay" onClick={() => setSidebarOpen(false)} />
      )}

      <Sidebar
        sidebarOpen={sidebarOpen}
        setSidebarOpen={setSidebarOpen}
        isMobile={isMobile}
        activeTab={activeTab}
        activeApp={activeApp}
        handleTabClick={handleTabClick}
        onOpenApp={openApp}
        handleNewChat={handleNewChat}
        searchText={searchText}
        setSearchText={setSearchText}
        user={user}
        profilePicSrc={profilePicSrc}
        defaultAvatar={defaultAvatar}
        onQuickToolClick={handleQuickToolClick}
      />

      <div className="mainWrap">
        <header className="topbar">
          {isMobile && (
            <button
              className="menuBtn"
              onClick={() => setSidebarOpen((prev) => !prev)}
              aria-label="Open sidebar"
            >
              ☰
            </button>
          )}

          <div className="topbarText">
            <div className="brandWrap">
              <h2 className="brand">Vitya.AI</h2>
              <p>
                {activeTab === "presentation"
                  ? "Presentation Studio • Autonomous Deck Synthesizer"
                  : activeApp === "dora"
                  ? "Dr.Dora • Clinical Health Intelligence & Triage"
                  : activeApp === "finance"
                  ? "Vidya Advisor • Finance, Expense & Income Intelligence"
                  : `Welcome back, ${user?.name || "User"}`}
              </p>
            </div>
          </div>

          <div className="topbarRightGroup" style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <button
              onClick={() => setAmbientVoiceOpen(true)}
              title="Talk to Vitya"
              className="topbarMicBtn"
              aria-label="Talk to Vitya voice assistant"
              style={{
                display: "inline-flex",
                alignItems: "center",
                justifyContent: "center",
                background: "linear-gradient(135deg, rgba(168, 85, 247, 0.15) 0%, rgba(99, 102, 241, 0.15) 100%)",
                border: "1px solid rgba(168, 85, 247, 0.35)",
                borderRadius: "10px",
                padding: "6px 10px",
                color: "#c084fc",
                fontSize: "12.5px",
                fontWeight: 600,
                cursor: "pointer",
                transition: "all 0.18s ease",
                minWidth: 36,
                minHeight: 36,
              }}
            >
              <Mic size={15} color="#c084fc" />
            </button>

            <button
              onClick={() =>
                setIsSplitView((prev) => {
                  const next = !prev;
                  localStorage.setItem("vitya_split_view", String(next));
                  return next;
                })
              }
              title={isSplitView ? "Close Split View" : "Enable Dual-Pane Split View"}
              className="topbarSplitBtn"
              aria-label="Toggle dual-pane split view"
              style={{
                display: "inline-flex",
                alignItems: "center",
                justifyContent: "center",
                background: isSplitView ? "rgba(56, 189, 248, 0.18)" : "rgba(255, 255, 255, 0.05)",
                border: `1px solid ${isSplitView ? "rgba(56, 189, 248, 0.45)" : "rgba(255, 255, 255, 0.12)"}`,
                borderRadius: "10px",
                padding: "6px 10px",
                color: isSplitView ? "#38bdf8" : "#94a3b8",
                fontSize: "12.5px",
                fontWeight: 600,
                cursor: "pointer",
                transition: "all 0.18s ease",
                minWidth: 36,
                minHeight: 36,
              }}
            >
              <Columns size={15} color={isSplitView ? "#38bdf8" : "#94a3b8"} />
            </button>

            <button
              onClick={() => setCommandPaletteOpen(true)}
              title="Search apps & commands (Ctrl+K)"
              className="topbarSpotlightBtn"
              aria-label="Open spotlight search"
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "6px",
                background: "rgba(255, 255, 255, 0.05)",
                border: "1px solid rgba(255, 255, 255, 0.12)",
                borderRadius: "10px",
                padding: "6px 10px",
                color: "#94a3b8",
                fontSize: "12.5px",
                fontWeight: 500,
                cursor: "pointer",
                transition: "all 0.18s ease",
                minHeight: 36,
              }}
            >
              <Search size={15} color="#818cf8" />
              <span className="spotlightLabel">Spotlight</span>
              <kbd className="spotlightKbd" style={{ background: "rgba(255, 255, 255, 0.08)", padding: "1px 5px", borderRadius: "4px", fontSize: "10px", color: "#cbd5e1", border: "1px solid rgba(255, 255, 255, 0.1)" }}>
                ⌘K
              </kbd>
            </button>

            <NotificationBell
              onNavigateToSettings={() => updateNavigationState("settings/notifications", null, null)}
            />

            <button
              className="profileMiniBtn"
              onClick={() => navigate("/profile")}
              aria-label="Open profile"
            >
              <img
                src={profilePicSrc}
                alt="Profile"
                onError={(e) => {
                  e.currentTarget.onerror = null;
                  e.currentTarget.src = defaultAvatar;
                }}
              />
            </button>
          </div>
        </header>

        {/* Active View Renderer */}
        {(() => {
          const renderActiveTabContent = () => (
            <>
              {activeTab === "chat" && (
                <section className="chatShell">
                  <Chatbot
                    conversationId={activeConversationId}
                    onConversationChange={(id) => updateNavigationState("chat", null, id)}
                    onConversationUpdated={() => setHistoryRefreshKey((value) => value + 1)}
                    initialInput={chatInitialPrompt}
                    onClearInitialInput={() => setChatInitialPrompt("")}
                  />
                </section>
              )}

              {activeTab === "presentation" && (
                <section className="contentCard" style={{ width: "100%", height: "100%", minHeight: 0, padding: 0, background: "transparent", border: "none", boxShadow: "none", display: "flex", flexDirection: "column", overflow: "hidden" }}>
                  <Presentation />
                </section>
              )}

              {activeTab === "history" && (
                <section className="contentCard">
                  <ChatHistory
                    onOpenConversation={openConversation}
                    refreshKey={historyRefreshKey}
                  />
                </section>
              )}

              {activeTab === "apps" && (
                <section className="contentCard" style={!activeApp ? { background: "transparent", border: "none", boxShadow: "none", padding: "4px 0 24px 0" } : {}}>
                  {!activeApp ? (
                    <AppsWorkspace
                      apps={APP_REGISTRY}
                      onOpenApp={openApp}
                      user={user}
                    />
                  ) : (
                    renderAppPanel()
                  )}
                </section>
              )}

              {activeTab === "profile" && (
                <section className="contentCard" style={{ width: "100%", padding: 0, background: "transparent", border: "none", boxShadow: "none" }}>
                  <Profile insideDashboard={true} />
                </section>
              )}

              {activeTab === "profile/edit" && (
                <section className="contentCard" style={{ width: "100%", padding: 0, background: "transparent", border: "none", boxShadow: "none" }}>
                  <ProfileEdit insideDashboard={true} />
                </section>
              )}

              {activeTab === "settings" && (
                <section className="contentCard" style={{ width: "100%", padding: 0, background: "transparent", border: "none", boxShadow: "none" }}>
                  <SettingsPage plain={true} insideDashboard={true} />
                </section>
              )}

              {(activeTab === "help" || activeTab === "settings/help") && (
                <section className="contentCard" style={{ width: "100%", padding: 0, background: "transparent", border: "none", boxShadow: "none" }}>
                  <HelpSupportPage insideDashboard={true} />
                </section>
              )}

              {activeTab === "settings/security" && (
                <section className="contentCard" style={{ width: "100%", padding: 0, background: "transparent", border: "none", boxShadow: "none" }}>
                  <SecurityPrivacyPage insideDashboard={true} />
                </section>
              )}

              {activeTab === "settings/subscription" && (
                <section className="contentCard" style={{ width: "100%", padding: 0, background: "transparent", border: "none", boxShadow: "none" }}>
                  <SubscriptionPage insideDashboard={true} />
                </section>
              )}

              {activeTab === "settings/notifications" && (
                <section className="contentCard" style={{ width: "100%", padding: 0, background: "transparent", border: "none", boxShadow: "none" }}>
                  <NotificationsPage insideDashboard={true} />
                </section>
              )}

              {activeTab === "settings/appearance" && (
                <section className="contentCard" style={{ width: "100%", padding: 0, background: "transparent", border: "none", boxShadow: "none" }}>
                  <AppearancePage insideDashboard={true} />
                </section>
              )}

              {activeTab === "settings/about" && (
                <section className="contentCard" style={{ width: "100%", padding: 0, background: "transparent", border: "none", boxShadow: "none" }}>
                  <AboutPage insideDashboard={true} />
                </section>
              )}
            </>
          );

          return (
            <main className={`content ${activeTab === "chat" ? "contentChat " : ""}${(activeTab === "chat" || activeTab === "presentation" || (activeTab === "apps" && (activeApp === "dora" || activeApp === "finance" || activeApp === "research" || activeApp === "scan-ledger" || activeApp === "automations" || activeApp === "voice-notes"))) || isSplitView ? "contentNoScroll" : ""}`}>
              {isSplitView && activeTab !== "chat" ? (
                <div className="vSplitViewContainer" style={{ display: "flex", width: "100%", height: "100%", overflow: "hidden", gap: 0 }}>
                  {/* Left Dock: Chatbot Co-Pilot (40% width) */}
                  <div className="vSplitLeftPane" style={{ width: "40%", minWidth: "340px", height: "100%", borderRight: "1px solid rgba(255, 255, 255, 0.1)", display: "flex", flexDirection: "column", background: "rgba(10, 15, 29, 0.85)" }}>
                    <div style={{ padding: "8px 14px", background: "rgba(15, 23, 42, 0.8)", borderBottom: "1px solid rgba(255, 255, 255, 0.08)", display: "flex", alignItems: "center", justifyContent: "space-between", fontSize: "12px", color: "#94a3b8", fontWeight: 600 }}>
                      <span style={{ display: "flex", alignItems: "center", gap: 6, color: "#c084fc" }}>
                        Vitya
                      </span>
                      <button
                        onClick={() => {
                          setIsSplitView(false);
                          localStorage.setItem("vitya_split_view", "false");
                        }}
                        style={{ background: "transparent", border: "none", color: "#64748b", cursor: "pointer", fontSize: "11px", fontWeight: 600 }}
                      >
                        ✕
                      </button>
                    </div>
                    <div style={{ flex: 1, minHeight: 0 }}>
                      <Chatbot
                        conversationId={activeConversationId}
                        onConversationChange={(id) => updateNavigationState("chat", null, id)}
                        onConversationUpdated={() => setHistoryRefreshKey((value) => value + 1)}
                        initialInput={chatInitialPrompt}
                        onClearInitialInput={() => setChatInitialPrompt("")}
                      />
                    </div>
                  </div>

                  {/* Right Dock: Active App Workspace (60% width) */}
                  <div className="vSplitRightPane" style={{ flex: 1, height: "100%", minWidth: 0, overflowY: "auto", display: "flex", flexDirection: "column" }}>
                    {renderActiveTabContent()}
                  </div>
                </div>
              ) : (
                renderActiveTabContent()
              )}
            </main>
          );
        })()}
      </div>

      {/* Global Command Palette Spotlight Modal */}
      <CommandPalette
        isOpen={commandPaletteOpen}
        onClose={() => setCommandPaletteOpen(false)}
        onNavigate={updateNavigationState}
        onTriggerPrompt={(prompt) => {
          setChatInitialPrompt(prompt);
          updateNavigationState("chat");
        }}
        onOpenAmbientVoice={() => setAmbientVoiceOpen(true)}
        apps={APP_REGISTRY}
      />

      {/* Hands-Free Ambient Voice Assistant Modal */}
      <AmbientVoiceOrbModal
        isOpen={ambientVoiceOpen}
        onClose={() => setAmbientVoiceOpen(false)}
        onNavigateToChat={() => {
          setAmbientVoiceOpen(false);
          updateNavigationState("chat");
        }}
      />
    </div>
  );
};

export default Dashboard;
