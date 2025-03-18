"use client";
import axios from "axios";
const BASE_URL = process.env.NEXT_PUBLIC_API_SERVICE_BASE_URL;

// Create Axios Instance
const api = axios.create({
  baseURL: BASE_URL,
});

// Request Interceptor: Attach Token
api.interceptors.request.use(
  (config) => {
    if (typeof window !== "undefined") {
      const token = localStorage.getItem("token");
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Get Function
export const getFn = async (url: string) => {
  try {
    const response = await api.get(url);
    return response.data;
  } catch (err) {
    console.error("GET Error:", err);
    if (axios.isAxiosError(err)) {
      throw new Error(err.message || "Invalid Credentials");
    }
    throw new Error("An unexpected error occurred");
  }
};

// Post Function
export const postFn = async (url: string, data: Record<string, unknown>) => {
  try {
    const response = await api.post(url, data);
    const token = response.data.token;
    storeToken(token);
    return response.data;
  } catch (err) {
    console.error("POST Error:", err);
    if (axios.isAxiosError(err)) {
      throw new Error(err.message || "Invalid Credentials");
    }

    throw new Error("An unexpected error occurred");
  }
};

// Function to Store Token After Login
export const storeToken = (token: string) => {
  localStorage.setItem("token", token);
};

// Function to Remove Token on Logout
export const logout = () => {
  localStorage.removeItem("token");
};
