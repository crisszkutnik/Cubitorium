import {
  AnchorProvider,
  Program,
  setProvider,
  utils,
  web3,
} from "@coral-xyz/anchor";
import { Backend, IDL } from "../../../../backend/target/types/backend";
import { UserInfo } from "../types/userInfo.interface";
import { AnchorWallet } from "@solana/wallet-adapter-react";
import { PublicKey } from "@solana/web3.js";

export enum PDATypes {
  UserInfo = "user-info",
}
class Web3Service {
  provider: AnchorProvider | undefined;
  _program: Program<Backend> | undefined;

  get program() {
    if (this._program === undefined) {
      this._program = new Program<Backend>(
        IDL,
        import.meta.env.VITE_PROGRAM_ID
      );
    }

    return this._program;
  }

  setWallet(wallet: AnchorWallet) {
    const connection = new web3.Connection(import.meta.env.VITE_NETWORK_URL, {
      commitment: `confirmed`,
    });

    const provider = new AnchorProvider(connection, wallet, {
      commitment: `confirmed`,
    });

    setProvider(provider);
    this.provider = provider;
  }

  isAuthenticated() {
    return this.provider !== undefined;
  }

  getPDAAddress(type: PDATypes) {
    if (this.provider === undefined) {
      throw new Error("User is not authenticated");
    }

    return PublicKey.findProgramAddressSync(
      [
        utils.bytes.utf8.encode(type),
        this.provider.wallet.publicKey.toBuffer(),
      ],
      this.program.programId
    )[0];
  }

  async sendUserInfo(name: string, surname: string) {
    return this.program.methods
      .sendUserInfo(name, surname)
      .accounts({
        user: this.provider?.wallet.publicKey,
        userInfo: this.getPDAAddress(PDATypes.UserInfo),
      })
      .rpc();
  }

  async getUserInfo(): Promise<UserInfo> {
    const pda = this.getPDAAddress(PDATypes.UserInfo);
    return this.program.account.userInfo.fetch(pda);
  }
}

export const web3Service = new Web3Service();
