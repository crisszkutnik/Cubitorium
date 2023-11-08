import { DefaultLayout } from '../../components/layout/DefaultLayout';
import { StopWatch } from '../../page-components/practice/StopWatch';
import { Performance } from '../../page-components/practice/Performance';
import { PracticeSelector } from '../../page-components/practice/PracticeSelector';
import { useAlgorithmsStore } from '../../modules/store/algorithmsStore';
import { useCaseStore } from '../../modules/store/caseStore';
import { useState, useEffect } from 'react';
import { LoadingState } from '../../modules/types/loadingState.enum';
import { Loading } from '../Loading';
import { CaseAccount } from '../../modules/types/case.interface';
import { PerformanceCase } from '../../modules/types/case.interface';
import { LastCase } from '../../page-components/practice/LastCase';
import { useSolutionStore } from '../../modules/store/solutionStore';
import { useLikeStore } from '../../modules/store/likeStore';
import { useUserStore } from '../../modules/store/userStore';

export function Practice() {
  const { isLogged } = useUserStore();
  const [setsLoadingState, loadSetsIfNotLoaded] = useAlgorithmsStore(
    ({ loadingState, loadIfNotLoaded }) => [loadingState, loadIfNotLoaded],
  );

  const [caseLoadingState, loadCasesIfNotLoaded] = useCaseStore(
    ({ loadingState, loadIfNotLoaded }) => [loadingState, loadIfNotLoaded],
  );

  const [loadLikesIfNotLoaded, likesLoadingState] = useLikeStore(
    (state) => [state.loadIfNotLoaded, state.loadingState],
  );

  const [activeCases, setActiveCases] = useState<CaseAccount[] | undefined>(
    undefined,
  );

  const [lastCase, setLastCase] = useState<CaseAccount>();

  const [performance, setPerformance] = useState<PerformanceCase[]>([]);

  const [selectedPuzzle, setSelectedPuzzle] = useState<string>('3x3');

  const [solutions, loadSolutionsIfNotLoaded, solutionsLoadingState] =
    useSolutionStore((state) => [
      state.solutions.filter(
        (s) =>
          s.account.case.toString() ===
          performance[performance.length - 1]?.case.publicKey.toString(),
      ),
      state.loadIfNotLoaded,
      state.loadingState,
    ]);

  useEffect(() => {
    loadSetsIfNotLoaded();
    loadCasesIfNotLoaded();
    loadSolutionsIfNotLoaded();
    if(isLogged){
      loadLikesIfNotLoaded();
    }
  }, []);

  const hasAllRequiredData = () => {
    return (
      setsLoadingState === LoadingState.LOADED &&
      caseLoadingState === LoadingState.LOADED &&
      solutionsLoadingState === LoadingState.LOADED &&      
      (!isLogged || likesLoadingState === LoadingState.LOADED)
    );
  };

  if (!hasAllRequiredData()) {
    return <Loading />;
  }

  return (
    <DefaultLayout column={true}>
      <h1 className="text-4xl py-6 text-accent-dark font-bold">Practice</h1>
      <div className="flex flex-row gap-4">
        <div className="flex flex-col w-1/4 items-center gap-4">
          <PracticeSelector
            selectedPuzzle={selectedPuzzle}
            setSelectedPuzzle={setSelectedPuzzle}
            setActiveCases={setActiveCases}
            setPerformance={setPerformance}
          />
          {performance.length > 0 && (
            <LastCase
              lastCase={lastCase as CaseAccount}
              solutions={solutions}
            />
          )}
        </div>
        <div className="flex flex-col w-3/4 items-center">
          <StopWatch
            activeCases={activeCases}
            setLastCase={setLastCase}
            performance={performance}
            setPerformance={setPerformance}
          />
          <Performance
            performance={performance}
            setPerformance={setPerformance}
          />
        </div>
      </div>
    </DefaultLayout>
  );
}
