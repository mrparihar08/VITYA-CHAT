import React from "react";
import SelectionOverlay from "./SelectionOverlay";

function normalizeElement(el) {
  if (!el) return {};
  const data = el.data || {};

  return {
    ...el,
    id: el.id,
    type: el.type || "text",
    x: el.x !== undefined ? Number(el.x) : 10,
    y: el.y !== undefined ? Number(el.y) : 10,
    width: el.width !== undefined ? Number(el.width) : 30,
    height: el.height !== undefined ? Number(el.height) : 20,
    content: el.content || el.text || data.text || data.content || "",
    fontSize: el.fontSize !== undefined ? Number(el.fontSize) : 16,
    fontWeight: el.fontWeight || "normal",
    fontStyle: el.fontStyle || "normal",
    textDecoration: el.textDecoration || "none",
    color: el.color || el.text_color || data.color || data.text_color || "#ffffff",
    align: el.align || "left",
    valign: el.valign || "top",
    fontFamily: el.fontFamily || "Inter, Arial, sans-serif",
    lineHeight: el.lineHeight || 1.4,
    letterSpacing: el.letterSpacing || "normal",
    bg_color: el.bg_color || el.fill_color || data.bg_color || data.fill_color || "transparent",
    borderRadius: el.borderRadius !== undefined ? Number(el.borderRadius) : 4,
    url: el.url || data.url || "",
    caption: el.caption || data.caption || "",
    shape_type: el.shape_type || (el.type === "shape" ? "rectangle" : "rectangle"),
    fill_color: el.fill_color || el.bg_color || data.fill_color || "rgba(139, 92, 246, 0.2)",
    stroke_color: el.stroke_color || data.stroke_color || "#8b5cf6",
    stroke_width: el.stroke_width !== undefined ? Number(el.stroke_width) : 1.5,
    radius: el.radius !== undefined ? Number(el.radius) : 8,
    points: Array.isArray(el.points) && el.points.length ? el.points : (Array.isArray(data.points) ? data.points : []),
    chart_type: el.chart_type || el.chartType || data.chart_type || data.chartType || "bar",
    labels: Array.isArray(el.labels) && el.labels.length ? el.labels : (Array.isArray(data.labels) ? data.labels : (Array.isArray(data.categories) ? data.categories : [])),
    values: Array.isArray(el.values) && el.values.length ? el.values : (Array.isArray(data.values) ? data.values : []),
    headers: Array.isArray(el.headers) && el.headers.length ? el.headers : (Array.isArray(data.headers) ? data.headers : []),
    rows: Array.isArray(el.rows) && el.rows.length ? el.rows : (Array.isArray(data.rows) ? data.rows : []),
    phases: Array.isArray(el.phases) && el.phases.length ? el.phases : (Array.isArray(data.phases) ? data.phases : (Array.isArray(el.steps) ? el.steps : (Array.isArray(data.steps) ? data.steps : []))),
    number: el.number || data.number || "",
    label: el.label || data.label || "",
    sublabel: el.sublabel || data.sublabel || "",
    title: el.title || data.title || "",
    icon: el.icon || data.icon || "💡",
    code: el.code || data.code || "",
    language: el.language || data.language || "python",
    name: el.name || data.name || "",
    role: el.role || data.role || "",
    bio: Array.isArray(el.bio) ? el.bio : (Array.isArray(data.bio) ? data.bio : []),
    items: Array.isArray(el.items) ? el.items : (Array.isArray(data.items) ? data.items : []),
    pros: Array.isArray(el.pros) ? el.pros : (Array.isArray(data.pros) ? data.pros : []),
    cons: Array.isArray(el.cons) ? el.cons : (Array.isArray(data.cons) ? data.cons : []),
    pros_title: el.pros_title || data.pros_title || "✅ STRENGTHS & ADVANTAGES",
    cons_title: el.cons_title || data.cons_title || "❌ CHALLENGES & CONSIDERATIONS"
  };
}

