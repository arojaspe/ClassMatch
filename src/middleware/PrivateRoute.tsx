import React from "react";
import { Navigate } from "react-router-dom";
import Cookies from "universal-cookie";

const cookies = new Cookies();

interface PrivateRouteProps {
  children: React.ReactNode;
}

export default function PrivateRoute({ children }: PrivateRouteProps) {
  const token = cookies.get("token");

  if (!token) {
    return <Navigate to="/login" />;
  }

  return <>{children}</>;
}
