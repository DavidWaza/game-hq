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

// Response Interceptor: Handle Token Expiration
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401) {
      await logout();
      window.location.href = "/auth/login";
    }
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
    if (token) {
      await storeToken(token);
    }
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
export const storeToken = async (token: string) => {
  try {
    // Store in localStorage
    localStorage.setItem("token", token);

    // Store in HTTP-only cookie
    const response = await fetch("/api/auth/set-token", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ token }),
    });

    if (!response.ok) {
      throw new Error("Failed to set token cookie");
    }
  } catch (error) {
    console.error("Failed to store token:", error);
    // Clean up localStorage if cookie storage fails
    localStorage.removeItem("token");
    throw error;
  }
};

// Function to Remove Token on Logout
export const logout = async () => {
  try {
    // Remove from localStorage
    localStorage.removeItem("token");

    // Remove HTTP-only cookie
    const response = await fetch("/api/auth/remove-token", {
      method: "POST",
    });

    if (!response.ok) {
      throw new Error("Failed to remove token cookie");
    }

    // Redirect to login page
    window.location.href = "/auth/login";
  } catch (error) {
    console.error("Failed to logout:", error);
    throw error;
  }
};
