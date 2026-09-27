import React, { useRef, useState, useEffect, useCallback } from "react";
import CanvasElement from "./CanvasElement";
import FloatingToolbar from "./FloatingToolbar";
import SlideBackdropDecorations from "./SlideBackdropDecorations";
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
  zoom = 1,
  slideIndex = 0,
  totalSlides = 1,
  templateName = "base_template"
}) {
  const viewportRef = useRef(null);
  const canvasRef = useRef(null);
  const [isDragging, setIsDragging] = useState(false);
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

  const elements = slide?.elements || [];
  const selectedElement = elements.find((el) => el.id === selectedElementId);

  const fitScaleX = Math.max(0.2, (viewportDimensions.width - 40) / 960);
  const fitScaleY = Math.max(0.2, (viewportDimensions.height - 40) / 540);
  const baseFitScale = Math.min(fitScaleX, fitScaleY, 1.25);
  const effectiveScale = Math.max(0.2, Math.min(2.5, baseFitScale * zoom));

  const getCanvasRect = useCallback(() => {
    if (!canvasRef.current) {
      return { width: 960 * effectiveScale, height: 540 * effectiveScale, left: 0, top: 0 };
    }
    const rect = canvasRef.current.getBoundingClientRect();
    return {
      width: rect.width > 0 ? rect.width : 960 * effectiveScale,
      height: rect.height > 0 ? rect.height : 540 * effectiveScale,
      left: rect.left,
      top: rect.top
    };
  }, [effectiveScale]);

  // UNIFIED POINTER DOWN DRAG HANDLER FOR ALL ELEMENTS
  const handlePointerDownDrag = useCallback((e, element) => {
    if (!element || !element.id) return;
    if (e.button !== undefined && e.button !== 0) return;

    if (e.target.closest && e.target.closest(".resize-handle, .rotation-handle-wrap")) {
      return;
    }

    onSelectElement?.(element.id);

    const rect = getCanvasRect();
    if (!rect || rect.width <= 0 || rect.height <= 0) return;

    const startX = e.clientX;
    const startY = e.clientY;
    const initialX = element.x !== undefined ? Number(element.x) : 0;
    const initialY = element.y !== undefined ? Number(element.y) : 0;
    const elW = element.width !== undefined ? Number(element.width) : 30;
    const elH = element.height !== undefined ? Number(element.height) : 20;

    let isDragActive = false;
    let pointerCaptured = false;
    const targetEl = e.currentTarget;
    const pointerId = e.pointerId;

    const handlePointerMove = (moveEvt) => {
      const dx = moveEvt.clientX - startX;
      const dy = moveEvt.clientY - startY;
      const dist = Math.hypot(dx, dy);

      if (!isDragActive) {
        if (dist < 4) return;
        isDragActive = true;
        setIsDragging(true);
        try {
          if (targetEl && targetEl.setPointerCapture && pointerId !== undefined) {
            targetEl.setPointerCapture(pointerId);
            pointerCaptured = true;
          }
        } catch (err) {}
      }

      if (moveEvt.cancelable) {
        moveEvt.preventDefault();
      }

      const dxPct = (dx / rect.width) * 100;
      const dyPct = (dy / rect.height) * 100;

      const maxX = Math.max(0, 100 - elW);
      const maxY = Math.max(0, 100 - elH);

      const newX = Math.max(0, Math.min(maxX, initialX + dxPct));
      const newY = Math.max(0, Math.min(maxY, initialY + dyPct));

      onUpdateElement?.(element.id, {
        x: Math.round(newX * 10) / 10,
        y: Math.round(newY * 10) / 10
      });
    };

    const handlePointerUp = () => {
      if (pointerCaptured && targetEl && targetEl.releasePointerCapture && pointerId !== undefined) {
        try {
          targetEl.releasePointerCapture(pointerId);
        } catch (err) {}
      }
      setIsDragging(false);
      window.removeEventListener("pointermove", handlePointerMove);
      window.removeEventListener("pointerup", handlePointerUp);
      window.removeEventListener("pointercancel", handlePointerUp);
      window.removeEventListener("mousemove", handlePointerMove);
      window.removeEventListener("mouseup", handlePointerUp);
    };

    window.addEventListener("pointermove", handlePointerMove);
    window.addEventListener("pointerup", handlePointerUp);
    window.addEventListener("pointercancel", handlePointerUp);
    window.addEventListener("mousemove", handlePointerMove);
    window.addEventListener("mouseup", handlePointerUp);
  }, [getCanvasRect, onSelectElement, onUpdateElement]);

  // UNIFIED POINTER DOWN RESIZE HANDLER FOR ALL ELEMENTS
  const handlePointerDownResize = useCallback((e, handle) => {
    if (e.button !== undefined && e.button !== 0) return;
    e.stopPropagation();

    if (!selectedElement) return;
    const rect = getCanvasRect();
    if (!rect || rect.width <= 0 || rect.height <= 0) return;

    const startX = e.clientX;
    const startY = e.clientY;
    const initialX = selectedElement.x !== undefined ? Number(selectedElement.x) : 0;
    const initialY = selectedElement.y !== undefined ? Number(selectedElement.y) : 0;
    const initialWidth = selectedElement.width !== undefined ? Number(selectedElement.width) : 20;
    const initialHeight = selectedElement.height !== undefined ? Number(selectedElement.height) : 15;

    let pointerCaptured = false;
    const targetEl = e.currentTarget;
    const pointerId = e.pointerId;

    setIsDragging(true);

    try {
      if (targetEl && targetEl.setPointerCapture && pointerId !== undefined) {
        targetEl.setPointerCapture(pointerId);
        pointerCaptured = true;
      }
    } catch (err) {}

    const handlePointerMove = (moveEvt) => {
      if (moveEvt.cancelable) {
        moveEvt.preventDefault();
      }
      const dx = moveEvt.clientX - startX;
      const dy = moveEvt.clientY - startY;

      const dxPct = (dx / rect.width) * 100;
      const dyPct = (dy / rect.height) * 100;

      const minW = 4;
      const minH = 4;

      let newX = initialX;
      let newY = initialY;
      let newWidth = initialWidth;
      let newHeight = initialHeight;

      if (handle.includes("e")) {
        const maxW = 100 - initialX;
        newWidth = Math.max(minW, Math.min(maxW, initialWidth + dxPct));
      }
      if (handle.includes("w")) {
        const clampedShiftX = Math.max(-initialX, Math.min(initialWidth - minW, dxPct));
        newX = initialX + clampedShiftX;
        newWidth = initialWidth - clampedShiftX;
      }

      if (handle.includes("s")) {
        const maxH = 100 - initialY;
        newHeight = Math.max(minH, Math.min(maxH, initialHeight + dyPct));
      }
      if (handle.includes("n")) {
        const clampedShiftY = Math.max(-initialY, Math.min(initialHeight - minH, dyPct));
        newY = initialY + clampedShiftY;
        newHeight = initialHeight - clampedShiftY;
      }

      onUpdateElement?.(selectedElement.id, {
        x: Math.round(newX * 10) / 10,
        y: Math.round(newY * 10) / 10,
        width: Math.round(newWidth * 10) / 10,
        height: Math.round(newHeight * 10) / 10
      });
    };

    const handlePointerUp = () => {
      if (pointerCaptured && targetEl && targetEl.releasePointerCapture && pointerId !== undefined) {
        try {
          targetEl.releasePointerCapture(pointerId);
        } catch (err) {}
      }
      setIsDragging(false);
      window.removeEventListener("pointermove", handlePointerMove);
      window.removeEventListener("pointerup", handlePointerUp);
      window.removeEventListener("pointercancel", handlePointerUp);
      window.removeEventListener("mousemove", handlePointerMove);
      window.removeEventListener("mouseup", handlePointerUp);
    };

    window.addEventListener("pointermove", handlePointerMove);
    window.addEventListener("pointerup", handlePointerUp);
    window.addEventListener("pointercancel", handlePointerUp);
    window.addEventListener("mousemove", handlePointerMove);
    window.addEventListener("mouseup", handlePointerUp);
  }, [getCanvasRect, selectedElement, onUpdateElement]);

  if (!slide) {
    return (
      <div className="empty-canvas-notice">
        <span>No slide selected</span>
      </div>
    );
  }

  const matchedPreset = (BACKGROUND_PRESETS || []).find(
    (p) => p.id === slide.background_theme || p.id === slide.bg_color
  );

  const bgStyle = slide.bg_gradient_start && slide.bg_gradient_end
    ? `linear-gradient(135deg, ${slide.bg_gradient_start} 0%, ${slide.bg_gradient_end} 100%)`
    : matchedPreset
    ? matchedPreset.bg
    : slide.bg_color || "#0f172a";

  return (
    <div ref={viewportRef} className="slide-canvas-viewport" style={{ width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center", overflow: "hidden", position: "relative" }}>
      <div
        ref={canvasRef}
        className="slide-canvas-frame 16-9-aspect"
        style={{
          width: "960px",
          height: "540px",
          background: bgStyle,
          transform: `scale(${effectiveScale})`,
          transformOrigin: "center center",
          position: "relative"
        }}
        onClick={(e) => {
          if (e.target === canvasRef.current || e.target.classList.contains("slide-canvas-frame")) {
            onDeselectAll?.();
          }
        }}
      >
        {/* BACKDROP ARCHETYPE & TEMPLATE SHAPES */}
        <SlideBackdropDecorations
          slide={slide}
          slideIndex={slideIndex}
          totalSlides={totalSlides}
          templateName={templateName}
        />

        {/* RENDER ELEMENTS LAYER */}
        <div
          className="slide-elements-layer"
          style={{ position: "absolute", inset: 0, zIndex: 2 }}
          onClick={(e) => {
            if (e.target.className === "slide-elements-layer") {
              onDeselectAll?.();
            }
          }}
        >
          {elements.map((el) => (
            <CanvasElement
              key={el.id}
              element={el}
              isSelected={el.id === selectedElementId}
              isDragging={isDragging}
              onSelect={onSelectElement}
              onUpdateElement={onUpdateElement}
              onPointerDownResize={handlePointerDownResize}
              onMouseDownResize={handlePointerDownResize}
              onPointerDownDrag={handlePointerDownDrag}
              onMouseDownDrag={handlePointerDownDrag}
            />
          ))}
        </div>

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
      </div>
    </div>
  );
}
