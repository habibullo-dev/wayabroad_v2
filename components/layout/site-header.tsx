"use client";

import { useState } from "react";
import Link from "next/link";
import { LogOut, Menu, X } from "lucide-react";

import { Logo } from "@/components/brand/logo";
import { Button } from "@/components/ui/button";

const NAV = [
  { href: "/#features", label: "How it works" },
  { href: "/shortlist", label: "Shortlist" },
  { href: "/universities", label: "Universities" },
];

export function SiteHeader({
  userEmail,
  signOutAction,
}: {
  userEmail?: string | null;
  signOutAction?: () => Promise<void>;
}) {
  const [open, setOpen] = useState(false);
  const authed = Boolean(userEmail);
  const initial = userEmail?.[0]?.toUpperCase() ?? "?";

  return (
    <header className="sticky top-0 z-40 border-b border-border/60 bg-background/80 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-4 px-4 sm:px-6">
        <Link
          href="/"
          className="inline-flex h-11 items-center rounded-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
        >
          <Logo />
        </Link>

        <nav className="hidden items-center gap-1 md:flex" aria-label="Primary">
          {NAV.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="rounded-md px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
            >
              {item.label}
            </Link>
          ))}
        </nav>

        {authed ? (
          <div className="hidden items-center gap-3 md:flex">
            <span className="flex items-center gap-2">
              <span
                aria-hidden
                className="grid size-8 place-items-center rounded-full bg-secondary text-xs font-semibold text-primary"
              >
                {initial}
              </span>
              <span className="max-w-[11rem] truncate text-sm text-muted-foreground">
                {userEmail}
              </span>
            </span>
            {signOutAction && (
              <form action={signOutAction}>
                <Button type="submit" variant="ghost" size="sm">
                  <LogOut className="size-4" />
                  Sign out
                </Button>
              </form>
            )}
          </div>
        ) : (
          <div className="hidden items-center gap-2 md:flex">
            <Button asChild variant="ghost" size="sm">
              <Link href="/login">Sign in</Link>
            </Button>
            <Button asChild size="sm">
              <Link href="/signup">Get started</Link>
            </Button>
          </div>
        )}

        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          className="inline-flex size-11 items-center justify-center rounded-md text-foreground transition-colors hover:bg-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 md:hidden"
          aria-label={open ? "Close menu" : "Open menu"}
          aria-expanded={open}
          aria-controls="mobile-nav"
        >
          {open ? <X className="size-5" /> : <Menu className="size-5" />}
        </button>
      </div>

      {open && (
        <div
          id="mobile-nav"
          className="border-t border-border/60 bg-background md:hidden"
        >
          <nav
            className="mx-auto flex max-w-6xl flex-col gap-1 px-4 py-3"
            aria-label="Mobile"
          >
            {NAV.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setOpen(false)}
                className="flex min-h-11 items-center rounded-md px-3 text-sm font-medium text-foreground transition-colors hover:bg-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-ring"
              >
                {item.label}
              </Link>
            ))}
            <div className="mt-2 flex flex-col gap-2">
              {authed ? (
                <>
                  <span className="px-3 text-sm text-muted-foreground">
                    Signed in as {userEmail}
                  </span>
                  {signOutAction && (
                    <form action={signOutAction}>
                      <Button
                        type="submit"
                        variant="outline"
                        className="w-full"
                      >
                        <LogOut className="size-4" />
                        Sign out
                      </Button>
                    </form>
                  )}
                </>
              ) : (
                <>
                  <Button
                    asChild
                    variant="outline"
                    onClick={() => setOpen(false)}
                  >
                    <Link href="/login">Sign in</Link>
                  </Button>
                  <Button asChild onClick={() => setOpen(false)}>
                    <Link href="/signup">Get started</Link>
                  </Button>
                </>
              )}
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}
