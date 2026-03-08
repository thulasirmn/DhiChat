# DhiChat Instagram Automation

Production-style scaffold for Instagram DM/comment automation using Next.js App Router, Convex schema, Tailwind minimalist UI, and WorkOS authentication.

## Stack
- Next.js 16 (App Router, TypeScript)
- WorkOS AuthKit (authentication + sessions)
- Convex (schema scaffolding)
- Tailwind CSS (custom design tokens)
- Zod validation
- Vitest testing

## Routes
- `GET /callback`: WorkOS auth callback handler
- `GET/POST /api/meta/webhook`: Meta challenge + event ingestion
- `POST /api/internal/process-event`: internal orchestration endpoint (protected)
- `POST /api/instagram/connect|disconnect`: protected account actions
- `/marketing`, `/auth/login`, `/auth/logout`, `/dashboard/*`

## Local setup
1. Install dependencies: `npm install`
2. Configure env vars from `.env.example`
3. Ensure WorkOS redirect URI is configured as `http://localhost:3000/callback`
4. Start dev server: `npm run dev`
5. Run tests: `npm test`

## Notes
- WorkOS session middleware is configured in `proxy.ts`.
- Repository layer is still in-memory and marked for Convex mutation/query replacement.
- Use `SKIP_META_SEND=true` in local/dev while webhook pipeline is being tested.
