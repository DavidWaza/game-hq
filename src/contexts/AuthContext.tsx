"use client";
import { createContext, useContext, useEffect, useState } from "react";
import { storeUserData, logout as logoutFn } from "@/lib/apiClient";
import { useRouter } from "next/navigation";
import { DataFromLogin, User } from "../../types/global";

interface AuthContextType {
  isAuthenticated: boolean | undefined;
  user: User | null;
  login: (data: DataFromLogin) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | undefined>(
    undefined
  );
  const [user, setUser] = useState<User | null>(null);
  const router = useRouter();

  useEffect(() => {
    // Check if user is authenticated on mount
    const token = sessionStorage.getItem("token");

    const sessionUser = sessionStorage.getItem("user");
    if (sessionUser) {
      setUser(JSON.parse(sessionUser));
      // You can also fetch user details here if needed
    }
    if (token) {
      return setIsAuthenticated(true);
      // You can also fetch user details here if needed
    }
    setIsAuthenticated(false);
  }, []);

  const login = async (data: DataFromLogin) => {
    await storeUserData(data);
    setIsAuthenticated(true);
    setUser(data.user);
  };

  const logout = async () => {
    await logoutFn();
    setIsAuthenticated(false);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
