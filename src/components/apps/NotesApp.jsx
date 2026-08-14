import React, { useCallback, useEffect, useState } from "react";
import { api, handleApiError } from "../../services/api";

const NotesApp = () => {
  const [note, setNote] = useState("");
  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const [editingId, setEditingId] = useState(null);
  const [editText, setEditText] = useState("");

  const getToken = () => localStorage.getItem("token");

  // =========================
  // FETCH NOTES
  // =========================
  const fetchNotes = useCallback(async () => {
    try {
      const token = getToken();
      if (!token) {
        setMessage("Please login first");
        return;
      }

      const res = await api.get("/api/notes/");
      setNotes(res.data);
      setMessage("");
    } catch (err) {
      setMessage(handleApiError(err) || "Failed to load notes");
    }
  }, []);

  // =========================
  // LOAD NOTES
  // =========================
  useEffect(() => {
    fetchNotes();
  }, [fetchNotes]);

  // =========================
  // SAVE NOTE
  // =========================
  const handleSave = async () => {
    if (!note.trim()) {
      setMessage("Note cannot be empty");
      return;
    }

    if (!getToken()) {
      setMessage("Please login first");
      return;
    }

    setLoading(true);
    setMessage("");

    try {
      await api.post("/api/notes/", {
        content: note.trim(),
      });

      setNote("");
      setMessage("Note saved successfully");
      await fetchNotes();
    } catch (err) {
      setMessage(handleApiError(err) || "Failed to save note");
    } finally {
      setLoading(false);
    }
  };

  // =========================
  // DELETE NOTE
  // =========================
  const handleDelete = async (id) => {
    if (!getToken()) {
      setMessage("Please login first");
      return;
    }

    try {
      await api.delete(`/api/notes/${id}`);
      setMessage("Note deleted");
      await fetchNotes();
    } catch (err) {
      setMessage(handleApiError(err) || "Failed to delete note");
    }
  };

  // =========================
  // START EDIT
  // =========================
  const startEdit = (item) => {
    setEditingId(item.id);
    setEditText(item.content);
    setMessage("");
  };

  // =========================
  // CANCEL EDIT
  // =========================
  const cancelEdit = () => {
    setEditingId(null);
    setEditText("");
  };

  // =========================
  // UPDATE NOTE
  // =========================
  const handleUpdate = async (id) => {
    if (!editText.trim()) {
      setMessage("Note cannot be empty");
      return;
    }

    if (!getToken()) {
      setMessage("Please login first");
      return;
    }

    setLoading(true);
    setMessage("");

    try {
      await api.put(`/api/notes/${id}`, {
        content: editText.trim(),
      });

      setEditingId(null);
      setEditText("");
      setMessage("Note updated successfully");
      await fetchNotes();
    } catch (err) {
      setMessage(handleApiError(err) || "Failed to update note");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="miniApp"
      style={{
        maxWidth: 700,
        margin: "0 auto",
        padding: 20,
      }}
    >
      <h3>Notes</h3>

      {/* =========================
          NEW NOTE
      ========================= */}

      <textarea
        value={note}
        onChange={(e) => setNote(e.target.value)}
        onKeyDown={(e) => {
          if (e.ctrlKey && e.key === "Enter") {
            handleSave();
          }
        }}
        placeholder="Write your note..."
        className="inputBox"
        rows={6}
        style={{
          width: "100%",
          padding: 12,
          borderRadius: 8,
          border: "1px solid #ccc",
          resize: "vertical",
          boxSizing: "border-box",
        }}
      />

      <p
        className="mutedText"
        style={{ marginTop: 10 }}
      >
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
          cursor: loading
            ? "not-allowed"
            : "pointer",
        }}
      >
        {loading ? "Saving..." : "Save Note"}
      </button>

      {/* =========================
          MESSAGE
      ========================= */}

      {message && (
        <p
          style={{
            marginTop: 12,
          }}
        >
          {message}
        </p>
      )}

      {/* =========================
          SAVED NOTES
      ========================= */}

      <div style={{ marginTop: 24 }}>
        <h4>Saved Notes</h4>

        {notes.length === 0 ? (
          <p className="mutedText">
            No notes yet.
          </p>
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
                // =========================
                // EDIT MODE
                // =========================

                <>
                  <textarea
                    value={editText}
                    onChange={(e) =>
                      setEditText(e.target.value)
                    }
                    rows={4}
                    autoFocus
                    className="inputBox"
                    style={{
                      width: "100%",
                      padding: 10,
                      borderRadius: 8,
                      border: "1px solid #ccc",
                      resize: "vertical",
                      boxSizing: "border-box",
                    }}
                  />

                  <div
                    style={{
                      marginTop: 10,
                      display: "flex",
                      gap: 8,
                    }}
                  >
                    <button
                      onClick={() =>
                        handleUpdate(item.id)
                      }
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
                      {loading
                        ? "Updating..."
                        : "Update"}
                    </button>

                    <button
                      onClick={cancelEdit}
                      disabled={loading}
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
                // =========================
                // NORMAL MODE
                // =========================

                <>
                  <p
                    style={{
                      margin: 0,
                      whiteSpace: "pre-wrap",
                    }}
                  >
                    {item.content}
                  </p>

                  {item.created_at && (
                    <small
                      style={{
                        color: "#666",
                      }}
                    >
                      {new Date(
                        item.created_at
                      ).toLocaleString()}
                    </small>
                  )}

                  <div
                    style={{
                      marginTop: 8,
                      display: "flex",
                      gap: 8,
                    }}
                  >
                    <button
                      onClick={() =>
                        startEdit(item)
                      }
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
                      onClick={() =>
                        handleDelete(item.id)
                      }
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