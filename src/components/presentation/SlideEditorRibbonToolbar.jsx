import React, { useState, useEffect, useMemo, useRef } from "react";
import { API_BASE_URL } from "../../services/api";

const DEFAULT_TEMPLATE_PREVIEWS = [
  { id: "base_template", name: "Slate Teal", bg: "linear-gradient(135deg, #0f172a 0%, #115e59 100%)", textColor: "#ffffff", accent: "#2dd4bf", swatches: ["#2dd4bf", "#14b8a6", "#0d9488", "#06b6d4", "#38bdf8", "#64748b"], category: "Teal" },
  { id: "sidebar_executive", name: "Executive Sidebar", bg: "linear-gradient(135deg, #0f172a 0%, #1e293b 100%)", textColor: "#ffffff", accent: "#38bdf8", swatches: ["#38bdf8", "#0284c7", "#2563eb", "#60a5fa", "#93c5fd", "#94a3b8"], category: "Corporate" },
  { id: "corporate_light", name: "Corporate Light", bg: "linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)", textColor: "#0f172a", accent: "#0284c7", swatches: ["#0284c7", "#2563eb", "#0ea5e9", "#3b82f6", "#64748b", "#94a3b8"], category: "Light" },
  { id: "executive_gold", name: "Executive Gold", bg: "linear-gradient(135deg, #1c1917 0%, #78350f 100%)", textColor: "#ffffff", accent: "#fbbf24", swatches: ["#fbbf24", "#f59e0b", "#d97706", "#b45309", "#78350f", "#a8a29e"], category: "Gold" },
  { id: "ion_boardroom", name: "Ion Boardroom", bg: "linear-gradient(135deg, #090d16 0%, #31104b 100%)", textColor: "#ffffff", accent: "#ec4899", swatches: ["#ec4899", "#db2777", "#be185d", "#9d174d", "#c084fc", "#f43f5e"], category: "Modern" },
  { id: "berlin_executive", name: "Berlin Executive", bg: "linear-gradient(135deg, #18181b 0%, #27272a 100%)", textColor: "#ffffff", accent: "#f97316", swatches: ["#f97316", "#ea580c", "#c2410c", "#9a3412", "#fb923c", "#71717a"], category: "Executive" },
  { id: "quotable_teal", name: "Quotable Teal", bg: "linear-gradient(135deg, #042f2e 0%, #0f766e 100%)", textColor: "#ffffff", accent: "#06b6d4", swatches: ["#06b6d4", "#0891b2", "#0e7490", "#155e75", "#22d3ee", "#5eead4"], category: "Teal" },
  { id: "geometric_block", name: "Geometric Color Block", bg: "linear-gradient(135deg, #3b0764 0%, #1e1b4b 100%)", textColor: "#ffffff", accent: "#3b82f6", swatches: ["#3b82f6", "#2563eb", "#1d4ed8", "#6366f1", "#8b5cf6", "#a855f7"], category: "Creative" },
  { id: "urban_monochrome", name: "Urban Monochrome", bg: "linear-gradient(135deg, #0f172a 0%, #334155 100%)", textColor: "#ffffff", accent: "#38bdf8", swatches: ["#38bdf8", "#0ea5e9", "#0284c7", "#64748b", "#94a3b8", "#cbd5e1"], category: "Monochrome" },
  { id: "crop_frame", name: "Crop Minimal", bg: "linear-gradient(135deg, #1c1917 0%, #292524 100%)", textColor: "#ffffff", accent: "#e7e5e4", swatches: ["#e7e5e4", "#d6d3d1", "#a8a29e", "#78716c", "#57534e", "#44403c"], category: "Minimal" },
  { id: "circuit_tech", name: "Circuit Tech Cyber", bg: "linear-gradient(135deg, #09090b 0%, #581c87 100%)", textColor: "#ffffff", accent: "#22d3ee", swatches: ["#22d3ee", "#06b6d4", "#0891b2", "#7c3aed", "#9333ea", "#c084fc"], category: "Tech" },
  { id: "cyber_neon", name: "Cyberpunk Neon", bg: "linear-gradient(135deg, #050505 0%, #2e0854 100%)", textColor: "#ffffff", accent: "#00ffcc", swatches: ["#00ffcc", "#10b981", "#06b6d4", "#ec4899", "#f43f5e", "#a855f7"], category: "Tech" },
  { id: "celestial_night", name: "Celestial Night", bg: "linear-gradient(135deg, #090d18 0%, #1e1b4b 100%)", textColor: "#ffffff", accent: "#818cf8", swatches: ["#818cf8", "#6366f1", "#4f46e5", "#4338ca", "#3730a3", "#c084fc"], category: "Creative" },
  { id: "modern_glassmorphism", name: "Dark Glassmorphism", bg: "linear-gradient(135deg, #18181b 0%, #27272a 100%)", textColor: "#ffffff", accent: "#c084fc", swatches: ["#c084fc", "#a855f7", "#9333ea", "#7e22ce", "#6b21a8", "#e879f9"], category: "Modern" },
  { id: "artistic_neon", name: "Artistic Neon", bg: "linear-gradient(135deg, #09090b 0%, #2e1065 100%)", textColor: "#ffffff", accent: "#ff5e00", swatches: ["#ff5e00", "#f97316", "#ea580c", "#c2410c", "#ec4899", "#8b5cf6"], category: "Creative" },
  { id: "atlas_bold", name: "Atlas Crimson", bg: "linear-gradient(135deg, #450a0a 0%, #1c1917 100%)", textColor: "#ffffff", accent: "#ef4444", swatches: ["#ef4444", "#dc2626", "#b91c1c", "#991b1b", "#7f1d1d", "#f87171"], category: "Bold" },
  { id: "organic_pastel", name: "Organic Earthy Pastel", bg: "linear-gradient(135deg, #14532d 0%, #1c1917 100%)", textColor: "#ffffff", accent: "#86efac", swatches: ["#86efac", "#4ade80", "#22c55e", "#16a34a", "#15803d", "#166534"], category: "Nature" },
  { id: "emerald_nature", name: "Emerald Forest Nature", bg: "linear-gradient(135deg, #064e3b 0%, #022c22 100%)", textColor: "#ffffff", accent: "#10b981", swatches: ["#10b981", "#059669", "#047857", "#065f46", "#064e3b", "#34d399"], category: "Nature" },
  { id: "dividend_burgundy", name: "Dividend Burgundy", bg: "linear-gradient(135deg, #4a044e 0%, #1e1b4b 100%)", textColor: "#ffffff", accent: "#f43f5e", swatches: ["#f43f5e", "#e11d48", "#be123c", "#9f1239", "#881337", "#fb7185"], category: "Corporate" },
  { id: "savon_classic", name: "Savon Classic", bg: "linear-gradient(135deg, #3f3f46 0%, #18181b 100%)", textColor: "#ffffff", accent: "#a1a1aa", swatches: ["#a1a1aa", "#71717a", "#52525b", "#3f3f46", "#27272a", "#d4d4d8"], category: "Classic" },
  { id: "wood_type", name: "Wood Type Vintage", bg: "linear-gradient(135deg, #451a03 0%, #1c1917 100%)", textColor: "#ffffff", accent: "#f59e0b", swatches: ["#f59e0b", "#d97706", "#b45309", "#92400e", "#78350f", "#fbbf24"], category: "Vintage" },
  { id: "dark_gradient", name: "Midnight Purple", bg: "linear-gradient(135deg, #0f172a 0%, #1e1b4b 50%, #31104b 100%)", textColor: "#ffffff", accent: "#c084fc", swatches: ["#c084fc", "#8b5cf6", "#6366f1", "#a855f7", "#ec4899", "#3b82f6"], category: "Purple" },
  { id: "ocean_blue", name: "Ocean Breeze", bg: "linear-gradient(135deg, #06101e 0%, #0b2545 50%, #134074 100%)", textColor: "#ffffff", accent: "#38bdf8", swatches: ["#38bdf8", "#0ea5e9", "#0284c7", "#0369a1", "#075985", "#60a5fa"], category: "Blue" },
  { id: "emerald_dark", name: "Emerald Forest Dark", bg: "linear-gradient(135deg, #022c22 0%, #064e3b 50%, #047857 100%)", textColor: "#ffffff", accent: "#34d399", swatches: ["#34d399", "#10b981", "#059669", "#047857", "#064e3b", "#022c22"], category: "Green" },
  { id: "cyberpunk_neon", name: "Cyberpunk Glow", bg: "linear-gradient(135deg, #09090b 0%, #2e1065 50%, #581c87 100%)", textColor: "#ffffff", accent: "#f43f5e", swatches: ["#f43f5e", "#ec4899", "#c084fc", "#a855f7", "#00ffcc", "#38bdf8"], category: "Tech" },
  { id: "wall_street", name: "Wall Street Finance", bg: "linear-gradient(135deg, #022c22 0%, #0f172a 50%, #1e293b 100%)", textColor: "#ffffff", accent: "#10b981", swatches: ["#10b981", "#059669", "#047857", "#0d9488", "#14b8a6", "#2dd4bf"], category: "Finance" },
  { id: "velvet_rose", name: "Velvet Rose", bg: "linear-gradient(135deg, #2a0813 0%, #4c0519 50%, #881337 100%)", textColor: "#ffffff", accent: "#fb7185", swatches: ["#fb7185", "#f43f5e", "#e11d48", "#be123c", "#9f1239", "#fda4af"], category: "Rose" },
  { id: "executive_slate", name: "Executive Slate Dark", bg: "linear-gradient(135deg, #18181b 0%, #27272a 50%, #3f3f46 100%)", textColor: "#ffffff", accent: "#a1a1aa", swatches: ["#a1a1aa", "#71717a", "#6366f1", "#818cf8", "#cbd5e1", "#e2e8f0"], category: "Executive" },
  { id: "clean_light", name: "Minimal Light Clean", bg: "linear-gradient(135deg, #f8fafc 0%, #f1f5f9 50%, #e2e8f0 100%)", textColor: "#0f172a", accent: "#2563eb", swatches: ["#2563eb", "#3b82f6", "#60a5fa", "#93c5fd", "#64748b", "#94a3b8"], category: "Light" },
  { id: "titanium_white", name: "Titanium White Pure", bg: "linear-gradient(135deg, #ffffff 0%, #fafafa 50%, #f4f4f5 100%)", textColor: "#18181b", accent: "#4f46e5", swatches: ["#4f46e5", "#6366f1", "#818cf8", "#a5b4fc", "#71717a", "#a1a1aa"], category: "Light" },
  { id: "sunset_glow", name: "Sunset Glow Radiant", bg: "linear-gradient(135deg, #2e1065 0%, #701a75 50%, #9f1239 100%)", textColor: "#ffffff", accent: "#fb7185", swatches: ["#fb7185", "#f43f5e", "#e11d48", "#c026d3", "#a21caf", "#86198f"], category: "Sunset" },
];

