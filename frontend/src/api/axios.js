import axios from 'axios';

/**
 * Use relative URLs — Vite proxy forwards all requests to the backend.
 * This means the port never matters in the frontend code.
 *
 * /auth/login  →  Vite proxy  →  http://localhost:8082/auth/login
 *
 * In production, set VITE_API_URL to your deployed backend URL.
 */
const API_BASE_URL = import.meta.env.VITE_API_URL
  ? import.meta.env.VITE_API_URL   // production: absolute URL
  : '';                              // development: relative (uses Vite proxy)

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: { 'Content-Type': 'application/json' },
  timeout: 30000,
});

// Attach JWT token to every request
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) config.headers.Authorization = `Bearer ${token}`;
    return config;
  },
  (error) => Promise.reject(error)
);

// Handle 401 — refresh token or redirect to login
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const original = error.config;

    if (!error.response) {
      console.error('[JobPortal] Cannot reach backend. Is Spring Boot running?');
      return Promise.reject(error);
    }

    if (error.response.status === 401 && !original._retry) {
      original._retry = true;
      const refreshToken = localStorage.getItem('refreshToken');
      if (refreshToken) {
        try {
          const res = await axios.post(
            `${API_BASE_URL}/auth/refresh-token?refreshToken=${refreshToken}`
          );
          const { token } = res.data.data;
          localStorage.setItem('token', token);
          original.headers.Authorization = `Bearer ${token}`;
          return api(original);
        } catch {
          localStorage.clear();
          window.location.href = '/login';
        }
      } else {
        localStorage.clear();
        window.location.href = '/login';
      }
    }

    return Promise.reject(error);
  }
);

export default api;
