import { mutationGeneric, queryGeneric } from "convex/server";
import { v } from "convex/values";

export const getConversations = queryGeneric({
  args: { userId: v.string() },
  handler: async (ctx, args) => {
    const conversations = await ctx.db
      .query("conversations")
      .withIndex("by_user", (q) => q.eq("userId", args.userId))
      .collect();

    return conversations
      .sort((a, b) => (a.lastMessageAt < b.lastMessageAt ? 1 : -1))
      .slice(0, 50)
      .map((conversation) => ({
        id: conversation.externalConversationId,
        accountId: conversation.instagramAccountId,
        channel: conversation.channel,
        title: conversation.title,
        lastMessage: conversation.lastMessage,
        lastTimestamp: conversation.lastMessageAt,
        unreadCount: conversation.unreadCount,
        status: conversation.status
      }));
  }
});

export const upsertUser = mutationGeneric({
  args: {
    userId: v.string(),
    email: v.string(),
    firstName: v.optional(v.string()),
    lastName: v.optional(v.string()),
    organizationId: v.optional(v.string())
  },
  handler: async (ctx, args) => {
    const existing = await ctx.db
      .query("users")
      .withIndex("by_external_id", (q) => q.eq("id", args.userId))
      .first();

    const now = new Date().toISOString();

    if (existing) {
      await ctx.db.patch(existing._id, {
        email: args.email,
        firstName: args.firstName,
        lastName: args.lastName,
        organizationId: args.organizationId,
        updatedAt: now
      });
      return;
    }

    await ctx.db.insert("users", {
      id: args.userId,
      email: args.email,
      firstName: args.firstName,
      lastName: args.lastName,
      organizationId: args.organizationId,
      createdAt: now,
      updatedAt: now
    });
  }
});

export const getAccounts = queryGeneric({
  args: { userId: v.string() },
  handler: async (ctx, args) => {
    const accounts = await ctx.db
      .query("instagramAccounts")
      .withIndex("by_user", (q) => q.eq("userId", args.userId))
      .collect();

    return accounts.map((account) => ({
      id: account.igAccountId,
      handle: account.handle,
      accountType: account.accountType,
      connectedAt: account.connectedAt,
      status: account.status
    }));
  }
});

export const getAuditEvents = queryGeneric({
  args: { userId: v.string() },
  handler: async (ctx, args) => {
    const events = await ctx.db
      .query("auditLogs")
      .withIndex("by_user", (q) => q.eq("userId", args.userId))
      .collect();

    return events
      .sort((a, b) => (a.createdAt < b.createdAt ? 1 : -1))
      .slice(0, 50)
      .map((event) => ({
        id: event._id,
        eventType: event.eventType,
        conversationId: event.conversationId,
        summary: event.summary,
        createdAt: event.createdAt
      }));
  }
});

export const isProcessed = queryGeneric({
  args: {
    userId: v.string(),
    idempotencyKey: v.string()
  },
  handler: async (ctx, args) => {
    const existing = await ctx.db
      .query("events")
      .withIndex("by_idempotency", (q) => q.eq("idempotencyKey", args.idempotencyKey))
      .first();

    return Boolean(existing && existing.userId === args.userId);
  }
});

export const persistIncomingEvent = mutationGeneric({
  args: {
    userId: v.string(),
    idempotencyKey: v.string(),
    channel: v.union(v.literal("comment"), v.literal("dm")),
    accountId: v.string(),
    conversationId: v.string(),
    senderId: v.string(),
    text: v.string(),
    timestamp: v.string(),
    raw: v.string()
  },
  handler: async (ctx, args) => {
    const existingEvent = await ctx.db
      .query("events")
      .withIndex("by_idempotency", (q) => q.eq("idempotencyKey", args.idempotencyKey))
      .first();

    if (!existingEvent) {
      await ctx.db.insert("events", {
        userId: args.userId,
        instagramAccountId: args.accountId,
        conversationId: args.conversationId,
        idempotencyKey: args.idempotencyKey,
        channel: args.channel,
        payload: args.raw,
        createdAt: args.timestamp
      });
    }

    const existingConversation = await ctx.db
      .query("conversations")
      .withIndex("by_user", (q) => q.eq("userId", args.userId))
      .filter((q) => q.eq(q.field("externalConversationId"), args.conversationId))
      .first();

    if (existingConversation) {
      await ctx.db.patch(existingConversation._id, {
        lastMessage: args.text,
        lastMessageAt: args.timestamp,
        unreadCount: existingConversation.unreadCount + 1,
        status: "active"
      });
      return;
    }

    await ctx.db.insert("conversations", {
      userId: args.userId,
      instagramAccountId: args.accountId,
      channel: args.channel,
      externalConversationId: args.conversationId,
      title: args.channel === "dm" ? `@${args.senderId}` : `Post ${args.accountId}`,
      lastMessage: args.text,
      unreadCount: 1,
      lastMessageAt: args.timestamp,
      status: "active"
    });
  }
});

export const persistReplyAttempt = mutationGeneric({
  args: {
    userId: v.string(),
    eventId: v.string(),
    idempotencyKey: v.string(),
    conversationId: v.string(),
    accountId: v.string(),
    action: v.union(v.literal("sent"), v.literal("fallback"), v.literal("failed")),
    text: v.string(),
    intent: v.string(),
    confidence: v.number(),
    language: v.string(),
    promptVersion: v.string(),
    createdAt: v.string()
  },
  handler: async (ctx, args) => {
    await ctx.db.insert("replyAttempts", {
      userId: args.userId,
      eventId: args.eventId,
      idempotencyKey: args.idempotencyKey,
      conversationId: args.conversationId,
      action: args.action,
      intent: args.intent,
      promptVersion: args.promptVersion,
      confidence: args.confidence,
      language: args.language,
      responseText: args.text,
      createdAt: args.createdAt
    });

    await ctx.db.insert("auditLogs", {
      userId: args.userId,
      instagramAccountId: args.accountId,
      eventType: args.action === "sent" ? "sent" : args.action === "fallback" ? "fallback" : "failed",
      conversationId: args.conversationId,
      summary: `${args.action.toUpperCase()}: ${args.text.slice(0, 80)}`,
      metadata: JSON.stringify({
        intent: args.intent,
        confidence: args.confidence,
        language: args.language,
        promptVersion: args.promptVersion
      }),
      createdAt: args.createdAt
    });
  }
});
