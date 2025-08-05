// Import React for component creation and rendering
import React from "react";
// Import ReactDOM for rendering React components to the DOM
import ReactDOM from "react-dom/client";
// Import BrowserRouter for client-side routing
import { BrowserRouter } from "react-router-dom";
// Import Toaster for displaying toast notifications
import { Toaster } from "react-hot-toast";
// Import global CSS styles
import "./index.css";
// Import the main App component
import App from "./App";
// Import context providers for global state management
import { AuthProvider } from "./contexts/AuthContext";
import { SubscriptionProvider } from "./contexts/SubscriptionContext";
import { NotificationProvider } from "./contexts/NotificationContext";

// Create a React root for rendering the application
// This is the entry point where the React app will be mounted in the DOM
const root = ReactDOM.createRoot(
  document.getElementById("root") as HTMLElement // Get the root element from the HTML
);

// Render the React application to the DOM
root.render(
  // React.StrictMode enables additional development checks and warnings
  <React.StrictMode>
    {/* BrowserRouter provides routing functionality throughout the app */}
    <BrowserRouter>
      {/* AuthProvider wraps the app to provide authentication context */}
      <AuthProvider>
        {/* SubscriptionProvider provides subscription management context */}
        <SubscriptionProvider>
          {/* NotificationProvider provides notification management context */}
          <NotificationProvider>
            {/* Main App component that contains all the routing and UI */}
            <App />
            
            {/* Toaster component for displaying toast notifications */}
            <Toaster
              position="top-right" // Position notifications in top-right corner
              toastOptions={{
                duration: 4000, // Default duration for all toasts (4 seconds)
                style: {
                  background: "#363636", // Dark background color
                  color: "#fff", // White text color
                },
                // Custom styling for success toasts
                success: {
                  duration: 3000, // Shorter duration for success messages (3 seconds)
                  iconTheme: {
                    primary: "#22c55e", // Green color for success icon
                    secondary: "#fff", // White color for icon background
                  },
                },
                // Custom styling for error toasts
                error: {
                  duration: 5000, // Longer duration for error messages (5 seconds)
                  iconTheme: {
                    primary: "#ef4444", // Red color for error icon
                    secondary: "#fff", // White color for icon background
                  },
                },
              }}
            />
          </NotificationProvider>
        </SubscriptionProvider>
      </AuthProvider>
    </BrowserRouter>
  </React.StrictMode>
);
