import { create } from 'zustand';

interface UseAlgorithmsStoreState {
  algorithmsType: string[];
  algorithmsSubtypes: Record<string, string[]>;
}

export const useAlgorithmsStore = create<UseAlgorithmsStoreState>(() => ({
  algorithmsType: [
    '3x3',
    'Roux',
    '2x2',
    '4x4',
    '5x5',
    '6x6',
    'Megaminx',
    'Square-1',
  ],
  algorithmsSubtypes: {
    '3x3': [
      'First two layers',
      'Orient last layer',
      'Permute last layer',
      'Advanced methods',
      'Last slot sets',
      'Other',
    ],
    '2x2': ['Ortega', 'EG Method', 'CLL', 'EG1'],
    Megaminx: ['4 Look last layer', '2 Look last layer', 'OLL', 'PLL'],
    'Square-1': ['SubeShape', 'Vandenbergh', 'Lin'],
    '4x4': ['IDK'],
    '5x5': ['IDK'],
    '6x6': ['IDK'],
    Roux: ['IDK'],
  },
}));
