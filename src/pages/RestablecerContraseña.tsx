import { Link } from "react-router-dom";
import { SetStateAction, useState } from "react";

export default function RecuperarContraseña() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");

  // Función para manejar el cambio en el campo de correo electrónico
  const handleEmailChange = (event: {
    target: { value: SetStateAction<string> };
  }) => {
    setEmail(event.target.value);
  };

  // Función para manejar el envío del código
  const handleSendCode = (event: { preventDefault: () => void }) => {
    event.preventDefault();
    // Aquí iría la lógica para verificar el correo e intentar enviar el código
    // Si el correo es válido, envías el código, sino muestra un mensaje de error
    if (email === "test@example.com") {
      setMessage("¡Código enviado correctamente!");
    } else {
      setMessage("Correo no válido. Intenta nuevamente.");
    }
  };

  return (
    <>
      <main className="text-gray-900 w-lvw flex items-center h-screen bg-backgroundClassMatch">
        <div className="w-full py-14">
          <div className="w-full flex shadow-xl flex-col items-center bg-cardClassMatch rounded-2xl p-8 m-4 md:max-w-md md:mx-auto">
            <h2 className="font-KhandSemiBold text-5xl text-headClassMatch font-bold">
              Recuperar contraseña
            </h2>
            <p className="font-KhandRegular text-xl mt-4">
              Ingresa tu correo electrónico, te enviaremos un código de
              recuperación para reestablecer la contraseña.
            </p>
            <form
              className="mt-4 w-full flex flex-col"
              onSubmit={handleSendCode}
            >
              <div className="mb-6">
                <input
                  className="w-full border rounded font-KhandRegular text-lg p-2 outline-none focus:shadow-outline"
                  type="email"
                  name="email"
                  id="email"
                  placeholder="Correo electrónico"
                  value={email}
                  onChange={handleEmailChange}
                  required
                />
              </div>

              <div className="flex justify-center mb-4 gap-4">
                <Link
                  to="/login"
                  className="bg-gray-500 text-white font-KhandRegular text-base font-semibold px-6 py-2 rounded-md hover:bg-gray-600 text-center"
                >
                  Cancelar
                </Link>
                <button
                  className="bg-buttonClassMatch text-white font-KhandRegular text-base font-semibold px-6 py-2 rounded-md hover:bg-headClassMatch"
                  type="submit"
                >
                  Enviar código
                </button>
                <p>{message}</p>
              </div>
            </form>
          </div>
        </div>
      </main>
    </>
  );
}
