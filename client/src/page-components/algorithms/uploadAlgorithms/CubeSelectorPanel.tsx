import {
  ChangeEvent,
  Dispatch,
  SetStateAction,
  useEffect,
  useMemo,
  useState,
} from 'react';
import {
  PuzzleTypeKey,
  PuzzleTypeKeys,
  useAlgorithmsStore,
} from '../../../modules/store/algorithmsStore';
import { ScrambleDisplay } from '../../../components/ScrambleDisplay';
import { selectCases, useCaseStore } from '../../../modules/store/caseStore';
import { Select, SelectItem } from '@nextui-org/react';
import { CaseAccount } from '../../../modules/types/case.interface';
import { SetCase } from '../../../modules/types/globalConfig.interface';

interface Props {
  activeCase: CaseAccount | undefined;
  setActiveCase: Dispatch<SetStateAction<CaseAccount | undefined>>;
}

// Este componente es un asco la verdad

export function CubeSelectorPanel({ activeCase, setActiveCase }: Props) {
  const [setsMap] = useAlgorithmsStore((state) => [state.setsMap]);
  const cases = useCaseStore(selectCases);

  const [selectedPuzzle, setSelectedPuzzle] = useState<PuzzleTypeKey>('3x3');

  const [selectedCategory, setSelectedCategory] = useState<string>(
    setsMap['3x3'][0]?.set_name || '',
  );

  const [selectedCase, setSelectedCase] = useState<string>(
    setsMap['3x3'][0]?.case_names[0] || '',
  );

  const handlePuzzleChange = (event: ChangeEvent<HTMLSelectElement>) => {
    const puzzle = event.target.value as PuzzleTypeKey;

    if (!puzzle || puzzle === selectedPuzzle) {
      return;
    }

    setSelectedPuzzle(puzzle);
    setSelectedCategory(setsMap[puzzle][0].set_name);
    setSelectedCase(setsMap[puzzle][0].case_names[0]);
  };

  const handleCategoryChange = (event: ChangeEvent<HTMLSelectElement>) => {
    const { value } = event.target;

    if (!value || value === selectedCategory) {
      return;
    }

    setSelectedCategory(value);
    const newCase = cases.find((c) => c.account.set === value);
    setSelectedCase(newCase?.account.id || '');
  };

  const handleCaseChange = (event: ChangeEvent<HTMLSelectElement>) => {
    const { value } = event.target;

    if (value && value !== selectedCase) {
      setSelectedCase(event.target.value);
    }
  };

  const casesForSelectedCategory = useMemo(() => {
    return cases.filter((c) => c.account.set === selectedCategory);
  }, [selectedCategory, cases]);

  useEffect(() => {
    setActiveCase(
      cases.find((c) => {
        return (
          c.account.id === selectedCase && c.account.set === selectedCategory
        );
      }),
    );
  }, [selectedCategory, selectedCase]);

  return (
    <div className="w-1/4 h-fit drop-shadow bg-white rounded flex flex-col px-5 py-5">
      <h1 className="font-bold text-accent-dark text-2xl">Select case</h1>
      <ScrambleDisplay
        height="h-60 mb-8"
        event={selectedPuzzle}
        scramble={activeCase?.account.setup}
      ></ScrambleDisplay>

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
        selectedKeys={[selectedCategory]}
        color="primary"
        label="Algorithm category"
        onChange={handleCategoryChange}
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
        disabled={casesForSelectedCategory.length === 0}
        classNames={{
          label: 'text-accent-dark font-semibold text-lg',
          base: 'mt-10',
        }}
        items={casesForSelectedCategory}
      >
        {(c) => <SelectItem key={c.account.id}>{c.account.id}</SelectItem>}
      </Select>
    </div>
  );
}
