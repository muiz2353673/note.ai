import React, { useState } from "react"; // Import React and useState hook for state management
import { UserIcon, CogIcon, CreditCardIcon } from "@heroicons/react/24/outline"; // Import icons for UI
import { useAuth } from "../contexts/AuthContext"; // Import custom authentication context
import SubscriptionManager from "../components/SubscriptionManager"; // Import subscription management component

// Profile component displays user profile, subscription, and settings tabs
const Profile: React.FC = () => {
  // Destructure user object and updateUser function from AuthContext
  const { user, updateUser } = useAuth();
  // State to track which tab is currently active
  const [activeTab, setActiveTab] = useState("profile");

  // Define the available tabs with their respective icons
  const tabs = [
    { id: "profile", name: "Profile", icon: UserIcon }, // Profile info tab
    { id: "subscription", name: "Subscription", icon: CreditCardIcon }, // Subscription management tab
    { id: "settings", name: "Settings", icon: CogIcon }, // Settings tab
  ];

  return (
    <div className="space-y-6">
      {/* Header Section */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Profile</h1>
        <p className="text-gray-600">
          Manage your account settings and preferences
        </p>
      </div>

      {/* Tab Navigation */}
      <div className="border-b border-gray-200">
        <nav className="-mb-px flex space-x-8">
          {/* Render each tab as a button */}
          {tabs.map((tab) => {
            const Icon = tab.icon; // Get the icon component for the tab
            return (
              <button
                key={tab.id} // Unique key for each tab
                onClick={() => setActiveTab(tab.id)} // Set active tab on click
                className={`py-2 px-1 border-b-2 font-medium text-sm flex items-center space-x-2 ${
                  activeTab === tab.id
                    ? "border-primary-500 text-primary-600" // Highlight active tab
                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300" // Style for inactive tabs
                }`}
              >
                <Icon className="w-4 h-4" /> {/* Tab icon */}
                <span>{tab.name}</span> {/* Tab name */}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Tab Content */}
      {/* Profile Tab Content */}
      {activeTab === "profile" && (
        <div className="card">
          <h3 className="text-lg font-medium text-gray-900 mb-4">
            Account Information
          </h3>
          <div className="space-y-4">
            {/* Display user's name */}
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Name
              </label>
              <p className="mt-1 text-sm text-gray-900">
                {user?.firstName} {user?.lastName}
              </p>
            </div>
            {/* Display user's email */}
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Email
              </label>
              <p className="mt-1 text-sm text-gray-900">{user?.email}</p>
            </div>
            {/* Display user's role */}
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Role
              </label>
              <p className="mt-1 text-sm text-gray-900 capitalize">
                {user?.role}
              </p>
            </div>
            {/* Display user's account creation date */}
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Member Since
              </label>
              <p className="mt-1 text-sm text-gray-900">
                {new Date(user?.createdAt || Date.now()).toLocaleDateString()}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Subscription Tab Content */}
      {activeTab === "subscription" && (
        // Render SubscriptionManager component, passing user and updateUser as props
        <SubscriptionManager user={user} onUpdate={updateUser} />
      )}

      {/* Settings Tab Content */}
      {activeTab === "settings" && (
        <div className="card text-center py-12">
          <CogIcon className="w-16 h-16 text-gray-300 mx-auto mb-4" />{" "}
          {/* Large settings icon */}
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            Account Settings
          </h3>
          <p className="text-gray-600 mb-6">
            Manage your account preferences and settings.
          </p>
          <p className="text-sm text-gray-500">
            This feature is coming soon! You'll be able to customize your
            experience.
          </p>
        </div>
      )}
    </div>
  );
};

export default Profile; // Export the Profile component as default
