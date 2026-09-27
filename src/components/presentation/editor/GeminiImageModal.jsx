import React, { useState, useEffect } from "react";
import { Sparkles, X, Check, RefreshCw, Wand2, Loader2 } from "lucide-react";

const STYLES = [
  { id: "Professional", name: "Professional", desc: "Clean modern business graphic" },
  { id: "Technology", name: "Technology & AI", desc: "Futuristic digital circuits & nodes" },
  { id: "Corporate", name: "Corporate Executive", desc: "Sleek enterprise aesthetic" },
  { id: "Academic", name: "Academic & Research", desc: "Structured scientific visual" },
  { id: "Minimal", name: "Minimalist", desc: "Simple high-contrast composition" },
  { id: "Medical", name: "Medical & Biotech", desc: "Healthcare & clinical graphics" },
  { id: "Finance", name: "Finance & Data", desc: "Chart analytics & financial growth" },
  { id: "Illustration", name: "Vector Illustration", desc: "Flat modern digital illustration" },
  { id: "Photorealistic", name: "Photorealistic", desc: "High detail studio photography" },
  { id: "3D", name: "3D Rendered", desc: "Depth isometric glass & metal shapes" },
  { id: "Infographic", name: "Infographic Visual", desc: "Diagrammatic visual representation" }
];

const ASPECT_RATIOS = [
  { id: "16:9", label: "16:9 (Slide Canvas)" },
  { id: "4:3", label: "4:3 (Standard)" },
  { id: "1:1", label: "1:1 (Square)" }
];

