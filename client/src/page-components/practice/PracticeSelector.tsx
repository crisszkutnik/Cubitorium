import {
  ChangeEvent,
  Dispatch,
  SetStateAction,
  useEffect,
  useMemo,
  useState,
} from 'react';
import {
  PuzzleType,
  PuzzleTypeKey,
  PuzzleTypeKeys,
  useAlgorithmsStore,
} from '../../modules/store/algorithmsStore';
import { selectCases, useCaseStore } from '../../modules/store/caseStore';
import { Select, SelectItem } from '@nextui-org/react';
import { CaseAccount } from '../../modules/types/case.interface';
import { SetCase } from '../../modules/types/globalConfig.interface';

interface Props {
  selectedPuzzle: PuzzleTypeKey;
  setSelectedPuzzle: Dispatch<SetStateAction<PuzzleTypeKey>>;
  activeCases: CaseAccount[] | undefined;
  setActiveCases: Dispatch<SetStateAction<CaseAccount[] | undefined>>;
}

export function PracticeSelector({ activeCases, 
  setActiveCases, 
  selectedPuzzle, 
  setSelectedPuzzle}: Props) {

  const [sets, setsMap] = useAlgorithmsStore((state) => [
    state.sets,
    state.setsMap,
  ]);

  const cases = useCaseStore(selectCases);
  const [selectedCategory, setSelectedCategory] = useState<string>(
    sets.length > 0 ? sets[0].set_name : '',
  );

  const [selectedCases, setSelectedCases] = useState<Set<string>>();

  const handlePuzzleChange = (event: ChangeEvent<HTMLSelectElement>) => {
    const puzzle = event.target.value as PuzzleTypeKey;
    setSelectedPuzzle(puzzle);
    setSelectedCategory(setsMap[puzzle][0].set_name);
    setSelectedCases(new Set(setsMap[puzzle][0].case_names));
  };

  const handleCategoryChange = (event: ChangeEvent<HTMLSelectElement>) => {
    const { value } = event.target;
    setSelectedCategory(value);
    const newCases = cases.filter((c) => c.account.set === value).map((c) => c.account.id);
    setSelectedCases(new Set(newCases));
  };

  const handleCaseChange = (e: ChangeEvent<HTMLSelectElement>) => {
    setSelectedCases(new Set(e.target.value.split(",")));
  };

  const casesForSelectedCategory = useMemo(() => {
    return cases.filter((c) => c.account.set === selectedCategory);
  }, [selectedCategory, cases]);

  useEffect(() => {
    setActiveCases(cases.filter((c) => selectedCases?.has(c.account.id)));
  }, [selectedCategory, selectedCases]);

  return (
    <div className="w-1/4 h-fit drop-shadow bg-white rounded flex flex-col px-5 py-5">
      <h1 className="font-bold text-accent-dark text-2xl mb-10">Select case</h1>
      <Select
        labelPlacement="outside"
        defaultSelectedKeys={[PuzzleType['3x3']]}
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
        {(set) => <SelectItem key={set.set_name}>{set.set_name}</SelectItem>}
      </Select>

      <Select
        labelPlacement="outside"
        selectionMode="multiple"
        color="primary"
        label="Algorithm cases"
        selectedKeys={selectedCases}
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
