export type Set = Record<string, string[]>;

export type SetsMap = Record<string, Set>;

export interface EncodedGlobalConfig {
  setsJson: string;
}

export interface SetCase {
  set_name: string;
  case_names: string[];
}
