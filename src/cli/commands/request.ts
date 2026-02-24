import { Command } from "@commander-js/extra-typings";
import { makeAuthenticatedRequest } from "../../lib/request.js";

export const requestCommand = new Command("request")
  .description("Make an authenticated request with SIWE auth and automatic x402 payment")
  .requiredOption("--private-key <key>", "Wallet private key")
  .requiredOption("--url <url>", "Request URL")
  .option("--method <method>", "HTTP method", "GET")
  .option("--body <json>", "Request body (JSON string)")
  .option("--header <k:v...>", "Additional headers (key:value)", collect)
  .action(async (opts) => {
    const headers: Record<string, string> = {};
    if (opts.header) {
      for (const h of opts.header) {
        const idx = h.indexOf(":");
        if (idx === -1) {
          console.error(`Invalid header format: ${h} (expected key:value)`);
          process.exit(1);
        }
        headers[h.slice(0, idx).trim()] = h.slice(idx + 1).trim();
      }
    }

    const result = await makeAuthenticatedRequest({
      privateKey: opts.privateKey,
      url: opts.url,
      method: opts.method,
      body: opts.body,
      headers: Object.keys(headers).length > 0 ? headers : undefined,
    });

    console.log(JSON.stringify(result, null, 2));
  });

function collect(value: string, previous: string[]): string[] {
  return previous.concat([value]);
}
