/**
 * Idempotent DEMO-account seed: provisions a confirmed login whose dashboard already
 * shows applications mid-flow, so the judge demo has a reliable fallback if live
 * sign-up / the network / the Claude API is slow on stage.
 *
 *   pnpm seed:demo
 *
 * Requires NEXT_PUBLIC_SUPABASE_URL + SUPABASE_SERVICE_ROLE_KEY in .env (service role
 * bypasses RLS and can confirm users). Run `pnpm seed` first so reference programs exist.
 * Re-running is safe: it reuses the existing auth user, upserts the profile, and only
 * creates applications / document versions that aren't already there.
 */
import "dotenv/config";

import { createClient, type User } from "@supabase/supabase-js";

import type { Database } from "../lib/db/database.types";

type ApplicationStatus = Database["public"]["Enums"]["application_status"];
type DocumentType = Database["public"]["Enums"]["document_type"];

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!url || !serviceKey) {
  console.error(
    "[seed:demo] Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY.\n" +
      "            Set them in .env before seeding. Nothing was written.",
  );
  process.exit(1);
}

const supabase = createClient<Database>(url, serviceKey, {
  auth: { persistSession: false },
});

const DEMO_PASSWORD = "WayAbroadDemo!23";
/** Tag stamped on accounts this script creates, so it only ever mutates its own demo users. */
const DEMO_MARKER = "wa_demo";

/** A clearly-labeled placeholder draft so the editor/export still demo without a live API call. */
function sampleDraft(
  kind: DocumentType,
  program: string,
  university: string,
): string {
  const title = kind === "sop" ? "Statement of Purpose" : "Study Plan";
  return [
    `# ${title} — ${program}, ${university}`,
    ``,
    `My path toward ${program.toLowerCase()} began with [add a specific moment or project], ` +
      `which turned a general interest into a clear direction. Studying at ${university} would let me ` +
      `build on that foundation with [add a specific lab, course, or professor you admire].`,
    ``,
    `Grounded in my background — [add your strongest, most relevant experience] — I am ready to ` +
      `contribute and to grow. After the program I intend to [add a concrete near-term goal].`,
    ``,
    `_Draft — personalize the [bracketed] parts and verify every detail before using._`,
  ].join("\n");
}

async function findUserByEmail(email: string): Promise<User | null> {
  // listUsers is paginated; scan pages until found or exhausted (fine for a demo-sized project).
  for (let page = 1; page <= 20; page++) {
    const { data, error } = await supabase.auth.admin.listUsers({
      page,
      perPage: 200,
    });
    if (error) throw error;
    const match = data.users.find((u) => u.email === email);
    if (match) return match;
    if (data.users.length < 200) break;
  }
  return null;
}

async function ensureUser(email: string): Promise<User> {
  const existing = await findUserByEmail(email);
  if (existing) {
    // Never overwrite an account we didn't create — guards against clobbering a real
    // user who happens to share the demo email.
    if (existing.app_metadata?.[DEMO_MARKER] !== true) {
      throw new Error(
        `Refusing to mutate ${email}: it exists but is not marked as a demo account ` +
          `(app_metadata.${DEMO_MARKER} !== true). Delete that user or pick another demo email.`,
      );
    }
    return existing;
  }
  const { data, error } = await supabase.auth.admin.createUser({
    email,
    password: DEMO_PASSWORD,
    email_confirm: true,
    app_metadata: { [DEMO_MARKER]: true },
  });
  if (error || !data.user) {
    throw new Error(`createUser failed for ${email}: ${error?.message}`);
  }
  return data.user;
}

/** First program at the first university whose name matches `nameLike`. */
async function pickProgram(
  nameLike: string,
): Promise<{ id: number; name: string; university: string } | null> {
  const { data: unis } = await supabase
    .from("universities")
    .select("id, name")
    .ilike("name", `%${nameLike}%`)
    .limit(1);
  const uni = unis?.[0];
  if (!uni) return null;
  const { data: progs } = await supabase
    .from("programs")
    .select("id, name")
    .eq("university_id", uni.id)
    .limit(1);
  const prog = progs?.[0];
  if (!prog) return null;
  return { id: prog.id, name: prog.name, university: uni.name };
}

async function ensureApplication(
  studentId: string,
  programId: number,
  status: ApplicationStatus,
): Promise<string> {
  const { data: existing } = await supabase
    .from("applications")
    .select("id")
    .eq("student_id", studentId)
    .eq("program_id", programId)
    .limit(1);
  const existingId = existing?.[0]?.id;
  if (existingId) {
    const { error } = await supabase
      .from("applications")
      .update({ status })
      .eq("id", existingId);
    if (error) {
      throw new Error(`application status update failed: ${error.message}`);
    }
    return existingId;
  }
  const { data, error } = await supabase
    .from("applications")
    .insert({ student_id: studentId, program_id: programId, status })
    .select("id")
    .single();
  if (error || !data) {
    throw new Error(`application insert failed: ${error?.message}`);
  }
  return data.id;
}

async function ensureDocument(
  applicationId: string,
  type: DocumentType,
  program: string,
  university: string,
): Promise<void> {
  const { data: existing } = await supabase
    .from("documents")
    .select("id")
    .eq("application_id", applicationId)
    .eq("type", type)
    .limit(1);
  if (existing && existing.length > 0) return;
  const { error } = await supabase.from("documents").insert({
    application_id: applicationId,
    type,
    version: 1,
    title: type === "sop" ? "Statement of Purpose" : "Study Plan",
    content: sampleDraft(type, program, university),
  });
  if (error) {
    throw new Error(`document insert (${type}) failed: ${error.message}`);
  }
}

async function main() {
  console.log(`[seed:demo] target: ${new URL(url!).host}`);

  const email = "demo@wayabroad.app";
  const user = await ensureUser(email);
  console.log(`[seed:demo] user ready: ${email} (${user.id})`);

  const { error: profileError } = await supabase.from("students").upsert({
    id: user.id,
    full_name: "Amina Yusupova",
    country: "Uzbekistan",
    gpa: 3.7,
    gpa_scale: 4,
    intended_degree: "Master's",
    intended_field: "Computer Science",
    language_test: "IELTS",
    language_score: 7,
    budget_usd: 18000,
  });
  if (profileError) {
    throw new Error(`profile upsert failed: ${profileError.message}`);
  }
  console.log("[seed:demo] profile upserted");

  // Two recognizable programs in different statuses → a lively dashboard + timeline.
  const rich = await pickProgram("Seoul National");
  const submitted = await pickProgram("Korea University");

  if (rich) {
    const appId = await ensureApplication(user.id, rich.id, "interview");
    await ensureDocument(appId, "sop", rich.name, rich.university);
    await ensureDocument(appId, "study_plan", rich.name, rich.university);
    console.log(
      `[seed:demo] application @ interview: ${rich.name} — ${rich.university} (+ SOP, Study Plan)`,
    );
  } else {
    console.warn(
      "[seed:demo] no 'Seoul National' program found — run `pnpm seed` first?",
    );
  }

  if (submitted) {
    await ensureApplication(user.id, submitted.id, "submitted");
    console.log(
      `[seed:demo] application @ submitted: ${submitted.name} — ${submitted.university}`,
    );
  }

  console.log(
    `\n[seed:demo] Done. Sign in with:\n  email:    ${email}\n  password: ${DEMO_PASSWORD}\n`,
  );
}

main().catch((err) => {
  console.error("[seed:demo] failed:", err);
  process.exit(1);
});
