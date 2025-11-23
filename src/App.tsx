import "./App.css";
import { HamburgerButton } from "./components/HamburgerButton";
import { Sidebar } from "./components/Sidebar";
import { useSidebar } from "./hooks/useSideBar";

function App() {
  const { isOpen, togggle, close } = useSidebar();

  return (
    <div className="min-h-screen bg-black ">
      <header className="fixed top-0 left-0 bg-white shadow-md z-50 w-full">
        <div className="max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex items-center h-16 gap-4">
            <HamburgerButton isOpen={isOpen} onclick={togggle} />
            <h1 className="text-xl font-extrabold text-pink-500">
              돌려돌려 LP판
            </h1>
          </div>
        </div>
      </header>
      <Sidebar isOpen={isOpen} onClose={close} />
      <h1 className="mt-20 text-white">
        환영합니다! 돌려돌려 LP판에 오신 것을 환영합니다.
      </h1>
    </div>
  );
}

export default App;
