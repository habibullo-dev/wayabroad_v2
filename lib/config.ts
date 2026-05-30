/**
 * App-wide constants and the mandated trust/disclaimer copy. Import these wherever the
 * guardrails apply so the wording stays consistent across every screen.
 */
export const APP_NAME = "WayAbroad";
export const APP_TAGLINE = "Your AI guide to studying in Korea";

/** Shown anywhere a number is driven by synthetic `admission_records`. */
export const SAMPLE_DATA_NOTE =
  "Based on sample data — synthetic outcomes used while we collect real admissions data.";

/** Shown anywhere a tuition / dorm / living / fee figure is displayed. */
export const COST_ESTIMATE_NOTE =
  "Estimate — confirm the latest figures with the university before relying on them.";

/** Shown on every generated document. */
export const DRAFT_DOC_NOTE =
  "Editable draft to start from — not a finished or submittable document. You are responsible for the final content.";

/** Probability scores must always ship with their drivers and a confidence band. */
export const PROBABILITY_DISCLAIMER =
  "An estimate with a confidence band, not a guarantee. See the factors behind it below.";

/** FX used by the seed dataset (database/README.md), May 2026 approx. */
export const KRW_PER_USD = 1370;
