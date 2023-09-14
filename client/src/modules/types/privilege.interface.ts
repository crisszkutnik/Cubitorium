import { PublicKey } from '@solana/web3.js';

export interface Privilege {
  account: {
    granter: PublicKey;
    grantee: PublicKey;
    bump: number;
  };
  publicKey: PublicKey; // Privilege PK, not related to users
}
