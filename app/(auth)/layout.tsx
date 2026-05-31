import Link from "next/link";

import { Logo } from "@/components/brand/logo";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen flex-col">
      <header className="px-4 py-5 sm:px-6">
        <Link
          href="/"
          className="inline-flex rounded-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
        >
          <Logo />
        </Link>
      </header>
      <main className="orb-glow flex flex-1 items-center justify-center px-4 py-10">
        {children}
      </main>
    </div>
  );
}
