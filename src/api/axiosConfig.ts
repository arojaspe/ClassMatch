import axios from "axios";

const api = axios.create({
  baseURL: "https://classmatch.site/api", // Ajusta esto si tu backend usa otro dominio
  withCredentials: true, // Importante para enviar cookies automáticamente
});

export default api;
