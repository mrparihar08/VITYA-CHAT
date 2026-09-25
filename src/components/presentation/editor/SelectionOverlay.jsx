import React from "react";
import { RotateCw, Move } from "lucide-react";

export default function SelectionOverlay({
  element,
  zoom = 1,
  onMouseDownResize,
  onMouseDownRotate,
  onMouseDownDrag
}) {
  if (!element) return null;

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

      {/* ROTATION HANDLE */}
      <div
        className="rotation-handle-wrap"
        onMouseDown={(e) => {
          e.stopPropagation();
          onMouseDownRotate?.(e);
        }}
        title="Rotate Element"
      >
        <div className="rotation-line" />
        <div className="rotation-handle">
          <RotateCw size={11} />
        </div>
      </div>

      {/* DRAG MOVE ICON HANDLE */}
      <div
        className="move-handle-badge"
        onMouseDown={(e) => {
          e.stopPropagation();
          onMouseDownDrag?.(e);
        }}
        title="Drag to Move Element"
      >
        <Move size={12} />
      </div>

      {/* 8 RESIZE HANDLES */}
      <div
        className="resize-handle handle-nw"
        onMouseDown={(e) => {
          e.stopPropagation();
          onMouseDownResize?.(e, "nw");
        }}
      />
      <div
        className="resize-handle handle-n"
        onMouseDown={(e) => {
          e.stopPropagation();
          onMouseDownResize?.(e, "n");
        }}
      />
      <div
        className="resize-handle handle-ne"
        onMouseDown={(e) => {
          e.stopPropagation();
          onMouseDownResize?.(e, "ne");
        }}
      />
      <div
        className="resize-handle handle-e"
        onMouseDown={(e) => {
          e.stopPropagation();
          onMouseDownResize?.(e, "e");
        }}
      />
      <div
        className="resize-handle handle-se"
        onMouseDown={(e) => {
          e.stopPropagation();
          onMouseDownResize?.(e, "se");
        }}
      />
      <div
        className="resize-handle handle-s"
        onMouseDown={(e) => {
          e.stopPropagation();
          onMouseDownResize?.(e, "s");
        }}
      />
      <div
        className="resize-handle handle-sw"
        onMouseDown={(e) => {
          e.stopPropagation();
          onMouseDownResize?.(e, "sw");
        }}
      />
      <div
        className="resize-handle handle-w"
        onMouseDown={(e) => {
          e.stopPropagation();
          onMouseDownResize?.(e, "w");
        }}
      />
    </div>
  );
}
