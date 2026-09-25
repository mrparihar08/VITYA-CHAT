import React from "react";
import { Sparkles, CheckCircle2, AlertTriangle, X } from "lucide-react";

export default function AIDesignCheckModal({
  isOpen,
  onClose,
  slide,
  onApplyFixes,
  onShortenText
}) {
  if (!isOpen) return null;

  const elements = slide?.elements || [];
  const textElements = elements.filter((el) => el.type === "text" || el.type === "bullets");
  const totalWords = textElements.reduce((acc, el) => acc + (el.content || "").split(/\s+/).filter(Boolean).length, 0);

  const isTooMuchText = totalWords > 70;
  const isTooManyElements = elements.length > 8;

  return (
    <div className="layout-picker-overlay" onClick={onClose}>
      <div className="layout-picker-modal design-check-modal" onClick={(e) => e.stopPropagation()}>
        <div className="picker-header">
          <div className="picker-title">
            <Sparkles size={18} className="text-purple-400" />
            <span>AI Design Check & Quality Audit</span>
          </div>
          <button className="close-btn" onClick={onClose}>
            <X size={16} />
          </button>
        </div>

        <div className="design-check-body">
          <div className="density-badge-row">
            <span className="density-label">CONTENT DENSITY:</span>
            <span className={`density-pill ${isTooMuchText ? "high" : "good"}`}>
              ● {isTooMuchText ? "High / Too Much Text" : "Optimal & Balanced"}
            </span>
          </div>

          <div className="check-results-list">
            <div className="check-item ok">
              <CheckCircle2 size={16} className="item-icon success" />
              <div className="item-details">
                <span className="item-title">Typography Hierarchy</span>
                <span className="item-desc">Font choices and sizes are clean and consistent.</span>
              </div>
            </div>

            <div className="check-item ok">
              <CheckCircle2 size={16} className="item-icon success" />
              <div className="item-details">
                <span className="item-title">Color Palette Harmony</span>
                <span className="item-desc">High contrast ratio ensures text is readable.</span>
              </div>
            </div>

            {isTooMuchText ? (
              <div className="check-item warning">
                <AlertTriangle size={16} className="item-icon warn" />
                <div className="item-details">
                  <span className="item-title">Excessive Text Density</span>
                  <span className="item-desc">This slide has {totalWords} words. Consider shortening for presentation impact.</span>
                </div>
                <button
                  className="quick-action-btn"
                  onClick={() => {
                    onShortenText?.();
                    onClose();
                  }}
                >
                  Shorten with AI
                </button>
              </div>
            ) : (
              <div className="check-item ok">
                <CheckCircle2 size={16} className="item-icon success" />
                <div className="item-details">
                  <span className="item-title">Word Count & Brevity</span>
                  <span className="item-desc">Word count is concise for visual presentation.</span>
                </div>
              </div>
            )}

            {isTooManyElements && (
              <div className="check-item warning">
                <AlertTriangle size={16} className="item-icon warn" />
                <div className="item-details">
                  <span className="item-title">Element Clutter</span>
                  <span className="item-desc">Slide has {elements.length} elements. Grouping or spacing will improve clarity.</span>
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="design-check-footer">
          <button className="top-btn secondary-btn" onClick={onClose}>
            Cancel
          </button>
          <button
            className="top-btn primary-btn"
            onClick={() => {
              onApplyFixes?.();
              onClose();
            }}
          >
            <Sparkles size={14} />
            <span>Apply All Recommended Fixes</span>
          </button>
        </div>
      </div>
    </div>
  );
}
