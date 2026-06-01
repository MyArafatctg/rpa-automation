import { createContext, useEffect, useState, type ReactNode } from "react";
import { tokenService } from "../auth/tokenService";

//primary server
const BACKEND_URL = "http://192.168.4.50:8067/v1/api";
const BASE_URL = "http://192.168.4.50:8000";

// secondary server
// const BACKEND_URL = "http://192.168.4.50:8067/v1/api";
// const BACKEND_URL = "http://192.168.4.231:8067/v1/api";

// local testing server
// const BACKEND_URL = "http://localhost:8067/v1/api";
// const BASE_URL = "http://192.168.4.50:8000";

// const BASE_URL = "http://192.168.6.109:8000"; // Local testing server for BOT

// Auth server URLs
const AUTH_URL = "https://api-andron.ahlapps.com/api/v1";
// const AUTH_URL = "http://192.168.7.65:3051/api/v1"; // Local auth server for testing

const APP_ID = 14961;
const USER_CREDENTIALS = {
  username: "EXP-102491",
  password: "Apx$AS190000",
};

// Define the shape of your context value
interface AppContextType {
  token: string;
  setToken: (token: string) => void;
  refreshToken: string;
  setRefreshToken: (refreshToken: string) => void;
  clientId: string;
  setClientId: (clientId: string) => void;
  BASE_URL: string;
  AUTH_URL: string;
  BACKEND_URL: string;
  USER_CREDENTIALS: { username: string; password: string };
  APP_ID: number;
  authLoading: boolean;
}

// ✅ Create the context (no namespace issue)
export const AppContext = createContext<AppContextType>({
  clientId: "",
  setClientId: (_: string) => {},
  token: "",
  setToken: (_: string) => {},
  refreshToken: "",
  setRefreshToken: (_: string) => {},
  BASE_URL: BASE_URL,
  AUTH_URL: AUTH_URL,
  BACKEND_URL: BACKEND_URL,
  USER_CREDENTIALS: USER_CREDENTIALS,
  APP_ID: APP_ID,
  authLoading: true,
});

// Props for the Provider
interface AppContextProviderProps {
  children: ReactNode;
}

export const AppContextProvider = ({ children }: AppContextProviderProps) => {
  const [token, setToken] = useState("");
  const [refreshToken, setRefreshToken] = useState("");
  const [clientId, setClientId] = useState("");
  const [authLoading, setAuthLoading] = useState(true);

  useEffect(() => {
    const storedToken = localStorage.getItem("token");
    const storedRefreshToken = localStorage.getItem("refreshToken");
    const storedClientId = localStorage.getItem("clientId");

    setToken(storedToken ? storedToken : "");
    setRefreshToken(storedRefreshToken ? storedRefreshToken : "");

    tokenService.setAccessToken(storedToken ? storedToken : "");
    tokenService.setRefreshToken(storedRefreshToken ? storedRefreshToken : "");

    if (storedClientId) {
      setClientId(storedClientId);
    }
    setAuthLoading(false);
  }, []);

  const value: AppContextType = {
    token,
    setToken,
    clientId,
    setClientId,
    BASE_URL,
    BACKEND_URL,
    USER_CREDENTIALS,
    AUTH_URL,
    APP_ID,
    refreshToken,
    setRefreshToken,
    authLoading,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};
