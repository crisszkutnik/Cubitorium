import * as anchor from "@coral-xyz/anchor";
import { Program, web3 } from "@coral-xyz/anchor";
import { Backend } from "../target/types/backend";
import { casePda, fundAccounts, privilegePda } from "./utils";
import { keypairs } from "./test-keys";

import { expect } from "chai";
import {
  CASE_BASE_LEN,
  CASE_TAG,
  GLOBAL_CONFIG_TAG,
  PRIVILEGE_TAG,
  TREASURY_TAG,
} from "./constants";

describe("backend", () => {
  // Configure the client to use the local cluster.
  const provider = anchor.AnchorProvider.local();
  anchor.setProvider(provider);

  const program = anchor.workspace.Backend as Program<Backend>;

  const deployer = provider.wallet;
  const privilegedKeypair1: web3.Keypair = keypairs[1];
  const privilegedKeypair2: web3.Keypair = keypairs[2];

  const regularKeypair: web3.Keypair = keypairs[3];

  // const deployerWeb3Layer = new Web3Layer();
  // const privilegedKey1Web3Layer = new Web3Layer();
  // const regularKeyWeb3Layer = new Web3Layer();

  const treasury = web3.PublicKey.findProgramAddressSync(
    [Buffer.from(TREASURY_TAG)],
    program.programId
  )[0];

  const globalConfig = web3.PublicKey.findProgramAddressSync(
    [Buffer.from(GLOBAL_CONFIG_TAG)],
    program.programId
  )[0];

  before(async () => {
    // Fund accounts
    await fundAccounts(provider, [
      treasury,
      ...[...keypairs].map((k) => k.publicKey),
    ]);
  });

  describe("Privileged users", () => {
    it("Can't add a privileged user if not deployer", async () => {
      try {
        await program.methods
          .addPrivilegedUser()
          .accounts({
            granter: regularKeypair.publicKey,
            grantee: regularKeypair.publicKey,
            granterPrivilege: null,
          })
          .signers([regularKeypair])
          .rpc();
      } catch (e) {
        expect(e.error.errorCode.code).to.be.eq(`PrivilegeEscalation`);
      }
    });

    it("Can add itself as privileged user if it's the deployer", async () => {
      await program.methods
        .addPrivilegedUser()
        .accounts({
          granter: deployer.publicKey,
          grantee: deployer.publicKey,
          granterPrivilege: null,
        })
        .rpc();

      // Privilege exists
      const privilege = await program.account.privilege.fetch(
        privilegePda(deployer.publicKey, program.programId)
      );

      expect(privilege).to.not.be.null;
      expect(privilege.granter.toString()).to.eq(deployer.publicKey.toString());
      expect(privilege.grantee.toString()).to.eq(deployer.publicKey.toString());
    });

    it("Can add a privileged user", async () => {
      await program.methods
        .addPrivilegedUser()
        .accounts({
          granter: deployer.publicKey,
          grantee: privilegedKeypair1.publicKey,
        })
        .rpc();

      // Privilege exists
      const privilege = await program.account.privilege.fetch(
        privilegePda(privilegedKeypair1.publicKey, program.programId)
      );

      expect(privilege).to.not.be.null;
      expect(privilege.granter.toString()).to.eq(deployer.publicKey.toString());
      expect(privilege.grantee.toString()).to.eq(
        privilegedKeypair1.publicKey.toString()
      );
    });

    it("Can revoke a privilege", async () => {
      // Privilege exists
      let privilege = await program.account.privilege.fetch(
        privilegePda(privilegedKeypair1.publicKey, program.programId)
      );

      expect(privilege).to.not.be.null;

      // Revoke
      await program.methods
        .revokePrivilege(privilegedKeypair1.publicKey)
        .accounts({ revoker: deployer.publicKey })
        .rpc();

      // Privilege is gone
      privilege = await program.account.privilege.fetchNullable(
        privilegePda(privilegedKeypair1.publicKey, program.programId)
      );

      expect(privilege).to.be.null;

      // Add them back for future tests
      await program.methods
        .addPrivilegedUser()
        .accounts({
          granter: deployer.publicKey,
          grantee: privilegedKeypair1.publicKey,
        })
        .rpc();
      await program.methods
        .addPrivilegedUser()
        .accounts({
          granter: deployer.publicKey,
          grantee: privilegedKeypair2.publicKey,
        })
        .rpc();
    });

    it("Can init global config", async () => {
      let config = await program.account.globalConfig.fetchNullable(
        globalConfig
      );
      expect(config).to.be.null;

      await program.methods
        .initGlobalConfig("hi")
        .accounts({ admin: privilegedKeypair1.publicKey })
        .signers([privilegedKeypair1])
        .rpc();

      config = await program.account.globalConfig.fetch(globalConfig);
      expect(config).to.not.be.null;
      expect(config.setsJson).to.equal("hi");
    });

    it("Can edit global config", async () => {
      await program.methods
        .setGlobalConfig("bye")
        .accounts({ admin: privilegedKeypair1.publicKey })
        .signers([privilegedKeypair1])
        .rpc();

      let config = await program.account.globalConfig.fetchNullable(
        globalConfig
      );
      expect(config).to.not.be.null;
      expect(config.setsJson).to.equal("bye");
    });

    it("Cannot set global config as non-admin", async () => {
      try {
        await program.methods
          .setGlobalConfig("oops")
          .accounts({ admin: regularKeypair.publicKey })
          .signers([regularKeypair])
          .rpc();
      } catch (e) {
        expect(e.error.errorCode.code).to.be.eq(`AccountNotInitialized`);
      }
    });
  });

  describe("Cases and algorithms", () => {
    it("Cannot create a case if not privileged", async () => {
      let caseObj = {
        set: `OLL`,
        id: 1,
        setup: `F R U R' U' F'`,
      };

      try {
        await program.methods
          .createCase(caseObj.set, caseObj.id, caseObj.setup)
          .accounts({ signer: regularKeypair.publicKey })
          .signers([regularKeypair])
          .rpc();
      } catch (e) {
        // Fails like this, deal with it
        expect(e.error.errorCode.code).to.eq(`AccountNotInitialized`);
      }
    });

    it("Can create a case", async () => {
      let caseObj = {
        set: `OLL`,
        id: 1,
        setup: `F R U R' U' F'`,
      };

      let userBalanceBefore = await provider.connection.getBalance(
        deployer.publicKey
      );
      let treasuryBalanceBefore = await provider.connection.getBalance(
        treasury
      );

      await program.methods
        .createCase(caseObj.set, caseObj.id, caseObj.setup)
        .accounts({ signer: deployer.publicKey })
        .rpc();

      // Case exists
      const pdaCase = await program.account.case.fetch(
        casePda(caseObj.set, caseObj.id, program.programId)
      );

      expect(pdaCase).to.not.be.null;
      expect(Number(pdaCase.id)).to.eq(caseObj.id);
      expect(pdaCase.set).to.eq(caseObj.set);
      expect(pdaCase.setup).to.eq(caseObj.setup);
      expect(pdaCase.solutions).to.be.empty;
      // expect(pdaCase.state); TODO: CHECK WHEN IMPLEMENTED

      console.log("BIG PART OF THE TEST IS MISSING BRO! REMINDER!");

      // User didn't pay for this, but treasury did
      let userBalanceAfter = await provider.connection.getBalance(
        deployer.publicKey
      );
      let treasuryBalanceAfter = await provider.connection.getBalance(treasury);

      const rent = await provider.connection.getMinimumBalanceForRentExemption(
        CASE_BASE_LEN
      );

      expect(userBalanceBefore - userBalanceAfter).to.be.lessThan(rent);
      expect(treasuryBalanceBefore - treasuryBalanceAfter).to.be.eq(rent);
    });

    it("Can add a solution if it works", async () => {
      console.log(
        "WE STILL DON'T CHECK IF IT WORKS! DON'T FORGET TO FIX THIS DUMB IDIOT!"
      );

      let caseObj = {
        set: `OLL`,
        id: 1,
        setup: `F R U R' U' F'`,
      };
      let solution = `F U R U' R' F'`;

      let caseAddress = casePda(caseObj.set, caseObj.id, program.programId);
      let caseAccount = await program.account.case.fetch(caseAddress);

      // No solution stored
      expect(caseAccount.solutions).to.be.empty;

      await program.methods
        .addSolution(solution)
        .accounts({
          signer: regularKeypair.publicKey,
          case: caseAddress,
        })
        .signers([regularKeypair])
        .rpc();

      // Case has the solution now
      caseAccount = await program.account.case.fetch(caseAddress);
      expect(caseAccount.solutions.length).to.be.eq(1);
      expect(caseAccount.solutions[0]).to.be.eq(solution);
    });

    xit("Can't add a solution if it doesn't work", async () => {});
  });
});
