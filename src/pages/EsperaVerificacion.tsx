import { Link } from "react-router-dom";

export default function EsperaVerificacion() {
  return (
    <main className="w-full font-KhandMedium text-xl min-h-screen text-headClassMatch bg-backgroundClassMatch flex items-center justify-center">
      <div className="w-full max-w-xl p-4">
        <div className="w-full flex shadow-xl flex-col items-center bg-cardClassMatch rounded-2xl p-8 m-4">
          <h1 className="text-2xl text-headClassMatch font-KhandBold mb-4 text-center">
            ¡Gracias por registrarte!
          </h1>
          <p className="text-xl text-center text-headClassMatch font-KhandRegular">
            Hemos enviado un correo de verificación a tu correo electrónico.{" "}
            <br /> Por favor, verifica tu cuenta para poder acceder a
            ClassMatch.
          </p>
          <Link
            to="/"
            className="bg-buttonClassMatch text-white font-KhandMedium text-lg rounded-md p-2 mt-8 hover:bg-mainClassMatch hover:text-black transition"
          >
            Volver al inicio
          </Link>
        </div>
      </div>
    </main>
  );
}
