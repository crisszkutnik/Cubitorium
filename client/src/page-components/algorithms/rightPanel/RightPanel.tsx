import { selectCases, useCaseStore } from '../../../modules/store/caseStore';
import { AlgorithmCase } from './components/algorithmCase/AlgorithmCase';

export function RightPanel() {
  const cases = useCaseStore(selectCases);

  return (
    <div className="flex flex-col w-3/4 ml-6">
      {cases.map((c, index) => {
        return <AlgorithmCase caseAccount={c} key={index} />;
      })}
    </div>
  );
}
