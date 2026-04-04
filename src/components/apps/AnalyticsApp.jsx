import React from "react";

const AnalyticsApp = ({ notesCount = 0, tasksCount = 0, chatsCount = 0 }) => {
  const stats = [
    { label: "Chats", value: chatsCount, icon: "💬" },
    { label: "Tasks", value: tasksCount, icon: "✅" },
    { label: "Notes", value: notesCount, icon: "📝" },
  ];

  return (
    <div className="miniApp">
      <h3>Analytics</h3>

      <div className="appsGrid">
        {stats.map((item) => (
          <div key={item.label} className="appCard">
            <span className="appIcon">{item.icon}</span>
            <div>
              <h3 style={{ margin: 0 }}>{item.value}</h3>
              <p style={{ margin: "4px 0 0", opacity: 0.75 }}>{item.label}</p>
            </div>
          </div>
        ))}
      </div>

      <p className="mutedText" style={{ marginTop: 12 }}>
        This can later show real charts and activity data.
      </p>
    </div>
  );
};

export default AnalyticsApp;