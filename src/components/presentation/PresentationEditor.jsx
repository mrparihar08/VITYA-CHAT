import React, { useState, useEffect } from "react";
import EditorTopBar from "./editor/EditorTopBar";
import SlideSidebar from "./editor/SlideSidebar";
import CanvasWorkspace from "./editor/CanvasWorkspace";
import PropertiesPanel from "./editor/PropertiesPanel";
import BottomToolbar from "./editor/BottomToolbar";
import ZoomControls from "./editor/ZoomControls";
import PresentModal from "./editor/PresentModal";
import ExportModal from "./editor/ExportModal";
import AiRefineModal from "./editor/AiRefineModal";
import AIDesignCheckModal from "./editor/AIDesignCheckModal";
import SavedPresentationsModal from "./editor/SavedPresentationsModal";
import ShapeCatalogModal from "./editor/ShapeCatalogModal";
import VoiceoverStudioModal from "./editor/VoiceoverStudioModal";
import ToastNotification from "./editor/ToastNotification";
import { SAMPLE_SLIDES, THEME_OPTIONS } from "./editor/editorState";
import { calculateTextAutoHeight, fitElementHeightToText } from "./editor/textHeightUtils";
import "./editor/PresentationEditor.css";

export { calculateTextAutoHeight, fitElementHeightToText };


// EXPORT CONSTANTS FOR COMPATIBILITY WITH PRESENTATION.JSX & SETUP
export const BACKGROUND_PRESETS = [
  { id: "none", name: "🚫 None", bg: "linear-gradient(135deg, #0f172a 0%, #1e1b4b 100%)", text: "#ffffff", accent: "#c084fc", solid_bg: "#0f172a", bg_start: "#0f172a", bg_end: "#1e1b4b" },
  { id: "dark_gradient", name: "Midnight Purple", bg: "linear-gradient(135deg, #0f172a 0%, #1e1b4b 50%, #31104b 100%)", text: "#ffffff", accent: "#c084fc", solid_bg: "#0f172a", bg_start: "#0f172a", bg_end: "#31104b" },
  { id: "light", name: "Crisp Light", bg: "linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)", text: "#0f172a", accent: "#2563eb", solid_bg: "#f8fafc", bg_start: "#f8fafc", bg_end: "#e2e8f0" },
  { id: "midnight", name: "Midnight Deep", bg: "linear-gradient(135deg, #0f172a 0%, #31104b 100%)", text: "#ffffff", accent: "#c084fc", solid_bg: "#0f172a", bg_start: "#0f172a", bg_end: "#31104b" },
  { id: "purple", name: "Deep Purple", bg: "linear-gradient(135deg, #1e1b4b 0%, #31104b 100%)", text: "#ffffff", accent: "#c084fc", solid_bg: "#1e1b4b", bg_start: "#1e1b4b", bg_end: "#31104b" },
  { id: "blue", name: "Deep Blue", bg: "linear-gradient(135deg, #06101e 0%, #134074 100%)", text: "#ffffff", accent: "#60a5fa", solid_bg: "#06101e", bg_start: "#06101e", bg_end: "#134074" },
  { id: "ocean_blue", name: "Ocean Breeze", bg: "linear-gradient(135deg, #06101e 0%, #0b2545 50%, #134074 100%)", text: "#ffffff", accent: "#38bdf8", solid_bg: "#06101e", bg_start: "#06101e", bg_end: "#134074" },
  { id: "emerald", name: "Emerald Forest", bg: "linear-gradient(135deg, #022c22 0%, #047857 100%)", text: "#ffffff", accent: "#34d399", solid_bg: "#022c22", bg_start: "#022c22", bg_end: "#047857" },
  { id: "emerald_dark", name: "Emerald Forest Dark", bg: "linear-gradient(135deg, #022c22 0%, #064e3b 50%, #047857 100%)", text: "#ffffff", accent: "#34d399", solid_bg: "#022c22", bg_start: "#022c22", bg_end: "#047857" },
  { id: "cyberpunk_neon", name: "Cyberpunk Neon", bg: "linear-gradient(135deg, #09090b 0%, #2e1065 50%, #581c87 100%)", text: "#ffffff", accent: "#f43f5e", solid_bg: "#09090b", bg_start: "#09090b", bg_end: "#581c87" },
  { id: "wall_street", name: "Wall Street Finance", bg: "linear-gradient(135deg, #022c22 0%, #0f172a 50%, #1e293b 100%)", text: "#ffffff", accent: "#10b981", solid_bg: "#022c22", bg_start: "#022c22", bg_end: "#1e293b" },
  { id: "executive_gold", name: "Executive Gold", bg: "linear-gradient(135deg, #1c1917 0%, #78350f 100%)", text: "#ffffff", accent: "#fbbf24", solid_bg: "#1c1917", bg_start: "#1c1917", bg_end: "#78350f" },
  { id: "velvet_rose", name: "Velvet Rose", bg: "linear-gradient(135deg, #2a0813 0%, #881337 100%)", text: "#ffffff", accent: "#fb7185", solid_bg: "#2a0813", bg_start: "#2a0813", bg_end: "#881337" },
  { id: "slate", name: "Slate Charcoal", bg: "linear-gradient(135deg, #18181b 0%, #3f3f46 100%)", text: "#ffffff", accent: "#6366f1", solid_bg: "#18181b", bg_start: "#18181b", bg_end: "#3f3f46" },
  { id: "titanium_white", name: "Titanium White", bg: "linear-gradient(135deg, #ffffff 0%, #f4f4f5 100%)", text: "#18181b", accent: "#4f46e5", solid_bg: "#ffffff", bg_start: "#ffffff", bg_end: "#f4f4f5" },
  { id: "sunset_glow", name: "Sunset Glow", bg: "linear-gradient(135deg, #2e1065 0%, #9f1239 100%)", text: "#ffffff", accent: "#fb7185", solid_bg: "#2e1065", bg_start: "#2e1065", bg_end: "#9f1239" },
  { id: "ai", name: "AI Tech Neon", bg: "linear-gradient(135deg, #0f172a 0%, #31104b 100%)", text: "#f8fafc", accent: "#c084fc", solid_bg: "#0f172a", bg_start: "#0f172a", bg_end: "#31104b" },
  { id: "data", name: "Data Analytics", bg: "linear-gradient(135deg, #1e1b4b 0%, #31104b 100%)", text: "#ffffff", accent: "#c084fc", solid_bg: "#1e1b4b", bg_start: "#1e1b4b", bg_end: "#31104b" },
  { id: "startup", name: "Startup Pitch", bg: "linear-gradient(135deg, #1e1b4b 0%, #7c2d12 100%)", text: "#ffffff", accent: "#f97316", solid_bg: "#1e1b4b", bg_start: "#1e1b4b", bg_end: "#7c2d12" },
  { id: "education", name: "Academic Gold", bg: "linear-gradient(135deg, #fffbeb 0%, #fef3c7 100%)", text: "#451f00", accent: "#d97706", solid_bg: "#fffbeb", bg_start: "#fffbeb", bg_end: "#fef3c7" },
  { id: "finance", name: "Finance Growth", bg: "linear-gradient(135deg, #0f172a 0%, #14532d 100%)", text: "#ffffff", accent: "#34d399", solid_bg: "#0f172a", bg_start: "#0f172a", bg_end: "#14532d" },
  { id: "medical", name: "Healthcare Crimson", bg: "linear-gradient(135deg, #fff1f2 0%, #ffe4e6 100%)", text: "#4c0519", accent: "#e11d48", solid_bg: "#fff1f2", bg_start: "#fff1f2", bg_end: "#ffe4e6" },
  { id: "royal_violet", name: "Royal Violet", bg: "linear-gradient(135deg, #2e1065 0%, #581c87 100%)", text: "#ffffff", accent: "#c084fc", solid_bg: "#2e1065", bg_start: "#2e1065", bg_end: "#581c87" },
  { id: "nordic_frost", name: "Nordic Frost", bg: "linear-gradient(135deg, #082f49 0%, #0c4a6e 100%)", text: "#ffffff", accent: "#38bdf8", solid_bg: "#082f49", bg_start: "#082f49", bg_end: "#0c4a6e" },
  { id: "amber_bronze", name: "Amber Bronze", bg: "linear-gradient(135deg, #291e10 0%, #451a03 100%)", text: "#ffffff", accent: "#f59e0b", solid_bg: "#291e10", bg_start: "#291e10", bg_end: "#451a03" },
  { id: "teal_cyan", name: "Teal Cyan", bg: "linear-gradient(135deg, #042f2e 0%, #134e4a 100%)", text: "#ffffff", accent: "#2dd4bf", solid_bg: "#042f2e", bg_start: "#042f2e", bg_end: "#134e4a" },
  { id: "slate_dark", name: "Slate Dark", bg: "linear-gradient(135deg, #0f172a 0%, #1e293b 100%)", text: "#ffffff", accent: "#94a3b8", solid_bg: "#0f172a", bg_start: "#0f172a", bg_end: "#1e293b" },
  { id: "monochrome_black", name: "Monochrome Black", bg: "linear-gradient(135deg, #000000 0%, #0f172a 100%)", text: "#ffffff", accent: "#e2e8f0", solid_bg: "#000000", bg_start: "#000000", bg_end: "#0f172a" },
  { id: "base_template", name: "Default Slate Teal", bg: "linear-gradient(135deg, #0f172a 0%, #115e59 100%)", text: "#ffffff", accent: "#2dd4bf", solid_bg: "#0f172a", bg_start: "#0f172a", bg_end: "#115e59" },
  { id: "sidebar_executive", name: "Executive Sidebar", bg: "linear-gradient(135deg, #0f172a 0%, #1e293b 100%)", text: "#ffffff", accent: "#38bdf8", solid_bg: "#0f172a", bg_start: "#0f172a", bg_end: "#1e293b" },
  { id: "corporate_light", name: "Corporate Light", bg: "linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)", text: "#0f172a", accent: "#0284c7", solid_bg: "#f8fafc", bg_start: "#f8fafc", bg_end: "#e2e8f0" },
  { id: "corporate_banner", name: "Corporate Banner", bg: "linear-gradient(135deg, #0f172a 0%, #1e293b 100%)", text: "#ffffff", accent: "#2563eb", solid_bg: "#0f172a", bg_start: "#0f172a", bg_end: "#1e293b" },
  { id: "ion_boardroom", name: "Ion Boardroom", bg: "linear-gradient(135deg, #090d16 0%, #31104b 100%)", text: "#ffffff", accent: "#ec4899", solid_bg: "#090d16", bg_start: "#090d16", bg_end: "#31104b" },
  { id: "berlin_executive", name: "Berlin Executive", bg: "linear-gradient(135deg, #18181b 0%, #27272a 100%)", text: "#ffffff", accent: "#f97316", solid_bg: "#18181b", bg_start: "#18181b", bg_end: "#27272a" },
  { id: "quotable_teal", name: "Quotable Teal", bg: "linear-gradient(135deg, #042f2e 0%, #0f766e 100%)", text: "#ffffff", accent: "#06b6d4", solid_bg: "#042f2e", bg_start: "#042f2e", bg_end: "#0f766e" },
  { id: "geometric_block", name: "Geometric Block", bg: "linear-gradient(135deg, #3b0764 0%, #1e1b4b 100%)", text: "#ffffff", accent: "#3b82f6", solid_bg: "#3b0764", bg_start: "#3b0764", bg_end: "#1e1b4b" },
  { id: "urban_monochrome", name: "Urban Monochrome", bg: "linear-gradient(135deg, #0f172a 0%, #334155 100%)", text: "#ffffff", accent: "#38bdf8", solid_bg: "#0f172a", bg_start: "#0f172a", bg_end: "#334155" },
  { id: "crop_frame", name: "Crop Bracket", bg: "linear-gradient(135deg, #1c1917 0%, #292524 100%)", text: "#ffffff", accent: "#e7e5e4", solid_bg: "#1c1917", bg_start: "#1c1917", bg_end: "#292524" },
  { id: "circuit_tech", name: "Circuit Tech Cyber", bg: "linear-gradient(135deg, #09090b 0%, #581c87 100%)", text: "#ffffff", accent: "#22d3ee", solid_bg: "#09090b", bg_start: "#09090b", bg_end: "#581c87" },
  { id: "cyber_neon", name: "Cyberpunk Neon Glow", bg: "linear-gradient(135deg, #050505 0%, #2e0854 100%)", text: "#ffffff", accent: "#00ffcc", solid_bg: "#050505", bg_start: "#050505", bg_end: "#2e0854" },
  { id: "celestial_night", name: "Celestial Night", bg: "linear-gradient(135deg, #090d18 0%, #1e1b4b 100%)", text: "#ffffff", accent: "#818cf8", solid_bg: "#090d18", bg_start: "#090d18", bg_end: "#1e1b4b" },
  { id: "modern_glassmorphism", name: "Modern Glassmorphism", bg: "linear-gradient(135deg, #18181b 0%, #27272a 100%)", text: "#ffffff", accent: "#c084fc", solid_bg: "#18181b", bg_start: "#18181b", bg_end: "#27272a" },
  { id: "artistic_neon", name: "Artistic Neon", bg: "linear-gradient(135deg, #09090b 0%, #2e1065 100%)", text: "#ffffff", accent: "#ff5e00", solid_bg: "#09090b", bg_start: "#09090b", bg_end: "#2e1065" },
  { id: "atlas_bold", name: "Atlas Crimson", bg: "linear-gradient(135deg, #450a0a 0%, #1c1917 100%)", text: "#ffffff", accent: "#ef4444", solid_bg: "#450a0a", bg_start: "#450a0a", bg_end: "#1c1917" },
  { id: "organic_pastel", name: "Organic Pastel", bg: "linear-gradient(135deg, #14532d 0%, #1c1917 100%)", text: "#ffffff", accent: "#86efac", solid_bg: "#14532d", bg_start: "#14532d", bg_end: "#1c1917" },
  { id: "emerald_nature", name: "Emerald Nature", bg: "linear-gradient(135deg, #064e3b 0%, #022c22 100%)", text: "#ffffff", accent: "#10b981", solid_bg: "#064e3b", bg_start: "#064e3b", bg_end: "#022c22" },
  { id: "dividend_burgundy", name: "Dividend Burgundy", bg: "linear-gradient(135deg, #4a044e 0%, #1e1b4b 100%)", text: "#ffffff", accent: "#f43f5e", solid_bg: "#4a044e", bg_start: "#4a044e", bg_end: "#1e1b4b" },
  { id: "savon_classic", name: "Savon Classic", bg: "linear-gradient(135deg, #3f3f46 0%, #18181b 100%)", text: "#ffffff", accent: "#a1a1aa", solid_bg: "#3f3f46", bg_start: "#3f3f46", bg_end: "#18181b" },
  { id: "wood_type", name: "Wood Type Vintage", bg: "linear-gradient(135deg, #451a03 0%, #1c1917 100%)", text: "#ffffff", accent: "#f59e0b", solid_bg: "#451a03", bg_start: "#451a03", bg_end: "#1c1917" }
];

