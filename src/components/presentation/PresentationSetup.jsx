import React, { useState } from "react";



const TONE_OPTIONS = [
  { id: "Professional", label: "Professional & Clean", icon: "💼" },
  { id: "Inspiring", label: "Inspiring & Energetic", icon: "🚀" },
  { id: "Educational", label: "Educational & Detailed", icon: "📚" },
  { id: "Formal", label: "Formal Executive", icon: "👔" },
];

const LANGUAGE_OPTIONS = [
  { id: "English", label: "English", flag: "🇺🇸" },
  { id: "Hindi", label: "Hindi (हिंदी)", flag: "🇮🇳" },
  { id: "Hinglish", label: "Hinglish", flag: "🇮🇳" },
  { id: "Spanish", label: "Spanish", flag: "🇪🇸" },
  { id: "French", label: "French", flag: "🇫🇷" },
  { id: "German", label: "German", flag: "🇩🇪" },
];

const DEPTH_OPTIONS = [
  { id: "basic", label: "Basic Overview", desc: "High-level summary" },
  { id: "medium", label: "Standard Medium", desc: "Balanced depth & data" },
  { id: "detailed", label: "Deep Enterprise", desc: "Comprehensive technical specs" },
];

const STYLE_OPTIONS = [
  { id: "professional", label: "Executive Professional" },
  { id: "corporate", label: "Corporate Enterprise" },
  { id: "modern", label: "Modern Minimal" },
  { id: "academic", label: "Academic Research" },
  { id: "creative", label: "Creative Showcase" },
  { id: "minimal", label: "Minimalist Clean" },
];

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
}) {
  const [isEnhanced, setIsEnhanced] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [showAiFeatures, setShowAiFeatures] = useState(true);
  const [showBrandOptions, setShowBrandOptions] = useState(false);

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
            STAGE 1: PPT PLANNER & DESIGN STUDIO
          </span>
          <span
            style={{
              fontSize: 10,
              fontWeight: 700,
              padding: "2px 8px",
              borderRadius: 999,
              background: "rgba(139,92,246,0.2)",
              color: "#c084fc",
              border: "1px solid rgba(139,92,246,0.3)",
            }}
          >
            2-Stage Engine Active
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
              <span>{isListening ? "🔴 Listening..." : "🎙️Speak."}</span>
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

      {/* USER REQUIREMENTS / EXTRA INSTRUCTIONS (OPTIONAL) */}
      <div className="field-group" style={{ marginBottom: "16px" }}>
        <label style={{ fontSize: 11, fontWeight: 700, color: "rgba(255,255,255,0.8)", marginBottom: 4, display: "block" }}>
          🎯 Specific User Requirements & Constraints (Optional)
        </label>
        <input
          type="text"
          value={userRequirements || ""}
          onChange={(e) => setUserRequirements?.(e.target.value)}
          placeholder="e.g. Include a 4-step deployment workflow slide, emphasis on ROI calculations, or specific case study..."
          style={{
            fontSize: 12,
            padding: "8px 12px",
            borderRadius: 10,
            background: "rgba(0,0,0,0.3)",
            border: "1px solid rgba(255,255,255,0.1)",
            color: "#fff",
            width: "100%",
          }}
        />
      </div>

      {/* SLIDE COUNT & CONFIGURATION */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr", gap: 12, marginBottom: 16 }}>
        <div className="field-group">
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8, flexWrap: "wrap", gap: 6 }}>
            <label style={{ fontSize: 12, fontWeight: 700, color: "#e2e8f0", display: "flex", alignItems: "center", gap: 6, margin: 0 }}>
              <span>📊</span> Slide Count Selection
            </label>
            <span style={{ fontSize: 10, fontWeight: 700, color: "#c084fc", background: "rgba(139,92,246,0.15)", padding: "3px 8px", borderRadius: 999, border: "1px solid rgba(139,92,246,0.3)" }}>
              ✨ Stage 1 Auto-Complexity Analyzer
            </span>
          </div>

          {/* PRESET BUTTONS ("auto", 6, 8, 10, 15, 20, 25, 30) */}
          <div style={{ display: "flex", gap: 6, flexWrap: "wrap", alignItems: "center", marginBottom: 10 }}>
            {["auto", 6, 8, 10, 15, 20, 25, 30].map((preset) => {
              const isSelected = slideCount === preset;
              return (
                <button
                  key={preset}
                  type="button"
                  onClick={() => setSlideCount?.(preset)}
                  style={{
                    padding: "6px 12px",
                    borderRadius: 8,
                    fontSize: 11,
                    fontWeight: isSelected ? 800 : 600,
                    background: isSelected
                      ? "linear-gradient(135deg, #7c3aed 0%, #6366f1 100%)"
                      : "rgba(255,255,255,0.05)",
                    border: isSelected ? "1px solid #c084fc" : "1px solid rgba(255,255,255,0.1)",
                    color: "#ffffff",
                    cursor: "pointer",
                    transition: "all 0.2s ease",
                    boxShadow: isSelected ? "0 2px 8px rgba(124, 58, 237, 0.4)" : "none",
                  }}
                >
                  {preset === "auto" ? "✨ Auto (AI Analyzed)" : `${preset} Slides`}
                </button>
              );
            })}
          </div>

          {/* MANUAL ADJUSTMENT STEPPER IF NOT AUTO */}
          {slideCount !== "auto" && (
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <span style={{ fontSize: 11, color: "rgba(255,255,255,0.6)", fontWeight: 600 }}>Custom Count:</span>
              <button
                type="button"
                onClick={() => setSlideCount?.(Math.max(3, (Number(slideCount) || 8) - 1))}
                style={{
                  width: 32,
                  height: 34,
                  borderRadius: 8,
                  border: "1px solid rgba(255,255,255,0.15)",
                  background: "rgba(255,255,255,0.06)",
                  color: "#fff",
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
                  width: 60,
                  height: 34,
                  borderRadius: 8,
                  border: "1px solid rgba(255,255,255,0.15)",
                  background: "rgba(0,0,0,0.3)",
                  color: "#fff",
                  fontSize: 13,
                }}
              />
              <button
                type="button"
                onClick={() => setSlideCount?.(Math.min(30, (Number(slideCount) || 8) + 1))}
                style={{
                  width: 32,
                  height: 34,
                  borderRadius: 8,
                  border: "1px solid rgba(255,255,255,0.15)",
                  background: "rgba(255,255,255,0.06)",
                  color: "#fff",
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
      </div>

      {/* DEPTH & DESIGN STYLE SELECTION CARDS */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 16 }}>
        <div className="field-group">
          <label style={{ fontSize: 11, fontWeight: 700, color: "#c084fc", marginBottom: 6, display: "block" }}>
            📐 Detail Depth Level
          </label>
          <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
            {DEPTH_OPTIONS.map((d) => {
              const isSelected = (depth || "medium") === d.id;
              return (
                <button
                  type="button"
                  key={d.id}
                  onClick={() => setDepth?.(d.id)}
                  style={{
                    padding: "6px 10px",
                    borderRadius: 8,
                    border: isSelected ? "1.5px solid #8b5cf6" : "1px solid rgba(255,255,255,0.08)",
                    background: isSelected ? "rgba(139,92,246,0.2)" : "rgba(255,255,255,0.04)",
                    color: "#ffffff",
                    fontSize: 11,
                    fontWeight: isSelected ? 700 : 500,
                    cursor: "pointer",
                    textAlign: "left",
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                  }}
                >
                  <span>{d.label}</span>
                  <span style={{ fontSize: 10, color: "rgba(255,255,255,0.5)" }}>{d.desc}</span>
                </button>
              );
            })}
          </div>
        </div>

        <div className="field-group">
          <label style={{ fontSize: 11, fontWeight: 700, color: "#c084fc", marginBottom: 6, display: "block" }}>
            🎨 Design Theme Style
          </label>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 6 }}>
            {STYLE_OPTIONS.map((st) => {
              const isSelected = (style || "professional") === st.id;
              return (
                <button
                  type="button"
                  key={st.id}
                  onClick={() => setStyle?.(st.id)}
                  style={{
                    padding: "6px 8px",
                    borderRadius: 8,
                    border: isSelected ? "1.5px solid #38bdf8" : "1px solid rgba(255,255,255,0.08)",
                    background: isSelected ? "rgba(56,189,248,0.2)" : "rgba(255,255,255,0.04)",
                    color: "#ffffff",
                    fontSize: 11,
                    fontWeight: isSelected ? 700 : 500,
                    cursor: "pointer",
                    textAlign: "left",
                    whiteSpace: "nowrap",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                  }}
                >
                  {st.label}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* VISUAL TONE & LANGUAGE SELECTION CARDS */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 16 }}>
        <div className="field-group">
          <label style={{ fontSize: 11, fontWeight: 700, color: "#c084fc", marginBottom: 6, display: "block" }}>
            🎭 Tone of Voice
          </label>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 6 }}>
            {TONE_OPTIONS.map((t) => {
              const isSelected = (tone || "Professional") === t.id;
              return (
                <button
                  type="button"
                  key={t.id}
                  onClick={() => setTone?.(t.id)}
                  style={{
                    padding: "6px 8px",
                    borderRadius: 8,
                    border: isSelected ? "1.5px solid #8b5cf6" : "1px solid rgba(255,255,255,0.08)",
                    background: isSelected ? "rgba(139,92,246,0.2)" : "rgba(255,255,255,0.04)",
                    color: "#ffffff",
                    fontSize: 11,
                    fontWeight: isSelected ? 700 : 500,
                    cursor: "pointer",
                    textAlign: "left",
                    whiteSpace: "nowrap",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                  }}
                >
                  {t.icon} {t.label}
                </button>
              );
            })}
          </div>
        </div>

        <div className="field-group">
          <label style={{ fontSize: 11, fontWeight: 700, color: "#c084fc", marginBottom: 6, display: "block" }}>
            🌐 Output Language
          </label>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 6 }}>
            {LANGUAGE_OPTIONS.map((lang) => {
              const isSelected = (language || "English") === lang.id;
              return (
                <button
                  type="button"
                  key={lang.id}
                  onClick={() => setLanguage?.(lang.id)}
                  style={{
                    padding: "6px 4px",
                    borderRadius: 8,
                    border: isSelected ? "1.5px solid #38bdf8" : "1px solid rgba(255,255,255,0.08)",
                    background: isSelected ? "rgba(56,189,248,0.2)" : "rgba(255,255,255,0.04)",
                    color: "#ffffff",
                    fontSize: 11,
                    fontWeight: isSelected ? 700 : 500,
                    cursor: "pointer",
                    textAlign: "center",
                  }}
                >
                  {lang.flag} {lang.label.split(" ")[0]}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* BRANDING SECTION */}
      <div style={{ marginBottom: 16 }}>
        <div
          onClick={() => setShowBrandOptions((v) => !v)}
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            background: useCustomBrand ? "rgba(139, 92, 246, 0.15)" : "rgba(255, 255, 255, 0.04)",
            border: useCustomBrand ? "1px solid rgba(192, 132, 252, 0.4)" : "1px solid rgba(255, 255, 255, 0.08)",
            padding: "10px 14px",
            borderRadius: 12,
            cursor: "pointer",
            marginBottom: showBrandOptions ? 12 : 0,
            transition: "all 0.2s ease",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <span style={{ fontSize: 14 }}>🏢</span>
            <span style={{ fontSize: 12, fontWeight: 800, color: "#fff" }}>
              CUSTOM BRAND TEMPLATE & LOGO UPLOADER
            </span>
            {useCustomBrand && (
              <span style={{ fontSize: 10, background: "#8b5cf6", color: "#fff", padding: "2px 8px", borderRadius: 999, fontWeight: 700 }}>
                Active
              </span>
            )}
          </div>
          <span style={{ fontSize: 10, color: "rgba(255,255,255,0.7)" }}>{showBrandOptions ? "▲ Hide" : "▼ Configure Brand"}</span>
        </div>

        {showBrandOptions && (
          <div style={{ background: "rgba(0, 0, 0, 0.35)", padding: 14, borderRadius: 14, border: "1px solid rgba(255, 255, 255, 0.08)", display: "grid", gap: 12 }}>
            <label style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 12, fontWeight: 700, cursor: "pointer", color: "#fff" }}>
              <input
                type="checkbox"
                checked={useCustomBrand || false}
                onChange={(e) => setUseCustomBrand?.(e.target.checked)}
                style={{ accentColor: "#8b5cf6", width: 16, height: 16 }}
              />
              Enable Custom Corporate Brand Template for this Presentation Deck
            </label>

            {useCustomBrand && (
              <>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
                  <div>
                    <label style={{ fontSize: 11, fontWeight: 700, color: "rgba(255,255,255,0.8)", marginBottom: 4, display: "block" }}>
                      Company Logo (Upload or URL)
                    </label>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) {
                          const reader = new FileReader();
                          reader.onload = () => setBrandLogo?.(reader.result);
                          reader.readAsDataURL(file);
                        }
                      }}
                      style={{ fontSize: 11, color: "#fff", width: "100%", marginBottom: 6 }}
                    />
                    <input
                      type="text"
                      placeholder="Or paste Logo URL (https://...)"
                      value={brandLogo && !brandLogo.startsWith("data:") ? brandLogo : ""}
                      onChange={(e) => setBrandLogo?.(e.target.value)}
                      style={{ fontSize: 11, padding: "6px 10px", borderRadius: 8, background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.1)", color: "#fff", width: "100%" }}
                    />
                    {brandLogo && (
                      <div style={{ marginTop: 6, display: "flex", alignItems: "center", gap: 8 }}>
                        <img src={brandLogo} alt="Logo preview" style={{ height: 28, maxWidth: 100, objectFit: "contain", borderRadius: 4, background: "rgba(255,255,255,0.1)", padding: 2 }} />
                        <button type="button" onClick={() => setBrandLogo?.("")} style={{ fontSize: 10, color: "#fca5a5", background: "none", border: "none", cursor: "pointer" }}>Remove</button>
                      </div>
                    )}
                  </div>

                  <div>
                    <label style={{ fontSize: 11, fontWeight: 700, color: "rgba(255,255,255,0.8)", marginBottom: 4, display: "block" }}>
                      Brand Typography Font
                    </label>
                    <select
                      value={brandFont || "Arial"}
                      onChange={(e) => setBrandFont?.(e.target.value)}
                      style={{ width: "100%", padding: "8px", borderRadius: 8, background: "rgba(15, 23, 42, 0.9)", color: "#fff", border: "1px solid rgba(255,255,255,0.15)", fontSize: 12 }}
                    >
                      <option value="Arial">Arial (Clean Modern)</option>
                      <option value="Montserrat">Montserrat (Executive Bold)</option>
                      <option value="Helvetica">Helvetica (Classic Corporate)</option>
                      <option value="Georgia">Georgia (Editorial Serif)</option>
                      <option value="Trebuchet MS">Trebuchet MS (Tech Modern)</option>
                      <option value="Roboto">Roboto (Digital Clean)</option>
                    </select>
                  </div>
                </div>

                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
                  <div>
                    <label style={{ fontSize: 11, fontWeight: 700, color: "rgba(255,255,255,0.8)", marginBottom: 4, display: "block" }}>
                      Brand Primary Color
                    </label>
                    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                      <input
                        type="color"
                        value={brandColor || "#8b5cf6"}
                        onChange={(e) => setBrandColor?.(e.target.value)}
                        style={{ width: 36, height: 32, border: "none", borderRadius: 6, cursor: "pointer", background: "transparent" }}
                      />
                      <input
                        type="text"
                        value={brandColor || "#8b5cf6"}
                        onChange={(e) => setBrandColor?.(e.target.value)}
                        style={{ fontSize: 11, padding: "6px 8px", borderRadius: 8, background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.1)", color: "#fff", width: "100%" }}
                      />
                    </div>
                  </div>

                  <div>
                    <label style={{ fontSize: 11, fontWeight: 700, color: "rgba(255,255,255,0.8)", marginBottom: 4, display: "block" }}>
                      Brand Secondary Color
                    </label>
                    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                      <input
                        type="color"
                        value={brandSecondaryColor || "#0f172a"}
                        onChange={(e) => setBrandSecondaryColor?.(e.target.value)}
                        style={{ width: 36, height: 32, border: "none", borderRadius: 6, cursor: "pointer", background: "transparent" }}
                      />
                      <input
                        type="text"
                        value={brandSecondaryColor || "#0f172a"}
                        onChange={(e) => setBrandSecondaryColor?.(e.target.value)}
                        style={{ fontSize: 11, padding: "6px 8px", borderRadius: 8, background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.1)", color: "#fff", width: "100%" }}
                      />
                    </div>
                  </div>
                </div>

                <div>
                  <label style={{ fontSize: 11, fontWeight: 700, color: "rgba(255,255,255,0.8)", marginBottom: 4, display: "block" }}>
                    Footer Watermark / Copyright Text
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. © 2026 Acme Corp | Confidential & Proprietary"
                    value={brandFooter || ""}
                    onChange={(e) => setBrandFooter?.(e.target.value)}
                    style={{ fontSize: 11, padding: "8px 10px", borderRadius: 8, background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.1)", color: "#fff", width: "100%" }}
                  />
                </div>
              </>
            )}
          </div>
        )}
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



