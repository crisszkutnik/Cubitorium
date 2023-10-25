import { PublicKey } from '@solana/web3.js';

export interface Case {
  set: string;
  // OJO QUE EL ID SE PUEDE REPETIR
  // FILTRAR POR SET E ID A LA VEZ
  id: string;
  setup: Buffer;
  solutions: number;
}

export interface CaseAccount {
  account: Case;
  publicKey: PublicKey;
}

export interface PerformanceCase {
  case: CaseAccount;
  history: number[];
}
