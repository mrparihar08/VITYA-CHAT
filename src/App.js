import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";

import { Register, Login, Profile } from "./App/ProfilePage";
import Dashboard from "./App/Dashboard";

import "./App.css";

// ✅ Protected Route Component
const PrivateRoute = ({ children }) => {
  const token = localStorage.getItem("token");

  // 🔒 If no token → redirect to login
  if (!token) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

function App() {
  const token = localStorage.getItem("token");

  return (
    <Router>
      <Routes>

        {/* ✅ Smart default route */}
        <Route
          path="/"
          element={
            token ? <Navigate to="/dashboard" replace /> : <Navigate to="/login" replace />
          }
        />

        {/* ✅ Public routes */}
        <Route path="/login" element={token ? <Navigate to="/dashboard" /> : <Login />} />
        <Route path="/register" element={token ? <Navigate to="/dashboard" /> : <Register />} />

        {/* ✅ Protected routes */}
        <Route
          path="/dashboard"
          element={
            <PrivateRoute>
              <Dashboard />
            </PrivateRoute>
          }
        />

        <Route
          path="/profile"
          element={
            <PrivateRoute>
              <Profile />
            </PrivateRoute>
          }
        />

        {/* ✅ Fallback route */}
        <Route
          path="*"
          element={<Navigate to={token ? "/dashboard" : "/login"} replace />}
        />

      </Routes>
    </Router>
  );
}

export default App;