// Import React and necessary hooks for component state and effects
import React, { useState, useRef, useEffect } from "react";
// Import Heroicons for UI icons
import { BellIcon, CheckIcon, XMarkIcon } from "@heroicons/react/24/outline";
// Import custom notification context hook
import { useNotifications } from "../contexts/NotificationContext";

// NotificationDropdown component that displays user notifications in a dropdown
const NotificationDropdown: React.FC = () => {
  // Get notification data and functions from notification context
  const {
    notifications, // Array of all notifications
    unreadCount, // Count of unread notifications
    markAsRead, // Function to mark a notification as read
    markAllAsRead, // Function to mark all notifications as read
    removeNotification, // Function to remove a notification
  } = useNotifications();
  
  // State to control dropdown visibility
  const [isOpen, setIsOpen] = useState(false);
  // Ref to track the dropdown container for click outside detection
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Effect to handle clicking outside the dropdown to close it
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      // Check if click target is outside the dropdown container
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false); // Close dropdown if clicked outside
      }
    };

    // Add event listener for mouse clicks
    document.addEventListener("mousedown", handleClickOutside);
    // Cleanup event listener on component unmount
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Function to format timestamp into relative time (e.g., "2h ago", "3d ago")
  const formatTime = (timestamp: Date) => {
    const now = new Date();
    const diff = now.getTime() - timestamp.getTime(); // Calculate time difference in milliseconds
    const minutes = Math.floor(diff / 60000); // Convert to minutes
    const hours = Math.floor(diff / 3600000); // Convert to hours
    const days = Math.floor(diff / 86400000); // Convert to days

    // Return appropriate relative time string
    if (minutes < 1) return "Just now";
    if (minutes < 60) return `${minutes}m ago`;
    if (hours < 24) return `${hours}h ago`;
    return `${days}d ago`;
  };

  // Function to get appropriate emoji icon based on notification type
  const getNotificationIcon = (type: string) => {
    switch (type) {
      case "success":
        return "✅"; // Green checkmark for success
      case "error":
        return "❌"; // Red X for errors
      case "warning":
        return "⚠️"; // Yellow warning triangle
      case "info":
        return "ℹ️"; // Blue info circle
      default:
        return "📢"; // Default megaphone icon
    }
  };

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Main container with ref for click detection */}
      
      {/* Notification Bell Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2 text-gray-400 hover:text-gray-600 transition-colors"
      >
        {/* Button styling */}
        <BellIcon className="w-6 h-6" /> {/* Bell icon */}
        {/* Unread count badge - only shown if there are unread notifications */}
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 bg-error-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
            {/* Badge styling */}
            {unreadCount > 99 ? "99+" : unreadCount} {/* Show 99+ if count exceeds 99 */}
          </span>
        )}
      </button>

      {/* Dropdown Menu - Only shown when isOpen is true */}
      {isOpen && (
        <div className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-lg border border-gray-200 z-50">
          {/* Dropdown container */}
          
          {/* Dropdown Header */}
          <div className="p-4 border-b border-gray-200">
            {/* Header section */}
            <div className="flex items-center justify-between">
              {/* Header content */}
              <h3 className="text-lg font-medium text-gray-900">
                {/* Section title */}
                Notifications
              </h3>
              {/* Mark all as read button - only shown if there are unread notifications */}
              {unreadCount > 0 && (
                <button
                  onClick={markAllAsRead}
                  className="text-sm text-primary-600 hover:text-primary-700"
                >
                  {/* Button styling */}
                  Mark all as read
                </button>
              )}
            </div>
          </div>

          {/* Notifications List */}
          <div className="max-h-96 overflow-y-auto">
            {/* Scrollable notifications container */}
            {notifications.length === 0 ? (
              // Empty state when no notifications exist
              <div className="p-4 text-center text-gray-500">
                {/* Empty state container */}
                <BellIcon className="w-8 h-8 mx-auto mb-2 text-gray-300" />
                {/* Empty state icon */}
                <p>No notifications yet</p>
                {/* Empty state message */}
              </div>
            ) : (
              // List of notifications
              <div className="divide-y divide-gray-200">
                {/* Notifications list with dividers */}
                {notifications.slice(0, 10).map((notification) => (
                  // Map through first 10 notifications
                  <div
                    key={notification.id}
                    className={`p-4 hover:bg-gray-50 transition-colors ${
                      !notification.read ? "bg-blue-50" : ""
                    }`}
                  >
                    {/* Unique key for each notification */}
                    <div className="flex items-start space-x-3">
                      {/* Notification content layout */}
                      {/* Notification icon */}
                      <div className="flex-shrink-0">
                        <span className="text-lg">
                          {getNotificationIcon(notification.type)}
                        </span>
                      </div>
                      
                      {/* Notification content */}
                      <div className="flex-1 min-w-0">
                        {/* Main content area */}
                        <div className="flex items-center justify-between">
                          {/* Header with title and actions */}
                          <p className="text-sm font-medium text-gray-900">
                            {/* Notification title */}
                            {notification.title}
                          </p>
                          <div className="flex items-center space-x-2">
                            {/* Action buttons */}
                            {/* Mark as read button - only shown for unread notifications */}
                            {!notification.read && (
                              <button
                                onClick={() => markAsRead(notification.id)}
                                className="text-primary-600 hover:text-primary-700"
                              >
                                {/* Button styling */}
                                <CheckIcon className="w-4 h-4" />
                              </button>
                            )}
                            {/* Remove notification button */}
                            <button
                              onClick={() => removeNotification(notification.id)}
                              className="text-gray-400 hover:text-gray-600"
                            >
                              {/* Button styling */}
                              <XMarkIcon className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                        
                        {/* Notification message */}
                        <p className="text-sm text-gray-600 mt-1">
                          {/* Notification message text */}
                          {notification.message}
                        </p>
                        
                        {/* Notification footer with timestamp and action */}
                        <div className="flex items-center justify-between mt-2">
                          {/* Footer layout */}
                          <span className="text-xs text-gray-400">
                            {/* Timestamp */}
                            {formatTime(notification.timestamp)}
                          </span>
                          {/* Action link - only shown if notification has an action */}
                          {notification.action && (
                            <a
                              href={notification.action.url}
                              className="text-xs text-primary-600 hover:text-primary-700"
                            >
                              {/* Link styling */}
                              {notification.action.label}
                            </a>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* View All Notifications Footer - Only shown if there are more than 10 notifications */}
          {notifications.length > 10 && (
            <div className="p-4 border-t border-gray-200 text-center">
              {/* Footer container */}
              <button className="text-sm text-primary-600 hover:text-primary-700">
                {/* View all button */}
                View all notifications
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

// Export the NotificationDropdown component as default
export default NotificationDropdown;
