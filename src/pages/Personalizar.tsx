import { SetStateAction, useEffect, useState } from "react";
import axios from "axios";
import { Interest, ScheduleType } from "../types";

export default function PersonalizarPerfil() {
  const [currentPage, setCurrentPage] = useState(0);
  const [photo, setPhoto] = useState<File | null>(null); // Para manejar la foto
  const [interests, setInterests] = useState<Interest[]>([]);
  const [description, setDescription] = useState(""); // Para manejar la descripción
  const [filterAge, setFilterAge] = useState("");
  const [filterGender, setFilterGender] = useState("");
  const [idUsuario, setIdUsuario] = useState("");
  const [selectedInterests, setSelectedInterests] = useState<string[]>([]); // Para manejar los intereses seleccionados

  useEffect(() => {
    axios
      .get("/auth")
      .then((response) => {
        console.log("Los datos del usuario son", response.data.data);
        //setUsuario(response.data.data);
        setIdUsuario(response.data.data.USER_ID);
      })
      .catch((error) => {
        console.error("Error fetching usuario logueado:", error);
      });
  }, []);

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

  const diasSemana: (keyof ScheduleType)[] = [
    "MONDAY",
    "TUESDAY",
    "WEDNESDAY",
    "THURSDAY",
    "FRIDAY",
    "SATURDAY",
    "SUNDAY",
  ];
  const horas = Array.from({ length: 24 }, (_, index) => `${index}:00`);

  const handlePhotoChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files ? event.target.files[0] : null;

    if (file && file.type.startsWith("image/")) {
      setPhoto(file);
    } else {
      setPhoto(null);
      alert("Por favor, sube una imagen.");
    }
  };

  const handleImageButtonClick = (
    event: React.MouseEvent<HTMLButtonElement>
  ) => {
    event.preventDefault();
    if (!photo) {
      alert("Por favor, selecciona una imagen.");
      return;
    }

    const formData = new FormData();
    formData.append("images", photo);
    formData.append("relation", idUsuario);
    formData.append("type", "USER");

    axios
      .post("/upload", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      })
      .then((response) => {
        if (response.status === 200) {
          alert("Foto de perfil actualizada con éxito");
        } else {
          alert("Hubo un problema al subir la foto. Inténtalo de nuevo.");
        }
      })
      .catch((error) => {
        console.error("Error al actualizar la foto:", error);
        alert("Hubo un problema al subir la foto. Inténtalo de nuevo.");
      });
  };

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

  const handleInterestButtonClick = (
    event: React.MouseEvent<HTMLButtonElement>
  ) => {
    event.preventDefault();
    if (selectedInterests.length === 0) {
      alert("Por favor, selecciona al menos un interés.");
    }
    console.log("Formateado", selectedInterests);
    axios
      .put("/ui", selectedInterests)
      .then(() => {
        alert("Intereses actualizados con éxito:");
        setSelectedInterests([]);
      })
      .catch((error) => {
        console.error("Error al actualizar intereses:", error);
      });
  };

  const handleDescriptionButtonClick = (
    event: React.MouseEvent<HTMLButtonElement>
  ) => {
    event.preventDefault();
    if (!description.trim()) {
      alert("Por favor, ingresa una descripción.");
      return;
    }
    axios
      .put("/u", { bio: description })
      .then(() => {
        alert("Descripción actualizada con éxito");
        setDescription("");
      })
      .catch((error) => {
        console.error("Error al actualizar la descripción:", error);
      });
  };

  const handleFilterAgeButtonClick = (
    event: React.MouseEvent<HTMLButtonElement>
  ) => {
    event.preventDefault();
    if (
      !filterAge.includes("-") ||
      filterAge.split("-").some((age) => !age.trim())
    ) {
      alert("Por favor, ingresa un rango de edad válido.");
    }
    console.log("El filtro de edad es", filterAge);
    axios
      .put("/u", { filter_age: filterAge })
      .then(() => {
        alert("Filtro de edad actualizado con éxito");
        setFilterAge("");
      })
      .catch((error) => {
        console.error("Error al actualizar el filtro de edad:", error);
      });
  };

  const handleFilterGenderButtonClick = (
    event: React.MouseEvent<HTMLButtonElement>
  ) => {
    event.preventDefault();
    if (!filterGender) {
      alert("Por favor, selecciona un filtro de género.");
    }
    console.log("El filtro de género es", filterGender);
    axios
      .put("/u", { filter_gender: filterGender })
      .then(() => {
        alert("Filtro de género actualizado con éxito");
        setFilterGender("");
      })
      .catch((error) => {
        console.error("Error al actualizar el filtro de género:", error);
      });
  };

  const handleScheduleButtonClick = (
    event: React.MouseEvent<HTMLButtonElement>
  ) => {
    event.preventDefault();
    const selectedHours = Object.values(selectedSchedule)
      .flat()
      .filter(Boolean).length;
    if (selectedHours < 3) {
      alert("Por favor, selecciona al menos 3 horas.");
    }
    console.log("El horario seleccionado es", selectedSchedule);
    axios
      .put("/sch/" + idUsuario, selectedSchedule)
      .then(() => {
        alert("Horario actualizado correctamente");
        setSelectedSchedule(
          diasSemana.reduce<ScheduleType>(
            (acc, dia) => ({ ...acc, [dia]: Array(24).fill(false) }),
            {} as ScheduleType
          )
        );
      })
      .catch((error) => {
        console.error("Error al actualizar el horario:", error);
      });
  };

  // const handleImageButtonClick = () => {
  //   if (!photo) {
  //     alert("Por favor, selecciona una imagen.");
  //   }
  //   axios
  //     .post("/upload", photo)
  //     .then(() => {
  //       alert("Foto de perfil actualizada con éxito");
  //     })
  //     .catch((error) => {
  //       console.error("Error al actualizar el horario:", error);
  //     });
  // };

  const [selectedSchedule, setSelectedSchedule] = useState<ScheduleType>(
    diasSemana.reduce<ScheduleType>(
      (acc, dia) => ({ ...acc, [dia]: Array(24).fill(false) }),
      {} as ScheduleType
    )
  );

  const toggleCell = (dia: keyof ScheduleType, horaIndex: number) => {
    setSelectedSchedule((prev) => ({
      ...prev,
      [dia]: prev[dia].map((val, index) => (index === horaIndex ? !val : val)),
    }));
  };

  // Validación antes de guardar

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
          <form className="mb-4 mt-5 w-full flex flex-col">
            {/* Sección para subir una foto */}
            <h2 className="font-KhandSemiBold text-4xl text-black font-bold pb-3">
              Agrega una foto a tu perfil
            </h2>
            <div className="mb-6">
              <label
                htmlFor="photo"
                className="block text-xl font-KhandRegular mb-2"
              >
                Sube una foto aquí
              </label>
              <div
                className={`flex items-center justify-center w-full ${
                  photo ? "h-72" : "h-32"
                } border-2 rounded-lg cursor-pointer `}
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
            </div>
            <button
              className="bg-buttonClassMatch mb-5 place-self-center w-[12rem] hover:bg-headClassMatch text-white font-KhandRegular text-base font-semibold px-6 py-2 rounded-md"
              onClick={(event) => handleImageButtonClick(event)}
            >
              Guardar foto
            </button>

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
                onClick={(event) => handleInterestButtonClick(event)}
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
              onClick={(event) => handleDescriptionButtonClick(event)}
            >
              Guardar descripción
            </button>

            <h2 className="font-KhandSemiBold text-4xl text-black font-bold mt-2">
              Selecciona los filtros de búsqueda, edad y género
            </h2>
            <label
              htmlFor="description"
              className="block text-xl font-KhandRegular mb-2"
            >
              Selecciona la edad mínima y máxima de tus matches, así como el
              género que prefieres.
            </label>
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
                onClick={(event) => handleFilterAgeButtonClick(event)}
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
                onClick={(event) => handleFilterGenderButtonClick(event)}
              >
                Guardar filtro de género
              </button>
            </div>

            {/* Sección para seleccionar horarios */}
            <h2 className="font-KhandSemiBold text-4xl text-black font-bold">
              Selecciona tu horario semanal
            </h2>
            <div className="flex">
              <p className="w-full text-xl mt-4 font-KhandRegular">
                Marca las horas disponibles de cada día, debes poner mínimo 3.
              </p>
              <button
                className="bg-buttonClassMatch w-[15rem] hover:bg-headClassMatch text-white font-KhandRegular text-base font-semibold px-6 py-2 rounded-md"
                onClick={(event) => handleScheduleButtonClick(event)}
              >
                Guardar horario
              </button>
            </div>

            <div className="overflow-x-auto mt-6 w-full rounded-2xl mb-6">
              <table className="w-full table-auto border">
                <thead>
                  <tr>
                    <th className="p-3 text-base font-semibold bg-gray-200">
                      Hora/Día
                    </th>
                    {diasSemana.map((dia) => (
                      <th
                        key={dia}
                        className="p-3 text-base font-semibold bg-gray-200"
                      >
                        {dia}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {horas.map((hora, index) => (
                    <tr key={index}>
                      <td className="p-2 text-center bg-gray-100 border">
                        {hora} - {index === 23 ? "0:00" : `${index + 1}:00`}
                      </td>
                      {diasSemana.map((dia) => (
                        <td
                          key={`${dia}-${index}`}
                          className={`border text-center cursor-pointer transition-all duration-200 
                  ${
                    selectedSchedule[dia][index]
                      ? "bg-premiumButtonClassMatch text-white text-base font-bold"
                      : "bg-backgroundClassMatch"
                  }`}
                          onClick={() => toggleCell(dia, index)}
                        >
                          {selectedSchedule[dia][index] ? "" : ""}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Botón de guardar */}
          </form>
        </div>
      </div>
    </main>
  );
}
