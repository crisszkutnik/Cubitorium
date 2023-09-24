import { SetCase } from '../types/globalConfig.interface';
import { web3Layer } from '../web3/web3Layer';
import { createWithEqualityFn } from 'zustand/traditional';
import { LoadingState } from '../types/loadingState.enum';

interface UseAlgorithmsStoreState {
  algorithmsType: string[];
  algorithmsSubtypes: Record<string, string[]>;
  loadSets: () => Promise<void>;
  updateSets: (names: string, cases: string[]) => Promise<void>;
  sets: SetCase[];
  loadingState: LoadingState;
  setLoadingState: (loadingState: LoadingState) => void;
  loadIfNotLoaded: () => Promise<void>;
}

export const selectSets2 = (state: UseAlgorithmsStoreState) => {
  return state.sets;
};

export const useAlgorithmsStore = createWithEqualityFn<UseAlgorithmsStoreState>(
  (set, get) => ({
    sets: [],
    loadIfNotLoaded: async () => {
      const { loadSets, loadingState } = get();

      if (loadingState === LoadingState.NOT_LOADED) {
        await loadSets();
      }
    },
    loadSets: async () => {
      set({ loadingState: LoadingState.LOADING });

      try {
        const sets = await web3Layer.loadGlobalConfig();

        if (sets === undefined) {
          return;
        }

        const parsed: SetCase[] = JSON.parse(sets.setsJson);
        set({ sets: parsed });
      } catch (_) {
        _;
      } finally {
        set({ loadingState: LoadingState.LOADED });
      }
    },
    updateSets: async (name: string, cases: string[]) => {
      const { sets, loadingState } = get();

      if (sets.length === 0 && loadingState === LoadingState.LOADED) {
        await web3Layer.initGlobalConfig(name, cases);
      } else {
        await web3Layer.appendSetToConfig(name, cases);
      }
    },
    algorithmsType: [],
    algorithmsSubtypes: {},
    loadingState: LoadingState.NOT_LOADED,
    setLoadingState: (loadingState: LoadingState) => {
      set({ loadingState });
    },
  }),
  Object.is,
);
