export { signSiwe } from "./lib/siwe.js";
export { generateWallet, getWalletAddress } from "./lib/wallet.js";
export { createPayment } from "./lib/payment.js";
export { makeAuthenticatedRequest } from "./lib/request.js";

export type {
  WalletInfo,
  SignSiweOptions,
  CreatePaymentOptions,
  MakeRequestOptions,
  RequestResult,
} from "./types.js";
