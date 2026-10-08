import React, { useState, useEffect } from "react";
import { api, handleApiError } from "../../services/api";
import "../auth/Auth.css";

export function BotIntegrationSection() {
  const [telegramToken, setTelegramToken] = useState("");
  const [telegramChatId, setTelegramChatId] = useState("");
  const [whatsappNumber, setWhatsappNumber] = useState("");
  const [webhookUrl, setWebhookUrl] = useState("");
  const [telegramActive, setTelegramActive] = useState(false);
  const [whatsappActive, setWhatsappActive] = useState(false);
  const [webhookActive, setWebhookActive] = useState(false);
  
  // State for loading and toast messages
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [toastMsg, setToastMsg] = useState("");

  const showToast = (msg) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(""), 3500);
  };

  useEffect(() => {
    const fetchBotSettings = async () => {
      setLoading(true);
      try {
        const res = await api.get("/api/settings/");
        if (res.data) {
          if (res.data.telegram_token) setTelegramToken(res.data.telegram_token);
          if (res.data.telegram_chat_id) setTelegramChatId(res.data.telegram_chat_id);
          if (res.data.telegram_enabled) setTelegramActive(res.data.telegram_enabled);
          if (res.data.whatsapp_number) setWhatsappNumber(res.data.whatsapp_number);
          if (res.data.whatsapp_enabled) setWhatsappActive(res.data.whatsapp_enabled);
          if (res.data.webhook_url) setWebhookUrl(res.data.webhook_url);
          if (res.data.webhook_enabled) setWebhookActive(res.data.webhook_enabled);
        }
      } catch (err) {
        console.warn("Could not load bot settings from server", err);
      } finally {
        setLoading(false);
      }
    };

    fetchBotSettings();
  }, []);

  const handleSaveTelegram = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      await api.put("/api/settings/", {
        telegram_token: telegramToken,
        telegram_chat_id: telegramChatId,
        telegram_enabled: telegramActive,
      });
      showToast("Telegram Bot settings saved successfully!");
    } catch (err) {
      showToast(handleApiError(err) || "Failed to save Telegram settings");
    } finally {
      setSaving(false);
    }
  };

  const handleSaveWhatsapp = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      await api.put("/api/settings/", {
        whatsapp_number: whatsappNumber,
        whatsapp_enabled: whatsappActive,
      });
      showToast("WhatsApp Bot settings saved successfully!");
    } catch (err) {
      showToast(handleApiError(err) || "Failed to save WhatsApp settings");
    } finally {
      setSaving(false);
    }
  };

  const handleSaveWebhook = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      await api.put("/api/settings/", {
        webhook_url: webhookUrl,
        webhook_enabled: webhookActive,
      });
      showToast("Custom Webhook integration saved successfully!");
    } catch (err) {
      showToast(handleApiError(err) || "Failed to save Webhook settings");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div style={{ padding: "24px", textAlign: "center", color: "var(--text-muted, #94a3b8)" }}>
        <div style={{ fontSize: "24px", marginBottom: "8px" }}>⏳</div>
        <div>Loading bot integration settings...</div>
      </div>
    );
  }

  return (
    <div className="vitya-bot-integration-section">
      {toastMsg && <div className="vitya-settings-toast">✓ {toastMsg}</div>}

      {/* TELEGRAM BOT INTEGRATION */}
      <div className="vitya-settings-card" style={{ marginBottom: "20px" }}>
        <div className="vitya-card-header">
          <div className="vitya-header-icon" style={{ background: "rgba(14, 165, 233, 0.15)", color: "#0ea5e9" }}>
            ✈️
          </div>
          <div className="vitya-header-title-block">
            <h3>Telegram AI Bot</h3>
            <p>Connect Vitya.AI to Telegram to receive morning briefings and execute actions on the go.</p>
          </div>
        </div>

        <form onSubmit={handleSaveTelegram}>
          <div className="formGroup" style={{ marginBottom: "14px" }}>
            <label style={{ display: "block", fontSize: "13px", fontWeight: 600, marginBottom: "6px", color: "var(--text-main, #f8fafc)" }}>
              Bot Token (from @BotFather)
            </label>
            <input
              type="text"
              placeholder="e.g. 123456789:ABCdefGhIJKlmNoPQRsTUVwxyZ"
              value={telegramToken}
              onChange={(e) => setTelegramToken(e.target.value)}
              className="vitya-text-input"
              style={{
                width: "100%",
                padding: "10px 14px",
                borderRadius: "8px",
                background: "rgba(15, 23, 42, 0.6)",
                border: "1px solid rgba(255, 255, 255, 0.1)",
                color: "#f8fafc",
                fontSize: "14px",
              }}
            />
          </div>

          <div className="formGroup" style={{ marginBottom: "14px" }}>
            <label style={{ display: "block", fontSize: "13px", fontWeight: 600, marginBottom: "6px", color: "var(--text-main, #f8fafc)" }}>
              Your Chat ID / Channel ID
            </label>
            <input
              type="text"
              placeholder="e.g. 987654321"
              value={telegramChatId}
              onChange={(e) => setTelegramChatId(e.target.value)}
              className="vitya-text-input"
              style={{
                width: "100%",
                padding: "10px 14px",
                borderRadius: "8px",
                background: "rgba(15, 23, 42, 0.6)",
                border: "1px solid rgba(255, 255, 255, 0.1)",
                color: "#f8fafc",
                fontSize: "14px",
              }}
            />
          </div>

          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: "16px" }}>
            <label style={{ display: "flex", alignItems: "center", gap: "8px", cursor: "pointer", fontSize: "14px", color: "#94a3b8" }}>
              <input
                type="checkbox"
                checked={telegramActive}
                onChange={(e) => setTelegramActive(e.target.checked)}
              />
              Enable Telegram Notifications
            </label>
            <button
              type="submit"
              className="vitya-save-btn"
              disabled={saving}
              style={{
                padding: "8px 18px",
                background: "linear-gradient(135deg, #0ea5e9 0%, #0284c7 100%)",
                border: "none",
                borderRadius: "8px",
                color: "#fff",
                fontWeight: 600,
                cursor: "pointer",
              }}
            >
              {saving ? "Saving..." : "Save Telegram"}
            </button>
          </div>
        </form>
      </div>

      {/* WHATSAPP INTEGRATION */}
      <div className="vitya-settings-card" style={{ marginBottom: "20px" }}>
        <div className="vitya-card-header">
          <div className="vitya-header-icon" style={{ background: "rgba(34, 197, 94, 0.15)", color: "#22c55e" }}>
            💬
          </div>
          <div className="vitya-header-title-block">
            <h3>WhatsApp Agent</h3>
            <p>Receive proactive daily summaries and invoice alerts directly on WhatsApp.</p>
          </div>
        </div>

        <form onSubmit={handleSaveWhatsapp}>
          <div className="formGroup" style={{ marginBottom: "14px" }}>
            <label style={{ display: "block", fontSize: "13px", fontWeight: 600, marginBottom: "6px", color: "var(--text-main, #f8fafc)" }}>
              WhatsApp Phone Number (with country code)
            </label>
            <input
              type="tel"
              placeholder="+91 98765 43210"
              value={whatsappNumber}
              onChange={(e) => setWhatsappNumber(e.target.value)}
              className="vitya-text-input"
              style={{
                width: "100%",
                padding: "10px 14px",
                borderRadius: "8px",
                background: "rgba(15, 23, 42, 0.6)",
                border: "1px solid rgba(255, 255, 255, 0.1)",
                color: "#f8fafc",
                fontSize: "14px",
              }}
            />
          </div>

          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: "16px" }}>
            <label style={{ display: "flex", alignItems: "center", gap: "8px", cursor: "pointer", fontSize: "14px", color: "#94a3b8" }}>
              <input
                type="checkbox"
                checked={whatsappActive}
                onChange={(e) => setWhatsappActive(e.target.checked)}
              />
              Enable WhatsApp Dispatch
            </label>
            <button
              type="submit"
              className="vitya-save-btn"
              disabled={saving}
              style={{
                padding: "8px 18px",
                background: "linear-gradient(135deg, #22c55e 0%, #16a34a 100%)",
                border: "none",
                borderRadius: "8px",
                color: "#fff",
                fontWeight: 600,
                cursor: "pointer",
              }}
            >
              {saving ? "Saving..." : "Save WhatsApp"}
            </button>
          </div>
        </form>
      </div>

      {/* WEBHOOK / CUSTOM DISPATCH */}
      <div className="vitya-settings-card">
        <div className="vitya-card-header">
          <div className="vitya-header-icon" style={{ background: "rgba(168, 85, 247, 0.15)", color: "#a855f7" }}>
            🔗
          </div>
          <div className="vitya-header-title-block">
            <h3>Custom Automation Webhook</h3>
            <p>Trigger Zapier, Make, n8n, or your own server when Vitya actions are executed.</p>
          </div>
        </div>

        <form onSubmit={handleSaveWebhook}>
          <div className="formGroup" style={{ marginBottom: "14px" }}>
            <label style={{ display: "block", fontSize: "13px", fontWeight: 600, marginBottom: "6px", color: "var(--text-main, #f8fafc)" }}>
              Webhook Endpoint URL
            </label>
            <input
              type="url"
              placeholder="https://your-webhook-endpoint.com/vitya/events"
              value={webhookUrl}
              onChange={(e) => setWebhookUrl(e.target.value)}
              className="vitya-text-input"
              style={{
                width: "100%",
                padding: "10px 14px",
                borderRadius: "8px",
                background: "rgba(15, 23, 42, 0.6)",
                border: "1px solid rgba(255, 255, 255, 0.1)",
                color: "#f8fafc",
                fontSize: "14px",
              }}
            />
          </div>

          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: "16px" }}>
            <label style={{ display: "flex", alignItems: "center", gap: "8px", cursor: "pointer", fontSize: "14px", color: "#94a3b8" }}>
              <input
                type="checkbox"
                checked={webhookActive}
                onChange={(e) => setWebhookActive(e.target.checked)}
              />
              Enable Webhook Postbacks
            </label>
            <button
              type="submit"
              className="vitya-save-btn"
              disabled={saving}
              style={{
                padding: "8px 18px",
                background: "linear-gradient(135deg, #a855f7 0%, #9333ea 100%)",
                border: "none",
                borderRadius: "8px",
                color: "#fff",
                fontWeight: 600,
                cursor: "pointer",
              }}
            >
              {saving ? "Saving..." : "Save Webhook"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default BotIntegrationSection;
