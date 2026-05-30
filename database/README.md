# WayAbroad University Database

A Supabase-ready dataset of **50 Korean universities**, **267 programs**, and **2,938 synthetic admission records** to bootstrap the WayAbroad MVP (matching engine, cost transparency, and probability engine).

Generated: see `wayabroad_db.json → meta.generated`.

---

## ⚠️ Read this first

- **Verify before launch.** Every tuition / dorm / living / fee figure is a *researched approximation* (grounded in uniRank 2026 + Study-in-Korea 2025/26 ranges), not a live scrape of each school. Each university row carries `verify_before_launch: true`. Confirm against each university's official international-admissions page before showing numbers to students.
- **Admission records are synthetic.** Every row in `admission_records` has `synthetic: true`. They exist only to develop and test the probability engine. Replace them with real outcomes as you collect them — that real data is your moat.
- Currency: figures use `1 USD ≈ 1,370 KRW` (approx, May 2026).

---

## Files

| File | Use |
|---|---|
| `wayabroad_db.json` | **Nested** export (universities → programs → admission_records). Best for reading / app seeding. |
| `universities_flat.json`, `programs_flat.json`, `admission_records_flat.json` | **Flat** arrays, columns match `schema.sql` 1:1. Best for table import. |
| `universities.csv`, `programs.csv`, `admission_records.csv` | Same flat data as CSV for the Supabase Table Editor importer. |
| `schema.sql` | PostgreSQL / Supabase DDL — run this first. |
| `gen_db.py` | The generator. Re-run to extend or adjust the dataset. |

---

## Import into Supabase

### Option A — SQL editor + CSV (simplest)

1. Open your Supabase project → **SQL Editor** → paste and run `schema.sql`.
2. Go to **Table Editor** → open `universities` → **Insert → Import data from CSV** → upload `universities.csv`.
3. Repeat for `programs.csv`, then `admission_records.csv` (order matters — foreign keys).

### Option B — psql + \copy

```bash
psql "$SUPABASE_DB_URL" -f schema.sql
psql "$SUPABASE_DB_URL" -c "\copy universities      FROM 'universities.csv'      CSV HEADER"
psql "$SUPABASE_DB_URL" -c "\copy programs           FROM 'programs.csv'           CSV HEADER"
psql "$SUPABASE_DB_URL" -c "\copy admission_records  FROM 'admission_records.csv'  CSV HEADER"
```

### Option C — JS seed script (Supabase client)

```js
import { createClient } from "@supabase/supabase-js";
import fs from "node:fs";
const sb = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_KEY);
const load = (f) => JSON.parse(fs.readFileSync(f, "utf8"));

await sb.from("universities").upsert(load("universities_flat.json"));
await sb.from("programs").upsert(load("programs_flat.json"));
await sb.from("admission_records").upsert(load("admission_records_flat.json"));
```
Run with the **service-role** key server-side only.

---

## Schema overview

- **universities** — institution, location, type/tier, tuition (UG/grad), dorm, fees, living cost, language requirements, scholarships.
- **programs** — per-university degrees (English- and Korean-taught), min GPA, language minimums, intake deadlines.
- **admission_records** — synthetic GPA/language → outcome rows, keyed to programs, for the probability engine.

## Using it in the probability engine

For each program, query its `admission_records`, compute the admit rate within the applicant's GPA/language band, and blend with the program's `min_gpa_4_0_scale` and tier. Start simple (weighted rules per the dev plan §6.1); swap in a trained model once you replace synthetic rows with real outcomes.

## Regenerating / extending

Edit the `UNIS` list (add rows) or the tuition/selectivity bands in `gen_db.py`, then:

```bash
python3 gen_db.py
```

This rewrites all JSON + CSV outputs deterministically (`random.seed(42)`).
