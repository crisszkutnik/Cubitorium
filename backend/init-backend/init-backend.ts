import * as anchor from "@coral-xyz/anchor";
import { Program, web3 } from "@coral-xyz/anchor";
import { Backend } from "../target/types/backend";
import { TREASURY_TAG } from "../tests/constants";
import { keypairs } from "../tests/test-keys";
import { fundAccounts } from "../tests/utils";
import { LAMPORTS_PER_SOL } from "@solana/web3.js";
import { loadCasesFromCsv, loadMultipleCasesFromCsv } from "./utils";

describe("backend", () => {
  // Configure the client to use the local cluster.
  const provider = anchor.AnchorProvider.local(undefined, {
    commitment: `confirmed`,
    preflightCommitment: `confirmed`,
  });
  anchor.setProvider(provider);

  const program = anchor.workspace.Backend as Program<Backend>;
  const pid = program.programId;

  const deployer: web3.Keypair = keypairs[2];
  const benKeypair: web3.Keypair = keypairs[3];
  const lopezKeypair: web3.Keypair = keypairs[4];

  const treasury = web3.PublicKey.findProgramAddressSync(
    [Buffer.from(TREASURY_TAG)],
    pid
  )[0];

  const allKeys = [treasury, ...keypairs.map((k) => k.publicKey)];

  const FUND = 200_000_000_000_000;

  it("Funds treasury and others", async () => {
    await fundAccounts(provider, allKeys, FUND);

    console.log(
      (
        await Promise.all(allKeys.map((k) => provider.connection.getBalance(k)))
      ).map((balance, i) => `${allKeys[i]} = ${balance}`)
    );
  });

  it("Create admin", async () => {
    await program.methods
      .addPrivilegedUser()
      .accounts({
        granter: provider.wallet.publicKey,
        grantee: deployer.publicKey,
        granterPrivilege: null,
      })
      .rpc();
  });

  it("Creates user profiles", async () => {
    await program.methods
      .sendUserInfo(
        "Antonio",
        "Kam",
        "2017TUNG13",
        "California, USA",
        "2003-01-22",
        "https://avatars.worldcubeassociation.org/uploads/user/avatar/2017TUNG13/1640815193.JPG"
      )
      .accounts({ user: deployer.publicKey })
      .signers([deployer])
      .rpc();

    await program.methods
      .sendUserInfo(
        "Martín",
        "López",
        "2018LOPE22",
        "Parque Chas, Argentina",
        "2003-09-19",
        "https://avatars.worldcubeassociation.org/uploads/user/avatar/2018LOPE22/1693889884.JPG"
      )
      .accounts({ user: lopezKeypair.publicKey })
      .signers([lopezKeypair])
      .rpc();

    await program.methods
      .sendUserInfo(
        "Ben",
        "Baron",
        "2016BARO04",
        "Herzliya, Israel",
        "2003-06-11",
        "https://avatars.worldcubeassociation.org/uploads/user/avatar/2016BARO04/1666385960.jpeg"
      )
      .accounts({ user: benKeypair.publicKey })
      .signers([benKeypair])
      .rpc();
  });

  it("Creates global config", async () => {
    await program.methods
      .initGlobalConfig(new anchor.BN(10 * LAMPORTS_PER_SOL))
      .accounts({ admin: deployer.publicKey })
      .signers([deployer])
      .rpc();
  });

  it("Loads L4E", async () => {
    await loadCasesFromCsv(
      "../algs/pyra/l4e.csv",
      "L4E",
      program,
      deployer,
      lopezKeypair,
      7,
      benKeypair
    );
  });

  it("Loads 2x2 (CLL, EG1, EG2)", async () => {
    await loadMultipleCasesFromCsv(
      "../algs/2x2/",
      ["cll.csv", "eg1.csv", "eg2.csv"],
      ["CLL", "EG-1", "EG-2"],
      program,
      deployer,
      lopezKeypair,
      7,
      benKeypair
    );
  });

  it("Loads 3x3 (F2L, OLL, PLL)", async () => {
    await loadMultipleCasesFromCsv(
      "../algs/3x3_cfop/",
      ["f2l.csv", "oll.csv", "pll.csv"],
      ["F2L", "OLL", "PLL"],
      program,
      deployer,
      lopezKeypair,
      6,
      benKeypair
    );
  });

  it("Loads 3x3 (CMLL)", async () => {
    await loadMultipleCasesFromCsv(
      "../algs/3x3_roux/",
      ["cmll.csv"],
      ["CMLL"],
      program,
      deployer,
      lopezKeypair,
      6,
      benKeypair
    );
  });

  it("Loads 3x3 (ZBLL Pi, S, H, T, U, L, A)", async () => {
    await loadMultipleCasesFromCsv(
      "../algs/3x3_zbll/",
      ["pi", "s", "h", "t", "u", "l", "a"].map((l) => `zbll_${l}.csv`),
      ["Pi", "S", "H", "T", "U", "L", "A"].map((l) => `ZBLL ${l}`),
      program,
      deployer,
      lopezKeypair,
      5,
      benKeypair
    );
  });

  it("Expenses:", async () => {
    let balances = await Promise.all(
      allKeys.map((k) => provider.connection.getBalance(k))
    );

    console.log(
      balances.map((balance, i) => `${allKeys[i]} = ${FUND - balance}`)
    );

    console.log(
      "Total expenses: ",
      (FUND * balances.length -
        balances.reduce((prev, current) => prev + current)) /
        LAMPORTS_PER_SOL,
      "SOL"
    );
  });
});
