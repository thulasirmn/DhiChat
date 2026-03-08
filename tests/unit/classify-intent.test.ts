import { describe, expect, it } from "vitest";
import { classifyIntent } from "@/lib/services/classify-intent";
import { normalizedEventSchema } from "@/lib/validation/automation";

describe("classifyIntent", () => {
  it("detects lead intent", async () => {
    const event = normalizedEventSchema.parse({
      idempotencyKey: "k1",
      channel: "dm",
      accountId: "ig_1",
      conversationId: "conv_1",
      senderId: "u_1",
      text: "Can I get pricing details?",
      timestamp: new Date().toISOString(),
      raw: {}
    });

    const result = await classifyIntent(event);
    expect(result.intent).toBe("lead");
    expect(result.confidence).toBeGreaterThan(0.8);
  });

  it("flags low confidence unknown", async () => {
    const event = normalizedEventSchema.parse({
      idempotencyKey: "k2",
      channel: "comment",
      accountId: "ig_1",
      conversationId: "conv_2",
      senderId: "u_2",
      text: "nice",
      timestamp: new Date().toISOString(),
      raw: {}
    });

    const result = await classifyIntent(event);
    expect(result.intent).toBe("unknown");
    expect(result.riskFlags).toContain("low_confidence");
  });
});
