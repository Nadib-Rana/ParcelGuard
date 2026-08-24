import { createContext, useContext, useState, type ReactNode } from "react";

interface AuthContextValue {
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  signup: (name: string, email: string, password: string, phone: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(
    () => localStorage.getItem("pg_auth") === "true"
  );

  const login = async (_email: string, _password: string) => {
    await new Promise(r => setTimeout(r, 900));
    localStorage.setItem("pg_auth", "true");
    setIsAuthenticated(true);
  };

  const signup = async (_name: string, _email: string, _password: string, _phone: string) => {
    await new Promise(r => setTimeout(r, 1100));
    localStorage.setItem("pg_auth", "true");
    setIsAuthenticated(true);
  };

  const logout = () => {
    localStorage.removeItem("pg_auth");
    setIsAuthenticated(false);
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, login, signup, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be inside AuthProvider");
  return ctx;
}
