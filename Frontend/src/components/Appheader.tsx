import axios from "../api/axiosConfig";
import { useEffect, useState, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";

export default function Appheader() {
  //const [cookies, removeCookie] = useCookies(["access_token"]);

  const [isAuthenticated, setIsAuthenticated] = useState(true);
  const [menuVisible, setMenuVisible] = useState(false); // Estado para mostrar/ocultar el menú
  const menuRef = useRef<HTMLDivElement | null>(null); // Referencia al menú desplegable
  const buttonRef = useRef<HTMLDivElement | null>(null); // Referencia al área que activa el menú (nombre + foto)
  const [idUsuario, setIdusuario] = useState("");
  const [userImage, setUserImage] = useState("");
  const [plan, setPlan] = useState("");
  const navigate = useNavigate();

  const [mobileMenuVisible, setMobileMenuVisible] = useState(false); // Estado para el menú desplegable móvil

  const toggleMobileMenu = () => {
    setMobileMenuVisible(!mobileMenuVisible); // Toggle del menú móvil
  };


  const handleMenuClick = (event:MouseEvent) => {

    const target = event.target as Node;
    // Lógica para ocultar el menú cuando se hace clic fuera de él
    if (
      menuRef.current && 
      !menuRef.current.contains(target) &&
      buttonRef.current && 
      !buttonRef.current.contains(target)
    ) {
      setMobileMenuVisible(false); // Ocultar el menú móvil
    }
  };

  useEffect(() => {
    document.addEventListener("click", handleMenuClick); // Agregar listener para manejar clics fuera del menú
    return () => {
      document.removeEventListener("click", handleMenuClick); // Limpiar el listener
    };
  }, []);


  

  useEffect(() => {
    const checkAuthStatus = async () => {
      try {
        const response = await axios.get("/auth", { withCredentials: true });
        if (response.status === 200) {
          setIsAuthenticated(true);
          setIdusuario(response.data.data.USER_ID);
        }
        console.log("El usuario está autenticado", response.status);
      } catch (error) {
        console.log("Error checking authentication status", error);
        setIsAuthenticated(false);
      }
    };

    checkAuthStatus();

    // Detectar clics fuera del menú para cerrarlo
    const handleClickOutside = (event: MouseEvent) => {
      // Verifica si el clic fue fuera del botón o el menú
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

    // Limpiar el event listener cuando el componente se desmonte
    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  });

  useEffect(() => {
    axios
      .get("/u/" + idUsuario)
      .then((response) => {
        console.log(
          "Las imágenes del usuario son",
          response.data.data.USER_IMAGES
        );
        setUserImage(response.data.data.USER_IMAGES[0].IMAGE_LINK);
      })
      .catch((error) => {
        console.error("Error fetching imagenes del usuario logueado", error);
      });
  }, [idUsuario]);

  useEffect(() => {
    axios
      .get("/plan")
      .then((response) => {
        console.log("El plan del usuario es", response.data.data);
        setPlan(response.data.data);
      })
      .catch((error) => {
        console.error("Error fetching el plan del usuario logueado", error);
      });
  }, [idUsuario]);

  const toggleMenu = (event: React.MouseEvent) => {
    event.preventDefault(); // Evita que se haga una navegación
    setMenuVisible((prev) => !prev); // Alternar la visibilidad del menú
  };

  const handleLogout = async () => {
    try {
      await axios.get("/logout", { withCredentials: true }); // Asegura que envías la cookie al backend

      // Borra el token del almacenamiento local
      localStorage.removeItem("user");
      setIsAuthenticated(false); // Actualizar el estado de autenticación

      //Borra la cookie de `access_token`
      // removeCookie("access_token", { path: "/" });

      // Redirige al login
      navigate("/");
      window.location.reload(); // Recarga la app para reflejar los cambios
    } catch (error) {
      console.log("Error al cerrar sesión", error);
    }
  };

  return (
    <header className="py-4 bg-headClassMatch text-white shadow-md w-full fixed top-0 h-auto z-10">
      <div className="mx-auto px-4 sm:px-6 md:px-10">
        <div className="flex justify-between items-center">
          <div className="w-[30%] sm:w-[20%]">
            <Link to="/">
              <img
                src="/img/ClassmatchTextWhite.png"
                alt="Logo"
                className="h-14 w-auto object-contain hover:opacity-25 duration-200 rounded-xl"
              />
            </Link>
          </div>

          {/* Menú para pantallas grandes */}
          {isAuthenticated ? (
            <>
              <nav className="hidden sm:flex px-8 space-x-4 w-[70%] justify-start">
                <Link
                  to="/busqueda"
                  className="px-8 py-2 bg-buttonClassMatch font-KhandMedium text-lg text-white rounded-md hover:bg-gray-100 hover:text-black transition"
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
                {plan !== "Premium" && (
                  <Link
                    to="/premium"
                    className="px-8 py-2 bg-gradient-to-r from-premiumButtonClassMatch via-teal-600 to-cyan-600 font-KhandMedium text-lg text-white rounded-md hover:bg-gray-100 hover:text-black transition"
                  >
                    Premium
                  </Link>
                )}
              </nav>

              {/* Menú desplegable */}
              <div
                className="right-4 h-10 absolute flex items-center cursor-pointer font-KhandMedium text-lg text-white hover:text-mainClassMatch transition space-x-3"
                ref={buttonRef}
                onClick={toggleMenu}
              >
                <div
                  className={`flex items-center space-x-2 p-1 rounded-full ${
                    plan === "Premium"
                      ? "bg-gradient-to-r from-premiumButtonClassMatch via-teal-600 to-cyan-600"
                      : ""
                  }`}
                  style={
                    plan === "Premium"
                      ? { boxShadow: "0 0 10px 0 rgba(0, 255, 255, 0.5)" }
                      : {}
                  }
                >
                  <p className={plan === "Premium" ? "text-white ml-3" : ""}>
                    Hola, {""}
                    {
                      JSON.parse(localStorage.getItem("user") || "{}")
                        .USER_FIRSTNAME
                    }
                  </p>
                  <img
                    className={`h-16 w-16 object-cover rounded-full`}
                    src={userImage || "/img/noimage.png"}
                    alt="imagen perfil"
                  />
                </div>

                {/* Menú desplegable */}
                {menuVisible && (
                  <div
                    ref={menuRef}
                    className="absolute mt-2 bg-white text-black rounded-md shadow-lg w-40 z-20"
                    style={{ top: "140%", left: "-0%" }}
                  >
                    <Link
                      to="/miperfil"
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
            <nav className="flex w-[70%] sm:w-[50%] justify-end space-x-4">
              <Link
                to="/login"
                className="px-8 py-2 bg-buttonClassMatch font-KhandMedium text-lg text-white rounded-md hover:bg-gray-100 hover:text-black transition"
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

      {/* Menú móvil */}
      {isAuthenticated && (
        <>
          {/* Menú hamburguesa */}
          <div className="sm:hidden flex justify-between items-center w-full">
            <button
              className="text-white hover:text-gray-200 focus:outline-none mx-auto"
              onClick={toggleMobileMenu}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-8 w-8"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                strokeWidth="2"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M4 6h16M4 12h16M4 18h16"
                />
              </svg>
            </button>
          </div>

          {/* Menú móvil */}
          {mobileMenuVisible && (
            <div className="sm:hidden absolute w-full bg-white text-black shadow-lg z-10">
              <nav className="flex flex-col space-y-4 p-4">
                <Link
                  to="/busqueda"
                  className="px-6 py-2 bg-buttonClassMatch font-KhandMedium text-lg text-white rounded-md hover:bg-gray-100 hover:text-black transition"
                >
                  Búsqueda
                </Link>
                <Link
                  to="/mismatch"
                  className="px-6 py-2 bg-buttonClassMatch font-KhandMedium text-lg text-white rounded-md hover:bg-gray-100 hover:text-black transition"
                >
                  Mis match
                </Link>
                <Link
                  to="/eventos"
                  className="px-6 py-2 bg-buttonClassMatch font-KhandMedium text-lg text-white rounded-md hover:bg-gray-100 hover:text-black transition"
                >
                  Eventos
                </Link>
                {plan !== "Premium" && (
                  <Link
                    to="/premium"
                    className="px-6 py-2 bg-gradient-to-r from-premiumButtonClassMatch via-teal-600 to-cyan-600 font-KhandMedium text-lg text-white rounded-md hover:bg-gray-100 hover:text-black transition"
                  >
                    Premium
                  </Link>
                )}
              </nav>
            </div>
          )}
        </>
      )}

    </header>
  );
}
