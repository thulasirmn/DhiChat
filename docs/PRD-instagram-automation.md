# Product Requirements Document (PRD)
## Product: DHIFLOW Instagram Automation Platform (V1)
## Date: March 8, 2026
## Owner: Product + Engineering

## 1. Product Summary
DHIFLOW is a multi-tenant Instagram automation platform that helps brands auto-respond to Instagram DMs and post comments using AI. Users connect one or more Instagram Business/Creator accounts, monitor conversations in a unified inbox, and run fully automated lead-generation replies with strict safety fallback and full auditability.

## 2. Problem Statement
Brands and agencies lose leads because Instagram comments and DMs are not responded to quickly or consistently. Manual handling is slow, difficult to scale, and hard to audit.

## 3. Goals and Success Metrics
### Business Goals
- Increase qualified lead responses from Instagram channels.
- Reduce first-response time for comments and DMs.
- Provide compliance-safe automation with traceability.

### Product Goals
- Connect Instagram accounts in-app.
- Ingest comments + DMs reliably via Meta webhooks.
- Auto-generate and auto-send contextual responses.
- Enforce strict safety fallback when uncertain/risky.
- Provide searchable audit logs for every AI reply.

### North-Star Metrics
- Median first-response time (target: < 30 seconds).
- Auto-resolution rate for lead intent messages.
- Fallback rate (monitor for model uncertainty).
- Send success rate via Meta API.
- Weekly active connected accounts.

## 4. Users and Personas
- Brand Owner: Needs fast lead replies and simple controls.
- Social Media Manager: Monitors inbox and adjusts tone/rules.
- Agency Operator: Manages multiple client Instagram accounts.

## 5. Scope
### In Scope (V1)
- Instagram Business/Creator account connectivity.
- DMs + comments ingestion and processing.
- AI-generated fully automatic replies.
- Strict safety fallback policy.
- Unified inbox and account management UI.
- Automation settings for tone and language behavior.
- Full audit timeline and event history.

### Out of Scope (V1)
- Manual approval workflow.
- Human assignment/escalation routing.
- Billing/subscriptions.
- Multi-channel support beyond Instagram.
- Complex CRM sync.

## 6. Feature Requirements

## Feature 1: Authentication and Session Management
### Description
Users sign in and access their dashboard securely.

### Functional Requirements
- System provides login/logout flows.
- Authenticated routes require valid session.
- Session is stored in secure HTTP-only cookies.

### Acceptance Criteria
- Unauthenticated access to `/dashboard/*` redirects to login.
- Login creates session and opens dashboard.
- Logout invalidates session.

## Feature 2: Instagram Account Connection
### Description
Users connect one or more Instagram Business/Creator accounts.

### Functional Requirements
- User can initiate connect flow per account.
- System stores account identity and token metadata.
- User can disconnect account.
- System supports multiple IG accounts per app user.

### Acceptance Criteria
- Connected account appears in Accounts screen with status.
- Disconnect updates status and disables automation for that account.
- Account list is scoped to logged-in user.

## Feature 3: Webhook Ingestion (Comments + DMs)
### Description
Meta webhook events are received, validated, normalized, and queued for processing.

### Functional Requirements
- `GET /api/meta/webhook` supports challenge verification.
- `POST /api/meta/webhook` validates signature (`x-hub-signature-256`).
- Events are normalized into common internal shape.
- Idempotency key prevents duplicate processing.

### Acceptance Criteria
- Invalid signature returns 401.
- Duplicate webhook event is skipped idempotently.
- Comment and DM events are normalized and processed.

## Feature 4: Automation Engine (Intent + Reply)
### Description
The system analyzes inbound message context and generates lead-oriented responses.

### Functional Requirements
- Classify message intent (`lead`, `support`, `spam`, `unknown`).
- Detect message language and reply in same language.
- Generate concise response using AI provider (OpenAI).
- If provider unavailable, return deterministic fallback copy.

### Acceptance Criteria
- Lead-like messages are classified as `lead` with high confidence.
- Generated reply is available for outbound send.
- Language behavior mirrors inbound language.

## Feature 5: Safety Guardrails (Strict Fallback)
### Description
Fully automatic sending is protected by confidence and risk checks.

### Functional Requirements
- Unsafe/risky/low-confidence outputs trigger fallback response.
- Spam-like input triggers fallback path.
- Every safety decision is logged with reason.

### Acceptance Criteria
- Low confidence (< configured threshold) uses fallback text.
- Potential spam does not receive unconstrained AI reply.
- Audit contains reason code (`low_confidence`, `possible_spam`, etc.).

## Feature 6: Outbound Reply Sender
### Description
Send approved/fallback replies through Meta Graph API with retry behavior.

