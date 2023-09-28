import * as anchor from "@coral-xyz/anchor";
import { Program, web3 } from "@coral-xyz/anchor";
import { Backend } from "../target/types/backend";
import { TREASURY_TAG } from "../tests/constants";
import { keypairs } from "../tests/test-keys";
import { fundAccounts } from "../tests/utils";
import { loadCasesFromCsv, loadMultipleCasesFromCsv } from "./utils";

describe("backend", () => {
  // Configure the client to use the local cluster.
  const provider = anchor.AnchorProvider.local(undefined, {
    commitment: `confirmed`,
    preflightCommitment: `confirmed`,
  });
  anchor.setProvider(provider);

  const program = anchor.workspace.Backend as Program<Backend>;
  const deployer = provider.wallet;
  const pid = program.programId;

  const regularKeypair: web3.Keypair = keypairs[3];

  const treasury = web3.PublicKey.findProgramAddressSync(
    [Buffer.from(TREASURY_TAG)],
    pid
  )[0];

  it("Funds treasury and others", async () => {
    await fundAccounts(provider, [
      treasury,
      ...[...keypairs].map((k) => k.publicKey),
    ]);
  });

  it("Create admin", async () => {
    await program.methods
      .addPrivilegedUser()
      .accounts({
        granter: deployer.publicKey,
        grantee: deployer.publicKey,
        granterPrivilege: null,
      })
      .rpc();
  });

  it("Creates user profile", async () => {
    await program.methods
      .sendUserInfo("Antonio", "Kam", "2017TUNG13", "California, USA")
      .accounts({ user: deployer.publicKey })
      .rpc();

    await program.methods
      .sendUserInfo("Ben", "Baron", "2016BARO04", "Herzliya, Israel")
      .accounts({ user: regularKeypair.publicKey })
      .signers([regularKeypair])
      .rpc();
  });

  it("Creates global config", async () => {
    await program.methods
      .initGlobalConfig("[]")
      .accounts({ admin: deployer.publicKey })
      .rpc();
  });

  it("Loads L4E", async () => {
    await loadCasesFromCsv(
      "../algs/pyra/l4e.csv",
      "L4E",
      program,
      4,
      deployer.publicKey,
      regularKeypair
    );
  });

  it("Loads 2x2 (CLL, EG1, EG2)", async () => {
    await loadMultipleCasesFromCsv(
      "../algs/2x2/",
      ["cll.csv", "eg1.csv", "eg2.csv"],
      ["CLL", "EG-1", "EG-2"],
      program,
      4,
      deployer.publicKey,
      regularKeypair
    );
  });

  xit("Loads 3x3 (F2L, OLL, PLL)", async () => {
    await loadMultipleCasesFromCsv(
      "../algs/3x3_cfop/",
      ["f2l.csv", "oll.csv", "pll.csv"],
      ["F2L", "OLL", "PLL"],
      program,
      undefined,
      deployer.publicKey,
      regularKeypair
    );
  });

  it("Loads 3x3 (CMLL)", async () => {
    await loadMultipleCasesFromCsv(
      "../algs/3x3_roux/",
      ["cmll.csv"],
      ["CMLL"],
      program,
      undefined,
      deployer.publicKey,
      regularKeypair
    );
  });

  xit("Loads 3x3 (ZBLL H, S, U)", async () => {
    await loadMultipleCasesFromCsv(
      "../algs/3x3_zbll/",
      ["h", "s", "u"].map((l) => `zbll_${l}.csv`),
      ["H", "S", "U"].map((l) => `ZBLL ${l}`),
      program,
      1,
      deployer.publicKey,
      regularKeypair
    );
  });

  xit("Loads 3x3 (ZBLL L, T, A, Pi)", async () => {
    await loadMultipleCasesFromCsv(
      "../algs/3x3_zbll/",
      ["l", "t", "a", "pi"].map((l) => `zbll_${l}.csv`),
      ["L", "T", "A", "Pi"].map((l) => `ZBLL ${l}`),
      program,
      1,
      deployer.publicKey
    );
  });
});