export const MASTER_SLIDE_TEMPLATES = [
  { id: "base_template", name: "Slate Teal", badge: "TEAL", desc: "Dark Slate & Teal Widescreen", bg: "linear-gradient(135deg, #0f172a 0%, #115e59 100%)", accent: "#2dd4bf" },
  { id: "sidebar_executive", name: "Executive Sidebar", badge: "RAIL", desc: "Navy Sidebar & Off-White Card", bg: "linear-gradient(135deg, #0f172a 0%, #1e293b 100%)", accent: "#38bdf8" },
  { id: "corporate_light", name: "Corporate Light", badge: "LIGHT", desc: "Clean Crisp White & Slate Blue", bg: "linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)", accent: "#0284c7" },
  { id: "executive_gold", name: "Executive Gold", badge: "GOLD", desc: "Charcoal & Rich Amber Gold", bg: "linear-gradient(135deg, #1c1917 0%, #78350f 100%)", accent: "#fbbf24" },
  { id: "ion_boardroom", name: "Ion Boardroom", badge: "ION", desc: "Magenta Tag & Midnight Violet", bg: "linear-gradient(135deg, #090d16 0%, #31104b 100%)", accent: "#ec4899" },
  { id: "berlin_executive", name: "Berlin Executive", badge: "EXEC", desc: "Burnt Orange & Charcoal Bar", bg: "linear-gradient(135deg, #18181b 0%, #27272a 100%)", accent: "#f97316" },
  { id: "quotable_teal", name: "Quotable Teal", badge: "QUOTE", desc: "Cyan & Charcoal Dual Block", bg: "linear-gradient(135deg, #042f2e 0%, #0f766e 100%)", accent: "#06b6d4" },
  { id: "geometric_block", name: "Geometric Block", badge: "GEO", desc: "Pastel Lavender & Royal Blue", bg: "linear-gradient(135deg, #3b0764 0%, #1e1b4b 100%)", accent: "#3b82f6" },
  { id: "urban_monochrome", name: "Urban Monochrome", badge: "URBAN", desc: "Architectural Slate Grid", bg: "linear-gradient(135deg, #0f172a 0%, #334155 100%)", accent: "#38bdf8" },
  { id: "crop_frame", name: "Crop Minimal", badge: "MINIMAL", desc: "Warm Sand & Corner Brackets", bg: "linear-gradient(135deg, #1c1917 0%, #292524 100%)", accent: "#e7e5e4" },
  { id: "circuit_tech", name: "Circuit Tech", badge: "CYBER", desc: "Electric Cyan & Blue Mesh", bg: "linear-gradient(135deg, #09090b 0%, #581c87 100%)", accent: "#22d3ee" },
  { id: "cyber_neon", name: "Cyberpunk Neon", badge: "NEON", desc: "Glowing Cyan & Electric Magenta", bg: "linear-gradient(135deg, #050505 0%, #2e0854 100%)", accent: "#00ffcc" },
  { id: "celestial_night", name: "Celestial Night", badge: "SPACE", desc: "Deep Space Indigo & Radar Rings", bg: "linear-gradient(135deg, #090d18 0%, #1e1b4b 100%)", accent: "#818cf8" },
  { id: "modern_glassmorphism", name: "Dark Glassmorphism", badge: "GLASS", desc: "Glowing Purple Neon on Zinc", bg: "linear-gradient(135deg, #18181b 0%, #27272a 100%)", accent: "#c084fc" },
  { id: "artistic_neon", name: "Artistic Neon", badge: "ART", desc: "Asymmetric Orange & Dark Canvas", bg: "linear-gradient(135deg, #09090b 0%, #2e1065 100%)", accent: "#ff5e00" },
  { id: "atlas_bold", name: "Atlas Crimson", badge: "ATLAS", desc: "Crimson Red Callout Banner", bg: "linear-gradient(135deg, #450a0a 0%, #1c1917 100%)", accent: "#ef4444" },
  { id: "organic_pastel", name: "Organic Earthy", badge: "NATURE", desc: "Soft Taupe & Fluid Blobs", bg: "linear-gradient(135deg, #14532d 0%, #1c1917 100%)", accent: "#86efac" },
  { id: "emerald_nature", name: "Emerald Forest", badge: "EMERALD", desc: "Deep Forest Pine & Mint", bg: "linear-gradient(135deg, #064e3b 0%, #022c22 100%)", accent: "#10b981" },
  { id: "dividend_burgundy", name: "Dividend Burgundy", badge: "DIVIDEND", desc: "Burgundy Footer & Clean Slate", bg: "linear-gradient(135deg, #4a044e 0%, #1e1b4b 100%)", accent: "#f43f5e" },
  { id: "savon_classic", name: "Savon Classic", badge: "SAVON", desc: "Mint Pattern & Framed Card", bg: "linear-gradient(135deg, #3f3f46 0%, #18181b 100%)", accent: "#a1a1aa" },
  { id: "wood_type", name: "Wood Type Vintage", badge: "WOOD", desc: "Timber Brown & Parchment Stamp", bg: "linear-gradient(135deg, #451a03 0%, #1c1917 100%)", accent: "#f59e0b" },
  { id: "none", name: "None / Pure BG", badge: "NONE", desc: "No Template Framing - Pure Theme", bg: "linear-gradient(135deg, #18181b 0%, #09090b 100%)", accent: "#94a3b8" },
];

