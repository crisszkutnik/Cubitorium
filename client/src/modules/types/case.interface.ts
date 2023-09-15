import { PublicKey } from '@solana/web3.js';

export interface Case {
  set: string;
  id: string;
  setup: string;
  solutions: string[];
}

export interface CaseAccount {
  account: Case;
  publicKey: PublicKey;
}
