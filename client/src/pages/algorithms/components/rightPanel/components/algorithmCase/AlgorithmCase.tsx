import { Info } from "./Info";
import { Table } from "./table/Table";

export function AlgorithmCase() {
  return (
    <div className="flex drop-shadow bg-white p-3 mb-6 rounded-md">
      <Info />
      <Table />
    </div>
  );
}
