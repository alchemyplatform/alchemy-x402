export { signSiwe } from "./lib/siwe.js";
export { signSiws } from "./lib/siws.js";
export { generateWallet, getWalletAddress } from "./lib/wallet.js";
export {
  generateSolanaWallet,
  getSolanaWalletAddress,
} from "./lib/solana-wallet.js";
export { createPayment, buildX402Client } from "./lib/payment.js";
export {
  createSolanaPayment,
  buildSolanaX402Client,
} from "./lib/solana-payment.js";

export { Architecture } from "./types.js";

export type {
  Hex,
  EvmWalletInfo,
  WalletInfo,
  SolanaWalletInfo,
  SignSiweOptions,
  SignSiwsOptions,
  CreatePaymentOptions,
} from "./types.js";
