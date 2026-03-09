import { Command, Option } from "@commander-js/extra-typings";
import { Architecture } from "../../types.js";
import { signSiwe } from "../../lib/siwe.js";
import { signSiws } from "../../lib/siws.js";

export const signCommand = new Command("sign")
  .alias("sign-siwe")
  .description("Generate an authentication token (SIWE for EVM, SIWS for SVM)")
  .requiredOption(
    "--private-key <key-or-path>",
    "Wallet private key (hex string, base58 string, or path to a key file)",
  )
  .option(
    "--expires-after <duration>",
    "Token expiration duration (e.g. 1h, 30m, 7d)",
    "1h",
  )
  .addOption(
    new Option("--architecture <architecture>", "VM architecture")
      .choices([Architecture.EVM, Architecture.SVM] as const)
      .default(Architecture.EVM),
  )
  .action(async (opts) => {
    const token =
      opts.architecture === Architecture.SVM
        ? await signSiws({
            privateKey: opts.privateKey,
            expiresAfter: opts.expiresAfter,
          })
        : await signSiwe({
            privateKey: opts.privateKey,
            expiresAfter: opts.expiresAfter,
          });
    process.stdout.write(token);
  });
