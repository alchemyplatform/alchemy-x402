import { describe, it, expect, afterEach } from "vitest";
import { writeFileSync, unlinkSync } from "fs";
import { join } from "path";
import { tmpdir } from "os";
import { resolvePrivateKey, normalizePrivateKey, generateWallet, getWalletAddress } from "./wallet.js";

const TEST_KEY = "ac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80";
const TEST_KEY_0X = `0x${TEST_KEY}`;
const TEST_ADDRESS = "0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266";

describe("resolvePrivateKey", () => {
  it("returns 0x-prefixed key as-is", () => {
    expect(resolvePrivateKey(TEST_KEY_0X)).toBe(TEST_KEY_0X);
  });

  it("returns raw 64-char hex as-is", () => {
    expect(resolvePrivateKey(TEST_KEY)).toBe(TEST_KEY);
  });

  it("reads key from file path", () => {
    const path = join(tmpdir(), `test-pk-${Date.now()}.txt`);
    writeFileSync(path, `${TEST_KEY_0X}\n`);
    try {
      expect(resolvePrivateKey(path)).toBe(TEST_KEY_0X);
    } finally {
      unlinkSync(path);
    }
  });

  it("returns non-hex, non-file string as-is", () => {
    expect(resolvePrivateKey("not-a-key")).toBe("not-a-key");
  });
});

describe("normalizePrivateKey", () => {
  it("adds 0x prefix to raw hex", () => {
    expect(normalizePrivateKey(TEST_KEY)).toBe(TEST_KEY_0X);
  });

  it("keeps existing 0x prefix", () => {
    expect(normalizePrivateKey(TEST_KEY_0X)).toBe(TEST_KEY_0X);
  });

  it("resolves file path and normalizes", () => {
    const path = join(tmpdir(), `test-pk-${Date.now()}.txt`);
    writeFileSync(path, TEST_KEY);
    try {
      expect(normalizePrivateKey(path)).toBe(TEST_KEY_0X);
    } finally {
      unlinkSync(path);
    }
  });
});

describe("generateWallet", () => {
  it("returns privateKey and address with 0x prefix", () => {
    const wallet = generateWallet();
    expect(wallet.privateKey).toMatch(/^0x[0-9a-f]{64}$/);
    expect(wallet.address).toMatch(/^0x[0-9a-fA-F]{40}$/);
  });

  it("generates unique wallets", () => {
    const a = generateWallet();
    const b = generateWallet();
    expect(a.privateKey).not.toBe(b.privateKey);
    expect(a.address).not.toBe(b.address);
  });
});

describe("getWalletAddress", () => {
  it("derives correct address from 0x-prefixed key", () => {
    expect(getWalletAddress(TEST_KEY_0X)).toBe(TEST_ADDRESS);
  });

  it("derives correct address from raw hex key", () => {
    expect(getWalletAddress(TEST_KEY)).toBe(TEST_ADDRESS);
  });

  it("derives correct address from file path", () => {
    const path = join(tmpdir(), `test-pk-${Date.now()}.txt`);
    writeFileSync(path, TEST_KEY_0X);
    try {
      expect(getWalletAddress(path)).toBe(TEST_ADDRESS);
    } finally {
      unlinkSync(path);
    }
  });
});
