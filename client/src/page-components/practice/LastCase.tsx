import { TwistyPlayer } from './TwistyPlayer';
import { CaseAccount } from '../../modules/types/case.interface';
import { PerformanceCase } from '../../modules/types/case.interface';

interface Props {
  selectedPuzzle: string;
  performance: PerformanceCase;
}

export function LastCase({ selectedPuzzle, performance }: Props) {
  return (
    <div className="w-full drop-shadow p-6 rounded bg-white">
      <div className="flex flex-col w-full justify-center items-center">
        <h1 className="text-2xl font-bold w-full">Last Case</h1>
        <p className="text-lg font-bold w-full">
            {performance.case.account.setup}
          </p>
        <div className="flex flex-row w-full p-2 gap-4 items-center">
          <TwistyPlayer
            puzzle={selectedPuzzle}
            algorithm={performance.case.account.setup}
            size="70"
          ></TwistyPlayer>
          <div className='flex flex-col'>
            <p>Set: {performance.case.account.set}</p>
            <p>Case: {performance.case.account.id}</p>
          
          </div>
          
        </div>
      </div>
    </div>
  );
}
