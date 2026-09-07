import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { PageShell } from "../auth/AuthCommon";
import "../auth/Auth.css";

export function NotificationsPage({ insideDashboard = false }) {
  const navigate = useNavigate();
  const [emailAlerts, setEmailAlerts] = useState(true);
  const [securityAlerts, setSecurityAlerts] = useState(true);
  const [aiUpdates, setAiUpdates] = useState(true);
  const [marketing, setMarketing] = useState(false);
  const [toastMsg, setToastMsg] = useState("");

  const showToast = (msg) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(""), 3500);
  };

  const notificationOptions = [
    {
      id: "security",
      title: "🛡️ Security & Account Alerts",
      desc: "Receive immediate notifications for new logins, password changes, and 2FA activities.",
      checked: securityAlerts,
      onChange: setSecurityAlerts,
    },
    {
      id: "email",
      title: "📧 Email Digest & Summaries",
      desc: "Get periodic financial reports and chat history summaries delivered to your inbox.",
      checked: emailAlerts,
      onChange: setEmailAlerts,
    },
    {
      id: "ai",
      title: "🤖 AI Assistant & Product Updates",
      desc: "Stay notified when new AI models, presentation tools, or apps are released.",
      checked: aiUpdates,
      onChange: setAiUpdates,
    },
    {
      id: "tips",
      title: "🎁 Tips & Productivity Offers",
      desc: "Occasional updates about productivity tips and special Vitya.AI workspace features.",
      checked: marketing,
      onChange: setMarketing,
    },
  ];

  return (
    <PageShell
      title="Notifications & Alerts"
      subtitle="Manage your email, security, and AI notification preferences."
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
            <span>Profile</span> <span className="bcSep">/</span> <strong className="bcCurrent">Notifications & Alerts</strong>
          </div>
        </div>

        <div className="vitya-settings-card">
          <div className="vitya-card-header">
            <div className="vitya-header-icon bg-amber">🔔</div>
            <div className="vitya-header-title-block">
              <h3>Notification Preferences</h3>
              <p>Toggle individual alerts and summary reports</p>
            </div>
          </div>

          <div className="vitya-settings-list">
            {notificationOptions.map((opt) => (
              <div key={opt.id} className="vitya-setting-item item-toggle">
                <div className="item-left" style={{ flex: 1, paddingRight: 16 }}>
                  <span className="item-icon" style={{ fontSize: 20 }}>{opt.title.split(" ")[0]}</span>
                  <div>
                    <div className="item-label">{opt.title.substring(opt.title.indexOf(" ") + 1)}</div>
                    <div style={{ fontSize: 12, color: "rgba(255,255,255,0.55)", marginTop: 2 }}>{opt.desc}</div>
                  </div>
                </div>
                <label className="vitya-switch">
                  <input
                    type="checkbox"
                    checked={opt.checked}
                    onChange={(e) => {
                      opt.onChange(e.target.checked);
                      showToast(`${opt.title.substring(opt.title.indexOf(" ") + 1)} ${e.target.checked ? "Enabled" : "Disabled"}`);
                    }}
                  />
                  <span className="slider round" />
                </label>
              </div>
            ))}
          </div>
        </div>
      </div>
    </PageShell>
  );
}

export default NotificationsPage;
