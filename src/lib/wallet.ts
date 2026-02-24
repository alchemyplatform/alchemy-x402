import { readFileSync, existsSync } from "fs";
import { generatePrivateKey, privateKeyToAccount } from "viem/accounts";
import type { WalletInfo } from "../types.js";

export function resolvePrivateKey(keyOrPath: string): string {
  if (keyOrPath.startsWith("0x") || /^[0-9a-fA-F]{64}$/.test(keyOrPath)) {
    return keyOrPath;
  }
  if (existsSync(keyOrPath)) {
    return readFileSync(keyOrPath, "utf-8").trim();
  }
  return keyOrPath;
}

export function normalizePrivateKey(key: string): `0x${string}` {
  const resolved = resolvePrivateKey(key);
  return resolved.startsWith("0x") ? (resolved as `0x${string}`) : (`0x${resolved}` as `0x${string}`);
}

export function generateWallet(): WalletInfo {
  const privateKey = generatePrivateKey();
  const account = privateKeyToAccount(privateKey);
  return { privateKey, address: account.address };
}

export function getWalletAddress(privateKey: string): `0x${string}` {
  const normalized = normalizePrivateKey(privateKey);
  const account = privateKeyToAccount(normalized);
  return account.address;
}
