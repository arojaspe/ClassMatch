import { UserImage, UsuarioClassmatch } from "../types";
import UserImageGallery from "./UserImageGallery";
import { useMemo } from "react";
import { useState } from "react";

type UserSchedule = {
  MONDAY: boolean[];
  TUESDAY: boolean[];
  WEDNESDAY: boolean[];
  THURSDAY: boolean[];
  FRIDAY: boolean[];
  SATURDAY: boolean[];
  SUNDAY: boolean[];
};
type UserCardProps = {
  user?: UsuarioClassmatch; // Define el tipo de usuario si lo tienes
  userSchedule?: UserSchedule; // Define el tipo si lo tienes
  userInterests?: string[];
  userImages?: UserImage[];
};

const diasSemana = [
  "MONDAY",
  "TUESDAY",
  "WEDNESDAY",
  "THURSDAY",
  "FRIDAY",
  "SATURDAY",
  "SUNDAY",
];
const horas = Array.from({ length: 24 }, (_, i) => `${i}:00`); // Genera ["0:00", "1:00", ..., "23:00"]

const calculateAge = (birthdate: string) => {
  const birthDate = new Date(birthdate);
  const today = new Date();
  let age = today.getFullYear() - birthDate.getFullYear();
  const monthDifference = today.getMonth() - birthDate.getMonth();
  if (
    monthDifference < 0 ||
    (monthDifference === 0 && today.getDate() < birthDate.getDate())
  ) {
    age--;
  }
  return age;
};

export default function UserProfileCard({
  user,
  userSchedule,
  userInterests = [],
  userImages,
}: UserCardProps) {
  const age = useMemo(
    () => (user?.USER_BIRTHDATE ? calculateAge(user?.USER_BIRTHDATE) : null),
    [user?.USER_BIRTHDATE]
  );

  console.log("imagenes de usuario desde userProfileCard", userImages);

  const [showSchedule, setShowSchedule] = useState(false);

  const handleScheduleButtonClick = () => {
    setShowSchedule(true);
    console.log("click en ver horario");
  };

  return (
    <div className="bg-backgroundClassMatch rounded-lg h-full flex font-KhandRegular py-5 flex-col sm:flex-row max-sm:w-[]">
  {/* Información de Usuario (Menú lateral en pantallas grandes y superior en pequeñas) */}
  <div className="bg-cardClassMatch flex flex-col w-full sm:w-[25%] ml-9 rounded-lg items-center shadow-lg overflow-hidden max-sm:w-[80%]">
    <UserImageGallery images={userImages ?? []} />
    <div className="w-[90%] p-4 font-KhandMedium text-lg text-center font-semibold">
      <p className="text-headClassMatch ">{user?.USER_BIRTHDATE}</p>
      <p className="text-buttonClassMatch ">Edad: {age}</p>
      <p className="text-headClassMatch">
        Género:{" "}
        {user?.USER_GENDER === "M"
          ? "Masculino"
          : user?.USER_GENDER === "F"
          ? "Femenino"
          : user?.USER_GENDER === "NB"
          ? "No binario"
          : "No especificado"}
      </p>
    </div>
  </div>

  {/* Contenido Principal (Ajuste responsivo para pantallas pequeñas) */}
  <div className="flex flex-col w-full sm:w-[65%] mx-9 rounded-lg justify-between items-center max-sm:w-[80%] mt-5">
    {showSchedule ? (
      <>
        <div className="bg-cardClassMatch pb-2 w-full sm:w-[95%] flex justify-between items-center h-[12%] rounded-lg p-5">
          <h3 className="text-2xl font-KhandBold text-headClassMatch">
            {user?.USER_FIRSTNAME} {user?.USER_LASTNAME}
          </h3>
          <a
            onClick={() => setShowSchedule(false)}
            className="cursor-pointer font-KhandBold text-buttonClassMatch"
          >
            <span>Ver información</span>
          </a>
        </div>

        <div className="overflow-x-auto w-full sm:w-[95%] py-2">
          <table className="w-full table-auto">
            <thead>
              <tr>
                <th className="p-3 text-base font-semibold text-black bg-cardClassMatch">
                  Hora/Día
                </th>
                {diasSemana.map((dia) => (
                  <th
                    key={dia}
                    className="p-3 text-base font-semibold text-black bg-cardClassMatch"
                  >
                    {dia}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {horas.map((hora, index) => (
                <tr key={index}>
                  <td className="p-0 text-base font-medium bg-backgroundClassMatch text-black text-center">
                    {hora} a{" "}
                    {hora.split(":")[0] === "23"
                      ? "0:00"
                      : `${+hora.split(":")[0] + 1}:00`}
                  </td>
                  {diasSemana.map((dia) => (
                    <td
                      key={dia}
                      className={`border-l text-center
                      ${
                        userSchedule?.[dia as keyof UserSchedule]?.[index]
                          ? "bg-premiumButtonClassMatch text-white text-base font-bold"
                          : "bg-backgroundClassMatch"
                      }
                      ${index % 2 === 0 ? "bg-gray-50" : "bg-backgroundClassMatch"}`}
                    >
                      {userSchedule?.[dia as keyof UserSchedule]?.[index] ? (
                        ""
                      ) : (
                        ""
                      )}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </>
    ) : (
      <div className="w-full flex flex-col items-center justify-center h-full">
        <div className="bg-cardClassMatch mx-auto w-[95%] flex flex-col h-[50%] rounded-lg p-5 mb-2 shadow-lg">
          <h3 className="text-2xl mb-2 font-KhandBold text-headClassMatch">
            {user?.USER_FIRSTNAME} {user?.USER_LASTNAME}
          </h3>

          <section className="w-[95%] mx-auto bg-white bg-opacity-70 h-[80%] rounded-xl font-KhandMedium p-2 leading-5">
            {user?.USER_BIO}
          </section>
        </div>
        <p className="text-xl font-KhandMedium text-headClassMatch mb-2">
          Mira tu horario{" "}
          <a onClick={handleScheduleButtonClick} className="cursor-pointer">
            <span className="text-premiumButtonClassMatch">aquí</span>:
          </a>
        </p>
        <div
          id="Sección de intereses"
          className="bg-cardClassMatch mx-auto w-[95%] h-[40%] rounded-lg shadow-lg p-5"
        >
          <h3 className="text-2xl font-KhandBold text-headClassMatch">
            Intereses
          </h3>
          <div className="h-[80%] grid grid-cols-4 grid-rows-2 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {userInterests.map((interest) => (
              <div
                key={interest}
                className="flex items-center justify-center rounded-md text-sm font-KhandMedium transition bg-gray-200 text-black hover:bg-gray-300
                sm:text-xs md:text-sm lg:text-sm xl:text-sm 2xl:text-lg"
              >
                {interest}
              </div>
            ))}
          </div>
        </div>
      </div>
    )}
  </div>
</div>

  );
}
