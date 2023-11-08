import { ButtonWrapper } from '../../components/ButtonWrapper';
import { CaseAccount } from '../../modules/types/case.interface';
import { useNavigate } from 'react-router-dom';
import { SolutionAccount } from '../../modules/types/solution.interface';
import { ScrambleDisplay2 } from '../../components/ScrambleDisplay2';
import { decompress } from '../../modules/utils/compression';

interface Props {
  lastCase: CaseAccount;
  solutions: SolutionAccount[];
}

export function LastCase({ lastCase, solutions }: Props) {
  const navigate = useNavigate();

  const onClick = () => {
    navigate(
      `/algorithms/all?case=${lastCase.account.id}&set=${lastCase.account.set}`,
    );
  };

  return (
    <div className="w-full drop-shadow p-6 rounded bg-white">
      <div className="flex flex-col w-full justify-center items-center">
        <h1 className="text-2xl font-bold w-full pb-2">Last Case</h1>
        <p className="text-lg w-full">
          {decompress(lastCase.account.setup)}
        </p>
        <div className="flex flex-row w-full p-2 gap-4 items-center">
          <ScrambleDisplay2
            scramble={decompress(lastCase.account.setup)}
            set={lastCase.account.set}
            height="h-28"
            width="w-32"
          />
          <div className="flex flex-col">
            <p>Set: {lastCase.account.set}</p>
            <p>Case: {lastCase.account.id}</p>
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
