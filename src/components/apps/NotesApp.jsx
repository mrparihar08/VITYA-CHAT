import React, { useEffect, useState } from "react";

const API_URL = process.env.REACT_APP_API_URL || "https://mother-8599.onrender.com";
const API_BASE = `${API_URL}/api`;
const NotesApp = () => {
  const [note, setNote] = useState("");
  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const [editingId, setEditingId] = useState(null);
  const [editText, setEditText] = useState("");

  const fetchNotes = async () => {
    try {
      const res = await fetch(`${API_BASE}/notes/`);
      const data = await res.json();
      setNotes(data);
    } catch (err) {
      setMessage("Failed to load notes");
    }
  };

  useEffect(() => {
    fetchNotes();
  }, []);

  const handleSave = async () => {
    if (!note.trim()) {
      setMessage("Note cannot be empty");
      return;
    }

    setLoading(true);
    setMessage("");

    try {
      const res = await fetch(`${API_BASE}/notes/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ content: note }),
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.detail || "Something went wrong");
      }

      setNote("");
      setMessage("Note saved successfully");
      fetchNotes();
    } catch (err) {
      setMessage(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    try {
      const res = await fetch(`${API_BASE}/notes/${id}`, {
        method: "DELETE",
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.detail || "Failed to delete note");
      }

      setMessage("Note deleted");
      fetchNotes();
    } catch (err) {
      setMessage(err.message);
    }
  };

  const startEdit = (item) => {
    setEditingId(item.id);
    setEditText(item.content);
    setMessage("");
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditText("");
  };

  const handleUpdate = async (id) => {
    if (!editText.trim()) {
      setMessage("Note cannot be empty");
      return;
    }

    setLoading(true);
    setMessage("");

    try {
      const res = await fetch(`${API_BASE}/notes/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ content: editText }),
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.detail || "Failed to update note");
      }

      setEditingId(null);
      setEditText("");
      setMessage("Note updated successfully");
      fetchNotes();
    } catch (err) {
      setMessage(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="miniApp"
      style={{ maxWidth: 700, margin: "0 auto", padding: 20 }}
    >
      <h3>Notes</h3>

      <textarea
        value={note}
        onChange={(e) => setNote(e.target.value)}
        placeholder="Write your note..."
        className="inputBox"
        rows={6}
        style={{
          width: "100%",
          padding: 12,
          borderRadius: 8,
          border: "1px solid #ccc",
          resize: "vertical",
        }}
      />

      <p className="mutedText" style={{ marginTop: 10 }}>
        Characters: {note.length}
      </p>

      <button
        onClick={handleSave}
        disabled={loading}
        style={{
          marginTop: 10,
          padding: "10px 16px",
          border: "none",
          borderRadius: 8,
          background: "#2563eb",
          color: "white",
          cursor: "pointer",
        }}
      >
        {loading ? "Saving..." : "Save Note"}
      </button>

      {message && <p style={{ marginTop: 12, color: "#444" }}>{message}</p>}

      <div style={{ marginTop: 24 }}>
        <h4>Saved Notes</h4>

        {notes.length === 0 ? (
          <p className="mutedText">No notes yet.</p>
        ) : (
          notes.map((item) => (
            <div
              key={item.id}
              style={{
                border: "1px solid #e5e7eb",
                borderRadius: 10,
                padding: 12,
                marginBottom: 12,
              }}
            >
              {editingId === item.id ? (
                <>
                  <textarea
                    value={editText}
                    onChange={(e) => setEditText(e.target.value)}
                    rows={4}
                    style={{
                      width: "100%",
                      padding: 10,
                      borderRadius: 8,
                      border: "1px solid #ccc",
                      resize: "vertical",
                    }}
                  />

                  <div style={{ marginTop: 10, display: "flex", gap: 8 }}>
                    <button
                      onClick={() => handleUpdate(item.id)}
                      disabled={loading}
                      style={{
                        padding: "6px 12px",
                        border: "none",
                        borderRadius: 6,
                        background: "#16a34a",
                        color: "white",
                        cursor: "pointer",
                      }}
                    >
                      {loading ? "Updating..." : "Update"}
                    </button>

                    <button
                      onClick={cancelEdit}
                      style={{
                        padding: "6px 12px",
                        border: "none",
                        borderRadius: 6,
                        background: "#6b7280",
                        color: "white",
                        cursor: "pointer",
                      }}
                    >
                      Cancel
                    </button>
                  </div>
                </>
              ) : (
                <>
                  <p style={{ margin: 0, whiteSpace: "pre-wrap" }}>
                    {item.content}
                  </p>
                  <small style={{ color: "#666" }}>
                    {new Date(item.created_at).toLocaleString()}
                  </small>

                  <div style={{ marginTop: 8, display: "flex", gap: 8 }}>
                    <button
                      onClick={() => startEdit(item)}
                      style={{
                        padding: "6px 12px",
                        border: "none",
                        borderRadius: 6,
                        background: "#f59e0b",
                        color: "white",
                        cursor: "pointer",
                      }}
                    >
                      Edit
                    </button>

                    <button
                      onClick={() => handleDelete(item.id)}
                      style={{
                        padding: "6px 12px",
                        border: "none",
                        borderRadius: 6,
                        background: "#dc2626",
                        color: "white",
                        cursor: "pointer",
                      }}
                    >
                      Delete
                    </button>
                  </div>
                </>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default NotesApp;