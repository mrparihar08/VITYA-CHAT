import React, { useRef } from "react";

export const BACKGROUND_PRESETS = [
  { id: "dark_gradient", name: "Midnight Purple", bg: "linear-gradient(135deg, #0f172a 0%, #1e1b4b 50%, #31104b 100%)", text: "#ffffff", accent: "#c084fc", solid_bg: "#0f172a", bg_start: "#0f172a", bg_end: "#31104b" },
  { id: "ocean_blue", name: "Ocean Breeze", bg: "linear-gradient(135deg, #06101e 0%, #0b2545 50%, #134074 100%)", text: "#ffffff", accent: "#38bdf8", solid_bg: "#06101e", bg_start: "#06101e", bg_end: "#134074" },
  { id: "emerald_dark", name: "Emerald Forest", bg: "linear-gradient(135deg, #022c22 0%, #064e3b 50%, #047857 100%)", text: "#ffffff", accent: "#34d399", solid_bg: "#022c22", bg_start: "#022c22", bg_end: "#047857" },
  { id: "executive_slate", name: "Executive Slate", bg: "linear-gradient(135deg, #18181b 0%, #27272a 50%, #3f3f46 100%)", text: "#ffffff", accent: "#a1a1aa", solid_bg: "#18181b", bg_start: "#18181b", bg_end: "#3f3f46" },
  { id: "clean_light", name: "Minimal Light", bg: "linear-gradient(135deg, #f8fafc 0%, #f1f5f9 50%, #e2e8f0 100%)", text: "#0f172a", accent: "#2563eb", solid_bg: "#f8fafc", bg_start: "#f8fafc", bg_end: "#e2e8f0" },
  { id: "sunset_glow", name: "Sunset Glow", bg: "linear-gradient(135deg, #2a0813 0%, #4c0519 50%, #881337 100%)", text: "#ffffff", accent: "#fb7185", solid_bg: "#2a0813", bg_start: "#2a0813", bg_end: "#881337" },
  { id: "custom", name: "🎨 Custom Palette", bg: "custom", text: "#ffffff", accent: "#c084fc", solid_bg: "#0f172a", bg_start: "#1e1b4b", bg_end: "#0f172a" },
];

function safeArray(value) {
  return Array.isArray(value) ? value : [];
}

