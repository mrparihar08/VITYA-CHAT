import React, { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight, X } from "lucide-react";
import CanvasElement from "./CanvasElement";

export default function PresentModal({ slides = [], initialSlideIndex = 0, isOpen, onClose }) {
  const [currentIndex, setCurrentIndex] = useState(initialSlideIndex);

  useEffect(() => {
    setCurrentIndex(initialSlideIndex);
  }, [initialSlideIndex, isOpen]);

  // KEYBOARD NAVIGATION IN PRESENTATION MODE
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e) => {
      if (e.key === "ArrowRight" || e.key === "Space" || e.key === "Enter") {
        e.preventDefault();
        setCurrentIndex((prev) => Math.min(slides.length - 1, prev + 1));
      } else if (e.key === "ArrowLeft") {
        e.preventDefault();
        setCurrentIndex((prev) => Math.max(0, prev - 1));
      } else if (e.key === "Escape") {
        onClose();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, slides.length, onClose]);

  if (!isOpen || !slides.length) return null;

  const currentSlide = slides[currentIndex] || slides[0];
  const bgStyle = currentSlide.background_theme === "custom"
    ? `linear-gradient(135deg, ${currentSlide.bg_gradient_start || "#0f172a"} 0%, ${currentSlide.bg_gradient_end || "#1e1b4b"} 100%)`
    : currentSlide.bg_color || "#0f172a";

  return (
    <div className="present-fullscreen-overlay">
      {/* FLOATING CONTROLS BAR */}
      <div className="present-controls-bar">
        <span className="present-slide-counter">
          Slide {currentIndex + 1} of {slides.length}
        </span>

        <div className="present-nav-group">
          <button 
            onClick={() => setCurrentIndex((prev) => Math.max(0, prev - 1))}
            disabled={currentIndex === 0}
          >
            <ChevronLeft size={18} />
          </button>
          <button 
            onClick={() => setCurrentIndex((prev) => Math.min(slides.length - 1, prev + 1))}
            disabled={currentIndex === slides.length - 1}
          >
            <ChevronRight size={18} />
          </button>
        </div>

        <button className="present-exit-btn" onClick={onClose} title="Exit Slideshow (Esc)">
          <X size={18} />
          <span>Exit</span>
        </button>
      </div>

      {/* FULLSCREEN SLIDE VIEWPORT */}
      <div className="present-slide-viewport">
        <div 
          className="present-slide-canvas 16-9-aspect"
          style={{ background: bgStyle }}
        >
          {currentSlide.elements && currentSlide.elements.map((el) => (
            <CanvasElement key={el.id} element={el} isSelected={false} onSelect={() => {}} />
          ))}
        </div>
      </div>
    </div>
  );
}
