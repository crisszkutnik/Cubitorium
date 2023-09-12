import { AnchorProvider, Program, setProvider, utils } from '@coral-xyz/anchor';
import { Backend, IDL } from '../../../../backend/target/types/backend';
import { UserInfo } from '../types/userInfo.interface';
import { SetsMap } from '../types/globalConfig.interface';
import { AnchorWallet } from '@solana/wallet-adapter-react';
import { PublicKey, TransactionSignature } from '@solana/web3.js';
import { Web3Connection } from './web3Connection';
import { getPKFromStringOrObject } from './utils';
import { Privilege } from '../types/privilege.interface';

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

  getPDAAddress(type: PDATypes, publicKey?: PublicKey, requiresAuth = false) {
    if (requiresAuth && this.provider === undefined) {
      throw new Error('User is not authenticated');
    }

    const seeds = [utils.bytes.utf8.encode(type)];

    if (publicKey) {
      seeds.push(publicKey.toBuffer());
    }

    return PublicKey.findProgramAddressSync(seeds, this.programId)[0];
  }

  async getAndParseAccountInfo<T>(pda: PublicKey): Promise<T | undefined> {
    const res = await this.connection.getAccountInfo(pda);

    if (res?.data) {
      return JSON.parse(res.data.toString(undefined, 12));
    }
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

  async getUserInfo(publicKey: string | PublicKey): Promise<UserInfo> {
    // TODO: Fix this so user info can be loaded without program being initialized
    const pda = this.getPDAAddress(
      PDATypes.UserInfo,
      getPKFromStringOrObject(publicKey),
    );
    return this.program.account.userInfo.fetch(pda);
  }

  async loadGlobalConfig() {
    const pda = this.getPDAAddress(PDATypes.GlobalConfig, undefined, false);

    return this.getAndParseAccountInfo<SetsMap>(pda);
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

    await this.signAndSendTx(tx);
  }

  async addPrivilegedUser(
    publicKey: string,
    privilege: Privilege | null | undefined,
  ): Promise<TransactionSignature> {
    const tx = await this.program.methods
      .addPrivilegedUser()
      .accounts({
        granter: this.provider?.wallet.publicKey,
        grantee: new PublicKey(publicKey),
        granterPrivilege: privilege ? privilege.publicKey : privilege,
      })
      .transaction();

    return this.signAndSendTx(tx);
  }

  async revokePrivilege(publicKey: string) {
    const tx = await this.program.methods
      .revokePrivilege(new PublicKey(publicKey))
      .accounts({
        revoker: this.provider?.wallet.publicKey,
      })
      .transaction();

    await this.signAndSendTx(tx);
  }

  async fetchAllUserPrivilege(): Promise<Privilege[]> {
    return this.program.account.privilege.all();
  }
}

export const web3Layer = new Web3Layer();
