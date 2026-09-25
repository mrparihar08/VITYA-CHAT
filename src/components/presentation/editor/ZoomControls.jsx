import React from "react";
import { ZoomIn, ZoomOut, Maximize2, Minimize2 } from "lucide-react";

export default function ZoomControls({
  zoom = 1,
  onZoomChange,
  onFitToScreen,
  onFitToWidth
}) {
  const zoomPct = Math.round(zoom * 100);

  return (
    <div className="ppt-zoom-controls">
      <button 
        className="zoom-btn"
        onClick={() => onZoomChange(Math.max(0.4, zoom - 0.1))}
        title="Zoom Out (-)"
      >
        <ZoomOut size={13} />
      </button>

      <span className="zoom-pct-display">{zoomPct}%</span>

      <button 
        className="zoom-btn"
        onClick={() => onZoomChange(Math.min(2.0, zoom + 0.1))}
        title="Zoom In (+)"
      >
        <ZoomIn size={13} />
      </button>

      <div className="zoom-divider" />

      <button 
        className="zoom-btn text-btn"
        onClick={onFitToScreen}
        title="Fit Slide to Screen"
      >
        <Maximize2 size={13} />
        <span>Fit</span>
      </button>

      <button 
        className="zoom-btn text-btn"
        onClick={onFitToWidth}
        title="Fit to Canvas Width"
      >
        <Minimize2 size={13} />
        <span>Width</span>
      </button>
    </div>
  );
}
