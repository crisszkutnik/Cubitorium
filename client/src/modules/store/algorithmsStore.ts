import { SetCase } from '../types/globalConfig.interface';
import { web3Layer } from '../web3/web3Layer';
import { createWithEqualityFn } from 'zustand/traditional';
import { LoadingState } from '../types/loadingState.enum';

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
        const sets = await web3Layer.loadGlobalConfig();

        if (sets === undefined) {
          return;
        }

        const parsed: SetCase[] = JSON.parse(sets.setsJson);

        const setsMap: Record<PuzzleTypeKey, SetCase[]> = {
          '2x2': [],
          '3x3': [],
          Pyraminx: [],
        };

        parsed.forEach((c) => {
          const key = getPuzzleType(c.set_name);
          setsMap[key].push(c);
        });

        set({ sets: parsed, setsMap });
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
    loadingState: LoadingState.NOT_LOADED,
    setLoadingState: (loadingState: LoadingState) => {
      set({ loadingState });
    },
  }),
  Object.is,
);

function getPuzzleType(set: string) {
  const sets2x2 = ['CLL', 'EG-1', 'EG-2'];
  const setsPyra = ['L4E'];

  if (sets2x2.includes(set)) {
    return PuzzleType['2x2'];
  }

  if (setsPyra.includes(set)) {
    return PuzzleType['Pyraminx'];
  }

  return PuzzleType['3x3'];
}
