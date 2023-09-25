import * as anchor from "@coral-xyz/anchor";
import { Program, web3 } from "@coral-xyz/anchor";
import { Backend } from "../target/types/backend";
import {
  casePda,
  fundAccounts,
  likePda,
  privilegePda,
  solutionKey,
} from "./utils";
import { keypairs } from "./test-keys";

import { assert, expect } from "chai";
import { CASE_BASE_LEN, GLOBAL_CONFIG_TAG, TREASURY_TAG } from "./constants";

describe("backend", () => {
  // Configure the client to use the local cluster.
  const provider = anchor.AnchorProvider.local();
  anchor.setProvider(provider);

  const program = anchor.workspace.Backend as Program<Backend>;
  const pid = program.programId;

  const deployer = provider.wallet;
  const privilegedKeypair1: web3.Keypair = keypairs[1];
  const privilegedKeypair2: web3.Keypair = keypairs[2];

  const regularKeypair: web3.Keypair = keypairs[3];

  // const deployerWeb3Layer = new Web3Layer();
  // const privilegedKey1Web3Layer = new Web3Layer();
  // const regularKeyWeb3Layer = new Web3Layer();

  const treasury = web3.PublicKey.findProgramAddressSync(
    [Buffer.from(TREASURY_TAG)],
    pid
  )[0];

  const globalConfig = web3.PublicKey.findProgramAddressSync(
    [Buffer.from(GLOBAL_CONFIG_TAG)],
    pid
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
        privilegePda(deployer.publicKey, pid)
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
        privilegePda(privilegedKeypair1.publicKey, pid)
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
        privilegePda(privilegedKeypair1.publicKey, pid)
      );

      expect(privilege).to.not.be.null;

      // Revoke
      await program.methods
        .revokePrivilege(privilegedKeypair1.publicKey)
        .accounts({ revoker: deployer.publicKey })
        .rpc();

      // Privilege is gone
      privilege = await program.account.privilege.fetchNullable(
        privilegePda(privilegedKeypair1.publicKey, pid)
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
        .appendSetToConfig("OLL", ["0", "1", "2", "40"])
        .accounts({ admin: privilegedKeypair1.publicKey })
        .signers([privilegedKeypair1])
        .rpc();

      let config = await program.account.globalConfig.fetchNullable(
        globalConfig
      );
      expect(config).to.not.be.null;
      expect(config.setsJson).to.equal(
        `[{"set_name":"OLL","case_names":["0","1","2","40"]}]`
      );
    });

    it("Can append to existing set in global config", async () => {
      await program.methods
        .appendSetToConfig("OLL", ["14"])
        .accounts({ admin: privilegedKeypair1.publicKey })
        .signers([privilegedKeypair1])
        .rpc();

      let config = await program.account.globalConfig.fetchNullable(
        globalConfig
      );
      expect(config).to.not.be.null;
      expect(config.setsJson).to.equal(
        `[{"set_name":"OLL","case_names":["0","1","14","2","40"]}]`
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
          casePda(caseObj.set, caseObj.id, pid)
        );

        expect(pdaCase).to.not.be.null;
        expect(pdaCase.id).to.eq(caseObj.id);
        expect(pdaCase.set).to.eq(caseObj.set);
        expect(pdaCase.setup).to.eq(caseObj.setup);
        expect(pdaCase.solutions).to.be.eq(0);
        assert.deepEqual(pdaCase.cubeState, {
          co: [0, 2, 1, 0, 0, 0, 0, 0],
          cp: [2, 1, 4, 3, 5, 6, 7, 8],
          eo: [0, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0],
          ep: [2, 3, 1, 4, 5, 6, 7, 8, 9, 10, 11, 12],
        });
        expect(pdaCase.pyraState).to.be.null;

        // User didn't pay for this, but treasury did
        let userBalanceAfter = await provider.connection.getBalance(
          deployer.publicKey
        );
        let treasuryBalanceAfter = await provider.connection.getBalance(
          treasury
        );

        const rent =
          await provider.connection.getMinimumBalanceForRentExemption(
            CASE_BASE_LEN + 41
          );

        expect(userBalanceBefore - userBalanceAfter).to.be.lessThan(rent);
        expect(treasuryBalanceBefore - treasuryBalanceAfter).to.be.eq(rent);
      });

      it("Can add a solution if it works", async () => {
        let solution = `F U R U' R' F'`;

        let caseAddress = casePda(caseObj.set, caseObj.id, pid);
        let solutionPda = solutionKey(caseAddress, solution, pid);
        let caseAccount = await program.account.case.fetch(caseAddress);

        // No solution stored
        expect(caseAccount.solutions).to.be.eq(0);

        await program.methods
          .addSolution(solution)
          .accounts({
            signer: regularKeypair.publicKey,
            case: caseAddress,
            solutionPda,
          })
          .signers([regularKeypair])
          .rpc();

        // Case has the solution now
        caseAccount = await program.account.case.fetch(caseAddress);
        let now = Date.now() / 1000;
        expect(caseAccount.solutions).to.be.eq(1);

        // Solution PDA has expected fields
        let solutionAccount = await program.account.solution.fetch(solutionPda);

        expect(solutionAccount.likes).to.be.eq(0);
        expect(solutionAccount.moves).to.be.eq(solution);
        expect(solutionAccount.author.toString()).to.be.eq(
          regularKeypair.publicKey.toString()
        );
        expect(Number(solutionAccount.timestamp)).to.be.approximately(now, 100);
      });

      it("Can't add a solution if it doesn't work", async () => {
        let solution = `B2 F2 L2 D2 R' U`;

        let caseAddress = casePda(caseObj.set, caseObj.id, pid);
        let caseAccount = await program.account.case.fetch(caseAddress);

        expect(caseAccount.setup).to.equal(caseObj.setup);

        try {
          await program.methods
            .addSolution(solution)
            .accounts({
              signer: regularKeypair.publicKey,
              case: caseAddress,
              solutionPda: solutionKey(caseAddress, solution, pid),
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

      let testCasePda = casePda("OLL", "2", pid);
      let solution1Pda = solutionKey(testCasePda, SOLUTION_1, pid);
      let solution2Pda = solutionKey(testCasePda, SOLUTION_2, pid);

      before(async () => {
        // We will test on this case
        await program.methods
          .createCase("OLL", "2", "R U R' U' R' F R F'")
          .accounts({ signer: deployer.publicKey })
          .rpc();

        await program.methods
          .addSolution(SOLUTION_1)
          .accounts({
            signer: deployer.publicKey,
            case: testCasePda,
            solutionPda: solution1Pda,
          })
          .rpc();

        await program.methods
          .addSolution(SOLUTION_2)
          .accounts({
            signer: deployer.publicKey,
            case: testCasePda,
            solutionPda: solution2Pda,
          })
          .rpc();

        // Solutions have no likes
        let solutionPda = await program.account.solution.fetch(solution1Pda);
        expect(solutionPda.likes).to.eq(0);
        solutionPda = await program.account.solution.fetch(solution2Pda);
        expect(solutionPda.likes).to.eq(0);
      });

      it("Can like a solution", async () => {
        await program.methods
          .likeSolution()
          .accounts({ signer: deployer.publicKey, solutionPda: solution1Pda })
          .rpc();

        // Like count updated
        let solutionPda = await program.account.solution.fetch(solution1Pda);
        expect(solutionPda.likes).to.eq(1);

        // Certificate created
        let likeCertKey = likePda(deployer.publicKey, solution1Pda, pid);
        let likeCertPda = await program.account.likeCertificate.fetch(
          likeCertKey
        );

        expect(likeCertPda).to.not.be.null;
        expect(JSON.stringify(likeCertPda.learningStatus)).to.be.eq(
          `{"notLearnt":{}}`
        );
      });

      it("Can't like a solution again", async () => {
        try {
          await program.methods
            .likeSolution()
            .accounts({ signer: deployer.publicKey, solutionPda: solution1Pda })
            .rpc();

          assert.fail("It needs to fail!");
        } catch (e) {
          expect(e.logs.join("").includes("already in use")).to.be.true;
        }
      });

      it("Can remove a like", async () => {
        // Like exists
        let likeCert = await program.account.likeCertificate.fetchNullable(
          likePda(deployer.publicKey, solution1Pda, pid)
        );
        expect(likeCert).to.not.be.null;

        await program.methods
          .removeLike()
          .accounts({ signer: deployer.publicKey, solutionPda: solution1Pda })
          .rpc();

        // Like doesn't exist anymore
        likeCert = await program.account.likeCertificate.fetchNullable(
          likePda(deployer.publicKey, solution1Pda, pid)
        );
        expect(likeCert).to.be.null;

        // Like count updated
        let solutionPda = await program.account.solution.fetch(solution1Pda);
        expect(solutionPda.likes).to.eq(0);
      });

      it("Can't remove a like if it's not liked", async () => {
        // Nobody liked it (must suck)
        let solutionPda = await program.account.solution.fetch(solution1Pda);
        expect(solutionPda.likes).to.eq(0);

        try {
          await program.methods
            .removeLike()
            .accounts({ signer: deployer.publicKey, solutionPda: solution1Pda })
            .rpc();
        } catch (e) {
          expect(e.error.errorCode.code).to.eq("AccountNotInitialized");
        }
      });

      it("Can like an already liked solution (another user)", async () => {
        // Like SOLUTION_1
        await program.methods
          .likeSolution()
          .accounts({ signer: deployer.publicKey, solutionPda: solution1Pda })
          .rpc();

        let solutionPda = await program.account.solution.fetch(solution1Pda);
        expect(solutionPda.likes).to.eq(1);

        // Like SOLUTION_1 again (other user)
        await program.methods
          .likeSolution()
          .accounts({
            signer: regularKeypair.publicKey,
            solutionPda: solution1Pda,
          })
          .signers([regularKeypair])
          .rpc();

        solutionPda = await program.account.solution.fetch(solution1Pda);
        expect(solutionPda.likes).to.eq(2);
      });

      it("Can set learning status to learning", async () => {
        await program.methods
          .setLearningStatus({ learning: {} })
          .accounts({ solutionPda: solution1Pda })
          .rpc();

        let likeCertKey = likePda(deployer.publicKey, solution1Pda, pid);
        let likeCertPda = await program.account.likeCertificate.fetch(
          likeCertKey
        );

        expect(JSON.stringify(likeCertPda.learningStatus)).to.eq(
          `{"learning":{}}`
        );
      });

      it("Can set learning status to learnt", async () => {
        await program.methods
          .setLearningStatus({ learnt: {} })
          .accounts({ solutionPda: solution1Pda })
          .rpc();

        let likeCertKey = likePda(deployer.publicKey, solution1Pda, pid);
        let likeCertPda = await program.account.likeCertificate.fetch(
          likeCertKey
        );

        expect(JSON.stringify(likeCertPda.learningStatus)).to.eq(
          `{"learnt":{}}`
        );
      });

      it("Can set learning status to not learnt again", async () => {
        await program.methods
          .setLearningStatus({ notLearnt: {} })
          .accounts({ solutionPda: solution1Pda })
          .rpc();

        let likeCertKey = likePda(deployer.publicKey, solution1Pda, pid);
        let likeCertPda = await program.account.likeCertificate.fetch(
          likeCertKey
        );

        expect(JSON.stringify(likeCertPda.learningStatus)).to.eq(
          `{"notLearnt":{}}`
        );
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

    // Pyra 2flip
    let l4eCase = {
      set: `L4E`,
      id: `1`,
      setup: `L R' L B' L' U' B L`,
    };

    let ollCasePda = casePda(ollCase.set, ollCase.id, pid);
    let pllCasePda = casePda(pllCase.set, pllCase.id, pid);
    let f2lCasePda = casePda(f2lCase.set, f2lCase.id, pid);
    let l4eCasePda = casePda(l4eCase.set, l4eCase.id, pid);

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
      await program.methods
        .appendSetToConfig("L4E", ["1"])
        .accounts({ admin: deployer.publicKey })
        .rpc();
      await program.methods
        .appendSetToConfig("CMLL", ["0"])
        .accounts({ admin: deployer.publicKey })
        .rpc();
      await program.methods
        .appendSetToConfig("CLL", ["0"])
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
      await program.methods
        .createCase(l4eCase.set, l4eCase.id, l4eCase.setup)
        .accounts({ signer: deployer.publicKey })
        .rpc();

      // Fake solved cases to just test on a solved cube
      await program.methods
        .createCase("CMLL", "0", "")
        .accounts({ signer: deployer.publicKey })
        .rpc();
      await program.methods
        .createCase("CLL", "0", "")
        .accounts({ signer: deployer.publicKey })
        .rpc();
    });

    describe(`Happy path`, async () => {
      it("Can add a different solution to the OLL case", async () => {
        await program.methods
          .addSolution("R U' L' U R' U' L")
          .accounts({
            signer: deployer.publicKey,
            case: ollCasePda,
            solutionPda: solutionKey(ollCasePda, "R U' L' U R' U' L", pid),
          })
          .rpc();
      });

      it("Can add a different solution to the PLL case", async () => {
        await program.methods
          .addSolution("F U R' D' R U R' D R U2 F'")
          .accounts({
            signer: deployer.publicKey,
            case: pllCasePda,
            solutionPda: solutionKey(
              pllCasePda,
              "F U R' D' R U R' D R U2 F'",
              pid
            ),
          })
          .rpc();
      });

      it("Can add a different solution to the F2L case", async () => {
        await program.methods
          .addSolution("U' R' F R F'")
          .accounts({
            signer: deployer.publicKey,
            case: f2lCasePda,
            solutionPda: solutionKey(f2lCasePda, "U' R' F R F'", pid),
          })
          .rpc();
      });

      it("Can add a different solution to the L4E case", async () => {
        await program.methods
          .addSolution("L' U R L' R U' R' U' R' U' R")
          .accounts({
            signer: deployer.publicKey,
            case: l4eCasePda,
            solutionPda: solutionKey(
              l4eCasePda,
              "L' U R L' R U' R' U' R' U' R",
              pid
            ),
          })
          .rpc();

        // No error
      });

      it("Can't add the same solution again", async () => {
        try {
          await program.methods
            .addSolution("L' U R L' R U' R' U' R' U' R")
            .accounts({
              signer: deployer.publicKey,
              case: l4eCasePda,
              solutionPda: solutionKey(
                l4eCasePda,
                "L' U R L' R U' R' U' R' U' R",
                pid
              ),
            })
            .rpc();
        } catch (e) {
          expect(e.logs.join(" ").includes("already in use")).to.be.true;
        }
      });

      it("Validates CMLL", async () => {
        await program.methods
          .addSolution("R L' B R' L U'")
          .accounts({
            signer: deployer.publicKey,
            case: casePda("CMLL", "0", pid),
            solutionPda: solutionKey(
              casePda("CMLL", "0", pid),
              "R L' B R' L U'",
              pid
            ),
          })
          .rpc();
      });

      it("Validates CLL", async () => {
        await program.methods
          .addSolution("R L' U2 D2 R' L F2 B2")
          .accounts({
            signer: deployer.publicKey,
            case: casePda("CLL", "0", pid),
            solutionPda: solutionKey(
              casePda("CLL", "0", pid),
              "R L' U2 D2 R' L F2 B2",
              pid
            ),
          })
          .rpc();
      });
    });

    describe(`Unhappy path`, async () => {
      it("Can't add a different solution to the OLL case if it doesn't work", async () => {
        try {
          await program.methods
            .addSolution("R U' L' U R' U'")
            .accounts({
              signer: deployer.publicKey,
              case: ollCasePda,
              solutionPda: solutionKey(ollCasePda, "R U' L' U R' U'", pid),
            })
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
            .accounts({
              signer: deployer.publicKey,
              case: pllCasePda,
              solutionPda: solutionKey(
                pllCasePda,
                "F U R' D' R U R' D R U2",
                pid
              ),
            })
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
            .accounts({
              signer: deployer.publicKey,
              case: f2lCasePda,
              solutionPda: solutionKey(f2lCasePda, "U' R' F R F' D", pid),
            })
            .rpc();

          assert.fail("It needs to fail!");
        } catch (e) {
          assert.equal(e.error.errorCode.code, `UnsolvedCube`);
        }
      });
    });
  });
});
