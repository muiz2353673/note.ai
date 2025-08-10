// Import React for component creation
import React from "react";
// Import NavLink for navigation with active state styling
import { NavLink } from "react-router-dom";
// Import custom authentication context hook
import { useAuth } from "../../contexts/AuthContext";
// Import Heroicons for navigation and UI icons
import {
  HomeIcon,
  DocumentTextIcon,
  LightBulbIcon,
  AcademicCapIcon,
  UserIcon,
  BookOpenIcon,
} from "@heroicons/react/24/outline";

// Sidebar component that provides left navigation for authenticated users
const Sidebar: React.FC = () => {
  // Get user data from authentication context
  const { user } = useAuth();

  // Define navigation items with their routes and icons
  const navigation = [
    { name: "Dashboard", href: "/dashboard", icon: HomeIcon }, // Main dashboard
    { name: "Notes", href: "/notes", icon: DocumentTextIcon }, // Notes management
    { name: "AI Features", href: "/ai-features", icon: LightBulbIcon }, // AI-powered features
    { name: "Flashcards", href: "/flashcards", icon: BookOpenIcon }, // Flashcard management
    { name: "Citations", href: "/citations", icon: AcademicCapIcon }, // Citation generation
    { name: "Profile", href: "/profile", icon: UserIcon }, // User profile
  ];

  // Function to generate CSS classes for navigation links based on active state
  const getNavLinkClass = (isActive: boolean) => {
    return `flex items-center px-4 py-2 text-sm font-medium rounded-lg transition-colors duration-200 ${
      isActive
        ? "bg-primary-100 text-primary-700"
        : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
    }`;
  };

  return (
    <div className="w-64 bg-white shadow-sm border-r border-gray-200 min-h-screen">
      {/* Main sidebar container */}
      <div className="p-6">
        {/* Inner padding container */}
        
        {/* User Information Section */}
        <div className="mb-6">
          <div className="flex items-center space-x-3">
            {/* Flex container for user info */}
            {/* User avatar circle with initials */}
            <div className="w-10 h-10 bg-primary-100 rounded-full flex items-center justify-center">
              <span className="text-primary-600 font-semibold">
                {user?.firstName?.charAt(0)}
                {user?.lastName?.charAt(0)}
              </span>
            </div>
            {/* User details */}
            <div>
              <p className="text-sm font-medium text-gray-900">
                {/* User's full name */}
                {user?.firstName} {user?.lastName}
              </p>
              <p className="text-xs text-gray-500">
                {/* User's subscription plan */}
                {user?.subscription?.plan || 'Free'} Plan
              </p>
            </div>
          </div>
        </div>

        {/* Main Navigation Section */}
        <nav className="space-y-1">
          {/* Navigation container with spacing */}
          {navigation.map((item) => (
            // Map through navigation items
            <NavLink
              key={item.name}
              to={item.href}
              className={({ isActive }) => getNavLinkClass(isActive)}
            >
              {/* Unique key for each navigation item */}
              <item.icon className="mr-3 h-5 w-5" />
              {/* Navigation icon */}
              {item.name}
              {/* Navigation item name */}
            </NavLink>
          ))}
        </nav>

        {/* Usage Statistics Section */}
        <div className="mt-8 p-4 bg-gray-50 rounded-lg">
          {/* Usage stats container */}
          <h3 className="text-sm font-medium text-gray-900 mb-3">
            {/* Section title */}
            Usage This Month
          </h3>
          <div className="space-y-2">
            {/* Stats items container */}
            {/* AI Summaries usage */}
            <div className="flex justify-between text-xs">
              <span className="text-gray-600">AI Summaries</span>
              {/* Feature name */}
              <span className="text-gray-900">
                {user?.usage?.totalSummaries || 0} /{" "}
                {/* Current usage */}
                {user?.subscription?.features?.aiSummaries || 0}
                {/* Usage limit */}
              </span>
            </div>
            {/* Flashcards usage */}
            <div className="flex justify-between text-xs">
              <span className="text-gray-600">Flashcards</span>
              {/* Feature name */}
              <span className="text-gray-900">
                {user?.usage?.totalFlashcards || 0} /{" "}
                {/* Current usage */}
                {user?.subscription?.features?.flashcardGeneration || 0}
                {/* Usage limit */}
              </span>
            </div>
            {/* Assignment help usage */}
            <div className="flex justify-between text-xs">
              <span className="text-gray-600">Assignments</span>
              {/* Feature name */}
              <span className="text-gray-900">
                {user?.usage?.totalAssignments || 0} /{" "}
                {/* Current usage */}
                {user?.subscription?.features?.assignmentHelp || 0}
                {/* Usage limit */}
              </span>
            </div>
          </div>
        </div>

        {/* Quick Actions Section */}
        <div className="mt-6">
          <h3 className="text-sm font-medium text-gray-900 mb-3">
            {/* Section title */}
            Quick Actions
          </h3>
          <div className="space-y-2">
            {/* Quick actions container */}
            {/* New Note quick action */}
            <NavLink
              to="/notes/new"
              className="flex items-center px-3 py-2 text-sm text-primary-600 hover:bg-primary-50 rounded-lg transition-colors duration-200"
            >
              {/* Link styling */}
              <DocumentTextIcon className="mr-2 h-4 w-4" />
              {/* Note icon */}
              New Note
            </NavLink>
            {/* AI Summary quick action */}
            <NavLink
              to="/ai-features"
              className="flex items-center px-3 py-2 text-sm text-primary-600 hover:bg-primary-50 rounded-lg transition-colors duration-200"
            >
              {/* Link styling */}
              <LightBulbIcon className="mr-2 h-4 w-4" />
              {/* AI icon */}
              AI Summary
            </NavLink>
            {/* Study Mode quick action */}
            <NavLink
              to="/flashcards"
              className="flex items-center px-3 py-2 text-sm text-primary-600 hover:bg-primary-50 rounded-lg transition-colors duration-200"
            >
              {/* Link styling */}
              <BookOpenIcon className="mr-2 h-4 w-4" />
              {/* Study icon */}
              Study Mode
            </NavLink>
          </div>
        </div>

        {/* University Information Section - Only shown if user has university data */}
        {user?.university && (
          <div className="mt-6 p-4 bg-blue-50 rounded-lg">
            {/* University info container */}
            <h3 className="text-sm font-medium text-blue-900 mb-2">
              {/* Section title */}
              University
            </h3>
            <p className="text-xs text-blue-700">{user.university.name}</p>
            {/* University name */}
          </div>
        )}
      </div>
    </div>
  );
};

// Export the Sidebar component as default
export default Sidebar;
