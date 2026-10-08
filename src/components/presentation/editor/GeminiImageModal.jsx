import React, { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { Sparkles, X, Check, RefreshCw, Wand2, Loader2, Download, Zap, Cpu } from "lucide-react";
import { generateAiPresentationImage } from "../../../services/api";

const PROVIDERS = [
  { id: "auto", name: "Auto (Recommended)", desc: "Intelligent selection with automatic fallback", icon: Zap },
  { id: "gemini", name: "Google Gemini", desc: "Google Imagen 3 neural generation engine", icon: Sparkles },
  { id: "pollinations", name: "Pollinations.ai", desc: "Flux & Turbo high-fidelity generation", icon: Cpu }
];

const STYLES = [
  { id: "Professional", name: "Professional", desc: "Clean modern corporate visual" },
  { id: "Technology", name: "Technology & AI", desc: "Futuristic digital circuits & nodes" },
  { id: "Corporate", name: "Corporate Executive", desc: "Sleek enterprise aesthetic" },
  { id: "Academic", name: "Academic & Research", desc: "Structured scientific visual" },
  { id: "Minimal", name: "Minimalist", desc: "Simple high-contrast composition" },
  { id: "Medical", name: "Medical & Biotech", desc: "Healthcare & clinical graphics" },
  { id: "Finance", name: "Finance & Data", desc: "Chart analytics & financial growth" },
  { id: "Illustration", name: "Vector Illustration", desc: "Flat modern digital illustration" },
  { id: "Photorealistic", name: "Photorealistic", desc: "High detail studio photography" },
  { id: "3D", name: "3D Rendered", desc: "Depth isometric glass & metal shapes" },
  { id: "Architecture", name: "Architecture & Systems", desc: "Blueprint & system architecture" },
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
  const [provider, setProvider] = useState("auto");
  const [selectedStyle, setSelectedStyle] = useState("Professional");
  const [aspectRatio, setAspectRatio] = useState("16:9");
  const [customInstructions, setCustomInstructions] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [generationStep, setGenerationStep] = useState("");
  const [generatedImage, setGeneratedImage] = useState(null);
  const [constructedPrompt, setConstructedPrompt] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    if (isOpen) {
      setGeneratedImage(null);
      setIsGenerating(false);
      setErrorMessage("");
      const topic = slideContext.topic || slideContext.presentationTitle || "Enterprise Technology";
      const title = slideContext.slideTitle || "Key Topic Overview";
      const content = slideContext.slideContent || slideContext.caption || "Strategic insights and execution roadmap";
      const promptText = `A professional ${aspectRatio} presentation visual illustrating ${title} in the domain of ${topic}. Content takeaway: ${content}. Visual Style: ${selectedStyle} aesthetic, clean modern widescreen composition, ample negative space for slide text, executive presentation quality, no watermarks, no distorted text labels${customInstructions ? `, ${customInstructions}` : ""}.`;
      setConstructedPrompt(promptText);
    }
  }, [isOpen, provider, selectedStyle, aspectRatio, customInstructions, slideContext]);

  const handleGenerate = async () => {
    setIsGenerating(true);
    setErrorMessage("");
    setGenerationStep("Analyzing presentation context & slide topic...");

    try {
      const providerLabel = provider === "gemini" ? "Google Gemini" : provider === "pollinations" ? "Pollinations.ai" : "Auto AI Engine";
      setGenerationStep(`Synthesizing visual concepts with ${providerLabel}...`);
      
      const res = await generateAiPresentationImage({
        prompt: constructedPrompt,
        provider: provider,
        style: selectedStyle,
        aspect_ratio: aspectRatio,
        topic: slideContext.topic || slideContext.presentationTitle || "",
        slide_title: slideContext.slideTitle || "",
        slide_content: slideContext.slideContent || "",
        custom_instructions: customInstructions,
      });

      if (res && (res.image_url || res.url)) {
        setGeneratedImage({
          url: res.image_url || res.url,
          prompt: res.prompt || res.revised_prompt || constructedPrompt,
          style: res.style || selectedStyle,
          provider: res.provider || provider,
          model: res.model || "AI Model",
          source: res.source || (res.provider === "gemini" ? "Google Gemini Imagen 3" : "Pollinations.ai"),
          attribution: res.attribution || `Image generated via ${res.provider || "AI"}`
        });
      } else {
        throw new Error("Image generation failed to return an image URL");
      }
    } catch (err) {
      console.error("AI image generation error:", err);
      setErrorMessage(err.message || "Failed to generate image. Please try again or switch provider.");
    } finally {
      setIsGenerating(false);
    }
  };

  const handleDownload = (imgUrl) => {
    if (!imgUrl) return;
    const a = document.createElement("a");
    a.href = imgUrl;
    a.download = `presentation_ai_visual_${Date.now()}.jpg`;
    a.target = "_blank";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  if (!isOpen) return null;

  const modalJSX = (
    <div className="img-modal-overlay" onClick={onClose}>
      <div className="gemini-gen-modal" onClick={(e) => e.stopPropagation()} style={{ maxWidth: "780px", width: "95vw" }}>
        {/* MODAL HEADER */}
        <div className="img-modal-header" style={{ padding: "14px 20px", display: "flex", alignItems: "center", justifyContent: "space-between", borderBottom: "1px solid rgba(255, 255, 255, 0.1)" }}>
          <div className="modal-title-wrap" style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <Sparkles size={18} className="ai-sparkle-glow" style={{ color: "#38bdf8" }} />
            <span style={{ fontWeight: 800, fontSize: "14px", letterSpacing: "0.5px" }}>
              AI PRESENTATION IMAGE STUDIO ✨
            </span>
          </div>
          <button className="close-btn" onClick={onClose} style={{ background: "transparent", border: "none", color: "#94a3b8", cursor: "pointer" }}>
            <X size={18} />
          </button>
        </div>

        {/* BODY */}
        <div className="gemini-modal-body" style={{ padding: "20px" }}>
          {generatedImage ? (
            /* GENERATED RESULT VIEW */
            <div className="gen-result-view">
              <div className="result-header-badge" style={{ display: "flex", alignItems: "center", justifyContent: "space-between", background: "rgba(16, 185, 129, 0.15)", border: "1px solid rgba(16, 185, 129, 0.3)", padding: "8px 12px", borderRadius: 6, marginBottom: 14 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 6, color: "#10b981", fontWeight: 700, fontSize: 13 }}>
                  <Check size={16} />
                  <span>VISUAL GENERATED BY {generatedImage.source.toUpperCase()}</span>
                </div>
                <span style={{ fontSize: 11, color: "#94a3b8" }}>{generatedImage.model}</span>
              </div>

              <div className="result-img-frame" style={{ borderRadius: 8, overflow: "hidden", border: "1px solid rgba(255,255,255,0.1)", background: "#000", display: "flex", justifyContent: "center", alignItems: "center", maxHeight: "380px" }}>
                <img src={generatedImage.url} alt="AI Generated Visual" style={{ width: "100%", maxHeight: "380px", objectFit: "contain" }} />
              </div>

              <div className="prompt-meta-box" style={{ marginTop: 12, padding: "10px 14px", background: "rgba(15, 23, 42, 0.7)", borderRadius: 6, border: "1px solid rgba(255, 255, 255, 0.08)" }}>
                <div style={{ fontSize: 10, fontWeight: 800, color: "#38bdf8", marginBottom: 4, letterSpacing: "0.5px" }}>SYNTHESIZED VISUAL PROMPT:</div>
                <div style={{ fontSize: 12, color: "#cbd5e1", lineHeight: 1.4 }}>{generatedImage.prompt}</div>
              </div>

              <div className="result-actions-row" style={{ display: "flex", gap: 10, marginTop: 16, flexWrap: "wrap" }}>
                <button
                  className="top-btn primary-btn"
                  onClick={() => {
                    onSelectGeneratedImage?.(
                      generatedImage.url,
                      slideContext.slideTitle || "AI Visual",
                      generatedImage.source,
                      {
                        provider: generatedImage.provider,
                        model: generatedImage.model,
                        attribution: generatedImage.attribution,
                        license: "AI Generated",
                      }
                    );
                    onClose();
                  }}
                  style={{ background: "#10b981", color: "#ffffff", fontWeight: 700, padding: "9px 18px", borderRadius: 6, border: "none", cursor: "pointer", display: "flex", alignItems: "center", gap: 6 }}
                >
                  <Check size={15} />
                  <span>Use Image</span>
                </button>
                <button
                  className="top-btn secondary-btn"
                  onClick={handleGenerate}
                  style={{ background: "rgba(56, 189, 248, 0.15)", border: "1px solid rgba(56, 189, 248, 0.4)", color: "#38bdf8", fontWeight: 600, padding: "9px 16px", borderRadius: 6, cursor: "pointer", display: "flex", alignItems: "center", gap: 6 }}
                >
                  <RefreshCw size={15} />
                  <span>Regenerate</span>
                </button>
                <button
                  className="top-btn secondary-btn"
                  onClick={() => setGeneratedImage(null)}
                  style={{ background: "rgba(255, 255, 255, 0.08)", border: "1px solid rgba(255, 255, 255, 0.15)", color: "#e2e8f0", fontWeight: 600, padding: "9px 16px", borderRadius: 6, cursor: "pointer", display: "flex", alignItems: "center", gap: 6 }}
                >
                  <Wand2 size={15} />
                  <span>Edit Settings</span>
                </button>
                <button
                  className="top-btn secondary-btn"
                  onClick={() => handleDownload(generatedImage.url)}
                  style={{ background: "rgba(255, 255, 255, 0.08)", border: "1px solid rgba(255, 255, 255, 0.15)", color: "#e2e8f0", fontWeight: 600, padding: "9px 16px", borderRadius: 6, cursor: "pointer", display: "flex", alignItems: "center", gap: 6 }}
                >
                  <Download size={15} />
                  <span>Download</span>
                </button>
              </div>
            </div>
          ) : isGenerating ? (
            /* LOADING STATE */
            <div className="gen-loading-state" style={{ padding: "40px 20px", textAlign: "center" }}>
              <div className="gen-spinner-glow" style={{ position: "relative", display: "inline-flex", justifyContent: "center", alignItems: "center", marginBottom: 16 }}>
                <Loader2 size={44} className="spin-loader" style={{ color: "#38bdf8" }} />
                <Sparkles size={20} className="spinner-sparkle" style={{ position: "absolute", color: "#fbbf24" }} />
              </div>
              <div className="gen-step-title" style={{ color: "#f8fafc", fontWeight: 700, fontSize: 15, marginBottom: 12 }}>{generationStep}</div>
              <div className="gen-progress-bar" style={{ height: 4, width: "240px", background: "rgba(255,255,255,0.1)", borderRadius: 2, margin: "0 auto 16px auto", overflow: "hidden" }}>
                <div className="bar-fill-animated" style={{ height: "100%", width: "60%", background: "#38bdf8", borderRadius: 2 }} />
              </div>
              <div className="gen-context-preview" style={{ fontSize: 12, color: "#94a3b8" }}>
                <strong>Slide:</strong> {slideContext.slideTitle || "Presentation Topic"}
              </div>
            </div>
          ) : (
            /* CONFIGURATION FORM VIEW */
            <div className="gen-config-form" style={{ display: "flex", flexDirection: "column", gap: 14 }}>
              {errorMessage && (
                <div style={{ background: "rgba(239, 68, 68, 0.15)", border: "1px solid rgba(239, 68, 68, 0.3)", color: "#fca5a5", padding: "10px 14px", borderRadius: 6, fontSize: 12 }}>
                  {errorMessage}
                </div>
              )}

              {/* AUTOMATICALLY DETECTED CONTEXT CARD */}
              <div className="detected-context-card" style={{ background: "rgba(30, 41, 59, 0.5)", border: "1px solid rgba(255, 255, 255, 0.08)", padding: "12px 14px", borderRadius: 6 }}>
                <div className="card-label" style={{ fontSize: 10, fontWeight: 800, color: "#38bdf8", marginBottom: 6, letterSpacing: "0.5px" }}>
                  SLIDE TOPIC CONTEXT
                </div>
                <div className="ctx-grid" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 6, fontSize: 12, color: "#cbd5e1" }}>
                  <div><strong style={{ color: "#94a3b8" }}>Topic:</strong> {slideContext.topic || slideContext.presentationTitle || "Enterprise Tech"}</div>
                  <div><strong style={{ color: "#94a3b8" }}>Slide:</strong> {slideContext.slideTitle || "Current Overview"}</div>
                  <div style={{ gridColumn: "span 2" }}><strong style={{ color: "#94a3b8" }}>Takeaway:</strong> {slideContext.slideContent || "Key strategic priorities"}</div>
                </div>
              </div>

              {/* PROVIDER SELECTOR CHIPS */}
              <div className="form-group">
                <label className="form-label" style={{ display: "block", fontSize: 11, fontWeight: 800, color: "#94a3b8", marginBottom: 6 }}>
                  AI GENERATION ENGINE / PROVIDER
                </label>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 8 }}>
                  {PROVIDERS.map((p) => {
                    const Icon = p.icon;
                    const isSelected = provider === p.id;
                    return (
                      <button
                        key={p.id}
                        type="button"
                        onClick={() => setProvider(p.id)}
                        style={{
                          display: "flex",
                          flexDirection: "column",
                          alignItems: "flex-start",
                          gap: 4,
                          padding: "10px 12px",
                          borderRadius: 6,
                          border: isSelected ? "1.5px solid #38bdf8" : "1px solid rgba(255, 255, 255, 0.1)",
                          background: isSelected ? "rgba(56, 189, 248, 0.15)" : "rgba(15, 23, 42, 0.5)",
                          color: isSelected ? "#38bdf8" : "#cbd5e1",
                          cursor: "pointer",
                          textAlign: "left",
                          transition: "all 0.15s ease"
                        }}
                      >
                        <div style={{ display: "flex", alignItems: "center", gap: 6, fontWeight: 700, fontSize: 12 }}>
                          <Icon size={14} />
                          <span>{p.name}</span>
                        </div>
                        <span style={{ fontSize: 10, color: isSelected ? "#bae6fd" : "#64748b", lineHeight: 1.2 }}>
                          {p.desc}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* STYLE & ASPECT RATIO ROW */}
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                {/* STYLE SELECTOR */}
                <div className="form-group">
                  <label className="form-label" style={{ display: "block", fontSize: 11, fontWeight: 800, color: "#94a3b8", marginBottom: 6 }}>
                    VISUAL STYLE
                  </label>
                  <select
                    value={selectedStyle}
                    onChange={(e) => setSelectedStyle(e.target.value)}
                    className="prop-select"
                    style={{ width: "100%", padding: "8px 10px", background: "#0f172a", border: "1px solid rgba(255,255,255,0.15)", borderRadius: 6, color: "#fff", fontSize: 12 }}
                  >
                    {STYLES.map((s) => (
                      <option key={s.id} value={s.id}>{s.name} — {s.desc}</option>
                    ))}
                  </select>
                </div>

                {/* ASPECT RATIO */}
                <div className="form-group">
                  <label className="form-label" style={{ display: "block", fontSize: 11, fontWeight: 800, color: "#94a3b8", marginBottom: 6 }}>
                    ASPECT RATIO
                  </label>
                  <div style={{ display: "flex", gap: 6 }}>
                    {ASPECT_RATIOS.map((r) => (
                      <button
                        key={r.id}
                        type="button"
                        onClick={() => setAspectRatio(r.id)}
                        style={{
                          flex: 1,
                          padding: "8px 6px",
                          borderRadius: 6,
                          fontSize: 11,
                          fontWeight: 700,
                          border: aspectRatio === r.id ? "1px solid #38bdf8" : "1px solid rgba(255, 255, 255, 0.1)",
                          background: aspectRatio === r.id ? "rgba(56, 189, 248, 0.2)" : "rgba(15, 23, 42, 0.5)",
                          color: aspectRatio === r.id ? "#38bdf8" : "#94a3b8",
                          cursor: "pointer"
                        }}
                      >
                        {r.label}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* OPTIONAL INSTRUCTIONS */}
              <div className="form-group">
                <label className="form-label" style={{ display: "block", fontSize: 11, fontWeight: 800, color: "#94a3b8", marginBottom: 6 }}>
                  CUSTOM DIRECTIVES / PROMPT INSTRUCTIONS (OPTIONAL)
                </label>
                <textarea
                  value={customInstructions}
                  onChange={(e) => setCustomInstructions(e.target.value)}
                  placeholder="e.g. Include dark blue background, isometric server room with fiber optic strands..."
                  className="prop-textarea"
                  rows={2}
                  style={{ width: "100%", padding: "8px 10px", background: "#0f172a", border: "1px solid rgba(255,255,255,0.15)", borderRadius: 6, color: "#fff", fontSize: 12, resize: "none" }}
                />
              </div>

              {/* PROMPT PREVIEW BOX */}
              <div className="prompt-preview-card" style={{ background: "rgba(15, 23, 42, 0.4)", border: "1px dashed rgba(255, 255, 255, 0.12)", padding: "10px 12px", borderRadius: 6 }}>
                <div className="card-label" style={{ fontSize: 10, fontWeight: 800, color: "#38bdf8", marginBottom: 4 }}>
                  SYNTHESIZED PROMPT PREVIEW
                </div>
                <div style={{ fontSize: 11, color: "#94a3b8", lineHeight: 1.4 }}>{constructedPrompt}</div>
              </div>

              {/* FORM FOOTER BUTTONS */}
              <div className="modal-footer-actions" style={{ display: "flex", justifyContent: "flex-end", gap: 10, marginTop: 6 }}>
                <button
                  type="button"
                  className="top-btn secondary-btn"
                  onClick={onClose}
                  style={{ background: "transparent", border: "1px solid rgba(255,255,255,0.15)", color: "#94a3b8", padding: "8px 16px", borderRadius: 6, cursor: "pointer", fontWeight: 600 }}
                >
                  Cancel
                </button>
                <button
                  type="button"
                  className="top-btn accent-btn"
                  onClick={handleGenerate}
                  style={{ background: "#38bdf8", color: "#0f172a", border: "none", padding: "8px 20px", borderRadius: 6, cursor: "pointer", fontWeight: 800, display: "flex", alignItems: "center", gap: 6 }}
                >
                  <Sparkles size={15} />
                  <span>Generate AI Visual</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );

  return typeof document !== "undefined" ? createPortal(modalJSX, document.body) : modalJSX;
}
