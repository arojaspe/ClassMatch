import HomeCard from "./components/homeCard";

import { AuthProvider } from "./context/AuthContext";

export default function App() {
  return (
    <>
      <AuthProvider>
        <div className="flex justify-between items-center bg-backgroundClassMatch min-h-screen overflow-hidden">
          <div className="w-full flex  justify-center ">
            <HomeCard containerClassName="w-[80%]" />
          </div>
          <img src="/img/Hometest.png" alt="HomeImage" className="h-[89vh]" />
        </div>
      </AuthProvider>
    </>
  );
}
