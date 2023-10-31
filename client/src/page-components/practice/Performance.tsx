import { Dispatch, SetStateAction } from 'react';
import { PerformanceCase } from '../../modules/types/case.interface';
import { ScrambleDisplay2 } from '../../components/ScrambleDisplay2';
import { decompress } from '../../modules/utils/compression';

interface Props {
  performance: PerformanceCase[];
  //Esto se va a usar para hacer el ABM de la performance
  setPerformance: Dispatch<SetStateAction<PerformanceCase[]>>;
}

export const Performance = ({ setPerformance, performance }: Props) => {
  const calculateAverage = (array: number[]): string => {
    const sum = array.reduce((a: number, b: number): number => a + b);
    return (sum / array.length).toFixed(2);
  };

  const onClick = (itemCaseId: string) => {
    let newPerformance = [...performance];
    newPerformance = newPerformance.map((item) => {
      if (item.case.account.id === itemCaseId) {
        item.history.pop();
      }
      return item;
    });
    newPerformance = newPerformance.filter((item) => item.history.length > 0);
    setPerformance(newPerformance);
  };

  return (
    <div className="w-full drop-shadow p-6 rounded bg-white mt-4">
      <div className="flex flex-col w-full justify-center items-center">
        <div className="flex flex-row items-center w-full p-6 border-b-4 justify-between">
          <h1 className="text-2xl font-bold">Performance History</h1>
          {performance.length > 0 && (
            <p>
              {'Total average: ' +
                (
                  performance.reduce((accumulator, object) => {
                    return (
                      accumulator +
                      object.history.reduce(
                        (a: number, b: number): number => a + b,
                      ) /
                        object.history.length
                    );
                  }, 0) / performance.length
                ).toFixed(2)}
            </p>
          )}
        </div>
        <table className="w-5/6 overscroll-none">
          <thead>
            <tr>
              <th>&nbsp;</th>
              <th>Case</th>
              <th>Results</th>
              <th>&nbsp;</th>
              <th>Average</th>
            </tr>
          </thead>
          <tbody>
            {performance.sort((a, b) => (calculateAverage(a.history) > calculateAverage(b.history) ? 1 : -1)).map((item) => (
              <tr key={item.case.account.id}>
                <td className="justify-center w-1/6">
                  <ScrambleDisplay2
                    scramble={decompress(item.case.account.setup)}
                    set={item.case.account.set}
                    width="w-20"
                    height="h-20"
                  />
                </td>
                <td className="text-center">{item.case.account.id}</td>
                <td>{item.history.map((i) => i.toFixed(2)).join(', ')}</td>
                <td>
                  <button onClick={() => onClick(item.case.account.id)}>
                    <img className="h-6" src="/public/delete.png" />
                  </button>
                </td>
                <td className="text-center">
                  {calculateAverage(item.history)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
