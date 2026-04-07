import React, { useCallback, useEffect, useMemo, useState } from "react";

const DEFAULT_API_URL = "https://mother-8599.onrender.com";
const API_URL = process.env.REACT_APP_API_URL || DEFAULT_API_URL;

/* -------------------------------------------------------
   Styles
------------------------------------------------------- */
const styles = {
  page: {
    width: "100%",
    minHeight: "100vh",
    display: "flex",
    flexDirection: "column",
    overflow: "hidden",
    color: "#fff",
    background:
      "radial-gradient(circle at top, #1b2440 0%, #0b1020 55%, #090d18 100%)",
    fontFamily:
      "system-ui, -apple-system, BlinkMacSystemFont, Segoe UI, Roboto, sans-serif",
    position: "relative",
  },
  topbar: {
    height: 74,
    padding: "0 18px",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    borderBottom: "1px solid rgba(255,255,255,0.08)",
    background: "rgba(15, 20, 36, 0.72)",
    backdropFilter: "blur(14px)",
    flexShrink: 0,
    gap: 12,
  },
  brandBlock: { display: "flex", alignItems: "center", gap: 12, minWidth: 0 },
  brandBadge: {
    width: 40,
    height: 40,
    borderRadius: 14,
    display: "grid",
    placeItems: "center",
    background: "linear-gradient(135deg, #8b5cf6 0%, #6366f1 100%)",
    fontWeight: 800,
    boxShadow: "0 10px 22px rgba(99,102,241,0.30)",
    flexShrink: 0,
  },
  brandTitle: { fontSize: 18, fontWeight: 800, lineHeight: 1.1 },
  brandSub: { marginTop: 2, fontSize: 12, color: "rgba(255,255,255,0.68)" },
  topbarRight: { display: "flex", alignItems: "center", gap: 10, flexWrap: "wrap" },
  modePill: {
    display: "inline-flex",
    alignItems: "center",
    gap: 8,
    padding: "8px 12px",
    borderRadius: 999,
    background: "rgba(255,255,255,0.06)",
    border: "1px solid rgba(255,255,255,0.08)",
    fontSize: 12,
    fontWeight: 700,
    color: "rgba(255,255,255,0.88)",
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: "50%",
    background: "#22c55e",
    boxShadow: "0 0 0 5px rgba(34,197,94,0.12)",
  },
  main: {
    flex: 1,
    display: "flex",
    justifyContent: "center",
    overflow: "hidden",
    minHeight: 0,
  },
  contentGrid: {
    width: "min(1280px, 100%)",
    display: "grid",
    gridTemplateColumns: "1.05fr 0.95fr",
    gap: 16,
    padding: 16,
    minHeight: 0,
    boxSizing: "border-box",
  },
  panel: {
    minHeight: 0,
    borderRadius: 28,
    background: "rgba(15, 20, 36, 0.68)",
    border: "1px solid rgba(255,255,255,0.08)",
    boxShadow: "0 18px 40px rgba(0,0,0,0.22)",
    backdropFilter: "blur(16px)",
    overflow: "hidden",
  },
  panelHead: {
    padding: "16px 18px",
    borderBottom: "1px solid rgba(255,255,255,0.08)",
    background: "rgba(255,255,255,0.03)",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 12,
  },
  panelTitle: { fontSize: 16, fontWeight: 800, margin: 0 },
  panelSub: { marginTop: 4, fontSize: 12, color: "rgba(255,255,255,0.66)" },
  panelBody: {
    padding: 16,
    overflowY: "auto",
    maxHeight: "calc(100vh - 150px)",
    boxSizing: "border-box",
  },
  emptyState: {
    display: "grid",
    placeItems: "center",
    minHeight: "calc(100vh - 250px)",
  },
  emptyCard: {
    width: "min(780px, 100%)",
    padding: 28,
    borderRadius: 28,
    background: "rgba(15, 20, 36, 0.68)",
    border: "1px solid rgba(255,255,255,0.08)",
    boxShadow: "0 18px 40px rgba(0,0,0,0.22)",
    backdropFilter: "blur(16px)",
    textAlign: "center",
  },
  heroTitle: {
    fontSize: "clamp(30px, 4vw, 52px)",
    fontWeight: 800,
    lineHeight: 1.05,
    letterSpacing: "-0.04em",
    margin: 0,
  },
  heroSub: {
    marginTop: 12,
    color: "rgba(255,255,255,0.74)",
    fontSize: 16,
    lineHeight: 1.7,
    maxWidth: 680,
    marginLeft: "auto",
    marginRight: "auto",
  },
  promptGrid: {
    marginTop: 22,
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
    gap: 12,
  },
  promptBtn: {
    padding: "14px 14px",
    borderRadius: 16,
    border: "1px solid rgba(255,255,255,0.08)",
    background: "rgba(255,255,255,0.05)",
    color: "#fff",
    cursor: "pointer",
    textAlign: "left",
    fontWeight: 600,
    lineHeight: 1.45,
  },
  form: { display: "grid", gap: 14 },
  field: { display: "grid", gap: 7 },
  label: {
    fontSize: 13,
    color: "rgba(255,255,255,0.72)",
    fontWeight: 700,
  },
  input: {
    width: "100%",
    padding: "12px 14px",
    borderRadius: 14,
    border: "1px solid rgba(255,255,255,0.08)",
    background: "rgba(255,255,255,0.05)",
    color: "#fff",
    outline: "none",
    font: "inherit",
    boxSizing: "border-box",
  },
  textarea: {
    width: "100%",
    minHeight: 180,
    resize: "vertical",
    padding: "12px 14px",
    borderRadius: 18,
    border: "1px solid rgba(255,255,255,0.08)",
    background: "rgba(255,255,255,0.05)",
    color: "#fff",
    outline: "none",
    font: "inherit",
    lineHeight: 1.6,
    boxSizing: "border-box",
  },
  row2: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gap: 12,
  },
  row3: {
    display: "grid",
    gridTemplateColumns: "repeat(3, 1fr)",
    gap: 12,
  },
  toggleGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
    gap: 10,
  },
  toggle: {
    display: "flex",
    gap: 10,
    alignItems: "center",
    padding: "10px 12px",
    borderRadius: 14,
    border: "1px solid rgba(255,255,255,0.08)",
    background: "rgba(255,255,255,0.04)",
    fontSize: 13,
    cursor: "pointer",
    userSelect: "none",
  },
  toggleOn: {
    border: "1px solid rgba(147,197,253,0.35)",
    background: "rgba(59,130,246,0.10)",
  },
  btnRow: {
    display: "flex",
    flexWrap: "wrap",
    gap: 10,
    marginTop: 6,
  },
  btn: {
    border: "none",
    cursor: "pointer",
    padding: "12px 16px",
    borderRadius: 14,
    font: "inherit",
    fontWeight: 800,
    display: "inline-flex",
    alignItems: "center",
    gap: 8,
  },
  primary: {
    background: "linear-gradient(135deg, #8b5cf6 0%, #6366f1 100%)",
    color: "#fff",
  },
  secondary: {
    background: "rgba(255,255,255,0.06)",
    color: "#fff",
    border: "1px solid rgba(255,255,255,0.08)",
  },
  danger: {
    background: "rgba(239,68,68,0.14)",
    color: "#ffdede",
    border: "1px solid rgba(239,68,68,0.22)",
  },
  successBox: {
    marginTop: 12,
    padding: 12,
    borderRadius: 14,
    background: "rgba(34,197,94,0.10)",
    border: "1px solid rgba(34,197,94,0.18)",
    color: "#d9ffe9",
    fontSize: 13,
    lineHeight: 1.6,
  },
  errorBox: {
    marginTop: 12,
    padding: 12,
    borderRadius: 14,
    background: "rgba(239,68,68,0.10)",
    border: "1px solid rgba(239,68,68,0.18)",
    color: "#ffd8d8",
    fontSize: 13,
    lineHeight: 1.6,
  },
  infoBox: {
    marginTop: 12,
    padding: 12,
    borderRadius: 14,
    background: "rgba(255,255,255,0.04)",
    border: "1px solid rgba(255,255,255,0.08)",
    color: "rgba(255,255,255,0.80)",
    fontSize: 13,
    lineHeight: 1.6,
  },
  pre: {
    margin: 0,
    padding: 16,
    borderRadius: 18,
    background: "rgba(5, 9, 18, 0.72)",
    border: "1px solid rgba(255,255,255,0.08)",
    overflow: "auto",
    whiteSpace: "pre-wrap",
    wordBreak: "break-word",
    lineHeight: 1.6,
    fontSize: 12,
  },
  downloadBox: {
    display: "flex",
    flexDirection: "column",
    gap: 10,
  },
  downloadCard: {
    display: "flex",
    flexDirection: "column",
    gap: 10,
    padding: 16,
    borderRadius: 16,
    background: "#fff",
    color: "#111827",
    minWidth: 260,
    boxShadow: "0 10px 24px rgba(0,0,0,0.12)",
  },
  downloadTitle: {
    fontSize: 16,
    fontWeight: 800,
    lineHeight: 1.4,
    whiteSpace: "pre-line",
  },
  downloadMeta: {
    fontSize: 13,
    color: "#4b5563",
    lineHeight: 1.6,
    whiteSpace: "pre-line",
    wordBreak: "break-word",
  },
  cardList: {
    display: "grid",
    gap: 12,
  },
  summaryCard: {
    borderRadius: 16,
    background: "rgba(255,255,255,0.05)",
    border: "1px solid rgba(255,255,255,0.08)",
    padding: 14,
  },
  summaryTitle: { fontSize: 12, color: "rgba(255,255,255,0.60)", marginBottom: 6 },
  summaryValue: { fontSize: 14, fontWeight: 700 },
  chipsRow: {
    display: "flex",
    gap: 8,
    flexWrap: "wrap",
    marginTop: 10,
  },
  chip: {
    padding: "7px 10px",
    borderRadius: 999,
    background: "rgba(255,255,255,0.06)",
    border: "1px solid rgba(255,255,255,0.08)",
    fontSize: 12,
    color: "rgba(255,255,255,0.82)",
  },
  responsiveHint: {
    fontSize: 12,
    color: "rgba(255,255,255,0.62)",
  },
};

