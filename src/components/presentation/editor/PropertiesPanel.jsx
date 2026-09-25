import React, { useState } from "react";
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
  ChevronRight,
  ChevronDown
} from "lucide-react";
import { LAYOUT_OPTIONS, THEME_OPTIONS, SHAPE_OPTIONS, CHART_TYPES } from "./editorState";

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
  onToggleSidebar
}) {
  const [activeTab, setActiveTab] = useState("edit"); // 'edit' | 'design'
  const [accordionState, setAccordionState] = useState({
    content: true,
    typography: true,
    alignment: false,
    arrange: false,
    spacing: false,
    position: false
  });

  const toggleAccordion = (section) => {
    setAccordionState((prev) => ({ ...prev, [section]: !prev[section] }));
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
        {/* CASE 1: DESIGN TAB ACTIVE -> SLIDE LAYOUT, THEME, BG & FONT */}
        {/* ========================================================= */}
        {activeTab === "design" ? (
          <div className="panel-group-container">
            {/* SLIDE LAYOUT THUMBNAILS */}
            <div className="prop-group">
              <label className="group-label">SLIDE LAYOUT</label>
              <div className="layout-grid-compact">
                {LAYOUT_OPTIONS.map((l) => (
                  <button
                    key={l.id}
                    className={`layout-chip ${slide.layout === l.id ? "active" : ""}`}
                    onClick={() => onUpdateSlide({ layout: l.id })}
                  >
                    <span className="chip-icon">{l.icon}</span>
                    <span className="chip-name">{l.name}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* THEME PRESETS */}
            <div className="prop-group">
              <label className="group-label">THEME PRESET</label>
              <div className="theme-options-grid">
                {THEME_OPTIONS.map((t) => (
                  <button
                    key={t.id}
                    className={`theme-card ${selectedBgPreset === t.id ? "active" : ""}`}
                    onClick={() => onSelectBgPreset?.(t.id)}
                    style={{ background: t.bg }}
                  >
                    <span style={{ color: t.text }}>{t.name}</span>
                    <span className="theme-accent-dot" style={{ background: t.accent }} />
                  </button>
                ))}
              </div>
            </div>

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

            {/* BACKGROUND COLOR PICKER */}
            <div className="prop-group">
              <label className="group-label">SLIDE BACKGROUND COLOR</label>
              <div className="color-picker-row">
                <input
                  type="color"
                  value={slide.bg_color || "#0f172a"}
                  onChange={(e) => onUpdateSlide({ bg_color: e.target.value, bg_gradient_start: e.target.value })}
                  className="prop-color-input"
                />
                <input
                  type="text"
                  value={slide.bg_color || "#0f172a"}
                  onChange={(e) => onUpdateSlide({ bg_color: e.target.value, bg_gradient_start: e.target.value })}
                  className="prop-text-input"
                />
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

            {/* COLORS */}
            <div className="prop-group">
              <label className="group-label">ACCENT COLOR</label>
              <div className="color-picker-row">
                <input
                  type="color"
                  value={slide.accent_color || "#c084fc"}
                  onChange={(e) => onUpdateSlide({ accent_color: e.target.value })}
                  className="prop-color-input"
                />
                <input
                  type="text"
                  value={slide.accent_color || "#c084fc"}
                  onChange={(e) => onUpdateSlide({ accent_color: e.target.value })}
                  className="prop-text-input"
                />
              </div>
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
              <span className="element-type-badge">{selectedElement.type.toUpperCase()} ELEMENT</span>
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
              <>
                <div className="prop-group">
                  <label className="group-label">IMAGE URL</label>
                  <input
                    type="text"
                    value={selectedElement.url || ""}
                    onChange={(e) => onUpdateElement(selectedElement.id, { url: e.target.value })}
                    className="prop-text-input"
                  />
                </div>

                <div className="prop-group">
                  <label className="group-label">CAPTION</label>
                  <input
                    type="text"
                    value={selectedElement.caption || ""}
                    onChange={(e) => onUpdateElement(selectedElement.id, { caption: e.target.value })}
                    className="prop-text-input"
                  />
                </div>

                <div className="prop-group">
                  <label className="group-label">BORDER RADIUS (PX)</label>
                  <input
                    type="range"
                    min="0"
                    max="32"
                    value={selectedElement.borderRadius || 8}
                    onChange={(e) => onUpdateElement(selectedElement.id, { borderRadius: Number(e.target.value) })}
                    className="prop-range-input"
                  />
                </div>
              </>
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
            {/* CODE BLOCK PROPERTIES PANEL                   */}
            {/* --------------------------------------------- */}
            {selectedElement.type === "code_block" && (
              <>
                <div className="prop-group">
                  <label className="group-label">FILE TITLE</label>
                  <input
                    type="text"
                    value={selectedElement.title || selectedElement.data?.title || "api_router.py"}
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
                  <label className="group-label">CODE SNIPPET</label>
                  <textarea
                    value={selectedElement.code || selectedElement.data?.code || ""}
                    onChange={(e) => {
                      onUpdateElement(selectedElement.id, {
                        code: e.target.value,
                        data: { ...(selectedElement.data || {}), code: e.target.value }
                      });
                    }}
                    className="prop-textarea"
                    rows={4}
                    style={{ fontFamily: "monospace", fontSize: 11 }}
                  />
                </div>

                <div className="prop-group">
                  <label className="group-label">LANGUAGE</label>
                  <select
                    value={selectedElement.language || selectedElement.data?.language || "python"}
                    onChange={(e) => {
                      onUpdateElement(selectedElement.id, {
                        language: e.target.value,
                        data: { ...(selectedElement.data || {}), language: e.target.value }
                      });
                    }}
                    className="prop-select"
                  >
                    <option value="python">Python</option>
                    <option value="javascript">JavaScript / TS</option>
                    <option value="json">JSON</option>
                    <option value="sql">SQL Query</option>
                    <option value="bash">Bash / Shell</option>
                  </select>
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
            {/* POSITION & SIZE CONTROLS (FOR ALL ELEMENTS)   */}
            {/* --------------------------------------------- */}
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
          </div>
        )}
      </div>
    </aside>
  );
}
