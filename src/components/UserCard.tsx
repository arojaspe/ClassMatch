import { UsuarioClassmatch } from "../types";

type UserCardProps = UsuarioClassmatch;

export default function UserCard(props: UserCardProps) {
  const {
    USER_FIRSTNAME,
    USER_LASTNAME,
    USER_EMAIL,
    USER_GENDER,
    USER_BIRTHDATE,
    USER_BIO,
    USER_STATUS,
    USER_RATING,
    USER_FILTER_AGE,
    USER_SUPERMATCHES,
    USER_FILTER_GENDER,
  } = props;

  return (
    <>
      <div className=" bg-mainClassMatch bg-opacity-15 rounded-lg w-[80%] h-[75%] flex flex-col p-4 font-KhandRegular">
        <h2 className="text-lg font-bold mb-4">Información del Usuario</h2>
        <ul className="list-disc pl-5 space-y-2 leading-5">
          <li>
            <strong>Nombre:</strong> {USER_FIRSTNAME} {USER_LASTNAME}
          </li>
          <li>
            <strong>Email:</strong> {USER_EMAIL}
          </li>
          <li>
            <strong>Género:</strong> {USER_GENDER}
          </li>
          <li>
            <strong>Fecha de Nacimiento:</strong> {USER_BIRTHDATE}
          </li>
          <li>
            <strong>Biografía:</strong> {USER_BIO}
          </li>
          <li>
            <strong>Estado Activo:</strong> {USER_STATUS ? "Sí" : "No"}
          </li>
          <li>
            <strong>Calificación:</strong> {USER_RATING}
          </li>
          <li>
            <strong>Filtro de Edad:</strong> {USER_FILTER_AGE}
          </li>
          <li>
            <strong>Super Matches:</strong> {USER_SUPERMATCHES}
          </li>
          <li>
            <strong>Filtro de Género:</strong> {USER_FILTER_GENDER}
          </li>
        </ul>
      </div>
    </>
  );
}
