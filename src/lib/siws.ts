import { randomBytes } from "crypto";
import ms from "ms";
import nacl from "tweetnacl";
import bs58 from "bs58";
import { SIWS } from "@web3auth/sign-in-with-solana";
import type { SignSiwsOptions } from "../types.js";
import { resolveSolanaSecretKey } from "./solana-wallet.js";

function generateNonce(): string {
  return randomBytes(16).toString("hex");
}

export async function signSiws(opts: SignSiwsOptions): Promise<string> {
  const secretKey = resolveSolanaSecretKey(opts.privateKey);
  const keypair = nacl.sign.keyPair.fromSecretKey(secretKey);
  const address = bs58.encode(keypair.publicKey);

  const issuedAt = opts.issuedAt ?? new Date().toISOString();
  const nonce = opts.nonce ?? generateNonce();

  const duration = ms((opts.expiresAfter ?? "1h") as Parameters<typeof ms>[0]);
  if (duration === undefined) {
    throw new Error(`Invalid duration: ${opts.expiresAfter}`);
  }
  const expirationTime = new Date(
    new Date(issuedAt).getTime() + duration,
  ).toISOString();

  const siws = new SIWS({
    header: { t: "sip99" },
    payload: {
      domain: "alchemy.com",
      address,
      statement: "Sign in to Alchemy Gateway",
      uri: "https://alchemy.com",
      version: "1",
      nonce,
      issuedAt,
      expirationTime,
    },
  });

  const message = siws.prepareMessage();
  const messageBytes = new TextEncoder().encode(message);
  const signature = nacl.sign.detached(messageBytes, secretKey);

  const encodedMessage = Buffer.from(message).toString("base64");
  const base58Sig = bs58.encode(signature);
  return `${encodedMessage}.${base58Sig}`;
}
