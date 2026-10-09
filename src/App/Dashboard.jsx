import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import Chatbot from "../components/chatbot/VityaChatbot";
import ChatHistory from "../components/chatbot/ChatHistory";
import Presentation from "../components/presentation/Presentation";
import { API_BASE_URL, resolveAssetUrl } from "../services/api";
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
import Profile from "../components/auth/Profile";
import ProfileEdit from "../components/auth/ProfileEdit";
import Sidebar from "../components/sidebar/Sidebar";
import AppsWorkspace from "../components/apps/AppsWorkspace";
import CommandPalette from "../components/common/CommandPalette";
import { Search } from "lucide-react";
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
    id: "dora",
    name: "DORA Health AI",
    desc: "Doctor AI, Symptom Diagnosis & Clinical Wellness",
    icon: "🩺",
    type: "internal",
    category: "ai",
    keywords: ["health", "doctor", "symptoms", "diagnosis", "medical", "dora", "ai", "wellness"],
    iconBg: "linear-gradient(135deg, #06b6d4 0%, #0284c7 50%, #2563eb 100%)",
    component: DoraHealthApp,
  },
  {
    id: "notes",
    name: "Notes",
    desc: "Quick scratchpad, ideas and formatted notes",
    icon: "📝",
    type: "internal",
    category: "productivity",
    keywords: ["notes", "ideas", "writing", "scratchpad", "text", "docs"],
    iconBg: "linear-gradient(135deg, #f59e0b 0%, #d97706 100%)",
    component: NotesApp,
  },
  {
    id: "calendar",
    name: "Calendar",
    desc: "Meetings, schedules and calendar events",
    icon: "📅",
    type: "internal",
    category: "productivity",
    keywords: ["calendar", "events", "meetings", "schedule", "planner", "time"],
    iconBg: "linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)",
    component: CalendarApp,
  },
  {
    id: "files",
    name: "Files",
    desc: "Manage and organize workspace documents",
    icon: "📁",
    type: "internal",
    category: "productivity",
    keywords: ["files", "documents", "storage", "upload", "pdf", "folders"],
    iconBg: "linear-gradient(135deg, #eab308 0%, #ca8a04 100%)",
    component: FilesApp,
  },
  {
    id: "tasks",
    name: "Tasks",
    desc: "Track work, todos and action checklists",
    icon: "✅",
    type: "internal",
    category: "productivity",
    keywords: ["tasks", "todos", "work", "checklist", "tracking", "goals"],
    iconBg: "linear-gradient(135deg, #10b981 0%, #059669 100%)",
    component: TasksApp,
  },
  {
    id: "analytics",
    name: "Analytics",
    desc: "Interactive activity trends & performance charts",
    icon: "📊",
    type: "internal",
    category: "finance",
    keywords: ["analytics", "charts", "graphs", "statistics", "reports", "insights"],
    iconBg: "linear-gradient(135deg, #ec4899 0%, #db2777 100%)",
    component: AnalyticsApp,
  },
  {
    id: "finance",
    name: "Finance & Expenses",
    desc: "Income, expense, cashflow and budget tracker",
    icon: "💳",
    type: "internal",
    category: "finance",
    keywords: ["finance", "expenses", "income", "money", "budget", "cashflow", "tracking"],
    iconBg: "linear-gradient(135deg, #10b981 0%, #059669 100%)",
    component: FinanceApp,
  },
  {
    id: "savings",
    name: "Savings Goals",
    desc: "Target savings, milestones & emergency funds",
    icon: "🎯",
    type: "internal",
    category: "finance",
    keywords: ["savings", "goals", "funds", "targets", "emergency", "money"],
    iconBg: "linear-gradient(135deg, #10b981 0%, #047857 100%)",
    component: SavingsApp,
  },
  {
    id: "subscriptions",
    name: "Subscriptions",
    desc: "Recurring bills, active plans & renewal tracker",
    icon: "🔄",
    type: "internal",
    category: "finance",
    keywords: ["subscriptions", "recurring", "bills", "membership", "renewal"],
    iconBg: "linear-gradient(135deg, #8b5cf6 0%, #6d28d9 100%)",
    component: SubscriptionsApp,
  },
  {
    id: "financial-health",
    name: "Financial Health",
    desc: "AI Financial Health Score & Intelligence Briefings",
    icon: "⚡",
    type: "internal",
    category: "finance",
    keywords: ["financial health", "score", "advisor", "briefings", "budget", "ai"],
    iconBg: "linear-gradient(135deg, #ec4899 0%, #be185d 100%)",
    component: FinancialHealthApp,
  },
  {
    id: "settings",
    name: "Settings",
    desc: "System preferences, security & user profile",
    icon: "⚙️",
    type: "internal",
    category: "system",
    keywords: ["settings", "preferences", "config", "account", "profile", "options"],
    iconBg: "linear-gradient(135deg, #8b5cf6 0%, #6366f1 100%)",
    component: SettingsPage,
  },
  {
    id: "vitya-expense",
    name: "Vitya.Expense",
    desc: "Automated receipt scanning & expense ledger",
    icon: "💸",
    type: "external",
    category: "finance",
    isExternal: true,
    keywords: ["vitya expense", "receipts", "tracking", "business", "money"],
    iconBg: "linear-gradient(135deg, #10b981 0%, #059669 100%)",
    url: "https://vitya-expense.onrender.com",
  },
  {
    id: "Security-vitya",
    name: "Vitya Tourist Security",
    desc: "Tourist safety, SOS emergency & web monitoring",
    icon: "🛡️",
    type: "external",
    category: "security",
    isExternal: true,
    keywords: ["security", "tourist", "safety", "alert", "emergency", "protection"],
    iconBg: "linear-gradient(135deg, #ef4444 0%, #dc2626 100%)",
    url: "https://security-vitya.onrender.com",
  },
  {
    id: "vitya-admin-dashboard",
    name: "Vitya Admin",
    desc: "System administration & user control panel",
    icon: "⚡",
    type: "external",
    category: "security",
    isAdmin: true,
    isExternal: true,
    keywords: ["admin", "control", "dashboard", "moderation", "system", "vitya"],
    iconBg: "linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%)",
    url: "https://admin-vitya.onrender.com",
  },
  {
    id: "vitya-tourist-travel-assistant",
    name: "Vitya Assistant",
    desc: "AI Tourist Travel Guide & Local Itinerary Assistant",
    icon: "🧭",
    type: "external",
    category: "ai",
    isExternal: true,
    keywords: ["assistant", "travel", "tourist", "guide", "ai", "trip", "places"],
    iconBg: "linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)",
    url: "https://tourist-vitya.onrender.com",
  },
  {
    id: "vitya-monitor",
    name: "Vitya Monitor",
    desc: "Real-time telemetry, server health & live status",
    icon: "📡",
    type: "external",
    category: "ai",
    isExternal: true,
    keywords: ["monitor", "realtime", "telemetry", "system", "status", "ai", "analytics"],
    iconBg: "linear-gradient(135deg, #f97316 0%, #ea580c 100%)",
    url: "https://monitor-vitya.onrender.com",
  },
  {
    id: "gmail",
    name: "Gmail",
    desc: "Google Mail inbox & message communications",
    icon: "📧",
    type: "external",
    category: "external",
    isExternal: true,
    keywords: ["gmail", "email", "mail", "google", "inbox", "messages"],
    iconBg: "linear-gradient(135deg, #ea4335 0%, #c5221f 100%)",
    url: "https://mail.google.com/",
  },
  {
    id: "drive",
    name: "Google Drive",
    desc: "Cloud file storage, shared drives and backups",
    icon: "🗂️",
    type: "external",
    category: "external",
    isExternal: true,
    keywords: ["google drive", "drive", "cloud", "google", "storage", "backup"],
    iconBg: "linear-gradient(135deg, #fbbc04 0%, #f29900 100%)",
    url: "https://drive.google.com/",
  },
  {
    id: "calendar-web",
    name: "Google Calendar",
    desc: "Google Cloud Calendar events & appointments",
    icon: "🌐",
    type: "external",
    category: "external",
    isExternal: true,
    keywords: ["google calendar", "calendar", "google", "events", "web", "schedule"],
    iconBg: "linear-gradient(135deg, #4285f4 0%, #1a73e8 100%)",
    url: "https://calendar.google.com/",
  },
];

