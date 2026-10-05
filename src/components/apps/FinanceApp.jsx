import React, { useState, useEffect, useCallback, useMemo } from "react";
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import {
  getIncomes,
  createIncome,
  deleteIncome,
  getExpenses,
  createExpense,
  deleteExpense,
  getFinancialOverview,
  getExpenseIncomeTrend,
  getExpenseGraph,
  API_BASE_URL,
  getAuthHeaders,
} from "../../services/api";
import "./FinanceApp.css";

const CATEGORY_COLORS = {
  Food: "#f59e0b",
  Travel: "#3b82f6",
  Rent: "#8b5cf6",
  Shopping: "#ec4899",
  Bills: "#ef4444",
  Entertainment: "#10b981",
  Health: "#06b6d4",
  Other: "#64748b",
};

const EXPENSE_CATEGORIES = [
  "Food",
  "Travel",
  "Rent",
  "Shopping",
  "Bills",
  "Entertainment",
  "Health",
  "Other",
];

const INCOME_SOURCES = [
  "Salary",
  "Freelance",
  "Investments",
  "Business",
  "Rental",
  "Other",
];

export default function FinanceApp() {
  const [activeTab, setActiveTab] = useState("expenses"); // expenses | income | charts
  const [loading, setLoading] = useState(true);
  const [incomes, setIncomes] = useState([]);
  const [expenses, setExpenses] = useState([]);
  const [overview, setOverview] = useState(null);
  const [trendData, setTrendData] = useState([]);
  const [categoryData, setCategoryData] = useState([]);

  // Expense Form
  const [expAmount, setExpAmount] = useState("");
  const [expCategory, setExpCategory] = useState("Food");
  const [expDesc, setExpDesc] = useState("");
  const [expDate, setExpDate] = useState(new Date().toISOString().split("T")[0]);

  // Income Form
  const [incAmount, setIncAmount] = useState("");
  const [incSource, setIncSource] = useState("Salary");
  const [incDate, setIncDate] = useState(new Date().toISOString().split("T")[0]);

  // Filter & Search
  const [searchQuery, setSearchQuery] = useState("");
  const [filterCategory, setFilterCategory] = useState("all");
  const [toastMsg, setToastMsg] = useState("");

  const showToast = (msg) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(""), 3500);
  };

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const [incRes, expRes, ovRes, trendRes, catRes] = await Promise.allSettled([
        getIncomes(),
        getExpenses(),
        getFinancialOverview(),
        getExpenseIncomeTrend(),
        getExpenseGraph(),
      ]);

      const incList = incRes.status === "fulfilled" && Array.isArray(incRes.value) ? incRes.value : [];
      const expList = expRes.status === "fulfilled" && Array.isArray(expRes.value) ? expRes.value : [];

      setIncomes(incList);
      setExpenses(expList);

      if (ovRes.status === "fulfilled" && ovRes.value) {
        setOverview(ovRes.value);
      } else {
        const totalInc = incList.reduce((acc, i) => acc + (Number(i.amount) || 0), 0);
        const totalExp = expList.reduce((acc, e) => acc + (Number(e.amount) || 0), 0);
        setOverview({
          total_income: totalInc,
          total_expense: totalExp,
          net_savings: totalInc - totalExp,
          savings_rate: totalInc > 0 ? Math.round(((totalInc - totalExp) / totalInc) * 100) : 0,
        });
      }

      if (trendRes.status === "fulfilled" && Array.isArray(trendRes.value)) {
        setTrendData(trendRes.value);
      }
      if (catRes.status === "fulfilled" && catRes.value) {
        setCategoryData(catRes.value);
      }
    } catch (err) {
      console.error("Failed to load financial telemetry", err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // Handle Add Expense
  const handleAddExpense = async (e) => {
    e.preventDefault();
    if (!expAmount || Number(expAmount) <= 0) return;

    try {
      const payload = {
        amount: parseFloat(expAmount),
        category: expCategory,
        description: expDesc.trim() || `${expCategory} expense`,
      };
      if (expDate) {
        payload.date = expDate;
      }

      try {
        await createExpense(payload);
      } catch (postErr) {
        // Fallback for legacy backend schema where date must be None
        if (postErr?.response?.status === 422 && payload.date) {
          const fallbackPayload = { ...payload };
          delete fallbackPayload.date;
          await createExpense(fallbackPayload);
        } else {
          throw postErr;
        }
      }

      setExpAmount("");
      setExpDesc("");
      showToast("Expense recorded successfully!");
      fetchData();
    } catch (err) {
      console.error("Expense record error:", err);
      const errMsg =
        err?.response?.data?.detail
          ? typeof err.response.data.detail === "string"
            ? err.response.data.detail
            : JSON.stringify(err.response.data.detail)
          : err?.message || "Please check your connection.";
      alert(`Failed to record expense: ${errMsg}`);
    }
  };

  // Handle Delete Expense
  const handleDeleteExpense = async (id) => {
    if (!window.confirm("Delete this expense record?")) return;
    try {
      await deleteExpense(id);
      showToast("Expense deleted.");
      fetchData();
    } catch (err) {
      alert("Failed to delete expense");
    }
  };

  // Handle Add Income
  const handleAddIncome = async (e) => {
    e.preventDefault();
    if (!incAmount || Number(incAmount) <= 0) return;

    try {
      const payload = {
        amount: parseFloat(incAmount),
        source: incSource,
      };
      if (incDate) {
        payload.date = incDate;
      }

      try {
        await createIncome(payload);
      } catch (postErr) {
        // Fallback for legacy backend schema where date must be None
        if (postErr?.response?.status === 422 && payload.date) {
          const fallbackPayload = { ...payload };
          delete fallbackPayload.date;
          await createIncome(fallbackPayload);
        } else {
          throw postErr;
        }
      }

      setIncAmount("");
      showToast("Income added successfully!");
      fetchData();
    } catch (err) {
      console.error("Income record error:", err);
      const errMsg =
        err?.response?.data?.detail
          ? typeof err.response.data.detail === "string"
            ? err.response.data.detail
            : JSON.stringify(err.response.data.detail)
          : err?.message || "Please check your connection.";
      alert(`Failed to add income: ${errMsg}`);
    }
  };

  // Handle Delete Income
  const handleDeleteIncome = async (id) => {
    if (!window.confirm("Delete this income record?")) return;
    try {
      await deleteIncome(id);
      showToast("Income deleted.");
      fetchData();
    } catch (err) {
      alert("Failed to delete income");
    }
  };

  // KPI Calculations
  const calculatedTotalIncome = useMemo(
    () => (overview?.total_income !== undefined ? overview.total_income : incomes.reduce((acc, i) => acc + (Number(i.amount) || 0), 0)),
    [overview, incomes]
  );
  const calculatedTotalExpense = useMemo(
    () => (overview?.total_expense !== undefined ? overview.total_expense : expenses.reduce((acc, e) => acc + (Number(e.amount) || 0), 0)),
    [overview, expenses]
  );
  const netBalance = calculatedTotalIncome - calculatedTotalExpense;
  const savingsRate = calculatedTotalIncome > 0 ? Math.round((netBalance / calculatedTotalIncome) * 100) : 0;

  // Filtered Expenses
  const filteredExpenses = useMemo(() => {
    return expenses.filter((ex) => {
      const matchCat = filterCategory === "all" || ex.category?.toLowerCase() === filterCategory.toLowerCase();
      const matchQuery =
        !searchQuery ||
        ex.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        ex.category?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        String(ex.amount).includes(searchQuery);
      return matchCat && matchQuery;
    });
  }, [expenses, filterCategory, searchQuery]);

  // Category Breakdown for Recharts
  const pieChartData = useMemo(() => {
    const map = {};
    expenses.forEach((e) => {
      const c = e.category || "Other";
      map[c] = (map[c] || 0) + (Number(e.amount) || 0);
    });
    return Object.entries(map).map(([name, value]) => ({ name, value }));
  }, [expenses]);

  const handleDownloadCsv = async (urlPath, defaultFilename) => {
    try {
      const res = await fetch(`${API_BASE_URL}${urlPath}`, {
        headers: getAuthHeaders()
      });
      if (!res.ok) {
        throw new Error(`Download failed: ${res.statusText}`);
      }
      const blob = await res.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = defaultFilename;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
      setToastMsg(`Downloaded ${defaultFilename}`);
      setTimeout(() => setToastMsg(""), 3000);
    } catch (err) {
      console.warn("CSV download fallback", err);
      const token = localStorage.getItem("token");
      const tokenParam = token ? `?token=${encodeURIComponent(token)}` : "";
      window.open(`${API_BASE_URL}${urlPath}${tokenParam}`, "_blank");
    }
  };

  return (
    <div className="vitya-finance-app">
      {toastMsg && <div className="vitya-finance-toast">✓ {toastMsg}</div>}

      {/* HEADER & CSV EXPORT ACTIONS */}
      <div className="finance-header">
        <div>
          <h2>💳 Financial Management & Cashflow</h2>
          <p>Track live expenses, incomes, cashflow velocity, and download audit CSVs.</p>
        </div>
        <div className="finance-export-group">
          <button
            type="button"
            onClick={() => handleDownloadCsv("/api/vitya/export/csv", "financial_report.csv")}
            className="export-csv-btn"
            style={{ cursor: "pointer", border: "none", display: "inline-flex", alignItems: "center", gap: 6 }}
          >
            📥 Export All CSV
          </button>
          <button
            type="button"
            onClick={() => handleDownloadCsv("/api/vitya/csv/expenses", "expenses_report.csv")}
            className="export-csv-btn secondary"
            style={{ cursor: "pointer", border: "none", display: "inline-flex", alignItems: "center", gap: 6 }}
          >
            📊 Expenses CSV
          </button>
          <button
            type="button"
            onClick={() => handleDownloadCsv("/api/vitya/csv/incomes", "incomes_report.csv")}
            className="export-csv-btn secondary"
            style={{ cursor: "pointer", border: "none", display: "inline-flex", alignItems: "center", gap: 6 }}
          >
            💰 Incomes CSV
          </button>
        </div>
      </div>

      {/* KPI METRIC CARDS */}
      <div className="finance-kpi-grid">
        <div className="finance-kpi-card income-card">
          <div className="kpi-label">Total Revenue / Income</div>
          <div className="kpi-value">${calculatedTotalIncome.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</div>
          <div className="kpi-sub">{incomes.length} recorded sources</div>
        </div>

        <div className="finance-kpi-card expense-card">
          <div className="kpi-label">Total Outflow / Expenses</div>
          <div className="kpi-value">${calculatedTotalExpense.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</div>
          <div className="kpi-sub">{expenses.length} transaction entries</div>
        </div>

        <div className="finance-kpi-card balance-card">
          <div className="kpi-label">Net Balance (Cashflow)</div>
          <div className={`kpi-value ${netBalance >= 0 ? "positive" : "negative"}`}>
            {netBalance >= 0 ? "+" : "-"}${Math.abs(netBalance).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </div>
          <div className="kpi-sub">{netBalance >= 0 ? "Net Surplus" : "Deficit Warning"}</div>
        </div>

        <div className="finance-kpi-card savings-card">
          <div className="kpi-label">Savings Velocity</div>
          <div className="kpi-value">{savingsRate}%</div>
          <div className="kpi-sub">Retained Income</div>
        </div>
      </div>

      {/* NAVIGATION TABS */}
      <div className="finance-tabs">
        <button
          className={`finance-tab ${activeTab === "expenses" ? "active" : ""}`}
          onClick={() => setActiveTab("expenses")}
        >
          💸 Expenses Tracker ({expenses.length})
        </button>
        <button
          className={`finance-tab ${activeTab === "income" ? "active" : ""}`}
          onClick={() => setActiveTab("income")}
        >
          💰 Income Inflow ({incomes.length})
        </button>
        <button
          className={`finance-tab ${activeTab === "charts" ? "active" : ""}`}
          onClick={() => setActiveTab("charts")}
        >
          📈 Charts & Trends
        </button>
      </div>

      {/* TAB CONTENT: EXPENSES */}
      {activeTab === "expenses" && (
        <div className="finance-tab-body">
          {/* ADD EXPENSE FORM */}
          <form className="finance-form" onSubmit={handleAddExpense}>
            <h4>+ Record New Expense</h4>
            <div className="form-row">
              <div className="form-group">
                <label>Amount ($)</label>
                <input
                  type="number"
                  step="0.01"
                  placeholder="0.00"
                  value={expAmount}
                  onChange={(e) => setExpAmount(e.target.value)}
                  required
                />
              </div>

              <div className="form-group">
                <label>Category</label>
                <select
                  value={expCategory}
                  onChange={(e) => setExpCategory(e.target.value)}
                >
                  {EXPENSE_CATEGORIES.map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                </select>
              </div>

              <div className="form-group flex-2">
                <label>Description / Note</label>
                <input
                  type="text"
                  placeholder="e.g. AWS Cloud hosting bill"
                  value={expDesc}
                  onChange={(e) => setExpDesc(e.target.value)}
                />
              </div>

              <div className="form-group">
                <label>Date</label>
                <input
                  type="date"
                  value={expDate}
                  onChange={(e) => setExpDate(e.target.value)}
                />
              </div>

              <button type="submit" className="add-entry-btn">
                Add Expense
              </button>
            </div>
          </form>

          {/* SEARCH & FILTERS */}
          <div className="finance-filter-bar">
            <input
              type="text"
              placeholder="Search expenses by note, category, amount..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="finance-search-input"
            />
            <select
              value={filterCategory}
              onChange={(e) => setFilterCategory(e.target.value)}
              className="finance-filter-select"
            >
              <option value="all">All Categories</option>
              {EXPENSE_CATEGORIES.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </div>

          {/* EXPENSE TABLE / LIST */}
          <div className="finance-table-container">
            {filteredExpenses.length === 0 ? (
              <div className="empty-state">
                <p>No expense transactions found.</p>
              </div>
            ) : (
              <table className="finance-table">
                <thead>
                  <tr>
                    <th>Date</th>
                    <th>Category</th>
                    <th>Description</th>
                    <th style={{ textAlign: "right" }}>Amount</th>
                    <th style={{ textAlign: "center" }}>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredExpenses.map((ex) => (
                    <tr key={ex.id}>
                      <td className="muted-col">
                        {ex.date ? String(ex.date).slice(0, 10) : "Today"}
                      </td>
                      <td>
                        <span
                          className="category-badge"
                          style={{
                            backgroundColor: `${CATEGORY_COLORS[ex.category] || "#64748b"}20`,
                            color: CATEGORY_COLORS[ex.category] || "#94a3b8",
                            borderColor: `${CATEGORY_COLORS[ex.category] || "#64748b"}40`,
                          }}
                        >
                          {ex.category}
                        </span>
                      </td>
                      <td className="desc-col">{ex.description || "—"}</td>
                      <td className="amount-col" style={{ textAlign: "right" }}>
                        -${Number(ex.amount).toFixed(2)}
                      </td>
                      <td style={{ textAlign: "center" }}>
                        <button
                          className="del-btn"
                          onClick={() => handleDeleteExpense(ex.id)}
                          title="Delete Expense"
                        >
                          🗑️
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>
      )}

      {/* TAB CONTENT: INCOME */}
      {activeTab === "income" && (
        <div className="finance-tab-body">
          {/* ADD INCOME FORM */}
          <form className="finance-form" onSubmit={handleAddIncome}>
            <h4>+ Record New Inflow</h4>
            <div className="form-row">
              <div className="form-group">
                <label>Amount ($)</label>
                <input
                  type="number"
                  step="0.01"
                  placeholder="0.00"
                  value={incAmount}
                  onChange={(e) => setIncAmount(e.target.value)}
                  required
                />
              </div>

              <div className="form-group">
                <label>Income Source</label>
                <select
                  value={incSource}
                  onChange={(e) => setIncSource(e.target.value)}
                >
                  {INCOME_SOURCES.map((s) => (
                    <option key={s} value={s}>
                      {s}
                    </option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label>Date</label>
                <input
                  type="date"
                  value={incDate}
                  onChange={(e) => setIncDate(e.target.value)}
                />
              </div>

              <button type="submit" className="add-entry-btn income-submit-btn">
                Add Income
              </button>
            </div>
          </form>

          {/* INCOME LIST */}
          <div className="finance-table-container">
            {incomes.length === 0 ? (
              <div className="empty-state">
                <p>No income streams recorded yet.</p>
              </div>
            ) : (
              <table className="finance-table">
                <thead>
                  <tr>
                    <th>Date</th>
                    <th>Source</th>
                    <th style={{ textAlign: "right" }}>Amount</th>
                    <th style={{ textAlign: "center" }}>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {incomes.map((inc) => (
                    <tr key={inc.id}>
                      <td className="muted-col">
                        {inc.date ? String(inc.date).slice(0, 10) : "Today"}
                      </td>
                      <td>
                        <span className="category-badge income-badge">
                          💰 {inc.source}
                        </span>
                      </td>
                      <td className="amount-col income-amount" style={{ textAlign: "right" }}>
                        +${Number(inc.amount).toFixed(2)}
                      </td>
                      <td style={{ textAlign: "center" }}>
                        <button
                          className="del-btn"
                          onClick={() => handleDeleteIncome(inc.id)}
                          title="Delete Income"
                        >
                          🗑️
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>
      )}

      {/* TAB CONTENT: CHARTS */}
      {activeTab === "charts" && (
        <div className="finance-tab-body">
          <div className="finance-charts-grid">
            {/* CATEGORY PIE CHART */}
            <div className="chart-card">
              <h4>📊 Outflow Distribution by Category</h4>
              {pieChartData.length === 0 ? (
                <p className="empty-chart">No expense entries available for breakdown.</p>
              ) : (
                <div style={{ width: "100%", height: 280 }}>
                  <ResponsiveContainer>
                    <PieChart>
                      <Pie
                        data={pieChartData}
                        dataKey="value"
                        nameKey="name"
                        cx="50%"
                        cy="50%"
                        outerRadius={90}
                        innerRadius={45}
                        paddingAngle={4}
                        label={({ name, percent }) => `${name} (${(percent * 100).toFixed(0)}%)`}
                      >
                        {pieChartData.map((entry, index) => (
                          <Cell
                            key={`cell-${index}`}
                            fill={CATEGORY_COLORS[entry.name] || "#64748b"}
                          />
                        ))}
                      </Pie>
                      <Tooltip formatter={(value) => `$${Number(value).toFixed(2)}`} />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              )}
            </div>

            {/* EXPENSE BAR CHART */}
            <div className="chart-card">
              <h4>💵 Category Spending Volume</h4>
              {pieChartData.length === 0 ? (
                <p className="empty-chart">No expense entries available.</p>
              ) : (
                <div style={{ width: "100%", height: 280 }}>
                  <ResponsiveContainer>
                    <BarChart data={pieChartData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                      <XAxis dataKey="name" stroke="#94a3b8" />
                      <YAxis stroke="#94a3b8" />
                      <Tooltip formatter={(value) => `$${Number(value).toFixed(2)}`} />
                      <Bar dataKey="value" fill="#8b5cf6" radius={[6, 6, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
