import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import html2canvas from "html2canvas";
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  AreaChart,
  Area,
  CartesianGrid,
  ComposedChart,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ScatterChart,
  Scatter,
  RadarChart,
  Radar,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  ResponsiveContainer,
} from "recharts";

/* -------------------------------------------------------
   Safe env / base URL
------------------------------------------------------- */
const getApiBaseUrl = () => {
  const viteUrl =
    typeof import.meta !== "undefined" &&
    import.meta.env &&
    import.meta.env.VITE_API_URL;

  const craUrl =
    typeof process !== "undefined" &&
    process.env &&
    process.env.REACT_APP_API_URL;

  const fallback = "https://mother-8599.onrender.com";
  const url = viteUrl || craUrl || fallback;

  return url.endsWith("/") ? url.slice(0, -1) : url;
};

const API_BASE_URL = getApiBaseUrl();

/* -------------------------------------------------------
   Constants
------------------------------------------------------- */
const CHAT_TYPES = new Set([
  "bar",
  "chart",
  "line",
  "line_chart",
  "pie",
  "donut",
  "area",
  "composed",
  "multi_line",
  "scatter",
  "radar",
  "heatmap",
  "waterfall",
  "stacked",
]);

const MEDIA_TYPES = new Set(["image", "qr", "barcode"]);
const COLORS = ["#8b5cf6", "#22c55e", "#f59e0b", "#f97316", "#ef4444", "#38bdf8"];
const CHART_HEIGHT = 240;

const MODES = [
  { key: "chat", label: "Chat", hint: "Default mode" },
  { key: "news", label: "News", hint: "Latest updates" },
  { key: "wiki", label: "Wikipedia", hint: "Search knowledge" },
  { key: "file", label: "Create File", hint: "Generate PPT output" },
];

const QUICK_PROMPTS = [
  "Explain this in simple words",
  "Generate a bar chart for sales data",
  "Show latest AI news",
  "Search Wikipedia: Alan Turing",
];

const PPT_DEFAULTS = {
  include_title_slide: true,
  allow_bullets: true,
  allow_paragraph: true,
  allow_chart: true,
  allow_image: true,
  allow_section_slide: true,
  allow_table: true,
  smart_mode: true,
};

/* -------------------------------------------------------
   Helpers
------------------------------------------------------- */
const isHttpUrl = (value) => /^https?:\/\//i.test(value || "");

const buildFileUrl = (pathOrUrl) => {
  if (!pathOrUrl) return "";
  if (isHttpUrl(pathOrUrl)) return pathOrUrl;
  return `${API_BASE_URL}${pathOrUrl.startsWith("/") ? "" : "/"}${pathOrUrl}`;
};

const safeJSON = (value) => {
  if (typeof value !== "string") return value;
  const trimmed = value.trim();
  if (!trimmed) return value;

  if (
    (trimmed.startsWith("{") && trimmed.endsWith("}")) ||
    (trimmed.startsWith("[") && trimmed.endsWith("]"))
  ) {
    try {
      return JSON.parse(trimmed);
    } catch {
      return value;
    }
  }
  return value;
};

const normalizeWikiData = (value) => {
  const parsed = safeJSON(value);
  const data = typeof parsed === "string" ? safeJSON(parsed) : parsed;
  if (!data || typeof data !== "object" || Array.isArray(data)) return {};

  return {
    title: data.title || data.name || data.pageTitle || "Wikipedia",
    summary: data.summary || data.extract || data.description || "",
    image:
      data.image ||
      data.images?.[0] ||
      data.thumbnail?.source ||
      data.thumbnail ||
      data.imageUrl ||
      "",
    url: data.url || data.pageUrl || data.content_urls?.desktop?.page || "",
  };
};

const formatMonth = (dateStr) => {
  const d = new Date(dateStr);
  if (Number.isNaN(d.getTime())) return dateStr;
  return d.toLocaleDateString("en-IN", { month: "short", year: "numeric" });
};

const normalizeMultiLineData = (data) => {
  if (!data || typeof data !== "object" || Array.isArray(data)) return data;

  const incomeData = data.income || [];
  const expenseData = data.expense || [];
  const merged = {};

  incomeData.forEach((i) => {
    merged[i.month] = {
      month: formatMonth(i.month),
      income: i.amount ?? 0,
      expense: 0,
    };
  });

  expenseData.forEach((e) => {
    if (merged[e.month]) {
      merged[e.month].expense = e.amount ?? 0;
    } else {
      merged[e.month] = {
        month: formatMonth(e.month),
        income: 0,
        expense: e.amount ?? 0,
      };
    }
  });

  return Object.values(merged);
};

const findArrayDeep = (value, depth = 0) => {
  if (depth > 4 || value == null) return null;
  if (Array.isArray(value)) return value;

  const parsed = safeJSON(value);
  if (Array.isArray(parsed)) return parsed;

  if (parsed && typeof parsed === "object") {
    const preferredKeys = ["data", "items", "rows", "result", "content", "reply", "payload", "chartData"];
    for (const key of preferredKeys) {
      const found = findArrayDeep(parsed[key], depth + 1);
      if (found) return found;
    }

    for (const val of Object.values(parsed)) {
      const found = findArrayDeep(val, depth + 1);
      if (found) return found;
    }
  }

  return null;
};

const readResponse = async (res) => {
  const text = await res.text();
  const contentType = res.headers.get("content-type") || "";

  if (contentType.includes("application/json")) {
    try {
      return JSON.parse(text);
    } catch {
      throw new Error(`Invalid JSON from server:\n${text}`);
    }
  }

  try {
    return JSON.parse(text);
  } catch {
    return { raw: text };
  }
};

