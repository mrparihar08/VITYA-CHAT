import React, { useRef, useState, useEffect } from "react";
import { API_BASE_URL } from "../../services/api";
import { downloadFileAsBlob } from "./Presentation";

export const BACKGROUND_PRESETS = [
  { id: "dark_gradient", name: "🌌 Midnight Purple", bg: "linear-gradient(135deg, #0f172a 0%, #1e1b4b 50%, #31104b 100%)", text: "#ffffff", accent: "#c084fc", solid_bg: "#0f172a", bg_start: "#0f172a", bg_end: "#31104b" },
  { id: "ocean_blue", name: "🌊 Ocean Breeze", bg: "linear-gradient(135deg, #06101e 0%, #0b2545 50%, #134074 100%)", text: "#ffffff", accent: "#38bdf8", solid_bg: "#06101e", bg_start: "#06101e", bg_end: "#134074" },
  { id: "emerald_dark", name: "🌲 Emerald Forest", bg: "linear-gradient(135deg, #022c22 0%, #064e3b 50%, #047857 100%)", text: "#ffffff", accent: "#34d399", solid_bg: "#022c22", bg_start: "#022c22", bg_end: "#047857" },
  { id: "cyberpunk_neon", name: "⚡ Cyberpunk Neon", bg: "linear-gradient(135deg, #09090b 0%, #2e1065 50%, #581c87 100%)", text: "#ffffff", accent: "#f43f5e", solid_bg: "#09090b", bg_start: "#09090b", bg_end: "#581c87" },
  { id: "wall_street", name: "💵 Wall Street Finance", bg: "linear-gradient(135deg, #022c22 0%, #0f172a 50%, #1e293b 100%)", text: "#ffffff", accent: "#10b981", solid_bg: "#022c22", bg_start: "#022c22", bg_end: "#1e293b" },
  { id: "executive_gold", name: "🏆 Executive Gold", bg: "linear-gradient(135deg, #1c1917 0%, #451a03 50%, #78350f 100%)", text: "#ffffff", accent: "#f59e0b", solid_bg: "#1c1917", bg_start: "#1c1917", bg_end: "#78350f" },
  { id: "velvet_rose", name: "🌹 Velvet Rose", bg: "linear-gradient(135deg, #2a0813 0%, #4c0519 50%, #881337 100%)", text: "#ffffff", accent: "#fb7185", solid_bg: "#2a0813", bg_start: "#2a0813", bg_end: "#881337" },
  { id: "executive_slate", name: "🪨 Executive Slate", bg: "linear-gradient(135deg, #18181b 0%, #27272a 50%, #3f3f46 100%)", text: "#ffffff", accent: "#a1a1aa", solid_bg: "#18181b", bg_start: "#18181b", bg_end: "#3f3f46" },
  { id: "clean_light", name: "☀️ Minimal Light", bg: "linear-gradient(135deg, #f8fafc 0%, #f1f5f9 50%, #e2e8f0 100%)", text: "#0f172a", accent: "#2563eb", solid_bg: "#f8fafc", bg_start: "#f8fafc", bg_end: "#e2e8f0" },
  { id: "titanium_white", name: "🏛️ Titanium White", bg: "linear-gradient(135deg, #ffffff 0%, #fafafa 50%, #f4f4f5 100%)", text: "#18181b", accent: "#4f46e5", solid_bg: "#ffffff", bg_start: "#ffffff", bg_end: "#f4f4f5" },
  { id: "sunset_glow", name: "🌅 Sunset Glow", bg: "linear-gradient(135deg, #2e1065 0%, #701a75 50%, #9f1239 100%)", text: "#ffffff", accent: "#fb7185", solid_bg: "#2e1065", bg_start: "#2e1065", bg_end: "#9f1239" },
  { id: "custom", name: "🎨 Custom Palette", bg: "custom", text: "#ffffff", accent: "#c084fc", solid_bg: "#0f172a", bg_start: "#1e1b4b", bg_end: "#0f172a" },
];

export const TABLE_THEME_PRESETS = [
  { id: "dark_gradient", name: "Midnight Purple", icon: "🌌", header_bg: "#8b5cf6", header_color: "#ffffff", cell_bg: "#1e293b", cell_color: "#ffffff" },
  { id: "ocean_blue", name: "Ocean Breeze", icon: "🌊", header_bg: "#0284c7", header_color: "#ffffff", cell_bg: "#0b2545", cell_color: "#ffffff" },
  { id: "emerald_dark", name: "Emerald Forest", icon: "🌲", header_bg: "#059669", header_color: "#ffffff", cell_bg: "#064e3b", cell_color: "#ffffff" },
  { id: "cyberpunk_neon", name: "Cyberpunk Neon", icon: "⚡", header_bg: "#e11d48", header_color: "#ffffff", cell_bg: "#2e1065", cell_color: "#ffffff" },
  { id: "wall_street", name: "Wall Street Finance", icon: "💵", header_bg: "#10b981", header_color: "#ffffff", cell_bg: "#064e3b", cell_color: "#ffffff" },
  { id: "executive_gold", name: "Executive Gold", icon: "🏆", header_bg: "#d97706", header_color: "#ffffff", cell_bg: "#451a03", cell_color: "#ffffff" },
  { id: "velvet_rose", name: "Velvet Rose", icon: "🌹", header_bg: "#e11d48", header_color: "#ffffff", cell_bg: "#4c0519", cell_color: "#ffffff" },
  { id: "royal_violet", name: "Royal Violet", icon: "🍇", header_bg: "#7e22ce", header_color: "#ffffff", cell_bg: "#3b0764", cell_color: "#ffffff" },
  { id: "nordic_frost", name: "Nordic Frost", icon: "🧊", header_bg: "#0284c7", header_color: "#ffffff", cell_bg: "#0c4a6e", cell_color: "#ffffff" },
  { id: "amber_bronze", name: "Amber Bronze", icon: "👑", header_bg: "#b45309", header_color: "#ffffff", cell_bg: "#451a03", cell_color: "#ffffff" },
  { id: "teal_cyan", name: "Teal Cyan", icon: "💎", header_bg: "#0d9488", header_color: "#ffffff", cell_bg: "#134e4a", cell_color: "#ffffff" },
  { id: "slate_dark", name: "Slate Dark", icon: "🛡️", header_bg: "#475569", header_color: "#ffffff", cell_bg: "#1e293b", cell_color: "#ffffff" },
  { id: "monochrome_black", name: "Monochrome Black", icon: "🕶️", header_bg: "#334155", header_color: "#ffffff", cell_bg: "#000000", cell_color: "#ffffff" },
  { id: "executive_slate", name: "Executive Slate", icon: "🪨", header_bg: "#6366f1", header_color: "#ffffff", cell_bg: "#1e293b", cell_color: "#ffffff" },
  { id: "clean_light", name: "Minimal Light", icon: "☀️", header_bg: "#2563eb", header_color: "#ffffff", cell_bg: "#f1f5f9", cell_color: "#0f172a" },
  { id: "sunset_glow", name: "Sunset Glow", icon: "🌅", header_bg: "#ea580c", header_color: "#ffffff", cell_bg: "#431407", cell_color: "#ffffff" },
  { id: "custom", name: "Custom Palette", icon: "🎨", header_bg: "#8b5cf6", header_color: "#ffffff", cell_bg: "#1e293b", cell_color: "#ffffff" },
];

export const OFFICE_LAYOUT_PRESETS = [
  { id: "title_subtitle", label: "Title Slide", desc: "Main title & subtitle" },
  { id: "title_content", label: "Title and Content", desc: "Header with content list" },
  { id: "section_header", label: "Section Header", desc: "Chapter / section divider" },
  { id: "two_content", label: "Two Content", desc: "Side-by-side dual content" },
  { id: "comparison", label: "Comparison", desc: "Side-by-side with headers" },
  { id: "title_only", label: "Title Only", desc: "Top header with blank body" },
  { id: "blank", label: "Blank", desc: "Empty custom slide canvas" },
  { id: "content_caption", label: "Content with Caption", desc: "Text sidebar & content box" },
  { id: "picture_caption", label: "Picture with Caption", desc: "Text sidebar & image box" },
];

function safeArray(value) {
  return Array.isArray(value) ? value : [];
}

export function detectBulletStyle(points = [], selectedStyle = "auto") {
  const st = String(selectedStyle || "auto").toLowerCase().trim();
  if (st !== "auto" && st !== "none" && st !== "") {
    return st;
  }
  const joinedText = safeArray(points).join(" ").toLowerCase();
  if (/(step|phase|stage|rank|order|first|second|third|1\.|2\.|3\.)/i.test(joinedText)) {
    return "number";
  }
  if (/(task|todo|check|verify|complete|done|feature|status)/i.test(joinedText)) {
    return "check";
  }
  if (/(key|important|highlight|top|benefit|advantage|star)/i.test(joinedText)) {
    return "star";
  }
  if (/(process|flow|next|then|direction|target|goal)/i.test(joinedText)) {
    return "arrow";
  }
  if (/(option|category|tier|type)/i.test(joinedText)) {
    return "alpha";
  }
  return "bullet";
}

export function formatBulletPrefix(style = "auto", index = 0, points = []) {
  const resolvedStyle = detectBulletStyle(points, style);
  const st = String(resolvedStyle || "bullet").toLowerCase().trim();
  if (st === "number" || st === "numbered" || st === "123") {
    return `${index + 1}. `;
  }
  if (st === "alpha" || st === "abc") {
    return `${String.fromCharCode(65 + (index % 26))}. `;
  }
  if (st === "roman") {
    const romans = ["I", "II", "III", "IV", "V", "VI", "VII", "VIII", "IX", "X"];
    return `${romans[index % 10]}. `;
  }
  if (st === "check" || st === "checklist") {
    return "✔ ";
  }
  if (st === "star") {
    return " ✦";
  }
  if (st === "arrow") {
    return "➜ ";
  }
  if (st === "diamond") {
    return "🔹 ";
  }
  return "• ";
}

export function detectDiagramType(text = "", selectedType = "auto") {
  const type = String(selectedType || "auto").toLowerCase();
  if (type !== "auto" && type !== "none" && type !== "") {
    return type;
  }
  const raw = String(text || "").toLowerCase();
  if (/(tree|hierarchy|decision|branch|node)/i.test(raw)) return "tree";
  if (/(cycle|loop|repeat|iterat|pdca|agile|sprint)/i.test(raw)) return "cycle";
  if (/(funnel|conversion|lead|pipeline|sales)/i.test(raw)) return "funnel";
  if (/(pyramid|hierarchy|maslow|foundation|level)/i.test(raw)) return "pyramid";
  if (/(swot|matrix|quadrant|2x2|grid)/i.test(raw)) return "quadrant";
  if (/(vs|versus|compare|comparison|feature\s*matrix)/i.test(raw)) return "comparison";
  if (/(timeline|roadmap|milestone|phase|quarter|q1|q2|q3|q4|202\d)/i.test(raw)) return "timeline";
  if (/(stack|architecture|layer|tier|database|backend|frontend|api)/i.test(raw)) return "architecture";
  if (/(input|output|processing|io\b)/i.test(raw)) return "io_cards";
  if (/(mindmap|brainstorm|category|concept|topic)/i.test(raw)) return "mindmap";
  return "flowchart";
}

export function parseDiagramSteps(textRaw) {
  if (!textRaw) return [];
  const rawParts = String(textRaw).split(/\s*(?:➔|➜|->|-->|→|⇒|\||\n|;)\s*/);
  const steps = [];
  for (let part of rawParts) {
    let cleaned = part.replace(/^[\s[(\u2022\-*]+|[\s\])]+$/g, "").trim();
    if (cleaned.includes("] [")) {
      const nested = cleaned.split(/\]\s*\[/);
      for (let n of nested) {
        let nc = n.replace(/^[\s[(]+|[\s\])]+$/g, "").trim();
        if (nc) steps.push(nc);
      }
    } else if (cleaned) {
      steps.push(cleaned);
    }
  }
  return steps;
}

