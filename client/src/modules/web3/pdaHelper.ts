import { utils } from "@coral-xyz/anchor";
import { PublicKey } from "@solana/web3.js";
import { web3Service } from "./web3Service";

export enum PDATypes {
  UserInfo = "user-info",
}

function getUserInfoPDA() {
  if (web3Service.provider && web3Service.program) {
    return PublicKey.findProgramAddressSync(
      [
        utils.bytes.utf8.encode(PDATypes.UserInfo),
        web3Service.provider.wallet.publicKey.toBuffer(),
      ],
      web3Service.program.programId
    )[0];
  }
}

export const PDAHelper = {
  getUserInfoPDA,
};
