import React, { useCallback, useEffect, useMemo, useState } from "react";

const API_URL = process.env.REACT_APP_API_URL || "https://mother-8599.onrender.com";

function Toggle({ label, checked, onChange }) {
  return (
    <label className={`toggle ${checked ? "toggleOn" : ""}`}>
      <input
        type="checkbox"
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
      />
      <span>{label}</span>
    </label>
  );
}

export default function App() {
  const [prompt, setPrompt] = useState("");
  const [templateName, setTemplateName] = useState("");
  const [backgroundTheme, setBackgroundTheme] = useState("light");
  const [slideTypes, setSlideTypes] = useState("");
  const [output, setOutput] = useState("{}");
  const [downloadUrl, setDownloadUrl] = useState("");
  const [downloadFileName, setDownloadFileName] = useState("");
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("info");
  const [loadingPlan, setLoadingPlan] = useState(false);
  const [loadingGenerate, setLoadingGenerate] = useState(false);
  const [health, setHealth] = useState("Checking backend...");

  const [options, setOptions] = useState({
    include_title_slide: true,
    allow_bullets: true,
    allow_chart: true,
    allow_image: true,
    smart_mode: true,
  });

  const cleanBase = useCallback((url) => (url || "").trim().replace(/\/+$/, ""), []);

  const readResponse = useCallback(async (res) => {
    const text = await res.text();
    try {
      return JSON.parse(text);
    } catch {
      return { raw: text };
    }
  }, []);

  const showMessage = useCallback((text, type = "info") => {
    setMessage(text);
    setMessageType(type);
  }, []);

  const payload = useMemo(() => {
    const types = slideTypes
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean);

    return {
      prompt: prompt.trim(),
      template_name: templateName.trim() || null,
      include_title_slide: options.include_title_slide,
      allow_bullets: options.allow_bullets,
      allow_chart: options.allow_chart,
      allow_image: options.allow_image,
      background_theme: backgroundTheme,
      smart_mode: options.smart_mode,
      slide_types: types.length ? types : null,
    };
  }, [prompt, templateName, backgroundTheme, slideTypes, options]);

  const checkHealth = useCallback(async () => {
    try {
      const base = cleanBase(API_URL);
      const res = await fetch(`${base}/health`);
      const data = await readResponse(res);

      setHealth(res.ok && data?.status === "ok" ? "Backend healthy" : "Backend responded");
    } catch {
      setHealth("Backend not reachable");
    }
  }, [cleanBase, readResponse]);

  useEffect(() => {
    checkHealth();
  }, [checkHealth]);

  const callPlan = useCallback(async () => {
    if (!payload.prompt) {
      showMessage("Prompt likho pehle.", "error");
      return;
    }

    setLoadingPlan(true);
    showMessage("Plan generate ho raha hai...", "info");

    try {
      const base = cleanBase(API_URL);
      const res = await fetch(`${base}/plan`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await readResponse(res);

      if (!res.ok) {
        throw new Error(data?.detail || data?.raw || `HTTP ${res.status}`);
      }

      setOutput(JSON.stringify(data, null, 2));
      showMessage("Plan ready.", "success");
    } catch (err) {
      setOutput(JSON.stringify({ error: err.message }, null, 2));
      showMessage(`Plan failed: ${err.message}`, "error");
    } finally {
      setLoadingPlan(false);
    }
  }, [payload, readResponse, cleanBase, showMessage]);

  const callGenerate = useCallback(async () => {
    if (!payload.prompt) {
      showMessage("Prompt likho pehle.", "error");
      return;
    }

    setLoadingGenerate(true);
    showMessage("Presentation generate ho rahi hai...", "info");

    try {
      const base = cleanBase(API_URL);
      const res = await fetch(`${base}/generate`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await readResponse(res);

      if (!res.ok) {
        throw new Error(data?.detail || data?.raw || `HTTP ${res.status}`);
      }

      setOutput(JSON.stringify(data, null, 2));
      setDownloadFileName(data.file_name || "");
      setDownloadUrl(
        data.download_url?.startsWith("http") ? data.download_url : `${base}${data.download_url}`
      );
      showMessage("Presentation generated.", "success");
    } catch (err) {
      setOutput(JSON.stringify({ error: err.message }, null, 2));
      showMessage(`Generate failed: ${err.message}`, "error");
    } finally {
      setLoadingGenerate(false);
    }
  }, [payload, readResponse, cleanBase, showMessage]);

  const clearOutput = useCallback(() => {
    setOutput("{}");
    setDownloadUrl("");
    setDownloadFileName("");
    setMessage("");
  }, []);

  return (
    <div className="appShell">
      <style>{`
        * { box-sizing: border-box; }
        body {
          margin: 0;
          font-family: Inter, system-ui, -apple-system, Segoe UI, Roboto, Arial, sans-serif;
          background: #0b1220;
          color: #e8eefc;
        }
        .appShell { min-height: 100vh; padding: 20px; }
        .wrap { max-width: 1240px; margin: 0 auto; }
        .hero {
          display: flex; justify-content: space-between; gap: 12px; align-items: flex-start;
          padding: 18px 20px; border: 1px solid rgba(255,255,255,.08);
          border-radius: 18px; background: rgba(17,26,46,.92); margin-bottom: 18px;
        }
        .hero h1 { margin: 0 0 6px; font-size: 26px; }
        .hero p { margin: 0; color: #9fb0d0; line-height: 1.5; font-size: 14px; }
        .status {
          padding: 10px 14px; border-radius: 999px; background: rgba(255,255,255,.05);
          border: 1px solid rgba(255,255,255,.08); color: #9fb0d0; white-space: nowrap;
        }
        .grid { display: grid; grid-template-columns: 1fr 1fr; gap: 18px; }
        .card {
          border: 1px solid rgba(255,255,255,.08); border-radius: 18px;
          background: rgba(17,26,46,.92); overflow: hidden;
        }
        .cardHead {
          padding: 14px 18px; border-bottom: 1px solid rgba(255,255,255,.08);
          background: rgba(255,255,255,.03);
        }
        .cardHead h2 { margin: 0; font-size: 16px; }
        .cardBody { padding: 18px; }
        .field { margin-bottom: 14px; }
        label { display: block; margin-bottom: 7px; color: #9fb0d0; font-size: 13px; }
        input, textarea, select {
          width: 100%; padding: 12px 14px; border-radius: 12px;
          border: 1px solid rgba(255,255,255,.08); background: rgba(22,33,58,.95);
          color: #e8eefc; outline: none; font: inherit;
        }
        textarea { min-height: 220px; resize: vertical; line-height: 1.55; }
        .row { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; }
        .toggleRow { display: grid; grid-template-columns: 1fr 1fr; gap: 10px; }
        .toggle {
          display: flex; gap: 10px; align-items: center; padding: 10px 12px;
          border-radius: 12px; border: 1px solid rgba(255,255,255,.08);
          background: rgba(255,255,255,.03); font-size: 14px; cursor: pointer;
        }
        .toggle input { width: 16px; height: 16px; accent-color: #4f8cff; }
        .toggleOn { border-color: rgba(79,140,255,.25); background: rgba(79,140,255,.08); }
        .btnRow { display: flex; flex-wrap: wrap; gap: 10px; margin-top: 16px; }
        button {
          border: none; cursor: pointer; padding: 12px 16px; border-radius: 12px;
          font: inherit; font-weight: 700;
        }
        .primary { background: #4f8cff; color: white; }
        .secondary { background: rgba(255,255,255,.06); color: #e8eefc; border: 1px solid rgba(255,255,255,.08); }
        .danger { background: rgba(255,107,107,.18); color: #ffdede; border: 1px solid rgba(255,107,107,.25); }
        .toast {
          margin-top: 14px; padding: 12px 14px; border-radius: 12px;
          border: 1px solid rgba(255,255,255,.08); background: rgba(255,255,255,.04);
          min-height: 48px; white-space: pre-wrap;
        }
        .toast.info { color: #d7e6ff; }
        .toast.success { color: #bff7ef; }
        .toast.error { color: #ffd1d1; }
        pre {
          margin: 0; padding: 16px; border-radius: 12px; background: #08101d;
          border: 1px solid rgba(255,255,255,.08); overflow: auto; max-height: 600px;
          white-space: pre-wrap; word-break: break-word; line-height: 1.55;
        }
        .downloadBox { display: grid; gap: 10px; }
        a { color: #8ec5ff; text-decoration: none; word-break: break-all; }
        .muted { color: #9fb0d0; font-size: 13px; line-height: 1.5; }
        @media (max-width: 900px) {
          .grid, .row, .toggleRow, .hero {
            grid-template-columns: 1fr;
            flex-direction: column;
            align-items: stretch;
          }
        }
      `}</style>

      <div className="wrap">
        <div className="hero">
          <div>
            <h1>Presentation Generator</h1>
            <p>Prompt input, plan preview, PPT generation, and download.</p>
          </div>
          <div className="status">{health}</div>
        </div>

        <div className="grid">
          <section className="card">
            <div className="cardHead">
              <h2>Controls</h2>
            </div>
            <div className="cardBody">
              <div className="field">
                <label>Prompt</label>
                <textarea
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  placeholder="Presentation ka prompt likho..."
                />
              </div>

              <div className="row">
                <div className="field">
                  <label>Template Name</label>
                  <input
                    value={templateName}
                    onChange={(e) => setTemplateName(e.target.value)}
                    placeholder="./templates/base_template.pptx"
                  />
                </div>
                <div className="field">
                  <label>Background Theme</label>
                  <select
                    value={backgroundTheme}
                    onChange={(e) => setBackgroundTheme(e.target.value)}
                  >
                    <option value="light">light</option>
                    <option value="dark">dark</option>
                    <option value="blue">blue</option>
                    <option value="green">green</option>
                    <option value="purple">purple</option>
                  </select>
                </div>
              </div>

              <div className="field">
                <label>Slide Types (optional, comma-separated)</label>
                <input
                  value={slideTypes}
                  onChange={(e) => setSlideTypes(e.target.value)}
                  placeholder="title_slide,bullets_slide,chart_slide"
                />
              </div>

              <div className="toggleRow">
                <Toggle
                  label="Title slide"
                  checked={options.include_title_slide}
                  onChange={(checked) =>
                    setOptions((prev) => ({ ...prev, include_title_slide: checked }))
                  }
                />
                <Toggle
                  label="Bullets"
                  checked={options.allow_bullets}
                  onChange={(checked) =>
                    setOptions((prev) => ({ ...prev, allow_bullets: checked }))
                  }
                />
                <Toggle
                  label="Charts"
                  checked={options.allow_chart}
                  onChange={(checked) =>
                    setOptions((prev) => ({ ...prev, allow_chart: checked }))
                  }
                />
                <Toggle
                  label="Images"
                  checked={options.allow_image}
                  onChange={(checked) =>
                    setOptions((prev) => ({ ...prev, allow_image: checked }))
                  }
                />
                <Toggle
                  label="Smart mode"
                  checked={options.smart_mode}
                  onChange={(checked) =>
                    setOptions((prev) => ({ ...prev, smart_mode: checked }))
                  }
                />
              </div>

              <div className="btnRow">
                <button
                  className="secondary"
                  onClick={callPlan}
                  disabled={loadingPlan || loadingGenerate}
                >
                  {loadingPlan ? "Planning..." : "Preview Plan"}
                </button>
                <button
                  className="primary"
                  onClick={callGenerate}
                  disabled={loadingPlan || loadingGenerate}
                >
                  {loadingGenerate ? "Generating..." : "Generate PPT"}
                </button>
                <button className="danger" onClick={clearOutput}>
                  Clear Output
                </button>
              </div>

              <div className={`toast ${messageType}`}>{message}</div>
            </div>
          </section>

          <section className="card">
            <div className="cardHead">
              <h2>Output</h2>
            </div>
            <div className="cardBody">
              <pre>{output}</pre>

              <div style={{ height: 16 }} />

              <div className="downloadBox">
                <div className="muted">Download link</div>
                {downloadUrl ? (
                  <>
                    <a href={downloadUrl} target="_blank" rel="noreferrer">
                      {downloadFileName || downloadUrl}
                    </a>
                    <div className="btnRow">
                      <button
                        className="secondary"
                        onClick={async () => {
                          try {
                            await navigator.clipboard.writeText(downloadUrl);
                            showMessage("Link copied.", "success");
                          } catch {
                            showMessage("Copy failed.", "error");
                          }
                        }}
                      >
                        Copy Link
                      </button>
                    </div>
                  </>
                ) : (
                  <div className="muted">Abhi koi file generate nahi hui.</div>
                )}
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}