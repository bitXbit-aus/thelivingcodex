import type { ISODateString } from "./sigilPolicyHistory";

export const sigilPolicy = {
  policyVersion: "1.0.1",
  effectiveDate: "2026-10-19" satisfies ISODateString,
  submissionPolicySnapshot: {
    required: true,
    fields: ["policyVersion", "policyEffectiveDate"] as const,
    description:
      "Persist the policy version and effective date accepted with every future submission.",
  },
  collectionName: "Living Sigil Library",
  attributionChoices: [
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
  ],
  launchLicences: [
    {
      id: "display-only",
      label: "Display only",
      licenceUrl: null,
      description:
        "The contributor retains copyright and gives The Living Codex withdrawable permission to operate and promote the work's Living Sigil Library entry. Visitors receive no reuse rights.",
      terms: {
        contributorRetainsCopyright: true,
        permission: {
          exclusive: false,
          worldwide: true,
          royaltyFree: true,
          withdrawable: true,
        },
        permittedProjectUses: [
          "Store and back up the work.",
          "Reproduce the work for its Living Sigil Library entry.",
          "Resize, re-encode, and generate thumbnails, accessibility previews, or promotional previews without materially altering the artwork.",
          "Deliver the work through hosting, CDN, and other service providers.",
          "Publicly display the work solely to operate and promote its Living Sigil Library entry.",
        ],
        visitorReuseRightsGranted: false,
        materialArtworkChangesRequireSeparateCreatorApproval: true,
        withdrawal:
          "After a verified withdrawal request, The Living Codex will stop future distribution and remove public copies within a reasonable period. Limited copies may remain temporarily in controlled backups or service-provider systems until ordinary retention and deletion cycles complete.",
      },
    },
    {
      id: "cc-by-4.0",
      label: "Creative Commons Attribution 4.0 International (CC BY 4.0)",
      licenceUrl: "https://creativecommons.org/licenses/by/4.0/",
      description:
        "CC BY 4.0 permits sharing and adaptation, including commercial use, when the licence terms are followed, including attribution.",
      irrevocabilityNotice:
        "Creative Commons licences are irrevocable once applied. Removing the work from The Living Codex does not revoke rights already received by others under the licence.",
    },
    {
      id: "cc-by-nc-sa-4.0",
      label:
        "Creative Commons Attribution-NonCommercial-ShareAlike 4.0 International (CC BY-NC-SA 4.0)",
      licenceUrl: "https://creativecommons.org/licenses/by-nc-sa/4.0/",
      description:
        "CC BY-NC-SA 4.0 permits non-commercial sharing and adaptation when the licence terms are followed, including attribution and licensing adaptations under the same terms.",
      irrevocabilityNotice:
        "Creative Commons licences are irrevocable once applied. Removing the work from The Living Codex does not revoke rights already received by others under the licence.",
    },
  ],
  legal: {
    projectProvidesLegalAdvice: false,
    notice:
      "Licence summaries are informational only. Contributors and visitors should read the official terms and obtain qualified legal advice when needed.",
    qualifiedReviewRequiredBeforePublicFormLaunch: true,
    creativeCommonsGuidanceUrl:
      "https://creativecommons.org/share-your-work/cclicenses/",
  },
  seedEligibility: {
    humanLicensorRequired: true,
    aiSystemsAreLegalLicensorsOrCopyrightOwners: false,
    stewardDirectedAIAssistedWork: {
      eligible: true,
      requirements: [
        "A human licensor has authority to submit the work and apply the selected licence.",
        "Human creative contribution and AI assistance are accurately disclosed.",
        "Required rights and provenance are recorded.",
        "The work passes the normal moderation and publication checks.",
      ],
    },
    ineligible: [
      "Unowned or generic generated placeholders.",
      "Third-party works without confirmed rights.",
    ],
  },
  uploadSecurity: {
    maxUploadSizeMiB: 5,
    maxUploadSizeBytes: 5 * 1024 * 1024,
    acceptedImageTypes: [
      { mimeType: "image/png", extensions: [".png"] },
      { mimeType: "image/jpeg", extensions: [".jpg", ".jpeg"] },
      { mimeType: "image/webp", extensions: [".webp"] },
    ],
    svgAccepted: false,
    clientProvidedFilenameTrusted: false,
    clientProvidedMimeTypeTrusted: false,
    preliminaryChecks: {
      extensionAllowlistRequired: true,
      reportedMimeTypeCheckRequired: true,
      notice:
        "Extension and client-reported MIME checks are preliminary only and cannot establish a file's true type or safety.",
    },
    serverSideControls: {
      signatureAndTypeInspectionRequired: true,
      boundedImageDecodeRequired: true,
      imageLimits: {
        maxWidthPixels: 10_000,
        maxHeightPixels: 10_000,
        maxPixelCount: 40_000_000,
      },
      approvedPublicDerivativeReencodeRequired: true,
      unnecessaryMetadataRemovalRequired: true,
      generatedStorageFilenameRequired: true,
      pendingOriginalStorage:
        "Private and outside the public webroot, or in equivalently segregated non-public storage.",
      originalAccessControlled: true,
      originalRetentionLimited: true,
      laterDynamicSystemRequirements: [
        "Per-user and per-origin upload rate limits.",
        "Aggregate upload and storage quotas.",
      ],
    },
  },
  privacyAndPublicationRequirements: {
    contributorEmail: {
      classification: "private",
      mayPublish: false,
      allowedUses: [
        "Submission follow-up",
        "Collection administration",
        "Correction, reconsideration, and removal requests",
      ],
    },
    anonymousAttribution: {
      publicContributorName: false,
      privateSubmissionRecordMayBeRetained: true,
      privateRecordPurposes: [
        "Review the work",
        "Document permission",
        "Respond to concerns",
        "Administer correction and removal requests",
      ],
      publicAssetMetadataProtection:
        "Decode and re-encode the public asset and remove unnecessary EXIF and other metadata that could identify or locate the contributor.",
    },
    publicRecordMustExclude: [
      "Private email addresses",
      "Private legal names when another attribution option was selected",
      "Submission notes and other non-public administration data",
      "Unnecessary embedded image metadata",
    ],
    selectedAttributionAndLicenceMustBeDisplayed: true,
  },
  moderation: {
    submissionGuaranteesPublication: false,
    decisionMaker: "Moderators",
    principles: [
      "Apply decisions consistently, proportionately, and with respect for privacy.",
      "Sacred or spiritual framing does not exempt a submission from review.",
      "Publication is not an independent verification of authorship, ownership, or claimed outcomes.",
    ],
    reasons: [
      {
        id: "ownership-or-permission",
        label: "Ownership or permission concern",
        description:
          "Authorship, provenance, consent, or authority to submit the work and select its licence is missing, unclear, or disputed.",
      },
      {
        id: "hateful-or-targeted-abuse",
        label: "Hateful or targeted abuse",
        description:
          "The submission promotes hatred, harassment, exploitation, or targeted abuse against a person or group.",
      },
      {
        id: "personal-privacy-or-cultural-concern",
        label: "Personal, privacy, or cultural concern",
        description:
          "The submission exposes non-consensual personal information or raises unresolved privacy, consent, cultural, or community-rights concerns.",
      },
      {
        id: "dangerous-instructions-or-harmful-claims",
        label: "Dangerous instructions or harmful claims",
        description:
          "The submission promotes dangerous or unlawful conduct, or makes misleading guarantees about medical, psychological, therapeutic, energetic, financial, or other outcomes.",
      },
      {
        id: "copyright-or-trademark-conflict",
        label: "Copyright or trademark conflict",
        description:
          "The work appears to infringe or conflict with another party's copyright, trademark, or related rights.",
      },
      {
        id: "malicious-or-unsafe-file",
        label: "Malicious or unsafe file",
        description:
          "The file is unreadable, deceptive, malicious, technically unsafe, or cannot be processed within the publication security limits.",
      },
      {
        id: "deception-or-misrepresentation",
        label: "Deception or misrepresentation",
        description:
          "The submission materially misrepresents its creator, provenance, permissions, purpose, contents, or relationship to The Living Codex.",
      },
      {
        id: "collection-purpose-conflict",
        label: "Conflict with collection purpose",
        description:
          "The submission materially conflicts with the stated purpose, care, or public presentation of the Living Sigil Library.",
      },
    ],
    permittedMetadataCorrections: true,
    metadataCorrectionConditions: [
      "The correction is authorised or otherwise supported by the submission record.",
      "The correction is documented without materially altering the artwork.",
    ],
    artworkAlterationRequiresCreatorApproval: true,
    reconsiderationRoute: "/contact/",
    correctionAndRemovalRoute: "/contact/",
  },
  publicationChecklist: [
    {
      id: "intended-for-library",
      label: "Collection intent confirmed",
      requirement:
        "The work is explicitly intended for the Living Sigil Library.",
    },
    {
      id: "policy-snapshot-recorded",
      label: "Policy snapshot recorded",
      requirement:
        "The accepted policy version and effective date are stored with the submission.",
    },
    {
      id: "rights-confirmed",
      label: "Rights and permission confirmed",
      requirement:
        "Original authorship or adequate permission to submit and apply the selected licence is confirmed; any human creative contribution and AI assistance are accurately disclosed; required rights and provenance are recorded; and known third-party concerns are resolved or documented.",
    },
    {
      id: "attribution-confirmed",
      label: "Attribution confirmed",
      requirement:
        "Real name, soul name, or Anonymous is explicitly selected and the public text matches that choice.",
    },
    {
      id: "licence-confirmed",
      label: "Licence confirmed",
      requirement:
        "A launch licence is explicitly selected and its public label and official link, where applicable, are correct.",
    },
    {
      id: "file-validated",
      label: "File validated",
      requirement:
        "The upload is within 5 MiB, matches an allowed extension and server-inspected PNG, JPEG, or WebP type, and satisfies decode, dimension, pixel-count, and safety limits.",
    },
    {
      id: "public-derivative-prepared",
      label: "Safe public derivative prepared",
      requirement:
        "The approved public asset uses a generated filename, has been decoded and re-encoded, and has unnecessary EXIF and other metadata removed.",
    },
    {
      id: "private-data-excluded",
      label: "Private data excluded",
      requirement:
        "The public record contains no private email, restricted identity information, submission notes, or unnecessary embedded metadata.",
    },
    {
      id: "moderation-passed",
      label: "Moderation passed",
      requirement:
        "A moderator has reviewed the work against every structured moderation reason and recorded the decision.",
    },
    {
      id: "claims-reviewed",
      label: "Outcome claims reviewed",
      requirement:
        "The title, description, artwork context, and accompanying text do not promise guaranteed outcomes or replace qualified professional care.",
    },
    {
      id: "presentation-reviewed",
      label: "Publication presentation reviewed",
      requirement:
        "The final entry is accurate, accessible, respectful, and includes the correction, reconsideration, and removal route.",
    },
  ],
  launchReadiness: {
    responsibleRole: "Library steward",
    rightsClearedSeedWorksRequired: { minimum: 3, maximum: 6 },
    approvedSeedWorksCount: 1,
    additionalRightsClearedSeedWorksRequired: { minimum: 2, maximum: 5 },
    status:
      "Heart Flame is approved as one rights-cleared seed work. A further 2–5 steward-provided, rights-cleared works are required to reach the 3–6 work launch range.",
  },
} as const;

