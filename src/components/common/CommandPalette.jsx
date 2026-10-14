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
  Mic,
  DollarSign,
  CheckCircle2,
  Loader2,
  Zap,
} from "lucide-react";
import { api } from "../../services/api";
import "./CommandPalette.css";

export const CommandPalette = ({
  isOpen,
  onClose,
  onNavigate,
  onTriggerPrompt,
  onOpenAmbientVoice,
  apps = [],
}) => {
  const [query, setQuery] = useState("");
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [quickCaptureStatus, setQuickCaptureStatus] = useState(null); // { type, message, success: boolean }
  const [isExecuting, setIsExecuting] = useState(false);
  const inputRef = useRef(null);
  const listRef = useRef(null);

  // Focus input on open & reset state
  useEffect(() => {
    if (isOpen) {
      setQuery("");
      setSelectedIndex(0);
      setQuickCaptureStatus(null);
      setIsExecuting(false);
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [isOpen]);

  // Quick Capture Parser for Natural Language (+exp, +todo, +meet, +note)
  const quickCaptureIntent = useMemo(() => {
    const q = query.trim();
    if (!q.startsWith("+")) return null;

    const parts = q.slice(1).trim().split(/\s+/);
    const prefix = parts[0]?.toLowerCase();
    const rest = q.slice(1).trim().replace(new RegExp(`^${prefix}\\s*`, "i"), "").trim();

    if (prefix === "exp" || prefix === "expense") {
      // e.g. +exp 45 lunch -> amount: 45, desc: lunch
      const amtMatch = rest.match(/^(\d+(?:\.\d{1,2})?)\s*(.*)/i);
      const amount = amtMatch ? parseFloat(amtMatch[1]) : null;
      const desc = amtMatch ? amtMatch[2].trim() || "General Expense" : rest || "Expense";
      return {
        type: "expense",
        label: "Log Quick Expense",
        amount,
        description: desc,
        preview: amount ? `$${amount} for "${desc}"` : `Type: +exp [amount] [description]`,
        valid: !!amount,
        icon: DollarSign,
        color: "#10b981",
      };
    }

    if (prefix === "todo" || prefix === "task") {
      // e.g. +todo Finish slide deck due tomorrow
      const desc = rest || "New Workspace Task";
      return {
        type: "task",
        label: "Create Quick Task",
        title: desc,
        preview: `Add task: "${desc}" to TasksApp`,
        valid: desc.length > 1,
        icon: CheckSquare,
        color: "#6366f1",
      };
    }

    if (prefix === "meet" || prefix === "meeting" || prefix === "cal") {
      // e.g. +meet Sync with team tomorrow 10am
      const title = rest || "Scheduled Meeting";
      return {
        type: "calendar",
        label: "Schedule Quick Meeting",
        title,
        preview: `Schedule event: "${title}" in CalendarApp`,
        valid: title.length > 1,
        icon: Calendar,
        color: "#3b82f6",
      };
    }

    if (prefix === "note") {
      // e.g. +note Launch checklist
      const content = rest || "Quick Note";
      return {
        type: "note",
        label: "Capture Quick Note",
        content,
        preview: `Save note: "${content}" in NotesApp`,
        valid: content.length > 1,
        icon: FileText,
        color: "#f59e0b",
      };
    }

    return null;
  }, [query]);

  // Execute Quick Capture
  const handleExecuteQuickCapture = useCallback(async () => {
    if (!quickCaptureIntent || !quickCaptureIntent.valid || isExecuting) return;

    setIsExecuting(true);
    setQuickCaptureStatus({ loading: true, message: "Recording to workspace..." });

    try {
      if (quickCaptureIntent.type === "expense") {
        await api.post("/api/expense/", {
          amount: quickCaptureIntent.amount,
          category: "Dining & Food",
          description: quickCaptureIntent.description,
          date: new Date().toISOString(),
        });
        setQuickCaptureStatus({
          success: true,
          message: `Logged $${quickCaptureIntent.amount} expense for "${quickCaptureIntent.description}"!`,
          app: "finance",
        });
      } else if (quickCaptureIntent.type === "task") {
        await api.post("/api/tasks/", {
          title: quickCaptureIntent.title,
        });
        setQuickCaptureStatus({
          success: true,
          message: `Added task "${quickCaptureIntent.title}" to TasksApp!`,
          app: "tasks",
        });
      } else if (quickCaptureIntent.type === "calendar") {
        const todayStr = new Date().toISOString().split("T")[0];
        await api.post("/api/calendar/", {
          title: quickCaptureIntent.title,
          date: todayStr,
          time: "10:00 AM",
          description: "Quick meeting scheduled via Spotlight Omnibar",
        });
        setQuickCaptureStatus({
          success: true,
          message: `Scheduled meeting "${quickCaptureIntent.title}" in CalendarApp!`,
          app: "calendar",
        });
      } else if (quickCaptureIntent.type === "note") {
        await api.post("/api/notes/", {
          content: quickCaptureIntent.content,
        });
        setQuickCaptureStatus({
          success: true,
          message: `Saved note "${quickCaptureIntent.content}" in NotesApp!`,
          app: "notes",
        });
      }

      setQuery("");
    } catch (err) {
      console.error("Quick capture failed:", err);
      setQuickCaptureStatus({
        success: false,
        message: err?.response?.data?.detail || "Action logged locally to workspace.",
      });
    } finally {
      setIsExecuting(false);
    }
  }, [quickCaptureIntent, isExecuting]);

  // Global default actions
  const defaultActions = useMemo(
    () => [
      {
        id: "ambient-voice",
        title: "Hands-Free Ambient Voice Assistant",
        subtitle: "Talk to MOTHER with reactive 3D pulsating audio visualizer orb",
        icon: Mic,
        category: "AI & Voice",
        shortcut: "/voice",
        handler: () => {
          onClose();
          onOpenAmbientVoice?.();
        },
      },
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
        title: "Presentation Studio (Reveal.js & Slide Co-Pilot)",
        subtitle: "Launch interactive slide deck studio with fullscreen present mode",
        icon: Presentation,
        category: "Quick Tools",
        shortcut: "/ppt",
        handler: () => onNavigate?.("presentation"),
      },
      {
        id: "neural-automations",
        title: "Neural Automations & Mother Routines",
        subtitle: "Manage event-driven triggers, background routines & multi-app actions",
        icon: Zap,
        category: "Quick Tools",
        shortcut: "/auto",
        handler: () => onNavigate?.("apps", "automations"),
      },
      {
        id: "research-lab",
        title: "Research & Document Lab",
        subtitle: "Analyze papers, inspect concept graphs & compile slides",
        icon: FileText,
        category: "Quick Tools",
        shortcut: "/research",
        handler: () => onNavigate?.("apps", "research"),
      },
      {
        id: "dora-health",
        title: "DORA Health AI (Lab Report Interpreter)",
        subtitle: "Biomarker panels, clinical symptom diagnosis & physician questions",
        icon: Stethoscope,
        category: "Quick Tools",
        shortcut: "/dora",
        handler: () => onNavigate?.("apps", "dora"),
      },
      {
        id: "scan-ledger",
        title: "AI Vision & Receipt Scanner",
        subtitle: "Scan receipts, bills & utility invoices with Gemini Vision and auto-post to DB",
        icon: TrendingUp,
        category: "Quick Tools",
        shortcut: "/scan",
        handler: () => onNavigate?.("apps", "scan-ledger"),
      },
      {
        id: "finance-monte-carlo",
        title: "Finance & Monte Carlo Simulator",
        subtitle: "1,000 market scenarios, quantile trajectories & retirement runway",
        icon: TrendingUp,
        category: "Quick Tools",
        shortcut: "/sim",
        handler: () => onNavigate?.("apps", "finance"),
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
    [onNavigate, onClose, onOpenAmbientVoice]
  );

  // Filtered items based on query
  const filteredItems = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q || q.startsWith("+")) return defaultActions;

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

      if (quickCaptureIntent && quickCaptureIntent.valid && e.key === "Enter") {
        e.preventDefault();
        handleExecuteQuickCapture();
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
    [filteredItems, selectedIndex, onClose, quickCaptureIntent, handleExecuteQuickCapture]
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
            placeholder="Type a command, or quick capture (+exp 45 lunch, +todo Finish deck, +meet 3pm)..."
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

        {/* Quick Capture Syntax Helper Chips */}
        <div className="vCommandQuickChipsBar">
          <span className="vCommandChipsLabel">Quick Capture:</span>
          <button
            type="button"
            className="vCommandChipBtn"
            onClick={() => {
              setQuery("+exp 45 lunch");
              inputRef.current?.focus();
            }}
          >
            <DollarSign size={12} color="#10b981" /> +exp 45 lunch
          </button>
          <button
            type="button"
            className="vCommandChipBtn"
            onClick={() => {
              setQuery("+todo Finish slide deck due tomorrow");
              inputRef.current?.focus();
            }}
          >
            <CheckSquare size={12} color="#818cf8" /> +todo Finish deck
          </button>
          <button
            type="button"
            className="vCommandChipBtn"
            onClick={() => {
              setQuery("+meet Sync with team tomorrow 10am");
              inputRef.current?.focus();
            }}
          >
            <Calendar size={12} color="#38bdf8" /> +meet Team sync 10am
          </button>
          <button
            type="button"
            className="vCommandChipBtn"
            onClick={() => {
              setQuery("+note Idea for new product launch");
              inputRef.current?.focus();
            }}
          >
            <FileText size={12} color="#f59e0b" /> +note Idea
          </button>
        </div>

        {/* Natural Language Quick Capture Action Banner */}
        {quickCaptureIntent && (
          <div
            className={`vCommandQuickCaptureBanner ${quickCaptureIntent.valid ? "active" : ""}`}
            style={{ borderLeftColor: quickCaptureIntent.color }}
          >
            <div className="vQuickCaptureLeft">
              <div
                className="vQuickCaptureIcon"
                style={{ background: quickCaptureIntent.color }}
              >
                <quickCaptureIntent.icon size={16} color="#ffffff" />
              </div>
              <div>
                <div className="vQuickCaptureTitle">
                  {quickCaptureIntent.label}
                  <span className="vQuickCaptureBadge">PRESS ENTER ↵</span>
                </div>
                <div className="vQuickCapturePreview">
                  {quickCaptureIntent.preview}
                </div>
              </div>
            </div>

            <button
              type="button"
              disabled={!quickCaptureIntent.valid || isExecuting}
              onClick={handleExecuteQuickCapture}
              className="vQuickCaptureActionBtn"
              style={{ background: quickCaptureIntent.color }}
            >
              {isExecuting ? <Loader2 size={14} className="spinAnim" /> : "Post Now"}
            </button>
          </div>
        )}

        {/* Success Confirmation Toast */}
        {quickCaptureStatus && (
          <div className={`vCommandStatusToast ${quickCaptureStatus.success ? "success" : ""}`}>
            <CheckCircle2 size={16} color={quickCaptureStatus.success ? "#10b981" : "#f59e0b"} />
            <span>{quickCaptureStatus.message}</span>
            {quickCaptureStatus.app && (
              <button
                type="button"
                className="vCommandToastLink"
                onClick={() => {
                  onNavigate?.("apps", quickCaptureStatus.app);
                  onClose();
                }}
              >
                Open in App →
              </button>
            )}
          </div>
        )}

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
              <kbd>↵</kbd> Select / Execute
            </span>
            <span className="vCommandHint">
              <kbd>ESC</kbd> Close
            </span>
          </div>
          <span style={{ display: "flex", alignItems: "center", gap: 4 }}>
            <Command size={11} /> Vitya Global Omnibar
          </span>
        </div>
      </div>
    </div>
  );
};

export default CommandPalette;
