import HomeCard from "./components/HomeCard";

export default function App() {
  return (
    <>
      <div className="flex justify-between items-center bg-backgroundClassMatch min-h-screen overflow-hidden">
        <div className="w-full flex  justify-center ">
          <HomeCard containerClassName="w-[80%]" />
        </div>
        <img
          src="/img/Home.jpg"
          alt="Logo"
          className="h-[45rem] w-[60%] overflow-y-hidden min-h-screen "
        />
      </div>
    </>
  );
}
