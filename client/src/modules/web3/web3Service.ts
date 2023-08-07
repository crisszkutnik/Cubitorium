import { AnchorProvider, Program, setProvider, web3 } from "@coral-xyz/anchor";
import { Backend, IDL } from "../../../../backend/target/types/backend";
import { PDAHelper } from "./pdaHelper";
import { UserInfo } from "../types/userInfo.interface";
import { AnchorWallet } from "@solana/wallet-adapter-react";

class Web3Service {
  provider: AnchorProvider | undefined;
  program: Program<Backend> | undefined;

  init(wallet: AnchorWallet) {
    const connection = new web3.Connection(`http://localhost:8899`, {
      commitment: `confirmed`,
    });

    const provider = new AnchorProvider(connection, wallet, {
      commitment: `confirmed`,
    });

    setProvider(provider);
    this.provider = provider;

    this.program = new Program<Backend>(
      IDL,
      `13YVuPAdZDTe1xssYDwTg6ndGFhhSMv3tZxh8s2wyZMA`
    );
  }

  async sendUserInfo(name: string, surname: string) {
    return this.program?.methods
      .sendUserInfo(name, surname)
      .accounts({
        user: this.provider?.wallet.publicKey,
        userInfo: PDAHelper.getUserInfoPDA(),
      })
      .rpc();
  }

  async getUserInfo(): Promise<UserInfo | undefined> {
    const pda = PDAHelper.getUserInfoPDA();

    if (pda) {
      return this.program?.account.userInfo.fetch(pda);
    }
  }
}

export const web3Service = new Web3Service();
