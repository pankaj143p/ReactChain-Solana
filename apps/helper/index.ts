import { Keypair, PublicKey } from "@solana/web3.js";
import { readFileSync } from "fs";
import { homedir } from "os";
import path from "path";
import { sign } from "tweetnacl";

async function loadWalletKeypair(): Promise<Keypair> {
  try {
    // Default Solana CLI wallet path
    const walletPath = path.join(homedir(), ".config/solana/id.json");
    const secretKeyString = readFileSync(walletPath, "utf8");
    const secretKey = Uint8Array.from(JSON.parse(secretKeyString));
    return Keypair.fromSecretKey(secretKey);
  } catch (error) {
    console.error("Error loading wallet:", error);
    throw new Error(
      "Failed to load Solana CLI wallet. Make sure you have a wallet configured."
    );
  }
}

function generateNonce(): string {
  const timestamp = Math.floor(Date.now() / 1000);
  return `MetaStor Login ${timestamp}`;
}

function signMessage(message: string, keypair: Keypair): string {
  // Convert message to bytes
  const messageBytes = new TextEncoder().encode(message);

  // Sign the message using the keypair's secret key
  const signature = sign.detached(messageBytes, keypair.secretKey);

  // Convert signature to base64
  return Buffer.from(signature).toString("base64");
}

async function main() {
  try {
    // Load wallet keypair
    console.log("Loading wallet...");
    const wallet = await loadWalletKeypair();
    console.log("Wallet loaded successfully\n");

    // Generate nonce
    const nonce = generateNonce();
    console.log("Generated nonce:", nonce);

    // Sign the nonce as the message
    const signature = signMessage(nonce, wallet);

    // Prepare output in the required format
    const result = {
      pubKey: wallet.publicKey.toBase58(),
      signature: signature,
      nonce: nonce,
    };

    console.log("\n=== API Testing Format ===");
    console.log(JSON.stringify(result, null, 2));

    console.log("\n=== Individual Values ===");
    console.log("Public Key:", result.pubKey);
    console.log("Signature:", result.signature);
    console.log("Nonce:", result.nonce);
  } catch (error) {
    console.error("Error:", error);
    process.exit(1);
  }
}

// Run the main function
main().catch(console.error);
