import Logo from "./Logo";

export default function HomeCard() {
  return (
    <>
      <div className="bg-mainClassMatch bg-opacity-35 h-min w-[45rem] p-6 rounded-xl">
        <section className="flex h-30 items-center mx-8 justify-between mb-5 w-auto ">
          <Logo className="w-40 h-min" fill="#004954" />
          <p className="font-KhandBold text-[2.5rem] pl-4 leading-10 text-headClassMatch">
            ClassMatch: Conecta con tus compañeros, optimiza tu tiempo
          </p>
        </section>
        <section className="h-min">
          <p className="font-KhandRegular text-lg text-justify px-6 leading-6 ">
            Descubre una nueva forma de socializar en tu universidad. ClassMatch
            te ayuda a conectar con otros estudiantes según tus horarios
            disponibles, facilitando encuentros y relaciones significativas.
            Regístrate con tu correo institucional y comienza a explorar un
            entorno diseñado exclusivamente para ti.
          </p>
        </section>
      </div>
    </>
  );
}
