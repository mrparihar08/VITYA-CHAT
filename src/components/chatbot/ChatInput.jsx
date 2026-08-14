import React from "react";

export const MODES = [
  { key: "chat", label: "Chat", hint: "Default mode" },
  { key: "news", label: "News", hint: "Latest updates" },
  { key: "wiki", label: "Wikipedia", hint: "Search knowledge" },
  { key: "file", label: "Create File", hint: "Generate PPT output" },
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
}) => {
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
              marginBottom: 10,
              width: 240,
              borderRadius: 20,
              background: "rgba(18, 24, 40, 0.95)",
              border: "1px solid rgba(255,255,255,0.10)",
              boxShadow: "0 20px 50px rgba(0,0,0,0.5)",
              padding: 8,
              zIndex: 100,
              display: "grid",
              gap: 4,
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
                  padding: "10px 12px",
                  borderRadius: 12,
                  border: "none",
                  background: mode === item.key ? "rgba(139,92,246,0.2)" : "transparent",
                  color: "#fff",
                  cursor: "pointer",
                  textAlign: "left",
                  transition: "background 0.15s ease",
                }}
              >
                <div style={{ fontSize: 14, fontWeight: 700 }}>{item.label}</div>
                <div style={{ fontSize: 11, opacity: 0.6, marginTop: 2 }}>{item.hint}</div>
              </button>
            ))}
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
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={placeholderMap[mode] || "Ask Vitya anything…"}
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
