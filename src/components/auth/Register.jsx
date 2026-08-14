import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import {
  api,
  handleApiError,
  validateEmail,
  validatePassword,
  loadProfileIntoStorage,
  PageShell,
  AuthSidePanel,
  FieldLabel,
  Input,
  PasswordField,
  Button,
  styles,
} from "./AuthCommon";

export function Register() {
  const { login } = useAuth();
  const [name, setName] = useState("");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    if (loading) return;
    setLoading(true);

    try {
      if (!name.trim()) return alert("Please enter your name.");
      if (!username.trim()) return alert("Please enter a username.");
      if (!validateEmail(email)) return alert("Please enter a valid email address.");
      if (!validatePassword(password)) {
        return alert("Password must be at least 6 characters long.");
      }
      if (password !== confirmPassword) return alert("Passwords do not match!");

      const res = await api.post("/api/users/register", {
        name: name.trim(),
        username: username.trim(),
        email: email.trim(),
        password,
      });

      const token = res?.data?.token;
      if (!token) {
        alert(res?.data?.message || "Registration successful, but token was not returned.");
        navigate("/login");
        return;
      }

      const profile = await loadProfileIntoStorage(token);
      const userData = profile || {
        name: name.trim(),
        username: username.trim(),
        email: email.trim(),
        profile_pic: "/profile.png",
      };
      login(token, userData);

      alert(res.data?.message || "Registration successful!");
      navigate("/profile");
    } catch (err) {
      alert(handleApiError(err));
    } finally {
      setLoading(false);
    }
  };

  return (
    <PageShell
      badge="Create account"
      title="Register"
      subtitle="Join Vitya and start managing everything from one place."
      className="auth-layout"
    >
      <div style={styles.authLayout} className="auth-layout">
        <AuthSidePanel />

        <div style={styles.formPanel}>
          <form onSubmit={handleRegister} style={styles.form}>
            <FieldLabel label="Full Name">
              <Input
                type="text"
                placeholder="Full Name"
                value={name}
                autoComplete="name"
                onChange={(e) => setName(e.target.value)}
                required
              />
            </FieldLabel>

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

            <FieldLabel label="Email">
              <Input
                type="email"
                placeholder="Email"
                value={email}
                autoComplete="email"
                onChange={(e) => setEmail(e.target.value)}
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
                autoComplete="new-password"
              />
            </FieldLabel>

            <FieldLabel label="Confirm Password">
              <Input
                type="password"
                placeholder="Confirm Password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                autoComplete="new-password"
                required
              />
            </FieldLabel>

            <Button type="submit" disabled={loading} style={{ width: "100%" }}>
              {loading ? "Registering..." : "Register"}
            </Button>
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

            <div style={styles.footerText}>
              Already registered?{" "}
              <Link to="/login" style={styles.link}>
                Login
              </Link>
            </div>
          </div>
        </div>
      </div>
    </PageShell>
  );
}

export default Register;
