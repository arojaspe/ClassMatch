import { UsuarioClassmatch } from "../types";
import UserImageGallery from "./UserImageGallery";
import { useMemo } from "react";

type UserCardProps = UsuarioClassmatch;

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

export default function UserCard({
  USER_FIRSTNAME,
  USER_LASTNAME,

  USER_GENDER,
  USER_BIRTHDATE,
  USER_BIO,

  USER_IMAGES,
  matches,
}: UserCardProps) {
  const age = useMemo(
    () => (USER_BIRTHDATE ? calculateAge(USER_BIRTHDATE) : null),
    [USER_BIRTHDATE]
  );

  return (
    <div className="bg-mainClassMatch bg-opacity-15 rounded-lg w-[80%] h-[85%] flex p-4 font-KhandRegular py-5">
      <div className="bg-cardClassMatch flex flex-col w-[25%] ml-9 rounded-lg">
        <UserImageGallery images={USER_IMAGES} />
        <div className="w-[90%] h-[15%] p-4 font-KhandMedium text-xl">
          <p>Fecha de nacimiento: {USER_BIRTHDATE}</p>
          <p>Edad: {age}</p>
          <p>Género: {USER_GENDER}</p>
        </div>
      </div>
      <div className="flex flex-col w-[70%] mx-9 rounded-lg justify-between items-center">
        <div className="bg-cardClassMatch w-full flex flex-col h-[50%] rounded-lg p-5">
          <h3 className="text-2xl font-KhandBold text-headClassMatch">
            {USER_FIRSTNAME} {USER_LASTNAME}
          </h3>
          <section className="w-full mx-auto bg-white bg-opacity-70 h-[80%] rounded-xl font-KhandMedium p-2 leading-5">
            {USER_BIO}
          </section>
        </div>
        <p className="text-lg font-KhandMedium text-headClassMatch">
          ¡Tú y {USER_FIRSTNAME} coinciden en {matches} franjas horarias!
        </p>
        <div className="bg-cardClassMatch w-full h-[35%] rounded-lg"></div>
      </div>
    </div>
  );
}
