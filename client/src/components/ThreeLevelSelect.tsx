import { ChangeEvent, useEffect, useMemo, useState } from 'react';
import {
  PuzzleTypeKey,
  PuzzleTypeKeys,
  useAlgorithmsStore,
} from '../modules/store/algorithmsStore';
import { Checkbox, Select, SelectItem } from '@nextui-org/react';
import { SetCase } from '../modules/types/globalConfig.interface';

interface Props {
  column?: boolean;
  onSetChange?: (set: string) => void;
  useAllSets: boolean;
  onAllSetsChange: () => void;
  runOnStart?: boolean;
  selectedPuzzle: PuzzleTypeKey;
  setSelectedPuzzle: (puzzle: PuzzleTypeKey) => void;
  setsWithSolutions?: string[];
}

export function ThreeLevelSelect({
  column,
  onSetChange,
  onAllSetsChange,
  useAllSets,
  runOnStart,
  selectedPuzzle,
  setSelectedPuzzle,
  setsWithSolutions,
}: Props) {
  const setsMap = useAlgorithmsStore((state) => state.setsMap);

  const [selectedSet, setSelectedSet] = useState(
    setsMap[selectedPuzzle][0].setName,
  );

  const disabledKeys = useMemo(() => {
    if (!setsWithSolutions) {
      return [];
    }

    return setsMap[selectedPuzzle].reduce((keys, item) => {
      const { setName } = item;

      if (!setsWithSolutions.includes(setName)) {
        keys.push(setName);
      }

      return keys;
    }, [] as string[]);
  }, [setsWithSolutions, selectedPuzzle]);

  useEffect(() => {
    if (!runOnStart) {
      return;
    }

    if (onSetChange) {
      onSetChange(selectedSet);
    }
  }, []);

  const handlePuzzleChange = (event: ChangeEvent<HTMLSelectElement>) => {
    const puzzle = event.target.value as PuzzleTypeKey;

    if (!puzzle || puzzle === selectedPuzzle) {
      return;
    }

    const newSet = setsMap[puzzle][0].setName;

    setSelectedPuzzle(puzzle);
    setSelectedSet(newSet);

    if (onSetChange) {
      onSetChange(newSet);
    }
  };

  const handleSetChange = (event: ChangeEvent<HTMLSelectElement>) => {
    const { value } = event.target;

    if (!value || value === selectedSet) {
      return;
    }

    setSelectedSet(value);

    if (onSetChange) {
      onSetChange(value);
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
        isDisabled={useAllSets}
        disabledKeys={disabledKeys}
      >
        {(set) => <SelectItem key={set.setName}>{set.setName}</SelectItem>}
      </Select>

      <div className="whitespace-nowrap flex items-end mb-2">
        <Checkbox onChange={onAllSetsChange}>All sets</Checkbox>
      </div>
    </div>
  );
}
