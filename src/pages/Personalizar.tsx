import { SetStateAction, useEffect, useState } from "react";
import axios from "axios";
import { Interest } from "../types";

export default function PersonalizarPerfil() {
  const [currentPage, setCurrentPage] = useState(0);
  //const [photo, setPhoto] = useState<File | null>(null); // Para manejar la foto

  const [message, setMessage] = useState("");
  const [interests, setInterests] = useState<Interest[]>([]);
  const [errors, setErrors] = useState({
    //photo: false,

    interests: false,
    description: false,
    horario: false,
  });
  const [description, setDescription] = useState(""); // Para manejar la descripción
  const [filterAge, setFilterAge] = useState("");
  const [filterGender, setFilterGender] = useState("");

  const [selectedInterests, setSelectedInterests] = useState<string[]>([]); // Para manejar los intereses seleccionados

  useEffect(() => {
    axios
      .get("/i")
      .then((response) => {
        console.log("Los intereses que existen son", response.data.data.data);
        // const interestsArray = response.data.data.data.map(
        //   (interest: { INTEREST_NAME: string }) => interest.INTEREST_NAME
        // );
        // setInterests(interestsArray);
        setInterests(response.data.data.data);
      })
      .catch((error) => {
        console.error("Error fetching intereses:", error);
      });
  }, []);
  // const interests = {
  //   Arte: ["Pintura", "Música", "Literatura"],
  //   Deportes: ["Fútbol", "Basketball", "Ciclismo"],
  // };

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

  // const handlePhotoChange = (event: React.ChangeEvent<HTMLInputElement>) => {
  //   const file = event.target.files ? event.target.files[0] : null;

  //   if (file && file.type.startsWith("image/")) {
  //     setPhoto(file);
  //   } else {
  //     setPhoto(null);
  //     setMessage("Por favor, selecciona un archivo de imagen.");
  //   }
  // };

  const handleDescriptionChange = (
    event: React.ChangeEvent<HTMLTextAreaElement>
  ) => {
    setDescription(event.target.value);
  };

  const handleFilterAgeChange = (event: {
    target: { value: SetStateAction<string> };
  }) => setFilterAge(event.target.value);
  const handleFilterGenderChange = (event: {
    target: { value: SetStateAction<string> };
  }) => setFilterGender(event.target.value);

  const handleInterestClick = (interest: Interest) => {
    setSelectedInterests((prev) => {
      if (prev.includes(interest.INTEREST_ID)) {
        return prev.filter((id) => id !== interest.INTEREST_ID); // Desmarcar si ya está seleccionado
      } else if (prev.length < 8) {
        return [...prev, interest.INTEREST_ID]; // Marcar si no está seleccionado y hay menos de 8
      } else {
        return prev; // No hacer nada si ya hay 8 seleccionados
      }
    });
    console.log("Los intereses seleccionados son", selectedInterests);
  };

  const handleInterestButtonClick = () => {
    console.log("Formateado", selectedInterests);
    axios
      .put("/ui", selectedInterests)
      .then(() => {
        setMessage("Intereses guardados correctamente");
        alert("Intereses actualizados con éxito:");
        setSelectedInterests([]);
      })
      .catch((error) => {
        console.error("Error azl actualizar intereses:", error);
      });
  };

  const handleDescriptionButtonClick = () => {
    axios
      .put("/u", { bio: description })
      .then(() => {
        setMessage("Descripción guardada correctamente");
        alert("Descripción actualizada con éxito");
        setDescription("");
      })
      .catch((error) => {
        console.error("Error al actualizar la descripción:", error);
      });
  };

  const handleFilterAgeButtonClick = () => {
    console.log("El filtro de edad es", filterAge);
    axios
      .put("/u", { filter_age: filterAge })
      .then(() => {
        setMessage("Filtro de edad guardado correctamente");
        alert("Filtro de edad actualizado con éxito");
        setFilterAge("");
      })
      .catch((error) => {
        console.error("Error al actualizar el filtro de edad:", error);
      });
  };

  const handleFilterGenderButtonClick = () => {
    console.log("El filtro de género es", filterGender);
    axios
      .put("/u", { filter_gender: filterGender })
      .then(() => {
        setMessage("Filtro de género guardado correctamente");
        alert("Filtro de género actualizado con éxito");
        setFilterGender("");
      })
      .catch((error) => {
        console.error("Error al actualizar el filtro de género:", error);
      });
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
      //photo: !photo,

      interests: selectedInterests.length === 0 || selectedInterests.length > 8,
      description: !description,
      horario:
        Object.values(seleccionado)
          .flat()
          .filter((hora) => hora).length < 3, // Contamos cuántas horas fueron seleccionadas
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
            Vamos a personalizar tu perfil de ClassMatch para mejorar tu
            experiencia.
          </p>
          <form
            className="mb-4 mt-5 w-full flex flex-col"
            onSubmit={handleSaveProfile}
          >
            {/* Sección para subir una foto */}
            {/* <h2 className="font-KhandSemiBold text-4xl text-black font-bold pb-3">
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
                className={`flex items-center justify-center w-full ${
                  photo ? "h-72" : "h-32"
                } border-2 rounded-lg cursor-pointer ${
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
              {errors.photo && (
                <p className="text-red-500">Por favor, sube una foto.</p>
              )}
            </div> */}

            {/* Sección para universidad */}

            {/* Sección para carrera */}

            {/* Sección de intereses */}
            <h2 className="font-KhandSemiBold text-4xl text-black font-bold pb-3">
              Selecciona tus intereses
            </h2>
            <div className="mb-6 w-full bg-gray-100 p-6 rounded-md">
              <label
                htmlFor="interests"
                className="block text-xl font-KhandRegular mb-2"
              >
                Elige tus intereses personales (máximo 8).
              </label>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
                {interests
                  .slice(currentPage * 20, (currentPage + 1) * 20)
                  .map((interest) => (
                    <button
                      key={interest.INTEREST_ID}
                      type="button"
                      className={`h-16 text-nowrap text-center rounded-md text-lg font-KhandMedium transition ${
                        selectedInterests.includes(interest.INTEREST_ID)
                          ? "bg-buttonClassMatch text-white"
                          : "bg-gray-200 text-black hover:bg-gray-300"
                      }`}
                      onClick={() => handleInterestClick(interest)}
                    >
                      {interest.INTEREST_NAME}
                    </button>
                  ))}
              </div>
              {errors.interests && (
                <p className="text-red-500">
                  Por favor, selecciona al menos un interés.
                </p>
              )}
              <div className="flex justify-center mt-4 space-x-2">
                {Array.from({ length: Math.ceil(interests.length / 20) }).map(
                  (_, index) => (
                    <button
                      key={index}
                      type="button"
                      className={`w-8 h-8 rounded-full ${
                        currentPage === index
                          ? "bg-buttonClassMatch text-white"
                          : "bg-gray-300"
                      }`}
                      onClick={() => setCurrentPage(index)}
                    >
                      {index + 1}
                    </button>
                  )
                )}
              </div>
            </div>
            <div className="flex flex-col items-center justify-center space-x-4 space-y-3">
              <button
                className="bg-buttonClassMatch mb-5 place-self-center w-[12rem] hover:bg-headClassMatch text-white font-KhandRegular text-base font-semibold px-6 py-2 rounded-md"
                onClick={() => handleInterestButtonClick()}
              >
                Guardar intereses
              </button>
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
                Haz una breve descripción sobre ti, tus intereses o lo que
                quieras compartir con los demás.
              </label>
              <textarea
                id="description"
                className="w-full h-32 p-4 border rounded font-KhandRegular text-lg outline-none focus:shadow-outline"
                placeholder="Escribe algo sobre ti..."
                value={description}
                onChange={handleDescriptionChange}
              ></textarea>
            </div>
            <button
              className="bg-buttonClassMatch mb-5 place-self-center w-[12rem] hover:bg-headClassMatch text-white font-KhandRegular text-base font-semibold px-6 py-2 rounded-md"
              onClick={() => handleDescriptionButtonClick()}
            >
              Guardar descripción
            </button>

            <div className="mb-6 flex items-center space-x-2">
              <input
                className="w-full border rounded font-KhandRegular text-lg p-2 outline-none focus:shadow-outline"
                type="number"
                name="filterAgeMin"
                id="filterAgeMin"
                placeholder="Edad mínima"
                value={filterAge.split("-")[0]}
                onChange={(e) =>
                  handleFilterAgeChange({
                    target: {
                      value: `${e.target.value}-${filterAge.split("-")[1]}`,
                    },
                  })
                }
              />
              <input
                className="w-full border rounded font-KhandRegular text-lg p-2 outline-none focus:shadow-outline"
                type="number"
                name="filterAgeMax"
                id="filterAgeMax"
                placeholder="Edad máxima"
                value={filterAge.split("-")[1]}
                onChange={(e) =>
                  handleFilterAgeChange({
                    target: {
                      value: `${filterAge.split("-")[0]}-${e.target.value}`,
                    },
                  })
                }
              />
              <button
                className="bg-buttonClassMatch w-[23rem] hover:bg-headClassMatch text-white font-KhandRegular text-base font-semibold px-6 py-2 rounded-md"
                onClick={() => handleFilterAgeButtonClick()}
              >
                Guardar filtro de edad
              </button>
            </div>
            <div className="mb-6 flex items-center space-x-2 ">
              <select
                className="w-full border rounded font-KhandRegular text-lg p-2 outline-none focus:shadow-outline"
                name="filtergender"
                id="filtergender"
                value={filterGender}
                onChange={handleFilterGenderChange}
              >
                <option value="" disabled>
                  Filtro de género
                </option>
                <option value="M">Masculino</option>
                <option value="F">Femenino</option>
                <option value="NB">No binario</option>
              </select>

              <button
                className="bg-buttonClassMatch w-[15rem] hover:bg-headClassMatch text-white font-KhandRegular text-base font-semibold px-6 py-2 rounded-md"
                onClick={() => handleFilterGenderButtonClick()}
              >
                Guardar filtro de género
              </button>
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
            {errors.horario && (
              <p className="text-red-500">
                Por favor, selecciona al menos 3 horas.
              </p>
            )}

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
