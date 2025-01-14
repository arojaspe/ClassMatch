import { useEffect, useState, useRef } from "react";
import { Link } from "react-router-dom";
import Cookies from "universal-cookie";

const cookies = new Cookies();

export default function Appheader() {
  const [isAuthenticated, setIsAuthenticated] = useState(true);
  const [menuVisible, setMenuVisible] = useState(false); // Estado para mostrar/ocultar el menú
  const menuRef = useRef<HTMLDivElement | null>(null); // Referencia al menú desplegable
  const buttonRef = useRef<HTMLDivElement | null>(null); // Referencia al área que activa el menú (nombre + foto)

  useEffect(() => {
  /*  const verifyToken = () => {
      const token = cookies.get("token");
      setIsAuthenticated(!!token);
    };

    verifyToken();
*/
    // Detectar clics fuera del menú para cerrarlo
    const handleClickOutside = (event: MouseEvent) => {
      // Verifica si el clic fue fuera del botón o el menú
      if (
        menuRef.current && !menuRef.current.contains(event.target as Node) &&
        buttonRef.current && !buttonRef.current.contains(event.target as Node)
      ) {
        setMenuVisible(false);
      }
    };

    document.addEventListener("click", handleClickOutside);

    // Limpiar el event listener cuando el componente se desmonte
    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, []);

  const toggleMenu = (event: React.MouseEvent) => {
    event.preventDefault(); // Evita que se haga una navegación
    setMenuVisible((prev) => !prev); // Alternar la visibilidad del menú
  };

  const handleLogout = () => {
    cookies.remove("token"); // Eliminar el token de la cookie
    setIsAuthenticated(false); // Actualizar el estado de autenticación
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

          {isAuthenticated ? (
            <>
              <nav className="flex px-8 space-x-4 w-[80%] justify-start">
                <Link
                  to="/busqueda"
                  className="px-8 py-2 bg-buttonClassMatch font-KhandMedium text-lg text-white rounded-md hover:bg-gray-100 hover:text-black transition font-Khand-Regular"
                >
                  Búsqueda
                </Link>
                <Link
                  to="/mismatch"
                  className="px-8 py-2 bg-buttonClassMatch font-KhandMedium text-lg text-white rounded-md hover:bg-gray-100 hover:text-black transition"
                >
                  Mis match
                </Link>
                <Link
                  to="/eventos"
                  className="px-8 py-2 bg-buttonClassMatch font-KhandMedium text-lg text-white rounded-md hover:bg-gray-100 hover:text-black transition"
                >
                  Eventos
                </Link>
                <Link
                  to="/premium"
                  className="px-8 py-2 bg-premiumButtonClassMatch font-KhandMedium text-lg text-white rounded-md hover:bg-gray-100 hover:text-black transition"
                >
                  Premium
                </Link>
              </nav>

              <div
                className="right-4 h-10 absolute flex items-center cursor-pointer font-KhandMedium text-lg text-white hover:text-mainClassMatch transition"
                ref={buttonRef} // Referencia al contenedor
                onClick={toggleMenu} // Alterna la visibilidad del menú
              >
                <div className="flex items-center space-x-1">
                    Nombre
                  <img
                    className="img-fluid h-16 rounded-full"
                    src={`/img/Profile.png`}
                    alt="imagen perfil"
                  />
                </div>

                {/* Menú desplegable */}
                {menuVisible && (
                  <div
                    ref={menuRef} // Referencia al menú
                    className="absolute right-0 mt-2 bg-white text-black rounded-md shadow-lg w-40 z-20"
                    style={{ top: '140%', left: '-28%' }} // Esto asegura que el menú se muestre hacia abajo
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
