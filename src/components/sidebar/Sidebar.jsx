import React, { useEffect, useRef } from "react";
import "./Sidebar.css";

// SVG Icons matching high-end UI design
const ChatIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
  </svg>
);

const PresentationIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="2" y="3" width="20" height="14" rx="2" ry="2"></rect>
    <line x1="8" y1="21" x2="16" y2="21"></line>
    <line x1="12" y1="17" x2="12" y2="21"></line>
  </svg>
);

const AppsIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="3" width="7" height="7" rx="1.5"></rect>
    <rect x="14" y="3" width="7" height="7" rx="1.5"></rect>
    <rect x="14" y="14" width="7" height="7" rx="1.5"></rect>
    <rect x="3" y="14" width="7" height="7" rx="1.5"></rect>
  </svg>
);

const DoraIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M4.5 16.5c-1.5 1.26-2 5-2 5s3.74-.5 5-2c.71-.84.7-2.13-.09-2.91a2.18 2.18 0 0 0-2.91-.09z"></path>
    <path d="m12 15-3-3a22 22 0 0 1 2-3.95A12.88 12.88 0 0 1 22 2c0 2.72-.78 7.5-6 11a22.35 22.35 0 0 1-4 2z"></path>
    <path d="M9 12H4s.55-3.03 2-4c1.62-1.08 5 0 5 0"></path>
    <path d="M12 15v5s3.03-.55 4-2c1.08-1.62 0-5 0-5"></path>
  </svg>
);

const FinanceIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect width="20" height="14" x="2" y="5" rx="2"></rect>
    <line x1="2" x2="22" y1="10" y2="10"></line>
  </svg>
);

const HistoryIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10"></circle>
    <polyline points="12 6 12 12 16 14"></polyline>
  </svg>
);

const ProfileIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
    <circle cx="12" cy="7" r="4"></circle>
  </svg>
);

const SettingsIcon = () => (
  <svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="3"></circle>
    <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"></path>
  </svg>
);

const HelpIcon = () => (
  <svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10"></circle>
    <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"></path>
    <line x1="12" y1="17" x2="12.01" y2="17"></line>
  </svg>
);

const ChevronRight = () => (
  <svg className="vitya-chevron-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="9 18 15 12 9 6"></polyline>
  </svg>
);

const SearchIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="11" cy="11" r="8"></circle>
    <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
  </svg>
);

const DocIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
    <polyline points="14 2 14 8 20 8"></polyline>
    <line x1="16" y1="13" x2="8" y2="13"></line>
    <line x1="16" y1="17" x2="8" y2="17"></line>
    <polyline points="10 9 9 9 8 9"></polyline>
  </svg>
);


