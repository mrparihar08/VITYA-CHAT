import React, { useState } from "react";
import { Plus, Copy, Trash2, ChevronUp, ChevronDown, ChevronLeft, Layers, ListTree } from "lucide-react";
import SlideLayoutPicker from "./SlideLayoutPicker";
import OutlineView from "./OutlineView";

export default function SlideSidebar({
  slides = [],
  activeSlideIndex = 0,
  onSelectSlide,
  onAddSlide,
  onDuplicateSlide,
  onDeleteSlide,
  onMoveSlide,
  onAiAction,
  onToggleSidebar
}) {
  const [isLayoutPickerOpen, setIsLayoutPickerOpen] = useState(false);
  const [sidebarTab, setSidebarTab] = useState("slides"); // 'slides' | 'outline'

  return (
    <aside className="ppt-slide-sidebar">
      {/* SIDEBAR HEADER WITH SLIDES & OUTLINE TABS */}
      <div className="sidebar-header">
        <div className="sidebar-tab-switch">
          <button
            className={`tab-switch-btn ${sidebarTab === "slides" ? "active" : ""}`}
            onClick={() => setSidebarTab("slides")}
            title="View slide thumbnail grid"
          >
            <Layers size={13} />
            <span>SLIDES ({slides.length})</span>
          </button>
          <button
            className={`tab-switch-btn ${sidebarTab === "outline" ? "active" : ""}`}
            onClick={() => setSidebarTab("outline")}
            title="View presentation outline tree"
          >
            <ListTree size={13} />
            <span>OUTLINE</span>
          </button>
        </div>
        {onToggleSidebar && (
          <button
            className="sidebar-collapse-btn"
            onClick={onToggleSidebar}
            title="Hide Left Slides Panel"
          >
            <ChevronLeft size={15} />
          </button>
        )}
      </div>

      {sidebarTab === "outline" ? (
        <OutlineView
          slides={slides}
          activeSlideIndex={activeSlideIndex}
          onSelectSlide={onSelectSlide}
        />
      ) : (
        /* THUMBNAIL LIST */
        <div className="thumbnails-scroll-list">
        {slides.map((slide, idx) => {
          const isActive = idx === activeSlideIndex;
          const bgStyle = slide.background_theme === "custom"
            ? `linear-gradient(135deg, ${slide.bg_gradient_start || "#0f172a"} 0%, ${slide.bg_gradient_end || "#1e1b4b"} 100%)`
            : slide.bg_color || "#0f172a";

          return (
            <div
              key={slide.id || `slide-${idx}`}
              className={`slide-thumbnail-card ${isActive ? "active" : ""}`}
              onClick={() => onSelectSlide(idx)}
            >
              {/* SLIDE NUMBER */}
              <div className="slide-number-badge">{idx + 1}</div>

              {/* MINIATURE PREVIEW CANVAS */}
              <div 
                className="miniature-canvas"
                style={{ background: bgStyle }}
              >
                <div className="mini-title-bar" style={{ color: slide.text_color || "#ffffff" }}>
                  {slide.title || `Slide ${idx + 1}`}
                </div>
                {slide.subtitle && (
                  <div className="mini-sub-bar" style={{ color: slide.accent_color || "#c084fc" }}>
                    {slide.subtitle}
                  </div>
                )}
                <div className="mini-elements-layout">
                  {slide.elements && slide.elements.map((el, elIdx) => (
                    <div 
                      key={el.id || elIdx}
                      className={`mini-el-box mini-type-${el.type}`}
                      style={{
                        left: `${el.x || 10}%`,
                        top: `${el.y || 20}%`,
                        width: `${el.width || 30}%`,
                        height: `${Math.min(el.height || 20, 40)}%`,
                        borderColor: slide.accent_color || "#c084fc"
                      }}
                    />
                  ))}
                </div>
              </div>

              {/* HOVER ACTIONS OVERLAY */}
              <div className="thumbnail-actions-bar" onClick={(e) => e.stopPropagation()}>
                <button 
                  className="thumb-action-btn"
                  onClick={() => onMoveSlide(idx, -1)}
                  disabled={idx === 0}
                  title="Move Up"
                >
                  <ChevronUp size={13} />
                </button>
                <button 
                  className="thumb-action-btn"
                  onClick={() => onMoveSlide(idx, 1)}
                  disabled={idx === slides.length - 1}
                  title="Move Down"
                >
                  <ChevronDown size={13} />
                </button>
                <button 
                  className="thumb-action-btn"
                  onClick={() => onDuplicateSlide(idx)}
                  title="Duplicate Slide"
                >
                  <Copy size={13} />
                </button>
                <button 
                  className="thumb-action-btn danger"
                  onClick={() => onDeleteSlide(idx)}
                  disabled={slides.length <= 1}
                  title="Delete Slide"
                >
                  <Trash2 size={13} />
                </button>
              </div>
            </div>
          );
        })}
      </div>
      )}

      {/* BOTTOM ADD SLIDE BUTTON */}
      <div className="sidebar-footer">
        <button
          className="add-slide-btn"
          onClick={() => setIsLayoutPickerOpen(true)}
        >
          <Plus size={16} />
          <span>Add Slide</span>
        </button>
      </div>

      {/* LAYOUT PICKER POPUP */}
      <SlideLayoutPicker
        isOpen={isLayoutPickerOpen}
        onClose={() => setIsLayoutPickerOpen(false)}
        onSelectLayout={(layoutId) => onAddSlide(layoutId)}
        onAiAction={(actionId) => onAiAction?.(actionId)}
      />
    </aside>
  );
}
