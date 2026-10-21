import React, { useState, useMemo, useEffect, useCallback, useRef } from "react";
import {
  Search,
  X,
  Star,
  ArrowRight,
  Sparkles,
  Briefcase,
  TrendingUp,
  Cloud,
  Grid,
  Clock,
  ExternalLink,
  ChevronDown,
  LayoutGrid,
  List,
  Bell,
  MessageSquare,
  FileText,
  CheckSquare,
  PieChart,
  HardDrive,
  Newspaper,
  Stethoscope,
  Receipt,
  Zap,
  Mic,
  Calendar as CalendarIcon,
  Target,
  RefreshCw,
  Activity,
  Settings as SettingsIcon,
  CreditCard,
  ShieldCheck,
  Sliders,
  Compass,
  Radio,
  Mail,
} from "lucide-react";
import "./AppsWorkspace.css";

// Category definitions matching the design system
export const APP_CATEGORIES = [
  { id: "all", label: "All tools", icon: Grid },
  { id: "productivity", label: "Productivity", icon: Briefcase },
  { id: "finance", label: "Finance", icon: TrendingUp },
  { id: "ai", label: "AI tools", icon: Sparkles },
  { id: "cloud", label: "Cloud services", icon: Cloud },
  { id: "recently_used", label: "Recently used", icon: Clock },
  { id: "favorites", label: "Favorites", icon: Star },
];

// App SVG Icon Renderer for maximum visual fidelity
const RenderAppIcon = ({ iconType, size = 22 }) => {
  switch (iconType) {
    case "chat":
      return <MessageSquare size={size} color="#ffffff" strokeWidth={2.2} />;
    case "presentation":
      return (
        <span style={{ fontWeight: 800, fontSize: size * 0.85, color: "#ffffff", letterSpacing: -0.5, lineHeight: 1 }}>
          P
        </span>
      );
    case "notes":
      return <FileText size={size} color="#ffffff" strokeWidth={2.2} />;
    case "tasks":
      return <CheckSquare size={size} color="#ffffff" strokeWidth={2.2} />;
    case "finance":
      return <TrendingUp size={size} color="#ffffff" strokeWidth={2.2} />;
    case "analytics":
      return <PieChart size={size} color="#ffffff" strokeWidth={2.2} />;
    case "files":
      return <Cloud size={size} color="#ffffff" strokeWidth={2.2} />;
    case "research":
      return <Newspaper size={size} color="#ffffff" strokeWidth={2.2} />;
    case "dora":
      return <Stethoscope size={size} color="#ffffff" strokeWidth={2.2} />;
    case "scan-ledger":
      return <Receipt size={size} color="#ffffff" strokeWidth={2.2} />;
    case "automations":
      return <Zap size={size} color="#ffffff" strokeWidth={2.2} />;
    case "voice-notes":
      return <Mic size={size} color="#ffffff" strokeWidth={2.2} />;
    case "calendar":
      return <CalendarIcon size={size} color="#ffffff" strokeWidth={2.2} />;
    case "savings":
      return <Target size={size} color="#ffffff" strokeWidth={2.2} />;
    case "subscriptions":
      return <RefreshCw size={size} color="#ffffff" strokeWidth={2.2} />;
    case "financial-health":
      return <Activity size={size} color="#ffffff" strokeWidth={2.2} />;
    case "settings":
      return <SettingsIcon size={size} color="#ffffff" strokeWidth={2.2} />;
    case "vitya-expense":
      return <CreditCard size={size} color="#ffffff" strokeWidth={2.2} />;
    case "Security-vitya":
      return <ShieldCheck size={size} color="#ffffff" strokeWidth={2.2} />;
    case "vitya-admin-dashboard":
      return <Sliders size={size} color="#ffffff" strokeWidth={2.2} />;
    case "vitya-tourist-travel-assistant":
      return <Compass size={size} color="#ffffff" strokeWidth={2.2} />;
    case "vitya-monitor":
      return <Radio size={size} color="#ffffff" strokeWidth={2.2} />;
    case "drive":
      return <HardDrive size={size} color="#ffffff" strokeWidth={2.2} />;
    case "gmail":
      return <Mail size={size} color="#ffffff" strokeWidth={2.2} />;
    case "calendar-web":
      return <CalendarIcon size={size} color="#ffffff" strokeWidth={2.2} />;
    default:
      return <Sparkles size={size} color="#ffffff" strokeWidth={2.2} />;
  }
};

