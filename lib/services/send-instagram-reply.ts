import { sendMetaMessage } from "@/lib/meta/client";
import { type NormalizedEvent } from "@/lib/validation/automation";

export async function sendInstagramReply(event: NormalizedEvent, text: string): Promise<{ providerMessageId: string }> {
  // In production this token should come from encrypted account token storage.
  const accessToken = process.env.META_PAGE_ACCESS_TOKEN ?? "dev_access_token";

  if (process.env.NODE_ENV === "test" || process.env.SKIP_META_SEND === "true") {
    return { providerMessageId: `mock_${crypto.randomUUID()}` };
  }

  const result = await sendMetaMessage({
    recipientId: event.senderId,
    message: text,
    accessToken
  });

  return { providerMessageId: result.id };
}
