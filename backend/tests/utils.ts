import * as anchor from "@coral-xyz/anchor";
import { hash } from "@coral-xyz/anchor/dist/cjs/utils/sha256";
import {
  CASE_TAG,
  LIKE_CERTIFICATE_TAG,
  PRIVILEGE_TAG,
  SET_TAG,
  SOLUTION_TAG,
} from "./constants";

export const fundAccounts = async (
  provider: anchor.AnchorProvider,
  publicKeys: anchor.web3.PublicKey[],
  amount = 200_000_000_000_000,
  log = true
) => {
  const tx = new anchor.web3.Transaction();

  for (let i = 0; i < publicKeys.length; i += 1) {
    tx.add(
      anchor.web3.SystemProgram.transfer({
        fromPubkey: provider.wallet.publicKey,
        lamports: amount,
        toPubkey: publicKeys[i],
      })
    );
  }

  if (log) console.log(`Accounts funded with ${amount * 10 ** -9} SOL...`);

  await provider.sendAndConfirm(tx, undefined, { commitment: `confirmed` });
};

export const privilegePda = (
  user: anchor.web3.PublicKey,
  pid: anchor.web3.PublicKey
) => {
  return anchor.web3.PublicKey.findProgramAddressSync(
    [Buffer.from(PRIVILEGE_TAG), user.toBuffer()],
    pid
  )[0];
};

export const casePda = (
  set: string,
  id: string,
  pid: anchor.web3.PublicKey
) => {
  return anchor.web3.PublicKey.findProgramAddressSync(
    [Buffer.from(CASE_TAG), Buffer.from(set), Buffer.from(id)],
    pid
  )[0];
};

export const solutionKey = (
  casePda: anchor.web3.PublicKey,
  solution: string,
  pid: anchor.web3.PublicKey
) => {
  return anchor.web3.PublicKey.findProgramAddressSync(
    [
      Buffer.from(SOLUTION_TAG),
      casePda.toBuffer(),
      Buffer.from(hash(solution), "hex"),
    ],
    pid
  )[0];
};

export const likePda = (
  user: anchor.web3.PublicKey,
  solutionPda: anchor.web3.PublicKey,
  pid: anchor.web3.PublicKey
) => {
  return anchor.web3.PublicKey.findProgramAddressSync(
    [
      Buffer.from(LIKE_CERTIFICATE_TAG),
      user.toBuffer(),
      solutionPda.toBuffer(),
    ],
    pid
  )[0];
};

export const setPda = (set: string, pid: anchor.web3.PublicKey) => {
  return anchor.web3.PublicKey.findProgramAddressSync(
    [Buffer.from(SET_TAG), Buffer.from(set)],
    pid
  )[0];
};
