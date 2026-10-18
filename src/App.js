import React, { useEffect } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
  useLocation,
  useParams,
} from "react-router-dom";

import Dashboard from "./App/Dashboard";
import LandingPage from "./components/landing/LandingPage";
import {
  Register,
  Login,
  ForgotPassword,
  ResetPassword,
} from "./components/auth";

import { AuthProvider, useAuth } from "./context/AuthContext";
import { ThemeProvider } from "./context/ThemeContext";
import "./App.css";

// ==============================
// GLOBAL ERROR BOUNDARY
// ==============================
class GlobalErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error("Uncaught error caught by GlobalErrorBoundary:", error, errorInfo);
  }

  handleReload = () => {
    this.setState({ hasError: false, error: null });
    window.location.reload();
  };

  render() {
    if (this.state.hasError) {
      return (
        <div
          style={{
            minHeight: "100vh",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            background: "#090d18",
            color: "#ffffff",
            fontFamily: "system-ui, -apple-system, sans-serif",
            padding: "20px",
            textAlign: "center",
          }}
        >
          <div
            style={{
              background: "rgba(255, 255, 255, 0.05)",
              border: "1px solid rgba(255, 255, 255, 0.1)",
              borderRadius: "16px",
              padding: "40px 32px",
              maxWidth: "480px",
              width: "100%",
              boxShadow: "0 20px 40px rgba(0,0,0,0.4)",
            }}
          >
            <div style={{ fontSize: "48px", marginBottom: "16px" }}>⚠️</div>
            <h2 style={{ fontSize: "22px", fontWeight: "700", marginBottom: "8px" }}>
              Something Went Wrong
            </h2>
            <p style={{ fontSize: "14px", color: "rgba(255, 255, 255, 0.7)", marginBottom: "24px" }}>
              An unexpected application error occurred. Click below to reload the app.
            </p>
            <button
              onClick={this.handleReload}
              style={{
                background: "linear-gradient(135deg, #6366f1, #8b5cf6)",
                color: "#ffffff",
                border: "none",
                borderRadius: "8px",
                padding: "12px 24px",
                fontSize: "14px",
                fontWeight: "600",
                cursor: "pointer",
                transition: "transform 0.2s ease, opacity 0.2s ease",
              }}
            >
              Reload Application
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

// ==============================
// PRIVATE ROUTE GUARD
// ==============================
const PrivateRoute = ({ children }) => {
  const { isAuthenticated } = useAuth();

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

// ==============================
// PUBLIC ROUTE GUARD
// ==============================
const PublicRoute = ({ children }) => {
  const { isAuthenticated } = useAuth();

  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />;
  }

  return children;
};

// ==============================
// DIRECT APP ROUTE WRAPPER
// ==============================
const AppRouteWrapper = () => {
  const { appId } = useParams();
  return <Dashboard initialTab="apps" initialApp={appId} />;
};

// ==============================
// SEO & METADATA HEAD UPDATER
// ==============================
const PageTitleUpdater = () => {
  const location = useLocation();

  useEffect(() => {
    const path = location.pathname;
    let title = "Vitya AI | Autonomous Multimodal Workstation";
    let description = "Vitya AI is an autonomous multimodal intelligence platform uniting AI Presentation Studio, Vidya F.E.I personal wealth intelligence, DORA health triage, and research.";
    let robots = "index, follow, max-snippet:-1, max-image-preview:large, max-video-preview:-1";
    let keywords = "AI presentation generator, personal finance AI, receipt OCR scanner, DORA health AI, symptom triage";

    if (path === "/" || path === "") {
      title = "Vitya AI | Autonomous Multimodal AI Workstation & Wealth Intelligence";
      description = "Vitya AI unites AI Presentation Studio (automated PPTX with Edge-TTS voiceovers), Vidya F.E.I personal wealth management, DORA clinical health triage, and deep document research.";
      keywords = "AI presentation generator, automated pitch deck maker, personal finance AI, double-entry accounting software, receipt OCR scanner, DORA health AI, Vitya AI";
    } else if (path.startsWith("/presentation")) {
      title = "AI Presentation Studio | Autonomous PPTX Generator | Vitya AI";
      description = "Generate executive 16:9 presentation decks from natural language with automated spatial layouts, 21 content plugins, and Edge-TTS voice narration.";
      keywords = "AI presentation maker, generate powerpoint with AI, automated pitch deck, PPTX generator, Edge-TTS narration, presentation studio";
    } else if (path.startsWith("/finance") || path.startsWith("/fei")) {
      title = "Vidya F.E.I | AI Personal Wealth & Double-Entry Accounting | Vitya AI";
      description = "Track finances with double-entry precision, forecast cashflow with scikit-learn machine learning, optimize savings goals, and check your 0-100 Financial Health Score.";
      keywords = "personal finance AI, double-entry accounting software, financial health score, expense forecasting, savings tracker, Vidya FEI";
    } else if (path.startsWith("/scan-ledger") || path.startsWith("/scanner")) {
      title = "AI Vision Receipt Ledger | Optical Character Recognition | Vitya AI";
      description = "Instantly scan paper receipts and invoices using computer vision OCR. Automatically categorize expenses, calculate tax deductions, and update your ledger.";
      keywords = "receipt OCR scanner, invoice scanner AI, automated bookkeeping, receipt ledger, expense tracking OCR";
    } else if (path.startsWith("/dora")) {
      title = "DORA Health AI | Clinical Triage & Diagnostic Intelligence | Vitya AI";
      description = "Clinical triage classifier analyzing 130+ symptom vectors. Get rapid differential diagnostic suggestions, triage urgency levels, and specialist guidance.";
      keywords = "clinical triage AI, symptom checker, medical diagnostic AI, DORA health, healthcare assistant";
    } else if (path.startsWith("/research")) {
      title = "Research Lab & Deep Document Intelligence | Vitya AI";
      description = "Synthesize complex multi-document repositories, execute multimodal RAG queries, and cross-reference citations with precision.";
      keywords = "deep research AI, document synthesis, multimodal RAG, academic research assistant, document intelligence";
    } else if (path.startsWith("/voice-notes") || path.startsWith("/voicenotes") || path.startsWith("/audio-brain")) {
      title = "Voice Notes & Audio Brain | Whisper Meeting Intelligence | Vitya AI";
      description = "Capture voice thoughts and meetings with Whisper speech recognition. Automatically extract action items, summarize dialogues, and synchronize tasks.";
      keywords = "AI voice notes, Whisper transcription, meeting summary AI, audio brain, speech to action items";
    } else if (path.startsWith("/automations") || path.startsWith("/routines")) {
      title = "Neural Automations & Smart Routines | Vitya AI";
      description = "Set up autonomous background routines, smart scheduled workflows, calendar syncing, and automated enterprise triggers.";
      keywords = "workflow automation AI, scheduled routines, autonomous agents, productivity automations";
    } else if (path.startsWith("/login")) {
      title = "Sign In | Vitya AI";
      description = "Sign in to your Vitya AI unified workspace to access Presentation Studio, Vidya F.E.I wealth analytics, and DORA health.";
      robots = "index, follow";
    } else if (path.startsWith("/register")) {
      title = "Create Your Free Account | Vitya AI";
      description = "Get started with Vitya AI today. Launch your autonomous multimodal workstation for presentations, finance, and research.";
      robots = "index, follow";
    } else if (path.startsWith("/forgot-password") || path.startsWith("/reset-password")) {
      title = "Account Recovery | Vitya AI";
      description = "Reset your Vitya AI password securely.";
      robots = "noindex, nofollow";
    } else if (path.startsWith("/profile") || path.startsWith("/settings") || path.startsWith("/dashboard")) {
      title = "User Workspace | Vitya AI";
      description = "Vitya AI authenticated workspace.";
      robots = "noindex, nofollow";
    }

    document.title = title;

    const setMeta = (attr, key, val) => {
      let tag = document.querySelector(`meta[${attr}="${key}"]`);
      if (!tag) {
        tag = document.createElement("meta");
        tag.setAttribute(attr, key);
        document.head.appendChild(tag);
      }
      tag.setAttribute("content", val);
    };

    setMeta("name", "description", description);
    setMeta("name", "keywords", keywords);
    setMeta("name", "robots", robots);
    setMeta("property", "og:title", title);
    setMeta("property", "og:description", description);
    setMeta("property", "og:url", `https://vitya-chat.onrender.com${path === "/" ? "" : path}`);
    setMeta("name", "twitter:title", title);
    setMeta("name", "twitter:description", description);

    let canon = document.querySelector('link[rel="canonical"]');
    if (!canon) {
      canon = document.createElement("link");
      canon.setAttribute("rel", "canonical");
      document.head.appendChild(canon);
    }
    canon.setAttribute("href", `https://vitya-chat.onrender.com${path === "/" ? "" : path}`);
  }, [location]);

  return null;
};

// ==============================
// MAIN APP ROUTES
// ==============================
function AppRoutes() {
  const { isAuthenticated } = useAuth();

  return (
    <>
      <PageTitleUpdater />
      <Routes>
        {/* HOME ROUTE */}
        <Route
          path="/"
          element={
            isAuthenticated ? (
              <Navigate to="/dashboard" replace />
            ) : (
              <LandingPage />
            )
          }
        />

        {/* PUBLIC AUTH ROUTES */}
        <Route
          path="/login"
          element={
            <PublicRoute>
              <Login />
            </PublicRoute>
          }
        />
        <Route
          path="/register"
          element={
            <PublicRoute>
              <Register />
            </PublicRoute>
          }
        />
        <Route
          path="/forgot-password"
          element={
            <PublicRoute>
              <ForgotPassword />
            </PublicRoute>
          }
        />
        <Route
          path="/reset-password"
          element={
            <PublicRoute>
              <ResetPassword />
            </PublicRoute>
          }
        />

        {/* PROTECTED DASHBOARD & SUB-APP ROUTES */}
        <Route
          path="/dashboard"
          element={
            <PrivateRoute>
              <Dashboard />
            </PrivateRoute>
          }
        />
        <Route
          path="/chatbot"
          element={
            <PrivateRoute>
              <Dashboard initialTab="chat" />
            </PrivateRoute>
          }
        />
        <Route
          path="/presentation"
          element={
            <PrivateRoute>
              <Dashboard initialTab="presentation" />
            </PrivateRoute>
          }
        />
        <Route
          path="/research"
          element={
            <PrivateRoute>
              <Dashboard initialTab="apps" initialApp="research" />
            </PrivateRoute>
          }
        />
        <Route
          path="/scan-ledger"
          element={
            <PrivateRoute>
              <Dashboard initialTab="apps" initialApp="scan-ledger" />
            </PrivateRoute>
          }
        />
        <Route
          path="/scanner"
          element={
            <PrivateRoute>
              <Dashboard initialTab="apps" initialApp="scan-ledger" />
            </PrivateRoute>
          }
        />
        <Route
          path="/automations"
          element={
            <PrivateRoute>
              <Dashboard initialTab="apps" initialApp="automations" />
            </PrivateRoute>
          }
        />
        <Route
          path="/routines"
          element={
            <PrivateRoute>
              <Dashboard initialTab="apps" initialApp="automations" />
            </PrivateRoute>
          }
        />
        <Route
          path="/voice-notes"
          element={
            <PrivateRoute>
              <Dashboard initialTab="apps" initialApp="voice-notes" />
            </PrivateRoute>
          }
        />
        <Route
          path="/voicenotes"
          element={
            <PrivateRoute>
              <Dashboard initialTab="apps" initialApp="voice-notes" />
            </PrivateRoute>
          }
        />
        <Route
          path="/audio-brain"
          element={
            <PrivateRoute>
              <Dashboard initialTab="apps" initialApp="voice-notes" />
            </PrivateRoute>
          }
        />
        <Route
          path="/dora"
          element={
            <PrivateRoute>
              <Dashboard initialTab="apps" initialApp="dora" />
            </PrivateRoute>
          }
        />
        <Route
          path="/finance"
          element={
            <PrivateRoute>
              <Dashboard initialTab="apps" initialApp="finance" />
            </PrivateRoute>
          }
        />
        <Route
          path="/fei"
          element={
            <PrivateRoute>
              <Dashboard initialTab="apps" initialApp="finance" />
            </PrivateRoute>
          }
        />
        <Route
          path="/apps"
          element={
            <PrivateRoute>
              <Dashboard initialTab="apps" />
            </PrivateRoute>
          }
        />
        <Route
          path="/apps/:appId"
          element={
            <PrivateRoute>
              <AppRouteWrapper />
            </PrivateRoute>
          }
        />

        {/* PROTECTED PROFILE & SETTINGS ROUTES */}
        <Route
          path="/profile"
          element={
            <PrivateRoute>
              <Dashboard initialTab="profile" />
            </PrivateRoute>
          }
        />
        <Route
          path="/profile/edit"
          element={
            <PrivateRoute>
              <Dashboard initialTab="profile/edit" />
            </PrivateRoute>
          }
        />
        <Route
          path="/settings"
          element={
            <PrivateRoute>
              <Dashboard initialTab="settings" />
            </PrivateRoute>
          }
        />
        <Route
          path="/settings/security"
          element={
            <PrivateRoute>
              <Dashboard initialTab="settings/security" />
            </PrivateRoute>
          }
        />
        <Route
          path="/settings/subscription"
          element={
            <PrivateRoute>
              <Dashboard initialTab="settings/subscription" />
            </PrivateRoute>
          }
        />
        <Route
          path="/settings/notifications"
          element={
            <PrivateRoute>
              <Dashboard initialTab="settings/notifications" />
            </PrivateRoute>
          }
        />
        <Route
          path="/settings/appearance"
          element={
            <PrivateRoute>
              <Dashboard initialTab="settings/appearance" />
            </PrivateRoute>
          }
        />
        <Route
          path="/settings/about"
          element={
            <PrivateRoute>
              <Dashboard initialTab="settings/about" />
            </PrivateRoute>
          }
        />
        <Route
          path="/settings/help"
          element={
            <PrivateRoute>
              <Dashboard initialTab="settings/help" />
            </PrivateRoute>
          }
        />

        {/* 404 FALLBACK */}
        <Route
          path="*"
          element={
            <Navigate
              to={isAuthenticated ? "/dashboard" : "/login"}
              replace
            />
          }
        />
      </Routes>
    </>
  );
}

// ==============================
// ROOT APP COMPONENT
// ==============================
function App() {
  return (
    <GlobalErrorBoundary>
      <ThemeProvider>
        <AuthProvider>
          <Router>
            <AppRoutes />
          </Router>
        </AuthProvider>
      </ThemeProvider>
    </GlobalErrorBoundary>
  );
}

export default App;