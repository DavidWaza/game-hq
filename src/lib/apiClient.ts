"use client";
import axios from "axios";
import { toast } from "sonner";

const BASE_URL = process.env.NEXT_PUBLIC_API_SERVICE_BASE_URL 

// Create Axios Instance
const api = axios.create({
  baseURL: BASE_URL,
});

// Request Interceptor: Attach Token
api.interceptors.request.use(
  (config) => {
    if (typeof window !== "undefined") {
      const token = sessionStorage.getItem("token");
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    return config;
  },
  (error) => Promise.reject(error)
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
  } catch (error) {
    toast.error(processErrorResponse(error), {
      position: "top-right",
      className: "p-4",
    });
    throw error;
  }
};

// Post Function
export const postFn = async <T>(url: string, data: T) => {
  try {
    const response = await api.post(url, data);
    return response.data;
  } catch (error) {
    toast.error(processErrorResponse(error), {
      position: "top-right",
      className: "p-4",
    });
    throw error;
  }
};

// Error Processing Function
interface ApiError {
  response?: {
    data?: {
      message?: string;
      title?: string;
      [key: string]: string | undefined;
    };
    status?: number;
  };
  message?: string;
}

const processErrorResponse = (error: unknown): string => {
  const apiError = error as ApiError;
  let message = "An error occurred";
  
  if (apiError.response?.data?.message) {
    message = apiError.response.data.message;
  } else if (apiError.response?.data?.title) {
    message = apiError.response.data.title;
  } else if (apiError.response?.data) {
    message = JSON.stringify(apiError.response.data);
  } else if (apiError.message) {
    message = apiError.message;
  }
  
  if (apiError.response?.status === 401) {
    message = "Unauthenticated! Please log in again.";
  }
  
  return message;
};

// Function to Store Token After Login
export const storeToken = async (token: string) => {
  try {
    // Store in sessionStorage
    sessionStorage.setItem("token", token);

    // Store in HTTP-only cookie (optional, requires backend endpoint)
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
    sessionStorage.removeItem("token");
    throw error;
  }
};

// Function to Remove Token on Logout
export const logout = async () => {
  try {
    // Remove from sessionStorage
    sessionStorage.removeItem("token");

    // Remove HTTP-only cookie (optional, requires backend endpoint)
    const response = await fetch("/api/auth/remove-token", {
      method: "POST",
    });

    if (!response.ok) {
      throw new Error("Failed to remove token cookie");
    }
  } catch (error) {
    console.error("Failed to logout:", error);
    toast.error(processErrorResponse(error), {
      position: "top-right",
      className: "p-4",
    });
  }
};