export default function Sidebar({
  sidebarOpen,
  setSidebarOpen,
  isMobile,
  activeTab,
  activeApp,
  handleTabClick,
  onOpenApp,
  handleNewChat,
  searchText,
  setSearchText,
  user,
  profilePicSrc,
  defaultAvatar,
  onQuickToolClick,
}) {
  const searchInputRef = useRef(null);

  // Keyboard shortcut Ctrl+K to focus search input
  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        if (searchInputRef.current) {
          searchInputRef.current.focus();
        }
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  const navItems = [
    { key: "chat", label: "Chat", icon: <ChatIcon /> },
    { key: "presentation", label: "Presentation Studio", icon: <PresentationIcon /> },
    {
      key: "dora",
      label: "Dora Dr. Health",
      icon: <DoraIcon />,
      action: () => (onOpenApp ? onOpenApp({ id: "dora" }) : handleTabClick("apps")),
      active: activeTab === "apps" && activeApp === "dora",
    },
    {
      key: "finance",
      label: "Vidya F.E.I Advisor",
      icon: <FinanceIcon />,
      action: () => (onOpenApp ? onOpenApp({ id: "finance" }) : handleTabClick("apps")),
      active: activeTab === "apps" && activeApp === "finance",
    },
    { key: "apps", label: "All Apps", icon: <AppsIcon /> },
    { key: "history", label: "History", icon: <HistoryIcon /> },
    { key: "profile", label: "Profile", icon: <ProfileIcon /> },
  ];

  const quickTools = [
    {
      id: "create_presentation",
      label: "Create Presentation",
      icon: <DocIcon />,
      colorClass: "qt-purple",
      action: () => (onQuickToolClick ? onQuickToolClick("presentation") : handleTabClick("presentation")),
      active: activeTab === "presentation",
    },
    {
      id: "dora_health",
      label: "Dora Medical",
      icon: <DoraIcon />,
      colorClass: "qt-teal",
      action: () => (onOpenApp ? onOpenApp({ id: "dora" }) : handleTabClick("apps")),
      active: activeTab === "apps" && activeApp === "dora",
    },
    {
      id: "vidya_fei",
      label: "Vidya F.E.I",
      icon: <FinanceIcon />,
      colorClass: "qt-blue",
      action: () => (onOpenApp ? onOpenApp({ id: "finance" }) : handleTabClick("apps")),
      active: activeTab === "apps" && activeApp === "finance",
    },
    {
      id: "explore_apps",
      label: "Explore Apps",
      icon: <AppsIcon />,
      colorClass: "qt-amber",
      action: () => (onQuickToolClick ? onQuickToolClick("apps") : handleTabClick("apps")),
      active: activeTab === "apps" && !activeApp,
    },
  ];

  return (
    <aside className={`vitya-sidebar ${sidebarOpen ? "open" : ""}`}>
      {/* 1. BRAND HEADER */}
      <div className="vitya-sidebar-header">
        <div className="vitya-brand-container">
          <div className="vitya-logo-badge">
            <span className="vitya-logo-text">V.</span>
          </div>
          <div className="vitya-brand-text">
            <div className="vitya-brand-name-row">
              <h2 className="vitya-brand-title">vitya.ai</h2>
            </div>
            <span className="vitya-brand-subtitle">Multimodal Platform</span>
            <div className="vitya-brand-tagline">Presentation • Dora • Vidya F.E.I</div>
          </div>
        </div>

        {isMobile && (
          <button
            className="vitya-close-btn"
            onClick={() => setSidebarOpen(false)}
            aria-label="Close sidebar"
          >
            ✕
          </button>
        )}
      </div>

      {/* 2. SEARCH BAR */}
      <div className="vitya-sidebar-search">
        <div className="vitya-search-wrapper">
          <span className="vitya-search-icon">
            <SearchIcon />
          </span>
          <input
            ref={searchInputRef}
            type="text"
            placeholder="Search apps, chats, prompts..."
            className="vitya-search-input"
            value={searchText}
            onChange={(e) => {
              setSearchText(e.target.value);
              if (e.target.value.trim() && activeTab !== "apps") {
                handleTabClick("apps");
              }
            }}
          />
          <kbd className="vitya-kbd-badge">Ctrl K</kbd>
        </div>
      </div>

      {/* 3. NEW CHAT BUTTON */}
      <button className="vitya-new-chat-btn" onClick={handleNewChat}>
        <span className="vitya-btn-icon-left">+</span>
        <span className="vitya-btn-label">New Chat</span>
        <span className="vitya-btn-sparkles">✨</span>
      </button>

      {/* 4. MAIN NAVIGATION */}
      <nav className="vitya-sidebar-nav">
        {navItems.map((item) => {
          const isActive =
            item.active !== undefined
              ? item.active
              : item.key === "apps"
                ? activeTab === "apps" && !activeApp
                : activeTab === item.key ||
                  (item.key === "profile" && (activeTab || "").startsWith("profile"));
          return (
            <button
              key={item.key}
              className={`vitya-nav-item ${isActive ? "active" : ""}`}
              onClick={item.action ? item.action : () => handleTabClick(item.key)}
            >
              {isActive && <div className="vitya-active-indicator" />}
              <span className="vitya-nav-icon">{item.icon}</span>
              <span className="vitya-nav-label">{item.label}</span>
              <ChevronRight />
            </button>
          );
        })}
      </nav>

      {/* 5. QUICK TOOLS 2X2 GRID */}
      <div className="vitya-quick-tools-section">
        <div className="vitya-section-header">
          <span className="vitya-section-bolt">⚡</span>
          <span className="vitya-section-title">Quick Tools</span>
        </div>
        <div className="vitya-quick-tools-grid">
          {quickTools.map((tool) => (
            <button
              key={tool.id}
              className={`vitya-qt-card ${tool.colorClass} ${tool.active ? "active" : ""}`}
              onClick={tool.action}
            >
              <div className="vitya-qt-icon">{tool.icon}</div>
              <span className="vitya-qt-label">{tool.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* 6. SECONDARY SETTINGS MENU */}
      <div className="vitya-secondary-menu">
        <button
          className={`vitya-nav-item ${(activeTab || "").startsWith("settings") && activeTab !== "settings/help" ? "active" : ""}`}
          onClick={() => handleTabClick("settings")}
        >
          {((activeTab || "").startsWith("settings") && activeTab !== "settings/help") && (
            <div className="vitya-active-indicator" />
          )}
          <span className="vitya-nav-icon"><SettingsIcon /></span>
          <span className="vitya-nav-label">Settings</span>
          <ChevronRight />
        </button>

        <button
          className={`vitya-nav-item ${activeTab === "help" || activeTab === "settings/help" ? "active" : ""}`}
          onClick={() => handleTabClick("help")}
        >
          {(activeTab === "help" || activeTab === "settings/help") && (
            <div className="vitya-active-indicator" />
          )}
          <span className="vitya-nav-icon"><HelpIcon /></span>
          <span className="vitya-nav-label">Help & Support</span>
          <ChevronRight />
        </button>
      </div>

      {/* 7. PROFILE FOOTER CARD */}
      <div
        className="vitya-sidebar-profile-card"
        onClick={() => handleTabClick("profile")}
        role="button"
        tabIndex={0}
      >
        <div className="vitya-sb-avatar-wrapper">
          <img
            src={profilePicSrc}
            alt="Profile"
            className="vitya-profile-avatar"
            onError={(e) => {
              e.currentTarget.onerror = null;
              e.currentTarget.src = defaultAvatar;
            }}
          />
          <span className="vitya-online-status" />
        </div>
        <div className="vitya-profile-details">
          <div className="vitya-profile-user-name">{user?.name || "Pradeep Parihar"}</div>
          <div className="vitya-profile-user-email">{user?.email || "pradeep0810parihar@gmail.com"}</div>
        </div>
        <ChevronRight />
      </div>
    </aside>
  );
}
