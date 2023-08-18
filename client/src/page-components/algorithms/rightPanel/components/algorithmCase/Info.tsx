import { ScrambleDisplay } from "../../../../../components/ScrambleDisplay";

export function Info() {
  return (
    <div className="w-1/5 flex flex-col items-center text-center">
      <ScrambleDisplay
        scramble="F' D F2 L2 U' R2 U' F2 D2 R2 F2 U2 F R' B F D' B2 U B'"
        height="h-36"
      />
      <div>
        <h1 className="font-semibold text-accent-dark text-3xl">F2L 1</h1>
        <p>Free pairs</p>
      </div>
      <div className="mt-3">
        <h2 className="font-semibold text-accent-dark text-xl">Setup</h2>
        <p>F R' F' R</p>
      </div>
    </div>
  );
}
