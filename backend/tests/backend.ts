import * as anchor from "@coral-xyz/anchor";
import { Program, web3 } from "@coral-xyz/anchor";
import { Backend } from "../target/types/backend";
import { casePda, fundAccounts, privilegePda } from "./utils";
import { keypairs } from "./test-keys";

import { assert, expect } from "chai";
import { CASE_BASE_LEN, GLOBAL_CONFIG_TAG, TREASURY_TAG } from "./constants";

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

        assert.fail("It needs to fail!");
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
        .initGlobalConfig("[]")
        .accounts({ admin: privilegedKeypair1.publicKey })
        .signers([privilegedKeypair1])
        .rpc();

      config = await program.account.globalConfig.fetch(globalConfig);
      expect(config).to.not.be.null;
      expect(config.setsJson).to.equal("[]");
    });

    it("Can edit global config", async () => {
      await program.methods
        .appendSetToConfig("OLL", ["1", "2", "40"])
        .accounts({ admin: privilegedKeypair1.publicKey })
        .signers([privilegedKeypair1])
        .rpc();

      let config = await program.account.globalConfig.fetchNullable(
        globalConfig
      );
      expect(config).to.not.be.null;
      expect(config.setsJson).to.equal(
        `[{"set_name":"OLL","case_names":["1","2","40"]}]`
      );
    });

    it("Cannot set global config as non-admin", async () => {
      try {
        await program.methods
          .appendSetToConfig("oops", [])
          .accounts({ admin: regularKeypair.publicKey })
          .signers([regularKeypair])
          .rpc();

        assert.fail("It needs to fail!");
      } catch (e) {
        expect(e.error.errorCode.code).to.be.eq(`AccountNotInitialized`);
      }
    });
  });

  describe("Cases and algorithms - basic", () => {
    let caseObj = {
      set: `OLL`,
      id: `1`,
      setup: `F R U R' U' F'`,
    };

    describe("Creation and solution submission", async () => {
      it("Cannot create a case if not privileged", async () => {
        try {
          await program.methods
            .createCase(caseObj.set, caseObj.id, caseObj.setup)
            .accounts({ signer: regularKeypair.publicKey })
            .signers([regularKeypair])
            .rpc();

          assert.fail("It needs to fail!");
        } catch (e) {
          // Fails like this, deal with it
          expect(e.error.errorCode.code).to.eq(`AccountNotInitialized`);
        }
      });

      it("Cannot create a case if set not in global config", async () => {
        try {
          await program.methods
            .createCase(`F2L`, caseObj.id, caseObj.setup)
            .accounts({ signer: privilegedKeypair1.publicKey })
            .signers([privilegedKeypair1])
            .rpc();

          assert.fail("It needs to fail!");
        } catch (e) {
          expect(e.error.errorCode.code).to.eq(`InvalidSet`);
        }
      });

      it("Cannot create a case if case not in global config", async () => {
        try {
          await program.methods
            .createCase(caseObj.set, `69`, caseObj.setup)
            .accounts({ signer: privilegedKeypair1.publicKey })
            .signers([privilegedKeypair1])
            .rpc();

          assert.fail("It needs to fail!");
        } catch (e) {
          expect(e.error.errorCode.code).to.eq(`InvalidCase`);
        }
      });

      it("Can create a case", async () => {
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
        expect(pdaCase.id).to.eq(caseObj.id);
        expect(pdaCase.set).to.eq(caseObj.set);
        expect(pdaCase.setup).to.eq(caseObj.setup);
        expect(pdaCase.solutions).to.be.empty;
        assert.deepEqual(pdaCase.state, {
          co: [0, 2, 1, 0, 0, 0, 0, 0],
          cp: [2, 1, 4, 3, 5, 6, 7, 8],
          eo: [0, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0],
          ep: [2, 3, 1, 4, 5, 6, 7, 8, 9, 10, 11, 12],
        });

        // User didn't pay for this, but treasury did
        let userBalanceAfter = await provider.connection.getBalance(
          deployer.publicKey
        );
        let treasuryBalanceAfter = await provider.connection.getBalance(
          treasury
        );

        const rent =
          await provider.connection.getMinimumBalanceForRentExemption(
            CASE_BASE_LEN
          );

        expect(userBalanceBefore - userBalanceAfter).to.be.lessThan(rent);
        expect(treasuryBalanceBefore - treasuryBalanceAfter).to.be.eq(rent);
      });

      it("Can add a solution if it works", async () => {
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
        let now = Date.now() / 1000;
        expect(caseAccount.solutions.length).to.be.eq(1);
        expect(caseAccount.solutions[0].likes).to.be.eq(0);
        expect(caseAccount.solutions[0].moves).to.be.eq(solution);
        expect(caseAccount.solutions[0].author.toString()).to.be.eq(
          regularKeypair.publicKey.toString()
        );
        expect(Number(caseAccount.solutions[0].timestamp)).to.be.approximately(
          now,
          100
        );
      });

      it("Can't add a solution if it doesn't work", async () => {
        let solution = `B2 F2 L2 D2 R' U`;

        let caseAddress = casePda(caseObj.set, caseObj.id, program.programId);
        let caseAccount = await program.account.case.fetch(caseAddress);

        expect(caseAccount.setup).to.equal(caseObj.setup);

        try {
          await program.methods
            .addSolution(solution)
            .accounts({
              signer: regularKeypair.publicKey,
              case: caseAddress,
            })
            .signers([regularKeypair])
            .rpc();

          assert.fail("It needs to fail!");
        } catch (e) {
          expect(e.error.errorCode.code).to.eq(`UnsolvedCube`);
        }
      });
    });

    describe("Likes", async () => {
      const SOLUTION_1 = "F R' F' R U R U' R'";
      const SOLUTION_2 = "F R U' R' U' R U R' F'";

      let testCasePda = casePda("OLL", "2", program.programId);

      before(async () => {
        // We will test on this case
        await program.methods
          .createCase("OLL", "2", "R U R' U' R' F R F'")
          .accounts({ signer: deployer.publicKey })
          .rpc();

        await program.methods
          .addSolution(SOLUTION_1)
          .accounts({ signer: deployer.publicKey, case: testCasePda })
          .rpc();

        await program.methods
          .addSolution(SOLUTION_2)
          .accounts({ signer: deployer.publicKey, case: testCasePda })
          .rpc();

        let casePda = await program.account.case.fetch(testCasePda);
        expect(casePda.solutions.every((elem) => elem.likes === 0));
        expect(casePda.solutions.length).to.eq(2);
      });

      it("Can like a solution", async () => {
        await program.methods
          .likeSolution(SOLUTION_1)
          .accounts({ signer: deployer.publicKey, case: testCasePda })
          .rpc();

        let casePda = await program.account.case.fetch(testCasePda);

        let target = casePda.solutions.find((elem) => elem.likes > 0);

        expect(target.likes).to.eq(1);
        expect(target.moves).to.eq(SOLUTION_1);
      });

      it("Can't like a solution again", async () => {
        try {
          await program.methods
            .likeSolution(SOLUTION_1)
            .accounts({ signer: deployer.publicKey, case: testCasePda })
            .rpc();

          assert.fail("It needs to fail!");
        } catch (e) {
          expect(e.error.errorCode.code).to.be.eq("AlreadyLiked");
        }
      });

      it("Can change like of solution within case", async () => {
        let casePda = await program.account.case.fetch(testCasePda);

        let target = casePda.solutions.find((elem) => elem.likes > 0);
        expect(target.likes).to.eq(1);
        expect(target.moves).to.eq(SOLUTION_1);

        await program.methods
          .likeSolution(SOLUTION_2)
          .accounts({ signer: deployer.publicKey, case: testCasePda })
          .rpc();

        casePda = await program.account.case.fetch(testCasePda);

        target = casePda.solutions.find((elem) => elem.likes > 0);
        expect(target.likes).to.eq(1);
        expect(target.moves).to.eq(SOLUTION_2);
      });

      it("Can remove a like", async () => {
        let casePda = await program.account.case.fetch(testCasePda);

        let target = casePda.solutions.find((elem) => elem.likes > 0);
        expect(target.likes).to.eq(1);
        expect(target.moves).to.eq(SOLUTION_2);

        await program.methods
          .removeLike()
          .accounts({ signer: deployer.publicKey, case: testCasePda })
          .rpc();

        casePda = await program.account.case.fetch(testCasePda);

        target = casePda.solutions.find((elem) => elem.moves == SOLUTION_2);
        expect(target.likes).to.eq(0);
      });

      it("Can't remove a like if it's not liked", async () => {
        let casePda = await program.account.case.fetch(testCasePda);

        // No liked case
        expect(casePda.solutions.filter((elem) => elem.likes > 0).length).to.eq(
          0
        );

        try {
          await program.methods
            .removeLike()
            .accounts({ signer: deployer.publicKey, case: testCasePda })
            .rpc();
        } catch (e) {
          expect(e.error.errorCode.code).to.eq("AccountNotInitialized");
        }
      });

      it("Can like an already liked solution (another user)", async () => {
        let casePda = await program.account.case.fetch(testCasePda);
        let target = casePda.solutions.find((elem) => elem.moves == SOLUTION_1);
        expect(target.likes).to.eq(0);

        // Like SOLUTION_1
        await program.methods
          .likeSolution(SOLUTION_1)
          .accounts({ signer: deployer.publicKey, case: testCasePda })
          .rpc();

        casePda = await program.account.case.fetch(testCasePda);
        target = casePda.solutions.find((elem) => elem.moves == SOLUTION_1);
        expect(target.likes).to.eq(1);

        // Like SOLUTION_1 again (other user)
        await program.methods
          .likeSolution(SOLUTION_1)
          .accounts({ signer: regularKeypair.publicKey, case: testCasePda })
          .signers([regularKeypair])
          .rpc();

        casePda = await program.account.case.fetch(testCasePda);
        target = casePda.solutions.find((elem) => elem.moves == SOLUTION_1);
        expect(target.likes).to.eq(2);
      });

      it("Can like another solution within case (another user)", async () => {
        let casePda = await program.account.case.fetch(testCasePda);
        let target = casePda.solutions.find((elem) => elem.moves == SOLUTION_1);
        expect(target.likes).to.eq(2);

        // Like SOLUTION_2
        await program.methods
          .likeSolution(SOLUTION_2)
          .accounts({ signer: privilegedKeypair1.publicKey, case: testCasePda })
          .signers([privilegedKeypair1])
          .rpc();

        casePda = await program.account.case.fetch(testCasePda);
        expect(casePda.solutions.filter((elem) => elem.likes > 0).length).to.eq(
          2
        );
      });

      it("Can't like a solution that doesn't exist", async () => {
        try {
          await program.methods
            .likeSolution("benbenben")
            .accounts({ signer: deployer.publicKey, case: testCasePda })
            .rpc();

          assert.fail("It needs to fail!");
        } catch (e) {
          expect(e.error.errorCode.code).to.be.eq("SolutionDoesntExist");
        }
      });
    });
  });

  describe("Cases and algorithms - advanced", () => {
    // Sune
    let ollCase = {
      set: `OLL`,
      id: `40`,
      setup: `R U2 R' U' R U' R'`,
    };

    // A Perm
    let pllCase = {
      set: `PLL`,
      id: `Aa`,
      setup: `R' F R' B2 R F' R' B2 R2`,
    };

    // 3 move insert
    let f2lCase = {
      set: `F2L`,
      id: `1`,
      setup: `R U R'`,
    };

    let ollCasePda = casePda(ollCase.set, ollCase.id, program.programId);
    let pllCasePda = casePda(pllCase.set, pllCase.id, program.programId);
    let f2lCasePda = casePda(f2lCase.set, f2lCase.id, program.programId);

    before(async () => {
      // Let's add a PLL, OLL, and F2L case.

      // We need to edit config first to allow this to happen
      await program.methods
        .appendSetToConfig("PLL", ["Aa"])
        .accounts({ admin: deployer.publicKey })
        .rpc();
      await program.methods
        .appendSetToConfig("F2L", ["1"])
        .accounts({ admin: deployer.publicKey })
        .rpc();

      // Adding the cases now!
      await program.methods
        .createCase(ollCase.set, ollCase.id, ollCase.setup)
        .accounts({ signer: deployer.publicKey })
        .rpc();
      await program.methods
        .createCase(pllCase.set, pllCase.id, pllCase.setup)
        .accounts({ signer: deployer.publicKey })
        .rpc();
      await program.methods
        .createCase(f2lCase.set, f2lCase.id, f2lCase.setup)
        .accounts({ signer: deployer.publicKey })
        .rpc();
    });

    describe(`Happy path`, async () => {
      it("Can add a different solution to the OLL case", async () => {
        await program.methods
          .addSolution("R U' L' U R' U' L")
          .accounts({ signer: deployer.publicKey, case: ollCasePda })
          .rpc();
      });

      it("Can add a different solution to the PLL case", async () => {
        await program.methods
          .addSolution("F U R' D' R U R' D R U2 F'")
          .accounts({ signer: deployer.publicKey, case: pllCasePda })
          .rpc();
      });

      it("Can add a different solution to the F2L case", async () => {
        await program.methods
          .addSolution("U' R' F R F'")
          .accounts({ signer: deployer.publicKey, case: f2lCasePda })
          .rpc();
      });
    });

    describe(`Unhappy path`, async () => {
      it("Can't add a different solution to the OLL case if it doesn't work", async () => {
        try {
          await program.methods
            .addSolution("R U' L' U R' U'")
            .accounts({ signer: deployer.publicKey, case: ollCasePda })
            .rpc();

          assert.fail("It needs to fail!");
        } catch (e) {
          assert.equal(e.error.errorCode.code, `UnsolvedCube`);
        }
      });

      it("Can't add a different solution to the PLL case if it doesn't work", async () => {
        try {
          await program.methods
            .addSolution("F U R' D' R U R' D R U2")
            .accounts({ signer: deployer.publicKey, case: pllCasePda })
            .rpc();

          assert.fail("It needs to fail!");
        } catch (e) {
          assert.equal(e.error.errorCode.code, `UnsolvedCube`);
        }
      });

      it("Can't add a different solution to the F2L case if it doesn't work", async () => {
        try {
          await program.methods
            .addSolution("U' R' F R F' D")
            .accounts({ signer: deployer.publicKey, case: f2lCasePda })
            .rpc();

          assert.fail("It needs to fail!");
        } catch (e) {
          assert.equal(e.error.errorCode.code, `UnsolvedCube`);
        }
      });
    });
  });
});
