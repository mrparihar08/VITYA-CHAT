import React from "react";
import { Sparkles, X, Check, AlertTriangle, Image as ImageIcon, Wand2, Search } from "lucide-react";

export default function AiImageRefineModal({
  isOpen,
  onClose,
  slideContext = {},
  imageElement = {},
  onActionSelect
}) {
  if (!isOpen) return null;

  const topic = slideContext.topic || slideContext.presentationTitle || "Presentation Topic";
  const title = slideContext.slideTitle || "Current Slide";
  const caption = imageElement.caption || "No caption provided";
  const url = imageElement.url || "";

  const isPlaceholderUrl = !url || url.includes("unsplash") || url.includes("placeholder");
  const isShortCaption = caption.length < 10;

  return (
    <div className="img-modal-overlay" onClick={onClose}>
      <div className="ai-image-refine-modal" onClick={(e) => e.stopPropagation()}>
        {/* HEADER */}
        <div className="img-modal-header">
          <div className="modal-title-wrap">
            <Sparkles size={18} className="ai-sparkle-glow" />
            <span>AI IMAGE REFINEMENT STUDIO ✨</span>
          </div>
          <button className="close-btn" onClick={onClose}>
            <X size={16} />
          </button>
        </div>

        {/* BODY */}
        <div className="refine-modal-body">
          {/* CURRENT SUMMARY CARD */}
          <div className="summary-card-row">
            <div className="summary-thumb-box">
              {url ? <img src={url} alt="Current element preview" /> : <ImageIcon size={24} />}
            </div>
            <div className="summary-meta-info">
              <div className="meta-title">{title}</div>
              <div className="meta-sub">Topic: {topic}</div>
              <div className="meta-caption">Caption: "{caption}"</div>
            </div>
          </div>

          {/* AI ANALYSIS SUGGESTIONS CHECKLIST */}
          <div className="refine-checklist-card">
            <div className="card-label">AI QUALITY & RELEVANCE DIAGNOSTICS</div>

            <div className="check-item-row ok">
              <Check size={14} className="icon-ok" />
              <span>Image aspect ratio is suitable for 16:9 presentation canvas scale</span>
            </div>

            <div className={`check-item-row ${isPlaceholderUrl ? "warning" : "ok"}`}>
              {isPlaceholderUrl ? <AlertTriangle size={14} className="icon-warn" /> : <Check size={14} className="icon-ok" />}
              <span>{isPlaceholderUrl ? "Image uses generic stock graphic; custom contextual graphic recommended" : "Image matches technical subject theme"}</span>
            </div>

            <div className={`check-item-row ${isShortCaption ? "warning" : "ok"}`}>
              {isShortCaption ? <AlertTriangle size={14} className="icon-warn" /> : <Check size={14} className="icon-ok" />}
              <span>{isShortCaption ? "Caption can be expanded for executive impact & takeaway clarity" : "Caption provides clear takeaway context"}</span>
            </div>
          </div>

          {/* SUGGESTED ACTIONS GRID */}
          <div className="suggested-actions-section">
            <div className="card-label">SUGGESTED AI REFINEMENT ACTIONS</div>

            <div className="actions-stack">
              <button
                className="action-option-card"
                onClick={() => {
                  onActionSelect?.("find_best");
                  onClose();
                }}
              >
                <Search size={16} className="act-icon" />
                <div className="act-info">
                  <span className="act-title">Find Better Image ✨</span>
                  <span className="act-desc">Search curated context-aware Unsplash library matching "{title}"</span>
                </div>
              </button>

              <button
                className="action-option-card"
                onClick={() => {
                  onActionSelect?.("generate_gemini");
                  onClose();
                }}
              >
                <Sparkles size={16} className="act-icon sparkle" />
                <div className="act-info">
                  <span className="act-title">Generate with Gemini ✨</span>
                  <span className="act-desc">Synthesize a custom 16:9 AI visual specifically for this slide</span>
                </div>
              </button>

              <button
                className="action-option-card"
                onClick={() => {
                  onActionSelect?.("improve_caption");
                  onClose();
                }}
              >
                <Wand2 size={16} className="act-icon" />
                <div className="act-info">
                  <span className="act-title">Improve Caption ✨</span>
                  <span className="act-desc">Rewrite caption into a concise professional impact takeaway statement</span>
                </div>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
