# @alchemy/x402

CLI and library for Alchemy x402 authentication and payments. Handles SIWE (Sign-In With Ethereum) auth and x402 per-request payments for the Alchemy agentic gateway.

## Install

```bash
pnpm add @alchemy/x402
```

## CLI

```bash
# Generate a new wallet
npx @alchemy/x402 wallet generate

# Import an existing wallet (accepts key or file path)
npx @alchemy/x402 wallet import --private-key <key>

# Generate a SIWE token
npx @alchemy/x402 sign-siwe --private-key <key> --expires-after 1h

# Create an x402 payment from a PAYMENT-REQUIRED header
npx @alchemy/x402 pay --private-key <key> --payment-required <header>
```

## Library

```ts
import { signSiwe, generateWallet, getWalletAddress, createPayment, buildX402Client } from "@alchemy/x402";
```

### Generate a wallet

```ts
const wallet = generateWallet();
// { privateKey: "0x...", address: "0x..." }

const address = getWalletAddress("0x<private-key>");
```

### Sign a SIWE token

```ts
const token = await signSiwe({
  privateKey: "0x<private-key>",
  expiresAfter: "1h", // optional, default "1h"
});
```

### Create an x402 payment

```ts
const paymentHeader = await createPayment({
  privateKey: "0x<private-key>",
  paymentRequiredHeader: "<raw PAYMENT-REQUIRED header value>",
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

All commands and functions accept private keys as:

- Hex string with `0x` prefix: `0xac09...`
- Raw hex string: `ac09...`
- File path: `/path/to/keyfile`

## For maintainers

See [MAINTAINERS.md](./MAINTAINERS.md).
