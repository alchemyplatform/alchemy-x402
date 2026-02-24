import { wrapFetchWithPayment } from "@x402/fetch";
import type { MakeRequestOptions, RequestResult } from "../types.js";
import { normalizePrivateKey } from "./wallet.js";
import { buildX402Client } from "./payment.js";
import { signSiwe } from "./siwe.js";

export async function makeAuthenticatedRequest(opts: MakeRequestOptions): Promise<RequestResult> {
  const normalized = normalizePrivateKey(opts.privateKey);

  const siweToken = opts.siweToken ?? await signSiwe({ privateKey: opts.privateKey });

  const client = buildX402Client(normalized);

  const authedFetch: typeof globalThis.fetch = async (input, init) => {
    const headers = new Headers(init?.headers);
    headers.set("Authorization", `SIWE ${siweToken}`);
    return globalThis.fetch(input, { ...init, headers });
  };

  const paymentFetch = wrapFetchWithPayment(authedFetch, client);

  let paymentMade = false;
  const trackingFetch: typeof globalThis.fetch = async (input, init) => {
    const response = await paymentFetch(input, init);
    if (response.headers.get("x-payment") || response.headers.get("x-payment-receipt")) {
      paymentMade = true;
    }
    return response;
  };

  const response = await trackingFetch(opts.url, {
    method: opts.method ?? "GET",
    headers: opts.headers,
    body: opts.body,
  });

  const responseHeaders: Record<string, string> = {};
  response.headers.forEach((value, key) => {
    responseHeaders[key] = value;
  });

  const body = await response.text();

  return {
    status: response.status,
    headers: responseHeaders,
    body,
    paymentMade,
  };
}
