import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:5000/api',
  withCredentials: true, 
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
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
    const isLoginRequest = error.config.url.includes('/auth/login');

    // 🕵️‍♂️ LOUD LOGGING
    if (error.response && error.response.status === 401) {
      console.error("🚨 401 UNAUTHORIZED DETECTED!");
      console.error("🔗 Failed URL:", error.config.url);
      console.error("🛡️ Role in Storage:", localStorage.getItem('role'));
      
      if (!isLoginRequest) {
        console.warn("🧹 401 Interceptor: Wiping data and bouncing to login...");
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        localStorage.removeItem('role');
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

export default api;