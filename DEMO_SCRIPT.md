# WayAbroad — Judge Demo Script

A tight, ~5-minute walkthrough that proves the MVP against its
[Definition of Done](docs/WayAbroad_Development_Plan.md#L271): a brand-new visitor can,
on a live URL, go from an anonymous profile to a tracked application — with a **real**
probability score and **real** AI-drafted documents along the way.

> **Golden rule for the demo:** _demo the magic, fake the plumbing._ The probability score
> and the document generator are real. University "submission" is a simulated status flow —
> say so plainly if asked; it reads as honest, not as a gap.

---

## Before you present (setup checklist)

- [ ] App is deployed to a live URL (or `pnpm build && pnpm start` on a stable laptop + phone on the same network).
- [ ] Reference data seeded: `pnpm seed` (50 universities, 267 programs, synthetic admission records).
- [ ] Demo accounts seeded: `pnpm seed:demo` — gives you a ready-made account whose dashboard already shows an application mid-flow (fallback if live sign-up is slow). See [Demo accounts](#demo-accounts).
- [ ] Open two things: the **live site on a phone** (the hero device — judges should picture themselves using it) and the site on the **laptop/projector**.
- [ ] Have a throwaway email ready for the live sign-up, OR plan to use the pre-seeded demo account.
- [ ] Network check: run the probability check + one document generation once beforehand so any cold-start latency is already warm.
- [ ] Know your numbers: the probability score ships with a **confidence band + drivers + disclaimer** — never read it as a guarantee.

---

## The 5-step run (maps 1:1 to the Definition of Done)

### 1. The hook — free probability check, no sign-up  · ~45s
**Do:** From the landing page, tap **Free check** (or the hero CTA). Fill the quick form
(GPA, intended field, a language score) for a stretch target — e.g. **Seoul National University**.
Submit.

**Show:** A real probability result with a **band** (not a bare %), the **drivers** that moved
it, and the honest disclaimer.

**Say:** _"No account, no friction — a student gets a real, transparent read on their chances
in seconds. That's the top of our funnel."_

> Anonymous: this stores nothing. It's pure hook.

---

### 2. Sign up → ranked shortlist with transparent costs · ~60s
**Do:** Tap **Get started**, sign up with email (or _Continue with Google_). Complete the short
**onboarding profile** (GPA + scale, language test + score, budget, intended field + degree,
country).

**Show:** The **ranked shortlist** — each program card has a match indicator, the key
requirement, and an **estimated cost** carrying a clear "estimate — verify with university"
note. Point out the **"sample data"** labels: _"We never dress up an unverified number as fact."_

**Say:** _"Now it's personalized. Programs are ranked to this student, and every cost is
transparent about where it comes from."_

---

### 3. A real probability score with its drivers · ~30s
**Do:** On the shortlist (or a program), highlight the per-program **probability card**.

**Show:** Band + the specific drivers (GPA fit, language, competitiveness). 

**Say:** _"This is a real model — a rules prior blended with historical admission records and
hard eligibility gates — not a vibes number. And it always explains itself."_

---

### 4. Generate + edit an SOP and Study Plan, then download · ~90s
**Do:** From a shortlisted program, **Start application** → the application workspace. Click
**Generate draft** on the **Statement of Purpose**. While it streams, narrate. Edit a sentence
inline, **Save version**, then **Download** (.docx). Repeat the generate on the **Study Plan**
if time allows.

**Show:** A grounded first draft in the student's voice, with `[bracketed]` placeholders where
a real specific is needed — and the standing **"editable draft, not a submission"** note.
Version history and multiple export formats (.docx / .md / Print→PDF / copy).

**Say:** _"This is the second real, hard thing — Claude drafts a genuinely usable SOP grounded
in the student's profile, never fabricating awards or experience. It's a drafting aid they
personalize, and we're explicit about that."_

> This calls the live Claude API. If the network is unreliable, fall back to the pre-seeded
> demo account, which already has saved document versions.

---

### 5. The application in the dashboard, moving through statuses · ~45s
**Do:** Go to **Dashboard**. Show the **mission tracker**: the journey checklist (account →
profile → application → documents → submit) and the application's **status timeline**. Open the
application and tap **Submit application** (draft → submitted), then the **simulated advance**
control to step it forward (submitted → under review → interview → decision).

**Show:** The timeline animating forward; the checklist ticking off; the clearly-labeled
**"simulated admin step — for the demo"** caption under the advance button.

**Say:** _"And here's the mission tracker that keeps a student oriented. The status flow is
simulated for the MVP — that's the part we light up for real once we have signed university
partners feeding decisions in."_

---

## Closing line · ~15s
_"In under five minutes, a stranger went from anonymous curiosity to a tracked application —
with a real probability score and real AI-drafted documents in hand. Everything you'd need a
partner university for is stubbed honestly; everything that proves the product is real, is real.
That's the MVP."_

---

## Demo accounts

`pnpm seed:demo` provisions a small set of confirmed accounts (idempotent — safe to re-run).
Credentials and the exact pre-loaded state are printed when the script runs. Use them as a
**fallback** if live sign-up, the network, or the Claude API is slow on stage. Prefer the live
sign-up when the network is solid — watching it happen for real is more convincing.

---

## If something breaks (graceful fallbacks)

| Symptom | Fallback |
|---|---|
| Sign-up email confirmation is slow | Use a pre-seeded demo account. |
| Claude generation hangs / errors | Switch to the demo account with saved document versions; the editor + export still demo fully. |
| A page errors | The app shows a friendly error with **Try again**; reload and continue from the dashboard. |
| Live URL is down | Run `pnpm build && pnpm start` locally and present from `localhost` on the laptop. |
| Costs/probabilities look off | They're labeled estimates/synthetic on purpose — lean into the transparency, don't apologize for it. |

---

## What's real vs. simulated (be ready for this question)

| Real | Simulated / stubbed for MVP |
|---|---|
| Probability score (model + drivers + band) | University "submission" → a status flow you advance manually |
| AI document drafts (live Claude API) | Status-change email notifications (stubbed; logged, not sent) |
| Ranked shortlist + matching | Pilot-university data integrations |
| Auth, profiles, applications, document versioning (Supabase + RLS) | — |
| Transparent cost breakdowns | Cost figures are labeled **estimates** until verified |
