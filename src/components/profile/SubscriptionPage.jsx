import React from "react";
import { useNavigate } from "react-router-dom";
import { PageShell, Button, styles } from "../auth/AuthCommon";

export function SubscriptionPage() {
  const navigate = useNavigate();

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
      subtitle="View your active tier, monitor usage, and manage your plan."
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

        {/* ACTIVE PLAN SUMMARY */}
        <div className="vitya-profile-card" style={{ marginBottom: 0 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 14 }}>
            <div>
              <div className="pro-badge" style={{ marginBottom: 8 }}>👑 Pro User Tier</div>
              <h2 style={{ fontSize: 24, margin: "4px 0", color: "#fff" }}>Your Current Plan: Pro User</h2>
              <p style={{ color: "rgba(255,255,255,0.6)", margin: 0, fontSize: 14 }}>
                Renews automatically on <strong style={{ color: "#fff" }}>September 30, 2026</strong>.
              </p>
            </div>
            <Button
              type="button"
              onClick={() => alert("Billing management portal opened!")}
              style={{ minWidth: 150 }}
            >
              💳 Manage Billing
            </Button>
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

            <div>
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: 13, color: "rgba(255,255,255,0.8)", marginBottom: 6 }}>
                <span>📁 Cloud Workspace Storage</span>
                <span>2.4 GB / 10 GB (24%)</span>
              </div>
              <div style={{ height: 8, borderRadius: 4, background: "rgba(255,255,255,0.1)", overflow: "hidden" }}>
                <div style={{ width: "24%", height: "100%", background: "linear-gradient(90deg, #10b981, #34d399)" }} />
              </div>
            </div>
          </div>
        </div>

        {/* PLAN TIERS */}
        <div style={styles.profileMain}>
          <h3 style={styles.mainHeading}>💎 Choose Your Plan</h3>
          <p style={styles.mainSubheading}>
            Select the plan that best fits your workflow requirements.
          </p>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: 16, marginTop: 18 }}>
            {plans.map((p, idx) => (
              <div
                key={idx}
                style={{
                  background: p.current ? "rgba(139, 92, 246, 0.12)" : "rgba(255, 255, 255, 0.03)",
                  border: p.current ? "1px solid rgba(139, 92, 246, 0.5)" : "1px solid rgba(255, 255, 255, 0.08)",
                  borderRadius: 20,
                  padding: 20,
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "space-between",
                }}
              >
                <div>
                  {p.badge && <div className="pro-badge" style={{ marginBottom: 10 }}>{p.badge}</div>}
                  <h4 style={{ fontSize: 20, margin: "0 0 6px", color: "#fff" }}>{p.name}</h4>
                  <div style={{ fontSize: 22, fontWeight: 800, color: "#c4b5fd", marginBottom: 8 }}>{p.price}</div>
                  <p style={{ fontSize: 13, color: "rgba(255,255,255,0.6)", lineHeight: 1.5 }}>{p.desc}</p>

                  <ul style={{ paddingLeft: 18, marginTop: 14, fontSize: 13, color: "rgba(255,255,255,0.8)", lineHeight: 1.8 }}>
                    {p.features.map((f, fIdx) => (
                      <li key={fIdx}>{f}</li>
                    ))}
                  </ul>
                </div>

                <div style={{ marginTop: 18 }}>
                  {p.current ? (
                    <Button type="button" variant="secondary" disabled style={{ width: "100%" }}>
                      Current Plan
                    </Button>
                  ) : (
                    <Button
                      type="button"
                      onClick={() => alert(`Upgrading to ${p.name}…`)}
                      style={{ width: "100%" }}
                    >
                      Choose {p.name}
                    </Button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </PageShell>
  );
}

export default SubscriptionPage;
