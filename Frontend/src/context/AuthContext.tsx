import { createContext, useState, useEffect } from "react";
import { checkAuth } from "../api/auth";

export const AuthContext = createContext<{
  user: any;
  setUser: (user: any) => void;
} | null>(null);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const verifyUser = async () => {
      const authenticatedUser = await checkAuth();
      setUser(authenticatedUser);
    };
    verifyUser();
  }, []); // Solo se ejecuta una vez al montar la app

  return (
    <AuthContext.Provider value={{ user, setUser }}>
      {children}
    </AuthContext.Provider>
  );
};
