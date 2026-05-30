"use client";

import { useEffect } from "react";
import Link from "next/link";
import { RefreshCw } from "lucide-react";

import { Button } from "@/components/ui/button";

/** Route-segment error boundary. Catches render/data errors below the root layout. */
export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Surface in the console for now; wire to Sentry when observability lands.
    // eslint-disable-next-line no-console
    console.error(error);
  }, [error]);

  return (
    <main className="grid min-h-screen place-items-center px-4 py-16">
      <div className="flex max-w-md flex-col items-center gap-5 text-center">
        <h1 className="font-display text-2xl font-semibold">
          Something went wrong
        </h1>
        <p className="text-muted-foreground">
          An unexpected error interrupted this page. You can try again, or head
          back home.
        </p>
        <div className="flex flex-wrap items-center justify-center gap-3">
          <Button onClick={reset}>
            <RefreshCw className="size-4" aria-hidden />
            Try again
          </Button>
          <Button asChild variant="outline">
            <Link href="/">Back to home</Link>
          </Button>
        </div>
      </div>
    </main>
  );
}