export function VisualChartPreview({ data }) {
  const chartType = data?.chart_type || "bar";
  const title = data?.title || "Data Metrics Overview";
  const labels = safeArray(data?.labels).length ? data.labels : ["Q1", "Q2", "Q3", "Q4"];
  const values = safeArray(data?.values).length ? data.values.map(Number) : [45, 70, 92, 65];
  const maxVal = Math.max(...values, 100);

  const colors = ["#8b5cf6", "#06b6d4", "#ec4899", "#10b981", "#f59e0b"];

  return (
    <div style={{ background: "rgba(0,0,0,0.35)", padding: "14px", borderRadius: "12px", border: "1px solid rgba(255,255,255,0.15)", margin: "10px 0" }}>
      <div style={{ fontSize: "13px", fontWeight: "700", marginBottom: "10px", color: "#c084fc" }}>
        📊 {title} <span style={{ fontSize: "11px", opacity: 0.7 }}>({chartType.toUpperCase()} CHART)</span>
      </div>

      {chartType === "bar" && (
        <div style={{ display: "flex", alignItems: "flex-end", gap: "12px", height: "120px", padding: "10px 0 0" }}>
          {labels.map((lbl, idx) => {
            const val = values[idx] || 0;
            const heightPct = Math.min(100, Math.max(15, (val / maxVal) * 100));
            return (
              <div key={idx} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", height: "100%", justifyContent: "flex-end" }}>
                <div style={{ fontSize: "10px", fontWeight: "bold", marginBottom: "4px" }}>{val}</div>
                <div
                  style={{
                    width: "100%",
                    height: `${heightPct}%`,
                    background: colors[idx % colors.length],
                    borderRadius: "6px 6px 0 0",
                    transition: "height 0.3s ease",
                  }}
                />
                <div style={{ fontSize: "10px", opacity: 0.8, marginTop: "4px" }}>{lbl}</div>
              </div>
            );
          })}
        </div>
      )}

      {chartType === "pie" && (
        <div style={{ display: "flex", alignItems: "center", gap: "16px", padding: "10px 0" }}>
          <div
            style={{
              width: "90px",
              height: "90px",
              borderRadius: "50%",
              background: `conic-gradient(#8b5cf6 0% 35%, #06b6d4 35% 65%, #ec4899 65% 100%)`,
              boxShadow: "0 4px 10px rgba(0,0,0,0.4)",
            }}
          />
          <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
            {labels.map((lbl, idx) => (
              <div key={idx} style={{ display: "flex", alignItems: "center", gap: "6px", fontSize: "11px" }}>
                <span style={{ width: "10px", height: "10px", borderRadius: "50%", background: colors[idx % colors.length] }} />
                <span>{lbl}: <strong>{values[idx] || 0}</strong></span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

function FeatureFormattingBar({ pluginData, onChangeField, onRefineText }) {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        gap: 6,
        background: "rgba(255,255,255,0.03)",
        padding: "6px 8px",
        borderRadius: "6px",
        border: "1px solid rgba(255,255,255,0.08)",
        marginTop: 6,
        flexWrap: "wrap",
      }}
    >
      <div style={{ display: "flex", gap: 8, alignItems: "center", flexWrap: "wrap" }}>
        <div>
          <label style={{ fontSize: 9, color: "var(--text-muted)", display: "block" }}>Font Size (Pt):</label>
          <input
            type="number"
            min="10"
            max="60"
            value={pluginData?.font_size || 14}
            onChange={(e) => onChangeField("font_size", Number(e.target.value))}
            style={{ width: "60px", background: "rgba(0,0,0,0.4)", border: "1px solid var(--panel-border)", borderRadius: 4, padding: "2px 4px", color: "#fff", fontSize: 11 }}
          />
        </div>
        <div>
          <label style={{ fontSize: 9, color: "var(--text-muted)", display: "block" }}>Align:</label>
          <select
            value={pluginData?.alignment || pluginData?.align || "left"}
            onChange={(e) => {
              onChangeField("alignment", e.target.value);
              onChangeField("align", e.target.value);
            }}
            style={{ width: "70px", background: "rgba(0,0,0,0.4)", border: "1px solid var(--panel-border)", borderRadius: 4, padding: "2px 4px", color: "#fff", fontSize: 11 }}
          >
            <option value="left">Left</option>
            <option value="center">Center</option>
            <option value="right">Right</option>
            <option value="justify">Justify</option>
          </select>
        </div>
        <div>
          <label style={{ fontSize: 9, color: "var(--text-muted)", display: "block" }}>Top (in):</label>
          <input
            type="number"
            step="0.1"
            value={pluginData?.top ?? ""}
            onChange={(e) => onChangeField("top", e.target.value ? Number(e.target.value) : "")}
            placeholder="Auto"
            style={{ width: "55px", background: "rgba(0,0,0,0.4)", border: "1px solid var(--panel-border)", borderRadius: 4, padding: "2px 4px", color: "#fff", fontSize: 11 }}
          />
        </div>
        <div>
          <label style={{ fontSize: 9, color: "var(--text-muted)", display: "block" }}>Left (in):</label>
          <input
            type="number"
            step="0.1"
            value={pluginData?.left ?? ""}
            onChange={(e) => onChangeField("left", e.target.value ? Number(e.target.value) : "")}
            placeholder="Auto"
            style={{ width: "55px", background: "rgba(0,0,0,0.4)", border: "1px solid var(--panel-border)", borderRadius: 4, padding: "2px 4px", color: "#fff", fontSize: 11 }}
          />
        </div>
        <div>
          <label style={{ fontSize: 9, color: "var(--text-muted)", display: "block" }}>Width (in):</label>
          <input
            type="number"
            step="0.1"
            value={pluginData?.width ?? ""}
            onChange={(e) => onChangeField("width", e.target.value ? Number(e.target.value) : "")}
            placeholder="Auto"
            style={{ width: "55px", background: "rgba(0,0,0,0.4)", border: "1px solid var(--panel-border)", borderRadius: 4, padding: "2px 4px", color: "#fff", fontSize: 11 }}
          />
        </div>
      </div>

      {onRefineText ? (
        <button
          type="button"
          onClick={onRefineText}
          className="btn-ui primary sm"
          style={{ fontSize: 10, padding: "4px 10px", background: "linear-gradient(135deg, #8b5cf6, #ec4899)", border: "none", borderRadius: 6, cursor: "pointer" }}
        >
          ✨ AI Polish & Refine
        </button>
      ) : null}
    </div>
  );
}

export default function PresentationEditor({
  plan,
  activeSlideIndex,
  setActiveSlideIndex,
  selectedBgPreset,
  setSelectedBgPreset,
  customBgColor1,
  setCustomBgColor1,
  customBgColor2,
  setCustomBgColor2,
  customTextColor,
  setCustomTextColor,
  selectedBgConfig,
  downloadUrl,
  exportFormat,
  generatedMeta,
  handleDeckTitleChange,
  handleSlideTitleChange,
  handleSlideSubtitleChange,
  handleAddSlide,
  handleDuplicateSlide,
  handleDeleteSlide,
  handleMoveSlide,
  handlePluginTextChange,
  handleChartDataChange,
  handleAddBullet,
  handleDeleteBullet,
  handleAddPlugin,
  handleDeletePlugin,
  isPresenting,
  presenterSlideIndex,
  setPresenterSlideIndex,
  showPresenterNotes,
  setShowPresenterNotes,
  minutesFormatted,
  secondsFormatted,
  stopPresentationMode,
  onBackToSetup,
}) {
  const activeSlide = plan?.slides?.[activeSlideIndex];
  const presenterSlide = plan?.slides?.[presenterSlideIndex];

  const carouselRef = useRef(null);

  const scrollCarousel = (direction) => {
    if (carouselRef.current) {
      const scrollAmount = carouselRef.current.clientWidth * 0.8;
      carouselRef.current.scrollBy({
        left: direction === "left" ? -scrollAmount : scrollAmount,
        behavior: "smooth",
      });
    }
  };

  // Helper to dynamically fetch exact topic-matched HD Unsplash image via backend API
  const handleAutoUnsplashFetch = async (pIdx, query) => {
    const searchTopic = query || activeSlide?.title || "presentation visual";
    try {
      const res = await fetch(`http://localhost:8000/api/presentation/unsplash/search?query=${encodeURIComponent(searchTopic)}`);
      const data = await res.json();
      if (data?.url) {
        handlePluginTextChange(activeSlideIndex, pIdx, "url", data.url);
        handlePluginTextChange(activeSlideIndex, pIdx, "path", data.url);
        return;
      }
    } catch (err) {
      console.warn("Unsplash API fetch failed, using fallback topic search", err);
    }

    const fallbackUrl = `https://source.unsplash.com/featured/1000x600/?${encodeURIComponent(searchTopic)}`;
    handlePluginTextChange(activeSlideIndex, pIdx, "url", fallbackUrl);
    handlePluginTextChange(activeSlideIndex, pIdx, "path", fallbackUrl);
  };

  // Helper to use Gemini AI to refine, polish, or convert slide content into punchy bullets
  const handleAIRefine = async (pIdx, action = "bullets") => {
    const plugin = activeSlide?.plugins?.[pIdx];
    if (!plugin) return;
    const currentText = plugin.data?.text || safeArray(plugin.data?.points).join("\n") || plugin.data?.diagram || "";
    if (!currentText) return;

    try {
      const res = await fetch("http://localhost:8000/api/presentation/refine-slide", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: currentText, action }),
      });
      const data = await res.json();
      if (data?.refined_text) {
        if (plugin.type === "bullets") {
          const newPoints = data.refined_text.split("\n").map(s => s.replace(/^[•\-\*\d\.]+\s*/, "").trim()).filter(Boolean);
          handlePluginTextChange(activeSlideIndex, pIdx, "points", newPoints);
        } else {
          handlePluginTextChange(activeSlideIndex, pIdx, "text", data.refined_text);
          if (plugin.type === "diagram") {
            handlePluginTextChange(activeSlideIndex, pIdx, "diagram", data.refined_text);
          }
        }
      }
    } catch (err) {
      console.warn("AI Refine API call failed", err);
    }
  };

  return (
    <>
      <div className="card-box">
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14 }}>
          <div className="section-label" style={{ margin: 0 }}>Slide Navigation & Feature Editor</div>
          {onBackToSetup ? (
            <button className="btn-ui secondary sm" onClick={onBackToSetup}>
              ◀ Back to Topic Setup
            </button>
          ) : null}
        </div>

        {/* DECK TITLE BAR */}
        <div style={{ marginBottom: 16 }}>
          <label style={{ fontSize: 12, fontWeight: 700, color: "var(--text-muted)" }}>Presentation Deck Title:</label>
          <input
            type="text"
            value={plan?.title || ""}
            onChange={(e) => handleDeckTitleChange(e.target.value)}
            style={{
              width: "100%",
              background: "rgba(0,0,0,0.4)",
              border: "1px solid var(--accent)",
              borderRadius: 10,
              padding: "10px 14px",
              color: "#fff",
              fontWeight: 800,
              fontSize: 16,
              marginTop: 4,
            }}
          />
        </div>

        <div className="editor-workspace" style={{ display: "flex", flexDirection: "column", width: "100%", gap: 16 }}>
          {/* HORIZONTAL SLIDE SELECTION CAROUSEL BAR (ALWAYS FULL-WIDTH ON TOP) */}
          <div className="slide-navigation-bar" style={{ background: "rgba(15, 23, 42, 0.4)", border: "1px solid var(--panel-border)", borderRadius: 14, padding: 12, marginBottom: 16, overflow: "hidden", width: "100%", boxSizing: "border-box" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10, flexWrap: "wrap", gap: 8 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 10, flexWrap: "wrap" }}>
                <span style={{ fontSize: 13, fontWeight: 800, color: "#c084fc", letterSpacing: 0.5 }}>
                  🖼️ Presentation Slides ({plan?.slides?.length || 0})
                </span>
                <div style={{ display: "flex", gap: 4 }}>
                  <button className="btn-ui secondary sm" onClick={() => scrollCarousel("left")} title="Scroll Left (2 Slides)" style={{ padding: "3px 8px" }}>
                    ◀
                  </button>
                  <button className="btn-ui secondary sm" onClick={() => scrollCarousel("right")} title="Scroll Right (2 Slides)" style={{ padding: "3px 8px" }}>
                    ▶
                  </button>
                </div>
              </div>
              <button className="btn-ui primary sm" onClick={handleAddSlide} style={{ flexShrink: 0, padding: "5px 12px" }}>
                + Add New Slide
              </button>
            </div>

            <div className="slide-horizontal-carousel" ref={carouselRef}>
              {safeArray(plan?.slides).map((slideItem, idx) => (
                <div
                  key={idx}
                  className={`slide-tab-item ${activeSlideIndex === idx ? "active" : ""}`}
                  onClick={() => setActiveSlideIndex(idx)}
                >
                  <div>
                    <div className="slide-tab-number">Slide {idx + 1}</div>
                    <div className="slide-tab-title">{slideItem.title || "Untitled Slide"}</div>
                    {slideItem.subtitle ? (
                      <div style={{ fontSize: 10, color: "var(--text-muted)", marginTop: 2, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                        {slideItem.subtitle}
                      </div>
                    ) : null}
                  </div>

                  {/* REORDER / DELETE CONTROLS */}
                  <div style={{ display: "flex", gap: 4, marginTop: 10, width: "100%" }} onClick={(e) => e.stopPropagation()}>
                    <button
                      className="btn-ui secondary sm"
                      onClick={() => handleMoveSlide(idx, -1)}
                      disabled={idx === 0}
                      title="Move Left"
                      style={{ flex: 1, padding: "3px 6px", fontSize: 10, whiteSpace: "nowrap" }}
                    >
                      ← Left
                    </button>
                    <button
                      className="btn-ui secondary sm"
                      onClick={() => handleMoveSlide(idx, 1)}
                      disabled={idx === (plan?.slides?.length || 0) - 1}
                      title="Move Right"
                      style={{ flex: 1, padding: "3px 6px", fontSize: 10, whiteSpace: "nowrap" }}
                    >
                      Right →
                    </button>
                    <button
                      className="btn-ui danger sm"
                      onClick={() => handleDeleteSlide(idx)}
                      title="Delete Slide"
                      style={{ padding: "3px 8px", fontSize: 11 }}
                    >
                      🗑️
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
           
          {/* SELECTED SLIDE FEATURE INSPECTOR & CANVAS PREVIEW (ALWAYS BELOW SLIDE CAROUSEL) */}
          {activeSlide ? (
            <div className="feature-inspector-container" style={{ display: "flex", flexDirection: "column", width: "100%", gap: 16 }}>
              {/* TOP SLIDE TOOLBAR & CUSTOM COLOR PICKER */}
              <div style={{ display: "flex", flexDirection: "column", gap: 10, background: "rgba(255,255,255,0.03)", padding: 12, borderRadius: 12, border: "1px solid var(--panel-border)" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                    <span style={{ fontSize: 12, fontWeight: 700, color: "#c084fc" }}>Slide Theme BG:</span>
                    <select
                      value={selectedBgPreset}
                      onChange={(e) => setSelectedBgPreset(e.target.value)}
                      style={{ background: "rgba(0,0,0,0.4)", border: "1px solid var(--panel-border)", color: "#fff", borderRadius: 8, padding: "4px 8px", fontSize: 12 }}
                    >
                      {BACKGROUND_PRESETS.map((bg) => (
                        <option key={bg.id} value={bg.id}>
                          {bg.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div style={{ display: "flex", gap: 6, flexWrap: "wrap", alignItems: "center" }}>
                    {downloadUrl ? (
                      <a
                        className="btn-ui primary sm"
                        href={downloadUrl}
                        target="_blank"
                        rel="noreferrer"
                        style={{ background: "linear-gradient(135deg, #10b981, #059669)", border: "none" }}
                      >
                        Download
                      </a>
                    ) : null}
                    <button className="btn-ui secondary sm" onClick={() => handleDuplicateSlide(activeSlideIndex)}>
                      📋Duplicate Slide
                    </button>
                    <button className="btn-ui danger sm" onClick={() => handleDeleteSlide(activeSlideIndex)}>
                      🗑️
                    </button>
                  </div>
                </div>

                {/* CUSTOM PALETTE PICKERS */}
                {selectedBgPreset === "custom" && (
                  <div style={{ display: "flex", gap: 12, alignItems: "center", paddingTop: 6, borderTop: "1px dashed rgba(255,255,255,0.1)" }}>
                    <label style={{ fontSize: 11, color: "var(--text-muted)", display: "flex", alignItems: "center", gap: 4 }}>
                      BG Start:
                      <input type="color" value={customBgColor1} onChange={(e) => setCustomBgColor1(e.target.value)} style={{ border: "none", width: 24, height: 24, borderRadius: 4, cursor: "pointer" }} />
                    </label>
                    <label style={{ fontSize: 11, color: "var(--text-muted)", display: "flex", alignItems: "center", gap: 4 }}>
                      BG End:
                      <input type="color" value={customBgColor2} onChange={(e) => setCustomBgColor2(e.target.value)} style={{ border: "none", width: 24, height: 24, borderRadius: 4, cursor: "pointer" }} />
                    </label>
                    <label style={{ fontSize: 11, color: "var(--text-muted)", display: "flex", alignItems: "center", gap: 4 }}>
                      Text Color:
                      <input type="color" value={customTextColor} onChange={(e) => setCustomTextColor(e.target.value)} style={{ border: "none", width: 24, height: 24, borderRadius: 4, cursor: "pointer" }} />
                    </label>
                  </div>
                )}
              </div>
              
              {/* 16:9 LIVE CANVAS DISPLAY */}
              <div
                className="slide-canvas-box"
                style={{ background: selectedBgConfig.bg, color: selectedBgConfig.text }}
              >
                <div>
                  <div style={{ fontSize: 11, fontWeight: "800", opacity: 0.6, letterSpacing: 1 }}>
                    SLIDE {activeSlideIndex + 1} OF {plan.slides.length}
                  </div>
                  <h2 style={{ fontSize: 26, margin: "6px 0 4px", fontWeight: 800 }}>
                    {activeSlide.title || "Slide Title"}
                  </h2>
                  {activeSlide.subtitle ? (
                    <div style={{ fontSize: 15, opacity: 0.8, fontWeight: 600 }}>{activeSlide.subtitle}</div>
                  ) : null}
                </div>
                
                {/* LIVE PLUGINS CONTENT */}
                <div style={{ flex: 1, overflowY: "auto", margin: "16px 0", display: "flex", flexDirection: "column", gap: 10 }}>
                  {safeArray(activeSlide.plugins).map((p, pIdx) => (
                    <div key={pIdx}>
                      {p.type === "subtitle" ? (
                        <h3 style={{ fontSize: p.data?.font_size || 18, textAlign: p.data?.alignment || "left", color: "#c084fc", margin: "4px 0" }}>
                          {p.data?.text}
                        </h3>
                      ) : null}

                      {p.type === "paragraph" ? (
                        <p style={{ fontSize: p.data?.font_size || 14, textAlign: p.data?.alignment || "left", lineHeight: 1.5, opacity: 0.9 }}>
                          {p.data?.text}
                        </p>
                      ) : null}

                      {p.type === "bullets" ? (
                        <ul style={{ paddingLeft: 20, margin: "4px 0", textAlign: p.data?.alignment || "left" }}>
                          {safeArray(p.data?.points).map((pt, bIdx) => (
                            <li key={bIdx} style={{ fontSize: p.data?.font_size || 14, marginBottom: 4 }}>{pt}</li>
                          ))}
                        </ul>
                      ) : null}

                      {p.type === "chart" ? (
                        <VisualChartPreview data={p.data} />
                      ) : null}

                      {p.type === "image" ? (
                        <div style={{ textAlign: p.data?.align || p.data?.alignment || "center", margin: "8px 0" }}>
                          {p.data?.url || p.data?.path ? (
                            <img
                              src={p.data.url || p.data.path}
                              alt="Slide media"
                              style={{ maxHeight: 180, borderRadius: 10, border: "1px solid rgba(255,255,255,0.2)" }}
                            />
                          ) : null}
                          {p.data?.caption ? (
                            <div style={{ fontSize: 11, opacity: 0.7, marginTop: 4 }}>{p.data.caption}</div>
                          ) : null}
                        </div>
                      ) : null}

                      {p.type === "stat" ? (
                        <div style={{ display: "flex", alignItems: "baseline", gap: 10, margin: "8px 0" }}>
                          <span style={{ fontSize: p.data?.font_size || 36, fontWeight: 900, color: "#c084fc" }}>{p.data?.number}</span>
                          <span style={{ fontSize: 14, fontWeight: 600, opacity: 0.85 }}>{p.data?.label}</span>
                        </div>
                      ) : null}

                      {p.type === "diagram" ? (
                        (() => {
                          const diagType = String(p.data?.diagram_type || "flowchart").toLowerCase();
                          const textRaw = p.data?.diagram || p.data?.text || "[Input] ➔ [Processing] ➔ [Output]";
                          const steps = textRaw.split(/➔|->|→/).map(s => s.trim()).filter(Boolean);
                          
                          const headers = {
                            flowchart: "🔄 PROCESS & WORKFLOW DIAGRAM",
                            architecture: "🏛️ SYSTEM ARCHITECTURE STACK",
                            timeline: "📅 TIMELINE & ROADMAP MILESTONES",
                            io_cards: "📥 INPUT  │  ⚙️ PROCESSING  │  📤 OUTPUT",
                            mindmap: "🧠 CONCEPT & CATEGORY MAP",
                          };
                          const headerTitle = headers[diagType] || "⚙️ SYSTEM ARCHITECTURE & PROCESS FLOW";

                          return (
                            <div style={{ background: "rgba(192, 132, 252, 0.12)", border: "1px dashed rgba(192, 132, 252, 0.5)", borderRadius: 10, padding: 12, textAlign: p.data?.alignment || "center", margin: "8px 0" }}>
                              <div style={{ fontSize: 11, fontWeight: 800, color: "#c084fc", marginBottom: 8, letterSpacing: 0.5 }}>
                                {headerTitle}
                              </div>
                              
                              {diagType === "flowchart" && (
                                <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 8, flexWrap: "wrap" }}>
                                  {steps.map((step, sIdx) => (
                                    <React.Fragment key={sIdx}>
                                      <div style={{ background: "rgba(0,0,0,0.4)", border: "1px solid #c084fc", borderRadius: 6, padding: "6px 12px", fontSize: p.data?.font_size || 12, fontWeight: 700, color: "#fff" }}>
                                        {step}
                                      </div>
                                      {sIdx < steps.length - 1 && <span style={{ color: "#c084fc", fontSize: 16 }}>➔</span>}
                                    </React.Fragment>
                                  ))}
                                </div>
                              )}

                              {diagType === "architecture" && (
                                <div style={{ display: "flex", flexDirection: "column", gap: 6, maxWidth: "85%", margin: "0 auto" }}>
                                  {steps.map((step, sIdx) => (
                                    <div key={sIdx} style={{ background: "rgba(192, 132, 252, 0.2)", border: "1px solid #c084fc", borderRadius: 6, padding: "6px 12px", fontSize: p.data?.font_size || 12, fontWeight: 700, textAlign: "center", color: "#fff" }}>
                                      Layer {sIdx + 1}: {step}
                                    </div>
                                  ))}
                                </div>
                              )}

                              {diagType === "timeline" && (
                                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 8, overflowX: "auto", padding: "4px 0" }}>
                                  {steps.map((step, sIdx) => (
                                    <div key={sIdx} style={{ flex: 1, background: "rgba(0,0,0,0.4)", borderTop: "3px solid #c084fc", borderRadius: "0 0 6px 6px", padding: 8, fontSize: p.data?.font_size || 12, textAlign: "center", color: "#fff" }}>
                                      <div style={{ fontSize: 10, color: "#c084fc", fontWeight: 800 }}>PHASE {sIdx + 1}</div>
                                      <div style={{ fontWeight: 600 }}>{step}</div>
                                    </div>
                                  ))}
                                </div>
                              )}

                              {diagType === "io_cards" && (
                                <div style={{ display: "grid", gridTemplateColumns: steps.length === 3 ? "1fr 1fr 1fr" : "repeat(auto-fit, minmax(100px, 1fr))", gap: 8 }}>
                                  {steps.map((step, sIdx) => {
                                    const colLabels = ["INPUT", "PROCESS", "OUTPUT"];
                                    return (
                                      <div key={sIdx} style={{ background: "rgba(0,0,0,0.5)", border: "1px solid rgba(255,255,255,0.15)", borderRadius: 8, padding: 8, textAlign: "center" }}>
                                        <div style={{ fontSize: 10, fontWeight: 800, color: "#c084fc", marginBottom: 2 }}>
                                          {colLabels[sIdx] || `STEP ${sIdx + 1}`}
                                        </div>
                                        <div style={{ fontSize: p.data?.font_size || 12, color: "#fff", fontWeight: 600 }}>{step}</div>
                                      </div>
                                    );
                                  })}
                                </div>
                              )}

                              {diagType === "mindmap" && (
                                <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 6 }}>
                                  <div style={{ background: "#c084fc", color: "#000", fontWeight: 800, padding: "4px 14px", borderRadius: 20, fontSize: 12 }}>
                                    {steps[0] || "Core Concept"}
                                  </div>
                                  {steps.length > 1 && <div style={{ width: 2, height: 12, background: "#c084fc" }} />}
                                  <div style={{ display: "flex", gap: 8, flexWrap: "wrap", justifyContent: "center" }}>
                                    {steps.slice(1).map((subStep, sIdx) => (
                                      <div key={sIdx} style={{ background: "rgba(0,0,0,0.4)", border: "1px solid #c084fc", borderRadius: 12, padding: "4px 10px", fontSize: p.data?.font_size || 12, color: "#fff" }}>
                                        {subStep}
                                      </div>
                                    ))}
                                  </div>
                                </div>
                              )}
                            </div>
                          );
                        })()
                      ) : null}

                      {p.type === "table" ? (
                        <div style={{ overflowX: "auto", margin: "8px 0" }}>
                          <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 11, background: "rgba(0,0,0,0.35)", borderRadius: 8, overflow: "hidden", border: "1px solid rgba(255,255,255,0.12)" }}>
                            {safeArray(p.data?.headers).length > 0 && (
                              <thead>
                                <tr style={{ background: "rgba(192, 132, 252, 0.25)" }}>
                                  {p.data.headers.map((h, hIdx) => (
                                    <th key={hIdx} style={{ padding: "6px 10px", textAlign: "left", borderBottom: "1px solid rgba(255,255,255,0.15)", fontWeight: 700, color: "#c084fc" }}>{h}</th>
                                  ))}
                                </tr>
                              </thead>
                            )}
                            <tbody>
                              {safeArray(p.data?.rows).map((row, rIdx) => (
                                <tr key={rIdx} style={{ borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
                                  {safeArray(row).map((cell, cIdx) => (
                                    <td key={cIdx} style={{ padding: "6px 10px", opacity: 0.9 }}>{cell}</td>
                                  ))}
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      ) : null}
                    </div>
                  ))}
                </div>
                
                {/* SPEAKER NOTES DISPLAY */}
                {activeSlide.plugins?.find((p) => p.type === "notes") ? (
                  <div style={{ background: "rgba(0,0,0,0.3)", padding: 8, borderRadius: 8, fontSize: 11, color: "rgba(255,255,255,0.8)" }}>
                    🗣️ Notes: {activeSlide.plugins.find((p) => p.type === "notes")?.data?.notes}
                  </div>
                ) : null}
              </div>
               {/* ADD FEATURE TOOLBAR */}
                <div className="add-feature-bar">
                  <span style={{ fontSize: 12, fontWeight: 700, color: "var(--text-muted)", width: "100%", marginBottom: 4 }}>
                    ➕ Add Feature Element to Slide {activeSlideIndex + 1}:
                  </span>
                  <button className="btn-ui secondary sm" onClick={() => handleAddPlugin(activeSlideIndex, "subtitle")}>
                    📝 + Subtitle
                  </button>
                  <button className="btn-ui secondary sm" onClick={() => handleAddPlugin(activeSlideIndex, "chart")}>
                    📊 + Chart Block
                  </button>
                  <button className="btn-ui secondary sm" onClick={() => handleAddPlugin(activeSlideIndex, "image")}>
                    🖼️ + Image Block
                  </button>
                  <button className="btn-ui secondary sm" onClick={() => handleAddPlugin(activeSlideIndex, "bullets")}>
                    • + Bullet Points
                  </button>
                  <button className="btn-ui secondary sm" onClick={() => handleAddPlugin(activeSlideIndex, "paragraph")}>
                    📄 + Paragraph
                  </button>
                  <button className="btn-ui secondary sm" onClick={() => handleAddPlugin(activeSlideIndex, "stat")}>
                    📈 + Stat Metric
                  </button>
                  <button className="btn-ui secondary sm" onClick={() => handleAddPlugin(activeSlideIndex, "diagram")}>
                    ⚙️ + Diagram Flow
                  </button>
                  <button className="btn-ui secondary sm" onClick={() => handleAddPlugin(activeSlideIndex, "table")}>
                    📋 + Data Table
                  </button>
                  <button className="btn-ui secondary sm" onClick={() => handleAddPlugin(activeSlideIndex, "notes")}>
                    🗣️ + Speaker Notes
                  </button>
                </div>
              {/* SLIDE BASIC PROPERTIES */}
              <div className="card-box" style={{ background: "rgba(0,0,0,0.3)" }}>
                <div style={{ fontWeight: 800, fontSize: 13, color: "#c084fc", marginBottom: 10 }}>
                  ✏️ Edit Slide {activeSlideIndex + 1} General Info:
                </div>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
                  <div>
                    <label style={{ fontSize: 11, fontWeight: 700, color: "var(--text-muted)" }}>Slide Main Title:</label>
                    <input
                      type="text"
                      value={activeSlide.title || ""}
                      onChange={(e) => handleSlideTitleChange(activeSlideIndex, e.target.value)}
                      style={{ width: "100%", background: "rgba(0,0,0,0.4)", border: "1px solid var(--panel-border)", borderRadius: 8, padding: 8, color: "#fff", fontSize: 13 }}
                    />
                  </div>
                  <div>
                    <label style={{ fontSize: 11, fontWeight: 700, color: "var(--text-muted)" }}>Slide Subtitle / Tagline:</label>
                    <input
                      type="text"
                      value={activeSlide.subtitle || ""}
                      onChange={(e) => handleSlideSubtitleChange(activeSlideIndex, e.target.value)}
                      placeholder="e.g. Overview & Key Metrics"
                      style={{ width: "100%", background: "rgba(0,0,0,0.4)", border: "1px solid var(--panel-border)", borderRadius: 8, padding: 8, color: "#fff", fontSize: 13 }}
                    />
                  </div>
                </div>
              </div>
               
              {/* EDITABLE FEATURE BLOCKS LIST */}
              <div>
                <div style={{ fontWeight: 800, fontSize: 13, color: "#c084fc", marginBottom: 10 }}>
                  🧩 Edit Feature Blocks on Slide {activeSlideIndex + 1}:
                </div>

                {safeArray(activeSlide.plugins).map((plugin, pIdx) => (
                  <div key={pIdx} className="feature-block-card">
                    <div className="feature-block-header">
                      <span>
                        {plugin.type === "subtitle" && "📝 Subtitle Block"}
                        {plugin.type === "chart" && "📊 Visual Chart Block"}
                        {plugin.type === "image" && "🖼️ Image Block"}
                        {plugin.type === "bullets" && "• Bullet Points Block"}
                        {plugin.type === "paragraph" && "📄 Paragraph Block"}
                        {plugin.type === "stat" && "📊 Key Metric / Stat"}
                        {plugin.type === "diagram" && "⚙️ Diagram Flow Block"}
                        {plugin.type === "table" && "📋 Comparison Table Block"}
                        {plugin.type === "notes" && "🗣️ Speaker Notes"}
                      </span>
                      <button
                        className="btn-ui danger sm"
                        onClick={() => handleDeletePlugin(activeSlideIndex, pIdx)}
                      >
                        × Remove Feature
                      </button>
                    </div>

                    {/* SUBTITLE */}
                    {plugin.type === "subtitle" ? (
                      <div>
                        <input
                          type="text"
                          value={plugin.data?.text || ""}
                          onChange={(e) => handlePluginTextChange(activeSlideIndex, pIdx, "text", e.target.value)}
                          placeholder="Enter section subtitle text..."
                          style={{ width: "100%", background: "rgba(0,0,0,0.4)", border: "1px solid var(--panel-border)", borderRadius: 8, padding: 8, color: "#fff", fontSize: 13 }}
                        />
                        <FeatureFormattingBar
                          pluginData={plugin.data}
                          onChangeField={(fld, val) => handlePluginTextChange(activeSlideIndex, pIdx, fld, val)}
                          onRefineText={() => handleAIRefine(pIdx, "headline")}
                        />
                      </div>
                    ) : null}

                    {/* DIAGRAM FEATURE BLOCK EDITOR */}
                    {plugin.type === "diagram" ? (
                      <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                        <div>
                          <label style={{ fontSize: 11, color: "var(--text-muted)", display: "block", marginBottom: 2 }}>Diagram Style / Type:</label>
                          <select
                            value={plugin.data?.diagram_type || "flowchart"}
                            onChange={(e) => handlePluginTextChange(activeSlideIndex, pIdx, "diagram_type", e.target.value)}
                            style={{ width: "100%", background: "rgba(0,0,0,0.4)", border: "1px solid var(--panel-border)", borderRadius: 8, padding: 6, color: "#fff", fontSize: 12 }}
                          >
                            <option value="flowchart">🔄 Flowchart (Process Flow)</option>
                            <option value="architecture">🏛️ Architecture Stack (Multi-Tier)</option>
                            <option value="timeline">📅 Timeline Roadmap (Milestones)</option>
                            <option value="io_cards">📥 Input/Output Cards (3-Column)</option>
                            <option value="mindmap">🧠 Mindmap (Category Tree)</option>
                          </select>
                        </div>

                        <div>
                          <label style={{ fontSize: 11, color: "var(--text-muted)", display: "block", marginBottom: 2 }}>Diagram Workflow Text (use ➔ to separate steps):</label>
                          <input
                            type="text"
                            value={plugin.data?.diagram || plugin.data?.text || ""}
                            onChange={(e) => {
                              handlePluginTextChange(activeSlideIndex, pIdx, "diagram", e.target.value);
                              handlePluginTextChange(activeSlideIndex, pIdx, "text", e.target.value);
                            }}
                            placeholder="[Input] ➔ [Processing] ➔ [Model] ➔ [Output]"
                            style={{ width: "100%", background: "rgba(0,0,0,0.4)", border: "1px solid var(--panel-border)", borderRadius: 8, padding: 8, color: "#fff", fontSize: 13 }}
                          />
                        </div>

                        <FeatureFormattingBar
                          pluginData={plugin.data}
                          onChangeField={(fld, val) => handlePluginTextChange(activeSlideIndex, pIdx, fld, val)}
                          onRefineText={() => handleAIRefine(pIdx, "bullets")}
                        />
                      </div>
                    ) : null}

                    {/* TABLE */}
                    {plugin.type === "table" ? (
                      <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                        <div>
                          <label style={{ fontSize: 11, color: "var(--text-muted)" }}>Table Title:</label>
                          <input
                            type="text"
                            value={plugin.data?.title || ""}
                            onChange={(e) => handlePluginTextChange(activeSlideIndex, pIdx, "title", e.target.value)}
                            placeholder="Feature Comparison Matrix"
                            style={{ width: "100%", background: "rgba(0,0,0,0.4)", border: "1px solid var(--panel-border)", borderRadius: 8, padding: 6, color: "#fff", fontSize: 12 }}
                          />
                        </div>
                        <div>
                          <label style={{ fontSize: 11, color: "var(--text-muted)" }}>Headers (comma separated):</label>
                          <input
                            type="text"
                            value={safeArray(plugin.data?.headers).join(", ")}
                            onChange={(e) => handleChartDataChange(activeSlideIndex, pIdx, "headers", e.target.value)}
                            placeholder="Criterion, Solution A, Solution B"
                            style={{ width: "100%", background: "rgba(0,0,0,0.4)", border: "1px solid var(--panel-border)", borderRadius: 8, padding: 6, color: "#fff", fontSize: 12 }}
                          />
                        </div>
                        <FeatureFormattingBar
                          pluginData={plugin.data}
                          onChangeField={(fld, val) => handlePluginTextChange(activeSlideIndex, pIdx, fld, val)}
                        />
                      </div>
                    ) : null}

                    {/* CHART PLUGIN EDITOR */}
                    {plugin.type === "chart" ? (
                      <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                        <div style={{ display: "grid", gridTemplateColumns: "1fr 2fr", gap: 8 }}>
                          <div>
                            <label style={{ fontSize: 11, color: "var(--text-muted)" }}>Chart Type:</label>
                            <select
                              value={plugin.data?.chart_type || "bar"}
                              onChange={(e) => handlePluginTextChange(activeSlideIndex, pIdx, "chart_type", e.target.value)}
                              style={{ width: "100%", background: "rgba(0,0,0,0.4)", border: "1px solid var(--panel-border)", borderRadius: 8, padding: 6, color: "#fff", fontSize: 12 }}
                            >
                              <option value="bar">Bar Chart</option>
                              <option value="pie">Pie Chart</option>
                            </select>
                          </div>
                          <div>
                            <label style={{ fontSize: 11, color: "var(--text-muted)" }}>Chart Title:</label>
                            <input
                              type="text"
                              value={plugin.data?.title || ""}
                              onChange={(e) => handlePluginTextChange(activeSlideIndex, pIdx, "title", e.target.value)}
                              placeholder="e.g. Annual Revenue Growth"
                              style={{ width: "100%", background: "rgba(0,0,0,0.4)", border: "1px solid var(--panel-border)", borderRadius: 8, padding: 6, color: "#fff", fontSize: 12 }}
                            />
                          </div>
                        </div>
                        <div>
                          <label style={{ fontSize: 11, color: "var(--text-muted)" }}>Labels (comma separated):</label>
                          <input
                            type="text"
                            value={safeArray(plugin.data?.labels).join(", ")}
                            onChange={(e) => handleChartDataChange(activeSlideIndex, pIdx, "labels", e.target.value)}
                            placeholder="Q1, Q2, Q3, Q4"
                            style={{ width: "100%", background: "rgba(0,0,0,0.4)", border: "1px solid var(--panel-border)", borderRadius: 8, padding: 6, color: "#fff", fontSize: 12 }}
                          />
                        </div>
                        <div>
                          <label style={{ fontSize: 11, color: "var(--text-muted)" }}>Data Values (comma separated numbers):</label>
                          <input
                            type="text"
                            value={safeArray(plugin.data?.values).join(", ")}
                            onChange={(e) => handleChartDataChange(activeSlideIndex, pIdx, "values", e.target.value)}
                            placeholder="40, 65, 85, 95"
                            style={{ width: "100%", background: "rgba(0,0,0,0.4)", border: "1px solid var(--panel-border)", borderRadius: 8, padding: 6, color: "#fff", fontSize: 12 }}
                          />
                        </div>
                        <FeatureFormattingBar
                          pluginData={plugin.data}
                          onChangeField={(fld, val) => handlePluginTextChange(activeSlideIndex, pIdx, fld, val)}
                        />
                      </div>
                    ) : null}

                    {/* IMAGE */}
                    {plugin.type === "image" ? (
                      <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                        <div>
                          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 2 }}>
                            <label style={{ fontSize: 11, color: "var(--text-muted)" }}>Image URL / Path:</label>
                            <button
                              type="button"
                              className="btn-ui primary sm"
                              style={{ fontSize: 10, padding: "2px 8px" }}
                              onClick={() => handleAutoUnsplashFetch(pIdx, plugin.data?.caption)}
                            >
                              ⚡ Auto Unsplash Image
                            </button>
                          </div>
                          <input
                            type="text"
                            value={plugin.data?.url || plugin.data?.path || ""}
                            onChange={(e) => {
                              handlePluginTextChange(activeSlideIndex, pIdx, "url", e.target.value);
                              handlePluginTextChange(activeSlideIndex, pIdx, "path", e.target.value);
                            }}
                            placeholder="https://images.unsplash.com/..."
                            style={{ width: "100%", background: "rgba(0,0,0,0.4)", border: "1px solid var(--panel-border)", borderRadius: 8, padding: 8, color: "#fff", fontSize: 12 }}
                          />
                        </div>

                        <div>
                          <label style={{ fontSize: 11, color: "var(--text-muted)" }}>Image Caption / Title:</label>
                          <input
                            type="text"
                            value={plugin.data?.caption || ""}
                            onChange={(e) => handlePluginTextChange(activeSlideIndex, pIdx, "caption", e.target.value)}
                            placeholder="e.g. AI Architecture Diagram"
                            style={{ width: "100%", background: "rgba(0,0,0,0.4)", border: "1px solid var(--panel-border)", borderRadius: 8, padding: 8, color: "#fff", fontSize: 12 }}
                          />
                        </div>

                        <FeatureFormattingBar
                          pluginData={plugin.data}
                          onChangeField={(fld, val) => handlePluginTextChange(activeSlideIndex, pIdx, fld, val)}
                        />
                      </div>
                    ) : null}

                    {/* BULLETS */}
                    {plugin.type === "bullets" ? (
                      <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                        {safeArray(plugin.data?.points).map((bullet, bIdx) => (
                          <div key={bIdx} style={{ display: "flex", gap: 6, alignItems: "center" }}>
                            <span style={{ color: "#c084fc" }}>•</span>
                            <input
                              type="text"
                              value={bullet}
                              onChange={(e) => handlePluginTextChange(activeSlideIndex, pIdx, "points", e.target.value, bIdx)}
                              style={{ flex: 1, background: "rgba(0,0,0,0.4)", border: "1px solid var(--panel-border)", borderRadius: 6, padding: 6, color: "#fff", fontSize: 13 }}
                            />
                            <button className="btn-ui danger sm" onClick={() => handleDeleteBullet(activeSlideIndex, pIdx, bIdx)}>
                              ×
                            </button>
                          </div>
                        ))}
                        <button className="btn-ui secondary sm" style={{ alignSelf: "flex-start", marginTop: 4 }} onClick={() => handleAddBullet(activeSlideIndex, pIdx)}>
                          + Add Bullet Point
                        </button>
                        <FeatureFormattingBar
                          pluginData={plugin.data}
                          onChangeField={(fld, val) => handlePluginTextChange(activeSlideIndex, pIdx, fld, val)}
                          onRefineText={() => handleAIRefine(pIdx, "bullets")}
                        />
                      </div>
                    ) : null}

                    {/* PARAGRAPH */}
                    {plugin.type === "paragraph" ? (
                      <div>
                        <textarea
                          value={plugin.data?.text || ""}
                          onChange={(e) => handlePluginTextChange(activeSlideIndex, pIdx, "text", e.target.value)}
                          rows={3}
                          placeholder="Enter paragraph text..."
                          style={{ width: "100%", background: "rgba(0,0,0,0.4)", border: "1px solid var(--panel-border)", borderRadius: 8, padding: 8, color: "#fff", fontSize: 13 }}
                        />
                        <FeatureFormattingBar
                          pluginData={plugin.data}
                          onChangeField={(fld, val) => handlePluginTextChange(activeSlideIndex, pIdx, fld, val)}
                          onRefineText={() => handleAIRefine(pIdx, "summarize")}
                        />
                      </div>
                    ) : null}

                    {/* STAT */}
                    {plugin.type === "stat" ? (
                      <div>
                        <div style={{ display: "grid", gridTemplateColumns: "1fr 2fr", gap: 8 }}>
                          <input
                            type="text"
                            value={plugin.data?.number || ""}
                            onChange={(e) => handlePluginTextChange(activeSlideIndex, pIdx, "number", e.target.value)}
                            placeholder="e.g. 95% or $2.5M"
                            style={{ background: "rgba(0,0,0,0.4)", border: "1px solid var(--panel-border)", borderRadius: 8, padding: 8, color: "#c084fc", fontWeight: 800, fontSize: 14 }}
                          />
                          <input
                            type="text"
                            value={plugin.data?.label || ""}
                            onChange={(e) => handlePluginTextChange(activeSlideIndex, pIdx, "label", e.target.value)}
                            placeholder="e.g. Enterprise Accuracy Growth"
                            style={{ background: "rgba(0,0,0,0.4)", border: "1px solid var(--panel-border)", borderRadius: 8, padding: 8, color: "#fff", fontSize: 13 }}
                          />
                        </div>
                        <FeatureFormattingBar
                          pluginData={plugin.data}
                          onChangeField={(fld, val) => handlePluginTextChange(activeSlideIndex, pIdx, fld, val)}
                        />
                      </div>
                    ) : null}

                    {/* SPEAKER NOTES */}
                    {plugin.type === "notes" ? (
                      <textarea
                        value={plugin.data?.notes || ""}
                        onChange={(e) => handlePluginTextChange(activeSlideIndex, pIdx, "notes", e.target.value)}
                        rows={2}
                        placeholder="Enter speaker notes for narration..."
                        style={{ width: "100%", background: "rgba(0,0,0,0.4)", border: "1px solid var(--panel-border)", borderRadius: 8, padding: 8, color: "#fff", fontSize: 12 }}
                      />
                    ) : null}
                  </div>
                ))}

               
              </div>
            </div>
          ) : null}
        </div>
      </div>

      {/* FULLSCREEN PRESENTER OVERLAY 📺 */}
      {isPresenting && presenterSlide ? (
        <div className="presenter-overlay">
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <div style={{ color: "#c084fc", fontWeight: "bold", fontSize: 14 }}>
              Slide {presenterSlideIndex + 1} of {plan.slides.length} | Timer: {minutesFormatted}:{secondsFormatted}
            </div>
            <div style={{ display: "flex", gap: 10 }}>
              <button
                className="btn-ui primary sm"
                onClick={() => {
                  const noteText = presenterSlide.plugins?.find((p) => p.type === "notes")?.data?.notes || presenterSlide.title;
                  if (window.speechSynthesis) {
                    window.speechSynthesis.cancel();
                    const utt = new SpeechSynthesisUtterance(noteText);
                    window.speechSynthesis.speak(utt);
                  }
                }}
                style={{ background: "linear-gradient(135deg, #10b981, #06b6d4)", border: "none" }}
              >
                🗣️ Play AI Voiceover
              </button>
              <button
                className="btn-ui secondary sm"
                onClick={() => setShowPresenterNotes(!showPresenterNotes)}
              >
                {showPresenterNotes ? "Hide Notes" : "Show Notes"}
              </button>
              <button className="btn-ui danger sm" onClick={() => {
                if (window.speechSynthesis) window.speechSynthesis.cancel();
                stopPresentationMode();
              }}>
                ✕ Exit (Esc)
              </button>
            </div>
          </div>

          <div className="presenter-canvas">
            <div
              style={{
                background: selectedBgConfig.bg,
                color: selectedBgConfig.text,
                borderRadius: 20,
                padding: 60,
                minHeight: 500,
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
              }}
            >
              <h1 style={{ fontSize: 42, margin: "0 0 10px" }}>{presenterSlide.title}</h1>
              {presenterSlide.subtitle ? (
                <h3 style={{ fontSize: 24, opacity: 0.8, marginBottom: 20 }}>{presenterSlide.subtitle}</h3>
              ) : null}

              {safeArray(presenterSlide.plugins).map((plugin, pIdx) => (
                <div key={pIdx} style={{ fontSize: 22, lineHeight: 1.6, marginBottom: 14 }}>
                  {plugin.type === "subtitle" ? (
                    <h3 style={{ fontSize: plugin.data?.font_size || 24, textAlign: plugin.data?.alignment || "left", color: "#c084fc" }}>{plugin.data?.text}</h3>
                  ) : null}
                  {plugin.type === "paragraph" ? <p style={{ fontSize: plugin.data?.font_size || 22, textAlign: plugin.data?.alignment || "left" }}>{plugin.data?.text}</p> : null}
                  {plugin.type === "bullets" ? (
                    <ul style={{ paddingLeft: 24, textAlign: plugin.data?.alignment || "left" }}>
                      {safeArray(plugin.data?.points).map((pt, bIdx) => (
                        <li key={bIdx} style={{ fontSize: plugin.data?.font_size || 22 }}>{pt}</li>
                      ))}
                    </ul>
                  ) : null}
                  {plugin.type === "chart" ? (
                    <VisualChartPreview data={plugin.data} />
                  ) : null}
                  {plugin.type === "image" && (plugin.data?.url || plugin.data?.path) ? (
                    <div style={{ textAlign: plugin.data?.align || plugin.data?.alignment || "center" }}>
                      <img src={plugin.data.url || plugin.data.path} alt="slide visual" style={{ maxHeight: 240, borderRadius: 12 }} />
                      {plugin.data?.caption ? <div style={{ fontSize: 14, opacity: 0.7 }}>{plugin.data.caption}</div> : null}
                    </div>
                  ) : null}
                  {plugin.type === "stat" ? (
                    <div style={{ fontSize: plugin.data?.font_size || 50, fontWeight: "bold", color: "#c084fc" }}>
                      {plugin.data?.number} <span style={{ fontSize: 24 }}>{plugin.data?.label}</span>
                    </div>
                  ) : null}
                </div>
              ))}
            </div>

            {showPresenterNotes ? (
              <div
                style={{
                  marginTop: 20,
                  background: "rgba(255,255,255,0.08)",
                  borderRadius: 12,
                  padding: 16,
                  color: "#e2e8f0",
                  fontSize: 14,
                }}
              >
                <strong>🗣️ Presenter Notes:</strong>{" "}
                {presenterSlide.plugins?.find((p) => p.type === "notes")?.data?.notes || "No notes for this slide."}
              </div>
            ) : null}
          </div>

          <div style={{ display: "flex", justifyContent: "center", gap: 16 }}>
            <button
              className="btn-ui secondary"
              onClick={() => setPresenterSlideIndex((i) => Math.max(0, i - 1))}
              disabled={presenterSlideIndex === 0}
            >
              ◀ Previous
            </button>
            <button
              className="btn-ui primary"
              onClick={() => setPresenterSlideIndex((i) => Math.min(plan.slides.length - 1, i + 1))}
              disabled={presenterSlideIndex === plan.slides.length - 1}
            >
              Next ▶
            </button>
          </div>
        </div>
      ) : null}
    </>
  );
}
