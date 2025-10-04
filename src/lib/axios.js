import axios from "axios";

export const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_MODE === "development" ? "http://localhost:5001" : "https://rtbackend-6z7a.onrender.com",
  withCredentials: true,
});

// Attach token from localStorage to every request if present
axiosInstance.interceptors.request.use(
  (config) => {
    try {
      const token = localStorage.getItem("token");
      if (token) {
        if (!config.headers) config.headers = {};
        config.headers.Authorization = `Bearer ${token}`;
      }
    } catch (e) {
      // ignore localStorage errors in environments where it's not available
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Optional: clear stored token on 401 to force re-login
axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error?.response?.status === 401) {
      try {
        localStorage.removeItem("token");
      } catch (e) {}
    }
    return Promise.reject(error);
  }
);
