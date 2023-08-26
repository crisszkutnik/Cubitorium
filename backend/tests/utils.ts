import * as anchor from "@coral-xyz/anchor";
import { CASE_TAG, PRIVILEGE_TAG } from "./constants";

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
  id: number,
  pid: anchor.web3.PublicKey
) => {
  return anchor.web3.PublicKey.findProgramAddressSync(
    [
      Buffer.from(CASE_TAG),
      Buffer.from(set),
      new anchor.BN(id).toArrayLike(Buffer, `le`, 4),
    ],
    pid
  )[0];
};
