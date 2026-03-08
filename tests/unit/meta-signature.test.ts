import crypto from "node:crypto";
import { describe, expect, it } from "vitest";
import { isValidMetaSignature } from "@/lib/security/meta-signature";

describe("isValidMetaSignature", () => {
  it("validates correct signature", () => {
    const body = JSON.stringify({ hello: "world" });
    const secret = "app-secret";
    const signature = `sha256=${crypto.createHmac("sha256", secret).update(body).digest("hex")}`;

    expect(isValidMetaSignature(body, signature, secret)).toBe(true);
  });

  it("rejects invalid signature", () => {
    expect(isValidMetaSignature("{}", "sha256=bad", "app-secret")).toBe(false);
  });
});
