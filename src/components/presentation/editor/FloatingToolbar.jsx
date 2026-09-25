import React from "react";
import { 
  Bold, 
  Italic, 
  Underline, 
  AlignLeft, 
  AlignCenter, 
  AlignRight, 
  Sparkles, 
  Copy, 
  Trash2, 
  Maximize2, 
  BarChart2, 
  Palette 
} from "lucide-react";

export default function FloatingToolbar({
  element,
  onUpdateElement,
  onDuplicateElement,
  onDeleteElement,
  onAiRefine
}) {
  if (!element) return null;

  const handleBoldToggle = () => {
    onUpdateElement(element.id, {
      fontWeight: element.fontWeight === "bold" || element.fontWeight === "700" ? "normal" : "bold"
    });
  };

  const handleItalicToggle = () => {
    onUpdateElement(element.id, {
      fontStyle: element.fontStyle === "italic" ? "normal" : "italic"
    });
  };

  const handleUnderlineToggle = () => {
    onUpdateElement(element.id, {
      textDecoration: element.textDecoration === "underline" ? "none" : "underline"
    });
  };

  return (
    <div
      className="floating-contextual-toolbar"
      style={{
        left: `${Math.min(75, Math.max(5, element.x || 10))}%`,
        top: `${Math.max(2, (element.y || 20) - 9)}%`
      }}
      onClick={(e) => e.stopPropagation()}
    >
      {/* TYPE BADGE */}
      <span className="float-type-badge">{element.type.toUpperCase()}</span>

      {/* TEXT SPECIFIC CONTROLS */}
      {element.type === "text" && (
        <>
          <button
            className={`float-btn ${element.fontWeight === "bold" || element.fontWeight === "700" ? "active" : ""}`}
            onClick={handleBoldToggle}
            title="Bold (Ctrl+B)"
          >
            <Bold size={13} />
          </button>
          <button
            className={`float-btn ${element.fontStyle === "italic" ? "active" : ""}`}
            onClick={handleItalicToggle}
            title="Italic (Ctrl+I)"
          >
            <Italic size={13} />
          </button>
          <button
            className={`float-btn ${element.textDecoration === "underline" ? "active" : ""}`}
            onClick={handleUnderlineToggle}
            title="Underline (Ctrl+U)"
          >
            <Underline size={13} />
          </button>
          <div className="float-divider" />
          <button
            className={`float-btn ${element.align === "left" ? "active" : ""}`}
            onClick={() => onUpdateElement(element.id, { align: "left" })}
            title="Align Left"
          >
            <AlignLeft size={13} />
          </button>
          <button
            className={`float-btn ${element.align === "center" ? "active" : ""}`}
            onClick={() => onUpdateElement(element.id, { align: "center" })}
            title="Align Center"
          >
            <AlignCenter size={13} />
          </button>
          <button
            className={`float-btn ${element.align === "right" ? "active" : ""}`}
            onClick={() => onUpdateElement(element.id, { align: "right" })}
            title="Align Right"
          >
            <AlignRight size={13} />
          </button>
          <div className="float-divider" />
          <button
            className="float-btn ai-action-pill"
            onClick={() => onAiRefine?.(element.content || "")}
            title="AI Refine text"
          >
            <Sparkles size={12} />
            <span>AI Refine</span>
          </button>
        </>
      )}

      {/* IMAGE SPECIFIC CONTROLS */}
      {element.type === "image" && (
        <>
          <button
            className="float-btn"
            onClick={() => {
              const url = prompt("Enter Image URL:", element.url || "");
              if (url !== null) onUpdateElement(element.id, { url });
            }}
            title="Replace Image URL"
          >
            <Maximize2 size={13} />
            <span>Replace</span>
          </button>
          <button
            className="float-btn ai-action-pill"
            onClick={() => onAiRefine?.("image")}
            title="Generate or Replace with AI Image"
          >
            <Sparkles size={12} />
            <span>AI Image</span>
          </button>
        </>
      )}

      {/* CHART SPECIFIC CONTROLS */}
      {element.type === "chart" && (
        <>
          <button
            className="float-btn"
            onClick={() => {
              const currentType = (
                element.chart_type ||
                element.chartType ||
                element.data?.chart_type ||
                element.data?.chartType ||
                "bar"
              ).toLowerCase();
              const chartTypes = ["bar", "line", "area", "pie", "donut", "radar"];
              let idx = chartTypes.findIndex(t => currentType.includes(t));
              if (idx === -1) idx = 0;
              const nextType = chartTypes[(idx + 1) % chartTypes.length];
              onUpdateElement(element.id, {
                chart_type: nextType,
                chartType: nextType,
                data: { ...(element.data || {}), chart_type: nextType, chartType: nextType }
              });
            }}
            title="Cycle Chart Type (Bar -> Line -> Area -> Pie -> Donut -> Radar)"
          >
            <BarChart2 size={13} />
            <span>{
              element.chart_type ||
              element.chartType ||
              element.data?.chart_type ||
              "Bar"
            }</span>
          </button>
          <button
            className="float-btn ai-action-pill"
            onClick={() => onAiRefine?.("chart")}
            title="Analyze & Refine Chart Data with AI"
          >
            <Sparkles size={12} />
            <span>Analyze</span>
          </button>
        </>
      )}

      {/* SHAPE SPECIFIC CONTROLS */}
      {element.type === "shape" && (
        <div className="float-color-wrap" title="Change Shape Fill Color">
          <Palette size={13} />
          <input
            type="color"
            value={element.fill_color || "#38bdf8"}
            onChange={(e) => onUpdateElement(element.id, { fill_color: e.target.value })}
            className="float-color-picker"
          />
        </div>
      )}

      {/* COMMON ACTIONS */}
      <div className="float-divider" />
      <button
        className="float-btn"
        onClick={() => onDuplicateElement(element.id)}
        title="Duplicate Element (Ctrl+D)"
      >
        <Copy size={13} />
      </button>
      <button
        className="float-btn danger"
        onClick={() => onDeleteElement(element.id)}
        title="Delete Element (Delete)"
      >
        <Trash2 size={13} />
      </button>
    </div>
  );
}
