import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useTheme } from "../../context/ThemeContext";
import { PageShell } from "../auth/AuthCommon";
import "../auth/Auth.css";
import "./SettingsPage.css";

export function SettingsPage({ plain = true }) {
  const navigate = useNavigate();
  const { theme, setTheme } = useTheme() || {};

  // Active Category Tab
  const [activeCategory, setActiveCategory] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [toastMsg, setToastMsg] = useState("");

  // Persistent Settings States
  const [aiModel, setAiModel] = useState(
    () => localStorage.getItem("vitya_ai_model") || "GPT-5"
  );
  const [language, setLanguage] = useState(
    () => localStorage.getItem("vitya_language") || "English"
  );
  const [responseStyle, setResponseStyle] = useState(
    () => localStorage.getItem("vitya_response_style") || "Balanced"
  );
  const [accentColor, setAccentColor] = useState(
    () => localStorage.getItem("vitya_accent_color") || "purple"
  );
  const [fontSize, setFontSize] = useState(
    () => localStorage.getItem("vitya_font_size") || "Medium"
  );

  // Notification Toggles
  const [pushNotifs, setPushNotifs] = useState(
    () => localStorage.getItem("vitya_push_notifs") !== "false"
  );
  const [presentationAlerts, setPresentationAlerts] = useState(
    () => localStorage.getItem("vitya_presentation_alerts") !== "false"
  );
  const [taskUpdates, setTaskUpdates] = useState(
    () => localStorage.getItem("vitya_task_updates") !== "false"
  );

  const showToast = (msg) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(""), 3000);
  };

  // Sync AI Model
  const handleModelChange = (val) => {
    setAiModel(val);
    localStorage.setItem("vitya_ai_model", val);
    showToast(`Default AI Model set to ${val}`);
  };

  // Sync Language
  const handleLanguageChange = (val) => {
    setLanguage(val);
    localStorage.setItem("vitya_language", val);
    showToast(`Language preference saved (${val})`);
  };

  // Sync Response Style
  const handleStyleChange = (val) => {
    setResponseStyle(val);
    localStorage.setItem("vitya_response_style", val);
    showToast(`Response style set to ${val}`);
  };

  // Sync Accent Color
  const handleAccentChange = (val) => {
    setAccentColor(val);
    localStorage.setItem("vitya_accent_color", val);
    showToast(`Accent color updated to ${val}`);
  };

  // Sync Font Size
  const handleFontSizeChange = (val) => {
    setFontSize(val);
    localStorage.setItem("vitya_font_size", val);
    showToast(`Font size set to ${val}`);
  };

  // Sync Notification Toggles
  const handleToggle = (setter, key, val, label) => {
    setter(val);
    localStorage.setItem(key, String(val));
    showToast(`${label} ${val ? "Enabled" : "Disabled"}`);
  };

  // Apply Accent Color & Font Size live
  useEffect(() => {
    const root = document.documentElement;
    if (accentColor === "purple") {
      root.style.setProperty("--accent-1", "#8b5cf6");
      root.style.setProperty("--accent-2", "#6366f1");
    } else if (accentColor === "blue") {
      root.style.setProperty("--accent-1", "#3b82f6");
      root.style.setProperty("--accent-2", "#2563eb");
    } else if (accentColor === "teal") {
      root.style.setProperty("--accent-1", "#10b981");
      root.style.setProperty("--accent-2", "#059669");
    } else if (accentColor === "orange") {
      root.style.setProperty("--accent-1", "#f59e0b");
      root.style.setProperty("--accent-2", "#d97706");
    } else if (accentColor === "rose") {
      root.style.setProperty("--accent-1", "#ec4899");
      root.style.setProperty("--accent-2", "#db2777");
    }
  }, [accentColor]);

  useEffect(() => {
    const root = document.documentElement;
    if (fontSize === "Small") {
      root.style.fontSize = "14px";
    } else if (fontSize === "Medium") {
      root.style.fontSize = "16px";
    } else if (fontSize === "Large") {
      root.style.fontSize = "18px";
    }
  }, [fontSize]);

  const handleExportData = () => {
    const dataStr =
      "data:text/json;charset=utf-8," +
      encodeURIComponent(
        JSON.stringify({
          exportedAt: new Date(),
          app: "Vitya.AI",
          userNotes: localStorage.getItem("vitya_notes") || "[]",
          userTasks: localStorage.getItem("vitya_tasks") || "[]",
          userChats: localStorage.getItem("vitya_conversations") || "[]",
        })
      );
    const downloadAnchor = document.createElement("a");
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", "vitya_ai_export.json");
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
    showToast("Vitya.AI data backup exported successfully!");
  };

  const handleDeleteAllChats = () => {
    if (
      window.confirm(
        "Are you sure you want to delete all chat history? This action cannot be undone."
      )
    ) {
      localStorage.removeItem("vitya_chat_history");
      localStorage.removeItem("vitya_conversations");
      showToast("All chat history cleared successfully.");
    }
  };

  // Filter sections by category and search term
  const q = searchQuery.toLowerCase().trim();

  const showAccount =
    (activeCategory === "all" || activeCategory === "account") &&
    (!q || "account profile email subscription".includes(q));

  const showAi =
    (activeCategory === "all" || activeCategory === "ai") &&
    (!q || "ai model language response style memory personalization gpt claude gemini".includes(q));

  const showAppearance =
    (activeCategory === "all" || activeCategory === "appearance") &&
    (!q || "appearance theme dark light font size accent color".includes(q));

  const showNotifs =
    (activeCategory === "all" || activeCategory === "notifications") &&
    (!q || "notifications push alerts tasks email".includes(q));

  const showPrivacy =
    (activeCategory === "all" || activeCategory === "privacy") &&
    (!q || "privacy security export delete history password data encryption".includes(q));

  return (
    <PageShell
      title="Settings & Preferences"
      subtitle="Customize your Vitya.AI workspace, AI behavior, theme, and data security."
      plain={plain}
      hideBrandRow={plain}
    >
      <div className="vitya-settings-container">
        {/* TOAST NOTIFICATION */}
        {toastMsg && <div className="vitya-settings-toast">✓ {toastMsg}</div>}

        {/* TOP BAR: SEARCH & CATEGORY FILTER TABS */}
        <div className="vitya-settings-top-bar">
          <div className="vitya-settings-search-wrap">
            <span className="search-glass-icon">🔍</span>
            <input
              type="text"
              placeholder="Search setting options..."
              className="vitya-settings-top-search"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            {searchQuery && (
              <button
                className="search-clear-btn"
                onClick={() => setSearchQuery("")}
              >
                ✕
              </button>
            )}
          </div>

          <div className="vitya-settings-cat-pills">
            <button
              type="button"
              className={`cat-pill ${activeCategory === "all" ? "active" : ""}`}
              onClick={() => setActiveCategory("all")}
            >
              All Settings
            </button>
            <button
              type="button"
              className={`cat-pill ${activeCategory === "account" ? "active" : ""}`}
              onClick={() => setActiveCategory("account")}
            >
              👤 Account
            </button>
            <button
              type="button"
              className={`cat-pill ${activeCategory === "ai" ? "active" : ""}`}
              onClick={() => setActiveCategory("ai")}
            >
              🤖 AI Model
            </button>
            <button
              type="button"
              className={`cat-pill ${activeCategory === "appearance" ? "active" : ""}`}
              onClick={() => setActiveCategory("appearance")}
            >
              🎨 Appearance
            </button>
            <button
              type="button"
              className={`cat-pill ${activeCategory === "notifications" ? "active" : ""}`}
              onClick={() => setActiveCategory("notifications")}
            >
              🔔 Notifications
            </button>
            <button
              type="button"
              className={`cat-pill ${activeCategory === "privacy" ? "active" : ""}`}
              onClick={() => setActiveCategory("privacy")}
            >
              🛡️ Security
            </button>
          </div>
        </div>

        {/* SECTION 1: ACCOUNT */}
        {showAccount && (
          <div className="vitya-settings-card card-account">
            <div className="vitya-card-header">
              <div className="vitya-header-icon bg-purple">👤</div>
              <div className="vitya-header-title-block">
                <h3>Account & Subscription</h3>
                <p>Manage your user profile, credentials, and plan</p>
              </div>
            </div>

            <div className="vitya-settings-list">
              <div
                className="vitya-setting-item"
                onClick={() => navigate("/profile/edit")}
                role="button"
                tabIndex={0}
              >
                <div className="item-left">
                  <span className="item-icon">👤</span>
                  <span className="item-label">Profile & Personal Information</span>
                </div>
                <span className="item-chevron">›</span>
              </div>

              <div
                className="vitya-setting-item"
                onClick={() => navigate("/profile")}
                role="button"
                tabIndex={0}
              >
                <div className="item-left">
                  <span className="item-icon">✉️</span>
                  <span className="item-label">Email & Security Credentials</span>
                </div>
                <span className="item-chevron">›</span>
              </div>

              <div
                className="vitya-setting-item"
                onClick={() => navigate("/settings/subscription")}
                role="button"
                tabIndex={0}
              >
                <div className="item-left">
                  <span className="item-icon">👑</span>
                  <span className="item-label">Workspace Subscription Plan</span>
                </div>
                <div className="item-right-wrap">
                  <span className="vitya-badge-pro">⚡ Pro Tier Active</span>
                  <span className="item-chevron">›</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* SECTION 2: AI PREFERENCES */}
        {showAi && (
          <div className="vitya-settings-card card-ai">
            <div className="vitya-card-header">
              <div className="vitya-header-icon bg-blue">🤖</div>
              <div className="vitya-header-title-block">
                <h3>AI Model & Intelligence Preferences</h3>
                <p>Customize model defaults, response styles, and language</p>
              </div>
            </div>

            <div className="vitya-settings-list">
              <div className="vitya-setting-item item-select">
                <div className="item-left">
                  <span className="item-icon">⚙️</span>
                  <span className="item-label">Default AI Model</span>
                </div>
                <select
                  className="vitya-select-pill"
                  value={aiModel}
                  onChange={(e) => handleModelChange(e.target.value)}
                >
                  <option value="GPT-5">GPT-5 (Omni)</option>
                  <option value="GPT-4o">GPT-4o Turbo</option>
                  <option value="Claude-3.5">Claude 3.5 Sonnet</option>
                  <option value="Gemini-1.5">Gemini 1.5 Pro</option>
                </select>
              </div>

              <div className="vitya-setting-item item-select">
                <div className="item-left">
                  <span className="item-icon">🌐</span>
                  <span className="item-label">Response Language</span>
                </div>
                <select
                  className="vitya-select-pill"
                  value={language}
                  onChange={(e) => handleLanguageChange(e.target.value)}
                >
                  <option value="English">English</option>
                  <option value="Hindi">Hindi (हिंदी)</option>
                  <option value="Spanish">Spanish (Español)</option>
                  <option value="French">French (Français)</option>
                  <option value="German">German (Deutsch)</option>
                </select>
              </div>

              <div className="vitya-setting-item item-select">
                <div className="item-left">
                  <span className="item-icon">🪄</span>
                  <span className="item-label">Response Style</span>
                </div>
                <select
                  className="vitya-select-pill"
                  value={responseStyle}
                  onChange={(e) => handleStyleChange(e.target.value)}
                >
                  <option value="Balanced">Balanced (Recommended)</option>
                  <option value="Precise">Precise & Analytical</option>
                  <option value="Creative">Creative & Expressive</option>
                  <option value="Concise">Concise & Direct</option>
                </select>
              </div>
            </div>
          </div>
        )}

        {/* SECTION 3: APPEARANCE */}
        {showAppearance && (
          <div className="vitya-settings-card card-appearance">
            <div className="vitya-card-header">
              <div className="vitya-header-icon bg-teal">🎨</div>
              <div className="vitya-header-title-block">
                <h3>Appearance & Workspace Theme</h3>
                <p>Configure theme presets, accent colors, and typography</p>
              </div>
            </div>

            <div className="vitya-settings-list">
              {/* Theme 4-Preset Controls */}
              <div className="vitya-setting-item item-control">
                <div className="item-left">
                  <span className="item-icon">☀️</span>
                  <span className="item-label">Workspace Theme</span>
                </div>
                <div className="vitya-segmented-group">
                  <button
                    type="button"
                    className={`vitya-segment-btn ${theme === "dark" ? "active" : ""}`}
                    onClick={() => setTheme?.("dark")}
                  >
                    🌙 Dark
                  </button>
                  <button
                    type="button"
                    className={`vitya-segment-btn ${theme === "midnight" ? "active" : ""}`}
                    onClick={() => setTheme?.("midnight")}
                  >
                    🌌 Midnight
                  </button>
                  <button
                    type="button"
                    className={`vitya-segment-btn ${theme === "cyber" ? "active" : ""}`}
                    onClick={() => setTheme?.("cyber")}
                  >
                    ⚡ Cyber
                  </button>
                  <button
                    type="button"
                    className={`vitya-segment-btn ${theme === "obsidian" ? "active" : ""}`}
                    onClick={() => setTheme?.("obsidian")}
                  >
                    🖤 Obsidian
                  </button>
                </div>
              </div>

              {/* Accent Color Swatches */}
              <div className="vitya-setting-item item-control">
                <div className="item-left">
                  <span className="item-icon">🏷️</span>
                  <span className="item-label">Accent Color</span>
                </div>
                <div className="vitya-color-swatches">
                  <button
                    type="button"
                    className={`swatch swatch-purple ${accentColor === "purple" ? "active" : ""}`}
                    onClick={() => handleAccentChange("purple")}
                    title="Purple Accent"
                  />
                  <button
                    type="button"
                    className={`swatch swatch-blue ${accentColor === "blue" ? "active" : ""}`}
                    onClick={() => handleAccentChange("blue")}
                    title="Blue Accent"
                  />
                  <button
                    type="button"
                    className={`swatch swatch-teal ${accentColor === "teal" ? "active" : ""}`}
                    onClick={() => handleAccentChange("teal")}
                    title="Teal Accent"
                  />
                  <button
                    type="button"
                    className={`swatch swatch-orange ${accentColor === "orange" ? "active" : ""}`}
                    onClick={() => handleAccentChange("orange")}
                    title="Orange Accent"
                  />
                  <button
                    type="button"
                    className={`swatch swatch-rose ${accentColor === "rose" ? "active" : ""}`}
                    onClick={() => handleAccentChange("rose")}
                    title="Rose Accent"
                  />
                </div>
              </div>

              {/* Font Size 3-Pill Control */}
              <div className="vitya-setting-item item-control">
                <div className="item-left">
                  <span className="item-icon">Aa</span>
                  <span className="item-label">Font Size Scale</span>
                </div>
                <div className="vitya-segmented-group">
                  <button
                    type="button"
                    className={`vitya-segment-btn ${fontSize === "Small" ? "active" : ""}`}
                    onClick={() => handleFontSizeChange("Small")}
                  >
                    Small
                  </button>
                  <button
                    type="button"
                    className={`vitya-segment-btn ${fontSize === "Medium" ? "active" : ""}`}
                    onClick={() => handleFontSizeChange("Medium")}
                  >
                    Medium
                  </button>
                  <button
                    type="button"
                    className={`vitya-segment-btn ${fontSize === "Large" ? "active" : ""}`}
                    onClick={() => handleFontSizeChange("Large")}
                  >
                    Large
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* SECTION 4: NOTIFICATIONS */}
        {showNotifs && (
          <div className="vitya-settings-card card-notifications">
            <div className="vitya-card-header">
              <div className="vitya-header-icon bg-amber">🔔</div>
              <div className="vitya-header-title-block">
                <h3>Notifications & Alerts</h3>
                <p>Stay informed about presentation decks, tasks, and system events</p>
              </div>
            </div>

            <div className="vitya-settings-list">
              <div className="vitya-setting-item item-toggle">
                <div className="item-left">
                  <span className="item-icon">🔔</span>
                  <span className="item-label">Push Notifications</span>
                </div>
                <label className="vitya-switch">
                  <input
                    type="checkbox"
                    checked={pushNotifs}
                    onChange={(e) =>
                      handleToggle(setPushNotifs, "vitya_push_notifs", e.target.checked, "Push Notifications")
                    }
                  />
                  <span className="slider round" />
                </label>
              </div>

              <div className="vitya-setting-item item-toggle">
                <div className="item-left">
                  <span className="item-icon">🖥️</span>
                  <span className="item-label">Presentation Generation Alerts</span>
                </div>
                <label className="vitya-switch">
                  <input
                    type="checkbox"
                    checked={presentationAlerts}
                    onChange={(e) =>
                      handleToggle(setPresentationAlerts, "vitya_presentation_alerts", e.target.checked, "Presentation Alerts")
                    }
                  />
                  <span className="slider round" />
                </label>
              </div>

              <div className="vitya-setting-item item-toggle">
                <div className="item-left">
                  <span className="item-icon">📋</span>
                  <span className="item-label">AI Task & Note Updates</span>
                </div>
                <label className="vitya-switch">
                  <input
                    type="checkbox"
                    checked={taskUpdates}
                    onChange={(e) =>
                      handleToggle(setTaskUpdates, "vitya_task_updates", e.target.checked, "Task Updates")
                    }
                  />
                  <span className="slider round" />
                </label>
              </div>
            </div>
          </div>
        )}

        {/* SECTION 5: PRIVACY & SECURITY */}
        {showPrivacy && (
          <div className="vitya-settings-card card-privacy">
            <div className="vitya-card-header">
              <div className="vitya-header-icon bg-rose">🛡️</div>
              <div className="vitya-header-title-block">
                <h3>Privacy, Data & Security</h3>
                <p>Export your data, clear history, and verify encryption</p>
              </div>
            </div>

            <div className="vitya-settings-list">
              <div
                className="vitya-setting-item"
                onClick={handleExportData}
                role="button"
                tabIndex={0}
              >
                <div className="item-left">
                  <span className="item-icon">📥</span>
                  <span className="item-label">Export Data Backup (`.json`)</span>
                </div>
                <span className="item-chevron">›</span>
              </div>

              <div
                className="vitya-setting-item text-danger"
                onClick={handleDeleteAllChats}
                role="button"
                tabIndex={0}
              >
                <div className="item-left">
                  <span className="item-icon text-danger">🗑️</span>
                  <span className="item-label text-danger">Delete All Conversations & History</span>
                </div>
                <span className="item-chevron">›</span>
              </div>
            </div>
          </div>
        )}
      </div>
    </PageShell>
  );
}

export default SettingsPage;
