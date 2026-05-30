import { signOut } from "@/lib/auth/actions";
import { getCurrentUser } from "@/lib/auth/user";
import { SiteHeader } from "@/components/layout/site-header";

/** Server wrapper: reads the session and hands the auth-aware nav its state + sign-out action. */
export async function AppHeader() {
  const user = await getCurrentUser();
  return <SiteHeader userEmail={user?.email ?? null} signOutAction={signOut} />;
}
