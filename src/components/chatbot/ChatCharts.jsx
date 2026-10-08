import React, { useState, useMemo, useRef } from "react";
import html2canvas from "html2canvas";
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  AreaChart,
  Area,
  CartesianGrid,
  ComposedChart,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ScatterChart,
  Scatter,
  RadarChart,
  Radar,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  ResponsiveContainer,
} from "recharts";
import {
  BarChart2,
  PieChart as PieIcon,
  TrendingUp,
  Table as TableIcon,
  Copy,
  Check,
  Sparkles,
  Download,
} from "lucide-react";
import "./ChatCharts.css";

/* -------------------------------------------------------
   Vibrant Cyber Neon Palette & Gradients
------------------------------------------------------- */
const PALETTE = [
  "#8b5cf6", // Purple
  "#38bdf8", // Sky Blue
  "#10b981", // Emerald
  "#f59e0b", // Amber
  "#f43f5e", // Rose
  "#a855f7", // Fuchsia
  "#06b6d4", // Cyan
  "#ec4899", // Pink
  "#6366f1", // Indigo
  "#14b8a6", // Teal
];

const parsePythonLiteral = (input) => {
  if (typeof input !== "string") return input;
  const str = input.trim();
  if (!str) return input;

  let i = 0;
  const skipWhitespace = () => {
    while (i < str.length && /\s/.test(str[i])) i++;
  };

  const parseValue = () => {
    skipWhitespace();
    if (i >= str.length) return undefined;
    const ch = str[i];

    if (ch === "[") {
      i++;
      const list = [];
      skipWhitespace();
      if (str[i] === "]") {
        i++;
        return list;
      }
      while (i < str.length) {
        const val = parseValue();
        list.push(val);
        skipWhitespace();
        if (str[i] === ",") {
          i++;
          skipWhitespace();
          if (str[i] === "]") {
            i++;
            break;
          }
        } else if (str[i] === "]") {
          i++;
          break;
        } else {
          break;
        }
      }
      return list;
    }

    if (ch === "{") {
      i++;
      const obj = {};
      skipWhitespace();
      if (str[i] === "}") {
        i++;
        return obj;
      }
      while (i < str.length) {
        const key = parseValue();
        skipWhitespace();
        if (str[i] === ":") i++;
        const val = parseValue();
        if (key !== undefined) obj[String(key)] = val;
        skipWhitespace();
        if (str[i] === ",") {
          i++;
          skipWhitespace();
          if (str[i] === "}") {
            i++;
            break;
          }
        } else if (str[i] === "}") {
          i++;
          break;
        } else {
          break;
        }
      }
      return obj;
    }

    if (ch === "'" || ch === '"') {
      const quote = ch;
      i++;
      let result = "";
      while (i < str.length) {
        const char = str[i];
        if (char === "\\") {
          i++;
          if (i < str.length) {
            const nextChar = str[i];
            if (nextChar === "n") result += "\n";
            else if (nextChar === "t") result += "\t";
            else if (nextChar === "r") result += "\r";
            else result += nextChar;
            i++;
          }
        } else if (char === quote) {
          i++;
          break;
        } else {
          result += char;
          i++;
        }
      }
      return result;
    }

    if (str.startsWith("None", i)) {
      i += 4;
      return null;
    }
    if (str.startsWith("True", i)) {
      i += 4;
      return true;
    }
    if (str.startsWith("False", i)) {
      i += 5;
      return false;
    }
    if (str.startsWith("null", i)) {
      i += 4;
      return null;
    }
    if (str.startsWith("true", i)) {
      i += 4;
      return true;
    }
    if (str.startsWith("false", i)) {
      i += 5;
      return false;
    }

    const numMatch = str.slice(i).match(/^-?\d+(?:\.\d+)?(?:[eE][+-]?\d+)?/);
    if (numMatch) {
      i += numMatch[0].length;
      return Number(numMatch[0]);
    }

    const wordMatch = str.slice(i).match(/^[a-zA-Z_]\w*/);
    if (wordMatch) {
      i += wordMatch[0].length;
      return wordMatch[0];
    }

    i++;
    return undefined;
  };

  try {
    const res = parseValue();
    return res !== undefined ? res : input;
  } catch {
    return input;
  }
};

