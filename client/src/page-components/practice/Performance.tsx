import { TwistyPlayer } from "./TwistyPlayer";

export const Performance = () => {
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
            <tr>
                <td className="justify-center w-1/6"><TwistyPlayer puzzle="3x3x3" algorithm="R U2 R' U' R U' R'" size="70"></TwistyPlayer></td>
                <td className="text-center">Aa</td>
                <td className="text-center">0.00</td>
                <td className="text-center">0.00</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
};
