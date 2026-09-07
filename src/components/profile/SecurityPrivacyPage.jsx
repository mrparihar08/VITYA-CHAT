import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  PageShell,
  Input,
  PasswordField,
  FieldLabel,
} from "../auth/AuthCommon";
import "../auth/Auth.css";

export function SecurityPrivacyPage({ insideDashboard = false }) {
  const navigate = useNavigate();
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(false);
  const [savingPassword, setSavingPassword] = useState(false);
  const [toastMsg, setToastMsg] = useState("");

  const showToast = (msg) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(""), 3500);
  };

  const handlePasswordSubmit = (e) => {
    e.preventDefault();
    if (!currentPassword || !newPassword || !confirmPassword) {
      showToast("Please fill in all password fields.");
      return;
    }
    if (newPassword !== confirmPassword) {
      showToast("New password and confirm password do not match.");
      return;
    }
    if (newPassword.length < 6) {
      showToast("Password must be at least 6 characters long.");
      return;
    }

    setSavingPassword(true);
    setTimeout(() => {
      showToast("Password updated successfully!");
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
      setSavingPassword(false);
    }, 600);
  };

  return (
    <PageShell
      title="Security & Privacy"
      subtitle="Manage your password, 2FA authentication, and data privacy."
      plain={insideDashboard}
      hideBrandRow={insideDashboard}
      wide={true}
    >
      <div className="vitya-profile-edit-container">
        {toastMsg && <div className="vitya-settings-toast">✓ {toastMsg}</div>}

        <div className="vitya-profile-top-nav">
          <button
            type="button"
            className="backBtn"
            onClick={() => navigate(insideDashboard ? "/dashboard?tab=profile" : "/profile")}
          >
            ← Back to Profile
          </button>
          <div className="appBreadcrumb">
            <span>Profile</span> <span className="bcSep">/</span> <strong className="bcCurrent">Security & Privacy</strong>
          </div>
        </div>

        {/* CHANGE PASSWORD */}
        <div className="vitya-settings-card">
          <div className="vitya-card-header">
            <div className="vitya-header-icon bg-purple">🔐</div>
            <div className="vitya-header-title-block">
              <h3>Change Password</h3>
              <p>Update your password regularly to keep your Vitya.AI account secure</p>
            </div>
          </div>

          <form onSubmit={handlePasswordSubmit} className="vitya-edit-form-grid">
            <div className="vitya-input-group full-width">
              <FieldLabel label="Current Password">
                <PasswordField
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  placeholder="Enter current password"
                  show={showCurrent}
                  toggleShow={() => setShowCurrent(!showCurrent)}
                />
              </FieldLabel>
            </div>

            <div className="vitya-input-group">
              <FieldLabel label="New Password">
                <PasswordField
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="At least 6 characters"
                  show={showNew}
                  toggleShow={() => setShowNew(!showNew)}
                />
              </FieldLabel>
            </div>

            <div className="vitya-input-group">
              <FieldLabel label="Confirm New Password">
                <Input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Re-enter new password"
                />
              </FieldLabel>
            </div>

            <div className="vitya-input-group full-width" style={{ marginTop: 8 }}>
              <button
                type="submit"
                className="vitya-save-btn"
                disabled={savingPassword}
                style={{ width: "fit-content" }}
              >
                {savingPassword ? "Updating Password..." : "Update Password"}
              </button>
            </div>
          </form>
        </div>

        {/* TWO-FACTOR AUTHENTICATION */}
        <div className="vitya-settings-card">
          <div className="vitya-card-header">
            <div className="vitya-header-icon bg-blue">🛡️</div>
            <div className="vitya-header-title-block">
              <h3>Two-Factor Authentication (2FA)</h3>
              <p>Add an extra layer of security to your account using an authenticator app</p>
            </div>
          </div>

          <div className="vitya-setting-item item-toggle" style={{ padding: "8px 0 0" }}>
            <div className="item-left">
              <span className="item-icon">📱</span>
              <span className="item-label">
                {twoFactorEnabled ? "2FA Protection Active" : "2FA Protection Disabled"}
              </span>
            </div>
            <button
              type="button"
              className="vitya-save-btn"
              style={{
                background: twoFactorEnabled
                  ? "rgba(239,68,68,0.2)"
                  : "linear-gradient(135deg, #10b981 0%, #059669 100%)",
                border: twoFactorEnabled ? "1px solid rgba(239,68,68,0.4)" : "none",
                fontSize: 13,
                padding: "8px 16px",
              }}
              onClick={() => {
                setTwoFactorEnabled(!twoFactorEnabled);
                showToast(
                  !twoFactorEnabled
                    ? "Two-Factor Authentication Enabled!"
                    : "Two-Factor Authentication Disabled!"
                );
              }}
            >
              {twoFactorEnabled ? "Disable 2FA" : "Enable 2FA"}
            </button>
          </div>
        </div>
      </div>
    </PageShell>
  );
}

export default SecurityPrivacyPage;
