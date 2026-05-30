# WayAbroad — Claude Code Build Brief

> Paste everything below the line into Claude Code as your opening message.
> It assumes you run Claude Code from inside the `wayabroad/` folder, that
> `WayAbroad_Development_Plan.md` and `database/` already exist there, that
> the `codex` CLI is installed and authenticated, and that the
> `/frontend-design:frontend-design` and `/ui-ux-pro-max:ui-ux-pro-max`
> skills are available.

---

You are the lead engineer building the MVP for **WayAbroad**, an AI-powered study-abroad admissions platform (Korea-first). Read the two context files in this repo before doing anything:

- `WayAbroad_Development_Plan.md` — the authoritative plan. Stack, architecture, data model, MVP scope (§5), the two hard features (§6), milestones (§7), security (§11), and Definition of Done (§14). Follow it.
- `database/README.md` + `database/schema.sql` + the JSON/CSV files — the seed dataset (50 Korean universities, 267 programs, 2,938 SYNTHETIC admission records).

## Mission

Ship the MVP defined in §5 of the plan: onboarding/profile, AI Application Assistant (ranked shortlist), **Admission Probability Engine** (transparent, explainable score), **Auto-Document Generator** (SOP + Study Plan), cost transparency, and a polished mission-tracker dashboard with a simulated status flow. The no-login "free probability check" is the top-of-funnel hook and must be excellent.

## Locked tech stack (do not substitute without asking)

Next.js 14 (App Router) + TypeScript · Tailwind + shadcn/ui · Supabase (Postgres, Auth, Storage) · Prisma · Anthropic Claude API for generation · Vercel-ready · PostHog + Sentry stubs. TypeScript end to end.

## Supabase — I own the infra, you own the code

I will create the Supabase project and set the env vars myself. **Do NOT** try to create a project, run migrations against a live DB, or print/commit any keys.

- Read config from `.env.local`; provide a committed `.env.example` with every required var name (`NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`, `SUPABASE_SERVICE_ROLE_KEY`, `ANTHROPIC_API_KEY`, etc.).
- Treat `database/schema.sql` as the source of truth for the reference tables. Add a `supabase/migrations/` folder and a typed Supabase/Prisma client. Write an idempotent seed script (`scripts/seed.ts`) that loads the `*_flat.json` files — but it only runs when I provide credentials.
- Gracefully handle "no DB connection yet": the app must build and the UI must render with mocked data so I can review before wiring real Supabase.

## Use the design skills — this is mandatory, not optional

The UI is the demo. Whenever you create or restyle any user-facing screen or component:

1. First invoke **`/ui-ux-pro-max:ui-ux-pro-max`** to define the design system, layout, interaction patterns, and UX flow for that screen.
2. Then invoke **`/frontend-design:frontend-design`** to produce the actual high-fidelity component implementation.

Apply this to: the landing page + free probability check, onboarding/profile, the shortlist + university detail/cost pages, the probability-score display (with its driver breakdown), the document generator editor, and the dashboard mission-tracker. Establish a single design system (tokens, typography, spacing, components) early and reuse it — do not redesign per page.

## Use Codex as an independent critic — at every milestone

After you complete each milestone below, before you mark it done, run the **`codex`** CLI in non-interactive mode to get an adversarial review of your own work, e.g.:

```bash
codex exec "Review the changes in this branch as a senior engineer and security reviewer. \
Focus on: correctness, type safety, React/Next anti-patterns, Supabase RLS and auth handling, \
secrets hygiene, the probability-engine logic, and accessibility. List concrete issues, ranked. \
Do not rewrite the code—critique it."
```

Then: read Codex's critique, fix the legitimate issues, and write a one-paragraph summary of what you accepted/rejected and why. Treat Codex as a skeptical reviewer whose job is to find what's wrong — not as an authority. You make the final call, but you must address or explicitly justify every issue it raises. Run a Codex pass specifically on auth/RLS and on the probability engine.

## Milestones (deployable build at each step; commit per milestone)

- **M0 — Scaffold.** Next.js + TS + Tailwind + shadcn/ui, ESLint/Prettier, folder structure, `.env.example`, Sentry/PostHog stubs, a green CI workflow (typecheck + lint + build). App runs locally. → Codex review.
- **M1 — Data layer.** Prisma schema mirroring `database/schema.sql`, `supabase/migrations/`, typed client, `scripts/seed.ts` reading the flat JSON, and mock-data fallback. → Codex review.
- **M2 — Profile + Assistant.** Auth (email + Google via Supabase), onboarding capturing GPA/language/budget/field, and a ranked shortlist with university detail + full cost breakdown. Design-skill pass on every screen. → Codex review.
- **M3 — Probability Engine v1.** Implement §6.1: explainable weighted score blended with `admission_records`, returned with confidence band + driver breakdown. Pure, unit-tested scoring function. Build the no-login free probability check on the landing page. → Codex review (engine logic + funnel).
- **M4 — Document Generator.** Claude integration with structured prompts per doc type, SOP + Study Plan drafts, an editor with version history, export to PDF/DOCX. Drafts clearly labeled as aids. Design-skill pass on the editor. → Codex review.
- **M5 — Dashboard + status flow.** Mission-tracker UI, application checklist, simulated status progression (admin can advance), email notification stubs. Design-skill pass. → Codex review.
- **M6 — Polish + demo hardening.** Mobile-responsive QA, seed demo accounts, fix all open Codex/Sentry issues, and write `DEMO_SCRIPT.md` walking a judge through the §14 Definition of Done in under 5 minutes. → Final Codex review.

## Guardrails (do not violate)

- **Never** commit secrets or print API keys. `.env.local` stays git-ignored.
- The seed `admission_records` are **synthetic** — surface a clear "sample data" indicator anywhere they drive a number, and keep the architecture ready to swap in real outcomes.
- Treat all tuition/cost figures as `verify_before_launch` — show a small "estimate, verify with university" note wherever displayed.
- Position generated documents as editable **drafts/aids**, never finished submissions (academic-integrity + brand-trust).
- Probability scores always ship with a confidence band and their drivers — no bare percentages.
- Enforce Supabase row-level security on any user-data tables you add (students, applications, documents).

## Working agreement

- Trunk-based: short-lived feature branch per milestone, conventional commits, no red CI merges.
- Before each milestone, post a short plan and wait for my go-ahead if it deviates from the dev plan. Otherwise proceed.
- After each milestone: deploy-ready build, the Codex-review summary, and a one-line "how to see it" note.
- Keep a running `PROGRESS.md` (milestone status, decisions, open questions).
- If something in the dev plan is wrong or a better approach exists, say so directly and propose it — don't silently diverge.

Start with M0. Confirm you've read the dev plan and database README, then post your M0 plan.
