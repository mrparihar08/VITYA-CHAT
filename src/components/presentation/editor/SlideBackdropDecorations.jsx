import React from "react";
import { BACKGROUND_PRESETS } from "../PresentationEditor";

export default function SlideBackdropDecorations({
  slide,
  slideIndex = 0,
  totalSlides = 1,
  templateName = "base_template"
}) {
  if (!slide) return null;

  const matchedPreset = (BACKGROUND_PRESETS || []).find(
    (p) => p.id === slide.background_theme || p.id === slide.bg_color
  );

  const isCover = (slideIndex === 0 && (!slide.layout || slide.layout === "title_slide" || slide.layout === "title_subtitle")) ||
    slide.layout === "title_slide" || slide.layout === "section_slide" || slide.layout === "section_header";

  const isLight = matchedPreset?.id?.includes("light") || matchedPreset?.id === "titanium_white" || matchedPreset?.id === "education" || matchedPreset?.id === "medical";
  const accent = slide.accent_color || matchedPreset?.accent || "#c084fc";
  const mutedColor = isLight ? "#64748b" : "#94a3b8";
  const cardBg = isLight ? "rgba(255, 255, 255, 0.9)" : "rgba(30, 41, 59, 0.65)";
  const tmpl = String(slide.template || templateName || "base_template").toLowerCase();

  // Multi-slide archetype step (matching backend themes.py apply_multi_slide_archetype_background)
  const isLast = (slideIndex === totalSlides - 1) && (totalSlides >= 2);
  const step = (slideIndex === 0) ? 0 : (isLast ? 5 : (((slideIndex - 1) % 4) + 1));

  // Determine Badge Text for Cover Slide
  const themeKey = slide.background_theme || matchedPreset?.id || "default";
  let coverBadgeText = "✨ EXECUTIVE PRESENTATION";
  if (["cyberpunk_neon", "cyber_neon"].includes(themeKey)) {
    coverBadgeText = "⚡ AI & TECH INTELLIGENCE";
  } else if (["executive_gold", "gold"].includes(themeKey)) {
    coverBadgeText = "✦ EXECUTIVE BRIEFING ✦";
  } else if (["emerald", "emerald_nature", "emerald_dark", "wall_street", "finance"].includes(themeKey)) {
    coverBadgeText = "📊 STRATEGIC OVERVIEW";
  } else if (["ocean_blue", "blue", "nordic_frost"].includes(themeKey)) {
    coverBadgeText = "🌊 ENTERPRISE ARCHITECTURE";
  } else if (["velvet_rose", "sunset_glow"].includes(themeKey)) {
    coverBadgeText = "🔥 KEYNOTE INSIGHTS";
  } else if (["light", "clean_light", "corporate_light", "titanium_white", "education"].includes(themeKey)) {
    coverBadgeText = "🏢 EXECUTIVE REPORT";
  }

  return (
    <div className="slide-backend-decorations" style={{ position: "absolute", inset: 0, pointerEvents: "none", zIndex: 1 }}>
      {isCover ? (
        /* COVER SLIDE DECORATIONS (MATCHING ppt_renderer.py lines 2665-2771) */
        <>
          {/* 1. Pill Badge at Top */}
          <div style={{
            position: "absolute",
            top: "14%",
            left: "50%",
            transform: "translateX(-50%)",
            padding: "4px 18px",
            borderRadius: "9999px",
            border: `1.5px solid ${accent}`,
            background: cardBg,
            color: accent,
            fontSize: "11px",
            fontWeight: 800,
            letterSpacing: "1px",
            textTransform: "uppercase",
            boxShadow: "0 4px 12px rgba(0, 0, 0, 0.3)"
          }}>
            {coverBadgeText}
          </div>

          {/* 2. Accent Divider Bar Under Title */}
          <div style={{
            position: "absolute",
            top: "43%",
            left: "50%",
            transform: "translateX(-50%)",
            width: "140px",
            height: "3px",
            borderRadius: "2px",
            background: accent
          }} />

          {/* 3. Cover Confidentiality Footer */}
          <div style={{
            position: "absolute",
            bottom: "3.5%",
            left: "50%",
            transform: "translateX(-50%)",
            fontSize: "10px",
            fontWeight: 500,
            color: mutedColor,
            letterSpacing: "0.5px"
          }}>
            Executive Presentation • Confidential
          </div>
        </>
      ) : (
        /* CONTENT SLIDE DECORATIONS (MATCHING ppt_renderer.py lines 2439-2615) */
        <>
          {/* 1. Slide Footer (SLIDE X OF Y) */}
          <div style={{
            position: "absolute",
            bottom: "3.5%",
            right: "4.5%",
            fontSize: "10px",
            fontWeight: 800,
            color: accent,
            letterSpacing: "0.5px",
            textTransform: "uppercase"
          }}>
            SLIDE {slideIndex + 1} OF {totalSlides}
          </div>

          {/* 2. Master Template Structural Geometries */}
          {["berlin_executive", "ion_boardroom", "emerald_nature"].includes(tmpl) ? (
            <div style={{
              position: "absolute",
              top: 0,
              left: 0,
              width: "100%",
              height: "28px",
              background: "rgba(15, 23, 42, 0.95)",
              borderBottom: `1.5px solid ${accent}`,
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              padding: "0 18px",
              boxSizing: "border-box"
            }}>
              <span style={{
                background: accent,
                color: "#000000",
                fontWeight: 800,
                fontSize: "9px",
                padding: "2px 8px",
                borderRadius: "4px",
                letterSpacing: "0.5px"
              }}>
                {tmpl === "ion_boardroom" ? "BOARDROOM" : "EXECUTIVE"}
              </span>
              <span style={{
                color: accent,
                fontSize: "9px",
                fontWeight: 700,
                letterSpacing: "0.5px"
              }}>
                SECTION 0{slideIndex + 1} • 16:9 HD
              </span>
            </div>
          ) : ["sidebar_executive", "celestial_night"].includes(tmpl) ? (
            <div style={{
              position: "absolute",
              top: 0,
              left: 0,
              width: "12%",
              height: "100%",
              background: "rgba(15, 23, 42, 0.85)",
              borderRight: `2px solid ${accent}`,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              paddingTop: "24px",
              gap: "12px",
              boxSizing: "border-box"
            }}>
              <div style={{ width: "10px", height: "10px", borderRadius: "50%", background: accent }} />
              <div style={{ width: "2px", height: "40px", background: accent }} />
              <div style={{
                fontSize: "9px",
                fontWeight: 800,
                color: accent,
                letterSpacing: "0.8px",
                textAlign: "center",
                marginTop: "20px"
              }}>
                SLIDE<br />0{slideIndex + 1}<br />/<br />0{totalSlides}
              </div>
            </div>
          ) : ["crop_frame", "urban_monochrome", "organic_pastel"].includes(tmpl) ? (
            <>
              <div style={{ position: "absolute", top: "16px", left: "16px", width: "24px", height: "2px", background: accent }} />
              <div style={{ position: "absolute", top: "16px", left: "16px", width: "2px", height: "24px", background: accent }} />
              <div style={{ position: "absolute", top: "16px", right: "16px", width: "24px", height: "2px", background: accent }} />
              <div style={{ position: "absolute", top: "16px", right: "16px", width: "2px", height: "24px", background: accent }} />
              <div style={{ position: "absolute", bottom: "16px", left: "16px", width: "24px", height: "2px", background: accent }} />
              <div style={{ position: "absolute", bottom: "16px", left: "16px", width: "2px", height: "24px", background: accent }} />
              <div style={{ position: "absolute", bottom: "16px", right: "16px", width: "24px", height: "2px", background: accent }} />
              <div style={{ position: "absolute", bottom: "16px", right: "16px", width: "2px", height: "24px", background: accent }} />
            </>
          ) : ["atlas_bold"].includes(tmpl) ? (
            <div style={{
              position: "absolute",
              top: 0,
              left: 0,
              width: "100%",
              height: "26px",
              background: accent,
              display: "flex",
              alignItems: "center",
              padding: "0 18px",
              boxSizing: "border-box"
            }}>
              <span style={{ color: "#ffffff", fontWeight: 800, fontSize: "10px", letterSpacing: "0.8px" }}>
                ★ ATLAS KEYNOTE MASTER
              </span>
            </div>
          ) : (
            /* Default Sleek Top Accent Line */
            <div style={{
              position: "absolute",
              top: 0,
              left: 0,
              width: "100%",
              height: "3px",
              background: accent
            }} />
          )}

          {/* 3. Multi-Slide Archetype Subtle Variations (Slide 2 to 6+) */}
          {step === 1 ? (
            <div style={{
              position: "absolute",
              left: "4.5%",
              top: "3px",
              width: "110px",
              height: "2.5px",
              background: accent
            }} />
          ) : step === 2 ? (
            <div style={{
              position: "absolute",
              left: "2.5%",
              top: "12%",
              width: "3px",
              height: "76%",
              borderRadius: "2px",
              background: accent
            }} />
          ) : step === 3 ? (
            <div style={{
              position: "absolute",
              left: "4.5%",
              bottom: "8%",
              width: "91%",
              height: "2px",
              borderRadius: "1px",
              background: accent
            }} />
          ) : step === 4 ? (
            <>
              <div style={{ position: "absolute", top: "18px", right: "18px", width: "28px", height: "2px", background: accent }} />
              <div style={{ position: "absolute", top: "18px", right: "18px", width: "2px", height: "28px", background: accent }} />
              <div style={{ position: "absolute", bottom: "18px", left: "18px", width: "28px", height: "2px", background: accent }} />
              <div style={{ position: "absolute", bottom: "18px", left: "18px", width: "2px", height: "28px", background: accent }} />
            </>
          ) : step === 5 ? (
            <div style={{
              position: "absolute",
              left: "4%",
              top: "5%",
              width: "92%",
              height: "88%",
              border: `1px solid ${accent}30`,
              borderRadius: "10px"
            }} />
          ) : null}
        </>
      )}
    </div>
  );
}
