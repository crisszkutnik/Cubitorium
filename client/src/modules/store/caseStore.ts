import { createWithEqualityFn } from 'zustand/traditional';
import { CaseAccount } from '../types/case.interface';
import { web3Layer } from '../web3/web3Layer';
import { LoadingState } from '../types/loadingState.enum';
import { PublicKey } from '@solana/web3.js';
import { getStringFromPKOrObject } from '../web3/utils';

interface CaseStoreState {
  cases: CaseAccount[];
  addCase: (set: string, id: string, setup: string) => Promise<void>;
  loadCases: () => Promise<void>;
  loadingState: LoadingState;
  setLoadingState: (loadingState: LoadingState) => void;
  loadIfNotLoaded: () => Promise<void>;
}

export const selectCases = (state: CaseStoreState) => {
  return state.cases;
};

export const selectCasesBySet = (set: string) => {
  return (state: CaseStoreState) => {
    return state.cases.filter((c) => c.account.set === set);
  };
};

export const selectCasesByTermAndSetMax = (
  set: string,
  max: number,
  filterTerm?: string,
) => {
  return (state: CaseStoreState) => {
    return state.cases
      .filter((c) => {
        return (
          c.account.set === set &&
          (filterTerm?.toLowerCase()
            ? c.account.id.toLocaleLowerCase().includes(filterTerm)
            : true)
        );
      })
      .slice(0, max);
  };
};

export const selectCaseBySetAndId = (set: string, caseId: string) => {
  return (state: CaseStoreState) => {
    return state.cases.find(
      ({ account: acc }) => acc.set === set && acc.id === caseId,
    );
  };
};

export const selectCasesByPks = (pks: (PublicKey | string)[]) => {
  const keys = pks.map(getStringFromPKOrObject);

  return (state: CaseStoreState) => {
    return state.cases.filter((c) => keys.includes(c.publicKey.toString()));
  };
};

const comparator = (a: CaseAccount, b: CaseAccount) => {
  const { id: idA } = a.account;
  const { id: idB } = b.account;

  const numA = Number(idA);
  const numB = Number(idB);

  if (!isNaN(numA) && !isNaN(numB)) {
    return numA > numB ? 1 : -1;
  }

  return idA > idB ? 1 : -1;
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
        cases.sort(comparator);
        set({ cases });
      } catch (_) {
        _;
      }
      set({ loadingState: LoadingState.LOADED });
    },
    loadingState: LoadingState.NOT_LOADED,
    setLoadingState: (loadingState: LoadingState) => {
      set({ loadingState });
    },
  }),
  Object.is,
);
