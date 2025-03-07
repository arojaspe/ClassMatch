import axios from "axios";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useParams } from "react-router-dom";

export const VerificarEmail = () => {
  const { magicLink } = useParams<{ magicLink: string }>();
  const [isVerified, setIsVerified] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const verifyEmail = async () => {
      try {
        const response = await axios.get(`/verify/${magicLink}`);
        console.log("Esto se obtiene en verifyemail", response);
        if (response.status === 200) {
          setIsVerified(true);
        } else {
          setIsVerified(false);
        }
      } catch (error) {
        console.error("Error verifying email:", error);
        
        setIsVerified(false);
      } finally {
        setLoading(false);
      }
    };

    verifyEmail();
  }, [magicLink]);

  if (loading) {
    return <div>Verificando...</div>;
  }

  return (
    <main className="w-full font-KhandMedium text-xl min-h-screen text-headClassMatch bg-backgroundClassMatch flex items-center justify-center">
      <div className="w-full max-w-xl p-4">
        <div className="w-full flex shadow-xl flex-col items-center bg-cardClassMatch rounded-2xl p-8 m-4">
          <h1 className="text-2xl text-headClassMatch font-KhandBold mb-4 text-center">
            ¡Gracias por registrarte!
          </h1>
          <p className="text-xl text-center text-headClassMatch font-KhandRegular">
            {isVerified ? (
              <h2>Tu email ha sido verificado con éxito</h2>
            ) : (
              <h2>Tu email ha sido verificado con éxito</h2>
            )}
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
};
