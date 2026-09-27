import React from "react";
import { LAYOUT_OPTIONS, AI_ACTIONS } from "./editorState";
import { Plus, Sparkles, X } from "lucide-react";

function LayoutWireframe({ id }) {
  switch (id) {
    case "title_slide":
      return (
        <div className="mini-wireframe-canvas">
          <div className="wf-box title-wf" style={{ top: "22%", left: "15%", width: "70%", height: "24%" }} />
          <div className="wf-box sub-wf" style={{ top: "54%", left: "20%", width: "60%", height: "16%" }} />
        </div>
      );
    case "title_content":
      return (
        <div className="mini-wireframe-canvas">
          <div className="wf-box title-wf" style={{ top: "12%", left: "8%", width: "84%", height: "18%" }} />
          <div className="wf-box body-wf" style={{ top: "36%", left: "8%", width: "84%", height: "52%" }}>
            <div className="wf-icon-grid">
              <span>📊</span><span>📋</span><span>🖼️</span><span>💡</span>
            </div>
          </div>
        </div>
      );
    case "two_column":
      return (
        <div className="mini-wireframe-canvas">
          <div className="wf-box title-wf" style={{ top: "12%", left: "8%", width: "84%", height: "18%" }} />
          <div className="wf-box col-wf" style={{ top: "36%", left: "8%", width: "40%", height: "52%" }}>
            <div className="wf-icon-grid"><span>📊</span><span>📋</span></div>
          </div>
          <div className="wf-box col-wf" style={{ top: "36%", left: "52%", width: "40%", height: "52%" }}>
            <div className="wf-icon-grid"><span>🖼️</span><span>💡</span></div>
          </div>
        </div>
      );
    case "image":
      return (
        <div className="mini-wireframe-canvas">
          <div className="wf-box title-wf" style={{ top: "12%", left: "8%", width: "84%", height: "18%" }} />
          <div className="wf-box img-wf" style={{ top: "36%", left: "8%", width: "84%", height: "52%", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <span style={{ fontSize: 16, opacity: 0.8 }}>🖼️</span>
          </div>
        </div>
      );
    case "chart":
      return (
        <div className="mini-wireframe-canvas">
          <div className="wf-box title-wf" style={{ top: "12%", left: "8%", width: "84%", height: "18%" }} />
          <div className="wf-box chart-wf" style={{ top: "36%", left: "8%", width: "84%", height: "52%", display: "flex", alignItems: "flex-end", justifyContent: "center", gap: 3, paddingBottom: 3 }}>
            <div style={{ width: "16%", height: "45%", background: "#38bdf8", borderRadius: 2 }} />
            <div style={{ width: "16%", height: "75%", background: "#8b5cf6", borderRadius: 2 }} />
            <div style={{ width: "16%", height: "95%", background: "#34d399", borderRadius: 2 }} />
            <div style={{ width: "16%", height: "60%", background: "#f59e0b", borderRadius: 2 }} />
          </div>
        </div>
      );
    case "table":
      return (
        <div className="mini-wireframe-canvas">
          <div className="wf-box title-wf" style={{ top: "12%", left: "8%", width: "84%", height: "18%" }} />
          <div className="wf-box table-wf" style={{ top: "36%", left: "8%", width: "84%", height: "52%", display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 2, padding: 3 }}>
            <div style={{ background: "rgba(139, 92, 246, 0.5)", borderRadius: 1 }} />
            <div style={{ background: "rgba(139, 92, 246, 0.5)", borderRadius: 1 }} />
            <div style={{ background: "rgba(139, 92, 246, 0.5)", borderRadius: 1 }} />
            <div style={{ background: "rgba(255,255,255,0.12)", borderRadius: 1 }} />
            <div style={{ background: "rgba(255,255,255,0.12)", borderRadius: 1 }} />
            <div style={{ background: "rgba(255,255,255,0.12)", borderRadius: 1 }} />
          </div>
        </div>
      );
    case "section":
      return (
        <div className="mini-wireframe-canvas">
          <div className="wf-box section-wf" style={{ top: "32%", left: "12%", width: "76%", height: "36%", display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center" }}>
            <div style={{ width: "70%", height: 3, background: "#c084fc", borderRadius: 1 }} />
          </div>
        </div>
      );
    case "blank":
    default:
      return (
        <div className="mini-wireframe-canvas blank-wf" />
      );
  }
}

export default function SlideLayoutPicker({ isOpen, onClose, onSelectLayout, onAiAction }) {
  if (!isOpen) return null;

  return (
    <div className="layout-picker-overlay" onClick={onClose}>
      <div className="layout-picker-modal" onClick={(e) => e.stopPropagation()}>
        <div className="picker-header">
          <div className="picker-title">
            <Plus size={18} />
            <span>Add New Slide Layout</span>
          </div>
          <button className="close-btn" onClick={onClose}>
            <X size={16} />
          </button>
        </div>

        {/* AI QUICK GENERATE ACTIONS */}
        <div className="picker-section" style={{ marginBottom: 18 }}>
          <div className="picker-section-label">
            <Sparkles size={13} className="ai-sparkle-icon" />
            <span>AI ASSISTED CREATION</span>
          </div>
          <div className="ai-actions-grid">
            {AI_ACTIONS.map((action) => (
              <button
                key={action.id}
                className="ai-action-card"
                onClick={() => {
                  onAiAction?.(action.id);
                  onClose();
                }}
              >
                <span className="action-icon" style={{ fontSize: 20 }}>{action.icon}</span>
                <div className="action-info" style={{ display: "flex", flexDirection: "column", gap: 2 }}>
                  <span className="action-name" style={{ fontSize: 13, fontWeight: 700, color: "#ffffff" }}>{action.name}</span>
                  <span className="action-desc" style={{ fontSize: 11, color: "#cbd5e1" }}>{action.desc}</span>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* PREDEFINED SLIDE LAYOUTS WITH VISUAL WIREFRAMES */}
        <div className="picker-section">
          <div className="picker-section-label">
            <span>STANDARD SLIDE LAYOUTS</span>
          </div>
          <div className="layouts-grid">
            {LAYOUT_OPTIONS.map((layout) => (
              <button
                key={layout.id}
                className="layout-card"
                onClick={() => {
                  onSelectLayout?.(layout.id);
                  onClose();
                }}
              >
                <LayoutWireframe id={layout.id} />
                <span className="layout-name">{layout.name}</span>
                <span className="layout-desc">{layout.desc}</span>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
