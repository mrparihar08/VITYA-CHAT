import React, { useState, useEffect, useCallback } from "react";
import { createPortal } from "react-dom";
import { 
  Search, 
  Sparkles, 
  X, 
  Check, 
  Image as ImageIcon, 
  Loader2, 
  ExternalLink, 
  ShieldCheck, 
  Copy, 
  Upload, 
  Filter, 
  Globe, 
  FileImage 
} from "lucide-react";
import { 
  searchPresentationImages, 
  suggestPresentationImages, 
  getUnsplashPhotos,
  generateAiPresentationImage
} from "../../../services/api";

const VISUAL_TYPES = [
  { id: "all", label: "All Visuals" },
  { id: "photo", label: "Photos" },
  { id: "diagram", label: "Diagrams" },
  { id: "illustration", label: "Illustrations" },
  { id: "icon", label: "Icons" },
  { id: "process", label: "Processes" },
  { id: "chart", label: "Charts" },
];

export default function ImageSearchModal({
  isOpen,
  onClose,
  initialQuery = "",
  slideContext = {},
  onSelectImage
}) {
  const [activeTab, setActiveTab] = useState("web"); // "web" | "openverse" | "wikimedia" | "suggested" | "upload" | "generate"
  const [searchQuery, setSearchQuery] = useState(initialQuery);
  const [selectedVisualType, setSelectedVisualType] = useState("all");
  const [isLoading, setIsLoading] = useState(false);
  const [results, setResults] = useState([]);
  const [previewImage, setPreviewImage] = useState(null);
  const [copiedId, setCopiedId] = useState(null);
  const [customPrompt, setCustomPrompt] = useState("");
  const [aiProvider, setAiProvider] = useState("auto");
  const [aiStyle, setAiStyle] = useState("Professional");
  const [isGenerating, setIsGenerating] = useState(false);
  const [aiGeneratedUrl, setAiGeneratedUrl] = useState(null);
  const [aiGeneratedMeta, setAiGeneratedMeta] = useState(null);

  const performSearch = useCallback(async (queryText, providerTab = activeTab, vType = selectedVisualType) => {
    const cleanQuery = (queryText || "").trim();
    if (!cleanQuery && providerTab !== "suggested" && providerTab !== "upload" && providerTab !== "generate") {
      return;
    }

    setIsLoading(true);

    try {
      if (providerTab === "suggested") {
        const topic = slideContext.topic || "Presentation";
        const title = slideContext.slideTitle || cleanQuery || "Slide";
        const content = slideContext.slideContent || "";
        
        const suggestData = await suggestPresentationImages({
          presentation_topic: topic,
          slide_title: title,
          slide_content: content,
          visual_type: vType === "all" ? null : vType,
        });

        if (suggestData && Array.isArray(suggestData.suggested_images) && suggestData.suggested_images.length > 0) {
          setResults(suggestData.suggested_images);
          setIsLoading(false);
          return;
        }
      }

      const reqProvider = providerTab === "openverse" ? "openverse" : (providerTab === "wikimedia" ? "wikimedia" : null);
      const searchData = await searchPresentationImages({
        query: cleanQuery,
        provider: reqProvider,
        visualType: vType === "all" ? null : vType,
        pageSize: 24,
      });

      if (searchData && Array.isArray(searchData.results) && searchData.results.length > 0) {
        setResults(searchData.results);
        setIsLoading(false);
        return;
      }

      // Fallback: search Unsplash API endpoint
      const unData = await getUnsplashPhotos(cleanQuery, 12);
      if (unData && Array.isArray(unData.photos) && unData.photos.length > 0) {
        const formatted = unData.photos.map((p, idx) => ({
          id: `un_${p.id || idx}`,
          image_url: p.url,
          thumbnail_url: p.url,
          title: p.title || cleanQuery,
          creator: "Unsplash Contributor",
          license: "Unsplash License",
          source_url: p.url,
          provider: "unsplash",
          attribution: `Image: ${p.title || cleanQuery} — Unsplash`,
          visual_type: "photo",
          license_status: "commercial_safe",
          commercial_use: true,
          modification_allowed: true,
        }));
        setResults(formatted);
        setIsLoading(false);
        return;
      }

      setResults([]);
    } catch (err) {
      console.warn("Image search failed:", err);
      setResults([]);
    } finally {
      setIsLoading(false);
    }
  }, [activeTab, selectedVisualType, slideContext]);

  useEffect(() => {
    if (isOpen) {
      const topic = slideContext.topic || slideContext.presentationTitle || "";
      const title = slideContext.slideTitle || "";
      
      let contextQuery = initialQuery;
      if (!contextQuery || contextQuery === "technology" || contextQuery === "Current Slide") {
        contextQuery = title && title !== "Current Slide" ? `${title} ${topic}`.trim() : (topic || "technology");
      }
      setSearchQuery(contextQuery);
      performSearch(contextQuery, "web", "all");
    }
  }, [isOpen, initialQuery, slideContext, performSearch]);

  const handleCopyAttribution = (imgObj, e) => {
    e?.stopPropagation();
    const attrStr = imgObj.attribution || `Image: ${imgObj.title || "Visual"} — ${imgObj.creator || "Creator"} (${imgObj.license || "CC BY"})`;
    navigator.clipboard.writeText(attrStr);
    setCopiedId(imgObj.id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleFileUpload = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const dataUrl = event.target.result;
        onSelectImage?.(dataUrl, file.name, "Local Upload", {
          provider: "upload",
          license: "Custom Upload",
          attribution: `Image: ${file.name} (Uploaded)`
        });
        onClose();
      };
      reader.readAsDataURL(file);
    }
  };

  const handleGenerateAiImage = async () => {
    const promptText = (customPrompt || searchQuery || slideContext.slideTitle || "Presentation visual").trim();
    if (!promptText) return;

    setIsGenerating(true);
    setAiGeneratedUrl(null);
    setAiGeneratedMeta(null);

    try {
      const res = await generateAiPresentationImage({
        prompt: promptText,
        provider: aiProvider,
        style: aiStyle,
        aspect_ratio: "16:9",
        topic: slideContext.topic || slideContext.presentationTitle || "",
        slide_title: slideContext.slideTitle || "",
        slide_content: slideContext.slideContent || "",
      });
      if (res && (res.image_url || res.url)) {
        setAiGeneratedUrl(res.image_url || res.url);
        setAiGeneratedMeta({
          provider: res.provider || aiProvider,
          model: res.model || "AI Model",
          source: res.source || (res.provider === "gemini" ? "Google Gemini" : "Pollinations.ai"),
          attribution: res.attribution || `Image generated via ${res.provider || "AI"}`,
          prompt: res.prompt || promptText,
        });
      }
    } catch (err) {
      console.warn("AI generation failed:", err);
    } finally {
      setIsGenerating(false);
    }
  };

  if (!isOpen) return null;

  const modalJSX = (
    <div className="img-modal-overlay" onClick={onClose}>
      <div className="img-search-modal" onClick={(e) => e.stopPropagation()} style={{ maxWidth: "1050px", width: "94vw", maxHeight: "90vh" }}>
        
        {/* HEADER */}
        <div className="img-modal-header" style={{ padding: "14px 20px", borderBottom: "1px solid rgba(255, 255, 255, 0.1)" }}>
          <div className="modal-title-wrap" style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <Sparkles size={18} className="ai-sparkle-glow" style={{ color: "#38bdf8" }} />
            <span style={{ fontWeight: 800, fontSize: "14px", letterSpacing: "0.5px" }}>
              SMART IMAGE DISCOVERY & CC LICENSING
            </span>
          </div>
          <button className="close-btn" onClick={onClose} style={{ background: "transparent", border: "none", color: "#94a3b8", cursor: "pointer" }}>
            <X size={18} />
          </button>
        </div>

        {/* PROVIDER TABS */}
        <div style={{ display: "flex", gap: 6, padding: "10px 20px", background: "rgba(15, 23, 42, 0.6)", borderBottom: "1px solid rgba(255, 255, 255, 0.08)", flexWrap: "wrap" }}>
          {[
            { id: "web", label: "Openverse & Wikimedia", icon: Globe },
            { id: "openverse", label: "Openverse", icon: Globe },
            { id: "wikimedia", label: "Wikimedia Commons", icon: FileImage },
            { id: "suggested", label: "AI Suggestions", icon: Sparkles },
            { id: "upload", label: "Upload File", icon: Upload },
            { id: "generate", label: "AI Generation", icon: Sparkles },
          ].map((tab) => {
            const IconComp = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => {
                  setActiveTab(tab.id);
                  if (tab.id !== "upload" && tab.id !== "generate") {
                    performSearch(searchQuery, tab.id, selectedVisualType);
                  }
                }}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 6,
                  padding: "6px 12px",
                  borderRadius: "6px",
                  fontSize: "12px",
                  fontWeight: 700,
                  border: isActive ? "1px solid #38bdf8" : "1px solid rgba(255, 255, 255, 0.1)",
                  backgroundColor: isActive ? "rgba(56, 189, 248, 0.15)" : "rgba(30, 41, 59, 0.4)",
                  color: isActive ? "#38bdf8" : "#cbd5e1",
                  cursor: "pointer",
                  transition: "all 0.15s ease"
                }}
              >
                <IconComp size={14} />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* DETECTED SLIDE CONTEXT */}
        <div className="context-banner-row" style={{ padding: "8px 20px", background: "rgba(30, 41, 59, 0.3)", fontSize: "12px", color: "#94a3b8", display: "flex", alignItems: "center", gap: 8 }}>
          <span className="ctx-badge" style={{ background: "rgba(56, 189, 248, 0.2)", color: "#38bdf8", padding: "2px 6px", borderRadius: "4px", fontWeight: 700, fontSize: "10px" }}>
            SLIDE CONTEXT:
          </span>
          <span className="ctx-text" style={{ color: "#e2e8f0" }}>
            <strong>{slideContext.slideTitle || "Current Slide"}</strong>
            {slideContext.topic ? ` — ${slideContext.topic}` : ""}
          </span>
        </div>

        {/* MAIN BODY AREA BASED ON TAB */}
        {activeTab === "upload" ? (
          <div style={{ padding: "40px 20px", textAlign: "center", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", minHeight: "260px" }}>
            <Upload size={42} style={{ color: "#38bdf8", marginBottom: 12 }} />
            <h3 style={{ margin: "0 0 8px 0", color: "#f8fafc", fontSize: 16 }}>Upload Image File</h3>
            <p style={{ color: "#94a3b8", fontSize: 13, marginBottom: 20 }}>PNG, JPG, WEBP, or GIF up to 15MB</p>
            <label style={{ background: "#38bdf8", color: "#0f172a", fontWeight: 700, padding: "10px 20px", borderRadius: "6px", cursor: "pointer" }}>
              Choose File
              <input type="file" accept="image/*" onChange={handleFileUpload} style={{ display: "none" }} />
            </label>
          </div>
        ) : activeTab === "generate" ? (
          <div style={{ padding: "20px", minHeight: "300px", display: "flex", flexDirection: "column", gap: 14 }}>
            {/* PROVIDER & STYLE SELECTOR ROW */}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
              <div>
                <label style={{ display: "block", fontSize: 11, fontWeight: 700, color: "#94a3b8", marginBottom: 6 }}>
                  PROVIDER / ENGINE
                </label>
                <div style={{ display: "flex", gap: 6 }}>
                  {[
                    { id: "auto", label: "Auto" },
                    { id: "gemini", label: "Gemini" },
                    { id: "pollinations", label: "Pollinations" },
                  ].map((p) => (
                    <button
                      key={p.id}
                      type="button"
                      onClick={() => setAiProvider(p.id)}
                      style={{
                        flex: 1,
                        padding: "7px 8px",
                        borderRadius: "6px",
                        fontSize: "11px",
                        fontWeight: 700,
                        border: aiProvider === p.id ? "1px solid #38bdf8" : "1px solid rgba(255,255,255,0.1)",
                        backgroundColor: aiProvider === p.id ? "rgba(56, 189, 248, 0.2)" : "rgba(15, 23, 42, 0.6)",
                        color: aiProvider === p.id ? "#38bdf8" : "#cbd5e1",
                        cursor: "pointer",
                      }}
                    >
                      {p.label}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label style={{ display: "block", fontSize: 11, fontWeight: 700, color: "#94a3b8", marginBottom: 6 }}>
                  VISUAL STYLE
                </label>
                <select
                  value={aiStyle}
                  onChange={(e) => setAiStyle(e.target.value)}
                  style={{ width: "100%", padding: "7px 10px", background: "#0f172a", border: "1px solid rgba(255,255,255,0.15)", borderRadius: "6px", color: "#fff", fontSize: "12px" }}
                >
                  <option value="Professional">Professional (Corporate)</option>
                  <option value="Technology">Technology & AI</option>
                  <option value="Photorealistic">Photorealistic Studio</option>
                  <option value="3D">3D Rendered Isometric</option>
                  <option value="Illustration">Vector Illustration</option>
                  <option value="Minimal">Minimalist Visual</option>
                  <option value="Medical">Medical & Biotech</option>
                  <option value="Finance">Finance & Analytics</option>
                </select>
              </div>
            </div>

            {/* PROMPT INPUT */}
            <div style={{ display: "flex", gap: 10 }}>
              <input
                type="text"
                value={customPrompt}
                onChange={(e) => setCustomPrompt(e.target.value)}
                placeholder="Describe image to generate (e.g. Modern executive conference room with high tech dashboard)..."
                style={{ flex: 1, padding: "10px 14px", background: "#0f172a", border: "1px solid rgba(255,255,255,0.15)", borderRadius: "6px", color: "#fff", fontSize: "13px" }}
              />
              <button
                onClick={handleGenerateAiImage}
                disabled={isGenerating}
                style={{ background: "#38bdf8", color: "#0f172a", fontWeight: 700, padding: "10px 20px", borderRadius: "6px", border: "none", cursor: "pointer", display: "flex", alignItems: "center", gap: 6, whiteSpace: "nowrap" }}
              >
                {isGenerating ? <Loader2 size={16} className="spin-loader" /> : <Sparkles size={16} />}
                <span>{isGenerating ? "Generating..." : "Generate AI Image"}</span>
              </button>
            </div>

            {aiGeneratedUrl && (
              <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 14, background: "rgba(15, 23, 42, 0.6)", padding: 16, borderRadius: 8, border: "1px solid rgba(255,255,255,0.08)" }}>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", width: "100%", maxWidth: "520px", fontSize: "12px" }}>
                  <span style={{ color: "#10b981", fontWeight: 700 }}>✓ AI Visual Ready</span>
                  <span style={{ color: "#94a3b8" }}>{aiGeneratedMeta?.source || "AI Generated"}</span>
                </div>
                <img src={aiGeneratedUrl} alt="AI Generated" style={{ maxWidth: "520px", width: "100%", borderRadius: 6, border: "1px solid rgba(255,255,255,0.1)", maxHeight: "320px", objectFit: "contain" }} />
                <button
                  onClick={() => {
                    const sourceName = aiGeneratedMeta?.source || (aiProvider === "gemini" ? "Google Gemini" : "Pollinations.ai");
                    onSelectImage?.(aiGeneratedUrl, customPrompt || "AI Generated Visual", sourceName, {
                      provider: "ai",
                      engine: aiGeneratedMeta?.provider || aiProvider,
                      model: aiGeneratedMeta?.model || "",
                      license: "Custom AI License",
                      attribution: aiGeneratedMeta?.attribution || `Image: ${customPrompt || "AI Visual"} — Generated by ${sourceName}`
                    });
                    onClose();
                  }}
                  style={{ background: "#10b981", color: "#fff", fontWeight: 700, padding: "9px 20px", borderRadius: "6px", border: "none", cursor: "pointer", display: "flex", alignItems: "center", gap: 6 }}
                >
                  <Check size={16} />
                  <span>Use AI Generated Image</span>
                </button>
              </div>
            )}
          </div>
        ) : (
          <>
            {/* SEARCH INPUT & VISUAL TYPE CHIPS */}
            <div style={{ padding: "12px 20px", borderBottom: "1px solid rgba(255, 255, 255, 0.08)" }}>
              <div style={{ display: "flex", gap: 10, marginBottom: 12 }}>
                <div style={{ flex: 1, position: "relative", display: "flex", alignItems: "center" }}>
                  <Search size={16} style={{ position: "absolute", left: 12, color: "#64748b" }} />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && performSearch(searchQuery)}
                    placeholder="Search CC images by keyword or topic..."
                    style={{ width: "100%", padding: "10px 12px 10px 36px", background: "#0f172a", border: "1px solid rgba(255, 255, 255, 0.15)", borderRadius: "6px", color: "#ffffff", fontSize: "13px" }}
                  />
                </div>
                <button
                  onClick={() => performSearch(searchQuery)}
                  style={{ background: "#38bdf8", color: "#0f172a", fontWeight: 700, padding: "0 20px", borderRadius: "6px", border: "none", cursor: "pointer" }}
                >
                  Search
                </button>
              </div>

              {/* VISUAL TYPE FILTER CHIPS */}
              <div style={{ display: "flex", alignItems: "center", gap: 6, overflowX: "auto", paddingBottom: 4 }}>
                <span style={{ display: "flex", alignItems: "center", gap: 4, fontSize: "11px", color: "#64748b", fontWeight: 700, paddingRight: 4 }}>
                  <Filter size={12} /> Filter:
                </span>
                {VISUAL_TYPES.map((vt) => (
                  <button
                    key={vt.id}
                    onClick={() => {
                      setSelectedVisualType(vt.id);
                      performSearch(searchQuery, activeTab, vt.id);
                    }}
                    style={{
                      padding: "4px 10px",
                      borderRadius: "12px",
                      fontSize: "11px",
                      fontWeight: 600,
                      border: "none",
                      backgroundColor: selectedVisualType === vt.id ? "#38bdf8" : "rgba(30, 41, 59, 0.7)",
                      color: selectedVisualType === vt.id ? "#0f172a" : "#94a3b8",
                      cursor: "pointer"
                    }}
                  >
                    {vt.label}
                  </button>
                ))}
              </div>
            </div>

            {/* RESULTS GRID */}
            <div style={{ padding: "16px 20px", overflowY: "auto", maxHeight: "460px" }}>
              {isLoading ? (
                <div style={{ padding: "60px 0", textAlign: "center", color: "#94a3b8" }}>
                  <Loader2 size={32} className="spin-loader" style={{ marginBottom: 12, color: "#38bdf8" }} />
                  <div>Searching Openverse & Wikimedia Commons for open licensed images...</div>
                </div>
              ) : results.length === 0 ? (
                <div style={{ padding: "60px 0", textAlign: "center", color: "#64748b" }}>
                  <ImageIcon size={40} style={{ marginBottom: 12, opacity: 0.5 }} />
                  <div>No open-licensed images found for this query.</div>
                </div>
              ) : (
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(240px, 1fr))", gap: 14 }}>
                  {results.map((img) => {
                    const imgUrl = img.thumbnail_url || img.image_url;
                    const providerName = (img.provider || "Openverse").toUpperCase();
                    const licenseName = img.license || "CC BY";
                    const isCopied = copiedId === img.id;

                    return (
                      <div
                        key={img.id}
                        style={{
                          background: "rgba(30, 41, 59, 0.5)",
                          border: "1px solid rgba(255, 255, 255, 0.1)",
                          borderRadius: 8,
                          overflow: "hidden",
                          display: "flex",
                          flexDirection: "column"
                        }}
                      >
                        {/* THUMBNAIL PREVIEW */}
                        <div style={{ height: "145px", position: "relative", overflow: "hidden", background: "#0f172a" }}>
                          <img src={imgUrl} alt={img.title} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                          
                          {/* PROVIDER BADGE */}
                          <div style={{ position: "absolute", top: 6, left: 6, background: "rgba(15, 23, 42, 0.85)", padding: "2px 6px", borderRadius: 4, fontSize: 10, fontWeight: 700, color: "#38bdf8" }}>
                            {providerName}
                          </div>

                          {/* LICENSE BADGE */}
                          <div style={{ position: "absolute", top: 6, right: 6, background: "rgba(15, 23, 42, 0.85)", padding: "2px 6px", borderRadius: 4, fontSize: 10, fontWeight: 600, color: "#10b981", display: "flex", alignItems: "center", gap: 3 }}>
                            <ShieldCheck size={11} />
                            <span>{licenseName}</span>
                          </div>

                          {/* ACTION BUTTONS OVERLAY */}
                          <div style={{ position: "absolute", inset: 0, background: "rgba(15, 23, 42, 0.75)", opacity: 0, transition: "opacity 0.15s ease", display: "flex", alignItems: "center", justifyContent: "center", gap: 8 }} className="hover-actions-overlay">
                            <button
                              onClick={() => {
                                onSelectImage?.(img.image_url, img.title, img.provider, {
                                  attribution: img.attribution,
                                  license: img.license,
                                  provider: img.provider,
                                  creator: img.creator,
                                  source_url: img.source_url
                                });
                                onClose();
                              }}
                              style={{ background: "#38bdf8", color: "#0f172a", border: "none", padding: "6px 12px", borderRadius: 4, fontWeight: 700, fontSize: 12, cursor: "pointer", display: "flex", alignItems: "center", gap: 4 }}
                            >
                              <Check size={14} />
                              <span>Insert</span>
                            </button>
                            <button
                              onClick={() => setPreviewImage(img)}
                              style={{ background: "rgba(255,255,255,0.15)", color: "#fff", border: "none", padding: "6px 10px", borderRadius: 4, fontWeight: 600, fontSize: 12, cursor: "pointer" }}
                            >
                              Preview
                            </button>
                          </div>
                        </div>

                        {/* CARD METADATA FOOTER */}
                        <div style={{ padding: "10px 12px", display: "flex", flexDirection: "column", gap: 4, flex: 1, justifyContent: "space-between" }}>
                          <div>
                            <div style={{ fontSize: "12px", fontWeight: 700, color: "#f8fafc", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }} title={img.title}>
                              {img.title || "Visual Asset"}
                            </div>
                            <div style={{ fontSize: "11px", color: "#94a3b8", display: "flex", justifyContent: "space-between" }}>
                              <span>Creator: {img.creator || "Open Contributor"}</span>
                            </div>
                          </div>

                          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", paddingTop: 4, borderTop: "1px solid rgba(255, 255, 255, 0.06)" }}>
                            <button
                              onClick={(e) => handleCopyAttribution(img, e)}
                              style={{ background: "transparent", border: "none", color: isCopied ? "#10b981" : "#64748b", fontSize: "11px", cursor: "pointer", display: "flex", alignItems: "center", gap: 4, padding: 0 }}
                              title="Copy standard CC attribution string"
                            >
                              <Copy size={12} />
                              <span>{isCopied ? "Attribution Copied!" : "Copy Attribution"}</span>
                            </button>

                            {img.source_url && (
                              <a
                                href={img.source_url}
                                target="_blank"
                                rel="noreferrer"
                                style={{ color: "#38bdf8", fontSize: "11px", textDecoration: "none", display: "flex", alignItems: "center", gap: 2 }}
                              >
                                <span>Source</span>
                                <ExternalLink size={10} />
                              </a>
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </>
        )}

        {/* FULL PREVIEW MODAL */}
        {previewImage && (
          <div className="img-full-preview-overlay" onClick={() => setPreviewImage(null)}>
            <div className="img-full-preview-card" onClick={(e) => e.stopPropagation()} style={{ background: "#0f172a", border: "1px solid rgba(255,255,255,0.15)", borderRadius: 8, padding: 16, maxWidth: "650px", width: "90vw" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
                <span style={{ fontWeight: 700, color: "#f8fafc" }}>{previewImage.title}</span>
                <button onClick={() => setPreviewImage(null)} style={{ background: "none", border: "none", color: "#94a3b8", cursor: "pointer" }}><X size={18} /></button>
              </div>
              <img src={previewImage.image_url || previewImage.thumbnail_url} alt="" style={{ width: "100%", maxHeight: "380px", objectFit: "contain", borderRadius: 6, background: "#000" }} />
              
              <div style={{ marginTop: 12, padding: 12, background: "rgba(30, 41, 59, 0.6)", borderRadius: 6, fontSize: "12px", color: "#cbd5e1" }}>
                <div><strong>Attribution:</strong> {previewImage.attribution || `Image: ${previewImage.title} — ${previewImage.creator}`}</div>
                <div><strong>License:</strong> {previewImage.license || "CC BY"} | <strong>Provider:</strong> {previewImage.provider}</div>
              </div>

              <div style={{ display: "flex", justifyContent: "flex-end", gap: 10, marginTop: 14 }}>
                <button
                  onClick={() => {
                    onSelectImage?.(previewImage.image_url, previewImage.title, previewImage.provider, {
                      attribution: previewImage.attribution,
                      license: previewImage.license,
                      provider: previewImage.provider,
                      creator: previewImage.creator,
                      source_url: previewImage.source_url
                    });
                    setPreviewImage(null);
                    onClose();
                  }}
                  style={{ background: "#38bdf8", color: "#0f172a", fontWeight: 700, padding: "8px 16px", borderRadius: 6, border: "none", cursor: "pointer" }}
                >
                  Insert Into Slide
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );

  return typeof document !== "undefined" ? createPortal(modalJSX, document.body) : modalJSX;
}
