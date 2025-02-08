import React, { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";

import api from "../api/axiosConfig";

interface PrivateRouteProps {
  children: React.ReactNode;
}

export default function PrivateRoute({ children }: PrivateRouteProps) {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const response = await api.get("/auth", { withCredentials: true });
        console.log(response.data.data);
        setIsAuthenticated(!!response.data.data);
      } catch {
        setIsAuthenticated(false);
      }
    };

    checkAuth();
  }, []);

  if (isAuthenticated === null) return null; // Muestra nada mientras verifica
  if (!isAuthenticated) return <Navigate to="/login" />;
  return <>{children}</>;
}
