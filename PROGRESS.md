# WayAbroad — Build Progress

Running log of milestone status, decisions, and open questions. Source of truth for "where are we."

## Milestone status

| Milestone | Status | Notes |
|---|---|---|
| **M0 — Scaffold** | ✅ Done | Next.js 14 + TS + Tailwind + shadcn, tooling, observability stubs, green local verify + CI workflow |
| **M1 — Data layer** | ✅ Done | Migrations applied to live Supabase (RLS on all 6 tables), 50/267/2938 seeded, supabase-js typed client + data layer w/ mock fallback |
| **M2 — Profile + Assistant** | ✅ Done | Design system, Supabase auth (email + Google), onboarding → students, ranked shortlist + matching engine, university detail + cost |
| **M3 — Probability Engine v1** | 🟡 Core done | Engine (ported + tested) + no-login free check + shortlist odds + PostHog events ✅; **verified-DB overlay remaining** |
| **M4 — Document Generator** | ✅ Done | Claude SOP/Study Plan drafts (Sonnet 4.6), apply→application→editor, version history, .docx/.md/PDF export, draft-aid labels |
| **M5 — Dashboard + status flow** | ✅ Done | Mission-tracker `/dashboard` (journey checklist + profile + per-app timeline), 5-stage status timeline, submit + simulated admin advance (compare-and-set), Resend email stub, auth-aware nav + post-login → /dashboard |
| **M6 — Polish + demo hardening** | 🟡 In progress | Polish primitives (Skeleton + route `loading.tsx`, global `not-found`/`error`/`global-error`, brand favicon), `DEMO_SCRIPT.md` judge walkthrough, idempotent `pnpm seed:demo` accounts; mobile QA verified on public screens @390px. Remaining: authed-flow mobile QA, happy-path load test, Sentry wiring |

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
- **2026-05-30 (M1)** — Owner connected the Supabase MCP + provisioned env, then authorized "Apply via MCP". Migrations applied to the **live** Supabase project (`wayabroad`), superseding the earlier code-only "don't touch the live DB" guardrail.
- **2026-05-30 (M1)** — App's working typed client = **supabase-js + generated `database.types.ts`** (RLS-aware, idiomatic for Supabase+RLS).
- **2026-05-30 (post-M1)** — **Dropped Prisma entirely** (owner directive: "no prisma, we use supabase for now"). Removed `prisma/schema.prisma` and the `DATABASE_URL`/`DIRECT_URL` env vars; supabase-js + generated types is the sole data client going forward.
- **2026-05-30 (M2→M3)** — **Verified university DB integration deferred to M3** (owner choice). `verified-university-db/` has real per-field provenance (`{value, source_url, verified_on, status}`) but only **6/100 fully verified** (39 third-party, 51 pending). Swapping now would replace 50 fully-populated rows with mostly-pending ones — violating the methodology's "never show an unverified number as fact" rule. M3 will: add provenance columns, **overlay verified financials gated by status** (verified → fact + "verified on/source"; third-party → "estimate, confirm" chip; pending → keep labeled estimate), and pair it with the `probability-engine/` prototype.
- **2026-05-30 (M1)** — Data layer returns `{ data, source: "live" | "mock" }`; mock fallback when not-configured / empty / query-failed, with **loud logging** on the configured-but-failed path so a real misconfig can't hide.
- **2026-05-30 (M3 prep)** — Owner replaced the verified DB: **deleted `verified-university-db/`** and the fresh source is now **`files/universities_verified_v2.json`** (version "session-2", Top 100; record-level: 6 verified, 10 partially_verified, 35 verified_thirdparty, 49 pending_financials) + raw rank-batch pulls + `SPEC_academyinfo_tuition_pull.md`. Gitignore/tsconfig/prettier excludes repointed `verified-university-db` → `files`. The M3 overlay plan is unchanged (gate verified financials by per-field status); only the source file moved.
- **2026-05-30 (M6)** — Demo accounts via **`pnpm seed:demo`** (`scripts/seed-demo.ts`, idempotent, service-role): provisions `demo@wayabroad.app` with a complete profile + two applications (one @ `interview` with saved SOP + Study Plan, one @ `submitted`) so the dashboard/timeline demo has a reliable fallback if live sign-up / network / Claude is slow on stage. The script **tags accounts it creates** (`app_metadata.wa_demo`) and **refuses to mutate** a same-email account it didn't create — so it can't clobber a real user (Codex fix). Throwaway password is intentional and printed on run. Judge walkthrough is **`DEMO_SCRIPT.md`** (maps 1:1 to the 5 DoD steps + real-vs-simulated table + graceful fallbacks).
- **2026-05-30 (M6)** — Added production-polish primitives: `components/ui/skeleton.tsx` + route `loading.tsx` (dashboard, applications, application detail) to reserve layout during async waits; global `app/not-found.tsx` (branded 404 + CTAs), `app/error.tsx` (segment boundary), `app/global-error.tsx` (root-layout fallback); brand `app/icon.svg` favicon (fixes the lone console 404). Mobile QA @390px verified on landing/login/404 — clean, no horizontal scroll. **Note:** the running `pnpm start` must be rebuilt to pick up new `not-found`/`icon` files — a stale prod build silently serves Next's defaults.
- **2026-05-30 (M5)** — Status flow is a **5-stage server-side state machine** (draft → submitted → under_review → interview → decision). The student submits; everything past that is a **clearly-labeled simulated admin step** for the demo (plan §5: "fake the plumbing"). Transitions are **compare-and-set** (`update … .eq("status", from)`) so a direct POST can neither regress status nor overshoot `decision`, and concurrent transitions are safe. `advanceApplicationStatus` computes the next stage **server-side** (never trusts a posted target).
- **2026-05-30 (M5)** — Nav is **auth-aware**: signed-in → Dashboard/Shortlist/Applications/Universities; signed-out → Free check/Universities (keeps the no-login funnel prominent). Post-login lands on **/dashboard** (the mission-tracker hub); onboarding still → /shortlist.
- **2026-05-30 (M5)** — Email notifications kept as a **stub** (`lib/email/notifications.ts`): logs in dev, no real send. `RESEND_API_KEY` is set but deliberately **not wired** to avoid surprise sends during the demo — call sites already pass everything needed to enable it later. (See open question.)
- **2026-05-30 (M1)** — RLS: reference tables are **public-read with no write policies** (writes only via service role); `students`/`applications`/`documents` are **strict own-data** via `(select auth.uid())`. `database/schema.sql` mirrored verbatim for reference tables.

