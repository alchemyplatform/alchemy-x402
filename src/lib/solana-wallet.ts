import { readFileSync, existsSync } from "fs";
import nacl from "tweetnacl";
import bs58 from "bs58";
import type { SolanaWalletInfo } from "../types.js";

/**
 * Resolve a Solana private key from a base58 string, JSON byte array, or file path.
 * Returns the raw 64-byte Ed25519 secret key.
 */
export function resolveSolanaSecretKey(keyOrPath: string): Uint8Array {
  let raw = keyOrPath;
  if (!raw.startsWith("[") && existsSync(raw)) {
    raw = readFileSync(raw, "utf-8").trim();
  }

  // JSON byte array format (e.g. Solana CLI keypair files)
  if (raw.startsWith("[")) {
    const bytes = JSON.parse(raw) as number[];
    return new Uint8Array(bytes);
  }

  // Base58-encoded secret key
  return bs58.decode(raw);
}

export function generateSolanaWallet(): SolanaWalletInfo {
  const keypair = nacl.sign.keyPair();
  return {
    privateKey: bs58.encode(keypair.secretKey),
    address: bs58.encode(keypair.publicKey),
  };
}

export function getSolanaWalletAddress(privateKey: string): string {
  const secretKey = resolveSolanaSecretKey(privateKey);
  const keypair = nacl.sign.keyPair.fromSecretKey(secretKey);
  return bs58.encode(keypair.publicKey);
}
