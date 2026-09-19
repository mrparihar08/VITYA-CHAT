import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { PageShell } from "../auth/AuthCommon";
import { api, handleApiError } from "../../services/api";
import "../auth/Auth.css";

export function SubscriptionPage({ insideDashboard = false }) {
  const navigate = useNavigate();
  const [toastMsg, setToastMsg] = useState("");
  const [activePlan, setActivePlan] = useState("Pro User");
  const [subData, setSubData] = useState({
    ai_quota_used: 142,
    ai_quota_total: 1000,
    storage_used_gb: 1.2,
    storage_total_gb: 10,
  });
  const [loading, setLoading] = useState(false);

  const showToast = (msg) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(""), 3500);
  };

  // Fetch subscription from backend
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) return;

    api
      .get("/api/settings/subscription")
      .then((res) => {
        if (res.data) {
          if (res.data.plan_name) setActivePlan(res.data.plan_name);
          setSubData({
            ai_quota_used: res.data.ai_quota_used ?? 142,
            ai_quota_total: res.data.ai_quota_total ?? 1000,
            storage_used_gb: res.data.storage_used_gb ?? 1.2,
            storage_total_gb: res.data.storage_total_gb ?? 10,
          });
        }
      })
      .catch((e) => console.warn("Could not fetch subscription", e));
  }, []);

  const handleSelectPlan = async (planName) => {
    if (planName === activePlan) return;

    const token = localStorage.getItem("token");
    if (!token) {
      showToast("Please login to select a plan.");
      return;
    }

    setLoading(true);
    try {
      const res = await api.post("/api/settings/subscription/select", {
        plan_name: planName,
      });
      setActivePlan(planName);
      showToast(res.data?.message || `Activated ${planName}!`);
    } catch (err) {
      showToast(handleApiError(err) || "Failed to update subscription");
    } finally {
      setLoading(false);
    }
  };

  const plans = [
    {
      name: "Free Tier",
      price: "$0 / month",
      desc: "Essential features for individuals getting started.",
      features: ["100 AI Queries / mo", "Basic Presentation Studio", "1 GB Storage"],
    },
    {
      name: "Pro User",
      badge: "👑 Most Popular",
      price: "$19 / month",
      desc: "Full access to Vitya.AI finance assistant & presentation suite.",
      features: [
        "1,000 AI Queries / mo",
        "Unlimited Presentations",
        "10 GB Cloud Storage",
        "Priority Support & Fast Generation",
      ],
    },
    {
      name: "Enterprise",
      price: "$49 / month",
      desc: "For teams requiring custom integrations & unlimited power.",
      features: [
        "Unlimited AI Queries",
        "Custom Workflows & APIs",
        "100 GB Cloud Storage",
        "24/7 Dedicated Account Support",
      ],
    },
  ];

  const quotaPercent = Math.min(
    100,
    Math.round((subData.ai_quota_used / (subData.ai_quota_total || 1)) * 100)
  );
  const storagePercent = Math.min(
    100,
    Math.round((subData.storage_used_gb / (subData.storage_total_gb || 1)) * 100)
  );

  return (
    <PageShell
      title="Subscription & Billing"
      subtitle="Manage your subscription plan, billing details, and API quotas synced with MOTHER."
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
            <span>Profile</span> <span className="bcSep">/</span> <strong className="bcCurrent">Subscription & Billing</strong>
          </div>
        </div>

        {/* ACTIVE SUBSCRIPTION OVERVIEW */}
        <div className="vitya-settings-card">
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: 16 }}>
            <div>
              <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 6 }}>
                <span className="pro-badge" style={{ fontSize: 12 }}>Active Plan</span>
                <h3 style={{ margin: 0, fontSize: 20 }}>{activePlan}</h3>
              </div>
              <p style={{ color: "rgba(255,255,255,0.6)", margin: 0, fontSize: 13.5 }}>
                Renews automatically each month. Synced with your cloud workspace.
              </p>
            </div>
            <button
              type="button"
              className="vitya-save-btn"
              onClick={() => showToast("Billing portal link generated!")}
            >
              💳 Manage Billing
            </button>
          </div>

          {/* USAGE METRICS */}
          <div style={{ marginTop: 24, display: "grid", gap: 16 }}>
            <div>
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: 13, color: "rgba(255,255,255,0.8)", marginBottom: 6 }}>
                <span>🤖 AI Assistant Queries</span>
                <span>{subData.ai_quota_used} / {subData.ai_quota_total.toLocaleString()} ({quotaPercent}%)</span>
              </div>
              <div style={{ height: 8, borderRadius: 4, background: "rgba(255,255,255,0.1)", overflow: "hidden" }}>
                <div style={{ width: `${quotaPercent}%`, height: "100%", background: "linear-gradient(90deg, #8b5cf6, #6366f1)" }} />
              </div>
            </div>

            <div>
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: 13, color: "rgba(255,255,255,0.8)", marginBottom: 6 }}>
                <span>💾 Cloud Storage Usage</span>
                <span>{subData.storage_used_gb} GB / {subData.storage_total_gb} GB ({storagePercent}%)</span>
              </div>
              <div style={{ height: 8, borderRadius: 4, background: "rgba(255,255,255,0.1)", overflow: "hidden" }}>
                <div style={{ width: `${storagePercent}%`, height: "100%", background: "linear-gradient(90deg, #3b82f6, #60a5fa)" }} />
              </div>
            </div>
          </div>
        </div>

        {/* PLAN TIERS GRID */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))", gap: 16 }}>
          {plans.map((p) => {
            const isCurrent = p.name.toLowerCase() === activePlan.toLowerCase();
            return (
              <div key={p.name} className="vitya-settings-card" style={{ display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
                <div>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <h3 style={{ fontSize: 18, color: "#fff", margin: 0 }}>{p.name}</h3>
                    {isCurrent ? (
                      <span className="pro-badge" style={{ fontSize: 11, padding: "3px 8px" }}>👑 Active Plan</span>
                    ) : p.badge ? (
                      <span className="pro-badge" style={{ fontSize: 11, padding: "3px 8px", background: "rgba(255,255,255,0.1)" }}>{p.badge}</span>
                    ) : null}
                  </div>
                  <div style={{ fontSize: 20, fontWeight: 800, color: "#c4b5fd", margin: "10px 0" }}>{p.price}</div>
                  <p style={{ fontSize: 12.5, color: "rgba(255,255,255,0.6)", lineHeight: 1.5 }}>{p.desc}</p>
                  <ul style={{ paddingLeft: 18, margin: "14px 0", fontSize: 13, color: "rgba(255,255,255,0.8)", lineHeight: 1.8 }}>
                    {p.features.map((f) => (
                      <li key={f}>{f}</li>
                    ))}
                  </ul>
                </div>
                <button
                  type="button"
                  className="vitya-save-btn"
                  disabled={isCurrent || loading}
                  style={{
                    width: "100%",
                    marginTop: 14,
                    opacity: isCurrent ? 0.6 : 1,
                    background: isCurrent ? "rgba(255,255,255,0.08)" : undefined,
                    border: isCurrent ? "1px solid rgba(255,255,255,0.15)" : undefined,
                  }}
                  onClick={() => handleSelectPlan(p.name)}
                >
                  {isCurrent ? "Current Plan" : "Select Plan"}
                </button>
              </div>
            );
          })}
        </div>
      </div>
    </PageShell>
  );
}

export default SubscriptionPage;
