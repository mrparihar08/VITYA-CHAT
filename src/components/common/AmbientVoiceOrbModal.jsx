import React, { useState, useEffect, useRef } from "react";
import {
  Mic,
  MicOff,
  X,
  Sparkles,
  MessageSquare,
  Radio,
} from "lucide-react";
import { sendChatMessage } from "../../services/api";
import "./AmbientVoiceOrbModal.css";

export default function AmbientVoiceOrbModal({ isOpen, onClose, onNavigateToChat }) {
  const [voiceState, setVoiceState] = useState("IDLE"); // 'IDLE' | 'LISTENING' | 'THINKING' | 'SPEAKING'
  const [transcript, setTranscript] = useState("");
  const [aiReply, setAiReply] = useState("");
  const [isMuted, setIsMuted] = useState(false);
  const [audioLevel, setAudioLevel] = useState(20);

  const recognitionRef = useRef(null);
  const synthRef = useRef(null);
  const isComponentMounted = useRef(true);

  const voiceStateRef = useRef(voiceState);
  voiceStateRef.current = voiceState;

  const processVoicePromptRef = useRef(null);

  // Initialize Web Speech Recognition
  useEffect(() => {
    isComponentMounted.current = true;
    synthRef.current = typeof window !== "undefined" ? window.speechSynthesis : null;

    const SpeechRecognition =
      typeof window !== "undefined" &&
      (window.SpeechRecognition || window.webkitSpeechRecognition);

    if (SpeechRecognition) {
      const recognition = new SpeechRecognition();
      recognition.continuous = true;
      recognition.interimResults = true;
      recognition.lang = "en-US";

      recognition.onstart = () => {
        if (isComponentMounted.current) {
          setVoiceState("LISTENING");
        }
      };

      recognition.onresult = (event) => {
        let currentTranscript = "";
        for (let i = event.resultIndex; i < event.results.length; i++) {
          currentTranscript += event.results[i][0].transcript;
        }

        if (isComponentMounted.current) {
          setTranscript(currentTranscript);
          setAudioLevel(Math.min(95, 30 + currentTranscript.length * 2));
        }

        // Detect pause or end of utterance
        const lastResult = event.results[event.results.length - 1];
        if (lastResult.isFinal) {
          const finalPrompt = currentTranscript.trim();
          if (finalPrompt.length > 2 && processVoicePromptRef.current) {
            processVoicePromptRef.current(finalPrompt);
          }
        }
      };

      recognition.onerror = (e) => {
        console.warn("[AmbientVoice] Speech recognition error:", e.error);
        if (isComponentMounted.current && e.error !== "no-speech") {
          setVoiceState("IDLE");
        }
      };

      recognition.onend = () => {
        if (isComponentMounted.current && isOpen && voiceStateRef.current === "LISTENING") {
          try {
            recognition.start();
          } catch {
            // Already active
          }
        }
      };

      recognitionRef.current = recognition;
    }

    return () => {
      isComponentMounted.current = false;
      if (recognitionRef.current) {
        try {
          recognitionRef.current.stop();
        } catch {}
      }
      if (synthRef.current) {
        try {
          synthRef.current.cancel();
        } catch {}
      }
    };
  }, [isOpen]);

  // Start listening when modal opens
  useEffect(() => {
    if (isOpen && !isMuted && recognitionRef.current) {
      setTranscript("");
      setAiReply("I'm listening. Ask me anything, or speak naturally...");
      try {
        recognitionRef.current.start();
      } catch {
        // Already active
      }
    } else if (!isOpen) {
      if (recognitionRef.current) {
        try {
          recognitionRef.current.stop();
        } catch {}
      }
      if (synthRef.current) {
        try {
          synthRef.current.cancel();
        } catch {}
      }
      setVoiceState("IDLE");
    }
  }, [isOpen, isMuted]);

  // Simulate audio level dynamics
  useEffect(() => {
    if (!isOpen) return;
    const interval = setInterval(() => {
      if (voiceState === "LISTENING") {
        setAudioLevel((prev) => (prev > 40 ? prev - 5 : 25 + Math.random() * 20));
      } else if (voiceState === "SPEAKING") {
        setAudioLevel(45 + Math.random() * 50);
      } else {
        setAudioLevel(15 + Math.random() * 10);
      }
    }, 120);

    return () => clearInterval(interval);
  }, [isOpen, voiceState]);

  // Process voice input and speak back answer
  const handleProcessVoicePrompt = async (prompt) => {
    if (!prompt.trim() || voiceState === "THINKING") return;

    if (recognitionRef.current) {
      try {
        recognitionRef.current.stop();
      } catch {}
    }

    setVoiceState("THINKING");

    try {
      const response = await sendChatMessage(prompt);
      const answerText =
        response?.content ||
        response?.reply ||
        response?.text ||
        (typeof response === "string" ? response : "I processed that for you.");

      // Clean markdown tags for spoken audio
      const cleanSpokenText = answerText
        .replace(/[*#`_[\]()]/g, "")
        .replace(/https?:\/\/\S+/g, "")
        .slice(0, 320);

      setAiReply(answerText);
      setVoiceState("SPEAKING");

      // Speak response aloud
      if (synthRef.current && !isMuted) {
        synthRef.current.cancel();
        const utterance = new SpeechSynthesisUtterance(cleanSpokenText);
        utterance.rate = 1.05;
        utterance.pitch = 1.0;

        utterance.onend = () => {
          if (isComponentMounted.current && isOpen) {
            setVoiceState("LISTENING");
            setTranscript("");
            if (recognitionRef.current) {
              try {
                recognitionRef.current.start();
              } catch {}
            }
          }
        };

        utterance.onerror = () => {
          if (isComponentMounted.current && isOpen) {
            setVoiceState("LISTENING");
          }
        };

        synthRef.current.speak(utterance);
      } else {
        setTimeout(() => {
          if (isComponentMounted.current && isOpen) {
            setVoiceState("LISTENING");
          }
        }, 3000);
      }
    } catch (err) {
      console.error("[AmbientVoice] Processing error:", err);
      setAiReply("Sorry, I ran into an issue connecting to the neural core.");
      setVoiceState("LISTENING");
    }
  };
  processVoicePromptRef.current = handleProcessVoicePrompt;

  const toggleMute = () => {
    if (isMuted) {
      setIsMuted(false);
      try {
        recognitionRef.current?.start();
      } catch {}
    } else {
      setIsMuted(true);
      try {
        recognitionRef.current?.stop();
        synthRef.current?.cancel();
      } catch {}
      setVoiceState("IDLE");
    }
  };

  if (!isOpen) return null;

  return (
    <div className="vAmbientVoiceOverlay" onClick={onClose}>
      <div className="vAmbientVoiceModal" onClick={(e) => e.stopPropagation()}>
        {/* Top Header Bar */}
        <div className="vAmbientHeader">
          <div className="vAmbientBrand">
            <Radio size={16} className="vAmbientPulseIcon" />
            <span>MOTHER AMBIENT ASSISTANT</span>
            <span className={`vAmbientStateTag ${voiceState.toLowerCase()}`}>
              {voiceState}
            </span>
          </div>

          <div className="vAmbientControls">
            <button
              className={`vAmbientBtn ${isMuted ? "muted" : ""}`}
              onClick={toggleMute}
              title={isMuted ? "Unmute Mic" : "Mute Mic"}
            >
              {isMuted ? <MicOff size={18} /> : <Mic size={18} />}
            </button>
            <button
              className="vAmbientBtn"
              onClick={() => {
                onClose();
                onNavigateToChat?.();
              }}
              title="Switch to Text Chat"
            >
              <MessageSquare size={18} />
            </button>
            <button className="vAmbientBtn close" onClick={onClose} title="Exit Ambient Mode">
              <X size={20} />
            </button>
          </div>
        </div>

        {/* Central 3D Animated Visualizer Orb */}
        <div className="vAmbientOrbContainer">
          <div
            className={`vAmbientGlowRing outer ${voiceState.toLowerCase()}`}
            style={{ transform: `scale(${1 + audioLevel / 120})` }}
          />
          <div
            className={`vAmbientGlowRing inner ${voiceState.toLowerCase()}`}
            style={{ transform: `scale(${1 + audioLevel / 180})` }}
          />
          <div className={`vAmbientOrb ${voiceState.toLowerCase()}`}>
            <div className="vAmbientOrbCore" />
            <div className="vAmbientOrbHighlight" />
          </div>

          <div className="vAmbientSoundwaves">
            {[...Array(12)].map((_, idx) => (
              <span
                key={idx}
                className="vAmbientSoundBar"
                style={{
                  height: `${Math.max(8, (audioLevel * (1 + (idx % 3) * 0.4)) / 2.5)}px`,
                  animationDelay: `${idx * 0.08}s`,
                }}
              />
            ))}
          </div>
        </div>

        {/* Live Conversation Cards */}
        <div className="vAmbientConversationWrap">
          {transcript && (
            <div className="vAmbientUserSpeechBox">
              <span className="vAmbientSpeechLabel">YOU SAID</span>
              <p className="vAmbientSpeechText">"{transcript}"</p>
            </div>
          )}

          <div className="vAmbientAiReplyBox">
            <div className="vAmbientAiHeader">
              <Sparkles size={14} color="#a855f7" />
              <span>MOTHER INTELLIGENCE</span>
            </div>
            <p className="vAmbientAiText">{aiReply}</p>
          </div>
        </div>

        {/* Quick Voice Suggestions */}
        <div className="vAmbientPromptSuggestions">
          <span>Try saying:</span>
          <button
            onClick={() => handleProcessVoicePrompt("Give me a morning briefing and review my schedule for today")}
          >
            "Brief my day and schedule"
          </button>
          <button
            onClick={() => handleProcessVoicePrompt("Log an expense of 35 dollars for team coffee")}
          >
            "Log 35 dollar expense for coffee"
          </button>
          <button
            onClick={() => handleProcessVoicePrompt("Schedule review meeting tomorrow at 3 PM and note agenda in my notes")}
          >
            "Schedule meeting tomorrow at 3 PM"
          </button>
        </div>
      </div>
    </div>
  );
}
