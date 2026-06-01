"use client";

import * as React from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { Search, X } from "lucide-react";

import { ProgramCard } from "@/components/shortlist/program-card";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { FilterSelect, useDebouncedValue } from "@/components/ui/sort-select";
import type { RankedMatch } from "@/lib/matching/ranked";

type SortKey = "odds" | "cost" | "score" | "name";

const SORT_OPTIONS = [
  { value: "odds", label: "Admission odds" },
  { value: "cost", label: "Est. cost (low to high)" },
  { value: "score", label: "Match score" },
  { value: "name", label: "Name (A–Z)" },
];

const CATEGORY_OPTIONS = [
  { value: "", label: "All categories" },
  { value: "safety", label: "Safe" },
  { value: "match", label: "Match" },
  { value: "reach", label: "Reach" },
];

function uniqueOptions(
  values: (string | null | undefined)[],
  allLabel: string,
): { value: string; label: string }[] {
  const seen = Array.from(
    new Set(values.filter((v): v is string => Boolean(v))),
  ).sort((a, b) => a.localeCompare(b));
  return [
    { value: "", label: allLabel },
    ...seen.map((v) => ({ value: v, label: v })),
  ];
}

export function MatchesExplorer({ matches }: { matches: RankedMatch[] }) {
  const router = useRouter();
  const pathname = usePathname();
  const params = useSearchParams();

  // URL is the source of truth for filters; the text input keeps a local value
  // that is debounced before being written back to the URL.
  const qParam = params.get("q") ?? "";
  const category = params.get("category") ?? "";
  const level = params.get("level") ?? "";
  const lang = params.get("lang") ?? "";
  const sort = (params.get("sort") as SortKey) || "odds";

  const [search, setSearch] = React.useState(qParam);
  const debouncedSearch = useDebouncedValue(search, 200);

  // Keep the input in sync if the URL changes externally (back/forward).
  React.useEffect(() => {
    setSearch(qParam);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [qParam]);

  const setParam = React.useCallback(
    (key: string, value: string) => {
      const next = new URLSearchParams(params.toString());
      if (value) next.set(key, value);
      else next.delete(key);
      const qs = next.toString();
      router.replace(qs ? `${pathname}?${qs}` : pathname, { scroll: false });
    },
    [params, pathname, router],
  );

  // Write the debounced search term to the URL.
  React.useEffect(() => {
    if (debouncedSearch === qParam) return;
    setParam("q", debouncedSearch);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debouncedSearch]);

  const levelOptions = React.useMemo(
    () =>
      uniqueOptions(
        matches.map((m) => m.match.program.degree_level),
        "All levels",
      ),
    [matches],
  );
  const langOptions = React.useMemo(
    () =>
      uniqueOptions(
        matches.map((m) => m.match.program.language_of_instruction),
        "All languages",
      ),
    [matches],
  );

  const filtered = React.useMemo(() => {
    const q = debouncedSearch.trim().toLowerCase();
    const result = matches.filter((m) => {
      const { program, university } = m.match;
      if (q) {
        const hay = `${program.name} ${university.name}`.toLowerCase();
        if (!hay.includes(q)) return false;
      }
      if (category && m.probability.category !== category) return false;
      if (level && program.degree_level !== level) return false;
      if (lang && program.language_of_instruction !== lang) return false;
      return true;
    });

    const sorted = [...result];
    switch (sort) {
      case "cost":
        sorted.sort(
          (a, b) =>
            (a.match.estAnnualCostUsd ?? Infinity) -
            (b.match.estAnnualCostUsd ?? Infinity),
        );
        break;
      case "score":
        sorted.sort((a, b) => b.match.score - a.match.score);
        break;
      case "name":
        sorted.sort((a, b) =>
          a.match.program.name.localeCompare(b.match.program.name),
        );
        break;
      case "odds":
      default:
        sorted.sort((a, b) => b.probability.percent - a.probability.percent);
        break;
    }
    return sorted;
  }, [matches, debouncedSearch, category, level, lang, sort]);

  const hasFilters =
    Boolean(qParam || category || level || lang) || sort !== "odds";

  const clearAll = React.useCallback(() => {
    setSearch("");
    router.replace(pathname, { scroll: false });
  }, [pathname, router]);

  return (
    <div>
      <div className="mb-4 flex flex-col gap-3 rounded-xl border bg-card p-4 sm:flex-row sm:flex-wrap sm:items-end">
        <div className="flex min-w-0 flex-1 flex-col gap-1.5 sm:min-w-[14rem]">
          <label
            htmlFor="matches-search"
            className="text-xs font-medium uppercase tracking-wide text-muted-foreground"
          >
            Search
          </label>
          <div className="relative">
            <Search
              aria-hidden
              className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground"
            />
            <Input
              id="matches-search"
              type="search"
              inputMode="search"
              placeholder="Program or university"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9"
            />
          </div>
        </div>

        <FilterSelect
          id="matches-category"
          label="Category"
          value={category}
          onValueChange={(v) => setParam("category", v)}
          options={CATEGORY_OPTIONS}
          className="sm:w-40"
        />
        <FilterSelect
          id="matches-level"
          label="Degree"
          value={level}
          onValueChange={(v) => setParam("level", v)}
          options={levelOptions}
          className="sm:w-40"
        />
        <FilterSelect
          id="matches-lang"
          label="Language"
          value={lang}
          onValueChange={(v) => setParam("lang", v)}
          options={langOptions}
          className="sm:w-40"
        />
        <FilterSelect
          id="matches-sort"
          label="Sort by"
          value={sort}
          onValueChange={(v) => setParam("sort", v === "odds" ? "" : v)}
          options={SORT_OPTIONS}
          className="sm:w-48"
        />
      </div>

      <div className="mb-6 flex flex-wrap items-center justify-between gap-2">
        <p aria-live="polite" className="text-sm text-muted-foreground">
          {filtered.length} of {matches.length} programs
        </p>
        {hasFilters && (
          <Button variant="ghost" size="sm" onClick={clearAll}>
            <X aria-hidden /> Clear
          </Button>
        )}
      </div>

      {filtered.length === 0 ? (
        <Card className="flex flex-col items-center gap-3 p-10 text-center">
          <p className="font-display text-lg font-semibold">
            No programs match
          </p>
          <p className="text-sm text-muted-foreground">
            Try a different search or clear your filters.
          </p>
          <Button variant="outline" onClick={clearAll}>
            Clear filters
          </Button>
        </Card>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((m) => (
            <ProgramCard
              key={m.match.program.id}
              match={m.match}
              probability={m.probability}
            />
          ))}
        </div>
      )}
    </div>
  );
}
