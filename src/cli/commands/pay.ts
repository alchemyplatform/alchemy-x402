import { Command, Option } from "@commander-js/extra-typings";
import { createPayment } from "../../lib/payment.js";
import { createSolanaPayment } from "../../lib/solana-payment.js";

export const payCommand = new Command("pay")
  .description("Create an x402 payment from a PAYMENT-REQUIRED header")
  .requiredOption(
    "--private-key <key-or-path>",
    "Wallet private key (hex string, base58 string, or path to a key file)",
  )
  .requiredOption(
    "--payment-required <header>",
    "Raw PAYMENT-REQUIRED header value",
  )
  .addOption(
    new Option("--network <network>", "Network type")
      .choices(["evm", "solana"] as const)
      .default("evm" as const),
  )
  .action(async (opts) => {
    const paymentHeader =
      opts.network === "solana"
        ? await createSolanaPayment({
            privateKey: opts.privateKey,
            paymentRequiredHeader: opts.paymentRequired,
          })
        : await createPayment({
            privateKey: opts.privateKey,
            paymentRequiredHeader: opts.paymentRequired,
          });
    process.stdout.write(paymentHeader);
  });
