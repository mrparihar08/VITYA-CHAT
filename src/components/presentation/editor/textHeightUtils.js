/**
 * textHeightUtils.js
 * 
 * Precision utilities for calculating dynamic text bounding-box heights
 * based on text content, font size, container width %, and canvas aspect ratio (16:9 / 960x540).
 * 
 * Ensures the element container and selection border hug the exact lines of text
 * without leaving large empty gaps underneath.
 */

export function calculateTextAutoHeight(text, fontSize = 24, widthPct = 80, lineHeight = 1.32) {
  const str = String(text || "").trim();
  if (!str) return 6; // Compact fallback for empty text box

  const wPct = Math.max(5, Math.min(100, Number(widthPct) || 80));
  const fSize = Math.max(10, Math.min(120, Number(fontSize) || 24));
  const lHeight = Number(lineHeight) || 1.32;

  // Available width in reference 960px canvas (13.333 inches @ 72 dpi)
  const availWidthPx = (wPct / 100) * 960;

  // Realistic character width for standard sans-serif presentation fonts with word wrap overhead
  // 0.0092 in/pt * 72 px/in = 0.6624 px/pt/char
  const charWidthPx = fSize * 0.66;
  const charsPerLine = Math.max(1, Math.floor(availWidthPx / charWidthPx));

  // Split text into paragraphs by newline
  const paragraphs = str.split(/\r?\n/);
  let totalLines = 0;

  for (const para of paragraphs) {
    if (!para.trim()) {
      totalLines += 1;
      continue;
    }
    const words = para.split(/\s+/);
    let currentLineLen = 0;
    let paraLines = 1;
    for (const word of words) {
      const wLen = word.length;
      if (currentLineLen === 0) {
        currentLineLen = wLen;
      } else if (currentLineLen + 1 + wLen <= charsPerLine) {
        currentLineLen += 1 + wLen;
      } else {
        paraLines += 1;
        currentLineLen = Math.min(wLen, charsPerLine);
      }
    }
    totalLines += paraLines;
  }

  // Calculate pixel height needed (1 line = fSize * lHeight + 6px vertical safety/padding)
  const requiredPx = totalLines * (fSize * lHeight) + (paragraphs.length * 4) + 6;

  // Convert to percentage of 540px canvas height (7.5 inches @ 72 dpi)
  const heightPct = (requiredPx / 540) * 100;

  // Return clamped rounded value (minimum 4.5%, maximum 89.3% corresponding to SAFE_CONTENT_BOTTOM = 6.70 in)
  return Math.min(89.3, Math.max(4.5, Math.round(heightPct * 10) / 10));
}

export function isTextLikeElement(element) {
  if (!element) return false;
  const t = element.type || "text";
  return ["text", "title", "subtitle", "paragraph", "bullets"].includes(t);
}

export function fitElementHeightToText(element) {
  if (!element || !isTextLikeElement(element)) return element;
  const content = element.content || element.text || element.data?.text || "";
  const fSize = Number(element.fontSize) || (element.type === "title" ? 32 : 16);
  const wPct = Number(element.width) || 80;
  const lHeight = Number(element.lineHeight) || 1.32;
  const newHeight = calculateTextAutoHeight(content, fSize, wPct, lHeight);

  return {
    ...element,
    height: newHeight,
    customHeight: false
  };
}
