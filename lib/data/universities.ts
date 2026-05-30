import "server-only";

import { MOCK_PROGRAMS, MOCK_UNIVERSITIES } from "@/lib/data/mock";
import type { DataResult, Program, University } from "@/lib/data/types";
import { MOCK_DATA } from "@/lib/env";
import { captureException } from "@/lib/observability/sentry";
import { createPublicClient } from "@/lib/supabase/server";

/**
 * Reference-data access layer. Every accessor returns the data plus its `source`
 * ("live" | "mock") so the UI can show the mandated "sample data" indicator.
 *
 * Three distinct outcomes, deliberately NOT collapsed together:
 *  - not configured (MOCK_DATA)      -> mock, silent (expected before Supabase is wired)
 *  - configured but 0 rows           -> mock, warns (DB likely not seeded)
 *  - configured but query FAILED     -> mock, logs LOUDLY + captureException (real misconfig)
 */

type PublicClient = ReturnType<typeof createPublicClient>;

async function loadWithFallback<T>(
  label: string,
  fallback: T[],
  query: (
    client: PublicClient,
  ) => PromiseLike<{ data: T[] | null; error: { message: string } | null }>,
): Promise<DataResult<T[]>> {
  if (MOCK_DATA) return { data: fallback, source: "mock" };
  try {
    const supabase = createPublicClient();
    const { data, error } = await query(supabase);
    if (error) throw error;
    if (!data || data.length === 0) {
      // eslint-disable-next-line no-console
      console.warn(
        `[data] ${label}: Supabase returned 0 rows; serving mock (is the DB seeded?).`,
      );
      return { data: fallback, source: "mock" };
    }
    return { data, source: "live" };
  } catch (error) {
    // Configured but the query failed (broken RLS, missing table, bad key, network).
    // Log loudly so a real misconfiguration can't hide behind the mock fallback.
    // eslint-disable-next-line no-console
    console.error(
      `[data] ${label}: live query failed; serving mock fallback.`,
      error,
    );
    captureException(error, { where: label });
    return { data: fallback, source: "mock" };
  }
}

export function getUniversities(): Promise<DataResult<University[]>> {
  return loadWithFallback("getUniversities", MOCK_UNIVERSITIES, (supabase) =>
    supabase
      .from("universities")
      .select("*")
      .order("kr_rank_unirank_2026", { ascending: true, nullsFirst: false }),
  );
}

export function getPrograms(): Promise<DataResult<Program[]>> {
  return loadWithFallback("getPrograms", MOCK_PROGRAMS, (supabase) =>
    supabase.from("programs").select("*"),
  );
}

/** Lightweight counts used by the landing page to prove the data layer end-to-end. */
export async function getReferenceCounts(): Promise<
  DataResult<{ universities: number; programs: number }>
> {
  const [universities, programs] = await Promise.all([
    getUniversities(),
    getPrograms(),
  ]);
  const source: DataResult<unknown>["source"] =
    universities.source === "live" && programs.source === "live"
      ? "live"
      : "mock";
  return {
    data: {
      universities: universities.data.length,
      programs: programs.data.length,
    },
    source,
  };
}
