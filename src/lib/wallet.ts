import { readFileSync, existsSync } from "fs";
import { generatePrivateKey, privateKeyToAccount } from "viem/accounts";
import type { Hex, WalletInfo } from "../types.js";

const RAW_HEX_RE = /^[0-9a-fA-F]{64}$/;

export function resolvePrivateKey(keyOrPath: string): string {
  if (keyOrPath.startsWith("0x") || RAW_HEX_RE.test(keyOrPath)) {
    return keyOrPath;
  }
  if (existsSync(keyOrPath)) {
    return readFileSync(keyOrPath, "utf-8").trim();
  }
  return keyOrPath;
}

export function normalizePrivateKey(key: string): Hex {
  const resolved = resolvePrivateKey(key);
  return resolved.startsWith("0x") ? (resolved as Hex) : (`0x${resolved}` as Hex);
}

export function generateWallet(): WalletInfo {
  const privateKey = generatePrivateKey();
  const account = privateKeyToAccount(privateKey);
  return { privateKey, address: account.address };
}

export function getWalletAddress(privateKey: string): Hex {
  const normalized = normalizePrivateKey(privateKey);
  const account = privateKeyToAccount(normalized);
  return account.address;
}
