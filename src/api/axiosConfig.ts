import axios from "axios";
import { refreshAccessToken } from "./auth";

const instance = axios.create({
  baseURL: "http://127.0.0.1:5000/api",
  withCredentials: true,
});

// Interceptor para manejar errores de autenticación
instance.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401) {
      console.log("Token expirado. Intentando renovar...");
      await refreshAccessToken();
      return instance.request(error.config); // Reintentar la solicitud original
    }
    return Promise.reject(error);
  }
);

export default instance;
