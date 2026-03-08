### Instagram AI Automation Platform V1 (Next.js + Convex + Tailwind Minimalist UI)

### Summary
Build a greenfield, multi-tenant Instagram automation app with Next.js where users connect multiple Instagram Business/Creator accounts, ingest comments + DMs via Meta Graph webhooks, generate AI lead-gen replies, and auto-send with strict safety fallback.
Design goal: premium minimalist UI (intentional, clean, non-generic), built with Tailwind component primitives and consistent design tokens.

### Implementation Changes
1. Next.js architecture best practices
- Use App Router with clear boundaries: `app/(marketing)`, `app/(auth)`, `app/(dashboard)`, and server-first rendering where possible.
- Keep API routes thin (`app/api/.../route.ts`) and move business logic to service modules (`lib/services/*`).
- Validate all external payloads (Meta/OpenAI) with schema validation (e.g., Zod) before processing.
- Enforce idempotency and retries for webhook/event handling; use queue/background worker pattern for generation/send.
- Centralize error handling, typed responses, structured logging, and request correlation IDs.
- Secure secrets/tokens with encryption at rest and strict per-user/per-account authorization checks.

2. Backend modules
- `Auth + IG Connect`: OAuth connect/disconnect, token lifecycle (refresh/expiry), account permissions.
- `Webhook Ingestion`: verification/signature checks, normalization, dedupe, persistence.
- `Automation Engine`: intent classification, language detection, reply generation, safety evaluation.
- `Outbound Sender`: Graph API reply dispatch with retry/backoff and failure capture.
- `Audit + Analytics`: full trace per reply attempt (classification, prompt version, output, send result).

3. Data model (Convex)
- Core collections: `users`, `instagramAccounts`, `accountTokens`, `conversations`, `messages`, `events`, `automationRules`, `replyAttempts`, `auditLogs`.
- Tenant isolation by user and connected account IDs.
- Idempotency keys for inbound events and outbound sends.

4. UI/UX system (stunning minimalist, non-generic)
- Tailwind-based design system with custom tokens: neutral-forward palette, precise spacing scale, restrained accent color, typography hierarchy, and subtle depth.
- Build reusable UI primitives/components (cards, list rows, filters, tabs, sheets, toasts, status chips) with consistent motion and interaction states.
- Minimalist visual direction: high whitespace discipline, strong alignment, limited ornamentation, high legibility, meaningful micro-interactions only.
- Key screens:
  - Onboarding/connect flow for IG accounts.
  - Unified inbox (DMs + comments) with fast filtering and conversation detail panel.
  - Automation settings (tone/persona, safety behavior, language behavior).
  - Audit timeline with searchable event/reply history.
- Responsive design for desktop + mobile with accessibility-first behavior (keyboard nav, contrast, focus rings, ARIA patterns).

5. Public interfaces
- `POST /api/meta/webhook` (challenge + event intake).
- Internal typed interfaces:
  - `normalizeInstagramEvent`
  - `classifyIntent`
  - `generateReply`
  - `safetyCheck`
  - `sendInstagramReply`

### Test Plan
- Unit: schema validation, classifier/generator orchestration, safety fallback decisions.
- Integration: webhook -> pipeline -> outbound send -> audit persistence.
- Security: signature validation, authz boundaries, cross-tenant access prevention.
- E2E: login, connect IG, inbound DM/comment, auto-reply, inbox update, audit trail visibility.
- UI quality: component visual regression, responsive checks, accessibility checks.

### Assumptions and Defaults
- Integration path is Meta Graph API only.
- V1 channels are comments + DMs.
- Reply mode is fully automatic with strict safety fallback.
- Provider is OpenAI; language behavior is detect-and-reply in same language.
- Deployment target is Vercel; database/backend is Convex.
- Multi-IG-account support per app user is required.
