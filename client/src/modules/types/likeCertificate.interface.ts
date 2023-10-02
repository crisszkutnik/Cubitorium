import { PublicKey } from '@solana/web3.js';

export enum LearningStatus {
  Learnt = 'Learnt',
  Learning = 'Learning',
  NotLearnt = 'Not learnt',
}

export type RawLearningStatus =
  | { learnt: Record<string, never> }
  | { learning: Record<string, never> }
  | { notLearnt: Record<string, never> };

export interface LikeCertificate {
  learningStatus: RawLearningStatus;
  user: PublicKey;
  solution: PublicKey;
}

export interface LikeCertificateAccount {
  account: LikeCertificate;
  publicKey: PublicKey;
}

export interface ParsedLikeCertificateAccount {
  account: LikeCertificate & { parsedLearningStatus: LearningStatus };
  publicKey: PublicKey;
}
