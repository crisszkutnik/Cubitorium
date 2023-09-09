export type Set = Record<string, string[]>;

export interface EncodedGlobalConfig {
  setsJson: string;
}

export interface GlobalConfig {
  sets: Record<string, Set>;
}
