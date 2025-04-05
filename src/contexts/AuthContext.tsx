"use client";
import { createContext, useContext, useEffect, useState } from "react";
import { storeToken, logout as logoutFn } from "@/lib/apiClient";
import { useRouter } from "next/navigation";
interface User {
  id: string;
  email: string;
  name: string;
}

interface AuthContextType {
  isAuthenticated: boolean | undefined;
  user: User | null;
  login: (token: string) => Promise<void>;
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
    if (token) {
      return setIsAuthenticated(true);
      // You can also fetch user details here if needed
    }
    setIsAuthenticated(false);
  }, []);

  const login = async (token: string) => {
    await storeToken(token);
    setIsAuthenticated(true);
    router.push("/dashboard");
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
