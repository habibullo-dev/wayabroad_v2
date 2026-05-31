/**
 * AI web-search data validator (M3+). Validates each university's published numbers against the
 * live web via OpenAI, and writes cited, auto-published *estimate*-tier values into the
 * `universities.verified` overlay. Per the design spec:
 *   docs/superpowers/specs/2026-05-31-ai-data-validation-and-calculator-design.md
 *
 *   pnpm validate:data <slug> [slug…]     # validate specific universities (pilot)
 *   pnpm validate:data --all              # validate all 50 (≈350 web-search calls)
 *
 * Requires NEXT_PUBLIC_SUPABASE_URL + SUPABASE_SERVICE_ROLE_KEY + OPENAI_API_KEY in .env.
 *
 * Guarantees: every written number carries a real source_url (uncited values are dropped); all
 * AI data is tagged status "ai_web" → renders as a labeled estimate, never green "verified".
 * Merge rule: a field already tagged `verified_official` (human-verified) is NOT overwritten —
 * the script flags a discrepancy instead. The before/after diff is printed for every change.
 */
import "dotenv/config";
import { writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";

import { createClient } from "@supabase/supabase-js";

import type { Database, Json as DbJson } from "../lib/db/database.types";
import { validateUniversity } from "../lib/validation/fields";
import { createOpenAiValidator } from "../lib/validation/web-search";

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
const openaiKey = process.env.OPENAI_API_KEY;
const model = process.env.OPENAI_MODEL?.trim() || "gpt-5";

if (!url || !serviceKey || !openaiKey) {
  console.error(
    "[validate:data] Missing one of NEXT_PUBLIC_SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, OPENAI_API_KEY in .env. Nothing ran.",
  );
  process.exit(1);
}

const KRW_PER_USD = 1370; // mirror of lib/config.ts
const TODAY = new Date().toISOString().slice(0, 10);
const STATUS = "ai_web";

const args = process.argv.slice(2);
const all = args.includes("--all");
const slugs = args.filter((a) => !a.startsWith("--"));
if (!all && slugs.length === 0) {
  console.error(
    "[validate:data] Pass university slug(s), or --all for every university.\n" +
      "  e.g. pnpm validate:data korea-university seoul-national-university",
  );
  process.exit(1);
}

const supabase = createClient<Database>(url, serviceKey, {
  auth: { persistSession: false },
});

type Sourced = {
  source_url: string | null;
  source_date: string | null;
  note?: string | null;
};
type Json = Record<string, unknown>;

/** A field is written only when it has a usable value AND a real source URL. */
function sourced(s: Sourced, extra: Json): Json | null {
  if (!s.source_url) return null;
  if (!Object.values(extra).some((x) => x != null)) return null; // citation but no value → skip
  return {
    ...extra,
    status: STATUS,
    source_url: s.source_url,
    verified_on: TODAY,
    note: s.note ?? null,
  };
}

function n(v: number | null | undefined): number | null {
  return typeof v === "number" && Number.isFinite(v) ? v : null;
}

/** Short human summary of a field for the diff log. */
function summarize(field: unknown): string {
  if (!field || typeof field !== "object") return "—";
  const f = field as Json;
  const keys = [
    "krw_per_semester",
    "krw",
    "usd_per_month",
    "qs_world",
    "rate_pct",
    "intl_rate_pct",
    "topik_min",
    "ielts_min",
    "deadline_text",
  ];
  const parts = keys
    .filter((k) => f[k] != null)
    .map((k) => `${k}=${String(f[k])}`);
  return parts.length ? parts.join(" ") : "(set)";
}

async function run() {
  console.log(`[validate:data] target=${new URL(url!).host} model=${model}`);
  let q = supabase
    .from("universities")
    .select("id, name, city, slug, verified");
  if (!all) q = q.in("slug", slugs);
  const { data: unis, error } = await q.order("slug");
  if (error || !unis) {
    console.error(
      "[validate:data] could not load universities:",
      error?.message,
    );
    process.exit(1);
  }
  if (unis.length === 0) {
    console.error(
      "[validate:data] no matching universities for:",
      slugs.join(", "),
    );
    process.exit(1);
  }

  const validator = createOpenAiValidator({ apiKey: openaiKey!, model });
  const report: string[] = [
    `# AI validation run — ${TODAY} (model ${model})\n`,
  ];

  for (const uni of unis) {
    console.log(`\n▶ ${uni.name} (${uni.slug})`);
    report.push(`\n## ${uni.name} (${uni.slug})`);
    const v = await validateUniversity(
      { name: uni.name, city: uni.city },
      validator,
    );

    const existing: Json =
      uni.verified &&
      typeof uni.verified === "object" &&
      !Array.isArray(uni.verified)
        ? (uni.verified as Json)
        : {};

    // Build the AI-sourced overlay fields (null when uncited / no value).
    const candidates: Record<string, Json | null> = {
      tuition_ug: v.tuition
        ? sourced(v.tuition, {
            krw_min: n(v.tuition.krw_min),
            krw_max: n(v.tuition.krw_max),
            krw_per_semester: n(v.tuition.krw_per_semester),
            usd_per_year:
              n(v.tuition.krw_per_semester) != null
                ? Math.round((v.tuition.krw_per_semester! * 2) / KRW_PER_USD)
                : null,
          })
        : null,
      dorm: v.dorm
        ? sourced(v.dorm, { krw_per_semester: n(v.dorm.krw_per_semester) })
        : null,
      living: v.living
        ? sourced(v.living, { usd_per_month: n(v.living.usd_per_month) })
        : null,
      application_fee: v.appFee
        ? sourced(v.appFee, { krw: n(v.appFee.krw) })
        : null,
      requirements: v.requirements
        ? sourced(v.requirements, {
            topik_min: n(v.requirements.topik_min),
            ielts_min: n(v.requirements.ielts_min),
            toefl_ibt_min: n(v.requirements.toefl_ibt_min),
            deadline_text: v.requirements.deadline_text ?? null,
          })
        : null,
      ranking: v.ranking?.qs_world
        ? sourced(v.ranking, { qs_world: v.ranking.qs_world })
        : null,
      acceptance: v.acceptance
        ? sourced(v.acceptance, {
            rate_pct: n(v.acceptance.rate_pct),
            intl_rate_pct: n(v.acceptance.intl_rate_pct),
          })
        : null,
    };

    const merged: Json = { ...existing };
    for (const [key, next] of Object.entries(candidates)) {
      if (!next) continue; // AI found nothing citable — leave existing untouched
      const prev = existing[key] as Json | undefined;
      if (prev?.status === "verified_official") {
        const line = `  ! ${key}: keeping official (${summarize(prev)}); AI says ${summarize(next)} — ${next.source_url}`;
        console.log(line);
        report.push(line);
        continue; // never downgrade human-verified
      }
      const line = `  • ${key}: ${summarize(prev)} → ${summarize(next)}  [${next.source_url}]`;
      console.log(line);
      report.push(line);
      merged[key] = next;
    }
    merged.validated_on = TODAY;
    merged.validated_via = `openai:${model}`;

    const { error: upErr } = await supabase
      .from("universities")
      .update({ verified: merged as unknown as DbJson })
      .eq("id", uni.id);
    if (upErr) {
      console.error(`  ✗ update failed: ${upErr.message}`);
      report.push(`  ✗ update failed: ${upErr.message}`);
    }
  }

  const u = validator.usage();
  const summary = `\n[validate:data] done. ${unis.length} universities · ${u.calls} web-search calls · ${u.input} in + ${u.output} out tokens.`;
  console.log(summary);
  report.push(summary);

  const reportPath = join(tmpdir(), `wayabroad-validation-${TODAY}.md`);
  writeFileSync(reportPath, report.join("\n"));
  console.log(`[validate:data] diff report → ${reportPath}`);
}

run().catch((err) => {
  console.error("[validate:data] failed:", err);
  process.exit(1);
});
