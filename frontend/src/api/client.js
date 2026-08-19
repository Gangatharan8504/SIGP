import axios from 'axios';

let rawBaseUrl = import.meta.env.VITE_API_URL;
let baseURL = '/api';

// Check if running on localhost in browser
const isLocalhost =
  typeof window !== 'undefined' &&
  (window.location.hostname === 'localhost' ||
    window.location.hostname === '127.0.0.1' ||
    window.location.hostname === '0.0.0.0');

if (rawBaseUrl) {
  rawBaseUrl = rawBaseUrl.trim().replace(/\/+$/, '');
  // If running in live production (e.g. on Vercel), ignore localhost VITE_API_URL so requests stay on same origin /api
  if (!isLocalhost && (rawBaseUrl.includes('localhost') || rawBaseUrl.includes('127.0.0.1'))) {
    baseURL = '/api';
  } else if (rawBaseUrl.endsWith('/api')) {
    baseURL = rawBaseUrl;
  } else {
    baseURL = `${rawBaseUrl}/api`;
  }
} else {
  baseURL = '/api';
}

const api = axios.create({
  baseURL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 30000,
});

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('sgip_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

api.interceptors.response.use(
  (response) => response,
  (error) => {
    return Promise.reject(error);
  }
);

export default api;
