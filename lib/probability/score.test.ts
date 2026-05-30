import { describe, expect, it } from "vitest";

import {
  scoreAdmission,
  type AdmissionRecord,
  type ProgramInfo,
  type StudentProfile,
} from "@/lib/probability/score";

// Elite program (SNU CS): min GPA 3.6, min IELTS 6.0.
const eliteCs: ProgramInfo = {
  name: "SNU — Computer Science",
  language: "English",
  minGpa: 3.6,
  minIelts: 6.0,
  tierBand: "elite",
};

describe("scoreAdmission — drivers & shape", () => {
  it("always returns GPA, selectivity, and language drivers plus a bracketing band", () => {
    const r = scoreAdmission(
      { gpa: 3.8, langTest: "IELTS", langScore: 7.0 },
      eliteCs,
    );
    const factors = r.drivers.map((d) => d.factor);
    expect(factors).toContain("Academic record (GPA)");
    expect(factors).toContain("Program selectivity");
    expect(factors).toContain("Language proficiency");
    expect(r.band[0]).toBeLessThanOrEqual(r.percent);
    expect(r.band[1]).toBeGreaterThanOrEqual(r.percent);
    expect(r.band[0]).toBeGreaterThanOrEqual(1);
    expect(r.band[1]).toBeLessThanOrEqual(99);
  });
});

describe("scoreAdmission — ordering & hard gates", () => {
  const strong: StudentProfile = {
    gpa: 3.8,
    langTest: "IELTS",
    langScore: 7.0,
  };
  const belowGpa: StudentProfile = {
    gpa: 3.1,
    langTest: "IELTS",
    langScore: 6.0,
  };
  const belowLang: StudentProfile = {
    gpa: 3.6,
    langTest: "IELTS",
    langScore: 5.0,
  };

  it("scores a strong eligible applicant on the rules prior with no data", () => {
    const r = scoreAdmission(strong, eliteCs);
    // prior = 0.30 (elite) + 0.2*0.35 = 0.37 → 37%
    expect(r.percent).toBe(37);
    expect(r.eligible).toBe(true);
    expect(r.confidence).toBe("low"); // no records
  });

  it("ranks strong > below-GPA and strong > below-language", () => {
    const s = scoreAdmission(strong, eliteCs).percent;
    expect(s).toBeGreaterThan(scoreAdmission(belowGpa, eliteCs).percent);
    expect(s).toBeGreaterThan(scoreAdmission(belowLang, eliteCs).percent);
  });

  it("marks failing applicants ineligible and applies the language hard gate", () => {
    expect(scoreAdmission(belowGpa, eliteCs).eligible).toBe(false);
    const lang = scoreAdmission(belowLang, eliteCs);
    expect(lang.eligible).toBe(false);
    expect(lang.percent).toBeLessThan(20);
    expect(
      lang.drivers.find((d) => d.factor === "Language proficiency")?.impact,
    ).toBe("negative");
  });
});

describe("scoreAdmission — empirical blend & confidence", () => {
  const mid: ProgramInfo = {
    language: "English",
    minGpa: 3.0,
    minIelts: 6.0,
    tierBand: "mid",
  };
  const student: StudentProfile = { gpa: 3.5, langTest: "IELTS", langScore: 7 };
  const recs = (
    outcome: "admit" | "reject",
    count: number,
  ): AdmissionRecord[] =>
    Array.from({ length: count }, () => ({
      applicantGpa: 3.5,
      langTest: "IELTS",
      langScore: 7,
      outcome,
    }));

  it("moves the score toward observed outcomes", () => {
    const up = scoreAdmission(student, mid, recs("admit", 10)).percent;
    const down = scoreAdmission(student, mid, recs("reject", 10)).percent;
    const none = scoreAdmission(student, mid).percent;
    expect(up).toBeGreaterThan(none);
    expect(down).toBeLessThan(none);
  });

  it("scales confidence with comparable sample size", () => {
    expect(scoreAdmission(student, mid).confidence).toBe("low");
    expect(scoreAdmission(student, mid, recs("admit", 10)).confidence).toBe(
      "moderate",
    );
    expect(scoreAdmission(student, mid, recs("admit", 16)).confidence).toBe(
      "high",
    );
  });

  it("ignores records outside the comparable GPA band (±0.4)", () => {
    const farRecords: AdmissionRecord[] = Array.from({ length: 12 }, () => ({
      applicantGpa: 2.0,
      langTest: "IELTS",
      langScore: 7,
      outcome: "admit",
    }));
    const r = scoreAdmission(student, mid, farRecords);
    expect(r.sampleSize).toBe(0);
  });
});

describe("scoreAdmission — no language test on file", () => {
  it("does not crash, flags language unconfirmed, and applies no hard gate", () => {
    const r = scoreAdmission(
      { gpa: 3.8, langTest: null, langScore: null },
      eliteCs,
    );
    expect(r.languageConfirmed).toBe(false);
    expect(r.eligible).toBe(false); // can't confirm eligibility
    // no ×0.25 gate, so it stays on the prior (37%), unlike a confirmed language failure
    expect(r.percent).toBe(37);
    expect(
      r.drivers.find((d) => d.factor === "Language proficiency")?.impact,
    ).toBe("neutral");
  });

  it("treats TOPIK as unconfirmed for an English-taught program (no hard gate, not eligible)", () => {
    const r = scoreAdmission(
      { gpa: 3.8, langTest: "TOPIK", langScore: 6 },
      eliteCs,
    );
    expect(r.languageConfirmed).toBe(false);
    expect(r.eligible).toBe(false);
    expect(r.percent).toBe(37); // prior, NOT hard-gated to ~9%
  });
});
