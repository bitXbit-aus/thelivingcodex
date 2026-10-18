export const SIGIL_COLLECTION_NAME = "Living Sigil Library" as const;

export type SigilLicenceId =
  | "display-only"
  | "cc-by-4.0"
  | "cc-by-nc-sa-4.0";

export interface SigilLicenceDefinition {
  id: SigilLicenceId;
  label: string;
  description: string;
  licenceUrl: string | null;
}

export const SIGIL_LAUNCH_LICENCES = [
  {
    id: "display-only",
    label: "Display only",
    description:
      "The contributor permits the work to be displayed in the Living Sigil Library. This permission does not grant visitors a right to copy, adapt, distribute, or otherwise reuse the work.",
    licenceUrl: null,
  },
  {
    id: "cc-by-4.0",
    label: "Creative Commons Attribution 4.0 International (CC BY 4.0)",
    description:
      "The contributor offers the work under CC BY 4.0. Reuse may be permitted with attribution and subject to the licence terms; visitors should review the full licence before relying on those permissions.",
    licenceUrl: "https://creativecommons.org/licenses/by/4.0/",
  },
  {
    id: "cc-by-nc-sa-4.0",
    label:
      "Creative Commons Attribution-NonCommercial-ShareAlike 4.0 International (CC BY-NC-SA 4.0)",
    description:
      "The contributor offers the work under CC BY-NC-SA 4.0. Reuse may be permitted for non-commercial purposes with attribution and ShareAlike obligations, subject to the licence terms; visitors should review the full licence before relying on those permissions.",
    licenceUrl: "https://creativecommons.org/licenses/by-nc-sa/4.0/",
  },
] as const satisfies readonly SigilLicenceDefinition[];

export type SigilAttributionChoiceId =
  | "real-name"
  | "soul-name"
  | "anonymous";

export interface SigilAttributionChoice {
  id: SigilAttributionChoiceId;
  label: string;
  description: string;
}

export const SIGIL_ATTRIBUTION_CHOICES = [
  {
    id: "real-name",
    label: "Real name",
    description: "Publish the contributor's chosen real name with the sigil.",
  },
  {
    id: "soul-name",
    label: "Soul name",
    description: "Publish the contributor's chosen soul name with the sigil.",
  },
  {
    id: "anonymous",
    label: "Anonymous",
    description: "Publish the sigil without a public contributor name.",
  },
] as const satisfies readonly SigilAttributionChoice[];

export type SigilAcceptedImageMimeType =
  | "image/png"
  | "image/jpeg"
  | "image/webp";

export const SIGIL_ACCEPTED_IMAGE_TYPES = [
  { mimeType: "image/png", extensions: [".png"] },
  { mimeType: "image/jpeg", extensions: [".jpg", ".jpeg"] },
  { mimeType: "image/webp", extensions: [".webp"] },
] as const satisfies readonly {
  mimeType: SigilAcceptedImageMimeType;
  extensions: readonly string[];
}[];

export const SIGIL_MAX_UPLOAD_SIZE_MB = 5 as const;
export const SIGIL_MAX_UPLOAD_SIZE_BYTES =
  SIGIL_MAX_UPLOAD_SIZE_MB * 1024 * 1024;

export const SIGIL_MODERATION_PRINCIPLES = [
  "Submission does not guarantee publication; each work is reviewed before it enters the public library.",
  "A submission may be declined or removed when authorship or permission is unclear, when it infringes another person's rights, or when required information is missing.",
  "A submission may be declined or removed when it promotes harm, hatred, harassment, exploitation, deception, unlawful activity, or claims guaranteed medical, psychological, or energetic outcomes.",
  "Moderation decisions should respect the sacred intention of the collection while remaining clear, consistent, privacy-conscious, and open to correction.",
] as const;

export const SIGIL_REMOVAL_OR_CORRECTION_ROUTE = "/contact/" as const;

export const sigilPolicy = {
  collectionName: SIGIL_COLLECTION_NAME,
  launchLicences: SIGIL_LAUNCH_LICENCES,
  attributionChoices: SIGIL_ATTRIBUTION_CHOICES,
  acceptedImageTypes: SIGIL_ACCEPTED_IMAGE_TYPES,
  maximumUploadSizeMb: SIGIL_MAX_UPLOAD_SIZE_MB,
  maximumUploadSizeBytes: SIGIL_MAX_UPLOAD_SIZE_BYTES,
  moderationPrinciples: SIGIL_MODERATION_PRINCIPLES,
  removalOrCorrectionRoute: SIGIL_REMOVAL_OR_CORRECTION_ROUTE,
} as const;
