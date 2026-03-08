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
