import { useEffect, useState } from "react";
import axios from "axios";
import { UserImage, UsuarioClassmatch } from "../types";
import UserProfileCard from "../components/UserProfileCard";

type UserSchedule = {
  MONDAY: boolean[];
  TUESDAY: boolean[];
  WEDNESDAY: boolean[];
  THURSDAY: boolean[];
  FRIDAY: boolean[];
  SATURDAY: boolean[];
  SUNDAY: boolean[];
};

export default function MiPerfil() {
  const [userSchedule, setUserSchedule] = useState<UserSchedule>();
  const [seccionActiva, setSeccionActiva] = useState("Cuenta");
  const [userInterests, setUserInterests] = useState<string[]>();
  const [userImages, setUserImages] = useState<UserImage[]>();
  const [usuario, setUsuario] = useState<UsuarioClassmatch>();
  const [idUsuario, setIdUsuario] = useState("");

  const [soporteMensaje, setSoporteMensaje] = useState("");

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
      .get("/sch/" + idUsuario)
      .then((response) => {
        console.log("El horario del usuario es", response.data.data);
        setUserSchedule(response.data.data);
      })
      .catch((error) => {
        console.error("Error fetching el horario usuario logueado:", error);
      });
  }, [idUsuario]);

  useEffect(() => {
    axios
      .get("/ui/" + idUsuario)
      .then((response) => {
        console.log("Los intereses del usuario son", response.data.data.data);
        setUserInterests(response.data.data.data);
      })
      .catch((error) => {
        console.error("Error fetching intereses del usuario logueado", error);
      });
  }, [idUsuario]);

  useEffect(() => {
    axios
      .get("/u/" + idUsuario)
      .then((response) => {
        console.log(
          "Las imágenes del usuario son",
          response.data.data.USER_IMAGES
        );
        setUserImages(response.data.data.USER_IMAGES);
      })
      .catch((error) => {
        console.error("Error fetching imagenes del usuario logueado", error);
      });
  }, [idUsuario]);

  useEffect(() => {
    axios
      .get("/u/" + idUsuario)
      .then((response) => {
        console.log("los datos del usuario logueado son", response.data.data);
        setUsuario(response.data.data);
      })
      .catch((error) => {
        console.error("Error fetching los datos del usuario logueado", error);
      });
  }, [idUsuario]);

  // const currentMatch = usuario?.[0]?.matches;
  // const currentCommonSchedule = usuario?.[0]?.commonSchedule;

  return (
    <div className="flex w-full h-screen bg-mainClassMatch pt-28 pb-20 p-16">
      {/* Menú lateral */}
      <div className="w-1/4 bg-backgroundClassMatch p-8 rounded-l-xl flex flex-col justify-center">
        <h2 className="text-3xl font-KhandBold mb-6 text-headClassMatch">
          Configuración
        </h2>
        <ul className="space-y-4">
          {["Cuenta", "Soporte"].map((item) => (
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
      <div className="w-3/4 bg-accentClassMatch p-6 rounded-r-xl shadow-md flex flex-col justify-center">
        {seccionActiva === "Cuenta" && (
          <>
            <div className="flex w-full items-center justify-between mb-3">
              <h2 className="text-3xl font-KhandBold px-3">Perfil</h2>
              <button>
                <a
                  className="bg-buttonClassMatch text-white font-KhandMedium text-lg p-2 rounded-lg hover:bg-buttonClassMatch"
                  href="/personalizar"
                >
                  Personalizar perfil
                </a>
              </button>
            </div>

            <div className="h-[80%]">
              <UserProfileCard
                user={usuario}
                userSchedule={userSchedule}
                userInterests={userInterests}
                userImages={userImages}
              />
            </div>
          </>
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
