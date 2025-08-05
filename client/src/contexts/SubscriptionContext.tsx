// Import necessary React hooks and types for context creation and state management
import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
// Import axios for HTTP requests to the backend API
import axios from "axios";
// Import toast for user notifications
import toast from "react-hot-toast";

// Interface defining the structure of a Subscription object
// Contains all subscription-related data including plan details and Stripe integration
interface Subscription {
  plan: string; // Subscription plan type (e.g., 'free', 'premium', 'enterprise')
  status: string; // Subscription status (e.g., 'active', 'cancelled', 'past_due')
  stripeCustomerId?: string; // Stripe customer ID for payment processing (optional)
  stripeSubscriptionId?: string; // Stripe subscription ID for payment processing (optional)
  currentPeriodEnd?: string; // End date of current billing period (optional)
  features: {
    aiSummaries: number; // Number of AI summaries allowed per month
    flashcardGeneration: number; // Number of flashcard generations allowed per month
    assignmentHelp: number; // Number of assignment help sessions allowed per month
    citations: number; // Number of citation generations allowed per month
  };
}

// Interface defining the structure of Usage statistics
// Tracks user's actual usage of various features
interface Usage {
  totalNotes: number; // Total number of notes created by the user
  totalSummaries: number; // Total number of AI summaries generated
  totalFlashcards: number; // Total number of flashcards created
  totalAssignments: number; // Total number of assignment help sessions used
  totalCitations: number; // Total number of citations generated
  lastActive: string; // Timestamp of user's last activity
}

// Interface defining the structure of the SubscriptionContext
// Contains all subscription-related functions and state
interface SubscriptionContextType {
  subscription: Subscription | null; // Current subscription data or null if not loaded
  usage: Usage | null; // Current usage statistics or null if not loaded
  loading: boolean; // Loading state for subscription operations
  refreshSubscription: () => Promise<void>; // Function to refresh subscription data
  cancelSubscription: () => Promise<void>; // Function to cancel current subscription
  reactivateSubscription: () => Promise<void>; // Function to reactivate cancelled subscription
}

// Create the subscription context with undefined as default value
const SubscriptionContext = createContext<SubscriptionContextType | undefined>(
  undefined
);

// Custom hook to use the subscription context
// Throws an error if used outside of SubscriptionProvider
export const useSubscription = () => {
  const context = useContext(SubscriptionContext);
  if (context === undefined) {
    throw new Error(
      "useSubscription must be used within a SubscriptionProvider"
    );
  }
  return context;
};

// Interface for SubscriptionProvider component props
interface SubscriptionProviderProps {
  children: ReactNode; // React children to be wrapped by the provider
}

// SubscriptionProvider component that wraps the app and provides subscription context
export const SubscriptionProvider: React.FC<SubscriptionProviderProps> = ({
  children,
}) => {
  // State to store current subscription data
  const [subscription, setSubscription] = useState<Subscription | null>(null);
  // State to store current usage statistics
  const [usage, setUsage] = useState<Usage | null>(null);
  // State to track loading status during subscription operations
  const [loading, setLoading] = useState(true);

  // Function to fetch subscription status and usage from the backend API
  const fetchSubscriptionStatus = async () => {
    try {
      console.log("Fetching subscription status..."); // Debug log
      // Make API call to get subscription and usage data
      const response = await axios.get("/api/subscriptions/status");
      console.log("Subscription response:", response.data); // Debug log

      // Check if both subscription and usage data are present in response
      if (response.data.subscription && response.data.usage) {
        setSubscription(response.data.subscription); // Update subscription state
        setUsage(response.data.usage); // Update usage state
      } else {
        console.warn("Missing subscription or usage data in response"); // Warning log
        throw new Error("Invalid response structure");
      }
    } catch (error) {
      console.error("Failed to fetch subscription status:", error); // Error log
      // Set default values if API fails to ensure app continues to work
      setSubscription({
        plan: "free", // Default to free plan
        status: "active", // Default to active status
        features: {
          aiSummaries: 5, // Default feature limits for free plan
          flashcardGeneration: 3,
          assignmentHelp: 2,
          citations: 10,
        },
      });
      setUsage({
        totalNotes: 0, // Default usage statistics
        totalSummaries: 0,
        totalFlashcards: 0,
        totalAssignments: 0,
        totalCitations: 0,
        lastActive: new Date().toISOString(), // Set current timestamp
      });
    } finally {
      setLoading(false); // Mark loading as complete regardless of success/failure
    }
  };

  // Fetch subscription status on component mount
  useEffect(() => {
    fetchSubscriptionStatus();
  }, []);

  // Function to refresh subscription data
  // Useful after subscription changes or when data needs to be updated
  const refreshSubscription = async () => {
    setLoading(true); // Set loading state
    await fetchSubscriptionStatus(); // Fetch latest data
    setLoading(false); // Clear loading state
  };

  // Function to cancel the current subscription
  // Sends request to backend to cancel subscription at period end
  const cancelSubscription = async () => {
    try {
      // Send cancellation request to backend API
      await axios.post("/api/subscriptions/cancel");
      // Refresh subscription data to get updated status
      await refreshSubscription();
      // Show success notification
      toast.success(
        "Subscription will be cancelled at the end of the current period"
      );
    } catch (error: any) {
      // Extract error message from response or use default
      const message =
        error.response?.data?.error || "Failed to cancel subscription";
      // Show error notification
      toast.error(message);
      // Re-throw error for component handling
      throw error;
    }
  };

  // Function to reactivate a cancelled subscription
  // Sends request to backend to reactivate subscription
  const reactivateSubscription = async () => {
    try {
      // Send reactivation request to backend API
      await axios.post("/api/subscriptions/reactivate");
      // Refresh subscription data to get updated status
      await refreshSubscription();
      // Show success notification
      toast.success("Subscription reactivated successfully");
    } catch (error: any) {
      // Extract error message from response or use default
      const message =
        error.response?.data?.error || "Failed to reactivate subscription";
      // Show error notification
      toast.error(message);
      // Re-throw error for component handling
      throw error;
    }
  };

  // Create the context value object with all subscription functions and state
  const value: SubscriptionContextType = {
    subscription,
    usage,
    loading,
    refreshSubscription,
    cancelSubscription,
    reactivateSubscription,
  };

  // Return the SubscriptionContext.Provider with the value and children
  return (
    <SubscriptionContext.Provider value={value}>
      {children}
    </SubscriptionContext.Provider>
  );
};
