import React, { useRef, useState, useEffect } from "react";
import CanvasElement from "./CanvasElement";
import AlignmentGuides from "./AlignmentGuides";
import FloatingToolbar from "./FloatingToolbar";
import { BACKGROUND_PRESETS } from "../PresentationEditor";

export default function SlideCanvas({
  slide,
  selectedElementId,
  onSelectElement,
  onUpdateElement,
  onDeselectAll,
  onDeleteElement,
  onDuplicateElement,
  onAiRefine,
  zoom = 1
}) {
  const viewportRef = useRef(null);
  const canvasRef = useRef(null);
  const [isDragging, setIsDragging] = useState(false);
  const [dragState, setDragState] = useState(null);
  const [alignmentGuides, setAlignmentGuides] = useState({ showX: false, showY: false, xPct: 50, yPct: 50 });
  const [viewportDimensions, setViewportDimensions] = useState({ width: 960, height: 540 });

  useEffect(() => {
    if (!viewportRef.current) return;
    const updateSize = () => {
      if (viewportRef.current) {
        const rect = viewportRef.current.getBoundingClientRect();
        if (rect.width > 0 && rect.height > 0) {
          setViewportDimensions({ width: rect.width, height: rect.height });
        }
      }
    };
    updateSize();
    const observer = new ResizeObserver(updateSize);
    observer.observe(viewportRef.current);
    return () => observer.disconnect();
  }, []);

  if (!slide) {
    return (
      <div className="empty-canvas-notice">
        <span>No slide selected</span>
      </div>
    );
  }

  const elements = slide.elements || [];
  const selectedElement = elements.find((el) => el.id === selectedElementId);

  const getCanvasRect = () => {
    if (!canvasRef.current) return { width: 1, height: 1, left: 0, top: 0 };
    return canvasRef.current.getBoundingClientRect();
  };

  // MOUSE DOWN DRAG TO MOVE ELEMENT
  const handleMouseDownDrag = (e, element) => {
    if (e.target.isContentEditable || e.target.getAttribute("contenteditable") === "true") {
      onSelectElement(element.id);
      return;
    }
    e.stopPropagation();
    onSelectElement(element.id);
    const rect = getCanvasRect();

    setIsDragging(true);
    setDragState({
      mode: "move",
      elementId: element.id,
      startX: e.clientX,
      startY: e.clientY,
      initialX: element.x || 0,
      initialY: element.y || 0,
      canvasWidth: rect.width,
      canvasHeight: rect.height
    });
  };

  // MOUSE DOWN RESIZE ELEMENT
  const handleMouseDownResize = (e, handle) => {
    e.stopPropagation();
    if (!selectedElement) return;
    const rect = getCanvasRect();

    setIsDragging(true);
    setDragState({
      mode: "resize",
      handle,
      elementId: selectedElement.id,
      startX: e.clientX,
      startY: e.clientY,
      initialX: selectedElement.x || 0,
      initialY: selectedElement.y || 0,
      initialWidth: selectedElement.width || 20,
      initialHeight: selectedElement.height || 15,
      canvasWidth: rect.width,
      canvasHeight: rect.height
    });
  };

  // MOUSE MOVE HANDLER (MOVE / RESIZE)
  const handleMouseMove = (e) => {
    if (!isDragging || !dragState || !selectedElement) return;

    const dx = e.clientX - dragState.startX;
    const dy = e.clientY - dragState.startY;

    const dxPct = (dx / dragState.canvasWidth) * 100;
    const dyPct = (dy / dragState.canvasHeight) * 100;

    if (dragState.mode === "move") {
      let newX = Math.max(0, Math.min(95, dragState.initialX + dxPct));
      let newY = Math.max(0, Math.min(95, dragState.initialY + dyPct));

      // SNAP GUIDES LOGIC (Snap to 50% Center X or 50% Center Y)
      const elementCenterX = newX + (selectedElement.width || 20) / 2;
      const elementCenterY = newY + (selectedElement.height || 15) / 2;

      let showX = false;
      let showY = false;

      if (Math.abs(elementCenterX - 50) < 2) {
        newX = 50 - (selectedElement.width || 20) / 2;
        showX = true;
      }
      if (Math.abs(elementCenterY - 50) < 2) {
        newY = 50 - (selectedElement.height || 15) / 2;
        showY = true;
      }

      setAlignmentGuides({ showX, showY, xPct: 50, yPct: 50 });

      onUpdateElement(selectedElement.id, {
        x: Math.round(newX * 10) / 10,
        y: Math.round(newY * 10) / 10
      });
    } else if (dragState.mode === "resize") {
      const { handle, initialX, initialY, initialWidth, initialHeight } = dragState;
      let newX = initialX;
      let newY = initialY;
      let newWidth = initialWidth;
      let newHeight = initialHeight;

      if (handle.includes("e")) newWidth = Math.max(5, initialWidth + dxPct);
      if (handle.includes("w")) {
        const wDiff = Math.min(initialWidth - 5, dxPct);
        newX = initialX + wDiff;
        newWidth = initialWidth - wDiff;
      }
      if (handle.includes("s")) newHeight = Math.max(5, initialHeight + dyPct);
      if (handle.includes("n")) {
        const hDiff = Math.min(initialHeight - 5, dyPct);
        newY = initialY + hDiff;
        newHeight = initialHeight - hDiff;
      }

      onUpdateElement(selectedElement.id, {
        x: Math.round(newX * 10) / 10,
        y: Math.round(newY * 10) / 10,
        width: Math.round(newWidth * 10) / 10,
        height: Math.round(newHeight * 10) / 10
      });
    }
  };

  const handleMouseUp = () => {
    if (isDragging) {
      setIsDragging(false);
      setDragState(null);
      setAlignmentGuides({ showX: false, showY: false, xPct: 50, yPct: 50 });
    }
  };

  const matchedPreset = (BACKGROUND_PRESETS || []).find(
    (p) => p.id === slide.background_theme || p.id === slide.bg_color
  );

  const bgStyle = slide.bg_gradient_start && slide.bg_gradient_end
    ? `linear-gradient(135deg, ${slide.bg_gradient_start} 0%, ${slide.bg_gradient_end} 100%)`
    : matchedPreset
    ? matchedPreset.bg
    : slide.bg_color || "#0f172a";

  const fitScaleX = Math.max(0.2, (viewportDimensions.width - 40) / 960);
  const fitScaleY = Math.max(0.2, (viewportDimensions.height - 40) / 540);
  const baseFitScale = Math.min(fitScaleX, fitScaleY, 1.25);
  const effectiveScale = Math.max(0.2, Math.min(2.5, baseFitScale * zoom));

  return (
    <div
      ref={viewportRef}
      className="slide-canvas-viewport"
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
      onClick={(e) => {
        if (e.target === canvasRef.current || e.target.classList.contains("slide-canvas-viewport") || e.target.classList.contains("slide-canvas-frame")) {
          onDeselectAll();
        }
      }}
    >
      <div
        ref={canvasRef}
        className="slide-canvas-frame 16-9-aspect"
        style={{
          width: "960px",
          height: "540px",
          background: bgStyle,
          transform: `scale(${effectiveScale})`,
          transformOrigin: "center center"
        }}
      >
        {/* RENDER ELEMENTS */}
        {elements.map((el) => (
          <div
            key={el.id}
            className="element-drag-wrapper"
            onMouseDown={(e) => handleMouseDownDrag(e, el)}
          >
            <CanvasElement
              element={el}
              isSelected={el.id === selectedElementId}
              onSelect={onSelectElement}
              onUpdateElement={onUpdateElement}
              onMouseDownResize={handleMouseDownResize}
              onMouseDownDrag={handleMouseDownDrag}
            />
          </div>
        ))}

        {/* FLOATING CONTEXTUAL TOOLBAR NEAR SELECTED ELEMENT */}
        {selectedElement && !isDragging && (
          <FloatingToolbar
            element={selectedElement}
            onUpdateElement={onUpdateElement}
            onDuplicateElement={onDuplicateElement}
            onDeleteElement={onDeleteElement}
            onAiRefine={onAiRefine}
          />
        )}

        {/* SNAP ALIGNMENT GUIDES */}
        <AlignmentGuides activeGuides={alignmentGuides} />
      </div>
    </div>
  );
}
