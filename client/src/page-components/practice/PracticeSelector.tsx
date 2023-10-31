import {
  ChangeEvent,
  Dispatch,
  SetStateAction,
  useEffect,
  useMemo,
  useState,
} from 'react';
import { useSearchParams } from 'react-router-dom';
import {
  PuzzleType,
  PuzzleTypeKey,
  PuzzleTypeKeys,
  useAlgorithmsStore,
} from '../../modules/store/algorithmsStore';
import {
  selectCases,
  selectCasesBySet,
  useCaseStore,
} from '../../modules/store/caseStore';
import { Select, SelectItem } from '@nextui-org/react';
import {
  CaseAccount,
  PerformanceCase,
} from '../../modules/types/case.interface';
import { SetCase } from '../../modules/types/globalConfig.interface';
import { ButtonWrapper } from '../../components/ButtonWrapper';
import { shallow } from 'zustand/shallow';
import {
  selectLikedSolutionsForCases,
  useSolutionStore,
} from '../../modules/store/solutionStore';
import { useLikeStore } from '../../modules/store/likeStore';
import { useUserStore } from '../../modules/store/userStore';

interface Props {
  selectedPuzzle: string;
  setSelectedPuzzle: Dispatch<SetStateAction<string>>;
  setActiveCases: Dispatch<SetStateAction<CaseAccount[] | undefined>>;
  setPerformance: Dispatch<SetStateAction<PerformanceCase[]>>;
}

enum QueryParams {
  PUZZLE = 'puzzle',
  SET = 'set',
  CASES = 'cases',
}

