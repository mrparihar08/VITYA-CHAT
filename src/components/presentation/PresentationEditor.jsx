import React, { useRef, useState, useEffect } from "react";
import { API_BASE_URL, getAuthHeaders } from "../../services/api";
import { downloadFileAsBlob } from "./Presentation";
import SlideEditorRibbonToolbar from "./SlideEditorRibbonToolbar";

export const BACKGROUND_PRESETS = [
  { id: "none", name: "🚫 None (Use Template BG)", bg: "none", text: "#ffffff", accent: "#c084fc", solid_bg: "transparent", bg_start: "transparent", bg_end: "transparent" },
  { id: "dark_gradient", name: "Midnight Purple", bg: "linear-gradient(135deg, #0f172a 0%, #1e1b4b 50%, #31104b 100%)", text: "#ffffff", accent: "#c084fc", solid_bg: "#0f172a", bg_start: "#0f172a", bg_end: "#31104b" },
  { id: "ocean_blue", name: "Ocean Breeze", bg: "linear-gradient(135deg, #06101e 0%, #0b2545 50%, #134074 100%)", text: "#ffffff", accent: "#38bdf8", solid_bg: "#06101e", bg_start: "#06101e", bg_end: "#134074" },
  { id: "emerald_dark", name: "Emerald Forest", bg: "linear-gradient(135deg, #022c22 0%, #064e3b 50%, #047857 100%)", text: "#ffffff", accent: "#34d399", solid_bg: "#022c22", bg_start: "#022c22", bg_end: "#047857" },
  { id: "cyberpunk_neon", name: "Cyberpunk Neon", bg: "linear-gradient(135deg, #09090b 0%, #2e1065 50%, #581c87 100%)", text: "#ffffff", accent: "#f43f5e", solid_bg: "#09090b", bg_start: "#09090b", bg_end: "#581c87" },
  { id: "wall_street", name: "Wall Street Finance", bg: "linear-gradient(135deg, #022c22 0%, #0f172a 50%, #1e293b 100%)", text: "#ffffff", accent: "#10b981", solid_bg: "#022c22", bg_start: "#022c22", bg_end: "#1e293b" },
  { id: "executive_gold", name: "Executive Gold", bg: "linear-gradient(135deg, #1c1917 0%, #451a03 50%, #78350f 100%)", text: "#ffffff", accent: "#f59e0b", solid_bg: "#1c1917", bg_start: "#1c1917", bg_end: "#78350f" },
  { id: "velvet_rose", name: "Velvet Rose", bg: "linear-gradient(135deg, #2a0813 0%, #4c0519 50%, #881337 100%)", text: "#ffffff", accent: "#fb7185", solid_bg: "#2a0813", bg_start: "#2a0813", bg_end: "#881337" },
  { id: "executive_slate", name: "Executive Slate", bg: "linear-gradient(135deg, #18181b 0%, #27272a 50%, #3f3f46 100%)", text: "#ffffff", accent: "#a1a1aa", solid_bg: "#18181b", bg_start: "#18181b", bg_end: "#3f3f46" },
  { id: "clean_light", name: "Minimal Light", bg: "linear-gradient(135deg, #f8fafc 0%, #f1f5f9 50%, #e2e8f0 100%)", text: "#0f172a", accent: "#2563eb", solid_bg: "#f8fafc", bg_start: "#f8fafc", bg_end: "#e2e8f0" },
  { id: "titanium_white", name: "Titanium White", bg: "linear-gradient(135deg, #ffffff 0%, #fafafa 50%, #f4f4f5 100%)", text: "#18181b", accent: "#4f46e5", solid_bg: "#ffffff", bg_start: "#ffffff", bg_end: "#f4f4f5" },
  { id: "sunset_glow", name: "Sunset Glow", bg: "linear-gradient(135deg, #2e1065 0%, #701a75 50%, #9f1239 100%)", text: "#ffffff", accent: "#fb7185", solid_bg: "#2e1065", bg_start: "#2e1065", bg_end: "#9f1239" },
  { id: "custom", name: "🎨 Palette", bg: "custom", text: "#ffffff", accent: "#c084fc", solid_bg: "#0f172a", bg_start: "#1e1b4b", bg_end: "#0f172a" },
];

export const TABLE_THEME_PRESETS = [
  { id: "dark_gradient", name: "Midnight Purple", icon: "🌌", header_bg: "#8b5cf6", header_color: "#ffffff", cell_bg: "#1e293b", cell_color: "#ffffff" },
  { id: "ocean_blue", name: "Ocean Breeze", icon: "🌊", header_bg: "#0284c7", header_color: "#ffffff", cell_bg: "#0b2545", cell_color: "#ffffff" },
  { id: "emerald_dark", name: "Emerald Forest", icon: "🌲", header_bg: "#059669", header_color: "#ffffff", cell_bg: "#064e3b", cell_color: "#ffffff" },
  { id: "cyberpunk_neon", name: "Cyberpunk Neon", icon: "⚡", header_bg: "#e11d48", header_color: "#ffffff", cell_bg: "#2e1065", cell_color: "#ffffff" },
  { id: "wall_street", name: "Wall Street Finance", icon: "💵", header_bg: "#10b981", header_color: "#ffffff", cell_bg: "#064e3b", cell_color: "#ffffff" },
  { id: "executive_gold", name: "Executive Gold", icon: "🏆", header_bg: "#d97706", header_color: "#ffffff", cell_bg: "#451a03", cell_color: "#ffffff" },
  { id: "velvet_rose", name: "Velvet Rose", icon: "🌹", header_bg: "#e11d48", header_color: "#ffffff", cell_bg: "#4c0519", cell_color: "#ffffff" },
  { id: "royal_violet", name: "Royal Violet", icon: "🍇", header_bg: "#7e22ce", header_color: "#ffffff", cell_bg: "#3b0764", cell_color: "#ffffff" },
  { id: "nordic_frost", name: "Nordic Frost", icon: "🧊", header_bg: "#0284c7", header_color: "#ffffff", cell_bg: "#0c4a6e", cell_color: "#ffffff" },
  { id: "amber_bronze", name: "Amber Bronze", icon: "👑", header_bg: "#b45309", header_color: "#ffffff", cell_bg: "#451a03", cell_color: "#ffffff" },
  { id: "teal_cyan", name: "Teal Cyan", icon: "💎", header_bg: "#0d9488", header_color: "#ffffff", cell_bg: "#134e4a", cell_color: "#ffffff" },
  { id: "slate_dark", name: "Slate Dark", icon: "🛡️", header_bg: "#475569", header_color: "#ffffff", cell_bg: "#1e293b", cell_color: "#ffffff" },
  { id: "monochrome_black", name: "Monochrome Black", icon: "🕶️", header_bg: "#334155", header_color: "#ffffff", cell_bg: "#000000", cell_color: "#ffffff" },
  { id: "executive_slate", name: "Executive Slate", icon: "🪨", header_bg: "#6366f1", header_color: "#ffffff", cell_bg: "#1e293b", cell_color: "#ffffff" },
  { id: "clean_light", name: "Minimal Light", icon: "☀️", header_bg: "#2563eb", header_color: "#ffffff", cell_bg: "#f1f5f9", cell_color: "#0f172a" },
  { id: "sunset_glow", name: "Sunset Glow", header_bg: "#ea580c", header_color: "#ffffff", cell_bg: "#431407", cell_color: "#ffffff" },
  { id: "custom", name: "Custom Palette", icon: "🎨", header_bg: "#8b5cf6", header_color: "#ffffff", cell_bg: "#1e293b", cell_color: "#ffffff" },
];

export const OFFICE_LAYOUT_PRESETS = [
  { id: "title_subtitle", label: "Title Slide", desc: "Main title & subtitle" },
  { id: "title_content", label: "Title and Content", desc: "Header with content list" },
  { id: "section_header", label: "Section Header", desc: "Chapter / section divider" },
  { id: "two_content", label: "Two Content", desc: "Side-by-side dual content" },
  { id: "comparison", label: "Comparison", desc: "Side-by-side with headers" },
  { id: "title_only", label: "Title Only", desc: "Top header with blank body" },
  { id: "blank", label: "Blank", desc: "Empty custom slide canvas" },
  { id: "content_caption", label: "Content with Caption", desc: "Text sidebar & content box" },
  { id: "picture_caption", label: "Picture with Caption", desc: "Text sidebar & image box" },
];

export function renderShapeSvgPath(shapeType, fill = "#38bdf8", stroke = "#ffffff", strokeWidth = 2, strokeStyle = "solid", opacity = 1) {
  const dashArray = strokeStyle === "dashed" ? "6,4" : strokeStyle === "dotted" ? "2,3" : "none";
  const stProps = {
    fill,
    stroke,
    strokeWidth,
    strokeDasharray: dashArray,
    opacity,
    vectorEffect: "non-scaling-stroke",
  };

  switch (shapeType) {
    case "rectangle":
    case "flow_process":
    case "flow_predefined":
      return <rect x="2" y="2" width="96%" height="96%" rx="2" ry="2" {...stProps} />;
    case "rounded_rectangle":
    case "callout_rounded":
      return <rect x="2" y="2" width="96%" height="96%" rx="16" ry="16" {...stProps} />;
    case "circle":
    case "oval":
      return <ellipse cx="50%" cy="50%" rx="48%" ry="48%" {...stProps} />;
    case "triangle":
      return <polygon points="50,4 96,96 4,96" {...stProps} />;
    case "diamond":
    case "flow_decision":
      return <polygon points="50,4 96,50 50,96 4,50" {...stProps} />;
    case "pentagon":
      return <polygon points="50,4 96,38 78,96 22,96 4,38" {...stProps} />;
    case "hexagon":
      return <polygon points="25,4 75,4 96,50 75,96 25,96 4,50" {...stProps} />;
    case "octagon":
      return <polygon points="30,4 70,4 96,30 96,70 70,96 30,96 4,70 4,30" {...stProps} />;
    case "parallelogram":
    case "flow_data":
      return <polygon points="20,4 96,4 80,96 4,96" {...stProps} />;
    case "trapezoid":
      return <polygon points="20,4 80,4 96,96 4,96" {...stProps} />;
    case "star":
      return <polygon points="50,4 63,35 96,35 70,57 82,96 50,72 18,96 30,57 4,35 37,35" {...stProps} />;
    case "heart":
      return <path d="M50 88 C20 60 4 45 4 28 A22 22 0 0 1 48 20 A22 22 0 0 1 96 28 C96 45 80 60 50 88 Z" {...stProps} />;
    case "cross":
    case "eq_plus":
      return <polygon points="35,4 65,4 65,35 96,35 96,65 65,65 65,96 35,96 35,65 4,65 4,35 35,35" {...stProps} />;
    case "arrow":
      return <polygon points="4,35 55,35 55,15 96,50 55,85 55,65 4,65" {...stProps} />;
    case "double_arrow":
      return <polygon points="4,50 25,20 25,38 75,38 75,20 96,50 75,80 75,62 25,62 25,80" {...stProps} />;
    case "line":
      return <line x1="4" y1="50" x2="96" y2="50" {...stProps} />;
    case "elbow_connector":
      return <polyline points="4,20 50,20 50,80 96,80" fill="none" {...stProps} />;
    case "curved_connector":
      return <path d="M4 20 C 50 20, 50 80, 96 80" fill="none" {...stProps} />;
    case "flow_document":
      return <path d="M4 4 L96 4 L96 80 Q75 65 50 80 Q25 95 4 80 Z" {...stProps} />;
    case "flow_database":
      return (
        <g>
          <path d="M4 20 C4 10 96 10 96 20 L96 80 C96 90 4 90 4 80 Z" {...stProps} />
          <ellipse cx="50" cy="20" rx="46" ry="10" fill="none" stroke={stroke} strokeWidth={strokeWidth} />
        </g>
      );
    case "flow_terminator":
      return <rect x="2" y="10" width="96%" height="80%" rx="40" ry="40" {...stProps} />;
    case "callout_speech":
    case "callout_rect":
      return <path d="M4 4 L96 4 L96 70 L40 70 L20 96 L25 70 L4 70 Z" {...stProps} />;
    case "callout_cloud":
      return <path d="M20 70 A25 25 0 0 1 30 30 A30 30 0 0 1 70 30 A25 25 0 0 1 85 65 A20 20 0 0 1 70 85 L25 85 A15 15 0 0 1 20 70 Z" {...stProps} />;
    case "eq_minus":
      return <rect x="4" y="40" width="92%" height="20%" rx="4" ry="4" {...stProps} />;
    case "eq_multiply":
      return <polygon points="20,4 50,34 80,4 96,20 66,50 96,80 80,96 50,66 20,96 4,80 34,50 4,20" {...stProps} />;
    case "eq_divide":
      return (
        <g>
          <circle cx="50" cy="20" r="8" fill={fill} stroke={stroke} strokeWidth={strokeWidth} />
          <rect x="10" y="45" width="80%" height="10%" rx="2" ry="2" {...stProps} />
          <circle cx="50" cy="80" r="8" fill={fill} stroke={stroke} strokeWidth={strokeWidth} />
        </g>
      );
    case "eq_equals":
      return (
        <g>
          <rect x="6" y="30" width="88%" height="16%" rx="3" ry="3" {...stProps} />
          <rect x="6" y="58" width="88%" height="16%" rx="3" ry="3" {...stProps} />
        </g>
      );
    case "eq_not_equal":
      return (
        <g>
          <rect x="6" y="30" width="88%" height="16%" rx="3" ry="3" {...stProps} />
          <rect x="6" y="58" width="88%" height="16%" rx="3" ry="3" {...stProps} />
          <line x1="75" y1="10" x2="25" y2="90" stroke={stroke} strokeWidth={strokeWidth + 2} />
        </g>
      );
    default:
      return <rect x="2" y="2" width="96%" height="96%" rx="6" ry="6" {...stProps} />;
  }
}

export function InteractiveShapeItem({
  plugin,
  pIdx,
  isSelected,
  onSelect,
  onUpdateData,
}) {
  const data = plugin?.data || {};
  const shapeType = data.shape_type || "rounded_rectangle";
  const x = data.x ?? 80;
  const y = data.y ?? 80;
  const width = data.width ?? 180;
  const height = data.height ?? 120;
  const rotation = data.rotation ?? 0;
  const fill = data.fill || "#38bdf8";
  const borderColor = data.border_color || "#ffffff";
  const borderWidth = data.border_width ?? 2;
  const borderStyle = data.border_style || "solid";
  const opacity = data.opacity ?? 1;
  const text = data.text ?? "Double-click to edit text";
  const fontSize = data.font_size ?? 14;
  const fontFamily = data.font_family || "Inter";
  const textColor = data.text_color || "#ffffff";
  const isBold = data.bold ?? false;
  const isItalic = data.italic ?? false;
  const zIndex = data.z_index ?? (pIdx + 1) * 5;

  const [isEditingText, setIsEditingText] = useState(false);

  const handleMouseDown = (e) => {
    e.stopPropagation();
    onSelect(pIdx);

    const startX = e.clientX;
    const startY = e.clientY;
    const initialX = x;
    const initialY = y;

    const handleMouseMove = (moveEvent) => {
      const dx = moveEvent.clientX - startX;
      const dy = moveEvent.clientY - startY;
      onUpdateData(pIdx, { x: Math.max(0, initialX + dx), y: Math.max(0, initialY + dy) });
    };

    const handleMouseUp = () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
    };

    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseup", handleMouseUp);
  };

  const handleResizeStart = (handle, e) => {
    e.stopPropagation();
    const startX = e.clientX;
    const startY = e.clientY;
    const initialW = width;
    const initialH = height;
    const initialX = x;
    const initialY = y;

    const handleMouseMove = (moveEvent) => {
      const dx = moveEvent.clientX - startX;
      const dy = moveEvent.clientY - startY;

      let newW = initialW;
      let newH = initialH;
      let newX = initialX;
      let newY = initialY;

      if (handle.includes("e")) newW = Math.max(30, initialW + dx);
      if (handle.includes("s")) newH = Math.max(30, initialH + dy);
      if (handle.includes("w")) {
        const potentialW = initialW - dx;
        if (potentialW > 30) {
          newW = potentialW;
          newX = initialX + dx;
        }
      }
      if (handle.includes("n")) {
        const potentialH = initialH - dy;
        if (potentialH > 30) {
          newH = potentialH;
          newY = initialY + dy;
        }
      }

      if (moveEvent.shiftKey) {
        const aspect = initialW / initialH;
        newH = newW / aspect;
      }

      onUpdateData(pIdx, { x: newX, y: newY, width: Math.round(newW), height: Math.round(newH) });
    };

    const handleMouseUp = () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
    };

    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseup", handleMouseUp);
  };

  const handleRotateStart = (e) => {
    e.stopPropagation();
    const rect = e.currentTarget.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;

    const handleMouseMove = (moveEvent) => {
      const radians = Math.atan2(moveEvent.clientY - centerY, moveEvent.clientX - centerX);
      let deg = Math.round(radians * (180 / Math.PI)) + 90;
      if (deg < 0) deg += 360;
      onUpdateData(pIdx, { rotation: deg });
    };

    const handleMouseUp = () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
    };

    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseup", handleMouseUp);
  };

  return (
    <div
      onClick={(e) => {
        e.stopPropagation();
        onSelect(pIdx);
      }}
      onDoubleClick={(e) => {
        e.stopPropagation();
        setIsEditingText(true);
      }}
      onMouseDown={handleMouseDown}
      style={{
        position: "absolute",
        left: `${x}px`,
        top: `${y}px`,
        width: `${width}px`,
        height: `${height}px`,
        transform: `rotate(${rotation}deg)`,
        transformOrigin: "center center",
        zIndex,
        cursor: "move",
        userSelect: "none",
        boxSizing: "border-box",
      }}
    >
      <svg
        width="100%"
        height="100%"
        viewBox="0 0 100 100"
        preserveAspectRatio="none"
        style={{ overflow: "visible", display: "block" }}
      >
        {renderShapeSvgPath(shapeType, fill, borderColor, borderWidth, borderStyle, opacity)}
      </svg>

      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: "8px",
          color: textColor,
          fontFamily,
          fontSize: `${fontSize}px`,
          fontWeight: isBold ? 800 : 500,
          fontStyle: isItalic ? "italic" : "normal",
          textAlign: "center",
          pointerEvents: isEditingText ? "auto" : "none",
          wordBreak: "break-word",
          zIndex: 2,
        }}
      >
        {isEditingText ? (
          <textarea
            autoFocus
            value={text}
            onChange={(e) => onUpdateData(pIdx, { text: e.target.value })}
            onBlur={() => setIsEditingText(false)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                setIsEditingText(false);
              }
            }}
            style={{
              width: "100%",
              height: "100%",
              background: "transparent",
              border: "none",
              color: textColor,
              fontFamily,
              fontSize: `${fontSize}px`,
              fontWeight: isBold ? 800 : 500,
              textAlign: "center",
              resize: "none",
              outline: "none",
            }}
          />
        ) : (
          text
        )}
      </div>

      {isSelected && (
        <>
          <div
            style={{
              position: "absolute",
              inset: -3,
              border: "2px dashed #38bdf8",
              borderRadius: 4,
              boxShadow: "0 0 10px rgba(56, 189, 248, 0.6)",
              pointerEvents: "none",
            }}
          />

          <div
            style={{
              position: "absolute",
              top: -24,
              left: "50%",
              transform: "translateX(-50%)",
              width: 1,
              height: 20,
              background: "#38bdf8",
              zIndex: 10,
            }}
          />
          <div
            onMouseDown={handleRotateStart}
            title="Rotate Shape"
            style={{
              position: "absolute",
              top: -30,
              left: "50%",
              transform: "translateX(-50%)",
              width: 12,
              height: 12,
              borderRadius: "50%",
              background: "#38bdf8",
              border: "2px solid #fff",
              cursor: "grab",
              zIndex: 11,
              boxShadow: "0 0 6px rgba(0,0,0,0.5)",
            }}
          />

          {[
            { id: "nw", top: -5, left: -5, cursor: "nwse-resize" },
            { id: "n", top: -5, left: "50%", cursor: "ns-resize", transform: "translateX(-50%)" },
            { id: "ne", top: -5, right: -5, cursor: "nesw-resize" },
            { id: "w", top: "50%", left: -5, cursor: "ew-resize", transform: "translateY(-50%)" },
            { id: "e", top: "50%", right: -5, cursor: "ew-resize", transform: "translateY(-50%)" },
            { id: "sw", bottom: -5, left: -5, cursor: "nesw-resize" },
            { id: "s", bottom: -5, left: "50%", cursor: "ns-resize", transform: "translateX(-50%)" },
            { id: "se", bottom: -5, right: -5, cursor: "nwse-resize" },
          ].map((h) => (
            <div
              key={h.id}
              onMouseDown={(e) => handleResizeStart(h.id, e)}
              style={{
                position: "absolute",
                top: h.top,
                bottom: h.bottom,
                left: h.left,
                right: h.right,
                transform: h.transform,
                width: 10,
                height: 10,
                background: "#ffffff",
                border: "2px solid #38bdf8",
                borderRadius: 2,
                cursor: h.cursor,
                zIndex: 12,
                boxShadow: "0 0 4px rgba(0,0,0,0.4)",
              }}
            />
          ))}
        </>
      )}
    </div>
  );
}

function safeArray(value) {
  return Array.isArray(value) ? value : [];
}

export function detectBulletStyle(points = [], selectedStyle = "auto") {
  const st = String(selectedStyle || "auto").toLowerCase().trim();
  if (st !== "auto" && st !== "none" && st !== "") {
    return st;
  }
  const joinedText = safeArray(points).join(" ").toLowerCase();
  if (/(step|phase|stage|rank|order|first|second|third|1\.|2\.|3\.)/i.test(joinedText)) {
    return "number";
  }
  if (/(task|todo|check|verify|complete|done|feature|status)/i.test(joinedText)) {
    return "check";
  }
  if (/(key|important|highlight|top|benefit|advantage|star)/i.test(joinedText)) {
    return "star";
  }
  if (/(process|flow|next|then|direction|target|goal)/i.test(joinedText)) {
    return "arrow";
  }
  if (/(option|category|tier|type)/i.test(joinedText)) {
    return "alpha";
  }
  return "bullet";
}

export function formatBulletPrefix(style = "auto", index = 0, points = []) {
  const resolvedStyle = detectBulletStyle(points, style);
  const st = String(resolvedStyle || "bullet").toLowerCase().trim();
  if (st === "number" || st === "numbered" || st === "123") {
    return `${index + 1}. `;
  }
  if (st === "alpha" || st === "abc") {
    return `${String.fromCharCode(65 + (index % 26))}. `;
  }
  if (st === "roman") {
    const romans = ["I", "II", "III", "IV", "V", "VI", "VII", "VIII", "IX", "X"];
    return `${romans[index % 10]}. `;
  }
  if (st === "check" || st === "checklist") {
    return "✔ ";
  }
  if (st === "star") {
    return " ✦";
  }
  if (st === "arrow") {
    return "➜ ";
  }
  if (st === "diamond") {
    return "🔹 ";
  }
  return "• ";
}

export function detectDiagramType(text = "", selectedType = "auto") {
  const type = String(selectedType || "auto").toLowerCase();
  if (type !== "auto" && type !== "none" && type !== "") {
    return type;
  }
  const raw = String(text || "").toLowerCase();
  if (/(tree|hierarchy|decision|branch|node)/i.test(raw)) return "tree";
  if (/(cycle|loop|repeat|iterat|pdca|agile|sprint)/i.test(raw)) return "cycle";
  if (/(funnel|conversion|lead|pipeline|sales)/i.test(raw)) return "funnel";
  if (/(pyramid|hierarchy|maslow|foundation|level)/i.test(raw)) return "pyramid";
  if (/(swot|matrix|quadrant|2x2|grid)/i.test(raw)) return "quadrant";
  if (/(vs|versus|compare|comparison|feature\s*matrix)/i.test(raw)) return "comparison";
  if (/(timeline|roadmap|milestone|phase|quarter|q1|q2|q3|q4|202\d)/i.test(raw)) return "timeline";
  if (/(stack|architecture|layer|tier|database|backend|frontend|api)/i.test(raw)) return "architecture";
  if (/(input|output|processing|io\b)/i.test(raw)) return "io_cards";
  if (/(mindmap|brainstorm|category|concept|topic)/i.test(raw)) return "mindmap";
  return "flowchart";
}

export function parseDiagramSteps(textRaw) {
  if (!textRaw) return [];
  const rawParts = String(textRaw).split(/\s*(?:➔|➜|->|-->|→|⇒|\||\n|;)\s*/);
  const steps = [];
  for (let part of rawParts) {
    let cleaned = part.replace(/^[\s[(\u2022\-*]+|[\s\])]+$/g, "").trim();
    if (cleaned.includes("] [")) {
      const nested = cleaned.split(/\]\s*\[/);
      for (let n of nested) {
        let nc = n.replace(/^[\s[(]+|[\s\])]+$/g, "").trim();
        if (nc) steps.push(nc);
      }
    } else if (cleaned) {
      steps.push(cleaned);
    }
  }
  return steps;
}

export const getChartTypeDefaults = (chartType = "column", topic = "") => {
  const cType = String(chartType || "column").toLowerCase();
  const cleanTitle = topic ? topic.replace(/^(Chart|Metrics|Data):\s*/i, "").trim() : "";

  if (cType === "radar") {
    return {
      categories: ["Security & Trust", "Scalability", "Speed & Latency", "Usability", "Cost Efficiency"],
      values: [88, 94, 76, 90, 82],
      series_name: cleanTitle ? `${cleanTitle.slice(0, 20)} Capability Score` : "Capability Score (0-100)",
      title: cleanTitle || "Multi-Vector Radar Assessment",
    };
  }
  if (cType === "gauge") {
    return {
      categories: ["System SLA Uptime Target"],
      values: [99.8],
      series_name: cleanTitle ? `${cleanTitle.slice(0, 20)} Target Attainment` : "Target Attainment (%)",
      title: cleanTitle || "Key Performance Metric Gauge",
    };
  }
  if (cType === "waterfall") {
    return {
      categories: ["Q1 Baseline", "New Revenue", "OpEx Costs", "Tax & Subtraction", "Net Q2 Total"],
      values: [120, 45, -22, -14, 129],
      series_name: cleanTitle ? `${cleanTitle.slice(0, 20)} Financial Delta` : "Net Financial Change ($M)",
      title: cleanTitle || "Waterfall Financial Breakdown",
    };
  }
  if (cType === "pie" || cType === "donut") {
    return {
      categories: ["Enterprise Tier", "Mid-Market", "SMB & Startup", "Individual"],
      values: [42, 28, 18, 12],
      series_name: cleanTitle ? `${cleanTitle.slice(0, 20)} Share (%)` : "Share Percentage (%)",
      title: cleanTitle || "Market Share Distribution",
    };
  }
  if (cType === "bar" || cType === "bar_horizontal") {
    return {
      categories: ["Primary Vector", "Secondary Factor", "Operational Impact", "Policy Gap"],
      values: [68.4, 48.2, 32.8, 19.5],
      series_name: cleanTitle ? `${cleanTitle.slice(0, 20)} Impact Index` : "Severity & Impact Score",
      title: cleanTitle || "Category Impact Comparison",
    };
  }
  if (cType === "line" || cType === "area" || cType === "trend") {
    return {
      categories: ["2021", "2022", "2023", "2024", "2025"],
      values: [18.5, 34.2, 58.7, 82.4, 94.0],
      series_name: cleanTitle ? `${cleanTitle.slice(0, 20)} Adoption (%)` : "Adoption Rate (%)",
      title: cleanTitle || "Growth & Trend Trajectory",
    };
  }
  return {
    categories: ["Phase 1 (Baseline)", "Phase 2 (Adoption)", "Phase 3 (Scaling)", "Phase 4 (Maturity)"],
    values: [28.5, 54.0, 82.5, 120.0],
    series_name: cleanTitle ? `${cleanTitle.slice(0, 20)} Index` : "Performance Metric Index",
    title: cleanTitle || "Performance Benchmark",
  };
};

