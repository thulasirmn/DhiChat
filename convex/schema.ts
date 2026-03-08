import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  users: defineTable({
    email: v.string(),
    createdAt: v.string()
  }),

  instagramAccounts: defineTable({
    userId: v.id("users"),
    igAccountId: v.string(),
    handle: v.string(),
    accountType: v.union(v.literal("BUSINESS"), v.literal("CREATOR")),
    status: v.union(v.literal("connected"), v.literal("expired")),
    connectedAt: v.string()
  }).index("by_user", ["userId"]),

  accountTokens: defineTable({
    instagramAccountId: v.id("instagramAccounts"),
    encryptedAccessToken: v.string(),
    tokenExpiresAt: v.string(),
    refreshToken: v.optional(v.string())
  }).index("by_account", ["instagramAccountId"]),

  conversations: defineTable({
    instagramAccountId: v.id("instagramAccounts"),
    channel: v.union(v.literal("comment"), v.literal("dm")),
    externalConversationId: v.string(),
    lastMessageAt: v.string(),
    status: v.union(v.literal("active"), v.literal("resolved"), v.literal("needs_review"))
  }).index("by_account", ["instagramAccountId"]),

  messages: defineTable({
    conversationId: v.id("conversations"),
    direction: v.union(v.literal("inbound"), v.literal("outbound")),
    externalMessageId: v.optional(v.string()),
    senderId: v.string(),
    text: v.string(),
    createdAt: v.string()
  }).index("by_conversation", ["conversationId"]),

  events: defineTable({
    instagramAccountId: v.id("instagramAccounts"),
    idempotencyKey: v.string(),
    channel: v.union(v.literal("comment"), v.literal("dm")),
    payload: v.string(),
    createdAt: v.string()
  }).index("by_idempotency", ["idempotencyKey"]),

  automationRules: defineTable({
    instagramAccountId: v.id("instagramAccounts"),
    tone: v.string(),
    languageMode: v.union(v.literal("auto"), v.literal("fixed")),
    safetyMode: v.literal("strict_fallback"),
    updatedAt: v.string()
  }).index("by_account", ["instagramAccountId"]),

  replyAttempts: defineTable({
    eventId: v.id("events"),
    action: v.union(v.literal("sent"), v.literal("fallback"), v.literal("failed")),
    promptVersion: v.string(),
    confidence: v.number(),
    language: v.string(),
    responseText: v.string(),
    createdAt: v.string()
  }).index("by_event", ["eventId"]),

  auditLogs: defineTable({
    instagramAccountId: v.id("instagramAccounts"),
    type: v.string(),
    summary: v.string(),
    metadata: v.string(),
    createdAt: v.string()
  }).index("by_account", ["instagramAccountId"])
});
