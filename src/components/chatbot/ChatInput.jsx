import React from "react";
import { Paperclip, Camera, X, Image as ImageIcon } from "lucide-react";

export const MODES = [
  { key: "chat", label: "Chat", hint: "Default AI Assistant" },
  { key: "dora", label: "DORA.AI", hint: "Medical & Symptom Consultant" },
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
  { label: "💸 Expenses", query: "mere recent expenses dikhao" },
  { label: "📊 Charts", query: "show pie chart for expenses" },
  { label: "💰 Budget", query: "budget status" },
  { label: "📈 Reports", query: "monthly report" },
  { label: "🌦️ Weather", query: "aaj weather kaisa hai?" },
  { label: "📸 Vision", query: "How to scan receipts and analyze images" },
  { label: "📰 News", query: "/news latest updates" },
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
  const [activeMenu, setActiveMenu] = React.useState("main"); // "main" | "plugins"
  const [isCameraOpen, setIsCameraOpen] = React.useState(false);
  const [cameraError, setCameraError] = React.useState(null);
  const inputRef = React.useRef(null);
  const imageInputRef = React.useRef(null);
  const cameraInputRef = React.useRef(null);
  const receiptInputRef = React.useRef(null);
  const videoRef = React.useRef(null);
  const streamRef = React.useRef(null);

  React.useEffect(() => {
    if (!plusOpen) {
      setActiveMenu("main");
    }
  }, [plusOpen]);

  React.useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape" && plusOpen) {
        setPlusOpen(false);
        setActiveMenu("main");
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [plusOpen, setPlusOpen]);

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

        {/* PLUS / ACTIONS FLOATING POPOVER */}
        {plusOpen && (
          <div
            className="vitya-tool-popover"
            role="menu"
            aria-label="Vitya Tools Menu"
            style={{
              position: "absolute",
              bottom: "calc(100% + 8px)",
              left: 0,
              width: "min(215px, 86vw)",
              maxHeight: "min(75vh, 520px)",
              overflowY: "auto",
              overflowX: "hidden",
              scrollbarWidth: "none",
              msOverflowStyle: "none",
              borderRadius: 14,
              background: "rgba(13, 19, 34, 0.97)",
              backdropFilter: "blur(20px)",
              WebkitBackdropFilter: "blur(20px)",
              border: "1px solid rgba(255, 255, 255, 0.14)",
              boxShadow: "0 20px 45px rgba(0, 0, 0, 0.85), 0 0 25px rgba(99, 102, 241, 0.15)",
              padding: "5px",
              zIndex: 1000,
              display: "flex",
              flexDirection: "column",
              gap: 2,
              animation: "vityaMenuPop 0.18s cubic-bezier(0.16, 1, 0.3, 1)",
            }}
          >
            {activeMenu === "main" ? (
              <>
                {/* SECTION 1: AI MODES */}
                <div style={{ padding: "4px 8px 2px", fontSize: 10, fontWeight: 800, letterSpacing: "0.06em", color: "#94a3b8", textTransform: "uppercase" }}>
                  AI Modes
                </div>

                {MODES.map((item) => {
                  const isSelected = item.key === "websearch" ? Boolean(useWebSearch) : mode === item.key;
                  return (
                    <button
                      key={item.key}
                      type="button"
                      onClick={() => {
                        openMode(item.key);
                        setPlusOpen(false);
                      }}
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: 10,
                        padding: "6px 10px",
                        borderRadius: 9,
                        border: isSelected ? "1px solid rgba(139, 92, 246, 0.4)" : "1px solid transparent",
                        background: isSelected ? "rgba(139, 92, 246, 0.22)" : "transparent",
                        color: "#fff",
                        cursor: "pointer",
                        textAlign: "left",
                        transition: "all 0.12s ease",
                      }}
                      onMouseEnter={(e) => {
                        if (!isSelected) e.currentTarget.style.background = "rgba(255, 255, 255, 0.06)";
                      }}
                      onMouseLeave={(e) => {
                        if (!isSelected) e.currentTarget.style.background = "transparent";
                      }}
                    >
                      <div
                        style={{
                          width: 26,
                          height: 26,
                          borderRadius: 7,
                          background: item.key === "dora" ? "rgba(20, 184, 166, 0.15)" : item.key === "websearch" ? "rgba(59, 130, 246, 0.15)" : item.key === "news" ? "rgba(236, 72, 153, 0.15)" : item.key === "wiki" ? "rgba(6, 182, 212, 0.15)" : "rgba(139, 92, 246, 0.15)",
                          display: "grid",
                          placeItems: "center",
                          fontSize: 13,
                          flexShrink: 0,
                        }}
                      >
                        {item.key === "chat" && "💬"}
                        {item.key === "dora" && "🩺"}
                        {item.key === "websearch" && "🌐"}
                        {item.key === "news" && "📰"}
                        {item.key === "wiki" && "📚"}
                      </div>
                      <div style={{ flex: 1, minWidth: 0, fontSize: 13, fontWeight: 600, color: isSelected ? "#c084fc" : "#f1f5f9" }}>
                        {item.label}
                      </div>
                      {isSelected && (
                        <div style={{ width: 6, height: 6, borderRadius: "50%", background: "#a855f7", boxShadow: "0 0 8px #a855f7", flexShrink: 0 }} />
                      )}
                    </button>
                  );
                })}

                <div style={{ height: 1, background: "rgba(255, 255, 255, 0.08)", margin: "3px 6px" }} />

                {/* SECTION 2: IMAGE & CAMERA SUBMENU ENTRY */}
                {(() => {
                  const isCameraActive = attachedImages.length > 0 || isCameraOpen;
                  return (
                    <button
                      type="button"
                      onClick={() => setActiveMenu("camera")}
                      style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                        padding: "7px 10px",
                        borderRadius: 9,
                        border: isCameraActive ? "1px solid rgba(59, 130, 246, 0.5)" : "1px solid rgba(59, 130, 246, 0.25)",
                        background: isCameraActive ? "rgba(59, 130, 246, 0.22)" : "rgba(59, 130, 246, 0.08)",
                        color: "#fff",
                        cursor: "pointer",
                        textAlign: "left",
                        transition: "all 0.15s ease",
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.background = "rgba(59, 130, 246, 0.16)";
                        e.currentTarget.style.borderColor = "rgba(59, 130, 246, 0.4)";
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.background = isCameraActive ? "rgba(59, 130, 246, 0.22)" : "rgba(59, 130, 246, 0.08)";
                        e.currentTarget.style.borderColor = isCameraActive ? "rgba(59, 130, 246, 0.5)" : "rgba(59, 130, 246, 0.25)";
                      }}
                    >
                      <div style={{ display: "flex", alignItems: "center", gap: 10, minWidth: 0 }}>
                        <div style={{ width: 26, height: 26, borderRadius: 7, background: "rgba(59, 130, 246, 0.2)", display: "grid", placeItems: "center", color: "#60a5fa", flexShrink: 0 }}>
                          <Camera size={14} />
                        </div>
                        <div style={{ fontSize: 13, fontWeight: 600, color: "#93c5fd" }}>
                          Image & Camera
                        </div>
                      </div>
                      <span style={{ fontSize: 14, fontWeight: 900, color: "#60a5fa", paddingRight: 4 }}>›</span>
                    </button>
                  );
                })()}

                {/* SECTION 3: PLUGINS & TOOLS SUBMENU ENTRY */}
                {(() => {
                  const isPluginsActive = input.startsWith("/presentation") || input.startsWith("/ppt") || input.startsWith("/image") || ragDocs.length > 0;
                  return (
                    <button
                      type="button"
                      onClick={() => setActiveMenu("plugins")}
                      style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                        padding: "7px 10px",
                        borderRadius: 9,
                        border: isPluginsActive ? "1px solid rgba(244, 63, 94, 0.5)" : "1px solid rgba(244, 63, 94, 0.25)",
                        background: isPluginsActive ? "rgba(244, 63, 94, 0.22)" : "rgba(244, 63, 94, 0.08)",
                        color: "#fff",
                        cursor: "pointer",
                        textAlign: "left",
                        transition: "all 0.15s ease",
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.background = "rgba(244, 63, 94, 0.16)";
                        e.currentTarget.style.borderColor = "rgba(244, 63, 94, 0.4)";
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.background = isPluginsActive ? "rgba(244, 63, 94, 0.22)" : "rgba(244, 63, 94, 0.08)";
                        e.currentTarget.style.borderColor = isPluginsActive ? "rgba(244, 63, 94, 0.5)" : "rgba(244, 63, 94, 0.25)";
                      }}
                    >
                      <div style={{ display: "flex", alignItems: "center", gap: 10, minWidth: 0 }}>
                        <div style={{ width: 26, height: 26, borderRadius: 7, background: "rgba(244, 63, 94, 0.2)", display: "grid", placeItems: "center", fontSize: 13, flexShrink: 0 }}>
                          🧩
                        </div>
                        <div style={{ fontSize: 13, fontWeight: 600, color: "#fda4af" }}>
                          Plugins & Tools
                        </div>
                      </div>
                      <span style={{ fontSize: 14, fontWeight: 900, color: "#fb7185", paddingRight: 4 }}>›</span>
                    </button>
                  );
                })()}
              </>
            ) : activeMenu === "camera" ? (
              /* SUBMENU: IMAGE & CAMERA */
              <>
                {/* SUBMENU HEADER WITH < BACK BUTTON */}
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 8,
                    padding: "4px 6px 6px",
                    borderBottom: "1px solid rgba(255, 255, 255, 0.1)",
                    marginBottom: 3,
                  }}
                >
                  <button
                    type="button"
                    onClick={() => setActiveMenu("main")}
                    style={{
                      display: "grid",
                      placeItems: "center",
                      width: 22,
                      height: 22,
                      background: "rgba(255, 255, 255, 0.08)",
                      border: "1px solid rgba(255, 255, 255, 0.12)",
                      borderRadius: 6,
                      color: "#cbd5e1",
                      fontSize: 13,
                      fontWeight: 800,
                      cursor: "pointer",
                      transition: "all 0.12s ease",
                      padding: 0,
                    }}
                    onMouseEnter={(e) => (e.currentTarget.style.background = "rgba(255, 255, 255, 0.16)")}
                    onMouseLeave={(e) => (e.currentTarget.style.background = "rgba(255, 255, 255, 0.08)")}
                    title="Back"
                  >
                    &lt;
                  </button>
                  <span style={{ fontSize: 12.5, fontWeight: 800, color: "#f8fafc" }}>Image & Camera</span>
                </div>

                {/* ATTACH IMAGE */}
                {(() => {
                  const isAttachActive = attachedImages.length > 0;
                  return (
                    <button
                      type="button"
                      onClick={() => {
                        setPlusOpen(false);
                        imageInputRef.current?.click();
                      }}
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: 10,
                        padding: "6px 10px",
                        borderRadius: 9,
                        border: isAttachActive ? "1px solid rgba(59, 130, 246, 0.4)" : "1px solid transparent",
                        background: isAttachActive ? "rgba(59, 130, 246, 0.2)" : "transparent",
                        color: "#fff",
                        cursor: "pointer",
                        textAlign: "left",
                        transition: "all 0.12s ease",
                      }}
                      onMouseEnter={(e) => (e.currentTarget.style.background = "rgba(59, 130, 246, 0.12)")}
                      onMouseLeave={(e) => (e.currentTarget.style.background = isAttachActive ? "rgba(59, 130, 246, 0.2)" : "transparent")}
                    >
                      <div style={{ width: 26, height: 26, borderRadius: 7, background: "rgba(59, 130, 246, 0.15)", display: "grid", placeItems: "center", color: "#60a5fa", flexShrink: 0 }}>
                        <Paperclip size={14} />
                      </div>
                      <div style={{ flex: 1, minWidth: 0, fontSize: 13, fontWeight: 600, color: "#93c5fd" }}>
                        Attach Image
                      </div>
                      {isAttachActive && (
                        <span style={{ fontSize: 10, background: "#3b82f6", color: "#fff", padding: "1px 6px", borderRadius: 999, fontWeight: 700 }}>
                          {attachedImages.length}
                        </span>
                      )}
                    </button>
                  );
                })()}

                {/* CAMERA PHOTO */}
                {(() => {
                  const isCamActive = Boolean(isCameraOpen);
                  return (
                    <button
                      type="button"
                      onClick={() => {
                        setPlusOpen(false);
                        startLiveCamera();
                      }}
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: 10,
                        padding: "6px 10px",
                        borderRadius: 9,
                        border: isCamActive ? "1px solid rgba(168, 85, 247, 0.4)" : "1px solid transparent",
                        background: isCamActive ? "rgba(168, 85, 247, 0.2)" : "transparent",
                        color: "#fff",
                        cursor: "pointer",
                        textAlign: "left",
                        transition: "all 0.12s ease",
                      }}
                      onMouseEnter={(e) => (e.currentTarget.style.background = "rgba(168, 85, 247, 0.12)")}
                      onMouseLeave={(e) => (e.currentTarget.style.background = isCamActive ? "rgba(168, 85, 247, 0.2)" : "transparent")}
                    >
                      <div style={{ width: 26, height: 26, borderRadius: 7, background: "rgba(168, 85, 247, 0.15)", display: "grid", placeItems: "center", color: "#c084fc", flexShrink: 0 }}>
                        <Camera size={14} />
                      </div>
                      <div style={{ flex: 1, minWidth: 0, fontSize: 13, fontWeight: 600, color: "#d8b4fe" }}>
                        Camera Photo
                      </div>
                      {isCamActive && (
                        <div style={{ width: 6, height: 6, borderRadius: "50%", background: "#c084fc", boxShadow: "0 0 8px #c084fc", flexShrink: 0 }} />
                      )}
                    </button>
                  );
                })()}

                {/* SCAN RECEIPT / BILL */}
                {handleReceiptUpload && (
                  <button
                    type="button"
                    onClick={() => {
                      setPlusOpen(false);
                      receiptInputRef.current?.click();
                    }}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 10,
                      padding: "6px 10px",
                      borderRadius: 9,
                      border: "none",
                      background: "transparent",
                      color: "#fff",
                      cursor: "pointer",
                      textAlign: "left",
                      transition: "all 0.12s ease",
                    }}
                    onMouseEnter={(e) => (e.currentTarget.style.background = "rgba(16, 185, 129, 0.12)")}
                    onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
                  >
                    <div style={{ width: 26, height: 26, borderRadius: 7, background: "rgba(16, 185, 129, 0.15)", display: "grid", placeItems: "center", fontSize: 13, flexShrink: 0 }}>
                      🧾
                    </div>
                    <div style={{ flex: 1, minWidth: 0, fontSize: 13, fontWeight: 600, color: "#6ee7b7" }}>
                      Scan Receipt / Bill
                    </div>
                  </button>
                )}
              </>
            ) : (
              /* SUBMENU: PLUGINS & TOOLS */
              <>
                {/* SUBMENU HEADER WITH < BACK BUTTON */}
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 8,
                    padding: "4px 6px 6px",
                    borderBottom: "1px solid rgba(255, 255, 255, 0.1)",
                    marginBottom: 3,
                  }}
                >
                  <button
                    type="button"
                    onClick={() => setActiveMenu("main")}
                    style={{
                      display: "grid",
                      placeItems: "center",
                      width: 22,
                      height: 22,
                      background: "rgba(255, 255, 255, 0.08)",
                      border: "1px solid rgba(255, 255, 255, 0.12)",
                      borderRadius: 6,
                      color: "#cbd5e1",
                      fontSize: 13,
                      fontWeight: 800,
                      cursor: "pointer",
                      transition: "all 0.12s ease",
                      padding: 0,
                    }}
                    onMouseEnter={(e) => (e.currentTarget.style.background = "rgba(255, 255, 255, 0.16)")}
                    onMouseLeave={(e) => (e.currentTarget.style.background = "rgba(255, 255, 255, 0.08)")}
                    title="Back"
                  >
                    &lt;
                  </button>
                  <span style={{ fontSize: 12.5, fontWeight: 800, color: "#f8fafc" }}>Plugins & Tools</span>
                </div>

                {/* PLUGIN 1: PRESENTATION GENERATOR */}
                {(() => {
                  const isPptActive = mode === "file" || input.startsWith("/presentation") || input.startsWith("/ppt");
                  return (
                    <button
                      type="button"
                      onClick={() => {
                        setPlusOpen(false);
                        setInput("/presentation ");
                        setTimeout(() => inputRef.current?.focus(), 50);
                      }}
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: 10,
                        padding: "7px 10px",
                        borderRadius: 9,
                        border: isPptActive ? "1px solid rgba(244, 63, 94, 0.4)" : "1px solid transparent",
                        background: isPptActive ? "rgba(244, 63, 94, 0.2)" : "transparent",
                        color: "#fff",
                        cursor: "pointer",
                        textAlign: "left",
                        transition: "all 0.12s ease",
                      }}
                      onMouseEnter={(e) => (e.currentTarget.style.background = "rgba(244, 63, 94, 0.12)")}
                      onMouseLeave={(e) => (e.currentTarget.style.background = isPptActive ? "rgba(244, 63, 94, 0.2)" : "transparent")}
                    >
                      <div style={{ width: 26, height: 26, borderRadius: 7, background: "rgba(244, 63, 94, 0.15)", display: "grid", placeItems: "center", fontSize: 13, flexShrink: 0 }}>
                        📊
                      </div>
                      <div style={{ flex: 1, minWidth: 0, fontSize: 13, fontWeight: 600, color: "#f43f5e" }}>
                        PPT Generator (/presentation)
                      </div>
                      {isPptActive && (
                        <div style={{ width: 6, height: 6, borderRadius: "50%", background: "#f43f5e", boxShadow: "0 0 8px #f43f5e", flexShrink: 0 }} />
                      )}
                    </button>
                  );
                })()}

                {/* PLUGIN 2: AI IMAGE GENERATOR */}
                {(() => {
                  const isImgActive = input.startsWith("/image");
                  return (
                    <button
                      type="button"
                      onClick={() => {
                        setPlusOpen(false);
                        setInput("/image ");
                        setTimeout(() => inputRef.current?.focus(), 50);
                      }}
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: 10,
                        padding: "7px 10px",
                        borderRadius: 9,
                        border: isImgActive ? "1px solid rgba(168, 85, 247, 0.4)" : "1px solid transparent",
                        background: isImgActive ? "rgba(168, 85, 247, 0.2)" : "transparent",
                        color: "#fff",
                        cursor: "pointer",
                        textAlign: "left",
                        transition: "all 0.12s ease",
                      }}
                      onMouseEnter={(e) => (e.currentTarget.style.background = "rgba(168, 85, 247, 0.12)")}
                      onMouseLeave={(e) => (e.currentTarget.style.background = isImgActive ? "rgba(168, 85, 247, 0.2)" : "transparent")}
                    >
                      <div style={{ width: 26, height: 26, borderRadius: 7, background: "rgba(168, 85, 247, 0.15)", display: "grid", placeItems: "center", fontSize: 13, flexShrink: 0 }}>
                        🎨
                      </div>
                      <div style={{ flex: 1, minWidth: 0, fontSize: 13, fontWeight: 600, color: "#c084fc" }}>
                        AI Image Generator (/image)
                      </div>
                      {isImgActive && (
                        <div style={{ width: 6, height: 6, borderRadius: "50%", background: "#c084fc", boxShadow: "0 0 8px #c084fc", flexShrink: 0 }} />
                      )}
                    </button>
                  );
                })()}

                {/* PLUGIN 3: LIVE WEB SEARCH TOGGLE */}
                {setUseWebSearch && (
                  <button
                    type="button"
                    onClick={() => setUseWebSearch((v) => !v)}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      padding: "7px 10px",
                      borderRadius: 9,
                      border: "none",
                      background: "transparent",
                      color: "#fff",
                      cursor: "pointer",
                      textAlign: "left",
                      transition: "all 0.12s ease",
                    }}
                    onMouseEnter={(e) => (e.currentTarget.style.background = "rgba(59, 130, 246, 0.12)")}
                    onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
                  >
                    <div style={{ display: "flex", alignItems: "center", gap: 10, minWidth: 0 }}>
                      <div style={{ width: 26, height: 26, borderRadius: 7, background: "rgba(59, 130, 246, 0.15)", display: "grid", placeItems: "center", fontSize: 13, flexShrink: 0 }}>
                        🌐
                      </div>
                      <div style={{ fontSize: 13, fontWeight: 600, color: "#60a5fa" }}>
                        Live Web Search
                      </div>
                    </div>
                    <span
                      style={{
                        fontSize: 10,
                        fontWeight: 800,
                        padding: "2px 8px",
                        borderRadius: 999,
                        background: useWebSearch ? "rgba(34, 197, 94, 0.2)" : "rgba(148, 163, 184, 0.2)",
                        color: useWebSearch ? "#4ade80" : "#94a3b8",
                        border: `1px solid ${useWebSearch ? "rgba(34, 197, 94, 0.4)" : "rgba(148, 163, 184, 0.3)"}`,
                      }}
                    >
                      {useWebSearch ? "ON" : "OFF"}
                    </span>
                  </button>
                )}

                {/* PLUGIN 4: MULTI-DOC RAG UPLOAD */}
                {handleFileUpload && (() => {
                  const isDocsActive = ragDocs.length > 0;
                  return (
                    <label
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: 10,
                        padding: "7px 10px",
                        borderRadius: 9,
                        border: isDocsActive ? "1px solid rgba(16, 185, 129, 0.4)" : "1px solid transparent",
                        background: isDocsActive ? "rgba(16, 185, 129, 0.2)" : "transparent",
                        color: "#fff",
                        cursor: "pointer",
                        textAlign: "left",
                        transition: "all 0.12s ease",
                      }}
                      onMouseEnter={(e) => (e.currentTarget.style.background = "rgba(16, 185, 129, 0.12)")}
                      onMouseLeave={(e) => (e.currentTarget.style.background = isDocsActive ? "rgba(16, 185, 129, 0.2)" : "transparent")}
                    >
                      <div style={{ width: 26, height: 26, borderRadius: 7, background: "rgba(16, 185, 129, 0.15)", display: "grid", placeItems: "center", fontSize: 13, flexShrink: 0 }}>
                        📎
                      </div>
                      <div style={{ flex: 1, minWidth: 0, fontSize: 13, fontWeight: 600, color: "#34d399" }}>
                        Upload Document
                      </div>
                      {isDocsActive && (
                        <span style={{ fontSize: 10, background: "#10b981", color: "#fff", padding: "1px 6px", borderRadius: 999, fontWeight: 700 }}>
                          {ragDocs.length}
                        </span>
                      )}
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
                  );
                })()}
              </>
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
                {cameraError && (
                  <div
                    style={{
                      position: "absolute",
                      inset: 20,
                      background: "rgba(15, 23, 42, 0.9)",
                      borderRadius: 14,
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                      justifyContent: "center",
                      padding: 16,
                      textAlign: "center",
                      color: "#f87171",
                      fontSize: 13,
                      zIndex: 10,
                    }}
                  >
                    <p style={{ margin: "0 0 10px 0", fontWeight: 600 }}>⚠️ {cameraError}</p>
                    <p style={{ margin: 0, fontSize: 12, color: "#94a3b8" }}>
                      Please enable camera permissions in your browser or use "Upload File".
                    </p>
                  </div>
                )}
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
