import { describe, it, expect, vi, beforeEach } from "vitest";
import * as fs from "fs";
import { resolvePrivateKey, normalizePrivateKey, generateWallet, getWalletAddress } from "./wallet.js";

vi.mock("fs", async (importOriginal) => {
  const actual = await importOriginal<typeof import("fs")>();
  return {
    ...actual,
    existsSync: vi.fn(),
    readFileSync: vi.fn(),
  };
});

const existsSyncSpy = vi.mocked(fs.existsSync);
const readFileSyncSpy = vi.mocked(fs.readFileSync);

const TEST_KEY = "ac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80";
const TEST_KEY_0X = `0x${TEST_KEY}`;
const TEST_ADDRESS = "0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266";

beforeEach(() => {
  existsSyncSpy.mockReset();
  readFileSyncSpy.mockReset();
});

describe("resolvePrivateKey", () => {
  it("returns 0x-prefixed key without touching fs", () => {
    expect(resolvePrivateKey(TEST_KEY_0X)).toBe(TEST_KEY_0X);
    expect(existsSyncSpy).not.toHaveBeenCalled();
    expect(readFileSyncSpy).not.toHaveBeenCalled();
  });

  it("returns raw 64-char hex without touching fs", () => {
    expect(resolvePrivateKey(TEST_KEY)).toBe(TEST_KEY);
    expect(existsSyncSpy).not.toHaveBeenCalled();
    expect(readFileSyncSpy).not.toHaveBeenCalled();
  });

  it("reads key from file path", () => {
    existsSyncSpy.mockReturnValue(true);
    readFileSyncSpy.mockReturnValue(`${TEST_KEY_0X}\n`);

    expect(resolvePrivateKey("/fake/keyfile")).toBe(TEST_KEY_0X);
    expect(existsSyncSpy).toHaveBeenCalledWith("/fake/keyfile");
    expect(readFileSyncSpy).toHaveBeenCalledWith("/fake/keyfile", "utf-8");
  });

  it("returns non-hex, non-file string as-is", () => {
    existsSyncSpy.mockReturnValue(false);

    expect(resolvePrivateKey("not-a-key")).toBe("not-a-key");
    expect(existsSyncSpy).toHaveBeenCalledWith("not-a-key");
    expect(readFileSyncSpy).not.toHaveBeenCalled();
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
    existsSyncSpy.mockReturnValue(true);
    readFileSyncSpy.mockReturnValue(TEST_KEY);

    expect(normalizePrivateKey("/fake/keyfile")).toBe(TEST_KEY_0X);
    expect(existsSyncSpy).toHaveBeenCalledWith("/fake/keyfile");
    expect(readFileSyncSpy).toHaveBeenCalledWith("/fake/keyfile", "utf-8");
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
    existsSyncSpy.mockReturnValue(true);
    readFileSyncSpy.mockReturnValue(TEST_KEY_0X);

    expect(getWalletAddress("/fake/keyfile")).toBe(TEST_ADDRESS);
    expect(existsSyncSpy).toHaveBeenCalledWith("/fake/keyfile");
    expect(readFileSyncSpy).toHaveBeenCalledWith("/fake/keyfile", "utf-8");
  });
});
