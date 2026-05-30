/**
 * WayAbroad — Admission Probability Engine (v1)
 * -----------------------------------------------------------------------------
 * The "killer feature": given a student profile + a program, return an EXPLAINABLE
 * admission probability with a confidence band and the drivers behind it. Pure,
 * dependency-free, unit-tested.
 *
 * Design (Development Plan §6.1): an honest, explainable model — NOT a black box. A
 * rules-based prior (program selectivity + GPA + language fit) is blended with empirical
 * admission outcomes via Bayesian shrinkage, so the score starts sensible with little data
 * and sharpens as real outcomes accumulate.
 *
 * Ported from the owner's probability-engine/ prototype; extended to handle a student who
 * hasn't entered a language test yet (no hard gate applied, flagged as unconfirmed).
 *
 * NEVER render a bare percentage — always show the band + drivers.
 */

export type LangTest = "IELTS" | "TOEFL" | "TOPIK";
export type TierBand = "elite" | "strong" | "mid" | "regional";

export interface StudentProfile {
  gpa: number; // normalized to a 4.0 scale
  langTest: LangTest | null;
  langScore: number | null; // IELTS 0-9, TOEFL iBT 0-120, or TOPIK level 1-6
}

export interface ProgramInfo {
  name?: string;
  language: "English" | "Korean";
  minGpa: number; // on 4.0 scale
  minIelts?: number | null;
  minToefl?: number | null;
  minTopik?: number | null;
  tierBand?: TierBand;
}

export interface AdmissionRecord {
  applicantGpa: number;
  langTest: string;
  langScore: number;
  outcome: "admit" | "reject";
}

export interface Driver {
  factor: string;
  impact: "positive" | "negative" | "neutral";
  detail: string;
}

export interface ProbabilityResult {
  percent: number; // 0-100, the headline number
  band: [number, number]; // confidence interval in percent
  confidence: "low" | "moderate" | "high";
  eligible: boolean; // language confirmed+met AND GPA within 0.3 of the minimum (borderline ok)
  languageConfirmed: boolean; // false when no test is on file
  drivers: Driver[];
  sampleSize: number; // # of comparable records used
  disclaimer: string;
}

// Prior admit-rate by selectivity tier (used before/with empirical data).
const TIER_BASE: Record<TierBand, number> = {
  elite: 0.3,
  strong: 0.5,
  mid: 0.68,
  regional: 0.82,
};

const clamp = (x: number, lo: number, hi: number) =>
  Math.max(lo, Math.min(hi, x));

interface LangFit {
  met: boolean;
  margin: number;
  note: string;
  unknown: boolean;
}

function languageFit(student: StudentProfile, program: ProgramInfo): LangFit {
  if (student.langTest == null || student.langScore == null) {
    return { met: false, margin: 0, note: "no test on file", unknown: true };
  }
  const score = student.langScore;
  if (program.language === "Korean") {
    const min = program.minTopik ?? 3;
    const lvl = student.langTest === "TOPIK" ? score : 0;
    return {
      met: lvl >= min,
      margin: lvl - min,
      note: `TOPIK ${lvl || "—"} vs required ${min}`,
      unknown: false,
    };
  }
  // English-taught
  if (student.langTest === "IELTS") {
    const min = program.minIelts ?? 6.0;
    return {
      met: score >= min,
      margin: score - min,
      note: `IELTS ${score} vs required ${min}`,
      unknown: false,
    };
  }
  if (student.langTest === "TOEFL") {
    const min = program.minToefl ?? 80;
    return {
      met: score >= min,
      margin: (score - min) / 10,
      note: `TOEFL ${score} vs required ${min}`,
      unknown: false,
    };
  }
  // Student has TOPIK but the program is English-taught — TOPIK can't confirm an English
  // requirement, so treat language as UNCONFIRMED (no hard gate, but not counted as met).
  return {
    met: false,
    margin: 0,
    note: `TOPIK ${score} on file, but this program needs English proof (IELTS/TOEFL)`,
    unknown: true,
  };
}

