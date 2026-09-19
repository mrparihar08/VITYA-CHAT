import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useTheme } from "../../context/ThemeContext";
import { PageShell } from "../auth/AuthCommon";
import { api } from "../../services/api";
import "../auth/Auth.css";

export function AppearancePage({ insideDashboard = false }) {
  const navigate = useNavigate();
  const { theme, setTheme, presets } = useTheme() || {};
  const [toastMsg, setToastMsg] = useState("");

  const showToast = (msg) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(""), 3500);
  };

  // Sync with cloud settings on load
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) return;

    api
      .get("/api/settings/")
      .then((res) => {
        if (res.data?.theme && res.data.theme !== theme) {
          setTheme?.(res.data.theme);
        }
      })
      .catch(() => {});
  }, [setTheme, theme]);

  const handleSelectTheme = async (t) => {
    setTheme?.(t.id);
    showToast(`Theme switched to ${t.name}`);

    const token = localStorage.getItem("token");
    if (token) {
      try {
        await api.put("/api/settings/", { theme: t.id, accent_color: t.accent });
      } catch (e) {
        console.warn("Could not save theme to cloud settings", e);
      }
    }
  };

  const themeList = Object.values(presets || {});

  return (
    <PageShell
      title="Appearance & Theme"
      subtitle="Customize the visual look, color themes, and display settings of Vitya.AI."
      plain={insideDashboard}
      hideBrandRow={insideDashboard}
      wide={true}
    >
      <div className="vitya-profile-edit-container">
        {toastMsg && <div className="vitya-settings-toast">✓ {toastMsg}</div>}

        <div className="vitya-profile-top-nav">
          <button
            type="button"
            className="backBtn"
            onClick={() => navigate(insideDashboard ? "/dashboard?tab=profile" : "/profile")}
          >
            ← Back to Profile
          </button>
          <div className="appBreadcrumb">
            <span>Profile</span> <span className="bcSep">/</span> <strong className="bcCurrent">Appearance & Theme</strong>
          </div>
        </div>

        {/* THEME PRESETS */}
        <div className="vitya-settings-card">
          <div className="vitya-card-header">
            <div className="vitya-header-icon bg-teal">🎨</div>
            <div className="vitya-header-title-block">
              <h3>Dynamic Workspace Theme Presets</h3>
              <p>Select your preferred theme. Changes sync with your MOTHER account across devices.</p>
            </div>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: 14, marginTop: 12 }}>
            {themeList.map((t) => {
              const isSelected = theme === t.id;
              return (
                <div
                  key={t.id}
                  onClick={() => handleSelectTheme(t)}
                  style={{
                    background: "rgba(255, 255, 255, 0.05)",
                    border: isSelected ? `2px solid ${t.accent}` : "1px solid rgba(255, 255, 255, 0.1)",
                    borderRadius: 18,
                    padding: 16,
                    cursor: "pointer",
                    boxShadow: isSelected ? `0 0 20px ${t.accent}55` : "none",
                    transition: "all 0.25s ease",
                  }}
                >
                  <div style={{ fontSize: 16, fontWeight: 700, color: "#fff", marginBottom: 4 }}>
                    {t.name} {isSelected && "✓"}
                  </div>
                  <div style={{ fontSize: 12, color: "rgba(255,255,255,0.6)" }}>{t.desc}</div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </PageShell>
  );
}

export default AppearancePage;
