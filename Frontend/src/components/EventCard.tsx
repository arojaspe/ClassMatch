import React, { useState } from "react";
import EventsImageGallery from "./EventsImageGallery"; // Importamos la galería de imágenes
import api from "../api/axiosConfig"; // Importamos la configuración de axios

interface Event {
  EVENT_ID: string;
  EVENT_ADMIN: string;
  EVENT_TITLE: string;
  EVENT_LOCATION: string;
  EVENT_CAPACITY: number;
  EVENT_DATE: string;
  EVENT_DESCRIPTION: string;
  EVENT_LOCK: boolean;
  USER_MOD: {
    USER_FIRSTNAME: string;
    USER_LASTNAME: string;
    USER_IMAGES: { IMAGE_LINK: string; IMAGE_ORDER: number }[];
  };
  EVENT_IMAGES: { IMAGE_LINK: string; IMAGE_ORDER: number }[];
}

type EventCardProps = {
  event: Event;
};

const EventCard: React.FC<EventCardProps> = ({ event }) => {
  const [loading, setLoading] = useState(false); // Estado para controlar el botón de envío
  const [message, setMessage] = useState(""); // Estado para mostrar el mensaje después de la solicitud

  // Concatenamos el nombre del dueño del evento
  const eventOwnerName = `${event.USER_MOD.USER_FIRSTNAME} ${event.USER_MOD.USER_LASTNAME}`;

  const handleSendRequest = async () => {
    setLoading(true); // Activar el estado de carga
    setMessage(""); // Limpiar mensaje previo

    try {
      // Realizamos la solicitud POST enviando el event_id en el cuerpo de la solicitud
      const response = await api.post(
        "/ue.us/", // No es necesario incluir el event_id en la URL
        {
          event: event.EVENT_ID, // Enviar el ID del evento en el cuerpo
        },
        {
          withCredentials: true, // Asegúrate de incluir esta opción para enviar las cookies
        }
      );

      if (response && response.data && response.data.data) {
        setMessage(
          `Solicitud enviada con éxito. Estado: ${response.data.data.aceptacion}`
        );
      } else {
        setMessage("No se pudo procesar la solicitud correctamente.");
      }
    } catch (error) {
      //setMessage("Error al enviar la solicitud. Inténtalo nuevamente.");
    } finally {
      setLoading(false); // Desactivar el estado de carga
    }
  };

  return (
    <div className="bg-white shadow-md p-6 rounded-lg mb-4 h-auto">
      {/* Título del evento */}
      <h3 className="text-xl font-KhandBold">{event.EVENT_TITLE}</h3>

      {/* Descripción del evento */}
      <p className="text-gray-600">{event.EVENT_DESCRIPTION}</p>

      {/* Galería de imágenes del evento */}
      <div className="mt-4 h-[200px]">
        <EventsImageGallery images={event.EVENT_IMAGES} />{" "}
        {/* Implementamos la galería */}
      </div>

      {/* Información adicional del evento */}
      <div className="mt-4">
        {/* Ubicación con ícono */}
        <div className="flex items-start mb-2">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth="1.5"
            stroke="currentColor"
            className="w-6 h-6 mb-1 mr-1"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M15 10.5a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z"
            />
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1 1 15 0Z"
            />
          </svg>
          <p className="text-sm text-gray-500">{event.EVENT_LOCATION}</p>
        </div>

        {/* Capacidad con ícono */}
        <div className="flex items-start mb-2">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth="1.5"
            stroke="currentColor"
            className="w-6 h-6 mb-1 mr-1"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M18 18.72a9.094 9.094 0 0 0 3.741-.479 3 3 0 0 0-4.682-2.72m.94 3.198.001.031c0 .225-.012.447-.037.666A11.944 11.944 0 0 1 12 21c-2.17 0-4.207-.576-5.963-1.584A6.062 6.062 0 0 1 6 18.719m12 0a5.971 5.971 0 0 0-.941-3.197m0 0A5.995 5.995 0 0 0 12 12.75a5.995 5.995 0 0 0-5.058 2.772m0 0a3 3 0 0 0-4.681 2.72 8.986 8.986 0 0 0 3.74.477m.94-3.197a5.971 5.971 0 0 0-.94 3.197M15 6.75a3 3 0 1 1-6 0 3 3 0 0 1 6 0Zm6 3a2.25 2.25 0 1 1-4.5 0 2.25 2.25 0 0 1 4.5 0Zm-13.5 0a2.25 2.25 0 1 1-4.5 0 2.25 2.25 0 0 1 4.5 0Z"
            />
          </svg>
          <p className="text-sm text-gray-500">{event.EVENT_CAPACITY}</p>
        </div>

        {/* Fecha con ícono */}
        <div className="flex items-start">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth="1.5"
            stroke="currentColor"
            className="w-6 h-6 mb-1 mr-1"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 0 1 2.25-2.25h13.5A2.25 2.25 0 0 1 21 7.5v11.25m-18 0A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75m-18 0v-7.5A2.25 2.25 0 0 1 5.25 9h13.5A2.25 2.25 0 0 1 21 11.25v7.5m-9-6h.008v.008H12v-.008ZM12 15h.008v.008H12V15Zm0 2.25h.008v.008H12v-.008ZM9.75 15h.008v.008H9.75V15Zm0 2.25h.008v.008H9.75v-.008ZM7.5 15h.008v.008H7.5V15Zm0 2.25h.008v.008H7.5v-.008Zm6.75-4.5h.008v.008h-.008v-.008Zm0 2.25h.008v.008h-.008V15Zm0 2.25h.008v.008h-.008v-.008Zm2.25-4.5h.008v.008H16.5v-.008Zm0 2.25h.008v.008H16.5V15Zm0 2.25h.008v.008H16.5v-.008Zm-4.5-4.5h.008v.008h-.008v-.008Zm0 2.25h.008v.008h-.008V15Zm0 2.25h.008v.008h-.008v-.008Zm0-2.25h.008v.008h-.008v-.008Zm0-2.25h.008v.008h-.008v-.008Zm0-2.25h.008v.008h-.008v-.008Zm0-2.25h.008v.008h-.008v-.008Zm0-2.25h.008v.008h-.008v-.008Z"
            />
          </svg>
          <p className="text-sm text-gray-500">
            {new Date(event.EVENT_DATE).toLocaleDateString()}
          </p>
        </div>

        {/* Locked */}
        <div className="flex items-start">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth="1.5"
            stroke="currentColor"
            className="w-6 h-6 mb-1 mr-1"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M16.5 10.5V6.75a4.5 4.5 0 1 0-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 0 0 2.25-2.25v-6.75a2.25 2.25 0 0 0-2.25-2.25H6.75a2.25 2.25 0 0 0-2.25 2.25v6.75a2.25 2.25 0 0 0 2.25 2.25Z"
            />
          </svg>
          <p className="text-sm text-gray-500">
            {event.EVENT_LOCK ? "Cerrado" : "Abierto"}
          </p>
        </div>

        {/* Información del dueño del evento */}
        <div className="mt-4 flex items-center">
          <img
            src={
              event.USER_MOD.USER_IMAGES[0]?.IMAGE_LINK || "default-avatar.png"
            }
            alt="Foto del dueño"
            className="w-10 h-10 rounded-full mr-3"
          />
          <p className="text-sm font-semibold">{eventOwnerName}</p>
        </div>

        {/* Mensaje de estado */}
        {message && <p className="mt-4 text-sm text-gray-500">{message}</p>}

        {/* Botón para enviar solicitud */}
        <div className="mt-4 text-center">
          <button
            onClick={handleSendRequest}
            className={`bg-teal-700 text-white font-semibold py-2 px-6 rounded-full hover:bg-teal-950 ${loading ? "opacity-50 cursor-not-allowed" : ""}`}
            disabled={loading} // Deshabilitar el botón mientras se realiza la solicitud
          >
            {loading ? "Enviando..." : "Enviar solicitud"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default EventCard;
