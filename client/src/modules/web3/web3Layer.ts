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
import { Web3Connection } from "./web3Connection";
import { TransactionSignature } from "@solana/web3.js";
import { getPKFromStringOrObject } from "./utils";

export enum PDATypes {
  UserInfo = "user-info",
}

class Web3Layer extends Web3Connection {
  private _program: Program<Backend> | undefined;

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

  reset() {
    this.provider = undefined;
  }

  get loggedUserPK() {
    if (this.provider === undefined) {
      throw new Error("User is not authenticated");
    }

    return this.provider.wallet.publicKey;
  }

  getPDAAddress(type: PDATypes, publicKey: PublicKey) {
    if (this.provider === undefined) {
      throw new Error("User is not authenticated");
    }

    return PublicKey.findProgramAddressSync(
      [utils.bytes.utf8.encode(type), publicKey.toBuffer()],
      this.program.programId
    )[0];
  }

  async sendUserInfo(
    name: string,
    surname: string
  ): Promise<TransactionSignature> {
    const tx = await this.program.methods
      .sendUserInfo(name, surname)
      .accounts({
        user: this.provider?.wallet.publicKey,
        userInfo: this.getPDAAddress(PDATypes.UserInfo, this.loggedUserPK),
      })
      .transaction();

    return this.signAndSendTx(tx);
  }

  async getUserInfo(publicKey: string | PublicKey): Promise<UserInfo> {
    const pda = this.getPDAAddress(
      PDATypes.UserInfo,
      getPKFromStringOrObject(publicKey)
    );
    return this.program.account.userInfo.fetch(pda);
  }
}

export const web3Layer = new Web3Layer();
