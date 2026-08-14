import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  api,
  handleApiError,
  validateEmail,
  PageShell,
  AuthSidePanel,
  FieldLabel,
  Input,
  Button,
  styles,
} from "./AuthCommon";

export function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleForgot = async (e) => {
    e.preventDefault();
    if (loading) return;

    if (!validateEmail(email)) {
      return alert("Please enter a valid email address.");
    }

    setLoading(true);
    try {
      const res = await api.post("/api/users/forgot-password", {
        email: email.trim(),
      });

      alert(
        res.data?.message ||
          "If an account exists with this email, a password reset link has been sent."
      );
    } catch (err) {
      alert(handleApiError(err));
    } finally {
      setLoading(false);
    }
  };

  return (
    <PageShell
      badge="Recovery"
      title="Forgot Password"
      subtitle="Enter your email and we will send a reset link."
    >
      <div style={styles.authLayout} className="auth-layout">
        <AuthSidePanel />

        <div style={styles.formPanel}>
          <form onSubmit={handleForgot} style={styles.form}>
            <FieldLabel label="Email">
              <Input
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </FieldLabel>

            <Button type="submit" disabled={loading} style={{ width: "100%" }}>
              {loading ? "Sending..." : "Send Reset Link"}
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

export default ForgotPassword;
