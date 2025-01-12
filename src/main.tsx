import ReactDOM from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import { Outlet, RouterProvider, createBrowserRouter } from "react-router-dom";
import Appheader from "./components/Appheader.js";
import Appfooter from "./components/Appfooter.tsx";
import AcercaDe from "./pages/AcercaDe.tsx";
import Busqueda from "./pages/Busqueda.tsx";
import MisMatch from "./pages/MisMatch.tsx";
import Eventos from "./pages/Eventos.tsx";
import Premium from "./pages/Premium.tsx";
import Contacto from "./pages/Contacto.tsx";
import TerminosYCondiciones from "./pages/TerminosYCondiciones.tsx";
import MiPerfil from "./pages/MiPerfil.tsx";
import CrearCuenta from "./pages/CrearCuenta.tsx";
import LogIn from "./pages/LogIn.tsx";
import RestablecerContraseña from "./pages/RestablecerContraseña.tsx";
import { useEffect, useState } from "react";
import Cookies from "universal-cookie";

const cookies = new Cookies();
export const Layout = () => {
  return (
    <div>
      <Appheader />
      <Outlet />
      <Appfooter />
    </div>
  );
};

const [isAuthenticated, setIsAuthenticated] = useState(true);

useEffect(() => {
  const verifyToken = () => {
    const token = cookies.get("token");
    setIsAuthenticated(!!token);
  };

  verifyToken();
}, []);

const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    children: [
      {
        path: "/",
        element: <App />,
      },
      {
        path: "/busqueda",
        element: <Busqueda />,
      },
      {
        path: "/mismatch",
        element: <MisMatch />,
      },
      {
        path: "/acercaDe",
        element: <AcercaDe />,
      },
      {
        path: "/eventos",
        element: <Eventos />,
      },
      {
        path: "/premium",
        element: <Premium />,
      },
      {
        path: "/contacto",
        element: <Contacto />,
      },
      {
        path: "/terminosycondiciones",
        element: <TerminosYCondiciones />,
      },
      {
        path: "/acercaDe",
        element: <AcercaDe />,
      },
      {
        path: "/miperfil",
        element: <MiPerfil />,
      },
      {
        path: "/crearcuenta",
        element: <CrearCuenta />,
      },
      {
        path: "/login",
        element: <LogIn />,
      },
      {
        path: "/recuperarcontrasena",
        element: <RestablecerContraseña />,
      },
    ],
  },
]);

ReactDOM.createRoot(document.getElementById("root")!).render(
  <RouterProvider router={router} />
);
