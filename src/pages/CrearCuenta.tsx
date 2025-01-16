import { SetStateAction, useState } from "react";
import { Link } from "react-router-dom";

export default function CrearCuenta() {
  const [name, setName] = useState("");
  const [lastName, setLastName] = useState(""); 
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [dob, setDob] = useState("");
  const [gender, setGender] = useState("");
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [message, setMessage] = useState("");
  const [errors, setErrors] = useState({
    name: false,
    lastName: false,
    email: false,
    password: false,
    confirmPassword: false,
    dob: false,
    gender: false,
    terms: false, // Campo de error para términos
  });
  const [showPassword, setShowPassword] = useState(false);  // Nuevo estado para visibilidad de la contraseña
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);  // Nuevo estado para visibilidad de la confirmación de la contraseña

  const handleNameChange = (event: { target: { value: SetStateAction<string> } }) => setName(event.target.value);
  const handleLastNameChange = (event: { target: { value: SetStateAction<string> } }) => setLastName(event.target.value);
  const handleEmailChange = (event: { target: { value: SetStateAction<string> } }) => setEmail(event.target.value);
  const handlePasswordChange = (event: { target: { value: SetStateAction<string> } }) => setPassword(event.target.value);
  const handleConfirmPasswordChange = (event: { target: { value: SetStateAction<string> } }) => setConfirmPassword(event.target.value);
  const handleDobChange = (event: { target: { value: SetStateAction<string> } }) => setDob(event.target.value);
  const handleGenderChange = (event: { target: { value: SetStateAction<string> } }) => setGender(event.target.value);
  const handleTermsChange = () => setTermsAccepted(prev => !prev);

  const handleRegister = async (event: { preventDefault: () => void }) => {
    event.preventDefault();

    // Validación de campos
    const newErrors = {
      name: !name,
      lastName: !lastName,
      email: !email,
      password: !password,
      confirmPassword: !confirmPassword,
      dob: !dob,
      gender: !gender,
      terms: !termsAccepted, // Se valida si los términos fueron aceptados
    };

    // Validación de la contraseña (8 caracteres mínimo, 1 mayúscula, 1 minúscula, 1 número, 1 carácter especial)
    const passwordPattern = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+={}\[\]:;"'<>,.?/\\|`~\-]).{8,}$/;
    if (!password.match(passwordPattern)) {
      newErrors.password = true;
      setMessage("La contraseña debe tener al menos 8 caracteres, incluyendo una mayúscula, una minúscula, un número y un carácter especial.");
    }

    // Si las contraseñas no coinciden, se marca el error en confirmPassword
    if (password !== confirmPassword) {
      newErrors.confirmPassword = true;
      setMessage("Las contraseñas no coinciden.");
    }

    setErrors(newErrors);

    // Si hay algún error, no continuar
    if (Object.values(newErrors).includes(true)) {
      setMessage("Por favor, llena todos los campos correctamente.");
      return;
    }
  };

  // Funciones para alternar la visibilidad de las contraseñas
  const togglePasswordVisibility = () => setShowPassword(prev => !prev);
  const toggleConfirmPasswordVisibility = () => setShowConfirmPassword(prev => !prev);

  return (
    <main className="text-gray-900 w-lvw bg-backgroundClassMatch">
      <div className="w-full pt-20 pb-14">
        <div className="w-full flex shadow-xl flex-col items-center bg-cardClassMatch rounded-2xl p-8 m-4 md:max-w-3xl md:mx-auto">
          <h2 className="font-KhandSemiBold text-5xl text-headClassMatch font-bold">
            Registro
          </h2>
          <p className="w-full text-xl mt-4 font-KhandRegular">
            ¡Crea tu cuenta de ClassMatch! <br /> <br />
            Recuerda que debes usar el correo de tu institución universitaria.
          </p>
          <form className="mb-4 mt-5 w-full flex flex-col" onSubmit={handleRegister}>
            <div className="mb-6">
              <input
                className={`w-full border rounded font-KhandRegular text-lg p-2 outline-none focus:shadow-outline ${errors.name ? 'border-red-500' : ''}`}
                type="text"
                name="name"
                id="name"
                placeholder="Nombres"
                value={name}
                onChange={handleNameChange}
              />
            </div>
            <div className="mb-6">
              <input
                className={`w-full border rounded font-KhandRegular text-lg p-2 outline-none focus:shadow-outline ${errors.lastName ? 'border-red-500' : ''}`}
                type="text"
                name="lastName"
                id="lastName"
                placeholder="Apellidos"
                value={lastName}
                onChange={handleLastNameChange}
              />
            </div>
            <div className="mb-6">
              <input
                className={`w-full border rounded font-KhandRegular text-lg p-2 outline-none focus:shadow-outline ${errors.email ? 'border-red-500' : ''}`}
                type="email"
                name="email"
                id="email"
                placeholder="Correo electrónico (institucional)"
                value={email}
                onChange={handleEmailChange}
              />
            </div>

            {/* Mensaje de requisitos de contraseña */}
            <p className="font-KhandRegular text-xl mb-2">
              Recuerda que la contraseña debe tener 8 caracteres como mínimo, entre ellos una minúscula, una mayúscula, un número y un carácter especial (sin espacios).
            </p>

            <div className="mb-6 relative">
              <input
                className={`w-full border rounded font-KhandRegular text-lg p-2 outline-none focus:shadow-outline ${errors.password ? 'border-red-500' : ''}`}
                type={showPassword ? "text" : "password"}
                name="password"
                id="password"
                placeholder="Contraseña"
                value={password}
                onChange={handlePasswordChange}
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
                className={`w-full border rounded font-KhandRegular text-lg p-2 outline-none focus:shadow-outline ${errors.confirmPassword ? 'border-red-500' : ''}`}
                type={showConfirmPassword ? "text" : "password"}
                name="confirmPassword"
                id="confirmPassword"
                placeholder="Confirmar contraseña"
                value={confirmPassword}
                onChange={handleConfirmPasswordChange}
              />
              <button
                type="button"
                onClick={toggleConfirmPasswordVisibility}
                className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-500"
              >
                {showConfirmPassword ? (
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

            <div className="mb-6">
              <label htmlFor="dob" className="text-lg font-KhandRegular">Fecha de nacimiento</label>
              <input
                className={`w-full border rounded font-KhandRegular text-lg p-2 outline-none focus:shadow-outline ${errors.dob ? 'border-red-500' : ''}`}
                type="date"
                name="dob"
                id="dob"
                value={dob}
                onChange={handleDobChange}
              />
            </div>
            <div className="mb-6">
              <select
                className={`w-full border rounded font-KhandRegular text-lg p-2 outline-none focus:shadow-outline ${errors.gender ? 'border-red-500' : ''}`}
                name="gender"
                id="gender"
                value={gender}
                onChange={handleGenderChange}
              >
                <option value="" disabled>
                  Selecciona tu género
                </option>
                <option value="Masculino">Masculino</option>
                <option value="Femenino">Femenino</option>
                <option value="No binario">No binario</option>
                <option value="Prefiero no decirlo">Prefiero no decirlo</option>
              </select>
            </div>

            {/* Cambio aquí para el texto en rojo cuando no se ha marcado el checkbox */}
            <div className="mb-6 flex items-center">
              <input
                type="checkbox"
                id="terms"
                checked={termsAccepted}
                onChange={handleTermsChange}
                className="mr-2"
              />
              <label
                htmlFor="terms"
                className={`text-md font-KhandRegular ${errors.terms ? 'text-red-500' : ''}`}
              >
                He leído y acepto los{" "}
                <Link
                  to="/terminos"
                  className="text-headClassMatch hover:text-mainClassMatch"
                >
                  términos y condiciones de ClassMatch
                </Link>.
              </label>
            </div>

            <button
              className="bg-buttonClassMatch place-self-center w-[7rem] hover:bg-headClassMatch text-white font-KhandRegular text-base font-semibold px-6 py-2 rounded-md"
              type="submit"
            >
              Continuar
            </button>
          </form>

          {message && (
            <p className="text-center mt-4 font-KhandRegular text-red-900">
              {message}
            </p>
          )}

          <a className="text-black font-KhandRegular text-center text-lg" href="/login">
            ¿Ya tienes una cuenta?
            <Link
              className="text-headClassMatch hover:text-mainClassMatch"
              to="/login"
            >
              Inicia sesión
            </Link>
          </a>
        </div>
      </div>
    </main>
  );
}
