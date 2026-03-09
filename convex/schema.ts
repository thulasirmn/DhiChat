import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  users: defineTable({
    id: v.string(),
    email: v.string(),
    firstName: v.optional(v.string()),
    lastName: v.optional(v.string()),
    organizationId: v.optional(v.string()),
    createdAt: v.string(),
    updatedAt: v.string()
  }).index("by_external_id", ["id"]),

  instagramAccounts: defineTable({
    userId: v.string(),
    igAccountId: v.string(),
    handle: v.string(),
    accountType: v.union(v.literal("BUSINESS"), v.literal("CREATOR")),
    status: v.union(v.literal("connected"), v.literal("expired")),
    connectedAt: v.string()
  }).index("by_user", ["userId"]),

  accountTokens: defineTable({
    userId: v.string(),
    instagramAccountId: v.string(),
    encryptedAccessToken: v.string(),
    tokenExpiresAt: v.string(),
    refreshToken: v.optional(v.string())
  }).index("by_account", ["instagramAccountId"]).index("by_user", ["userId"]),

  conversations: defineTable({
    userId: v.string(),
    instagramAccountId: v.string(),
    channel: v.union(v.literal("comment"), v.literal("dm")),
    externalConversationId: v.string(),
    title: v.string(),
    lastMessage: v.string(),
    unreadCount: v.number(),
    lastMessageAt: v.string(),
    status: v.union(v.literal("active"), v.literal("resolved"), v.literal("needs_review"))
  }).index("by_account", ["instagramAccountId"]).index("by_user", ["userId"]),

  messages: defineTable({
    userId: v.string(),
    conversationId: v.string(),
    direction: v.union(v.literal("inbound"), v.literal("outbound")),
    externalMessageId: v.optional(v.string()),
    senderId: v.string(),
    text: v.string(),
    createdAt: v.string()
  }).index("by_conversation", ["conversationId"]).index("by_user", ["userId"]),

  events: defineTable({
    userId: v.string(),
    instagramAccountId: v.string(),
    conversationId: v.string(),
    idempotencyKey: v.string(),
    channel: v.union(v.literal("comment"), v.literal("dm")),
    payload: v.string(),
    createdAt: v.string()
  }).index("by_idempotency", ["idempotencyKey"]).index("by_user", ["userId"]),

  automationRules: defineTable({
    userId: v.string(),
    instagramAccountId: v.string(),
    tone: v.string(),
    languageMode: v.union(v.literal("auto"), v.literal("fixed")),
    safetyMode: v.literal("strict_fallback"),
    updatedAt: v.string()
  }).index("by_account", ["instagramAccountId"]).index("by_user", ["userId"]),

  replyAttempts: defineTable({
    userId: v.string(),
    eventId: v.string(),
    idempotencyKey: v.string(),
    conversationId: v.string(),
    action: v.union(v.literal("sent"), v.literal("fallback"), v.literal("failed")),
    intent: v.string(),
    promptVersion: v.string(),
    confidence: v.number(),
    language: v.string(),
    responseText: v.string(),
    createdAt: v.string()
  }).index("by_event", ["eventId"]).index("by_user", ["userId"]).index("by_idempotency", ["idempotencyKey"]),

  auditLogs: defineTable({
    userId: v.string(),
    instagramAccountId: v.string(),
    eventType: v.union(v.literal("classified"), v.literal("generated"), v.literal("fallback"), v.literal("sent"), v.literal("failed")),
    conversationId: v.string(),
    summary: v.string(),
    metadata: v.string(),
    createdAt: v.string()
  }).index("by_account", ["instagramAccountId"]).index("by_user", ["userId"])
});
