import {
  ChangeEvent,
  Dispatch,
  SetStateAction,
  useEffect,
  useMemo,
  useState,
} from 'react';
import {
  selectSets2,
  useAlgorithmsStore,
} from '../../../modules/store/algorithmsStore';
import { ScrambleDisplay } from '../../../components/ScrambleDisplay';
import { selectCases, useCaseStore } from '../../../modules/store/caseStore';
import { Select, SelectItem } from '@nextui-org/react';

interface Props {
  setupScramble: string;
  setSetupScramble: Dispatch<SetStateAction<string>>;
}

export function CubeSelectorPanel({ setupScramble, setSetupScramble }: Props) {
  const sets2 = useAlgorithmsStore(selectSets2);
  const cases = useCaseStore(selectCases);

  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [selectedCase, setSelectedCase] = useState<string>('');

  useEffect(() => {
    if (sets2.length > 0) {
      setSelectedCategory(sets2[0].set_name);
      setSelectedCase(sets2[0].case_names[0]);
    }
  }, [sets2]);

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

  const filteredCases = useMemo(() => {
    return cases.filter((c) => c.account.set === selectedCategory);
  }, [selectedCategory, cases]);

  useEffect(() => {
    setSetupScramble(
      cases.find((c) => c.account.id === selectedCase)?.account.setup || '',
    );
  }, [selectedCategory, selectedCase]);

  return (
    <div className="w-1/4 h-fit drop-shadow bg-white rounded flex flex-col px-5 py-5">
      <h1 className="font-bold text-accent-dark text-2xl">Select case</h1>
      <ScrambleDisplay
        height="h-60 mb-8"
        event={'3x3'}
        scramble={setupScramble}
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
          filteredCases.length > 0 ? filteredCases[0].account.id : '',
        ]}
        onChange={handleCaseChange}
        disabled={filteredCases.length === 0}
        classNames={{
          label: 'text-accent-dark font-semibold text-lg',
          base: 'mt-10',
        }}
      >
        {filteredCases.map((c) => (
          <SelectItem key={c.account.id}>{c.account.id}</SelectItem>
        ))}
      </Select>
    </div>
  );
}
