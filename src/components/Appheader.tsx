import { useContext, useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useCookies } from "react-cookie";
import { AuthContext } from "../context/AuthContext";
import api from "../api/axiosConfig";

export default function Appheader() {
  const [cookies, removeCookie] = useCookies(["access_token"]);
  const { user, setUser } = useContext(AuthContext) ?? {};
  const [menuVisible, setMenuVisible] = useState(false);
  const menuRef = useRef<HTMLDivElement | null>(null);
  const buttonRef = useRef<HTMLDivElement | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    // Detectar clics fuera del menú para cerrarlo
    const handleClickOutside = (event: MouseEvent) => {
      if (
        menuRef.current &&
        !menuRef.current.contains(event.target as Node) &&
        buttonRef.current &&
        !buttonRef.current.contains(event.target as Node)
      ) {
        setMenuVisible(false);
      }
    };

    document.addEventListener("click", handleClickOutside);
    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, []);

  const toggleMenu = (event: React.MouseEvent) => {
    event.preventDefault();
    setMenuVisible((prev) => !prev);
  };

  const handleLogout = async () => {
    try {
      await api.get("/logout", { withCredentials: true });
      removeCookie("access_token", { path: "/" });
      setUser?.(null);
      navigate("/login");
    } catch (error) {
      console.log("Error al cerrar sesión", error);
    }
  };

  return (
    <header className="py-4 bg-headClassMatch text-white shadow-md w-full fixed top-0 h-auto z-10">
      <div className="mx-auto px-10">
        <div className="flex justify-start items-center">
          <div className="w-[20%]">
            <Link to="/">
              <img
                src="/img/ClassmatchTextWhite.png"
                alt="Logo"
                className="h-14 w-auto object-contain hover:opacity-25 duration-200 rounded-xl"
              />
            </Link>
          </div>

          {user ? (
            <>
              <nav className="flex px-8 space-x-4 w-[80%] justify-start">
                <Link
                  to="/busqueda"
                  className="px-8 py-2 bg-buttonClassMatch text-lg text-white rounded-md hover:bg-gray-100 hover:text-black transition"
                >
                  Búsqueda
                </Link>
                <Link
                  to="/mismatch"
                  className="px-8 py-2 bg-buttonClassMatch text-lg text-white rounded-md hover:bg-gray-100 hover:text-black transition"
                >
                  Mis match
                </Link>
                <Link
                  to="/eventos"
                  className="px-8 py-2 bg-buttonClassMatch text-lg text-white rounded-md hover:bg-gray-100 hover:text-black transition"
                >
                  Eventos
                </Link>
                <Link
                  to="/premium"
                  className="px-8 py-2 bg-premiumButtonClassMatch text-lg text-white rounded-md hover:bg-gray-100 hover:text-black transition"
                >
                  Premium
                </Link>
              </nav>

              <div
                className="right-4 h-10 absolute flex items-center cursor-pointer text-lg text-white hover:text-mainClassMatch transition"
                ref={buttonRef}
                onClick={toggleMenu}
              >
                <div className="flex items-center space-x-1">
                  <img
                    className="img-fluid h-16 rounded-full"
                    src="/img/Profile.png"
                    alt="imagen perfil"
                  />
                </div>
                {menuVisible && (
                  <div
                    ref={menuRef}
                    className="absolute mt-2 bg-white text-black rounded-md shadow-lg w-40 z-20"
                    style={{ top: "140%", left: "-130%" }}
                  >
                    <Link
                      to="/configuracion"
                      className="block px-4 py-2 text-lg hover:bg-gray-200 hover:text-headClassMatch"
                    >
                      Configuración
                    </Link>
                    <button
                      onClick={handleLogout}
                      className="block w-full text-left px-4 py-2 text-lg hover:bg-gray-200 hover:text-headClassMatch"
                    >
                      Cerrar sesión
                    </button>
                  </div>
                )}
              </div>
            </>
          ) : (
            <nav className="flex w-[80%] justify-end space-x-4">
              <Link
                to="/login"
                className="px-8 py-2 bg-buttonClassMatch font-KhandMedium text-lg text-white rounded-md hover:bg-gray-100 hover:text-black transition font-Khand-Regular"
              >
                Ingresar
              </Link>
              <Link
                to="/crearcuenta"
                className="px-8 py-2 bg-accentButtonClassMatch font-KhandMedium text-lg text-white rounded-md hover:bg-gray-100 hover:text-black transition"
              >
                Crear cuenta
              </Link>
            </nav>
          )}
        </div>
      </div>
    </header>
  );
}
