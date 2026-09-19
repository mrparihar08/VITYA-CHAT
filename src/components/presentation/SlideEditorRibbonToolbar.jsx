import React, { useState, useEffect, useMemo } from "react";
import { BACKGROUND_PRESETS, OFFICE_LAYOUT_PRESETS } from "./PresentationEditor";
import { API_BASE_URL } from "../../services/api";

const DEFAULT_TEMPLATE_PREVIEWS = [
  { id: "base_template", name: "Default Slate Teal", bg: "linear-gradient(135deg, #0f172a 0%, #115e59 100%)", accent: "#2dd4bf", badge: "TEAL", category: "Corporate" },
  { id: "ion_boardroom", name: "Ion Boardroom", bg: "linear-gradient(135deg, #090d16 0%, #31104b 100%)", accent: "#ec4899", badge: "ION", category: "Corporate" },
  { id: "berlin_executive", name: "Berlin Executive", bg: "linear-gradient(135deg, #18181b 0%, #27272a 100%)", accent: "#f97316", badge: "EXEC", category: "Corporate" },
  { id: "quotable_teal", name: "Quotable Teal", bg: "linear-gradient(135deg, #042f2e 0%, #0f766e 100%)", accent: "#06b6d4", badge: "QUOTE", category: "Corporate" },
  { id: "geometric_block", name: "Geometric Color Block", bg: "linear-gradient(135deg, #3b0764 0%, #1e1b4b 100%)", accent: "#3b82f6", badge: "GEO", category: "Modern & Geometric" },
  { id: "circuit_cyber", name: "Circuit Tech Cyber", bg: "linear-gradient(135deg, #09090b 0%, #581c87 100%)", accent: "#22d3ee", badge: "CYBER", category: "Tech & Cyber" },
  { id: "celestial_night", name: "Celestial Night", bg: "linear-gradient(135deg, #090d18 0%, #1e1b4b 100%)", accent: "#818cf8", badge: "SPACE", category: "Tech & Cyber" },
  { id: "modern_glassmorphism", name: "Modern Dark Glass", bg: "linear-gradient(135deg, #18181b 0%, #27272a 100%)", accent: "#c084fc", badge: "GLASS", category: "Tech & Cyber" },
  { id: "executive_gold", name: "Executive Gold", bg: "linear-gradient(135deg, #1c1917 0%, #78350f 100%)", accent: "#fbbf24", badge: "GOLD", category: "Corporate" },
  { id: "nordic_frost", name: "Nordic Frost", bg: "linear-gradient(135deg, #0c4a6e 0%, #0284c7 100%)", accent: "#7dd3fc", badge: "FROST", category: "Minimal & Clean" },
  { id: "crop_frame", label: "Crop Bracket Minimal", bg: "linear-gradient(135deg, #1c1917 0%, #292524 100%)", accent: "#e7e5e4", badge: "MINIMAL", category: "Minimal & Clean" },
  { id: "artistic_neon", name: "Artistic Neon", bg: "linear-gradient(135deg, #09090b 0%, #2e1065 100%)", accent: "#ff5e00", badge: "NEON", category: "Creative & Editorial" },
];

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
  const [activeTab, setActiveTab] = useState("design"); // "design" | "templates" | "layout" | "feature_blocks" | "elements" | "insert" | "style" | "shapes"
  const [activeFont, setActiveFont] = useState("Inter");
  const [selectedStyleColor, setSelectedStyleColor] = useState("#38bdf8");
  const [activeShapeCategory, setActiveShapeCategory] = useState("basic");
  const [serverTemplates, setServerTemplates] = useState([]);
  const [serverShapeCatalog, setServerShapeCatalog] = useState(null);

  useEffect(() => {
    // 1. Dynamic Server Templates Fetch
    fetch(`${API_BASE_URL}/api/presentation/templates`)
      .then((r) => (r.ok ? r.json() : null))
      .then((data) => {
        const tList = Array.isArray(data) ? data : data?.templates;
        if (Array.isArray(tList) && tList.length > 0) {
          setServerTemplates(tList);
        }
      })
      .catch((err) => console.warn("Could not fetch server presentation templates", err));

    // 2. Dynamic Server Shape Catalog Fetch
    fetch(`${API_BASE_URL}/api/presentation/shapes/catalog`)
      .then((r) => (r.ok ? r.json() : null))
      .then((data) => {
        if (data && data.categories) {
          setServerShapeCatalog(data);
        }
      })
      .catch((err) => console.warn("Could not fetch server shape catalog", err));
  }, []);

  const tabs = [
    { id: "design", label: "Design" },
    { id: "templates", label: "Templates" },
    { id: "layout", label: "Layout" },
    { id: "shapes", label: "Shapes" },
    { id: "feature_blocks", label: "Features" },
    { id: "elements", label: "Elements" },
    { id: "insert", label: "Insert" },
    { id: "style", label: "Style" },
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
          bg: "linear-gradient(135deg, #1e293b 0%, #334155 100%)",
          accent: "#38bdf8",
          badge: "SERVER",
          category: "Server Presets",
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
        background: "linear-gradient(180deg, #0b0f19 0%, #0e1424 100%)",
        border: "1px solid rgba(56, 189, 248, 0.25)",
        borderRadius: "14px",
        boxShadow: "0 12px 32px rgba(0, 0, 0, 0.5), inset 0 1px 0 rgba(255, 255, 255, 0.1)",
        overflow: "hidden",
        marginBottom: "16px",
        backdropFilter: "blur(16px)",
      }}
    >
      {/* ========================================================================= */}
      {/* TOP ROW: TAB NAVIGATION BAR & TOP ACTIONS                                 */}
      {/* ========================================================================= */}
      <div
        style={{
          display: "flex",
          justify: "space-between",
          alignItems: "center",
          background: "rgba(6, 9, 16, 0.8)",
          borderBottom: "1px solid rgba(255, 255, 255, 0.08)",
          padding: "4px 12px 0 12px",
          flexWrap: "wrap",
          gap: 8,
        }}
      >
        {/* TABS LIST */}
        <div style={{ display: "flex", alignItems: "center", gap: 4, overflowX: "auto" }}>
          {tabs.map((tab) => {
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id)}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 6,
                  padding: "7px 15px",
                  fontSize: 12,
                  fontWeight: isActive ? 800 : 600,
                  color: isActive ? "#38bdf8" : "rgba(255, 255, 255, 0.7)",
                  background: isActive
                    ? "linear-gradient(180deg, rgba(56, 189, 248, 0.15) 0%, rgba(192, 132, 252, 0.1) 100%)"
                    : "transparent",
                  border: "none",
                  borderBottom: isActive ? "2px solid #38bdf8" : "2px solid transparent",
                  borderRadius: "8px 8px 0 0",
                  cursor: "pointer",
                  transition: "all 0.2s ease",
                  textShadow: isActive ? "0 0 10px rgba(56, 189, 248, 0.6)" : "none",
                  boxShadow: isActive ? "0 -2px 10px rgba(56, 189, 248, 0.15)" : "none",
                  whiteSpace: "nowrap",
                }}
              >
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        
      </div>

      {/* ========================================================================= */}
      {/* SECOND ROW: CONTEXTUAL HORIZONTAL RIBBON                                  */}
      {/* ========================================================================= */}
      <div
        className="ribbon-scroll-container"
        style={{
          minHeight: activeTab === "layout" ? "118px" : (activeTab === "shapes" ? "72px" : "70px"),
          padding: activeTab === "shapes" ? "6px 12px" : "8px 16px",
          display: "flex",
          alignItems: "center",
          gap: "16px",
          overflowX: "auto",
          background: "rgba(11, 15, 25, 0.6)",
          transition: "min-height 0.2s ease",
          scrollbarWidth: "none",
          msOverflowStyle: "none",
        }}
      >
        {/* ----------------------------------------------------------------------- */}
        {/* DESIGN TAB RIBBON                                                       */}
        {/* ----------------------------------------------------------------------- */}
        {activeTab === "design" && (
          <div style={{ display: "flex", alignItems: "center", gap: 16, width: "100%", overflowX: "auto" }}>
            {/* Theme BG Selector */}
            <div style={{ display: "flex", flexDirection: "column", gap: 3, flexShrink: 0 }}>
              <span style={{ fontSize: 10, fontWeight: 700, color: "rgba(255,255,255,0.5)", textTransform: "uppercase", letterSpacing: 0.5 }}>
                Theme BG
              </span>
              <select
                value={selectedBgPreset}
                onChange={(e) => setSelectedBgPreset(e.target.value)}
                style={{
                  background: "rgba(15, 23, 42, 0.8)",
                  border: "1px solid rgba(56, 189, 248, 0.3)",
                  color: "#fff",
                  borderRadius: 6,
                  padding: "4px 8px",
                  fontSize: 11,
                  fontWeight: 600,
                  outline: "none",
                  cursor: "pointer",
                }}
              >
                {BACKGROUND_PRESETS.map((bg) => (
                  <option key={bg.id} value={bg.id}>
                    {bg.name}
                  </option>
                ))}
              </select>
            </div>

            <RibbonSeparator />

            {/* Quick Color Presets */}
            <div style={{ display: "flex", flexDirection: "column", gap: 3, flexShrink: 0 }}>
              <span style={{ fontSize: 10, fontWeight: 700, color: "rgba(255,255,255,0.5)", textTransform: "uppercase", letterSpacing: 0.5 }}>
                Colors
              </span>
              <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                {["dark_gradient", "ocean_blue", "emerald_dark", "cyberpunk_neon", "executive_gold", "velvet_rose"].map((presetId) => {
                  const presetObj = BACKGROUND_PRESETS.find((p) => p.id === presetId);
                  const isSelected = selectedBgPreset === presetId;
                  return (
                    <button
                      key={presetId}
                      type="button"
                      onClick={() => setSelectedBgPreset(presetId)}
                      style={{
                        width: 22,
                        height: 22,
                        borderRadius: "50%",
                        background: presetObj?.bg || "#38bdf8",
                        border: isSelected ? "2px solid #38bdf8" : "1px solid rgba(255,255,255,0.2)",
                        boxShadow: isSelected ? "0 0 8px #38bdf8" : "none",
                        cursor: "pointer",
                        transform: isSelected ? "scale(1.15)" : "scale(1)",
                        transition: "all 0.2s ease",
                      }}
                      title={presetObj?.name}
                    />
                  );
                })}
              </div>
            </div>

            <RibbonSeparator />

            {/* Fonts & Effects */}
            <div style={{ display: "flex", flexDirection: "column", gap: 3, flexShrink: 0 }}>
              <span style={{ fontSize: 10, fontWeight: 700, color: "rgba(255,255,255,0.5)", textTransform: "uppercase", letterSpacing: 0.5 }}>
                Fonts & FX
              </span>
              <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                <select
                  value={activeFont}
                  onChange={(e) => {
                    const font = e.target.value;
                    setActiveFont(font);
                    handleSlidePropertyChange?.(activeSlideIndex, "font_family", font);
                  }}
                  style={{
                    background: "rgba(15, 23, 42, 0.8)",
                    border: "1px solid rgba(192, 132, 252, 0.3)",
                    color: "#fff",
                    borderRadius: 6,
                    padding: "4px 8px",
                    fontSize: 11,
                    outline: "none",
                  }}
                >
                  <option value="Inter">Inter</option>
                  <option value="Roboto">Roboto</option>
                  <option value="Fira Code">Fira Code</option>
                  <option value="Outfit">Outfit</option>
                </select>
                <button
                  type="button"
                  onClick={() => {
                    setSelectedBgPreset("cyberpunk_neon");
                    handleSlidePropertyChange?.(activeSlideIndex, "effect", "glow");
                  }}
                  style={{
                    background: "rgba(192, 132, 252, 0.15)",
                    border: "1px solid rgba(192, 132, 252, 0.4)",
                    color: "#c084fc",
                    borderRadius: 6,
                    padding: "4px 8px",
                    fontSize: 11,
                    fontWeight: 700,
                    cursor: "pointer",
                  }}
                >
                  ✨ Neon Glow
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setSelectedBgPreset("dark_gradient");
                    handleSlidePropertyChange?.(activeSlideIndex, "effect", "glass");
                  }}
                  style={{
                    background: "rgba(56, 189, 248, 0.15)",
                    border: "1px solid rgba(56, 189, 248, 0.4)",
                    color: "#38bdf8",
                    borderRadius: 6,
                    padding: "4px 8px",
                    fontSize: 11,
                    fontWeight: 700,
                    cursor: "pointer",
                  }}
                >
                  🪞 Glassmorphism
                </button>
              </div>

            </div>

            <RibbonSeparator />

            {/* Custom Palette Option */}
            <div style={{ display: "flex", flexDirection: "column", gap: 3, flexShrink: 0 }}>
              <span style={{ fontSize: 10, fontWeight: 700, color: "rgba(255,255,255,0.5)", textTransform: "uppercase", letterSpacing: 0.5 }}>
                Custom Palette
              </span>
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <button
                  type="button"
                  onClick={() => setSelectedBgPreset("custom")}
                  style={{
                    background: selectedBgPreset === "custom" ? "rgba(56, 189, 248, 0.25)" : "rgba(255,255,255,0.06)",
                    border: selectedBgPreset === "custom" ? "1px solid #38bdf8" : "1px solid rgba(255,255,255,0.15)",
                    color: "#fff",
                    borderRadius: 6,
                    padding: "4px 8px",
                    fontSize: 11,
                    fontWeight: 700,
                    cursor: "pointer",
                  }}
                >
                  🎨 Custom Colors
                </button>

                {selectedBgPreset === "custom" && (
                  <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                    <input
                      type="color"
                      value={customBgColor1}
                      onChange={(e) => setCustomBgColor1(e.target.value)}
                      style={{ width: 22, height: 22, borderRadius: 4, border: "none", cursor: "pointer" }}
                      title="Start Gradient Color"
                    />
                    <input
                      type="color"
                      value={customBgColor2}
                      onChange={(e) => setCustomBgColor2(e.target.value)}
                      style={{ width: 22, height: 22, borderRadius: 4, border: "none", cursor: "pointer" }}
                      title="End Gradient Color"
                    />
                    <input
                      type="color"
                      value={customTextColor}
                      onChange={(e) => setCustomTextColor(e.target.value)}
                      style={{ width: 22, height: 22, borderRadius: 4, border: "none", cursor: "pointer" }}
                      title="Text Color"
                    />
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* ----------------------------------------------------------------------- */}
        {/* TEMPLATES TAB RIBBON                                                    */}
        {/* ----------------------------------------------------------------------- */}
        {activeTab === "templates" && (
          <div style={{ display: "flex", alignItems: "center", gap: 10, width: "100%", overflowX: "auto" }}>
            {allTemplates.map((tmpl) => (
              <TemplateThumbnailCard
                key={tmpl.id}
                template={tmpl}
                isSelected={(templateName || "base_template") === tmpl.id}
                onClick={() => setTemplateName && setTemplateName(tmpl.id)}
              />
            ))}
          </div>
        )}


        {/* ----------------------------------------------------------------------- */}
        {/* LAYOUT TAB RIBBON                                                       */}
        {/* ----------------------------------------------------------------------- */}
        {activeTab === "layout" && (
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 12,
              width: "100%",
              overflowX: "auto",
              paddingBottom: 4,
            }}
          >
            {OFFICE_LAYOUT_PRESETS.map((layout) => {
              const isActive = (activeSlide?.layout || "title_content") === layout.id;
              return (
                <div
                  key={layout.id}
                  onClick={() => handleApplySlideLayout(layout.id)}
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    gap: 6,
                    padding: "6px 8px 7px",
                    background: isActive ? "rgba(168, 85, 247, 0.2)" : "rgba(15, 23, 42, 0.7)",
                    border: isActive ? "2px solid #c084fc" : "1px solid rgba(255, 255, 255, 0.12)",
                    borderRadius: 10,
                    cursor: "pointer",
                    transition: "all 0.2s ease",
                    flexShrink: 0,
                    boxShadow: isActive ? "0 4px 14px rgba(192, 132, 252, 0.3)" : "none",
                  }}
                  title={`Apply ${layout.label}: ${layout.desc}`}
                >
                  {/* MINI VISUAL WIREFRAME CANVAS (16:9 PROPORTION) */}
                  <div
                    style={{
                      width: 86,
                      height: 52,
                      background: "#ffffff",
                      borderRadius: 6,
                      padding: "4px 5px",
                      display: "flex",
                      flexDirection: "column",
                      justifyContent: "space-between",
                      boxShadow: "0 2px 6px rgba(0,0,0,0.35)",
                      position: "relative",
                      boxSizing: "border-box",
                      overflow: "hidden",
                    }}
                  >
                    {layout.id === "title_subtitle" && (
                      <div style={{ display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center", height: "100%", gap: 4 }}>
                        <div style={{ width: "80%", height: 11, border: "1.5px dashed #475569", borderRadius: 2 }} />
                        <div style={{ width: "55%", height: 8, border: "1.5px dashed #94a3b8", borderRadius: 2 }} />
                      </div>
                    )}

                    {layout.id === "title_content" && (
                      <div style={{ display: "flex", flexDirection: "column", height: "100%", gap: 4 }}>
                        <div style={{ width: "88%", height: 8, border: "1.5px dashed #475569", borderRadius: 2 }} />
                        <div style={{ width: "100%", flex: 1, border: "1.5px dashed #94a3b8", borderRadius: 2, display: "flex", alignItems: "center", justifyContent: "center", gap: 3, opacity: 0.7 }}>
                          <span style={{ fontSize: 8 }}>📊</span>
                          <span style={{ fontSize: 8 }}>🖼️</span>
                          <span style={{ fontSize: 8 }}>📑</span>
                        </div>
                      </div>
                    )}

                    {layout.id === "section_header" && (
                      <div style={{ display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "flex-start", height: "100%", paddingLeft: 4 }}>
                        <div style={{ width: "80%", height: 13, border: "1.5px dashed #475569", borderRadius: 2 }} />
                      </div>
                    )}

                    {layout.id === "two_content" && (
                      <div style={{ display: "flex", flexDirection: "column", height: "100%", gap: 4 }}>
                        <div style={{ width: "88%", height: 8, border: "1.5px dashed #475569", borderRadius: 2 }} />
                        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 4, flex: 1 }}>
                          <div style={{ border: "1.5px dashed #94a3b8", borderRadius: 2, display: "flex", alignItems: "center", justifyContent: "center" }}>
                            <span style={{ fontSize: 8, opacity: 0.7 }}>📝</span>
                          </div>
                          <div style={{ border: "1.5px dashed #94a3b8", borderRadius: 2, display: "flex", alignItems: "center", justifyContent: "center" }}>
                            <span style={{ fontSize: 8, opacity: 0.7 }}>📊</span>
                          </div>
                        </div>
                      </div>
                    )}

                    {layout.id === "comparison" && (
                      <div style={{ display: "flex", flexDirection: "column", height: "100%", gap: 2 }}>
                        <div style={{ width: "88%", height: 6, border: "1.5px dashed #475569", borderRadius: 1 }} />
                        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 3, height: 6 }}>
                          <div style={{ border: "1.5px dashed #475569", borderRadius: 1 }} />
                          <div style={{ border: "1.5px dashed #475569", borderRadius: 1 }} />
                        </div>
                        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 3, flex: 1 }}>
                          <div style={{ border: "1.5px dashed #94a3b8", borderRadius: 2 }} />
                          <div style={{ border: "1.5px dashed #94a3b8", borderRadius: 2 }} />
                        </div>
                      </div>
                    )}

                    {layout.id === "title_only" && (
                      <div style={{ display: "flex", flexDirection: "column", height: "100%" }}>
                        <div style={{ width: "85%", height: 9, border: "1.5px dashed #475569", borderRadius: 2 }} />
                      </div>
                    )}

                    {layout.id === "blank" && (
                      <div style={{ height: "100%", width: "100%" }} />
                    )}

                    {layout.id === "content_caption" && (
                      <div style={{ display: "grid", gridTemplateColumns: "35% 1fr", gap: 4, height: "100%" }}>
                        <div style={{ border: "1.5px dashed #475569", borderRadius: 2, padding: 1.5, display: "flex", flexDirection: "column", gap: 2 }}>
                          <div style={{ width: "85%", height: 5, background: "#94a3b8", borderRadius: 1 }} />
                          <div style={{ width: "65%", height: 3, background: "#cbd5e1", borderRadius: 1 }} />
                        </div>
                        <div style={{ border: "1.5px dashed #94a3b8", borderRadius: 2, display: "flex", alignItems: "center", justifyContent: "center" }}>
                          <span style={{ fontSize: 8, opacity: 0.7 }}>📊</span>
                        </div>
                      </div>
                    )}

                    {layout.id === "picture_caption" && (
                      <div style={{ display: "grid", gridTemplateColumns: "35% 1fr", gap: 4, height: "100%" }}>
                        <div style={{ border: "1.5px dashed #475569", borderRadius: 2, padding: 1.5, display: "flex", flexDirection: "column", gap: 2 }}>
                          <div style={{ width: "85%", height: 5, background: "#94a3b8", borderRadius: 1 }} />
                          <div style={{ width: "65%", height: 3, background: "#cbd5e1", borderRadius: 1 }} />
                        </div>
                        <div style={{ border: "1.5px dashed #94a3b8", borderRadius: 2, display: "flex", alignItems: "center", justifyContent: "center" }}>
                          <span style={{ fontSize: 9, opacity: 0.8 }}>🖼️</span>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* SLIDE LAYOUT NAME */}
                  <span
                    style={{
                      fontSize: 11,
                      fontWeight: isActive ? 800 : 600,
                      color: isActive ? "#c084fc" : "#e2e8f0",
                      whiteSpace: "nowrap",
                      textAlign: "center",
                      letterSpacing: 0.2,
                    }}
                  >
                    {layout.label}
                  </span>
                </div>
              );
            })}
          </div>
        )}

        {/* ----------------------------------------------------------------------- */}
        {/* FEATURE BLOCKS TAB RIBBON (ORGANIZED BY BLOCK TYPE)                     */}
        {/* ----------------------------------------------------------------------- */}
        {/* ----------------------------------------------------------------------- */}
        {/* FEATURES TAB RIBBON (STRUCTURAL CONTENT BLOCKS)                         */}
        {/* ----------------------------------------------------------------------- */}
        {activeTab === "feature_blocks" && (
          <div style={{ display: "flex", alignItems: "center", gap: 12, width: "100%", overflowX: "auto" }}>
            <div style={{ display: "flex", flexDirection: "column", gap: 3, flexShrink: 0 }}>
              <span style={{ fontSize: 10, fontWeight: 700, color: "#38bdf8", textTransform: "uppercase", letterSpacing: 0.5 }}>
                Text & Content Blocks
              </span>
              <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                <RibbonButton icon="abc|" label="Text Header" onClick={() => handleAddPlugin(activeSlideIndex, "subtitle")} />
                <RibbonButton icon="¶" label="Paragraph" onClick={() => handleAddPlugin(activeSlideIndex, "paragraph")} />
                <RibbonButton icon="¶¶" label="2-Col Text" onClick={() => handleAddPlugin(activeSlideIndex, "paragraph_2col")} />
                <RibbonButton icon="●" label="Bullets List" onClick={() => handleAddPlugin(activeSlideIndex, "bullets")} />
              </div>
            </div>

            <RibbonSeparator />

            <div style={{ display: "flex", flexDirection: "column", gap: 3, flexShrink: 0 }}>
              <span style={{ fontSize: 10, fontWeight: 700, color: "#fbbf24", textTransform: "uppercase", letterSpacing: 0.5 }}>
                Structured Layout Cards
              </span>
              <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                <RibbonButton icon="⚖️" label="Pros & Cons" onClick={() => handleAddPlugin(activeSlideIndex, "pros_cons")} />
                <RibbonButton icon="🔢" label="4-KPI Grid" onClick={() => handleAddPlugin(activeSlideIndex, "kpi_grid")} />
                <RibbonButton icon="🚩" label="Roadmap Timeline" onClick={() => handleAddPlugin(activeSlideIndex, "roadmap")} />
                <RibbonButton icon="👤" label="Speaker Card" onClick={() => handleAddPlugin(activeSlideIndex, "speaker_card")} />
              </div>
            </div>
          </div>
        )}

        {/* ----------------------------------------------------------------------- */}
        {/* SHAPES TAB RIBBON (BASIC, LINES, FLOWCHART, CALLOUTS, EQUATIONS)       */}
        {/* ----------------------------------------------------------------------- */}
        {activeTab === "shapes" && (
          <div style={{ display: "flex", alignItems: "center", gap: 8, width: "100%", overflowX: "auto" }}>
            {/* Category Selector: Compact 2x2 Grid (Pairs of 2) */}
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(2, auto)",
                gap: "3px 6px",
                background: "rgba(15, 23, 42, 0.85)",
                padding: "4px 6px",
                borderRadius: 7,
                border: "1px solid rgba(255, 255, 255, 0.12)",
                flexShrink: 0,
              }}
            >
              {[
                {
                  id: "basic",
                  label: "Shapes",
                  icon: (
                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
                      <rect x="3" y="4" width="18" height="16" rx="1.5" />
                    </svg>
                  ),
                },
                {
                  id: "arrows",
                  label: "Arrows",
                  icon: (
                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
                      <path d="M3 9.5h9v-3.5l8 6-8 6v-3.5H3z" />
                    </svg>
                  ),
                },
                {
                  id: "callouts",
                  label: "Callouts",
                  icon: (
                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
                      <path d="M3 4h18v11H9l-5 4v-4H3z" />
                    </svg>
                  ),
                },
                {
                  id: "equation",
                  label: "Equation",
                  icon: (
                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
                      <path d="M9 3h6v6h6v6h-6v6H9v-6H3V9h6z" />
                    </svg>
                  ),
                },
              ].map((cat) => {
                const isCatActive = activeShapeCategory === cat.id;
                return (
                  <button
                    key={cat.id}
                    type="button"
                    onClick={() => setActiveShapeCategory(cat.id)}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 5,
                      padding: "3px 6px",
                      fontSize: 11,
                      fontWeight: isCatActive ? 700 : 500,
                      color: isCatActive ? "#38bdf8" : "#cbd5e1",
                      background: isCatActive ? "rgba(56, 189, 248, 0.2)" : "transparent",
                      border: isCatActive ? "1px solid rgba(56, 189, 248, 0.55)" : "1px solid transparent",
                      borderRadius: 5,
                      cursor: "pointer",
                      whiteSpace: "nowrap",
                      transition: "all 0.15s ease",
                      boxShadow: isCatActive ? "0 2px 6px rgba(56, 189, 248, 0.25)" : "none",
                      textAlign: "left",
                    }}
                  >
                    <span
                      style={{
                        display: "inline-flex",
                        alignItems: "center",
                        justifyContent: "center",
                        width: 14,
                        height: 14,
                        color: isCatActive ? "#38bdf8" : "#94a3b8",
                      }}
                    >
                      {cat.icon}
                    </span>
                    <span>{cat.label}</span>
                  </button>
                );
              })}
            </div>

            <RibbonSeparator />

            {/* Shape Items Grid for Active Category (2-Row Compact Grid - Pairs of 2) */}
            <div
              style={{
                display: "grid",
                gridTemplateRows: "repeat(2, 28px)",
                gridAutoFlow: "column",
                gap: "3px",
                alignItems: "center",
                flexShrink: 0,
              }}
            >
              {activeShapeCategory === "basic" && (
                <>
                  <ShapeIconButton icon="▭" title="Rectangle" onClick={() => handleInsertShape("rectangle")} />
                  <ShapeIconButton icon="▢" title="Rounded Rectangle" onClick={() => handleInsertShape("rounded_rectangle")} />
                  <ShapeIconButton icon="◯" title="Circle" onClick={() => handleInsertShape("circle")} />
                  <ShapeIconButton icon="△" title="Triangle" onClick={() => handleInsertShape("triangle")} />
                  <ShapeIconButton icon="◇" title="Diamond" onClick={() => handleInsertShape("diamond")} />
                  <ShapeIconButton icon="⬟" title="Pentagon" onClick={() => handleInsertShape("pentagon")} />
                  <ShapeIconButton icon="⬡" title="Hexagon" onClick={() => handleInsertShape("hexagon")} />
                  <ShapeIconButton icon="🛑" title="Octagon" onClick={() => handleInsertShape("octagon")} />
                  <ShapeIconButton icon="▰" title="Parallelogram" onClick={() => handleInsertShape("parallelogram")} />
                  <ShapeIconButton icon="⏢" title="Trapezoid" onClick={() => handleInsertShape("trapezoid")} />
                  <ShapeIconButton icon="★" title="Star" onClick={() => handleInsertShape("star")} />
                  <ShapeIconButton icon="♥" title="Heart" onClick={() => handleInsertShape("heart")} />
                  <ShapeIconButton icon="✚" title="Cross" onClick={() => handleInsertShape("cross")} />
                  <ShapeIconButton icon="📄" title="Document" onClick={() => handleInsertShape("flow_document")} />
                  <ShapeIconButton icon="🗄️" title="Database" onClick={() => handleInsertShape("flow_database")} />
                  <ShapeIconButton icon="🔲" title="Predefined Process" onClick={() => handleInsertShape("flow_predefined")} />
                </>
              )}

              {activeShapeCategory === "arrows" && (
                <>
                  <ShapeIconButton icon="╱" title="Line" onClick={() => handleInsertShape("line")} />
                  <ShapeIconButton icon="➜" title="Arrow" onClick={() => handleInsertShape("arrow")} />
                  <ShapeIconButton icon="↔" title="Double Arrow" onClick={() => handleInsertShape("double_arrow")} />
                  <ShapeIconButton icon="↳" title="Elbow Connector" onClick={() => handleInsertShape("elbow_connector")} />
                  <ShapeIconButton icon="↪" title="Curved Connector" onClick={() => handleInsertShape("curved_connector")} />
                  <ShapeIconButton icon="⬌" title="Terminator" onClick={() => handleInsertShape("flow_terminator")} />
                </>
              )}

              {activeShapeCategory === "callouts" && (
                <>
                  <ShapeIconButton icon="💬" title="Speech Bubble" onClick={() => handleInsertShape("callout_speech")} />
                  <ShapeIconButton icon="☁️" title="Cloud Callout" onClick={() => handleInsertShape("callout_cloud")} />
                  <ShapeIconButton icon="🗨️" title="Rectangular Callout" onClick={() => handleInsertShape("callout_rect")} />
                  <ShapeIconButton icon="💭" title="Rounded Callout" onClick={() => handleInsertShape("callout_rounded")} />
                </>
              )}

              {activeShapeCategory === "equation" && (
                <>
                  <ShapeIconButton icon="➕" title="Plus" onClick={() => handleInsertShape("eq_plus")} />
                  <ShapeIconButton icon="➖" title="Minus" onClick={() => handleInsertShape("eq_minus")} />
                  <ShapeIconButton icon="✖️" title="Multiply" onClick={() => handleInsertShape("eq_multiply")} />
                  <ShapeIconButton icon="➗" title="Divide" onClick={() => handleInsertShape("eq_divide")} />
                  <ShapeIconButton icon="＝" title="Equals" onClick={() => handleInsertShape("eq_equals")} />
                  <ShapeIconButton icon="≠" title="Not Equal" onClick={() => handleInsertShape("eq_not_equal")} />
                </>
              )}
            </div>

            {/* Shape Formatting Controls (when a shape is active) */}
            {selectedPluginIndex !== null && selectedPluginIndex !== undefined && activeSlide?.plugins?.[selectedPluginIndex]?.type === "shape" ? (
              <>
                <RibbonSeparator />
                <div
                  style={{
                    display: "flex",
                    alignItems: "stretch",
                    gap: 8,
                    flexShrink: 0,
                    background: "rgba(15, 23, 42, 0.6)",
                    padding: "3px 8px",
                    borderRadius: 7,
                    border: "1px solid rgba(255, 255, 255, 0.08)",
                  }}
                >
                  {/* Fill Color */}
                  <div style={{ display: "flex", flexDirection: "column", gap: 3 }}>
                    <span
                      style={{
                        fontSize: 9,
                        fontWeight: 700,
                        color: "rgba(255,255,255,0.6)",
                        textTransform: "uppercase",
                        letterSpacing: "0.5px",
                        lineHeight: "12px",
                      }}
                    >
                      Fill Color
                    </span>
                    <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 14px)", gap: 3, height: 32, alignItems: "center" }}>
                      {["#38bdf8", "#c084fc", "#f43f5e", "#10b981", "#fbbf24", "transparent"].map((col) => {
                        const isColActive = activeSlide.plugins[selectedPluginIndex]?.data?.fill === col;
                        return (
                          <button
                            key={col}
                            type="button"
                            onClick={() => handleUpdatePluginData?.(selectedPluginIndex, { fill: col })}
                            style={{
                              width: 14,
                              height: 14,
                              borderRadius: "50%",
                              background: col === "transparent" ? "#0f172a" : col,
                              border: isColActive ? "2px solid #fff" : "1px solid rgba(255,255,255,0.3)",
                              boxShadow: isColActive ? "0 0 6px rgba(255,255,255,0.6)" : "none",
                              cursor: "pointer",
                              padding: 0,
                              position: "relative",
                              overflow: "hidden",
                              display: "inline-flex",
                              alignItems: "center",
                              justifyContent: "center",
                              transition: "transform 0.15s ease",
                            }}
                            title={col === "transparent" ? "No Fill (Transparent)" : col}
                          >
                            {col === "transparent" && (
                              <svg width="14" height="14" viewBox="0 0 16 16" style={{ position: "absolute", top: 0, left: 0 }}>
                                <line x1="2" y1="14" x2="14" y2="2" stroke="#ef4444" strokeWidth="2" strokeLinecap="round" />
                              </svg>
                            )}
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  <RibbonSeparator />

                  {/* Stroke Color & Width */}
                  <div style={{ display: "flex", flexDirection: "column", gap: 3 }}>
                    <span
                      style={{
                        fontSize: 9,
                        fontWeight: 700,
                        color: "rgba(255,255,255,0.6)",
                        textTransform: "uppercase",
                        letterSpacing: "0.5px",
                        lineHeight: "12px",
                      }}
                    >
                      Border
                    </span>
                    <div style={{ display: "flex", alignItems: "center", gap: 4, height: 32 }}>
                      <label
                        title="Border Color"
                        style={{
                          position: "relative",
                          width: 22,
                          height: 22,
                          borderRadius: 4,
                          border: "1px solid rgba(255,255,255,0.3)",
                          background: activeSlide.plugins[selectedPluginIndex]?.data?.border_color || "#ffffff",
                          cursor: "pointer",
                          display: "inline-flex",
                          alignItems: "center",
                          justifyContent: "center",
                          overflow: "hidden",
                          flexShrink: 0,
                          boxShadow: "0 1px 3px rgba(0,0,0,0.5)",
                        }}
                      >
                        <input
                          type="color"
                          value={activeSlide.plugins[selectedPluginIndex]?.data?.border_color || "#ffffff"}
                          onChange={(e) => handleUpdatePluginData?.(selectedPluginIndex, { border_color: e.target.value })}
                          style={{
                            position: "absolute",
                            top: -10,
                            left: -10,
                            width: 44,
                            height: 44,
                            opacity: 0,
                            cursor: "pointer",
                          }}
                        />
                      </label>
                      <select
                        value={activeSlide.plugins[selectedPluginIndex]?.data?.border_width ?? 2}
                        onChange={(e) => handleUpdatePluginData?.(selectedPluginIndex, { border_width: Number(e.target.value) })}
                        style={{
                          height: 22,
                          background: "rgba(15, 23, 42, 0.9)",
                          color: "#e2e8f0",
                          border: "1px solid rgba(255, 255, 255, 0.2)",
                          borderRadius: 4,
                          padding: "0 4px",
                          fontSize: 10.5,
                          fontWeight: 600,
                          cursor: "pointer",
                          outline: "none",
                        }}
                      >
                        <option value={0}>0px</option>
                        <option value={1}>1px</option>
                        <option value={2}>2px</option>
                        <option value={3}>3px</option>
                        <option value={4}>4px</option>
                      </select>
                    </div>
                  </div>

                  <RibbonSeparator />

                  {/* Layer Ordering */}
                  <div style={{ display: "flex", flexDirection: "column", gap: 3 }}>
                    <span
                      style={{
                        fontSize: 9,
                        fontWeight: 700,
                        color: "rgba(255,255,255,0.6)",
                        textTransform: "uppercase",
                        letterSpacing: "0.5px",
                        lineHeight: "12px",
                      }}
                    >
                      Layer
                    </span>
                    <div style={{ display: "flex", gap: 4, alignItems: "center", height: 32 }}>
                      <button
                        type="button"
                        onClick={() => handleLayerOrder?.(selectedPluginIndex, "front")}
                        style={{
                          height: 22,
                          padding: "0 6px",
                          background: "rgba(56, 189, 248, 0.15)",
                          border: "1px solid rgba(56, 189, 248, 0.55)",
                          color: "#38bdf8",
                          borderRadius: 4,
                          fontSize: 10.5,
                          fontWeight: 700,
                          cursor: "pointer",
                          display: "inline-flex",
                          alignItems: "center",
                          gap: 3,
                          transition: "all 0.15s ease",
                        }}
                        title="Bring to Front"
                      >
                        <span>⇧</span>
                        <span>Front</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => handleLayerOrder?.(selectedPluginIndex, "back")}
                        style={{
                          height: 22,
                          padding: "0 6px",
                          background: "rgba(192, 132, 252, 0.15)",
                          border: "1px solid rgba(192, 132, 252, 0.55)",
                          color: "#c084fc",
                          borderRadius: 4,
                          fontSize: 10.5,
                          fontWeight: 700,
                          cursor: "pointer",
                          display: "inline-flex",
                          alignItems: "center",
                          gap: 3,
                          transition: "all 0.15s ease",
                        }}
                        title="Send to Back"
                      >
                        <span>⇩</span>
                        <span>Back</span>
                      </button>
                    </div>
                  </div>
                </div>
              </>
            ) : null}
          </div>
        )}

        {/* ----------------------------------------------------------------------- */}
        {/* ELEMENTS TAB RIBBON (SMART DECORATORS, CODE & DIAGRAMS)                  */}
        {/* ----------------------------------------------------------------------- */}
        {activeTab === "elements" && (
          <div style={{ display: "flex", alignItems: "center", gap: 12, width: "100%", overflowX: "auto" }}>
            <div style={{ display: "flex", flexDirection: "column", gap: 3, flexShrink: 0 }}>
              <span style={{ fontSize: 10, fontWeight: 700, color: "#c084fc", textTransform: "uppercase", letterSpacing: 0.5 }}>
                Interactive Objects & Diagrams
              </span>
              <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                <RibbonButton icon="▢" label="Vector Shapes" onClick={() => setActiveTab("shapes")} />
                <RibbonButton icon="🔘" label="Callout Button" onClick={() => handleAddPlugin(activeSlideIndex, "callout")} />
                <RibbonButton icon="📈" label="Single KPI Stat" onClick={() => handleAddPlugin(activeSlideIndex, "stat")} />
                <RibbonButton icon="💻" label="Code Snippet" onClick={() => handleAddPlugin(activeSlideIndex, "code_block")} />
                <RibbonButton icon="🔄" label="Workflow Diagram" onClick={() => handleAddPlugin(activeSlideIndex, "diagram")} />
                <RibbonButton icon="📖" label="Speaker Notes" onClick={() => handleAddPlugin(activeSlideIndex, "notes")} />
                <RibbonButton icon="⚡" label="AI Custom Block" onClick={() => handleAddPlugin(activeSlideIndex, "custom")} />
              </div>
            </div>
          </div>
        )}

        {/* ----------------------------------------------------------------------- */}
        {/* INSERT TAB RIBBON (MEDIA ATTACHMENTS & DATA IMPORTS)                    */}
        {/* ----------------------------------------------------------------------- */}
        {activeTab === "insert" && (
          <div style={{ display: "flex", alignItems: "center", gap: 12, width: "100%", overflowX: "auto" }}>
            <div style={{ display: "flex", flexDirection: "column", gap: 3, flexShrink: 0 }}>
              <span style={{ fontSize: 10, fontWeight: 700, color: "#34d399", textTransform: "uppercase", letterSpacing: 0.5 }}>
                Media & Data Attachments
              </span>
              <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                <RibbonButton icon="▢" label="Vector Shapes" onClick={() => setActiveTab("shapes")} />
                <RibbonButton icon="📷" label="Image / Photo" onClick={() => handleAddPlugin(activeSlideIndex, "image")} />
                <RibbonButton icon="📊" label="Data Chart" onClick={() => handleAddPlugin(activeSlideIndex, "chart")} />
                <RibbonButton icon="📑" label="Data Table" onClick={() => handleAddPlugin(activeSlideIndex, "table")} />
                <RibbonButton icon="🎥" label="Video Embed" onClick={() => handleAddPlugin(activeSlideIndex, "video")} />
              </div>
            </div>
          </div>
        )}


        {/* ----------------------------------------------------------------------- */}
        {/* STYLE TAB RIBBON                                                        */}
        {/* ----------------------------------------------------------------------- */}
        {activeTab === "style" && (
          <div style={{ display: "flex", alignItems: "center", gap: 16, width: "100%", overflowX: "auto" }}>
            {/* Alignment Group */}
            <div style={{ display: "flex", flexDirection: "column", gap: 3, flexShrink: 0 }}>
              <span style={{ fontSize: 10, fontWeight: 700, color: "rgba(255,255,255,0.5)", textTransform: "uppercase" }}>
                Alignment
              </span>
              <div style={{ display: "flex", gap: 4 }}>
                {["Left", "Center", "Right"].map((align) => {
                  const val = align.toLowerCase();
                  const isCur = (activeSlide?.title_align || "left") === val;
                  return (
                    <button
                      key={align}
                      type="button"
                      onClick={() => {
                        handleSlidePropertyChange?.(activeSlideIndex, "title_align", val);
                        handleSlidePropertyChange?.(activeSlideIndex, "subtitle_align", val);
                      }}
                      style={{
                        padding: "4px 10px",
                        background: isCur ? "rgba(56, 189, 248, 0.2)" : "rgba(15, 23, 42, 0.8)",
                        border: isCur ? "1px solid #38bdf8" : "1px solid rgba(255, 255, 255, 0.15)",
                        borderRadius: 6,
                        color: isCur ? "#38bdf8" : "#fff",
                        fontSize: 11,
                        fontWeight: isCur ? 800 : 600,
                        cursor: "pointer",
                      }}
                    >
                      {align}
                    </button>
                  );
                })}
              </div>
            </div>

            <RibbonSeparator />

            {/* Colors & Fill */}
            <div style={{ display: "flex", flexDirection: "column", gap: 3, flexShrink: 0 }}>
              <span style={{ fontSize: 10, fontWeight: 700, color: "rgba(255,255,255,0.5)", textTransform: "uppercase" }}>
                Color & Fill
              </span>
              <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                {["#38bdf8", "#c084fc", "#f43f5e", "#10b981", "#fbbf24"].map((color) => (
                  <button
                    key={color}
                    type="button"
                    onClick={() => {
                      setSelectedStyleColor(color);
                      handleSlidePropertyChange?.(activeSlideIndex, "title_color", color);
                      setCustomTextColor?.(color);
                    }}
                    style={{
                      width: 22,
                      height: 22,
                      borderRadius: "50%",
                      background: color,
                      border: selectedStyleColor === color || activeSlide?.title_color === color ? "2px solid #fff" : "none",
                      boxShadow: selectedStyleColor === color || activeSlide?.title_color === color ? `0 0 8px ${color}` : "none",
                      cursor: "pointer",
                    }}
                  />
                ))}
              </div>
            </div>

            <RibbonSeparator />

            {/* Border & Shadow */}
            <div style={{ display: "flex", flexDirection: "column", gap: 3, flexShrink: 0 }}>
              <span style={{ fontSize: 10, fontWeight: 700, color: "rgba(255,255,255,0.5)", textTransform: "uppercase" }}>
                Border & Shadow
              </span>
              <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                <button
                  type="button"
                  onClick={() => handleSlidePropertyChange?.(activeSlideIndex, "card_effect", "border")}
                  style={{
                    padding: "4px 10px",
                    background: activeSlide?.card_effect === "border" ? "rgba(56, 189, 248, 0.3)" : "rgba(56, 189, 248, 0.15)",
                    border: "1px solid rgba(56, 189, 248, 0.4)",
                    borderRadius: 6,
                    color: "#38bdf8",
                    fontSize: 11,
                    fontWeight: 700,
                    cursor: "pointer",
                  }}
                >
                  Subtle Border
                </button>
                <button
                  type="button"
                  onClick={() => handleSlidePropertyChange?.(activeSlideIndex, "card_effect", "glow")}
                  style={{
                    padding: "4px 10px",
                    background: activeSlide?.card_effect === "glow" ? "rgba(192, 132, 252, 0.3)" : "rgba(192, 132, 252, 0.15)",
                    border: "1px solid rgba(192, 132, 252, 0.4)",
                    borderRadius: 6,
                    color: "#c084fc",
                    fontSize: 11,
                    fontWeight: 700,
                    cursor: "pointer",
                  }}
                >
                  Glow Shadow
                </button>
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}

// -----------------------------------------------------------------------------
// VISUAL SLIDE TEMPLATE THUMBNAIL CARD COMPONENT
// -----------------------------------------------------------------------------
function TemplateThumbnailCard({ template, isSelected, onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: 4,
        background: isSelected ? "rgba(56, 189, 248, 0.12)" : "rgba(255, 255, 255, 0.03)",
        border: isSelected ? "1px solid #38bdf8" : "1px solid rgba(255, 255, 255, 0.1)",
        borderRadius: 10,
        padding: "5px",
        cursor: "pointer",
        transition: "all 0.2s ease",
        boxShadow: isSelected ? "0 0 12px rgba(56, 189, 248, 0.3)" : "none",
        flexShrink: 0,
      }}
    >
      {/* 16:9 Mini Visual Slide Preview Thumbnail */}
      <div
        style={{
          width: 94,
          height: 54,
          borderRadius: 6,
          background: template.bg,
          position: "relative",
          overflow: "hidden",
          border: `1px solid ${isSelected ? "#38bdf8" : "rgba(255,255,255,0.15)"}`,
          boxSizing: "border-box",
          padding: "5px 6px",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
        }}
      >
        {/* Top Accent Bar / Badge */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", width: "100%" }}>
          <div style={{ width: "35%", height: 3, borderRadius: 2, background: template.accent }} />
          <span style={{ fontSize: 7, fontWeight: 900, color: template.accent, opacity: 0.9 }}>
            {template.badge}
          </span>
        </div>

        {/* Mini Content Skeleton Design */}
        <div style={{ display: "flex", flexDirection: "column", gap: 3, marginTop: 4 }}>
          {/* Title Line */}
          <div style={{ width: "65%", height: 4, borderRadius: 2, background: "rgba(255,255,255,0.85)" }} />
          {/* Subtitle Line */}
          <div style={{ width: "45%", height: 2.5, borderRadius: 2, background: template.accent, opacity: 0.7 }} />
        </div>

        {/* Bottom Graphic Accent Blocks */}
        <div style={{ display: "flex", gap: 3, marginTop: "auto" }}>
          <div style={{ flex: 1, height: 10, borderRadius: 2, background: "rgba(255,255,255,0.08)", border: `1px solid ${template.accent}44` }} />
          <div style={{ flex: 1, height: 10, borderRadius: 2, background: "rgba(255,255,255,0.08)", border: `1px solid ${template.accent}44` }} />
        </div>
      </div>

      {/* Template Name */}
      <span
        style={{
          fontSize: 10,
          fontWeight: isSelected ? 800 : 600,
          color: isSelected ? "#38bdf8" : "rgba(255, 255, 255, 0.8)",
          whiteSpace: "nowrap",
          maxWidth: 94,
          overflow: "hidden",
          textOverflow: "ellipsis",
        }}
      >
        {template.name || template.label}
      </span>
    </button>
  );
}

