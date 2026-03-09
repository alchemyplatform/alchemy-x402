import { describe, it, expect, vi, beforeEach } from "vitest";
import * as fs from "fs";
import {
  resolveSolanaSecretKey,
  generateSolanaWallet,
  getSolanaWalletAddress,
} from "./solana-wallet.js";
import nacl from "tweetnacl";
import bs58 from "bs58";

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

// Generate a deterministic test keypair
const TEST_KEYPAIR = nacl.sign.keyPair();
const TEST_SECRET_KEY_BS58 = bs58.encode(TEST_KEYPAIR.secretKey);
const TEST_ADDRESS = bs58.encode(TEST_KEYPAIR.publicKey);

beforeEach(() => {
  existsSyncSpy.mockReset();
  readFileSyncSpy.mockReset();
});

describe("resolveSolanaSecretKey", () => {
  it("decodes base58 secret key", () => {
    existsSyncSpy.mockReturnValue(false);
    const result = resolveSolanaSecretKey(TEST_SECRET_KEY_BS58);
    expect(Buffer.from(result)).toEqual(Buffer.from(TEST_KEYPAIR.secretKey));
  });

  it("parses JSON byte array", () => {
    existsSyncSpy.mockReturnValue(false);
    const jsonArray = JSON.stringify(Array.from(TEST_KEYPAIR.secretKey));
    const result = resolveSolanaSecretKey(jsonArray);
    expect(Buffer.from(result)).toEqual(Buffer.from(TEST_KEYPAIR.secretKey));
  });

  it("reads key from file path (base58)", () => {
    existsSyncSpy.mockReturnValue(true);
    readFileSyncSpy.mockReturnValue(TEST_SECRET_KEY_BS58);

    const result = resolveSolanaSecretKey("/fake/keyfile");
    expect(Buffer.from(result)).toEqual(Buffer.from(TEST_KEYPAIR.secretKey));
    expect(existsSyncSpy).toHaveBeenCalledWith("/fake/keyfile");
  });

  it("reads key from file path (JSON array)", () => {
    existsSyncSpy.mockReturnValue(true);
    const jsonArray = JSON.stringify(Array.from(TEST_KEYPAIR.secretKey));
    readFileSyncSpy.mockReturnValue(jsonArray);

    const result = resolveSolanaSecretKey("/fake/keyfile");
    expect(Buffer.from(result)).toEqual(Buffer.from(TEST_KEYPAIR.secretKey));
  });
});

describe("generateSolanaWallet", () => {
  it("returns privateKey and address as base58 strings", () => {
    const wallet = generateSolanaWallet();
    // Secret key should be 64 bytes when decoded
    expect(bs58.decode(wallet.privateKey)).toHaveLength(64);
    // Public key should be 32 bytes when decoded
    expect(bs58.decode(wallet.address)).toHaveLength(32);
  });

  it("generates unique wallets", () => {
    const a = generateSolanaWallet();
    const b = generateSolanaWallet();
    expect(a.privateKey).not.toBe(b.privateKey);
    expect(a.address).not.toBe(b.address);
  });
});

describe("getSolanaWalletAddress", () => {
  it("derives correct address from base58 secret key", () => {
    existsSyncSpy.mockReturnValue(false);
    expect(getSolanaWalletAddress(TEST_SECRET_KEY_BS58)).toBe(TEST_ADDRESS);
  });

  it("derives correct address from file path", () => {
    existsSyncSpy.mockReturnValue(true);
    readFileSyncSpy.mockReturnValue(TEST_SECRET_KEY_BS58);

    expect(getSolanaWalletAddress("/fake/keyfile")).toBe(TEST_ADDRESS);
    expect(existsSyncSpy).toHaveBeenCalledWith("/fake/keyfile");
  });
});
