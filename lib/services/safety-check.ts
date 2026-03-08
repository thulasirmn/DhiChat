import { type IntentResult, type ReplyCandidate } from "@/lib/validation/automation";

type SafetyResult =
  | { action: "send"; text: string; reason: string }
  | { action: "fallback"; text: string; reason: string };

function fallbackForLanguage(language: string): string {
  if (language === "es") {
    return "Gracias por escribirnos. Nuestro equipo te respondera con mas detalles pronto.";
  }

  if (language === "fr") {
    return "Merci pour votre message. Notre equipe vous repondra avec plus de details bientot.";
  }

  return "Thanks for reaching out. Our team will follow up with more details shortly.";
}

export function safetyCheck(intent: IntentResult, candidate: ReplyCandidate): SafetyResult {
  if (intent.riskFlags.includes("possible_spam")) {
    return {
      action: "fallback",
      text: fallbackForLanguage(intent.language),
      reason: "possible_spam"
    };
  }

  if (intent.confidence < 0.65) {
    return {
      action: "fallback",
      text: fallbackForLanguage(intent.language),
      reason: "low_confidence"
    };
  }

  if (candidate.text.length > 400) {
    return {
      action: "fallback",
      text: fallbackForLanguage(intent.language),
      reason: "reply_too_long"
    };
  }

  return {
    action: "send",
    text: candidate.text,
    reason: "safe_to_send"
  };
}
