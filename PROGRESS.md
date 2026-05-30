# WayAbroad — Build Progress

Running log of milestone status, decisions, and open questions. Source of truth for "where are we."

## Milestone status

| Milestone | Status | Notes |
|---|---|---|
| **M0 — Scaffold** | 🟡 In progress | Next.js 14 + TS + Tailwind + shadcn, tooling, observability stubs, CI |
| M1 — Data layer | ⬜ Not started | Prisma schema, migrations, typed client, seed script, mock fallback |
| M2 — Profile + Assistant | ⬜ Not started | Auth, onboarding, ranked shortlist + cost breakdown |
| M3 — Probability Engine v1 | ⬜ Not started | Explainable score + confidence band + drivers; no-login free check |
| M4 — Document Generator | ⬜ Not started | Claude SOP/Study Plan drafts, editor, version history, export |
| M5 — Dashboard + status flow | ⬜ Not started | Mission tracker, checklist, simulated status, email stubs |
| M6 — Polish + demo hardening | ⬜ Not started | Mobile QA, demo accounts, DEMO_SCRIPT.md |

Legend: ⬜ not started · 🟡 in progress · ✅ done · ⚠️ blocked

## Workflow agreement (as confirmed with the owner)

- Locked stack; no substitutions without asking.
- Pinned to **Next.js 14 + React 18 + Tailwind v3 + shadcn** (honors the locked "Next.js 14").
- Probability engine = **pure TypeScript** in-app for the MVP (plan §3/§6.1), swappable later.
- **git init local; commit per major change; Codex review before *every* commit; do not push** (owner owns infra/remote).
- Owner provisions Supabase + env vars. We never create projects, run live migrations, or commit/print keys.
- Design-skill pass (`ui-ux-pro-max` → `frontend-design`) on every user-facing screen, starting M2.

## Decisions log

- **2026-05-30** — Relocated unrelated coursework PDFs/docx into `docs/coursework/` (gitignored to keep `.git` lean); WayAbroad docs into `docs/`. `database/` stays at root.
- **2026-05-30** — _Decided_ (not yet built): the probability engine will be a pure TypeScript module in-app for the MVP, not a Python service (matches plan §3 and the locked stack). Interface to be kept swappable for a Phase-2 model. Implementation lands in M3.
- **2026-05-30** — Pinned Next.js 14 / Tailwind v3 / shadcn stable rather than the Next 15 / Tailwind v4 bleeding edge, to honor the locked stack.

## Open questions

- Confirm whether to set up a GitHub remote + Vercel project when ready (currently local-only, no push).
- Resend (email) is stubbed for M5 — confirm whether real sends are wanted for the demo.

## Codex review summaries

_(One short paragraph per review — accepted vs. rejected issues and why.)_

- _M0: pending._
