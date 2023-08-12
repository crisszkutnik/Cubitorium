import { LeftPanel } from "./components/LeftPanel";
import { RightPanel } from "./components/rightPanel/RightPanel";
import { Selector } from "./components/Selector";

export function Algorithms() {
  return (
    <div className="flex justify-center w-full">
      <div className="flex w-full flex-col max-w-screen-xl	">
        <h1 className="text-4xl py-6 text-accent-dark font-bold">Algoritmos</h1>
        <Selector />
        <div className="flex mt-3">
          <LeftPanel />
          <RightPanel />
        </div>
      </div>
    </div>
  );
}
