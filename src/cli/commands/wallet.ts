import { Command, Option } from "@commander-js/extra-typings";
import { Architecture } from "../../types.js";
import { generateWallet, getWalletAddress } from "../../lib/wallet.js";
import {
  generateSolanaWallet,
  getSolanaWalletAddress,
} from "../../lib/solana-wallet.js";

const architectureOption = new Option(
  "--architecture <architecture>",
  "VM architecture",
)
  .choices([Architecture.EVM, Architecture.SVM] as const)
  .default(Architecture.EVM);

export const walletCommand = new Command("wallet").description(
  "Wallet management commands",
);

walletCommand
  .command("generate")
  .description("Generate a new wallet")
  .addOption(architectureOption)
  .action((opts) => {
    const wallet =
      opts.architecture === Architecture.SVM
        ? generateSolanaWallet()
        : generateWallet();
    console.log(JSON.stringify(wallet, null, 2));
  });

walletCommand
  .command("import")
  .description("Import an existing wallet and display its address")
  .requiredOption(
    "--private-key <key-or-path>",
    "Wallet private key (hex string, base58 string, or path to a key file)",
  )
  .addOption(architectureOption)
  .action((opts) => {
    const address =
      opts.architecture === Architecture.SVM
        ? getSolanaWalletAddress(opts.privateKey)
        : getWalletAddress(opts.privateKey);
    console.log(JSON.stringify({ address }, null, 2));
  });
