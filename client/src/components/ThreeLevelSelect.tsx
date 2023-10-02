import { ChangeEvent, useEffect, useMemo, useState } from 'react';
import {
  PuzzleType,
  PuzzleTypeKey,
  PuzzleTypeKeys,
  useAlgorithmsStore,
} from '../modules/store/algorithmsStore';
import { useCaseStore } from '../modules/store/caseStore';
import { Select, SelectItem } from '@nextui-org/react';
import { SetCase } from '../modules/types/globalConfig.interface';

interface Props {
  column?: boolean;
  onSetChange?: (set: string) => void;
  onCaseChange?: (caseId: string) => void;
  runOnStart?: boolean;
}

export function ThreeLevelSelect({
  column,
  onSetChange,
  onCaseChange,
  runOnStart,
}: Props) {
  const setsMap = useAlgorithmsStore((state) => state.setsMap);
  const cases = useCaseStore((state) => state.cases);

  const [selectedPuzzle, setSelectedPuzzle] = useState<PuzzleTypeKey>(
    PuzzleType['3x3'],
  );

  const [selectedSet, setSelectedSet] = useState(
    setsMap[selectedPuzzle][0].set_name,
  );

  const [selectedCase, setSelectedCase] = useState(
    setsMap[selectedPuzzle][0].case_names[0],
  );

  const casesForSelectedSet = useMemo(() => {
    return cases.filter((c) => c.account.set === selectedSet);
  }, [selectedSet, selectedCase]);

  useEffect(() => {
    if (!runOnStart) {
      return;
    }

    if (onSetChange) {
      onSetChange(selectedSet);
    }

    if (onCaseChange) {
      onCaseChange(selectedCase);
    }
  }, []);

  const handlePuzzleChange = (event: ChangeEvent<HTMLSelectElement>) => {
    const puzzle = event.target.value as PuzzleTypeKey;

    if (!puzzle || puzzle === selectedPuzzle) {
      return;
    }

    const newSet = setsMap[puzzle][0].set_name;
    const newCaseId = setsMap[puzzle][0].case_names[0];

    setSelectedPuzzle(puzzle);
    setSelectedSet(newSet);
    setSelectedCase(newCaseId);

    if (onSetChange) {
      onSetChange(newSet);
    }

    if (onCaseChange) {
      onCaseChange(newCaseId);
    }
  };

  const handleSetChange = (event: ChangeEvent<HTMLSelectElement>) => {
    const { value } = event.target;

    if (!value || value === selectedSet) {
      return;
    }

    setSelectedSet(value);
    const newCase = cases.find((c) => c.account.set === value);
    const newCaseId = newCase?.account.id || '';
    setSelectedCase(newCaseId);

    if (onSetChange) {
      onSetChange(value);
    }

    if (onCaseChange) {
      onCaseChange(newCaseId);
    }
  };

  const handleCaseChange = (event: ChangeEvent<HTMLSelectElement>) => {
    const { value } = event.target;

    if (value && value !== selectedCase) {
      setSelectedCase(event.target.value);

      if (onCaseChange) {
        onCaseChange(value);
      }
    }
  };

  const getClassName = () => {
    let className = 'flex gap-5 ';

    if (column) {
      className += ' flex-col';
    }

    return className;
  };

  return (
    <div className={getClassName()}>
      <Select
        labelPlacement="outside"
        selectedKeys={[selectedPuzzle]}
        color="primary"
        label="Puzzle type"
        onChange={handlePuzzleChange}
        classNames={{
          label: 'text-accent-dark font-semibold text-lg',
        }}
      >
        {PuzzleTypeKeys.map((str) => (
          <SelectItem key={str} value={str}>
            {str}
          </SelectItem>
        ))}
      </Select>

      <Select
        labelPlacement="outside"
        selectedKeys={[selectedSet]}
        color="primary"
        label="Algorithm set"
        onChange={handleSetChange}
        classNames={{
          label: 'text-accent-dark font-semibold text-lg',
          base: 'mt-10',
        }}
        items={setsMap[selectedPuzzle] as SetCase[]}
      >
        {(set) => <SelectItem key={set.set_name}>{set.set_name}</SelectItem>}
      </Select>

      <Select
        labelPlacement="outside"
        color="primary"
        label="Algorithm case"
        selectedKeys={[selectedCase]}
        onChange={handleCaseChange}
        disabled={casesForSelectedSet.length === 0}
        classNames={{
          label: 'text-accent-dark font-semibold text-lg',
          base: 'mt-10',
        }}
        items={casesForSelectedSet}
      >
        {(c) => <SelectItem key={c.account.id}>{c.account.id}</SelectItem>}
      </Select>
    </div>
  );
}
