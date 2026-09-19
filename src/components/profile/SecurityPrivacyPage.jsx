import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  PageShell,
  Input,
  FieldLabel,
} from "../auth/AuthCommon";
import { api, handleApiError } from "../../services/api";
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

  // Load 2FA status from cloud
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) return;

    api
      .get("/api/settings/")
      .then((res) => {
        if (typeof res.data?.two_factor_enabled === "boolean") {
          setTwoFactorEnabled(res.data.two_factor_enabled);
        }
      })
      .catch((e) => console.warn("Could not load security settings", e));
  }, []);

  const handlePasswordSubmit = async (e) => {
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

    const token = localStorage.getItem("token");
    if (!token) {
      showToast("Please login first to update password.");
      return;
    }

    setSavingPassword(true);
    try {
      const res = await api.post("/api/settings/change-password", {
        current_password: currentPassword,
        new_password: newPassword,
      });
      showToast(res.data?.message || "Password updated successfully!");
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch (err) {
      showToast(handleApiError(err) || "Failed to update password");
    } finally {
      setSavingPassword(false);
    }
  };

  const handleToggle2FA = async () => {
    const nextState = !twoFactorEnabled;
    setTwoFactorEnabled(nextState);

    const token = localStorage.getItem("token");
    if (token) {
      try {
        await api.put("/api/settings/", { two_factor_enabled: nextState });
        showToast(
          nextState
            ? "Two-Factor Authentication Enabled & Synced!"
            : "Two-Factor Authentication Disabled!"
        );
      } catch (err) {
        showToast(handleApiError(err) || "Failed to update 2FA status");
        setTwoFactorEnabled(!nextState); // revert
      }
    } else {
      showToast(nextState ? "2FA Enabled (local)" : "2FA Disabled (local)");
    }
  };

  return (
    <PageShell
      title="Security & Privacy"
      subtitle="Manage your password, 2FA authentication, and account security synced with MOTHER."
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
            <div className="vitya-header-icon bg-emerald">🔑</div>
            <div className="vitya-header-title-block">
              <h3>Change Password</h3>
              <p>Ensure your account stays secure by using a strong, unique password</p>
            </div>
          </div>

          <form onSubmit={handlePasswordSubmit}>
            <div className="formGroup">
              <FieldLabel htmlFor="current-pwd">Current Password</FieldLabel>
              <div className="passwordWrapper">
                <Input
                  id="current-pwd"
                  type={showCurrent ? "text" : "password"}
                  placeholder="Enter current password"
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  autoComplete="current-password"
                />
                <button
                  type="button"
                  className="eyeBtn"
                  onClick={() => setShowCurrent(!showCurrent)}
                  tabIndex="-1"
                >
                  {showCurrent ? "👁️" : "🙈"}
                </button>
              </div>
            </div>

            <div className="formGroup">
              <FieldLabel htmlFor="new-pwd">New Password</FieldLabel>
              <div className="passwordWrapper">
                <Input
                  id="new-pwd"
                  type={showNew ? "text" : "password"}
                  placeholder="At least 6 characters"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  autoComplete="new-password"
                />
                <button
                  type="button"
                  className="eyeBtn"
                  onClick={() => setShowNew(!showNew)}
                  tabIndex="-1"
                >
                  {showNew ? "👁️" : "🙈"}
                </button>
              </div>
            </div>

            <div className="formGroup">
              <FieldLabel htmlFor="confirm-pwd">Confirm New Password</FieldLabel>
              <Input
                id="confirm-pwd"
                type="password"
                placeholder="Re-type new password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                autoComplete="new-password"
              />
            </div>

            <div className="vitya-actions-row" style={{ marginTop: 20 }}>
              <button
                type="submit"
                className="vitya-save-btn"
                disabled={savingPassword}
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
              <p>Add an extra layer of security to your account using authenticator verification</p>
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
              onClick={handleToggle2FA}
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
