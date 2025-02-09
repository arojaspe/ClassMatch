import HomeCard from "./components/homeCard";
import { useEffect, useState } from "react";
import { checkAuth } from "./api/auth"; // Importa la función
import { AuthProvider } from "./context/AuthContext";

export default function App() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const fetchUser = async () => {
      const authenticatedUser = await checkAuth();
      if (authenticatedUser) {
        setUser(authenticatedUser); // Guarda la info del usuario en el estado
      }
    };
    fetchUser();
  }, []);
  return (
    <>
      <AuthProvider>
        <div className="flex justify-between items-center bg-backgroundClassMatch min-h-screen overflow-hidden">
          <div className="w-full flex  justify-center ">
            <HomeCard containerClassName="w-[80%]" />
          </div>
          <img src="/img/Hometest.png" alt="HomeImage" className="h-[89vh]" />
        </div>
      </AuthProvider>
    </>
  );
}
