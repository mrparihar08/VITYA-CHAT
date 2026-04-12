import React, { useEffect, useMemo, useState } from "react";
import axios from "axios";
import { Link, useNavigate, useSearchParams } from "react-router-dom";

const API_URL =
  (typeof import.meta !== "undefined" &&
    import.meta.env &&
    import.meta.env.VITE_API_URL) ||
  (typeof process !== "undefined" && process.env?.REACT_APP_API_URL) ||
  "https://mother-8599.onrender.com";

const api = axios.create({
  baseURL: API_URL,
  timeout: 20000,
});

const getAuthHeaders = (token) => ({
  headers: { Authorization: `Bearer ${token}` },
});

const resolveAssetUrl = (path) => {
  if (!path) return "/profile.png";
  if (/^https?:\/\//i.test(path)) return path;
  const base = API_URL.replace(/\/$/, "");
  return `${base}${path.startsWith("/") ? "" : "/"}${path}`;
};

const handleApiError = (err) => {
  const data = err?.response?.data;

  if (err?.response?.status === 429) {
    return (
      data?.error ||
      data?.detail ||
      "Too many requests. Please slow down and try again later."
    );
  }

  if (Array.isArray(data?.detail)) {
    return data.detail
      .map((item) => item?.msg || item?.message || "Validation error")
      .join(", ");
  }

  if (typeof data?.detail === "string") return data.detail;
  if (typeof data?.error === "string") return data.error;
  if (typeof data?.message === "string") return data.message;

  return err?.message || "An unexpected error occurred.";
};

const validateEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
const validatePassword = (pass) => pass.length >= 6;

const saveUserToStorage = (profile) => {
  if (!profile || typeof window === "undefined") return;

  localStorage.setItem(
    "user",
    JSON.stringify({
      id: profile.id ?? null,
      name: profile.name || "",
      username: profile.username || "",
      email: profile.email || "",
      profile_pic: resolveAssetUrl(profile.profile_pic || "/profile.png"),
      bio: profile.bio || "",
      created_at: profile.created_at || null,
      updated_at: profile.updated_at || null,
    })
  );
};

const fetchProfile = async (token) => {
  const res = await api.get("/api/users/profile", getAuthHeaders(token));
  return res.data;
};

const loadProfileIntoStorage = async (token) => {
  const profile = await fetchProfile(token);
  saveUserToStorage(profile);
  return profile;
};

const PageShell = ({
  children,
  title,
  subtitle,
  badge,
  wide = false,
  className = "",
}) => {
  return (
    <div style={styles.page} className="page-shell">
      <div style={styles.bgOrbA} />
      <div style={styles.bgOrbB} />
      <div style={styles.bgGrid} />

      <div
        style={wide ? styles.shellWide : styles.shell}
        className={`page-shell-inner ${className}`.trim()}
      >
        <div style={styles.brandRow}>
          <div style={styles.brandMark}>V</div>
          <div style={{ minWidth: 0 }}>
            <div style={styles.brandName}>Vitya.AI</div>
            <div style={styles.brandTag}>Finance assistant workspace</div>
          </div>
        </div>

        <div style={styles.card} className="page-shell-card">
          {badge ? <div style={styles.badge}>{badge}</div> : null}
          {title ? <h1 style={styles.title}>{title}</h1> : null}
          {subtitle ? <p style={styles.subtitle}>{subtitle}</p> : null}
          {children}
        </div>
      </div>
    </div>
  );
};

const Input = ({ style, className = "", ...props }) => (
  <input {...props} className={className} style={{ ...styles.input, ...style }} />
);

const Textarea = ({ style, className = "", ...props }) => (
  <textarea
    {...props}
    className={className}
    style={{ ...styles.textarea, ...style }}
  />
);

const Button = ({
  variant = "primary",
  style,
  className = "",
  type = "button",
  ...props
}) => (
  <button
    type={type}
    {...props}
    className={className}
    style={{
      ...styles.button,
      ...(variant === "secondary" ? styles.buttonSecondary : null),
      ...(variant === "danger" ? styles.buttonDanger : null),
      ...style,
    }}
  />
);

const PasswordField = ({
  value,
  onChange,
  placeholder,
  show,
  toggleShow,
  autoComplete,
}) => {
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

const AuthSidePanel = () => (
  <div style={styles.sidePanel} className="auth-side-panel">
    <div style={styles.sideGlowA} />
    <div style={styles.sideGlowB} />
    <div style={styles.sideBadge}>Secure access</div>
    <h2 style={styles.sideTitle}>Manage your account from one clean workspace.</h2>
    <p style={styles.sideText}>
      Register, log in, recover your account, and update your profile without
      leaving the app.
    </p>

    <div style={styles.featureList}>
      <div style={styles.featureItem}>
        <span style={styles.featureDot} /> Fast authentication flow
      </div>
      <div style={styles.featureItem}>
        <span style={styles.featureDot} /> Profile edit and recovery tools
      </div>
      <div style={styles.featureItem}>
        <span style={styles.featureDot} /> Mobile-friendly layout
      </div>
    </div>
  </div>
);

export function Register() {
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

      localStorage.setItem("token", token);
      const profile = await loadProfileIntoStorage(token);

      if (!profile) {
        saveUserToStorage({
          name: name.trim(),
          username: username.trim(),
          email: email.trim(),
          profile_pic: "/profile.png",
        });
      }

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

export function Login() {
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

      localStorage.setItem("token", token);
      const profile = await loadProfileIntoStorage(token);

      if (!profile) {
        saveUserToStorage({
          name: username.trim(),
          username: username.trim(),
          email: "",
          profile_pic: "/profile.png",
        });
      }

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

            <div style={styles.linkRow}>
              <Link to="/forgot-password" style={styles.link}>
                Forgot Password?
              </Link>
              <span style={styles.dot}>•</span>
              <span style={styles.footerTextInline}>
                Not registered yet?{" "}
                <Link to="/register" style={styles.link}>
                  Register
                </Link>
              </span>
            </div>
          </div>
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
    if (loading) return;
    setLoading(true);

    try {
      if (!validateEmail(email)) return alert("Please enter a valid email address.");

      const res = await api.post("/api/users/forgot-password", {
        email: email.trim(),
      });

      alert(
        res.data?.message ||
          "If an account exists with this email, a reset link has been sent."
      );
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

export function ResetPassword() {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const token = searchParams.get("token");

  const canSubmit = useMemo(() => {
    return !!token && password.length >= 6 && password === confirmPassword;
  }, [token, password, confirmPassword]);

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

            <Button
              type="submit"
              disabled={loading || !canSubmit}
              style={{ width: "100%" }}
            >
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

export function Profile() {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;

  useEffect(() => {
    if (!token) {
      navigate("/login");
      return;
    }

    const load = async () => {
      try {
        const data = await fetchProfile(token);
        setProfile(data);
        saveUserToStorage(data);
      } catch (err) {
        console.error(err);
        if (err?.response?.status === 401) {
          alert("Session expired, please login again!");
          localStorage.removeItem("token");
          localStorage.removeItem("user");
          navigate("/login");
        } else {
          alert(handleApiError(err));
        }
      } finally {
        setLoading(false);
      }
    };

    load();
  }, [token, navigate]);

  const handleLogout = () => {
    if (window.confirm("Are you sure you want to logout?")) {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      navigate("/login");
    }
  };

  if (loading) {
    return (
      <PageShell
        badge="Profile"
        title="Loading..."
        subtitle="Fetching your account details."
        wide
      >
        <div style={styles.loadingBlock}>
          <div style={styles.spinner} />
          <div style={styles.loadingText}>Loading profile…</div>
        </div>
      </PageShell>
    );
  }

  const initial = (profile?.name || profile?.username || "V")
    .charAt(0)
    .toUpperCase();

  return (
    <PageShell
      badge="Profile"
      title="Your Profile"
      subtitle="View your account details."
      wide
      className="profile-grid"
    >
      <div style={styles.profileWrap}>
        <Button
          type="button"
          variant="secondary"
          onClick={() => navigate("/")}
          style={{ width: "fit-content" }}
        >
          ←Home
        </Button>

        <div style={styles.profileGrid} className="profile-grid">
          <aside style={styles.profileSidebar}>
            <div style={styles.profileHeader}>
              <div style={styles.avatar}>
                {profile?.profile_pic ? (
                  <img
                    src={resolveAssetUrl(profile.profile_pic)}
                    alt="Profile"
                    style={styles.avatarImage}
                    onError={(e) => {
                      e.currentTarget.style.display = "none";
                    }}
                  />
                ) : (
                  <span>{initial}</span>
                )}
              </div>

              <div style={styles.profileMeta}>
                <div style={styles.profileName}>{profile?.name || "User"}</div>
                <div style={styles.profileUsername}>
                  @{profile?.username || "username"}
                </div>
                <div style={styles.profileEmail}>{profile?.email || ""}</div>
              </div>
            </div>

            <div style={styles.profileJoined}>
              {profile?.bio || "No bio added yet."}
            </div>

            <br />

            <Button
              onClick={() => navigate("/profile/edit")}
              style={{ width: "100%" }}
            >
              Edit Profile
            </Button>

            <br />
            <br />

            <Button
              type="button"
              variant="danger"
              onClick={handleLogout}
              style={{ width: "100%" }}
            >
              Logout
            </Button>
          </aside>
        </div>
      </div>
    </PageShell>
  );
}

export function ProfileEdit() {
  const [profile, setProfile] = useState(null);
  const [form, setForm] = useState({
    name: "",
    username: "",
    email: "",
    bio: "",
    profile_pic: null,
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [editing, setEditing] = useState(false);
  const [filePreview, setFilePreview] = useState("");
  const navigate = useNavigate();

  const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;

  useEffect(() => {
    if (!token) {
      navigate("/login");
      return;
    }

    const load = async () => {
      try {
        const data = await fetchProfile(token);
        setProfile(data);
        setForm({
          name: data?.name || "",
          username: data?.username || "",
          email: data?.email || "",
          bio: data?.bio || "",
          profile_pic: data?.profile_pic || "",
        });
        saveUserToStorage(data);
      } catch (err) {
        console.error(err);
        if (err?.response?.status === 401) {
          alert("Session expired, please login again!");
          localStorage.removeItem("token");
          localStorage.removeItem("user");
          navigate("/login");
        } else {
          alert(handleApiError(err));
        }
      } finally {
        setLoading(false);
      }
    };

    load();
  }, [token, navigate]);

  useEffect(() => {
    if (form.profile_pic instanceof File) {
      const url = URL.createObjectURL(form.profile_pic);
      setFilePreview(url);
      return () => URL.revokeObjectURL(url);
    }

    setFilePreview("");
    return undefined;
  }, [form.profile_pic]);

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    if (saving || !editing) return;
    setSaving(true);

    try {
      const payload = new FormData();

      if (form.name.trim() !== (profile?.name || "")) {
        payload.append("name", form.name.trim());
      }

      if (form.username.trim() !== (profile?.username || "")) {
        payload.append("username", form.username.trim());
      }

      if (form.email.trim() !== (profile?.email || "")) {
        payload.append("email", form.email.trim());
      }

      if ((form.bio || "").trim() !== (profile?.bio || "")) {
        payload.append("bio", form.bio.trim());
      }

      if (form.profile_pic instanceof File) {
        payload.append("profile_pic", form.profile_pic);
      }

      const res = await api.put("/api/users/profile/edit", payload, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const updated = res?.data?.user || null;

      if (updated) {
        setProfile(updated);
        setForm({
          name: updated.name || "",
          username: updated.username || "",
          email: updated.email || "",
          bio: updated.bio || "",
          profile_pic: updated.profile_pic || "",
        });
        saveUserToStorage(updated);
      }

      alert(res.data?.message || "Profile updated successfully");
      setEditing(false);
    } catch (err) {
      alert(handleApiError(err));
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <PageShell
        badge="Profile"
        title="Loading..."
        subtitle="Fetching your account details."
        wide
      >
        <div style={styles.loadingBlock}>
          <div style={styles.spinner} />
          <div style={styles.loadingText}>Loading profile…</div>
        </div>
      </PageShell>
    );
  }

  const previewSrc = filePreview || resolveAssetUrl(profile?.profile_pic || "/profile.png");

  return (
    <PageShell
      badge="Profile Edit"
      title="Edit Profile"
      subtitle="Update your account information."
      wide
    >
      <Button
        type="button"
        variant="secondary"
        onClick={() => navigate("/")}
        style={{ width: "fit-content" }}
      >
        ← Home
      </Button>

      <br />
      <br />

      <main style={styles.profileMain}>
        <div style={styles.mainTopBar}>
          <div>
            <h3 style={styles.mainHeading}>
              {editing ? "Editing mode" : "Preview mode"}
            </h3>
            <p style={styles.mainSubheading}>
              {editing
                ? "Make your changes and save them."
                : "Click Edit Profile to unlock the fields."}
            </p>
          </div>

          <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
            {!editing && (
              <Button
                type="button"
                onClick={() => setEditing(true)}
                style={{ minWidth: 120 }}
              >
                Edit Profile
              </Button>
            )}
            <div style={styles.mainChip}>
              {editing ? "Unsaved changes allowed" : "Read only"}
            </div>
          </div>
        </div>

        <form onSubmit={handleUpdateProfile} style={styles.profileForm}>
          <div style={styles.fieldGrid} className="field-grid">
            <FieldLabel label="Full Name">
              <Input
                type="text"
                placeholder="Full Name"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                disabled={!editing}
              />
            </FieldLabel>

            <FieldLabel label="Username">
              <Input
                type="text"
                placeholder="Username"
                value={form.username}
                onChange={(e) => setForm({ ...form, username: e.target.value })}
                disabled={!editing}
              />
            </FieldLabel>
          </div>

          <div style={styles.fieldGrid} className="field-grid">
            <FieldLabel label="Email">
              <Input
                type="email"
                placeholder="Email"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                disabled={!editing}
              />
            </FieldLabel>

            <FieldLabel label="Profile Picture">
              <input
                type="file"
                accept="image/*"
                onChange={(e) =>
                  setForm({ ...form, profile_pic: e.target.files?.[0] || null })
                }
                disabled={!editing}
                style={{
                  width: "100%",
                  padding: "10px",
                  borderRadius: "12px",
                  border: "1px solid rgba(255,255,255,0.1)",
                  background: "rgba(255,255,255,0.05)",
                  color: "#fff",
                  cursor: editing ? "pointer" : "not-allowed",
                }}
              />

              {(filePreview || profile?.profile_pic) && (
                <div style={{ marginTop: 12 }}>
                  <img
                    src={previewSrc}
                    alt="Profile Preview"
                    style={{
                      width: 90,
                      height: 90,
                      borderRadius: "50%",
                      objectFit: "cover",
                      border: "2px solid rgba(255,255,255,0.2)",
                    }}
                  />
                </div>
              )}
            </FieldLabel>
          </div>

          <FieldLabel label="Bio">
            <Textarea
              rows={4}
              placeholder="Bio"
              value={form.bio}
              onChange={(e) => setForm({ ...form, bio: e.target.value })}
              disabled={!editing}
            />
          </FieldLabel>

          <div style={styles.actionRow}>
            <Button
              type="submit"
              disabled={saving || !editing}
              style={{ flex: 1, minWidth: 160 }}
            >
              {saving ? "Saving..." : "Save Changes"}
            </Button>

            <Button
              type="button"
              variant="secondary"
              onClick={() => {
                setEditing(false);
                setForm({
                  name: profile?.name || "",
                  username: profile?.username || "",
                  email: profile?.email || "",
                  bio: profile?.bio || "",
                  profile_pic: profile?.profile_pic || "",
                });
              }}
              style={{ flex: 1, minWidth: 160 }}
            >
              Cancel
            </Button>
          </div>
        </form>
      </main>
    </PageShell>
  );
}

export default Login;

function FieldLabel({ label, children }) {
  return (
    <div>
      <label style={styles.label}>{label}</label>
      {children}
    </div>
  );
}

const styles = {
  page: {
    minHeight: "100vh",
    overflowY: "auto",
    overflowX: "hidden",
    position: "relative",
    display: "flex",
    alignItems: "flex-start",
    justifyContent: "center",
    padding: "clamp(16px, 3vw, 32px)",
    background:
      "radial-gradient(circle at top, #1a2440 0%, #0b1020 48%, #070b14 100%)",
    color: "#fff",
    fontFamily:
      "system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
    scrollbarGutter: "stable",
},
  bgOrbA: {
    position: "absolute",
    inset: "auto auto 10% -8%",
    width: 320,
    height: 320,
    borderRadius: "50%",
    background: "rgba(139,92,246,0.18)",
    filter: "blur(50px)",
    pointerEvents: "none",
  },
  bgOrbB: {
    position: "absolute",
    inset: "8% -8% auto auto",
    width: 280,
    height: 280,
    borderRadius: "50%",
    background: "rgba(56,189,248,0.12)",
    filter: "blur(50px)",
    pointerEvents: "none",
  },
  bgGrid: {
    position: "absolute",
    inset: 0,
    backgroundImage:
      "linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px)",
    backgroundSize: "42px 42px",
    maskImage:
      "linear-gradient(to bottom, rgba(0,0,0,0.55), rgba(0,0,0,0.12), rgba(0,0,0,0.55))",
    pointerEvents: "none",
    opacity: 0.5,
  },
  shell: {
    width: "100%",
    maxWidth: 680,
    position: "relative",
    zIndex: 1,
  },
  shellWide: {
    width: "100%",
    maxWidth: 1380,
    position: "relative",
    zIndex: 1,
  },
  brandRow: {
    display: "flex",
    alignItems: "center",
    gap: 12,
    marginBottom: 16,
    padding: "0 6px",
  },
  brandMark: {
    width: 46,
    height: 46,
    borderRadius: 16,
    display: "grid",
    placeItems: "center",
    fontWeight: 800,
    letterSpacing: "-0.04em",
    background: "linear-gradient(135deg, #8b5cf6 0%, #6366f1 100%)",
    boxShadow: "0 14px 30px rgba(99,102,241,0.28)",
    flexShrink: 0,
  },
  brandName: {
    fontSize: 18,
    fontWeight: 800,
    lineHeight: 1.1,
    letterSpacing: "-0.02em",
  },
  brandTag: {
    fontSize: 12,
    opacity: 0.72,
    marginTop: 3,
  },
  card: {
    borderRadius: 28,
    padding: "clamp(18px, 3vw, 28px)",
    background: "rgba(15, 20, 36, 0.82)",
    border: "1px solid rgba(255,255,255,0.08)",
    boxShadow: "0 24px 70px rgba(0,0,0,0.38)",
    backdropFilter: "blur(18px)",
    WebkitBackdropFilter: "blur(18px)",
    overflow: "hidden",
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
    lineHeight: 1,
  },
  title: {
    margin: 0,
    fontSize: "clamp(24px, 4vw, 34px)",
    fontWeight: 850,
    letterSpacing: "-0.04em",
    lineHeight: 1.08,
  },
  subtitle: {
    marginTop: 10,
    marginBottom: 22,
    fontSize: 14,
    lineHeight: 1.65,
    opacity: 0.78,
  },
  authLayout: {
    display: "grid",
    gridTemplateColumns: "minmax(0, 0.95fr) minmax(0, 1.05fr)",
    gap: 18,
    alignItems: "stretch",
  },
  sidePanel: {
    position: "relative",
    overflow: "hidden",
    borderRadius: 26,
    padding: 22,
    border: "1px solid rgba(255,255,255,0.08)",
    background: "linear-gradient(180deg, rgba(24,20,40,0.85), rgba(16,14,28,0.78))",
    minHeight: 420,
  },
  sideGlowA: {
    position: "absolute",
    inset: "auto -40px -40px auto",
    width: 180,
    height: 180,
    borderRadius: "50%",
    background: "rgba(139,92,246,0.16)",
    filter: "blur(40px)",
  },
  sideGlowB: {
    position: "absolute",
    inset: "-40px auto auto -40px",
    width: 180,
    height: 180,
    borderRadius: "50%",
    background: "rgba(56,189,248,0.10)",
    filter: "blur(40px)",
  },
  sideBadge: {
    display: "inline-flex",
    alignItems: "center",
    padding: "6px 12px",
    borderRadius: 999,
    background: "rgba(255,255,255,0.08)",
    color: "#ddd6fe",
    fontSize: 12,
    fontWeight: 700,
    position: "relative",
    zIndex: 1,
  },
  sideTitle: {
    position: "relative",
    zIndex: 1,
    margin: "18px 0 8px",
    fontSize: 26,
    lineHeight: 1.08,
    letterSpacing: "-0.04em",
    maxWidth: 430,
  },
  sideText: {
    position: "relative",
    zIndex: 1,
    margin: 0,
    color: "rgba(255,255,255,0.68)",
    lineHeight: 1.7,
    fontSize: 14,
    maxWidth: 430,
  },
  featureList: {
    position: "relative",
    zIndex: 1,
    marginTop: 22,
    display: "grid",
    gap: 12,
  },
  featureItem: {
    display: "flex",
    alignItems: "center",
    gap: 10,
    padding: "12px 14px",
    borderRadius: 18,
    background: "rgba(255,255,255,0.04)",
    border: "1px solid rgba(255,255,255,0.06)",
    color: "rgba(255,255,255,0.82)",
    fontSize: 14,
  },
  featureDot: {
    width: 10,
    height: 10,
    borderRadius: "50%",
    background: "linear-gradient(135deg, #8b5cf6 0%, #6366f1 100%)",
    boxShadow: "0 0 0 4px rgba(139,92,246,0.12)",
    flexShrink: 0,
  },
  formPanel: {
    borderRadius: 26,
    padding: 4,
  },
  form: {
    display: "grid",
    gap: 14,
  },
  label: {
    display: "block",
    marginBottom: 8,
    fontSize: 13,
    fontWeight: 700,
    color: "rgba(255,255,255,0.75)",
    letterSpacing: "0.01em",
  },
  input: {
    width: "100%",
    height: 50,
    borderRadius: 16,
    border: "1px solid rgba(255,255,255,0.10)",
    background: "rgba(255,255,255,0.05)",
    color: "#fff",
    padding: "0 16px",
    outline: "none",
    fontSize: 15,
    boxSizing: "border-box",
    transition: "border-color 0.2s ease, background 0.2s ease, transform 0.2s ease",
  },
  textarea: {
    width: "100%",
    minHeight: 118,
    borderRadius: 16,
    border: "1px solid rgba(255,255,255,0.10)",
    background: "rgba(255,255,255,0.05)",
    color: "#fff",
    padding: "14px 16px",
    outline: "none",
    fontSize: 15,
    boxSizing: "border-box",
    resize: "vertical",
    lineHeight: 1.55,
    fontFamily: "inherit",
    transition: "border-color 0.2s ease, background 0.2s ease",
  },
  button: {
    minHeight: 50,
    border: "none",
    borderRadius: 16,
    cursor: "pointer",
    fontWeight: 750,
    color: "#fff",
    background: "linear-gradient(135deg, #8b5cf6 0%, #6366f1 100%)",
    boxShadow: "0 12px 26px rgba(99,102,241,0.28)",
    transition: "transform 0.18s ease, opacity 0.2s ease, box-shadow 0.2s ease",
    padding: "12px 16px",
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
    paddingRight: 76,
  },
  showBtn: {
    position: "absolute",
    right: 10,
    top: 10,
    height: 30,
    padding: "0 11px",
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
    lineHeight: 1.5,
  },
  footerTextInline: {
    fontSize: 13,
    opacity: 0.82,
    lineHeight: 1.5,
  },
  linkRow: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    gap: 8,
    flexWrap: "wrap",
    fontSize: 13,
    textAlign: "center",
  },
  link: {
    color: "#c4b5fd",
    textDecoration: "none",
    fontWeight: 750,
  },
  dot: {
    opacity: 0.45,
  },
  loadingBlock: {
    display: "grid",
    justifyItems: "center",
    gap: 12,
    padding: "22px 0 8px",
  },
  spinner: {
    width: 32,
    height: 32,
    borderRadius: "50%",
    border: "3px solid rgba(255,255,255,0.16)",
    borderTopColor: "#8b5cf6",
    animation: "spin 1s linear infinite",
  },
  loadingText: {
    opacity: 0.8,
    fontSize: 14,
  },
  profileWrap: {
    display: "grid",
    gap: 18,
  },
  profileTopRow: {
    display: "flex",
    alignItems: "flex-start",
    justifyContent: "space-between",
    gap: 14,
    flexWrap: "wrap",
  },
  profileSectionTitle: {
    margin: 0,
    fontSize: 24,
    fontWeight: 850,
    letterSpacing: "-0.03em",
  },
  profileGrid: {
    display: "grid",
    gridTemplateColumns: "minmax(250px, 300px) minmax(0, 1fr)",
    gap: 18,
    alignItems: "start",
  },
  profileSidebar: {
    borderRadius: 26,
    padding: 18,
    background: "rgba(24, 20, 40, 0.78)",
    border: "1px solid rgba(255,255,255,0.07)",
    boxShadow: "inset 0 1px 0 rgba(255,255,255,0.04)",
  },
  profileHeader: {
    display: "flex",
    alignItems: "center",
    gap: 14,
    marginBottom: 14,
  },
  avatar: {
    width: 72,
    height: 72,
    borderRadius: 22,
    overflow: "hidden",
    display: "grid",
    placeItems: "center",
    background: "linear-gradient(135deg, #8b5cf6 0%, #6366f1 100%)",
    fontWeight: 850,
    fontSize: 24,
    flexShrink: 0,
    boxShadow: "0 14px 24px rgba(99,102,241,0.25)",
  },
  avatarImage: {
    width: "100%",
    height: "100%",
    objectFit: "cover",
    display: "block",
  },
  profileMeta: {
    minWidth: 0,
  },
  profileName: {
    fontSize: "clamp(18px, 3vw, 22px)",
    fontWeight: 850,
    lineHeight: 1.2,
    wordBreak: "break-word",
  },
  profileUsername: {
    fontSize: 13,
    opacity: 0.72,
    marginTop: 4,
    wordBreak: "break-word",
  },
  profileEmail: {
    fontSize: 13,
    opacity: 0.75,
    marginTop: 4,
    wordBreak: "break-word",
    lineHeight: 1.45,
  },
  profileJoined: {
    borderRadius: 18,
    padding: "12px 14px",
    marginTop: 10,
    fontSize: 14,
    lineHeight: 1.6,
    color: "rgba(255,255,255,0.84)",
  },
  profileMain: {
    borderRadius: 26,
    padding: 18,
    background: "rgba(20, 16, 34, 0.80)",
    border: "1px solid rgba(255,255,255,0.07)",
  },
  mainTopBar: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 14,
    flexWrap: "wrap",
    marginBottom: 18,
  },
  mainHeading: {
    margin: 0,
    fontSize: 18,
    fontWeight: 800,
    letterSpacing: "-0.02em",
  },
  mainSubheading: {
    margin: "6px 0 0",
    fontSize: 13,
    lineHeight: 1.6,
    color: "rgba(255,255,255,0.52)",
  },
  mainChip: {
    padding: "10px 15px",
    borderRadius: 999,
    background: "rgba(255,255,255,0.06)",
    border: "1px solid rgba(255,255,255,0.08)",
    color: "rgba(255,255,255,0.75)",
    fontSize: 15,
    fontWeight: 700,
  },
  profileForm: {
    display: "grid",
    gap: 14,
  },
  fieldGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(2, minmax(0, 1fr))",
    gap: 14,
  },
  actionRow: {
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

    * {
      box-sizing: border-box;
    }

    button:hover {
      transform: translateY(-1px);
    }

    button:active {
      transform: translateY(0);
    }

    button:disabled {
      opacity: 0.72;
      cursor: not-allowed;
      transform: none;
    }

    input:disabled, textarea:disabled {
      opacity: 0.86;
      cursor: not-allowed;
    }

    input::placeholder, textarea::placeholder {
      color: rgba(255,255,255,0.42);
    }

    input:focus, textarea:focus {
      border-color: rgba(139, 92, 246, 0.8) !important;
      background: rgba(255,255,255,0.07) !important;
      box-shadow: 0 0 0 4px rgba(139, 92, 246, 0.15);
    }

    @media (max-width: 960px) {
      .auth-layout,
      .profile-grid {
        grid-template-columns: 1fr !important;
      }
    }

    @media (max-width: 700px) {
      .field-grid {
        grid-template-columns: 1fr !important;
      }
    }

    @media (max-width: 560px) {
      .page-shell-card {
        border-radius: 22px !important;
      }
    }
  `;
  document.head.appendChild(style);
}