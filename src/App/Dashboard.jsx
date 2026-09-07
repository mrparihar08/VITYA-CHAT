import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import Chatbot from "./VityaChatbot";
import ChatHistory from "../components/chatbot/ChatHistory";
import Presentation from "./Presentation";
import { API_BASE_URL, resolveAssetUrl } from "../services/api";
import { useAuth } from "../context/AuthContext";
import "./Dashboard.css";

import NotesApp from "../components/apps/NotesApp";
import CalendarApp from "../components/apps/CalendarApp";
import FilesApp from "../components/apps/FilesApp";
import TasksApp from "../components/apps/TasksApp";
import SettingsApp from "../components/apps/SettingsApp";
import AnalyticsApp from "../components/apps/AnalyticsApp";
import Profile from "../components/auth/Profile";
import ProfileEdit from "../components/auth/ProfileEdit";
import Sidebar from "../components/sidebar/Sidebar";
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
    id: "notes",
    name: "Notes",
    desc: "Quick notes and ideas",
    icon: "📝",
    type: "internal",
    category: "workspace",
    iconBg: "linear-gradient(135deg, #f59e0b 0%, #d97706 100%)",
    component: NotesApp,
  },
  {
    id: "calendar",
    name: "Calendar",
    desc: "Meetings and events",
    icon: "📅",
    type: "internal",
    category: "workspace",
    iconBg: "linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)",
    component: CalendarApp,
  },
  {
    id: "files",
    name: "Files",
    desc: "Manage documents",
    icon: "📁",
    type: "internal",
    category: "workspace",
    iconBg: "linear-gradient(135deg, #eab308 0%, #ca8a04 100%)",
    component: FilesApp,
  },
  {
    id: "tasks",
    name: "Tasks",
    desc: "Track your work",
    icon: "✅",
    type: "internal",
    category: "workspace",
    iconBg: "linear-gradient(135deg, #10b981 0%, #059669 100%)",
    component: TasksApp,
  },
  {
    id: "analytics",
    name: "Analytics",
    desc: "View activity stats",
    icon: "📊",
    type: "internal",
    category: "workspace",
    iconBg: "linear-gradient(135deg, #ec4899 0%, #db2777 100%)",
    component: AnalyticsApp,
  },
  {
    id: "settings",
    name: "Settings",
    desc: "App preferences",
    icon: "⚙️",
    type: "internal",
    category: "workspace",
    iconBg: "linear-gradient(135deg, #8b5cf6 0%, #6366f1 100%)",
    component: SettingsApp,
  },
  {
    id: "vitya-expense",
    name: "Vitya.Expense",
    desc: "Track expenses & finance",
    icon: "💸",
    type: "external",
    category: "vitya",
    iconBg: "linear-gradient(135deg, #10b981 0%, #059669 100%)",
    url: "https://vitya-expense.onrender.com",
  },
  {
    id: "Security-vitya",
    name: "Vitya Tourist Security",
    desc: "Tourist safety & security web",
    icon: "🛡️",
    type: "external",
    category: "vitya",
    iconBg: "linear-gradient(135deg, #ef4444 0%, #dc2626 100%)",
    url: "https://security-vitya.onrender.com",
  },
  {
    id: "vitya-admin-dashboard",
    name: "Vitya Admin",
    desc: "Admin control dashboard",
    icon: "⚡",
    type: "external",
    category: "vitya",
    iconBg: "linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%)",
    url: "https://admin-vitya.onrender.com",
  },
  {
    id: "vitya-tourist-travel-assistant",
    name: "Vitya Assistant",
    desc: "Travel assistant web",
    icon: "🧭",
    type: "external",
    category: "vitya",
    iconBg: "linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)",
    url: "https://tourist-vitya.onrender.com",
  },
  {
    id: "vitya-monitor",
    name: "Vitya Monitor",
    desc: "Real-time monitor web",
    icon: "📡",
    type: "external",
    category: "vitya",
    iconBg: "linear-gradient(135deg, #f97316 0%, #ea580c 100%)",
    url: "https://monitor-vitya.onrender.com",
  },
  {
    id: "gmail",
    name: "Gmail",
    desc: "Open Gmail web",
    icon: "📧",
    type: "external",
    category: "google",
    iconBg: "linear-gradient(135deg, #ea4335 0%, #c5221f 100%)",
    url: "https://mail.google.com/",
  },
  {
    id: "drive",
    name: "Google Drive",
    desc: "Open Drive cloud storage",
    icon: "🗂️",
    type: "external",
    category: "google",
    iconBg: "linear-gradient(135deg, #fbbc04 0%, #f29900 100%)",
    url: "https://drive.google.com/",
  },
  {
    id: "calendar-web",
    name: "Google Calendar",
    desc: "Open Calendar web",
    icon: "🌐",
    type: "external",
    category: "google",
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
  const [searchParams, setSearchParams] = useSearchParams();

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

      const params = new URLSearchParams();
      if (newTab && newTab !== "chat") params.set("tab", newTab);
      if (newTab === "apps" && newApp) params.set("app", newApp);
      if (newTab === "chat" && newConvId) params.set("c", newConvId);

      setSearchParams(params, { replace: true });
    },
    [setSearchParams]
  );

  useEffect(() => {
    const tabParam = searchParams.get("tab");
    const appParam = searchParams.get("app");
    const cParam = searchParams.get("c");

    const tab =
      tabParam ||
      (typeof window !== "undefined"
        ? localStorage.getItem("vitya_activeTab")
        : null) ||
      "chat";
    const app =
      tab === "apps"
        ? appParam ||
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

    setActiveTabState(tab);
    setActiveAppState(app);
    setActiveConversationIdState(c);
  }, [searchParams]);

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
      updateNavigationState("chat", null, activeConversationId);
      closeSidebarIfMobile();
    },
    [activeConversationId, closeSidebarIfMobile, updateNavigationState]
  );

  const filteredApps = useMemo(() => {
    const q = searchText.trim().toLowerCase();
    if (!q) return APP_REGISTRY;

    return APP_REGISTRY.filter(
      (app) =>
        app.name.toLowerCase().includes(q) ||
        app.desc.toLowerCase().includes(q)
    );
  }, [searchText]);

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

    const AppComponent = currentApp.component;

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

        {currentApp.id !== "analytics" && (
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

        <div className="miniAppContent">
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
        handleTabClick={handleTabClick}
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
              <p>Welcome back, {user?.name || "User"}</p>
            </div>
          </div>

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
        </header>

        <main className={`content ${activeTab === "chat" ? "contentChat" : ""}`}>
          {activeTab === "chat" && (
            <section className="chatShell">
              <Chatbot
                conversationId={activeConversationId}
                onConversationChange={(id) => updateNavigationState("chat", null, id)}
                onConversationUpdated={() => setHistoryRefreshKey((value) => value + 1)}
              />
            </section>
          )}

          {activeTab === "presentation" && (
            <section className="contentCard" style={{ width: "100%", padding: 0, background: "transparent", border: "none", boxShadow: "none" }}>
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
            <section className="contentCard">
              {!activeApp ? (
                <>
                  <div className="sectionHeader">
                    <div>
                      <h2>Apps Workspace</h2>
                      <p className="mutedText">
                        {filteredApps.length} app
                        {filteredApps.length !== 1 ? "s" : ""} available
                      </p>
                    </div>
                  </div>

                  <div className="appsGrid">
                    {filteredApps.map((app) => (
                      <button
                        key={app.id}
                        className="appCard"
                        onClick={() => openApp(app)}
                      >
                        <div
                          className="appIconBox"
                          style={{ background: app.iconBg || "linear-gradient(135deg, #8b5cf6 0%, #6366f1 100%)" }}
                        >
                          <span className="appIcon">{app.icon}</span>
                        </div>
                        <h3>{app.name}</h3>
                        <p>{app.desc}</p>
                        <small className={`appBadge ${app.category || "external"}`}>
                          {app.category === "workspace"
                            ? "Workspace Tool"
                            : app.category === "vitya"
                            ? "Vitya App"
                            : "External App"}
                        </small>
                      </button>
                    ))}
                  </div>
                </>
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
    </div>
  );
};

export default Dashboard;
