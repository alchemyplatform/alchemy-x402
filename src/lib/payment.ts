import { createPublicClient, http } from "viem";
import { base } from "viem/chains";
import { privateKeyToAccount } from "viem/accounts";
import { ExactEvmScheme, toClientEvmSigner } from "@x402/evm";
import { x402Client } from "@x402/core/client";
import { decodePaymentRequiredHeader, encodePaymentSignatureHeader } from "@x402/core/http";
import type { CreatePaymentOptions } from "../types.js";
import { normalizePrivateKey } from "./wallet.js";

export function buildX402Client(privateKey: string) {
  const normalized = normalizePrivateKey(privateKey);
  const account = privateKeyToAccount(normalized);

  const publicClient = createPublicClient({
    chain: base,
    transport: http(),
  });

  const signer = toClientEvmSigner({
    address: account.address,
    signTypedData: async (params) => {
      return account.signTypedData(params as Parameters<typeof account.signTypedData>[0]);
    },
    readContract: async (params) => {
      return publicClient.readContract(params as Parameters<typeof publicClient.readContract>[0]);
    },
  });

  const scheme = new ExactEvmScheme(signer);
  const client = new x402Client();
  client.register("eip155:8453", scheme);
  client.register("eip155:84532", scheme);
  return client;
}

export async function createPayment(opts: CreatePaymentOptions): Promise<string> {
  const client = buildX402Client(opts.privateKey);
  const paymentRequired = decodePaymentRequiredHeader(opts.paymentRequiredHeader);
  const payload = await client.createPaymentPayload(paymentRequired);
  return encodePaymentSignatureHeader(payload);
}
