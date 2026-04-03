import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate, Link, useSearchParams } from "react-router-dom";

const API_URL = process.env.REACT_APP_API_URL || "https://vitya-ai-qlbn.onrender.com";

const getAuthHeaders = (token) => ({
  headers: { Authorization: `Bearer ${token}` },
});

const handleApiError = (err) => {
  if (err.response?.status === 429) {
    return err.response.data?.error || "Too many requests. Please slow down and try again later.";
  }
  return err.response?.data?.error || err.response?.data?.message || "An unexpected error occurred.";
};

const validateEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
const validatePassword = (pass) => pass.length >= 6;

const PageShell = ({ children, title, subtitle, badge }) => {
  return (
    <div style={styles.page}>
      <div style={styles.glowA} />
      <div style={styles.glowB} />

      <div style={styles.shell}>
        <div style={styles.brandRow}>
          <div style={styles.brandMark}>V</div>
          <div>
            <div style={styles.brandName}>Vitya.AI</div>
            <div style={styles.brandTag}>Finance assistant workspace</div>
          </div>
        </div>

        <div style={styles.card}>
          {badge ? <div style={styles.badge}>{badge}</div> : null}
          <h1 style={styles.title}>{title}</h1>
          {subtitle ? <p style={styles.subtitle}>{subtitle}</p> : null}
          {children}
        </div>
      </div>
    </div>
  );
};

const Input = (props) => <input {...props} style={{ ...styles.input, ...props.style }} />;
const Button = ({ variant = "primary", style, ...props }) => (
  <button
    {...props}
    style={{
      ...styles.button,
      ...(variant === "secondary" ? styles.buttonSecondary : null),
      ...(variant === "danger" ? styles.buttonDanger : null),
      ...style,
    }}
  />
);

const PasswordField = ({ value, onChange, placeholder, show, toggleShow, autoComplete }) => {
  return (
    <div style={styles.passwordWrap}>
      <Input
        type={show ? "text" : "password"}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        autoComplete={autoComplete}
        style={styles.passwordInput}
      />
      <button type="button" onClick={toggleShow} style={styles.showBtn}>
        {show ? "Hide" : "Show"}
      </button>
    </div>
  );
};

export function Register() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    setLoading(true);

    if (!username.trim()) {
      alert("Please enter your name.");
      setLoading(false);
      return;
    }

    if (!validateEmail(email)) {
      alert("Please enter a valid email address.");
      setLoading(false);
      return;
    }

    if (!validatePassword(password)) {
      alert("Password must be at least 6 characters long.");
      setLoading(false);
      return;
    }

    if (password !== confirmPassword) {
      alert("Passwords do not match!");
      setLoading(false);
      return;
    }

    try {
      const res = await axios.post(`${API_URL}/api/users/register`, {
        username,
        email,
        password,
      });

      alert(res.data.message || "Registration successful!");

      if (res.data.token) {
        localStorage.setItem("token", res.data.token);
        localStorage.setItem(
          "user",
          JSON.stringify({
            name: username,
            email,
            avatar: "/profile.png",
          })
        );
        navigate("/profile");
      } else {
        navigate("/login");
      }
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
    >
      <form onSubmit={handleRegister} style={styles.form}>
        <Input
          type="text"
          placeholder="Username"
          value={username}
          autoComplete="username"
          onChange={(e) => setUsername(e.target.value)}
          required
        />

        <Input
          type="email"
          placeholder="Email"
          value={email}
          autoComplete="email"
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        <PasswordField
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Password"
          show={showPassword}
          toggleShow={() => setShowPassword((v) => !v)}
          autoComplete="new-password"
        />

        <Input
          type="password"
          placeholder="Confirm Password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          autoComplete="new-password"
          required
        />

        <Button type="submit" disabled={loading} style={{ width: "100%" }}>
          {loading ? "Registering..." : "Register"}
        </Button>
      </form>

      <div style={styles.footerStack}>
        <Button type="button" variant="secondary" onClick={() => navigate("/")} style={{ width: "100%" }}>
          ← Go to Home
        </Button>

        <div style={styles.footerText}>
          Already registered?{" "}
          <Link to="/login" style={styles.link}>
            Login
          </Link>
        </div>
      </div>
    </PageShell>
  );
}

