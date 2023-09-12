export type Set = Record<string, string[]>;

export type SetsMap = Record<string, Set>;

export interface GlobalConfig {
  sets: SetsMap;
}
