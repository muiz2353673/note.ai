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

// Interface defining the structure of a User object
// Contains all user-related data including profile, subscription, and usage statistics
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

// Interface defining the structure of the AuthContext
// Contains all authentication-related functions and state
interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (userData: RegisterData) => Promise<void>;
  logout: () => void;
  updateUser: (data: Partial<User>) => void;
}

// Interface for registration data
// Defines the required fields for user registration
interface RegisterData {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  universityDomain?: string;
}

// Create the authentication context with undefined as default value
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Custom hook to use the authentication context
// Throws an error if used outside of AuthProvider
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

// Interface for AuthProvider component props
interface AuthProviderProps {
  children: ReactNode;
}

// AuthProvider component that wraps the app and provides authentication context
export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
 
  const [user, setUser] = useState<User | null>(null);
 
  const [loading, setLoading] = useState(true);

 
 
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
     
      axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
    }
  }, []);

 
 
  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem("token");
      if (token) {
        try {
         
          const response = await axios.get("/api/auth/me");
          const user = response.data.user;
          
         
         
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
