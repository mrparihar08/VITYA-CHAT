import React, { useEffect, useMemo, useState, useRef, useCallback } from "react";
import { API_BASE_URL, getAuthHeaders } from "../services/api";
import { PPT_PROMPTS } from "./PPT_Prompt";
import PresentationSetup from "./PresentationSetup";
import PresentationEditor, { BACKGROUND_PRESETS } from "./PresentationEditor";

const DEFAULT_API_BASE = `${API_BASE_URL}/api/presentation`;

function cleanBaseUrl(url) {
  return (url || "").trim().replace(/\/+$/, "");
}

function isAbsoluteUrl(url) {
  return /^https?:\/\//i.test(String(url || "").trim());
}

function joinUrl(base, path) {
  const b = cleanBaseUrl(base);
  const p = String(path || "").trim();
  if (!p) return b;
  if (isAbsoluteUrl(p)) return p;
  if (p.startsWith("/")) return `${b}${p}`;
  return `${b}/${p}`;
}

function resolveDownloadUrl(path) {
  if (!path) return "";
  if (isAbsoluteUrl(path)) return path;
  return path.startsWith("/")
    ? `${API_BASE_URL}${path}`
    : joinUrl(DEFAULT_API_BASE, path);
}

function safeArray(value) {
  return Array.isArray(value) ? value : [];
}

async function readResponse(res) {
  const text = await res.text();
  try {
    return text ? JSON.parse(text) : {};
  } catch {
    return { detail: text || "Invalid server response" };
  }
}

function sanitizePlanForBackend(rawPlan, themeConfig = null) {
  if (!rawPlan) return undefined;

  const title = (rawPlan.title || "Presentation Deck").trim();
  const theme = themeConfig
    ? {
        bg_color: themeConfig.solid_bg || "#0f172a",
        bg_gradient_start: themeConfig.bg_start || "#0f172a",
        bg_gradient_end: themeConfig.bg_end || "#31104b",
        text_color: themeConfig.text || "#ffffff",
        accent_color: themeConfig.accent || "#c084fc",
      }
    : undefined;

  const validLayouts = [
    "title_slide",
    "title_content",
    "mixed_content_slide",
    "chart_slide",
    "image_slide",
    "bullets_slide",
    "section_slide",
    "table_slide",
  ];

  const slides = safeArray(rawPlan.slides).map((slide, idx) => {
    const slideTitle = (slide.title || `Slide ${idx + 1}`).trim();
    let slideSubtitle = (slide.subtitle || "").trim();

    let layout = validLayouts.includes(slide.layout) ? slide.layout : "title_content";
    if (idx === 0 && (!slide.layout || slide.layout === "title_content")) {
      layout = "title_slide";
    }

    const plugins = [];

    safeArray(slide.plugins).forEach((p) => {
      if (!p || !p.type) return;

      if (p.type === "subtitle") {
        const subTxt = String(p.data?.text || "").trim();
        if (!slideSubtitle && subTxt) {
          slideSubtitle = subTxt;
        } else if (subTxt) {
          plugins.push({
            type: "text",
            data: { text: subTxt },
          });
        }
      } else if (p.type === "bullets") {
        const points = safeArray(p.data?.points)
          .map((pt) => String(pt).trim())
          .filter(Boolean);
        if (points.length > 0) {
          plugins.push({
            type: "bullets",
            data: { points },
          });
        }
      } else if (p.type === "paragraph") {
        const text = String(p.data?.text || "").trim();
        if (text) {
          plugins.push({
            type: "paragraph",
            data: { text },
          });
        }
      } else if (p.type === "stat") {
        const num = String(p.data?.number || "").trim();
        const lbl = String(p.data?.label || "").trim();
        const combinedText = [num, lbl].filter(Boolean).join(" - ");
        if (combinedText) {
          plugins.push({
            type: "text",
            data: { text: combinedText },
          });
        }
      } else if (p.type === "chart") {
        plugins.push({
          type: "chart",
          data: {
            chart_type: p.data?.chart_type || "bar",
            title: String(p.data?.title || "Metrics").trim(),
            labels: safeArray(p.data?.labels),
            values: safeArray(p.data?.values).map(Number),
          },
        });
      } else if (p.type === "image") {
        const url = String(p.data?.url || "").trim();
        if (url) {
          plugins.push({
            type: "image",
            data: {
              url,
              caption: String(p.data?.caption || "").trim(),
            },
          });
        }
      } else if (p.type === "notes") {
        const notes = String(p.data?.notes || "").trim();
        if (notes) {
          plugins.push({
            type: "notes",
            data: { notes },
          });
        }
      } else if (p.type === "text") {
        const text = String(p.data?.text || "").trim();
        if (text) {
          plugins.push({
            type: "text",
            data: { text },
          });
        }
      }
    });

    return {
      layout,
      title: slideTitle,
      subtitle: slideSubtitle || undefined,
      plugins,
    };
  });

  return { title, theme, slides };
}

