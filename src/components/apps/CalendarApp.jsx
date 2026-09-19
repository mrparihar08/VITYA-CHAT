import React, { useCallback, useEffect, useState } from "react";
import { api, handleApiError } from "../../services/api";

const CalendarApp = () => {
  const [date, setDate] = useState("");
  const [event, setEvent] = useState("");
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(false);
  const [message, setMessage] = useState("");

  const getToken = () => localStorage.getItem("token");

  // =========================
  // FETCH EVENTS
  // =========================
  const fetchEvents = useCallback(async () => {
    const token = getToken();
    if (!token) {
      // Offline / unauthenticated fallback
      try {
        const raw = localStorage.getItem("vitya_calendar_events");
        setEvents(raw ? JSON.parse(raw) : []);
      } catch {
        setEvents([]);
      }
      return;
    }

    setFetching(true);
    try {
      const res = await api.get("/api/calendar/");
      if (Array.isArray(res.data)) {
        setEvents(res.data);
      } else {
        setEvents([]);
      }
      setMessage("");
    } catch (err) {
      setMessage(handleApiError(err) || "Failed to load calendar events");
    } finally {
      setFetching(false);
    }
  }, []);

  useEffect(() => {
    fetchEvents();
  }, [fetchEvents]);

  // =========================
  // ADD EVENT
  // =========================
  const addEvent = async () => {
    if (!date || !event.trim()) {
      setMessage("Please select a date and enter an event title");
      return;
    }

    const token = getToken();
    if (!token) {
      const newLocal = [...events, { id: Date.now(), date, title: event.trim() }];
      setEvents(newLocal);
      localStorage.setItem("vitya_calendar_events", JSON.stringify(newLocal));
      setDate("");
      setEvent("");
      setMessage("Event saved locally (login to sync with cloud)");
      return;
    }

    setLoading(true);
    setMessage("");

    try {
      await api.post("/api/calendar/", {
        title: event.trim(),
        date: date,
      });

      setDate("");
      setEvent("");
      setMessage("Event added successfully to workspace calendar!");
      await fetchEvents();
    } catch (err) {
      setMessage(handleApiError(err) || "Failed to add event");
    } finally {
      setLoading(false);
    }
  };

  // =========================
  // DELETE EVENT
  // =========================
  const deleteEvent = async (id) => {
    const token = getToken();
    if (!token) {
      const newLocal = events.filter((e) => e.id !== id);
      setEvents(newLocal);
      localStorage.setItem("vitya_calendar_events", JSON.stringify(newLocal));
      return;
    }

    try {
      await api.delete(`/api/calendar/${id}`);
      setEvents((prev) => prev.filter((e) => e.id !== id));
      setMessage("Event deleted");
    } catch (err) {
      setMessage(handleApiError(err) || "Failed to delete event");
    }
  };

  return (
    <div className="miniApp">
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
        <h3 style={{ margin: 0 }}>📅 Workspace Calendar & Events</h3>
      </div>

      <p className="mutedText" style={{ marginTop: 0, marginBottom: 12 }}>
        Schedule deadlines, meetings, and project milestones synced with your MOTHER account.
      </p>

      <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 12 }}>
        <input
          type="date"
          className="inputBox"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          style={{ width: "auto", minWidth: 150 }}
        />

        <input
          type="text"
          className="inputBox"
          placeholder="Event or meeting title..."
          value={event}
          onChange={(e) => setEvent(e.target.value)}
          style={{ flex: 1, minWidth: 200 }}
          onKeyDown={(e) => {
            if (e.key === "Enter") addEvent();
          }}
        />

        <button className="smallBtn" onClick={addEvent} disabled={loading}>
          {loading ? "Adding..." : "Add Event"}
        </button>
      </div>

      {message && (
        <p
          style={{
            fontSize: 13,
            color: message.toLowerCase().includes("failed") || message.toLowerCase().includes("error") ? "#ef4444" : "#10b981",
            marginTop: 4,
            marginBottom: 12,
          }}
        >
          {message}
        </p>
      )}

      <div className="listBox" style={{ marginTop: 12 }}>
        {fetching ? (
          <p className="mutedText">Loading calendar events...</p>
        ) : events.length === 0 ? (
          <p className="mutedText">No events scheduled yet. Add one above.</p>
        ) : (
          events.map((item) => (
            <div
              key={item.id}
              className="listItem"
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                padding: "8px 12px",
                marginBottom: 8,
              }}
            >
              <div>
                <strong style={{ color: "var(--accent, #8b5cf6)" }}>{item.date}</strong>
                <span style={{ marginLeft: 8 }}>{item.title || item.event}</span>
                {item.time && (
                  <span style={{ marginLeft: 8, fontSize: 12, color: "var(--text-muted, #888)" }}>
                    ⏰ {item.time}
                  </span>
                )}
              </div>
              <button
                className="deleteBtn"
                onClick={() => deleteEvent(item.id)}
                title="Delete event"
                style={{ marginLeft: 8 }}
              >
                ×
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default CalendarApp;