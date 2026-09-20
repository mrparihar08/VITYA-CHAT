import React, { useEffect, useMemo, useState } from "react";
import { API_BASE_URL, getAuthHeaders } from "../../services/api";
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

function ensureHttpsExceptLocal(url) {
  if (!url) return "";
  if (/^http:\/\/(localhost|127\.0\.0\.1)(:\d+)?/i.test(url)) {
    return url;
  }
  return url.replace(/^http:\/\//i, "https://");
}

function resolveDownloadUrl(path) {
  if (!path) return "";
  if (isAbsoluteUrl(path)) return ensureHttpsExceptLocal(path);
  return path.startsWith("/")
    ? `${API_BASE_URL}${path}`
    : joinUrl(DEFAULT_API_BASE, path);
}

export async function downloadFileAsBlob(url, filename = "presentation.pptx") {
  if (!url) return;
  const targetUrl = ensureHttpsExceptLocal(url);
  const cacheBustUrl = targetUrl.includes("?")
    ? `${targetUrl}&_t=${Date.now()}`
    : `${targetUrl}?_t=${Date.now()}`;

  try {
    const res = await fetch(cacheBustUrl, { cache: "no-store" });
    if (!res.ok) throw new Error(`HTTP error ${res.status}`);
    const blob = await res.blob();
    const blobUrl = window.URL.createObjectURL(blob);

    const link = document.createElement("a");
    link.href = blobUrl;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    setTimeout(() => window.URL.revokeObjectURL(blobUrl), 10000);
  } catch (err) {
    console.warn("Blob download failed, using direct window open fallback", err);
    window.open(cacheBustUrl, "_blank");
  }
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

  const slides = safeArray(rawPlan.slides).map((slide, idx) => {
    const slideTitle = (slide.title || `Slide ${idx + 1}`).trim();
    let slideSubtitle = (slide.subtitle || "").trim();
    let layout = slide.layout || "title_content";

    const plugins = [];

    safeArray(slide.plugins).forEach((p) => {
      if (!p || !p.type) return;

      const pluginData = { ...(p.data || {}) };

      if (p.type === "bullets") {
        const points = safeArray(pluginData.points).map((pt) => String(pt).trim()).filter(Boolean);
        plugins.push({
          type: "bullets",
          data: { ...pluginData, points: points.length ? points : ["Key takeaway point"] },
        });
      } else if (p.type === "paragraph") {
        plugins.push({
          type: "paragraph",
          data: { ...pluginData, text: String(pluginData.text || "").trim() },
        });
      } else if (p.type === "paragraph_2col") {
        const rawItems = Array.isArray(pluginData.items) && pluginData.items.length > 0
          ? pluginData.items.map((it) => ({ title: String(it.title || "").trim(), text: String(it.text || "").trim() }))
          : [
              { title: String(pluginData.left_title || "").trim(), text: String(pluginData.left_text || pluginData.text || "").trim() },
              { title: String(pluginData.right_title || "").trim(), text: String(pluginData.right_text || "").trim() }
            ];
        plugins.push({
          type: "paragraph_2col",
          data: {
            ...pluginData,
            items: rawItems,
            left_title: String(pluginData.left_title || rawItems[0]?.title || "").trim(),
            left_text: String(pluginData.left_text || pluginData.text || rawItems[0]?.text || "").trim(),
            right_title: String(pluginData.right_title || rawItems[1]?.title || "").trim(),
            right_text: String(pluginData.right_text || rawItems[1]?.text || "").trim(),
          },
        });
      } else if (p.type === "subtitle" || p.type === "text") {
        plugins.push({
          type: "text",
          data: { ...pluginData, text: String(pluginData.text || "").trim() },
        });
      } else if (p.type === "chart") {
        plugins.push({
          type: "chart",
          data: {
            ...pluginData,
            chart_type: pluginData.chart_type || "bar",
            title: String(pluginData.title || "Metrics").trim(),
            labels: safeArray(pluginData.labels),
            values: safeArray(pluginData.values).map(Number),
          },
        });
      } else if (p.type === "diagram") {
        plugins.push({
          type: "diagram",
          data: {
            ...pluginData,
            diagram: String(pluginData.diagram || pluginData.text || "").trim(),
            diagram_type: pluginData.diagram_type || "flowchart",
          },
        });
      } else if (p.type === "stat" || p.type === "metric") {
        plugins.push({
          type: "stat",
          data: {
            ...pluginData,
            number: String(pluginData.number || "100%").trim(),
            label: String(pluginData.label || "Metric Detail").trim(),
          },
        });
      } else if (p.type === "table") {
        plugins.push({
          type: "table",
          data: {
            ...pluginData,
            title: String(pluginData.title || "Table Overview").trim(),
            headers: safeArray(pluginData.headers),
            rows: safeArray(pluginData.rows),
          },
        });
      } else if (p.type === "image") {
        const url = String(pluginData.url || pluginData.path || "").trim();
        plugins.push({
          type: "image",
          data: { ...pluginData, url, path: url, caption: String(pluginData.caption || "").trim() },
        });
      } else if (p.type === "notes") {
        plugins.push({
          type: "notes",
          data: { ...pluginData, notes: String(pluginData.notes || "").trim() },
        });
      } else if (p.type === "shape") {
        plugins.push({
          type: "shape",
          data: {
            ...pluginData,
            shape_type: pluginData.shape_type || pluginData.type || "rectangle",
            fill_color: pluginData.fill_color || pluginData.fill || "#38bdf8",
            stroke_color: pluginData.stroke_color || pluginData.stroke || "#0284c7",
            stroke_width: Number(pluginData.stroke_width || pluginData.line_width) || 1.5,
            x: Number(pluginData.x !== undefined ? pluginData.x : pluginData.left) || 0.8,
            y: Number(pluginData.y !== undefined ? pluginData.y : pluginData.top) || 1.8,
            width: Number(pluginData.width || pluginData.w) || 3.0,
            height: Number(pluginData.height || pluginData.h) || 1.8,
            text: String(pluginData.text || "").trim(),
          },
        });
      } else if (p.type === "callout") {
        plugins.push({
          type: "callout",
          data: {
            ...pluginData,
            title: String(pluginData.title || "KEY TAKEAWAY").trim(),
            text: String(pluginData.text || "").trim(),
            icon: String(pluginData.icon || "💡").trim(),
            variant: pluginData.variant || "info",
          },
        });
      } else if (p.type === "kpi_grid") {
        const rawKpis = safeArray(pluginData.items || pluginData.kpis);
        plugins.push({
          type: "kpi_grid",
          data: {
            ...pluginData,
            title: String(pluginData.title || "Key Performance Indicators").trim(),
            kpis: rawKpis.map((k) => ({
              number: String(k.number || "0").trim(),
              label: String(k.label || "Metric").trim(),
              trend: String(k.trend || k.change || "").trim(),
            })),
            items: rawKpis,
          },
        });
      } else if (p.type === "pros_cons") {
        plugins.push({
          type: "pros_cons",
          data: {
            ...pluginData,
            title: String(pluginData.title || "Pros & Cons Analysis").trim(),
            pros_title: String(pluginData.pros_title || "✅ STRENGTHS & ADVANTAGES").trim(),
            pros: safeArray(pluginData.pros).map((x) => String(x).trim()).filter(Boolean),
            cons_title: String(pluginData.cons_title || "❌ CHALLENGES & CONSIDERATIONS").trim(),
            cons: safeArray(pluginData.cons).map((x) => String(x).trim()).filter(Boolean),
          },
        });
      } else if (p.type === "roadmap") {
        const rawSteps = safeArray(pluginData.steps || pluginData.phases);
        plugins.push({
          type: "roadmap",
          data: {
            ...pluginData,
            title: String(pluginData.title || "Roadmap Timeline").trim(),
            phases: rawSteps.map((s) => ({
              phase: String(s.phase || "Phase").trim(),
              title: String(s.title || "Milestone").trim(),
              status: String(s.status || "PLANNED").trim(),
              description: String(s.description || "").trim(),
            })),
            steps: rawSteps,
          },
        });
      } else if (p.type === "code_block") {
        plugins.push({
          type: "code_block",
          data: {
            ...pluginData,
            title: String(pluginData.title || "Code Snippet").trim(),
            code: String(pluginData.code || "").trim(),
            language: String(pluginData.language || "python").trim(),
          },
        });
      } else if (p.type === "speaker_card") {
        plugins.push({
          type: "speaker_card",
          data: {
            ...pluginData,
            name: String(pluginData.name || "Speaker Name").trim(),
            role: String(pluginData.role || "Keynote Presenter").trim(),
            bio: safeArray(pluginData.bio).map((b) => String(b).trim()).filter(Boolean),
          },
        });
      } else {
        plugins.push({
          type: p.type,
          data: pluginData,
        });
      }
    });

    return {
      layout,
      title: slideTitle,
      subtitle: slideSubtitle || undefined,
      title_color: slide.title_color,
      title_font_size: slide.title_font_size,
      title_bold: slide.title_bold,
      title_align: slide.title_align,
      title_valign: slide.title_valign,
      subtitle_color: slide.subtitle_color,
      subtitle_font_size: slide.subtitle_font_size,
      subtitle_align: slide.subtitle_align,
      subtitle_valign: slide.subtitle_valign,
      font_family: slide.font_family,
      effect: slide.effect,
      card_effect: slide.card_effect,
      plugins,
    };

  });

  return { title, theme, slides };
}

const STORAGE_KEY_PLAN = "vitya_ppt_saved_plan_v2";
const STORAGE_KEY_STEP = "vitya_ppt_saved_step_v2";
const STORAGE_KEY_BG = "vitya_ppt_saved_bg_v2";
const STORAGE_KEY_CUSTOM_BG1 = "vitya_ppt_saved_custom_bg1_v2";
const STORAGE_KEY_CUSTOM_BG2 = "vitya_ppt_saved_custom_bg2_v2";
const STORAGE_KEY_CUSTOM_TEXT = "vitya_ppt_saved_custom_text_v2";
const STORAGE_KEY_SLIDE_INDEX = "vitya_ppt_saved_slide_index_v2";

const DEFAULT_PLAN = {
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
        { type: "chart", data: { chart_type: "column", title: "Enterprise AI Adoption Rate", labels: ["2023", "2024", "2025", "2026"], values: [45, 62, 80, 95] } },
        { type: "stat", data: { number: "95%", label: "Projected 2026 Adoption" } },
        { type: "notes", data: { notes: "Highlight key statistical growth and industry relevance." } }
      ]
    }
  ]
};