export const TABLE_THEME_PRESETS = [
  { id: "dark_gradient", name: "Midnight Purple", header_bg: "#8b5cf6", header_color: "#ffffff", cell_bg: "#1e293b", cell_color: "#ffffff" },
  { id: "ocean_blue", name: "Ocean Breeze", header_bg: "#0284c7", header_color: "#ffffff", cell_bg: "#0b2545", cell_color: "#ffffff" },
  { id: "emerald_dark", name: "Emerald Forest", header_bg: "#059669", header_color: "#ffffff", cell_bg: "#064e3b", cell_color: "#ffffff" }
];

export const THEME_DESIGN_SYSTEMS = {
  dark_gradient: { name: "Midnight Purple", font_family: "Inter", font_color: "#ffffff", accent_color: "#c084fc" },
  ocean_blue: { name: "Ocean Breeze", font_family: "Inter", font_color: "#ffffff", accent_color: "#38bdf8" },
  emerald_dark: { name: "Emerald Forest", font_family: "Inter", font_color: "#ffffff", accent_color: "#34d399" }
};

export function getThemeDesignSystem(presetId, selectedBgConfig) {
  return THEME_DESIGN_SYSTEMS[presetId] || { name: "Modern Clean", font_family: "Inter", font_color: "#ffffff", accent_color: "#c084fc" };
}

export const MASTER_TEMPLATE_LAYOUT_SYSTEMS = {
  base_template: { id: "base_template", name: "Default Widescreen", frameType: "standard_clean", accent: "#38bdf8" },
  corporate_light: { id: "corporate_light", name: "Corporate Light", frameType: "corporate_clean", accent: "#0284c7" }
};

export function getMasterTemplateLayout(templateName, selectedBgConfig) {
  return MASTER_TEMPLATE_LAYOUT_SYSTEMS[templateName] || MASTER_TEMPLATE_LAYOUT_SYSTEMS.base_template;
}

export function fixElementAntiOverlap(elements, isTitleSlide = false) {
  if (!Array.isArray(elements) || elements.length === 0) return elements;

  // Deduplicate identical text/bullet elements on the same slide
  const uniqueList = [];
  const seenContents = new Set();

  elements.forEach((el) => {
    if (!el) return;
    const textStr = String(el.content || el.text || (el.points ? el.points.join("\n") : "")).trim();
    const isTextOrBullet = el.type === "text" || el.type === "bullets" || el.type === "paragraph";

    if (isTextOrBullet && textStr && textStr.length > 15) {
      const key = `${el.type}:${textStr.toLowerCase()}`;
      if (seenContents.has(key)) {
        return; // Skip duplicate text element!
      }
      seenContents.add(key);
    }
    uniqueList.push({ ...el });
  });

  const list = uniqueList;

  // Find title & subtitle elements if present
  const titleIndex = list.findIndex(
    (el) => el.id?.includes("title") || el.type === "title" || (el.fontSize && el.fontSize >= 28)
  );
  const subIndex = list.findIndex(
    (el, idx) =>
      idx !== titleIndex &&
      (el.id?.includes("sub") || el.type === "subtitle" || (el.fontSize && el.fontSize >= 14 && el.fontSize <= 24))
  );

  const titleEl = titleIndex !== -1 ? list[titleIndex] : null;
  const subEl = subIndex !== -1 ? list[subIndex] : null;

  const isHeroSlide = isTitleSlide || (titleEl && subEl && list.length <= 4);

  if (isHeroSlide && titleEl) {
    const titleText = String(titleEl.content || titleEl.text || "").trim();
    titleEl.x = titleEl.x !== undefined ? Number(titleEl.x) : 8;
    titleEl.width = titleEl.width !== undefined ? Number(titleEl.width) : 84;
    
    // Position title vertically centered on cover slide
    titleEl.y = isTitleSlide ? 24 : 10;

    // Scale font size dynamically with executive impact
    if (titleText.length > 70) {
      titleEl.fontSize = 28;
    } else if (titleText.length > 45) {
      titleEl.fontSize = 32;
    } else if (titleText.length > 25) {
      titleEl.fontSize = 36;
    } else {
      titleEl.fontSize = 42;
    }
    titleEl.fontWeight = titleEl.fontWeight || "800";

    // Dynamic height based on exact title content and font size to hug text
    if (!titleEl.customHeight) {
      titleEl.height = calculateTextAutoHeight(titleText, titleEl.fontSize, titleEl.width);
    }

    if (subEl) {
      subEl.x = subEl.x !== undefined ? Number(subEl.x) : 8;
      // Position Subtitle cleanly below Title with safe gap!
      subEl.y = titleEl.y + titleEl.height + 2;
      subEl.width = subEl.width !== undefined ? Number(subEl.width) : 84;
      const subText = String(subEl.content || subEl.text || "").trim();
      subEl.fontSize = subText.length > 60 ? 16 : (subEl.fontSize || 18);
      if (!subEl.customHeight) {
        subEl.height = calculateTextAutoHeight(subText, subEl.fontSize, subEl.width);
      }
    }
  }

  // General sequential Y anti-overlap check for remaining elements
  list.forEach((el, idx) => {
    const elType = el.type || "text";
    const textStr = String(el.content || el.text || "").trim();

    let estHeight = Number(el.height) || 12;

    if (elType === "text" || elType === "paragraph" || elType === "title" || elType === "subtitle") {
      const autoH = calculateTextAutoHeight(textStr, Number(el.fontSize) || 16, Number(el.width) || 80);
      estHeight = el.customHeight && Number(el.height) ? Number(el.height) : autoH;
    } else if (elType === "bullets") {
      const ptsCount = (el.points || []).length || 3;
      estHeight = el.customHeight && Number(el.height) ? Number(el.height) : Math.max(16, 8 + ptsCount * 6);
    } else if (elType === "diagram" || elType === "roadmap") {
      const rawDiagType = String(
        el.diagram_type || el.diagramType || el.data?.diagram_type || el.data?.diagramType || (elType === "roadmap" ? "timeline" : "flowchart")
      ).toLowerCase();
      const isHorizontalFlow = ["flowchart", "timeline", "process", "roadmap", "io_cards", "io", "steps", "workflow"].some(k => rawDiagType.includes(k));
      const defaultDiagH = isHorizontalFlow ? 13 : 32;
      estHeight = el.customHeight && Number(el.height) ? Number(el.height) : defaultDiagH;
    } else if (["chart", "table", "kpi_grid"].includes(elType)) {
      estHeight = el.customHeight && Number(el.height) ? Number(el.height) : Math.min(68, Number(el.height) || 32);
    }
    el.height = estHeight;

    if (idx === 0) {
      if (el.y === undefined) el.y = isHeroSlide ? 10 : 6;
    } else {
      const elX = Number(el.x !== undefined ? el.x : 6);
      const elW = Number(el.width !== undefined ? el.width : 80);

      let minYForEl = 6;
      for (let prevIdx = 0; prevIdx < idx; prevIdx++) {
        const prevEl = list[prevIdx];
        const prevX = Number(prevEl.x !== undefined ? prevEl.x : 6);
        const prevW = Number(prevEl.width !== undefined ? prevEl.width : 80);

        // Only enforce vertical stack if elements overlap horizontally!
        const hasHOverlap = (elX < prevX + prevW) && (prevX < elX + elW);
        if (hasHOverlap) {
          const prevY = Number(prevEl.y !== undefined ? prevEl.y : 6);
          const prevH = Number(prevEl.height || 20);
          const neededY = prevY + prevH + 3;
          if (neededY > minYForEl) {
            minYForEl = neededY;
          }
        }
      }

      if (el.y === undefined || (minYForEl > 6 && Number(el.y) < minYForEl)) {
        el.y = Math.round(minYForEl * 10) / 10;
      }

      if (["diagram", "roadmap", "chart", "table"].includes(elType) && el.y > 54) {
        el.y = 44;
      }
    }
  });

  return list;
}