export function VisualChartPreview({ data }) {
  const chartType = (data?.chart_type || "column").toLowerCase();
  const title = data?.title || "Data Metrics Overview";
  const rawLabels = safeArray(data?.labels).length ? data.labels : (safeArray(data?.categories).length ? data.categories : ["Phase 1", "Phase 2", "Phase 3", "Phase 4"]);
  
  let rawValues = safeArray(data?.values).map(Number).filter((v) => !isNaN(v));
  if (data?.series_map && typeof data.series_map === "object") {
    const firstSeries = Object.values(data.series_map)[0];
    if (Array.isArray(firstSeries)) {
      rawValues = firstSeries.map(Number).filter((v) => !isNaN(v));
    } else if (firstSeries && typeof firstSeries === "object") {
      rawValues = Object.values(firstSeries).map(Number).filter((v) => !isNaN(v));
    }
  }

  if (!rawValues.length || rawValues.every((v) => v === 0)) {
    rawValues = [28.5, 52.0, 84.5, 130.0].slice(0, rawLabels.length);
    while (rawValues.length < rawLabels.length) {
      rawValues.push(Math.round((rawValues.length + 1) * 28.5));
    }
  }

  const maxVal = Math.max(...rawValues, 10);

  const colors = ["#8b5cf6", "#06b6d4", "#ec4899", "#10b981", "#f59e0b", "#3b82f6"];

  return (
    <div style={{ background: "rgba(0,0,0,0.35)", padding: "14px", borderRadius: "12px", border: "1px solid rgba(255,255,255,0.15)", margin: "10px 0" }}>
      <div style={{ fontSize: "13px", fontWeight: "700", marginBottom: "10px", color: "#c084fc" }}>
        📊 {title} <span style={{ fontSize: "11px", opacity: 0.7 }}>({chartType.toUpperCase()} CHART)</span>
      </div>

      {(chartType === "column" || chartType === "bar") && (
        <div style={{ display: "flex", alignItems: "flex-end", gap: "12px", height: "120px", padding: "10px 0 0" }}>
          {rawLabels.map((lbl, idx) => {
            const val = rawValues[idx] || 0;
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

      {chartType === "bar_horizontal" && (
        <div style={{ display: "flex", flexDirection: "column", gap: "8px", padding: "6px 0" }}>
          {rawLabels.map((lbl, idx) => {
            const val = rawValues[idx] || 0;
            const widthPct = Math.min(100, Math.max(10, (val / maxVal) * 100));
            return (
              <div key={idx} style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                <div style={{ fontSize: "10px", width: "75px", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis", opacity: 0.9 }}>{lbl}</div>
                <div style={{ flex: 1, background: "rgba(255,255,255,0.06)", borderRadius: "4px", height: "16px", overflow: "hidden" }}>
                  <div style={{ width: `${widthPct}%`, height: "100%", background: colors[idx % colors.length], borderRadius: "4px" }} />
                </div>
                <div style={{ fontSize: "10px", fontWeight: "bold", width: "35px" }}>{val}</div>
              </div>
            );
          })}
        </div>
      )}

      {(chartType === "line" || chartType === "area" || chartType === "trend") && (
        <div style={{ display: "flex", flexDirection: "column", gap: "6px", padding: "6px 0" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", height: "80px", position: "relative" }}>
            {rawLabels.map((lbl, idx) => {
              const val = rawValues[idx] || 0;
              const heightPct = Math.min(100, Math.max(15, (val / maxVal) * 100));
              return (
                <div key={idx} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", height: "100%", justifyContent: "flex-end" }}>
                  <span style={{ fontSize: "9px", fontWeight: "bold", color: "#c084fc", marginBottom: "4px" }}>{val}</span>
                  <div style={{ width: "8px", height: "8px", borderRadius: "50%", background: "#c084fc", marginBottom: `${heightPct * 0.6}%` }} />
                </div>
              );
            })}
          </div>
          <div style={{ display: "flex", justifyContent: "space-between", borderTop: "1px solid rgba(255,255,255,0.15)", paddingTop: "4px" }}>
            {rawLabels.map((lbl, idx) => (
              <span key={idx} style={{ fontSize: "10px", opacity: 0.8 }}>{lbl}</span>
            ))}
          </div>
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
            {rawLabels.map((lbl, idx) => (
              <div key={idx} style={{ display: "flex", alignItems: "center", gap: "6px", fontSize: "11px" }}>
                <span style={{ width: "10px", height: "10px", borderRadius: "50%", background: colors[idx % colors.length] }} />
                <span>{lbl}: <strong>{rawValues[idx] || 0}</strong></span>
              </div>
            ))}
          </div>
        </div>
      )}

      {(chartType === "donut" || chartType === "doughnut") && (
        <div style={{ display: "flex", alignItems: "center", gap: "16px", padding: "10px 0" }}>
          <div
            style={{
              width: "90px",
              height: "90px",
              borderRadius: "50%",
              background: `radial-gradient(circle, rgba(15,23,42,1) 40%, transparent 41%), conic-gradient(#8b5cf6 0% 35%, #06b6d4 35% 65%, #ec4899 65% 100%)`,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "10px",
              fontWeight: "bold",
              color: "#c084fc",
              boxShadow: "0 4px 10px rgba(0,0,0,0.4)",
            }}
          >
            🍩 {rawValues.reduce((a, b) => a + b, 0)}
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
            {rawLabels.map((lbl, idx) => (
              <div key={idx} style={{ display: "flex", alignItems: "center", gap: "6px", fontSize: "11px" }}>
                <span style={{ width: "10px", height: "10px", borderRadius: "50%", background: colors[idx % colors.length] }} />
                <span>{lbl}: <strong>{rawValues[idx] || 0}</strong></span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

function FeatureFormattingBar({ pluginData, onChangeField, onRefineText, isRefining = false }) {
  const inputStyle = {
    background: "rgba(0,0,0,0.4)",
    border: "1px solid var(--panel-border)",
    borderRadius: "6px",
    padding: "3px 6px",
    color: "#fff",
    fontSize: "11px",
  };
  const labelStyle = {
    fontSize: "10px",
    color: "var(--text-muted)",
    display: "block",
    marginBottom: "2px",
  };

  return (
    <div
      style={{
        display: "flex",
        gap: 12,
        alignItems: "center",
        justifyContent: "space-between",
        marginTop: 6,
        background: "rgba(0,0,0,0.2)",
        padding: "6px 10px",
        borderRadius: 8,
        border: "1px solid rgba(255,255,255,0.05)",
        flexWrap: "wrap",
      }}
    >
      <div className="feature-formatting-bar" style={{ display: "flex", gap: 12, alignItems: "center", flexWrap: "wrap", width: "100%" }}>
        <div>
          <label style={labelStyle}>Font Size (Pt):</label>
          <input
            type="number"
            min="10"
            max="60"
            value={pluginData?.font_size || 14}
            onChange={(e) => onChangeField("font_size", Number(e.target.value))}
            style={{ ...inputStyle, width: "65px" }}
          />
        </div>
        <div>
          <label style={labelStyle}>Font Color:</label>
          <div style={{ ...inputStyle, padding: "2px", display: "flex", alignItems: "center", justifyContent: "center", width: "32px", height: "28px" }}>
            <input
              type="color"
              value={pluginData?.font_color || pluginData?.color || "#ffffff"}
              onChange={(e) => {
                onChangeField("font_color", e.target.value);
                onChangeField("color", e.target.value);
              }}
              style={{ border: "none", width: "24px", height: "22px", borderRadius: "4px", cursor: "pointer", background: "none" }}
            />
          </div>
        </div>
        <div>
          <label style={labelStyle}>H-Align:</label>
          <select
            value={pluginData?.alignment || pluginData?.align || "left"}
            onChange={(e) => {
              onChangeField("alignment", e.target.value);
              onChangeField("align", e.target.value);
            }}
            style={{ ...inputStyle, width: "85px" }}
          >
            <option value="left">Left</option>
            <option value="center">Center</option>
            <option value="right">Right</option>
            <option value="justify">Justify</option>
          </select>
        </div>
        <div>
          <label style={labelStyle}>V-Align:</label>
          <select
            value={pluginData?.valign || pluginData?.v_align || "top"}
            onChange={(e) => {
              onChangeField("valign", e.target.value);
              onChangeField("v_align", e.target.value);
            }}
            style={{ ...inputStyle, width: "85px" }}
          >
            <option value="top">Top</option>
            <option value="middle">Middle</option>
            <option value="bottom">Bottom</option>
          </select>
        </div>
      </div>

      {onRefineText ? (
        <button
          type="button"
          onClick={onRefineText}
          disabled={isRefining}
          className="btn-ui primary sm"
          style={{ fontSize: 10, padding: "5px 12px", background: "linear-gradient(135deg, #8b5cf6, #ec4899)", border: "none", borderRadius: 6, cursor: isRefining ? "wait" : "pointer", opacity: isRefining ? 0.7 : 1 }}
        >
          {isRefining ? "⏳ Polishing..." : "✨ AI Polish & Refine"}
        </button>
      ) : null}
    </div>
  );
}

export default function PresentationEditor({
  plan,
  setPlan,
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
  loadingGenerate,
  generatePpt,
  isSaving,
  isSaved,
  saveError,
  savedMeta,
  savePresentation,
  downloadSavedPresentation,
  handleDeckTitleChange,
  handleSlideTitleChange,
  handleSlideSubtitleChange,
  handleSlidePropertyChange,
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

  const handleMoveSlideToPosition = (fromIdx, toIdx) => {
    if (!setPlan || fromIdx === toIdx) return;
    setPlan((prev) => {
      if (!prev || !Array.isArray(prev.slides)) return prev;
      const slides = [...prev.slides];
      if (fromIdx < 0 || fromIdx >= slides.length || toIdx < 0 || toIdx >= slides.length) return prev;
      const [moved] = slides.splice(fromIdx, 1);
      slides.splice(toIdx, 0, moved);
      return { ...prev, slides };
    });
    setActiveSlideIndex(toIdx);
  };

  const resolveActiveSlideLayout = (slide) => {
    if (!slide) return "title_content";
    if (slide.layout && slide.layout !== "title_subtitle" && slide.layout !== "title_content") {
      return slide.layout;
    }
    const plugins = safeArray(slide.plugins);
    if (plugins.some((p) => p.type === "table")) return "table_focus";
    if (plugins.some((p) => p.type === "chart")) return "chart_focus";
    if (plugins.some((p) => p.type === "image")) return "image_text";
    if (plugins.some((p) => p.type === "paragraph_2col")) return "paragraph_2col";
    if (plugins.some((p) => p.type === "diagram")) return "table_focus";
    return slide.layout || "title_content";
  };

  const handleApplySlideLayout = (layoutType) => {
    if (!handleSlidePropertyChange) return;
    handleSlidePropertyChange(activeSlideIndex, "layout", layoutType);

    const existingPlugins = safeArray(activeSlide?.plugins);
    if (layoutType === "paragraph_2col" && !existingPlugins.some((p) => p.type === "paragraph_2col")) {
      handleAddPlugin(activeSlideIndex, "paragraph_2col");
    } else if (layoutType === "chart_focus" && !existingPlugins.some((p) => p.type === "chart")) {
      handleAddPlugin(activeSlideIndex, "chart");
    } else if (layoutType === "image_text" && !existingPlugins.some((p) => p.type === "image")) {
      handleAddPlugin(activeSlideIndex, "image");
    } else if (layoutType === "table_focus" && !existingPlugins.some((p) => p.type === "table")) {
      handleAddPlugin(activeSlideIndex, "table");
    }
  };

  const handleMoveBulletPoint = (pIdx, fromBIdx, toBIdx) => {
    const plugin = activeSlide?.plugins?.[pIdx];
    if (!plugin || plugin.type !== "bullets" || !Array.isArray(plugin.data?.points)) return;
    const points = [...plugin.data.points];
    if (fromBIdx < 0 || fromBIdx >= points.length || toBIdx < 0 || toBIdx >= points.length) return;
    const [moved] = points.splice(fromBIdx, 1);
    points.splice(toBIdx, 0, moved);
    handlePluginTextChange(activeSlideIndex, pIdx, "points", points);
  };

  const [showDownloadModal, setShowDownloadModal] = useState(false);
  const [showLayoutModal, setShowLayoutModal] = useState(false);
  const [layoutModalMode, setLayoutModalMode] = useState("add"); // "add" | "change"
  const [autoPlay, setAutoPlay] = useState(false);

  const handleAddSlideWithLayout = (layoutType = "title_content") => {
    if (!setPlan) return;
    setPlan((prev) => {
      const count = (prev?.slides?.length || 0) + 1;
      const layoutObj = OFFICE_LAYOUT_PRESETS.find((l) => l.id === layoutType) || { label: "New Slide" };

      let plugins = [
        { type: "subtitle", data: { text: `${layoutObj.label} Overview` } },
        { type: "bullets", data: { points: ["First important key takeaway point", "Second supporting detail"] } },
      ];

      if (layoutType === "title_subtitle") {
        plugins = [{ type: "subtitle", data: { text: "Section Subtitle / Introduction Headline" } }];
      } else if (layoutType === "two_content" || layoutType === "paragraph_2col") {
        plugins = [
          { type: "paragraph_2col", data: { left_title: "Key Aspect 1", left_text: "Description for first column...", right_title: "Key Aspect 2", right_text: "Description for second column..." } },
        ];
      } else if (layoutType === "comparison") {
        plugins = [
          { type: "table", data: { title: "Feature Comparison Table", headers: ["Feature / Option", "Option A", "Option B"], rows: [["Core Performance", "High Speed", "Standard"], ["Security Tier", "Enterprise SSL", "Basic"]] } },
        ];
      } else if (layoutType === "picture_caption" || layoutType === "image_text") {
        plugins = [
          { type: "image", data: { caption: "Visual illustration topic preview", url: "" } },
          { type: "bullets", data: { points: ["Key visual takeaway point 1", "Supporting observation point 2"] } },
        ];
      } else if (layoutType === "content_caption") {
        plugins = [
          { type: "paragraph", data: { text: "Detailed explanation paragraph for side caption..." } },
          { type: "bullets", data: { points: ["Key point highlight 1", "Key point highlight 2"] } },
        ];
      } else if (layoutType === "blank" || layoutType === "title_only") {
        plugins = [];
      }

      const newSlide = {
        title: `Slide ${count}: ${layoutObj.label}`,
        subtitle: layoutType === "title_subtitle" ? "Presentation Section Subtitle" : "",
        layout: layoutType,
        plugins,
      };

      const slides = [...(prev?.slides || []), newSlide];
      setActiveSlideIndex(slides.length - 1);
      return {
        title: prev?.title || "My Presentation Deck",
        slides,
      };
    });
  };
  const [autoPlaySpeed, setAutoPlaySpeed] = useState(5);
  const carouselRef = useRef(null);

  // Auto-Play slideshow effect for Presenter Mode ⏯️
  useEffect(() => {
    let interval = null;
    if (isPresenting && autoPlay) {
      interval = setInterval(() => {
        setPresenterSlideIndex((prevIndex) => {
          if (prevIndex >= (plan?.slides?.length || 1) - 1) {
            return 0;
          }
          return prevIndex + 1;
        });
      }, autoPlaySpeed * 1000);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isPresenting, autoPlay, autoPlaySpeed, plan, setPresenterSlideIndex]);

  useEffect(() => {
    if (downloadUrl) {
      setShowDownloadModal(true);
    }
  }, [downloadUrl]);

  const handleDirectDownload = async (e) => {
    e?.preventDefault();
    if (typeof downloadSavedPresentation === "function" && downloadUrl) {
      await downloadSavedPresentation();
      return;
    }

    if (!downloadUrl) return;
    const fullUrl = downloadUrl.replace(/^http:\/\//i, "https://");
    const fallbackExt = exportFormat === "pdf" ? "pdf" : "pptx";
    const filename = fullUrl.split("/").pop() || `presentation.${fallbackExt}`;
    await downloadFileAsBlob(fullUrl, filename);
  };

  const API_SERVER_URL = `${API_BASE_URL || process.env.REACT_APP_API_BASE_URL || ""}/api/presentation`;

  // Helper to dynamically fetch exact topic-matched HD Unsplash image via backend API
  const handleAutoUnsplashFetch = async (pIdx, query) => {
    const searchTopic = query || activeSlide?.title || "presentation visual";
    try {
      const res = await fetch(`${API_SERVER_URL}/unsplash/search?query=${encodeURIComponent(searchTopic)}`);
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

  const [generatingAiImgIdx, setGeneratingAiImgIdx] = useState(null);

  const handleGenerateAIImage = async (pIdx, defaultTopic = "") => {
    const plugin = activeSlide?.plugins?.[pIdx];
    const basePrompt = defaultTopic || plugin?.data?.caption || activeSlide?.title || plan?.title || "modern technology visual";
    const promptInput = window.prompt("Enter AI image prompt (e.g., 'Futuristic AI neural network server room, 8k'):", basePrompt);
    if (!promptInput || !promptInput.trim()) return;

    setGeneratingAiImgIdx(pIdx);
    try {
      const res = await fetch(`${API_SERVER_URL}/ai-image/generate?prompt=${encodeURIComponent(promptInput.trim())}`);
      const data = await res.json();
      if (data?.url) {
        handlePluginTextChange(activeSlideIndex, pIdx, "url", data.url);
        handlePluginTextChange(activeSlideIndex, pIdx, "path", data.url);
        handlePluginTextChange(activeSlideIndex, pIdx, "caption", promptInput.trim());
      }
    } catch (err) {
      console.warn("AI image generation call failed", err);
      alert("AI image generation failed. Please check network connection.");
    } finally {
      setGeneratingAiImgIdx(null);
    }
  };

  // Helper to handle local custom image file uploads from device (FileReader -> Data URL)
  const handleImageFileUpload = (e, targetPluginIdx = null) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const dataUrl = event.target?.result;
      if (!dataUrl) return;

      if (targetPluginIdx !== null && targetPluginIdx !== undefined) {
        handlePluginTextChange(activeSlideIndex, targetPluginIdx, "url", dataUrl);
        handlePluginTextChange(activeSlideIndex, targetPluginIdx, "path", dataUrl);
        if (!activeSlide?.plugins?.[targetPluginIdx]?.data?.caption) {
          handlePluginTextChange(activeSlideIndex, targetPluginIdx, "caption", file.name.replace(/\.[^/.]+$/, ""));
        }
      } else {
        handleAddPlugin(activeSlideIndex, "image");
        setTimeout(() => {
          const newIdx = safeArray(activeSlide?.plugins).length;
          handlePluginTextChange(activeSlideIndex, newIdx, "url", dataUrl);
          handlePluginTextChange(activeSlideIndex, newIdx, "path", dataUrl);
          handlePluginTextChange(activeSlideIndex, newIdx, "caption", file.name.replace(/\.[^/.]+$/, ""));
        }, 50);
      }
    };
    reader.readAsDataURL(file);
  };

  const [refiningPluginIdx, setRefiningPluginIdx] = useState(null);

  // TTS Voiceover Narration State 🎙️
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [speakingSlideIdx, setSpeakingSlideIdx] = useState(null);
  const [autoPlayVoiceover, setAutoPlayVoiceover] = useState(false);

  const compileSlideNarrationScript = (slide, slideIndex) => {
    if (!slide) return "";
    const parts = [];
    parts.push(`Slide ${slideIndex + 1}: ${slide.title || "Untitled Slide"}.`);
    if (slide.subtitle) parts.push(slide.subtitle + ".");

    safeArray(slide.plugins).forEach((p) => {
      if (!p || !p.data) return;
      if (p.type === "bullets" && Array.isArray(p.data.points)) {
        p.data.points.forEach((pt) => parts.push(String(pt).trim() + "."));
      } else if (p.type === "paragraph" && p.data.text) {
        parts.push(String(p.data.text).trim());
      } else if (p.type === "diagram" && (p.data.diagram || p.data.text)) {
        parts.push("Workflow diagram: " + String(p.data.diagram || p.data.text).replace(/[\u2794\->|]/g, " then ") + ".");
      } else if (p.type === "stat" && (p.data.number || p.data.label)) {
        parts.push(`Key metric: ${p.data.number || ""} ${p.data.label || ""}.`);
      } else if (p.type === "notes" && p.data.notes) {
        parts.push("Speaker note: " + String(p.data.notes).trim());
      }
    });

    return parts.filter(Boolean).join(" ");
  };

  const handleToggleSlideVoiceover = (slide, slideIndex) => {
    if (typeof window === "undefined" || !("speechSynthesis" in window)) {
      alert("Speech synthesis is not supported in your browser. Please try Chrome, Edge, or Safari.");
      return;
    }

    if (window.speechSynthesis.speaking && speakingSlideIdx === slideIndex && isSpeaking) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
      setSpeakingSlideIdx(null);
      return;
    }

    window.speechSynthesis.cancel();

    const script = compileSlideNarrationScript(slide, slideIndex);
    if (!script.trim()) {
      alert("This slide has no text to read out!");
      return;
    }

    const utterance = new SpeechSynthesisUtterance(script);
    utterance.rate = 1.0;
    utterance.pitch = 1.0;

    utterance.onstart = () => {
      setIsSpeaking(true);
      setSpeakingSlideIdx(slideIndex);
    };

    utterance.onend = () => {
      setIsSpeaking(false);
      setSpeakingSlideIdx(null);
    };

    utterance.onerror = () => {
      setIsSpeaking(false);
      setSpeakingSlideIdx(null);
    };

    window.speechSynthesis.speak(utterance);
  };

  useEffect(() => {
    if (isPresenting && autoPlayVoiceover && plan?.slides?.[presenterSlideIndex]) {
      handleToggleSlideVoiceover(plan.slides[presenterSlideIndex], presenterSlideIndex);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [presenterSlideIndex, isPresenting, autoPlayVoiceover]);

  // Helper to use Gemini AI to refine, polish, or convert slide content into punchy bullets/diagram steps
  const handleAIRefine = async (pIdx, action = "bullets") => {
    const plugin = activeSlide?.plugins?.[pIdx];
    if (!plugin) return;
    const currentText = plugin.data?.text || safeArray(plugin.data?.points).join("\n") || plugin.data?.diagram || "";
    if (!currentText) return;

    const targetAction = plugin.type === "diagram" ? "diagram" : action;

    setRefiningPluginIdx(pIdx);
    try {
      const res = await fetch(`${API_SERVER_URL}/refine-slide`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: currentText, action: targetAction }),
      });
      const data = await res.json();
      if (data?.refined_text) {
        if (plugin.type === "bullets") {
          const newPoints = data.refined_text.split("\n").map(s => s.replace(/^[•\-*\d.]+\s*/, "").trim()).filter(Boolean);
          handlePluginTextChange(activeSlideIndex, pIdx, "points", newPoints);
        } else if (plugin.type === "diagram") {
          let cleanedDiagram = data.refined_text;
          // If response has bullet points, newlines, or lacks ➜ arrow format, sanitize into clean diagram step nodes
          if (cleanedDiagram.includes("•") || cleanedDiagram.includes("\n") || !cleanedDiagram.includes("➜")) {
            const rawLines = cleanedDiagram.split(/\n|•|\*/).map(l => l.trim()).filter(Boolean);
            const nodes = [];
            for (let line of rawLines) {
              let nodeStr = line.replace(/^\d+[.)]\s*/, "").replace(/\*\*/g, "").trim();
              if (nodeStr.includes(":")) {
                const parts = nodeStr.split(":");
                const title = parts[0].trim();
                if (title.length > 1 && title.length < 45) {
                  nodeStr = title;
                }
              }
              if (nodeStr) {
                nodeStr = nodeStr.startsWith("[") && nodeStr.endsWith("]") ? nodeStr : `[${nodeStr}]`;
                nodes.push(nodeStr);
              }
            }
            if (nodes.length > 0) {
              cleanedDiagram = nodes.join(" ➜ ");
            }
          }
          handlePluginTextChange(activeSlideIndex, pIdx, "diagram", cleanedDiagram);
          handlePluginTextChange(activeSlideIndex, pIdx, "text", cleanedDiagram);
        } else {
          handlePluginTextChange(activeSlideIndex, pIdx, "text", data.refined_text);
        }
      }
    } catch (err) {
      console.warn("AI Refine API call failed", err);
    } finally {
      setRefiningPluginIdx(null);
    }
  };

  return (
    <>
      <div className="card-box">
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14, flexWrap: "wrap", gap: 10 }}>
          <div className="section-label" style={{ margin: 0 }}>Slide Navigation & Feature Editor</div>
          <div style={{ display: "flex", gap: 8, alignItems: "center", flexWrap: "wrap" }}>
            {saveError ? (
              <span style={{ fontSize: 11, color: "#fca5a5", fontWeight: "bold" }}>
                ⚠️ {saveError}
              </span>
            ) : null}



            <button
              type="button"
              className="btn-ui primary sm"
              onClick={savePresentation}
              disabled={isSaving}
              style={{
                background: isSaved
                  ? "linear-gradient(135deg, #6366f1, #8b5cf6)"
                  : "linear-gradient(135deg, #8b5cf6, #ec4899)",
                border: "none",
                cursor: isSaving ? "not-allowed" : "pointer",
                boxShadow: "0 4px 12px rgba(139, 92, 246, 0.4)",
              }}
            >
              {isSaving ? "⏳ Saving..." : isSaved ? "💾 Save Changes" : "💾 Save Presentation"}
            </button>

            {isSaved || downloadUrl ? (
              <button
                type="button"
                className="btn-ui primary sm"
                onClick={() => setShowDownloadModal(true)}
                style={{
                  background: "linear-gradient(135deg, #10b981, #059669)",
                  border: "none",
                  cursor: "pointer",
                  boxShadow: "0 4px 12px rgba(16, 185, 129, 0.4)",
                }}
              >
                📥Download
              </button>
            ) : null}
          </div>
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
                  Presentation Slides ({plan?.slides?.length || 0})
                </span>
              </div>
              <button
                className="btn-ui primary sm"
                onClick={() => {
                  setLayoutModalMode("add");
                  setShowLayoutModal(true);
                }}
                style={{ flexShrink: 0, padding: "5px 12px", display: "inline-flex", alignItems: "center", gap: 6 }}
                title="Click to select visual PowerPoint Office Theme layout for new slide"
              >
                <span>+ Add New Slide</span>
                <span style={{ fontSize: 10, opacity: 0.8 }}>▼</span>
              </button>
            </div>

            <div className="slide-horizontal-carousel" ref={carouselRef}>
              {safeArray(plan?.slides).map((slideItem, idx) => (
                <div
                  key={idx}
                  className={`slide-tab-item ${activeSlideIndex === idx ? "active" : ""}`}
                  onClick={() => setActiveSlideIndex(idx)}
                  draggable={true}
                  onDragStart={(e) => {
                    e.dataTransfer.setData("text/plain", idx.toString());
                    e.dataTransfer.effectAllowed = "move";
                  }}
                  onDragOver={(e) => {
                    e.preventDefault();
                    e.dataTransfer.dropEffect = "move";
                  }}
                  onDrop={(e) => {
                    e.preventDefault();
                    const fromIdx = parseInt(e.dataTransfer.getData("text/plain"), 10);
                    if (!isNaN(fromIdx) && fromIdx !== idx) {
                      handleMoveSlideToPosition(fromIdx, idx);
                    }
                  }}
                  style={{ cursor: "grab" }}
                  title="Drag & Drop to reorder slide"
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
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "nowrap", gap: 8, overflowX: "auto" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 6, flexShrink: 0 }}>
                    <span style={{ fontSize: 11, fontWeight: 700, color: "#c084fc", whiteSpace: "nowrap" }}>Theme BG:</span>
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

                    <span style={{ fontSize: 11, fontWeight: 700, color: "#c084fc", whiteSpace: "nowrap", marginLeft: 6 }}>Layout:</span>
                    <button
                      type="button"
                      onClick={() => setShowLayoutModal(true)}
                      style={{
                        background: "rgba(0,0,0,0.4)",
                        border: "1px solid var(--panel-border)",
                        color: "#fff",
                        borderRadius: 8,
                        padding: "4px 10px",
                        fontSize: 12,
                        fontWeight: 700,
                        display: "inline-flex",
                        alignItems: "center",
                        gap: 6,
                        cursor: "pointer",
                      }}
                      title="Click to view visual PowerPoint Office Theme Layouts"
                    >
                      <span>🔲</span>
                      <span>
                        {OFFICE_LAYOUT_PRESETS.find((l) => l.id === resolveActiveSlideLayout(activeSlide))?.label || "Title and Content"}
                      </span>
                      <span style={{ fontSize: 10, opacity: 0.7 }}>▼</span>
                    </button>
                  </div>

                  <div style={{ display: "flex", gap: 6, flexWrap: "nowrap", alignItems: "center", flexShrink: 0 }}>
                    <button
                      type="button"
                      className="btn-ui secondary sm"
                      onClick={() => handleToggleSlideVoiceover(activeSlide, activeSlideIndex)}
                      style={{
                        whiteSpace: "nowrap",
                        background: isSpeaking && speakingSlideIdx === activeSlideIndex ? "rgba(239, 68, 68, 0.25)" : "rgba(139, 92, 246, 0.2)",
                        border: isSpeaking && speakingSlideIdx === activeSlideIndex ? "1px solid #ef4444" : "1px solid rgba(139, 92, 246, 0.4)",
                        color: "#fff",
                      }}
                    >
                      {isSpeaking && speakingSlideIdx === activeSlideIndex ? "⏹️Stop" : "🎙️Play"}
                    </button>
                    <button className="btn-ui secondary sm" onClick={() => handleDuplicateSlide(activeSlideIndex)} style={{ whiteSpace: "nowrap" }}>
                      📋 Duplicate
                    </button>
                    <button className="btn-ui danger sm" onClick={() => handleDeleteSlide(activeSlideIndex)} style={{ flexShrink: 0 }}>
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
              {(() => {
                const titleVAlign = activeSlide.title_valign || activeSlide.subtitle_valign || "auto";
                const isVMiddle = titleVAlign === "middle" || titleVAlign === "center";
                const isVBottom = titleVAlign === "bottom";
                const nonNotesPlugins = safeArray(activeSlide.plugins).filter((p) => p.type !== "notes");
                const hasPlugins = nonNotesPlugins.length > 0;

                return (
                  <div
                    className="slide-canvas-box"
                    style={{
                      background: selectedBgConfig.bg,
                      color: selectedBgConfig.text,
                      display: "flex",
                      flexDirection: "column",
                      justifyContent: isVMiddle ? "center" : isVBottom ? "flex-end" : "flex-start",
                      boxSizing: "border-box",
                    }}
                  >
                    <div
                      style={{
                        width: "100%",
                        textAlign: activeSlide.title_align || "left",
                      }}
                    >
                      <div style={{ fontSize: 11, fontWeight: "800", color: selectedBgConfig?.accent || "inherit", opacity: 0.9, letterSpacing: 1 }}>
                        SLIDE {activeSlideIndex + 1} OF {plan.slides.length}
                      </div>
                      <h2
                        contentEditable={true}
                        suppressContentEditableWarning={true}
                        onBlur={(e) => handleSlideTitleChange(activeSlideIndex, e.target.innerText)}
                        title="Click to edit slide title inline"
                        style={{
                          fontSize: `clamp(18px, 4vw, ${activeSlide.title_font_size || 26}px)`,
                          color: activeSlide.title_color || "inherit",
                          textAlign: activeSlide.title_align || "left",
                          fontWeight: activeSlide.title_bold === false ? 400 : 800,
                          margin: "6px 0 4px",
                          wordBreak: "break-word",
                          outline: "none",
                          cursor: "text",
                        }}
                      >
                        {activeSlide.title || "Slide Title"}
                      </h2>
                      {activeSlide.subtitle ? (
                        <div
                          contentEditable={true}
                          suppressContentEditableWarning={true}
                          onBlur={(e) => handleSlideSubtitleChange(activeSlideIndex, e.target.innerText)}
                          title="Click to edit slide subtitle inline"
                          style={{
                            fontSize: `clamp(12px, 3vw, ${activeSlide.subtitle_font_size || 15}px)`,
                            color: activeSlide.subtitle_color || "inherit",
                            textAlign: activeSlide.subtitle_align || "left",
                            opacity: activeSlide.subtitle_color ? 1 : 0.8,
                            fontWeight: 600,
                            wordBreak: "break-word",
                            outline: "none",
                            cursor: "text",
                          }}
                        >
                          {activeSlide.subtitle}
                        </div>
                      ) : null}
                    </div>

                {/* LIVE PLUGINS CONTENT */}
                {hasPlugins && (
                  <div style={{ flex: isVMiddle || isVBottom ? "0 1 auto" : 1, maxHeight: "100%", overflowY: "auto", margin: "12px 0", display: "flex", flexDirection: "column", gap: 10, paddingRight: 4 }}>
                  {(() => {
                    const plugins = safeArray(activeSlide.plugins);
                    const hasImage = plugins.some((p) => p.type === "image" && (p.data?.url || p.data?.path));
                    const hasText = plugins.some((p) => p.type === "bullets" || p.type === "paragraph");

                    const renderPluginItem = (p, pIdx) => (
                      <div key={pIdx}>
                        {p.type === "subtitle" || p.type === "text" ? (
                          <h3
                            contentEditable={true}
                            suppressContentEditableWarning={true}
                            onBlur={(e) => handlePluginTextChange(activeSlideIndex, pIdx, "text", e.target.innerText)}
                            title="Click to edit inline"
                            style={{ fontSize: p.data?.font_size || 18, textAlign: p.data?.alignment || "left", color: p.data?.font_color || p.data?.color || selectedBgConfig?.accent || "#c084fc", margin: "4px 0", outline: "none", cursor: "text" }}
                          >
                            {p.data?.text}
                          </h3>
                        ) : null}

                        {p.type === "paragraph" ? (
                          <p
                            contentEditable={true}
                            suppressContentEditableWarning={true}
                            onBlur={(e) => handlePluginTextChange(activeSlideIndex, pIdx, "text", e.target.innerText)}
                            title="Click to edit inline"
                            style={{ fontSize: p.data?.font_size || 14, textAlign: p.data?.alignment || "left", color: p.data?.font_color || p.data?.color || "inherit", lineHeight: 1.5, opacity: (p.data?.font_color || p.data?.color) ? 1 : 0.9, outline: "none", cursor: "text" }}
                          >
                            {p.data?.text}
                          </p>
                        ) : null}

                        {p.type === "paragraph_2col" ? (
                          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: p.data?.column_gap || 14, margin: "8px 0" }}>
                            <div style={{ background: "rgba(255,255,255,0.03)", padding: 12, borderRadius: 8, border: "1px solid rgba(255,255,255,0.08)" }}>
                              {p.data?.left_title && (
                                <div
                                  contentEditable={true}
                                  suppressContentEditableWarning={true}
                                  onBlur={(e) => handlePluginTextChange(activeSlideIndex, pIdx, "left_title", e.target.innerText)}
                                  title="Click to edit left title inline"
                                  style={{ fontWeight: 800, fontSize: 13, color: selectedBgConfig?.accent || "#c084fc", marginBottom: 4, outline: "none", cursor: "text" }}
                                >
                                  {p.data.left_title}
                                </div>
                              )}
                              <p
                                contentEditable={true}
                                suppressContentEditableWarning={true}
                                onBlur={(e) => handlePluginTextChange(activeSlideIndex, pIdx, "left_text", e.target.innerText)}
                                title="Click to edit paragraph inline"
                                style={{ fontSize: p.data?.font_size || 13, lineHeight: 1.5, color: p.data?.font_color || p.data?.color || "inherit", opacity: 0.9, margin: 0, outline: "none", cursor: "text" }}
                              >
                                {p.data?.left_text || p.data?.text || "Left paragraph content..."}
                              </p>
                            </div>
                            <div style={{ background: "rgba(255,255,255,0.03)", padding: 12, borderRadius: 8, border: "1px solid rgba(255,255,255,0.08)" }}>
                              {p.data?.right_title && (
                                <div
                                  contentEditable={true}
                                  suppressContentEditableWarning={true}
                                  onBlur={(e) => handlePluginTextChange(activeSlideIndex, pIdx, "right_title", e.target.innerText)}
                                  title="Click to edit right title inline"
                                  style={{ fontWeight: 800, fontSize: 13, color: selectedBgConfig?.accent || "#c084fc", marginBottom: 4, outline: "none", cursor: "text" }}
                                >
                                  {p.data.right_title}
                                </div>
                              )}
                              <p
                                contentEditable={true}
                                suppressContentEditableWarning={true}
                                onBlur={(e) => handlePluginTextChange(activeSlideIndex, pIdx, "right_text", e.target.innerText)}
                                title="Click to edit paragraph inline"
                                style={{ fontSize: p.data?.font_size || 13, lineHeight: 1.5, color: p.data?.font_color || p.data?.color || "inherit", opacity: 0.9, margin: 0, outline: "none", cursor: "text" }}
                              >
                                {p.data?.right_text || "Right paragraph content..."}
                              </p>
                            </div>
                          </div>
                        ) : null}

                        {p.type === "bullets" ? (
                          <div style={{ paddingLeft: 4, margin: "6px 0", textAlign: p.data?.alignment || p.data?.align || "left", color: p.data?.font_color || p.data?.color || "inherit" }}>
                            {safeArray(p.data?.points).map((pt, bIdx) => (
                              <div
                                key={bIdx}
                                draggable={true}
                                onDragStart={(e) => {
                                  e.dataTransfer.setData("text/plain", `${pIdx},${bIdx}`);
                                  e.dataTransfer.effectAllowed = "move";
                                }}
                                onDragOver={(e) => {
                                  e.preventDefault();
                                  e.dataTransfer.dropEffect = "move";
                                }}
                                onDrop={(e) => {
                                  e.preventDefault();
                                  const raw = e.dataTransfer.getData("text/plain");
                                  const [fromPIdx, fromBIdx] = raw.split(",").map(Number);
                                  if (fromPIdx === pIdx && !isNaN(fromBIdx) && fromBIdx !== bIdx) {
                                    handleMoveBulletPoint(pIdx, fromBIdx, bIdx);
                                  }
                                }}
                                style={{ fontSize: p.data?.font_size || 14, marginBottom: 5, display: "flex", gap: 8, alignItems: "baseline", cursor: "grab" }}
                                title="Drag to reorder bullet point"
                              >
                                <span style={{ fontWeight: 800, color: selectedBgConfig?.accent || "#c084fc", flexShrink: 0, userSelect: "none" }}>
                                  {formatBulletPrefix(p.data?.bullet_style || p.data?.list_style, bIdx, p.data?.points)}
                                </span>
                                <span
                                  contentEditable={true}
                                  suppressContentEditableWarning={true}
                                  onBlur={(e) => handlePluginTextChange(activeSlideIndex, pIdx, "points", e.target.innerText, bIdx)}
                                  title="Click to edit bullet inline"
                                  style={{ outline: "none", cursor: "text", flex: 1 }}
                                >
                                  {pt}
                                </span>
                              </div>
                            ))}
                          </div>
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
                                style={{
                                  maxHeight: Number(p.data?.img_height || p.data?.height || 180),
                                  borderRadius: 10,
                                  border: "1px solid rgba(255,255,255,0.2)",
                                  transition: "max-height 0.2s ease"
                                }}
                              />
                            ) : null}
                            {p.data?.caption ? (
                              <div style={{ fontSize: 11, opacity: 0.7, marginTop: 4 }}>{p.data.caption}</div>
                            ) : null}
                          </div>
                        ) : null}

                        {p.type === "stat" ? (
                          <div style={{ display: "flex", alignItems: "baseline", gap: 10, margin: "8px 0" }}>
                            <span style={{ fontSize: p.data?.font_size || 36, fontWeight: 900, color: selectedBgConfig?.accent || "#c084fc" }}>{p.data?.number}</span>
                            <span style={{ fontSize: 14, fontWeight: 600, opacity: 0.85 }}>{p.data?.label}</span>
                          </div>
                        ) : null}

                        {p.type === "diagram" ? (
                          (() => {
                            const textRaw = p.data?.diagram || p.data?.text || "[Input] ➜ [Processing] ➜ [Output]";
                            const diagType = detectDiagramType(textRaw, p.data?.diagram_type);
                            
                            const rawParts = String(textRaw).split(/\s*(?:➔|➜|->|-->|→|⇒|\||\n|;)\s*/);
                            const steps = [];
                            for (let part of rawParts) {
                              let cleaned = part.replace(/^[\s[(\u2022\-*]+|[\s\])]+$/g, "").trim();
                              if (cleaned.includes("] [")) {
                                const nested = cleaned.split(/\]\s*\[/);
                                for (let n of nested) {
                                  let nc = n.replace(/^[\s[(]+|[\s\])]+$/g, "").trim();
                                  if (nc) steps.push(nc);
                                }
                              } else if (cleaned) {
                                steps.push(cleaned);
                              }
                            }
                            
                            const headers = {
                              tree: "🌳 TREE HIERARCHY & DECISION BRANCHES",
                              flowchart: "🔄 PROCESS & WORKFLOW DIAGRAM",
                              architecture: "🏛️ SYSTEM ARCHITECTURE STACK",
                              timeline: "📅 TIMELINE & ROADMAP MILESTONES",
                              io_cards: "📥 INPUT  │  ⚙️ PROCESSING  │  📤 OUTPUT",
                              mindmap: "🧠 CONCEPT & CATEGORY MAP",
                              funnel: "🔻 CONVERSION & PIPELINE FUNNEL",
                              cycle: "🔁 CIRCULAR PROCESS & ITERATION LOOP",
                              pyramid: "🔺 HIERARCHY & LAYERED PYRAMID",
                              quadrant: "🧭 2x2 STRATEGIC MATRIX / QUADRANT",
                              comparison: "⚔️ FEATURE & SOLUTION COMPARISON",
                            };
                            const customDiagramTitle = p.data?.title || p.data?.diagram_title;
                            const headerTitle = customDiagramTitle ? customDiagramTitle.toUpperCase() : (headers[diagType] || "⚙️ SYSTEM ARCHITECTURE & PROCESS FLOW");

                            return (
                              <div style={{ background: `${selectedBgConfig?.accent || "#c084fc"}1f`, border: `1px dashed ${selectedBgConfig?.accent || "#c084fc"}80`, borderRadius: 10, padding: 12, textAlign: p.data?.alignment || "center", margin: "8px 0" }}>
                                <div style={{ fontSize: 11, fontWeight: 800, color: selectedBgConfig?.accent || "#c084fc", marginBottom: 8, letterSpacing: 0.5 }}>
                                  {headerTitle}
                                </div>
                                
                                {diagType === "tree" && (
                                  <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 10, padding: "8px 0" }}>
                                    <div style={{ background: `linear-gradient(135deg, ${selectedBgConfig?.accent || "#c084fc"}, #3b82f6)`, color: "#fff", fontWeight: 900, padding: "8px 24px", borderRadius: 12, fontSize: 13, boxShadow: "0 4px 16px rgba(192, 132, 252, 0.4)", border: "1.5px solid rgba(255,255,255,0.3)" }}>
                                      🌳 {steps[0] || "Root Concept"}
                                    </div>
                                    {steps.length > 1 && (
                                      <>
                                        <div style={{ width: 2, height: 16, background: selectedBgConfig?.accent || "#c084fc" }} />
                                        <div style={{ display: "flex", gap: 12, flexWrap: "wrap", justifyContent: "center" }}>
                                          {steps.slice(1).map((subStep, sIdx) => (
                                            <div key={sIdx} style={{ background: "rgba(15,23,42,0.9)", border: `1.5px solid ${selectedBgConfig?.accent || "#c084fc"}`, borderRadius: 10, padding: "8px 14px", fontSize: p.data?.font_size || 11, fontWeight: 700, color: "#fff", boxShadow: "0 4px 10px rgba(0,0,0,0.3)" }}>
                                              <span style={{ color: selectedBgConfig?.accent || "#c084fc", marginRight: 4 }}>🌿 Node {sIdx + 1}:</span>
                                              {subStep}
                                            </div>
                                          ))}
                                        </div>
                                      </>
                                    )}
                                  </div>
                                )}

                                {diagType === "flowchart" && (
                                  <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 10, flexWrap: "wrap", padding: "10px 0" }}>
                                    {steps.map((step, sIdx) => {
                                      const isStartEnd = sIdx === 0 || sIdx === steps.length - 1;
                                      return (
                                        <React.Fragment key={sIdx}>
                                          <div style={{
                                            background: isStartEnd ? selectedBgConfig?.accent || "#c084fc" : "rgba(15,23,42,0.85)",
                                            color: isStartEnd ? "#000" : "#fff",
                                            border: `2px solid ${selectedBgConfig?.accent || "#c084fc"}`,
                                            borderRadius: isStartEnd ? "24px" : "8px",
                                            padding: "8px 16px",
                                            fontSize: p.data?.font_size || 12,
                                            fontWeight: 800,
                                            boxShadow: "0 4px 12px rgba(0,0,0,0.4)",
                                          }}>
                                            {isStartEnd ? `🏁 ${step}` : `⚙️ ${step}`}
                                          </div>
                                          {sIdx < steps.length - 1 && <span style={{ color: selectedBgConfig?.accent || "#c084fc", fontSize: 18, fontWeight: 900 }}>➜</span>}
                                        </React.Fragment>
                                      );
                                    })}
                                  </div>
                                )}

                                {diagType === "architecture" && (
                                  <div style={{ display: "flex", flexDirection: "column", alignItems: "stretch", gap: 8, maxWidth: "90%", margin: "8px auto 0", padding: "4px 0" }}>
                                    {steps.map((step, sIdx) => (
                                      <React.Fragment key={sIdx}>
                                        <div style={{
                                          width: "100%",
                                          background: `linear-gradient(135deg, ${selectedBgConfig?.accent || "#c084fc"}2b 0%, rgba(15,23,42,0.92) 100%)`,
                                          border: `1.5px solid ${selectedBgConfig?.accent || "#c084fc"}`,
                                          borderRadius: "12px",
                                          padding: "10px 18px",
                                          fontSize: p.data?.font_size || 12,
                                          fontWeight: 700,
                                          color: "#fff",
                                          display: "flex",
                                          justifyContent: "space-between",
                                          alignItems: "center",
                                          boxShadow: "0 4px 12px rgba(0,0,0,0.35)",
                                          boxSizing: "border-box",
                                        }}>
                                          <span style={{ fontSize: 10, fontWeight: 900, color: selectedBgConfig?.accent || "#c084fc", background: "rgba(0,0,0,0.5)", border: `1px solid ${selectedBgConfig?.accent || "#c084fc"}60`, padding: "3px 10px", borderRadius: 6, letterSpacing: 0.5 }}>
                                            TIER {sIdx + 1}
                                          </span>
                                          <span style={{ fontWeight: 800, fontSize: 13, textShadow: "0 1px 4px rgba(0,0,0,0.5)" }}>{step}</span>
                                          <span style={{ fontSize: 10, fontWeight: 700, opacity: 0.75, color: selectedBgConfig?.accent || "#c084fc" }}>Layer {sIdx + 1}</span>
                                        </div>
                                        {sIdx < steps.length - 1 && (
                                          <div style={{ display: "flex", justifyContent: "center", margin: "-3px 0" }}>
                                            <span style={{ color: selectedBgConfig?.accent || "#c084fc", fontSize: 14, fontWeight: 900 }}>⬇️</span>
                                          </div>
                                        )}
                                      </React.Fragment>
                                    ))}
                                  </div>
                                )}

                                {diagType === "timeline" && (
                                  <div style={{ position: "relative", padding: "20px 10px 10px", margin: "8px 0" }}>
                                    <div style={{ position: "absolute", top: "45px", left: "5%", right: "5%", height: "4px", background: selectedBgConfig?.accent || "#c084fc", borderRadius: 2, zIndex: 1 }} />
                                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 10, position: "relative", zIndex: 2 }}>
                                      {steps.map((step, sIdx) => (
                                        <div key={sIdx} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", textAlign: "center" }}>
                                          <div style={{ width: "24px", height: "24px", borderRadius: "50%", background: selectedBgConfig?.accent || "#c084fc", color: "#000", fontWeight: 900, fontSize: 10, display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 8, boxShadow: `0 0 10px ${selectedBgConfig?.accent || "#c084fc"}` }}>
                                            {sIdx + 1}
                                          </div>
                                          <div style={{ background: "rgba(15,23,42,0.9)", border: "1px solid rgba(255,255,255,0.15)", borderRadius: 8, padding: "6px 8px", width: "100%" }}>
                                            <div style={{ fontSize: 9, color: selectedBgConfig?.accent || "#c084fc", fontWeight: 800, textTransform: "uppercase" }}>MILESTONE {sIdx + 1}</div>
                                            <div style={{ fontSize: p.data?.font_size || 11, fontWeight: 700, color: "#fff", marginTop: 2 }}>{step}</div>
                                          </div>
                                        </div>
                                      ))}
                                    </div>
                                  </div>
                                )}

                                {diagType === "io_cards" && (
                                  <div style={{ display: "grid", gridTemplateColumns: steps.length === 3 ? "1fr 1fr 1fr" : `repeat(${Math.min(steps.length, 4)}, 1fr)`, gap: 12, padding: "6px 0" }}>
                                    {steps.map((step, sIdx) => {
                                      const styles = [
                                        { bg: "linear-gradient(135deg, #0284c7 0%, #0f172a 100%)", border: "#38bdf8", title: "📥 INPUT DATA" },
                                        { bg: "linear-gradient(135deg, #7c3aed 0%, #0f172a 100%)", border: "#c084fc", title: "⚙️ PROCESSING" },
                                        { bg: "linear-gradient(135deg, #059669 0%, #0f172a 100%)", border: "#34d399", title: "📤 OUTPUT RESULT" },
                                      ];
                                      const st = styles[sIdx % styles.length];
                                      return (
                                        <div key={sIdx} style={{ background: st.bg, border: `1.5px solid ${st.border}`, borderRadius: 12, padding: 12, textAlign: "center", boxShadow: "0 6px 16px rgba(0,0,0,0.4)" }}>
                                          <div style={{ fontSize: 10, fontWeight: 900, color: st.border, marginBottom: 6, letterSpacing: 0.5 }}>{st.title}</div>
                                          <div style={{ fontSize: p.data?.font_size || 12, color: "#fff", fontWeight: 700 }}>{step}</div>
                                        </div>
                                      );
                                    })}
                                  </div>
                                )}

                                {diagType === "mindmap" && (
                                  <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 10, padding: "8px 0" }}>
                                    <div style={{ background: `linear-gradient(135deg, ${selectedBgConfig?.accent || "#c084fc"}, #ec4899)`, color: "#fff", fontWeight: 900, padding: "8px 20px", borderRadius: 24, fontSize: 13, boxShadow: "0 4px 16px rgba(192, 132, 252, 0.4)" }}>
                                      🧠 {steps[0] || "Core Concept"}
                                    </div>
                                    {steps.length > 1 && (
                                      <>
                                        <div style={{ width: 2, height: 16, background: selectedBgConfig?.accent || "#c084fc" }} />
                                        <div style={{ display: "flex", gap: 10, flexWrap: "wrap", justifyContent: "center" }}>
                                          {steps.slice(1).map((subStep, sIdx) => (
                                            <div key={sIdx} style={{ background: "rgba(15,23,42,0.85)", border: `1.5px solid ${selectedBgConfig?.accent || "#c084fc"}`, borderRadius: 14, padding: "6px 14px", fontSize: p.data?.font_size || 11, fontWeight: 700, color: "#fff" }}>
                                              🔹 {subStep}
                                            </div>
                                          ))}
                                        </div>
                                      </>
                                    )}
                                  </div>
                                )}

                                {diagType === "funnel" && (
                                  <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 6, padding: "8px 0" }}>
                                    {steps.map((step, sIdx) => {
                                      const widthPct = Math.max(30, 100 - sIdx * (65 / Math.max(1, steps.length - 1)));
                                      return (
                                        <div
                                          key={sIdx}
                                          style={{
                                            width: `${widthPct}%`,
                                            background: `linear-gradient(135deg, ${selectedBgConfig?.accent || "#c084fc"}ee 0%, ${selectedBgConfig?.accent || "#c084fc"}44 100%)`,
                                            border: "1px solid rgba(255,255,255,0.25)",
                                            borderRadius: 8,
                                            padding: "6px 12px",
                                            fontSize: p.data?.font_size || 11,
                                            fontWeight: 800,
                                            textAlign: "center",
                                            color: "#fff",
                                            boxShadow: "0 4px 10px rgba(0,0,0,0.3)"
                                          }}
                                        >
                                          STAGE {sIdx + 1}: {step}
                                        </div>
                                      );
                                    })}
                                  </div>
                                )}

                                {diagType === "cycle" && (
                                  <div style={{ position: "relative", width: "100%", height: "200px", margin: "10px 0", display: "flex", alignItems: "center", justifyContent: "center" }}>
                                    <svg style={{ position: "absolute", inset: 0, width: "100%", height: "100%", pointerEvents: "none" }}>
                                      <ellipse
                                        cx="50%"
                                        cy="50%"
                                        rx="140"
                                        ry="65"
                                        fill="none"
                                        stroke={selectedBgConfig?.accent || "#c084fc"}
                                        strokeWidth="2.5"
                                        strokeDasharray="6 4"
                                        opacity="0.6"
                                      />
                                    </svg>
                                    <div style={{
                                      position: "absolute",
                                      width: "56px",
                                      height: "56px",
                                      borderRadius: "50%",
                                      background: selectedBgConfig?.accent || "#c084fc",
                                      color: "#000",
                                      display: "flex",
                                      flexDirection: "column",
                                      alignItems: "center",
                                      justifyContent: "center",
                                      fontWeight: 900,
                                      fontSize: 10,
                                      boxShadow: `0 0 16px ${selectedBgConfig?.accent || "#c084fc"}80`,
                                      zIndex: 2,
                                    }}>
                                      <span style={{ fontSize: 16 }}>🔁</span>
                                      <span>LOOP</span>
                                    </div>
                                    {steps.map((step, sIdx) => {
                                      const total = steps.length;
                                      const angle = (2 * Math.PI * sIdx) / total - Math.PI / 2;
                                      const radiusX = 140;
                                      const radiusY = 65;
                                      const x = Math.cos(angle) * radiusX;
                                      const y = Math.sin(angle) * radiusY;

                                      return (
                                        <div
                                          key={sIdx}
                                          style={{
                                            position: "absolute",
                                            transform: `translate(${x}px, ${y}px)`,
                                            background: "rgba(15, 23, 42, 0.95)",
                                            border: `2px solid ${selectedBgConfig?.accent || "#c084fc"}`,
                                            borderRadius: "16px",
                                            padding: "5px 12px",
                                            fontSize: p.data?.font_size || 11,
                                            fontWeight: 700,
                                            color: "#fff",
                                            boxShadow: "0 4px 14px rgba(0,0,0,0.6)",
                                            whiteSpace: "nowrap",
                                            zIndex: 3,
                                            maxWidth: "140px",
                                            textOverflow: "ellipsis",
                                            overflow: "hidden",
                                          }}
                                        >
                                          <span style={{ color: selectedBgConfig?.accent || "#c084fc", marginRight: 4 }}>
                                            {sIdx + 1}.
                                          </span>
                                          {step}
                                        </div>
                                      );
                                    })}
                                  </div>
                                )}

                                {diagType === "pyramid" && (
                                  <div style={{ display: "flex", flexDirection: "column-reverse", alignItems: "center", gap: 6, padding: "8px 0" }}>
                                    {steps.map((step, sIdx) => {
                                      const widthPct = Math.max(30, 40 + sIdx * (60 / Math.max(1, steps.length - 1)));
                                      return (
                                        <div
                                          key={sIdx}
                                          style={{
                                            width: `${widthPct}%`,
                                            background: `linear-gradient(135deg, ${selectedBgConfig?.accent || "#c084fc"}33 0%, ${selectedBgConfig?.accent || "#c084fc"}aa 100%)`,
                                            border: `1.5px solid ${selectedBgConfig?.accent || "#c084fc"}`,
                                            borderRadius: 8,
                                            padding: "6px 12px",
                                            fontSize: p.data?.font_size || 11,
                                            fontWeight: 800,
                                            textAlign: "center",
                                            color: "#fff",
                                            boxShadow: "0 4px 10px rgba(0,0,0,0.3)"
                                          }}
                                        >
                                          TIER {sIdx + 1}: {step}
                                        </div>
                                      );
                                    })}
                                  </div>
                                )}

                                {diagType === "quadrant" && (
                                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, maxWidth: "90%", margin: "6px auto" }}>
                                    {steps.slice(0, 4).map((step, sIdx) => {
                                      const quadNames = ["STRENGTHS / Q1", "WEAKNESSES / Q2", "OPPORTUNITIES / Q3", "THREATS / Q4"];
                                      return (
                                        <div key={sIdx} style={{ background: "rgba(15,23,42,0.9)", border: `1.5px solid ${selectedBgConfig?.accent || "#c084fc"}`, borderRadius: 10, padding: 12, textAlign: "left", boxShadow: "0 4px 12px rgba(0,0,0,0.4)" }}>
                                          <div style={{ fontSize: 10, fontWeight: 900, color: selectedBgConfig?.accent || "#c084fc", marginBottom: 4 }}>
                                            {quadNames[sIdx] || `QUADRANT ${sIdx + 1}`}
                                          </div>
                                          <div style={{ fontSize: p.data?.font_size || 12, color: "#fff", fontWeight: 700 }}>{step}</div>
                                        </div>
                                      );
                                    })}
                                  </div>
                                )}

                                {diagType === "comparison" && (
                                  <div style={{ display: "grid", gridTemplateColumns: `repeat(${Math.min(steps.length, 3)}, 1fr)`, gap: 12, padding: "6px 0" }}>
                                    {steps.map((step, sIdx) => (
                                      <div key={sIdx} style={{ background: "rgba(15,23,42,0.9)", borderTop: `4px solid ${selectedBgConfig?.accent || "#c084fc"}`, border: "1px solid rgba(255,255,255,0.15)", borderRadius: "8px 8px 12px 12px", padding: 12, textAlign: "center", boxShadow: "0 6px 16px rgba(0,0,0,0.4)" }}>
                                        <div style={{ fontSize: 10, fontWeight: 900, color: selectedBgConfig?.accent || "#c084fc", marginBottom: 6 }}>
                                          ⚔️ OPTION {sIdx + 1}
                                        </div>
                                        <div style={{ fontSize: p.data?.font_size || 12, color: "#fff", fontWeight: 700 }}>{step}</div>
                                      </div>
                                    ))}
                                  </div>
                                )}
                              </div>
                            );
                          })()
                        ) : null}

                        {p.type === "table" ? (
                          <div style={{ overflowX: "auto", margin: "8px 0" }}>
                            <table style={{ width: "100%", borderCollapse: "collapse", fontSize: p.data?.cell_font_size || 11, background: "rgba(0,0,0,0.35)", borderRadius: 8, overflow: "hidden", border: "1px solid rgba(255,255,255,0.12)" }}>
                              {safeArray(p.data?.headers).length > 0 && (
                                <thead>
                                  <tr style={{ background: p.data?.header_bg || `${selectedBgConfig?.accent || "#c084fc"}33` }}>
                                    {p.data.headers.map((h, hIdx) => (
                                      <th key={hIdx} style={{ padding: "6px 10px", textAlign: p.data?.align || "left", borderBottom: "1px solid rgba(255,255,255,0.15)", fontWeight: 700, fontSize: p.data?.header_font_size || 12, color: p.data?.header_color || selectedBgConfig?.accent || "#c084fc" }}>{h}</th>
                                    ))}
                                  </tr>
                                </thead>
                              )}
                              <tbody>
                                {safeArray(p.data?.rows).map((row, rIdx) => (
                                  <tr key={rIdx} style={{ background: p.data?.cell_bg ? p.data.cell_bg : (rIdx % 2 === 1 ? "rgba(255,255,255,0.04)" : "transparent"), borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
                                    {safeArray(row).map((cell, cIdx) => (
                                      <td key={cIdx} style={{ padding: "6px 10px", textAlign: p.data?.align || "left", color: p.data?.cell_color || "inherit", opacity: p.data?.cell_color ? 1 : 0.9 }}>{cell}</td>
                                    ))}
                                  </tr>
                                ))}
                              </tbody>
                            </table>
                          </div>
                        ) : null}
                      </div>
                    );

                    if (hasImage && hasText) {
                      const textPlugins = plugins.filter((p) => p.type === "bullets" || p.type === "paragraph" || p.type === "subtitle" || p.type === "text");
                      const imagePlugins = plugins.filter((p) => p.type === "image");
                      const otherPlugins = plugins.filter((p) => p.type !== "bullets" && p.type !== "paragraph" && p.type !== "subtitle" && p.type !== "text" && p.type !== "image");

                      return (
                        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                          <div style={{ display: "grid", gridTemplateColumns: "1.1fr 0.9fr", gap: 16, alignItems: "center" }}>
                            <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                              {textPlugins.map((p, pIdx) => renderPluginItem(p, `txt-${pIdx}`))}
                            </div>
                            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
                              {imagePlugins.map((p, pIdx) => renderPluginItem(p, `img-${pIdx}`))}
                            </div>
                          </div>
                          {otherPlugins.map((p, pIdx) => renderPluginItem(p, `oth-${pIdx}`))}
                        </div>
                      );
                    }

                    return plugins.map((p, pIdx) => renderPluginItem(p, pIdx));
                  })()}
                </div>
                )}
                
                {/* SPEAKER NOTES DISPLAY */}
                {activeSlide.plugins?.find((p) => p.type === "notes") ? (
                  <div style={{ background: "rgba(0,0,0,0.3)", padding: 8, borderRadius: 8, fontSize: 11, color: "rgba(255,255,255,0.8)" }}>
                    🗣️ Notes: {activeSlide.plugins.find((p) => p.type === "notes")?.data?.notes}
                  </div>
                ) : null}
              </div>
            );
          })()}

              {/* SLIDE BASIC & FORMATTING PROPERTIES */}
              <div className="card-box" style={{ background: "rgba(0,0,0,0.3)" }}>
                <div style={{ fontWeight: 800, fontSize: 13, color: "#c084fc", marginBottom: 10 }}>
                  ✏️ Edit Slide {activeSlideIndex + 1} General Info & Title Styling:
                </div>
                <div className="title-subtitle-grid" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
                  <div>
                    <label style={{ fontSize: 11, fontWeight: 700, color: "var(--text-muted)" }}>Slide Main Title:</label>
                    <input
                      type="text"
                      value={activeSlide.title || ""}
                      onChange={(e) => handleSlideTitleChange(activeSlideIndex, e.target.value)}
                      style={{ width: "100%", boxSizing: "border-box", background: "rgba(0,0,0,0.4)", border: "1px solid var(--panel-border)", borderRadius: 8, padding: 8, color: "#fff", fontSize: 13 }}
                    />
                  </div>
                  <div>
                    <label style={{ fontSize: 11, fontWeight: 700, color: "var(--text-muted)" }}>Slide Subtitle / Tagline:</label>
                    <input
                      type="text"
                      value={activeSlide.subtitle || ""}
                      onChange={(e) => handleSlideSubtitleChange(activeSlideIndex, e.target.value)}
                      placeholder="e.g. Overview & Key Metrics"
                      style={{ width: "100%", boxSizing: "border-box", background: "rgba(0,0,0,0.4)", border: "1px solid var(--panel-border)", borderRadius: 8, padding: 8, color: "#fff", fontSize: 13 }}
                    />
                  </div>
                </div>

                {/* TITLE & SUBTITLE FORMATTING BAR */}
                <div className="title-subtitle-formatting-bar" style={{ marginTop: 10, paddingTop: 10, borderTop: "1px dashed rgba(255,255,255,0.1)", display: "flex", gap: 16, alignItems: "flex-end", flexWrap: "wrap", justifyContent: "flex-start" }}>
                  {/* TITLE CONTROLS */}
                  <div style={{ display: "flex", gap: 10, alignItems: "flex-end", flexWrap: "wrap" }}>
                    <div style={{ fontSize: 12, fontWeight: "700", color: "#c084fc", marginBottom: "5px" }}>Title:</div>
                    <div>
                      <label style={{ fontSize: 11, fontWeight: "500", color: "rgba(255,255,255,0.65)", marginBottom: 4, display: "block" }}>Font Size (Pt):</label>
                      <input
                        type="number"
                        min="14"
                        max="60"
                        value={activeSlide.title_font_size || 26}
                        onChange={(e) => handleSlidePropertyChange(activeSlideIndex, "title_font_size", Number(e.target.value))}
                        style={{ background: "#090d16", border: "1px solid rgba(255,255,255,0.15)", borderRadius: 8, padding: "4px 8px", color: "#fff", fontSize: 12, width: 70, height: 28, boxSizing: "border-box" }}
                      />
                    </div>
                    <div>
                      <label style={{ fontSize: 11, fontWeight: "500", color: "rgba(255,255,255,0.65)", marginBottom: 4, display: "block" }}>Font Color:</label>
                      <div style={{ background: "#090d16", border: "1px solid rgba(255,255,255,0.15)", borderRadius: 8, padding: 2, display: "flex", alignItems: "center", justifyContent: "center", width: 34, height: 28, boxSizing: "border-box" }}>
                        <input
                          type="color"
                          value={activeSlide.title_color || "#ffffff"}
                          onChange={(e) => handleSlidePropertyChange(activeSlideIndex, "title_color", e.target.value)}
                          style={{ border: "none", width: 26, height: 22, borderRadius: 4, cursor: "pointer", background: "none" }}
                        />
                      </div>
                    </div>
                    <div>
                      <label style={{ fontSize: 11, fontWeight: "500", color: "rgba(255,255,255,0.65)", marginBottom: 4, display: "block" }}>H-Align:</label>
                      <select
                        value={activeSlide.title_align || "auto"}
                        onChange={(e) => handleSlidePropertyChange(activeSlideIndex, "title_align", e.target.value)}
                        style={{ background: "#090d16", border: "1px solid rgba(255,255,255,0.15)", borderRadius: 8, padding: "4px 8px", color: "#fff", fontSize: 12, width: 95, height: 28, boxSizing: "border-box" }}
                      >
                       
                        <option value="left">Left</option>
                        <option value="center">Center</option>
                        <option value="right">Right</option>
                        <option value="justify">Justify</option>
                      </select>
                    </div>
                    <div>
                      <label style={{ fontSize: 11, fontWeight: "500", color: "rgba(255,255,255,0.65)", marginBottom: 4, display: "block" }}>V-Align:</label>
                      <select
                        value={activeSlide.title_valign || "auto"}
                        onChange={(e) => handleSlidePropertyChange(activeSlideIndex, "title_valign", e.target.value)}
                        style={{ background: "#090d16", border: "1px solid rgba(255,255,255,0.15)", borderRadius: 8, padding: "4px 8px", color: "#fff", fontSize: 12, width: 95, height: 28, boxSizing: "border-box" }}
                      >
                       
                        <option value="top">Top</option>
                        <option value="middle">Middle</option>
                        <option value="bottom">Bottom</option>
                      </select>
                    </div>
                  </div>

                  {/* SUBTITLE CONTROLS */}
                  <div style={{ display: "flex", gap: 10, alignItems: "flex-end", flexWrap: "wrap" }}>
                    <div style={{ fontSize: 12, fontWeight: "700", color: "#c084fc", marginBottom: "5px" }}>Subtitle:</div>
                    <div>
                      <label style={{ fontSize: 11, fontWeight: "500", color: "rgba(255,255,255,0.65)", marginBottom: 4, display: "block" }}>Font Size (Pt):</label>
                      <input
                        type="number"
                        min="10"
                        max="36"
                        value={activeSlide.subtitle_font_size || 15}
                        onChange={(e) => handleSlidePropertyChange(activeSlideIndex, "subtitle_font_size", Number(e.target.value))}
                        style={{ background: "#090d16", border: "1px solid rgba(255,255,255,0.15)", borderRadius: 8, padding: "4px 8px", color: "#fff", fontSize: 12, width: 70, height: 28, boxSizing: "border-box" }}
                      />
                    </div>
                    <div>
                      <label style={{ fontSize: 11, fontWeight: "500", color: "rgba(255,255,255,0.65)", marginBottom: 4, display: "block" }}>Font Color:</label>
                      <div style={{ background: "#090d16", border: "1px solid rgba(255,255,255,0.15)", borderRadius: 8, padding: 2, display: "flex", alignItems: "center", justifyContent: "center", width: 34, height: 28, boxSizing: "border-box" }}>
                        <input
                          type="color"
                          value={activeSlide.subtitle_color || "#94a3b8"}
                          onChange={(e) => handleSlidePropertyChange(activeSlideIndex, "subtitle_color", e.target.value)}
                          style={{ border: "none", width: 26, height: 22, borderRadius: 4, cursor: "pointer", background: "none" }}
                        />
                      </div>
                    </div>
                    <div>
                      <label style={{ fontSize: 11, fontWeight: "500", color: "rgba(255,255,255,0.65)", marginBottom: 4, display: "block" }}>H-Align:</label>
                      <select
                        value={activeSlide.subtitle_align || "auto"}
                        onChange={(e) => handleSlidePropertyChange(activeSlideIndex, "subtitle_align", e.target.value)}
                        style={{ background: "#090d16", border: "1px solid rgba(255,255,255,0.15)", borderRadius: 8, padding: "4px 8px", color: "#fff", fontSize: 12, width: 95, height: 28, boxSizing: "border-box" }}
                      >
                       
                        <option value="left">Left</option>
                        <option value="center">Center</option>
                        <option value="right">Right</option>
                        <option value="justify">Justify</option>
                      </select>
                    </div>
                    <div>
                      <label style={{ fontSize: 11, fontWeight: "500", color: "rgba(255,255,255,0.65)", marginBottom: 4, display: "block" }}>V-Align:</label>
                      <select
                        value={activeSlide.subtitle_valign || "auto"}
                        onChange={(e) => handleSlidePropertyChange(activeSlideIndex, "subtitle_valign", e.target.value)}
                        style={{ background: "#090d16", border: "1px solid rgba(255,255,255,0.15)", borderRadius: 8, padding: "4px 8px", color: "#fff", fontSize: 12, width: 95, height: 28, boxSizing: "border-box" }}
                      >
                        
                        <option value="top">Top</option>
                        <option value="middle">Middle</option>
                        <option value="bottom">Bottom</option>
                      </select>
                    </div>
                  </div>
                </div>
              </div>
               
              {/* EDITABLE FEATURE BLOCKS LIST */}
              <div>
                <div style={{ fontWeight: 800, fontSize: 13, color: "#c084fc", marginBottom: 10 }}>
                  🧩 Edit Feature Blocks on Slide {activeSlideIndex + 1}:
                </div>

                {/* ADD FEATURE BLOCK BUTTON BAR (ICON ONLY WITH HOVER TOOLTIPS 🎯) */}
                <div className="add-feature-bar" style={{ marginBottom: 14, paddingBottom: 10, borderBottom: "1px dashed rgba(255,255,255,0.15)", display: "flex", flexWrap: "wrap", gap: 8, alignItems: "center" }}>
                  <span style={{ fontSize: 11, fontWeight: 700, color: "var(--text-muted)", marginRight: 4 }}></span>
                  <button
                    className="btn-ui secondary sm"
                    title="Paragraph"
                    onClick={() => handleAddPlugin(activeSlideIndex, "paragraph")}
                    style={{ padding: "5px 12px", fontSize: 15, fontWeight: "bold", cursor: "pointer" }}
                  >
                    <span className="btn-icon">¶</span><span className="btn-label">Paragraph</span>
                  </button>
                  <button
                    className="btn-ui secondary sm"
                    title="2 Paragraphs"
                    onClick={() => handleAddPlugin(activeSlideIndex, "paragraph_2col")}
                    style={{ padding: "5px 10px", fontSize: 14, fontWeight: "bold", cursor: "pointer" }}
                  >
                    <span className="btn-icon">¶¶</span><span className="btn-label">2 Paragraphs</span>
                  </button>
                  <button
                    className="btn-ui secondary sm"
                    title="Points"
                    onClick={() => handleAddPlugin(activeSlideIndex, "bullets")}
                    style={{ padding: "5px 12px", fontSize: 14, cursor: "pointer" }}
                  >
                    <span className="btn-icon">•</span><span className="btn-label">Points</span>
                  </button>
                  <button
                    className="btn-ui secondary sm"
                    title="Subtitle"
                    onClick={() => handleAddPlugin(activeSlideIndex, "subtitle")}
                    style={{ padding: "5px 12px", fontSize: 14, cursor: "pointer" }}
                  >
                    <span className="btn-icon">📝</span><span className="btn-label">Subtitle</span>
                  </button>
                  <button
                    className="btn-ui secondary sm"
                    title="Diagram"
                    onClick={() => handleAddPlugin(activeSlideIndex, "diagram")}
                    style={{ padding: "5px 12px", fontSize: 14, cursor: "pointer" }}
                  >
                    <span className="btn-icon">⚙️</span><span className="btn-label">Diagram</span>
                  </button>
                  <button
                    className="btn-ui secondary sm"
                    title="Chart"
                    onClick={() => handleAddPlugin(activeSlideIndex, "chart")}
                    style={{ padding: "5px 12px", fontSize: 14, cursor: "pointer" }}
                  >
                    <span className="btn-icon">📊</span><span className="btn-label">Chart</span>
                  </button>
                  <button
                    className="btn-ui secondary sm"
                    title="Table"
                    onClick={() => handleAddPlugin(activeSlideIndex, "table")}
                    style={{ padding: "5px 12px", fontSize: 14, cursor: "pointer" }}
                  >
                    <span className="btn-icon">📋</span><span className="btn-label">Table</span>
                  </button>
                  <button
                    className="btn-ui secondary sm"
                    title="Metric"
                    onClick={() => handleAddPlugin(activeSlideIndex, "stat")}
                    style={{ padding: "5px 12px", fontSize: 14, cursor: "pointer" }}
                  >
                    <span className="btn-icon">📈</span><span className="btn-label">Metric</span>
                  </button>
                  <button
                    className="btn-ui secondary sm"
                    title="Image"
                    onClick={() => handleAddPlugin(activeSlideIndex, "image")}
                    style={{ padding: "5px 12px", fontSize: 14, cursor: "pointer" }}
                  >
                    <span className="btn-icon">🖼️</span><span className="btn-label">Image</span>
                  </button>

                  <label
                    className="btn-ui secondary sm"
                    title="Upload Custom Image File from Computer"
                    style={{ padding: "5px 12px", fontSize: 14, cursor: "pointer", display: "inline-flex", alignItems: "center", gap: 4 }}
                  >
                    <span className="btn-icon">📤</span><span className="btn-label">Upload Image</span>
                    <input
                      type="file"
                      accept="image/*"
                      style={{ display: "none" }}
                      onChange={(e) => handleImageFileUpload(e, null)}
                    />
                  </label>
                  <button
                    className="btn-ui secondary sm"
                    title="Notes"
                    onClick={() => handleAddPlugin(activeSlideIndex, "notes")}
                    style={{ padding: "5px 12px", fontSize: 14, cursor: "pointer" }}
                  >
                    <span className="btn-icon">🗣️</span><span className="btn-label">Notes</span>
                  </button>
                </div>

                {safeArray(activeSlide.plugins).map((plugin, pIdx) => (
                  <div key={pIdx} className="feature-block-card">
                    <div className="feature-block-header">
                      <span>
                        {(plugin.type === "subtitle" || plugin.type === "text") && "📝 Subtitle / Text Block"}
                        {plugin.type === "chart" && "📊 Visual Chart Block"}
                        {plugin.type === "image" && "🖼️ Image Block"}
                        {plugin.type === "bullets" && "• Bullet Points Block"}
                        {plugin.type === "paragraph" && "¶ Single Paragraph Block"}
                        {plugin.type === "paragraph_2col" && "¶¶ 2-Column Paragraphs Block"}
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

                    {/* SUBTITLE / TEXT */}
                    {plugin.type === "subtitle" || plugin.type === "text" ? (
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
                          isRefining={refiningPluginIdx === pIdx}
                        />
                      </div>
                    ) : null}

                    {/* DIAGRAM FEATURE BLOCK EDITOR */}
                    {plugin.type === "diagram" ? (
                      <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                        {/* 1. VISUAL DIAGRAM STRUCTURE PRESET SELECTOR */}
                        <div style={{ background: "rgba(255,255,255,0.03)", padding: 10, borderRadius: 10, border: "1px solid rgba(255,255,255,0.08)" }}>
                          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
                            <label style={{ fontSize: 11, fontWeight: 700, color: "#c084fc", display: "flex", alignItems: "center", gap: 4 }}>
                              📐 Visual Diagram Layout & Structure Preset:
                            </label>
                            <span style={{ fontSize: 10, opacity: 0.9, color: "#86efac", background: "rgba(34, 197, 94, 0.15)", padding: "2px 8px", borderRadius: 6, border: "1px solid rgba(34, 197, 94, 0.3)", fontWeight: 700 }}>
                              Active: {(plugin.data?.diagram_type || "auto").toUpperCase()}
                            </span>
                          </div>

                          <div className="diagram-chips-row" style={{ display: "flex", flexWrap: "nowrap", overflowX: "auto", gap: 6, alignItems: "center", width: "100%", paddingBottom: 4 }}>
                            {[
                              { id: "flowchart", label: "🔄 Flowchart", defaultText: "[Start Process] ➜ [Data Ingestion] ➜ [Processing Engine] ➜ [Output Result]" },
                              { id: "architecture", label: "🏛️ Architecture Stack", defaultText: "[User & Presentation Layer] ➜ [API Gateway & Business Logic] ➜ [Database & Security Tier]" },
                              { id: "timeline", label: "📅 Timeline & Roadmap", defaultText: "[Phase 1: Setup] ➜ [Phase 2: Core Development] ➜ [Phase 3: Testing] ➜ [Phase 4: Global Launch]" },
                              { id: "tree", label: "🌳 Tree Hierarchy", defaultText: "[Root System Concept] ➜ [Branch A: Frontend Service] ➜ [Branch B: Backend Engine] ➜ [Leaf Node: Database]" },
                              { id: "io_cards", label: "📥 I/O Cards", defaultText: "[Raw Data Ingestion] ➜ [High Performance Computing Engine] ➜ [Analytics & Report Output]" },
                              { id: "mindmap", label: "🧠 Mindmap Core", defaultText: "[Central Core Topic] ➜ [Subtopic A: Strategy] ➜ [Subtopic B: Operations] ➜ [Subtopic C: Metrics]" },
                              { id: "funnel", label: "🔻 Funnel Conversion", defaultText: "[Stage 1: Awareness 100%] ➜ [Stage 2: Interest 60%] ➜ [Stage 3: Decision 30%] ➜ [Stage 4: Action 10%]" },
                              { id: "cycle", label: "🔁 Iteration Cycle", defaultText: "[Requirement Phase] ➜ [Design & Build] ➜ [Validation Test] ➜ [Deployment Loop]" },
                              { id: "pyramid", label: "🔺 Tiered Pyramid", defaultText: "[Foundation Security Layer] ➜ [Infrastructure & Network Tier] ➜ [Executive Peak]" },
                              { id: "quadrant", label: "🧭 2x2 Matrix", defaultText: "[Strengths: High Speed] ➜ [Weaknesses: Storage Limits] ➜ [Opportunities: Growth] ➜ [Threats: Risk]" },
                              { id: "comparison", label: "⚔️ Comparison", defaultText: "[Option A: Cloud Microservices] ➜ [Option B: On-Premises Monolith]" },
                            ].map((diagOpt) => {
                              const textRaw = plugin.data?.diagram || plugin.data?.text || "";
                              const currentType = detectDiagramType(textRaw, plugin.data?.diagram_type);
                              const isActive = currentType === diagOpt.id;
                              return (
                                <button
                                  key={diagOpt.id}
                                  type="button"
                                  className="btn-ui secondary sm"
                                  title={`Switch to ${diagOpt.label} Diagram`}
                                  onClick={() => {
                                    handlePluginTextChange(activeSlideIndex, pIdx, "diagram_type", diagOpt.id);
                                    handlePluginTextChange(activeSlideIndex, pIdx, "diagram", diagOpt.defaultText);
                                    handlePluginTextChange(activeSlideIndex, pIdx, "text", diagOpt.defaultText);
                                  }}
                                  style={{
                                    padding: "6px 12px",
                                    fontSize: 11,
                                    fontWeight: "bold",
                                    cursor: "pointer",
                                    borderRadius: 8,
                                    whiteSpace: "nowrap",
                                    flexShrink: 0,
                                    transition: "all 0.2s ease",
                                    border: isActive ? "1px solid #c084fc" : "1px solid rgba(255,255,255,0.12)",
                                    background: isActive ? "linear-gradient(135deg, rgba(192, 132, 252, 0.35) 0%, rgba(124, 58, 237, 0.4) 100%)" : "rgba(0,0,0,0.3)",
                                    color: isActive ? "#ffffff" : "rgba(255,255,255,0.85)",
                                    boxShadow: isActive ? "0 0 12px rgba(192, 132, 252, 0.4)" : "none",
                                  }}
                                >
                                  {diagOpt.label}
                                </button>
                              );
                            })}
                          </div>
                        </div>

                        {/* 2. DIAGRAM TITLE FIELD */}
                        <div>
                          <label style={{ fontSize: 11, fontWeight: 700, color: "var(--text-muted)", display: "block", marginBottom: 4 }}>Diagram Title / Header:</label>
                          <input
                            type="text"
                            value={plugin.data?.title || plugin.data?.diagram_title || ""}
                            onChange={(e) => {
                              handlePluginTextChange(activeSlideIndex, pIdx, "title", e.target.value);
                              handlePluginTextChange(activeSlideIndex, pIdx, "diagram_title", e.target.value);
                            }}
                            placeholder="e.g. System Architecture & Process Workflow"
                            style={{ width: "100%", background: "rgba(0,0,0,0.4)", border: "1px solid var(--panel-border)", borderRadius: 8, padding: 8, color: "#fff", fontSize: 13 }}
                          />
                        </div>

                        {/* 3. INTERACTIVE NODE STEP-BY-STEP CHIP BUILDER */}
                        {(() => {
                          const currentTextRaw = plugin.data?.diagram || plugin.data?.text || "";
                          const stepsList = parseDiagramSteps(currentTextRaw);
                          const effectiveSteps = stepsList.length > 0 ? stepsList : ["Step 1", "Step 2"];

                          const updateSteps = (newStepsArr) => {
                            const formatted = newStepsArr.map(s => {
                              const trimmed = s.trim();
                              return trimmed ? (trimmed.startsWith("[") && trimmed.endsWith("]") ? trimmed : `[${trimmed}]`) : "";
                            }).filter(Boolean).join(" ➜ ");
                            handlePluginTextChange(activeSlideIndex, pIdx, "diagram", formatted);
                            handlePluginTextChange(activeSlideIndex, pIdx, "text", formatted);
                          };

                          return (
                            <div style={{ background: "rgba(15, 23, 42, 0.6)", padding: 12, borderRadius: 10, border: "1px solid rgba(192, 132, 252, 0.25)", display: "flex", flexDirection: "column", gap: 10 }}>
                              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                                <label style={{ fontSize: 11, fontWeight: 700, color: "#a78bfa", display: "flex", alignItems: "center", gap: 6 }}>
                                  🧩 Interactive Diagram Step/Node Builder ({effectiveSteps.length} Steps):
                                </label>
                                <button
                                  type="button"
                                  className="btn-ui primary sm"
                                  onClick={() => updateSteps([...effectiveSteps, `Step ${effectiveSteps.length + 1}`])}
                                  style={{ padding: "4px 10px", fontSize: 10, fontWeight: 700, borderRadius: 6, background: "linear-gradient(135deg, #a855f7 0%, #7c3aed 100%)", color: "#fff", border: "none", cursor: "pointer", display: "flex", alignItems: "center", gap: 4 }}
                                >
                                  ➕ Add Step
                                </button>
                              </div>

                              {/* STEP CHIPS LIST */}
                              <div style={{ display: "flex", flexDirection: "column", gap: 6, maxHeight: 220, overflowY: "auto", paddingRight: 4 }}>
                                {effectiveSteps.map((stepVal, sIdx) => (
                                  <div key={sIdx} style={{ display: "flex", alignItems: "center", gap: 6, background: "rgba(255,255,255,0.04)", padding: "4px 8px", borderRadius: 8, border: "1px solid rgba(255,255,255,0.08)" }}>
                                    <span style={{ fontSize: 10, fontWeight: 800, color: "#c084fc", background: "rgba(192, 132, 252, 0.15)", padding: "2px 6px", borderRadius: 4, flexShrink: 0 }}>
                                      #{sIdx + 1}
                                    </span>
                                    <input
                                      type="text"
                                      value={stepVal}
                                      onChange={(e) => {
                                        const updated = [...effectiveSteps];
                                        updated[sIdx] = e.target.value;
                                        updateSteps(updated);
                                      }}
                                      placeholder={`Enter text for step ${sIdx + 1}`}
                                      style={{ flex: 1, background: "rgba(0,0,0,0.5)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 6, padding: "5px 8px", color: "#fff", fontSize: 12 }}
                                    />
                                    {/* MOVE REORDER BUTTONS */}
                                    <button
                                      type="button"
                                      disabled={sIdx === 0}
                                      onClick={() => {
                                        if (sIdx === 0) return;
                                        const updated = [...effectiveSteps];
                                        const temp = updated[sIdx];
                                        updated[sIdx] = updated[sIdx - 1];
                                        updated[sIdx - 1] = temp;
                                        updateSteps(updated);
                                      }}
                                      style={{ opacity: sIdx === 0 ? 0.3 : 0.8, cursor: sIdx === 0 ? "default" : "pointer", background: "transparent", border: "none", color: "#a78bfa", fontSize: 11, padding: "0 2px" }}
                                      title="Move up"
                                    >
                                      ▲
                                    </button>
                                    <button
                                      type="button"
                                      disabled={sIdx === effectiveSteps.length - 1}
                                      onClick={() => {
                                        if (sIdx === effectiveSteps.length - 1) return;
                                        const updated = [...effectiveSteps];
                                        const temp = updated[sIdx];
                                        updated[sIdx] = updated[sIdx + 1];
                                        updated[sIdx + 1] = temp;
                                        updateSteps(updated);
                                      }}
                                      style={{ opacity: sIdx === effectiveSteps.length - 1 ? 0.3 : 0.8, cursor: sIdx === effectiveSteps.length - 1 ? "default" : "pointer", background: "transparent", border: "none", color: "#a78bfa", fontSize: 11, padding: "0 2px" }}
                                      title="Move down"
                                    >
                                      ▼
                                    </button>
                                    {/* DELETE STEP BUTTON */}
                                    <button
                                      type="button"
                                      onClick={() => {
                                        const updated = effectiveSteps.filter((_, idx) => idx !== sIdx);
                                        updateSteps(updated.length > 0 ? updated : ["Step 1"]);
                                      }}
                                      style={{ background: "rgba(239, 68, 68, 0.15)", border: "1px solid rgba(239, 68, 68, 0.3)", borderRadius: 4, color: "#f87171", cursor: "pointer", fontSize: 10, padding: "2px 6px" }}
                                      title="Delete this step"
                                    >
                                      ✕
                                    </button>
                                  </div>
                                ))}
                              </div>
                            </div>
                          );
                        })()}

                        <FeatureFormattingBar
                          pluginData={plugin.data}
                          onChangeField={(fld, val) => handlePluginTextChange(activeSlideIndex, pIdx, fld, val)}
                          onRefineText={() => handleAIRefine(pIdx, "diagram")}
                          isRefining={refiningPluginIdx === pIdx}
                        />
                      </div>
                    ) : null}

                    {/* TABLE */}
                    {plugin.type === "table" ? (
                      <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                        {/* 1. TABLE TITLE / HEADER */}
                        <div>
                          <label style={{ fontSize: 11, fontWeight: 700, color: "var(--text-muted)", display: "block", marginBottom: 4 }}>Table Title / Header:</label>
                          <input
                            type="text"
                            value={plugin.data?.title || ""}
                            onChange={(e) => handlePluginTextChange(activeSlideIndex, pIdx, "title", e.target.value)}
                            placeholder="e.g. Feature & Model Architecture Comparison"
                            style={{ width: "100%", background: "rgba(0,0,0,0.4)", border: "1px solid var(--panel-border)", borderRadius: 8, padding: 8, color: "#fff", fontSize: 13 }}
                          />
                        </div>

                        {/* 2. TABLE VISUAL THEME PRESET SELECTOR & COLOR PICKERS */}
                        <div style={{ background: "rgba(255,255,255,0.03)", padding: "10px 12px", borderRadius: 10, border: "1px solid rgba(255,255,255,0.08)", display: "flex", flexDirection: "column", gap: 8 }}>
                          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 10 }}>
                            <div style={{ display: "flex", alignItems: "center", gap: 8, flex: 1, minWidth: 220 }}>
                              <label style={{ fontSize: 11, fontWeight: 700, color: "#c084fc", whiteSpace: "nowrap" }}>
                                🎨 Table Theme:
                              </label>
                              <select
                                value={plugin.data?.table_theme || "custom"}
                                onChange={(e) => {
                                  const selectedId = e.target.value;
                                  handlePluginTextChange(activeSlideIndex, pIdx, "table_theme", selectedId);
                                  const found = TABLE_THEME_PRESETS.find(t => t.id === selectedId);
                                  if (found) {
                                    handlePluginTextChange(activeSlideIndex, pIdx, "header_bg", found.header_bg);
                                    handlePluginTextChange(activeSlideIndex, pIdx, "header_color", found.header_color);
                                    handlePluginTextChange(activeSlideIndex, pIdx, "cell_bg", found.cell_bg);
                                    handlePluginTextChange(activeSlideIndex, pIdx, "cell_color", found.cell_color);
                                  }
                                }}
                                style={{ flex: 1, background: "rgba(0,0,0,0.5)", border: "1px solid rgba(192, 132, 252, 0.4)", borderRadius: 8, padding: "6px 10px", color: "#fff", fontSize: 12, fontWeight: 600 }}
                              >
                                {TABLE_THEME_PRESETS.map((themePreset) => (
                                  <option key={themePreset.id} value={themePreset.id} style={{ background: "#0f172a", color: "#fff" }}>
                                    {themePreset.icon} {themePreset.name}
                                  </option>
                                ))}
                              </select>
                            </div>

                            {/* COLOR PICKERS ROW */}
                            <div style={{ display: "flex", gap: 12, alignItems: "center", flexWrap: "wrap" }}>
                              <label style={{ fontSize: 10, color: "var(--text-muted)", display: "flex", alignItems: "center", gap: 4 }}>
                                Header BG:
                                <input
                                  type="color"
                                  value={plugin.data?.header_bg || "#8b5cf6"}
                                  onChange={(e) => {
                                    handlePluginTextChange(activeSlideIndex, pIdx, "table_theme", "custom");
                                    handlePluginTextChange(activeSlideIndex, pIdx, "header_bg", e.target.value);
                                  }}
                                  style={{ border: "none", width: 22, height: 22, borderRadius: 4, cursor: "pointer", background: "none" }}
                                />
                              </label>
                              <label style={{ fontSize: 10, color: "var(--text-muted)", display: "flex", alignItems: "center", gap: 4 }}>
                                Header Text:
                                <input
                                  type="color"
                                  value={plugin.data?.header_color || "#ffffff"}
                                  onChange={(e) => {
                                    handlePluginTextChange(activeSlideIndex, pIdx, "table_theme", "custom");
                                    handlePluginTextChange(activeSlideIndex, pIdx, "header_color", e.target.value);
                                  }}
                                  style={{ border: "none", width: 22, height: 22, borderRadius: 4, cursor: "pointer", background: "none" }}
                                />
                              </label>
                              <label style={{ fontSize: 10, color: "var(--text-muted)", display: "flex", alignItems: "center", gap: 4 }}>
                                Rows BG:
                                <input
                                  type="color"
                                  value={plugin.data?.cell_bg || "#1e293b"}
                                  onChange={(e) => {
                                    handlePluginTextChange(activeSlideIndex, pIdx, "table_theme", "custom");
                                    handlePluginTextChange(activeSlideIndex, pIdx, "cell_bg", e.target.value);
                                  }}
                                  style={{ border: "none", width: 22, height: 22, borderRadius: 4, cursor: "pointer", background: "none" }}
                                />
                              </label>
                              <label style={{ fontSize: 10, color: "var(--text-muted)", display: "flex", alignItems: "center", gap: 4 }}>
                                Rows Text:
                                <input
                                  type="color"
                                  value={plugin.data?.cell_color || "#ffffff"}
                                  onChange={(e) => {
                                    handlePluginTextChange(activeSlideIndex, pIdx, "table_theme", "custom");
                                    handlePluginTextChange(activeSlideIndex, pIdx, "cell_color", e.target.value);
                                  }}
                                  style={{ border: "none", width: 22, height: 22, borderRadius: 4, cursor: "pointer", background: "none" }}
                                />
                              </label>
                            </div>
                          </div>
                        </div>

                        {/* 3. INTERACTIVE COLUMN HEADERS BUILDER */}
                        {(() => {
                          const headersArr = safeArray(plugin.data?.headers);
                          const effectiveHeaders = headersArr.length > 0 ? headersArr : ["Column 1", "Column 2", "Column 3"];

                          const updateHeaders = (newHeadersArr) => {
                            handleChartDataChange(activeSlideIndex, pIdx, "headers", newHeadersArr.join(", "));
                            const currentRows = safeArray(plugin.data?.rows);
                            const updatedRows = currentRows.map(r => {
                              const rList = safeArray(r);
                              if (rList.length < newHeadersArr.length) {
                                return [...rList, ...Array(newHeadersArr.length - rList.length).fill("")];
                              }
                              return rList.slice(0, newHeadersArr.length);
                            });
                            handlePluginTextChange(activeSlideIndex, pIdx, "rows", updatedRows);
                          };

                          return (
                            <div style={{ background: "rgba(15, 23, 42, 0.6)", padding: 12, borderRadius: 10, border: "1px solid rgba(192, 132, 252, 0.25)", display: "flex", flexDirection: "column", gap: 10 }}>
                              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                                <label style={{ fontSize: 11, fontWeight: 700, color: "#a78bfa", display: "flex", alignItems: "center", gap: 6 }}>
                                  📋 Table Column Headers ({effectiveHeaders.length} Columns):
                                </label>
                                <button
                                  type="button"
                                  className="btn-ui primary sm"
                                  onClick={() => updateHeaders([...effectiveHeaders, `Column ${effectiveHeaders.length + 1}`])}
                                  style={{ padding: "4px 10px", fontSize: 10, fontWeight: 700, borderRadius: 6, background: "linear-gradient(135deg, #a855f7 0%, #7c3aed 100%)", color: "#fff", border: "none", cursor: "pointer", display: "flex", alignItems: "center", gap: 4 }}
                                >
                                  ➕ Add Column
                                </button>
                              </div>

                              <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                                {effectiveHeaders.map((hVal, hIdx) => (
                                  <div key={hIdx} style={{ display: "flex", alignItems: "center", gap: 4, background: "rgba(255,255,255,0.05)", padding: "4px 6px", borderRadius: 8, border: "1px solid rgba(255,255,255,0.1)" }}>
                                    <span style={{ fontSize: 9, fontWeight: 800, color: "#c084fc", background: "rgba(192, 132, 252, 0.15)", padding: "2px 5px", borderRadius: 4 }}>
                                      Col {hIdx + 1}
                                    </span>
                                    <input
                                      type="text"
                                      value={hVal}
                                      onChange={(e) => {
                                        const updated = [...effectiveHeaders];
                                        updated[hIdx] = e.target.value;
                                        updateHeaders(updated);
                                      }}
                                      style={{ width: 110, background: "rgba(0,0,0,0.5)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 4, padding: "3px 6px", color: "#fff", fontSize: 11 }}
                                    />
                                    <button
                                      type="button"
                                      disabled={effectiveHeaders.length <= 1}
                                      onClick={() => {
                                        const updated = effectiveHeaders.filter((_, idx) => idx !== hIdx);
                                        updateHeaders(updated);
                                      }}
                                      style={{ background: "rgba(239, 68, 68, 0.15)", border: "1px solid rgba(239, 68, 68, 0.3)", borderRadius: 4, color: "#f87171", cursor: "pointer", fontSize: 10, padding: "1px 5px" }}
                                      title="Delete column"
                                    >
                                      ✕
                                    </button>
                                  </div>
                                ))}
                              </div>
                            </div>
                          );
                        })()}

                        {/* 4. INTERACTIVE TABLE DATA ROWS BUILDER GRID */}
                        {(() => {
                          const headersArr = safeArray(plugin.data?.headers);
                          const effectiveHeaders = headersArr.length > 0 ? headersArr : ["Column 1", "Column 2", "Column 3"];
                          const currentRows = safeArray(plugin.data?.rows);
                          const effectiveRows = currentRows.length > 0 ? currentRows : [["Data A1", "Data B1", "Data C1"], ["Data A2", "Data B2", "Data C2"]];

                          const updateCell = (rIdx, cIdx, val) => {
                            const updatedRows = effectiveRows.map((r, idx) => {
                              if (idx !== rIdx) return r;
                              const rowArr = [...safeArray(r)];
                              while (rowArr.length <= cIdx) rowArr.push("");
                              rowArr[cIdx] = val;
                              return rowArr;
                            });
                            handlePluginTextChange(activeSlideIndex, pIdx, "rows", updatedRows);
                          };

                          const addRow = () => {
                            const newRow = Array(effectiveHeaders.length).fill("");
                            newRow[0] = `Row ${effectiveRows.length + 1}`;
                            handlePluginTextChange(activeSlideIndex, pIdx, "rows", [...effectiveRows, newRow]);
                          };

                          const deleteRow = (rIdx) => {
                            const updated = effectiveRows.filter((_, idx) => idx !== rIdx);
                            handlePluginTextChange(activeSlideIndex, pIdx, "rows", updated.length > 0 ? updated : [Array(effectiveHeaders.length).fill("")]);
                          };

                          const moveRow = (rIdx, targetIdx) => {
                            if (targetIdx < 0 || targetIdx >= effectiveRows.length) return;
                            const updated = [...effectiveRows];
                            const temp = updated[rIdx];
                            updated[rIdx] = updated[targetIdx];
                            updated[targetIdx] = temp;
                            handlePluginTextChange(activeSlideIndex, pIdx, "rows", updated);
                          };

                          return (
                            <div style={{ background: "rgba(15, 23, 42, 0.6)", padding: 12, borderRadius: 10, border: "1px solid rgba(192, 132, 252, 0.25)", display: "flex", flexDirection: "column", gap: 10 }}>
                              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                                <label style={{ fontSize: 11, fontWeight: 700, color: "#38bdf8", display: "flex", alignItems: "center", gap: 6 }}>
                                  📑 Interactive Table Data Grid ({effectiveRows.length} Rows):
                                </label>
                                <button
                                  type="button"
                                  className="btn-ui primary sm"
                                  onClick={addRow}
                                  style={{ padding: "4px 10px", fontSize: 10, fontWeight: 700, borderRadius: 6, background: "linear-gradient(135deg, #0284c7 0%, #2563eb 100%)", color: "#fff", border: "none", cursor: "pointer", display: "flex", alignItems: "center", gap: 4 }}
                                >
                                  ➕ Add Table Row
                                </button>
                              </div>

                              {/* ROWS LIST */}
                              <div style={{ display: "flex", flexDirection: "column", gap: 8, maxHeight: 280, overflowY: "auto", paddingRight: 4 }}>
                                {effectiveRows.map((rowItems, rIdx) => (
                                  <div key={rIdx} style={{ background: "rgba(255,255,255,0.03)", padding: 8, borderRadius: 8, border: "1px solid rgba(255,255,255,0.08)", display: "flex", flexDirection: "column", gap: 6 }}>
                                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                                      <span style={{ fontSize: 10, fontWeight: 800, color: "#38bdf8", background: "rgba(56, 189, 248, 0.15)", padding: "2px 8px", borderRadius: 4 }}>
                                        Row #{rIdx + 1}
                                      </span>
                                      <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
                                        <button
                                          type="button"
                                          disabled={rIdx === 0}
                                          onClick={() => moveRow(rIdx, rIdx - 1)}
                                          style={{ opacity: rIdx === 0 ? 0.3 : 0.8, cursor: rIdx === 0 ? "default" : "pointer", background: "transparent", border: "none", color: "#38bdf8", fontSize: 11, padding: "0 4px" }}
                                          title="Move row up"
                                        >
                                          ▲
                                        </button>
                                        <button
                                          type="button"
                                          disabled={rIdx === effectiveRows.length - 1}
                                          onClick={() => moveRow(rIdx, rIdx + 1)}
                                          style={{ opacity: rIdx === effectiveRows.length - 1 ? 0.3 : 0.8, cursor: rIdx === effectiveRows.length - 1 ? "default" : "pointer", background: "transparent", border: "none", color: "#38bdf8", fontSize: 11, padding: "0 4px" }}
                                          title="Move row down"
                                        >
                                          ▼
                                        </button>
                                        <button
                                          type="button"
                                          onClick={() => deleteRow(rIdx)}
                                          style={{ background: "rgba(239, 68, 68, 0.15)", border: "1px solid rgba(239, 68, 68, 0.3)", borderRadius: 4, color: "#f87171", cursor: "pointer", fontSize: 10, padding: "2px 6px" }}
                                          title="Delete this row"
                                        >
                                          ✕ Row
                                        </button>
                                      </div>
                                    </div>

                                    {/* CELLS INPUT GRID */}
                                    <div style={{ display: "grid", gridTemplateColumns: `repeat(${Math.min(4, effectiveHeaders.length)}, 1fr)`, gap: 6 }}>
                                      {effectiveHeaders.map((hName, cIdx) => (
                                        <div key={cIdx} style={{ display: "flex", flexDirection: "column", gap: 2 }}>
                                          <span style={{ fontSize: 9, color: "var(--text-muted)", textOverflow: "ellipsis", overflow: "hidden", whiteSpace: "nowrap" }}>
                                            {hName || `Col ${cIdx + 1}`}:
                                          </span>
                                          <input
                                            type="text"
                                            value={safeArray(rowItems)[cIdx] || ""}
                                            onChange={(e) => updateCell(rIdx, cIdx, e.target.value)}
                                            placeholder={`Value for ${hName}`}
                                            style={{ width: "100%", background: "rgba(0,0,0,0.5)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 6, padding: "5px 8px", color: "#fff", fontSize: 11 }}
                                          />
                                        </div>
                                      ))}
                                    </div>
                                  </div>
                                ))}
                              </div>
                            </div>
                          );
                        })()}

                        <FeatureFormattingBar
                          pluginData={plugin.data}
                          onChangeField={(fld, val) => handlePluginTextChange(activeSlideIndex, pIdx, fld, val)}
                        />
                      </div>
                    ) : null}

                    {/* CHART PLUGIN EDITOR */}
                    {plugin.type === "chart" ? (
                      <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                        {/* 1. VISUAL CHART TYPE PRESET SELECTOR */}
                        <div style={{ background: "rgba(255,255,255,0.03)", padding: 10, borderRadius: 10, border: "1px solid rgba(255,255,255,0.08)" }}>
                          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
                            <label style={{ fontSize: 11, fontWeight: 700, color: "#c084fc", display: "flex", alignItems: "center", gap: 4 }}>
                              📊 Chart Type & Visual Layout:
                            </label>
                            <span style={{ fontSize: 10, opacity: 0.9, color: "#86efac", background: "rgba(34, 197, 94, 0.15)", padding: "2px 8px", borderRadius: 6, border: "1px solid rgba(34, 197, 94, 0.3)", fontWeight: 700 }}>
                              Active: {(plugin.data?.chart_type || "column").toUpperCase()}
                            </span>
                          </div>

                          <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                            {[
                              { id: "column", label: "📊 Column (Vertical)" },
                              { id: "bar_horizontal", label: "📊 Bar (Horizontal)" },
                              { id: "line", label: "📈 Line (Trend)" },
                              { id: "pie", label: "🥧 Pie (Proportion)" },
                              { id: "area", label: "📉 Area (Cumulative)" },
                              { id: "donut", label: "🍩 Donut (Ring)" },
                            ].map((cOpt) => {
                              const currentType = (plugin.data?.chart_type || "column").toLowerCase();
                              const isActive = currentType === cOpt.id;
                              return (
                                <button
                                  key={cOpt.id}
                                  type="button"
                                  className="btn-ui secondary sm"
                                  onClick={() => handlePluginTextChange(activeSlideIndex, pIdx, "chart_type", cOpt.id)}
                                  style={{
                                    padding: "5px 10px",
                                    fontSize: 11,
                                    fontWeight: "bold",
                                    cursor: "pointer",
                                    borderRadius: 8,
                                    whiteSpace: "nowrap",
                                    border: isActive ? "1px solid #c084fc" : "1px solid rgba(255,255,255,0.12)",
                                    background: isActive ? "linear-gradient(135deg, rgba(192, 132, 252, 0.35) 0%, rgba(124, 58, 237, 0.4) 100%)" : "rgba(0,0,0,0.3)",
                                    color: isActive ? "#ffffff" : "rgba(255,255,255,0.85)",
                                    boxShadow: isActive ? "0 0 10px rgba(192, 132, 252, 0.4)" : "none",
                                    transition: "all 0.2s ease",
                                  }}
                                >
                                  {cOpt.label}
                                </button>
                              );
                            })}
                          </div>
                        </div>

                        {/* 2. CHART TITLE & SERIES LEGEND NAME */}
                        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
                          <div>
                            <label style={{ fontSize: 11, fontWeight: 700, color: "var(--text-muted)", display: "block", marginBottom: 4 }}>Chart Title / Header:</label>
                            <input
                              type="text"
                              value={plugin.data?.title || ""}
                              onChange={(e) => handlePluginTextChange(activeSlideIndex, pIdx, "title", e.target.value)}
                              placeholder="e.g. Performance Data & Metrics"
                              style={{ width: "100%", background: "rgba(0,0,0,0.4)", border: "1px solid var(--panel-border)", borderRadius: 8, padding: 8, color: "#fff", fontSize: 12 }}
                            />
                          </div>
                          <div>
                            <label style={{ fontSize: 11, fontWeight: 700, color: "var(--text-muted)", display: "block", marginBottom: 4 }}>Series Legend Name:</label>
                            <input
                              type="text"
                              value={plugin.data?.series_name || ""}
                              onChange={(e) => handlePluginTextChange(activeSlideIndex, pIdx, "series_name", e.target.value)}
                              placeholder="e.g. AI Adoption Rate (%)"
                              style={{ width: "100%", background: "rgba(0,0,0,0.4)", border: "1px solid var(--panel-border)", borderRadius: 8, padding: 8, color: "#fff", fontSize: 12 }}
                            />
                          </div>
                        </div>

                        {/* 3. INTERACTIVE DATA POINTS BUILDER (SYNCED PAIRING 🎯) */}
                        {(() => {
                          const rawLabels = safeArray(plugin.data?.labels).length ? safeArray(plugin.data?.labels) : safeArray(plugin.data?.categories);
                          const rawValues = safeArray(plugin.data?.values);
                          const count = Math.max(rawLabels.length, rawValues.length, 2);

                          const items = [];
                          for (let i = 0; i < count; i++) {
                            items.push({
                              label: rawLabels[i] !== undefined ? String(rawLabels[i]) : `Category ${i + 1}`,
                              value: rawValues[i] !== undefined ? String(rawValues[i]) : String((i + 1) * 25),
                            });
                          }

                          const syncData = (newItems) => {
                            const newLabelsStr = newItems.map(it => it.label).join(", ");
                            const newValuesStr = newItems.map(it => it.value).join(", ");
                            handleChartDataChange(activeSlideIndex, pIdx, "labels", newLabelsStr);
                            handleChartDataChange(activeSlideIndex, pIdx, "categories", newLabelsStr);
                            handleChartDataChange(activeSlideIndex, pIdx, "values", newValuesStr);
                          };

                          return (
                            <div style={{ background: "rgba(15, 23, 42, 0.6)", padding: 12, borderRadius: 10, border: "1px solid rgba(192, 132, 252, 0.25)", display: "flex", flexDirection: "column", gap: 10 }}>
                              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                                <label style={{ fontSize: 11, fontWeight: 700, color: "#38bdf8", display: "flex", alignItems: "center", gap: 6 }}>
                                  📈 Synced Chart Data Points ({items.length} Points):
                                </label>
                                <button
                                  type="button"
                                  className="btn-ui primary sm"
                                  onClick={() => syncData([...items, { label: `Point ${items.length + 1}`, value: "50" }])}
                                  style={{ padding: "4px 10px", fontSize: 10, fontWeight: 700, borderRadius: 6, background: "linear-gradient(135deg, #0284c7 0%, #2563eb 100%)", color: "#fff", border: "none", cursor: "pointer", display: "flex", alignItems: "center", gap: 4 }}
                                >
                                  ➕ Add Data Point
                                </button>
                              </div>

                              <div style={{ display: "flex", flexDirection: "column", gap: 6, maxHeight: 220, overflowY: "auto", paddingRight: 4 }}>
                                {items.map((item, idx) => (
                                  <div key={idx} style={{ display: "flex", alignItems: "center", gap: 8, background: "rgba(255,255,255,0.03)", padding: "6px 10px", borderRadius: 8, border: "1px solid rgba(255,255,255,0.08)" }}>
                                    <span style={{ fontSize: 10, fontWeight: 800, color: "#38bdf8", background: "rgba(56, 189, 248, 0.15)", padding: "2px 6px", borderRadius: 4, flexShrink: 0 }}>
                                      #{idx + 1}
                                    </span>
                                    <div style={{ flex: 1, display: "flex", alignItems: "center", gap: 6 }}>
                                      <input
                                        type="text"
                                        value={item.label}
                                        onChange={(e) => {
                                          const updated = [...items];
                                          updated[idx].label = e.target.value;
                                          syncData(updated);
                                        }}
                                        placeholder="Category / X-Axis Label"
                                        style={{ flex: 1, background: "rgba(0,0,0,0.5)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 6, padding: "5px 8px", color: "#fff", fontSize: 11 }}
                                      />
                                      <span style={{ fontSize: 11, color: "var(--text-muted)", fontWeight: 700 }}>➡</span>
                                      <input
                                        type="text"
                                        value={item.value}
                                        onChange={(e) => {
                                          const updated = [...items];
                                          updated[idx].value = e.target.value;
                                          syncData(updated);
                                        }}
                                        placeholder="Value (Numeric Y-Axis)"
                                        style={{ width: 100, background: "rgba(0,0,0,0.5)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 6, padding: "5px 8px", color: "#86efac", fontSize: 11, fontWeight: 700 }}
                                      />
                                    </div>
                                    <div style={{ display: "flex", alignItems: "center", gap: 2 }}>
                                      <button
                                        type="button"
                                        disabled={idx === 0}
                                        onClick={() => {
                                          if (idx === 0) return;
                                          const updated = [...items];
                                          const temp = updated[idx];
                                          updated[idx] = updated[idx - 1];
                                          updated[idx - 1] = temp;
                                          syncData(updated);
                                        }}
                                        style={{ opacity: idx === 0 ? 0.3 : 0.8, cursor: idx === 0 ? "default" : "pointer", background: "transparent", border: "none", color: "#38bdf8", fontSize: 11, padding: "0 2px" }}
                                        title="Move point up"
                                      >
                                        ▲
                                      </button>
                                      <button
                                        type="button"
                                        disabled={idx === items.length - 1}
                                        onClick={() => {
                                          if (idx === items.length - 1) return;
                                          const updated = [...items];
                                          const temp = updated[idx];
                                          updated[idx] = updated[idx + 1];
                                          updated[idx + 1] = temp;
                                          syncData(updated);
                                        }}
                                        style={{ opacity: idx === items.length - 1 ? 0.3 : 0.8, cursor: idx === items.length - 1 ? "default" : "pointer", background: "transparent", border: "none", color: "#38bdf8", fontSize: 11, padding: "0 2px" }}
                                        title="Move point down"
                                      >
                                        ▼
                                      </button>
                                      <button
                                        type="button"
                                        disabled={items.length <= 1}
                                        onClick={() => {
                                          const updated = items.filter((_, i) => i !== idx);
                                          syncData(updated);
                                        }}
                                        style={{ background: "rgba(239, 68, 68, 0.15)", border: "1px solid rgba(239, 68, 68, 0.3)", borderRadius: 4, color: "#f87171", cursor: "pointer", fontSize: 10, padding: "2px 6px" }}
                                        title="Delete data point"
                                      >
                                        ✕
                                      </button>
                                    </div>
                                  </div>
                                ))}
                              </div>
                            </div>
                          );
                        })()}

                        {/* 4. ADVANCED DISPLAY & LEGEND CONTROLS */}
                        <div style={{ display: "flex", gap: 14, alignItems: "center", flexWrap: "wrap", background: "rgba(255,255,255,0.03)", padding: "8px 12px", borderRadius: 8, border: "1px solid rgba(255,255,255,0.08)" }}>
                          <span style={{ fontSize: 10, fontWeight: 700, color: "#c084fc", width: "100%" }}>⚙️ Advanced Chart Display Options:</span>

                          <label style={{ fontSize: 11, color: "#fff", display: "flex", alignItems: "center", gap: 6, cursor: "pointer" }}>
                            <input
                              type="checkbox"
                              checked={plugin.data?.show_data_labels !== false}
                              onChange={(e) => handlePluginTextChange(activeSlideIndex, pIdx, "show_data_labels", e.target.checked)}
                            />
                            Show Value Labels
                          </label>

                          <label style={{ fontSize: 11, color: "#fff", display: "flex", alignItems: "center", gap: 6, cursor: "pointer" }}>
                            <input
                              type="checkbox"
                              checked={plugin.data?.show_legend !== false}
                              onChange={(e) => handlePluginTextChange(activeSlideIndex, pIdx, "show_legend", e.target.checked)}
                            />
                            Show Legend
                          </label>

                          <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                            <label style={{ fontSize: 10, color: "var(--text-muted)" }}>Legend Pos:</label>
                            <select
                              value={plugin.data?.legend_position || "right"}
                              onChange={(e) => handlePluginTextChange(activeSlideIndex, pIdx, "legend_position", e.target.value)}
                              style={{ background: "rgba(0,0,0,0.5)", border: "1px solid var(--panel-border)", borderRadius: 6, padding: "3px 6px", color: "#fff", fontSize: 11 }}
                            >
                              <option value="right">Right</option>
                              <option value="top">Top</option>
                              <option value="bottom">Bottom</option>
                              <option value="left">Left</option>
                            </select>
                          </div>
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
                          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 6, gap: 6, flexWrap: "wrap" }}>
                            <label style={{ fontSize: 11, color: "var(--text-muted)" }}>Image URL / File Source:</label>
                            <div style={{ display: "flex", gap: 6, alignItems: "center" }}>
                              <label
                                className="btn-ui secondary sm"
                                style={{ fontSize: 10, padding: "3px 8px", cursor: "pointer", display: "inline-flex", alignItems: "center", gap: 4 }}
                                title="Upload Custom Image File from Device"
                              >
                                Upload Image
                                <input
                                  type="file"
                                  accept="image/*"
                                  style={{ display: "none" }}
                                  onChange={(e) => handleImageFileUpload(e, pIdx)}
                                />
                              </label>
                              <button
                                type="button"
                                className="btn-ui primary sm"
                                style={{ fontSize: 10, padding: "3px 8px", background: "linear-gradient(135deg, #c084fc, #ec4899)" }}
                                onClick={() => handleGenerateAIImage(pIdx, plugin.data?.caption)}
                                disabled={generatingAiImgIdx === pIdx}
                              >
                                {generatingAiImgIdx === pIdx ? "⏳ Generating..." : "🎨 Generate AI Image"}
                              </button>
                              <button
                                type="button"
                                className="btn-ui secondary sm"
                                style={{ fontSize: 10, padding: "3px 8px" }}
                                onClick={() => handleAutoUnsplashFetch(pIdx, plugin.data?.caption)}
                              >
                                ⚡ Unsplash
                              </button>
                            </div>
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

                        {/* IMAGE SIZE INCREASE / DECREASE & PRESET CONTROLS 🔍 */}
                        <div style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 10, padding: 10, display: "flex", flexDirection: "column", gap: 8 }}>
                          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 8 }}>
                            <label style={{ fontSize: 11, fontWeight: 700, color: "#c084fc", display: "flex", alignItems: "center", gap: 4 }}>
                              🖼️ Image Size (Height):
                            </label>
                            <span style={{ fontSize: 11, fontWeight: 800, color: "#86efac", background: "rgba(34,197,94,0.15)", padding: "2px 8px", borderRadius: 6, border: "1px solid rgba(34,197,94,0.3)" }}>
                              {plugin.data?.img_height || plugin.data?.height || 180}px
                            </span>
                          </div>

                          <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap" }}>
                            {/* DECREASE & INCREASE BUTTONS */}
                            <button
                              type="button"
                              className="btn-ui secondary sm"
                              title="Decrease Image Size (-20px)"
                              onClick={() => {
                                const curr = Number(plugin.data?.img_height || plugin.data?.height || 180);
                                const next = Math.max(80, curr - 20);
                                handlePluginTextChange(activeSlideIndex, pIdx, "img_height", next);
                                handlePluginTextChange(activeSlideIndex, pIdx, "height", next);
                              }}
                              style={{ padding: "4px 10px", fontSize: 12, fontWeight: "bold", cursor: "pointer" }}
                            >
                              ➖
                            </button>

                            <button
                              type="button"
                              className="btn-ui secondary sm"
                              title="Increase Image Size (+20px)"
                              onClick={() => {
                                const curr = Number(plugin.data?.img_height || plugin.data?.height || 180);
                                const next = Math.min(400, curr + 20);
                                handlePluginTextChange(activeSlideIndex, pIdx, "img_height", next);
                                handlePluginTextChange(activeSlideIndex, pIdx, "height", next);
                              }}
                              style={{ padding: "4px 10px", fontSize: 12, fontWeight: "bold", cursor: "pointer" }}
                            >
                              ➕
                            </button>

                            {/* PRESET SIZES */}
                            <div style={{ display: "flex", gap: 4, alignItems: "center", marginLeft: "auto" }}>
                              {[
                                { label: "S", size: 120, title: "Small (120px)" },
                                { label: "M", size: 180, title: "Medium (180px)" },
                                { label: "L", size: 240, title: "Large (240px)" },
                                { label: "XL", size: 300, title: "Extra Large (300px)" },
                                { label: "Max", size: 360, title: "Full Size (360px)" },
                              ].map((preset) => {
                                const activeSize = Number(plugin.data?.img_height || plugin.data?.height || 180);
                                const isActive = activeSize === preset.size;
                                return (
                                  <button
                                    key={preset.label}
                                    type="button"
                                    className="btn-ui secondary sm"
                                    title={preset.title}
                                    onClick={() => {
                                      handlePluginTextChange(activeSlideIndex, pIdx, "img_height", preset.size);
                                      handlePluginTextChange(activeSlideIndex, pIdx, "height", preset.size);
                                    }}
                                    style={{
                                      padding: "3px 8px",
                                      fontSize: 11,
                                      fontWeight: "bold",
                                      borderColor: isActive ? "#c084fc" : "rgba(255,255,255,0.15)",
                                      background: isActive ? "rgba(192, 132, 252, 0.25)" : "rgba(0,0,0,0.3)",
                                      color: isActive ? "#c084fc" : "#fff",
                                      cursor: "pointer"
                                    }}
                                  >
                                    {preset.label}
                                  </button>
                                );
                              })}
                            </div>
                          </div>

                          {/* SLIDER CONTROLLER */}
                          <div style={{ display: "flex", alignItems: "center", gap: 10, marginTop: 2 }}>
                            <input
                              type="range"
                              min="80"
                              max="400"
                              step="10"
                              value={Number(plugin.data?.img_height || plugin.data?.height || 180)}
                              onChange={(e) => {
                                const val = Number(e.target.value);
                                handlePluginTextChange(activeSlideIndex, pIdx, "img_height", val);
                                handlePluginTextChange(activeSlideIndex, pIdx, "height", val);
                              }}
                              style={{ flex: 1, accentColor: "#c084fc", cursor: "pointer" }}
                            />
                          </div>
                        </div>

                        <FeatureFormattingBar
                          pluginData={plugin.data}
                          onChangeField={(fld, val) => handlePluginTextChange(activeSlideIndex, pIdx, fld, val)}
                          isRefining={refiningPluginIdx === pIdx}
                        />
                      </div>
                    ) : null}

                    {/* BULLETS / INDEXING EDITOR */}
                    {plugin.type === "bullets" ? (
                      <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                        <div>
                          <label style={{ fontSize: 11, color: "var(--text-muted)", display: "block", marginBottom: 6 }}>
                            🔢 List Indexing & Bullet Style:
                          </label>
                          <div style={{ display: "flex", flexWrap: "wrap", gap: 6, alignItems: "center" }}>
                            {[
                              { style: "bullet", symbol: "•", title: "Standard Bullet Dots" },
                              { style: "number", symbol: "1.", title: "Numbered List (1, 2, 3)" },
                              { style: "alpha", symbol: "A.", title: "Alphabetical List (A, B, C)" },
                              { style: "roman", symbol: "I.", title: "Roman Numerals List (I, II, III)" },
                              { style: "check", symbol: "✔", title: "Checklist Items" },
                              { style: "star", symbol: "✦", title: "Star Highlight List" },
                              { style: "arrow", symbol: "➜", title: "Arrow Pointer List" },
                              { style: "diamond", symbol: "🔹", title: "Diamond Bullet Points" },
                            ].map((opt) => {
                              const rawStyle = plugin.data?.bullet_style || plugin.data?.list_style || "auto";
                              const resolvedStyle = detectBulletStyle(plugin.data?.points, rawStyle);
                              const isActive = resolvedStyle === opt.style;
                              return (
                                <button
                                  key={opt.style}
                                  type="button"
                                  className="btn-ui secondary sm"
                                  title={opt.title}
                                  onClick={() => {
                                    handlePluginTextChange(activeSlideIndex, pIdx, "bullet_style", opt.style);
                                    handlePluginTextChange(activeSlideIndex, pIdx, "list_style", opt.style);
                                  }}
                                  style={{
                                    padding: "4px 10px",
                                    fontSize: 13,
                                    fontWeight: "bold",
                                    cursor: "pointer",
                                    borderColor: isActive ? "#c084fc" : "rgba(255,255,255,0.15)",
                                    background: isActive ? "rgba(192, 132, 252, 0.15)" : "rgba(0,0,0,0.3)",
                                    color: isActive ? "#c084fc" : "#fff",
                                    boxShadow: isActive ? "0 0 8px rgba(192, 132, 252, 0.3)" : "none"
                                  }}
                                >
                                  {opt.symbol}
                                </button>
                              );
                            })}
                          </div>
                        </div>

                        {safeArray(plugin.data?.points).map((bullet, bIdx) => (
                          <div key={bIdx} style={{ display: "flex", gap: 8, alignItems: "center" }}>
                            <span style={{ color: "#c084fc", fontWeight: 800, minWidth: 24, textAlign: "right", fontSize: 12 }}>
                              {formatBulletPrefix(plugin.data?.bullet_style || plugin.data?.list_style, bIdx, plugin.data?.points)}
                            </span>
                            <input
                              type="text"
                              value={bullet}
                              onChange={(e) => handlePluginTextChange(activeSlideIndex, pIdx, "points", e.target.value, bIdx)}
                              placeholder={`Enter point ${bIdx + 1}...`}
                              style={{ flex: 1, background: "rgba(0,0,0,0.4)", border: "1px solid var(--panel-border)", borderRadius: 6, padding: 6, color: "#fff", fontSize: 13 }}
                            />
                            <button className="btn-ui danger sm" onClick={() => handleDeleteBullet(activeSlideIndex, pIdx, bIdx)}>
                              ×
                            </button>
                          </div>
                        ))}
                        <button className="btn-ui secondary sm" style={{ alignSelf: "flex-start", marginTop: 4 }} onClick={() => handleAddBullet(activeSlideIndex, pIdx)}>
                          + Add List Point
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
                      <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                        <div>
                          <label style={{ fontSize: 11, color: "var(--text-muted)", display: "block", marginBottom: 4 }}>Paragraph Narrative:</label>
                        </div>
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

                    {/* 2-COLUMN PARAGRAPHS */}
                    {plugin.type === "paragraph_2col" ? (
                      <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                          
                        </div>

                        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
                          {/* LEFT COLUMN */}
                          <div style={{ background: "rgba(0,0,0,0.25)", padding: 8, borderRadius: 8, border: "1px solid rgba(255,255,255,0.1)" }}>
                            <label style={{ fontSize: 11, fontWeight: 700, color: "#c084fc", display: "block", marginBottom: 4 }}>Left Column Title:</label>
                            <input
                              type="text"
                              value={plugin.data?.left_title || ""}
                              onChange={(e) => handlePluginTextChange(activeSlideIndex, pIdx, "left_title", e.target.value)}
                              placeholder="e.g. Current Strategy"
                              style={{ width: "100%", background: "rgba(0,0,0,0.4)", border: "1px solid var(--panel-border)", borderRadius: 6, padding: 6, color: "#fff", fontSize: 12, marginBottom: 6 }}
                            />
                            <label style={{ fontSize: 11, color: "var(--text-muted)", display: "block", marginBottom: 2 }}>Left Paragraph Text:</label>
                            <textarea
                              value={plugin.data?.left_text || plugin.data?.text || ""}
                              onChange={(e) => handlePluginTextChange(activeSlideIndex, pIdx, "left_text", e.target.value)}
                              rows={3}
                              placeholder="Left column paragraph text..."
                              style={{ width: "100%", background: "rgba(0,0,0,0.4)", border: "1px solid var(--panel-border)", borderRadius: 6, padding: 6, color: "#fff", fontSize: 12 }}
                            />
                          </div>

                          {/* RIGHT COLUMN */}
                          <div style={{ background: "rgba(0,0,0,0.25)", padding: 8, borderRadius: 8, border: "1px solid rgba(255,255,255,0.1)" }}>
                            <label style={{ fontSize: 11, fontWeight: 700, color: "#c084fc", display: "block", marginBottom: 4 }}>Right Column Title:</label>
                            <input
                              type="text"
                              value={plugin.data?.right_title || ""}
                              onChange={(e) => handlePluginTextChange(activeSlideIndex, pIdx, "right_title", e.target.value)}
                              placeholder="e.g. Proposed AI Solution"
                              style={{ width: "100%", background: "rgba(0,0,0,0.4)", border: "1px solid var(--panel-border)", borderRadius: 6, padding: 6, color: "#fff", fontSize: 12, marginBottom: 6 }}
                            />
                            <label style={{ fontSize: 11, color: "var(--text-muted)", display: "block", marginBottom: 2 }}>Right Paragraph Text:</label>
                            <textarea
                              value={plugin.data?.right_text || ""}
                              onChange={(e) => handlePluginTextChange(activeSlideIndex, pIdx, "right_text", e.target.value)}
                              rows={3}
                              placeholder="Right column paragraph text..."
                              style={{ width: "100%", background: "rgba(0,0,0,0.4)", border: "1px solid var(--panel-border)", borderRadius: 6, padding: 6, color: "#fff", fontSize: 12 }}
                            />
                          </div>
                        </div>

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
                          isRefining={refiningPluginIdx === pIdx}
                        />
                      </div>
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
        <div
          className="presenter-overlay"
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            width: "100vw",
            height: "100vh",
            zIndex: 9999,
            background: "#090d1a",
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            padding: 0,
            overflow: "hidden",
          }}
        >
          {/* TOP PRESENTATION PROGRESS BAR */}
          <div
            style={{
              position: "fixed",
              top: 0,
              left: 0,
              height: 4,
              width: `${((presenterSlideIndex + 1) / plan.slides.length) * 100}%`,
              background: "linear-gradient(90deg, #8b5cf6, #ec4899, #06b6d4)",
              boxShadow: "0 0 12px rgba(139, 92, 246, 0.8)",
              transition: "width 0.3s ease",
              zIndex: 10003,
            }}
          />

          {/* FLOATING HEADER CONTROL BAR */}
          <div
            style={{
              position: "fixed",
              top: 14,
              left: "50%",
              transform: "translateX(-50%)",
              zIndex: 10002,
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              width: "calc(100% - 40px)",
              maxWidth: "1350px",
              padding: "8px 18px",
              background: "rgba(15, 23, 42, 0.88)",
              borderRadius: 999,
              border: "1px solid rgba(255, 255, 255, 0.15)",
              backdropFilter: "blur(20px)",
              boxShadow: "0 10px 30px rgba(0, 0, 0, 0.6)",
            }}
          >
            <div style={{ color: "#c084fc", fontWeight: "bold", fontSize: 13, display: "flex", alignItems: "center", gap: 10 }}>
              <span style={{ background: "rgba(192, 132, 252, 0.15)", border: "1px solid rgba(192, 132, 252, 0.3)", padding: "3px 12px", borderRadius: 999, color: "#c084fc", fontWeight: 800 }}>
                SLIDE {presenterSlideIndex + 1} / {plan.slides.length}
              </span>
              <span style={{ opacity: 0.4 }}>│</span>
              <span style={{ background: "rgba(255, 255, 255, 0.08)", border: "1px solid rgba(255, 255, 255, 0.12)", padding: "3px 12px", borderRadius: 999, color: "#e2e8f0" }}>
                ⏱️ {minutesFormatted}:{secondsFormatted}
              </span>
            </div>

            <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
              {/* AUTO PLAY TOGGLE & SPEED */}
              <div style={{ display: "flex", alignItems: "center", gap: 6, background: "rgba(255,255,255,0.06)", padding: "3px 8px", borderRadius: 999, border: "1px solid rgba(255,255,255,0.15)" }}>
                <button
                  className="btn-ui primary sm"
                  onClick={() => setAutoPlay(!autoPlay)}
                  style={{
                    background: autoPlay ? "linear-gradient(135deg, #ef4444, #f43f5e)" : "linear-gradient(135deg, #10b981, #059669)",
                    border: "none",
                    fontSize: 11,
                    padding: "3px 10px",
                    borderRadius: 999,
                  }}
                >
                  {autoPlay ? "⏸️ Pause" : "▶️ Auto Play"}
                </button>
                <select
                  value={autoPlaySpeed}
                  onChange={(e) => setAutoPlaySpeed(Number(e.target.value))}
                  style={{ background: "rgba(0,0,0,0.5)", border: "1px solid var(--panel-border)", color: "#fff", borderRadius: 8, padding: "2px 6px", fontSize: 11 }}
                >
                  <option value={3}>3s / slide</option>
                  <option value={5}>5s / slide</option>
                  <option value={8}>8s / slide</option>
                  <option value={10}>10s / slide</option>
                </select>
              </div>

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
                style={{ background: "linear-gradient(135deg, #8b5cf6, #06b6d4)", border: "none", borderRadius: 999, fontSize: 11 }}
              >
                🗣️ AI Voiceover
              </button>

              <button
                className="btn-ui secondary sm"
                onClick={() => setShowPresenterNotes(!showPresenterNotes)}
                style={{ borderRadius: 999, fontSize: 11 }}
              >
                {showPresenterNotes ? "👁️ Hide Notes" : "👁️ Show Notes"}
              </button>

              <button
                className="btn-ui secondary sm"
                onClick={() => {
                  if (!document.fullscreenElement) {
                    document.documentElement.requestFullscreen?.().catch(() => {});
                  } else {
                    document.exitFullscreen?.().catch(() => {});
                  }
                }}
                title="Toggle True Browser Fullscreen"
                style={{ borderRadius: 999, fontSize: 11 }}
              >
                ⛶ Fullscreen
              </button>

              <button
                className="btn-ui danger sm"
                onClick={() => {
                  if (window.speechSynthesis) window.speechSynthesis.cancel();
                  setAutoPlay(false);
                  stopPresentationMode();
                }}
                style={{ borderRadius: 999, fontSize: 11 }}
              >
                ✕ Exit (Esc)
              </button>
            </div>
          </div>

          {/* FULLSCREEN CANVAS CONTAINER */}
          <div
            className="presenter-canvas"
            style={{
              flex: 1,
              width: "100%",
              height: "100%",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              padding: "70px 40px 80px 40px",
              boxSizing: "border-box",
              overflow: "hidden",
            }}
          >
            {/* 16:9 EDGE-TO-EDGE WIDESCREEN PRESENTATION CANVAS */}
            {(() => {
              const presVAlign = presenterSlide.title_valign || presenterSlide.subtitle_valign || "auto";
              const isPresMiddle = presVAlign === "middle" || presVAlign === "center";
              const isPresBottom = presVAlign === "bottom";
              const presNonNotesPlugins = safeArray(presenterSlide.plugins).filter((p) => p.type !== "notes");
              const presHasPlugins = presNonNotesPlugins.length > 0;

              return (
                <div
                  style={{
                    width: "100%",
                    maxWidth: "1300px",
                    aspectRatio: "16 / 9",
                    background: selectedBgConfig.bg,
                    color: selectedBgConfig.text,
                    borderRadius: 24,
                    padding: "44px 60px",
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: isPresMiddle ? "center" : isPresBottom ? "flex-end" : "flex-start",
                    boxShadow: "0 30px 80px -15px rgba(0, 0, 0, 0.9), 0 0 50px rgba(192, 132, 252, 0.15)",
                    border: "1px solid rgba(255, 255, 255, 0.18)",
                    overflow: "hidden",
                    boxSizing: "border-box",
                  }}
                >
                  <div
                    style={{
                      width: "100%",
                      textAlign: presenterSlide.title_align || "left",
                    }}
                  >
                    <div style={{ fontSize: 11, fontWeight: "800", opacity: 0.6, letterSpacing: 1 }}>
                      SLIDE {presenterSlideIndex + 1} OF {plan.slides.length}
                    </div>
                    <h1
                      style={{
                        fontSize: presenterSlide.title_font_size ? presenterSlide.title_font_size * 1.3 : 38,
                        color: presenterSlide.title_color || "inherit",
                        textAlign: presenterSlide.title_align || "left",
                        fontWeight: presenterSlide.title_bold === false ? 400 : 800,
                        margin: "8px 0 6px",
                      }}
                    >
                      {presenterSlide.title}
                    </h1>
                    {presenterSlide.subtitle ? (
                      <div
                        style={{
                          fontSize: presenterSlide.subtitle_font_size ? presenterSlide.subtitle_font_size * 1.2 : 20,
                          color: presenterSlide.subtitle_color || "inherit",
                          textAlign: presenterSlide.subtitle_align || "left",
                          opacity: presenterSlide.subtitle_color ? 1 : 0.85,
                          fontWeight: 600,
                          marginBottom: 16,
                        }}
                      >
                        {presenterSlide.subtitle}
                      </div>
                    ) : null}
                  </div>

              {presHasPlugins && (
                <div style={{ flex: isPresMiddle || isPresBottom ? "0 1 auto" : 1, maxHeight: "100%", overflowY: "auto", margin: "12px 0", display: "flex", flexDirection: "column", gap: 12 }}>
                {(() => {
                  const plugins = safeArray(presenterSlide.plugins);
                  const hasImage = plugins.some((p) => p.type === "image" && (p.data?.url || p.data?.path));
                  const hasText = plugins.some((p) => p.type === "bullets" || p.type === "paragraph");

                  const renderPresenterItem = (plugin, pIdx) => (
                    <div key={pIdx}>
                      {plugin.type === "subtitle" || plugin.type === "text" ? (
                        <h3 style={{ fontSize: plugin.data?.font_size || 22, textAlign: plugin.data?.alignment || "left", color: plugin.data?.font_color || plugin.data?.color || "#c084fc", margin: "4px 0" }}>
                          {plugin.data?.text}
                        </h3>
                      ) : null}

                      {plugin.type === "paragraph" ? (
                        <p style={{ fontSize: plugin.data?.font_size || 18, textAlign: plugin.data?.alignment || "left", color: plugin.data?.font_color || plugin.data?.color || "inherit", lineHeight: 1.6, opacity: 0.95 }}>
                          {plugin.data?.text}
                        </p>
                      ) : null}

                      {plugin.type === "bullets" ? (
                        <div style={{ display: "flex", flexDirection: "column", gap: 10, textAlign: plugin.data?.alignment || "left" }}>
                          {safeArray(plugin.data?.points).map((pt, bIdx) => {
                            const matchDomain = pt.match(/\((https?:\/\/[^\s)]+|[a-zA-Z0-9.-]+\.[a-zA-Z]{2,})\)/);
                            const cleanText = matchDomain ? pt.replace(matchDomain[0], "").trim() : pt;
                            const domainUrl = matchDomain ? matchDomain[1] : null;

                            return (
                              <div
                                key={bIdx}
                                style={{
                                  display: "flex",
                                  alignItems: "center",
                                  gap: 12,
                                  background: "rgba(255, 255, 255, 0.05)",
                                  border: "1px solid rgba(255, 255, 255, 0.1)",
                                  borderRadius: 12,
                                  padding: "10px 16px",
                                  fontSize: plugin.data?.font_size || 16,
                                  color: plugin.data?.font_color || plugin.data?.color || "inherit",
                                  boxShadow: "0 2px 8px rgba(0,0,0,0.15)",
                                  transition: "all 0.2s ease",
                                }}
                              >
                                <span style={{ color: "#c084fc", fontSize: 14, fontWeight: "bold", flexShrink: 0 }}>✦</span>
                                <span style={{ flex: 1, fontWeight: 500 }}>{cleanText}</span>
                                {domainUrl && (
                                  <a
                                    href={domainUrl.startsWith("http") ? domainUrl : `https://${domainUrl}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    onClick={(e) => e.stopPropagation()}
                                    style={{
                                      fontSize: 11,
                                      fontWeight: 700,
                                      color: "#60a5fa",
                                      background: "rgba(96, 165, 250, 0.15)",
                                      border: "1px solid rgba(96, 165, 250, 0.3)",
                                      borderRadius: 999,
                                      padding: "3px 10px",
                                      textDecoration: "none",
                                      display: "inline-flex",
                                      alignItems: "center",
                                      gap: 4,
                                      flexShrink: 0,
                                      transition: "all 0.2s ease",
                                    }}
                                  >
                                    🔗 {domainUrl}
                                  </a>
                                )}
                              </div>
                            );
                          })}
                        </div>
                      ) : null}

                      {plugin.type === "chart" ? (
                        <VisualChartPreview data={plugin.data} />
                      ) : null}

                      {plugin.type === "image" && (plugin.data?.url || plugin.data?.path) ? (
                        <div style={{ textAlign: plugin.data?.align || plugin.data?.alignment || "center", margin: "8px 0" }}>
                          <img
                            src={plugin.data.url || plugin.data.path}
                            alt="slide visual"
                            style={{
                              maxHeight: Number(plugin.data?.img_height || plugin.data?.height || 180) * 1.25,
                              borderRadius: 12,
                              border: "1px solid rgba(255,255,255,0.2)",
                              transition: "max-height 0.2s ease"
                            }}
                          />
                          {plugin.data?.caption ? <div style={{ fontSize: 13, opacity: 0.7, marginTop: 4 }}>{plugin.data.caption}</div> : null}
                        </div>
                      ) : null}

                      {plugin.type === "stat" ? (
                        <div style={{ display: "flex", alignItems: "baseline", gap: 12, margin: "8px 0" }}>
                          <span style={{ fontSize: plugin.data?.font_size || 48, fontWeight: 900, color: "#c084fc" }}>{plugin.data?.number}</span>
                          <span style={{ fontSize: 18, fontWeight: 600, opacity: 0.9 }}>{plugin.data?.label}</span>
                        </div>
                      ) : null}
                    </div>
                  );

                  if (hasImage && hasText) {
                    const textPlugins = plugins.filter((p) => p.type === "bullets" || p.type === "paragraph" || p.type === "subtitle" || p.type === "text");
                    const imagePlugins = plugins.filter((p) => p.type === "image");
                    const otherPlugins = plugins.filter((p) => p.type !== "bullets" && p.type !== "paragraph" && p.type !== "subtitle" && p.type !== "text" && p.type !== "image");

                    return (
                      <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                        <div style={{ display: "grid", gridTemplateColumns: "1.1fr 0.9fr", gap: 20, alignItems: "center" }}>
                          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                            {textPlugins.map((p, pIdx) => renderPresenterItem(p, `ptxt-${pIdx}`))}
                          </div>
                          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
                            {imagePlugins.map((p, pIdx) => renderPresenterItem(p, `pimg-${pIdx}`))}
                          </div>
                        </div>
                        {otherPlugins.map((p, pIdx) => renderPresenterItem(p, `poth-${pIdx}`))}
                      </div>
                    );
                  }

                  return plugins.map((plugin, pIdx) => renderPresenterItem(plugin, pIdx));
                })()}
              </div>
              )}
            </div>
          );
        })()}

            {showPresenterNotes ? (
              <div
                style={{
                  marginTop: 10,
                  width: "100%",
                  maxWidth: "1300px",
                  background: "rgba(15, 23, 42, 0.88)",
                  backdropFilter: "blur(16px)",
                  border: "1px solid rgba(192, 132, 252, 0.25)",
                  borderRadius: 14,
                  padding: "10px 18px",
                  color: "#e2e8f0",
                  fontSize: 13,
                  boxShadow: "0 8px 24px rgba(0,0,0,0.5)",
                }}
              >
                <span style={{ color: "#c084fc", fontWeight: 800, marginRight: 6 }}>🗣️ Presenter Notes:</span>{" "}
                {presenterSlide.plugins?.find((p) => p.type === "notes")?.data?.notes || "No speaker notes for this slide."}
              </div>
            ) : null}
          </div>

          {/* FLOATING BOTTOM DOCK NAVIGATION CONTROLS */}
          <div
            style={{
              position: "fixed",
              bottom: 14,
              left: "50%",
              transform: "translateX(-50%)",
              zIndex: 10002,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: 4,
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 12,
                background: "rgba(15, 23, 42, 0.88)",
                backdropFilter: "blur(20px)",
                border: "1px solid rgba(255, 255, 255, 0.15)",
                borderRadius: 999,
                padding: "6px 18px",
                boxShadow: "0 10px 30px rgba(0, 0, 0, 0.6)",
              }}
            >
              <button
                className="btn-ui secondary sm"
                onClick={() => setPresenterSlideIndex((i) => Math.max(0, i - 1))}
                disabled={presenterSlideIndex === 0}
                style={{ borderRadius: 999, padding: "5px 14px" }}
              >
                ◀ Previous
              </button>

              {/* QUICK SLIDE DOTS / INDEX JUMP BUTTONS */}
              <div style={{ display: "flex", gap: 5, alignItems: "center" }}>
                {plan.slides.map((_, sIdx) => (
                  <button
                    key={sIdx}
                    onClick={() => setPresenterSlideIndex(sIdx)}
                    style={{
                      width: sIdx === presenterSlideIndex ? 22 : 10,
                      height: 10,
                      borderRadius: 999,
                      background: sIdx === presenterSlideIndex ? "linear-gradient(135deg, #c084fc, #60a5fa)" : "rgba(255,255,255,0.2)",
                      border: "none",
                      cursor: "pointer",
                      transition: "all 0.25s ease",
                    }}
                    title={`Jump to Slide ${sIdx + 1}`}
                  />
                ))}
              </div>

              <button
                className="btn-ui primary sm"
                onClick={() => setPresenterSlideIndex((i) => Math.min(plan.slides.length - 1, i + 1))}
                disabled={presenterSlideIndex === plan.slides.length - 1}
                style={{ borderRadius: 999, padding: "5px 14px" }}
              >
                Next ▶
              </button>

              <div style={{ height: 16, width: 1, background: "rgba(255,255,255,0.2)", margin: "0 4px" }} />

              <button
                type="button"
                className="btn-ui secondary sm"
                onClick={() => handleToggleSlideVoiceover(plan.slides[presenterSlideIndex], presenterSlideIndex)}
                style={{
                  borderRadius: 999,
                  padding: "5px 14px",
                  background: isSpeaking && speakingSlideIdx === presenterSlideIndex ? "rgba(239, 68, 68, 0.3)" : "rgba(139, 92, 246, 0.25)",
                  border: isSpeaking && speakingSlideIdx === presenterSlideIndex ? "1px solid #ef4444" : "1px solid rgba(139, 92, 246, 0.5)",
                }}
              >
                {isSpeaking && speakingSlideIdx === presenterSlideIndex ? "⏹️ Stop Voice" : "🎙️ Narration"}
              </button>

              <label style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 11, fontWeight: 600, color: "rgba(255,255,255,0.8)", cursor: "pointer", userSelect: "none" }}>
                <input
                  type="checkbox"
                  checked={autoPlayVoiceover}
                  onChange={(e) => setAutoPlayVoiceover(e.target.checked)}
                  style={{ accentColor: "#8b5cf6", cursor: "pointer" }}
                />
                Auto-Voiceover
              </label>
            </div>

            <div style={{ fontSize: 10, color: "rgba(255, 255, 255, 0.4)", fontWeight: 600 }}>
              ⌨️ Use ◄ ► Arrow Keys or Spacebar to Navigate
            </div>
          </div>
        </div>
      ) : null}

      {/* DOWNLOAD SUCCESS POPUP MODAL 🎁 */}
      {showDownloadModal && (
        <div style={{
          position: "fixed",
          inset: 0,
          zIndex: 10000,
          background: "rgba(9, 13, 24, 0.88)",
          backdropFilter: "blur(16px)",
          display: "grid",
          placeItems: "center",
          padding: 16
        }}>
          <div style={{
            background: "linear-gradient(145deg, #0b1120 0%, #1e1b4b 50%, #0f172a 100%)",
            border: "1px solid rgba(192, 132, 252, 0.35)",
            borderRadius: 24,
            padding: "36px 32px",
            maxWidth: 490,
            width: "100%",
            boxShadow: "0 25px 60px -10px rgba(0, 0, 0, 0.9), 0 0 40px rgba(139, 92, 246, 0.25)",
            textAlign: "center",
            position: "relative",
            animation: "fadeIn 0.25s ease-out",
          }}>
            <button
              onClick={() => setShowDownloadModal(false)}
              style={{
                position: "absolute",
                top: 16,
                right: 16,
                width: 32,
                height: 32,
                borderRadius: 999,
                background: "rgba(255, 255, 255, 0.08)",
                border: "1px solid rgba(255, 255, 255, 0.12)",
                color: "#fff",
                fontSize: 16,
                cursor: "pointer",
                display: "grid",
                placeItems: "center",
                transition: "all 0.2s ease",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = "rgba(239, 68, 68, 0.25)";
                e.currentTarget.style.borderColor = "#ef4444";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = "rgba(255, 255, 255, 0.08)";
                e.currentTarget.style.borderColor = "rgba(255, 255, 255, 0.12)";
              }}
            >
              ✕
            </button>

            {/* GLOWING ICON BADGE */}
            <div style={{
              width: 68,
              height: 68,
              borderRadius: 999,
              background: "linear-gradient(135deg, rgba(139, 92, 246, 0.25), rgba(6, 182, 212, 0.25))",
              border: "1px solid rgba(192, 132, 252, 0.4)",
              boxShadow: "0 0 20px rgba(139, 92, 246, 0.3)",
              display: "grid",
              placeItems: "center",
              fontSize: 32,
              margin: "0 auto 18px",
            }}>
              🎉
            </div>

            <h2 style={{
              fontSize: 22,
              fontWeight: 900,
              background: "linear-gradient(135deg, #ffffff 0%, #c084fc 100%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              margin: "0 0 8px 0",
              lineHeight: 1.3,
            }}>
              {plan?.title || "Presentation Deck Ready!"}
            </h2>

            <p style={{ fontSize: 13, color: "rgba(255,255,255,0.75)", margin: "0 0 22px 0", lineHeight: 1.5 }}>
              Your 16:9 Widescreen PowerPoint presentation has been generated successfully!
            </p>

            {/* SPEC CARD DETAILS */}
            <div style={{
              background: "rgba(0, 0, 0, 0.35)",
              border: "1px solid rgba(255, 255, 255, 0.1)",
              borderRadius: 16,
              padding: "16px 18px",
              marginBottom: 26,
              display: "flex",
              flexDirection: "column",
              gap: 10,
              fontSize: 13,
            }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <span style={{ color: "rgba(255,255,255,0.6)", fontWeight: 600 }}>Output Format:</span>
                <span style={{ fontWeight: 800, color: "#86efac", background: "rgba(34, 197, 94, 0.15)", padding: "3px 10px", borderRadius: 999, border: "1px solid rgba(34, 197, 94, 0.3)", fontSize: 12 }}>
                  📊 PPTX (16:9 Widescreen)
                </span>
              </div>

              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <span style={{ color: "rgba(255,255,255,0.6)", fontWeight: 600 }}>Total Slides:</span>
                <span style={{ fontWeight: 800, color: "#c084fc", background: "rgba(192, 132, 252, 0.15)", padding: "3px 10px", borderRadius: 999, border: "1px solid rgba(192, 132, 252, 0.3)", fontSize: 12 }}>
                  {plan?.slides?.length || 0} Slides
                </span>
              </div>
            </div>

            {/* BUTTONS ROW */}
            <div style={{ display: "flex", gap: 12, justifyContent: "center" }}>
              <button
                type="button"
                className="btn-ui primary"
                onClick={async (e) => {
                  e?.preventDefault();
                  await handleDirectDownload(e);
                  setShowDownloadModal(false);
                }}
                disabled={loadingGenerate}
                style={{
                  flex: 1,
                  padding: "13px 24px",
                  fontSize: 14,
                  fontWeight: 800,
                  color: "#ffffff",
                  WebkitTextFillColor: "#ffffff",
                  background: loadingGenerate
                    ? "linear-gradient(135deg, #4b5563, #374151)"
                    : "linear-gradient(135deg, #10b981 0%, #059669 100%)",
                  border: "none",
                  borderRadius: 14,
                  cursor: loadingGenerate ? "not-allowed" : "pointer",
                  boxShadow: "0 8px 24px rgba(16, 185, 129, 0.4)",
                  display: "inline-flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: 8,
                  transition: "all 0.2s ease",
                }}
                onMouseEnter={(e) => {
                  if (!loadingGenerate) {
                    e.currentTarget.style.transform = "translateY(-1px)";
                    e.currentTarget.style.boxShadow = "0 12px 28px rgba(16, 185, 129, 0.5)";
                  }
                }}
                onMouseLeave={(e) => {
                  if (!loadingGenerate) {
                    e.currentTarget.style.transform = "none";
                    e.currentTarget.style.boxShadow = "0 8px 24px rgba(16, 185, 129, 0.4)";
                  }
                }}
              >
                {loadingGenerate ? "⏳ Compiling PPTX..." : "📥 Download Now"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* POWERPOINT OFFICE THEME VISUAL LAYOUT PICKER MODAL */}
      {showLayoutModal && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: "rgba(0,0,0,0.75)",
            backdropFilter: "blur(6px)",
            zIndex: 99999,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: 16,
          }}
          onClick={() => setShowLayoutModal(false)}
        >
          <div
            style={{
              background: "#18181b",
              border: "1px solid rgba(255,255,255,0.15)",
              borderRadius: 16,
              padding: "20px 24px",
              maxWidth: 720,
              width: "100%",
              boxShadow: "0 20px 50px rgba(0,0,0,0.7)",
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16, borderBottom: "1px solid rgba(255,255,255,0.1)", paddingBottom: 12 }}>
              <div>
                <div style={{ fontSize: 16, fontWeight: 800, color: "#ffffff", display: "flex", alignItems: "center", gap: 8 }}>
                  <span>{layoutModalMode === "add" ? "➕" : "🔲"}</span>
                  <span>{layoutModalMode === "add" ? "Choose Layout for New Slide" : "Office Theme Slide Layouts"}</span>
                </div>
                <div style={{ fontSize: 12, color: "rgba(255,255,255,0.6)", marginTop: 2 }}>
                  {layoutModalMode === "add"
                    ? "Select a PowerPoint slide layout preset to insert a new slide into your deck"
                    : `Select a PowerPoint slide layout preset for Slide #${activeSlideIndex + 1}`}
                </div>
              </div>
              <button
                type="button"
                onClick={() => setShowLayoutModal(false)}
                style={{ background: "none", border: "none", color: "rgba(255,255,255,0.6)", fontSize: 20, cursor: "pointer", padding: "4px 8px" }}
              >
                ✕
              </button>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 14, maxHeight: "70vh", overflowY: "auto", paddingRight: 4 }}>
              {OFFICE_LAYOUT_PRESETS.map((layoutItem) => {
                const isActive = layoutModalMode === "change" && resolveActiveSlideLayout(activeSlide) === layoutItem.id;
                return (
                  <div
                    key={layoutItem.id}
                    onClick={() => {
                      if (layoutModalMode === "add") {
                        handleAddSlideWithLayout(layoutItem.id);
                      } else {
                        handleApplySlideLayout(layoutItem.id);
                      }
                      setShowLayoutModal(false);
                    }}
                    style={{
                      background: isActive ? "rgba(139, 92, 246, 0.18)" : "rgba(255,255,255,0.04)",
                      border: isActive ? "2px solid #8b5cf6" : "1px solid rgba(255,255,255,0.12)",
                      borderRadius: 12,
                      padding: 10,
                      cursor: "pointer",
                      transition: "all 0.2s ease",
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                      gap: 8,
                    }}
                    className="layout-preset-card"
                  >
                    {/* MINI VISUAL WIREFRAME CANVAS */}
                    <div
                      style={{
                        width: "100%",
                        height: 90,
                        background: "#ffffff",
                        borderRadius: 6,
                        padding: 6,
                        display: "flex",
                        flexDirection: "column",
                        justifyContent: "space-between",
                        boxShadow: "0 2px 8px rgba(0,0,0,0.3)",
                        position: "relative",
                        boxSizing: "border-box",
                      }}
                    >
                      {layoutItem.id === "title_subtitle" && (
                        <div style={{ display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center", height: "100%", gap: 6 }}>
                          <div style={{ width: "80%", height: 18, border: "1.5px dashed #64748b", borderRadius: 3 }} />
                          <div style={{ width: "55%", height: 14, border: "1.5px dashed #94a3b8", borderRadius: 3 }} />
                        </div>
                      )}

                      {layoutItem.id === "title_content" && (
                        <div style={{ display: "flex", flexDirection: "column", height: "100%", gap: 6 }}>
                          <div style={{ width: "90%", height: 14, border: "1.5px dashed #64748b", borderRadius: 3 }} />
                          <div style={{ width: "100%", flex: 1, border: "1.5px dashed #94a3b8", borderRadius: 3, display: "flex", alignItems: "center", justifyContent: "center", gap: 4, opacity: 0.6 }}>
                            <span style={{ fontSize: 9 }}>📊</span>
                            <span style={{ fontSize: 9 }}>🖼️</span>
                            <span style={{ fontSize: 9 }}>📑</span>
                          </div>
                        </div>
                      )}

                      {layoutItem.id === "section_header" && (
                        <div style={{ display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "flex-start", height: "100%", paddingLeft: 8 }}>
                          <div style={{ width: "85%", height: 20, border: "1.5px dashed #64748b", borderRadius: 3 }} />
                        </div>
                      )}

                      {layoutItem.id === "two_content" && (
                        <div style={{ display: "flex", flexDirection: "column", height: "100%", gap: 6 }}>
                          <div style={{ width: "90%", height: 12, border: "1.5px dashed #64748b", borderRadius: 3 }} />
                          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 6, flex: 1 }}>
                            <div style={{ border: "1.5px dashed #94a3b8", borderRadius: 3, display: "flex", alignItems: "center", justifyContent: "center" }}>
                              <span style={{ fontSize: 9, opacity: 0.6 }}>📝</span>
                            </div>
                            <div style={{ border: "1.5px dashed #94a3b8", borderRadius: 3, display: "flex", alignItems: "center", justifyContent: "center" }}>
                              <span style={{ fontSize: 9, opacity: 0.6 }}>📊</span>
                            </div>
                          </div>
                        </div>
                      )}

                      {layoutItem.id === "comparison" && (
                        <div style={{ display: "flex", flexDirection: "column", height: "100%", gap: 4 }}>
                          <div style={{ width: "90%", height: 10, border: "1.5px dashed #64748b", borderRadius: 3 }} />
                          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 4, height: 10 }}>
                            <div style={{ border: "1.5px dashed #64748b", borderRadius: 2 }} />
                            <div style={{ border: "1.5px dashed #64748b", borderRadius: 2 }} />
                          </div>
                          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 4, flex: 1 }}>
                            <div style={{ border: "1.5px dashed #94a3b8", borderRadius: 3 }} />
                            <div style={{ border: "1.5px dashed #94a3b8", borderRadius: 3 }} />
                          </div>
                        </div>
                      )}

                      {layoutItem.id === "title_only" && (
                        <div style={{ display: "flex", flexDirection: "column", height: "100%" }}>
                          <div style={{ width: "85%", height: 14, border: "1.5px dashed #64748b", borderRadius: 3 }} />
                        </div>
                      )}

                      {layoutItem.id === "blank" && (
                        <div style={{ height: "100%", width: "100%" }} />
                      )}

                      {layoutItem.id === "content_caption" && (
                        <div style={{ display: "grid", gridTemplateColumns: "35% 1fr", gap: 6, height: "100%" }}>
                          <div style={{ border: "1.5px dashed #64748b", borderRadius: 3, padding: 2 }}>
                            <div style={{ width: "80%", height: 8, background: "#cbd5e1", borderRadius: 1 }} />
                          </div>
                          <div style={{ border: "1.5px dashed #94a3b8", borderRadius: 3, display: "flex", alignItems: "center", justifyContent: "center" }}>
                            <span style={{ fontSize: 9, opacity: 0.6 }}>📊</span>
                          </div>
                        </div>
                      )}

                      {layoutItem.id === "picture_caption" && (
                        <div style={{ display: "grid", gridTemplateColumns: "35% 1fr", gap: 6, height: "100%" }}>
                          <div style={{ border: "1.5px dashed #64748b", borderRadius: 3, padding: 2 }}>
                            <div style={{ width: "80%", height: 8, background: "#cbd5e1", borderRadius: 1 }} />
                          </div>
                          <div style={{ border: "1.5px dashed #94a3b8", borderRadius: 3, display: "flex", alignItems: "center", justifyContent: "center" }}>
                            <span style={{ fontSize: 10, opacity: 0.6 }}>🖼️</span>
                          </div>
                        </div>
                      )}
                    </div>

                    {/* CARD TITLE */}
                    <div style={{ fontSize: 12, fontWeight: 700, color: isActive ? "#c084fc" : "#ffffff", textAlign: "center" }}>
                      {layoutItem.label}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
