import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { PageShell } from "../auth/AuthCommon";
import "../auth/Auth.css";

export function SubscriptionPage({ insideDashboard = false }) {
  const navigate = useNavigate();
  const [toastMsg, setToastMsg] = useState("");

  const showToast = (msg) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(""), 3500);
  };

  const plans = [
    {
      name: "Free Tier",
      price: "$0 / month",
      desc: "Essential features for individuals getting started.",
      features: ["100 AI Queries / mo", "Basic Presentation Studio", "1 GB Storage"],
      current: false,
    },
    {
      name: "Pro User",
      badge: "👑 Active Plan",
      price: "$19 / month",
      desc: "Full access to Vitya.AI finance assistant workspace.",
      features: [
        "1,000 AI Queries / mo",
        "Unlimited Presentations",
        "10 GB Cloud Storage",
        "Priority Support & Fast Generation",
      ],
      current: true,
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
      current: false,
    },
  ];

  return (
    <PageShell
      title="Subscription & Billing"
      subtitle="Manage your subscription plan, billing details, and API quotas."
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

        {/* ACTIVE PLAN SUMMARY */}
        <div className="vitya-profile-card">
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 14 }}>
            <div>
              <div className="pro-badge" style={{ marginBottom: 8 }}>👑 Pro User Tier</div>
              <h2 style={{ fontSize: 22, margin: "4px 0", color: "#fff" }}>Your Current Plan: Pro User</h2>
              <p style={{ color: "rgba(255,255,255,0.6)", margin: 0, fontSize: 13.5 }}>
                Renews automatically on <strong style={{ color: "#fff" }}>September 30, 2026</strong>.
              </p>
            </div>
            <button
              type="button"
              className="vitya-save-btn"
              onClick={() => showToast("Billing portal opened!")}
            >
              💳 Manage Billing
            </button>
          </div>

          {/* USAGE METRICS */}
          <div style={{ marginTop: 24, display: "grid", gap: 16 }}>
            <div>
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: 13, color: "rgba(255,255,255,0.8)", marginBottom: 6 }}>
                <span>🤖 AI Assistant Queries</span>
                <span>850 / 1,000 (85%)</span>
              </div>
              <div style={{ height: 8, borderRadius: 4, background: "rgba(255,255,255,0.1)", overflow: "hidden" }}>
                <div style={{ width: "85%", height: "100%", background: "linear-gradient(90deg, #8b5cf6, #6366f1)" }} />
              </div>
            </div>

            <div>
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: 13, color: "rgba(255,255,255,0.8)", marginBottom: 6 }}>
                <span>📊 Presentation Studio Generation</span>
                <span>42 / 100 (42%)</span>
              </div>
              <div style={{ height: 8, borderRadius: 4, background: "rgba(255,255,255,0.1)", overflow: "hidden" }}>
                <div style={{ width: "42%", height: "100%", background: "linear-gradient(90deg, #3b82f6, #60a5fa)" }} />
              </div>
            </div>
          </div>
        </div>

        {/* PLAN TIERS GRID */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))", gap: 16 }}>
          {plans.map((p) => (
            <div key={p.name} className="vitya-settings-card" style={{ display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
              <div>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <h3 style={{ fontSize: 18, color: "#fff", margin: 0 }}>{p.name}</h3>
                  {p.badge && <span className="pro-badge" style={{ fontSize: 11, padding: "3px 8px" }}>{p.badge}</span>}
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
                disabled={p.current}
                style={{
                  width: "100%",
                  marginTop: 14,
                  opacity: p.current ? 0.6 : 1,
                  background: p.current ? "rgba(255,255,255,0.08)" : undefined,
                  border: p.current ? "1px solid rgba(255,255,255,0.15)" : undefined,
                }}
                onClick={() => showToast(`Selected plan: ${p.name}`)}
              >
                {p.current ? "Current Plan" : "Upgrade Plan"}
              </button>
            </div>
          ))}
        </div>
      </div>
    </PageShell>
  );
}

export default SubscriptionPage;
