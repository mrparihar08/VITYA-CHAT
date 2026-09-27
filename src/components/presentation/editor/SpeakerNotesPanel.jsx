import React from "react";
import { MessageSquare, ChevronUp, ChevronDown, Mic } from "lucide-react";

export default function SpeakerNotesPanel({
  notes = "",
  onChangeNotes,
  isOpen = false,
  onToggleOpen,
  onOpenVoiceover
}) {
  return (
    <div 
      className={`speaker-notes-drawer ${isOpen ? "expanded" : "collapsed"}`}
      onClick={(e) => e.stopPropagation()}
    >
      <div className="notes-header-bar" onClick={onToggleOpen}>
        <div className="notes-header-title" style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <MessageSquare size={14} />
          <span>SPEAKER NOTES</span>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          {isOpen && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                onOpenVoiceover?.();
              }}
              title="Synthesize AI Voiceover narration for this slide"
              style={{
                background: "rgba(192, 132, 252, 0.2)",
                border: "1px solid rgba(192, 132, 252, 0.4)",
                color: "#c084fc",
                fontSize: "11px",
                fontWeight: 700,
                padding: "3px 8px",
                borderRadius: "6px",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                gap: "4px",
              }}
            >
              <Mic size={12} />
              <span>AI Voiceover</span>
            </button>
          )}

          <button className="notes-toggle-btn" title={isOpen ? "Collapse Speaker Notes" : "Expand Speaker Notes"}>
            {isOpen ? <ChevronDown size={14} /> : <ChevronUp size={14} />}
          </button>
        </div>
      </div>

      {isOpen && (
        <div className="notes-content-wrap">
          <textarea
            value={notes}
            onChange={(e) => onChangeNotes?.(e.target.value)}
            className="notes-textarea"
            placeholder="Add presenter speaker notes for this slide (e.g. key takeaways, talking points)..."
            rows={3}
          />
        </div>
      )}
    </div>
  );
}

