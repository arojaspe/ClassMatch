export default function TerminosYCondiciones() {
  return (
    <div className="flex justify-center items-center min-h-screen bg-backgroundClassMatch py-8 px-4">
      <div className="w-full m-20 p-8 bg-white bg-opacity-80 shadow-lg rounded-xl">
        {/* Título */}
        <h1 className="font-KhandBold text-4xl text-headClassMatch text-center mb-6">Términos y Condiciones</h1>

        {/* Contenido */}
        <div className="font-KhandRegular text-xl text-justify leading-8 space-y-6">
          {/* Sección 1 */}
          <div>
            <h2 className="font-KhandBold text-2xl text-headClassMatch">1. Definiciones</h2>
            <ul className="list-inside space-y-2 pl-4">
              <li><strong>1.1. ClassMatch:</strong> Plataforma digital que permite a estudiantes universitarios conectar en función de horarios disponibles.</li>
              <li><strong>1.2. Usuario:</strong> Persona registrada en ClassMatch mediante un correo institucional válido de su universidad.</li>
              <li><strong>1.3. Servicios:</strong> Funciones ofrecidas por ClassMatch, como búsqueda de compañeros, mensajería y eventos.</li>
            </ul>
          </div>

          {/* Sección 2 */}
          <div>
            <h2 className="font-KhandBold text-2xl text-headClassMatch">2. Registro y Uso de la Plataforma</h2>
            <ul className="list-inside space-y-2 pl-4">
              <li><strong>2.1. Elegibilidad:</strong> Solo los estudiantes con un correo institucional válido de universidades reconocidas en Colombia pueden registrarse.</li>
              <li><strong>2.2. Veracidad de la información:</strong> Al registrarte, garantizas que los datos proporcionados son correctos y actualizados.</li>
              <li><strong>2.3. Prohibiciones:</strong> No está permitido usar la plataforma para fines fraudulentos, ilegales o que atenten contra otros usuarios.</li>
            </ul>
          </div>

          {/* Sección 3 */}
          <div>
            <h2 className="font-KhandBold text-2xl text-headClassMatch">3. Tratamiento de Datos Personales</h2>
            <ul className="list-inside space-y-2 pl-4">
              <li><strong>3.1. Recolección de datos:</strong> Recolectamos datos como tu nombre, correo institucional, horarios disponibles y preferencias.</li>
              <li><strong>3.2. Uso de datos:</strong> Los datos se utilizan exclusivamente para conectar a estudiantes y mejorar la experiencia en la plataforma.</li>
              <li><strong>3.3. Protección de datos:</strong> ClassMatch cumple con la Ley 1581 de 2012 y el Decreto 1377 de 2013 sobre protección de datos personales en Colombia. Puedes ejercer tus derechos de acceso, rectificación y eliminación escribiendo a <a href="mailto:correo@classmatch.com" className="text-blue-800 underline">
  correo@classmatch.com
</a>.</li>
            </ul>
          </div>

          {/* Sección 4 */}
          <div>
            <h2 className="font-KhandBold text-2xl text-headClassMatch">4. Responsabilidades del Usuario</h2>
            <ul className="list-inside space-y-2 pl-4">
              <li><strong>4.1. Seguridad de la cuenta:</strong> Eres responsable de mantener la confidencialidad de tus credenciales de acceso.</li>
              <li><strong>4.2. Comportamiento:</strong> Debes actuar de manera respetuosa y responsable al interactuar con otros usuarios.</li>
            </ul>
          </div>

          {/* Sección 5 */}
          <div>
            <h2 className="font-KhandBold text-2xl text-headClassMatch">5. Limitaciones de Responsabilidad</h2>
            <ul className="list-inside space-y-2 pl-4">
              <li><strong>5.1. ClassMatch no garantiza:</strong> la compatibilidad o éxito de las conexiones realizadas a través de la plataforma.</li>
              <li><strong>5.2. No somos responsables:</strong> por el mal uso de la plataforma por parte de los usuarios.</li>
            </ul>
          </div>

          {/* Sección 6 */}
          <div>
            <h2 className="font-KhandBold text-2xl text-headClassMatch">6. Modificaciones a los Términos</h2>
            <ul className="list-inside space-y-2 pl-4">
              <li><strong>6.1. Nos reservamos:</strong> el derecho de actualizar estos términos en cualquier momento. Notificaremos los cambios a través de la plataforma.</li>
            </ul>
          </div>

          {/* Sección 7 */}
          <div>
            <h2 className="font-KhandBold text-2xl text-headClassMatch">7. Jurisdicción y Legislación Aplicable</h2>
            <ul className="list-inside space-y-2 pl-4">
              <li><strong>7.1. Estos Términos se rigen:</strong> por las leyes de la República de Colombia.</li>
              <li><strong>7.2. Cualquier disputa:</strong> será resuelta ante los tribunales competentes en Colombia.</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
