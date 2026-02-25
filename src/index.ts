export { signSiwe } from "./lib/siwe.js";
export { generateWallet, getWalletAddress } from "./lib/wallet.js";
export { createPayment, buildX402Client } from "./lib/payment.js";

export type {
  Hex,
  WalletInfo,
  SignSiweOptions,
  CreatePaymentOptions,
} from "./types.js";
