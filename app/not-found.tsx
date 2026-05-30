import Link from "next/link";

import { Logo } from "@/components/brand/logo";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <main className="grid min-h-screen place-items-center px-4 py-16">
      <div className="flex max-w-md flex-col items-center gap-5 text-center">
        <Link
          href="/"
          className="rounded-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
        >
          <Logo />
        </Link>
        <p className="font-display text-5xl font-semibold tracking-tight">
          404
        </p>
        <h1 className="font-display text-2xl font-semibold">
          We couldn&rsquo;t find that page
        </h1>
        <p className="text-muted-foreground">
          The link may be broken or the page may have moved. Let&rsquo;s get you
          back on track.
        </p>
        <div className="flex flex-wrap items-center justify-center gap-3">
          <Button asChild>
            <Link href="/">Back to home</Link>
          </Button>
          <Button asChild variant="outline">
            <Link href="/check">Try a free check</Link>
          </Button>
        </div>
      </div>
    </main>
  );
}
