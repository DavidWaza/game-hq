"use client";
import { createContext, useContext, useEffect, useState } from "react";
import { storeUserData, logout as logoutFn } from "@/lib/apiClient";
import { useRouter } from "next/navigation";
import { DataFromLogin, User, TypeCategories } from "../../types/global";
import { getFn } from "@/lib/apiClient";
interface StoreData {
  categories: TypeCategories[] | [];
}
type StoreConFigKeys = keyof StoreData;
interface AuthContextType {
  isAuthenticated: boolean | undefined;
  user: User | null;
  login: (data: DataFromLogin) => Promise<void>;
  logout: () => Promise<void>;
  store: StoreData;
}
interface DataHandler {
  storeValue: StoreConFigKeys;
  data: null | any;
  path: string;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | undefined>(
    undefined
  );
  const [user, setUser] = useState<User | null>(null);
  const [store, setStore] = useState<StoreData>({
    categories: [],
  });
  const setState = (value: any, name: StoreConFigKeys) => {
    console.log(value, name);
    setStore((prev) => ({
      ...prev,
      [name]: value,
    }));
  };
  const router = useRouter();

  // set user and token from sesion storage
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

  // handle global use requests
  useEffect(() => {
    const fetchData = async () => {
      if (user !== null) {
        // set the array
        const useGetRequestDataHandler: DataHandler[] = [
          { storeValue: "categories", data: null, path: "api/gamecategories" },
        ];

        try {
          // Map over the array and call getFn for each path
          const results = await Promise.all(
            useGetRequestDataHandler.map(async (handler: DataHandler) => {
              const data = await getFn(handler.path);
              return { ...handler, data }; // Attach the fetched data to the handler
            })
          );

          // Process the results as needed
          results.forEach((result) => {
            setState(result.data?.records, result.storeValue);
          });
        } catch (error) {
          console.error("Error fetching data:", error);
        }
      }
    };

    fetchData();
  }, [user]);

  return (
    <AuthContext.Provider
      value={{ isAuthenticated, user, login, logout, store }}
    >
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
