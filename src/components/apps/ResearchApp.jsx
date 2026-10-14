import React, { useState, useEffect, useRef, useCallback } from "react";
import {
  BookOpen,
  Search,
  Sparkles,
  Send,
  Upload,
  ChevronLeft,
  ChevronRight,
  FileText,
  Network,
  ExternalLink,
  X,
  Layers,
  CheckCircle2,
  Bookmark,
  MessageSquare,
  BarChart2,
} from "lucide-react";
import {
  getSampleResearchPaper,
  uploadResearchDocument,
  queryResearchDocument,
  getConceptGraph,
  exportResearchToSlides,
} from "../../services/api";
import "./ResearchApp.css";

const CATEGORY_COLORS = {
  "Core Architecture": "#6366f1",
  "Methodology": "#3b82f6",
  "Empirical Finding": "#10b981",
  "Challenge": "#ef4444",
  "Application": "#ec4899",
  "default": "#8b5cf6",
};

export default function ResearchApp({ onNavigateToPresentation }) {
  const [mode, setMode] = useState("split"); // 'split' | 'graph' | 'slides'
  const [doc, setDoc] = useState(null);
  const [loadingDoc, setLoadingDoc] = useState(true);
  const [activePage, setActivePage] = useState(1);
  const [docSearchQuery, setDocSearchQuery] = useState("");
  
  // Selection Toolbar State
  const [selectedText, setSelectedText] = useState("");
  const [selectionPos, setSelectionPos] = useState(null);
  const [pinnedNotes, setPinnedNotes] = useState([]);

  // AI Chat State
  const [messages, setMessages] = useState([]);
  const [chatInput, setChatInput] = useState("");
  const [isQuerying, setIsQuerying] = useState(false);
  const [activeCitationContext, setActiveCitationContext] = useState(null);

  // Concept Graph State
  const [conceptGraph, setConceptGraph] = useState(null);
  const [selectedNode, setSelectedNode] = useState(null);
  const [selectedCategoryFilter, setSelectedCategoryFilter] = useState("all");
  const [graphLoading, setGraphLoading] = useState(false);

  // Slide Deck Export State
  const [slidePlan, setSlidePlan] = useState(null);
  const [generatingDeck, setGeneratingDeck] = useState(false);
  const [exportNotice, setExportNotice] = useState("");

  const docViewportRef = useRef(null);
  const fileInputRef = useRef(null);

  // 1. Initialize with Sample Research Paper
  useEffect(() => {
    async function loadInitialDocument() {
      try {
        setLoadingDoc(true);
        const sample = await getSampleResearchPaper();
        setDoc(sample);
        setMessages([
          {
            id: 1,
            role: "assistant",
            content: `👋 Welcome to the **Research & Deep Document Lab**!\n\nI have indexed **"${sample.title}"**.\n\nYou can highlight any passage on the left to extract insights, ask specific citation-grounded questions, view the **Instant Concept Graph**, or export a full structured deck to **Presentation Studio**.`,
            citations: [
              { page: 1, quote: "Analyzing quadratic memory bottlenecks in multi-head attention", badge: "Page 1" },
              { page: 3, quote: "3.4x throughput increase and 77% VRAM reduction", badge: "Page 3" },
            ],
          },
        ]);
      } catch (err) {
        console.warn("Could not load sample paper, using local fallback", err);
      } finally {
        setLoadingDoc(false);
      }
    }
    loadInitialDocument();
  }, []);

  // 2. Fetch Concept Graph when switching to graph mode or doc change
  const fetchConceptGraph = useCallback(async (docData) => {
    try {
      setGraphLoading(true);
      const res = await getConceptGraph({
        query: "extract concepts",
        doc_id: docData?.doc_id || "sample",
      });
      setConceptGraph(res);
    } catch (e) {
      console.warn("Failed to load concept graph", e);
    } finally {
      setGraphLoading(false);
    }
  }, []);

  useEffect(() => {
    if (mode === "graph" && !conceptGraph && doc) {
      fetchConceptGraph(doc);
    }
  }, [mode, conceptGraph, doc, fetchConceptGraph]);

  // 3. Document Text Selection Handler
  const handleDocMouseUp = () => {
    const selection = window.getSelection();
    const text = selection ? selection.toString().trim() : "";
    if (text && text.length > 5) {
      const range = selection.getRangeAt(0);
      const rect = range.getBoundingClientRect();
      const containerRect = docViewportRef.current?.getBoundingClientRect();

      if (containerRect) {
        setSelectedText(text);
        setSelectionPos({
          x: rect.left + rect.width / 2 - containerRect.left,
          y: rect.top - containerRect.top + docViewportRef.current.scrollTop - 10,
        });
      }
    } else {
      setSelectedText("");
      setSelectionPos(null);
    }
  };

  // 4. Ask about Highlighted Selection
  const handleAskAboutSelection = (action = "explain") => {
    if (!selectedText) return;
    const prompt =
      action === "explain"
        ? `Explain this highlighted passage in simple terms and its significance: "${selectedText}"`
        : `Summarize the implications and key takeaway of this quote: "${selectedText}"`;

    setActiveCitationContext({ text: selectedText, page: activePage });
    setChatInput(prompt);
    setSelectedText("");
    setSelectionPos(null);
  };

  const handlePinSelection = () => {
    if (!selectedText) return;
    setPinnedNotes((prev) => [
      ...prev,
      { id: Date.now(), text: selectedText, page: activePage, time: new Date().toLocaleTimeString() },
    ]);
    setSelectedText("");
    setSelectionPos(null);
  };

  // 5. Scroll to Specific Page (when clicking citations or page nav)
  const scrollToPage = (pageNumber) => {
    setActivePage(pageNumber);
    const targetElement = document.getElementById(`research-page-${pageNumber}`);
    if (targetElement && docViewportRef.current) {
      targetElement.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  // 6. Handle AI Chat Query
  const handleSendMessage = async (customText = null) => {
    const textToSend = customText || chatInput;
    if (!textToSend.trim() || isQuerying) return;

    const userMsg = {
      id: Date.now(),
      role: "user",
      content: textToSend,
      contextSnippet: activeCitationContext ? activeCitationContext.text : null,
    };

    setMessages((prev) => [...prev, userMsg]);
    setChatInput("");
    setIsQuerying(true);

    try {
      const res = await queryResearchDocument({
        query: textToSend,
        doc_id: doc?.doc_id || "sample",
        highlighted_text: activeCitationContext ? activeCitationContext.text : null,
        page_number: activeCitationContext ? activeCitationContext.page : activePage,
      });

      const assistantMsg = {
        id: Date.now() + 1,
        role: "assistant",
        content: res.answer,
        citations: res.citations || [],
      };

      setMessages((prev) => [...prev, assistantMsg]);
      setActiveCitationContext(null);
    } catch (err) {
      console.error("Query failed", err);
      setMessages((prev) => [
        ...prev,
        {
          id: Date.now() + 1,
          role: "assistant",
          content: "⚠️ I encountered an issue querying the document server. Please verify your connection.",
        },
      ]);
    } finally {
      setIsQuerying(false);
    }
  };

  // 7. Handle File Upload
  const handleFileUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setLoadingDoc(true);
      const newDoc = await uploadResearchDocument(file);
      setDoc(newDoc);
      setActivePage(1);
      setConceptGraph(null);
      setMessages([
        {
          id: Date.now(),
          role: "assistant",
          content: `✅ Successfully parsed and indexed **"${newDoc.title}"** (${newDoc.page_count} pages, ~${newDoc.word_count} words).\n\n**Executive Abstract:**\n${newDoc.summary}`,
        },
      ]);
    } catch (err) {
      console.error("Upload failed", err);
      alert("Failed to upload and parse the document. Ensure it is a valid PDF or text document.");
    } finally {
      setLoadingDoc(false);
    }
  };

  // 8. One-Click Slide Deck Export to Presentation Studio
  const handleExportToSlideDeck = async () => {
    try {
      setGeneratingDeck(true);
      const res = await exportResearchToSlides({
        doc_id: doc?.doc_id || "sample",
        title: doc?.title || "Research Synthesis",
        slide_count: 5,
      });

      if (res && res.plan) {
        setSlidePlan(res.plan);
        setMode("slides");

        // Save directly to localStorage for MOTHER Presentation Studio
        localStorage.setItem("vitya_ppt_saved_plan_v2", JSON.stringify(res.plan));
        localStorage.setItem("vitya_ppt_saved_step_v2", "2");
        localStorage.setItem("vitya_ppt_saved_slide_index_v2", "0");
        localStorage.setItem("vitya_presentation_plan", JSON.stringify(res.plan));
        localStorage.setItem("vitya_presentation_step", "2");
        localStorage.setItem("vitya_activeTab", "presentation");

        setExportNotice("✨ Research presentation deck synthesized! Ready for Presentation Studio.");
      }
    } catch (err) {
      console.error("Slide export failed", err);
    } finally {
      setGeneratingDeck(false);
    }
  };

  // 9. Open Directly in MOTHER Presentation Studio
  const handleOpenInPresentationStudio = () => {
    if (slidePlan) {
      localStorage.setItem("vitya_ppt_saved_plan_v2", JSON.stringify(slidePlan));
      localStorage.setItem("vitya_ppt_saved_step_v2", "2");
      localStorage.setItem("vitya_ppt_saved_slide_index_v2", "0");
      localStorage.setItem("vitya_presentation_plan", JSON.stringify(slidePlan));
      localStorage.setItem("vitya_presentation_step", "2");
      localStorage.setItem("vitya_activeTab", "presentation");
    }

    if (onNavigateToPresentation) {
      onNavigateToPresentation();
    } else {
      window.location.href = "/presentation";
    }
  };

  // Helper: Search Highlight Renderer
  const renderHighlightedText = (text) => {
    if (!docSearchQuery.trim()) return text;
    const parts = text.split(new RegExp(`(${docSearchQuery})`, "gi"));
    return parts.map((part, i) =>
      part.toLowerCase() === docSearchQuery.toLowerCase() ? (
        <mark key={i} className="researchSearchHighlight">
          {part}
        </mark>
      ) : (
        part
      )
    );
  };

  const pages = doc?.pages || [];
  const totalPages = pages.length || 1;

  return (
    <div className="researchAppContainer">
      {/* Hidden File Input */}
      <input
        type="file"
        ref={fileInputRef}
        style={{ display: "none" }}
        accept=".pdf,.txt,.md,.docx,.csv"
        onChange={handleFileUpload}
      />

      {/* ================= TOP COMMAND BAR ================= */}
      <header className="researchTopBar">
        <div className="researchBrandGroup">
          <div className="researchIconBox">
            <BookOpen size={20} />
          </div>
          <div className="researchTitleCol">
            <div className="researchLabHeading">
              Research & Deep Document Lab
              <span className="researchBadge">v2.5 Scholar</span>
            </div>
            <div className="researchDocMeta">
              {loadingDoc ? "Loading document..." : doc?.title || "No document loaded"}
            </div>
          </div>
        </div>

        {/* Mode Switcher Tabs */}
        <div className="researchModePills">
          <button
            className={`researchModePill ${mode === "split" ? "active" : ""}`}
            onClick={() => setMode("split")}
          >
            <Layers size={14} />
            Split Reader & Copilot
          </button>
          <button
            className={`researchModePill ${mode === "graph" ? "active" : ""}`}
            onClick={() => setMode("graph")}
          >
            <Network size={14} />
            Instant Concept Graph
          </button>
          <button
            className={`researchModePill ${mode === "slides" ? "active" : ""}`}
            onClick={() => {
              if (!slidePlan) handleExportToSlideDeck();
              else setMode("slides");
            }}
          >
            <BarChart2 size={14} />
            Slide Deck Synthesis
          </button>
        </div>

        {/* Top Action Buttons */}
        <div className="researchHeaderActions">
          <button
            className="researchUploadBtn"
            onClick={() => fileInputRef.current?.click()}
            title="Upload PDF, Paper, or Doc"
          >
            <Upload size={14} />
            Upload PDF
          </button>

          <button
            className="researchDeckExportBtn"
            onClick={handleExportToSlideDeck}
            disabled={generatingDeck}
            title="Compile paper directly into Presentation Studio deck"
          >
            <Sparkles size={14} />
            {generatingDeck ? "Synthesizing Deck..." : "⚡ Export to Slides"}
          </button>
        </div>
      </header>

      {/* ================= TAB 1: SPLIT READER & AI COPILOT ================= */}
      {mode === "split" && (
        <div className="researchMainWorkspace">
          {/* LEFT PANE: DOCUMENT VIEWER */}
          <section className="researchDocPane">
            <div className="researchDocToolbar">
              <div className="researchPageNav">
                <button
                  className="researchNavIconBtn"
                  disabled={activePage <= 1}
                  onClick={() => scrollToPage(Math.max(1, activePage - 1))}
                  title="Previous Page"
                >
                  <ChevronLeft size={16} />
                </button>
                <span className="researchPageIndicator">
                  Page {activePage} of {totalPages}
                </span>
                <button
                  className="researchNavIconBtn"
                  disabled={activePage >= totalPages}
                  onClick={() => scrollToPage(Math.min(totalPages, activePage + 1))}
                  title="Next Page"
                >
                  <ChevronRight size={16} />
                </button>
              </div>

              <div className="researchDocSearchBox">
                {pinnedNotes.length > 0 && (
                  <span
                    style={{
                      background: "rgba(245, 158, 11, 0.2)",
                      border: "1px solid rgba(245, 158, 11, 0.4)",
                      color: "#fbbf24",
                      padding: "2px 7px",
                      borderRadius: "6px",
                      fontSize: "11px",
                      fontWeight: 600,
                      marginRight: "6px",
                    }}
                    title={`${pinnedNotes.length} pinned passages saved`}
                  >
                    📌 {pinnedNotes.length}
                  </span>
                )}
                <Search size={13} color="#94a3b8" />
                <input
                  type="text"
                  className="researchDocSearchInput"
                  placeholder="Find in document..."
                  value={docSearchQuery}
                  onChange={(e) => setDocSearchQuery(e.target.value)}
                />
                {docSearchQuery && (
                  <X
                    size={13}
                    style={{ cursor: "pointer", color: "#94a3b8" }}
                    onClick={() => setDocSearchQuery("")}
                  />
                )}
              </div>
            </div>

            {/* Document Scrollable Area */}
            <div
              className="researchDocViewport"
              ref={docViewportRef}
              onMouseUp={handleDocMouseUp}
            >
              {/* Floating Selection Tooltip */}
              {selectedText && selectionPos && (
                <div
                  className="researchSelectionBar"
                  style={{ left: `${selectionPos.x}px`, top: `${selectionPos.y}px` }}
                >
                  <button
                    className="researchSelectionBtn"
                    onClick={() => handleAskAboutSelection("explain")}
                  >
                    <MessageSquare size={12} />
                    Explain Selection
                  </button>
                  <button
                    className="researchSelectionBtn"
                    onClick={() => handleAskAboutSelection("summarize")}
                  >
                    <Sparkles size={12} />
                    Summarize
                  </button>
                  <button
                    className="researchSelectionBtn"
                    onClick={handlePinSelection}
                  >
                    <Bookmark size={12} />
                    Pin Note
                  </button>
                </div>
              )}

              {pages.map((p) => (
                <article
                  key={p.page_number}
                  id={`research-page-${p.page_number}`}
                  className={`researchPageSheet ${activePage === p.page_number ? "activePage" : ""}`}
                  onClick={() => setActivePage(p.page_number)}
                >
                  <div className="researchPageHeaderRow">
                    <span className="researchPageTag">Page {p.page_number}</span>
                    <span className="researchPageHeading">{p.title || `Section ${p.page_number}`}</span>
                  </div>
                  <div className="researchPageBodyText">
                    {renderHighlightedText(p.text)}
                  </div>
                </article>
              ))}
            </div>
          </section>

          {/* RIGHT PANE: DEEP AI RESEARCH CHAT */}
          <section className="researchChatPane">
            <div className="researchChatHeader">
              <div className="researchChatTitleRow">
                <span className="researchOnlinePulse" />
                <span className="researchChatName">MOTHER Research Copilot</span>
              </div>
              <button
                className="researchClearBtn"
                onClick={() => setMessages(messages.slice(0, 1))}
              >
                Clear Chat
              </button>
            </div>

            {/* Quick Research Chips */}
            <div className="researchChipsRow">
              <button
                className="researchChip"
                onClick={() => handleSendMessage("What is the core research problem and hypothesis of this paper?")}
              >
                🎯 Core Thesis
              </button>
              <button
                className="researchChip"
                onClick={() => handleSendMessage("Detail the mathematical formulation and architecture introduced.")}
              >
                📐 Architecture Breakdown
              </button>
              <button
                className="researchChip"
                onClick={() => handleSendMessage("Extract the quantitative benchmark metrics and memory reductions.")}
              >
                📊 Empirical Benchmarks
              </button>
              <button
                className="researchChip"
                onClick={() => handleSendMessage("What are the key limitations, risks, and future research directions?")}
              >
                ⚠️ Limitations & Risks
              </button>
            </div>

            {/* Messages Scroll Area */}
            <div className="researchMessagesStream">
              {messages.map((m) => (
                <div key={m.id} className={`researchMsgItem ${m.role}`}>
                  <div className="researchBubble">
                    {m.contextSnippet && (
                      <div
                        style={{
                          fontSize: "11px",
                          fontStyle: "italic",
                          opacity: 0.8,
                          marginBottom: "6px",
                          borderLeft: "2px solid #a5b4fc",
                          paddingLeft: "6px",
                        }}
                      >
                        Referencing quote: "{m.contextSnippet.slice(0, 80)}..."
                      </div>
                    )}
                    <div style={{ whiteSpace: "pre-wrap" }}>{m.content}</div>

                    {/* Grounded Citation Badges */}
                    {m.citations && m.citations.length > 0 && (
                      <div className="researchCitationsContainer">
                        <span className="researchCitationHeading">Authoritative Citations</span>
                        <div className="researchCitationsList">
                          {m.citations.map((c, i) => (
                            <button
                              key={i}
                              className="researchCitationBadge"
                              onClick={() => scrollToPage(c.page)}
                              title={`Jump to Page ${c.page}: "${c.quote || ""}"`}
                            >
                              <FileText size={11} />
                              Page {c.page}
                            </button>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              ))}

              {isQuerying && (
                <div className="researchMsgItem assistant">
                  <div className="researchBubble" style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                    <Sparkles size={16} className="animate-spin" color="#818cf8" />
                    <span>Analyzing document citations and synthesizing response...</span>
                  </div>
                </div>
              )}
            </div>

            {/* Highlight Context Pill above Input */}
            {activeCitationContext && (
              <div className="researchContextIndicator">
                <span>
                  Context focused on Page {activeCitationContext.page}: "
                  {activeCitationContext.text.slice(0, 60)}..."
                </span>
                <button onClick={() => setActiveCitationContext(null)}>✕</button>
              </div>
            )}

            {/* Chat Input Bar */}
            <div className="researchChatInputBar">
              <div className="researchInputWrapper">
                <input
                  type="text"
                  className="researchTextInput"
                  placeholder="Ask any research question about this document..."
                  value={chatInput}
                  onChange={(e) => setChatInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && !e.shiftKey) {
                      e.preventDefault();
                      handleSendMessage();
                    }
                  }}
                />
              </div>
              <button
                className="researchSendBtn"
                onClick={() => handleSendMessage()}
                disabled={isQuerying || !chatInput.trim()}
              >
                <Send size={16} />
              </button>
            </div>
          </section>
        </div>
      )}

      {/* ================= TAB 2: INSTANT CONCEPT GRAPH ================= */}
      {mode === "graph" && (
        <div className="researchGraphContainer">
          <div className="researchGraphControls">
            <div className="researchGraphCategoryLegend">
              <span style={{ fontSize: "12px", fontWeight: 700, color: "#94a3b8" }}>
                Filter Entities:
              </span>
              <div
                className="researchLegendItem"
                onClick={() => setSelectedCategoryFilter("all")}
                style={{
                  background: selectedCategoryFilter === "all" ? "rgba(255,255,255,0.12)" : "transparent",
                }}
              >
                <span>All ({conceptGraph?.nodes?.length || 0})</span>
              </div>
              {(conceptGraph?.categories || []).map((cat) => (
                <div
                  key={cat}
                  className="researchLegendItem"
                  onClick={() => setSelectedCategoryFilter(cat)}
                  style={{
                    background: selectedCategoryFilter === cat ? "rgba(255,255,255,0.12)" : "transparent",
                  }}
                >
                  <span
                    className="researchLegendDot"
                    style={{ background: CATEGORY_COLORS[cat] || CATEGORY_COLORS.default }}
                  />
                  <span>{cat}</span>
                </div>
              ))}
            </div>

            <button
              className="researchUploadBtn"
              onClick={() => fetchConceptGraph(doc)}
              disabled={graphLoading}
            >
              <Sparkles size={13} />
              Regenerate Graph
            </button>
          </div>

          <div className="researchGraphCanvasBox">
            {graphLoading ? (
              <div style={{ textAlign: "center", color: "#94a3b8" }}>
                <Sparkles size={24} className="animate-spin" color="#818cf8" style={{ marginBottom: 12 }} />
                <p>Generating deep semantic entity relationships & concept graph...</p>
              </div>
            ) : (
              <svg className="researchGraphSvg" viewBox="0 0 900 550">
                <defs>
                  <linearGradient id="linkGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#6366f1" stopOpacity="0.6" />
                    <stop offset="100%" stopColor="#06b6d4" stopOpacity="0.3" />
                  </linearGradient>
                </defs>

                {/* Draw Edges */}
                {conceptGraph?.links?.map((link, idx) => {
                  const sourceNode = conceptGraph.nodes.find((n) => n.id === link.source);
                  const targetNode = conceptGraph.nodes.find((n) => n.id === link.target);
                  if (!sourceNode || !targetNode) return null;

                  const sIdx = conceptGraph.nodes.indexOf(sourceNode);
                  const tIdx = conceptGraph.nodes.indexOf(targetNode);
                  const total = conceptGraph.nodes.length;

                  // Arrange in an aesthetically balanced circular-orbital layout
                  const sAngle = (sIdx / total) * 2 * Math.PI - Math.PI / 2;
                  const tAngle = (tIdx / total) * 2 * Math.PI - Math.PI / 2;
                  const radius = 200;
                  const cx = 450;
                  const cy = 275;

                  const sx = sIdx === 0 ? cx : cx + radius * Math.cos(sAngle);
                  const sy = sIdx === 0 ? cy : cy + radius * Math.sin(sAngle);
                  const tx = tIdx === 0 ? cx : cx + radius * Math.cos(tAngle);
                  const ty = tIdx === 0 ? cy : cy + radius * Math.sin(tAngle);

                  const mx = (sx + tx) / 2;
                  const my = (sy + ty) / 2;

                  return (
                    <g key={idx}>
                      <line
                        x1={sx}
                        y1={sy}
                        x2={tx}
                        y2={ty}
                        className="researchEdgePath"
                        stroke="url(#linkGradient)"
                      />
                      {link.relation && (
                        <text x={mx} y={my - 4} className="researchEdgeLabel">
                          {link.relation}
                        </text>
                      )}
                    </g>
                  );
                })}

                {/* Draw Nodes */}
                {conceptGraph?.nodes?.map((node, idx) => {
                  if (
                    selectedCategoryFilter !== "all" &&
                    node.category !== selectedCategoryFilter
                  ) {
                    return null;
                  }

                  const total = conceptGraph.nodes.length;
                  const angle = (idx / total) * 2 * Math.PI - Math.PI / 2;
                  const radius = 200;
                  const cx = 450;
                  const cy = 275;

                  const nx = idx === 0 ? cx : cx + radius * Math.cos(angle);
                  const ny = idx === 0 ? cy : cy + radius * Math.sin(angle);
                  const color = CATEGORY_COLORS[node.category] || CATEGORY_COLORS.default;
                  const nodeRadius = idx === 0 ? 36 : 26;

                  return (
                    <g
                      key={node.id}
                      className="researchNodeCircle"
                      onClick={() => setSelectedNode(node)}
                      style={{ cursor: "pointer" }}
                    >
                      <circle
                        cx={nx}
                        cy={ny}
                        r={nodeRadius + 4}
                        fill={color}
                        opacity={0.15}
                      />
                      <circle
                        cx={nx}
                        cy={ny}
                        r={nodeRadius}
                        fill={color}
                        stroke="#ffffff"
                        strokeWidth={selectedNode?.id === node.id ? 3 : 1.5}
                      />
                      <text
                        x={nx}
                        y={ny + 4}
                        fill="#ffffff"
                        fontSize={idx === 0 ? "13px" : "11px"}
                        fontWeight="700"
                        textAnchor="middle"
                        pointerEvents="none"
                      >
                        {idx === 0 ? "★" : idx + 1}
                      </text>
                      <text
                        x={nx}
                        y={ny + nodeRadius + 14}
                        className="researchNodeLabel"
                      >
                        {node.label.length > 24 ? node.label.slice(0, 22) + "..." : node.label}
                      </text>
                    </g>
                  );
                })}
              </svg>
            )}

            {/* Selected Node Details Card */}
            {selectedNode && (
              <div className="researchNodeDetailCard">
                <div className="researchNodeCardHeader">
                  <span className="researchNodeCardCategory">{selectedNode.category}</span>
                  <button
                    onClick={() => setSelectedNode(null)}
                    style={{ background: "transparent", border: "none", color: "#94a3b8", cursor: "pointer" }}
                  >
                    ✕
                  </button>
                </div>
                <h4 className="researchNodeCardTitle">{selectedNode.label}</h4>
                <p className="researchNodeCardDesc">{selectedNode.description}</p>
                <button
                  className="researchNodeAskBtn"
                  onClick={() => {
                    setMode("split");
                    handleSendMessage(`Explain the role and significance of '${selectedNode.label}' in this research.`);
                  }}
                >
                  <MessageSquare size={13} />
                  Ask Copilot About This Concept
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ================= TAB 3: SLIDE DECK SYNTHESIS ================= */}
      {mode === "slides" && (
        <div className="researchDeckPreviewContainer">
          <div className="researchDeckPreviewHeader">
            <div className="researchDeckTitleBlock">
              <h3>Presentation Synthesis Deck</h3>
              <p>
                Structured {slidePlan?.slides?.length || 5}-slide briefing compiled directly from paper research findings.
              </p>
            </div>
            <button
              className="researchDeckExportBtn"
              onClick={handleOpenInPresentationStudio}
            >
              <ExternalLink size={14} />
              Open in Presentation Studio →
            </button>
          </div>

          {exportNotice && (
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "8px",
                padding: "10px 16px",
                background: "rgba(16, 185, 129, 0.15)",
                border: "1px solid rgba(16, 185, 129, 0.35)",
                borderRadius: "8px",
                color: "#6ee7b7",
                fontSize: "13px",
                fontWeight: 600,
                marginBottom: "24px",
              }}
            >
              <CheckCircle2 size={16} />
              <span>{exportNotice}</span>
            </div>
          )}

          <div className="researchSlideCardsGrid">
            {(slidePlan?.slides || []).map((slide, sIdx) => (
              <div key={slide.id || sIdx} className="researchSlideCard">
                <div className="researchSlideCardTop">
                  <span className="researchSlideNumber">Slide {sIdx + 1}</span>
                  <span className="researchSlideLayoutTag">{slide.layout || "content_slide"}</span>
                </div>
                <h4 className="researchSlideCardTitle">{slide.title}</h4>
                <div className="researchSlideCardSubtitle">{slide.subtitle}</div>

                {/* Bullets Plugin preview */}
                {slide.plugins
                  ?.filter((p) => p.type === "bullets")
                  .map((p, bIdx) => (
                    <ul key={bIdx} className="researchSlideBulletList">
                      {(p.data?.bullets || []).map((bullet, idx) => (
                        <li key={idx}>{bullet}</li>
                      ))}
                    </ul>
                  ))}

                {/* Chart Plugin preview */}
                {slide.plugins
                  ?.filter((p) => p.type === "chart")
                  .map((p, cIdx) => (
                    <div
                      key={cIdx}
                      style={{
                        background: "rgba(255,255,255,0.04)",
                        padding: "8px 12px",
                        borderRadius: "8px",
                        margin: "10px 0",
                        fontSize: "11.5px",
                        color: "#a5b4fc",
                      }}
                    >
                      📊 <strong>Chart Plugin:</strong> {p.data?.title || "Metrics"}
                      <div style={{ fontSize: "11px", color: "#cbd5e1", marginTop: "4px" }}>
                        Labels: {(p.data?.labels || []).join(", ")}
                      </div>
                    </div>
                  ))}

                {/* Stat Plugin preview */}
                {slide.plugins
                  ?.filter((p) => p.type === "stat")
                  .map((p, stIdx) => (
                    <div
                      key={stIdx}
                      style={{
                        display: "flex",
                        alignItems: "baseline",
                        gap: "8px",
                        marginTop: "12px",
                        paddingTop: "8px",
                        borderTop: "1px solid rgba(255,255,255,0.08)",
                      }}
                    >
                      <span style={{ fontSize: "20px", fontWeight: 800, color: "#ec4899" }}>
                        {p.data?.number}
                      </span>
                      <span style={{ fontSize: "11.5px", color: "#94a3b8" }}>{p.data?.label}</span>
                    </div>
                  ))}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
