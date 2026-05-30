/**
 * Demo / smoke test for the probability engine.
 * Loads the seed database (../database/*_flat.json), maps it into the engine's
 * shapes, and scores a few sample students against a real program.
 *
 * Run:  node --experimental-strip-types demo.ts
 */
import { readFileSync } from "node:fs";
import { join } from "node:path";
import {
  scoreAdmission,
  type StudentProfile,
  type ProgramInfo,
  type AdmissionRecord,
} from "./scoreAdmission.ts";

const DB = join(import.meta.dirname, "..", "database");
const load = (f: string) => JSON.parse(readFileSync(join(DB, f), "utf8"));

const universities = load("universities_flat.json");
const programs = load("programs_flat.json");
const records = load("admission_records_flat.json");

// Pick an English-taught Computer Science / Engineering program to demo.
const program =
  programs.find(
    (p: any) =>
      /Computer Science|Electrical/.test(p.name) &&
      p.language_of_instruction === "English",
  ) ?? programs[0];
const uni = universities.find((u: any) => u.id === program.university_id);
const progRecords: AdmissionRecord[] = records
  .filter((r: any) => r.program_id === program.id)
  .map((r: any) => ({
    applicantGpa: r.applicant_gpa_4_0,
    langTest: r.applicant_lang_test,
    langScore: r.applicant_lang_score,
    outcome: r.outcome,
  }));

const programInfo: ProgramInfo = {
  name: `${uni.name} — ${program.name}`,
  language: program.language_of_instruction,
  minGpa: program.min_gpa_4_0_scale,
  minIelts: program.english_min_ielts,
  minTopik: program.topik_required_level,
  tierBand: uni.tier_band,
};

const students: Array<{ label: string; p: StudentProfile }> = [
  {
    label: "Strong applicant",
    p: { gpa: 3.8, langTest: "IELTS", langScore: 7.0 },
  },
  {
    label: "Borderline applicant",
    p: { gpa: 3.1, langTest: "IELTS", langScore: 6.0 },
  },
  {
    label: "Below language bar",
    p: { gpa: 3.6, langTest: "IELTS", langScore: 5.0 },
  },
];

console.log(`\nProgram: ${programInfo.name}`);
console.log(
  `Tier: ${programInfo.tierBand} | Min GPA: ${programInfo.minGpa} | Min IELTS: ${programInfo.minIelts} | Seed records: ${progRecords.length}\n`,
);

for (const { label, p } of students) {
  const r = scoreAdmission(p, programInfo, progRecords);
  console.log(`── ${label}: GPA ${p.gpa}, ${p.langTest} ${p.langScore}`);
  console.log(
    `   Probability: ${r.percent}%  (band ${r.band[0]}–${r.band[1]}%, ${r.confidence} confidence, n=${r.sampleSize}, eligible=${r.eligible})`,
  );
  for (const d of r.drivers) {
    const mark =
      d.impact === "positive" ? "▲" : d.impact === "negative" ? "▼" : "•";
    console.log(`     ${mark} ${d.factor}: ${d.detail}`);
  }
  console.log("");
}
console.log("All scenarios scored successfully. ✅");
