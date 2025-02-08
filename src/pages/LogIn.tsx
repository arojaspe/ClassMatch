import { useContext, useEffect } from "react";
import { AuthContext } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import LoginCard from "../components/LoginCard";

export default function LogIn() {
  const { user } = useContext(AuthContext) ?? {};
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      console.log("Ya hay un usuario autenticado");
      navigate("/busqueda");
    }
  }, [user, navigate]);

  return (
    <div className="w-auto bg-backgroundClassMatch flex items-center h-screen">
      <LoginCard />
    </div>
  );
}
