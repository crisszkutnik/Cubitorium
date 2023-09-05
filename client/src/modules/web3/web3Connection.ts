import {
  AnchorProvider,
  web3,
  Address,
  translateError,
  parseIdlErrors,
  translateAddress,
} from "@coral-xyz/anchor";
import { TransactionSignature } from "@solana/web3.js";
import { txVersion } from "./utils";
import * as idl from "../../../../backend/target/idl/backend.json";

export class Web3Connection {
  connection: web3.Connection;
  provider: AnchorProvider | undefined;
  idlErrors: Map<number, string> = parseIdlErrors(idl);

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
    if (this.provider === undefined) throw new Error("Please setWallet first.");

    if (txVersion(tx) === 0) {
      if (otherSigners) (tx as web3.VersionedTransaction).sign(otherSigners);
      return this.provider.wallet.signTransaction(tx);
    }

    // Assume legacy otherwise

    const txLegacy = tx as web3.Transaction;
    const { blockhash } = await this.connection.getLatestBlockhash(`finalized`);

    txLegacy.recentBlockhash = blockhash;
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
    try {
      const rawTx = signedTx.serialize();
      const startTime = Date.now();

      const txid = await this.connection.sendRawTransaction(rawTx);

      let done = false;

      (async () => {
        while (!done && Date.now() - startTime < timeout) {
          // eslint-disable-next-line no-await-in-loop
          await new Promise((resolve) => {
            setTimeout(resolve, 1000);
          });

          // console.debug(`Resending tx...`);
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

      if (result.value.err) throw new Error(JSON.stringify(result.value.err));

      if (printLogs) {
        const response = await this.connection.getTransaction(txid, {
          maxSupportedTransactionVersion: 0,
        });

        const logMessages = response?.meta?.logMessages;

        console.log(logMessages);
      }

      return txid;
    } catch (err: any) {
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
    const signedTx = await this.signTx(tx, otherSigners);

    return this.sendTx(signedTx);
  }
}
