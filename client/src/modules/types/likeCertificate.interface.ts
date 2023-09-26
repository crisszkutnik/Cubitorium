import { PublicKey } from '@solana/web3.js';

export interface LearningStatus {
  notLearnt?: Record<string, never>;
  learning?: Record<string, never>;
  learnt?: Record<string, never>;
}

export interface LikeCertificate {
  learningStatus: LearningStatus;
}

export interface LikeCertificateAccount {
  account: LikeCertificate;
  publicKey: PublicKey;
}