const safeJSON = (value) => {
  if (typeof value !== "string") return value;
  const trimmed = value.trim();
  if (!trimmed) return value;

  if (
    (trimmed.startsWith("{") && trimmed.endsWith("}")) ||
    (trimmed.startsWith("[") && trimmed.endsWith("]"))
  ) {
    try {
      return JSON.parse(trimmed);
    } catch {
      try {
        const parsedPy = parsePythonLiteral(trimmed);
        if (parsedPy !== trimmed) return parsedPy;
      } catch {}
      return value;
    }
  }
  return value;
};

const formatCurrency = (val) => {
  const num = Number(val);
  if (isNaN(num)) return val;
  if (Math.abs(num) >= 10000000) return `₹${(num / 10000000).toFixed(2)} Cr`;
  if (Math.abs(num) >= 100000) return `₹${(num / 100000).toFixed(1)} L`;
  if (Math.abs(num) >= 1000) return `₹${(num / 1000).toFixed(1)}k`;
  return `₹${num.toLocaleString("en-IN")}`;
};

const formatMonth = (dateStr) => {
  if (!dateStr) return "";
  const d = new Date(dateStr);
  if (Number.isNaN(d.getTime())) return String(dateStr);
  return d.toLocaleDateString("en-IN", { month: "short", year: "numeric" });
};

const normalizeMultiLineData = (data) => {
  if (!data || typeof data !== "object" || Array.isArray(data)) return data;
  const incomeData = data.income || [];
  const expenseData = data.expense || [];
  const merged = {};

  incomeData.forEach((i) => {
    if (!i || !i.month) return;
    const rawDate = i.month;
    merged[rawDate] = {
      month: formatMonth(rawDate),
      income: Number(i.amount) || 0,
      expense: 0,
      amount: Number(i.amount) || 0,
      rawDate,
    };
  });

  expenseData.forEach((e) => {
    if (!e || !e.month) return;
    const rawDate = e.month;
    if (merged[rawDate]) {
      merged[rawDate].expense = Number(e.amount) || 0;
      merged[rawDate].amount = merged[rawDate].expense || merged[rawDate].income;
    } else {
      merged[rawDate] = {
        month: formatMonth(rawDate),
        income: 0,
        expense: Number(e.amount) || 0,
        amount: Number(e.amount) || 0,
        rawDate,
      };
    }
  });

  // Sort chronologically by date
  const sortedDates = Object.keys(merged).sort((a, b) => new Date(a) - new Date(b));
  return sortedDates.map((d) => merged[d]);
};

const findArrayDeep = (value, depth = 0) => {
  if (depth > 4 || value == null) return null;
  if (Array.isArray(value)) return value;

  const parsed = safeJSON(value);
  if (Array.isArray(parsed)) return parsed;

  if (parsed && typeof parsed === "object") {
    if (parsed.income || parsed.expense) {
      return normalizeMultiLineData(parsed);
    }
    const preferredKeys = ["content", "data", "items", "rows", "result", "reply", "payload", "chartData"];
    for (const key of preferredKeys) {
      const found = findArrayDeep(parsed[key], depth + 1);
      if (found) return found;
    }
    for (const val of Object.values(parsed)) {
      const found = findArrayDeep(val, depth + 1);
      if (found) return found;
    }
  }

  return null;
};

const getChartData = (msg) => {
  const raw = msg.content ?? msg.data ?? msg.text ?? null;
  const type = (msg.type || "").toLowerCase().trim();
  const parsed = safeJSON(raw);
  if (type === "multi_line" || (parsed && typeof parsed === "object" && (parsed.income || parsed.expense))) {
    return normalizeMultiLineData(parsed);
  }
  return findArrayDeep(raw);
};

