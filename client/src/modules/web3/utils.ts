import { hash } from '@coral-xyz/anchor/dist/cjs/utils/sha256';
import { PublicKey, Transaction, VersionedTransaction } from '@solana/web3.js';
import { PDATypes } from './web3Layer';
import {
  RawLearningStatus,
  LikeCertificate,
  LikeCertificateAccount,
  LearningStatus,
} from '../types/likeCertificate.interface';

export const txVersion = (tx: Transaction | VersionedTransaction) => {
  // VersionedTransaction has this getter with possible values 'legacy' and 0
  if (`version` in tx) return tx.version;

  // However, Transaction does not.
  return `legacy`;
};

export function getPKFromStringOrObject(publicKey: string | PublicKey) {
  if (typeof publicKey === 'string') {
    return new PublicKey(publicKey);
  }

  return publicKey;
}

export function getStringFromPKOrObject(publicKey: string | PublicKey) {
  if (typeof publicKey === 'string') {
    return publicKey;
  }

  return publicKey.toString();
}

export function getSolutionPda(
  caseAddress: PublicKey | string,
  solution: string,
  pid: PublicKey,
) {
  const pk = getPKFromStringOrObject(caseAddress);

  return PublicKey.findProgramAddressSync(
    [
      Buffer.from(PDATypes.Solution),
      pk.toBuffer(),
      Buffer.from(hash(solution), 'hex'),
    ],
    pid,
  )[0];
}

export const getLikePda = (
  user: PublicKey,
  solutionPda: PublicKey,
  pid: PublicKey,
) => {
  return PublicKey.findProgramAddressSync(
    [
      Buffer.from(PDATypes.LikeCertificate),
      user.toBuffer(),
      solutionPda.toBuffer(),
    ],
    pid,
  )[0];
};

export const getParsedLearningStatus = (
  likeAccount: LikeCertificate | LikeCertificateAccount,
): LearningStatus => {
  const acc = 'account' in likeAccount ? likeAccount.account : likeAccount;

  if (!acc || !acc.learningStatus) {
    return LearningStatus.NotLearnt;
  }

  if ('learnt' in acc.learningStatus) {
    return LearningStatus.Learnt;
  }

  if ('learning' in acc.learningStatus) {
    return LearningStatus.Learning;
  }

  return LearningStatus.NotLearnt;
};

export const getRawLearningStatus = (
  status: LearningStatus,
): RawLearningStatus => {
  switch (status) {
    case LearningStatus.Learnt:
      return { learnt: {} };

    case LearningStatus.Learning:
      return { learning: {} };

    case LearningStatus.NotLearnt:
      return { notLearnt: {} };
  }
};

export const getSetPda = (set: string, pid: PublicKey) => {
  return PublicKey.findProgramAddressSync(
    [Buffer.from(PDATypes.Set), Buffer.from(set)],
    pid,
  )[0];
};
