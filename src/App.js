import React, { useEffect } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
  useLocation,
  useParams,
} from "react-router-dom";

import {
  Dashboard,
  Register,
  Login,
  ProfileEdit,
  ForgotPassword,
  ResetPassword,
} from "./App/index";

import {
  SecurityPrivacyPage,
  SubscriptionPage,
  NotificationsPage,
  AppearancePage,
  AboutPage,
} from "./components/profile";

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
// PAGE TITLE UPDATER
// ==============================
const PageTitleUpdater = () => {
  const location = useLocation();

  useEffect(() => {
    const path = location.pathname;
    let title = "Vitya AI";

    if (path.startsWith("/login")) title = "Login | Vitya AI";
    else if (path.startsWith("/register")) title = "Register | Vitya AI";
    else if (path.startsWith("/forgot-password")) title = "Forgot Password | Vitya AI";
    else if (path.startsWith("/reset-password")) title = "Reset Password | Vitya AI";
    else if (path.startsWith("/profile/edit")) title = "Edit Profile | Vitya AI";
    else if (path.startsWith("/profile")) title = "Profile | Vitya AI";
    else if (path.startsWith("/settings/security")) title = "Security & Privacy | Vitya AI";
    else if (path.startsWith("/settings/subscription")) title = "Subscription | Vitya AI";
    else if (path.startsWith("/settings/notifications")) title = "Notifications | Vitya AI";
    else if (path.startsWith("/settings/appearance")) title = "Appearance | Vitya AI";
    else if (path.startsWith("/settings/about")) title = "About Vitya AI | Vitya AI";
    else if (path.startsWith("/presentation")) title = "Presentation Studio | Vitya AI";
    else if (path.startsWith("/chatbot")) title = "AI Assistant | Vitya AI";
    else if (path.startsWith("/apps")) title = "Apps Workspace | Vitya AI";
    else if (path.startsWith("/dashboard")) title = "Dashboard | Vitya AI";

    document.title = title;
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
              <Navigate to="/login" replace />
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
              <ProfileEdit />
            </PrivateRoute>
          }
        />
        <Route
          path="/settings/security"
          element={
            <PrivateRoute>
              <SecurityPrivacyPage />
            </PrivateRoute>
          }
        />
        <Route
          path="/settings/subscription"
          element={
            <PrivateRoute>
              <SubscriptionPage />
            </PrivateRoute>
          }
        />
        <Route
          path="/settings/notifications"
          element={
            <PrivateRoute>
              <NotificationsPage />
            </PrivateRoute>
          }
        />
        <Route
          path="/settings/appearance"
          element={
            <PrivateRoute>
              <AppearancePage />
            </PrivateRoute>
          }
        />
        <Route
          path="/settings/about"
          element={
            <PrivateRoute>
              <AboutPage />
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