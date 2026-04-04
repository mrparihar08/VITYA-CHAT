import React, { useState } from "react";

const NotesApp = () => {
  const [note, setNote] = useState("");

  return (
    <div className="miniApp">
      <h3>Notes</h3>

      <textarea
        value={note}
        onChange={(e) => setNote(e.target.value)}
        placeholder="Write your note..."
        className="inputBox"
        rows={6}
      />

      <p className="mutedText" style={{ marginTop: 10 }}>
        Characters: {note.length}
      </p>
    </div>
  );
};

export default NotesApp;