// Helper Ribbon Components
function RibbonSeparator() {
  return (
    <div
      style={{
        width: "1px",
        height: "28px",
        background: "linear-gradient(180deg, transparent, rgba(56, 189, 248, 0.4), transparent)",
        flexShrink: 0,
      }}
    />
  );
}

function RibbonButton({ icon, label, onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        gap: 3,
        padding: "6px 10px",
        minWidth: 64,
        background: "rgba(15, 23, 42, 0.7)",
        border: "1px solid rgba(56, 189, 248, 0.25)",
        borderRadius: 8,
        color: "#fff",
        cursor: "pointer",
        transition: "all 0.15s ease",
        whiteSpace: "nowrap",
      }}
    >
      <span style={{ fontSize: 16, filter: "drop-shadow(0 0 4px rgba(56, 189, 248, 0.4))" }}>{icon}</span>
      <span style={{ fontSize: 10, fontWeight: 700, opacity: 0.9 }}>{label}</span>
    </button>
  );
}

function ShapeIconButton({ icon, title, onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      title={title}
      style={{
        width: 28,
        height: 28,
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        background: "rgba(15, 23, 42, 0.7)",
        border: "1px solid rgba(56, 189, 248, 0.25)",
        borderRadius: 5,
        color: "#fff",
        cursor: "pointer",
        transition: "all 0.15s ease",
        fontSize: 14,
        padding: 0,
        flexShrink: 0,
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.background = "rgba(56, 189, 248, 0.25)";
        e.currentTarget.style.borderColor = "#38bdf8";
        e.currentTarget.style.transform = "scale(1.08)";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.background = "rgba(15, 23, 42, 0.7)";
        e.currentTarget.style.borderColor = "rgba(56, 189, 248, 0.25)";
        e.currentTarget.style.transform = "none";
      }}
    >
      <span style={{ lineHeight: 1 }}>{icon}</span>
    </button>
  );
}

