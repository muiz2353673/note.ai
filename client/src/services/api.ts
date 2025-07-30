import axios from "axios";

const API_BASE_URL =
  process.env.REACT_APP_API_URL || "http://localhost:5002/api";

// Create axios instance
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Request interceptor to add auth token
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

// Response interceptor to handle errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Token expired or invalid
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);

// Auth API
export const authAPI = {
  register: (data: any) => api.post("/auth/register", data),
  login: (data: any) => api.post("/auth/login", data),
  refresh: () => api.post("/auth/refresh"),
  logout: () => api.post("/auth/logout"),
};

// Notes API
export const notesAPI = {
  getAll: () => api.get("/notes"),
  getById: (id: string) => api.get(`/notes/${id}`),
  create: (data: any) => api.post("/notes", data),
  update: (id: string, data: any) => api.put(`/notes/${id}`, data),
  delete: (id: string) => api.delete(`/notes/${id}`),
};

// AI API
export const aiAPI = {
  summarize: (data: any) => api.post("/ai/summarize", data),
  generateFlashcards: (data: any) => api.post("/ai/flashcards", data),
  assignment: (data: any) => api.post("/ai/assignment", data),
  cite: (data: any) => api.post("/ai/cite", data),
  citeFromURL: (data: any) => api.post("/ai/cite-from-url", data),
};

// Subscriptions API
export const subscriptionsAPI = {
  getStatus: () => api.get("/subscriptions/status"),
  create: (data: any) => api.post("/subscriptions/create", data),
  cancel: () => api.post("/subscriptions/cancel"),
};

// Universities API
export const universitiesAPI = {
  contact: (data: any) => api.post("/universities/contact", data),
};

export default api;
