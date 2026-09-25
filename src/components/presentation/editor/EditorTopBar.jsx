import React, { useState } from "react";
import { 
  Save, 
  Play, 
  Eye, 
  Download, 
  MoreHorizontal, 
  Check, 
  Edit2, 
  Sparkles, 
  HelpCircle,
  Clock,
  CheckSquare
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
  onPreview,
  onNewDeck,
  onAiRefine,
  onSelectAiAction,
  onOpenDesignCheck,
  showLeftSidebar = true,
  showRightSidebar = true,
  onToggleLeftSidebar,
  onToggleRightSidebar
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
      {/* LEFT SECTION: Title + Save Status + Panel Toggles */}
      <div className="top-bar-left">
        <div className="panel-toggles-group" style={{ display: "flex", gap: 3, background: "rgba(0,0,0,0.3)", padding: "3px 4px", borderRadius: 8, border: "1px solid rgba(255,255,255,0.1)", marginLeft: 6 }}>
          <button
            className={`top-icon-btn ${showLeftSidebar ? "active" : ""}`}
            onClick={onToggleLeftSidebar}
            title={showLeftSidebar ? "Collapse Left Slide List" : "Expand Left Slide List"}
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
        <div className="top-btn-group" style={{ display: "flex", alignItems: "center", gap: 6, background: "rgba(255, 255, 255, 0.03)", padding: "3px 6px", borderRadius: 10, border: "1px solid rgba(255, 255, 255, 0.08)" }}>
          <div style={{ position: "relative" }}>
            <button 
              className="top-btn secondary-btn ai-command-btn"
              onClick={() => setIsAiMenuOpen(!isAiMenuOpen)}
              title="Open AI Command Menu"
              style={{ background: "rgba(192, 132, 252, 0.15)", border: "1px solid rgba(192, 132, 252, 0.4)", color: "#c084fc", padding: "5px 10px" }}
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
            style={{ padding: "5px 10px" }}
          >
            <CheckSquare size={14} style={{ color: "#34d399" }} />
            <span>Design</span>
          </button>
        </div>

        <div style={{ width: 1, height: 20, background: "rgba(255,255,255,0.12)", margin: "0 2px" }} />

        {/* GROUP 2: PRESENTATION & PLAY */}
        <div className="top-btn-group" style={{ display: "flex", alignItems: "center", gap: 6, background: "rgba(255, 255, 255, 0.03)", padding: "3px 6px", borderRadius: 10, border: "1px solid rgba(255, 255, 255, 0.08)" }}>
          <button 
            className="top-btn secondary-btn"
            onClick={onPreview}
            title="Quick preview slideshow"
            style={{ padding: "5px 10px" }}
          >
            <Eye size={14} />
            <span></span>
          </button>

          <button 
            className="top-btn primary-btn present-btn"
            onClick={onPresent}
            title="Start fullscreen presentation slideshow (F5)"
            style={{ padding: "5px 14px" }}
          >
            <Play size={14} fill="currentColor" />
            <span></span>
          </button>
        </div>

        <div style={{ width: 1, height: 20, background: "rgba(255,255,255,0.12)", margin: "0 2px" }} />

        {/* GROUP 3: SAVE & EXPORT */}
        <div className="top-btn-group" style={{ display: "flex", alignItems: "center", gap: 6 }}>
          <button 
            className="top-btn secondary-btn"
            onClick={onSave}
            disabled={isSaving}
            title="Save presentation state"
            style={{ padding: "5px 10px" }}
          >
            <Save size={14} />
            <span></span>
          </button>

          <button 
            className="top-btn accent-btn"
            onClick={onDownload}
            title="Export PPTX Presentation File"
            style={{ padding: "5px 14px" }}
          >
            <Download size={14} />
            <span></span>
          </button>

          {/* MORE MENU DROPDOWN */}
          <div className="more-menu-wrapper">
            <button 
              className="top-icon-btn"
              onClick={() => setShowMoreMenu(!showMoreMenu)}
              title="More deck options"
              style={{ padding: "6px" }}
            >
              <MoreHorizontal size={17} />
            </button>

            {showMoreMenu && (
              <div className="more-dropdown">
                <button onClick={() => { setShowMoreMenu(false); onNewDeck?.(); }}>
                  <Sparkles size={14} />
                  <span>New Presentation</span>
                </button>
                <button onClick={() => { setShowMoreMenu(false); onSave?.(); }}>
                  <Save size={14} />
                  <span>Save Copy</span>
                </button>
                <div className="dropdown-divider" />
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
           {/* PANEL TOGGLE BUTTONS (LEFT & RIGHT SIDEBAR HIDE/SHOW) */}
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
      </div>
    </header>
  );
}