const getKeys = (data, type) => {
  const first = data?.[0] || {};
  let xKey = "category";
  if (first.month !== undefined) xKey = "month";
  else if (first.category !== undefined) xKey = "category";
  else if (first.name !== undefined) xKey = "name";
  else if (first.label !== undefined) xKey = "label";
  else if (first.title !== undefined) xKey = "title";
  else if (first.item !== undefined) xKey = "item";
  else if (first.x !== undefined && type === "scatter") xKey = "x";

  let yKey = "amount";
  if (first.amount !== undefined) yKey = "amount";
  else if (first.expense !== undefined) yKey = "expense";
  else if (first.income !== undefined) yKey = "income";
  else if (first.value !== undefined) yKey = "value";
  else if (first.total !== undefined) yKey = "total";
  else if (first.count !== undefined) yKey = "count";
  else if (first.y !== undefined && type === "scatter") yKey = "y";

  return { xKey, yKey };
};

/* -------------------------------------------------------
   Custom Frosted Tooltip
------------------------------------------------------- */
const CustomChartTooltip = ({ active, payload, label, xKey, yKey, totalSum }) => {
  if (active && payload && payload.length) {
    return (
      <div className="vitya-custom-tooltip">
        <div className="vitya-tooltip-header">
          <span>{label || payload[0]?.name || "Metrics"}</span>
        </div>
        {payload.map((entry, idx) => {
          const val = Number(entry.value) || 0;
          const name = entry.name || entry.dataKey || yKey;
          const color = entry.color || entry.fill || "#8b5cf6";
          const pct = totalSum > 0 ? ((val / totalSum) * 100).toFixed(1) : null;
          return (
            <div key={idx} style={{ marginTop: idx > 0 ? 6 : 2 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 11.5, color: "#94a3b8" }}>
                <span className="vitya-tooltip-dot" style={{ backgroundColor: color, color }} />
                <span>{name}</span>
              </div>
              <div className="vitya-tooltip-val">{formatCurrency(val)}</div>
              {pct && <div className="vitya-tooltip-pct">{pct}% of total</div>}
            </div>
          );
        })}
      </div>
    );
  }
  return null;
};

