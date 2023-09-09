import { Set } from '../types/globalConfig.interface';
import { web3Layer } from '../web3/web3Layer';
import { createWithEqualityFn } from 'zustand/traditional';

interface UseAlgorithmsStoreState {
  algorithmsType: string[];
  algorithmsSubtypes: Record<string, string[]>;
  setSets: (sets: Record<string, Set>) => void;
  loadSets: () => Promise<void>;
  updateSets: (str: string) => Promise<void>;
  sets: Record<string, Set> | undefined;
}

export const selectAllSets = (state: UseAlgorithmsStoreState) => {
  if (state.sets === undefined) {
    state.loadSets();
    return {};
  }

  return state.sets;
};

export const useAlgorithmsStore = createWithEqualityFn<UseAlgorithmsStoreState>(
  (set, get) => ({
    sets: undefined,
    loadSets: async () => {
      const cfg = await web3Layer.loadGlobalConfig();

      if (!cfg) {
        return;
      }

      const sets: Record<string, Set> = JSON.parse(cfg.setsJson);

      get().setSets(sets);
    },
    setSets: (sets: Record<string, Set>) => {
      const algorithmsType = Object.keys(sets);

      const algorithmsSubtypes = algorithmsType.reduce((obj, type) => {
        obj[type] = Object.keys(sets[type]);
        return obj;
      }, {} as Record<string, string[]>);

      set({ sets, algorithmsType, algorithmsSubtypes });
    },
    updateSets: async (str: string) => {
      console.log(str);
      const sets = JSON.parse(str);

      if (get().sets === undefined) {
        await web3Layer.initGlobalConfig(str);
      } else {
        await web3Layer.setGlobalConfig(str);
      }

      get().setSets(sets);
    },
    algorithmsType: [],
    algorithmsSubtypes: {},
  }),
  Object.is,
);
