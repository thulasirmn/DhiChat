---
name: convex
description: Implement and maintain Convex backends for TypeScript/Next.js apps. Use when tasks involve creating or editing Convex schema, queries, mutations, actions, indexes, and app integration; migrating from in-memory repositories to Convex; adding auth-aware and tenant-safe data access; or validating Convex function behavior and local dev workflows.
---

# Convex Backend Workflow

## Quick Start

1. Inspect current Convex files (`convex/schema.ts`, `convex/**/*.ts`) and caller code.
2. Load and follow [references/convex.instructions.md](references/convex.instructions.md) as the primary ruleset.
2. Decide if the change needs a `query`, `mutation`, `action`, or `httpAction`.
3. Update schema and indexes first when data shape changes.
4. Implement Convex functions with strict argument/return validators.
5. Update app-side call sites and error handling.
6. Run validation checks (`npx convex dev`, project typecheck/tests as needed).

## Rule Priority

1. Treat [references/convex.instructions.md](references/convex.instructions.md) as source of truth for Convex conventions and API usage.
2. Use repository-specific patterns in this SKILL.md and `references/convex-patterns.md` only when they do not conflict with official Convex rules.
3. If rules conflict, prefer official Convex guidance and adjust local patterns accordingly.

## Function Selection Rules

- Use `query` for read-only operations that run in Convex and must be deterministic.
- Use `mutation` for writes and state transitions.
- Use `action` for side effects or external API calls (LLM, Meta API, webhooks relay).
- Use `httpAction` only for HTTP endpoints that must terminate directly in Convex.

## Schema and Index Workflow

1. Define table fields with `v.*` validators and explicit unions/literals.
2. Add indexes for each high-frequency filter path (for example, `by_user`, `by_account`).
3. Keep timestamps consistent (ISO string in this repo) unless project conventions change.
4. Prefer additive migrations first; remove old fields only after all callers are updated.
5. Validate all new reads are index-backed when possible.

## Auth and Tenancy Guardrails

- Map authenticated app identity to a Convex `users` record before data operations.
- Require account ownership checks for all account-scoped reads/writes.
- Never trust external identifiers directly; resolve them through tenant-owned records.
- Keep secrets encrypted before persistence and avoid returning secret material from queries.

## Integration Pattern for This Repository

1. Replace in-memory repository operations in `lib/services/repository.ts` with Convex calls.
2. Keep API routes in `app/api/*` thin: validate input, enforce auth, call Convex functions.
3. Centralize event idempotency checks in Convex (`events.by_idempotency`) before processing.
4. Keep audit/event writes in mutations so state changes are traceable.

## Validation Checklist

1. Run `npx convex dev` to confirm schema/function compatibility.
2. Run `npm run typecheck`.
3. Run targeted tests for changed flows.
4. Verify unauthorized tenant access is blocked in affected functions.
5. Verify indexes used by new list/filter queries.

## References

- Read [references/convex.instructions.md](references/convex.instructions.md) first for official Convex guidance.
- Read [references/convex-patterns.md](references/convex-patterns.md) for this repository's practical templates and command recipes.
