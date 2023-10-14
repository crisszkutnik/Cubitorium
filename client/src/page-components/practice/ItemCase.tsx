import { PuzzleTypeKey } from '../../modules/store/algorithmsStore';
import { Case } from '../../modules/types/case.interface';
import { TwistyPlayer } from './TwistyPlayer';

interface CaseProps {
  selectedPuzzle: PuzzleTypeKey;
  caseDetail: Case;
}

export function ItemCase({ selectedPuzzle, caseDetail }: CaseProps) {
  function handleShowCases() {}
  return (
    <div
      className="flex flew-row items-center w-full border-2 border-accent-dark rounded p-2 cursor-pointer"
      onClick={handleShowCases}
    >
      <TwistyPlayer
        puzzle={selectedPuzzle}
        algorithm={caseDetail.setup}
        size="60"
      ></TwistyPlayer>
      <p className="pl-2">{caseDetail.id}</p>
    </div>
  );
}
