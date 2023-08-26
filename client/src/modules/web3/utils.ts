import { Transaction, VersionedTransaction } from "@coral-xyz/anchor";

export const txVersion = (tx: Transaction | VersionedTransaction) => {
  // VersionedTransaction has this getter with possible values 'legacy' and 0
  if (`version` in tx) return tx.version;

  // However, Transaction does not.
  return `legacy`;
};
