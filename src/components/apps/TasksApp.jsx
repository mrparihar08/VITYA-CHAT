import React, { useEffect, useState } from "react";

const API_URL = process.env.REACT_APP_API_URL || "https://mother-8599.onrender.com";
const API_BASE = `${API_URL}/api`;

const TasksApp = () => {
  const [task, setTask] = useState("");
  const [tasks, setTasks] = useState([]);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const [editingId, setEditingId] = useState(null);
  const [editText, setEditText] = useState("");

  const fetchTasks = async () => {
    try {
      const res = await fetch(`${API_BASE}/tasks/`);
      const data = await res.json();
      setTasks(data);
    } catch (err) {
      setMessage("Failed to load tasks");
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  const addTask = async () => {
    if (!task.trim()) {
      setMessage("Task cannot be empty");
      return;
    }

    setLoading(true);
    setMessage("");

    try {
      const res = await fetch(`${API_BASE}/tasks/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ title: task }),
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.detail || "Failed to add task");
      }

      setTask("");
      setMessage("Task added successfully");
      fetchTasks();
    } catch (err) {
      setMessage(err.message);
    } finally {
      setLoading(false);
    }
  };

  const removeTask = async (id) => {
    try {
      const res = await fetch(`${API_BASE}/tasks/${id}`, {
        method: "DELETE",
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.detail || "Failed to delete task");
      }

      setMessage("Task deleted successfully");
      fetchTasks();
    } catch (err) {
      setMessage(err.message);
    }
  };

  const startEdit = (item) => {
    setEditingId(item.id);
    setEditText(item.title);
    setMessage("");
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditText("");
  };

  const updateTask = async (id) => {
    if (!editText.trim()) {
      setMessage("Task cannot be empty");
      return;
    }

    setLoading(true);
    setMessage("");

    try {
      const res = await fetch(`${API_BASE}/tasks/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ title: editText }),
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.detail || "Failed to update task");
      }

      setEditingId(null);
      setEditText("");
      setMessage("Task updated successfully");
      fetchTasks();
    } catch (err) {
      setMessage(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="miniApp">
      <h3>Tasks</h3>

      <div className="taskRow">
        <input
          value={task}
          onChange={(e) => setTask(e.target.value)}
          placeholder="New task..."
          className="inputBox"
        />
        <button className="smallBtn" onClick={addTask} disabled={loading}>
          {loading ? "Adding..." : "Add"}
        </button>
      </div>

      {message && <p className="mutedText" style={{ marginTop: 10 }}>{message}</p>}

      <div className="listBox">
        {tasks.length === 0 ? (
          <p className="mutedText">No tasks yet.</p>
        ) : (
          tasks.map((item) => (
            <div key={item.id} className="listItem taskItem">
              {editingId === item.id ? (
                <div style={{ width: "100%" }}>
                  <input
                    value={editText}
                    onChange={(e) => setEditText(e.target.value)}
                    className="inputBox"
                    style={{ width: "100%" }}
                  />
                  <div style={{ display: "flex", gap: 8, marginTop: 8 }}>
                    <button
                      className="smallBtn"
                      onClick={() => updateTask(item.id)}
                      disabled={loading}
                    >
                      {loading ? "Updating..." : "Update"}
                    </button>
                    <button className="smallBtn" onClick={cancelEdit}>
                      Cancel
                    </button>
                  </div>
                </div>
              ) : (
                <>
                  <span>{item.title}</span>
                  <div style={{ display: "flex", gap: 8 }}>
                    <button className="smallBtn" onClick={() => startEdit(item)}>
                      Edit
                    </button>
                    <button className="deleteBtn" onClick={() => removeTask(item.id)}>
                      ×
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

export default TasksApp;