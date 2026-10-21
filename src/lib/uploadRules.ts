/**
 * Shared upload rules for every contributor-facing image upload.
 *
 * The scroll submission form and the sigil submission form both accept an
 * image. Their size cap, accepted image types (PNG / JPEG / WebP — SVG is
 * excluded) and re-encode rules are defined once here so the two forms cannot
 * drift apart. The numeric limits and the type allowlist are read from the
 * canonical upload-security policy rather than hardcoded, so a policy revision
 * updates every form at once.
 *
 * The naming is deliberately neutral: these rules govern any contributor image
 * upload, not sigil uploads specifically. The scroll form must not import a
 * sigil-named policy object to describe what governs scrolls; it imports these
 * shared rules instead.
 */
import { sigilPolicy } from "@/data/sigilPolicy";

const uploadSecurity = sigilPolicy.uploadSecurity;

export interface AcceptedImageType {
  mimeType: string;
  extensions: readonly string[];
}

export const UPLOAD_ACCEPTED_IMAGE_TYPES: readonly AcceptedImageType[] =
  uploadSecurity.acceptedImageTypes as readonly AcceptedImageType[];

export const UPLOAD_MAX_SIZE_MIB = uploadSecurity.maxUploadSizeMiB;
export const UPLOAD_MAX_SIZE_BYTES = uploadSecurity.maxUploadSizeBytes;
export const UPLOAD_SVG_ACCEPTED = uploadSecurity.svgAccepted;

/**
 * Pending originals are deleted within this many days of the moderation
 * decision. Read from the policy so the figure quoted to contributors cannot
 * diverge from the governing value.
 */
export const UPLOAD_RETENTION_DAYS_AFTER_DECISION =
  uploadSecurity.serverSideControls.pendingOriginalRetentionDaysAfterDecision;

export const UPLOAD_ACCEPTED_EXTENSIONS: readonly string[] =
  UPLOAD_ACCEPTED_IMAGE_TYPES.flatMap((type) => type.extensions);
export const UPLOAD_ACCEPTED_MIME_TYPES: readonly string[] =
  UPLOAD_ACCEPTED_IMAGE_TYPES.map((type) => type.mimeType);

/** Value for an `<input type="file">` `accept` attribute. */
export const UPLOAD_ACCEPT_ATTRIBUTE = UPLOAD_ACCEPTED_EXTENSIONS.join(",");

/**
 * The re-encode rules every upload path must follow. Recorded here — rather
 * than repeated in each form — so the two forms cannot diverge: every upload is
 * re-encoded client-side at identical pixel dimensions to drop EXIF / GPS /
 * device metadata, the re-encoded blob is re-checked against the size cap, and
 * the untouched original is never sent silently (an explicit opt-in is
 * required first). SVG is excluded until robust sanitisation exists.
 */
export const UPLOAD_REENCODE_RULES = {
  svgRejected: true,
  samePixelDimensions: true,
  reencodeInSourceFormat: true,
  stripMetadataBeforeUpload: true,
  revalidateSizeAfterReencode: true,
  neverSilentlySendOriginal: true,
} as const;

export function getFileExtension(filename: string): string {
  const index = filename.lastIndexOf(".");
  return index === -1 ? "" : filename.slice(index).toLowerCase();
}

/**
 * Preliminary client-side file validation, for early feedback only.
 *
 * Returns an error message, or null when the file passes the preliminary
 * checks. Treats the client-reported type and filename as untrusted: the
 * extension allowlist is authoritative when the browser reports an empty MIME
 * type (some browsers/OSes do that for genuine images), while the server still
 * inspects the real file.
 */
export function validateUploadFile(file: File): string | null {
  const extension = getFileExtension(file.name);
  const reportedType = file.type.toLowerCase();

  if (extension === ".svg" || reportedType === "image/svg+xml") {
    return "SVG files cannot be accepted. Please upload a PNG, JPEG, or WebP image.";
  }
  if (!UPLOAD_ACCEPTED_EXTENSIONS.includes(extension)) {
    return `Unsupported file extension. Accepted extensions: ${UPLOAD_ACCEPTED_EXTENSIONS.join(
      ", "
    )}.`;
  }
  if (reportedType && !UPLOAD_ACCEPTED_MIME_TYPES.includes(reportedType)) {
    return "The browser reported a file type we cannot accept. Please upload a PNG, JPEG, or WebP image.";
  }
  if (file.size > UPLOAD_MAX_SIZE_BYTES) {
    return `The image is larger than ${UPLOAD_MAX_SIZE_MIB} MiB. Please compress or resize it and try again.`;
  }
  return null;
}
