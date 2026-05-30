import type { Metadata } from "next";

import { FreeCheckForm } from "@/components/check/free-check-form";
import { AppHeader } from "@/components/layout/app-header";
import { SiteFooter } from "@/components/layout/site-footer";
import { getPrograms, getUniversities } from "@/lib/data/universities";

export const metadata: Metadata = {
  title: "Free admission probability check",
  description:
    "Get an explainable estimate of your admission chances at a Korean university — with the factors and a confidence band. No sign-up.",
};

export default async function CheckPage() {
  const [unis, progs] = await Promise.all([getUniversities(), getPrograms()]);
  const universities = unis.data
    .map((u) => ({ id: u.id, name: u.name }))
    .sort((a, b) => a.name.localeCompare(b.name));
  const programs = progs.data.map((p) => ({
    id: p.id,
    name: p.name,
    university_id: p.university_id,
    degree_level: p.degree_level,
  }));

  return (
    <div className="flex min-h-screen flex-col">
      <AppHeader />
      <main className="flex-1">
        <div className="mx-auto max-w-5xl px-4 py-12 sm:px-6">
          <header className="mb-8 max-w-2xl">
            <h1 className="font-display text-3xl font-semibold tracking-tight sm:text-4xl">
              Free admission probability check
            </h1>
            <p className="mt-2 text-pretty text-muted-foreground">
              Enter your profile and a target program for an explainable
              estimate — with the factors behind it and a confidence band. No
              sign-up, and we don&rsquo;t store anything.
            </p>
          </header>
          <FreeCheckForm universities={universities} programs={programs} />
        </div>
      </main>
      <SiteFooter />
    </div>
  );
}
