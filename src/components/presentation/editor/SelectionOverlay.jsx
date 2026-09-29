import React from "react";
import { RotateCw, Move } from "lucide-react";

export default function SelectionOverlay({
  element,
  zoom = 1,
  onPointerDownResize,
  onMouseDownResize,
  onMouseDownRotate,
  onPointerDownDrag,
  onMouseDownDrag,
  onAutoFitHeight,
  onAutoFitBoth
}) {
  if (!element) return null;

  const handleResize = onPointerDownResize || onMouseDownResize;
  const handleDrag = onPointerDownDrag || onMouseDownDrag;

  return (
    <div
      className="selection-overlay-box"
      style={{
        position: "absolute",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        pointerEvents: "none"
      }}
    >
      {/* SELECTION BOUNDING BOX */}
      <div className="selection-border" />

      {/* ROTATION HANDLE (only rendered when handler provided) */}
      {onMouseDownRotate && (
        <div
          className="rotation-handle-wrap"
          style={{ pointerEvents: "auto" }}
          onPointerDown={(e) => {
            e.stopPropagation();
            onMouseDownRotate?.(e);
          }}
          onMouseDown={(e) => {
            e.stopPropagation();
          }}
          title="Rotate Element"
        >
          <div className="rotation-line" />
          <div className="rotation-handle">
            <RotateCw size={11} />
          </div>
        </div>
      )}

      {/* DRAG MOVE ICON HANDLE */}
      <div
        className="move-handle-badge"
        style={{ pointerEvents: "auto" }}
        onPointerDown={(e) => {
          e.stopPropagation();
          handleDrag?.(e);
        }}
        onMouseDown={(e) => {
          e.stopPropagation();
          handleDrag?.(e);
        }}
        title="Drag to Move Element"
      >
        <Move size={12} />
      </div>

      {/* 8 RESIZE HANDLES */}
      {["nw", "n", "ne", "e", "se", "s", "sw", "w"].map((handleDir) => (
        <div
          key={handleDir}
          className={`resize-handle handle-${handleDir}`}
          style={{ pointerEvents: "auto" }}
          onPointerDown={(e) => {
            e.stopPropagation();
            handleResize?.(e, handleDir);
          }}
          onMouseDown={(e) => {
            e.stopPropagation();
            handleResize?.(e, handleDir);
          }}
          onDoubleClick={(e) => {
            e.stopPropagation();
            if (onAutoFitBoth) {
              onAutoFitBoth(element?.id);
            } else if (onAutoFitHeight) {
              onAutoFitHeight(element?.id);
            }
          }}
          title="Drag to resize (Double-click to auto-fit to content)"
        />
      ))}
    </div>
  );
}
