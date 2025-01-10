import { Link } from "react-router-dom";

export default function Appheader() {
  return (
    <header className="py-4 bg-headClassMatch text-white shadow-md fixed top-0 w-full h-auto">
      <div className="mx-auto px-10">
        <div className="flex justify-start items-center">
          <div>
            <Link to="/">
              <img
                src="/img/ClassmatchTextWhite.png"
                alt="Logo"
                className="h-14 hover:opacity-25 duration-200 rounded-xl"
              />
            </Link>
          </div>

          {/* Navigation */}
          <nav className="flex px-28 space-x-4">
            <Link
              to="/busqueda"
              className="px-8 py-2 bg-buttonClassMatch font-KhandMedium text-lg text-white rounded-md hover:bg-gray-100 hover:text-black transition font-Khand-Regular"
            >
              Búsqueda
            </Link>
            <Link
              to="/mismatch"
              className="px-8 py-2 bg-buttonClassMatch font-KhandMedium text-lg text-white rounded-md hover:bg-gray-100 hover:text-black transition"
            >
              Mis match
            </Link>
            <Link
              to="/eventos"
              className="px-8 py-2 bg-buttonClassMatch font-KhandMedium text-lg text-white rounded-md hover:bg-gray-100 hover:text-black transition"
            >
              Eventos
            </Link>
            <Link
              to="/premium"
              className="px-8 py-2 bg-premiumButtonClassMatch font-KhandMedium text-lg text-white rounded-md hover:bg-gray-100 hover:text-black transition"
            >
              Premium
            </Link>
          </nav>
          <div className="right-4 h-10 absolute flex items-center">
            <Link
              to="/miperfil"
              className="px-4 py-2 font-KhandMedium text-lg text-white hover:text-mainClassMatch transition"
            >
              Nombre
            </Link>
            <img
              className="img-fluid h-16"
              src={`/img/Profile.png`}
              alt="imagen guitarra"
            />
          </div>
        </div>
      </div>
    </header>
  );
}
