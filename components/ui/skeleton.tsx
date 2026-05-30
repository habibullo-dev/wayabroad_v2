import { cn } from "@/lib/utils";

/** Loading placeholder. Pair with route-level `loading.tsx` to reserve layout and avoid CLS. */
function Skeleton({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn("animate-pulse rounded-md bg-muted", className)}
      {...props}
    />
  );
}

export { Skeleton };
