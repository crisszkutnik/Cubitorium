import { BN } from '@coral-xyz/anchor';

export type Set = Record<string, string[]>;

export type SetsMap = Record<string, Set>;

export interface EncodedGlobalConfig {
  setsJson: string;
}

export interface SetCase {
  setName: string;
  caseNames: string[];
}

export interface GlobalConfig {
  maxFundLimit: BN;
  sets: SetCase[];
}
