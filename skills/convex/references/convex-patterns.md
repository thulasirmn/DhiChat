# Convex Patterns

## Command Recipes

- Start local Convex dev loop: `npx convex dev`
- Generate or refresh Convex types during development: `npx convex dev`
- Deploy Convex functions/schema (production): `npx convex deploy`

## Function Template Shapes

```ts
import { query, mutation, action } from "./_generated/server";
import { v } from "convex/values";

export const listByAccount = query({
  args: { accountId: v.id("instagramAccounts") },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("conversations")
      .withIndex("by_account", (q) => q.eq("instagramAccountId", args.accountId))
      .collect();
  }
});

export const updateRule = mutation({
  args: { accountId: v.id("instagramAccounts"), tone: v.string() },
  handler: async (ctx, args) => {
    // Resolve and validate tenant ownership before write.
    // Then patch/insert rule document.
  }
});

export const callExternal = action({
  args: { eventId: v.id("events") },
  handler: async (_ctx, _args) => {
    // Perform network call or other side effect.
  }
});
```

## Data Modeling Rules

- Model account-scoped entities with explicit foreign keys (`instagramAccountId`).
- Add indexes for each operational lookup path before writing query code.
- Keep idempotency keys unique per event stream and check before side effects.
- Store secret tokens encrypted and keep plaintext out of query return payloads.

## App Integration Hints

- Keep business logic in Convex functions; keep route handlers thin.
- Validate all input with Zod at route boundaries and Convex validators at function boundaries.
- Treat Convex as source of truth for repository-style operations.
