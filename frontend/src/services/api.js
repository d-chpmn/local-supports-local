import axios from 'axios';

// Use environment variable, fallback to localhost for development
const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

console.log('🔧 API Configuration:', {
  API_URL,
  env: process.env.REACT_APP_API_URL,
  nodeEnv: process.env.NODE_ENV
});

// Create axios instance
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('access_token');
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
      // Token expired or invalid - don't auto-redirect, let components handle it
      console.log('401 Unauthorized:', error.config?.url);
    }
    return Promise.reject(error);
  }
);

// Auth API
export const authAPI = {
  register: (data) => api.post('/api/auth/register', data),
  login: (data) => api.post('/api/auth/login', data),
  logout: () => api.post('/api/auth/logout'),
  verify: () => api.get('/api/auth/verify'),
  refresh: () => {
    const refreshToken = localStorage.getItem('refresh_token');
    return api.post('/api/auth/refresh', {}, {
      headers: { Authorization: `Bearer ${refreshToken}` }
    });
  },
};

// Realtor API
export const realtorAPI = {
  getProfile: () => api.get('/api/realtors/profile'),
  updateProfile: (data) => api.put('/api/realtors/profile', data),
  uploadHeadshot: (file) => {
    const formData = new FormData();
    formData.append('file', file);
    return api.post('/api/realtors/upload-headshot', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
  },
  getStats: () => api.get('/api/realtors/stats'),
};

// Transaction API
export const transactionAPI = {
  submit: (data) => api.post('/api/transactions/submit', data),
  getHistory: () => api.get('/api/transactions/history'),
  getCurrentMonth: () => api.get('/api/transactions/current-month'),
  getPending: () => api.get('/api/transactions/pending'),
};

// Donation API
export const donationAPI = {
  submitPayment: (data) => api.post('/api/donations/payment', data),
  getStats: () => api.get('/api/donations/stats'),
  getHistory: () => api.get('/api/donations/history'),
  getPending: () => api.get('/api/donations/pending'),
  getShareImage: (donationId) => api.get(`/api/donations/share-image/${donationId}`),
};

// Notification API
export const notificationAPI = {
  getAll: (params) => api.get('/api/notifications', { params }),
  markAsRead: (id) => api.post(`/api/notifications/${id}/read`),
  getUnreadCount: () => api.get('/api/notifications/unread-count'),
  markAllRead: () => api.post('/api/notifications/mark-all-read'),
};

export default api;


