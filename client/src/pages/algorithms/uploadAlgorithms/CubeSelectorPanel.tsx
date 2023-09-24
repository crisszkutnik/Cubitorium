import {
  ChangeEvent,
  Dispatch,
  SetStateAction,
  useEffect,
  useMemo,
  useState,
} from 'react';
import {
  selectSets,
  useAlgorithmsStore,
} from '../../../modules/store/algorithmsStore';
import { ScrambleDisplay } from '../../../components/ScrambleDisplay';
import { selectCases, useCaseStore } from '../../../modules/store/caseStore';
import { Select, SelectItem } from '@nextui-org/react';
import { CaseAccount } from '../../../modules/types/case.interface';

interface Props {
  activeCase: CaseAccount | undefined;
  setActiveCase: Dispatch<SetStateAction<CaseAccount | undefined>>;
}

export function CubeSelectorPanel({ activeCase, setActiveCase }: Props) {
  const sets2 = useAlgorithmsStore(selectSets);
  const cases = useCaseStore(selectCases);

  const [selectedCategory, setSelectedCategory] = useState<string>(
    sets2.length > 0 ? sets2[0].set_name : '',
  );

  const [selectedCase, setSelectedCase] = useState<string>(
    sets2.length > 0 ? sets2[0].case_names[0] : '',
  );

  const handleCategoryChange = (event: ChangeEvent<HTMLSelectElement>) => {
    const { value } = event.target;
    setSelectedCategory(value);
    const newCase =
      sets2.find((s) => s.set_name === value)?.case_names[0] || '';
    setSelectedCase(newCase);
  };

  const handleCaseChange = (event: ChangeEvent<HTMLSelectElement>) => {
    setSelectedCase(event.target.value);
  };

  const casesForSelectedCategory = useMemo(() => {
    return cases.filter((c) => c.account.set === selectedCategory);
  }, [selectedCategory, cases]);

  useEffect(() => {
    setActiveCase(cases.find((c) => c.account.id === selectedCase));
  }, [selectedCategory, selectedCase]);

  return (
    <div className="w-1/4 h-fit drop-shadow bg-white rounded flex flex-col px-5 py-5">
      <h1 className="font-bold text-accent-dark text-2xl">Select case</h1>
      <ScrambleDisplay
        height="h-60 mb-8"
        event={'3x3'}
        scramble={activeCase?.account.setup}
      ></ScrambleDisplay>

      <Select
        labelPlacement="outside"
        defaultSelectedKeys={['3x3']}
        color="primary"
        label="Puzzle type"
        classNames={{
          label: 'text-accent-dark font-semibold text-lg',
        }}
      >
        <SelectItem key={'3x3'} value={'3x3'}>
          3x3
        </SelectItem>
      </Select>
      <Select
        labelPlacement="outside"
        defaultSelectedKeys={[sets2.length > 0 ? sets2[0].set_name : '']}
        color="primary"
        label="Algorithm category"
        onChange={handleCategoryChange}
        classNames={{
          label: 'text-accent-dark font-semibold text-lg',
          base: 'mt-10',
        }}
      >
        {sets2.map((set) => (
          <SelectItem key={set.set_name}>{set.set_name}</SelectItem>
        ))}
      </Select>
      <Select
        labelPlacement="outside"
        color="primary"
        label="Algorithm case"
        defaultSelectedKeys={[
          casesForSelectedCategory.length > 0
            ? casesForSelectedCategory[0].account.id
            : '',
        ]}
        onChange={handleCaseChange}
        disabled={casesForSelectedCategory.length === 0}
        classNames={{
          label: 'text-accent-dark font-semibold text-lg',
          base: 'mt-10',
        }}
      >
        {casesForSelectedCategory.map((c) => (
          <SelectItem key={c.account.id}>{c.account.id}</SelectItem>
        ))}
      </Select>
    </div>
  );
}