export function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await axios.post(`${API_URL}/api/users/login`, {
        username,
        password,
      });

      if (res.data.token) {
        localStorage.setItem("token", res.data.token);
        localStorage.setItem(
          "user",
          JSON.stringify({
            name: res.data.user?.username || username,
            email: res.data.user?.email || "",
            avatar: "/profile.png",
          })
        );
        alert("Login successful!");
        navigate("/profile");
      } else {
        alert("Invalid login response!");
      }
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
      <form onSubmit={handleLogin} style={styles.form}>
        <Input
          type="text"
          placeholder="Username"
          value={username}
          autoComplete="username"
          onChange={(e) => setUsername(e.target.value)}
          required
        />

        <PasswordField
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Password"
          show={showPassword}
          toggleShow={() => setShowPassword((v) => !v)}
          autoComplete="current-password"
        />

        <Button type="submit" disabled={loading} style={{ width: "100%" }}>
          {loading ? "Logging in..." : "Login"}
        </Button>
      </form>

      <div style={styles.footerStack}>
        <Button type="button" variant="secondary" onClick={() => navigate("/")} style={{ width: "100%" }}>
          ← Go to Home
        </Button>

        <div style={styles.linkRow}>
          <Link to="/forgot-password" style={styles.link}>
            Forgot Password?
          </Link>
          <span style={styles.dot}>•</span>
          <span style={styles.footerText}>
            Not registered yet?{" "}
            <Link to="/register" style={styles.link}>
              Register
            </Link>
          </span>
        </div>
      </div>
    </PageShell>
  );
}

export function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleForgot = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await axios.post(`${API_URL}/api/users/forgot-password`, { email });
      alert(res.data?.message || "If an account exists with this email, a reset link has been sent.");
      navigate("/login");
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
      <form onSubmit={handleForgot} style={styles.form}>
        <Input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        <Button type="submit" disabled={loading} style={{ width: "100%" }}>
          {loading ? "Sending..." : "Send Reset Link"}
        </Button>

        <Button type="button" variant="secondary" onClick={() => navigate("/login")} style={{ width: "100%" }}>
          ← Back to Login
        </Button>
      </form>
    </PageShell>
  );
}

