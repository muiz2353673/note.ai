// Import React and useState hook for component state management
import React, { useState } from "react";
// Import Link component for navigation
import { Link } from "react-router-dom";
// Import custom authentication context hook
import { useAuth } from "../../contexts/AuthContext";
// Import Heroicons for UI icons
import {
  UserCircleIcon,
  Cog6ToothIcon,
  ArrowRightOnRectangleIcon,
} from "@heroicons/react/24/outline";
// Import notification dropdown component
import NotificationDropdown from "../NotificationDropdown";

// Navbar component that provides top navigation for authenticated users
const Navbar: React.FC = () => {
  // Get user data and logout function from authentication context
  const { user, logout } = useAuth();
  // State to control the visibility of the user dropdown menu
  const [showDropdown, setShowDropdown] = useState(false);

  return (
    <nav className="bg-white shadow-sm border-b border-gray-200">
      {/* Main navigation container */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Responsive container with padding */}
        <div className="flex justify-between items-center h-16">
          {/* Flex container for navbar content */}
          
          {/* Logo Section */}
          <div className="flex items-center">
            <Link to="/dashboard" className="flex-shrink-0">
              {/* Link to dashboard */}
              <h1 className="text-2xl font-bold text-gradient">Noted.AI</h1>
              {/* Application logo/brand */}
            </Link>
          </div>

          {/* Search Bar - Hidden on mobile, visible on desktop */}
          <div className="hidden md:block flex-1 max-w-lg mx-8">
            {/* Responsive search container */}
            <div className="relative">
              {/* Relative positioning for search icon */}
              <input
                type="text"
                placeholder="Search notes, flashcards..."
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              />
              {/* Search icon positioned absolutely within the input */}
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <svg
                  className="h-5 w-5 text-gray-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                  />
                </svg>
              </div>
            </div>
          </div>

          {/* Right side navigation items */}
          <div className="flex items-center space-x-4">
            {/* Flex container for right-side items */}
            
            {/* Notifications dropdown component */}
            <NotificationDropdown />

            {/* User Menu Dropdown */}
            <div className="relative">
              {/* Relative positioning for dropdown */}
              {/* User button that toggles the dropdown */}
              <button
                onClick={() => setShowDropdown(!showDropdown)}
                className="flex items-center space-x-2 p-2 rounded-lg hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-primary-500"
              >
                <UserCircleIcon className="h-8 w-8 text-gray-400" />
                {/* User avatar icon */}
                <div className="hidden md:block text-left">
                  {/* User info - hidden on mobile */}
                  <p className="text-sm font-medium text-gray-900">
                    {/* User's full name */}
                    {user?.firstName} {user?.lastName}
                  </p>
                  <p className="text-xs text-gray-500">{user?.email}</p>
                  {/* User's email */}
                </div>
              </button>

              {/* Dropdown Menu - Only shown when showDropdown is true */}
              {showDropdown && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-50">
                  {/* Dropdown container */}
                  
                  {/* Profile link */}
                  <Link
                    to="/profile"
                    className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    onClick={() => setShowDropdown(false)}
                  >
                    {/* Link styling */}
                    <UserCircleIcon className="h-4 w-4 mr-3" />
                    {/* Profile icon */}
                    Profile
                  </Link>
                  
                  {/* Settings link */}
                  <Link
                    to="/settings"
                    className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    onClick={() => setShowDropdown(false)}
                  >
                    {/* Link styling */}
                    <Cog6ToothIcon className="h-4 w-4 mr-3" />
                    {/* Settings icon */}
                    Settings
                  </Link>
                  
                  {/* Divider line */}
                  <hr className="my-1" />
                  
                  {/* Logout button */}
                  <button
                    onClick={() => {
                      logout();
                      setShowDropdown(false);
                    }}
                    className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  >
                    {/* Button styling */}
                    <ArrowRightOnRectangleIcon className="h-4 w-4 mr-3" />
                    {/* Logout icon */}
                    Sign out
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Mobile search bar - Only visible on mobile devices */}
      <div className="md:hidden px-4 pb-4">
        {/* Mobile-only search container */}
        <div className="relative">
          {/* Relative positioning for search icon */}
          <input
            type="text"
            placeholder="Search notes, flashcards..."
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          />
          {/* Search icon positioned absolutely within the input */}
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <svg
              className="h-5 w-5 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
          </div>
        </div>
      </div>
    </nav>
  );
};

// Export the Navbar component as default
export default Navbar;
