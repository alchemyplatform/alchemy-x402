import { Command } from "@commander-js/extra-typings";
import { signSiwe } from "../../lib/siwe.js";

export const signSiweCommand = new Command("sign-siwe")
  .description("Generate a SIWE authentication token")
  .requiredOption("--private-key <key>", "Wallet private key")
  .option("--expires-after <duration>", "Token expiration duration (e.g. 1h, 30m, 7d)", "1h")
  .action(async (opts) => {
    const token = await signSiwe({
      privateKey: opts.privateKey,
      expiresAfter: opts.expiresAfter,
    });
    process.stdout.write(token);
  });
