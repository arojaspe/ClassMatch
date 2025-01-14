import { SetStateAction, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Cookies from "universal-cookie";
import { Link } from "react-router-dom";

export default function LoginCard() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [showPassword, setShowPassword] = useState(false); // Estado para mostrar/ocultar contraseña
  const navigate = useNavigate();
  const cookies = new Cookies();

  const handleEmailChange = (event: { target: { value: SetStateAction<string> } }) => {
    setEmail(event.target.value);
  };

  const handlePasswordChange = (event: { target: { value: SetStateAction<string> } }) => {
    setPassword(event.target.value);
  };

  const handleLogin = async (event: { preventDefault: () => void }) => {
    event.preventDefault();
    try {
      const response = await axios.post("http://127.0.0.1:5000/api/login", {
        email: email,
        password: password,
      });
      const token = response.data.access;
      console.log(token);
      if (response.status === 200) {
        setMessage("Datos correctos");
        cookies.set("token", token);
        navigate("/busqueda");
        window.location.reload();
      }
    } catch {
      setMessage("Datos incorrectos. Inténtalo de nuevo.");
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword((prev) => !prev);
  };

  return (
    <>
      <main className="text-gray-900 w-lvw">
        <div className="w-full py-14">
          <div className="w-full flex shadow-xl flex-col items-center bg-cardClassMatch rounded-2xl p-8 m-4 md:max-w-md md:mx-auto">
            <h2 className="font-KhandSemiBold text-5xl text-headClassMatch font-bold">
              Ingresar
            </h2>
            <form className="mb-4 mt-5 w-full flex flex-col" onSubmit={handleLogin}>
              <div className="mb-6">
                <input
                  className="w-full border rounded font-KhandRegular text-lg p-2 outline-none focus:shadow-outline"
                  type="email"
                  name="email"
                  id="email"
                  placeholder="Correo electrónico"
                  value={email}
                  onChange={handleEmailChange}
                />
              </div>
              <div className="mb-2 relative">
                <input
                  className="w-full border rounded font-KhandRegular text-lg p-2 outline-none focus:shadow-outline"
                  type={showPassword ? "text" : "password"} // Mostrar u ocultar la contraseña
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

              <a
                className="text-black font-KhandRegular text-right text-xl mb-6"
                href="/recuperarcontrasena"
              >
                <Link
                  className="text-black hover:text-mainClassMatch "
                  to="/recuperarcontrasena"
                >
                  ¿Has olvidado la contraseña?
                </Link>
              </a>
              <button
                className="bg-buttonClassMatch place-self-center w-[7rem] hover:bg-headClassMatch text-white font-KhandRegular text-base font-semibold px-6 py-2 rounded-md"
                type="submit"
              >
                Ingresar
              </button>
            </form>
            {message && (
              <p className="text-center mt-4 font-KhandRegular text-red-900">
                {message}
              </p>
            )}
            <a
              className="text-black font-KhandRegular text-center text-lg"
              href="/crearcuenta"
            >
              ¿No tienes una cuenta?
              <Link
                className="text-headClassMatch hover:text-mainClassMatch"
                to="/crearcuenta"
              >
                Regístrate
              </Link>
            </a>
          </div>
        </div>
      </main>
    </>
  );
}
