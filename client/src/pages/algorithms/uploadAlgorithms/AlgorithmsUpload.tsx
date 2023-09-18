import { DefaultLayout } from '../../../components/layout/DefaultLayout';
import { CubeSelectorPanel } from './CubeSelectorPanel';
import { ResolutionInput } from './ResolutionInput';
import {
  selectSets2,
  useAlgorithmsStore,
} from '../../../modules/store/algorithmsStore';
import { selectCases, useCaseStore } from '../../../modules/store/caseStore';
import { Loading } from '../../Loading';
import { useState } from 'react';
import { CaseAccount } from '../../../modules/types/case.interface';

export function AlgorithmsUpload() {
  const sets2 = useAlgorithmsStore(selectSets2);
  const cases = useCaseStore(selectCases);

  const [activeCase, setActiveCase] = useState<CaseAccount | undefined>(
    undefined,
  );

  const hasAllRequiredData = () => {
    return sets2.length > 0 && cases.length > 0;
  };

  if (!hasAllRequiredData()) {
    return <Loading />;
  }

  return (
    <DefaultLayout column={true}>
      <h1 className="text-4xl py-6 text-accent-dark font-bold">
        Upload your Algorithm
      </h1>
      <div className="flex gap-4">
        <CubeSelectorPanel
          setActiveCase={setActiveCase}
          activeCase={activeCase}
        />
        <ResolutionInput activeCase={activeCase} />
      </div>
    </DefaultLayout>
  );
}
