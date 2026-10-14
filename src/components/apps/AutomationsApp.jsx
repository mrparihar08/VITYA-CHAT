import React, { useState, useEffect, useCallback } from "react";
import {
  Zap,
  Play,
  Plus,
  Clock,
  CheckCircle2,
  MessageSquare,
  CheckSquare,
  Calendar,
  FileText,
  Presentation,
  Layers,
  RefreshCw,
  TrendingDown,
  Activity,
} from "lucide-react";
import {
  getRoutines,
  createCustomRoutine,
  toggleRoutineActive,
  executeRoutineNow,
  getAutomationLogs,
} from "../../services/api";
import "./AutomationsApp.css";

const TRIGGER_TYPES = [
  { id: "expense_threshold", label: "Expense Threshold / Budget Exceeded", icon: TrendingDown },
  { id: "schedule", label: "Recurring Schedule / Time Cron", icon: Clock },
  { id: "dora_risk_assessment", label: "DORA Clinical High-Risk Detected", icon: Activity },
  { id: "receipt_scanned", label: "Receipt / Invoice Scanned", icon: FileText },
  { id: "task_completed", label: "Sprint / Task Completed", icon: CheckSquare },
];

const ACTION_TYPES = [
  { id: "chatbot_alert", label: "Send Warning Alert to Chatbot", icon: MessageSquare },
  { id: "create_task", label: "Create Action Task in TasksApp", icon: CheckSquare },
  { id: "create_calendar_event", label: "Create Appointment in CalendarApp", icon: Calendar },
  { id: "generate_presentation", label: "Compile Slide Deck in Presentation Studio", icon: Presentation },
  { id: "create_note", label: "Save Summary in NotesApp", icon: FileText },
];

