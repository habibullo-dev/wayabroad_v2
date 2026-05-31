import { z } from "zod";

import type { WebSearchValidator } from "@/lib/validation/web-search";

/**
 * Field schemas + prompts for the web-search validator. Each prompt asks for ONE current,
 * citable figure for a university and demands strict JSON with a real source_url — instructing
 * the model to return null rather than guess. lib/validation/web-search.ts validates the JSON
 * against these schemas; scripts/validate-data.ts maps the results into the verified overlay.
 */

const PROVENANCE = {
  source_url: z.string().url().nullable(),
  source_date: z.string().nullable(),
  confidence: z.number().min(0).max(1),
  note: z.string().nullable().optional(),
};

const num = () => z.number().nullable();

export const tuitionSchema = z.object({
  krw_min: num(),
  krw_max: num(),
  krw_per_semester: num(),
  ...PROVENANCE,
});
export const dormSchema = z.object({ krw_per_semester: num(), ...PROVENANCE });
export const livingSchema = z.object({ usd_per_month: num(), ...PROVENANCE });
export const appFeeSchema = z.object({ krw: num(), ...PROVENANCE });
export const requirementsSchema = z.object({
  topik_min: num(),
  ielts_min: num(),
  toefl_ibt_min: num(),
  deadline_text: z.string().nullable(),
  ...PROVENANCE,
});
export const rankingSchema = z.object({
  qs_world: z.string().nullable(),
  ...PROVENANCE,
});
export const acceptanceSchema = z.object({
  rate_pct: num(),
  intl_rate_pct: num(),
  ...PROVENANCE,
});

const JSON_RULES =
  "Use reputable sources (the university's official site is best; well-known aggregators/news are acceptable). " +
  "Include the exact source_url you actually used. If you cannot find a figure with a real citation, set its " +
  "numeric fields and source_url to null and confidence to 0. Reply with ONLY minified JSON, no prose.";

function tuitionPrompt(name: string): string {
  return `Find ${name} (South Korea) undergraduate tuition for international students, most recent year, per semester in KRW. If it varies by college, give krw_min, krw_max and a representative krw_per_semester (midpoint). ${JSON_RULES} Shape: {"krw_min":<n|null>,"krw_max":<n|null>,"krw_per_semester":<n|null>,"source_url":<string|null>,"source_date":<string|null>,"confidence":<0..1>,"note":<string>}`;
}
function dormPrompt(name: string): string {
  return `Find ${name} (South Korea) on-campus dormitory cost per semester in KRW for a typical room. ${JSON_RULES} Shape: {"krw_per_semester":<n|null>,"source_url":<string|null>,"source_date":<string|null>,"confidence":<0..1>,"note":<string>}`;
}
function livingPrompt(name: string, city: string): string {
  return `Estimate a student's monthly living cost (excluding tuition and dorm) in ${city || "the university's city"}, South Korea — for ${name} — in USD. ${JSON_RULES} Shape: {"usd_per_month":<n|null>,"source_url":<string|null>,"source_date":<string|null>,"confidence":<0..1>,"note":<string>}`;
}
function appFeePrompt(name: string): string {
  return `Find ${name} (South Korea) undergraduate application fee in KRW for international applicants. ${JSON_RULES} Shape: {"krw":<n|null>,"source_url":<string|null>,"source_date":<string|null>,"confidence":<0..1>,"note":<string>}`;
}
function requirementsPrompt(name: string): string {
  return `Find ${name} (South Korea) undergraduate international-admission requirements: minimum TOPIK level (1-6) for Korean-taught programs, minimum IELTS and minimum TOEFL iBT for English-taught programs, and the main application deadline. ${JSON_RULES} Shape: {"topik_min":<n|null>,"ielts_min":<n|null>,"toefl_ibt_min":<n|null>,"deadline_text":<string|null>,"source_url":<string|null>,"source_date":<string|null>,"confidence":<0..1>,"note":<string>}`;
}
function rankingPrompt(name: string): string {
  return `Find ${name} (South Korea) most recent QS World University Ranking (a number or a band like "501-510"). ${JSON_RULES} Shape: {"qs_world":<string|null>,"source_url":<string|null>,"source_date":<string|null>,"confidence":<0..1>,"note":<string>}`;
}
function acceptancePrompt(name: string): string {
  return `Find ${name} (South Korea) admission selectivity: overall acceptance rate (%) and, if published, the international-applicant acceptance/admission rate (%). ${JSON_RULES} Shape: {"rate_pct":<n|null>,"intl_rate_pct":<n|null>,"source_url":<string|null>,"source_date":<string|null>,"confidence":<0..1>,"note":<string>}`;
}

export interface ValidatedUniversity {
  tuition: z.infer<typeof tuitionSchema> | null;
  dorm: z.infer<typeof dormSchema> | null;
  living: z.infer<typeof livingSchema> | null;
  appFee: z.infer<typeof appFeeSchema> | null;
  requirements: z.infer<typeof requirementsSchema> | null;
  ranking: z.infer<typeof rankingSchema> | null;
  acceptance: z.infer<typeof acceptanceSchema> | null;
}

/** Run every field-group extraction for one university (sequential, for rate-limit safety). */
export async function validateUniversity(
  uni: { name: string; city: string | null },
  v: WebSearchValidator,
): Promise<ValidatedUniversity> {
  const name = uni.name;
  const city = uni.city ?? "";
  return {
    tuition: await v.extract(
      tuitionPrompt(name),
      tuitionSchema,
      `${name}:tuition`,
    ),
    dorm: await v.extract(dormPrompt(name), dormSchema, `${name}:dorm`),
    living: await v.extract(
      livingPrompt(name, city),
      livingSchema,
      `${name}:living`,
    ),
    appFee: await v.extract(appFeePrompt(name), appFeeSchema, `${name}:appFee`),
    requirements: await v.extract(
      requirementsPrompt(name),
      requirementsSchema,
      `${name}:requirements`,
    ),
    ranking: await v.extract(
      rankingPrompt(name),
      rankingSchema,
      `${name}:ranking`,
    ),
    acceptance: await v.extract(
      acceptancePrompt(name),
      acceptanceSchema,
      `${name}:acceptance`,
    ),
  };
}
