import {
  selectCasesBySet,
  useCaseStore,
} from '../../../modules/store/caseStore';
import { AlgorithmCase } from './components/algorithmCase/AlgorithmCase';

interface Props {
  selectedSubtype: string;
}

export function RightPanel({ selectedSubtype }: Props) {
  const cases = useCaseStore(selectCasesBySet(selectedSubtype));

  return (
    <div className="flex flex-col w-3/4 ml-6">
      {cases.map((c, index) => {
        return <AlgorithmCase caseAccount={c} key={index} />;
      })}
    </div>
  );
}
