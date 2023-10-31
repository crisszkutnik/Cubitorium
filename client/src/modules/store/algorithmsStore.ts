import { SetCase } from '../types/globalConfig.interface';
import { web3Layer } from '../web3/web3Layer';
import { createWithEqualityFn } from 'zustand/traditional';
import { LoadingState } from '../types/loadingState.enum';
import { BN } from '@coral-xyz/anchor';

export const PuzzleType = {
  '2x2': '2x2',
  '3x3': '3x3',
  Pyraminx: 'Pyraminx',
} as const;

export type PuzzleTypeKey = keyof typeof PuzzleType;

export const PuzzleTypeKeys = Object.keys(PuzzleType) as PuzzleTypeKey[];

interface UseAlgorithmsStoreState {
  loadSets: () => Promise<void>;
  updateSets: (names: string, cases: string[]) => Promise<void>;
  sets: SetCase[];
  setsMap: Record<PuzzleTypeKey, SetCase[]>;
  loadingState: LoadingState;
  setLoadingState: (loadingState: LoadingState) => void;
  loadIfNotLoaded: () => Promise<void>;
  // Esto definitivamente no deberia estar aca porque es una config global pero lo mas facil
  // es dejarlo aca porque es de donde se carga la global config :)
  maxFundLimit: BN | undefined;
  setMaxFundLimit: (newLimit: string) => Promise<void>;
}

export const selectSets = (state: UseAlgorithmsStoreState) => {
  return state.sets;
};

export const useAlgorithmsStore = createWithEqualityFn<UseAlgorithmsStoreState>(
  (set, get) => ({
    sets: [],
    setsMap: {
      '2x2': [],
      '3x3': [],
      Pyraminx: [],
    },
    loadIfNotLoaded: async () => {
      const { loadSets, loadingState } = get();

      if (loadingState === LoadingState.NOT_LOADED) {
        await loadSets();
      }
    },
    loadSets: async () => {
      set({ loadingState: LoadingState.LOADING });

      try {
        const { maxFundLimit, sets } = await web3Layer.loadGlobalConfig();

        const setsMap: Record<PuzzleTypeKey, SetCase[]> = {
          '2x2': [],
          '3x3': [],
          Pyraminx: [],
        };

        sets.forEach((c) => {
          const key = getPuzzleType(c.setName);
          setsMap[key].push(c);
        });

        set({ sets, setsMap, maxFundLimit });
      } catch (e) {
        console.error(e);
      } finally {
        set({ loadingState: LoadingState.LOADED });
      }
    },
    updateSets: async (name: string, cases: string[]) => {
      await web3Layer.appendSetToConfig(name, cases);
    },
    loadingState: LoadingState.NOT_LOADED,
    setLoadingState: (loadingState: LoadingState) => {
      set({ loadingState });
    },
    maxFundLimit: undefined,
    setMaxFundLimit: async (newLimit: string) => {
      await web3Layer.setMaxFundLimit(newLimit);
      set({
        maxFundLimit: new BN(newLimit),
      });
    },
  }),
  Object.is,
);

export function getPuzzleType(set: string): PuzzleTypeKey {
  switch (set) {
    case 'CLL':
    case 'EG-1':
    case 'EG-2':
      return PuzzleType['2x2'];

    case 'L4E':
      return PuzzleType['Pyraminx'];

    default:
      return PuzzleType['3x3'];
  }
}
