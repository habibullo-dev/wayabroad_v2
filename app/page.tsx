import { FileText, GraduationCap, Sparkles, Wallet } from "lucide-react";

import { Button } from "@/components/ui/button";
import { getReferenceCounts } from "@/lib/data/universities";
import { APP_NAME, APP_TAGLINE } from "@/lib/config";

const PILLARS = [
  {
    icon: GraduationCap,
    title: "Ranked shortlist",
    body: "Your profile in, a ranked list of matching Korean programs out.",
  },
  {
    icon: Sparkles,
    title: "Admission probability",
    body: "A transparent % chance per program — with the factors and a confidence band.",
  },
  {
    icon: FileText,
    title: "SOP & Study Plan drafts",
    body: "Instant, editable drafts tailored to your target program.",
  },
  {
    icon: Wallet,
    title: "Cost transparency",
    body: "Tuition, dorm, visa and living costs in one honest breakdown.",
  },
] as const;

export default async function HomePage() {
  const { data: counts, source } = await getReferenceCounts();
  const dataLabel =
    source === "live"
      ? `${counts.universities} universities · ${counts.programs} programs (live)`
      : "sample data";

  return (
    <main className="mx-auto flex min-h-screen max-w-5xl flex-col items-center justify-center gap-12 px-6 py-16 text-center">
      <div className="flex flex-col items-center gap-5">
        <span className="inline-flex items-center gap-2 rounded-full border border-border bg-muted px-3 py-1 text-xs font-medium text-muted-foreground">
          <span className="size-2 rounded-full bg-primary" />
          M1 · data layer · {dataLabel}
        </span>
        <h1 className="max-w-3xl text-balance text-4xl font-semibold tracking-tight sm:text-5xl">
          {APP_NAME}
          <span className="block text-2xl font-normal text-muted-foreground sm:text-3xl">
            {APP_TAGLINE}
          </span>
        </h1>
        <p className="max-w-xl text-pretty text-base text-muted-foreground">
          The full landing page and free probability check arrive in M3. This is
          the design-system foundation rendering with mocked data — no database
          or API keys required.
        </p>
        <div className="flex flex-col items-center gap-3 pt-2">
          <Button size="lg" asChild>
            <a href="#features">See what&rsquo;s coming</a>
          </Button>
          <p className="text-sm text-muted-foreground">
            Sign-in and the free probability check go live in M3.
          </p>
        </div>
      </div>

      <ul
        id="features"
        className="grid w-full grid-cols-1 gap-4 text-left sm:grid-cols-2"
      >
        {PILLARS.map(({ icon: Icon, title, body }) => (
          <li
            key={title}
            className="flex flex-col gap-2 rounded-lg border border-border bg-card p-5"
          >
            <Icon className="size-5 text-primary" aria-hidden />
            <h2 className="text-sm font-semibold">{title}</h2>
            <p className="text-sm text-muted-foreground">{body}</p>
          </li>
        ))}
      </ul>
    </main>
  );
}
