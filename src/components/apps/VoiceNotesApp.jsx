import React, { useState, useRef, useEffect, useCallback } from "react";
import {
  Mic,
  Square,
  RotateCcw,
  Sparkles,
  CheckCircle2,
  Calendar,
  CheckSquare,
  Upload,
  FileText,
  ListTodo,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import {
  getVoiceNoteSamples,
  transcribeAndAnalyzeAudio,
  injectActionItemsToWorkspace,
} from "../../services/api";
import "./VoiceNotesApp.css";

export default function VoiceNotesApp({
  onNavigateToTasks,
  onNavigateToCalendar,
  onNavigateToNotes,
}) {
  // Recording State
  const [isRecording, setIsRecording] = useState(false);
  const [recordingSeconds, setRecordingSeconds] = useState(0);
  const [recordedAudioBlob, setRecordedAudioBlob] = useState(null);
  const [audioUrl, setAudioUrl] = useState(null);
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);

  // Audio Processing State
  const [isProcessing, setIsProcessing] = useState(false);
  const [meetingIntelligence, setMeetingIntelligence] = useState(null);
  const [sampleMeetings, setSampleMeetings] = useState([]);
  const [selectedSampleId, setSelectedSampleId] = useState(null);

  // Action Items Management State
  const [selectedItemIds, setSelectedItemIds] = useState(new Set());
  const [isInjecting, setIsInjecting] = useState(false);
  const [injectionSuccess, setInjectionSuccess] = useState(null);
  const [showRawTranscript, setShowRawTranscript] = useState(false);

  // Media & Web Audio Refs
  const mediaRecorderRef = useRef(null);
  const audioStreamRef = useRef(null);
  const audioContextRef = useRef(null);
  const analyserRef = useRef(null);
  const animationFrameRef = useRef(null);
  const canvasRef = useRef(null);
  const audioPlayerRef = useRef(null);
  const timerIntervalRef = useRef(null);

  // 1. Load Pre-curated Sample Meetings
  useEffect(() => {
    async function loadSamples() {
      try {
        const samples = await getVoiceNoteSamples();
        if (samples && Array.isArray(samples)) {
          setSampleMeetings(samples);
        }
      } catch (err) {
        console.error("Failed to fetch sample voice meetings", err);
      }
    }
    loadSamples();
  }, []);

  // 2. Waveform Canvas Visualizer Engine
  const drawWaveform = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    const analyser = analyserRef.current;

    const width = canvas.width;
    const height = canvas.height;

    if (!analyser || !isRecording) {
      // Draw resting idle waves
      ctx.clearRect(0, 0, width, height);
      ctx.beginPath();
      ctx.strokeStyle = "rgba(168, 85, 247, 0.25)";
      ctx.lineWidth = 2;
      const centerY = height / 2;
      for (let x = 0; x < width; x += 4) {
        const y = centerY + Math.sin(x * 0.05 + Date.now() * 0.003) * 6;
        if (x === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
      ctx.stroke();

      if (isRecording) {
        animationFrameRef.current = requestAnimationFrame(drawWaveform);
      }
      return;
    }

    const bufferLength = analyser.frequencyBinCount;
    const dataArray = new Uint8Array(bufferLength);
    analyser.getByteFrequencyData(dataArray);

    ctx.clearRect(0, 0, width, height);

    // Glowing Neon Gradient Bar Spectrum
    const barWidth = (width / bufferLength) * 2.8;
    let barHeight;
    let x = 0;

    const gradient = ctx.createLinearGradient(0, height, 0, 0);
    gradient.addColorStop(0, "#a855f7");
    gradient.addColorStop(0.5, "#6366f1");
    gradient.addColorStop(1, "#38bdf8");

    ctx.fillStyle = gradient;

    for (let i = 0; i < bufferLength; i++) {
      barHeight = (dataArray[i] / 255) * (height * 0.85);

      // Symmetrical centered visualization
      const y = (height - barHeight) / 2;
      ctx.fillRect(x, y, barWidth - 1, barHeight);

      x += barWidth;
      if (x > width) break;
    }

    animationFrameRef.current = requestAnimationFrame(drawWaveform);
  }, [isRecording]);

  useEffect(() => {
    drawWaveform();
    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [drawWaveform]);

  // 3. Start In-Browser Live Microphone Recording
  const startRecording = async () => {
    try {
      setRecordedAudioBlob(null);
      setAudioUrl(null);
      setMeetingIntelligence(null);
      setInjectionSuccess(null);
      setSelectedSampleId(null);
      setRecordingSeconds(0);

      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      audioStreamRef.current = stream;

      // AudioContext + Analyser Node for reactive visualization
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      const audioCtx = new AudioCtx();
      audioContextRef.current = audioCtx;

      const source = audioCtx.createMediaStreamSource(stream);
      const analyser = audioCtx.createAnalyser();
      analyser.fftSize = 128;
      source.connect(analyser);
      analyserRef.current = analyser;

      // MediaRecorder initialization
      const mimeType = MediaRecorder.isTypeSupported("audio/webm;codecs=opus")
        ? "audio/webm;codecs=opus"
        : "audio/webm";
      const recorder = new MediaRecorder(stream, { mimeType });
      mediaRecorderRef.current = recorder;

      const audioChunks = [];
      recorder.ondataavailable = (e) => {
        if (e.data.size > 0) audioChunks.push(e.data);
      };

      recorder.onstop = () => {
        const audioBlob = new Blob(audioChunks, { type: mimeType });
        setRecordedAudioBlob(audioBlob);
        setAudioUrl(URL.createObjectURL(audioBlob));
      };

      recorder.start(250);
      setIsRecording(true);

      // Start elapsed timer
      timerIntervalRef.current = setInterval(() => {
        setRecordingSeconds((prev) => prev + 1);
      }, 1000);
    } catch (err) {
      console.error("Microphone access error:", err);
      alert(
        "Microphone access denied or unavailable. You can click 'Load Sample Meeting' below to test the full Whisper intelligence and action item pipeline!"
      );
    }
  };

  // 4. Stop Recording & Clean Up Audio Streams
  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
    }
    if (audioStreamRef.current) {
      audioStreamRef.current.getTracks().forEach((track) => track.stop());
    }
    if (audioContextRef.current && audioContextRef.current.state !== "closed") {
      audioContextRef.current.close();
    }
    if (timerIntervalRef.current) {
      clearInterval(timerIntervalRef.current);
    }
    setIsRecording(false);
  };

  // 5. Audio File Upload Handler
  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setRecordedAudioBlob(file);
    setAudioUrl(URL.createObjectURL(file));
    setSelectedSampleId(null);
    setMeetingIntelligence(null);
    setInjectionSuccess(null);
  };

  // 6. Transcribe & Analyze Recorded Audio
  const handleTranscribeAndAnalyze = async (blobToProcess = null) => {
    const blob = blobToProcess || recordedAudioBlob;
    if (!blob) {
      alert("No audio recorded or selected yet.");
      return;
    }

    setIsProcessing(true);
    setInjectionSuccess(null);

    try {
      const formData = new FormData();
      const ext = blob.name ? blob.name.split(".").pop() : "webm";
      formData.append("audio", blob, `voice_recording.${ext}`);
      formData.append("title", "Executive Sync Meeting");
      formData.append("auto_inject", "false");

      const result = await transcribeAndAnalyzeAudio(formData);
      if (result && result.success) {
        setMeetingIntelligence(result);
        // By default, select all detected action items
        const allIds = new Set((result.action_items || []).map((it) => it.id));
        setSelectedItemIds(allIds);
      }
    } catch (err) {
      console.error("Transcription & analysis failed:", err);
      alert("Failed to transcribe audio. Falling back to structured intelligence preview.");
    } finally {
      setIsProcessing(false);
    }
  };

  // 7. Load Preloaded Sample Meeting (Zero-Microphone Testing)
  const handleLoadSampleMeeting = (sample) => {
    setSelectedSampleId(sample.id);
    setRecordedAudioBlob(null);
    setAudioUrl(null);
    setInjectionSuccess(null);

    const intel = {
      success: true,
      title: sample.title,
      summary: sample.summary,
      sentiment: sample.sentiment,
      raw_transcript: sample.raw_transcript,
      key_points: sample.key_points,
      action_items: sample.action_items.map((it) => ({ ...it, injected: false })),
    };

    setMeetingIntelligence(intel);
    const allIds = new Set((sample.action_items || []).map((it) => it.id));
    setSelectedItemIds(allIds);
  };

  // 8. Toggle Action Item Selection
  const toggleItemSelection = (id) => {
    setSelectedItemIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  // 9. Update Action Item Type (Task vs Calendar)
  const updateItemType = (id, newType) => {
    setMeetingIntelligence((prev) => {
      if (!prev) return prev;
      return {
        ...prev,
        action_items: prev.action_items.map((it) =>
          it.id === id ? { ...it, type: newType } : it
        ),
      };
    });
  };

  // 10. Update Action Item Title
  const updateItemTitle = (id, newTitle) => {
    setMeetingIntelligence((prev) => {
      if (!prev) return prev;
      return {
        ...prev,
        action_items: prev.action_items.map((it) =>
          it.id === id ? { ...it, title: newTitle } : it
        ),
      };
    });
  };

  // 11. Inject Action Items into TasksApp & CalendarApp
  const handleInjectActionItems = async () => {
    if (!meetingIntelligence || !meetingIntelligence.action_items) return;

    const itemsToInject = meetingIntelligence.action_items.filter((it) =>
      selectedItemIds.has(it.id)
    );

    if (itemsToInject.length === 0) {
      alert("Please select at least one action item to inject.");
      return;
    }

    setIsInjecting(true);
    try {
      const payload = {
        meeting_title: meetingIntelligence.title,
        summary: meetingIntelligence.summary,
        save_as_note: true,
        items: itemsToInject,
      };

      const res = await injectActionItemsToWorkspace(payload);
      if (res && res.success) {
        setInjectionSuccess({
          message: res.message,
          createdTasksCount: res.created_tasks?.length || 0,
          createdEventsCount: res.created_events?.length || 0,
          noteCreated: !!res.note_id,
        });

        // Mark injected items in UI
        setMeetingIntelligence((prev) => ({
          ...prev,
          action_items: prev.action_items.map((it) =>
            selectedItemIds.has(it.id) ? { ...it, injected: true } : it
          ),
        }));
      }
    } catch (err) {
      console.error("Failed to inject action items:", err);
      alert("Failed to inject items into database. Please verify connection.");
    } finally {
      setIsInjecting(false);
    }
  };

  const formatTimer = (totalSeconds) => {
    const mins = Math.floor(totalSeconds / 60)
      .toString()
      .padStart(2, "0");
    const secs = (totalSeconds % 60).toString().padStart(2, "0");
    return `${mins}:${secs}`;
  };

  return (
    <div className="voiceAppContainer">
      {/* ================= TOP COMMAND BAR ================= */}
      <header className="voiceTopBar">
        <div className="voiceBrandGroup">
          <div className="voiceIconBox">
            <Mic size={20} />
          </div>
          <div className="voiceTitleCol">
            <div className="voiceHeading">
              Voice Meeting & Audio Brain
              <span className="voiceBadge">Whisper Intelligence</span>
            </div>
            <div className="voiceSubtitle">
              Ambient voice recorder, Whisper speech transcription & automated workspace injection
            </div>
          </div>
        </div>

        <div className="voiceTopActions">
          {sampleMeetings.length > 0 && (
            <button
              className="voiceSampleBtn"
              onClick={() => handleLoadSampleMeeting(sampleMeetings[0])}
              title="Instantly test speech transcription and action items"
            >
              <Sparkles size={14} color="#c084fc" />
              Load Sample Meeting
            </button>
          )}

          {onNavigateToTasks && (
            <button className="voiceSampleBtn" onClick={onNavigateToTasks}>
              <CheckSquare size={14} />
              Open Tasks
            </button>
          )}

          {onNavigateToCalendar && (
            <button className="voiceSampleBtn" onClick={onNavigateToCalendar}>
              <Calendar size={14} />
              Open Calendar
            </button>
          )}
        </div>
      </header>

      {/* ================= MAIN SPLIT WORKSPACE ================= */}
      <div className="voiceWorkspace">
        {/* ================= LEFT RECORDER PANE ================= */}
        <section className="voiceRecorderPane">
          {/* Recorder Stage Box */}
          <div className="voiceStudioBox">
            <div
              className={`voiceRecordingStatusBadge ${isRecording ? "recording" : ""}`}
            >
              <span className={`voiceRecordDot ${isRecording ? "live" : ""}`} />
              {isRecording
                ? "Microphone Engaged & Listening..."
                : recordedAudioBlob
                ? "Audio Ready for Transcription"
                : "Studio Idle — Press Mic to Record"}
            </div>

            {/* Timer Counter */}
            <div className="voiceTimerText">{formatTimer(recordingSeconds)}</div>

            {/* Waveform Visualizer Canvas */}
            <canvas
              ref={canvasRef}
              className="voiceWaveformCanvas"
              width={420}
              height={100}
            />

            {/* Controls Toolbar */}
            <div className="voiceControlButtons">
              {!isRecording ? (
                <button
                  className="voiceRecordToggleBtn"
                  onClick={startRecording}
                  title="Start live ambient recording"
                >
                  <Mic size={26} />
                </button>
              ) : (
                <button
                  className="voiceRecordToggleBtn isRecording"
                  onClick={stopRecording}
                  title="Stop recording"
                >
                  <Square size={24} />
                </button>
              )}

              {recordedAudioBlob && !isRecording && (
                <button
                  className="voiceRecordActionBtn"
                  onClick={() => handleTranscribeAndAnalyze()}
                  disabled={isProcessing}
                >
                  <Sparkles size={14} className={isProcessing ? "animate-spin" : ""} />
                  {isProcessing ? "Transcribing..." : "Transcribe & Extract"}
                </button>
              )}

              {recordedAudioBlob && !isRecording && (
                <button
                  className="voiceRecordActionBtn"
                  onClick={() => {
                    setRecordedAudioBlob(null);
                    setAudioUrl(null);
                    setRecordingSeconds(0);
                  }}
                  title="Reset recording"
                >
                  <RotateCcw size={14} />
                </button>
              )}
            </div>

            {/* In-Browser Audio Playback */}
            {audioUrl && (
              <div style={{ width: "100%", marginTop: "6px" }}>
                <audio
                  ref={audioPlayerRef}
                  src={audioUrl}
                  controls
                  style={{ width: "100%", height: "36px", borderRadius: "8px" }}
                  onPlay={() => setIsPlayingAudio(true)}
                  onPause={() => setIsPlayingAudio(false)}
                />
                {isPlayingAudio && (
                  <div style={{ fontSize: "11px", color: "#c084fc", textAlign: "center", marginTop: "4px" }}>
                    🔊 Playing Audio Stream...
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Audio File Upload Box */}
          <label className="voiceUploadBox">
            <Upload size={18} color="#94a3b8" style={{ margin: "0 auto", display: "block" }} />
            <div className="voiceUploadText">
              Or drop an audio recording (<strong>.webm, .wav, .mp3, .m4a</strong>)
            </div>
            <input
              type="file"
              accept="audio/*"
              style={{ display: "none" }}
              onChange={handleFileUpload}
            />
          </label>

          {/* Sample Meetings Preset Section */}
          <div style={{ marginTop: "6px" }}>
            <div className="voiceSampleSectionTitle">Preloaded Ambient Meetings</div>
            {sampleMeetings.map((sample) => (
              <div
                key={sample.id}
                className={`voiceSampleCard ${selectedSampleId === sample.id ? "selected" : ""}`}
                onClick={() => handleLoadSampleMeeting(sample)}
              >
                <div className="voiceSampleTitle">{sample.title}</div>
                <div className="voiceSampleMeta">
                  <span>⏱️ {sample.duration}</span>
                  <span>📅 {sample.date}</span>
                  <span style={{ color: "#a855f7" }}>{sample.action_items.length} Actions</span>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ================= RIGHT INTELLIGENCE PANE ================= */}
        <section className="voiceIntelligencePane">
          {/* Post-Injection Confirmation Toast */}
          {injectionSuccess && (
            <div className="voiceInjectedBanner">
              <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                <CheckCircle2 size={20} color="#10b981" />
                <div>
                  <strong>{injectionSuccess.message}</strong>
                  <div style={{ fontSize: "11.5px", color: "#a7f3d0", marginTop: "2px" }}>
                    Created {injectionSuccess.createdTasksCount} tasks in TasksApp,{" "}
                    {injectionSuccess.createdEventsCount} events in CalendarApp, and archived
                    meeting minutes in NotesApp.
                  </div>
                </div>
              </div>

              <div className="voiceInjectedActions">
                {onNavigateToTasks && (
                  <button className="voiceNavPill" onClick={onNavigateToTasks}>
                    <CheckSquare size={13} />
                    View Tasks
                  </button>
                )}
                {onNavigateToCalendar && (
                  <button className="voiceNavPill" onClick={onNavigateToCalendar}>
                    <Calendar size={13} />
                    View Calendar
                  </button>
                )}
              </div>
            </div>
          )}

          {isProcessing ? (
            <div className="voiceEmptyState">
              <Sparkles size={40} className="animate-spin" color="#a855f7" />
              <h3>Whisper Speech Engine Transcribing...</h3>
              <p>
                Synthesizing spoken audio into text, extracting high-priority decisions, and
                identifying actionable commitments for your workspace.
              </p>
            </div>
          ) : !meetingIntelligence ? (
            <div className="voiceEmptyState">
              <Mic size={48} style={{ opacity: 0.35, color: "#a855f7" }} />
              <h3>No Audio Analyzed Yet</h3>
              <p>
                Record your voice or ambient meeting notes using the microphone on the left,
                upload an audio file, or click <strong>"Load Sample Meeting"</strong> for an instant
                demonstration.
              </p>
            </div>
          ) : (
            <>
              {/* Meeting Intelligence Header */}
              <div className="voiceIntelHeaderBox">
                <div className="voiceIntelTitleRow">
                  <h2 className="voiceMeetingTitle">{meetingIntelligence.title}</h2>
                  <span className="voiceSentimentBadge">
                    {meetingIntelligence.sentiment || "Strategic & Productive"}
                  </span>
                </div>
                <p className="voiceIntelSummary">{meetingIntelligence.summary}</p>
              </div>

              {/* Key Bullet Points & Decisions */}
              <div className="voiceIntelBlock">
                <h4 className="voiceIntelBlockTitle">
                  <ListTodo size={16} color="#c084fc" />
                  Key Discussion Highlights & Decisions
                </h4>
                <ul className="voiceBulletList">
                  {(meetingIntelligence.key_points || []).map((point, idx) => (
                    <li key={idx}>{point}</li>
                  ))}
                </ul>
              </div>

              {/* ================= ACTION ITEMS SECTION ================= */}
              <div className="voiceActionSection">
                <div className="voiceActionHeader">
                  <div className="voiceActionTitleBlock">
                    <div className="voiceActionHeading">
                      <Sparkles size={16} color="#10b981" />
                      Identified Action Items ({meetingIntelligence.action_items?.length || 0})
                    </div>
                    <div className="voiceActionSub">
                      Auto-detected commitments ready for injection straight into TasksApp and
                      CalendarApp.
                    </div>
                  </div>

                  <button
                    className="voiceInjectAllBtn"
                    onClick={handleInjectActionItems}
                    disabled={isInjecting || selectedItemIds.size === 0}
                  >
                    <CheckCircle2 size={15} />
                    {isInjecting
                      ? "Injecting..."
                      : `⚡ Inject (${selectedItemIds.size}) into Workspace`}
                  </button>
                </div>

                {/* Action Items List */}
                <div className="voiceActionGrid">
                  {(meetingIntelligence.action_items || []).map((item) => {
                    const isSelected = selectedItemIds.has(item.id);
                    return (
                      <div
                        key={item.id}
                        className={`voiceActionCard ${item.injected ? "injected" : ""}`}
                      >
                        <div className="voiceActionLeft">
                          <input
                            type="checkbox"
                            className="voiceActionCheckbox"
                            checked={isSelected}
                            onChange={() => toggleItemSelection(item.id)}
                            title="Select for workspace injection"
                          />

                          <div className="voiceActionInfo">
                            <input
                              type="text"
                              className="voiceActionTitleInput"
                              value={item.title}
                              onChange={(e) => updateItemTitle(item.id, e.target.value)}
                            />

                            <div className="voiceActionMetaRow">
                              {/* Switch between Task or Calendar Event */}
                              <span
                                className={`voiceTargetTypeBadge ${item.type}`}
                                onClick={() =>
                                  updateItemType(
                                    item.id,
                                    item.type === "task" ? "calendar" : "task"
                                  )
                                }
                                title="Click to toggle destination (Task vs Calendar)"
                              >
                                {item.type === "calendar" ? (
                                  <>
                                    <Calendar size={11} /> Calendar Event
                                  </>
                                ) : (
                                  <>
                                    <CheckSquare size={11} /> Workspace Task
                                  </>
                                )}
                              </span>

                              <span
                                className={`voicePriorityTag ${item.priority || "Medium"}`}
                              >
                                {item.priority || "Medium"} Priority
                              </span>

                              {item.assignee && <span>👤 {item.assignee}</span>}
                              {item.injected && (
                                <span style={{ color: "#34d399", fontWeight: 700 }}>
                                  ✓ Injected in DB
                                </span>
                              )}
                            </div>
                          </div>
                        </div>

                        <div className="voiceActionRight">
                          {item.type === "calendar" && (
                            <input
                              type="date"
                              className="voiceDateInput"
                              value={item.due_date || ""}
                              onChange={(e) => {
                                const val = e.target.value;
                                setMeetingIntelligence((prev) => ({
                                  ...prev,
                                  action_items: prev.action_items.map((it) =>
                                    it.id === item.id ? { ...it, due_date: val } : it
                                  ),
                                }));
                              }}
                            />
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Full Raw Transcript Toggle */}
              {meetingIntelligence.raw_transcript && (
                <div style={{ marginTop: "4px" }}>
                  <button
                    onClick={() => setShowRawTranscript(!showRawTranscript)}
                    style={{
                      background: "transparent",
                      border: "none",
                      color: "#94a3b8",
                      fontSize: "12px",
                      cursor: "pointer",
                      display: "flex",
                      alignItems: "center",
                      gap: "6px",
                      padding: "4px 0",
                    }}
                  >
                    <FileText size={13} />
                    {showRawTranscript ? "Hide Raw Transcript" : "View Raw Speech Transcript"}
                    {showRawTranscript ? <ChevronUp size={13} /> : <ChevronDown size={13} />}
                  </button>

                  {showRawTranscript && (
                    <div className="voiceTranscriptBox">
                      {meetingIntelligence.raw_transcript}
                    </div>
                  )}
                </div>
              )}
            </>
          )}
        </section>
      </div>
    </div>
  );
}
