# WayAbroad — Admission Probability Engine

The explainable scoring function behind your headline feature: enter a profile, get a probability with a confidence band and the reasons why. Pure TypeScript, no dependencies — drop it into a Next.js route or server action.

## Files

| File | What |
|---|---|
| `scoreAdmission.ts` | The engine: types + the `scoreAdmission()` function. This is the deliverable. |
| `demo.ts` | Smoke test — scores sample students against a real seeded program. |
| `package.json` | Just `{"type":"module"}` so Node runs the `.ts` files directly. |

## Run the demo

```bash
node demo.ts        # Node 22+ strips the TS types automatically
```

## How it works (and why it's honest)

It is **not** a black box. The score is a blend of two things:

1. **A rules-based prior** — program selectivity (tier) adjusted by the applicant's GPA margin over the program minimum.
2. **Empirical outcomes** — the admit rate among past applicants with a similar GPA, blended in via **Bayesian shrinkage** (a pseudo-count `k=8`). With little data the prior dominates; as real outcomes accumulate, the data takes over. This is exactly the data moat from the business plan: the engine literally gets smarter with every real outcome you record.

Then two **hard gates** are applied last, so they dominate: failing the language requirement, or sitting well below the GPA minimum, sharply reduces the score regardless of what the empirical data says.

Every result returns:

- `percent` — the headline number
- `band` — a confidence interval (wider when there's less data)
- `confidence` — `low` / `moderate` / `high`, driven by sample size
- `eligible` — whether hard minimums are met
- `drivers` — the human-readable factors behind the score (show these in the UI)
- `disclaimer` — it's an estimate, not a decision

> **Never render a bare percentage.** Always show the band + drivers. That transparency is the whole point — it's what makes the number trustworthy instead of a gimmick.

## Integrate into the app

```ts
import { scoreAdmission } from "@/lib/scoreAdmission";

const result = scoreAdmission(
  { gpa: 3.8, langTest: "IELTS", langScore: 7.0 },
  { language: "English", minGpa: 3.6, minIelts: 6.0, tierBand: "elite" },
  admissionRecordsForThisProgram // from Supabase; [] is fine to start
);
// → { percent: 43, band: [33,53], confidence: "moderate", drivers: [...], ... }
```

The `records` argument maps directly to the `admission_records` table (see `../database/schema.sql`). It works with `[]` (pure model estimate, low confidence) and improves as you replace the synthetic seed rows with real outcomes.

## From seed to real (the upgrade path)

- **Now:** runs on the synthetic seed records in `../database/` — clearly labeled, good enough to build and demo.
- **Next:** as students report outcomes, insert real rows into `admission_records`. No code change needed — the same function just gets more accurate and more confident.
- **Later (Phase 2):** when you have a few hundred real outcomes per popular program, swap the internals for a trained logistic-regression / gradient-boosted model behind the same interface. Nothing downstream changes.

## Tested behavior (from `demo.ts`, SNU CS — elite, min GPA 3.6, min IELTS 6)

| Applicant | GPA | IELTS | Result |
|---|---|---|---|
| Strong | 3.8 | 7.0 | **43%** (eligible) |
| Borderline | 3.1 | 6.0 | **13%** (below GPA min) |
| Below language bar | 3.6 | 5.0 | **10%** (fails hard language gate) |

Ordering is monotonic and the hard gates dominate — the engine behaves the way a student would expect.
