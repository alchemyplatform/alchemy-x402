import { Command, Option } from "@commander-js/extra-typings";
import { generateWallet, getWalletAddress } from "../../lib/wallet.js";
import {
  generateSolanaWallet,
  getSolanaWalletAddress,
} from "../../lib/solana-wallet.js";

const networkOption = new Option("--network <network>", "Network type")
  .choices(["evm", "solana"] as const)
  .default("evm" as const);

export const walletCommand = new Command("wallet").description(
  "Wallet management commands",
);

walletCommand
  .command("generate")
  .description("Generate a new wallet")
  .addOption(networkOption)
  .action((opts) => {
    const wallet =
      opts.network === "solana" ? generateSolanaWallet() : generateWallet();
    console.log(JSON.stringify(wallet, null, 2));
  });

walletCommand
  .command("import")
  .description("Import an existing wallet and display its address")
  .requiredOption(
    "--private-key <key-or-path>",
    "Wallet private key (hex string, base58 string, or path to a key file)",
  )
  .addOption(networkOption)
  .action((opts) => {
    const address =
      opts.network === "solana"
        ? getSolanaWalletAddress(opts.privateKey)
        : getWalletAddress(opts.privateKey);
    console.log(JSON.stringify({ address }, null, 2));
  });