export function PracticeSelector({
  setActiveCases,
  selectedPuzzle,
  setSelectedPuzzle,
  setPerformance,
}: Props) {
  const [sets, setsMap] = useAlgorithmsStore((state) => [
    state.sets,
    state.setsMap,
  ]);

  const [selectedSet, setSelectedSet] = useState<string>(
    sets.length > 0 ? sets[0].setName : '',
  );

  const [cases, casesMap] = useCaseStore((state) => [
    selectCasesBySet(selectedSet)(state),
    state.casesMap,
  ]);

  const [selectedCases, setSelectedCases] = useState<Set<string>>();

  const likesMap = useLikeStore((state) => state.likesMap);

  const { isLogged } = useUserStore();

  const solutions = useSolutionStore(
    (state) =>
      isLogged ? selectLikedSolutionsForCases(likesMap, cases)(state) : [],
    shallow,
  );

  const handlePuzzleChange = (event: ChangeEvent<HTMLSelectElement>) => {
    const newValue = event.target.value;
    searchParams.set(QueryParams.PUZZLE, newValue);

    const value = getSetValue(newValue as PuzzleTypeKey);

    if (value) {
      searchParams.set(QueryParams.SET, value);
    } else {
      searchParams.delete(QueryParams.SET);
    }

    setSearchParams(searchParams);
    setPerformance([]);
  };

  const handleSetChange = (event: ChangeEvent<HTMLSelectElement>) => {
    searchParams.set(QueryParams.SET, event.target.value);
    setSearchParams(searchParams);
    setPerformance([]);
  };

  const handleCaseChange = (e: ChangeEvent<HTMLSelectElement>) => {
    searchParams.set(QueryParams.CASES, e.target.value);
    setSearchParams(searchParams);
  };

  useEffect(() => {
    setActiveCases(
      cases.filter(
        (c) => selectedCases?.has(c.account.id) && c.account.set == selectedSet,
      ),
    );
  }, [selectedSet, selectedCases]);

  const [searchParams, setSearchParams] = useSearchParams();

  useEffect(() => {
    const queryPuzzle = searchParams.get(QueryParams.PUZZLE);
    const querySet = searchParams.get(QueryParams.SET);
    const queryCases = searchParams.get(QueryParams.CASES);

    const puzzleParamChanged = shouldUpdatePuzzleParam(
      queryPuzzle,
      searchParams,
    );

    const setParamChanged = shouldUpdateSetParam(querySet, searchParams);

    const casesParamChanged = shouldUpdateCasesParam(
      querySet,
      queryCases,
      searchParams,
    );

    if (puzzleParamChanged || setParamChanged || casesParamChanged) {
      setSearchParams(searchParams);
    }
  }, [searchParams, sets]);

  const getSetValue = (puzzle: PuzzleTypeKey | null) => {
    if (sets.length === 0) {
      return '';
    }
    if (puzzle === null) {
      return sets[0].setName;
    }

    return setsMap[puzzle][0].setName;
  };

  const getCasesValue = (set: string | null) => {
    if (sets.length === 0) {
      return [];
    }

    return cases.filter((c) => c.account.set == set);
  };

  const shouldUpdatePuzzleParam = (
    queryPuzzle: string | null,
    params: URLSearchParams,
  ) => {
    if (!queryPuzzle) {
      params.set(QueryParams.PUZZLE, PuzzleType['3x3']);
      return true;
    }

    if (queryPuzzle && queryPuzzle !== selectedPuzzle) {
      setSelectedPuzzle(queryPuzzle);
    }

    return false;
  };

  const shouldUpdateSetParam = (
    querySet: string | null,
    params: URLSearchParams,
  ) => {
    if (querySet && querySet !== selectedSet) {
      setSelectedSet(querySet);
      return false;
    }
    if (!querySet) {
      const value = getSetValue(selectedPuzzle as PuzzleTypeKey | null);
      if (value) {
        params.set(QueryParams.SET, value);
        return true;
      }
    }
    return false;
  };

  const shouldUpdateCasesParam = (
    querySet: string | null,
    queryCases: string | null,
    params: URLSearchParams,
  ) => {
    if (queryCases && queryCases != Array.from(selectedCases || []).join(',')) {
      const queryCasesArray = queryCases.split(',');
      setSelectedCases(new Set(queryCasesArray));
      return false;
    }
    if (querySet != selectedSet) {
      const value = getCasesValue(querySet);
      const valueString = Array.from(value!)
        .map((c) => c.account.id)
        .join(',');

      if (value) {
        params.set(QueryParams.CASES, valueString);
        return true;
      }
    }
    if (!queryCases) {
      setSelectedCases(new Set([]));
    }

    return false;
  };

  const onSelectAll = () => {
    const value = getCasesValue(selectedSet);
    const valueArray = Array.from(value!).map((c) => c.account.id);
    setSelectedCases(new Set(valueArray));
    const joinedArray = valueArray.join(',');
    searchParams.set(QueryParams.CASES, joinedArray);
    setSearchParams(searchParams);
  };

  const onSelectNone = () => {
    setSelectedCases(new Set([]));
    searchParams.set(QueryParams.CASES, Array.from([]).join(','));
    setSearchParams(searchParams);
  };

  const onSelectLearning = () => {
    const solutionsIds = solutions
      .map((s) => casesMap[s.account.case.toString()].account.id)
      .sort((idA, idB) => {
        const numA = Number(idA);
        const numB = Number(idB);
        return numA > numB ? 1 : -1;
      });
    setSelectedCases(new Set(solutionsIds));
    const joinedArray = solutionsIds.join(',');
    searchParams.set(QueryParams.CASES, joinedArray);
    setSearchParams(searchParams);
  };

  return (
    <div className="w-full h-fit drop-shadow bg-white rounded flex flex-col px-5 py-5">
      <h1 className="font-bold text-accent-dark text-2xl mb-10">Select case</h1>
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
        items={setsMap[selectedPuzzle as PuzzleTypeKey] as SetCase[]}
      >
        {(set) => <SelectItem key={set.setName}>{set.setName}</SelectItem>}
      </Select>

      <Select
        labelPlacement="outside"
        selectionMode="multiple"
        placeholder="Select cases"
        color="primary"
        label="Algorithm cases"
        selectedKeys={selectedCases}
        onChange={handleCaseChange}
        disabled={cases.length === 0}
        classNames={{
          label: 'text-accent-dark text-lg',
          base: 'mt-2',
        }}
        items={cases}
      >
        {(c) => <SelectItem key={c.account.id}>{c.account.id}</SelectItem>}
      </Select>
      <div className="flex flex-col gap-2 justify-center">
        <div className="flex flex-row gap-2 justify-center mt-4">
          <ButtonWrapper
            onClick={() => onSelectAll()}
            text="Select All"
            variant="shadow"
          />
          <ButtonWrapper
            onClick={() => onSelectNone()}
            text="Select None"
            variant="shadow"
          />
        </div>
        {isLogged && (
          <ButtonWrapper
            onClick={() => onSelectLearning()}
            text="Select Learning"
            variant="shadow"
          />
        )}
      </div>
    </div>
  );
}