// ---------------------------------------------------------------------
// Mixed Layout Resolver (1:1 mathematical port of backend geometry.py)
// ---------------------------------------------------------------------
export function resolveLayoutBoxes(pluginTypes, layout = null) {
  if (!pluginTypes || pluginTypes.length === 0) return [];
  const count = pluginTypes.length;

  if (count === 1) {
    if (layout === "blank") {
      return [{ x: 6, y: 10, width: 88, height: 80 }];
    }
    return [{ x: 6, y: 22, width: 88, height: 68 }];
  }

  // 2 items: Side-by-side or content caption
  if (
    layout === "two_content" ||
    layout === "comparison" ||
    layout === "two_column" ||
    (count === 2 && layout !== "content_caption" && layout !== "picture_caption")
  ) {
    const hasVisual = pluginTypes.some((k) =>
      ["image", "chart", "table", "code_block", "speaker_card", "stat"].includes(k)
    );
    if (hasVisual || layout === "two_content" || layout === "comparison" || layout === "two_column") {
      return [
        { x: 6, y: 22, width: 42, height: 66 },
        { x: 52, y: 22, width: 42, height: 66 },
      ];
    } else {
      // 2 stacked rows
      const firstIsHorizontalDiag = ["diagram", "roadmap"].includes(pluginTypes[0]);
      if (firstIsHorizontalDiag) {
        return [
          { x: 6, y: 20, width: 88, height: 14 },
          { x: 6, y: 37, width: 88, height: 53 },
        ];
      }
      return [
        { x: 6, y: 20, width: 88, height: 32 },
        { x: 6, y: 55, width: 88, height: 35 },
      ];
    }
  }

  if (layout === "content_caption" || layout === "picture_caption") {
    if (count === 2) {
      if (layout === "picture_caption" && pluginTypes[0] === "image") {
        return [
          { x: 6, y: 22, width: 44, height: 64 },
          { x: 53, y: 22, width: 41, height: 64 },
        ];
      }
      return [
        { x: 6, y: 22, width: 48, height: 64 },
        { x: 57, y: 22, width: 37, height: 64 },
      ];
    }
  }

  // 3 items: 3 horizontal columns
  if (count === 3) {
    const hasCardsOrVisuals = pluginTypes.some((k) =>
      ["image", "chart", "stat", "speaker_card", "callout", "bullets", "paragraph"].includes(k)
    );
    if (hasCardsOrVisuals) {
      const colW = 27.4;
      const gap = 2.9;
      return [
        { x: 6.0, y: 22, width: colW, height: 66 },
        { x: 6.0 + colW + gap, y: 22, width: colW, height: 66 },
        { x: 6.0 + (colW + gap) * 2, y: 22, width: colW, height: 66 },
      ];
    } else {
      return [
        { x: 6, y: 20, width: 88, height: 21 },
        { x: 6, y: 44, width: 88, height: 21 },
        { x: 6, y: 68, width: 88, height: 23 },
      ];
    }
  }

  // 4 items: 2x2 grid
  if (count === 4) {
    return [
      { x: 6, y: 20, width: 42, height: 33 },
      { x: 52, y: 20, width: 42, height: 33 },
      { x: 6, y: 56, width: 42, height: 34 },
      { x: 52, y: 56, width: 42, height: 34 },
    ];
  }

  // > 4 items: proportional dynamic heights based on MixedLayoutResolver weights
  const weights = pluginTypes.map((k) => {
    if (["diagram", "image", "code_block"].includes(k)) return 1.2;
    if (["chart", "table"].includes(k)) return 1.4;
    if (["paragraph", "stat", "callout"].includes(k)) return 0.8;
    return 1.0;
  });
  const totalWeight = weights.reduce((a, b) => a + b, 0) || 1;
  const usableHeight = Math.max(20, 66 - 2.5 * (count - 1));

  const boxes = [];
  let currY = 22;
  for (let i = 0; i < count; i++) {
    const h = (usableHeight * weights[i]) / totalWeight;
    boxes.push({ x: 6, y: Math.round(currY * 10) / 10, width: 88, height: Math.round(h * 10) / 10 });
    currY += h + 2.5;
  }
  return boxes;
}

