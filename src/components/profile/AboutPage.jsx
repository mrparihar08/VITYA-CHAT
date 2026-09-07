import React from "react";
import { useNavigate } from "react-router-dom";
import { PageShell } from "../auth/AuthCommon";
import "../auth/Auth.css";

export function AboutPage({ insideDashboard = false }) {
  const navigate = useNavigate();

  return (
    <PageShell
      title="About Vitya.AI"
      subtitle="Version information, workspace features, legal terms, and support contacts."
      plain={insideDashboard}
      hideBrandRow={insideDashboard}
      wide={true}
    >
      <div className="vitya-profile-edit-container">
        <div className="vitya-profile-top-nav">
          <button
            type="button"
            className="backBtn"
            onClick={() => navigate(insideDashboard ? "/dashboard?tab=profile" : "/profile")}
          >
            ← Back to Profile
          </button>
          <div className="appBreadcrumb">
            <span>Profile</span> <span className="bcSep">/</span> <strong className="bcCurrent">About Vitya.AI</strong>
          </div>
        </div>

        {/* HERO APP INFO */}
        <div className="vitya-profile-card">
          <div style={{ display: "flex", alignItems: "center", gap: 16, flexWrap: "wrap" }}>
            <div
              style={{
                width: 60,
                height: 60,
                borderRadius: 18,
                background: "linear-gradient(135deg, #8b5cf6 0%, #6366f1 100%)",
                display: "grid",
                placeItems: "center",
                fontSize: 30,
                fontWeight: 800,
                color: "#fff",
                boxShadow: "0 10px 24px rgba(139, 92, 246, 0.3)",
              }}
            >
              V
            </div>
            <div>
              <h2 style={{ fontSize: 22, margin: 0, color: "#fff" }}>Vitya.AI Workspace</h2>
              <div style={{ fontSize: 13, color: "#c4b5fd", marginTop: 4 }}>
                AI Finance Assistant & Interactive Presentation Studio
              </div>
              <div style={{ fontSize: 12, color: "rgba(255,255,255,0.6)", marginTop: 2 }}>
                Version 1.0.0 • Build 2026.09
              </div>
            </div>
          </div>

          <div style={{ marginTop: 18, paddingTop: 16, borderTop: "1px solid rgba(255,255,255,0.08)", fontSize: 13.5, lineHeight: 1.6, color: "rgba(255,255,255,0.85)" }}>
            <strong>Founder Note:</strong> Vitya.AI is built to streamline financial intelligence, presentation creation, and workspace productivity in one unified, sleek environment.
          </div>
        </div>
      </div>
    </PageShell>
  );
}

export default AboutPage;
