import React from "react";

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

type MyEventCardProps = {
  event: Event;
};

const MyEventCard: React.FC<MyEventCardProps> = ({ event }) => {
  const eventOwnerName = `${event.USER_MOD.USER_FIRSTNAME} ${event.USER_MOD.USER_LASTNAME}`;

  return (
    <div className="bg-white shadow-md p-6 rounded-lg mb-4">
      {/* Título del evento */}
      <h3 className="text-xl font-KhandBold">{event.EVENT_TITLE}</h3>

      {/* Descripción corta del evento */}
      <p className="text-gray-600">{event.EVENT_DESCRIPTION}</p>

      {/* Información adicional del evento */}
      <div className="mt-4">
        {/* Ubicación */}
        <p className="text-sm text-gray-500">Ubicación: {event.EVENT_LOCATION}</p>

        {/* Capacidad */}
        <p className="text-sm text-gray-500">Capacidad: {event.EVENT_CAPACITY}</p>

        {/* Fecha */}
        <p className="text-sm text-gray-500">Fecha: {new Date(event.EVENT_DATE).toLocaleDateString()}</p>

        {/* Estado del evento (Cerrado/Abierto) */}
        <p className="text-sm text-gray-500">Estado: {event.EVENT_LOCK ? "Cerrado" : "Abierto"}</p>
      </div>

      {/* Información del dueño del evento */}
      <div className="mt-4 flex items-center">
        <img
          src={event.USER_MOD.USER_IMAGES[0]?.IMAGE_LINK || "default-avatar.png"}
          alt="Foto del dueño"
          className="w-10 h-10 rounded-full mr-3"
        />
        <p className="text-sm font-semibold">{eventOwnerName}</p>
      </div>

      {/* Sección de estado de solicitud (si el evento está cerrado y el usuario ha solicitado asistir) */}
      <div className="mt-4">
        {event.EVENT_LOCK ? (
          <p className="text-sm text-yellow-500">Solicitud enviada</p>
        ) : (
          <p className="text-sm text-green-500">Asistencia confirmada</p>
        )}
      </div>
    </div>
  );
};

export default MyEventCard;
