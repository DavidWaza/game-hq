"use client";
import axios from "axios";
import { toast } from "sonner";
import { DataFromLogin, User } from "../../types/global";

const BASE_URL = process.env.NEXT_PUBLIC_API_SERVICE_BASE_URL;

// Create Axios Instance
const api = axios.create({
  baseURL: BASE_URL,
});

// Request Interceptor: Attach Token
api.interceptors.request.use(
  async (config) => {
    if (typeof window !== "undefined") {
      const token = sessionStorage.getItem("token");
      // const { token } = await getUser();
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
      window.location.href = "/";
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
export const storeUserData = async (data: DataFromLogin) => {
  try {
    // Store in HTTP-only cookie (optional, requires backend endpoint)
    sessionStorage.setItem("token", data.token);
    const user: User = await getFn(`api/users/view/${data.user.id}`);
    const response = await fetch("/api/auth/set-user", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ ...data, user }),
      // body: JSON.stringify({ token: data.token }),
    });

    if (!response.ok) {
      throw new Error("Failed to set token cookie");
    }
    getUser();
    return user
  } catch (error) {
    console.error("Failed to store token:", error);
  }
};

export const getUser = async () => {
  try {
    // Store in HTTP-only cookie (optional, requires backend endpoint)
    const response = await fetch("/api/auth/get-user", {
      method: "GET",
    });

    if (!response.ok) {
      throw new Error("Failed to get user");
    }
    const data = await response.json();
    const returnObj = {
      ...data,
      user: JSON.parse(data.user),
    };
    return returnObj;
  } catch (error) {
    toast.error(processErrorResponse(error), {
      position: "top-right",
      className: "p-4",
    });
  }
};

// Function to Remove Token on Logout
export const logout = async () => {
  try {
    // Remove HTTP-only cookie (optional, requires backend endpoint)
    const response = await fetch("/api/auth/remove-user", {
      method: "POST",
    });

    if (!response.ok) {
      throw new Error("Failed to remove token cookie");
    } else {
      sessionStorage.clear();
      localStorage.clear();
      window.location.href = "/";
    }
  } catch (error) {
    toast.error(processErrorResponse(error), {
      position: "top-right",
      className: "p-4",
    });
  }
};
