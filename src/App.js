import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";

import { Register, Login, Profile } from "./App/ProfilePage";
import Dashboard from "./App/Dashboard";

import "./App.css";

// ✅ Protect routes
const PrivateRoute = ({ children }) => {
  const token = localStorage.getItem("token");
  return token ? children : <Navigate to="/login" replace />;
};

function App() {
  return (
    <Router>
      <Routes>

        {/* ✅ Default route */}
        <Route path="/" element={<Navigate to="/dashboard" replace />} />

        {/* ✅ Public routes */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

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

        {/* ✅ Optional fallback */}
        <Route path="*" element={<Navigate to="/login" />} />

      </Routes>
    </Router>
  );
}

export default App;