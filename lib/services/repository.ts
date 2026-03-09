import { getConvexClient } from "@/lib/convex/client";
import { type AuditEvent, type ConversationSummary, type InstagramAccount } from "@/lib/services/types";
import { type NormalizedEvent } from "@/lib/validation/automation";
import { api } from "@/convex/_generated/api";

type ReplyAttemptRecord = {
  id: string;
  idempotencyKey: string;
  conversationId: string;
  accountId: string;
  action: "sent" | "fallback" | "failed";
  text: string;
  intent: string;
  confidence: number;
  language: string;
  promptVersion: string;
  createdAt: string;
};

const processedKeys = new Set<string>();

const conversations: ConversationSummary[] = [
  {
    id: "conv_1",
    accountId: "ig_001",
    channel: "dm",
    title: "@sophia.run",
    lastMessage: "Can you share pricing?",
    lastTimestamp: new Date().toISOString(),
    unreadCount: 1,
    status: "active"
  },
  {
    id: "conv_2",
    accountId: "ig_001",
    channel: "comment",
    title: "Post #7821",
    lastMessage: "Interested, send details",
    lastTimestamp: new Date().toISOString(),
    unreadCount: 0,
    status: "resolved"
  }
];

const accounts: InstagramAccount[] = [
  {
    id: "ig_001",
    handle: "minimal.brand",
    accountType: "BUSINESS",
    connectedAt: new Date().toISOString(),
    status: "connected"
  }
];

const audit: AuditEvent[] = [
  {
    id: "audit_1",
    eventType: "sent",
    conversationId: "conv_2",
    summary: "Lead reply auto-sent in English",
    createdAt: new Date().toISOString()
  }
];

function hasConvexClient(): boolean {
  return Boolean(getConvexClient());
}

export const repository = {
  async upsertUser(input: {
    userId: string;
    email: string;
    firstName?: string | null;
    lastName?: string | null;
    organizationId?: string | null;
  }): Promise<void> {
    if (hasConvexClient()) {
      const client = getConvexClient();
      await client!.mutation(api.repository.upsertUser, {
        userId: input.userId,
        email: input.email,
        firstName: input.firstName ?? undefined,
        lastName: input.lastName ?? undefined,
        organizationId: input.organizationId ?? undefined
      });
    }
  },

  async isProcessed(userId: string, idempotencyKey: string): Promise<boolean> {
    if (hasConvexClient()) {
      const client = getConvexClient();
      return client!.query(api.repository.isProcessed, { userId, idempotencyKey });
    }

    return processedKeys.has(`${userId}:${idempotencyKey}`);
  },

  async markProcessed(userId: string, idempotencyKey: string): Promise<void> {
    processedKeys.add(`${userId}:${idempotencyKey}`);
  },

  async persistIncomingEvent(userId: string, event: NormalizedEvent): Promise<void> {
    if (hasConvexClient()) {
      const client = getConvexClient();
      await client!.mutation(api.repository.persistIncomingEvent, {
        userId,
        idempotencyKey: event.idempotencyKey,
        channel: event.channel,
        accountId: event.accountId,
        conversationId: event.conversationId,
        senderId: event.senderId,
        text: event.text,
        timestamp: event.timestamp,
        raw: JSON.stringify(event.raw)
      });
      return;
    }
  },

  async persistReplyAttempt(userId: string, record: ReplyAttemptRecord): Promise<void> {
    if (hasConvexClient()) {
      const client = getConvexClient();
      await client!.mutation(api.repository.persistReplyAttempt, {
        userId,
        eventId: record.id,
        idempotencyKey: record.idempotencyKey,
        conversationId: record.conversationId,
        accountId: record.accountId,
        action: record.action,
        text: record.text,
        intent: record.intent,
        confidence: record.confidence,
        language: record.language,
        promptVersion: record.promptVersion,
        createdAt: record.createdAt
      });
      return;
    }

    audit.unshift({
      id: `audit_${crypto.randomUUID()}`,
      eventType: record.action === "sent" ? "sent" : record.action === "fallback" ? "fallback" : "failed",
      conversationId: record.conversationId,
      summary: `${record.action.toUpperCase()}: ${record.text.slice(0, 80)}`,
      createdAt: new Date().toISOString()
    });
  },

  async getConversations(userId: string): Promise<ConversationSummary[]> {
    if (hasConvexClient()) {
      const client = getConvexClient();
      return client!.query(api.repository.getConversations, { userId });
    }

    return conversations;
  },

  async getAccounts(userId: string): Promise<InstagramAccount[]> {
    if (hasConvexClient()) {
      const client = getConvexClient();
      return client!.query(api.repository.getAccounts, { userId });
    }

    return accounts;
  },

  async getAuditEvents(userId: string): Promise<AuditEvent[]> {
    if (hasConvexClient()) {
      const client = getConvexClient();
      return client!.query(api.repository.getAuditEvents, { userId });
    }

    return audit.slice(0, 50);
  }
};
