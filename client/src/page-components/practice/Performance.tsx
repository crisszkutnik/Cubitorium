import {
  Dispatch,
  SetStateAction,
} from 'react';
import { TwistyPlayer } from "./TwistyPlayer";
import { PerformanceCase } from '../../modules/types/case.interface';

interface Props {
  selectedPuzzle: string;
  performance: PerformanceCase[];
  //Esto se va a usar para hacer el ABM de la performance
  setPerformance:  Dispatch<SetStateAction<PerformanceCase[]>>;
}

export const Performance = ({ 
  selectedPuzzle,
  performance, 
  setPerformance}: Props) => {

  const calculateAverage = (array: number[]): string => {
      const sum = array.reduce((a: number, b: number): number => a + b);
      return (sum / array.length).toFixed(2);
  };

  return (
    <div className="flex flex-col items-center w-full py-4">
      <div className="flex flex-col items-center bg-gray-300 rounded-lg w-3/4 pb-4">
        <div className="flex flex-row items-center w-full p-6 border-b-4">
          <h1 className="text-2xl font-bold w-full">Performance History</h1>
        </div>
        <table className="w-5/6">
          <thead>
            <tr>
              <th>&nbsp;</th>
              <th>Case</th>
              <th>Results</th>
              <th>Average</th>
            </tr>
          </thead>
          <tbody>
                {performance.map((item) => (
                  <tr key={item.case.account.id}>
                    <td className="justify-center w-1/6"><TwistyPlayer puzzle={selectedPuzzle} algorithm={item.case.account.setup} size="70"></TwistyPlayer></td>
                    <td className="text-center">{item.case.account.id}</td>
                    <td>{item.history.join(', ')}</td>
                    <td className="text-center">{calculateAverage(item.history)}</td>
                  </tr>
                ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
