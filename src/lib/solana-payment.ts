import { createKeyPairSignerFromBytes } from "@solana/kit";
import { registerExactSvmScheme } from "@x402/svm/exact/client";
import { x402Client } from "@x402/core/client";
import {
  decodePaymentRequiredHeader,
  encodePaymentSignatureHeader,
} from "@x402/core/http";
import type { CreatePaymentOptions } from "../types.js";
import { resolveSolanaSecretKey } from "./solana-wallet.js";

export async function buildSolanaX402Client(privateKey: string) {
  const secretKey = resolveSolanaSecretKey(privateKey);
  const signer = await createKeyPairSignerFromBytes(secretKey);

  const client = new x402Client();
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  registerExactSvmScheme(client as any, { signer });
  return client;
}

export async function createSolanaPayment(
  opts: CreatePaymentOptions,
): Promise<string> {
  const client = await buildSolanaX402Client(opts.privateKey);
  const paymentRequired = decodePaymentRequiredHeader(
    opts.paymentRequiredHeader,
  );
  const payload = await client.createPaymentPayload(paymentRequired);
  return encodePaymentSignatureHeader(payload);
}
