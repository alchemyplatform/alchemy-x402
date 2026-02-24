import { randomBytes } from "crypto";
import ms from "ms";
import { privateKeyToAccount } from "viem/accounts";
import type { SignSiweOptions } from "../types.js";
import { normalizePrivateKey } from "./wallet.js";

function generateNonce(): string {
  return randomBytes(16).toString("hex");
}

export async function signSiwe(opts: SignSiweOptions): Promise<string> {
  const normalized = normalizePrivateKey(opts.privateKey);
  const account = privateKeyToAccount(normalized);

  const issuedAt = opts.issuedAt ?? new Date().toISOString();
  const nonce = opts.nonce ?? generateNonce();

  const duration = ms((opts.expiresAfter ?? "1h") as Parameters<typeof ms>[0]);
  if (duration === undefined) {
    throw new Error(`Invalid duration: ${opts.expiresAfter}`);
  }
  const expirationTime = new Date(new Date(issuedAt).getTime() + duration).toISOString();

  const message = [
    "x402.alchemy.com wants you to sign in with your Ethereum account:",
    account.address,
    "",
    "Sign in to Alchemy Gateway",
    "",
    "URI: https://x402.alchemy.com",
    "Version: 1",
    "Chain ID: 8453",
    `Nonce: ${nonce}`,
    `Issued At: ${issuedAt}`,
    `Expiration Time: ${expirationTime}`,
  ].join("\n");

  const signature = await account.signMessage({ message });

  const encodedMessage = Buffer.from(message).toString("base64url");
  return `${encodedMessage}.${signature}`;
}
