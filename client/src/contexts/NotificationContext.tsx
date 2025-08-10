// Import necessary React hooks for context creation and state management
import React, { createContext, useContext, useState, useEffect } from "react";
// Import toast for displaying temporary notifications
import { toast } from "react-hot-toast";

// Interface defining the structure of a Notification object
// Contains all notification-related data including type, content, and status
interface Notification {
  id: string;
  type: "success" | "error" | "warning" | "info";
  title: string;
  message: string;
  timestamp: Date;
  read: boolean;
  action?: {
    label: string;
    url: string;
  };
}

// Interface defining the structure of the NotificationContext
// Contains all notification-related functions and state
interface NotificationContextType {
  notifications: Notification[];
  unreadCount: number;
  addNotification: (
    notification: Omit<Notification, "id" | "timestamp" | "read">
  ) => void;
  markAsRead: (id: string) => void;
  markAllAsRead: () => void;
  removeNotification: (id: string) => void;
  clearAll: () => void;
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
  children: React.ReactNode;
}

// NotificationProvider component that wraps the app and provides notification context
export const NotificationProvider: React.FC<NotificationProviderProps> = ({
  children,
}) => {
 
  const [notifications, setNotifications] = useState<Notification[]>([]);

 
 
  useEffect(() => {
    const savedNotifications = localStorage.getItem("notifications");
    if (savedNotifications) {
      try {
       
        const parsed = JSON.parse(savedNotifications);
       
        setNotifications(
          parsed.map((n: any) => ({
            ...n,
            timestamp: new Date(n.timestamp),
          }))
        );
      } catch (error) {
       
        console.error("Failed to load notifications:", error);
      }
    }
  }, []);

 
 
  useEffect(() => {
    localStorage.setItem("notifications", JSON.stringify(notifications));
  }, [notifications]);

 
  const unreadCount = notifications.filter((n) => !n.read).length;

 
 
  const addNotification = (
    notification: Omit<Notification, "id" | "timestamp" | "read">
  ) => {
   
    const newNotification: Notification = {
      ...notification,
      id: Date.now().toString(),
      timestamp: new Date(),
      read: false,
    };

   
    setNotifications((prev) => [newNotification, ...prev]);

   
    switch (notification.type) {
      case "success":
       
        toast.success(notification.message);
        break;
      case "error":
       
        toast.error(notification.message);
        break;
      case "warning":
       
        toast(notification.message, {
          icon: "⚠️",
          style: {
            background: "#fef3c7",
            color: "#92400e",
          },
        });
        break;
      case "info":
       
        toast(notification.message, {
          icon: "ℹ️",
          style: {
            background: "#dbeafe",
            color: "#1e40af",
          },
        });
        break;
    }
  };

 
  const markAsRead = (id: string) => {
    setNotifications(
      (prev) => prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    );
  };

 
  const markAllAsRead = () => {
    setNotifications(
      (prev) => prev.map((n) => ({ ...n, read: true }))
    );
  };

 
  const removeNotification = (id: string) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  };

 
  const clearAll = () => {
    setNotifications([]);
  };

 
  const value: NotificationContextType = {
    notifications,
    unreadCount,
    addNotification,
    markAsRead,
    markAllAsRead,
    removeNotification,
    clearAll,
  };

 
  return (
    <NotificationContext.Provider value={value}>
      {children}
    </NotificationContext.Provider>
  );
};

// Export the NotificationProvider as default
export default NotificationProvider;
