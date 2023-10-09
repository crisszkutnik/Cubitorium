import { DefaultLayout } from "../../components/layout/DefaultLayout";
import { StopWatch } from "../../page-components/practice/StopWatch";
import { Performance } from "../../page-components/practice/Performance";
import { PracticeSelector } from "../../page-components/practice/PracticeSelector";
import { useAlgorithmsStore } from "../../modules/store/algorithmsStore";
import { useCaseStore } from "../../modules/store/caseStore";
import { useState, useEffect } from "react";
import { LoadingState } from '../../modules/types/loadingState.enum';
import { Loading } from '../Loading';
import { CaseAccount } from '../../modules/types/case.interface';
import { PerformanceCase } from "../../modules/types/case.interface";


export function Practice() {

    const [setsLoadingState, loadSetsIfNotLoaded] = useAlgorithmsStore(
        ({ loadingState, loadIfNotLoaded }) => [loadingState, loadIfNotLoaded],
      );
    
    const [caseLoadingState, loadCasesIfNotLoaded] = useCaseStore(
      ({ loadingState, loadIfNotLoaded }) => [loadingState, loadIfNotLoaded],
    );

    const [activeCases, setActiveCases] = useState<CaseAccount[] | undefined>(
      undefined,
    );

    const [performance, setPerformance] = useState<PerformanceCase[]>([]);

    const [selectedPuzzle, setSelectedPuzzle] = useState<string>('3x3');    
    
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
                <PracticeSelector 
                  selectedPuzzle={selectedPuzzle} 
                  setSelectedPuzzle={setSelectedPuzzle}
                  setActiveCases={setActiveCases}
                />
                <div className="flex flex-col w-full items-center">
                    <StopWatch 
                      selectedPuzzle={selectedPuzzle} 
                      activeCases={activeCases}
                      performance={performance}
                      setPerformance={setPerformance}
                    />
                    <Performance 
                      selectedPuzzle={selectedPuzzle} 
                      performance={performance}
                      setPerformance={setPerformance}                      
                    />
                </div>
                
            </div>
        </DefaultLayout>
    );
  }
  