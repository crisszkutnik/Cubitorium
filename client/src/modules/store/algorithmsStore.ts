import { Set, SetCase } from '../types/globalConfig.interface';
import { web3Layer } from '../web3/web3Layer';
import { createWithEqualityFn } from 'zustand/traditional';

interface UseAlgorithmsStoreState {
  algorithmsType: string[];
  algorithmsSubtypes: Record<string, string[]>;
  loadSets2: () => Promise<void>;
  updateSets2: (names: string, cases: string[]) => Promise<void>;
  sets: Record<string, Set> | undefined;
  sets2: SetCase[] | undefined;
}

export const selectSets2 = (state: UseAlgorithmsStoreState) => {
  if (state.sets2 === undefined) {
    state.loadSets2();
    return [];
  }

  return state.sets2;
};

export const useAlgorithmsStore = createWithEqualityFn<UseAlgorithmsStoreState>(
  (set, get) => ({
    sets: undefined,
    sets2: undefined,
    loadSets2: async () => {
      const sets = await web3Layer.loadGlobalConfig();

      if (sets === undefined) {
        return;
      }

      const parsed: SetCase[] = JSON.parse(sets.setsJson);
      set({ sets2: parsed });
    },
    updateSets2: async (name: string, cases: string[]) => {
      const { sets2 } = get();

      if (sets2 === undefined) {
        await web3Layer.initGlobalConfig(name, cases);
      } else {
        await web3Layer.appendSetToConfig(name, cases);
      }
    },
    algorithmsType: [],
    algorithmsSubtypes: {},
  }),
  Object.is,
);
