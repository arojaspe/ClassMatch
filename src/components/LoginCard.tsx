import { SetStateAction, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Cookies from "universal-cookie";
import { Link } from "react-router-dom";

export default function LoginCard() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const navigate = useNavigate();
  const cookies = new Cookies();

  const handleEmailChange = (event: {
    target: { value: SetStateAction<string> };
  }) => {
    setEmail(event.target.value);
  };

  const handlePasswordChange = (event: {
    target: { value: SetStateAction<string> };
  }) => {
    setPassword(event.target.value);
  };

  const handleLogin = async (event: { preventDefault: () => void }) => {
    event.preventDefault();
    try {
      const response = await axios.post(
        "http://127.0.0.1:8000/api/auth/login/",
        {
          email: email,
          password: password,
        }
      );
      const token = response.data.access;
      console.log(token);
      if (response.status === 200) {
        setMessage("Datos correctos");
        cookies.set("token", token);
        navigate("/admin");
        window.location.reload();
      }
    } catch {
      setMessage("Datos incorrectos. Inténtalo de nuevo.");
    }
  };

  return (
    <>
      <main className="text-gray-900 w-lvw">
        <div className="w-full py-14">
          <div className="w-full flex shadow-xl flex-col items-center bg-cardClassMatch rounded-2xl p-8 m-4 md:max-w-md md:mx-auto">
            <h2 className=" font-KhandSemiBold text-5xl text-headClassMatch font-bold">
              Ingresar
            </h2>
            <form
              className="mb-4 mt-5 w-full flex flex-col"
              onSubmit={handleLogin}
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
                />
              </div>
              <div className="mb-2">
                <input
                  className="w-full border rounded font-KhandRegular text-lg p-2 outline-none focus:shadow-outline"
                  type="password"
                  name="password"
                  id="password"
                  placeholder="Contraseña"
                  value={password}
                  onChange={handlePasswordChange}
                />
              </div>
              <a
                className="text-black font-KhandRegular text-right text-xl mb-6"
                href="/register"
              >
                <Link
                  className="text-black hover:text-mainClassMatch"
                  to="/recuperarcontrasena"
                >
                  {" "}
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
            {message && <p className="text-center mt-4">{message}</p>}
            <a
              className="text-black font-KhandRegular text-center text-lg"
              href="/register"
            >
              ¿No tienes una cuenta?
              <Link
                className="text-headClassMatch hover:text-mainClassMatch"
                to="/crearcuenta"
              >
                {" "}
                Regístrate
              </Link>
            </a>
          </div>
        </div>
      </main>
    </>
  );
}
