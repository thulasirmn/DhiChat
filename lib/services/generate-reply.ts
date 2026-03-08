import { getOpenAIClient } from "@/lib/openai/client";
import { replyCandidateSchema, type IntentResult, type NormalizedEvent, type ReplyCandidate } from "@/lib/validation/automation";

function fallbackCopy(intent: IntentResult["intent"], language: string): string {
  const byLanguage: Record<string, Record<string, string>> = {
    en: {
      lead: "Thanks for reaching out. We can help right away. Share your goal and we will send the best next step.",
      support: "Thanks for the message. We are reviewing this and will help you shortly.",
      unknown: "Thanks for your message. Tell us what you need and we will guide you.",
      spam: "Thanks. Please share a relevant question and we can help."
    },
    es: {
      lead: "Gracias por escribirnos. Podemos ayudarte ahora mismo. Cuéntanos tu objetivo.",
      support: "Gracias por tu mensaje. Lo estamos revisando y te ayudaremos pronto.",
      unknown: "Gracias por escribir. Cuéntanos qué necesitas y te guiamos.",
      spam: "Gracias. Comparte una consulta relevante para ayudarte."
    }
  };

  return byLanguage[language]?.[intent] ?? byLanguage.en[intent];
}

export async function generateReply(event: NormalizedEvent, intent: IntentResult): Promise<ReplyCandidate> {
  const client = getOpenAIClient();

  if (!client) {
    return replyCandidateSchema.parse({
      text: fallbackCopy(intent.intent, intent.language),
      rationale: "local_fallback_no_openai_key",
      promptVersion: "v1"
    });
  }

  const response = await client.responses.create({
    model: "gpt-4.1-mini",
    input: [
      {
        role: "system",
        content:
          "You are an Instagram lead-generation assistant. Reply briefly in the same language as the user with a calm, premium brand tone. Never overpromise."
      },
      {
        role: "user",
        content: `Channel: ${event.channel}\nMessage: ${event.text}\nIntent: ${intent.intent}\nLanguage: ${intent.language}`
      }
    ]
  });

  const text = response.output_text?.trim() || fallbackCopy(intent.intent, intent.language);

  return replyCandidateSchema.parse({
    text,
    rationale: "openai_generated",
    promptVersion: "v1"
  });
}
