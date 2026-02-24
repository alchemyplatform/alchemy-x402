export interface WalletInfo {
  privateKey: `0x${string}`;
  address: `0x${string}`;
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

export interface MakeRequestOptions {
  privateKey: string;
  url: string;
  method?: string;
  body?: string;
  headers?: Record<string, string>;
  siweToken?: string;
}

export interface RequestResult {
  status: number;
  headers: Record<string, string>;
  body: string;
  paymentMade: boolean;
}
