import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useTheme } from "../../context/ThemeContext";
import { PageShell, Button, styles } from "../auth/AuthCommon";

export function AppearancePage() {
  const navigate = useNavigate();
  const { theme, setTheme, presets } = useTheme();
  const [fontSize, setFontSize] = useState("normal");
  const [animations, setAnimations] = useState(true);
  const [language, setLanguage] = useState("en");

  const handleSave = () => {
    alert("Appearance preferences saved successfully!");
  };

  const themeList = Object.values(presets);

  return (
    <PageShell
      title="Appearance & Theme"
      subtitle="Customize the visual look, color themes, and display settings of Vitya.AI."
      backPath="/settings"
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

        {/* THEMES */}
        <div style={styles.profileMain}>
          <h3 style={styles.mainHeading}>🎨 Dynamic Theme Preset</h3>
          <p style={styles.mainSubheading}>
            Select your preferred color workspace theme. Changes apply instantly across the entire application.
          </p>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: 14, marginTop: 16 }}>
            {themeList.map((t) => {
              const isSelected = theme === t.id;
              return (
                <div
                  key={t.id}
                  onClick={() => setTheme(t.id)}
                  style={{
                    background: "rgba(255, 255, 255, 0.04)",
                    border: isSelected ? `2px solid ${t.accent}` : "1px solid rgba(255, 255, 255, 0.1)",
                    borderRadius: 18,
                    padding: 18,
                    cursor: "pointer",
                    boxShadow: isSelected ? `0 0 20px ${t.accent}55` : "none",
                    transition: "all 0.25 ease",
                    position: "relative",
                    overflow: "hidden",
                  }}
                >
                  <div
                    style={{
                      height: 6,
                      background: t.accentGradient,
                      borderRadius: 3,
                      marginBottom: 12,
                    }}
                  />
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <h4 style={{ color: "#fff", margin: 0, fontSize: 16, fontWeight: 750 }}>{t.name}</h4>
                    {isSelected && (
                      <span style={{ color: t.accent, fontWeight: 800, fontSize: 18 }}>✓</span>
                    )}
                  </div>
                  <p style={{ fontSize: 12, color: "rgba(255,255,255,0.7)", margin: "8px 0 0", lineHeight: 1.4 }}>
                    {t.desc}
                  </p>
                </div>
              );
            })}
          </div>
        </div>

        {/* FONT SIZE & ANIMATIONS */}
        <div style={styles.profileMain}>
          <h3 style={styles.mainHeading}>🔍 Display Density & Animations</h3>
          <p style={styles.mainSubheading}>
            Adjust font sizing and transition effects.
          </p>

          <div style={{ marginTop: 16, display: "grid", gap: 16 }}>
            <div>
              <label style={styles.label}>Font Size</label>
              <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
                {[
                  { id: "compact", label: "Compact (14px)" },
                  { id: "normal", label: "Normal (15px)" },
                  { id: "large", label: "Large (17px)" },
                ].map((s) => (
                  <button
                    key={s.id}
                    type="button"
                    className={fontSize === s.id ? "vitya-btn-purple" : "vitya-btn-outline"}
                    onClick={() => setFontSize(s.id)}
                    style={{ padding: "8px 16px", minHeight: 42, fontSize: 13 }}
                  >
                    {s.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="vitya-menu-item" onClick={() => setAnimations(!animations)}>
              <div>
                <div className="vitya-menu-title">✨ UI Animations & Glow Effects</div>
                <div className="vitya-menu-sub">Enable smooth backdrop blur and transition effects.</div>
              </div>
              <input
                type="checkbox"
                checked={animations}
                onChange={(e) => setAnimations(e.target.checked)}
                style={{ width: 20, height: 20, cursor: "pointer", accentColor: "#8b5cf6" }}
              />
            </div>
          </div>
        </div>

        {/* LANGUAGE */}
        <div style={styles.profileMain}>
          <h3 style={styles.mainHeading}>🌐 Language Selection</h3>
          <p style={styles.mainSubheading}>
            Choose the interface display language for Vitya.AI.
          </p>

          <select
            value={language}
            onChange={(e) => setLanguage(e.target.value)}
            style={{
              width: "100%",
              maxWidth: 320,
              height: 48,
              borderRadius: 14,
              border: "1px solid rgba(255, 255, 255, 0.15)",
              background: "#161b33",
              color: "#fff",
              padding: "0 16px",
              fontSize: 15,
              marginTop: 12,
              outline: "none",
            }}
          >
            <option value="en">English (United States)</option>
            <option value="hi">Hindi (हिन्दी)</option>
            <option value="es">Spanish (Español)</option>
            <option value="fr">French (Français)</option>
          </select>

          <div style={{ marginTop: 24 }}>
            <Button type="button" onClick={handleSave} style={{ padding: "12px 24px" }}>
              Save Appearance Settings
            </Button>
          </div>
        </div>
      </div>
    </PageShell>
  );
}

export default AppearancePage;
