import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import {
  api,
  handleApiError,
  loadProfileIntoStorage,
  PageShell,
  AuthSidePanel,
  FieldLabel,
  Input,
  PasswordField,
  Button,
  styles,
} from "./AuthCommon";

export function Login() {
  const { login } = useAuth();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    if (loading) return;
    setLoading(true);

    try {
      if (!username.trim()) return alert("Please enter your username.");
      if (!password) return alert("Please enter your password.");

      const res = await api.post("/api/users/login", {
        username: username.trim(),
        password,
      });

      const token = res?.data?.token;
      if (!token) {
        alert(res?.data?.message || "Invalid login response.");
        return;
      }

      const profile = await loadProfileIntoStorage(token);
      const userData = profile || {
        name: username.trim(),
        username: username.trim(),
        email: "",
        profile_pic: "/profile.png",
      };
      login(token, userData);

      alert(res.data?.message || "Login successful!");
      navigate("/profile");
    } catch (err) {
      alert(handleApiError(err));
    } finally {
      setLoading(false);
    }
  };

  return (
    <PageShell
      badge="Welcome back"
      title="Login"
      subtitle="Sign in to continue where you left off."
    >
      <div style={styles.authLayout} className="auth-layout">
        <AuthSidePanel />

        <div style={styles.formPanel}>
          <form onSubmit={handleLogin} style={styles.form}>
            <FieldLabel label="Username">
              <Input
                type="text"
                placeholder="Username"
                value={username}
                autoComplete="username"
                onChange={(e) => setUsername(e.target.value)}
                required
              />
            </FieldLabel>

            <FieldLabel label="Password">
              <PasswordField
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Password"
                show={showPassword}
                toggleShow={() => setShowPassword((v) => !v)}
                autoComplete="current-password"
              />
            </FieldLabel>

            <Button type="submit" disabled={loading} style={{ width: "100%" }}>
              {loading ? "Logging in..." : "Login"}
            </Button>

            <div style={styles.linkRow}>
              <Link to="/forgot-password" style={styles.link}>
                Forgot Password?
              </Link>
              <span style={styles.dot}>•</span>
              <Link to="/register" style={styles.link}>
                Create an account
              </Link>
            </div>
          </form>

          <div style={styles.footerStack}>
            <Button
              type="button"
              variant="secondary"
              onClick={() => navigate("/")}
              style={{ width: "100%" }}
            >
              ← Go to Home
            </Button>
          </div>
        </div>
      </div>
    </PageShell>
  );
}

export default Login;