const buildPptPayload = (prompt, templateName, backgroundTheme, slideTypesRaw) => {
  const slideTypes = (slideTypesRaw || "")
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);

  return {
    prompt: prompt.trim(),
    template_name: templateName.trim() || null,
    ...PPT_DEFAULTS,
    background_theme: backgroundTheme,
    slide_types: slideTypes.length ? slideTypes : null,
  };
};

const getMessageText = (msg) => {
  const type = (msg?.type || "").toLowerCase().trim();
  const raw = msg?.content ?? msg?.text ?? msg?.data ?? "";

  if (type === "text") return msg?.content || msg?.text || msg?.reply || "";
  if (type === "download_link") return msg?.text || "Presentation ready";

  if (type === "chat") {
    const data = msg?.content ?? msg?.reply ?? msg?.text ?? "";
    if (typeof data === "string") return data;
    if (data && typeof data === "object") return data.content || data.reply || JSON.stringify(data, null, 2);
    return "";
  }

  if (type === "news") {
    const parsed = Array.isArray(raw) ? raw : safeJSON(raw);
    const data = Array.isArray(parsed) ? parsed : parsed?.articles || [];
    if (!data.length) return "News response";
    return data
      .map((item, index) => {
        const title = item?.title ? `Title: ${item.title}` : `News item ${index + 1}`;
        const desc = item?.description ? `Description: ${item.description}` : "";
        const url = item?.url ? `Link: ${item.url}` : "";
        return [title, desc, url].filter(Boolean).join("\n");
      })
      .join("\n\n");
  }

  if (type === "wiki") {
    const data = normalizeWikiData(raw);
    if (!data.title && !data.summary && !data.url) return "Wikipedia response";
    return [
      data.title ? `Title: ${data.title}` : "",
      data.summary ? `Summary: ${data.summary}` : "",
      data.url ? `Link: ${data.url}` : "",
    ]
      .filter(Boolean)
      .join("\n\n");
  }

  if (MEDIA_TYPES.has(type)) return "Media message";
  if (CHAT_TYPES.has(type)) return typeof raw === "string" ? raw : JSON.stringify(raw, null, 2);
  if (typeof raw === "string") return raw;
  if (raw && typeof raw === "object") return JSON.stringify(raw, null, 2);
  return "";
};

const getSpeakText = (msg) => {
  const type = (msg?.type || "").toLowerCase().trim();
  const text = getMessageText(msg);
  if (!text) return "";
  if (type === "news" || type === "wiki") return text;
  if (type === "download_link") return "Presentation is ready. Click to download.";
  if (CHAT_TYPES.has(type)) return "Chart response received.";
  if (MEDIA_TYPES.has(type)) return "Media response received.";
  return text;
};