export function VisualChartPreview({ data, onTitleChange, onLabelChange, onValueChange }) {
  const chartType = (data?.chart_type || "column").toLowerCase();
  const title = data?.title || "Data Metrics Overview";
  const defaults = getChartTypeDefaults(chartType, title);

  const rawLabels = safeArray(data?.labels).length ? data.labels : (safeArray(data?.categories).length ? data.categories : defaults.categories);

  let rawValues = safeArray(data?.values).map(Number).filter((v) => !isNaN(v));
  if (data?.series_map && typeof data.series_map === "object") {
    const firstSeries = Object.values(data.series_map)[0];
    if (Array.isArray(firstSeries)) {
      rawValues = firstSeries.map(Number).filter((v) => !isNaN(v));
    } else if (firstSeries && typeof firstSeries === "object") {
      rawValues = Object.values(firstSeries).map(Number).filter((v) => !isNaN(v));
    }
  }

  if (!rawValues.length || rawValues.every((v) => v === 0)) {
    rawValues = defaults.values;
  }

  const maxVal = Math.max(...rawValues, 10);

  const colors = ["#8b5cf6", "#06b6d4", "#ec4899", "#10b981", "#f59e0b", "#3b82f6"];

  return (
    <div style={{ background: "rgba(0,0,0,0.35)", padding: "14px", borderRadius: "12px", border: "1px solid rgba(255,255,255,0.15)", margin: "10px 0" }}>
      <div style={{ fontSize: "13px", fontWeight: "700", marginBottom: "10px", color: "#c084fc", display: "flex", alignItems: "center", gap: 6 }}>
        <span>📊</span>
        <span
          contentEditable={!!onTitleChange}
          suppressContentEditableWarning={true}
          onBlur={(e) => onTitleChange && onTitleChange(e.target.innerText)}
          title="Click to edit chart title"
          style={{ outline: "none", cursor: onTitleChange ? "text" : "default", borderBottom: onTitleChange ? "1px dashed rgba(192, 132, 252, 0.4)" : "none" }}
        >
          {title}
        </span>
        <span style={{ fontSize: "11px", opacity: 0.7 }}>({chartType.toUpperCase()} CHART)</span>
      </div>

      {(chartType === "column" || chartType === "bar") && (
        <div style={{ display: "flex", alignItems: "flex-end", gap: "12px", height: "120px", padding: "10px 0 0" }}>
          {rawLabels.map((lbl, idx) => {
            const val = rawValues[idx] || 0;
            const heightPct = Math.min(100, Math.max(15, (val / maxVal) * 100));
            return (
              <div key={idx} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", height: "100%", justifyContent: "flex-end" }}>
                <div
                  contentEditable={!!onValueChange}
                  suppressContentEditableWarning={true}
                  onBlur={(e) => onValueChange && onValueChange(idx, e.target.innerText)}
                  title="Click to edit value"
                  style={{ fontSize: "10px", fontWeight: "bold", marginBottom: "4px", outline: "none", cursor: onValueChange ? "text" : "default" }}
                >
                  {val}
                </div>
                <div
                  style={{
                    width: "100%",
                    height: `${heightPct}%`,
                    background: colors[idx % colors.length],
                    borderRadius: "6px 6px 0 0",
                    transition: "height 0.3s ease",
                  }}
                />
                <div
                  contentEditable={!!onLabelChange}
                  suppressContentEditableWarning={true}
                  onBlur={(e) => onLabelChange && onLabelChange(idx, e.target.innerText)}
                  title="Click to edit label"
                  style={{ fontSize: "10px", opacity: 0.8, marginTop: "4px", outline: "none", cursor: onLabelChange ? "text" : "default", textAlign: "center" }}
                >
                  {lbl}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {chartType === "bar_horizontal" && (
        <div style={{ display: "flex", flexDirection: "column", gap: "8px", padding: "6px 0" }}>
          {rawLabels.map((lbl, idx) => {
            const val = rawValues[idx] || 0;
            const widthPct = Math.min(100, Math.max(10, (val / maxVal) * 100));
            return (
              <div key={idx} style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                <div
                  contentEditable={!!onLabelChange}
                  suppressContentEditableWarning={true}
                  onBlur={(e) => onLabelChange && onLabelChange(idx, e.target.innerText)}
                  title="Click to edit label"
                  style={{ fontSize: "10px", width: "75px", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis", opacity: 0.9, outline: "none", cursor: onLabelChange ? "text" : "default" }}
                >
                  {lbl}
                </div>
                <div style={{ flex: 1, background: "rgba(255,255,255,0.06)", borderRadius: "4px", height: "16px", overflow: "hidden" }}>
                  <div style={{ width: `${widthPct}%`, height: "100%", background: colors[idx % colors.length], borderRadius: "4px" }} />
                </div>
                <div
                  contentEditable={!!onValueChange}
                  suppressContentEditableWarning={true}
                  onBlur={(e) => onValueChange && onValueChange(idx, e.target.innerText)}
                  title="Click to edit value"
                  style={{ fontSize: "10px", fontWeight: "bold", width: "35px", outline: "none", cursor: onValueChange ? "text" : "default", textAlign: "right" }}
                >
                  {val}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {(chartType === "line" || chartType === "area" || chartType === "trend") && (
        <div style={{ display: "flex", flexDirection: "column", gap: "6px", padding: "6px 0" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", height: "80px", position: "relative" }}>
            {rawLabels.map((lbl, idx) => {
              const val = rawValues[idx] || 0;
              const heightPct = Math.min(100, Math.max(15, (val / maxVal) * 100));
              return (
                <div key={idx} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", height: "100%", justifyContent: "flex-end" }}>
                  <span
                    contentEditable={!!onValueChange}
                    suppressContentEditableWarning={true}
                    onBlur={(e) => onValueChange && onValueChange(idx, e.target.innerText)}
                    title="Click to edit value"
                    style={{ fontSize: "9px", fontWeight: "bold", color: "#c084fc", marginBottom: "4px", outline: "none", cursor: onValueChange ? "text" : "default" }}
                  >
                    {val}
                  </span>
                  <div style={{ width: "8px", height: "8px", borderRadius: "50%", background: "#c084fc", marginBottom: `${heightPct * 0.6}%` }} />
                </div>
              );
            })}
          </div>
          <div style={{ display: "flex", justifyContent: "space-between", borderTop: "1px solid rgba(255,255,255,0.15)", paddingTop: "4px" }}>
            {rawLabels.map((lbl, idx) => (
              <span
                key={idx}
                contentEditable={!!onLabelChange}
                suppressContentEditableWarning={true}
                onBlur={(e) => onLabelChange && onLabelChange(idx, e.target.innerText)}
                title="Click to edit label"
                style={{ fontSize: "10px", opacity: 0.8, outline: "none", cursor: onLabelChange ? "text" : "default" }}
              >
                {lbl}
              </span>
            ))}
          </div>
        </div>
      )}

      {chartType === "pie" && (
        <div style={{ display: "flex", alignItems: "center", gap: "16px", padding: "10px 0" }}>
          <div
            style={{
              width: "90px",
              height: "90px",
              borderRadius: "50%",
              background: `conic-gradient(#8b5cf6 0% 35%, #06b6d4 35% 65%, #ec4899 65% 100%)`,
              boxShadow: "0 4px 10px rgba(0,0,0,0.4)",
            }}
          />
          <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
            {rawLabels.map((lbl, idx) => (
              <div key={idx} style={{ display: "flex", alignItems: "center", gap: "6px", fontSize: "11px" }}>
                <span style={{ width: "10px", height: "10px", borderRadius: "50%", background: colors[idx % colors.length] }} />
                <span
                  contentEditable={!!onLabelChange}
                  suppressContentEditableWarning={true}
                  onBlur={(e) => onLabelChange && onLabelChange(idx, e.target.innerText)}
                  title="Click to edit label"
                  style={{ outline: "none", cursor: onLabelChange ? "text" : "default" }}
                >
                  {lbl}
                </span>:{" "}
                <strong
                  contentEditable={!!onValueChange}
                  suppressContentEditableWarning={true}
                  onBlur={(e) => onValueChange && onValueChange(idx, e.target.innerText)}
                  title="Click to edit value"
                  style={{ outline: "none", cursor: onValueChange ? "text" : "default" }}
                >
                  {rawValues[idx] || 0}
                </strong>
              </div>
            ))}
          </div>
        </div>
      )}

      {(chartType === "donut" || chartType === "doughnut") && (
        <div style={{ display: "flex", alignItems: "center", gap: "16px", padding: "10px 0" }}>
          <div
            style={{
              width: "90px",
              height: "90px",
              borderRadius: "50%",
              background: `radial-gradient(circle, rgba(15,23,42,1) 40%, transparent 41%), conic-gradient(#8b5cf6 0% 35%, #06b6d4 35% 65%, #ec4899 65% 100%)`,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "10px",
              fontWeight: "bold",
              color: "#c084fc",
              boxShadow: "0 4px 10px rgba(0,0,0,0.4)",
            }}
          >
            🍩 {rawValues.reduce((a, b) => a + b, 0)}
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
            {rawLabels.map((lbl, idx) => (
              <div key={idx} style={{ display: "flex", alignItems: "center", gap: "6px", fontSize: "11px" }}>
                <span style={{ width: "10px", height: "10px", borderRadius: "50%", background: colors[idx % colors.length] }} />
                <span
                  contentEditable={!!onLabelChange}
                  suppressContentEditableWarning={true}
                  onBlur={(e) => onLabelChange && onLabelChange(idx, e.target.innerText)}
                  title="Click to edit label"
                  style={{ outline: "none", cursor: onLabelChange ? "text" : "default" }}
                >
                  {lbl}
                </span>:{" "}
                <strong
                  contentEditable={!!onValueChange}
                  suppressContentEditableWarning={true}
                  onBlur={(e) => onValueChange && onValueChange(idx, e.target.innerText)}
                  title="Click to edit value"
                  style={{ outline: "none", cursor: onValueChange ? "text" : "default" }}
                >
                  {rawValues[idx] || 0}
                </strong>
              </div>
            ))}
          </div>
        </div>
      )}

      {chartType === "radar" && (
        <div style={{ display: "flex", flexWrap: "wrap", gap: "10px", padding: "10px 0", justifyContent: "center" }}>
          {rawLabels.map((lbl, idx) => {
            const val = rawValues[idx] || 0;
            const pct = Math.min(100, Math.max(10, (val / maxVal) * 100));
            return (
              <div key={idx} style={{ background: "rgba(192, 132, 252, 0.12)", border: "1px solid rgba(192, 132, 252, 0.4)", borderRadius: 10, padding: "8px 12px", textAlign: "center", minWidth: 100 }}>
                <div
                  contentEditable={!!onLabelChange}
                  suppressContentEditableWarning={true}
                  onBlur={(e) => onLabelChange && onLabelChange(idx, e.target.innerText)}
                  title="Click to edit label"
                  style={{ fontSize: "10px", color: "#c084fc", fontWeight: 700, outline: "none", cursor: onLabelChange ? "text" : "default" }}
                >
                  🕸️ {lbl}
                </div>
                <div
                  contentEditable={!!onValueChange}
                  suppressContentEditableWarning={true}
                  onBlur={(e) => onValueChange && onValueChange(idx, e.target.innerText)}
                  title="Click to edit value"
                  style={{ fontSize: "14px", fontWeight: 900, color: "#fff", margin: "4px 0", outline: "none", cursor: onValueChange ? "text" : "default" }}
                >
                  {val}
                </div>
                <div style={{ background: "rgba(255,255,255,0.1)", height: 4, borderRadius: 2, overflow: "hidden" }}>
                  <div style={{ width: `${pct}%`, height: "100%", background: colors[idx % colors.length] }} />
                </div>
              </div>
            );
          })}
        </div>
      )}

      {chartType === "gauge" && (
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", padding: "10px 0" }}>
          <div style={{ position: "relative", width: 120, height: 60, overflow: "hidden" }}>
            <div style={{ width: 120, height: 120, borderRadius: "50%", background: `conic-gradient(#10b981 0% 120deg, #f59e0b 120deg 240deg, #ef4444 240deg 360deg)`, opacity: 0.85 }} />
            <div style={{ position: "absolute", top: 15, left: 15, width: 90, height: 90, borderRadius: "50%", background: "#0f172a", display: "flex", alignItems: "center", justifyContent: "center", flexDirection: "column" }}>
              <span
                contentEditable={!!onValueChange}
                suppressContentEditableWarning={true}
                onBlur={(e) => onValueChange && onValueChange(0, e.target.innerText.replace("%", ""))}
                title="Click to edit gauge percentage"
                style={{ fontSize: 16, fontWeight: 900, color: "#38bdf8", outline: "none", cursor: onValueChange ? "text" : "default" }}
              >
                {rawValues[0] || 0}%
              </span>
            </div>
          </div>
          <div
            contentEditable={!!onLabelChange}
            suppressContentEditableWarning={true}
            onBlur={(e) => onLabelChange && onLabelChange(0, e.target.innerText)}
            title="Click to edit gauge label"
            style={{ fontSize: 11, fontWeight: 700, opacity: 0.9, marginTop: 6, outline: "none", cursor: onLabelChange ? "text" : "default" }}
          >
            🎯 {rawLabels[0] || "Target Benchmark"}
          </div>
        </div>
      )}

      {chartType === "waterfall" && (
        <div style={{ display: "flex", alignItems: "flex-end", gap: "10px", height: "100px", padding: "10px 0 0" }}>
          {rawLabels.map((lbl, idx) => {
            const val = rawValues[idx] || 0;
            const isPositive = val >= 0;
            const heightPct = Math.min(100, Math.max(15, (Math.abs(val) / maxVal) * 100));
            return (
              <div key={idx} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", height: "100%", justifyContent: "flex-end" }}>
                <div
                  contentEditable={!!onValueChange}
                  suppressContentEditableWarning={true}
                  onBlur={(e) => onValueChange && onValueChange(idx, e.target.innerText)}
                  title="Click to edit value"
                  style={{ fontSize: "10px", fontWeight: "bold", marginBottom: "4px", color: isPositive ? "#34d399" : "#f87171", outline: "none", cursor: onValueChange ? "text" : "default" }}
                >
                  {isPositive ? `+${val}` : val}
                </div>
                <div
                  style={{
                    width: "100%",
                    height: `${heightPct}%`,
                    background: isPositive ? "linear-gradient(180deg, #34d399 0%, #059669 100%)" : "linear-gradient(180deg, #f87171 0%, #dc2626 100%)",
                    borderRadius: "4px",
                  }}
                />
                <div
                  contentEditable={!!onLabelChange}
                  suppressContentEditableWarning={true}
                  onBlur={(e) => onLabelChange && onLabelChange(idx, e.target.innerText)}
                  title="Click to edit label"
                  style={{ fontSize: "9px", opacity: 0.8, marginTop: "4px", whiteSpace: "nowrap", outline: "none", cursor: onLabelChange ? "text" : "default" }}
                >
                  {lbl}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

function FeatureFormattingBar({ pluginData, onChangeField, onRefineText, isRefining = false }) {
  const inputStyle = {
    background: "rgba(0,0,0,0.4)",
    border: "1px solid var(--panel-border)",
    borderRadius: "6px",
    padding: "3px 6px",
    color: "#fff",
    fontSize: "11px",
  };
  const labelStyle = {
    fontSize: "10px",
    color: "var(--text-muted)",
    display: "block",
    marginBottom: "2px",
  };

  return (
    <div
      style={{
        display: "flex",
        gap: 12,
        alignItems: "center",
        justifyContent: "space-between",
        marginTop: 6,
        background: "rgba(0,0,0,0.2)",
        padding: "6px 10px",
        borderRadius: 8,
        border: "1px solid rgba(255,255,255,0.05)",
        flexWrap: "wrap",
      }}
    >
      <div className="feature-formatting-bar" style={{ display: "flex", gap: 12, alignItems: "center", flexWrap: "wrap", width: "100%" }}>
        <div>
          <label style={labelStyle}>Font Size (Pt):</label>
          <input
            type="number"
            min="10"
            max="60"
            value={pluginData?.font_size || 14}
            onChange={(e) => onChangeField("font_size", Number(e.target.value))}
            style={{ ...inputStyle, width: "65px" }}
          />
        </div>
        <div>
          <label style={labelStyle}>Font Color:</label>
          <div style={{ ...inputStyle, padding: "2px", display: "flex", alignItems: "center", justifyContent: "center", width: "32px", height: "28px" }}>
            <input
              type="color"
              value={pluginData?.font_color || pluginData?.color || "#ffffff"}
              onChange={(e) => {
                onChangeField("font_color", e.target.value);
                onChangeField("color", e.target.value);
              }}
              style={{ border: "none", width: "24px", height: "22px", borderRadius: "4px", cursor: "pointer", background: "none" }}
            />
          </div>
        </div>
        <div>
          <label style={labelStyle}>H-Align:</label>
          <select
            value={pluginData?.alignment || pluginData?.align || "left"}
            onChange={(e) => {
              onChangeField("alignment", e.target.value);
              onChangeField("align", e.target.value);
            }}
            style={{ ...inputStyle, width: "85px" }}
          >
            <option value="left">Left</option>
            <option value="center">Center</option>
            <option value="right">Right</option>
            <option value="justify">Justify</option>
          </select>
        </div>
        <div>
          <label style={labelStyle}>V-Align:</label>
          <select
            value={pluginData?.valign || pluginData?.v_align || "top"}
            onChange={(e) => {
              onChangeField("valign", e.target.value);
              onChangeField("v_align", e.target.value);
            }}
            style={{ ...inputStyle, width: "85px" }}
          >
            <option value="top">Top</option>
            <option value="middle">Middle</option>
            <option value="bottom">Bottom</option>
          </select>
        </div>
      </div>

      {onRefineText ? (
        <button
          type="button"
          onClick={onRefineText}
          disabled={isRefining}
          className="btn-ui primary sm"
          style={{ fontSize: 10, padding: "5px 12px", background: "linear-gradient(135deg, #8b5cf6, #ec4899)", border: "none", borderRadius: 6, cursor: isRefining ? "wait" : "pointer", opacity: isRefining ? 0.7 : 1 }}
        >
          {isRefining ? "⏳ Polishing..." : "✨AI.Refine"}
        </button>
      ) : null}
    </div>
  );
}

export default function PresentationEditor({
  plan,
  setPlan,
  activeSlideIndex,
  setActiveSlideIndex,
  selectedBgPreset,
  setSelectedBgPreset,
  templateName,
  setTemplateName,
  customBgColor1,
  setCustomBgColor1,
  customBgColor2,
  setCustomBgColor2,
  customTextColor,
  setCustomTextColor,
  selectedBgConfig,
  downloadUrl,
  exportFormat,
  generatedMeta,
  loadingGenerate,
  generatePpt,
  isSaving,
  isSaved,
  saveError,
  savedMeta,
  savePresentation,
  downloadSavedPresentation,
  setIsSaved,
  setDownloadUrl,
  handleDeckTitleChange,
  handleSlideTitleChange,
  handleSlideSubtitleChange,
  handleSlidePropertyChange,
  handleAddSlide,
  handleDuplicateSlide,
  handleDeleteSlide,
  handleMoveSlide,
  handlePluginTextChange,
  handleChartDataChange,
  handleAddBullet,
  handleDeleteBullet,
  handleAddPlugin,
  handleDeletePlugin,
  onBackToSetup,
}) {
  const activeSlide = plan?.slides?.[activeSlideIndex];
  const [isSlidesTrayCollapsed, setIsSlidesTrayCollapsed] = useState(false);

  const handleMoveSlideToPosition = (fromIdx, toIdx) => {
    if (!setPlan || fromIdx === toIdx) return;
    setIsSaved?.(false);
    setDownloadUrl?.("");
    setPlan((prev) => {
      if (!prev || !Array.isArray(prev.slides)) return prev;
      const slides = [...prev.slides];
      if (fromIdx < 0 || fromIdx >= slides.length || toIdx < 0 || toIdx >= slides.length) return prev;
      const [moved] = slides.splice(fromIdx, 1);
      slides.splice(toIdx, 0, moved);
      return { ...prev, slides };
    });
    setActiveSlideIndex(toIdx);
  };

  const resolveActiveSlideLayout = (slide) => {
    if (!slide) return "title_content";
    if (slide.layout) {
      return slide.layout;
    }
    const plugins = safeArray(slide.plugins);
    if (plugins.some((p) => p.type === "table")) return "table_focus";
    if (plugins.some((p) => p.type === "chart")) return "chart_focus";
    if (plugins.some((p) => p.type === "image")) return "picture_caption";
    if (plugins.some((p) => p.type === "paragraph_2col")) return "two_content";
    if (plugins.some((p) => p.type === "diagram")) return "table_focus";
    if (plugins.some((p) => p.type === "stat" || p.type === "kpi_grid")) return "chart_focus";
    if (plugins.some((p) => p.type === "pros_cons")) return "comparison";
    if (plugins.some((p) => p.type === "callout" || p.type === "roadmap" || p.type === "code_block" || p.type === "speaker_card")) return "content_caption";
    return "title_content";
  };

  const handleApplySlideLayout = (layoutType) => {
    if (!handleSlidePropertyChange) return;
    setIsSaved?.(false);
    setDownloadUrl?.("");
    handleSlidePropertyChange(activeSlideIndex, "layout", layoutType);

    const existingPlugins = safeArray(activeSlide?.plugins);
    if (layoutType === "paragraph_2col" && !existingPlugins.some((p) => p.type === "paragraph_2col")) {
      handleAddPlugin(activeSlideIndex, "paragraph_2col");
    } else if (layoutType === "chart_focus" && !existingPlugins.some((p) => p.type === "chart")) {
      handleAddPlugin(activeSlideIndex, "chart");
    } else if ((layoutType === "image_text" || layoutType === "picture_caption") && !existingPlugins.some((p) => p.type === "image")) {
      handleAddPlugin(activeSlideIndex, "image");
    } else if (layoutType === "table_focus" && !existingPlugins.some((p) => p.type === "table")) {
      handleAddPlugin(activeSlideIndex, "table");
    } else if (layoutType === "two_content" && existingPlugins.length < 2) {
      if (existingPlugins.length === 0) {
        handleAddPlugin(activeSlideIndex, "bullets");
        handleAddPlugin(activeSlideIndex, "paragraph");
      } else {
        handleAddPlugin(activeSlideIndex, existingPlugins[0].type === "bullets" ? "paragraph" : "bullets");
      }
    } else if (layoutType === "comparison" && !existingPlugins.some((p) => p.type === "pros_cons" || p.type === "paragraph_2col")) {
      if (existingPlugins.length < 2) {
        handleAddPlugin(activeSlideIndex, "pros_cons");
      }
    } else if (layoutType === "content_caption" && !existingPlugins.some((p) => p.type === "callout")) {
      if (existingPlugins.length === 0) {
        handleAddPlugin(activeSlideIndex, "callout");
      }
    }
  };

  const handleMoveBulletPoint = (pIdx, fromBIdx, toBIdx) => {
    const plugin = activeSlide?.plugins?.[pIdx];
    if (!plugin || plugin.type !== "bullets" || !Array.isArray(plugin.data?.points)) return;
    setIsSaved?.(false);
    setDownloadUrl?.("");
    const points = [...plugin.data.points];
    if (fromBIdx < 0 || fromBIdx >= points.length || toBIdx < 0 || toBIdx >= points.length) return;
    const [moved] = points.splice(fromBIdx, 1);
    points.splice(toBIdx, 0, moved);
    handlePluginTextChange(activeSlideIndex, pIdx, "points", points);
  };

  const [showDownloadModal, setShowDownloadModal] = useState(false);
  const [showLayoutModal, setShowLayoutModal] = useState(false);
  const [layoutModalMode] = useState("add"); // "add" | "change"
  const [selectedPluginIndex, setSelectedPluginIndex] = useState(null);

  const handleUpdatePluginData = (pIdx, updates) => {
    if (!setPlan || pIdx === undefined || pIdx === null) return;
    setIsSaved?.(false);
    setDownloadUrl?.("");
    setPlan((prev) => {
      if (!prev || !Array.isArray(prev.slides)) return prev;
      const slides = [...prev.slides];
      const slide = { ...slides[activeSlideIndex] };
      const plugins = [...safeArray(slide.plugins)];
      if (!plugins[pIdx]) return prev;
      plugins[pIdx] = {
        ...plugins[pIdx],
        data: { ...plugins[pIdx].data, ...updates },
      };
      slide.plugins = plugins;
      slides[activeSlideIndex] = slide;
      return { ...prev, slides };
    });
  };

  const handleLayerOrder = (pIdx, direction) => {
    if (!setPlan || pIdx === undefined || pIdx === null) return;
    setIsSaved?.(false);
    setDownloadUrl?.("");
    setPlan((prev) => {
      if (!prev || !Array.isArray(prev.slides)) return prev;
      const slides = [...prev.slides];
      const slide = { ...slides[activeSlideIndex] };
      const plugins = [...safeArray(slide.plugins)];
      if (pIdx < 0 || pIdx >= plugins.length) return prev;

      const [target] = plugins.splice(pIdx, 1);
      if (direction === "front") {
        plugins.push(target);
        setSelectedPluginIndex(plugins.length - 1);
      } else if (direction === "back") {
        plugins.unshift(target);
        setSelectedPluginIndex(0);
      } else if (direction === "forward" && pIdx < plugins.length) {
        plugins.splice(pIdx + 1, 0, target);
        setSelectedPluginIndex(pIdx + 1);
      } else if (direction === "backward" && pIdx > 0) {
        plugins.splice(pIdx - 1, 0, target);
        setSelectedPluginIndex(pIdx - 1);
      } else {
        plugins.splice(pIdx, 0, target);
      }

      slide.plugins = plugins;
      slides[activeSlideIndex] = slide;
      return { ...prev, slides };
    });
  };

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (selectedPluginIndex === null || selectedPluginIndex === undefined) return;
      if (e.target.tagName === "INPUT" || e.target.tagName === "TEXTAREA" || e.target.isContentEditable) return;

      if (e.key === "Delete" || e.key === "Backspace") {
        e.preventDefault();
        handleDeletePlugin?.(activeSlideIndex, selectedPluginIndex);
        setSelectedPluginIndex(null);
      } else if (e.key === "d" && (e.ctrlKey || e.metaKey)) {
        e.preventDefault();
        const currentPlugin = activeSlide?.plugins?.[selectedPluginIndex];
        if (currentPlugin) {
          const dupData = { ...currentPlugin.data, x: (currentPlugin.data?.x || 80) + 20, y: (currentPlugin.data?.y || 80) + 20 };
          handleAddPlugin?.(activeSlideIndex, currentPlugin.type, dupData);
        }
      } else if (["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight"].includes(e.key)) {
        const currentPlugin = activeSlide?.plugins?.[selectedPluginIndex];
        if (currentPlugin && currentPlugin.type === "shape") {
          e.preventDefault();
          const step = e.shiftKey ? 10 : 1;
          let dx = 0, dy = 0;
          if (e.key === "ArrowLeft") dx = -step;
          if (e.key === "ArrowRight") dx = step;
          if (e.key === "ArrowUp") dy = -step;
          if (e.key === "ArrowDown") dy = step;

          handleUpdatePluginData(selectedPluginIndex, {
            x: Math.max(0, (currentPlugin.data?.x || 0) + dx),
            y: Math.max(0, (currentPlugin.data?.y || 0) + dy),
          });
        }
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedPluginIndex, activeSlideIndex, activeSlide]);

  const handleAddSlideWithLayout = (layoutType = "title_content") => {
    if (!setPlan) return;
    setIsSaved?.(false);
    setDownloadUrl?.("");
    setPlan((prev) => {
      const count = (prev?.slides?.length || 0) + 1;
      const layoutObj = OFFICE_LAYOUT_PRESETS.find((l) => l.id === layoutType) || { label: "New Slide" };

      let plugins = [
        { type: "subtitle", data: { text: `${layoutObj.label} Overview` } },
        { type: "bullets", data: { points: ["First important key takeaway point", "Second supporting detail"] } },
      ];

      if (layoutType === "title_subtitle") {
        plugins = [{ type: "subtitle", data: { text: "Section Subtitle / Introduction Headline" } }];
      } else if (layoutType === "two_content" || layoutType === "paragraph_2col") {
        plugins = [
          { type: "paragraph_2col", data: { left_title: "Key Aspect 1", left_text: "Description for first column...", right_title: "Key Aspect 2", right_text: "Description for second column..." } },
        ];
      } else if (layoutType === "comparison") {
        plugins = [
          { type: "table", data: { title: "Feature Comparison Table", headers: ["Feature / Option", "Option A", "Option B"], rows: [["Core Performance", "High Speed", "Standard"], ["Security Tier", "Enterprise SSL", "Basic"]] } },
        ];
      } else if (layoutType === "picture_caption" || layoutType === "image_text") {
        plugins = [
          { type: "image", data: { caption: "Visual illustration topic preview", url: "" } },
          { type: "bullets", data: { points: ["Key visual takeaway point 1", "Supporting observation point 2"] } },
        ];
      } else if (layoutType === "content_caption") {
        plugins = [
          { type: "paragraph", data: { text: "Detailed explanation paragraph for side caption..." } },
          { type: "bullets", data: { points: ["Key point highlight 1", "Key point highlight 2"] } },
        ];
      } else if (layoutType === "blank" || layoutType === "title_only") {
        plugins = [];
      }

      const newSlide = {
        title: `Slide ${count}: ${layoutObj.label}`,
        subtitle: layoutType === "title_subtitle" ? "Presentation Section Subtitle" : "",
        layout: layoutType,
        plugins,
      };

      const slides = [...(prev?.slides || []), newSlide];
      setActiveSlideIndex(slides.length - 1);
      return {
        title: prev?.title || "My Presentation Deck",
        slides,
      };
    });
  };

  const handleAddBlankSlide = () => {
    if (!setPlan) return;
    setIsSaved?.(false);
    setDownloadUrl?.("");
    setPlan((prev) => {
      const newSlide = {
        title: "",
        subtitle: "",
        layout: "blank",
        plugins: [],
      };
      const slides = [...(prev?.slides || []), newSlide];
      setActiveSlideIndex(slides.length - 1);
      return {
        title: prev?.title || "My Presentation Deck",
        slides,
      };
    });
  };
  const carouselRef = useRef(null);

  // Keyboard Arrow Keys (◄ ►) Slide Navigation
  useEffect(() => {
    const handleKeyDown = (e) => {
      const activeTag = document.activeElement?.tagName?.toLowerCase();
      if (activeTag === "input" || activeTag === "textarea" || document.activeElement?.isContentEditable) {
        return;
      }
      if (e.key === "ArrowLeft") {
        setActiveSlideIndex((prev) => Math.max(0, prev - 1));
      } else if (e.key === "ArrowRight") {
        setActiveSlideIndex((prev) => Math.min((plan?.slides?.length || 1) - 1, prev + 1));
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [plan, setActiveSlideIndex]);

  // Auto-scroll active slide into view (supports both horizontal carousel on mobile and vertical list on desktop)
  useEffect(() => {
    if (carouselRef.current) {
      const activeEl = carouselRef.current.querySelector(".slide-vertical-item.active");
      if (activeEl) {
        activeEl.scrollIntoView({ behavior: "smooth", block: "nearest", inline: "nearest" });
      }
    }
  }, [activeSlideIndex]);

  const handleDirectDownload = async (e) => {
    e?.preventDefault();
    if (typeof downloadSavedPresentation === "function") {
      await downloadSavedPresentation();
      return;
    }

    const currentPId = savedMeta?.presentation_id || plan?.presentation_id;
    const fallbackExt = exportFormat === "pdf" ? "pdf" : "pptx";

    if (!downloadUrl && currentPId) {
      const dynamicUrl = `${API_SERVER_URL}/download-presentation/${currentPId}`;
      await downloadFileAsBlob(dynamicUrl, `presentation_${currentPId}.${fallbackExt}`);
      return;
    }

    if (!downloadUrl) return;
    const isLocal = /^http:\/\/(localhost|127\.0\.0\.1)(:\d+)?/i.test(downloadUrl);
    const fullUrl = isLocal ? downloadUrl : downloadUrl.replace(/^http:\/\//i, "https://");
    const filename = fullUrl.split("/").pop() || `presentation.${fallbackExt}`;
    try {
      await downloadFileAsBlob(fullUrl, filename);
    } catch (err) {
      if (currentPId) {
        const dynamicUrl = `${API_SERVER_URL}/download-presentation/${currentPId}`;
        await downloadFileAsBlob(dynamicUrl, `presentation_${currentPId}.${fallbackExt}`);
      }
    }
  };

  const API_SERVER_URL = `${API_BASE_URL || process.env.REACT_APP_API_BASE_URL || ""}/api/presentation`;

  // Helper to dynamically fetch exact topic-matched HD Unsplash image via backend API
  const handleAutoUnsplashFetch = async (pIdx, query) => {
    const searchTopic = query || activeSlide?.title || "presentation visual";
    try {
      const res = await fetch(`${API_SERVER_URL}/unsplash/search?query=${encodeURIComponent(searchTopic)}`);
      const data = await res.json();
      if (data?.url) {
        handlePluginTextChange(activeSlideIndex, pIdx, "url", data.url);
        handlePluginTextChange(activeSlideIndex, pIdx, "path", data.url);
        return;
      }
    } catch (err) {
      console.warn("Unsplash API fetch failed, using fallback topic search", err);
    }

    const fallbackUrl = `https://source.unsplash.com/featured/1000x600/?${encodeURIComponent(searchTopic)}`;
    handlePluginTextChange(activeSlideIndex, pIdx, "url", fallbackUrl);
    handlePluginTextChange(activeSlideIndex, pIdx, "path", fallbackUrl);
  };

  const [generatingAiImgIdx, setGeneratingAiImgIdx] = useState(null);

  const handleGenerateAIImage = async (pIdx, defaultTopic = "") => {
    const plugin = activeSlide?.plugins?.[pIdx];
    const basePrompt = defaultTopic || plugin?.data?.caption || activeSlide?.title || plan?.title || "modern executive presentation visual";
    const promptInput = window.prompt("Enter AI image prompt (e.g., 'Futuristic AI neural network server room, 8k'):", basePrompt);
    if (!promptInput || !promptInput.trim()) return;

    setGeneratingAiImgIdx(pIdx);
    try {
      const res = await fetch(
        `${API_SERVER_URL}/ai-image/generate?prompt=${encodeURIComponent(promptInput.trim())}`,
        { headers: { ...getAuthHeaders() } }
      );
      const data = await res.json();
      const imgUrl = data?.url;
      if (imgUrl) {
        handlePluginTextChange(activeSlideIndex, pIdx, "url", imgUrl);
        handlePluginTextChange(activeSlideIndex, pIdx, "path", imgUrl);
        handlePluginTextChange(activeSlideIndex, pIdx, "caption", promptInput.trim());
        return;
      }
    } catch (err) {
      console.warn("Backend AI image generation failed, falling back to direct engine", err);
    }

    try {
      const encoded = encodeURIComponent(`${promptInput.trim()}, modern executive corporate presentation visual, photorealistic 8k, cinematic lighting`);
      const fallbackUrl = `https://image.pollinations.ai/prompt/${encoded}?width=1280&height=720&model=flux&nologo=true&seed=${Math.floor(Math.random() * 9000) + 1000}`;
      handlePluginTextChange(activeSlideIndex, pIdx, "url", fallbackUrl);
      handlePluginTextChange(activeSlideIndex, pIdx, "path", fallbackUrl);
      handlePluginTextChange(activeSlideIndex, pIdx, "caption", promptInput.trim());
    } catch (e) {
      alert("AI image generation failed. Please try again.");
    } finally {
      setGeneratingAiImgIdx(null);
    }
  };

  // Helper to handle local custom image file uploads from device (FileReader -> Data URL)
  const handleImageFileUpload = (e, targetPluginIdx = null) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const dataUrl = event.target?.result;
      if (!dataUrl) return;

      if (targetPluginIdx !== null && targetPluginIdx !== undefined) {
        handlePluginTextChange(activeSlideIndex, targetPluginIdx, "url", dataUrl);
        handlePluginTextChange(activeSlideIndex, targetPluginIdx, "path", dataUrl);
        if (!activeSlide?.plugins?.[targetPluginIdx]?.data?.caption) {
          handlePluginTextChange(activeSlideIndex, targetPluginIdx, "caption", file.name.replace(/\.[^/.]+$/, ""));
        }
      } else {
        handleAddPlugin(activeSlideIndex, "image");
        setTimeout(() => {
          const newIdx = safeArray(activeSlide?.plugins).length;
          handlePluginTextChange(activeSlideIndex, newIdx, "url", dataUrl);
          handlePluginTextChange(activeSlideIndex, newIdx, "path", dataUrl);
          handlePluginTextChange(activeSlideIndex, newIdx, "caption", file.name.replace(/\.[^/.]+$/, ""));
        }, 50);
      }
    };
    reader.readAsDataURL(file);
  };

  const [refiningPluginIdx, setRefiningPluginIdx] = useState(null);

  // TTS Voiceover Narration State 🎙️
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [speakingSlideIdx, setSpeakingSlideIdx] = useState(null);

  const compileSlideNarrationScript = (slide, slideIndex) => {
    if (!slide) return "";
    const parts = [];
    parts.push(`Slide ${slideIndex + 1}: ${slide.title || "Untitled Slide"}.`);
    if (slide.subtitle) parts.push(slide.subtitle + ".");

    safeArray(slide.plugins).forEach((p) => {
      if (!p || !p.data) return;
      if (p.type === "bullets" && Array.isArray(p.data.points)) {
        p.data.points.forEach((pt) => parts.push(String(pt).trim() + "."));
      } else if (p.type === "paragraph" && p.data.text) {
        parts.push(String(p.data.text).trim());
      } else if (p.type === "diagram" && (p.data.diagram || p.data.text)) {
        parts.push("Workflow diagram: " + String(p.data.diagram || p.data.text).replace(/[\u2794\->|]/g, " then ") + ".");
      } else if (p.type === "stat" && (p.data.number || p.data.label)) {
        parts.push(`Key metric: ${p.data.number || ""} ${p.data.label || ""}.`);
      } else if (p.type === "notes" && p.data.notes) {
        parts.push("Speaker note: " + String(p.data.notes).trim());
      }
    });

    return parts.filter(Boolean).join(" ");
  };

  const audioInstanceRef = useRef(null);

  const fallbackToSpeechSynthesis = (script, slideIndex) => {
    if (typeof window === "undefined" || !("speechSynthesis" in window)) {
      setIsSpeaking(false);
      setSpeakingSlideIdx(null);
      return;
    }
    const utterance = new SpeechSynthesisUtterance(script);
    utterance.rate = 1.0;
    utterance.pitch = 1.0;
    utterance.onstart = () => {
      setIsSpeaking(true);
      setSpeakingSlideIdx(slideIndex);
    };
    utterance.onend = () => {
      setIsSpeaking(false);
      setSpeakingSlideIdx(null);
    };
    utterance.onerror = () => {
      setIsSpeaking(false);
      setSpeakingSlideIdx(null);
    };
    window.speechSynthesis.speak(utterance);
  };

  const handleToggleSlideVoiceover = async (slide, slideIndex) => {
    // 1. If currently playing, stop both HTML5 audio and speechSynthesis
    if (isSpeaking && speakingSlideIdx === slideIndex) {
      if (audioInstanceRef.current) {
        audioInstanceRef.current.pause();
        audioInstanceRef.current = null;
      }
      if (typeof window !== "undefined" && "speechSynthesis" in window) {
        window.speechSynthesis.cancel();
      }
      setIsSpeaking(false);
      setSpeakingSlideIdx(null);
      return;
    }

    // Stop any existing playback
    if (audioInstanceRef.current) {
      audioInstanceRef.current.pause();
      audioInstanceRef.current = null;
    }
    if (typeof window !== "undefined" && "speechSynthesis" in window) {
      window.speechSynthesis.cancel();
    }

    const script = compileSlideNarrationScript(slide, slideIndex);
    if (!script.trim()) {
      alert("This slide has no text to read out!");
      return;
    }

    setIsSpeaking(true);
    setSpeakingSlideIdx(slideIndex);

    // 2. Try Neural Server Voiceover via backend API (edge-tts)
    try {
      const res = await fetch(`${API_SERVER_URL}/voiceover/synthesize`, {
        method: "POST",
        headers: { "Content-Type": "application/json", ...getAuthHeaders() },
        body: JSON.stringify({
          text: script,
          language: plan?.language || "en-US",
          slide_index: slideIndex,
        }),
      });
      const data = await res.json();
      if (res.ok && data?.audio_url) {
        const fullAudioUrl = /^http:\/\/(localhost|127\.0\.0\.1)(:\d+)?/i.test(data.audio_url)
          ? data.audio_url
          : data.audio_url.replace(/^http:\/\//i, "https://");

        const audio = new Audio(fullAudioUrl);
        audioInstanceRef.current = audio;
        audio.onended = () => {
          setIsSpeaking(false);
          setSpeakingSlideIdx(null);
          audioInstanceRef.current = null;
        };
        audio.onerror = () => {
          fallbackToSpeechSynthesis(script, slideIndex);
        };
        await audio.play();
        return;
      }
    } catch (err) {
      console.warn("Backend neural TTS voiceover failed, falling back to local speech synthesis", err);
    }

    // 3. Fallback: Browser Web Speech API
    fallbackToSpeechSynthesis(script, slideIndex);
  };

  // Helper to use Gemini AI to refine, polish, or convert slide content into punchy bullets/diagram steps
  const handleAIRefine = async (pIdx, action = "bullets") => {
    const plugin = activeSlide?.plugins?.[pIdx];
    if (!plugin) return;
    const currentText = plugin.data?.text || safeArray(plugin.data?.points).join("\n") || plugin.data?.diagram || plugin.data?.header || plugin.data?.title || activeSlide?.title || "Workflow Diagram";
    if (!currentText) return;

    const targetAction = plugin.type === "diagram" ? "diagram" : action;

    setRefiningPluginIdx(pIdx);
    try {
      const res = await fetch(`${API_SERVER_URL}/refine-slide`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...getAuthHeaders(),
        },
        body: JSON.stringify({
          text: currentText,
          action: targetAction,
          slide_title: activeSlide?.title || "",
          presentation_title: plan?.title || "",
        }),
      });
      const data = await res.json();
      if (data?.refined_text) {
        if (plugin.type === "bullets") {
          const newPoints = data.refined_text.split("\n").map(s => s.replace(/^[•\-*\d.]+\s*/, "").trim()).filter(Boolean);
          handlePluginTextChange(activeSlideIndex, pIdx, "points", newPoints);
        } else if (plugin.type === "diagram") {
          let cleanedDiagram = data.refined_text;

          if (data?.refined_header) {
            handlePluginTextChange(activeSlideIndex, pIdx, "header", data.refined_header);
            handlePluginTextChange(activeSlideIndex, pIdx, "title", data.refined_header);
            handlePluginTextChange(activeSlideIndex, pIdx, "diagram_title", data.refined_header);
          } else if (!plugin.data?.header && !plugin.data?.diagram_title && activeSlide?.title) {
            const autoHeader = `${activeSlide.title} Process Flow`;
            handlePluginTextChange(activeSlideIndex, pIdx, "header", autoHeader);
            handlePluginTextChange(activeSlideIndex, pIdx, "title", autoHeader);
            handlePluginTextChange(activeSlideIndex, pIdx, "diagram_title", autoHeader);
          }

          // If response has bullet points, newlines, or lacks ➜ arrow format, sanitize into clean diagram step nodes
          if (cleanedDiagram.includes("•") || cleanedDiagram.includes("\n") || !cleanedDiagram.includes("➜")) {
            const rawLines = cleanedDiagram.split(/\n|•|\*/).map(l => l.trim()).filter(Boolean);
            const nodes = [];
            for (let line of rawLines) {
              let nodeStr = line.replace(/^\d+[.)]\s*/, "").replace(/\*\*/g, "").trim();
              if (nodeStr.includes(":")) {
                const parts = nodeStr.split(":");
                const title = parts[0].trim();
                if (title.length > 1 && title.length < 45) {
                  nodeStr = title;
                }
              }
              if (nodeStr) {
                nodeStr = nodeStr.startsWith("[") && nodeStr.endsWith("]") ? nodeStr : `[${nodeStr}]`;
                nodes.push(nodeStr);
              }
            }
            if (nodes.length > 0) {
              cleanedDiagram = nodes.join(" ➜ ");
            }
          }
          handlePluginTextChange(activeSlideIndex, pIdx, "diagram", cleanedDiagram);
          handlePluginTextChange(activeSlideIndex, pIdx, "text", cleanedDiagram);
        } else if (plugin.type === "chart" || action === "chart") {
          if (data?.refined_chart) {
            const rc = data.refined_chart;
            if (rc.title) handlePluginTextChange(activeSlideIndex, pIdx, "title", rc.title);
            if (rc.series_name) handlePluginTextChange(activeSlideIndex, pIdx, "series_name", rc.series_name);
            if (rc.chart_type) handlePluginTextChange(activeSlideIndex, pIdx, "chart_type", rc.chart_type);
            if (Array.isArray(rc.categories) && Array.isArray(rc.values)) {
              handlePluginTextChange(activeSlideIndex, pIdx, "categories", rc.categories);
              handlePluginTextChange(activeSlideIndex, pIdx, "labels", rc.categories);
              handlePluginTextChange(activeSlideIndex, pIdx, "values", rc.values.join(", "));
            }
          } else if (data?.refined_text) {
            handlePluginTextChange(activeSlideIndex, pIdx, "title", data.refined_text);
          }
        } else {
          handlePluginTextChange(activeSlideIndex, pIdx, "text", data.refined_text);
        }
      }
    } catch (err) {
      console.warn("AI Refine API call failed", err);
    } finally {
      setRefiningPluginIdx(null);
    }
  };

  return (
    <>
      <div className="card-box">
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8, flexWrap: "wrap", gap: 8 }}>
          <div className="section-label" style={{ margin: 0 }}>Slide Navigation & Feature Editor</div>
          <div style={{ display: "flex", gap: 8, alignItems: "center", flexWrap: "wrap" }}>
            {saveError ? (
              <span style={{ fontSize: 11, color: "#fca5a5", fontWeight: "bold" }}>
                ⚠️ {saveError}
              </span>
            ) : null}

            <button
              type="button"
              className="btn-ui primary sm"
              onClick={savePresentation}
              disabled={isSaving}
              style={{
                background: isSaved
                  ? "linear-gradient(135deg, #6366f1, #8b5cf6)"
                  : "linear-gradient(135deg, #8b5cf6, #ec4899)",
                border: "none",
                cursor: isSaving ? "not-allowed" : "pointer",
                boxShadow: "0 4px 12px rgba(139, 92, 246, 0.4)",
              }}
              title={isSaved ? "All changes saved to presentation" : "Save current slide edits to backend"}
            >
              {isSaving ? "⏳ Saving & Exporting PPT..." : isSaved ? "✅ Saved (Latest)" : "💾 Save Changes"}
            </button>

            <button
              type="button"
              className="btn-ui primary sm"
              onClick={async (e) => {
                e?.preventDefault();
                if (typeof downloadSavedPresentation === "function") {
                  await downloadSavedPresentation();
                } else {
                  await handleDirectDownload(e);
                }
              }}
              disabled={isSaving}
              style={{
                background: "linear-gradient(135deg, #10b981, #059669)",
                border: "none",
                cursor: isSaving ? "not-allowed" : "pointer",
                boxShadow: "0 4px 12px rgba(16, 185, 129, 0.4)",
              }}
              title={!isSaved ? "Save and download updated PPT with latest edits" : "Download latest saved PPT"}
            >
              📥 {!isSaved ? "Save & Download PPT" : "Download PPT"}
            </button>
          </div>
        </div>

        {/* DECK TITLE BAR */}
        <div style={{ marginBottom: 8 }}>
          <label style={{ fontSize: 11, fontWeight: 700, color: "var(--text-muted)" }}>Presentation Deck Title:</label>
          <input
            type="text"
            value={plan?.title || ""}
            onChange={(e) => handleDeckTitleChange(e.target.value)}
            style={{
              width: "100%",
              background: "rgba(0,0,0,0.4)",
              border: "1px solid var(--accent)",
              borderRadius: 8,
              padding: "6px 12px",
              color: "#fff",
              fontWeight: 700,
              fontSize: 14,
              marginTop: 2,
            }}
          />
        </div>

        <div className="editor-workspace" style={{ display: "flex", flexDirection: "column", width: "100%", gap: 8 }}>
          {/* TAB + RIBBON CONTEXTUAL TOOLBAR (POWERPOINT / FIGMA STYLE) */}
          <SlideEditorRibbonToolbar
            activeSlide={activeSlide}
            activeSlideIndex={activeSlideIndex}
            selectedBgPreset={selectedBgPreset}
            setSelectedBgPreset={setSelectedBgPreset}
            templateName={templateName}
            setTemplateName={setTemplateName}
            customBgColor1={customBgColor1}
            setCustomBgColor1={setCustomBgColor1}
            customBgColor2={customBgColor2}
            setCustomBgColor2={setCustomBgColor2}
            customTextColor={customTextColor}
            setCustomTextColor={setCustomTextColor}
            handleSlidePropertyChange={handleSlidePropertyChange}
            handleApplySlideLayout={handleApplySlideLayout}
            handleAddSlideWithLayout={handleAddSlideWithLayout}
            handleAddPlugin={handleAddPlugin}
            handleDuplicateSlide={handleDuplicateSlide}
            handleDeleteSlide={handleDeleteSlide}
            handleToggleSlideVoiceover={handleToggleSlideVoiceover}
            isSpeaking={isSpeaking}
            speakingSlideIdx={speakingSlideIdx}
            savePresentation={savePresentation}
            isSaving={isSaving}
            isSaved={isSaved}
            setShowDownloadModal={setShowDownloadModal}
            downloadUrl={downloadUrl}
            selectedPluginIndex={selectedPluginIndex}
            handleUpdatePluginData={handleUpdatePluginData}
            handleLayerOrder={handleLayerOrder}
          />


          {/* 2-COLUMN WORKSPACE: LEFT = VERTICAL SLIDE LIST RAIL, RIGHT = CANVAS & FEATURES */}
          <div className="slide-editor-main-layout">
            {/* LEFT COLUMN: VERTICAL SLIDE LIST RAIL (Beside slide canvas on Laptop & Tablet) */}
            <div className="slide-sidebar-rail">
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 2, paddingBottom: 6, borderBottom: "1px solid rgba(255,255,255,0.08)" }}>
                <span style={{ fontSize: 12, fontWeight: 800, color: "#c084fc", letterSpacing: 0.5 }}>
                  Slides ({plan?.slides?.length || 0})
                </span>
                <button
                  type="button"
                  className="btn-ui primary sm"
                  onClick={handleAddBlankSlide}
                  style={{ padding: "3px 8px", fontSize: 11, display: "inline-flex", alignItems: "center", gap: 4 }}
                  title="Add New Blank Slide"
                >
                  <span>+ Add Slide</span>
                </button>
              </div>

              <div className="slide-vertical-list" ref={carouselRef}>
                {safeArray(plan?.slides).map((slideItem, idx) => {
                  const isCurrentActive = activeSlideIndex === idx;
                  return (
                    <div
                      key={idx}
                      className={`slide-vertical-item ${isCurrentActive ? "active" : ""}`}
                      onClick={() => setActiveSlideIndex(idx)}
                      draggable={true}
                      onDragStart={(e) => {
                        e.dataTransfer.setData("text/plain", idx.toString());
                        e.dataTransfer.effectAllowed = "move";
                      }}
                      onDragOver={(e) => {
                        e.preventDefault();
                        e.dataTransfer.dropEffect = "move";
                      }}
                      onDrop={(e) => {
                        e.preventDefault();
                        const fromIdx = parseInt(e.dataTransfer.getData("text/plain"), 10);
                        if (!isNaN(fromIdx) && fromIdx !== idx) {
                          handleMoveSlideToPosition(fromIdx, idx);
                        }
                      }}
                      title="Drag & Drop to reorder slide"
                    >
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                        <span style={{ fontSize: 10, fontWeight: 800, color: isCurrentActive ? "#38bdf8" : "#c084fc", textTransform: "uppercase" }}>
                          Slide {idx + 1}
                        </span>
                        <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
                          {(() => {
                            const totalS = plan?.slides?.length || 1;
                            const isLast = idx === totalS - 1 && totalS > 1;
                            const step = idx === 0 ? 0 : (isLast ? 5 : ((idx - 1) % 4 + 1));
                            const tagLabels = ["🌟 Cover", "📌 Agenda", "🏛️ Deep-Dive", "📊 Data", "⚖️ Compare", "🎯 Summary"];
                            return (
                              <span style={{ fontSize: 8.5, fontWeight: 700, color: "rgba(255,255,255,0.6)", background: "rgba(255,255,255,0.06)", padding: "1px 4px", borderRadius: 3 }}>
                                {tagLabels[step] || "Slide"}
                              </span>
                            );
                          })()}
                          {isCurrentActive && (
                            <span style={{ fontSize: 8.5, fontWeight: 800, color: "#38bdf8", background: "rgba(56,189,248,0.18)", padding: "1px 5px", borderRadius: 3, border: "1px solid rgba(56,189,248,0.4)" }}>
                              ACTIVE
                            </span>
                          )}
                        </div>
                      </div>

                      <div style={{ fontSize: 12, fontWeight: 700, color: "#ffffff", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                        {slideItem.title || "Untitled Slide"}
                      </div>

                      {slideItem.subtitle ? (
                        <div style={{ fontSize: 9.5, color: "var(--text-muted)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                          {slideItem.subtitle}
                        </div>
                      ) : null}

                      {/* REORDER / DELETE CONTROLS */}
                      <div style={{ display: "flex", gap: 4, marginTop: 4, width: "100%" }} onClick={(e) => e.stopPropagation()}>
                        <button
                          type="button"
                          className="btn-ui secondary sm"
                          onClick={() => handleMoveSlide(idx, -1)}
                          disabled={idx === 0}
                          title="Move Up"
                          style={{ flex: 1, padding: "2px 4px", fontSize: 9.5, whiteSpace: "nowrap" }}
                        >
                          ↑ Up
                        </button>
                        <button
                          type="button"
                          className="btn-ui secondary sm"
                          onClick={() => handleMoveSlide(idx, 1)}
                          disabled={idx === (plan?.slides?.length || 0) - 1}
                          title="Move Down"
                          style={{ flex: 1, padding: "2px 4px", fontSize: 9.5, whiteSpace: "nowrap" }}
                        >
                          Down ↓
                        </button>
                        <button
                          type="button"
                          className="btn-ui danger sm"
                          onClick={() => handleDeleteSlide(idx)}
                          title="Delete Slide"
                          style={{ padding: "2px 6px", fontSize: 10 }}
                        >
                          🗑️
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* RIGHT COLUMN: CANVAS & FEATURE BLOCKS INSPECTOR */}
            <div className="canvas-inspector-col">
              {/* SELECTED SLIDE FEATURE INSPECTOR & CANVAS PREVIEW */}
              {activeSlide ? (
                <div className="feature-inspector-container" style={{ display: "flex", flexDirection: "column", width: "100%", gap: 12 }}>

              
              {/* 16:9 LIVE CANVAS DISPLAY */}
              {(() => {
                const titleVAlign = activeSlide.title_valign || activeSlide.subtitle_valign || "auto";
                const isVMiddle = titleVAlign === "middle" || titleVAlign === "center";
                const isVBottom = titleVAlign === "bottom";
                const nonNotesPlugins = safeArray(activeSlide.plugins).filter((p) => p.type !== "notes");
                const hasPlugins = nonNotesPlugins.length > 0;

                return (
                  <div style={{ position: "relative", width: "100%" }}>
                    {/* PREVIOUS SLIDE BUTTON (LEFT ◄) */}
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        setActiveSlideIndex((prev) => Math.max(0, prev - 1));
                      }}
                      disabled={activeSlideIndex === 0}
                      style={{
                        position: "absolute",
                        left: -25,
                        top: "50%",
                        transform: "translateY(-50%)",
                        zIndex: 35,
                        width: 20,
                        height: 20,
                        borderRadius: "100%",
                        background: activeSlideIndex === 0
                          ? "rgba(15, 23, 42, 0.4)"
                          : "linear-gradient(135deg,  0% , 100% rgba(168, 85, 247, 0.6), rgba(139, 92, 246, 0.6))",
                        border: activeSlideIndex === 0
                          ? "1px solid rgba(255, 255, 255, 0.1)"
                          : "2px solid rgba(255, 255, 255, 0.4)",
                        color: activeSlideIndex === 0 ? "rgba(255, 255, 255, 0.3)" : "#ffffff",
                        fontSize: 22,
                        lineHeight: 1,
                        cursor: activeSlideIndex === 0 ? "not-allowed" : "pointer",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        boxShadow: activeSlideIndex === 0 ? "none" : "0 8px 25px rgba(0, 0, 0, 0.6), 0 0 16px rgba(168, 85, 247, 0.6)",
                        transition: "all 0.2s ease",
                      }}
                      title="Previous Slide (◂)"
                    ></button>

                    {/* NEXT SLIDE BUTTON (RIGHT ►) */}
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        setActiveSlideIndex((prev) => Math.min((plan?.slides?.length || 1) - 1, prev + 1));
                      }}
                      disabled={activeSlideIndex >= (plan?.slides?.length || 1) - 1}
                      style={{
                        position: "absolute",
                        right: -25,
                        top: "50%",
                        transform: "translateY(-50%)",
                        zIndex: 35,
                        width: 20,
                        height: 20,
                        borderRadius: "100%",
                        background: activeSlideIndex >= (plan?.slides?.length || 1) - 1
                          ? "rgba(15, 23, 42, 0.4)"
                          : "linear-gradient(135deg,  0% , 100% rgba(168, 85, 247, 0.6), rgba(139, 92, 246, 0.6))",
                        border: activeSlideIndex >= (plan?.slides?.length || 1) - 1
                          ? "1px solid rgba(255, 255, 255, 0.1)"
                          : "2px solid rgba(255, 255, 255, 0.4)",
                        color: activeSlideIndex >= (plan?.slides?.length || 1) - 1 ? "rgba(255, 255, 255, 0.3)" : "#ffffff",
                        fontSize: 22,
                        lineHeight: 1,
                        cursor: activeSlideIndex >= (plan?.slides?.length || 1) - 1 ? "not-allowed" : "pointer",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        boxShadow: activeSlideIndex >= (plan?.slides?.length || 1) - 1 ? "none" : "0 8px 25px rgba(0, 0, 0, 0.6), 0 0 16px rgba(168, 85, 247, 0.6)",
                        transition: "all 0.2s ease",
                      }}
                      title="Next Slide (▸)"
                    ></button>

                    <div
                      className="slide-canvas-box"
                      style={{
                        background: selectedBgConfig.bg,
                        color: selectedBgConfig.text,
                        fontFamily: activeSlide.font_family ? `"${activeSlide.font_family}", sans-serif` : "inherit",
                        display: "flex",
                        flexDirection: "column",
                        justifyContent: isVMiddle ? "center" : isVBottom ? "flex-end" : "flex-start",
                        boxSizing: "border-box",
                        position: "relative",
                        overflow: "hidden",
                      }}
                    >
                    {/* DYNAMIC MULTI-SLIDE BACKGROUND ARCHETYPE DECORATIONS */}
                    {(() => {
                      const totalS = plan?.slides?.length || 1;
                      const isLast = activeSlideIndex === totalS - 1 && totalS > 1;
                      const step = activeSlideIndex === 0 ? 0 : (isLast ? 5 : ((activeSlideIndex - 1) % 4 + 1));
                      const acc = selectedBgConfig?.accent || "#c084fc";

                      return (
                        <>
                          {/* Slide 2 Archetype: Top Header Accent Strip */}
                          {step === 1 && (
                            <div
                              style={{
                                position: "absolute",
                                top: 0,
                                left: 0,
                                right: 0,
                                height: 4,
                                background: `linear-gradient(90deg, ${acc}, transparent 80%)`,
                                borderRadius: "12px 12px 0 0",
                                zIndex: 1,
                              }}
                            />
                          )}

                          {/* Slide 3 Archetype: Left Vertical Accent Rail */}
                          {step === 2 && (
                            <div
                              style={{
                                position: "absolute",
                                left: 0,
                                top: 24,
                                bottom: 24,
                                width: 4,
                                background: `linear-gradient(180deg, ${acc}dd, transparent)`,
                                borderRadius: "0 4px 4px 0",
                                zIndex: 1,
                              }}
                            />
                          )}

                          {/* Slide 4 Archetype: Bottom Data Floor Accent Bar */}
                          {step === 3 && (
                            <div
                              style={{
                                position: "absolute",
                                bottom: 0,
                                left: 24,
                                right: 24,
                                height: 3.5,
                                background: `linear-gradient(90deg, transparent, ${acc}, transparent)`,
                                borderRadius: "3px 3px 0 0",
                                zIndex: 1,
                              }}
                            />
                          )}

                          {/* Slide 5 Archetype: Dual Corner Accent Brackets */}
                          {step === 4 && (
                            <>
                              <div
                                style={{
                                  position: "absolute",
                                  top: 10,
                                  right: 10,
                                  width: 22,
                                  height: 22,
                                  borderTop: `2.5px solid ${acc}99`,
                                  borderRight: `2.5px solid ${acc}99`,
                                  borderRadius: "0 6px 0 0",
                                  pointerEvents: "none",
                                  zIndex: 1,
                                }}
                              />
                              <div
                                style={{
                                  position: "absolute",
                                  bottom: 10,
                                  left: 10,
                                  width: 22,
                                  height: 22,
                                  borderBottom: `2.5px solid ${acc}99`,
                                  borderLeft: `2.5px solid ${acc}99`,
                                  borderRadius: "0 0 0 6px",
                                  pointerEvents: "none",
                                  zIndex: 1,
                                }}
                              />
                            </>
                          )}

                          {/* Slide 6+ / Final Archetype: Inset Glow Card Frame */}
                          {step === 5 && (
                            <div
                              style={{
                                position: "absolute",
                                inset: 0,
                                borderRadius: 12,
                                pointerEvents: "none",
                                border: `1px solid ${acc}2b`,
                                boxShadow: `inset 0 0 24px ${acc}15`,
                                zIndex: 1,
                              }}
                            />
                          )}
                        </>
                      );
                    })()}

                    {/* THEME-SPECIFIC COVER BADGE (SLIDE 1) */}
                    {activeSlideIndex === 0 && (
                      <div style={{ display: "flex", justifyContent: activeSlide.title_align === "left" ? "flex-start" : "center", marginBottom: 6 }}>
                        <div
                          style={{
                            display: "inline-flex",
                            alignItems: "center",
                            gap: 6,
                            padding: "4px 14px",
                            borderRadius: selectedBgPreset === "executive_gold" ? "4px" : "20px",
                            background: selectedBgPreset === "executive_gold"
                              ? "rgba(245, 158, 11, 0.18)"
                              : selectedBgPreset === "cyberpunk_neon"
                              ? "rgba(244, 63, 94, 0.22)"
                              : "rgba(139, 92, 246, 0.2)",
                            border: `1.5px solid ${selectedBgConfig?.accent || "#c084fc"}`,
                            fontSize: "11px",
                            fontWeight: "800",
                            color: selectedBgConfig?.accent || "#c084fc",
                            letterSpacing: "1px",
                            textTransform: "uppercase",
                            boxShadow: selectedBgPreset === "cyberpunk_neon" ? "0 0 12px rgba(244, 63, 94, 0.35)" : "none",
                          }}
                        >
                          {selectedBgPreset === "executive_gold" ? "✦ EXECUTIVE BRIEFING ✦" :
                           selectedBgPreset === "cyberpunk_neon" ? "⚡ AI & TECH INTELLIGENCE" :
                           selectedBgPreset === "emerald_dark" || selectedBgPreset === "wall_street" ? "📊 STRATEGIC OVERVIEW" :
                           selectedBgPreset === "ocean_blue" ? "🌊 ENTERPRISE ARCHITECTURE" :
                           selectedBgPreset === "velvet_rose" || selectedBgPreset === "sunset_glow" ? "🔥 KEYNOTE INSIGHTS" :
                           selectedBgPreset === "clean_light" || selectedBgPreset === "titanium_white" ? "🏢 EXECUTIVE REPORT" :
                           "✨ EXECUTIVE PRESENTATION"}
                        </div>
                      </div>
                    )}

                    {/* POWERPOINT-STYLE TITLE PLACEHOLDER BOX */}
                    <div
                      className="ppt-title-box"
                      style={{
                        width: "100%",
                        textAlign: activeSlide.title_align || (activeSlideIndex === 0 ? "center" : "left"),
                        border: "1.5px dashed transparent",
                        borderRadius: 8,
                        padding: "4px 8px",
                        transition: "all 0.15s ease",
                        position: "relative",
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.borderColor = "rgba(56, 189, 248, 0.35)";
                      }}
                      onMouseLeave={(e) => {
                        if (document.activeElement !== e.currentTarget.querySelector("h2")) {
                          e.currentTarget.style.borderColor = "transparent";
                        }
                      }}
                    >
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 2 }}>
                        <div style={{ fontSize: 11, fontWeight: "800", color: selectedBgConfig?.accent || "inherit", opacity: 0.85, letterSpacing: 1 }}>
                          SLIDE {activeSlideIndex + 1} OF {plan.slides.length}
                        </div>
                        <span style={{ fontSize: 10, color: "rgba(255,255,255,0.35)", fontWeight: 600 }}>✎ Click text to edit</span>
                      </div>
                      <h2
                        contentEditable={true}
                        suppressContentEditableWarning={true}
                        onFocus={(e) => {
                          e.currentTarget.parentElement.style.borderColor = "#38bdf8";
                          e.currentTarget.parentElement.style.background = "rgba(56, 189, 248, 0.04)";
                        }}
                        onBlur={(e) => {
                          e.currentTarget.parentElement.style.borderColor = "transparent";
                          e.currentTarget.parentElement.style.background = "transparent";
                          handleSlideTitleChange(activeSlideIndex, e.target.innerText.trim() || "Click to add title");
                        }}
                        title="Click to edit slide title inline"
                        style={{
                          fontSize: `clamp(20px, 4.2vw, ${activeSlide.title_font_size || (activeSlideIndex === 0 ? 44 : 28)}px)`,
                          color: activeSlide.title_color || "inherit",
                          textAlign: activeSlide.title_align || (activeSlideIndex === 0 ? "center" : "left"),
                          fontWeight: activeSlide.title_bold === false ? 400 : 800,
                          margin: "2px 0",
                          wordBreak: "break-word",
                          outline: "none",
                          cursor: "text",
                          opacity: activeSlide.title ? 1 : 0.45,
                          lineHeight: 1.25,
                        }}
                      >
                        {activeSlide.title || "Click to add title"}
                      </h2>
                    </div>

                    {/* THEME-SPECIFIC ACCENT DIVIDER BAR (SLIDE 1) */}
                    {activeSlideIndex === 0 && (
                      <div
                        style={{
                          display: "flex",
                          justifyContent: activeSlide.title_align === "left" ? "flex-start" : "center",
                          margin: "8px 0 10px 0",
                          width: "100%",
                        }}
                      >
                        <div
                          style={{
                            width: selectedBgPreset === "executive_gold" ? "130px" : "96px",
                            height: selectedBgPreset === "executive_gold" ? "2px" : "3.5px",
                            borderRadius: "4px",
                            background: selectedBgPreset === "cyberpunk_neon"
                              ? "linear-gradient(90deg, #f43f5e, #06b6d4)"
                              : selectedBgPreset === "executive_gold"
                              ? "linear-gradient(90deg, #f59e0b, #d97706)"
                              : `linear-gradient(90deg, ${selectedBgConfig?.accent || "#c084fc"}, rgba(255,255,255,0.2))`,
                            boxShadow: selectedBgPreset === "cyberpunk_neon" ? "0 0 10px #f43f5e" : "none",
                          }}
                        />
                      </div>
                    )}

                    {/* POWERPOINT-STYLE SUBTITLE PLACEHOLDER BOX */}
                    <div
                      className="ppt-subtitle-box"
                      style={{
                        width: "100%",
                        textAlign: activeSlide.subtitle_align || (activeSlideIndex === 0 ? "center" : "left"),
                        border: "1.5px dashed transparent",
                        borderRadius: 8,
                        padding: "4px 8px",
                        marginTop: 2,
                        transition: "all 0.15s ease",
                        position: "relative",
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.borderColor = "rgba(192, 132, 252, 0.35)";
                      }}
                      onMouseLeave={(e) => {
                        if (document.activeElement !== e.currentTarget.querySelector(".ppt-sub-input")) {
                          e.currentTarget.style.borderColor = "transparent";
                        }
                      }}
                    >
                      <div
                        className="ppt-sub-input"
                        contentEditable={true}
                        suppressContentEditableWarning={true}
                        onFocus={(e) => {
                          e.currentTarget.parentElement.style.borderColor = "#c084fc";
                          e.currentTarget.parentElement.style.background = "rgba(192, 132, 252, 0.04)";
                        }}
                        onBlur={(e) => {
                          e.currentTarget.parentElement.style.borderColor = "transparent";
                          e.currentTarget.parentElement.style.background = "transparent";
                          handleSlideSubtitleChange(activeSlideIndex, e.target.innerText.trim());
                        }}
                        title="Click to edit slide subtitle inline"
                        style={{
                          fontSize: `clamp(13px, 2.4vw, ${activeSlide.subtitle_font_size || (activeSlideIndex === 0 ? 18 : 16)}px)`,
                          color: activeSlide.subtitle_color || (activeSlideIndex === 0 ? (selectedBgConfig.id === "clean_light" || selectedBgConfig.id === "titanium_white" ? "#334155" : "#e2e8f0") : "inherit"),
                          textAlign: activeSlide.subtitle_align || (activeSlideIndex === 0 ? "center" : "left"),
                          opacity: activeSlide.subtitle ? 0.95 : 0.45,
                          fontWeight: 500,
                          wordBreak: "break-word",
                          outline: "none",
                          cursor: "text",
                          fontStyle: activeSlide.subtitle ? "normal" : "italic",
                          lineHeight: 1.4,
                        }}
                      >
                        {activeSlide.subtitle || "Click to add subtitle"}
                      </div>
                    </div>

                    {/* COVER FOOTER (SLIDE 1) */}
                    {activeSlideIndex === 0 && (
                      <div
                        style={{
                          marginTop: "auto",
                          paddingTop: 14,
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: "center",
                          fontSize: "10.5px",
                          color: "rgba(255,255,255,0.5)",
                          borderTop: "1px solid rgba(255,255,255,0.08)",
                          width: "100%",
                        }}
                      >
                        <span style={{ fontWeight: 600 }}>👤 Executive Presentation</span>
                        <span style={{ opacity: 0.8 }}>📅 {new Date().getFullYear()}</span>
                      </div>
                    )}

                {/* LIVE PLUGINS CONTENT */}
                {hasPlugins ? (
                  <div style={{ flex: isVMiddle || isVBottom ? "0 1 auto" : 1, maxHeight: "100%", overflowY: "auto", margin: "12px 0", display: "flex", flexDirection: "column", gap: 10, paddingRight: 4 }}>
                  {(() => {
                    const plugins = safeArray(activeSlide.plugins);
                    const hasImage = plugins.some((p) => p.type === "image" && (p.data?.url || p.data?.path));
                    const hasText = plugins.some((p) => p.type === "bullets" || p.type === "paragraph");

                    const renderPluginItem = (p, pIdx) => (
                      <div key={pIdx}>
                        {p.type === "subtitle" || p.type === "text" ? (
                          <h3
                            contentEditable={true}
                            suppressContentEditableWarning={true}
                            onBlur={(e) => handlePluginTextChange(activeSlideIndex, pIdx, "text", e.target.innerText)}
                            title="Click to edit inline"
                            style={{ fontSize: p.data?.font_size || (p.type === "subtitle" ? 23 : 29), textAlign: p.data?.alignment || "left", color: p.data?.font_color || p.data?.color || selectedBgConfig?.accent || "#c084fc", margin: "4px 0", outline: "none", cursor: "text" }}
                          >
                            {p.data?.text}
                          </h3>
                        ) : null}

                        {p.type === "paragraph" ? (
                          Array.isArray(p.data?.points) && p.data.points.length > 0 ? (
                            <div style={{ paddingLeft: 4, margin: "6px 0", textAlign: p.data?.alignment || "left", color: p.data?.font_color || p.data?.color || "inherit" }}>
                              {p.data.points.map((pt, bIdx) => (
                                <div key={bIdx} style={{ fontSize: p.data?.font_size || 14, marginBottom: 4, display: "flex", gap: 8, alignItems: "baseline" }}>
                                  <span style={{ fontWeight: 800, color: selectedBgConfig?.accent || "#c084fc", flexShrink: 0 }}>
                                    {formatBulletPrefix(p.data?.bullet_style || "disc", bIdx, p.data.points)}
                                  </span>
                                  <span
                                    contentEditable={true}
                                    suppressContentEditableWarning={true}
                                    onBlur={(e) => {
                                      const newPts = [...p.data.points];
                                      newPts[bIdx] = e.target.innerText;
                                      handlePluginTextChange(activeSlideIndex, pIdx, "points", newPts);
                                    }}
                                    title="Click to edit point inline"
                                    style={{ outline: "none", cursor: "text" }}
                                  >
                                    {pt}
                                  </span>
                                </div>
                              ))}
                            </div>
                          ) : (
                            <p
                              contentEditable={true}
                              suppressContentEditableWarning={true}
                              onBlur={(e) => handlePluginTextChange(activeSlideIndex, pIdx, "text", e.target.innerText)}
                              title="Click to edit inline"
                              style={{ fontSize: p.data?.font_size || 14, textAlign: p.data?.alignment || "left", color: p.data?.font_color || p.data?.color || "inherit", lineHeight: 1.5, opacity: (p.data?.font_color || p.data?.color) ? 1 : 0.9, outline: "none", cursor: "text" }}
                            >
                              {p.data?.text}
                            </p>
                          )
                        ) : null}

                        {p.type === "paragraph_2col" ? (
                          (() => {
                            const items = (Array.isArray(p.data?.items) && p.data.items.length > 0)
                              ? p.data.items
                              : [
                                  { title: p.data?.left_title || "", text: p.data?.left_text || p.data?.text || "Left paragraph content..." },
                                  { title: p.data?.right_title || "", text: p.data?.right_text || "Right paragraph content..." }
                                ];
                            const gridCols = items.length <= 1 ? "1fr" : items.length === 2 ? "1fr 1fr" : items.length === 3 ? "1fr 1fr 1fr" : `repeat(${Math.min(items.length, 4)}, 1fr)`;
                            return (
                              <div style={{ display: "grid", gridTemplateColumns: gridCols, gap: p.data?.column_gap || 14, margin: "8px 0" }}>
                                {items.map((item, colIdx) => (
                                  <div key={colIdx} style={{ background: "rgba(255,255,255,0.03)", padding: 12, borderRadius: 8, border: "1px solid rgba(255,255,255,0.08)" }}>
                                    {(item.title || items.length > 1) && (
                                      <div
                                        contentEditable={true}
                                        suppressContentEditableWarning={true}
                                        onBlur={(e) => {
                                          const newText = e.target.innerText;
                                          const newItems = items.map((it, i) => i === colIdx ? { ...it, title: newText } : it);
                                          handlePluginTextChange(activeSlideIndex, pIdx, "items", newItems);
                                          if (colIdx === 0) handlePluginTextChange(activeSlideIndex, pIdx, "left_title", newText);
                                          if (colIdx === 1) handlePluginTextChange(activeSlideIndex, pIdx, "right_title", newText);
                                        }}
                                        title="Click to edit column title inline"
                                        style={{ fontWeight: 800, fontSize: 13, color: selectedBgConfig?.accent || "#c084fc", marginBottom: 4, outline: "none", cursor: "text" }}
                                      >
                                        {item.title || `Column ${colIdx + 1}`}
                                      </div>
                                    )}

                                    {Array.isArray(item.points) && item.points.length > 0 ? (
                                      <div style={{ display: "flex", flexDirection: "column", gap: 4, marginTop: 4 }}>
                                        {item.points.map((pt, ptIdx) => (
                                          <div key={ptIdx} style={{ display: "flex", gap: 6, alignItems: "baseline", fontSize: p.data?.font_size || 13, color: p.data?.font_color || p.data?.color || "inherit", opacity: 0.9 }}>
                                            <span style={{ color: selectedBgConfig?.accent || "#c084fc", fontWeight: 800, flexShrink: 0 }}>
                                              {formatBulletPrefix(item.bullet_style || p.data?.bullet_style || "disc", ptIdx, item.points)}
                                            </span>
                                            <span
                                              contentEditable={true}
                                              suppressContentEditableWarning={true}
                                              onBlur={(e) => {
                                                const newPts = [...item.points];
                                                newPts[ptIdx] = e.target.innerText;
                                                const newItems = items.map((it, i) => i === colIdx ? { ...it, points: newPts } : it);
                                                handlePluginTextChange(activeSlideIndex, pIdx, "items", newItems);
                                              }}
                                              title="Click to edit point inline"
                                              style={{ outline: "none", cursor: "text", flex: 1 }}
                                            >
                                              {pt}
                                            </span>
                                          </div>
                                        ))}
                                      </div>
                                    ) : (
                                      <p
                                        contentEditable={true}
                                        suppressContentEditableWarning={true}
                                        onBlur={(e) => {
                                          const newText = e.target.innerText;
                                          const newItems = items.map((it, i) => i === colIdx ? { ...it, text: newText } : it);
                                          handlePluginTextChange(activeSlideIndex, pIdx, "items", newItems);
                                          if (colIdx === 0) handlePluginTextChange(activeSlideIndex, pIdx, "left_text", newText);
                                          if (colIdx === 1) handlePluginTextChange(activeSlideIndex, pIdx, "right_text", newText);
                                        }}
                                        title="Click to edit paragraph inline"
                                        style={{ fontSize: p.data?.font_size || 13, lineHeight: 1.5, color: p.data?.font_color || p.data?.color || "inherit", opacity: 0.9, margin: 0, outline: "none", cursor: "text" }}
                                      >
                                        {item.text || `Paragraph content for column ${colIdx + 1}...`}
                                      </p>
                                    )}
                                  </div>
                                ))}
                              </div>
                            );
                          })()
                        ) : null}

                        {p.type === "bullets" ? (
                          <div style={{ paddingLeft: 4, margin: "6px 0", textAlign: p.data?.alignment || p.data?.align || "left", color: p.data?.font_color || p.data?.color || "inherit" }}>
                            {safeArray(p.data?.points).map((pt, bIdx) => (
                              <div
                                key={bIdx}
                                draggable={true}
                                onDragStart={(e) => {
                                  e.dataTransfer.setData("text/plain", `${pIdx},${bIdx}`);
                                  e.dataTransfer.effectAllowed = "move";
                                }}
                                onDragOver={(e) => {
                                  e.preventDefault();
                                  e.dataTransfer.dropEffect = "move";
                                }}
                                onDrop={(e) => {
                                  e.preventDefault();
                                  const raw = e.dataTransfer.getData("text/plain");
                                  const [fromPIdx, fromBIdx] = raw.split(",").map(Number);
                                  if (fromPIdx === pIdx && !isNaN(fromBIdx) && fromBIdx !== bIdx) {
                                    handleMoveBulletPoint(pIdx, fromBIdx, bIdx);
                                  }
                                }}
                                style={{ fontSize: p.data?.font_size || 14, marginBottom: 5, display: "flex", gap: 8, alignItems: "baseline", cursor: "grab" }}
                                title="Drag to reorder bullet point"
                              >
                                <span style={{ fontWeight: 800, color: selectedBgConfig?.accent || "#c084fc", flexShrink: 0, userSelect: "none" }}>
                                  {formatBulletPrefix(p.data?.bullet_style || p.data?.list_style, bIdx, p.data?.points)}
                                </span>
                                <span
                                  contentEditable={true}
                                  suppressContentEditableWarning={true}
                                  onBlur={(e) => handlePluginTextChange(activeSlideIndex, pIdx, "points", e.target.innerText, bIdx)}
                                  title="Click to edit bullet inline"
                                  style={{ outline: "none", cursor: "text", flex: 1 }}
                                >
                                  {pt}
                                </span>
                              </div>
                            ))}
                          </div>
                        ) : null}

                        {p.type === "chart" ? (
                          (() => {
                            const rawLabels = safeArray(p.data?.labels).length ? p.data.labels : (safeArray(p.data?.categories).length ? p.data.categories : ["Category 1", "Category 2", "Category 3"]);
                            const rawValues = safeArray(p.data?.values).map(Number).filter((v) => !isNaN(v));
                            return (
                              <VisualChartPreview
                                data={p.data}
                                onTitleChange={(newTitle) => handlePluginTextChange(activeSlideIndex, pIdx, "title", newTitle)}
                                onLabelChange={(lblIdx, newLbl) => {
                                  const updatedLabels = [...rawLabels];
                                  updatedLabels[lblIdx] = newLbl;
                                  handlePluginTextChange(activeSlideIndex, pIdx, "labels", updatedLabels);
                                  handlePluginTextChange(activeSlideIndex, pIdx, "categories", updatedLabels);
                                }}
                                onValueChange={(valIdx, newVal) => {
                                  const updatedVals = [...rawValues];
                                  updatedVals[valIdx] = Number(newVal) || 0;
                                  handlePluginTextChange(activeSlideIndex, pIdx, "values", updatedVals);
                                }}
                              />
                            );
                          })()
                        ) : null}

                        {p.type === "image" ? (
                          <div style={{ textAlign: p.data?.align || p.data?.alignment || "center", margin: "8px 0" }}>
                            {p.data?.url || p.data?.path ? (
                              <img
                                src={p.data.url || p.data.path}
                                alt="Slide media"
                                style={{
                                  maxHeight: Number(p.data?.img_height || p.data?.height || 180),
                                  borderRadius: 10,
                                  border: "1px solid rgba(255,255,255,0.2)",
                                  transition: "max-height 0.2s ease"
                                }}
                              />
                            ) : null}
                            <div
                              contentEditable={true}
                              suppressContentEditableWarning={true}
                              onBlur={(e) => handlePluginTextChange(activeSlideIndex, pIdx, "caption", e.target.innerText)}
                              title="Click to edit image caption inline"
                              style={{ fontSize: 11, opacity: 0.8, marginTop: 4, outline: "none", cursor: "text", minHeight: "16px" }}
                            >
                              {p.data?.caption || (p.data?.url || p.data?.path ? "Click to add image caption..." : "")}
                            </div>
                          </div>
                        ) : null}

                        {p.type === "stat" ? (
                          <div style={{ display: "flex", alignItems: "baseline", gap: 10, margin: "8px 0" }}>
                            <span
                              contentEditable={true}
                              suppressContentEditableWarning={true}
                              onBlur={(e) => handlePluginTextChange(activeSlideIndex, pIdx, "number", e.target.innerText)}
                              title="Click to edit metric value inline"
                              style={{ fontSize: p.data?.font_size || 36, fontWeight: 900, color: selectedBgConfig?.accent || "#c084fc", outline: "none", cursor: "text" }}
                            >
                              {p.data?.number || "100%"}
                            </span>
                            <span
                              contentEditable={true}
                              suppressContentEditableWarning={true}
                              onBlur={(e) => handlePluginTextChange(activeSlideIndex, pIdx, "label", e.target.innerText)}
                              title="Click to edit metric label inline"
                              style={{ fontSize: 14, fontWeight: 600, opacity: 0.85, outline: "none", cursor: "text" }}
                            >
                              {p.data?.label || "Metric Label"}
                            </span>
                          </div>
                        ) : null}

                        {p.type === "diagram" ? (
                          (() => {
                            const textRaw = p.data?.diagram || p.data?.text || "[Input] ➜ [Processing] ➜ [Output]";
                            const diagType = detectDiagramType(textRaw, p.data?.diagram_type);
                            
                            const rawParts = String(textRaw).split(/\s*(?:➔|➜|->|-->|→|⇒|\||\n|;)\s*/);
                            const steps = [];
                            for (let part of rawParts) {
                              let cleaned = part.replace(/^[\s[(\u2022\-*]+|[\s\])]+$/g, "").trim();
                              if (cleaned.includes("] [")) {
                                const nested = cleaned.split(/\]\s*\[/);
                                for (let n of nested) {
                                  let nc = n.replace(/^[\s[(]+|[\s\])]+$/g, "").trim();
                                  if (nc) steps.push(nc);
                                }
                              } else if (cleaned) {
                                steps.push(cleaned);
                              }
                            }
                            if (!steps.length) {
                              steps.push("Step 1", "Step 2", "Step 3");
                            }

                            const updateDiagramStep = (sIdx, newText) => {
                              const newSteps = [...steps];
                              newSteps[sIdx] = newText;
                              const serialized = newSteps.map((s) => `[${s}]`).join(" ➜ ");
                              handlePluginTextChange(activeSlideIndex, pIdx, "diagram", serialized);
                              handlePluginTextChange(activeSlideIndex, pIdx, "text", serialized);
                            };
                            
                            const headers = {
                              tree: "🌳 TREE HIERARCHY & DECISION BRANCHES",
                              flowchart: "🔄 PROCESS & WORKFLOW DIAGRAM",
                              architecture: "🏛️ SYSTEM ARCHITECTURE STACK",
                              timeline: "📅 TIMELINE & ROADMAP MILESTONES",
                              io_cards: "📥 INPUT  │  ⚙️ PROCESSING  │  📤 OUTPUT",
                              mindmap: "🧠 CONCEPT & CATEGORY MAP",
                              funnel: "🔻 CONVERSION & PIPELINE FUNNEL",
                              cycle: "🔁 CIRCULAR PROCESS & ITERATION LOOP",
                              pyramid: "🔺 HIERARCHY & LAYERED PYRAMID",
                              quadrant: "🧭 2x2 STRATEGIC MATRIX / QUADRANT",
                              comparison: "⚔️ FEATURE & SOLUTION COMPARISON",
                            };
                            const customDiagramTitle = p.data?.title || p.data?.diagram_title || p.data?.header || (activeSlide?.title ? `${activeSlide.title} Process Flow` : null);
                            const headerTitle = customDiagramTitle ? customDiagramTitle.toUpperCase() : (headers[diagType] || "⚙️ SYSTEM ARCHITECTURE & PROCESS FLOW");

                            return (
                              <div style={{ background: `${selectedBgConfig?.accent || "#c084fc"}1f`, border: `1px dashed ${selectedBgConfig?.accent || "#c084fc"}80`, borderRadius: 10, padding: 12, textAlign: p.data?.alignment || "center", margin: "8px 0" }}>
                                <div
                                  contentEditable={true}
                                  suppressContentEditableWarning={true}
                                  onBlur={(e) => {
                                    const newT = e.target.innerText;
                                    handlePluginTextChange(activeSlideIndex, pIdx, "title", newT);
                                    handlePluginTextChange(activeSlideIndex, pIdx, "diagram_title", newT);
                                    handlePluginTextChange(activeSlideIndex, pIdx, "header", newT);
                                  }}
                                  title="Click to edit diagram title inline"
                                  style={{ fontSize: 11, fontWeight: 800, color: selectedBgConfig?.accent || "#c084fc", marginBottom: 8, letterSpacing: 0.5, outline: "none", cursor: "text" }}
                                >
                                  {headerTitle}
                                </div>
                                
                                {diagType === "tree" && (
                                  <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 10, padding: "8px 0" }}>
                                    <div
                                      contentEditable={true}
                                      suppressContentEditableWarning={true}
                                      onBlur={(e) => updateDiagramStep(0, e.target.innerText)}
                                      title="Click to edit root node inline"
                                      style={{ background: `linear-gradient(135deg, ${selectedBgConfig?.accent || "#c084fc"}, #3b82f6)`, color: "#fff", fontWeight: 900, padding: "8px 24px", borderRadius: 12, fontSize: 13, boxShadow: "0 4px 16px rgba(192, 132, 252, 0.4)", border: "1.5px solid rgba(255,255,255,0.3)", outline: "none", cursor: "text" }}
                                    >
                                      🌳 {steps[0] || "Root Concept"}
                                    </div>
                                    {steps.length > 1 && (
                                      <>
                                        <div style={{ width: 2, height: 16, background: selectedBgConfig?.accent || "#c084fc" }} />
                                        <div style={{ display: "flex", gap: 12, flexWrap: "wrap", justifyContent: "center" }}>
                                          {steps.slice(1).map((subStep, sIdx) => (
                                            <div
                                              key={sIdx}
                                              contentEditable={true}
                                              suppressContentEditableWarning={true}
                                              onBlur={(e) => updateDiagramStep(sIdx + 1, e.target.innerText.replace(/^🌿\s*Node\s*\d+:\s*/i, ""))}
                                              title="Click to edit node inline"
                                              style={{ background: "rgba(15,23,42,0.9)", border: `1.5px solid ${selectedBgConfig?.accent || "#c084fc"}`, borderRadius: 10, padding: "8px 14px", fontSize: p.data?.font_size || 11, fontWeight: 700, color: "#fff", boxShadow: "0 4px 10px rgba(0,0,0,0.3)", outline: "none", cursor: "text" }}
                                            >
                                              <span style={{ color: selectedBgConfig?.accent || "#c084fc", marginRight: 4 }}>🌿 Node {sIdx + 1}:</span>
                                              {subStep}
                                            </div>
                                          ))}
                                        </div>
                                      </>
                                    )}
                                  </div>
                                )}

                                {diagType === "flowchart" && (
                                  <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 10, flexWrap: "wrap", padding: "10px 0" }}>
                                    {steps.map((step, sIdx) => {
                                      const isStartEnd = sIdx === 0 || sIdx === steps.length - 1;
                                      return (
                                        <React.Fragment key={sIdx}>
                                          <div
                                            contentEditable={true}
                                            suppressContentEditableWarning={true}
                                            onBlur={(e) => updateDiagramStep(sIdx, e.target.innerText.replace(/^[🏁⚙️]\s*/, ""))}
                                            title="Click to edit flowchart step inline"
                                            style={{
                                              background: isStartEnd ? selectedBgConfig?.accent || "#c084fc" : "rgba(15,23,42,0.85)",
                                              color: isStartEnd ? "#000" : "#fff",
                                              border: `2px solid ${selectedBgConfig?.accent || "#c084fc"}`,
                                              borderRadius: isStartEnd ? "24px" : "8px",
                                              padding: "8px 16px",
                                              fontSize: p.data?.font_size || 12,
                                              fontWeight: 800,
                                              boxShadow: "0 4px 12px rgba(0,0,0,0.4)",
                                              textAlign: "center",
                                              outline: "none",
                                              cursor: "text"
                                            }}
                                          >
                                            {isStartEnd ? `🏁 ${step}` : `⚙️ ${step}`}
                                          </div>
                                          {sIdx < steps.length - 1 && <span style={{ color: selectedBgConfig?.accent || "#c084fc", fontSize: 18, fontWeight: 900 }}>➜</span>}
                                        </React.Fragment>
                                      );
                                    })}
                                  </div>
                                )}

                                {diagType === "architecture" && (
                                  <div style={{ display: "flex", flexDirection: "column", alignItems: "stretch", gap: 8, maxWidth: "90%", margin: "8px auto 0", padding: "4px 0" }}>
                                    {steps.map((step, sIdx) => (
                                      <React.Fragment key={sIdx}>
                                        <div style={{
                                          width: "100%",
                                          background: `linear-gradient(135deg, ${selectedBgConfig?.accent || "#c084fc"}2b 0%, rgba(15,23,42,0.92) 100%)`,
                                          border: `1.5px solid ${selectedBgConfig?.accent || "#c084fc"}`,
                                          borderRadius: "12px",
                                          padding: "10px 18px",
                                          fontSize: p.data?.font_size || 12,
                                          fontWeight: 700,
                                          color: "#fff",
                                          display: "flex",
                                          justifyContent: "space-between",
                                          alignItems: "center",
                                          boxShadow: "0 4px 12px rgba(0,0,0,0.35)",
                                          boxSizing: "border-box",
                                        }}>
                                          <span style={{ fontSize: 10, fontWeight: 900, color: selectedBgConfig?.accent || "#c084fc", background: "rgba(0,0,0,0.5)", border: `1px solid ${selectedBgConfig?.accent || "#c084fc"}60`, padding: "3px 10px", borderRadius: 6, letterSpacing: 0.5 }}>
                                            TIER {sIdx + 1}
                                          </span>
                                          <span
                                            contentEditable={true}
                                            suppressContentEditableWarning={true}
                                            onBlur={(e) => updateDiagramStep(sIdx, e.target.innerText)}
                                            title="Click to edit architecture tier title"
                                            style={{ fontWeight: 800, fontSize: 13, textShadow: "0 1px 4px rgba(0,0,0,0.5)", outline: "none", cursor: "text" }}
                                          >
                                            {step}
                                          </span>
                                          <span style={{ fontSize: 10, fontWeight: 700, opacity: 0.75, color: selectedBgConfig?.accent || "#c084fc" }}>Layer {sIdx + 1}</span>
                                        </div>
                                        {sIdx < steps.length - 1 && (
                                          <div style={{ display: "flex", justifyContent: "center", margin: "-3px 0" }}>
                                            <span style={{ color: selectedBgConfig?.accent || "#c084fc", fontSize: 14, fontWeight: 900 }}>⬇️</span>
                                          </div>
                                        )}
                                      </React.Fragment>
                                    ))}
                                  </div>
                                )}

                                {diagType === "timeline" && (
                                  <div style={{ position: "relative", padding: "20px 10px 10px", margin: "8px 0" }}>
                                    <div style={{ position: "absolute", top: "45px", left: "5%", right: "5%", height: "4px", background: selectedBgConfig?.accent || "#c084fc", borderRadius: 2, zIndex: 1 }} />
                                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 10, position: "relative", zIndex: 2 }}>
                                      {steps.map((step, sIdx) => (
                                        <div key={sIdx} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", textAlign: "center" }}>
                                          <div style={{ width: "24px", height: "24px", borderRadius: "50%", background: selectedBgConfig?.accent || "#c084fc", color: "#000", fontWeight: 900, fontSize: 10, display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 8, boxShadow: `0 0 10px ${selectedBgConfig?.accent || "#c084fc"}` }}>
                                            {sIdx + 1}
                                          </div>
                                          <div style={{ background: "rgba(15,23,42,0.9)", border: "1px solid rgba(255,255,255,0.15)", borderRadius: 8, padding: "6px 8px", width: "100%" }}>
                                            <div style={{ fontSize: 9, color: selectedBgConfig?.accent || "#c084fc", fontWeight: 800, textTransform: "uppercase" }}>MILESTONE {sIdx + 1}</div>
                                            <div
                                              contentEditable={true}
                                              suppressContentEditableWarning={true}
                                              onBlur={(e) => updateDiagramStep(sIdx, e.target.innerText)}
                                              title="Click to edit milestone"
                                              style={{ fontSize: p.data?.font_size || 11, fontWeight: 700, color: "#fff", marginTop: 2, outline: "none", cursor: "text" }}
                                            >
                                              {step}
                                            </div>
                                          </div>
                                        </div>
                                      ))}
                                    </div>
                                  </div>
                                )}

                                {diagType === "io_cards" && (
                                  <div style={{ display: "grid", gridTemplateColumns: steps.length === 3 ? "1fr 1fr 1fr" : `repeat(${Math.min(steps.length, 4)}, 1fr)`, gap: 12, padding: "6px 0" }}>
                                    {steps.map((step, sIdx) => {
                                      const styles = [
                                        { bg: "linear-gradient(135deg, #0284c7 0%, #0f172a 100%)", border: "#38bdf8", title: "📥 INPUT DATA" },
                                        { bg: "linear-gradient(135deg, #7c3aed 0%, #0f172a 100%)", border: "#c084fc", title: "⚙️ PROCESSING" },
                                        { bg: "linear-gradient(135deg, #059669 0%, #0f172a 100%)", border: "#34d399", title: "📤 OUTPUT RESULT" },
                                      ];
                                      const st = styles[sIdx % styles.length];
                                      return (
                                        <div key={sIdx} style={{ background: st.bg, border: `1.5px solid ${st.border}`, borderRadius: 12, padding: 12, textAlign: "center", boxShadow: "0 6px 16px rgba(0,0,0,0.4)" }}>
                                          <div style={{ fontSize: 10, fontWeight: 900, color: st.border, marginBottom: 6, letterSpacing: 0.5 }}>{st.title}</div>
                                          <div
                                            contentEditable={true}
                                            suppressContentEditableWarning={true}
                                            onBlur={(e) => updateDiagramStep(sIdx, e.target.innerText)}
                                            title="Click to edit IO card text"
                                            style={{ fontSize: p.data?.font_size || 12, color: "#fff", fontWeight: 700, outline: "none", cursor: "text" }}
                                          >
                                            {step}
                                          </div>
                                        </div>
                                      );
                                    })}
                                  </div>
                                )}

                                {diagType === "mindmap" && (
                                  <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 10, padding: "8px 0" }}>
                                    <div
                                      contentEditable={true}
                                      suppressContentEditableWarning={true}
                                      onBlur={(e) => updateDiagramStep(0, e.target.innerText.replace(/^🧠\s*/, ""))}
                                      title="Click to edit core concept"
                                      style={{ background: `linear-gradient(135deg, ${selectedBgConfig?.accent || "#c084fc"}, #ec4899)`, color: "#fff", fontWeight: 900, padding: "8px 20px", borderRadius: 24, fontSize: 13, boxShadow: "0 4px 16px rgba(192, 132, 252, 0.4)", outline: "none", cursor: "text" }}
                                    >
                                      🧠 {steps[0] || "Core Concept"}
                                    </div>
                                    {steps.length > 1 && (
                                      <>
                                        <div style={{ width: 2, height: 16, background: selectedBgConfig?.accent || "#c084fc" }} />
                                        <div style={{ display: "flex", gap: 10, flexWrap: "wrap", justifyContent: "center" }}>
                                          {steps.slice(1).map((subStep, sIdx) => (
                                            <div
                                              key={sIdx}
                                              contentEditable={true}
                                              suppressContentEditableWarning={true}
                                              onBlur={(e) => updateDiagramStep(sIdx + 1, e.target.innerText.replace(/^🔹\s*/, ""))}
                                              title="Click to edit branch"
                                              style={{ background: "rgba(15,23,42,0.85)", border: `1.5px solid ${selectedBgConfig?.accent || "#c084fc"}`, borderRadius: 14, padding: "6px 14px", fontSize: p.data?.font_size || 11, fontWeight: 700, color: "#fff", outline: "none", cursor: "text" }}
                                            >
                                              🔹 {subStep}
                                            </div>
                                          ))}
                                        </div>
                                      </>
                                    )}
                                  </div>
                                )}

                                {diagType === "funnel" && (
                                  <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 6, padding: "8px 0" }}>
                                    {steps.map((step, sIdx) => {
                                      const widthPct = Math.max(30, 100 - sIdx * (65 / Math.max(1, steps.length - 1)));
                                      return (
                                        <div
                                          key={sIdx}
                                          contentEditable={true}
                                          suppressContentEditableWarning={true}
                                          onBlur={(e) => updateDiagramStep(sIdx, e.target.innerText.replace(/^STAGE\s*\d+:\s*/i, ""))}
                                          title="Click to edit funnel stage"
                                          style={{
                                            width: `${widthPct}%`,
                                            background: `linear-gradient(135deg, ${selectedBgConfig?.accent || "#c084fc"}ee 0%, ${selectedBgConfig?.accent || "#c084fc"}44 100%)`,
                                            border: "1px solid rgba(255,255,255,0.25)",
                                            borderRadius: 8,
                                            padding: "6px 12px",
                                            fontSize: p.data?.font_size || 11,
                                            fontWeight: 800,
                                            textAlign: "center",
                                            color: "#fff",
                                            boxShadow: "0 4px 10px rgba(0,0,0,0.3)",
                                            outline: "none",
                                            cursor: "text"
                                          }}
                                        >
                                          STAGE {sIdx + 1}: {step}
                                        </div>
                                      );
                                    })}
                                  </div>
                                )}

                                {diagType === "cycle" && (
                                  <div style={{ position: "relative", width: "100%", height: "200px", margin: "10px 0", display: "flex", alignItems: "center", justifyContent: "center" }}>
                                    <svg style={{ position: "absolute", inset: 0, width: "100%", height: "100%", pointerEvents: "none" }}>
                                      <ellipse
                                        cx="50%"
                                        cy="50%"
                                        rx="140"
                                        ry="65"
                                        fill="none"
                                        stroke={selectedBgConfig?.accent || "#c084fc"}
                                        strokeWidth="2.5"
                                        strokeDasharray="6 4"
                                        opacity="0.6"
                                      />
                                    </svg>
                                    <div style={{
                                      position: "absolute",
                                      width: "56px",
                                      height: "56px",
                                      borderRadius: "50%",
                                      background: selectedBgConfig?.accent || "#c084fc",
                                      color: "#000",
                                      display: "flex",
                                      flexDirection: "column",
                                      alignItems: "center",
                                      justifyContent: "center",
                                      fontWeight: 900,
                                      fontSize: 10,
                                      boxShadow: `0 0 16px ${selectedBgConfig?.accent || "#c084fc"}80`,
                                      zIndex: 2,
                                    }}>
                                      <span style={{ fontSize: 16 }}>🔁</span>
                                      <span>LOOP</span>
                                    </div>
                                    {steps.map((step, sIdx) => {
                                      const total = steps.length;
                                      const angle = (2 * Math.PI * sIdx) / total - Math.PI / 2;
                                      const radiusX = 140;
                                      const radiusY = 65;
                                      const x = Math.cos(angle) * radiusX;
                                      const y = Math.sin(angle) * radiusY;

                                      return (
                                        <div
                                          key={sIdx}
                                          contentEditable={true}
                                          suppressContentEditableWarning={true}
                                          onBlur={(e) => updateDiagramStep(sIdx, e.target.innerText.replace(/^\d+[.)]\s*/, ""))}
                                          title="Click to edit cycle step"
                                          style={{
                                            position: "absolute",
                                            transform: `translate(${x}px, ${y}px)`,
                                            background: "rgba(15, 23, 42, 0.95)",
                                            border: `2px solid ${selectedBgConfig?.accent || "#c084fc"}`,
                                            borderRadius: "16px",
                                            padding: "5px 12px",
                                            fontSize: p.data?.font_size || 11,
                                            fontWeight: 700,
                                            color: "#fff",
                                            boxShadow: "0 4px 14px rgba(0,0,0,0.6)",
                                            whiteSpace: "nowrap",
                                            zIndex: 3,
                                            maxWidth: "140px",
                                            textOverflow: "ellipsis",
                                            overflow: "hidden",
                                            outline: "none",
                                            cursor: "text"
                                          }}
                                        >
                                          <span style={{ color: selectedBgConfig?.accent || "#c084fc", marginRight: 4 }}>
                                            {sIdx + 1}.
                                          </span>
                                          {step}
                                        </div>
                                      );
                                    })}
                                  </div>
                                )}

                                {diagType === "pyramid" && (
                                  <div style={{ display: "flex", flexDirection: "column-reverse", alignItems: "center", gap: 6, padding: "8px 0" }}>
                                    {steps.map((step, sIdx) => {
                                      const widthPct = Math.max(30, 40 + sIdx * (60 / Math.max(1, steps.length - 1)));
                                      return (
                                        <div
                                          key={sIdx}
                                          contentEditable={true}
                                          suppressContentEditableWarning={true}
                                          onBlur={(e) => updateDiagramStep(sIdx, e.target.innerText.replace(/^TIER\s*\d+:\s*/i, ""))}
                                          title="Click to edit pyramid tier"
                                          style={{
                                            width: `${widthPct}%`,
                                            background: `linear-gradient(135deg, ${selectedBgConfig?.accent || "#c084fc"}33 0%, ${selectedBgConfig?.accent || "#c084fc"}aa 100%)`,
                                            border: `1.5px solid ${selectedBgConfig?.accent || "#c084fc"}`,
                                            borderRadius: 8,
                                            padding: "6px 12px",
                                            fontSize: p.data?.font_size || 11,
                                            fontWeight: 800,
                                            textAlign: "center",
                                            color: "#fff",
                                            boxShadow: "0 4px 10px rgba(0,0,0,0.3)",
                                            outline: "none",
                                            cursor: "text"
                                          }}
                                        >
                                          TIER {sIdx + 1}: {step}
                                        </div>
                                      );
                                    })}
                                  </div>
                                )}

                                {diagType === "quadrant" && (
                                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, maxWidth: "90%", margin: "6px auto" }}>
                                    {steps.slice(0, 4).map((step, sIdx) => {
                                      const quadNames = ["STRENGTHS / Q1", "WEAKNESSES / Q2", "OPPORTUNITIES / Q3", "THREATS / Q4"];
                                      return (
                                        <div key={sIdx} style={{ background: "rgba(15,23,42,0.9)", border: `1.5px solid ${selectedBgConfig?.accent || "#c084fc"}`, borderRadius: 10, padding: 12, textAlign: "left", boxShadow: "0 4px 12px rgba(0,0,0,0.4)" }}>
                                          <div style={{ fontSize: 10, fontWeight: 900, color: selectedBgConfig?.accent || "#c084fc", marginBottom: 4 }}>
                                            {quadNames[sIdx] || `QUADRANT ${sIdx + 1}`}
                                          </div>
                                          <div
                                            contentEditable={true}
                                            suppressContentEditableWarning={true}
                                            onBlur={(e) => updateDiagramStep(sIdx, e.target.innerText)}
                                            title="Click to edit quadrant content"
                                            style={{ fontSize: p.data?.font_size || 12, color: "#fff", fontWeight: 700, outline: "none", cursor: "text" }}
                                          >
                                            {step}
                                          </div>
                                        </div>
                                      );
                                    })}
                                  </div>
                                )}

                                {diagType === "comparison" && (
                                  <div style={{ display: "grid", gridTemplateColumns: `repeat(${Math.min(steps.length, 3)}, 1fr)`, gap: 12, padding: "6px 0" }}>
                                    {steps.map((step, sIdx) => (
                                      <div key={sIdx} style={{ background: "rgba(15,23,42,0.9)", borderTop: `4px solid ${selectedBgConfig?.accent || "#c084fc"}`, border: "1px solid rgba(255,255,255,0.15)", borderRadius: "8px 8px 12px 12px", padding: 12, textAlign: "center", boxShadow: "0 6px 16px rgba(0,0,0,0.4)" }}>
                                        <div style={{ fontSize: 10, fontWeight: 900, color: selectedBgConfig?.accent || "#c084fc", marginBottom: 6 }}>
                                          ⚔️ OPTION {sIdx + 1}
                                        </div>
                                        <div
                                          contentEditable={true}
                                          suppressContentEditableWarning={true}
                                          onBlur={(e) => updateDiagramStep(sIdx, e.target.innerText)}
                                          title="Click to edit option content"
                                          style={{ fontSize: p.data?.font_size || 12, color: "#fff", fontWeight: 700, outline: "none", cursor: "text" }}
                                        >
                                          {step}
                                        </div>
                                      </div>
                                    ))}
                                  </div>
                                )}
                              </div>
                            );
                          })()
                        ) : null}

                        {p.type === "table" ? (
                          <div style={{ overflowX: "auto", margin: "8px 0" }}>
                            <table style={{ width: "100%", borderCollapse: "collapse", fontSize: p.data?.cell_font_size || 11, background: "rgba(0,0,0,0.35)", borderRadius: 8, overflow: "hidden", border: "1px solid rgba(255,255,255,0.12)" }}>
                              {safeArray(p.data?.headers).length > 0 && (
                                <thead>
                                  <tr style={{ background: p.data?.header_bg || `${selectedBgConfig?.accent || "#c084fc"}33` }}>
                                    {p.data.headers.map((h, hIdx) => (
                                      <th
                                        key={hIdx}
                                        contentEditable={true}
                                        suppressContentEditableWarning={true}
                                        onBlur={(e) => {
                                          const newHeaders = [...p.data.headers];
                                          newHeaders[hIdx] = e.target.innerText;
                                          handlePluginTextChange(activeSlideIndex, pIdx, "headers", newHeaders);
                                        }}
                                        title="Click to edit header cell inline"
                                        style={{ padding: "6px 10px", textAlign: p.data?.align || "left", borderBottom: "1px solid rgba(255,255,255,0.15)", fontWeight: 700, fontSize: p.data?.header_font_size || 12, color: p.data?.header_color || selectedBgConfig?.accent || "#c084fc", outline: "none", cursor: "text" }}
                                      >
                                        {h}
                                      </th>
                                    ))}
                                  </tr>
                                </thead>
                              )}
                              <tbody>
                                {safeArray(p.data?.rows).map((row, rIdx) => (
                                  <tr key={rIdx} style={{ background: p.data?.cell_bg ? p.data.cell_bg : (rIdx % 2 === 1 ? "rgba(255,255,255,0.04)" : "transparent"), borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
                                    {safeArray(row).map((cell, cIdx) => (
                                      <td
                                        key={cIdx}
                                        contentEditable={true}
                                        suppressContentEditableWarning={true}
                                        onBlur={(e) => {
                                          const newRows = safeArray(p.data?.rows).map((r, ri) => {
                                            if (ri !== rIdx) return r;
                                            const newR = [...safeArray(r)];
                                            newR[cIdx] = e.target.innerText;
                                            return newR;
                                          });
                                          handlePluginTextChange(activeSlideIndex, pIdx, "rows", newRows);
                                        }}
                                        title="Click to edit cell inline"
                                        style={{ padding: "6px 10px", textAlign: p.data?.align || "left", color: p.data?.cell_color || "inherit", opacity: p.data?.cell_color ? 1 : 0.9, outline: "none", cursor: "text" }}
                                      >
                                        {cell}
                                      </td>
                                    ))}
                                  </tr>
                                ))}
                              </tbody>
                            </table>
                          </div>
                        ) : null}

                        {p.type === "callout" ? (
                          <div style={{ background: "rgba(255,255,255,0.04)", borderLeft: `4px solid ${selectedBgConfig?.accent || "#c084fc"}`, border: "1px solid rgba(255,255,255,0.1)", borderRadius: "0 10px 10px 0", padding: "12px 16px", margin: "8px 0" }}>
                            <div style={{ fontSize: 11, fontWeight: 800, color: selectedBgConfig?.accent || "#c084fc", marginBottom: 4, display: "flex", alignItems: "center", gap: 6 }}>
                              <span>{p.data?.icon || "💡"}</span>
                              <span
                                contentEditable={true}
                                suppressContentEditableWarning={true}
                                onBlur={(e) => {
                                  const newTitle = e.target.innerText;
                                  handlePluginTextChange(activeSlideIndex, pIdx, "title", newTitle);
                                  handlePluginTextChange(activeSlideIndex, pIdx, "header", newTitle);
                                }}
                                title="Click to edit callout title inline"
                                style={{ outline: "none", cursor: "text", flex: 1 }}
                              >
                                {(p.data?.title || p.data?.header || "KEY TAKEAWAY").toUpperCase()}
                              </span>
                            </div>
                            <div
                              contentEditable={true}
                              suppressContentEditableWarning={true}
                              onBlur={(e) => {
                                const newText = e.target.innerText;
                                handlePluginTextChange(activeSlideIndex, pIdx, "text", newText);
                                handlePluginTextChange(activeSlideIndex, pIdx, "takeaway", newText);
                                handlePluginTextChange(activeSlideIndex, pIdx, "quote", newText);
                              }}
                              title="Click to edit callout text inline"
                              style={{ fontSize: 13, lineHeight: 1.5, opacity: 0.9, outline: "none", cursor: "text" }}
                            >
                              {p.data?.text || p.data?.takeaway || p.data?.quote || "Key takeaway summary..."}
                            </div>
                          </div>
                        ) : null}

                        {p.type === "kpi_grid" ? (
                          (() => {
                            const kpiList = safeArray(p.data?.kpis || p.data?.items || [
                              { number: "$12.5M", label: "ARR Revenue", trend: "+34% ↗" },
                              { number: "99.99%", label: "SLA Uptime", trend: "+0.5% ↗" },
                              { number: "450K", label: "Active Users", trend: "+18% ↗" }
                            ]);
                            const updateKpiItem = (kIdx, field, val) => {
                              const updated = kpiList.map((item, i) => {
                                if (i !== kIdx) return item;
                                if (typeof item === "object") {
                                  return { ...item, [field]: val };
                                }
                                return { number: field === "number" ? val : item, label: field === "label" ? val : `Metric ${i + 1}` };
                              });
                              handlePluginTextChange(activeSlideIndex, pIdx, "kpis", updated);
                              handlePluginTextChange(activeSlideIndex, pIdx, "items", updated);
                            };

                            return (
                              <div style={{ display: "grid", gridTemplateColumns: `repeat(${Math.min(kpiList.length || 3, 4)}, 1fr)`, gap: 12, margin: "10px 0" }}>
                                {kpiList.map((kpi, kIdx) => (
                                  <div key={kIdx} style={{ background: "rgba(15,23,42,0.6)", border: "1px solid rgba(255,255,255,0.12)", borderRadius: 10, padding: 12, textAlign: "center", boxShadow: "0 4px 12px rgba(0,0,0,0.3)" }}>
                                    <div
                                      contentEditable={true}
                                      suppressContentEditableWarning={true}
                                      onBlur={(e) => updateKpiItem(kIdx, "number", e.target.innerText)}
                                      title="Click to edit KPI metric value inline"
                                      style={{ fontSize: 24, fontWeight: 900, color: selectedBgConfig?.accent || "#c084fc", outline: "none", cursor: "text" }}
                                    >
                                      {typeof kpi === "object" ? (kpi.number || kpi.value || "100") : kpi}
                                    </div>
                                    <div
                                      contentEditable={true}
                                      suppressContentEditableWarning={true}
                                      onBlur={(e) => updateKpiItem(kIdx, "label", e.target.innerText)}
                                      title="Click to edit KPI label inline"
                                      style={{ fontSize: 11, fontWeight: 700, opacity: 0.85, marginTop: 2, outline: "none", cursor: "text" }}
                                    >
                                      {typeof kpi === "object" ? (kpi.label || kpi.title || `Metric ${kIdx + 1}`) : `Metric ${kIdx + 1}`}
                                    </div>
                                    {typeof kpi === "object" ? (
                                      <div
                                        contentEditable={true}
                                        suppressContentEditableWarning={true}
                                        onBlur={(e) => updateKpiItem(kIdx, "trend", e.target.innerText)}
                                        title="Click to edit KPI trend inline"
                                        style={{ fontSize: 10, fontWeight: 800, color: ((kpi.trend || "").includes("+") || (kpi.trend || "").includes("↗")) ? "#10b981" : "#f43f5e", marginTop: 4, outline: "none", cursor: "text", minHeight: "14px" }}
                                      >
                                        {kpi.trend || "+0% ↗"}
                                      </div>
                                    ) : null}
                                  </div>
                                ))}
                              </div>
                            );
                          })()
                        ) : null}

                        {p.type === "pros_cons" ? (
                          (() => {
                            const pros = safeArray(p.data?.pros || p.data?.strengths || ["High Scalability", "Low Query Latency"]);
                            const cons = safeArray(p.data?.cons || p.data?.weaknesses || ["Initial Setup Overhead", "Cloud Refactoring Effort"]);

                            const updatePro = (idx, text) => {
                              const updated = [...pros];
                              updated[idx] = text;
                              handlePluginTextChange(activeSlideIndex, pIdx, "pros", updated);
                              handlePluginTextChange(activeSlideIndex, pIdx, "strengths", updated);
                            };

                            const updateCon = (idx, text) => {
                              const updated = [...cons];
                              updated[idx] = text;
                              handlePluginTextChange(activeSlideIndex, pIdx, "cons", updated);
                              handlePluginTextChange(activeSlideIndex, pIdx, "weaknesses", updated);
                            };

                            return (
                              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14, margin: "10px 0" }}>
                                <div style={{ background: "rgba(16, 185, 129, 0.06)", border: "1.5px solid #10b981", borderRadius: 10, padding: 12 }}>
                                  <div
                                    contentEditable={true}
                                    suppressContentEditableWarning={true}
                                    onBlur={(e) => {
                                      handlePluginTextChange(activeSlideIndex, pIdx, "pros_title", e.target.innerText);
                                    }}
                                    title="Click to edit pros title inline"
                                    style={{ fontSize: 12, fontWeight: 800, color: "#10b981", marginBottom: 6, outline: "none", cursor: "text" }}
                                  >
                                    {p.data?.pros_title || "✅ STRENGTHS & ADVANTAGES"}
                                  </div>
                                  {pros.map((pro, prIdx) => (
                                    <div key={prIdx} style={{ fontSize: 11, marginBottom: 4, display: "flex", gap: 6, alignItems: "center" }}>
                                      <span style={{ color: "#10b981" }}>✔</span>
                                      <span
                                        contentEditable={true}
                                        suppressContentEditableWarning={true}
                                        onBlur={(e) => updatePro(prIdx, e.target.innerText)}
                                        title="Click to edit strength point inline"
                                        style={{ outline: "none", cursor: "text", flex: 1 }}
                                      >
                                        {pro}
                                      </span>
                                    </div>
                                  ))}
                                </div>
                                <div style={{ background: "rgba(239, 68, 68, 0.06)", border: "1.5px solid #ef4444", borderRadius: 10, padding: 12 }}>
                                  <div
                                    contentEditable={true}
                                    suppressContentEditableWarning={true}
                                    onBlur={(e) => {
                                      handlePluginTextChange(activeSlideIndex, pIdx, "cons_title", e.target.innerText);
                                    }}
                                    title="Click to edit cons title inline"
                                    style={{ fontSize: 12, fontWeight: 800, color: "#ef4444", marginBottom: 6, outline: "none", cursor: "text" }}
                                  >
                                    {p.data?.cons_title || "❌ CHALLENGES & CONSIDERATIONS"}
                                  </div>
                                  {cons.map((con, cnIdx) => (
                                    <div key={cnIdx} style={{ fontSize: 11, marginBottom: 4, display: "flex", gap: 6, alignItems: "center" }}>
                                      <span style={{ color: "#ef4444" }}>✖</span>
                                      <span
                                        contentEditable={true}
                                        suppressContentEditableWarning={true}
                                        onBlur={(e) => updateCon(cnIdx, e.target.innerText)}
                                        title="Click to edit challenge point inline"
                                        style={{ outline: "none", cursor: "text", flex: 1 }}
                                      >
                                        {con}
                                      </span>
                                    </div>
                                  ))}
                                </div>
                              </div>
                            );
                          })()
                        ) : null}

                        {p.type === "roadmap" ? (
                          (() => {
                            const milestones = safeArray(p.data?.phases || p.data?.milestones || [
                              { phase: "Q1 2026", title: "Architecture", status: "COMPLETED" },
                              { phase: "Q2 2026", title: "Platform Build", status: "IN PROGRESS" },
                              { phase: "Q3 2026", title: "Market Launch", status: "PLANNED" }
                            ]);

                            const updateMilestone = (idx, field, val) => {
                              const updated = milestones.map((m, i) => {
                                if (i !== idx) return m;
                                if (typeof m === "object") {
                                  return { ...m, [field]: val };
                                }
                                return { phase: field === "phase" ? val : `Phase ${i + 1}`, title: field === "title" ? val : m, status: field === "status" ? val : "PLANNED" };
                              });
                              handlePluginTextChange(activeSlideIndex, pIdx, "phases", updated);
                              handlePluginTextChange(activeSlideIndex, pIdx, "milestones", updated);
                            };

                            return (
                              <div style={{ position: "relative", padding: "16px 8px 8px", margin: "10px 0" }}>
                                <div style={{ position: "absolute", top: "36px", left: "4%", right: "4%", height: "3px", background: selectedBgConfig?.accent || "#c084fc", borderRadius: 2, zIndex: 1 }} />
                                <div style={{ display: "grid", gridTemplateColumns: `repeat(${Math.min(milestones.length || 4, 4)}, 1fr)`, gap: 10, position: "relative", zIndex: 2 }}>
                                  {milestones.map((rm, rmIdx) => (
                                    <div key={rmIdx} style={{ display: "flex", flexDirection: "column", alignItems: "center", textAlign: "center" }}>
                                      <div style={{ width: "20px", height: "20px", borderRadius: "50%", background: selectedBgConfig?.accent || "#c084fc", color: "#000", fontWeight: 900, fontSize: 10, display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 8 }}>
                                        {rmIdx + 1}
                                      </div>
                                      <div style={{ background: "rgba(15,23,42,0.85)", border: "1px solid rgba(255,255,255,0.12)", borderRadius: 8, padding: 8, width: "100%" }}>
                                        <div
                                          contentEditable={true}
                                          suppressContentEditableWarning={true}
                                          onBlur={(e) => updateMilestone(rmIdx, "phase", e.target.innerText)}
                                          title="Click to edit phase inline"
                                          style={{ fontSize: 10, color: selectedBgConfig?.accent || "#c084fc", fontWeight: 800, outline: "none", cursor: "text" }}
                                        >
                                          {typeof rm === "object" ? (rm.phase || `Phase ${rmIdx + 1}`) : `Phase ${rmIdx + 1}`}
                                        </div>
                                        <div
                                          contentEditable={true}
                                          suppressContentEditableWarning={true}
                                          onBlur={(e) => updateMilestone(rmIdx, "title", e.target.innerText)}
                                          title="Click to edit milestone title inline"
                                          style={{ fontSize: 11, fontWeight: 700, color: "#fff", marginTop: 2, outline: "none", cursor: "text" }}
                                        >
                                          {typeof rm === "object" ? (rm.title || "Milestone") : rm}
                                        </div>
                                        <div
                                          contentEditable={true}
                                          suppressContentEditableWarning={true}
                                          onBlur={(e) => updateMilestone(rmIdx, "status", e.target.innerText.replace(/[[\]]/g, ""))}
                                          title="Click to edit status inline"
                                          style={{
                                            fontSize: 9,
                                            fontWeight: 800,
                                            marginTop: 4,
                                            outline: "none",
                                            cursor: "text",
                                            color: typeof rm === "object" && rm.status?.includes("COMPLET") ? "#10b981" : (typeof rm === "object" && rm.status?.includes("PROGRESS") ? "#3b82f6" : "#94a3b8")
                                          }}
                                        >
                                          [{typeof rm === "object" && rm.status ? rm.status : "PLANNED"}]
                                        </div>
                                      </div>
                                    </div>
                                  ))}
                                </div>
                              </div>
                            );
                          })()
                        ) : null}

                        {p.type === "code_block" ? (
                          <div style={{ background: "#0f172a", border: "1px solid #334155", borderRadius: 10, overflow: "hidden", margin: "10px 0", boxShadow: "0 6px 16px rgba(0,0,0,0.4)" }}>
                            <div style={{ background: "#1e293b", padding: "4px 12px", display: "flex", justifyContent: "space-between", alignItems: "center", borderBottom: "1px solid #334155" }}>
                              <span
                                contentEditable={true}
                                suppressContentEditableWarning={true}
                                onBlur={(e) => {
                                  handlePluginTextChange(activeSlideIndex, pIdx, "title", e.target.innerText);
                                }}
                                title="Click to edit code file title inline"
                                style={{ fontSize: 10, color: "#94a3b8", outline: "none", cursor: "text" }}
                              >
                                🔴 🟡 🟢 {p.data?.title || "code_snippet.py"} ({p.data?.language || "PYTHON"})
                              </span>
                            </div>
                            <pre style={{ padding: 12, margin: 0, fontFamily: "Consolas, monospace", fontSize: 11, color: "#f8fafc", overflowX: "auto", lineHeight: 1.4 }}>
                              <code
                                contentEditable={true}
                                suppressContentEditableWarning={true}
                                onBlur={(e) => {
                                  handlePluginTextChange(activeSlideIndex, pIdx, "code", e.target.innerText);
                                  handlePluginTextChange(activeSlideIndex, pIdx, "snippet", e.target.innerText);
                                }}
                                title="Click to edit code snippet inline"
                                style={{ outline: "none", cursor: "text", display: "block" }}
                              >
                                {p.data?.code || p.data?.snippet || 'print("Hello Antigravity")'}
                              </code>
                            </pre>
                          </div>
                        ) : null}

                        {p.type === "speaker_card" ? (
                          (() => {
                            const bios = safeArray(p.data?.bio || p.data?.highlights || ["Lead Speaker & Researcher", "Industry Specialist"]);
                            const updateBioPoint = (bIdx, text) => {
                              const updated = [...bios];
                              updated[bIdx] = text;
                              handlePluginTextChange(activeSlideIndex, pIdx, "bio", updated);
                              handlePluginTextChange(activeSlideIndex, pIdx, "highlights", updated);
                            };

                            return (
                              <div style={{ background: "rgba(15,23,42,0.7)", border: `1.5px solid ${selectedBgConfig?.accent || "#c084fc"}44`, borderRadius: 12, padding: 14, display: "flex", gap: 14, alignItems: "center", margin: "10px 0" }}>
                                <div style={{ width: 44, height: 44, borderRadius: "50%", background: selectedBgConfig?.accent || "#c084fc", color: "#000", fontSize: 22, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                                  👤
                                </div>
                                <div style={{ flex: 1 }}>
                                  <div
                                    contentEditable={true}
                                    suppressContentEditableWarning={true}
                                    onBlur={(e) => {
                                      handlePluginTextChange(activeSlideIndex, pIdx, "name", e.target.innerText);
                                      handlePluginTextChange(activeSlideIndex, pIdx, "speaker", e.target.innerText);
                                    }}
                                    title="Click to edit speaker name inline"
                                    style={{ fontSize: 16, fontWeight: 800, color: selectedBgConfig?.accent || "#c084fc", outline: "none", cursor: "text" }}
                                  >
                                    {p.data?.name || p.data?.speaker || "Presenter Name"}
                                  </div>
                                  <div
                                    contentEditable={true}
                                    suppressContentEditableWarning={true}
                                    onBlur={(e) => {
                                      handlePluginTextChange(activeSlideIndex, pIdx, "role", e.target.innerText);
                                      handlePluginTextChange(activeSlideIndex, pIdx, "title", e.target.innerText);
                                    }}
                                    title="Click to edit speaker role inline"
                                    style={{ fontSize: 12, fontWeight: 700, opacity: 0.9, marginTop: 2, outline: "none", cursor: "text" }}
                                  >
                                    {p.data?.role || p.data?.title || "Keynote Speaker"}
                                  </div>
                                  {bios.map((bPt, bIdx) => (
                                    <div key={bIdx} style={{ fontSize: 11, opacity: 0.8, marginTop: 2, display: "flex", gap: 4 }}>
                                      <span>•</span>
                                      <span
                                        contentEditable={true}
                                        suppressContentEditableWarning={true}
                                        onBlur={(e) => updateBioPoint(bIdx, e.target.innerText)}
                                        title="Click to edit speaker bio point inline"
                                        style={{ outline: "none", cursor: "text", flex: 1 }}
                                      >
                                        {bPt}
                                      </span>
                                    </div>
                                  ))}
                                </div>
                              </div>
                            );
                          })()
                        ) : null}
                        {p.type === "shape" ? (
                          <InteractiveShapeItem
                            key={pIdx}
                            plugin={p}
                            pIdx={pIdx}
                            isSelected={selectedPluginIndex === pIdx}
                            onSelect={(idx) => setSelectedPluginIndex(idx)}
                            onUpdateData={handleUpdatePluginData}
                          />
                        ) : null}
                      </div>
                    );

                    const nonShapePlugins = plugins.filter((p) => p.type !== "shape");
                    const shapePlugins = plugins.filter((p) => p.type === "shape");
                    const currentLayout = activeSlide.layout || "title_content";

                    const isTwoCol = currentLayout === "two_content" || currentLayout === "comparison" || (nonShapePlugins.length === 2 && !hasImage && currentLayout !== "content_caption");
                    const isCaptionLayout = (currentLayout === "content_caption" || currentLayout === "picture_caption") && nonShapePlugins.length === 2;

                    if (hasImage && hasText) {
                      const textPlugins = plugins.filter((p) => p.type === "bullets" || p.type === "paragraph" || p.type === "subtitle" || p.type === "text");
                      const imagePlugins = plugins.filter((p) => p.type === "image");
                      const otherPlugins = plugins.filter((p) => p.type !== "bullets" && p.type !== "paragraph" && p.type !== "subtitle" && p.type !== "text" && p.type !== "image" && p.type !== "shape");

                      return (
                        <div style={{ display: "flex", flexDirection: "column", gap: 10, position: "relative" }}>
                          <div style={{ display: "grid", gridTemplateColumns: currentLayout === "picture_caption" ? "0.9fr 1.1fr" : "1.1fr 0.9fr", gap: 16, alignItems: "center" }}>
                            <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                              {textPlugins.map((p, pIdx) => renderPluginItem(p, plugins.indexOf(p)))}
                            </div>
                            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
                              {imagePlugins.map((p, pIdx) => renderPluginItem(p, plugins.indexOf(p)))}
                            </div>
                          </div>
                          {otherPlugins.map((p, pIdx) => renderPluginItem(p, plugins.indexOf(p)))}
                          {shapePlugins.map((p, sIdx) => {
                            const actualIdx = plugins.indexOf(p);
                            return (
                              <InteractiveShapeItem
                                key={`shp-${sIdx}`}
                                plugin={p}
                                pIdx={actualIdx}
                                isSelected={selectedPluginIndex === actualIdx}
                                onSelect={(idx) => setSelectedPluginIndex(idx)}
                                onUpdateData={handleUpdatePluginData}
                              />
                            );
                          })}
                        </div>
                      );
                    }

                    if (isTwoCol && nonShapePlugins.length === 2) {
                      return (
                        <div style={{ display: "flex", flexDirection: "column", gap: 10, position: "relative" }}>
                          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, alignItems: "stretch" }}>
                            <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                              {renderPluginItem(nonShapePlugins[0], plugins.indexOf(nonShapePlugins[0]))}
                            </div>
                            <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                              {renderPluginItem(nonShapePlugins[1], plugins.indexOf(nonShapePlugins[1]))}
                            </div>
                          </div>
                          {shapePlugins.map((p, sIdx) => {
                            const actualIdx = plugins.indexOf(p);
                            return (
                              <InteractiveShapeItem
                                key={`shp-${sIdx}`}
                                plugin={p}
                                pIdx={actualIdx}
                                isSelected={selectedPluginIndex === actualIdx}
                                onSelect={(idx) => setSelectedPluginIndex(idx)}
                                onUpdateData={handleUpdatePluginData}
                              />
                            );
                          })}
                        </div>
                      );
                    }

                    if (isCaptionLayout && nonShapePlugins.length === 2) {
                      return (
                        <div style={{ display: "flex", flexDirection: "column", gap: 10, position: "relative" }}>
                          <div style={{ display: "grid", gridTemplateColumns: "1fr 1.8fr", gap: 16, alignItems: "center" }}>
                            <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                              {renderPluginItem(nonShapePlugins[0], plugins.indexOf(nonShapePlugins[0]))}
                            </div>
                            <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                              {renderPluginItem(nonShapePlugins[1], plugins.indexOf(nonShapePlugins[1]))}
                            </div>
                          </div>
                          {shapePlugins.map((p, sIdx) => {
                            const actualIdx = plugins.indexOf(p);
                            return (
                              <InteractiveShapeItem
                                key={`shp-${sIdx}`}
                                plugin={p}
                                pIdx={actualIdx}
                                isSelected={selectedPluginIndex === actualIdx}
                                onSelect={(idx) => setSelectedPluginIndex(idx)}
                                onUpdateData={handleUpdatePluginData}
                              />
                            );
                          })}
                        </div>
                      );
                    }

                    return (
                      <div style={{ position: "relative" }}>
                        {plugins.filter((p) => p.type !== "shape").map((p, pIdx) => {
                          const actualIdx = plugins.indexOf(p);
                          return renderPluginItem(p, actualIdx);
                        })}
                        {plugins.filter((p) => p.type === "shape").map((p, sIdx) => {
                          const actualIdx = plugins.indexOf(p);
                          return (
                            <InteractiveShapeItem
                              key={`shp-${sIdx}`}
                              plugin={p}
                              pIdx={actualIdx}
                              isSelected={selectedPluginIndex === actualIdx}
                              onSelect={(idx) => setSelectedPluginIndex(idx)}
                              onUpdateData={handleUpdatePluginData}
                            />
                          );
                        })}
                      </div>
                    );
                  })()}
                </div>
                ) : (
                  /* POWERPOINT-STYLE CONTENT PLACEHOLDER BOX */
                  <div
                    style={{
                      flex: 1,
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                      justifyContent: "center",
                      border: "2px dashed rgba(255, 255, 255, 0.18)",
                      borderRadius: 12,
                      padding: "20px 16px",
                      margin: "12px 0 4px",
                      background: "rgba(15, 23, 42, 0.25)",
                      transition: "all 0.2s ease",
                      minHeight: 160,
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.borderColor = "rgba(56, 189, 248, 0.5)";
                      e.currentTarget.style.background = "rgba(56, 189, 248, 0.03)";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.borderColor = "rgba(255, 255, 255, 0.18)";
                      e.currentTarget.style.background = "rgba(15, 23, 42, 0.25)";
                    }}
                  >
                    <div
                      contentEditable={true}
                      suppressContentEditableWarning={true}
                      onBlur={(e) => {
                        const val = e.target.innerText.trim();
                        if (val && val !== "Click to add text / bullet points...") {
                          handleAddPlugin(activeSlideIndex, "paragraph", { text: val });
                        }
                      }}
                      title="Click to type text directly on slide"
                      style={{
                        fontSize: 15,
                        color: "rgba(255, 255, 255, 0.5)",
                        textAlign: "center",
                        marginBottom: 14,
                        outline: "none",
                        cursor: "text",
                        fontStyle: "italic",
                      }}
                    >
                      Click to add text / bullet points...
                    </div>

                    {/* PowerPoint-style Quick Insert Object Tiles */}
                    <div style={{ display: "flex", gap: 8, flexWrap: "wrap", justifyContent: "center", alignItems: "center" }}>
                      {[
                        {
                          icon: "📝",
                          label: "Bullets",
                          color: "#38bdf8",
                          action: () =>
                            handleAddPlugin(activeSlideIndex, "paragraph", {
                              points: ["First strategic takeaway", "Second key point", "Third core takeaway"],
                            }),
                        },
                        {
                          icon: "📊",
                          label: "Chart",
                          color: "#34d399",
                          action: () =>
                            handleAddPlugin(activeSlideIndex, "chart", {
                              chart_type: "bar",
                              title: "Key Metrics",
                              labels: ["Q1", "Q2", "Q3", "Q4"],
                              series: [{ name: "Growth", data: [65, 80, 75, 90] }],
                            }),
                        },
                        {
                          icon: "▨",
                          label: "Table",
                          color: "#fbbf24",
                          action: () =>
                            handleAddPlugin(activeSlideIndex, "table", {
                              headers: ["Category", "Current", "Projected"],
                              rows: [
                                ["Users", "10k", "50k"],
                                ["Revenue", "$120k", "$450k"],
                              ],
                            }),
                        },
                        {
                          icon: "🖼️",
                          label: "Picture",
                          color: "#f43f5e",
                          action: () => handleAddPlugin(activeSlideIndex, "image", { caption: "Slide Image" }),
                        },
                        {
                          icon: "▭",
                          label: "Shape",
                          color: "#c084fc",
                          action: () => handleAddPlugin(activeSlideIndex, "shape", { shape_type: "rectangle", fill: "#38bdf8", border_color: "#ffffff" }),
                        },
                        {
                          icon: "🔢",
                          label: "KPI Grid",
                          color: "#a78bfa",
                          action: () =>
                            handleAddPlugin(activeSlideIndex, "kpi_grid", {
                              items: [
                                { label: "Revenue", value: "$1.2M" },
                                { label: "Users", value: "45k" },
                                { label: "Growth", value: "+85%" },
                              ],
                            }),
                        },
                      ].map((tile, tIdx) => (
                        <button
                          key={tIdx}
                          type="button"
                          onClick={tile.action}
                          style={{
                            display: "flex",
                            flexDirection: "column",
                            alignItems: "center",
                            gap: 4,
                            padding: "8px 12px",
                            background: "rgba(15, 23, 42, 0.75)",
                            border: `1px solid ${tile.color}55`,
                            borderRadius: 8,
                            color: "#fff",
                            cursor: "pointer",
                            transition: "all 0.15s ease",
                            minWidth: 72,
                          }}
                          onMouseEnter={(e) => {
                            e.currentTarget.style.background = `${tile.color}22`;
                            e.currentTarget.style.borderColor = tile.color;
                            e.currentTarget.style.transform = "translateY(-2px)";
                          }}
                          onMouseLeave={(e) => {
                            e.currentTarget.style.background = "rgba(15, 23, 42, 0.75)";
                            e.currentTarget.style.borderColor = `${tile.color}55`;
                            e.currentTarget.style.transform = "none";
                          }}
                        >
                          <span style={{ fontSize: 18 }}>{tile.icon}</span>
                          <span style={{ fontSize: 10, fontWeight: 700, color: tile.color }}>{tile.label}</span>
                        </button>
                      ))}
                    </div>
                  </div>
                )}
                
                {/* SPEAKER NOTES DISPLAY */}
                {activeSlide.plugins?.find((p) => p.type === "notes") ? (
                  <div style={{ background: "rgba(0,0,0,0.3)", padding: 8, borderRadius: 8, fontSize: 11, color: "rgba(255,255,255,0.8)" }}>
                    🗣️ Notes: {activeSlide.plugins.find((p) => p.type === "notes")?.data?.notes}
                  </div>
                ) : null}
              </div>
            </div>
          );
          })()}

               
              {/* EDITABLE FEATURE BLOCKS LIST */}
              <div>


                {safeArray(activeSlide.plugins).map((plugin, pIdx) => (
                  <div key={pIdx} className="feature-block-card">
                    <div className="feature-block-header">
                      <span>
                        {(plugin.type === "subtitle" || plugin.type === "text") && "📝 Text Block"}
                        {plugin.type === "chart" && "📊 Visual Chart Block"}
                        {plugin.type === "image" && "🖼️ Image Block"}
                        {plugin.type === "bullets" && "• Bullet Points Block"}
                        {plugin.type === "paragraph" && "¶ Paragraph Block"}
                        {plugin.type === "paragraph_2col" && "¶¶ Multi-Paragraph / Column Block"}
                        {plugin.type === "stat" && "📊 Key Metric / Stat"}
                        {plugin.type === "diagram" && "⚙️ Diagram Flow Block"}
                        {plugin.type === "table" && "📋 Comparison Table Block"}
                        {plugin.type === "callout" && "💡 Callout Block"}
                        {plugin.type === "kpi_grid" && "🔢 KPI Grid Block"}
                        {plugin.type === "pros_cons" && "⚖️ Pros & Cons Comparison"}
                        {plugin.type === "roadmap" && "🗺️ Roadmap / Timeline Block"}
                        {plugin.type === "code_block" && "💻 Code Block"}
                        {plugin.type === "speaker_card" && "👤 Speaker Profile Card"}
                        {plugin.type === "notes" && "🗣️ Speaker Notes"}
                      </span>
                      <button
                        className="btn-ui danger sm"
                        onClick={() => handleDeletePlugin(activeSlideIndex, pIdx)}
                      >
                        × Remove Feature
                      </button>
                    </div>

                    {/* SUBTITLE / TEXT */}
                    {plugin.type === "subtitle" || plugin.type === "text" ? (
                      <div>
                        <input
                          type="text"
                          value={plugin.data?.text || ""}
                          onChange={(e) => handlePluginTextChange(activeSlideIndex, pIdx, "text", e.target.value)}
                          placeholder="Enter section subtitle text..."
                          style={{ width: "100%", background: "rgba(0,0,0,0.4)", border: "1px solid var(--panel-border)", borderRadius: 8, padding: 8, color: "#fff", fontSize: 13 }}
                        />
                        <FeatureFormattingBar
                          pluginData={plugin.data}
                          onChangeField={(fld, val) => handlePluginTextChange(activeSlideIndex, pIdx, fld, val)}
                          onRefineText={() => handleAIRefine(pIdx, "headline")}
                          isRefining={refiningPluginIdx === pIdx}
                        />
                      </div>
                    ) : null}

                    {/* DIAGRAM FEATURE BLOCK EDITOR */}
                    {plugin.type === "diagram" ? (
                      <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                        {/* 1. VISUAL DIAGRAM STRUCTURE PRESET SELECTOR */}
                        <div style={{ background: "rgba(255,255,255,0.03)", padding: 10, borderRadius: 10, border: "1px solid rgba(255,255,255,0.08)" }}>
                          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
                            <label style={{ fontSize: 11, fontWeight: 700, color: "#c084fc", display: "flex", alignItems: "center", gap: 4 }}>
                              📐 Visual Diagram Layout & Structure Preset:
                            </label>
                            <span style={{ fontSize: 10, opacity: 0.9, color: "#86efac", background: "rgba(34, 197, 94, 0.15)", padding: "2px 8px", borderRadius: 6, border: "1px solid rgba(34, 197, 94, 0.3)", fontWeight: 700 }}>
                              Active: {(plugin.data?.diagram_type || "auto").toUpperCase()}
                            </span>
                          </div>

                          <div className="diagram-chips-row" style={{ display: "flex", flexWrap: "nowrap", overflowX: "auto", gap: 6, alignItems: "center", width: "100%", paddingBottom: 4 }}>
                            {[
                              { id: "flowchart", label: "🔄 Flowchart", defaultText: "[Start Process] ➜ [Data Ingestion] ➜ [Processing Engine] ➜ [Output Result]" },
                              { id: "architecture", label: "🏛️ Architecture Stack", defaultText: "[User & Presentation Layer] ➜ [API Gateway & Business Logic] ➜ [Database & Security Tier]" },
                              { id: "timeline", label: "📅 Timeline & Roadmap", defaultText: "[Phase 1: Setup] ➜ [Phase 2: Core Development] ➜ [Phase 3: Testing] ➜ [Phase 4: Global Launch]" },
                              { id: "tree", label: "🌳 Tree Hierarchy", defaultText: "[Root System Concept] ➜ [Branch A: Frontend Service] ➜ [Branch B: Backend Engine] ➜ [Leaf Node: Database]" },
                              { id: "io_cards", label: "📥 I/O Cards", defaultText: "[Raw Data Ingestion] ➜ [High Performance Computing Engine] ➜ [Analytics & Report Output]" },
                              { id: "mindmap", label: "🧠 Mindmap Core", defaultText: "[Central Core Topic] ➜ [Subtopic A: Strategy] ➜ [Subtopic B: Operations] ➜ [Subtopic C: Metrics]" },
                              { id: "funnel", label: "🔻 Funnel Conversion", defaultText: "[Stage 1: Awareness 100%] ➜ [Stage 2: Interest 60%] ➜ [Stage 3: Decision 30%] ➜ [Stage 4: Action 10%]" },
                              { id: "cycle", label: "🔁 Iteration Cycle", defaultText: "[Requirement Phase] ➜ [Design & Build] ➜ [Validation Test] ➜ [Deployment Loop]" },
                              { id: "pyramid", label: "🔺 Tiered Pyramid", defaultText: "[Foundation Security Layer] ➜ [Infrastructure & Network Tier] ➜ [Executive Peak]" },
                              { id: "quadrant", label: "🧭 2x2 Matrix", defaultText: "[Strengths: High Speed] ➜ [Weaknesses: Storage Limits] ➜ [Opportunities: Growth] ➜ [Threats: Risk]" },
                              { id: "comparison", label: "⚔️ Comparison", defaultText: "[Option A: Cloud Microservices] ➜ [Option B: On-Premises Monolith]" },
                            ].map((diagOpt) => {
                              const textRaw = plugin.data?.diagram || plugin.data?.text || "";
                              const currentType = detectDiagramType(textRaw, plugin.data?.diagram_type);
                              const isActive = currentType === diagOpt.id;
                              return (
                                <button
                                  key={diagOpt.id}
                                  type="button"
                                  className="btn-ui secondary sm"
                                  title={`Switch to ${diagOpt.label} Diagram`}
                                  onClick={() => {
                                    handlePluginTextChange(activeSlideIndex, pIdx, "diagram_type", diagOpt.id);
                                    handlePluginTextChange(activeSlideIndex, pIdx, "diagram", diagOpt.defaultText);
                                    handlePluginTextChange(activeSlideIndex, pIdx, "text", diagOpt.defaultText);
                                  }}
                                  style={{
                                    padding: "6px 12px",
                                    fontSize: 11,
                                    fontWeight: "bold",
                                    cursor: "pointer",
                                    borderRadius: 8,
                                    whiteSpace: "nowrap",
                                    flexShrink: 0,
                                    transition: "all 0.2s ease",
                                    border: isActive ? "1px solid #c084fc" : "1px solid rgba(255,255,255,0.12)",
                                    background: isActive ? "linear-gradient(135deg, rgba(192, 132, 252, 0.35) 0%, rgba(124, 58, 237, 0.4) 100%)" : "rgba(0,0,0,0.3)",
                                    color: isActive ? "#ffffff" : "rgba(255,255,255,0.85)",
                                    boxShadow: isActive ? "0 0 12px rgba(192, 132, 252, 0.4)" : "none",
                                  }}
                                >
                                  {diagOpt.label}
                                </button>
                              );
                            })}
                          </div>
                        </div>

                        {/* 2. DIAGRAM TITLE FIELD */}
                        <div>
                          <label style={{ fontSize: 11, fontWeight: 700, color: "var(--text-muted)", display: "block", marginBottom: 4 }}>Diagram Title / Header:</label>
                          <input
                            type="text"
                            value={plugin.data?.title || plugin.data?.diagram_title || plugin.data?.header || (activeSlide?.title ? `${activeSlide.title} Process Flow` : "")}
                            onChange={(e) => {
                              handlePluginTextChange(activeSlideIndex, pIdx, "title", e.target.value);
                              handlePluginTextChange(activeSlideIndex, pIdx, "diagram_title", e.target.value);
                              handlePluginTextChange(activeSlideIndex, pIdx, "header", e.target.value);
                            }}
                            placeholder={`e.g. ${activeSlide?.title ? activeSlide.title + " Process Flow" : "System Architecture & Process Workflow"}`}
                            style={{ width: "100%", background: "rgba(0,0,0,0.4)", border: "1px solid var(--panel-border)", borderRadius: 8, padding: 8, color: "#fff", fontSize: 13 }}
                          />
                        </div>

                        {/* 3. INTERACTIVE NODE STEP-BY-STEP CHIP BUILDER */}
                        {(() => {
                          const currentTextRaw = plugin.data?.diagram || plugin.data?.text || "";
                          const stepsList = parseDiagramSteps(currentTextRaw);
                          const effectiveSteps = stepsList.length > 0 ? stepsList : ["Step 1", "Step 2"];

                          const updateSteps = (newStepsArr) => {
                            const formatted = newStepsArr.map(s => {
                              const trimmed = s.trim();
                              return trimmed ? (trimmed.startsWith("[") && trimmed.endsWith("]") ? trimmed : `[${trimmed}]`) : "";
                            }).filter(Boolean).join(" ➜ ");
                            handlePluginTextChange(activeSlideIndex, pIdx, "diagram", formatted);
                            handlePluginTextChange(activeSlideIndex, pIdx, "text", formatted);
                          };

                          return (
                            <div style={{ background: "rgba(15, 23, 42, 0.6)", padding: 12, borderRadius: 10, border: "1px solid rgba(192, 132, 252, 0.25)", display: "flex", flexDirection: "column", gap: 10 }}>
                              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                                <label style={{ fontSize: 11, fontWeight: 700, color: "#a78bfa", display: "flex", alignItems: "center", gap: 6 }}>
                                  🧩 Interactive Diagram Step/Node Builder ({effectiveSteps.length} Steps):
                                </label>
                                <button
                                  type="button"
                                  className="btn-ui primary sm"
                                  onClick={() => updateSteps([...effectiveSteps, `Step ${effectiveSteps.length + 1}`])}
                                  style={{ padding: "4px 10px", fontSize: 10, fontWeight: 700, borderRadius: 6, background: "linear-gradient(135deg, #a855f7 0%, #7c3aed 100%)", color: "#fff", border: "none", cursor: "pointer", display: "flex", alignItems: "center", gap: 4 }}
                                >
                                  ➕ Add Step
                                </button>
                              </div>

                              {/* STEP CHIPS LIST */}
                              <div style={{ display: "flex", flexDirection: "column", gap: 6, maxHeight: 220, overflowY: "auto", paddingRight: 4 }}>
                                {effectiveSteps.map((stepVal, sIdx) => (
                                  <div key={sIdx} style={{ display: "flex", alignItems: "center", gap: 6, background: "rgba(255,255,255,0.04)", padding: "4px 8px", borderRadius: 8, border: "1px solid rgba(255,255,255,0.08)" }}>
                                    <span style={{ fontSize: 10, fontWeight: 800, color: "#c084fc", background: "rgba(192, 132, 252, 0.15)", padding: "2px 6px", borderRadius: 4, flexShrink: 0 }}>
                                      #{sIdx + 1}
                                    </span>
                                    <input
                                      type="text"
                                      value={stepVal}
                                      onChange={(e) => {
                                        const updated = [...effectiveSteps];
                                        updated[sIdx] = e.target.value;
                                        updateSteps(updated);
                                      }}
                                      placeholder={`Enter text for step ${sIdx + 1}`}
                                      style={{ flex: 1, background: "rgba(0,0,0,0.5)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 6, padding: "5px 8px", color: "#fff", fontSize: 12 }}
                                    />
                                    {/* MOVE REORDER BUTTONS */}
                                    <button
                                      type="button"
                                      disabled={sIdx === 0}
                                      onClick={() => {
                                        if (sIdx === 0) return;
                                        const updated = [...effectiveSteps];
                                        const temp = updated[sIdx];
                                        updated[sIdx] = updated[sIdx - 1];
                                        updated[sIdx - 1] = temp;
                                        updateSteps(updated);
                                      }}
                                      style={{ opacity: sIdx === 0 ? 0.3 : 0.8, cursor: sIdx === 0 ? "default" : "pointer", background: "transparent", border: "none", color: "#a78bfa", fontSize: 11, padding: "0 2px" }}
                                      title="Move up"
                                    >
                                      ▲
                                    </button>
                                    <button
                                      type="button"
                                      disabled={sIdx === effectiveSteps.length - 1}
                                      onClick={() => {
                                        if (sIdx === effectiveSteps.length - 1) return;
                                        const updated = [...effectiveSteps];
                                        const temp = updated[sIdx];
                                        updated[sIdx] = updated[sIdx + 1];
                                        updated[sIdx + 1] = temp;
                                        updateSteps(updated);
                                      }}
                                      style={{ opacity: sIdx === effectiveSteps.length - 1 ? 0.3 : 0.8, cursor: sIdx === effectiveSteps.length - 1 ? "default" : "pointer", background: "transparent", border: "none", color: "#a78bfa", fontSize: 11, padding: "0 2px" }}
                                      title="Move down"
                                    >
                                      ▼
                                    </button>
                                    {/* DELETE STEP BUTTON */}
                                    <button
                                      type="button"
                                      onClick={() => {
                                        const updated = effectiveSteps.filter((_, idx) => idx !== sIdx);
                                        updateSteps(updated.length > 0 ? updated : ["Step 1"]);
                                      }}
                                      style={{ background: "rgba(239, 68, 68, 0.15)", border: "1px solid rgba(239, 68, 68, 0.3)", borderRadius: 4, color: "#f87171", cursor: "pointer", fontSize: 10, padding: "2px 6px" }}
                                      title="Delete this step"
                                    >
                                      ✕
                                    </button>
                                  </div>
                                ))}
                              </div>
                            </div>
                          );
                        })()}

                        <FeatureFormattingBar
                          pluginData={plugin.data}
                          onChangeField={(fld, val) => handlePluginTextChange(activeSlideIndex, pIdx, fld, val)}
                          onRefineText={() => handleAIRefine(pIdx, "diagram")}
                          isRefining={refiningPluginIdx === pIdx}
                        />
                      </div>
                    ) : null}

                    {/* TABLE */}
                    {plugin.type === "table" ? (
                      <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                        {/* 1. TABLE TITLE / HEADER */}
                        <div>
                          <label style={{ fontSize: 11, fontWeight: 700, color: "var(--text-muted)", display: "block", marginBottom: 4 }}>Table Title / Header:</label>
                          <input
                            type="text"
                            value={plugin.data?.title || ""}
                            onChange={(e) => handlePluginTextChange(activeSlideIndex, pIdx, "title", e.target.value)}
                            placeholder="e.g. Feature & Model Architecture Comparison"
                            style={{ width: "100%", background: "rgba(0,0,0,0.4)", border: "1px solid var(--panel-border)", borderRadius: 8, padding: 8, color: "#fff", fontSize: 13 }}
                          />
                        </div>

                        {/* 2. TABLE VISUAL THEME PRESET SELECTOR & COLOR PICKERS */}
                        <div style={{ background: "rgba(255,255,255,0.03)", padding: "10px 12px", borderRadius: 10, border: "1px solid rgba(255,255,255,0.08)", display: "flex", flexDirection: "column", gap: 8 }}>
                          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 10 }}>
                            <div style={{ display: "flex", alignItems: "center", gap: 8, flex: 1, minWidth: 220 }}>
                              <label style={{ fontSize: 11, fontWeight: 700, color: "#c084fc", whiteSpace: "nowrap" }}>
                                🎨 Table Theme:
                              </label>
                              <select
                                value={plugin.data?.table_theme || "custom"}
                                onChange={(e) => {
                                  const selectedId = e.target.value;
                                  handlePluginTextChange(activeSlideIndex, pIdx, "table_theme", selectedId);
                                  const found = TABLE_THEME_PRESETS.find(t => t.id === selectedId);
                                  if (found) {
                                    handlePluginTextChange(activeSlideIndex, pIdx, "header_bg", found.header_bg);
                                    handlePluginTextChange(activeSlideIndex, pIdx, "header_color", found.header_color);
                                    handlePluginTextChange(activeSlideIndex, pIdx, "cell_bg", found.cell_bg);
                                    handlePluginTextChange(activeSlideIndex, pIdx, "cell_color", found.cell_color);
                                  }
                                }}
                                style={{ flex: 1, background: "rgba(0,0,0,0.5)", border: "1px solid rgba(192, 132, 252, 0.4)", borderRadius: 8, padding: "6px 10px", color: "#fff", fontSize: 12, fontWeight: 600 }}
                              >
                                {TABLE_THEME_PRESETS.map((themePreset) => (
                                  <option key={themePreset.id} value={themePreset.id} style={{ background: "#0f172a", color: "#fff" }}>
                                    {themePreset.icon} {themePreset.name}
                                  </option>
                                ))}
                              </select>
                            </div>

                            {/* COLOR PICKERS ROW */}
                            <div style={{ display: "flex", gap: 12, alignItems: "center", flexWrap: "wrap" }}>
                              <label style={{ fontSize: 10, color: "var(--text-muted)", display: "flex", alignItems: "center", gap: 4 }}>
                                Header BG:
                                <input
                                  type="color"
                                  value={plugin.data?.header_bg || "#8b5cf6"}
                                  onChange={(e) => {
                                    handlePluginTextChange(activeSlideIndex, pIdx, "table_theme", "custom");
                                    handlePluginTextChange(activeSlideIndex, pIdx, "header_bg", e.target.value);
                                  }}
                                  style={{ border: "none", width: 22, height: 22, borderRadius: 4, cursor: "pointer", background: "none" }}
                                />
                              </label>
                              <label style={{ fontSize: 10, color: "var(--text-muted)", display: "flex", alignItems: "center", gap: 4 }}>
                                Header Text:
                                <input
                                  type="color"
                                  value={plugin.data?.header_color || "#ffffff"}
                                  onChange={(e) => {
                                    handlePluginTextChange(activeSlideIndex, pIdx, "table_theme", "custom");
                                    handlePluginTextChange(activeSlideIndex, pIdx, "header_color", e.target.value);
                                  }}
                                  style={{ border: "none", width: 22, height: 22, borderRadius: 4, cursor: "pointer", background: "none" }}
                                />
                              </label>
                              <label style={{ fontSize: 10, color: "var(--text-muted)", display: "flex", alignItems: "center", gap: 4 }}>
                                Rows BG:
                                <input
                                  type="color"
                                  value={plugin.data?.cell_bg || "#1e293b"}
                                  onChange={(e) => {
                                    handlePluginTextChange(activeSlideIndex, pIdx, "table_theme", "custom");
                                    handlePluginTextChange(activeSlideIndex, pIdx, "cell_bg", e.target.value);
                                  }}
                                  style={{ border: "none", width: 22, height: 22, borderRadius: 4, cursor: "pointer", background: "none" }}
                                />
                              </label>
                              <label style={{ fontSize: 10, color: "var(--text-muted)", display: "flex", alignItems: "center", gap: 4 }}>
                                Rows Text:
                                <input
                                  type="color"
                                  value={plugin.data?.cell_color || "#ffffff"}
                                  onChange={(e) => {
                                    handlePluginTextChange(activeSlideIndex, pIdx, "table_theme", "custom");
                                    handlePluginTextChange(activeSlideIndex, pIdx, "cell_color", e.target.value);
                                  }}
                                  style={{ border: "none", width: 22, height: 22, borderRadius: 4, cursor: "pointer", background: "none" }}
                                />
                              </label>
                            </div>
                          </div>
                        </div>

                        {/* 3. INTERACTIVE COLUMN HEADERS BUILDER */}
                        {(() => {
                          const headersArr = safeArray(plugin.data?.headers);
                          const effectiveHeaders = headersArr.length > 0 ? headersArr : ["Column 1", "Column 2", "Column 3"];

                          const updateHeaders = (newHeadersArr) => {
                            handleChartDataChange(activeSlideIndex, pIdx, "headers", newHeadersArr.join(", "));
                            const currentRows = safeArray(plugin.data?.rows);
                            const updatedRows = currentRows.map(r => {
                              const rList = safeArray(r);
                              if (rList.length < newHeadersArr.length) {
                                return [...rList, ...Array(newHeadersArr.length - rList.length).fill("")];
                              }
                              return rList.slice(0, newHeadersArr.length);
                            });
                            handlePluginTextChange(activeSlideIndex, pIdx, "rows", updatedRows);
                          };

                          return (
                            <div style={{ background: "rgba(15, 23, 42, 0.6)", padding: 12, borderRadius: 10, border: "1px solid rgba(192, 132, 252, 0.25)", display: "flex", flexDirection: "column", gap: 10 }}>
                              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                                <label style={{ fontSize: 11, fontWeight: 700, color: "#a78bfa", display: "flex", alignItems: "center", gap: 6 }}>
                                  📋 Table Column Headers ({effectiveHeaders.length} Columns):
                                </label>
                                <button
                                  type="button"
                                  className="btn-ui primary sm"
                                  onClick={() => updateHeaders([...effectiveHeaders, `Column ${effectiveHeaders.length + 1}`])}
                                  style={{ padding: "4px 10px", fontSize: 10, fontWeight: 700, borderRadius: 6, background: "linear-gradient(135deg, #a855f7 0%, #7c3aed 100%)", color: "#fff", border: "none", cursor: "pointer", display: "flex", alignItems: "center", gap: 4 }}
                                >
                                  ➕ Add Column
                                </button>
                              </div>

                              <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                                {effectiveHeaders.map((hVal, hIdx) => (
                                  <div key={hIdx} style={{ display: "flex", alignItems: "center", gap: 4, background: "rgba(255,255,255,0.05)", padding: "4px 6px", borderRadius: 8, border: "1px solid rgba(255,255,255,0.1)" }}>
                                    <span style={{ fontSize: 9, fontWeight: 800, color: "#c084fc", background: "rgba(192, 132, 252, 0.15)", padding: "2px 5px", borderRadius: 4 }}>
                                      Col {hIdx + 1}
                                    </span>
                                    <input
                                      type="text"
                                      value={hVal}
                                      onChange={(e) => {
                                        const updated = [...effectiveHeaders];
                                        updated[hIdx] = e.target.value;
                                        updateHeaders(updated);
                                      }}
                                      style={{ width: 110, background: "rgba(0,0,0,0.5)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 4, padding: "3px 6px", color: "#fff", fontSize: 11 }}
                                    />
                                    <button
                                      type="button"
                                      disabled={effectiveHeaders.length <= 1}
                                      onClick={() => {
                                        const updated = effectiveHeaders.filter((_, idx) => idx !== hIdx);
                                        updateHeaders(updated);
                                      }}
                                      style={{ background: "rgba(239, 68, 68, 0.15)", border: "1px solid rgba(239, 68, 68, 0.3)", borderRadius: 4, color: "#f87171", cursor: "pointer", fontSize: 10, padding: "1px 5px" }}
                                      title="Delete column"
                                    >
                                      ✕
                                    </button>
                                  </div>
                                ))}
                              </div>
                            </div>
                          );
                        })()}

                        {/* 4. INTERACTIVE TABLE DATA ROWS BUILDER GRID */}
                        {(() => {
                          const headersArr = safeArray(plugin.data?.headers);
                          const effectiveHeaders = headersArr.length > 0 ? headersArr : ["Column 1", "Column 2", "Column 3"];
                          const currentRows = safeArray(plugin.data?.rows);
                          const effectiveRows = currentRows.length > 0 ? currentRows : [["Data A1", "Data B1", "Data C1"], ["Data A2", "Data B2", "Data C2"]];

                          const updateCell = (rIdx, cIdx, val) => {
                            const updatedRows = effectiveRows.map((r, idx) => {
                              if (idx !== rIdx) return r;
                              const rowArr = [...safeArray(r)];
                              while (rowArr.length <= cIdx) rowArr.push("");
                              rowArr[cIdx] = val;
                              return rowArr;
                            });
                            handlePluginTextChange(activeSlideIndex, pIdx, "rows", updatedRows);
                          };

                          const addRow = () => {
                            const newRow = Array(effectiveHeaders.length).fill("");
                            newRow[0] = `Row ${effectiveRows.length + 1}`;
                            handlePluginTextChange(activeSlideIndex, pIdx, "rows", [...effectiveRows, newRow]);
                          };

                          const deleteRow = (rIdx) => {
                            const updated = effectiveRows.filter((_, idx) => idx !== rIdx);
                            handlePluginTextChange(activeSlideIndex, pIdx, "rows", updated.length > 0 ? updated : [Array(effectiveHeaders.length).fill("")]);
                          };

                          const moveRow = (rIdx, targetIdx) => {
                            if (targetIdx < 0 || targetIdx >= effectiveRows.length) return;
                            const updated = [...effectiveRows];
                            const temp = updated[rIdx];
                            updated[rIdx] = updated[targetIdx];
                            updated[targetIdx] = temp;
                            handlePluginTextChange(activeSlideIndex, pIdx, "rows", updated);
                          };

                          return (
                            <div style={{ background: "rgba(15, 23, 42, 0.6)", padding: 12, borderRadius: 10, border: "1px solid rgba(192, 132, 252, 0.25)", display: "flex", flexDirection: "column", gap: 10 }}>
                              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                                <label style={{ fontSize: 11, fontWeight: 700, color: "#38bdf8", display: "flex", alignItems: "center", gap: 6 }}>
                                  📑 Interactive Table Data Grid ({effectiveRows.length} Rows):
                                </label>
                                <button
                                  type="button"
                                  className="btn-ui primary sm"
                                  onClick={addRow}
                                  style={{ padding: "4px 10px", fontSize: 10, fontWeight: 700, borderRadius: 6, background: "linear-gradient(135deg, #0284c7 0%, #2563eb 100%)", color: "#fff", border: "none", cursor: "pointer", display: "flex", alignItems: "center", gap: 4 }}
                                >
                                  ➕ Add Table Row
                                </button>
                              </div>

                              {/* ROWS LIST */}
                              <div style={{ display: "flex", flexDirection: "column", gap: 8, maxHeight: 280, overflowY: "auto", paddingRight: 4 }}>
                                {effectiveRows.map((rowItems, rIdx) => (
                                  <div key={rIdx} style={{ background: "rgba(255,255,255,0.03)", padding: 8, borderRadius: 8, border: "1px solid rgba(255,255,255,0.08)", display: "flex", flexDirection: "column", gap: 6 }}>
                                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                                      <span style={{ fontSize: 10, fontWeight: 800, color: "#38bdf8", background: "rgba(56, 189, 248, 0.15)", padding: "2px 8px", borderRadius: 4 }}>
                                        Row #{rIdx + 1}
                                      </span>
                                      <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
                                        <button
                                          type="button"
                                          disabled={rIdx === 0}
                                          onClick={() => moveRow(rIdx, rIdx - 1)}
                                          style={{ opacity: rIdx === 0 ? 0.3 : 0.8, cursor: rIdx === 0 ? "default" : "pointer", background: "transparent", border: "none", color: "#38bdf8", fontSize: 11, padding: "0 4px" }}
                                          title="Move row up"
                                        >
                                          ▲
                                        </button>
                                        <button
                                          type="button"
                                          disabled={rIdx === effectiveRows.length - 1}
                                          onClick={() => moveRow(rIdx, rIdx + 1)}
                                          style={{ opacity: rIdx === effectiveRows.length - 1 ? 0.3 : 0.8, cursor: rIdx === effectiveRows.length - 1 ? "default" : "pointer", background: "transparent", border: "none", color: "#38bdf8", fontSize: 11, padding: "0 4px" }}
                                          title="Move row down"
                                        >
                                          ▼
                                        </button>
                                        <button
                                          type="button"
                                          onClick={() => deleteRow(rIdx)}
                                          style={{ background: "rgba(239, 68, 68, 0.15)", border: "1px solid rgba(239, 68, 68, 0.3)", borderRadius: 4, color: "#f87171", cursor: "pointer", fontSize: 10, padding: "2px 6px" }}
                                          title="Delete this row"
                                        >
                                          ✕ Row
                                        </button>
                                      </div>
                                    </div>

                                    {/* CELLS INPUT GRID */}
                                    <div style={{ display: "grid", gridTemplateColumns: `repeat(${Math.min(4, effectiveHeaders.length)}, 1fr)`, gap: 6 }}>
                                      {effectiveHeaders.map((hName, cIdx) => (
                                        <div key={cIdx} style={{ display: "flex", flexDirection: "column", gap: 2 }}>
                                          <span style={{ fontSize: 9, color: "var(--text-muted)", textOverflow: "ellipsis", overflow: "hidden", whiteSpace: "nowrap" }}>
                                            {hName || `Col ${cIdx + 1}`}:
                                          </span>
                                          <input
                                            type="text"
                                            value={safeArray(rowItems)[cIdx] || ""}
                                            onChange={(e) => updateCell(rIdx, cIdx, e.target.value)}
                                            placeholder={`Value for ${hName}`}
                                            style={{ width: "100%", background: "rgba(0,0,0,0.5)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 6, padding: "5px 8px", color: "#fff", fontSize: 11 }}
                                          />
                                        </div>
                                      ))}
                                    </div>
                                  </div>
                                ))}
                              </div>
                            </div>
                          );
                        })()}

                        <FeatureFormattingBar
                          pluginData={plugin.data}
                          onChangeField={(fld, val) => handlePluginTextChange(activeSlideIndex, pIdx, fld, val)}
                        />
                      </div>
                    ) : null}

                    {/* CHART PLUGIN EDITOR */}
                    {plugin.type === "chart" ? (
                      <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                        {/* 1. VISUAL CHART TYPE PRESET SELECTOR */}
                        <div style={{ background: "rgba(255,255,255,0.03)", padding: 10, borderRadius: 10, border: "1px solid rgba(255,255,255,0.08)" }}>
                          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
                            <label style={{ fontSize: 11, fontWeight: 700, color: "#c084fc", display: "flex", alignItems: "center", gap: 4 }}>
                              📊 Chart Type & Visual Layout:
                            </label>
                            <span style={{ fontSize: 10, opacity: 0.9, color: "#86efac", background: "rgba(34, 197, 94, 0.15)", padding: "2px 8px", borderRadius: 6, border: "1px solid rgba(34, 197, 94, 0.3)", fontWeight: 700 }}>
                              Active: {(plugin.data?.chart_type || "column").toUpperCase()}
                            </span>
                          </div>

                          <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                            {[
                              { id: "column", label: "📊 Column (Vertical)" },
                              { id: "bar_horizontal", label: "📊 Bar (Horizontal)" },
                              { id: "line", label: "📈 Line (Trend)" },
                              { id: "pie", label: "🥧 Pie (Proportion)" },
                              { id: "area", label: "📉 Area (Cumulative)" },
                              { id: "donut", label: "🍩 Donut (Ring)" },
                              { id: "radar", label: "🕸️ Radar (Spider Web)" },
                              { id: "gauge", label: "🎯 Gauge (Progress Dial)" },
                              { id: "waterfall", label: "📶 Waterfall (Flow Delta)" },
                            ].map((cOpt) => {
                              const currentType = (plugin.data?.chart_type || "column").toLowerCase();
                              const isActive = currentType === cOpt.id;
                              return (
                                <button
                                  key={cOpt.id}
                                  type="button"
                                  className="btn-ui secondary sm"
                                  onClick={() => {
                                    handlePluginTextChange(activeSlideIndex, pIdx, "chart_type", cOpt.id);
                                    const defaults = getChartTypeDefaults(cOpt.id, plugin.data?.title || activeSlide?.title);
                                    const currentLabels = safeArray(plugin.data?.labels).join(", ") || safeArray(plugin.data?.categories).join(", ");
                                    if (!currentLabels || currentLabels.includes("Phase 1") || currentLabels.includes("Category") || currentLabels.includes("Point")) {
                                      handleChartDataChange(activeSlideIndex, pIdx, "labels", defaults.categories.join(", "));
                                      handleChartDataChange(activeSlideIndex, pIdx, "categories", defaults.categories.join(", "));
                                      handleChartDataChange(activeSlideIndex, pIdx, "values", defaults.values.join(", "));
                                      handlePluginTextChange(activeSlideIndex, pIdx, "series_name", defaults.series_name);
                                    }
                                  }}
                                  style={{
                                    padding: "5px 10px",
                                    fontSize: 11,
                                    fontWeight: "bold",
                                    cursor: "pointer",
                                    borderRadius: 8,
                                    whiteSpace: "nowrap",
                                    border: isActive ? "1px solid #c084fc" : "1px solid rgba(255,255,255,0.12)",
                                    background: isActive ? "linear-gradient(135deg, rgba(192, 132, 252, 0.35) 0%, rgba(124, 58, 237, 0.4) 100%)" : "rgba(0,0,0,0.3)",
                                    color: isActive ? "#ffffff" : "rgba(255,255,255,0.85)",
                                    boxShadow: isActive ? "0 0 10px rgba(192, 132, 252, 0.4)" : "none",
                                    transition: "all 0.2s ease",
                                  }}
                                >
                                  {cOpt.label}
                                </button>
                              );
                            })}
                          </div>
                        </div>

                        {/* 2. CHART TITLE & SERIES LEGEND NAME */}
                        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
                          <div>
                            <label style={{ fontSize: 11, fontWeight: 700, color: "var(--text-muted)", display: "block", marginBottom: 4 }}>Chart Title / Header:</label>
                            <input
                              type="text"
                              value={plugin.data?.title || ""}
                              onChange={(e) => handlePluginTextChange(activeSlideIndex, pIdx, "title", e.target.value)}
                              placeholder="e.g. Performance Data & Metrics"
                              style={{ width: "100%", background: "rgba(0,0,0,0.4)", border: "1px solid var(--panel-border)", borderRadius: 8, padding: 8, color: "#fff", fontSize: 12 }}
                            />
                          </div>
                          <div>
                            <label style={{ fontSize: 11, fontWeight: 700, color: "var(--text-muted)", display: "block", marginBottom: 4 }}>Series Legend Name:</label>
                            <input
                              type="text"
                              value={plugin.data?.series_name || ""}
                              onChange={(e) => handlePluginTextChange(activeSlideIndex, pIdx, "series_name", e.target.value)}
                              placeholder="e.g. AI Adoption Rate (%)"
                              style={{ width: "100%", background: "rgba(0,0,0,0.4)", border: "1px solid var(--panel-border)", borderRadius: 8, padding: 8, color: "#fff", fontSize: 12 }}
                            />
                          </div>
                        </div>

                        {/* 3. INTERACTIVE DATA POINTS BUILDER (SYNCED PAIRING 🎯) */}
                        {(() => {
                          const currentType = (plugin.data?.chart_type || "column").toLowerCase();
                          const defaults = getChartTypeDefaults(currentType, plugin.data?.title || activeSlide?.title);
                          const rawLabels = safeArray(plugin.data?.labels).length ? safeArray(plugin.data?.labels) : (safeArray(plugin.data?.categories).length ? safeArray(plugin.data?.categories) : defaults.categories);
                          const rawValues = safeArray(plugin.data?.values).length ? safeArray(plugin.data?.values) : defaults.values;
                          const count = Math.max(rawLabels.length, rawValues.length, 1);

                          const items = [];
                          for (let i = 0; i < count; i++) {
                            items.push({
                              label: rawLabels[i] !== undefined ? String(rawLabels[i]) : (defaults.categories[i] || `Category ${i + 1}`),
                              value: rawValues[i] !== undefined ? String(rawValues[i]) : String(defaults.values[i] !== undefined ? defaults.values[i] : (i + 1) * 20),
                            });
                          }

                          const syncData = (newItems) => {
                            const newLabelsStr = newItems.map(it => it.label).join(", ");
                            const newValuesStr = newItems.map(it => it.value).join(", ");
                            handleChartDataChange(activeSlideIndex, pIdx, "labels", newLabelsStr);
                            handleChartDataChange(activeSlideIndex, pIdx, "categories", newLabelsStr);
                            handleChartDataChange(activeSlideIndex, pIdx, "values", newValuesStr);
                          };

                          return (
                            <div style={{ background: "rgba(15, 23, 42, 0.6)", padding: 12, borderRadius: 10, border: "1px solid rgba(192, 132, 252, 0.25)", display: "flex", flexDirection: "column", gap: 10 }}>
                              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                                <label style={{ fontSize: 11, fontWeight: 700, color: "#38bdf8", display: "flex", alignItems: "center", gap: 6 }}>
                                  📈 Synced Chart Data Points ({items.length} Points):
                                </label>
                                <div style={{ display: "flex", gap: 6, alignItems: "center" }}>
                                  <button
                                    type="button"
                                    className="btn-ui secondary sm"
                                    onClick={() => {
                                      const defs = getChartTypeDefaults(currentType, plugin.data?.title || activeSlide?.title);
                                      handleChartDataChange(activeSlideIndex, pIdx, "labels", defs.categories.join(", "));
                                      handleChartDataChange(activeSlideIndex, pIdx, "categories", defs.categories.join(", "));
                                      handleChartDataChange(activeSlideIndex, pIdx, "values", defs.values.join(", "));
                                      handlePluginTextChange(activeSlideIndex, pIdx, "series_name", defs.series_name);
                                    }}
                                    style={{ padding: "4px 8px", fontSize: 10, fontWeight: 700, borderRadius: 6, background: "rgba(255,255,255,0.08)", color: "#86efac", border: "1px solid rgba(134, 239, 172, 0.3)", cursor: "pointer", display: "flex", alignItems: "center", gap: 4 }}
                                    title="Apply topic & layout specific defaults for this chart type"
                                  >
                                    ✨ Preset Defaults
                                  </button>
                                  <button
                                    type="button"
                                    className="btn-ui secondary sm"
                                    onClick={() => handleAIRefine(pIdx, "chart")}
                                    disabled={refiningPluginIdx === pIdx}
                                    style={{ padding: "4px 10px", fontSize: 10, fontWeight: 700, borderRadius: 6, background: "linear-gradient(135deg, #c084fc 0%, #3b82f6 100%)", color: "#fff", border: "none", cursor: "pointer", display: "flex", alignItems: "center", gap: 4 }}
                                    title="Fetch authentic real-world topic metrics from AI"
                                  >
                                    {refiningPluginIdx === pIdx ? "⏳ Fetching Real Data..." : "🌐 Fetch Real AI Metrics Data"}
                                  </button>
                                  <button
                                    type="button"
                                    className="btn-ui primary sm"
                                    onClick={() => syncData([...items, { label: `Point ${items.length + 1}`, value: "50" }])}
                                    style={{ padding: "4px 10px", fontSize: 10, fontWeight: 700, borderRadius: 6, background: "linear-gradient(135deg, #0284c7 0%, #2563eb 100%)", color: "#fff", border: "none", cursor: "pointer", display: "flex", alignItems: "center", gap: 4 }}
                                  >
                                    ➕ Add Data Point
                                  </button>
                                </div>
                              </div>

                              <div style={{ display: "flex", flexDirection: "column", gap: 6, maxHeight: 220, overflowY: "auto", paddingRight: 4 }}>
                                {items.map((item, idx) => (
                                  <div key={idx} style={{ display: "flex", alignItems: "center", gap: 8, background: "rgba(255,255,255,0.03)", padding: "6px 10px", borderRadius: 8, border: "1px solid rgba(255,255,255,0.08)" }}>
                                    <span style={{ fontSize: 10, fontWeight: 800, color: "#38bdf8", background: "rgba(56, 189, 248, 0.15)", padding: "2px 6px", borderRadius: 4, flexShrink: 0 }}>
                                      #{idx + 1}
                                    </span>
                                    <div style={{ flex: 1, display: "flex", alignItems: "center", gap: 6 }}>
                                      <input
                                        type="text"
                                        value={item.label}
                                        onChange={(e) => {
                                          const updated = [...items];
                                          updated[idx].label = e.target.value;
                                          syncData(updated);
                                        }}
                                        placeholder="Category / X-Axis Label"
                                        style={{ flex: 1, background: "rgba(0,0,0,0.5)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 6, padding: "5px 8px", color: "#fff", fontSize: 11 }}
                                      />
                                      <span style={{ fontSize: 11, color: "var(--text-muted)", fontWeight: 700 }}>➡</span>
                                      <input
                                        type="text"
                                        value={item.value}
                                        onChange={(e) => {
                                          const updated = [...items];
                                          updated[idx].value = e.target.value;
                                          syncData(updated);
                                        }}
                                        placeholder="Value (Numeric Y-Axis)"
                                        style={{ width: 100, background: "rgba(0,0,0,0.5)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 6, padding: "5px 8px", color: "#86efac", fontSize: 11, fontWeight: 700 }}
                                      />
                                    </div>
                                    <div style={{ display: "flex", alignItems: "center", gap: 2 }}>
                                      <button
                                        type="button"
                                        disabled={idx === 0}
                                        onClick={() => {
                                          if (idx === 0) return;
                                          const updated = [...items];
                                          const temp = updated[idx];
                                          updated[idx] = updated[idx - 1];
                                          updated[idx - 1] = temp;
                                          syncData(updated);
                                        }}
                                        style={{ opacity: idx === 0 ? 0.3 : 0.8, cursor: idx === 0 ? "default" : "pointer", background: "transparent", border: "none", color: "#38bdf8", fontSize: 11, padding: "0 2px" }}
                                        title="Move point up"
                                      >
                                        ▲
                                      </button>
                                      <button
                                        type="button"
                                        disabled={idx === items.length - 1}
                                        onClick={() => {
                                          if (idx === items.length - 1) return;
                                          const updated = [...items];
                                          const temp = updated[idx];
                                          updated[idx] = updated[idx + 1];
                                          updated[idx + 1] = temp;
                                          syncData(updated);
                                        }}
                                        style={{ opacity: idx === items.length - 1 ? 0.3 : 0.8, cursor: idx === items.length - 1 ? "default" : "pointer", background: "transparent", border: "none", color: "#38bdf8", fontSize: 11, padding: "0 2px" }}
                                        title="Move point down"
                                      >
                                        ▼
                                      </button>
                                      <button
                                        type="button"
                                        disabled={items.length <= 1}
                                        onClick={() => {
                                          const updated = items.filter((_, i) => i !== idx);
                                          syncData(updated);
                                        }}
                                        style={{ background: "rgba(239, 68, 68, 0.15)", border: "1px solid rgba(239, 68, 68, 0.3)", borderRadius: 4, color: "#f87171", cursor: "pointer", fontSize: 10, padding: "2px 6px" }}
                                        title="Delete data point"
                                      >
                                        ✕
                                      </button>
                                    </div>
                                  </div>
                                ))}
                              </div>
                            </div>
                          );
                        })()}

                        {/* 4. ADVANCED DISPLAY & LEGEND CONTROLS */}
                        <div style={{ display: "flex", gap: 14, alignItems: "center", flexWrap: "wrap", background: "rgba(255,255,255,0.03)", padding: "8px 12px", borderRadius: 8, border: "1px solid rgba(255,255,255,0.08)" }}>
                          <span style={{ fontSize: 10, fontWeight: 700, color: "#c084fc", width: "100%" }}>⚙️ Advanced Chart Display Options:</span>

                          <label style={{ fontSize: 11, color: "#fff", display: "flex", alignItems: "center", gap: 6, cursor: "pointer" }}>
                            <input
                              type="checkbox"
                              checked={plugin.data?.show_data_labels !== false}
                              onChange={(e) => handlePluginTextChange(activeSlideIndex, pIdx, "show_data_labels", e.target.checked)}
                            />
                            Show Value Labels
                          </label>

                          <label style={{ fontSize: 11, color: "#fff", display: "flex", alignItems: "center", gap: 6, cursor: "pointer" }}>
                            <input
                              type="checkbox"
                              checked={plugin.data?.show_legend !== false}
                              onChange={(e) => handlePluginTextChange(activeSlideIndex, pIdx, "show_legend", e.target.checked)}
                            />
                            Show Legend
                          </label>

                          <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                            <label style={{ fontSize: 10, color: "var(--text-muted)" }}>Legend Pos:</label>
                            <select
                              value={plugin.data?.legend_position || "right"}
                              onChange={(e) => handlePluginTextChange(activeSlideIndex, pIdx, "legend_position", e.target.value)}
                              style={{ background: "rgba(0,0,0,0.5)", border: "1px solid var(--panel-border)", borderRadius: 6, padding: "3px 6px", color: "#fff", fontSize: 11 }}
                            >
                              <option value="right">Right</option>
                              <option value="top">Top</option>
                              <option value="bottom">Bottom</option>
                              <option value="left">Left</option>
                            </select>
                          </div>
                        </div>

                        <FeatureFormattingBar
                          pluginData={plugin.data}
                          onChangeField={(fld, val) => handlePluginTextChange(activeSlideIndex, pIdx, fld, val)}
                          onRefineText={() => handleAIRefine(pIdx, "chart")}
                          isRefining={refiningPluginIdx === pIdx}
                        />
                      </div>
                    ) : null}

                    {/* IMAGE */}
                    {plugin.type === "image" ? (
                      <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                        <div>
                          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 6, gap: 6, flexWrap: "wrap" }}>
                            <label style={{ fontSize: 11, color: "var(--text-muted)" }}>Image URL / File Source:</label>
                            <div style={{ display: "flex", gap: 6, alignItems: "center" }}>
                              <label
                                className="btn-ui secondary sm"
                                style={{ fontSize: 10, padding: "3px 8px", cursor: "pointer", display: "inline-flex", alignItems: "center", gap: 4 }}
                                title="Upload Custom Image File from Device"
                              >
                                Upload Image
                                <input
                                  type="file"
                                  accept="image/*"
                                  style={{ display: "none" }}
                                  onChange={(e) => handleImageFileUpload(e, pIdx)}
                                />
                              </label>
                              <button
                                type="button"
                                className="btn-ui primary sm"
                                style={{ fontSize: 10, padding: "3px 8px", background: "linear-gradient(135deg, #c084fc, #ec4899)" }}
                                onClick={() => handleGenerateAIImage(pIdx, plugin.data?.caption)}
                                disabled={generatingAiImgIdx === pIdx}
                              >
                                {generatingAiImgIdx === pIdx ? "⏳ Generating..." : "🎨 Generate AI Image"}
                              </button>
                              <button
                                type="button"
                                className="btn-ui secondary sm"
                                style={{ fontSize: 10, padding: "3px 8px" }}
                                onClick={() => handleAutoUnsplashFetch(pIdx, plugin.data?.caption)}
                              >
                                ⚡ Unsplash
                              </button>
                            </div>
                          </div>
                          <input
                            type="text"
                            value={plugin.data?.url || plugin.data?.path || ""}
                            onChange={(e) => {
                              handlePluginTextChange(activeSlideIndex, pIdx, "url", e.target.value);
                              handlePluginTextChange(activeSlideIndex, pIdx, "path", e.target.value);
                            }}
                            placeholder="https://images.unsplash.com/..."
                            style={{ width: "100%", background: "rgba(0,0,0,0.4)", border: "1px solid var(--panel-border)", borderRadius: 8, padding: 8, color: "#fff", fontSize: 12 }}
                          />
                        </div>

                        <div>
                          <label style={{ fontSize: 11, color: "var(--text-muted)" }}>Image Caption / Title:</label>
                          <input
                            type="text"
                            value={plugin.data?.caption || ""}
                            onChange={(e) => handlePluginTextChange(activeSlideIndex, pIdx, "caption", e.target.value)}
                            placeholder="e.g. AI Architecture Diagram"
                            style={{ width: "100%", background: "rgba(0,0,0,0.4)", border: "1px solid var(--panel-border)", borderRadius: 8, padding: 8, color: "#fff", fontSize: 12 }}
                          />
                        </div>

                        {/* IMAGE SIZE INCREASE / DECREASE & PRESET CONTROLS 🔍 */}
                        <div style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 10, padding: 10, display: "flex", flexDirection: "column", gap: 8 }}>
                          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 8 }}>
                            <label style={{ fontSize: 11, fontWeight: 700, color: "#c084fc", display: "flex", alignItems: "center", gap: 4 }}>
                              🖼️ Image Size (Height):
                            </label>
                            <span style={{ fontSize: 11, fontWeight: 800, color: "#86efac", background: "rgba(34,197,94,0.15)", padding: "2px 8px", borderRadius: 6, border: "1px solid rgba(34,197,94,0.3)" }}>
                              {plugin.data?.img_height || plugin.data?.height || 180}px
                            </span>
                          </div>

                          <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap" }}>
                            {/* DECREASE & INCREASE BUTTONS */}
                            <button
                              type="button"
                              className="btn-ui secondary sm"
                              title="Decrease Image Size (-20px)"
                              onClick={() => {
                                const curr = Number(plugin.data?.img_height || plugin.data?.height || 180);
                                const next = Math.max(80, curr - 20);
                                handlePluginTextChange(activeSlideIndex, pIdx, "img_height", next);
                                handlePluginTextChange(activeSlideIndex, pIdx, "height", next);
                              }}
                              style={{ padding: "4px 10px", fontSize: 12, fontWeight: "bold", cursor: "pointer" }}
                            >
                              ➖
                            </button>

                            <button
                              type="button"
                              className="btn-ui secondary sm"
                              title="Increase Image Size (+20px)"
                              onClick={() => {
                                const curr = Number(plugin.data?.img_height || plugin.data?.height || 180);
                                const next = Math.min(400, curr + 20);
                                handlePluginTextChange(activeSlideIndex, pIdx, "img_height", next);
                                handlePluginTextChange(activeSlideIndex, pIdx, "height", next);
                              }}
                              style={{ padding: "4px 10px", fontSize: 12, fontWeight: "bold", cursor: "pointer" }}
                            >
                              ➕
                            </button>

                            {/* PRESET SIZES */}
                            <div style={{ display: "flex", gap: 4, alignItems: "center", marginLeft: "auto" }}>
                              {[
                                { label: "S", size: 120, title: "Small (120px)" },
                                { label: "M", size: 180, title: "Medium (180px)" },
                                { label: "L", size: 240, title: "Large (240px)" },
                                { label: "XL", size: 300, title: "Extra Large (300px)" },
                                { label: "Max", size: 360, title: "Full Size (360px)" },
                              ].map((preset) => {
                                const activeSize = Number(plugin.data?.img_height || plugin.data?.height || 180);
                                const isActive = activeSize === preset.size;
                                return (
                                  <button
                                    key={preset.label}
                                    type="button"
                                    className="btn-ui secondary sm"
                                    title={preset.title}
                                    onClick={() => {
                                      handlePluginTextChange(activeSlideIndex, pIdx, "img_height", preset.size);
                                      handlePluginTextChange(activeSlideIndex, pIdx, "height", preset.size);
                                    }}
                                    style={{
                                      padding: "3px 8px",
                                      fontSize: 11,
                                      fontWeight: "bold",
                                      borderColor: isActive ? "#c084fc" : "rgba(255,255,255,0.15)",
                                      background: isActive ? "rgba(192, 132, 252, 0.25)" : "rgba(0,0,0,0.3)",
                                      color: isActive ? "#c084fc" : "#fff",
                                      cursor: "pointer"
                                    }}
                                  >
                                    {preset.label}
                                  </button>
                                );
                              })}
                            </div>
                          </div>

                          {/* SLIDER CONTROLLER */}
                          <div style={{ display: "flex", alignItems: "center", gap: 10, marginTop: 2 }}>
                            <input
                              type="range"
                              min="80"
                              max="400"
                              step="10"
                              value={Number(plugin.data?.img_height || plugin.data?.height || 180)}
                              onChange={(e) => {
                                const val = Number(e.target.value);
                                handlePluginTextChange(activeSlideIndex, pIdx, "img_height", val);
                                handlePluginTextChange(activeSlideIndex, pIdx, "height", val);
                              }}
                              style={{ flex: 1, accentColor: "#c084fc", cursor: "pointer" }}
                            />
                          </div>
                        </div>

                        <FeatureFormattingBar
                          pluginData={plugin.data}
                          onChangeField={(fld, val) => handlePluginTextChange(activeSlideIndex, pIdx, fld, val)}
                          isRefining={refiningPluginIdx === pIdx}
                        />
                      </div>
                    ) : null}

                    {/* BULLETS / INDEXING EDITOR */}
                    {plugin.type === "bullets" ? (
                      <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                        <div>
                          <div style={{ display: "flex", flexWrap: "wrap", gap: 6, alignItems: "center" }}>
                            {[
                              { style: "bullet", symbol: "•", title: "Standard Bullet Dots" },
                              { style: "number", symbol: "1.", title: "Numbered List (1, 2, 3)" },
                              { style: "alpha", symbol: "A.", title: "Alphabetical List (A, B, C)" },
                              { style: "roman", symbol: "I.", title: "Roman Numerals List (I, II, III)" },
                              { style: "check", symbol: "✔", title: "Checklist Items" },
                              { style: "star", symbol: "✦", title: "Star Highlight List" },
                              { style: "arrow", symbol: "➜", title: "Arrow Pointer List" },
                              { style: "diamond", symbol: "🔹", title: "Diamond Bullet Points" },
                            ].map((opt) => {
                              const rawStyle = plugin.data?.bullet_style || plugin.data?.list_style || "auto";
                              const resolvedStyle = detectBulletStyle(plugin.data?.points, rawStyle);
                              const isActive = resolvedStyle === opt.style;
                              return (
                                <button
                                  key={opt.style}
                                  type="button"
                                  className="btn-ui secondary sm"
                                  title={opt.title}
                                  onClick={() => {
                                    handlePluginTextChange(activeSlideIndex, pIdx, "bullet_style", opt.style);
                                    handlePluginTextChange(activeSlideIndex, pIdx, "list_style", opt.style);
                                  }}
                                  style={{
                                    padding: "4px 10px",
                                    fontSize: 13,
                                    fontWeight: "bold",
                                    cursor: "pointer",
                                    borderColor: isActive ? "#c084fc" : "rgba(255,255,255,0.15)",
                                    background: isActive ? "rgba(192, 132, 252, 0.15)" : "rgba(0,0,0,0.3)",
                                    color: isActive ? "#c084fc" : "#fff",
                                    boxShadow: isActive ? "0 0 8px rgba(192, 132, 252, 0.3)" : "none"
                                  }}
                                >
                                  {opt.symbol}
                                </button>
                              );
                            })}
                          </div>
                        </div>

                        {safeArray(plugin.data?.points).map((bullet, bIdx) => (
                          <div key={bIdx} style={{ display: "flex", gap: 8, alignItems: "center" }}>
                            <span style={{ color: "#c084fc", fontWeight: 800, minWidth: 24, textAlign: "right", fontSize: 12 }}>
                              {formatBulletPrefix(plugin.data?.bullet_style || plugin.data?.list_style, bIdx, plugin.data?.points)}
                            </span>
                            <input
                              type="text"
                              value={bullet}
                              onChange={(e) => handlePluginTextChange(activeSlideIndex, pIdx, "points", e.target.value, bIdx)}
                              placeholder={`Enter point ${bIdx + 1}...`}
                              style={{ flex: 1, background: "rgba(0,0,0,0.4)", border: "1px solid var(--panel-border)", borderRadius: 6, padding: 6, color: "#fff", fontSize: 13 }}
                            />
                            <button className="btn-ui danger sm" onClick={() => handleDeleteBullet(activeSlideIndex, pIdx, bIdx)}>
                              ×
                            </button>
                          </div>
                        ))}
                        <button className="btn-ui secondary sm" style={{ alignSelf: "flex-start", marginTop: 4 }} onClick={() => handleAddBullet(activeSlideIndex, pIdx)}>
                          + Add Point
                        </button>
                        <FeatureFormattingBar
                          pluginData={plugin.data}
                          onChangeField={(fld, val) => handlePluginTextChange(activeSlideIndex, pIdx, fld, val)}
                          onRefineText={() => handleAIRefine(pIdx, "bullets")}
                        />
                      </div>
                    ) : null}

                    {/* PARAGRAPH */}
                    {plugin.type === "paragraph" ? (
                      <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                          
                        </div>

                        {Array.isArray(plugin.data?.points) ? (
                          <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                            {plugin.data.points.map((pt, bIdx) => (
                              <div key={bIdx} style={{ display: "flex", gap: 6, alignItems: "center" }}>
                                <span style={{ color: "#c084fc", fontWeight: 800, fontSize: 12 }}>•</span>
                                <input
                                  type="text"
                                  value={pt}
                                  onChange={(e) => {
                                    const newPts = [...plugin.data.points];
                                    newPts[bIdx] = e.target.value;
                                    handlePluginTextChange(activeSlideIndex, pIdx, "points", newPts);
                                  }}
                                  placeholder={`Point ${bIdx + 1}...`}
                                  style={{ flex: 1, background: "rgba(0,0,0,0.4)", border: "1px solid var(--panel-border)", borderRadius: 6, padding: 6, color: "#fff", fontSize: 12 }}
                                />
                                <button
                                  type="button"
                                  onClick={() => {
                                    const newPts = plugin.data.points.filter((_, i) => i !== bIdx);
                                    handlePluginTextChange(activeSlideIndex, pIdx, "points", newPts.length ? newPts : null);
                                  }}
                                  style={{ background: "transparent", border: "none", color: "#ef4444", cursor: "pointer", fontSize: 13 }}
                                >
                                  ✕
                                </button>
                              </div>
                            ))}
                            <button
                              type="button"
                              onClick={() => {
                                const newPts = [...(plugin.data.points || []), "New point item"];
                                handlePluginTextChange(activeSlideIndex, pIdx, "points", newPts);
                              }}
                              style={{ alignSelf: "flex-start", background: "rgba(255,255,255,0.08)", border: "1px solid rgba(255,255,255,0.15)", borderRadius: 4, padding: "3px 8px", color: "#fff", fontSize: 11, cursor: "pointer" }}
                            >
                              ➕ Add Point
                            </button>
                          </div>
                        ) : (
                          <textarea
                            value={plugin.data?.text || ""}
                            onChange={(e) => handlePluginTextChange(activeSlideIndex, pIdx, "text", e.target.value)}
                            rows={3}
                            placeholder="Enter paragraph text narrative..."
                            style={{ width: "100%", background: "rgba(0,0,0,0.4)", border: "1px solid var(--panel-border)", borderRadius: 8, padding: 8, color: "#fff", fontSize: 13 }}
                          />
                        )}

                        <FeatureFormattingBar
                          pluginData={plugin.data}
                          onChangeField={(fld, val) => handlePluginTextChange(activeSlideIndex, pIdx, fld, val)}
                          onRefineText={() => handleAIRefine(pIdx, "summarize")}
                        />
                      </div>
                    ) : null}

                    {/* MULTI-PARAGRAPH COLUMNS */}
                    {plugin.type === "paragraph_2col" ? (
                      (() => {
                        const items = (Array.isArray(plugin.data?.items) && plugin.data.items.length > 0)
                          ? plugin.data.items
                          : [
                              { title: plugin.data?.left_title || "", text: plugin.data?.left_text || plugin.data?.text || "" },
                              { title: plugin.data?.right_title || "", text: plugin.data?.right_text || "" }
                            ];

                        const syncItems = (newItems) => {
                          handlePluginTextChange(activeSlideIndex, pIdx, "items", newItems);
                          if (newItems.length >= 1) {
                            handlePluginTextChange(activeSlideIndex, pIdx, "left_title", newItems[0].title || "");
                            handlePluginTextChange(activeSlideIndex, pIdx, "left_text", newItems[0].text || "");
                          }
                          if (newItems.length >= 2) {
                            handlePluginTextChange(activeSlideIndex, pIdx, "right_title", newItems[1].title || "");
                            handlePluginTextChange(activeSlideIndex, pIdx, "right_text", newItems[1].text || "");
                          }
                        };

                        const handleAddItem = () => {
                          const newItems = [...items, { title: `Column ${items.length + 1}`, text: "" }];
                          syncItems(newItems);
                        };

                        const handleRemoveItem = (idxToRemove) => {
                          if (items.length <= 1) return;
                          const newItems = items.filter((_, i) => i !== idxToRemove);
                          syncItems(newItems);
                        };

                        const handleItemChange = (idx, field, val) => {
                          const newItems = items.map((it, i) => i === idx ? { ...it, [field]: val } : it);
                          syncItems(newItems);
                        };

                        return (
                          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                              <label style={{ fontSize: 12, fontWeight: 700, color: "#c084fc" }}>
                                Paragraph Columns ({items.length})
                              </label>
                              <button
                                type="button"
                                onClick={handleAddItem}
                                style={{
                                  background: "linear-gradient(135deg, #a855f7, #6366f1)",
                                  border: "none",
                                  borderRadius: 6,
                                  padding: "4px 10px",
                                  color: "#fff",
                                  fontSize: 11,
                                  fontWeight: 600,
                                  cursor: "pointer",
                                  display: "flex",
                                  alignItems: "center",
                                  gap: 4
                                }}
                              >
                                ➕ Add Column
                              </button>
                            </div>

                            <div style={{ display: "grid", gridTemplateColumns: items.length > 2 ? "1fr" : "1fr 1fr", gap: 10 }}>
                              {items.map((it, itemIdx) => (
                                <div key={itemIdx} style={{ background: "rgba(0,0,0,0.25)", padding: 10, borderRadius: 8, border: "1px solid rgba(255,255,255,0.1)", position: "relative" }}>
                                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 6 }}>
                                    <label style={{ fontSize: 11, fontWeight: 700, color: "#c084fc" }}>
                                      Column #{itemIdx + 1}
                                    </label>
                                    <div style={{ display: "flex", gap: 6, alignItems: "center" }}>
                                      <button
                                        type="button"
                                        onClick={() => {
                                          if (!Array.isArray(it.points)) {
                                            const pts = (it.text || "").split("\n").map(s => s.replace(/^[•\-*✓➔\d+.\s]+/, "").trim()).filter(Boolean);
                                            handleItemChange(itemIdx, "points", pts.length ? pts : ["Key point item 1", "Key point item 2"]);
                                          } else {
                                            handleItemChange(itemIdx, "points", null);
                                          }
                                        }}
                                        title="Toggle bullet points mode"
                                        style={{
                                          background: Array.isArray(it.points) ? "rgba(192, 132, 252, 0.2)" : "rgba(255,255,255,0.06)",
                                          border: `1px solid ${Array.isArray(it.points) ? "#c084fc" : "rgba(255,255,255,0.15)"}`,
                                          borderRadius: 4,
                                          padding: "1px 6px",
                                          color: Array.isArray(it.points) ? "#c084fc" : "#ccc",
                                          fontSize: 10,
                                          cursor: "pointer"
                                        }}
                                      >
                                        {Array.isArray(it.points) ? "• Bullets" : "+ Bullets"}
                                      </button>
                                      {items.length > 1 && (
                                        <button
                                          type="button"
                                          onClick={() => handleRemoveItem(itemIdx)}
                                          title="Remove column"
                                          style={{ background: "transparent", border: "none", color: "#ef4444", fontSize: 13, cursor: "pointer", padding: "0 4px" }}
                                        >
                                          ✕
                                        </button>
                                      )}
                                    </div>
                                  </div>
                                  <input
                                    type="text"
                                    value={it.title || ""}
                                    onChange={(e) => handleItemChange(itemIdx, "title", e.target.value)}
                                    placeholder={`Column ${itemIdx + 1} Title`}
                                    style={{ width: "100%", background: "rgba(0,0,0,0.4)", border: "1px solid var(--panel-border)", borderRadius: 6, padding: 6, color: "#fff", fontSize: 12, marginBottom: 6 }}
                                  />

                                  {Array.isArray(it.points) ? (
                                    <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
                                      {it.points.map((pt, pIdxItem) => (
                                        <div key={pIdxItem} style={{ display: "flex", gap: 4, alignItems: "center" }}>
                                          <span style={{ color: "#c084fc", fontWeight: 800, fontSize: 11 }}>•</span>
                                          <input
                                            type="text"
                                            value={pt}
                                            onChange={(e) => {
                                              const newPts = [...it.points];
                                              newPts[pIdxItem] = e.target.value;
                                              handleItemChange(itemIdx, "points", newPts);
                                            }}
                                            placeholder={`Point ${pIdxItem + 1}`}
                                            style={{ flex: 1, background: "rgba(0,0,0,0.4)", border: "1px solid var(--panel-border)", borderRadius: 4, padding: 4, color: "#fff", fontSize: 11 }}
                                          />
                                          <button
                                            type="button"
                                            onClick={() => {
                                              const newPts = it.points.filter((_, i) => i !== pIdxItem);
                                              handleItemChange(itemIdx, "points", newPts.length ? newPts : null);
                                            }}
                                            style={{ background: "transparent", border: "none", color: "#ef4444", cursor: "pointer", fontSize: 11 }}
                                          >
                                            ✕
                                          </button>
                                        </div>
                                      ))}
                                      <button
                                        type="button"
                                        onClick={() => {
                                          const newPts = [...(it.points || []), "New point item"];
                                          handleItemChange(itemIdx, "points", newPts);
                                        }}
                                        style={{ alignSelf: "flex-start", background: "rgba(255,255,255,0.08)", border: "1px solid rgba(255,255,255,0.15)", borderRadius: 4, padding: "2px 6px", color: "#fff", fontSize: 10, cursor: "pointer", marginTop: 2 }}
                                      >
                                        ➕ Add Point
                                      </button>
                                    </div>
                                  ) : (
                                    <textarea
                                      value={it.text || ""}
                                      onChange={(e) => handleItemChange(itemIdx, "text", e.target.value)}
                                      rows={3}
                                      placeholder={`Paragraph text for column ${itemIdx + 1}...`}
                                      style={{ width: "100%", background: "rgba(0,0,0,0.4)", border: "1px solid var(--panel-border)", borderRadius: 6, padding: 6, color: "#fff", fontSize: 12 }}
                                    />
                                  )}
                                </div>
                              ))}
                            </div>

                            <FeatureFormattingBar
                              pluginData={plugin.data}
                              onChangeField={(fld, val) => handlePluginTextChange(activeSlideIndex, pIdx, fld, val)}
                              onRefineText={() => handleAIRefine(pIdx, "summarize")}
                            />
                          </div>
                        );
                      })()
                    ) : null}

                    {/* STAT */}
                    {plugin.type === "stat" ? (
                      <div>
                        <div style={{ display: "grid", gridTemplateColumns: "1fr 2fr", gap: 8 }}>
                          <input
                            type="text"
                            value={plugin.data?.number || ""}
                            onChange={(e) => handlePluginTextChange(activeSlideIndex, pIdx, "number", e.target.value)}
                            placeholder="e.g. 95% or $2.5M"
                            style={{ background: "rgba(0,0,0,0.4)", border: "1px solid var(--panel-border)", borderRadius: 8, padding: 8, color: "#c084fc", fontWeight: 800, fontSize: 14 }}
                          />
                          <input
                            type="text"
                            value={plugin.data?.label || ""}
                            onChange={(e) => handlePluginTextChange(activeSlideIndex, pIdx, "label", e.target.value)}
                            placeholder="e.g. Enterprise Accuracy Growth"
                            style={{ background: "rgba(0,0,0,0.4)", border: "1px solid var(--panel-border)", borderRadius: 8, padding: 8, color: "#fff", fontSize: 13 }}
                          />
                        </div>
                        <FeatureFormattingBar
                          pluginData={plugin.data}
                          onChangeField={(fld, val) => handlePluginTextChange(activeSlideIndex, pIdx, fld, val)}
                          isRefining={refiningPluginIdx === pIdx}
                        />
                      </div>
                    ) : null}

                    {/* CALLOUT PLUGIN EDITOR */}
                    {plugin.type === "callout" ? (
                      <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                        <div style={{ display: "grid", gridTemplateColumns: "1fr 2fr", gap: 10 }}>
                          <div>
                            <label style={{ fontSize: 11, fontWeight: 700, color: "#c084fc", display: "block", marginBottom: 4 }}>Callout Style:</label>
                            <select
                              value={plugin.data?.variant || "info"}
                              onChange={(e) => handlePluginTextChange(activeSlideIndex, pIdx, "variant", e.target.value)}
                              style={{ width: "100%", background: "rgba(0,0,0,0.5)", border: "1px solid var(--panel-border)", borderRadius: 8, padding: 8, color: "#fff", fontSize: 12 }}
                            >
                              <option value="info">💡 Info / Key Takeaway</option>
                              <option value="warning">⚠️ Warning / Attention</option>
                              <option value="success">✅ Success / Highlight</option>
                              <option value="danger">🚨 Danger / Alert</option>
                              <option value="quote">💬 Quote / Pro Tip</option>
                            </select>
                          </div>
                          <div>
                            <label style={{ fontSize: 11, fontWeight: 700, color: "var(--text-muted)", display: "block", marginBottom: 4 }}>Callout Header / Title:</label>
                            <input
                              type="text"
                              value={plugin.data?.title || ""}
                              onChange={(e) => handlePluginTextChange(activeSlideIndex, pIdx, "title", e.target.value)}
                              placeholder="e.g. Key Architectural Insight"
                              style={{ width: "100%", background: "rgba(0,0,0,0.4)", border: "1px solid var(--panel-border)", borderRadius: 8, padding: 8, color: "#fff", fontSize: 12 }}
                            />
                          </div>
                        </div>
                        <div>
                          <label style={{ fontSize: 11, color: "var(--text-muted)", display: "block", marginBottom: 4 }}>Callout Details / Text:</label>
                          <textarea
                            value={plugin.data?.text || ""}
                            onChange={(e) => handlePluginTextChange(activeSlideIndex, pIdx, "text", e.target.value)}
                            rows={3}
                            placeholder="Enter callout description..."
                            style={{ width: "100%", background: "rgba(0,0,0,0.4)", border: "1px solid var(--panel-border)", borderRadius: 8, padding: 8, color: "#fff", fontSize: 12 }}
                          />
                        </div>
                        <FeatureFormattingBar
                          pluginData={plugin.data}
                          onChangeField={(fld, val) => handlePluginTextChange(activeSlideIndex, pIdx, fld, val)}
                        />
                      </div>
                    ) : null}

                    {/* KPI GRID PLUGIN EDITOR */}
                    {plugin.type === "kpi_grid" ? (
                      <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                        <div>
                          <label style={{ fontSize: 11, fontWeight: 700, color: "var(--text-muted)", display: "block", marginBottom: 4 }}>Grid Title / Section Header:</label>
                          <input
                            type="text"
                            value={plugin.data?.title || ""}
                            onChange={(e) => handlePluginTextChange(activeSlideIndex, pIdx, "title", e.target.value)}
                            placeholder="e.g. Executive Growth Metrics"
                            style={{ width: "100%", background: "rgba(0,0,0,0.4)", border: "1px solid var(--panel-border)", borderRadius: 8, padding: 8, color: "#fff", fontSize: 12 }}
                          />
                        </div>

                        {(() => {
                          const kpis = safeArray(plugin.data?.items);
                          const updateKPI = (kIdx, key, val) => {
                            const updated = [...kpis];
                            if (!updated[kIdx]) updated[kIdx] = {};
                            updated[kIdx] = { ...updated[kIdx], [key]: val };
                            handlePluginTextChange(activeSlideIndex, pIdx, "items", updated);
                          };
                          const addKPI = () => {
                            handlePluginTextChange(activeSlideIndex, pIdx, "items", [...kpis, { number: "$10M", label: "Revenue", change: "+15%", subtitle: "YoY" }]);
                          };
                          const deleteKPI = (kIdx) => {
                            const updated = kpis.filter((_, idx) => idx !== kIdx);
                            handlePluginTextChange(activeSlideIndex, pIdx, "items", updated);
                          };

                          return (
                            <div style={{ background: "rgba(15, 23, 42, 0.6)", padding: 12, borderRadius: 10, border: "1px solid rgba(192, 132, 252, 0.25)", display: "flex", flexDirection: "column", gap: 10 }}>
                              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                                <label style={{ fontSize: 11, fontWeight: 700, color: "#c084fc" }}>
                                  🔢 KPI Cards ({kpis.length} Cards):
                                </label>
                                <button
                                  type="button"
                                  className="btn-ui primary sm"
                                  onClick={addKPI}
                                  style={{ padding: "4px 10px", fontSize: 10, fontWeight: 700, borderRadius: 6, background: "linear-gradient(135deg, #a855f7 0%, #7c3aed 100%)", color: "#fff", border: "none", cursor: "pointer" }}
                                >
                                  ➕ Add KPI
                                </button>
                              </div>

                              <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                                {kpis.map((item, kIdx) => (
                                  <div key={kIdx} style={{ background: "rgba(255,255,255,0.04)", padding: 8, borderRadius: 8, border: "1px solid rgba(255,255,255,0.08)", display: "flex", flexDirection: "column", gap: 6 }}>
                                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                                      <span style={{ fontSize: 10, fontWeight: 800, color: "#c084fc", background: "rgba(192, 132, 252, 0.15)", padding: "2px 6px", borderRadius: 4 }}>
                                        KPI #{kIdx + 1}
                                      </span>
                                      <button
                                        type="button"
                                        onClick={() => deleteKPI(kIdx)}
                                        style={{ background: "rgba(239, 68, 68, 0.15)", border: "1px solid rgba(239, 68, 68, 0.3)", borderRadius: 4, color: "#f87171", cursor: "pointer", fontSize: 10, padding: "2px 6px" }}
                                      >
                                        ✕
                                      </button>
                                    </div>
                                    <div style={{ display: "grid", gridTemplateColumns: "1fr 2fr 1fr", gap: 6 }}>
                                      <input
                                        type="text"
                                        value={item.number || ""}
                                        onChange={(e) => updateKPI(kIdx, "number", e.target.value)}
                                        placeholder="Metric Value (e.g. $2.5M)"
                                        style={{ background: "rgba(0,0,0,0.5)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 6, padding: "5px 8px", color: "#c084fc", fontSize: 12, fontWeight: "bold" }}
                                      />
                                      <input
                                        type="text"
                                        value={item.label || ""}
                                        onChange={(e) => updateKPI(kIdx, "label", e.target.value)}
                                        placeholder="Label (e.g. Annual Revenue)"
                                        style={{ background: "rgba(0,0,0,0.5)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 6, padding: "5px 8px", color: "#fff", fontSize: 12 }}
                                      />
                                      <input
                                        type="text"
                                        value={item.change || ""}
                                        onChange={(e) => updateKPI(kIdx, "change", e.target.value)}
                                        placeholder="Growth (e.g. +24%)"
                                        style={{ background: "rgba(0,0,0,0.5)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 6, padding: "5px 8px", color: "#86efac", fontSize: 12 }}
                                      />
                                    </div>
                                  </div>
                                ))}
                              </div>
                            </div>
                          );
                        })()}

                        <FeatureFormattingBar
                          pluginData={plugin.data}
                          onChangeField={(fld, val) => handlePluginTextChange(activeSlideIndex, pIdx, fld, val)}
                        />
                      </div>
                    ) : null}

                    {/* PROS & CONS PLUGIN EDITOR */}
                    {plugin.type === "pros_cons" ? (
                      <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                        <div>
                          <label style={{ fontSize: 11, fontWeight: 700, color: "var(--text-muted)", display: "block", marginBottom: 4 }}>Comparison Title:</label>
                          <input
                            type="text"
                            value={plugin.data?.title || ""}
                            onChange={(e) => handlePluginTextChange(activeSlideIndex, pIdx, "title", e.target.value)}
                            placeholder="e.g. Option Analysis: Cloud vs On-Premises"
                            style={{ width: "100%", background: "rgba(0,0,0,0.4)", border: "1px solid var(--panel-border)", borderRadius: 8, padding: 8, color: "#fff", fontSize: 12 }}
                          />
                        </div>

                        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
                          {/* PROS COLUMN */}
                          <div style={{ background: "rgba(34, 197, 94, 0.05)", padding: 10, borderRadius: 10, border: "1px solid rgba(34, 197, 94, 0.2)", display: "flex", flexDirection: "column", gap: 8 }}>
                            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                              <label style={{ fontSize: 11, fontWeight: 800, color: "#86efac" }}>
                                ✅ Pros / Advantages:
                              </label>
                              <button
                                type="button"
                                className="btn-ui secondary sm"
                                onClick={() => {
                                  const pros = safeArray(plugin.data?.pros);
                                  handlePluginTextChange(activeSlideIndex, pIdx, "pros", [...pros, `New Pro Item`]);
                                }}
                                style={{ padding: "2px 8px", fontSize: 10 }}
                              >
                                + Add Pro
                              </button>
                            </div>
                            {safeArray(plugin.data?.pros).map((pro, prIdx) => (
                              <div key={prIdx} style={{ display: "flex", gap: 6, alignItems: "center" }}>
                                <input
                                  type="text"
                                  value={pro}
                                  onChange={(e) => {
                                    const pros = [...safeArray(plugin.data?.pros)];
                                    pros[prIdx] = e.target.value;
                                    handlePluginTextChange(activeSlideIndex, pIdx, "pros", pros);
                                  }}
                                  style={{ flex: 1, background: "rgba(0,0,0,0.4)", border: "1px solid rgba(34, 197, 94, 0.3)", borderRadius: 6, padding: "5px 8px", color: "#fff", fontSize: 12 }}
                                />
                                <button
                                  type="button"
                                  onClick={() => {
                                    const pros = safeArray(plugin.data?.pros).filter((_, idx) => idx !== prIdx);
                                    handlePluginTextChange(activeSlideIndex, pIdx, "pros", pros);
                                  }}
                                  style={{ background: "rgba(239, 68, 68, 0.15)", border: "1px solid rgba(239, 68, 68, 0.3)", borderRadius: 4, color: "#f87171", cursor: "pointer", fontSize: 10, padding: "2px 6px" }}
                                >
                                  ✕
                                </button>
                              </div>
                            ))}
                          </div>

                          {/* CONS COLUMN */}
                          <div style={{ background: "rgba(239, 68, 68, 0.05)", padding: 10, borderRadius: 10, border: "1px solid rgba(239, 68, 68, 0.2)", display: "flex", flexDirection: "column", gap: 8 }}>
                            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                              <label style={{ fontSize: 11, fontWeight: 800, color: "#fca5a5" }}>
                                ❌ Cons / Drawbacks:
                              </label>
                              <button
                                type="button"
                                className="btn-ui secondary sm"
                                onClick={() => {
                                  const cons = safeArray(plugin.data?.cons);
                                  handlePluginTextChange(activeSlideIndex, pIdx, "cons", [...cons, `New Con Item`]);
                                }}
                                style={{ padding: "2px 8px", fontSize: 10 }}
                              >
                                + Add Con
                              </button>
                            </div>
                            {safeArray(plugin.data?.cons).map((con, cnIdx) => (
                              <div key={cnIdx} style={{ display: "flex", gap: 6, alignItems: "center" }}>
                                <input
                                  type="text"
                                  value={con}
                                  onChange={(e) => {
                                    const cons = [...safeArray(plugin.data?.cons)];
                                    cons[cnIdx] = e.target.value;
                                    handlePluginTextChange(activeSlideIndex, pIdx, "cons", cons);
                                  }}
                                  style={{ flex: 1, background: "rgba(0,0,0,0.4)", border: "1px solid rgba(239, 68, 68, 0.3)", borderRadius: 6, padding: "5px 8px", color: "#fff", fontSize: 12 }}
                                />
                                <button
                                  type="button"
                                  onClick={() => {
                                    const cons = safeArray(plugin.data?.cons).filter((_, idx) => idx !== cnIdx);
                                    handlePluginTextChange(activeSlideIndex, pIdx, "cons", cons);
                                  }}
                                  style={{ background: "rgba(239, 68, 68, 0.15)", border: "1px solid rgba(239, 68, 68, 0.3)", borderRadius: 4, color: "#f87171", cursor: "pointer", fontSize: 10, padding: "2px 6px" }}
                                >
                                  ✕
                                </button>
                              </div>
                            ))}
                          </div>
                        </div>

                        <FeatureFormattingBar
                          pluginData={plugin.data}
                          onChangeField={(fld, val) => handlePluginTextChange(activeSlideIndex, pIdx, fld, val)}
                        />
                      </div>
                    ) : null}

                    {/* ROADMAP PLUGIN EDITOR */}
                    {plugin.type === "roadmap" ? (
                      <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                        <div>
                          <label style={{ fontSize: 11, fontWeight: 700, color: "var(--text-muted)", display: "block", marginBottom: 4 }}>Roadmap Title:</label>
                          <input
                            type="text"
                            value={plugin.data?.title || ""}
                            onChange={(e) => handlePluginTextChange(activeSlideIndex, pIdx, "title", e.target.value)}
                            placeholder="e.g. Product Release Roadmap Q1-Q4"
                            style={{ width: "100%", background: "rgba(0,0,0,0.4)", border: "1px solid var(--panel-border)", borderRadius: 8, padding: 8, color: "#fff", fontSize: 12 }}
                          />
                        </div>

                        {(() => {
                          const steps = safeArray(plugin.data?.steps);
                          const updateStep = (sIdx, key, val) => {
                            const updated = [...steps];
                            if (!updated[sIdx]) updated[sIdx] = {};
                            updated[sIdx] = { ...updated[sIdx], [key]: val };
                            handlePluginTextChange(activeSlideIndex, pIdx, "steps", updated);
                          };
                          const addStep = () => {
                            handlePluginTextChange(activeSlideIndex, pIdx, "steps", [...steps, { phase: `Phase ${steps.length + 1}`, title: "Milestone Title", description: "Details...", status: "upcoming" }]);
                          };
                          const deleteStep = (sIdx) => {
                            const updated = steps.filter((_, idx) => idx !== sIdx);
                            handlePluginTextChange(activeSlideIndex, pIdx, "steps", updated);
                          };

                          return (
                            <div style={{ background: "rgba(15, 23, 42, 0.6)", padding: 12, borderRadius: 10, border: "1px solid rgba(192, 132, 252, 0.25)", display: "flex", flexDirection: "column", gap: 10 }}>
                              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                                <label style={{ fontSize: 11, fontWeight: 700, color: "#c084fc" }}>
                                  🗺️ Roadmap Milestones ({steps.length} Phases):
                                </label>
                                <button
                                  type="button"
                                  className="btn-ui primary sm"
                                  onClick={addStep}
                                  style={{ padding: "4px 10px", fontSize: 10, fontWeight: 700, borderRadius: 6, background: "linear-gradient(135deg, #a855f7 0%, #7c3aed 100%)", color: "#fff", border: "none", cursor: "pointer" }}
                                >
                                  ➕ Add Milestone
                                </button>
                              </div>

                              <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                                {steps.map((step, sIdx) => (
                                  <div key={sIdx} style={{ background: "rgba(255,255,255,0.04)", padding: 8, borderRadius: 8, border: "1px solid rgba(255,255,255,0.08)", display: "flex", flexDirection: "column", gap: 6 }}>
                                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                                      <span style={{ fontSize: 10, fontWeight: 800, color: "#c084fc", background: "rgba(192, 132, 252, 0.15)", padding: "2px 6px", borderRadius: 4 }}>
                                        Milestone #{sIdx + 1}
                                      </span>
                                      <button
                                        type="button"
                                        onClick={() => deleteStep(sIdx)}
                                        style={{ background: "rgba(239, 68, 68, 0.15)", border: "1px solid rgba(239, 68, 68, 0.3)", borderRadius: 4, color: "#f87171", cursor: "pointer", fontSize: 10, padding: "2px 6px" }}
                                      >
                                        ✕
                                      </button>
                                    </div>
                                    <div style={{ display: "grid", gridTemplateColumns: "1fr 2fr 1fr", gap: 6 }}>
                                      <input
                                        type="text"
                                        value={step.phase || ""}
                                        onChange={(e) => updateStep(sIdx, "phase", e.target.value)}
                                        placeholder="Phase (e.g. Q1 2025)"
                                        style={{ background: "rgba(0,0,0,0.5)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 6, padding: "5px 8px", color: "#c084fc", fontSize: 12, fontWeight: "bold" }}
                                      />
                                      <input
                                        type="text"
                                        value={step.title || ""}
                                        onChange={(e) => updateStep(sIdx, "title", e.target.value)}
                                        placeholder="Milestone Title"
                                        style={{ background: "rgba(0,0,0,0.5)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 6, padding: "5px 8px", color: "#fff", fontSize: 12 }}
                                      />
                                      <select
                                        value={step.status || "upcoming"}
                                        onChange={(e) => updateStep(sIdx, "status", e.target.value)}
                                        style={{ background: "rgba(0,0,0,0.5)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 6, padding: "5px 8px", color: "#fff", fontSize: 11 }}
                                      >
                                        <option value="completed">Completed</option>
                                        <option value="in_progress">In Progress</option>
                                        <option value="upcoming">Upcoming</option>
                                      </select>
                                    </div>
                                    <input
                                      type="text"
                                      value={step.description || ""}
                                      onChange={(e) => updateStep(sIdx, "description", e.target.value)}
                                      placeholder="Details / key deliverable..."
                                      style={{ width: "100%", background: "rgba(0,0,0,0.4)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 6, padding: "4px 8px", color: "var(--text-muted)", fontSize: 11 }}
                                    />
                                  </div>
                                ))}
                              </div>
                            </div>
                          );
                        })()}

                        <FeatureFormattingBar
                          pluginData={plugin.data}
                          onChangeField={(fld, val) => handlePluginTextChange(activeSlideIndex, pIdx, fld, val)}
                        />
                      </div>
                    ) : null}

                    {/* CODE BLOCK PLUGIN EDITOR */}
                    {plugin.type === "code_block" ? (
                      <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                        <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr", gap: 10 }}>
                          <div>
                            <label style={{ fontSize: 11, fontWeight: 700, color: "var(--text-muted)", display: "block", marginBottom: 4 }}>Header Title:</label>
                            <input
                              type="text"
                              value={plugin.data?.title || ""}
                              onChange={(e) => handlePluginTextChange(activeSlideIndex, pIdx, "title", e.target.value)}
                              placeholder="e.g. API Client Implementation"
                              style={{ width: "100%", background: "rgba(0,0,0,0.4)", border: "1px solid var(--panel-border)", borderRadius: 8, padding: 8, color: "#fff", fontSize: 12 }}
                            />
                          </div>
                          <div>
                            <label style={{ fontSize: 11, fontWeight: 700, color: "#c084fc", display: "block", marginBottom: 4 }}>Language:</label>
                            <select
                              value={plugin.data?.language || "python"}
                              onChange={(e) => handlePluginTextChange(activeSlideIndex, pIdx, "language", e.target.value)}
                              style={{ width: "100%", background: "rgba(0,0,0,0.5)", border: "1px solid var(--panel-border)", borderRadius: 8, padding: 8, color: "#fff", fontSize: 12 }}
                            >
                              <option value="python">Python</option>
                              <option value="javascript">JavaScript / TypeScript</option>
                              <option value="html">HTML / JSX</option>
                              <option value="css">CSS</option>
                              <option value="bash">Bash / Shell</option>
                              <option value="json">JSON</option>
                              <option value="sql">SQL</option>
                            </select>
                          </div>
                        </div>
                        <div>
                          <label style={{ fontSize: 11, color: "var(--text-muted)", display: "block", marginBottom: 4 }}>Source Code Snippet:</label>
                          <textarea
                            value={plugin.data?.code || ""}
                            onChange={(e) => handlePluginTextChange(activeSlideIndex, pIdx, "code", e.target.value)}
                            rows={5}
                            placeholder="Paste code snippet here..."
                            style={{ width: "100%", background: "#0f172a", border: "1px solid rgba(192, 132, 252, 0.3)", borderRadius: 8, padding: 10, color: "#38bdf8", fontFamily: "monospace", fontSize: 12, lineHeight: 1.4 }}
                          />
                        </div>
                        <FeatureFormattingBar
                          pluginData={plugin.data}
                          onChangeField={(fld, val) => handlePluginTextChange(activeSlideIndex, pIdx, fld, val)}
                        />
                      </div>
                    ) : null}

                    {/* SPEAKER CARD PLUGIN EDITOR */}
                    {plugin.type === "speaker_card" ? (
                      <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
                          <div>
                            <label style={{ fontSize: 11, fontWeight: 700, color: "#c084fc", display: "block", marginBottom: 4 }}>Speaker Name:</label>
                            <input
                              type="text"
                              value={plugin.data?.name || ""}
                              onChange={(e) => handlePluginTextChange(activeSlideIndex, pIdx, "name", e.target.value)}
                              placeholder="e.g. Dr. Alex Vance"
                              style={{ width: "100%", background: "rgba(0,0,0,0.4)", border: "1px solid var(--panel-border)", borderRadius: 8, padding: 8, color: "#fff", fontSize: 12, fontWeight: "bold" }}
                            />
                          </div>
                          <div>
                            <label style={{ fontSize: 11, fontWeight: 700, color: "var(--text-muted)", display: "block", marginBottom: 4 }}>Role & Title:</label>
                            <input
                              type="text"
                              value={plugin.data?.role || ""}
                              onChange={(e) => handlePluginTextChange(activeSlideIndex, pIdx, "role", e.target.value)}
                              placeholder="e.g. Chief AI Architect"
                              style={{ width: "100%", background: "rgba(0,0,0,0.4)", border: "1px solid var(--panel-border)", borderRadius: 8, padding: 8, color: "#fff", fontSize: 12 }}
                            />
                          </div>
                        </div>
                        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
                          <div>
                            <label style={{ fontSize: 11, color: "var(--text-muted)", display: "block", marginBottom: 4 }}>Organization / Company:</label>
                            <input
                              type="text"
                              value={plugin.data?.company || ""}
                              onChange={(e) => handlePluginTextChange(activeSlideIndex, pIdx, "company", e.target.value)}
                              placeholder="e.g. Vitya AI Labs"
                              style={{ width: "100%", background: "rgba(0,0,0,0.4)", border: "1px solid var(--panel-border)", borderRadius: 8, padding: 8, color: "#fff", fontSize: 12 }}
                            />
                          </div>
                          <div>
                            <label style={{ fontSize: 11, color: "var(--text-muted)", display: "block", marginBottom: 4 }}>Photo URL / Image:</label>
                            <input
                              type="text"
                              value={plugin.data?.image_url || ""}
                              onChange={(e) => handlePluginTextChange(activeSlideIndex, pIdx, "image_url", e.target.value)}
                              placeholder="https://..."
                              style={{ width: "100%", background: "rgba(0,0,0,0.4)", border: "1px solid var(--panel-border)", borderRadius: 8, padding: 8, color: "#fff", fontSize: 12 }}
                            />
                          </div>
                        </div>
                        <div>
                          <label style={{ fontSize: 11, color: "var(--text-muted)", display: "block", marginBottom: 4 }}>Bio / Speaker Summary:</label>
                          <textarea
                            value={plugin.data?.bio || ""}
                            onChange={(e) => handlePluginTextChange(activeSlideIndex, pIdx, "bio", e.target.value)}
                            rows={3}
                            placeholder="Brief speaker bio..."
                            style={{ width: "100%", background: "rgba(0,0,0,0.4)", border: "1px solid var(--panel-border)", borderRadius: 8, padding: 8, color: "#fff", fontSize: 12 }}
                          />
                        </div>
                        <FeatureFormattingBar
                          pluginData={plugin.data}
                          onChangeField={(fld, val) => handlePluginTextChange(activeSlideIndex, pIdx, fld, val)}
                        />
                      </div>
                    ) : null}

                  </div>
                ))}
              </div>
            </div>
          ) : null}
        </div>
      </div>
    </div>
  </div>

      {/* DOWNLOAD SUCCESS POPUP MODAL 🎁 */}
      {showDownloadModal && (
        <div style={{
          position: "fixed",
          inset: 0,
          zIndex: 10000,
          background: "rgba(9, 13, 24, 0.88)",
          backdropFilter: "blur(16px)",
          display: "grid",
          placeItems: "center",
          padding: 16
        }}>
          <div style={{
            background: "linear-gradient(145deg, #0b1120 0%, #1e1b4b 50%, #0f172a 100%)",
            border: "1px solid rgba(192, 132, 252, 0.35)",
            borderRadius: 24,
            padding: "36px 32px",
            maxWidth: 490,
            width: "100%",
            boxShadow: "0 25px 60px -10px rgba(0, 0, 0, 0.9), 0 0 40px rgba(139, 92, 246, 0.25)",
            textAlign: "center",
            position: "relative",
            animation: "fadeIn 0.25s ease-out",
          }}>
            <button
              onClick={() => setShowDownloadModal(false)}
              style={{
                position: "absolute",
                top: 16,
                right: 16,
                width: 32,
                height: 32,
                borderRadius: 999,
                background: "rgba(255, 255, 255, 0.08)",
                border: "1px solid rgba(255, 255, 255, 0.12)",
                color: "#fff",
                fontSize: 16,
                cursor: "pointer",
                display: "grid",
                placeItems: "center",
                transition: "all 0.2s ease",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = "rgba(239, 68, 68, 0.25)";
                e.currentTarget.style.borderColor = "#ef4444";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = "rgba(255, 255, 255, 0.08)";
                e.currentTarget.style.borderColor = "rgba(255, 255, 255, 0.12)";
              }}
            >
              ✕
            </button>

            {/* GLOWING ICON BADGE */}
            <div style={{
              width: 68,
              height: 68,
              borderRadius: 999,
              background: "linear-gradient(135deg, rgba(139, 92, 246, 0.25), rgba(6, 182, 212, 0.25))",
              border: "1px solid rgba(192, 132, 252, 0.4)",
              boxShadow: "0 0 20px rgba(139, 92, 246, 0.3)",
              display: "grid",
              placeItems: "center",
              fontSize: 32,
              margin: "0 auto 18px",
            }}>
              🎉
            </div>

            <h2 style={{
              fontSize: 22,
              fontWeight: 900,
              background: "linear-gradient(135deg, #ffffff 0%, #c084fc 100%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              margin: "0 0 8px 0",
              lineHeight: 1.3,
            }}>
              {plan?.title || "Presentation Deck Ready!"}
            </h2>

            <p style={{ fontSize: 13, color: "rgba(255,255,255,0.75)", margin: "0 0 22px 0", lineHeight: 1.5 }}>
              Your 16:9 Widescreen PowerPoint presentation has been generated successfully!
            </p>

            {/* SPEC CARD DETAILS */}
            <div style={{
              background: "rgba(0, 0, 0, 0.35)",
              border: "1px solid rgba(255, 255, 255, 0.1)",
              borderRadius: 16,
              padding: "16px 18px",
              marginBottom: 26,
              display: "flex",
              flexDirection: "column",
              gap: 10,
              fontSize: 13,
            }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <span style={{ color: "rgba(255,255,255,0.6)", fontWeight: 600 }}>Output Format:</span>
                <span style={{ fontWeight: 800, color: "#86efac", background: "rgba(34, 197, 94, 0.15)", padding: "3px 10px", borderRadius: 999, border: "1px solid rgba(34, 197, 94, 0.3)", fontSize: 12 }}>
                  📊 PPTX (16:9 Widescreen)
                </span>
              </div>

              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <span style={{ color: "rgba(255,255,255,0.6)", fontWeight: 600 }}>Total Slides:</span>
                <span style={{ fontWeight: 800, color: "#c084fc", background: "rgba(192, 132, 252, 0.15)", padding: "3px 10px", borderRadius: 999, border: "1px solid rgba(192, 132, 252, 0.3)", fontSize: 12 }}>
                  {plan?.slides?.length || 0} Slides
                </span>
              </div>
            </div>

            {/* BUTTONS ROW */}
            <div style={{ display: "flex", gap: 12, justifyContent: "center" }}>
              <button
                type="button"
                className="btn-ui primary"
                onClick={async (e) => {
                  e?.preventDefault();
                  if (typeof downloadSavedPresentation === "function") {
                    await downloadSavedPresentation();
                  } else {
                    await handleDirectDownload(e);
                  }
                  setShowDownloadModal(false);
                }}
                disabled={isSaving || loadingGenerate}
                style={{
                  flex: 1,
                  padding: "13px 24px",
                  fontSize: 14,
                  fontWeight: 800,
                  color: "#ffffff",
                  WebkitTextFillColor: "#ffffff",
                  background: (isSaving || loadingGenerate)
                    ? "linear-gradient(135deg, #4b5563, #374151)"
                    : "linear-gradient(135deg, #10b981 0%, #059669 100%)",
                  border: "none",
                  borderRadius: 14,
                  cursor: (isSaving || loadingGenerate) ? "not-allowed" : "pointer",
                  boxShadow: "0 8px 24px rgba(16, 185, 129, 0.4)",
                  display: "inline-flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: 8,
                  transition: "all 0.2s ease",
                }}
              >
                {isSaving ? "⏳ Saving & Compiling PPTX..." : "📥 Download Latest PPT"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* POWERPOINT OFFICE THEME VISUAL LAYOUT PICKER MODAL */}
      {showLayoutModal && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: "rgba(0,0,0,0.75)",
            backdropFilter: "blur(6px)",
            zIndex: 99999,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: 16,
          }}
          onClick={() => setShowLayoutModal(false)}
        >
          <div
            style={{
              background: "#18181b",
              border: "1px solid rgba(255,255,255,0.15)",
              borderRadius: 16,
              padding: "20px 24px",
              maxWidth: 720,
              width: "100%",
              boxShadow: "0 20px 50px rgba(0,0,0,0.7)",
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16, borderBottom: "1px solid rgba(255,255,255,0.1)", paddingBottom: 12 }}>
              <div>
                <div style={{ fontSize: 16, fontWeight: 800, color: "#ffffff", display: "flex", alignItems: "center", gap: 8 }}>
                  <span>{layoutModalMode === "add" ? "➕" : "🔲"}</span>
                  <span>{layoutModalMode === "add" ? "Choose Layout for New Slide" : "Office Theme Slide Layouts"}</span>
                </div>
                <div style={{ fontSize: 12, color: "rgba(255,255,255,0.6)", marginTop: 2 }}>
                  {layoutModalMode === "add"
                    ? "Select a PowerPoint slide layout preset to insert a new slide into your deck"
                    : `Select a PowerPoint slide layout preset for Slide #${activeSlideIndex + 1}`}
                </div>
              </div>
              <button
                type="button"
                onClick={() => setShowLayoutModal(false)}
                style={{ background: "none", border: "none", color: "rgba(255,255,255,0.6)", fontSize: 20, cursor: "pointer", padding: "4px 8px" }}
              >
                ✕
              </button>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 14, maxHeight: "70vh", overflowY: "auto", paddingRight: 4 }}>
              {OFFICE_LAYOUT_PRESETS.map((layoutItem) => {
                const isActive = layoutModalMode === "change" && resolveActiveSlideLayout(activeSlide) === layoutItem.id;
                return (
                  <div
                    key={layoutItem.id}
                    onClick={() => {
                      if (layoutModalMode === "add") {
                        handleAddSlideWithLayout(layoutItem.id);
                      } else {
                        handleApplySlideLayout(layoutItem.id);
                      }
                      setShowLayoutModal(false);
                    }}
                    style={{
                      background: isActive ? "rgba(139, 92, 246, 0.18)" : "rgba(255,255,255,0.04)",
                      border: isActive ? "2px solid #8b5cf6" : "1px solid rgba(255,255,255,0.12)",
                      borderRadius: 12,
                      padding: 10,
                      cursor: "pointer",
                      transition: "all 0.2s ease",
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                      gap: 8,
                    }}
                    className="layout-preset-card"
                  >
                    {/* MINI VISUAL WIREFRAME CANVAS */}
                    <div
                      style={{
                        width: "100%",
                        height: 90,
                        background: "#ffffff",
                        borderRadius: 6,
                        padding: 6,
                        display: "flex",
                        flexDirection: "column",
                        justifyContent: "space-between",
                        boxShadow: "0 2px 8px rgba(0,0,0,0.3)",
                        position: "relative",
                        boxSizing: "border-box",
                      }}
                    >
                      {layoutItem.id === "title_subtitle" && (
                        <div style={{ display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center", height: "100%", gap: 6 }}>
                          <div style={{ width: "80%", height: 18, border: "1.5px dashed #64748b", borderRadius: 3 }} />
                          <div style={{ width: "55%", height: 14, border: "1.5px dashed #94a3b8", borderRadius: 3 }} />
                        </div>
                      )}

                      {layoutItem.id === "title_content" && (
                        <div style={{ display: "flex", flexDirection: "column", height: "100%", gap: 6 }}>
                          <div style={{ width: "90%", height: 14, border: "1.5px dashed #64748b", borderRadius: 3 }} />
                          <div style={{ width: "100%", flex: 1, border: "1.5px dashed #94a3b8", borderRadius: 3, display: "flex", alignItems: "center", justifyContent: "center", gap: 4, opacity: 0.6 }}>
                            <span style={{ fontSize: 9 }}>📊</span>
                            <span style={{ fontSize: 9 }}>🖼️</span>
                            <span style={{ fontSize: 9 }}>📑</span>
                          </div>
                        </div>
                      )}

                      {layoutItem.id === "section_header" && (
                        <div style={{ display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "flex-start", height: "100%", paddingLeft: 8 }}>
                          <div style={{ width: "85%", height: 20, border: "1.5px dashed #64748b", borderRadius: 3 }} />
                        </div>
                      )}

                      {layoutItem.id === "two_content" && (
                        <div style={{ display: "flex", flexDirection: "column", height: "100%", gap: 6 }}>
                          <div style={{ width: "90%", height: 12, border: "1.5px dashed #64748b", borderRadius: 3 }} />
                          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 6, flex: 1 }}>
                            <div style={{ border: "1.5px dashed #94a3b8", borderRadius: 3, display: "flex", alignItems: "center", justifyContent: "center" }}>
                              <span style={{ fontSize: 9, opacity: 0.6 }}>📝</span>
                            </div>
                            <div style={{ border: "1.5px dashed #94a3b8", borderRadius: 3, display: "flex", alignItems: "center", justifyContent: "center" }}>
                              <span style={{ fontSize: 9, opacity: 0.6 }}>📊</span>
                            </div>
                          </div>
                        </div>
                      )}

                      {layoutItem.id === "comparison" && (
                        <div style={{ display: "flex", flexDirection: "column", height: "100%", gap: 4 }}>
                          <div style={{ width: "90%", height: 10, border: "1.5px dashed #64748b", borderRadius: 3 }} />
                          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 4, height: 10 }}>
                            <div style={{ border: "1.5px dashed #64748b", borderRadius: 2 }} />
                            <div style={{ border: "1.5px dashed #64748b", borderRadius: 2 }} />
                          </div>
                          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 4, flex: 1 }}>
                            <div style={{ border: "1.5px dashed #94a3b8", borderRadius: 3 }} />
                            <div style={{ border: "1.5px dashed #94a3b8", borderRadius: 3 }} />
                          </div>
                        </div>
                      )}

                      {layoutItem.id === "title_only" && (
                        <div style={{ display: "flex", flexDirection: "column", height: "100%" }}>
                          <div style={{ width: "85%", height: 14, border: "1.5px dashed #64748b", borderRadius: 3 }} />
                        </div>
                      )}

                      {layoutItem.id === "blank" && (
                        <div style={{ height: "100%", width: "100%" }} />
                      )}

                      {layoutItem.id === "content_caption" && (
                        <div style={{ display: "grid", gridTemplateColumns: "35% 1fr", gap: 6, height: "100%" }}>
                          <div style={{ border: "1.5px dashed #64748b", borderRadius: 3, padding: 2 }}>
                            <div style={{ width: "80%", height: 8, background: "#cbd5e1", borderRadius: 1 }} />
                          </div>
                          <div style={{ border: "1.5px dashed #94a3b8", borderRadius: 3, display: "flex", alignItems: "center", justifyContent: "center" }}>
                            <span style={{ fontSize: 9, opacity: 0.6 }}>📊</span>
                          </div>
                        </div>
                      )}

                      {layoutItem.id === "picture_caption" && (
                        <div style={{ display: "grid", gridTemplateColumns: "35% 1fr", gap: 6, height: "100%" }}>
                          <div style={{ border: "1.5px dashed #64748b", borderRadius: 3, padding: 2 }}>
                            <div style={{ width: "80%", height: 8, background: "#cbd5e1", borderRadius: 1 }} />
                          </div>
                          <div style={{ border: "1.5px dashed #94a3b8", borderRadius: 3, display: "flex", alignItems: "center", justifyContent: "center" }}>
                            <span style={{ fontSize: 10, opacity: 0.6 }}>🖼️</span>
                          </div>
                        </div>
                      )}
                    </div>

                    {/* CARD TITLE */}
                    <div style={{ fontSize: 12, fontWeight: 700, color: isActive ? "#c084fc" : "#ffffff", textAlign: "center" }}>
                      {layoutItem.label}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
