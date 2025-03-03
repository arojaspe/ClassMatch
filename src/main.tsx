import ReactDOM from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import { Outlet, RouterProvider, createBrowserRouter } from "react-router-dom";
import Appheader from "./components/Appheader.js";
import Appfooter from "./components/Appfooter.tsx";
import AcercaDe from "./pages/AcercaDe.tsx";
import Busqueda from "./pages/Busqueda.tsx";
import Eventos from "./pages/Eventos.tsx";
import Premium from "./pages/Premium.tsx";
import Contacto from "./pages/Contacto.tsx";
import TerminosYCondiciones from "./pages/TerminosYCondiciones.tsx";
import MiPerfil from "./pages/MiPerfil.tsx";
import CrearCuenta from "./pages/CrearCuenta.tsx";
import LogIn from "./pages/LogIn.tsx";
import RestablecerContraseña from "./pages/RestablecerContraseña.tsx";
import RestablecerContraseñaCodigo from "./pages/RestablecerContraseñaCodigo.tsx";
//import { useEffect, useState } from "react";
//import Cookies from "universal-cookie";
import PrivateRoute from "./middleware/PrivateRoute.tsx";
import NuevaContraseña from "./pages/NuevaContraseña.tsx";
import axios from "axios";
import Personalizar from "./pages/Personalizar.tsx";
import ChatPage from "./pages/ChatPage.tsx";
import EsperaVerificacion from "./pages/EsperaVerificacion.tsx";
import { VerificarEmail } from "./pages/VerificarEmail.tsx";

axios.defaults.baseURL = "http://127.0.0.1:5000/api";
axios.defaults.withCredentials = true;

export const Layout = () => {
  return (
    <div>
      <Appheader />
      <Outlet />
      <Appfooter />
    </div>
  );
};

// const [isAuthenticated, setIsAuthenticated] = useState(true);

// useEffect(() => {
//   const verifyToken = () => {
//     const token = cookies.get("token");
//     setIsAuthenticated(!!token);
//   };

//   verifyToken();
// }, []);

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
        element: (
          <PrivateRoute>
            <Busqueda />
          </PrivateRoute>
        ),
      },
      {
        path: "/mismatch",
        element: (
          <PrivateRoute>
            <ChatPage />
          </PrivateRoute>
        ),
      },
      {
        path: "/acercaDe",
        element: <AcercaDe />,
      },
      {
        path: "/eventos",
        element: (
          <PrivateRoute>
            <Eventos />
          </PrivateRoute>
        ),
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
        element: (
          <PrivateRoute>
            <MiPerfil />
          </PrivateRoute>
        ),
      },
      {
        path: "/crearcuenta",
        element: <CrearCuenta />,
      },
      {
        path: "/Personalizar",
        element: <Personalizar />,
      },
      {
        path: "/login",
        element: <LogIn />,
      },
      {
        path: "/recuperarcontrasena",
        element: <RestablecerContraseña />,
      },
      {
        path: "/recuperarcontrasenacodigo",
        element: <RestablecerContraseñaCodigo />,
      },
      {
        path: "/nuevacontraseña",
        element: <NuevaContraseña />,
      },
      {
        path: "/verificacionregistro",
        element: <EsperaVerificacion />,
      },
      {
        path: "verificaremail/:magiclink",
        element: <VerificarEmail />,
      },
    ],
  },
]);

ReactDOM.createRoot(document.getElementById("root")!).render(
  <RouterProvider router={router} />
);
