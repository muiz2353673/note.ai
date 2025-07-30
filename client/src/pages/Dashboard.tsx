import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { useSubscription } from "../contexts/SubscriptionContext";
import {
  DocumentTextIcon,
  LightBulbIcon,
  BookOpenIcon,
  AcademicCapIcon,
  PlusIcon,
  ArrowUpIcon,
  ArrowDownIcon,
} from "@heroicons/react/24/outline";

const Dashboard: React.FC = () => {
  const { user } = useAuth();
  const { subscription, usage } = useSubscription();

  // Debug logging
  console.log("Dashboard - User:", user);
  console.log("Dashboard - Subscription:", subscription);
  console.log("Dashboard - Usage:", usage);

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate loading recent notes
    setTimeout(() => {
      setLoading(false);
    }, 1000);
  }, []);

  const stats = [
    {
      name: "Total Notes",
      value: user?.usage?.totalNotes || 0,
      icon: DocumentTextIcon,
      color: "text-blue-600",
      bgColor: "bg-blue-100",
      change: "+12%",
      changeType: "increase",
    },
    {
      name: "AI Summaries",
      value: user?.usage?.totalSummaries || 0,
      icon: LightBulbIcon,
      color: "text-green-600",
      bgColor: "bg-green-100",
      change: "+8%",
      changeType: "increase",
    },
    {
      name: "Flashcards",
      value: user?.usage?.totalFlashcards || 0,
      icon: BookOpenIcon,
      color: "text-purple-600",
      bgColor: "bg-purple-100",
      change: "+15%",
      changeType: "increase",
    },
    {
      name: "Assignments",
      value: user?.usage?.totalAssignments || 0,
      icon: AcademicCapIcon,
      color: "text-orange-600",
      bgColor: "bg-orange-100",
      change: "+5%",
      changeType: "increase",
    },
  ];

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

  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div className="bg-gradient-to-r from-primary-600 to-secondary-600 rounded-xl p-6 text-white">
        <h1 className="text-2xl font-bold mb-2">
          Welcome back, {user?.firstName}! 👋
        </h1>
        <p className="text-primary-100">
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

      {/* Usage & Subscription */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Usage Overview */}
        <div className="card">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">
            Usage This Month
          </h2>
          <div className="space-y-4">
            {usage &&
              Object.entries(usage).map(([key, value]) => {
                if (key === "lastActive") return null;
                const limit =
                  subscription?.features[
                    key as keyof typeof subscription.features
                  ] || 0;
                const percentage = limit > 0 ? (value / limit) * 100 : 0;

                return (
                  <div key={key}>
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-gray-600 capitalize">
                        {key
                          .replace(/([A-Z])/g, " $1")
                          .replace(/^./, (str) => str.toUpperCase())}
                      </span>
                      <span className="text-gray-900">
                        {value} / {limit === -1 ? "∞" : limit}
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className={`h-2 rounded-full ${
                          percentage > 80
                            ? "bg-error-500"
                            : percentage > 60
                            ? "bg-warning-500"
                            : "bg-success-500"
                        }`}
                        style={{ width: `${Math.min(percentage, 100)}%` }}
                      ></div>
                    </div>
                  </div>
                );
              })}
          </div>
        </div>

        {/* Subscription Status */}
        <div className="card">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">
            Subscription
          </h2>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-gray-600">Current Plan</span>
              <span className="font-medium text-gray-900 capitalize">
                {subscription?.plan || "Free"}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-600">Status</span>
              <span
                className={`px-2 py-1 rounded-full text-xs font-medium ${
                  subscription?.status === "active"
                    ? "bg-success-100 text-success-800"
                    : "bg-gray-100 text-gray-800"
                }`}
              >
                {subscription?.status || "Active"}
              </span>
            </div>
            {subscription?.currentPeriodEnd && (
              <div className="flex items-center justify-between">
                <span className="text-gray-600">Next billing</span>
                <span className="text-gray-900">
                  {new Date(subscription.currentPeriodEnd).toLocaleDateString()}
                </span>
              </div>
            )}
            <Link to="/pricing" className="btn-primary w-full text-center">
              {subscription?.plan === "free"
                ? "Upgrade Plan"
                : "Manage Subscription"}
            </Link>
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

        {loading ? (
          <div className="flex items-center justify-center py-8">
            <div className="spinner"></div>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="text-center py-8 text-gray-500">
              <DocumentTextIcon className="w-12 h-12 mx-auto mb-3 text-gray-300" />
              <p>No recent activity</p>
              <p className="text-sm">Start by creating your first note!</p>
            </div>
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
