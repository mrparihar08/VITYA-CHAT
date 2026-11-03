import React, { useState, useEffect, useRef, useCallback } from "react";
import {
  Mic,
  MicOff,
  Square,
  Volume2,
  VolumeX,
  X,
  Sparkles,
  MessageSquare,
  Radio,
  Globe,
  Settings,
  History,
  Send,
  RotateCcw,
  Play,
  Pause,
  Maximize2,
  Minimize2,
  AlertCircle,
  Check,
  Sliders,
} from "lucide-react";
import {
  sendVoiceAssistantChat,
  resolveAssetUrl,
  transcribeVoiceAssistantSTT,
  getChatHistory,
  clearChatHistory,
} from "../../services/api";
import "./VoiceAssistant.css";

// Voice State Constants
export const VOICE_STATES = {
  IDLE: "IDLE",
  LISTENING: "LISTENING",
  THINKING: "THINKING",
  SPEAKING: "SPEAKING",
  ERROR: "ERROR",
};

// Available Voices List
const DEFAULT_VOICES = [
  {
    id: "hi-IN-SwaraNeural",
    name: "Swara",
    lang: "hi-IN",
    gender: "Female",
    accent: "Hindi & Hinglish",
    description: "Melodic & Natural",
  },
  {
    id: "hi-IN-MadhurNeural",
    name: "Madhur",
    lang: "hi-IN",
    gender: "Male",
    accent: "Hindi & Hinglish",
    description: "Friendly & Warm",
  },
  {
    id: "en-US-AriaNeural",
    name: "Aria",
    lang: "en-US",
    gender: "Female",
    accent: "American",
    description: "Conversational & Bright",
  },
  {
    id: "en-US-GuyNeural",
    name: "Guy",
    lang: "en-US",
    gender: "Male",
    accent: "American",
    description: "Deep & Professional",
  },
  {
    id: "en-IN-NeerjaNeural",
    name: "Neerja",
    lang: "en-IN",
    gender: "Female",
    accent: "Indian English",
    description: "Crisp & Professional",
  },
  {
    id: "en-GB-SoniaNeural",
    name: "Sonia",
    lang: "en-GB",
    gender: "Female",
    accent: "British",
    description: "Refined & Articulate",
  },
];

const LANGUAGE_OPTIONS = [
  { id: "auto", label: "Auto",},
  { id: "hi", label: "Hindi",},
  { id: "en", label: "English",},
];

