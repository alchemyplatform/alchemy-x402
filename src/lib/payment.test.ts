import { describe, it, expect } from "vitest";
import { buildX402Client } from "./payment.js";

const TEST_KEY =
  "0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80";

describe("buildX402Client", () => {
  it("returns an x402Client with createPaymentPayload method", () => {
    const client = buildX402Client(TEST_KEY);
    expect(client).toBeDefined();
    expect(typeof client.createPaymentPayload).toBe("function");
  });
});
