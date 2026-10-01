import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import html2canvas from "html2canvas";
import ChatCharts from "./ChatCharts";
import ChatInput from "./ChatInput";
import FormattedMarkdown from "./FormattedMarkdown";
import { useNavigate } from "react-router-dom";
import { API_BASE_URL } from "../../services/api";
import {
  Copy,
  Check,
  Mic,
  Download,
  MoreVertical,
  Pencil,
  Files,
  Bookmark,
  Share2,
  Trash2,
  FileText,
  Sparkles,
  User,
  RotateCcw,
} from "lucide-react";

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

const PPT_DEFAULTS = {
  include_title_slide: true,
  include_agenda_slide: true,
  include_speaker_notes: true,
  use_web_search: true,
  use_ai_image_generation: true,
  smart_mode: true,
  allow_bullets: true,
  allow_chart: true,
  allow_image: true,
  allow_paragraph: true,
  allow_section_slide: true,
  allow_table: true,
  slide_count: 8,
  tone: "Professional",
  language: "English",
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

const getImageSrc = (rawInput) => {
  if (!rawInput) return "";

  let raw = safeJSON(rawInput);

  if (raw && typeof raw === "object" && !Array.isArray(raw)) {
    raw =
      raw.url ||
      raw.image ||
      raw.imageUrl ||
      raw.image_url ||
      raw.b64_json ||
      raw.b64 ||
      raw.data ||
      raw.content ||
      raw;
  }

  if (typeof raw !== "string") return "";

  const trimmed = raw.trim();
  if (!trimmed) return "";

  if (trimmed.startsWith("data:image/")) {
    return trimmed;
  }

  if (/^https?:\/\//i.test(trimmed)) {
    return trimmed;
  }

  if (trimmed.includes("/assets/")) {
    const assetRelative = "/assets/" + trimmed.split("/assets/").pop();
    return buildFileUrl(assetRelative);
  }

  if (trimmed.startsWith("/") || trimmed.startsWith("./") || trimmed.includes("/")) {
    return buildFileUrl(trimmed);
  }

  const cleanB64 = trimmed.replace(/\s/g, "");
  return `data:image/png;base64,${cleanB64}`;
};

const parsePythonLiteral = (input) => {
  if (typeof input !== "string") return input;
  const str = input.trim();
  if (!str) return input;

  let i = 0;

  const skipWhitespace = () => {
    while (i < str.length && /\s/.test(str[i])) {
      i++;
    }
  };

  const parseValue = () => {
    skipWhitespace();
    if (i >= str.length) return undefined;

    const ch = str[i];

    if (ch === "[") {
      i++;
      const list = [];
      skipWhitespace();
      if (str[i] === "]") {
        i++;
        return list;
      }
      while (i < str.length) {
        const val = parseValue();
        list.push(val);
        skipWhitespace();
        if (str[i] === ",") {
          i++;
          skipWhitespace();
          if (str[i] === "]") {
            i++;
            break;
          }
        } else if (str[i] === "]") {
          i++;
          break;
        } else {
          break;
        }
      }
      return list;
    }

    if (ch === "{") {
      i++;
      const obj = {};
      skipWhitespace();
      if (str[i] === "}") {
        i++;
        return obj;
      }
      while (i < str.length) {
        const key = parseValue();
        skipWhitespace();
        if (str[i] === ":") {
          i++;
        }
        const val = parseValue();
        if (key !== undefined) {
          obj[String(key)] = val;
        }
        skipWhitespace();
        if (str[i] === ",") {
          i++;
          skipWhitespace();
          if (str[i] === "}") {
            i++;
            break;
          }
        } else if (str[i] === "}") {
          i++;
          break;
        } else {
          break;
        }
      }
      return obj;
    }

    if (ch === "'" || ch === '"') {
      const quote = ch;
      i++;
      let result = "";
      while (i < str.length) {
        const char = str[i];
        if (char === "\\") {
          i++;
          if (i < str.length) {
            const nextChar = str[i];
            if (nextChar === "n") result += "\n";
            else if (nextChar === "t") result += "\t";
            else if (nextChar === "r") result += "\r";
            else result += nextChar;
            i++;
          }
        } else if (char === quote) {
          i++;
          break;
        } else {
          result += char;
          i++;
        }
      }
      return result;
    }

    if (str.startsWith("None", i)) {
      i += 4;
      return null;
    }
    if (str.startsWith("True", i)) {
      i += 4;
      return true;
    }
    if (str.startsWith("False", i)) {
      i += 5;
      return false;
    }
    if (str.startsWith("null", i)) {
      i += 4;
      return null;
    }
    if (str.startsWith("true", i)) {
      i += 4;
      return true;
    }
    if (str.startsWith("false", i)) {
      i += 5;
      return false;
    }

    const numMatch = str.slice(i).match(/^-?\d+(?:\.\d+)?(?:[eE][+-]?\d+)?/);
    if (numMatch) {
      i += numMatch[0].length;
      return Number(numMatch[0]);
    }

    const wordMatch = str.slice(i).match(/^[a-zA-Z_]\w*/);
    if (wordMatch) {
      i += wordMatch[0].length;
      return wordMatch[0];
    }

    i++;
    return undefined;
  };

  try {
    const res = parseValue();
    return res !== undefined ? res : input;
  } catch {
    return input;
  }
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
      try {
        const parsedPy = parsePythonLiteral(trimmed);
        if (parsedPy !== trimmed) return parsedPy;
      } catch {}
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

const normalizeNewsData = (raw) => {
  if (Array.isArray(raw)) return raw;

  const parsed = safeJSON(raw);

  if (Array.isArray(parsed)) return parsed;

  if (parsed && typeof parsed === "object") {
    if (Array.isArray(parsed.articles)) return parsed.articles;
    if (Array.isArray(parsed.content)) return parsed.content;
    if (Array.isArray(parsed.data)) return parsed.data;
    if (Array.isArray(parsed.results)) return parsed.results;
    if (Array.isArray(parsed.news)) return parsed.news;
  }

  return [];
};

const isChartData = (raw) => {
  if (!raw) return false;
  const parsed = safeJSON(raw);
  if (!parsed) return false;

  let list = null;
  if (Array.isArray(parsed)) {
    list = parsed;
  } else if (typeof parsed === "object") {
    if (Array.isArray(parsed.data)) list = parsed.data;
    else if (Array.isArray(parsed.items)) list = parsed.items;
    else if (Array.isArray(parsed.chartData)) list = parsed.chartData;
    else if (Array.isArray(parsed.rows)) list = parsed.rows;
  }

  if (!list || !Array.isArray(list) || !list.length) return false;

  const first = list[0];
  if (!first || typeof first !== "object" || Array.isArray(first)) return false;

  if (first.url || (first.description && typeof first.description === "string" && first.description.length > 30)) {
    return false;
  }

  const keys = Object.keys(first);
  if (!keys.length) return false;

  const hasNumericVal = keys.some((k) => {
    const v = first[k];
    return typeof v === "number" || (!isNaN(parseFloat(v)) && isFinite(v));
  });

  const hasLabelKey = keys.some((k) => {
    const keyLower = k.toLowerCase();
    const isKnownKey = ["category", "month", "name", "label", "x", "item", "type", "title", "year"].includes(keyLower);
    return isKnownKey || typeof first[k] === "string";
  });

  return hasNumericVal && hasLabelKey;
};

const readResponse = async (res) => {
  const text = await res.text();
  const contentType = res.headers.get("content-type") || "";

  if (contentType.includes("application/json")) {
    try {
      return JSON.parse(text);
    } catch {
      return { text: "Server returned an unexpected format. Please try again." };
    }
  }

  try {
    return JSON.parse(text);
  } catch {
    if (text.trim().startsWith("<")) {
      return { text: `Server error (${res.status || "500"}). Please try again later.` };
    }
    return { raw: text, text };
  }
};

const detectPptOptionsFromPrompt = (promptText = "") => {
  const text = String(promptText || "").toLowerCase();

  // 1. Language Detection (Detects Hindi Devanagari, Hinglish conversational words, or explicit language names)
  let language = "English";
  const containsDevanagari = /[\u0900-\u097F]/.test(promptText);
  if (containsDevanagari || /\bhindi\b/i.test(text)) {
    language = "Hindi";
  } else if (
    /\bhinglish\b/i.test(text) ||
    /\b(banao|bana|karo|batao|par|aur|kaise|kya|hai|chahiye|sabkuch|lekin|mera|tera|hata|hatao|samjhao)\b/i.test(text)
  ) {
    language = "Hinglish";
  } else if (/\b(spanish|español)\b/i.test(text)) {
    language = "Spanish";
  } else if (/\b(french|français)\b/i.test(text)) {
    language = "French";
  } else if (/\b(german|deutsch)\b/i.test(text)) {
    language = "German";
  }

  // 2. Tone Detection (Detects Inspiring, Educational, Formal, or Default Professional)
  let tone = "Professional";
  if (/\b(inspiring|energetic|motivation|motivational|startup|pitch)\b/i.test(text)) {
    tone = "Inspiring";
  } else if (/\b(educational|detailed|tutorial|student|lecture|guide|explain|school|college)\b/i.test(text)) {
    tone = "Educational";
  } else if (/\b(formal|executive|c-suite|ceo|board|corporate|management)\b/i.test(text)) {
    tone = "Formal";
  }

  // 3. Slide Count Detection (e.g. 10 slides, 8 slide, 15 slides, 20 slides)
  let slideCount = 8;
  const matchCount = text.match(/\b(\d{1,2})\s*slide(s)?\b/i);
  if (matchCount && matchCount[1]) {
    const num = parseInt(matchCount[1], 10);
    if (!isNaN(num)) {
      const presets = [6, 8, 10, 15, 20, 25, 30];
      const clamped = Math.min(30, Math.max(3, num));
      slideCount = presets.reduce((prev, curr) => (Math.abs(curr - clamped) < Math.abs(prev - clamped) ? curr : prev));
    }
  }

  return { language, tone, slide_count: slideCount };
};

const buildPptPayload = (prompt, templateName, backgroundTheme, slideTypesRaw) => {
  const slideTypes = (slideTypesRaw || "")
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);

  const detected = detectPptOptionsFromPrompt(prompt);

  return {
    prompt: (prompt || "").trim(),
    template_name: (templateName || "").trim() || null,
    ...PPT_DEFAULTS,
    language: detected.language,
    tone: detected.tone,
    slide_count: detected.slide_count,
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
    if (data && typeof data === "object") {
      return data.content || data.reply || JSON.stringify(data, null, 2);
    }
    return "";
  }

  if (type === "news") {
    const data = normalizeNewsData(raw);

    if (!data.length) return "News response";

    return data
      .slice(0, 5)
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

  if (type === "news") {
    const data = normalizeNewsData(msg?.content ?? msg?.text ?? msg?.data ?? []);
    if (!data.length) return "No news available.";
    return data
      .slice(0, 3)
      .map((item, i) => `${i + 1}. ${item?.title || "Untitled news"}`)
      .join(". ");
  }

  if (type === "wiki") return text;
  if (type === "download_link") return "Presentation is ready. Click to download.";
  if (CHAT_TYPES.has(type)) return "Chart response received.";
  if (MEDIA_TYPES.has(type)) return "Media response received.";
  return text;
};

/* -------------------------------------------------------
   Component
------------------------------------------------------- */
const Chatbot = ({ conversationId, onConversationChange, onConversationUpdated }) => {
  const navigate = useNavigate();
  const [messages, setMessages] = useState([]);

  const token = useMemo(() => {
    try {
      return localStorage.getItem("token") || "";
    } catch {
      return "";
    }
  }, []);

  const handleEditPresentation = (msg) => {
    try {
      const planToSave = msg?.plan || {
        title: msg?.title || "Presentation Deck",
        slides: [
          {
            title: `Introduction to ${msg?.title || "Presentation"}`,
            subtitle: "Key Overview & Strategic Insights",
            layout: "title_content",
            plugins: [
              { type: "subtitle", data: { text: "Executive Summary" } },
              { type: "bullets", data: { points: ["Overview & Strategic Objectives", "System Architecture & Workflows", "Key Insights & Next Steps"] } }
            ]
          }
        ]
      };
      localStorage.setItem("vitya_ppt_saved_plan_v2", JSON.stringify(planToSave));
      localStorage.setItem("vitya_ppt_saved_step_v2", "2");
    } catch (e) {
      console.warn("Failed to set presentation state in localStorage", e);
    }
    navigate("/presentation");
  };
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [listening, setListening] = useState(false);
  const [voiceEnabled, setVoiceEnabled] = useState(true);
  const [plusOpen, setPlusOpen] = useState(false);
  const [mode, setMode] = useState("chat");
  const [useWebSearch, setUseWebSearch] = useState(true);
  const [ragDocs, setRagDocs] = useState([]);
  const [activeMoreIndex, setActiveMoreIndex] = useState(null);
  const [copiedIndex, setCopiedIndex] = useState(null);
  const [toastMessage, setToastMessage] = useState(null);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (!e.target.closest(".vitya-more-wrap")) {
        setActiveMoreIndex(null);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleDocumentFileUpload = async (e) => {
    const files = Array.from(e.target.files || []);
    if (!files.length) return;

    const formData = new FormData();
    if (conversationId) formData.append("conversation_id", conversationId);
    files.forEach((f) => formData.append("files", f));

    try {
      setLoading(true);
      const res = await fetch(`${API_BASE_URL}/api/rag/upload`, {
        method: "POST",
        headers: token ? { Authorization: `Bearer ${token}` } : {},
        body: formData,
      });

      if (!res.ok) throw new Error(`Upload failed: ${res.status}`);
      const data = await res.json();
      setRagDocs(data.documents || []);

      const docNames = files.map((f) => f.name).join(", ");
      setMessages((prev) => [
        ...prev,
        {
          sender: "bot",
          type: "text",
          text: `📑 Successfully indexed document(s) for Q&A: **${docNames}**!\nYou can now ask any question about the content of these reports or files.`,
        },
      ]);
    } catch (err) {
      console.error("Document upload failed:", err);
      alert("Failed to upload document for Q&A.");
    } finally {
      setLoading(false);
    }
  };

  const handleClearRagDocs = async () => {
    try {
      await fetch(`${API_BASE_URL}/api/rag/documents${conversationId ? `?conversation_id=${conversationId}` : ""}`, {
        method: "DELETE",
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      });
      setRagDocs([]);
    } catch (err) {
      console.error("Clear documents failed:", err);
    }
  };

  const bottomRef = useRef(null);
  const recognitionRef = useRef(null);
  const isSpeakingRef = useRef(false);
  const chartRefs = useRef({});
  const forceStopRef = useRef(false);
  const menuRef = useRef(null);

  useEffect(() => {
    let cancelled = false;

    const loadConversation = async () => {
      if (!conversationId) {
        setMessages([]);
        return;
      }

      try {
        const response = await fetch(`${API_BASE_URL}/api/chat/history?conversation_id=${conversationId}`, {
          headers: token ? { Authorization: `Bearer ${token}` } : {},
        });
        if (!response.ok) throw new Error("Unable to load conversation");
        const data = await response.json();
        if (cancelled) return;
        setMessages((data.messages || []).map((message) => {
          const rawContent = message.content || "";
          const parsed = safeJSON(rawContent);
          const newsData = normalizeNewsData(parsed);
          let msgType = "text";
          if (
            Array.isArray(newsData) &&
            newsData.length > 0 &&
            newsData[0] &&
            typeof newsData[0] === "object" &&
            (newsData[0].title || newsData[0].name) &&
            (newsData[0].url || newsData[0].description)
          ) {
            msgType = "news";
          } else if (isChartData(parsed)) {
            msgType = "bar";
          }
          return {
            sender: message.role === "user" ? "user" : "bot",
            type: msgType,
            text: typeof rawContent === "string" ? rawContent : JSON.stringify(rawContent),
            content: parsed,
          };
        }));
      } catch (error) {
        if (!cancelled) {
          console.error(error);
          setMessages([]);
        }
      }
    };

    loadConversation();
    return () => { cancelled = true; };
  }, [conversationId, token]);

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
    const raw = msg.content ?? msg.text ?? msg.data ?? [];
    const data = normalizeNewsData(raw);

    if (!data.length) return <div style={styles.emptyText}>No news available</div>;

    return (
      <div style={styles.newsContainer}>
        <div style={styles.newsHeader}>
          <span style={styles.newsHeaderBadge}>⚡ TOP HEADLINES</span>
          <span style={styles.newsCount}>{data.length} Articles</span>
        </div>
        <div style={styles.cardList}>
          {data.map((item, i) => {
            const rawSource = item?.source || item?.author;
            const sourceName = typeof rawSource === "object" ? rawSource?.name || "News" : rawSource || "News";
            const published = item?.publishedAt
              ? new Date(item.publishedAt).toLocaleDateString("en-IN", { month: "short", day: "numeric" })
              : null;

            return (
              <div key={i} className="vitya-news-card" style={styles.newsCard}>
                {item?.image ? (
                  <div style={styles.mediaContainer}>
                    <img
                      src={item.image}
                      alt={item.title || "news"}
                      style={styles.mediaLarge}
                      onError={(e) => {
                        e.currentTarget.parentElement.style.display = "none";
                      }}
                    />
                    <div style={styles.mediaBadgeGroup}>
                      <span style={styles.sourceBadge}>{sourceName}</span>
                      {published && <span style={styles.dateBadge}>{published}</span>}
                    </div>
                  </div>
                ) : (
                  <div style={styles.noImageBadgeGroup}>
                    <span style={styles.sourceBadge}>{sourceName}</span>
                    {published && <span style={styles.dateBadge}>{published}</span>}
                  </div>
                )}

                <div style={styles.newsCardContent}>
                  <h3 style={styles.cardTitle}>{item?.title || "No title"}</h3>
                  {item?.description ? <p style={styles.cardBody}>{item.description}</p> : null}
                  {item?.url ? (
                    <a
                      href={item.url}
                      target="_blank"
                      rel="noreferrer"
                      className="vitya-action-btn"
                      style={styles.actionLinkBtn}
                    >
                      Read Full Article <span style={{ marginLeft: 6 }}>↗</span>
                    </a>
                  ) : null}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  }, []);

  const renderWiki = useCallback((msg) => {
    const data = normalizeWikiData(msg.content ?? msg.text ?? msg.data ?? {});
    if (!data.title && !data.summary && !data.url && !data.image) {
      return <div style={styles.emptyText}>No Wikipedia data available</div>;
    }

    return (
      <div style={styles.wikiCard}>
        <div style={styles.wikiHeader}>
          <span style={styles.wikiBadge}>🌐 WIKIPEDIA KNOWLEDGE</span>
        </div>
        {data.image ? (
          <div style={styles.mediaContainer}>
            <img
              src={data.image}
              alt={data.title || "wikipedia"}
              style={styles.mediaLarge}
              onError={(e) => {
                e.currentTarget.parentElement.style.display = "none";
              }}
            />
          </div>
        ) : null}
        <div style={styles.newsCardContent}>
          <h3 style={styles.cardTitle}>{data.title}</h3>
          <p style={styles.cardBody}>{data.summary || "No summary available"}</p>
          {data.url ? (
            <a
              href={data.url}
              target="_blank"
              rel="noreferrer"
              className="vitya-action-btn"
              style={styles.actionLinkBtn}
            >
              Read Article on Wikipedia <span style={{ marginLeft: 6 }}>↗</span>
            </a>
          ) : null}
        </div>
      </div>
    );
  }, []);

  const renderChart = useCallback(
    (msg) => <ChatCharts msg={msg} />,
    []
  );

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 2500);
  };

  const handleCopyMessage = async (msg, index) => {
    const text = getMessageText(msg);
    if (!text) return;
    try {
      await navigator.clipboard.writeText(text);
      setCopiedIndex(index);
      showToast("Message copied to clipboard!");
      setTimeout(() => setCopiedIndex(null), 2000);
    } catch (err) {
      console.error("Copy failed:", err);
    }
  };

  const handleSpeakMessage = (msg) => {
    const text = getSpeakText(msg);
    if (text) {
      if (isSpeakingRef.current) {
        window.speechSynthesis.cancel();
        isSpeakingRef.current = false;
      } else {
        speak(text);
      }
    }
  };

  const handleRenameMessage = (index) => {
    const currentMsg = messages[index];
    const currentText = getMessageText(currentMsg);
    const newText = window.prompt("Rename message content:", currentText);
    if (newText !== null && newText.trim() !== "") {
      setMessages((prev) =>
        prev.map((m, idx) => (idx === index ? { ...m, text: newText } : m))
      );
      showToast("Message updated!");
    }
    setActiveMoreIndex(null);
  };

  const handleDuplicateMessage = (index) => {
    setMessages((prev) => {
      const newArr = [...prev];
      const dup = { ...newArr[index], id: Date.now() + Math.random() };
      newArr.splice(index + 1, 0, dup);
      return newArr;
    });
    showToast("Message duplicated!");
    setActiveMoreIndex(null);
  };

  const handleSaveToLibrary = (msg) => {
    try {
      const saved = JSON.parse(localStorage.getItem("vitya_saved_library") || "[]");
      saved.unshift({
        id: Date.now(),
        savedAt: new Date().toISOString(),
        type: msg.type || "text",
        content: getMessageText(msg) || "",
      });
      localStorage.setItem("vitya_saved_library", JSON.stringify(saved.slice(0, 100)));
      showToast("Saved to Library!");
    } catch (e) {
      console.error(e);
    }
    setActiveMoreIndex(null);
  };

  const handleShareMessage = async (msg) => {
    const text = getMessageText(msg);
    if (navigator.share) {
      try {
        await navigator.share({
          title: "Vitya AI Message",
          text: text || "Check out this response from Vitya AI",
        });
        setActiveMoreIndex(null);
        return;
      } catch (e) {}
    }
    try {
      await navigator.clipboard.writeText(text || window.location.href);
      showToast("Link/Text copied to clipboard!");
    } catch (e) {}
    setActiveMoreIndex(null);
  };

  const handleDeleteMessage = (index) => {
    setMessages((prev) => prev.filter((_, idx) => idx !== index));
    showToast("Message deleted!");
    setActiveMoreIndex(null);
  };

  const handleExportPDF = async (msg, index) => {
    try {
      const text = getMessageText(msg);
      const res = await fetch(`${API_BASE_URL}/chat/export`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ format: "pdf", messages: [msg] }),
      });
      if (res.ok) {
        await downloadBlobFromResponse(res, `vitya_message_${index + 1}.pdf`);
        showToast("PDF downloaded!");
      } else {
        downloadTextFile(text || "", `message_${index + 1}.txt`);
        showToast("Exported as file!");
      }
    } catch (err) {
      downloadTextFile(getMessageText(msg) || "", `message_${index + 1}.txt`);
      showToast("Exported as file!");
    }
    setActiveMoreIndex(null);
  };

  const handleRewriteUserMessage = (msg, index) => {
    const text = getMessageText(msg) || msg.text || "";
    setInput(text);
    // Remove the previous user message and its subsequent bot reply
    setMessages((prev) => prev.slice(0, index));
    showToast("Previous reply removed & prompt loaded to rewrite!");
    setTimeout(() => {
      const inputEl =
        document.querySelector(".chat-input textarea") ||
        document.querySelector("textarea") ||
        document.querySelector("input[type='text']");
      if (inputEl) {
        inputEl.focus();
        inputEl.scrollIntoView({ behavior: "smooth", block: "center" });
      }
    }, 100);
  };

  const handleDownloadMessage = async (msg, index) => {
    const type = (msg?.type || "").toLowerCase().trim();

    try {
      if (type === "download_link" && msg.content) {
        const fileUrl = buildFileUrl(msg.content);
        const fileName = msg.fileName || "presentation.pptx";
        await downloadBlobFromUrl(fileUrl, fileName);
        return;
      }

      if (CHAT_TYPES.has(type)) {
        await downloadChartPNG(index, msg);
        return;
      }

      if (MEDIA_TYPES.has(type)) {
        const raw = msg.content ?? msg.text ?? msg.data ?? "";
        const src = getImageSrc(raw);
        if (!src) return;

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
      payload.use_web_search = useWebSearch;

      const res = await fetch(`${API_BASE_URL}/api/presentation/generate`, {
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
      const plan = data.plan || data?.content?.plan || null;
      const title = data.title || data?.content?.title || messageToSend || "Presentation Deck";
      const slidesCount = data.slides_count ?? data.slides ?? data?.content?.slides ?? 6;

      if (!fileUrl) throw new Error("No download URL returned from backend");

      const botMessage = {
        sender: "bot",
        type: "download_link",
        title: title,
        slidesCount: slidesCount,
        content: fileUrl,
        fileName,
        plan: plan,
        text: `✅ Presentation ready: ${title}\n📄 Slides: ${slidesCount}\n⬇️ Click to download`,
      };

      setMessages((prev) => [...prev, botMessage]);

      return botMessage;
    },
    [token, useWebSearch]
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
          conversation_id: conversationId || undefined,
          use_web_search: useWebSearch,
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
        const title = data.content.title || data.title || "Presentation Deck";
        const slidesCount = data.content.slides ?? data.slides_count ?? 6;
        const plan = data.content.plan || data.plan || null;

        const botMessage = {
          sender: "bot",
          type: "download_link",
          title: title,
          slidesCount: slidesCount,
          content: fileUrl,
          fileName,
          plan: plan,
          text: `✅ Presentation ready: ${title}\n📄 Slides: ${slidesCount}\n⬇️ Click to download`,
        };

        setMessages((prev) => [...prev, botMessage]);

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

      let normalizedPayload = payload;

      if (data?.type === "wiki") {
        normalizedPayload = normalizeWikiData(payload);
      }

      if (data?.type === "news") {
        normalizedPayload = normalizeNewsData(payload);
      }

      const botMessage = {
        sender: "bot",
        type: data?.type || (mode === "wiki" ? "wiki" : mode === "news" ? "news" : isChartData(normalizedPayload) ? "bar" : "text"),
        text: typeof normalizedPayload === "string" ? normalizedPayload : "",
        content: normalizedPayload,
      };

      setMessages((prev) => [...prev, botMessage].slice(-50));
      if (data?.conversation_id) onConversationChange?.(data.conversation_id);
      onConversationUpdated?.();
      return botMessage;
    },
    [token, mode, conversationId, useWebSearch, handleFileResponse, onConversationChange, onConversationUpdated]
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

        const isPresentationSlash = /^\/(presentation|ppt)\b/i.test(messageToSend);
        if (mode === "file" || isPresentationSlash) {
          const pptTopic = isPresentationSlash
            ? messageToSend.replace(/^\/(presentation|ppt)\s*/i, "").trim()
            : messageToSend;
          botMessage = await sendPptMessage(pptTopic || "Presentation Deck");
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
        console.error("Chatbot error:", error);
        const errorText = error?.message ? `Server error: ${error.message}` : "Server error....";
        setMessages((prev) => [...prev, { sender: "bot", type: "text", text: errorText }]);
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

  const openMode = (nextMode) => {
    if (nextMode === "websearch") {
      setUseWebSearch((v) => !v);
      setMode("chat");
    } else {
      setMode(nextMode);
    }
    setPlusOpen(false);
  };

  const showLanding = messages.length === 0;

  return (
    <div style={styles.page}>
      <style>{`
        .chat-scroll::-webkit-scrollbar { width: 0; height: 0; }
        .chat-scroll { scrollbar-width: none; -ms-overflow-style: none; }
        .vitya-news-card:hover {
          transform: translateY(-3px);
          border-color: rgba(168, 85, 247, 0.45) !important;
          box-shadow: 0 16px 40px rgba(139, 92, 246, 0.25) !important;
        }
        .vitya-news-card:hover img {
          transform: scale(1.03);
        }
        .vitya-action-btn:hover {
          background: linear-gradient(135deg, #8b5cf6 0%, #6366f1 100%) !important;
          color: #ffffff !important;
          box-shadow: 0 6px 20px rgba(99, 102, 241, 0.45) !important;
          border-color: transparent !important;
        }

        .vitya-msg-actions-row {
          display: flex;
          align-items: flex-start;
          gap: 16px;
          margin-top: 8px;
          padding: 4px 2px;
          position: relative;
        }

        .vitya-action-unit {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 4px;
          cursor: pointer;
          user-select: none;
        }

        .vitya-user-msg-actions-row {
          display: flex;
          align-items: center;
          justify-content: flex-end;
          gap: 12px;
          margin-top: 5px;
          padding: 2px 2px;
          width: 100%;
        }

        .vitya-action-round-btn-sm {
          width: 28px;
          height: 28px;
          border-radius: 50%;
          background: rgba(30, 41, 59, 0.65);
          border: 1px solid rgba(255, 255, 255, 0.12);
          color: #cbd5e1;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
          padding: 0;
          box-shadow: 0 4px 10px rgba(0, 0, 0, 0.25);
        }

        .vitya-action-unit:hover .vitya-action-round-btn-sm,
        .vitya-action-round-btn-sm:hover {
          background: rgba(51, 65, 85, 0.9);
          border-color: rgba(139, 92, 246, 0.5);
          color: #ffffff;
          transform: translateY(-2px);
          box-shadow: 0 6px 14px rgba(99, 102, 241, 0.3);
        }

        .vitya-action-round-btn {
          width: 36px;
          height: 36px;
          border-radius: 50%;
          background: rgba(30, 41, 59, 0.65);
          border: 1px solid rgba(255, 255, 255, 0.12);
          color: #cbd5e1;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
          padding: 0;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.25);
        }

        .vitya-action-unit:hover .vitya-action-round-btn,
        .vitya-action-round-btn:hover {
          background: rgba(51, 65, 85, 0.9);
          border-color: rgba(139, 92, 246, 0.5);
          color: #ffffff;
          transform: translateY(-2px);
          box-shadow: 0 6px 16px rgba(99, 102, 241, 0.3);
        }

        .vitya-action-round-btn.active {
          background: rgba(99, 102, 241, 0.35);
          border-color: #818cf8;
          color: #ffffff;
          box-shadow: 0 0 16px rgba(129, 140, 248, 0.4);
        }

        .vitya-action-label {
          font-size: 11px;
          font-weight: 500;
          color: #94a3b8;
          text-align: center;
          transition: color 0.15s ease;
          letter-spacing: 0.01em;
        }

        .vitya-action-unit:hover .vitya-action-label {
          color: #e2e8f0;
        }

        .vitya-more-wrap {
          position: relative;
        }

        .vitya-more-dropdown {
          position: absolute;
          top: -8px;
          left: calc(100% + 12px);
          background: rgba(13, 17, 28, 0.97);
          backdrop-filter: blur(20px);
          -webkit-backdrop-filter: blur(20px);
          border: 1px solid rgba(255, 255, 255, 0.14);
          border-radius: 14px;
          padding: 6px;
          min-width: 175px;
          box-shadow: 0 18px 40px rgba(0, 0, 0, 0.75), 0 0 24px rgba(99, 102, 241, 0.18);
          z-index: 250;
          animation: vityaPopIn 0.18s cubic-bezier(0.16, 1, 0.3, 1);
        }

        .vitya-more-dropdown::before {
          content: '';
          position: absolute;
          left: -6px;
          top: 20px;
          width: 10px;
          height: 10px;
          background: rgba(13, 17, 28, 0.97);
          border-left: 1px solid rgba(255, 255, 255, 0.14);
          border-bottom: 1px solid rgba(255, 255, 255, 0.14);
          transform: rotate(45deg);
        }

        @keyframes vityaPopIn {
          0% {
            opacity: 0;
            transform: scale(0.92) translateX(-6px);
          }
          100% {
            opacity: 1;
            transform: scale(1) translateX(0);
          }
        }

        .vitya-more-item {
          display: flex;
          align-items: center;
          gap: 10px;
          width: 100%;
          padding: 8px 12px;
          font-size: 13px;
          font-weight: 500;
          color: #cbd5e1;
          background: transparent;
          border: none;
          border-radius: 8px;
          cursor: pointer;
          text-align: left;
          transition: all 0.15s ease;
          box-sizing: border-box;
        }

        .vitya-more-item .vitya-item-icon {
          color: #94a3b8;
          transition: color 0.15s ease;
          flex-shrink: 0;
        }

        .vitya-more-item:hover {
          background: rgba(255, 255, 255, 0.08);
          color: #ffffff;
        }

        .vitya-more-item:hover .vitya-item-icon {
          color: #ffffff;
        }

        .vitya-more-item.delete:hover {
          background: rgba(239, 68, 68, 0.15);
          color: #f87171;
        }

        .vitya-more-item.delete:hover .vitya-item-icon {
          color: #f87171;
        }

        .vitya-more-divider {
          height: 1px;
          background: rgba(255, 255, 255, 0.08);
          margin: 5px 4px;
        }

        @media (max-width: 600px) {
          .vitya-more-dropdown {
            left: auto;
            right: 0;
            top: calc(100% + 10px);
          }
          .vitya-more-dropdown::before {
            left: auto;
            right: 14px;
            top: -6px;
            border-left: none;
            border-bottom: none;
            border-top: 1px solid rgba(255, 255, 255, 0.14);
            border-left: 1px solid rgba(255, 255, 255, 0.14);
          }
        }
      `}</style>

      <header>
      </header>

      <main style={styles.main}>
        <div style={styles.chatArea} className="chat-scroll">
          {showLanding ? (
            <section style={styles.emptyState}>
              <div style={styles.emptyCard}>
                <div style={styles.heroTitle}>What can I help you with today?</div>
                <p className="vitya-chat-hero-sub">
                  Ask any question, brainstorm ideas, debug code, or generate slide decks in seconds.
                </p>

                <div className="vitya-chat-starter-grid">
                  <div
                    className="vitya-starter-card"
                    onClick={() => sendMessage("Explain Recursion with a clear Python code example")}
                  >
                    <div className="starter-icon-box bg-purple">💡</div>
                    <div className="starter-card-body">
                      <h4>Brainstorm & Learn</h4>
                      <p>Explain Recursion with code example</p>
                    </div>
                  </div>

                  <div
                    className="vitya-starter-card"
                    onClick={() => sendMessage("Debug and optimize Python code for web scraping")}
                  >
                    <div className="starter-icon-box bg-blue">💻</div>
                    <div className="starter-card-body">
                      <h4>Code & Debug</h4>
                      <p>Debug Python scraping script</p>
                    </div>
                  </div>

                  <div
                    className="vitya-starter-card"
                    onClick={() => {
                      openMode("wiki");
                      sendMessage("Quantum Computing");
                    }}
                  >
                    <div className="starter-icon-box bg-teal">🌐</div>
                    <div className="starter-card-body">
                      <h4>Search Knowledge</h4>
                      <p>Wikipedia: Quantum Computing</p>
                    </div>
                  </div>

                  <div
                    className="vitya-starter-card"
                    onClick={() => {
                      openMode("file");
                      sendMessage("Artificial Intelligence Trends");
                    }}
                  >
                    <div className="starter-icon-box bg-rose">📺</div>
                    <div className="starter-card-body">
                      <h4>Create Presentation</h4>
                      <p>Generate deck: AI Trends</p>
                    </div>
                  </div>
                </div>
              </div>
            </section>
          ) : (
            messages.map((msg, i) => {
              let type = (msg.type || "").toLowerCase().trim();
              const rawData = msg.content ?? msg.text ?? msg.data;
              const newsData = normalizeNewsData(rawData);
              if (
                type !== "news" &&
                Array.isArray(newsData) &&
                newsData.length > 0 &&
                newsData[0] &&
                typeof newsData[0] === "object" &&
                (newsData[0].title || newsData[0].name) &&
                (newsData[0].url || newsData[0].description)
              ) {
                type = "news";
              } else if (!CHAT_TYPES.has(type) && type !== "news" && isChartData(rawData)) {
                type = "bar";
              }
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
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: 7,
                        marginBottom: 2,
                        alignSelf: isUser ? "flex-end" : "flex-start",
                      }}
                    >
                      {isUser ? (
                        <>
                          <span style={{ fontSize: 12, fontWeight: 600, color: "#94a3b8" }}>You</span>
                          <div
                            style={{
                              width: 18,
                              height: 18,
                              borderRadius: "50%",
                              background: "rgba(255, 255, 255, 0.12)",
                              display: "grid",
                              placeItems: "center",
                            }}
                          >
                            <User size={11} color="#cbd5e1" />
                          </div>
                        </>
                      ) : (
                        <>
                          <div
                            style={{
                              width: 18,
                              height: 18,
                              borderRadius: "50%",
                              background: "linear-gradient(135deg, #8b5cf6 0%, #6366f1 100%)",
                              display: "grid",
                              placeItems: "center",
                              boxShadow: "0 2px 8px rgba(139, 92, 246, 0.4)",
                            }}
                          >
                            <Sparkles size={11} color="#ffffff" />
                          </div>
                          <span style={{ fontSize: 12, fontWeight: 700, color: "#e2e8f0" }}>Vitya</span>
                        </>
                      )}
                    </div>

                    <div
                      style={{
                        ...styles.bubble,
                        ...(isUser ? styles.userBubble : styles.botBubble),
                        ...(msg.type === "download_link" ? { background: "transparent", border: "none", padding: 0, boxShadow: "none" } : {}),
                      }}
                    >
                      {msg.type === "download_link" ? (
                        <div
                          style={{
                            padding: "16px 18px",
                            borderRadius: 18,
                            background: "linear-gradient(145deg, rgba(26, 32, 56, 0.95) 0%, rgba(15, 20, 36, 0.98) 100%)",
                            border: "1px solid rgba(139, 92, 246, 0.35)",
                            boxShadow: "0 12px 30px rgba(0, 0, 0, 0.45), 0 0 20px rgba(139, 92, 246, 0.12)",
                            maxWidth: 520,
                            width: "100%",
                            boxSizing: "border-box",
                            display: "flex",
                            flexDirection: "column",
                            gap: 14,
                          }}
                        >
                          <div style={{ display: "flex", alignItems: "flex-start", gap: 14 }}>
                            {/* MODERN PRESENTATION ICON BADGE */}
                            <div
                              style={{
                                width: 44,
                                height: 44,
                                borderRadius: 14,
                                background: "linear-gradient(135deg, #d946ef 0%, #8b5cf6 50%, #6366f1 100%)",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                boxShadow: "0 6px 16px rgba(139, 92, 246, 0.35)",
                                flexShrink: 0,
                                marginTop: 2,
                              }}
                            >
                              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#ffffff" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                                <rect x="2" y="3" width="20" height="14" rx="2" />
                                <line x1="8" y1="21" x2="16" y2="21" />
                                <line x1="12" y1="17" x2="12" y2="21" />
                                <path d="M7 8h10" />
                                <path d="M7 11h6" />
                              </svg>
                            </div>

                            {/* TITLE & META BADGES */}
                            <div style={{ flex: 1, minWidth: 0 }}>
                              <div
                                style={{
                                  fontSize: 15.5,
                                  fontWeight: 700,
                                  color: "#ffffff",
                                  lineHeight: 1.35,
                                  display: "-webkit-box",
                                  WebkitLineClamp: 2,
                                  WebkitBoxOrient: "vertical",
                                  overflow: "hidden",
                                  letterSpacing: "0.2px",
                                }}
                              >
                                {msg.title || msg.text?.split("\n")[0]?.replace(/^✅\s*Presentation ready:\s*/i, "") || "Presentation Deck"}
                              </div>

                              <div
                                style={{
                                  display: "flex",
                                  alignItems: "center",
                                  gap: 8,
                                  marginTop: 6,
                                  flexWrap: "wrap",
                                }}
                              >
                                <span
                                  style={{
                                    background: "rgba(139, 92, 246, 0.2)",
                                    color: "#d8b4fe",
                                    padding: "3px 9px",
                                    borderRadius: 6,
                                    fontSize: 11.5,
                                    fontWeight: 600,
                                    border: "1px solid rgba(139, 92, 246, 0.35)",
                                    display: "inline-flex",
                                    alignItems: "center",
                                    gap: 4,
                                  }}
                                >
                                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>
                                  {msg.slidesCount || 6} Slides
                                </span>

                                <span
                                  style={{
                                    background: "rgba(255, 255, 255, 0.06)",
                                    color: "#94a3b8",
                                    padding: "3px 9px",
                                    borderRadius: 6,
                                    fontSize: 11.5,
                                    fontWeight: 500,
                                    border: "1px solid rgba(255, 255, 255, 0.08)",
                                  }}
                                >
                                  PowerPoint (.pptx)
                                </span>
                              </div>
                            </div>
                          </div>

                          {/* ACTION BUTTONS */}
                          <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
                            <button
                              type="button"
                              onClick={() => handleDownloadMessage(msg, i)}
                              style={{
                                flex: 1,
                                minWidth: 130,
                                display: "inline-flex",
                                alignItems: "center",
                                justifyContent: "center",
                                gap: 8,
                                background: "linear-gradient(135deg, #8b5cf6 0%, #6366f1 100%)",
                                color: "#ffffff",
                                border: "none",
                                padding: "10px 16px",
                                borderRadius: 12,
                                fontSize: 13,
                                fontWeight: 600,
                                cursor: "pointer",
                                boxShadow: "0 4px 16px rgba(139, 92, 246, 0.4)",
                                transition: "all 0.15s ease",
                              }}
                            >
                              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                                <polyline points="7 10 12 15 17 10" />
                                <line x1="12" y1="15" x2="12" y2="3" />
                              </svg>
                              Download PPT
                            </button>

                            <button
                              type="button"
                              onClick={() => handleEditPresentation(msg)}
                              style={{
                                flex: 1,
                                minWidth: 130,
                                display: "inline-flex",
                                alignItems: "center",
                                justifyContent: "center",
                                gap: 8,
                                background: "rgba(255, 255, 255, 0.08)",
                                border: "1px solid rgba(255, 255, 255, 0.18)",
                                color: "#f1f5f9",
                                padding: "10px 16px",
                                borderRadius: 12,
                                fontSize: 13,
                                fontWeight: 600,
                                cursor: "pointer",
                                transition: "all 0.15s ease",
                              }}
                            >
                              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                                <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
                              </svg>
                              Edit in Studio
                            </button>
                          </div>
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
                            const raw = msg.content ?? msg.text ?? msg.data ?? "";
                            const src = getImageSrc(raw);

                            return src ? (
                              <div style={{ position: "relative", display: "inline-block", maxWidth: "100%" }}>
                                <img
                                  src={src}
                                  alt={type}
                                  style={styles.mediaSmall}
                                  onError={(e) => {
                                    e.currentTarget.style.display = "none";
                                    if (e.currentTarget.nextSibling) {
                                      e.currentTarget.nextSibling.style.display = "flex";
                                    }
                                  }}
                                />
                                <div
                                  style={{
                                    display: "none",
                                    padding: "14px 18px",
                                    borderRadius: 14,
                                    background: "rgba(239, 68, 68, 0.12)",
                                    border: "1px solid rgba(239, 68, 68, 0.3)",
                                    color: "#f87171",
                                    fontSize: 13,
                                    fontWeight: 600,
                                    alignItems: "center",
                                    gap: 8,
                                  }}
                                >
                                  ⚠️ Image could not be loaded or URL expired.
                                </div>
                              </div>
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
                        <FormattedMarkdown content={msg.text} />
                      )}
                    </div>

                    {!isUser && (
                      <div className="vitya-msg-actions-row">
                        {/* Copy */}
                        <div
                          className="vitya-action-unit"
                          onClick={() => handleCopyMessage(msg, i)}
                          title="Copy message"
                        >
                          <button className="vitya-action-round-btn">
                            {copiedIndex === i ? (
                              <Check size={16} color="#10b981" />
                            ) : (
                              <Copy size={16} />
                            )}
                          </button>
                          <span className="vitya-action-label">Copy</span>
                        </div>

                        {/* Voice */}
                        <div
                          className="vitya-action-unit"
                          onClick={() => handleSpeakMessage(msg)}
                          title="Read out loud"
                        >
                          <button className="vitya-action-round-btn">
                            <Mic size={16} />
                          </button>
                          <span className="vitya-action-label">Voice</span>
                        </div>

                        {/* Download */}
                        <div
                          className="vitya-action-unit"
                          onClick={() => handleDownloadMessage(msg, i)}
                          title="Download message"
                        >
                          <button className="vitya-action-round-btn">
                            <Download size={16} />
                          </button>
                          <span className="vitya-action-label">Download</span>
                        </div>

                        {/* More */}
                        <div className="vitya-action-unit vitya-more-wrap">
                          <button
                            className={`vitya-action-round-btn ${activeMoreIndex === i ? "active" : ""}`}
                            onClick={(e) => {
                              e.stopPropagation();
                              setActiveMoreIndex((prev) => (prev === i ? null : i));
                            }}
                            title="More options"
                          >
                            <MoreVertical size={16} />
                          </button>
                          <span className="vitya-action-label">More</span>

                          {/* Popover Dropdown Menu */}
                          {activeMoreIndex === i && (
                            <div
                              className="vitya-more-dropdown"
                              onClick={(e) => e.stopPropagation()}
                            >
                              <button
                                className="vitya-more-item"
                                onClick={() => handleRenameMessage(i)}
                              >
                                <Pencil size={14} className="vitya-item-icon" />
                                <span>Rename</span>
                              </button>

                              <button
                                className="vitya-more-item"
                                onClick={() => handleDuplicateMessage(i)}
                              >
                                <Files size={14} className="vitya-item-icon" />
                                <span>Duplicate</span>
                              </button>

                              <button
                                className="vitya-more-item"
                                onClick={() => handleSaveToLibrary(msg)}
                              >
                                <Bookmark size={14} className="vitya-item-icon" />
                                <span>Save to Library</span>
                              </button>

                              <button
                                className="vitya-more-item"
                                onClick={() => handleShareMessage(msg)}
                              >
                                <Share2 size={14} className="vitya-item-icon" />
                                <span>Share</span>
                              </button>

                              <button
                                className="vitya-more-item delete"
                                onClick={() => handleDeleteMessage(i)}
                              >
                                <Trash2 size={14} className="vitya-item-icon" />
                                <span>Delete</span>
                              </button>

                              <div className="vitya-more-divider" />

                              <button
                                className="vitya-more-item"
                                onClick={() => handleExportPDF(msg, i)}
                              >
                                <FileText size={14} className="vitya-item-icon" />
                                <span>Export as PDF</span>
                              </button>
                            </div>
                          )}
                        </div>
                      </div>
                    )}

                    {isUser && (
                      <div className="vitya-user-msg-actions-row">
                        {/* Copy */}
                        <div
                          className="vitya-action-unit"
                          onClick={() => handleCopyMessage(msg, i)}
                          title="Copy prompt"
                        >
                          <button className="vitya-action-round-btn-sm">
                            {copiedIndex === i ? (
                              <Check size={13} color="#10b981" />
                            ) : (
                              <Copy size={13} />
                            )}
                          </button>
                          <span className="vitya-action-label">Copy</span>
                        </div>

                        {/* Rewrite */}
                        <div
                          className="vitya-action-unit"
                          onClick={() => handleRewriteUserMessage(msg, i)}
                          title="Edit and rewrite prompt"
                        >
                          <button className="vitya-action-round-btn-sm">
                            <RotateCcw size={13} />
                          </button>
                          <span className="vitya-action-label">Rewrite</span>
                        </div>
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



      <ChatInput
        input={input}
        setInput={setInput}
        sendMessage={sendMessage}
        loading={loading}
        listening={listening}
        mode={mode}
        openMode={openMode}
        plusOpen={plusOpen}
        setPlusOpen={setPlusOpen}
        handleMicClick={handleMicClick}
        toggleVoiceEnabled={toggleVoiceEnabled}
        getMicIcon={getMicIcon}
        menuRef={menuRef}
        useWebSearch={useWebSearch}
        setUseWebSearch={setUseWebSearch}
        ragDocs={ragDocs}
        handleFileUpload={handleDocumentFileUpload}
        handleClearDocs={handleClearRagDocs}
      />

      {/* Floating Action Toast Notification */}
      {toastMessage && (
        <div
          style={{
            position: "fixed",
            bottom: 90,
            left: "50%",
            transform: "translateX(-50%)",
            background: "rgba(15, 23, 42, 0.95)",
            border: "1px solid rgba(139, 92, 246, 0.4)",
            boxShadow: "0 10px 30px rgba(0,0,0,0.6), 0 0 20px rgba(99,102,241,0.3)",
            backdropFilter: "blur(14px)",
            color: "#ffffff",
            padding: "8px 18px",
            borderRadius: 24,
            fontSize: 13,
            fontWeight: 600,
            zIndex: 9999,
            display: "flex",
            alignItems: "center",
            gap: 8,
            animation: "vityaPopIn 0.2s ease",
          }}
        >
          <Check size={15} color="#10b981" />
          <span>{toastMessage}</span>
        </div>
      )}
    </div>
  );
};

export default Chatbot;

/* -------------------------------------------------------
   Styles
------------------------------------------------------- */
const styles = {
  page: {
    width: "100%",
    height: "100%",
    flex: 1,
    minHeight: 0,
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
    padding: "18px 16px 20px",
    overflowY: "auto",
    display: "flex",
    flexDirection: "column",
    gap: 14,
    boxSizing: "border-box",
    minHeight: 0,
  },
  emptyState: { flex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", margin: "auto 0" },
  emptyCard: {
    width: "min(780px, 100%)",
    padding: 28,
    borderRadius: 28,
    background: "rgba(15, 20, 36, 0.68)",
    border: "1px solid rgba(255,255,255,0.08)",
    boxShadow: "0 18px 40px rgba(0,0,0,0.22)",
    backdropFilter: "blur(16px)",
    textAlign: "center",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
  },
  heroTitle: {
    fontSize: "clamp(30px, 4vw, 52px)",
    fontWeight: 800,
    lineHeight: 1.05,
    letterSpacing: "-0.04em",
    textAlign: "center",
  },
  heroSub: {
    marginTop: 12,
    color: "rgba(255,255,255,0.74)",
    fontSize: 16,
    lineHeight: 1.7,
    maxWidth: 640,
    marginLeft: "auto",
    marginRight: "auto",
    textAlign: "center",
  },
  promptGrid: {
    marginTop: 22,
    display: "flex",
    flexWrap: "wrap",
    justifyContent: "center",
    alignItems: "center",
    gap: 12,
    maxWidth: 760,
    marginLeft: "auto",
    marginRight: "auto",
  },
  promptBtn: {
    padding: "14px 20px",
    borderRadius: 18,
    border: "1px solid rgba(255,255,255,0.10)",
    background: "rgba(255,255,255,0.06)",
    color: "#fff",
    cursor: "pointer",
    textAlign: "center",
    fontWeight: 600,
    lineHeight: 1.45,
    transition: "all 0.2s ease",
  },
  messageRow: { display: "flex", width: "100%" },
  messageStack: { display: "flex", flexDirection: "column", gap: 6, width: "fit-content", maxWidth: "100%" },
  bubble: {
    padding: "13px 18px",
    borderRadius: 18,
    wordBreak: "break-word",
    boxSizing: "border-box",
    maxWidth: "100%",
    boxShadow: "0 10px 28px rgba(0,0,0,0.22)",
    backdropFilter: "blur(14px)",
    fontSize: "14.5px",
    lineHeight: "1.6",
  },
  userBubble: {
    background: "linear-gradient(135deg, #8b5cf6 0%, #6366f1 100%)",
    color: "#ffffff",
    border: "1px solid rgba(255, 255, 255, 0.18)",
    borderRadius: "18px 18px 4px 18px",
    boxShadow: "0 6px 20px rgba(99, 102, 241, 0.32)",
    fontWeight: 500,
  },
  botBubble: {
    background: "rgba(18, 24, 40, 0.75)",
    color: "#f1f5f9",
    border: "1px solid rgba(255, 255, 255, 0.08)",
    borderRadius: "18px 18px 18px 4px",
  },
  cardWrap: {
    width: 620,
    maxWidth: "100%",
    overflow: "hidden",
    background: "transparent",
    padding: 0,
    boxSizing: "border-box",
  },
  newsContainer: {
    display: "flex",
    flexDirection: "column",
    gap: 14,
    width: "100%",
  },
  newsHeader: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    padding: "2px 4px 6px",
  },
  newsHeaderBadge: {
    fontSize: 11,
    fontWeight: 800,
    letterSpacing: "0.08em",
    color: "#c084fc",
    textTransform: "uppercase",
    background: "rgba(168, 85, 247, 0.12)",
    padding: "4px 10px",
    borderRadius: 8,
    border: "1px solid rgba(168, 85, 247, 0.25)",
  },
  newsCount: {
    fontSize: 12,
    color: "rgba(255, 255, 255, 0.5)",
    fontWeight: 600,
  },
  cardList: { display: "flex", flexDirection: "column", gap: 16 },
  newsCard: {
    display: "flex",
    flexDirection: "column",
    background: "rgba(15, 23, 42, 0.85)",
    border: "1px solid rgba(255, 255, 255, 0.1)",
    borderRadius: 20,
    overflow: "hidden",
    boxShadow: "0 12px 32px rgba(0, 0, 0, 0.4)",
    backdropFilter: "blur(16px)",
    transition: "all 0.25s cubic-bezier(0.4, 0, 0.2, 1)",
  },
  wikiCard: {
    display: "flex",
    flexDirection: "column",
    gap: 10,
    background: "rgba(15, 23, 42, 0.85)",
    border: "1px solid rgba(255, 255, 255, 0.1)",
    borderRadius: 20,
    padding: 16,
    boxShadow: "0 12px 32px rgba(0, 0, 0, 0.4)",
    backdropFilter: "blur(16px)",
  },
  wikiHeader: {
    marginBottom: 4,
  },
  wikiBadge: {
    fontSize: 11,
    fontWeight: 800,
    letterSpacing: "0.08em",
    color: "#38bdf8",
    textTransform: "uppercase",
    background: "rgba(56, 189, 248, 0.12)",
    padding: "4px 10px",
    borderRadius: 8,
    border: "1px solid rgba(56, 189, 248, 0.25)",
  },
  mediaContainer: {
    position: "relative",
    width: "100%",
    height: 220,
    overflow: "hidden",
    background: "rgba(0, 0, 0, 0.25)",
  },
  mediaLarge: {
    width: "100%",
    height: "100%",
    objectFit: "cover",
    display: "block",
    transition: "transform 0.3s ease",
  },
  mediaBadgeGroup: {
    position: "absolute",
    bottom: 12,
    left: 12,
    right: 12,
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 8,
    zIndex: 2,
  },
  noImageBadgeGroup: {
    display: "flex",
    alignItems: "center",
    gap: 8,
    padding: "16px 16px 0",
  },
  sourceBadge: {
    fontSize: 11,
    fontWeight: 700,
    color: "#f8fafc",
    background: "rgba(15, 23, 42, 0.88)",
    backdropFilter: "blur(10px)",
    padding: "4px 12px",
    borderRadius: 999,
    border: "1px solid rgba(255, 255, 255, 0.15)",
    boxShadow: "0 4px 12px rgba(0,0,0,0.3)",
  },
  dateBadge: {
    fontSize: 11,
    fontWeight: 600,
    color: "rgba(255, 255, 255, 0.85)",
    background: "rgba(0, 0, 0, 0.65)",
    backdropFilter: "blur(10px)",
    padding: "4px 12px",
    borderRadius: 999,
    border: "1px solid rgba(255, 255, 255, 0.1)",
  },
  newsCardContent: {
    padding: "18px 20px 20px",
    display: "flex",
    flexDirection: "column",
    gap: 10,
  },
  cardTitle: {
    fontWeight: 700,
    fontSize: 18,
    lineHeight: 1.38,
    color: "#f8fafc",
    margin: 0,
    letterSpacing: "-0.01em",
  },
  cardBody: {
    fontSize: 14,
    color: "#94a3b8",
    lineHeight: 1.6,
    margin: 0,
  },
  actionLinkBtn: {
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    width: "fit-content",
    marginTop: 6,
    padding: "10px 18px",
    borderRadius: 12,
    background: "linear-gradient(135deg, rgba(139, 92, 246, 0.25) 0%, rgba(99, 102, 241, 0.25) 100%)",
    border: "1px solid rgba(139, 92, 246, 0.45)",
    color: "#d8b4fe",
    textDecoration: "none",
    fontSize: 13,
    fontWeight: 700,
    transition: "all 0.2s ease",
  },
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
    border: "1px solid rgba(255,255,255,0.10)",
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
    gap: 14,
    padding: 16,
    borderRadius: 16,
    background: "linear-gradient(135deg, rgba(20, 20, 35, 0.95) 0%, rgba(13, 17, 30, 0.98) 100%)",
    border: "1px solid rgba(139, 92, 246, 0.3)",
    color: "#ffffff",
    minWidth: 290,
    boxSizing: "border-box",
    boxShadow: "0 12px 28px rgba(0,0,0,0.4), 0 0 20px rgba(139,92,246,0.15)",
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
