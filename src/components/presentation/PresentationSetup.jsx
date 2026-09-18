import React, { useState, useEffect, useRef } from "react";

const SLIDE_COUNT_OPTIONS = [
  { id: "auto", label: "Auto", desc: "Auto-generated", icon: "✨" },
  { id: 6, label: "6 Slides", desc: "~7 Mins presentation",},
  { id: 8, label: "8 Slides ", desc: "~10 Mins standard deck",},
  { id: 10, label: "10 Slides", desc: "~12 Mins pitch deck",},
  { id: 15, label: "15 Slides", desc: "~18 Mins deep dive",},
  { id: 20, label: "20 Slides", desc: "~24 Mins comprehensive",},
  { id: 25, label: "25 Slides", desc: "~30 Mins workshop",},
  { id: 30, label: "30 Slides", desc: "~36 Mins masterclass",},
];

const LANGUAGE_OPTIONS = [
  { id: "English", label: "English", flag: "🇺🇸" },
  { id: "Hindi", label: "Hindi (हिंदी)", flag: "🇮🇳" },
  { id: "Hinglish", label: "Hinglish", flag: "🇮🇳" },
  { id: "Spanish", label: "Spanish", flag: "🇪🇸" },
  { id: "French", label: "French", flag: "🇫🇷" },
  { id: "German", label: "German", flag: "🇩🇪" },
];

const STYLE_OPTIONS = [
  { id: "professional", label: "Executive Professional", icon: "💼" },
  { id: "corporate", label: "Corporate Enterprise", icon: "🏢" },
  { id: "modern", label: "Modern Minimal", icon: "✨" },
  { id: "academic", label: "Academic Research", icon: "🎓" },
  { id: "creative", label: "Creative Showcase", icon: "🎨" },
  { id: "minimal", label: "Minimalist Clean", icon: "🌿" },
];

export const MASTER_TEMPLATE_OPTIONS = [
  { id: "base_template", label: "Default Slate Teal", icon: "🛡️", desc: "Dark Slate & Teal Widescreen", category: "Corporate" },
  { id: "ion_boardroom", label: "Ion Boardroom", icon: "🍇", desc: "Magenta Tag & Midnight Violet", category: "Corporate" },
  { id: "berlin_executive", label: "Berlin Executive", icon: "🏢", desc: "Burnt Orange & Charcoal Bar", category: "Corporate" },
  { id: "quotable_teal", label: "Quotable Teal", icon: "💬", desc: "Cyan & Charcoal Dual Block", category: "Corporate" },
  { id: "geometric_block", label: "Geometric Color Block", icon: "🟣", desc: "Pastel Lavender & Royal Blue Arches", category: "Modern & Geometric" },
  { id: "urban_monochrome", label: "Urban Monochrome", icon: "🏛️", desc: "Architectural Slate Grid", category: "Modern & Geometric" },
  { id: "crop_frame", label: "Crop Bracket Minimal", icon: "📐", desc: "Warm Sand & Corner Brackets", category: "Minimal & Clean" },
  { id: "circuit_tech", label: "Circuit Tech Cyber", icon: "⚡", desc: "Electric Cyan & Blue Mesh", category: "Tech & Cyber" },
  { id: "celestial_night", label: "Celestial Night", icon: "🌌", desc: "Deep Space Indigo & Radar Rings", category: "Tech & Cyber" },
  { id: "artistic_neon", label: "Artistic Neon", icon: "🎨", desc: "Asymmetric Orange & Dark Canvas", category: "Creative & Editorial" },
  { id: "atlas_bold", label: "Atlas Crimson Banner", icon: "🚩", desc: "Crimson Red Callout Badge", category: "Corporate" },
  { id: "organic_pastel", label: "Organic Earthy Pastel", icon: "🌿", desc: "Soft Taupe & Fluid Blobs", category: "Minimal & Clean" },
  { id: "dividend_burgundy", label: "Dividend Burgundy Block", icon: "🍷", desc: "Burgundy Footer & Clean Slate", category: "Corporate" },
  { id: "savon_classic", label: "Savon Classic Card", icon: "📜", desc: "Mint Pattern & Framed Card", category: "Creative & Editorial" },
  { id: "wood_type", label: "Wood Type Vintage", icon: "🪵", desc: "Timber Brown & Parchment Stamp", category: "Creative & Editorial" },
  { id: "sidebar_executive", label: "Executive Sidebar Rail", icon: "💼", desc: "Navy Sidebar & Off-White Card", category: "Corporate" },
  { id: "modern_glassmorphism", label: "Modern Dark Glassmorphism", icon: "✨", desc: "Glowing Purple Neon on Dark Zinc", category: "Tech & Cyber" },
];

