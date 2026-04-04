import React, { useCallback, useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import Chatbot from "./VityaChatbot";
import "./Dashboard.css";

import NotesApp from "../components/apps/NotesApp";
import CalendarApp from "../components/apps/CalendarApp";
import FilesApp from "../components/apps/FilesApp";
import TasksApp from "../components/apps/TasksApp";
import SettingsApp from "../components/apps/SettingsApp";
import AnalyticsApp from "../components/apps/AnalyticsApp";

const APP_REGISTRY = [
  {
    id: "notes",
    name: "Notes",
    desc: "Quick notes and ideas",
    icon: "📝",
    type: "internal",
    component: NotesApp,
  },
  {
    id: "calendar",
    name: "Calendar",
    desc: "Meetings and events",
    icon: "📅",
    type: "internal",
    component: CalendarApp,
  },
  {
    id: "files",
    name: "Files",
    desc: "Manage documents",
    icon: "📁",
    type: "internal",
    component: FilesApp,
  },
  {
    id: "tasks",
    name: "Tasks",
    desc: "Track your work",
    icon: "✅",
    type: "internal",
    component: TasksApp,
  },
  {
    id: "analytics",
    name: "Analytics",
    desc: "View activity stats",
    icon: "📊",
    type: "internal",
    component: AnalyticsApp,
  },
  {
    id: "settings",
    name: "Settings",
    desc: "App preferences",
    icon: "⚙️",
    type: "internal",
    component: SettingsApp,
  },
  {
    id: "gmail",
    name: "Gmail",
    desc: "Open Gmail",
    icon: "📧",
    type: "external",
    url: "https://mail.google.com/",
  },
  {
    id: "drive",
    name: "Google Drive",
    desc: "Open Drive",
    icon: "🗂️",
    type: "external",
    url: "https://drive.google.com/",
  },
  {
    id: "calendar-web",
    name: "Google Calendar",
    desc: "Open Calendar web",
    icon: "🌐",
    type: "external",
    url: "https://calendar.google.com/",
  },
];

const Dashboard = () => {
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState("chat");
  const [activeApp, setActiveApp] = useState(null);
  const [searchText, setSearchText] = useState("");
  const [isMobile, setIsMobile] = useState(window.innerWidth < 900);
  const [sidebarOpen, setSidebarOpen] = useState(window.innerWidth >= 900);

  const user = useMemo(() => {
    try {
      const storedUser = localStorage.getItem("user");
      return storedUser ? JSON.parse(storedUser) : {};
    } catch {
      return {};
    }
  }, []);

  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth < 900;
      setIsMobile(mobile);
      setSidebarOpen(!mobile);
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const closeSidebarOnMobile = useCallback(() => {
    if (window.innerWidth < 900) {
      setSidebarOpen(false);
    }
  }, []);

  const toggleSidebar = useCallback(() => {
    setSidebarOpen((prev) => !prev);
  }, []);

  const handleTabClick = useCallback(
    (tab) => {
      if (tab === "profile") {
        navigate("/profile");
        closeSidebarOnMobile();
        return;
      }

      setActiveTab(tab);
      setActiveApp(null);
      closeSidebarOnMobile();
    },
    [navigate, closeSidebarOnMobile]
  );

  const handleNewChat = useCallback(() => {
    setActiveTab("chat");
    setActiveApp(null);
    closeSidebarOnMobile();
  }, [closeSidebarOnMobile]);

  const filteredApps = useMemo(() => {
    const q = searchText.trim().toLowerCase();
    if (!q) return APP_REGISTRY;

    return APP_REGISTRY.filter(
      (app) =>
        app.name.toLowerCase().includes(q) ||
        app.desc.toLowerCase().includes(q)
    );
  }, [searchText]);

  const openApp = useCallback((app) => {
    if (app.type === "external") {
      window.open(app.url, "_blank", "noopener,noreferrer");
      return;
    }

    setActiveTab("apps");
    setActiveApp(app.id);
  }, []);

  const currentApp = useMemo(
    () => APP_REGISTRY.find((app) => app.id === activeApp),
    [activeApp]
  );

  const renderAppPanel = () => {
    if (!currentApp) return null;

    if (currentApp.type === "external") {
      return (
        <div className="appPanel">
          <div className="panelHeader">
            <button className="backBtn" onClick={() => setActiveApp(null)}>
              ← Back
            </button>
            <h2>{currentApp.name}</h2>
            <p>{currentApp.desc}</p>
          </div>

          <button
            className="smallBtn"
            onClick={() =>
              window.open(currentApp.url, "_blank", "noopener,noreferrer")
            }
          >
            Open app
          </button>
        </div>
      );
    }

    const AppComponent = currentApp.component;

    return (
      <div className="appPanel">
        <div className="panelHeader">
          <button className="backBtn" onClick={() => setActiveApp(null)}>
            ← Back
          </button>
          <h2>{currentApp.name}</h2>
          <p>{currentApp.desc}</p>
        </div>

        <div className="miniAppContent">
          {currentApp.id === "analytics" ? (
            <AppComponent notesCount={0} tasksCount={0} chatsCount={0} />
          ) : (
            <AppComponent />
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="dashboard">
      {sidebarOpen && isMobile && (
        <div className="overlay" onClick={() => setSidebarOpen(false)} />
      )}

      <aside className={`sidebar ${sidebarOpen ? "open" : ""}`}>
        <div className="sidebarHeader">
          <div className="sidebarTop">
            <img src="/logo.png" alt="Vitya.AI logo" className="logo" />
            <div className="brandWrap">
              <h2 className="brand">Vitya.AI</h2>
              <p className="brandText">AI Assistant</p>
            </div>
          </div>

          {isMobile && (
            <button
              className="sidebarCloseBtn"
              onClick={() => setSidebarOpen(false)}
              aria-label="Close sidebar"
            >
              ×
            </button>
          )}
        </div>

        <div className="sidebarSearch">
          <input
            type="text"
            placeholder="Search apps..."
            className="searchInput"
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
          />
        </div>

        <button className="newChatBtn" onClick={handleNewChat}>
          + New Chat
        </button>

        <nav className="nav">
          <button
            className={`navItem ${activeTab === "chat" ? "active" : ""}`}
            onClick={() => handleTabClick("chat")}
          >
            Chat
          </button>
          <button
            className={`navItem ${activeTab === "apps" ? "active" : ""}`}
            onClick={() => handleTabClick("apps")}
          >
            Apps
          </button>
          <button
            className={`navItem ${activeTab === "history" ? "active" : ""}`}
            onClick={() => handleTabClick("history")}
          >
            History
          </button>
          <button
            className={`navItem ${activeTab === "profile" ? "active" : ""}`}
            onClick={() => handleTabClick("profile")}
          >
            Profile
          </button>
        </nav>

        <div className="sidebarProfile" onClick={() => handleTabClick("profile")}>
          <img
            src={user?.avatar || "/profile.png"}
            alt="Profile"
            className="profileImg"
          />
          <div className="profileInfo">
            <div className="profileName">{user?.name || "Profile"}</div>
            <div className="profileEmail">{user?.email || "User account"}</div>
          </div>
        </div>
      </aside>

      <div className="mainWrap">
        <header className="topbar">
          {isMobile && (
            <button className="menuBtn" onClick={toggleSidebar} aria-label="Open sidebar">
              ☰
            </button>
          )}

          <div className="topbarText">
            <h1>Dashboard</h1>
            <p>Welcome back, {user?.name || "User"}</p>
          </div>

          <button className="profileMiniBtn" onClick={() => navigate("/profile")}>
            <img src={user?.avatar || "/profile.png"} alt="Profile" />
          </button>
        </header>

        <main className={`content ${activeTab === "chat" ? "contentChat" : ""}`}>
          {activeTab === "chat" && (
            <section className="chatShell">
              <Chatbot />
            </section>
          )}

          {activeTab === "history" && (
            <section className="contentCard">
              <h2>History</h2>
              <p>Your previous chats will appear here.</p>
            </section>
          )}

          {activeTab === "apps" && (
            <section className="contentCard">
              <div className="sectionHeader">
                <div>
                  <h2>Apps</h2>
                  <p className="mutedText">
                    {filteredApps.length} app
                    {filteredApps.length !== 1 ? "s" : ""} available
                  </p>
                </div>
              </div>

              {!activeApp && (
                <div className="appsGrid">
                  {filteredApps.map((app) => (
                    <button
                      key={app.id}
                      className="appCard"
                      onClick={() => openApp(app)}
                    >
                      <span className="appIcon">{app.icon}</span>
                      <h3>{app.name}</h3>
                      <p>{app.desc}</p>
                      {app.type === "external" && <small>External app</small>}
                    </button>
                  ))}
                </div>
              )}

              {activeApp && renderAppPanel()}
            </section>
          )}

          {activeTab === "profile" && (
            <section className="contentCard">
              <h2>Profile</h2>
              <p>Redirecting to profile…</p>
            </section>
          )}
        </main>
      </div>
    </div>
  );
};

export default Dashboard;