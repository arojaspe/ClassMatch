import axios from "axios";

const api = axios.create({
  baseURL: "http://127.0.0.1:5000/api", // Ajusta esto si tu backend usa otro dominio
  withCredentials: true, // Importante para enviar cookies automáticamente
});

export default api;
