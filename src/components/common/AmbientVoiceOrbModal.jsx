import React, { useState, useEffect, useRef } from "react";
import {
  Mic,
  MicOff,
  X,
  Sparkles,
  MessageSquare,
  Radio,
  Globe,
} from "lucide-react";
import { sendChatMessage, synthesizeVoiceover, resolveAssetUrl } from "../../services/api";
import "./AmbientVoiceOrbModal.css";

// Helper: Detect if text contains Hindi or Devanagari script
const isHindiText = (text) => {
  if (!text) return false;
  if (/[\u0900-\u097F]/.test(text)) return true;
  return /\b(namaste|kaise|kya|hai|hain|haan|nahi|nahin|shukriya|madad|karo|batao|aap|kaun|theek|karna|hoga|hogi|chahiye)\b/i.test(text);
};

// Helper: Select the best Hindi or high-quality natural English voice
const selectBestVoice = (voices, targetLang = "en") => {
  if (!voices || voices.length === 0) return null;

  if (targetLang.startsWith("hi")) {
    const hindiVoices = voices.filter(
      (v) => (v.lang && v.lang.toLowerCase().startsWith("hi")) || (v.name && /hindi|हिन्दी/i.test(v.name))
    );
    if (hindiVoices.length > 0) {
      // Prioritize natural neural/google Hindi voices
      const naturalHindi = hindiVoices.find((v) => /natural|swara|hemant|google|neural/i.test(v.name));
      return naturalHindi || hindiVoices[0];
    }
    // Fallback to Indian English voice if device lacks Hindi voice pack
    const indianEn = voices.find((v) => v.lang && /en[-_]in/i.test(v.lang));
    if (indianEn) return indianEn;
  }

  // English: Prioritize Natural / Neural / High-Fidelity voices
  const enVoices = voices.filter((v) => v.lang && v.lang.toLowerCase().startsWith("en"));
  if (enVoices.length > 0) {
    // 1. Natural / Online Neural voices (Microsoft Jenny, Aria, Guy, etc.)
    const naturalEn = enVoices.find((v) => /natural|online|neural/i.test(v.name));
    if (naturalEn) return naturalEn;

    // 2. Google High Quality US / UK voices
    const googleEn = enVoices.find((v) => /google/i.test(v.name) && /us|uk|united states/i.test(v.name));
    if (googleEn) return googleEn;

    // 3. Apple premium voices
    const appleEn = enVoices.find((v) => /samantha|karen|daniel|victoria/i.test(v.name));
    if (appleEn) return appleEn;

    // 4. Any en-US voice
    const usEn = enVoices.find((v) => /en[-_]us/i.test(v.lang));
    if (usEn) return usEn;

    return enVoices[0];
  }

  return voices[0] || null;
};

