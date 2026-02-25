import { Command } from "@commander-js/extra-typings";
import { signSiweCommand } from "./commands/sign-siwe.js";
import { walletCommand } from "./commands/wallet.js";
import { payCommand } from "./commands/pay.js";

const program = new Command()
  .name("alchemy-x402")
  .description("CLI for Alchemy x402 authentication and payments")
  .version("0.1.0");

program.addCommand(signSiweCommand);
program.addCommand(walletCommand);
program.addCommand(payCommand);

program.parseAsync().catch((err) => {
  console.error(err);
  process.exit(1);
});
