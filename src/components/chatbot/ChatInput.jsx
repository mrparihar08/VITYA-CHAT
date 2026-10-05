import React from "react";
import { Paperclip, Camera, X, Image as ImageIcon } from "lucide-react";

export const MODES = [
  { key: "chat", label: "Chat", hint: "Default AI Assistant" },
  { key: "dora", label: "DORA Health AI", hint: "Medical & Symptom Consultant" },
  { key: "websearch", label: "Web Search", hint: "Live web search & facts" },
  { key: "news", label: "News", hint: "Search latest news & headlines" },
  { key: "wiki", label: "Wikipedia", hint: "Search encyclopedia knowledge" },
];

export const placeholderMap = {
  chat: "Ask Vitya anything, upload an image, or ask for charts…",
  dora: "Describe symptoms or ask a health question (e.g. fever & throat pain)…",
  news: "Type news topic (e.g. India Economy)…",
  wiki: "Search Wikipedia (e.g. Quantum Computing)…",
  file: "Describe presentation (e.g. AI Trends)…",
};

export const QUICK_ACTIONS = [
  { label: "💳 Balance", query: "my balance" },
  { label: "📊 Pie Chart", query: "show pie chart for expenses" },
  { label: "📅 Subscriptions", query: "my subscriptions" },
  { label: "🎯 Goals", query: "my savings goals" },
  { label: "🩺 Health Score", query: "financial health score" },
  { label: "📈 Report", query: "monthly report" },
  { label: "🌦️ Weather", query: "weather in Delhi" },
  { label: "📰 Tech News", query: "/news tech" },
];

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
  handleReceiptUpload,
  attachedImages = [],
  setAttachedImages,
  onImageSelect,
  removeAttachedImage,
}) => {
  const [pluginsExpanded, setPluginsExpanded] = React.useState(false);
  const [isCameraOpen, setIsCameraOpen] = React.useState(false);
  const [cameraError, setCameraError] = React.useState(null);
  const inputRef = React.useRef(null);
  const imageInputRef = React.useRef(null);
  const cameraInputRef = React.useRef(null);
  const receiptInputRef = React.useRef(null);
  const videoRef = React.useRef(null);
  const streamRef = React.useRef(null);

  const startLiveCamera = async () => {
    setCameraError(null);
    try {
      if (!navigator?.mediaDevices?.getUserMedia) {
        throw new Error("Camera API not supported in this browser");
      }
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: { ideal: "environment" }, width: { ideal: 1280 }, height: { ideal: 720 } },
        audio: false,
      });
      streamRef.current = stream;
      setIsCameraOpen(true);
      setTimeout(() => {
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          videoRef.current.play().catch((e) => console.warn("Video play error:", e));
        }
      }, 150);
    } catch (err) {
      console.warn("Live camera error, falling back to input capture:", err);
      if (cameraInputRef.current) {
        cameraInputRef.current.click();
      } else {
        setCameraError(err.message || "Failed to open camera");
      }
    }
  };

  const stopLiveCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }
    setIsCameraOpen(false);
    setCameraError(null);
  };

  const capturePhoto = () => {
    if (!videoRef.current) return;
    const video = videoRef.current;
    const canvas = document.createElement("canvas");
    canvas.width = video.videoWidth || 640;
    canvas.height = video.videoHeight || 480;
    const ctx = canvas.getContext("2d");
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

    canvas.toBlob(
      (blob) => {
        if (blob) {
          const file = new File([blob], `camera_capture_${Date.now()}.jpg`, { type: "image/jpeg" });
          if (onImageSelect) {
            onImageSelect([file]);
          } else if (setAttachedImages) {
            const preview = URL.createObjectURL(file);
            setAttachedImages((prev) => [...prev, { file, preview, id: Math.random().toString(36).substring(2, 9) }]);
          }
        }
        stopLiveCamera();
      },
      "image/jpeg",
      0.92
    );
  };

  React.useEffect(() => {
    return () => {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((track) => track.stop());
      }
    };
  }, []);

  const getPlaceholder = () => {
    if (attachedImages.length > 0) return "Ask anything about this image (or press Send for full analysis)…";
    if (input.startsWith("/image")) return "Type AI image description (e.g. /image cyberpunk city 8k)…";
    if (input.startsWith("/presentation") || input.startsWith("/ppt")) return "Type topic (e.g. /presentation India in BRICS)…";
    if (input.startsWith("/news")) return "Type news topic (e.g. /news stock market)…";
    if (input.startsWith("/wiki")) return "Type subject (e.g. /wiki quantum physics)…";
    if (input.startsWith("/dora")) return "Describe symptoms for Dora AI (e.g. /dora fever and throat pain)…";
    return placeholderMap[mode] || "Ask Vitya anything, upload an image, log an expense, or ask for charts…";
  };

  const handleImageInputChange = (e) => {
    const files = Array.from(e.target.files || []);
    if (!files.length) return;

    if (onImageSelect) {
      onImageSelect(files);
    } else if (setAttachedImages) {
      const newImages = files.map((file) => ({
        file,
        preview: URL.createObjectURL(file),
        id: Math.random().toString(36).substring(2, 9),
      }));
      setAttachedImages((prev) => [...prev, ...newImages]);
    }
    e.target.value = "";
  };

  const getThumbnailSrc = (img) => {
    if (!img) return "";
    if (img.preview) return img.preview;
    if (typeof img === "string") return img;
    if (img instanceof Blob || img instanceof File) {
      return URL.createObjectURL(img);
    }
    return "";
  };

  const getImgFileName = (img, idx) => {
    if (!img) return `Image ${idx + 1}`;
    if (img.name) return img.name;
    if (img.file?.name) return img.file.name;
    return `Image ${idx + 1}`;
  };

  return (
    <div
      style={{
        padding: "8px 18px 14px 18px",
        background: "transparent",
        backdropFilter: "none",
        borderTop: "none",
        flexShrink: 0,
      }}
    >
      <div style={{ position: "relative", maxWidth: 900, margin: "0 auto" }} ref={menuRef}>
        {/* QUICK SUGGESTION CHIPS */}
        <div
          style={{
            display: "flex",
            gap: 6,
            overflowX: "auto",
            paddingBottom: 8,
            scrollbarWidth: "none",
            msOverflowStyle: "none",
            alignItems: "center",
          }}
        >
          {QUICK_ACTIONS.map((action, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => {
                setInput(action.query);
                setTimeout(() => sendMessage(action.query), 50);
              }}
              style={{
                fontSize: 11,
                fontWeight: 600,
                color: "rgba(255,255,255,0.85)",
                background: "rgba(255,255,255,0.06)",
                border: "1px solid rgba(255,255,255,0.1)",
                borderRadius: 999,
                padding: "4px 12px",
                whiteSpace: "nowrap",
                cursor: "pointer",
                transition: "all 0.15s ease",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = "rgba(139,92,246,0.25)";
                e.currentTarget.style.borderColor = "rgba(139,92,246,0.4)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = "rgba(255,255,255,0.06)";
                e.currentTarget.style.borderColor = "rgba(255,255,255,0.1)";
              }}
            >
              {action.label}
            </button>
          ))}
        </div>

        {/* PLUS / ACTIONS MENU */}
        {plusOpen && (
          <div
            style={{
              position: "absolute",
              bottom: "100%",
              left: 0,
              marginBottom: 6,
              width: 220,
              maxHeight: 330,
              overflowY: "auto",
              borderRadius: 14,
              background: "#0d1322",
              border: "1px solid rgba(255, 255, 255, 0.16)",
              boxShadow: "0 16px 40px rgba(0, 0, 0, 0.85), 0 0 0 1px rgba(255, 255, 255, 0.08)",
              padding: 5,
              zIndex: 999,
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
                  padding: "5px 8px",
                  borderRadius: 7,
                  border: "none",
                  background: mode === item.key ? "rgba(139, 92, 246, 0.25)" : "transparent",
                  color: "#fff",
                  cursor: "pointer",
                  textAlign: "left",
                  transition: "background 0.12s ease",
                }}
                onMouseEnter={(e) => {
                  if (mode !== item.key) e.currentTarget.style.background = "rgba(255, 255, 255, 0.06)";
                }}
                onMouseLeave={(e) => {
                  if (mode !== item.key) e.currentTarget.style.background = "transparent";
                }}
              >
                <div style={{ fontSize: 11.5, fontWeight: 700, lineHeight: 1.2 }}>{item.label}</div>
                <div style={{ fontSize: 9.5, opacity: 0.65, marginTop: 1, lineHeight: 1.1 }}>{item.hint}</div>
              </button>
            ))}

            <div style={{ height: 1, background: "rgba(255, 255, 255, 0.1)", margin: "2px 2px" }} />

            {/* ATTACH IMAGE FROM DISK */}
            <button
              type="button"
              onClick={() => {
                setPlusOpen(false);
                imageInputRef.current?.click();
              }}
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "flex-start",
                padding: "5px 8px",
                borderRadius: 7,
                border: "1px solid rgba(59, 130, 246, 0.3)",
                background: "rgba(59, 130, 246, 0.12)",
                color: "#60a5fa",
                cursor: "pointer",
                textAlign: "left",
                transition: "all 0.12s ease",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = "rgba(59, 130, 246, 0.22)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = "rgba(59, 130, 246, 0.12)";
              }}
            >
              <div style={{ fontSize: 11.5, fontWeight: 700, display: "flex", alignItems: "center", gap: 5, lineHeight: 1.2 }}>
                <Paperclip size={13} color="#60a5fa" /> Attach Image
              </div>
              <div style={{ fontSize: 9.5, color: "#94a3b8", marginTop: 1, lineHeight: 1.1 }}>Photo, chart, notes, screenshot</div>
            </button>

            {/* CAMERA CAPTURE */}
            <button
              type="button"
              onClick={() => {
                setPlusOpen(false);
                startLiveCamera();
              }}
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "flex-start",
                padding: "5px 8px",
                borderRadius: 7,
                border: "1px solid rgba(168, 85, 247, 0.3)",
                background: "rgba(168, 85, 247, 0.12)",
                color: "#c084fc",
                cursor: "pointer",
                textAlign: "left",
                transition: "all 0.12s ease",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = "rgba(168, 85, 247, 0.22)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = "rgba(168, 85, 247, 0.12)";
              }}
            >
              <div style={{ fontSize: 11.5, fontWeight: 700, display: "flex", alignItems: "center", gap: 5, lineHeight: 1.2 }}>
                <Camera size={13} color="#c084fc" /> Camera Photo
              </div>
              <div style={{ fontSize: 9.5, color: "#94a3b8", marginTop: 1, lineHeight: 1.1 }}>Take picture directly</div>
            </button>

            {/* RECEIPT & BILL SCANNER OPTION */}
            {handleReceiptUpload && (
              <button
                type="button"
                onClick={() => {
                  setPlusOpen(false);
                  receiptInputRef.current?.click();
                }}
                style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "flex-start",
                  padding: "5px 8px",
                  borderRadius: 7,
                  border: "1px solid rgba(168, 85, 129, 0.3)",
                  background: "rgba(16, 185, 129, 0.12)",
                  color: "#34d399",
                  cursor: "pointer",
                  textAlign: "left",
                  transition: "all 0.12s ease",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = "rgba(16, 185, 129, 0.22)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = "rgba(16, 185, 129, 0.12)";
                }}
              >
                <div style={{ fontSize: 11.5, fontWeight: 700, display: "flex", alignItems: "center", gap: 5, lineHeight: 1.2 }}>
                  <span>🧾</span> Scan Receipt / Bill
                </div>
                <div style={{ fontSize: 9.5, color: "#94a3b8", marginTop: 1, lineHeight: 1.1 }}>AI Vision expense extraction</div>
              </button>
            )}

            {/* EXPANDABLE PLUGINS & TOOLS SECTION */}
            <button
              type="button"
              onClick={() => setPluginsExpanded((v) => !v)}
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                padding: "5px 8px",
                borderRadius: 7,
                border: "none",
                background: "rgba(244,63,94,0.12)",
                color: "#fff",
                cursor: "pointer",
                textAlign: "left",
                marginTop: 1,
                transition: "background 0.12s ease",
              }}
            >
              <div>
                <div style={{ fontSize: 11.5, fontWeight: 700, color: "#f43f5e", display: "flex", alignItems: "center", gap: 4, lineHeight: 1.2 }}>
                  <span>🧩</span> Plugins & Tools
                </div>
                <div style={{ fontSize: 9.5, opacity: 0.75, marginTop: 1, lineHeight: 1.1 }}>PPT, AI Image, Web & Docs</div>
              </div>
              <span style={{ fontSize: 9, color: "#f43f5e", fontWeight: 900 }}>
                {pluginsExpanded ? "▲" : "▼"}
              </span>
            </button>

            {pluginsExpanded && (
              <div style={{ display: "grid", gap: 2, paddingLeft: 4, borderLeft: "2px solid rgba(244,63,94,0.3)", marginLeft: 4, marginTop: 2 }}>
                {/* TOOL 0: PRESENTATION GENERATOR SLASH COMMAND */}
                <button
                  type="button"
                  onClick={() => {
                    setPlusOpen(false);
                    setInput("/presentation ");
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
                    📊 PPT Generator (/presentation)
                  </div>
                  <div style={{ fontSize: 9, opacity: 0.7, marginTop: 1 }}>Fill /presentation [topic] prompt</div>
                </button>

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
                      🌐 Web Search {useWebSearch ? "(ON)" : "(OFF)"}
                    </div>
                    <div style={{ fontSize: 9, opacity: 0.6, marginTop: 1 }}>Toggle live Google/Web facts</div>
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

        {/* HIDDEN IMAGE & CAMERA INPUTS */}
        <input
          ref={imageInputRef}
          type="file"
          multiple
          accept="image/png,image/jpeg,image/jpg,image/webp,image/gif,image/bmp"
          style={{ display: "none" }}
          onChange={handleImageInputChange}
        />
        <input
          ref={cameraInputRef}
          type="file"
          accept="image/*"
          capture="environment"
          style={{ display: "none" }}
          onChange={handleImageInputChange}
        />

        {/* HIDDEN RECEIPT UPLOAD INPUT */}
        <input
          ref={receiptInputRef}
          type="file"
          accept="image/*"
          style={{ display: "none" }}
          onChange={(e) => {
            if (e.target.files?.[0] && handleReceiptUpload) {
              handleReceiptUpload(e.target.files[0]);
            }
            e.target.value = "";
          }}
        />

        {/* ATTACHED IMAGE PREVIEWS */}
        {attachedImages && attachedImages.length > 0 && (
          <div
            style={{
              display: "flex",
              gap: 8,
              alignItems: "center",
              flexWrap: "wrap",
              marginBottom: 8,
              padding: "6px 12px",
              background: "rgba(15, 23, 42, 0.75)",
              border: "1px solid rgba(139, 92, 246, 0.35)",
              borderRadius: 14,
              backdropFilter: "blur(8px)",
            }}
          >
            <div style={{ fontSize: 11, fontWeight: 700, color: "#a78bfa", display: "flex", alignItems: "center", gap: 4 }}>
              <ImageIcon size={14} /> Attached ({attachedImages.length}):
            </div>
            {attachedImages.map((img, idx) => {
              const src = getThumbnailSrc(img);
              const name = getImgFileName(img, idx);
              return (
                <div
                  key={img.id || idx}
                  style={{
                    position: "relative",
                    display: "inline-flex",
                    alignItems: "center",
                    gap: 6,
                    background: "rgba(255, 255, 255, 0.08)",
                    border: "1px solid rgba(255, 255, 255, 0.15)",
                    borderRadius: 8,
                    padding: "3px 6px",
                  }}
                >
                  {src ? (
                    <img
                      src={src}
                      alt="Preview"
                      style={{ width: 28, height: 28, objectFit: "cover", borderRadius: 4 }}
                    />
                  ) : (
                    <ImageIcon size={16} color="#c084fc" />
                  )}
                  <span style={{ fontSize: 11, color: "#f8fafc", maxWidth: 110, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                    {name}
                  </span>
                  <button
                    type="button"
                    onClick={() => removeAttachedImage && removeAttachedImage(img.id || idx)}
                    style={{
                      border: "none",
                      background: "rgba(239, 68, 68, 0.3)",
                      color: "#fca5a5",
                      borderRadius: "50%",
                      width: 18,
                      height: 18,
                      display: "grid",
                      placeItems: "center",
                      cursor: "pointer",
                      padding: 0,
                    }}
                    title="Remove image"
                  >
                    <X size={11} />
                  </button>
                </div>
              );
            })}
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

        {/* INPUT BAR */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 8,
            background: "rgba(255,255,255,0.05)",
            border: "1px solid rgba(255,255,255,0.10)",
            borderRadius: 22,
            padding: "6px 10px",
          }}
        >
          {/* PLUS / ACTIONS MENU TRIGGER */}
          <button
            onClick={() => setPlusOpen((v) => !v)}
            style={{
              width: 36,
              height: 36,
              borderRadius: 12,
              border: "none",
              background: "rgba(255,255,255,0.06)",
              color: "#fff",
              cursor: "pointer",
              display: "grid",
              placeItems: "center",
              flexShrink: 0,
            }}
            title="More actions & plugins"
          >
            <img src="/plus.png" alt="Plus" style={{ width: 16, height: 16 }} />
          </button>

          {/* ATTACH IMAGE BUTTON */}
          <button
            type="button"
            onClick={() => imageInputRef.current?.click()}
            style={{
              width: 34,
              height: 34,
              borderRadius: 11,
              border: "none",
              background: attachedImages.length > 0 ? "rgba(59, 130, 246, 0.25)" : "rgba(255,255,255,0.06)",
              color: attachedImages.length > 0 ? "#60a5fa" : "rgba(255,255,255,0.75)",
              cursor: "pointer",
              display: "grid",
              placeItems: "center",
              flexShrink: 0,
              transition: "all 0.15s ease",
            }}
            title="Attach image (JPG, PNG, WEBP)"
          >
            <Paperclip size={16} />
          </button>

          {/* CAMERA BUTTON */}
          <button
            type="button"
            onClick={startLiveCamera}
            style={{
              width: 34,
              height: 34,
              borderRadius: 11,
              border: "none",
              background: isCameraOpen ? "rgba(168, 85, 247, 0.35)" : "rgba(255,255,255,0.06)",
              color: isCameraOpen ? "#c084fc" : "rgba(255,255,255,0.75)",
              cursor: "pointer",
              display: "grid",
              placeItems: "center",
              flexShrink: 0,
              transition: "all 0.15s ease",
            }}
            title="Capture photo with live camera"
          >
            <Camera size={16} />
          </button>

          {/* TEXT INPUT */}
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

          {/* VOICE INPUT BUTTON */}
          <button
            onClick={handleMicClick}
            onContextMenu={(e) => {
              e.preventDefault();
              toggleVoiceEnabled();
            }}
            title="Click to talk. Right-click to turn voice on/off."
            style={{
              width: 36,
              height: 36,
              borderRadius: 12,
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
            <img src={getMicIcon()} alt="Mic" style={{ width: 17, height: 17 }} />
          </button>

          {/* SEND BUTTON */}
          <button
            onClick={() => sendMessage()}
            disabled={loading}
            style={{
              width: 40,
              height: 40,
              borderRadius: 14,
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
            <img src="/send.png" alt="Send" style={{ width: 17, height: 17 }} />
          </button>
        </div>

        {/* LIVE CAMERA VIEWFINDER MODAL */}
        {isCameraOpen && (
          <div
            style={{
              position: "fixed",
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              background: "rgba(0, 0, 0, 0.85)",
              backdropFilter: "blur(14px)",
              zIndex: 10000,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              padding: 16,
            }}
          >
            <div
              style={{
                position: "relative",
                width: "100%",
                maxWidth: 520,
                background: "#0f172a",
                borderRadius: 22,
                border: "1px solid rgba(255, 255, 255, 0.16)",
                boxShadow: "0 25px 60px rgba(0, 0, 0, 0.85)",
                overflow: "hidden",
                display: "flex",
                flexDirection: "column",
              }}
            >
              {/* MODAL HEADER */}
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  padding: "14px 18px",
                  borderBottom: "1px solid rgba(255, 255, 255, 0.1)",
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 14.5, fontWeight: 700, color: "#f8fafc" }}>
                  <Camera size={18} color="#c084fc" /> Live Camera Viewfinder
                </div>
                <button
                  type="button"
                  onClick={stopLiveCamera}
                  style={{
                    border: "none",
                    background: "rgba(255, 255, 255, 0.1)",
                    color: "#cbd5e1",
                    borderRadius: "50%",
                    width: 30,
                    height: 30,
                    display: "grid",
                    placeItems: "center",
                    cursor: "pointer",
                  }}
                  title="Close Camera"
                >
                  <X size={16} />
                </button>
              </div>

              {/* VIDEO VIEWFINDER */}
              <div
                style={{
                  position: "relative",
                  width: "100%",
                  background: "#000",
                  minHeight: 300,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <video
                  ref={videoRef}
                  autoPlay
                  playsInline
                  muted
                  style={{ width: "100%", maxHeight: 380, objectFit: "cover" }}
                />
                {/* TARGETING RETICLE */}
                <div
                  style={{
                    position: "absolute",
                    inset: 20,
                    border: "2px dashed rgba(192, 132, 252, 0.5)",
                    borderRadius: 16,
                    pointerEvents: "none",
                  }}
                />
              </div>

              {/* MODAL CONTROLS */}
              <div
                style={{
                  padding: "16px 20px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  background: "#0d1322",
                  borderTop: "1px solid rgba(255, 255, 255, 0.08)",
                }}
              >
                <button
                  type="button"
                  onClick={() => {
                    stopLiveCamera();
                    imageInputRef.current?.click();
                  }}
                  style={{
                    border: "none",
                    background: "rgba(255, 255, 255, 0.08)",
                    color: "#94a3b8",
                    padding: "8px 14px",
                    borderRadius: 10,
                    fontSize: 12,
                    fontWeight: 600,
                    cursor: "pointer",
                  }}
                >
                  Upload File
                </button>

                <button
                  type="button"
                  onClick={capturePhoto}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 8,
                    background: "linear-gradient(135deg, #8b5cf6 0%, #6366f1 100%)",
                    color: "#fff",
                    border: "none",
                    padding: "10px 24px",
                    borderRadius: 999,
                    fontSize: 14,
                    fontWeight: 700,
                    cursor: "pointer",
                    boxShadow: "0 8px 20px rgba(99, 102, 241, 0.4)",
                  }}
                >
                  <div style={{ width: 12, height: 12, borderRadius: "50%", background: "#fff" }} />
                  Take Photo
                </button>

                <button
                  type="button"
                  onClick={stopLiveCamera}
                  style={{
                    border: "none",
                    background: "transparent",
                    color: "#94a3b8",
                    padding: "8px 14px",
                    fontSize: 12,
                    fontWeight: 600,
                    cursor: "pointer",
                  }}
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ChatInput;
