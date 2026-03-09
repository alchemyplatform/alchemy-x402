export type Hex = `0x${string}`;

export enum Architecture {
  EVM = "evm",
  SVM = "svm",
}

export interface EvmWalletInfo {
  privateKey: Hex;
  address: Hex;
}

/** @deprecated Use EvmWalletInfo instead */
export type WalletInfo = EvmWalletInfo;

export interface SolanaWalletInfo {
  privateKey: string;
  address: string;
}

export interface SignSiweOptions {
  privateKey: string;
  expiresAfter?: string;
  nonce?: string;
  issuedAt?: string;
}

export interface SignSiwsOptions {
  privateKey: string;
  expiresAfter?: string;
  nonce?: string;
  issuedAt?: string;
}

export interface CreatePaymentOptions {
  privateKey: string;
  paymentRequiredHeader: string;
}
