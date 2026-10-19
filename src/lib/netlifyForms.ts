/**
 * Netlify Forms submission helpers.
 *
 * Netlify times out form submissions after 30 seconds. The client timeout here
 * is deliberately slightly longer (35 s) so a stalled upload is aborted and the
 * contributor regains control instead of staring at a permanently disabled
 * button. Netlify Forms does not accept JSON and requires one file per field.
 */

export const NETLIFY_FORM_TIMEOUT_MS = 35_000;

export type NetlifySubmitResult =
  | { kind: "ok"; status: number }
  | { kind: "http"; status: number }
  | { kind: "timeout" }
  | { kind: "network" };

interface SubmitOptions {
  timeoutMs?: number;
  /** Only set for the urlencoded scroll form; FormData must set its own boundary. */
  contentType?: "application/x-www-form-urlencoded";
}

export async function submitNetlifyForm(
  body: FormData | URLSearchParams,
  { timeoutMs = NETLIFY_FORM_TIMEOUT_MS, contentType }: SubmitOptions = {}
): Promise<NetlifySubmitResult> {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);

  try {
    const response = await fetch("/", {
      method: "POST",
      ...(contentType ? { headers: { "Content-Type": contentType } } : {}),
      body,
      signal: controller.signal,
    });

    return response.ok
      ? { kind: "ok", status: response.status }
      : { kind: "http", status: response.status };
  } catch {
    return controller.signal.aborted ? { kind: "timeout" } : { kind: "network" };
  } finally {
    clearTimeout(timer);
  }
}
