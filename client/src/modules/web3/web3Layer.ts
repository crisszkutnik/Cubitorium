import {
  AnchorProvider,
  BN,
  Program,
  setProvider,
  utils,
} from '@coral-xyz/anchor';
import { Backend, IDL } from '../../../../backend/target/types/backend';
import { UserInfo } from '../types/userInfo.interface';
import { GlobalConfig } from '../types/globalConfig.interface';
import { AnchorWallet } from '@solana/wallet-adapter-react';
import { PublicKey, TransactionSignature } from '@solana/web3.js';
import { Web3Connection } from './web3Connection';
import {
  getPKFromStringOrObject,
  getParsedLearningStatus,
  getRawLearningStatus,
  getSetPda,
  getSolutionPda,
  cleanSolution,
} from './utils';
import { Privilege } from '../types/privilege.interface';
import { CaseAccount } from '../types/case.interface';
import { SolutionAccount } from '../types/solution.interface';
import {
  LearningStatus,
  LikeCertificate,
  LikeCertificateAccount,
  ParsedLikeCertificateAccount,
} from '../types/likeCertificate.interface';
import { SolutionAlreadyExistsError } from '../utils/SolutionAlreadyExistsError';

export enum PDATypes {
  UserInfo = 'user-info',
  GlobalConfig = 'global-config',
  Case = 'case',
  Treasury = 'treasury',
  Solution = 'solution',
  LikeCertificate = 'like-certificate',
  Set = 'set',
}

export enum AccountName {
  GlobalConfig = 'globalConfig',
}

class Web3Layer extends Web3Connection {
  private _program: Program<Backend> | undefined;

  get program() {
    if (this._program === undefined) {
      return this.setAnonymousProgram();
    }

    return this._program;
  }

  private setAnonymousProgram() {
    this._program = new Program<Backend>(IDL, import.meta.env.VITE_PROGRAM_ID, {
      connection: this.connection,
    });
    return this._program;
  }

  private setRegisteredProgram() {
    this._program = new Program<Backend>(IDL, import.meta.env.VITE_PROGRAM_ID);
    return this._program;
  }

  setWallet(wallet: AnchorWallet) {
    const provider = new AnchorProvider(this.connection, wallet, {
      commitment: `confirmed`,
    });

    setProvider(provider);
    this.provider = provider;
    this.setRegisteredProgram();
  }

  reset() {
    this.provider = undefined;
    this.setAnonymousProgram();
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
    name?: string,
    surname?: string,
    wcaId?: string,
    location?: string,
    birthdate?: string,
    profileImgSrc?: string,
  ): Promise<TransactionSignature> {
    const tx = await this.program.methods
      .sendUserInfo(
        name || null,
        surname || null,
        wcaId || null,
        location || null,
        birthdate || null,
        profileImgSrc || null,
      )
      .accounts({
        user: this.provider?.wallet.publicKey,
        userInfo: this.getPdaWithAuth(PDATypes.UserInfo, this.loggedUserPK),
      })
      .transaction();

    return this.signAndSendTx(tx);
  }

  async changeUserInfo(
    name?: string,
    surname?: string,
    wcaId?: string,
    location?: string,
    birthdate?: string,
    profileImgSrc?: string,
  ): Promise<TransactionSignature> {
    const tx = await this.program.methods
      .changeUserInfo(
        name || null,
        surname || null,
        wcaId || null,
        location || null,
        birthdate || null,
        profileImgSrc || null,
      )
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
    return this.program.account.userInfo.fetch(
      pda,
    ) as unknown as Promise<UserInfo>;
  }

  async loadGlobalConfig(): Promise<GlobalConfig> {
    const acc = await this.program.account.globalConfig.all();
    const maxFundLimit = acc[0].account.maxFundLimit;

    const config = await this.program.account.set.fetchMultiple(
      acc[0].account.sets,
    );

    if (config === null) {
      return {
        maxFundLimit,
        sets: [],
      };
    }

    const sets = config
      .filter((c) => c)
      // eslint-disable-next-line  @typescript-eslint/no-explicit-any
      .map(({ setName, caseNames }: any) => ({
        setName,
        caseNames: JSON.parse(caseNames),
      }));

    return {
      maxFundLimit,
      sets,
    };
  }

  async appendSetToConfig(set: string, cases: string[]) {
    const setKey = getSetPda(set, this.program.programId);
    const existing = !!(await this.program.account.set.fetchNullable(setKey));

    const tx = await this.program.methods
      .appendSetToConfig(set, cases)
      .accounts({
        admin: this.provider?.wallet.publicKey,
        existingSet: existing ? setKey : null,
        newSet: existing ? null : setKey,
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
    const cSolution = cleanSolution(solution);
    const solutionPda = getSolutionPda(
      casePublicKey,
      cSolution,
      this.programId,
    );
    console.log(solutionPda.toString());

    try {
      // Check if account exists, if it does not exists it will throw
      await this.program.account.solution.fetch(solutionPda);
      throw new SolutionAlreadyExistsError();
    } catch (e) {
      if (e instanceof SolutionAlreadyExistsError) {
        // Keep propagating error because solution already exists
        throw e;
      }

      const tx = await this.program.methods
        .addSolution(cSolution)
        .accounts({
          case: getPKFromStringOrObject(casePublicKey),
          solutionPda: solutionPda,
        })
        .transaction();

      await this.signAndSendTx(tx);
    }
  }

  async loadSolutions(): Promise<SolutionAccount[]> {
    return this.program.account.solution.all();
  }

  async likeSolution(solutionPda: PublicKey) {
    const tx = await this.program.methods
      .likeSolution()
      .accounts({
        solutionPda,
      })
      .transaction();

    await this.signAndSendTx(tx);
  }

  async loadLike(likePda: PublicKey): Promise<ParsedLikeCertificateAccount> {
    const account = (await this.program.account.likeCertificate.fetch(
      likePda,
    )) as LikeCertificate;

    return {
      publicKey: likePda,
      account: {
        ...account,
        parsedLearningStatus: getParsedLearningStatus(
          // eslint-disable-next-line  @typescript-eslint/no-explicit-any
          account.learningStatus as any,
        ),
      },
    };
  }

  async removeLike(solutionPda: PublicKey) {
    const tx = await this.program.methods
      .removeLike()
      .accounts({
        solutionPda,
      })
      .transaction();

    await this.signAndSendTx(tx);
  }

  async loadLikesForUser(): Promise<ParsedLikeCertificateAccount[]> {
    const accs = (await this.program.account.likeCertificate.all([
      {
        memcmp: {
          offset: 8 + 1,
          bytes: this.loggedUserPK.toBase58(),
        },
      },
    ])) as LikeCertificateAccount[];

    return accs.map((acc) => ({
      ...acc,
      account: {
        ...acc.account,
        parsedLearningStatus: getParsedLearningStatus(
          // eslint-disable-next-line  @typescript-eslint/no-explicit-any
          acc.account as any,
        ),
      },
    }));
  }

  async setLearningStatus(
    learningStatus: LearningStatus,
    solutionPda: PublicKey,
  ) {
    const tx = await this.program.methods
      .setLearningStatus(getRawLearningStatus(learningStatus))
      .accounts({
        solutionPda,
      })
      .transaction();

    await this.signAndSendTx(tx);
  }

  async setMaxFundLimit(value: string) {
    await this.program.methods.setMaxFundLimit(new BN(value)).rpc();
  }
}

export const web3Layer = new Web3Layer();
