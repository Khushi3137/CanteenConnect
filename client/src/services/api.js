import axios from 'axios';

const api = axios.create({
  baseURL: '/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Attach JWT token to all requests if present in localStorage
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('canteen_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor for unified error messages
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      // If token is expired/invalid, clear it if on a protected route
      const currentPath = window.location.pathname;
      if (currentPath !== '/login' && currentPath !== '/register') {
        // We can let AuthContext handle redirect or state clean
      }
    }
    return Promise.reject(error);
  }
);

export default api;
