import axios from 'axios';

// Determine API base URL
// In production on Vercel: uses VITE_API_URL or VITE_BACKEND_URL (ensures /api suffix)
// In local dev with Vite proxy: defaults to '/api'
const getBaseURL = () => {
  const envUrl = import.meta.env.VITE_API_URL || import.meta.env.VITE_BACKEND_URL;
  if (envUrl && typeof envUrl === 'string' && envUrl.trim() !== '') {
    const cleanUrl = envUrl.trim().replace(/\/+$/, '');
    return cleanUrl.endsWith('/api') ? cleanUrl : `${cleanUrl}/api`;
  }
  return '/api';
};

const API = axios.create({
  baseURL: getBaseURL(),
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
});

API.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('localmate_token') || localStorage.getItem('skillconnect_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

let isHandling401 = false;
API.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      localStorage.removeItem('localmate_token');
      localStorage.removeItem('localmate_user');
      localStorage.removeItem('skillconnect_token');
      localStorage.removeItem('skillconnect_user');

      if (!isHandling401 && typeof window !== 'undefined') {
        isHandling401 = true;
        window.dispatchEvent(new CustomEvent('auth:unauthorized'));
        setTimeout(() => {
          isHandling401 = false;
        }, 1500);
      }
    }
    return Promise.reject(error);
  }
);

export default API;