export default function PresentationGenerator() {
  // Page Step State: 1 = Setup, 2 = Slide Editor
  const [currentStep, setCurrentStep] = useState(1);

  const [prompt, setPrompt] = useState(
    "Create a professional presentation on Artificial Intelligence and Machine Learning."
  );
  const [slideCount, setSlideCount] = useState(6);
  const [audience, setAudience] = useState("Students & Professionals");
  const [includeCitations, setIncludeCitations] = useState(false);
  const [includeSpeakerNotes, setIncludeSpeakerNotes] = useState(true);
  const [useGemini, setUseGemini] = useState(true);
  const [smartMode, setSmartMode] = useState(true);

  // Search State
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);

  // Custom Color Theme State 🎨
  const [selectedBgPreset, setSelectedBgPreset] = useState("dark_gradient");
  const [customBgColor1, setCustomBgColor1] = useState("#1e1b4b");
  const [customBgColor2, setCustomBgColor2] = useState("#0f172a");
  const [customTextColor, setCustomTextColor] = useState("#ffffff");

  // Export Format State 📑
  const [exportFormat, setExportFormat] = useState("pptx"); // 'pptx' | 'pdf'

  // Initial Plan State
  const [plan, setPlan] = useState({
    title: "Artificial Intelligence & Future Tech",
    slides: [
      {
        title: "Introduction to Artificial Intelligence",
        subtitle: "Key Concepts, Applications & Overview",
        layout: "title_content",
        plugins: [
          { type: "subtitle", data: { text: "Understanding Modern AI & Machine Intelligence" } },
          { type: "paragraph", data: { text: "Artificial Intelligence refers to the simulation of human intelligence in machines programmed to think and learn." } },
          { type: "bullets", data: { points: ["Machine Learning & Deep Learning", "Natural Language Processing (NLP)", "Computer Vision & Autonomous Systems"] } },
          { type: "notes", data: { notes: "Welcome the audience and explain the foundational goal of AI." } }
        ]
      },
      {
        title: "Core Pillars & Performance Metrics",
        subtitle: "How AI Systems Scale",
        layout: "chart_slide",
        plugins: [
          { type: "subtitle", data: { text: "Data Science & Growth Analytics" } },
          { type: "chart", data: { chart_type: "bar", title: "Enterprise AI Adoption Rate", labels: ["2023", "2024", "2025", "2026"], values: [45, 62, 80, 95] } },
          { type: "stat", data: { number: "95%", label: "Projected 2026 Adoption" } },
          { type: "notes", data: { notes: "Highlight key statistical growth and industry relevance." } }
        ]
      }
    ]
  });

  const [activeSlideIndex, setActiveSlideIndex] = useState(0);
  const [loadingPlan, setLoadingPlan] = useState(false);
  const [loadingGenerate, setLoadingGenerate] = useState(false);
  const [error, setError] = useState("");

  // Presenter View State
  const [isPresenting, setIsPresenting] = useState(false);
  const [presenterSlideIndex, setPresenterSlideIndex] = useState(0);
  const [showPresenterNotes, setShowPresenterNotes] = useState(true);
  const [presentationTime, setPresentationTime] = useState(0);
  const timerRef = useRef(null);

  // Download State
  const [downloadUrl, setDownloadUrl] = useState("");
  const [fileName, setFileName] = useState("");
  const [generatedMeta, setGeneratedMeta] = useState(null);

  const previewCount = useMemo(() => safeArray(plan?.slides).length, [plan]);

  useEffect(() => {
    const controller = new AbortController();
    const checkService = async () => {
      try {
        await fetch(joinUrl(DEFAULT_API_BASE, "/health"), { signal: controller.signal });
      } catch {
        // service check
      }
    };
    checkService();
    return () => controller.abort();
  }, []);

  // Compute Active Background Configuration
  const selectedBgConfig = useMemo(() => {
    if (selectedBgPreset === "custom") {
      return {
        id: "custom",
        name: "Custom Palette",
        bg: `linear-gradient(135deg, ${customBgColor1} 0%, ${customBgColor2} 100%)`,
        text: customTextColor,
      };
    }
    return BACKGROUND_PRESETS.find((bg) => bg.id === selectedBgPreset) || BACKGROUND_PRESETS[0];
  }, [selectedBgPreset, customBgColor1, customBgColor2, customTextColor]);

  // Handle Search for topics
  const handlePerformSearch = useCallback((e) => {
    if (e) e.preventDefault();
    const query = (searchQuery || "").trim().toLowerCase();
    setIsSearching(true);

    if (!query && selectedCategory === "all") {
      setSearchResults([]);
      setIsSearching(false);
      return;
    }

    const filtered = PPT_PROMPTS.filter((item) => {
      const matchCategory = selectedCategory === "all" || item.category === selectedCategory;
      if (!query) return matchCategory;

      const titleMatch = item.title.toLowerCase().includes(query);
      const descMatch = (item.desc || "").toLowerCase().includes(query);
      const kwMatch = item.keywords && item.keywords.some((kw) => kw.toLowerCase().includes(query));
      return matchCategory && (titleMatch || descMatch || kwMatch);
    });

    setSearchResults(filtered);
  }, [searchQuery, selectedCategory]);

  useEffect(() => {
    if (searchQuery.trim() || selectedCategory !== "all") {
      handlePerformSearch();
    } else {
      setSearchResults([]);
      setIsSearching(false);
    }
  }, [selectedCategory, searchQuery, handlePerformSearch]);

  const handleSelectTopicFromSearch = (item) => {
    setPrompt(item.prompt);
    if (item.slideCount) setSlideCount(item.slideCount);
    if (item.audience) setAudience(item.audience);
    setError("");
  };

  const buildPrompt = () => {
    const requirements = [
      `Create approximately ${slideCount} slides.`,
      `Target audience: ${audience}.`,
      `Tone: Clear and professional.`,
      `Language: English.`,
      includeCitations && "Include source citations where facts or claims are used.",
      includeSpeakerNotes && "Include concise speaker notes for every slide.",
    ].filter(Boolean);

    return `${prompt.trim()}\n\nPresentation requirements:\n${requirements
      .map((item) => `- ${item}`)
      .join("\n")}`;
  };

  const buildPayload = ({ includePlan = false } = {}) => {
    const activeThemeConfig = {
      solid_bg: selectedBgPreset === "custom" ? customBgColor1 : (selectedBgConfig?.solid_bg || "#0f172a"),
      bg_start: selectedBgPreset === "custom" ? customBgColor1 : (selectedBgConfig?.bg_start || "#0f172a"),
      bg_end: selectedBgPreset === "custom" ? customBgColor2 : (selectedBgConfig?.bg_end || "#31104b"),
      text: selectedBgPreset === "custom" ? customTextColor : (selectedBgConfig?.text || "#ffffff"),
      accent: selectedBgConfig?.accent || "#c084fc",
    };

    const sanitizedPlan = includePlan && plan ? sanitizePlanForBackend(plan, activeThemeConfig) : undefined;

    return {
      prompt: buildPrompt(),
      export_format: exportFormat || "pptx",
      background_theme: "dark",
      content_theme: "dark",
      visual_style: "minimal",
      slide_count: slideCount,
      audience: audience.trim() || null,
      tone: "Clear and professional",
      language: "English",
      include_citations: includeCitations,
      include_speaker_notes: includeSpeakerNotes,
      use_gemini: useGemini,
      smart_mode: smartMode,
      plan: sanitizedPlan,
    };
  };

  // Fetch / Preview Plan from API AND SWITCH TO SECOND PAGE (EDITOR)
  const fetchPlan = async () => {
    if (!prompt.trim()) {
      setError("Please describe or search a presentation topic first.");
      return;
    }

    setError("");
    setLoadingPlan(true);
    setDownloadUrl("");
    setFileName("");

    try {
      const res = await fetch(joinUrl(DEFAULT_API_BASE, "/plan"), {
        method: "POST",
        headers: { "Content-Type": "application/json", ...getAuthHeaders() },
        body: JSON.stringify(buildPayload({ includePlan: false })),
      });

      const data = await readResponse(res);
      if (!res.ok) throw new Error(data?.detail || "Failed to preview plan");
      setPlan(data);
      setActiveSlideIndex(0);
      setCurrentStep(2); // 🚀 Switch to Second Page (PresentationEditor)!
    } catch (err) {
      setError(err?.message || "Something went wrong fetching plan");
    } finally {
      setLoadingPlan(false);
    }
  };

  // Generate Final PPT / PDF File FROM EDITED PLAN
  const generatePpt = async () => {
    const payload = buildPayload({ includePlan: true });

    if (!payload.prompt || !payload.prompt.trim()) {
      setError("Please describe the presentation you want to create.");
      return;
    }

    setError("");
    setLoadingGenerate(true);
    setDownloadUrl("");
    setFileName("");
    setGeneratedMeta(null);

    try {
      const res = await fetch(joinUrl(DEFAULT_API_BASE, "/generate"), {
        method: "POST",
        headers: { "Content-Type": "application/json", ...getAuthHeaders() },
        body: JSON.stringify(payload),
      });

      const data = await readResponse(res);
      if (!res.ok) throw new Error(data?.detail || "Failed to generate presentation");

      const ext = exportFormat === "pdf" ? "pdf" : "pptx";
      setFileName(data.file_name || `presentation.${ext}`);
      setDownloadUrl(resolveDownloadUrl(data.download_url));
      setGeneratedMeta({
        title: data.title || plan?.title || "Your presentation is ready",
        slides: data.slides || data.slide_count || previewCount || slideCount,
      });
    } catch (err) {
      setError(err?.message || "Something went wrong generating presentation");
    } finally {
      setLoadingGenerate(false);
    }
  };

  // SLIDE MANAGEMENT HANDLERS ✏️
  const handleDeckTitleChange = (newTitle) => {
    setPlan((prev) => (prev ? { ...prev, title: newTitle } : prev));
  };

  const handleSlideTitleChange = (index, newTitle) => {
    setPlan((prev) => {
      if (!prev) return prev;
      const slides = [...prev.slides];
      slides[index] = { ...slides[index], title: newTitle };
      return { ...prev, slides };
    });
  };

  const handleSlideSubtitleChange = (index, newSubtitle) => {
    setPlan((prev) => {
      if (!prev) return prev;
      const slides = [...prev.slides];
      slides[index] = { ...slides[index], subtitle: newSubtitle };
      return { ...prev, slides };
    });
  };

  const handleAddSlide = () => {
    setPlan((prev) => {
      const count = (prev?.slides?.length || 0) + 1;
      const newSlide = {
        title: `Slide ${count}: Custom Topic Title`,
        subtitle: "Subheading / Key Takeaway",
        layout: "title_content",
        plugins: [
          { type: "subtitle", data: { text: "Section Overview & Details" } },
          { type: "paragraph", data: { text: "Add descriptive narrative paragraph text here..." } },
          { type: "bullets", data: { points: ["First important key takeaway", "Second supporting point"] } },
          { type: "notes", data: { notes: "Speaker notes for this slide..." } }
        ]
      };
      const slides = [...(prev?.slides || []), newSlide];
      setActiveSlideIndex(slides.length - 1);
      return {
        title: prev?.title || "My Presentation Deck",
        slides,
      };
    });
  };

  const handleDuplicateSlide = (index) => {
    setPlan((prev) => {
      if (!prev) return prev;
      const slideCopy = JSON.parse(JSON.stringify(prev.slides[index]));
      slideCopy.title = `${slideCopy.title} (Copy)`;
      const slides = [...prev.slides];
      slides.splice(index + 1, 0, slideCopy);
      setActiveSlideIndex(index + 1);
      return { ...prev, slides };
    });
  };

  const handleDeleteSlide = (index) => {
    setPlan((prev) => {
      if (!prev) return prev;
      const slides = prev.slides.filter((_, i) => i !== index);
      if (activeSlideIndex >= slides.length) {
        setActiveSlideIndex(Math.max(0, slides.length - 1));
      }
      return { ...prev, slides };
    });
  };

  const handleMoveSlide = (index, direction) => {
    setPlan((prev) => {
      if (!prev) return prev;
      const slides = [...prev.slides];
      const targetIndex = index + direction;
      if (targetIndex < 0 || targetIndex >= slides.length) return prev;
      const temp = slides[index];
      slides[index] = slides[targetIndex];
      slides[targetIndex] = temp;
      setActiveSlideIndex(targetIndex);
      return { ...prev, slides };
    });
  };

  // FEATURE PLUGIN HANDLERS 🧩
  const handlePluginTextChange = (slideIndex, pluginIndex, key, value, bulletIndex = null) => {
    setPlan((prev) => {
      if (!prev) return prev;
      const slides = [...prev.slides];
      const slide = { ...slides[slideIndex] };
      const plugins = [...slide.plugins];
      const plugin = { ...plugins[pluginIndex] };
      const data = { ...plugin.data };

      if (bulletIndex !== null && Array.isArray(data.points)) {
        const points = [...data.points];
        points[bulletIndex] = value;
        data.points = points;
      } else {
        data[key] = value;
      }

      plugin.data = data;
      plugins[pluginIndex] = plugin;
      slide.plugins = plugins;
      slides[slideIndex] = slide;
      return { ...prev, slides };
    });
  };

  const handleChartDataChange = (slideIndex, pluginIndex, field, rawInput) => {
    setPlan((prev) => {
      if (!prev) return prev;
      const slides = [...prev.slides];
      const slide = { ...slides[slideIndex] };
      const plugins = [...slide.plugins];
      const plugin = { ...plugins[pluginIndex] };
      const data = { ...plugin.data };

      if (field === "labels") {
        data.labels = rawInput.split(",").map((s) => s.trim());
      } else if (field === "values") {
        data.values = rawInput.split(",").map((s) => Number(s.trim()) || 0);
      } else {
        data[field] = rawInput;
      }

      plugin.data = data;
      plugins[pluginIndex] = plugin;
      slide.plugins = plugins;
      slides[slideIndex] = slide;
      return { ...prev, slides };
    });
  };

  const handleAddBullet = (slideIndex, pluginIndex) => {
    setPlan((prev) => {
      if (!prev) return prev;
      const slides = [...prev.slides];
      const slide = { ...slides[slideIndex] };
      const plugins = [...slide.plugins];
      const plugin = { ...plugins[pluginIndex] };
      const data = { ...plugin.data, points: [...(plugin.data?.points || []), "New point detail"] };
      plugin.data = data;
      plugins[pluginIndex] = plugin;
      slide.plugins = plugins;
      slides[slideIndex] = slide;
      return { ...prev, slides };
    });
  };

  const handleDeleteBullet = (slideIndex, pluginIndex, bulletIndex) => {
    setPlan((prev) => {
      if (!prev) return prev;
      const slides = [...prev.slides];
      const slide = { ...slides[slideIndex] };
      const plugins = [...slide.plugins];
      const plugin = { ...plugins[pluginIndex] };
      const points = safeArray(plugin.data?.points).filter((_, i) => i !== bulletIndex);
      plugin.data = { ...plugin.data, points };
      plugins[pluginIndex] = plugin;
      slide.plugins = plugins;
      slides[slideIndex] = slide;
      return { ...prev, slides };
    });
  };

  const handleAddPlugin = (slideIndex, pluginType) => {
    setPlan((prev) => {
      if (!prev) return prev;
      const slides = [...prev.slides];
      const slide = { ...slides[slideIndex] };
      const plugins = [...slide.plugins];

      let newPlugin = { type: pluginType, data: {} };
      if (pluginType === "subtitle") {
        newPlugin.data = { text: "New Subtitle / Section Header" };
      } else if (pluginType === "chart") {
        newPlugin.data = {
          chart_type: "bar",
          title: "Quarterly Performance",
          labels: ["Q1", "Q2", "Q3", "Q4"],
          values: [40, 65, 85, 95]
        };
      } else if (pluginType === "image") {
        newPlugin.data = {
          url: "https://images.unsplash.com/photo-1518770660439-4636190af475?w=600",
          caption: "Technology Visual Element",
          align: "center"
        };
      } else if (pluginType === "bullets") {
        newPlugin.data = { points: ["Key bullet item 1", "Key bullet item 2"] };
      } else if (pluginType === "paragraph") {
        newPlugin.data = { text: "Enter descriptive paragraph narrative here..." };
      } else if (pluginType === "stat") {
        newPlugin.data = { number: "95%", label: "Key Metric / Growth Rate" };
      } else if (pluginType === "notes") {
        newPlugin.data = { notes: "Speaker notes for presentation..." };
      }

      plugins.push(newPlugin);
      slide.plugins = plugins;
      slides[slideIndex] = slide;
      return { ...prev, slides };
    });
  };

  const handleDeletePlugin = (slideIndex, pluginIndex) => {
    setPlan((prev) => {
      if (!prev) return prev;
      const slides = [...prev.slides];
      const slide = { ...slides[slideIndex] };
      const plugins = slide.plugins.filter((_, i) => i !== pluginIndex);
      slide.plugins = plugins;
      slides[slideIndex] = slide;
      return { ...prev, slides };
    });
  };

  // Presenter Mode Handlers 📺
  const startPresentationMode = () => {
    if (!plan?.slides?.length) return;
    setIsPresenting(true);
    setPresenterSlideIndex(activeSlideIndex);
    setPresentationTime(0);
    timerRef.current = setInterval(() => {
      setPresentationTime((t) => t + 1);
    }, 1000);
  };

  const stopPresentationMode = () => {
    setIsPresenting(false);
    if (timerRef.current) clearInterval(timerRef.current);
  };

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (!isPresenting) return;
      if (e.key === "ArrowRight" || e.key === "Space") {
        setPresenterSlideIndex((i) => Math.min((plan?.slides?.length || 1) - 1, i + 1));
      } else if (e.key === "ArrowLeft") {
        setPresenterSlideIndex((i) => Math.max(0, i - 1));
      } else if (e.key === "Escape") {
        stopPresentationMode();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isPresenting, plan]);

  const secondsFormatted = (presentationTime % 60).toString().padStart(2, "0");
  const minutesFormatted = Math.floor(presentationTime / 60);

  return (
    <>
      <style>{`
        :root {
          --bg-0: #090d1a;
          --bg-1: #0e1628;
          --bg-2: #162036;
          --panel: rgba(15, 23, 42, 0.85);
          --panel-border: rgba(255, 255, 255, 0.12);
          --accent: #8b5cf6;
          --accent-hover: #7c3aed;
          --accent-cyan: #06b6d4;
          --text: #f8fafc;
          --text-muted: #94a3b8;
          --radius-lg: 20px;
          --radius-md: 12px;
        }

        * { box-sizing: border-box; }
        body {
          margin: 0;
          font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
          color: var(--text);
          background: radial-gradient(circle at 50% 0%, #1e1b4b 0%, #0f172a 60%, var(--bg-0) 100%);
        }

        .ppt-shell { min-height: 100vh; padding: 20px; max-width: 1400px; margin: 0 auto; }

        .ppt-header-bar {
          display: flex;
          justify-content: space-between;
          align-items: center;
          flex-wrap: wrap;
          gap: 14px;
          background: rgba(15, 23, 42, 0.9);
          border: 1px solid var(--panel-border);
          border-radius: var(--radius-lg);
          padding: 16px 24px;
          margin-bottom: 20px;
          backdrop-filter: blur(16px);
        }

        .ppt-header-title {
          flex-shrink: 0;
        }

        .ppt-header-title h1 {
          margin: 0;
          font-size: 22px;
          font-weight: 800;
          background: linear-gradient(135deg, #c084fc, #60a5fa);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          white-space: nowrap;
        }
        .ppt-header-title p {
          margin: 4px 0 0;
          font-size: 13px;
          color: var(--text-muted);
          white-space: nowrap;
        }

        .ppt-header-controls {
          display: flex;
          gap: 10px;
          align-items: center;
          flex-wrap: wrap;
        }

        .card-box {
          background: var(--panel);
          border: 1px solid var(--panel-border);
          border-radius: var(--radius-lg);
          padding: 20px;
          backdrop-filter: blur(16px);
          box-shadow: 0 10px 30px rgba(0,0,0,0.3);
        }

        .section-label {
          font-size: 11px;
          font-weight: 800;
          letter-spacing: 1px;
          text-transform: uppercase;
          color: #c084fc;
          margin-bottom: 12px;
        }

        /* SEARCH BAR */
        .search-box-wrap {
          display: flex;
          gap: 8px;
          margin-bottom: 14px;
        }

        .search-input {
          flex: 1;
          background: rgba(0, 0, 0, 0.4);
          border: 1px solid var(--panel-border);
          border-radius: var(--radius-md);
          padding: 10px 14px;
          color: #fff;
          font-size: 13px;
          outline: none;
          transition: border-color 0.2s;
        }
        .search-input:focus { border-color: var(--accent); }

        .category-chips {
          display: flex;
          gap: 6px;
          overflow-x: auto;
          padding-bottom: 8px;
          margin-bottom: 14px;
        }
        .category-chip {
          background: rgba(255, 255, 255, 0.05);
          border: 1px solid var(--panel-border);
          color: var(--text-muted);
          padding: 5px 10px;
          border-radius: 20px;
          font-size: 11px;
          font-weight: 600;
          cursor: pointer;
          white-space: nowrap;
        }
        .category-chip.active {
          background: rgba(139, 92, 246, 0.25);
          border-color: var(--accent);
          color: #fff;
        }

        .search-results-container {
          max-height: 200px;
          overflow-y: auto;
          display: flex;
          flex-direction: column;
          gap: 8px;
          margin-bottom: 16px;
        }
        .search-result-card {
          background: rgba(255, 255, 255, 0.04);
          border: 1px solid rgba(255, 255, 255, 0.08);
          border-radius: 10px;
          padding: 10px 12px;
          cursor: pointer;
          transition: all 0.2s;
          text-align: left;
        }
        .search-result-card:hover {
          background: rgba(139, 92, 246, 0.15);
          border-color: var(--accent);
        }

        .field-group { margin-bottom: 14px; }
        .field-group label { display: block; font-size: 12px; font-weight: 700; color: var(--text-muted); margin-bottom: 6px; }
        .field-group textarea, .field-group input, .field-group select {
          width: 100%;
          background: rgba(0, 0, 0, 0.35);
          border: 1px solid var(--panel-border);
          border-radius: var(--radius-md);
          padding: 10px 12px;
          color: #fff;
          font-size: 13px;
          outline: none;
        }

        .btn-ui {
          display: inline-flex;
          flex-direction: row;
          align-items: center;
          justify-content: center;
          gap: 6px;
          border-radius: var(--radius-md);
          padding: 10px 16px;
          font-size: 13px;
          font-weight: 700;
          border: none;
          cursor: pointer;
          transition: all 0.2s;
          white-space: nowrap;
        }
        .btn-ui.primary {
          background: linear-gradient(135deg, #8b5cf6 0%, #6366f1 100%);
          color: #fff;
          box-shadow: 0 4px 14px rgba(139, 92, 246, 0.4);
        }
        .btn-ui.primary:hover { opacity: 0.92; transform: translateY(-1px); }
        .btn-ui.secondary {
          background: rgba(255, 255, 255, 0.07);
          border: 1px solid var(--panel-border);
          color: #fff;
        }
        .btn-ui.secondary:hover { background: rgba(255, 255, 255, 0.12); }
        .btn-ui.danger {
          background: rgba(239, 68, 68, 0.15);
          border: 1px solid rgba(239, 68, 68, 0.3);
          color: #fca5a5;
        }
        .btn-ui.sm { padding: 6px 12px; font-size: 12px; border-radius: 8px; white-space: nowrap; }
        .btn-ui:disabled { opacity: 0.5; cursor: not-allowed; }

        .editor-workspace {
          display: grid;
          grid-template-columns: 260px 1fr;
          gap: 16px;
          align-items: start;
        }

        .slide-list-panel {
          background: rgba(0, 0, 0, 0.3);
          border: 1px solid var(--panel-border);
          border-radius: 16px;
          padding: 14px;
          max-height: 780px;
          overflow-y: auto;
          display: flex;
          flex-direction: column;
          gap: 10px;
        }

        .slide-tab-item {
          background: rgba(255, 255, 255, 0.03);
          border: 1px solid var(--panel-border);
          border-radius: 12px;
          padding: 12px;
          cursor: pointer;
          transition: all 0.2s;
          text-align: left;
        }
        .slide-tab-item.active {
          border-color: #8b5cf6;
          background: rgba(139, 92, 246, 0.2);
          box-shadow: 0 4px 12px rgba(139, 92, 246, 0.25);
        }

        .slide-tab-number { font-size: 11px; font-weight: 800; color: #c084fc; text-transform: uppercase; margin-bottom: 4px; }
        .slide-tab-title { font-size: 13px; font-weight: 700; color: #fff; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }

        .feature-inspector-container {
          display: flex;
          flex-direction: column;
          gap: 16px;
        }

        /* CANVAS PREVIEW (16:9) */
        .slide-canvas-box {
          aspect-ratio: 16 / 9;
          width: 100%;
          border-radius: 16px;
          padding: 36px;
          box-shadow: 0 20px 40px rgba(0, 0, 0, 0.5);
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          overflow: hidden;
          transition: background 0.3s;
        }

        .feature-block-card {
          background: rgba(0, 0, 0, 0.35);
          border: 1px solid var(--panel-border);
          border-radius: 14px;
          padding: 14px;
          margin-bottom: 10px;
        }
        .feature-block-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 8px;
          font-size: 12px;
          font-weight: 700;
          color: #c084fc;
        }

        .add-feature-bar {
          display: flex;
          gap: 8px;
          flex-wrap: wrap;
          background: rgba(255, 255, 255, 0.03);
          border: 1px dashed var(--panel-border);
          border-radius: 14px;
          padding: 12px;
        }

        .presenter-overlay {
          position: fixed;
          top: 0; left: 0; right: 0; bottom: 0;
          background: #000;
          z-index: 9999;
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          padding: 30px;
        }
        .presenter-canvas {
          flex: 1;
          display: flex;
          flex-direction: column;
          justify-content: center;
          max-width: 1200px;
          margin: 0 auto;
          width: 100%;
        }

        .success-banner {
          background: rgba(34, 197, 94, 0.12);
          border: 1px solid rgba(34, 197, 94, 0.3);
          border-radius: 14px;
          padding: 14px;
          color: #86efac;
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        @media (max-width: 1024px) {
          .editor-workspace { grid-template-columns: 1fr; }
        }
      `}</style>

      <div className="ppt-shell">
        {/* HEADER BAR */}
        <div className="ppt-header-bar">
          <div className="ppt-header-title">
            <h1>Presentation Studio & AI Generator</h1>
            <p>Direct Edited Plan Compilation & Export (.pptx / .pdf)</p>
          </div>

          <div className="ppt-header-controls">
            {/* PAGE STEP NAVIGATION PILLS */}
            <div style={{ display: "flex", gap: 4, background: "rgba(0,0,0,0.3)", padding: 4, borderRadius: 10, border: "1px solid var(--panel-border)" }}>
              <button
                className={`btn-ui sm ${currentStep === 1 ? "primary" : "secondary"}`}
                onClick={() => setCurrentStep(1)}
              >
                Topic Setup
              </button>
              <button
                className={`btn-ui sm ${currentStep === 2 ? "primary" : "secondary"}`}
                onClick={() => setCurrentStep(2)}
              >
                Slide Editor {plan?.slides?.length ? `(${plan.slides.length})` : ""}
              </button>
            </div>

            {/* EXPORT FORMAT SELECTOR */}
            <div style={{ display: "flex", alignItems: "center", gap: 6, background: "rgba(0,0,0,0.3)", padding: "4px 10px", borderRadius: 10, border: "1px solid var(--panel-border)" }}>
              <span style={{ fontSize: 11, fontWeight: "bold", color: "#c084fc", whiteSpace: "nowrap" }}>Format:</span>
              <select
                value={exportFormat}
                onChange={(e) => setExportFormat(e.target.value)}
                style={{ background: "transparent", border: "none", color: "#fff", fontWeight: "bold", fontSize: 12, outline: "none", cursor: "pointer", whiteSpace: "nowrap" }}
              >
                <option value="pptx" style={{ background: "#0f172a" }}>📊 Presentation (.pptx)</option>
                <option value="pdf" style={{ background: "#0f172a" }}>📄 Doc(.pdf)</option>
              </select>
            </div>

            {currentStep === 2 && plan?.slides?.length ? (
              <button className="btn-ui secondary" onClick={startPresentationMode}>
                📺 Present
              </button>
            ) : null}
            {currentStep === 2 && plan?.slides?.length ? (
              <button className="btn-ui primary" onClick={generatePpt} disabled={loadingGenerate}>
                {loadingGenerate ? `Compiling...` : `🚀 Download (${exportFormat.toUpperCase()})`}
              </button>
            ) : null}
          </div>
        </div>

        {/* CONDITIONAL STEP PAGE RENDERING */}
        {currentStep === 1 ? (
          /* STEP 1: TOPIC SEARCH & SETUP PAGE (OPENS FIRST) */
          <PresentationSetup
            prompt={prompt}
            setPrompt={setPrompt}
            slideCount={slideCount}
            setSlideCount={setSlideCount}
            audience={audience}
            setAudience={setAudience}
            includeCitations={includeCitations}
            setIncludeCitations={setIncludeCitations}
            includeSpeakerNotes={includeSpeakerNotes}
            setIncludeSpeakerNotes={setIncludeSpeakerNotes}
            useGemini={useGemini}
            setUseGemini={setUseGemini}
            smartMode={smartMode}
            setSmartMode={setSmartMode}
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            selectedCategory={selectedCategory}
            setSelectedCategory={setSelectedCategory}
            searchResults={searchResults}
            isSearching={isSearching}
            loadingPlan={loadingPlan}
            loadingGenerate={loadingGenerate}
            error={error}
            fetchPlan={fetchPlan}
            handlePerformSearch={handlePerformSearch}
            handleSelectTopicFromSearch={handleSelectTopicFromSearch}
          />
        ) : (
          /* STEP 2: SLIDE WORKSPACE & FEATURE EDITOR PAGE (OPENS AFTER CLICKING GENERATE) */
          <PresentationEditor
            plan={plan}
            activeSlideIndex={activeSlideIndex}
            setActiveSlideIndex={setActiveSlideIndex}
            selectedBgPreset={selectedBgPreset}
            setSelectedBgPreset={setSelectedBgPreset}
            customBgColor1={customBgColor1}
            setCustomBgColor1={setCustomBgColor1}
            customBgColor2={customBgColor2}
            setCustomBgColor2={setCustomBgColor2}
            customTextColor={customTextColor}
            setCustomTextColor={setCustomTextColor}
            selectedBgConfig={selectedBgConfig}
            downloadUrl={downloadUrl}
            exportFormat={exportFormat}
            generatedMeta={generatedMeta}
            handleDeckTitleChange={handleDeckTitleChange}
            handleSlideTitleChange={handleSlideTitleChange}
            handleSlideSubtitleChange={handleSlideSubtitleChange}
            handleAddSlide={handleAddSlide}
            handleDuplicateSlide={handleDuplicateSlide}
            handleDeleteSlide={handleDeleteSlide}
            handleMoveSlide={handleMoveSlide}
            handlePluginTextChange={handlePluginTextChange}
            handleChartDataChange={handleChartDataChange}
            handleAddBullet={handleAddBullet}
            handleDeleteBullet={handleDeleteBullet}
            handleAddPlugin={handleAddPlugin}
            handleDeletePlugin={handleDeletePlugin}
            isPresenting={isPresenting}
            presenterSlideIndex={presenterSlideIndex}
            setPresenterSlideIndex={setPresenterSlideIndex}
            showPresenterNotes={showPresenterNotes}
            setShowPresenterNotes={setShowPresenterNotes}
            minutesFormatted={minutesFormatted}
            secondsFormatted={secondsFormatted}
            stopPresentationMode={stopPresentationMode}
            onBackToSetup={() => setCurrentStep(1)}
          />
        )}
      </div>
    </>
  );
}