export default function CanvasElement({
  element,
  isSelected,
  isDragging,
  onSelect,
  onUpdateElement,
  onPointerDownResize,
  onMouseDownResize,
  onPointerDownDrag,
  onMouseDownDrag
}) {
  if (!element) return null;

  const norm = normalizeElement(element);
  const { id, type } = norm;

  const containerStyle = {
    position: "absolute",
    left: `${norm.x}%`,
    top: `${norm.y}%`,
    width: `${norm.width}%`,
    height: `${norm.height}%`,
    boxSizing: "border-box"
  };

  const renderContent = () => {
    switch (type) {
      case "text":
      case "title":
      case "subtitle": {
        const currentText = norm.content;
        // Check for process flowchart step syntax: "[Step 1] ➔ [Step 2]"
        if (
          typeof currentText === "string" &&
          (currentText.includes("➔") || currentText.includes("->") || currentText.includes("→") || currentText.includes("➜")) &&
          currentText.includes("[")
        ) {
          const parsedSteps = currentText
            .split(/\s*(?:➔|➜|->|-->|→|⇒|\||\n|;)\s*/)
            .map((s) => s.replace(/\[|\]/g, "").trim())
            .filter(Boolean)
            .map((step, i) => ({
              phase: `Step ${i + 1}`,
              title: step,
              status: i === 0 ? "COMPLETED" : i === 1 ? "IN PROGRESS" : "PLANNED"
            }));

          return (
            <div className="element-diagram-flowchart" style={{ backgroundColor: norm.bg_color }}>
              {parsedSteps.map((pItem, pIdx) => (
                <React.Fragment key={pIdx}>
                  <div className="flowchart-step-card">
                    <div className="flow-step-badge">STEP {pIdx + 1}</div>
                    <div className="flow-step-title">{pItem.title}</div>
                  </div>
                  {pIdx < parsedSteps.length - 1 && <div className="flow-arrow-icon">➔</div>}
                </React.Fragment>
              ))}
            </div>
          );
        }

        return (
          <div
            className="element-text-content"
            contentEditable={true}
            suppressContentEditableWarning={true}
            onBlur={(e) => {
              const newText = e.target.innerText;
              if (newText !== currentText) {
                onUpdateElement?.(id, { content: newText, text: newText });
              }
            }}
            onKeyDown={(e) => e.stopPropagation()}
            style={{
              fontSize: `${norm.fontSize}px`,
              fontWeight: norm.fontWeight,
              fontStyle: norm.fontStyle,
              textDecoration: norm.textDecoration,
              color: norm.color,
              backgroundColor: norm.bg_color,
              padding: norm.bg_color && norm.bg_color !== "transparent" ? "8px 12px" : undefined,
              borderRadius: norm.borderRadius ? `${norm.borderRadius}px` : "4px",
              textAlign: norm.align,
              fontFamily: norm.fontFamily,
              lineHeight: norm.lineHeight,
              letterSpacing: norm.letterSpacing,
              display: "flex",
              flexDirection: "column",
              justifyContent: norm.valign === "middle" ? "center" : norm.valign === "bottom" ? "flex-end" : "flex-start",
              alignItems: norm.align === "center" ? "center" : norm.align === "right" ? "flex-end" : "flex-start",
              width: "100%",
              height: "100%",
              wordBreak: "break-word",
              overflowWrap: "break-word",
              outline: "none",
              cursor: "text"
            }}
          >
            {currentText || "Type text here..."}
          </div>
        );
      }

      case "image":
        return (
          <div
            className="element-image-container"
            style={{
              borderRadius: `${norm.borderRadius}px`,
              backgroundColor: norm.bg_color
            }}
          >
            <img
              src={norm.url || "https://images.unsplash.com/photo-1518770660439-4636190af475?w=800"}
              alt={norm.caption || "Presentation Visual"}
              draggable={false}
              style={{
                borderRadius: `${norm.borderRadius}px`,
                width: "100%",
                height: "100%",
                objectFit: "cover",
                userSelect: "none",
                WebkitUserDrag: "none"
              }}
            />
            {norm.caption && norm.caption.length <= 35 && !norm.caption.toLowerCase().includes("introduction") && (
              <span className="image-caption" style={{ pointerEvents: "none" }}>
                {norm.caption}
              </span>
            )}
          </div>
        );

      case "shape":
        return (
          <div
            className={`element-shape-container shape-${norm.shape_type}`}
            style={{
              backgroundColor: norm.fill_color,
              borderColor: norm.stroke_color,
              borderWidth: `${norm.stroke_width}px`,
              borderStyle: norm.stroke_width ? "solid" : "none",
              borderRadius:
                norm.shape_type === "circle"
                  ? "50%"
                  : norm.shape_type === "rounded_rectangle"
                  ? `${norm.radius}px`
                  : "2px",
              width: "100%",
              height: "100%",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              boxSizing: "border-box"
            }}
          >
            {norm.content && (
              <span
                className="shape-inner-text"
                style={{
                  color: norm.color || "#ffffff",
                  fontSize: `${norm.fontSize}px`,
                  textAlign: "center",
                  padding: "4px"
                }}
              >
                {norm.content}
              </span>
            )}
          </div>
        );

      case "chart": {
        const rawChartType = String(norm.chart_type).toLowerCase().trim();
        let chartType = "bar";
        if (rawChartType.includes("line")) chartType = "line";
        else if (rawChartType.includes("area")) chartType = "area";
        else if (rawChartType.includes("donut") || rawChartType.includes("doughnut")) chartType = "donut";
        else if (rawChartType.includes("pie")) chartType = "pie";
        else if (rawChartType.includes("radar") || rawChartType.includes("spider")) chartType = "radar";

        const chartValues = norm.values && norm.values.length ? norm.values : [40, 65, 85, 95];
        const chartLabels = norm.labels && norm.labels.length ? norm.labels : ["Q1", "Q2", "Q3", "Q4"];
        const maxVal = Math.max(...chartValues, 10);
        const primaryColor = norm.color || "#38bdf8";
        const colors = [primaryColor, "#8b5cf6", "#f59e0b", "#10b981", "#ec4899", "#f43f5e"];

        const renderChartBody = () => {
          if (chartType === "bar") {
            return (
              <div className="chart-bars-wrap">
                {chartValues.map((val, i) => (
                  <div key={i} className="chart-bar-item">
                    <div className="chart-bar-fill-wrap">
                      <div
                        className="chart-bar-fill"
                        style={{
                          height: `${Math.max(5, (val / maxVal) * 100)}%`,
                          backgroundColor: colors[i % colors.length]
                        }}
                      />
                    </div>
                    <span className="chart-bar-label">{chartLabels[i] || `P${i + 1}`}</span>
                    <span className="chart-bar-val">{val}</span>
                  </div>
                ))}
              </div>
            );
          }

          if (chartType === "line" || chartType === "area") {
            const width = 280;
            const height = 110;
            const padding = 20;
            const stepX = (width - padding * 2) / Math.max(1, chartValues.length - 1);

            const pointsCoord = chartValues.map((val, i) => {
              const xCoord = padding + i * stepX;
              const yCoord = height - padding - (val / maxVal) * (height - padding * 2);
              return { x: xCoord, y: yCoord, val, label: chartLabels[i] };
            });

            const pointsString = pointsCoord.map((p) => `${p.x},${p.y}`).join(" ");
            const areaString = `${padding},${height - padding} ${pointsString} ${width - padding},${height - padding}`;

            return (
              <div className="svg-chart-wrap" style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", width: "100%", height: "100%" }}>
                <svg viewBox={`0 0 ${width} ${height}`} style={{ width: "100%", height: "100%", overflow: "visible" }}>
                  <line x1={padding} y1={height - padding} x2={width - padding} y2={height - padding} stroke="rgba(255,255,255,0.15)" strokeWidth="1" />
                  <line x1={padding} y1={padding} x2={width - padding} y2={padding} stroke="rgba(255,255,255,0.1)" strokeDasharray="3,3" strokeWidth="1" />

                  {chartType === "area" && <polygon points={areaString} fill="url(#areaGrad)" opacity="0.4" />}

                  <defs>
                    <linearGradient id="areaGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor={primaryColor} stopOpacity="0.8" />
                      <stop offset="100%" stopColor={primaryColor} stopOpacity="0.0" />
                    </linearGradient>
                  </defs>

                  <polyline points={pointsString} fill="none" stroke={primaryColor} strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />

                  {pointsCoord.map((p, i) => (
                    <g key={i}>
                      <circle cx={p.x} cy={p.y} r="4" fill={colors[i % colors.length]} stroke="#0f172a" strokeWidth="2" />
                      <text x={p.x} y={height - 2} textAnchor="middle" fill="#94a3b8" fontSize="9">{p.label}</text>
                      <text x={p.x} y={p.y - 6} textAnchor="middle" fill="#ffffff" fontSize="9" fontWeight="bold">{p.val}</text>
                    </g>
                  ))}
                </svg>
              </div>
            );
          }

          if (chartType === "pie" || chartType === "donut") {
            const total = chartValues.reduce((a, b) => a + b, 0) || 1;
            const slices = chartValues.map((val, i) => ({
              val,
              label: chartLabels[i] || `P${i + 1}`,
              color: colors[i % colors.length],
              percentage: Math.round((val / total) * 100)
            }));

            return (
              <div className="pie-chart-wrap" style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "space-around", width: "100%", gap: 10 }}>
                <div style={{ position: "relative", width: 90, height: 90, flexShrink: 0 }}>
                  <svg viewBox="0 0 32 32" style={{ width: "100%", height: "100%", transform: "rotate(-90deg)", borderRadius: "50%" }}>
                    {slices.map((slice, i) => {
                      const dashArray = `${(slice.val / total) * 100} 100`;
                      let strokeDashoffset = 0;
                      for (let j = 0; j < i; j++) {
                        strokeDashoffset -= (chartValues[j] / total) * 100;
                      }
                      return (
                        <circle
                          key={i}
                          cx="16"
                          cy="16"
                          r="16"
                          fill="transparent"
                          stroke={slice.color}
                          strokeWidth="32"
                          strokeDasharray={dashArray}
                          strokeDashoffset={strokeDashoffset}
                        />
                      );
                    })}
                  </svg>

                  {chartType === "donut" && (
                    <div style={{
                      position: "absolute",
                      top: "25%",
                      left: "25%",
                      right: "25%",
                      bottom: "25%",
                      background: "#0f172a",
                      borderRadius: "50%",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center"
                    }}>
                      <span style={{ fontSize: 10, fontWeight: 800, color: "#ffffff" }}>{total}</span>
                    </div>
                  )}
                </div>

                <div style={{ display: "flex", flexDirection: "column", gap: 3 }}>
                  {slices.map((s, i) => (
                    <div key={i} style={{ display: "flex", alignItems: "center", gap: 5, fontSize: 10, color: "#cbd5e1" }}>
                      <span style={{ width: 7, height: 7, borderRadius: "50%", background: s.color, flexShrink: 0 }} />
                      <span style={{ fontWeight: 600 }}>{s.label}:</span>
                      <span style={{ color: "#ffffff", fontWeight: 700 }}>{s.val}</span>
                    </div>
                  ))}
                </div>
              </div>
            );
          }

          if (chartType === "radar") {
            const size = 110;
            const center = size / 2;
            const radius = size * 0.38;
            const numAxes = Math.max(3, chartValues.length);
            const angleStep = (Math.PI * 2) / numAxes;

            const radarPoints = chartValues.map((val, i) => {
              const angle = i * angleStep - Math.PI / 2;
              const r = (val / maxVal) * radius;
              return {
                x: center + r * Math.cos(angle),
                y: center + r * Math.sin(angle),
                label: chartLabels[i] || `A${i + 1}`,
                val
              };
            });

            const polygonString = radarPoints.map((p) => `${p.x},${p.y}`).join(" ");

            return (
              <div className="radar-chart-wrap" style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", width: "100%" }}>
                <svg viewBox={`0 0 ${size} ${size}`} style={{ width: 110, height: 110 }}>
                  {[0.4, 0.7, 1].map((scale, level) => (
                    <polygon
                      key={level}
                      points={Array.from({ length: numAxes }).map((_, i) => {
                        const angle = i * angleStep - Math.PI / 2;
                        return `${center + radius * scale * Math.cos(angle)},${center + radius * scale * Math.sin(angle)}`;
                      }).join(" ")}
                      fill="none"
                      stroke="rgba(255,255,255,0.12)"
                      strokeWidth="1"
                    />
                  ))}

                  {Array.from({ length: numAxes }).map((_, i) => {
                    const angle = i * angleStep - Math.PI / 2;
                    return (
                      <line
                        key={i}
                        x1={center}
                        y1={center}
                        x2={center + radius * Math.cos(angle)}
                        y2={center + radius * Math.sin(angle)}
                        stroke="rgba(255,255,255,0.15)"
                        strokeWidth="1"
                      />
                    );
                  })}

                  <polygon points={polygonString} fill="rgba(56, 189, 248, 0.35)" stroke={primaryColor} strokeWidth="2" />

                  {radarPoints.map((p, i) => (
                    <circle key={i} cx={p.x} cy={p.y} r="3" fill={primaryColor} />
                  ))}
                </svg>
              </div>
            );
          }

          return null;
        };

        return (
          <div className="element-chart-container" style={{ backgroundColor: norm.bg_color || "rgba(15, 23, 42, 0.6)" }}>
            {norm.title && <div className="chart-title" style={{ color: norm.color || "#ffffff" }}>{norm.title}</div>}
            {renderChartBody()}
          </div>
        );
      }

      case "bullets": {
        const bulletList = norm.points && norm.points.length ? norm.points : ["Key takeaway point 1", "Key takeaway point 2"];
        return (
          <div
            id={`bullets-container-${id}`}
            className="element-bullets-container"
            style={{
              color: norm.color || "#ffffff",
              backgroundColor: norm.bg_color || "rgba(30, 41, 59, 0.65)",
              border: "1px solid rgba(255, 255, 255, 0.12)",
              padding: norm.title ? "14px 18px" : "16px 18px",
              borderRadius: `${norm.borderRadius || 8}px`,
              fontSize: `${norm.fontSize || 14}px`,
              fontFamily: norm.fontFamily,
              width: "100%",
              height: "100%",
              boxSizing: "border-box",
              boxShadow: "0 4px 16px rgba(0, 0, 0, 0.25)",
              display: "flex",
              flexDirection: "column",
              overflow: "hidden"
            }}
          >
            {norm.title && (
              <div
                style={{
                  fontSize: "11px",
                  fontWeight: 800,
                  color: "#38bdf8",
                  letterSpacing: "0.8px",
                  textTransform: "uppercase",
                  marginBottom: "10px",
                  borderBottom: "1px solid rgba(255, 255, 255, 0.08)",
                  paddingBottom: "6px"
                }}
              >
                {norm.title}
              </div>
            )}
            <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: "10px", flex: 1 }}>
              {bulletList.map((pt, i) => (
                <li
                  key={i}
                  data-bullet-idx={i}
                  style={{
                    display: "flex",
                    alignItems: "flex-start",
                    gap: "10px",
                    lineHeight: "1.45"
                  }}
                >
                  <span style={{ color: "#38bdf8", fontWeight: 800, fontSize: "16px", lineHeight: "1", flexShrink: 0, marginTop: "2px" }}>
                    •
                  </span>
                  <div
                    contentEditable={true}
                    suppressContentEditableWarning={true}
                    onBlur={(e) => {
                      const updatedPoints = [...bulletList];
                      updatedPoints[i] = e.target.innerText;
                      onUpdateElement?.(id, { points: updatedPoints });
                    }}
                    onKeyDown={(e) => {
                      e.stopPropagation();
                      if (e.key === "Enter" && !e.shiftKey) {
                        e.preventDefault();
                        const currentText = e.target.innerText;
                        const updatedPoints = [...bulletList];
                        updatedPoints[i] = currentText;
                        updatedPoints.splice(i + 1, 0, "");
                        onUpdateElement?.(id, { points: updatedPoints });

                        setTimeout(() => {
                          const container = document.getElementById(`bullets-container-${id}`);
                          const nextLi = container?.querySelector(`[data-bullet-idx="${i + 1}"] [contenteditable="true"]`);
                          if (nextLi) {
                            nextLi.focus();
                            const sel = window.getSelection();
                            const range = document.createRange();
                            range.selectNodeContents(nextLi);
                            range.collapse(true);
                            sel?.removeAllRanges();
                            sel?.addRange(range);
                          }
                        }, 50);
                      } else if (e.key === "Backspace" && (e.target.innerText === "" || e.target.innerText === "\n") && bulletList.length > 1) {
                        e.preventDefault();
                        const updatedPoints = bulletList.filter((_, idx) => idx !== i);
                        onUpdateElement?.(id, { points: updatedPoints });

                        setTimeout(() => {
                          const container = document.getElementById(`bullets-container-${id}`);
                          const prevIdx = Math.max(0, i - 1);
                          const prevLi = container?.querySelector(`[data-bullet-idx="${prevIdx}"] [contenteditable="true"]`);
                          if (prevLi) {
                            prevLi.focus();
                          }
                        }, 50);
                      }
                    }}
                    style={{ flex: 1, cursor: "text", outline: "none", minHeight: "1.4em", color: norm.color || "#f1f5f9" }}
                  >
                    {pt}
                  </div>
                </li>
              ))}
            </ul>
          </div>
        );
      }

      case "table": {
        const tableHeaders = norm.headers && norm.headers.length ? norm.headers : ["Feature", "Standard", "Enterprise"];
        const tableRows = norm.rows && norm.rows.length ? norm.rows : [["Uptime", "99.9%", "99.99%"], ["Support", "24/7 Email", "Dedicated SLA"]];
        return (
          <div className="element-table-container" style={{ backgroundColor: norm.bg_color, borderRadius: "6px", width: "100%", height: "100%", overflow: "hidden" }}>
            <table className="mini-ppt-table" style={{ width: "100%", height: "100%" }}>
              <thead>
                <tr>
                  {tableHeaders.map((h, i) => (
                    <th key={i}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {tableRows.map((row, rIdx) => (
                  <tr key={rIdx}>
                    {row.map((cell, cIdx) => (
                      <td key={cIdx} style={{ color: norm.color || "#e2e8f0" }}>{cell}</td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        );
      }

      case "stat":
        return (
          <div className="element-stat-card" style={{ backgroundColor: norm.bg_color || "rgba(15, 23, 42, 0.7)", width: "100%", height: "100%", boxSizing: "border-box" }}>
            <div
              className="stat-number"
              contentEditable={true}
              suppressContentEditableWarning={true}
              onBlur={(e) => {
                onUpdateElement?.(id, { number: e.target.innerText });
              }}
              onKeyDown={(e) => e.stopPropagation()}
              style={{ color: norm.color || "#10b981", cursor: "text", outline: "none" }}
            >
              {norm.number || "95%"}
            </div>
            <div
              className="stat-label"
              contentEditable={true}
              suppressContentEditableWarning={true}
              onBlur={(e) => {
                onUpdateElement?.(id, { label: e.target.innerText });
              }}
              onKeyDown={(e) => e.stopPropagation()}
              style={{ color: norm.color || "#f1f5f9", cursor: "text", outline: "none" }}
            >
              {norm.label || "Performance Metric"}
            </div>
            {norm.sublabel && (
              <div
                className="stat-sublabel"
                contentEditable={true}
                suppressContentEditableWarning={true}
                onBlur={(e) => {
                  onUpdateElement?.(id, { sublabel: e.target.innerText });
                }}
                onKeyDown={(e) => e.stopPropagation()}
                style={{ cursor: "text", outline: "none" }}
              >
                {norm.sublabel}
              </div>
            )}
          </div>
        );

      case "roadmap":
      case "diagram": {
        let rawPhases = norm.phases;
        if (!rawPhases || !rawPhases.length) {
          const diagramStr = norm.content || norm.title;
          if (typeof diagramStr === "string" && diagramStr.trim()) {
            rawPhases = diagramStr
              .split(/➔|->|>|,/)
              .map((s) => s.replace(/\[|\]/g, "").trim())
              .filter(Boolean)
              .map((step, i) => {
                let phase = `Phase ${i + 1}`;
                let title = step;
                if (step.includes(":")) {
                  const parts = step.split(":");
                  phase = parts[0].trim();
                  title = parts.slice(1).join(":").trim();
                }
                return {
                  phase,
                  title,
                  status: i === 0 ? "COMPLETED" : i === 1 ? "IN PROGRESS" : "PLANNED"
                };
              });
          }
        }

        const filteredPhases = rawPhases ? rawPhases.filter((p) => (typeof p === "string" ? p.trim().length > 0 : p && (p.title || p.phase || p.name))) : [];
        const roadmapPhases = filteredPhases && filteredPhases.length ? filteredPhases : [
          { phase: "Phase 1", title: "Q1 Architecture", status: "COMPLETED" },
          { phase: "Phase 2", title: "Q2 Pilot Launch", status: "IN PROGRESS" },
          { phase: "Phase 3", title: "Q3 Scale & Deploy", status: "PLANNED" },
          { phase: "Phase 4", title: "Q4 Optimization", status: "PLANNED" }
        ];

        const diagType = String(norm.chart_type || norm.shape_type || (type === "roadmap" ? "timeline" : "flowchart")).toLowerCase();

        // 1. ARCHITECTURE STACK
        if (diagType === "architecture" || diagType === "stack") {
          return (
            <div className="element-diagram-stack" style={{ backgroundColor: norm.bg_color, width: "100%", height: "100%" }}>
              <div className="diag-header-badge">🏛️ SYSTEM ARCHITECTURE STACK</div>
              <div className="architecture-layers-wrap">
                {roadmapPhases.map((pItem, pIdx) => {
                  const titleLabel = typeof pItem === "string" ? pItem : pItem.title || pItem.name || pItem.label || `Layer ${pIdx + 1}`;
                  return (
                    <div key={pIdx} className="architecture-layer-card">
                      <span className="layer-tag">LAYER {pIdx + 1}</span>
                      <span className="layer-title">{titleLabel}</span>
                    </div>
                  );
                })}
              </div>
            </div>
          );
        }

        // 2. PYRAMID HIERARCHY
        if (diagType === "pyramid") {
          const reversedPhases = [...roadmapPhases].reverse();
          const numS = reversedPhases.length;
          return (
            <div className="element-diagram-pyramid" style={{ backgroundColor: norm.bg_color, width: "100%", height: "100%" }}>
              <div className="diag-header-badge">🔺 HIERARCHY PYRAMID</div>
              <div className="pyramid-levels-wrap">
                {reversedPhases.map((pItem, pIdx) => {
                  const titleLabel = typeof pItem === "string" ? pItem : pItem.title || pItem.name || `Tier ${numS - pIdx}`;
                  const widthPct = Math.max(35, 100 - pIdx * (60 / Math.max(1, numS - 1)));
                  return (
                    <div key={pIdx} className="pyramid-tier-card" style={{ width: `${widthPct}%` }}>
                      <span className="tier-tag">TIER {numS - pIdx}</span>
                      <span className="tier-title">{titleLabel}</span>
                    </div>
                  );
                })}
              </div>
            </div>
          );
        }

        // 3. FUNNEL STAGE
        if (diagType === "funnel") {
          const numS = roadmapPhases.length;
          return (
            <div className="element-diagram-funnel" style={{ backgroundColor: norm.bg_color, width: "100%", height: "100%" }}>
              <div className="diag-header-badge">🔻 CONVERSION FUNNEL</div>
              <div className="funnel-stages-wrap">
                {roadmapPhases.map((pItem, pIdx) => {
                  const titleLabel = typeof pItem === "string" ? pItem : pItem.title || pItem.name || `Stage ${pIdx + 1}`;
                  const widthPct = Math.max(40, 100 - pIdx * (55 / Math.max(1, numS - 1)));
                  return (
                    <div key={pIdx} className="funnel-stage-card" style={{ width: `${widthPct}%` }}>
                      <span className="stage-tag">STAGE {pIdx + 1}</span>
                      <span className="stage-title">{titleLabel}</span>
                    </div>
                  );
                })}
              </div>
            </div>
          );
        }

        // 4. CIRCULAR CYCLE
        if (diagType === "cycle" || diagType === "loop") {
          return (
            <div className="element-diagram-cycle" style={{ backgroundColor: norm.bg_color, width: "100%", height: "100%" }}>
              <div className="cycle-hub-badge">🔁 CYCLED PROCESS</div>
              <div className="cycle-nodes-grid">
                {roadmapPhases.map((pItem, pIdx) => {
                  const titleLabel = typeof pItem === "string" ? pItem : pItem.title || pItem.name || `Phase ${pIdx + 1}`;
                  return (
                    <div key={pIdx} className="cycle-node-card">
                      <span className="node-number">{pIdx + 1}</span>
                      <span className="node-title">{titleLabel}</span>
                    </div>
                  );
                })}
              </div>
            </div>
          );
        }

        // 5. TIMELINE / ROADMAP
        if (diagType === "timeline" || type === "roadmap") {
          return (
            <div className="element-diagram-timeline" style={{ backgroundColor: norm.bg_color, width: "100%", height: "100%" }}>
              <div className="timeline-axis-line" />
              <div className="timeline-cards-row">
                {roadmapPhases.map((pItem, pIdx) => {
                  const phaseLabel = typeof pItem === "string" ? `M${pIdx + 1}` : pItem.phase || `M${pIdx + 1}`;
                  const titleLabel = typeof pItem === "string" ? pItem : pItem.title || pItem.name || `Milestone ${pIdx + 1}`;
                  const statusLabel = typeof pItem === "string" ? "PLANNED" : pItem.status || "PLANNED";
                  return (
                    <div key={pIdx} className="timeline-milestone-card">
                      <div className="milestone-dot">{phaseLabel}</div>
                      <div className="milestone-title">{titleLabel}</div>
                      <div className={`phase-status status-${statusLabel.toLowerCase().replace(/\s+/g, "-")}`}>
                        {statusLabel}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          );
        }

        // 6. QUADRANT 2X2
        if (diagType === "quadrant" || diagType === "matrix") {
          return (
            <div className="element-diagram-quadrant" style={{ backgroundColor: norm.bg_color, width: "100%", height: "100%" }}>
              <div className="quadrant-2x2-grid">
                {roadmapPhases.slice(0, 4).map((pItem, pIdx) => {
                  const titleLabel = typeof pItem === "string" ? pItem : pItem.title || pItem.name || `Q${pIdx + 1}`;
                  return (
                    <div key={pIdx} className="quadrant-card">
                      <span className="quadrant-badge">Q{pIdx + 1}</span>
                      <span className="quadrant-title">{titleLabel}</span>
                    </div>
                  );
                })}
              </div>
            </div>
          );
        }

        // 7. INPUT-OUTPUT DATA PIPELINE
        if (diagType === "io_cards" || diagType === "io") {
          const ioLabels = ["INPUT DATA", "PROCESSING ENGINE", "OUTPUT RESULT"];
          return (
            <div className="element-diagram-iocards" style={{ backgroundColor: norm.bg_color, width: "100%", height: "100%" }}>
              {roadmapPhases.map((pItem, pIdx) => {
                const titleLabel = typeof pItem === "string" ? pItem : pItem.title || pItem.name || `Step ${pIdx + 1}`;
                const tagLabel = ioLabels[pIdx] || `STAGE ${pIdx + 1}`;
                return (
                  <React.Fragment key={pIdx}>
                    <div className="io-step-card">
                      <span className="io-tag">{tagLabel}</span>
                      <span className="io-title">{titleLabel}</span>
                    </div>
                    {pIdx < roadmapPhases.length - 1 && <span className="io-arrow">➔</span>}
                  </React.Fragment>
                );
              })}
            </div>
          );
        }

        // 8. MINDMAP CONCEPT
        if (diagType === "mindmap" || diagType === "tree") {
          const rootTitle = typeof roadmapPhases[0] === "string" ? roadmapPhases[0] : roadmapPhases[0]?.title || "Core Concept";
          const branches = roadmapPhases.slice(1);
          return (
            <div className="element-diagram-mindmap" style={{ backgroundColor: norm.bg_color, width: "100%", height: "100%" }}>
              <div className="mindmap-root-node">🧠 {rootTitle}</div>
              {branches.length > 0 && (
                <div className="mindmap-branches-row">
                  {branches.map((pItem, pIdx) => {
                    const titleLabel = typeof pItem === "string" ? pItem : pItem.title || pItem.name || `Branch ${pIdx + 1}`;
                    return (
                      <div key={pIdx} className="mindmap-branch-card">
                        🔹 {titleLabel}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          );
        }

        // 9. DEFAULT FLOWCHART
        return (
          <div className="element-diagram-flowchart" style={{ backgroundColor: norm.bg_color, width: "100%", height: "100%" }}>
            {roadmapPhases.map((pItem, pIdx) => {
              const phaseLabel = typeof pItem === "string" ? `Step ${pIdx + 1}` : pItem.phase || `Step ${pIdx + 1}`;
              const titleLabel = typeof pItem === "string" ? pItem : pItem.title || pItem.name || `Step ${pIdx + 1}`;
              return (
                <React.Fragment key={pIdx}>
                  <div className="flowchart-step-card">
                    <div className="flow-step-badge">{phaseLabel}</div>
                    <div className="flow-step-title">{titleLabel}</div>
                  </div>
                  {pIdx < roadmapPhases.length - 1 && <div className="flow-arrow-icon">➔</div>}
                </React.Fragment>
              );
            })}
          </div>
        );
      }

      case "callout": {
        const calloutText = norm.content || "AI automation accelerated operational throughput by 45%.";
        const calloutTitle = norm.title || "KEY STRATEGIC TAKEAWAY";
        const calloutIcon = norm.icon || "💡";
        return (
          <div className="element-callout-card" style={{ backgroundColor: norm.bg_color || "rgba(139, 92, 246, 0.12)", width: "100%", height: "100%", boxSizing: "border-box" }}>
            <div className="callout-header">
              <span className="callout-icon">{calloutIcon}</span>
              <span
                className="callout-title"
                contentEditable={true}
                suppressContentEditableWarning={true}
                onBlur={(e) => {
                  onUpdateElement?.(id, { title: e.target.innerText });
                }}
                onKeyDown={(e) => e.stopPropagation()}
                style={{ cursor: "text", outline: "none" }}
              >
                {calloutTitle}
              </span>
            </div>
            <p
              className="callout-text"
              contentEditable={true}
              suppressContentEditableWarning={true}
              onBlur={(e) => {
                onUpdateElement?.(id, { content: e.target.innerText, text: e.target.innerText });
              }}
              onKeyDown={(e) => e.stopPropagation()}
              style={{ color: norm.color || "#f8fafc", cursor: "text", outline: "none" }}
            >
              {calloutText}
            </p>
          </div>
        );
      }

      case "kpi_grid": {
        const kpisList = norm.items && norm.items.length ? norm.items : [
          { number: "$12.5M", label: "ARR Revenue", trend: "+34% ↗" },
          { number: "99.99%", label: "SLA Uptime", trend: "+0.5% ↗" },
          { number: "450K", label: "Active Users", trend: "+18% ↗" },
          { number: "< 12ms", label: "API Latency", trend: "-25% ↘" }
        ];
        return (
          <div className="element-kpi-grid" style={{ width: "100%", height: "100%", boxSizing: "border-box" }}>
            {kpisList.map((kpi, kIdx) => (
              <div key={kIdx} className="kpi-card" style={{ backgroundColor: norm.bg_color || "rgba(15, 23, 42, 0.75)" }}>
                <div className="kpi-number" style={{ color: norm.color || "#38bdf8" }}>{kpi.number || kpi.val || "100"}</div>
                <div className="kpi-label" style={{ color: norm.color || "#cbd5e1" }}>{kpi.label || kpi.title || "Metric"}</div>
                {kpi.trend && <div className="kpi-trend">{kpi.trend}</div>}
              </div>
            ))}
          </div>
        );
      }

      case "pros_cons": {
        const prosList = norm.pros && norm.pros.length ? norm.pros : ["High Horizontal Scalability", "Low Query Latency", "Zero Downtime"];
        const consList = norm.cons && norm.cons.length ? norm.cons : ["Initial Setup Overhead", "Cloud Refactoring Effort"];
        return (
          <div className="element-pros-cons-grid" style={{ width: "100%", height: "100%", boxSizing: "border-box" }}>
            <div className="pros-card" style={{ backgroundColor: norm.bg_color || "rgba(34, 197, 94, 0.08)" }}>
              <div className="pros-header">{norm.pros_title}</div>
              <ul style={{ color: norm.color || "#cbd5e1" }}>
                {prosList.map((p, i) => <li key={i}>{p}</li>)}
              </ul>
            </div>
            <div className="cons-card" style={{ backgroundColor: "rgba(239, 68, 68, 0.08)" }}>
              <div className="cons-header">{norm.cons_title}</div>
              <ul style={{ color: norm.color || "#cbd5e1" }}>
                {consList.map((c, i) => <li key={i}>{c}</li>)}
              </ul>
            </div>
          </div>
        );
      }

      case "code_block": {
        const codeSnippet = norm.code || "async def process_telemetry(job_id: str):\n    res = await service.fetch(job_id)\n    return {'status': 'success', 'data': res}";
        const codeTitle = norm.title || "api_router.py";
        return (
          <div className="element-code-block" style={{ backgroundColor: norm.bg_color || "#090d16", width: "100%", height: "100%", boxSizing: "border-box" }}>
            <div className="code-header">
              <span className="code-title">{codeTitle}</span>
              <span className="code-lang">{norm.language}</span>
            </div>
            <pre className="code-content" style={{ color: norm.color || "#38bdf8" }}>{codeSnippet}</pre>
          </div>
        );
      }

      case "speaker_card": {
        const speakerName = norm.name || "Dr. Alex Vance";
        const speakerRole = norm.role || "Chief AI Architect & Principal Engineer";
        const speakerBio = norm.bio && norm.bio.length ? norm.bio : ["15+ Years Distributed Systems Architecture", "Lead Architect at Vitya AI"];
        return (
          <div className="element-speaker-card" style={{ backgroundColor: norm.bg_color || "rgba(15, 23, 42, 0.7)", width: "100%", height: "100%", boxSizing: "border-box" }}>
            <div className="speaker-avatar">👤</div>
            <div className="speaker-details">
              <div className="speaker-name" style={{ color: norm.color || "#ffffff" }}>{speakerName}</div>
              <div className="speaker-role">{speakerRole}</div>
              {Array.isArray(speakerBio) && speakerBio.map((b, i) => <div key={i} className="speaker-bio-item">• {b}</div>)}
            </div>
          </div>
        );
      }

      case "paragraph":
      case "paragraph_2col": {
        const paraText = norm.content || "Enter descriptive paragraph narrative here...";
        const colItems = norm.items;
        if (Array.isArray(colItems) && colItems.length > 0) {
          return (
            <div className="element-paragraph-2col" style={{ width: "100%", height: "100%", display: "grid", gridTemplateColumns: `repeat(${colItems.length}, 1fr)`, gap: "12px", boxSizing: "border-box" }}>
              {colItems.map((item, i) => (
                <div key={i} className="para-col" style={{ backgroundColor: norm.bg_color || "rgba(30, 41, 59, 0.65)", border: "1px solid rgba(255, 255, 255, 0.12)", borderRadius: "8px", padding: "14px 16px", display: "flex", flexDirection: "column", boxSizing: "border-box", boxShadow: "0 4px 12px rgba(0, 0, 0, 0.2)", overflow: "hidden" }}>
                  {item.title && <div className="para-col-title" style={{ fontSize: "11px", fontWeight: 800, color: "#38bdf8", letterSpacing: "0.5px", textTransform: "uppercase", marginBottom: "8px", borderBottom: "1px solid rgba(255, 255, 255, 0.08)", paddingBottom: "4px" }}>{item.title}</div>}
                  <p
                    contentEditable={true}
                    suppressContentEditableWarning={true}
                    onBlur={(e) => {
                      const updatedItems = [...colItems];
                      updatedItems[i] = { ...updatedItems[i], text: e.target.innerText, content: e.target.innerText };
                      onUpdateElement?.(id, { items: updatedItems });
                    }}
                    onKeyDown={(e) => e.stopPropagation()}
                    style={{ margin: 0, fontSize: `${norm.fontSize || 13}px`, lineHeight: "1.45", color: norm.color || "#cbd5e1", cursor: "text", outline: "none", flex: 1 }}
                  >
                    {item.text || item.content}
                  </p>
                </div>
              ))}
            </div>
          );
        }
        return (
          <div
            className="element-paragraph-container"
            style={{
              color: norm.color || "#f1f5f9",
              backgroundColor: norm.bg_color || "rgba(30, 41, 59, 0.65)",
              border: "1px solid rgba(255, 255, 255, 0.12)",
              padding: "16px 18px",
              borderRadius: `${norm.borderRadius || 8}px`,
              fontSize: `${norm.fontSize || 14}px`,
              fontFamily: norm.fontFamily,
              width: "100%",
              height: "100%",
              boxSizing: "border-box",
              boxShadow: "0 4px 12px rgba(0, 0, 0, 0.2)",
              display: "flex",
              flexDirection: "column",
              overflow: "hidden"
            }}
          >
            {norm.title && (
              <div
                style={{
                  fontSize: "11px",
                  fontWeight: 800,
                  color: "#38bdf8",
                  letterSpacing: "0.8px",
                  textTransform: "uppercase",
                  marginBottom: "8px",
                  borderBottom: "1px solid rgba(255, 255, 255, 0.08)",
                  paddingBottom: "4px"
                }}
              >
                {norm.title}
              </div>
            )}
            <p
              contentEditable={true}
              suppressContentEditableWarning={true}
              onBlur={(e) => {
                const newText = e.target.innerText;
                onUpdateElement?.(id, { content: newText, text: newText });
              }}
              onKeyDown={(e) => e.stopPropagation()}
              style={{ margin: 0, lineHeight: "1.5", cursor: "text", outline: "none", flex: 1 }}
            >
              {paraText}
            </p>
          </div>
        );
      }

      default:
        return <div className="element-generic-box">{type} element</div>;
    }
  };

  const handleDrag = onPointerDownDrag || onMouseDownDrag;
  const handleResize = onPointerDownResize || onMouseDownResize;

  return (
    <div
      className={`canvas-element-item ${isSelected ? "selected" : ""}`}
      style={{
        ...containerStyle,
        cursor: isDragging && isSelected ? "grabbing" : "grab"
      }}
      onClick={(e) => {
        e.stopPropagation();
        onSelect?.(element.id);
      }}
      onPointerDown={(e) => {
        if (e.target.closest && e.target.closest(".resize-handle, .rotation-handle-wrap")) {
          return;
        }
        onSelect?.(element.id);
        handleDrag?.(e, element);
      }}
      onMouseDown={(e) => {
        if (e.target.closest && e.target.closest(".resize-handle, .rotation-handle-wrap")) {
          return;
        }
        onSelect?.(element.id);
        handleDrag?.(e, element);
      }}
    >
      {renderContent()}

      {isSelected && (
        <SelectionOverlay
          element={norm}
          onPointerDownResize={handleResize}
          onMouseDownResize={handleResize}
          onPointerDownDrag={(e) => handleDrag?.(e, element)}
          onMouseDownDrag={(e) => handleDrag?.(e, element)}
        />
      )}
    </div>
  );
}
