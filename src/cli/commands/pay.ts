import { Command } from "@commander-js/extra-typings";
import { createPayment } from "../../lib/payment.js";

export const payCommand = new Command("pay")
  .description("Create an x402 payment from a PAYMENT-REQUIRED header")
  .requiredOption("--private-key <key>", "Wallet private key")
  .requiredOption("--payment-required <header>", "Raw PAYMENT-REQUIRED header value")
  .action(async (opts) => {
    const paymentHeader = await createPayment({
      privateKey: opts.privateKey,
      paymentRequiredHeader: opts.paymentRequired,
    });
    process.stdout.write(paymentHeader);
  });
