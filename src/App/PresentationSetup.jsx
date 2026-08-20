import React from "react";
import { PPT_CATEGORIES } from "./PPT_Prompt";

function Toggle({ label, checked, onChange }) {
  return (
    <label
      className="toggle-row"
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        fontSize: "12px",
        background: "rgba(255,255,255,0.03)",
        padding: "6px 10px",
        borderRadius: "8px",
        border: "1px solid rgba(255,255,255,0.08)",
        cursor: "pointer",
        userSelect: "none",
      }}
    >
      <span>{label}</span>
      <input
        type="checkbox"
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
        style={{ cursor: "pointer" }}
      />
    </label>
  );
}

export default function PresentationSetup({
  prompt,
  setPrompt,
  slideCount,
  setSlideCount,
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
  includeCitations,
  setIncludeCitations,
  includeSpeakerNotes,
  setIncludeSpeakerNotes,
  useGemini,
  setUseGemini,
  smartMode,
  setSmartMode,
  allowImage,
  setAllowImage,
  allowChart,
  setAllowChart,
  allowTable,
  setAllowTable,
  allowParagraph,
  setAllowParagraph,
  searchQuery,
  setSearchQuery,
  selectedCategory,
  setSelectedCategory,
  searchResults,
  isSearching,
  loadingPlan,
  loadingGenerate,
  error,
  fetchPlan,
  handlePerformSearch,
  handleSelectTopicFromSearch,
}) {
  return (
    <div className="card-box ppt-setup-card" style={{ marginBottom: "20px" }}>
      <div className="section-label">TOPIC SEARCH & SETUP</div>

      {/* SEARCH FORM */}
      <form onSubmit={handlePerformSearch} className="search-box-wrap">
        <input
          type="text"
          className="search-input"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search presentation topics..."
        />
        <button type="submit" className="btn-ui primary sm">
          🔍 Search
        </button>
      </form>

      {/* CATEGORY CHIPS */}
      <div className="category-chips" style={{ marginBottom: "12px" }}>
        {PPT_CATEGORIES?.map((cat) => (
          <button
            type="button"
            key={cat.id}
            className={`category-chip ${selectedCategory === cat.id ? "active" : ""}`}
            onClick={() => setSelectedCategory(cat.id)}
          >
            {cat.label}
          </button>
        ))}
      </div>

      {/* SEARCH RESULTS DROPDOWN */}
      {searchResults?.length > 0 ? (
        <div className="search-results-container" style={{ marginBottom: "12px" }}>
          <div style={{ fontSize: 11, color: "var(--accent)", fontWeight: "bold" }}>
            Matching Topics ({searchResults.length}):
          </div>
          {searchResults.map((item) => (
            <button
              type="button"
              key={item.id}
              className="search-result-card"
              onClick={() => handleSelectTopicFromSearch(item)}
            >
              <div style={{ fontWeight: 700, fontSize: 13, color: "#fff" }}>
                {item.icon} {item.title}
              </div>
              <div style={{ fontSize: 11, color: "var(--text-muted)", marginTop: 2 }}>
                {item.desc}
              </div>
            </button>
          ))}
        </div>
      ) : isSearching ? (
        <div style={{ fontSize: 12, color: "var(--text-muted)", marginBottom: 12 }}>
          No exact topic match found. Enter custom prompt details below!
        </div>
      ) : null}

      {/* PROMPT INPUT */}
      <div className="field-group" style={{ marginBottom: "12px" }}>
        <label style={{ fontSize: 12, fontWeight: 600, marginBottom: 4, display: "block" }}>
          Presentation Topic / AI Prompt
        </label>
        <textarea
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          rows={4}
          placeholder="Describe your presentation topic, key points, or instructions..."
        />
      </div>

      {/* SLIDE COUNT, AUDIENCE, TONE & LANGUAGE */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginBottom: 12 }}>
        <div className="field-group">
          <label style={{ fontSize: 11 }}>Slide Count (3-30)</label>
          <input
            type="number"
            min="3"
            max="30"
            value={slideCount}
            onChange={(e) => setSlideCount?.(Number(e.target.value))}
          />
        </div>

        <div className="field-group">
          <label style={{ fontSize: 11 }}>Target Audience</label>
          <input
            value={audience || ""}
            onChange={(e) => setAudience?.(e.target.value)}
            placeholder="e.g. Students & Professionals"
          />
        </div>

        <div className="field-group">
          <label style={{ fontSize: 11 }}>Tone of Voice</label>
          <select
            className="select-input"
            value={tone || "Professional"}
            onChange={(e) => setTone?.(e.target.value)}
            style={{ width: "100%", padding: "8px", borderRadius: "6px" }}
          >
            <option value="Professional">Professional & Clean</option>
            <option value="Inspiring">Inspiring & Energetic</option>
            <option value="Educational">Educational & Detailed</option>
            <option value="Formal">Formal & Executive</option>
          </select>
        </div>

        <div className="field-group">
          <label style={{ fontSize: 11 }}>Output Language</label>
          <select
            className="select-input"
            value={language || "English"}
            onChange={(e) => setLanguage?.(e.target.value)}
            style={{ width: "100%", padding: "8px", borderRadius: "6px" }}
          >
            <option value="English">English</option>
            <option value="Hindi">Hindi</option>
            <option value="Hinglish">Hinglish</option>
            <option value="Spanish">Spanish</option>
            <option value="French">French</option>
            <option value="German">German</option>
          </select>
        </div>
      </div>

      {/* THEME & VISUAL STYLE SELECTION */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginBottom: 14 }}>
        <div className="field-group">
          <label style={{ fontSize: 11 }}>Color Theme</label>
          <select
            className="select-input"
            value={contentTheme || "auto"}
            onChange={(e) => setContentTheme?.(e.target.value)}
            style={{ width: "100%", padding: "8px", borderRadius: "6px" }}
          >
            <option value="auto">✨ Auto Detect</option>
            <option value="dark">🌙 Midnight Dark</option>
            <option value="light">☀️ Clean Light</option>
            <option value="emerald">🌿 Emerald Tech</option>
            <option value="startup">🔥 Startup Fire</option>
            <option value="finance">💰 Finance Gold</option>
            <option value="medical">🏥 Medical Care</option>
          </select>
        </div>

        <div className="field-group">
          <label style={{ fontSize: 11 }}>Visual Style</label>
          <select
            className="select-input"
            value={visualStyle || "minimal"}
            onChange={(e) => setVisualStyle?.(e.target.value)}
            style={{ width: "100%", padding: "8px", borderRadius: "6px" }}
          >
            <option value="minimal">Minimalist</option>
            <option value="modern_gradient">Modern Gradient</option>
            <option value="corporate">Corporate Clean</option>
            <option value="academic">Academic Paper</option>
          </select>
        </div>
      </div>

      {/* AI & LAYOUT TOGGLES GRID */}
      <div style={{ fontSize: 11, fontWeight: "bold", color: "var(--accent)", marginBottom: 6 }}>
        LAYOUT & AI FEATURES
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8, marginBottom: "14px" }}>
        <Toggle label="Speaker Notes" checked={includeSpeakerNotes} onChange={setIncludeSpeakerNotes} />
        <Toggle label="Citations" checked={includeCitations} onChange={setIncludeCitations} />
        <Toggle label="Gemini AI" checked={useGemini} onChange={setUseGemini} />
        <Toggle label="Smart Mode" checked={smartMode} onChange={setSmartMode} />
        <Toggle label="Auto Images (Unsplash)" checked={allowImage ?? true} onChange={setAllowImage} />
        <Toggle label="Charts & Graphs" checked={allowChart ?? true} onChange={setAllowChart} />
        <Toggle label="Data Tables" checked={allowTable ?? true} onChange={setAllowTable} />
        <Toggle label="Paragraph Summaries" checked={allowParagraph ?? true} onChange={setAllowParagraph} />
      </div>

      {error ? <div style={{ color: "#fca5a5", fontSize: 12, marginBottom: 10 }}>{error}</div> : null}

      <button
        className="btn-ui primary"
        style={{ width: "100%", marginTop: 10, padding: "14px", fontSize: 15 }}
        onClick={fetchPlan}
        disabled={loadingPlan || loadingGenerate}
      >
        {loadingPlan ? "Creating Deck..." : "⚡ Generate AI Slide Deck"}
      </button>
    </div>
  );
}
