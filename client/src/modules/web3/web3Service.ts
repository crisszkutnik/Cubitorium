import {
  AnchorProvider,
  Program,
  Wallet,
  setProvider,
  web3,
} from "@coral-xyz/anchor";
import { Backend, IDL } from "../../../../backend/target/types/backend";
import { PDAHelper } from "./pdaHelper";
import { UserInfo } from "../types/userInfo.interface";

// TODO: Usar una wallet como metamask porque la Wallet de Anchor solo funciona en Node

class Web3Service {
  provider: AnchorProvider;
  program: Program<Backend>;

  constructor() {
    const connection = new web3.Connection(`http://localhost:8899`, {
      commitment: `confirmed`,
    });

    const provider = new AnchorProvider(connection, Wallet.local(), {
      commitment: `confirmed`,
    });

    setProvider(provider);
    this.provider = provider;

    this.program = new Program<Backend>(
      IDL,
      `2VDpa45STsAeuExQ447LPeCJq9LDWhFwXnfN1U1DuqcZ`
    );
  }

  async sendUserInfo(name: string, surname: string) {
    return this.program.methods
      .sendUserInfo(name, surname)
      .accounts({
        user: this.provider.wallet.publicKey,
        userInfo: PDAHelper.getUserInfoPDA(),
      })
      .rpc();
  }

  async getUserInfo(): Promise<UserInfo> {
    return this.program.account.userInfo.fetch(PDAHelper.getUserInfoPDA());
  }
}

export const web3Service = new Web3Service();
