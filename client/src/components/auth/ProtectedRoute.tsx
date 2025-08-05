// Import React for component creation
import React from "react";
// Import Navigate for programmatic navigation
import { Navigate } from "react-router-dom";
// Import custom authentication context hook
import { useAuth } from "../../contexts/AuthContext";

// Interface defining the props for ProtectedRoute component
interface ProtectedRouteProps {
  children: React.ReactNode; // React children to be protected
}

// ProtectedRoute component that wraps content requiring authentication
// Redirects to login if user is not authenticated, shows loading spinner while checking auth
const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  // Get user authentication state and loading status from context
  const { user, loading } = useAuth();

  // Show loading spinner while authentication status is being checked
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        {" "}
        {/* Full screen loading container */}
        <div className="spinner"></div> {/* Loading spinner component */}
      </div>
    );
  }

  // If user is not authenticated, redirect to login page
  if (!user) {
    return <Navigate to="/login" replace />;
    {
      /* Redirect to login with replace to prevent back navigation */
    }
  }

  // If user is authenticated, render the protected children
  return <>{children}</>;
  {
    /* Render the wrapped content */
  }
};

// Export the ProtectedRoute component as default
export default ProtectedRoute;
