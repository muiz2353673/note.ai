// Import axios for making HTTP requests to the backend API
import axios from "axios";

// Define the base URL for API requests
// Uses environment variable if available, otherwise defaults to localhost development server
const API_BASE_URL =
  process.env.REACT_APP_API_URL || "http://localhost:5002/api";

// Create a configured axios instance with default settings
// This instance will be used for all API calls throughout the application
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Request interceptor to automatically add authentication token to all requests
// This runs before every request is sent
api.interceptors.request.use(
  (config) => {
   
    const token = localStorage.getItem("token");
    if (token) {
     
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
   
    return Promise.reject(error);
  }
);

// Response interceptor to handle common response scenarios
// This runs after every response is received
api.interceptors.response.use(
  (response) => response,
  (error) => {
   
    if (error.response?.status === 401) {
     
      localStorage.removeItem("token");
      localStorage.removeItem("user");
     
      window.location.href = "/login";
    }
   
    return Promise.reject(error);
  }
);

// Authentication API functions
// Collection of functions for user authentication and account management
export const authAPI = {
  register: (data: any) => api.post("/auth/register", data),
  login: (data: any) => api.post("/auth/login", data),
  refresh: () => api.post("/auth/refresh"),
  logout: () => api.post("/auth/logout"),
  verifyEmail: (data: any) => api.post("/auth/verify-email", data),
  resendVerification: () => api.post("/auth/resend-verification"),
  forgotPassword: (data: any) => api.post("/auth/forgot-password", data),
  resetPassword: (data: any) => api.post("/auth/reset-password", data),
  getMe: () => api.get("/auth/me"),
  updateProfile: (data: any) => api.put("/auth/profile", data),
  changePassword: (data: any) => api.put("/auth/change-password", data),
};

// Notes API functions
// Collection of functions for managing user notes
export const notesAPI = {
  getAll: () => api.get("/notes"),
  getById: (id: string) => api.get(`/notes/${id}`),
  create: (data: any) => api.post("/notes", data),
  update: (id: string, data: any) => api.put(`/notes/${id}`, data),
  delete: (id: string) => api.delete(`/notes/${id}`),
};

// AI API functions
// Collection of functions for AI-powered features
export const aiAPI = {
  summarize: (data: any) => api.post("/ai/summarize", data),
  generateFlashcards: (data: any) => api.post("/ai/flashcards", data),
  assignment: (data: any) => api.post("/ai/assignment", data),
  cite: (data: any) => api.post("/ai/cite", data),
  citeFromURL: (data: any) => api.post("/ai/cite-from-url", data),
};

// Subscriptions API functions
// Collection of functions for managing user subscriptions
export const subscriptionsAPI = {
  getStatus: () => api.get("/subscriptions/status"),
  create: (data: any) => api.post("/subscriptions/create", data),
  cancel: () => api.post("/subscriptions/cancel"),
};

// Universities API functions
// Collection of functions for university-related features
export const universitiesAPI = {
  contact: (data: any) => api.post("/universities/contact", data),
};

// Export the configured axios instance as default
// This can be used for custom API calls that don't fit the predefined patterns
export default api;
