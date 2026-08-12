import React, { useState } from "react";

import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";

import {
  Register,
  Login,
  Profile,
  ProfileEdit,
  ForgotPassword,
  ResetPassword,
} from "./App/ProfilePage";

import Dashboard from "./App/Dashboard";
import "./App.css";

// ==============================
// PRIVATE ROUTE
// ==============================
const PrivateRoute = ({ children }) => {
  const token = localStorage.getItem("token");

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

// ==============================
// PUBLIC ROUTE
// ==============================
const PublicRoute = ({ children }) => {
  const token = localStorage.getItem("token");

  if (token) {
    return <Navigate to="/dashboard" replace />;
  }

  return children;
};

// ==============================
// APP
// ==============================
function App() {
  // Force re-render when authentication changes
  const [isAuthenticated, setIsAuthenticated] = useState(
    !!localStorage.getItem("token")
  );

  return (
    <Router>
      <Routes>
        {/* ==============================
            HOME
        ============================== */}
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

        {/* ==============================
            LOGIN
        ============================== */}
        <Route
          path="/login"
          element={
            <PublicRoute>
              <Login />
            </PublicRoute>
          }
        />

        {/* ==============================
            REGISTER
        ============================== */}
        <Route
          path="/register"
          element={
            <PublicRoute>
              <Register />
            </PublicRoute>
          }
        />

        {/* ==============================
            FORGOT PASSWORD
        ============================== */}
        <Route
          path="/forgot-password"
          element={
            <PublicRoute>
              <ForgotPassword />
            </PublicRoute>
          }
        />

        {/* ==============================
            RESET PASSWORD
        ============================== */}
        <Route
          path="/reset-password"
          element={
            <PublicRoute>
              <ResetPassword />
            </PublicRoute>
          }
        />

        {/* ==============================
            DASHBOARD
        ============================== */}
        <Route
          path="/dashboard"
          element={
            <PrivateRoute>
              <Dashboard />
            </PrivateRoute>
          }
        />

        {/* ==============================
            PROFILE
        ============================== */}
        <Route
          path="/profile"
          element={
            <PrivateRoute>
              <Profile />
            </PrivateRoute>
          }
        />

        {/* ==============================
            PROFILE EDIT
        ============================== */}
        <Route
          path="/profile/edit"
          element={
            <PrivateRoute>
              <ProfileEdit />
            </PrivateRoute>
          }
        />

        {/* ==============================
            404
        ============================== */}
        <Route
          path="*"
          element={
            <Navigate
              to={
                isAuthenticated
                  ? "/dashboard"
                  : "/login"
              }
              replace
            />
          }
        />
      </Routes>
    </Router>
  );
}

export default App;