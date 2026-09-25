import React from "react";

export default function AlignmentGuides({ activeGuides = { showX: false, showY: false, xPct: 50, yPct: 50 } }) {
  if (!activeGuides.showX && !activeGuides.showY) return null;

  return (
    <div className="alignment-guides-container">
      {/* VERTICAL GUIDE LINE */}
      {activeGuides.showX && (
        <div
          className="guide-line vertical-guide"
          style={{ left: `${activeGuides.xPct}%` }}
        />
      )}

      {/* HORIZONTAL GUIDE LINE */}
      {activeGuides.showY && (
        <div
          className="guide-line horizontal-guide"
          style={{ top: `${activeGuides.yPct}%` }}
        />
      )}
    </div>
  );
}
