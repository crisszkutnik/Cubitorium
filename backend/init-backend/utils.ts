import { Program, web3 } from "@coral-xyz/anchor";
import { Backend } from "../target/types/backend";
import * as fs from "fs";
import { casePda, setPda, solutionKey } from "../tests/utils";
import { USER_INFO_TAG } from "../tests/constants";

export const loadCasesFromCsv = async (
  path: string,
  set: string,
  program: Program<Backend>,
  deployer: web3.Keypair,
  otherLoader: web3.Keypair,
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
    .appendSetToConfig(set, [...new Set(cases)])
    .accounts({
      admin: deployer.publicKey,
      existingSet: existing ? setKey : null,
      newSet: existing ? null : setKey,
    })
    .signers([deployer])
    .rpc();

  // Build createCase ixs
  let ben = [...new Set(cases.map((cas, i) => `${cas}BEN${setups[i]}`))];
  let createCaseIxs = await Promise.all(
    ben.map((elem) =>
      program.methods
        .createCase(set, elem.split("BEN")[0], elem.split("BEN")[1])
        .accounts({ signer: deployer.publicKey })
        .instruction()
    )
  );

  // Build addSolution ixs and optionally like 30% of them. Set LearningStatus too.
  let likeIxsPromises: Promise<web3.TransactionInstruction>[] = [];

  let addSolutionIxs = await Promise.all(
    solutions.map((solution, i) => {
      let submitter =
        i < Math.floor(solutions.length / 2) ? deployer : otherLoader;

      let caseAcc = casePda(set, cases[i], program.programId);
      let solutionPda = solutionKey(caseAcc, solution, program.programId);
      let authorPda = web3.PublicKey.findProgramAddressSync(
        [Buffer.from(USER_INFO_TAG), submitter.publicKey.toBuffer()],
        program.programId
      )[0];

      let addSolIx = program.methods
        .addSolution(solution)
        .accounts({ signer: submitter.publicKey, case: caseAcc, solutionPda })
        .signers([submitter])
        .instruction();

      // welcome to hell
      if (liker && i % 3) {
        likeIxsPromises.push(
          program.methods
            .likeSolution()
            .accounts({
              signer: liker.publicKey,
              solutionPda,
              authorProfile: authorPda,
            })
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
  let likeIxs = await Promise.all(likeIxsPromises);

  // Big ixs in small batches
  for (let i = 0; i < createCaseIxs.length; i += batchSize) {
    tx.add(...createCaseIxs.slice(i, i + batchSize));

    try {
      await program.provider.sendAndConfirm(tx, [deployer], {
        commitment: `confirmed`,
      });
    } catch (e) {
      console.log(e);
    }

    tx = new web3.Transaction();
  }

  // soy un rastafari
  const threshold = addSolutionIxs.length / 2;
  let deployerSolutions = addSolutionIxs.slice(0, threshold);
  let otherLoaderSolutions = addSolutionIxs.slice(
    threshold,
    addSolutionIxs.length
  );

  for (let i = 0; i < deployerSolutions.length; i += batchSize) {
    tx.add(...deployerSolutions.slice(i, i + batchSize));

    try {
      await program.provider.sendAndConfirm(tx, [deployer], {
        commitment: `confirmed`,
      });
    } catch (e) {
      console.log(e);
    }

    tx = new web3.Transaction();
  }

  for (let i = 0; i < otherLoaderSolutions.length; i += batchSize) {
    tx.add(...otherLoaderSolutions.slice(i, i + batchSize));

    try {
      await program.provider.sendAndConfirm(tx, [otherLoader], {
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
  deployer: web3.Keypair,
  otherLoader: web3.Keypair,
  batchSize = 3,
  liker?: web3.Keypair
) => {
  for (let i = 0; i < paths.length; i++) {
    await loadCasesFromCsv(
      `${basePath}${paths[i]}`,
      sets[i],
      program,
      deployer,
      otherLoader,
      batchSize,
      liker
    );
  }
};
