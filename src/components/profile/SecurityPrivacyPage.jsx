import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  PageShell,
  Input,
  Button,
  PasswordField,
  FieldLabel,
  styles,
} from "../auth/AuthCommon";

export function SecurityPrivacyPage() {
  const navigate = useNavigate();
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(false);
  const [savingPassword, setSavingPassword] = useState(false);

  const handlePasswordSubmit = (e) => {
    e.preventDefault();
    if (!currentPassword || !newPassword || !confirmPassword) {
      alert("Please fill in all password fields.");
      return;
    }
    if (newPassword !== confirmPassword) {
      alert("New password and confirm password do not match.");
      return;
    }
    if (newPassword.length < 6) {
      alert("Password must be at least 6 characters long.");
      return;
    }

    setSavingPassword(true);
    setTimeout(() => {
      alert("Password updated successfully!");
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
      setSavingPassword(false);
    }, 800);
  };

  return (
    <PageShell
      title="Security & Privacy"
      subtitle="Manage your password, authentication, and data privacy."
      wide
    >
      <div style={{ display: "grid", gap: 20 }}>
        <Button
          type="button"
          variant="secondary"
          onClick={() => navigate("/profile")}
          style={{ width: "fit-content" }}
        >
          ← Back to Profile
        </Button>

        {/* CHANGE PASSWORD */}
        <div style={styles.profileMain}>
          <h3 style={styles.mainHeading}>🔐 Change Password</h3>
          <p style={styles.mainSubheading}>
            Update your password regularly to keep your Vitya.AI account secure.
          </p>

          <form onSubmit={handlePasswordSubmit} style={{ marginTop: 16, display: "grid", gap: 14 }}>
            <FieldLabel label="Current Password">
              <PasswordField
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                placeholder="Enter current password"
                show={showCurrent}
                toggleShow={() => setShowCurrent(!showCurrent)}
              />
            </FieldLabel>

            <div style={styles.fieldGrid} className="field-grid">
              <FieldLabel label="New Password">
                <PasswordField
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="At least 6 characters"
                  show={showNew}
                  toggleShow={() => setShowNew(!showNew)}
                />
              </FieldLabel>

              <FieldLabel label="Confirm New Password">
                <Input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Re-enter new password"
                />
              </FieldLabel>
            </div>

            <Button
              type="submit"
              disabled={savingPassword}
              style={{ width: "fit-content", padding: "12px 24px" }}
            >
              {savingPassword ? "Updating Password..." : "Update Password"}
            </Button>
          </form>
        </div>

        {/* TWO-FACTOR AUTHENTICATION */}
        <div style={styles.profileMain}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <div>
              <h3 style={styles.mainHeading}>🛡️ Two-Factor Authentication (2FA)</h3>
              <p style={styles.mainSubheading}>
                Add an extra layer of security to your account using an authenticator app.
              </p>
            </div>
            <Button
              type="button"
              variant={twoFactorEnabled ? "secondary" : "primary"}
              onClick={() => {
                setTwoFactorEnabled(!twoFactorEnabled);
                alert(
                  !twoFactorEnabled
                    ? "Two-Factor Authentication has been enabled!"
                    : "Two-Factor Authentication has been disabled."
                );
              }}
              style={{ minWidth: 110 }}
            >
              {twoFactorEnabled ? "Disable 2FA" : "Enable 2FA"}
            </Button>
          </div>
        </div>

        {/* ACTIVE SESSIONS & DATA CONTROL */}
        <div style={styles.profileMain}>
          <h3 style={styles.mainHeading}>💻 Active Sessions & Data Controls</h3>
          <p style={styles.mainSubheading}>
            Manage your logged-in devices and download your account data backup.
          </p>

          <div style={{ marginTop: 16, display: "grid", gap: 12 }}>
            <div className="vitya-menu-item" style={{ cursor: "default" }}>
              <div className="vitya-menu-left">
                <div className="vitya-menu-icon-box" style={{ background: "rgba(34, 197, 94, 0.15)" }}>
                  🌐
                </div>
                <div>
                  <div className="vitya-menu-title">Current Web Browser (Active Now)</div>
                  <div className="vitya-menu-sub">Windows • Chrome • India</div>
                </div>
              </div>
              <div className="vitya-stat-value">
                <span className="vitya-green-dot" /> Online
              </div>
            </div>

            <div style={{ display: "flex", gap: 12, flexWrap: "wrap", marginTop: 8 }}>
              <Button
                type="button"
                variant="secondary"
                onClick={() => alert("Downloading account data archive…")}
              >
                📥 Download Account Data
              </Button>
              <Button
                type="button"
                variant="danger"
                onClick={() => alert("Logged out from all other active sessions.")}
              >
                🚪 Revoke Other Sessions
              </Button>
            </div>
          </div>
        </div>
      </div>
    </PageShell>
  );
}

export default SecurityPrivacyPage;
