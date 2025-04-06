
import axios from 'axios';
import { toast } from 'sonner';

// Create axios instance with base URL
const api = axios.create({
  baseURL: 'http://localhost:5000', // Change this to your backend URL in production
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    const { status, data } = error.response || {};
    
    if (status === 401) {
      localStorage.removeItem('token');
      window.location.href = '/login';
      toast.error('Session expired. Please login again.');
    }
    
    // Handle other errors
    const errorMessage = data?.message || 'Something went wrong';
    toast.error(errorMessage);
    
    return Promise.reject(error);
  }
);

export default api;
