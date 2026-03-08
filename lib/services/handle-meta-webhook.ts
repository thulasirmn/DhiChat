import { AppError } from "@/lib/utils/errors";
import { env } from "@/lib/utils/env";
import { logger } from "@/lib/utils/logger";
import { normalizeInstagramEvent } from "@/lib/services/normalize-instagram-event";
import { processAutomationEvent } from "@/lib/services/process-automation-event";

export async function handleMetaWebhook(payload: unknown, correlationId: string): Promise<{ accepted: number }> {
  const events = normalizeInstagramEvent(payload);

  if (events.length === 0) {
    throw new AppError("No actionable events", 202, "No actionable events");
  }

  let accepted = 0;

  for (const event of events) {
    try {
      await processAutomationEvent(event);
      accepted += 1;
    } catch (error) {
      logger.error("process_event_failed", {
        correlationId,
        idempotencyKey: event.idempotencyKey,
        error: error instanceof Error ? error.message : "unknown"
      });
    }
  }

  return { accepted };
}

export function validateVerifyToken(token: string): boolean {
  return token === env.META_VERIFY_TOKEN;
}
