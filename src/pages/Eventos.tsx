import { useEffect, useState } from "react";
import api from "../api/axiosConfig"; // Importa la configuración de axios
import EventCard from "../components/EventCard"; // Importamos el componente EventCard

export default function Eventos() {
  const [eventos, setEventos] = useState<any[]>([]); // Estado para almacenar los eventos
  const [seccionActiva, setSeccionActiva] = useState("Feed"); // Estado para la sección activa

  // Usamos useEffect para hacer la solicitud cuando el componente se monte
  useEffect(() => {
    // Función para obtener los eventos
    const fetchEvents = async () => {
      try {
        const response = await api.get("/e"); // Solicita los eventos a la API
        setEventos(response.data.data.events); // Almacena los eventos en el estado
      } catch (error) {
        console.error("Error al obtener los eventos:", error);
      }
    };
    fetchEvents(); 

    // Hacer la petición para obtener las solicitudes
    const fetchMyApplications = async () => {
      try {
        const response = await api.get("/ue.ad/my-events"); // Solicita las solicitudes del usuario
        console.log("Mis solicitudes:", response.data); // Imprime el resultado en la consola
      } catch (error) {
        console.error("Error al obtener mis solicitudes:", error);
      }
    };
    fetchMyApplications(); // Llamamos a la función para obtener las solicitudes
  }, []); // El array vacío asegura que solo se ejecute una vez, al montar el componente

  return (
    <div className="flex w-full h-screen bg-mainClassMatch pt-28 pb-20 p-16">
      {/* Menú lateral (ajustado a la parte superior) */}
      <div className="w-1/6 bg-backgroundClassMatch p-8 rounded-l-xl flex flex-col justify-start">
        <h2 className="text-6xl font-KhandBold mb-6 text-headClassMatch">Eventos</h2>
        <ul className="space-y-4">
          {["Feed", "Mis eventos", "Creación de eventos"].map((item) => (
            <li
              key={item}
              className={`font-KhandSemiBold text-black cursor-pointer p-2 rounded text-xl 
                ${seccionActiva === item ? "bg-gray-200" : ""}
                ${item === "Creación de eventos" ? (seccionActiva === item ? "bg-cyan-600 text-white" : "bg-buttonClassMatch text-white") : ""}
              `}
              onClick={() => setSeccionActiva(item)}
            >
              {item}
            </li>
          ))}
        </ul>
      </div>

      {/* Contenido principal */}
      <div className="w-5/6 bg-accentClassMatch p-6 rounded-r-xl shadow-md flex flex-col">
        <h2 className="text-3xl font-KhandBold mb-6">{seccionActiva}</h2>

        {/* Solo mostrar los eventos cuando la sección activa sea "Feed" */}
        {seccionActiva === "Feed" && (
          <div className="overflow-x-auto">
            {/* Contenedor de eventos en grilla */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {eventos.map((evento) => (
                <EventCard key={evento.id} event={evento} />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
