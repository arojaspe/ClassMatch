export default function Contacto() {
  return <div className="flex justify-center items-center min-h-screen bg-backgroundClassMatch">
  {/* Contenedor principal */}
  <div className="w-full flex flex-col md:flex-row p-8 space-y-8 md:space-y-0">
    
    {/* Sección izquierda: Texto */}
    <div className="flex-1 pl-6 flex flex-col justify-center ">
      <h1 className="font-KhandBold text-8xl pb-14 leading-10 text-headClassMatch">Contáctanos</h1>
      <p className="font-KhandRegular text-2xl text-justify leading-9 pr-28">
        ¿Deseas contactarte con nosotros? <br /><br />
        Puedes llenar el siguiente formulario con tus datos o escribirnos directamente a <a href="mailto:correo@classmatch.com" className="text-blue-800 underline">
  correo@classmatch.com
</a>.
      </p>
    </div>

    {/* Sección derecha: Formulario */}
    <div className="flex-1 p-6 mr-10 bg-mainClassMatch bg-opacity-40 shadow-lg rounded-xl">
      
      {/* Formulario */}
      <form className="space-y-6">
        {/* Primera línea: Nombre y Apellidos */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="font-KhandRegular text-xl">Nombre</label>
            <input
              type="text"
              placeholder="Escribe tu nombre"
              className="mt-1 p-3 w-full border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white bg-opacity-85 font-KhandRegular text-lg"
            />
          </div>
          <div>
            <label className="font-KhandRegular text-xl">Apellidos</label>
            <input
              type="text"
              placeholder="Escribe tus apellidos"
              className="mt-1 p-3 w-full border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white bg-opacity-85 font-KhandRegular text-lg"
            />
          </div>
        </div>

        {/* Segunda línea: Correo */}
        <div>
          <label className="font-KhandRegular text-xl">Correo electrónico</label>
          <input
            type="email"
            placeholder="Escribe tu correo electrónico"
            className="mt-1 p-3 w-full border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white bg-opacity-85 font-KhandRegular text-lg"
          />
        </div>

        {/* Tercera línea: Comentarios */}
        <div>
          <label className="font-KhandRegular text-xl">Comentarios</label>
          <textarea
            placeholder="Escribe tus comentarios aquí..."
            className="mt-1 p-3 w-full h-48 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white bg-opacity-85 font-KhandRegular text-lg resize-none"
          />
        </div>

        {/* Botón Enviar */}
        <div className="flex justify-center">
          <button
            type="submit"
            className="bg-headClassMatch text-white py-2 px-8 rounded-md hover:bg-gray-100 hover:text-black transition duration-200"
          >
            Enviar
          </button>
        </div>
      </form>
    </div>
  </div>
</div>;
}
