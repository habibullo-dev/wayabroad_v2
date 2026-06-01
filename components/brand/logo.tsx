import { cn } from "@/lib/utils";

/**
 * WayAbroad brand logo. Renders the horizontal lockup (mark + wordmark) by default,
 * or the standalone mark when `showWordmark` is false. Assets live in /public/brand.
 */
export function Logo({
  className,
  showWordmark = true,
}: {
  className?: string;
  showWordmark?: boolean;
}) {
  return (
    // Brand SVG embeds a raster mark; next/image would force optimization config, so a
    // plain <img> is the simplest correct choice here.
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={showWordmark ? "/brand/wayabroad-lockup.svg" : "/brand/wayabroad-mark.svg"}
      alt="WayAbroad"
      draggable={false}
      className={cn(
        "select-none",
        showWordmark ? "h-7 w-auto" : "size-8",
        className,
      )}
    />
  );
}