### Functional Requirements
- Send response to correct recipient and channel context.
- Retry transient failures with bounded attempts.
- Record provider message ID and status.

### Acceptance Criteria
- Successful send returns provider message ID.
- Failed sends retry and then record terminal failure.
- Send result is persisted in audit/history.

## Feature 7: Unified Inbox UI
### Description
Single interface to view DM/comment conversations and latest message state.

### Functional Requirements
- Display conversation list across connected accounts.
- Show key metadata (channel, status, latest message, unread count).
- Display conversation detail panel.

### Acceptance Criteria
- Inbox loads for authenticated users.
- Conversations show channel badges and latest content.
- Layout is responsive on mobile and desktop.

## Feature 8: Accounts UI
### Description
Manage connected Instagram accounts and account status.

### Functional Requirements
- List connected accounts with account type and status.
- Provide connect/disconnect actions.

### Acceptance Criteria
- User sees all linked accounts in one place.
- Status reflects connected/expired/disconnected state.

## Feature 9: Automation Settings UI
### Description
Configure automation behavior and brand voice.

### Functional Requirements
- Set tone/persona guidance.
- Configure strict safety mode.
- Configure language mode (auto-detect same-language replies).

### Acceptance Criteria
- Settings page displays current values and save action.
- Changes persist per Instagram account scope (target behavior).

## Feature 10: Audit Timeline UI
### Description
Provide transparent history for decisions and sends.

### Functional Requirements
- List events with event type and summary.
- Support searching/filtering by conversation/event.
- Show timestamps and outcome state.

### Acceptance Criteria
- Every processed inbound message has an audit trail.
- Timeline displays send/fallback/failure events.

## 7. Data Model Requirements (Convex)
Required logical entities:
- `users`
- `instagramAccounts`
- `accountTokens`
- `conversations`
- `messages`
- `events`
- `automationRules`
- `replyAttempts`
- `auditLogs`

Data constraints:
- Tenant isolation by user/account ID on all reads and writes.
- Encrypted token storage at rest.
- Idempotency keys unique for inbound event processing.

## 8. API Requirements
Public endpoints:
- `GET /api/meta/webhook` challenge verification
- `POST /api/meta/webhook` event ingestion

Internal/auxiliary endpoints:
- `POST /api/internal/process-event`
- `POST /api/instagram/connect`
- `POST /api/instagram/disconnect`

API quality requirements:
- Schema validation for all external payloads.
- Correlation ID in logs/responses where applicable.
- Structured error responses with safe messages.

## 9. Non-Functional Requirements
- Reliability: idempotent webhook processing + retry strategy.
- Security: signature verification, secure session cookie, encrypted credentials.
- Performance: median webhook processing latency suitable for near-real-time response.
- Observability: structured logs for classify/generate/safety/send pipeline.
- Accessibility: keyboard focus states, readable contrast, semantic markup.
- Design quality: minimalist, premium, non-generic visual system.

## 10. UX Requirements
- Visual style: calm neutral palette, strong typography, high whitespace discipline.
- Component system: cards, badges, buttons, inputs, conversation rows, status chips.
- Responsive behavior: dashboard usable on mobile and desktop.
- Motion: subtle purposeful transitions only.

## 11. User Flows
### Flow A: First-time user
1. User opens marketing page.
2. User logs in.
3. User connects Instagram account.
4. User opens inbox and automation settings.

### Flow B: New inbound message
1. Meta sends webhook event.
2. Backend verifies and normalizes event.
3. Automation engine classifies + generates reply.
4. Safety gate approves or applies fallback.
5. Reply is sent and audit event is stored.
6. Inbox/audit views reflect latest state.

## 12. Testing and QA Plan
- Unit tests: classifier, safety checks, signature validation.
- Integration tests: event processing and idempotency behavior.
- Build validation: typecheck, tests, production build.
- UI QA: responsive checks and key screen verification.

## 13. Release Criteria (V1 Exit)
- All core features implemented and verified in staging.
- End-to-end DM/comment auto-reply path works with connected IG account.
- Safety fallback behavior proven with test cases.
- Audit trail complete for each processed event.
- No P0/P1 defects open.

## 14. Risks and Mitigations
- Meta API policy/permission constraints.
  - Mitigation: strict use of official Graph API and required scopes.
- AI hallucination or unsafe copy.
  - Mitigation: strict fallback policy + prompt constraints + audit logs.
- Token expiry/invalidation.
  - Mitigation: token lifecycle checks and account health status.
- Duplicate event delivery.
  - Mitigation: idempotency key enforcement.

## 15. Future Enhancements (Post-V1)
- Manual approval queue and human handoff.
- Team workspace roles/permissions.
- SLA alerts and escalation dashboards.
- CRM integration and lead scoring.
- Multi-channel support (WhatsApp, Facebook, etc.).
