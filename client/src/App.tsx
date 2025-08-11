// Import React for component creation
import React from "react";
// Import React Router components for navigation and routing
import { Routes, Route, Navigate } from "react-router-dom";
// Import custom authentication context hook
import { useAuth } from "./contexts/AuthContext";
// Import layout components for navigation and sidebar
import Navbar from "./components/layout/Navbar";
import Sidebar from "./components/layout/Sidebar";
// Import landing page for non-authenticated users
import LandingPage from "./pages/LandingPage";
// Import authentication pages
import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";
import VerifyEmail from "./pages/auth/VerifyEmail";
import ForgotPassword from "./pages/auth/ForgotPassword";
import ResetPassword from "./pages/auth/ResetPassword";
// Import main application pages for authenticated users
import Dashboard from "./pages/Dashboard";
import Notes from "./pages/Notes";
import NoteEditor from "./pages/NoteEditor";
import AIFeatures from "./pages/AIFeatures";
import Flashcards from "./pages/Flashcards";
import Citations from "./pages/Citations";
import Profile from "./pages/Profile";
import Pricing from "./pages/Pricing";
import UniversityPartnership from "./pages/UniversityPartnership";
// Import protected route wrapper for authenticated-only pages
import ProtectedRoute from "./components/auth/ProtectedRoute";
// Import Error Boundary for graceful error handling
import ErrorBoundary from "./components/ErrorBoundary";

// Main App component that handles routing and authentication state
const App: React.FC = () => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="spinner"></div>
      </div>
    );
  }

  if (!user) {
    return (
      <Routes>
        <Route path="/" element={<LandingPage />} />

        <Route path="/login" element={<Login />} />

        <Route path="/register" element={<Register />} />

        <Route path="/verify-email" element={<VerifyEmail />} />

        <Route path="/forgot-password" element={<ForgotPassword />} />

        <Route path="/reset-password" element={<ResetPassword />} />

        <Route path="/pricing" element={<Pricing />} />

        <Route
          path="/university-partnership"
          element={<UniversityPartnership />}
        />

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    );
  }

  return (
    <ErrorBoundary>
      <div className="min-h-screen bg-gray-50">
        <Navbar />

        <div className="flex">
          <Sidebar />

          <main className="flex-1 p-6">
            <Routes>
              <Route path="/" element={<Navigate to="/dashboard" replace />} />

              <Route
                path="/dashboard"
                element={
                  <ProtectedRoute>
                    <Dashboard />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/notes"
                element={
                  <ProtectedRoute>
                    <Notes />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/notes/new"
                element={
                  <ProtectedRoute>
                    <NoteEditor />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/notes/:id"
                element={
                  <ProtectedRoute>
                    <NoteEditor />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/ai-features"
                element={
                  <ProtectedRoute>
                    <AIFeatures />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/flashcards"
                element={
                  <ProtectedRoute>
                    <Flashcards />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/citations"
                element={
                  <ProtectedRoute>
                    <Citations />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/profile"
                element={
                  <ProtectedRoute>
                    <Profile />
                  </ProtectedRoute>
                }
              />

              <Route path="/pricing" element={<Pricing />} />

              <Route
                path="/university-partnership"
                element={<UniversityPartnership />}
              />

              <Route path="*" element={<Navigate to="/dashboard" replace />} />
            </Routes>
          </main>
        </div>
      </div>
    </ErrorBoundary>
  );
};

// Export the App component as default
export default App;
