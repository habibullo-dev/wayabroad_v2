/**
 * Wraps every route. Next remounts a template on each navigation, so the
 * `page-enter` animation gives a gentle fade/rise between pages — smoother than
 * the default hard swap. Honors prefers-reduced-motion via the CSS.
 */
export default function Template({ children }: { children: React.ReactNode }) {
  return <div className="page-enter">{children}</div>;
}
