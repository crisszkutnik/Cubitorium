import { Program, web3 } from "@coral-xyz/anchor";
import { Backend } from "../target/types/backend";
import * as fs from "fs";
import { casePda, setPda, solutionKey } from "../tests/utils";
import { ComputeBudgetProgram } from "@solana/web3.js";

export const loadCasesFromCsv = async (
  path: string,
  set: string,
  program: Program<Backend>,
  deployer: web3.PublicKey,
  batchSize = 3,
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
  const setKey = setPda(set, program.programId);
  let existing = !!(await program.account.set.fetchNullable(setKey));
  await program.methods
    .appendSetToConfig(set, cases)
    .accounts({
      admin: deployer,
      existingSet: existing ? setKey : null,
      newSet: existing ? null : setKey,
    })
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
  let likeIxsPromises: Promise<web3.TransactionInstruction>[] = [];

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
        likeIxsPromises.push(
          program.methods
            .likeSolution()
            .accounts({ signer: liker.publicKey, solutionPda })
            .signers([liker])
            .instruction()
        );

        if (Math.floor(i / 2) % 2) {
          likeIxsPromises.push(
            program.methods
              .setLearningStatus(
                Math.floor(i / 4) % 2 ? { learning: {} } : { learnt: {} }
              )
              .accounts({ signer: liker.publicKey, solutionPda })
              .signers([liker])
              .instruction()
          );
        }
      }

      return addSolIx;
    })
  );

  // Send all ixs in batches
  let tx = new web3.Transaction();
  let bigIxs = [...createCaseIxs, ...addSolutionIxs];
  let likeIxs = await Promise.all(likeIxsPromises);

  // Big ixs in small batches
  for (let i = 0; i < bigIxs.length; i += batchSize) {
    tx.add(...bigIxs.slice(i, i + batchSize));

    try {
      await program.provider.sendAndConfirm(tx, undefined, {
        commitment: `confirmed`,
      });
    } catch (e) {
      console.log(e);
    }

    tx = new web3.Transaction();
  }

  // Other ixs in larger batches
  for (let i = 0; i < likeIxs.length; i += 12) {
    tx.add(...likeIxs.slice(i, i + 12));

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
  deployer: web3.PublicKey,
  batchSize = 3,
  liker?: web3.Keypair
) => {
  for (let i = 0; i < paths.length; i++) {
    await loadCasesFromCsv(
      `${basePath}${paths[i]}`,
      sets[i],
      program,
      deployer,
      batchSize,
      liker
    );
  }
};
