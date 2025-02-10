import { UsuarioClassmatch } from "../types";
import UserImageGallery from "./UserImageGallery";
import { useMemo } from "react";

type CommonSchedule = {
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
  matches?: number;
  commonSchedule?: CommonSchedule; // Define el tipo si lo tienes
};

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

export default function UserCard({
  user,
  matches,
  commonSchedule,
}: UserCardProps) {
  const age = useMemo(
    () => (user?.USER_BIRTHDATE ? calculateAge(user?.USER_BIRTHDATE) : null),
    [user?.USER_BIRTHDATE]
  );
  console.log(commonSchedule);

  return (
    <div className="bg-mainClassMatch bg-opacity-15 rounded-lg w-[80%] h-[85%] flex p-4 font-KhandRegular py-5">
      <div className="bg-cardClassMatch flex flex-col w-[25%] ml-9 rounded-lg">
        <UserImageGallery images={user?.USER_IMAGES ?? []} />
        <div className="w-[90%] h-[15%] p-4 font-KhandMedium text-xl">
          <p>Fecha de nacimiento: {user?.USER_BIRTHDATE}</p>
          <p>Edad: {age}</p>
          <p>Género: {user?.USER_GENDER}</p>
        </div>
      </div>
      <div className="flex flex-col w-[70%] mx-9 rounded-lg justify-between items-center">
        <div className="bg-cardClassMatch w-full flex flex-col h-[50%] rounded-lg p-5">
          <h3 className="text-2xl font-KhandBold text-headClassMatch">
            {user?.USER_FIRSTNAME} {user?.USER_LASTNAME}
          </h3>
          <section className="w-full mx-auto bg-white bg-opacity-70 h-[80%] rounded-xl font-KhandMedium p-2 leading-5">
            {user?.USER_BIO}
          </section>
        </div>
        <p className="text-lg font-KhandMedium text-headClassMatch">
          ¡Tú y {user?.USER_FIRSTNAME} coinciden en {matches} franjas horarias!
        </p>
        <div className="bg-cardClassMatch w-full h-[35%] rounded-lg">
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
                        className={`border-b border-l p-2 text-center transition duration-200 
      ${
        commonSchedule?.[dia as keyof CommonSchedule]?.[index]
          ? "bg-cyan-800 text-black font-bold"
          : "bg-red-200"
      }
      ${index % 2 === 0 ? "bg-gray-50" : "bg-white"}`}
                      >
                        {commonSchedule?.[dia as keyof CommonSchedule]?.[index]
                          ? "✓"
                          : ""}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
