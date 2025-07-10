// lib/axios.js
import axios from 'axios';

// Create an Axios instance
const instance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL, // Set your API base URL in .env
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
  timeout: 10000, // 10 seconds timeout
});

// Request Interceptor (Attach token if exists)
instance.interceptors.request.use(
  (config) => {
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('token');
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response Interceptor (Handle common errors globally)
instance.interceptors.response.use(
  (response) => response,
  (error) => {
    // Optional: show user-friendly messages or redirect
    if (error.response) {
      const { status } = error.response;

      if (status === 401) {
        console.warn('Unauthorized: Redirecting to login');
        // You can trigger logout or redirect here
      } else if (status === 500) {
        console.error('Server Error');
      }
    } else {
      console.error('Network error or server not responding');
    }

    return Promise.reject(error);
  }
);

export default instance;
