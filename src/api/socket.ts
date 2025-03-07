import { io } from "socket.io-client";

const socket = io("https://www.classmatch.site", {
  path: "/socket.io", // Especifica el mismo path que el backend
  withCredentials: true, // Permite enviar cookies en la conexión
  transports: ["websocket"], // Fuerza el uso de WebSockets
});

export default socket;
