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
    USER_IMAGES,
  } = props;

  return (
    <>
      <div className=" bg-mainClassMatch bg-opacity-15 rounded-lg w-[80%] h-[85%] flex p-4 font-KhandRegular py-5">
        <div className="bg-cardClassMatch flex w-[25%] ml-9 rounded-lg">
          {/* tarjeta foto y datos */}
          <div className="image-gallery">
            {USER_IMAGES?.map((image, index) => (
              <img
                key={index}
                src={`${image.IMAGE_LINK}?random=${Math.random()}`}
                alt={`Imagen ${index + 1} de ${USER_FIRSTNAME}`}
                className="user-image"
              />
            ))}
          </div>
        </div>
        <div className="flex flex-col w-[70%] mx-9 rounded-lg justify-between items-center">
          {/* tarjeta nombre y descripción */}
          <div className="bg-cardClassMatch w-full flex flex-col h-[50%] rounded-lg p-5">
            <h3 className="text-2xl font-KhandBold text-headClassMatch">
              {USER_FIRSTNAME} {USER_LASTNAME}, {USER_GENDER}
            </h3>
            <section className="w-full mx-auto bg-white bg-opacity-70 h-[80%] rounded-xl font-KhandMedium p-2 leading-5">
              {USER_BIO}
            </section>
          </div>
          <p className="text-lg font-KhandMedium text-headClassMatch">
            ¡Tú y {USER_FIRSTNAME} coinciden en x franjas horarias!
          </p>
          <div className="bg-orange-300 w-full h-[35%] rounded-lg"></div>
        </div>
        {/* <h2 className="text-lg font-bold mb-4">Información del Usuario</h2>
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
        </ul> */}
      </div>
    </>
  );
}
