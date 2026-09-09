import React, { useCallback, useEffect, useMemo, useState } from "react";
import { API_BASE_URL } from "../../services/api";
import "./ChatHistory.css";

const getPreview = (conversation) => {
  const text = (conversation?.last_message || "").trim();
  return text || "No messages in this conversation yet.";
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
  const [conversations, setConversations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [clearing, setClearing] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const fetchConversations = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`${API_BASE_URL}/api/chat/conversations`, {
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      });

      if (!response.ok) throw new Error("Unable to load chat history.");
      const data = await response.json();
      setConversations(Array.isArray(data) ? data : []);
    } catch (err) {
      setError(err.message || "Unable to load chat history.");
    } finally {
      setLoading(false);
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
    } catch (err) {
      setError(err.message || "Unable to clear chat history.");
    } finally {
      setClearing(false);
    }
  };

  const deleteSingleConversation = async (e, id) => {
    e.stopPropagation();
    if (!window.confirm(`Delete Conversation #${id}?`)) return;

    try {
      const token = localStorage.getItem("token");
      await fetch(`${API_BASE_URL}/api/chat/conversation/${id}`, {
        method: "DELETE",
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      });
      setConversations((prev) => prev.filter((c) => c.id !== id));
    } catch (err) {
      console.error(err);
    }
  };

  const filteredConversations = useMemo(() => {
    const q = searchQuery.toLowerCase().trim();
    if (!q) return conversations;
    return conversations.filter(
      (c) =>
        `conversation #${c.id}`.toLowerCase().includes(q) ||
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
          <p className="historyCount">{loading ? "Loading conversations…" : heading}</p>
        </div>
        <div className="historyActions">
          <button className="historyButton" onClick={fetchConversations} disabled={loading}>
            <span>🔄</span> Refresh
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

      {error && <div className="historyError" role="alert">{error}</div>}

      {loading ? (
        <div className="historyEmpty">Loading your conversations…</div>
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
              key={conversation.id}
              onClick={() => onOpenConversation(conversation.id)}
              role="button"
              tabIndex={0}
            >
              <div className="historyItemTop">
                <div className="historyItemTitleGroup">
                  <span className="historyIconBadge">💬</span>
                  <span className="historyItemTitle">Conversation #{conversation.id}</span>
                </div>
                <div className="historyTopRight">
                  <span className="historyItemDate">{formatDate(conversation.created_at)}</span>
                  <button
                    className="historyDeleteBtn"
                    onClick={(e) => deleteSingleConversation(e, conversation.id)}
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
