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
  includeCitations,
  setIncludeCitations,
  includeSpeakerNotes,
  setIncludeSpeakerNotes,
  useGemini,
  setUseGemini,
  smartMode,
  setSmartMode,
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
      <div className="category-chips">
        {PPT_CATEGORIES.map((cat) => (
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
      {searchResults.length > 0 ? (
        <div className="search-results-container">
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
      <div className="field-group">
        <label>Presentation Topic / AI Prompt</label>
        <textarea
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          rows={4}
          placeholder="Describe your presentation topic or instructions..."
        />
      </div>

      {/* SLIDE COUNT & AUDIENCE */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
        <div className="field-group">
          <label>Slide Count</label>
          <input
            type="number"
            min="3"
            max="30"
            value={slideCount}
            onChange={(e) => setSlideCount(Number(e.target.value))}
          />
        </div>
        <div className="field-group">
          <label>Audience</label>
          <input
            value={audience}
            onChange={(e) => setAudience(e.target.value)}
            placeholder="e.g. Students & Professionals"
          />
        </div>
      </div>

      {/* TOGGLES GRID */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8, margin: "14px 0" }}>
        <Toggle label="Speaker Notes" checked={includeSpeakerNotes} onChange={setIncludeSpeakerNotes} />
        <Toggle label="Citations" checked={includeCitations} onChange={setIncludeCitations} />
        <Toggle label="Gemini AI" checked={useGemini} onChange={setUseGemini} />
        <Toggle label="Smart Mode" checked={smartMode} onChange={setSmartMode} />
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
