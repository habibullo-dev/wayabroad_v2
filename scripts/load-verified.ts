/**
 * Load the verified-DB overlay into Supabase (M3).
 *
 *   pnpm load:verified
 *
 * Reads files/universities_verified_v2.json, normalizes each record's per-field financial
 * provenance, matches it to an existing universities row by name (+ a few short-name aliases),
 * and writes the result to the nullable `universities.verified` JSONB column via service role.
 * Idempotent: it only sets that one column, leaving the existing estimate columns untouched.
 *
 * The written shape matches `VerifiedOverlay` in lib/data/verified.ts — keep them in sync.
 * Requires NEXT_PUBLIC_SUPABASE_URL + SUPABASE_SERVICE_ROLE_KEY in .env. Run `pnpm seed` first.
 */
import "dotenv/config";
import { readFileSync } from "node:fs";
import { join } from "node:path";

import { createClient } from "@supabase/supabase-js";

import type { Database } from "../lib/db/database.types";

const KRW_PER_USD = 1370; // mirror of lib/config.ts

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
if (!url || !serviceKey) {
  console.error(
    "[load:verified] Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY in .env. Nothing written.",
  );
  process.exit(1);
}
const supabase = createClient<Database>(url, serviceKey, {
  auth: { persistSession: false },
});

