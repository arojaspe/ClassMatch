import { SetStateAction, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../api/axiosConfig";

export default function CrearCuenta() {
  const navigate = useNavigate();
  const [firstname, setFirstname] = useState("");
  const [lastname, setLastname] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [collegeId, setCollegeId] = useState("");
  const [gender, setGender] = useState("");
  const [birthdate, setBirthdate] = useState("");
  const [bio, setBio] = useState("");
  const [filterAge, setFilterAge] = useState("");
  const [filterGender, setFilterGender] = useState("");
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [message, setMessage] = useState("");
  const [errors, setErrors] = useState({
    firstname: false,
    lastname: false,
    email: false,
    password: false,
    collegeId: false,
    gender: false,
    birthdate: false,
    bio: false,
    filterAge: false,
    filterGender: false,
    terms: false,
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleFirstnameChange = (event: {
    target: { value: SetStateAction<string> };
  }) => setFirstname(event.target.value);
  const handleLastnameChange = (event: {
    target: { value: SetStateAction<string> };
  }) => setLastname(event.target.value);
  const handleEmailChange = (event: {
    target: { value: SetStateAction<string> };
  }) => setEmail(event.target.value);
  const handlePasswordChange = (event: {
    target: { value: SetStateAction<string> };
  }) => setPassword(event.target.value);
  const handleConfirmPasswordChange = (event: {
    target: { value: SetStateAction<string> };
  }) => setConfirmPassword(event.target.value);
  const handleCollegeIdChange = (event: {
    target: { value: SetStateAction<string> };
  }) => setCollegeId(event.target.value);
  const handleGenderChange = (event: {
    target: { value: SetStateAction<string> };
  }) => setGender(event.target.value);
  const handleBirthdateChange = (event: {
    target: { value: SetStateAction<string> };
  }) => setBirthdate(event.target.value);
  const handleBioChange = (event: {
    target: { value: SetStateAction<string> };
  }) => setBio(event.target.value);
  const handleFilterAgeChange = (event: {
    target: { value: SetStateAction<string> };
  }) => setFilterAge(event.target.value);
  const handleFilterGenderChange = (event: {
    target: { value: SetStateAction<string> };
  }) => setFilterGender(event.target.value);
  const handleTermsChange = () => setTermsAccepted((prev) => !prev);

  const handleRegister = async (event: { preventDefault: () => void }) => {
    event.preventDefault();

    const newErrors = {
      firstname: !firstname,
      lastname: !lastname,
      email: !email,
      password: !password,
      collegeId: !collegeId,
      gender: !gender,
      birthdate: !birthdate,
      bio: !bio,
      filterAge: !filterAge,
      filterGender: !filterGender,
      terms: !termsAccepted,
    };

    setErrors(newErrors);

    if (Object.values(newErrors).includes(true)) {
      setMessage("Por favor, llena todos los campos correctamente.");
      return;
    }

    const data = {
      firstname,
      lastname,
      email,
      password,
      college_id: collegeId,
      gender,
      birthdate,
      bio,
      filter_age: filterAge,
      filter_gender: filterGender,
    };

    try {
      const response = await api.post("/register", data, {
        withCredentials: true,
      });

      if (!response || response.status !== 201) {
        throw new Error("Error en el registro");
      }

      setMessage("Registro exitoso");

      navigate("/verificacionregistro");
    } catch {
      setMessage("Error en el registro:");
    }
  };

  const togglePasswordVisibility = () => setShowPassword((prev) => !prev);
  const toggleConfirmPasswordVisibility = () =>
    setShowConfirmPassword((prev) => !prev);

  const openInNewTab = () => {
    const newTab = window.open("/terminosycondiciones", "_blank");
    if (newTab) newTab.focus();
  };

  return (
    <main className="w-lvw font-KhandMedium text-xl text-headClassMatch bg-backgroundClassMatch">
      <div className="w-full pt-20 pb-14">
        <div className="w-full flex shadow-xl flex-col items-center bg-cardClassMatch rounded-2xl p-8 m-4 md:max-w-3xl md:mx-auto">
          <h2 className="font-KhandSemiBold text-5xl text-buttonClassMatch font-bold">
            Registro
          </h2>
          <p className="w-full text-xl mt-4 font-KhandMedium">
            ¡Crea tu cuenta de ClassMatch! <br />
            Recuerda que debes usar el correo de tu institución universitaria.
          </p>
          <hr className="w-full border-t-2 border-headClassMatch my-2" />
          <form
            className="mb-4 mt-2 w-full flex flex-col"
            onSubmit={handleRegister}
          >
            <h3 className="text-center mb-2">
              Iniciemos poniendo tus datos básicos
            </h3>
            <div id="Nombre" className="mb-4">
              <input
                className={`w-full border rounded font-KhandRegular text-lg p-2 outline-none focus:shadow-outline ${
                  errors.firstname ? "border-red-500" : ""
                }`}
                type="text"
                name="firstname"
                id="firstname"
                placeholder="Nombres"
                value={firstname}
                onChange={handleFirstnameChange}
              />
            </div>
            <div id="Apellido" className="mb-4">
              <input
                className={`w-full border rounded font-KhandRegular text-lg p-2 outline-none focus:shadow-outline ${
                  errors.lastname ? "border-red-500" : ""
                }`}
                type="text"
                name="lastname"
                id="lastname"
                placeholder="Apellidos"
                value={lastname}
                onChange={handleLastnameChange}
              />
            </div>

            <div id="Email" className="mb-4">
              <input
                className={`w-full border rounded font-KhandRegular text-lg p-2 outline-none focus:shadow-outline ${
                  errors.email ? "border-red-500" : ""
                }`}
                type="email"
                name="email"
                id="email"
                placeholder="Correo electrónico (institucional)"
                value={email}
                onChange={handleEmailChange}
              />
            </div>
            <div id="Universidad" className="mb-4">
              <select
                className={`w-full border rounded font-KhandRegular text-lg p-2 outline-none focus:shadow-outline ${
                  errors.collegeId ? "border-red-500" : ""
                }`}
                name="collegeId"
                id="collegeId"
                value={collegeId}
                onChange={handleCollegeIdChange}
              >
                <option value="" disabled>
                  Selecciona tu universidad
                </option>
                <option value="f639a03f-2496-4b7d-8665-d2c748cd837f">
                  UNAL Bogotá
                </option>
                <option value="42dea2d2-97ee-4647-a8b5-e51060881f5a">
                  UNAL Medellín
                </option>
                <option value="1ad6fbb4-09f4-467d-aa5c-50b9d80aea01">
                  UNAL Palmira
                </option>
              </select>
            </div>
            <div className="mb-4">
              <select
                className={`w-full border rounded font-KhandRegular text-lg p-2 outline-none focus:shadow-outline ${
                  errors.gender ? "border-red-500" : ""
                }`}
                name="gender"
                id="gender"
                value={gender}
                onChange={handleGenderChange}
              >
                <option value="" disabled>
                  Selecciona tu género
                </option>
                <option value="M">Masculino</option>
                <option value="F">Femenino</option>
                <option value="NB">No binario</option>
              </select>
            </div>
            <div className="mb-4">
              <label
                htmlFor="birthdate"
                className="text-base font-KhandRegular"
              >
                Fecha de nacimiento
              </label>
              <input
                className={`w-full border rounded font-KhandRegular text-lg p-2 outline-none focus:shadow-outline ${
                  errors.birthdate ? "border-red-500" : ""
                }`}
                type="date"
                name="birthdate"
                id="birthdate"
                value={birthdate}
                onChange={handleBirthdateChange}
              />
            </div>
            <h3 className="text-center mb-2">
              Ahora cuéntanos un poco más sobre ti
            </h3>
            <div className="mb-4">
              <textarea
                className={`w-full border rounded font-KhandRegular text-lg p-2 outline-none focus:shadow-outline ${
                  errors.bio ? "border-red-500" : ""
                }`}
                name="bio"
                id="bio"
                placeholder="Biografía"
                value={bio}
                onChange={handleBioChange}
                rows={5}
              />
            </div>
            <h3 className="text-center mb-2">
              Ahora escoge tus preferencias de búsqueda: edad máxima, mínima y
              género
            </h3>
            <div id="FilterGender" className="mb-4 flex space-x-2">
              <input
                className={`w-full border rounded font-KhandRegular text-lg p-2 outline-none focus:shadow-outline ${
                  errors.filterAge ? "border-red-500" : ""
                }`}
                type="number"
                name="filterAgeMin"
                id="filterAgeMin"
                placeholder="Edad mínima"
                value={filterAge.split("-")[0]}
                onChange={(e) =>
                  handleFilterAgeChange({
                    target: {
                      value: `${e.target.value}-${filterAge.split("-")[1]}`,
                    },
                  })
                }
              />
              <input
                className={`w-full border rounded font-KhandRegular text-lg p-2 outline-none focus:shadow-outline ${
                  errors.filterAge ? "border-red-500" : ""
                }`}
                type="number"
                name="filterAgeMax"
                id="filterAgeMax"
                placeholder="Edad máxima"
                value={filterAge.split("-")[1]}
                onChange={(e) =>
                  handleFilterAgeChange({
                    target: {
                      value: `${filterAge.split("-")[0]}-${e.target.value}`,
                    },
                  })
                }
              />
            </div>
            <div className="mb-4">
              <select
                className={`w-full border rounded font-KhandRegular text-lg p-2 outline-none focus:shadow-outline ${
                  errors.gender ? "border-red-500" : ""
                }`}
                name="filtergender"
                id="filtergender"
                value={filterGender}
                onChange={handleFilterGenderChange}
              >
                <option value="" disabled>
                  Filtro de género
                </option>
                <option value="M">Masculino</option>
                <option value="F">Femenino</option>
                <option value="NB">No binario</option>
              </select>
            </div>
            <h3 className="text-center">Ahora crea tu contraseña</h3>
            <p className="text-center text-base font-KhandRegular">
              La contraseña debe tener al menos 8 caracteres, una mayúscula, una
              minúscula, un número y un caracter especial.
            </p>
            <div className="mb-4 relative">
              <input
                className={`w-full border rounded font-KhandRegular text-lg p-2 outline-none focus:shadow-outline ${
                  errors.password
                    ? "border-red-500"
                    : "border-premiumButtonClassMatch"
                }`}
                type={showPassword ? "text" : "password"}
                name="password"
                id="password"
                placeholder="Contraseña"
                value={password}
                onChange={(e) => {
                  const value = e.target.value;
                  const isValid =
                    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/.test(
                      value
                    );
                  setPassword(value);
                  setErrors((prevErrors) => ({
                    ...prevErrors,
                    password: !isValid,
                  }));
                }}
              />
              <button
                type="button"
                onClick={togglePasswordVisibility}
                className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-500"
              >
                {showPassword ? (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth="1.5"
                    stroke="currentColor"
                    className="size-6"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M3.98 8.223A10.477 10.477 0 0 0 1.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.451 10.451 0 0 1 12 4.5c4.756 0 8.773 3.162 10.065 7.498a10.522 10.522 0 0 1-4.293 5.774M6.228 6.228 3 3m3.228 3.228 3.65 3.65m7.894 7.894L21 21m-3.228-3.228-3.65-3.65m0 0a3 3 0 1 0-4.243-4.243m4.242 4.242L9.88 9.88"
                    />
                  </svg>
                ) : (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth="1.5"
                    stroke="currentColor"
                    className="size-6"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M2.036 12.322a1.012 1.012 0 0 1 0-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178Z"
                    />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z"
                    />
                  </svg>
                )}
              </button>
            </div>
            <div className="mb-4 relative">
              <input
                className={`w-full border rounded font-KhandRegular text-lg p-2 outline-none focus:shadow-outline ${
                  errors.password ? "border-red-500" : ""
                }`}
                type={showConfirmPassword ? "text" : "password"}
                name="confirmpassword"
                id="confirmpassword"
                placeholder="Confirma tu contraseña"
                value={confirmPassword}
                onChange={handleConfirmPasswordChange}
              />
              <button
                type="button"
                onClick={toggleConfirmPasswordVisibility}
                className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-500"
              >
                {showPassword ? (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth="1.5"
                    stroke="currentColor"
                    className="size-6"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M3.98 8.223A10.477 10.477 0 0 0 1.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.451 10.451 0 0 1 12 4.5c4.756 0 8.773 3.162 10.065 7.498a10.522 10.522 0 0 1-4.293 5.774M6.228 6.228 3 3m3.228 3.228 3.65 3.65m7.894 7.894L21 21m-3.228-3.228-3.65-3.65m0 0a3 3 0 1 0-4.243-4.243m4.242 4.242L9.88 9.88"
                    />
                  </svg>
                ) : (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth="1.5"
                    stroke="currentColor"
                    className="size-6"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M2.036 12.322a1.012 1.012 0 0 1 0-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178Z"
                    />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z"
                    />
                  </svg>
                )}
              </button>
            </div>

            <div className="mb-4 flex items-center">
              <input
                type="checkbox"
                id="terms"
                checked={termsAccepted}
                onChange={handleTermsChange}
                className="mr-2"
              />
              <label
                htmlFor="terms"
                className={`text-md font-KhandRegular ${
                  errors.terms ? "text-red-500" : ""
                }`}
              >
                He leído y acepto los{" "}
                <Link
                  className="text-headClassMatch hover:text-mainClassMatch"
                  onClick={openInNewTab}
                  to={""}
                >
                  términos y condiciones de ClassMatch
                </Link>
                .
              </label>
            </div>
            <button
              className="bg-buttonClassMatch place-self-center w-[7rem] hover:bg-headClassMatch text-white font-KhandRegular text-base font-semibold px-6 py-2 rounded-md"
              type="submit"
            >
              Continuar
            </button>
          </form>
          {/* {message && (
            <p className="text-center mt-4 font-KhandRegular text-red-900">
              {message}
            </p>
          )} */}
          <a
            className="text-black font-KhandRegular text-center text-lg"
            href="/login"
          >
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
