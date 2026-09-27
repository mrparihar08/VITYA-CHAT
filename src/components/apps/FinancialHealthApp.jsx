import React, { useState, useEffect, useCallback } from "react";
import {
  getFinancialHealthScore,
  getFinancialExecutiveSummary,
} from "../../services/api";
import "./FinancialHealthApp.css";

const FinancialHealthApp = () => {
  const [healthData, setHealthData] = useState(null);
  const [executiveSummary, setExecutiveSummary] = useState(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchHealthData = useCallback(async () => {
    setLoading(true);
    try {
      const [scoreRes, summaryRes] = await Promise.all([
        getFinancialHealthScore(),
        getFinancialExecutiveSummary(),
      ]);
      setHealthData(scoreRes);
      setExecutiveSummary(summaryRes);
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

  const getScoreColor = (score) => {
    if (score >= 80) return "#10b981"; // Emerald
    if (score >= 60) return "#3b82f6"; // Blue
    if (score >= 40) return "#f59e0b"; // Amber
    return "#ef4444"; // Red
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
          <h2 className="health-title">⚡ AI Financial Health & Intelligence</h2>
          <p className="health-subtitle">
            Autonomous AI audit of your income, spending efficiency, budget adherence, and subscription load.
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
          <p style={{ fontSize: 18 }}>🧠 AI is computing your financial health score and executive summary...</p>
        </div>
      ) : !healthData ? (
        <div style={{ padding: 40, textAlign: "center", background: "rgba(30,41,59,0.4)", borderRadius: 16 }}>
          <h3>Financial Data Unavailable</h3>
          <p style={{ color: "rgba(255,255,255,0.6)" }}>
            Please log income and expenses to generate your AI Health Score.
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

            <div className="score-details">
              <div className="grade-badge-row">
                <span className={`grade-badge ${getGradeClass(healthData.grade)}`}>
                  {healthData.grade || "Evaluated"}
                </span>
                <span style={{ color: "rgba(255,255,255,0.5)", fontSize: 13 }}>
                  Overall Financial Health Status
                </span>
              </div>
              <p style={{ margin: 0, fontSize: 14, color: "rgba(255,255,255,0.8)", lineHeight: 1.5 }}>
                Your financial health score is calculated using real-time analysis of your total savings, spend-to-income ratio, active subscription commitments, and budget cap utilization.
              </p>
            </div>
          </div>

          {/* METRICS BREAKDOWN GRID */}
          <div className="health-metrics-grid">
            <div className="metric-card">
              <span className="metric-card-title">Savings Rate</span>
              <span className="metric-card-val" style={{ color: "#10b981" }}>
                {healthData.savings_rate_pct}%
              </span>
              <div className="metric-bar-bg">
                <div
                  className="metric-bar-fill"
                  style={{
                    width: `${Math.min(100, Math.max(0, healthData.savings_rate_pct))}%`,
                    background: "#10b981",
                  }}
                />
              </div>
            </div>

            <div className="metric-card">
              <span className="metric-card-title">Expense Ratio</span>
              <span className="metric-card-val" style={{ color: healthData.expense_ratio_pct > 80 ? "#ef4444" : "#60a5fa" }}>
                {healthData.expense_ratio_pct}%
              </span>
              <div className="metric-bar-bg">
                <div
                  className="metric-bar-fill"
                  style={{
                    width: `${Math.min(100, Math.max(0, healthData.expense_ratio_pct))}%`,
                    background: healthData.expense_ratio_pct > 80 ? "#ef4444" : "#60a5fa",
                  }}
                />
              </div>
            </div>

            <div className="metric-card">
              <span className="metric-card-title">Budget Adherence</span>
              <span className="metric-card-val" style={{ color: healthData.budget_adherence_pct < 60 ? "#f59e0b" : "#8b5cf6" }}>
                {healthData.budget_adherence_pct}%
              </span>
              <div className="metric-bar-bg">
                <div
                  className="metric-bar-fill"
                  style={{
                    width: `${Math.min(100, Math.max(0, healthData.budget_adherence_pct))}%`,
                    background: healthData.budget_adherence_pct < 60 ? "#f59e0b" : "#8b5cf6",
                  }}
                />
              </div>
            </div>

            <div className="metric-card">
              <span className="metric-card-title">Subscription Load</span>
              <span className="metric-card-val" style={{ color: healthData.subscription_ratio_pct > 20 ? "#ef4444" : "#ec4899" }}>
                {healthData.subscription_ratio_pct}%
              </span>
              <div className="metric-bar-bg">
                <div
                  className="metric-bar-fill"
                  style={{
                    width: `${Math.min(100, Math.max(0, healthData.subscription_ratio_pct))}%`,
                    background: healthData.subscription_ratio_pct > 20 ? "#ef4444" : "#ec4899",
                  }}
                />
              </div>
            </div>
          </div>

          {/* RECOMMENDATIONS */}
          {healthData.recommendations && healthData.recommendations.length > 0 && (
            <div className="recommendations-card">
              <h3 className="section-title">
                💡 Key Recommendations & Action Items
              </h3>
              <div className="recommendation-list">
                {healthData.recommendations.map((rec, idx) => (
                  <div key={idx} className="recommendation-item">
                    <span className="recommendation-icon">📌</span>
                    <span>{rec}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* EXECUTIVE SUMMARY REPORT */}
          {executiveSummary && (
            <div className="executive-summary-card">
              <h3 className="section-title" style={{ color: "#a855f7" }}>
                📊 AI Executive Financial Briefing
              </h3>
              <div className="executive-body">
                {executiveSummary.summary_text}
              </div>
              {executiveSummary.generated_at && (
                <div className="executive-meta">
                  Generated at: {new Date(executiveSummary.generated_at).toLocaleString()}
                </div>
              )}
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default FinancialHealthApp;
