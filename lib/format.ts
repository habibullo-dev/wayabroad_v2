const usd = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  maximumFractionDigits: 0,
});

/** Format a USD amount, or an em-dash when unknown. */
export function formatUsd(value: number | null | undefined): string {
  if (value == null || Number.isNaN(value)) return "—";
  return usd.format(value);
}

const krw = new Intl.NumberFormat("en-US", { maximumFractionDigits: 0 });

/** Format a KRW amount (₩), or an em-dash when unknown. */
export function formatKrw(value: number | null | undefined): string {
  if (value == null || Number.isNaN(value)) return "—";
  return `₩${krw.format(value)}`;
}
