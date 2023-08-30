import { useMemo } from "react";
import { DefaultLayout } from "../../../components/layout/DefaultLayout";
import { Select } from "../../../components/Select";

export function AllAlgorithms() {
  const data = useMemo(
    () => Array(100).fill({ algorithm: "U R U' R'", votes: 50 }),
    []
  );

  const getRowClass = (index: number) => {
    if (index % 2 === 0) {
      return "bg-accent-primary/10";
    }

    return "bg-accent-primary/5";
  };

  return (
    <DefaultLayout column={true}>
      <h1 className="text-accent-dark font-semibold my-6 text-4xl">
        All user-submitted algorithms
      </h1>
      <div className="flex justify-between mb-4 gap-24">
        <Select
          type="primary"
          values={["Free pairs", "Free pairs"]}
          title="Algorithm type"
          onChange={() => {}}
          className="w-full"
        />
        <Select
          type="secondary"
          values={["Free pairs", "Free pairs"]}
          title="Algorithm subtype"
          onChange={() => {}}
          className="w-full"
        />
        <Select
          type="tertiary"
          values={["Free pairs", "Free pairs"]}
          title="Algorithm subtype"
          onChange={() => {}}
          className="w-full"
        />
        <Select
          type="tertiary"
          values={["Free pairs", "Free pairs"]}
          title="Algorithm subtype"
          onChange={() => {}}
          className="w-full"
        />
      </div>
      <div>
        <table className="text-left w-full">
          <thead className="bg-accent-primary text-white">
            <tr>
              <th className="p-2 pl-4">Algorithm</th>
              <th className="p-2"></th>
              <th className="p-2">Votes</th>
            </tr>
          </thead>
          <tbody>
            {data.map((d, index) => (
              <tr key={index} className={getRowClass(index)}>
                <td className="p-2 pl-4">{d.algorithm}</td>
                <td className="p-2"></td>
                <td className="p-2">{d.votes}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </DefaultLayout>
  );
}
