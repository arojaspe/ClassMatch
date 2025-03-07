import Logo from "./Logo";
import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";

interface HomeCardProps {
  containerClassName?: string;
  sectionClassName?: string;
  logoClassName?: string;
  titleClassName?: string;
  descriptionClassName?: string;
}

export default function HomeCard({
  containerClassName = "",
  sectionClassName = "",
  logoClassName = "",
  titleClassName = "",
  descriptionClassName = "",
}: HomeCardProps) {
  const [isAuthenticated, setIsAuthenticated] = useState(true);

  useEffect(() => {
    const checkAuthStatus = async () => {
      try {
        const response = await axios.get("/auth", { withCredentials: true });
        if (response.status === 200) {
          setIsAuthenticated(true);
        }
        console.log("El usuario está autenticado", response.status);
      } catch (error) {
        console.log("Error checking authentication status", error);
        setIsAuthenticated(false);
      }
    };

    checkAuthStatus();
  }, []);
  return (
    <div className="flex flex-col items-center py-6">
      <div
        className={`bg-mainClassMatch bg-opacity-25 h-min w-[45rem] p-6 rounded-xl ${containerClassName}`}
      >
        <section
          className={`flex h-30 items-center mx-8 justify-between mb-5 w-auto ${sectionClassName}`}
        >
          <Logo className={`w-40 h-min ${logoClassName}`} fill="#004954" />
          <p
            className={`font-KhandBold text-[2.5rem] pl-4 leading-10 text-headClassMatch ${titleClassName}`}
          >
            ClassMatch: Conecta con tus compañeros, optimiza tu tiempo
          </p>
        </section>
        <section className={`h-min ${sectionClassName}`}>
          <p
            className={`font-KhandRegular text-2xl text-justify px-6 leading- ${descriptionClassName}`}
          >
            Descubre una nueva forma de socializar en tu universidad. ClassMatch
            te ayuda a conectar con otros estudiantes según tus horarios
            disponibles, facilitando encuentros y relaciones significativas.
            Regístrate con tu correo institucional y comienza a explorar un
            entorno diseñado exclusivamente para ti.
          </p>
        </section>
      </div>
      {!isAuthenticated ? (
        <nav className="flex w-[80%] justify-center space-x-4 mt-6">
          <Link
            to="/login"
            className="px-12 py-4 bg-buttonClassMatch font-KhandMedium text-3xl text-white rounded-md hover:bg-gray-100 hover:text-black transition font-Khand-Regular"
          >
            Ingresar
          </Link>
          <Link
            to="/crearcuenta"
            className="px-12 py-4 bg-accentButtonClassMatch font-KhandMedium text-3xl text-white rounded-md hover:bg-gray-100 hover:text-black transition"
          >
            Crear cuenta
          </Link>
        </nav>
      ) : (
        <></>
      )}
    </div>
  );
}
