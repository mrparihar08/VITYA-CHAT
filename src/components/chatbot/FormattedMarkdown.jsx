import React from "react";

export const extractYouTubeId = (url) => {
  if (!url) return null;
  const match = String(url).match(/(?:youtube\.com\/(?:watch\?.*v=|embed\/)|youtu\.be\/)([a-zA-Z0-9_-]{11})/i);
  return match ? match[1] : null;
};

export const extractAllYouTubeVideos = (line) => {
  if (!line || typeof line !== "string") return [];
  const videos = [];
  const seenIds = new Set();

  // 1. Markdown links: [Title](url)
  const linkRegex = /\[((?:\[[^\]]*\]|[\s\S])*?)\]\((https?:\/\/[^\s)]+)\)/g;
  let match;
  while ((match = linkRegex.exec(line)) !== null) {
    const title = match[1];
    const url = match[2];
    const id = extractYouTubeId(url);
    if (id && !seenIds.has(id)) {
      seenIds.add(id);
      videos.push({ title: title.replace(/^🔗\s*/, "").trim(), url, id });
    }
  }

  // 2. Raw URLs: https://...
  const rawUrlRegex = /(https?:\/\/[^\s<>()]+)/g;
  while ((match = rawUrlRegex.exec(line)) !== null) {
    const url = match[1];
    const id = extractYouTubeId(url);
    if (id && !seenIds.has(id)) {
      seenIds.add(id);
      videos.push({ title: "YouTube Video", url, id });
    }
  }

  return videos;
};

