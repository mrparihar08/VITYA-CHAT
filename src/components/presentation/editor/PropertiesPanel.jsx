import React, { useState, useRef } from "react";
import { 
  Sliders, 
  Palette, 
  AlignLeft, 
  AlignCenter, 
  AlignRight, 
  AlignJustify, 
  Bold,
  Italic,
  Underline,
  Trash2,
  Copy,
  Sparkles,
  ChevronLeft,
  ChevronRight,
  ChevronDown,
  ChevronUp,
  Upload,
  Search,
  Wand2,
  MoreVertical,
  Image as ImageIcon,
  Check,
  AlertTriangle,
  Code,
  FileCode,
  Type,
  WrapText,
  Hash,
  Layers,
  Lock,
  Unlock
} from "lucide-react";
import { THEME_OPTIONS, SHAPE_OPTIONS, CHART_TYPES } from "./editorState";
import ImageSearchModal from "./ImageSearchModal";
import GeminiImageModal from "./GeminiImageModal";
import AiImageRefineModal from "./AiImageRefineModal";

function isDarkColor(color) {
  if (!color || typeof color !== "string") return false;
  if (color.startsWith("#")) {
    let hex = color.substring(1);
    if (hex.length === 3) {
      hex = hex.split("").map((c) => c + c).join("");
    }
    const num = parseInt(hex, 16);
    if (isNaN(num)) return false;
    const r = (num >> 16) & 0xff;
    const g = (num >> 8) & 0xff;
    const b = num & 0xff;
    return (0.299 * r + 0.587 * g + 0.114 * b) < 140;
  }
  return false;
}