// Formats a relative timestamp from milliseconds
const formatRelativeTime = (timestamp) => {
  if (!timestamp) return "";
  const now = Date.now();
  const diffSec = Math.max(0, Math.floor((now - timestamp) / 1000));
  if (diffSec < 60) return "Last used just now";
  const diffMin = Math.floor(diffSec / 60);
  if (diffMin < 60) return `Last used ${diffMin} ${diffMin === 1 ? "minute" : "minutes"} ago`;
  const diffHour = Math.floor(diffMin / 60);
  if (diffHour < 24) return `Last used ${diffHour} ${diffHour === 1 ? "hour" : "hours"} ago`;
  const diffDay = Math.floor(diffHour / 24);
  if (diffDay === 1) return "Last used yesterday";
  return `Last used ${diffDay} days ago`;
};

// Default seed history for first launch to align with design specs
const INITIAL_RECENT_HISTORY = [
  { id: "chat", lastUsed: Date.now() - 2 * 60 * 60 * 1000, context: "Continue your last conversation" },
  { id: "presentation", lastUsed: Date.now() - 5 * 60 * 60 * 1000, context: "Create stunning presentations with AI" },
];

export const AppsWorkspace = ({
  apps = [],
  onOpenApp,
  user,
}) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState("all");
  const [sortBy, setSortBy] = useState("popular"); // "popular" | "alpha" | "recent"
  const [viewMode, setViewMode] = useState("grid"); // "grid" | "list"
  const [sortDropdownOpen, setSortDropdownOpen] = useState(false);

  // Favorites state persisted to localStorage
  const [favorites, setFavorites] = useState(() => {
    try {
      const stored = localStorage.getItem("vitya_favorite_apps");
      if (stored) return JSON.parse(stored);
      // Default initial favorite: AI Chat
      return ["chat"];
    } catch {
      return ["chat"];
    }
  });

  // Recent usage history with timestamps & context
  const [usageHistory, setUsageHistory] = useState(() => {
    try {
      const raw = localStorage.getItem("vitya_apps_usage_history");
      if (raw) {
        const parsed = JSON.parse(raw);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
      return INITIAL_RECENT_HISTORY;
    } catch {
      return INITIAL_RECENT_HISTORY;
    }
  });

  // Launch counts for popularity sorting
  const [launchCounts, setLaunchCounts] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem("vitya_apps_launch_counts") || "{}");
    } catch {
      return {};
    }
  });

  const searchInputRef = useRef(null);
  const sortRef = useRef(null);

  // Close sort dropdown when clicking outside
  useEffect(() => {
    const handleOutsideClick = (e) => {
      if (sortRef.current && !sortRef.current.contains(e.target)) {
        setSortDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleOutsideClick);
    return () => document.removeEventListener("mousedown", handleOutsideClick);
  }, []);

  // Keyboard shortcut Ctrl+K and / to focus search
  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.key === "/" || (e.ctrlKey && e.key.toLowerCase() === "k")) && document.activeElement !== searchInputRef.current) {
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

  // Launch app handler
  const handleLaunchApp = useCallback(
    (app) => {
      if (!app) return;

      const now = Date.now();
      const newEntry = {
        id: app.id,
        lastUsed: now,
        context: app.context || app.desc,
      };

      // Update usage history
      setUsageHistory((prev) => {
        const next = [newEntry, ...prev.filter((item) => item.id !== app.id)].slice(0, 12);
        try {
          localStorage.setItem("vitya_apps_usage_history", JSON.stringify(next));
          localStorage.setItem("vitya_recent_apps", JSON.stringify(next.map((n) => n.id)));
        } catch {}
        return next;
      });

      // Increment launch count for popularity
      setLaunchCounts((prev) => {
        const next = { ...prev, [app.id]: (prev[app.id] || 0) + 1 };
        try {
          localStorage.setItem("vitya_apps_launch_counts", JSON.stringify(next));
        } catch {}
        return next;
      });

      onOpenApp?.(app);
    },
    [onOpenApp]
  );

  // Dynamic category counts based on current registry
  const categoryCounts = useMemo(() => {
    const counts = {
      all: apps.length,
      productivity: 0,
      finance: 0,
      ai: 0,
      cloud: 0,
      recently_used: usageHistory.length,
      favorites: favorites.length,
    };

    apps.forEach((app) => {
      const cat = app.category || "";
      const tags = app.tags || [];
      const isExt = app.type === "external";

      if (cat === "productivity" || tags.includes("Productivity")) counts.productivity += 1;
      if (cat === "finance" || tags.includes("Finance")) counts.finance += 1;
      if (cat === "ai" || tags.includes("AI") || app.id === "dora") counts.ai += 1;
      if (cat === "cloud" || isExt || tags.includes("Cloud") || tags.includes("Storage")) counts.cloud += 1;
    });

    return counts;
  }, [apps, usageHistory, favorites]);

  // "Continue where you left off" apps list (top 2-4 items)
  const continueWhereLeftOff = useMemo(() => {
    return usageHistory
      .map((entry) => {
        const app = apps.find((a) => a.id === entry.id);
        if (!app) return null;
        return {
          ...app,
          lastUsedTime: entry.lastUsed,
          lastUsedContext: entry.context || app.context || app.desc,
        };
      })
      .filter(Boolean)
      .slice(0, 2);
  }, [usageHistory, apps]);

  // Filtered and sorted apps
  const visibleApps = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();

    // 1. Filter by category
    let result = apps.filter((app) => {
      // Admin filter
      if (app.isAdmin && user && user.role !== "admin" && user.is_admin !== true) {
        return false;
      }

      if (activeCategory === "all") return true;
      if (activeCategory === "favorites") return favorites.includes(app.id);
      if (activeCategory === "recently_used") {
        return usageHistory.some((item) => item.id === app.id);
      }

      const tags = app.tags || [];
      if (activeCategory === "ai") {
        return app.category === "ai" || tags.includes("AI") || app.id === "dora";
      }
      if (activeCategory === "productivity") {
        return app.category === "productivity" || tags.includes("Productivity");
      }
      if (activeCategory === "finance") {
        return app.category === "finance" || tags.includes("Finance");
      }
      if (activeCategory === "cloud") {
        return app.category === "cloud" || app.type === "external" || tags.includes("Cloud") || tags.includes("Storage");
      }

      return true;
    });

    // 2. Filter by search query
    if (query) {
      result = result.filter((app) => {
        const matchName = (app.name || "").toLowerCase().includes(query);
        const matchDesc = (app.desc || "").toLowerCase().includes(query);
        const matchCategory = (app.category || "").toLowerCase().includes(query);
        const matchTags = (app.tags || []).some((t) => t.toLowerCase().includes(query));
        const matchKeywords = (app.keywords || []).some((kw) => kw.toLowerCase().includes(query));
        return matchName || matchDesc || matchCategory || matchTags || matchKeywords;
      });
    }

    // 3. Sort results
    if (activeCategory === "recently_used") {
      // Sort strictly by most recent
      const indexMap = new Map(usageHistory.map((item, idx) => [item.id, idx]));
      result.sort((a, b) => {
        const aIdx = indexMap.has(a.id) ? indexMap.get(a.id) : 9999;
        const bIdx = indexMap.has(b.id) ? indexMap.get(b.id) : 9999;
        return aIdx - bIdx;
      });
    } else if (sortBy === "alpha") {
      result.sort((a, b) => a.name.localeCompare(b.name));
    } else if (sortBy === "recent") {
      const timeMap = new Map(usageHistory.map((item) => [item.id, item.lastUsed]));
      result.sort((a, b) => {
        const timeA = timeMap.get(a.id) || 0;
        const timeB = timeMap.get(b.id) || 0;
        return timeB - timeA;
      });
    } else {
      // Default: Popular (pre-configured weight + user launches)
      result.sort((a, b) => {
        const weightA = (a.popularity || 50) + (launchCounts[a.id] || 0) * 5;
        const weightB = (b.popularity || 50) + (launchCounts[b.id] || 0) * 5;
        return weightB - weightA;
      });
    }

    return result;
  }, [apps, activeCategory, favorites, usageHistory, searchQuery, sortBy, launchCounts, user]);

  // Section title based on active category
  const sectionTitle = useMemo(() => {
    switch (activeCategory) {
      case "all":
        return "All Tools & Apps";
      case "ai":
        return "AI Tools & Intelligence";
      case "productivity":
        return "Productivity Tools";
      case "finance":
        return "Finance & Wealth Tools";
      case "cloud":
        return "Connected Cloud Services";
      case "recently_used":
        return "Recently Used Tools";
      case "favorites":
        return "Favorite Tools";
      default:
        return "All Tools & Apps";
    }
  }, [activeCategory]);

  return (
    <div className="vityaWorkspace">
      {/* ========================================================
          1. HEADER (Title, dynamic count, notification action)
          ======================================================== */}
      <header className="vHeader">
        <div className="vHeaderLeft">
          <div className="vHeaderTitleRow">
            <h1 className="vHeaderTitle">Apps Workspace</h1>
            <span className="vHeaderBadge">
              {apps.length} Tools &amp; Apps
            </span>
          </div>
          <p className="vHeaderSubtitle">
            Intelligent productivity tools, financial models and connected cloud services.
          </p>
        </div>

        <div className="vHeaderRight">
          <button
            className="vNotificationBtn"
            title="Notifications"
            aria-label="View notifications"
          >
            <Bell size={18} />
            <span className="vNotificationDot" />
          </button>
        </div>
      </header>

      {/* ========================================================
          2. SEARCH INPUT WITH SHORTCUT HINT
          ======================================================== */}
      <div className="vSearchContainer">
        <span className="vSearchIconWrapper">
          <Search size={18} />
        </span>
        <input
          ref={searchInputRef}
          type="text"
          className="vSearchInput"
          placeholder="Search tools and apps..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          aria-label="Search tools and apps"
        />
        {searchQuery ? (
          <button
            className="vSearchClearBtn"
            onClick={() => setSearchQuery("")}
            title="Clear search"
            aria-label="Clear search"
          >
            <X size={15} />
          </button>
        ) : (
          <div className="vSearchKbdWrapper">
            <kbd className="vSearchKbd">Ctrl</kbd>
            <kbd className="vSearchKbd">K</kbd>
          </div>
        )}
      </div>

      {/* ========================================================
          3. CATEGORY FILTER TABS
          ======================================================== */}
      <nav className="vCategoryRow" aria-label="Tool categories">
        {APP_CATEGORIES.map((cat) => {
          const Icon = cat.icon;
          const isActive = activeCategory === cat.id;
          const count = categoryCounts[cat.id] ?? 0;

          return (
            <button
              key={cat.id}
              className={`vCategoryPill ${isActive ? "active" : ""}`}
              onClick={() => setActiveCategory(cat.id)}
              aria-pressed={isActive}
            >
              <Icon size={15} />
              <span>{cat.label}</span>
              {count > 0 && <span className="vCategoryCountBadge">{count}</span>}
            </button>
          );
        })}
      </nav>

      {/* ========================================================
          4. "CONTINUE WHERE YOU LEFT OFF" SECTION
          ======================================================== */}
      {!searchQuery && activeCategory === "all" && continueWhereLeftOff.length > 0 && (
        <section className="vContinueSection">
          <div className="vSectionHeaderRow">
            <h2 className="vSectionHeading">Continue where you left off</h2>
            <button
              className="vViewAllLink"
              onClick={() => setActiveCategory("recently_used")}
            >
              View all <ArrowRight size={14} />
            </button>
          </div>

          <div className="vContinueGrid">
            {continueWhereLeftOff.map((app) => (
              <div
                key={`recent-${app.id}`}
                className="vContinueCard"
                role="button"
                tabIndex={0}
                onClick={() => handleLaunchApp(app)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault();
                    handleLaunchApp(app);
                  }
                }}
                title={`Launch ${app.name}`}
              >
                <div
                  className="vContinueIconBox"
                  style={{ background: app.iconBg || "linear-gradient(135deg, #7c3aed 0%, #6366f1 100%)" }}
                >
                  <RenderAppIcon iconType={app.icon} size={22} />
                </div>

                <div className="vContinueInfo">
                  <h3 className="vContinueName">{app.name}</h3>
                  <p className="vContinueContext">{app.lastUsedContext}</p>
                  <span className="vContinueTime">{formatRelativeTime(app.lastUsedTime)}</span>
                </div>

                <div className="vContinueAction">
                  <div className="vContinueArrowBtn">
                    <ArrowRight size={16} />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* ========================================================
          5. MAIN SECTION HEADER: SORTING & VIEW TOGGLES
          ======================================================== */}
      <section className="vMainSection">
        <div className="vMainSectionHeader">
          <h2 className="vMainSectionTitle">{sectionTitle}</h2>

          <div className="vMainControls">
            {/* Sort Dropdown */}
            <div className="vSortWrapper" ref={sortRef}>
              <span className="vSortLabel">Sort by:</span>
              <button
                className="vSortBtn"
                onClick={() => setSortDropdownOpen((prev) => !prev)}
                aria-expanded={sortDropdownOpen}
                aria-label="Sort options"
              >
                <span>
                  {sortBy === "popular"
                    ? "Popular"
                    : sortBy === "alpha"
                    ? "Alphabetical"
                    : "Recently Used"}
                </span>
                <ChevronDown size={14} className={`vSortChevron ${sortDropdownOpen ? "open" : ""}`} />
              </button>

              {sortDropdownOpen && (
                <div className="vSortMenu">
                  <button
                    className={`vSortMenuItem ${sortBy === "popular" ? "active" : ""}`}
                    onClick={() => {
                      setSortBy("popular");
                      setSortDropdownOpen(false);
                    }}
                  >
                    Popular
                  </button>
                  <button
                    className={`vSortMenuItem ${sortBy === "alpha" ? "active" : ""}`}
                    onClick={() => {
                      setSortBy("alpha");
                      setSortDropdownOpen(false);
                    }}
                  >
                    Alphabetical
                  </button>
                  <button
                    className={`vSortMenuItem ${sortBy === "recent" ? "active" : ""}`}
                    onClick={() => {
                      setSortBy("recent");
                      setSortDropdownOpen(false);
                    }}
                  >
                    Recently Used
                  </button>
                </div>
              )}
            </div>

            {/* View Mode Toggle (Grid / List) */}
            <div className="vViewToggleGroup" role="group" aria-label="View layout">
              <button
                className={`vViewToggleBtn ${viewMode === "grid" ? "active" : ""}`}
                onClick={() => setViewMode("grid")}
                title="Grid view"
                aria-label="Grid view"
              >
                <LayoutGrid size={15} />
              </button>
              <button
                className={`vViewToggleBtn ${viewMode === "list" ? "active" : ""}`}
                onClick={() => setViewMode("list")}
                title="List view"
                aria-label="List view"
              >
                <List size={15} />
              </button>
            </div>
          </div>
        </div>

        {/* ========================================================
            6. APP CARDS (GRID VIEW & LIST VIEW)
            ======================================================== */}
        {visibleApps.length > 0 ? (
          viewMode === "grid" ? (
            <div className="vAppGrid">
              {visibleApps.map((app) => {
                const isStarred = favorites.includes(app.id);
                const tags = app.tags || (app.category ? [app.category.toUpperCase()] : ["TOOL"]);

                return (
                  <div
                    key={app.id}
                    className="vAppCard"
                    role="button"
                    tabIndex={0}
                    onClick={() => handleLaunchApp(app)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" || e.key === " ") {
                        e.preventDefault();
                        handleLaunchApp(app);
                      }
                    }}
                    title={`Launch ${app.name}`}
                  >
                    {/* Top Row: Icon squircle + App Name + Favorite Star */}
                    <div className="vAppCardHeader">
                      <div className="vAppCardHeaderLeft">
                        <div
                          className="vAppCardIconSquircle"
                          style={{
                            background: app.iconBg || "linear-gradient(135deg, #7c3aed 0%, #6366f1 100%)",
                          }}
                        >
                          <RenderAppIcon iconType={app.icon} size={22} />
                        </div>
                        <h3 className="vAppCardName">{app.name}</h3>
                      </div>

                      <button
                        className={`vAppCardFavoriteBtn ${isStarred ? "starred" : ""}`}
                        onClick={(e) => handleToggleFavorite(app.id, e)}
                        title={isStarred ? "Remove from Favorites" : "Add to Favorites"}
                        aria-label="Toggle favorite"
                      >
                        <Star
                          size={16}
                          fill={isStarred ? "#a855f7" : "none"}
                          color={isStarred ? "#c084fc" : "#64748b"}
                        />
                      </button>
                    </div>

                    {/* Description Body */}
                    <p className="vAppCardDesc">{app.desc}</p>

                    {/* Footer Row: Tags + Circular Launch Arrow */}
                    <div className="vAppCardFooter">
                      <div className="vAppCardTags">
                        {tags.map((tag) => (
                          <span key={tag} className="vAppCardTag">
                            {tag}
                          </span>
                        ))}
                      </div>

                      <div className="vAppCardAction">
                        <div className="vAppLaunchCircle">
                          <ArrowRight size={15} />
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            /* LIST VIEW */
            <div className="vAppList">
              {visibleApps.map((app) => {
                const isStarred = favorites.includes(app.id);
                const tags = app.tags || (app.category ? [app.category.toUpperCase()] : ["TOOL"]);

                return (
                  <div
                    key={app.id}
                    className="vAppListRow"
                    role="button"
                    tabIndex={0}
                    onClick={() => handleLaunchApp(app)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" || e.key === " ") {
                        e.preventDefault();
                        handleLaunchApp(app);
                      }
                    }}
                    title={`Launch ${app.name}`}
                  >
                    <div className="vAppListLeft">
                      <div
                        className="vAppListIconSquircle"
                        style={{
                          background: app.iconBg || "linear-gradient(135deg, #7c3aed 0%, #6366f1 100%)",
                        }}
                      >
                        <RenderAppIcon iconType={app.icon} size={18} />
                      </div>
                      <div className="vAppListInfo">
                        <h3 className="vAppListName">{app.name}</h3>
                        <p className="vAppListDesc">{app.desc}</p>
                      </div>
                    </div>

                    <div className="vAppListRight">
                      <div className="vAppCardTags">
                        {tags.map((tag) => (
                          <span key={tag} className="vAppCardTag">
                            {tag}
                          </span>
                        ))}
                      </div>

                      <button
                        className={`vAppCardFavoriteBtn ${isStarred ? "starred" : ""}`}
                        onClick={(e) => handleToggleFavorite(app.id, e)}
                        title={isStarred ? "Remove from Favorites" : "Add to Favorites"}
                        aria-label="Toggle favorite"
                      >
                        <Star
                          size={16}
                          fill={isStarred ? "#a855f7" : "none"}
                          color={isStarred ? "#c084fc" : "#64748b"}
                        />
                      </button>

                      <div className="vAppLaunchCircle">
                        {app.type === "external" ? <ExternalLink size={14} /> : <ArrowRight size={14} />}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )
        ) : (
          /* ========================================================
              7. EMPTY STATES
              ======================================================== */
          <div className="vEmptyState">
            <div className="vEmptyIconBox">
              {activeCategory === "favorites" ? (
                <Star size={26} color="#a855f7" />
              ) : activeCategory === "recently_used" ? (
                <Clock size={26} color="#a855f7" />
              ) : (
                <Search size={26} color="#64748b" />
              )}
            </div>

            <h3 className="vEmptyTitle">
              {activeCategory === "favorites"
                ? "No favorite tools yet"
                : activeCategory === "recently_used"
                ? "No recent tools yet"
                : "No matching tools found"}
            </h3>

            <p className="vEmptyDesc">
              {activeCategory === "favorites"
                ? "Click the star icon on any tool card to add it to your favorites for quick access."
                : activeCategory === "recently_used"
                ? "Tools and apps you launch will appear here for fast re-access."
                : `We couldn't find any tools matching "${searchQuery}". Try searching with different keywords.`}
            </p>

            <button
              className="vEmptyResetBtn"
              onClick={() => {
                setSearchQuery("");
                setActiveCategory("all");
              }}
            >
              Browse All Tools
            </button>
          </div>
        )}
      </section>
    </div>
  );
};

export default AppsWorkspace;
