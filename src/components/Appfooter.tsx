import { Link } from "react-router-dom";

export default function Appfooter() {
  return (
    <header className="py-3 bg-headClassMatch text-white shadow-md fixed bottom-0 w-full h-auto">
      <div className="mx-auto px-10 flex justify-between">
        <div className="flex justify-start items-center">
          {/* Navigation */}
          <nav className="flex space-x-10">
            <Link
              to="/contacto"
              className="px-4  font-KhandMedium text-lg text-gray-400 hover:text-white transition"
            >
              Contacto
            </Link>
            <Link
              to="/terminosycondiciones"
              className="px-4  font-KhandMedium text-lg text-gray-400 hover:text-white transition"
            >
              Términos y condiciones
            </Link>
            <Link
              to="/acercaDe"
              className="px-4  font-KhandMedium text-lg text-gray-400 hover:text-white transition"
            >
              Acerca de
            </Link>
          </nav>
        </div>
        <a
          href="https://www.instagram.com/_classmatch"
          target="_blank"
          rel="noopener noreferrer"
          className="px-4 font-KhandMedium text-lg text-gray-400 hover:text-white transition flex items-center"
        >
          <img
            src="https://img.icons8.com/?size=100&id=85154&format=png&color=E0ECF0"
            alt="Instagram"
            className="h-8 w-8"
          />
        </a>
      </div>
    </header>
  );
}
