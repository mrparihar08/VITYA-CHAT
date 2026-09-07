import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { PageShell, Button, styles } from "../auth/AuthCommon";

export function NotificationsPage() {
  const navigate = useNavigate();
  const [emailAlerts, setEmailAlerts] = useState(true);
  const [securityAlerts, setSecurityAlerts] = useState(true);
  const [aiUpdates, setAiUpdates] = useState(true);
  const [marketing, setMarketing] = useState(false);
  const [frequency, setFrequency] = useState("realtime");
  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => {
      alert("Notification preferences saved successfully!");
      setSaved(false);
    }, 400);
  };

  const notificationOptions = [
    {
      title: "🛡️ Security & Account Alerts",
      desc: "Receive immediate notifications for new logins, password changes, and 2FA activities.",
      checked: securityAlerts,
      onChange: setSecurityAlerts,
    },
    {
      title: "📧 Email Digest & Summaries",
      desc: "Get periodic financial reports and chat history summaries delivered to your inbox.",
      checked: emailAlerts,
      onChange: setEmailAlerts,
    },
    {
      title: "🤖 AI Assistant & Product Updates",
      desc: "Stay notified when new AI models, presentation tools, or apps are released.",
      checked: aiUpdates,
      onChange: setAiUpdates,
    },
    {
      title: "🎁 Tips & Promotional Offers",
      desc: "Occasional updates about productivity tips and special Vitya.AI workspace features.",
      checked: marketing,
      onChange: setMarketing,
    },
  ];

  return (
    <PageShell
      title="Notifications & Alerts"
      subtitle="Manage your email, security, and AI notification preferences."
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

        <div style={styles.profileMain}>
          <h3 style={styles.mainHeading}>🔔 Alert Preferences</h3>
          <p style={styles.mainSubheading}>
            Toggle notification channels on or off according to your preference.
          </p>

          <div style={{ display: "grid", gap: 14, marginTop: 18 }}>
            {notificationOptions.map((opt, idx) => (
              <div
                key={idx}
                className="vitya-menu-item"
                onClick={() => opt.onChange(!opt.checked)}
                style={{ cursor: "pointer" }}
              >
                <div className="vitya-menu-left">
                  <div>
                    <div className="vitya-menu-title">{opt.title}</div>
                    <div className="vitya-menu-sub">{opt.desc}</div>
                  </div>
                </div>
                <input
                  type="checkbox"
                  checked={opt.checked}
                  onChange={(e) => opt.onChange(e.target.checked)}
                  style={{ width: 20, height: 20, cursor: "pointer", accentColor: "#8b5cf6" }}
                />
              </div>
            ))}
          </div>

          <h3 style={{ ...styles.mainHeading, marginTop: 28 }}>⏱️ Notification Frequency</h3>
          <p style={styles.mainSubheading}>
            Choose how frequently non-critical notification summaries should be sent.
          </p>

          <div style={{ display: "flex", gap: 12, flexWrap: "wrap", marginTop: 14 }}>
            {[
              { id: "realtime", label: "⚡ Real-time (Instant)" },
              { id: "daily", label: "📅 Daily Digest" },
              { id: "weekly", label: "🗓️ Weekly Summary" },
            ].map((f) => (
              <button
                key={f.id}
                type="button"
                className={frequency === f.id ? "vitya-btn-purple" : "vitya-btn-outline"}
                onClick={() => setFrequency(f.id)}
                style={{ padding: "10px 18px", minHeight: 44, fontSize: 14 }}
              >
                {f.label}
              </button>
            ))}
          </div>

          <div style={{ marginTop: 24 }}>
            <Button type="button" onClick={handleSave} disabled={saved} style={{ padding: "12px 24px" }}>
              {saved ? "Saving..." : "Save Preferences"}
            </Button>
          </div>
        </div>
      </div>
    </PageShell>
  );
}

export default NotificationsPage;
