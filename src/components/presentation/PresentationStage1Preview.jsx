import React, { useState } from "react";

export default function PresentationStage1Preview({
  planPreview,
  setPlanPreview,
  onExecuteStage2,
  onBackToSetup,
  loadingGenerate = false,
}) {
  const [editingSlideIdx, setEditingSlideIdx] = useState(null);
  const [editTitle, setEditTitle] = useState("");
  const [editPurpose, setEditPurpose] = useState("");
  const [editType, setEditType] = useState("");

  if (!planPreview) {
    return (
      <div className="card-box" style={{ textAlign: "center", padding: "40px 20px" }}>
        <h3>No Stage 1 Plan Available</h3>
        <p style={{ color: "rgba(255,255,255,0.6)", fontSize: 13 }}>
          Please go back to setup and run Stage 1 Planner.
        </p>
        <button className="btn-ui secondary" onClick={onBackToSetup}>
          ← Back to Setup
        </button>
      </div>
    );
  }

  const {
    topic = "Presentation Deck",
    subtopics = [],
    decided_slide_count = 8,
    audience = "General Audience",
    purpose = "Executive Briefing",
    slide_sequence = [],
    design_system = {},
  } = planPreview;

  // Move slide up / down in sequence
  const handleMoveSlide = (idx, direction) => {
    const targetIdx = idx + direction;
    if (targetIdx < 0 || targetIdx >= slide_sequence.length) return;
    const newSeq = [...slide_sequence];
    const temp = newSeq[idx];
    newSeq[idx] = newSeq[targetIdx];
    newSeq[targetIdx] = temp;

    // Recalculate slide_number
    const updatedSeq = newSeq.map((item, i) => ({ ...item, slide_number: i + 1 }));

    // Also update structured_plan slides if present
    let updatedStructured = planPreview.structured_plan;
    if (updatedStructured && Array.isArray(updatedStructured.slides)) {
      const newSlides = [...updatedStructured.slides];
      const sTemp = newSlides[idx];
      newSlides[idx] = newSlides[targetIdx];
      newSlides[targetIdx] = sTemp;
      updatedStructured = {
        ...updatedStructured,
        slides: newSlides.map((s, i) => ({ ...s, slide_number: i + 1 })),
      };
    }

    setPlanPreview((prev) => ({
      ...prev,
      decided_slide_count: updatedSeq.length,
      slide_sequence: updatedSeq,
      structured_plan: updatedStructured,
    }));
  };

  const handleDeleteSlide = (idx) => {
    if (slide_sequence.length <= 2) {
      alert("A presentation requires at least 2 slides.");
      return;
    }
    const updatedSeq = slide_sequence
      .filter((_, i) => i !== idx)
      .map((item, i) => ({ ...item, slide_number: i + 1 }));

    let updatedStructured = planPreview.structured_plan;
    if (updatedStructured && Array.isArray(updatedStructured.slides)) {
      const newSlides = updatedStructured.slides
        .filter((_, i) => i !== idx)
        .map((s, i) => ({ ...s, slide_number: i + 1 }));
      updatedStructured = { ...updatedStructured, slides: newSlides };
    }

    setPlanPreview((prev) => ({
      ...prev,
      decided_slide_count: updatedSeq.length,
      slide_sequence: updatedSeq,
      structured_plan: updatedStructured,
    }));
  };

  const handleStartEdit = (idx, slide) => {
    setEditingSlideIdx(idx);
    setEditTitle(slide.title || "");
    setEditPurpose(slide.purpose || slide.key_message || "");
    setEditType(slide.type || "concept");
  };

  const handleSaveEdit = (idx) => {
    const updatedSeq = [...slide_sequence];
    updatedSeq[idx] = {
      ...updatedSeq[idx],
      title: editTitle,
      purpose: editPurpose,
      type: editType,
    };

    let updatedStructured = planPreview.structured_plan;
    if (updatedStructured && Array.isArray(updatedStructured.slides) && updatedStructured.slides[idx]) {
      const newSlides = [...updatedStructured.slides];
      newSlides[idx] = {
        ...newSlides[idx],
        content_plan: {
          ...newSlides[idx].content_plan,
          title: editTitle,
          purpose: editPurpose,
          type: editType,
        },
      };
      updatedStructured = { ...updatedStructured, slides: newSlides };
    }

    setPlanPreview((prev) => ({
      ...prev,
      slide_sequence: updatedSeq,
      structured_plan: updatedStructured,
    }));
    setEditingSlideIdx(null);
  };

  const handleAddSlide = () => {
    const newNum = slide_sequence.length + 1;
    const newSlideItem = {
      slide_number: newNum,
      title: `Slide ${newNum}: Custom Topic`,
      type: "concept",
      purpose: "Provide additional strategic insight",
      key_message: "Key takeaway message",
      layout: "two_column",
    };

    const updatedSeq = [...slide_sequence, newSlideItem];

    setPlanPreview((prev) => ({
      ...prev,
      decided_slide_count: updatedSeq.length,
      slide_sequence: updatedSeq,
    }));
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
      {/* STAGE 1 PREVIEW HEADER & TOPIC INFO */}
      <div className="card-box" style={{ background: "rgba(15, 23, 42, 0.9)", border: "1px solid rgba(139,92,246,0.3)" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: 12, marginBottom: 16 }}>
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 6 }}>
              <span style={{ fontSize: 11, fontWeight: 900, color: "#c084fc", letterSpacing: "1px", textTransform: "uppercase" }}>
                STAGE 1 PLANNER OUTPUT • USER PREVIEW
              </span>
              <span style={{ fontSize: 10, background: "rgba(34,197,94,0.2)", color: "#4ade80", padding: "2px 8px", borderRadius: 999, border: "1px solid rgba(34,197,94,0.4)", fontWeight: 700 }}>
                ✓ Plan Ready
              </span>
            </div>
            <h2 style={{ margin: "0 0 6px", fontSize: 22, fontWeight: 800, color: "#ffffff" }}>
              {topic}
            </h2>
            <div style={{ display: "flex", gap: 14, fontSize: 12, color: "rgba(255,255,255,0.7)", flexWrap: "wrap" }}>
              <span>🎯 Audience: <strong>{audience}</strong></span>
              <span>📌 Purpose: <strong>{purpose}</strong></span>
            </div>
          </div>

          {/* DECIDED SLIDE COUNT BADGE & STAGE 2 TRIGGER BUTTON */}
          <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: 8 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 6, background: "rgba(139,92,246,0.15)", padding: "6px 14px", borderRadius: 999, border: "1px solid rgba(139,92,246,0.3)" }}>
              <span style={{ fontSize: 14 }}>📊</span>
              <span style={{ fontSize: 12, fontWeight: 800, color: "#c084fc" }}>
                {decided_slide_count} Slides Decided
              </span>
            </div>

            <div style={{ display: "flex", gap: 8 }}>
              <button className="btn-ui secondary sm" onClick={onBackToSetup}>
                ✏️ Edit Setup
              </button>
              <button
                className="btn-ui primary"
                onClick={onExecuteStage2}
                disabled={loadingGenerate}
                style={{
                  padding: "10px 20px",
                  fontSize: 14,
                  fontWeight: 800,
                  background: "linear-gradient(135deg, #10b981 0%, #059669 100%)",
                  boxShadow: "0 4px 14px rgba(16, 185, 129, 0.4)",
                }}
              >
                {loadingGenerate ? (
                  <span style={{ display: "flex", alignItems: "center", gap: 6 }}>
                    <span className="spinner-sm" /> STAGE 2: Generating PPT...
                  </span>
                ) : (
                  "🚀 STAGE 2: Generate Final PPT"
                )}
              </button>
            </div>
          </div>
        </div>

        {/* SUBTOPICS PILLS LIST */}
        {subtopics && subtopics.length > 0 && (
          <div style={{ marginBottom: 16, borderTop: "1px solid rgba(255,255,255,0.08)", paddingTop: 12 }}>
            <div style={{ fontSize: 11, fontWeight: 700, color: "rgba(255,255,255,0.6)", marginBottom: 8 }}>
              IDENTIFIED SUBTOPICS & KEY DOMAIN MODULES:
            </div>
            <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
              {subtopics.map((sub, i) => (
                <span
                  key={i}
                  style={{
                    fontSize: 11,
                    padding: "4px 10px",
                    borderRadius: 20,
                    background: "rgba(255,255,255,0.06)",
                    border: "1px solid rgba(255,255,255,0.12)",
                    color: "#e2e8f0",
                    fontWeight: 600,
                  }}
                >
                  • {sub}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* GLOBAL DESIGN SYSTEM PALETTE SUMMARY */}
        {design_system && (
          <div style={{ background: "rgba(0,0,0,0.3)", padding: 12, borderRadius: 12, border: "1px solid rgba(255,255,255,0.08)" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 8 }}>
              <div style={{ fontSize: 11, fontWeight: 800, color: "#38bdf8", textTransform: "uppercase" }}>
                🎨 Stage 1 Design System Palette
              </div>
              <span style={{ fontSize: 11, color: "rgba(255,255,255,0.6)" }}>
                Theme: <strong>{design_system.theme_name || "modern_corporate"}</strong> | Font: <strong>{design_system.font_family || "Inter"}</strong>
              </span>
            </div>

            <div style={{ display: "flex", gap: 12, marginTop: 8, alignItems: "center", flexWrap: "wrap" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 11 }}>
                <span style={{ width: 14, height: 14, borderRadius: 4, background: design_system.primary_color || "#0F172A", border: "1px solid #fff" }} />
                <span>Primary ({design_system.primary_color || "#0F172A"})</span>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 11 }}>
                <span style={{ width: 14, height: 14, borderRadius: 4, background: design_system.secondary_color || "#3B82F6", border: "1px solid #fff" }} />
                <span>Secondary ({design_system.secondary_color || "#3B82F6"})</span>
              </div>
              {Array.isArray(design_system.accent_colors) && design_system.accent_colors.map((acc, i) => (
                <div key={i} style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 11 }}>
                  <span style={{ width: 14, height: 14, borderRadius: 4, background: acc, border: "1px solid #fff" }} />
                  <span>Accent {i + 1} ({acc})</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* SLIDE SEQUENCE CARDS LIST */}
      <div className="card-box">
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14 }}>
          <div>
            <h3 style={{ margin: 0, fontSize: 16, fontWeight: 800, color: "#fff" }}>
              📋 Slide Sequence & Visual Layout Architecture
            </h3>
            <p style={{ margin: "2px 0 0", fontSize: 12, color: "rgba(255,255,255,0.6)" }}>
              Review or customize slide order and slide types before executing Stage 2 AI generation.
            </p>
          </div>

          <button className="btn-ui secondary sm" onClick={handleAddSlide}>
            + Add Slide to Sequence
          </button>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          {slide_sequence.map((slide, idx) => {
            const isEditing = editingSlideIdx === idx;
            return (
              <div
                key={idx}
                style={{
                  background: "rgba(255, 255, 255, 0.03)",
                  border: "1px solid rgba(255, 255, 255, 0.08)",
                  borderRadius: 14,
                  padding: 14,
                  transition: "all 0.2s ease",
                }}
              >
                {isEditing ? (
                  <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 140px", gap: 10 }}>
                      <div>
                        <label style={{ fontSize: 11, fontWeight: 700, color: "#c084fc", marginBottom: 4, display: "block" }}>
                          Slide Title
                        </label>
                        <input
                          type="text"
                          value={editTitle}
                          onChange={(e) => setEditTitle(e.target.value)}
                          style={{
                            width: "100%",
                            padding: "8px 10px",
                            borderRadius: 8,
                            background: "rgba(0,0,0,0.5)",
                            border: "1px solid rgba(255,255,255,0.2)",
                            color: "#fff",
                            fontSize: 13,
                          }}
                        />
                      </div>

                      <div>
                        <label style={{ fontSize: 11, fontWeight: 700, color: "#c084fc", marginBottom: 4, display: "block" }}>
                          Slide Type
                        </label>
                        <select
                          value={editType}
                          onChange={(e) => setEditType(e.target.value)}
                          style={{
                            width: "100%",
                            padding: "8px",
                            borderRadius: 8,
                            background: "rgba(15,23,42,0.9)",
                            border: "1px solid rgba(255,255,255,0.2)",
                            color: "#fff",
                            fontSize: 12,
                          }}
                        >
                          <option value="title">Title Cover</option>
                          <option value="agenda">Agenda / Outline</option>
                          <option value="introduction">Introduction</option>
                          <option value="concept">Concept & Pillar</option>
                          <option value="process">Workflow / Diagram</option>
                          <option value="chart">Data Chart</option>
                          <option value="table">Data Table</option>
                          <option value="conclusion">Key Takeaways</option>
                          <option value="thank_you">Closing Slide</option>
                        </select>
                      </div>
                    </div>

                    <div>
                      <label style={{ fontSize: 11, fontWeight: 700, color: "#c084fc", marginBottom: 4, display: "block" }}>
                        Slide Objective / Purpose
                      </label>
                      <input
                        type="text"
                        value={editPurpose}
                        onChange={(e) => setEditPurpose(e.target.value)}
                        style={{
                          width: "100%",
                          padding: "8px 10px",
                          borderRadius: 8,
                          background: "rgba(0,0,0,0.5)",
                          border: "1px solid rgba(255,255,255,0.2)",
                          color: "#fff",
                          fontSize: 12,
                        }}
                      />
                    </div>

                    <div style={{ display: "flex", gap: 8, justifyContent: "flex-end" }}>
                      <button className="btn-ui secondary sm" onClick={() => setEditingSlideIdx(null)}>
                        Cancel
                      </button>
                      <button className="btn-ui primary sm" onClick={() => handleSaveEdit(idx)}>
                        Save Changes
                      </button>
                    </div>
                  </div>
                ) : (
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 10 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 12, flex: 1, minWidth: 240 }}>
                      <span
                        style={{
                          fontSize: 11,
                          fontWeight: 900,
                          color: "#c084fc",
                          background: "rgba(139,92,246,0.15)",
                          padding: "4px 8px",
                          borderRadius: 8,
                          border: "1px solid rgba(139,92,246,0.25)",
                        }}
                      >
                        Slide {slide.slide_number || idx + 1}
                      </span>

                      <div style={{ flex: 1 }}>
                        <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap" }}>
                          <h4 style={{ margin: 0, fontSize: 14, fontWeight: 700, color: "#fff" }}>
                            {slide.title}
                          </h4>
                          <span
                            style={{
                              fontSize: 10,
                              fontWeight: 700,
                              padding: "2px 6px",
                              borderRadius: 4,
                              background: "rgba(56,189,248,0.15)",
                              color: "#38bdf8",
                              border: "1px solid rgba(56,189,248,0.3)",
                              textTransform: "uppercase",
                            }}
                          >
                            {slide.type || "concept"}
                          </span>
                          {slide.layout && (
                            <span
                              style={{
                                fontSize: 10,
                                color: "rgba(255,255,255,0.5)",
                                background: "rgba(255,255,255,0.05)",
                                padding: "2px 6px",
                                borderRadius: 4,
                              }}
                            >
                              Layout: {slide.layout}
                            </span>
                          )}
                        </div>
                        {(slide.purpose || slide.key_message) && (
                          <div style={{ fontSize: 11, color: "rgba(255,255,255,0.6)", marginTop: 2 }}>
                            {slide.purpose || slide.key_message}
                          </div>
                        )}
                      </div>
                    </div>

                    {/* REORDER & EDIT ACTION CONTROLS */}
                    <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
                      <button
                        className="btn-ui secondary sm"
                        onClick={() => handleMoveSlide(idx, -1)}
                        disabled={idx === 0}
                        title="Move Slide Up"
                        style={{ padding: "4px 8px" }}
                      >
                        ▲
                      </button>
                      <button
                        className="btn-ui secondary sm"
                        onClick={() => handleMoveSlide(idx, 1)}
                        disabled={idx === slide_sequence.length - 1}
                        title="Move Slide Down"
                        style={{ padding: "4px 8px" }}
                      >
                        ▼
                      </button>
                      <button
                        className="btn-ui secondary sm"
                        onClick={() => handleStartEdit(idx, slide)}
                        title="Edit Slide Title & Type"
                        style={{ padding: "4px 10px" }}
                      >
                        ✏️ Edit
                      </button>
                      <button
                        className="btn-ui danger sm"
                        onClick={() => handleDeleteSlide(idx)}
                        title="Remove Slide"
                        style={{ padding: "4px 8px" }}
                      >
                        🗑️
                      </button>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* FOOTER ACTION BAR */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: 10 }}>
        <button className="btn-ui secondary" onClick={onBackToSetup}>
          ← Back to Stage 1 Setup
        </button>

        <button
          className="btn-ui primary"
          onClick={onExecuteStage2}
          disabled={loadingGenerate}
          style={{
            padding: "14px 28px",
            fontSize: 15,
            fontWeight: 800,
            background: "linear-gradient(135deg, #10b981 0%, #059669 100%)",
            boxShadow: "0 6px 20px rgba(16, 185, 129, 0.4)",
          }}
        >
          {loadingGenerate ? (
            <span style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <span className="spinner-sm" /> STAGE 2: Generating Final Presentation...
            </span>
          ) : (
            "🚀 STAGE 2: Generate Final PPT Deck"
          )}
        </button>
      </div>
    </div>
  );
}
