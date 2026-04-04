import React, { useState } from "react";

const TasksApp = () => {
  const [task, setTask] = useState("");
  const [tasks, setTasks] = useState([]);

  const addTask = () => {
    if (!task.trim()) return;
    setTasks([...tasks, task.trim()]);
    setTask("");
  };

  const removeTask = (indexToRemove) => {
    setTasks(tasks.filter((_, index) => index !== indexToRemove));
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
        <button className="smallBtn" onClick={addTask}>
          Add
        </button>
      </div>

      <div className="listBox">
        {tasks.length === 0 ? (
          <p className="mutedText">No tasks yet.</p>
        ) : (
          tasks.map((item, index) => (
            <div key={index} className="listItem taskItem">
              <span>{item}</span>
              <button className="deleteBtn" onClick={() => removeTask(index)}>
                ×
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default TasksApp;