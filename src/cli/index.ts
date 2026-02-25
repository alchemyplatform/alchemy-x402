import { createRequire } from "module";
import { Command } from "@commander-js/extra-typings";
import { signSiweCommand } from "./commands/sign-siwe.js";
import { walletCommand } from "./commands/wallet.js";
import { payCommand } from "./commands/pay.js";

const require = createRequire(import.meta.url);
const { version } = require("../../package.json") as { version: string };

const program = new Command()
  .name("@alchemy/x402")
  .description("CLI for Alchemy x402 authentication and payments")
  .version(version);

program.addCommand(signSiweCommand);
program.addCommand(walletCommand);
program.addCommand(payCommand);

program.parseAsync().catch((err) => {
  console.error(err);
  process.exit(1);
});
