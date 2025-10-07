import { createContext, useEffect, useState, type ReactNode } from "react";

// Define the shape of your context value
interface AppContextType {
  token: string;
  setToken: (token: string) => void;
}

// ✅ Create the context (no namespace issue)
export const AppContext = createContext<AppContextType>({
  token: "",
  setToken: (_: string) => {},
});

// Props for the Provider
interface AppContextProviderProps {
  children: ReactNode;
}

export const AppContextProvider = ({ children }: AppContextProviderProps) => {
  const [token, setToken] = useState("");

  useEffect(() => {
    const storedToken = localStorage.getItem("token");
    if (storedToken) {
      setToken(storedToken);
    }
  }, []);

  const value: AppContextType = { token, setToken };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};
