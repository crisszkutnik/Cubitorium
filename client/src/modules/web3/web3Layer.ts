import { AnchorProvider, Program, setProvider, utils } from '@coral-xyz/anchor';
import { Backend, IDL } from '../../../../backend/target/types/backend';
import { UserInfo } from '../types/userInfo.interface';
import { EncodedGlobalConfig } from '../types/globalConfig.interface';
import { AnchorWallet } from '@solana/wallet-adapter-react';
import { PublicKey, TransactionSignature } from '@solana/web3.js';
import { Web3Connection } from './web3Connection';
import { getPKFromStringOrObject } from './utils';

export enum PDATypes {
  UserInfo = 'user-info',
  GlobalConfig = 'global-config',
}

class Web3Layer extends Web3Connection {
  private _program: Program<Backend> | undefined;

  get program() {
    if (this._program === undefined) {
      this._program = new Program<Backend>(
        IDL,
        import.meta.env.VITE_PROGRAM_ID,
      );
    }

    return this._program;
  }

  setWallet(wallet: AnchorWallet) {
    const provider = new AnchorProvider(this.connection, wallet, {
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
      throw new Error('User is not authenticated');
    }

    return this.provider.wallet.publicKey;
  }

  getPDAAddress(type: PDATypes, publicKey?: PublicKey) {
    if (this.provider === undefined) {
      throw new Error('User is not authenticated');
    }

    const seeds = [utils.bytes.utf8.encode(type)];

    if (publicKey) {
      seeds.push(publicKey.toBuffer());
    }

    return PublicKey.findProgramAddressSync(seeds, this.program.programId)[0];
  }

  async sendUserInfo(
    name: string,
    surname: string,
    wcaId: string,
    location: string,
  ): Promise<TransactionSignature> {
    const tx = await this.program.methods
      .sendUserInfo(name, surname, wcaId, location)
      .accounts({
        user: this.provider?.wallet.publicKey,
        userInfo: this.getPDAAddress(PDATypes.UserInfo, this.loggedUserPK),
      })
      .transaction();

    return this.signAndSendTx(tx);
  }

  async changeUserInfo(
    name: string,
    surname: string,
    wcaId: string,
    location: string,
  ): Promise<TransactionSignature> {
    const tx = await this.program.methods
      .changeUserInfo(name, surname, wcaId, location)
      .accounts({
        user: this.provider?.wallet.publicKey,
        userInfo: this.getPDAAddress(PDATypes.UserInfo, this.loggedUserPK),
      })
      .transaction();

    return this.signAndSendTx(tx);
  }

  async getUserInfo(
    publicKey: string | PublicKey,
  ): Promise<UserInfo | undefined> {
    const pda = this.getPDAAddress(
      PDATypes.UserInfo,
      getPKFromStringOrObject(publicKey),
    );
    return this.program.account.userInfo.fetch(pda);
  }

  async loadGlobalConfig(): Promise<EncodedGlobalConfig | undefined> {
    const pda = this.getPDAAddress(PDATypes.GlobalConfig);

    return this.program.account.globalConfig.fetch(pda);
  }

  async initGlobalConfig(config: string) {
    const tx = await this.program.methods
      .initGlobalConfig(config)
      .accounts({
        admin: this.provider?.wallet.publicKey,
        globalConfig: this.getPDAAddress(PDATypes.GlobalConfig),
      })
      .transaction();

    return this.signAndSendTx(tx);
  }

  async setGlobalConfig(config: string) {
    const tx = await this.program.methods
      .setGlobalConfig(config)
      .accounts({
        admin: this.provider?.wallet.publicKey,
        globalConfig: this.getPDAAddress(PDATypes.GlobalConfig),
      })
      .transaction();

    return this.signAndSendTx(tx);
  }

  async addPrivilegedUser(publicKey: string) {
    console.log(this.provider?.wallet.publicKey.toString());
    const tx = await this.program.methods
      .addPrivilegedUser()
      .accounts({
        granter: this.provider?.wallet.publicKey,
        grantee: new PublicKey(publicKey),
        granterPrivilege: null,
      })
      .transaction();

    return this.signAndSendTx(tx);
  }
}

export const web3Layer = new Web3Layer();
