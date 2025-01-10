import HomeCard from "./components/homeCard";
import Logo from "./components/Logo";

export default function App() {
  return (
    <>
      <div className="flex justify-center items-center bg-white min-h-screen overflow-hidden">
        <HomeCard />
        <Logo />
      </div>
    </>
  );
}