export default function PropertiesPanel({
  slide,
  selectedElementId,
  onUpdateSlide,
  onUpdateElement,
  onDeleteElement,
  onDuplicateElement,
  selectedBgPreset,
  onSelectBgPreset,
  onAiRefine,
  onToggleSidebar,
  presentationTitle = ""
}) {
  const [activeTab, setActiveTab] = useState("edit"); // 'edit' | 'design'
  const [accordionState, setAccordionState] = useState({
    content: true,
    typography: true,
    alignment: false,
    arrange: false,
    spacing: false,
    position: false,
    imgSource: true,
    imgCurrent: true,
    imgCaption: true,
    imgQuality: false,
    imgAppearance: true,
    imgPosition: false,
    imgAdvanced: false,
    codeAppearance: true,
    codeContent: true,
    codeTypography: false,
    codeFormatting: false,
    codePosition: false,
    codeAdvanced: false
  });

  const [isImageSearchOpen, setIsImageSearchOpen] = useState(false);
  const [isGeminiModalOpen, setIsGeminiModalOpen] = useState(false);
  const [isAiImageRefineOpen, setIsAiImageRefineOpen] = useState(false);
  const [isImageMoreMenuOpen, setIsImageMoreMenuOpen] = useState(false);
  const [isDragOver, setIsDragOver] = useState(false);
  const [themePage, setThemePage] = useState(() => {
    const idx = THEME_OPTIONS.findIndex((t) => t.id === selectedBgPreset);
    return idx >= 0 ? Math.floor(idx / 4) : 0;
  });
  const [showAllThemes, setShowAllThemes] = useState(false);
  const fileInputRef = useRef(null);

  const toggleAccordion = (section) => {
    setAccordionState((prev) => ({ ...prev, [section]: !prev[section] }));
  };

  const handleFileUpload = (file) => {
    if (!file || !file.type.startsWith("image/")) return;
    const reader = new FileReader();
    reader.onload = (e) => {
      const dataUrl = e.target.result;
      if (selectedElement) {
        onUpdateElement(selectedElement.id, {
          url: dataUrl,
          source: "Uploaded by User",
          data: { ...(selectedElement.data || {}), url: dataUrl, source: "Uploaded by User" }
        });
      }
    };
    reader.readAsDataURL(file);
  };

  const handleImproveCaption = () => {
    if (!selectedElement) return;
    const topic = presentationTitle || slide?.title || "Presentation Topic";
    const slideTitle = slide?.title || "Current Slide";
    const suggestedCaption = `${slideTitle} — Strategic ${topic.toLowerCase().includes("ai") || topic.toLowerCase().includes("tech") ? "technological data-driven" : "operational"} execution model.`;
    onUpdateElement(selectedElement.id, {
      caption: suggestedCaption,
      data: { ...(selectedElement.data || {}), caption: suggestedCaption }
    });
  };

  if (!slide) return null;

  const elements = slide.elements || [];
  const selectedElement = elements.find((el) => el.id === selectedElementId);

  return (
    <aside className="ppt-properties-panel">
      {/* TWO MAIN TABS: EDIT & DESIGN + TOGGLE BUTTON */}
      <div className="properties-tabs-header">
        <div className="tabs-nav-list">
          <button
            className={`tab-btn ${activeTab === "edit" ? "active" : ""}`}
            onClick={() => setActiveTab("edit")}
          >
            <Sliders size={14} />
            <span>EDIT</span>
          </button>
          <button
            className={`tab-btn ${activeTab === "design" ? "active" : ""}`}
            onClick={() => setActiveTab("design")}
          >
            <Palette size={14} />
            <span>DESIGN</span>
          </button>
        </div>
        {onToggleSidebar && (
          <button
            className="tab-collapse-btn"
            onClick={onToggleSidebar}
            title="Hide Right Properties Panel"
          >
            <ChevronRight size={15} />
          </button>
        )}
      </div>

      <div className="properties-content-scroll">
        {/* ========================================================= */}
        {/* CASE 1: DESIGN TAB ACTIVE -> THEME, BG & FONT */}
        {/* ========================================================= */}
        {activeTab === "design" ? (
          <div className="panel-group-container">
            {/* THEME PRESETS (4 AT A TIME BY DEFAULT) */}
            {(() => {
              const themePageSize = 4;
              const totalThemePages = Math.ceil(THEME_OPTIONS.length / themePageSize);
              const displayedThemes = showAllThemes
                ? THEME_OPTIONS
                : THEME_OPTIONS.slice(themePage * themePageSize, (themePage + 1) * themePageSize);

              return (
                <div className="prop-group">
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 3 }}>
                    <label className="group-label" style={{ margin: 0 }}>THEME PRESET</label>
                    <span style={{ fontSize: 10, color: "#94a3b8", fontWeight: 600 }}>
                      {showAllThemes ? `All ${THEME_OPTIONS.length}` : `${themePage * themePageSize + 1}-${Math.min((themePage + 1) * themePageSize, THEME_OPTIONS.length)} of ${THEME_OPTIONS.length}`}
                    </span>
                  </div>

                  <div className="theme-options-grid">
                    {displayedThemes.map((t) => {
                      const isActive = selectedBgPreset === t.id;
                      return (
                        <button
                          key={t.id}
                          type="button"
                          className={`theme-card ${isActive ? "active" : ""}`}
                          style={{ background: t.bg }}
                          onClick={() => {
                            onSelectBgPreset?.(t.id);
                            const hexMatches = t.bg ? t.bg.match(/#[0-9a-fA-F]{3,6}/g) : null;
                            const bgStart = t.bg_start || (hexMatches?.[0]) || "#0f172a";
                            const bgEnd = t.bg_end || (hexMatches?.[1]) || bgStart;
                            const solidBg = t.solid_bg || bgStart;
                            onUpdateSlide?.({
                              background_theme: t.id,
                              background_preset: t.id,
                              template: t.id,
                              bg_color: solidBg,
                              bg_gradient_start: bgStart,
                              bg_gradient_end: bgEnd,
                              accent_color: t.accent,
                              text_color: t.text
                            });
                          }}
                          title={`${t.name} Theme Preset`}
                          aria-label={`${t.name} Theme Preset${isActive ? " (Selected)" : ""}`}
                          aria-pressed={isActive}
                        >
                          <span className="theme-card-name" style={{ color: t.text }}>
                            {t.name}
                          </span>
                          <span
                            className={`theme-accent-dot ${isActive ? "active" : ""}`}
                            style={{ backgroundColor: t.accent }}
                            aria-hidden="true"
                          >
                            {isActive && (
                              <Check
                                size={8.5}
                                strokeWidth={3.5}
                                style={{
                                  color: isDarkColor(t.accent) ? "#ffffff" : "#090d16"
                                }}
                              />
                            )}
                          </span>
                        </button>
                      );
                    })}
                  </div>

                  {/* PAGINATION & VIEW ALL CONTROLS */}
                  <div className="theme-pagination-bar">
                    {!showAllThemes ? (
                      <div className="theme-page-controls">
                        <button
                          type="button"
                          className="theme-page-btn"
                          onClick={() => setThemePage((p) => Math.max(0, p - 1))}
                          disabled={themePage === 0}
                          title="Previous 4 Themes"
                          aria-label="Previous 4 Themes"
                        >
                          <ChevronLeft size={13} />
                        </button>
                        <span className="theme-page-indicator">
                          {themePage + 1} / {totalThemePages}
                        </span>
                        <button
                          type="button"
                          className="theme-page-btn"
                          onClick={() => setThemePage((p) => Math.min(totalThemePages - 1, p + 1))}
                          disabled={themePage >= totalThemePages - 1}
                          title="Next 4 Themes"
                          aria-label="Next 4 Themes"
                        >
                          <ChevronRight size={13} />
                        </button>
                      </div>
                    ) : (
                      <span style={{ fontSize: 10.5, color: "#94a3b8", fontWeight: 600, paddingLeft: 4 }}>
                        All {THEME_OPTIONS.length} Themes
                      </span>
                    )}
                    <button
                      type="button"
                      className="theme-view-all-btn"
                      onClick={() => setShowAllThemes((prev) => !prev)}
                    >
                      {showAllThemes ? (
                        <span style={{ display: "flex", alignItems: "center", gap: 3 }}>
                          Show 4 <ChevronUp size={12} />
                        </span>
                      ) : (
                        <span style={{ display: "flex", alignItems: "center", gap: 3 }}>
                          View All ({THEME_OPTIONS.length}) <ChevronDown size={12} />
                        </span>
                      )}
                    </button>
                  </div>
                </div>
              );
            })()}

            {/* BACKGROUND STYLE */}
            <div className="prop-group">
              <label className="group-label">BACKGROUND TYPE</label>
              <select
                value={slide.background_theme || "dark_gradient"}
                onChange={(e) => onUpdateSlide({ background_theme: e.target.value })}
                className="prop-select"
              >
                <option value="dark_gradient">Dark Gradient</option>
                <option value="solid">Solid Color</option>
                <option value="custom">Custom Theme</option>
              </select>
            </div>

            {/* SLIDE BACKGROUND COLOR & ACCENT COLOR (UNIFIED 2-COLUMN GRID) */}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(2, minmax(0, 1fr))", gap: 10 }}>
              <div className="prop-group" style={{ minWidth: 0 }}>
                <label className="group-label">SLIDE BG COLOR</label>
                <div className="color-picker-box">
                  <div
                    className="color-swatch-btn"
                    style={{ backgroundColor: slide.bg_color || "#0f172a" }}
                    title="Click to pick slide background color"
                  >
                    <input
                      type="color"
                      value={slide.bg_color || "#0f172a"}
                      onChange={(e) => onUpdateSlide({ bg_color: e.target.value, bg_gradient_start: e.target.value })}
                    />
                  </div>
                  <input
                    type="text"
                    value={slide.bg_color || "#0f172a"}
                    onChange={(e) => onUpdateSlide({ bg_color: e.target.value, bg_gradient_start: e.target.value })}
                    className="color-hex-input"
                    maxLength={7}
                    placeholder="#0F172A"
                  />
                </div>
              </div>

              <div className="prop-group" style={{ minWidth: 0 }}>
                <label className="group-label">ACCENT COLOR</label>
                <div className="color-picker-box">
                  <div
                    className="color-swatch-btn"
                    style={{ backgroundColor: slide.accent_color || "#c084fc" }}
                    title="Click to pick slide accent color"
                  >
                    <input
                      type="color"
                      value={slide.accent_color || "#c084fc"}
                      onChange={(e) => onUpdateSlide({ accent_color: e.target.value })}
                    />
                  </div>
                  <input
                    type="text"
                    value={slide.accent_color || "#c084fc"}
                    onChange={(e) => onUpdateSlide({ accent_color: e.target.value })}
                    className="color-hex-input"
                    maxLength={7}
                    placeholder="#C084FC"
                  />
                </div>
              </div>
            </div>

            {/* TYPOGRAPHY */}
            <div className="prop-group">
              <label className="group-label">SLIDE TYPOGRAPHY</label>
              <select
                value={slide.font_family || "Inter"}
                onChange={(e) => onUpdateSlide({ font_family: e.target.value })}
                className="prop-select"
              >
                <option value="Inter">Inter (Modern Clean)</option>
                <option value="Roboto">Roboto (Technical)</option>
                <option value="Outfit">Outfit (Product & SaaS)</option>
                <option value="Playfair Display">Playfair Display (Executive Serifs)</option>
                <option value="JetBrains Mono">JetBrains Mono (Code/Dev)</option>
              </select>
            </div>
          </div>
        ) : !selectedElement ? (
          /* ========================================================= */
          /* CASE 2: EDIT TAB ACTIVE + NO ELEMENT SELECTED             */
          /* ========================================================= */
          <div className="panel-group-container">
            <div className="no-selection-banner">
              <p>Click any element on the slide to inspect its properties, or edit slide metadata below.</p>
            </div>

            <div className="prop-group">
              <label className="group-label">SLIDE TITLE</label>
              <input
                type="text"
                value={slide.title || ""}
                onChange={(e) => onUpdateSlide({ title: e.target.value })}
                className="prop-text-input"
                placeholder="Enter slide title..."
              />
            </div>

            <div className="prop-group">
              <label className="group-label">SLIDE SUBTITLE</label>
              <input
                type="text"
                value={slide.subtitle || ""}
                onChange={(e) => onUpdateSlide({ subtitle: e.target.value })}
                className="prop-text-input"
                placeholder="Enter slide subtitle..."
              />
            </div>

            <div className="prop-group">
              <label className="group-label">SPEAKER NOTES</label>
              <textarea
                value={slide.notes || ""}
                onChange={(e) => onUpdateSlide({ notes: e.target.value })}
                className="prop-textarea"
                rows={4}
                placeholder="Add presenter speaker notes for this slide..."
              />
            </div>
          </div>
        ) : (
          /* ========================================================= */
          /* CASE 3: EDIT TAB ACTIVE + ELEMENT SELECTED                */
          /* ========================================================= */
          /* ================================================= */
          /* CASE B-G: SPECIFIC SELECTED ELEMENT PROPERTIES   */
          /* ================================================= */
          <div className="panel-group-container">
            {/* ELEMENT HEADER & ACTIONS */}
            <div className="element-inspector-header">
              <span className="element-type-badge">
                {selectedElement.type === "code_block" && <Code size={13} style={{ marginRight: 5, verticalAlign: "middle" }} />}
                {selectedElement.type.toUpperCase()} ELEMENT
              </span>
              <div className="element-action-buttons">
                <button
                  className="icon-action-btn"
                  onClick={() => onDuplicateElement(selectedElement.id)}
                  title="Duplicate Element (Ctrl+D)"
                >
                  <Copy size={13} />
                </button>
                <button
                  className="icon-action-btn danger"
                  onClick={() => onDeleteElement(selectedElement.id)}
                  title="Delete Element (Delete)"
                >
                  <Trash2 size={13} />
                </button>
              </div>
            </div>

            {/* UNIVERSAL FONT COLOR & BACKGROUND FILL CONTROLS */}
            {selectedElement.type !== "code_block" && (
              <div className="prop-group" style={{ background: "rgba(255, 255, 255, 0.03)", padding: 10, borderRadius: 8, border: "1px solid rgba(255, 255, 255, 0.08)", marginBottom: 8 }}>
                <label className="group-label" style={{ color: "#c084fc", marginBottom: 6, display: "block" }}>
                  🎨 FONT COLOR & BACKGROUND FILL
                </label>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
                  <div className="prop-group">
                    <span style={{ fontSize: 10, color: "#cbd5e1", fontWeight: 600 }}>Font / Text Color</span>
                    <div className="color-picker-row">
                      <input
                        type="color"
                        value={selectedElement.color || selectedElement.text_color || selectedElement.data?.color || "#ffffff"}
                        onChange={(e) => {
                          const val = e.target.value;
                          onUpdateElement(selectedElement.id, {
                            color: val,
                            text_color: val,
                            data: { ...(selectedElement.data || {}), color: val, text_color: val }
                          });
                        }}
                        className="prop-color-input"
                      />
                      <input
                        type="text"
                        value={selectedElement.color || selectedElement.text_color || selectedElement.data?.color || "#ffffff"}
                        onChange={(e) => {
                          const val = e.target.value;
                          onUpdateElement(selectedElement.id, {
                            color: val,
                            text_color: val,
                            data: { ...(selectedElement.data || {}), color: val, text_color: val }
                          });
                        }}
                        className="prop-text-input"
                        style={{ fontSize: 11, padding: "4px 6px" }}
                      />
                    </div>
                  </div>

                  <div className="prop-group">
                    <span style={{ fontSize: 10, color: "#cbd5e1", fontWeight: 600 }}>Background Color</span>
                    <div className="color-picker-row">
                      <input
                        type="color"
                        value={selectedElement.bg_color || selectedElement.fill_color || selectedElement.data?.bg_color || selectedElement.data?.fill_color || "#0f172a"}
                        onChange={(e) => {
                          const val = e.target.value;
                          onUpdateElement(selectedElement.id, {
                            bg_color: val,
                            fill_color: val,
                            data: { ...(selectedElement.data || {}), bg_color: val, fill_color: val }
                          });
                        }}
                        className="prop-color-input"
                      />
                      <input
                        type="text"
                        value={selectedElement.bg_color || selectedElement.fill_color || selectedElement.data?.bg_color || selectedElement.data?.fill_color || "#0f172a"}
                        onChange={(e) => {
                          const val = e.target.value;
                          onUpdateElement(selectedElement.id, {
                            bg_color: val,
                            fill_color: val,
                            data: { ...(selectedElement.data || {}), bg_color: val, fill_color: val }
                          });
                        }}
                        className="prop-text-input"
                        style={{ fontSize: 11, padding: "4px 6px" }}
                      />
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* --------------------------------------------- */}
            {/* TEXT PROPERTIES PANEL                         */}
            {/* --------------------------------------------- */}
            {/* --------------------------------------------- */}
            {/* TEXT PROPERTIES PANEL (ACCORDIONS)            */}
            {/* --------------------------------------------- */}
            {selectedElement.type === "text" && (
              <>
                {/* 1. CONTENT ACCORDION (OPEN BY DEFAULT) */}
                <div className="accordion-section">
                  <div className="accordion-header" onClick={() => toggleAccordion("content")}>
                    <span className="accordion-title">CONTENT</span>
                    <button className="accordion-icon-btn">
                      {accordionState.content ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
                    </button>
                  </div>
                  {accordionState.content && (
                    <div className="accordion-content-body">
                      <div className="prop-group">
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 4 }}>
                          <label className="group-label">TEXT VALUE</label>
                          <button
                            className="icon-action-btn"
                            onClick={() => onAiRefine?.(selectedElement.content || "")}
                            title="Refine text using AI"
                            style={{ fontSize: 11, display: "inline-flex", alignItems: "center", gap: 3, padding: "2px 8px", background: "rgba(192, 132, 252, 0.15)", color: "#c084fc", border: "1px solid rgba(192, 132, 252, 0.3)", borderRadius: 6 }}
                          >
                            <Sparkles size={11} />
                            <span>✨ Improve Text</span>
                          </button>
                        </div>
                        <textarea
                          value={selectedElement.content || ""}
                          onChange={(e) => onUpdateElement(selectedElement.id, { content: e.target.value })}
                          className="prop-textarea"
                          rows={3}
                        />
                      </div>
                    </div>
                  )}
                </div>

                {/* 2. TYPOGRAPHY ACCORDION (OPEN BY DEFAULT) */}
                <div className="accordion-section">
                  <div className="accordion-header" onClick={() => toggleAccordion("typography")}>
                    <span className="accordion-title">TYPOGRAPHY</span>
                    <button className="accordion-icon-btn">
                      {accordionState.typography ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
                    </button>
                  </div>
                  {accordionState.typography && (
                    <div className="accordion-content-body">
                      <div className="prop-group">
                        <label className="group-label">FONT FAMILY</label>
                        <select
                          value={selectedElement.fontFamily || "Inter"}
                          onChange={(e) => onUpdateElement(selectedElement.id, { fontFamily: e.target.value })}
                          className="prop-select"
                        >
                          <option value="Inter">Inter (Clean)</option>
                          <option value="Roboto">Roboto (Technical)</option>
                          <option value="Outfit">Outfit (Product)</option>
                          <option value="Playfair Display">Playfair Display (Serif)</option>
                          <option value="JetBrains Mono">JetBrains Mono (Code)</option>
                        </select>
                      </div>

                      <div className="prop-row-2" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8, marginTop: 8 }}>
                        <div className="prop-group">
                          <label className="group-label">SIZE (PX)</label>
                          <div className="number-stepper">
                            <button onClick={() => onUpdateElement(selectedElement.id, { fontSize: Math.max(8, (selectedElement.fontSize || 16) - 2) })}>-</button>
                            <input
                              type="number"
                              value={selectedElement.fontSize || 16}
                              onChange={(e) => onUpdateElement(selectedElement.id, { fontSize: Number(e.target.value) || 16 })}
                            />
                            <button onClick={() => onUpdateElement(selectedElement.id, { fontSize: (selectedElement.fontSize || 16) + 2 })}>+</button>
                          </div>
                        </div>

                        <div className="prop-group">
                          <label className="group-label">COLOR</label>
                          <div className="color-picker-row">
                            <input
                              type="color"
                              value={selectedElement.color || "#ffffff"}
                              onChange={(e) => onUpdateElement(selectedElement.id, { color: e.target.value })}
                              className="prop-color-input"
                            />
                          </div>
                        </div>
                      </div>

                      <div className="prop-group" style={{ marginTop: 8 }}>
                        <label className="group-label">STYLE & WEIGHT</label>
                        <div className="button-group-row">
                          <button
                            className={`toggle-btn ${selectedElement.fontWeight === "bold" || selectedElement.fontWeight === "700" ? "active" : ""}`}
                            onClick={() => onUpdateElement(selectedElement.id, { fontWeight: selectedElement.fontWeight === "bold" ? "normal" : "bold" })}
                          >
                            <Bold size={14} />
                          </button>
                          <button
                            className={`toggle-btn ${selectedElement.fontStyle === "italic" ? "active" : ""}`}
                            onClick={() => onUpdateElement(selectedElement.id, { fontStyle: selectedElement.fontStyle === "italic" ? "normal" : "italic" })}
                          >
                            <Italic size={14} />
                          </button>
                          <button
                            className={`toggle-btn ${selectedElement.textDecoration === "underline" ? "active" : ""}`}
                            onClick={() => onUpdateElement(selectedElement.id, { textDecoration: selectedElement.textDecoration === "underline" ? "none" : "underline" })}
                          >
                            <Underline size={14} />
                          </button>
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                {/* 3. ALIGNMENT & ARRANGE ACCORDION */}
                <div className="accordion-section">
                  <div className="accordion-header" onClick={() => toggleAccordion("alignment")}>
                    <span className="accordion-title">ALIGNMENT & ARRANGE</span>
                    <button className="accordion-icon-btn">
                      {accordionState.alignment ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
                    </button>
                  </div>
                  {accordionState.alignment && (
                    <div className="accordion-content-body">
                      {/* HORIZONTAL ALIGNMENT */}
                      <div className="prop-group">
                        <label className="group-label">HORIZONTAL ALIGNMENT</label>
                        <div className="button-group-row">
                          <button
                            className={`toggle-btn ${selectedElement.align === "left" ? "active" : ""}`}
                            onClick={() => onUpdateElement(selectedElement.id, { align: "left" })}
                            title="Align Left"
                          >
                            <AlignLeft size={14} />
                          </button>
                          <button
                            className={`toggle-btn ${selectedElement.align === "center" ? "active" : ""}`}
                            onClick={() => onUpdateElement(selectedElement.id, { align: "center" })}
                            title="Align Center"
                          >
                            <AlignCenter size={14} />
                          </button>
                          <button
                            className={`toggle-btn ${selectedElement.align === "right" ? "active" : ""}`}
                            onClick={() => onUpdateElement(selectedElement.id, { align: "right" })}
                            title="Align Right"
                          >
                            <AlignRight size={14} />
                          </button>
                          <button
                            className={`toggle-btn ${selectedElement.align === "justify" ? "active" : ""}`}
                            onClick={() => onUpdateElement(selectedElement.id, { align: "justify" })}
                            title="Justify"
                          >
                            <AlignJustify size={14} />
                          </button>
                        </div>
                      </div>

                      {/* VERTICAL ALIGNMENT */}
                      <div className="prop-group" style={{ marginTop: 8 }}>
                        <label className="group-label">VERTICAL ALIGNMENT</label>
                        <div className="button-group-row">
                          <button
                            className={`toggle-btn ${selectedElement.valign === "top" ? "active" : ""}`}
                            onClick={() => onUpdateElement(selectedElement.id, { valign: "top" })}
                            title="Top Align"
                          >
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="4" y1="4" x2="20" y2="4"/><rect x="8" y="8" width="8" height="12" rx="1"/></svg>
                          </button>
                          <button
                            className={`toggle-btn ${selectedElement.valign === "middle" ? "active" : ""}`}
                            onClick={() => onUpdateElement(selectedElement.id, { valign: "middle" })}
                            title="Middle Align"
                          >
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="4" y1="12" x2="20" y2="12"/><rect x="8" y="6" width="8" height="12" rx="1"/></svg>
                          </button>
                          <button
                            className={`toggle-btn ${selectedElement.valign === "bottom" ? "active" : ""}`}
                            onClick={() => onUpdateElement(selectedElement.id, { valign: "bottom" })}
                            title="Bottom Align"
                          >
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="4" y1="20" x2="20" y2="20"/><rect x="8" y="4" width="8" height="12" rx="1"/></svg>
                          </button>
                        </div>
                      </div>

                      {/* ARRANGE SLIDE POSITIONS */}
                      <div className="prop-group" style={{ marginTop: 8 }}>
                        <label className="group-label">QUICK ARRANGE ON SLIDE</label>
                        <div className="arrange-grid-buttons" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 4 }}>
                          <button className="top-btn secondary-btn" style={{ padding: "4px 6px", fontSize: 11 }} onClick={() => onUpdateElement(selectedElement.id, { x: 5 })}>Left</button>
                          <button className="top-btn secondary-btn" style={{ padding: "4px 6px", fontSize: 11 }} onClick={() => onUpdateElement(selectedElement.id, { x: 50 - (selectedElement.width || 30) / 2 })}>Center</button>
                          <button className="top-btn secondary-btn" style={{ padding: "4px 6px", fontSize: 11 }} onClick={() => onUpdateElement(selectedElement.id, { x: 95 - (selectedElement.width || 30) })}>Right</button>
                          <button className="top-btn secondary-btn" style={{ padding: "4px 6px", fontSize: 11 }} onClick={() => onUpdateElement(selectedElement.id, { y: 50 - (selectedElement.height || 20) / 2 })}>Middle</button>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </>
            )}

            {/* --------------------------------------------- */}
            {/* IMAGE PROPERTIES PANEL                        */}
            {/* --------------------------------------------- */}
            {selectedElement.type === "image" && (
              <div className="image-element-panel">
                {/* MORE ACTIONS FLOATING MENU (⋮) */}
                {isImageMoreMenuOpen && (
                  <div className="image-more-menu-overlay" onClick={() => setIsImageMoreMenuOpen(false)}>
                    <div className="image-more-menu-dropdown" onClick={(e) => e.stopPropagation()}>
                      <button className="img-menu-btn" onClick={() => { setIsAiImageRefineOpen(true); setIsImageMoreMenuOpen(false); }}>
                        <Sparkles size={14} className="menu-sparkle" />
                        <span>✨ AI Refine Image</span>
                      </button>
                      <button className="img-menu-btn" onClick={() => { setIsImageSearchOpen(true); setIsImageMoreMenuOpen(false); }}>
                        <Search size={14} />
                        <span>Find Better Image</span>
                      </button>
                      <button className="img-menu-btn" onClick={() => { setIsGeminiModalOpen(true); setIsImageMoreMenuOpen(false); }}>
                        <Wand2 size={14} />
                        <span>Generate with Gemini</span>
                      </button>
                      <button className="img-menu-btn" onClick={() => { handleImproveCaption(); setIsImageMoreMenuOpen(false); }}>
                        <Sparkles size={14} />
                        <span>Improve Caption</span>
                      </button>
                      <button className="img-menu-btn" onClick={() => { fileInputRef.current?.click(); setIsImageMoreMenuOpen(false); }}>
                        <Upload size={14} />
                        <span>Replace / Upload Image</span>
                      </button>
                      <button className="img-menu-btn danger" onClick={() => { onDeleteElement?.(selectedElement.id); setIsImageMoreMenuOpen(false); }}>
                        <Trash2 size={14} />
                        <span>Delete Image Element</span>
                      </button>
                    </div>
                  </div>
                )}

                {/* HEADER ROW WITH MORE MENU (⋮) */}
                <div className="img-panel-top-actions">
                  <button
                    className="more-menu-trigger-btn"
                    onClick={() => setIsImageMoreMenuOpen((prev) => !prev)}
                    title="More Image Actions"
                  >
                    <MoreVertical size={16} />
                  </button>
                </div>

                {/* PROMINENT COMPACT AI REFINE BUTTON */}
                <div className="img-hero-ai-refine-wrap">
                  <button
                    className="hero-ai-refine-btn"
                    onClick={() => setIsAiImageRefineOpen(true)}
                  >
                    <Sparkles size={15} className="ai-glow-sparkle" />
                    <span>✨ AI Refine Image</span>
                  </button>
                </div>

                {/* 1. IMAGE SOURCE ACCORDION (OPEN BY DEFAULT) */}
                <div className="accordion-section">
                  <div className="accordion-header" onClick={() => toggleAccordion("imgSource")}>
                    <span className="accordion-title">IMAGE SOURCE</span>
                    <button className="accordion-icon-btn">
                      {accordionState.imgSource ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
                    </button>
                  </div>
                  {accordionState.imgSource && (
                    <div className="accordion-content-body">
                      <div className="img-sources-grid">
                        <button
                          className="img-source-btn ai-primary"
                          onClick={() => setIsImageSearchOpen(true)}
                        >
                          <Search size={14} />
                          <span>Find Best Image ✨</span>
                        </button>

                        <button
                          className="img-source-btn secondary"
                          onClick={() => fileInputRef.current?.click()}
                        >
                          <Upload size={14} />
                          <span>Upload Image ⬆</span>
                        </button>

                        <button
                          className="img-source-btn ai-accent"
                          onClick={() => setIsGeminiModalOpen(true)}
                        >
                          <Wand2 size={14} />
                          <span>Generate with Gemini ✨</span>
                        </button>

                        <input
                          type="file"
                          ref={fileInputRef}
                          style={{ display: "none" }}
                          accept="image/*"
                          onChange={(e) => {
                            if (e.target.files && e.target.files[0]) {
                              handleFileUpload(e.target.files[0]);
                            }
                          }}
                        />
                      </div>

                      {/* DRAG & DROP ZONE */}
                      <div
                        className={`dropzone-box ${isDragOver ? "drag-over" : ""}`}
                        onDragOver={(e) => { e.preventDefault(); setIsDragOver(true); }}
                        onDragLeave={() => setIsDragOver(false)}
                        onDrop={(e) => {
                          e.preventDefault();
                          setIsDragOver(false);
                          if (e.dataTransfer.files && e.dataTransfer.files[0]) {
                            handleFileUpload(e.dataTransfer.files[0]);
                          }
                        }}
                        onClick={() => fileInputRef.current?.click()}
                      >
                        <Upload size={16} className="drop-icon" />
                        <span>Drop image here or click to browse (PNG, JPG, WEBP, SVG)</span>
                      </div>
                    </div>
                  )}
                </div>

                {/* 2. CURRENT IMAGE ACCORDION (OPEN BY DEFAULT) */}
                <div className="accordion-section">
                  <div className="accordion-header" onClick={() => toggleAccordion("imgCurrent")}>
                    <span className="accordion-title">CURRENT IMAGE</span>
                    <button className="accordion-icon-btn">
                      {accordionState.imgCurrent ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
                    </button>
                  </div>
                  {accordionState.imgCurrent && (
                    <div className="accordion-content-body">
                      {/* IMAGE PREVIEW CARD */}
                      <div className="img-preview-box">
                        {selectedElement.url ? (
                          <img
                            src={selectedElement.url}
                            alt={selectedElement.altText || selectedElement.caption || "Selected image preview"}
                            style={{
                              borderRadius: `${selectedElement.borderRadius || 8}px`,
                              objectFit: selectedElement.objectFit || "cover",
                              opacity: (selectedElement.opacity !== undefined ? selectedElement.opacity : 100) / 100
                            }}
                          />
                        ) : (
                          <div className="no-img-placeholder">
                            <ImageIcon size={28} />
                            <span>No Image Loaded</span>
                          </div>
                        )}
                        {selectedElement.source && (
                          <div className="img-source-badge">{selectedElement.source}</div>
                        )}
                      </div>

                      <div className="prop-group" style={{ marginTop: 8 }}>
                        <label className="group-label">IMAGE URL</label>
                        <input
                          type="text"
                          value={selectedElement.url || ""}
                          onChange={(e) => onUpdateElement(selectedElement.id, { url: e.target.value })}
                          className="prop-text-input"
                          placeholder="https://images.unsplash.com/..."
                        />
                      </div>
                    </div>
                  )}
                </div>

                {/* 3. CAPTION ACCORDION */}
                <div className="accordion-section">
                  <div className="accordion-header" onClick={() => toggleAccordion("imgCaption")}>
                    <span className="accordion-title">CAPTION</span>
                    <button className="accordion-icon-btn">
                      {accordionState.imgCaption ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
                    </button>
                  </div>
                  {accordionState.imgCaption && (
                    <div className="accordion-content-body">
                      <div className="prop-group">
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 4 }}>
                          <label className="group-label">CAPTION TEXT</label>
                          <button
                            className="icon-action-btn"
                            onClick={handleImproveCaption}
                            title="Improve caption with AI"
                            style={{ fontSize: 11, display: "inline-flex", alignItems: "center", gap: 3, padding: "2px 8px", background: "rgba(192, 132, 252, 0.15)", color: "#c084fc", border: "1px solid rgba(192, 132, 252, 0.3)", borderRadius: 6 }}
                          >
                            <Sparkles size={11} />
                            <span>✨ Improve Caption</span>
                          </button>
                        </div>
                        <textarea
                          value={selectedElement.caption || ""}
                          onChange={(e) => onUpdateElement(selectedElement.id, { caption: e.target.value })}
                          className="prop-textarea"
                          rows={2}
                          placeholder="Add image caption takeaway..."
                        />
                      </div>
                    </div>
                  )}
                </div>

                {/* 4. IMAGE QUALITY & RELEVANCE CHECK ACCORDION */}
                <div className="accordion-section">
                  <div className="accordion-header" onClick={() => toggleAccordion("imgQuality")}>
                    <span className="accordion-title">IMAGE QUALITY & DIAGNOSTICS</span>
                    <button className="accordion-icon-btn">
                      {accordionState.imgQuality ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
                    </button>
                  </div>
                  {accordionState.imgQuality && (
                    <div className="accordion-content-body">
                      <div className="img-quality-grid">
                        <div className="quality-item">
                          <span className="q-label">Resolution</span>
                          <span className="q-val ok"><Check size={12} /> Good</span>
                        </div>
                        <div className="quality-item">
                          <span className="q-label">Aspect Ratio</span>
                          <span className="q-val ok"><Check size={12} /> Suitable (16:9)</span>
                        </div>
                        <div className="quality-item">
                          <span className="q-label">Topic Relevance</span>
                          <span className="q-val ok"><Check size={12} /> High</span>
                        </div>
                        <div className="quality-item">
                          <span className="q-label">Caption Relevance</span>
                          <span className={`q-val ${(selectedElement.caption || "").length > 5 ? "ok" : "warn"}`}>
                            {(selectedElement.caption || "").length > 5 ? <><Check size={12} /> High</> : <><AlertTriangle size={12} /> Context Needed</>}
                          </span>
                        </div>
                        <div className="quality-item">
                          <span className="q-label">Visual Style</span>
                          <span className="q-val ok"><Check size={12} /> Consistent</span>
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                {/* 5. APPEARANCE ACCORDION */}
                <div className="accordion-section">
                  <div className="accordion-header" onClick={() => toggleAccordion("imgAppearance")}>
                    <span className="accordion-title">APPEARANCE</span>
                    <button className="accordion-icon-btn">
                      {accordionState.imgAppearance ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
                    </button>
                  </div>
                  {accordionState.imgAppearance && (
                    <div className="accordion-content-body">
                      {/* QUICK SIZE & ASPECT RATIO PRESETS */}
                      <div className="prop-group">
                        <label className="group-label">IMAGE SIZE & ASPECT RATIO</label>
                        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 6, marginBottom: 8 }}>
                          <button
                            type="button"
                            className="top-btn secondary-btn"
                            style={{ fontSize: 11, padding: "5px 6px" }}
                            onClick={() => {
                              const curW = Number(selectedElement.width) || 40;
                              onUpdateElement(selectedElement.id, { height: curW, customHeight: true });
                            }}
                            title="16:9 Widescreen aspect ratio"
                          >
                            📐 16:9 Wide
                          </button>
                          <button
                            type="button"
                            className="top-btn secondary-btn"
                            style={{ fontSize: 11, padding: "5px 6px" }}
                            onClick={() => {
                              const curW = Number(selectedElement.width) || 40;
                              onUpdateElement(selectedElement.id, { height: Math.min(80, Math.round(curW * 1.33)), customHeight: true });
                            }}
                            title="4:3 Standard photo ratio"
                          >
                            📷 4:3 Standard
                          </button>
                          <button
                            type="button"
                            className="top-btn secondary-btn"
                            style={{ fontSize: 11, padding: "5px 6px" }}
                            onClick={() => {
                              const curW = Number(selectedElement.width) || 40;
                              onUpdateElement(selectedElement.id, { height: Math.min(85, Math.round(curW * 1.77)), customHeight: true });
                            }}
                            title="1:1 Square avatar/icon ratio"
                          >
                            ⬛ 1:1 Square
                          </button>
                          <button
                            type="button"
                            className="top-btn secondary-btn"
                            style={{ fontSize: 11, padding: "5px 6px" }}
                            onClick={() => {
                              onUpdateElement(selectedElement.id, { x: 52, y: 22, width: 42, height: 66, customWidth: true, customHeight: true });
                            }}
                            title="Fill Right Half Slide column"
                          >
                            🖼️ Half Slide
                          </button>
                        </div>

                        {/* DIRECT WIDTH & HEIGHT INPUTS */}
                        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8, marginBottom: 8 }}>
                          <div className="prop-mini-field">
                            <span>Width %</span>
                            <input
                              type="number"
                              min="10"
                              max="100"
                              value={selectedElement.width !== undefined ? Math.round(selectedElement.width) : 40}
                              onChange={(e) => onUpdateElement(selectedElement.id, { width: Math.max(5, Math.min(100, Number(e.target.value))), customWidth: true })}
                            />
                          </div>
                          <div className="prop-mini-field">
                            <span>Height %</span>
                            <input
                              type="number"
                              min="5"
                              max="100"
                              value={selectedElement.height !== undefined ? Math.round(selectedElement.height) : 25}
                              onChange={(e) => onUpdateElement(selectedElement.id, { height: Math.max(5, Math.min(100, Number(e.target.value))), customHeight: true })}
                            />
                          </div>
                        </div>
                      </div>

                      {/* OBJECT FIT */}
                      <div className="prop-group">
                        <label className="group-label">OBJECT FIT (IMAGE SIZING)</label>
                        <select
                          value={selectedElement.objectFit || "cover"}
                          onChange={(e) => onUpdateElement(selectedElement.id, { objectFit: e.target.value })}
                          className="prop-select"
                        >
                          <option value="cover">Cover (Fill box, preserve aspect ratio)</option>
                          <option value="contain">Contain (Fit whole image inside box)</option>
                          <option value="fill">Fill / Stretch (Exact match container size)</option>
                        </select>
                      </div>

                      {/* BORDER RADIUS SLIDER */}
                      <div className="prop-group" style={{ marginTop: 8 }}>
                        <div style={{ display: "flex", justifyContent: "space-between" }}>
                          <label className="group-label">BORDER RADIUS</label>
                          <span style={{ fontSize: 11, color: "#94a3b8" }}>{selectedElement.borderRadius || 8}px</span>
                        </div>
                        <input
                          type="range"
                          min="0"
                          max="32"
                          value={selectedElement.borderRadius || 8}
                          onChange={(e) => onUpdateElement(selectedElement.id, { borderRadius: Number(e.target.value) })}
                          className="prop-range-input"
                        />
                      </div>

                      {/* OPACITY SLIDER */}
                      <div className="prop-group" style={{ marginTop: 8 }}>
                        <div style={{ display: "flex", justifyContent: "space-between" }}>
                          <label className="group-label">OPACITY</label>
                          <span style={{ fontSize: 11, color: "#94a3b8" }}>{selectedElement.opacity !== undefined ? selectedElement.opacity : 100}%</span>
                        </div>
                        <input
                          type="range"
                          min="10"
                          max="100"
                          value={selectedElement.opacity !== undefined ? selectedElement.opacity : 100}
                          onChange={(e) => onUpdateElement(selectedElement.id, { opacity: Number(e.target.value) })}
                          className="prop-range-input"
                        />
                      </div>

                      {/* FONT & BACKGROUND COLORS (PRESERVE EXISTING CONTROLS) */}
                      <div className="prop-row-2" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8, marginTop: 8 }}>
                        <div className="prop-group">
                          <label className="group-label">CAPTION FONT COLOR</label>
                          <div className="color-picker-row">
                            <input
                              type="color"
                              value={selectedElement.color || "#ffffff"}
                              onChange={(e) => onUpdateElement(selectedElement.id, { color: e.target.value })}
                              className="prop-color-input"
                            />
                          </div>
                        </div>

                        <div className="prop-group">
                          <label className="group-label">BACKGROUND FILL</label>
                          <div className="color-picker-row">
                            <input
                              type="color"
                              value={selectedElement.bg_color || "#0f172a"}
                              onChange={(e) => onUpdateElement(selectedElement.id, { bg_color: e.target.value })}
                              className="prop-color-input"
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                {/* 6. ADVANCED ACCORDION */}
                <div className="accordion-section">
                  <div className="accordion-header" onClick={() => toggleAccordion("imgAdvanced")}>
                    <span className="accordion-title">ADVANCED & METADATA</span>
                    <button className="accordion-icon-btn">
                      {accordionState.imgAdvanced ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
                    </button>
                  </div>
                  {accordionState.imgAdvanced && (
                    <div className="accordion-content-body">
                      <div className="prop-group">
                        <label className="group-label">IMAGE SOURCE</label>
                        <input
                          type="text"
                          readOnly
                          value={selectedElement.source || "Unsplash (Stock)"}
                          className="prop-text-input"
                          style={{ opacity: 0.8 }}
                        />
                      </div>

                      <div className="prop-group" style={{ marginTop: 8 }}>
                        <label className="group-label">ALT TEXT (ACCESSIBILITY)</label>
                        <input
                          type="text"
                          value={selectedElement.altText || ""}
                          onChange={(e) => onUpdateElement(selectedElement.id, { altText: e.target.value })}
                          className="prop-text-input"
                          placeholder="Describe image for screen readers..."
                        />
                      </div>
                    </div>
                  )}
                </div>

                {/* MODALS INTEGRATION */}
                <ImageSearchModal
                  isOpen={isImageSearchOpen}
                  onClose={() => setIsImageSearchOpen(false)}
                  initialQuery={selectedElement.caption || slide?.title || (slide?.elements?.find(el => el.type === "text")?.content) || ""}
                  slideContext={{
                    topic: presentationTitle || "Enterprise Technology",
                    slideTitle: slide?.title || (slide?.elements?.find(el => el.type === "text")?.content) || "Slide Topic",
                    slideContent: (slide?.elements || []).map(el => el.content || (el.points ? el.points.join(" ") : "")).join(" "),
                    caption: selectedElement.caption
                  }}
                  onSelectImage={(newUrl, newCaption, newSource) => {
                    onUpdateElement(selectedElement.id, {
                      url: newUrl,
                      caption: newCaption || selectedElement.caption,
                      source: newSource || "Unsplash",
                      data: { ...(selectedElement.data || {}), url: newUrl, caption: newCaption || selectedElement.caption }
                    });
                  }}
                />

                <GeminiImageModal
                  isOpen={isGeminiModalOpen}
                  onClose={() => setIsGeminiModalOpen(false)}
                  slideContext={{
                    topic: presentationTitle || "Enterprise Technology",
                    slideTitle: slide?.title || (slide?.elements?.find(el => el.type === "text")?.content) || "Slide Topic",
                    slideContent: (slide?.elements || []).map(el => el.content || (el.points ? el.points.join(" ") : "")).join(" "),
                    caption: selectedElement.caption
                  }}
                  onSelectGeneratedImage={(newUrl, newCaption, newSource) => {
                    onUpdateElement(selectedElement.id, {
                      url: newUrl,
                      caption: newCaption || selectedElement.caption,
                      source: newSource || "AI Generated (Gemini)",
                      data: { ...(selectedElement.data || {}), url: newUrl }
                    });
                  }}
                />

                <AiImageRefineModal
                  isOpen={isAiImageRefineOpen}
                  onClose={() => setIsAiImageRefineOpen(false)}
                  slideContext={{
                    topic: presentationTitle || "Enterprise Technology",
                    slideTitle: slide?.title || (slide?.elements?.find(el => el.type === "text")?.content) || "Slide Topic",
                    slideContent: (slide?.elements || []).map(el => el.content || (el.points ? el.points.join(" ") : "")).join(" "),
                  }}
                  imageElement={selectedElement}
                  onActionSelect={(action) => {
                    if (action === "find_best") setIsImageSearchOpen(true);
                    else if (action === "generate_gemini") setIsGeminiModalOpen(true);
                    else if (action === "improve_caption") handleImproveCaption();
                  }}
                />
              </div>
            )}

            {/* --------------------------------------------- */}
            {/* CHART PROPERTIES PANEL                        */}
            {/* --------------------------------------------- */}
            {selectedElement.type === "chart" && (
              <>
                <div className="prop-group">
                  <label className="group-label">CHART TYPE</label>
                  <select
                    value={
                      selectedElement.chart_type ||
                      selectedElement.chartType ||
                      selectedElement.data?.chart_type ||
                      selectedElement.data?.chartType ||
                      "bar"
                    }
                    onChange={(e) => {
                      const newType = e.target.value;
                      onUpdateElement(selectedElement.id, {
                        chart_type: newType,
                        chartType: newType,
                        data: { ...(selectedElement.data || {}), chart_type: newType, chartType: newType }
                      });
                    }}
                    className="prop-select"
                  >
                    {CHART_TYPES.map((c) => (
                      <option key={c.id} value={c.id}>{c.name}</option>
                    ))}
                  </select>
                </div>

                <div className="prop-group">
                  <label className="group-label">CATEGORIES / LABELS (COMMA SEPARATED)</label>
                  <input
                    type="text"
                    value={
                      (selectedElement.labels && selectedElement.labels.length
                        ? selectedElement.labels
                        : selectedElement.data?.labels || selectedElement.data?.categories || []
                      ).join(", ")
                    }
                    onChange={(e) => {
                      const parsed = e.target.value.split(",").map(s => s.trim());
                      onUpdateElement(selectedElement.id, {
                        labels: parsed,
                        data: { ...(selectedElement.data || {}), labels: parsed, categories: parsed }
                      });
                    }}
                    className="prop-text-input"
                  />
                </div>

                <div className="prop-group">
                  <label className="group-label">VALUES (COMMA SEPARATED NUMBERS)</label>
                  <input
                    type="text"
                    value={
                      (selectedElement.values && selectedElement.values.length
                        ? selectedElement.values
                        : selectedElement.data?.values || []
                      ).join(", ")
                    }
                    onChange={(e) => {
                      const parsed = e.target.value.split(",").map(s => Number(s.trim()) || 0);
                      onUpdateElement(selectedElement.id, {
                        values: parsed,
                        data: { ...(selectedElement.data || {}), values: parsed }
                      });
                    }}
                    className="prop-text-input"
                  />
                </div>

                <div className="prop-group">
                  <label className="group-label">PRIMARY CHART COLOR</label>
                  <div className="color-picker-row">
                    <input
                      type="color"
                      value={selectedElement.color || selectedElement.data?.color || "#38bdf8"}
                      onChange={(e) => {
                        onUpdateElement(selectedElement.id, {
                          color: e.target.value,
                          data: { ...(selectedElement.data || {}), color: e.target.value }
                        });
                      }}
                      className="prop-color-input"
                    />
                  </div>
                </div>
              </>
            )}

            {/* --------------------------------------------- */}
            {/* SHAPE PROPERTIES PANEL                        */}
            {/* --------------------------------------------- */}
            {selectedElement.type === "shape" && (
              <>
                <div className="prop-group">
                  <label className="group-label">SHAPE TYPE</label>
                  <select
                    value={selectedElement.shape_type || "rectangle"}
                    onChange={(e) => onUpdateElement(selectedElement.id, { shape_type: e.target.value })}
                    className="prop-select"
                  >
                    {SHAPE_OPTIONS.map((s) => (
                      <option key={s.id} value={s.id}>{s.name}</option>
                    ))}
                  </select>
                </div>

                <div className="prop-group">
                  <label className="group-label">FILL COLOR</label>
                  <div className="color-picker-row">
                    <input
                      type="color"
                      value={selectedElement.fill_color || "#38bdf8"}
                      onChange={(e) => onUpdateElement(selectedElement.id, { fill_color: e.target.value })}
                      className="prop-color-input"
                    />
                  </div>
                </div>

                <div className="prop-group">
                  <label className="group-label">BORDER COLOR</label>
                  <div className="color-picker-row">
                    <input
                      type="color"
                      value={selectedElement.stroke_color || "#0284c7"}
                      onChange={(e) => onUpdateElement(selectedElement.id, { stroke_color: e.target.value })}
                      className="prop-color-input"
                    />
                  </div>
                </div>

                <div className="prop-group">
                  <label className="group-label">LABEL INSIDE SHAPE</label>
                  <input
                    type="text"
                    value={selectedElement.text || ""}
                    onChange={(e) => onUpdateElement(selectedElement.id, { text: e.target.value })}
                    className="prop-text-input"
                  />
                </div>
              </>
            )}

            {/* --------------------------------------------- */}
            {/* TABLE PROPERTIES PANEL                        */}
            {/* --------------------------------------------- */}
            {selectedElement.type === "table" && (
              <>
                <div className="prop-group">
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 4 }}>
                    <label className="group-label">HEADER COLUMNS (COMMA SEPARATED)</label>
                    <button
                      className="icon-action-btn"
                      onClick={() => onAiRefine?.("table")}
                      title="Refine table headers with AI"
                      style={{ fontSize: 11, display: "inline-flex", alignItems: "center", gap: 3, padding: "2px 8px", background: "rgba(192, 132, 252, 0.15)", color: "#c084fc", border: "1px solid rgba(192, 132, 252, 0.3)", borderRadius: 6 }}
                    >
                      <Sparkles size={11} />
                      <span>AI Table</span>
                    </button>
                  </div>
                  <input
                    type="text"
                    value={
                      (selectedElement.headers && selectedElement.headers.length
                        ? selectedElement.headers
                        : selectedElement.data?.headers || ["Feature", "Standard", "Enterprise"]
                      ).join(", ")
                    }
                    onChange={(e) => {
                      const parsed = e.target.value.split(",").map(s => s.trim());
                      onUpdateElement(selectedElement.id, {
                        headers: parsed,
                        data: { ...(selectedElement.data || {}), headers: parsed }
                      });
                    }}
                    className="prop-text-input"
                  />
                </div>

                <div className="prop-group">
                  <label className="group-label">TABLE THEME</label>
                  <select
                    value={selectedElement.table_theme || selectedElement.data?.table_theme || "purple"}
                    onChange={(e) => {
                      onUpdateElement(selectedElement.id, {
                        table_theme: e.target.value,
                        data: { ...(selectedElement.data || {}), table_theme: e.target.value }
                      });
                    }}
                    className="prop-select"
                  >
                    <option value="purple">Midnight Purple</option>
                    <option value="blue">Ocean Blue</option>
                    <option value="emerald">Emerald Forest</option>
                    <option value="dark">Dark Minimal</option>
                  </select>
                </div>
              </>
            )}

            {/* --------------------------------------------- */}
            {/* STAT CARD PROPERTIES PANEL                    */}
            {/* --------------------------------------------- */}
            {selectedElement.type === "stat" && (
              <>
                <div className="prop-group">
                  <label className="group-label">BIG METRIC NUMBER</label>
                  <input
                    type="text"
                    value={selectedElement.number || selectedElement.data?.number || "99.9%"}
                    onChange={(e) => {
                      onUpdateElement(selectedElement.id, {
                        number: e.target.value,
                        data: { ...(selectedElement.data || {}), number: e.target.value }
                      });
                    }}
                    className="prop-text-input"
                  />
                </div>

                <div className="prop-group">
                  <label className="group-label">METRIC LABEL</label>
                  <input
                    type="text"
                    value={selectedElement.label || selectedElement.data?.label || "Metric Label"}
                    onChange={(e) => {
                      onUpdateElement(selectedElement.id, {
                        label: e.target.value,
                        data: { ...(selectedElement.data || {}), label: e.target.value }
                      });
                    }}
                    className="prop-text-input"
                  />
                </div>

                <div className="prop-group">
                  <label className="group-label">SUBLABEL / DESCRIPTON</label>
                  <input
                    type="text"
                    value={selectedElement.sublabel || selectedElement.data?.sublabel || ""}
                    onChange={(e) => {
                      onUpdateElement(selectedElement.id, {
                        sublabel: e.target.value,
                        data: { ...(selectedElement.data || {}), sublabel: e.target.value }
                      });
                    }}
                    className="prop-text-input"
                  />
                </div>

                <div className="prop-group">
                  <label className="group-label">METRIC ACCENT COLOR</label>
                  <div className="color-picker-row">
                    <input
                      type="color"
                      value={selectedElement.color || selectedElement.data?.color || "#38bdf8"}
                      onChange={(e) => {
                        onUpdateElement(selectedElement.id, {
                          color: e.target.value,
                          data: { ...(selectedElement.data || {}), color: e.target.value }
                        });
                      }}
                      className="prop-color-input"
                    />
                  </div>
                </div>
              </>
            )}

            {/* --------------------------------------------- */}
            {/* BULLETS LIST PROPERTIES PANEL                 */}
            {/* --------------------------------------------- */}
            {selectedElement.type === "bullets" && (
              <>
                <div className="prop-group">
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 4 }}>
                    <label className="group-label">BULLET POINTS (ONE PER LINE)</label>
                    <button
                      className="icon-action-btn"
                      onClick={() => onAiRefine?.(
                        (selectedElement.points || selectedElement.data?.points || []).join("\n")
                      )}
                      title="Refine bullets using AI"
                      style={{ fontSize: 11, display: "inline-flex", alignItems: "center", gap: 3, padding: "2px 8px", background: "rgba(192, 132, 252, 0.15)", color: "#c084fc", border: "1px solid rgba(192, 132, 252, 0.3)", borderRadius: 6 }}
                    >
                      <Sparkles size={11} />
                      <span>AI Bullets</span>
                    </button>
                  </div>
                  <textarea
                    value={
                      Array.isArray(selectedElement.points)
                        ? selectedElement.points.join("\n")
                        : (selectedElement.data?.points || []).join("\n")
                    }
                    onChange={(e) => {
                      const parsed = e.target.value.split("\n");
                      onUpdateElement(selectedElement.id, {
                        points: parsed,
                        data: { ...(selectedElement.data || {}), points: parsed }
                      });
                    }}
                    className="prop-textarea"
                    rows={5}
                    placeholder="Enter bullet points (one per line)..."
                  />
                </div>
              </>
            )}

            {/* --------------------------------------------- */}
            {/* DIAGRAM / ROADMAP PROPERTIES PANEL            */}
            {/* --------------------------------------------- */}
            {(selectedElement.type === "roadmap" || selectedElement.type === "diagram") && (
              <>
                <div className="prop-group">
                  <label className="group-label">DIAGRAM TYPE</label>
                  <select
                    value={
                      selectedElement.diagram_type ||
                      selectedElement.diagramType ||
                      selectedElement.data?.diagram_type ||
                      selectedElement.data?.diagramType ||
                      (selectedElement.type === "roadmap" ? "timeline" : "flowchart")
                    }
                    onChange={(e) => {
                      const newType = e.target.value;
                      onUpdateElement(selectedElement.id, {
                        diagram_type: newType,
                        diagramType: newType,
                        data: { ...(selectedElement.data || {}), diagram_type: newType, diagramType: newType }
                      });
                    }}
                    className="prop-select"
                  >
                    <option value="flowchart">➔ Process Flowchart</option>
                    <option value="timeline">📅 Timeline & Milestones</option>
                    <option value="architecture">🏛️ System Architecture Stack</option>
                    <option value="cycle">🔁 Circular Cycle / Loop</option>
                    <option value="pyramid">🔺 Pyramid Hierarchy</option>
                    <option value="funnel">🔻 Conversion Funnel</option>
                    <option value="mindmap">🧠 Mindmap & Concept Network</option>
                    <option value="quadrant">🧭 2x2 Matrix Quadrants</option>
                    <option value="io_cards">⚡ Input - Process - Output</option>
                  </select>
                </div>

                <div className="prop-group">
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 4 }}>
                    <label className="group-label">STEPS / PHASES (COMMA SEPARATED)</label>
                    <button
                      className="icon-action-btn"
                      onClick={() => onAiRefine?.("diagram")}
                      title="Refine diagram steps using AI"
                      style={{ fontSize: 11, display: "inline-flex", alignItems: "center", gap: 3, padding: "2px 8px", background: "rgba(192, 132, 252, 0.15)", color: "#c084fc", border: "1px solid rgba(192, 132, 252, 0.3)", borderRadius: 6 }}
                    >
                      <Sparkles size={11} />
                      <span>AI Diagram</span>
                    </button>
                  </div>
                  <input
                    type="text"
                    value={(() => {
                      const rawList = (
                        (selectedElement.phases && selectedElement.phases.length ? selectedElement.phases : null) ||
                        (selectedElement.steps && selectedElement.steps.length ? selectedElement.steps : null) ||
                        (selectedElement.items && selectedElement.items.length ? selectedElement.items : null) ||
                        (selectedElement.data?.phases && selectedElement.data?.phases.length ? selectedElement.data.phases : null) ||
                        (selectedElement.data?.steps && selectedElement.data?.steps.length ? selectedElement.data.steps : null) ||
                        (selectedElement.data?.items && selectedElement.data?.items.length ? selectedElement.data.items : null)
                      );
                      if (Array.isArray(rawList) && rawList.length > 0) {
                        return rawList.map(p => typeof p === "string" ? p : (p.title || p.name || p.label || p.phase || p)).join(", ");
                      }
                      const diagram = selectedElement.diagram || selectedElement.data?.diagram || selectedElement.content || selectedElement.text;
                      if (typeof diagram === "string" && diagram.trim()) return diagram;
                      return "Q1 Architecture, Q2 Pilot Launch, Q3 Scale & Deploy, Q4 Optimization";
                    })()}
                    onChange={(e) => {
                      const val = e.target.value;
                      const names = val.split(",").map(s => s.trim());
                      const updated = names.map((name, i) => ({
                        phase: `Phase ${i + 1}`,
                        title: name || `Phase ${i + 1}`,
                        status: i === 0 ? "COMPLETED" : i === 1 ? "IN PROGRESS" : "PLANNED"
                      }));
                      onUpdateElement(selectedElement.id, {
                        phases: updated,
                        steps: updated,
                        items: updated,
                        diagram: val,
                        data: {
                          ...(selectedElement.data || {}),
                          phases: updated,
                          steps: updated,
                          items: updated,
                          diagram: val
                        }
                      });
                    }}
                    className="prop-text-input"
                    placeholder="Phase 1, Phase 2, Phase 3, Phase 4..."
                  />
                </div>
              </>
            )}

            {/* --------------------------------------------- */}
            {/* CALLOUT CARD PROPERTIES PANEL                 */}
            {/* --------------------------------------------- */}
            {selectedElement.type === "callout" && (
              <>
                <div className="prop-group">
                  <label className="group-label">CALLOUT TITLE</label>
                  <input
                    type="text"
                    value={selectedElement.title || selectedElement.data?.title || "KEY STRATEGIC TAKEAWAY"}
                    onChange={(e) => {
                      onUpdateElement(selectedElement.id, {
                        title: e.target.value,
                        data: { ...(selectedElement.data || {}), title: e.target.value }
                      });
                    }}
                    className="prop-text-input"
                  />
                </div>

                <div className="prop-group">
                  <label className="group-label">CALLOUT NARRATIVE / TEXT</label>
                  <textarea
                    value={selectedElement.text || selectedElement.content || selectedElement.data?.text || ""}
                    onChange={(e) => {
                      onUpdateElement(selectedElement.id, {
                        text: e.target.value,
                        content: e.target.value,
                        data: { ...(selectedElement.data || {}), text: e.target.value }
                      });
                    }}
                    className="prop-textarea"
                    rows={3}
                  />
                </div>

                <div className="prop-group">
                  <label className="group-label">ICON EMOJI</label>
                  <select
                    value={selectedElement.icon || selectedElement.data?.icon || "💡"}
                    onChange={(e) => {
                      onUpdateElement(selectedElement.id, {
                        icon: e.target.value,
                        data: { ...(selectedElement.data || {}), icon: e.target.value }
                      });
                    }}
                    className="prop-select"
                  >
                    <option value="💡">💡 Lightbulb / Insight</option>
                    <option value="🚀">🚀 Rocket / Launch</option>
                    <option value="⚡">⚡ Lightning / Speed</option>
                    <option value="📌">📌 Pin / Highlight</option>
                    <option value="🎯">🎯 Target / Goal</option>
                    <option value="✅">✅ Check / Success</option>
                  </select>
                </div>
              </>
            )}

            {/* --------------------------------------------- */}
            {/* KPI GRID PROPERTIES PANEL                     */}
            {/* --------------------------------------------- */}
            {selectedElement.type === "kpi_grid" && (
              <>
                <div className="prop-group">
                  <label className="group-label">KPI TITLE</label>
                  <input
                    type="text"
                    value={selectedElement.title || selectedElement.data?.title || "Key Metrics"}
                    onChange={(e) => {
                      onUpdateElement(selectedElement.id, {
                        title: e.target.value,
                        data: { ...(selectedElement.data || {}), title: e.target.value }
                      });
                    }}
                    className="prop-text-input"
                  />
                </div>
              </>
            )}

            {/* --------------------------------------------- */}
            {/* PROS & CONS PROPERTIES PANEL                  */}
            {/* --------------------------------------------- */}
            {selectedElement.type === "pros_cons" && (
              <>
                <div className="prop-group">
                  <label className="group-label">PROS / STRENGTHS (ONE PER LINE)</label>
                  <textarea
                    value={(selectedElement.pros || selectedElement.data?.pros || []).join("\n")}
                    onChange={(e) => {
                      const parsed = e.target.value.split("\n").filter(Boolean);
                      onUpdateElement(selectedElement.id, {
                        pros: parsed,
                        data: { ...(selectedElement.data || {}), pros: parsed }
                      });
                    }}
                    className="prop-textarea"
                    rows={3}
                  />
                </div>

                <div className="prop-group">
                  <label className="group-label">CONS / CHALLENGES (ONE PER LINE)</label>
                  <textarea
                    value={(selectedElement.cons || selectedElement.data?.cons || []).join("\n")}
                    onChange={(e) => {
                      const parsed = e.target.value.split("\n").filter(Boolean);
                      onUpdateElement(selectedElement.id, {
                        cons: parsed,
                        data: { ...(selectedElement.data || {}), cons: parsed }
                      });
                    }}
                    className="prop-textarea"
                    rows={3}
                  />
                </div>
              </>
            )}

            {/* --------------------------------------------- */}
            {/* --------------------------------------------- */}
            {/* CODE BLOCK PROPERTIES PANEL (UPGRADED)        */}
            {/* --------------------------------------------- */}
            {selectedElement.type === "code_block" && (
              <>
                {/* 1. APPEARANCE ACCORDION */}
                <div className="accordion-section">
                  <div className="accordion-header" onClick={() => toggleAccordion("codeAppearance")}>
                    <span className="accordion-title" style={{ display: "flex", alignItems: "center", gap: 6 }}>
                      <Palette size={13} style={{ color: "#c084fc" }} />
                      <span>APPEARANCE</span>
                    </span>
                    <button className="accordion-icon-btn" type="button">
                      {accordionState.codeAppearance ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
                    </button>
                  </div>
                  {accordionState.codeAppearance && (
                    <div className="accordion-content-body">
                      {/* COLORS: Text, Background, Border */}
                      <div className="prop-group" style={{ marginBottom: 10 }}>
                        <span style={{ fontSize: 10, color: "#cbd5e1", fontWeight: 700, textTransform: "uppercase", display: "block", marginBottom: 6 }}>
                          Colors & Fill
                        </span>
                        
                        {/* Text Color */}
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 6 }}>
                          <span style={{ fontSize: 11, color: "#94a3b8" }}>Text / Syntax</span>
                          <div className="color-picker-row" style={{ width: "135px" }}>
                            <input
                              type="color"
                              value={selectedElement.color || selectedElement.text_color || selectedElement.data?.color || "#38bdf8"}
                              onChange={(e) => {
                                const val = e.target.value;
                                onUpdateElement(selectedElement.id, {
                                  color: val,
                                  text_color: val,
                                  data: { ...(selectedElement.data || {}), color: val, text_color: val }
                                });
                              }}
                              className="prop-color-input"
                            />
                            <input
                              type="text"
                              value={selectedElement.color || selectedElement.text_color || selectedElement.data?.color || "#38bdf8"}
                              onChange={(e) => {
                                const val = e.target.value;
                                onUpdateElement(selectedElement.id, {
                                  color: val,
                                  text_color: val,
                                  data: { ...(selectedElement.data || {}), color: val, text_color: val }
                                });
                              }}
                              className="prop-text-input"
                              style={{ fontSize: 11, padding: "3px 6px" }}
                            />
                          </div>
                        </div>

                        {/* Background Color */}
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 6 }}>
                          <span style={{ fontSize: 11, color: "#94a3b8" }}>Background</span>
                          <div className="color-picker-row" style={{ width: "135px" }}>
                            <input
                              type="color"
                              value={selectedElement.bg_color || selectedElement.fill_color || selectedElement.data?.bg_color || "#090d16"}
                              onChange={(e) => {
                                const val = e.target.value;
                                onUpdateElement(selectedElement.id, {
                                  bg_color: val,
                                  fill_color: val,
                                  data: { ...(selectedElement.data || {}), bg_color: val, fill_color: val }
                                });
                              }}
                              className="prop-color-input"
                            />
                            <input
                              type="text"
                              value={selectedElement.bg_color || selectedElement.fill_color || selectedElement.data?.bg_color || "#090d16"}
                              onChange={(e) => {
                                const val = e.target.value;
                                onUpdateElement(selectedElement.id, {
                                  bg_color: val,
                                  fill_color: val,
                                  data: { ...(selectedElement.data || {}), bg_color: val, fill_color: val }
                                });
                              }}
                              className="prop-text-input"
                              style={{ fontSize: 11, padding: "3px 6px" }}
                            />
                          </div>
                        </div>

                        {/* Border Color */}
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                          <span style={{ fontSize: 11, color: "#94a3b8" }}>Border Color</span>
                          <div className="color-picker-row" style={{ width: "135px" }}>
                            <input
                              type="color"
                              value={selectedElement.borderColor || selectedElement.stroke_color || selectedElement.data?.borderColor || "#334155"}
                              onChange={(e) => {
                                const val = e.target.value;
                                onUpdateElement(selectedElement.id, {
                                  borderColor: val,
                                  stroke_color: val,
                                  data: { ...(selectedElement.data || {}), borderColor: val, stroke_color: val }
                                });
                              }}
                              className="prop-color-input"
                            />
                            <input
                              type="text"
                              value={selectedElement.borderColor || selectedElement.stroke_color || selectedElement.data?.borderColor || "#334155"}
                              onChange={(e) => {
                                const val = e.target.value;
                                onUpdateElement(selectedElement.id, {
                                  borderColor: val,
                                  stroke_color: val,
                                  data: { ...(selectedElement.data || {}), borderColor: val, stroke_color: val }
                                });
                              }}
                              className="prop-text-input"
                              style={{ fontSize: 11, padding: "3px 6px" }}
                            />
                          </div>
                        </div>
                      </div>

                      {/* BORDER WIDTH & RADIUS */}
                      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8, marginTop: 8 }}>
                        <div className="prop-group">
                          <label className="group-label">BORDER WIDTH</label>
                          <div className="prop-stepper-box">
                            <button
                              type="button"
                              className="prop-stepper-btn"
                              onClick={() => {
                                const cur = Number(selectedElement.borderWidth !== undefined ? selectedElement.borderWidth : 1);
                                onUpdateElement(selectedElement.id, { borderWidth: Math.max(0, cur - 1) });
                              }}
                            >
                              -
                            </button>
                            <input
                              type="number"
                              min="0"
                              max="12"
                              value={selectedElement.borderWidth !== undefined ? selectedElement.borderWidth : 1}
                              onChange={(e) => onUpdateElement(selectedElement.id, { borderWidth: Math.max(0, Math.min(12, Number(e.target.value))) })}
                              className="prop-stepper-input"
                            />
                            <button
                              type="button"
                              className="prop-stepper-btn"
                              onClick={() => {
                                const cur = Number(selectedElement.borderWidth !== undefined ? selectedElement.borderWidth : 1);
                                onUpdateElement(selectedElement.id, { borderWidth: Math.min(12, cur + 1) });
                              }}
                            >
                              +
                            </button>
                          </div>
                          <div style={{ display: "flex", gap: 3, marginTop: 4 }}>
                            {[0, 1, 2, 4].map((bw) => (
                              <button
                                key={bw}
                                type="button"
                                className={`top-btn secondary-btn ${(selectedElement.borderWidth !== undefined ? selectedElement.borderWidth : 1) === bw ? "active" : ""}`}
                                style={{ flex: 1, padding: "2px 0", fontSize: 9.5 }}
                                onClick={() => onUpdateElement(selectedElement.id, { borderWidth: bw })}
                              >
                                {bw}px
                              </button>
                            ))}
                          </div>
                        </div>

                        <div className="prop-group">
                          <label className="group-label">BORDER RADIUS</label>
                          <div className="prop-stepper-box">
                            <button
                              type="button"
                              className="prop-stepper-btn"
                              onClick={() => {
                                const cur = Number(selectedElement.borderRadius !== undefined ? selectedElement.borderRadius : 8);
                                onUpdateElement(selectedElement.id, { borderRadius: Math.max(0, cur - 2) });
                              }}
                            >
                              -
                            </button>
                            <input
                              type="number"
                              min="0"
                              max="32"
                              value={selectedElement.borderRadius !== undefined ? selectedElement.borderRadius : 8}
                              onChange={(e) => onUpdateElement(selectedElement.id, { borderRadius: Math.max(0, Math.min(32, Number(e.target.value))) })}
                              className="prop-stepper-input"
                            />
                            <button
                              type="button"
                              className="prop-stepper-btn"
                              onClick={() => {
                                const cur = Number(selectedElement.borderRadius !== undefined ? selectedElement.borderRadius : 8);
                                onUpdateElement(selectedElement.id, { borderRadius: Math.min(32, cur + 2) });
                              }}
                            >
                              +
                            </button>
                          </div>
                          <div style={{ display: "flex", gap: 3, marginTop: 4 }}>
                            {[0, 4, 8, 12].map((br) => (
                              <button
                                key={br}
                                type="button"
                                className={`top-btn secondary-btn ${(selectedElement.borderRadius !== undefined ? selectedElement.borderRadius : 8) === br ? "active" : ""}`}
                                style={{ flex: 1, padding: "2px 0", fontSize: 9.5 }}
                                onClick={() => onUpdateElement(selectedElement.id, { borderRadius: br })}
                              >
                                {br}px
                              </button>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                {/* 2. CODE CONTENT ACCORDION */}
                <div className="accordion-section">
                  <div className="accordion-header" onClick={() => toggleAccordion("codeContent")}>
                    <span className="accordion-title" style={{ display: "flex", alignItems: "center", gap: 6 }}>
                      <FileCode size={13} style={{ color: "#38bdf8" }} />
                      <span>CODE CONTENT</span>
                    </span>
                    <button className="accordion-icon-btn" type="button">
                      {accordionState.codeContent ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
                    </button>
                  </div>
                  {accordionState.codeContent && (
                    <div className="accordion-content-body">
                      {/* FILE TITLE */}
                      <div className="prop-group" style={{ marginBottom: 8 }}>
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 4 }}>
                          <label className="group-label">FILE TITLE / TAB NAME</label>
                          <span style={{ fontSize: 10, color: "#64748b" }}>Header label</span>
                        </div>
                        <input
                          type="text"
                          value={selectedElement.title || selectedElement.data?.title || "api_router.py"}
                          onChange={(e) => {
                            const val = e.target.value;
                            onUpdateElement(selectedElement.id, {
                              title: val,
                              data: { ...(selectedElement.data || {}), title: val }
                            });
                          }}
                          className="prop-text-input"
                          placeholder="e.g. server.py, script.js"
                        />
                      </div>

                      {/* LANGUAGE */}
                      <div className="prop-group" style={{ marginBottom: 8 }}>
                        <label className="group-label">LANGUAGE</label>
                        <select
                          value={selectedElement.language || selectedElement.data?.language || "python"}
                          onChange={(e) => {
                            const val = e.target.value;
                            onUpdateElement(selectedElement.id, {
                              language: val,
                              data: { ...(selectedElement.data || {}), language: val }
                            });
                          }}
                          className="prop-select"
                        >
                          <option value="python">Python (.py)</option>
                          <option value="javascript">JavaScript / TypeScript (.js, .ts)</option>
                          <option value="json">JSON (.json)</option>
                          <option value="sql">SQL Query (.sql)</option>
                          <option value="html">HTML / XML (.html)</option>
                          <option value="css">CSS / SCSS (.css)</option>
                          <option value="bash">Bash / Shell (.sh)</option>
                          <option value="rust">Rust (.rs)</option>
                          <option value="go">Go (.go)</option>
                          <option value="java">Java (.java)</option>
                          <option value="cpp">C / C++ (.c, .cpp)</option>
                          <option value="yaml">YAML (.yaml, .yml)</option>
                          <option value="markdown">Markdown (.md)</option>
                        </select>
                      </div>

                      {/* CODE SNIPPET */}
                      <div className="prop-group">
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 4 }}>
                          <label className="group-label">CODE SNIPPET</label>
                          <span style={{ fontSize: 10, color: "#64748b" }}>Resizable</span>
                        </div>
                        <textarea
                          value={selectedElement.code || selectedElement.content || selectedElement.data?.code || ""}
                          onChange={(e) => {
                            const val = e.target.value;
                            onUpdateElement(selectedElement.id, {
                              code: val,
                              content: val,
                              text: val,
                              data: { ...(selectedElement.data || {}), code: val, content: val }
                            });
                          }}
                          className="code-editor-textarea"
                          rows={6}
                          placeholder="// Type or paste your code snippet here..."
                          spellCheck={false}
                        />
                      </div>
                    </div>
                  )}
                </div>

                {/* 3. TYPOGRAPHY ACCORDION */}
                <div className="accordion-section">
                  <div className="accordion-header" onClick={() => toggleAccordion("codeTypography")}>
                    <span className="accordion-title" style={{ display: "flex", alignItems: "center", gap: 6 }}>
                      <Type size={13} style={{ color: "#34d399" }} />
                      <span>TYPOGRAPHY</span>
                    </span>
                    <button className="accordion-icon-btn" type="button">
                      {accordionState.codeTypography ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
                    </button>
                  </div>
                  {accordionState.codeTypography && (
                    <div className="accordion-content-body">
                      {/* FONT FAMILY */}
                      <div className="prop-group" style={{ marginBottom: 8 }}>
                        <label className="group-label">FONT FAMILY</label>
                        <select
                          value={selectedElement.fontFamily || "'JetBrains Mono', Consolas, monospace"}
                          onChange={(e) => onUpdateElement(selectedElement.id, { fontFamily: e.target.value })}
                          className="prop-select"
                        >
                          <option value="'JetBrains Mono', monospace">JetBrains Mono (Default)</option>
                          <option value="'Fira Code', monospace">Fira Code</option>
                          <option value="'Source Code Pro', monospace">Source Code Pro</option>
                          <option value="Consolas, 'Courier New', monospace">Consolas / Courier</option>
                          <option value="monospace">System Monospace</option>
                        </select>
                      </div>

                      {/* FONT SIZE & WEIGHT */}
                      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8, marginBottom: 8 }}>
                        <div className="prop-group">
                          <label className="group-label">FONT SIZE (PX)</label>
                          <div className="prop-stepper-box">
                            <button
                              type="button"
                              className="prop-stepper-btn"
                              onClick={() => {
                                const cur = Number(selectedElement.fontSize || 12);
                                onUpdateElement(selectedElement.id, { fontSize: Math.max(9, cur - 1) });
                              }}
                            >
                              -
                            </button>
                            <input
                              type="number"
                              min="9"
                              max="28"
                              value={selectedElement.fontSize || 12}
                              onChange={(e) => onUpdateElement(selectedElement.id, { fontSize: Math.max(9, Math.min(28, Number(e.target.value))) })}
                              className="prop-stepper-input"
                            />
                            <button
                              type="button"
                              className="prop-stepper-btn"
                              onClick={() => {
                                const cur = Number(selectedElement.fontSize || 12);
                                onUpdateElement(selectedElement.id, { fontSize: Math.min(28, cur + 1) });
                              }}
                            >
                              +
                            </button>
                          </div>
                        </div>

                        <div className="prop-group">
                          <label className="group-label">FONT WEIGHT</label>
                          <select
                            value={selectedElement.fontWeight || "normal"}
                            onChange={(e) => onUpdateElement(selectedElement.id, { fontWeight: e.target.value })}
                            className="prop-select"
                          >
                            <option value="normal">400 Regular</option>
                            <option value="500">500 Medium</option>
                            <option value="600">600 SemiBold</option>
                            <option value="bold">700 Bold</option>
                          </select>
                        </div>
                      </div>

                      {/* LINE HEIGHT & TEXT ALIGN */}
                      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
                        <div className="prop-group">
                          <label className="group-label">LINE HEIGHT</label>
                          <select
                            value={selectedElement.lineHeight || 1.5}
                            onChange={(e) => onUpdateElement(selectedElement.id, { lineHeight: Number(e.target.value) })}
                            className="prop-select"
                          >
                            <option value={1.2}>1.2 Tight</option>
                            <option value={1.4}>1.4 Normal</option>
                            <option value={1.5}>1.5 Relaxed</option>
                            <option value={1.7}>1.7 Spaced</option>
                            <option value={2.0}>2.0 Double</option>
                          </select>
                        </div>

                        <div className="prop-group">
                          <label className="group-label">ALIGNMENT</label>
                          <div style={{ display: "flex", gap: 4 }}>
                            <button
                              type="button"
                              className={`top-btn secondary-btn ${(selectedElement.align || "left") === "left" ? "active" : ""}`}
                              style={{ flex: 1, padding: "5px 0" }}
                              onClick={() => onUpdateElement(selectedElement.id, { align: "left" })}
                              title="Align Left"
                            >
                              <AlignLeft size={13} />
                            </button>
                            <button
                              type="button"
                              className={`top-btn secondary-btn ${selectedElement.align === "center" ? "active" : ""}`}
                              style={{ flex: 1, padding: "5px 0" }}
                              onClick={() => onUpdateElement(selectedElement.id, { align: "center" })}
                              title="Align Center"
                            >
                              <AlignCenter size={13} />
                            </button>
                            <button
                              type="button"
                              className={`top-btn secondary-btn ${selectedElement.align === "right" ? "active" : ""}`}
                              style={{ flex: 1, padding: "5px 0" }}
                              onClick={() => onUpdateElement(selectedElement.id, { align: "right" })}
                              title="Align Right"
                            >
                              <AlignRight size={13} />
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                {/* 4. CODE FORMATTING ACCORDION */}
                <div className="accordion-section">
                  <div className="accordion-header" onClick={() => toggleAccordion("codeFormatting")}>
                    <span className="accordion-title" style={{ display: "flex", alignItems: "center", gap: 6 }}>
                      <WrapText size={13} style={{ color: "#fbbf24" }} />
                      <span>CODE FORMATTING</span>
                    </span>
                    <button className="accordion-icon-btn" type="button">
                      {accordionState.codeFormatting ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
                    </button>
                  </div>
                  {accordionState.codeFormatting && (
                    <div className="accordion-content-body">
                      {/* TOGGLES: Line Numbers & Word Wrap */}
                      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8, marginBottom: 10 }}>
                        <div
                          className={`prop-toggle-card ${selectedElement.showLineNumbers !== false ? "active" : ""}`}
                          onClick={() => {
                            const cur = selectedElement.showLineNumbers !== false;
                            onUpdateElement(selectedElement.id, { showLineNumbers: !cur });
                          }}
                          title="Toggle line numbers gutter"
                        >
                          <span style={{ fontSize: 11, display: "flex", alignItems: "center", gap: 4 }}>
                            <Hash size={12} /> Line Numbers
                          </span>
                          <span style={{ fontSize: 10, fontWeight: 700, color: selectedElement.showLineNumbers !== false ? "#38bdf8" : "#64748b" }}>
                            {selectedElement.showLineNumbers !== false ? "ON" : "OFF"}
                          </span>
                        </div>

                        <div
                          className={`prop-toggle-card ${selectedElement.wordWrap ? "active" : ""}`}
                          onClick={() => {
                            const cur = Boolean(selectedElement.wordWrap);
                            onUpdateElement(selectedElement.id, { wordWrap: !cur });
                          }}
                          title="Toggle word wrapping"
                        >
                          <span style={{ fontSize: 11, display: "flex", alignItems: "center", gap: 4 }}>
                            <WrapText size={12} /> Word Wrap
                          </span>
                          <span style={{ fontSize: 10, fontWeight: 700, color: selectedElement.wordWrap ? "#38bdf8" : "#64748b" }}>
                            {selectedElement.wordWrap ? "ON" : "OFF"}
                          </span>
                        </div>
                      </div>

                      {/* CODE PADDING */}
                      <div className="prop-group" style={{ marginBottom: 10 }}>
                        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
                          <label className="group-label">INNER CODE PADDING</label>
                          <span style={{ fontSize: 11, color: "#94a3b8" }}>{selectedElement.codePadding || 10}px</span>
                        </div>
                        <input
                          type="range"
                          min="4"
                          max="28"
                          value={selectedElement.codePadding || 10}
                          onChange={(e) => onUpdateElement(selectedElement.id, { codePadding: Number(e.target.value) })}
                          className="prop-range-input"
                        />
                      </div>

                      {/* SYNTAX THEME ACCENT PRESETS */}
                      <div className="prop-group">
                        <label className="group-label">SYNTAX ACCENT PRESET</label>
                        <div style={{ display: "grid", gridTemplateColumns: "repeat(5, 1fr)", gap: 4 }}>
                          {[
                            { name: "Cyan", color: "#38bdf8", bg: "#060910" },
                            { name: "Green", color: "#34d399", bg: "#051510" },
                            { name: "Amber", color: "#fbbf24", bg: "#171205" },
                            { name: "Purple", color: "#c084fc", bg: "#13091e" },
                            { name: "White", color: "#f8fafc", bg: "#090d16" }
                          ].map((t) => (
                            <button
                              key={t.name}
                              type="button"
                              className="syntax-theme-btn"
                              style={{
                                background: t.bg,
                                color: t.color,
                                border: (selectedElement.color || "#38bdf8") === t.color ? `1.5px solid ${t.color}` : "1px solid rgba(255, 255, 255, 0.12)"
                              }}
                              onClick={() => {
                                onUpdateElement(selectedElement.id, {
                                  color: t.color,
                                  text_color: t.color,
                                  bg_color: t.bg,
                                  data: { ...(selectedElement.data || {}), color: t.color, text_color: t.color, bg_color: t.bg }
                                });
                              }}
                              title={`${t.name} theme`}
                            >
                              <span style={{ width: 6, height: 6, borderRadius: "50%", background: t.color }} />
                              <span>{t.name}</span>
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                {/* 5. POSITION & SIZE ACCORDION */}
                <div className="accordion-section">
                  <div className="accordion-header" onClick={() => toggleAccordion("codePosition")}>
                    <span className="accordion-title" style={{ display: "flex", alignItems: "center", gap: 6 }}>
                      <Sliders size={13} style={{ color: "#38bdf8" }} />
                      <span>POSITION & SIZE (%)</span>
                    </span>
                    <button className="accordion-icon-btn" type="button">
                      {accordionState.codePosition ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
                    </button>
                  </div>
                  {accordionState.codePosition && (
                    <div className="accordion-content-body">
                      {/* 2X2 GRID FOR X, Y, W, H */}
                      <div className="prop-grid-2x2" style={{ marginBottom: 10 }}>
                        <div className="prop-mini-field">
                          <span>X %</span>
                          <div className="prop-stepper-box">
                            <button
                              type="button"
                              className="prop-stepper-btn"
                              onClick={() => {
                                const cur = Number(selectedElement.x || 0);
                                onUpdateElement(selectedElement.id, { x: Math.max(0, cur - 1) });
                              }}
                            >
                              -
                            </button>
                            <input
                              type="number"
                              min="0"
                              max="100"
                              value={Math.round(selectedElement.x || 0)}
                              onChange={(e) => onUpdateElement(selectedElement.id, { x: Math.max(0, Math.min(100, Number(e.target.value))) })}
                              className="prop-stepper-input"
                            />
                            <button
                              type="button"
                              className="prop-stepper-btn"
                              onClick={() => {
                                const cur = Number(selectedElement.x || 0);
                                onUpdateElement(selectedElement.id, { x: Math.min(100, cur + 1) });
                              }}
                            >
                              +
                            </button>
                          </div>
                        </div>

                        <div className="prop-mini-field">
                          <span>Y %</span>
                          <div className="prop-stepper-box">
                            <button
                              type="button"
                              className="prop-stepper-btn"
                              onClick={() => {
                                const cur = Number(selectedElement.y || 0);
                                onUpdateElement(selectedElement.id, { y: Math.max(0, cur - 1) });
                              }}
                            >
                              -
                            </button>
                            <input
                              type="number"
                              min="0"
                              max="100"
                              value={Math.round(selectedElement.y || 0)}
                              onChange={(e) => onUpdateElement(selectedElement.id, { y: Math.max(0, Math.min(100, Number(e.target.value))) })}
                              className="prop-stepper-input"
                            />
                            <button
                              type="button"
                              className="prop-stepper-btn"
                              onClick={() => {
                                const cur = Number(selectedElement.y || 0);
                                onUpdateElement(selectedElement.id, { y: Math.min(100, cur + 1) });
                              }}
                            >
                              +
                            </button>
                          </div>
                        </div>

                        <div className="prop-mini-field">
                          <span>W %</span>
                          <div className="prop-stepper-box">
                            <button
                              type="button"
                              className="prop-stepper-btn"
                              onClick={() => {
                                const cur = Number(selectedElement.width || 40);
                                onUpdateElement(selectedElement.id, { width: Math.max(10, cur - 2), customWidth: true });
                              }}
                            >
                              -
                            </button>
                            <input
                              type="number"
                              min="10"
                              max="100"
                              value={Math.round(selectedElement.width || 40)}
                              onChange={(e) => onUpdateElement(selectedElement.id, { width: Math.max(10, Math.min(100, Number(e.target.value))), customWidth: true })}
                              className="prop-stepper-input"
                            />
                            <button
                              type="button"
                              className="prop-stepper-btn"
                              onClick={() => {
                                const cur = Number(selectedElement.width || 40);
                                onUpdateElement(selectedElement.id, { width: Math.min(100, cur + 2), customWidth: true });
                              }}
                            >
                              +
                            </button>
                          </div>
                        </div>

                        <div className="prop-mini-field">
                          <span>H %</span>
                          <div className="prop-stepper-box">
                            <button
                              type="button"
                              className="prop-stepper-btn"
                              onClick={() => {
                                const cur = Number(selectedElement.height || 25);
                                onUpdateElement(selectedElement.id, { height: Math.max(8, cur - 2), customHeight: true });
                              }}
                            >
                              -
                            </button>
                            <input
                              type="number"
                              min="8"
                              max="100"
                              value={Math.round(selectedElement.height || 25)}
                              onChange={(e) => onUpdateElement(selectedElement.id, { height: Math.max(8, Math.min(100, Number(e.target.value))), customHeight: true })}
                              className="prop-stepper-input"
                            />
                            <button
                              type="button"
                              className="prop-stepper-btn"
                              onClick={() => {
                                const cur = Number(selectedElement.height || 25);
                                onUpdateElement(selectedElement.id, { height: Math.min(100, cur + 2), customHeight: true });
                              }}
                            >
                              +
                            </button>
                          </div>
                        </div>
                      </div>

                      {/* QUICK CANVAS ALIGNMENT BUTTONS */}
                      <div className="prop-group">
                        <label className="group-label">QUICK CANVAS ALIGN</label>
                        <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 4 }}>
                          <button
                            type="button"
                            className="top-btn secondary-btn"
                            style={{ padding: "4px 2px", fontSize: 10 }}
                            onClick={() => onUpdateElement(selectedElement.id, { x: 6 })}
                          >
                            Left
                          </button>
                          <button
                            type="button"
                            className="top-btn secondary-btn"
                            style={{ padding: "4px 2px", fontSize: 10 }}
                            onClick={() => onUpdateElement(selectedElement.id, { x: Math.max(0, Math.round(50 - (selectedElement.width || 40) / 2)) })}
                          >
                            Center
                          </button>
                          <button
                            type="button"
                            className="top-btn secondary-btn"
                            style={{ padding: "4px 2px", fontSize: 10 }}
                            onClick={() => onUpdateElement(selectedElement.id, { x: Math.max(0, Math.round(94 - (selectedElement.width || 40))) })}
                          >
                            Right
                          </button>
                          <button
                            type="button"
                            className="top-btn secondary-btn"
                            style={{ padding: "4px 2px", fontSize: 10 }}
                            onClick={() => onUpdateElement(selectedElement.id, { y: Math.max(0, Math.round(50 - (selectedElement.height || 25) / 2)) })}
                          >
                            Middle
                          </button>
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                {/* 6. ADVANCED & LAYERING ACCORDION */}
                <div className="accordion-section">
                  <div className="accordion-header" onClick={() => toggleAccordion("codeAdvanced")}>
                    <span className="accordion-title" style={{ display: "flex", alignItems: "center", gap: 6 }}>
                      <Layers size={13} style={{ color: "#a855f7" }} />
                      <span>ADVANCED & EFFECTS</span>
                    </span>
                    <button className="accordion-icon-btn" type="button">
                      {accordionState.codeAdvanced ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
                    </button>
                  </div>
                  {accordionState.codeAdvanced && (
                    <div className="accordion-content-body">
                      {/* OPACITY */}
                      <div className="prop-group" style={{ marginBottom: 10 }}>
                        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
                          <label className="group-label">OPACITY</label>
                          <span style={{ fontSize: 11, color: "#94a3b8" }}>{selectedElement.opacity !== undefined ? selectedElement.opacity : 100}%</span>
                        </div>
                        <input
                          type="range"
                          min="10"
                          max="100"
                          value={selectedElement.opacity !== undefined ? selectedElement.opacity : 100}
                          onChange={(e) => onUpdateElement(selectedElement.id, { opacity: Number(e.target.value) })}
                          className="prop-range-input"
                        />
                      </div>

                      {/* SHADOW / GLOW */}
                      <div className="prop-group" style={{ marginBottom: 10 }}>
                        <label className="group-label">BOX SHADOW & GLOW</label>
                        <select
                          value={selectedElement.boxShadow || "none"}
                          onChange={(e) => onUpdateElement(selectedElement.id, { boxShadow: e.target.value === "none" ? "" : e.target.value })}
                          className="prop-select"
                        >
                          <option value="none">None</option>
                          <option value="0 8px 24px rgba(0, 0, 0, 0.4)">Subtle Dark Drop</option>
                          <option value="0 0 20px rgba(56, 189, 248, 0.25)">Cyan Neon Glow</option>
                          <option value="0 0 20px rgba(192, 132, 252, 0.25)">Purple Studio Glow</option>
                          <option value="0 14px 36px rgba(0, 0, 0, 0.6)">Deep Float Elevation</option>
                        </select>
                      </div>

                      {/* LOCK ELEMENT */}
                      <div className="prop-group">
                        <div
                          className={`prop-toggle-card ${selectedElement.isLocked ? "active" : ""}`}
                          onClick={() => {
                            const cur = Boolean(selectedElement.isLocked);
                            onUpdateElement(selectedElement.id, { isLocked: !cur });
                          }}
                          title="Lock element in place"
                        >
                          <span style={{ fontSize: 11, display: "flex", alignItems: "center", gap: 5 }}>
                            {selectedElement.isLocked ? <Lock size={13} style={{ color: "#f59e0b" }} /> : <Unlock size={13} />}
                            <span>Lock Element Position</span>
                          </span>
                          <span style={{ fontSize: 10, fontWeight: 700, color: selectedElement.isLocked ? "#f59e0b" : "#64748b" }}>
                            {selectedElement.isLocked ? "LOCKED" : "UNLOCKED"}
                          </span>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </>
            )}

            {/* --------------------------------------------- */}
            {/* SPEAKER CARD PROPERTIES PANEL                 */}
            {/* --------------------------------------------- */}
            {selectedElement.type === "speaker_card" && (
              <>
                <div className="prop-group">
                  <label className="group-label">SPEAKER NAME</label>
                  <input
                    type="text"
                    value={selectedElement.name || selectedElement.data?.name || "Dr. Alex Vance"}
                    onChange={(e) => {
                      onUpdateElement(selectedElement.id, {
                        name: e.target.value,
                        data: { ...(selectedElement.data || {}), name: e.target.value }
                      });
                    }}
                    className="prop-text-input"
                  />
                </div>

                <div className="prop-group">
                  <label className="group-label">SPEAKER ROLE</label>
                  <input
                    type="text"
                    value={selectedElement.role || selectedElement.data?.role || "Chief AI Architect"}
                    onChange={(e) => {
                      onUpdateElement(selectedElement.id, {
                        role: e.target.value,
                        data: { ...(selectedElement.data || {}), role: e.target.value }
                      });
                    }}
                    className="prop-text-input"
                  />
                </div>
              </>
            )}

            {/* --------------------------------------------- */}
            {/* POSITION & SIZE CONTROLS (FOR ALL OTHER ELEMENTS) */}
            {/* --------------------------------------------- */}
            {selectedElement.type !== "code_block" && (
              <div className="accordion-section" style={{ marginTop: 12 }}>
                <div className="accordion-header" onClick={() => toggleAccordion("position")}>
                  <span className="accordion-title">POSITION & SIZE (%)</span>
                  <button className="accordion-icon-btn">
                    {accordionState.position ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
                  </button>
                </div>
                {accordionState.position && (
                <div className="accordion-content-body">
                  <div className="prop-grid-2x2">
                    <div className="prop-mini-field">
                      <span>X %</span>
                      <input
                        type="number"
                        value={selectedElement.x || 0}
                        onChange={(e) => onUpdateElement(selectedElement.id, { x: Number(e.target.value) })}
                      />
                    </div>
                    <div className="prop-mini-field">
                      <span>Y %</span>
                      <input
                        type="number"
                        value={selectedElement.y || 0}
                        onChange={(e) => onUpdateElement(selectedElement.id, { y: Number(e.target.value) })}
                      />
                    </div>
                    <div className="prop-mini-field">
                      <span>W %</span>
                      <input
                        type="number"
                        value={selectedElement.width || 30}
                        onChange={(e) => onUpdateElement(selectedElement.id, { width: Number(e.target.value) })}
                      />
                    </div>
                    <div className="prop-mini-field">
                      <span>H %</span>
                      <input
                        type="number"
                        value={selectedElement.height || 20}
                        onChange={(e) => onUpdateElement(selectedElement.id, { height: Number(e.target.value) })}
                      />
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      )}
      </div>
    </aside>
  );
}
