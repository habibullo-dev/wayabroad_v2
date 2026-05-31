import { describe, expect, it } from "vitest";

import {
  scoreAdmission,
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

const strong: StudentProfile = { gpa: 3.8, langTest: "IELTS", langScore: 7.0 };
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

describe("scoreAdmission — shape & drivers", () => {
  it("returns GPA, selectivity, language drivers + a bracketing band, never 'high'", () => {
    const r = scoreAdmission(strong, eliteCs);
    const factors = r.drivers.map((d) => d.factor);
    expect(factors).toContain("Academic record (GPA)");
    expect(factors).toContain("Program selectivity");
    expect(factors).toContain("Language proficiency");
    expect(r.band[0]).toBeLessThanOrEqual(r.percent);
    expect(r.band[1]).toBeGreaterThanOrEqual(r.percent);
    expect(["low", "moderate"]).toContain(r.confidence);
  });

  it("never blends synthetic outcomes — no 'similar applicants' driver", () => {
    const r = scoreAdmission(strong, eliteCs);
    expect(
      r.drivers.find((d) => /similar applicants/i.test(d.factor)),
    ).toBeUndefined();
  });
});

describe("scoreAdmission — prior basis (no validated rate)", () => {
  it("scores a strong eligible applicant on the labeled tier prior", () => {
    const r = scoreAdmission(strong, eliteCs);
    // base 0.30 (elite prior) + gpaMargin 0.2*0.30 + IELTS margin 1.0*0.05 = 0.41
    expect(r.percent).toBe(41);
    expect(r.basis).toBe("prior");
    expect(r.eligible).toBe(true);
    expect(r.confidence).toBe("low");
    expect(r.category).toBe("match");
  });

  it("ranks strong > below-GPA and strong > below-language", () => {
    const s = scoreAdmission(strong, eliteCs).percent;
    expect(s).toBeGreaterThan(scoreAdmission(belowGpa, eliteCs).percent);
    expect(s).toBeGreaterThan(scoreAdmission(belowLang, eliteCs).percent);
  });

  it("marks failing applicants ineligible (reach) and applies the language hard gate", () => {
    const bg = scoreAdmission(belowGpa, eliteCs);
    expect(bg.eligible).toBe(false);
    expect(bg.category).toBe("reach");

    const lang = scoreAdmission(belowLang, eliteCs);
    expect(lang.eligible).toBe(false);
    expect(lang.percent).toBeLessThan(20);
    expect(
      lang.drivers.find((d) => d.factor === "Language proficiency")?.impact,
    ).toBe("negative");
  });
});

describe("scoreAdmission — validated acceptance rate", () => {
  it("anchors to a cited acceptance rate and reports it as the basis", () => {
    const r = scoreAdmission(strong, eliteCs, {
      rate: 0.1,
      international: true,
      sourceUrl: "https://example.edu/admissions",
    });
    // base 0.10 + 0.06 (gpa) + 0.05 (lang) = 0.21
    expect(r.percent).toBe(21);
    expect(r.basis).toBe("validated_rate");
    expect(r.confidence).toBe("moderate");
    expect(r.category).toBe("reach"); // eligible but < 30%
    expect(
      r.drivers.find((d) => d.factor === "Program selectivity")?.detail,
    ).toMatch(/10%/);
  });

  it("a generous validated rate can read as a safety", () => {
    const r = scoreAdmission(strong, eliteCs, { rate: 0.7 });
    expect(r.percent).toBeGreaterThanOrEqual(55);
    expect(r.category).toBe("safety");
  });
});

describe("scoreAdmission — no usable language test", () => {
  it("flags language unconfirmed, applies no hard gate, stays ineligible", () => {
    const r = scoreAdmission(
      { gpa: 3.8, langTest: null, langScore: null },
      eliteCs,
    );
    expect(r.languageConfirmed).toBe(false);
    expect(r.eligible).toBe(false);
    // base 0.30 + gpa 0.06, no language gate → 36%
    expect(r.percent).toBe(36);
    expect(
      r.drivers.find((d) => d.factor === "Language proficiency")?.impact,
    ).toBe("neutral");
  });

  it("treats TOPIK as unconfirmed for an English-taught program (no hard gate)", () => {
    const r = scoreAdmission(
      { gpa: 3.8, langTest: "TOPIK", langScore: 6 },
      eliteCs,
    );
    expect(r.languageConfirmed).toBe(false);
    expect(r.eligible).toBe(false);
    expect(r.percent).toBe(36); // prior + gpa, NOT hard-gated
  });
});
