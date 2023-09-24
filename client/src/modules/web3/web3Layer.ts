import { AnchorProvider, Program, setProvider, utils } from '@coral-xyz/anchor';
import { Backend, IDL } from '../../../../backend/target/types/backend';
import { UserInfo } from '../types/userInfo.interface';
import { EncodedGlobalConfig } from '../types/globalConfig.interface';
import { AnchorWallet } from '@solana/wallet-adapter-react';
import { PublicKey, TransactionSignature } from '@solana/web3.js';
import { Web3Connection } from './web3Connection';
import { getPKFromStringOrObject, getSolutionPda } from './utils';
import { Privilege } from '../types/privilege.interface';
import { CaseAccount } from '../types/case.interface';
import { SolutionAccount } from '../types/solution.interface';

export enum PDATypes {
  UserInfo = 'user-info',
  GlobalConfig = 'global-config',
  Case = 'case',
  Treasury = 'treasury',
  Solution = 'solution',
}

export enum AccountName {
  GlobalConfig = 'globalConfig',
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

  getPdaWithAuth(type: PDATypes, publicKey?: PublicKey, requiresAuth = false) {
    if (requiresAuth && this.provider === undefined) {
      throw new Error('User is not authenticated');
    }

    const seeds = [utils.bytes.utf8.encode(type)];

    if (publicKey) {
      seeds.push(publicKey.toBuffer());
    }

    return PublicKey.findProgramAddressSync(seeds, this.programId)[0];
  }

  getPdaWithSeeds(type: PDATypes, seedsStr: string[] = []) {
    const seeds = [
      utils.bytes.utf8.encode(type),
      ...seedsStr.map((s) => utils.bytes.utf8.encode(s)),
    ];

    return PublicKey.findProgramAddressSync(seeds, this.programId)[0];
  }

  async getAndParseAccountInfo<T>(
    pda: PublicKey,
    accountName: AccountName,
  ): Promise<T | undefined> {
    const res = await this.connection.getAccountInfo(pda);

    if (res?.data) {
      return this.program.coder.accounts.decode(accountName, res.data);
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
        userInfo: this.getPdaWithAuth(PDATypes.UserInfo, this.loggedUserPK),
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
        userInfo: this.getPdaWithAuth(PDATypes.UserInfo, this.loggedUserPK),
      })
      .transaction();

    return this.signAndSendTx(tx);
  }

  async getUserInfo(publicKey: string | PublicKey): Promise<UserInfo> {
    // TODO: Fix this so user info can be loaded without program being initialized
    const pda = this.getPdaWithAuth(
      PDATypes.UserInfo,
      getPKFromStringOrObject(publicKey),
    );
    return this.program.account.userInfo.fetch(pda);
  }

  async loadGlobalConfig() {
    const pda = this.getPdaWithSeeds(PDATypes.GlobalConfig);
    return this.getAndParseAccountInfo<EncodedGlobalConfig>(
      pda,
      AccountName.GlobalConfig,
    );
  }

  async initGlobalConfig(name: string, cases: string[]) {
    const payload = [
      {
        set_name: name,
        case_names: cases,
      },
    ];

    const tx = await this.program.methods
      .initGlobalConfig(JSON.stringify(payload))
      .accounts({
        admin: this.provider?.wallet.publicKey,
        globalConfig: this.getPdaWithAuth(PDATypes.GlobalConfig),
      })
      .transaction();

    return this.signAndSendTx(tx);
  }

  async appendSetToConfig(name: string, cases: string[]) {
    const tx = await this.program.methods
      .appendSetToConfig(name, cases)
      .accounts({
        admin: this.provider?.wallet.publicKey,
        globalConfig: this.getPdaWithAuth(PDATypes.GlobalConfig),
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

  async addCase(set: string, id: string, setup: string) {
    const tx = await this.program.methods
      .createCase(set, id, setup)
      .accounts({ signer: this.provider?.wallet.publicKey })
      .transaction();

    await this.signAndSendTx(tx);
  }

  async loadCases(): Promise<CaseAccount[]> {
    return this.program.account.case.all();
  }

  getTrasuryPda() {
    return this.getPdaWithSeeds(PDATypes.Treasury);
  }

  async addSolution(casePublicKey: string | PublicKey, solution: string) {
    const tx = await this.program.methods
      .addSolution(solution)
      .accounts({
        case: getPKFromStringOrObject(casePublicKey),
        solutionPda: getSolutionPda(casePublicKey, solution, this.programId),
      })
      .transaction();

    await this.signAndSendTx(tx);
  }

  async loadSolutions(): Promise<SolutionAccount[]> {
    return this.program.account.solution.all();
  }
}

export const web3Layer = new Web3Layer();
