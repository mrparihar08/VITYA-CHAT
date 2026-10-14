import React, { useState, useEffect, useRef, useCallback } from "react";
import { createPortal } from "react-dom";
import {
  ChevronLeft,
  ChevronRight,
  X,
  Maximize2,
  Minimize2,
  Play,
  Pause,
  FileText,
  Sparkles,
  Layers,
  Sliders,
} from "lucide-react";
import CanvasElement from "./CanvasElement";
import SlideBackdropDecorations from "./SlideBackdropDecorations";
import "./PresentModalTransitions.css";

const TRANSITIONS = [
  { id: "slide", label: "Slide Horizontal" },
  { id: "fade", label: "Cross Fade" },
  { id: "zoom", label: "3D Zoom" },
  { id: "flip", label: "3D Flip" },
];

export default function PresentModal({
  slides = [],
  initialSlideIndex = 0,
  isOpen,
  onClose,
}) {
  const [currentIndex, setCurrentIndex] = useState(initialSlideIndex);
  const [transitionType, setTransitionType] = useState("slide"); // 'slide' | 'fade' | 'zoom' | 'flip'
  const [transitionDirection, setTransitionDirection] = useState("next"); // 'next' | 'prev'
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showNotes, setShowNotes] = useState(false);
  const [notesFontSize, setNotesFontSize] = useState(14);
  const [isLaserPointer, setIsLaserPointer] = useState(false);
  const [laserPos, setLaserPos] = useState({ x: -100, y: -100 });
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const [autoAdvance, setAutoAdvance] = useState(false);
  const [showThumbnails, setShowThumbnails] = useState(false);
  const [isBlackout, setIsBlackout] = useState(false);

  const audioRef = useRef(null);
  const containerRef = useRef(null);

  useEffect(() => {
    setCurrentIndex(initialSlideIndex);
  }, [initialSlideIndex, isOpen]);

  // Handle Fullscreen state change
  useEffect(() => {
    const handleFsChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };
    document.addEventListener("fullscreenchange", handleFsChange);
    return () => document.removeEventListener("fullscreenchange", handleFsChange);
  }, []);

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(() => {});
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen().catch(() => {});
      }
    }
  };

  const goToNextSlide = useCallback(() => {
    if (currentIndex < slides.length - 1) {
      setTransitionDirection("next");
      setCurrentIndex((prev) => prev + 1);
    }
  }, [currentIndex, slides.length]);

  const goToPrevSlide = useCallback(() => {
    if (currentIndex > 0) {
      setTransitionDirection("prev");
      setCurrentIndex((prev) => prev - 1);
    }
  }, [currentIndex]);

  // Audio Voiceover Handling
  const currentSlide = slides[currentIndex] || slides[0] || {};
  const audioUrl = currentSlide.voiceover_audio_url || currentSlide.audio_url || null;

  useEffect(() => {
    setIsPlayingAudio(false);
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }
  }, [currentIndex]);

  const toggleAudio = () => {
    if (!audioRef.current) return;
    if (isPlayingAudio) {
      audioRef.current.pause();
      setIsPlayingAudio(false);
    } else {
      audioRef.current
        .play()
        .then(() => setIsPlayingAudio(true))
        .catch((err) => console.log("Audio play blocked", err));
    }
  };

  const handleAudioEnded = () => {
    setIsPlayingAudio(false);
    if (autoAdvance && currentIndex < slides.length - 1) {
      setTimeout(() => {
        goToNextSlide();
      }, 600);
    }
  };

  // Keyboard Shortcuts for Presenter
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e) => {
      if (e.key === "ArrowRight" || e.key === "Space" || e.key === "PageDown") {
        e.preventDefault();
        goToNextSlide();
      } else if (e.key === "ArrowLeft" || e.key === "PageUp") {
        e.preventDefault();
        goToPrevSlide();
      } else if (e.key.toLowerCase() === "f") {
        e.preventDefault();
        toggleFullscreen();
      } else if (e.key.toLowerCase() === "n") {
        e.preventDefault();
        setShowNotes((prev) => !prev);
      } else if (e.key.toLowerCase() === "l") {
        e.preventDefault();
        setIsLaserPointer((prev) => !prev);
      } else if (e.key.toLowerCase() === "b") {
        e.preventDefault();
        setIsBlackout((prev) => !prev);
      } else if (e.key === "Escape") {
        if (showNotes) {
          setShowNotes(false);
        } else if (showThumbnails) {
          setShowThumbnails(false);
        } else {
          onClose();
        }
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, goToNextSlide, goToPrevSlide, showNotes, showThumbnails, onClose]);

  // Laser Pointer Track
  const handleMouseMove = (e) => {
    if (isLaserPointer) {
      setLaserPos({ x: e.clientX, y: e.clientY });
    }
  };

  if (!isOpen || !slides.length) return null;

  const bgStyle =
    currentSlide.background_theme === "custom"
      ? `linear-gradient(135deg, ${currentSlide.bg_gradient_start || "#0f172a"} 0%, ${
          currentSlide.bg_gradient_end || "#1e1b4b"
        } 100%)`
      : currentSlide.bg_color || "#0f172a";

  const speakerNotes =
    currentSlide.notes ||
    currentSlide.speaker_notes ||
    (currentSlide.elements || [])
      .filter((el) => el.type === "text" || el.type === "paragraph")
      .map((el) => el.content)
      .join(" ") ||
    "No presenter notes provided for this slide.";

  const modalJSX = (
    <div
      ref={containerRef}
      className={`reveal-present-overlay ${isBlackout ? "blackout" : ""}`}
      onMouseMove={handleMouseMove}
    >
      {/* Laser Pointer Glow Dot */}
      {isLaserPointer && (
        <div
          className="reveal-laser-dot"
          style={{ left: `${laserPos.x}px`, top: `${laserPos.y}px` }}
        />
      )}

      {/* ================= TOP FLOATING CONTROL BAR ================= */}
      <header className="reveal-control-bar">
        <div className="reveal-control-left">
          <span className="reveal-brand-pill">
            <Sparkles size={13} color="#c084fc" />
            Vitya Reveal.js Presentation
          </span>
          <span className="reveal-counter">
            Slide <strong>{currentIndex + 1}</strong> of {slides.length}
          </span>
        </div>

        {/* Transition Selector */}
        <div className="reveal-transition-group">
          <Sliders size={13} color="#94a3b8" />
          <select
            className="reveal-transition-select"
            value={transitionType}
            onChange={(e) => setTransitionType(e.target.value)}
          >
            {TRANSITIONS.map((t) => (
              <option key={t.id} value={t.id}>
                {t.label}
              </option>
            ))}
          </select>
        </div>

        {/* Navigation & Media Controls */}
        <div className="reveal-control-actions">
          {audioUrl && (
            <button
              className={`reveal-btn ${isPlayingAudio ? "active" : ""}`}
              onClick={toggleAudio}
              title={isPlayingAudio ? "Pause Slide Audio" : "Play Slide Audio Narration"}
            >
              {isPlayingAudio ? <Pause size={15} /> : <Play size={15} />}
              <span className="hideOnMobile">
                {isPlayingAudio ? "Pause Audio" : "Play Voiceover"}
              </span>
            </button>
          )}

          {audioUrl && (
            <label className="reveal-toggle-label" title="Automatically advance when audio finishes">
              <input
                type="checkbox"
                checked={autoAdvance}
                onChange={(e) => setAutoAdvance(e.target.checked)}
              />
              <span>Auto-advance</span>
            </label>
          )}

          <button
            className={`reveal-btn ${showNotes ? "active" : ""}`}
            onClick={() => setShowNotes(!showNotes)}
            title="Toggle Speaker Notes Drawer (N)"
          >
            <FileText size={15} />
            <span className="hideOnMobile">Speaker Notes</span>
          </button>

          <button
            className={`reveal-btn ${showThumbnails ? "active" : ""}`}
            onClick={() => setShowThumbnails(!showThumbnails)}
            title="Toggle Slide Grid Overview"
          >
            <Layers size={15} />
          </button>

          <button
            className={`reveal-btn ${isLaserPointer ? "active-laser" : ""}`}
            onClick={() => setIsLaserPointer(!isLaserPointer)}
            title="Toggle Laser Pointer Mode (L)"
          >
            <span className="laser-dot-icon" />
            <span className="hideOnMobile">Laser</span>
          </button>

          <button
            className="reveal-btn"
            onClick={toggleFullscreen}
            title="Toggle Fullscreen (F)"
          >
            {isFullscreen ? <Minimize2 size={15} /> : <Maximize2 size={15} />}
          </button>

          <button className="reveal-exit-btn" onClick={onClose} title="Exit Slideshow (Esc)">
            <X size={16} />
            <span>Exit</span>
          </button>
        </div>
      </header>

      {/* Hidden Audio Player for Slide Narration */}
      {audioUrl && (
        <audio
          ref={audioRef}
          src={audioUrl}
          onEnded={handleAudioEnded}
          onError={() => setIsPlayingAudio(false)}
        />
      )}

      {/* ================= MAIN SLIDE VIEWPORT ================= */}
      <main className="reveal-slide-viewport">
        {/* Previous Slide Arrow */}
        <button
          className="reveal-arrow-nav left"
          onClick={goToPrevSlide}
          disabled={currentIndex === 0}
          title="Previous Slide (Left Arrow)"
        >
          <ChevronLeft size={28} />
        </button>

        {/* Animated Presentation Slide Canvas */}
        <div
          key={`${currentIndex}-${transitionType}`}
          className={`reveal-slide-canvas 16-9-aspect anim-${transitionType}-${transitionDirection}`}
          style={{ background: bgStyle }}
        >
          <SlideBackdropDecorations
            slide={currentSlide}
            slideIndex={currentIndex}
            totalSlides={slides.length}
            templateName={currentSlide.template || "base_template"}
          />
          <div className="reveal-elements-layer">
            {currentSlide.elements &&
              currentSlide.elements.map((el) => (
                <CanvasElement
                  key={el.id}
                  element={el}
                  isSelected={false}
                  onSelect={() => {}}
                />
              ))}
          </div>
        </div>

        {/* Next Slide Arrow */}
        <button
          className="reveal-arrow-nav right"
          onClick={goToNextSlide}
          disabled={currentIndex === slides.length - 1}
          title="Next Slide (Right Arrow / Space)"
        >
          <ChevronRight size={28} />
        </button>
      </main>

      {/* ================= COLLAPSIBLE SPEAKER NOTES DRAWER ================= */}
      {showNotes && (
        <aside className="reveal-notes-drawer">
          <div className="reveal-notes-header">
            <div className="reveal-notes-title">
              <FileText size={15} color="#c084fc" />
              <span>
                Presenter Teleprompter & Notes — Slide {currentIndex + 1}
              </span>
            </div>

            <div className="reveal-notes-controls">
              <button
                className="reveal-notes-font-btn"
                onClick={() => setNotesFontSize((p) => Math.max(11, p - 1))}
                title="Decrease Font Size"
              >
                A-
              </button>
              <button
                className="reveal-notes-font-btn"
                onClick={() => setNotesFontSize((p) => Math.min(24, p + 1))}
                title="Increase Font Size"
              >
                A+
              </button>
              <button
                className="reveal-notes-close"
                onClick={() => setShowNotes(false)}
              >
                ✕
              </button>
            </div>
          </div>

          <div
            className="reveal-notes-content"
            style={{ fontSize: `${notesFontSize}px` }}
          >
            {speakerNotes}
          </div>
        </aside>
      )}

      {/* ================= SLIDE THUMBNAILS GRID DRAWER ================= */}
      {showThumbnails && (
        <aside className="reveal-thumbnails-drawer">
          <div className="reveal-thumbnails-header">
            <span>Jump to Slide ({slides.length} total)</span>
            <button
              onClick={() => setShowThumbnails(false)}
              style={{ background: "transparent", border: "none", color: "#94a3b8", cursor: "pointer" }}
            >
              ✕
            </button>
          </div>
          <div className="reveal-thumbnails-strip">
            {slides.map((s, idx) => (
              <div
                key={s.id || idx}
                className={`reveal-thumbnail-item ${idx === currentIndex ? "active" : ""}`}
                onClick={() => {
                  setCurrentIndex(idx);
                  setShowThumbnails(false);
                }}
              >
                <div className="reveal-thumb-preview" style={{ background: s.bg_color || "#0f172a" }}>
                  <span>{idx + 1}</span>
                </div>
                <div className="reveal-thumb-title">
                  {s.title || (s.elements?.[0]?.content) || `Slide ${idx + 1}`}
                </div>
              </div>
            ))}
          </div>
        </aside>
      )}

      {/* Bottom Progress Bar */}
      <footer className="reveal-progress-bar">
        <div
          className="reveal-progress-fill"
          style={{ width: `${((currentIndex + 1) / slides.length) * 100}%` }}
        />
      </footer>
    </div>
  );

  return typeof document !== "undefined" ? createPortal(modalJSX, document.body) : modalJSX;
}