function CustomDropdown({ label, icon, options, value, onChange, placeholder = "Select option", headerBadge }) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  const selectedOption =
    options.find((opt) => opt.id === value || String(opt.id) === String(value)) ||
    (typeof value === "number" || (!isNaN(value) && value !== "auto")
      ? { id: value, label: `${value} Slides`, icon: "℗" }
      : options[0]);

  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="field-group" style={{ position: "relative" }} ref={dropdownRef}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "6px" }}>
        <label
          style={{
            fontSize: "11px",
            fontWeight: 700,
            color: "#c084fc",
            margin: 0,
            display: "flex",
            alignItems: "center",
            gap: "6px",
          }}
        >
          <span>{icon}</span> {label}
        </label>
        {headerBadge && (
          <span style={{ fontSize: 9, fontWeight: 700, color: "#c084fc", background: "rgba(139,92,246,0.15)", padding: "2px 6px", borderRadius: 999, border: "1px solid rgba(139,92,246,0.3)" }}>
            {headerBadge}
          </span>
        )}
      </div>

      {/* DROPDOWN TRIGGER BUTTON */}
      <button
        type="button"
        onClick={() => setIsOpen((prev) => !prev)}
        style={{
          width: "100%",
          padding: "9px 12px",
          borderRadius: "10px",
          background: isOpen ? "rgba(139, 92, 246, 0.2)" : "rgba(255, 255, 255, 0.05)",
          border: isOpen ? "1px solid #c084fc" : "1px solid rgba(255, 255, 255, 0.12)",
          color: "#ffffff",
          fontSize: "12px",
          fontWeight: 600,
          cursor: "pointer",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          boxShadow: isOpen ? "0 0 12px rgba(139, 92, 246, 0.3)" : "none",
          transition: "all 0.2s ease",
          outline: "none",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "8px", overflow: "hidden" }}>
          {selectedOption?.flag && <span style={{ fontSize: "14px" }}>{selectedOption.flag}</span>}
          {selectedOption?.icon && <span style={{ fontSize: "13px" }}>{selectedOption.icon}</span>}
          <span style={{ whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
            {selectedOption?.label || placeholder}
          </span>
          {selectedOption?.desc && (
            <span style={{ fontSize: "10px", color: "rgba(255,255,255,0.45)", fontWeight: 400 }}>
              ({selectedOption.desc})
            </span>
          )}
        </div>
        <span
          style={{
            fontSize: "10px",
            color: isOpen ? "#c084fc" : "rgba(255,255,255,0.5)",
            transform: isOpen ? "rotate(180deg)" : "rotate(0deg)",
            transition: "transform 0.2s ease",
            marginLeft: "6px",
            flexShrink: 0,
          }}
        >
          ▼
        </span>
      </button>

      {/* DROPDOWN MENU POPOVER */}
      {isOpen && (
        <div
          style={{
            position: "absolute",
            top: "calc(100% + 4px)",
            left: 0,
            right: 0,
            zIndex: 100,
            background: "#121124",
            backdropFilter: "blur(16px)",
            border: "1px solid rgba(192, 132, 252, 0.35)",
            borderRadius: "10px",
            padding: "5px",
            boxShadow: "0 10px 30px rgba(0,0,0,0.7), 0 0 15px rgba(139,92,246,0.25)",
            maxHeight: "220px",
            overflowY: "auto",
          }}
        >
          {options.map((opt) => {
            const isSelected = opt.id === value || String(opt.id) === String(value);
            return (
              <div
                key={opt.id}
                onClick={() => {
                  onChange?.(opt.id);
                  setIsOpen(false);
                }}
                style={{
                  padding: "7px 10px",
                  borderRadius: "7px",
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  background: isSelected ? "rgba(139, 92, 246, 0.25)" : "transparent",
                  color: isSelected ? "#ffffff" : "rgba(255, 255, 255, 0.8)",
                  fontSize: "12px",
                  fontWeight: isSelected ? 700 : 500,
                  transition: "all 0.15s ease",
                  marginBottom: "2px",
                }}
                onMouseEnter={(e) => {
                  if (!isSelected) {
                    e.currentTarget.style.background = "rgba(255, 255, 255, 0.08)";
                    e.currentTarget.style.color = "#ffffff";
                  }
                }}
                onMouseLeave={(e) => {
                  if (!isSelected) {
                    e.currentTarget.style.background = "transparent";
                    e.currentTarget.style.color = "rgba(255, 255, 255, 0.8)";
                  }
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: "8px", overflow: "hidden" }}>
                  {opt.flag && <span style={{ fontSize: "14px" }}>{opt.flag}</span>}
                  {opt.icon && <span style={{ fontSize: "13px" }}>{opt.icon}</span>}
                  <div style={{ display: "flex", flexDirection: "column" }}>
                    <span>{opt.label}</span>
                    {opt.desc && <span style={{ fontSize: "9.5px", color: "rgba(255,255,255,0.45)" }}>{opt.desc}</span>}
                  </div>
                </div>
                {isSelected && <span style={{ color: "#c084fc", fontWeight: 800, fontSize: "12px", marginLeft: "6px" }}>✓</span>}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

function Toggle({ label, checked, onChange, icon }) {
  return (
    <label
      className="toggle-row"
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        fontSize: "12px",
        background: checked ? "rgba(139,92,246,0.12)" : "rgba(255,255,255,0.04)",
        padding: "8px 12px",
        borderRadius: "10px",
        border: checked ? "1px solid rgba(139,92,246,0.35)" : "1px solid rgba(255,255,255,0.08)",
        cursor: "pointer",
        userSelect: "none",
        transition: "all 0.2s ease",
      }}
    >
      <span style={{ fontWeight: 600, color: checked ? "#ffffff" : "rgba(255,255,255,0.75)", display: "flex", alignItems: "center", gap: 6 }}>
        {icon && <span>{icon}</span>}
        {label}
      </span>
      <input
        type="checkbox"
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
        style={{ cursor: "pointer", accentColor: "#8b5cf6", width: 15, height: 15 }}
      />
    </label>
  );
}

export default function PresentationSetup({
  prompt,
  setPrompt,
  slideCount,
  setSlideCount,
  depth = "medium",
  setDepth,
  style = "professional",
  setStyle,
  userRequirements = "",
  setUserRequirements,
  audience,
  setAudience,
  tone,
  setTone,
  language,
  setLanguage,
  contentTheme,
  setContentTheme,
  visualStyle,
  setVisualStyle,
  includeSpeakerNotes,
  setIncludeSpeakerNotes,
  includeAgendaSlide = true,
  setIncludeAgendaSlide,
  useWebSearch,
  setUseWebSearch,
  useAiImageGen = true,
  setUseAiImageGen,
  smartMode,
  setSmartMode,
  allowChart,
  setAllowChart,
  loadingPlan,
  loadingGenerate,
  error,
  fetchPlan,
  useCustomBrand,
  setUseCustomBrand,
  brandLogo,
  setBrandLogo,
  brandColor,
  setBrandColor,
  brandSecondaryColor,
  setBrandSecondaryColor,
  brandFont,
  setBrandFont,
  brandFooter,
  setBrandFooter,
  templateName = "base_template",
  setTemplateName,
}) {
  const [isEnhanced, setIsEnhanced] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [showAiFeatures, setShowAiFeatures] = useState(true);

  const handleVoiceInput = () => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      alert("Speech recognition is not supported in your browser. Please try Chrome or Edge.");
      return;
    }
    try {
      const recognition = new SpeechRecognition();
      recognition.lang = language === "Hindi" ? "hi-IN" : "en-US";
      recognition.continuous = false;
      recognition.interimResults = false;
      recognition.onstart = () => setIsListening(true);
      recognition.onresult = (event) => {
        const transcript = event.results[0][0].transcript;
        if (transcript) {
          setPrompt((prev) => (prev ? `${prev} ${transcript}` : transcript));
        }
        setIsListening(false);
      };
      recognition.onerror = () => setIsListening(false);
      recognition.onend = () => setIsListening(false);
      recognition.start();
    } catch (e) {
      setIsListening(false);
    }
  };

  const handleEnhancePrompt = () => {
    if (!prompt.trim()) return;
    const baseTopic = prompt.trim();
    const enhanced = `Create an executive-level, highly professional presentation on "${baseTopic}".

📌 Executive Presentation Framework & Requirements:
• Executive Overview & Key Strategic Objectives
• Structured System Architecture & Technical Workflow Diagrams
• Data Performance Metrics, KPIs & Industry Comparison Charts
• Real-World Case Studies & Enterprise Implementation Examples
• Risk Mitigation, Governance & Security Compliance
• Strategic Takeaways, ROI Projections & Actionable Next Steps`;
    setPrompt(enhanced);
    setIsEnhanced(true);
    setTimeout(() => setIsEnhanced(false), 2500);
  };

  const calculatedSlideCount = slideCount === "auto" ? 8 : (Number(slideCount) || 8);

  return (
    <div className="card-box ppt-setup-card" style={{ marginBottom: "20px" }}>
      {/* HEADER LABEL & REAL-TIME DECK STATS BAR */}
      <div
        className="section-label"
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          flexWrap: "wrap",
          gap: 8,
          marginBottom: 16,
          paddingBottom: 12,
          borderBottom: "1px solid rgba(255,255,255,0.08)",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <span style={{ fontSize: 13, fontWeight: 900, color: "#c084fc", letterSpacing: "1px" }}>
            Presentation Setup
          </span>
         
        </div>

        {/* REALTIME DECK ESTIMATE COUNTER */}
        <div style={{ display: "flex", alignItems: "center", gap: 12, fontSize: 11, color: "rgba(255,255,255,0.65)", flexWrap: "wrap" }}>
          <span><strong>~{(calculatedSlideCount * 1.2).toFixed(1)} Mins</strong> Presentation</span>
          <span><strong>{slideCount === "auto" ? "Auto (AI Decided)" : `${slideCount} Slides`}</strong></span>
        </div>
      </div>

      {/* PROMPT INPUT WITH AI MAGIC ENHANCE BUTTON AND VOICE DICTATION */}
      <div className="field-group" style={{ marginBottom: "16px" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 6 }}>
          <label style={{ fontSize: 12, fontWeight: 700, margin: 0, color: "#e2e8f0" }}>
            Presentation Topic / AI Prompt
          </label>

          <div style={{ display: "flex", gap: 6, alignItems: "center" }}>
            <button
              type="button"
              onClick={handleVoiceInput}
              style={{
                fontSize: 11,
                fontWeight: 700,
                padding: "4px 10px",
                borderRadius: 999,
                background: isListening ? "rgba(239,68,68,0.25)" : "rgba(255,255,255,0.08)",
                border: isListening ? "1px solid #ef4444" : "1px solid rgba(255,255,255,0.15)",
                color: "#ffffff",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                gap: 4,
              }}
            >
              <span>{isListening ? "🔴Listening..." : "🎙️Speak."}</span>
            </button>

            <button
              type="button"
              onClick={handleEnhancePrompt}
              style={{
                fontSize: 11,
                fontWeight: 700,
                padding: "4px 10px",
                borderRadius: 999,
                background: isEnhanced ? "rgba(16, 185, 129, 0.25)" : "linear-gradient(135deg, #7c3aed 0%, #6366f1 100%)",
                border: "none",
                color: "#ffffff",
                cursor: "pointer",
                boxShadow: "0 2px 8px rgba(124, 58, 237, 0.3)",
                transition: "all 0.2s ease",
              }}
            >
              {isEnhanced ? "✓ Prompt Enhanced!" : "✨Enhance"}
            </button>
          </div>
        </div>

        <textarea
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          rows={3}
          style={{
            lineHeight: "1.5",
            fontSize: "13.5px",
            background: "rgba(0,0,0,0.4)",
            border: "1px solid rgba(255,255,255,0.12)",
            borderRadius: "12px",
            color: "#ffffff",
            width: "100%",
            padding: "12px",
          }}
          placeholder="Describe your presentation topic, key subtopics, target audience, or specific presentation goals..."
        />
      </div>



      {/* DECK CONFIGURATION DROPDOWNS (UNIFIED CONTROL GRID) */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(210px, 1fr))", gap: 12, marginBottom: 18 }}>
        <div>
          <CustomDropdown
            label="Slide Count Selection"
            icon="℗"
            options={SLIDE_COUNT_OPTIONS}
            value={slideCount}
            onChange={setSlideCount}
            
          />
          {slideCount !== "auto" && (
            <div style={{ display: "flex", alignItems: "center", gap: 6, marginTop: 6, justifyContent: "flex-end" }}>
              <span style={{ fontSize: 10, color: "rgba(255,255,255,0.5)", fontWeight: 600 }}>Custom Count:</span>
              <button
                type="button"
                onClick={() => setSlideCount?.(Math.max(3, (Number(slideCount) || 8) - 1))}
                style={{
                  width: 24,
                  height: 24,
                  borderRadius: 6,
                  border: "1px solid rgba(255,255,255,0.15)",
                  background: "rgba(255,255,255,0.06)",
                  color: "#fff",
                  fontSize: 12,
                  fontWeight: "bold",
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                −
              </button>
              <input
                type="number"
                min="3"
                max="30"
                value={slideCount}
                onChange={(e) => setSlideCount?.(Math.min(30, Math.max(3, Number(e.target.value) || 3)))}
                style={{
                  textAlign: "center",
                  fontWeight: "bold",
                  width: 36,
                  height: 24,
                  borderRadius: 6,
                  border: "1px solid rgba(255,255,255,0.15)",
                  background: "rgba(0,0,0,0.3)",
                  color: "#c084fc",
                  fontSize: 11,
                }}
              />
              <button
                type="button"
                onClick={() => setSlideCount?.(Math.min(30, (Number(slideCount) || 8) + 1))}
                style={{
                  width: 24,
                  height: 24,
                  borderRadius: 6,
                  border: "1px solid rgba(255,255,255,0.15)",
                  background: "rgba(255,255,255,0.06)",
                  color: "#fff",
                  fontSize: 12,
                  fontWeight: "bold",
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                +
              </button>
            </div>
          )}
        </div>

        <CustomDropdown
          label="Master Slide Template"
          icon="📐"
          options={MASTER_TEMPLATE_OPTIONS}
          value={templateName || "base_template"}
          onChange={setTemplateName}
        />

        <CustomDropdown
          label="Design Theme Style"
          icon="🎨"
          options={STYLE_OPTIONS}
          value={style || "professional"}
          onChange={setStyle}
        />

        <CustomDropdown
          label="Output Language"
          icon="🌐"
          options={LANGUAGE_OPTIONS}
          value={language || "English"}
          onChange={setLanguage}
        />
      </div>



      {/* AI & LAYOUT TOGGLES HEADER (CLEAN INLINE TEXT + ARROW TOGGLE) */}
      <div style={{ marginBottom: showAiFeatures ? 8 : 16 }}>
        <div
          onClick={() => setShowAiFeatures((v) => !v)}
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 6,
            fontSize: 11,
            fontWeight: "bold",
            color: "#c084fc",
            letterSpacing: "0.5px",
            cursor: "pointer",
            userSelect: "none",
            transition: "opacity 0.2s ease",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.opacity = "0.85";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.opacity = "1";
          }}
        >
          <span>LAYOUT & AI FEATURES</span>
          <span style={{ fontSize: 10 }}>{showAiFeatures ? "▲" : "▼"}</span>
        </div>
      </div>

      {showAiFeatures && (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: 8, marginBottom: "16px" }}>
          <Toggle label="Auto Agenda Slide" icon="📋" checked={includeAgendaSlide} onChange={setIncludeAgendaSlide} />
          <Toggle label="Speaker Notes" icon="📝" checked={includeSpeakerNotes} onChange={setIncludeSpeakerNotes} />
          <Toggle label="Live Web Research" icon="🌐" checked={useWebSearch} onChange={setUseWebSearch} />
          <Toggle label="AI Image Generator" icon="🎨" checked={useAiImageGen} onChange={setUseAiImageGen} />
          <Toggle label="Smart Mode" icon="⚡" checked={smartMode} onChange={setSmartMode} />
          <Toggle label="Charts & Graphs" icon="📊" checked={allowChart ?? true} onChange={setAllowChart} />
        </div>
      )}

      {error ? (
        <div style={{ color: "#fca5a5", fontSize: 12, marginBottom: 12, background: "rgba(239, 68, 68, 0.15)", padding: "10px 14px", borderRadius: 10, border: "1px solid rgba(239, 68, 68, 0.3)" }}>
          ⚠️ {error}
        </div>
      ) : null}

      <button
        className="btn-ui primary"
        style={{
          width: "100%",
          marginTop: 6,
          padding: "16px",
          fontSize: 15,
          fontWeight: 800,
          borderRadius: 14,
          background: "linear-gradient(135deg, #8b5cf6 0%, #6366f1 100%)",
          boxShadow: "0 8px 24px rgba(139, 92, 246, 0.4)",
          letterSpacing: "0.2px",
        }}
        onClick={fetchPlan}
        disabled={loadingPlan || loadingGenerate}
      >
        {loadingPlan ? (
          <span style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 8 }}>
            <span className="spinner-sm" /> Analyzing Topic & Generating AI Slide Deck...
          </span>
        ) : (
          "⚡ Generate AI Slide Deck"
        )}
      </button>
    </div>
  );
}



