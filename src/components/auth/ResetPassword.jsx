import React, { useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import {
  api,
  handleApiError,
  validatePassword,
  PageShell,
  AuthSidePanel,
  FieldLabel,
  Input,
  Button,
  styles,
} from "./AuthCommon";

export function ResetPassword() {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const token = searchParams.get("token");

  const handleReset = async (e) => {
    e.preventDefault();
    if (loading) return;

    if (!token) return alert("Reset token is missing.");
    if (password !== confirmPassword) return alert("Passwords do not match!");
    if (!validatePassword(password)) {
      return alert("Password must be at least 6 characters.");
    }

    setLoading(true);
    try {
      await api.post("/api/users/reset-password", {
        token,
        new_password: password,
      });

      alert("Password reset successful! Please login.");
      navigate("/login");
    } catch (err) {
      alert(handleApiError(err));
    } finally {
      setLoading(false);
    }
  };

  return (
    <PageShell
      badge="Security"
      title="Reset Password"
      subtitle="Choose a strong new password for your account."
    >
      <div style={styles.authLayout} className="auth-layout">
        <AuthSidePanel />

        <div style={styles.formPanel}>
          <form onSubmit={handleReset} style={styles.form}>
            <FieldLabel label="New Password">
              <Input
                type="password"
                placeholder="New Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </FieldLabel>

            <FieldLabel label="Confirm New Password">
              <Input
                type="password"
                placeholder="Confirm New Password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
              />
            </FieldLabel>

            <Button type="submit" disabled={loading} style={{ width: "100%" }}>
              {loading ? "Resetting..." : "Reset Password"}
            </Button>

            <Button
              type="button"
              variant="secondary"
              onClick={() => navigate("/login")}
              style={{ width: "100%" }}
            >
              ← Back to Login
            </Button>
          </form>
        </div>
      </div>
    </PageShell>
  );
}

export default ResetPassword;
