"use client";
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
  useTransition,
} from "react";
import {
  storeUserData,
  logout as logoutFn,
  getFn,
  getUser,
  refetchUserData,
} from "@/lib/apiClient";
import {
  DataFromLogin,
  User,
  TypeCategories,
  TypeGames,
  TypeSingleTournament,
  TypePaymentMethods,
  // TypeWallet,
} from "../../types/global";
import { useParams, useSearchParams, usePathname } from "next/navigation";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

interface StoreActions {
  getTournament: () => void;
}
interface StoreData {
  categories: TypeCategories[] | undefined;
  games: TypeGames[] | undefined;
  singleTournament: TypeSingleTournament | undefined;
  paymentMethods: TypePaymentMethods[] | undefined;
  createMatch: {
    game_id: string;
    matchMode: number;
  };
  fullScreenLoader: {
    loader: boolean;
    message: string;
  };
  // wallet: TypeWallet | undefined;
  dispatch: StoreActions;
}

type StoreConfigKeys = keyof StoreData;

interface AuthContextType {
  isAuthenticated: boolean | undefined;
  user: User | null;
  login: (data: DataFromLogin) => Promise<User | undefined | null>;
  logout: () => Promise<void>;
  store: StoreData;
  setState: (value: StoreData[StoreConfigKeys], name: StoreConfigKeys) => void;
  refetchUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | undefined>(
    undefined
  );
  const [, startTransition] = useTransition();
  const searchParams = useSearchParams();
  const code = searchParams.get("code");
  const state = searchParams.get("state");
  const error = searchParams.get("error");
  const error_description = searchParams.get("error_description");
  const error_uri = searchParams.get("error_uri");
  const scope = searchParams.get("scope");
  const router = useRouter();
  const pathname = usePathname();
  const params = useParams();
  const slug = `${params?.slug}`;
  const isMounted = useRef<boolean>(false);
  const pathnameRef = useRef<string | null>(pathname);
  const [user, setUser] = useState<User | null>(null);
  const [store, setStore] = useState<StoreData>({
    // data
    categories: undefined,
    games: undefined,
    singleTournament: undefined,
    paymentMethods: undefined,
    createMatch: {
      game_id: "",
      matchMode: 0,
    },
    fullScreenLoader: {
      loader: false,
      message: "",
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
  const setState = useCallback(
    (value: StoreData[StoreConfigKeys], name: StoreConfigKeys) => {
      setStore((prev) => ({ ...prev, [name]: value }));
    },
    [setStore]
  );
  // refetch user Data and update store
  const refetchUser = useCallback(async () => {
    const data: User | undefined | null = await refetchUserData();
    if (data) {
      setUser(data);
    }
  }, [setUser]);

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
  const login = async (
    data: DataFromLogin
  ): Promise<User | undefined | null> => {
    const dataResponse: User | undefined | null = await storeUserData(data);
    if (dataResponse) {
      setUser(dataResponse);
      setIsAuthenticated(true);
    }
    // null for not verified emails
    return dataResponse;
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
      if (!user || setState === undefined) return;

      const dataHandlers: { storeKey: StoreConfigKeys; path: string }[] = [
        // { storeKey: "wallet", path: "api/wallets" },
        { storeKey: "paymentMethods", path: "api/payment-methods" },
      ];
      if (!dataHandlers.length) return;

      try {
        const results = await Promise.all(
          dataHandlers.map(async ({ storeKey, path }) => {
            const data = await getFn(path);
            return {
              storeKey,
              data: data?.records ? data.records : data?.data,
            };
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
  }, [user, setState]);
  // Fetch global data (categories, games, etc.)
  useEffect(() => {
    if (setState === undefined) return;
    const fetchGlobalData = async () => {
      const dataHandlers: { storeKey: StoreConfigKeys; path: string }[] = [
        { storeKey: "categories", path: "api/gamecategories" },
        { storeKey: "games", path: "api/games" },
      ];
      if (!dataHandlers.length) return;
      try {
        const results = await Promise.all(
          dataHandlers.map(async ({ storeKey, path }) => {
            const data = await getFn(path);
            return {
              storeKey,
              data: data?.records ? data.records : data?.data,
            };
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
  }, [setState]);

  useEffect(() => {
    if (isMounted.current || setState === undefined || router === undefined)
      return;
    isMounted.current = true;
    const excludeRoutes = ["/join-tournament", "/verify-transaction"];
    if (excludeRoutes.includes(pathnameRef.current || "")) return;
    let timer = 1000;
    let message = "";
    const hasValidGooleCred =
      code && state && !error && !error_description && !error_uri && scope;
    if (hasValidGooleCred) {
      console.log({ code, state, scope });
      timer = 3000;
      message = "Verifying Google Account...";
    } else if (error) {
      toast.error("Error Verifying Google Account");
    }
    startTransition(() => {
      setState(
        {
          loader: true,
          message: message,
        },
        "fullScreenLoader"
      );
      setTimeout(() => {
        setState({ loader: false, message: "" }, "fullScreenLoader");
        if (hasValidGooleCred) {
          router.push("/");
        }
      }, timer);
    });
    return () => {
      isMounted.current = false;
    };
  }, [
    code,
    state,
    error,
    error_description,
    error_uri,
    scope,
    setState,
    router,
  ]);

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated,
        user,
        login,
        logout,
        store,
        setState,
        refetchUser,
      }}
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
