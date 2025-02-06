import { useEffect, useState } from "react";
import UserCard from "../components/UserCard";
//import { usuarios } from "../data/usuarios";
import axios from "axios";
import { UsuarioClassmatch } from "../types";

export default function Busqueda() {
  const [usuarios, setUsuarios] = useState<UsuarioClassmatch[]>([]);

  useEffect(() => {
    axios
      .get("/us")
      .then((response) => {
        setUsuarios(response.data.data);
        console.log(response.data.data);
      })
      .catch((error) => {
        console.error("Error fetching personas:", error);
        window.location.reload();
      });
  }, []);
  // Estado para rastrear el índice actual del usuario
  const [currentIndex, setCurrentIndex] = useState(0);

  // Usuario actual basado en el índice
  const currentUser = usuarios[currentIndex];
  console.log(currentUser);

  // Función para avanzar al siguiente usuario
  const handleNext = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % usuarios.length);
  };

  // Función para retroceder al usuario anterior
  const handlePrevious = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === 0 ? usuarios.length - 1 : prevIndex - 1
    );
  };

  return (
    <>
      <div className="h-screen pt-[9%] bg-mainClassMatch flex justify-center">
        <div className="flex flex-col h-[85%] w-[90%] items-center bg-backgroundClassMatch rounded-lg">
          <aside className="w-full bg-accentClassMatch rounded-t-lg justify-self-start h-[3.5rem] flex items-center px-4">
            <h1 className="text-black text-2xl font-KhandMedium">
              ¡Veamos qué personas puedes encontrar en ClassMatch!
            </h1>
          </aside>
          <div className="h-full w-full flex justify-between items-center">
            <button
              className="bg-mainClassMatch bg-opacity-20 w-[5%] text-white h-[70%] rounded-r-lg hover:bg-opacity-30"
              onClick={handlePrevious}
            ></button>
            <UserCard {...currentUser} />
            <button
              className="bg-mainClassMatch bg-opacity-20 w-[5%] text-white h-[70%] rounded-l-lg hover:bg-opacity-30"
              onClick={handleNext}
            ></button>
          </div>
        </div>
      </div>
    </>
  );
}
