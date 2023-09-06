import {
  AnchorProvider,
  web3,
  Address,
  translateError,
  parseIdlErrors,
  translateAddress,
} from "@coral-xyz/anchor";
import { Connection, TransactionSignature } from "@solana/web3.js";
import { txVersion } from "./utils";
import * as idl from "../../../../backend/target/idl/backend.json";

export class Web3Connection {
  connection: Connection;
  provider: AnchorProvider | undefined;
  /* eslint-disable  @typescript-eslint/no-explicit-any */
  idlErrors: Map<number, string> = parseIdlErrors(idl as any);

  constructor() {
    const connection = new web3.Connection(import.meta.env.VITE_NETWORK_URL, {
      commitment: `confirmed`,
    });
    this.connection = connection;
  }

  /**
   * Sign a transaction
   * @param tx Transaction
   * @param otherSigners
   * @returns Signed transaction
   */
  async signTx<T extends web3.Transaction | web3.VersionedTransaction>(
    tx: T,
    otherSigners?: web3.Signer[],
    feePayer?: Address
  ): Promise<T> {
    if (this.provider === undefined) {
      throw new Error("User is not authenticated");
    }

    if (txVersion(tx) === 0) {
      if (otherSigners) {
        (tx as web3.VersionedTransaction).sign(otherSigners);
      }
      return this.provider.wallet.signTransaction(tx);
    }

    // Assume legacy otherwise

    const txLegacy = tx as web3.Transaction;
    const obj = await this.connection.getLatestBlockhash(`finalized`);

    if (obj && obj.blockhash) {
      txLegacy.recentBlockhash = obj.blockhash;
    }
    if (feePayer) {
      txLegacy.feePayer = translateAddress(feePayer);
    } else {
      txLegacy.feePayer = this.provider.wallet.publicKey;
    }

    if (otherSigners) txLegacy.partialSign(...otherSigners);
    return this.provider.wallet.signTransaction(tx);
  }

  /**
   * Sends a signed transaction (works with both legacy and v0)
   * @param signedTx Signed transaction (legacy or v0)
   * @param param1 Optional config
   * @returns Promise of transaction signature
   */
  async sendTx(
    signedTx: web3.Transaction | web3.VersionedTransaction,
    { printLogs = false, timeout = 120000 } = {
      printLogs: false,
      timeout: 120000,
    }
  ): Promise<TransactionSignature> {
    if (this.provider === undefined) {
      throw new Error("User is not authenticated");
    }

    try {
      const rawTx = signedTx.serialize();
      const startTime = Date.now();

      const txid = await this.connection.sendRawTransaction(rawTx);

      let done = false;

      (async () => {
        while (!done && Date.now() - startTime < timeout) {
          await new Promise((resolve) => {
            setTimeout(resolve, 1000);
          });

          this.connection.sendRawTransaction(rawTx, {
            skipPreflight: true,
          });
        }
      })();

      const { blockhash, lastValidBlockHeight } =
        await this.provider.connection.getLatestBlockhash(`confirmed`);

      const result = await this.connection.confirmTransaction(
        {
          signature: txid,
          blockhash,
          lastValidBlockHeight,
        },
        `confirmed`
      );

      done = true;

      if (result.value.err) {
        throw new Error(JSON.stringify(result.value.err));
      }

      if (printLogs) {
        const response = await this.connection.getTransaction(txid, {
          maxSupportedTransactionVersion: 0,
        });

        const logMessages = response?.meta?.logMessages;

        console.log(logMessages);
      }

      return txid;
      /* eslint-disable  @typescript-eslint/no-explicit-any */
    } catch (err: any) {
      if (err && err.logs) {
        const log = err.logs?.find((l: string) =>
          l.includes(`insufficient lamports`)
        );

        if (log) {
          const logs = log
            .split(` `)
            .map((e: string) => parseFloat(e))
            .filter((e: number) => !Number.isNaN(e));
          const transactionFees = Math.max(...logs) / 1000000000;
          throw new Error(
            `You do not have enough SOL for this transaction. Please make sure you have ${transactionFees} SOL and try again.`
          );
        }
      }

      throw translateError(err, this.idlErrors);
    }
  }

  /**
   * Shorthand for signTx(sendTx(T))
   */
  async signAndSendTx<T extends web3.Transaction | web3.VersionedTransaction>(
    tx: T,
    otherSigners?: web3.Signer[]
  ): Promise<TransactionSignature> {
    if (this.provider === undefined) {
      throw new Error("User is not authenticated");
    }

    const signedTx = await this.signTx(tx, otherSigners);

    return this.sendTx(signedTx);
  }
}
