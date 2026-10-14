import React, { useState, useEffect, useCallback } from "react";
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ReferenceLine,
} from "recharts";
import {
  TrendingUp,
  ShieldCheck,
  Target,
  RefreshCw,
  Sliders,
  Calendar,
} from "lucide-react";
import { runMonteCarloSimulation } from "../../../services/api";
import "./MonteCarloSimulatorTab.css";

export default function MonteCarloSimulatorTab() {
  const [portfolio, setPortfolio] = useState(500000);
  const [monthlySavings, setMonthlySavings] = useState(35000);
  const [monthlyExpenses, setMonthlyExpenses] = useState(40000);
  const [expectedReturn, setExpectedReturn] = useState(11);
  const [volatility, setVolatility] = useState(15);
  const [years, setYears] = useState(25);
  const [simResults, setSimResults] = useState(null);
  const [isSimulating, setIsSimulating] = useState(false);

  const executeSimulation = useCallback(async () => {
    setIsSimulating(true);
    try {
      const payload = {
        current_portfolio: Number(portfolio),
        monthly_savings: Number(monthlySavings),
        monthly_expenses: Number(monthlyExpenses),
        expected_return: Number(expectedReturn) / 100.0,
        volatility: Number(volatility) / 100.0,
        inflation: 0.05,
        years: Number(years),
        simulations: 1000,
      };

      const res = await runMonteCarloSimulation(payload);
      if (res && res.success) {
        setSimResults(res);
      }
    } catch (err) {
      console.error("Monte Carlo simulation error:", err);
    } finally {
      setIsSimulating(false);
    }
  }, [portfolio, monthlySavings, monthlyExpenses, expectedReturn, volatility, years]);

  useEffect(() => {
    executeSimulation();
  }, [executeSimulation]);

  const formatCurrency = (val) => {
    if (val >= 10000000) return `₹${(val / 10000000).toFixed(2)} Cr`;
    if (val >= 100000) return `₹${(val / 100000).toFixed(2)} L`;
    if (val >= 1000) return `₹${(val / 1000).toFixed(1)}k`;
    return `₹${val}`;
  };

  return (
    <div className="mc-simulator-container">
      {/* ================= TOP HEADER ================= */}
      <header className="mc-top-header">
        <div className="mc-brand-group">
          <div className="mc-icon-box">
            <TrendingUp size={22} />
          </div>
          <div>
            <h2 className="mc-heading">
              Monte Carlo Investment & Retirement Simulator
              <span className="mc-badge">1,000 Market Scenarios</span>
            </h2>
            <p className="mc-subheading">
              Simulates 1,000 randomized market trajectories based on your monthly savings rate,
              projecting financial freedom timelines, emergency fund runway, and quantile returns.
            </p>
          </div>
        </div>

        <button
          className="mc-recalculate-btn"
          onClick={executeSimulation}
          disabled={isSimulating}
        >
          <RefreshCw size={14} className={isSimulating ? "animate-spin" : ""} />
          {isSimulating ? "Simulating..." : "Run 1,000 Scenarios"}
        </button>
      </header>

      {/* ================= 3 HIGH-IMPACT METRIC CARDS ================= */}
      {simResults && (
        <div className="mc-metrics-strip">
          {/* Card 1: Probability of Success */}
          <div className="mc-metric-card">
            <div className="mc-metric-head">
              <span className="mc-metric-label">Retirement Freedom Probability</span>
              <Target size={18} color="#34d399" />
            </div>
            <div className="mc-metric-value" style={{ color: "#34d399" }}>
              {simResults.success_probability_pct}%
            </div>
            <div className="mc-metric-note">
              Chance of meeting or exceeding {formatCurrency(simResults.target_corpus)} retirement target
            </div>
          </div>

          {/* Card 2: Projected Retirement Year */}
          <div className="mc-metric-card">
            <div className="mc-metric-head">
              <span className="mc-metric-label">Projected Financial Freedom</span>
              <Calendar size={18} color="#c084fc" />
            </div>
            <div className="mc-metric-value" style={{ color: "#c084fc" }}>
              {simResults.projected_retirement_year
                ? `${simResults.projected_retirement_year}`
                : `> ${years} Years`}
            </div>
            <div className="mc-metric-note">
              {simResults.years_to_financial_freedom
                ? `Achieved in ${simResults.years_to_financial_freedom} years based on median market return`
                : "Increase savings rate to accelerate financial independence timeline"}
            </div>
          </div>

          {/* Card 3: Emergency Fund Runway */}
          <div className="mc-metric-card">
            <div className="mc-metric-head">
              <span className="mc-metric-label">Emergency Fund Runway</span>
              <ShieldCheck size={18} color="#38bdf8" />
            </div>
            <div className="mc-metric-value" style={{ color: "#38bdf8" }}>
              {simResults.emergency_fund_runway_months} Mo
            </div>
            <div className="mc-metric-note">
              <span className={`mc-runway-badge ${simResults.runway_badge}`}>
                {simResults.runway_status}
              </span>
            </div>
          </div>
        </div>
      )}

      {/* ================= MAIN SIMULATOR WORKBENCH ================= */}
      <div className="mc-workbench-grid">
        {/* LEFT COLUMN: INTERACTIVE CONTROLS */}
        <div className="mc-controls-panel">
          <div className="mc-panel-title">
            <Sliders size={16} color="#c084fc" />
            Simulation Parameters
          </div>

          {/* Initial Portfolio */}
          <div className="mc-control-field">
            <div className="mc-field-label-row">
              <span>Current Investable Portfolio</span>
              <strong>{formatCurrency(portfolio)}</strong>
            </div>
            <input
              type="range"
              min={50000}
              max={10000000}
              step={50000}
              value={portfolio}
              onChange={(e) => setPortfolio(Number(e.target.value))}
              className="mc-slider"
            />
          </div>

          {/* Monthly Savings */}
          <div className="mc-control-field">
            <div className="mc-field-label-row">
              <span>Monthly Investment Contribution</span>
              <strong>{formatCurrency(monthlySavings)} / mo</strong>
            </div>
            <input
              type="range"
              min={5000}
              max={250000}
              step={5000}
              value={monthlySavings}
              onChange={(e) => setMonthlySavings(Number(e.target.value))}
              className="mc-slider"
            />
          </div>

          {/* Monthly Expenses */}
          <div className="mc-control-field">
            <div className="mc-field-label-row">
              <span>Current Monthly Living Expenses</span>
              <strong>{formatCurrency(monthlyExpenses)} / mo</strong>
            </div>
            <input
              type="range"
              min={10000}
              max={250000}
              step={5000}
              value={monthlyExpenses}
              onChange={(e) => setMonthlyExpenses(Number(e.target.value))}
              className="mc-slider"
            />
            <div className="mc-field-hint">
              Target Corpus (25x Rule): <strong>{formatCurrency(monthlyExpenses * 12 * 25)}</strong>
            </div>
          </div>

          {/* Expected Return */}
          <div className="mc-control-field">
            <div className="mc-field-label-row">
              <span>Expected Annual Equity Return</span>
              <strong>{expectedReturn}%</strong>
            </div>
            <input
              type="range"
              min={6}
              max={18}
              step={0.5}
              value={expectedReturn}
              onChange={(e) => setExpectedReturn(Number(e.target.value))}
              className="mc-slider"
            />
          </div>

          {/* Market Volatility */}
          <div className="mc-control-field">
            <div className="mc-field-label-row">
              <span>Market Volatility (Std Dev)</span>
              <strong>{volatility}%</strong>
            </div>
            <input
              type="range"
              min={8}
              max={28}
              step={1}
              value={volatility}
              onChange={(e) => setVolatility(Number(e.target.value))}
              className="mc-slider"
            />
          </div>

          {/* Investment Horizon */}
          <div className="mc-control-field">
            <div className="mc-field-label-row">
              <span>Investment Horizon</span>
              <strong>{years} Years</strong>
            </div>
            <input
              type="range"
              min={5}
              max={40}
              step={1}
              value={years}
              onChange={(e) => setYears(Number(e.target.value))}
              className="mc-slider"
            />
          </div>
        </div>

        {/* RIGHT COLUMN: RECHARTS TRAJECTORY FAN CHART & SCENARIO TABLE */}
        <div className="mc-chart-panel">
          <div className="mc-panel-title">
            <TrendingUp size={16} color="#34d399" />
            1,000 Scenario Wealth Trajectory (10th to 90th Percentile)
          </div>

          <div style={{ width: "100%", height: 340, marginTop: 10 }}>
            {simResults && (
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart
                  data={simResults.chart_data}
                  margin={{ top: 10, right: 20, left: 20, bottom: 0 }}
                >
                  <defs>
                    <linearGradient id="bullGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#38bdf8" stopOpacity={0.35} />
                      <stop offset="95%" stopColor="#38bdf8" stopOpacity={0.0} />
                    </linearGradient>
                    <linearGradient id="medianGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#10b981" stopOpacity={0.4} />
                      <stop offset="95%" stopColor="#10b981" stopOpacity={0.05} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.07)" />
                  <XAxis dataKey="year" stroke="#94a3b8" fontSize={11} />
                  <YAxis
                    stroke="#94a3b8"
                    fontSize={11}
                    tickFormatter={formatCurrency}
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "rgba(15, 23, 42, 0.95)",
                      borderColor: "rgba(168, 85, 247, 0.4)",
                      borderRadius: 10,
                      fontSize: 12,
                    }}
                    formatter={(val, name) => [formatCurrency(val), name]}
                  />
                  <Legend wrapperStyle={{ fontSize: 12, paddingTop: 8 }} />
                  <ReferenceLine
                    y={simResults.target_corpus}
                    stroke="#f43f5e"
                    strokeDasharray="4 4"
                    label={{
                      value: `Target: ${formatCurrency(simResults.target_corpus)}`,
                      fill: "#f43f5e",
                      fontSize: 11,
                    }}
                  />
                  <Area
                    type="monotone"
                    dataKey="bull90"
                    stroke="#38bdf8"
                    strokeWidth={1.5}
                    fillOpacity={1}
                    fill="url(#bullGradient)"
                    name="90th Percentile (Bull Case)"
                  />
                  <Area
                    type="monotone"
                    dataKey="median50"
                    stroke="#10b981"
                    strokeWidth={2.5}
                    fillOpacity={1}
                    fill="url(#medianGradient)"
                    name="50th Percentile (Median Expected)"
                  />
                  <Area
                    type="monotone"
                    dataKey="bear10"
                    stroke="#f59e0b"
                    strokeWidth={1.5}
                    fill="transparent"
                    name="10th Percentile (Bear Market)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            )}
          </div>

          {/* Scenario Quantiles Breakdown Table */}
          {simResults && (
            <div className="mc-scenarios-strip">
              <div className="mc-scenario-box bear">
                <span className="mc-sc-label">10th %ile (Bear Market)</span>
                <span className="mc-sc-val">{formatCurrency(simResults.bear_final_wealth)}</span>
                <span className="mc-sc-sub">Prolonged recessionary trajectory</span>
              </div>

              <div className="mc-scenario-box median">
                <span className="mc-sc-label">50th %ile (Median Realized)</span>
                <span className="mc-sc-val">{formatCurrency(simResults.median_final_wealth)}</span>
                <span className="mc-sc-sub">Expected base outcome</span>
              </div>

              <div className="mc-scenario-box bull">
                <span className="mc-sc-label">90th %ile (Bull Expansion)</span>
                <span className="mc-sc-val">{formatCurrency(simResults.bull_final_wealth)}</span>
                <span className="mc-sc-sub">High compounding bull market</span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
