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
import { SAMPLE_SLIDES } from "./editor/editorState";
import "./editor/PresentationEditor.css";

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
  const hasGraphicElement = list.some((el) => ["diagram", "roadmap", "chart", "table", "kpi_grid"].includes(el.type));

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

    // Dynamic height based on title length and font size
    const titleLines = titleText.length > 70 ? 3 : titleText.length > 35 ? 2 : 1;
    titleEl.height = titleLines === 3 ? 22 : titleLines === 2 ? 16 : 12;

    if (subEl) {
      subEl.x = subEl.x !== undefined ? Number(subEl.x) : 8;
      // Position Subtitle cleanly below Title with safe gap!
      subEl.y = titleEl.y + titleEl.height + 4;
      subEl.width = subEl.width !== undefined ? Number(subEl.width) : 84;
      const subText = String(subEl.content || subEl.text || "").trim();
      const subLines = subText.length > 80 ? 3 : subText.length > 40 ? 2 : 1;
      subEl.height = subLines * 6 + 6;
      subEl.fontSize = subText.length > 60 ? 16 : (subEl.fontSize || 18);
    }
  }

  // General sequential Y anti-overlap check for remaining elements
  let currentY = 6;
  list.forEach((el, idx) => {
    const elType = el.type || "text";
    const textStr = String(el.content || el.text || "").trim();

    let estHeight = el.height ? Number(el.height) : 20;

    if (elType === "text") {
      if (hasGraphicElement && idx > 0) {
        estHeight = Math.min(18, estHeight > 0 ? estHeight : 18);
      } else {
        const lineCount = textStr.length > 120 ? 4 : textStr.length > 70 ? 3 : textStr.length > 30 ? 2 : 1;
        const calcHeight = lineCount * 6 + 4;
        estHeight = Math.max(estHeight, calcHeight);
      }
    } else if (elType === "bullets") {
      const ptsCount = (el.points || []).length || 3;
      estHeight = hasGraphicElement ? Math.min(22, 10 + ptsCount * 4) : Math.max(estHeight, 12 + ptsCount * 6);
    } else if (["diagram", "roadmap", "chart", "table", "kpi_grid"].includes(elType)) {
      estHeight = Math.min(34, Number(el.height) || 32);
    }

    if (idx === 0) {
      if (el.y === undefined) el.y = isHeroSlide ? 10 : 6;
      currentY = Number(el.y) + estHeight + 3;
    } else {
      if (el.y === undefined || Number(el.y) < currentY) {
        el.y = Math.round(currentY * 10) / 10;
      }
      if (["diagram", "roadmap", "chart", "table"].includes(elType) && el.y > 54) {
        el.y = 44;
      }
      currentY = Number(el.y) + estHeight + 3;
    }
  });

  return list;
}

