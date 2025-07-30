import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import axios from "axios";
import toast from "react-hot-toast";

interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: string;
  subscription: {
    plan: string;
    status: string;
    features: {
      aiSummaries: number;
      flashcardGeneration: number;
      assignmentHelp: number;
      citations: number;
    };
  };
  university?: {
    name: string;
    domain: string;
  };
  preferences: {
    citationStyle: string;
    language: string;
    theme: string;
  };
  usage: {
    totalNotes: number;
    totalSummaries: number;
    totalFlashcards: number;
    totalAssignments: number;
    lastActive: string;
  };
  isEmailVerified: boolean;
  createdAt?: string;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (userData: RegisterData) => Promise<void>;
  logout: () => void;
  updateUser: (data: Partial<User>) => void;
}

interface RegisterData {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  universityDomain?: string;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  // Set up axios defaults
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
    }
  }, []);

  // Check if user is authenticated on mount
  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem("token");
      if (token) {
        try {
          const response = await axios.get("/api/auth/me");
          const user = response.data.user;
          
          // Ensure user object has proper structure
          const userWithDefaults = {
            ...user,
            usage: user.usage || {
              totalNotes: 0,
              totalSummaries: 0,
              totalFlashcards: 0,
              totalAssignments: 0,
              lastActive: new Date().toISOString(),
            },
            subscription: user.subscription || {
              plan: 'free',
              status: 'active',
              features: {
                aiSummaries: 5,
                flashcardGeneration: 3,
                assignmentHelp: 2,
                citations: 10,
              },
            },
          };
          
          setUser(userWithDefaults);
        } catch (error) {
          localStorage.removeItem("token");
          delete axios.defaults.headers.common["Authorization"];
        }
      }
      setLoading(false);
    };

    checkAuth();
  }, []);

  const login = async (email: string, password: string) => {
    try {
      const response = await axios.post("/api/auth/login", { email, password });
      const { token, user } = response.data;

      // Ensure user object has proper structure
      const userWithDefaults = {
        ...user,
        usage: user.usage || {
          totalNotes: 0,
          totalSummaries: 0,
          totalFlashcards: 0,
          totalAssignments: 0,
          lastActive: new Date().toISOString(),
        },
        subscription: user.subscription || {
          plan: 'free',
          status: 'active',
          features: {
            aiSummaries: 5,
            flashcardGeneration: 3,
            assignmentHelp: 2,
            citations: 10,
          },
        },
      };

      localStorage.setItem("token", token);
      axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
      setUser(userWithDefaults);

      toast.success("Welcome back!");
    } catch (error: any) {
      const message = error.response?.data?.error || "Login failed";
      toast.error(message);
      throw error;
    }
  };

  const register = async (userData: RegisterData) => {
    try {
      const response = await axios.post("/api/auth/register", userData);
      const { token, user } = response.data;

      // Ensure user object has proper structure
      const userWithDefaults = {
        ...user,
        usage: user.usage || {
          totalNotes: 0,
          totalSummaries: 0,
          totalFlashcards: 0,
          totalAssignments: 0,
          lastActive: new Date().toISOString(),
        },
        subscription: user.subscription || {
          plan: 'free',
          status: 'active',
          features: {
            aiSummaries: 5,
            flashcardGeneration: 3,
            assignmentHelp: 2,
            citations: 10,
          },
        },
      };

      localStorage.setItem("token", token);
      axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
      setUser(userWithDefaults);

      toast.success(
        "Account created successfully! Please check your email to verify your account."
      );
    } catch (error: any) {
      const message = error.response?.data?.error || "Registration failed";
      toast.error(message);
      throw error;
    }
  };

  const logout = () => {
    localStorage.removeItem("token");
    delete axios.defaults.headers.common["Authorization"];
    setUser(null);
    toast.success("Logged out successfully");
  };

  const updateUser = (data: Partial<User>) => {
    if (user) {
      // Ensure usage object exists with default values
      const updatedUser = { ...user, ...data };
      if (!updatedUser.usage) {
        updatedUser.usage = {
          totalNotes: 0,
          totalSummaries: 0,
          totalFlashcards: 0,
          totalAssignments: 0,
          lastActive: new Date().toISOString(),
        };
      }

      // Ensure subscription object exists with default values
      if (!updatedUser.subscription) {
        updatedUser.subscription = {
          plan: "free",
          status: "active",
          features: {
            aiSummaries: 5,
            flashcardGeneration: 3,
            assignmentHelp: 2,
            citations: 10,
          },
        };
      }

      setUser(updatedUser);
    }
  };

  const value: AuthContextType = {
    user,
    loading,
    login,
    register,
    logout,
    updateUser,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
