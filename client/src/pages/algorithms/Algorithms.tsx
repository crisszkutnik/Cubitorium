import { useEffect, useState } from 'react';
import { DefaultLayout } from '../../components/layout/DefaultLayout';
import { useAlgorithmsStore } from '../../modules/store/algorithmsStore';
import { LoadingState } from '../../modules/types/loadingState.enum';
import { TopSelector } from '../../page-components/algorithms/TopSelector';
import { RightPanel } from '../../page-components/algorithms/rightPanel/RightPanel';
import { Loading } from '../Loading';
import { useCaseStore } from '../../modules/store/caseStore';
import { useSolutionStore } from '../../modules/store/solutionStore';
import { useLikeStore } from '../../modules/store/likeStore';
import { Input } from '@nextui-org/react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMagnifyingGlass } from '@fortawesome/free-solid-svg-icons';

export function Algorithms() {
  const [setsLoadingState, loadSetsIfNotLoaded] = useAlgorithmsStore(
    (state) => [state.loadingState, state.loadIfNotLoaded],
  );

  const [caseLoadingState, loadCasesIfNotLoaded] = useCaseStore((state) => [
    state.loadingState,
    state.loadIfNotLoaded,
  ]);

  const [solutionsLoadingState, loadSolutionsIfNotLoaded] = useSolutionStore(
    (state) => [state.loadingState, state.loadIfNotLoaded],
  );

  const [likesLoadingState, loadLikesIfNotLoaded] = useLikeStore((state) => [
    state.loadingState,
    state.loadIfNotLoaded,
  ]);

  const [selectedType, setSelectedType] = useState<string>('3x3');
  const [selectedSubtype, setSelectedSubtype] = useState<string>('');

  const [filterTerm, setFilterTerm] = useState('');

  useEffect(() => {
    loadSetsIfNotLoaded();
    loadCasesIfNotLoaded();
    loadSolutionsIfNotLoaded();
    loadLikesIfNotLoaded();
  }, []);

  const hasAllRequiredData = () => {
    return (
      setsLoadingState === LoadingState.LOADED &&
      caseLoadingState === LoadingState.LOADED &&
      solutionsLoadingState === LoadingState.LOADED &&
      likesLoadingState === LoadingState.LOADED
    );
  };

  if (!hasAllRequiredData()) {
    return <Loading />;
  }

  return (
    <DefaultLayout column={true}>
      <h1 className="text-4xl pb-6 text-accent-dark font-bold">Algorithms</h1>
      <TopSelector
        selectedType={selectedType}
        selectedSubtype={selectedSubtype}
        setSelectedType={(str) => {
          setFilterTerm('');
          setSelectedType(str);
        }}
        setSelectedSubtype={(str) => {
          setFilterTerm('');
          setSelectedSubtype(str);
        }}
      />
      <div className="w-56 mb-4">
        <Input
          label="Filter"
          placeholder="Filter cases"
          startContent={<FontAwesomeIcon icon={faMagnifyingGlass} />}
          isClearable
          variant="bordered"
          onChange={(e) => setFilterTerm(e.target.value)}
          value={filterTerm}
        />
      </div>
      <RightPanel selectedSubtype={selectedSubtype} filterTerm={filterTerm} />
    </DefaultLayout>
  );
}
