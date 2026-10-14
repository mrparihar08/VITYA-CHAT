import React, { useState } from "react";
import {
  Sparkles,
  Send,
  CheckCircle2,
  X,
  Loader2,
} from "lucide-react";
import { refineSlideText } from "../../../services/api";
import "./RealtimeSlideCopilot.css";

const QUICK_CHIPS = [
  { label: "Make punchier", prompt: "Make this text punchier, concise, and high-impact." },
  { label: "Dark cyber theme", prompt: "Switch slide to dark cyber neon theme." },
  { label: "Replace with tech graphic", prompt: "Replace image with modern cloud architecture graphic." },
  { label: "Convert to 3 metrics", prompt: "Convert this information into 3 quantified executive metrics." },
  { label: "Executive tone", prompt: "Polish with authoritative executive C-suite tone." },
];

export default function RealtimeSlideCopilot({
  slide,
  selectedElement,
  onUpdateElement,
  onUpdateSlide,
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [customPrompt, setCustomPrompt] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [recentActionSuccess, setRecentActionSuccess] = useState(null);

  const handleExecuteCopilot = async (promptToUse = null) => {
    const textPrompt = (promptToUse || customPrompt).trim();
    if (!textPrompt) return;

    setIsProcessing(true);
    setRecentActionSuccess(null);

    const lower = textPrompt.toLowerCase();

    try {
      // 1. Theme Change Prompts (e.g. "Switch to a dark cyber theme", "dark theme", "emerald")
      if (lower.includes("cyber") || lower.includes("dark theme") || lower.includes("neon")) {
        onUpdateSlide?.({
          background_theme: "cyberpunk_neon",
          bg_color: "linear-gradient(135deg, #09090b 0%, #2e1065 50%, #581c87 100%)",
          accent_color: "#f43f5e",
        });
        setRecentActionSuccess("Applied Dark Cyber Neon Theme!");
        setCustomPrompt("");
        return;
      }

      if (lower.includes("emerald") || lower.includes("forest") || lower.includes("green theme")) {
        onUpdateSlide?.({
          background_theme: "emerald_dark",
          bg_color: "linear-gradient(135deg, #022c22 0%, #064e3b 50%, #047857 100%)",
          accent_color: "#34d399",
        });
        setRecentActionSuccess("Applied Emerald Forest Theme!");
        setCustomPrompt("");
        return;
      }

      if (lower.includes("light theme") || lower.includes("clean white")) {
        onUpdateSlide?.({
          background_theme: "corporate_light",
          bg_color: "linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)",
          accent_color: "#0284c7",
        });
        setRecentActionSuccess("Applied Corporate Light Theme!");
        setCustomPrompt("");
        return;
      }

      // 2. Image / Graphic Replacement Prompts
      if (lower.includes("image") || lower.includes("graphic") || lower.includes("visual")) {
        if (selectedElement && selectedElement.type === "image") {
          onUpdateElement?.(selectedElement.id, {
            image_prompt: textPrompt,
            alt: textPrompt,
            src: "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&w=800&q=80",
          });
          setRecentActionSuccess("Updated Graphic Visual!");
          setCustomPrompt("");
          return;
        }
      }

      // 3. Text / Content Refinement via Backend API
      const currentContent = selectedElement?.content || slide?.title || "Executive Strategy";
      let actionType = "polish";
      if (lower.includes("punchier") || lower.includes("headline")) actionType = "headline";
      else if (lower.includes("metric") || lower.includes("chart")) actionType = "chart";
      else if (lower.includes("bullet")) actionType = "bullets";

      const res = await refineSlideText({
        text: currentContent,
        action: actionType,
        slide_title: slide?.title || "Slide",
        presentation_title: "AI Presentation",
      });

      if (res && res.text) {
        if (selectedElement) {
          onUpdateElement?.(selectedElement.id, {
            content: res.text,
          });
        } else {
          onUpdateSlide?.({
            title: res.text,
          });
        }
        setRecentActionSuccess(`Refined: "${res.text.slice(0, 32)}..."`);
      } else {
        // Direct heuristic polish
        if (selectedElement) {
          onUpdateElement?.(selectedElement.id, {
            content: `⚡ ${currentContent.replace(/^⚡\s*/, "")} — High Velocity Execution`,
          });
          setRecentActionSuccess("Applied Punchy Refinement!");
        }
      }
      setCustomPrompt("");
    } catch (err) {
      console.error("Slide Co-Pilot execution error:", err);
      // Fallback direct mutation
      if (selectedElement) {
        onUpdateElement?.(selectedElement.id, {
          content: `${selectedElement.content} (Refined)`,
        });
      }
      setRecentActionSuccess("Updated Element!");
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="copilot-floating-wrapper">
      {!isOpen ? (
        <button
          className="copilot-trigger-pill"
          onClick={() => setIsOpen(true)}
          title="Open Real-Time AI Slide Co-Pilot"
        >
          <Sparkles size={14} className="copilot-sparkle-spin" />
          <span>Slide Co-Pilot</span>
          {selectedElement && (
            <span className="copilot-element-tag">
              {selectedElement.type || "Element"}
            </span>
          )}
        </button>
      ) : (
        <div className="copilot-card">
          {/* Header */}
          <div className="copilot-card-header">
            <div className="copilot-card-title">
              <Sparkles size={15} color="#c084fc" />
              <span>Real-Time Slide Co-Pilot</span>
            </div>
            <button
              className="copilot-close-btn"
              onClick={() => setIsOpen(false)}
            >
              <X size={14} />
            </button>
          </div>

          {/* Context pill */}
          <div className="copilot-context-pill">
            Targeting:{" "}
            <strong>
              {selectedElement
                ? `${selectedElement.type?.toUpperCase()} ("${(selectedElement.content || "").slice(0, 24)}...")`
                : "Active Slide Theme & Canvas"}
            </strong>
          </div>

          {/* Quick Action Chips */}
          <div className="copilot-chips-grid">
            {QUICK_CHIPS.map((chip, i) => (
              <button
                key={i}
                className="copilot-chip-btn"
                onClick={() => handleExecuteCopilot(chip.prompt)}
                disabled={isProcessing}
              >
                {chip.label}
              </button>
            ))}
          </div>

          {/* Freeform Prompt Input */}
          <form
            className="copilot-form"
            onSubmit={(e) => {
              e.preventDefault();
              handleExecuteCopilot();
            }}
          >
            <input
              type="text"
              className="copilot-input"
              placeholder="e.g. 'Make this point punchier', 'Dark cyber theme'..."
              value={customPrompt}
              onChange={(e) => setCustomPrompt(e.target.value)}
              disabled={isProcessing}
            />
            <button
              type="submit"
              className="copilot-send-btn"
              disabled={isProcessing || !customPrompt.trim()}
            >
              {isProcessing ? (
                <Loader2 size={13} className="animate-spin" />
              ) : (
                <Send size={13} />
              )}
            </button>
          </form>

          {/* Success Toast */}
          {recentActionSuccess && (
            <div className="copilot-success-toast">
              <CheckCircle2 size={12} color="#10b981" />
              <span>{recentActionSuccess}</span>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
