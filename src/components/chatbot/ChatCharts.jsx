import React from "react";
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

const COLORS = ["#8b5cf6", "#22c55e", "#f59e0b", "#f97316", "#ef4444", "#38bdf8"];
const CHART_HEIGHT = 240;

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
      return value;
    }
  }
  return value;
};

const formatMonth = (dateStr) => {
  const d = new Date(dateStr);
  if (Number.isNaN(d.getTime())) return dateStr;
  return d.toLocaleDateString("en-IN", { month: "short", year: "numeric" });
};

const normalizeMultiLineData = (data) => {
  if (!data || typeof data !== "object" || Array.isArray(data)) return data;

  const incomeData = data.income || [];
  const expenseData = data.expense || [];
  const merged = {};

  incomeData.forEach((i) => {
    merged[i.month] = {
      month: formatMonth(i.month),
      income: i.amount ?? 0,
      expense: 0,
    };
  });

  expenseData.forEach((e) => {
    if (merged[e.month]) {
      merged[e.month].expense = e.amount ?? 0;
    } else {
      merged[e.month] = {
        month: formatMonth(e.month),
        income: 0,
        expense: e.amount ?? 0,
      };
    }
  });

  return Object.values(merged);
};

const findArrayDeep = (value, depth = 0) => {
  if (depth > 4 || value == null) return null;
  if (Array.isArray(value)) return value;

  const parsed = safeJSON(value);
  if (Array.isArray(parsed)) return parsed;

  if (parsed && typeof parsed === "object") {
    const preferredKeys = ["data", "items", "rows", "result", "content", "reply", "payload", "chartData"];
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
  const raw = msg.content ?? msg.text ?? msg.data ?? null;
  if ((msg.type || "").toLowerCase().trim() === "multi_line") {
    return normalizeMultiLineData(safeJSON(raw));
  }
  return findArrayDeep(raw);
};

const getKeys = (data, type) => {
  const first = data?.[0] || {};
  let xKey = "category";
  if (first.category !== undefined) xKey = "category";
  else if (first.month !== undefined) xKey = "month";
  else if (first.name !== undefined) xKey = "name";
  else if (first.label !== undefined) xKey = "label";
  else if (first.title !== undefined) xKey = "title";
  else if (first.x !== undefined && type === "scatter") xKey = "x";

  let yKey = "amount";
  if (first.amount !== undefined) yKey = "amount";
  else if (first.value !== undefined) yKey = "value";
  else if (first.count !== undefined) yKey = "count";
  else if (first.y !== undefined && type === "scatter") yKey = "y";

  return { xKey, yKey };
};

export const ChatCharts = ({ msg }) => {
  if (!msg) return null;
  const type = (msg.type || "").toLowerCase().trim();
  const data = getChartData(msg);

  if (!data || !Array.isArray(data) || data.length === 0) {
    return (
      <div style={{ padding: 12, opacity: 0.7, fontSize: 13 }}>
        No chart data available
      </div>
    );
  }

  const { xKey, yKey } = getKeys(data, type);

  switch (type) {
    case "bar":
    case "chart":
      return (
        <ResponsiveContainer width="100%" height={CHART_HEIGHT}>
          <BarChart data={data} margin={{ top: 0, right: 0, left: 0, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey={xKey} />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey={yKey} fill="#8b5cf6" />
          </BarChart>
        </ResponsiveContainer>
      );

    case "line":
    case "line_chart":
      return (
        <ResponsiveContainer width="100%" height={CHART_HEIGHT}>
          <LineChart data={data} margin={{ top: 10, right: 10, left: 10, bottom: 20 }}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey={xKey} />
            <YAxis />
            <Tooltip />
            <Legend />
            <Line type="monotone" dataKey={yKey} stroke="#8b5cf6" strokeWidth={2} />
          </LineChart>
        </ResponsiveContainer>
      );

    case "multi_line":
      return (
        <ResponsiveContainer width="100%" height={CHART_HEIGHT}>
          <LineChart data={data} margin={{ top: 10, right: 10, left: 10, bottom: 20 }}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="month" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Line type="monotone" dataKey="income" stroke="#22c55e" strokeWidth={2} />
            <Line type="monotone" dataKey="expense" stroke="#ef4444" strokeWidth={2} />
          </LineChart>
        </ResponsiveContainer>
      );

    case "pie":
    case "donut":
      return (
        <ResponsiveContainer width="100%" height={CHART_HEIGHT}>
          <PieChart>
            <Pie
              data={data}
              dataKey={yKey}
              nameKey={xKey}
              cx="50%"
              cy="50%"
              innerRadius={type === "donut" ? 50 : 0}
              outerRadius={80}
            >
              {data.map((_, i) => (
                <Cell key={i} fill={COLORS[i % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip />
            <Legend />
          </PieChart>
        </ResponsiveContainer>
      );

    case "composed":
      return (
        <ResponsiveContainer width="100%" height={CHART_HEIGHT}>
          <ComposedChart data={data} margin={{ top: 10, right: 10, left: 10, bottom: 20 }}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey={xKey} />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey={yKey} fill="#8b5cf6" />
            <Line type="monotone" dataKey={yKey} stroke="#f59e0b" />
          </ComposedChart>
        </ResponsiveContainer>
      );

    case "area":
      return (
        <ResponsiveContainer width="100%" height={CHART_HEIGHT}>
          <AreaChart data={data} margin={{ top: 10, right: 10, left: 10, bottom: 20 }}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey={xKey} />
            <YAxis />
            <Tooltip />
            <Area type="monotone" dataKey={yKey} fill="#8b5cf6" stroke="#8b5cf6" />
          </AreaChart>
        </ResponsiveContainer>
      );

    case "scatter":
      return (
        <ResponsiveContainer width="100%" height={CHART_HEIGHT}>
          <ScatterChart margin={{ top: 10, right: 10, left: 10, bottom: 20 }}>
            <CartesianGrid />
            <XAxis dataKey={xKey} type="number" />
            <YAxis dataKey={yKey} type="number" />
            <Tooltip />
            <Scatter data={data} fill="#8b5cf6" />
          </ScatterChart>
        </ResponsiveContainer>
      );

    case "stacked":
    case "waterfall":
      return (
        <ResponsiveContainer width="100%" height={CHART_HEIGHT}>
          <BarChart data={data} margin={{ top: 10, right: 10, left: 10, bottom: 20 }}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey={xKey} />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey={yKey} stackId="a" fill="#8b5cf6" />
          </BarChart>
        </ResponsiveContainer>
      );

    case "radar":
      return (
        <ResponsiveContainer width="100%" height={CHART_HEIGHT}>
          <RadarChart data={data}>
            <PolarGrid />
            <PolarAngleAxis dataKey={xKey} />
            <PolarRadiusAxis />
            <Tooltip />
            <Radar dataKey={yKey} fill="#8b5cf6" stroke="#8b5cf6" />
          </RadarChart>
        </ResponsiveContainer>
      );

    case "heatmap":
      return (
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(40px, 1fr))",
            gap: 6,
            padding: 10,
          }}
        >
          {data.map((item, i) => {
            const value = item.amount ?? item.value ?? item.count ?? 0;
            return (
              <div
                key={i}
                style={{
                  height: 40,
                  borderRadius: 8,
                  background: `rgba(139,92,246, ${Math.min(Number(value) / 1000 || 0, 1)})`,
                }}
                title={`${item.category || item.name || item.month || i}: ${value}`}
              />
            );
          })}
        </div>
      );

    default:
      return (
        <ResponsiveContainer width="100%" height={CHART_HEIGHT}>
          <BarChart data={data} margin={{ top: 0, right: 0, left: 0, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey={xKey} />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey={yKey} fill="#8b5cf6" />
          </BarChart>
        </ResponsiveContainer>
      );
  }
};

export default ChatCharts;
