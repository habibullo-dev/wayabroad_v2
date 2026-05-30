import { describe, expect, it } from "vitest";

import type { Program, University } from "@/lib/data/types";
import {
  estimateAnnualCostUsd,
  levelFor,
  rankPrograms,
  type MatchProfile,
} from "@/lib/matching/shortlist";

function uni(
  p: Partial<University> & Pick<University, "id" | "slug" | "name">,
): University {
  return {
    city: null,
    region: null,
    country: "South Korea",
    type: null,
    tier_band: null,
    kr_rank_unirank_2026: null,
    website: null,
    intl_office_note: null,
    tuition_ug_krw_min: null,
    tuition_ug_krw_max: null,
    tuition_ug_usd_min: null,
    tuition_ug_usd_max: null,
    tuition_grad_krw_min: null,
    tuition_grad_krw_max: null,
    dorm_krw_per_semester: null,
    dorm_usd_per_semester: null,
    application_fee_krw: null,
    living_krw_per_month: null,
    living_usd_per_month: null,
    visa_cost_usd: null,
    offers_english_programs: true,
    topik_min_undergrad: null,
    topik_min_grad: null,
    english_min_ielts: null,
    english_min_toefl_ibt: null,
    scholarship_note: null,
    data_confidence: null,
    verify_before_launch: true,
    created_at: null,
    ...p,
  };
}

function prog(
  p: Partial<Program> & Pick<Program, "id" | "university_id" | "name">,
): Program {
  return {
    field: null,
    degree_level: null,
    language_of_instruction: "English",
    min_gpa_4_0_scale: null,
    topik_required_level: null,
    english_min_ielts: null,
    deadline_spring_intake: null,
    deadline_fall_intake: null,
    tuition_krw_per_semester: null,
    scholarship_notes: null,
    created_at: null,
    ...p,
  };
}

const baseProfile: MatchProfile = {
  gpa4: 3.6,
  languageTest: "IELTS",
  languageScore: 6.5,
  budgetUsd: 20000,
  field: "Engineering",
  degree: "Bachelor",
};

describe("levelFor", () => {
  it("maps scores to bands at the documented thresholds", () => {
    expect(levelFor(70)).toBe("high");
    expect(levelFor(69)).toBe("medium");
    expect(levelFor(45)).toBe("medium");
    expect(levelFor(44)).toBe("low");
  });
});

describe("estimateAnnualCostUsd", () => {
  it("sums annual tuition (KRW/sem ×2) and 12 months of living", () => {
    const u = uni({ id: 1, slug: "u", name: "U", living_usd_per_month: 1000 });
    const p = prog({
      id: 1,
      university_id: 1,
      name: "P",
      tuition_krw_per_semester: 1_370_000,
    });
    // tuition = 1,370,000 * 2 / 1370 = 2000 ; living = 12,000 ; total = 14,000
    expect(estimateAnnualCostUsd(p, u)).toBe(14000);
  });

  it("falls back to the university UG USD range when program tuition is absent", () => {
    const u = uni({
      id: 1,
      slug: "u",
      name: "U",
      tuition_ug_usd_min: 2000,
      tuition_ug_usd_max: 3000,
      living_usd_per_month: 800,
    });
    const p = prog({
      id: 1,
      university_id: 1,
      name: "P",
      degree_level: "Bachelor",
    });
    // tuition = 2000 + 3000 = 5000 ; living = 9600 ; total = 14,600
    expect(estimateAnnualCostUsd(p, u)).toBe(14600);
  });

  it("uses graduate tuition for Master/PhD programs", () => {
    const u = uni({
      id: 1,
      slug: "u",
      name: "U",
      tuition_grad_krw_min: 1_370_000,
      tuition_grad_krw_max: 1_370_000,
      tuition_ug_usd_min: 9000,
      tuition_ug_usd_max: 9000,
    });
    const p = prog({
      id: 1,
      university_id: 1,
      name: "P",
      degree_level: "Master",
    });
    // grad: (1.37M + 1.37M) / 1370 = 2000 ; no living → 2000 (not the UG 18,000)
    expect(estimateAnnualCostUsd(p, u)).toBe(2000);
  });

  it("returns null when nothing is known", () => {
    const u = uni({ id: 1, slug: "u", name: "U" });
    const p = prog({ id: 1, university_id: 1, name: "P" });
    expect(estimateAnnualCostUsd(p, u)).toBeNull();
  });
});

describe("rankPrograms", () => {
  const byId = new Map<number, University>([
    [1, uni({ id: 1, slug: "a", name: "Univ A" })],
    [2, uni({ id: 2, slug: "b", name: "Univ B" })],
  ]);

  it("only includes programs of the intended degree", () => {
    const programs = [
      prog({
        id: 1,
        university_id: 1,
        name: "BSc",
        degree_level: "Bachelor",
        field: "Engineering",
      }),
      prog({
        id: 2,
        university_id: 2,
        name: "MSc",
        degree_level: "Master",
        field: "Engineering",
      }),
    ];
    const result = rankPrograms(baseProfile, programs, byId);
    expect(result).toHaveLength(1);
    expect(result[0]?.program.degree_level).toBe("Bachelor");
  });

  it("ranks a field + GPA match above a non-matching program", () => {
    const programs = [
      prog({
        id: 1,
        university_id: 1,
        name: "Match",
        degree_level: "Bachelor",
        field: "Engineering",
        min_gpa_4_0_scale: 3.0,
        english_min_ielts: 6.0,
      }),
      prog({
        id: 2,
        university_id: 2,
        name: "Off-field",
        degree_level: "Bachelor",
        field: "Humanities",
        min_gpa_4_0_scale: 3.9,
        english_min_ielts: 7.5,
      }),
    ];
    const result = rankPrograms(baseProfile, programs, byId);
    expect(result[0]?.program.name).toBe("Match");
    expect(result[0]?.score).toBeGreaterThan(result[1]?.score ?? 0);
    expect(result[0]?.reasons).toContain("Matches your field");
    expect(result[0]?.reasons).toContain("Meets the GPA bar");
  });

  it("respects the result limit", () => {
    const programs = Array.from({ length: 30 }, (_, i) =>
      prog({
        id: i + 1,
        university_id: 1,
        name: `P${i}`,
        degree_level: "Bachelor",
      }),
    );
    expect(rankPrograms(baseProfile, programs, byId, 5)).toHaveLength(5);
  });

  it("returns nothing when no program matches the intended degree (hard filter)", () => {
    const programs = [
      prog({ id: 1, university_id: 1, name: "BSc", degree_level: "Bachelor" }),
    ];
    const phdProfile: MatchProfile = { ...baseProfile, degree: "PhD" };
    expect(rankPrograms(phdProfile, programs, byId)).toHaveLength(0);
  });
});
