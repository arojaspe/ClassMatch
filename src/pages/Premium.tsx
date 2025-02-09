import React from "react";

export default function Premium() {
  return (
    <>
      <div className="bg-accentClassMatch h-screen flex ">
        <main className="max-w-6xl mx-auto px-8 flex flex-col justify-center items-center">
          <div className="max-w-5xl mx-auto mb-4 text-center">
            <p className="text-headClassMatch font-medium font-KhandSemiBold text-3xl">
              Con ClassMatch Premium, tu experiencia estará a otro nivel
            </p>
          </div>

          <div className="flex flex-col justify-between space-x-8 items-center lg:flex-row lg:items-start">
            <div className="w-full flex-1 mt-8 p-8 order-2 bg-white shadow-xl rounded-3xl sm:w-96 lg:w-full lg:order-1">
              <div className="mb-7 pb-7 flex items-center border-b border-gray-300">
                <div className="ml-5">
                  <span className="block text-4xl font-KhandBold">Basic</span>
                  <span>
                    <span className="text-2xl font-KhandSemiBold">Gratis </span>
                  </span>
                </div>
              </div>
              <ul className="mb-7 font-KhandSemiBold text-gray-500">
                <li className="flex text-lg mb-2">
                  <img className="w-4" src="./img/check.svg" />
                  <span className="ml-3">
                    Creación de perfil, horario, intereses y match
                  </span>
                </li>
                <li className="flex text-lg mb-2">
                  <img className="w-4" src="./img/cross.svg" />
                  <span className="ml-3">
                    Comunicación por chat limitada a 3 chats activos
                  </span>
                </li>
                <li className="flex text-lg mb-2">
                  <img className="w-4" src="./img/cross.svg" />
                  <span className="ml-3">Creación de eventos inhabilitada</span>
                </li>
                <li className="flex text-lg">
                  <img className="w-4" src="./img/cross.svg" />
                  <span className="ml-3">
                    Búsqueda por filtros específicos (intereses, horario)
                    inhabilitada
                  </span>
                </li>
              </ul>
            </div>

            <div
              className="w-full flex-1 mt-8 p-8 order-2 bg-white shadow-xl rounded-3xl sm:w-96 lg:w-full lg:order-1"
              style={{
                backgroundImage:
                  "url(\"data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%2372a2a9' fill-opacity='0.2'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E\")",
              }}
            >
              <div className="mb-7 pb-7 flex items-center border-b border-gray-300">
                <img
                  src="./Logotipo.svg"
                  alt=""
                  className="rounded-3xl w-20 h-20"
                />
                <div className="ml-5">
                  <span className="block text-4xl font-KhandBold">Premium</span>
                  <span>
                    <span className="text-3xl font-KhandSemiBold">
                      $&thinsp; 15.900
                    </span>
                  </span>
                </div>
              </div>
              <ul className="mb-7 font-KhandSemiBold text-gray-500">
                <li className="flex text-lg mb-2">
                  <img className="w-4" src="./img/check.svg" />
                  <span className="ml-3">
                    Soporte prioritario por parte del equipo de ClassMatch
                  </span>
                </li>
                <li className="flex text-lg mb-2">
                  <img className="w-4" src="./img/check.svg" />
                  <span className="ml-3">Comunicación por chat ilimitada</span>
                </li>
                <li className="flex text-lg mb-2">
                  <img className="w-4" src="./img/check.svg" />
                  <span className="ml-3">Creación de eventos habilitada</span>
                </li>
                <li className="flex text-lg">
                  <img className="w-4" src="./img/check.svg" />
                  <span className="ml-3">
                    Búsqueda por filtros específicos (intereses, horario)
                    habilitada
                  </span>
                </li>
              </ul>
              <a
                href="#/"
                className="flex justify-center items-center font-KhandSemiBold bg-headClassMatch rounded-xl py-5 px-4 text-center text-white text-2xl"
              >
                Escoger plan
              </a>
            </div>
          </div>
        </main>
      </div>
    </>
  );
}
