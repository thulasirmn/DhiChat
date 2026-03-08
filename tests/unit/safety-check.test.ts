import { describe, expect, it } from "vitest";
import { safetyCheck } from "@/lib/services/safety-check";
import { intentResultSchema, replyCandidateSchema } from "@/lib/validation/automation";

describe("safetyCheck", () => {
  it("falls back on low confidence", () => {
    const intent = intentResultSchema.parse({
      intent: "unknown",
      confidence: 0.4,
      riskFlags: ["low_confidence"],
      language: "en"
    });

    const candidate = replyCandidateSchema.parse({
      text: "Potential reply",
      rationale: "test",
      promptVersion: "v1"
    });

    const result = safetyCheck(intent, candidate);
    expect(result.action).toBe("fallback");
  });

  it("sends on safe lead intent", () => {
    const intent = intentResultSchema.parse({
      intent: "lead",
      confidence: 0.9,
      riskFlags: [],
      language: "en"
    });

    const candidate = replyCandidateSchema.parse({
      text: "Thanks for reaching out. We can share options.",
      rationale: "test",
      promptVersion: "v1"
    });

    const result = safetyCheck(intent, candidate);
    expect(result.action).toBe("send");
  });
});
