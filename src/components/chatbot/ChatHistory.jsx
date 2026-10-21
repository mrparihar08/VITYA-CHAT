import React, { useCallback, useEffect, useMemo, useState } from "react";
import { API_BASE_URL } from "../../services/api";
import "./ChatHistory.css";

const deriveSmartTitle = (text) => {
  if (!text || typeof text !== "string") return "";
  const trimmed = text.trim();
  if (!trimmed) return "";

  let clean = trimmed;
  if (clean.startsWith("{") && clean.endsWith("}")) {
    try {
      const parsed = JSON.parse(clean);
      clean = parsed.title || parsed.message || parsed.text || parsed.summary || clean;
    } catch {}
  }

  clean = clean
    .replace(/```[\s\S]*?```/g, "")
    .replace(/[{}[\]"']/g, "")
    .replace(/^Gemini stream error:\s*503\s*UNAVAILABLE.*/i, "AI Assistant Query")
    .replace(/[\r\n]+/g, " ")
    .trim();

  const lower = clean.toLowerCase();

  if (lower.includes("expence") || lower.includes("expense") || lower.includes("kharch") || lower.includes("paid")) {
    const words = clean.match(/\b[A-Za-z0-9]+\b/g) || [];
    const stopWords = new Set(["add", "karo", "kar", "do", "aaj", "mene", "maine", "mera", "meri", "mere", "expence", "expense", "expenses", "bhi", "liya", "hu", "hai", "me", "mein", "ka", "ki", "ke", "ko"]);
    const meaningful = words.filter((w) => !stopWords.has(w.toLowerCase()));
    if (meaningful.length > 0) {
      return `Expense: ${meaningful.slice(0, 4).join(" ").replace(/\b\w/g, (c) => c.toUpperCase())}`;
    }
    return "Expense Log";
  }

  if (lower.includes("balance") || lower.includes("kitna paisa")) {
    return "Account Balance";
  }

  if (lower.includes("quickprompts") || lower.includes("import") || lower.includes("export") || lower.includes("react") || lower.includes("error")) {
    const words = clean.match(/\b[A-Za-z0-9_]+\b/g) || [];
    const sig = words.filter((w) => w.length > 2).slice(0, 4);
    if (sig.length > 0) {
      return sig.join(" ").replace(/\b\w/g, (c) => c.toUpperCase());
    }
  }

  const noGreetings = clean
    .replace(/^(?:hi|hello|hey|namaste|hlo|hii+|bhai|yaar|vitya|ai|please|batao)\b[!,.]*\s*/i, "")
    .trim();

  const source = noGreetings.length >= 3 ? noGreetings : clean;
  const words = source.split(/\s+/).slice(0, 5).join(" ");
  return words.length > 35 ? words.slice(0, 32) + "..." : words.replace(/\b\w/g, (c) => c.toUpperCase());
};

const getConversationTitle = (conversation) => {
  const t = conversation?.title;
  if (t && typeof t === "string" && t.trim() && !t.startsWith("Conversation #") && t !== "New Chat") {
    return t.trim();
  }
  if (conversation?.topic && typeof conversation.topic === "string" && conversation.topic.trim()) {
    return conversation.topic.trim();
  }
  const derived = deriveSmartTitle(conversation?.first_message || conversation?.last_message);
  if (derived) return derived;

  return `Chat #${conversation.id}`;
};

const getPreview = (conversation) => {
  const rawText = conversation?.last_message || conversation?.first_message || "";
  const cleaned = rawText
    .replace(/```[\s\S]*?```/g, "[Code]")
    .replace(/#+\s+/g, "")
    .replace(/[*_~`]/g, "")
    .replace(/[\r\n]+/g, " ")
    .replace(/\s+/g, " ")
    .trim();

  if (!cleaned) return "No messages in this conversation yet.";
  return cleaned;
};

const formatDate = (value) => {
  if (!value) return "Recently";

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "Recently";

  return new Intl.DateTimeFormat("en-IN", {
    day: "numeric",
    month: "short",
    year: date.getFullYear() !== new Date().getFullYear() ? "numeric" : undefined,
    hour: "numeric",
    minute: "2-digit",
  }).format(date);
};

const ChatHistory = ({ onOpenConversation, refreshKey = 0 }) => {
  // Initialize with cached conversations for instantaneous zero-latency render
  const [conversations, setConversations] = useState(() => {
    try {
      const raw = localStorage.getItem("vitya_conversations") || localStorage.getItem("chats");
      if (raw) {
        const parsed = JSON.parse(raw);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch {}
    return [];
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [isRetrying, setIsRetrying] = useState(false);
  const [clearing, setClearing] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [copiedId, setCopiedId] = useState(null);

  const fetchConversations = useCallback(async (isUserRetry = false) => {
    setLoading(true);
    if (isUserRetry) setIsRetrying(true);
    setError("");

    try {
      const token = localStorage.getItem("token");
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 12000);

      const response = await fetch(`${API_BASE_URL}/api/chat/conversations`, {
        headers: token ? { Authorization: `Bearer ${token}` } : {},
        signal: controller.signal,
      });
      clearTimeout(timeoutId);

      if (!response.ok) {
        throw new Error(`Server returned HTTP ${response.status}`);
      }

      const data = await response.json();
      const list = Array.isArray(data) ? data : [];
      setConversations(list);
      setError("");

      if (list.length > 0) {
        try {
          localStorage.setItem("vitya_conversations", JSON.stringify(list));
        } catch {}
      }
    } catch (err) {
      console.warn("ChatHistory fetch error:", err);

      // Check offline cache fallback
      let cached = [];
      try {
        const raw = localStorage.getItem("vitya_conversations") || localStorage.getItem("chats");
        if (raw) cached = JSON.parse(raw);
      } catch {}

      if (Array.isArray(cached) && cached.length > 0) {
        setConversations(cached);
        setError("Viewing offline saved conversations. Server is connecting in the background.");
      } else {
        const isAbort = err.name === "AbortError";
        const isNetwork = err.name === "TypeError" || (err.message && err.message.toLowerCase().includes("fetch"));

        if (isAbort || isNetwork) {
          setError("Server is waking up from idle state. Please click Retry in a few seconds.");
        } else {
          setError(err.message || "Unable to load chat history. Please try again.");
        }
      }
    } finally {
      setLoading(false);
      setIsRetrying(false);
    }
  }, []);

  useEffect(() => {
    fetchConversations();
  }, [fetchConversations, refreshKey]);

  const clearHistory = async () => {
    if (!window.confirm("Clear all chat history? This cannot be undone.")) return;

    setClearing(true);
    setError("");
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`${API_BASE_URL}/api/chat/history`, {
        method: "DELETE",
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      });
      if (!response.ok) throw new Error("Unable to clear chat history.");
      setConversations([]);
      try {
        localStorage.removeItem("vitya_conversations");
      } catch {}
    } catch (err) {
      setError(err.message || "Unable to clear chat history.");
    } finally {
      setClearing(false);
    }
  };

  const deleteSingleConversation = async (e, id, uniqueId) => {
    e.stopPropagation();
    const displayId = uniqueId || id;
    if (!window.confirm(`Delete Conversation #${displayId}?`)) return;

    try {
      const token = localStorage.getItem("token");
      await fetch(`${API_BASE_URL}/api/chat/conversation/${id}`, {
        method: "DELETE",
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      });
      setConversations((prev) => {
        const next = prev.filter((c) => c.id !== id);
        try {
          localStorage.setItem("vitya_conversations", JSON.stringify(next));
        } catch {}
        return next;
      });
    } catch (err) {
      console.error(err);
    }
  };

  const filteredConversations = useMemo(() => {
    const q = searchQuery.toLowerCase().trim();
    if (!q) return conversations;
    return conversations.filter(
      (c) =>
        getConversationTitle(c).toLowerCase().includes(q) ||
        (c.unique_id && c.unique_id.toLowerCase().includes(q)) ||
        `conversation #${c.id}`.toLowerCase().includes(q) ||
        `#${c.unique_id || c.id}`.toLowerCase().includes(q) ||
        getPreview(c).toLowerCase().includes(q)
    );
  }, [conversations, searchQuery]);

  const heading = useMemo(
    () => `${conversations.length} conversation${conversations.length === 1 ? "" : "s"} saved`,
    [conversations.length]
  );

  return (
    <section className="historyPanel" aria-label="Chat history">
      <div className="historyHeader">
        <div>
          <p className="historyEyebrow">⚡ Workspace History</p>
          <h2>Chat History</h2>
          <p className="historyCount">{loading ? "Connecting to conversations…" : heading}</p>
        </div>
        <div className="historyActions">
          <button
            className="historyButton"
            onClick={() => fetchConversations(true)}
            disabled={loading || isRetrying}
          >
            <span>🔄</span> {loading || isRetrying ? "Refreshing…" : "Refresh"}
          </button>
          <button
            className="historyButton historyDangerButton"
            onClick={clearHistory}
            disabled={!conversations.length || clearing}
          >
            <span>🗑️</span> {clearing ? "Clearing…" : "Clear all"}
          </button>
        </div>
      </div>

      {/* SEARCH BAR */}
      <div className="historySearchWrapper">
        <span className="historySearchIcon">🔍</span>
        <input
          type="text"
          placeholder="Search past conversations or keywords..."
          className="historySearchInput"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        {searchQuery && (
          <button className="historySearchClear" onClick={() => setSearchQuery("")}>
            ✕
          </button>
        )}
      </div>

      {/* ERROR / RECONNECT BANNER WITH RETRY BUTTON */}
      {error && (
        <div className="historyError" role="alert">
          <div className="historyErrorLeft">
            <span className="historyErrorIcon">⚡</span>
            <span className="historyErrorText">{error}</span>
          </div>
          <button
            className="historyRetryBtn"
            onClick={() => fetchConversations(true)}
            disabled={loading || isRetrying}
          >
            {isRetrying ? "Connecting…" : "Retry"}
          </button>
        </div>
      )}

      {loading && conversations.length === 0 ? (
        <div className="historyEmpty">
          <div className="historyLoadingSpinner" />
          <p>Connecting to Vitya Cloud…</p>
        </div>
      ) : filteredConversations.length === 0 ? (
        <div className="historyEmpty">
          <span className="historyEmptyIcon">💬</span>
          <h3>No conversations found</h3>
          <p>
            {searchQuery
              ? `No chats matching "${searchQuery}".`
              : "Start a new conversation and it will appear here."}
          </p>
        </div>
      ) : (
        <div className="historyList">
          {filteredConversations.map((conversation) => (
            <div
              className="historyItem"
              key={conversation.unique_id || conversation.id}
              onClick={() => onOpenConversation(conversation.id)}
              role="button"
              tabIndex={0}
            >
              <div className="historyItemTop">
                <div className="historyItemTitleGroup">
                  <span className="historyIconBadge">💬</span>
                  <span className="historyItemTitle">{getConversationTitle(conversation)}</span>
                  {conversation.unique_id && (
                    <span
                      className="historyUniqueIdBadge"
                      title="Click to copy Unique ID"
                      onClick={(e) => {
                        e.stopPropagation();
                        navigator.clipboard?.writeText(conversation.unique_id);
                        setCopiedId(conversation.unique_id);
                        setTimeout(() => setCopiedId(null), 2000);
                      }}
                    >
                      {copiedId === conversation.unique_id ? "✓ Copied" : `#${conversation.unique_id}`}
                    </span>
                  )}
                </div>
                <div className="historyTopRight">
                  <span className="historyItemDate">{formatDate(conversation.created_at)}</span>
                  <button
                    className="historyDeleteBtn"
                    onClick={(e) => deleteSingleConversation(e, conversation.id, conversation.unique_id)}
                    title="Delete conversation"
                  >
                    🗑️
                  </button>
                </div>
              </div>

              <div className="historyPreview">{getPreview(conversation)}</div>

              <div className="historyFooter">
                <span className="historyOpen">Open chat →</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </section>
  );
};

export default ChatHistory;
