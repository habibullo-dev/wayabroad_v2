import type { Metadata } from "next";

import "./globals.css";
import { cn } from "@/lib/utils";
import { APP_NAME, APP_TAGLINE } from "@/lib/config";
import { APP_URL } from "@/lib/env";

export const metadata: Metadata = {
  title: {
    default: `${APP_NAME} — ${APP_TAGLINE}`,
    template: `%s · ${APP_NAME}`,
  },
  description:
    "AI-powered study-abroad admissions for Korea: a ranked university shortlist, transparent admission-probability scores, and instant SOP / Study Plan drafts.",
  metadataBase: new URL(APP_URL),
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={cn(
          "min-h-screen bg-background font-sans text-foreground antialiased",
        )}
      >
        {children}
      </body>
    </html>
  );
}
