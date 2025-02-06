import { createContext, useState, useEffect, ReactNode } from "react";
import { checkAuth, refreshAccessToken } from "../api/auth";

interface AuthContextType {
  user: any;
  logout: () => void;
}

export const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const verifyUser = async () => {
      let authenticatedUser = await checkAuth();
      if (!authenticatedUser) {
        await refreshAccessToken();
        authenticatedUser = await checkAuth();
      }
      setUser(authenticatedUser);
    };

    verifyUser();
  }, []);

  const logout = () => {
    setUser(null);
    localStorage.removeItem("user");
    window.location.href = "/login";
  };

  return (
    <AuthContext.Provider value={{ user, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
