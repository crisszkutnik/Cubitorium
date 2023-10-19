import { TwistyPlayer } from './TwistyPlayer';
import { ButtonWrapper } from '../../components/ButtonWrapper';
import { PerformanceCase } from '../../modules/types/case.interface';
import { useNavigate } from 'react-router-dom';
import { SolutionAccount } from '../../modules/types/solution.interface';

interface Props {
  selectedPuzzle: string;
  performance: PerformanceCase;
  solutions: SolutionAccount[];
}

export function LastCase({ selectedPuzzle, performance, solutions }: Props) {
  const navigate = useNavigate();

  const onClick = () => {
    navigate(
      `/algorithms/all?case=${performance.case.account.id}&set=${performance.case.account.set}`,
    );
  };

  return (
    <div className="w-full drop-shadow p-6 rounded bg-white">
      <div className="flex flex-col w-full justify-center items-center">
        <h1 className="text-2xl font-bold w-full pb-2">Last Case</h1>
        <p className="text-lg w-full">{performance.case.account.setup}</p>
        <div className="flex flex-row w-full p-2 gap-4 items-center">
          <TwistyPlayer
            puzzle={selectedPuzzle}
            algorithm={performance.case.account.setup}
            size="70"
          ></TwistyPlayer>
          <div className="flex flex-col">
            <p>Set: {performance.case.account.set}</p>
            <p>Case: {performance.case.account.id}</p>
          </div>
        </div>
        <div className="flex flex-col w-full">
          <h2 className="font-bold">Solution</h2>
          <p className="mb-2">{solutions[0].account.moves}</p>
          <ButtonWrapper
            onClick={() => onClick()}
            text="See case"
            variant="shadow"
          />
        </div>
      </div>
    </div>
  );
}