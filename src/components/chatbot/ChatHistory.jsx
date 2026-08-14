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

  const heading = useMemo(
    () => `${conversations.length} conversation${conversations.length === 1 ? "" : "s"}`,
    [conversations.length]
  );

  return (
    <section className="historyPanel" aria-label="Chat history">
      <div className="historyHeader">
        <div>
          <p className="historyEyebrow">Your workspace</p>
          <h2>Chat history</h2>
          <p className="historyCount">{loading ? "Loading conversations…" : heading}</p>
        </div>
        <div className="historyActions">
          <button className="historyButton" onClick={fetchConversations} disabled={loading}>
            Refresh
          </button>
          <button
            className="historyButton historyDangerButton"
            onClick={clearHistory}
            disabled={!conversations.length || clearing}
          >
            {clearing ? "Clearing…" : "Clear all"}
          </button>
        </div>
      </div>

      {error && <div className="historyError" role="alert">{error}</div>}

      {loading ? (
        <div className="historyEmpty">Loading your conversations…</div>
      ) : conversations.length === 0 ? (
        <div className="historyEmpty">
          <span className="historyEmptyIcon">⌁</span>
          <h3>No chats saved yet</h3>
          <p>Start a new chat and it will appear here.</p>
        </div>
      ) : (
        <div className="historyList">
          {conversations.map((conversation) => (
            <button
              className="historyItem"
              key={conversation.id}
              onClick={() => onOpenConversation(conversation.id)}
            >
              <span className="historyItemTop">
                <span className="historyItemTitle">Conversation #{conversation.id}</span>
                <span className="historyItemDate">{formatDate(conversation.created_at)}</span>
              </span>
              <span className="historyPreview">{getPreview(conversation)}</span>
              <span className="historyOpen">Open chat →</span>
            </button>
          ))}
        </div>
      )}
    </section>
  );
};

export default ChatHistory;