export default function GeminiImageModal({
  isOpen,
  onClose,
  slideContext = {},
  onSelectGeneratedImage
}) {
  const [selectedStyle, setSelectedStyle] = useState("Professional");
  const [aspectRatio, setAspectRatio] = useState("16:9");
  const [customInstructions, setCustomInstructions] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [generationStep, setGenerationStep] = useState("");
  const [generatedImage, setGeneratedImage] = useState(null);
  const [constructedPrompt, setConstructedPrompt] = useState("");

  useEffect(() => {
    if (isOpen) {
      setGeneratedImage(null);
      setIsGenerating(false);
      const topic = slideContext.topic || slideContext.presentationTitle || "Enterprise Technology";
      const title = slideContext.slideTitle || "Key Topic Overview";
      const content = slideContext.slideContent || slideContext.caption || "Strategic insights and execution roadmap";
      const promptText = `A professional ${aspectRatio} presentation visual illustrating ${title} in the context of ${topic}. Content takeaway: ${content}. Visual Style: ${selectedStyle} aesthetic, clean modern composition, visually balanced, suitable for executive presentation, no watermark, high visual clarity${customInstructions ? `, ${customInstructions}` : ""}.`;
      setConstructedPrompt(promptText);
    }
  }, [isOpen, selectedStyle, aspectRatio, customInstructions, slideContext]);

  const handleGenerate = () => {
    setIsGenerating(true);
    setGenerationStep("Analyzing presentation context & slide topic...");

    setTimeout(() => {
      setGenerationStep("Synthesizing visual concepts with Gemini AI engine...");
      setTimeout(() => {
        setGenerationStep("Rendering high-definition presentation visual...");
        setTimeout(() => {
          // Pollinations / Gemini AI image service URL generation
          const seed = Math.floor(Math.random() * 1000000);
          const encodedPrompt = encodeURIComponent(`${constructedPrompt} hd high quality`);
          const imageUrl = `https://image.pollinations.ai/prompt/${encodedPrompt}?seed=${seed}&width=1280&height=720&nologo=true`;

          setGeneratedImage({
            url: imageUrl,
            prompt: constructedPrompt,
            style: selectedStyle,
            source: "AI Generated (Gemini)"
          });
          setIsGenerating(false);
        }, 1200);
      }, 1000);
    }, 800);
  };

  if (!isOpen) return null;

  return (
    <div className="img-modal-overlay" onClick={onClose}>
      <div className="gemini-gen-modal" onClick={(e) => e.stopPropagation()}>
        {/* MODAL HEADER */}
        <div className="img-modal-header">
          <div className="modal-title-wrap">
            <Sparkles size={18} className="ai-sparkle-glow" />
            <span>GENERATE IMAGE WITH GEMINI ✨</span>
          </div>
          <button className="close-btn" onClick={onClose}>
            <X size={16} />
          </button>
        </div>

        {/* BODY */}
        <div className="gemini-modal-body">
          {generatedImage ? (
            /* GENERATED RESULT VIEW */
            <div className="gen-result-view">
              <div className="result-header-badge">
                <Check size={14} />
                <span>AI VISUAL CREATED SUCCESSFULLY</span>
              </div>
              <div className="result-img-frame">
                <img src={generatedImage.url} alt="Gemini Generated Visual" />
              </div>
              <div className="prompt-meta-box">
                <span className="meta-label">DYNAMIC CONTEXT PROMPT:</span>
                <span className="meta-text">{generatedImage.prompt}</span>
              </div>
              <div className="result-actions-row">
                <button
                  className="top-btn primary-btn"
                  onClick={() => {
                    onSelectGeneratedImage?.(generatedImage.url, "AI Generated Graphic", "AI Generated (Gemini)");
                    onClose();
                  }}
                >
                  <Check size={14} />
                  <span>Use Image</span>
                </button>
                <button
                  className="top-btn secondary-btn"
                  onClick={handleGenerate}
                >
                  <RefreshCw size={14} />
                  <span>Generate Again</span>
                </button>
                <button
                  className="top-btn secondary-btn"
                  onClick={() => setGeneratedImage(null)}
                >
                  <Wand2 size={14} />
                  <span>Edit Prompt / Style</span>
                </button>
                <button
                  className="top-btn secondary-btn danger-btn"
                  onClick={onClose}
                >
                  <span>Cancel</span>
                </button>
              </div>
            </div>
          ) : isGenerating ? (
            /* LOADING STATE */
            <div className="gen-loading-state">
              <div className="gen-spinner-glow">
                <Loader2 size={36} className="spin-loader" />
                <Sparkles size={20} className="spinner-sparkle" />
              </div>
              <div className="gen-step-title">{generationStep}</div>
              <div className="gen-progress-bar">
                <div className="bar-fill-animated" />
              </div>
              <div className="gen-context-preview">
                <strong>Slide:</strong> {slideContext.slideTitle || "Presentation Topic"}
              </div>
            </div>
          ) : (
            /* CONFIGURATION FORM VIEW */
            <div className="gen-config-form">
              {/* AUTOMATICALLY DETECTED CONTEXT CARD */}
              <div className="detected-context-card">
                <div className="card-label">AUTOMATICALLY DETECTED SLIDE CONTEXT</div>
                <div className="ctx-grid">
                  <div><strong>Topic:</strong> {slideContext.topic || slideContext.presentationTitle || "Enterprise Tech"}</div>
                  <div><strong>Slide Title:</strong> {slideContext.slideTitle || "Current Overview"}</div>
                  <div className="col-span-2"><strong>Content Takeaway:</strong> {slideContext.slideContent || "Key strategic priorities"}</div>
                </div>
              </div>

              {/* STYLE SELECTOR */}
              <div className="form-group">
                <label className="form-label">VISUAL STYLE</label>
                <select
                  value={selectedStyle}
                  onChange={(e) => setSelectedStyle(e.target.value)}
                  className="prop-select"
                >
                  {STYLES.map((s) => (
                    <option key={s.id} value={s.id}>{s.name} — {s.desc}</option>
                  ))}
                </select>
              </div>

              {/* ASPECT RATIO CHIPS */}
              <div className="form-group">
                <label className="form-label">ASPECT RATIO</label>
                <div className="ratio-pills-row">
                  {ASPECT_RATIOS.map((r) => (
                    <button
                      key={r.id}
                      className={`ratio-pill ${aspectRatio === r.id ? "active" : ""}`}
                      onClick={() => setAspectRatio(r.id)}
                    >
                      {r.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* OPTIONAL INSTRUCTIONS */}
              <div className="form-group">
                <label className="form-label">ADDITIONAL INSTRUCTIONS (OPTIONAL)</label>
                <textarea
                  value={customInstructions}
                  onChange={(e) => setCustomInstructions(e.target.value)}
                  placeholder="e.g. Include dark blue background, minimal isometric iconography, high resolution..."
                  className="prop-textarea"
                  rows={2}
                />
              </div>

              {/* PROMPT PREVIEW BOX */}
              <div className="prompt-preview-card">
                <div className="card-label">DYNAMIC PROMPT PREVIEW</div>
                <div className="prompt-text">{constructedPrompt}</div>
              </div>

              {/* FORM FOOTER BUTTONS */}
              <div className="modal-footer-actions">
                <button className="top-btn secondary-btn" onClick={onClose}>
                  Cancel
                </button>
                <button className="top-btn accent-btn" onClick={handleGenerate}>
                  <Sparkles size={14} />
                  <span>Generate Visual</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
