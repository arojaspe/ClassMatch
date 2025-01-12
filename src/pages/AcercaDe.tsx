export default function AcercaDe() {
  return (
    <div className="flex justify-center items-center min-h-screen bg-backgroundClassMatch">
      {/* Contenedor de las tres tarjetas con grid */}
      <div className="w-full grid grid-cols-1 md:grid-cols-3 gap-8 p-8">
        {/* Sobre nosotros */}
        <div className="p-6 bg-mainClassMatch bg-opacity-40 shadow-lg rounded-xl flex flex-col transition-transform duration-300 transform hover:scale-105 hover:shadow-2xl hover:bg-opacity-25">
          <h1 className="font-KhandBold text-8xl text-headClassMatch font-semibold">Sobre nosotros</h1>
          <p className="font-KhandRegular text-2xl text-justify leading-9">
            En ClassMatch, creemos que las conexiones significativas son clave para una experiencia universitaria
            enriquecedora. Nuestra plataforma está diseñada para ayudar a los estudiantes a conocerse, interactuar y formar
            relaciones dentro de su universidad, considerando sus horarios y disponibilidad. A través de un registro
            exclusivo con correo institucional, ClassMatch facilita que los estudiantes de universidades colombianas
            encuentren compañeros con intereses comunes, optimizando su tiempo libre y creando un espacio seguro y dinámico
            para compartir actividades académicas y sociales.
          </p>
        </div>

        {/* Visión */}
        <div className="p-6 bg-mainClassMatch bg-opacity-40 shadow-lg rounded-xl flex flex-col transition-transform duration-300 transform hover:scale-105 hover:shadow-2xl hover:bg-opacity-25">
          <h1 className="font-KhandBold text-8xl text-headClassMatch font-bold">Visión</h1>
          <p className="font-KhandRegular text-2xl text-justify leading-9">
            Nuestra visión es convertirnos en la plataforma líder de conexión social en universidades de Colombia para 2030,
            creando un entorno seguro, innovador y accesible que revolucione la forma en que los estudiantes interactúan.
            Aspiramos a ser el estándar de redes sociales para comunidades universitarias en el país.
          </p>
        </div>

        {/* Misión */}
        <div className="p-6 bg-mainClassMatch bg-opacity-40 shadow-lg rounded-xl flex flex-col transition-transform duration-300 transform hover:scale-105 hover:shadow-2xl hover:bg-opacity-25">
          <h1 className="font-KhandBold text-8xl text-headClassMatch font-extrabold">Misión</h1>
          <p className="font-KhandRegular text-2xl text-justify leading-9">
            Nuestra misión es facilitar conexiones auténticas y fomentar la interacción social significativa y segura entre
            estudiantes universitarios al proporcionar una plataforma que prioriza la compatibilidad de tiempo libre y la
            exclusividad dentro de cada institución. En ClassMatch consideramos el tiempo libre y los intereses de los
            estudiantes, para ayudarles a construir relaciones interpersonales que enriquezcan su experiencia universitaria.
          </p>
        </div>
      </div>
    </div>
  );
}