export default function AutomationsApp({
  onNavigateToTasks,
  onNavigateToCalendar,
  onNavigateToPresentation,
  onNavigateToFinance,
}) {
  const [activeTab, setActiveTab] = useState("routines"); // 'routines' | 'logs'
  const [routines, setRoutines] = useState([]);
  const [loading, setLoading] = useState(true);
  const [executingRoutineId, setExecutingRoutineId] = useState(null);
  const [executionResult, setExecutionResult] = useState(null);
  
  // Execution Logs State
  const [logs, setLogs] = useState([]);
  const [loadingLogs, setLoadingLogs] = useState(false);

  // New Routine Modal State
  const [modalOpen, setModalOpen] = useState(false);
  const [newTitle, setNewTitle] = useState("");
  const [newDesc, setNewDesc] = useState("");
  const [newIcon, setNewIcon] = useState("⚡");
  const [newTriggerType, setNewTriggerType] = useState("expense_threshold");
  const [newTriggerParam, setNewTriggerParam] = useState("Dining expenses cross $500");
  const [selectedActionTypes, setSelectedActionTypes] = useState(["chatbot_alert", "create_task"]);

  // 1. Fetch Active Routines
  const loadRoutines = useCallback(async () => {
    try {
      setLoading(true);
      const res = await getRoutines();
      if (res && res.routines) {
        setRoutines(res.routines);
      }
    } catch (err) {
      console.warn("Could not load routines", err);
    } finally {
      setLoading(false);
    }
  }, []);

  const loadLogs = useCallback(async () => {
    try {
      setLoadingLogs(true);
      const res = await getAutomationLogs(30);
      if (res && res.logs) {
        setLogs(res.logs);
      }
    } catch (err) {
      console.warn("Could not load execution logs", err);
    } finally {
      setLoadingLogs(false);
    }
  }, []);

  useEffect(() => {
    loadRoutines();
  }, [loadRoutines]);

  // 2. Toggle Routine Active State
  const handleToggleActive = async (routineId) => {
    try {
      setRoutines((prev) =>
        prev.map((r) => (r.id === routineId ? { ...r, active: !r.active } : r))
      );
      await toggleRoutineActive(routineId);
    } catch (err) {
      console.error("Toggle routine failed", err);
    }
  };

  // 3. Execute / Test Routine
  const handleRunRoutine = async (routine) => {
    setExecutingRoutineId(routine.id);
    setExecutionResult(null);

    try {
      const res = await executeRoutineNow(routine.id);
      setExecutionResult({
        routineTitle: routine.title,
        message: res.message,
        actions: res.executed_actions,
      });

      // Update routine run count locally
      setRoutines((prev) =>
        prev.map((r) =>
          r.id === routine.id
            ? { ...r, last_run: "Just now", run_count: (r.run_count || 0) + 1 }
            : r
        )
      );
    } catch (err) {
      console.error("Routine execution failed", err);
      alert("Failed to execute routine. Please check database connectivity.");
    } finally {
      setExecutingRoutineId(null);
    }
  };

  // 4. Create Custom Routine
  const handleSaveCustomRoutine = async () => {
    if (!newTitle.trim()) {
      alert("Please provide a routine title.");
      return;
    }

    const payload = {
      title: newTitle,
      description: newDesc || `When ${newTriggerParam} → Trigger selected actions`,
      icon: newIcon,
      trigger: {
        type: newTriggerType,
        display: newTriggerParam,
      },
      actions: selectedActionTypes.map((actId) => {
        const found = ACTION_TYPES.find((a) => a.id === actId);
        return {
          type: actId,
          label: found ? found.label : actId,
          params: { message: `Automated action from ${newTitle}` },
        };
      }),
    };

    try {
      const created = await createCustomRoutine(payload);
      setRoutines((prev) => [...prev, created]);
      setModalOpen(false);
      setNewTitle("");
      setNewDesc("");
    } catch (err) {
      console.error("Failed to create routine", err);
    }
  };

  const getActionIcon = (type) => {
    switch (type) {
      case "chatbot_alert":
        return <MessageSquare size={13} />;
      case "create_task":
        return <CheckSquare size={13} />;
      case "create_calendar_event":
        return <Calendar size={13} />;
      case "generate_presentation":
        return <Presentation size={13} />;
      case "create_note":
        return <FileText size={13} />;
      default:
        return <Zap size={13} />;
    }
  };

  return (
    <div className="autoAppContainer">
      {/* ================= TOP COMMAND BAR ================= */}
      <header className="autoTopBar">
        <div className="autoBrandGroup">
          <div className="autoIconBox">
            <Zap size={20} />
          </div>
          <div className="autoTitleCol">
            <div className="autoHeading">
              Neural Automations & Mother Routines
              <span className="autoBadge">Autonomous AI-OS</span>
            </div>
            <div className="autoSubtitle">
              Event-driven cross-app triggers, autonomous task generation & scheduled synthesis
            </div>
          </div>
        </div>

        {/* Tab Controls */}
        <div className="autoModePills">
          <button
            className={`autoModePill ${activeTab === "routines" ? "active" : ""}`}
            onClick={() => setActiveTab("routines")}
          >
            <Layers size={14} />
            Active Routines ({routines.length})
          </button>
          <button
            className={`autoModePill ${activeTab === "logs" ? "active" : ""}`}
            onClick={() => {
              setActiveTab("logs");
              loadLogs();
            }}
          >
            <Clock size={14} />
            Execution Telemetry & Audit Logs
          </button>
        </div>

        {/* Top Actions */}
        <div className="autoHeaderActions">
          <button className="autoNewRoutineBtn" onClick={() => setModalOpen(true)}>
            <Plus size={14} />
            Build Neural Routine
          </button>
        </div>
      </header>

      {/* ================= TAB 1: ACTIVE ROUTINES LIST ================= */}
      {activeTab === "routines" && (
        <div className="autoWorkspaceScroll">
          {/* Execution Result Banner */}
          {executionResult && (
            <div className="autoExecutionToast">
              <CheckCircle2 size={20} color="#10b981" style={{ flexShrink: 0, marginTop: 2 }} />
              <div style={{ flex: 1 }}>
                <div className="autoExecutionToastTitle">
                  {executionResult.routineTitle} — Executed Successfully!
                </div>
                <div style={{ fontSize: "12.5px", color: "#cbd5e1", marginBottom: 6 }}>
                  {executionResult.message}
                </div>
                <ul className="autoExecutionToastDetails">
                  {executionResult.actions?.map((act, i) => (
                    <li key={i}>{act.details || act.action}</li>
                  ))}
                </ul>
              </div>
              <button
                onClick={() => setExecutionResult(null)}
                style={{ background: "transparent", border: "none", color: "#6ee7b7", cursor: "pointer" }}
              >
                ✕
              </button>
            </div>
          )}

          <div className="autoSectionHeader">
            <div className="autoSectionTitleBlock">
              <h3>Configured Neural Automation Pipelines</h3>
              <p>
                Routines monitor events across Finance, Health, Productivity, and Calendars, executing autonomous multi-app actions.
              </p>
            </div>
            <div style={{ display: "flex", gap: "8px" }}>
              {onNavigateToTasks && (
                <button
                  onClick={onNavigateToTasks}
                  style={{
                    background: "rgba(255,255,255,0.06)",
                    border: "1px solid rgba(255,255,255,0.12)",
                    borderRadius: "6px",
                    padding: "4px 10px",
                    color: "#cbd5e1",
                    fontSize: "11.5px",
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    gap: "4px",
                  }}
                >
                  <CheckSquare size={12} /> View Tasks
                </button>
              )}
              {onNavigateToCalendar && (
                <button
                  onClick={onNavigateToCalendar}
                  style={{
                    background: "rgba(255,255,255,0.06)",
                    border: "1px solid rgba(255,255,255,0.12)",
                    borderRadius: "6px",
                    padding: "4px 10px",
                    color: "#cbd5e1",
                    fontSize: "11.5px",
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    gap: "4px",
                  }}
                >
                  <Calendar size={12} /> View Calendar
                </button>
              )}
            </div>
          </div>

          {loading && routines.length === 0 ? (
            <div style={{ textAlign: "center", padding: "60px 20px", color: "#94a3b8" }}>
              <Zap size={32} className="animate-spin" style={{ marginBottom: 12, opacity: 0.6 }} />
              <div>Loading Neural Automation Pipelines...</div>
            </div>
          ) : (
            <div className="autoCardsList">
            {routines.map((routine) => (
              <div
                key={routine.id}
                className={`autoRoutineCard ${!routine.active ? "paused" : ""}`}
              >
                {/* Card Top Row */}
                <div className="autoCardTop">
                  <div className="autoCardLeft">
                    <div className="autoCardEmojiBox">{routine.icon || "⚡"}</div>
                    <div className="autoCardMeta">
                      <span className="autoCardTitle">{routine.title}</span>
                      <span className="autoCardDesc">{routine.description}</span>
                    </div>
                  </div>

                  <div className="autoCardControls">
                    {/* Run Now Trigger Button */}
                    <button
                      className="autoRunNowBtn"
                      onClick={() => handleRunRoutine(routine)}
                      disabled={executingRoutineId === routine.id}
                      title="Trigger and execute this routine immediately against the database"
                    >
                      <Play size={12} className={executingRoutineId === routine.id ? "animate-spin" : ""} />
                      {executingRoutineId === routine.id ? "Executing..." : "⚡ Run Now"}
                    </button>

                    {/* Active/Paused Switch */}
                    <label className="autoSwitch" title={routine.active ? "Routine is Active" : "Routine is Paused"}>
                      <input
                        type="checkbox"
                        checked={routine.active}
                        onChange={() => handleToggleActive(routine.id)}
                      />
                      <span className="autoSlider" />
                    </label>
                  </div>
                </div>

                {/* Visual Trigger-Action Pipeline */}
                <div className="autoFlowPipeline">
                  <div className="autoFlowPill trigger">
                    <Zap size={13} />
                    <span>{routine.trigger?.display || "Trigger Event"}</span>
                  </div>

                  <span className="autoFlowArrow">➔</span>

                  {routine.actions?.map((act, idx) => (
                    <React.Fragment key={idx}>
                      <div className="autoFlowPill action">
                        {getActionIcon(act.type)}
                        <span>{act.label || act.type}</span>
                      </div>
                      {idx < routine.actions.length - 1 && (
                        <span className="autoFlowArrow">➔</span>
                      )}
                    </React.Fragment>
                  ))}
                </div>

                {/* Footer Telemetry */}
                <div className="autoCardFooter">
                  <span>
                    Status: <strong style={{ color: routine.active ? "#34d399" : "#94a3b8" }}>{routine.active ? "Active & Listening" : "Paused"}</strong>
                  </span>
                  <span>Last Executed: {routine.last_run || "Never"}</span>
                  <span>Fired {routine.run_count || 0} times</span>
                </div>
              </div>
            ))}
          </div>
          )}
        </div>
      )}

      {/* ================= TAB 2: AUDIT LOGS ================= */}
      {activeTab === "logs" && (
        <div className="autoWorkspaceScroll">
          <div className="autoSectionHeader">
            <div className="autoSectionTitleBlock">
              <h3>Execution Audit Trail & Event Telemetry</h3>
              <p>Chronological verification of triggered events and cross-app database mutations.</p>
            </div>
            <button
              onClick={loadLogs}
              style={{
                background: "rgba(255,255,255,0.06)",
                border: "1px solid rgba(255,255,255,0.12)",
                borderRadius: "8px",
                padding: "6px 12px",
                color: "#cbd5e1",
                fontSize: "12px",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                gap: "6px",
              }}
            >
              <RefreshCw size={12} className={loadingLogs ? "animate-spin" : ""} />
              Refresh Telemetry
            </button>
          </div>

          <div className="autoLogsList">
            {logs.length === 0 ? (
              <div style={{ textAlign: "center", padding: "40px", color: "#64748b" }}>
                <Clock size={32} style={{ marginBottom: 10, opacity: 0.5 }} />
                <p>No execution logs yet. Click "⚡ Run Now" on any routine to test execution!</p>
              </div>
            ) : (
              logs.map((log) => (
                <div key={log.log_id} className="autoLogCard">
                  <div className="autoLogTop">
                    <span className="autoLogTitle">
                      <span>{log.icon}</span>
                      {log.routine_title}
                    </span>
                    <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                      <span className="autoLogTime">{log.timestamp}</span>
                      <span className="autoLogStatusBadge">{log.status}</span>
                    </div>
                  </div>
                  <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
                    {log.executed_actions?.map((act, i) => (
                      <div key={i} className="autoLogActionRow">
                        <CheckCircle2 size={13} color="#10b981" />
                        <span>{act.details || act.action}</span>
                      </div>
                    ))}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {/* ================= MODAL: VISUAL ROUTINE BUILDER ================= */}
      {modalOpen && (
        <div className="autoModalBackdrop" onClick={() => setModalOpen(false)}>
          <div className="autoModalBox" onClick={(e) => e.stopPropagation()}>
            <div className="autoModalHeader">
              <h3>Build New Neural Routine</h3>
              <button
                onClick={() => setModalOpen(false)}
                style={{ background: "transparent", border: "none", color: "#94a3b8", cursor: "pointer" }}
              >
                ✕
              </button>
            </div>

            <div className="autoModalBody">
              <div className="autoFormField">
                <label className="autoFormLabel">Routine Icon</label>
                <div style={{ display: "flex", gap: "8px" }}>
                  {["⚡", "🔔", "📊", "🩺", "💡", "🎯", "🚀"].map((ic) => (
                    <button
                      key={ic}
                      type="button"
                      onClick={() => setNewIcon(ic)}
                      style={{
                        fontSize: "18px",
                        padding: "6px 12px",
                        background: newIcon === ic ? "rgba(139, 92, 246, 0.3)" : "rgba(255,255,255,0.05)",
                        border: `1px solid ${newIcon === ic ? "#a78bfa" : "rgba(255,255,255,0.1)"}`,
                        borderRadius: "8px",
                        cursor: "pointer",
                      }}
                    >
                      {ic}
                    </button>
                  ))}
                </div>
              </div>

              <div className="autoFormField">
                <label className="autoFormLabel">Routine Title</label>
                <input
                  type="text"
                  className="autoFormInput"
                  placeholder="e.g. High Grocery Alert & Weekly Review"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                />
              </div>

              <div className="autoFormField">
                <label className="autoFormLabel">Description</label>
                <input
                  type="text"
                  className="autoFormInput"
                  placeholder="Summary of trigger and actions"
                  value={newDesc}
                  onChange={(e) => setNewDesc(e.target.value)}
                />
              </div>

              <div className="autoFormField">
                <label className="autoFormLabel">Trigger Type</label>
                <select
                  className="autoFormInput"
                  value={newTriggerType}
                  onChange={(e) => setNewTriggerType(e.target.value)}
                >
                  {TRIGGER_TYPES.map((t) => (
                    <option key={t.id} value={t.id} style={{ background: "#0f172a" }}>
                      {t.label}
                    </option>
                  ))}
                </select>
              </div>

              <div className="autoFormField">
                <label className="autoFormLabel">Trigger Condition / Threshold</label>
                <input
                  type="text"
                  className="autoFormInput"
                  placeholder="e.g. Dining expenses cross $500, or Every Friday 6 PM"
                  value={newTriggerParam}
                  onChange={(e) => setNewTriggerParam(e.target.value)}
                />
              </div>

              <div className="autoFormField">
                <label className="autoFormLabel">Select Actions to Execute (Multi-select)</label>
                <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
                  {ACTION_TYPES.map((act) => {
                    const isChecked = selectedActionTypes.includes(act.id);
                    return (
                      <label
                        key={act.id}
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: "8px",
                          padding: "8px 12px",
                          background: isChecked ? "rgba(139, 92, 246, 0.15)" : "rgba(255,255,255,0.03)",
                          border: `1px solid ${isChecked ? "rgba(139, 92, 246, 0.4)" : "rgba(255,255,255,0.07)"}`,
                          borderRadius: "8px",
                          cursor: "pointer",
                          fontSize: "13px",
                          color: isChecked ? "#f1f5f9" : "#94a3b8",
                        }}
                      >
                        <input
                          type="checkbox"
                          checked={isChecked}
                          onChange={() => {
                            if (isChecked) {
                              setSelectedActionTypes(selectedActionTypes.filter((x) => x !== act.id));
                            } else {
                              setSelectedActionTypes([...selectedActionTypes, act.id]);
                            }
                          }}
                          style={{ accentColor: "#8b5cf6" }}
                        />
                        {act.label}
                      </label>
                    );
                  })}
                </div>
              </div>
            </div>

            <div className="autoModalFooter">
              <button className="autoCancelBtn" onClick={() => setModalOpen(false)}>
                Cancel
              </button>
              <button className="autoSaveBtn" onClick={handleSaveCustomRoutine}>
                Create Routine
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
