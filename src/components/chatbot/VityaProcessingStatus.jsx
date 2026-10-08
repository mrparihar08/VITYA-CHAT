import React, { useState, useEffect } from "react";
import { Sparkles } from "lucide-react";

export const STATUS_CONFIG = {
  thinking: { label: "Thinking", dots: true },
  working: { label: "Working", dots: true },
  exploring: { label: "Exploring", dots: true },
  analyzing: { label: "Analyzing", dots: true },
  generating_chart: { label: "Generating chart", dots: true },
  generating_image: { label: "Generating image", dots: true },
  generating_ppt: { label: "Generating presentation", dots: true },
  generating: { label: "Generating", dots: true },
  checking: { label: "Checking", dots: true },
  finishing: { label: "Finishing", dots: true },
  still_working: { label: "Still working", dots: true },
  checking_connection: { label: "Checking connection", dots: true },
};

/**
 * Infer initial status sequence from user prompt & context
 */
export function getStatusSequence(prompt = "", context = {}) {
  const p = (prompt || "").toLowerCase().trim();
  const { mode = "chat", useWebSearch = false, hasImages = false, isPpt = false } = context;

  if (hasImages || p.includes("receipt") || p.includes("scan") || p.includes("bill")) {
    return ["analyzing", "thinking", "finishing"];
  }

  if (isPpt || mode === "file" || /^\/(presentation|ppt)\b/i.test(p)) {
    return ["working", "exploring", "generating_ppt", "checking", "finishing"];
  }

  if (/^\/image\b/i.test(p) || p.includes("generate image") || p.includes("image banao") || p.includes("photo banao")) {
    return ["working", "generating_image", "checking", "finishing"];
  }

  if (
    p.includes("chart") ||
    p.includes("graph") ||
    p.includes("plot") ||
    p.includes("bar chart") ||
    p.includes("pie chart") ||
    p.includes("visualize") ||
    p.includes("show karo") ||
    p.includes("dikhao")
  ) {
    return ["analyzing", "generating_chart", "checking", "finishing"];
  }

  if (useWebSearch || p.includes("search") || p.includes("latest") || p.includes("news") || p.includes("who is") || p.includes("kya hai")) {
    return ["exploring", "analyzing", "thinking", "finishing"];
  }

  if (p.length > 80 || p.includes("explain") || p.includes("calculate") || p.includes("code") || p.includes("compare")) {
    return ["working", "thinking", "checking", "finishing"];
  }

  return ["thinking", "finishing"];
}

export default function VityaProcessingStatus({
  prompt = "",
  context = {},
  customStatus = null,
}) {
  const [statusKey, setStatusKey] = useState(customStatus || "thinking");
  const [dotCount, setDotCount] = useState(1);
  const [startTime] = useState(Date.now());

  // Status progression lifecycle
  useEffect(() => {
    if (customStatus) {
      setStatusKey(customStatus);
      return;
    }

    const sequence = getStatusSequence(prompt, context);
    let step = 0;
    setStatusKey(sequence[0] || "thinking");

    const timer = setInterval(() => {
      const elapsed = Date.now() - startTime;

      // Timeout safety progression
      if (elapsed > 14000) {
        setStatusKey("checking_connection");
      } else if (elapsed > 7500) {
        setStatusKey("still_working");
      } else {
        step = (step + 1) % sequence.length;
        // Keep statuses visible for intentional duration
        if (step < sequence.length) {
          setStatusKey(sequence[step]);
        }
      }
    }, 2200);

    return () => clearInterval(timer);
  }, [prompt, context, customStatus, startTime]);

  // Subtle cycling dots animation (1 -> 2 -> 3 -> 1)
  useEffect(() => {
    const dotTimer = setInterval(() => {
      setDotCount((prev) => (prev % 3) + 1);
    }, 450);
    return () => clearInterval(dotTimer);
  }, []);

  const currentConfig = STATUS_CONFIG[statusKey] || STATUS_CONFIG.thinking;
  const dotsString = ".".repeat(dotCount);

  return (
    <div
      className="vitya-processing-indicator"
      role="status"
      aria-live="polite"
      aria-label={`${currentConfig.label}...`}
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: 8,
        padding: "6px 12px",
        borderRadius: "12px",
        background: "rgba(15, 23, 42, 0.45)",
        border: "1px solid rgba(139, 92, 246, 0.18)",
        backdropFilter: "blur(12px)",
        boxShadow: "0 4px 14px rgba(0, 0, 0, 0.2), 0 0 12px rgba(139, 92, 246, 0.08)",
        marginTop: 4,
        marginBottom: 4,
        animation: "vityaStatusFadeIn 0.2s ease-out forwards",
      }}
    >
      {/* VITYA BRANDED COMPACT AVATAR */}
      <div
        className="vitya-processing-avatar"
        style={{
          width: 20,
          height: 20,
          borderRadius: "50%",
          background: "linear-gradient(135deg, #8b5cf6 0%, #6366f1 100%)",
          display: "grid",
          placeItems: "center",
          boxShadow: "0 0 10px rgba(139, 92, 246, 0.5)",
          flexShrink: 0,
          animation: "vityaAvatarPulse 2s infinite ease-in-out",
        }}
      >
        <Sparkles size={11} color="#ffffff" />
      </div>

      {/* DYNAMIC CONTEXTUAL STATUS TEXT */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 2,
          fontSize: 13,
          fontWeight: 600,
          color: "#e2e8f0",
          letterSpacing: "0.01em",
          userSelect: "none",
        }}
      >
        <span
          key={statusKey}
          style={{
            animation: "vityaTextSlide 0.25s ease-out",
            background: "linear-gradient(90deg, #f1f5f9 0%, #cbd5e1 100%)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
          }}
        >
          {currentConfig.label}
        </span>
        <span
          style={{
            display: "inline-block",
            width: "16px",
            color: "#a78bfa",
            fontWeight: 800,
            textAlign: "left",
          }}
        >
          {dotsString}
        </span>
      </div>

      {/* EMBEDDED CSS ANIMATIONS */}
      <style>{`
        @keyframes vityaStatusFadeIn {
          0% {
            opacity: 0;
            transform: translateY(4px) scale(0.98);
          }
          100% {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }
        @keyframes vityaAvatarPulse {
          0%, 100% {
            transform: scale(1);
            box-shadow: 0 0 8px rgba(139, 92, 246, 0.4);
          }
          50% {
            transform: scale(1.08);
            box-shadow: 0 0 14px rgba(139, 92, 246, 0.75), 0 0 6px rgba(99, 102, 241, 0.6);
          }
        }
        @keyframes vityaTextSlide {
          0% {
            opacity: 0;
            transform: translateY(2px);
          }
          100% {
            opacity: 1;
            transform: translateY(0);
          }
        }
        @media (prefers-reduced-motion: reduce) {
          .vitya-processing-avatar,
          .vitya-processing-indicator {
            animation: none !important;
          }
        }
      `}</style>
    </div>
  );
}
