import React, { useEffect, useMemo, useState } from "react";
import { API_BASE_URL, getAuthHeaders } from "../services/api";

const DEFAULT_API_BASE = `${API_BASE_URL}/api/presentation`;
const PPT_TEMPLATES = [
  { id: "minimal", name: "Minimal", description: "Clean, distraction-free slides", theme: "light", style: "minimal" },
  { id: "corporate", name: "Corporate", description: "Polished for meetings and reports", theme: "blue", style: "corporate" },
  { id: "education", name: "Education", description: "Clear visuals for learning", theme: "education", style: "academic" },
  { id: "startup", name: "Startup pitch", description: "Bold for ideas and demos", theme: "startup", style: "modern_gradient" },
  { id: "finance", name: "Finance", description: "Data-led business storytelling", theme: "finance", style: "corporate" },
  { id: "dark", name: "Dark gradient", description: "Modern, high-contrast visuals", theme: "dark", style: "modern_gradient" },
];
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

function Toggle({ label, checked, onChange }) {
  return (
    <label className="toggle-row">
      <span>{label}</span>
      <input
        type="checkbox"
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
      />
    </label>
  );
}

function normalizeTypeList(plugins) {
  return safeArray(plugins)
    .map((p) => p?.type)
    .filter(Boolean)
    .sort()
    .join("|");
}

function resolveMixedLayout(plugins) {
  const signature = normalizeTypeList(plugins);

  if (signature === "bullets|paragraph") return "vertical";
  if (signature === "image|paragraph") return "split";
  if (signature === "bullets|image") return "split";
  if (signature === "chart|paragraph") return "split";
  if (signature === "bullets|chart") return "split";
  if (signature === "paragraph|table") return "split";
  return "grid";
}

function boxToStyle(box) {
  if (!box) return {};
  return {
    position: "absolute",
    left: `${Number(box.left || 0) * 100}%`,
    top: `${Number(box.top || 0) * 100}%`,
    width: `${Number(box.width || 0) * 100}%`,
    height: `${Number(box.height || 0) * 100}%`,
  };
}

function getPluginLabel(type) {
  if (type === "text") return "Title block";
  if (type === "paragraph") return "Paragraph";
  if (type === "bullets") return "Bullets";
  if (type === "chart") return "Chart";
  if (type === "image") return "Image";
  if (type === "table") return "Table";
  if (type === "notes") return "Notes";
  return type || "Content";
}

function PluginContent({ plugin }) {
  const type = plugin?.type;
  const data = plugin?.data || {};

  if (type === "text") {
    return (
      <>
        <strong>{getPluginLabel(type)}</strong>
        <div>{data?.title || ""}</div>
        {data?.subtitle ? <div className="muted">{data.subtitle}</div> : null}
      </>
    );
  }

  if (type === "paragraph") {
    return (
      <>
        <strong>{getPluginLabel(type)}</strong>
        <div className="muted clamp-text">{data?.text || ""}</div>
      </>
    );
  }

  if (type === "bullets") {
    const points = safeArray(data?.points);
    return (
      <>
        <strong>{getPluginLabel(type)}</strong>
        <ul>
          {points.slice(0, 6).map((point, idx) => (
            <li key={idx}>{String(point)}</li>
          ))}
        </ul>
      </>
    );
  }

  if (type === "chart") {
    return (
      <>
        <strong>{getPluginLabel(type)}</strong>
        <div className="muted">Type: {data?.chart_type || "column"}</div>
        <div className="muted">Series: {data?.series_name || "Usage"}</div>
      </>
    );
  }

  if (type === "image") {
    return (
      <>
        <strong>{getPluginLabel(type)}</strong>
        <div className="muted break-word">{data?.path || ""}</div>
        {data?.caption ? <div className="muted">{data.caption}</div> : null}
      </>
    );
  }

  if (type === "table") {
    return (
      <>
        <strong>{getPluginLabel(type)}</strong>
        <div className="muted">{safeArray(data?.headers).length} columns</div>
        <div className="muted">{safeArray(data?.rows).length} rows</div>
      </>
    );
  }

  if (type === "notes") {
    return (
      <>
        <strong>{getPluginLabel(type)}</strong>
        <div className="muted clamp-text">{data?.notes || ""}</div>
      </>
    );
  }

  return (
    <>
      <strong>{getPluginLabel(type)}</strong>
      <div className="muted">Unsupported plugin</div>
    </>
  );
}

