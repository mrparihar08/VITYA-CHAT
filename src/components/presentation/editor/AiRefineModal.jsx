import React, { useState } from "react";
import { Sparkles, Wand2, FileText, BarChart2, Network, Image as ImageIcon, X, Check, Loader2 } from "lucide-react";
import { refineSlideText } from "../../../services/api";

export default function AiRefineModal({
  isOpen,
  onClose,
  initialText = "",
  slideTitle = "",
  presentationTitle = "",
  onApplyRefined
}) {
  const [inputText, setInputText] = useState(initialText);
  const [selectedAction, setSelectedAction] = useState("polish");
  const [isRefining, setIsRefining] = useState(false);
  const [refinedResult, setRefinedResult] = useState(null);
  const [errorMessage, setErrorMessage] = useState("");

  if (!isOpen) return null;

  const ACTIONS = [
    { id: "polish", label: "Polish Text", icon: <Wand2 size={14} />, desc: "Refine executive tone & clarity" },
    { id: "headline", label: "Impact Headline", icon: <Sparkles size={14} />, desc: "Create punchy headline" },
    { id: "bullets", label: "Convert to Bullets", icon: <FileText size={14} />, desc: "Transform into 3-4 key points" },
    { id: "summarize", label: "Summarize", icon: <FileText size={14} />, desc: "Synthesize into 2-sentence summary" },
    { id: "diagram", label: "Diagram Steps", icon: <Network size={14} />, desc: "Create visual flowchart steps" },
    { id: "chart", label: "Refine Chart Data", icon: <BarChart2 size={14} />, desc: "Generate realistic metrics JSON" },
    { id: "image", label: "AI Image Prompt", icon: <ImageIcon size={14} />, desc: "Generate AI visual graphic" }
  ];

  const handleRefine = async () => {
    if (!inputText.trim()) {
      setErrorMessage("Please enter or select text to refine.");
      return;
    }

    setErrorMessage("");
    setIsRefining(true);
    setRefinedResult(null);

    try {
      const res = await refineSlideText({
        text: inputText.trim(),
        action: selectedAction,
        slide_title: slideTitle,
        presentation_title: presentationTitle
      });

      if (res) {
        setRefinedResult(res);
      } else {
        setErrorMessage("AI refinement produced no result. Please try again.");
      }
    } catch (err) {
      setErrorMessage("Refinement failed: " + (err?.message || "Server error"));
    } finally {
      setIsRefining(false);
    }
  };

  const handleApply = () => {
    if (!refinedResult) return;
    onApplyRefined?.(refinedResult, selectedAction);
    onClose();
  };

  return (
    <div className="ai-refine-overlay" onClick={onClose}>
      <div className="ai-refine-modal" onClick={(e) => e.stopPropagation()}>
        {/* HEADER */}
        <div className="refine-header">
          <div className="refine-header-title">
            <Sparkles size={18} className="ai-sparkle-glow" />
            <span>AI Refine Studio (`ai.refine`)</span>
          </div>
          <button className="close-btn" onClick={onClose}>
            <X size={16} />
          </button>
        </div>

        {/* BODY */}
        <div className="refine-body">
          {/* ACTION SELECTOR */}
          <div className="refine-group">
            <label className="refine-label">SELECT REFINEMENT ACTION</label>
            <div className="refine-actions-grid">
              {ACTIONS.map((act) => (
                <button
                  key={act.id}
                  className={`refine-action-chip ${selectedAction === act.id ? "active" : ""}`}
                  onClick={() => setSelectedAction(act.id)}
                >
                  <span className="chip-icon">{act.icon}</span>
                  <div className="chip-info">
                    <span className="chip-label">{act.label}</span>
                    <span className="chip-desc">{act.desc}</span>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* INPUT TEXT */}
          <div className="refine-group">
            <label className="refine-label">INPUT CONTENT TO REFINE</label>
            <textarea
              className="refine-textarea"
              rows={3}
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder="Type or paste slide content to refine..."
            />
          </div>

          {/* ERROR DISPLAY */}
          {errorMessage && <div className="refine-error-badge">⚠️ {errorMessage}</div>}

          {/* GENERATE BUTTON */}
          <button
            className="refine-submit-btn"
            onClick={handleRefine}
            disabled={isRefining || !inputText.trim()}
          >
            {isRefining ? (
              <>
                <Loader2 size={16} className="spin-icon" />
                <span>Refining with AI...</span>
              </>
            ) : (
              <>
                <Sparkles size={16} />
                <span>Refine Content Now</span>
              </>
            )}
          </button>

          {/* BEFORE VS AFTER RESULT PREVIEW */}
          {refinedResult && (
            <div className="refine-result-box">
              <div className="result-header">
                <Check size={14} className="check-icon" />
                <span>AI REFINED OUTPUT PREVIEW</span>
              </div>

              <div className="before-after-grid" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginBottom: 12 }}>
                <div className="diff-box before-box" style={{ background: "rgba(255, 255, 255, 0.03)", padding: 8, borderRadius: 6, border: "1px solid rgba(255, 255, 255, 0.08)" }}>
                  <span style={{ fontSize: 10, fontWeight: 800, color: "#94a3b8", display: "block", marginBottom: 4 }}>BEFORE (CURRENT)</span>
                  <div className="result-text-preview" style={{ margin: 0, fontSize: 12, opacity: 0.8 }}>
                    {inputText}
                  </div>
                </div>

                <div className="diff-box after-box" style={{ background: "rgba(139, 92, 246, 0.1)", padding: 8, borderRadius: 6, border: "1px solid rgba(139, 92, 246, 0.3)" }}>
                  <span style={{ fontSize: 10, fontWeight: 800, color: "#c084fc", display: "block", marginBottom: 4 }}>AFTER (SUGGESTED)</span>
                  <div className="result-text-preview" style={{ margin: 0, fontSize: 12, color: "#ffffff" }}>
                    {typeof refinedResult.refined_text === "object"
                      ? JSON.stringify(refinedResult.refined_text, null, 2)
                      : refinedResult.refined_text}
                  </div>
                </div>
              </div>

              <div className="preview-action-row" style={{ display: "flex", gap: 8 }}>
                <button className="top-btn secondary-btn" style={{ flex: 1 }} onClick={() => setRefinedResult(null)}>
                  Cancel proposal
                </button>
                <button className="apply-result-btn" style={{ flex: 2 }} onClick={handleApply}>
                  <Check size={14} />
                  <span>Apply Proposal to Slide</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
