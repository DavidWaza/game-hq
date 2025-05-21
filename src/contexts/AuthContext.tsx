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
  // TypeWallet,
} from "../../types/global";
import { useParams } from "next/navigation";

interface StoreActions {
  getTournament: () => void;
}
interface StoreData {
  categories: TypeCategories[] | undefined;
  games: TypeGames[] | undefined;
  singleTournament: TypeSingleTournament | undefined;
  createMatch: {
    game_id: string;
    matchMode: number;
  };
  // wallet: TypeWallet | undefined;
  dispatch: StoreActions;
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
  const params = useParams();
  const slug = `${params?.slug}`;
  const [user, setUser] = useState<User | null>(null);
  const [store, setStore] = useState<StoreData>({
    // data
    categories: undefined,
    games: undefined,
    singleTournament: undefined,
    createMatch: {
      game_id: "",
      matchMode: 0,
    },
    // wallet: undefined,
    // actions
    dispatch: {
      getTournament: async (dataSlug: string = slug) => {
        try {
          const response: TypeSingleTournament = await getFn(
            `/api/tournamentstables/view/${dataSlug}`
          );
          if (response?.id) {
            setState(response, "singleTournament");
          }
        } catch {}
      },
    },
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
    const dataResponse: User | undefined = await storeUserData(data);
    if (dataResponse) {
      setUser(dataResponse);
      setIsAuthenticated(true);
    }
  };

  // Logout function
  const logout = async () => {
    await logoutFn();
    setUser(null);
    setIsAuthenticated(false);
  };

  // Fetch global data (categories, games, etc.) after user login
  useEffect(() => {
    const fetchGlobalData = async () => {
      if (!user) return;

      const dataHandlers: { storeKey: StoreConfigKeys; path: string }[] = [
        { storeKey: "categories", path: "api/gamecategories" },
        { storeKey: "games", path: "api/games" },
        // { storeKey: "wallet", path: "api/wallets" },
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
  // Fetch global data (categories, games, etc.)
  // useEffect(() => {
  //   const fetchGlobalData = async () => {
  //     const dataHandlers: { storeKey: StoreConfigKeys; path: string }[] = [
  //       { storeKey: "games", path: "api/games" },
  //     ];

  //     try {
  //       const results = await Promise.all(
  //         dataHandlers.map(async ({ storeKey, path }) => {
  //           const data = await getFn(path);
  //           return { storeKey, data: data?.records };
  //         })
  //       );

  //       results.forEach(({ storeKey, data }) => {
  //         setState(data, storeKey);
  //       });
  //     } catch (error) {
  //       console.error("Error fetching global data:", error);
  //     }
  //   };

  //   fetchGlobalData();
  // }, []);

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
