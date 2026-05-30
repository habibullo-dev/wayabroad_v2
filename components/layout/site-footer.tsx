import Link from "next/link";

import { Logo } from "@/components/brand/logo";

const FOOTER_LINKS: {
  heading: string;
  links: { href: string; label: string }[];
}[] = [
  {
    heading: "Product",
    links: [
      { href: "/shortlist", label: "Shortlist" },
      { href: "/universities", label: "Universities" },
      { href: "/#features", label: "How it works" },
    ],
  },
  {
    heading: "Account",
    links: [
      { href: "/login", label: "Sign in" },
      { href: "/signup", label: "Get started" },
      { href: "/onboarding", label: "Your profile" },
    ],
  },
];

export function SiteFooter() {
  return (
    <footer className="border-t border-border/60 bg-card/40">
      <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
        <div className="flex flex-col gap-10 md:flex-row md:justify-between">
          <div className="max-w-xs">
            <Logo />
            <p className="mt-3 text-sm text-muted-foreground">
              Your AI guide to studying in Korea — a ranked shortlist,
              transparent admission odds, and instant document drafts.
            </p>
          </div>
          <div className="grid grid-cols-2 gap-8 sm:gap-16">
            {FOOTER_LINKS.map((col) => (
              <div key={col.heading}>
                <p className="font-display text-sm font-semibold text-foreground">
                  {col.heading}
                </p>
                <ul className="mt-3 space-y-2">
                  {col.links.map((link) => (
                    <li key={link.href}>
                      <Link
                        href={link.href}
                        className="rounded-md text-sm text-muted-foreground transition-colors hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                      >
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
        <div className="mt-10 border-t border-border/60 pt-6 text-xs text-muted-foreground">
          <p>
            © {2026} WayAbroad. Cost figures are estimates — verify with each
            university. Admission-probability and document features are decision
            aids, not guarantees.
          </p>
        </div>
      </div>
    </footer>
  );
}
