import Logo from "./Logo";

interface HomeCardProps {
  containerClassName?: string;
  sectionClassName?: string;
  logoClassName?: string;
  titleClassName?: string;
  descriptionClassName?: string;
}

export default function HomeCard({
  containerClassName = "",
  sectionClassName = "",
  logoClassName = "",
  titleClassName = "",
  descriptionClassName = "",
}: HomeCardProps) {
  return (
    <div
      className={`bg-mainClassMatch bg-opacity-35 h-min w-[45rem] p-6 rounded-xl ${containerClassName}`}
    >
      <section
        className={`flex h-30 items-center mx-8 justify-between mb-5 w-auto ${sectionClassName}`}
      >
        <Logo className={`w-40 h-min ${logoClassName}`} fill="#004954" />
        <p
          className={`font-KhandBold text-[2.5rem] pl-4 leading-10 text-headClassMatch ${titleClassName}`}
        >
          ClassMatch: Conecta con tus compañeros, optimiza tu tiempo
        </p>
      </section>
      <section className={`h-min ${sectionClassName}`}>
        <p
          className={`font-KhandRegular text-xl text-justify px-6 leading-6 ${descriptionClassName}`}
        >
          Descubre una nueva forma de socializar en tu universidad. ClassMatch
          te ayuda a conectar con otros estudiantes según tus horarios
          disponibles, facilitando encuentros y relaciones significativas.
          Regístrate con tu correo institucional y comienza a explorar un
          entorno diseñado exclusivamente para ti.
        </p>
      </section>
    </div>
  );
}
