import { useState, useEffect } from "react";
import api from "../api/axiosConfig";
import EventCard from "../components/EventCard";
import MyEventCard from "../components/MyEventCard";
import CreateEventCard from "../components/CreateEventCard";
import OwnedEventCard from "../components/OwnedEventCard"; // Importamos la nueva card

export default function Eventos() {
  const [eventos, setEventos] = useState<any[]>([]);
  const [misEventos, setMisEventos] = useState<any[]>([]); // Eventos a los que el usuario ha asistido o solicitado asistir
  const [aplicadosEventos, setAplicadosEventos] = useState<any[]>([]); // Eventos a los que se ha aplicado
  const [eventosAsistidos, setEventosAsistidos] = useState<any[]>([]); // Eventos que el usuario ha asistido
  const [seccionActiva, setSeccionActiva] = useState("Feed");
  const [eventosOrganizadosIds, setEventosOrganizadosIds] = useState<string[]>(
    []
  );

  // Obtener eventos aplicados
  useEffect(() => {
    const fetchMyApplications = async () => {
      try {
        const response = await api.get("/ue.myrequests");
        if (response && response.data && response.data.data) {
          const eventosAplicados = response.data.data.map(
            (evento: any) => evento.EVENT_ID
          );
          setAplicadosEventos(eventosAplicados); // Guardamos los eventos a los que se ha aplicado
        } else {
          console.error("No se ha podido obtener los eventos aplicados.");
        }
      } catch (error) {
        console.error("Error al obtener los eventos aplicados:", error);
      }
    };

    fetchMyApplications();
  }, []);

  // Obtener mis eventos (eventos creados por el usuario)
  useEffect(() => {
    const fetchMyEvents = async () => {
      try {
        const response = await api.get("/ue.ad/my-events");
        const misEventosData = response.data.data.active;
        const misEventosIds = misEventosData.map(
          (evento: any) => evento.EVENT_ID
        );
        setEventosOrganizadosIds(misEventosIds);
      } catch (error) {
        console.error("Error al obtener mis eventos:", error);
      }
    };

    fetchMyEvents();
  }, []);

  // Obtener eventos a los que el usuario ha asistido
  useEffect(() => {
    const fetchAssistedEvents = async () => {
      try {
        const response = await api.get("/ue.us/my-events");
        if (response && response.data && response.data.data) {
          const eventosAsistidos = response.data.data;
          setEventosAsistidos(eventosAsistidos);
        } else {
          console.error("No se han encontrado eventos asistidos.");
        }
      } catch (error) {
        console.error("Error al obtener eventos asistidos:", error);
      }
    };

    fetchAssistedEvents();
  }, []);

  // Obtener los eventos del feed
  useEffect(() => {
    if (seccionActiva === "Feed") {
      const fetchEvents = async () => {
        try {
          const response = await api.get("/e");
          if (response && response.data) {
            const eventosData = response.data.data.events;
            const eventosNoPropios = eventosData.filter(
              (evento: any) => !eventosOrganizadosIds.includes(evento.EVENT_ID)
            );

            // Filtrar eventos no aplicados (es decir, aquellos a los que no se ha enviado solicitud)
            const eventosNoAplicados = eventosNoPropios.filter(
              (evento: any) => !aplicadosEventos.includes(evento.EVENT_ID)
            );

            setEventos(eventosNoAplicados); // Solo los eventos no aplicados
            const eventosPropios = eventosData.filter((evento: any) =>
              eventosOrganizadosIds.includes(evento.EVENT_ID)
            );
            setMisEventos(eventosPropios);
          } else {
            console.error("Error: La respuesta de la API no contiene eventos.");
          }
        } catch (error) {
          console.error("Error al obtener los eventos:", error);
        }
      };

      fetchEvents();
    }
  }, [seccionActiva, eventosOrganizadosIds, aplicadosEventos]);

  // Filtrar los eventos asistidos y solicitados para no mostrar los que son propiedad del usuario
  const misEventosFiltrados = misEventos.filter(
    (evento) => !eventosOrganizadosIds.includes(evento.EVENT_ID)
  );

  const eventosAsistidosFiltrados = eventosAsistidos.filter(
    (evento) => !eventosOrganizadosIds.includes(evento.EVENT_ID)
  );

  return (
    <div className="flex w-full h-screen font-KhandMedium bg-mainClassMatch pt-28 pb-20 p-16">
      <div className="w-1/6 bg-backgroundClassMatch p-8 rounded-l-xl flex flex-col justify-start">
        <h2 className="text-6xl font-KhandBold mb-6 text-headClassMatch">
          Eventos
        </h2>
        <ul className="space-y-4">
          {[
            "Feed",
            "Mis eventos",
            "Gestión de eventos",
            "Creación de eventos",
          ].map((item) => (
            <li
              key={item}
              className={`font-KhandSemiBold text-black cursor-pointer p-2 rounded text-xl 
                ${seccionActiva === item ? "bg-gray-200 " : ""} 
                ${
                  item === "Creación de eventos" ||
                  item === "Gestión de eventos"
                    ? seccionActiva === item
                      ? "bg-cyan-700 text-white"
                      : "bg-buttonClassMatch text-white"
                    : ""
                }`}
              onClick={() => setSeccionActiva(item)}
            >
              {item}
            </li>
          ))}
        </ul>
      </div>

      <div className="w-5/6 bg-accentClassMatch p-6 rounded-r-xl shadow-md flex flex-col">
        <h2 className="text-3xl font-KhandBold mb-6">{seccionActiva}</h2>

        {/* Sección de Creación de Eventos */}
        {seccionActiva === "Creación de eventos" && (
          <div className="h-full overflow-y-auto">
            <CreateEventCard />
          </div>
        )}

        {/* Sección de Mis Eventos */}
        {seccionActiva === "Mis eventos" && (
          <div className="overflow-x-auto">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {/* Mostrar eventos a los que el usuario ha asistido */}
              {eventosAsistidosFiltrados.length > 0 && (
                <div>
                  <h3 className="text-2xl font-KhandSemiBold mb-4">
                    Eventos Asistidos
                  </h3>
                  {eventosAsistidosFiltrados.map((evento) => (
                    <MyEventCard key={evento.EVENT_ID} event={evento} />
                  ))}
                </div>
              )}

              {/* Mostrar eventos a los que el usuario ha solicitado asistir */}
              {misEventosFiltrados.length > 0 && (
                <div>
                  <h3 className="text-2xl font-KhandSemiBold mb-4">
                    Mis Solicitudes
                  </h3>
                  {misEventosFiltrados.map((evento) => (
                    <MyEventCard key={evento.EVENT_ID} event={evento} />
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* Sección de Feed */}
        {seccionActiva === "Feed" && (
          <div className="overflow-x-auto">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mr-2">
              {eventos.map((evento) => (
                <EventCard key={evento.EVENT_ID} event={evento} />
              ))}
            </div>
          </div>
        )}

        {/* Sección de Gestión de Eventos */}
        {seccionActiva === "Gestión de eventos" && (
          <div className="overflow-y-auto">
            <div className="flex flex-col space-y-4">
              {misEventos.map((evento) => (
                <OwnedEventCard key={evento.EVENT_ID} event={evento} />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