export function normalizeSlideElements(slide, index = 0) {
  if (!slide) return slide;

  const isTitleSlide = slide.layout === "title_slide" || index === 0;
  const existingElements = Array.isArray(slide.elements) && slide.elements.length > 0 ? slide.elements : null;

  if (existingElements) {
    const updatedElements = existingElements.map((el, i) => {
      return {
        ...el,
        x: el.x !== undefined ? Number(el.x) : 10,
        y: el.y !== undefined ? Number(el.y) : Math.min(80, 10 + i * 20),
        width: el.width !== undefined ? Number(el.width) : 80,
        height: el.height !== undefined ? Number(el.height) : 25,
      };
    });
    return { ...slide, elements: fixElementAntiOverlap(updatedElements, isTitleSlide) };
  }

  const newElements = [];
  let currentY = 8;

  if (slide.title) {
    const titleText = String(slide.title).trim();
    const titleLines = titleText.length > 60 ? 3 : titleText.length > 30 ? 2 : 1;
    const titleH = titleLines === 3 ? 26 : titleLines === 2 ? 20 : 14;

    newElements.push({
      id: `el-title-${Date.now()}-${index}`,
      type: "text",
      x: 6,
      y: isTitleSlide ? 16 : 6,
      width: 88,
      height: titleH,
      content: slide.title,
      fontSize: isTitleSlide ? 38 : 30,
      fontWeight: "700",
      color: slide.text_color || "#ffffff",
      align: slide.title_align || "left"
    });
    currentY = (isTitleSlide ? 16 : 6) + titleH + 5;
  }

  if (slide.subtitle) {
    const subText = String(slide.subtitle).trim();
    const subLines = subText.length > 80 ? 3 : subText.length > 40 ? 2 : 1;
    const subH = subLines * 6 + 6;

    newElements.push({
      id: `el-sub-${Date.now()}-${index}`,
      type: "text",
      x: isTitleSlide ? 8 : 6,
      y: currentY,
      width: isTitleSlide ? 84 : 88,
      height: subH,
      content: slide.subtitle,
      fontSize: isTitleSlide ? 18 : 16,
      fontWeight: "400",
      color: slide.accent_color || "#c084fc",
      align: slide.subtitle_align || "left"
    });
    currentY += subH + 5;
  }

  const plugins = Array.isArray(slide.plugins) && slide.plugins.length > 0 ? slide.plugins : [];

  if (plugins.length > 0) {
    plugins.forEach((p, pIdx) => {
      if (!p) return;
      const pType = p.type;
      const pData = p.data || {};
      const elId = `el-plugin-${Date.now()}-${index}-${pIdx}`;

      if (pType === "bullets") {
        newElements.push({
          id: elId,
          type: "bullets",
          x: 6,
          y: currentY,
          width: 88,
          height: Math.min(50, 20 + (pData.points || slide.bullets || []).length * 8),
          points: pData.points || slide.bullets || slide.points || ["Key takeaway point"],
          fontSize: 15,
          color: slide.text_color || "#ffffff"
        });
        currentY += 38;
      } else if (pType === "chart") {
        newElements.push({
          id: elId,
          type: "chart",
          x: 6,
          y: currentY,
          width: 88,
          height: 55,
          chart_type: pData.chart_type || pData.chartType || "bar",
          title: pData.title || "Chart Analytics",
          labels: pData.labels || ["Q1", "Q2", "Q3", "Q4"],
          values: pData.values || [40, 65, 80, 95],
          data: pData
        });
        currentY += 58;
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
          type: "diagram",
          diagram_type: pData.diagram_type || pData.diagramType || (pType === "roadmap" ? "timeline" : "flowchart"),
          x: 6,
          y: currentY,
          width: 88,
          height: 35,
          phases: parsedPhases && parsedPhases.length ? parsedPhases : [
            { phase: "Step 1", title: "Data Landscape", status: "COMPLETED" },
            { phase: "Step 2", title: "Business Value", status: "IN PROGRESS" },
            { phase: "Step 3", title: "Strategic Alignment", status: "PLANNED" },
            { phase: "Step 4", title: "Executive Impact", status: "PLANNED" }
          ],
          diagram: diagramStr,
          data: pData
        });
        currentY += 38;
      } else if (pType === "table") {
        newElements.push({
          id: elId,
          type: "table",
          x: 6,
          y: currentY,
          width: 88,
          height: 55,
          headers: pData.headers || ["Feature", "Standard", "Enterprise"],
          rows: pData.rows || [["Uptime", "99.9%", "99.99%"]],
          data: pData
        });
        currentY += 58;
      } else if (pType === "stat") {
        newElements.push({
          id: elId,
          type: "stat",
          x: 6,
          y: currentY,
          width: 42,
          height: 30,
          number: pData.number || "95%",
          label: pData.label || "Performance Metric",
          sublabel: pData.sublabel || "",
          data: pData
        });
        currentY += 34;
      } else if (pType === "callout") {
        newElements.push({
          id: elId,
          type: "callout",
          x: 6,
          y: currentY,
          width: 88,
          height: 35,
          text: pData.text || pData.content || "Key Strategic Insight",
          title: pData.title || "KEY TAKEAWAY",
          icon: pData.icon || "💡",
          data: pData
        });
        currentY += 40;
      } else if (pType === "kpi_grid") {
        newElements.push({
          id: elId,
          type: "kpi_grid",
          x: 6,
          y: currentY,
          width: 88,
          height: 55,
          kpis: pData.kpis || pData.items || [],
          data: pData
        });
        currentY += 58;
      } else if (pType === "pros_cons") {
        newElements.push({
          id: elId,
          type: "pros_cons",
          x: 6,
          y: currentY,
          width: 88,
          height: 55,
          pros: pData.pros || [],
          cons: pData.cons || [],
          data: pData
        });
        currentY += 58;
      } else if (pType === "code_block") {
        newElements.push({
          id: elId,
          type: "code_block",
          x: 6,
          y: currentY,
          width: 88,
          height: 55,
          code: pData.code || "",
          title: pData.title || "Snippet",
          language: pData.language || "python",
          data: pData
        });
        currentY += 58;
      } else if (pType === "speaker_card") {
        newElements.push({
          id: elId,
          type: "speaker_card",
          x: 6,
          y: currentY,
          width: 88,
          height: 45,
          name: pData.name || "Speaker",
          role: pData.role || "Keynote Presenter",
          bio: pData.bio || [],
          data: pData
        });
        currentY += 50;
      } else if (pType === "image") {
        newElements.push({
          id: elId,
          type: "image",
          x: 6,
          y: currentY,
          width: 88,
          height: 50,
          url: pData.url || pData.path || "https://images.unsplash.com/photo-1518770660439-4636190af475?w=800",
          caption: pData.caption || "",
          data: pData
        });
        currentY += 54;
      } else {
        const rawContent = pData.text || pData.content || slide.content || "Content text here...";
        if (typeof rawContent === "string" && (rawContent.includes("➔") || rawContent.includes("->") || rawContent.includes("-->") || rawContent.includes("→")) && rawContent.includes("[")) {
          const parsedSteps = rawContent
            .split(/\s*(?:➔|➜|->|-->|→|⇒|\||\n|;)\s*/)
            .map((s) => s.replace(/\[|\]/g, "").trim())
            .filter(Boolean)
            .map((step, i) => ({
              phase: `Step ${i + 1}`,
              title: step,
              status: i === 0 ? "COMPLETED" : i === 1 ? "IN PROGRESS" : "PLANNED"
            }));

          newElements.push({
            id: elId,
            type: "diagram",
            diagram_type: pData.diagram_type || pData.diagramType || "flowchart",
            x: 6,
            y: currentY,
            width: 88,
            height: 35,
            phases: parsedSteps,
            diagram: rawContent,
            data: pData
          });
          currentY += 38;
        } else {
          newElements.push({
            id: elId,
            type: "text",
            x: 6,
            y: currentY,
            width: 88,
            height: 30,
            content: rawContent,
            fontSize: 16,
            color: slide.text_color || "#cbd5e1"
          });
          currentY += 34;
        }
      }
    });
  } else {
    if (slide.bullets && slide.bullets.length > 0) {
      newElements.push({
        id: `el-bullets-${Date.now()}-${index}`,
        type: "bullets",
        x: 6,
        y: currentY,
        width: 88,
        height: 40,
        points: slide.bullets,
        fontSize: 15,
        color: slide.text_color || "#ffffff"
      });
      currentY += 44;
    }

    if (slide.content || slide.paragraph) {
      newElements.push({
        id: `el-content-${Date.now()}-${index}`,
        type: "text",
        x: 6,
        y: currentY,
        width: 88,
        height: 30,
        content: slide.content || slide.paragraph,
        fontSize: 16,
        color: slide.text_color || "#cbd5e1"
      });
      currentY += 34;
    }
  }

  if (newElements.length === 0) {
    newElements.push({
      id: `el-default-${Date.now()}-${index}`,
      type: "text",
      x: 6,
      y: 30,
      width: 88,
      height: 25,
      content: slide.title || "Click to add slide content",
      fontSize: 20,
      color: "#ffffff"
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
  onBackToSetup
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
  const [showLeftSidebar, setShowLeftSidebar] = useState(true);
  const [showRightSidebar, setShowRightSidebar] = useState(true);
  const [isDesignCheckOpen, setIsDesignCheckOpen] = useState(false);
  const [isNotesOpen, setIsNotesOpen] = useState(false);

  const handleOpenAiRefine = (overrideText = null) => {
    const currentSlideEl = (currentSlide?.elements || []).find((el) => el.id === selectedElementId);
    const targetText = overrideText !== null 
      ? overrideText 
      : currentSlideEl?.content || currentSlideEl?.text || currentSlide?.title || plan?.title || "";
    setAiRefineInitialText(targetText);
    setIsAiRefineOpen(true);
  };

  const handleApplyAiRefine = (refinedResult, action) => {
    if (!refinedResult) return;
    const refinedText = typeof refinedResult.refined_text === "string" 
      ? refinedResult.refined_text 
      : JSON.stringify(refinedResult.refined_text);

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

    if (selectedElementId) {
      if (isDiagramAction && parsedPhases) {
        handleUpdateElement(selectedElementId, {
          type: "diagram",
          diagram_type: "flowchart",
          phases: parsedPhases,
          diagram: refinedText,
          content: refinedText,
          height: 38
        });
      } else if (action === "bullets" || refinedText.includes("•")) {
        const points = refinedText.split("\n").map((s) => s.replace(/^[•\-*]\s*/, "").trim()).filter(Boolean);
        handleUpdateElement(selectedElementId, { type: "bullets", points, content: refinedText });
      } else if (action === "chart" && refinedResult.refined_chart) {
        const c = refinedResult.refined_chart;
        handleUpdateElement(selectedElementId, {
          type: "chart",
          title: c.title || "Chart Analytics",
          labels: c.categories || ["Q1", "Q2", "Q3", "Q4"],
          values: c.values || [40, 60, 80, 95],
          chart_type: c.chart_type || "bar"
        });
      } else if (action === "image" && refinedText.startsWith("http")) {
        handleUpdateElement(selectedElementId, { type: "image", url: refinedText });
      } else {
        handleUpdateElement(selectedElementId, { content: refinedText, text: refinedText });
      }
    } else {
      if (isDiagramAction && parsedPhases) {
        const bodyEl = (currentSlide?.elements || []).find(
          (el) => el.type !== "title" && !el.id?.includes("title")
        );
        if (bodyEl) {
          handleUpdateElement(bodyEl.id, {
            type: "diagram",
            diagram_type: "flowchart",
            phases: parsedPhases,
            diagram: refinedText,
            content: refinedText,
            height: 38
          });
        } else {
          handleAddElement("diagram", {
            diagram_type: "flowchart",
            phases: parsedPhases,
            diagram: refinedText,
            height: 38
          });
        }
      } else if (action === "bullets" || refinedText.includes("•")) {
        const points = refinedText.split("\n").map((s) => s.replace(/^[•\-*]\s*/, "").trim()).filter(Boolean);
        const bodyEl = (currentSlide?.elements || []).find(
          (el) => el.type !== "title" && !el.id?.includes("title")
        );
        if (bodyEl) {
          handleUpdateElement(bodyEl.id, { type: "bullets", points, content: refinedText });
        } else {
          handleAddElement("bullets", { points });
        }
      } else if (action === "headline") {
        handleUpdateSlide({ title: refinedText });
      } else {
        handleUpdateSlide({ subtitle: refinedText });
      }
    }
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
      elements: [
        {
          id: `el-${Date.now()}-1`,
          type: "text",
          x: 8,
          y: 10,
          width: 84,
          height: 15,
          content: `Slide ${count}: Topic Title`,
          fontSize: 32,
          fontWeight: "700",
          color: "#ffffff",
          align: "left"
        },
        {
          id: `el-${Date.now()}-2`,
          type: "text",
          x: 8,
          y: 28,
          width: 84,
          height: 60,
          content: "Enter detailed structured paragraph text and bullet points here...",
          fontSize: 16,
          color: "#cbd5e1",
          align: "left"
        }
      ],
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
    newSlides[currentSlideIdx] = { ...newSlides[currentSlideIdx], ...updatedFields };
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
      elements[elIdx] = {
        ...existingEl,
        ...updatedFields,
        ...(mergedData ? { data: mergedData } : {})
      };
      slide.elements = elements;
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
        onPreview={() => setIsPresenting(true)}
        onNewDeck={onBackToSetup}
        onAiRefine={() => handleOpenAiRefine()}
        onOpenDesignCheck={() => setIsDesignCheckOpen(true)}
        showLeftSidebar={showLeftSidebar}
        showRightSidebar={showRightSidebar}
        onToggleLeftSidebar={() => setShowLeftSidebar((prev) => !prev)}
        onToggleRightSidebar={() => setShowRightSidebar((prev) => !prev)}
      />

      {/* 3-PANEL EDITOR MAIN BODY */}
      <div className="ppt-main-body">
        {/* 2. LEFT SLIDE SIDEBAR */}
        {showLeftSidebar && (
          <SlideSidebar
            slides={slides}
            activeSlideIndex={currentSlideIdx}
            onSelectSlide={handleSelectSlide}
            onAddSlide={handleAddSlide}
            onDuplicateSlide={handleDuplicateSlide}
            onDeleteSlide={handleDeleteSlide}
            onMoveSlide={handleMoveSlide}
            onAiAction={(actionId) => handleOpenAiRefine()}
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
          zoom={zoom}
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
            onSelectBgPreset={(preset) => setSelectedBgPreset?.(preset)}
            onAiRefine={(initialText) => handleOpenAiRefine(initialText)}
          />
        )}
      </div>

      {/* 5. BOTTOM COMPACT INSERT TOOLBAR */}
      <BottomToolbar onAddElement={handleAddElement} />

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
        onConfirmExport={() => downloadSavedPresentation?.()}
        isSaving={isSaving}
      />

      {/* AI REFINE MODAL (`ai.refine`) */}
      <AiRefineModal
        isOpen={isAiRefineOpen}
        onClose={() => setIsAiRefineOpen(false)}
        initialText={aiRefineInitialText}
        slideTitle={currentSlide?.title || ""}
        presentationTitle={plan?.title || ""}
        onApplyRefined={handleApplyAiRefine}
      />

      {/* AI DESIGN CHECK MODAL */}
      <AIDesignCheckModal
        isOpen={isDesignCheckOpen}
        onClose={() => setIsDesignCheckOpen(false)}
        slide={currentSlide}
        onShortenText={() => handleOpenAiRefine()}
        onApplyFixes={() => {
          handleUpdateSlide({ title: (currentSlide?.title || "").toUpperCase() });
        }}
      />
    </div>
  );
}
