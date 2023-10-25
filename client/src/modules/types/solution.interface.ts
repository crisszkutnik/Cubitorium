import { PublicKey } from '@solana/web3.js';

export interface Solution {
  case: PublicKey;
  moves: Buffer;
  selfIndex: number;
  author: PublicKey;
  likes: number;
  timestamp: number;
}

export interface SolutionAccount {
  account: Solution;
  publicKey: PublicKey;
}
