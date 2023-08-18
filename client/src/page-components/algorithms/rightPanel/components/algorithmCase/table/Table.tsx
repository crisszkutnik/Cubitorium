import { Link } from "react-router-dom";
import { TableRow } from "./TableRow";

export function Table() {
  const values = ["Front right", "Front left", "Back left", "Back right"];

  return (
    <div className="w-4/5 flex flex-col">
      <div>
        <div className="flex">
          {values.map((s, index) => (
            <p
              className={
                "px-3 py-1 rounded-t hover:cursor-pointer font-semibold" +
                (index === 0
                  ? " bg-accent-primary text-white"
                  : " hover:bg-accent-primary/[0.7] hover:text-white text-accent-primary")
              }
            >
              {s}
            </p>
          ))}
        </div>
        <hr className="bg-accent-primary h-0.5 border-0" />
      </div>
      <div>
        <TableRow solution="U R U’ R’" />
        <TableRow solution="R´F R F´" />
        <TableRow solution="y’ r’ U’ R U M’" />
        <TableRow solution="M’ U R U’ r’" />
      </div>
      <div className="flex justify-center items-center h-full mt-3">
        <Link
          to="/algorithms/all"
          className="border border-accent-primary rounded px-2 py-1 text-accent-primary hover:text-white hover:bg-accent-primary font-semibold"
        >
          + More algorithms
        </Link>
      </div>
    </div>
  );
}
