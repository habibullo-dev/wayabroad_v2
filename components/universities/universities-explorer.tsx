"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { MapPin, Search, X } from "lucide-react";

import { UniversityLogo } from "@/components/universities/university-logo";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { FilterSelect, useDebouncedValue } from "@/components/ui/sort-select";
import type { University } from "@/lib/data/types";
import { formatUsd } from "@/lib/format";

type SortKey = "rank" | "name" | "tuition";

const SORT_OPTIONS = [
  { value: "rank", label: "QS rank" },
  { value: "name", label: "Name (A–Z)" },
  { value: "tuition", label: "Tuition (low to high)" },
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

export function UniversitiesExplorer({
  universities,
}: {
  universities: University[];
}) {
  const router = useRouter();
  const pathname = usePathname();
  const params = useSearchParams();

  const qParam = params.get("q") ?? "";
  const tier = params.get("tier") ?? "";
  const region = params.get("region") ?? "";
  const sort = (params.get("sort") as SortKey) || "rank";

  const [search, setSearch] = React.useState(qParam);
  const debouncedSearch = useDebouncedValue(search, 200);

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

  React.useEffect(() => {
    if (debouncedSearch === qParam) return;
    setParam("q", debouncedSearch);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debouncedSearch]);

  const tierOptions = React.useMemo(
    () =>
      uniqueOptions(
        universities.map((u) => u.tier_band),
        "All tiers",
      ),
    [universities],
  );
  const regionOptions = React.useMemo(
    () =>
      uniqueOptions(
        universities.map((u) => u.region),
        "All regions",
      ),
    [universities],
  );

  const filtered = React.useMemo(() => {
    const q = debouncedSearch.trim().toLowerCase();
    const result = universities.filter((u) => {
      if (q) {
        const hay = `${u.name} ${u.city ?? ""}`.toLowerCase();
        if (!hay.includes(q)) return false;
      }
      if (tier && u.tier_band !== tier) return false;
      if (region && u.region !== region) return false;
      return true;
    });

    const sorted = [...result];
    switch (sort) {
      case "name":
        sorted.sort((a, b) => a.name.localeCompare(b.name));
        break;
      case "tuition":
        sorted.sort(
          (a, b) =>
            (a.tuition_ug_usd_min ?? Infinity) -
            (b.tuition_ug_usd_min ?? Infinity),
        );
        break;
      case "rank":
      default:
        sorted.sort(
          (a, b) =>
            (a.kr_rank_unirank_2026 ?? Infinity) -
            (b.kr_rank_unirank_2026 ?? Infinity),
        );
        break;
    }
    return sorted;
  }, [universities, debouncedSearch, tier, region, sort]);

  const hasFilters = Boolean(qParam || tier || region) || sort !== "rank";

  const clearAll = React.useCallback(() => {
    setSearch("");
    router.replace(pathname, { scroll: false });
  }, [pathname, router]);

  return (
    <div>
      <div className="mb-4 flex flex-col gap-3 rounded-xl border bg-card p-4 sm:flex-row sm:flex-wrap sm:items-end">
        <div className="flex min-w-0 flex-1 flex-col gap-1.5 sm:min-w-[14rem]">
          <label
            htmlFor="unis-search"
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
              id="unis-search"
              type="search"
              inputMode="search"
              placeholder="University or city"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9"
            />
          </div>
        </div>

        <FilterSelect
          id="unis-tier"
          label="Tier"
          value={tier}
          onValueChange={(v) => setParam("tier", v)}
          options={tierOptions}
          className="sm:w-44"
        />
        <FilterSelect
          id="unis-region"
          label="Region"
          value={region}
          onValueChange={(v) => setParam("region", v)}
          options={regionOptions}
          className="sm:w-44"
        />
        <FilterSelect
          id="unis-sort"
          label="Sort by"
          value={sort}
          onValueChange={(v) => setParam("sort", v === "rank" ? "" : v)}
          options={SORT_OPTIONS}
          className="sm:w-48"
        />
      </div>

      <div className="mb-6 flex flex-wrap items-center justify-between gap-2">
        <p aria-live="polite" className="text-sm text-muted-foreground">
          {filtered.length} of {universities.length} universities
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
            No universities match
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
          {filtered.map((u) => (
            <Link
              key={u.id}
              href={`/universities/${u.slug}`}
              className="group rounded-xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
            >
              <Card className="flex h-full flex-col gap-2 p-5 transition-colors group-hover:border-primary/40">
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-start gap-3">
                    <UniversityLogo
                      slug={u.slug}
                      name={u.name}
                      className="size-10"
                    />
                    <h2 className="font-display text-lg font-semibold leading-tight">
                      {u.name}
                    </h2>
                  </div>
                  {u.tier_band && (
                    <Badge variant="secondary">{u.tier_band}</Badge>
                  )}
                </div>
                {u.city && (
                  <p className="inline-flex items-center gap-1 text-sm text-muted-foreground">
                    <MapPin className="size-3.5" aria-hidden />
                    {u.city}
                    {u.region ? `, ${u.region}` : ""}
                  </p>
                )}
                <p className="mt-auto pt-2 text-sm text-muted-foreground">
                  Tuition from{" "}
                  <span className="font-medium tabular-nums text-foreground">
                    {formatUsd(
                      u.tuition_ug_usd_min != null
                        ? u.tuition_ug_usd_min * 2
                        : null,
                    )}
                  </span>
                  /yr
                </p>
              </Card>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