export function ResetPassword() {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const token = searchParams.get("token");

  const handleReset = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) return alert("Passwords do not match!");
    if (!validatePassword(password)) return alert("Password must be at least 6 characters.");

    setLoading(true);
    try {
      await axios.post(`${API_URL}/api/users/reset-password`, {
        token,
        newPassword: password,
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
      <form onSubmit={handleReset} style={styles.form}>
        <Input
          type="password"
          placeholder="New Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />

        <Input
          type="password"
          placeholder="Confirm New Password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          required
        />

        <Button type="submit" disabled={loading || !token} style={{ width: "100%" }}>
          {loading ? "Resetting..." : "Reset Password"}
        </Button>
      </form>
    </PageShell>
  );
}

export function Profile() {
  const [data, setData] = useState({ profile: null, overview: null });
  const [passwords, setPasswords] = useState({
    oldPassword: "",
    newPassword: "",
    confirmNew: "",
  });
  const [showChangePass, setShowChangePass] = useState(false);
  const [loading, setLoading] = useState(true);
  const [updatingPass, setUpdatingPass] = useState(false);

  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  useEffect(() => {
    if (!token) {
      navigate("/login");
      return;
    }

    const fetchData = async () => {
      try {
        const [profRes, overRes] = await Promise.all([
          axios.get(`${API_URL}/api/users/profile`, getAuthHeaders(token)),
          axios.get(`${API_URL}/api/vitya/financial_overview`, getAuthHeaders(token)),
        ]);
        setData({ profile: profRes.data, overview: overRes.data });
      } catch (err) {
        console.error(err);
        if (err.response?.status === 401) {
          alert("Session expired, please login again!");
          localStorage.removeItem("token");
          navigate("/login");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [token, navigate]);

  const handleChangePassword = async (e) => {
    e.preventDefault();

    if (passwords.newPassword !== passwords.confirmNew) {
      return alert("New passwords do not match!");
    }

    if (!validatePassword(passwords.newPassword)) {
      return alert("New password must be at least 6 characters long.");
    }

    setUpdatingPass(true);
    try {
      await axios.post(
        `${API_URL}/api/users/change-password`,
        {
          oldPassword: passwords.oldPassword,
          newPassword: passwords.newPassword,
        },
        getAuthHeaders(token)
      );

      alert("Password updated successfully!");
      setPasswords({ oldPassword: "", newPassword: "", confirmNew: "" });
      setShowChangePass(false);
    } catch (err) {
      alert(handleApiError(err));
    } finally {
      setUpdatingPass(false);
    }
  };

  

  const handleLogout = () => {
    if (window.confirm("Are you sure you want to logout?")) {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      navigate("/login");
    }
  };

  if (loading) {
    return (
      <PageShell badge="Profile" title="Loading..." subtitle="Fetching your account details.">
        <div style={styles.loadingBlock}>
          <div style={styles.spinner} />
          <div style={styles.loadingText}>Loading profile…</div>
        </div>
      </PageShell>
    );
  }

  const username = data.profile?.username || "User";
  const email = data.profile?.email || "";
  const initial = username?.charAt(0)?.toUpperCase() || "V";

  return (
    <PageShell
      
      badge="Profile"
      title="Account Overview"
      subtitle="View your info, export your data, and manage your security."
    >

      <div style={styles.profileHeader}>
        <div style={styles.avatar}>{initial}</div>
        <div style={{ textAlign: "left" }}>
          <div style={styles.profileName}>{username}</div>
          <div style={styles.profileEmail}>{email}</div>
        </div>
      </div>

      <div style={styles.panelGrid}>
        <div style={styles.panel}>
          <div style={styles.panelLabel}>Total Income</div>
          <div style={{ ...styles.panelValue, color: "#22c55e" }}>
            ₹{data.overview?.total_income?.toLocaleString?.() || 0}
          </div>
        </div>

        <div style={styles.panel}>
          <div style={styles.panelLabel}>Total Expenses</div>
          <div style={{ ...styles.panelValue, color: "#ef4444" }}>
            ₹{data.overview?.total_expenses?.toLocaleString?.() || 0}
          </div>
        </div>

        <div style={styles.panel}>
          <div style={styles.panelLabel}>Balance</div>
          <div style={styles.panelValue}>
            ₹{data.overview?.available_balance?.toLocaleString?.() || 0}
          </div>
        </div>
      </div>

      <div style={styles.sectionTitle}>Security</div>
      {!showChangePass ? (
        <Button type="button" variant="secondary" onClick={() => setShowChangePass(true)} style={{ width: "100%" }}>
          Change Password
        </Button>
      ) : (
        <form onSubmit={handleChangePassword} style={styles.form}>
          <Input
            type="password"
            placeholder="Current Password"
            required
            value={passwords.oldPassword}
            onChange={(e) => setPasswords({ ...passwords, oldPassword: e.target.value })}
          />
          <Input
            type="password"
            placeholder="New Password"
            required
            value={passwords.newPassword}
            onChange={(e) => setPasswords({ ...passwords, newPassword: e.target.value })}
          />
          <Input
            type="password"
            placeholder="Confirm New Password"
            required
            value={passwords.confirmNew}
            onChange={(e) => setPasswords({ ...passwords, confirmNew: e.target.value })}
          />

          <div style={styles.row}>
            <Button type="submit" disabled={updatingPass} style={{ flex: 1 }}>
              {updatingPass ? "Updating..." : "Update"}
            </Button>
            <Button
              type="button"
              variant="secondary"
              onClick={() => setShowChangePass(false)}
              style={{ flex: 1 }}
            >
              Cancel
            </Button>
          </div>
        </form>
      )}
      <br />
      <br />
      

      <Button type="button" variant="danger" onClick={handleLogout} style={{ width: "100%" }}>
        Logout
      </Button>
      <br />
      <br />
      <Button type="button" variant="secondary" onClick={() => navigate("/")} style={{ width: "100%" }}>
          ← Go to Home
        </Button>

    </PageShell>
  );
}

export default Login;

const styles = {
  page: {
    minHeight: "100vh",
    overflow: "hidden",
    position: "relative",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    padding: "24px",
    background:
      "radial-gradient(circle at top, #1b2440 0%, #0b1020 52%, #070b14 100%)",
    color: "#fff",
    fontFamily: "system-ui, -apple-system, BlinkMacSystemFont, Segoe UI, Roboto, sans-serif",
  },
  glowA: {
    position: "absolute",
    inset: "auto auto 8% -5%",
    width: 280,
    height: 280,
    borderRadius: "50%",
    background: "rgba(139,92,246,0.18)",
    filter: "blur(40px)",
    pointerEvents: "none",
  },
  glowB: {
    position: "absolute",
    inset: "8% -5% auto auto",
    width: 260,
    height: 260,
    borderRadius: "50%",
    background: "rgba(56,189,248,0.12)",
    filter: "blur(40px)",
    pointerEvents: "none",
  },
  shell: {
    width: "100%",
    maxWidth: 520,
    position: "relative",
    zIndex: 1,
  },
  brandRow: {
    display: "flex",
    alignItems: "center",
    gap: 12,
    marginBottom: 18,
    padding: "0 8px",
  },
  brandMark: {
    width: 44,
    height: 44,
    borderRadius: 14,
    display: "grid",
    placeItems: "center",
    fontWeight: 800,
    background: "linear-gradient(135deg, #8b5cf6 0%, #6366f1 100%)",
    boxShadow: "0 12px 24px rgba(99,102,241,0.25)",
  },
  brandName: {
    fontSize: 18,
    fontWeight: 800,
    lineHeight: 1.1,
  },
  brandTag: {
    fontSize: 12,
    opacity: 0.72,
  },
  card: {
    borderRadius: 28,
    padding: 24,
    background: "rgba(15, 20, 36, 0.82)",
    border: "1px solid rgba(255,255,255,0.08)",
    boxShadow: "0 24px 60px rgba(0,0,0,0.38)",
    backdropFilter: "blur(18px)",
  },
  badge: {
    display: "inline-flex",
    alignItems: "center",
    gap: 8,
    padding: "6px 12px",
    borderRadius: 999,
    fontSize: 12,
    fontWeight: 700,
    color: "#dbeafe",
    background: "rgba(255,255,255,0.08)",
    marginBottom: 14,
  },
  title: {
    margin: 0,
    fontSize: 30,
    fontWeight: 800,
    letterSpacing: "-0.03em",
  },
  subtitle: {
    marginTop: 8,
    marginBottom: 22,
    fontSize: 14,
    lineHeight: 1.6,
    opacity: 0.76,
  },
  form: {
    display: "grid",
    gap: 14,
  },
  input: {
    width: "100%",
    height: 48,
    borderRadius: 16,
    border: "1px solid rgba(255,255,255,0.09)",
    background: "rgba(255,255,255,0.04)",
    color: "#fff",
    padding: "0 16px",
    outline: "none",
    fontSize: 15,
    boxSizing: "border-box",
  },
  button: {
    height: 48,
    border: "none",
    borderRadius: 16,
    cursor: "pointer",
    fontWeight: 700,
    color: "#fff",
    background: "linear-gradient(135deg, #8b5cf6 0%, #6366f1 100%)",
    boxShadow: "0 12px 24px rgba(99,102,241,0.28)",
    transition: "transform 0.2s ease, opacity 0.2s ease",
  },
  buttonSecondary: {
    background: "rgba(255,255,255,0.08)",
    boxShadow: "none",
  },
  buttonDanger: {
    background: "linear-gradient(135deg, #ef4444 0%, #f97316 100%)",
    boxShadow: "0 12px 24px rgba(239,68,68,0.18)",
  },
  passwordWrap: {
    position: "relative",
  },
  passwordInput: {
    paddingRight: 72,
  },
  showBtn: {
    position: "absolute",
    right: 10,
    top: 9,
    height: 30,
    padding: "0 10px",
    border: "none",
    borderRadius: 10,
    background: "rgba(255,255,255,0.08)",
    color: "#fff",
    cursor: "pointer",
    fontSize: 12,
    fontWeight: 700,
  },
  footerStack: {
    display: "grid",
    gap: 12,
    marginTop: 18,
  },
  footerText: {
    textAlign: "center",
    fontSize: 13,
    opacity: 0.82,
  },
  linkRow: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    gap: 8,
    flexWrap: "wrap",
    fontSize: 13,
  },
  link: {
    color: "#c4b5fd",
    textDecoration: "none",
    fontWeight: 700,
  },
  dot: {
    opacity: 0.45,
  },
  loadingBlock: {
    display: "grid",
    justifyItems: "center",
    gap: 12,
    padding: "20px 0 8px",
  },
  spinner: {
    width: 30,
    height: 30,
    borderRadius: "50%",
    border: "3px solid rgba(255,255,255,0.16)",
    borderTopColor: "#8b5cf6",
    animation: "spin 1s linear infinite",
  },
  loadingText: {
    opacity: 0.8,
    fontSize: 14,
  },
  profileHeader: {
    display: "flex",
    alignItems: "center",
    gap: 14,
    marginBottom: 18,
    padding: 16,
    borderRadius: 22,
    background: "rgba(255,255,255,0.04)",
    border: "1px solid rgba(255,255,255,0.06)",
  },
  avatar: {
    width: 58,
    height: 58,
    borderRadius: 18,
    display: "grid",
    placeItems: "center",
    background: "linear-gradient(135deg, #8b5cf6 0%, #6366f1 100%)",
    fontWeight: 800,
    fontSize: 22,
    flexShrink: 0,
  },
  profileName: {
    fontSize: 20,
    fontWeight: 800,
    lineHeight: 1.2,
  },
  profileEmail: {
    fontSize: 13,
    opacity: 0.75,
    marginTop: 4,
    wordBreak: "break-word",
  },
  panelGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(3, minmax(0, 1fr))",
    gap: 12,
    marginBottom: 20,
  },
  panel: {
    borderRadius: 18,
    padding: 16,
    background: "rgba(255,255,255,0.04)",
    border: "1px solid rgba(255,255,255,0.06)",
    minHeight: 92,
  },
  panelLabel: {
    fontSize: 12,
    opacity: 0.72,
    marginBottom: 10,
  },
  panelValue: {
    fontSize: 20,
    fontWeight: 800,
    letterSpacing: "-0.02em",
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: 800,
    marginBottom: 12,
    opacity: 0.92,
  },
  row: {
    display: "flex",
    gap: 12,
    flexWrap: "wrap",
  },
};

if (typeof document !== "undefined" && !document.getElementById("vitya-auth-spin")) {
  const style = document.createElement("style");
  style.id = "vitya-auth-spin";
  style.textContent = `
    @keyframes spin {
      from { transform: rotate(0deg); }
      to { transform: rotate(360deg); }
    }
    button:hover { transform: translateY(-1px); }
    button:disabled { opacity: 0.7; cursor: not-allowed; transform: none; }
  `;
  document.head.appendChild(style);
}