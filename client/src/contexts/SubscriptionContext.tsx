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
  plan: string;
  status: string;
  stripeCustomerId?: string;
  stripeSubscriptionId?: string;
  currentPeriodEnd?: string;
  features: {
    aiSummaries: number;
    flashcardGeneration: number;
    assignmentHelp: number;
    citations: number;
  };
}

// Interface defining the structure of Usage statistics
// Tracks user's actual usage of various features
interface Usage {
  totalNotes: number;
  totalSummaries: number;
  totalFlashcards: number;
  totalAssignments: number;
  totalCitations: number;
  lastActive: string;
}

// Interface defining the structure of the SubscriptionContext
// Contains all subscription-related functions and state
interface SubscriptionContextType {
  subscription: Subscription | null;
  usage: Usage | null;
  loading: boolean;
  refreshSubscription: () => Promise<void>;
  cancelSubscription: () => Promise<void>;
  reactivateSubscription: () => Promise<void>;
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
  children: ReactNode;
}

// SubscriptionProvider component that wraps the app and provides subscription context
export const SubscriptionProvider: React.FC<SubscriptionProviderProps> = ({
  children,
}) => {
 
  const [subscription, setSubscription] = useState<Subscription | null>(null);
 
  const [usage, setUsage] = useState<Usage | null>(null);
 
  const [loading, setLoading] = useState(true);

 
  const fetchSubscriptionStatus = async () => {
    try {
      console.log("Fetching subscription status...");
     
      const response = await axios.get("/api/subscriptions/status");
      console.log("Subscription response:", response.data);

     
      if (response.data.subscription && response.data.usage) {
        setSubscription(response.data.subscription);
        setUsage(response.data.usage);
      } else {
        console.warn("Missing subscription or usage data in response");
        throw new Error("Invalid response structure");
      }
    } catch (error) {
      console.error("Failed to fetch subscription status:", error);
     
      setSubscription({
        plan: "free",
        status: "active",
        features: {
          aiSummaries: 5,
          flashcardGeneration: 3,
          assignmentHelp: 2,
          citations: 10,
        },
      });
      setUsage({
        totalNotes: 0,
        totalSummaries: 0,
        totalFlashcards: 0,
        totalAssignments: 0,
        totalCitations: 0,
        lastActive: new Date().toISOString(),
      });
    } finally {
      setLoading(false);
    }
  };

 
  useEffect(() => {
    fetchSubscriptionStatus();
  }, []);

 
 
  const refreshSubscription = async () => {
    setLoading(true);
    await fetchSubscriptionStatus();
    setLoading(false);
  };

 
 
  const cancelSubscription = async () => {
    try {
     
      await axios.post("/api/subscriptions/cancel");
     
      await refreshSubscription();
     
      toast.success(
        "Subscription will be cancelled at the end of the current period"
      );
    } catch (error: any) {
     
      const message =
        error.response?.data?.error || "Failed to cancel subscription";
     
      toast.error(message);
     
      throw error;
    }
  };

 
 
  const reactivateSubscription = async () => {
    try {
     
      await axios.post("/api/subscriptions/reactivate");
     
      await refreshSubscription();
     
      toast.success("Subscription reactivated successfully");
    } catch (error: any) {
     
      const message =
        error.response?.data?.error || "Failed to reactivate subscription";
     
      toast.error(message);
     
      throw error;
    }
  };

 
  const value: SubscriptionContextType = {
    subscription,
    usage,
    loading,
    refreshSubscription,
    cancelSubscription,
    reactivateSubscription,
  };

 
  return (
    <SubscriptionContext.Provider value={value}>
      {children}
    </SubscriptionContext.Provider>
  );
};
