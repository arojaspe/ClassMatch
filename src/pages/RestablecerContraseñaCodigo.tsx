import React, { useState } from "react";
import { Link } from "react-router-dom";

export default function RecuperarContraseñaCodigo() {
  const email = ""; // Este es solo un ejemplo, puedes cambiarlo según tu lógica
  const [message, setMessage] = useState("");
  const [code, setCode] = useState(["", "", "", ""]); // Array para almacenar el código

  // Función para manejar el cambio en las casillas del código
  const handleCodeChange = (
    event: React.ChangeEvent<HTMLInputElement>,
    id: string
  ) => {
    const value = event.target.value;

    // Validamos que solo se pueda escribir un solo dígito en cada input
    if (value === "" || /^[0-9]$/.test(value)) {
      const newCode = [...code]; // Hacemos una copia del código
      newCode[parseInt(id)] = value; // Asignamos el valor a la casilla correspondiente
      setCode(newCode);

      // Si no es el último input, movemos el foco al siguiente
      if (value !== "" && parseInt(id) < 3) {
        const nextInput = document.getElementById(`${parseInt(id) + 1}`);
        nextInput?.focus();
      }
    }
  };

  // Función para manejar el envío del código
  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    const fullCode = code.join("");
    if (fullCode === "1234") {
      setMessage("Código correcto, redirigiendo...");
      // Aquí podrías hacer una acción adicional como redirigir o mostrar un mensaje de éxito
    } else {
      setMessage("Código incorrecto, intenta nuevamente.");
    }
  };

  // Función para manejar el cambio de casilla con las teclas de dirección
  const handleKeyDown = (
    event: React.KeyboardEvent<HTMLInputElement>,
    id: string
  ) => {
    const key = event.key;

    if (key === "ArrowRight" && parseInt(id) < 3) {
      // Si la tecla es flecha derecha, mover al siguiente input
      const nextInput = document.getElementById(`${parseInt(id) + 1}`);
      nextInput?.focus();
    } else if (key === "ArrowLeft" && parseInt(id) > 0) {
      // Si la tecla es flecha izquierda, mover al input anterior
      const prevInput = document.getElementById(`${parseInt(id) - 1}`);
      prevInput?.focus();
    } else if (key === "Backspace" && code[parseInt(id)] === "") {
      // Si presionamos Backspace y la casilla está vacía, mover al input anterior
      if (parseInt(id) > 0) {
        const prevInput = document.getElementById(`${parseInt(id) - 1}`);
        prevInput?.focus();
      }
    }
  };

  // Función para asegurar que el cursor esté al final al escribir
  const handleFocus = (event: React.FocusEvent<HTMLInputElement>) => {
    const input = event.target;
    // Aseguramos que el cursor esté al final del texto en el input
    setTimeout(() => {
      input.setSelectionRange(input.value.length, input.value.length); // Mueve el cursor al final
    }, 0);
  };

  return (
    <>
      <main className="text-gray-900 w-lvw flex items-center h-screen bg-backgroundClassMatch">
        <div className="w-full py-14">
          <div className="w-full flex shadow-xl flex-col items-center bg-cardClassMatch rounded-2xl p-8 m-4 md:max-w-md md:mx-auto">
            <h2 className="font-KhandSemiBold text-5xl text-headClassMatch font-bold">
              Ingresa el código
            </h2>
            <p className="font-KhandRegular text-xl mt-4">
              Ingresa el código que enviamos al correo {email}.
            </p>
            <form className="mt-4 w-full flex flex-col" onSubmit={handleSubmit}>
              <div className="flex justify-center mb-4 gap-4">
                {code.map((digit, index) => (
                  <input
                    key={index}
                    id={String(index)}
                    className="w-12 h-12 border text-center rounded font-KhandRegular text-2xl"
                    type="text"
                    value={digit}
                    onChange={(e) => handleCodeChange(e, String(index))}
                    onKeyDown={(e) => handleKeyDown(e, String(index))}
                    onFocus={handleFocus} // Al hacer foco, aseguramos que el cursor esté al final
                    maxLength={1}
                    autoFocus={index === 0}
                    inputMode="numeric"
                  />
                ))}
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
                  Enviar
                </button>
              </div>
            </form>

            {message && (
              <p
                className={`text-center mt-4 font-KhandRegular text-lg ${
                  message.includes("incorrecto")
                    ? "text-red-600"
                    : "text-green-600"
                }`}
              >
                {message}
              </p>
            )}
          </div>
        </div>
      </main>
    </>
  );
}
