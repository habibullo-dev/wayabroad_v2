import "server-only";

import {
  STATUS_LABELS,
  type ApplicationStatus,
} from "@/lib/applications/status";
import { IS_RESEND_CONFIGURED } from "@/lib/env.server";

/**
 * Email-notification stub (M5). Logs in dev; no real send yet. To enable, POST to the Resend
 * API here when IS_RESEND_CONFIGURED — the call sites already pass everything needed.
 */
export async function sendStatusNotification(params: {
  to: string | null;
  programName: string;
  status: ApplicationStatus;
}): Promise<void> {
  const subject = `Your ${params.programName} application is now: ${STATUS_LABELS[params.status]}`;
  if (process.env.NODE_ENV === "development") {
    // eslint-disable-next-line no-console
    console.debug(
      `[email:stub] → ${params.to ?? "(no email)"} · ${subject}` +
        (IS_RESEND_CONFIGURED ? " (Resend configured — wiring pending)" : ""),
    );
  }
  // TODO(M5+): when IS_RESEND_CONFIGURED, send via https://api.resend.com/emails.
}