export type SigilPolicy = typeof sigilPolicy;
export type SigilLicence = SigilPolicy["launchLicences"][number];
export type SigilLicenceId = SigilLicence["id"];
export type SigilAttributionChoice =
  SigilPolicy["attributionChoices"][number];
export type SigilAttributionChoiceId = SigilAttributionChoice["id"];
export type SigilAcceptedImageType =
  SigilPolicy["uploadSecurity"]["acceptedImageTypes"][number];
export type SigilAcceptedImageMimeType = SigilAcceptedImageType["mimeType"];
export type SigilModerationReason =
  SigilPolicy["moderation"]["reasons"][number];
export type SigilModerationReasonId = SigilModerationReason["id"];
export type SigilPublicationChecklistItem =
  SigilPolicy["publicationChecklist"][number];
export type SigilPublicationChecklistItemId =
  SigilPublicationChecklistItem["id"];

// Read-only compatibility views; `sigilPolicy` remains the canonical definition.
export const SIGIL_COLLECTION_NAME = sigilPolicy.collectionName;
export const SIGIL_LAUNCH_LICENCES = sigilPolicy.launchLicences;
export const SIGIL_ATTRIBUTION_CHOICES = sigilPolicy.attributionChoices;
export const SIGIL_ACCEPTED_IMAGE_TYPES =
  sigilPolicy.uploadSecurity.acceptedImageTypes;
export const SIGIL_MAX_UPLOAD_SIZE_MIB =
  sigilPolicy.uploadSecurity.maxUploadSizeMiB;
export const SIGIL_MAX_UPLOAD_SIZE_BYTES =
  sigilPolicy.uploadSecurity.maxUploadSizeBytes;
export const SIGIL_MODERATION_PRINCIPLES =
  sigilPolicy.moderation.principles;
export const SIGIL_REMOVAL_OR_CORRECTION_ROUTE =
  sigilPolicy.moderation.correctionAndRemovalRoute;