export default function VoiceAssistant({
  isOpen = true,
  onClose,
  onNavigateToChat,
  conversationId,
  onConversationChange,
  onConversationUpdated,
  initialPrompt = "",
}) {
  // Active conversation ID tracked in sync with Chat
  const [activeConvId, setActiveConvId] = useState(conversationId || null);

  useEffect(() => {
    if (conversationId !== undefined) {
      setActiveConvId(conversationId);
    }
  }, [conversationId]);

  // Voice Assistant Operational States
  const [voiceState, setVoiceState] = useState(VOICE_STATES.IDLE);
  const [transcript, setTranscript] = useState("");
  const [interimText, setInterimText] = useState("");
  const [aiReply, setAiReply] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  // Settings & Toggles
  const [isMuted, setIsMuted] = useState(false);
  const [continuousMode, setContinuousMode] = useState(true);
  const [selectedVoice, setSelectedVoice] = useState("hi-IN-SwaraNeural");
  const [languageMode, setLanguageMode] = useState("auto");
  const [speechSpeed, setSpeechSpeed] = useState("+0%");
  const [volume, setVolume] = useState(1);
  const [isFullscreen, setIsFullscreen] = useState(false);

  // Panels & Drawers
  const [showHistory, setShowHistory] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [showTextInput, setShowTextInput] = useState(false);
  const [textInputVal, setTextInputVal] = useState("");
  const [isLoadingHistory, setIsLoadingHistory] = useState(false);

  // Unified conversation history (shared across Chat & Voice)
  const [history, setHistory] = useState([
    {
      role: "assistant",
      content: "Hello! I am Vitya, your real-time voice assistant. You can speak to me in English, Hindi, or Hinglish. How can I help you?",
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      inputMode: "voice",
      audioUrl: null,
    },
  ]);

  // Audio Visualization & Hardware Refs
  const audioContextRef = useRef(null);
  const analyserRef = useRef(null);
  const micStreamRef = useRef(null);
  const canvasRef = useRef(null);
  const animFrameRef = useRef(null);
  const [audioLevel, setAudioLevel] = useState(0);

  // Audio Playback
  const currentAudioRef = useRef(null);
  const [, setIsPlayingAudio] = useState(false);
  const [replayingIndex, setReplayingIndex] = useState(null);

  // Speech Recognition Ref
  const recognitionRef = useRef(null);
  const silenceTimerRef = useRef(null);
  const isComponentMounted = useRef(true);
  const voiceStateRef = useRef(voiceState);
  voiceStateRef.current = voiceState;

  // MediaRecorder Fallback
  const mediaRecorderRef = useRef(null);
  const recordedChunksRef = useRef([]);

  // Fetch shared conversation history from the backend on mount or when conversation changes
  useEffect(() => {
    let isCancelled = false;

    const loadSharedConversation = async () => {
      if (!isOpen) return;
      try {
        setIsLoadingHistory(true);
        const data = await getChatHistory(activeConvId);
        if (isCancelled) return;

        if (data && Array.isArray(data.messages) && data.messages.length > 0) {
          const mapped = data.messages.map((m) => {
            let contentText = m.content || "";
            try {
              const parsed = JSON.parse(contentText);
              if (parsed && typeof parsed === "object") {
                contentText =
                  parsed.reply ||
                  parsed.text ||
                  parsed.content ||
                  parsed.text_summary ||
                  parsed.summary ||
                  contentText;
              }
            } catch {}

            return {
              id: m.id,
              role: m.role,
              content: contentText,
              inputMode: m.input_mode || "chat",
              timestamp: m.created_at
                ? new Date(m.created_at).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
                : "",
              audioUrl: m.meta_info?.audio_url || null,
            };
          });

          setHistory(mapped);
          const lastBot = [...mapped].reverse().find((m) => m.role === "assistant");
          if (lastBot) {
            setAiReply(lastBot.content);
          }
        } else {
          // Fresh conversation
          setHistory([
            {
              role: "assistant",
              content: "Hello! I am Vitya, your real-time voice assistant. You can speak to me in English, Hindi, or Hinglish. How can I help you?",
              timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
              inputMode: "voice",
              audioUrl: null,
            },
          ]);
        }
      } catch (err) {
        console.warn("[VoiceAssistant] Failed to fetch shared conversation history:", err);
      } finally {
        if (!isCancelled) setIsLoadingHistory(false);
      }
    };

    loadSharedConversation();
    return () => {
      isCancelled = true;
    };
  }, [isOpen, activeConvId]);

  // Unlock AudioContext on interaction
  const initAudioContext = useCallback(() => {
    try {
      if (!audioContextRef.current) {
        const AudioCtx = window.AudioContext || window.webkitAudioContext;
        if (AudioCtx) {
          audioContextRef.current = new AudioCtx();
        }
      }
      if (audioContextRef.current && audioContextRef.current.state === "suspended") {
        audioContextRef.current.resume();
      }
    } catch (e) {
      console.warn("AudioContext init error:", e);
    }
  }, []);

  // Stop currently playing audio immediately
  const stopAudioPlayback = useCallback(() => {
    if (currentAudioRef.current) {
      try {
        currentAudioRef.current.pause();
        currentAudioRef.current.currentTime = 0;
      } catch (e) {}
      currentAudioRef.current = null;
    }
    if (typeof window !== "undefined" && window.speechSynthesis) {
      window.speechSynthesis.cancel();
    }
    setIsPlayingAudio(false);
    setReplayingIndex(null);
  }, []);

  // Interrupt Assistant
  const handleInterrupt = useCallback(() => {
    stopAudioPlayback();
    if (voiceStateRef.current === VOICE_STATES.SPEAKING || voiceStateRef.current === VOICE_STATES.THINKING) {
      setVoiceState(VOICE_STATES.IDLE);
    }
    if (continuousMode && !isMuted) {
      setTimeout(() => {
        if (isComponentMounted.current && !isMuted) {
          startListening();
        }
      }, 200);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [continuousMode, isMuted, stopAudioPlayback]);

  // Setup Web Audio Analyser for Microphone
  const setupMicAnalyser = useCallback(async (stream) => {
    try {
      initAudioContext();
      if (!audioContextRef.current) return;

      const source = audioContextRef.current.createMediaStreamSource(stream);
      const analyser = audioContextRef.current.createAnalyser();
      analyser.fftSize = 128;
      analyser.smoothingTimeConstant = 0.8;
      source.connect(analyser);
      analyserRef.current = analyser;

      const dataArray = new Uint8Array(analyser.frequencyBinCount);

      const updateLevel = () => {
        if (!isComponentMounted.current) return;
        analyser.getByteFrequencyData(dataArray);

        let sum = 0;
        for (let i = 0; i < dataArray.length; i++) {
          sum += dataArray[i];
        }
        const avg = sum / dataArray.length;
        setAudioLevel(avg);

        drawWaveform(dataArray);
        animFrameRef.current = requestAnimationFrame(updateLevel);
      };

      updateLevel();
    } catch (err) {
      console.warn("Microphone analyser setup failed:", err);
    }
  }, [initAudioContext]);

  // Render Real-Time Canvas Waveform
  const drawWaveform = (dataArray) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const width = canvas.width;
    const height = canvas.height;
    ctx.clearRect(0, 0, width, height);

    const bufferLength = dataArray.length;
    const barWidth = (width / bufferLength) * 1.5;
    let x = (width - bufferLength * barWidth) / 2;

    for (let i = 0; i < bufferLength; i++) {
      const v = dataArray[i] / 255.0;
      const barHeight = Math.max(3, v * height * 0.85);

      const gradient = ctx.createLinearGradient(0, height, 0, 0);
      if (voiceStateRef.current === VOICE_STATES.LISTENING) {
        gradient.addColorStop(0, "rgba(59, 130, 246, 0.4)");
        gradient.addColorStop(1, "rgba(168, 85, 247, 0.9)");
      } else if (voiceStateRef.current === VOICE_STATES.SPEAKING) {
        gradient.addColorStop(0, "rgba(16, 185, 129, 0.4)");
        gradient.addColorStop(1, "rgba(56, 189, 248, 0.9)");
      } else if (voiceStateRef.current === VOICE_STATES.THINKING) {
        gradient.addColorStop(0, "rgba(245, 158, 11, 0.4)");
        gradient.addColorStop(1, "rgba(236, 72, 153, 0.9)");
      } else {
        gradient.addColorStop(0, "rgba(148, 163, 184, 0.2)");
        gradient.addColorStop(1, "rgba(148, 163, 184, 0.5)");
      }

      ctx.fillStyle = gradient;
      ctx.beginPath();
      ctx.roundRect(x, height / 2 - barHeight / 2, barWidth - 2, barHeight, [4]);
      ctx.fill();

      x += barWidth;
    }
  };

  // Play assistant audio response
  const playAssistantSpeech = useCallback((audioUrl, fallbackText) => {
    stopAudioPlayback();
    setVoiceState(VOICE_STATES.SPEAKING);
    setIsPlayingAudio(true);
  
    if (audioUrl) {
      const fullUrl = resolveAssetUrl(audioUrl);
      const audio = new Audio(fullUrl);
      audio.volume = volume;
      currentAudioRef.current = audio;

      audio.onended = () => {
        setIsPlayingAudio(false);
        currentAudioRef.current = null;
        if (continuousMode && !isMuted) {
          setVoiceState(VOICE_STATES.LISTENING);
          startListening();
        } else {
          setVoiceState(VOICE_STATES.IDLE);
        }
      };

      audio.onerror = (e) => {
        console.warn("Audio element failed, falling back to Web Speech Synthesis:", e);
        speakWithBrowserSynthesis(fallbackText);
      };

      audio.play().catch((err) => {
        console.warn("Audio playback error (user gesture required):", err);
        speakWithBrowserSynthesis(fallbackText);
      });
    } else {
      speakWithBrowserSynthesis(fallbackText);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [continuousMode, isMuted, volume, stopAudioPlayback]);

  // Client Web Speech Synthesis Fallback
  const speakWithBrowserSynthesis = useCallback((text) => {
    if (typeof window === "undefined" || !window.speechSynthesis) {
      setVoiceState(VOICE_STATES.IDLE);
      setIsPlayingAudio(false);
      return;
    }

    window.speechSynthesis.cancel();
    const cleanText = (text || "").replace(/[*_#`~[\]]/g, " ").trim();
    if (!cleanText) {
      setVoiceState(VOICE_STATES.IDLE);
      
      return;
    }

    const utterance = new SpeechSynthesisUtterance(cleanText);
    utterance.volume = volume;

    if (speechSpeed === "+20%" || speechSpeed === "+15%") utterance.rate = 1.2;
    else if (speechSpeed === "-10%" || speechSpeed === "-15%") utterance.rate = 0.85;
    else utterance.rate = 1.0;

    const voices = window.speechSynthesis.getVoices() || [];
    const isHindi = /[\u0900-\u097F]|\b(namaste|kya|hai|hain|kaise|shukriya)\b/i.test(cleanText);
    if (isHindi) {
      const hindiVoice = voices.find((v) => (v.lang && v.lang.startsWith("hi")) || /hindi|swara|natural/i.test(v.name));
      if (hindiVoice) utterance.voice = hindiVoice;
    } else {
      const enVoice = voices.find((v) => /natural|aria|jenny|google/i.test(v.name) && v.lang.startsWith("en"));
      if (enVoice) utterance.voice = enVoice;
    }

    utterance.onend = () => {
      setIsPlayingAudio(false);
      if (continuousMode && !isMuted) {
        setVoiceState(VOICE_STATES.LISTENING);
        startListening();
      } else {
        setVoiceState(VOICE_STATES.IDLE);
      }
    };

    utterance.onerror = () => {
      setIsPlayingAudio(false);
      setVoiceState(VOICE_STATES.IDLE);
    };

    window.speechSynthesis.speak(utterance);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [continuousMode, isMuted, speechSpeed, volume]);

  // Process User Spoken Voice or Typed Prompt (Unified turn saving to DB)
  const handleProcessTurn = useCallback(async (spokenText) => {
    const cleanQuery = (spokenText || "").trim();
    if (!cleanQuery) {
      setVoiceState(VOICE_STATES.IDLE);
      return;
    }

    if (recognitionRef.current) {
      try {
        recognitionRef.current.stop();
      } catch (e) {}
    }

    stopAudioPlayback();
    setVoiceState(VOICE_STATES.THINKING);
    setErrorMessage("");

    const userMessageTime = new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
    const userMessage = {
      role: "user",
      content: cleanQuery,
      inputMode: "voice",
      timestamp: userMessageTime,
    };

    // Optimistically show user speech in local UI
    setHistory((prev) => [...prev, userMessage]);
    setTranscript(cleanQuery);
    setInterimText("");

    try {
      const res = await sendVoiceAssistantChat({
        message: cleanQuery,
        conversation_id: activeConvId != null && activeConvId !== '' ? String(activeConvId) : null,
        voice: selectedVoice,
        language: languageMode,
        speed: speechSpeed,
      });

      const reply = res.reply || res.clean_speech_text || "I'm here to help!";
      const audioUrl = res.audio_url || null;

      // Sync unified conversation ID if newly created or switched
      const returnedConvId = res.conversation_id || res.id;
      if (returnedConvId && returnedConvId !== activeConvId) {
        setActiveConvId(returnedConvId);
        onConversationChange?.(returnedConvId);
      }

      // Notify parent that conversation updated so Chat and Sidebar stay synchronized!
      onConversationUpdated?.();

      const assistantMessageTime = new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
      const assistantMessage = {
        role: "assistant",
        content: reply,
        inputMode: "voice",
        cleanSpeech: res.clean_speech_text || reply,
        timestamp: assistantMessageTime,
        audioUrl: audioUrl,
      };

      setAiReply(reply);
      setHistory((prev) => [...prev, assistantMessage]);

      playAssistantSpeech(audioUrl, res.clean_speech_text || reply);
    } catch (err) {
      console.error("[VoiceAssistant] Chat API turn failed:", err);
      const isAuthErr = err?.response?.status === 401;
      const fallbackReply = isAuthErr
        ? "Please sign in to your Vitya AI account to continue our voice conversation."
        : "I ran into a brief connection hitch. Please try speaking again.";

      setErrorMessage(fallbackReply);
      setAiReply(fallbackReply);
      setVoiceState(VOICE_STATES.ERROR);
      playAssistantSpeech(null, fallbackReply);
    }
  }, [activeConvId, selectedVoice, languageMode, speechSpeed, playAssistantSpeech, stopAudioPlayback, onConversationChange, onConversationUpdated]);

  // Start Speech Recognition (VAD + Silence Auto-Commit)
  const startListening = useCallback(async () => {
    if (isMuted) return;
    initAudioContext();
    stopAudioPlayback();

    const SpeechRecognition =
      typeof window !== "undefined" &&
      (window.SpeechRecognition || window.webkitSpeechRecognition);

    if (SpeechRecognition) {
      try {
        if (!recognitionRef.current) {
          const recognition = new SpeechRecognition();
          recognition.continuous = true;
          recognition.interimResults = true;
          recognition.lang = languageMode === "hi" ? "hi-IN" : "en-US";

          recognition.onstart = () => {
            if (isComponentMounted.current) {
              setVoiceState(VOICE_STATES.LISTENING);
              setErrorMessage("");
            }
          };

          recognition.onresult = (event) => {
            let finalPrompt = "";
            let interimPrompt = "";

            for (let i = event.resultIndex; i < event.results.length; i++) {
              const text = event.results[i][0].transcript;
              if (event.results[i].isFinal) {
                finalPrompt += text;
              } else {
                interimPrompt += text;
              }
            }

            if (interimPrompt) {
              setInterimText(interimPrompt);
              setVoiceState(VOICE_STATES.LISTENING);
            }

            if (silenceTimerRef.current) {
              clearTimeout(silenceTimerRef.current);
            }

            // Silence VAD: commit speech after 1.4s of quiet
            silenceTimerRef.current = setTimeout(() => {
              const fullSpeech = (finalPrompt + " " + interimPrompt).trim();
              if (fullSpeech.length > 1 && voiceStateRef.current === VOICE_STATES.LISTENING) {
                handleProcessTurn(fullSpeech);
              }
            }, 1400);
          };

          recognition.onerror = (event) => {
            console.warn("[VoiceAssistant] Recognition event error:", event.error);
            if (event.error === "not-allowed" || event.error === "service-not-allowed") {
              setErrorMessage("Microphone access was denied. Please allow microphone permissions in your browser settings.");
              setVoiceState(VOICE_STATES.ERROR);
            } else if (event.error === "network") {
              setErrorMessage("Network issue during speech recognition. Please check your connection.");
              setVoiceState(VOICE_STATES.ERROR);
            }
          };

          recognition.onend = () => {
            if (
              isComponentMounted.current &&
              continuousMode &&
              !isMuted &&
              voiceStateRef.current === VOICE_STATES.LISTENING
            ) {
              try {
                recognition.start();
              } catch (e) {}
            }
          };

          recognitionRef.current = recognition;
        }

        try {
          recognitionRef.current.start();
        } catch (e) {}
      } catch (err) {
        console.warn("SpeechRecognition start exception:", err);
      }
    } else {
      startMediaRecorderFallback();
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isMuted, languageMode, continuousMode, initAudioContext, stopAudioPlayback, handleProcessTurn]);

  // MediaRecorder Fallback for STT
  const startMediaRecorderFallback = async () => {
    try {
      if (!micStreamRef.current) {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        micStreamRef.current = stream;
        setupMicAnalyser(stream);
      }
      recordedChunksRef.current = [];
      const mediaRecorder = new MediaRecorder(micStreamRef.current);

      mediaRecorder.ondataavailable = (e) => {
        if (e.data.size > 0) {
          recordedChunksRef.current.push(e.data);
        }
      };

      mediaRecorder.onstop = async () => {
        const audioBlob = new Blob(recordedChunksRef.current, { type: "audio/webm" });
        if (audioBlob.size > 2000) {
          try {
            setVoiceState(VOICE_STATES.THINKING);
            const res = await transcribeVoiceAssistantSTT(audioBlob);
            if (res.text && res.text.trim()) {
              handleProcessTurn(res.text.trim());
            } else {
              setVoiceState(VOICE_STATES.IDLE);
            }
          } catch (err) {
            setErrorMessage("Failed to transcribe audio. Please try again.");
            setVoiceState(VOICE_STATES.ERROR);
          }
        }
      };

      mediaRecorder.start();
      mediaRecorderRef.current = mediaRecorder;
      setVoiceState(VOICE_STATES.LISTENING);
    } catch (err) {
      setErrorMessage("Could not access microphone. Please verify browser permissions.");
      setVoiceState(VOICE_STATES.ERROR);
    }
  };

  // Toggle Microphone Mute
  const toggleMute = () => {
    if (isMuted) {
      setIsMuted(false);
      startListening();
    } else {
      setIsMuted(true);
      if (recognitionRef.current) {
        try {
          recognitionRef.current.stop();
        } catch (e) {}
      }
      if (mediaRecorderRef.current && mediaRecorderRef.current.state === "recording") {
        mediaRecorderRef.current.stop();
      }
      stopAudioPlayback();
      setVoiceState(VOICE_STATES.IDLE);
    }
  };

  // Replay a message from history
  const handleReplayMessage = (msg, index) => {
    initAudioContext();
    setReplayingIndex(index);
    playAssistantSpeech(msg.audioUrl, msg.cleanSpeech || msg.content);
  };

  // Text Prompt Submit Fallback
  const handleTextSubmit = (e) => {
    e.preventDefault();
    if (!textInputVal.trim()) return;
    initAudioContext();
    handleProcessTurn(textInputVal.trim());
    setTextInputVal("");
    setShowTextInput(false);
  };

  // Clear Unified History
  const handleClearHistory = async () => {
    if (window.confirm("Are you sure you want to clear this conversation?")) {
      try {
        await clearChatHistory();
      } catch (e) {}
      setActiveConvId(null);
      onConversationChange?.(null);
      onConversationUpdated?.();
      setHistory([
        {
          role: "assistant",
          content: "Conversation history cleared. How can I help you today?",
          timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
          inputMode: "voice",
          audioUrl: null,
        },
      ]);
      setTranscript("");
      setAiReply("");
    }
  };

  // Initialize Microphone on Modal Open
  useEffect(() => {
    isComponentMounted.current = true;

    const setupMic = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        micStreamRef.current = stream;
        setupMicAnalyser(stream);
        startListening();
      } catch (err) {
        console.warn("Microphone access denied or error:", err);
        setErrorMessage("Microphone permission required for voice mode. You can also type below.");
      }
    };

    if (isOpen) {
      setupMic();
    }

    return () => {
      isComponentMounted.current = false;
      if (silenceTimerRef.current) clearTimeout(silenceTimerRef.current);
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
      if (recognitionRef.current) {
        try {
          recognitionRef.current.stop();
        } catch (e) {}
        recognitionRef.current = null;
      }
      if (micStreamRef.current) {
        micStreamRef.current.getTracks().forEach((t) => t.stop());
        micStreamRef.current = null;
      }
      stopAudioPlayback();
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen]);

  // Handle Keyboard Shortcuts
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (!isOpen) return;
      if (e.key === "Escape") {
        if (showHistory) setShowHistory(false);
        else if (showSettings) setShowSettings(false);
        else if (showTextInput) setShowTextInput(false);
        else onClose?.();
      } else if (e.code === "Space" && e.target.tagName !== "INPUT" && e.target.tagName !== "TEXTAREA") {
        e.preventDefault();
        handleInterrupt();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, showHistory, showSettings, showTextInput, onClose, handleInterrupt]);

  if (!isOpen) return null;

  return (
    <div
      className={`vVoiceOverlay ${isFullscreen ? "fullscreen" : ""}`}
      onClick={(e) => {
        initAudioContext();
        if (e.target === e.currentTarget) onClose?.();
      }}
    >
      <div
        className={`vVoiceContainer ${isFullscreen ? "fullscreen" : ""}`}
        onClick={(e) => {
          initAudioContext();
          e.stopPropagation();
        }}
      >
        {/* Top Header Bar */}
        <header className="vVoiceHeader">
          <div className="vVoiceBrandGroup">
            <div className="vVoiceLogoBadge">
              <Sparkles size={16} className="vVoiceSparkleIcon" />
            </div>
            <div className="vVoiceTitleWrap">
              <span className="vVoiceTitle">Vitya.ai</span>
              <span className="vVoiceSubtitle">
                {activeConvId ? `Conversation #${activeConvId}` : "Unified Voice Mode"}
              </span>
            </div>
            <div className={`vVoiceStatusBadge ${voiceState.toLowerCase()}`}>
              <span className="vVoiceStatusDot" />
              <span>{voiceState}</span>
            </div>
          </div>

          <div className="vVoiceHeaderActions">
            {/* Language Switcher */}
            <div className="vVoiceHeaderPill">
              <Globe size={14} className="vVoiceIconMuted" />
              <select
                value={languageMode}
                onChange={(e) => {
                  setLanguageMode(e.target.value);
                  if (recognitionRef.current) {
                    try {
                      recognitionRef.current.stop();
                      recognitionRef.current = null;
                    } catch (err) {}
                  }
                  setTimeout(() => startListening(), 100);
                }}
                className="vVoiceHeaderSelect"
                aria-label="Select Assistant Language"
              >
                {LANGUAGE_OPTIONS.map((opt) => (
                  <option key={opt.id} value={opt.id}>
                    {opt.flag} {opt.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Switch to Chat (same conversation) */}
            <button
              className="vVoiceHeaderBtn"
              onClick={() => {
                stopAudioPlayback();
                onNavigateToChat?.();
              }}
              title="Switch to Chat (shares this conversation)"
              aria-label="Switch to Chat"
            >
              <MessageSquare size={17} />
            </button>

            {/* Conversation History Drawer Toggle */}
            <button
              className={`vVoiceHeaderBtn ${showHistory ? "active" : ""}`}
              onClick={() => {
                setShowHistory(!showHistory);
                setShowSettings(false);
              }}
              title="Unified Conversation History (Chat & Voice)"
              aria-label="Transcript History"
            >
              <History size={17} />
            </button>

            {/* Voice & Audio Tuning Settings Toggle */}
            <button
              className={`vVoiceHeaderBtn ${showSettings ? "active" : ""}`}
              onClick={() => {
                setShowSettings(!showSettings);
                setShowHistory(false);
              }}
              title="Voice & Engine Settings"
              aria-label="Voice Settings"
            >
              <Sliders size={17} />
            </button>

            {/* Fullscreen Expand/Collapse */}
            <button
              className="vVoiceHeaderBtn"
              onClick={() => setIsFullscreen(!isFullscreen)}
              title={isFullscreen ? "Exit Fullscreen" : "Immersive Fullscreen"}
              aria-label="Toggle Fullscreen"
            >
              {isFullscreen ? <Minimize2 size={17} /> : <Maximize2 size={17} />}
            </button>

            {/* Exit Voice Mode */}
            <button
              className="vVoiceHeaderBtn close"
              onClick={() => {
                stopAudioPlayback();
                onClose?.();
              }}
              title="Exit Voice Mode (Esc)"
              aria-label="Close Assistant"
            >
              <X size={19} />
            </button>
          </div>
        </header>

        {/* Main Stage: AI Voice Orb & Waveforms */}
        <main className="vVoiceStage">
          {/* Central 3D Animated AI Voice Orb */}
          <div
            className={`vVoiceOrbWrapper ${voiceState.toLowerCase()}`}
            onClick={() => {
              if (voiceState === VOICE_STATES.SPEAKING || voiceState === VOICE_STATES.THINKING) {
                handleInterrupt();
              } else if (voiceState === VOICE_STATES.IDLE || voiceState === VOICE_STATES.ERROR) {
                startListening();
              }
            }}
            title={
              voiceState === VOICE_STATES.SPEAKING
                ? "Click to interrupt Vitya"
                : voiceState === VOICE_STATES.LISTENING
                ? "Listening to you... Speak freely"
                : "Click to start voice"
            }
          >
            {/* Outer Aurora Glow Rings */}
            <div
              className={`vVoiceAuroraRing ring1 ${voiceState.toLowerCase()}`}
              style={{
                transform: `scale(${1 + Math.min(0.35, audioLevel / 80)})`,
              }}
            />
            <div
              className={`vVoiceAuroraRing ring2 ${voiceState.toLowerCase()}`}
              style={{
                transform: `scale(${1 + Math.min(0.5, audioLevel / 60)})`,
              }}
            />

            {/* Thinking Orbital Rings */}
            {voiceState === VOICE_STATES.THINKING && (
              <div className="vVoiceOrbitalRings">
                <span className="vOrbitalParticle p1" />
                <span className="vOrbitalParticle p2" />
                <span className="vOrbitalParticle p3" />
              </div>
            )}

            {/* Core Neural Orb */}
            <div
              className={`vVoiceOrbCore ${voiceState.toLowerCase()}`}
              style={{
                transform: `scale(${
                  voiceState === VOICE_STATES.LISTENING
                    ? 1 + Math.min(0.25, audioLevel / 90)
                    : voiceState === VOICE_STATES.SPEAKING
                    ? 1.05 + Math.sin(Date.now() / 200) * 0.05
                    : 1
                })`,
              }}
            >
              <div className="vVoiceOrbGlowInner" />
              <div className="vVoiceOrbSpecular" />
              <div className="vVoiceOrbParticles" />
            </div>

            {/* State Prompt Callout beneath Orb */}
            <div className="vVoiceStatePrompt">
              {voiceState === VOICE_STATES.IDLE && <span>Tap orb or speak to start</span>}
              {voiceState === VOICE_STATES.LISTENING && (
                <span className="vVoicePulseListening">Listening...</span>
              )}
              {voiceState === VOICE_STATES.THINKING && (
                <span className="vVoiceThinkingText">Synthesizing intelligence...</span>
              )}
              {voiceState === VOICE_STATES.SPEAKING && (
                <span className="vVoiceSpeakingText">Speaking • Click to interrupt</span>
              )}
              {voiceState === VOICE_STATES.ERROR && (
                <span className="vVoiceErrorText">Connection hiccup • Click to retry</span>
              )}
            </div>
          </div>

          {/* Real-Time Waveform Canvas Visualizer */}
          <div className="vVoiceWaveformContainer">
            <canvas
              ref={canvasRef}
              width={320}
              height={50}
              className="vVoiceCanvas"
            />
          </div>

          {/* Live Transcript & Real-Time AI Response Display */}
          <div className="vVoiceSpeechCards">
            {(transcript || interimText) && (
              <div className="vVoiceUserSpeechCard">
                <div style={{ display: "flex", alignItems: "center", gap: 5, marginBottom: 4 }}>
                  <span className="vVoiceCardLabel">You (Voice)</span>
                </div>
                <p className="vVoiceSpeechText">
                  {interimText || transcript}
                  {interimText && <span className="vVoiceCursorBlink">|</span>}
                </p>
              </div>
            )}

            {aiReply && (
              <div className="vVoiceAiResponseCard">
                <div className="vVoiceCardHeader">
                  <div className="vVoiceAiIconWrap">
                    <Sparkles size={13} color="#a855f7" />
                  </div>
                  <span className="vVoiceCardLabel">Vitya</span>
                </div>
                <p className="vVoiceAiText">{aiReply}</p>
              </div>
            )}

            {errorMessage && (
              <div className="vVoiceErrorCard">
                <AlertCircle size={16} className="vVoiceErrorIcon" />
                <span className="vVoiceErrorMsg">{errorMessage}</span>
                <button
                  className="vVoiceRetryBtn"
                  onClick={() => {
                    setErrorMessage("");
                    startListening();
                  }}
                >
                  <RotateCcw size={13} />
                  <span>Retry</span>
                </button>
              </div>
            )}
          </div>
        </main>

        {/* Slide-out: Unified Conversation History Drawer */}
        {showHistory && (
          <aside className="vVoiceDrawer history">
            <div className="vVoiceDrawerHeader">
              <div className="vVoiceDrawerTitleGroup">
                <History size={16} color="#c084fc" />
                <h3>Unified History</h3>
                {activeConvId && (
                  <span style={{ fontSize: "11px", color: "#94a3b8", marginLeft: "4px" }}>
                    #{activeConvId}
                  </span>
                )}
              </div>
              <div className="vVoiceDrawerActions">
                <button
                  className="vVoiceDrawerPillBtn"
                  onClick={handleClearHistory}
                  title="Clear conversation"
                >
                  Clear
                </button>
                <button
                  className="vVoiceDrawerCloseBtn"
                  onClick={() => setShowHistory(false)}
                >
                  <X size={16} />
                </button>
              </div>
            </div>

            <div className="vVoiceDrawerContent">
              {isLoadingHistory ? (
                <div className="vVoiceEmptyState">
                  <p>Loading conversation memory...</p>
                </div>
              ) : history.length === 0 ? (
                <div className="vVoiceEmptyState">
                  <MessageSquare size={24} className="vVoiceIconMuted" />
                  <p>No messages yet in this conversation.</p>
                </div>
              ) : (
                history.map((msg, idx) => (
                  <div key={idx} className={`vVoiceHistoryMsg ${msg.role}`}>
                    <div className="vVoiceMsgHeader">
                      <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                        <span className="vVoiceMsgAuthor">
                          {msg.role === "user" ? "You" : "Vitya"}
                        </span>
                        <span className={`vVoiceModeBadge ${msg.inputMode || "chat"}`}>
                          {msg.inputMode === "voice" ? <Mic size={10} /> : <MessageSquare size={10} />}
                          <span>{msg.inputMode === "voice" ? "Voice" : "Chat"}</span>
                        </span>
                      </div>
                      <span className="vVoiceMsgTime">{msg.timestamp}</span>
                    </div>
                    <p className="vVoiceMsgBody">{msg.content}</p>
                    {msg.role === "assistant" && (
                      <div className="vVoiceMsgActions">
                        <button
                          className={`vVoiceReplayBtn ${replayingIndex === idx ? "playing" : ""}`}
                          onClick={() => handleReplayMessage(msg, idx)}
                          title="Replay Voice Audio"
                        >
                          {replayingIndex === idx ? <Pause size={12} /> : <Play size={12} />}
                          <span>{replayingIndex === idx ? "Playing" : "Replay"}</span>
                        </button>
                      </div>
                    )}
                  </div>
                ))
              )}
            </div>
          </aside>
        )}

        {/* Slide-out: Voice & Audio Settings Drawer */}
        {showSettings && (
          <aside className="vVoiceDrawer settings">
            <div className="vVoiceDrawerHeader">
              <div className="vVoiceDrawerTitleGroup">
                <Settings size={16} color="#c084fc" />
                <h3>Voice & Audio Engine</h3>
              </div>
              <button
                className="vVoiceDrawerCloseBtn"
                onClick={() => setShowSettings(false)}
              >
                <X size={16} />
              </button>
            </div>

            <div className="vVoiceDrawerContent">
              {/* Select Neural Voice */}
              <div className="vVoiceSettingSection">
                <label className="vVoiceSettingLabel">AI Voice Persona</label>
                <div className="vVoiceVoiceGrid">
                  {DEFAULT_VOICES.map((v) => (
                    <button
                      key={v.id}
                      className={`vVoiceVoiceOption ${selectedVoice === v.id ? "selected" : ""}`}
                      onClick={() => setSelectedVoice(v.id)}
                    >
                      <div className="vVoiceOptionTop">
                        <span className="vVoiceOptionName">{v.name}</span>
                        {selectedVoice === v.id && <Check size={14} color="#a855f7" />}
                      </div>
                      <span className="vVoiceOptionAccent">{v.accent}</span>
                      <span className="vVoiceOptionDesc">{v.description}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Speech Speed Offset */}
              <div className="vVoiceSettingSection">
                <label className="vVoiceSettingLabel">Speech Pace</label>
                <div className="vVoicePillGroup">
                  {[
                    { label: "0.85x", val: "-15%" },
                    { label: "1.0x (Normal)", val: "+0%" },
                    { label: "1.2x (Fast)", val: "+15%" },
                  ].map((spd) => (
                    <button
                      key={spd.val}
                      className={`vVoicePill ${speechSpeed === spd.val ? "active" : ""}`}
                      onClick={() => setSpeechSpeed(spd.val)}
                    >
                      {spd.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Volume Slider */}
              <div className="vVoiceSettingSection">
                <div className="vVoiceSettingLabelRow">
                  <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                    {volume === 0 ? <VolumeX size={15} color="#94a3b8" /> : <Volume2 size={15} color="#c084fc" />}
                    <label className="vVoiceSettingLabel" style={{ margin: 0 }}>Volume</label>
                  </div>
                  <span className="vVoiceSettingValue">{Math.round(volume * 100)}%</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.05"
                  value={volume}
                  onChange={(e) => {
                    const newVol = parseFloat(e.target.value);
                    setVolume(newVol);
                    if (currentAudioRef.current) currentAudioRef.current.volume = newVol;
                  }}
                  className="vVoiceRangeInput"
                />
              </div>

              {/* Continuous Conversation Toggle */}
              <div className="vVoiceSettingRow">
                <div>
                  <span className="vVoiceRowTitle">Continuous Hands-Free</span>
                  <p className="vVoiceRowDesc">Vitya automatically listens again after answering</p>
                </div>
                <input
                  type="checkbox"
                  checked={continuousMode}
                  onChange={(e) => setContinuousMode(e.target.checked)}
                  className="vVoiceToggleSwitch"
                />
              </div>
            </div>
          </aside>
        )}

        {/* Text Input Drawer Fallback */}
        {showTextInput && (
          <form className="vVoiceTextBar" onSubmit={handleTextSubmit}>
            <input
              type="text"
              placeholder="Type your message to Vitya..."
              value={textInputVal}
              onChange={(e) => setTextInputVal(e.target.value)}
              className="vVoiceTextInputField"
              autoFocus
            />
            <button
              type="submit"
              disabled={!textInputVal.trim()}
              className="vVoiceTextSubmitBtn"
              title="Send text prompt"
            >
              <Send size={16} />
            </button>
            <button
              type="button"
              className="vVoiceTextCancelBtn"
              onClick={() => setShowTextInput(false)}
            >
              <X size={16} />
            </button>
          </form>
        )}

        {/* Elegant Bottom Control Panel */}
        <footer className="vVoiceFooter">
          <div className="vVoiceFooterControls">
            {/* Text Input Fallback Toggle */}
            <button
              className={`vVoiceCtrlBtn ${showTextInput ? "active" : ""}`}
              onClick={() => setShowTextInput(!showTextInput)}
              title="Type message (Keyboard fallback)"
              aria-label="Text input mode"
            >
              <MessageSquare size={18} />
              <span className="vVoiceCtrlLabel">Type</span>
            </button>

            {/* Continuous Mode Hands-free Toggle */}
            <button
              className={`vVoiceCtrlBtn ${continuousMode ? "active" : ""}`}
              onClick={() => setContinuousMode(!continuousMode)}
              title={continuousMode ? "Continuous Voice: ON" : "Continuous Voice: OFF"}
              aria-label="Continuous mode toggle"
            >
              <Radio size={18} />
              <span className="vVoiceCtrlLabel">
                {continuousMode ? "Auto Loop" : "Manual"}
              </span>
            </button>

            {/* Primary Action Button: Microphone Toggle */}
            <button
              className={`vVoiceMainMicBtn ${isMuted ? "muted" : "live"} ${
                voiceState === VOICE_STATES.LISTENING ? "listening" : ""
              }`}
              onClick={toggleMute}
              title={isMuted ? "Unmute Microphone" : "Mute Microphone"}
              aria-label="Microphone Toggle"
            >
              {isMuted ? <MicOff size={24} /> : <Mic size={24} />}
            </button>

            {/* Interrupt AI Button */}
            <button
              className={`vVoiceCtrlBtn ${voiceState === VOICE_STATES.SPEAKING ? "can-interrupt" : ""}`}
              onClick={handleInterrupt}
              disabled={voiceState !== VOICE_STATES.SPEAKING && voiceState !== VOICE_STATES.THINKING}
              title="Interrupt AI Speaking (Spacebar)"
              aria-label="Interrupt AI"
            >
              <Square size={18} />
              <span className="vVoiceCtrlLabel">Interrupt</span>
            </button>

            {/* End Conversation / Close */}
            <button
              className="vVoiceCtrlBtn danger"
              onClick={() => {
                stopAudioPlayback();
                onClose?.();
              }}
              title="End Voice Conversation"
              aria-label="End Conversation"
            >
              <X size={18} />
              <span className="vVoiceCtrlLabel">End</span>
            </button>
          </div>
        </footer>
      </div>
    </div>
  );
}
