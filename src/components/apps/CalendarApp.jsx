import React, { useState } from "react";

const CalendarApp = () => {
  const [date, setDate] = useState("");
  const [event, setEvent] = useState("");
  const [events, setEvents] = useState([]);

  const addEvent = () => {
    if (!date || !event.trim()) return;
    setEvents([...events, { date, event }]);
    setDate("");
    setEvent("");
  };

  return (
    <div className="miniApp">
      <h3>Calendar</h3>

      <input
        type="date"
        className="inputBox"
        value={date}
        onChange={(e) => setDate(e.target.value)}
      />

      <input
        type="text"
        className="inputBox"
        placeholder="Event title..."
        value={event}
        onChange={(e) => setEvent(e.target.value)}
      />

      <button className="smallBtn" onClick={addEvent}>
        Add Event
      </button>

      <div className="listBox">
        {events.length === 0 ? (
          <p className="mutedText">No events added yet.</p>
        ) : (
          events.map((item, index) => (
            <div key={index} className="listItem">
              <strong>{item.date}</strong> — {item.event}
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default CalendarApp;