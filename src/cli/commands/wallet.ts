import { Command } from "@commander-js/extra-typings";
import { generateWallet, getWalletAddress } from "../../lib/wallet.js";

export const walletCommand = new Command("wallet")
  .description("Wallet management commands");

walletCommand
  .command("generate")
  .description("Generate a new wallet")
  .action(() => {
    const wallet = generateWallet();
    console.log(JSON.stringify(wallet, null, 2));
  });

walletCommand
  .command("import")
  .description("Import an existing wallet and display its address")
  .requiredOption("--private-key <key>", "Wallet private key")
  .action((opts) => {
    const address = getWalletAddress(opts.privateKey);
    console.log(JSON.stringify({ address }, null, 2));
  });
