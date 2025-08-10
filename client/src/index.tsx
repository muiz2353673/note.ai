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
  document.getElementById("root") as HTMLElement
);

// Render the React application to the DOM
root.render(
 
  <React.StrictMode>
   
    <BrowserRouter>
     
      <AuthProvider>
       
        <SubscriptionProvider>
         
          <NotificationProvider>
           
            <App />
            
           
            <Toaster
              position="top-right"
              toastOptions={{
                duration: 4000,
                style: {
                  background: "#363636",
                  color: "#fff",
                },
               
                success: {
                  duration: 3000,
                  iconTheme: {
                    primary: "#22c55e",
                    secondary: "#fff",
                  },
                },
               
                error: {
                  duration: 5000,
                  iconTheme: {
                    primary: "#ef4444",
                    secondary: "#fff",
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
