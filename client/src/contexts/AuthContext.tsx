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
  id: string; // Unique user identifier
  email: string; // User's email address
  firstName: string; // User's first name
  lastName: string; // User's last name
  role: string; // User's role (e.g., 'student', 'teacher', 'admin')
  subscription: {
    plan: string; // Subscription plan type (e.g., 'free', 'premium', 'enterprise')
    status: string; // Subscription status (e.g., 'active', 'cancelled', 'expired')
    features: {
      aiSummaries: number; // Number of AI summaries allowed
      flashcardGeneration: number; // Number of flashcard generations allowed
      assignmentHelp: number; // Number of assignment help sessions allowed
      citations: number; // Number of citation generations allowed
    };
  };
  university?: {
    name: string; // University name (optional)
    domain: string; // University email domain (optional)
  };
  preferences: {
    citationStyle: string; // User's preferred citation style
    language: string; // User's preferred language
    theme: string; // User's preferred UI theme
  };
  usage: {
    totalNotes: number; // Total number of notes created
    totalSummaries: number; // Total number of summaries generated
    totalFlashcards: number; // Total number of flashcards created
    totalAssignments: number; // Total number of assignments helped with
    lastActive: string; // Last active timestamp
  };
  isEmailVerified: boolean; // Whether user's email has been verified
  createdAt?: string; // Account creation timestamp (optional)
}

// Interface defining the structure of the AuthContext
// Contains all authentication-related functions and state
interface AuthContextType {
  user: User | null; // Current user object or null if not authenticated
  loading: boolean; // Loading state for authentication checks
  login: (email: string, password: string) => Promise<void>; // Login function
  register: (userData: RegisterData) => Promise<void>; // Registration function
  logout: () => void; // Logout function
  updateUser: (data: Partial<User>) => void; // Function to update user data
}

// Interface for registration data
// Defines the required fields for user registration
interface RegisterData {
  email: string; // User's email address
  password: string; // User's password
  firstName: string; // User's first name
  lastName: string; // User's last name
  universityDomain?: string; // University domain (optional)
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
  children: ReactNode; // React children to be wrapped by the provider
}

// AuthProvider component that wraps the app and provides authentication context
export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  // State to store the current user (null if not authenticated)
  const [user, setUser] = useState<User | null>(null);
  // State to track loading status during authentication checks
  const [loading, setLoading] = useState(true);

  // Set up axios defaults for authentication headers
  // Runs once on component mount to configure axios with stored token
  useEffect(() => {
    const token = localStorage.getItem("token"); // Get stored authentication token
    if (token) {
      // Set the Authorization header for all future axios requests
      axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
    }
  }, []);

  // Check if user is authenticated on component mount
  // Validates stored token and fetches user data if valid
  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem("token"); // Get stored token
      if (token) {
        try {
          // Make API call to verify token and get user data
          const response = await axios.get("/api/auth/me");
          const user = response.data.user;
          
          // Ensure user object has proper structure with default values
          // This prevents errors if the backend doesn't return complete user data
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
          
          setUser(userWithDefaults); // Update user state with fetched data
        } catch (error) {
          // If token is invalid, remove it and clear authorization header
          localStorage.removeItem("token");
          delete axios.defaults.headers.common["Authorization"];
        }
      }
      setLoading(false); // Mark loading as complete
    };

    checkAuth(); // Execute the authentication check
  }, []);

  // Login function to authenticate user with email and password
  const login = async (email: string, password: string) => {
    try {
      // Send login request to backend API
      const response = await axios.post("/api/auth/login", { email, password });
      const { token, user } = response.data;

      // Ensure user object has proper structure with default values
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

      // Store token in localStorage for persistence
      localStorage.setItem("token", token);
      // Set authorization header for future requests
      axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
      // Update user state
      setUser(userWithDefaults);

      // Show success notification
      toast.success("Welcome back!");
    } catch (error: any) {
      // Extract error message from response or use default
      const message = error.response?.data?.error || "Login failed";
      // Show error notification
      toast.error(message);
      // Re-throw error for component handling
      throw error;
    }
  };

  // Registration function to create new user account
  const register = async (userData: RegisterData) => {
    try {
      // Send registration request to backend API
      const response = await axios.post("/api/auth/register", userData);
      const { token, user } = response.data;

      // Ensure user object has proper structure with default values
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

      // Store token in localStorage for persistence
      localStorage.setItem("token", token);
      // Set authorization header for future requests
      axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
      // Update user state
      setUser(userWithDefaults);

      // Show success notification with email verification reminder
      toast.success(
        "Account created successfully! Please check your email to verify your account."
      );
    } catch (error: any) {
      // Extract error message from response or use default
      const message = error.response?.data?.error || "Registration failed";
      // Show error notification
      toast.error(message);
      // Re-throw error for component handling
      throw error;
    }
  };

  // Logout function to clear authentication state
  const logout = () => {
    // Remove token from localStorage
    localStorage.removeItem("token");
    // Clear authorization header
    delete axios.defaults.headers.common["Authorization"];
    // Clear user state
    setUser(null);
    // Show success notification
    toast.success("Logged out successfully");
  };

  // Function to update user data in the context
  const updateUser = (data: Partial<User>) => {
    if (user) {
      // Merge existing user data with new data
      const updatedUser = { ...user, ...data };
      
      // Ensure usage object exists with default values
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

      // Update user state with merged data
      setUser(updatedUser);
    }
  };

  // Create the context value object with all authentication functions and state
  const value: AuthContextType = {
    user,
    loading,
    login,
    register,
    logout,
    updateUser,
  };

  // Return the AuthContext.Provider with the value and children
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
