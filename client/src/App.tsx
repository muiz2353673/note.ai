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

// Main App component that handles routing and authentication state
const App: React.FC = () => {
  // Get user authentication state and loading status from context
  const { user, loading } = useAuth();

  // Show loading spinner while checking authentication status
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="spinner"></div> {/* Loading spinner component */}
      </div>
    );
  }

  // If user is not authenticated, show public routes only
  if (!user) {
    return (
      <Routes>
        {/* Public routes accessible to non-authenticated users */}
        <Route path="/" element={<LandingPage />} /> {/* Home page */}
        <Route path="/login" element={<Login />} /> {/* Login page */}
        <Route path="/register" element={<Register />} /> {/* Registration page */}
        <Route path="/verify-email" element={<VerifyEmail />} /> {/* Email verification page */}
        <Route path="/forgot-password" element={<ForgotPassword />} /> {/* Password reset request page */}
        <Route path="/reset-password" element={<ResetPassword />} /> {/* Password reset page */}
        <Route path="/pricing" element={<Pricing />} /> {/* Pricing information page */}
        <Route
          path="/university-partnership"
          element={<UniversityPartnership />} {/* University partnership page */}
        />
        {/* Redirect any unknown routes to home page */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    );
  }

  // If user is authenticated, show the main application layout
  return (
    <div className="min-h-screen bg-gray-50"> {/* Main container with gray background */}
      <Navbar /> {/* Top navigation bar */}
      <div className="flex"> {/* Flex container for sidebar and main content */}
        <Sidebar /> {/* Left sidebar navigation */}
        <main className="flex-1 p-6"> {/* Main content area with padding */}
          <Routes>
            {/* Redirect root to dashboard for authenticated users */}
            <Route path="/" element={<Navigate to="/dashboard" replace />} />
            
            {/* Protected routes that require authentication */}
            <Route
              path="/dashboard"
              element={
                <ProtectedRoute>
                  <Dashboard /> {/* Main dashboard page */}
                </ProtectedRoute>
              }
            />
            <Route
              path="/notes"
              element={
                <ProtectedRoute>
                  <Notes /> {/* Notes list page */}
                </ProtectedRoute>
              }
            />
            <Route
              path="/notes/new"
              element={
                <ProtectedRoute>
                  <NoteEditor /> {/* Create new note page */}
                </ProtectedRoute>
              }
            />
            <Route
              path="/notes/:id"
              element={
                <ProtectedRoute>
                  <NoteEditor /> {/* Edit existing note page */}
                </ProtectedRoute>
              }
            />
            <Route
              path="/ai-features"
              element={
                <ProtectedRoute>
                  <AIFeatures /> {/* AI-powered features page */}
                </ProtectedRoute>
              }
            />
            <Route
              path="/flashcards"
              element={
                <ProtectedRoute>
                  <Flashcards /> {/* Flashcards management page */}
                </ProtectedRoute>
              }
            />
            <Route
              path="/citations"
              element={
                <ProtectedRoute>
                  <Citations /> {/* Citation generation page */}
                </ProtectedRoute>
              }
            />
            <Route
              path="/profile"
              element={
                <ProtectedRoute>
                  <Profile /> {/* User profile management page */}
                </ProtectedRoute>
              }
            />
            
            {/* Public routes accessible to authenticated users */}
            <Route path="/pricing" element={<Pricing />} /> {/* Pricing information page */}
            <Route
              path="/university-partnership"
              element={<UniversityPartnership />} {/* University partnership page */}
            />
            
            {/* Redirect any unknown routes to dashboard for authenticated users */}
            <Route path="*" element={<Navigate to="/dashboard" replace />} />
          </Routes>
        </main>
      </div>
    </div>
  );
};

// Export the App component as default
export default App;
