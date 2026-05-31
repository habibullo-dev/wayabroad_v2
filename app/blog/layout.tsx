import { AppHeader } from "@/components/layout/app-header";
import { SiteFooter } from "@/components/layout/site-footer";

/** Public shell (auth-aware nav, no auth gate) for the guide articles. */
export default function BlogLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen flex-col">
      <AppHeader />
      <main className="flex-1">{children}</main>
      <SiteFooter />
    </div>
  );
}
