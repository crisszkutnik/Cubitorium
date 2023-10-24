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
  getPuzzleType,
  useAlgorithmsStore,
} from '../../../modules/store/algorithmsStore';
import { selectCases, useCaseStore } from '../../../modules/store/caseStore';
import { Select, SelectItem } from '@nextui-org/react';
import { CaseAccount } from '../../../modules/types/case.interface';
import { SetCase } from '../../../modules/types/globalConfig.interface';
import { useSearchParams } from 'react-router-dom';
import { ScrambleDisplay2 } from '../../../components/ScrambleDisplay2';

interface Props {
  activeCase: CaseAccount | undefined;
  setActiveCase: Dispatch<SetStateAction<CaseAccount | undefined>>;
}

// Este componente es un asco la verdad

export function CubeSelectorPanel({ activeCase, setActiveCase }: Props) {
  const [searchParams] = useSearchParams();

  const setsMap = useAlgorithmsStore((state) => state.setsMap);
  const cases = useCaseStore(selectCases);

  const [selectedPuzzle, setSelectedPuzzle] = useState<PuzzleTypeKey>('3x3');

  const [selectedCategory, setSelectedCategory] = useState<string>(
    setsMap['3x3'][0]?.setName || '',
  );

  const [selectedCase, setSelectedCase] = useState<string>(
    setsMap['3x3'][0]?.caseNames[0] || '',
  );

  useEffect(() => {
    const querySet = searchParams.get('set');

    const queryCase = searchParams.get('case');

    if (!querySet || !queryCase) {
      return;
    }

    const puzzle = getPuzzleType(querySet);

    setSelectedPuzzle(puzzle);
    setSelectedCategory(querySet);
    setSelectedCase(queryCase);
  });

  const handlePuzzleChange = (event: ChangeEvent<HTMLSelectElement>) => {
    const puzzle = event.target.value as PuzzleTypeKey;

    if (!puzzle || puzzle === selectedPuzzle) {
      return;
    }

    setSelectedPuzzle(puzzle);
    setSelectedCategory(setsMap[puzzle][0].setName);
    setSelectedCase(setsMap[puzzle][0].caseNames[0]);
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
      <ScrambleDisplay2
        height="h-60 mb-8"
        scramble={activeCase?.account.setup}
        set={activeCase?.account.set || ''}
      />

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
        label="Algorithm set"
        onChange={handleCategoryChange}
        classNames={{
          label: 'text-accent-dark font-semibold text-lg',
          base: 'mt-10',
        }}
        items={setsMap[selectedPuzzle] as SetCase[]}
      >
        {(set) => <SelectItem key={set.setName}>{set.setName}</SelectItem>}
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
