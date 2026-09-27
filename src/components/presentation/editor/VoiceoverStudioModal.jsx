import React, { useState } from "react";
import { X, Mic, Play, Pause, Sparkles, Download } from "lucide-react";
import { synthesizeVoiceover } from "../../../services/api";

export default function VoiceoverStudioModal({ isOpen, onClose, slide, slideIndex = 0, onToast }) {
  const [text, setText] = useState(() => {
    if (!slide) return "";
    return slide.notes || slide.subtitle || slide.title || "Welcome to this presentation slide.";
  });
  const [language, setLanguage] = useState("en-US");
  const [voice, setVoice] = useState("en-US-JennyNeural");
  const [isSynthesizing, setIsSynthesizing] = useState(false);
  const [audioUrl, setAudioUrl] = useState("");
  const [isPlaying, setIsPlaying] = useState(false);
  const [audioElem, setAudioElem] = useState(null);

  if (!isOpen) return null;

  const handleSynthesize = async () => {
    if (!text.trim()) {
      onToast?.({ type: "error", title: "Empty Text", message: "Please enter or select slide text for voiceover narration." });
      return;
    }

    setIsSynthesizing(true);
    try {
      const data = await synthesizeVoiceover({ text: text.trim(), language, voice, slide_index: slideIndex });
      if (data && data.audio_url) {
        setAudioUrl(data.audio_url);
        onToast?.({ type: "success", title: "Voiceover Synthesized", message: "Audio narration generated successfully!" });
      } else {
        throw new Error(data?.detail || "Audio URL not returned by server");
      }
    } catch (err) {
      console.warn("Synthesize failed", err);
      onToast?.({ type: "error", title: "Synthesis Error", message: err.message || "Failed to generate neural voiceover audio." });
    } finally {
      setIsSynthesizing(false);
    }
  };

  const togglePlay = () => {
    if (!audioUrl) return;

    if (audioElem) {
      if (isPlaying) {
        audioElem.pause();
        setIsPlaying(false);
      } else {
        audioElem.play();
        setIsPlaying(true);
      }
    } else {
      const newAudio = new Audio(audioUrl);
      newAudio.onended = () => setIsPlaying(false);
      newAudio.play();
      setAudioElem(newAudio);
      setIsPlaying(true);
    }
  };

  return (
    <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        zIndex: 9990,
        background: "rgba(9, 13, 26, 0.85)",
        backdropFilter: "blur(12px)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "20px",
      }}
      onClick={onClose}
    >
      <div
        style={{
          width: "100%",
          maxWidth: "600px",
          background: "#0f172a",
          border: "1px solid rgba(192, 132, 252, 0.3)",
          borderRadius: "20px",
          boxShadow: "0 25px 60px rgba(0,0,0,0.7), 0 0 30px rgba(139, 92, 246, 0.2)",
          display: "flex",
          flexDirection: "column",
          overflow: "hidden",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* HEADER */}
        <div
          style={{
            padding: "16px 22px",
            borderBottom: "1px solid rgba(255,255,255,0.08)",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            background: "rgba(255,255,255,0.02)",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <Mic size={20} style={{ color: "#c084fc" }} />
            <div>
              <h2 style={{ margin: 0, fontSize: "16px", fontWeight: 800, color: "#ffffff" }}>
                AI Slide Voiceover Studio
              </h2>
              <p style={{ margin: "2px 0 0", fontSize: "11px", color: "#94a3b8" }}>
                Synthesize neural voice narration MP3 for Slide #{slideIndex + 1}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            style={{ background: "none", border: "none", color: "#94a3b8", cursor: "pointer", padding: "6px" }}
          >
            <X size={18} />
          </button>
        </div>

        {/* BODY */}
        <div style={{ padding: "20px 22px" }}>
          {/* SCRIPT TEXTAREA */}
          <div style={{ marginBottom: "14px" }}>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
              <label style={{ fontSize: "12px", fontWeight: 700, color: "#c084fc" }}>
                Narration Script
              </label>
              <button
                onClick={() => {
                  if (slide?.notes) setText(slide.notes);
                  else if (slide?.subtitle) setText(`${slide.title}. ${slide.subtitle}`);
                }}
                style={{
                  background: "none",
                  border: "none",
                  color: "#38bdf8",
                  fontSize: "11px",
                  cursor: "pointer",
                  fontWeight: 600,
                }}
              >
                Use Slide Notes
              </button>
            </div>
            <textarea
              value={text}
              onChange={(e) => setText(e.target.value)}
              rows={4}
              placeholder="Enter text to speak for this slide..."
              style={{
                width: "100%",
                padding: "10px 12px",
                borderRadius: "10px",
                background: "rgba(0,0,0,0.4)",
                border: "1px solid rgba(255,255,255,0.12)",
                color: "#ffffff",
                fontSize: "13px",
                lineHeight: "1.5",
                outline: "none",
              }}
            />
          </div>

          {/* LANGUAGE & VOICE SELECTION */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px", marginBottom: "18px" }}>
            <div>
              <label style={{ fontSize: "11px", fontWeight: 700, color: "#94a3b8", display: "block", marginBottom: 4 }}>
                Accent & Language
              </label>
              <select
                value={language}
                onChange={(e) => setLanguage(e.target.value)}
                style={{
                  width: "100%",
                  padding: "8px 10px",
                  borderRadius: "8px",
                  background: "rgba(0,0,0,0.4)",
                  border: "1px solid rgba(255,255,255,0.12)",
                  color: "#ffffff",
                  fontSize: "12px",
                }}
              >
                <option value="en-US">English (US)</option>
                <option value="en-GB">English (UK)</option>
                <option value="hi-IN">Hindi / Indian English</option>
                <option value="es-ES">Spanish</option>
                <option value="fr-FR">French</option>
              </select>
            </div>

            <div>
              <label style={{ fontSize: "11px", fontWeight: 700, color: "#94a3b8", display: "block", marginBottom: 4 }}>
                Neural Voice Persona
              </label>
              <select
                value={voice}
                onChange={(e) => setVoice(e.target.value)}
                style={{
                  width: "100%",
                  padding: "8px 10px",
                  borderRadius: "8px",
                  background: "rgba(0,0,0,0.4)",
                  border: "1px solid rgba(255,255,255,0.12)",
                  color: "#ffffff",
                  fontSize: "12px",
                }}
              >
                <option value="en-US-JennyNeural">Jenny (Female - Professional)</option>
                <option value="en-US-GuyNeural">Guy (Male - Executive)</option>
                <option value="en-US-AriaNeural">Aria (Female - Clear & Expressive)</option>
                <option value="en-US-ChristopherNeural">Christopher (Male - Deep Pitch)</option>
              </select>
            </div>
          </div>

          {/* SYNTHESIZE BUTTON */}
          <button
            onClick={handleSynthesize}
            disabled={isSynthesizing}
            style={{
              width: "100%",
              padding: "12px",
              borderRadius: "12px",
              background: "linear-gradient(135deg, #8b5cf6 0%, #6366f1 100%)",
              border: "none",
              color: "#ffffff",
              fontSize: "13px",
              fontWeight: 800,
              cursor: isSynthesizing ? "not-allowed" : "pointer",
              boxShadow: "0 4px 15px rgba(139, 92, 246, 0.4)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "8px",
              marginBottom: "16px",
            }}
          >
            {isSynthesizing ? (
              <>
                <span className="spinner-sm" /> Synthesizing Neural Audio...
              </>
            ) : (
              <>
                <Sparkles size={16} /> Synthesize Neural Voiceover
              </>
            )}
          </button>

          {/* AUDIO PLAYER & DOWNLOAD LINK */}
          {audioUrl && (
            <div
              style={{
                background: "rgba(34, 197, 94, 0.12)",
                border: "1px solid rgba(34, 197, 94, 0.3)",
                borderRadius: "12px",
                padding: "12px 16px",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                <button
                  onClick={togglePlay}
                  style={{
                    width: "36px",
                    height: "36px",
                    borderRadius: "50%",
                    background: "#22c55e",
                    border: "none",
                    color: "#ffffff",
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  {isPlaying ? <Pause size={16} /> : <Play size={16} style={{ marginLeft: 2 }} />}
                </button>
                <div>
                  <div style={{ fontSize: "12px", fontWeight: 700, color: "#86efac" }}>
                    Audio Narration Ready
                  </div>
                  <div style={{ fontSize: "11px", color: "rgba(255,255,255,0.7)" }}>
                    {isPlaying ? "Playing..." : "Click play to listen"}
                  </div>
                </div>
              </div>

              <a
                href={audioUrl}
                target="_blank"
                rel="noreferrer"
                download={`slide_${slideIndex + 1}_voiceover.mp3`}
                style={{
                  color: "#86efac",
                  fontSize: "12px",
                  fontWeight: 700,
                  display: "flex",
                  alignItems: "center",
                  gap: "4px",
                  textDecoration: "none",
                }}
              >
                <Download size={14} /> MP3
              </a>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