function cleanBase(url) {
  return (url || "").trim().replace(/\/+$/, "");
}

function joinUrl(base, path) {
  if (!path) return "";
  if (/^https?:\/\//i.test(path)) return path;
  return new URL(path.replace(/^\/+/, ""), `${cleanBase(base)}/`).toString();
}

function formatApiError(data, status) {
  if (typeof data?.detail === "string") return data.detail;
  if (data?.detail && typeof data.detail === "object") {
    return data.detail.message || JSON.stringify(data.detail);
  }
  if (typeof data?.raw === "string") return data.raw;
  return `HTTP ${status}`;
}

function makeTimeoutSignal(ms = 60000) {
  if (typeof AbortSignal !== "undefined" && typeof AbortSignal.timeout === "function") {
    return AbortSignal.timeout(ms);
  }
  const controller = new AbortController();
  setTimeout(() => controller.abort(), ms);
  return controller.signal;
}

function Toggle({ label, checked, onChange }) {
  return (
    <label style={{ ...styles.toggle, ...(checked ? styles.toggleOn : null) }}>
      <input
        type="checkbox"
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
        style={{ width: 16, height: 16, accentColor: "#8b5cf6" }}
      />
      <span>{label}</span>
    </label>
  );
}

function SectionTitle({ title, subtitle, right }) {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "start",
        justifyContent: "space-between",
        gap: 12,
      }}
    >
      <div>
        <h2 style={styles.panelTitle}>{title}</h2>
        {subtitle ? <div style={styles.panelSub}>{subtitle}</div> : null}
      </div>
      {right}
    </div>
  );
}

