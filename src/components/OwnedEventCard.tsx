import React, { useState, useEffect } from "react";
import api from "../api/axiosConfig"; // Asegúrate de tener configurado tu api

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

type OwnedEventCardProps = {
  event: Event;
};

const OwnedEventCard: React.FC<OwnedEventCardProps> = ({ event }) => {
  const [attendees, setAttendees] = useState<any[]>([]); // Estado para los asistentes
  const [requests, setRequests] = useState<any[]>([]); // Estado para las solicitudes
  const [loading, setLoading] = useState<boolean>(true); // Para manejar el estado de carga
  const [loadingRequests, setLoadingRequests] = useState<boolean>(false); // Estado para la carga de solicitudes

  useEffect(() => {
    // Función para obtener la lista de asistentes
    const fetchAttendees = async () => {
      try {
        const response = await api.get(`/ue.us/attendees/${event.EVENT_ID}`);
        if (response && response.data && response.data.data) {
          setAttendees(response.data.data); // Guardamos los asistentes en el estado
        } else {
          console.log("No se encontraron asistentes.");
        }
      } catch (error) {
        console.error("Error al obtener los asistentes:", error);
      } finally {
        setLoading(false); // Finaliza la carga
      }
    };

    fetchAttendees(); // Llamada a la API para obtener los asistentes
  }, [event.EVENT_ID]);

  // Función para obtener las solicitudes cuando el evento está cerrado
  useEffect(() => {
    const fetchRequests = async () => {
      if (event.EVENT_LOCK) { // Solo buscamos solicitudes si el evento está cerrado
        setLoadingRequests(true); // Empezamos a cargar solicitudes
        try {
          const response = await api.get(`/ue.ad/requests/${event.EVENT_ID}`);
          if (response && response.data && response.data.data) {
            setRequests(response.data.data); // Guardamos las solicitudes en el estado
          } else {
            console.log("No se encontraron solicitudes.");
          }
        } catch (error) {
          console.error("Error al obtener las solicitudes:", error);
        } finally {
          setLoadingRequests(false); // Finaliza la carga de solicitudes
        }
      }
    };

    fetchRequests(); // Llamada a la API para obtener las solicitudes
  }, [event.EVENT_ID, event.EVENT_LOCK]);

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

      {/* Lista de asistentes */}
      <div className="mt-4">
        <h4 className="text-lg font-KhandSemiBold">Asistentes</h4>
        {loading ? (
          <p className="text-gray-500">Cargando asistentes...</p>
        ) : attendees.length > 0 ? (
          <ul className="space-y-2">
            {attendees.map((attendee) => (
              <li key={attendee.USER_ID} className="text-sm text-gray-600">
                {attendee.USER_FIRSTNAME} {attendee.USER_LASTNAME}
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-gray-500">No hay asistentes aún.</p>
        )}
      </div>

      {/* Si el evento está cerrado, mostrar las solicitudes */}
      {event.EVENT_LOCK && (
        <div className="mt-6">
          <h4 className="text-lg font-KhandSemiBold">Solicitudes de asistencia</h4>
          {loadingRequests ? (
            <p className="text-gray-500">Cargando solicitudes...</p>
          ) : requests.length > 0 ? (
            <ul className="space-y-2">
              {requests.map((request) => (
                <li key={request.REQUEST_ID} className="text-sm text-gray-600">
                  {request.USER_FIRSTNAME} {request.USER_LASTNAME}
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-gray-500">No hay solicitudes aún.</p>
          )}
        </div>
      )}
    </div>
  );
};

export default OwnedEventCard;