function SlidePreview({ slide, index }) {
  const title = slide?.title || `Slide ${index + 1}`;
  const layout = slide?.layout || "title_content";
  const plugins = safeArray(slide?.plugins);
  const isMixed = layout === "mixed_content_slide" || plugins.length >= 2;
  const mixedMode = resolveMixedLayout(plugins);

  return (
    <div className="slide-card">
      <div className="slide-card-header">
        <div>
          <div className="slide-index">Slide {index + 1}</div>
          <h3>{title}</h3>
        </div>
        <div className="badge-group">
          <span className="badge">{layout}</span>
          {isMixed ? <span className="badge accent">mixed: {mixedMode}</span> : null}
        </div>
      </div>

      <div className="slide-preview-stage">
        <div className="slide-canvas">
          {plugins.map((plugin, i) => {
            const box = plugin?.data?.box;
            const hasBox = box && typeof box === "object";
            const pluginType = plugin?.type || `plugin-${i}`;

            return (
              <div
                key={`${pluginType}-${i}`}
                className={`canvas-block canvas-${pluginType}`}
                style={hasBox ? boxToStyle(box) : undefined}
              >
                <PluginContent plugin={plugin} />
              </div>
            );
          })}
        </div>
      </div>

      <div className="slide-card-body">
        {!plugins.length ? (
          <div className="empty-inline">No plugins in this slide.</div>
        ) : (
          plugins.map((plugin, i) => (
            <div key={i} className={`plugin-box plugin-${plugin.type || "unknown"}`}>
              <PluginContent plugin={plugin} />
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default function PresentationGenerator() {
  const [prompt, setPrompt] = useState(
    "Create a professional presentation on Data Science for students. Include overview, workflow, tools, applications, challenges, and conclusion."
  );
  const [templateName, setTemplateName] = useState("");
  const [selectedTemplate, setSelectedTemplate] = useState("corporate");
  const [slideCount, setSlideCount] = useState(8);
  const [audience, setAudience] = useState("Students");
  const [tone, setTone] = useState("Clear and professional");
  const [language, setLanguage] = useState("English");
  const [includeCitations, setIncludeCitations] = useState(false);
  const [includeSpeakerNotes, setIncludeSpeakerNotes] = useState(false);
  const [useGemini, setUseGemini] = useState(true);
  const contentTheme = "auto";
  const visualStyle = "auto";

  const [includeTitleSlide, setIncludeTitleSlide] = useState(true);
  const [allowBullets, setAllowBullets] = useState(true);
  const [allowParagraph, setAllowParagraph] = useState(true);
  const [allowChart, setAllowChart] = useState(true);
  const [allowImage, setAllowImage] = useState(true);
  const [allowSectionSlide, setAllowSectionSlide] = useState(true);
  const [allowTable, setAllowTable] = useState(true);
  const [smartMode, setSmartMode] = useState(true);

  const [slideTypes, setSlideTypes] = useState("");
  const [loadingPlan, setLoadingPlan] = useState(false);
  const [loadingGenerate, setLoadingGenerate] = useState(false);
  const [error, setError] = useState("");
  const [plan, setPlan] = useState(null);
  const [downloadUrl, setDownloadUrl] = useState("");
  const [fileName, setFileName] = useState("");
  const [generatedMeta, setGeneratedMeta] = useState(null);
  const [serviceStatus, setServiceStatus] = useState("checking");

  const previewCount = useMemo(() => safeArray(plan?.slides).length, [plan]);

  useEffect(() => {
    const controller = new AbortController();

    const checkService = async () => {
      try {
        const response = await fetch(joinUrl(DEFAULT_API_BASE, "/health"), {
          signal: controller.signal,
        });
        setServiceStatus(response.ok ? "ready" : "unavailable");
      } catch (err) {
        if (err.name !== "AbortError") setServiceStatus("unavailable");
      }
    };

    checkService();
    return () => controller.abort();
  }, []);

  const selectedTemplateConfig = useMemo(
    () => PPT_TEMPLATES.find((template) => template.id === selectedTemplate) || PPT_TEMPLATES[0],
    [selectedTemplate]
  );

  const buildPrompt = () => {
    const requirements = [
      `Create approximately ${slideCount} slides.`,
      `Target audience: ${audience}.`,
      `Tone: ${tone}.`,
      `Language: ${language}.`,
      includeCitations && "Include source citations where facts, statistics, or claims are used.",
      includeSpeakerNotes && "Include concise speaker notes for every slide.",
    ].filter(Boolean);

    return `${prompt.trim()}\n\nPresentation requirements:\n${requirements
      .map((item) => `- ${item}`)
      .join("\n")}`;
  };

  const buildPayload = ({ includePlan = false } = {}) => ({
    prompt: buildPrompt(),
    template_name: templateName || null,
    slide_count: slideCount,
    audience: audience.trim() || null,
    tone: tone.trim() || null,
    language: language.trim() || "English",
    include_citations: includeCitations,
    include_speaker_notes: includeSpeakerNotes,
    use_gemini: useGemini,
    include_title_slide: includeTitleSlide,
    allow_bullets: allowBullets,
    allow_paragraph: allowParagraph,
    allow_chart: allowChart,
    allow_image: allowImage,
    allow_section_slide: allowSectionSlide,
    allow_table: allowTable,
    background_theme: contentTheme === "auto" ? selectedTemplateConfig.theme : contentTheme,
    content_theme: contentTheme === "auto" ? selectedTemplateConfig.theme : contentTheme,
    visual_style: visualStyle === "auto" ? selectedTemplateConfig.style : visualStyle,
    smart_mode: smartMode,
    slide_types: slideTypes
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean),
    // When a preview has been approved, send its exact slide specification so
    // the backend can render that plan instead of creating a second one.
    plan: includePlan && plan ? { title: plan.title, slides: plan.slides } : undefined,
  });

  const fetchPlan = async () => {
    if (!prompt.trim()) {
      setError("Please describe the presentation you want to create.");
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
        body: JSON.stringify(buildPayload()),
      });

      const data = await readResponse(res);
      if (!res.ok) throw new Error(data?.detail || "Failed to preview plan");
      setPlan(data);
    } catch (err) {
      setError(err?.message || "Something went wrong");
    } finally {
      setLoadingPlan(false);
    }
  };

  const generatePpt = async () => {
    if (!prompt.trim()) {
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
        body: JSON.stringify(buildPayload({ includePlan: true })),
      });

      const data = await readResponse(res);
      if (!res.ok) throw new Error(data?.detail || "Failed to generate presentation");

      setFileName(data.file_name || "presentation.pptx");
      setDownloadUrl(resolveDownloadUrl(data.download_url));
      setGeneratedMeta({
        title: data.title || plan?.title || "Your presentation is ready",
        slides: data.slides || data.slide_count || previewCount || slideCount,
        theme: contentTheme === "auto" ? selectedTemplateConfig.name : contentTheme,
        jobId: data.job_id || "",
      });

      if (!plan) {
        await fetchPlan();
      }
    } catch (err) {
      setError(err?.message || "Something went wrong");
    } finally {
      setLoadingGenerate(false);
    }
  };

  return (
    <>
      <style>{`
  :root {
    --bg-0: #090d18;
    --bg-1: #0b1020;
    --bg-2: #11182a;
    --panel: rgba(15, 20, 36, 0.78);
    --panel-2: rgba(18, 24, 40, 0.72);
    --line: rgba(255, 255, 255, 0.10);
    --line-soft: rgba(255, 255, 255, 0.08);
    --text: #ffffff;
    --muted: rgba(255, 255, 255, 0.68);
    --muted-2: rgba(255, 255, 255, 0.52);
    --accent: #8b5cf6;
    --accent-2: #6366f1;
    --accent-soft: rgba(139, 92, 246, 0.16);
    --chip: rgba(255, 255, 255, 0.06);
    --shadow: 0 18px 40px rgba(0, 0, 0, 0.38);
    --shadow-soft: 0 10px 26px rgba(0, 0, 0, 0.20);
    --radius-xl: 28px;
    --radius-lg: 22px;
    --radius-md: 16px;
  }

  * {
    box-sizing: border-box;
  }

  html,
  body,
  #root {
    height: 100%;
  }

  body {
    margin: 0;
    font-family: Inter, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
    color: var(--text);
    background:
      radial-gradient(circle at top, #1b2440 0%, #0b1020 48%, var(--bg-0) 100%);
  }

  button,
  input,
  textarea,
  select {
    font: inherit;
  }

  .app-shell {
    min-height: 100vh;
    padding: 18px;
    color: var(--text);
  }

  .container {
    max-width: 1460px;
    margin: 0 auto;
    display: grid;
    gap: 18px;
    grid-template-columns: 1.03fr 0.97fr;
    align-items: start;
  }

  .left-panel,
  .right-panel {
    min-width: 0;
  }

  .card {
    background: var(--panel);
    border: 1px solid var(--line);
    border-radius: var(--radius-xl);
    box-shadow: var(--shadow);
    backdrop-filter: blur(18px);
    -webkit-backdrop-filter: blur(18px);
  }

  .panel {
    padding: 24px;
  }

  .section-title {
    font-size: 13px;
    font-weight: 800;
    color: rgba(255, 255, 255, 0.52);
    text-transform: uppercase;
    letter-spacing: 0.10em;
    margin-bottom: 8px;
  }

  h1 {
    margin: 0 0 20px;
    font-size: 32px;
    line-height: 1.12;
    letter-spacing: -0.02em;
  }

  h2 {
    margin: 0 0 8px;
    font-size: 24px;
    line-height: 1.15;
    letter-spacing: -0.02em;
  }

  .field {
    margin-bottom: 16px;
  }

  .field label {
    display: block;
    margin-bottom: 8px;
    font-size: 14px;
    font-weight: 700;
    color: rgba(255, 255, 255, 0.90);
  }

  .field input,
  .field textarea,
  .field select {
    width: 100%;
    border: 1px solid var(--line);
    border-radius: 14px;
    padding: 12px 14px;
    font-size: 14px;
    color: var(--text);
    background: rgba(255, 255, 255, 0.04);
    outline: none;
    transition: border-color 0.2s ease, box-shadow 0.2s ease, background 0.2s ease;
  }

  .field input::placeholder,
  .field textarea::placeholder {
    color: rgba(255, 255, 255, 0.38);
  }

  .field textarea {
    resize: vertical;
    min-height: 120px;
  }

  .field input:focus,
  .field textarea:focus,
  .field select:focus {
    border-color: rgba(139, 92, 246, 0.75);
    box-shadow: 0 0 0 4px rgba(139, 92, 246, 0.14);
    background: rgba(255, 255, 255, 0.06);
  }

  .grid-2 {
    display: grid;
    gap: 12px;
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }

  .template-grid {
    display: grid;
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: 10px;
    margin: 0 0 16px;
  }

  .template-card {
    padding: 12px;
    border: 1px solid var(--line);
    border-radius: 14px;
    background: rgba(255, 255, 255, 0.04);
    color: var(--text);
    text-align: left;
    cursor: pointer;
  }

  .template-card.active {
    border-color: rgba(139, 92, 246, 0.8);
    background: rgba(139, 92, 246, 0.16);
    box-shadow: 0 0 0 3px rgba(139, 92, 246, 0.12);
  }

  .template-name { display: block; font-size: 14px; font-weight: 800; }
  .template-description { display: block; margin-top: 4px; color: var(--muted); font-size: 12px; line-height: 1.4; }

  .success-box {
    margin-top: 14px;
    padding: 14px;
    border: 1px solid rgba(74, 222, 128, 0.28);
    border-radius: 16px;
    background: rgba(34, 197, 94, 0.10);
    color: #dcfce7;
  }

  .success-box strong { display: block; margin-bottom: 5px; }

  .service-status {
    display: inline-flex;
    align-items: center;
    gap: 7px;
    margin: 0 0 16px;
    padding: 7px 10px;
    border-radius: 999px;
    background: rgba(255, 255, 255, 0.06);
    color: var(--muted);
    font-size: 12px;
    font-weight: 700;
  }

  .service-status::before { content: ""; width: 7px; height: 7px; border-radius: 50%; background: #fbbf24; }
  .service-status.ready::before { background: #4ade80; }
  .service-status.unavailable::before { background: #f87171; }

  .toggle-grid {
    display: grid;
    gap: 10px;
    grid-template-columns: repeat(2, minmax(0, 1fr));
    margin: 18px 0;
  }

  .toggle-row {
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: 12px;
    border: 1px solid var(--line);
    border-radius: 16px;
    padding: 12px 14px;
    background: rgba(255, 255, 255, 0.04);
    font-size: 14px;
    font-weight: 600;
    color: rgba(255, 255, 255, 0.92);
    box-shadow: var(--shadow-soft);
  }

  .toggle-row input {
    width: 18px;
    height: 18px;
    accent-color: #8b5cf6;
    flex-shrink: 0;
  }

  .button-row {
    display: flex;
    flex-wrap: wrap;
    gap: 12px;
    margin-top: 18px;
  }

  .btn {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    border-radius: 14px;
    padding: 12px 18px;
    text-decoration: none;
    font-size: 14px;
    font-weight: 800;
    border: none;
    cursor: pointer;
    transition: transform 0.16s ease, opacity 0.16s ease, box-shadow 0.16s ease, background 0.16s ease;
    user-select: none;
    white-space: nowrap;
  }

  .btn:hover {
    transform: translateY(-1px);
  }

  .btn.primary {
    background: linear-gradient(135deg, var(--accent) 0%, var(--accent-2) 100%);
    color: #ffffff;
    box-shadow: 0 12px 28px rgba(99, 102, 241, 0.26);
  }

  .btn.primary:hover {
    box-shadow: 0 16px 34px rgba(99, 102, 241, 0.34);
  }

  .btn.secondary {
    background: rgba(255, 255, 255, 0.05);
    color: #ffffff;
    border: 1px solid rgba(255, 255, 255, 0.11);
    box-shadow: var(--shadow-soft);
  }

  .btn.secondary:hover {
    background: rgba(255, 255, 255, 0.08);
  }

  .btn:disabled {
    opacity: 0.62;
    cursor: not-allowed;
    transform: none;
    box-shadow: none;
  }

  .error-box {
    border: 1px solid rgba(248, 113, 113, 0.30);
    background: rgba(127, 29, 29, 0.30);
    color: #fecaca;
    border-radius: 16px;
    padding: 12px 14px;
    font-size: 14px;
    margin-top: 12px;
    backdrop-filter: blur(14px);
  }

  .scroll-area {
    max-height: 78vh;
    overflow: auto;
    padding-right: 6px;
    margin-top: 16px;
  }

  .scroll-area::-webkit-scrollbar {
    width: 8px;
  }

  .scroll-area::-webkit-scrollbar-track {
    background: transparent;
  }

  .scroll-area::-webkit-scrollbar-thumb {
    background: rgba(255, 255, 255, 0.14);
    border-radius: 999px;
  }

  .slide-card {
    border: 1px solid var(--line);
    border-radius: 22px;
    padding: 16px;
    background: rgba(255, 255, 255, 0.04);
    margin-bottom: 12px;
    box-shadow: var(--shadow-soft);
  }

  .slide-card-header {
    display: flex;
    justify-content: space-between;
    gap: 12px;
    align-items: flex-start;
  }

  .slide-card-header h3 {
    margin: 4px 0 0;
    font-size: 18px;
    line-height: 1.25;
  }

  .slide-index {
    font-size: 12px;
    letter-spacing: 0.08em;
    text-transform: uppercase;
    color: rgba(255, 255, 255, 0.52);
  }

  .badge-group {
    display: flex;
    flex-wrap: wrap;
    gap: 8px;
    justify-content: flex-end;
  }

  .badge {
    display: inline-flex;
    align-items: center;
    padding: 6px 10px;
    border-radius: 999px;
    font-size: 12px;
    background: rgba(255, 255, 255, 0.06);
    color: rgba(255, 255, 255, 0.82);
    border: 1px solid rgba(255, 255, 255, 0.08);
    white-space: nowrap;
  }

  .badge.accent {
    background: rgba(139, 92, 246, 0.18);
    color: #d8b4fe;
    border-color: rgba(139, 92, 246, 0.24);
  }

  .slide-preview-stage {
    margin-top: 14px;
  }

  .slide-canvas {
    position: relative;
    aspect-ratio: 16 / 9;
    width: 100%;
    border-radius: 18px;
    border: 1px solid rgba(255, 255, 255, 0.10);
    background:
      radial-gradient(circle at top left, rgba(139, 92, 246, 0.14), transparent 40%),
      linear-gradient(180deg, #111827, #0b1020);
    overflow: hidden;
  }

  .canvas-block {
    position: absolute;
    border-radius: 14px;
    padding: 10px 12px;
    overflow: hidden;
    border: 1px solid rgba(255, 255, 255, 0.12);
    background: rgba(15, 20, 36, 0.86);
    box-shadow: 0 10px 22px rgba(0, 0, 0, 0.22);
    font-size: 12px;
    color: #ffffff;
    backdrop-filter: blur(10px);
  }

  .canvas-text,
  .canvas-paragraph {
    background: rgba(30, 41, 59, 0.88);
  }

  .canvas-bullets {
    background: rgba(20, 83, 45, 0.80);
  }

  .canvas-image {
    background: rgba(120, 53, 15, 0.82);
  }

  .canvas-chart {
    background: rgba(88, 28, 135, 0.82);
  }

  .canvas-table {
    background: rgba(8, 47, 73, 0.82);
  }

  .canvas-block strong {
    display: block;
    margin-bottom: 6px;
    font-size: 12px;
    color: #ffffff;
  }

  .canvas-block ul {
    margin: 0;
    padding-left: 16px;
  }

  .canvas-block li {
    margin-bottom: 3px;
  }

  .slide-card-body {
    margin-top: 14px;
    display: grid;
    gap: 10px;
  }

  .plugin-box {
    background: rgba(255, 255, 255, 0.04);
    border-radius: 16px;
    padding: 12px;
    font-size: 14px;
    border: 1px solid var(--line);
    color: rgba(255, 255, 255, 0.92);
  }

  .plugin-box strong {
    display: block;
    margin-bottom: 6px;
    color: #ffffff;
  }

  .plugin-box ul {
    margin: 0;
    padding-left: 20px;
  }

  .plugin-paragraph {
    background: rgba(79, 70, 229, 0.14);
  }

  .plugin-bullets {
    background: rgba(34, 197, 94, 0.12);
  }

  .plugin-image {
    background: rgba(245, 158, 11, 0.14);
  }

  .plugin-chart {
    background: rgba(236, 72, 153, 0.12);
  }

  .plugin-table {
    background: rgba(34, 211, 238, 0.12);
  }

  .plugin-notes {
    background: rgba(168, 85, 247, 0.12);
  }

  .muted {
    color: rgba(255, 255, 255, 0.66);
    font-size: 14px;
  }

  .clamp-text {
    display: -webkit-box;
    -webkit-line-clamp: 5;
    -webkit-box-orient: vertical;
    overflow: hidden;
  }

  .break-word {
    word-break: break-word;
  }

  .empty-state,
  .empty-inline {
    border: 1px dashed rgba(255, 255, 255, 0.18);
    border-radius: 18px;
    padding: 28px;
    text-align: center;
    color: rgba(255, 255, 255, 0.65);
    background: rgba(255, 255, 255, 0.03);
  }

  .empty-inline {
    padding: 18px;
  }

  .footer-note {
    max-width: 1460px;
    margin: 16px auto 0;
    padding: 16px 18px;
    border: 1px solid var(--line);
    border-radius: 18px;
    background: var(--panel-2);
    color: rgba(255, 255, 255, 0.66);
    font-size: 14px;
    box-shadow: var(--shadow-soft);
    backdrop-filter: blur(16px);
    -webkit-backdrop-filter: blur(16px);
  }

  .footer-note strong {
    color: #ffffff;
  }

  @media (max-width: 1100px) {
    .container {
      grid-template-columns: 1fr;
    }
  }

  @media (max-width: 640px) {
    .app-shell {
      padding: 12px;
    }

    .panel {
      padding: 18px;
    }

    .grid-2,
    .toggle-grid,
    .template-grid {
      grid-template-columns: 1fr;
    }

    .button-row {
      flex-direction: column;
    }

    .btn {
      width: 100%;
    }

    h1 {
      font-size: 26px;
    }

    h2 {
      font-size: 22px;
    }

    .slide-card-header {
      flex-direction: column;
    }

    .badge-group {
      justify-content: flex-start;
    }
  }
`}</style>

      <div className="app-shell">
        <div className="container">
          <div className="left-panel">
            <div className="panel card">
              <div className="section-title">Prompt to PPT Generator</div>
              <h1>Create better presentations from one prompt</h1>
              <div className={`service-status ${serviceStatus}`}>
                {serviceStatus === "ready"
                  ? "Presentation service ready"
                  : serviceStatus === "unavailable"
                    ? "Presentation service unavailable"
                    : "Checking presentation service…"}
              </div>

              <div className="field">
                <label>What should this presentation explain?</label>
                <textarea
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  rows={8}
                  placeholder="Write your presentation prompt here..."
                />
              </div>

              <div className="grid-2">
                <div className="field">
                  <label>Number of slides</label>
                  <input type="number" min="3" max="30" value={slideCount} onChange={(e) => setSlideCount(Math.max(3, Math.min(30, Number(e.target.value) || 3)))} />
                </div>

                <div className="field">
                  <label>Target audience</label>
                  <input
                    value={audience}
                    onChange={(e) => setAudience(e.target.value)}
                    placeholder="e.g. investors, school students"
                  />
                </div>
              </div>

              <div className="grid-2">
                <div className="field">
                  <label>Tone</label>
                  <input value={tone} onChange={(e) => setTone(e.target.value)} placeholder="e.g. convincing and concise" />
                </div>

                <div className="field">
                  <label>Language</label>
                  <input value={language} onChange={(e) => setLanguage(e.target.value)} placeholder="English" />
                </div>
              </div>

              <div className="field">
                <label>Choose a visual template</label>
                <div className="template-grid">
                  {PPT_TEMPLATES.map((template) => (
                    <button
                      type="button"
                      key={template.id}
                      className={`template-card ${selectedTemplate === template.id ? "active" : ""}`}
                      onClick={() => setSelectedTemplate(template.id)}
                    >
                      <span className="template-name">{template.name}</span>
                      <span className="template-description">{template.description}</span>
                    </button>
                  ))}
                </div>
              </div>

              <div className="toggle-grid">
                <Toggle label="Include title slide" checked={includeTitleSlide} onChange={setIncludeTitleSlide} />
                <Toggle label="Allow bullets" checked={allowBullets} onChange={setAllowBullets} />
                <Toggle label="Allow paragraph" checked={allowParagraph} onChange={setAllowParagraph} />
                <Toggle label="Allow chart" checked={allowChart} onChange={setAllowChart} />
                <Toggle label="Allow image" checked={allowImage} onChange={setAllowImage} />
                <Toggle label="Allow section slide" checked={allowSectionSlide} onChange={setAllowSectionSlide} />
                <Toggle label="Allow table" checked={allowTable} onChange={setAllowTable} />
                <Toggle label="Smart mode" checked={smartMode} onChange={setSmartMode} />
                <Toggle label="Include citations" checked={includeCitations} onChange={setIncludeCitations} />
                <Toggle label="Speaker notes" checked={includeSpeakerNotes} onChange={setIncludeSpeakerNotes} />
                <Toggle label="Use Gemini AI" checked={useGemini} onChange={setUseGemini} />
              </div>

              <details className="field">
                <summary>Advanced options</summary>
                <div className="grid-2" style={{ marginTop: 12 }}>
                  <div className="field">
                    <label>Template file / path</label>
                    <input value={templateName} onChange={(e) => setTemplateName(e.target.value)} placeholder="optional" />
                  </div>
                  <div className="field">
                    <label>Allowed slide types</label>
                    <input value={slideTypes} onChange={(e) => setSlideTypes(e.target.value)} placeholder="title_slide, chart_slide" />
                  </div>
                </div>
              </details>

              {error ? <div className="error-box">{error}</div> : null}

              <div className="button-row">
                <button
                  className="btn primary"
                  onClick={fetchPlan}
                  disabled={loadingPlan || loadingGenerate}
                >
                  {loadingPlan ? "Loading..." : "Preview Plan"}
                </button>

                <button
                  className="btn primary"
                  onClick={generatePpt}
                  disabled={loadingPlan || loadingGenerate}
                >
                  {loadingGenerate ? "Generating..." : "Generate PPT"}
                </button>

                {downloadUrl ? (
                  <a className="btn secondary" href={downloadUrl} target="_blank" rel="noreferrer">
                    Download {fileName || "PPT"}
                  </a>
                ) : null}
              </div>

              {generatedMeta ? (
                <div className="success-box">
                  <strong>{generatedMeta.title}</strong>
                  {generatedMeta.slides} slides · {generatedMeta.theme} template · Ready to download
                  {generatedMeta.jobId ? <div className="muted">Job ID: {generatedMeta.jobId}</div> : null}
                </div>
              ) : null}
            </div>
          </div>

          <div className="right-panel">
            <div className="panel card">
              <div className="section-title">Preview</div>
              <h2>Plan and slides</h2>
              <div className="muted">
                {plan?.title ? `Deck title: ${plan.title}` : "No plan loaded yet."}
                {previewCount ? ` · ${previewCount} slides` : ""}
              </div>

              <div className="scroll-area">
                {plan?.slides?.length ? (
                  plan.slides.map((slide, index) => (
                    <SlidePreview
                      key={`${index}-${slide?.title || "slide"}`}
                      slide={slide}
                      index={index}
                    />
                  ))
                ) : (
                  <div className="empty-state">
                    Click <strong>Preview Plan</strong> to see slide structure.
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        <div className="footer-note">
          Tip: use a short, specific prompt for better output. Example:{" "}
          <strong>
            “Create an 10-slide presentation on Data Science for college students with workflow,
            tools, use cases, challenges, and conclusion.”
          </strong>
        </div>
      </div>
    </>
  );
}
