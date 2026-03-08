import { metaWebhookEventSchema, type MetaWebhookEvent } from "@/lib/validation/meta";
import { normalizedEventSchema, type NormalizedEvent } from "@/lib/validation/automation";

type MetaEntry = MetaWebhookEvent["entry"][number];
type MetaChange = NonNullable<MetaEntry["changes"]>[number];
type MetaMessage = NonNullable<MetaEntry["messaging"]>[number];

function fromChange(entryId: string, change: MetaChange): NormalizedEvent {
  const text = change.value.text ?? "";
  const senderId = change.value.from?.id ?? "unknown_sender";
  const eventId = change.value.id;

  return normalizedEventSchema.parse({
    idempotencyKey: `comment:${eventId}`,
    channel: "comment",
    accountId: entryId,
    conversationId: `comment_thread_${eventId}`,
    senderId,
    senderHandle: change.value.from?.username,
    text,
    timestamp: change.value.timestamp ?? new Date().toISOString(),
    raw: change
  });
}

function fromMessage(entryId: string, message: MetaMessage): NormalizedEvent {
  const messageId = message.message?.mid ?? `msg_${message.timestamp}`;

  return normalizedEventSchema.parse({
    idempotencyKey: `dm:${messageId}`,
    channel: "dm",
    accountId: entryId,
    conversationId: `dm_${message.sender.id}`,
    senderId: message.sender.id,
    text: message.message?.text ?? "",
    timestamp: new Date(message.timestamp).toISOString(),
    raw: message
  });
}

export function normalizeInstagramEvent(payload: unknown): NormalizedEvent[] {
  const event = metaWebhookEventSchema.parse(payload);
  const normalized: NormalizedEvent[] = [];

  for (const entry of event.entry) {
    for (const change of entry.changes ?? []) {
      if (change.field === "comments") {
        normalized.push(fromChange(entry.id, change));
      }
    }

    for (const message of entry.messaging ?? []) {
      normalized.push(fromMessage(entry.id, message));
    }
  }

  return normalized;
}
