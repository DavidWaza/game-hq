"use client";
import { createContext, useContext, useEffect, useState } from "react";
import {
  storeUserData,
  logout as logoutFn,
  getFn,
  getUser,
} from "@/lib/apiClient";
import {
  DataFromLogin,
  User,
  TypeCategories,
  TypeGames,
  TypeSingleTournament,
} from "../../types/global";

interface StoreData {
  categories: TypeCategories[] | undefined;
  games: TypeGames[] | undefined;
  singleTournament: TypeSingleTournament | undefined;
}

type StoreConfigKeys = keyof StoreData;

interface AuthContextType {
  isAuthenticated: boolean | undefined;
  user: User | null;
  login: (data: DataFromLogin) => Promise<void>;
  logout: () => Promise<void>;
  store: StoreData;
  setState: (value: StoreData[StoreConfigKeys], name: StoreConfigKeys) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | undefined>(
    undefined
  );
  const [user, setUser] = useState<User | null>(null);
  const [store, setStore] = useState<StoreData>({
    categories: undefined,
    games: undefined,
    singleTournament: undefined,
  });

  // Update store state
  const setState = (
    value: StoreData[StoreConfigKeys],
    name: StoreConfigKeys
  ) => {
    setStore((prev) => ({ ...prev, [name]: value }));
  };

  // Fetch user data on mount
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const dataResponse = await getUser();
        if (dataResponse?.user) {
          setUser(dataResponse.user);
          setIsAuthenticated(true);
        } else {
          setIsAuthenticated(false);
        }
      } catch {
        setIsAuthenticated(false);
      }
    };
    fetchUser();
  }, []);

  // Login function
  const login = async (data: DataFromLogin) => {
    await storeUserData(data);
    setUser(data.user);
    setIsAuthenticated(true);
  };

  // Logout function
  const logout = async () => {
    await logoutFn();
    setUser(null);
    setIsAuthenticated(false);
  };

  // Fetch global data (categories, games, etc.)
  useEffect(() => {
    const fetchGlobalData = async () => {
      if (!user) return;

      const dataHandlers: { storeKey: StoreConfigKeys; path: string }[] = [
        { storeKey: "categories", path: "api/gamecategories" },
        { storeKey: "games", path: "api/games" },
      ];

      try {
        const results = await Promise.all(
          dataHandlers.map(async ({ storeKey, path }) => {
            const data = await getFn(path);
            return { storeKey, data: data?.records };
          })
        );

        results.forEach(({ storeKey, data }) => {
          setState(data, storeKey);
        });
      } catch (error) {
        console.error("Error fetching global data:", error);
      }
    };

    fetchGlobalData();
  }, [user]);

  return (
    <AuthContext.Provider
      value={{ isAuthenticated, user, login, logout, store, setState }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
