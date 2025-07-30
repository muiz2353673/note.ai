import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import axios from "axios";
import toast from "react-hot-toast";

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

interface Usage {
  totalNotes: number;
  totalSummaries: number;
  totalFlashcards: number;
  totalAssignments: number;
  lastActive: string;
}

interface SubscriptionContextType {
  subscription: Subscription | null;
  usage: Usage | null;
  loading: boolean;
  refreshSubscription: () => Promise<void>;
  cancelSubscription: () => Promise<void>;
  reactivateSubscription: () => Promise<void>;
}

const SubscriptionContext = createContext<SubscriptionContextType | undefined>(
  undefined
);

export const useSubscription = () => {
  const context = useContext(SubscriptionContext);
  if (context === undefined) {
    throw new Error(
      "useSubscription must be used within a SubscriptionProvider"
    );
  }
  return context;
};

interface SubscriptionProviderProps {
  children: ReactNode;
}

export const SubscriptionProvider: React.FC<SubscriptionProviderProps> = ({
  children,
}) => {
  const [subscription, setSubscription] = useState<Subscription | null>(null);
  const [usage, setUsage] = useState<Usage | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchSubscriptionStatus = async () => {
    try {
      const response = await axios.get("/api/subscriptions/status");
      setSubscription(response.data.subscription);
      setUsage(response.data.usage);
    } catch (error) {
      console.error("Failed to fetch subscription status:", error);
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