export function renderTemplateMiniWireframe(tmpl) {
  const acc = tmpl.accent || "#38bdf8";
  const id = tmpl.id;

  if (id === "sidebar_executive" || id === "celestial_night") {
    return (
      <div style={{ display: "flex", width: "100%", height: 20, gap: 3, alignItems: "center" }}>
        <div style={{ width: 5, height: "100%", background: acc, borderRadius: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "space-around" }}>
          <div style={{ width: 2, height: 2, borderRadius: "50%", background: "#fff" }} />
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 2, flex: 1 }}>
          <div style={{ width: "80%", height: 3, background: acc, borderRadius: 1 }} />
          <div style={{ width: "95%", height: 2, background: "rgba(255,255,255,0.4)", borderRadius: 1 }} />
          <div style={{ width: "60%", height: 2, background: "rgba(255,255,255,0.25)", borderRadius: 1 }} />
        </div>
      </div>
    );
  }

  if (id === "berlin_executive" || id === "ion_boardroom" || id === "emerald_nature") {
    return (
      <div style={{ display: "flex", flexDirection: "column", width: "100%", height: 20, gap: 2 }}>
        <div style={{ width: "100%", height: 5, background: acc, borderRadius: 1, display: "flex", alignItems: "center", paddingLeft: 2 }}>
          <div style={{ width: 3, height: 2, background: "#000", borderRadius: 0.5 }} />
        </div>
        <div style={{ display: "flex", gap: 3, width: "100%", flex: 1, paddingTop: 1 }}>
          <div style={{ width: "48%", height: 10, background: "rgba(255,255,255,0.15)", borderRadius: 1 }} />
          <div style={{ width: "48%", height: 10, background: "rgba(255,255,255,0.15)", borderRadius: 1 }} />
        </div>
      </div>
    );
  }

  if (id === "crop_frame" || id === "executive_gold" || id === "urban_monochrome" || id === "organic_pastel") {
    return (
      <div style={{ position: "relative", width: "100%", height: 20, display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center", gap: 2 }}>
        <div style={{ position: "absolute", top: 0, left: 0, width: 4, height: 4, borderTop: `1.5px solid ${acc}`, borderLeft: `1.5px solid ${acc}` }} />
        <div style={{ position: "absolute", top: 0, right: 0, width: 4, height: 4, borderTop: `1.5px solid ${acc}`, borderRight: `1.5px solid ${acc}` }} />
        <div style={{ position: "absolute", bottom: 0, left: 0, width: 4, height: 4, borderBottom: `1.5px solid ${acc}`, borderLeft: `1.5px solid ${acc}` }} />
        <div style={{ position: "absolute", bottom: 0, right: 0, width: 4, height: 4, borderBottom: `1.5px solid ${acc}`, borderRight: `1.5px solid ${acc}` }} />
        <div style={{ width: "65%", height: 3, background: acc, borderRadius: 1 }} />
        <div style={{ width: "45%", height: 2, background: "rgba(255,255,255,0.35)", borderRadius: 1 }} />
      </div>
    );
  }

  if (id === "geometric_block" || id === "artistic_neon") {
    return (
      <div style={{ display: "flex", width: "100%", height: 20, gap: 3 }}>
        <div style={{ width: "32%", height: "100%", background: acc, opacity: 0.85, borderRadius: 1 }} />
        <div style={{ display: "flex", flexDirection: "column", gap: 2, flex: 1, justifyContent: "center" }}>
          <div style={{ width: "85%", height: 3, background: "rgba(255,255,255,0.7)", borderRadius: 1 }} />
          <div style={{ width: "60%", height: 2, background: "rgba(255,255,255,0.35)", borderRadius: 1 }} />
        </div>
      </div>
    );
  }

  if (id === "quotable_teal") {
    return (
      <div style={{ display: "flex", width: "100%", height: 20, gap: 2, alignItems: "center" }}>
        <div style={{ width: 2, height: "100%", background: acc }} />
        <span style={{ fontSize: 9, lineHeight: 1, color: acc, fontWeight: 900, fontFamily: "serif" }}>❝</span>
        <div style={{ display: "flex", flexDirection: "column", gap: 2, flex: 1 }}>
          <div style={{ width: "75%", height: 3, background: acc, borderRadius: 1 }} />
          <div style={{ width: "90%", height: 2, background: "rgba(255,255,255,0.4)", borderRadius: 1 }} />
        </div>
      </div>
    );
  }

  if (id === "circuit_tech" || id === "cyber_neon") {
    return (
      <div style={{ position: "relative", width: "100%", height: 20, display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
        <div style={{ width: "100%", height: 1.5, background: `linear-gradient(90deg, ${acc}, #f43f5e)` }} />
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "0 1px" }}>
          <span style={{ fontSize: 6, color: acc, fontFamily: "monospace" }}>[HUD]</span>
          <div style={{ width: "50%", height: 2, background: acc, borderRadius: 1 }} />
        </div>
        <div style={{ width: "70%", height: 1.5, background: "rgba(255,255,255,0.3)" }} />
      </div>
    );
  }

  if (id === "atlas_bold") {
    return (
      <div style={{ display: "flex", flexDirection: "column", width: "100%", height: 20, gap: 2 }}>
        <div style={{ width: "100%", height: 6, background: acc, borderRadius: 1, display: "flex", justifyContent: "flex-end", paddingRight: 2, alignItems: "center" }}>
          <div style={{ width: 6, height: 3, background: "#000", borderRadius: 1 }} />
        </div>
        <div style={{ width: "75%", height: 2.5, background: "rgba(255,255,255,0.6)", borderRadius: 1 }} />
        <div style={{ width: "50%", height: 2, background: "rgba(255,255,255,0.3)", borderRadius: 1 }} />
      </div>
    );
  }

  if (id === "savon_classic" || id === "wood_type") {
    return (
      <div style={{ position: "relative", width: "100%", height: 20, border: `1px solid ${acc}99`, borderRadius: 2, padding: "2px 4px", display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center", gap: 1.5 }}>
        <div style={{ width: "60%", height: 2.5, background: acc, borderRadius: 1 }} />
        <div style={{ width: "40%", height: 2, background: "rgba(255,255,255,0.4)", borderRadius: 1 }} />
      </div>
    );
  }

  if (id === "dividend_burgundy") {
    return (
      <div style={{ display: "flex", flexDirection: "column", width: "100%", height: 20, justifyContent: "space-between" }}>
        <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
          <div style={{ width: "65%", height: 3, background: "rgba(255,255,255,0.7)", borderRadius: 1 }} />
          <div style={{ width: "45%", height: 2, background: "rgba(255,255,255,0.35)", borderRadius: 1 }} />
        </div>
        <div style={{ width: "100%", height: 5, background: acc, borderRadius: 1 }} />
      </div>
    );
  }

  if (id === "modern_glassmorphism") {
    return (
      <div style={{ width: "100%", height: 20, border: "1px solid rgba(255,255,255,0.3)", borderRadius: 3, background: "rgba(255,255,255,0.06)", padding: "2px 4px", display: "flex", flexDirection: "column", justifyContent: "center", gap: 2, boxShadow: `0 0 6px ${acc}44` }}>
        <div style={{ width: "70%", height: 2.5, background: acc, borderRadius: 1 }} />
        <div style={{ width: "50%", height: 2, background: "rgba(255,255,255,0.4)", borderRadius: 1 }} />
      </div>
    );
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 2, width: "100%", height: 20, justifyContent: "center" }}>
      <div style={{ width: "65%", height: 3, background: acc, borderRadius: 1 }} />
      <div style={{ width: "90%", height: 2, background: "rgba(255,255,255,0.4)", borderRadius: 1 }} />
      <div style={{ width: "50%", height: 2, background: "rgba(255,255,255,0.25)", borderRadius: 1 }} />
    </div>
  );
}

export default function SlideEditorRibbonToolbar({
  activeSlide,
  activeSlideIndex,
  selectedBgPreset,
  setSelectedBgPreset,
  templateName,
  setTemplateName,
  customBgColor1,
  setCustomBgColor1,
  customBgColor2,
  setCustomBgColor2,
  customTextColor,
  setCustomTextColor,
  handleSlidePropertyChange,
  handleApplySlideLayout,
  handleAddSlideWithLayout,
  handleAddPlugin,
  handleDuplicateSlide,
  handleDeleteSlide,
  handleToggleSlideVoiceover,
  isSpeaking,
  speakingSlideIdx,
  savePresentation,
  isSaving,
  isSaved,
  setShowDownloadModal,
  downloadUrl,
  selectedPluginIndex,
  handleUpdatePluginData,
  handleLayerOrder,
}) {
  const [activeTab, setActiveTab] = useState("home"); // PowerPoint 365 default is "home"
  const [serverTemplates, setServerTemplates] = useState([]);
  const [serverShapeCatalog, setServerShapeCatalog] = useState(null);
  const [autoSaveEnabled, setAutoSaveEnabled] = useState(true);
  const [showThemesDropdown, setShowThemesDropdown] = useState(false);
  const [showTemplatesDropdown, setShowTemplatesDropdown] = useState(false);
  const themesScrollRef = useRef(null);
  const templatesScrollRef = useRef(null);

  const scrollThemes = (direction) => {
    if (themesScrollRef.current) {
      const scrollAmount = direction === "left" ? -504 : 504;
      themesScrollRef.current.scrollBy({ left: scrollAmount, behavior: "smooth" });
    }
  };

  const scrollTemplates = (direction) => {
    if (templatesScrollRef.current) {
      const scrollAmount = direction === "left" ? -504 : 504;
      templatesScrollRef.current.scrollBy({ left: scrollAmount, behavior: "smooth" });
    }
  };

  useEffect(() => {
    fetch(`${API_BASE_URL}/api/presentation/templates`)
      .then((r) => (r.ok ? r.json() : null))
      .then((data) => {
        const tList = Array.isArray(data) ? data : data?.templates;
        if (Array.isArray(tList) && tList.length > 0) {
          setServerTemplates(tList);
        }
      })
      .catch((err) => console.warn("Could not fetch server presentation templates", err));

    fetch(`${API_BASE_URL}/api/presentation/shapes/catalog`)
      .then((r) => (r.ok ? r.json() : null))
      .then((data) => {
        if (data && data.categories) {
          setServerShapeCatalog(data);
        }
      })
      .catch((err) => console.warn("Could not fetch server shape catalog", err));
  }, []);

  const isElementSelected = selectedPluginIndex !== null && selectedPluginIndex !== undefined;

  const tabs = [
    { id: "file", label: "File" },
    { id: "home", label: "Home" },
    { id: "insert", label: "Insert" },
    { id: "design", label: "Design" },
    { id: "templates", label: "Templates" },
    { id: "view", label: "View" },
    ...(isElementSelected ? [{ id: "shape_format", label: "Shape Format", isContextual: true }] : []),
  ];

  const allTemplates = useMemo(() => {
    const existingIds = new Set(DEFAULT_TEMPLATE_PREVIEWS.map((t) => t.id));
    const merged = [...DEFAULT_TEMPLATE_PREVIEWS];
    for (const st of serverTemplates) {
      const id = typeof st === "string" ? st : st?.id;
      if (id && !existingIds.has(id)) {
        merged.push({
          id,
          name: (typeof st === "object" && (st.name || st.label)) || id.replace(/_/g, " "),
          bg: "#ffffff",
          textColor: "#0f172a",
          accent: "#38bdf8",
          swatches: ["#38bdf8", "#818cf8", "#c084fc", "#00ffcc", "#ec4899", "#334155"],
          category: "Server",
        });
        existingIds.add(id);
      }
    }
    return merged;
  }, [serverTemplates]);

  const handleInsertShape = (shapeType) => {
    let extraDefaults = {};
    if (serverShapeCatalog) {
      if (serverShapeCatalog.default_style) {
        extraDefaults = { ...serverShapeCatalog.default_style };
      }
      for (const cat of serverShapeCatalog.categories || []) {
        const found = (cat.shapes || []).find((s) => s.id === shapeType);
        if (found) {
          extraDefaults.width = found.default_width;
          extraDefaults.height = found.default_height;
          break;
        }
      }
    }
    handleAddPlugin(activeSlideIndex, "shape", { shape_type: shapeType, ...extraDefaults });
  };

  return (
    <div
      style={{
        width: "100%",
        background: "#181818",
        border: "1px solid rgba(255, 255, 255, 0.12)",
        borderRadius: "8px",
        boxShadow: "0 6px 20px rgba(0, 0, 0, 0.5)",
        overflow: "hidden",
        marginBottom: "0px",
      }}
    >
      <style>{`
        .hide-theme-scrollbar {
          scrollbar-width: none !important;
          -ms-overflow-style: none !important;
        }
        .hide-theme-scrollbar::-webkit-scrollbar {
          display: none !important;
          width: 0 !important;
          height: 0 !important;
        }
        .ribbon-scroll-container::-webkit-scrollbar {
          height: 4px;
        }
        .ribbon-scroll-container::-webkit-scrollbar-track {
          background: #1e1e1e;
        }
        .ribbon-scroll-container::-webkit-scrollbar-thumb {
          background: #444;
          border-radius: 2px;
        }
        .ribbon-scroll-container::-webkit-scrollbar-thumb:hover {
          background: #ea580c;
        }
      `}</style>
      {/* ========================================================================= */}
      {/* POWERPOINT 365 TOP HEADER BAR (AUTOSAVE, TITLE, SEARCH, SHARE)             */}
      {/* ========================================================================= */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          background: "#1f1f1f",
          borderBottom: "1px solid rgba(255, 255, 255, 0.08)",
          padding: "4px 12px",
          gap: 10,
          flexWrap: "wrap",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          {/* PowerPoint App Icon */}
          <div
            style={{
              width: 22,
              height: 22,
              background: "linear-gradient(135deg, #ea580c, #c2410c)",
              borderRadius: 4,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "#fff",
              fontWeight: 900,
              fontSize: 13,
              boxShadow: "0 2px 5px rgba(234, 88, 12, 0.4)",
            }}
          >
            P
          </div>

          {/* AutoSave Toggle */}
          <div
            onClick={() => setAutoSaveEnabled((prev) => !prev)}
            style={{
              display: "flex",
              alignItems: "center",
              gap: 5,
              cursor: "pointer",
              fontSize: 11,
              fontWeight: 600,
              color: "#d4d4d4",
              userSelect: "none",
            }}
          >
            <span>AutoSave</span>
            <div
              style={{
                width: 28,
                height: 15,
                background: autoSaveEnabled ? "#ea580c" : "#404040",
                borderRadius: 10,
                position: "relative",
                transition: "background 0.2s ease",
              }}
            >
              <div
                style={{
                  position: "absolute",
                  top: 2,
                  left: autoSaveEnabled ? 15 : 2,
                  width: 11,
                  height: 11,
                  borderRadius: "50%",
                  background: "#fff",
                  transition: "left 0.2s ease",
                }}
              />
            </div>
          </div>

          {/* Quick Action Icons: Save, Undo, Redo */}
          <div style={{ display: "flex", alignItems: "center", gap: 4, marginLeft: 4 }}>
            <button
              type="button"
              onClick={savePresentation}
              style={{ background: "none", border: "none", color: isSaved ? "#10b981" : "#d4d4d4", cursor: "pointer", fontSize: 13, padding: "2px 4px" }}
              title={isSaved ? "Saved to cloud" : "Save Presentation (Ctrl+S)"}
            >
              💾
            </button>
            <button
              type="button"
              onClick={() => alert("Undo (Ctrl+Z)")}
              style={{ background: "none", border: "none", color: "#a3a3a3", cursor: "pointer", fontSize: 13, padding: "2px 4px" }}
              title="Undo (Ctrl+Z)"
            >
              ↩
            </button>
            <button
              type="button"
              onClick={() => alert("Redo (Ctrl+Y)")}
              style={{ background: "none", border: "none", color: "#a3a3a3", cursor: "pointer", fontSize: 13, padding: "2px 4px" }}
              title="Redo (Ctrl+Y)"
            >
              ↪
            </button>
          </div>
        </div>

        {/* Center Search The Menus Bar */}
        <div style={{ display: "flex", alignItems: "center", gap: 8, flex: 1, maxWidth: 360, justifyContent: "center" }}>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 6,
              background: "rgba(0,0,0,0.35)",
              border: "1px solid rgba(255, 255, 255, 0.12)",
              borderRadius: 6,
              padding: "3px 10px",
              width: "100%",
              maxWidth: 280,
            }}
          >
            <span style={{ fontSize: 11, opacity: 0.6 }}>🔍</span>
            <input
              type="text"
              placeholder="Search the menus (Alt+Q)"
              style={{ background: "none", border: "none", color: "#fff", fontSize: 11, outline: "none", width: "100%" }}
            />
          </div>
        </div>

        {/* Right Actions: Feedback & Solid Orange Share Button */}
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <button
            type="button"
            style={{ background: "none", border: "none", color: "#d4d4d4", cursor: "pointer", fontSize: 14, padding: "2px 6px" }}
            title="Send Feedback"
          >
            💬
          </button>

          <button
            type="button"
            onClick={() => setShowDownloadModal && setShowDownloadModal(true)}
            style={{
              background: "linear-gradient(135deg, #ea580c 0%, #c2410c 100%)",
              border: "none",
              borderRadius: 4,
              color: "#ffffff",
              padding: "4px 14px",
              fontSize: 12,
              fontWeight: 700,
              cursor: "pointer",
              display: "inline-flex",
              alignItems: "center",
              gap: 6,
              boxShadow: "0 2px 8px rgba(234, 88, 12, 0.4)",
            }}
            title="Share or Export Presentation"
          >
            <span>↗</span>
            <span>Share ⌄</span>
          </button>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* POWERPOINT 365 RIBBON TABS BAR                                             */}
      {/* ========================================================================= */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          background: "#202020",
          borderBottom: "1px solid rgba(255, 255, 255, 0.08)",
          padding: "0 10px",
          gap: 2,
          overflowX: "auto",
        }}
      >
        {tabs.map((tab) => {
          const isActive = activeTab === tab.id;
          const isContextual = tab.isContextual;
          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveTab(tab.id)}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 4,
                padding: "6px 12px",
                fontSize: 12,
                fontWeight: isActive ? 700 : 500,
                color: isContextual
                  ? "#ea580c"
                  : isActive
                  ? "#ffffff"
                  : "#a3a3a3",
                background: isActive ? "#2b2b2b" : "transparent",
                border: "none",
                borderBottom: isActive
                  ? `2px solid ${isContextual ? "#ea580c" : "#ea580c"}`
                  : "2px solid transparent",
                borderRadius: "4px 4px 0 0",
                cursor: "pointer",
                transition: "all 0.15s ease",
                whiteSpace: "nowrap",
              }}
            >
              <span>{tab.label}</span>
              {isContextual && <span style={{ fontSize: 9, background: "rgba(234, 88, 12, 0.2)", padding: "1px 4px", borderRadius: 3 }}>Tool</span>}
            </button>
          );
        })}
      </div>

      {/* ========================================================================= */}
      {/* POWERPOINT 365 GROUPED RIBBON CONTENT (HEIGHT: 94PX)                       */}
      {/* ========================================================================= */}
      <div
        className="ribbon-scroll-container"
        style={{
          minHeight: "92px",
          padding: "4px 10px",
          display: "flex",
          alignItems: "stretch",
          gap: "6px",
          overflowX: "auto",
          background: "#2b2b2b",
          borderBottom: "1px solid rgba(0,0,0,0.5)",
        }}
      >
        {/* ----------------------------------------------------------------------- */}
        {/* 0. FILE TAB (SAVE, EXPORT, DECK OPERATIONS)                             */}
        {/* ----------------------------------------------------------------------- */}
        {activeTab === "file" && (
          <div style={{ display: "flex", alignItems: "stretch", gap: 6 }}>
            <RibbonGroup title="Save & Export">
              <button
                type="button"
                onClick={savePresentation}
                disabled={isSaving}
                style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                  background: isSaved ? "rgba(34, 197, 94, 0.2)" : "rgba(139, 92, 246, 0.2)",
                  border: isSaved ? "1px solid #22c55e" : "1px solid #8b5cf6",
                  borderRadius: 4,
                  padding: "4px 10px",
                  color: "#fff",
                  cursor: isSaving ? "wait" : "pointer",
                  minWidth: 50,
                  height: "100%",
                }}
                title="Save Presentation (Ctrl+S)"
              >
                <span style={{ fontSize: 18 }}>{isSaving ? "⏳" : isSaved ? "✅" : "💾"}</span>
                <span style={{ fontSize: 9.5, marginTop: 2, fontWeight: 700 }}>{isSaving ? "Saving..." : isSaved ? "Saved" : "Save"}</span>
              </button>
              <button
                type="button"
                onClick={() => setShowDownloadModal && setShowDownloadModal(true)}
                style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                  background: "rgba(234, 88, 12, 0.2)",
                  border: "1px solid #ea580c",
                  borderRadius: 4,
                  padding: "4px 10px",
                  color: "#ea580c",
                  cursor: "pointer",
                  minWidth: 54,
                  height: "100%",
                }}
                title="Export / Download PPTX"
              >
                <span style={{ fontSize: 18 }}>📥</span>
                <span style={{ fontSize: 9.5, marginTop: 2, fontWeight: 700, color: "#fff" }}>Export PPTX</span>
              </button>
            </RibbonGroup>

            <RibbonGroup title="Deck Actions">
              <button
                type="button"
                onClick={() => handleDuplicateSlide?.(activeSlideIndex)}
                style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", background: "transparent", border: "none", color: "#fff", padding: "4px 8px", cursor: "pointer", minWidth: 46 }}
                title="Duplicate Current Slide"
              >
                <span style={{ fontSize: 16 }}>📄</span>
                <span style={{ fontSize: 9, marginTop: 2 }}>Duplicate</span>
              </button>
              <button
                type="button"
                onClick={() => handleDeleteSlide?.(activeSlideIndex)}
                style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", background: "transparent", border: "none", color: "#ef4444", padding: "4px 8px", cursor: "pointer", minWidth: 46 }}
                title="Delete Current Slide"
              >
                <span style={{ fontSize: 16 }}>🗑️</span>
                <span style={{ fontSize: 9, marginTop: 2 }}>Delete</span>
              </button>
            </RibbonGroup>
          </div>
        )}

        {/* ----------------------------------------------------------------------- */}
        {/* 1. HOME TAB (EXACT POWERPOINT 365 MATCHING IMAGE 1)                     */}
        {/* ----------------------------------------------------------------------- */}
        {activeTab === "home" && (
          <div style={{ display: "flex", alignItems: "stretch", gap: 4 }}>
            {/* Clipboard Group */}
            <RibbonGroup title="Clipboard">
              <button
                type="button"
                onClick={() => alert("Paste (Ctrl+V)")}
                style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                  background: "transparent",
                  border: "none",
                  borderRadius: 4,
                  padding: "4px 8px",
                  color: "#fff",
                  cursor: "pointer",
                  minWidth: 44,
                  height: "100%",
                }}
                title="Paste (Ctrl+V)"
              >
                <span style={{ fontSize: 20 }}>📋</span>
                <span style={{ fontSize: 10, marginTop: 2 }}>Paste ⌄</span>
              </button>
              <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
                <button
                  type="button"
                  onClick={() => alert("Cut (Ctrl+X)")}
                  style={{ background: "transparent", border: "none", color: "#d4d4d4", fontSize: 10, cursor: "pointer", display: "flex", alignItems: "center", gap: 4, padding: "2px 4px" }}
                  title="Cut (Ctrl+X)"
                >
                  <span style={{ color: "#38bdf8" }}>✂</span> <span>Cut</span>
                </button>
                <button
                  type="button"
                  onClick={() => alert("Copy (Ctrl+C)")}
                  style={{ background: "transparent", border: "none", color: "#d4d4d4", fontSize: 10, cursor: "pointer", display: "flex", alignItems: "center", gap: 4, padding: "2px 4px" }}
                  title="Copy (Ctrl+C)"
                >
                  <span>📄</span> <span>Copy</span>
                </button>
              </div>
            </RibbonGroup>

            {/* Slides Group */}
            <RibbonGroup title="Slides">
              <button
                type="button"
                onClick={() => handleAddSlideWithLayout("title_content")}
                style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                  background: "transparent",
                  border: "none",
                  borderRadius: 4,
                  padding: "4px 8px",
                  color: "#ea580c",
                  cursor: "pointer",
                  minWidth: 54,
                  height: "100%",
                }}
                title="Add New Slide"
              >
                <span style={{ fontSize: 18, color: "#22c55e", fontWeight: 900 }}>⊞</span>
                <span style={{ fontSize: 10, fontWeight: 700, marginTop: 2, color: "#fff" }}>New Slide ⌄</span>
              </button>
              <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
                <button
                  type="button"
                  onClick={() => setActiveTab("layout")}
                  style={{ background: "transparent", border: "none", color: "#d4d4d4", fontSize: 10, cursor: "pointer", display: "flex", alignItems: "center", gap: 4, padding: "2px 4px" }}
                  title="Choose slide layout"
                >
                  <span>🗂</span> <span>Layout ⌄</span>
                </button>
                <button
                  type="button"
                  onClick={() => handleDeleteSlide?.(activeSlideIndex)}
                  style={{ background: "transparent", border: "none", color: "#d4d4d4", fontSize: 10, cursor: "pointer", display: "flex", alignItems: "center", gap: 4, padding: "2px 4px" }}
                  title="Reset or Section"
                >
                  <span>🔄</span> <span>Reset</span>
                </button>
              </div>
            </RibbonGroup>

            {/* Font Group */}
            <RibbonGroup title="Font">
              <div style={{ display: "flex", flexDirection: "column", gap: 4, justifyContent: "center" }}>
                {/* Row 1: Font Family, Size, Increase, Decrease, Clear Format */}
                <div style={{ display: "flex", alignItems: "center", gap: 3 }}>
                  <select
                    value={activeSlide?.font_family || "Calibri"}
                    onChange={(e) => handleSlidePropertyChange?.(activeSlideIndex, "font_family", e.target.value)}
                    style={{
                      background: "#1e1e1e",
                      border: "1px solid rgba(255,255,255,0.2)",
                      borderRadius: 3,
                      color: "#fff",
                      fontSize: 11,
                      padding: "2px 4px",
                      width: 105,
                      outline: "none",
                      cursor: "pointer",
                    }}
                  >
                    {["Calibri (Body)", "Arial", "Segoe UI", "Montserrat", "Roboto", "Georgia", "Playfair Display", "Fira Code"].map((f) => (
                      <option key={f} value={f.replace(" (Body)", "")}>
                        {f}
                      </option>
                    ))}
                  </select>

                  <select
                    value={activeSlide?.title_font_size || (activeSlideIndex === 0 ? 44 : 28)}
                    onChange={(e) => handleSlidePropertyChange?.(activeSlideIndex, "title_font_size", Number(e.target.value))}
                    style={{
                      background: "#1e1e1e",
                      border: "1px solid rgba(255,255,255,0.2)",
                      borderRadius: 3,
                      color: "#fff",
                      fontSize: 11,
                      padding: "2px 2px",
                      width: 44,
                      outline: "none",
                      cursor: "pointer",
                    }}
                  >
                    {[12, 14, 16, 18, 20, 24, 28, 32, 36, 40, 44, 48, 54, 60, 72].map((sz) => (
                      <option key={sz} value={sz}>
                        {sz}
                      </option>
                    ))}
                  </select>

                  <button
                    type="button"
                    onClick={() => {
                      const cur = Number(activeSlide?.title_font_size || 28);
                      handleSlidePropertyChange?.(activeSlideIndex, "title_font_size", Math.min(72, cur + 2));
                    }}
                    style={{ background: "#333", border: "1px solid #555", color: "#fff", borderRadius: 3, width: 22, height: 20, fontSize: 10, fontWeight: 800, cursor: "pointer" }}
                    title="Increase Font Size (A^)"
                  >
                    A^
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      const cur = Number(activeSlide?.title_font_size || 28);
                      handleSlidePropertyChange?.(activeSlideIndex, "title_font_size", Math.max(12, cur - 2));
                    }}
                    style={{ background: "#333", border: "1px solid #555", color: "#fff", borderRadius: 3, width: 22, height: 20, fontSize: 10, fontWeight: 800, cursor: "pointer" }}
                    title="Decrease Font Size (Av)"
                  >
                    Av
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      handleSlidePropertyChange?.(activeSlideIndex, "title_bold", true);
                      handleSlidePropertyChange?.(activeSlideIndex, "title_italic", false);
                      handleSlidePropertyChange?.(activeSlideIndex, "title_underline", false);
                    }}
                    style={{ background: "#333", border: "1px solid #555", color: "#d4d4d4", borderRadius: 3, width: 22, height: 20, fontSize: 10, cursor: "pointer" }}
                    title="Clear All Formatting (A⌫)"
                  >
                    A⌫
                  </button>
                </div>

                {/* Row 2: B, I, U, S, ab, AV, Aa, Highlighter, Color */}
                <div style={{ display: "flex", alignItems: "center", gap: 3 }}>
                  <button
                    type="button"
                    onClick={() => handleSlidePropertyChange?.(activeSlideIndex, "title_bold", activeSlide?.title_bold === false)}
                    style={{
                      width: 20,
                      height: 20,
                      background: activeSlide?.title_bold !== false ? "#ea580c" : "#333",
                      border: "1px solid #555",
                      color: "#fff",
                      fontWeight: 900,
                      borderRadius: 3,
                      cursor: "pointer",
                      fontSize: 11,
                    }}
                    title="Bold (Ctrl+B)"
                  >
                    B
                  </button>
                  <button
                    type="button"
                    onClick={() => handleSlidePropertyChange?.(activeSlideIndex, "title_italic", !activeSlide?.title_italic)}
                    style={{
                      width: 20,
                      height: 20,
                      background: activeSlide?.title_italic ? "#ea580c" : "#333",
                      border: "1px solid #555",
                      color: "#fff",
                      fontStyle: "italic",
                      borderRadius: 3,
                      cursor: "pointer",
                      fontSize: 11,
                    }}
                    title="Italic (Ctrl+I)"
                  >
                    I
                  </button>
                  <button
                    type="button"
                    onClick={() => handleSlidePropertyChange?.(activeSlideIndex, "title_underline", !activeSlide?.title_underline)}
                    style={{
                      width: 20,
                      height: 20,
                      background: activeSlide?.title_underline ? "#ea580c" : "#333",
                      border: "1px solid #555",
                      color: "#fff",
                      textDecoration: "underline",
                      borderRadius: 3,
                      cursor: "pointer",
                      fontSize: 11,
                    }}
                    title="Underline (Ctrl+U)"
                  >
                    U
                  </button>
                  <button
                    type="button"
                    onClick={() => handleSlidePropertyChange?.(activeSlideIndex, "title_shadow", !activeSlide?.title_shadow)}
                    style={{
                      width: 20,
                      height: 20,
                      background: activeSlide?.title_shadow ? "#ea580c" : "#333",
                      border: "1px solid #555",
                      color: "#fff",
                      borderRadius: 3,
                      cursor: "pointer",
                      fontSize: 11,
                    }}
                    title="Text Shadow (S)"
                  >
                    S
                  </button>
                  <button
                    type="button"
                    style={{ width: 20, height: 20, background: "#333", border: "1px solid #555", color: "#bbb", borderRadius: 3, cursor: "pointer", fontSize: 10, textDecoration: "line-through" }}
                    title="Strikethrough (ab)"
                  >
                    ab
                  </button>
                  <button
                    type="button"
                    style={{ width: 22, height: 20, background: "#333", border: "1px solid #555", color: "#bbb", borderRadius: 3, cursor: "pointer", fontSize: 9 }}
                    title="Character Spacing (AV ↔)"
                  >
                    AV↔
                  </button>
                  <button
                    type="button"
                    style={{ width: 22, height: 20, background: "#333", border: "1px solid #555", color: "#bbb", borderRadius: 3, cursor: "pointer", fontSize: 9 }}
                    title="Change Case (Aa ⌄)"
                  >
                    Aa⌄
                  </button>

                  {/* Highlighter Pen (Yellow bar) */}
                  <div
                    style={{
                      display: "inline-flex",
                      flexDirection: "column",
                      alignItems: "center",
                      justifyContent: "center",
                      width: 22,
                      height: 20,
                      background: "#333",
                      border: "1px solid #555",
                      borderRadius: 3,
                      cursor: "pointer",
                    }}
                    title="Text Highlight Color"
                  >
                    <span style={{ fontSize: 9 }}>🖍️</span>
                    <div style={{ width: 14, height: 2.5, background: "#eab308", marginTop: 1, borderRadius: 1 }} />
                  </div>

                  {/* Font Color Picker (Red underline bar) */}
                  <label
                    title="Font Color (A)"
                    style={{
                      position: "relative",
                      display: "inline-flex",
                      flexDirection: "column",
                      alignItems: "center",
                      justifyContent: "center",
                      width: 22,
                      height: 20,
                      background: "#333",
                      border: "1px solid #555",
                      borderRadius: 3,
                      cursor: "pointer",
                      padding: 0,
                    }}
                  >
                    <span style={{ fontSize: 10, fontWeight: 900, lineHeight: 1, color: "#fff" }}>A</span>
                    <div style={{ width: 14, height: 2.5, background: activeSlide?.title_color || "#ef4444", marginTop: 1, borderRadius: 1 }} />
                    <input
                      type="color"
                      value={activeSlide?.title_color || "#ffffff"}
                      onChange={(e) => {
                        handleSlidePropertyChange?.(activeSlideIndex, "title_color", e.target.value);
                        setCustomTextColor?.(e.target.value);
                      }}
                      style={{ position: "absolute", opacity: 0, width: 22, height: 20, cursor: "pointer" }}
                    />
                  </label>
                </div>
              </div>
            </RibbonGroup>

            {/* Paragraph Group */}
            <RibbonGroup title="Paragraph">
              <div style={{ display: "flex", flexDirection: "column", gap: 4, justifyContent: "center" }}>
                {/* Row 1: Bullets, Numbers, Indents, Line Spacing, Direction */}
                <div style={{ display: "flex", alignItems: "center", gap: 3 }}>
                  <button
                    type="button"
                    onClick={() => handleAddPlugin(activeSlideIndex, "bullets", { points: ["Key bullet point 1", "Key bullet point 2"] })}
                    style={{ background: "#333", border: "1px solid #555", color: "#fff", borderRadius: 3, padding: "2px 5px", fontSize: 10, cursor: "pointer" }}
                    title="Bullets (•≡ ⌄)"
                  >
                    •≡ ⌄
                  </button>
                  <button
                    type="button"
                    onClick={() => handleAddPlugin(activeSlideIndex, "bullets", { bullet_style: "decimal", points: ["1. First step", "2. Second step"] })}
                    style={{ background: "#333", border: "1px solid #555", color: "#fff", borderRadius: 3, padding: "2px 5px", fontSize: 10, cursor: "pointer" }}
                    title="Numbering (1≡ ⌄)"
                  >
                    1≡ ⌄
                  </button>
                  <button
                    type="button"
                    style={{ background: "#333", border: "1px solid #555", color: "#bbb", borderRadius: 3, width: 20, height: 20, fontSize: 10, cursor: "pointer" }}
                    title="Decrease Indent (⇤)"
                  >
                    ⇤
                  </button>
                  <button
                    type="button"
                    style={{ background: "#333", border: "1px solid #555", color: "#bbb", borderRadius: 3, width: 20, height: 20, fontSize: 10, cursor: "pointer" }}
                    title="Increase Indent (⇥)"
                  >
                    ⇥
                  </button>
                  <button
                    type="button"
                    style={{ background: "#333", border: "1px solid #555", color: "#bbb", borderRadius: 3, width: 22, height: 20, fontSize: 10, cursor: "pointer" }}
                    title="Line Spacing (↕ ⌄)"
                  >
                    ↕ ⌄
                  </button>
                  <button
                    type="button"
                    style={{ background: "#333", border: "1px solid #555", color: "#bbb", borderRadius: 3, width: 22, height: 20, fontSize: 10, cursor: "pointer" }}
                    title="Text Direction (A↓ ⌄)"
                  >
                    A↓ ⌄
                  </button>
                </div>

                {/* Row 2: Align Left, Center, Right, Justify, Columns, Align Text */}
                <div style={{ display: "flex", alignItems: "center", gap: 2 }}>
                  {[
                    { label: "⯇", val: "left", title: "Align Left" },
                    { label: "≡", val: "center", title: "Center" },
                    { label: "⯈", val: "right", title: "Align Right" },
                    { label: "⯃", val: "justify", title: "Justify" },
                  ].map((it) => {
                    const isCur = (activeSlide?.title_align || "left") === it.val;
                    return (
                      <button
                        key={it.val}
                        type="button"
                        onClick={() => {
                          handleSlidePropertyChange?.(activeSlideIndex, "title_align", it.val);
                          handleSlidePropertyChange?.(activeSlideIndex, "subtitle_align", it.val);
                        }}
                        style={{
                          width: 20,
                          height: 20,
                          background: isCur ? "#ea580c" : "#333",
                          border: "1px solid #555",
                          color: "#fff",
                          borderRadius: 3,
                          fontSize: 10,
                          cursor: "pointer",
                        }}
                        title={it.title}
                      >
                        {it.label}
                      </button>
                    );
                  })}
                  <button
                    type="button"
                    onClick={() => handleAddPlugin(activeSlideIndex, "paragraph_2col")}
                    style={{ background: "#333", border: "1px solid #555", color: "#fff", borderRadius: 3, width: 22, height: 20, fontSize: 10, cursor: "pointer" }}
                    title="Add Columns (▦ ⌄)"
                  >
                    ▦ ⌄
                  </button>
                  <button
                    type="button"
                    style={{ background: "#333", border: "1px solid #555", color: "#bbb", borderRadius: 3, width: 22, height: 20, fontSize: 10, cursor: "pointer" }}
                    title="Align Text Vertical (≡ ⌄)"
                  >
                    ≡ ⌄
                  </button>
                </div>
              </div>
            </RibbonGroup>

            {/* Drawing Group */}
            <RibbonGroup title="Drawing">
              <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                {/* 6 Quick Shapes & Shapes Dropdown */}
                <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
                  <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 20px)", gap: 2 }}>
                    <ShapeIconButton icon="▭" title="Rectangle" onClick={() => handleInsertShape("rectangle")} />
                    <ShapeIconButton icon="▢" title="Rounded Rectangle" onClick={() => handleInsertShape("rounded_rectangle")} />
                    <ShapeIconButton icon="◯" title="Circle" onClick={() => handleInsertShape("circle")} />
                    <ShapeIconButton icon="➜" title="Arrow" onClick={() => handleInsertShape("arrow")} />
                    <ShapeIconButton icon="★" title="Star" onClick={() => handleInsertShape("star")} />
                    <ShapeIconButton icon="💬" title="Callout" onClick={() => handleInsertShape("callout_speech")} />
                  </div>
                  <div style={{ display: "flex", gap: 3 }}>
                    <button
                      type="button"
                      onClick={() => setActiveTab("shapes")}
                      style={{ background: "#333", border: "1px solid #555", color: "#fff", borderRadius: 3, fontSize: 9.5, padding: "1px 4px", cursor: "pointer" }}
                      title="More Shapes"
                    >
                      Shapes ⌄
                    </button>
                    <button
                      type="button"
                      style={{ background: "#333", border: "1px solid #555", color: "#fff", borderRadius: 3, fontSize: 9.5, padding: "1px 4px", cursor: "pointer" }}
                      title="Arrange Elements"
                    >
                      Arrange ⌄
                    </button>
                  </div>
                </div>

                {/* Shape Fill, Shape Outline, Shape Effects */}
                <div style={{ display: "flex", flexDirection: "column", gap: 3 }}>
                  <button
                    type="button"
                    onClick={() => setActiveTab("shapes")}
                    style={{ background: "#333", border: "1px solid #555", color: "#fff", borderRadius: 3, fontSize: 10, padding: "2px 6px", cursor: "pointer", display: "flex", alignItems: "center", gap: 3 }}
                    title="Shape Fill Color"
                  >
                    <span>🎨</span> <span>Shape Fill ⌄</span>
                  </button>
                  <button
                    type="button"
                    style={{ background: "#333", border: "1px solid #555", color: "#fff", borderRadius: 3, fontSize: 10, padding: "2px 6px", cursor: "pointer", display: "flex", alignItems: "center", gap: 3 }}
                    title="Shape Outline Color"
                  >
                    <span style={{ color: "#38bdf8" }}>✏</span> <span>Shape Outline ⌄</span>
                  </button>
                  <button
                    type="button"
                    style={{ background: "#333", border: "1px solid #555", color: "#fff", borderRadius: 3, fontSize: 10, padding: "2px 6px", cursor: "pointer", display: "flex", alignItems: "center", gap: 3 }}
                    title="Shape Effects (3D)"
                  >
                    <span>🧊</span> <span>Shape Effects ⌄</span>
                  </button>
                </div>
              </div>
            </RibbonGroup>

          </div>
        )}

        {/* ----------------------------------------------------------------------- */}
        {/* 2. INSERT TAB (EXACT POWERPOINT 365 MATCHING IMAGE 2)                   */}
        {/* ----------------------------------------------------------------------- */}
        {activeTab === "insert" && (
          <div style={{ display: "flex", alignItems: "stretch", gap: 4 }}>
            {/* Slides */}
            <RibbonGroup title="Slides">
              <button
                type="button"
                onClick={() => handleAddSlideWithLayout("title_content")}
                style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", background: "transparent", border: "none", color: "#fff", padding: "4px 8px", cursor: "pointer", minWidth: 50, height: "100%" }}
                title="Insert New Slide"
              >
                <span style={{ fontSize: 18, color: "#22c55e" }}>⊞</span>
                <span style={{ fontSize: 10, marginTop: 2 }}>New Slide ⌄</span>
              </button>
            </RibbonGroup>

            {/* Tables */}
            <RibbonGroup title="Tables">
              <button
                type="button"
                onClick={() => handleAddPlugin(activeSlideIndex, "table", {
                  title: "Comparison Matrix",
                  headers: ["Feature", "Standard", "Enterprise"],
                  rows: [["Cloud Storage", "10 GB", "Unlimited"], ["API Access", "Standard", "Priority Dedicated"]]
                })}
                style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", background: "transparent", border: "none", color: "#fff", padding: "4px 8px", cursor: "pointer", minWidth: 44, height: "100%" }}
                title="Insert Table"
              >
                <span style={{ fontSize: 18 }}>▦</span>
                <span style={{ fontSize: 10, marginTop: 2 }}>Table ⌄</span>
              </button>
            </RibbonGroup>

            {/* Images */}
            <RibbonGroup title="Images">
              <button
                type="button"
                onClick={() => handleAddPlugin(activeSlideIndex, "image", { url: "https://images.unsplash.com/photo-1518770660439-4636190af475?w=600", caption: "Photo Image" })}
                style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", background: "transparent", border: "none", color: "#fff", padding: "4px 6px", cursor: "pointer", minWidth: 44, height: "100%" }}
                title="Insert Pictures"
              >
                <span style={{ fontSize: 18, color: "#38bdf8" }}>🖼️</span>
                <span style={{ fontSize: 9.5, marginTop: 2 }}>Pictures ⌄</span>
              </button>
              <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
                <button
                  type="button"
                  style={{ background: "transparent", border: "none", color: "#d4d4d4", fontSize: 10, cursor: "pointer", display: "flex", alignItems: "center", gap: 3, padding: "2px 4px" }}
                  title="Take Screenshot"
                >
                  <span style={{ color: "#22c55e" }}>📷</span> <span>Screenshot ⌄</span>
                </button>
                <button
                  type="button"
                  style={{ background: "transparent", border: "none", color: "#d4d4d4", fontSize: 10, cursor: "pointer", display: "flex", alignItems: "center", gap: 3, padding: "2px 4px" }}
                  title="Photo Album"
                >
                  <span>🌅</span> <span>Photo Album ⌄</span>
                </button>
              </div>
            </RibbonGroup>

            {/* Illustrations */}
            <RibbonGroup title="Illustrations">
              <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
                <button
                  type="button"
                  onClick={() => setActiveTab("shapes")}
                  style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", background: "transparent", border: "none", color: "#fff", padding: "4px 6px", cursor: "pointer", minWidth: 42, height: "100%" }}
                  title="Insert Shapes"
                >
                  <span style={{ fontSize: 18, color: "#38bdf8" }}>▢◯</span>
                  <span style={{ fontSize: 9.5, marginTop: 2 }}>Shapes ⌄</span>
                </button>
                <button
                  type="button"
                  style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", background: "transparent", border: "none", color: "#fff", padding: "4px 6px", cursor: "pointer", minWidth: 40, height: "100%" }}
                  title="Insert Icons"
                >
                  <span style={{ fontSize: 18 }}>🦆</span>
                  <span style={{ fontSize: 9.5, marginTop: 2 }}>Icons</span>
                </button>
                <button
                  type="button"
                  style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", background: "transparent", border: "none", color: "#fff", padding: "4px 6px", cursor: "pointer", minWidth: 46, height: "100%" }}
                  title="Insert 3D Models"
                >
                  <span style={{ fontSize: 18, color: "#38bdf8" }}>🧊</span>
                  <span style={{ fontSize: 9.5, marginTop: 2 }}>3D Models ⌄</span>
                </button>
                <button
                  type="button"
                  onClick={() => handleAddPlugin(activeSlideIndex, "diagram", { diagram_type: "flowchart", title: "Workflow Hierarchy" })}
                  style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", background: "transparent", border: "none", color: "#fff", padding: "4px 6px", cursor: "pointer", minWidth: 46, height: "100%" }}
                  title="Insert SmartArt Graphic"
                >
                  <span style={{ fontSize: 18, color: "#22c55e" }}>📑</span>
                  <span style={{ fontSize: 9.5, marginTop: 2 }}>SmartArt</span>
                </button>
                <button
                  type="button"
                  onClick={() => handleAddPlugin(activeSlideIndex, "chart", { chart_type: "bar", title: "Quarterly Growth", labels: ["Q1", "Q2", "Q3", "Q4"], values: [40, 65, 80, 110] })}
                  style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", background: "transparent", border: "none", color: "#fff", padding: "4px 6px", cursor: "pointer", minWidth: 40, height: "100%" }}
                  title="Insert Chart"
                >
                  <span style={{ fontSize: 18, color: "#38bdf8" }}>📊</span>
                  <span style={{ fontSize: 9.5, marginTop: 2 }}>Chart</span>
                </button>
              </div>
            </RibbonGroup>

            {/* Links */}
            <RibbonGroup title="Links">
              <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
                <button type="button" style={{ background: "transparent", border: "none", color: "#d4d4d4", fontSize: 10, cursor: "pointer", display: "flex", alignItems: "center", gap: 3 }} title="Zoom">
                  <span>🖵</span> <span>Zoom ⌄</span>
                </button>
                <button type="button" style={{ background: "transparent", border: "none", color: "#d4d4d4", fontSize: 10, cursor: "pointer", display: "flex", alignItems: "center", gap: 3 }} title="Link">
                  <span>🔗</span> <span>Link</span>
                </button>
                <button type="button" style={{ background: "transparent", border: "none", color: "#d4d4d4", fontSize: 10, cursor: "pointer", display: "flex", alignItems: "center", gap: 3 }} title="Action">
                  <span>⭐</span> <span>Action</span>
                </button>
              </div>
            </RibbonGroup>

            {/* Comments */}
            <RibbonGroup title="Comments">
              <button
                type="button"
                style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", background: "transparent", border: "none", color: "#fff", padding: "4px 8px", cursor: "pointer", minWidth: 46, height: "100%" }}
                title="Add New Comment"
              >
                <span style={{ fontSize: 18, color: "#22c55e" }}>💬</span>
                <span style={{ fontSize: 9.5, marginTop: 2 }}>Comment</span>
              </button>
            </RibbonGroup>

            {/* Cards & Metrics (Backend Elements) */}
            <RibbonGroup title="Components">
              <div style={{ display: "flex", alignItems: "center", gap: 3 }}>
                <button
                  type="button"
                  onClick={() => handleAddPlugin(activeSlideIndex, "kpi_grid")}
                  style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", background: "transparent", border: "none", color: "#fff", padding: "4px 5px", cursor: "pointer", minWidth: 42, height: "100%" }}
                  title="Insert KPI Metric Grid"
                >
                  <span style={{ fontSize: 16, color: "#38bdf8" }}>🔢</span>
                  <span style={{ fontSize: 9, marginTop: 2 }}>KPI Grid</span>
                </button>
                <button
                  type="button"
                  onClick={() => handleAddPlugin(activeSlideIndex, "stat")}
                  style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", background: "transparent", border: "none", color: "#fff", padding: "4px 5px", cursor: "pointer", minWidth: 38, height: "100%" }}
                  title="Insert Big Stat Metric"
                >
                  <span style={{ fontSize: 16, color: "#22c55e" }}>📈</span>
                  <span style={{ fontSize: 9, marginTop: 2 }}>Stat</span>
                </button>
                <button
                  type="button"
                  onClick={() => handleAddPlugin(activeSlideIndex, "callout")}
                  style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", background: "transparent", border: "none", color: "#fff", padding: "4px 5px", cursor: "pointer", minWidth: 42, height: "100%" }}
                  title="Insert Callout / Key Takeaway Card"
                >
                  <span style={{ fontSize: 16, color: "#fbbf24" }}>💡</span>
                  <span style={{ fontSize: 9, marginTop: 2 }}>Callout</span>
                </button>
                <button
                  type="button"
                  onClick={() => handleAddPlugin(activeSlideIndex, "pros_cons")}
                  style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", background: "transparent", border: "none", color: "#fff", padding: "4px 5px", cursor: "pointer", minWidth: 46, height: "100%" }}
                  title="Insert Pros & Cons Comparison"
                >
                  <span style={{ fontSize: 16, color: "#c084fc" }}>⚖️</span>
                  <span style={{ fontSize: 9, marginTop: 2 }}>Pros & Cons</span>
                </button>
                <button
                  type="button"
                  onClick={() => handleAddPlugin(activeSlideIndex, "roadmap")}
                  style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", background: "transparent", border: "none", color: "#fff", padding: "4px 5px", cursor: "pointer", minWidth: 44, height: "100%" }}
                  title="Insert Milestone Roadmap"
                >
                  <span style={{ fontSize: 16, color: "#f43f5e" }}>🗺️</span>
                  <span style={{ fontSize: 9, marginTop: 2 }}>Roadmap</span>
                </button>
                <button
                  type="button"
                  onClick={() => handleAddPlugin(activeSlideIndex, "code_block")}
                  style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", background: "transparent", border: "none", color: "#fff", padding: "4px 5px", cursor: "pointer", minWidth: 44, height: "100%" }}
                  title="Insert Syntax Code Block"
                >
                  <span style={{ fontSize: 16, color: "#38bdf8" }}>💻</span>
                  <span style={{ fontSize: 9, marginTop: 2 }}>Code</span>
                </button>
                <button
                  type="button"
                  onClick={() => handleAddPlugin(activeSlideIndex, "speaker_card")}
                  style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", background: "transparent", border: "none", color: "#fff", padding: "4px 5px", cursor: "pointer", minWidth: 46, height: "100%" }}
                  title="Insert Speaker / Team Profile Card"
                >
                  <span style={{ fontSize: 16, color: "#22c55e" }}>👤</span>
                  <span style={{ fontSize: 9, marginTop: 2 }}>Speaker</span>
                </button>
              </div>
            </RibbonGroup>

            {/* Text */}
            <RibbonGroup title="Text">
              <button
                type="button"
                onClick={() => handleAddPlugin(activeSlideIndex, "paragraph", { text: "Click to add text narrative..." })}
                style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", background: "transparent", border: "none", color: "#fff", padding: "4px 6px", cursor: "pointer", minWidth: 46, height: "100%" }}
                title="Draw Text Box"
              >
                <span style={{ fontSize: 18, color: "#38bdf8" }}>🅰️</span>
                <span style={{ fontSize: 9.5, marginTop: 2 }}>Text Box</span>
              </button>
              <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
                <button
                  type="button"
                  onClick={() => handleAddPlugin(activeSlideIndex, "bullets", { points: ["First bullet point", "Second bullet point"] })}
                  style={{ background: "transparent", border: "none", color: "#d4d4d4", fontSize: 10, cursor: "pointer", display: "flex", alignItems: "center", gap: 3 }}
                  title="Insert Bullet List"
                >
                  <span>•≡</span> <span>Bullets</span>
                </button>
                <button
                  type="button"
                  onClick={() => handleAddPlugin(activeSlideIndex, "paragraph_2col")}
                  style={{ background: "transparent", border: "none", color: "#d4d4d4", fontSize: 10, cursor: "pointer", display: "flex", alignItems: "center", gap: 3 }}
                  title="Insert 2-Column Text"
                >
                  <span style={{ color: "#38bdf8" }}>▦</span> <span>2 Columns</span>
                </button>
              </div>
            </RibbonGroup>

          </div>
        )}

        {/* ----------------------------------------------------------------------- */}
        {/* 3. TEMPLATES TAB (SLIDE MASTER TEMPLATES)                               */}
        {/* ----------------------------------------------------------------------- */}
        {activeTab === "templates" && (
          <div style={{ display: "flex", alignItems: "stretch", gap: 8, position: "relative" }}>
            {/* Slide Master Templates Group */}
            <RibbonGroup title="Master Templates">
              <div style={{ display: "flex", alignItems: "center", gap: 3, position: "relative" }}>
                <button
                  type="button"
                  onClick={() => scrollTemplates("left")}
                  style={{
                    width: 16,
                    height: 52,
                    background: "#222",
                    border: "1px solid rgba(255,255,255,0.15)",
                    borderRadius: "3px 0 0 3px",
                    color: "#bbb",
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: 10,
                    padding: 0,
                    flexShrink: 0,
                  }}
                  title="Scroll Previous 6 Templates (◀)"
                  onMouseEnter={(e) => { e.currentTarget.style.background = "#ea580c"; e.currentTarget.style.color = "#fff"; }}
                  onMouseLeave={(e) => { e.currentTarget.style.background = "#222"; e.currentTarget.style.color = "#bbb"; }}
                >
                  ◀
                </button>

                <div
                  ref={templatesScrollRef}
                  className="hide-theme-scrollbar"
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 6,
                    overflowX: "auto",
                    width: 498,
                    minWidth: 498,
                    maxWidth: 498,
                    padding: "2px 0",
                    scrollSnapType: "x mandatory",
                    scrollBehavior: "smooth",
                  }}
                >
                  {MASTER_SLIDE_TEMPLATES.map((tmpl) => {
                    const isSelected = (templateName || "base_template") === tmpl.id;
                    return (
                      <button
                        key={tmpl.id}
                        type="button"
                        onClick={() => {
                          setTemplateName?.(tmpl.id);
                          setSelectedBgPreset?.(tmpl.id);
                          handleSlidePropertyChange?.(activeSlideIndex, "template", tmpl.id);
                          handleSlidePropertyChange?.(activeSlideIndex, "background_preset", tmpl.id);
                        }}
                        style={{
                          width: 78,
                          minWidth: 78,
                          maxWidth: 78,
                          height: 52,
                          background: tmpl.bg,
                          color: "#ffffff",
                          border: isSelected ? "2px solid #ea580c" : "1px solid rgba(255,255,255,0.2)",
                          boxShadow: isSelected ? "0 0 10px rgba(234,88,12,0.45)" : "0 2px 5px rgba(0,0,0,0.3)",
                          borderRadius: 4,
                          padding: "4px 5px",
                          cursor: "pointer",
                          display: "flex",
                          flexDirection: "column",
                          justifyContent: "space-between",
                          flexShrink: 0,
                          scrollSnapAlign: "start",
                          position: "relative",
                          overflow: "hidden",
                        }}
                        title={`${tmpl.name} (${tmpl.desc})`}
                      >
                        {/* Slide Layout Wireframe Mockup Visual Diagram */}
                        {renderTemplateMiniWireframe(tmpl)}

                        {/* Template Badge Label */}
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", width: "100%", zIndex: 1 }}>
                          <span style={{ fontSize: 7.5, fontWeight: 700, background: tmpl.accent, color: "#000", padding: "1px 3px", borderRadius: 2, letterSpacing: 0.2 }}>
                            {tmpl.badge}
                          </span>
                          <span style={{ fontSize: 8, opacity: 0.8, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis", maxWidth: 46 }}>
                            {tmpl.name}
                          </span>
                        </div>
                      </button>
                    );
                  })}
                </div>

                <div style={{ display: "flex", flexDirection: "column", gap: 2, flexShrink: 0 }}>
                  <button
                    type="button"
                    onClick={() => scrollTemplates("right")}
                    style={{
                      width: 16,
                      height: 25,
                      background: "#222",
                      border: "1px solid rgba(255,255,255,0.15)",
                      borderRadius: "0 3px 0 0",
                      color: "#bbb",
                      cursor: "pointer",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: 9,
                      padding: 0,
                    }}
                    title="Scroll Next 6 Templates (▶)"
                    onMouseEnter={(e) => { e.currentTarget.style.background = "#ea580c"; e.currentTarget.style.color = "#fff"; }}
                    onMouseLeave={(e) => { e.currentTarget.style.background = "#222"; e.currentTarget.style.color = "#bbb"; }}
                  >
                    ▶
                  </button>

                  <button
                    type="button"
                    onClick={() => setShowTemplatesDropdown(!showTemplatesDropdown)}
                    style={{
                      width: 16,
                      height: 25,
                      background: showTemplatesDropdown ? "#ea580c" : "#222",
                      border: "1px solid rgba(255,255,255,0.15)",
                      borderRadius: "0 0 3px 0",
                      color: showTemplatesDropdown ? "#fff" : "#bbb",
                      cursor: "pointer",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: 9,
                      padding: 0,
                    }}
                    title="Browse All Templates (Grid View)"
                    onMouseEnter={(e) => { e.currentTarget.style.background = "#ea580c"; e.currentTarget.style.color = "#fff"; }}
                    onMouseLeave={(e) => { if (!showTemplatesDropdown) { e.currentTarget.style.background = "#222"; e.currentTarget.style.color = "#bbb"; } }}
                  >
                    ⌄
                  </button>
                </div>

                {/* Dropdown Modal with All Templates in a 5-Column Grid */}
                {showTemplatesDropdown && (
                  <>
                    <div
                      onClick={() => setShowTemplatesDropdown(false)}
                      style={{
                        position: "fixed",
                        top: 0,
                        left: 0,
                        width: "100vw",
                        height: "100vh",
                        zIndex: 99998,
                        background: "rgba(0, 0, 0, 0.4)",
                      }}
                    />
                    <div
                      style={{
                        position: "fixed",
                        top: "140px",
                        left: "50%",
                        transform: "translateX(-50%)",
                        zIndex: 99999,
                        background: "#1e1e1e",
                        border: "1px solid rgba(255,255,255,0.2)",
                        borderRadius: 8,
                        boxShadow: "0 16px 36px rgba(0,0,0,0.85)",
                        padding: "10px 14px",
                        width: "90%",
                        maxWidth: 500,
                        maxHeight: "65vh",
                        overflowY: "auto",
                      }}
                    >
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8, paddingBottom: 4, borderBottom: "1px solid rgba(255,255,255,0.1)" }}>
                        <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                          <span style={{ fontSize: 13 }}>📐</span>
                          <span style={{ fontSize: 11.5, fontWeight: 700, color: "#fff" }}>All Slide Master Templates ({MASTER_SLIDE_TEMPLATES.length})</span>
                        </div>
                        <button
                          type="button"
                          onClick={() => setShowTemplatesDropdown(false)}
                          style={{ background: "#2e2e2e", border: "1px solid #444", color: "#ccc", borderRadius: 3, padding: "2px 7px", cursor: "pointer", fontSize: 11 }}
                        >
                          ✕ Close
                        </button>
                      </div>
                      <div style={{ display: "grid", gridTemplateColumns: "repeat(5, 1fr)", gap: 6 }}>
                        {MASTER_SLIDE_TEMPLATES.map((tmpl) => {
                          const isSelected = (templateName || "base_template") === tmpl.id;
                          return (
                            <button
                              key={tmpl.id}
                              type="button"
                              onClick={() => {
                                setTemplateName?.(tmpl.id);
                                setSelectedBgPreset?.(tmpl.id);
                                handleSlidePropertyChange?.(activeSlideIndex, "template", tmpl.id);
                                handleSlidePropertyChange?.(activeSlideIndex, "background_preset", tmpl.id);
                                setShowTemplatesDropdown(false);
                              }}
                              style={{
                                width: "100%",
                                height: 46,
                                background: tmpl.bg,
                                color: "#ffffff",
                                border: isSelected ? "2px solid #ea580c" : "1px solid rgba(255,255,255,0.18)",
                                boxShadow: isSelected ? "0 0 8px rgba(234,88,12,0.6)" : "0 1px 4px rgba(0,0,0,0.3)",
                                borderRadius: 4,
                                padding: "3px 4px",
                                cursor: "pointer",
                                display: "flex",
                                flexDirection: "column",
                                justifyContent: "space-between",
                                overflow: "hidden",
                                transition: "transform 0.1s ease",
                              }}
                              onMouseEnter={(e) => { e.currentTarget.style.transform = "scale(1.04)"; }}
                              onMouseLeave={(e) => { e.currentTarget.style.transform = "scale(1)"; }}
                              title={`${tmpl.name} - ${tmpl.desc}`}
                            >
                              {/* Slide Layout Wireframe Mockup Visual Diagram */}
                              {renderTemplateMiniWireframe(tmpl)}

                              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", width: "100%", zIndex: 1 }}>
                                <span style={{ fontSize: 7, fontWeight: 700, background: tmpl.accent, color: "#000", padding: "0.5px 2px", borderRadius: 1.5 }}>
                                  {tmpl.badge}
                                </span>
                                <span style={{ fontSize: 7.5, opacity: 0.8, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis", maxWidth: 45 }}>
                                  {tmpl.name}
                                </span>
                              </div>
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  </>
                )}
              </div>
            </RibbonGroup>
          </div>
        )}

        {/* ----------------------------------------------------------------------- */}
        {/* 4. DESIGN TAB (POWERPOINT 365 THEMES & BACKGROUND COLORS)               */}
        {/* ----------------------------------------------------------------------- */}
        {activeTab === "design" && (
          <div style={{ display: "flex", alignItems: "stretch", gap: 8, position: "relative" }}>
            {/* Themes Group with 6-Card PowerPoint Gallery & Controls */}
            <RibbonGroup title="Themes">
              <div style={{ display: "flex", alignItems: "center", gap: 3, position: "relative" }}>
                <button
                  type="button"
                  onClick={() => scrollThemes("left")}
                  style={{
                    width: 16,
                    height: 52,
                    background: "#222",
                    border: "1px solid rgba(255,255,255,0.15)",
                    borderRadius: "3px 0 0 3px",
                    color: "#bbb",
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: 10,
                    padding: 0,
                    flexShrink: 0,
                  }}
                  title="Scroll Previous 5 Themes (◀)"
                  onMouseEnter={(e) => { e.currentTarget.style.background = "#ea580c"; e.currentTarget.style.color = "#fff"; }}
                  onMouseLeave={(e) => { e.currentTarget.style.background = "#222"; e.currentTarget.style.color = "#bbb"; }}
                >
                  ◀
                </button>

                <div
                  ref={themesScrollRef}
                  className="hide-theme-scrollbar"
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 6,
                    overflowX: "auto",
                    width: 498,
                    minWidth: 498,
                    maxWidth: 498,
                    padding: "2px 0",
                    scrollSnapType: "x mandatory",
                    scrollBehavior: "smooth",
                  }}
                >
                  {allTemplates.map((tmpl) => {
                    const isSelected = (templateName || "base_template") === tmpl.id;
                    return (
                      <button
                        key={tmpl.id}
                        type="button"
                        onClick={() => {
                          setTemplateName?.(tmpl.id);
                          setSelectedBgPreset?.(tmpl.id);
                          handleSlidePropertyChange?.(activeSlideIndex, "background_preset", tmpl.id);
                        }}
                        style={{
                          width: 78,
                          minWidth: 78,
                          maxWidth: 78,
                          height: 52,
                          background: tmpl.bg,
                          color: tmpl.textColor,
                          border: isSelected ? "2px solid #ea580c" : "1px solid rgba(255,255,255,0.2)",
                          boxShadow: isSelected ? "0 0 10px rgba(234,88,12,0.45)" : "0 2px 5px rgba(0,0,0,0.3)",
                          borderRadius: 4,
                          padding: "4px 5px",
                          cursor: "pointer",
                          display: "flex",
                          flexDirection: "column",
                          justifyContent: "space-between",
                          flexShrink: 0,
                          scrollSnapAlign: "start",
                          position: "relative",
                          overflow: "hidden",
                        }}
                        title={tmpl.name}
                      >
                        {/* Structural Design Accents inside Theme Card */}
                        {tmpl.id === "sidebar_executive" && (
                          <div style={{ position: "absolute", left: 0, top: 0, bottom: 0, width: 6, background: "#38bdf8" }} />
                        )}
                        {tmpl.id === "executive_gold" && (
                          <div style={{ position: "absolute", top: 2, right: 2, width: 8, height: 8, borderTop: "1.5px solid #fbbf24", borderRight: "1.5px solid #fbbf24" }} />
                        )}
                        {tmpl.id === "cyberpunk_neon" && (
                          <div style={{ position: "absolute", top: 2, left: 2, fontSize: 6, color: "#00ffcc", fontWeight: 900 }}>┌┐</div>
                        )}
                        {(tmpl.id === "atlas_bold" || tmpl.id === "wall_street") && (
                          <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 3, background: tmpl.accent }} />
                        )}
                        {tmpl.id === "modern_glassmorphism" && (
                          <div style={{ position: "absolute", inset: 3, borderRadius: 3, border: "1px solid rgba(255,255,255,0.25)" }} />
                        )}

                        {/* Big Aa Preview with Theme Typography */}
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", width: "100%", paddingLeft: tmpl.id === "sidebar_executive" ? 4 : 0 }}>
                          <span style={{
                            fontSize: 13.5,
                            fontWeight: 800,
                            lineHeight: 1,
                            fontFamily: tmpl.id === "executive_gold" || tmpl.id === "velvet_rose" ? "serif" : tmpl.id === "cyberpunk_neon" ? "monospace" : "inherit"
                          }}>
                            Aa
                          </span>
                          <span style={{ fontSize: 7.5, opacity: 0.8, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis", maxWidth: 44, fontWeight: 700 }}>
                            {tmpl.name.split(" ")[0]}
                          </span>
                        </div>

                        {/* 6-Color Swatch Strip Along the Bottom */}
                        <div style={{ display: "flex", gap: 1, width: "100%", height: 3.5 }}>
                          {tmpl.swatches.map((sw, sIdx) => (
                            <div key={sIdx} style={{ flex: 1, background: sw, borderRadius: 1 }} />
                          ))}
                        </div>
                      </button>
                    );
                  })}
                </div>

                <div style={{ display: "flex", flexDirection: "column", gap: 2, flexShrink: 0 }}>
                  <button
                    type="button"
                    onClick={() => scrollThemes("right")}
                    style={{
                      width: 16,
                      height: 25,
                      background: "#222",
                      border: "1px solid rgba(255,255,255,0.15)",
                      borderRadius: "0 3px 0 0",
                      color: "#bbb",
                      cursor: "pointer",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: 9,
                      padding: 0,
                    }}
                    title="Scroll Next 5 Themes (▶)"
                    onMouseEnter={(e) => { e.currentTarget.style.background = "#ea580c"; e.currentTarget.style.color = "#fff"; }}
                    onMouseLeave={(e) => { e.currentTarget.style.background = "#222"; e.currentTarget.style.color = "#bbb"; }}
                  >
                    ▶
                  </button>

                  <button
                    type="button"
                    onClick={() => setShowThemesDropdown(!showThemesDropdown)}
                    style={{
                      width: 16,
                      height: 25,
                      background: showThemesDropdown ? "#ea580c" : "#222",
                      border: "1px solid rgba(255,255,255,0.15)",
                      borderRadius: "0 0 3px 0",
                      color: showThemesDropdown ? "#fff" : "#bbb",
                      cursor: "pointer",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: 9,
                      padding: 0,
                    }}
                    title="Browse All Themes (Grid View)"
                    onMouseEnter={(e) => { e.currentTarget.style.background = "#ea580c"; e.currentTarget.style.color = "#fff"; }}
                    onMouseLeave={(e) => { if (!showThemesDropdown) { e.currentTarget.style.background = "#222"; e.currentTarget.style.color = "#bbb"; } }}
                  >
                    ⌄
                  </button>
                </div>

                {/* Dropdown Modal with All Themes in a 4-Column Grid */}
                {showThemesDropdown && (
                  <>
                    <div
                      onClick={() => setShowThemesDropdown(false)}
                      style={{
                        position: "fixed",
                        top: 0,
                        left: 0,
                        width: "100vw",
                        height: "100vh",
                        zIndex: 99998,
                        background: "rgba(0, 0, 0, 0.4)",
                      }}
                    />
                    <div
                      style={{
                        position: "fixed",
                        top: "140px",
                        left: "50%",
                        transform: "translateX(-50%)",
                        zIndex: 99999,
                        background: "#1e1e1e",
                        border: "1px solid rgba(255,255,255,0.2)",
                        borderRadius: 8,
                        boxShadow: "0 16px 36px rgba(0,0,0,0.85)",
                        padding: "10px 14px",
                        width: "90%",
                        maxWidth: 480,
                        maxHeight: "65vh",
                        overflowY: "auto",
                      }}
                    >
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8, paddingBottom: 4, borderBottom: "1px solid rgba(255,255,255,0.1)" }}>
                        <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                          <span style={{ fontSize: 13 }}>🎨</span>
                          <span style={{ fontSize: 11.5, fontWeight: 700, color: "#fff" }}>All Presentation Themes ({allTemplates.length})</span>
                        </div>
                        <button
                          type="button"
                          onClick={() => setShowThemesDropdown(false)}
                          style={{ background: "#2e2e2e", border: "1px solid #444", color: "#ccc", borderRadius: 3, padding: "2px 7px", cursor: "pointer", fontSize: 11 }}
                        >
                          ✕ Close
                        </button>
                      </div>
                      <div style={{ display: "grid", gridTemplateColumns: "repeat(5, 1fr)", gap: 6 }}>
                        {allTemplates.map((tmpl) => {
                          const isSelected = (templateName || "base_template") === tmpl.id;
                          return (
                            <button
                              key={tmpl.id}
                              type="button"
                              onClick={() => {
                                setTemplateName?.(tmpl.id);
                                setSelectedBgPreset?.(tmpl.id);
                                handleSlidePropertyChange?.(activeSlideIndex, "background_preset", tmpl.id);
                                setShowThemesDropdown(false);
                              }}
                              style={{
                                width: "100%",
                                height: 42,
                                background: tmpl.bg,
                                color: tmpl.textColor,
                                border: isSelected ? "2px solid #ea580c" : "1px solid rgba(255,255,255,0.18)",
                                boxShadow: isSelected ? "0 0 8px rgba(234,88,12,0.6)" : "0 1px 4px rgba(0,0,0,0.3)",
                                borderRadius: 4,
                                padding: "3px 4px",
                                cursor: "pointer",
                                display: "flex",
                                flexDirection: "column",
                                justifyContent: "space-between",
                                overflow: "hidden",
                                transition: "transform 0.1s ease",
                              }}
                              onMouseEnter={(e) => { e.currentTarget.style.transform = "scale(1.04)"; }}
                              onMouseLeave={(e) => { e.currentTarget.style.transform = "scale(1)"; }}
                              title={tmpl.name}
                            >
                              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", width: "100%" }}>
                                <span style={{ fontSize: 12, fontWeight: 700, lineHeight: 1 }}>Aa</span>
                                <span style={{ fontSize: 8, opacity: 0.8, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis", maxWidth: 50 }}>{tmpl.name}</span>
                              </div>
                              <div style={{ display: "flex", gap: 1, width: "100%", height: 3 }}>
                                {tmpl.swatches.map((sw, sIdx) => (
                                  <div key={sIdx} style={{ flex: 1, background: sw, borderRadius: 0.5 }} />
                                ))}
                              </div>
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  </>
                )}
              </div>
            </RibbonGroup>

            {/* Custom Background Format Group */}
            <RibbonGroup title="Background">
              <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
                  <label style={{ fontSize: 9, color: "#aaa" }}>Solid / Gradient 1</label>
                  <input
                    type="color"
                    value={customBgColor1 || "#0f172a"}
                    onChange={(e) => {
                      setSelectedBgPreset?.("custom");
                      setCustomBgColor1?.(e.target.value);
                    }}
                    style={{ width: 28, height: 20, border: "1px solid #555", borderRadius: 3, cursor: "pointer", background: "none", padding: 0 }}
                  />
                </div>
                <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
                  <label style={{ fontSize: 9, color: "#aaa" }}>Gradient 2</label>
                  <input
                    type="color"
                    value={customBgColor2 || "#1e1b4b"}
                    onChange={(e) => {
                      setSelectedBgPreset?.("custom");
                      setCustomBgColor2?.(e.target.value);
                    }}
                    style={{ width: 28, height: 20, border: "1px solid #555", borderRadius: 3, cursor: "pointer", background: "none", padding: 0 }}
                  />
                </div>
                <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
                  <label style={{ fontSize: 9, color: "#aaa" }}>Text Color</label>
                  <input
                    type="color"
                    value={customTextColor || "#ffffff"}
                    onChange={(e) => {
                      setSelectedBgPreset?.("custom");
                      setCustomTextColor?.(e.target.value);
                    }}
                    style={{ width: 28, height: 20, border: "1px solid #555", borderRadius: 3, cursor: "pointer", background: "none", padding: 0 }}
                  />
                </div>
              </div>
            </RibbonGroup>
          </div>
        )}

        {/* ----------------------------------------------------------------------- */}
        {/* 6. ANIMATIONS TAB                                                       */}
        {/* ----------------------------------------------------------------------- */}
        {/* VIEW TAB                                                                */}
        {/* ----------------------------------------------------------------------- */}
        {activeTab === "view" && (
          <div style={{ display: "flex", alignItems: "stretch", gap: 6 }}>
            <RibbonGroup title="Presentation Views">
              <button type="button" style={{ background: "#333", border: "1px solid #555", color: "#fff", borderRadius: 4, padding: "4px 8px", cursor: "pointer", fontSize: 11 }}>
                <span>🔲 Normal</span>
              </button>
              <button type="button" style={{ background: "#333", border: "1px solid #555", color: "#fff", borderRadius: 4, padding: "4px 8px", cursor: "pointer", fontSize: 11 }}>
                <span>▦ Slide Sorter</span>
              </button>
              <button type="button" style={{ background: "#333", border: "1px solid #555", color: "#fff", borderRadius: 4, padding: "4px 8px", cursor: "pointer", fontSize: 11 }}>
                <span>📖 Reading View</span>
              </button>
            </RibbonGroup>
            <RibbonGroup title="Show">
              <label style={{ display: "flex", alignItems: "center", gap: 4, fontSize: 11, color: "#ccc", cursor: "pointer" }}>
                <input type="checkbox" defaultChecked={true} /> Ruler
              </label>
              <label style={{ display: "flex", alignItems: "center", gap: 4, fontSize: 11, color: "#ccc", cursor: "pointer" }}>
                <input type="checkbox" /> Gridlines
              </label>
              <label style={{ display: "flex", alignItems: "center", gap: 4, fontSize: 11, color: "#ccc", cursor: "pointer" }}>
                <input type="checkbox" /> Guides
              </label>
            </RibbonGroup>
          </div>
        )}

        {/* ----------------------------------------------------------------------- */}
        {/* 12. CONTEXTUAL: SHAPE FORMAT TAB                                        */}
        {/* ----------------------------------------------------------------------- */}
        {activeTab === "shape_format" && (
          <div style={{ display: "flex", alignItems: "stretch", gap: 8 }}>
            <RibbonGroup title="Shape Styles">
              <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
                {["#38bdf8", "#ea580c", "#10b981", "#c084fc", "#f43f5e", "#fbbf24"].map((col) => (
                  <button
                    key={col}
                    type="button"
                    onClick={() => handleUpdatePluginData?.(selectedPluginIndex, { fill: col, color: col })}
                    style={{ width: 22, height: 22, borderRadius: 4, background: col, border: "1px solid #fff", cursor: "pointer" }}
                    title={`Fill ${col}`}
                  />
                ))}
              </div>
            </RibbonGroup>
            <RibbonGroup title="Shape Fill & Outline">
              <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
                <button
                  type="button"
                  onClick={() => handleUpdatePluginData?.(selectedPluginIndex, { fill: "#ea580c" })}
                  style={{ background: "#333", border: "1px solid #555", color: "#fff", borderRadius: 3, fontSize: 10, padding: "2px 6px", cursor: "pointer" }}
                >
                  <span>🎨</span> <span>Shape Fill ⌄</span>
                </button>
                <button
                  type="button"
                  onClick={() => handleUpdatePluginData?.(selectedPluginIndex, { border_color: "#38bdf8", border_width: 2 })}
                  style={{ background: "#333", border: "1px solid #555", color: "#38bdf8", borderRadius: 3, fontSize: 10, padding: "2px 6px", cursor: "pointer" }}
                >
                  <span>✏️</span> <span>Shape Outline ⌄</span>
                </button>
              </div>
            </RibbonGroup>
            <RibbonGroup title="Arrange">
              <div style={{ display: "flex", gap: 3 }}>
                <button
                  type="button"
                  onClick={() => handleLayerOrder?.(selectedPluginIndex, "front")}
                  style={{ background: "#333", border: "1px solid #555", color: "#fff", borderRadius: 3, fontSize: 10, padding: "2px 6px", cursor: "pointer" }}
                >
                  ⇧ Bring to Front
                </button>
                <button
                  type="button"
                  onClick={() => handleLayerOrder?.(selectedPluginIndex, "back")}
                  style={{ background: "#333", border: "1px solid #555", color: "#fff", borderRadius: 3, fontSize: 10, padding: "2px 6px", cursor: "pointer" }}
                >
                  ⇩ Send to Back
                </button>
              </div>
            </RibbonGroup>
          </div>
        )}
      </div>
    </div>
  );
}

// -----------------------------------------------------------------------------
// HELPER RIBBON COMPONENTS
// -----------------------------------------------------------------------------
function RibbonGroup({ title, children }) {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        alignItems: "center",
        padding: "2px 8px 4px 8px",
        borderRight: "1px solid rgba(255, 255, 255, 0.1)",
        height: "100%",
        flexShrink: 0,
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: 6, flex: 1 }}>
        {children}
      </div>
      <span
        style={{
          fontSize: 9,
          fontWeight: 600,
          color: "rgba(255, 255, 255, 0.45)",
          textTransform: "capitalize",
          marginTop: 2,
          letterSpacing: 0.3,
        }}
      >
        {title}
      </span>
    </div>
  );
}

function ShapeIconButton({ icon, title, onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      title={title}
      style={{
        width: 20,
        height: 20,
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        background: "#333",
        border: "1px solid #555",
        borderRadius: 3,
        color: "#fff",
        cursor: "pointer",
        fontSize: 11,
        padding: 0,
        flexShrink: 0,
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.background = "#ea580c";
        e.currentTarget.style.borderColor = "#ea580c";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.background = "#333";
        e.currentTarget.style.borderColor = "#555";
      }}
    >
      <span style={{ lineHeight: 1 }}>{icon}</span>
    </button>
  );
}
