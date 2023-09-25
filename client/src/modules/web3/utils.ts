import { Transaction, VersionedTransaction } from '@coral-xyz/anchor';
import { hash } from '@coral-xyz/anchor/dist/cjs/utils/sha256';
import { PublicKey } from '@solana/web3.js';
import { PDATypes } from './web3Layer';

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
