import React, { useState, useEffect, useRef, useCallback } from "react";
import {
  MessageSquare,
  Presentation,
  LayoutGrid,
  Clock,
  Search,
  Plus,
  PanelLeftClose,
  PanelLeftOpen,
  User,
  Settings,
  HelpCircle,
  LogOut,
  ChevronUp,
  X,
  Sparkles,
} from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import "./Sidebar.css";

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
  const { logout } = useAuth();
  const searchInputRef = useRef(null);
  const profileCardRef = useRef(null);
  const profileMenuRef = useRef(null);

  // Collapsed state persisted in localStorage (desktop only)
  const [isCollapsed, setIsCollapsed] = useState(() => {
    if (typeof window !== "undefined") {
      try {
        return localStorage.getItem("vitya_sidebar_collapsed") === "true";
      } catch {
        return false;
      }
    }
    return false;
  });

  // Profile dropdown menu state
  const [profileMenuOpen, setProfileMenuOpen] = useState(false);

  // On mobile/tablet, collapse mode is disabled; drawer overlay is used instead
  const effectiveCollapsed = !isMobile && isCollapsed;

  // Toggle desktop collapse
  const toggleCollapse = useCallback(() => {
    setIsCollapsed((prev) => {
      const next = !prev;
      try {
        localStorage.setItem("vitya_sidebar_collapsed", String(next));
      } catch {}
      return next;
    });
  }, []);

  // Keyboard shortcut Ctrl+K to focus search input
  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        if (effectiveCollapsed) {
          setIsCollapsed(false);
          try {
            localStorage.setItem("vitya_sidebar_collapsed", "false");
          } catch {}
          setTimeout(() => searchInputRef.current?.focus(), 100);
        } else {
          searchInputRef.current?.focus();
        }
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [effectiveCollapsed]);

  // Close profile menu on click outside
  useEffect(() => {
    const handleOutsideClick = (e) => {
      if (
        profileCardRef.current &&
        !profileCardRef.current.contains(e.target) &&
        profileMenuRef.current &&
        !profileMenuRef.current.contains(e.target)
      ) {
        setProfileMenuOpen(false);
      }
    };
    if (profileMenuOpen) {
      document.addEventListener("mousedown", handleOutsideClick);
    }
    return () => document.removeEventListener("mousedown", handleOutsideClick);
  }, [profileMenuOpen]);

  // Close profile menu on Escape
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === "Escape") {
        setProfileMenuOpen(false);
      }
    };
    window.addEventListener("keydown", handleEscape);
    return () => window.removeEventListener("keydown", handleEscape);
  }, []);

  // Essential navigation items
  const navItems = [
    { key: "chat", label: "Chat", icon: MessageSquare },
    { key: "presentation", label: "Presentation Studio", icon: Presentation },
    { key: "apps", label: "All Apps", icon: LayoutGrid },
    { key: "history", label: "History", icon: Clock },
  ];

  // Check active state
  const isItemActive = (key) => {
    if (key === "chat") return activeTab === "chat";
    if (key === "presentation") return activeTab === "presentation";
    if (key === "apps") return activeTab === "apps" && !activeApp;
    if (key === "history") return activeTab === "history";
    return false;
  };

  // Nav item click handler
  const handleItemClick = (key) => {
    handleTabClick(key);
    if (isMobile && setSidebarOpen) {
      setSidebarOpen(false);
    }
  };

  // Profile menu action handler
  const handleProfileNavigation = (destination) => {
    setProfileMenuOpen(false);
    if (destination === "profile") {
      handleTabClick("profile");
    } else if (destination === "settings") {
      handleTabClick("settings");
    } else if (destination === "help") {
      handleTabClick("help");
    }
    if (isMobile && setSidebarOpen) {
      setSidebarOpen(false);
    }
  };

  // Sign out handler
  const handleLogout = () => {
    setProfileMenuOpen(false);
    if (logout) {
      logout();
    }
    if (typeof window !== "undefined") {
      window.location.href = "/login";
    }
  };

  return (
    <aside
      className={`vitya-sidebar ${sidebarOpen ? "open" : ""} ${
        effectiveCollapsed ? "collapsed" : ""
      }`}
      aria-label="Main sidebar"
    >
      {/* ========================================================
          1. BRAND HEADER & COLLAPSE TOGGLE
          ======================================================== */}
      <div className="vitya-sidebar-header">
        <div
          className="vitya-brand-container"
          onClick={() => {
            if (effectiveCollapsed) toggleCollapse();
          }}
          title={effectiveCollapsed ? "Expand sidebar" : "Vitya.AI"}
        >
          <div className="vitya-logo-badge">
            <span className="vitya-logo-text">V.</span>
          </div>
          {!effectiveCollapsed && (
            <div className="vitya-brand-text">
              <h1 className="vitya-brand-title">Vitya.AI</h1>
              <span className="vitya-brand-subtitle">Multimodal Workstation</span>
            </div>
          )}
        </div>

        {/* Mobile close button or Desktop collapse toggle */}
        {isMobile ? (
          <button
            className="vitya-header-icon-btn"
            onClick={() => setSidebarOpen(false)}
            aria-label="Close sidebar"
            title="Close sidebar"
          >
            <X size={18} />
          </button>
        ) : (
          <button
            className="vitya-header-icon-btn vitya-collapse-btn"
            onClick={toggleCollapse}
            aria-label={effectiveCollapsed ? "Expand sidebar" : "Collapse sidebar"}
            title={effectiveCollapsed ? "Expand sidebar" : "Collapse sidebar"}
          >
            {effectiveCollapsed ? <PanelLeftOpen size={17} /> : <PanelLeftClose size={17} />}
          </button>
        )}
      </div>

      {/* ========================================================
          2. SEARCH BAR / SEARCH TRIGGER
          ======================================================== */}
      <div className="vitya-sidebar-search">
        {effectiveCollapsed ? (
          <button
            className="vitya-search-collapsed-btn"
            onClick={() => {
              toggleCollapse();
              setTimeout(() => searchInputRef.current?.focus(), 100);
            }}
            title="Search (Ctrl+K)"
            aria-label="Search"
          >
            <Search size={17} />
          </button>
        ) : (
          <div className="vitya-search-wrapper">
            <span className="vitya-search-icon">
              <Search size={15} />
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
              aria-label="Search apps, chats, prompts"
            />
            <kbd className="vitya-kbd-badge">Ctrl K</kbd>
          </div>
        )}
      </div>

      {/* ========================================================
          3. NEW CHAT PRIMARY ACTION
          ======================================================== */}
      <button
        type="button"
        className={`vitya-new-chat-btn ${effectiveCollapsed ? "collapsed-btn" : ""}`}
        onClick={() => {
          if (handleNewChat) handleNewChat();
          if (isMobile && setSidebarOpen) setSidebarOpen(false);
        }}
        title="Start a new chat conversation"
        aria-label="New Chat"
      >
        <Plus size={18} strokeWidth={2.6} className="vitya-btn-icon-plus" />
        {!effectiveCollapsed && (
          <>
            <span className="vitya-btn-label">New Chat</span>
            <Sparkles size={14} className="vitya-btn-sparkle" />
          </>
        )}
      </button>

      {/* ========================================================
          4. ESSENTIAL NAVIGATION ITEMS
          ======================================================== */}
      <nav className="vitya-sidebar-nav" aria-label="Main navigation">
        {navItems.map((item) => {
          const Icon = item.icon;
          const active = isItemActive(item.key);

          return (
            <button
              key={item.key}
              className={`vitya-nav-item ${active ? "active" : ""}`}
              onClick={() => handleItemClick(item.key)}
              title={effectiveCollapsed ? item.label : undefined}
              aria-label={item.label}
              aria-current={active ? "page" : undefined}
            >
              {active && <div className="vitya-active-indicator" />}
              <span className="vitya-nav-icon">
                <Icon size={19} />
              </span>
              {!effectiveCollapsed && (
                <span className="vitya-nav-label">{item.label}</span>
              )}
            </button>
          );
        })}
      </nav>

      {/* ========================================================
          5. BOTTOM USER PROFILE CARD & POPUP DROPDOWN
          ======================================================== */}
      <div className="vitya-profile-container">
        {/* Floating Profile Dropdown Menu */}
        {profileMenuOpen && (
          <div
            className={`vitya-profile-menu ${effectiveCollapsed ? "collapsed-popup" : ""}`}
            ref={profileMenuRef}
            role="menu"
            aria-label="Account options"
          >
            <div className="vitya-pm-header">
              <div className="vitya-pm-avatar-wrap">
                <img
                  src={profilePicSrc}
                  alt="Profile"
                  className="vitya-pm-avatar"
                  onError={(e) => {
                    e.currentTarget.onerror = null;
                    e.currentTarget.src = defaultAvatar;
                  }}
                />
              </div>
              <div className="vitya-pm-user-info">
                <div className="vitya-pm-name">{user?.name || "User Account"}</div>
                <div className="vitya-pm-email">{user?.email || "user@vitya.ai"}</div>
              </div>
            </div>

            <div className="vitya-pm-divider" />

            <button
              className={`vitya-pm-item ${(activeTab || "").startsWith("profile") ? "active" : ""}`}
              onClick={() => handleProfileNavigation("profile")}
              role="menuitem"
            >
              <User size={16} />
              <span>Profile &amp; Account</span>
            </button>

            <button
              className={`vitya-pm-item ${(activeTab || "").startsWith("settings") && activeTab !== "settings/help" ? "active" : ""}`}
              onClick={() => handleProfileNavigation("settings")}
              role="menuitem"
            >
              <Settings size={16} />
              <span>Settings</span>
            </button>

            <button
              className={`vitya-pm-item ${activeTab === "help" || activeTab === "settings/help" ? "active" : ""}`}
              onClick={() => handleProfileNavigation("help")}
              role="menuitem"
            >
              <HelpCircle size={16} />
              <span>Help &amp; Support</span>
            </button>

            <div className="vitya-pm-divider" />

            <button
              className="vitya-pm-item vitya-pm-logout"
              onClick={handleLogout}
              role="menuitem"
            >
              <LogOut size={16} />
              <span>Sign Out</span>
            </button>
          </div>
        )}

        {/* Profile Card Button */}
        <div
          ref={profileCardRef}
          className={`vitya-sidebar-profile-card ${
            (activeTab || "").startsWith("profile") ? "active-route" : ""
          } ${profileMenuOpen ? "menu-open" : ""}`}
          onClick={() => setProfileMenuOpen((prev) => !prev)}
          role="button"
          tabIndex={0}
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === " ") {
              e.preventDefault();
              setProfileMenuOpen((prev) => !prev);
            }
          }}
          title={effectiveCollapsed ? (user?.name || "User Account") : undefined}
          aria-expanded={profileMenuOpen}
          aria-haspopup="menu"
          aria-label="User profile and settings menu"
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

          {!effectiveCollapsed && (
            <>
              <div className="vitya-profile-details">
                <span className="vitya-profile-user-name">
                  {user?.name || "User Account"}
                </span>
                <span className="vitya-profile-user-email">
                  {user?.email || "Free Plan"}
                </span>
              </div>
              <ChevronUp
                size={16}
                className={`vitya-profile-chevron ${profileMenuOpen ? "open" : ""}`}
              />
            </>
          )}
        </div>
      </div>
    </aside>
  );
}
