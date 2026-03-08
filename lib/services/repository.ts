import { type AuditEvent, type ConversationSummary, type InstagramAccount } from "@/lib/services/types";
import { type NormalizedEvent } from "@/lib/validation/automation";

type ReplyAttemptRecord = {
  id: string;
  idempotencyKey: string;
  conversationId: string;
  action: "sent" | "fallback" | "failed";
  text: string;
  intent: string;
  confidence: number;
  language: string;
  promptVersion: string;
  createdAt: string;
};

const processedKeys = new Set<string>();
const replyAttempts = new Map<string, ReplyAttemptRecord>();

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

export const repository = {
  isProcessed: (idempotencyKey: string): boolean => processedKeys.has(idempotencyKey),

  markProcessed: (idempotencyKey: string): void => {
    processedKeys.add(idempotencyKey);
  },

  persistIncomingEvent: (_event: NormalizedEvent): void => {
    // Convex mutation hook point.
  },

  persistReplyAttempt: (record: ReplyAttemptRecord): void => {
    replyAttempts.set(record.id, record);
    audit.unshift({
      id: `audit_${crypto.randomUUID()}`,
      eventType: record.action === "sent" ? "sent" : record.action === "fallback" ? "fallback" : "failed",
      conversationId: record.conversationId,
      summary: `${record.action.toUpperCase()}: ${record.text.slice(0, 80)}`,
      createdAt: new Date().toISOString()
    });
  },

  getConversations: (): ConversationSummary[] => conversations,
  getAccounts: (): InstagramAccount[] => accounts,
  getAuditEvents: (): AuditEvent[] => audit.slice(0, 50)
};
