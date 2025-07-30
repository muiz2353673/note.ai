import React, { useState } from "react";
import { toast } from "react-hot-toast";
import {
  CreditCardIcon,
  CalendarIcon,
  CheckIcon,
} from "@heroicons/react/24/outline";

interface SubscriptionManagerProps {
  user: any;
  onUpdate: (data?: any) => void;
}

const SubscriptionManager: React.FC<SubscriptionManagerProps> = ({
  user,
  onUpdate,
}) => {
  const [loading, setLoading] = useState(false);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const getUsagePercentage = (current: number, limit: number) => {
    if (limit === -1) return 0; // Unlimited
    return Math.round((current / limit) * 100);
  };

  const cancelSubscription = async () => {
    if (!window.confirm("Are you sure you want to cancel your subscription?")) {
      return;
    }

    setLoading(true);
    try {
      const response = await fetch("/api/subscriptions/cancel", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      if (!response.ok) {
        throw new Error("Failed to cancel subscription");
      }

      toast.success("Subscription cancelled successfully");
      onUpdate();
    } catch (error: any) {
      toast.error(error.message || "Failed to cancel subscription");
    } finally {
      setLoading(false);
    }
  };

  const getPlanFeatures = (plan: string) => {
    const features = {
      free: [
        "5 AI summaries per month",
        "3 flashcard sets per month",
        "2 assignment help sessions",
        "10 citations per month",
      ],
      student: [
        "100 AI summaries per month",
        "50 flashcard sets per month",
        "25 assignment help sessions",
        "200 citations per month",
        "Priority support",
        "Export to PDF/Word",
      ],
      university: [
        "Unlimited AI summaries",
        "Unlimited flashcard sets",
        "Unlimited assignment help",
        "Unlimited citations",
        "Custom branding",
        "Analytics dashboard",
        "LMS integration",
        "Dedicated support",
      ],
    };
    return features[plan as keyof typeof features] || features.free;
  };

  if (!user?.subscription) {
    return (
      <div className="card">
        <div className="text-center py-8">
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            No Active Subscription
          </h3>
          <p className="text-gray-600 mb-4">
            You're currently on the free plan.
          </p>
          <a
            href="/pricing"
            className="inline-flex items-center px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
          >
            View Plans
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Current Plan */}
      <div className="card">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-medium text-gray-900">Current Plan</h3>
          <span
            className={`px-3 py-1 rounded-full text-sm font-medium ${
              user.subscription.status === "active"
                ? "bg-success-100 text-success-800"
                : "bg-warning-100 text-warning-800"
            }`}
          >
            {user.subscription.status.charAt(0).toUpperCase() +
              user.subscription.status.slice(1)}
          </span>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <h4 className="font-semibold text-gray-900 mb-2">
              {user.subscription.plan.charAt(0).toUpperCase() +
                user.subscription.plan.slice(1)}{" "}
              Plan
            </h4>
            <div className="space-y-2 text-sm text-gray-600">
              <div className="flex items-center">
                <CalendarIcon className="w-4 h-4 mr-2" />
                <span>
                  Next billing: {formatDate(user.subscription.currentPeriodEnd)}
                </span>
              </div>
              {user.subscription.stripeCustomerId && (
                <div className="flex items-center">
                  <CreditCardIcon className="w-4 h-4 mr-2" />
                  <span>Payment method saved</span>
                </div>
              )}
            </div>
          </div>

          <div className="text-right">
            {user.subscription.status === "active" && (
              <button
                onClick={cancelSubscription}
                disabled={loading}
                className="px-4 py-2 text-sm border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 disabled:opacity-50 transition-colors"
              >
                {loading ? "Cancelling..." : "Cancel Subscription"}
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Usage */}
      <div className="card">
        <h3 className="text-lg font-medium text-gray-900 mb-4">
          Usage This Month
        </h3>
        <div className="space-y-4">
          {Object.entries(user.subscription.features).map(
            ([feature, limit]) => {
              const usage =
                user.usage[
                  `total${feature.charAt(0).toUpperCase() + feature.slice(1)}`
                ] || 0;
              const percentage = getUsagePercentage(usage, limit as number);
              const isUnlimited = limit === -1;

              return (
                <div key={feature} className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-700">
                      {feature
                        .replace(/([A-Z])/g, " $1")
                        .replace(/^./, (str) => str.toUpperCase())}
                    </span>
                    <span className="text-gray-500">
                      {usage} / {isUnlimited ? "∞" : limit}
                    </span>
                  </div>
                  {!isUnlimited && (
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-primary-600 h-2 rounded-full transition-all duration-300"
                        style={{ width: `${Math.min(percentage, 100)}%` }}
                      />
                    </div>
                  )}
                </div>
              );
            }
          )}
        </div>
      </div>

      {/* Features */}
      <div className="card">
        <h3 className="text-lg font-medium text-gray-900 mb-4">
          Plan Features
        </h3>
        <ul className="space-y-2">
          {getPlanFeatures(user.subscription.plan).map((feature, index) => (
            <li key={index} className="flex items-center">
              <CheckIcon className="w-5 h-5 text-success-500 mr-3 flex-shrink-0" />
              <span className="text-gray-700">{feature}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default SubscriptionManager;
