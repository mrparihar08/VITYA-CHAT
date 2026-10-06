import React, { useState, useMemo, useEffect, useCallback, useRef } from "react";
import {
  Search,
  X,
  Star,
  MoreVertical,
  ArrowUpRight,
  Sparkles,
  Briefcase,
  TrendingUp,
  Shield,
  Globe,
  Sliders,
  Grid,
  Clock,
  ExternalLink,
  Copy,
  Check,
} from "lucide-react";
import "./AppsWorkspace.css";

// Category Definitions
export const APP_CATEGORIES = [
  { id: "all", label: "All Apps", icon: Grid },
  { id: "ai", label: "AI & Intelligence", icon: Sparkles },
  { id: "productivity", label: "Productivity", icon: Briefcase },
  { id: "finance", label: "Finance", icon: TrendingUp },
  { id: "security", label: "Security & Admin", icon: Shield },
  { id: "external", label: "Connected Apps", icon: Globe },
  { id: "system", label: "System", icon: Sliders },
];

export const AppsWorkspace = ({
  apps = [],
  onOpenApp,
  user,
}) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState("all");
  const [favorites, setFavorites] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem("vitya_favorite_apps") || "[]");
    } catch {
      return [];
    }
  });
  const [recentAppIds, setRecentAppIds] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem("vitya_recent_apps") || "[]");
    } catch {
      return ["dora", "finance", "notes", "calendar"];
    }
  });
  const [openMenuAppId, setOpenMenuAppId] = useState(null);
  const [copiedAppId, setCopiedAppId] = useState(null);
  const searchInputRef = useRef(null);
  const menuRef = useRef(null);

  // Close more menu on outside click
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setOpenMenuAppId(null);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Keyboard shortcut: Press "/" or Ctrl+K to search
  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.key === "/" || (e.ctrlKey && e.key === "k")) && document.activeElement !== searchInputRef.current) {
        e.preventDefault();
        searchInputRef.current?.focus();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  // Toggle favorite
  const handleToggleFavorite = useCallback((appId, e) => {
    e?.stopPropagation();
    setFavorites((prev) => {
      const next = prev.includes(appId) ? prev.filter((id) => id !== appId) : [...prev, appId];
      try {
        localStorage.setItem("vitya_favorite_apps", JSON.stringify(next));
      } catch {}
      return next;
    });
  }, []);

  // App launch handler that logs recent apps
  const handleLaunchApp = useCallback(
    (app) => {
      setRecentAppIds((prev) => {
        const next = [app.id, ...prev.filter((id) => id !== app.id)].slice(0, 8);
        try {
          localStorage.setItem("vitya_recent_apps", JSON.stringify(next));
        } catch {}
        return next;
      });
      onOpenApp?.(app);
    },
    [onOpenApp]
  );

  // Copy app link or URL
  const handleCopyLink = useCallback((app, e) => {
    e?.stopPropagation();
    const link = app.url || `${window.location.origin}/apps/${app.id}`;
    navigator.clipboard.writeText(link);
    setCopiedAppId(app.id);
    setTimeout(() => {
      setCopiedAppId(null);
      setOpenMenuAppId(null);
    }, 1500);
  }, []);

  // Filtered applications based on search & category
  const filteredApps = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();

    return apps.filter((app) => {
      // Admin filter if applicable
      if (app.isAdmin && user && user.role !== "admin" && user.is_admin !== true) {
        // preserve existing accessibility rule
      }

      // Category matching
      if (activeCategory !== "all") {
        if (activeCategory === "ai" && app.category !== "ai" && app.id !== "dora") return false;
        if (activeCategory === "productivity" && app.category !== "productivity") return false;
        if (activeCategory === "finance" && app.category !== "finance") return false;
        if (activeCategory === "security" && app.category !== "security") return false;
        if (activeCategory === "external" && app.category !== "external" && app.type !== "external") return false;
        if (activeCategory === "system" && app.category !== "system") return false;
      }

      // Search matching (Name, Description, Keywords, Type, Category)
      if (query) {
        const matchName = app.name.toLowerCase().includes(query);
        const matchDesc = (app.desc || "").toLowerCase().includes(query);
        const matchCategory = (app.category || "").toLowerCase().includes(query);
        const matchType = (app.type || "").toLowerCase().includes(query);
        const matchKeywords = (app.keywords || []).some((kw) => kw.toLowerCase().includes(query));

        return matchName || matchDesc || matchCategory || matchType || matchKeywords;
      }

      return true;
    });
  }, [apps, searchQuery, activeCategory, user]);

  // Quick Access items (Favorites + Recent Apps)
  const quickAccessApps = useMemo(() => {
    const combinedIds = Array.from(new Set([...favorites, ...recentAppIds]));
    const list = combinedIds
      .map((id) => apps.find((a) => a.id === id))
      .filter(Boolean)
      .slice(0, 6);

    // Default fallback if empty
    if (!list.length) {
      return apps.filter((a) => ["dora", "finance", "notes", "calendar"].includes(a.id));
    }
    return list;
  }, [apps, favorites, recentAppIds]);

  // Category item counts
  const categoryCounts = useMemo(() => {
    const counts = { all: apps.length };
    apps.forEach((app) => {
      const cat = app.category || (app.type === "external" ? "external" : "productivity");
      counts[cat] = (counts[cat] || 0) + 1;
      if (app.id === "dora") {
        counts["ai"] = (counts["ai"] || 0) + 1;
      }
    });
    return counts;
  }, [apps]);

  return (
    <div className="vityaAppsWorkspace">
      {/* 1. WORKSPACE HEADER & SEARCH */}
      <header className="vWorkspaceHeader">
        <div className="vWorkspaceTitleGroup">
          <div className="vWorkspaceTitleRow">
            <h2 className="vWorkspaceTitle">Apps Workspace</h2>
            <span className="vWorkspaceCountPill">
              {apps.length} Tools & Apps
            </span>
          </div>
          <p className="vWorkspaceSubtitle">
            Intelligent productivity tools, financial models and connected cloud services.
          </p>
        </div>

        <div className="vWorkspaceControls">
          <div className="vWorkspaceSearchBox">
            <span className="vSearchIcon">
              <Search size={16} />
            </span>
            <input
              ref={searchInputRef}
              type="text"
              className="vSearchInput"
              placeholder="Search apps, tools & services... (/)"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              aria-label="Search apps"
            />
            {searchQuery && (
              <button
                className="vSearchClearBtn"
                onClick={() => setSearchQuery("")}
                title="Clear search"
                aria-label="Clear search"
              >
                <X size={14} />
              </button>
            )}
          </div>
        </div>
      </header>

      {/* 2. QUICK ACCESS SECTION (If not actively searching) */}
      {!searchQuery && quickAccessApps.length > 0 && (
        <section className="vQuickAccessSection">
          <div className="vSectionLabelRow">
            <h4 className="vSectionLabel">
              <Clock size={13} /> Quick Access
            </h4>
          </div>
          <div className="vQuickAccessRow">
            {quickAccessApps.map((app) => (
              <button
                key={app.id}
                className="vQuickChip"
                onClick={() => handleLaunchApp(app)}
                title={`Launch ${app.name}`}
              >
                <div
                  className="vQuickChipIconBox"
                  style={{ background: app.iconBg || "linear-gradient(135deg, #8b5cf6 0%, #6366f1 100%)" }}
                >
                  {app.icon}
                </div>
                <span>{app.name}</span>
                {favorites.includes(app.id) && (
                  <Star size={11} fill="#fbbf24" color="#fbbf24" style={{ marginLeft: 2 }} />
                )}
              </button>
            ))}
          </div>
        </section>
      )}

      {/* 3. CATEGORY NAVIGATION TABS */}
      <nav className="vCategoryNav" aria-label="App categories">
        {APP_CATEGORIES.map((cat) => {
          const Icon = cat.icon;
          const isActive = activeCategory === cat.id;
          const count = categoryCounts[cat.id] ?? 0;

          return (
            <button
              key={cat.id}
              className={`vCategoryTab ${isActive ? "active" : ""}`}
              onClick={() => setActiveCategory(cat.id)}
              aria-pressed={isActive}
            >
              <Icon size={14} />
              <span>{cat.label}</span>
              {count > 0 && <span className="vCategoryTabBadge">{count}</span>}
            </button>
          );
        })}
      </nav>

      {/* 4. APPS GRID */}
      {filteredApps.length > 0 ? (
        <div className="vAppsGrid">
          {filteredApps.map((app) => {
            const isStarred = favorites.includes(app.id);
            const isMenuOpen = openMenuAppId === app.id;
            const isExternal = app.type === "external";
            const isAdmin = Boolean(app.isAdmin);

            return (
              <div
                key={app.id}
                className="vAppCard"
                tabIndex={0}
                role="button"
                onClick={() => handleLaunchApp(app)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault();
                    handleLaunchApp(app);
                  }
                }}
              >
                {/* Top Row: Icon + Star + More Actions */}
                <div className="vAppCardTopRow">
                  <div
                    className="vAppCardIconBox"
                    style={{ background: app.iconBg || "linear-gradient(135deg, #8b5cf6 0%, #6366f1 100%)" }}
                  >
                    <span>{app.icon}</span>
                  </div>

                  <div className="vAppCardActions" onClick={(e) => e.stopPropagation()}>
                    <button
                      className={`vAppCardStarBtn ${isStarred ? "starred" : ""}`}
                      onClick={(e) => handleToggleFavorite(app.id, e)}
                      title={isStarred ? "Remove from Favorites" : "Add to Favorites"}
                      aria-label="Toggle favorite"
                    >
                      <Star size={15} fill={isStarred ? "#fbbf24" : "none"} />
                    </button>

                    <button
                      className="vAppCardMoreBtn"
                      onClick={(e) => {
                        e.stopPropagation();
                        setOpenMenuAppId(isMenuOpen ? null : app.id);
                      }}
                      title="More options"
                      aria-label="More options"
                    >
                      <MoreVertical size={15} />
                    </button>

                    {/* Popover Menu */}
                    {isMenuOpen && (
                      <div className="vAppMenuPopover" ref={menuRef}>
                        <button
                          className="vAppMenuItem"
                          onClick={() => {
                            setOpenMenuAppId(null);
                            handleLaunchApp(app);
                          }}
                        >
                          <ArrowUpRight size={14} /> Open
                        </button>
                        {isExternal && app.url && (
                          <button
                            className="vAppMenuItem"
                            onClick={() => {
                              setOpenMenuAppId(null);
                              window.open(app.url, "_blank", "noopener,noreferrer");
                            }}
                          >
                            <ExternalLink size={14} /> Open in new tab
                          </button>
                        )}
                        <button
                          className="vAppMenuItem"
                          onClick={(e) => {
                            handleToggleFavorite(app.id, e);
                            setOpenMenuAppId(null);
                          }}
                        >
                          <Star size={14} fill={isStarred ? "#fbbf24" : "none"} color={isStarred ? "#fbbf24" : "currentColor"} />
                          {isStarred ? "Remove Favorite" : "Favorite"}
                        </button>
                        <button
                          className="vAppMenuItem"
                          onClick={(e) => handleCopyLink(app, e)}
                        >
                          {copiedAppId === app.id ? <Check size={14} color="#10b981" /> : <Copy size={14} />}
                          {copiedAppId === app.id ? "Copied!" : "Copy Link"}
                        </button>
                      </div>
                    )}
                  </div>
                </div>

                {/* Body: Title & Description */}
                <div className="vAppCardBody">
                  <h3 className="vAppCardTitle">{app.name}</h3>
                  <p className="vAppCardDesc">{app.desc}</p>
                </div>

                {/* Footer: Metadata Tag + Open Action */}
                <div className="vAppCardFooter">
                  <span
                    className={`vAppTag ${
                      isAdmin
                        ? "admin"
                        : isExternal
                        ? "external"
                        : app.category === "vitya"
                        ? "vitya"
                        : "workspace"
                    }`}
                  >
                    {isAdmin
                      ? "🛡️ Admin"
                      : isExternal
                      ? "↗ Connected"
                      : app.category === "finance"
                      ? "💳 Finance"
                      : app.category === "ai"
                      ? "✨ AI Tool"
                      : "⚡ Workspace"}
                  </span>

                  <span className="vAppOpenLink">
                    Open <ArrowUpRight size={13} />
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        /* 5. EMPTY SEARCH / FILTER STATE */
        <div className="vEmptyAppsState">
          <div className="vEmptyIconBox">
            <Search size={28} />
          </div>
          <h3 className="vEmptyTitle">No apps found</h3>
          <p className="vEmptyDesc">
            No applications match "<strong>{searchQuery}</strong>" in the selected category.
          </p>
          <button
            className="vResetSearchBtn"
            onClick={() => {
              setSearchQuery("");
              setActiveCategory("all");
            }}
          >
            Clear Search & Filters
          </button>
        </div>
      )}
    </div>
  );
};

export default AppsWorkspace;