export default function PresentationGenerator({ presentationId = null }) {
  // Page Step State: 1 = Setup, 2 = Slide Editor (Restored from localStorage)
  const [currentStep, setCurrentStep] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_STEP);
      return saved ? Number(saved) : 1;
    } catch {
      return 1;
    }
  });

  const [prompt, setPrompt] = useState(
    "Create a professional presentation on Artificial Intelligence and Machine Learning."
  );
  const [slideCount, setSlideCount] = useState(8);
  const [depth, setDepth] = useState("medium");
  const [style, setStyle] = useState("professional");
  const [userRequirements, setUserRequirements] = useState("");
  const [audience, setAudience] = useState("Students & Professionals");
  const [tone, setTone] = useState("Professional");
  const [language, setLanguage] = useState("English");
  const [contentTheme, setContentTheme] = useState("auto");
  const [visualStyle, setVisualStyle] = useState("minimal");

  const [planPreview, setPlanPreview] = useState(null);

  const [includeSpeakerNotes, setIncludeSpeakerNotes] = useState(true);
  const [includeAgendaSlide, setIncludeAgendaSlide] = useState(true);
  const [useWebSearch, setUseWebSearch] = useState(true);
  const [useAiImageGen, setUseAiImageGen] = useState(true);
  const [smartMode] = useState(true);
  const [allowChart, setAllowChart] = useState(true);

  // Master Template Selection State 📐
  const handleTemplateChange = (val) => {
    setTemplateName(val);
    if (val && val !== "none") {
      setSelectedBgPreset("none");
    }
  };

  const handleBgPresetChange = (val) => {
    setSelectedBgPreset(val);
    if (val && val !== "none") {
      setTemplateName("none");
    }
  };

  const [templateName, setTemplateName] = useState(() => {
    try {
      return localStorage.getItem("vitya_template_name") || "base_template";
    } catch {
      return "base_template";
    }
  });

  // Save & Download Lifecycle State 💾
  const [isSaving, setIsSaving] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const [saveError, setSaveError] = useState("");
  const [savedMeta, setSavedMeta] = useState(null);


  // Custom Color Theme State 🎨 (Restored from localStorage)
  const [selectedBgPreset, setSelectedBgPreset] = useState(() => {
    try {
      return localStorage.getItem(STORAGE_KEY_BG) || "dark_gradient";
    } catch {
      return "dark_gradient";
    }
  });

  const [customBgColor1, setCustomBgColor1] = useState(() => {
    try {
      return localStorage.getItem(STORAGE_KEY_CUSTOM_BG1) || "#1e1b4b";
    } catch {
      return "#1e1b4b";
    }
  });

  const [customBgColor2, setCustomBgColor2] = useState(() => {
    try {
      return localStorage.getItem(STORAGE_KEY_CUSTOM_BG2) || "#0f172a";
    } catch {
      return "#0f172a";
    }
  });

  const [customTextColor, setCustomTextColor] = useState(() => {
    try {
      return localStorage.getItem(STORAGE_KEY_CUSTOM_TEXT) || "#ffffff";
    } catch {
      return "#ffffff";
    }
  });

  // Custom Brand Template State 🏢 (Restored from localStorage)
  const [useCustomBrand, setUseCustomBrand] = useState(() => {
    try { return localStorage.getItem("vitya_brand_active") === "true"; } catch { return false; }
  });
  const [brandLogo, setBrandLogo] = useState(() => {
    try { return localStorage.getItem("vitya_brand_logo") || ""; } catch { return ""; }
  });
  const [brandColor, setBrandColor] = useState(() => {
    try { return localStorage.getItem("vitya_brand_color") || "#8b5cf6"; } catch { return "#8b5cf6"; }
  });
  const [brandSecondaryColor, setBrandSecondaryColor] = useState(() => {
    try { return localStorage.getItem("vitya_brand_secondary_color") || "#0f172a"; } catch { return "#0f172a"; }
  });
  const [brandFont, setBrandFont] = useState(() => {
    try { return localStorage.getItem("vitya_brand_font") || "Arial"; } catch { return "Arial"; }
  });
  const [brandFooter, setBrandFooter] = useState(() => {
    try { return localStorage.getItem("vitya_brand_footer") || ""; } catch { return ""; }
  });

  useEffect(() => {
    fetch(`${DEFAULT_API_BASE}/brand-profile`, { headers: getAuthHeaders() })
      .then((r) => (r.ok ? r.json() : null))
      .then((data) => {
        if (data) {
          if (data.brand_logo) setBrandLogo(data.brand_logo);
          if (data.brand_color) setBrandColor(data.brand_color);
          if (data.brand_secondary_color) setBrandSecondaryColor(data.brand_secondary_color);
          if (data.brand_font) setBrandFont(data.brand_font);
          if (data.brand_footer) setBrandFooter(data.brand_footer);
          if (data.brand_logo || data.brand_footer) setUseCustomBrand(true);
        }
      })
      .catch((err) => console.warn("Could not sync brand profile from database", err));
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem("vitya_brand_active", String(useCustomBrand));
      localStorage.setItem("vitya_brand_logo", brandLogo || "");
      localStorage.setItem("vitya_brand_color", brandColor || "#8b5cf6");
      localStorage.setItem("vitya_brand_secondary_color", brandSecondaryColor || "#0f172a");
      localStorage.setItem("vitya_brand_font", brandFont || "Arial");
      localStorage.setItem("vitya_brand_footer", brandFooter || "");
    } catch (e) {
      console.warn("Failed to persist brand settings to localStorage", e);
    }

    const timer = setTimeout(() => {
      if (useCustomBrand) {
        fetch(`${DEFAULT_API_BASE}/brand-profile`, {
          method: "POST",
          headers: { "Content-Type": "application/json", ...getAuthHeaders() },
          body: JSON.stringify({
            brand_name: "My Brand",
            brand_logo: brandLogo,
            brand_color: brandColor,
            brand_secondary_color: brandSecondaryColor,
            brand_font: brandFont,
            brand_footer: brandFooter,
          }),
        }).catch((err) => console.warn("Could not save brand profile to database", err));
      }
    }, 1000);

    return () => clearTimeout(timer);
  }, [useCustomBrand, brandLogo, brandColor, brandSecondaryColor, brandFont, brandFooter]);

  // Export Format State 📑
  // eslint-disable-next-line no-unused-vars
  const [exportFormat, setExportFormat] = useState("pptx"); // 'pptx' | 'pdf'
  const [plan, setPlan] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_PLAN);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed && Array.isArray(parsed.slides) && parsed.slides.length > 0) {
          return parsed;
        }
      }
    } catch (e) {
      console.warn("Failed to load saved presentation plan from localStorage", e);
    }
    return DEFAULT_PLAN;
  });

  const [activeSlideIndex, setActiveSlideIndex] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_SLIDE_INDEX);
      return saved ? Number(saved) : 0;
    } catch {
      return 0;
    }
  });

  // AUTO-SAVE PRESENTATION DECK TO LOCALSTORAGE ON EVERY EDIT
  useEffect(() => {
    try {
      if (plan) {
        localStorage.setItem(STORAGE_KEY_PLAN, JSON.stringify(plan));
      }
      localStorage.setItem(STORAGE_KEY_STEP, String(currentStep));
      localStorage.setItem(STORAGE_KEY_SLIDE_INDEX, String(activeSlideIndex));
      localStorage.setItem(STORAGE_KEY_BG, selectedBgPreset);
      localStorage.setItem(STORAGE_KEY_CUSTOM_BG1, customBgColor1);
      localStorage.setItem(STORAGE_KEY_CUSTOM_BG2, customBgColor2);
      localStorage.setItem(STORAGE_KEY_CUSTOM_TEXT, customTextColor);
      localStorage.setItem("vitya_template_name", templateName);
    } catch (e) {
      console.warn("Failed to persist presentation deck to localStorage", e);
    }
  }, [plan, currentStep, activeSlideIndex, selectedBgPreset, customBgColor1, customBgColor2, customTextColor, templateName]);

  useEffect(() => {
    if (!presentationId) return;
    const fetchSavedPresentation = async () => {
      try {
        const res = await fetch(joinUrl(DEFAULT_API_BASE, `/${presentationId}`), {
          headers: getAuthHeaders(),
        });
        if (!res.ok) return;
        const data = await readResponse(res);
        if (data && data.plan) {
          setPlan(data.plan);
          if (data.theme_name) setSelectedBgPreset(data.theme_name);
          if (data.download_url) setDownloadUrl(resolveDownloadUrl(data.download_url));
          setCurrentStep(2);
        }
      } catch (err) {
        console.warn("Failed to load presentation by id", err);
      }
    };
    fetchSavedPresentation();
  }, [presentationId]);

  const handleResetPlanToDefault = () => {
    if (window.confirm("Start a new presentation deck? (Current draft will be reset)")) {
      try {
        localStorage.removeItem(STORAGE_KEY_PLAN);
        localStorage.removeItem(STORAGE_KEY_STEP);
        localStorage.removeItem(STORAGE_KEY_SLIDE_INDEX);
      } catch (e) {
        console.warn("LocalStorage clear error", e);
      }
      setPlan(DEFAULT_PLAN);
      setPlanPreview(null);
      setActiveSlideIndex(0);
      setCurrentStep(1);
    }
  };
  const [loadingPlan, setLoadingPlan] = useState(false);
  const [error, setError] = useState("");

  // Download State
  const [downloadUrl, setDownloadUrl] = useState("");
  const [generatedMeta, setGeneratedMeta] = useState(null);

  const previewCount = useMemo(() => safeArray(plan?.slides).length, [plan]);

  useEffect(() => {
    const controller = new AbortController();
    const checkService = async () => {
      try {
        await fetch(joinUrl(DEFAULT_API_BASE, "/"), { signal: controller.signal });
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



  const buildPrompt = () => {
    const requirements = [
      `Create approximately ${slideCount === "auto" ? 8 : slideCount} slides with high executive quality and domain depth.`,
      `Must include an explicit 'Introduction & Executive Context' slide (or 'Introduction to [Topic]') right after the Title Cover.`,
      `Include structured, audience-ready section titles (Presentation Overview, Introduction, System Architecture, Feature Comparison, Data Metrics, Conclusion).`,
      `Target audience: ${audience}.`,
      `Tone: ${tone || "Professional"}.`,
      `Language: ${language || "English"}.`,
      userRequirements && `Specific requirements: ${userRequirements}`,
      includeSpeakerNotes && "Include concise speaker notes for every slide.",
      includeAgendaSlide && "Include an Auto Agenda / Table of Contents slide at the beginning of the presentation right after the title cover.",
    ].filter(Boolean);

    return `${prompt.trim()}\n\nPresentation quality requirements:\n${requirements
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
      topic: prompt.trim(),
      export_format: exportFormat || "pptx",
      template_name: (templateName && templateName !== "none") ? templateName : "none",
      background_theme: (selectedBgPreset && selectedBgPreset !== "none") ? selectedBgPreset : "none",
      content_theme: (selectedBgPreset && selectedBgPreset !== "none") ? (contentTheme || selectedBgPreset) : "none",
      visual_style: style || visualStyle || "minimal",
      slide_count: slideCount,
      depth: depth || "medium",
      style: style || "professional",
      user_requirements: userRequirements || undefined,
      audience: audience ? audience.trim() : null,
      tone: tone || "Professional",
      language: language || "English",
      include_speaker_notes: includeSpeakerNotes,
      include_agenda_slide: includeAgendaSlide,
      use_web_search: useWebSearch,
      use_ai_image_generation: useAiImageGen,
      smart_mode: smartMode,
      allow_bullets: true,
      allow_chart: allowChart,
      allow_section_slide: true,
      plan: sanitizedPlan || planPreview?.structured_plan || planPreview?.plan,
      brand_logo: useCustomBrand ? brandLogo : undefined,
      brand_color: useCustomBrand ? brandColor : undefined,
      brand_secondary_color: useCustomBrand ? brandSecondaryColor : undefined,
      brand_font: useCustomBrand ? brandFont : undefined,
      brand_footer: useCustomBrand ? brandFooter : undefined,
      use_custom_brand: useCustomBrand,
    };
  };

  const [isCleaningCache, setIsCleaningCache] = useState(false);
  const [cleanupMessage, setCleanupMessage] = useState("");

  const handleTriggerCacheCleanup = async () => {
    setIsCleaningCache(true);
    setCleanupMessage("");
    try {
      const res = await fetch(joinUrl(DEFAULT_API_BASE, "/cleanup"), {
        method: "POST",
        headers: { "Content-Type": "application/json", ...getAuthHeaders() },
      });
      const data = await readResponse(res);
      const msg = data?.message || `Cache cleaned: ${data?.deleted_files ?? 0} expired files removed (${data?.freed_space_mb ?? "0"} MB freed).`;
      setCleanupMessage(msg);
      setTimeout(() => setCleanupMessage(""), 5000);
    } catch (err) {
      setCleanupMessage("Cache cleanup request sent to background task.");
      setTimeout(() => setCleanupMessage(""), 5000);
    } finally {
      setIsCleaningCache(false);
    }
  };

  // Save Presentation to Backend API 💾 (Uses RESTful PUT when updating existing deck, POST /save for initial)
  const savePresentation = async () => {
    const payload = buildPayload({ includePlan: true });

    if (!payload.prompt || !payload.prompt.trim()) {
      setError("Please describe the presentation you want to create.");
      return { success: false, error: "Prompt required" };
    }

    setError("");
    setSaveError("");
    setIsSaving(true);

    const existingId = savedMeta?.presentation_id || presentationId || plan?.presentation_id;
    const targetEndpoint = existingId ? `/${existingId}` : "/save";
    const httpMethod = existingId ? "PUT" : "POST";

    try {
      let res = await fetch(joinUrl(DEFAULT_API_BASE, targetEndpoint), {
        method: httpMethod,
        headers: { "Content-Type": "application/json", ...getAuthHeaders() },
        body: JSON.stringify(payload),
      });

      // Fallback to POST /save if PUT returned 404 or 405
      if (!res.ok && existingId && (res.status === 404 || res.status === 405)) {
        res = await fetch(joinUrl(DEFAULT_API_BASE, "/save"), {
          method: "POST",
          headers: { "Content-Type": "application/json", ...getAuthHeaders() },
          body: JSON.stringify(payload),
        });
      }

      const data = await readResponse(res);
      if (!res.ok) throw new Error(data?.detail || "Failed to save presentation");

      const ext = exportFormat === "pdf" ? "pdf" : "pptx";
      const fullUrl = resolveDownloadUrl(data.download_url);
      setDownloadUrl(fullUrl);
      setSavedMeta({
        presentation_id: data.presentation_id,
        file_name: data.file_name || `presentation.${ext}`,
        download_url: fullUrl,
        message: data.message || "Presentation saved successfully",
      });
      setGeneratedMeta({
        title: plan?.title || "Your presentation deck",
        slides: previewCount || slideCount,
      });
      // Keep planPreview in sync with the saved structured plan
      if (data.structured_plan || data.plan) {
        setPlanPreview((prev) => (prev ? { ...prev, structured_plan: data.structured_plan, plan: data.plan } : null));
      }
      setIsSaved(true);
      return {
        success: true,
        downloadUrl: fullUrl,
        fileName: data.file_name || `presentation.${ext}`,
        presentationId: data.presentation_id,
      };
    } catch (err) {
      const errMsg = err?.message || "Something went wrong saving presentation";
      setSaveError(errMsg);
      setError(errMsg);
      return { success: false, error: errMsg };
    } finally {
      setIsSaving(false);
    }
  };

  const downloadSavedPresentation = async () => {
    let currentDownloadUrl = downloadUrl;
    let currentFilename = savedMeta?.file_name || `presentation.${exportFormat || "pptx"}`;
    let pId = savedMeta?.presentation_id || presentationId || plan?.presentation_id;

    // 🚀 If there are unsaved edits or no download URL yet, save and re-render first!
    if (!isSaved || !currentDownloadUrl) {
      const saveRes = await savePresentation();
      if (saveRes && saveRes.success) {
        currentDownloadUrl = saveRes.downloadUrl;
        currentFilename = saveRes.fileName || currentFilename;
        pId = saveRes.presentationId || pId;
      } else {
        return;
      }
    }

    if (currentDownloadUrl) {
      try {
        await downloadFileAsBlob(currentDownloadUrl, currentFilename);
        return;
      } catch (err) {
        console.warn("Direct download failed, attempting dynamic ID download fallback", err);
      }
    }

    if (pId) {
      const dynamicUrl = joinUrl(DEFAULT_API_BASE, `/download-presentation/${pId}`);
      await downloadFileAsBlob(dynamicUrl, `presentation_${pId}.${exportFormat || "pptx"}`);
      return;
    }

    if (!currentDownloadUrl && !pId) {
      setError("No presentation file or saved ID available to download.");
    }
  };

  // Seamless 2-Stage AI Presentation Generation (Runs Stage 1 Planner + Stage 2 Generator internally)
  const fetchPlan = async () => {
    if (!prompt.trim()) {
      setError("Please describe or search a presentation topic first.");
      return;
    }

    setError("");
    setSaveError("");
    setIsSaved(false);
    setSavedMeta(null);
    setLoadingPlan(true);
    setDownloadUrl("");

    try {
      // 1. Stage 1 Planner Execution (Internal background analysis)
      const res1 = await fetch(joinUrl(DEFAULT_API_BASE, "/stage1/plan"), {
        method: "POST",
        headers: { "Content-Type": "application/json", ...getAuthHeaders() },
        body: JSON.stringify(buildPayload({ includePlan: false })),
      });

      const data1 = await readResponse(res1);
      if (!res1.ok) throw new Error(data1?.detail || "Failed to analyze presentation topic");

      setPlanPreview(data1);

      // 2. Stage 2 Generator Execution (Internal background rendering)
      const payload2 = {
        ...buildPayload({ includePlan: true }),
        plan: data1.structured_plan || data1.plan,
      };

      const res2 = await fetch(joinUrl(DEFAULT_API_BASE, "/stage2/generate"), {
        method: "POST",
        headers: { "Content-Type": "application/json", ...getAuthHeaders() },
        body: JSON.stringify(payload2),
      });

      const data2 = await readResponse(res2);
      if (!res2.ok) throw new Error(data2?.detail || "Failed to generate presentation deck");

      if (data2.plan) {
        setPlan(data2.plan);
      } else if (data1.plan) {
        setPlan(data1.plan);
      }

      // Keep in draft mode so user can review and edit before saving / downloading
      setSavedMeta({
        presentation_id: data2.job_id || "gen_stage2",
        file_name: data2.file_name || "presentation.pptx",
        download_url: "",
        message: "Presentation generated as draft. Review and edit, then click Save to export PPT.",
      });
      setDownloadUrl("");
      setIsSaved(false);

      setGeneratedMeta({
        title: data2.title || data1.topic || "Presentation Deck",
        slides: data2.slides_count || data1.decided_slide_count || (data2.plan?.slides?.length || 8),
      });

      setActiveSlideIndex(0);
      setCurrentStep(2); // 🚀 Directly opens the Slide Editor workspace!
    } catch (err) {
      setError(err?.message || "Something went wrong generating presentation");
    } finally {
      setLoadingPlan(false);
    }
  };

  // SLIDE MANAGEMENT HANDLERS ✏️ (All modifications mark deck as unsaved draft)
  const handleDeckTitleChange = (newTitle) => {
    setIsSaved(false);
    setDownloadUrl("");
    setPlan((prev) => (prev ? { ...prev, title: newTitle } : prev));
  };

  const handleSlideTitleChange = (index, newTitle) => {
    setIsSaved(false);
    setDownloadUrl("");
    setPlan((prev) => {
      if (!prev) return prev;
      const slides = [...prev.slides];
      slides[index] = { ...slides[index], title: newTitle };
      return { ...prev, slides };
    });
  };

  const handleSlideSubtitleChange = (index, newSubtitle) => {
    setIsSaved(false);
    setDownloadUrl("");
    setPlan((prev) => {
      if (!prev) return prev;
      const slides = [...prev.slides];
      slides[index] = { ...slides[index], subtitle: newSubtitle };
      return { ...prev, slides };
    });
  };

  const handleSlidePropertyChange = (index, key, value) => {
    setIsSaved(false);
    setDownloadUrl("");
    setPlan((prev) => {
      if (!prev) return prev;
      const slides = [...prev.slides];
      slides[index] = { ...slides[index], [key]: value };
      return { ...prev, slides };
    });
  };

  const handleAddSlide = () => {
    setIsSaved(false);
    setDownloadUrl("");
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
    setIsSaved(false);
    setDownloadUrl("");
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
    setIsSaved(false);
    setDownloadUrl("");
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
    setIsSaved(false);
    setDownloadUrl("");
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

  // FEATURE PLUGIN HANDLERS 
  const handlePluginTextChange = (slideIndex, pluginIndex, key, value, bulletIndex = null) => {
    setIsSaved(false);
    setDownloadUrl("");
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
    setIsSaved(false);
    setDownloadUrl("");
    setPlan((prev) => {
      if (!prev) return prev;
      const slides = [...prev.slides];
      const slide = { ...slides[slideIndex] };
      const plugins = [...slide.plugins];
      const plugin = { ...plugins[pluginIndex] };
      const data = { ...plugin.data };

      if (field === "labels" || field === "categories" || field === "headers") {
        const parsed = typeof rawInput === "string" ? rawInput.split(",").map((s) => s.trim()) : safeArray(rawInput);
        data[field] = parsed;
        if (field === "labels" || field === "categories") {
          data.labels = parsed;
          data.categories = parsed;
        }
      } else if (field === "values") {
        data.values = typeof rawInput === "string" ? rawInput.split(",").map((s) => Number(s.trim()) || 0) : safeArray(rawInput);
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
    setIsSaved(false);
    setDownloadUrl("");
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
    setIsSaved(false);
    setDownloadUrl("");
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

  const handleAddPlugin = (slideIndex, pluginType, initialData = {}) => {
    setIsSaved(false);
    setDownloadUrl("");
    setPlan((prev) => {
      if (!prev) return prev;
      const slides = [...prev.slides];
      const slide = { ...slides[slideIndex] };
      const plugins = [...slide.plugins];

      let newPlugin = { type: pluginType, data: { ...initialData } };
      if (pluginType === "shape") {
        newPlugin.data = {
          shape_type: initialData.shape_type || initialData.shape || "rectangle",
          fill_color: initialData.fill_color || initialData.fill || "#38bdf8",
          stroke_color: initialData.stroke_color || initialData.stroke || "#0284c7",
          stroke_width: initialData.stroke_width !== undefined ? initialData.stroke_width : 2,
          opacity: initialData.opacity !== undefined ? initialData.opacity : 1.0,
          text: initialData.text || "",
          text_color: initialData.text_color || "#ffffff",
          font_size: initialData.font_size || 14,
          x: initialData.x !== undefined ? initialData.x : 0.8,
          y: initialData.y !== undefined ? initialData.y : 1.8,
          width: initialData.width || 3.0,
          height: initialData.height || 1.8,
          rotation: initialData.rotation || 0,
          ...initialData
        };
      } else if (pluginType === "text") {
        newPlugin.data = { text: "Section Header", ...initialData };
      } else if (pluginType === "chart") {
        newPlugin.data = {
          chart_type: "bar",
          title: "Quarterly Performance",
          labels: ["Q1", "Q2", "Q3", "Q4"],
          values: [40, 65, 85, 95],
          ...initialData
        };
      } else if (pluginType === "image") {
        newPlugin.data = {
          url: "https://images.unsplash.com/photo-1518770660439-4636190af475?w=600",
          caption: "Technology Visual Element",
          align: "center",
          ...initialData
        };
      } else if (pluginType === "bullets") {
        newPlugin.data = { points: ["Key bullet item 1", "Key bullet item 2"], ...initialData };
      } else if (pluginType === "paragraph") {
        newPlugin.data = { text: "Enter descriptive paragraph narrative here...", ...initialData };
      } else if (pluginType === "paragraph_2col") {
        newPlugin.data = {
          items: [
            { title: "Left Column Concept", text: "First detailed paragraph narrative for the left column..." },
            { title: "Right Column Concept", text: "Second detailed paragraph narrative for the right column..." }
          ],
          left_title: "Left Column Concept",
          left_text: "First detailed paragraph narrative for the left column...",
          right_title: "Right Column Concept",
          right_text: "Second detailed paragraph narrative for the right column...",
          ...initialData
        };
      } else if (pluginType === "stat") {
        newPlugin.data = { number: "95%", label: "Key Metric / Growth Rate", ...initialData };
      } else if (pluginType === "notes") {
        newPlugin.data = { notes: "Speaker notes for presentation...", ...initialData };
      } else if (pluginType === "diagram") {
        newPlugin.data = { diagram: "[Input Data] ➔ [Processing Engine] ➔ [Model Inference] ➔ [Output Analytics]", ...initialData };
      } else if (pluginType === "table") {
        newPlugin.data = {
          title: "Feature Comparison Matrix",
          headers: ["Criterion", "Option A", "Option B"],
          rows: [
            ["Performance", "High (99.9% Uptime)", "Standard"],
            ["Cost Tier", "Enterprise", "Pay-as-you-go"],
            ["Security", "Advanced Encryption", "Standard OAuth"]
          ],
          ...initialData
        };
      } else if (pluginType === "callout") {
        newPlugin.data = {
          text: "AI automation accelerated operational throughput by 45% across enterprise services.",
          title: "KEY TAKEAWAY",
          icon: "💡",
          ...initialData
        };
      } else if (pluginType === "kpi_grid") {
        newPlugin.data = {
          kpis: [
            { number: "$12.5M", label: "ARR Revenue", trend: "+34% ↗" },
            { number: "99.99%", label: "SLA Uptime", trend: "+0.5% ↗" },
            { number: "450K", label: "Active Users", trend: "+18% ↗" },
            { number: "< 12ms", label: "API Latency", trend: "-25% ↘" }
          ],
          ...initialData
        };
      } else if (pluginType === "pros_cons") {
        newPlugin.data = {
          pros_title: "✅ STRENGTHS & ADVANTAGES",
          pros: ["High Horizontal Scalability", "Low Query Latency", "Zero Downtime Deployments"],
          cons_title: "❌ CHALLENGES & CONSIDERATIONS",
          cons: ["Initial Setup Overhead", "Cloud Migration Refactoring Effort"],
          ...initialData
        };
      } else if (pluginType === "roadmap") {
        newPlugin.data = {
          phases: [
            { phase: "Q1 2026", title: "Architecture & Specs", status: "COMPLETED" },
            { phase: "Q2 2026", title: "Platform Core Build", status: "IN PROGRESS" },
            { phase: "Q3 2026", title: "Market Beta Testing", status: "PLANNED" },
            { phase: "Q4 2026", title: "Global Enterprise Scale", status: "PLANNED" }
          ],
          ...initialData
        };
      } else if (pluginType === "code_block") {
        newPlugin.data = {
          code: "async def get_presentation_telemetry(job_id: str):\n    result = await service.fetch(job_id)\n    return {\"status\": \"ok\", \"telemetry\": result}",
          title: "api_router.py",
          language: "python",
          ...initialData
        };
      } else if (pluginType === "speaker_card") {
        newPlugin.data = {
          name: "Dr. Alex Vance",
          role: "Chief AI Architect & Principal Engineer",
          bio: ["Lead Architect at Antigravity AI Systems", "15+ Years Distributed Systems Experience"],
          ...initialData
        };
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

        .ppt-shell { min-height: 100vh; padding: 10px 14px; width: 100%; max-width: 100%; margin: 0; }

        @media (max-width: 768px) {
          .ppt-shell { padding: 4px !important; }
          .card-box { padding: 8px 6px !important; border-radius: 10px !important; }
          .ppt-header-bar { padding: 8px 10px !important; border-radius: 10px !important; }
          .feature-block-card { padding: 8px 6px !important; margin-bottom: 8px !important; }
          .slide-canvas-box { aspect-ratio: 16 / 10 !important; width: 100% !important; min-height: 250px !important; padding: 12px 10px !important; border-radius: 12px !important; box-sizing: border-box !important; }
          .slide-canvas-box h2 { font-size: clamp(14px, 3.8vw, 18px) !important; margin: 3px 0 2px !important; line-height: 1.25 !important; }
          .slide-canvas-box th, .slide-canvas-box td { padding: 4px 6px !important; font-size: 10px !important; line-height: 1.2 !important; }
          .slide-canvas-box p { font-size: 11px !important; line-height: 1.35 !important; }
          .slide-canvas-box h3 { font-size: 13px !important; margin: 2px 0 !important; }
          .add-feature-bar { padding: 8px 6px !important; gap: 4px !important; }
        }

        .ppt-header-bar {
          display: flex;
          justify-content: space-between;
          align-items: center;
          flex-wrap: wrap;
          gap: 10px;
          background: rgba(15, 23, 42, 0.9);
          border: 1px solid var(--panel-border);
          border-radius: 12px;
          padding: 8px 16px;
          margin-bottom: 10px;
          backdrop-filter: blur(16px);
        }

        .ppt-header-title {
          flex-shrink: 0;
        }

        .ppt-header-title h1 {
          margin: 0;
          font-size: 20px;
          font-weight: 800;
          background: linear-gradient(135deg, #c084fc, #60a5fa);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          white-space: nowrap;
        }
        .ppt-header-title p {
          margin: 2px 0 0;
          font-size: 12px;
          color: var(--text-muted);
          white-space: nowrap;
        }

        .ppt-header-controls {
          display: flex;
          gap: 8px;
          align-items: center;
          flex-wrap: wrap;
        }

        .card-box {
          background: var(--panel);
          border: 1px solid var(--panel-border);
          border-radius: 12px;
          padding: 12px 16px;
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
          justify-content: flex-start;
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
          <div className="ppt-header-title" style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <h1 style={{ margin: 0 }}>Presentation Studio</h1>
            <button
              className="btn-ui secondary sm"
              onClick={handleResetPlanToDefault}
              title="Start a fresh presentation deck"
              style={{ fontSize: 12, padding: "4px 10px", fontWeight: 700 }}
            >
              + New
            </button>
          </div>

          <div className="ppt-header-controls" style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <button
              className="btn-ui sm secondary"
              onClick={handleTriggerCacheCleanup}
              disabled={isCleaningCache}
              title="Purge expired presentation output files and cache from server storage"
              style={{ fontSize: 11, display: "inline-flex", alignItems: "center", gap: 4, padding: "5px 9px" }}
            >
              {isCleaningCache ? "⏳ Cleaning..." : "🧹 Clean Cache"}
            </button>

            {/* PAGE STEP NAVIGATION PILLS */}
            <div style={{ display: "flex", gap: 4, background: "rgba(0,0,0,0.3)", padding: 4, borderRadius: 10, border: "1px solid var(--panel-border)" }}>
              <button
                className={`btn-ui sm ${currentStep === 1 ? "primary" : "secondary"}`}
                onClick={() => setCurrentStep(1)}
              >
                Setup
              </button>
              <button
                className={`btn-ui sm ${currentStep === 2 ? "primary" : "secondary"}`}
                onClick={() => setCurrentStep(2)}
                disabled={!plan}
                title={!plan ? "Generate presentation first" : "Open Slide Editor & Viewer"}
              >
                Slide Editor {plan?.slides?.length ? `(${plan.slides.length})` : ""}
              </button>
              {planPreview && (
                <button
                  className={`btn-ui sm ${currentStep === 3 ? "primary" : "secondary"}`}
                  onClick={() => setCurrentStep(3)}
                  title="View AI Stage 1 Plan & Sequence Structure"
                >
                  Plan
                </button>
              )}
            </div>
          </div>
        </div>

        {cleanupMessage && (
          <div style={{
            margin: "0 0 12px 0",
            padding: "8px 14px",
            background: "rgba(56, 189, 248, 0.12)",
            border: "1px solid rgba(56, 189, 248, 0.3)",
            borderRadius: 8,
            fontSize: 12,
            color: "#38bdf8",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}>
            <span>✨ {cleanupMessage}</span>
            <button
              onClick={() => setCleanupMessage("")}
              style={{ background: "none", border: "none", color: "#38bdf8", cursor: "pointer", fontSize: 14 }}
            >
              ✕
            </button>
          </div>
        )}

        {/* CONDITIONAL STEP PAGE RENDERING */}
        {currentStep === 1 && (
          /* STEP 1: TOPIC SEARCH & SETUP PAGE */
          <PresentationSetup
            prompt={prompt}
            setPrompt={setPrompt}
            slideCount={slideCount}
            setSlideCount={setSlideCount}
            depth={depth}
            setDepth={setDepth}
            style={style}
            setStyle={setStyle}
            userRequirements={userRequirements}
            setUserRequirements={setUserRequirements}
            audience={audience}
            setAudience={setAudience}
            tone={tone}
            setTone={setTone}
            language={language}
            setLanguage={setLanguage}
            contentTheme={contentTheme}
            setContentTheme={setContentTheme}
            visualStyle={visualStyle}
            setVisualStyle={setVisualStyle}
            includeSpeakerNotes={includeSpeakerNotes}
            setIncludeSpeakerNotes={setIncludeSpeakerNotes}
            includeAgendaSlide={includeAgendaSlide}
            setIncludeAgendaSlide={setIncludeAgendaSlide}
            useWebSearch={useWebSearch}
            setUseWebSearch={setUseWebSearch}
            useAiImageGen={useAiImageGen}
            setUseAiImageGen={setUseAiImageGen}
            smartMode={smartMode}
            allowChart={allowChart}
            setAllowChart={setAllowChart}
            loadingPlan={loadingPlan}
            loadingGenerate={isSaving}
            error={error || saveError}
            fetchPlan={fetchPlan}
            useCustomBrand={useCustomBrand}
            setUseCustomBrand={setUseCustomBrand}
            brandLogo={brandLogo}
            setBrandLogo={setBrandLogo}
            brandColor={brandColor}
            setBrandColor={setBrandColor}
            brandSecondaryColor={brandSecondaryColor}
            setBrandSecondaryColor={setBrandSecondaryColor}
            brandFont={brandFont}
            setBrandFont={setBrandFont}
            brandFooter={brandFooter}
            setBrandFooter={setBrandFooter}
            templateName={templateName}
            setTemplateName={handleTemplateChange}
          />
        )}

        {currentStep === 2 && (
          /* STEP 2: SLIDE WORKSPACE & FEATURE EDITOR PAGE */
          <PresentationEditor
            plan={plan}
            setPlan={setPlan}
            activeSlideIndex={activeSlideIndex}
            setActiveSlideIndex={setActiveSlideIndex}
            selectedBgPreset={selectedBgPreset}
            setSelectedBgPreset={handleBgPresetChange}
            templateName={templateName}
            setTemplateName={handleTemplateChange}
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
            isSaving={isSaving}
            isSaved={isSaved}
            saveError={saveError}
            savedMeta={savedMeta}
            savePresentation={savePresentation}
            downloadSavedPresentation={downloadSavedPresentation}
            setIsSaved={setIsSaved}
            setDownloadUrl={setDownloadUrl}
            handleDeckTitleChange={handleDeckTitleChange}
            handleSlideTitleChange={handleSlideTitleChange}
            handleSlideSubtitleChange={handleSlideSubtitleChange}
            handleSlidePropertyChange={handleSlidePropertyChange}
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
            onBackToSetup={() => setCurrentStep(1)}
          />
        )}
      </div>
    </>
  );
}