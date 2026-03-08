import { beforeAll, describe, expect, it } from "vitest";
import { processAutomationEvent } from "@/lib/services/process-automation-event";
import { normalizedEventSchema } from "@/lib/validation/automation";

describe("processAutomationEvent", () => {
  beforeAll(() => {
    process.env.SKIP_META_SEND = "true";
  });

  it("processes and idempotently skips duplicate", async () => {
    const idempotencyKey = `test-${crypto.randomUUID()}`;

    const event = normalizedEventSchema.parse({
      idempotencyKey,
      channel: "dm",
      accountId: "ig_1",
      conversationId: "conv_test",
      senderId: "u_1",
      text: "Interested in pricing",
      timestamp: new Date().toISOString(),
      raw: {}
    });

    const first = await processAutomationEvent(event);
    const second = await processAutomationEvent(event);

    expect(first.skipped).toBe(false);
    expect(second.skipped).toBe(true);
    expect(second.reason).toBe("already_processed");
  });
});
