import React from "react";
import { MessageSquare, ChevronUp, ChevronDown } from "lucide-react";

export default function SpeakerNotesPanel({
  notes = "",
  onChangeNotes,
  isOpen = false,
  onToggleOpen
}) {
  return (
    <div className={`speaker-notes-drawer ${isOpen ? "expanded" : "collapsed"}`}>
      <div className="notes-header-bar" onClick={onToggleOpen}>
        <div className="notes-header-title">
          <MessageSquare size={14} />
          <span>SPEAKER NOTES</span>
        </div>
        <button className="notes-toggle-btn" title={isOpen ? "Collapse Speaker Notes" : "Expand Speaker Notes"}>
          {isOpen ? <ChevronDown size={14} /> : <ChevronUp size={14} />}
        </button>
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