export function normalizeSlideElements(slide, index = 0) {
  if (!slide) return slide;

  const isTitleSlide = slide.layout === "title_slide" || slide.layout === "title_subtitle" || index === 0;
  const isLight = slide.background_theme?.includes("light") || slide.bg_color === "#ffffff" || slide.bg_color === "#f8fafc";
  const defaultCardBg = isLight ? "rgba(255, 255, 255, 0.9)" : "rgba(30, 41, 59, 0.65)";
  const defaultTextColor = slide.text_color || (isLight ? "#0f172a" : "#ffffff");
  const defaultAccentColor = slide.accent_color || "#c084fc";

  const existingElements = Array.isArray(slide.elements) && slide.elements.length > 0 ? slide.elements : null;

  if (existingElements) {
    // Check if existing elements were naively stacked down a single vertical line
    const visualPlugins = (slide.plugins || []).filter((p) => p && !["notes", "speaker_notes"].includes(p.type));
    const nonTitleElements = existingElements.filter((el) => el.type !== "title" && !el.id?.includes("title") && !el.id?.includes("sub"));
    const isNaiveVerticalStack = nonTitleElements.length >= 2 && nonTitleElements.every((el) => (el.width || 80) >= 75 && (el.x || 0) <= 12);

    if (isNaiveVerticalStack && visualPlugins.length >= 2) {
      const boxes = resolveLayoutBoxes(visualPlugins.map((p) => p.type), slide.layout);
      let bIdx = 0;
      const updatedElements = existingElements.map((el) => {
        const isTitleOrSub = el.type === "title" || el.id?.includes("title") || el.id?.includes("sub");
        if (!isTitleOrSub && bIdx < boxes.length) {
          const box = boxes[bIdx++];
          return {
            ...el,
            x: box.x,
            y: box.y,
            width: box.width,
            height: box.height,
            bg_color: el.bg_color || defaultCardBg,
            borderRadius: el.borderRadius || 8,
          };
        }
        const isTextEl = ["text", "title", "subtitle", "paragraph"].includes(el.type || "text");
        const str = String(el.content || el.text || "").trim();
        const autoH = isTextEl && str ? calculateTextAutoHeight(str, el.fontSize, el.width) : null;
        return {
          ...el,
          x: el.x !== undefined ? Number(el.x) : (isTitleSlide ? 8 : 6),
          y: el.y !== undefined ? Number(el.y) : (isTitleSlide ? 24 : 8),
          width: el.width !== undefined ? Number(el.width) : (isTitleSlide ? 84 : 88),
          height: el.customHeight ? Number(el.height) : (autoH || (el.height !== undefined ? Number(el.height) : (isTitleSlide ? 12 : 7.8))),
        };
      });
      return { ...slide, elements: fixElementAntiOverlap(updatedElements, isTitleSlide) };
    }

    const updatedElements = existingElements.map((el, i) => {
      const isTextEl = ["text", "title", "subtitle", "paragraph"].includes(el.type || "text");
      const str = String(el.content || el.text || "").trim();
      const autoH = isTextEl && str ? calculateTextAutoHeight(str, el.fontSize, el.width) : null;
      const isHorizontalDiag = (el.type === "diagram" || el.type === "roadmap") && (
        ["flowchart", "timeline", "process", "roadmap", "io_cards", "io", "steps", "workflow"].some(k => String(el.diagram_type || el.diagramType || el.data?.diagram_type || "").toLowerCase().includes(k)) ||
        !el.diagram_type
      );
      const defaultDiagHeight = isHorizontalDiag ? 13 : 20;
      const currentH = Number(el.height);
      const finalH = el.customHeight
        ? currentH
        : (autoH || (currentH && currentH !== 32 && currentH !== 38 ? currentH : defaultDiagHeight));

      return {
        ...el,
        x: el.x !== undefined ? Number(el.x) : 10,
        y: el.y !== undefined ? Number(el.y) : Math.min(80, 8 + i * 16),
        width: el.width !== undefined ? Number(el.width) : 80,
        height: finalH,
      };
    });
    return { ...slide, elements: fixElementAntiOverlap(updatedElements, isTitleSlide) };
  }

  const newElements = [];

  // 1. Slide Title (Cover vs Content positioning)
  if (slide.title) {
    const titleFSize = isTitleSlide ? 40 : 28;
    const titleW = isTitleSlide ? 84 : 88;
    const titleH = calculateTextAutoHeight(slide.title, titleFSize, titleW);
    newElements.push({
      id: `el-title-${Date.now()}-${index}`,
      type: "text",
      x: isTitleSlide ? 8 : 6,
      y: isTitleSlide ? 24 : 8,
      width: titleW,
      height: titleH,
      content: slide.title,
      fontSize: titleFSize,
      fontWeight: isTitleSlide ? "800" : "700",
      color: defaultTextColor,
      align: isTitleSlide ? "center" : (slide.title_align || "left")
    });
  }

  // 2. Slide Subtitle (Cover vs Content positioning)
  if (slide.subtitle) {
    const subFSize = isTitleSlide ? 18 : 15;
    const subW = isTitleSlide ? 80 : 88;
    const subH = calculateTextAutoHeight(slide.subtitle, subFSize, subW);
    newElements.push({
      id: `el-sub-${Date.now()}-${index}`,
      type: "text",
      x: isTitleSlide ? 10 : 6,
      y: isTitleSlide ? 38 : 16,
      width: subW,
      height: subH,
      content: slide.subtitle,
      fontSize: subFSize,
      fontWeight: "400",
      color: defaultAccentColor,
      align: isTitleSlide ? "center" : (slide.subtitle_align || "left")
    });
  }

  // 3. Slide Content & Visual Plugins (Multi-Column Layout via resolveLayoutBoxes)
  const plugins = Array.isArray(slide.plugins) && slide.plugins.length > 0 ? slide.plugins : [];
  const visualPlugins = plugins.filter((p) => p && !["notes", "speaker_notes"].includes(p.type));

  if (visualPlugins.length > 0) {
    const boxes = resolveLayoutBoxes(visualPlugins.map((p) => p.type), slide.layout);

    visualPlugins.forEach((p, pIdx) => {
      const pType = p.type;
      const pData = p.data || {};
      const elId = `el-plugin-${Date.now()}-${index}-${pIdx}`;
      const box = boxes[pIdx] || { x: 6, y: 22, width: 88, height: 66 };

      // Allow explicit plugin box coordinates if specified in plan (handling both inch and % systems)
      const boxCoord = pData.box || {};
      const hasBox = (typeof boxCoord.width === "number" && !isNaN(boxCoord.width)) || (typeof pData.width === "number" && !isNaN(pData.width));
      const isInchCoord = hasBox && (
        (typeof boxCoord.width === "number" && boxCoord.width <= 13.333 && boxCoord.width > 0) ||
        (typeof pData.width === "number" && pData.width <= 13.333 && pData.width > 0)
      );

      const rawX = typeof boxCoord.left === "number" ? boxCoord.left : (typeof pData.left === "number" ? pData.left : box.x);
      const rawY = typeof boxCoord.top === "number" ? boxCoord.top : (typeof pData.top === "number" ? pData.top : box.y);
      const rawW = typeof boxCoord.width === "number" ? boxCoord.width : (typeof pData.width === "number" ? pData.width : box.width);
      const rawH = typeof boxCoord.height === "number" ? boxCoord.height : (typeof pData.height === "number" ? pData.height : box.height);

      const elX = isInchCoord ? Math.round((rawX / 13.333) * 1000) / 10 : (typeof rawX === "number" && !isNaN(rawX) ? rawX : box.x);
      const elY = isInchCoord ? Math.round((rawY / 7.5) * 1000) / 10 : (typeof rawY === "number" && !isNaN(rawY) ? rawY : box.y);
      const elW = isInchCoord ? Math.round((rawW / 13.333) * 1000) / 10 : (typeof rawW === "number" && !isNaN(rawW) ? rawW : box.width);
      const elH = isInchCoord ? Math.round((rawH / 7.5) * 1000) / 10 : (typeof rawH === "number" && !isNaN(rawH) ? rawH : box.height);

      if (pType === "bullets") {
        newElements.push({
          id: elId,
          pluginIndex: pIdx,
          type: "bullets",
          x: elX,
          y: elY,
          width: elW,
          height: elH,
          points: pData.points || slide.bullets || slide.points || ["Key takeaway point 1", "Key takeaway point 2"],
          title: pData.title || "",
          fontSize: 14,
          color: defaultTextColor,
          bg_color: defaultCardBg,
          borderRadius: 8,
          data: pData
        });
      } else if (pType === "image") {
        newElements.push({
          id: elId,
          pluginIndex: pIdx,
          type: "image",
          x: elX,
          y: elY,
          width: elW,
          height: elH,
          url: pData.url || pData.path || "https://images.unsplash.com/photo-1518770660439-4636190af475?w=800",
          caption: pData.caption || "",
          borderRadius: 8,
          data: pData
        });
      } else if (pType === "chart") {
        newElements.push({
          id: elId,
          pluginIndex: pIdx,
          type: "chart",
          x: elX,
          y: elY,
          width: elW,
          height: elH,
          chart_type: pData.chart_type || pData.chartType || "bar",
          title: pData.title || "Chart Analytics",
          labels: pData.labels || pData.categories || ["Q1", "Q2", "Q3", "Q4"],
          values: pData.values || [40, 65, 80, 95],
          bg_color: "rgba(15, 23, 42, 0.7)",
          borderRadius: 8,
          data: pData
        });
      } else if (["roadmap", "diagram", "process", "workflow", "timeline", "architecture", "cycle", "hierarchy"].includes(pType)) {
        const diagramStr = pData.diagram || pData.content || pData.text || pData.steps_str || "";
        let parsedPhases = (
          (pData.phases && pData.phases.length ? pData.phases : null) ||
          (pData.steps && pData.steps.length ? pData.steps : null) ||
          (pData.items && pData.items.length ? pData.items : null)
        );

        if ((!parsedPhases || !parsedPhases.length) && typeof diagramStr === "string" && diagramStr.trim()) {
          parsedPhases = diagramStr
            .split(/\s*(?:➔|➜|->|-->|→|⇒|\||\n|;)\s*/)
            .map((s) => s.replace(/\[|\]/g, "").trim())
            .filter(Boolean)
            .map((step, i) => ({
              phase: `Step ${i + 1}`,
              title: step,
              status: i === 0 ? "COMPLETED" : i === 1 ? "IN PROGRESS" : "PLANNED"
            }));
        }

        newElements.push({
          id: elId,
          pluginIndex: pIdx,
          type: "diagram",
          diagram_type: pData.diagram_type || pData.diagramType || (pType === "roadmap" ? "timeline" : "flowchart"),
          x: elX,
          y: elY,
          width: elW,
          height: elH,
          phases: parsedPhases && parsedPhases.length ? parsedPhases : [
            { phase: "Step 1", title: "Data Landscape", status: "COMPLETED" },
            { phase: "Step 2", title: "Business Value", status: "IN PROGRESS" },
            { phase: "Step 3", title: "Strategic Alignment", status: "PLANNED" },
            { phase: "Step 4", title: "Executive Impact", status: "PLANNED" }
          ],
          diagram: diagramStr,
          bg_color: defaultCardBg,
          borderRadius: 8,
          data: pData
        });
      } else if (pType === "table") {
        newElements.push({
          id: elId,
          pluginIndex: pIdx,
          type: "table",
          x: elX,
          y: elY,
          width: elW,
          height: elH,
          headers: pData.headers || ["Feature", "Standard", "Enterprise"],
          rows: pData.rows || [["Uptime", "99.9%", "99.99%"], ["Support", "Standard", "24/7 SLA"]],
          bg_color: "rgba(15, 23, 42, 0.7)",
          borderRadius: 8,
          data: pData
        });
      } else if (pType === "stat") {
        newElements.push({
          id: elId,
          pluginIndex: pIdx,
          type: "stat",
          x: elX,
          y: elY,
          width: elW,
          height: elH,
          number: pData.number || "95%",
          label: pData.label || "Performance Metric",
          sublabel: pData.sublabel || "",
          bg_color: defaultCardBg,
          borderRadius: 8,
          data: pData
        });
      } else if (pType === "callout") {
        newElements.push({
          id: elId,
          pluginIndex: pIdx,
          type: "callout",
          x: elX,
          y: elY,
          width: elW,
          height: elH,
          text: pData.text || pData.content || "Key Strategic Insight",
          title: pData.title || "KEY TAKEAWAY",
          icon: pData.icon || "💡",
          bg_color: "rgba(139, 92, 246, 0.15)",
          borderRadius: 8,
          data: pData
        });
      } else if (pType === "kpi_grid") {
        newElements.push({
          id: elId,
          pluginIndex: pIdx,
          type: "kpi_grid",
          x: elX,
          y: elY,
          width: elW,
          height: elH,
          kpis: pData.kpis || pData.items || [],
          bg_color: defaultCardBg,
          borderRadius: 8,
          data: pData
        });
      } else if (pType === "pros_cons") {
        newElements.push({
          id: elId,
          pluginIndex: pIdx,
          type: "pros_cons",
          x: elX,
          y: elY,
          width: elW,
          height: elH,
          pros: pData.pros || [],
          cons: pData.cons || [],
          data: pData
        });
      } else if (pType === "code_block") {
        newElements.push({
          id: elId,
          pluginIndex: pIdx,
          type: "code_block",
          x: elX,
          y: elY,
          width: elW,
          height: elH,
          code: pData.code || "",
          title: pData.title || "Snippet",
          language: pData.language || "python",
          bg_color: "#090d16",
          borderRadius: 8,
          data: pData
        });
      } else if (pType === "speaker_card") {
        newElements.push({
          id: elId,
          pluginIndex: pIdx,
          type: "speaker_card",
          x: elX,
          y: elY,
          width: elW,
          height: elH,
          name: pData.name || "Speaker",
          role: pData.role || "Keynote Presenter",
          bio: pData.bio || [],
          bg_color: defaultCardBg,
          borderRadius: 8,
          data: pData
        });
      } else if (pType === "split_layout" || pType === "split" || pType === "two_column_split") {
        const leftData = pData.left || {};
        const rightData = pData.right || {};
        const leftTitle = leftData.title || leftData.header || "Key Challenge & Context";
        const leftText = leftData.text || leftData.content || (Array.isArray(leftData.bullets) ? leftData.bullets.join("\n") : "");
        const rightTitle = rightData.title || rightData.header || "Strategic Response & Impact";
        const rightText = rightData.text || rightData.content || (Array.isArray(rightData.bullets) ? rightData.bullets.join("\n") : "");

        const splitItems = [
          { title: leftTitle, text: leftText || (slide.content ? String(slide.content).slice(0, 160) : "Critical regional infrastructure and environmental constraints requiring coordinated policy action.") },
          { title: rightTitle, text: rightText || (slide.subtitle ? String(slide.subtitle) : "Targeted ecological remediation frameworks and long-term sustainable development roadmap.") }
        ];

        newElements.push({
          id: elId,
          pluginIndex: pIdx,
          type: "paragraph_2col",
          x: elX,
          y: elY,
          width: elW,
          height: elH,
          items: splitItems,
          bg_color: defaultCardBg,
          borderRadius: 8,
          data: pData
        });
      } else if (pType === "bento_grid" || pType === "bento" || pType === "bento_box") {
        const rawCards = [];
        if (pData.hero && (pData.hero.title || pData.hero.text)) {
          rawCards.push({ title: pData.hero.title || "Core Focus Area", text: pData.hero.text || pData.hero.description || "" });
        }
        if (Array.isArray(pData.cards)) {
          pData.cards.forEach(c => {
            if (typeof c === "string") rawCards.push({ title: "Strategic Driver", text: c });
            else if (c) rawCards.push({ title: c.title || c.label || "Key Driver", text: c.text || c.content || c.description || "" });
          });
        }
        if (Array.isArray(pData.items)) {
          pData.items.forEach(c => {
            if (typeof c === "string") rawCards.push({ title: "Insight", text: c });
            else if (c) rawCards.push({ title: c.title || c.label || "Driver", text: c.text || c.content || c.description || "" });
          });
        }
        if (pData.feature && (pData.feature.title || pData.feature.text)) {
          rawCards.push({ title: pData.feature.title || "Key Capability", text: pData.feature.text || pData.feature.description || "" });
        }
        if (pData.stat && (pData.stat.number || pData.stat.label)) {
          rawCards.push({ title: `${pData.stat.number || "99.9%"} ${pData.stat.label || "Impact"}`, text: pData.stat.sublabel || pData.stat.context || "" });
        }

        const bentoItems = rawCards.length > 0 ? rawCards.slice(0, 4) : [
          { title: "Regional Governance", text: "Integrated administrative protocols and multi-tier institutional alignment." },
          { title: "Ecological Restoration", text: "Sustainable environmental conservation and proactive watershed management." },
          { title: "Resource Resilience", text: "Equitable infrastructure modernization and scalable clean energy adoption." }
        ];

        newElements.push({
          id: elId,
          pluginIndex: pIdx,
          type: "paragraph_2col",
          x: elX,
          y: elY,
          width: elW,
          height: elH,
          items: bentoItems,
          bg_color: defaultCardBg,
          borderRadius: 8,
          data: pData
        });
      } else if (pType === "process_flow" || pType === "pipeline" || pType === "journey") {
        const rawSteps = pData.steps || [];
        const parsedPhases = rawSteps.map((s, sIdx) => {
          if (typeof s === "string") {
            return { phase: `Step ${sIdx + 1}`, title: s, status: sIdx === 0 ? "COMPLETED" : sIdx === 1 ? "IN PROGRESS" : "PLANNED" };
          }
          return {
            phase: s.step_number ? `Step ${s.step_number}` : (s.badge || `Step ${sIdx + 1}`),
            title: s.title || s.name || s.description || `Step ${sIdx + 1}`,
            status: s.status || (sIdx === 0 ? "COMPLETED" : sIdx === 1 ? "IN PROGRESS" : "PLANNED"),
            description: s.description || ""
          };
        });

        newElements.push({
          id: elId,
          pluginIndex: pIdx,
          type: "diagram",
          diagram_type: "flowchart",
          x: elX,
          y: elY,
          width: elW,
          height: elH,
          phases: parsedPhases.length ? parsedPhases : [
            { phase: "Phase 1", title: "Diagnostic Assessment", status: "COMPLETED" },
            { phase: "Phase 2", title: "Strategic Execution", status: "IN PROGRESS" },
            { phase: "Phase 3", title: "Sustainable Governance", status: "PLANNED" }
          ],
          bg_color: defaultCardBg,
          borderRadius: 8,
          data: pData
        });
      } else if (pType === "paragraph_2col") {
        const rawItems = Array.isArray(pData.items) && pData.items.length > 0
          ? pData.items
          : [
              { title: pData.left_title || "Overview", text: pData.left_text || pData.text || "" },
              { title: pData.right_title || "Key Insight", text: pData.right_text || "" }
            ];
        newElements.push({
          id: elId,
          pluginIndex: pIdx,
          type: "paragraph_2col",
          x: elX,
          y: elY,
          width: elW,
          height: elH,
          items: rawItems,
          bg_color: defaultCardBg,
          borderRadius: 8,
          data: pData
        });
      } else {
        const rawContent = (
          pData.text ||
          pData.content ||
          pData.description ||
          (Array.isArray(pData.points) ? pData.points.join("\n") : null) ||
          slide.content ||
          (Array.isArray(slide.bullets) && slide.bullets.length ? slide.bullets.join("\n") : null) ||
          `Strategic overview, actionable analysis, and key domain considerations for ${slide.title || "this topic"}.`
        );
        newElements.push({
          id: elId,
          pluginIndex: pIdx,
          type: "paragraph",
          x: isNaN(elX) ? box.x : elX,
          y: isNaN(elY) ? box.y : elY,
          width: isNaN(elW) ? box.width : elW,
          height: isNaN(elH) ? box.height : elH,
          content: rawContent,
          fontSize: 15,
          color: defaultTextColor,
          bg_color: defaultCardBg,
          borderRadius: 8,
          data: pData
        });
      }
    });
  } else {
    // If slide has bullets and/or image without explicit plugins array:
    if (slide.bullets && slide.bullets.length > 0 && (slide.image_url || slide.image)) {
      newElements.push({
        id: `el-bullets-${Date.now()}-${index}`,
        type: "bullets",
        x: 6,
        y: 22,
        width: 42,
        height: 66,
        points: slide.bullets,
        fontSize: 14,
        color: defaultTextColor,
        bg_color: defaultCardBg,
        borderRadius: 8
      });
      newElements.push({
        id: `el-img-${Date.now()}-${index}`,
        type: "image",
        x: 52,
        y: 22,
        width: 42,
        height: 66,
        url: slide.image_url || slide.image || "https://images.unsplash.com/photo-1518770660439-4636190af475?w=800",
        borderRadius: 8
      });
    } else if (slide.bullets && slide.bullets.length > 0) {
      newElements.push({
        id: `el-bullets-${Date.now()}-${index}`,
        type: "bullets",
        x: 6,
        y: 22,
        width: 88,
        height: 66,
        points: slide.bullets,
        fontSize: 15,
        color: defaultTextColor,
        bg_color: defaultCardBg,
        borderRadius: 8
      });
    } else if (slide.content || slide.paragraph) {
      newElements.push({
        id: `el-content-${Date.now()}-${index}`,
        type: "paragraph",
        x: 6,
        y: 22,
        width: 88,
        height: 66,
        content: slide.content || slide.paragraph,
        fontSize: 15,
        color: defaultTextColor,
        bg_color: defaultCardBg,
        borderRadius: 8
      });
    }
  }

  // Guarantee that every non-title content slide has at least one body content element
  const hasBodyContent = newElements.some((e) =>
    ["bullets", "paragraph", "paragraph_2col", "diagram", "chart", "table", "image", "stat", "callout", "kpi_grid", "pros_cons", "code_block", "speaker_card"].includes(e.type)
  );

  if (!isTitleSlide && !hasBodyContent) {
    const fallbackText = slide.content || slide.subtitle || `Detailed strategic overview, domain background, and operational considerations for ${slide.title || "this section"}.`;
    newElements.push({
      id: `el-default-${Date.now()}-${index}`,
      type: "paragraph",
      x: 6,
      y: 24,
      width: 88,
      height: 55,
      content: fallbackText,
      fontSize: 15,
      color: defaultTextColor,
      bg_color: defaultCardBg,
      borderRadius: 8
    });
  }

  return {
    ...slide,
    elements: fixElementAntiOverlap(newElements, isTitleSlide)
  };
}

