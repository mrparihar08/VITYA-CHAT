import React from "react";
import {
  api,
  API_BASE_URL as API_URL,
  getAuthHeaders,
  resolveAssetUrl,
  handleApiError,
} from "../../services/api";
import "./Auth.css";

export { api, API_URL, getAuthHeaders, resolveAssetUrl, handleApiError };

export const validateEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
export const validatePassword = (pass) => pass.length >= 6;

export const saveUserToStorage = (profile) => {
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

export const fetchProfile = async (token) => {
  // Axios expects request headers inside a `headers` object. This is especially
  // important immediately after login, before the token has been stored yet.
  const res = await api.get("/api/users/profile", {
    headers: getAuthHeaders(token),
  });
  return res.data;
};

export const loadProfileIntoStorage = async (token) => {
  const profile = await fetchProfile(token);
  saveUserToStorage(profile);
  return profile;
};

export const PageShell = ({
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

export const Input = ({ style, className = "", ...props }) => (
  <input {...props} className={className} style={{ ...styles.input, ...style }} />
);

export const Textarea = ({ style, className = "", ...props }) => (
  <textarea
    {...props}
    className={className}
    style={{ ...styles.textarea, ...style }}
  />
);

export const Button = ({
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

export const PasswordField = ({
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

export function FieldLabel({ label, children }) {
  return (
    <div>
      <label style={styles.label}>{label}</label>
      {children}
    </div>
  );
}

export const AuthSidePanel = () => (
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

export const styles = {
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
