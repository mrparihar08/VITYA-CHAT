import React, { useEffect } from "react";
import SlideCanvas from "./SlideCanvas";
import SpeakerNotesPanel from "./SpeakerNotesPanel";

export default function CanvasWorkspace({
  slide,
  selectedElementId,
  onSelectElement,
  onUpdateElement,
  onDeselectAll,
  onDeleteElement,
  onDuplicateElement,
  onAiRefine,
  onChangeNotes,
  isNotesOpen,
  onToggleNotes,
  onOpenVoiceover,
  zoom = 1,
  slideIndex = 0,
  totalSlides = 1,
  templateName = "base_template"
}) {
  // GLOBAL KEYBOARD SHORTCUTS FOR CANVAS WORKSPACE
  useEffect(() => {
    const handleKeyDown = (e) => {
      // Do not trigger canvas shortcuts while typing in inputs or contenteditable elements
      if (
        ["INPUT", "TEXTAREA", "SELECT"].includes(document.activeElement?.tagName) ||
        document.activeElement?.isContentEditable ||
        document.activeElement?.getAttribute("contenteditable") === "true" ||
        document.activeElement?.closest?.('[contenteditable="true"]')
      ) {
        return;
      }

      if (!selectedElementId) return;

      if (e.key === "Delete" || e.key === "Backspace") {
        e.preventDefault();
        onDeleteElement?.(selectedElementId);
      } else if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "d") {
        e.preventDefault();
        onDuplicateElement?.(selectedElementId);
      } else if (e.key === "Escape") {
        onDeselectAll?.();
      } else if (["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight"].includes(e.key)) {
        e.preventDefault();
        const step = e.shiftKey ? 5 : 1;
        let dx = 0;
        let dy = 0;
        if (e.key === "ArrowLeft") dx = -step;
        if (e.key === "ArrowRight") dx = step;
        if (e.key === "ArrowUp") dy = -step;
        if (e.key === "ArrowDown") dy = step;

        const currentEl = slide?.elements?.find((el) => el.id === selectedElementId);
        if (currentEl) {
          const elW = currentEl.width !== undefined ? Number(currentEl.width) : 20;
          const elH = currentEl.height !== undefined ? Number(currentEl.height) : 15;
          const maxX = Math.max(0, 100 - elW);
          const maxY = Math.max(0, 100 - elH);
          onUpdateElement?.(selectedElementId, {
            x: Math.max(0, Math.min(maxX, Math.round(((currentEl.x || 0) + dx) * 10) / 10)),
            y: Math.max(0, Math.min(maxY, Math.round(((currentEl.y || 0) + dy) * 10) / 10))
          });
        }
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [selectedElementId, slide, onUpdateElement, onDeleteElement, onDuplicateElement, onDeselectAll]);

  return (
    <main 
      className="ppt-canvas-workspace"
      onClick={(e) => {
        if (e.target.classList.contains("ppt-canvas-workspace")) {
          onDeselectAll?.();
        }
      }}
    >
      <SlideCanvas
        slide={slide}
        selectedElementId={selectedElementId}
        onSelectElement={onSelectElement}
        onUpdateElement={onUpdateElement}
        onDeselectAll={onDeselectAll}
        onDeleteElement={onDeleteElement}
        onDuplicateElement={onDuplicateElement}
        onAiRefine={onAiRefine}
        zoom={zoom}
        slideIndex={slideIndex}
        totalSlides={totalSlides}
        templateName={templateName}
      />

      {/* COLLAPSIBLE SPEAKER NOTES DRAWER */}
      <SpeakerNotesPanel
        notes={slide?.notes || ""}
        onChangeNotes={onChangeNotes}
        isOpen={isNotesOpen}
        onToggleOpen={onToggleNotes}
        onOpenVoiceover={onOpenVoiceover}
      />
    </main>
  );
}
