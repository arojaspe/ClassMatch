import { useState } from "react";
import axios from "axios";
import api from "../api/axiosConfig"; // Importa axios o la configuración de la API que estés usando

export default function CreateEventCard() {
  const [titulo, setTitulo] = useState("");
  const [descripcion, setDescripcion] = useState("");
  const [capacidad, setCapacidad] = useState(1); // Definir valor inicial como 1
  const [ubicacion, setUbicacion] = useState("");
  const [fecha, setFecha] = useState("");
  const [tipoEvento, setTipoEvento] = useState("Abierto"); // "Abierto" como valor por defecto
  const [fotos, setFotos] = useState<File[]>([]); // Para manejar las fotos subidas
  const [showPopup, setShowPopup] = useState(false); // Para controlar la visibilidad del popup
  const [eventoId, setEventoId] = useState<string | null>(null); // Para almacenar el id del evento creado

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Crear el objeto con los datos del formulario (sin fotos)
    const eventData = {
      title: titulo,
      description: descripcion,
      date: fecha,
      location: ubicacion,
      capacity: capacidad,
      lock: tipoEvento === "Cerrado", // "lock" será true si es "Cerrado", de lo contrario será false
    };

    try {
      // Realizar la solicitud POST para crear el evento
      const response = await api.post("/e", eventData);

      if (response.status === 200) {
        // Si el evento se crea correctamente, obtener el id del evento
        setEventoId(response.data.data.event[1]);

        // Subir las fotos después de crear el evento
        if (fotos.length > 0 && eventoId) {
          await handleImageUpload(response.data.data.event[1]);
        }

        setShowPopup(true);

        // Limpiar el formulario
        setTitulo("");
        setDescripcion("");
        setCapacidad(1);
        setUbicacion("");
        setFecha("");
        setTipoEvento("Abierto");
        setFotos([]);
      }
    } catch (error) {
      console.error("Error al crear el evento:", error);
      alert("Hubo un problema al crear el evento.");
    }
  };

  // Función para subir las fotos
  const handleImageUpload = async (eventoId: string) => {
    try {
      for (let i = 0; i < fotos.length; i++) {
        const formData = new FormData();
        formData.append("images", fotos[i]);
        formData.append("relation", eventoId); // El id del evento
        formData.append("type", "EVENT"); // Tipo es "EVENT"

        const response = await axios.post("/upload", formData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });

        if (response.status === 200) {
          console.log(`Foto ${i + 1} subida con éxito.`);
        } else {
          console.error(`Error al subir la foto ${i + 1}.`);
          //alert(`Hubo un problema al subir la foto ${i + 1}.`);
        }
      }
      //alert("Todas las fotos fueron subidas con éxito.");
    } catch (error) {
      console.error("Error al subir las fotos:", error);
      //alert("Hubo un problema al subir las fotos.");
    }
  };

  // Obtener la fecha actual en formato YYYY-MM-DD (para el campo de tipo date)
  const currentDate = new Date().toISOString().slice(0, 10); // Formato: "YYYY-MM-DD"

  // Función para manejar la subida de fotos
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length + fotos.length <= 8) {
      setFotos((prevFotos) => [...prevFotos, ...files]);
    } else {
      alert("No puedes subir más de 8 fotos.");
    }
  };

  // Función para eliminar una foto
  const handleRemovePhoto = (index: number) => {
    setFotos((prevFotos) => prevFotos.filter((_, i) => i !== index));
  };

  // Función para cerrar el popup
  const handleClosePopup = () => {
    setShowPopup(false); // Cierra el popup
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-lg max-w-full mr-2">
      <h3 className="text-2xl font-bold mb-6">Crear un nuevo evento</h3>
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label className="block text-lg font-semibold" htmlFor="titulo">
            Título
          </label>
          <input
            type="text"
            id="titulo"
            value={titulo}
            onChange={(e) => setTitulo(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded mt-2"
            required
          />
        </div>

        <div className="mb-4">
          <label className="block text-lg font-semibold" htmlFor="descripcion">
            Descripción
          </label>
          <textarea
            id="descripcion"
            value={descripcion}
            onChange={(e) => setDescripcion(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded mt-2"
            rows={4}
            required
          />
        </div>

        <div className="mb-4">
          <label className="block text-lg font-semibold" htmlFor="capacidad">
            Capacidad (1-8)
          </label>
          <input
            type="number"
            id="capacidad"
            value={capacidad}
            onChange={(e) =>
              setCapacidad(Math.min(8, Math.max(1, parseInt(e.target.value))))
            } // Limita entre 1 y 8
            className="w-full p-2 border border-gray-300 rounded mt-2"
            min="1"
            max="8"
            required
          />
        </div>

        <div className="mb-4">
          <label className="block text-lg font-semibold" htmlFor="ubicacion">
            Ubicación
          </label>
          <input
            type="text"
            id="ubicacion"
            value={ubicacion}
            onChange={(e) => setUbicacion(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded mt-2"
            required
          />
        </div>

        <div className="mb-4">
          <label className="block text-lg font-semibold" htmlFor="fecha">
            Fecha
          </label>
          <input
            type="date"
            id="fecha"
            value={fecha}
            onChange={(e) => setFecha(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded mt-2"
            min={currentDate} // Asegura que la fecha no pueda ser pasada
            required
          />
        </div>

        <div className="mb-4">
          <label className="block text-lg font-semibold" htmlFor="tipoEvento">
            Tipo de evento
          </label>
          <select
            id="tipoEvento"
            value={tipoEvento}
            onChange={(e) => setTipoEvento(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded mt-2"
          >
            <option value="Abierto">Abierto</option>
            <option value="Cerrado">Cerrado</option>
          </select>
        </div>

        {/* Sección para subir fotos */}
        <div className="mb-4">
          <label className="block text-lg font-semibold" htmlFor="fotos">
            Fotos (máximo 8)
          </label>
          <input
            type="file"
            id="fotos"
            accept="image/*"
            multiple
            onChange={handleFileChange}
            className="w-full p-2 border border-gray-300 rounded mt-2"
          />
          <div className="mt-4">
            {fotos.length > 0 && (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                {fotos.map((foto, index) => (
                  <div key={index} className="relative">
                    <img
                      src={URL.createObjectURL(foto)}
                      alt={`Foto ${index + 1}`}
                      className="w-full h-32 object-cover rounded"
                    />
                    <button
                      type="button"
                      onClick={() => handleRemovePhoto(index)}
                      className="absolute top-1 right-1 bg-red-500 text-white p-1 rounded-full"
                    >
                      X
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="flex justify-center">
          <button
            type="submit"
            className="w-1/5 bg-headClassMatch text-white py-2 rounded mt-4 hover:bg-blue-700"
          >
            Crear Evento
          </button>
        </div>
      </form>

      {/* Popup de éxito */}
      {showPopup && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg max-w-sm w-full text-center">
            <h3 className="text-2xl font-bold mb-4">Evento creado con éxito</h3>
            <button
              onClick={handleClosePopup}
              className="w-full bg-green-500 text-white py-2 rounded hover:bg-green-700"
            >
              Aceptar
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