export default function PresentationEditor({
  plan,
  setPlan,
  activeSlideIndex = 0,
  setActiveSlideIndex,
  selectedBgPreset,
  setSelectedBgPreset,
  templateName,
  setTemplateName,
  savePresentation,
  downloadSavedPresentation,
  isSaving = false,
  isSaved = true,
  onBackToSetup,
  onNewDeck,
  onTriggerCacheCleanup,
  isCleaningCache = false
}) {
  // INTERNAL STATE MANAGEMENT
  const [internalSlides, setInternalSlides] = useState(() => {
    if (plan && Array.isArray(plan.slides) && plan.slides.length > 0) {
      return plan.slides.map((s, idx) => normalizeSlideElements(s, idx));
    }
    return SAMPLE_SLIDES.map((s, idx) => normalizeSlideElements(s, idx));
  });

  const [currentSlideIdx, setCurrentSlideIdx] = useState(activeSlideIndex || 0);
  const [selectedElementId, setSelectedElementId] = useState(null);
  const [zoom, setZoom] = useState(1.0);
  const [isPresenting, setIsPresenting] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  const [isAiRefineOpen, setIsAiRefineOpen] = useState(false);
  const [aiRefineInitialText, setAiRefineInitialText] = useState("");
  const [aiRefineInitialAction, setAiRefineInitialAction] = useState("polish");
  const [showLeftSidebar, setShowLeftSidebar] = useState(() => (typeof window !== "undefined" ? window.innerWidth > 900 : true));
  const [showRightSidebar, setShowRightSidebar] = useState(() => (typeof window !== "undefined" ? window.innerWidth > 1200 : true));
  const [isDesignCheckOpen, setIsDesignCheckOpen] = useState(false);
  const [isNotesOpen, setIsNotesOpen] = useState(false);

  // NEW MODALS & TOAST SYSTEM STATES 🚀
  const [isSavedDecksOpen, setIsSavedDecksOpen] = useState(false);
  const [isShapesCatalogOpen, setIsShapesCatalogOpen] = useState(false);
  const [isVoiceoverOpen, setIsVoiceoverOpen] = useState(false);
  const [toast, setToast] = useState(null);

  // KEYBOARD SHORTCUTS LISTENER ⌨️
  useEffect(() => {
    const handleKeyDown = (e) => {
      const isInput = ["INPUT", "TEXTAREA", "SELECT"].includes(document.activeElement?.tagName);
      if (isInput) return;

      if (e.key === "Delete" || e.key === "Backspace") {
        if (selectedElementId) {
          e.preventDefault();
          handleDeleteElement(selectedElementId);
          setToast({ type: "info", title: "Element Deleted", message: "Canvas element removed." });
        }
      } else if (e.key === "Escape") {
        setSelectedElementId(null);
      } else if (e.key === "F5") {
        e.preventDefault();
        setIsPresenting(true);
      } else if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "d") {
        if (selectedElementId) {
          e.preventDefault();
          handleDuplicateElement(selectedElementId);
          setToast({ type: "success", title: "Element Duplicated", message: "Created copy of element." });
        }
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedElementId]);


  const handleOpenAiRefine = (overrideText = null, action = "polish") => {
    const currentSlideEl = (currentSlide?.elements || []).find((el) => el.id === selectedElementId);
    const targetText = overrideText !== null 
      ? overrideText 
      : currentSlideEl?.content || currentSlideEl?.text || currentSlide?.title || plan?.title || "";
    setAiRefineInitialText(targetText);
    setAiRefineInitialAction(action || "polish");
    setIsAiRefineOpen(true);
  };

  const handleApplyAiRefine = (refinedResult, action, originalInputText = null) => {
    if (!refinedResult) return;
    const refinedText = typeof refinedResult.refined_text === "string" 
      ? refinedResult.refined_text 
      : typeof refinedResult.refined_text === "object"
      ? JSON.stringify(refinedResult.refined_text)
      : String(refinedResult.refined_text || "");

    const isDiagramAction = action === "diagram" || 
      (typeof refinedText === "string" && (refinedText.includes("➔") || refinedText.includes("->") || refinedText.includes("-->") || refinedText.includes("→")) && refinedText.includes("["));

    let parsedPhases = null;
    if (isDiagramAction) {
      if (Array.isArray(refinedResult.phases) && refinedResult.phases.length > 0) {
        parsedPhases = refinedResult.phases;
      } else if (Array.isArray(refinedResult.steps) && refinedResult.steps.length > 0) {
        parsedPhases = refinedResult.steps;
      } else if (typeof refinedText === "string" && refinedText.trim()) {
        const stepItems = refinedText
          .split(/\s*(?:➔|➜|->|-->|→|⇒|\||\n|;)\s*/)
          .map((s) => s.replace(/\[|\]/g, "").trim())
          .filter(Boolean);

        if (stepItems.length > 0) {
          parsedPhases = stepItems.map((step, i) => ({
            phase: `Step ${i + 1}`,
            title: step,
            status: i === 0 ? "COMPLETED" : i === 1 ? "IN PROGRESS" : "PLANNED"
          }));
        }
      }
    }

    const currentSlideElements = currentSlide?.elements || [];
    const sourceText = (originalInputText || aiRefineInitialText || "").trim();

    // 1. Identify which target element on the canvas to update
    let targetEl = null;
    if (selectedElementId) {
      targetEl = currentSlideElements.find((el) => el.id === selectedElementId);
    }

    // If no element currently selected, find element whose content matches the input text
    if (!targetEl && sourceText) {
      targetEl = currentSlideElements.find(
        (el) =>
          (el.content && el.content.trim() === sourceText) ||
          (el.text && el.text.trim() === sourceText)
      );
    }

    // If still not found, check if input was the slide title or action is headline / polish
    const isTitleTarget =
      !targetEl &&
      (action === "headline" ||
       action === "polish" ||
       (sourceText && currentSlide?.title && sourceText === currentSlide.title.trim()));

    if (!targetEl && isTitleTarget) {
      targetEl =
        currentSlideElements.find(
          (el) => el.isTitle || el.type === "title" || el.id?.includes("title") || (el.y !== undefined && el.y < 35)
        ) || currentSlideElements[0];
    }

    // 2. Perform the element update on slide canvas
    if (targetEl) {
      const isTitleElement =
        targetEl.isTitle ||
        targetEl.type === "title" ||
        targetEl.id?.includes("title") ||
        (currentSlide?.title && (targetEl.content === currentSlide.title || targetEl.text === currentSlide.title));

      if (isDiagramAction && parsedPhases) {
        handleUpdateElement(targetEl.id, {
          type: "diagram",
          diagram_type: "flowchart",
          phases: parsedPhases,
          diagram: refinedText,
          height: 14,
          customHeight: false,
          autoHeight: true
        });
      } else if (action === "bullets" || refinedText.includes("•")) {
        const points = refinedText.split("\n").map((s) => s.replace(/^[•\-*]\s*/, "").trim()).filter(Boolean);
        handleUpdateElement(targetEl.id, { type: "bullets", points, content: refinedText, text: refinedText });
      } else if (action === "chart" && refinedResult.refined_chart) {
        const c = refinedResult.refined_chart;
        handleUpdateElement(targetEl.id, {
          type: "chart",
          title: c.title || "Chart Analytics",
          labels: c.categories || ["Q1", "Q2", "Q3", "Q4"],
          values: c.values || [40, 60, 80, 95],
          chart_type: c.chart_type || "bar"
        });
      } else if (action === "image" && (refinedText.startsWith("http") || refinedResult.image_url)) {
        handleUpdateElement(targetEl.id, { type: "image", url: refinedResult.image_url || refinedText });
      } else {
        const autoH = calculateTextAutoHeight(refinedText, targetEl.font_size || 22, targetEl.width || 80);
        handleUpdateElement(targetEl.id, {
          content: refinedText,
          text: refinedText,
          height: autoH || targetEl.height || 10,
          autoHeight: true
        });
      }

      if (isTitleElement || action === "headline" || isTitleTarget) {
        handleUpdateSlide({ title: refinedText });
      }
    } else {
      // Fallback: If no elements exist on the slide yet
      if (action === "headline" || isTitleTarget) {
        handleUpdateSlide({ title: refinedText });
        handleAddElement("text", {
          content: refinedText,
          text: refinedText,
          isTitle: true,
          font_size: 28,
          x: 10,
          y: 20,
          width: 80
        });
      } else if (isDiagramAction && parsedPhases) {
        handleAddElement("diagram", {
          diagram_type: "flowchart",
          phases: parsedPhases,
          diagram: refinedText,
          height: 14,
          customHeight: false,
          autoHeight: true
        });
      } else if (action === "bullets" || refinedText.includes("•")) {
        const points = refinedText.split("\n").map((s) => s.replace(/^[•\-*]\s*/, "").trim()).filter(Boolean);
        handleAddElement("bullets", { points, content: refinedText });
      } else {
        handleAddElement("text", {
          content: refinedText,
          text: refinedText,
          font_size: 16,
          x: 10,
          y: 40,
          width: 80
        });
      }
    }

    setToast({
      type: "success",
      title: "AI Refine Applied",
      message: "Refined proposal successfully applied to the slide!"
    });
  };

  // Sync external plan changes into internal state
  useEffect(() => {
    if (plan && Array.isArray(plan.slides) && plan.slides.length > 0) {
      setInternalSlides(plan.slides.map((s, idx) => normalizeSlideElements(s, idx)));
    }
  }, [plan]);

  const slides = internalSlides;
  const currentSlide = slides[currentSlideIdx] || slides[0] || SAMPLE_SLIDES[0];

  const updateSlidesState = (newSlides) => {
    setInternalSlides(newSlides);
    if (setPlan) {
      setPlan((prev) => ({
        ...(prev || {}),
        title: prev?.title || "Artificial Intelligence & Enterprise Future Tech",
        slides: newSlides
      }));
    }
  };

  // SLIDE MANAGEMENT HANDLERS
  const handleSelectSlide = (index) => {
    setCurrentSlideIdx(index);
    if (setActiveSlideIndex) setActiveSlideIndex(index);
    setSelectedElementId(null);
  };

  const createElementsForLayout = (layoutId, count) => {
    const titleText = `Slide ${count}: Topic Title`;
    const titleAutoH = calculateTextAutoHeight(titleText, 28, 88);
    const timestamp = Date.now();

    switch (layoutId) {
      case "title_slide": {
        const coverTitle = `Presentation Title ${count}`;
        const coverSub = "Add subtitle or presenter information here...";
        return [
          {
            id: `el-${timestamp}-title`,
            type: "text",
            x: 10,
            y: 26,
            width: 80,
            height: calculateTextAutoHeight(coverTitle, 36, 80),
            content: coverTitle,
            fontSize: 36,
            fontWeight: "800",
            color: "#ffffff",
            align: "center"
          },
          {
            id: `el-${timestamp}-sub`,
            type: "text",
            x: 15,
            y: 42,
            width: 70,
            height: calculateTextAutoHeight(coverSub, 18, 70),
            content: coverSub,
            fontSize: 18,
            color: "#c084fc",
            align: "center"
          }
        ];
      }

      case "two_column":
        return [
          {
            id: `el-${timestamp}-title`,
            type: "text",
            x: 6,
            y: 8,
            width: 88,
            height: titleAutoH,
            content: titleText,
            fontSize: 28,
            fontWeight: "700",
            color: "#ffffff",
            align: "left"
          },
          {
            id: `el-${timestamp}-col1`,
            type: "text",
            x: 6,
            y: 20,
            width: 42,
            height: 66,
            content: "• Column 1 Key takeaway point\n• Operational workflow step\n• Strategic target metrics",
            fontSize: 15,
            color: "#cbd5e1",
            align: "left"
          },
          {
            id: `el-${timestamp}-col2`,
            type: "text",
            x: 52,
            y: 20,
            width: 42,
            height: 66,
            content: "• Column 2 Comparative analysis\n• Industry benchmark data\n• Future growth projection",
            fontSize: 15,
            color: "#cbd5e1",
            align: "left"
          }
        ];

      case "image":
        return [
          {
            id: `el-${timestamp}-title`,
            type: "text",
            x: 6,
            y: 8,
            width: 88,
            height: titleAutoH,
            content: titleText,
            fontSize: 28,
            fontWeight: "700",
            color: "#ffffff",
            align: "left"
          },
          {
            id: `el-${timestamp}-text`,
            type: "text",
            x: 6,
            y: 20,
            width: 42,
            height: 66,
            content: "Highlight key visual concepts, product details, or media descriptions in this text block.",
            fontSize: 15,
            color: "#cbd5e1",
            align: "left"
          },
          {
            id: `el-${timestamp}-img`,
            type: "image",
            x: 52,
            y: 20,
            width: 42,
            height: 66,
            url: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=800",
            caption: "Visual Media Feature Showcase"
          }
        ];

      case "chart":
        return [
          {
            id: `el-${timestamp}-title`,
            type: "text",
            x: 6,
            y: 8,
            width: 88,
            height: titleAutoH,
            content: titleText,
            fontSize: 28,
            fontWeight: "700",
            color: "#ffffff",
            align: "left"
          },
          {
            id: `el-${timestamp}-chart`,
            type: "chart",
            x: 6,
            y: 20,
            width: 88,
            height: 66,
            data: {
              title: "Performance & Conversion Metrics",
              items: [
                { label: "Q1", value: "45%" },
                { label: "Q2", value: "68%" },
                { label: "Q3", value: "82%" },
                { label: "Q4", value: "95%" }
              ]
            }
          }
        ];

      case "three_column":
        return [
          {
            id: `el-${timestamp}-title`,
            type: "text",
            x: 6,
            y: 8,
            width: 88,
            height: titleAutoH,
            content: titleText,
            fontSize: 28,
            fontWeight: "700",
            color: "#ffffff",
            align: "left"
          },
          {
            id: `el-${timestamp}-card1`,
            type: "text",
            x: 6,
            y: 22,
            width: 27,
            height: 64,
            content: "✦ Pillar 1: Architecture\n\nModular design separating ThemeConfig and Geometry calculations.",
            fontSize: 14,
            color: "#f8fafc",
            align: "left"
          },
          {
            id: `el-${timestamp}-card2`,
            type: "text",
            x: 36.5,
            y: 22,
            width: 27,
            height: 64,
            content: "✦ Pillar 2: Typography\n\nStandardized font scales enforcing contrast legibility rules.",
            fontSize: 14,
            color: "#f8fafc",
            align: "left"
          },
          {
            id: `el-${timestamp}-card3`,
            type: "text",
            x: 67,
            y: 22,
            width: 27,
            height: 64,
            content: "✦ Pillar 3: Validation\n\nAutomated boundary collision and safe-area checking.",
            fontSize: 14,
            color: "#f8fafc",
            align: "left"
          }
        ];

      case "quote":
        return [
          {
            id: `el-${timestamp}-title`,
            type: "text",
            x: 6,
            y: 8,
            width: 88,
            height: titleAutoH,
            content: titleText,
            fontSize: 28,
            fontWeight: "700",
            color: "#ffffff",
            align: "left"
          },
          {
            id: `el-${timestamp}-quote`,
            type: "text",
            x: 10,
            y: 28,
            width: 80,
            height: 36,
            content: '"Simplicity is the prerequisite for reliability."',
            fontSize: 28,
            fontWeight: "800",
            color: "#0d9488",
            align: "center"
          },
          {
            id: `el-${timestamp}-author`,
            type: "text",
            x: 10,
            y: 66,
            width: 80,
            height: 14,
            content: "— Edsger W. Dijkstra, Turing Award Lecture",
            fontSize: 16,
            color: "#94a3b8",
            align: "center"
          }
        ];

      case "statistics":
        return [
          {
            id: `el-${timestamp}-title`,
            type: "text",
            x: 6,
            y: 8,
            width: 88,
            height: titleAutoH,
            content: titleText,
            fontSize: 28,
            fontWeight: "700",
            color: "#ffffff",
            align: "left"
          },
          {
            id: `el-${timestamp}-stat1`,
            type: "stat",
            x: 6,
            y: 24,
            width: 27,
            height: 62,
            number: "99.9%",
            label: "Layout Accuracy",
            sublabel: "Zero placeholder collisions",
            color: "#0d9488"
          },
          {
            id: `el-${timestamp}-stat2`,
            type: "stat",
            x: 36.5,
            y: 24,
            width: 27,
            height: 62,
            number: "<45ms",
            label: "Compile Latency",
            sublabel: "Real-time generation",
            color: "#6366f1"
          },
          {
            id: `el-${timestamp}-stat3`,
            type: "stat",
            x: 67,
            y: 24,
            width: 27,
            height: 62,
            number: "100%",
            label: "16:9 Compliance",
            sublabel: "Widescreen standard",
            color: "#f43f5e"
          }
        ];

      case "comparison":
        return [
          {
            id: `el-${timestamp}-title`,
            type: "text",
            x: 6,
            y: 8,
            width: 88,
            height: titleAutoH,
            content: titleText,
            fontSize: 28,
            fontWeight: "700",
            color: "#ffffff",
            align: "left"
          },
          {
            id: `el-${timestamp}-left`,
            type: "text",
            x: 6,
            y: 22,
            width: 42,
            height: 64,
            content: "Option A: Legacy Placeholders\n\n• Unwanted template artifacts\n• Invisible placeholder collisions\n• Duplicate title areas",
            fontSize: 15,
            color: "#cbd5e1",
            align: "left"
          },
          {
            id: `el-${timestamp}-right`,
            type: "text",
            x: 52,
            y: 22,
            width: 42,
            height: 64,
            content: "Option B: Modern Blank Engine\n\n• Clean blank slides (layout 6)\n• Safe-area boundary validation\n• WCAG contrast compliance",
            fontSize: 15,
            color: "#2dd4bf",
            align: "left"
          }
        ];

      case "timeline":
        return [
          {
            id: `el-${timestamp}-title`,
            type: "text",
            x: 6,
            y: 8,
            width: 88,
            height: titleAutoH,
            content: titleText,
            fontSize: 28,
            fontWeight: "700",
            color: "#ffffff",
            align: "left"
          },
          {
            id: `el-${timestamp}-roadmap`,
            type: "roadmap",
            x: 6,
            y: 22,
            width: 88,
            height: 64,
            phases: [
              { phase: "Q1", title: "Architecture", desc: "Modularization of ThemeConfig and Geometry systems" },
              { phase: "Q2", title: "Layout Resolver", desc: "Intelligent content parsing and slide selection" },
              { phase: "Q3", title: "Validation Engine", desc: "Safe-area bounds and WCAG contrast verification" },
              { phase: "Q4", title: "Production Release", desc: "Full-stack PowerPoint template engine deployment" }
            ]
          }
        ];

      case "process":
        return [
          {
            id: `el-${timestamp}-title`,
            type: "text",
            x: 6,
            y: 8,
            width: 88,
            height: titleAutoH,
            content: titleText,
            fontSize: 28,
            fontWeight: "700",
            color: "#ffffff",
            align: "left"
          },
          {
            id: `el-${timestamp}-step1`,
            type: "text",
            x: 6,
            y: 24,
            width: 20,
            height: 60,
            content: "STEP 1\n\nContent Ingestion\n\nRaw text parsing & semantic extraction",
            fontSize: 14,
            color: "#f8fafc",
            align: "center"
          },
          {
            id: `el-${timestamp}-step2`,
            type: "text",
            x: 29,
            y: 24,
            width: 20,
            height: 60,
            content: "STEP 2\n\nLayout Resolution\n\nOptimal slide type mapping",
            fontSize: 14,
            color: "#f8fafc",
            align: "center"
          },
          {
            id: `el-${timestamp}-step3`,
            type: "text",
            x: 52,
            y: 24,
            width: 20,
            height: 60,
            content: "STEP 3\n\nShape Synthesis\n\nDeterministic canvas rendering",
            fontSize: 14,
            color: "#f8fafc",
            align: "center"
          },
          {
            id: `el-${timestamp}-step4`,
            type: "text",
            x: 74,
            y: 24,
            width: 20,
            height: 60,
            content: "STEP 4\n\nQuality Verification\n\nBounds and contrast validation",
            fontSize: 14,
            color: "#f8fafc",
            align: "center"
          }
        ];

      case "image":
      case "image_text":
        return [
          {
            id: `el-${timestamp}-title`,
            type: "text",
            x: 6,
            y: 8,
            width: 88,
            height: titleAutoH,
            content: titleText,
            fontSize: 28,
            fontWeight: "700",
            color: "#ffffff",
            align: "left"
          },
          {
            id: `el-${timestamp}-img`,
            type: "image",
            x: 6,
            y: 22,
            width: 42,
            height: 64,
            url: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=800",
            caption: "Contextual Visual Asset"
          },
          {
            id: `el-${timestamp}-text`,
            type: "text",
            x: 52,
            y: 22,
            width: 42,
            height: 64,
            content: "Key Observations\n\n• Integrated visual asset framing\n• Contextual editorial annotation\n• High legibility contrast styling",
            fontSize: 15,
            color: "#cbd5e1",
            align: "left"
          }
        ];

      case "chart":
        return [
          {
            id: `el-${timestamp}-title`,
            type: "text",
            x: 6,
            y: 8,
            width: 88,
            height: titleAutoH,
            content: titleText,
            fontSize: 28,
            fontWeight: "700",
            color: "#ffffff",
            align: "left"
          },
          {
            id: `el-${timestamp}-chart`,
            type: "chart",
            x: 6,
            y: 20,
            width: 88,
            height: 66,
            data: {
              title: "Performance & Conversion Metrics",
              items: [
                { label: "Q1", value: "45%" },
                { label: "Q2", value: "68%" },
                { label: "Q3", value: "82%" },
                { label: "Q4", value: "95%" }
              ]
            }
          }
        ];

      case "table":
        return [
          {
            id: `el-${timestamp}-title`,
            type: "text",
            x: 6,
            y: 8,
            width: 88,
            height: titleAutoH,
            content: titleText,
            fontSize: 28,
            fontWeight: "700",
            color: "#ffffff",
            align: "left"
          },
          {
            id: `el-${timestamp}-table`,
            type: "table",
            x: 6,
            y: 20,
            width: 88,
            height: 66,
            headers: ["Module", "Responsibility", "Status"],
            rows: [
              ["ThemeConfig", "Encapsulates theme styling & contrast", "Active"],
              ["GeometryConfig", "16:9 safe bounds calculation", "Verified"],
              ["LayoutResolver", "Automated content-to-slide mapping", "Production"],
              ["PPTBuilder", "Deterministic blank-slide renderer", "Deployed"]
            ]
          }
        ];

      case "section": {
        const secText = `SECTION ${count}: STRATEGIC PILLARS`;
        return [
          {
            id: `el-${timestamp}-section`,
            type: "text",
            x: 10,
            y: 38,
            width: 80,
            height: calculateTextAutoHeight(secText, 34, 80),
            content: secText,
            fontSize: 34,
            fontWeight: "800",
            color: "#c084fc",
            align: "center"
          }
        ];
      }

      case "mixed_content":
        return [
          {
            id: `el-${timestamp}-title`,
            type: "text",
            x: 6,
            y: 8,
            width: 88,
            height: titleAutoH,
            content: titleText,
            fontSize: 28,
            fontWeight: "700",
            color: "#ffffff",
            align: "left"
          },
          {
            id: `el-${timestamp}-left`,
            type: "text",
            x: 6,
            y: 22,
            width: 42,
            height: 64,
            content: "Strategic Synthesis\n\nThis multi-modal layout seamlessly integrates conceptual prose with high-impact categorical bullet points and structured takeaways.",
            fontSize: 15,
            color: "#f8fafc",
            align: "left"
          },
          {
            id: `el-${timestamp}-right`,
            type: "bullets",
            x: 52,
            y: 22,
            width: 42,
            height: 64,
            points: [
              "Deterministic coordinate bounding checks on all elements",
              "Universal compatibility with Microsoft PowerPoint and LibreOffice",
              "Flexible data-driven layout resolution for AI generation pipelines"
            ],
            fontSize: 15,
            color: "#cbd5e1"
          }
        ];

      case "blank":
        return [];

      case "title_content":
      default:
        return [
          {
            id: `el-${timestamp}-title`,
            type: "text",
            x: 6,
            y: 8,
            width: 88,
            height: titleAutoH,
            content: titleText,
            fontSize: 28,
            fontWeight: "700",
            color: "#ffffff",
            align: "left"
          },
          {
            id: `el-${timestamp}-bullets`,
            type: "bullets",
            x: 6,
            y: 26,
            width: 88,
            height: 60,
            points: [
              "Key strategic objective and enterprise roadmap priority",
              "High impact operational efficiency gains and scalability",
              "Data-driven decisions and performance benchmarks"
            ],
            fontSize: 16,
            color: "#cbd5e1"
          }
        ];
    }
  };

  const handleAddSlide = (layoutId = "title_content") => {
    const count = slides.length + 1;
    const newSlide = {
      id: `slide-${Date.now()}`,
      layout: layoutId,
      title: `Slide ${count}: Topic Title`,
      subtitle: "Add descriptive subheading takeaway...",
      bg_color: "#0f172a",
      background_theme: "dark_gradient",
      bg_gradient_start: "#0f172a",
      bg_gradient_end: "#1e1b4b",
      text_color: "#ffffff",
      accent_color: "#c084fc",
      elements: createElementsForLayout(layoutId, count),
      notes: "Speaker notes for this new slide..."
    };

    const newSlides = [...slides, newSlide];
    updateSlidesState(newSlides);
    handleSelectSlide(newSlides.length - 1);
  };

  const handleDuplicateSlide = (index) => {
    const target = slides[index];
    if (!target) return;
    const slideCopy = JSON.parse(JSON.stringify(target));
    slideCopy.id = `slide-${Date.now()}`;
    slideCopy.title = `${slideCopy.title} (Copy)`;

    const newSlides = [...slides];
    newSlides.splice(index + 1, 0, slideCopy);
    updateSlidesState(newSlides);
    handleSelectSlide(index + 1);
  };

  const handleDeleteSlide = (index) => {
    if (slides.length <= 1) return;
    const newSlides = slides.filter((_, i) => i !== index);
    updateSlidesState(newSlides);
    handleSelectSlide(Math.max(0, index - 1));
  };

  const handleMoveSlide = (index, direction) => {
    const targetIdx = index + direction;
    if (targetIdx < 0 || targetIdx >= slides.length) return;
    const newSlides = [...slides];
    const temp = newSlides[index];
    newSlides[index] = newSlides[targetIdx];
    newSlides[targetIdx] = temp;
    updateSlidesState(newSlides);
    handleSelectSlide(targetIdx);
  };

  // ELEMENT MANAGEMENT HANDLERS
  const handleUpdateSlide = (updatedFields) => {
    const newSlides = [...slides];
    const targetSlide = { ...newSlides[currentSlideIdx], ...updatedFields };

    // Synchronize title element on canvas if title was updated
    if (updatedFields.title !== undefined) {
      const elements = [...(targetSlide.elements || [])];
      const titleElIdx = elements.findIndex(
        (el) => el.isTitle || el.type === "title" || el.id?.includes("title") || (el.y !== undefined && el.y < 35)
      );
      if (titleElIdx !== -1) {
        const titleEl = elements[titleElIdx];
        const autoH = calculateTextAutoHeight(updatedFields.title, titleEl.font_size || 28, titleEl.width || 80);
        elements[titleElIdx] = {
          ...titleEl,
          content: updatedFields.title,
          text: updatedFields.title,
          height: autoH || titleEl.height || 10,
          autoHeight: true
        };
        targetSlide.elements = elements;
      }
    }

    // Synchronize subtitle element on canvas if subtitle was updated
    if (updatedFields.subtitle !== undefined) {
      const elements = [...(targetSlide.elements || [])];
      const subElIdx = elements.findIndex(
        (el) => el.id?.includes("sub") || el.isSubtitle || el.type === "subtitle"
      );
      if (subElIdx !== -1) {
        const subEl = elements[subElIdx];
        const autoH = calculateTextAutoHeight(updatedFields.subtitle, subEl.font_size || 16, subEl.width || 80);
        elements[subElIdx] = {
          ...subEl,
          content: updatedFields.subtitle,
          text: updatedFields.subtitle,
          height: autoH || subEl.height || 8,
          autoHeight: true
        };
        targetSlide.elements = elements;
      }
    }

    newSlides[currentSlideIdx] = targetSlide;
    updateSlidesState(newSlides);
  };

  const handleSelectThemePreset = (presetId) => {
    setSelectedBgPreset?.(presetId);

    const preset = (BACKGROUND_PRESETS || []).find((p) => p.id === presetId) ||
                   (THEME_OPTIONS || []).find((p) => p.id === presetId);
    if (!preset) return;

    const hexMatches = preset.bg ? preset.bg.match(/#[0-9a-fA-F]{3,6}/g) : null;
    const bgStart = preset.bg_start || (hexMatches?.[0]) || "#0f172a";
    const bgEnd = preset.bg_end || (hexMatches?.[1]) || bgStart;
    const solidBg = preset.solid_bg || bgStart;
    const accentColor = preset.accent || "#c084fc";
    const textColor = preset.text || "#ffffff";

    const newSlides = slides.map((s) => ({
      ...s,
      background_theme: presetId,
      background_preset: presetId,
      template: presetId,
      bg_color: solidBg,
      bg_gradient_start: bgStart,
      bg_gradient_end: bgEnd,
      accent_color: accentColor,
      text_color: textColor
    }));
    updateSlidesState(newSlides);
  };

  const handleUpdateElement = (elementId, updatedFields) => {
    const newSlides = [...slides];
    const slide = { ...newSlides[currentSlideIdx] };
    const elements = [...(slide.elements || [])];
    const elIdx = elements.findIndex((el) => el.id === elementId);
    if (elIdx !== -1) {
      const existingEl = elements[elIdx];
      const mergedData = existingEl.data ? { ...existingEl.data, ...updatedFields } : undefined;
      const updatedEl = {
        ...existingEl,
        ...updatedFields,
        ...(mergedData ? { data: mergedData } : {})
      };
      elements[elIdx] = updatedEl;
      slide.elements = elements;

      // Sync slide.title if this is a title element
      const isTitle = existingEl.isTitle || existingEl.type === "title" || existingEl.id?.includes("title");
      if (isTitle && (updatedFields.content !== undefined || updatedFields.text !== undefined)) {
        slide.title = updatedFields.content !== undefined ? updatedFields.content : updatedFields.text;
      }

      newSlides[currentSlideIdx] = slide;
      updateSlidesState(newSlides);
    }
  };

  const handleAddElement = (type, defaultProps = {}) => {
    const newElement = {
      id: `el-${Date.now()}`,
      type,
      x: 20,
      y: 30,
      width: 40,
      height: 25,
      content: type === "text" ? "New Text Element" : undefined,
      fontSize: 18,
      color: "#ffffff",
      align: "left",
      ...defaultProps
    };

    const newSlides = [...slides];
    const slide = { ...newSlides[currentSlideIdx] };
    slide.elements = [...(slide.elements || []), newElement];
    newSlides[currentSlideIdx] = slide;
    updateSlidesState(newSlides);
    setSelectedElementId(newElement.id);
  };

  const handleDeleteElement = (elementId) => {
    const newSlides = [...slides];
    const slide = { ...newSlides[currentSlideIdx] };
    slide.elements = (slide.elements || []).filter((el) => el.id !== elementId);
    newSlides[currentSlideIdx] = slide;
    updateSlidesState(newSlides);
    setSelectedElementId(null);
  };

  const handleDuplicateElement = (elementId) => {
    const slide = slides[currentSlideIdx];
    const target = (slide?.elements || []).find((el) => el.id === elementId);
    if (!target) return;
    const elCopy = JSON.parse(JSON.stringify(target));
    elCopy.id = `el-${Date.now()}`;
    elCopy.x = Math.min(90, (elCopy.x || 10) + 4);
    elCopy.y = Math.min(90, (elCopy.y || 10) + 4);

    const newSlides = [...slides];
    const updatedSlide = { ...newSlides[currentSlideIdx] };
    updatedSlide.elements = [...(updatedSlide.elements || []), elCopy];
    newSlides[currentSlideIdx] = updatedSlide;
    updateSlidesState(newSlides);
    setSelectedElementId(elCopy.id);
  };

  return (
    <div className="ppt-editor-layout">
      {/* 1. TOP NAVIGATION BAR */}
      <EditorTopBar
        title={plan?.title || "Artificial Intelligence & Enterprise Future Tech"}
        onTitleChange={(newTitle) => {
          if (setPlan) setPlan((prev) => ({ ...(prev || {}), title: newTitle }));
        }}
        isSaved={isSaved}
        isSaving={isSaving}
        onBack={onBackToSetup}
        onSave={() => savePresentation?.()}
        onDownload={() => downloadSavedPresentation?.()}
        onPresent={() => setIsPresenting(true)}
        onNewDeck={onNewDeck || onBackToSetup}
        onAiRefine={() => handleOpenAiRefine()}
        onSelectAiAction={(actionId) => {
          let prompt = "";
          let actionTab = "polish";
          if (actionId === "improve_slide") {
            prompt = `Improve and polish the wording and structure for slide: "${currentSlide?.title || ''}"`;
            actionTab = "polish";
          } else if (actionId === "rewrite") {
            const el = (currentSlide?.elements || []).find(e => e.id === selectedElementId) || currentSlide?.elements?.[0];
            prompt = el?.content || el?.text || currentSlide?.title || "";
            actionTab = "headline";
          } else if (actionId === "shorten") {
            const el = (currentSlide?.elements || []).find(e => e.id === selectedElementId) || currentSlide?.elements?.[0];
            prompt = el?.content || el?.text || (currentSlide?.elements || []).map(e => e.content || e.text).filter(Boolean).join("\n");
            actionTab = "summarize";
          } else if (actionId === "expand") {
            prompt = currentSlide?.title || plan?.title || "";
            actionTab = "bullets";
          } else if (actionId === "generate_image") {
            prompt = `Generate a modern presentation visual concept for: ${currentSlide?.title || 'Slide'}`;
            actionTab = "image";
          } else if (actionId === "create_diagram") {
            prompt = `Create a 4-step workflow process for: ${currentSlide?.title || 'Process'}`;
            actionTab = "diagram";
          } else if (actionId === "create_chart") {
            prompt = `Generate performance analytics chart data for: ${currentSlide?.title || 'Metrics'}`;
            actionTab = "chart";
          } else if (actionId === "change_tone") {
            prompt = `Rephrase with persuasive, executive tone: ${currentSlide?.title || ''}`;
            actionTab = "polish";
          } else if (actionId === "translate") {
            prompt = `Translate the slide content into Hindi: "${currentSlide?.title || ''}"`;
            actionTab = "polish";
          } else if (actionId === "fix_layout") {
            prompt = `Organize and balance slide elements into clean bullet points`;
            actionTab = "bullets";
          }
          handleOpenAiRefine(prompt, actionTab);
        }}
        onOpenDesignCheck={() => setIsDesignCheckOpen(true)}
        showLeftSidebar={showLeftSidebar}
        showRightSidebar={showRightSidebar}
        onToggleLeftSidebar={() => setShowLeftSidebar((prev) => !prev)}
        onToggleRightSidebar={() => setShowRightSidebar((prev) => !prev)}
        onBackToSetup={onBackToSetup}
        onTriggerCacheCleanup={onTriggerCacheCleanup}
        isCleaningCache={isCleaningCache}
      />

      {/* 3-PANEL EDITOR MAIN BODY */}
      <div className="ppt-main-body">
        {/* MOBILE / TABLET BACKDROP */}
        {(showLeftSidebar || showRightSidebar) && (
          <div 
            className="ppt-drawer-backdrop" 
            onClick={() => {
              setShowLeftSidebar(false);
              setShowRightSidebar(false);
            }} 
          />
        )}

        {/* 2. LEFT SLIDE SIDEBAR */}
        {showLeftSidebar && (
          <SlideSidebar
            slides={slides}
            activeSlideIndex={currentSlideIdx}
            onSelectSlide={(idx) => {
              handleSelectSlide(idx);
              if (window.innerWidth <= 900) setShowLeftSidebar(false);
            }}
            onAddSlide={handleAddSlide}
            onDuplicateSlide={handleDuplicateSlide}
            onDeleteSlide={handleDeleteSlide}
            onMoveSlide={handleMoveSlide}
            onToggleSidebar={() => setShowLeftSidebar(false)}
            onAiAction={(actionId) => {
              let prompt = "";
              if (actionId === "create_diagram") prompt = "Create a 4-step process flow diagram: [Step 1: Plan] ➔ [Step 2: Build] ➔ [Step 3: Test] ➔ [Step 4: Launch]";
              else if (actionId === "gen_section") prompt = "Generate a Section Header Slide for: Key Strategic Pillars";
              else if (actionId === "improve_content") prompt = "Improve and optimize slide bullet points for higher impact presentation";
              else prompt = "Generate a new slide with key points and visual content";
              handleOpenAiRefine(prompt);
            }}
          />
        )}

        {/* 3. CENTER CANVAS WORKSPACE (MAX WIDTH) */}
        <CanvasWorkspace
          slide={currentSlide}
          selectedElementId={selectedElementId}
          onSelectElement={(id) => setSelectedElementId(id)}
          onUpdateElement={handleUpdateElement}
          onAddElement={handleAddElement}
          onDeselectAll={() => setSelectedElementId(null)}
          onDeleteElement={handleDeleteElement}
          onDuplicateElement={handleDuplicateElement}
          onAiRefine={(initialText) => handleOpenAiRefine(initialText)}
          onChangeNotes={(newNotes) => handleUpdateSlide({ notes: newNotes })}
          isNotesOpen={isNotesOpen}
          onToggleNotes={() => setIsNotesOpen((prev) => !prev)}
          onOpenVoiceover={() => setIsVoiceoverOpen(true)}
          zoom={zoom}
          slideIndex={currentSlideIdx}
          totalSlides={slides.length}
          templateName={templateName || plan?.template_name || "base_template"}
        />

        {/* 4. CONTEXTUAL RIGHT PROPERTIES SIDEBAR */}
        {showRightSidebar && (
          <PropertiesPanel
            slide={currentSlide}
            selectedElementId={selectedElementId}
            onUpdateSlide={handleUpdateSlide}
            onUpdateElement={handleUpdateElement}
            onDeleteElement={handleDeleteElement}
            onDuplicateElement={handleDuplicateElement}
            selectedBgPreset={selectedBgPreset || "dark_gradient"}
            onSelectBgPreset={handleSelectThemePreset}
            onAiRefine={(initialText) => handleOpenAiRefine(initialText)}
            onToggleSidebar={() => setShowRightSidebar(false)}
          />
        )}
      </div>

      {/* 5. BOTTOM COMPACT INSERT TOOLBAR */}
      <BottomToolbar
        onAddElement={handleAddElement}
        onOpenShapesCatalog={() => setIsShapesCatalogOpen(true)}
      />

      {/* 6. BOTTOM RIGHT ZOOM CONTROLS */}
      <ZoomControls
        zoom={zoom}
        onZoomChange={(val) => setZoom(val)}
        onFitToScreen={() => setZoom(1.0)}
        onFitToWidth={() => setZoom(1.15)}
      />

      {/* FULLSCREEN SLIDESHOW MODAL */}
      <PresentModal
        slides={slides}
        initialSlideIndex={currentSlideIdx}
        isOpen={isPresenting}
        onClose={() => setIsPresenting(false)}
      />

      {/* EXPORT OPTIONS MODAL */}
      <ExportModal
        isOpen={isExporting}
        onClose={() => setIsExporting(false)}
        onConfirmExport={(format) => {
          if (format === "json") {
            try {
              const exportPayload = {
                title: plan?.title || "Presentation",
                plan,
                slides,
                templateName,
                selectedBgPreset,
                exportedAt: new Date().toISOString()
              };
              const blob = new Blob([JSON.stringify(exportPayload, null, 2)], { type: "application/json" });
              const url = URL.createObjectURL(blob);
              const link = document.createElement("a");
              link.href = url;
              link.download = `${(plan?.title || "presentation").replace(/[^a-zA-Z0-9_-]/g, "_")}_backup.json`;
              document.body.appendChild(link);
              link.click();
              document.body.removeChild(link);
              URL.revokeObjectURL(url);
              setToast({ type: "success", title: "Exported", message: "Presentation backup downloaded as JSON." });
            } catch (err) {
              setToast({ type: "error", title: "Export Failed", message: err.message });
            }
          } else {
            downloadSavedPresentation?.(format);
          }
        }}
        isSaving={isSaving}
      />

      {/* AI REFINE MODAL (`ai.refine`) */}
      <AiRefineModal
        isOpen={isAiRefineOpen}
        onClose={() => setIsAiRefineOpen(false)}
        initialText={aiRefineInitialText}
        initialAction={aiRefineInitialAction}
        slideTitle={currentSlide?.title || ""}
        presentationTitle={plan?.title || ""}
        onApplyRefined={handleApplyAiRefine}
      />

      {/* AI DESIGN CHECK MODAL */}
      <AIDesignCheckModal
        isOpen={isDesignCheckOpen}
        onClose={() => setIsDesignCheckOpen(false)}
        slide={currentSlide}
        onShortenText={() => handleOpenAiRefine(null, "summarize")}
        onApplyFixes={() => {
          if (!currentSlide) return;
          const fixedElements = fixElementAntiOverlap(currentSlide.elements || []);
          handleUpdateSlide({
            elements: fixedElements,
            title: (currentSlide.title || "").trim()
          });
          setToast({ type: "success", title: "Design Audit Applied", message: "Layout spacing, typography and element alignment optimized!" });
        }}
      />

      {/* SAVED PRESENTATIONS DRAWER MODAL */}
      <SavedPresentationsModal
        isOpen={isSavedDecksOpen}
        onClose={() => setIsSavedDecksOpen(false)}
        onLoadDeck={(id) => {
          setIsSavedDecksOpen(false);
          setToast({ type: "success", title: "Deck Loaded", message: `Loaded presentation ${id}.` });
        }}
        onToast={(t) => setToast(t)}
      />

      {/* SHAPE CATALOG & DIAGRAM LIBRARY MODAL */}
      <ShapeCatalogModal
        isOpen={isShapesCatalogOpen}
        onClose={() => setIsShapesCatalogOpen(false)}
        onAddShape={(shapeData) => {
          handleAddElement("shape", shapeData);
          setToast({ type: "success", title: "Shape Added", message: `Inserted ${shapeData.name || "shape"} into slide.` });
        }}
      />

      {/* AI VOICEOVER NARRATION STUDIO MODAL */}
      <VoiceoverStudioModal
        isOpen={isVoiceoverOpen}
        onClose={() => setIsVoiceoverOpen(false)}
        slide={currentSlide}
        slideIndex={currentSlideIdx}
        onToast={(t) => setToast(t)}
      />

      {/* GLOBAL TOAST NOTIFICATION SYSTEM */}
      <ToastNotification toast={toast} onClose={() => setToast(null)} />
    </div>
  );
}

