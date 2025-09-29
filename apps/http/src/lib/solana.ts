import {
  Connection,
  PublicKey,
  Transaction,
  SystemProgram,
  LAMPORTS_PER_SOL,
  type SignatureStatus,
} from "@solana/web3.js";

export const connection = new Connection(
  process.env.SOLANA_RPC_URL!,
  "confirmed"
);
export const platformPubkey = new PublicKey(
  process.env.PLATFORM_WALLET_PUBKEY!
);

export async function prepareTransferTx(
  fromPubkeyStr: string,
  amountSol: number
) {
  try {
    const fromPubkey = new PublicKey(fromPubkeyStr);
    const tx = new Transaction().add(
      SystemProgram.transfer({
        fromPubkey,
        toPubkey: platformPubkey,
        lamports: amountSol * LAMPORTS_PER_SOL,
      })
    );
    tx.recentBlockhash = (await connection.getLatestBlockhash()).blockhash;
    console.log("blockhash", tx.recentBlockhash);
    tx.feePayer = fromPubkey;
    return tx;
  } catch (error) {
    throw new Error(
      `Failed to prepare transaction: ${(error as Error).message}`
    );
  }
}

export async function confirmTx(signature: string) {
  try {
    const startTime = Date.now();
    const timeout = 60000; // 60 seconds timeout
    const interval = 2000; // Poll every 2 seconds

    while (Date.now() - startTime < timeout) {
      const statuses: SignatureStatus[] | null = (
        await connection.getSignatureStatuses([signature])
      ).value;

      if (!statuses || statuses.length === 0 || !statuses[0]) {
        await new Promise((resolve) => setTimeout(resolve, interval));
        continue;
      }

      const status = statuses[0];

      if (status === null) {
        await new Promise((resolve) => setTimeout(resolve, interval));
        continue;
      }

      if (status.err) {
        throw new Error(`Transaction failed: ${JSON.stringify(status.err)}`);
      }

      if (status.confirmations && status.confirmations > 0) {
        // Confirmed
        return true;
      }

      // For 'processed' or if no confirmations but slot advanced
      if (
        status.confirmationStatus === "confirmed" ||
        status.confirmationStatus === "finalized"
      ) {
        return true;
      }

      await new Promise((resolve) => setTimeout(resolve, interval));
    }

    throw new Error(
      `Transaction confirmation timed out after ${timeout / 1000} seconds`
    );
  } catch (error) {
    throw new Error(
      `Transaction confirmation failed: ${(error as Error).message}`
    );
  }
}
