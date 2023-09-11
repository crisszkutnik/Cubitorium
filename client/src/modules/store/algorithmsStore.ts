import { create } from "zustand";

class PuzzleSet {
  name: String;
  algorithms: String[];
  constructor(name: String, algorithms: String[]) {
    this.name = name;
    this.algorithms = algorithms;
  }

}

class Puzzle {
  name: String;
  sets: PuzzleSet[]
  constructor(name: String, sets: PuzzleSet[]) {
    this.name = name;
    this.sets = sets;
  }
}

interface UseAlgorithmsStoreState {
  algorithmsType: string[];
  algorithmsSubtypes: { [key: string]: string[] };
  newAlgorithmTypes: { [key: string]: { [key: string]: string[] } };
  test: Puzzle[];
}

export const useAlgorithmsStore = create<UseAlgorithmsStoreState>(() => ({
  algorithmsType: [
    "3x3",
    "Roux",
    "2x2",
    "4x4",
    "5x5",
    "6x6",
    "Megaminx",
    "Square-1",
  ],
  algorithmsSubtypes: {
    "3x3": [
      "First two layers",
      "Orient last layer",
      "Permute last layer",
      "Advanced methods",
      "Last slot sets",
      "Other",
    ],
    "2x2": ["Ortega", "EG Method", "CLL", "EG1"],
    "Megaminx": ["4 Look last layer", "2 Look last layer", "OLL", "PLL"],
    "Square-1": ["SubeShape", "Vandenbergh", "Lin"],
    "4x4":["IDK"],
    "5x5":["IDK"],
    "6x6":["IDK"],
    "Roux":["IDK"],
  },
  newAlgorithmTypes: {
    "3x3": {
      "F2L": ["F2L 1", "F2L 2", "F2L 3", "F2L 4", "F2L 5", "F2L 6", "F2L 7", "F2L 8"],
      "OLL": ["OLL 1", "OLL 2", "OLL 3"],
      "PLL": ["Aa", "Ab", "F"],
      "Advanced F2L": ["AF2L 1", "AF2L 2", "AF2L 3", "AF2L 4", "AF2L 5"],
      "Last slot sets": ["1", "2", "3", "4", "5", "6", "7", "8"],
      "Other": ["A", "B", "C", "D", "E", "F", "G", "H"],
    },
    "2x2": {
      "Ortega": ["Sune", "Anti Sune", "Pi"],
      "EG1": ["EG1 AS 1", "EG1 AS 2"],
      "EG2": ["EG2 AS 1", "EG2 AS 2"],
      "CLL": ["CLL AS 1", "CLL AS 2"],
    },
  },
  test: [new Puzzle("3x3", [new PuzzleSet("F2L", ["F2L 1", "F2L 2", "F2L 3", "F2L 4", "F2L 5", "F2L 6", "F2L 7", "F2L 8"]), 
      new PuzzleSet("OLL", ["OLL 1", "OLL 2", "OLL 3"]), 
      new PuzzleSet("PLL", ["Aa", "Ab", "F"]), 
      new PuzzleSet("Advanced F2L", ["AF2L 1", "AF2L 2", "AF2L 3", "AF2L 4", "AF2L 5"]), 
      new PuzzleSet("Last slot sets", ["1", "2", "3", "4", "5", "6", "7", "8"]), 
      new PuzzleSet("Other", ["A", "B", "C", "D", "E", "F", "G", "H"])])
  ],
}));

