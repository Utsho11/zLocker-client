import axios from "axios";

import { useAuthStore } from "@/store/authStore";

const instance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  withCredentials: true, // send cookies if needed (optional)
});

// Request interceptor: attach token to headers
instance.interceptors.request.use(
  (config) => {
    const token = useAuthStore.getState().token;

    if (token && config.headers) {
      config.headers.Authorization = `${token}`;
    }

    return config;
  },
  (error) => Promise.reject(error),
);

// Response interceptor: optional global error handling
instance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      useAuthStore.getState().logout(); // auto logout on token expiration
    }

    return Promise.reject(error);
  },
);

export default instance;
