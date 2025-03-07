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
  const [accepted, setAccepted] = useState<any[]>([]); // Estado para los aceptados
  const [loading, setLoading] = useState<boolean>(true); // Para manejar el estado de carga
  const [loadingRequests, setLoadingRequests] = useState<boolean>(true); // Estado para la carga de solicitudes

  const handleRejectRequest = async (request: any) => {
    try {
      // Enviar la solicitud de rechazo al backend
      const response = await api.post("/ue.ad/req", {
        req_uevent: request.UEVENTS_ID,  // ID del evento
        decision: 0,  // 0 para rechazar la solicitud
      });
  
      // Si la respuesta es exitosa, actualizamos el estado
      if (response.status === 200) {
        console.log("Solicitud rechazada correctamente:", response.data);
  
        // Aquí puedes actualizar el estado para reflejar el cambio, por ejemplo, removiendo la solicitud de la lista de solicitudes
        setRequests((prevRequests) =>
          prevRequests.filter(
            (req) => req.USER_MOD.USER_ID !== request.USER_MOD.USER_ID
          )
        );
      } else {
        console.error("Error al rechazar la solicitud:", response.data);
      }
    } catch (error) {
      console.error("Error al rechazar la solicitud:", error);
    }
  };

  const handleAcceptRequest = async (request: any) => {
    try {
      // Enviar la solicitud de aceptación al backend
      const response = await api.post("/ue.ad/req", {
        req_uevent: request.UEVENTS_ID,  // ID del evento
        decision: 1,  // 1 para aceptar la solicitud
      });
  
      // Si la respuesta es exitosa, actualizamos el estado
      if (response.status === 200) {
        console.log("Solicitud aceptada correctamente:", response.data);
  
        // Aquí puedes actualizar el estado para reflejar el cambio, por ejemplo, moviendo la solicitud de la lista de pendientes a la lista de aceptados
        setRequests((prevRequests) =>
          prevRequests.filter(
            (req) => req.USER_MOD.USER_ID !== request.USER_MOD.USER_ID
          )
        );
  
        // Opcionalmente, también podrías agregar la solicitud a una lista de aceptados, si la tienes:
        setAccepted((prevAccepted) => [...prevAccepted, request]);
      } else {
        console.error("Error al aceptar la solicitud:", response.data);
      }
    } catch (error) {
      console.error("Error al aceptar la solicitud:", error);
    }
  };
  
  

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

  // Función para obtener las solicitudes cuando el evento está cerrado (Pendientes)
  useEffect(() => {
    const fetchRequests = async () => {
      if (event.EVENT_LOCK) { // Solo buscamos solicitudes si el evento está cerrado
        setLoadingRequests(true); // Empezamos a cargar solicitudes
        try {
          const response = await api.get(`/ue.ad/requests/${event.EVENT_ID}`);
          console.log(response);

          if (response && response.data && response.data.data) {
            setRequests(response.data.data.requested); // Guardamos las solicitudes en el estado
          } else {
            console.log("No se encontraron solicitudes.");
          }
        } catch (error) {
          console.error("Error al obtener las solicitudes:", error);
        } finally {
          setLoadingRequests(false); // Finaliza la carga
        }
      }
    };

    fetchRequests(); // Llamada a la API para obtener las solicitudes
  }, [event.EVENT_ID, event.EVENT_LOCK]);

  // Función para obtener los aceptados cuando el evento está cerrado (Aceptados)
  useEffect(() => {
    const fetchAccepted = async () => {
      if (event.EVENT_LOCK) { // Solo buscamos solicitudes si el evento está cerrado
        setLoadingRequests(true); // Empezamos a cargar solicitudes
        try {
          const response = await api.get(`/ue.ad/requests/${event.EVENT_ID}`);
          
          if (response && response.data && response.data.data) {
            setAccepted(response.data.data.accepted); // Guardamos los aceptados en el estado
          } else {
            console.log("No se encontraron aceptados.");
          }
        } catch (error) {
          console.error("Error al obtener los aceptados:", error);
        } finally {
          setLoadingRequests(false); // Finaliza la carga
        }
      }
    };

    fetchAccepted(); // Llamada a la API para obtener los aceptados
  }, [event.EVENT_ID, event.EVENT_LOCK]);

  // Determina qué lista mostrar según el estado del evento
  const getAttendeesToShow = event.EVENT_LOCK ? accepted : attendees;

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
  ) : getAttendeesToShow.length > 0 ? (
    <ul className="space-y-2">
      {getAttendeesToShow.map((attendee, index) => (
        <li
          key={attendee.USER_MOD.USER_ID}
          className={`flex items-center space-x-3 text-sm text-gray-600 p-3 rounded-lg shadow-sm ${
            index % 2 === 0 ? "bg-gray-100" : "bg-white"
          } border border-gray-200`}
        >
          {/* Imagen del usuario */}
          <img
            src={attendee.USER_MOD.USER_IMAGES[0]?.IMAGE_LINK || "default-avatar.png"}
            alt="Foto del dueño"
            className="w-12 h-12 rounded-full object-cover"
          />
          {/* Nombre del usuario */}
          <span className="ml-2">
            {attendee.USER_MOD.USER_FIRSTNAME} {attendee.USER_MOD.USER_LASTNAME}
          </span>
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
    ) : requests && requests.length > 0 ? (
      <ul className="space-y-2">
        {requests.map((request, index) => (
          <li
            key={request.USER_MOD.USER_ID}
            className={`flex items-center justify-between space-x-3 text-sm text-gray-600 p-3 rounded-lg shadow-sm ${
              index % 2 === 0 ? "bg-gray-100" : "bg-white"
            } border border-gray-200`}
          >
            {/* Imagen del usuario */}
            <div className="flex items-center space-x-3">
              <img
                src={request.USER_MOD.USER_IMAGES[0]?.IMAGE_LINK || "default-avatar.png"}
                alt="Foto del dueño"
                className="w-12 h-12 rounded-full object-cover"
              />
              <span className="ml-2">
                {request.USER_MOD.USER_FIRSTNAME} {request.USER_MOD.USER_LASTNAME}
              </span>
            </div>
            
            {/* Botones Aceptar/Rechazar */}
            <div className="space-x-2">
              <button
                onClick={() => handleAcceptRequest(request)} // Asegúrate de definir esta función
                className="px-4 py-2 text-white bg-green-500 rounded-md hover:bg-green-600"
              >
                Aceptar
              </button>
              <button
                onClick={() => handleRejectRequest(request)} // Asegúrate de definir esta función
                className="px-4 py-2 text-white bg-red-500 rounded-md hover:bg-red-600"
              >
                Rechazar
              </button>
            </div>
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
