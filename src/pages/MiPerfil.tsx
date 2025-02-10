import { useState } from "react";

export default function MiPerfil() {
  return <div>MiPerfil</div>;
  const [editMode, setEditMode] = useState(false);
  const [nombre, setNombre] = useState("Thelma");
  const [carrera, setCarrera] = useState("Ingeniería de Sistemas");
  const [seccionActiva, setSeccionActiva] = useState("Cuenta");
  const [selectedInterests, setSelectedInterests] = useState<string[]>([
    "Pintura",
    "Fútbol",
  ]);

  const [soporteMensaje, setSoporteMensaje] = useState("");

  const interests = {
    Arte: ["Pintura", "Música", "Literatura"],
    Deportes: ["Fútbol", "Basketball", "Ciclismo"],
  };

  const diasSemana = [
    "Lunes",
    "Martes",
    "Miércoles",
    "Jueves",
    "Viernes",
    "Sábado",
    "Domingo",
  ];
  const horas = Array.from({ length: 24 }, (_, index) => `${index}:00`);

  const [seleccionado, setSeleccionado] = useState<{
    [key: string]: boolean[];
  }>(() => {
    const initialState: { [key: string]: boolean[] } = {};
    diasSemana.forEach((dia) => {
      initialState[dia] = Array(24).fill(false);
    });
    return initialState;
  });

  const handleSeleccionarHora = (dia: string, horaIndex: number) => {
    setSeleccionado((prev) => {
      const nuevoEstado = { ...prev };
      nuevoEstado[dia][horaIndex] = !prev[dia][horaIndex];
      return nuevoEstado;
    });
  };

  const handleModify = () => {
    if (editMode) {
      console.log("Guardando cambios:", { nombre, carrera });
    }
    setEditMode(!editMode);
  };

  const handleInterestClick = (interest: string) => {
    setSelectedInterests((prev) =>
      prev.includes(interest)
        ? prev.filter((item) => item !== interest)
        : [...prev, interest]
    );
  };

  return (
    <div className="flex w-full h-screen bg-mainClassMatch pt-28 pb-20 p-16">
      {/* Menú lateral */}
      <div className="w-1/3 bg-gray-300 p-8 rounded-l-xl flex flex-col justify-center">
        <h2 className="text-3xl font-KhandBold mb-6 text-headClassMatch">
          Configuración
        </h2>
        <ul className="space-y-4">
          {["Cuenta", "Intereses", "Horario", "Soporte"].map((item) => (
            <li
              key={item}
              className={`font-KhandSemiBold text-black cursor-pointer p-2 rounded text-xl ${
                seccionActiva === item ? "bg-gray-400" : ""
              }`}
              onClick={() => setSeccionActiva(item)}
            >
              {item}
            </li>
          ))}
        </ul>
      </div>

      {/* Contenido principal */}
      <div className="w-2/3 bg-white p-6 rounded-r-xl shadow-md flex flex-col justify-center">
        {seccionActiva === "Cuenta" && (
          <>
            <h2 className="text-2xl font-KhandBold mb-6">Cuenta</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-gray-700 font-KhandRegular">
                  Correo institucional
                </label>
                <input
                  type="text"
                  value="thelma@unal.edu.co"
                  disabled
                  className="w-full p-2 border rounded bg-gray-200 font-KhandRegular"
                />
              </div>
              <div>
                <label className="block text-gray-700 font-KhandRegular">
                  Universidad
                </label>
                <input
                  type="text"
                  value="Universidad Nacional"
                  disabled
                  className="w-full p-2 border rounded bg-gray-200 font-KhandRegular"
                />
              </div>
              <div>
                <label className="block text-gray-700 font-KhandRegular">
                  Programa curricular
                </label>
                <input
                  type="text"
                  value={carrera}
                  onChange={(e) => setCarrera(e.target.value)}
                  disabled={!editMode}
                  className={`w-full p-2 border rounded ${
                    editMode
                      ? "bg-white font-KhandRegular"
                      : "bg-gray-200 font-KhandRegular"
                  }`}
                />
              </div>
              <div>
                <label className="block text-gray-700 font-KhandRegular">
                  Nombre
                </label>
                <input
                  type="text"
                  value={nombre}
                  onChange={(e) => setNombre(e.target.value)}
                  disabled={!editMode}
                  className={`w-full p-2 border rounded ${
                    editMode
                      ? "bg-white font-KhandRegular"
                      : "bg-gray-200 font-KhandRegular"
                  }`}
                />
              </div>
            </div>
            <button
              onClick={handleModify}
              className="mt-4 px-4 py-2 bg-blue-600 text-white font-semibold rounded hover:bg-blue-700 font-KhandRegular flex ml-auto"
            >
              {editMode ? "Confirmar" : "Modificar"}
            </button>
            <div className="mt-6 flex space-x-4 justify-center">
              <button className="px-4 py-2 bg-gray-800 text-white font-semibold rounded hover:bg-gray-900 font-KhandRegular">
                Cambiar contraseña
              </button>
              <button className="px-4 py-2 bg-red-600 text-white font-semibold rounded hover:bg-red-700 font-KhandRegular">
                Eliminar cuenta
              </button>
            </div>
          </>
        )}
        {seccionActiva === "Intereses" && (
          <div className="mb-6 w-full bg-gray-100 p-6 rounded-md">
            <h2 className="text-2xl font-KhandBold mb-6">Intereses</h2>
            <label className="block text-xl font-KhandRegular mb-2">
              Elige tus intereses personales (mínimo uno).
            </label>
            <div className="space-y-6">
              {Object.keys(interests).map((category) => (
                <div key={category}>
                  <h3 className="font-KhandSemiBold text-xl mb-2">
                    {category}
                  </h3>
                  <div className="flex flex-wrap gap-4">
                    {interests[category as keyof typeof interests].map(
                      (interest) => (
                        <button
                          key={interest}
                          type="button"
                          className={`px-8 py-2 rounded-md text-lg font-KhandMedium transition ${
                            selectedInterests.includes(interest)
                              ? "bg-buttonClassMatch text-white"
                              : "bg-gray-200 text-black hover:bg-gray-300"
                          }`}
                          onClick={() => handleInterestClick(interest)}
                        >
                          {interest}
                        </button>
                      )
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
        {seccionActiva === "Horario" && (
          <div className="overflow-x-auto mt-6 w-full rounded-2xl mb-6">
            <table className="w-full table-auto border-collapse">
              <thead>
                <tr>
                  <th className="border-b-4 border-t-4 p-3 text-xl font-semibold text-black bg-gray-100">
                    Hora/Día
                  </th>
                  {diasSemana.map((dia) => (
                    <th
                      key={dia}
                      className="border-b-4 border-t-4 p-3 text-xl font-semibold text-black bg-gray-100"
                    >
                      {dia}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {horas.map((hora, index) => (
                  <tr key={index}>
                    <td className="border-b p-2 text-lg font-medium bg-gray-50 text-black text-center">
                      {hora}
                    </td>
                    {diasSemana.map((dia) => (
                      <td
                        key={dia}
                        className={`border-b border-l p-2 cursor-pointer transition duration-200 ease-in-out
                          ${
                            seleccionado[dia][index]
                              ? "bg-cyan-700 text-white text-center"
                              : "bg-gray-200 hover:bg-gray-300"
                          } 
                          ${index % 2 === 0 ? "bg-gray-50" : "bg-white"}`}
                        onClick={() => handleSeleccionarHora(dia, index)}
                      >
                        {seleccionado[dia][index] ? "✓" : ""}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
        {seccionActiva === "Soporte" && (
          <div className="space-y-4">
            <h3 className="text-xl font-KhandBold">Soporte</h3>
            <p className="text-gray-700 font-KhandRegular">
              Si tienes alguna inquietud, queja o comentario háznoslo saber y
              nos comunicaremos contigo.
            </p>
            <textarea
              className="w-full p-2 border rounded bg-gray-200 font-KhandRegular"
              value={soporteMensaje}
              onChange={(e) => setSoporteMensaje(e.target.value)}
              placeholder="Escribe tu mensaje aquí..."
            />
            <button className="px-4 py-2 bg-blue-600 text-white font-semibold rounded hover:bg-blue-700 font-KhandRegular">
              Enviar
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
