import React from "react";
import { useNavigate } from "react-router-dom";
import { PageShell, Button, styles } from "../auth/AuthCommon";

export function AboutPage() {
  const navigate = useNavigate();

  return (
    <PageShell
      title="About Vitya.AI"
      subtitle="Version information, workspace features, legal terms, and support contacts."
      wide
    >
      <div style={{ display: "grid", gap: 20 }}>
        <Button
          type="button"
          variant="secondary"
          onClick={() => navigate("/profile")}
          style={{ width: "fit-content" }}
        >
          ← Back to Profile
        </Button>

        {/* HERO APP INFO */}
        <div className="vitya-profile-card">
          <div style={{ display: "flex", alignItems: "center", gap: 16, flexWrap: "wrap" }}>
            <div
              style={{
                width: 64,
                height: 64,
                borderRadius: 20,
                background: "linear-gradient(135deg, #8b5cf6 0%, #6366f1 100%)",
                display: "grid",
                placeItems: "center",
                fontSize: 32,
                fontWeight: 800,
                color: "#fff",
                boxShadow: "0 10px 24px rgba(139, 92, 246, 0.3)",
              }}
            >
              V
            </div>
            <div>
              <h2 style={{ fontSize: 24, margin: 0, color: "#fff" }}>Vitya.AI Workspace</h2>
              <div style={{ fontSize: 13, color: "#c4b5fd", marginTop: 4 }}>
                Finance Assistant & Interactive Presentation Studio
              </div>
              <div style={{ fontSize: 12, color: "rgba(255,255,255,0.6)", marginTop: 2 }}>
                Version 1.0.0 • Build 2026.09
              </div>
            </div>
          </div>

          <div style={{ marginTop: 20, paddingTop: 18, borderTop: "1px solid rgba(255,255,255,0.08)", fontSize: 14, lineHeight: 1.6, color: "rgba(255,255,255,0.85)" }}>
            <strong>Founder Note:</strong> Vitya.AI is built to streamline financial intelligence, presentation creation, and workspace productivity in one unified, sleek environment.
          </div>
        </div>

        {/* SYSTEM STATUS */}
        <div style={styles.profileMain}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 12 }}>
            <div>
              <h3 style={styles.mainHeading}>🟢 System Status</h3>
              <p style={styles.mainSubheading}>All AI models, APIs, and cloud services are operational.</p>
            </div>
            <div className="vitya-stat-value" style={{ fontSize: 15 }}>
              <span className="vitya-green-dot" /> Operational
            </div>
          </div>
        </div>

        {/* QUICK LINKS & SUPPORT */}
        <div style={styles.profileMain}>
          <h3 style={styles.mainHeading}>📚 Helpful Resources & Contact</h3>
          <p style={styles.mainSubheading}>
            Access documentation, read terms, or reach out to our team.
          </p>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: 12, marginTop: 16 }}>
            <div
              className="vitya-menu-item"
              onClick={() => navigate("/chatbot")}
              style={{ cursor: "pointer" }}
            >
              <div className="vitya-menu-left">
                <span style={{ fontSize: 20 }}>💬</span>
                <div>
                  <div className="vitya-menu-title">AI Assistant Chat</div>
                  <div className="vitya-menu-sub">Open main chatbot</div>
                </div>
              </div>
              <span>›</span>
            </div>

            <div
              className="vitya-menu-item"
              onClick={() => navigate("/presentation")}
              style={{ cursor: "pointer" }}
            >
              <div className="vitya-menu-left">
                <span style={{ fontSize: 20 }}>📊</span>
                <div>
                  <div className="vitya-menu-title">Presentation Studio</div>
                  <div className="vitya-menu-sub">Create AI slide decks</div>
                </div>
              </div>
              <span>›</span>
            </div>

            <div
              className="vitya-menu-item"
              onClick={() => window.open("mailto:pradeep0810parihar@gmail.com")}
              style={{ cursor: "pointer" }}
            >
              <div className="vitya-menu-left">
                <span style={{ fontSize: 20 }}>✉️</span>
                <div>
                  <div className="vitya-menu-title">Contact Support</div>
                  <div className="vitya-menu-sub">Send an email</div>
                </div>
              </div>
              <span>›</span>
            </div>
          </div>

          <div style={{ marginTop: 24, textAlign: "center", fontSize: 13, color: "rgba(255,255,255,0.4)" }}>
            © 2026 Vitya.AI Inc. All rights reserved. <br />
            <span style={{ fontSize: 12, color: "#8b5cf6" }}>Smarter Finance. Brighter Future.</span>
          </div>
        </div>
      </div>
    </PageShell>
  );
}

export default AboutPage;
