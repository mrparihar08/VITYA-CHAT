import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { PageShell } from "../auth/AuthCommon";
import { api, handleApiError } from "../../services/api";
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

  // Load from backend
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) return;

    api
      .get("/api/settings/")
      .then((res) => {
        if (res.data) {
          if (typeof res.data.email_alerts === "boolean") setEmailAlerts(res.data.email_alerts);
          if (typeof res.data.security_alerts === "boolean") setSecurityAlerts(res.data.security_alerts);
          if (typeof res.data.ai_updates === "boolean") setAiUpdates(res.data.ai_updates);
          if (typeof res.data.marketing === "boolean") setMarketing(res.data.marketing);
        }
      })
      .catch((err) => {
        console.warn("Could not load notification settings from backend", err);
      });
  }, []);

  const handleToggle = async (key, val, label) => {
    const stateSetters = {
      security_alerts: setSecurityAlerts,
      email_alerts: setEmailAlerts,
      ai_updates: setAiUpdates,
      marketing: setMarketing,
    };
    stateSetters[key]?.(val);

    const token = localStorage.getItem("token");
    if (token) {
      try {
        await api.put("/api/settings/", { [key]: val });
        showToast(`${label} ${val ? "Enabled" : "Disabled"}`);
      } catch (err) {
        showToast(handleApiError(err) || "Failed to update notification setting");
        stateSetters[key]?.(!val); // revert on failure
      }
    } else {
      showToast(`${label} ${val ? "Enabled" : "Disabled"} (local)`);
    }
  };

  const notificationOptions = [
    {
      id: "security_alerts",
      title: "🛡️ Security & Account Alerts",
      desc: "Receive immediate notifications for new logins, password changes, and 2FA activities.",
      checked: securityAlerts,
      label: "Security Alerts",
    },
    {
      id: "email_alerts",
      title: "📧 Email Digest & Summaries",
      desc: "Get periodic financial reports and chat history summaries delivered to your inbox.",
      checked: emailAlerts,
      label: "Email Digest",
    },
    {
      id: "ai_updates",
      title: "🤖 AI Assistant & Product Updates",
      desc: "Stay notified when new AI models, presentation tools, or apps are released.",
      checked: aiUpdates,
      label: "AI Updates",
    },
    {
      id: "marketing",
      title: "🎁 Tips & Productivity Offers",
      desc: "Occasional updates about productivity tips and special Vitya.AI workspace features.",
      checked: marketing,
      label: "Offers & Tips",
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
            <div className="vitya-header-icon bg-indigo">🔔</div>
            <div className="vitya-header-title-block">
              <h3>Notification Channels & Delivery</h3>
              <p>Configure which alerts and automated reports are delivered to your devices and inbox.</p>
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
                    onChange={(e) => handleToggle(opt.id, e.target.checked, opt.label)}
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
