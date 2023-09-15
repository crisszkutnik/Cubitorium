import { createWithEqualityFn } from 'zustand/traditional';
import { CaseAccount } from '../types/case.interface';
import { web3Layer } from '../web3/web3Layer';

interface CaseStoreState {
  cases: CaseAccount[] | undefined;
  addCase: (set: string, id: string, setup: string) => Promise<void>;
  loadCases: () => Promise<void>;
}

export const selectCases = (state: CaseStoreState) => {
  if (state.cases === undefined) {
    state.loadCases();
    return [];
  }

  return state.cases;
};

export const useCaseStore = createWithEqualityFn<CaseStoreState>(
  (set) => ({
    cases: undefined,
    addCase: async (set: string, id: string, setup: string) => {
      await web3Layer.addCase(set, id, setup);
    },
    loadCases: async () => {
      const cases = await web3Layer.loadCases();
      set({ cases });
    },
  }),
  Object.is,
);
