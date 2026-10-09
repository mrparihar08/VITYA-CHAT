import React, { useState, useEffect, useCallback } from "react";
import {
  getFinancialHealthScore,
  getFinancialExecutiveSummary,
  getBudgetCaps,
  getBudgetAlerts,
  createOrUpdateBudgetCap,
  getSpendingWasteAnalysis,
  getExpensePrediction,
  getFinancialAdvisor,
} from "../../services/api";
import "./FinancialHealthApp.css";

const CATEGORIES = [
  "Food",
  "Travel",
  "Rent",
  "Shopping",
  "Bills",
  "Entertainment",
  "Health",
  "Other",
];

const FinancialHealthApp = () => {
  const [healthData, setHealthData] = useState(null);
  const [executiveSummary, setExecutiveSummary] = useState(null);
  const [budgetCaps, setBudgetCaps] = useState([]);
  const [budgetAlerts, setBudgetAlerts] = useState([]);
  const [wasteData, setWasteData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  // Budget Cap Form
  const [capCategory, setCapCategory] = useState("Food");
  const [capLimit, setCapLimit] = useState("");
  const [capSaving, setCapSaving] = useState(false);

  // Prediction & Advisor State
  const [predictCategory, setPredictCategory] = useState("Food");
  const [prediction, setPrediction] = useState(null);
  const [predictLoading, setPredictLoading] = useState(false);
  const [advisorCategory, setAdvisorCategory] = useState("Food");
  const [advice, setAdvice] = useState(null);
  const [adviceLoading, setAdviceLoading] = useState(false);

  const fetchHealthData = useCallback(async () => {
    setLoading(true);
    try {
      const [scoreRes, summaryRes, capsRes, alertsRes, wasteRes] = await Promise.allSettled([
        getFinancialHealthScore(),
        getFinancialExecutiveSummary(),
        getBudgetCaps(),
        getBudgetAlerts(),
        getSpendingWasteAnalysis(),
      ]);

      if (scoreRes.status === "fulfilled") setHealthData(scoreRes.value);
      if (summaryRes.status === "fulfilled") setExecutiveSummary(summaryRes.value);
      if (capsRes.status === "fulfilled") setBudgetCaps(Array.isArray(capsRes.value) ? capsRes.value : []);
      if (alertsRes.status === "fulfilled") setBudgetAlerts(Array.isArray(alertsRes.value) ? alertsRes.value : []);
      if (wasteRes.status === "fulfilled") setWasteData(Array.isArray(wasteRes.value) ? wasteRes.value : []);
    } catch (err) {
      console.error("Failed to load financial health intelligence", err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchHealthData();
  }, [fetchHealthData]);

  const handleRefresh = async () => {
    setRefreshing(true);
    try {
      await fetchHealthData();
    } finally {
      setRefreshing(false);
    }
  };

  const handleSetBudgetCap = async (e) => {
    e.preventDefault();
    if (!capLimit || Number(capLimit) <= 0) return;
    setCapSaving(true);
    try {
      await createOrUpdateBudgetCap({
        category: capCategory,
        monthly_limit: parseFloat(capLimit),
      });
      setCapLimit("");
      const [capsRes, alertsRes] = await Promise.all([getBudgetCaps(), getBudgetAlerts()]);
      setBudgetCaps(Array.isArray(capsRes) ? capsRes : []);
      setBudgetAlerts(Array.isArray(alertsRes) ? alertsRes : []);
      alert(`Budget cap for ${capCategory} set to $${capLimit}`);
    } catch (err) {
      alert("Failed to save budget cap.");
    } finally {
      setCapSaving(false);
    }
  };

  const handlePredict = async () => {
    setPredictLoading(true);
    try {
      const res = await getExpensePrediction(predictCategory);
      setPrediction(res);
    } catch (err) {
      setPrediction({ status: "error", message: "Failed to fetch prediction." });
    } finally {
      setPredictLoading(false);
    }
  };

  const handleGetAdvice = async () => {
    setAdviceLoading(true);
    try {
      const res = await getFinancialAdvisor(advisorCategory);
      setAdvice(res);
    } catch (err) {
      setAdvice({ status: "error", message: "Failed to generate AI advice." });
    } finally {
      setAdviceLoading(false);
    }
  };

  const getScoreColor = (score) => {
    if (score >= 80) return "#10b981";
    if (score >= 60) return "#3b82f6";
    if (score >= 40) return "#f59e0b";
    return "#ef4444";
  };

  const getGradeClass = (grade) => {
    if (!grade) return "fair";
    const g = grade.toLowerCase();
    if (g.includes("excellent")) return "excellent";
    if (g.includes("good")) return "good";
    if (g.includes("fair")) return "fair";
    return "needs-attention";
  };

  return (
    <div className="vitya-health-app">
      <div className="health-header">
        <div>
          <h2 className="health-title">⚡ AI Financial Health & Predictive Intelligence</h2>
          <p className="health-subtitle">
            Autonomous AI audit of your income, spending efficiency, budget adherence, predictions, and anomalies.
          </p>
        </div>
        <button
          className="health-refresh-btn"
          onClick={handleRefresh}
          disabled={refreshing || loading}
        >
          {refreshing ? "🔄 Analyzing..." : "🔄 Refresh Intelligence"}
        </button>
      </div>

      {loading ? (
        <div style={{ color: "rgba(255,255,255,0.6)", padding: 40, textAlign: "center" }}>
          <p style={{ fontSize: 18 }}>🧠 AI is computing your financial health score, predictions, and leaks...</p>
        </div>
      ) : !healthData ? (
        <div style={{ padding: 40, textAlign: "center", background: "rgba(30,41,59,0.4)", borderRadius: 16 }}>
          <h3>Financial Data Initializing</h3>
          <p style={{ color: "rgba(255,255,255,0.6)" }}>
            Log income and expenses in the Finance app to generate your AI Health Score.
          </p>
        </div>
      ) : (
        <>
          {/* SCORE BANNER */}
          <div className="health-score-banner">
            <div
              className="score-gauge-circle"
              style={{
                border: `4px solid ${getScoreColor(healthData.health_score)}`,
                boxShadow: `0 0 25px ${getScoreColor(healthData.health_score)}40`,
              }}
            >
              <span
                className="score-value"
                style={{ color: getScoreColor(healthData.health_score) }}
              >
                {healthData.health_score}
              </span>
              <span className="score-max">/ 100</span>
            </div>

            <div className="score-info">
              <div className="score-top-row">
                <h3 className="score-grade-title">
                  Financial Health: {healthData.health_grade}
                </h3>
                <span className={`grade-tag ${getGradeClass(healthData.health_grade)}`}>
                  {healthData.health_grade}
                </span>
              </div>
              <p className="score-summary-text">{healthData.summary}</p>
            </div>
          </div>

          {/* AI EXECUTIVE SUMMARY */}
          {executiveSummary && (
            <div className="health-briefing-card">
              <div className="briefing-header">
                <span className="ai-badge">🤖 AI BRIEFING</span>
                <span className="briefing-status">
                  Status: <strong>{executiveSummary.financial_status}</strong>
                </span>
              </div>
              <p className="briefing-body">{executiveSummary.executive_summary}</p>

              {executiveSummary.key_actions && executiveSummary.key_actions.length > 0 && (
                <div className="briefing-actions">
                  <h4>💡 Immediate Action Items:</h4>
                  <ul>
                    {executiveSummary.key_actions.map((act, i) => (
                      <li key={i}>{act}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          )}

          {/* SUB-METRICS BREAKDOWN GRID */}
          <div className="metrics-breakdown-grid">
            <div className="metric-card">
              <div className="metric-header">
                <span className="metric-title">Savings Rate Score</span>
                <span className="metric-score">
                  {healthData.breakdown?.savings_score ?? "—"} / 30
                </span>
              </div>
              <div className="metric-bar-bg">
                <div
                  className="metric-bar-fill"
                  style={{
                    width: `${((healthData.breakdown?.savings_score || 0) / 30) * 100}%`,
                    background: "#10b981",
                  }}
                />
              </div>
            </div>

            <div className="metric-card">
              <div className="metric-header">
                <span className="metric-title">Expense Stability Score</span>
                <span className="metric-score">
                  {healthData.breakdown?.expense_ratio_score ?? "—"} / 30
                </span>
              </div>
              <div className="metric-bar-bg">
                <div
                  className="metric-bar-fill"
                  style={{
                    width: `${((healthData.breakdown?.expense_ratio_score || 0) / 30) * 100}%`,
                    background: "#3b82f6",
                  }}
                />
              </div>
            </div>

            <div className="metric-card">
              <div className="metric-header">
                <span className="metric-title">Budget Discipline</span>
                <span className="metric-score">
                  {healthData.breakdown?.budget_discipline_score ?? "—"} / 20
                </span>
              </div>
              <div className="metric-bar-bg">
                <div
                  className="metric-bar-fill"
                  style={{
                    width: `${((healthData.breakdown?.budget_discipline_score || 0) / 20) * 100}%`,
                    background: "#f59e0b",
                  }}
                />
              </div>
            </div>

            <div className="metric-card">
              <div className="metric-header">
                <span className="metric-title">Subscription Load</span>
                <span className="metric-score">
                  {healthData.breakdown?.subscription_burden_score ?? "—"} / 20
                </span>
              </div>
              <div className="metric-bar-bg">
                <div
                  className="metric-bar-fill"
                  style={{
                    width: `${((healthData.breakdown?.subscription_burden_score || 0) / 20) * 100}%`,
                    background: "#8b5cf6",
                  }}
                />
              </div>
            </div>
          </div>

          {/* AI BUDGET CAPS & ACTIVE ALERTS */}
          <div style={{ marginTop: 24, display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(340px, 1fr))", gap: 20 }}>
            {/* BUDGET CAP FORM & ALERTS */}
            <div className="health-briefing-card" style={{ margin: 0 }}>
              <div className="briefing-header">
                <span className="ai-badge">🎯 BUDGET CAPS & THRESHOLDS</span>
              </div>
              <form onSubmit={handleSetBudgetCap} style={{ display: "flex", gap: 10, marginTop: 14, flexWrap: "wrap" }}>
                <select
                  value={capCategory}
                  onChange={(e) => setCapCategory(e.target.value)}
                  style={{ background: "#1e293b", border: "1px solid #334155", color: "#fff", padding: "8px 12px", borderRadius: 8 }}
                >
                  {CATEGORIES.map((c) => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
                <input
                  type="number"
                  placeholder="Monthly limit ($)"
                  value={capLimit}
                  onChange={(e) => setCapLimit(e.target.value)}
                  style={{ background: "#1e293b", border: "1px solid #334155", color: "#fff", padding: "8px 12px", borderRadius: 8, flex: 1, minWidth: 120 }}
                  required
                />
                <button
                  type="submit"
                  disabled={capSaving}
                  style={{ background: "#10b981", color: "#fff", border: "none", padding: "8px 16px", borderRadius: 8, fontWeight: 600, cursor: "pointer" }}
                >
                  {capSaving ? "Saving..." : "Set Cap"}
                </button>
              </form>

              <div style={{ marginTop: 16 }}>
                <h5 style={{ margin: "0 0 10px 0", color: "#94a3b8" }}>Active Budget Status:</h5>
                {budgetAlerts.length > 0 ? (
                  budgetAlerts.map((b, i) => (
                    <div key={i} style={{ display: "flex", justifyContent: "space-between", padding: "8px 0", borderBottom: "1px solid #334155", fontSize: 13 }}>
                      <span><strong>{b.category}</strong>: ${b.current_spent || 0} / ${b.monthly_limit}</span>
                      <span style={{ color: b.exceeded ? "#ef4444" : "#10b981", fontWeight: 600 }}>
                        {b.exceeded ? "⚠️ EXCEEDED" : `✓ ${(b.percentage_used || 0).toFixed(0)}% used`}
                      </span>
                    </div>
                  ))
                ) : budgetCaps.length > 0 ? (
                  budgetCaps.map((b, i) => (
                    <div key={i} style={{ display: "flex", justifyContent: "space-between", padding: "8px 0", borderBottom: "1px solid #334155", fontSize: 13 }}>
                      <span><strong>{b.category}</strong>: Cap ${b.monthly_limit || b.limit}</span>
                      <span style={{ color: "#10b981", fontWeight: 600 }}>Active Cap</span>
                    </div>
                  ))
                ) : (
                  <p style={{ fontSize: 13, color: "#64748b" }}>No active budget limits configured yet.</p>
                )}
              </div>
            </div>

            {/* AI PREDICTION & SPENDING FORECAST */}
            <div className="health-briefing-card" style={{ margin: 0 }}>
              <div className="briefing-header">
                <span className="ai-badge">🔮 AI EXPENSE PREDICTOR</span>
              </div>
              <div style={{ display: "flex", gap: 10, marginTop: 14 }}>
                <select
                  value={predictCategory}
                  onChange={(e) => setPredictCategory(e.target.value)}
                  style={{ background: "#1e293b", border: "1px solid #334155", color: "#fff", padding: "8px 12px", borderRadius: 8, flex: 1 }}
                >
                  {CATEGORIES.map((c) => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
                <button
                  onClick={handlePredict}
                  disabled={predictLoading}
                  style={{ background: "#8b5cf6", color: "#fff", border: "none", padding: "8px 16px", borderRadius: 8, fontWeight: 600, cursor: "pointer" }}
                >
                  {predictLoading ? "Predicting..." : "Forecast"}
                </button>
              </div>

              {prediction && (
                <div style={{ marginTop: 16, padding: 12, background: "#0f172a", borderRadius: 8, fontSize: 13 }}>
                  {prediction.predicted_next_month_expense !== undefined && prediction.predicted_next_month_expense !== null ? (
                    <div>
                      <p style={{ margin: "0 0 6px 0", color: "#10b981", fontWeight: 700, fontSize: 16 }}>
                        Projected Spend: ${prediction.predicted_next_month_expense}
                      </p>
                      <p style={{ margin: "0 0 6px 0", color: "#94a3b8" }}>
                        Based on {prediction.current_count} historical records for {prediction.category}.
                      </p>
                      <p style={{ margin: 0, fontSize: 11, color: "#64748b" }}>
                        ⚠️ Advisory forecast based on historical regression trends. Actual expenses may vary.
                      </p>
                    </div>
                  ) : (
                    <p style={{ margin: 0, color: "#f59e0b" }}>{prediction.message || "Insufficient data for trend forecast."}</p>
                  )}
                </div>
              )}
            </div>

            {/* AI FINANCIAL ADVISOR */}
            <div className="health-briefing-card" style={{ margin: 0 }}>
              <div className="briefing-header">
                <span className="ai-badge">💡 FIDUCIARY AI ADVICE</span>
              </div>
              <div style={{ display: "flex", gap: 10, marginTop: 14 }}>
                <select
                  value={advisorCategory}
                  onChange={(e) => setAdvisorCategory(e.target.value)}
                  style={{ background: "#1e293b", border: "1px solid #334155", color: "#fff", padding: "8px 12px", borderRadius: 8, flex: 1 }}
                >
                  {CATEGORIES.map((c) => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
                <button
                  onClick={handleGetAdvice}
                  disabled={adviceLoading}
                  style={{ background: "#06b6d4", color: "#fff", border: "none", padding: "8px 16px", borderRadius: 8, fontWeight: 600, cursor: "pointer" }}
                >
                  {adviceLoading ? "Analyzing..." : "Get Advice"}
                </button>
              </div>

              {advice && (
                <div style={{ marginTop: 16, padding: 12, background: "#0f172a", borderRadius: 8, fontSize: 13 }}>
                  <p style={{ margin: "0 0 4px 0", color: "#38bdf8", fontWeight: 600 }}>
                    {advice.category || advisorCategory} Strategy:
                  </p>
                  <p style={{ margin: 0, color: "#cbd5e1", lineHeight: 1.5 }}>
                    {advice.advice || advice.message || JSON.stringify(advice)}
                  </p>
                </div>
              )}
            </div>

            {/* SPENDING WASTE ANALYSIS */}
            {wasteData && wasteData.length > 0 && (
              <div className="health-briefing-card" style={{ margin: 0 }}>
                <div className="briefing-header">
                  <span className="ai-badge" style={{ background: "rgba(239, 68, 68, 0.2)", color: "#f87171" }}>
                    ⚠️ SPENDING WASTE & ANOMALIES
                  </span>
                </div>
                <div style={{ marginTop: 14 }}>
                  {wasteData.map((w, idx) => (
                    <div key={idx} style={{ padding: "8px 0", borderBottom: "1px solid #334155", fontSize: 13 }}>
                      <span style={{ color: "#f87171", fontWeight: 600 }}>{w.category || "General"}: </span>
                      <span style={{ color: "#cbd5e1" }}>{w.reason || w.description || JSON.stringify(w)}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default FinancialHealthApp;
