import React, { useRef, useState, useEffect } from "react";
import { API_BASE_URL } from "../services/api";
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
  { id: "titanium_white", name: "Titanium White", icon: "🏛️", header_bg: "#4f46e5", header_color: "#ffffff", cell_bg: "#f4f4f5", cell_color: "#18181b" },
  { id: "sunset_glow", name: "Sunset Glow", icon: "🌅", header_bg: "#ea580c", header_color: "#ffffff", cell_bg: "#431407", cell_color: "#ffffff" },
  { id: "custom", name: "Custom Palette", icon: "🎨", header_bg: "#8b5cf6", header_color: "#ffffff", cell_bg: "#1e293b", cell_color: "#ffffff" },
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
    return "✅ ";
  }
  if (st === "star") {
    return "⭐ ";
  }
  if (st === "arrow") {
    return "➔ ";
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

  const [showDownloadModal, setShowDownloadModal] = useState(false);
  const [autoPlay, setAutoPlay] = useState(false);
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

  // Helper to use Gemini AI to refine, polish, or convert slide content into punchy bullets
  const handleAIRefine = async (pIdx, action = "bullets") => {
    const plugin = activeSlide?.plugins?.[pIdx];
    if (!plugin) return;
    const currentText = plugin.data?.text || safeArray(plugin.data?.points).join("\n") || plugin.data?.diagram || "";
    if (!currentText) return;

    setRefiningPluginIdx(pIdx);
    try {
      const res = await fetch(`${API_SERVER_URL}/refine-slide`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: currentText, action }),
      });
      const data = await res.json();
      if (data?.refined_text) {
        if (plugin.type === "bullets") {
          const newPoints = data.refined_text.split("\n").map(s => s.replace(/^[•\-*\d.]+\s*/, "").trim()).filter(Boolean);
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

            {isSaved ? (
              <span style={{ fontSize: 11, color: "#86efac", fontWeight: "bold", background: "rgba(34, 197, 94, 0.15)", padding: "4px 8px", borderRadius: 6, border: "1px solid rgba(34, 197, 94, 0.3)" }}>
                ✅ Saved {savedMeta?.presentation_id ? `(${savedMeta.presentation_id})` : "Successfully"}
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
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "nowrap", gap: 8, overflowX: "auto" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 6, flexShrink: 0 }}>
                    <span style={{ fontSize: 11, fontWeight: 700, color: "#c084fc", whiteSpace: "nowrap" }}>Slide Theme BG:</span>
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

                  <div style={{ display: "flex", gap: 6, flexWrap: "nowrap", alignItems: "center", flexShrink: 0 }}>
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
              <div
                className="slide-canvas-box"
                style={{ background: selectedBgConfig.bg, color: selectedBgConfig.text }}
              >
                <div>
                  <div style={{ fontSize: 11, fontWeight: "800", color: selectedBgConfig?.accent || "inherit", opacity: 0.9, letterSpacing: 1 }}>
                    SLIDE {activeSlideIndex + 1} OF {plan.slides.length}
                  </div>
                  <h2
                    style={{
                      fontSize: `clamp(18px, 4vw, ${activeSlide.title_font_size || 26}px)`,
                      color: activeSlide.title_color || "inherit",
                      textAlign: activeSlide.title_align || "left",
                      fontWeight: activeSlide.title_bold === false ? 400 : 800,
                      margin: "6px 0 4px",
                      wordBreak: "break-word",
                    }}
                  >
                    {activeSlide.title || "Slide Title"}
                  </h2>
                  {activeSlide.subtitle ? (
                    <div
                      style={{
                        fontSize: `clamp(12px, 3vw, ${activeSlide.subtitle_font_size || 15}px)`,
                        color: activeSlide.subtitle_color || "inherit",
                        textAlign: activeSlide.subtitle_align || "left",
                        opacity: activeSlide.subtitle_color ? 1 : 0.8,
                        fontWeight: 600,
                        wordBreak: "break-word",
                      }}
                    >
                      {activeSlide.subtitle}
                    </div>
                  ) : null}
                </div>
                
                {/* LIVE PLUGINS CONTENT */}
                {/* LIVE PLUGINS CONTENT */}
                <div style={{ flex: 1, overflowY: "auto", margin: "12px 0", display: "flex", flexDirection: "column", gap: 10, paddingRight: 4 }}>
                  {(() => {
                    const plugins = safeArray(activeSlide.plugins);
                    const hasImage = plugins.some((p) => p.type === "image" && (p.data?.url || p.data?.path));
                    const hasText = plugins.some((p) => p.type === "bullets" || p.type === "paragraph");

                    const renderPluginItem = (p, pIdx) => (
                      <div key={pIdx}>
                        {p.type === "subtitle" || p.type === "text" ? (
                          <h3 style={{ fontSize: p.data?.font_size || 18, textAlign: p.data?.alignment || "left", color: p.data?.font_color || p.data?.color || selectedBgConfig?.accent || "#c084fc", margin: "4px 0" }}>
                            {p.data?.text}
                          </h3>
                        ) : null}

                        {p.type === "paragraph" ? (
                          <p style={{ fontSize: p.data?.font_size || 14, textAlign: p.data?.alignment || "left", color: p.data?.font_color || p.data?.color || "inherit", lineHeight: 1.5, opacity: (p.data?.font_color || p.data?.color) ? 1 : 0.9 }}>
                            {p.data?.text}
                          </p>
                        ) : null}

                        {p.type === "paragraph_2col" ? (
                          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: p.data?.column_gap || 14, margin: "8px 0" }}>
                            <div style={{ background: "rgba(255,255,255,0.03)", padding: 12, borderRadius: 8, border: "1px solid rgba(255,255,255,0.08)" }}>
                              {p.data?.left_title && (
                                <div style={{ fontWeight: 800, fontSize: 13, color: selectedBgConfig?.accent || "#c084fc", marginBottom: 4 }}>
                                  {p.data.left_title}
                                </div>
                              )}
                              <p style={{ fontSize: p.data?.font_size || 13, lineHeight: 1.5, color: p.data?.font_color || p.data?.color || "inherit", opacity: 0.9, margin: 0 }}>
                                {p.data?.left_text || p.data?.text || "Left paragraph content..."}
                              </p>
                            </div>
                            <div style={{ background: "rgba(255,255,255,0.03)", padding: 12, borderRadius: 8, border: "1px solid rgba(255,255,255,0.08)" }}>
                              {p.data?.right_title && (
                                <div style={{ fontWeight: 800, fontSize: 13, color: selectedBgConfig?.accent || "#c084fc", marginBottom: 4 }}>
                                  {p.data.right_title}
                                </div>
                              )}
                              <p style={{ fontSize: p.data?.font_size || 13, lineHeight: 1.5, color: p.data?.font_color || p.data?.color || "inherit", opacity: 0.9, margin: 0 }}>
                                {p.data?.right_text || "Right paragraph content..."}
                              </p>
                            </div>
                          </div>
                        ) : null}

                        {p.type === "bullets" ? (
                          <div style={{ paddingLeft: 4, margin: "6px 0", textAlign: p.data?.alignment || p.data?.align || "left", color: p.data?.font_color || p.data?.color || "inherit" }}>
                            {safeArray(p.data?.points).map((pt, bIdx) => (
                              <div key={bIdx} style={{ fontSize: p.data?.font_size || 14, marginBottom: 5, display: "flex", gap: 8, alignItems: "baseline" }}>
                                <span style={{ fontWeight: 800, color: selectedBgConfig?.accent || "#c084fc", flexShrink: 0 }}>
                                  {formatBulletPrefix(p.data?.bullet_style || p.data?.list_style, bIdx, p.data?.points)}
                                </span>
                                <span>{pt}</span>
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
                            const textRaw = p.data?.diagram || p.data?.text || "[Input] ➔ [Processing] ➔ [Output]";
                            const diagType = detectDiagramType(textRaw, p.data?.diagram_type);
                            const steps = textRaw.split(/➔|->|→/).map(s => s.trim()).filter(Boolean);
                            
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
                                          {sIdx < steps.length - 1 && <span style={{ color: selectedBgConfig?.accent || "#c084fc", fontSize: 18, fontWeight: 900 }}>➔</span>}
                                        </React.Fragment>
                                      );
                                    })}
                                  </div>
                                )}

                                {diagType === "architecture" && (
                                  <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 8, maxWidth: "85%", margin: "0 auto", padding: "6px 0" }}>
                                    {steps.map((step, sIdx) => (
                                      <React.Fragment key={sIdx}>
                                        <div style={{
                                          width: "100%",
                                          background: `linear-gradient(135deg, ${selectedBgConfig?.accent || "#c084fc"}33 0%, rgba(15,23,42,0.9) 100%)`,
                                          border: `1.5px solid ${selectedBgConfig?.accent || "#c084fc"}`,
                                          borderRadius: "10px",
                                          padding: "8px 16px",
                                          fontSize: p.data?.font_size || 12,
                                          fontWeight: 700,
                                          textAlign: "center",
                                          color: "#fff",
                                          display: "flex",
                                          justifyContent: "space-between",
                                          alignItems: "center",
                                          boxShadow: "0 4px 10px rgba(0,0,0,0.3)"
                                        }}>
                                          <span style={{ fontSize: 10, fontWeight: 800, color: selectedBgConfig?.accent || "#c084fc", background: "rgba(0,0,0,0.4)", padding: "2px 8px", borderRadius: 4 }}>
                                            TIER {sIdx + 1}
                                          </span>
                                          <span style={{ fontWeight: 700 }}>{step}</span>
                                          <span style={{ opacity: 0.5, fontSize: 10 }}>[Layer Spec]</span>
                                        </div>
                                        {sIdx < steps.length - 1 && <span style={{ color: selectedBgConfig?.accent || "#c084fc", fontSize: 12 }}>⬇️</span>}
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
                
                {/* SPEAKER NOTES DISPLAY */}
                {activeSlide.plugins?.find((p) => p.type === "notes") ? (
                  <div style={{ background: "rgba(0,0,0,0.3)", padding: 8, borderRadius: 8, fontSize: 11, color: "rgba(255,255,255,0.8)" }}>
                    🗣️ Notes: {activeSlide.plugins.find((p) => p.type === "notes")?.data?.notes}
                  </div>
                ) : null}
              </div>

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
                        <option value="auto">✨ Auto</option>
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
                        <option value="auto">✨ Auto</option>
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
                        <option value="auto">✨ Auto</option>
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
                        <option value="auto">✨ Auto</option>
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
                      <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                        <div style={{ background: "rgba(255,255,255,0.03)", padding: 10, borderRadius: 10, border: "1px solid rgba(255,255,255,0.08)" }}>
                          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
                            <label style={{ fontSize: 11, fontWeight: 700, color: "#c084fc", display: "flex", alignItems: "center", gap: 4 }}>
                              📐 Select Visual Diagram Style / Structure:
                            </label>
                            <span style={{ fontSize: 10, opacity: 0.8, color: "#86efac", background: "rgba(34, 197, 94, 0.15)", padding: "2px 6px", borderRadius: 4, border: "1px solid rgba(34, 197, 94, 0.3)" }}>
                              Active: <strong>{(plugin.data?.diagram_type || "auto").toUpperCase()}</strong>
                            </span>
                          </div>

                          {/* VISUAL DIAGRAM TYPE PRESET CHIPS ROW (SINGLE SCROLLABLE ROW 🎯) */}
                          <div className="diagram-chips-row" style={{ display: "flex", flexWrap: "nowrap", overflowX: "auto", gap: 6, alignItems: "center", width: "100%", paddingBottom: 4 }}>
                            {[
                              { id: "flowchart", label: "🔄 Flowchart", defaultText: "[Start Process] ➔ [Data Ingestion] ➔ [Processing Engine] ➔ [Output Result]" },
                              { id: "architecture", label: "🏛️ Architecture", defaultText: "[User & Presentation Layer] ➔ [API Gateway & Business Logic] ➔ [Database & Security Tier]" },
                              { id: "timeline", label: "📅 Timeline", defaultText: "Phase 1: Setup ➔ Phase 2: Core Development ➔ Phase 3: Testing ➔ Phase 4: Global Launch" },
                              { id: "tree", label: "🌳 Tree", defaultText: "[Root System Concept] ➔ [Branch A: Frontend Service] ➔ [Branch B: Backend Engine] ➔ [Leaf Node: Database]" },
                              { id: "io_cards", label: "📥 I/O Cards", defaultText: "[Raw Data Ingestion] ➔ [High Performance Computing Engine] ➔ [Analytics & Report Output]" },
                              { id: "mindmap", label: "🧠 Mindmap", defaultText: "[Central Core Topic] ➔ [Subtopic A: Strategy] ➔ [Subtopic B: Operations] ➔ [Subtopic C: Metrics]" },
                              { id: "funnel", label: "🔻 Funnel", defaultText: "[Stage 1: Awareness 100%] ➔ [Stage 2: Interest 60%] ➔ [Stage 3: Decision 30%] ➔ [Stage 4: Action 10%]" },
                              { id: "cycle", label: "🔁 Cycle", defaultText: "[Requirement Phase] ➔ [Design & Build] ➔ [Validation Test] ➔ [Deployment Loop]" },
                              { id: "pyramid", label: "🔺 Pyramid", defaultText: "[Foundation Security Layer] ➔ [Infrastructure & Network Tier] ➔ [Executive Peak]" },
                              { id: "quadrant", label: "🧭 2x2 Matrix", defaultText: "[Strengths: High Performance] ➔ [Weaknesses: Initial Cost] ➔ [Opportunities: Growth] ➔ [Threats: Risk]" },
                              { id: "comparison", label: "⚔️ Comparison", defaultText: "[Option A: Cloud Microservices] ➔ [Option B: On-Premises Monolith]" },
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
                                    padding: "5px 12px",
                                    fontSize: 11,
                                    fontWeight: "bold",
                                    cursor: "pointer",
                                    borderRadius: 8,
                                    whiteSpace: "nowrap",
                                    flexShrink: 0,
                                    transition: "all 0.2s ease",
                                    borderColor: isActive ? "#c084fc" : "rgba(255,255,255,0.15)",
                                    background: isActive ? "linear-gradient(135deg, rgba(192, 132, 252, 0.3) 0%, rgba(124, 58, 237, 0.3) 100%)" : "rgba(0,0,0,0.3)",
                                    color: isActive ? "#ffffff" : "rgba(255,255,255,0.85)",
                                    boxShadow: isActive ? "0 0 10px rgba(192, 132, 252, 0.4)" : "none",
                                  }}
                                >
                                  {diagOpt.label}
                                </button>
                              );
                            })}
                          </div>
                        </div>

                        <div>
                          <label style={{ fontSize: 11, color: "var(--text-muted)", display: "block", marginBottom: 2 }}>Diagram Title / Header:</label>
                          <input
                            type="text"
                            value={plugin.data?.title || plugin.data?.diagram_title || ""}
                            onChange={(e) => {
                              handlePluginTextChange(activeSlideIndex, pIdx, "title", e.target.value);
                              handlePluginTextChange(activeSlideIndex, pIdx, "diagram_title", e.target.value);
                            }}
                            placeholder="e.g. System Architecture & Process Workflow"
                            style={{ width: "100%", background: "rgba(0,0,0,0.4)", border: "1px solid var(--panel-border)", borderRadius: 8, padding: 8, color: "#fff", fontSize: 13, marginBottom: 8 }}
                          />
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
                          isRefining={refiningPluginIdx === pIdx}
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

                        {/* TABLE COLOR & STYLE FORMATTING BAR WITH THEME PRESETS */}
                        <div style={{ display: "flex", flexDirection: "column", gap: 8, background: "rgba(255,255,255,0.03)", padding: "10px", borderRadius: 8, border: "1px solid rgba(255,255,255,0.08)" }}>
                          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                            <span style={{ fontSize: 11, fontWeight: 800, color: "#c084fc" }}>🎨 Select Table Visual Theme / Color Preset:</span>
                          </div>
                          {/* TABLE THEME BUTTONS ROW (SINGLE HORIZONTAL ROW 🎯) */}
                          <div style={{ display: "flex", flexWrap: "nowrap", overflowX: "auto", gap: 6, marginTop: 4, width: "100%", alignItems: "center", paddingBottom: 4 }}>
                            {TABLE_THEME_PRESETS.map((themePreset) => {
                              const currentTheme = plugin.data?.table_theme || "custom";
                              const isActive = currentTheme === themePreset.id;
                              return (
                                <button
                                  key={themePreset.id}
                                  type="button"
                                  className="btn-ui secondary sm"
                                  title={themePreset.name}
                                  onClick={() => {
                                    handlePluginTextChange(activeSlideIndex, pIdx, "table_theme", themePreset.id);
                                    handlePluginTextChange(activeSlideIndex, pIdx, "header_bg", themePreset.header_bg);
                                    handlePluginTextChange(activeSlideIndex, pIdx, "header_color", themePreset.header_color);
                                    handlePluginTextChange(activeSlideIndex, pIdx, "cell_bg", themePreset.cell_bg);
                                    handlePluginTextChange(activeSlideIndex, pIdx, "cell_color", themePreset.cell_color);
                                  }}
                                  style={{
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                    gap: 4,
                                    padding: "4px 8px",
                                    fontSize: 12,
                                    fontWeight: 700,
                                    cursor: "pointer",
                                    borderRadius: 8,
                                    flexShrink: 0,
                                    borderColor: isActive ? "#c084fc" : "rgba(255,255,255,0.15)",
                                    background: isActive ? "rgba(192, 132, 252, 0.2)" : "rgba(0,0,0,0.35)",
                                    color: isActive ? "#c084fc" : "#fff",
                                    boxShadow: isActive ? "0 0 10px rgba(192, 132, 252, 0.4)" : "none",
                                    transition: "all 0.2s ease",
                                  }}
                                >
                                  <span
                                    style={{
                                      width: 14,
                                      height: 14,
                                      borderRadius: "50%",
                                      background: `linear-gradient(135deg, ${themePreset.header_bg} 50%, ${themePreset.cell_bg} 50%)`,
                                      border: "1px dashed rgba(255,255,255,0.5)",
                                      display: "inline-block",
                                      flexShrink: 0,
                                    }}
                                  />
                                  <span style={{ fontSize: 11 }}>{themePreset.icon}</span>
                                </button>
                              );
                            })}
                          </div>

                          {/* COLOR PICKERS ROW (SINGLE HORIZONTAL ROW 🎯) */}
                          <div className="table-preset-color-row" style={{ display: "flex", gap: 14, alignItems: "center", flexWrap: "nowrap", overflowX: "auto", marginTop: 4, width: "100%", justifyContent: "flex-start", paddingBottom: 2 }}>
                            <label style={{ fontSize: 10, color: "var(--text-muted)", display: "flex", alignItems: "center", gap: 4, whiteSpace: "nowrap", flexShrink: 0 }}>
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
                            <label style={{ fontSize: 10, color: "var(--text-muted)", display: "flex", alignItems: "center", gap: 4, whiteSpace: "nowrap", flexShrink: 0 }}>
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
                            <label style={{ fontSize: 10, color: "var(--text-muted)", display: "flex", alignItems: "center", gap: 4, whiteSpace: "nowrap", flexShrink: 0 }}>
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
                            <label style={{ fontSize: 10, color: "var(--text-muted)", display: "flex", alignItems: "center", gap: 4, whiteSpace: "nowrap", flexShrink: 0 }}>
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
                              value={plugin.data?.chart_type || "column"}
                              onChange={(e) => handlePluginTextChange(activeSlideIndex, pIdx, "chart_type", e.target.value)}
                              style={{ width: "100%", background: "rgba(0,0,0,0.4)", border: "1px solid var(--panel-border)", borderRadius: 8, padding: 6, color: "#fff", fontSize: 12 }}
                            >
                              <option value="column">📊 Column Chart (Vertical)</option>
                              <option value="bar_horizontal">📊 Bar Chart (Horizontal)</option>
                              <option value="line">📈 Line Chart (Trend)</option>
                              <option value="pie">🥧 Pie Chart (Proportion)</option>
                              <option value="area">📉 Area Chart (Cumulative)</option>
                              <option value="donut">🍩 Doughnut Ring Chart</option>
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

                        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
                          <div>
                            <label style={{ fontSize: 11, color: "var(--text-muted)" }}>Categories / X-Axis Labels (comma separated):</label>
                            <input
                              type="text"
                              value={safeArray(plugin.data?.labels).length ? safeArray(plugin.data?.labels).join(", ") : safeArray(plugin.data?.categories).join(", ")}
                              onChange={(e) => {
                                handleChartDataChange(activeSlideIndex, pIdx, "labels", e.target.value);
                                handleChartDataChange(activeSlideIndex, pIdx, "categories", e.target.value);
                              }}
                              placeholder="Q1, Q2, Q3, Q4"
                              style={{ width: "100%", background: "rgba(0,0,0,0.4)", border: "1px solid var(--panel-border)", borderRadius: 8, padding: 6, color: "#fff", fontSize: 12 }}
                            />
                          </div>
                          <div>
                            <label style={{ fontSize: 11, color: "var(--text-muted)" }}>Series Legend Name:</label>
                            <input
                              type="text"
                              value={plugin.data?.series_name || ""}
                              onChange={(e) => handlePluginTextChange(activeSlideIndex, pIdx, "series_name", e.target.value)}
                              placeholder="e.g. Metric Value ($M)"
                              style={{ width: "100%", background: "rgba(0,0,0,0.4)", border: "1px solid var(--panel-border)", borderRadius: 8, padding: 6, color: "#fff", fontSize: 12 }}
                            />
                          </div>
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

                        {/* ADVANCED CHART DISPLAY & LEGEND CONTROLS */}
                        <div style={{ display: "flex", gap: 14, alignItems: "center", flexWrap: "wrap", background: "rgba(255,255,255,0.03)", padding: "6px 10px", borderRadius: 6, border: "1px solid rgba(255,255,255,0.08)" }}>
                          <span style={{ fontSize: 10, fontWeight: 700, color: "#c084fc", width: "100%" }}>⚙️ Advanced Chart Display Options:</span>
                          
                          <label style={{ fontSize: 11, color: "#fff", display: "flex", alignItems: "center", gap: 5, cursor: "pointer" }}>
                            <input
                              type="checkbox"
                              checked={plugin.data?.show_data_labels !== false}
                              onChange={(e) => handlePluginTextChange(activeSlideIndex, pIdx, "show_data_labels", e.target.checked)}
                            />
                            Show Value Labels
                          </label>

                          <label style={{ fontSize: 11, color: "#fff", display: "flex", alignItems: "center", gap: 5, cursor: "pointer" }}>
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
                              style={{ background: "rgba(0,0,0,0.4)", border: "1px solid var(--panel-border)", borderRadius: 4, padding: "2px 4px", color: "#fff", fontSize: 11 }}
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
                                style={{ fontSize: 10, padding: "3px 8px" }}
                                onClick={() => handleAutoUnsplashFetch(pIdx, plugin.data?.caption)}
                              >
                                ⚡ Auto Unsplash Image
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
                              { style: "check", symbol: "✅", title: "Checklist Items" },
                              { style: "star", symbol: "⭐", title: "Star Highlight List" },
                              { style: "arrow", symbol: "➔", title: "Arrow Pointer List" },
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
                          <span style={{ fontSize: 11, fontWeight: 700, color: "#c084fc" }}>¶¶ 2-Column Side-by-Side Paragraphs:</span>
                          <button
                            type="button"
                            className="btn-ui secondary sm"
                            style={{ fontSize: 10, padding: "2px 8px" }}
                            onClick={() => {
                              handlePluginTextChange(activeSlideIndex, pIdx, "type", "paragraph");
                              handlePluginTextChange(activeSlideIndex, pIdx, "text", plugin.data?.left_text || plugin.data?.text || "");
                            }}
                          >
                            ¶ Convert to 1 Single Column
                          </button>
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
        <div className="presenter-overlay">
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", width: "100%", maxWidth: "1280px", margin: "0 auto", paddingBottom: 10 }}>
            <div style={{ color: "#c084fc", fontWeight: "bold", fontSize: 14, display: "flex", alignItems: "center", gap: 12 }}>
              <span>Slide {presenterSlideIndex + 1} of {plan.slides.length}</span>
              <span style={{ opacity: 0.6 }}>│</span>
              <span>Timer: {minutesFormatted}:{secondsFormatted}</span>
            </div>

            <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
              {/* AUTO PLAY SLIDESHOW TOGGLE & SPEED CONTROLS */}
              <div style={{ display: "flex", alignItems: "center", gap: 6, background: "rgba(255,255,255,0.06)", padding: "4px 8px", borderRadius: 8, border: "1px solid rgba(255,255,255,0.15)" }}>
                <button
                  className="btn-ui primary sm"
                  onClick={() => setAutoPlay(!autoPlay)}
                  style={{ background: autoPlay ? "linear-gradient(135deg, #ef4444, #f43f5e)" : "linear-gradient(135deg, #10b981, #059669)", border: "none", fontSize: 11, padding: "3px 10px" }}
                >
                  {autoPlay ? "⏸️ Pause Auto-Play" : "▶️ Auto Play"}
                </button>
                <select
                  value={autoPlaySpeed}
                  onChange={(e) => setAutoPlaySpeed(Number(e.target.value))}
                  style={{ background: "rgba(0,0,0,0.5)", border: "1px solid var(--panel-border)", color: "#fff", borderRadius: 4, padding: "2px 4px", fontSize: 11 }}
                >
                  <option value={3}>3 sec / slide</option>
                  <option value={5}>5 sec / slide</option>
                  <option value={8}>8 sec / slide</option>
                  <option value={10}>10 sec / slide</option>
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
                style={{ background: "linear-gradient(135deg, #8b5cf6, #06b6d4)", border: "none" }}
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
                setAutoPlay(false);
                stopPresentationMode();
              }}>
                ✕ Exit (Esc)
              </button>
            </div>
          </div>

          <div className="presenter-canvas">
            {/* 16:9 PERFECT ASPECT RATIO WIDESCREEN PRESENTATION CANVAS */}
            <div
              style={{
                width: "100%",
                maxWidth: "1150px",
                aspectRatio: "16 / 9",
                background: selectedBgConfig.bg,
                color: selectedBgConfig.text,
                borderRadius: 20,
                padding: "36px 48px",
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between",
                boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.7)",
                border: "1px solid rgba(255, 255, 255, 0.15)",
                overflow: "hidden",
                boxSizing: "border-box",
              }}
            >
              <div>
                <div style={{ fontSize: 11, fontWeight: "800", opacity: 0.6, letterSpacing: 1 }}>
                  SLIDE {presenterSlideIndex + 1} OF {plan.slides.length}
                </div>
                <h1
                  style={{
                    fontSize: presenterSlide.title_font_size ? presenterSlide.title_font_size * 1.3 : 36,
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

              <div style={{ flex: 1, overflowY: "auto", margin: "12px 0", display: "flex", flexDirection: "column", gap: 12 }}>
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
                        <p style={{ fontSize: plugin.data?.font_size || 18, textAlign: plugin.data?.alignment || "left", color: plugin.data?.font_color || plugin.data?.color || "inherit", lineHeight: 1.5, opacity: 0.95 }}>
                          {plugin.data?.text}
                        </p>
                      ) : null}

                      {plugin.type === "bullets" ? (
                        <ul style={{ paddingLeft: 24, textAlign: plugin.data?.alignment || "left", color: plugin.data?.font_color || plugin.data?.color || "inherit" }}>
                          {safeArray(plugin.data?.points).map((pt, bIdx) => (
                            <li key={bIdx} style={{ fontSize: plugin.data?.font_size || 18, marginBottom: 6 }}>{pt}</li>
                          ))}
                        </ul>
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
            </div>

            {showPresenterNotes ? (
              <div
                style={{
                  marginTop: 12,
                  width: "100%",
                  maxWidth: "1150px",
                  background: "rgba(255,255,255,0.06)",
                  border: "1px solid rgba(255,255,255,0.1)",
                  borderRadius: 12,
                  padding: "10px 16px",
                  color: "#e2e8f0",
                  fontSize: 13,
                }}
              >
                <strong>🗣️ Presenter Notes:</strong>{" "}
                {presenterSlide.plugins?.find((p) => p.type === "notes")?.data?.notes || "No speaker notes for this slide."}
              </div>
            ) : null}
          </div>

          <div style={{ display: "flex", justifyContent: "center", gap: 16, paddingTop: 6 }}>
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

      {/* DOWNLOAD SUCCESS POPUP MODAL 🎁 */}
      {showDownloadModal && (
        <div style={{
          position: "fixed",
          inset: 0,
          zIndex: 10000,
          background: "rgba(9, 13, 24, 0.85)",
          backdropFilter: "blur(8px)",
          display: "grid",
          placeItems: "center",
          padding: 16
        }}>
          <div style={{
            background: "linear-gradient(135deg, #0f172a 0%, #1e1b4b 100%)",
            border: "1px solid #c084fc",
            borderRadius: 24,
            padding: "32px 28px",
            maxWidth: 480,
            width: "100%",
            boxShadow: "0 25px 50px -12px rgba(192, 132, 252, 0.4)",
            textAlign: "center",
            position: "relative"
          }}>
            <button
              onClick={() => setShowDownloadModal(false)}
              style={{ position: "absolute", top: 16, right: 16, background: "none", border: "none", color: "#fff", fontSize: 18, cursor: "pointer", opacity: 0.7 }}
            >
              ✖
            </button>

            <div style={{ fontSize: 48, marginBottom: 8 }}>🎉</div>
            <h2 style={{ fontSize: 20, fontWeight: 900, color: "#fff", margin: "0 0 6px 0" }}>
              {plan?.title || "Presentation Deck Ready!"}
            </h2>
            <p style={{ fontSize: 13, color: "rgba(255,255,255,0.7)", margin: "0 0 20px 0" }}>
              {exportFormat === "pdf"
                ? "Your PDF document presentation has been generated successfully!"
                : "Your 16:9 Widescreen PowerPoint presentation has been generated successfully!"}
            </p>

            <div style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 14, padding: 14, marginBottom: 24, textAlign: "left", fontSize: 13 }}>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
                <span style={{ color: "var(--text-muted)" }}>Format:</span>
                <span style={{ fontWeight: 700, color: "#86efac" }}>
                  {exportFormat === "pdf" ? "PDF (Document)" : "PPTX (16:9 Widescreen)"}
                </span>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <span style={{ color: "var(--text-muted)" }}>Total Slides:</span>
                <span style={{ fontWeight: 700, color: "#c084fc" }}>{plan?.slides?.length || 0} Slides</span>
              </div>
            </div>

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
                  padding: "12px 24px",
                  fontSize: 14,
                  fontWeight: 800,
                  background: loadingGenerate
                    ? "linear-gradient(135deg, #4b5563, #374151)"
                    : "linear-gradient(135deg, #10b981, #059669)",
                  border: "none",
                  borderRadius: 12,
                  cursor: loadingGenerate ? "not-allowed" : "pointer",
                  boxShadow: "0 8px 20px rgba(16, 185, 129, 0.4)"
                }}
              >
                {loadingGenerate
                  ? (exportFormat === "pdf" ? "⏳ Compiling PDF..." : "⏳ Compiling PPTX...")
                  : (exportFormat === "pdf" ? "📥 Download PDF Now" : "📥 Download PPTX Now")}
              </button>
              <button
                type="button"
                className="btn-ui secondary"
                onClick={() => setShowDownloadModal(false)}
                style={{ padding: "12px 20px", borderRadius: 12, fontSize: 13 }}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