export function FormattedMarkdown({ content }) {
  if (typeof content !== "string") {
    return <span>{JSON.stringify(content)}</span>;
  }

  // Helper to parse inline markdown: **bold**, *italic*, `code`, [link](url), raw URLs
  const parseInline = (text) => {
    if (!text) return [];

    const regex = /(`[^`]+`|\*\*[^*]+\*\*|__[^_]+__|(?:\b|_)\*[^*]+\*(?:\b|_)|(?:\b|_)_[^_]+_(?:\b|_)|\[(?:\[[^\]]*\]|[\s\S])*?\]\(https?:\/\/[^\s)]+\)|https?:\/\/[^\s<>()]+)/g;

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

      // Markdown Link: [text](url)
      const linkMatch = part.match(/^\[((?:\[[^\]]*\]|[\s\S])*?)\]\((https?:\/\/[^\s)]+)\)$/);
      if (linkMatch) {
        const linkTitle = linkMatch[1];
        const linkUrl = linkMatch[2];
        const ytId = extractYouTubeId(linkUrl);

        if (ytId) {
          return (
            <a
              key={index}
              href={linkUrl}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "6px",
                padding: "3px 10px",
                background: "rgba(239, 68, 68, 0.18)",
                border: "1px solid rgba(239, 68, 68, 0.5)",
                borderRadius: "8px",
                color: "#fca5a5",
                fontWeight: 600,
                textDecoration: "none",
                fontSize: "13px",
                margin: "2px 0",
              }}
            >
              <span style={{ color: "#ef4444" }}>▶</span>
              <span>{linkTitle}</span>
              <span style={{ fontSize: "11px", opacity: 0.8 }}>↗</span>
            </a>
          );
        }

        return (
          <a
            key={index}
            href={linkUrl}
            target="_blank"
            rel="noopener noreferrer"
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "4px",
              padding: "2px 8px",
              background: "rgba(56, 189, 248, 0.12)",
              border: "1px solid rgba(56, 189, 248, 0.3)",
              borderRadius: "6px",
              color: "#38bdf8",
              fontWeight: 600,
              textDecoration: "none",
              fontSize: "0.95em",
              margin: "0 2px",
            }}
          >
            <span>{linkTitle}</span>
            <span style={{ fontSize: "10px", opacity: 0.8 }}>↗</span>
          </a>
        );
      }

      // Raw URL: https://...
      const rawUrlMatch = part.match(/^(https?:\/\/[^\s<>()]+)$/);
      if (rawUrlMatch) {
        const rawUrl = rawUrlMatch[1];
        const ytId = extractYouTubeId(rawUrl);

        if (ytId) {
          return (
            <a
              key={index}
              href={rawUrl}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "6px",
                padding: "3px 10px",
                background: "rgba(239, 68, 68, 0.18)",
                border: "1px solid rgba(239, 68, 68, 0.5)",
                borderRadius: "8px",
                color: "#fca5a5",
                fontWeight: 600,
                textDecoration: "none",
                fontSize: "13px",
                margin: "2px 0",
              }}
            >
              <span style={{ color: "#ef4444" }}>▶</span>
              <span>YouTube Video</span>
              <span style={{ fontSize: "11px", opacity: 0.8 }}>↗</span>
            </a>
          );
        }

        return (
          <a
            key={index}
            href={rawUrl}
            target="_blank"
            rel="noopener noreferrer"
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "4px",
              padding: "2px 8px",
              background: "rgba(56, 189, 248, 0.12)",
              border: "1px solid rgba(56, 189, 248, 0.3)",
              borderRadius: "6px",
              color: "#38bdf8",
              fontWeight: 600,
              textDecoration: "none",
              fontSize: "0.95em",
              margin: "0 2px",
              wordBreak: "break-all",
            }}
          >
            <span>{rawUrl}</span>
            <span style={{ fontSize: "10px", opacity: 0.8 }}>↗</span>
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
          const ytVideos = extractAllYouTubeVideos(line);

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

          // Embedded YouTube player cards
          if (ytVideos.length > 0) {
            ytVideos.forEach((yt, ytIdx) => {
              renderedLines.push(
                <div
                  key={`yt-${lIdx}-${ytIdx}`}
                  style={{
                    marginTop: 10,
                    marginBottom: 12,
                    borderRadius: 14,
                    overflow: "hidden",
                    border: "1px solid rgba(255, 255, 255, 0.14)",
                    background: "rgba(10, 15, 29, 0.95)",
                    boxShadow: "0 10px 30px rgba(0, 0, 0, 0.45)",
                    maxWidth: 560,
                    width: "100%",
                  }}
                >
                  <div style={{ position: "relative", paddingBottom: "56.25%", height: 0 }}>
                    <iframe
                      src={`https://www.youtube-nocookie.com/embed/${yt.id}`}
                      title={yt.title || "YouTube video"}
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                      style={{
                        position: "absolute",
                        top: 0,
                        left: 0,
                        width: "100%",
                        height: "100%",
                        border: 0,
                      }}
                    />
                  </div>
                  <div
                    style={{
                      padding: "10px 14px",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      gap: 12,
                      background: "rgba(15, 23, 42, 0.85)",
                      borderTop: "1px solid rgba(255, 255, 255, 0.08)",
                    }}
                  >
                    <div style={{ minWidth: 0, flex: 1 }}>
                      <div
                        style={{
                          fontSize: 13,
                          fontWeight: 700,
                          color: "#f8fafc",
                          whiteSpace: "nowrap",
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                        }}
                      >
                        {yt.title}
                      </div>
                      <div style={{ fontSize: 11, color: "#94a3b8" }}>YouTube Video Link</div>
                    </div>
                    <a
                      href={yt.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{
                        display: "inline-flex",
                        alignItems: "center",
                        gap: 5,
                        padding: "5px 12px",
                        borderRadius: 8,
                        background: "#dc2626",
                        color: "#ffffff",
                        fontSize: 11.5,
                        fontWeight: 700,
                        textDecoration: "none",
                        flexShrink: 0,
                        transition: "filter 0.15s ease",
                      }}
                    >
                      Watch ↗
                    </a>
                  </div>
                </div>
              );
            });
          }
        });

        return <React.Fragment key={bIdx}>{renderedLines}</React.Fragment>;
      })}
    </div>
  );
}

export default FormattedMarkdown;