## Open questions

- Confirm whether to set up a GitHub remote + Vercel project when ready (currently local-only, no push).
- Resend (email) is stubbed (`lib/email/notifications.ts`) — confirm whether real sends are wanted for the demo before wiring the API call.
- Security advisor flags a **pre-existing** `public.rls_auto_enable()` SECURITY DEFINER function (not created by us) as anon/authenticated-executable. Decide whether to harden it (revoke EXECUTE or switch to SECURITY INVOKER). Not touched — it isn't ours.
- PostHog key not set (host is) — funnel events no-op until M3 wiring + key.

## Codex review summaries

_(One short paragraph per review — accepted vs. rejected issues and why.)_

- **M0 — two Codex passes, all findings accepted, none rejected.** _Review #1 (hygiene/secrets):_
  broadened the env ignore to `.env*` + `!.env.example`, broadened the coursework ignore,
  ignored `.claude/settings.local.json`, reworded PROGRESS to separate decisions from done
  work, and deferred `README.md` until the scaffold existed so it wasn't misleading.
  _Review #2 (scaffold):_ made `lib/env.ts` parse per-field with `.catch` so one bad value no
  longer silently flips `MOCK_DATA`; set `metadataBase` from `APP_URL`; made the PostHog stub
  warn when a key is set but the SDK isn't wired yet; trimmed whitespace in every
  `IS_*_CONFIGURED` check; corrected the README's test-coverage wording; and replaced the
  placeholder's disabled CTA buttons with an accessible link + status text. Independently
  verified no server-secret names appear in `.next/static` and that `env.server` is never
  imported client-side.
- **M1 — one Codex pass (schema/RLS + data layer), accepted 3 of 4, rejected 1 with justification.**
  Codex confirmed RLS isolation is correct, the service-role key is strictly server-side, and
  reference tables are public-read-only. _Accepted:_ (Medium) the data layer now distinguishes
  not-configured / empty / query-failed and logs the failure path **loudly** instead of silently
  masking a misconfig; (Low) Prisma UUID PKs use `dbgenerated("gen_random_uuid()")` to mirror the
  SQL exactly (now moot — Prisma was removed post-M1); (Low) the seed comment no longer overstates convergence and logs the target host.
  _Rejected:_ adding `server-only` to `lib/data/mock.ts` — it's pure, secret-free sample data
  meant to be importable anywhere; the secret-bearing modules are already guarded.
