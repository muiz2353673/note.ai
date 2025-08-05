// Import axios for making HTTP requests to the backend API
import axios from "axios";

// Define the base URL for API requests
// Uses environment variable if available, otherwise defaults to localhost development server
const API_BASE_URL =
  process.env.REACT_APP_API_URL || "http://localhost:5002/api";

// Create a configured axios instance with default settings
// This instance will be used for all API calls throughout the application
const api = axios.create({
  baseURL: API_BASE_URL, // Set the base URL for all requests
  headers: {
    "Content-Type": "application/json", // Set default content type for all requests
  },
});

// Request interceptor to automatically add authentication token to all requests
// This runs before every request is sent
api.interceptors.request.use(
  (config) => {
    // Get the authentication token from localStorage
    const token = localStorage.getItem("token");
    if (token) {
      // Add the token to the Authorization header if it exists
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config; // Return the modified config
  },
  (error) => {
    // If there's an error in the request interceptor, reject the promise
    return Promise.reject(error);
  }
);

// Response interceptor to handle common response scenarios
// This runs after every response is received
api.interceptors.response.use(
  (response) => response, // If response is successful, return it as-is
  (error) => {
    // Check if the error is due to unauthorized access (401 status)
    if (error.response?.status === 401) {
      // Token expired or invalid - clear stored authentication data
      localStorage.removeItem("token"); // Remove stored token
      localStorage.removeItem("user"); // Remove stored user data
      // Redirect user to login page
      window.location.href = "/login";
    }
    // Return the error for the calling code to handle
    return Promise.reject(error);
  }
);

// Authentication API functions
// Collection of functions for user authentication and account management
export const authAPI = {
  register: (data: any) => api.post("/auth/register", data), // Register new user account
  login: (data: any) => api.post("/auth/login", data), // Login with email and password
  refresh: () => api.post("/auth/refresh"), // Refresh authentication token
  logout: () => api.post("/auth/logout"), // Logout user and invalidate token
  verifyEmail: (data: any) => api.post("/auth/verify-email", data), // Verify email address with token
  resendVerification: () => api.post("/auth/resend-verification"), // Resend email verification
  forgotPassword: (data: any) => api.post("/auth/forgot-password", data), // Request password reset
  resetPassword: (data: any) => api.post("/auth/reset-password", data), // Reset password with token
  getMe: () => api.get("/auth/me"), // Get current user profile information
  updateProfile: (data: any) => api.put("/auth/profile", data), // Update user profile
  changePassword: (data: any) => api.put("/auth/change-password", data), // Change user password
};

// Notes API functions
// Collection of functions for managing user notes
export const notesAPI = {
  getAll: () => api.get("/notes"), // Get all notes for the current user
  getById: (id: string) => api.get(`/notes/${id}`), // Get a specific note by ID
  create: (data: any) => api.post("/notes", data), // Create a new note
  update: (id: string, data: any) => api.put(`/notes/${id}`, data), // Update an existing note
  delete: (id: string) => api.delete(`/notes/${id}`), // Delete a note by ID
};

// AI API functions
// Collection of functions for AI-powered features
export const aiAPI = {
  summarize: (data: any) => api.post("/ai/summarize", data), // Generate AI summary of text
  generateFlashcards: (data: any) => api.post("/ai/flashcards", data), // Generate flashcards from content
  assignment: (data: any) => api.post("/ai/assignment", data), // Get AI help with assignments
  cite: (data: any) => api.post("/ai/cite", data), // Generate citations for content
  citeFromURL: (data: any) => api.post("/ai/cite-from-url", data), // Generate citations from URL
};

// Subscriptions API functions
// Collection of functions for managing user subscriptions
export const subscriptionsAPI = {
  getStatus: () => api.get("/subscriptions/status"), // Get current subscription status
  create: (data: any) => api.post("/subscriptions/create", data), // Create new subscription
  cancel: () => api.post("/subscriptions/cancel"), // Cancel current subscription
};

// Universities API functions
// Collection of functions for university-related features
export const universitiesAPI = {
  contact: (data: any) => api.post("/universities/contact", data), // Contact university for partnership
};

// Export the configured axios instance as default
// This can be used for custom API calls that don't fit the predefined patterns
export default api;
