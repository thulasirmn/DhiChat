# Implementation Plan (Step-by-Step)
## Project: DHIFLOW Instagram Automation (PRD Execution)
## Date: March 8, 2026

## Context
Current app is a working scaffold but missing production-grade authentication, real Convex data integration, full Instagram OAuth/token lifecycle, and polished premium UI. This plan executes PRD features in sequence with quality gates.

## Source of Truth for Framework Upgrade
- Next.js official docs show the latest stable major upgrade path is from 15 -> 16.
- Use official upgrade guidance and codemod-first approach.

## Authentication Decision
- Authentication provider: **WorkOS** (AuthKit + Sessions).
- Multi-tenant readiness: map WorkOS user + organization context to app-level tenant scoping in Convex.

## Phase 0: Baseline and Guardrails (Day 0)
### Tasks
- Freeze current baseline on a branch.
- Add CI jobs for `typecheck`, `test`, `build`, and lint.
- Add environment validation for required secrets.
- Add structured error format standard for all API routes.

### Exit Criteria
- CI green on current baseline.
- Error/logging standards documented.

## Phase 1: Upgrade to Latest Next.js (Day 1)
### Tasks
- Upgrade framework/tooling to latest stable:
  - `next@latest`, `react@latest`, `react-dom@latest`, `eslint-config-next@latest`.
- Run Next codemod upgrade and apply required migration changes.
- Re-run lint/typecheck/test/build and fix breakages.
- Validate route handlers, cookies, server components, and runtime compatibility.

### Best Practices
- Upgrade incrementally in one dedicated PR.
- No feature changes in this PR beyond compatibility fixes.

### Exit Criteria
- App builds and runs on latest Next.js.
- No deprecated API usage in codebase.

## Phase 2: WorkOS Authentication and Session Model (Day 2-3)
### Tasks
- Remove temporary/demo auth flow and adopt WorkOS AuthKit.
- Implement login, callback, logout, and session validation with WorkOS middleware.
- Protect dashboard and protected APIs using WorkOS session checks.
- Add user identity mapping table in Convex:
  - `workosUserId` -> internal `userId`.
- Add organization mapping for tenancy:
  - `workosOrganizationId` -> workspace/account ownership scope.
- Handle session expiry, revoked sessions, and unauthorized access redirects.

### PRD Features Covered
- Authentication and session management.
- Tenant scoping foundation for all data access.

### Exit Criteria
- Only valid WorkOS sessions can access dashboard and protected APIs.
- User + org identity is available server-side for all protected actions.

## Phase 3: Real Convex Data Layer (Day 3-4)
### Tasks
- Replace in-memory `repository` with Convex mutations/queries.
- Implement full PRD entities:
  - `users`, `instagramAccounts`, `accountTokens`, `conversations`, `messages`, `events`, `automationRules`, `replyAttempts`, `auditLogs`.
- Add indices and access guards by `userId` + `instagramAccountId`.
- Encrypt token fields before persistence.

### PRD Features Covered
- Data model requirements.
- Audit and inbox persistence.

### Exit Criteria
- App restart does not lose data.
- All dashboard screens read real Convex data.

## Phase 4: Instagram OAuth + Webhooks End-to-End (Day 4-6)
### Tasks
- Implement Meta OAuth connect flow for Business/Creator accounts.
- Implement token exchange + long-lived token handling + expiry checks.
- Complete connect/disconnect account lifecycle.
- Harden webhook endpoint:
  - Challenge verification
  - Signature verification
  - Idempotency
  - Retry-safe processing
- Map DM/comment payloads reliably into normalized events and conversations.

### PRD Features Covered
- Instagram account connection.
- Webhook ingestion for comments and DMs.

### Exit Criteria
- Real connected IG account can receive comments/DMs and trigger processing.
- Duplicate webhooks do not duplicate replies.

## Phase 5: Automation Engine + Safety Policy (Day 6-7)
### Tasks
- Move from heuristic-only pipeline to configurable prompt pipeline.
- Add intent classifier abstraction + confidence scoring contract.
- Enforce strict fallback policy rules centrally.
- Persist model metadata (prompt version, rationale, confidence, risk flags).
- Add rate limiting and circuit-breaker for outbound provider/API failures.

### PRD Features Covered
- Automation engine.
- Safety guardrails.
- Outbound sender reliability.

### Exit Criteria
- Auto replies sent for safe events.
- Fallback used for low-confidence/risky events with audit reason.

## Phase 6: Elegant UI Redesign (Day 7-9)
### Tasks
- Establish design tokens (type scale, spacing scale, neutral palette, accent rules).
- Build cohesive component system (cards, list rows, filters, tabs, sheets, status chips, toasts).
- Redesign key screens:
  - Onboarding/connect flow
  - Unified inbox with richer conversation state
  - Automation settings with clear controls
  - Audit timeline with filters and drill-down
- Add motion choreography (subtle stagger/reveal, no generic animation spam).
- Improve accessibility (focus, ARIA, contrast, keyboard navigation).

### PRD Features Covered
- UX/UI quality requirements.
- Inbox/accounts/settings/audit experience.

### Exit Criteria
- UI meets “elegant minimalist” quality bar.
- Mobile + desktop usability validated.

## Phase 7: Hardening, QA, and Launch Readiness (Day 9-10)
### Tasks
- Expand tests:
  - Unit: classifier/safety/signature
  - Integration: webhook -> processing -> send -> audit
  - E2E: WorkOS login, connect account, inbound message, outbound reply, audit trace
- Add observability dashboards for pipeline failures and send success rates.
- Security checklist: secret handling, authz boundaries, token encryption, webhook abuse protection.
- Prepare staging validation with real Instagram sandbox/business account.

### Exit Criteria
- PRD release criteria met.
- No P0/P1 defects.

## Delivery Model
- Ship each phase as a separate PR with narrow scope.
- Do not combine framework upgrade with feature work.
- Demo each phase with measurable acceptance checklist.

## Proposed Execution Order (Immediate)
1. Upgrade to latest Next.js and stabilize CI. (in progress)
2. Implement WorkOS auth and tenant/org mapping.
3. Replace in-memory storage with Convex queries/mutations.
4. Complete Instagram OAuth + webhook production flow.
5. Improve automation quality/safety and redesign UI.
6. Harden and launch.
