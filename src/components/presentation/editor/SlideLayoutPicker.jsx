import React from "react";
import { LAYOUT_OPTIONS, AI_ACTIONS } from "./editorState";
import { Plus, Sparkles, X } from "lucide-react";

export default function SlideLayoutPicker({ isOpen, onClose, onSelectLayout, onAiAction }) {
  if (!isOpen) return null;

  return (
    <div className="layout-picker-overlay" onClick={onClose}>
      <div className="layout-picker-modal" onClick={(e) => e.stopPropagation()}>
        <div className="picker-header">
          <div className="picker-title">
            <Plus size={16} />
            <span>Add New Slide Layout</span>
          </div>
          <button className="close-btn" onClick={onClose}>
            <X size={16} />
          </button>
        </div>

        {/* AI QUICK GENERATE ACTIONS */}
        <div className="picker-section">
          <div className="picker-section-label">
            <Sparkles size={12} className="ai-sparkle-icon" />
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
                <span className="action-icon">{action.icon}</span>
                <div className="action-info">
                  <span className="action-name">{action.name}</span>
                  <span className="action-desc">{action.desc}</span>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* PREDEFINED SLIDE LAYOUTS */}
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
                <span className="layout-icon">{layout.icon}</span>
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
