import { classifyIntent } from "@/lib/services/classify-intent";
import { generateReply } from "@/lib/services/generate-reply";
import { repository } from "@/lib/services/repository";
import { runWithRetry } from "@/lib/queue/background";
import { safetyCheck } from "@/lib/services/safety-check";
import { sendInstagramReply } from "@/lib/services/send-instagram-reply";
import { type NormalizedEvent } from "@/lib/validation/automation";

export async function processAutomationEvent(event: NormalizedEvent): Promise<{ skipped: boolean; reason?: string }> {
  if (repository.isProcessed(event.idempotencyKey)) {
    return { skipped: true, reason: "already_processed" };
  }

  repository.persistIncomingEvent(event);

  const intent = await classifyIntent(event);
  const candidate = await generateReply(event, intent);
  const safety = safetyCheck(intent, candidate);

  try {
    const sent = await runWithRetry({
      name: "send_instagram_reply",
      retries: 2,
      run: async () => sendInstagramReply(event, safety.text)
    });

    repository.markProcessed(event.idempotencyKey);
    repository.persistReplyAttempt({
      id: crypto.randomUUID(),
      idempotencyKey: event.idempotencyKey,
      conversationId: event.conversationId,
      action: safety.action === "send" ? "sent" : "fallback",
      text: safety.text,
      intent: intent.intent,
      confidence: intent.confidence,
      language: intent.language,
      promptVersion: candidate.promptVersion,
      createdAt: new Date().toISOString()
    });

    return { skipped: false, reason: sent.providerMessageId };
  } catch (error) {
    repository.persistReplyAttempt({
      id: crypto.randomUUID(),
      idempotencyKey: event.idempotencyKey,
      conversationId: event.conversationId,
      action: "failed",
      text: safety.text,
      intent: intent.intent,
      confidence: intent.confidence,
      language: intent.language,
      promptVersion: candidate.promptVersion,
      createdAt: new Date().toISOString()
    });
    throw error;
  }
}
