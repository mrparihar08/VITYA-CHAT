import React from "react";

export const MODES = [
  { key: "chat", label: "💬 Chat", hint: "Default AI Assistant" },
  { key: "news", label: "📰 News", hint: "Search latest news & headlines" },
  { key: "wiki", label: "📚 Wikipedia", hint: "Search encyclopedia knowledge" },
  { key: "file", label: "📁 Create Presentation", hint: "Generate PPT slide deck" },
];

export const placeholderMap = {
  chat: "Ask Vitya anything…",
  news: "Type news topic (e.g. India Economy)…",
  wiki: "Search Wikipedia (e.g. Quantum Computing)…",
  file: "Describe presentation (e.g. AI Trends)…",
};

export const ChatInput = ({
  input,
  setInput,
  sendMessage,
  loading,
  listening,
  mode,
  openMode,
  plusOpen,
  setPlusOpen,
  handleMicClick,
  toggleVoiceEnabled,
  getMicIcon,
  menuRef,
  useWebSearch = true,
  setUseWebSearch,
  ragDocs = [],
  handleFileUpload,
  handleClearDocs,
}) => {
  const [pluginsExpanded, setPluginsExpanded] = React.useState(false);
  const inputRef = React.useRef(null);

  const getPlaceholder = () => {
    if (input.startsWith("/image")) return "Type AI image description (e.g. /image cyberpunk city 8k)…";
    return placeholderMap[mode] || "Ask Vitya anything…";
  };

  return (
    <div
      style={{
        padding: "12px 18px",
        background: "rgba(15, 20, 36, 0.72)",
        backdropFilter: "blur(14px)",
        borderTop: "1px solid rgba(255,255,255,0.08)",
        flexShrink: 0,
      }}
    >
      <div style={{ position: "relative", maxWidth: 900, margin: "0 auto" }} ref={menuRef}>
        {plusOpen && (
          <div
            style={{
              position: "absolute",
              bottom: "100%",
              left: 0,
              marginBottom: 6,
              width: 200,
              borderRadius: 14,
              background: "rgba(18, 24, 40, 0.96)",
              border: "1px solid rgba(255,255,255,0.12)",
              boxShadow: "0 16px 40px rgba(0,0,0,0.55)",
              padding: 5,
              zIndex: 100,
              display: "grid",
              gap: 2,
            }}
          >
            {MODES.map((item) => (
              <button
                key={item.key}
                onClick={() => openMode(item.key)}
                style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "flex-start",
                  padding: "6px 8px",
                  borderRadius: 8,
                  border: "none",
                  background: mode === item.key ? "rgba(139,92,246,0.22)" : "transparent",
                  color: "#fff",
                  cursor: "pointer",
                  textAlign: "left",
                  transition: "background 0.15s ease",
                }}
              >
                <div style={{ fontSize: 12, fontWeight: 700 }}>{item.label}</div>
                <div style={{ fontSize: 10, opacity: 0.6, marginTop: 1 }}>{item.hint}</div>
              </button>
            ))}

            {/* EXPANDABLE PLUGINS & TOOLS SECTION */}
            <button
              type="button"
              onClick={() => setPluginsExpanded((v) => !v)}
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                padding: "6px 8px",
                borderRadius: 8,
                border: "none",
                background: "rgba(244,63,94,0.14)",
                color: "#fff",
                cursor: "pointer",
                textAlign: "left",
                marginTop: 2,
                transition: "background 0.15s ease",
              }}
            >
              <div>
                <div style={{ fontSize: 12, fontWeight: 700, color: "#f43f5e", display: "flex", alignItems: "center", gap: 5 }}>
                  <span>🧩</span> Plugins & Tools
                </div>
                <div style={{ fontSize: 10, opacity: 0.7, marginTop: 1 }}>AI Image, Web Search & RAG</div>
              </div>
              <span style={{ fontSize: 10, color: "#f43f5e", fontWeight: 900 }}>
                {pluginsExpanded ? "▲" : "▼"}
              </span>
            </button>

            {pluginsExpanded && (
              <div style={{ display: "grid", gap: 2, paddingLeft: 4, borderLeft: "2px solid rgba(244,63,94,0.3)", marginLeft: 4, marginTop: 2 }}>
                {/* TOOL 1: AI IMAGE GENERATOR */}
                <button
                  type="button"
                  onClick={() => {
                    setPlusOpen(false);
                    setInput("/image ");
                    setTimeout(() => inputRef.current?.focus(), 50);
                  }}
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "flex-start",
                    padding: "5px 8px",
                    borderRadius: 6,
                    border: "none",
                    background: "transparent",
                    color: "#fff",
                    cursor: "pointer",
                    textAlign: "left",
                  }}
                >
                  <div style={{ fontSize: 11, fontWeight: 700, display: "flex", alignItems: "center", gap: 5 }}>
                    🎨 AI Image Generator
                  </div>
                  <div style={{ fontSize: 9, opacity: 0.6, marginTop: 1 }}>Fill /image prompt in search bar</div>
                </button>

                {/* TOOL 2: LIVE WEB SEARCH TOGGLE */}
                {setUseWebSearch && (
                  <button
                    type="button"
                    onClick={() => {
                      setUseWebSearch((v) => !v);
                    }}
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "flex-start",
                      padding: "5px 8px",
                      borderRadius: 6,
                      border: "none",
                      background: "transparent",
                      color: "#fff",
                      cursor: "pointer",
                      textAlign: "left",
                    }}
                  >
                    <div style={{ fontSize: 11, fontWeight: 700, display: "flex", alignItems: "center", gap: 5 }}>
                      🌐 Web Search: {useWebSearch ? "ON ✅" : "OFF ❌"}
                    </div>
                    <div style={{ fontSize: 9, opacity: 0.6, marginTop: 1 }}>Toggle live DuckDuckGo facts</div>
                  </button>
                )}

                {/* TOOL 3: MULTI-DOC RAG Q&A */}
                {handleFileUpload && (
                  <label
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "flex-start",
                      padding: "5px 8px",
                      borderRadius: 6,
                      border: "none",
                      background: "transparent",
                      color: "#fff",
                      cursor: "pointer",
                      textAlign: "left",
                    }}
                  >
                    <div style={{ fontSize: 11, fontWeight: 700, display: "flex", alignItems: "center", gap: 5 }}>
                      📎 Upload Document
                    </div>
                    <div style={{ fontSize: 9, opacity: 0.6, marginTop: 1 }}>PDF, CSV, TXT for Multi-Doc Q&A</div>
                    <input
                      type="file"
                      multiple
                      accept=".pdf,.csv,.txt,.docx"
                      style={{ display: "none" }}
                      onChange={(e) => {
                        setPlusOpen(false);
                        handleFileUpload(e);
                      }}
                    />
                  </label>
                )}
              </div>
            )}
          </div>
        )}

        {/* ACTIVE RAG DOCUMENT BADGES */}
        {ragDocs && ragDocs.length > 0 && (
          <div style={{ display: "flex", gap: 6, flexWrap: "wrap", marginBottom: 8, padding: "0 4px", alignItems: "center" }}>
            {ragDocs.map((doc, idx) => (
              <div
                key={idx}
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 6,
                  fontSize: 11,
                  fontWeight: 700,
                  background: "rgba(139, 92, 246, 0.2)",
                  border: "1px solid rgba(139, 92, 246, 0.4)",
                  color: "#c084fc",
                  padding: "3px 10px",
                  borderRadius: 999,
                }}
              >
                <span>📑 {doc.filename}</span>
                <span style={{ fontSize: 10, opacity: 0.7 }}>({doc.chunk_count} chunks)</span>
              </div>
            ))}
            <button
              onClick={handleClearDocs}
              style={{
                fontSize: 10,
                background: "transparent",
                border: "none",
                color: "#fca5a5",
                cursor: "pointer",
                fontWeight: 700,
                padding: "2px 6px",
              }}
            >
              × Clear Docs
            </button>
          </div>
        )}

        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 10,
            background: "rgba(255,255,255,0.05)",
            border: "1px solid rgba(255,255,255,0.10)",
            borderRadius: 22,
            padding: "6px 10px",
          }}
        >
          <button
            onClick={() => setPlusOpen((v) => !v)}
            style={{
              width: 38,
              height: 38,
              borderRadius: 14,
              border: "none",
              background: "rgba(255,255,255,0.06)",
              color: "#fff",
              cursor: "pointer",
              display: "grid",
              placeItems: "center",
              flexShrink: 0,
            }}
            title="More actions"
          >
            <img src="/plus.png" alt="Plus" style={{ width: 16, height: 16 }} />
          </button>

          <input
            ref={inputRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={getPlaceholder()}
            style={{
              flex: 1,
              background: "transparent",
              border: "none",
              outline: "none",
              color: "#fff",
              fontSize: 15,
              padding: "8px 4px",
            }}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                sendMessage();
              }
            }}
          />

          <button
            onClick={handleMicClick}
            onContextMenu={(e) => {
              e.preventDefault();
              toggleVoiceEnabled();
            }}
            title="Click to talk. Right-click to turn voice on/off."
            style={{
              width: 38,
              height: 38,
              borderRadius: 14,
              border: "none",
              background: listening ? "rgba(139,92,246,0.25)" : "rgba(255,255,255,0.06)",
              boxShadow: listening ? "0 0 0 4px rgba(139,92,246,0.2)" : "none",
              color: "#fff",
              cursor: "pointer",
              display: "grid",
              placeItems: "center",
              flexShrink: 0,
            }}
          >
            <img src={getMicIcon()} alt="Mic" style={{ width: 18, height: 18 }} />
          </button>

          <button
            onClick={() => sendMessage()}
            disabled={loading}
            style={{
              width: 42,
              height: 42,
              borderRadius: 16,
              border: "none",
              background: "linear-gradient(135deg, #8b5cf6 0%, #6366f1 100%)",
              color: "#fff",
              cursor: loading ? "not-allowed" : "pointer",
              opacity: loading ? 0.7 : 1,
              display: "grid",
              placeItems: "center",
              flexShrink: 0,
              boxShadow: "0 8px 18px rgba(99,102,241,0.3)",
            }}
          >
            <img src="/send.png" alt="Send" style={{ width: 18, height: 18 }} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChatInput;
