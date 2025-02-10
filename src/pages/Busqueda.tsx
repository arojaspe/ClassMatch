import { useEffect, useState } from "react";
import UserCard from "../components/UserCard";
//import { usuarios } from "../data/usuarios";
import axios from "axios";
import { UsuarioClassmatch } from "../types";
import { motion, AnimatePresence } from "framer-motion";

export default function Busqueda() {
  const [usuarios, setUsuarios] = useState<UsuarioClassmatch[]>([]);
  const [direction, setDirection] = useState<"left" | "right">("right");

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

  console.log(currentUser);

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

  return (
    <div className="h-screen pt-[9%] bg-mainClassMatch flex justify-center">
      <div className="flex flex-col h-[85%] w-[90%] items-center bg-backgroundClassMatch rounded-lg">
        <aside className="w-full bg-accentClassMatch rounded-t-lg justify-self-start h-[3.5rem] flex items-center px-4">
          <h1 className="text-black text-2xl font-KhandMedium">
            ¡Veamos qué personas puedes encontrar en ClassMatch!
          </h1>
        </aside>
        <div className="h-full w-full flex justify-between items-center ">
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
              className="w-[100%] h-[100%] flex justify-center items-center"
            >
              <UserCard
                user={currentUser}
                matches={currentMatch}
                commonSchedule={currentCommonSchedule}
              />
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
