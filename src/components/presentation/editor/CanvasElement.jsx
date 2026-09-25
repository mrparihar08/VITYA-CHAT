import React from "react";
import SelectionOverlay from "./SelectionOverlay";

export default function CanvasElement({
  element,
  isSelected,
  onSelect,
  onUpdateElement,
  onTextChange,
  onMouseDownResize,
  onMouseDownDrag
}) {
  if (!element) return null;

  const {
    id,
    type,
    x = 0,
    y = 0,
    width = 30,
    height = 20,
    content,
    fontSize = 16,
    fontWeight = "normal",
    fontStyle = "normal",
    textDecoration = "none",
    color = "#ffffff",
    align = "left",
    valign = "top",
    fontFamily = "Inter",
    lineHeight = 1.4,
    letterSpacing = "normal",
    url,
    caption,
    borderRadius = 8,
    shape_type = "rectangle",
    fill_color = "rgba(139, 92, 246, 0.2)",
    stroke_color = "#8b5cf6",
    stroke_width = 1.5,
    radius = 8,
    points = [],
    labels = [],
    values = [],
    headers = [],
    rows = [],
    phases = [],
    number,
    label
  } = element;

  const dataObj = element.data || {};
  const pointsList = (points && points.length ? points : (dataObj.points && dataObj.points.length ? dataObj.points : []));
  const labelsList = (labels && labels.length ? labels : (dataObj.labels && dataObj.labels.length ? dataObj.labels : (dataObj.categories && dataObj.categories.length ? dataObj.categories : [])));
  const valuesList = (values && values.length ? values : (dataObj.values && dataObj.values.length ? dataObj.values : []));
  const headersList = (headers && headers.length ? headers : (dataObj.headers && dataObj.headers.length ? dataObj.headers : []));
  const rowsList = (rows && rows.length ? rows : (dataObj.rows && dataObj.rows.length ? dataObj.rows : []));
  const phasesList = (phases && phases.length ? phases : (dataObj.phases && dataObj.phases.length ? dataObj.phases : []));

  const isAutoHeightType = ["text", "bullets", "paragraph", "callout", "stat", "pros_cons"].includes(type);

  const containerStyle = {
    left: `${x}%`,
    top: `${y}%`,
    width: `${width}%`,
    height: isAutoHeightType ? "auto" : `${height}%`
  };

  const renderContent = () => {
    switch (type) {
      case "text":
        const currentText = content || element.text || dataObj.text || dataObj.content || "";
        if (typeof currentText === "string" && (currentText.includes("➔") || currentText.includes("->") || currentText.includes("→") || currentText.includes("➜")) && currentText.includes("[")) {
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
            <div className="element-diagram-flowchart" style={{ backgroundColor: element.bg_color || "transparent" }}>
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
            onKeyDown={(e) => {
              e.stopPropagation();
            }}
            style={{
              fontSize: `${fontSize}px`,
              fontWeight,
              fontStyle,
              textDecoration,
              color: element.color || element.text_color || dataObj.color || color || "#ffffff",
              backgroundColor: element.bg_color || element.fill_color || dataObj.bg_color || "transparent",
              padding: element.bg_color || element.fill_color ? "8px 12px" : undefined,
              borderRadius: element.borderRadius ? `${element.borderRadius}px` : "4px",
              textAlign: align,
              fontFamily,
              lineHeight,
              letterSpacing,
              display: "flex",
              flexDirection: "column",
              justifyContent: valign === "middle" ? "center" : valign === "bottom" ? "flex-end" : "flex-start",
              alignItems: align === "center" ? "center" : align === "right" ? "flex-end" : "flex-start",
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

      case "image":
        return (
          <div className="element-image-container" style={{ borderRadius: `${borderRadius}px`, backgroundColor: element.bg_color || element.fill_color || "transparent" }}>
            <img
              src={url || dataObj.url || "https://images.unsplash.com/photo-1518770660439-4636190af475?w=800"}
              alt={caption || dataObj.caption || "Presentation Visual"}
              style={{ borderRadius: `${borderRadius}px` }}
            />
            {(caption || dataObj.caption) && <span className="image-caption">{caption || dataObj.caption}</span>}
          </div>
        );

      case "shape":
        return (
          <div
            className={`element-shape-container shape-${shape_type}`}
            style={{
              backgroundColor: element.fill_color || element.bg_color || fill_color,
              borderColor: stroke_color,
              borderWidth: `${stroke_width}px`,
              borderStyle: stroke_width ? "solid" : "none",
              borderRadius: shape_type === "circle" ? "50%" : shape_type === "rounded_rectangle" ? `${radius}px` : "2px"
            }}
          >
            {(element.text || dataObj.text) && (
              <span 
                className="shape-inner-text"
                style={{
                  color: element.text_color || element.color || dataObj.text_color || "#ffffff",
                  fontSize: `${fontSize}px`
                }}
              >
                {element.text || dataObj.text}
              </span>
            )}
          </div>
        );

      case "chart":
        const rawChartType = (
          element.chart_type ||
          element.chartType ||
          element.chart_style ||
          dataObj.chart_type ||
          dataObj.chartType ||
          dataObj.chart_style ||
          "bar"
        );

        let chartType = "bar";
        const lowerChartType = String(rawChartType).toLowerCase().trim();
        if (lowerChartType.includes("line")) chartType = "line";
        else if (lowerChartType.includes("area")) chartType = "area";
        else if (lowerChartType.includes("donut") || lowerChartType.includes("doughnut")) chartType = "donut";
        else if (lowerChartType.includes("pie")) chartType = "pie";
        else if (lowerChartType.includes("radar") || lowerChartType.includes("spider")) chartType = "radar";
        else if (lowerChartType.includes("bar") || lowerChartType.includes("column")) chartType = "bar";

        const chartValues = valuesList && valuesList.length ? valuesList : [40, 65, 85, 95];
        const chartLabels = labelsList && labelsList.length ? labelsList : ["Q1", "Q2", "Q3", "Q4"];
        const maxVal = Math.max(...chartValues, 10);
        const primaryColor = element.color || element.text_color || dataObj.color || "#38bdf8";
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
                    <span className="chart-bar-label">{chartLabels[i] || `P${i+1}`}</span>
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
              const yCoord = height - padding - ((val / maxVal) * (height - padding * 2));
              return { x: xCoord, y: yCoord, val, label: chartLabels[i] };
            });

            const pointsString = pointsCoord.map(p => `${p.x},${p.y}`).join(" ");
            const areaString = `${padding},${height - padding} ${pointsString} ${width - padding},${height - padding}`;

            return (
              <div className="svg-chart-wrap" style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", width: "100%", height: "100%" }}>
                <svg viewBox={`0 0 ${width} ${height}`} style={{ width: "100%", height: "100%", overflow: "visible" }}>
                  <line x1={padding} y1={height - padding} x2={width - padding} y2={height - padding} stroke="rgba(255,255,255,0.15)" strokeWidth="1" />
                  <line x1={padding} y1={padding} x2={width - padding} y2={padding} stroke="rgba(255,255,255,0.1)" strokeDasharray="3,3" strokeWidth="1" />

                  {chartType === "area" && (
                    <polygon points={areaString} fill="url(#areaGrad)" opacity="0.4" />
                  )}

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
            const slices = chartValues.map((val, i) => {
              const percentage = val / total;
              return {
                val,
                label: chartLabels[i] || `P${i+1}`,
                color: colors[i % colors.length],
                percentage: Math.round(percentage * 100)
              };
            });

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
                      justifyContent: "center",
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
                label: chartLabels[i] || `A${i+1}`,
                val
              };
            });

            const polygonString = radarPoints.map(p => `${p.x},${p.y}`).join(" ");

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
          <div className="element-chart-container" style={{ backgroundColor: element.bg_color || element.fill_color || "rgba(15, 23, 42, 0.6)" }}>
            {element.title && <div className="chart-title" style={{ color: element.color || element.text_color || "#ffffff" }}>{element.title}</div>}
            {renderChartBody()}
          </div>
        );

      case "bullets":
        const bulletList = pointsList && pointsList.length ? pointsList : ["Key takeaway point 1", "Key takeaway point 2"];
        return (
          <div 
            id={`bullets-container-${id}`}
            className="element-bullets-container" 
            style={{ color: element.color || element.text_color || color || "#ffffff", backgroundColor: element.bg_color || element.fill_color || "transparent", padding: element.bg_color || element.fill_color ? "8px 12px" : undefined, borderRadius: "6px", fontSize: `${fontSize}px`, fontFamily }}
          >
            <ul>
              {bulletList.map((pt, i) => (
                <li
                  key={i}
                  data-bullet-idx={i}
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
                        const nextLi = container?.querySelector(`[data-bullet-idx="${i + 1}"]`);
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
                        const prevLi = container?.querySelector(`[data-bullet-idx="${prevIdx}"]`);
                        if (prevLi) {
                          prevLi.focus();
                        }
                      }, 50);
                    }
                  }}
                  style={{ cursor: "text", outline: "none", minHeight: "1.4em" }}
                >
                  {pt}
                </li>
              ))}
            </ul>
          </div>
        );

      case "table":
        const tableHeaders = headersList && headersList.length ? headersList : ["Feature", "Standard", "Enterprise"];
        const tableRows = rowsList && rowsList.length ? rowsList : [["Uptime", "99.9%", "99.99%"], ["Support", "24/7 Email", "Dedicated SLA"]];
        return (
          <div className="element-table-container" style={{ backgroundColor: element.bg_color || element.fill_color || "transparent", borderRadius: "6px" }}>
            <table className="mini-ppt-table">
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
                      <td key={cIdx} style={{ color: element.color || element.text_color || "#e2e8f0" }}>{cell}</td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        );

      case "stat":
        return (
          <div className="element-stat-card" style={{ backgroundColor: element.bg_color || element.fill_color || "rgba(15, 23, 42, 0.7)" }}>
            <div
              className="stat-number"
              contentEditable={true}
              suppressContentEditableWarning={true}
              onBlur={(e) => {
                onUpdateElement?.(id, { number: e.target.innerText });
              }}
              onKeyDown={(e) => e.stopPropagation()}
              style={{ color: element.color || element.text_color || "#10b981", cursor: "text", outline: "none" }}
            >
              {number || dataObj.number || "95%"}
            </div>
            <div
              className="stat-label"
              contentEditable={true}
              suppressContentEditableWarning={true}
              onBlur={(e) => {
                onUpdateElement?.(id, { label: e.target.innerText });
              }}
              onKeyDown={(e) => e.stopPropagation()}
              style={{ color: element.text_color || "#f1f5f9", cursor: "text", outline: "none" }}
            >
              {label || dataObj.label || "Performance Metric"}
            </div>
            {(element.sublabel || dataObj.sublabel) && (
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
                {element.sublabel || dataObj.sublabel}
              </div>
            )}
          </div>
        );

      case "roadmap":
      case "diagram":
        let rawPhases = (
          phasesList && phasesList.length ? phasesList :
          (element.steps && element.steps.length ? element.steps :
          (dataObj.steps && dataObj.steps.length ? dataObj.steps :
          (element.items && element.items.length ? element.items :
          (dataObj.items && dataObj.items.length ? dataObj.items : []))))
        );

        if (!rawPhases || !rawPhases.length) {
          const diagramStr = element.diagram || dataObj.diagram;
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

        const filteredPhases = rawPhases ? rawPhases.filter(p => typeof p === "string" ? p.trim().length > 0 : (p && (p.title || p.phase || p.name))) : [];
        const roadmapPhases = (filteredPhases && filteredPhases.length) ? filteredPhases : [
          { phase: "Phase 1", title: "Q1 Architecture", status: "COMPLETED" },
          { phase: "Phase 2", title: "Q2 Pilot Launch", status: "IN PROGRESS" },
          { phase: "Phase 3", title: "Q3 Scale & Deploy", status: "PLANNED" },
          { phase: "Phase 4", title: "Q4 Optimization", status: "PLANNED" }
        ];

        const diagType = (
          element.diagram_type ||
          element.diagramType ||
          dataObj.diagram_type ||
          dataObj.diagramType ||
          (element.type === "roadmap" ? "timeline" : "flowchart")
        ).toLowerCase();

        // 1. ARCHITECTURE STACK DIAGRAM
        if (diagType === "architecture" || diagType === "stack") {
          return (
            <div className="element-diagram-stack" style={{ backgroundColor: element.bg_color || "transparent" }}>
              <div className="diag-header-badge">🏛️ SYSTEM ARCHITECTURE STACK</div>
              <div className="architecture-layers-wrap">
                {roadmapPhases.map((pItem, pIdx) => {
                  const titleLabel = typeof pItem === "string" ? pItem : (pItem.title || pItem.name || pItem.label || `Layer ${pIdx + 1}`);
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

        // 2. PYRAMID HIERARCHY DIAGRAM
        if (diagType === "pyramid") {
          const reversedPhases = [...roadmapPhases].reverse();
          const numS = reversedPhases.length;
          return (
            <div className="element-diagram-pyramid" style={{ backgroundColor: element.bg_color || "transparent" }}>
              <div className="diag-header-badge">🔺 HIERARCHY PYRAMID</div>
              <div className="pyramid-levels-wrap">
                {reversedPhases.map((pItem, pIdx) => {
                  const titleLabel = typeof pItem === "string" ? pItem : (pItem.title || pItem.name || `Tier ${numS - pIdx}`);
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

        // 3. FUNNEL STAGE DIAGRAM
        if (diagType === "funnel") {
          const numS = roadmapPhases.length;
          return (
            <div className="element-diagram-funnel" style={{ backgroundColor: element.bg_color || "transparent" }}>
              <div className="diag-header-badge">🔻 CONVERSION FUNNEL</div>
              <div className="funnel-stages-wrap">
                {roadmapPhases.map((pItem, pIdx) => {
                  const titleLabel = typeof pItem === "string" ? pItem : (pItem.title || pItem.name || `Stage ${pIdx + 1}`);
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

        // 4. CIRCULAR CYCLE LOOP DIAGRAM
        if (diagType === "cycle" || diagType === "loop") {
          return (
            <div className="element-diagram-cycle" style={{ backgroundColor: element.bg_color || "transparent" }}>
              <div className="cycle-hub-badge">🔁 CYCLED PROCESS</div>
              <div className="cycle-nodes-grid">
                {roadmapPhases.map((pItem, pIdx) => {
                  const titleLabel = typeof pItem === "string" ? pItem : (pItem.title || pItem.name || `Phase ${pIdx + 1}`);
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

        // 5. TIMELINE / ROADMAP DIAGRAM
        if (diagType === "timeline" || element.type === "roadmap") {
          return (
            <div className="element-diagram-timeline" style={{ backgroundColor: element.bg_color || "transparent" }}>
              <div className="timeline-axis-line" />
              <div className="timeline-cards-row">
                {roadmapPhases.map((pItem, pIdx) => {
                  const phaseLabel = typeof pItem === "string" ? `M${pIdx + 1}` : (pItem.phase || `M${pIdx + 1}`);
                  const titleLabel = typeof pItem === "string" ? pItem : (pItem.title || pItem.name || `Milestone ${pIdx + 1}`);
                  const statusLabel = typeof pItem === "string" ? "PLANNED" : (pItem.status || "PLANNED");
                  return (
                    <div key={pIdx} className="timeline-milestone-card">
                      <div className="milestone-dot">{phaseLabel}</div>
                      <div className="milestone-title">{titleLabel}</div>
                      <div className={`phase-status status-${statusLabel.toLowerCase().replace(/\s+/g, '-')}`}>
                        {statusLabel}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          );
        }

        // 6. QUADRANT 2X2 MATRIX DIAGRAM
        if (diagType === "quadrant" || diagType === "matrix") {
          return (
            <div className="element-diagram-quadrant" style={{ backgroundColor: element.bg_color || "transparent" }}>
              <div className="quadrant-2x2-grid">
                {roadmapPhases.slice(0, 4).map((pItem, pIdx) => {
                  const titleLabel = typeof pItem === "string" ? pItem : (pItem.title || pItem.name || `Q${pIdx + 1}`);
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

        // 7. INPUT-OUTPUT DATA PIPELINE CARDS
        if (diagType === "io_cards" || diagType === "io") {
          const ioLabels = ["INPUT DATA", "PROCESSING ENGINE", "OUTPUT RESULT"];
          return (
            <div className="element-diagram-iocards" style={{ backgroundColor: element.bg_color || "transparent" }}>
              {roadmapPhases.map((pItem, pIdx) => {
                const titleLabel = typeof pItem === "string" ? pItem : (pItem.title || pItem.name || `Step ${pIdx + 1}`);
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

        // 8. MINDMAP CONCEPT NETWORK
        if (diagType === "mindmap" || diagType === "tree") {
          const rootTitle = typeof roadmapPhases[0] === "string" ? roadmapPhases[0] : (roadmapPhases[0]?.title || "Core Concept");
          const branches = roadmapPhases.slice(1);
          return (
            <div className="element-diagram-mindmap" style={{ backgroundColor: element.bg_color || "transparent" }}>
              <div className="mindmap-root-node">🧠 {rootTitle}</div>
              {branches.length > 0 && (
                <div className="mindmap-branches-row">
                  {branches.map((pItem, pIdx) => {
                    const titleLabel = typeof pItem === "string" ? pItem : (pItem.title || pItem.name || `Branch ${pIdx + 1}`);
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

        // 9. DEFAULT FLOWCHART / PROCESS STEPS (DEFAULT)
        return (
          <div className="element-diagram-flowchart" style={{ backgroundColor: element.bg_color || "transparent" }}>
            {roadmapPhases.map((pItem, pIdx) => {
              const phaseLabel = typeof pItem === "string" ? `Step ${pIdx + 1}` : (pItem.phase || `Step ${pIdx + 1}`);
              const titleLabel = typeof pItem === "string" ? pItem : (pItem.title || pItem.name || `Step ${pIdx + 1}`);
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

      case "callout":
        const calloutText = content || element.text || dataObj.text || "AI automation accelerated operational throughput by 45%.";
        const calloutTitle = element.title || dataObj.title || "KEY STRATEGIC TAKEAWAY";
        const calloutIcon = element.icon || dataObj.icon || "💡";
        return (
          <div className="element-callout-card" style={{ backgroundColor: element.bg_color || element.fill_color || "rgba(139, 92, 246, 0.12)" }}>
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
              style={{ color: element.color || element.text_color || "#f8fafc", cursor: "text", outline: "none" }}
            >
              {calloutText}
            </p>
          </div>
        );

      case "kpi_grid":
        const kpisList = element.kpis || dataObj.kpis || [
          { number: "$12.5M", label: "ARR Revenue", trend: "+34% ↗" },
          { number: "99.99%", label: "SLA Uptime", trend: "+0.5% ↗" },
          { number: "450K", label: "Active Users", trend: "+18% ↗" },
          { number: "< 12ms", label: "API Latency", trend: "-25% ↘" }
        ];
        return (
          <div className="element-kpi-grid">
            {kpisList.map((kpi, kIdx) => (
              <div key={kIdx} className="kpi-card" style={{ backgroundColor: element.bg_color || element.fill_color || "rgba(15, 23, 42, 0.75)" }}>
                <div className="kpi-number" style={{ color: element.color || "#38bdf8" }}>{kpi.number || kpi.val || "100"}</div>
                <div className="kpi-label" style={{ color: element.text_color || "#cbd5e1" }}>{kpi.label || kpi.title || "Metric"}</div>
                {kpi.trend && <div className="kpi-trend">{kpi.trend}</div>}
              </div>
            ))}
          </div>
        );

      case "pros_cons":
        const prosList = element.pros || dataObj.pros || ["High Horizontal Scalability", "Low Query Latency", "Zero Downtime"];
        const consList = element.cons || dataObj.cons || ["Initial Setup Overhead", "Cloud Refactoring Effort"];
        return (
          <div className="element-pros-cons-grid">
            <div className="pros-card" style={{ backgroundColor: element.bg_color || "rgba(34, 197, 94, 0.08)" }}>
              <div className="pros-header">{element.pros_title || dataObj.pros_title || "✅ STRENGTHS & ADVANTAGES"}</div>
              <ul style={{ color: element.color || element.text_color || "#cbd5e1" }}>
                {prosList.map((p, i) => <li key={i}>{p}</li>)}
              </ul>
            </div>
            <div className="cons-card" style={{ backgroundColor: element.cons_bg_color || "rgba(239, 68, 68, 0.08)" }}>
              <div className="cons-header">{element.cons_title || dataObj.cons_title || "❌ CHALLENGES"}</div>
              <ul style={{ color: element.color || element.text_color || "#cbd5e1" }}>
                {consList.map((c, i) => <li key={i}>{c}</li>)}
              </ul>
            </div>
          </div>
        );

      case "code_block":
        const codeSnippet = element.code || dataObj.code || "async def process_telemetry(job_id: str):\n    res = await service.fetch(job_id)\n    return {'status': 'success', 'data': res}";
        const codeTitle = element.title || dataObj.title || "api_router.py";
        return (
          <div className="element-code-block" style={{ backgroundColor: element.bg_color || element.fill_color || "#090d16" }}>
            <div className="code-header">
              <span className="code-title">{codeTitle}</span>
              <span className="code-lang">{element.language || dataObj.language || "python"}</span>
            </div>
            <pre className="code-content" style={{ color: element.color || element.text_color || "#38bdf8" }}>{codeSnippet}</pre>
          </div>
        );

      case "speaker_card":
        const speakerName = element.name || dataObj.name || "Dr. Alex Vance";
        const speakerRole = element.role || dataObj.role || "Chief AI Architect & Principal Engineer";
        const speakerBio = element.bio || dataObj.bio || ["15+ Years Distributed Systems Architecture", "Lead Architect at Vitya AI"];
        return (
          <div className="element-speaker-card" style={{ backgroundColor: element.bg_color || element.fill_color || "rgba(15, 23, 42, 0.7)" }}>
            <div className="speaker-avatar">👤</div>
            <div className="speaker-details">
              <div className="speaker-name" style={{ color: element.color || element.text_color || "#ffffff" }}>{speakerName}</div>
              <div className="speaker-role">{speakerRole}</div>
              {Array.isArray(speakerBio) && speakerBio.map((b, i) => <div key={i} className="speaker-bio-item">• {b}</div>)}
            </div>
          </div>
        );

      case "paragraph":
      case "paragraph_2col":
        const paraText = content || element.text || dataObj.text || "Enter descriptive paragraph narrative here...";
        const colItems = element.items || dataObj.items;
        if (Array.isArray(colItems) && colItems.length > 0) {
          return (
            <div className="element-paragraph-2col" style={{ color: element.color || element.text_color || "#cbd5e1", backgroundColor: element.bg_color || element.fill_color || "transparent", padding: element.bg_color ? "8px" : undefined, borderRadius: "6px" }}>
              {colItems.map((item, i) => (
                <div key={i} className="para-col">
                  {item.title && <div className="para-col-title">{item.title}</div>}
                  <p
                    contentEditable={true}
                    suppressContentEditableWarning={true}
                    onBlur={(e) => {
                      const updatedItems = [...colItems];
                      updatedItems[i] = { ...updatedItems[i], text: e.target.innerText, content: e.target.innerText };
                      onUpdateElement?.(id, { items: updatedItems });
                    }}
                    onKeyDown={(e) => e.stopPropagation()}
                    style={{ cursor: "text", outline: "none" }}
                  >
                    {item.text || item.content}
                  </p>
                </div>
              ))}
            </div>
          );
        }
        return (
          <div className="element-paragraph-container" style={{ color: element.color || element.text_color || color || "#ffffff", backgroundColor: element.bg_color || element.fill_color || "transparent", padding: element.bg_color ? "8px" : undefined, borderRadius: "6px", fontSize: `${fontSize}px`, fontFamily }}>
            <p
              contentEditable={true}
              suppressContentEditableWarning={true}
              onBlur={(e) => {
                const newText = e.target.innerText;
                onUpdateElement?.(id, { content: newText, text: newText });
              }}
              onKeyDown={(e) => e.stopPropagation()}
              style={{ cursor: "text", outline: "none" }}
            >
              {paraText}
            </p>
          </div>
        );

      default:
        return <div className="element-generic-box">{type} element</div>;
    }
  };

  return (
    <div
      className={`canvas-element-item ${isSelected ? "selected" : ""}`}
      style={containerStyle}
      onClick={(e) => {
        e.stopPropagation();
        onSelect(id);
      }}
    >
      {renderContent()}

      {isSelected && (
        <SelectionOverlay
          element={element}
          onMouseDownResize={onMouseDownResize}
          onMouseDownDrag={(e) => onMouseDownDrag?.(e, element)}
        />
      )}
    </div>
  );
}
