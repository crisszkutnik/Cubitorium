import { DefaultLayout } from '../../../components/layout/DefaultLayout';
import { CubeSelectorPanel } from '../../../page-components/algorithms/uploadAlgorithms/CubeSelectorPanel';
import { ResolutionInput } from '../../../page-components/algorithms/uploadAlgorithms/ResolutionInput';
import { useAlgorithmsStore } from '../../../modules/store/algorithmsStore';
import { useCaseStore } from '../../../modules/store/caseStore';
import { Loading } from '../../Loading';
import { useEffect, useState } from 'react';
import { CaseAccount } from '../../../modules/types/case.interface';
import { LoadingState } from '../../../modules/types/loadingState.enum';
import { Link } from 'react-router-dom';
import { ScrollLink } from 'react-scroll';

export function AlgorithmsUpload() {
  const [setsLoadingState, loadSetsIfNotLoaded] = useAlgorithmsStore(
    ({ loadingState, loadIfNotLoaded }) => [loadingState, loadIfNotLoaded],
  );

  const [caseLoadingState, loadCasesIfNotLoaded] = useCaseStore(
    ({ loadingState, loadIfNotLoaded }) => [loadingState, loadIfNotLoaded],
  );

  const [activeCase, setActiveCase] = useState<CaseAccount | undefined>(
    undefined,
  );

  useEffect(() => {
    loadSetsIfNotLoaded();
    loadCasesIfNotLoaded();

  }, []);

  const hasAllRequiredData = () => {
    return (
      setsLoadingState === LoadingState.LOADED &&
      caseLoadingState === LoadingState.LOADED
    );
  };

  if (!hasAllRequiredData()) {
    return <Loading />;
  }

  return (
    <DefaultLayout column={true}>

      <Link to="/guides/#how-to-submit" className="bg-gray-50 border text-gray-500 max-w-xs text-center">
        🔍 Discover how it's done
      </Link>
     
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
