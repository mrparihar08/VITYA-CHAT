import React, { useState, useEffect, useRef, useMemo, useCallback } from "react";
import {
  Search,
  MessageSquare,
  Sparkles,
  Presentation,
  Stethoscope,
  TrendingUp,
  FileText,
  Calendar,
  Folder,
  CheckSquare,
  Settings,
  User,
  ArrowRight,
  Command,
} from "lucide-react";
import "./CommandPalette.css";

export const CommandPalette = ({
  isOpen,
  onClose,
  onNavigate,
  onTriggerPrompt,
  apps = [],
}) => {
  const [query, setQuery] = useState("");
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef(null);
  const listRef = useRef(null);

  // Focus input on open
  useEffect(() => {
    if (isOpen) {
      setQuery("");
      setSelectedIndex(0);
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [isOpen]);

  // Global actions
  const defaultActions = useMemo(
    () => [
      {
        id: "new-chat",
        title: "New Chat",
        subtitle: "Start a fresh conversation with Vitya",
        icon: MessageSquare,
        category: "Navigation",
        shortcut: "N",
        handler: () => onNavigate?.("chat", null, null),
      },
      {
        id: "create-ppt",
        title: "Create Presentation Deck",
        subtitle: "Launch AI Presentation Studio",
        icon: Presentation,
        category: "Quick Tools",
        shortcut: "/ppt",
        handler: () => onNavigate?.("presentation"),
      },
      {
        id: "dora-health",
        title: "DORA Health AI",
        subtitle: "Clinical symptom diagnosis & AI medical advisor",
        icon: Stethoscope,
        category: "Quick Tools",
        shortcut: "/dora",
        handler: () => onNavigate?.("apps", "dora"),
      },
      {
        id: "finance-tracker",
        title: "Finance & Expense Tracker",
        subtitle: "View balance, income, expenses & cashflow",
        icon: TrendingUp,
        category: "Quick Tools",
        shortcut: "/finance",
        handler: () => onNavigate?.("apps", "finance"),
      },
      {
        id: "generate-image",
        title: "Generate AI Image",
        subtitle: "Create high-resolution visual art",
        icon: Sparkles,
        category: "Quick Tools",
        shortcut: "/image",
        handler: () => {
          onNavigate?.("chat");
          onTriggerPrompt?.("/image ");
        },
      },
      {
        id: "notes-app",
        title: "Notes & Ideas",
        subtitle: "Open quick scratchpad & formatted docs",
        icon: FileText,
        category: "Apps",
        handler: () => onNavigate?.("apps", "notes"),
      },
      {
        id: "calendar-app",
        title: "Calendar & Events",
        subtitle: "Manage schedule and meetings",
        icon: Calendar,
        category: "Apps",
        handler: () => onNavigate?.("apps", "calendar"),
      },
      {
        id: "tasks-app",
        title: "Tasks & To-Do",
        subtitle: "Organize daily action items",
        icon: CheckSquare,
        category: "Apps",
        handler: () => onNavigate?.("apps", "tasks"),
      },
      {
        id: "settings-page",
        title: "Settings & Preferences",
        subtitle: "Customize themes, notifications & account",
        icon: Settings,
        category: "Preferences",
        handler: () => onNavigate?.("settings"),
      },
      {
        id: "profile-page",
        title: "User Profile",
        subtitle: "View and edit your personal profile",
        icon: User,
        category: "Preferences",
        handler: () => onNavigate?.("profile"),
      },
    ],
    [onNavigate, onTriggerPrompt]
  );

  // Filtered items based on query
  const filteredItems = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return defaultActions;

    // Combine default actions with apps list
    const dynamicAppActions = apps.map((app) => ({
      id: `app-${app.id}`,
      title: app.name,
      subtitle: app.desc,
      icon: Folder,
      category: "Apps",
      handler: () => {
        if (app.type === "external") {
          window.open(app.url, "_blank", "noopener,noreferrer");
        } else {
          onNavigate?.("apps", app.id);
        }
      },
    }));

    const all = [...defaultActions, ...dynamicAppActions];

    return all.filter(
      (item) =>
        item.title.toLowerCase().includes(q) ||
        (item.subtitle && item.subtitle.toLowerCase().includes(q)) ||
        (item.shortcut && item.shortcut.toLowerCase().includes(q))
    );
  }, [query, defaultActions, apps, onNavigate]);

  // Keyboard navigation inside modal
  const handleKeyDown = useCallback(
    (e) => {
      if (e.key === "Escape") {
        e.preventDefault();
        onClose();
        return;
      }

      if (e.key === "ArrowDown") {
        e.preventDefault();
        setSelectedIndex((prev) => (prev + 1) % (filteredItems.length || 1));
      } else if (e.key === "ArrowUp") {
        e.preventDefault();
        setSelectedIndex((prev) => (prev - 1 + filteredItems.length) % (filteredItems.length || 1));
      } else if (e.key === "Enter") {
        e.preventDefault();
        const selected = filteredItems[selectedIndex];
        if (selected) {
          selected.handler();
          onClose();
        }
      }
    },
    [filteredItems, selectedIndex, onClose]
  );

  if (!isOpen) return null;

  return (
    <div className="vityaCommandPaletteOverlay" onClick={onClose}>
      <div
        className="vityaCommandPaletteModal"
        onClick={(e) => e.stopPropagation()}
        onKeyDown={handleKeyDown}
      >
        {/* Search Input Bar */}
        <div className="vCommandInputWrap">
          <span className="vCommandSearchIcon">
            <Search size={18} />
          </span>
          <input
            ref={inputRef}
            type="text"
            className="vCommandInput"
            placeholder="Type a command, tool, or search apps..."
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setSelectedIndex(0);
            }}
          />
          <button className="vCommandEscBadge" onClick={onClose}>
            ESC
          </button>
        </div>

        {/* Results List */}
        <div className="vCommandResultsList" ref={listRef}>
          {filteredItems.length > 0 ? (
            filteredItems.map((item, index) => {
              const Icon = item.icon || Sparkles;
              const isSelected = index === selectedIndex;

              return (
                <button
                  key={item.id || index}
                  className={`vCommandItem ${isSelected ? "selected" : ""}`}
                  onClick={() => {
                    item.handler();
                    onClose();
                  }}
                  onMouseEnter={() => setSelectedIndex(index)}
                >
                  <div className="vCommandItemLeft">
                    <div className="vCommandItemIcon">
                      <Icon size={16} />
                    </div>
                    <div className="vCommandItemText">
                      <span className="vCommandItemTitle">{item.title}</span>
                      {item.subtitle && (
                        <span className="vCommandItemSubtitle">{item.subtitle}</span>
                      )}
                    </div>
                  </div>

                  <div className="vCommandItemRight">
                    {item.shortcut && (
                      <span className="vCommandShortcutTag">{item.shortcut}</span>
                    )}
                    <ArrowRight size={13} />
                  </div>
                </button>
              );
            })
          ) : (
            <div style={{ padding: "32px 16px", textAlign: "center", color: "#64748b", fontSize: "13px" }}>
              No commands or apps matching "{query}"
            </div>
          )}
        </div>

        {/* Footer Hints */}
        <div className="vCommandFooter">
          <div className="vCommandHintsRow">
            <span className="vCommandHint">
              <kbd>↑</kbd> <kbd>↓</kbd> Navigate
            </span>
            <span className="vCommandHint">
              <kbd>↵</kbd> Select
            </span>
            <span className="vCommandHint">
              <kbd>ESC</kbd> Close
            </span>
          </div>
          <span style={{ display: "flex", alignItems: "center", gap: 4 }}>
            <Command size={11} /> Vitya Spotlight
          </span>
        </div>
      </div>
    </div>
  );
};

export default CommandPalette;