export default function AmbientVoiceOrbModal({ isOpen, onClose, onNavigateToChat }) {
  const [voiceState, setVoiceState] = useState("IDLE"); // 'IDLE' | 'LISTENING' | 'THINKING' | 'SPEAKING'
  const [transcript, setTranscript] = useState("");
  const [aiReply, setAiReply] = useState("");
  const [isMuted, setIsMuted] = useState(false);
  const [audioLevel, setAudioLevel] = useState(20);
  const [langMode, setLangMode] = useState("auto"); // 'auto' | 'hi' | 'en'
  const [availableVoices, setAvailableVoices] = useState([]);

  const recognitionRef = useRef(null);
  const synthRef = useRef(null);
  const audioRef = useRef(null);
  const isComponentMounted = useRef(true);

  const voiceStateRef = useRef(voiceState);
  voiceStateRef.current = voiceState;

  const processVoicePromptRef = useRef(null);

  // Load and cache browser voices
  useEffect(() => {
    if (typeof window === "undefined" || !window.speechSynthesis) return;

    const loadVoices = () => {
      const voices = window.speechSynthesis.getVoices() || [];
      if (voices.length > 0) {
        setAvailableVoices(voices);
      }
    };

    loadVoices();
    window.speechSynthesis.onvoiceschanged = loadVoices;

    return () => {
      if (typeof window !== "undefined" && window.speechSynthesis) {
        window.speechSynthesis.onvoiceschanged = null;
      }
    };
  }, []);

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

  // Sync SpeechRecognition language with langMode
  useEffect(() => {
    if (recognitionRef.current) {
      if (langMode === "hi") {
        recognitionRef.current.lang = "hi-IN";
      } else if (langMode === "en") {
        recognitionRef.current.lang = "en-US";
      } else {
        recognitionRef.current.lang = "en-IN"; // Multilingual Indian English/Hindi model
      }
    }
  }, [langMode]);

  // Start listening when modal opens
  useEffect(() => {
    if (isOpen && !isMuted && recognitionRef.current) {
      setTranscript("");
      const initialGreeting =
        langMode === "hi"
          ? "नमस्ते! मैं सुन रही हूँ। कुछ भी पूछें..."
          : "I'm listening. Ask me anything, or speak naturally...";
      setAiReply(initialGreeting);
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
      if (audioRef.current) {
        try {
          audioRef.current.pause();
          audioRef.current = null;
        } catch {}
      }
      setVoiceState("IDLE");
    }
  }, [isOpen, isMuted, langMode]);

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

  // Web Speech Fallback for offline / instant device synthesis
  const fallbackWebSpeech = (textToSpeak, detectedHindi) => {
    if (!synthRef.current || !isComponentMounted.current) return;
    synthRef.current.cancel();
    const utterance = new SpeechSynthesisUtterance(textToSpeak);
    const targetVoice = selectBestVoice(availableVoices, detectedHindi ? "hi" : "en");

    if (targetVoice) {
      utterance.voice = targetVoice;
      utterance.lang = targetVoice.lang || (detectedHindi ? "hi-IN" : "en-US");
    } else {
      utterance.lang = detectedHindi ? "hi-IN" : "en-US";
    }

    utterance.rate = detectedHindi ? 0.98 : 1.05;
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
  };

  // Process voice input and speak back answer
  const handleProcessVoicePrompt = async (prompt) => {
    if (!prompt.trim() || voiceState === "Think..") return;

    if (recognitionRef.current) {
      try {
        recognitionRef.current.stop();
      } catch {}
    }

    if (audioRef.current) {
      try {
        audioRef.current.pause();
        audioRef.current = null;
      } catch {}
    }

    setVoiceState("Think..");

    try {
      const response = await sendChatMessage({ message: prompt });
      const rawText =
        (typeof response?.content === "string" ? response.content : null) ||
        (typeof response?.reply === "string" ? response.reply : null) ||
        (typeof response?.text === "string" ? response.text : null) ||
        (typeof response === "string" ? response : null) ||
        "I processed that for you.";
      const answerText = rawText;

      // Clean markdown tags for spoken audio
      const cleanSpokenText = answerText
        .replace(/[*#`_[\]()]/g, "")
        .replace(/https?:\/\/\S+/g, "")
        .slice(0, 320);

      setAiReply(answerText);
      setVoiceState("Speak..");

      // High-Fidelity Studio Neural Voice Playback (edge-tts)
      if (!isMuted) {
        let playedNeural = false;
        const detectedHindi = langMode === "hi" || (langMode === "auto" && isHindiText(cleanSpokenText));
        const targetLang = detectedHindi ? "hi-IN" : "en-US";
        const targetVoice = detectedHindi ? "hi-IN-SwaraNeural" : "en-US-JennyNeural";

        try {
          const ttsRes = await synthesizeVoiceover({
            text: cleanSpokenText,
            language: targetLang,
            voice: targetVoice,
          });

          if (ttsRes?.audio_url && isComponentMounted.current) {
            if (audioRef.current) {
              try {
                audioRef.current.pause();
              } catch {}
            }

            const audio = new Audio(ttsRes.audio_url);
            audioRef.current = audio;

            audio.onended = () => {
              if (isComponentMounted.current && isOpen) {
                setVoiceState("Listen..");
                setTranscript("");
                if (recognitionRef.current) {
                  try {
                    recognitionRef.current.start();
                  } catch {}
                }
              }
            };

            audio.onerror = () => {
              console.warn("[AmbientVoice] Neural audio load error, using Web Speech fallback");
              fallbackWebSpeech(cleanSpokenText, detectedHindi);
            };

            await audio.play();
            playedNeural = true;
          }
        } catch (neuralErr) {
          console.warn("[AmbientVoice] Neural TTS fetch failed, using Web Speech fallback:", neuralErr);
        }

        if (!playedNeural) {
          fallbackWebSpeech(cleanSpokenText, detectedHindi);
        }
      } else {
        setTimeout(() => {
          if (isComponentMounted.current && isOpen) {
            setVoiceState("Listen..");
          }
        }, 3000);
      }
    } catch (err) {
      console.error("[AmbientVoice] Processing error:", err);
      if (err?.response?.status === 401) {
        setAiReply("Please log in to your account to use Vitya.");
      } else {
        setAiReply("Sorry, I ran into an issue connecting to the neural core. Please try again.");
      }
      setVoiceState("LISTENING");
    }
  };
  processVoicePromptRef.current = handleProcessVoicePrompt;

  const cycleLanguage = () => {
    setLangMode((prev) => {
      if (prev === "auto") return "hi";
      if (prev === "hi") return "en";
      return "auto";
    });
  };

  const langLabels = {
    auto: "Hinglish",
    hi: "Hindi",
    en: "English",
  };

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
        if (audioRef.current) {
          audioRef.current.pause();
          audioRef.current = null;
        }
      } catch {}
      setVoiceState("IDLE");
    }
  };

  if (!isOpen) return null;

  return (
    <div className="vAmbientVoiceOverlay" onClick={onClose}>
      <div className="vAmbientVoiceModal" onClick={(e) => { unlockAudio(); e.stopPropagation(); }}>
        {/* Top Header Bar */}
        <div className="vAmbientHeader">
          <div className="vAmbientBrand">
            <Radio size={16} className="vAmbientPulseIcon" />
            <span>Vitya</span>
            <span className={`vAmbientStateTag ${voiceState.toLowerCase()}`}>
              {voiceState}
            </span>
          </div>

          <div className="vAmbientControls">
            <button
              className="vAmbientLangBtn"
              onClick={() => {
                unlockAudio();
                cycleLanguage();
              }}
              title="Change Voice & Language (Auto / हिंदी / English)"
            >
              <Globe size={14} />
              <span>{langLabels[langMode]}</span>
            </button>
            <button
              className={`vAmbientBtn ${isMuted ? "muted" : ""}`}
              onClick={() => {
                unlockAudio();
                toggleMute();
              }}
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
              <p className="vAmbientSpeechText">"{transcript}"</p>
            </div>
          )}

          <div className="vAmbientAiReplyBox">
            <div className="vAmbientAiHeader">
              <Sparkles size={14} color="#a855f7" />
              <span>Vitya</span>
            </div>
            <p className="vAmbientAiText">{aiReply}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
