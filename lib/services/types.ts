export type Channel = "comment" | "dm";

export type ConversationSummary = {
  id: string;
  accountId: string;
  channel: Channel;
  title: string;
  lastMessage: string;
  lastTimestamp: string;
  unreadCount: number;
  status: "active" | "resolved" | "needs_review";
};

export type InstagramAccount = {
  id: string;
  handle: string;
  accountType: "BUSINESS" | "CREATOR";
  connectedAt: string;
  status: "connected" | "expired";
};

export type AuditEvent = {
  id: string;
  eventType: "classified" | "generated" | "fallback" | "sent" | "failed";
  conversationId: string;
  summary: string;
  createdAt: string;
};
