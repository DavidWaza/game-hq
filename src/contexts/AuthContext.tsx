"use client";
import { createContext, useContext, useEffect, useState } from "react";
import { storeUserData, logout as logoutFn } from "@/lib/apiClient";
import { DataFromLogin, User, TypeCategories } from "../../types/global";
import { getFn, getUser } from "@/lib/apiClient";
interface StoreData {
  categories: TypeCategories[] | [] | undefined;
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
  data: TypeCategories[] | undefined;
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
  const setState = (
    value: TypeCategories[] | undefined,
    name: StoreConFigKeys
  ) => {
    console.log(value, name);
    setStore((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // set user and token from sesion storage
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const dataResponse = await getUser();
        if (dataResponse?.user) {
          console.log({ user: dataResponse?.user });
          setUser(dataResponse.user);
          setIsAuthenticated(true);
        } else {
          setIsAuthenticated(false);
        }
      } catch {}
    };
    fetchUser();
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
          {
            storeValue: "categories",
            data: undefined,
            path: "api/gamecategories",
          },
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
