import { getSigilLicenceLabel } from "@/data/sigils";
import type { SigilLicenceId } from "@/data/sigilPolicy";

/**
 * Plain-language licence helpers for the Living Sigil Library gallery.
 *
 * These summaries are informational only and are not legal advice. They state
 * what a visitor may and may not do, based on the licence the creator selected.
 */

const IRREVOCABILITY_NOTE =
  "Creative Commons licences cannot be revoked once applied, so requesting removal from the Library does not revoke rights already granted to others.";

/**
 * Whether a full-resolution download is offered for a work.
 * Only the two Creative Commons licences grant reuse rights, so only they
 * carry a download; the display-only licence does not.
 */
export function isSigilDownloadPermitted(licenceId: SigilLicenceId): boolean {
  return licenceId !== "display-only";
}

const LICENCE_SUMMARIES: Record<SigilLicenceId, string> = {
  "display-only":
    "This work may be viewed in the Library, but visitors receive no reuse rights. The creator retains copyright, and the Library's permission to display the work does not extend to reuse by anyone else.",
  "cc-by-4.0": `You may share and adapt this work, including commercially, as long as you give appropriate attribution to the creator. ${IRREVOCABILITY_NOTE}`,
  "cc-by-nc-sa-4.0": `You may share and adapt this work non-commercially, as long as you give appropriate attribution to the creator and license any adaptations under the same terms. ${IRREVOCABILITY_NOTE}`,
};

/**
 * One clear sentence a visitor can act on, describing what the licence allows.
 */
export function getSigilLicenceSummary(licenceId: SigilLicenceId): string {
  return LICENCE_SUMMARIES[licenceId];
}

/**
 * A short line explaining whether a download is offered, or why not.
 */
export function getSigilDownloadNote(licenceId: SigilLicenceId): string {
  if (!isSigilDownloadPermitted(licenceId)) {
    return "No download is offered for this work. Because it is displayed under a display-only licence, visitors receive no reuse rights, so the Library does not provide a separate copy.";
  }
  return "A full-resolution copy is offered for download under the licence described here.";
}

/**
 * The concise licence label (e.g. "CC BY 4.0") used for compact badges.
 * Derived from the full licence label so it always mirrors the policy source.
 */
export function getSigilLicenceShortLabel(licenceId: SigilLicenceId): string {
  const label = getSigilLicenceLabel(licenceId);
  return label.match(/\(([^()]+)\)$/)?.[1] ?? label;
}
