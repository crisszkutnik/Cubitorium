import { createWithEqualityFn } from 'zustand/traditional';
import { LoadingState } from '../types/loadingState.enum';
import { SolutionAccount } from '../types/solution.interface';
import { web3Layer } from '../web3/web3Layer';
import { PublicKey } from '@solana/web3.js';
import { getStringFromPKOrObject } from '../web3/utils';
import { CaseAccount } from '../types/case.interface';

interface SolutionStoreState {
  solutions: SolutionAccount[];
  loadingState: LoadingState;
  setLoadingState: (loadingState: LoadingState) => void;
  loadIfNotLoaded: () => Promise<void>;
  loadSolutions: () => Promise<void>;
  addSolution: (selectedCase: CaseAccount, solution: string) => Promise<void>;
}

export function selectSolutionsForCase(casePublicKey: PublicKey | string) {
  const pk = getStringFromPKOrObject(casePublicKey);

  return (state: SolutionStoreState) => {
    return state.solutions.filter((s) => s.account.case.toString() === pk);
  };
}

export const useSolutionStore = createWithEqualityFn<SolutionStoreState>(
  (set, get) => ({
    solutions: [],
    loadIfNotLoaded: async () => {
      const { loadingState, loadSolutions } = get();

      if (loadingState === LoadingState.NOT_LOADED) {
        loadSolutions();
      }
    },
    loadSolutions: async () => {
      set({ loadingState: LoadingState.LOADING });
      try {
        const solutions = await web3Layer.loadSolutions();
        set({ solutions });
      } catch (e) {
        console.error(e);
      } finally {
        set({ loadingState: LoadingState.LOADED });
      }
    },
    addSolution: async (selectedCase: CaseAccount, solution: string) => {
      await web3Layer.addSolution(selectedCase.publicKey, solution);

      // TODO: Try to add the solution without having to reload the whole state
      await get().loadSolutions();
    },
    loadingState: LoadingState.NOT_LOADED,
    setLoadingState: (loadingState: LoadingState) => {
      set({ loadingState });
    },
  }),
  Object.is,
);
