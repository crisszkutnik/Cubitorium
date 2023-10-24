import { Select, SelectItem } from '@nextui-org/react';
import {
  PuzzleTypeKey,
  PuzzleTypeKeys,
  getPuzzleType,
  useAlgorithmsStore,
} from '../../../modules/store/algorithmsStore';
import { useCaseStore } from '../../../modules/store/caseStore';
import { SetCase } from '../../../modules/types/globalConfig.interface';
import { ChangeEventHandler, useMemo, useState } from 'react';
import { CaseAccount } from '../../../modules/types/case.interface';
import { AddSolutionButton } from '../../../components/AddSolutionButton';
import { ScrambleDisplay2 } from '../../../components/ScrambleDisplay2';

interface Props {
  caseAccount: CaseAccount;
  onCaseChange: (caseID: string, setName: string) => void;
}

export function Top({ caseAccount, onCaseChange }: Props) {
  const cases = useCaseStore((state) => state.cases);
  const setsMap = useAlgorithmsStore((state) => state.setsMap);

  const puzzleType = getPuzzleType(caseAccount?.account.set || '');

  const [selectedPuzzleType, setPuzzleType] = useState(puzzleType);

  const [selectedSetOnSelector, setSelectedSetOnSelector] = useState(
    caseAccount.account.set,
  );

  const casesForSelectedSet = useMemo(() => {
    return cases.filter((c) => c.account.set === selectedSetOnSelector);
  }, [cases, selectedSetOnSelector]);

  const caseChangeHandler: ChangeEventHandler<HTMLSelectElement> = (e) => {
    onCaseChange(e.target.value, selectedSetOnSelector);
  };

  const onChangePuzzleType: ChangeEventHandler<HTMLSelectElement> = (e) => {
    const puzzleType = e.target.value as PuzzleTypeKey;
    setSelectedSetOnSelector(setsMap[puzzleType][0].setName);
    setPuzzleType(puzzleType);
  };

  const onChangeSet: ChangeEventHandler<HTMLSelectElement> = (e) => {
    setSelectedSetOnSelector(e.target.value);
  };

  const getDefaultSelectedCase = () => {
    if (caseAccount.account.set === selectedSetOnSelector) {
      return caseAccount?.account.id;
    }

    return '';
  };

  return (
    <div className="flex my-4 items-center">
      <div className="flex flex-col">
        <ScrambleDisplay2
          scramble={caseAccount?.account.setup}
          height="h-60"
          set={caseAccount.account.set}
        />
        <div className="flex flex-col items-center">
          <h2 className="font-bold text-lg">Setup</h2>
          <p className="text-xl">{caseAccount?.account.setup}</p>
        </div>
        <AddSolutionButton caseAccount={caseAccount} className="mt-4" />
      </div>
      <div className="flex flex-col w-full gap-10">
        <Select
          labelPlacement="outside"
          color="primary"
          label="Puzzle type"
          selectedKeys={[selectedPuzzleType]}
          items={PuzzleTypeKeys}
          onChange={onChangePuzzleType}
        >
          {PuzzleTypeKeys.map((str) => (
            <SelectItem key={str} value={str}>
              {str}
            </SelectItem>
          ))}
        </Select>
        <Select
          labelPlacement="outside"
          color="primary"
          label="Set"
          selectedKeys={[selectedSetOnSelector]}
          items={setsMap[selectedPuzzleType] as SetCase[]}
          onChange={onChangeSet}
        >
          {(set) => <SelectItem key={set.setName}>{set.setName}</SelectItem>}
        </Select>
        <Select
          labelPlacement="outside"
          color="primary"
          label="Algorithm case"
          selectedKeys={[getDefaultSelectedCase()]}
          items={casesForSelectedSet}
          onChange={caseChangeHandler}
        >
          {(c) => (
            <SelectItem key={c.account.id} value={c.publicKey.toString()}>
              {c.account.id}
            </SelectItem>
          )}
        </Select>
      </div>
    </div>
  );
}
