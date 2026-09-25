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
  zoom = 1
}) {
  // GLOBAL KEYBOARD SHORTCUTS FOR CANVAS WORKSPACE
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (["INPUT", "TEXTAREA", "SELECT"].includes(document.activeElement?.tagName) || document.activeElement?.isContentEditable || document.activeElement?.getAttribute("contenteditable") === "true") {
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
          onUpdateElement(selectedElementId, {
            x: Math.max(0, Math.min(95, (currentEl.x || 0) + dx)),
            y: Math.max(0, Math.min(95, (currentEl.y || 0) + dy))
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
          onDeselectAll();
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
      />

      {/* COLLAPSIBLE SPEAKER NOTES DRAWER */}
      <SpeakerNotesPanel
        notes={slide?.notes || ""}
        onChangeNotes={onChangeNotes}
        isOpen={isNotesOpen}
        onToggleOpen={onToggleNotes}
      />
    </main>
  );
}

