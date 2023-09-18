import { createWithEqualityFn } from 'zustand/traditional';
import { CaseAccount } from '../types/case.interface';
import { web3Layer } from '../web3/web3Layer';
import { LoadingState } from '../types/loadingState.enum';

interface CaseStoreState {
  cases: CaseAccount[];
  addCase: (set: string, id: string, setup: string) => Promise<void>;
  loadCases: () => Promise<void>;
  addSolution: (selectedCase: CaseAccount, solution: string) => Promise<void>;
  loadingState: LoadingState;
  setLoadingState: (loadingState: LoadingState) => void;
  loadIfNotLoaded: () => Promise<void>;
}

export const selectCases = (state: CaseStoreState) => {
  return state.cases;
};

export const useCaseStore = createWithEqualityFn<CaseStoreState>(
  (set, get) => ({
    cases: [],
    addCase: async (set: string, id: string, setup: string) => {
      await web3Layer.addCase(set, id, setup);
    },
    loadIfNotLoaded: async () => {
      const { loadCases, loadingState } = get();

      if (loadingState === LoadingState.NOT_LOADED) {
        loadCases();
      }
    },
    loadCases: async () => {
      set({ loadingState: LoadingState.LOADING });
      try {
        const cases = await web3Layer.loadCases();
        set({ cases });
      } catch (_) {
        _;
      }
      set({ loadingState: LoadingState.LOADED });
    },
    addSolution: async (selectedCase: CaseAccount, solution: string) => {
      await web3Layer.addSolution(selectedCase.publicKey, solution);
      selectedCase.account.solutions.push(solution);

      const c = get().cases;
      if (c) {
        set({
          cases: [...c],
        });
      }
    },
    loadingState: LoadingState.NOT_LOADED,
    setLoadingState: (loadingState: LoadingState) => {
      set({ loadingState });
    },
  }),
  Object.is,
);