- **M2 (design foundation) — Codex a11y/contrast pass, accepted all.** Retuned `success`/`warning`
  tokens for AA contrast (dark-mode warning badge; white-on-emerald solid); added focus rings to
  footer + mobile-nav links; `input` → `h-11` + `text-base md:text-sm` (touch + no iOS focus-zoom);
  the data badge now names live/sample state (no color-only meaning); `aria-controls` on the menu
  toggle. RSC/client boundaries and semantic-token usage confirmed clean.
- **M2 (auth) — Codex security pass.** Confirmed the @supabase/ssr cookie/session pattern, RSC
  cookie-write handling, `getUser` (not `getSession`) for header state, and the service-role
  secret boundary are all correct. Fixed: **open redirect** in the OAuth callback `next` param
  (High); generic login error (no account-existence disclosure) + zod validation (Low ×2).
- **M2 (assistant) — Codex pass on matching/profile/data.** Confirmed own-row RLS posture is
  correct. Accepted all: per-test **language-score validation** (High — unbounded scores were
  faking perfect matches), grad-vs-UG tuition source, **hard degree filter** (honest counts),
  React `cache()` to dedupe the detail double-fetch, loud programs-query error, and
  `aria-describedby` hint association. Added cost-fallback + hard-filter unit tests (12 total).
- **Note:** bumped `@supabase/ssr` 0.5→0.7 (0.5/0.6 bundled an older supabase-js whose generics
  made the typed `students` upsert resolve to `never`).
- **M3 (engine + funnel) — Codex stats/security pass, all accepted.** Confirmed the free check
  persists nothing, returns a serializable result, never shows a bare % (band+drivers+disclaimer),
  and has clean RLS/secrets. Fixed: TOEFL requirement mapping (High), strict free-check validation
  incl. per-test score bounds (High), **TOPIK no longer silently satisfies an English requirement**
  → treated as unconfirmed (High), headline de-emphasized when ineligible, ARIA live-region for the
  async result, university-lookup error capture. Engine ported faithfully from the owner's
  `probability-engine/` prototype; 9 engine tests (21 total).
- **M4 (document generator) — Codex Claude-integration + RLS pass.** Confirmed no IDOR, RLS
  correctly scopes applications/documents to the user, `ANTHROPIC_API_KEY` stays server-side,
  typed error handling, mock clearly labeled. Fixed: **retry-on-unique-conflict** for document
  versions (High) and applications (Medium) backed by new unique indexes; **prompt-injection
  framing** of profile values as untrusted data (Medium); docx export error/disabled state +
  textarea `maxLength` (Low). Generation verified against the live API (grounded SOP with
  `[bracketed]` placeholders, no fabricated facts).
- **M5 (dashboard + status flow) — Codex state-machine/RLS pass, both findings accepted.**
  Confirmed no IDOR (actions read/write through the user-scoped client; `advanceApplicationStatus`
  computes the next stage server-side rather than trusting a posted target). Fixed: (High)
  `submitApplication` could be POSTed directly with any owned application's id to **regress** an
  `under_review`/`interview`/`decision` row back to `submitted` — now a **compare-and-set** that
  only fires from `draft`; (Medium) a stale/concurrent `advance` could write a previously-computed
  target and regress status — the update now compares against the `from` status read in the same
  action (`update … .eq("student_id", user.id).eq("status", from)`), so a precondition-failed
  transition is a safe no-op. `transition` returns early when nothing changed (no misleading email).
- **M6 (polish + demo hardening) — Codex review of the demo seed + error boundaries, both findings accepted.**
  Confirmed no committed real secret (the demo password is an intentional throwaway), the App-Router
  error boundaries are correct (`error.tsx` client, `global-error.tsx` renders its own html/body), and
  the loading skeletons match their page layouts. Fixed: (Medium) the demo seed could **overwrite a real
  account** sharing the demo email — now it tags accounts it creates (`app_metadata.wa_demo`) and aborts
  rather than mutate an unmarked user; (Low) document/application writes **silently swallowed errors** so
  it could print "Done" on a partial seed — they now throw. Verify green: typecheck, lint, 21 tests, build.
