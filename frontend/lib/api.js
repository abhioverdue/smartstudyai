import axios from 'axios';
import { getSession } from 'next-auth/react';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

// Create axios instance
const api = axios.create({
  baseURL: `${API_URL}/api/v1`,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token
api.interceptors.request.use(async (config) => {
  const session = await getSession();
  if (session?.accessToken) {
    config.headers.Authorization = `Bearer ${session.accessToken}`;
  }
  return config;
});

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Handle unauthorized access
      window.location.href = '/auth/login';
    }
    return Promise.reject(error);
  }
);

export default api;

// API functions
export const authAPI = {
  login: (credentials) => api.post('/auth/login', credentials),
  register: (userData) => api.post('/auth/register', userData),
};

export const quizAPI = {
  getQuizzes: (params) => api.get('/quiz/', { params }),
  getQuiz: (id) => api.get(`/quiz/${id}`),
  createQuiz: (data) => api.post('/quiz/', data),
  generateQuiz: (params) => api.post('/quiz/generate', params),
  submitQuiz: (id, answers) => api.post(`/quiz/${id}/submit`, answers),
};

export const progressAPI = {
  getDashboard: () => api.get('/progress/dashboard'),
  getProgress: (params) => api.get('/progress/', { params }),
  updateProgress: (id, data) => api.put(`/progress/${id}`, data),
};

export const tutorAPI = {
  chat: (message) => api.post('/tutor/chat', message),
  getSessions: () => api.get('/tutor/sessions'),
};