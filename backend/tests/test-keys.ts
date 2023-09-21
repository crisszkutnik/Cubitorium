import * as anchor from "@coral-xyz/anchor";

const seedStart = Buffer.from(
  `0000000000000000000000000000000000000000000000000000000000000000`,
  `hex`
).subarray(0, 31);

// create 10 keys
export const keypairs = Array.from(Array(10).keys()).map((key) =>
  anchor.web3.Keypair.fromSeed(Uint8Array.from([...seedStart, key]))
);
