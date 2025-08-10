// Import React and necessary hooks for component state and effects
import React, { useState, useEffect } from "react";
// Import Link component for navigation
import { Link } from "react-router-dom";
// Import custom authentication context hook
import { useAuth } from "../contexts/AuthContext";
// Import custom subscription context hook
import { useSubscription } from "../contexts/SubscriptionContext";
// Import axios for HTTP requests
import axios from "axios";
// Import Heroicons for UI icons
import {
  DocumentTextIcon,
  LightBulbIcon,
  BookOpenIcon,
  AcademicCapIcon,
  PlusIcon,
  ArrowUpIcon,
  ArrowDownIcon,
  ClockIcon,
} from "@heroicons/react/24/outline";

// Interface defining the structure of a Note object
// Contains all note-related data for display in the dashboard
interface Note {
  _id: string; // Unique note identifier
  title: string; // Note title
  content: string; // Note content
  subject: string; // Academic subject/course
  tags: string[]; // Array of tags for categorization
  isBookmarked?: boolean; // Whether note is bookmarked (optional)
  createdAt: string; // Note creation timestamp
  updatedAt: string; // Note last update timestamp
}

// Dashboard component that displays user's overview and recent activity
const Dashboard: React.FC = () => {
  // Get user data from authentication context
  const { user } = useAuth();
  // Get subscription and usage data from subscription context
  const { subscription, usage, loading } = useSubscription();

  // Debug logging for development
  console.log("Dashboard - User:", user);
  console.log("Dashboard - Subscription:", subscription);
  console.log("Dashboard - Usage:", usage);

  // State for managing recent notes data
  const [notesLoading, setNotesLoading] = useState(true); // Loading state for notes
  const [recentNotes, setRecentNotes] = useState<Note[]>([]); // Array of recent notes
  const [notesError, setNotesError] = useState(false); // Error state for notes fetching

  // Effect to fetch recent notes when component mounts or user changes
  useEffect(() => {
    const fetchRecentNotes = async () => {
      try {
        setNotesLoading(true); // Set loading state
        setNotesError(false); // Clear any previous errors
        console.log("Fetching recent notes..."); // Debug log
        // Fetch recent notes from API with limit of 5
        const response = await axios.get("/api/notes?limit=5");
        console.log("Recent notes response:", response.data); // Debug log
        setRecentNotes(response.data.notes || []); // Update notes state
      } catch (error) {
        console.error("Failed to fetch recent notes:", error); // Error logging
        setRecentNotes([]); // Clear notes on error
        setNotesError(true); // Set error state
      } finally {
        setNotesLoading(false); // Clear loading state
      }
    };

    // Only fetch notes if user is authenticated
    if (user) {
      fetchRecentNotes();
    }
  }, [user]); // Dependency on user to refetch when user changes

  // Statistics data for the dashboard cards
  // Shows user's usage metrics with visual indicators
  const stats = [
    {
      name: "Total Notes", // Stat name
      value: usage?.totalNotes || user?.usage?.totalNotes || 0, // Get value from context or user data
      icon: DocumentTextIcon, // Icon for the stat
      color: "text-blue-600", // Text color
      bgColor: "bg-blue-100", // Background color
      change: "+12%", // Change indicator
      changeType: "increase", // Type of change (increase/decrease)
    },
    {
      name: "AI Summaries", // Stat name
      value: usage?.totalSummaries || user?.usage?.totalSummaries || 0, // Get value from context or user data
      icon: LightBulbIcon, // Icon for the stat
      color: "text-green-600", // Text color
      bgColor: "bg-green-100", // Background color
      change: "+8%", // Change indicator
      changeType: "increase", // Type of change
    },
    {
      name: "Flashcards", // Stat name
      value: usage?.totalFlashcards || user?.usage?.totalFlashcards || 0, // Get value from context or user data
      icon: BookOpenIcon, // Icon for the stat
      color: "text-purple-600", // Text color
      bgColor: "bg-purple-100", // Background color
      change: "+15%", // Change indicator
      changeType: "increase", // Type of change
    },
    {
      name: "Assignments", // Stat name
      value: usage?.totalAssignments || user?.usage?.totalAssignments || 0, // Get value from context or user data
      icon: AcademicCapIcon, // Icon for the stat
      color: "text-orange-600", // Text color
      bgColor: "bg-orange-100", // Background color
      change: "+5%", // Change indicator
      changeType: "increase", // Type of change
    },
  ];

  // Debug logging for subscription data
  console.log("Dashboard - User usage:", user?.usage);
  console.log("Dashboard - Context usage:", usage);
  console.log("Dashboard - Context subscription:", subscription);

  // Quick actions data for the dashboard
  // Provides easy access to common features
  const quickActions = [
    {
      name: "Create Note", // Action name
      description: "Start a new note", // Action description
      icon: PlusIcon, // Action icon
      href: "/notes/new", // Navigation link
      color: "text-blue-600", // Icon color
      bgColor: "bg-blue-100", // Background color
    },
    {
      name: "AI Summary", // Action name
      description: "Summarize your notes", // Action description
      icon: LightBulbIcon, // Action icon
      href: "/ai-features", // Navigation link
      color: "text-green-600", // Icon color
      bgColor: "bg-green-100", // Background color
    },
    {
      name: "Study Mode", // Action name
      description: "Review flashcards", // Action description
      icon: BookOpenIcon, // Action icon
      href: "/flashcards", // Navigation link
      color: "text-purple-600", // Icon color
      bgColor: "bg-purple-100", // Background color
    },
    {
      name: "Citations", // Action name
      description: "Generate citations", // Action description
      icon: AcademicCapIcon, // Action icon
      href: "/citations", // Navigation link
      color: "text-orange-600", // Icon color
      bgColor: "bg-orange-100", // Background color
    },
  ];

  // Show loading state if subscription data is still loading
  if (loading) {
    return (
      <div className="space-y-6">
        {/* Main container with spacing */}
        {/* Welcome section with loading message */}
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl p-6 text-white">
          {/* Gradient background */}
          <h1 className="text-2xl font-bold mb-2">
            {/* Welcome heading */}
            Welcome back, {user?.firstName}! 👋
          </h1>
          <p className="text-blue-100">Loading your dashboard...</p>
          {/* Loading message */}
        </div>
        {/* Loading spinner */}
        <div className="flex items-center justify-center py-12">
          {/* Centered loading container */}
          <div className="spinner"></div>
          {/* Loading spinner component */}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Main dashboard container with spacing */}
      
      {/* Welcome Section */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl p-6 text-white">
        {/* Gradient welcome banner */}
        <h1 className="text-2xl font-bold mb-2">
          {/* Welcome heading */}
          Welcome back, {user?.firstName}! 👋
        </h1>
        <p className="text-blue-100">
          {/* Welcome message */}
          Ready to continue your academic journey? Here's what's happening with
          your studies.
        </p>
      </div>

      {/* Statistics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Responsive stats grid */}
        {stats.map((stat) => (
          // Map through stats array
          <div key={stat.name} className="card">
            {/* Individual stat card */}
            <div className="flex items-center justify-between">
              {/* Stat content layout */}
              <div>
                {/* Stat text content */}
                <p className="text-sm font-medium text-gray-600">{stat.name}</p>
                {/* Stat name */}
                <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                {/* Stat value */}
                <div className="flex items-center mt-1">
                  {/* Change indicator */}
                  {stat.changeType === "increase" ? (
                    // Show up arrow for increase
                    <ArrowUpIcon className="w-4 h-4 text-green-500" />
                  ) : (
                    // Show down arrow for decrease
                    <ArrowDownIcon className="w-4 h-4 text-red-500" />
                  )}
                  <span
                    className={`text-sm ml-1 ${
                      stat.changeType === "increase"
                        ? "text-green-600"
                        : "text-red-600"
                    }`}
                  >
                    {stat.change}
                    {/* Change percentage */}
                  </span>
                </div>
              </div>
              <div className={`p-3 rounded-lg ${stat.bgColor}`}>
                {/* Stat icon container */}
                <stat.icon className={`w-6 h-6 ${stat.color}`} />
                {/* Stat icon */}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Quick Actions Section */}
      <div className="card">
        {/* Quick actions card */}
        <h2 className="text-lg font-semibold text-gray-900 mb-4">
          {/* Section title */}
          Quick Actions
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Responsive actions grid */}
          {quickActions.map((action) => (
            // Map through quick actions
            <Link
              key={action.name}
              to={action.href}
              className="p-4 border border-gray-200 rounded-lg hover:border-primary-300 hover:shadow-md transition-all duration-200"
            >
              {/* Action card styling */}
              <div
                className={`w-10 h-10 ${action.bgColor} rounded-lg flex items-center justify-center mb-3`}
              >
                {/* Icon container */}
                <action.icon className={`w-5 h-5 ${action.color}`} />
                {/* Action icon */}
              </div>
              <h3 className="font-medium text-gray-900 mb-1">{action.name}</h3>
              {/* Action name */}
              <p className="text-sm text-gray-600">{action.description}</p>
              {/* Action description */}
            </Link>
          ))}
        </div>
      </div>

      {/* Upgrade Banner for Free Users */}
      {subscription?.plan === "free" && (
        // Only show for free users
        <div className="card bg-gradient-to-r from-blue-50 to-purple-50 border-blue-200">
          {/* Upgrade banner */}
          <div className="flex items-center justify-between">
            {/* Banner content layout */}
            <div className="flex items-center">
              {/* Left side content */}
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mr-4">
                {/* Icon container */}
                <LightBulbIcon className="w-6 h-6 text-blue-600" />
                {/* Upgrade icon */}
              </div>
              <div>
                {/* Text content */}
                <h3 className="font-semibold text-blue-900 mb-1">
                  {/* Banner title */}
                  Unlock Premium Features
                </h3>
                <p className="text-sm text-blue-700">
                  {/* Banner description */}
                  Get unlimited AI summaries, flashcards, and more with our
                  Student plan
                </p>
              </div>
            </div>
            <Link to="/pricing" className="btn-primary whitespace-nowrap">
              {/* Upgrade button */}
              Upgrade Now
            </Link>
          </div>
        </div>
      )}

      {/* Usage & Subscription Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Responsive layout for usage and subscription */}
        
        {/* Usage Overview */}
        <div className="lg:col-span-2 card">
          {/* Usage section takes 2/3 of the width */}
          <div className="flex items-center justify-between mb-4">
            {/* Section header */}
            <h2 className="text-lg font-semibold text-gray-900">
              {/* Section title */}
              Usage This Month
            </h2>
            {subscription && (
              // Show upgrade/manage button if subscription exists
              <Link to="/pricing" className="btn-primary text-sm px-4 py-2">
                {/* Action button */}
                {subscription.plan === "free" ? "Upgrade Plan" : "Manage Subscription"}
              </Link>
            )}
          </div>
          <div className="space-y-4">
            {/* Usage metrics container */}
            {usage ? (
              // Show usage data if available
              <>
                {/* AI Summaries Usage */}
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    {/* Usage label and count */}
                    <span className="text-gray-600">AI Summaries</span>
                    {/* Feature name */}
                    <span className="text-gray-900">
                      {usage.totalSummaries || 0} /{" "}
                      {/* Current usage */}
                      {subscription?.features?.aiSummaries === -1
                        ? "∞"
                        : subscription?.features?.aiSummaries || 5}
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    {/* Progress bar background */}
                    <div
                      className={`h-2 rounded-full ${
                        (usage.totalSummaries || 0) /
                          (subscription?.features?.aiSummaries || 5) >
                        0.8
                          ? "bg-red-500"
                          : (usage.totalSummaries || 0) /
                              (subscription?.features?.aiSummaries || 5) >
                            0.6
                          ? "bg-yellow-500"
                          : "bg-green-500"
                      }`}
                      style={{
                        width: `${Math.min(
                          ((usage.totalSummaries || 0) /
                            (subscription?.features?.aiSummaries || 5)) *
                            100,
                          100
                        )}%`,
                      }}
                    ></div>
                  </div>
                </div>

                {/* Flashcards Usage */}
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    {/* Usage label and count */}
                    <span className="text-gray-600">Flashcards</span>
                    {/* Feature name */}
                    <span className="text-gray-900">
                      {usage.totalFlashcards || 0} /{" "}
                      {/* Current usage */}
                      {subscription?.features?.flashcardGeneration === -1
                        ? "∞"
                        : subscription?.features?.flashcardGeneration || 3}
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    {/* Progress bar background */}
                    <div
                      className={`h-2 rounded-full ${
                        (usage.totalFlashcards || 0) /
                          (subscription?.features?.flashcardGeneration || 3) >
                        0.8
                          ? "bg-red-500"
                          : (usage.totalFlashcards || 0) /
                              (subscription?.features?.flashcardGeneration ||
                                3) >
                            0.6
                          ? "bg-yellow-500"
                          : "bg-green-500"
                      }`}
                      style={{
                        width: `${Math.min(
                          ((usage.totalFlashcards || 0) /
                            (subscription?.features?.flashcardGeneration ||
                              3)) *
                            100,
                          100
                        )}%`,
                      }}
                    ></div>
                  </div>
                </div>

                {/* Assignments Usage */}
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    {/* Usage label and count */}
                    <span className="text-gray-600">Assignments</span>
                    {/* Feature name */}
                    <span className="text-gray-900">
                      {usage.totalAssignments || 0} /{" "}
                      {/* Current usage */}
                      {subscription?.features?.assignmentHelp === -1
                        ? "∞"
                        : subscription?.features?.assignmentHelp || 2}
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    {/* Progress bar background */}
                    <div
                      className={`h-2 rounded-full ${
                        (usage.totalAssignments || 0) /
                          (subscription?.features?.assignmentHelp || 2) >
                        0.8
                          ? "bg-red-500"
                          : (usage.totalAssignments || 0) /
                              (subscription?.features?.assignmentHelp || 2) >
                            0.6
                          ? "bg-yellow-500"
                          : "bg-green-500"
                      }`}
                      style={{
                        width: `${Math.min(
                          ((usage.totalAssignments || 0) /
                            (subscription?.features?.assignmentHelp || 2)) *
                            100,
                          100
                        )}%`,
                      }}
                    ></div>
                  </div>
                </div>

                {/* Citations Usage */}
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    {/* Usage label and count */}
                    <span className="text-gray-600">Citations</span>
                    {/* Feature name */}
                    <span className="text-gray-900">
                      {usage.totalCitations || 0} /{" "}
                      {/* Current usage */}
                      {subscription?.features?.citations === -1
                        ? "∞"
                        : subscription?.features?.citations || 10}
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    {/* Progress bar background */}
                    <div
                      className={`h-2 rounded-full ${
                        (usage.totalCitations || 0) /
                          (subscription?.features?.citations || 10) >
                        0.8
                          ? "bg-red-500"
                          : (usage.totalCitations || 0) /
                              (subscription?.features?.citations || 10) >
                            0.6
                          ? "bg-yellow-500"
                          : "bg-green-500"
                      }`}
                      style={{
                        width: `${Math.min(
                          ((usage.totalCitations || 0) /
                            (subscription?.features?.citations || 10)) *
                            100,
                          100
                        )}%`,
                      }}
                    ></div>
                  </div>
                </div>
              </>
            ) : (
              // Loading state for usage data
              <div className="text-center py-4 text-gray-500">
                <p>Loading usage data...</p>
              </div>
            )}
          </div>
        </div>

        {/* Subscription Status */}
        <div className="card">
          {/* Subscription status card */}
          <h2 className="text-lg font-semibold text-gray-900 mb-4">
            {/* Section title */}
            Subscription
          </h2>
          <div className="space-y-4">
            {/* Subscription details container */}
            {subscription ? (
              // Show subscription data if available
              <>
                {/* Current Plan */}
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Current Plan</span>
                  {/* Label */}
                  <span className="font-medium text-gray-900 capitalize">
                    {/* Plan name */}
                    {subscription.plan || "Free"}
                  </span>
                </div>
                {/* Subscription Status */}
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Status</span>
                  {/* Label */}
                  <span
                    className={`px-2 py-1 rounded-full text-xs font-medium ${
                      subscription.status === "active"
                        ? "bg-green-100 text-green-800"
                        : subscription.status === "incomplete"
                        ? "bg-yellow-100 text-yellow-800"
                        : "bg-gray-100 text-gray-800"
                    }`}
                  >
                    {subscription.status || "Active"}
                    {/* Status text */}
                  </span>
                </div>
                {/* Next Billing Date */}
                {subscription.currentPeriodEnd && (
                  // Only show if billing date exists
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">Next billing</span>
                    {/* Label */}
                    <span className="text-gray-900">
                      {/* Billing date */}
                      {new Date(
                        subscription.currentPeriodEnd
                      ).toLocaleDateString()}
                    </span>
                  </div>
                )}
                {/* Action Button */}
                <div className="pt-2">
                  {/* Button container */}
                  <Link
                    to="/pricing"
                    className="btn-primary w-full text-center block"
                  >
                    {/* Full-width button */}
                    {subscription.plan === "free"
                      ? "Upgrade Plan"
                      : "Manage Subscription"}
                  </Link>
                </div>
              </>
            ) : (
              // Loading state for subscription data
              <div className="text-center py-4 text-gray-500">
                <p>Loading subscription data...</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Recent Activity Section */}
      <div className="card">
        {/* Recent activity card */}
        <div className="flex items-center justify-between mb-4">
          {/* Section header */}
          <h2 className="text-lg font-semibold text-gray-900">
            {/* Section title */}
            Recent Activity
          </h2>
          <Link
            to="/notes"
            className="text-sm text-primary-600 hover:text-primary-500"
          >
            {/* View all link */}
            View all
          </Link>
        </div>

        {/* Conditional rendering based on loading and error states */}
        {!user ? (
          // Show loading if no user
          <div className="flex items-center justify-center py-8">
            {/* Loading container */}
            <div className="spinner"></div>
            {/* Loading spinner */}
          </div>
        ) : notesLoading ? (
          // Show loading if notes are loading
          <div className="flex items-center justify-center py-8">
            {/* Loading container */}
            <div className="spinner"></div>
            {/* Loading spinner */}
          </div>
        ) : notesError ? (
          // Show error state if notes failed to load
          <div className="text-center py-8 text-gray-500">
            {/* Error container */}
            <DocumentTextIcon className="w-12 h-12 mx-auto mb-3 text-gray-300" />
            {/* Error icon */}
            <p>Unable to load recent activity</p>
            {/* Error message */}
            <p className="text-sm">Please try refreshing the page</p>
            {/* Error suggestion */}
            <button
              onClick={() => window.location.reload()}
              className="mt-3 text-blue-600 hover:text-blue-500 text-sm"
            >
              {/* Refresh button */}
              Refresh Page
            </button>
          </div>
        ) : recentNotes.length > 0 ? (
          // Show notes if available
          <div className="space-y-4">
            {/* Notes list container */}
            {recentNotes.map((note) => (
              // Map through recent notes
              <div
                key={note._id}
                className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:border-blue-300 hover:shadow-sm transition-all duration-200"
              >
                {/* Note item styling */}
                <div className="flex items-center flex-1">
                  {/* Note content layout */}
                  <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center mr-3">
                    {/* Note icon container */}
                    <DocumentTextIcon className="w-5 h-5 text-blue-600" />
                    {/* Note icon */}
                  </div>
                  <div className="flex-1 min-w-0">
                    {/* Note details container */}
                    <h3 className="font-medium text-gray-900 truncate">
                      {/* Note title */}
                      {note.title}
                    </h3>
                    <div className="flex items-center text-sm text-gray-500 mt-1">
                      {/* Note metadata */}
                      <ClockIcon className="w-4 h-4 mr-1" />
                      {/* Time icon */}
                      <span>
                        {/* Last updated date */}
                        {new Date(note.updatedAt).toLocaleDateString()}
                      </span>
                      {note.subject && (
                        // Show subject if available
                        <>
                          <span className="mx-2">•</span>
                          {/* Separator */}
                          <span className="bg-gray-100 px-2 py-1 rounded text-xs">
                            {/* Subject badge */}
                            {note.subject}
                          </span>
                        </>
                      )}
                    </div>
                  </div>
                </div>
                <Link
                  to={`/notes/${note._id}`}
                  className="text-blue-600 hover:text-blue-500 text-sm font-medium"
                >
                  {/* View link styling */}
                  View
                </Link>
              </div>
            ))}
          </div>
        ) : (
          // Empty state when no notes exist
          <div className="text-center py-8 text-gray-500">
            {/* Empty state container */}
            <DocumentTextIcon className="w-12 h-12 mx-auto mb-3 text-gray-300" />
            {/* Empty state icon */}
            <p>No recent activity</p>
            {/* Empty state message */}
            <p className="text-sm">Start by creating your first note!</p>
            {/* Empty state suggestion */}
            <Link
              to="/notes/new"
              className="inline-flex items-center mt-3 text-blue-600 hover:text-blue-500"
            >
              {/* Create note link */}
              <PlusIcon className="w-4 h-4 mr-1" />
              {/* Plus icon */}
              Create Note
            </Link>
          </div>
        )}
      </div>

      {/* University Information Section - Only shown if user has university data */}
      {user?.university && (
        // Only show if user has university information
        <div className="card bg-blue-50 border-blue-200">
          {/* University info card */}
          <div className="flex items-center">
            {/* University info layout */}
            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center mr-4">
              {/* University icon container */}
              <AcademicCapIcon className="w-5 h-5 text-blue-600" />
              {/* University icon */}
            </div>
            <div>
              {/* University text content */}
              <h3 className="font-medium text-blue-900">
                {/* University title */}
                University Partnership
              </h3>
              <p className="text-sm text-blue-700">
                {/* University description */}
                You're using Noted.AI through {user.university.name}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// Export the Dashboard component as default
export default Dashboard;
