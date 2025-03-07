import { useEffect, useState } from "react";
import UserCard from "../components/UserCard";
//import { usuarios } from "../data/usuarios";
import axios from "axios";
import { UsuarioClassmatch } from "../types";
import { motion, AnimatePresence } from "framer-motion";

export default function Busqueda() {
  const [usuarios, setUsuarios] = useState<UsuarioClassmatch[]>([]);
  const [direction, setDirection] = useState<"left" | "right">("right");
  const [userInterests, setUserInterests] = useState<string[]>();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isMatchModalOpen, setIsMatchModalOpen] = useState(false);
  const [reportReason, setReportReason] = useState("");

  useEffect(() => {
    axios
      .get("/us")
      .then((response) => {
        setUsuarios(response.data.data);
        console.log("Los usuarios son", response.data.data);
        console.log(response.data.data[1].matches);
      })
      .catch((error) => {
        console.error("Error fetching personas:", error);
        window.location.reload();
      });
  }, []);
  // Estado para rastrear el índice actual del usuario
  const [currentIndex, setCurrentIndex] = useState(0);

  // Usuario actual basado en el índice
  const currentUser = usuarios[currentIndex]?.user;
  const currentMatch = usuarios[currentIndex]?.matches;
  const currentCommonSchedule = usuarios[currentIndex]?.commonSchedule;
  const currentId = currentUser?.USER_ID;

  //console.log("El usuario actual es ", currentUser);

  useEffect(() => {
    axios
      .get("/ui/" + currentId)
      .then((response) => {
        console.log("Los intereses del usuario son", response.data.data.data);
        setUserInterests(response.data.data.data);
      })
      .catch((error) => {
        console.error("Error fetching intereses del usuario logueado", error);
      });
  }, [currentUser, currentId]);

  // Función para avanzar al siguiente usuario
  const handleNext = () => {
    setDirection("right");
    setCurrentIndex((prevIndex) => (prevIndex + 1) % usuarios.length);
  };

  // Función para retroceder al usuario anterior
  const handlePrevious = () => {
    setDirection("left");
    setCurrentIndex((prevIndex) =>
      prevIndex === 0 ? usuarios.length - 1 : prevIndex - 1
    );
  };

  const variants = {
    enter: (direction: "left" | "right") => ({
      x: direction === "right" ? 50 : -50, // Movimiento inicial más sutil
      opacity: 0,
    }),
    center: {
      x: 0,
      opacity: 1,
      transition: { type: "spring", stiffness: 120, damping: 20 }, // Suavidad
    },
    exit: (direction: "left" | "right") => ({
      x: direction === "right" ? -50 : 50, // Sale en la dirección opuesta
      opacity: 0,
    }),
  };

  const handleReportButtonClick = (
    event: React.MouseEvent<HTMLButtonElement>
  ) => {
    event.preventDefault();

    axios
      .post("/r", { reportedUserId: currentId, reason: reportReason })
      .then(() => {
        alert("Usuario reportado con éxito");
        setIsModalOpen(false);
        setReportReason("");
      })
      .catch((error) => {
        console.error("Error al reportar al usuario:", error);
      });
  };

  const handleMatchButtonClick = (
    event: React.MouseEvent<HTMLButtonElement>
  ) => {
    event.preventDefault();

    axios
      .post("/m", { other_user: currentId, supermatch: false })
      .then(() => {
        alert("Match realizado con éxito");
      })
      .catch((error) => {
        console.error("Error al hacer match con el usuario:", error);
      });
  };

  const handleSuperMatchButtonClick = (
    event: React.MouseEvent<HTMLButtonElement>
  ) => {
    event.preventDefault();

    axios
      .post("/m", { other_user: currentId, supermatch: true })
      .then(() => {
        alert("SuperMatch realizado con éxito");
      })
      .catch((error) => {
        console.error("Error al hacer supermatch con el usuario:", error);
      });
  };

  return (
    <div className="h-screen pt-[9%] bg-mainClassMatch flex justify-center max-sm:h-auto">
      <div className="flex flex-col h-[85%] w-[90%] items-center bg-backgroundClassMatch rounded-lg max-sm:mt-20 mb-32">
        <aside className="w-full bg-accentClassMatch rounded-t-lg justify-between h-[10%] flex items-center px-4">
          <h1 className="text-black text-2xl font-KhandMedium">
            ¡Veamos qué personas puedes encontrar en ClassMatch!
          </h1>
          <button
            className="bg-buttonClassMatch place-self-center w-[12rem] hover:bg-headClassMatch text-white font-KhandRegular text-base font-semibold px-6 py-2 rounded-md"
            onClick={() => setIsModalOpen(true)}
          >
            Reportar
          </button>
          {isModalOpen && (
            <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
              <div className="bg-white p-6 rounded-lg w-[30%] max-sm:w-[50%]">
                <h2 className="text-xl font-KhandSemiBold mb-4">
                  Reportar al Usuario {currentUser.USER_FIRSTNAME}{" "}
                  {currentUser.USER_LASTNAME}
                </h2>
                <textarea
                  className="w-full p-2 border rounded-md font-KhandMedium"
                  rows={4}
                  placeholder="Escribe la razón del reporte..."
                  value={reportReason}
                  onChange={(e) => setReportReason(e.target.value)}
                />
                <div className="flex justify-end mt-4">
                  <button
                    className="bg-gray-300 hover:bg-gray-400 text-black font-semibold px-4 py-2 rounded-md mr-2"
                    onClick={() => {
                      setIsModalOpen(false);
                      setReportReason("");
                    }}
                  >
                    Cancelar
                  </button>
                  <button
                    className="bg-buttonClassMatch hover:bg-headClassMatch text-white font-semibold px-4 py-2 rounded-md"
                    onClick={handleReportButtonClick}
                  >
                    Enviar
                  </button>
                </div>
              </div>
            </div>
          )}
        </aside>
        <div
          id="slider de usuarios"
          className="h-[90%] w-full flex justify-between items-center "
        >
          <button
            className="bg-mainClassMatch bg-opacity-20 w-[5%] text-white h-[70%] rounded-r-lg hover:bg-opacity-30"
            onClick={handlePrevious}
          ></button>

          <AnimatePresence custom={direction} mode="wait">
            <motion.div
              key={currentIndex} // Clave única para re-renderizar animación
              custom={direction}
              variants={variants}
              initial="enter"
              animate="center"
              exit="exit"
              className="w-[100%] h-[100%] flex flex-col justify-center items-center"
            >
              <UserCard
                user={currentUser}
                matches={currentMatch}
                commonSchedule={currentCommonSchedule}
                userInterests={userInterests}
              />
              <button
                className="bg-buttonClassMatch hover:bg-gradient-to-r hover:from-premiumButtonClassMatch hover:via-teal-600 hover:to-cyan-600 place-self-center w-[8rem]  text-white font-KhandRegular text-base font-semibold px-6 py-2 rounded-md mt-4 transition duration-2000"
                onClick={() => {
                  setIsMatchModalOpen(true);
                }}
              >
                Match
              </button>
              {isMatchModalOpen && (
                <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
                  <div className="bg-white p-6 rounded-lg w-[15%] max-sm:w-[50%]">
                    <div className="flex justify-center space-x-4">
                      <button
                        className="bg-gray-300 hover:bg-gray-400 text-black font-semibold px-4 py-2 rounded-md mr-2"
                        onClick={(event) => {
                          handleMatchButtonClick(event);
                          setIsMatchModalOpen(false);
                        }}
                      >
                        Match
                      </button>
                      <button
                        className="bg-gradient-to-r from-premiumButtonClassMatch via-teal-600 to-cyan-600 text-white font-semibold px-4 py-2 rounded-md"
                        onClick={(event) => {
                          handleSuperMatchButtonClick(event);
                          setIsMatchModalOpen(false);
                        }}
                      >
                        SuperMatch
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </motion.div>
          </AnimatePresence>

          <button
            className="bg-mainClassMatch bg-opacity-20 w-[5%] text-white h-[70%] rounded-l-lg hover:bg-opacity-30"
            onClick={handleNext}
          ></button>
        </div>
      </div>
    </div>
  );

  // return (
  //   <>
  //     <div className="h-screen pt-[9%] bg-mainClassMatch flex justify-center">
  //       <div className="flex flex-col h-[85%] w-[90%] items-center bg-backgroundClassMatch rounded-lg">
  //         <aside className="w-full bg-accentClassMatch rounded-t-lg justify-self-start h-[3.5rem] flex items-center px-4">
  //           <h1 className="text-black text-2xl font-KhandMedium">
  //             ¡Veamos qué personas puedes encontrar en ClassMatch!
  //           </h1>
  //         </aside>
  //         <div className="h-full w-full flex justify-between items-center">
  //           <button
  //             className="bg-mainClassMatch bg-opacity-20 w-[5%] text-white h-[70%] rounded-r-lg hover:bg-opacity-30"
  //             onClick={handlePrevious}
  //           ></button>
  //           <UserCard {...currentUser} matches={currentMatch} />
  //           <button
  //             className="bg-mainClassMatch bg-opacity-20 w-[5%] text-white h-[70%] rounded-l-lg hover:bg-opacity-30"
  //             onClick={handleNext}
  //           ></button>
  //         </div>
  //       </div>
  //     </div>
  //   </>
  // );
}
