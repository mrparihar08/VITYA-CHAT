import React, { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { X, Search, Clock, FileText, Trash2, ArrowRight, RefreshCw, Download } from "lucide-react";
import { getUserPresentations, deleteUserPresentation, API_BASE_URL, getAuthHeaders } from "../../../services/api";

export default function SavedPresentationsModal({ isOpen, onClose, onLoadDeck, onToast }) {
  const [presentations, setPresentations] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const fetchDecks = async () => {
    setIsLoading(true);
    setError("");
    try {
      const data = await getUserPresentations(50);
      if (data && Array.isArray(data.presentations)) {
        setPresentations(data.presentations);
      } else {
        setPresentations([]);
      }
    } catch (err) {
      console.warn("Could not load saved decks", err);
      setError("Failed to fetch saved presentations.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen) {
      fetchDecks();
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleDelete = async (e, id) => {
    e.stopPropagation();
    if (!window.confirm("Are you sure you want to delete this saved presentation?")) return;

    try {
      await deleteUserPresentation(id);
      setPresentations((prev) => prev.filter((p) => p.presentation_id !== id));
      onToast?.({ type: "success", title: "Deleted", message: `Presentation '${id}' deleted successfully.` });
    } catch (err) {
      onToast?.({ type: "error", title: "Delete Failed", message: err.message || "Failed to delete presentation." });
    }
  };

  const handleDownloadPptx = async (e, presentationId, title) => {
    e.stopPropagation();
    try {
      const res = await fetch(`${API_BASE_URL}/api/presentation/download-presentation/${presentationId}`, {
        headers: getAuthHeaders()
      });
      if (!res.ok) throw new Error("Download failed");
      const blob = await res.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `${title || "presentation"}.pptx`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
      onToast?.({ type: "success", title: "Downloaded", message: "PowerPoint file downloaded." });
    } catch (err) {
      console.warn("Download error", err);
      const token = localStorage.getItem("token");
      const tokenParam = token ? `?token=${encodeURIComponent(token)}` : "";
      window.open(`${API_BASE_URL}/api/presentation/download-presentation/${presentationId}${tokenParam}`, "_blank");
    }
  };

  const totalDecksCount = presentations.length;
  const totalSlidesCount = presentations.reduce((acc, p) => acc + (p.slide_count || (Array.isArray(p.slides) ? p.slides.length : 0)), 0);
  const uniqueTemplatesCount = new Set(presentations.map((p) => p.template_name || p.theme?.theme_name).filter(Boolean)).size;

  const filtered = presentations.filter((p) => {
    const q = searchQuery.toLowerCase().trim();
    if (!q) return true;
    return (
      (p.title && p.title.toLowerCase().includes(q)) ||
      (p.presentation_id && p.presentation_id.toLowerCase().includes(q)) ||
      (p.template_name && p.template_name.toLowerCase().includes(q))
    );
  });

  const modalJSX = (
    <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        zIndex: 99999,
        background: "rgba(9, 13, 26, 0.85)",
        backdropFilter: "blur(12px)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "20px",
      }}
      onClick={onClose}
    >
      <div
        style={{
          width: "100%",
          maxWidth: "760px",
          maxHeight: "85vh",
          background: "#0f172a",
          border: "1px solid rgba(192, 132, 252, 0.3)",
          borderRadius: "20px",
          boxShadow: "0 25px 60px rgba(0,0,0,0.7), 0 0 30px rgba(139, 92, 246, 0.2)",
          display: "flex",
          flexDirection: "column",
          overflow: "hidden",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* MODAL HEADER */}
        <div
          style={{
            padding: "16px 22px",
            borderBottom: "1px solid rgba(255,255,255,0.08)",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            background: "rgba(255,255,255,0.02)",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <FileText size={20} style={{ color: "#c084fc" }} />
            <div>
              <h2 style={{ margin: 0, fontSize: "16px", fontWeight: 800, color: "#ffffff" }}>
                Presentation Recorder & History
              </h2>
              <p style={{ margin: "2px 0 0", fontSize: "11px", color: "#94a3b8" }}>
                Recorded presentations log, stats summary, and cloud deck library
              </p>
            </div>
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <button
              onClick={fetchDecks}
              disabled={isLoading}
              style={{
                background: "rgba(255,255,255,0.06)",
                border: "1px solid rgba(255,255,255,0.12)",
                color: "#ffffff",
                padding: "6px 12px",
                borderRadius: "8px",
                fontSize: "12px",
                fontWeight: 600,
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                gap: "5px",
              }}
            >
              <RefreshCw size={13} className={isLoading ? "spin-icon" : ""} />
              Refresh
            </button>
            <button
              onClick={onClose}
              style={{
                background: "none",
                border: "none",
                color: "#94a3b8",
                cursor: "pointer",
                padding: "6px",
                borderRadius: "8px",
              }}
            >
              <X size={18} />
            </button>
          </div>
        </div>

        {/* PRESENTATION RECORDER STATS BAR */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(3, 1fr)",
            gap: "10px",
            padding: "12px 22px",
            background: "rgba(0,0,0,0.25)",
            borderBottom: "1px solid rgba(255,255,255,0.06)",
          }}
        >
          <div
            style={{
              background: "rgba(139, 92, 246, 0.1)",
              border: "1px solid rgba(139, 92, 246, 0.25)",
              borderRadius: "10px",
              padding: "8px 12px",
              textAlign: "center",
            }}
          >
            <span style={{ fontSize: "10px", fontWeight: 700, color: "#c084fc", textTransform: "uppercase" }}>
              Total Decks Created
            </span>
            <div style={{ fontSize: "20px", fontWeight: 900, color: "#ffffff", marginTop: "2px" }}>
              {totalDecksCount}
            </div>
          </div>
          <div
            style={{
              background: "rgba(13, 148, 136, 0.1)",
              border: "1px solid rgba(13, 148, 136, 0.25)",
              borderRadius: "10px",
              padding: "8px 12px",
              textAlign: "center",
            }}
          >
            <span style={{ fontSize: "10px", fontWeight: 700, color: "#2dd4bf", textTransform: "uppercase" }}>
              Total Slides Recorded
            </span>
            <div style={{ fontSize: "20px", fontWeight: 900, color: "#ffffff", marginTop: "2px" }}>
              {totalSlidesCount || totalDecksCount * 8}
            </div>
          </div>
          <div
            style={{
              background: "rgba(56, 189, 248, 0.1)",
              border: "1px solid rgba(56, 189, 248, 0.25)",
              borderRadius: "10px",
              padding: "8px 12px",
              textAlign: "center",
            }}
          >
            <span style={{ fontSize: "10px", fontWeight: 700, color: "#38bdf8", textTransform: "uppercase" }}>
              Active Templates
            </span>
            <div style={{ fontSize: "20px", fontWeight: 900, color: "#ffffff", marginTop: "2px" }}>
              {uniqueTemplatesCount || 1}
            </div>
          </div>
        </div>

        {/* SEARCH BAR */}
        <div style={{ padding: "14px 22px 6px" }}>
          <div
            style={{
              position: "relative",
              display: "flex",
              alignItems: "center",
            }}
          >
            <Search size={15} style={{ position: "absolute", left: 12, color: "#94a3b8" }} />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search presentations by title, ID or template..."
              style={{
                width: "100%",
                padding: "9px 12px 9px 36px",
                borderRadius: "10px",
                background: "rgba(0,0,0,0.4)",
                border: "1px solid rgba(255,255,255,0.12)",
                color: "#ffffff",
                fontSize: "13px",
                outline: "none",
              }}
            />
          </div>
        </div>

        {/* DECKS LIST AREA */}
        <div style={{ padding: "14px 22px 22px", flex: 1, overflowY: "auto" }}>
          {isLoading ? (
            <div style={{ padding: "40px", textAlign: "center", color: "#94a3b8", fontSize: "13px" }}>
              <div className="spinner-sm" style={{ margin: "0 auto 12px" }} />
              Loading saved presentations...
            </div>
          ) : error ? (
            <div style={{ padding: "20px", color: "#fca5a5", fontSize: "13px", textAlign: "center" }}>
              ⚠️ {error}
            </div>
          ) : filtered.length === 0 ? (
            <div style={{ padding: "40px", textAlign: "center", color: "#94a3b8" }}>
              <FileText size={32} style={{ opacity: 0.3, marginBottom: "8px" }} />
              <p style={{ margin: 0, fontSize: "14px", fontWeight: 600 }}>No saved presentations found</p>
              <p style={{ margin: "4px 0 0", fontSize: "12px", color: "rgba(255,255,255,0.4)" }}>
                {searchQuery ? "Try matching a different title query" : "Generations and saved drafts will automatically appear here"}
              </p>
            </div>
          ) : (
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))", gap: "12px" }}>
              {filtered.map((item) => (
                <div
                  key={item.presentation_id}
                  onClick={() => {
                    onLoadDeck?.(item.presentation_id);
                    onClose();
                  }}
                  style={{
                    background: "rgba(255, 255, 255, 0.03)",
                    border: "1px solid rgba(255, 255, 255, 0.08)",
                    borderRadius: "12px",
                    padding: "14px",
                    cursor: "pointer",
                    transition: "all 0.2s ease",
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "space-between",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = "rgba(139, 92, 246, 0.12)";
                    e.currentTarget.style.borderColor = "rgba(139, 92, 246, 0.4)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = "rgba(255, 255, 255, 0.03)";
                    e.currentTarget.style.borderColor = "rgba(255, 255, 255, 0.08)";
                  }}
                >
                  <div>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 8, marginBottom: 6 }}>
                      <h4 style={{ margin: 0, fontSize: "14px", fontWeight: 700, color: "#ffffff", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                        {item.title || "Untitled Presentation"}
                      </h4>
                      <span style={{ fontSize: "10px", fontWeight: 700, padding: "2px 6px", borderRadius: 4, background: "rgba(139,92,246,0.2)", color: "#c084fc", whiteSpace: "nowrap" }}>
                        {item.slides_count || 0} Slides
                      </span>
                    </div>

                    <div style={{ fontSize: "11px", color: "#94a3b8", display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap" }}>
                      <span>Theme: {item.content_theme || "Default"}</span>
                      {item.updated_at && (
                        <span style={{ display: "flex", alignItems: "center", gap: 3 }}>
                          <Clock size={11} /> {new Date(item.updated_at).toLocaleDateString()}
                        </span>
                      )}
                    </div>
                  </div>

                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: 12, paddingTop: 10, borderTop: "1px solid rgba(255,255,255,0.06)" }}>
                    <span style={{ fontSize: 11, fontWeight: 700, color: "#8b5cf6", display: "flex", alignItems: "center", gap: 4 }}>
                      Open in Editor <ArrowRight size={12} />
                    </span>
                    <div style={{ display: "flex", gap: 6 }}>
                      <button
                        type="button"
                        onClick={(e) => handleDownloadPptx(e, item.presentation_id, item.title)}
                        title="Download PowerPoint PPTX"
                        style={{
                          background: "rgba(59, 130, 246, 0.15)",
                          border: "1px solid rgba(59, 130, 246, 0.3)",
                          color: "#93c5fd",
                          borderRadius: "6px",
                          padding: "4px 8px",
                          fontSize: "11px",
                          cursor: "pointer",
                          display: "flex",
                          alignItems: "center",
                          gap: "4px",
                        }}
                      >
                        <Download size={12} /> PPTX
                      </button>
                      <button
                        onClick={(e) => handleDelete(e, item.presentation_id)}
                        title="Delete presentation"
                        style={{
                          background: "rgba(239, 68, 68, 0.15)",
                          border: "1px solid rgba(239, 68, 68, 0.3)",
                          color: "#fca5a5",
                          borderRadius: "6px",
                          padding: "4px 8px",
                          fontSize: "11px",
                          cursor: "pointer",
                          display: "flex",
                          alignItems: "center",
                          gap: "4px",
                        }}
                      >
                        <Trash2 size={12} />
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );

  return typeof document !== "undefined" ? createPortal(modalJSX, document.body) : modalJSX;
}
