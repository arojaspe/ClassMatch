import { Link } from "react-router-dom";

export default function Appfooter() {
  return (
    <header className="py-3 bg-headClassMatch text-white shadow-md fixed bottom-0 w-full h-auto">
      <div className="mx-auto px-10">
        <div className="flex justify-start items-center">
          {/* Navigation */}
          <nav className="flex space-x-10">
            <Link
              to="/contacto"
              className="px-4  font-KhandMedium text-lg text-white hover:text-black transition"
            >
              Contacto
            </Link>
            <Link
              to="/terminosycondiciones"
              className="px-4  font-KhandMedium text-lg text-white hover:text-black transition"
            >
              Términos y condiciones
            </Link>
            <Link
              to="/acercaDe"
              className="px-4  font-KhandMedium text-lg text-white hover:text-black transition"
            >
              Acerca de
            </Link>
          </nav>
        </div>
      </div>
    </header>
  );
}
