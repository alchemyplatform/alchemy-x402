export type Hex = `0x${string}`;

export interface WalletInfo {
  privateKey: Hex;
  address: Hex;
}

export interface SignSiweOptions {
  privateKey: string;
  expiresAfter?: string;
  nonce?: string;
  issuedAt?: string;
}

export interface CreatePaymentOptions {
  privateKey: string;
  paymentRequiredHeader: string;
}
