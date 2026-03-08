import { intentResultSchema, type IntentResult, type NormalizedEvent } from "@/lib/validation/automation";

const leadPatterns = /(price|pricing|cost|demo|interested|details|book|buy|plan)/i;
const supportPatterns = /(issue|problem|help|error|not working|refund)/i;
const spamPatterns = /(crypto|earn money fast|http:\/\/|https:\/\/)/i;

function detectLanguage(text: string): string {
  if (/\b(hola|gracias|precio)\b/i.test(text)) return "es";
  if (/\b(bonjour|merci|prix)\b/i.test(text)) return "fr";
  return "en";
}

export async function classifyIntent(event: NormalizedEvent): Promise<IntentResult> {
  const text = event.text ?? "";

  if (spamPatterns.test(text)) {
    return intentResultSchema.parse({
      intent: "spam",
      confidence: 0.95,
      riskFlags: ["possible_spam"],
      language: detectLanguage(text)
    });
  }

  if (leadPatterns.test(text)) {
    return intentResultSchema.parse({
      intent: "lead",
      confidence: 0.88,
      riskFlags: [],
      language: detectLanguage(text)
    });
  }

  if (supportPatterns.test(text)) {
    return intentResultSchema.parse({
      intent: "support",
      confidence: 0.81,
      riskFlags: [],
      language: detectLanguage(text)
    });
  }

  return intentResultSchema.parse({
    intent: "unknown",
    confidence: 0.45,
    riskFlags: ["low_confidence"],
    language: detectLanguage(text)
  });
}
