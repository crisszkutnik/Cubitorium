import { Program, web3 } from "@coral-xyz/anchor";
import { Backend } from "../target/types/backend";
import * as fs from "fs";
import { casePda, solutionKey } from "../tests/utils";
import { ComputeBudgetProgram } from "@solana/web3.js";

export const loadCasesFromCsv = async (
  path: string,
  set: string,
  program: Program<Backend>,
  batchSize = 3,
  deployer: web3.PublicKey,
  liker?: web3.Keypair
) => {
  console.log(`Loading ${set}...`);

  // Read file into array thing
  let content = fs
    .readFileSync(path, "utf-8")
    .split("\n")
    .map((row) => row.split(", "));

  content.shift(); // first one is headers
  content.pop(); // last one is always trash (empty)

  // Get stuff I need in a rather questionable fashion (I'm not a Licenciatura en Ciencias de la Computación - UBA student)
  let cases = content.map((row) => row[0]);
  let setups = content.map((row) => row[1]);
  let solutions = content.map((row) => row[2]);

  // Add set to config ix
  await program.methods
    .appendSetToConfig(set, cases)
    .accounts({ admin: deployer })
    .preInstructions([
      ComputeBudgetProgram.setComputeUnitLimit({ units: 1000000 }),
    ])
    .rpc();

  // Build createCase ixs
  let createCaseIxs = await Promise.all(
    setups.map((setup, i) =>
      program.methods
        .createCase(set, cases[i], setup)
        .accounts({ signer: deployer })
        .instruction()
    )
  );

  // Build addSolution ixs and optionally like 30% of them. Set LearningStatus too.
  let likeIxs = [];
  let addSolutionIxs = await Promise.all(
    solutions.map((solution, i) => {
      let caseAcc = casePda(set, cases[i], program.programId);
      let solutionPda = solutionKey(caseAcc, solution, program.programId);

      let addSolIx = program.methods
        .addSolution(solution)
        .accounts({ signer: deployer, case: caseAcc, solutionPda })
        .instruction();

      // welcome to hell
      if (liker && i % 3) {
        let likeIx = program.methods
          .likeSolution()
          .accounts({ signer: liker.publicKey, solutionPda })
          .signers([liker])
          .instruction();

        if (Math.floor(i / 2) % 2) {
          let learningIx = program.methods
            .setLearningStatus(
              Math.floor(i / 4) % 2 ? { learning: {} } : { learnt: {} }
            )
            .accounts({ signer: liker.publicKey, solutionPda })
            .signers([liker])
            .instruction();

          return Promise.all([addSolIx, likeIx, learningIx]);
        }

        return Promise.all([addSolIx, likeIx]);
      }

      return addSolIx;
    })
  ).then((res) => res.flat());

  // Send all ixs in batches
  let tx = new web3.Transaction();
  let allIxs = [...createCaseIxs, ...addSolutionIxs, ...likeIxs];
  for (let i = 0; i < allIxs.length; i += batchSize) {
    tx.add(...allIxs.slice(i, i + batchSize));

    // Always add this to not get unknown signer, best solution probably
    if (liker) {
      tx.add(
        await program.methods
          .changeUserInfo("Ben", "Baron", "2016BARO04", "Herzliya, Israel")
          .accounts({ user: liker.publicKey })
          .instruction()
      );
    }

    try {
      await program.provider.sendAndConfirm(tx, liker ? [liker] : [], {
        commitment: `confirmed`,
      });
    } catch (e) {
      console.log(e);
    }

    tx = new web3.Transaction();
  }
};

export const loadMultipleCasesFromCsv = async (
  basePath: string,
  paths: string[],
  sets: string[],
  program: Program<Backend>,
  batchSize = 3,
  deployer: web3.PublicKey,
  liker?: web3.Keypair
) => {
  for (let i = 0; i < paths.length; i++) {
    await new Promise((resolve) => setTimeout(resolve, 1000)); // sleep to wait a block to go by

    await loadCasesFromCsv(
      `${basePath}${paths[i]}`,
      sets[i],
      program,
      batchSize,
      deployer,
      liker
    );
  }
};
