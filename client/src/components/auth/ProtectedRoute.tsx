// Import React for component creation
import React from "react";
// Import Navigate for programmatic navigation
import { Navigate } from "react-router-dom";
// Import custom authentication context hook
import { useAuth } from "../../contexts/AuthContext";

// Interface defining the props for ProtectedRoute component
interface ProtectedRouteProps {
  children: React.ReactNode;
}

// ProtectedRoute component that wraps content requiring authentication
// Redirects to login if user is not authenticated, shows loading spinner while checking auth
const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        {" "}
        <div className="spinner"></div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
};

// Export the ProtectedRoute component as default
export default ProtectedRoute;
