import { useEffect, useMemo, useState } from 'react';
import { DefaultLayout } from '../../../components/layout/DefaultLayout';
import { Top } from '../../../page-components/algorithms/allAlgorithms/Top';
import { useSearchParams } from 'react-router-dom';
import { useCaseStore } from '../../../modules/store/caseStore';
import { LoadingState } from '../../../modules/types/loadingState.enum';
import { Loading } from '../../Loading';
import { useSolutionStore } from '../../../modules/store/solutionStore';
import {
  getPuzzleType,
  useAlgorithmsStore,
} from '../../../modules/store/algorithmsStore';
import { CaseAccount } from '../../../modules/types/case.interface';
import { AllAlgorithmsTable } from '../../../page-components/algorithms/allAlgorithms/AllAlgorithmsTable';
import { useLikeStore } from '../../../modules/store/likeStore';

export function AllAlgorithms() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [selectedCase, setSelectedCase] = useState('');
  const [selectedSet, setSelectedSet] = useState('');

  const [cases, loadCasesIfNotLoaded, casesLoadingState] = useCaseStore(
    (state) => [state.cases, state.loadIfNotLoaded, state.loadingState],
  );

  const caseAccount = useMemo(() => {
    return cases.find((c) => {
      return c.account.id === selectedCase && c.account.set === selectedSet;
    }) as CaseAccount;
  }, [cases, selectedCase, selectedSet]);

  const [solutions, loadSolutionsIfNotLoaded, solutionsLoadingState] =
    useSolutionStore((state) => [
      state.solutions.filter(
        (s) => s.account.case.toString() === caseAccount?.publicKey.toString(),
      ),
      state.loadIfNotLoaded,
      state.loadingState,
    ]);

  const [loadAlgorithmsIfNotLoaded, algorithmsLoadingState] =
    useAlgorithmsStore((state) => [state.loadIfNotLoaded, state.loadingState]);

  const [loadLikesIfNotLoaded, likesLoadingState] = useLikeStore((state) => [
    state.loadIfNotLoaded,
    state.loadingState,
  ]);

  useEffect(() => {
    const queryParamCase = searchParams.get('case');
    const queryParamSet = searchParams.get('set');

    let refreshParams = false;
    if (queryParamCase === null) {
      if (cases.length > 0) {
        searchParams.set('case', cases[0].account.id);
      }
      refreshParams = true;
    }

    if (queryParamSet === null) {
      if (cases.length > 0) {
        searchParams.set('set', cases[0].account.set);
      }
      refreshParams = true;
    }

    if (refreshParams) {
      setSearchParams(searchParams);
      return;
    }

    if (queryParamCase !== selectedCase) {
      setSelectedCase(queryParamCase || '');
    }

    if (queryParamSet !== selectedSet) {
      setSelectedSet(queryParamSet || '');
    }
  }, [searchParams, cases]);

  useEffect(() => {
    loadCasesIfNotLoaded();
    loadSolutionsIfNotLoaded();
    loadAlgorithmsIfNotLoaded();
    loadLikesIfNotLoaded();
  }, []);

  const onChangeCase = (newCase: string, newSet: string) => {
    searchParams.set('case', newCase);
    searchParams.set('set', newSet);
    setSearchParams(searchParams);
  };

  const hasAllRequiredData = () => {
    return (
      casesLoadingState === LoadingState.LOADED &&
      solutionsLoadingState === LoadingState.LOADED &&
      algorithmsLoadingState === LoadingState.LOADED &&
      likesLoadingState === LoadingState.LOADED &&
      caseAccount !== undefined
    );
  };

  if (!hasAllRequiredData()) {
    return <Loading />;
  }

  const puzzleType = getPuzzleType(selectedSet);

  const getTitle = () => {
    return `Solutions > ${puzzleType} > ${selectedSet} > ${selectedCase}`;
  };

  return (
    <DefaultLayout column={true}>
      <p className="text-accent-primary font-semibold my-6 text-md">
        {getTitle()}
      </p>
      <Top caseAccount={caseAccount} onCaseChange={onChangeCase} />
      <div>
        <AllAlgorithmsTable selectedCase={caseAccount} solutions={solutions} />
      </div>
    </DefaultLayout>
  );
}
