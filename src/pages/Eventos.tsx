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
  const [eventosAplicados, setEventosAplicados] = useState<any[]>([]); // Eventos con detalles completos de los aplicados
  const [seccionActiva, setSeccionActiva] = useState("Feed");
  const [eventosOrganizadosIds, setEventosOrganizadosIds] = useState<string[]>([]);
  const [loading, setLoading] = useState<boolean>(true); // Para manejar el estado de carga

  // Nuevo estado para el plan del usuario
  const [plan, setPlan] = useState<string>("");

  // Obtener eventos aplicados
  useEffect(() => {
    const fetchMyApplications = async () => {
      try {
        const response = await api.get("/ue/myrequests");
        if (response && response.data && response.data.data) {
          const eventosAplicados = response.data.data.map((evento: any) => evento.EVENTS.EVENT_ID);
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

  // Obtener los detalles completos de los eventos aplicados
  useEffect(() => {
    const fetchAppliedEvents = async () => {
      if (aplicadosEventos.length > 0) {
        try {
          // Obtenemos todos los eventos
          const eventosDetallesResponse = await api.get("/e");

          if (eventosDetallesResponse && eventosDetallesResponse.data && eventosDetallesResponse.data.data) {
            // Filtrar los eventos completos para que solo estén los eventos aplicados
            const eventosCompletos = eventosDetallesResponse.data.data.events.filter((evento: any) =>
              aplicadosEventos.includes(evento.EVENT_ID)
            );
            console.log(eventosCompletos);
            setEventosAplicados(eventosCompletos); // Actualizamos el estado con los eventos aplicados completos
          } else {
            console.error("No se encontraron detalles de los eventos.");
          }
        } catch (error) {
          console.error("Error al obtener eventos aplicados:", error);
        }
      }
    };

    fetchAppliedEvents();
  }, [aplicadosEventos]); // Este useEffect se ejecuta cuando los eventos aplicados cambian


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
          //console.log(response.data.data); // Verificar la estructura de los datos

          // Extraer los eventos activos
          const eventosActivos = response.data.data.active;
          const eventosIds = eventosActivos.map((evento: any) => evento.EVENTS.EVENT_ID); // Extraemos los EVENT_ID
          
          // Realizamos la consulta para obtener todos los eventos
          const eventosDetallesResponse = await api.get("/e");

          if (eventosDetallesResponse && eventosDetallesResponse.data && eventosDetallesResponse.data.data) {
            // Filtrar los eventos completos para que solo estén los eventos asistidos
            const eventosCompletos = eventosDetallesResponse.data.data.events.filter((evento: any) =>
              eventosIds.includes(evento.EVENT_ID)
            );

            setEventosAsistidos(eventosCompletos); // Actualizamos el estado con los eventos completos
          } else {
            console.error("No se encontraron detalles de los eventos.");
          }
        } else {
          console.error("No se han encontrado eventos asistidos.");
        }
      } catch (error) {
        console.error("Error al obtener eventos asistidos:", error);
      }
    };

    fetchAssistedEvents();
  }, []); // Este useEffect solo se ejecuta una vez

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
        finally {
          setLoading(false); // Finaliza la carga
        }
      };

      fetchEvents();
    }
  }, [seccionActiva, eventosOrganizadosIds, aplicadosEventos]);

  /* // Filtrar los eventos asistidos y solicitados para no mostrar los que son propiedad del usuario
  const misEventosFiltrados = misEventos.filter(
    (evento) => !eventosOrganizadosIds.includes(evento.EVENT_ID)
  );

  console.log('Asistidos');
  console.log(eventosAsistidos);
  console.log('Mis');
  console.log(misEventos);
  const eventosAsistidosFiltrados = eventosAsistidos.filter(
    (evento) => !eventosOrganizadosIds.includes(evento.EVENT_ID)
  );
 */

   // Consultar el plan del usuario (Premium o no)
   useEffect(() => {
    const fetchPlan = async () => {
      try {
        const response = await api.get("/plan");
        console.log("El plan del usuario es", response.data.data);
        setPlan(response.data.data); // Guardamos el plan en el estado
      } catch (error) {
        console.error("Error al obtener el plan del usuario:", error);
      }
    };

    fetchPlan();
  }, []);

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
                ${item === "Creación de eventos" || item === "Gestión de eventos" 
                  ? (seccionActiva === item && plan === "Premium" ? "bg-cyan-700 text-white" : "bg-buttonClassMatch text-white") 
                  : ""}`}
              onClick={() => {
                if (plan === "Premium" || item !== "Gestión de eventos" && item !== "Creación de eventos") {
                  setSeccionActiva(item);
                }
              }}
              style={{
                pointerEvents: (plan !== "Premium" && (item === "Gestión de eventos" || item === "Creación de eventos")) ? 'none' : 'auto', 
                opacity: (plan !== "Premium" && (item === "Gestión de eventos" || item === "Creación de eventos")) ? 0.5 : 1
              }}
            >
              {item}
            </li>
          ))}
        </ul>
      </div>

      <div className="w-5/6 bg-accentClassMatch p-6 rounded-r-xl shadow-md flex flex-col">
        <h2 className="text-3xl font-KhandBold mb-6">{seccionActiva}</h2>

        {/* Sección de Creación de Eventos */}
        {seccionActiva === "Creación de eventos" && plan === "Premium" && (
          <div className="h-full overflow-y-auto">
            <CreateEventCard />
          </div>
        )}

        {/* Sección de Mis Eventos */}
        {seccionActiva === "Mis eventos" && (
          <div className="overflow-x-auto">
            <div className="space-y-6">
              {/* Sección de Eventos Asistidos */}
              <div className="flex flex-col">
                <h3 className="text-2xl font-KhandSemiBold mb-4">Eventos Asistidos</h3>
                {eventosAsistidos.length > 0 && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {eventosAsistidos.map((evento) => (
                      <MyEventCard key={evento.EVENT_ID} event={evento} aceptado={true}/>
                    ))}
                  </div>
                )}
              </div>

              {/* Sección de Mis Solicitudes */}
              <div className="flex flex-col">
                <h3 className="text-2xl font-KhandSemiBold mb-4">Mis Solicitudes</h3>
                {eventosAplicados.length > 0 && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {eventosAplicados.map((evento) => (
                      <MyEventCard key={evento.EVENT_ID} event={evento} aceptado={false}/>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Sección de Feed */}
        {seccionActiva === "Feed" ? (
          loading ? (
            <div> Cargando eventos... </div>
          ) : (
            <div className="overflow-x-auto">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mr-2">
                {eventos.map((evento) => (
                  <EventCard key={evento.EVENT_ID} event={evento} />
                ))}
              </div>
            </div>
          )
        ) : null}

        {/* Sección de Gestión de Eventos */}
        {seccionActiva === "Gestión de eventos" && plan === "Premium" && (
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