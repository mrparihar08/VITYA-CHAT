import React from "react";
import { List, ChevronRight } from "lucide-react";

export default function OutlineView({ slides = [], activeSlideIndex = 0, onSelectSlide }) {
  if (!slides.length) return null;

  return (
    <div className="ppt-outline-view">
      <div className="outline-scroll-container">
        {slides.map((slide, idx) => {
          const isActive = idx === activeSlideIndex;
          const textElements = (slide.elements || []).filter((el) => el.type === "text" || el.type === "bullets");

          return (
            <div
              key={slide.id || `outline-slide-${idx}`}
              className={`outline-slide-node ${isActive ? "active" : ""}`}
              onClick={() => onSelectSlide(idx)}
            >
              <div className="node-header">
                <span className="node-number">{idx + 1}.</span>
                <span className="node-title">{slide.title || `Slide ${idx + 1}`}</span>
              </div>

              {slide.subtitle && (
                <div className="node-subtitle">
                  <ChevronRight size={12} className="node-bullet-icon" />
                  <span>{slide.subtitle}</span>
                </div>
              )}

              {textElements.length > 0 && (
                <div className="node-content-tree">
                  {textElements.map((el, elIdx) => (
                    <div key={el.id || elIdx} className="tree-leaf-item">
                      <List size={11} className="leaf-icon" />
                      <span className="leaf-text">
                        {el.content || el.text || (el.points ? el.points.join(", ") : "Text block")}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
