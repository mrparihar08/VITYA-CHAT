import React from "react";

export function FormattedMarkdown({ content }) {
  if (typeof content !== "string") {
    return <span>{JSON.stringify(content)}</span>;
  }

  // Helper to parse inline markdown: **bold**, *italic*, `code`, [link](url)
  const parseInline = (text) => {
    if (!text) return [];

    const regex = /(`[^`]+`|\*\*[^*]+\*\*|__[^_]+__|(?:\b|_)\*[^*]+\*(?:\b|_)|(?:\b|_)_[^_]+_(?:\b|_)|\[[^\]]+\]\([^)]+\))/g;

    const parts = text.split(regex);
    return parts.map((part, index) => {
      if (!part) return null;

      // Inline Code
      if (part.startsWith("`") && part.endsWith("`") && part.length > 2) {
        return (
          <code
            key={index}
            style={{
              background: "rgba(255, 255, 255, 0.12)",
              color: "#c084fc",
              padding: "2px 6px",
              borderRadius: "6px",
              fontFamily: "monospace",
              fontSize: "0.9em",
            }}
          >
            {part.slice(1, -1)}
          </code>
        );
      }

      // Bold: **text** or __text__
      if (
        (part.startsWith("**") && part.endsWith("**") && part.length > 4) ||
        (part.startsWith("__") && part.endsWith("__") && part.length > 4)
      ) {
        return (
          <strong key={index} style={{ fontWeight: 700, color: "#ffffff" }}>
            {part.slice(2, -2)}
          </strong>
        );
      }

      // Italic: *text* or _text_
      if (
        (part.startsWith("*") && part.endsWith("*") && part.length > 2) ||
        (part.startsWith("_") && part.endsWith("_") && part.length > 2)
      ) {
        return (
          <em key={index} style={{ fontStyle: "italic", opacity: 0.9 }}>
            {part.slice(1, -1)}
          </em>
        );
      }

      // Link: [text](url)
      const linkMatch = part.match(/^\[([^\]]+)\]\(([^)]+)\)$/);
      if (linkMatch) {
        return (
          <a
            key={index}
            href={linkMatch[2]}
            target="_blank"
            rel="noopener noreferrer"
            style={{ color: "#38bdf8", textDecoration: "underline" }}
          >
            {linkMatch[1]}
          </a>
        );
      }

      return part;
    });
  };

  // Split by code blocks first
  const codeBlockRegex = /```(\w+)?\n([\s\S]*?)```/g;
  const blocks = [];
  let lastIndex = 0;
  let match;

  while ((match = codeBlockRegex.exec(content)) !== null) {
    if (match.index > lastIndex) {
      blocks.push({ type: "text", content: content.slice(lastIndex, match.index) });
    }
    blocks.push({ type: "code", lang: match[1] || "", code: match[2].trim() });
    lastIndex = codeBlockRegex.lastIndex;
  }

  if (lastIndex < content.length) {
    blocks.push({ type: "text", content: content.slice(lastIndex) });
  }

  return (
    <div className="formatted-markdown" style={{ display: "flex", flexDirection: "column", gap: 6, width: "100%" }}>
      {blocks.map((block, bIdx) => {
        if (block.type === "code") {
          return (
            <div
              key={bIdx}
              style={{
                background: "rgba(10, 14, 26, 0.92)",
                border: "1px solid rgba(255, 255, 255, 0.1)",
                borderRadius: 12,
                overflow: "hidden",
                margin: "8px 0",
              }}
            >
              {block.lang && (
                <div
                  style={{
                    background: "rgba(255, 255, 255, 0.05)",
                    padding: "6px 12px",
                    fontSize: 11,
                    fontWeight: 700,
                    color: "rgba(255, 255, 255, 0.6)",
                    textTransform: "uppercase",
                    borderBottom: "1px solid rgba(255, 255, 255, 0.08)",
                  }}
                >
                  {block.lang}
                </div>
              )}
              <pre
                style={{
                  margin: 0,
                  padding: 14,
                  overflowX: "auto",
                  fontFamily: "'Fira Code', 'Courier New', monospace",
                  fontSize: 13,
                  lineHeight: 1.5,
                  color: "#e2e8f0",
                }}
              >
                <code>{block.code}</code>
              </pre>
            </div>
          );
        }

        // Process block text line by line
        const lines = block.content.split("\n");
        const renderedLines = [];

        lines.forEach((line, lIdx) => {
          const trimmed = line.trim();

          // Headings
          if (trimmed.startsWith("### ")) {
            renderedLines.push(
              <h3 key={lIdx} style={{ fontSize: 16, fontWeight: 700, margin: "8px 0 4px", color: "#fff" }}>
                {parseInline(trimmed.slice(4))}
              </h3>
            );
          } else if (trimmed.startsWith("## ")) {
            renderedLines.push(
              <h2 key={lIdx} style={{ fontSize: 18, fontWeight: 700, margin: "10px 0 6px", color: "#fff" }}>
                {parseInline(trimmed.slice(3))}
              </h2>
            );
          } else if (trimmed.startsWith("# ")) {
            renderedLines.push(
              <h1 key={lIdx} style={{ fontSize: 20, fontWeight: 800, margin: "12px 0 6px", color: "#fff" }}>
                {parseInline(trimmed.slice(2))}
              </h1>
            );
          }
          // Numbered Lists (e.g. 1. **Title:** text)
          else if (/^\d+\.\s/.test(trimmed)) {
            const matchNum = trimmed.match(/^(\d+\.)\s+(.*)/);
            renderedLines.push(
              <div key={lIdx} style={{ display: "flex", gap: 8, marginLeft: 4, margin: "2px 0" }}>
                <span style={{ fontWeight: 700, color: "#c084fc", flexShrink: 0 }}>{matchNum[1]}</span>
                <div>{parseInline(matchNum[2])}</div>
              </div>
            );
          }
          // Bullet Lists (e.g. - item or * item)
          else if (/^[-*]\s/.test(trimmed)) {
            const matchBullet = trimmed.match(/^[-*]\s+(.*)/);
            renderedLines.push(
              <div key={lIdx} style={{ display: "flex", gap: 8, marginLeft: 4, margin: "2px 0" }}>
                <span style={{ color: "#38bdf8", flexShrink: 0 }}>•</span>
                <div>{parseInline(matchBullet[1])}</div>
              </div>
            );
          }
          // Blank line
          else if (!trimmed) {
            renderedLines.push(<div key={lIdx} style={{ height: 6 }} />);
          }
          // Normal Paragraph
          else {
            renderedLines.push(
              <div key={lIdx} style={{ lineHeight: 1.6 }}>
                {parseInline(line)}
              </div>
            );
          }
        });

        return <React.Fragment key={bIdx}>{renderedLines}</React.Fragment>;
      })}
    </div>
  );
}

export default FormattedMarkdown;
