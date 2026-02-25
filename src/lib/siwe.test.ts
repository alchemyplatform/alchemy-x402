import { describe, it, expect } from "vitest";
import { verifyMessage } from "viem";
import { signSiwe } from "./siwe.js";

const TEST_KEY =
  "0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80";
const TEST_ADDRESS = "0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266";

describe("signSiwe", () => {
  it("returns token in base64url.signature format", async () => {
    const token = await signSiwe({ privateKey: TEST_KEY });
    const parts = token.split(".");
    expect(parts).toHaveLength(2);
    expect(parts[1]).toMatch(/^0x[0-9a-f]{130}$/);
  });

  it("encodes a valid EIP-4361 message", async () => {
    const token = await signSiwe({
      privateKey: TEST_KEY,
      nonce: "abc123",
      issuedAt: "2025-01-01T00:00:00.000Z",
    });

    const [encoded] = token.split(".");
    const message = Buffer.from(encoded, "base64url").toString("utf-8");

    expect(message).toContain(
      "x402.alchemy.com wants you to sign in with your Ethereum account:",
    );
    expect(message).toContain(TEST_ADDRESS);
    expect(message).toContain("Sign in to Alchemy Gateway");
    expect(message).toContain("URI: https://x402.alchemy.com");
    expect(message).toContain("Version: 1");
    expect(message).toContain("Chain ID: 8453");
    expect(message).toContain("Nonce: abc123");
    expect(message).toContain("Issued At: 2025-01-01T00:00:00.000Z");
  });

  it("computes expiration from expiresAfter", async () => {
    const token = await signSiwe({
      privateKey: TEST_KEY,
      issuedAt: "2025-01-01T00:00:00.000Z",
      expiresAfter: "2h",
    });

    const [encoded] = token.split(".");
    const message = Buffer.from(encoded, "base64url").toString("utf-8");

    expect(message).toContain("Expiration Time: 2025-01-01T02:00:00.000Z");
  });

  it("defaults to 1h expiration", async () => {
    const token = await signSiwe({
      privateKey: TEST_KEY,
      issuedAt: "2025-01-01T00:00:00.000Z",
    });

    const [encoded] = token.split(".");
    const message = Buffer.from(encoded, "base64url").toString("utf-8");

    expect(message).toContain("Expiration Time: 2025-01-01T01:00:00.000Z");
  });

  it("produces a valid ECDSA signature", async () => {
    const token = await signSiwe({
      privateKey: TEST_KEY,
      nonce: "testnonce",
      issuedAt: "2025-01-01T00:00:00.000Z",
    });

    const [encoded, signature] = token.split(".");
    const message = Buffer.from(encoded, "base64url").toString("utf-8");

    const valid = await verifyMessage({
      address: TEST_ADDRESS,
      message,
      signature: signature as `0x${string}`,
    });
    expect(valid).toBe(true);
  });

  it("works with raw hex key (no 0x prefix)", async () => {
    const rawKey = TEST_KEY.slice(2);
    const token = await signSiwe({ privateKey: rawKey });

    const [encoded, signature] = token.split(".");
    const message = Buffer.from(encoded, "base64url").toString("utf-8");

    expect(message).toContain(TEST_ADDRESS);
    const valid = await verifyMessage({
      address: TEST_ADDRESS,
      message,
      signature: signature as `0x${string}`,
    });
    expect(valid).toBe(true);
  });
});
