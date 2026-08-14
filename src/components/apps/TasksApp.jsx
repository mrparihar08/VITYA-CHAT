import React, { useCallback, useEffect, useState } from "react";
import { api, handleApiError } from "../../services/api";

const TasksApp = () => {
  const [task, setTask] = useState("");
  const [tasks, setTasks] = useState([]);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const [editingId, setEditingId] = useState(null);
  const [editText, setEditText] = useState("");

  const getToken = () => localStorage.getItem("token");

  // =========================
  // FETCH TASKS
  // =========================
  const fetchTasks = useCallback(async () => {
    try {
      const token = getToken();
      if (!token) {
        setMessage("Please login first");
        return;
      }

      const res = await api.get("/api/tasks/");
      setTasks(res.data);
      setMessage("");
    } catch (err) {
      setMessage(handleApiError(err) || "Failed to load tasks");
    }
  }, []);

  // =========================
  // LOAD TASKS
  // =========================
  useEffect(() => {
    fetchTasks();
  }, [fetchTasks]);

  // =========================
  // ADD TASK
  // =========================
  const addTask = async () => {
    if (!task.trim()) {
      setMessage("Task cannot be empty");
      return;
    }

    if (!getToken()) {
      setMessage("Please login first");
      return;
    }

    setLoading(true);
    setMessage("");

    try {
      await api.post("/api/tasks/", {
        title: task.trim(),
      });

      setTask("");
      setMessage("Task added successfully");
      await fetchTasks();
    } catch (err) {
      setMessage(handleApiError(err) || "Failed to add task");
    } finally {
      setLoading(false);
    }
  };

  // =========================
  // DELETE TASK
  // =========================
  const removeTask = async (id) => {
    if (!getToken()) {
      setMessage("Please login first");
      return;
    }

    try {
      await api.delete(`/api/tasks/${id}`);
      setMessage("Task deleted successfully");
      await fetchTasks();
    } catch (err) {
      setMessage(handleApiError(err) || "Failed to delete task");
    }
  };

  // =========================
  // START EDIT
  // =========================
  const startEdit = (item) => {
    setEditingId(item.id);
    setEditText(item.title);
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
  // UPDATE TASK
  // =========================
  const updateTask = async (id) => {
    if (!editText.trim()) {
      setMessage("Task cannot be empty");
      return;
    }

    if (!getToken()) {
      setMessage("Please login first");
      return;
    }

    setLoading(true);
    setMessage("");

    try {
      await api.put(`/api/tasks/${id}`, {
        title: editText.trim(),
      });

      setEditingId(null);
      setEditText("");
      setMessage("Task updated successfully");
      await fetchTasks();
    } catch (err) {
      setMessage(handleApiError(err) || "Failed to update task");
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
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              addTask();
            }
          }}
          placeholder="New task..."
          className="inputBox"
        />

        <button
          className="smallBtn"
          onClick={addTask}
          disabled={loading}
        >
          {loading ? "Adding..." : "Add"}
        </button>
      </div>

      {message && (
        <p
          className="mutedText"
          style={{ marginTop: 10 }}
        >
          {message}
        </p>
      )}

      <div className="listBox">
        {tasks.length === 0 ? (
          <p className="mutedText">
            No tasks yet.
          </p>
        ) : (
          tasks.map((item) => (
            <div
              key={item.id}
              className="listItem taskItem"
            >
              {editingId === item.id ? (
                <div style={{ width: "100%" }}>
                  <input
                    value={editText}
                    onChange={(e) =>
                      setEditText(e.target.value)
                    }
                    className="inputBox"
                    style={{ width: "100%" }}
                    autoFocus
                  />

                  <div
                    style={{
                      display: "flex",
                      gap: 8,
                      marginTop: 8,
                    }}
                  >
                    <button
                      className="smallBtn"
                      onClick={() =>
                        updateTask(item.id)
                      }
                      disabled={loading}
                    >
                      {loading ? "Updating..." : "Update"}
                    </button>

                    <button
                      className="smallBtn"
                      onClick={cancelEdit}
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              ) : (
                <>
                  <span>{item.title}</span>

                  <div
                    style={{
                      display: "flex",
                      gap: 8,
                    }}
                  >
                    <button
                      className="smallBtn"
                      onClick={() =>
                        startEdit(item)
                      }
                    >
                      Edit
                    </button>

                    <button
                      className="deleteBtn"
                      onClick={() =>
                        removeTask(item.id)
                      }
                    >
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