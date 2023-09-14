import { Transaction, VersionedTransaction } from "@coral-xyz/anchor";
import { PublicKey } from "@solana/web3.js";

export const txVersion = (tx: Transaction | VersionedTransaction) => {
  // VersionedTransaction has this getter with possible values 'legacy' and 0
  if (`version` in tx) return tx.version;

  // However, Transaction does not.
  return `legacy`;
};

export function getPKFromStringOrObject(publicKey: string | PublicKey) {
  if (typeof publicKey === "string") {
    return new PublicKey(publicKey);
  }

  return publicKey;
}

export function getStringFromPKOrObject(publicKey: string | PublicKey) {
  if (typeof publicKey === "string") {
    return publicKey;
  }

  return publicKey.toString();
}
