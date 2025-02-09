import { useState } from "react";

export default function PersonalizarPerfil() {
  const [photo, setPhoto] = useState<File | null>(null); // Para manejar la foto
  const [university, setUniversity] = useState("");
  const [career, setCareer] = useState("");
  const [message, setMessage] = useState("");
  const [errors, setErrors] = useState({
    photo: false,
    university: false,
    career: false,
    interests: false,
    description: false,
    horario: false,
  });
  const [description, setDescription] = useState(""); // Para manejar la descripción

  const [selectedInterests, setSelectedInterests] = useState<string[]>([]); // Para manejar los intereses seleccionados

  const interests = {
    Arte: ["Pintura", "Música", "Literatura"],
    Deportes: ["Fútbol", "Basketball", "Ciclismo"],
  };

  const diasSemana = ["Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado", "Domingo"];
  const horas = Array.from({ length: 24 }, (_, index) => `${index}:00`);

  const [seleccionado, setSeleccionado] = useState<{ [key: string]: boolean[] }>(() => {
    const initialState: { [key: string]: boolean[] } = {};
    diasSemana.forEach((dia) => {
      initialState[dia] = Array(24).fill(false);
    });
    return initialState;
  });

  const handlePhotoChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files ? event.target.files[0] : null;

    if (file && file.type.startsWith("image/")) {
      setPhoto(file);
    } else {
      setPhoto(null);
      setMessage("Por favor, selecciona un archivo de imagen.");
    }
  };

  const handleUniversityChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setUniversity(event.target.value);
  };

  const handleCareerChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setCareer(event.target.value);
  };

  const handleDescriptionChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    setDescription(event.target.value);
  };

  const handleInterestClick = (interest: string) => {
    setSelectedInterests((prev) =>
      prev.includes(interest)
        ? prev.filter((item) => item !== interest) // Desmarcar si ya está seleccionado
        : [...prev, interest] // Marcar si no está seleccionado
    );
  };

  const handleSeleccionarHora = (dia: string, horaIndex: number) => {
    setSeleccionado((prev) => {
      const nuevoEstado = { ...prev };
      nuevoEstado[dia][horaIndex] = !prev[dia][horaIndex];
      return nuevoEstado;
    });
  };

  // Validación antes de guardar
  const handleSaveProfile = (event: { preventDefault: () => void }) => {
    event.preventDefault();

    // Validación de todos los campos
    const newErrors = {
      photo: !photo,
      university: !university,
      career: !career,
      interests: selectedInterests.length === 0,
      description: !description,
      horario: Object.values(seleccionado).flat().filter((hora) => hora).length < 3, // Contamos cuántas horas fueron seleccionadas
    };

    setErrors(newErrors);

    // Si hay algún error, mostramos un mensaje
    if (Object.values(newErrors).includes(true)) {
      setMessage("Por favor, llena todos los campos correctamente.");
      return;
    }

    // Si todo está bien, muestra un mensaje de éxito
    setMessage("Perfil actualizado con éxito.");
  };

  return (
    <main className="text-black bg-backgroundClassMatch">
      <div className="w-full pt-20 pb-14 ">
        <div className="w-full flex shadow-xl flex-col items-center bg-cardClassMatch rounded-2xl p-8 m-4 md:max-w-6xl md:mx-auto">
          <h2 className="font-KhandSemiBold text-7xl text-headClassMatch font-bold">
            Personalizar perfil
          </h2>
          <p className="w-full text-xl mt-4 font-KhandRegular">
            Vamos a personalizar tu perfil de ClassMatch para mejorar tu experiencia.
          </p>
          <form
            className="mb-4 mt-5 w-full flex flex-col"
            onSubmit={handleSaveProfile}
          >
            {/* Sección para subir una foto */}
            <h2 className="font-KhandSemiBold text-4xl text-black font-bold pb-3">
                Selecciona tu foto de perfil
            </h2>
            <div className="mb-6">
              <label
                htmlFor="photo"
                className="block text-xl font-KhandRegular mb-2"
              >
                Subir foto de perfil
              </label>
              <div
                className={`flex items-center justify-center w-full ${photo ? "h-72" : "h-32"} border-2 rounded-lg cursor-pointer ${
                  errors.photo ? "border-red-500" : "border-gray-300"
                } ${photo ? "border-none" : "border-dashed"}`}
                onClick={() => document.getElementById("photo")?.click()} // Activar clic manualmente
              >
                <input
                  type="file"
                  id="photo"
                  accept="image/*"
                  onChange={handlePhotoChange}
                  className="opacity-0 w-0 h-0"
                />
                {!photo ? (
                  <span className="font-KhandRegular text-lg text-gray-500">
                    Haz clic para cargar una imagen
                  </span>
                ) : (
                  <img
                    src={URL.createObjectURL(photo)}
                    alt="Vista previa"
                    className="h-full object-cover rounded-lg"
                  />
                )}
              </div>
              {errors.photo && <p className="text-red-500">Por favor, sube una foto.</p>}
            </div>

            {/* Sección para universidad */}
            <h2 className="font-KhandSemiBold text-4xl text-black font-bold pb-3">
                Selecciona tu universidad
            </h2>
            <div className="mb-6">
              <input
                className={`w-full border rounded font-KhandRegular text-lg p-2 outline-none focus:shadow-outline ${
                  errors.university ? "border-red-500" : ""
                }`}
                type="text"
                name="university"
                id="university"
                placeholder="Universidad"
                value={university}
                onChange={handleUniversityChange}
              />
              {errors.university && <p className="text-red-500">Por favor, ingresa tu universidad.</p>}
            </div>

            {/* Sección para carrera */}
            <div className="mb-6">
              <input
                className={`w-full border rounded font-KhandRegular text-lg p-2 outline-none focus:shadow-outline ${
                  errors.career ? "border-red-500" : ""
                }`}
                type="text"
                name="career"
                id="career"
                placeholder="Carrera"
                value={career}
                onChange={handleCareerChange}
              />
              {errors.career && <p className="text-red-500">Por favor, ingresa tu carrera.</p>}
            </div>

            {/* Sección de intereses */}
            <h2 className="font-KhandSemiBold text-4xl text-black font-bold pb-3">
                Selecciona tus intereses
            </h2>
            <div className="mb-6 w-full bg-gray-100 p-6 rounded-md">
              <label
                htmlFor="interests"
                className="block text-xl font-KhandRegular mb-2"
              >
                Elige tus intereses personales (mínimo uno).
              </label>
              <div className="space-y-6">
                {Object.keys(interests).map((category) => (
                  <div key={category}>
                    <h3 className="font-KhandSemiBold text-xl mb-2">{category}</h3>
                    <div className="flex flex-wrap gap-4">
                      {interests[category as keyof typeof interests].map((interest) => (
                        <button
                          key={interest}
                          type="button" // Cambié el tipo de button de enlace a solo button
                          className={`px-8 py-2 rounded-md text-lg font-KhandMedium transition ${
                            selectedInterests.includes(interest)
                              ? "bg-buttonClassMatch text-white"
                              : "bg-gray-200 text-black hover:bg-gray-300"
                          }`}
                          onClick={() => handleInterestClick(interest)}
                        >
                          {interest}
                        </button>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
              {errors.interests && <p className="text-red-500">Por favor, selecciona al menos un interés.</p>}
            </div>

            {/* Sección de descripción */}
            <h2 className="font-KhandSemiBold text-4xl text-black font-bold pb-3">
                Háblanos sobre ti
            </h2>
            <div className="mb-6">
              <label
                htmlFor="description"
                className="block text-xl font-KhandRegular mb-2"
              >
                Haz una breve descripción sobre ti, tus intereses o lo que quieras compartir con los demás.
              </label>
              <textarea
                id="description"
                className="w-full h-32 p-4 border rounded font-KhandRegular text-lg outline-none focus:shadow-outline"
                placeholder="Escribe algo sobre ti..."
                value={description}
                onChange={handleDescriptionChange}
              ></textarea>
              {errors.description && <p className="text-red-500">Por favor, agrega una descripción.</p>}
            </div>

            {/* Sección para seleccionar horarios */}
            <h2 className="font-KhandSemiBold text-4xl text-black font-bold">
                Selecciona tu horario semanal
            </h2>
            <p className="w-full text-xl mt-4 font-KhandRegular">
              Marca las horas disponibles de cada día, debes poner mínimo 3.
            </p>
            <div className="overflow-x-auto mt-6 w-full rounded-2xl mb-6">
              <table className="w-full table-auto border-collapse">
                <thead>
                  <tr>
                    <th className="border-b-4 border-t-4 p-3 text-xl font-semibold text-black bg-gray-100">Hora/Día</th>
                    {diasSemana.map((dia) => (
                      <th key={dia} className="border-b-4 border-t-4 p-3 text-xl font-semibold text-black bg-gray-100">{dia}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {horas.map((hora, index) => (
                    <tr key={index}>
                      <td className="border-b p-2 text-lg font-medium bg-gray-50 text-black text-center">{hora}</td>
                      {diasSemana.map((dia) => (
                        <td
                          key={dia}
                          className={`border-b border-l p-2 cursor-pointer transition duration-200 ease-in-out
                            ${seleccionado[dia][index] ? "bg-cyan-800 text-white text-center" : "bg-gray-200 hover:bg-gray-300"} 
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
            {errors.horario && <p className="text-red-500">Por favor, selecciona al menos 3 horas.</p>}

            {/* Botón de guardar */}
            <button
              className="bg-buttonClassMatch place-self-center w-[7rem] hover:bg-headClassMatch text-white font-KhandRegular text-base font-semibold px-6 py-2 rounded-md"
              type="submit"
            >
              Guardar
            </button>
          </form>

          {/* Mensajes de error o éxito */}
          {message && (
            <p className="text-center mt-4 font-KhandRegular text-red-900">
              {message}
            </p>
          )}
        </div>
      </div>
    </main>
  );
}
