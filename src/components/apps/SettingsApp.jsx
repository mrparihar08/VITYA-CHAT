import React, { useState } from "react";

const SettingsApp = () => {
  const [darkMode, setDarkMode] = useState(true);
  const [notifications, setNotifications] = useState(true);

  return (
    <div className="miniApp">
      <h3>Settings</h3>

      <label className="toggleRow">
        <input
          type="checkbox"
          checked={darkMode}
          onChange={(e) => setDarkMode(e.target.checked)}
        />
        <span>Dark Mode</span>
      </label>

      <label className="toggleRow">
        <input
          type="checkbox"
          checked={notifications}
          onChange={(e) => setNotifications(e.target.checked)}
        />
        <span>Notifications</span>
      </label>

      <div className="listBox" style={{ marginTop: 14 }}>
        <div className="listItem">Theme: {darkMode ? "Dark" : "Light"}</div>
        <div className="listItem">
          Notifications: {notifications ? "On" : "Off"}
        </div>
      </div>
    </div>
  );
};

export default SettingsApp;