/** Core scoring function. Pure and deterministic. */
export function scoreAdmission(
  student: StudentProfile,
  program: ProgramInfo,
  records: AdmissionRecord[] = [],
): ProbabilityResult {
  const drivers: Driver[] = [];
  const tier = program.tierBand ?? "mid";

  // --- 1. Language eligibility ---
  const lang = languageFit(student, program);
  if (lang.unknown) {
    drivers.push({
      factor: "Language proficiency",
      impact: "neutral",
      detail:
        "No language test on file yet — add one to confirm eligibility and sharpen this estimate.",
    });
  } else if (lang.met) {
    drivers.push({
      factor: "Language proficiency",
      impact:
        lang.margin >= (program.language === "Korean" ? 1 : 0.5)
          ? "positive"
          : "neutral",
      detail: `Meets requirement (${lang.note}).`,
    });
  } else {
    drivers.push({
      factor: "Language proficiency",
      impact: "negative",
      detail: `Below requirement (${lang.note}). This is usually a hard gate — improving it most increases your odds.`,
    });
  }

  // --- 2. GPA fit ---
  const gpaMargin = student.gpa - program.minGpa;
  drivers.push({
    factor: "Academic record (GPA)",
    impact:
      gpaMargin >= 0.2 ? "positive" : gpaMargin < 0 ? "negative" : "neutral",
    detail: `Your GPA ${student.gpa.toFixed(2)} vs program minimum ${program.minGpa.toFixed(2)} (margin ${gpaMargin >= 0 ? "+" : ""}${gpaMargin.toFixed(2)}).`,
  });

  // --- 3. Rules-based prior (academic only; hard gates applied AFTER the blend) ---
  let prior = TIER_BASE[tier];
  prior += clamp(gpaMargin * 0.35, -0.4, 0.4);
  prior = clamp(prior, 0.03, 0.97);
  drivers.push({
    factor: "Program selectivity",
    impact:
      tier === "elite"
        ? "negative"
        : tier === "regional"
          ? "positive"
          : "neutral",
    detail: `${tier[0]!.toUpperCase() + tier.slice(1)}-tier program (baseline admit rate ~${Math.round(TIER_BASE[tier] * 100)}%).`,
  });

  // --- 4. Empirical blend (Bayesian shrinkage toward the prior) ---
  const comparable = records.filter(
    (r) => Math.abs(r.applicantGpa - student.gpa) <= 0.4,
  );
  const n = comparable.length;
  let posterior = prior;
  if (n > 0) {
    const admits = comparable.filter((r) => r.outcome === "admit").length;
    const empirical = admits / n;
    const k = 8; // pseudo-count: how much to trust the prior vs the data
    posterior = (prior * k + empirical * n) / (k + n);
    drivers.push({
      factor: "Outcomes of similar applicants",
      impact:
        empirical >= prior + 0.05
          ? "positive"
          : empirical <= prior - 0.05
            ? "negative"
            : "neutral",
      detail: `${admits}/${n} applicants with a similar GPA were admitted (${Math.round(empirical * 100)}%).`,
    });
  }

  // --- 4b. Hard gates (applied last so they dominate the empirical pull) ---
  if (!lang.unknown && !lang.met) posterior *= 0.25;
  if (gpaMargin < -0.3) posterior *= 0.6;
  posterior = clamp(posterior, 0.03, 0.97);

  // --- 5. Confidence & band from sample size (wider when language is unconfirmed) ---
  let confidence: ProbabilityResult["confidence"];
  let half: number;
  if (n >= 15) {
    confidence = "high";
    half = 6;
  } else if (n >= 5) {
    confidence = "moderate";
    half = 10;
  } else {
    confidence = "low";
    half = 15;
  }
  if (lang.unknown) {
    confidence = confidence === "high" ? "moderate" : "low";
    half += 5;
  }

  const percent = Math.round(posterior * 100);
  const band: [number, number] = [
    clamp(percent - half, 1, 99),
    clamp(percent + half, 1, 99),
  ];

  return {
    percent,
    band,
    confidence,
    eligible: !lang.unknown && lang.met && gpaMargin >= -0.3,
    languageConfirmed: !lang.unknown,
    drivers,
    sampleSize: n,
    disclaimer:
      "Estimate based on your profile and available admission data — not a guarantee or an official decision. " +
      (n === 0
        ? "No comparable outcome data yet, so this is a model-based estimate. "
        : "") +
      "Always confirm requirements with the university.",
  };
}