/** Gentle, collision-safe normalization: keep distinguishing words, drop only noise. */
function norm(name: string): string {
  return name
    .toLowerCase()
    .replace(/\(.*?\)/g, " ") // drop "(HUFS)", "(SKKU)", …
    .replace(/&/g, " and ")
    .replace(/[^a-z0-9 ]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

/** Verified short-name records → the normalized full name of the matching live row. */
const ALIASES: Record<string, string> = {
  postech: "pohang university of science and technology",
  unist: "ulsan national institute of science and technology",
};

type Num = number | null;
type RawField = {
  value?: unknown;
  status?: string;
  source_url?: string | null;
  verified_on?: string | null;
  note?: string | null;
} | null;

function toInt(n: unknown): Num {
  return typeof n === "number" && Number.isFinite(n) ? Math.round(n) : null;
}

// Plausible band for a per-SEMESTER KRW tuition figure. Excludes USD values (thousands),
// small fees (entrance/misc/admission, <1M), and per-YEAR averages (caught by key, below).
const KRW_MIN = 1_000_000;
const KRW_MAX = 12_000_000;
// Keys whose numbers are NOT a per-semester KRW tuition figure to be displayed.
const SKIP_KEY =
  /usd|fee|entrance|misc|admission|one_time|per_year|annual|sticker|effective|visiting|basis/;

/**
 * Recursively gather per-semester KRW tuition figures from the heterogeneous `value`
 * (number | [min,max] | nested by_field/by_college/track maps). Also detects a full
 * international waiver (effective_for_admitted_intl: 0) and a per-semester USD hint.
 */
function walkTuition(
  node: unknown,
  key: string,
  acc: number[],
  flags: { waiver: boolean; usdSem: Num },
  blocked: boolean,
): void {
  const k = key.toLowerCase();
  if (typeof node === "number") {
    if (k.includes("effective") && node === 0) flags.waiver = true;
    if (
      /usd/.test(k) &&
      /sem|approx|sticker/.test(k) &&
      node > 0 &&
      node < 100_000
    ) {
      flags.usdSem = flags.usdSem ?? Math.round(node);
    }
    if (blocked || SKIP_KEY.test(k)) return;
    if (Number.isFinite(node) && node >= KRW_MIN && node <= KRW_MAX) {
      acc.push(Math.round(node));
    }
    return;
  }
  // Block the whole subtree under a skip-key so nested per-year / USD / fee figures
  // (e.g. `{ annual: { min, max } }`) can never be mistaken for a per-semester KRW value.
  const childBlocked = blocked || SKIP_KEY.test(k);
  if (Array.isArray(node)) {
    for (const x of node) walkTuition(x, key, acc, flags, childBlocked);
    return;
  }
  if (node && typeof node === "object") {
    for (const [ck, cv] of Object.entries(node as Record<string, unknown>)) {
      walkTuition(cv, ck, acc, flags, childBlocked);
    }
  }
}

function tuitionKrw(value: unknown): {
  min: Num;
  max: Num;
  mid: Num;
  usdHint: Num;
  waiver: boolean;
} {
  const acc: number[] = [];
  const flags = { waiver: false, usdSem: null as Num };
  walkTuition(value, "value", acc, flags, false);
  if (acc.length === 0) {
    // No usable per-semester figure: a full waiver reads as 0; otherwise unknown.
    if (flags.waiver)
      return { min: 0, max: 0, mid: 0, usdHint: 0, waiver: true };
    return {
      min: null,
      max: null,
      mid: null,
      usdHint: flags.usdSem,
      waiver: false,
    };
  }
  const min = Math.min(...acc);
  const max = Math.max(...acc);
  return {
    min,
    max,
    mid: Math.round((min + max) / 2),
    usdHint: flags.usdSem,
    waiver: flags.waiver,
  };
}

function tuitionOverlay(field: RawField) {
  if (!field) return null;
  const { min, max, mid, usdHint, waiver } = tuitionKrw(field.value);
  const note =
    waiver && field.note && !/waiver/i.test(field.note)
      ? `Full tuition waiver for admitted international students. ${field.note}`
      : (field.note ??
        (waiver
          ? "Full tuition waiver for admitted international students."
          : null));

  if (mid == null && usdHint == null) {
    // No usable number — keep provenance but no figure.
    return {
      krw_min: null,
      krw_max: null,
      krw_per_semester: null,
      usd_per_year: null,
      status: field.status ?? "pending",
      source_url: field.source_url ?? null,
      verified_on: field.verified_on ?? null,
      note,
    };
  }
  const usdPerYear =
    usdHint != null
      ? usdHint * 2
      : mid != null
        ? Math.round((mid * 2) / KRW_PER_USD)
        : null;
  return {
    krw_min: min,
    krw_max: max,
    krw_per_semester: mid,
    usd_per_year: usdPerYear,
    status: field.status ?? "pending",
    source_url: field.source_url ?? null,
    verified_on: field.verified_on ?? null,
    note,
  };
}

function scholarshipsOverlay(field: RawField) {
  if (!field) return null;
  const text = typeof field.value === "string" ? field.value : null;
  if (!text) return null;
  return {
    text,
    status: field.status ?? "pending",
    source_url: field.source_url ?? null,
    verified_on: field.verified_on ?? null,
    note: field.note ?? null,
  };
}

function appFeeOverlay(field: RawField) {
  if (!field) return null;
  const krw = typeof field.value === "number" ? toInt(field.value) : null;
  if (krw == null) return null;
  return {
    krw,
    status: field.status ?? "pending",
    source_url: field.source_url ?? null,
    verified_on: field.verified_on ?? null,
    note: field.note ?? null,
  };
}

interface VerifiedRecord {
  rank?: number;
  name: string;
  verification_status?: string;
  official_site?: string | null;
  intl_admissions?: string | null;
  undergrad_tuition_krw_per_semester?: RawField;
  undergrad_tuition_per_semester?: RawField; // stray alt key on 1 record
  scholarships?: RawField;
  application_fee_krw?: RawField;
}

async function main() {
  console.log(`[load:verified] target: ${new URL(url!).host}`);

  const file = join(process.cwd(), "files", "universities_verified_v2.json");
  const dataset = JSON.parse(readFileSync(file, "utf8")) as {
    universities: VerifiedRecord[];
  };

  const { data: live, error: liveError } = await supabase
    .from("universities")
    .select("id, name");
  if (liveError || !live) {
    throw new Error(`could not load universities: ${liveError?.message}`);
  }
  const liveByNorm = new Map(live.map((u) => [norm(u.name), u.id]));

  let matched = 0;
  const unmatched: string[] = [];

  for (const rec of dataset.universities) {
    const key = norm(rec.name);
    const id = liveByNorm.get(key) ?? liveByNorm.get(ALIASES[key] ?? "");
    if (!id) {
      unmatched.push(rec.name);
      continue;
    }

    const overlay = {
      rank: rec.rank ?? null,
      status: rec.verification_status ?? "pending",
      official_site: rec.official_site ?? rec.intl_admissions ?? null,
      tuition_ug: tuitionOverlay(
        rec.undergrad_tuition_krw_per_semester ??
          rec.undergrad_tuition_per_semester ??
          null,
      ),
      scholarships: scholarshipsOverlay(rec.scholarships ?? null),
      application_fee: appFeeOverlay(rec.application_fee_krw ?? null),
    };

    const { error } = await supabase
      .from("universities")
      .update({ verified: overlay })
      .eq("id", id);
    if (error) {
      throw new Error(`update failed for ${rec.name}: ${error.message}`);
    }
    matched++;
  }

  console.log(
    `[load:verified] wrote overlay to ${matched} universities; ` +
      `${unmatched.length} verified records had no live row (not in the app yet).`,
  );
  if (unmatched.length) {
    console.log(`[load:verified] unmatched (skipped): ${unmatched.join(", ")}`);
  }
}

main().catch((err) => {
  console.error("[load:verified] failed:", err);
  process.exit(1);
});