/* -------------------------------------------------------
   Component
------------------------------------------------------- */
const Chatbot = () => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [listening, setListening] = useState(false);
  const [voiceEnabled, setVoiceEnabled] = useState(true);
  const [plusOpen, setPlusOpen] = useState(false);
  const [mode, setMode] = useState("chat");

  const token = useMemo(() => {
    try {
      return localStorage.getItem("token") || "";
    } catch {
      return "";
    }
  }, []);

  const bottomRef = useRef(null);
  const recognitionRef = useRef(null);
  const isSpeakingRef = useRef(false);
  const chartRefs = useRef({});
  const forceStopRef = useRef(false);
  const menuRef = useRef(null);

  useEffect(() => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (SpeechRecognition) {
      const rec = new SpeechRecognition();
      rec.continuous = false;
      rec.interimResults = false;
      rec.lang = "en-IN";
      recognitionRef.current = rec;
    }

    const onDocClick = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setPlusOpen(false);
      }
    };

    document.addEventListener("mousedown", onDocClick);

    return () => {
      document.removeEventListener("mousedown", onDocClick);
      try {
        recognitionRef.current?.stop();
      } catch {}
      try {
        window.speechSynthesis?.cancel();
      } catch {}
    };
  }, []);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  const speak = useCallback((text) => {
    if (!text || !window.speechSynthesis || typeof SpeechSynthesisUtterance === "undefined") return;

    try {
      window.speechSynthesis.cancel();
    } catch {}

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = "en-IN";
    isSpeakingRef.current = true;
    utterance.onend = () => (isSpeakingRef.current = false);
    utterance.onerror = () => (isSpeakingRef.current = false);
    window.speechSynthesis.speak(utterance);
  }, []);

  const stopRecognition = useCallback(() => {
    const recognition = recognitionRef.current;
    if (!recognition) return;

    forceStopRef.current = true;
    try {
      recognition.stop();
    } catch {}
    setListening(false);
  }, []);

  const createDownloadLink = useCallback((blob, filename) => {
    const objectUrl = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = objectUrl;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    a.remove();
    setTimeout(() => window.URL.revokeObjectURL(objectUrl), 1000);
  }, []);

  const downloadBlobFromResponse = useCallback(
    async (res, filename) => {
      const blob = await res.blob();
      createDownloadLink(blob, filename);
    },
    [createDownloadLink]
  );

  const downloadBlobFromUrl = useCallback(
    async (url, filename) => {
      const res = await fetch(url, {
        method: "GET",
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      });
      if (!res.ok) throw new Error(`Download failed: ${res.status}`);
      await downloadBlobFromResponse(res, filename);
    },
    [token, downloadBlobFromResponse]
  );

  const downloadTextFile = useCallback(
    (text, filename) => {
      const blob = new Blob([text || ""], { type: "text/plain;charset=utf-8" });
      createDownloadLink(blob, filename);
    },
    [createDownloadLink]
  );

  const handleFileResponse = useCallback(
    async (res, contentType) => {
      const lower = (contentType || "").toLowerCase();

      if (lower.includes("text/csv")) {
        await downloadBlobFromResponse(res, "chat_data.csv");
        setMessages((prev) => [...prev, { sender: "bot", type: "text", text: "CSV downloaded ✅" }]);
        return true;
      }

      if (
        lower.includes("application/vnd.openxmlformats-officedocument.wordprocessingml.document") ||
        lower.includes("wordprocessingml.document") ||
        lower.includes("application/msword")
      ) {
        await downloadBlobFromResponse(res, "chat_data.docx");
        setMessages((prev) => [...prev, { sender: "bot", type: "text", text: "DOCX downloaded ✅" }]);
        return true;
      }

      if (lower.includes("application/pdf")) {
        await downloadBlobFromResponse(res, "chat_data.pdf");
        setMessages((prev) => [...prev, { sender: "bot", type: "text", text: "PDF downloaded ✅" }]);
        return true;
      }

      return false;
    },
    [downloadBlobFromResponse]
  );

  const getChartData = useCallback((msg) => {
    const raw = msg.content ?? msg.text ?? msg.data ?? null;
    if ((msg.type || "").toLowerCase().trim() === "multi_line") {
      return normalizeMultiLineData(safeJSON(raw));
    }
    return findArrayDeep(raw);
  }, []);

  const getKeys = useCallback((data, type) => {
    const first = data?.[0] || {};
    let xKey = "category";
    if (first.category !== undefined) xKey = "category";
    else if (first.month !== undefined) xKey = "month";
    else if (first.name !== undefined) xKey = "name";
    else if (first.label !== undefined) xKey = "label";
    else if (first.title !== undefined) xKey = "title";
    else if (first.x !== undefined && type === "scatter") xKey = "x";

    let yKey = "amount";
    if (first.amount !== undefined) yKey = "amount";
    else if (first.value !== undefined) yKey = "value";
    else if (first.count !== undefined) yKey = "count";
    else if (first.y !== undefined && type === "scatter") yKey = "y";

    return { xKey, yKey };
  }, []);

  const downloadChartPNG = useCallback(async (index, msg) => {
    const element = chartRefs.current[index];
    if (!element) return;
    const canvas = await html2canvas(element, { backgroundColor: "#ffffff", scale: 2 });
    const link = document.createElement("a");
    link.download = `${msg.type || "chart"}_${index + 1}.png`;
    link.href = canvas.toDataURL("image/png");
    link.click();
  }, []);

  const renderNews = useCallback((msg) => {
    const raw = msg.content ?? msg.text ?? [];
    let data = [];

    if (Array.isArray(raw)) data = raw;
    else {
      const parsed = safeJSON(raw);
      if (Array.isArray(parsed)) data = parsed;
      else if (parsed?.articles && Array.isArray(parsed.articles)) data = parsed.articles;
    }

    if (!data.length) return <div style={styles.emptyText}>No news available</div>;

    return (
      <div style={styles.cardList}>
        {data.map((item, i) => (
          <div key={i} style={styles.infoCard}>
            {item?.image ? (
              <img
                src={item.image}
                alt={item.title || "news"}
                style={styles.mediaLarge}
                onError={(e) => {
                  e.currentTarget.style.display = "none";
                }}
              />
            ) : null}
            <div style={styles.cardTitle}>{item?.title || "No title"}</div>
            <div style={styles.cardBody}>{item?.description || "No description"}</div>
            {item?.url ? (
              <a href={item.url} target="_blank" rel="noreferrer" style={styles.link}>
                Read more →
              </a>
            ) : null}
          </div>
        ))}
      </div>
    );
  }, []);

  const renderWiki = useCallback((msg) => {
    const data = normalizeWikiData(msg.content ?? msg.text ?? msg.data ?? {});
    if (!data.title && !data.summary && !data.url && !data.image) {
      return <div style={styles.emptyText}>No Wikipedia data available</div>;
    }

    return (
      <div style={styles.infoCard}>
        {data.image ? (
          <img
            src={data.image}
            alt={data.title || "wikipedia"}
            style={styles.mediaLarge}
            onError={(e) => {
              e.currentTarget.style.display = "none";
            }}
          />
        ) : null}
        <div style={styles.cardTitle}>{data.title}</div>
        <div style={styles.cardBody}>{data.summary || "No summary available"}</div>
        {data.url ? (
          <a href={data.url} target="_blank" rel="noreferrer" style={styles.link}>
            Read more →
          </a>
        ) : null}
      </div>
    );
  }, []);

  const renderChart = useCallback(
    (msg) => {
      const type = (msg.type || "").toLowerCase().trim();
      const data = getChartData(msg);

      if (!data || !Array.isArray(data) || data.length === 0) {
        return <div style={styles.emptyText}>No chart data</div>;
      }

      const { xKey, yKey } = getKeys(data, type);

      switch (type) {
        case "bar":
        case "chart":
          return (
            <ResponsiveContainer width="100%" height={CHART_HEIGHT}>
              <BarChart data={data} margin={{ top: 0, right: 0, left: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey={xKey} />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey={yKey} fill="#8b5cf6" />
              </BarChart>
            </ResponsiveContainer>
          );

        case "line":
        case "line_chart":
          return (
            <ResponsiveContainer width="100%" height={CHART_HEIGHT}>
              <LineChart data={data} margin={{ top: 10, right: 10, left: 10, bottom: 20 }}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey={xKey} />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey={yKey} stroke="#8b5cf6" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          );

        case "multi_line":
          return (
            <ResponsiveContainer width="100%" height={CHART_HEIGHT}>
              <LineChart data={data} margin={{ top: 10, right: 10, left: 10, bottom: 20 }}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="income" stroke="#22c55e" strokeWidth={2} />
                <Line type="monotone" dataKey="expense" stroke="#ef4444" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          );

        case "pie":
        case "donut":
          return (
            <ResponsiveContainer width="100%" height={CHART_HEIGHT}>
              <PieChart>
                <Pie
                  data={data}
                  dataKey={yKey}
                  nameKey={xKey}
                  cx="50%"
                  cy="50%"
                  innerRadius={type === "donut" ? 50 : 0}
                  outerRadius={80}
                >
                  {data.map((_, i) => (
                    <Cell key={i} fill={COLORS[i % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          );

        case "composed":
          return (
            <ResponsiveContainer width="100%" height={CHART_HEIGHT}>
              <ComposedChart data={data} margin={{ top: 10, right: 10, left: 10, bottom: 20 }}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey={xKey} />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey={yKey} fill="#8b5cf6" />
                <Line type="monotone" dataKey={yKey} stroke="#f59e0b" />
              </ComposedChart>
            </ResponsiveContainer>
          );

        case "area":
          return (
            <ResponsiveContainer width="100%" height={CHART_HEIGHT}>
              <AreaChart data={data} margin={{ top: 10, right: 10, left: 10, bottom: 20 }}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey={xKey} />
                <YAxis />
                <Tooltip />
                <Area type="monotone" dataKey={yKey} fill="#8b5cf6" stroke="#8b5cf6" />
              </AreaChart>
            </ResponsiveContainer>
          );

        case "scatter":
          return (
            <ResponsiveContainer width="100%" height={CHART_HEIGHT}>
              <ScatterChart margin={{ top: 10, right: 10, left: 10, bottom: 20 }}>
                <CartesianGrid />
                <XAxis dataKey={xKey} type="number" />
                <YAxis dataKey={yKey} type="number" />
                <Tooltip />
                <Scatter data={data} fill="#8b5cf6" />
              </ScatterChart>
            </ResponsiveContainer>
          );

        case "stacked":
          return (
            <ResponsiveContainer width="100%" height={CHART_HEIGHT}>
              <BarChart data={data} margin={{ top: 10, right: 10, left: 10, bottom: 20 }}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey={xKey} />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey={yKey} stackId="a" fill="#8b5cf6" />
              </BarChart>
            </ResponsiveContainer>
          );

        case "radar":
          return (
            <ResponsiveContainer width="100%" height={CHART_HEIGHT}>
              <RadarChart data={data}>
                <PolarGrid />
                <PolarAngleAxis dataKey={xKey} />
                <PolarRadiusAxis />
                <Tooltip />
                <Radar dataKey={yKey} fill="#8b5cf6" stroke="#8b5cf6" />
              </RadarChart>
            </ResponsiveContainer>
          );

        case "heatmap":
          return (
            <div style={styles.heatmapGrid}>
              {data.map((item, i) => {
                const value = item.amount ?? item.value ?? item.count ?? 0;
                return (
                  <div
                    key={i}
                    style={{
                      ...styles.heatCell,
                      background: `rgba(139,92,246, ${Math.min(Number(value) / 1000 || 0, 1)})`,
                    }}
                    title={`${item.category || item.name || item.month || i}: ${value}`}
                  />
                );
              })}
            </div>
          );

        case "waterfall":
          return (
            <ResponsiveContainer width="100%" height={CHART_HEIGHT}>
              <BarChart data={data} margin={{ top: 10, right: 10, left: 10, bottom: 20 }}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey={xKey} />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey={yKey} fill="#8b5cf6" />
              </BarChart>
            </ResponsiveContainer>
          );

        default:
          return <div style={styles.emptyText}>No chart available</div>;
      }
    },
    [getChartData, getKeys]
  );

  const handleCopyMessage = async (msg) => {
    const text = getMessageText(msg);
    if (!text) return;
    try {
      await navigator.clipboard.writeText(text);
    } catch (err) {
      console.error("Copy failed:", err);
    }
  };

  const handleSpeakMessage = (msg) => {
    const text = getSpeakText(msg);
    if (text) speak(text);
  };

  const handleDownloadMessage = async (msg, index) => {
    const type = (msg?.type || "").toLowerCase().trim();

    try {
      if (type === "download_link" && msg.content) {
        const fileUrl = buildFileUrl(msg.content);
        window.open(fileUrl, "_blank", "noopener,noreferrer");
        return;
      }

      if (CHAT_TYPES.has(type)) {
        await downloadChartPNG(index, msg);
        return;
      }

      if (MEDIA_TYPES.has(type)) {
        const raw = msg.content ?? msg.text ?? "";
        const src =
          typeof raw === "string" && raw.startsWith("data:")
            ? raw
            : `data:image/png;base64,${raw}`;

        const link = document.createElement("a");
        link.href = src;
        link.download = `${type || "media"}_${index + 1}.png`;
        link.click();
        return;
      }

      const text = getMessageText(msg);
      if (text) downloadTextFile(text, `${type || "message"}_${index + 1}.txt`);
    } catch (err) {
      console.error(err);
      alert("Download failed");
    }
  };

  const sendPptMessage = useCallback(
    async (messageToSend) => {
      const payload = buildPptPayload(messageToSend, "", "light", null);

      const res = await fetch(`${API_BASE_URL}/generate`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      const data = await readResponse(res);

      if (res.status === 401) {
        alert("Session expired. Please login again.");
        return null;
      }

      if (!res.ok) {
        const detail = data?.detail || data?.raw || `HTTP ${res.status}`;
        throw new Error(detail);
      }

      const fileUrl = buildFileUrl(data.download_url || data?.content?.download_url);
      const fileName = data.file_name || data?.content?.file_name || "presentation.pptx";

      if (!fileUrl) throw new Error("No download URL returned from backend");

      const botMessage = {
        sender: "bot",
        type: "download_link",
        text: `✅ Presentation ready: ${data.title || "Untitled Presentation"}\n📄 Slides: ${
          data.slides ?? data?.content?.slides ?? 0
        }\n⬇️ Click to download`,
        content: fileUrl,
        fileName,
      };

      setMessages((prev) => [...prev, botMessage]);

      try {
        await downloadBlobFromUrl(fileUrl, fileName);
      } catch (err) {
        console.error("Auto-download failed:", err);
      }

      return botMessage;
    },
    [token, downloadBlobFromUrl]
  );

  const sendChatMessage = useCallback(
    async (messageToSend) => {
      const res = await fetch(`${API_BASE_URL}/api/chat`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          message: messageToSend,
          mode,
          requestType: mode,
        }),
      });

      const contentType = res.headers.get("content-type") || "";
      const isFile = await handleFileResponse(res, contentType);
      if (isFile) return null;

      const data = await readResponse(res);

      if (res.status === 401) {
        alert("Session expired. Please login again.");
        return null;
      }

      if (!res.ok) {
        const detail = data?.detail || data?.raw || `HTTP ${res.status}`;
        throw new Error(detail);
      }

      if (data?.type === "file" && data?.content?.download_url) {
        const fileUrl = buildFileUrl(data.content.download_url);
        const fileName = data.content.file_name || "presentation.pptx";

        const botMessage = {
          sender: "bot",
          type: "download_link",
          text: `✅ Presentation ready: ${data.content.title || "Untitled Presentation"}\n📄 Slides: ${
            data.content.slides ?? 0
          }\n⬇️ Click to download`,
          content: fileUrl,
          fileName,
        };

        setMessages((prev) => [...prev, botMessage]);

        try {
          await downloadBlobFromUrl(fileUrl, fileName);
        } catch (err) {
          console.error("Auto-download failed:", err);
        }

        return botMessage;
      }

      const payload =
        data?.content ??
        data?.data ??
        data?.reply ??
        data?.result ??
        data?.message ??
        data?.payload ??
        null;

      const normalizedPayload = data?.type === "wiki" ? normalizeWikiData(payload) : payload;

      const botMessage = {
        sender: "bot",
        type: data?.type || (mode === "wiki" ? "wiki" : mode === "news" ? "news" : "text"),
        text: typeof normalizedPayload === "string" ? normalizedPayload : "",
        content: normalizedPayload,
      };

      setMessages((prev) => [...prev, botMessage].slice(-50));
      return botMessage;
    },
    [token, mode, handleFileResponse, downloadBlobFromUrl]
  );

  const sendMessage = useCallback(
    async (explicitText = null, options = {}) => {
      const messageToSend = (explicitText ?? input).trim();
      const isVoiceInput = options?.source === "voice";

      if (!messageToSend || loading) return;

      if (!token) {
        alert("Please login again.");
        return;
      }

      setMessages((prev) => [
        ...prev,
        { sender: "user", type: "text", text: messageToSend, mode },
      ]);

      setLoading(true);

      try {
        let botMessage = null;

        if (mode === "file") {
          botMessage = await sendPptMessage(messageToSend);
        } else {
          botMessage = await sendChatMessage(messageToSend);
        }

        if (isVoiceInput && botMessage) {
          const speakText = getSpeakText(botMessage);
          if (speakText) {
            setTimeout(() => speak(speakText), 250);
          }
        }
      } catch (error) {
        console.error(error);
        setMessages((prev) => [...prev, { sender: "bot", type: "text", text: "Server error ❌" }]);
      } finally {
        setLoading(false);
        setInput("");
      }
    },
    [input, loading, token, mode, sendPptMessage, sendChatMessage, speak]
  );

  const startListening = useCallback(() => {
    const recognition = recognitionRef.current;

    if (!recognition) {
      alert("Voice not supported in this browser");
      return;
    }
    if (!voiceEnabled) return;
    if (listening) return stopRecognition();
    if (isSpeakingRef.current) return;

    forceStopRef.current = false;
    setListening(true);

    recognition.onresult = (event) => {
      const speechText = event?.results?.[0]?.[0]?.transcript;
      if (!speechText) {
        setListening(false);
        return;
      }

      setListening(false);
      sendMessage(
        speechText.toLowerCase().replace(/\b(rupees|rs|rupee)\b/g, "").trim(),
        { source: "voice" }
      );
    };

    recognition.onerror = () => setListening(false);
    recognition.onend = () => {
      if (forceStopRef.current) return;
      setListening(false);
    };

    try {
      recognition.start();
    } catch (err) {
      setListening(false);
      console.error("Speech recognition start error:", err);
    }
  }, [listening, voiceEnabled, stopRecognition, sendMessage]);

  const toggleVoiceEnabled = () => {
    setVoiceEnabled((prev) => {
      const next = !prev;
      if (!next) {
        forceStopRef.current = true;
        stopRecognition();
        try {
          window.speechSynthesis?.cancel();
        } catch {}
      }
      return next;
    });
  };

  const getMicIcon = () => {
    if (listening) return "/speak.png";
    if (!voiceEnabled) return "/mic-off.png";
    return "/mic.png";
  };

  const handleMicClick = () => {
    if (!voiceEnabled) {
      setVoiceEnabled(true);
      setTimeout(startListening, 50);
      return;
    }
    startListening();
  };

  const placeholderMap = {
    chat: "Type your message...",
    news: "Ask for news, e.g. latest AI news",
    wiki: "Search Wikipedia, e.g. Alan Turing",
    file: "Describe the file you want to create...",
  };

  const openMode = (nextMode) => {
    setMode(nextMode);
    setPlusOpen(false);
  };

  const showLanding = messages.length === 0;

  return (
    <div style={styles.page}>
      <style>{`
        .chat-scroll::-webkit-scrollbar { width: 0; height: 0; }
        .chat-scroll { scrollbar-width: none; -ms-overflow-style: none; }
      `}</style>

      <header style={styles.topbar}>
        <div style={styles.brandBlock}>
          <div style={styles.brandBadge}>V</div>
          <div>
            <div style={styles.brandTitle}>Vitya.AI</div>
            <div style={styles.brandSub}>Smart assistant workspace</div>
          </div>
        </div>

        <div style={styles.topbarRight}>
          <div style={styles.modePill}>
            <span style={styles.statusDot} />
            {MODES.find((m) => m.key === mode)?.label || "Chat"} mode
          </div>

          <button
            onClick={() => setVoiceEnabled((v) => !v)}
            style={styles.topbarIconBtn}
            title={voiceEnabled ? "Voice on" : "Voice off"}
          >
            <img src={voiceEnabled ? "/mic.png" : "/mic-off.png"} alt="voice" style={styles.topbarIcon} />
          </button>
        </div>
      </header>

      <main style={styles.main}>
        <div style={styles.chatArea} className="chat-scroll">
          {showLanding ? (
            <section style={styles.emptyState}>
              <div style={styles.emptyCard}>
                <div style={styles.heroTitle}>What can I help you with today?</div>
                <div style={styles.heroSub}>
                  Ask anything, generate charts, search news or Wikipedia, and create files from the same workspace.
                </div>

                <div style={styles.promptGrid}>
                  {QUICK_PROMPTS.map((item) => (
                    <button key={item} style={styles.promptBtn} onClick={() => sendMessage(item)}>
                      {item}
                    </button>
                  ))}
                </div>
              </div>
            </section>
          ) : (
            messages.map((msg, i) => {
              const type = (msg.type || "").toLowerCase().trim();
              const chartElement = CHAT_TYPES.has(type) ? renderChart(msg) : null;
              const isUser = msg.sender === "user";

              return (
                <div
                  key={i}
                  style={{
                    ...styles.messageRow,
                    justifyContent: isUser ? "flex-end" : "flex-start",
                  }}
                >
                  <div
                    style={{
                      ...styles.messageStack,
                      alignItems: isUser ? "flex-end" : "flex-start",
                    }}
                  >
                    <div style={styles.messageMeta}>
                      <span style={styles.senderName}>{isUser ? "You" : "Vitya"}</span>
                      <span style={styles.senderDot} />
                    </div>

                    <div
                      style={{
                        ...styles.bubble,
                        ...(isUser ? styles.userBubble : styles.botBubble),
                      }}
                    >
                      {msg.type === "download_link" ? (
                        <div style={styles.downloadCard}>
                          <div style={styles.downloadTitle}>
                            {msg.text?.split("\n")[0] || "✅ Presentation ready"}
                          </div>

                          <div style={styles.downloadMeta}>
                            {(msg.text || "")
                              .split("\n")
                              .slice(1)
                              .map((line, idx) => (
                                <div key={idx}>{line}</div>
                              ))}
                          </div>

                          <button
                            type="button"
                            onClick={() => handleDownloadMessage(msg, i)}
                            style={styles.downloadLink}
                          >
                            ⬇️ Download PPT
                          </button>
                        </div>
                      ) : type === "news" ? (
                        <div ref={(el) => (chartRefs.current[i] = el)} style={styles.cardWrap}>
                          {renderNews(msg)}
                        </div>
                      ) : type === "wiki" ? (
                        <div ref={(el) => (chartRefs.current[i] = el)} style={styles.cardWrap}>
                          {renderWiki(msg)}
                        </div>
                      ) : MEDIA_TYPES.has(type) ? (
                        <div style={styles.stack}>
                          {(() => {
                            const raw = msg.content ?? msg.text ?? "";
                            const src =
                              typeof raw === "string" && raw.startsWith("data:")
                                ? raw
                                : `data:image/png;base64,${raw}`;

                            return src ? (
                              <img
                                src={src}
                                alt={type}
                                style={styles.mediaSmall}
                                onError={(e) => {
                                  e.currentTarget.style.display = "none";
                                }}
                              />
                            ) : (
                              <div style={styles.emptyText}>Invalid media data</div>
                            );
                          })()}
                        </div>
                      ) : CHAT_TYPES.has(type) ? (
                        <div ref={(el) => (chartRefs.current[i] = el)} style={styles.cardWrap}>
                          {chartElement || <div style={styles.emptyText}>No chart data</div>}
                        </div>
                      ) : (
                        <span style={{ whiteSpace: "pre-wrap" }}>
                          {typeof msg.text === "string" ? msg.text : JSON.stringify(msg.text)}
                        </span>
                      )}
                    </div>

                    {!isUser && (
                      <div style={styles.messageActions}>
                        <button onClick={() => handleCopyMessage(msg)} style={styles.actionBtn} title="Copy">
                          <img src="/copy.png" alt="copy" style={styles.iconTiny} />
                        </button>
                        <button onClick={() => handleSpeakMessage(msg)} style={styles.actionBtn} title="Speak">
                          <img src="/speak.png" alt="speak" style={styles.iconTiny} />
                        </button>
                        <button onClick={() => handleDownloadMessage(msg, i)} style={styles.actionBtn} title="Download">
                          <img src="/downloading.png" alt="download" style={styles.iconTiny} />
                        </button>
                        <button onClick={() => alert("Add action here")} style={styles.actionBtn} title="More">
                          <img src="/dots.png" alt="more" style={{ width: 10, height: 10 }} />
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              );
            })
          )}

          {loading && <div style={styles.typing}>Bot typing…</div>}
          <div ref={bottomRef} />
        </div>
      </main>

      <div style={styles.bottomDock}>
        <div style={styles.composerWrap} ref={menuRef}>
          {plusOpen && (
            <div style={styles.menuPanel}>
              {MODES.map((item) => (
                <button
                  key={item.key}
                  onClick={() => openMode(item.key)}
                  style={{
                    ...styles.menuItem,
                    background: mode === item.key ? "rgba(139,92,246,0.16)" : "transparent",
                  }}
                >
                  <div style={styles.menuItemLabel}>{item.label}</div>
                  <div style={styles.menuItemHint}>{item.hint}</div>
                </button>
              ))}
            </div>
          )}

          <div style={styles.composer}>
            <button onClick={() => setPlusOpen((v) => !v)} style={styles.iconBtn} title="More actions">
              <img src="/plus.png" alt="Plus" style={styles.iconMain} />
            </button>

            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder={placeholderMap[mode]}
              style={styles.input}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  sendMessage();
                }
              }}
            />

            <button
              onClick={handleMicClick}
              onContextMenu={(e) => {
                e.preventDefault();
                toggleVoiceEnabled();
              }}
              title="Click to talk. Right-click to turn voice on/off."
              style={{
                ...styles.iconBtn,
                background: listening ? "rgba(139,92,246,0.18)" : "rgba(255,255,255,0.04)",
                boxShadow: listening ? "0 0 0 6px rgba(139,92,246,0.12)" : "none",
              }}
            >
              <img src={getMicIcon()} alt="Mic" style={styles.iconMain} />
            </button>

            <button onClick={() => sendMessage()} style={{ ...styles.sendBtn, opacity: loading ? 0.75 : 1 }}>
              <img src="/send.png" alt="Send" style={styles.iconSend} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Chatbot;

/* -------------------------------------------------------
   Styles
------------------------------------------------------- */
const glass = "rgba(18, 24, 40, 0.72)";
const border = "1px solid rgba(255,255,255,0.10)";

const styles = {
  page: {
    width: "100%",
    height: "100vh",
    display: "flex",
    flexDirection: "column",
    overflow: "hidden",
    color: "#fff",
    background: "radial-gradient(circle at top, #1b2440 0%, #0b1020 55%, #090d18 100%)",
    fontFamily: "system-ui, -apple-system, BlinkMacSystemFont, Segoe UI, Roboto, sans-serif",
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
  topbarRight: { display: "flex", alignItems: "center", gap: 10 },
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
  stack: {
    display: "flex",
    flexDirection: "column",
    gap: 10,
    width: "100%",
  },
  topbarIconBtn: {
    width: 42,
    height: 42,
    borderRadius: "50%",
    border: "none",
    cursor: "pointer",
    background: "rgba(255,255,255,0.06)",
    display: "grid",
    placeItems: "center",
  },
  topbarIcon: { width: 18, height: 18 },
  main: { flex: 1, display: "flex", justifyContent: "center", overflow: "hidden", minHeight: 0 },
  chatArea: {
    width: "min(1120px, 100%)",
    padding: "18px 16px 170px",
    overflowY: "auto",
    display: "flex",
    flexDirection: "column",
    gap: 14,
    boxSizing: "border-box",
    minHeight: 0,
  },
  emptyState: { flex: 1, display: "grid", placeItems: "center", minHeight: "calc(100vh - 250px)" },
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
  },
  heroSub: {
    marginTop: 12,
    color: "rgba(255,255,255,0.74)",
    fontSize: 16,
    lineHeight: 1.7,
    maxWidth: 640,
    marginLeft: "auto",
    marginRight: "auto",
  },
  promptGrid: { marginTop: 22, display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: 12 },
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
  messageRow: { display: "flex", width: "100%" },
  messageStack: { display: "flex", flexDirection: "column", gap: 8, width: "fit-content", maxWidth: "100%" },
  messageMeta: { display: "flex", alignItems: "center", gap: 8, fontSize: 12, color: "rgba(255,255,255,0.66)" },
  senderName: { fontWeight: 700 },
  senderDot: { width: 5, height: 5, borderRadius: "50%", background: "rgba(255,255,255,0.35)" },
  bubble: {
    padding: 14,
    borderRadius: 20,
    wordBreak: "break-word",
    boxSizing: "border-box",
    maxWidth: "100%",
    border,
    boxShadow: "0 12px 30px rgba(0,0,0,0.16)",
    backdropFilter: "blur(12px)",
  },
  userBubble: { background: "linear-gradient(135deg, #8b5cf6 0%, #6366f1 100%)" },
  botBubble: { background: glass },
  cardWrap: {
    width: 540,
    maxWidth: "100%",
    overflow: "hidden",
    background: "rgba(255,255,255,0.97)",
    padding: 16,
    borderRadius: 18,
    boxSizing: "border-box",
    color: "#111827",
  },
  cardList: { display: "flex", flexDirection: "column", gap: 12 },
  infoCard: { display: "flex", flexDirection: "column", gap: 10, background: "#fff", borderRadius: 16, color: "#111827" },
  cardTitle: { fontWeight: 800, fontSize: 18, lineHeight: 1.3 },
  cardBody: { fontSize: 14, color: "#4b5563", lineHeight: 1.6 },
  link: { display: "inline-block", textDecoration: "none", color: "#4f46e5", fontWeight: 700 },
  mediaLarge: { width: "100%", height: 220, objectFit: "cover", borderRadius: 14 },
  mediaSmall: { width: "100%", maxWidth: 260, height: "auto", display: "block", borderRadius: 14 },
  emptyText: { color: "#64748b", fontSize: 14 },
  typing: { color: "rgba(255,255,255,0.72)", paddingLeft: 8, fontSize: 14 },
  bottomDock: {
    width: "calc(100% - var(--sidebar-width, 0px))",
    position: "fixed",
    bottom: 0,
    left: "var(--sidebar-width, 0px)",
    zIndex: 100,
    padding: "0 10px 10px",
    boxSizing: "border-box",
    display: "flex",
    justifyContent: "center",
    background: "linear-gradient(to top, #090d18 68%, transparent)",
  },
  composerWrap: { width: "min(1020px, 100%)", position: "relative", maxWidth: "100%" },
  menuPanel: {
    position: "absolute",
    left: 0,
    bottom: 88,
    width: 260,
    padding: 10,
    borderRadius: 20,
    background: "rgba(15, 20, 36, 0.96)",
    border: "1px solid rgba(255,255,255,0.10)",
    boxShadow: "0 18px 40px rgba(0,0,0,0.4)",
    backdropFilter: "blur(18px)",
    display: "grid",
    gap: 8,
  },
  menuItem: { width: "100%", textAlign: "left", border: "none", borderRadius: 14, padding: "10px 12px", color: "#fff", cursor: "pointer" },
  menuItemLabel: { fontSize: 14, fontWeight: 700, marginBottom: 3 },
  menuItemHint: { fontSize: 12, color: "rgba(255,255,255,0.65)" },
  composer: {
    width: "100%",
    minHeight: 76,
    display: "flex",
    alignItems: "center",
    gap: 10,
    padding: "12px 14px",
    borderRadius: 28,
    background: "rgba(15, 20, 36, 0.92)",
    border,
    boxShadow: "0 12px 30px rgba(0,0,0,0.38)",
    boxSizing: "border-box",
    backdropFilter: "blur(16px)",
  },
  iconBtn: {
    width: 48,
    height: 48,
    borderRadius: "50%",
    border: "none",
    background: "rgba(255,255,255,0.04)",
    color: "#fff",
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
  },
  iconMain: { width: 20, height: 20 },
  iconSend: { width: 18, height: 18 },
  iconTiny: { width: 10, height: 10 },
  input: {
    flex: 1,
    height: 48,
    border: "1px solid rgba(255,255,255,0.08)",
    outline: "none",
    borderRadius: 18,
    background: "rgba(255,255,255,0.04)",
    color: "#fff",
    padding: "0 16px",
    minWidth: 0,
    fontSize: 15,
  },
  sendBtn: {
    width: 48,
    height: 48,
    borderRadius: "50%",
    border: "none",
    background: "linear-gradient(135deg, #8b5cf6 0%, #6366f1 100%)",
    color: "#fff",
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
    boxShadow: "0 10px 22px rgba(99,102,241,0.32)",
  },
  messageActions: { display: "flex", gap: 8, flexWrap: "wrap", alignItems: "center", marginTop: 2 },
  actionBtn: {
    width: 32,
    height: 32,
    border: "none",
    borderRadius: 10,
    background: "rgba(255,255,255,0.10)",
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  heatmapGrid: { display: "grid", gridTemplateColumns: "repeat(7, minmax(0, 1fr))", gap: 4, width: "100%", boxSizing: "border-box" },
  heatCell: { height: 30, borderRadius: 6 },
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
  downloadTitle: { fontSize: 16, fontWeight: 800, lineHeight: 1.4, whiteSpace: "pre-line" },
  downloadMeta: { fontSize: 13, color: "#4b5563", lineHeight: 1.6, whiteSpace: "pre-line" },
  downloadLink: {
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    width: "fit-content",
    padding: "10px 14px",
    borderRadius: 12,
    border: "none",
    background: "linear-gradient(135deg, #8b5cf6 0%, #6366f1 100%)",
    color: "#fff",
    textDecoration: "none",
    fontWeight: 700,
    cursor: "pointer",
  },
};