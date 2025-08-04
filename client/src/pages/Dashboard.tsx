import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { useSubscription } from "../contexts/SubscriptionContext";
import axios from "axios";
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

interface Note {
  _id: string;
  title: string;
  content: string;
  subject: string;
  tags: string[];
  isBookmarked?: boolean;
  createdAt: string;
  updatedAt: string;
}

const Dashboard: React.FC = () => {
  const { user } = useAuth();
  const { subscription, usage, loading } = useSubscription();

  // Debug logging
  console.log("Dashboard - User:", user);
  console.log("Dashboard - Subscription:", subscription);
  console.log("Dashboard - Usage:", usage);

  const [notesLoading, setNotesLoading] = useState(true);
  const [recentNotes, setRecentNotes] = useState<Note[]>([]);
  const [notesError, setNotesError] = useState(false);

  useEffect(() => {
    const fetchRecentNotes = async () => {
      try {
        setNotesLoading(true);
        setNotesError(false);
        console.log("Fetching recent notes...");
        const response = await axios.get("/api/notes?limit=5");
        console.log("Recent notes response:", response.data);
        setRecentNotes(response.data.notes || []);
      } catch (error) {
        console.error("Failed to fetch recent notes:", error);
        setRecentNotes([]);
        setNotesError(true);
      } finally {
        setNotesLoading(false);
      }
    };

    // Only fetch notes if user is authenticated
    if (user) {
      fetchRecentNotes();
    }
  }, [user]);

  const stats = [
    {
      name: "Total Notes",
      value: usage?.totalNotes || user?.usage?.totalNotes || 0,
      icon: DocumentTextIcon,
      color: "text-blue-600",
      bgColor: "bg-blue-100",
      change: "+12%",
      changeType: "increase",
    },
    {
      name: "AI Summaries",
      value: usage?.totalSummaries || user?.usage?.totalSummaries || 0,
      icon: LightBulbIcon,
      color: "text-green-600",
      bgColor: "bg-green-100",
      change: "+8%",
      changeType: "increase",
    },
    {
      name: "Flashcards",
      value: usage?.totalFlashcards || user?.usage?.totalFlashcards || 0,
      icon: BookOpenIcon,
      color: "text-purple-600",
      bgColor: "bg-purple-100",
      change: "+15%",
      changeType: "increase",
    },
    {
      name: "Assignments",
      value: usage?.totalAssignments || user?.usage?.totalAssignments || 0,
      icon: AcademicCapIcon,
      color: "text-orange-600",
      bgColor: "bg-orange-100",
      change: "+5%",
      changeType: "increase",
    },
  ];

  // Debug logging for subscription data
  console.log("Dashboard - User usage:", user?.usage);
  console.log("Dashboard - Context usage:", usage);
  console.log("Dashboard - Context subscription:", subscription);

  const quickActions = [
    {
      name: "Create Note",
      description: "Start a new note",
      icon: PlusIcon,
      href: "/notes/new",
      color: "text-blue-600",
      bgColor: "bg-blue-100",
    },
    {
      name: "AI Summary",
      description: "Summarize your notes",
      icon: LightBulbIcon,
      href: "/ai-features",
      color: "text-green-600",
      bgColor: "bg-green-100",
    },
    {
      name: "Study Mode",
      description: "Review flashcards",
      icon: BookOpenIcon,
      href: "/flashcards",
      color: "text-purple-600",
      bgColor: "bg-purple-100",
    },
    {
      name: "Citations",
      description: "Generate citations",
      icon: AcademicCapIcon,
      href: "/citations",
      color: "text-orange-600",
      bgColor: "bg-orange-100",
    },
  ];

  // Show loading state if subscription data is still loading
  if (loading) {
    return (
      <div className="space-y-6">
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl p-6 text-white">
          <h1 className="text-2xl font-bold mb-2">
            Welcome back, {user?.firstName}! 👋
          </h1>
          <p className="text-blue-100">Loading your dashboard...</p>
        </div>
        <div className="flex items-center justify-center py-12">
          <div className="spinner"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl p-6 text-white">
        <h1 className="text-2xl font-bold mb-2">
          Welcome back, {user?.firstName}! 👋
        </h1>
        <p className="text-blue-100">
          Ready to continue your academic journey? Here's what's happening with
          your studies.
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat) => (
          <div key={stat.name} className="card">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">{stat.name}</p>
                <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                <div className="flex items-center mt-1">
                  {stat.changeType === "increase" ? (
                    <ArrowUpIcon className="w-4 h-4 text-green-500" />
                  ) : (
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
                  </span>
                </div>
              </div>
              <div className={`p-3 rounded-lg ${stat.bgColor}`}>
                <stat.icon className={`w-6 h-6 ${stat.color}`} />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Quick Actions */}
      <div className="card">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">
          Quick Actions
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {quickActions.map((action) => (
            <Link
              key={action.name}
              to={action.href}
              className="p-4 border border-gray-200 rounded-lg hover:border-primary-300 hover:shadow-md transition-all duration-200"
            >
              <div
                className={`w-10 h-10 ${action.bgColor} rounded-lg flex items-center justify-center mb-3`}
              >
                <action.icon className={`w-5 h-5 ${action.color}`} />
              </div>
              <h3 className="font-medium text-gray-900 mb-1">{action.name}</h3>
              <p className="text-sm text-gray-600">{action.description}</p>
            </Link>
          ))}
        </div>
      </div>

      {/* Upgrade Banner for Free Users */}
      {subscription?.plan === "free" && (
        <div className="card bg-gradient-to-r from-blue-50 to-purple-50 border-blue-200">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mr-4">
                <LightBulbIcon className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <h3 className="font-semibold text-blue-900 mb-1">
                  Unlock Premium Features
                </h3>
                <p className="text-sm text-blue-700">
                  Get unlimited AI summaries, flashcards, and more with our
                  Student plan
                </p>
              </div>
            </div>
            <Link to="/pricing" className="btn-primary whitespace-nowrap">
              Upgrade Now
            </Link>
          </div>
        </div>
      )}

      {/* Usage & Subscription */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Usage Overview */}
        <div className="lg:col-span-2 card">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900">
              Usage This Month
            </h2>
            {subscription && (
              <Link to="/pricing" className="btn-primary text-sm px-4 py-2">
                {subscription.plan === "free"
                  ? "Upgrade Plan"
                  : "Manage Subscription"}
              </Link>
            )}
          </div>
          <div className="space-y-4">
            {usage ? (
              <>
                {/* AI Summaries */}
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-gray-600">AI Summaries</span>
                    <span className="text-gray-900">
                      {usage.totalSummaries || 0} /{" "}
                      {subscription?.features?.aiSummaries === -1
                        ? "∞"
                        : subscription?.features?.aiSummaries || 5}
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
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

                {/* Flashcards */}
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-gray-600">Flashcards</span>
                    <span className="text-gray-900">
                      {usage.totalFlashcards || 0} /{" "}
                      {subscription?.features?.flashcardGeneration === -1
                        ? "∞"
                        : subscription?.features?.flashcardGeneration || 3}
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
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

                {/* Assignments */}
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-gray-600">Assignments</span>
                    <span className="text-gray-900">
                      {usage.totalAssignments || 0} /{" "}
                      {subscription?.features?.assignmentHelp === -1
                        ? "∞"
                        : subscription?.features?.assignmentHelp || 2}
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
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

                {/* Citations */}
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-gray-600">Citations</span>
                    <span className="text-gray-900">
                      {usage.totalCitations || 0} /{" "}
                      {subscription?.features?.citations === -1
                        ? "∞"
                        : subscription?.features?.citations || 10}
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
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
              <div className="text-center py-4 text-gray-500">
                <p>Loading usage data...</p>
              </div>
            )}
          </div>
        </div>

        {/* Subscription Status */}
        <div className="card">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">
            Subscription
          </h2>
          <div className="space-y-4">
            {subscription ? (
              <>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Current Plan</span>
                  <span className="font-medium text-gray-900 capitalize">
                    {subscription.plan || "Free"}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Status</span>
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
                  </span>
                </div>
                {subscription.currentPeriodEnd && (
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">Next billing</span>
                    <span className="text-gray-900">
                      {new Date(
                        subscription.currentPeriodEnd
                      ).toLocaleDateString()}
                    </span>
                  </div>
                )}
                <div className="pt-2">
                  <Link
                    to="/pricing"
                    className="btn-primary w-full text-center block"
                  >
                    {subscription.plan === "free"
                      ? "Upgrade Plan"
                      : "Manage Subscription"}
                  </Link>
                </div>
              </>
            ) : (
              <div className="text-center py-4 text-gray-500">
                <p>Loading subscription data...</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="card">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-gray-900">
            Recent Activity
          </h2>
          <Link
            to="/notes"
            className="text-sm text-primary-600 hover:text-primary-500"
          >
            View all
          </Link>
        </div>

        {!user ? (
          <div className="flex items-center justify-center py-8">
            <div className="spinner"></div>
          </div>
        ) : notesLoading ? (
          <div className="flex items-center justify-center py-8">
            <div className="spinner"></div>
          </div>
        ) : notesError ? (
          <div className="text-center py-8 text-gray-500">
            <DocumentTextIcon className="w-12 h-12 mx-auto mb-3 text-gray-300" />
            <p>Unable to load recent activity</p>
            <p className="text-sm">Please try refreshing the page</p>
            <button
              onClick={() => window.location.reload()}
              className="mt-3 text-blue-600 hover:text-blue-500 text-sm"
            >
              Refresh Page
            </button>
          </div>
        ) : recentNotes.length > 0 ? (
          <div className="space-y-4">
            {recentNotes.map((note) => (
              <div
                key={note._id}
                className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:border-blue-300 hover:shadow-sm transition-all duration-200"
              >
                <div className="flex items-center flex-1">
                  <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center mr-3">
                    <DocumentTextIcon className="w-5 h-5 text-blue-600" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-medium text-gray-900 truncate">
                      {note.title}
                    </h3>
                    <div className="flex items-center text-sm text-gray-500 mt-1">
                      <ClockIcon className="w-4 h-4 mr-1" />
                      <span>
                        {new Date(note.updatedAt).toLocaleDateString()}
                      </span>
                      {note.subject && (
                        <>
                          <span className="mx-2">•</span>
                          <span className="bg-gray-100 px-2 py-1 rounded text-xs">
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
                  View
                </Link>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8 text-gray-500">
            <DocumentTextIcon className="w-12 h-12 mx-auto mb-3 text-gray-300" />
            <p>No recent activity</p>
            <p className="text-sm">Start by creating your first note!</p>
            <Link
              to="/notes/new"
              className="inline-flex items-center mt-3 text-blue-600 hover:text-blue-500"
            >
              <PlusIcon className="w-4 h-4 mr-1" />
              Create Note
            </Link>
          </div>
        )}
      </div>

      {/* University Info */}
      {user?.university && (
        <div className="card bg-blue-50 border-blue-200">
          <div className="flex items-center">
            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center mr-4">
              <AcademicCapIcon className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <h3 className="font-medium text-blue-900">
                University Partnership
              </h3>
              <p className="text-sm text-blue-700">
                You're using Noted.AI through {user.university.name}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
