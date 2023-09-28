import { DefaultLayout } from "../../components/layout/DefaultLayout";
import { StopWatch } from "../../page-components/practice/StopWatch";
import { Performance } from "../../page-components/practice/Performance";
import { PracticeSelector } from "../../page-components/practice/PracticeSelector";
import { useAlgorithmsStore } from "../../modules/store/algorithmsStore";
import { useCaseStore } from "../../modules/store/caseStore";
import { useEffect } from "react";
import { LoadingState } from '../../modules/types/loadingState.enum';
import { Loading } from '../Loading';


export function Practice() {

    const [setsLoadingState, loadSetsIfNotLoaded] = useAlgorithmsStore(
        ({ loadingState, loadIfNotLoaded }) => [loadingState, loadIfNotLoaded],
      );
    
      const [caseLoadingState, loadCasesIfNotLoaded] = useCaseStore(
        ({ loadingState, loadIfNotLoaded }) => [loadingState, loadIfNotLoaded],
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
            <h1 className="text-4xl py-6 text-accent-dark font-bold">Practice</h1>
            <div className="flex flex-row">
                <PracticeSelector />
                <div className="flex flex-col w-full items-center">
                    <StopWatch />
                    <Performance />
                </div>
                
            </div>
        </DefaultLayout>
    );
  }
  