const getIsMobile = () =>
  typeof window !== "undefined" ? window.innerWidth < 900 : false;

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
    if (propTab) return propTab;
    const fromUrl = searchParams.get("tab");
    if (fromUrl) return fromUrl;
    if (typeof window !== "undefined") {
      return localStorage.getItem("vitya_activeTab") || "chat";
    }
    return "chat";
  };

  const getInitialApp = (currentTab) => {
    if (propApp) return propApp;
    if (currentTab === "apps") {
      const fromUrl = searchParams.get("app");
      if (fromUrl) return fromUrl;
      if (typeof window !== "undefined") {
        return localStorage.getItem("vitya_activeApp") || null;
      }
    }
    return null;
  };

  const getInitialConvId = (currentTab) => {
    if (currentTab === "chat") {
      const fromUrl = searchParams.get("c");
      if (fromUrl) return fromUrl;
      if (typeof window !== "undefined") {
        return localStorage.getItem("vitya_activeConversationId") || null;
      }
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

    const tab = propTab || tabParam || "chat";
    const app =
      tab === "apps"
        ? propApp ||
          appParam ||
          (typeof window !== "undefined"
            ? localStorage.getItem("vitya_activeApp")
            : null)
        : null;
    const c =
      tab === "chat"
        ? cParam ||
          (typeof window !== "undefined"
            ? localStorage.getItem("vitya_activeConversationId")
            : null)
        : null;

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

  const handleNewChat = useCallback(async () => {
    let newId = null;
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`${API_BASE_URL}/api/chat/new`, {
        method: "POST",
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      });
      const data = await response.json();
      newId = response.ok ? data.conversation_id : null;
    } catch {
      newId = null;
    }
    updateNavigationState("chat", null, newId);
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
      if (app.type === "external") {
        window.open(app.url, "_blank", "noopener,noreferrer");
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

    const isSovereignApp = ["dora", "finance"].includes(currentApp.id);
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

        {!["analytics", "dora", "finance"].includes(currentApp.id) && (
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
              <h2 className="brand">vitya.ai</h2>
              <p>
                {activeTab === "presentation"
                  ? "Presentation Studio • Autonomous Deck Synthesizer"
                  : activeApp === "dora"
                  ? "Dora Dr. • Clinical Health Intelligence & Triage"
                  : activeApp === "finance"
                  ? "Vidya F.E.I Advisor • Finance, Expense & Income Intelligence"
                  : `Welcome back, ${user?.name || "User"}`}
              </p>
            </div>
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <button
              onClick={() => setCommandPaletteOpen(true)}
              title="Search apps & commands (Ctrl+K)"
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "8px",
                background: "rgba(255, 255, 255, 0.05)",
                border: "1px solid rgba(255, 255, 255, 0.12)",
                borderRadius: "10px",
                padding: "6px 12px",
                color: "#94a3b8",
                fontSize: "12.5px",
                fontWeight: 500,
                cursor: "pointer",
                transition: "all 0.18s ease",
              }}
            >
              <Search size={14} color="#818cf8" />
              <span className="hideOnMobile">Spotlight</span>
              <kbd style={{ background: "rgba(255, 255, 255, 0.08)", padding: "1px 6px", borderRadius: "4px", fontSize: "10.5px", color: "#cbd5e1", border: "1px solid rgba(255, 255, 255, 0.1)" }}>
                ⌘K
              </kbd>
            </button>

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

        <main className={`content ${activeTab === "chat" || activeTab === "presentation" || (activeTab === "apps" && (activeApp === "dora" || activeApp === "finance")) ? "contentNoScroll" : ""}`}>
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
        </main>
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
        apps={APP_REGISTRY}
      />
    </div>
  );
};

export default Dashboard;
