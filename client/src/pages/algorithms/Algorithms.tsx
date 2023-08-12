import { LeftPanel } from "./components/LeftPanel";
import { RightPanel } from "./components/rightPanel/RightPanel";
import { TopSelector } from "./components/TopSelector";

export function Algorithms() {
  return (
    <div className="flex justify-center w-full">
      <div className="flex w-full flex-col max-w-screen-xl	">
        <h1 className="text-4xl py-6 text-accent-dark font-bold">Algorithms</h1>
        <TopSelector />
        <div className="flex mt-3">
          <LeftPanel />
          <RightPanel />
        </div>
      </div>
    </div>
  );
}
