import React, { useEffect, useState } from "react";
import {
  getExistingPushSubscription,
  subscribeToPushNotifications,
  unsubscribeFromPushNotifications,
  notificationApi,
} from "../../services/notificationService";
import { handleApiError } from "../../services/api";

export default function PushSubscriptionManager() {
  const [supported, setSupported] = useState(true);
  const [permission, setPermission] = useState("default");
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [loading, setLoading] = useState(false);
  const [testLoading, setTestLoading] = useState(false);
  const [message, setMessage] = useState({ text: "", type: "" });

  const showMessage = (text, type = "success") => {
    setMessage({ text, type });
    setTimeout(() => setMessage({ text: "", type: "" }), 4500);
  };

  useEffect(() => {
    const isPushSupported =
      typeof window !== "undefined" &&
      "serviceWorker" in navigator &&
      "Notification" in window &&
      "PushManager" in window;

    setSupported(isPushSupported);

    if (isPushSupported) {
      setPermission(Notification.permission);
      getExistingPushSubscription().then((sub) => {
        setIsSubscribed(!!sub);
      });
    }
  }, []);

  const handleSubscribe = async () => {
    if (!supported) return;

    const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;
    if (!token) {
      showMessage("Please log in to your account to enable Web Push alerts.", "error");
      return;
    }

    setLoading(true);
    try {
      await subscribeToPushNotifications();
      setIsSubscribed(true);
      setPermission(Notification.permission);
      showMessage("Web Push notifications enabled successfully!");
    } catch (err) {
      const currentPerm = typeof Notification !== "undefined" ? Notification.permission : "default";
      setPermission(currentPerm);
      if (currentPerm === "denied") {
        showMessage("Notification permission was denied in your browser settings. Please allow notifications in site settings.", "error");
      } else {
        const errorMsg = handleApiError(err) || err.message || "Failed to enable notifications.";
        showMessage(errorMsg, "error");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleUnsubscribe = async () => {
    setLoading(true);
    try {
      await unsubscribeFromPushNotifications();
      setIsSubscribed(false);
      showMessage("Web Push notifications disabled for this device.");
    } catch (err) {
      showMessage("Failed to disable push notifications.", "error");
    } finally {
      setLoading(false);
    }
  };

  const handleSendTest = async () => {
    setTestLoading(true);
    try {
      await notificationApi.sendTestPush({
        title: "Vitya AI Test Push",
        body: "Your Web Push notifications are active and delivering in real time!",
      });
      showMessage("Test notification dispatched! Check your notifications.");
    } catch (err) {
      // Fallback: If backend dispatch encounters an issue, display local notification via Service Worker
      if (typeof Notification !== "undefined" && Notification.permission === "granted" && "serviceWorker" in navigator) {
        try {
          const reg = await navigator.serviceWorker.ready;
          if (reg && reg.showNotification) {
            reg.showNotification("Vitya AI Test Push", {
              body: "Your Web Push notifications are active and delivering in real time!",
              icon: "/favicon.ico",
              badge: "/favicon.ico",
              tag: `test-push-${Date.now()}`,
            });
            showMessage("Test notification displayed in your browser!");
            return;
          }
        } catch (swErr) {
          console.warn("Local SW notification failed:", swErr);
        }
      }
      showMessage(err.response?.data?.detail || handleApiError(err) || "Failed to dispatch test notification.", "error");
    } finally {
      setTestLoading(false);
    }
  };

  if (!supported) {
    return (
      <div className="vitya-settings-card" style={{ marginTop: "20px" }}>
        <div className="vitya-card-header">
          <div className="vitya-header-icon bg-indigo">⚠️</div>
          <div className="vitya-header-title-block">
            <h3>Web Push Notifications</h3>
            <p style={{ color: "#f87171" }}>
              Web Push notifications are not supported in your current browser or private browsing mode.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="vitya-settings-card" style={{ marginTop: "20px" }}>
      <div className="vitya-card-header">
        <div className="vitya-header-icon bg-indigo">🔔</div>
        <div className="vitya-header-title-block">
          <h3>Browser Web Push</h3>
          <p>Receive real-time updates for presentation completions, receipt scans, and task reminders even when the app is in the background.</p>
        </div>
      </div>

      <div style={{ padding: "18px 24px" }}>
        {message.text && (
          <div
            style={{
              padding: "10px 14px",
              borderRadius: "8px",
              marginBottom: "16px",
              fontSize: "13px",
              background: message.type === "error" ? "rgba(239, 68, 68, 0.15)" : "rgba(16, 185, 129, 0.15)",
              border: `1px solid ${message.type === "error" ? "rgba(239, 68, 68, 0.3)" : "rgba(16, 185, 129, 0.3)"}`,
              color: message.type === "error" ? "#fca5a5" : "#6ee7b7",
            }}
          >
            {message.type === "error" ? "⚠️ " : "✓ "}
            {message.text}
          </div>
        )}

        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: "12px" }}>
          <div>
            <div style={{ fontWeight: 600, fontSize: "14px", color: "#f8fafc" }}>
              Push Status:{" "}
              <span
                style={{
                  color: isSubscribed ? "#34d399" : permission === "denied" ? "#f87171" : "#94a3b8",
                }}
              >
                {isSubscribed ? "Active & Subscribed" : permission === "denied" ? "Blocked by Browser" : "Not Enabled"}
              </span>
            </div>
            <div style={{ fontSize: "12px", color: "rgba(255, 255, 255, 0.55)", marginTop: "4px" }}>
              {permission === "denied"
                ? "Notifications are blocked. Click the lock/info icon in your browser URL bar to allow notifications."
                : isSubscribed
                ? "This browser is registered to receive background push notifications."
                : "Click enable to register this browser for Web Push alerts."}
            </div>
          </div>

          <div style={{ display: "flex", gap: "10px" }}>
            {isSubscribed ? (
              <>
                <button
                  type="button"
                  onClick={handleSendTest}
                  disabled={testLoading}
                  style={{
                    background: "rgba(255, 255, 255, 0.08)",
                    border: "1px solid rgba(255, 255, 255, 0.15)",
                    borderRadius: "8px",
                    color: "#c4b5fd",
                    padding: "8px 14px",
                    fontSize: "12.5px",
                    fontWeight: 600,
                    cursor: testLoading ? "wait" : "pointer",
                  }}
                >
                  {testLoading ? "Sending..." : "Test Push"}
                </button>
                <button
                  type="button"
                  onClick={handleUnsubscribe}
                  disabled={loading}
                  style={{
                    background: "rgba(239, 68, 68, 0.15)",
                    border: "1px solid rgba(239, 68, 68, 0.3)",
                    borderRadius: "8px",
                    color: "#fca5a5",
                    padding: "8px 14px",
                    fontSize: "12.5px",
                    fontWeight: 600,
                    cursor: loading ? "wait" : "pointer",
                  }}
                >
                  {loading ? "Disabling..." : "Disable"}
                </button>
              </>
            ) : (
              <button
                type="button"
                onClick={handleSubscribe}
                disabled={loading || permission === "denied"}
                style={{
                  background: "linear-gradient(135deg, #8b5cf6 0%, #6366f1 100%)",
                  border: "none",
                  borderRadius: "8px",
                  color: "#ffffff",
                  padding: "8px 18px",
                  fontSize: "13px",
                  fontWeight: 600,
                  cursor: loading || permission === "denied" ? "not-allowed" : "pointer",
                  opacity: permission === "denied" ? 0.6 : 1,
                  boxShadow: "0 4px 12px rgba(139, 92, 246, 0.3)",
                }}
              >
                {loading ? "Enabling..." : "Enable Push Notifications"}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
