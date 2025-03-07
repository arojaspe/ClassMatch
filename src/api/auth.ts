import api from "./axiosConfig";

export const checkAuth = async () => {
  try {
    const response = await api.get("/auth"); // Verifica si el usuario está logueado
    return response.data.data; // Devuelve la información del usuario si está autenticado
  } catch {
    console.error("User is not authenticated");
    return null; // Si hay error, el usuario no está autenticado
  }
};
