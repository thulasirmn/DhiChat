# Agent Guidelines - DhiChat

This document defines engineering best practices for contributors and AI agents working in this repository.

## 1. Product and Stack
- Framework: Next.js 16 (App Router).
- Auth: WorkOS AuthKit.
- Data layer: Convex (schema-first, tenant-safe).
- Styling: Tailwind CSS with design tokens from `app/globals.css`.
- Validation: Zod for all external and API payloads.
- Testing: Vitest (unit + integration).

## 2. Architecture Rules
- Keep route handlers thin. Business logic must live in `lib/services/*`.
- Prefer server components by default; only use client components when state/events are required.
- Do not place external API orchestration directly in page components.
- Keep utility functions pure and reusable (`lib/utils/*`).
- Every protected business endpoint must enforce auth at the server boundary.

## 3. Authentication and Authorization
- Use WorkOS `withAuth`/`requireSession` from `lib/services/auth.ts`.
- Auth middleware (`proxy.ts`) must cover all routes that call `withAuth()`.
- Never trust client-side session checks for authorization.
- Always scope data to authenticated user and organization context.
- Logout must pass explicit `returnTo` URL.

## 4. API and Security
- Validate all incoming request data with Zod.
- Verify Meta webhook signatures before payload processing.
- Enforce idempotency for webhook events and outbound reply operations.
- Encrypt secrets/tokens at rest before persistence.
- Use structured logs with correlation IDs for request tracing.
- Return safe error messages to clients; keep internals in logs.

## 5. Data and Tenancy
- Convex entities must include ownership/tenant relations.
- No cross-tenant reads or writes.
- Add indexes for access paths used by UI and automations.
- Persist full audit trail for each automation decision/sent response.

## 6. UI/UX and Theme
- Reuse existing visual language and tokens; do not introduce random color systems.
- Keep responsive behavior first-class (mobile, tablet, desktop).
- Use shared UI primitives from `components/ui/*`.
- Support both light and dark modes via `data-theme` tokens.
- Keep interactions subtle (`interactive-soft`, `pressable`) and respect reduced motion.
- Avoid hardcoded colors unless mapped in dark mode overrides.

## 7. Performance
- Avoid unnecessary client components and expensive re-renders.
- Use server data fetching for dashboard pages where possible.
- Keep payloads small and avoid over-fetching.
- Do not block request path with long operations; use retry/queue patterns where appropriate.

## 8. Testing and Quality Gates
Before considering a task complete, run:
- `npm run lint`
- `npm run typecheck`
- `npm test`
- `npm run build`

Add tests for:
- New service logic.
- Auth/authorization edge cases.
- Webhook and automation pipeline behavior.

## 9. File and Naming Conventions
- Keep feature logic grouped by domain (`lib/services/*`).
- Use explicit names: `process-automation-event.ts`, `normalize-instagram-event.ts`.
- Avoid abbreviations in new module names unless standard.
- Keep components small and composable.

## 10. Change Management
- Implement in small, reviewable steps.
- Do not mix unrelated refactors with feature work.
- Keep docs and `.env.example` updated when config changes.
- If introducing a new dependency, justify it and ensure it is actively maintained.

## 11. Prohibited Patterns
- No direct DB access from UI components.
- No auth checks only on client side.
- No unvalidated external payload processing.
- No hardcoded credentials/secrets in source.
- No destructive Git operations without explicit approval.

## 12. Delivery Standard
A task is done only when:
- Behavior is implemented.
- Quality gates pass.
- UX is consistent with project theme.
- Security/tenancy requirements are preserved.
- Documentation is updated where needed.

## 13. AI Planning Loop (Mandatory)
For every non-trivial task, execute this loop:
1. Clarify objective, constraints, and acceptance criteria from PRD/user request.
2. Inspect current code paths and existing patterns before proposing changes.
3. Create a small stepwise plan (data, services, API, UI, tests, docs).
4. Implement one scoped step at a time with verification after each step.
5. Re-plan when assumptions fail; do not continue with stale assumptions.
6. End with explicit validation summary and remaining risks.

## 14. Automatic Code Review Rules
Before handoff, perform a self-review focused on:
- Correctness: edge cases, null/undefined handling, idempotency, retries.
- Security: authz boundaries, tenant scoping, secret/token handling.
- Data: schema compatibility, index usage, migration/backfill impact.
- UI: responsive behavior, accessibility, dark/light token parity.
- Runtime: hydration safety (no random/time-dependent SSR mismatch).
- Tests: coverage for changed business logic and failure paths.
If issues are found, fix before handoff or clearly document blockers.

## 15. PR Generation Rules
Every significant change must include:
- Scope summary (what changed, what did not).
- Why: user/problem statement and design rationale.
- Risk assessment: behavior, security, migration, performance impacts.
- Test evidence: lint/type/test/build outcomes and notable manual checks.
- Rollback plan for risky changes.
- Follow-up items explicitly listed (not hidden in prose).
Never bundle unrelated refactors in feature PRs.

## 16. Convex Schema Enforcement
- Treat `convex/schema.ts` as the source of truth for persisted data.
- Any new field/table requires schema update first, then code usage.
- Avoid runtime writes for fields not represented in schema validators.
- Enforce tenant keys (`userId`, `organizationId`, `instagramAccountId`) on all relevant tables.
- Add/maintain indexes for query patterns used in production flows.
- Schema-affecting changes must include migration/backfill strategy notes.

## 17. Automation Pipeline Safety
- Webhook intake must verify signature and normalize payload before enqueueing.
- Use idempotency keys for inbound events and outbound send attempts.
- Generation and send stages must be separable and retry-safe.
- Safety checks (policy/moderation/fallback) are required before auto-send.
- Persist audit logs for classification, generation, safety decision, and send result.
- On uncertainty or policy failure, fall back to safe/manual-review response mode.

## 18. Mistake Memory
- Track repeated implementation mistakes in a short local log (`docs/mistake-memory.md`).
- For each mistake: root cause, fix, and prevention rule.
- Before starting similar work, review relevant entries and apply prevention steps.
- Do not repeat previously documented failures without justification.

## 19. Anti-Hallucination Rules
- Do not invent APIs, env vars, SDK methods, DB fields, or file paths.
- Verify framework/library behavior against installed versions in repo.
- When uncertain, inspect code/docs first; mark assumptions explicitly.
- Keep generated examples aligned with real project modules and exports.
- For external integrations (Meta, WorkOS, Convex, OpenAI), validate payload shapes with Zod.

## 20. Safe Refactoring Limits
- Refactor only within scope needed for the requested outcome.
- Preserve public interfaces unless change is required and coordinated.
- Avoid broad renames/moves without clear migration impact analysis.
- Keep refactors behavior-preserving unless tests/spec demand behavior change.
- Stop and request direction when unexpected unrelated changes appear.

## 21. Agent Retry Strategy
- On command/test failure: classify as transient, environment, or code defect.
- Retry transient failures with bounded attempts and backoff.
- For environment/setup failures, fix prerequisites then rerun from first failing step.
- For code defects, apply minimal fix and rerun targeted checks before full suite.
- Escalate only after retries are exhausted with concise failure evidence.

## 22. Production Repository Patterns
- Prefer domain-oriented modules: ingestion -> orchestration -> side effects.
- Keep boundaries explicit: route handler -> service -> data access.
- Enforce typed contracts between layers and external providers.
- Use feature flags/config gates for risky behavior changes.
- Keep observability first-class: structured logs, correlation IDs, audit traces.
- Design for multi-tenant isolation and least-privilege access by default.
