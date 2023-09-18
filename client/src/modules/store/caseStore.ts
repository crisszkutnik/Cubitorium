import { createWithEqualityFn } from 'zustand/traditional';
import { CaseAccount } from '../types/case.interface';
import { web3Layer } from '../web3/web3Layer';

interface CaseStoreState {
  cases: CaseAccount[] | undefined;
  addCase: (set: string, id: string, setup: string) => Promise<void>;
  loadCases: () => Promise<void>;
  addSolution: (selectedCase: CaseAccount, solution: string) => Promise<void>;
}

export const selectCases = (state: CaseStoreState) => {
  if (state.cases === undefined) {
    state.loadCases();
    return [];
  }

  return state.cases;
};

export const useCaseStore = createWithEqualityFn<CaseStoreState>(
  (set, get) => ({
    cases: undefined,
    addCase: async (set: string, id: string, setup: string) => {
      await web3Layer.addCase(set, id, setup);
    },
    loadCases: async () => {
      const cases = await web3Layer.loadCases();
      set({ cases });
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
  }),
  Object.is,
);
