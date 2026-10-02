import React from "react";
import { LAYOUT_OPTIONS, AI_ACTIONS } from "./editorState";
import { Plus, Sparkles, X } from "lucide-react";

function LayoutWireframe({ id }) {
  switch (id) {
    case "title_slide":
    case "cover":
      return (
        <div className="mini-wireframe-canvas">
          <div className="wf-box title-wf" style={{ top: "20%", left: "15%", width: "70%", height: "24%" }} />
          <div className="wf-box sub-wf" style={{ top: "52%", left: "20%", width: "60%", height: "16%" }} />
          <div style={{ position: "absolute", bottom: "8%", left: "10%", width: "80%", height: "4%", background: "#0d9488", borderRadius: 1 }} />
        </div>
      );
    case "title_content":
      return (
        <div className="mini-wireframe-canvas">
          <div className="wf-box title-wf" style={{ top: "10%", left: "8%", width: "84%", height: "16%" }} />
          <div className="wf-box body-wf" style={{ top: "32%", left: "8%", width: "84%", height: "56%" }}>
            <div className="wf-icon-grid">
              <span>📊</span><span>📋</span><span>🖼️</span><span>💡</span>
            </div>
          </div>
        </div>
      );
    case "two_column":
      return (
        <div className="mini-wireframe-canvas">
          <div className="wf-box title-wf" style={{ top: "10%", left: "8%", width: "84%", height: "16%" }} />
          <div className="wf-box col-wf" style={{ top: "32%", left: "8%", width: "40%", height: "56%" }}>
            <div className="wf-icon-grid"><span>📊</span><span>📋</span></div>
          </div>
          <div className="wf-box col-wf" style={{ top: "32%", left: "52%", width: "40%", height: "56%" }}>
            <div className="wf-icon-grid"><span>🖼️</span><span>💡</span></div>
          </div>
        </div>
      );
    case "three_column":
      return (
        <div className="mini-wireframe-canvas">
          <div className="wf-box title-wf" style={{ top: "10%", left: "6%", width: "88%", height: "16%" }} />
          <div style={{ position: "absolute", top: "32%", left: "6%", width: "26%", height: "56%", background: "rgba(255,255,255,0.08)", border: "1px solid rgba(255,255,255,0.15)", borderRadius: 3 }} />
          <div style={{ position: "absolute", top: "32%", left: "37%", width: "26%", height: "56%", background: "rgba(255,255,255,0.08)", border: "1px solid rgba(255,255,255,0.15)", borderRadius: 3 }} />
          <div style={{ position: "absolute", top: "32%", left: "68%", width: "26%", height: "56%", background: "rgba(255,255,255,0.08)", border: "1px solid rgba(255,255,255,0.15)", borderRadius: 3 }} />
        </div>
      );
    case "section":
      return (
        <div className="mini-wireframe-canvas">
          <div className="wf-box section-wf" style={{ top: "28%", left: "12%", width: "76%", height: "44%", display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center" }}>
            <div style={{ width: "24%", height: "20%", background: "#0d9488", borderRadius: 2, marginBottom: 4 }} />
            <div style={{ width: "70%", height: 3, background: "#c084fc", borderRadius: 1 }} />
          </div>
        </div>
      );
    case "quote":
      return (
        <div className="mini-wireframe-canvas">
          <div className="wf-box title-wf" style={{ top: "10%", left: "8%", width: "84%", height: "14%" }} />
          <div style={{ position: "absolute", top: "30%", left: "8%", width: "84%", height: "58%", background: "rgba(13,148,136,0.1)", border: "1px solid #0d9488", borderRadius: 4, display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center", padding: 4 }}>
            <span style={{ fontSize: 12, color: "#0d9488" }}>“</span>
            <div style={{ width: "70%", height: 2, background: "rgba(255,255,255,0.4)", margin: "2px 0" }} />
            <div style={{ width: "40%", height: 2, background: "#0d9488" }} />
          </div>
        </div>
      );
    case "statistics":
      return (
        <div className="mini-wireframe-canvas">
          <div className="wf-box title-wf" style={{ top: "10%", left: "6%", width: "88%", height: "16%" }} />
          <div style={{ position: "absolute", top: "32%", left: "6%", width: "26%", height: "56%", background: "rgba(13,148,136,0.15)", border: "1px solid #0d9488", borderRadius: 3, display: "flex", alignItems: "center", justifyContent: "center", color: "#0d9488", fontSize: 10, fontWeight: 800 }}>
            99%
          </div>
          <div style={{ position: "absolute", top: "32%", left: "37%", width: "26%", height: "56%", background: "rgba(99,102,241,0.15)", border: "1px solid #6366f1", borderRadius: 3, display: "flex", alignItems: "center", justifyContent: "center", color: "#6366f1", fontSize: 10, fontWeight: 800 }}>
            4.8x
          </div>
          <div style={{ position: "absolute", top: "32%", left: "68%", width: "26%", height: "56%", background: "rgba(244,63,94,0.15)", border: "1px solid #f43f5e", borderRadius: 3, display: "flex", alignItems: "center", justifyContent: "center", color: "#f43f5e", fontSize: 10, fontWeight: 800 }}>
            100%
          </div>
        </div>
      );
    case "comparison":
      return (
        <div className="mini-wireframe-canvas">
          <div className="wf-box title-wf" style={{ top: "10%", left: "8%", width: "84%", height: "16%" }} />
          <div style={{ position: "absolute", top: "32%", left: "8%", width: "40%", height: "56%", background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.15)", borderRadius: 3 }} />
          <div style={{ position: "absolute", top: "32%", left: "52%", width: "40%", height: "56%", background: "rgba(13,148,136,0.12)", border: "1px solid #0d9488", borderRadius: 3 }} />
        </div>
      );
    case "timeline":
      return (
        <div className="mini-wireframe-canvas">
          <div className="wf-box title-wf" style={{ top: "10%", left: "8%", width: "84%", height: "16%" }} />
          <div style={{ position: "absolute", top: "50%", left: "8%", width: "84%", height: 2, background: "rgba(255,255,255,0.2)" }} />
          <div style={{ position: "absolute", top: "45%", left: "15%", width: 8, height: 8, borderRadius: "50%", background: "#0d9488" }} />
          <div style={{ position: "absolute", top: "45%", left: "38%", width: 8, height: 8, borderRadius: "50%", background: "#0d9488" }} />
          <div style={{ position: "absolute", top: "45%", left: "62%", width: 8, height: 8, borderRadius: "50%", background: "#0d9488" }} />
          <div style={{ position: "absolute", top: "45%", left: "85%", width: 8, height: 8, borderRadius: "50%", background: "#0d9488" }} />
        </div>
      );
    case "process":
      return (
        <div className="mini-wireframe-canvas">
          <div className="wf-box title-wf" style={{ top: "10%", left: "6%", width: "88%", height: "16%" }} />
          <div style={{ position: "absolute", top: "36%", left: "6%", width: "25%", height: "48%", background: "rgba(255,255,255,0.08)", borderRadius: 2 }} />
          <div style={{ position: "absolute", top: "54%", left: "33%", color: "#0d9488", fontSize: 9 }}>➔</div>
          <div style={{ position: "absolute", top: "36%", left: "39%", width: "25%", height: "48%", background: "rgba(255,255,255,0.08)", borderRadius: 2 }} />
          <div style={{ position: "absolute", top: "54%", left: "66%", color: "#0d9488", fontSize: 9 }}>➔</div>
          <div style={{ position: "absolute", top: "36%", left: "72%", width: "25%", height: "48%", background: "rgba(255,255,255,0.08)", borderRadius: 2 }} />
        </div>
      );
    case "image":
    case "image_text":
      return (
        <div className="mini-wireframe-canvas">
          <div className="wf-box title-wf" style={{ top: "10%", left: "8%", width: "84%", height: "16%" }} />
          <div className="wf-box img-wf" style={{ top: "32%", left: "8%", width: "40%", height: "56%", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <span style={{ fontSize: 14, opacity: 0.8 }}>🖼️</span>
          </div>
          <div style={{ position: "absolute", top: "32%", left: "52%", width: "40%", height: "56%", background: "rgba(255,255,255,0.05)", borderRadius: 3, padding: 3 }}>
            <div style={{ width: "80%", height: 3, background: "rgba(255,255,255,0.4)", marginBottom: 3 }} />
            <div style={{ width: "90%", height: 2, background: "rgba(255,255,255,0.2)", marginBottom: 2 }} />
            <div style={{ width: "70%", height: 2, background: "rgba(255,255,255,0.2)" }} />
          </div>
        </div>
      );
    case "chart":
      return (
        <div className="mini-wireframe-canvas">
          <div className="wf-box title-wf" style={{ top: "10%", left: "8%", width: "84%", height: "16%" }} />
          <div className="wf-box chart-wf" style={{ top: "32%", left: "8%", width: "84%", height: "56%", display: "flex", alignItems: "flex-end", justifyContent: "center", gap: 4, paddingBottom: 4 }}>
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
          <div className="wf-box title-wf" style={{ top: "10%", left: "8%", width: "84%", height: "16%" }} />
          <div className="wf-box table-wf" style={{ top: "32%", left: "8%", width: "84%", height: "56%", display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 2, padding: 3 }}>
            <div style={{ background: "rgba(13, 148, 136, 0.6)", borderRadius: 1 }} />
            <div style={{ background: "rgba(13, 148, 136, 0.6)", borderRadius: 1 }} />
            <div style={{ background: "rgba(13, 148, 136, 0.6)", borderRadius: 1 }} />
            <div style={{ background: "rgba(255,255,255,0.12)", borderRadius: 1 }} />
            <div style={{ background: "rgba(255,255,255,0.12)", borderRadius: 1 }} />
            <div style={{ background: "rgba(255,255,255,0.12)", borderRadius: 1 }} />
          </div>
        </div>
      );
    case "mixed_content":
      return (
        <div className="mini-wireframe-canvas">
          <div className="wf-box title-wf" style={{ top: "10%", left: "8%", width: "84%", height: "16%" }} />
          <div style={{ position: "absolute", top: "32%", left: "8%", width: "42%", height: "56%", background: "rgba(13,148,136,0.1)", border: "1px solid #0d9488", borderRadius: 3 }} />
          <div style={{ position: "absolute", top: "32%", left: "54%", width: "38%", height: "56%", background: "rgba(255,255,255,0.06)", borderRadius: 3, display: "flex", flexDirection: "column", gap: 3, padding: 3 }}>
            <div style={{ width: "90%", height: 2, background: "rgba(255,255,255,0.4)" }} />
            <div style={{ width: "80%", height: 2, background: "rgba(255,255,255,0.3)" }} />
            <div style={{ width: "85%", height: 2, background: "rgba(255,255,255,0.3)" }} />
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
