import React, { useState } from "react";
import { Link } from "react-router-dom";

export default function NuevaContraseña() {
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  // Función para manejar el cambio en los campos de contraseña
  const handleNewPasswordChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setNewPassword(event.target.value);
  };

  const handleConfirmPasswordChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setConfirmPassword(event.target.value);
  };

  // Función para verificar que las contraseñas cumplen con los requisitos
  const validatePassword = () => {
    const passwordPattern = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+={}\[\]:;"'<>,.?/\\|`~\-]).{8,}$/;

    if (!newPassword.match(passwordPattern)) {
      setErrorMessage("La contraseña debe tener al menos 8 caracteres, incluyendo una mayúscula, una minúscula, un número y un carácter especial.");
      return false;
    }

    if (newPassword !== confirmPassword) {
      setErrorMessage("Las contraseñas no coinciden.");
      return false;
    }

    setErrorMessage(""); // No hay errores
    return true;
  };

  // Función para manejar el submit del formulario
  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    if (validatePassword()) {
      setErrorMessage(""); // Si todo está correcto, no mostramos error
      console.log("Contraseña actualizada con éxito");
      // Aquí iría la lógica para actualizar la contraseña, por ejemplo, hacer una solicitud API.
    }
  };

  // Función para mostrar/ocultar contraseñas
  const togglePasswordVisibility = () => {
    setShowPassword((prev) => !prev);
  };

  return (
    <>
      <main className="text-gray-900 w-lvw flex items-center h-screen bg-backgroundClassMatch">
        <div className="w-full py-14">
          <div className="w-full flex shadow-xl flex-col items-center bg-cardClassMatch rounded-2xl p-8 m-4 md:max-w-md md:mx-auto">
            <h2 className="font-KhandSemiBold text-5xl text-headClassMatch font-bold">
              Nueva contraseña
            </h2>
            <p className="font-KhandRegular text-xl mt-4">
              Ingresa la nueva contraseña de tu cuenta ClassMatch.
            </p>
            <p className="font-KhandRegular text-md mt-2 text-gray-600">
              La contraseña debe tener 8 caracteres como mínimo, entre ellos una minúscula, una mayúscula, un número y un carácter especial (sin espacios).
            </p>

            <form className="mt-4 w-full flex flex-col" onSubmit={handleSubmit}>
              <div className="mb-6 relative">
                <input
                  className="w-full border rounded font-KhandRegular text-lg p-2 outline-none focus:shadow-outline"
                  type={showPassword ? "text" : "password"}
                  name="newPassword"
                  id="newPassword"
                  placeholder="Nueva contraseña"
                  value={newPassword}
                  onChange={handleNewPasswordChange}
                  required
                />
                <button
                  type="button"
                  onClick={togglePasswordVisibility}
                  className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-500"
                >
                  {showPassword ? (
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" className="size-6">
                      <path stroke-linecap="round" stroke-linejoin="round" d="M3.98 8.223A10.477 10.477 0 0 0 1.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.451 10.451 0 0 1 12 4.5c4.756 0 8.773 3.162 10.065 7.498a10.522 10.522 0 0 1-4.293 5.774M6.228 6.228 3 3m3.228 3.228 3.65 3.65m7.894 7.894L21 21m-3.228-3.228-3.65-3.65m0 0a3 3 0 1 0-4.243-4.243m4.242 4.242L9.88 9.88" />
                    </svg>
                  ) : (
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" className="size-6">
                      <path stroke-linecap="round" stroke-linejoin="round" d="M2.036 12.322a1.012 1.012 0 0 1 0-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178Z" />
                      <path stroke-linecap="round" stroke-linejoin="round" d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
                    </svg>
                  )}
                </button>
              </div>

              <div className="mb-6 relative">
                <input
                  className="w-full border rounded font-KhandRegular text-lg p-2 outline-none focus:shadow-outline"
                  type={showPassword ? "text" : "password"}
                  name="confirmPassword"
                  id="confirmPassword"
                  placeholder="Confirmar contraseña"
                  value={confirmPassword}
                  onChange={handleConfirmPasswordChange}
                  required
                />
                <button
                  type="button"
                  onClick={togglePasswordVisibility}
                  className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-500"
                >
                  {showPassword ? (
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" className="size-6">
                      <path stroke-linecap="round" stroke-linejoin="round" d="M3.98 8.223A10.477 10.477 0 0 0 1.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.451 10.451 0 0 1 12 4.5c4.756 0 8.773 3.162 10.065 7.498a10.522 10.522 0 0 1-4.293 5.774M6.228 6.228 3 3m3.228 3.228 3.65 3.65m7.894 7.894L21 21m-3.228-3.228-3.65-3.65m0 0a3 3 0 1 0-4.243-4.243m4.242 4.242L9.88 9.88" />
                    </svg>
                  ) : (
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" className="size-6">
                      <path stroke-linecap="round" stroke-linejoin="round" d="M2.036 12.322a1.012 1.012 0 0 1 0-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178Z" />
                      <path stroke-linecap="round" stroke-linejoin="round" d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
                    </svg>
                  )}
                </button>
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
                  Confirmar
                </button>
              </div>
            </form>

            {errorMessage && (
              <p className="text-center mt-4 font-KhandRegular text-red-600">
                {errorMessage}
              </p>
            )}
          </div>
        </div>
      </main>
    </>
  );
}
