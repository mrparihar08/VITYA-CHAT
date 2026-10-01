import React, { useState } from "react";
import { 
  Save, 
  Play, 
  Download, 
  MoreHorizontal, 
  Check, 
  Edit2, 
  Sparkles, 
  HelpCircle, 
  Clock, 
  CheckSquare,
  ChevronLeft
} from "lucide-react";
import AICommandMenu from "./AICommandMenu";

export default function EditorTopBar({
  title = "Untitled Presentation",
  onTitleChange,
  isSaved = true,
  isSaving = false,
  onSave,
  onDownload,
  onPresent,
  onNewDeck,
  onAiRefine,
  onSelectAiAction,
  onOpenDesignCheck,
  showLeftSidebar = true,
  showRightSidebar = true,
  onToggleLeftSidebar,
  onToggleRightSidebar,
  onBackToSetup,
  onTriggerCacheCleanup,
  isCleaningCache = false
}) {
  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [tempTitle, setTempTitle] = useState(title);
  const [showMoreMenu, setShowMoreMenu] = useState(false);
  const [isAiMenuOpen, setIsAiMenuOpen] = useState(false);

  const handleTitleSubmit = () => {
    setIsEditingTitle(false);
    if (tempTitle.trim() && tempTitle !== title) {
      onTitleChange?.(tempTitle.trim());
    } else {
      setTempTitle(title);
    }
  };

  return (
    <header className="ppt-top-bar">
      {/* LEFT SECTION: Back to Setup + Title + Save Status + Panel Toggles */}
      <div className="top-bar-left">
        {onBackToSetup && (
          <button
            className="top-btn secondary-btn back-to-setup-btn"
            onClick={onBackToSetup}
            title="Return to Presentation Setup"
            style={{
              padding: "5px 9px",
              background: "rgba(255, 255, 255, 0.08)",
              border: "1px solid rgba(255, 255, 255, 0.14)",
              borderRadius: "8px",
              color: "#e2e8f0",
              fontSize: "12px",
              fontWeight: 600,
              display: "flex",
              alignItems: "center",
              gap: "4px"
            }}
          >
            <ChevronLeft size={14} />
            <span>Setup</span>
          </button>
        )}

        <div className="panel-toggles-group" style={{ display: "flex", gap: 3, background: "rgba(0,0,0,0.3)", padding: "3px 4px", borderRadius: 8, border: "1px solid rgba(255,255,255,0.1)", marginLeft: 2 }}>
          <button
            className={`top-icon-btn ${showLeftSidebar ? "active" : ""}`}
            onClick={onToggleLeftSidebar}
            title={showLeftSidebar ? "Hide Slide List" : "Show Slide List"}
            style={{ padding: "4px 7px", background: showLeftSidebar ? "rgba(139, 92, 246, 0.25)" : "transparent", borderColor: showLeftSidebar ? "#8b5cf6" : "transparent" }}
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="3" width="18" height="18" rx="2"/><path d="M9 3v18"/></svg>
          </button>
        </div>
    
        <div className="title-container">
          {isEditingTitle ? (
            <input
              type="text"
              className="title-input"
              value={tempTitle}
              onChange={(e) => setTempTitle(e.target.value)}
              onBlur={handleTitleSubmit}
              onKeyDown={(e) => {
                if (e.key === "Enter") handleTitleSubmit();
                if (e.key === "Escape") {
                  setTempTitle(title);
                  setIsEditingTitle(false);
                }
              }}
              autoFocus
            />
          ) : (
            <div 
              className="title-display"
              onClick={() => {
                setTempTitle(title);
                setIsEditingTitle(true);
              }}
              title="Click to rename presentation title"
            >
              <span className="title-text">{title}</span>
              <Edit2 size={13} className="title-edit-icon" />
            </div>
          )}
        </div>

        <div className={`save-status-pill ${isSaving ? "saving" : isSaved ? "saved" : "unsaved"}`}>
          {isSaving ? (
            <>
              <Clock size={12} className="spin-icon" />
              <span>Saving...</span>
            </>
          ) : isSaved ? (
            <>
              <Check size={12} />
              <span>Saved ✓</span>
            </>
          ) : (
            <>
              <span className="unsaved-dot">•</span>
              <span>Draft</span>
            </>
          )}
        </div>
      </div>

      {/* RIGHT SECTION: Clean Grouped Toolbar Actions */}
      <div className="top-bar-right">
        {/* GROUP 1: AI ASSISTANT TOOLS */}
        <div className="top-btn-group" style={{ display: "flex", alignItems: "center", gap: 6 }}>
          <div style={{ position: "relative" }}>
            <button 
              className="top-btn secondary-btn ai-command-btn"
              onClick={() => setIsAiMenuOpen(!isAiMenuOpen)}
              title="Open AI Command Menu"
              style={{ background: "rgba(192, 132, 252, 0.15)", border: "1px solid rgba(192, 132, 252, 0.4)", color: "#c084fc", padding: "6px 12px" }}
            >
              <Sparkles size={14} />
              <span>AI</span>
            </button>

            <AICommandMenu
              isOpen={isAiMenuOpen}
              onClose={() => setIsAiMenuOpen(false)}
              onSelectAction={(actionId) => {
                onSelectAiAction?.(actionId);
                onAiRefine?.();
              }}
            />
          </div>

          <button
            className="top-btn secondary-btn"
            onClick={onOpenDesignCheck}
            title="Run AI Slide Quality Audit & Design Check"
            style={{ padding: "6px 12px" }}
          >
            <CheckSquare size={14} style={{ color: "#34d399" }} />
            <span>Design</span>
          </button>
        </div>

        <div style={{ width: 1, height: 20, background: "rgba(255,255,255,0.12)", margin: "0 2px" }} />

        {/* GROUP 2: PRESENTATION & PLAY */}
        <button 
          className="top-btn primary-btn present-btn"
          onClick={onPresent}
          title="Start fullscreen presentation slideshow (F5)"
          style={{ padding: "6px 12px" }}
        >
          <Play size={14} fill="currentColor" />
        </button>

        <div style={{ width: 1, height: 20, background: "rgba(255,255,255,0.12)", margin: "0 2px" }} />

        {/* GROUP 3: MORE MENU (CONTAINS SAVE, EXPORT, NEW DECK, SHORTCUTS) */}
        <div className="top-btn-group" style={{ display: "flex", alignItems: "center", gap: 6 }}>
          <div className="more-menu-wrapper">
            <button 
              className="top-icon-btn"
              onClick={() => setShowMoreMenu(!showMoreMenu)}
              title="Presentation actions & options"
              style={{ padding: "6px 8px", background: showMoreMenu ? "rgba(255,255,255,0.12)" : "transparent" }}
            >
              <MoreHorizontal size={17} />
            </button>

            {showMoreMenu && (
              <div className="more-dropdown">
                <button onClick={() => { setShowMoreMenu(false); onSave?.(); }} disabled={isSaving}>
                  <Save size={14} style={{ color: "#38bdf8" }} />
                  <span>{isSaving ? "Saving..." : "Save Deck"}</span>
                </button>

                <button onClick={() => { setShowMoreMenu(false); onDownload?.(); }}>
                  <Download size={14} style={{ color: "#c084fc" }} />
                  <span>Download / Export PPTX</span>
                </button>

                <div className="dropdown-divider" />

                <button onClick={() => { setShowMoreMenu(false); onNewDeck?.(); }}>
                  <Sparkles size={14} style={{ color: "#facc15" }} />
                  <span>New Presentation</span>
                </button>

                {onTriggerCacheCleanup && (
                  <button onClick={() => { setShowMoreMenu(false); onTriggerCacheCleanup?.(); }} disabled={isCleaningCache}>
                    <span style={{ fontSize: 13 }}>🧹</span>
                    <span>{isCleaningCache ? "Cleaning Cache..." : "Clean Server Cache"}</span>
                  </button>
                )}

                <button onClick={() => {
                  setShowMoreMenu(false);
                  alert("Keyboard Shortcuts:\n• Arrow Keys / Space / Enter: Next Slide\n• Delete / Backspace: Delete Element\n• Ctrl + D: Duplicate Element\n• Ctrl + Z: Undo\n• Ctrl + Y: Redo\n• Esc: Deselect");
                }}>
                  <HelpCircle size={14} />
                  <span>Keyboard Shortcuts</span>
                </button>
              </div>
            )}
          </div>
        </div>

        {/* PANEL TOGGLE BUTTONS (RIGHT SIDEBAR HIDE/SHOW) */}
        <div className="panel-toggles-group" style={{ display: "flex", gap: 3, background: "rgba(0,0,0,0.3)", padding: "3px 4px", borderRadius: 8, border: "1px solid rgba(255,255,255,0.1)", marginLeft: 6 }}>
          <button
            className={`top-icon-btn ${showRightSidebar ? "active" : ""}`}
            onClick={onToggleRightSidebar}
            title={showRightSidebar ? "Collapse Right Properties Panel" : "Expand Right Properties Panel"}
            style={{ padding: "4px 7px", background: showRightSidebar ? "rgba(139, 92, 246, 0.25)" : "transparent", borderColor: showRightSidebar ? "#8b5cf6" : "transparent" }}
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="3" width="18" height="18" rx="2"/><path d="M15 3v18"/></svg>
          </button>
        </div>
      </div>
    </header>
  );
}