/* -------------------------------------------------------
   Main Component: ChatCharts
------------------------------------------------------- */
export const ChatCharts = ({ msg }) => {
  const [activeView, setActiveView] = useState(null);
  const [copied, setCopied] = useState(false);

  const rawType = (msg?.type || "").toLowerCase().trim();
  const rawData = useMemo(() => getChartData(msg), [msg]);

  const data = useMemo(() => {
    if (!rawData || !Array.isArray(rawData)) return [];
    return rawData.map((item) => {
      if (!item || typeof item !== "object") return item;
      const formatted = { ...item };
      for (const k in formatted) {
        if (typeof formatted[k] === "string" && !isNaN(Number(formatted[k])) && formatted[k].trim() !== "") {
          formatted[k] = Number(formatted[k]);
        }
      }
      return formatted;
    });
  }, [rawData]);

  const hasIncome = useMemo(() => data.some((d) => d.income !== undefined && d.income > 0), [data]);
  const hasExpense = useMemo(() => data.some((d) => d.expense !== undefined && d.expense > 0), [data]);
  const isMultiSeries = hasIncome && hasExpense;

  const defaultView = useMemo(() => {
    if (rawType === "line" || rawType === "line_chart" || rawType === "multi_line") return "line";
    if (rawType === "pie" || rawType === "donut") return "donut";
    if (rawType === "area") return "area";
    if (rawType === "scatter") return "scatter";
    if (rawType === "radar") return "radar";
    if (rawType === "waterfall") return "waterfall";
    if (rawType === "composed") return "composed";
    return "bar";
  }, [rawType]);

  const currentView = activeView || defaultView;
  const { xKey, yKey } = useMemo(() => getKeys(data, currentView), [data, currentView]);

  // Metric Computations
  const { totalSum, topItem, avgVal } = useMemo(() => {
    if (!data || !data.length) return { totalSum: 0, topItem: null, avgVal: 0 };
    let sum = 0;
    let max = -Infinity;
    let maxObj = null;

    data.forEach((d) => {
      const v = isMultiSeries ? (d.expense || d.income || 0) : (Number(d[yKey]) || Number(d.amount) || Number(d.value) || 0);
      sum += v;
      if (v > max) {
        max = v;
        maxObj = d;
      }
    });

    const avg = data.length > 0 ? sum / data.length : 0;
    return { totalSum: sum, topItem: maxObj, avgVal: avg };
  }, [data, yKey, isMultiSeries]);

  const chartCardRef = useRef(null);
  const [downloadingImg, setDownloadingImg] = useState(false);

  const handleCopyData = () => {
    try {
      const keys = isMultiSeries ? [xKey, "income", "expense"] : [xKey, yKey];
      const csv = [
        keys.join(","),
        ...data.map((d) => keys.map((k) => `"${d[k] ?? 0}"`).join(",")),
      ].join("\n");
      navigator.clipboard.writeText(csv);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {}
  };

  const handleDownloadPNG = async () => {
    if (!chartCardRef.current || downloadingImg) return;
    setDownloadingImg(true);
    try {
      const canvas = await html2canvas(chartCardRef.current, {
        backgroundColor: "#0c1020",
        scale: 2,
        useCORS: true,
        allowTaint: true,
        logging: false,
        onclone: (clonedDoc, clonedEl) => {
          clonedEl.style.backdropFilter = "none";
          clonedEl.style.webkitBackdropFilter = "none";
          clonedEl.querySelectorAll("*").forEach((el) => {
            el.style.backdropFilter = "none";
            el.style.webkitBackdropFilter = "none";
          });
        },
      });

      const dataUrl = canvas.toDataURL("image/png");
      if (dataUrl && dataUrl.length > 200 && dataUrl !== "data:,") {
        const link = document.createElement("a");
        link.download = `vitya_chart_${Date.now()}.png`;
        link.href = dataUrl;
        document.body.appendChild(link);
        link.click();
        link.remove();
      }
    } catch (e) {
      console.warn("Direct PNG export error:", e);
    } finally {
      setDownloadingImg(false);
    }
  };

  const titleText = useMemo(() => {
    if (msg?.title) return msg.title;
    if (msg?.caption) return msg.caption;
    if (isMultiSeries) return "Monthly Income & Expense Trend";
    const typeLabel = rawType ? rawType.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase()) : "Analytics";
    if (typeLabel.toLowerCase().includes("chart")) return `${typeLabel} Overview`;
    return `${typeLabel} Analytics`;
  }, [msg, rawType, isMultiSeries]);

  if (!data || !Array.isArray(data) || data.length === 0) {
    return (
      <div className="vitya-chart-card" style={{ padding: 24, textAlign: "center" }}>
        <Sparkles size={20} color="#8b5cf6" style={{ marginBottom: 6 }} />
        <div style={{ fontSize: 13, color: "#94a3b8" }}>No visualization data available</div>
      </div>
    );
  }

  return (
    <div ref={chartCardRef} className="vitya-chart-card">
      {/* Header with Title & View Switcher */}
      <div className="vitya-chart-header">
        <div className="vitya-chart-title-group">
          <div className="vitya-chart-icon-badge">
            {currentView === "pie" || currentView === "donut" ? "🥧" : currentView === "line" || currentView === "area" ? "📈" : currentView === "table" ? "📋" : "📊"}
          </div>
          <div>
            <h4 className="vitya-chart-title">{titleText}</h4>
            <p className="vitya-chart-subtitle">{data.length} periods analyzed</p>
          </div>
        </div>

        {/* View Switcher Controls */}
        <div className="vitya-chart-controls">
          <button
            type="button"
            className={`vitya-chart-btn ${currentView === "bar" ? "active" : ""}`}
            onClick={() => setActiveView("bar")}
            title="Bar Chart"
          >
            <BarChart2 size={13} />
            <span>Bar</span>
          </button>
          <button
            type="button"
            className={`vitya-chart-btn ${currentView === "line" ? "active" : ""}`}
            onClick={() => setActiveView("line")}
            title="Line Trend"
          >
            <TrendingUp size={13} />
            <span>Line</span>
          </button>
          <button
            type="button"
            className={`vitya-chart-btn ${currentView === "donut" || currentView === "pie" ? "active" : ""}`}
            onClick={() => setActiveView("donut")}
            title="Donut / Pie Chart"
          >
            <PieIcon size={13} />
            <span>Donut</span>
          </button>
          <button
            type="button"
            className={`vitya-chart-btn ${currentView === "area" ? "active" : ""}`}
            onClick={() => setActiveView("area")}
            title="Area Chart"
          >
            <Sparkles size={13} />
            <span>Area</span>
          </button>
          <button
            type="button"
            className={`vitya-chart-btn ${currentView === "table" ? "active" : ""}`}
            onClick={() => setActiveView("table")}
            title="Data Table View"
          >
            <TableIcon size={13} />
            <span>Table</span>
          </button>
          <button
            type="button"
            className="vitya-chart-btn"
            onClick={handleDownloadPNG}
            title="Download PNG Image"
          >
            <Download size={13} color="#38bdf8" />
          </button>
          <button
            type="button"
            className="vitya-chart-btn"
            onClick={handleCopyData}
            title="Copy Data (CSV)"
          >
            {copied ? <Check size={13} color="#10b981" /> : <Copy size={13} />}
          </button>
        </div>
      </div>

      {/* Analytics Summary Metric Pills */}
      {totalSum > 0 && (
        <div className="vitya-chart-metrics-row">
          <div className="vitya-metric-pill highlight">
            <span>Total:</span>
            <strong>{formatCurrency(totalSum)}</strong>
          </div>
          {topItem && (
            <div className="vitya-metric-pill">
              <span>Top:</span>
              <strong>{topItem[xKey]} ({formatCurrency(topItem[yKey] ?? topItem.expense ?? topItem.income)})</strong>
            </div>
          )}
          {avgVal > 0 && (
            <div className="vitya-metric-pill green">
              <span>Avg:</span>
              <strong>{formatCurrency(avgVal)}</strong>
            </div>
          )}
        </div>
      )}

      {/* Canvas Area */}
      <div className="vitya-chart-canvas-container">
        {(() => {
          if (currentView === "table") {
            return (
              <div className="vitya-chart-table-wrap">
                <table className="vitya-chart-table">
                  <thead>
                    <tr>
                      <th>#</th>
                      <th>{xKey.toUpperCase()}</th>
                      {isMultiSeries ? (
                        <>
                          <th>INCOME</th>
                          <th>EXPENSE</th>
                        </>
                      ) : (
                        <>
                          <th>AMOUNT</th>
                          <th>SHARE</th>
                        </>
                      )}
                    </tr>
                  </thead>
                  <tbody>
                    {data.map((item, idx) => {
                      const val = Number(item[yKey] ?? item.amount ?? item.expense ?? item.income) || 0;
                      const pct = totalSum > 0 ? ((val / totalSum) * 100).toFixed(1) : 0;
                      return (
                        <tr key={idx}>
                          <td style={{ color: "#94a3b8", fontWeight: 600 }}>{idx + 1}</td>
                          <td style={{ fontWeight: 600 }}>{item[xKey] || `Item ${idx + 1}`}</td>
                          {isMultiSeries ? (
                            <>
                              <td style={{ fontWeight: 700, color: "#10b981" }}>{formatCurrency(item.income || 0)}</td>
                              <td style={{ fontWeight: 700, color: "#f43f5e" }}>{formatCurrency(item.expense || 0)}</td>
                            </>
                          ) : (
                            <>
                              <td style={{ fontWeight: 700, color: "#38bdf8" }}>{formatCurrency(val)}</td>
                              <td style={{ minWidth: 100 }}>
                                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", fontSize: 11 }}>
                                  <span>{pct}%</span>
                                </div>
                                <div className="vitya-table-progress-bar">
                                  <div
                                    className="vitya-table-progress-fill"
                                    style={{ width: `${Math.min(pct, 100)}%`, backgroundColor: PALETTE[idx % PALETTE.length] }}
                                  />
                                </div>
                              </td>
                            </>
                          )}
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            );
          }

          if (currentView === "pie" || currentView === "donut") {
            const isDonut = currentView === "donut" || rawType === "donut";
            const pieData = isMultiSeries
              ? [
                  { name: "Total Income", value: data.reduce((acc, d) => acc + (Number(d.income) || 0), 0) },
                  { name: "Total Expense", value: data.reduce((acc, d) => acc + (Number(d.expense) || 0), 0) },
                ].filter((d) => d.value > 0)
              : data.map((d) => ({
                  name: d[xKey],
                  value: Number(d[yKey] ?? d.amount ?? d.value) || 0,
                }));

            return (
              <ResponsiveContainer width="100%" height={260}>
                <PieChart>
                  <Tooltip content={<CustomChartTooltip xKey="name" yKey="value" totalSum={totalSum} />} />
                  <Pie
                    data={pieData}
                    dataKey="value"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    innerRadius={isDonut ? 56 : 0}
                    outerRadius={88}
                    paddingAngle={isDonut ? 3 : 1}
                    stroke="rgba(15, 23, 42, 0.8)"
                    strokeWidth={2}
                  >
                    {pieData.map((_, i) => (
                      <Cell
                        key={i}
                        fill={PALETTE[i % PALETTE.length]}
                        style={{ filter: "drop-shadow(0 4px 10px rgba(0, 0, 0, 0.4))" }}
                      />
                    ))}
                  </Pie>
                  <Legend
                    verticalAlign="bottom"
                    height={36}
                    formatter={(value) => (
                      <span style={{ color: "#cbd5e1", fontSize: 12, fontWeight: 500, marginRight: 8 }}>
                        {value}
                      </span>
                    )}
                  />
                </PieChart>
              </ResponsiveContainer>
            );
          }

          if (currentView === "area") {
            return (
              <ResponsiveContainer width="100%" height={250}>
                <AreaChart data={data} margin={{ top: 12, right: 12, left: -15, bottom: 0 }}>
                  <defs>
                    <linearGradient id="vityaAreaGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#8b5cf6" stopOpacity={0.55} />
                      <stop offset="90%" stopColor="#8b5cf6" stopOpacity={0.02} />
                    </linearGradient>
                    <linearGradient id="vityaIncomeGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#10b981" stopOpacity={0.5} />
                      <stop offset="90%" stopColor="#10b981" stopOpacity={0.02} />
                    </linearGradient>
                    <linearGradient id="vityaExpenseGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#f43f5e" stopOpacity={0.5} />
                      <stop offset="90%" stopColor="#f43f5e" stopOpacity={0.02} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255, 255, 255, 0.07)" vertical={false} />
                  <XAxis dataKey={xKey} stroke="#64748b" tick={{ fill: "#94a3b8", fontSize: 11.5 }} tickLine={false} />
                  <YAxis stroke="#64748b" tick={{ fill: "#94a3b8", fontSize: 11 }} tickLine={false} tickFormatter={formatCurrency} />
                  <Tooltip content={<CustomChartTooltip xKey={xKey} yKey={yKey} totalSum={totalSum} />} />
                  {isMultiSeries ? (
                    <>
                      <Legend verticalAlign="top" height={30} />
                      <Area type="monotone" dataKey="income" name="Income" stroke="#10b981" strokeWidth={2.5} fill="url(#vityaIncomeGrad)" />
                      <Area type="monotone" dataKey="expense" name="Expense" stroke="#f43f5e" strokeWidth={2.5} fill="url(#vityaExpenseGrad)" />
                    </>
                  ) : (
                    <Area
                      type="monotone"
                      dataKey={yKey}
                      stroke="#8b5cf6"
                      strokeWidth={2.8}
                      fill="url(#vityaAreaGradient)"
                      dot={{ fill: "#ffffff", stroke: "#8b5cf6", strokeWidth: 2, r: 4 }}
                      activeDot={{ r: 6, fill: "#a855f7", stroke: "#ffffff", strokeWidth: 2 }}
                    />
                  )}
                </AreaChart>
              </ResponsiveContainer>
            );
          }

          if (currentView === "line" || currentView === "line_chart" || currentView === "multi_line") {
            return (
              <ResponsiveContainer width="100%" height={250}>
                <LineChart data={data} margin={{ top: 12, right: 12, left: -15, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255, 255, 255, 0.07)" vertical={false} />
                  <XAxis dataKey={xKey} stroke="#64748b" tick={{ fill: "#94a3b8", fontSize: 11.5 }} tickLine={false} />
                  <YAxis stroke="#64748b" tick={{ fill: "#94a3b8", fontSize: 11 }} tickLine={false} tickFormatter={formatCurrency} />
                  <Tooltip content={<CustomChartTooltip xKey={xKey} yKey={yKey} totalSum={totalSum} />} />
                  {isMultiSeries ? (
                    <>
                      <Legend verticalAlign="top" height={30} />
                      <Line type="monotone" dataKey="income" name="Income" stroke="#10b981" strokeWidth={3} dot={{ r: 4 }} activeDot={{ r: 6 }} />
                      <Line type="monotone" dataKey="expense" name="Expense" stroke="#f43f5e" strokeWidth={3} dot={{ r: 4 }} activeDot={{ r: 6 }} />
                    </>
                  ) : (
                    <Line
                      type="monotone"
                      dataKey={yKey}
                      stroke="#38bdf8"
                      strokeWidth={3}
                      dot={{ fill: "#0f172a", stroke: "#38bdf8", strokeWidth: 2.5, r: 4.5 }}
                      activeDot={{ r: 7, fill: "#38bdf8", stroke: "#ffffff", strokeWidth: 2 }}
                    />
                  )}
                </LineChart>
              </ResponsiveContainer>
            );
          }

          if (currentView === "scatter") {
            return (
              <ResponsiveContainer width="100%" height={250}>
                <ScatterChart margin={{ top: 12, right: 12, left: -15, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255, 255, 255, 0.07)" />
                  <XAxis dataKey={xKey} type="number" stroke="#64748b" tick={{ fill: "#94a3b8", fontSize: 11 }} tickFormatter={formatCurrency} />
                  <YAxis dataKey={yKey} type="number" stroke="#64748b" tick={{ fill: "#94a3b8", fontSize: 11 }} tickFormatter={formatCurrency} />
                  <Tooltip contentStyle={{ backgroundColor: "rgba(15, 23, 42, 0.95)", border: "1px solid rgba(139, 92, 246, 0.35)", borderRadius: 10 }} />
                  <Scatter data={data} fill="#8b5cf6" />
                </ScatterChart>
              </ResponsiveContainer>
            );
          }

          if (currentView === "radar") {
            return (
              <ResponsiveContainer width="100%" height={260}>
                <RadarChart data={data}>
                  <PolarGrid stroke="rgba(255, 255, 255, 0.12)" />
                  <PolarAngleAxis dataKey={xKey} stroke="#94a3b8" tick={{ fill: "#cbd5e1", fontSize: 11 }} />
                  <PolarRadiusAxis stroke="#64748b" />
                  <Tooltip contentStyle={{ backgroundColor: "rgba(15, 23, 42, 0.95)", border: "1px solid rgba(139, 92, 246, 0.35)", borderRadius: 10 }} />
                  <Radar dataKey={yKey} fill="#8b5cf6" fillOpacity={0.5} stroke="#8b5cf6" strokeWidth={2} />
                </RadarChart>
              </ResponsiveContainer>
            );
          }

          if (currentView === "waterfall") {
            return (
              <ResponsiveContainer width="100%" height={250}>
                <BarChart data={data} margin={{ top: 12, right: 12, left: -15, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255, 255, 255, 0.07)" vertical={false} />
                  <XAxis dataKey="name" stroke="#64748b" tick={{ fill: "#94a3b8", fontSize: 11 }} tickLine={false} />
                  <YAxis stroke="#64748b" tick={{ fill: "#94a3b8", fontSize: 11 }} tickLine={false} tickFormatter={formatCurrency} />
                  <Tooltip content={<CustomChartTooltip xKey="name" yKey="amount" totalSum={0} />} />
                  <Bar dataKey="amount" radius={[8, 8, 0, 0]}>
                    {data.map((entry, index) => {
                      const isNeg = Number(entry.amount) < 0;
                      return <Cell key={index} fill={isNeg ? "#f43f5e" : index === 0 ? "#10b981" : "#38bdf8"} />;
                    })}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            );
          }

          if (currentView === "composed") {
            return (
              <ResponsiveContainer width="100%" height={250}>
                <ComposedChart data={data} margin={{ top: 12, right: 12, left: -15, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255, 255, 255, 0.07)" vertical={false} />
                  <XAxis dataKey={xKey} stroke="#64748b" tick={{ fill: "#94a3b8", fontSize: 11 }} tickLine={false} />
                  <YAxis stroke="#64748b" tick={{ fill: "#94a3b8", fontSize: 11 }} tickLine={false} tickFormatter={formatCurrency} />
                  <Tooltip content={<CustomChartTooltip xKey={xKey} yKey={yKey} totalSum={totalSum} />} />
                  <Bar dataKey={yKey} fill="#8b5cf6" radius={[6, 6, 0, 0]} />
                  <Line type="monotone" dataKey={yKey} stroke="#f59e0b" strokeWidth={2.5} dot={{ r: 4 }} />
                </ComposedChart>
              </ResponsiveContainer>
            );
          }

          // Default: Cyber Modern Bar Chart with Dual Series or Multi-color Slices
          return (
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={data} margin={{ top: 12, right: 12, left: -15, bottom: 0 }}>
                <defs>
                  <linearGradient id="vityaBarGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#8b5cf6" stopOpacity={1} />
                    <stop offset="100%" stopColor="#6366f1" stopOpacity={0.7} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255, 255, 255, 0.07)" vertical={false} />
                <XAxis dataKey={xKey} stroke="#64748b" tick={{ fill: "#94a3b8", fontSize: 11.5 }} tickLine={false} />
                <YAxis stroke="#64748b" tick={{ fill: "#94a3b8", fontSize: 11 }} tickLine={false} tickFormatter={formatCurrency} />
                <Tooltip content={<CustomChartTooltip xKey={xKey} yKey={yKey} totalSum={totalSum} />} />
                {isMultiSeries ? (
                  <>
                    <Legend verticalAlign="top" height={30} />
                    <Bar dataKey="income" name="Income" fill="#10b981" radius={[6, 6, 0, 0]} />
                    <Bar dataKey="expense" name="Expense" fill="#f43f5e" radius={[6, 6, 0, 0]} />
                  </>
                ) : (
                  <Bar dataKey={yKey} radius={[8, 8, 2, 2]}>
                    {data.map((_, idx) => (
                      <Cell
                        key={idx}
                        fill={PALETTE[idx % PALETTE.length]}
                        style={{
                          filter: "drop-shadow(0 4px 8px rgba(0, 0, 0, 0.3))",
                          transition: "all 0.25s ease",
                        }}
                      />
                    ))}
                  </Bar>
                )}
              </BarChart>
            </ResponsiveContainer>
          );
        })()}
      </div>
    </div>
  );
};

export default ChatCharts;
