import { describe, it, expect } from "vitest";
import nacl from "tweetnacl";
import bs58 from "bs58";
import { signSiws } from "./siws.js";

// Generate a test keypair
const TEST_KEYPAIR = nacl.sign.keyPair();
const TEST_SECRET_KEY_BS58 = bs58.encode(TEST_KEYPAIR.secretKey);
const TEST_ADDRESS = bs58.encode(TEST_KEYPAIR.publicKey);

describe("signSiws", () => {
  it("returns token in base64.base58signature format", async () => {
    const token = await signSiws({ privateKey: TEST_SECRET_KEY_BS58 });
    const parts = token.split(".");
    expect(parts).toHaveLength(2);
    // First part should be valid base64
    expect(() => Buffer.from(parts[0], "base64")).not.toThrow();
    // Second part should be valid base58 (Ed25519 signature = 64 bytes)
    expect(bs58.decode(parts[1])).toHaveLength(64);
  });

  it("encodes a valid SIP-99 message with wallet address", async () => {
    const token = await signSiws({
      privateKey: TEST_SECRET_KEY_BS58,
      nonce: "abc123def456",
      issuedAt: "2025-01-01T00:00:00.000Z",
    });

    const [encoded] = token.split(".");
    const message = Buffer.from(encoded, "base64").toString("utf-8");

    expect(message).toContain(TEST_ADDRESS);
    expect(message).toContain("Sign in to Alchemy Gateway");
    expect(message).toContain("x402.alchemy.com");
    expect(message).toContain("Nonce: abc123def456");
    expect(message).toContain("Issued At: 2025-01-01T00:00:00.000Z");
  });

  it("computes expiration from expiresAfter", async () => {
    const token = await signSiws({
      privateKey: TEST_SECRET_KEY_BS58,
      issuedAt: "2025-01-01T00:00:00.000Z",
      expiresAfter: "2h",
    });

    const [encoded] = token.split(".");
    const message = Buffer.from(encoded, "base64").toString("utf-8");

    expect(message).toContain("Expiration Time: 2025-01-01T02:00:00.000Z");
  });

  it("defaults to 1h expiration", async () => {
    const token = await signSiws({
      privateKey: TEST_SECRET_KEY_BS58,
      issuedAt: "2025-01-01T00:00:00.000Z",
    });

    const [encoded] = token.split(".");
    const message = Buffer.from(encoded, "base64").toString("utf-8");

    expect(message).toContain("Expiration Time: 2025-01-01T01:00:00.000Z");
  });

  it("produces a valid Ed25519 signature", async () => {
    const token = await signSiws({
      privateKey: TEST_SECRET_KEY_BS58,
      nonce: "testnonce",
      issuedAt: "2025-01-01T00:00:00.000Z",
    });

    const [encoded, signatureB58] = token.split(".");
    const message = Buffer.from(encoded, "base64").toString("utf-8");
    const messageBytes = new TextEncoder().encode(message);
    const signature = bs58.decode(signatureB58);

    const valid = nacl.sign.detached.verify(
      messageBytes,
      signature,
      TEST_KEYPAIR.publicKey,
    );
    expect(valid).toBe(true);
  });
});
