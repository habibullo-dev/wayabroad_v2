"use client";

import * as React from "react";

import { NativeSelect } from "@/components/ui/native-select";
import { cn } from "@/lib/utils";

/**
 * A labeled <select> for filter/sort controls. The label is always visible (sr-only
 * optional via `hideLabel`) and wired to the native select for accessibility.
 */
export interface FilterSelectOption {
  value: string;
  label: string;
}

export function FilterSelect({
  id,
  label,
  value,
  onValueChange,
  options,
  className,
}: {
  id: string;
  label: string;
  value: string;
  onValueChange: (value: string) => void;
  options: FilterSelectOption[];
  className?: string;
}) {
  return (
    <div className={cn("flex min-w-0 flex-col gap-1.5", className)}>
      <label
        htmlFor={id}
        className="text-xs font-medium uppercase tracking-wide text-muted-foreground"
      >
        {label}
      </label>
      <NativeSelect
        id={id}
        value={value}
        onChange={(e) => onValueChange(e.target.value)}
      >
        {options.map((o) => (
          <option key={o.value} value={o.value}>
            {o.label}
          </option>
        ))}
      </NativeSelect>
    </div>
  );
}

/**
 * A debounced text value. Returns [immediateValue, debouncedValue, setValue] so the input
 * stays responsive while the URL/filter only updates after `delay` ms of quiet.
 */
export function useDebouncedValue<T>(value: T, delay = 200): T {
  const [debounced, setDebounced] = React.useState(value);
  React.useEffect(() => {
    const t = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(t);
  }, [value, delay]);
  return debounced;
}