function SummaryCard({ label, value }) {
  return (
    <div style={styles.summaryCard}>
      <div style={styles.summaryTitle}>{label}</div>
      <div style={styles.summaryValue}>{value}</div>
    </div>
  );
}

export default function Presentation() {
  const apiRoot = useMemo(() => cleanBase(API_URL), []);
  const apiBase = useMemo(() => `${apiRoot}/api/presentation`, [apiRoot]);

  const [prompt, setPrompt] = useState(
    "Data Science ke liye ek clean presentation banao with title, overview, workflow, tools, applications, challenges aur conclusion."
  );
  const [templateName, setTemplateName] = useState("");
  const [backgroundTheme, setBackgroundTheme] = useState("auto");
  const [contentTheme, setContentTheme] = useState("auto");
  const [visualStyle, setVisualStyle] = useState("auto");
  const [slideTypes, setSlideTypes] = useState(
    "title_slide, title_content, bullets_slide, chart_slide"
  );
  const [output, setOutput] = useState({});
  const [downloadUrl, setDownloadUrl] = useState("");
  const [downloadFileName, setDownloadFileName] = useState("");
  const [message, setMessage] = useState("Ready.");
  const [messageType, setMessageType] = useState("info");
  const [health, setHealth] = useState("Checking backend...");
  const [loadingPlan, setLoadingPlan] = useState(false);
  const [loadingGenerate, setLoadingGenerate] = useState(false);
  const [lastUpdated, setLastUpdated] = useState("");

  const [options, setOptions] = useState({
    include_title_slide: true,
    allow_bullets: true,
    allow_paragraph: true,
    allow_chart: true,
    allow_image: true,
    allow_section_slide: true,
    allow_table: true,
    smart_mode: true,
  });

  const selectedSlideTypes = useMemo(() => {
    return slideTypes
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean);
  }, [slideTypes]);

  const payload = useMemo(() => {
    return {
      prompt: prompt.trim(),
      template_name: templateName.trim() || null,
      include_title_slide: options.include_title_slide,
      allow_bullets: options.allow_bullets,
      allow_paragraph: options.allow_paragraph,
      allow_chart: options.allow_chart,
      allow_image: options.allow_image,
      allow_section_slide: options.allow_section_slide,
      allow_table: options.allow_table,
      background_theme: backgroundTheme,
      content_theme: contentTheme,
      visual_style: visualStyle,
      smart_mode: options.smart_mode,
      slide_types: selectedSlideTypes.length ? selectedSlideTypes : null,
    };
  }, [
    prompt,
    templateName,
    backgroundTheme,
    contentTheme,
    visualStyle,
    selectedSlideTypes,
    options,
  ]);

  const showMessage = useCallback((text, type = "info") => {
    setMessage(text);
    setMessageType(type);
  }, []);

  const readResponse = useCallback(async (res) => {
    const text = await res.text();
    try {
      return JSON.parse(text);
    } catch {
      return { raw: text };
    }
  }, []);

  const checkHealth = useCallback(async () => {
    try {
      const res = await fetch(`${apiBase}/health`);
      const data = await readResponse(res);
      setHealth(res.ok && data?.status === "ok" ? "Backend healthy" : "Backend responded");
    } catch {
      setHealth("Backend not reachable");
    }
  }, [apiBase, readResponse]);

  useEffect(() => {
    checkHealth();
    const interval = setInterval(checkHealth, 15000);
    return () => clearInterval(interval);
  }, [checkHealth]);

  useEffect(() => {
    if (!message) return;
    const t = setTimeout(() => setMessage(""), 3500);
    return () => clearTimeout(t);
  }, [message]);

  const applyOutput = useCallback((data) => {
    setOutput(data || {});
    setLastUpdated(new Date().toLocaleString());
  }, []);

  const callPlan = useCallback(async () => {
    if (!payload.prompt) {
      showMessage("Prompt likho pehle.", "error");
      return;
    }

    setLoadingPlan(true);
    showMessage("Plan generate ho raha hai...", "info");

    try {
      const res = await fetch(`${apiBase}/plan`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
        signal: makeTimeoutSignal(60000),
      });

      const data = await readResponse(res);
      if (!res.ok) throw new Error(formatApiError(data, res.status));

      applyOutput(data);
      showMessage("Plan ready.", "success");
    } catch (err) {
      const errorMessage =
        err?.name === "AbortError" ? "Request timed out" : err?.message || "Unknown error";
      applyOutput({ error: errorMessage });
      showMessage(`Plan failed: ${errorMessage}`, "error");
    } finally {
      setLoadingPlan(false);
    }
  }, [payload, readResponse, apiBase, showMessage, applyOutput]);

  const callGenerate = useCallback(async () => {
    if (!payload.prompt) {
      showMessage("Prompt likho pehle.", "error");
      return;
    }

    setLoadingGenerate(true);
    showMessage("Presentation generate ho rahi hai...", "info");

    try {
      const res = await fetch(`${apiBase}/generate`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
        signal: makeTimeoutSignal(60000),
      });

      const data = await readResponse(res);
      if (!res.ok) throw new Error(formatApiError(data, res.status));

      applyOutput(data);
      setDownloadFileName(data.file_name || "presentation.pptx");
      setDownloadUrl(data.download_url || "");
      showMessage("Presentation generated.", "success");

      if (data.download_url) {
        const url = joinUrl(apiRoot, data.download_url);
        window.open(url, "_blank", "noopener,noreferrer");
      }
    } catch (err) {
      const errorMessage =
        err?.name === "AbortError" ? "Request timed out" : err?.message || "Unknown error";
      applyOutput({ error: errorMessage });
      showMessage(`Generate failed: ${errorMessage}`, "error");
    } finally {
      setLoadingGenerate(false);
    }
  }, [payload, readResponse, apiBase, apiRoot, showMessage, applyOutput]);

  const downloadFile = useCallback(async () => {
    if (!downloadUrl) {
      showMessage("Download link available nahi hai.", "error");
      return;
    }

    try {
      const absoluteUrl = joinUrl(apiRoot, downloadUrl);
      const res = await fetch(absoluteUrl);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);

      const blob = await res.blob();
      const objectUrl = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = objectUrl;
      a.download = downloadFileName || "presentation.pptx";
      document.body.appendChild(a);
      a.click();
      a.remove();
      URL.revokeObjectURL(objectUrl);
      showMessage("Download started.", "success");
    } catch (err) {
      showMessage(`Download failed: ${err?.message || "Unknown error"}`, "error");
    }
  }, [downloadUrl, downloadFileName, apiRoot, showMessage]);

  const copyLink = useCallback(async () => {
    if (!downloadUrl) {
      showMessage("Copy karne ke liye link nahi hai.", "error");
      return;
    }

    try {
      const absoluteUrl = joinUrl(apiRoot, downloadUrl);
      await navigator.clipboard.writeText(absoluteUrl);
      showMessage("Link copied.", "success");
    } catch {
      showMessage("Copy failed.", "error");
    }
  }, [downloadUrl, apiRoot, showMessage]);

  const clearOutput = useCallback(() => {
    setOutput({});
    setDownloadUrl("");
    setDownloadFileName("");
    setMessage("");
    setMessageType("info");
  }, []);

  const promptHints = [
    "Data Science presentation",
    "AI startup pitch deck",
    "Marketing strategy with charts",
    "Student seminar on cloud computing",
  ];

  const isAllSlideTypesSelected =
    selectedSlideTypes.length === 7 &&
    [
      "title_slide",
      "title_content",
      "bullets_slide",
      "chart_slide",
      "image_slide",
      "section_slide",
      "table_slide",
    ].every((x) => selectedSlideTypes.includes(x));

  const hasOutput = Object.keys(output || {}).length > 0;

  return (
    <div style={styles.page}>
      <div style={styles.topbar}>
        <div style={styles.brandBlock}>
          <div style={styles.brandBadge}>P</div>
          <div style={{ minWidth: 0 }}>
            <div style={styles.brandTitle}>Presentation Generator</div>
            <div style={styles.brandSub}>Backend-aware React dashboard</div>
          </div>
        </div>

        <div style={styles.topbarRight}>
          <div style={styles.modePill}>
            <span style={styles.statusDot} />
            {health}
          </div>
          <div style={styles.modePill}>API: {apiBase}</div>
          {lastUpdated ? <div style={styles.modePill}>Updated: {lastUpdated}</div> : null}
        </div>
      </div>

      <div style={styles.main}>
        <div style={styles.contentGrid}>
          <div style={styles.panel}>
            <div style={styles.panelHead}>
              <SectionTitle
                title="Controls"
                subtitle="Prompt, themes, and slide rules yahin se set karo."
                right={<div style={styles.modePill}>{selectedSlideTypes.length} layouts</div>}
              />
            </div>

            <div style={styles.panelBody}>
              <div style={styles.form}>
                <div style={styles.field}>
                  <label style={styles.label}>Prompt</label>
                  <textarea
                    value={prompt}
                    onChange={(e) => setPrompt(e.target.value)}
                    placeholder="Presentation ka prompt likho..."
                    style={styles.textarea}
                  />
                </div>

                <div style={styles.chipsRow}>
                  {promptHints.map((item) => (
                    <button
                      key={item}
                      type="button"
                      onClick={() => setPrompt(item)}
                      style={styles.chip}
                    >
                      {item}
                    </button>
                  ))}
                </div>

                <div style={styles.row2}>
                  <div style={styles.field}>
                    <label style={styles.label}>Template Name</label>
                    <input
                      value={templateName}
                      onChange={(e) => setTemplateName(e.target.value)}
                      placeholder="./templates/base_template.pptx"
                      style={styles.input}
                    />
                  </div>
                  <div style={styles.field}>
                    <label style={styles.label}>Slide Types</label>
                    <label style={{ ...styles.toggle, width: "fit-content" }}>
                      <input
                        type="checkbox"
                        checked={isAllSlideTypesSelected}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setSlideTypes(
                              "title_slide, title_content, bullets_slide, chart_slide, image_slide, section_slide, table_slide"
                            );
                          } else {
                            setSlideTypes("");
                          }
                        }}
                        style={{ width: 16, height: 16, accentColor: "#8b5cf6" }}
                      />
                      <span>Select all</span>
                    </label>
                  </div>
                </div>

                <div style={styles.field}>
                  <label style={styles.label}>Slide Types (comma-separated)</label>
                  <input
                    value={slideTypes}
                    onChange={(e) => setSlideTypes(e.target.value)}
                    placeholder="title_slide, bullets_slide, chart_slide"
                    style={styles.input}
                  />
                </div>

                <div style={styles.row3}>
                  <div style={styles.field}>
                    <label style={styles.label}>Background Theme</label>
                    <select
                      value={backgroundTheme}
                      onChange={(e) => setBackgroundTheme(e.target.value)}
                      style={styles.input}
                    >
                      <option value="auto">auto</option>
                      <option value="light">light</option>
                      <option value="dark">dark</option>
                      <option value="blue">blue</option>
                      <option value="green">green</option>
                      <option value="purple">purple</option>
                      <option value="ai">ai</option>
                      <option value="cyber">cyber</option>
                      <option value="cloud">cloud</option>
                      <option value="data">data</option>
                      <option value="finance">finance</option>
                      <option value="education">education</option>
                      <option value="startup">startup</option>
                    </select>
                  </div>
                  <div style={styles.field}>
                    <label style={styles.label}>Content Theme</label>
                    <select
                      value={contentTheme}
                      onChange={(e) => setContentTheme(e.target.value)}
                      style={styles.input}
                    >
                      <option value="auto">auto</option>
                      <option value="light">light</option>
                      <option value="dark">dark</option>
                      <option value="blue">blue</option>
                      <option value="green">green</option>
                      <option value="purple">purple</option>
                      <option value="ai">ai</option>
                      <option value="cyber">cyber</option>
                      <option value="cloud">cloud</option>
                      <option value="data">data</option>
                      <option value="finance">finance</option>
                      <option value="education">education</option>
                      <option value="startup">startup</option>
                    </select>
                  </div>
                  <div style={styles.field}>
                    <label style={styles.label}>Visual Style</label>
                    <select
                      value={visualStyle}
                      onChange={(e) => setVisualStyle(e.target.value)}
                      style={styles.input}
                    >
                      <option value="auto">auto</option>
                      <option value="minimal">minimal</option>
                      <option value="corporate">corporate</option>
                      <option value="academic">academic</option>
                      <option value="modern_gradient">modern_gradient</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label style={styles.label}>Feature Flags</label>
                  <div style={styles.toggleGrid}>
                    <Toggle
                      label="Title slide"
                      checked={options.include_title_slide}
                      onChange={(checked) =>
                        setOptions((p) => ({ ...p, include_title_slide: checked }))
                      }
                    />
                    <Toggle
                      label="Bullets"
                      checked={options.allow_bullets}
                      onChange={(checked) =>
                        setOptions((p) => ({ ...p, allow_bullets: checked }))
                      }
                    />
                    <Toggle
                      label="Paragraph"
                      checked={options.allow_paragraph}
                      onChange={(checked) =>
                        setOptions((p) => ({ ...p, allow_paragraph: checked }))
                      }
                    />
                    <Toggle
                      label="Charts"
                      checked={options.allow_chart}
                      onChange={(checked) =>
                        setOptions((p) => ({ ...p, allow_chart: checked }))
                      }
                    />
                    <Toggle
                      label="Images"
                      checked={options.allow_image}
                      onChange={(checked) =>
                        setOptions((p) => ({ ...p, allow_image: checked }))
                      }
                    />
                    <Toggle
                      label="Section slide"
                      checked={options.allow_section_slide}
                      onChange={(checked) =>
                        setOptions((p) => ({ ...p, allow_section_slide: checked }))
                      }
                    />
                    <Toggle
                      label="Tables"
                      checked={options.allow_table}
                      onChange={(checked) =>
                        setOptions((p) => ({ ...p, allow_table: checked }))
                      }
                    />
                    <Toggle
                      label="Smart mode"
                      checked={options.smart_mode}
                      onChange={(checked) =>
                        setOptions((p) => ({ ...p, smart_mode: checked }))
                      }
                    />
                  </div>
                </div>

                <div style={styles.btnRow}>
                  <button
                    onClick={callPlan}
                    disabled={loadingPlan || loadingGenerate}
                    style={{
                      ...styles.btn,
                      ...styles.secondary,
                      opacity: loadingPlan || loadingGenerate ? 0.65 : 1,
                    }}
                  >
                    {loadingPlan ? "⏳" : "🧾"} {loadingPlan ? "Planning..." : "Preview Plan"}
                  </button>

                  <button
                    onClick={callGenerate}
                    disabled={loadingPlan || loadingGenerate}
                    style={{
                      ...styles.btn,
                      ...styles.primary,
                      opacity: loadingPlan || loadingGenerate ? 0.65 : 1,
                    }}
                  >
                    {loadingGenerate ? "⏳" : "✨"} {loadingGenerate ? "Generating..." : "Generate PPT"}
                  </button>

                  <button onClick={clearOutput} style={{ ...styles.btn, ...styles.danger }}>
                    🧹 Clear Output
                  </button>
                </div>

                <div
                  style={
                    messageType === "success"
                      ? styles.successBox
                      : messageType === "error"
                      ? styles.errorBox
                      : styles.infoBox
                  }
                >
                  {message || "Ready."}
                </div>

                <div style={styles.responsiveHint}>
                  Backend compatible fields are included: theme, visual style, slide types, and all
                  feature flags.
                </div>
              </div>
            </div>
          </div>

          <div style={{ display: "grid", gap: 16, minHeight: 0 }}>
            <div style={styles.panel}>
              <div style={styles.panelHead}>
                <SectionTitle
                  title="Output"
                  subtitle="Plan ya generate response yahan dikhega."
                />
              </div>
              <div style={styles.panelBody}>
                {hasOutput ? (
                  <pre style={styles.pre}>{JSON.stringify(output, null, 2)}</pre>
                ) : (
                  <div style={styles.emptyState}>
                    <div style={styles.emptyCard}>
                      <h1 style={styles.heroTitle}>Build a slide deck in one click</h1>
                      <p style={styles.heroSub}>
                        Prompt daalo, plan preview karo, aur backend se ready-made PPT generate
                        karo. Theme, visual style, slide types, aur smart split sab supported hai.
                      </p>
                      <div style={styles.promptGrid}>
                        {promptHints.map((hint) => (
                          <button
                            key={hint}
                            type="button"
                            onClick={() => setPrompt(hint)}
                            style={styles.promptBtn}
                          >
                            {hint}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>

            <div style={styles.panel}>
              <div style={styles.panelHead}>
                <SectionTitle
                  title="Download"
                  subtitle="Generate hone ke baad link yahan aayega."
                />
              </div>
              <div style={styles.panelBody}>
                {downloadUrl ? (
                  <div style={styles.downloadBox}>
                    <div style={styles.downloadCard}>
                      <div style={styles.downloadTitle}>File name</div>
                      <div style={styles.downloadMeta}>
                        {downloadFileName || "presentation.pptx"}
                      </div>

                      <div style={styles.downloadTitle}>Download URL</div>
                      <div style={styles.downloadMeta}>{joinUrl(apiRoot, downloadUrl)}</div>

                      <div style={{ display: "flex", flexWrap: "wrap", gap: 10, marginTop: 4 }}>
                        <button onClick={downloadFile} style={{ ...styles.btn, ...styles.primary }}>
                          ⬇️ Download PPT
                        </button>
                        <button onClick={copyLink} style={{ ...styles.btn, ...styles.secondary }}>
                          📋 Copy Link
                        </button>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div style={styles.emptyState}>
                    <div style={styles.emptyCard}>
                      <h1 style={{ ...styles.heroTitle, fontSize: "clamp(22px, 3vw, 34px)" }}>
                        No download yet
                      </h1>
                      <p style={styles.heroSub}>
                        PPT generate karoge to file name aur download link automatically show ho
                        jayega.
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>

            <div style={styles.panel}>
              <div style={styles.panelHead}>
                <SectionTitle title="Quick summary" subtitle="Current configuration snapshot." />
              </div>
              <div style={styles.panelBody}>
                <div style={styles.cardList}>
                  <SummaryCard label="Title slide" value={String(options.include_title_slide)} />
                  <SummaryCard label="Bullets" value={String(options.allow_bullets)} />
                  <SummaryCard label="Paragraph" value={String(options.allow_paragraph)} />
                  <SummaryCard label="Charts" value={String(options.allow_chart)} />
                  <SummaryCard label="Images" value={String(options.allow_image)} />
                  <SummaryCard
                    label="Section slide"
                    value={String(options.allow_section_slide)}
                  />
                  <SummaryCard label="Table" value={String(options.allow_table)} />
                  <SummaryCard label="Smart mode" value={String(options.smart_mode)} />
                  <SummaryCard
                    label="Slide types selected"
                    value={selectedSlideTypes.length ? String(selectedSlideTypes.length) : "auto"}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}