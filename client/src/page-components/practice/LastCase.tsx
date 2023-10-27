import { ButtonWrapper } from '../../components/ButtonWrapper';
import { PerformanceCase } from '../../modules/types/case.interface';
import { useNavigate } from 'react-router-dom';
import { SolutionAccount } from '../../modules/types/solution.interface';
import { ScrambleDisplay2 } from '../../components/ScrambleDisplay2';
import { decompress } from '../../modules/utils/compression';

interface Props {
  performance: PerformanceCase;
  solutions: SolutionAccount[];
}

export function LastCase({ performance, solutions }: Props) {
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
        <p className="text-lg w-full">
          {decompress(performance.case.account.setup)}
        </p>
        <div className="flex flex-row w-full p-2 gap-4 items-center">
          <ScrambleDisplay2
            scramble={decompress(performance.case.account.setup)}
            set={performance.case.account.set}
            height="h-28"
            width="w-32"
          />
          <div className="flex flex-col">
            <p>Set: {performance.case.account.set}</p>
            <p>Case: {performance.case.account.id}</p>
          </div>
        </div>
        <div className="flex flex-col w-full">
          <h2 className="font-bold">Solution</h2>
          <p className="mb-2">{decompress(solutions[0].account.moves)}</p>
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
