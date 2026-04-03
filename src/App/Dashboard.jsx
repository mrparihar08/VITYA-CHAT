import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Chatbot from "./VityaChatbot";

const Dashboard = () => {
  const [showChat, setShowChat] = useState(false);
  const navigate = useNavigate();

  const user = JSON.parse(localStorage.getItem("user") || "{}");

  const handleNewChat = () => {
    setShowChat(true);
  };

  return (
    <div style={styles.page}>
      <header style={styles.navbar}>
        <div style={styles.left}>
          <img src="/logo.png" alt="Vitya.AI logo" style={styles.logo} />
          <div>
            <span style={styles.logoText}>Vitya.AI</span>
            <p style={styles.subtitle}>Your AI assistant for everything...</p>
          </div>
        </div>

        <div style={styles.center}>
          <button style={styles.newChatBtn} onClick={handleNewChat}>
            + New Chat
          </button>
        </div>

        <div style={styles.right}>
          <button style={styles.profileBox} type="button" onClick={() => navigate("/profile")}>
            <img src={user.avatar || "/profile.png"} alt="Profile" style={styles.profileImg} />
            <span style={styles.profileName}>{user.name || "Profile"}</span>
          </button>
        </div>
      </header>

      <main style={styles.content}>
        {showChat ? (
          <Chatbot />
        ) : (
          <div style={styles.emptyState}>
            <h2 style={styles.emptyTitle}>Welcome to Vitya.AI</h2>
            <p style={styles.emptyText}>Click “New Chat” to start a conversation.</p>
          </div>
        )}
      </main>
    </div>
  );
};

export default Dashboard;

const styles = {
  page: {
    width: "100%",
    height: "100vh",
    background:
      "radial-gradient(circle at top, #172033 0%, #0b1020 60%, #090d18 100%)",
    display: "flex",
    flexDirection: "column",
    fontFamily: "system-ui, sans-serif",
    color: "#fff",
    overflow: "hidden",
  },
  navbar: {
    height: 70,
    width: "100%",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    padding: "0 30px",
    background: "rgba(15, 20, 36, 0.85)",
    backdropFilter: "blur(14px)",
    borderBottom: "1px solid rgba(255,255,255,0.08)",
    position: "sticky",
    top: 0,
    zIndex: 100,
    flexShrink: 0,
  },
  left: { display: "flex", alignItems: "center", gap: 12 },
  logo: { width: 36, height: 36, objectFit: "contain", flexShrink: 0 },
  logoText: {
    display: "block",
    fontSize: 18,
    fontWeight: 700,
    letterSpacing: "0.5px",
    lineHeight: 1.2,
  },
  subtitle: { margin: 0, fontSize: 14, opacity: 0.7, lineHeight: 1.2 },
  center: { display: "flex", alignItems: "center" },
  newChatBtn: {
    padding: "10px 20px",
    borderRadius: 20,
    border: "none",
    cursor: "pointer",
    fontWeight: 600,
    background: "linear-gradient(135deg, #8b5cf6 0%, #6366f1 100%)",
    color: "#fff",
    boxShadow: "0 8px 20px rgba(99,102,241,0.3)",
  },
  right: { display: "flex", alignItems: "center" },
  profileBox: {
    display: "flex",
    alignItems: "center",
    gap: 8,
    padding: "6px 14px",
    borderRadius: 20,
    background: "rgba(255,255,255,0.06)",
    border: "none",
    color: "#fff",
    cursor: "pointer",
  },
  profileImg: {
    width: 32,
    height: 32,
    borderRadius: "50%",
    objectFit: "cover",
  },
  profileName: { fontSize: 14, fontWeight: 500 },
  content: { flex: 1, padding: 30, overflowY: "auto" },
  emptyState: {
    minHeight: "calc(100vh - 130px)",
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    textAlign: "center",
    gap: 8,
    opacity: 0.9,
  },
  emptyTitle: { margin: 0, fontSize: 28, fontWeight: 700 },
  emptyText: { margin: 0, fontSize: 16, opacity: 0.75 },
};