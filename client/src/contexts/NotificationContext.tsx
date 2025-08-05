// Import necessary React hooks for context creation and state management
import React, { createContext, useContext, useState, useEffect } from "react";
// Import toast for displaying temporary notifications
import { toast } from "react-hot-toast";

// Interface defining the structure of a Notification object
// Contains all notification-related data including type, content, and status
interface Notification {
  id: string; // Unique notification identifier
  type: "success" | "error" | "warning" | "info"; // Type of notification for styling and behavior
  title: string; // Notification title/heading
  message: string; // Main notification message content
  timestamp: Date; // When the notification was created
  read: boolean; // Whether the notification has been read by the user
  action?: {
    label: string; // Text for the action button (optional)
    url: string; // URL to navigate to when action is clicked (optional)
  };
}

// Interface defining the structure of the NotificationContext
// Contains all notification-related functions and state
interface NotificationContextType {
  notifications: Notification[]; // Array of all notifications
  unreadCount: number; // Count of unread notifications
  addNotification: (
    notification: Omit<Notification, "id" | "timestamp" | "read">
  ) => void; // Function to add new notification
  markAsRead: (id: string) => void; // Function to mark a specific notification as read
  markAllAsRead: () => void; // Function to mark all notifications as read
  removeNotification: (id: string) => void; // Function to remove a specific notification
  clearAll: () => void; // Function to clear all notifications
}

// Create the notification context with undefined as default value
const NotificationContext = createContext<NotificationContextType | undefined>(
  undefined
);

// Custom hook to use the notification context
// Throws an error if used outside of NotificationProvider
export const useNotifications = () => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error(
      "useNotifications must be used within a NotificationProvider"
    );
  }
  return context;
};

// Interface for NotificationProvider component props
interface NotificationProviderProps {
  children: React.ReactNode; // React children to be wrapped by the provider
}

// NotificationProvider component that wraps the app and provides notification context
export const NotificationProvider: React.FC<NotificationProviderProps> = ({
  children,
}) => {
  // State to store all notifications
  const [notifications, setNotifications] = useState<Notification[]>([]);

  // Load notifications from localStorage on component mount
  // This ensures notifications persist across browser sessions
  useEffect(() => {
    const savedNotifications = localStorage.getItem("notifications"); // Get saved notifications from localStorage
    if (savedNotifications) {
      try {
        // Parse the JSON string back to an array
        const parsed = JSON.parse(savedNotifications);
        // Convert timestamp strings back to Date objects
        setNotifications(
          parsed.map((n: any) => ({
            ...n,
            timestamp: new Date(n.timestamp),
          }))
        );
      } catch (error) {
        // Log error if parsing fails
        console.error("Failed to load notifications:", error);
      }
    }
  }, []);

  // Save notifications to localStorage whenever they change
  // This ensures notifications are persisted when the component updates
  useEffect(() => {
    localStorage.setItem("notifications", JSON.stringify(notifications));
  }, [notifications]);

  // Calculate the number of unread notifications
  const unreadCount = notifications.filter((n) => !n.read).length;

  // Function to add a new notification
  // Takes notification data without id, timestamp, and read status (these are auto-generated)
  const addNotification = (
    notification: Omit<Notification, "id" | "timestamp" | "read">
  ) => {
    // Create new notification with auto-generated fields
    const newNotification: Notification = {
      ...notification,
      id: Date.now().toString(), // Use current timestamp as unique ID
      timestamp: new Date(), // Set current timestamp
      read: false, // Mark as unread by default
    };

    // Add new notification to the beginning of the array (most recent first)
    setNotifications((prev) => [newNotification, ...prev]);

    // Show toast notification based on type
    switch (notification.type) {
      case "success":
        // Show green success toast
        toast.success(notification.message);
        break;
      case "error":
        // Show red error toast
        toast.error(notification.message);
        break;
      case "warning":
        // Show yellow warning toast with custom styling
        toast(notification.message, {
          icon: "⚠️",
          style: {
            background: "#fef3c7", // Light yellow background
            color: "#92400e", // Dark yellow text
          },
        });
        break;
      case "info":
        // Show blue info toast with custom styling
        toast(notification.message, {
          icon: "ℹ️",
          style: {
            background: "#dbeafe", // Light blue background
            color: "#1e40af", // Dark blue text
          },
        });
        break;
    }
  };

  // Function to mark a specific notification as read
  const markAsRead = (id: string) => {
    setNotifications(
      (prev) => prev.map((n) => (n.id === id ? { ...n, read: true } : n)) // Update only the matching notification
    );
  };

  // Function to mark all notifications as read
  const markAllAsRead = () => {
    setNotifications(
      (prev) => prev.map((n) => ({ ...n, read: true })) // Update all notifications to read
    );
  };

  // Function to remove a specific notification
  const removeNotification = (id: string) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id)); // Remove notification with matching ID
  };

  // Function to clear all notifications
  const clearAll = () => {
    setNotifications([]); // Set notifications to empty array
  };

  // Create the context value object with all notification functions and state
  const value: NotificationContextType = {
    notifications,
    unreadCount,
    addNotification,
    markAsRead,
    markAllAsRead,
    removeNotification,
    clearAll,
  };

  // Return the NotificationContext.Provider with the value and children
  return (
    <NotificationContext.Provider value={value}>
      {children}
    </NotificationContext.Provider>
  );
};

// Export the NotificationProvider as default
export default NotificationProvider;
