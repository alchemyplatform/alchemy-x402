# @alchemy/x402

CLI and library for Alchemy x402 authentication and payments. Handles SIWE (Sign-In With Ethereum) and SIWS (Sign-In With Solana) auth, plus x402 per-request payments for the Alchemy agentic gateway.

## Install

```bash
npm install @alchemy/x402
# or
yarn add @alchemy/x402
# or
pnpm add @alchemy/x402
# or
bun add @alchemy/x402
```

## CLI

All commands accept an `--architecture` flag to switch between EVM and SVM (Solana). Defaults to `evm`.

### EVM (Ethereum, Base, etc.)

```bash
# Generate a new EVM wallet
npx @alchemy/x402 wallet generate

# Import an existing wallet (accepts hex key or path to a key file)
npx @alchemy/x402 wallet import --private-key 0xac09...
npx @alchemy/x402 wallet import --private-key /path/to/keyfile

# Generate a SIWE token
npx @alchemy/x402 sign --private-key /path/to/keyfile --expires-after 1h

# Create an x402 payment from a PAYMENT-REQUIRED header
npx @alchemy/x402 pay --private-key /path/to/keyfile --payment-required <header>
```

### SVM (Solana)

```bash
# Generate a new Solana wallet
npx @alchemy/x402 wallet generate --architecture svm

# Import an existing wallet (accepts base58 key, JSON byte array, or path to a key file)
npx @alchemy/x402 wallet import --private-key <base58-key> --architecture svm
npx @alchemy/x402 wallet import --private-key /path/to/keyfile --architecture svm

# Generate a SIWS token
npx @alchemy/x402 sign --private-key /path/to/keyfile --expires-after 1h --architecture svm

# Create an x402 payment from a PAYMENT-REQUIRED header
npx @alchemy/x402 pay --private-key /path/to/keyfile --payment-required <header> --architecture svm
```

## Library

```ts
import {
  // EVM
  signSiwe,
  generateWallet,
  getWalletAddress,
  createPayment,
  buildX402Client,
  // SVM (Solana)
  signSiws,
  generateSolanaWallet,
  getSolanaWalletAddress,
  createSolanaPayment,
  buildSolanaX402Client,
  // Enum
  Architecture,
} from "@alchemy/x402";
```

### Generate a wallet

```ts
// EVM
const evmWallet = generateWallet();
// { privateKey: "0x...", address: "0x..." }

const evmAddress = getWalletAddress("0x<private-key>");

// SVM (Solana)
const solWallet = generateSolanaWallet();
// { privateKey: "<base58>", address: "<base58>" }

const solAddress = getSolanaWalletAddress("<base58-secret-key>");
```

### Sign an authentication token

```ts
// EVM — SIWE (Sign-In With Ethereum)
const siweToken = await signSiwe({
  privateKey: "0x<private-key>",
  expiresAfter: "1h", // optional, default "1h"
});

// SVM — SIWS (Sign-In With Solana)
const siwsToken = await signSiws({
  privateKey: "<base58-secret-key>",
  expiresAfter: "1h", // optional, default "1h"
});
```

### Create an x402 payment

```ts
// EVM
const evmPayment = await createPayment({
  privateKey: "0x<private-key>",
  paymentRequiredHeader: "<base64-encoded PAYMENT-REQUIRED header>",
});

// SVM (Solana)
const solPayment = await createSolanaPayment({
  privateKey: "<base58-secret-key>",
  paymentRequiredHeader: "<base64-encoded PAYMENT-REQUIRED header>",
});
```

### Use with @x402/fetch

For full request orchestration with automatic 402 payment handling, use `buildX402Client` with `@x402/fetch`:

```ts
import { buildX402Client, signSiwe } from "@alchemy/x402";
import { wrapFetchWithPayment } from "@x402/fetch";

const privateKey = "0x<private-key>";
const client = buildX402Client(privateKey);
const siweToken = await signSiwe({ privateKey });

// Wrap fetch with SIWE auth
const authedFetch: typeof fetch = async (input, init) => {
  const headers = new Headers(init?.headers);
  headers.set("Authorization", `SIWE ${siweToken}`);
  return fetch(input, { ...init, headers });
};

// Wrap with automatic x402 payment handling
const paymentFetch = wrapFetchWithPayment(authedFetch, client);

const response = await paymentFetch("https://x402.alchemy.com/...");
```

## Private key input

### EVM

All EVM commands and functions accept private keys as:

- Hex string with `0x` prefix: `0xac09...`
- Raw hex string: `ac09...`
- File path: `/path/to/keyfile`

### SVM (Solana)

All SVM commands and functions accept private keys as:

- Base58-encoded 64-byte secret key
- JSON byte array (Solana CLI format): `[1, 2, 3, ...]`
- File path containing either format: `/path/to/keyfile`

## For maintainers

See [MAINTAINERS.md](./MAINTAINERS.md).
