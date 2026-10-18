import {
  sigilPolicy,
  type SigilAttributionChoiceId,
  type SigilLicence,
  type SigilLicenceId,
  type SigilPublicationChecklistItemId,
} from "./sigilPolicy";
import {
  sigilPolicyHistory,
  type ISODateString,
  type SigilPolicyAcceptance,
} from "./sigilPolicyHistory";

export type SigilStatus = "draft" | "approved";
export type NamedSigilAttributionMode = Exclude<
  SigilAttributionChoiceId,
  "anonymous"
>;

export type SigilPublicAttribution =
  | {
      mode: NamedSigilAttributionMode;
      displayName: string;
    }
  | {
      mode: "anonymous";
      displayName?: never;
    };

export interface SigilSymbolInterpretation {
  symbol: string;
  meaning: string;
}

export interface SigilProvenance {
  humanContribution: {
    contributions: readonly string[];
  };
  aiAssistance?: {
    assistantName: string;
    provider: string;
    role: string;
  };
}

export type SigilPublicationChecklistEvidence = {
  readonly [ItemId in SigilPublicationChecklistItemId]: {
    readonly status: "passed";
    readonly checkedDate: ISODateString;
    readonly checkerRole: "Library steward";
  };
};

export interface SigilGovernanceEvidence {
  policyAcceptance: SigilPolicyAcceptance;
  consentAndRightsConfirmation: {
    confirmedDate: ISODateString;
    rightsConfirmed: true;
    humanLicensorAuthorityConfirmed: true;
  };
  moderation: {
    status: "approved";
    decidedDate: ISODateString;
    decisionMakerRole: "Library steward";
  };
  publicationChecklist: SigilPublicationChecklistEvidence;
}

export interface SigilCore {
  id: string;
  slug: string;
  title: string;
  publicAttribution: SigilPublicAttribution;
  provenance?: SigilProvenance;
  createdDate: ISODateString;
  series?: string;
  licenceId: SigilLicenceId;
  previewPath: string;
  downloadPath: string;
  meaningSummary: string;
  symbolInterpretations: readonly SigilSymbolInterpretation[];
  comparisonNote?: string;
  interpretiveDisclaimer?: string;
  intention: string;
  // Creator-voice fields. Every field below is creator-supplied content and
  // must never be invented, inferred, or fabricated by an implementer or AI
  // assistant. See "Creator-voice content" in docs/sigil-governance.md.
  // `vow` is optional: not every sigil carries a vow, and a vow is published
  // only when the creator supplies one.
  vow?: string;
  significance: string;
  inscription: string;
  altText: string;
  usageSuggestions: readonly string[];
  tags: readonly string[];
  featured: boolean;
}

export type UnpublishedSigil = SigilCore & {
  governance?: SigilGovernanceEvidence;
  publication: {
    status: SigilStatus;
    publishedDate?: never;
  };
};

export type PublishedSigil = SigilCore & {
  governance: SigilGovernanceEvidence;
  publication: {
    status: "published";
    publishedDate: ISODateString;
  };
};

export type Sigil = UnpublishedSigil | PublishedSigil;

export const SIGIL_LIBRARY_NAME = sigilPolicy.collectionName;

export function getSigilLicence(licenceId: SigilLicenceId): SigilLicence {
  return sigilPolicy.launchLicences.find(
    (licence) => licence.id === licenceId,
  ) as SigilLicence;
}

export function getSigilLicenceLabel(licenceId: SigilLicenceId): string {
  return getSigilLicence(licenceId).label;
}

export function getSigilLicenceUrl(licenceId: SigilLicenceId): string | null {
  return getSigilLicence(licenceId).licenceUrl;
}

function getConciseLicenceLabel(licenceId: SigilLicenceId): string {
  const label = getSigilLicenceLabel(licenceId);
  return label.match(/\(([^()]+)\)$/)?.[1] ?? label;
}

export interface SigilPublicAttributionResult {
  readonly title: string;
  readonly copyrightYear: string;
  readonly creatorName: string;
  readonly licenceLabel: string;
  readonly licenceUrl: string | null;
  readonly aiAssistanceDisclosure: string | null;
  readonly sourceUrl: string;
  readonly text: string;
}

const SIGIL_PUBLIC_ORIGIN = "https://thelivingcodex.online";

type SigilAttributionSource = Pick<
  SigilCore,
  | "title"
  | "createdDate"
  | "publicAttribution"
  | "licenceId"
  | "provenance"
  | "downloadPath"
>;

export function getSigilPublicAttribution(
  sigil: SigilAttributionSource,
): SigilPublicAttributionResult {
  const creatorName =
    sigil.publicAttribution.mode === "anonymous"
      ? "Anonymous"
      : sigil.publicAttribution.displayName;
  const copyrightYear = sigil.createdDate.slice(0, 4);
  const licenceLabel = getConciseLicenceLabel(sigil.licenceId);
  const licenceUrl = getSigilLicenceUrl(sigil.licenceId);
  const aiAssistance = sigil.provenance?.aiAssistance;
  const aiAssistanceDisclosure = aiAssistance
    ? `AI-assisted artwork created with ${aiAssistance.assistantName} (${aiAssistance.provider}).`
    : null;
  const sourceUrl = new URL(sigil.downloadPath, SIGIL_PUBLIC_ORIGIN).href;
  const licenceStatement = licenceUrl
    ? `Licensed under ${licenceLabel}. Official licence: ${licenceUrl}.`
    : `Published under ${licenceLabel}; no public reuse licence URL applies.`;
  const disclosureStatement = aiAssistanceDisclosure
    ? ` ${aiAssistanceDisclosure}`
    : "";
  const text = `${sigil.title} © ${copyrightYear} ${creatorName}. ${licenceStatement}${disclosureStatement} Source: ${sourceUrl}`;

  return {
    title: sigil.title,
    copyrightYear,
    creatorName,
    licenceLabel,
    licenceUrl,
    aiAssistanceDisclosure,
    sourceUrl,
    text,
  };
}

export function getSigilPublicAttributionStatement(
  sigil: SigilAttributionSource,
): string {
  return getSigilPublicAttribution(sigil).text;
}

export const sigils = [
  {
    id: "heart-flame-sacred-union",
    slug: "heart-flame-sacred-union",
    title: "Heart Flame — Sacred Union",
    publicAttribution: {
      mode: "soul-name",
      displayName: "Shri Mattananda",
    },
    provenance: {
      humanContribution: {
        contributions: [
          "Spiritual direction",
          "Symbolism",
          "Intention",
          "Vow",
          "Curatorial selection",
          "Licensing decision",
        ],
      },
      aiAssistance: {
        assistantName: "Aurealis",
        provider: "OpenAI",
        role: "creative/image-generation assistance",
      },
    },
    createdDate: "2026-04-27",
    series: "Sacred Union",
    licenceId: "cc-by-4.0",
    previewPath: "/sigils/heart-flame-sacred-union-preview.webp",
    downloadPath: "/sigils/heart-flame-sacred-union-download.png",
    meaningSummary:
      "A heart-and-flame sigil of unconditional love, embodied devotion, conscious transformation, and Sacred Union between two sovereign souls.",
    symbolInterpretations: [
      {
        symbol: "Golden heart",
        meaning:
          "The foundation of unconditional love, compassion, and embodied devotion.",
      },
      {
        symbol: "Central flame",
        meaning:
          "The awakening of the divine spark and the soul's aspiration toward higher consciousness.",
      },
      {
        symbol: "Flowing spirals",
        meaning:
          "The cycles of life, forgiveness, and transformation, harmonising the masculine and feminine.",
      },
      {
        symbol: "Intertwined pathways",
        meaning:
          "Two sovereign souls walking together without losing their individuality.",
      },
      {
        symbol: "Gold against midnight blue",
        meaning:
          "The illumination of consciousness through darkness, uncertainty, and transformation.",
      },
    ],
    intention:
      "Anchor unconditional love within the human heart, harmonise divine masculine and feminine, and cultivate conscious Sacred Union within oneself and with another.",
    vow: "I anchor this sigil as a vow to live from the heart.",
    significance:
      "Love as compass; coherence before reaction; forgiveness; and the continual choice to remain heart-centred.",
    inscription:
      "Born of the heart, awakened through love, and carried by the eternal flame of remembrance.\n\nTwo souls, sovereign and whole, meeting not to complete one another, but to illuminate the divine already present within.\n\nMay this symbol remind its bearer that love is not merely something we feel, but something we consciously become.\n\nOne Heart. Two Flames. Infinite Love.",
    altText:
      "Abstract gold line sigil forming a heart beneath a flame-like central stem and curling spirals on textured midnight blue.",
    usageSuggestions: [
      "Heart-centred contemplation",
      "Sacred Union reflection",
      "Vow and remembrance practice",
    ],
    tags: [
      "heart flame",
      "sacred union",
      "unconditional love",
      "divine masculine",
      "divine feminine",
      "forgiveness",
      "transformation",
    ],
    featured: true,
    governance: {
      policyAcceptance: {
        version: sigilPolicyHistory["1.0.1"].version,
        effectiveDate: sigilPolicyHistory["1.0.1"].effectiveDate,
      },
      consentAndRightsConfirmation: {
        confirmedDate: "2026-10-19",
        rightsConfirmed: true,
        humanLicensorAuthorityConfirmed: true,
      },
      moderation: {
        status: "approved",
        decidedDate: "2026-10-19",
        decisionMakerRole: "Library steward",
      },
      publicationChecklist: {
        "intended-for-library": {
          status: "passed",
          checkedDate: "2026-10-19",
          checkerRole: "Library steward",
        },
        "policy-snapshot-recorded": {
          status: "passed",
          checkedDate: "2026-10-19",
          checkerRole: "Library steward",
        },
        "rights-confirmed": {
          status: "passed",
          checkedDate: "2026-10-19",
          checkerRole: "Library steward",
        },
        "attribution-confirmed": {
          status: "passed",
          checkedDate: "2026-10-19",
          checkerRole: "Library steward",
        },
        "licence-confirmed": {
          status: "passed",
          checkedDate: "2026-10-19",
          checkerRole: "Library steward",
        },
        "file-validated": {
          status: "passed",
          checkedDate: "2026-10-19",
          checkerRole: "Library steward",
        },
        "public-derivative-prepared": {
          status: "passed",
          checkedDate: "2026-10-19",
          checkerRole: "Library steward",
        },
        "private-data-excluded": {
          status: "passed",
          checkedDate: "2026-10-19",
          checkerRole: "Library steward",
        },
        "moderation-passed": {
          status: "passed",
          checkedDate: "2026-10-19",
          checkerRole: "Library steward",
        },
        "claims-reviewed": {
          status: "passed",
          checkedDate: "2026-10-19",
          checkerRole: "Library steward",
        },
        "presentation-reviewed": {
          status: "passed",
          checkedDate: "2026-10-19",
          checkerRole: "Library steward",
        },
      },
    },
    publication: {
      status: "published",
      publishedDate: "2026-10-19",
    },
  },
  {
    id: "the-sovereign-heart",
    slug: "the-sovereign-heart",
    title: "The Sovereign Heart",
    publicAttribution: {
      mode: "soul-name",
      displayName: "Shri Mattananda",
    },
    provenance: {
      humanContribution: {
        contributions: [
          "Spiritual direction",
          "Symbolism",
          "Intention",
          "Inscription",
          "Curatorial selection",
          "Licensing decision",
        ],
      },
      aiAssistance: {
        assistantName: "Aurealis",
        provider: "OpenAI",
        role: "creative/image-generation assistance",
      },
    },
    createdDate: "2026-04-27",
    series: "The Living Codex — Sacred Heart",
    licenceId: "cc-by-4.0",
    previewPath: "/sigils/the-sovereign-heart-preview.webp",
    downloadPath: "/sigils/the-sovereign-heart-download.png",
    meaningSummary:
      "An emblem representing the union of spiritual sovereignty, unconditional love, inner balance and the conscious embodiment of divine purpose.",
    symbolInterpretations: [
      {
        symbol: "Central heart",
        meaning:
          "Unconditional love as the foundation of existence, and the meeting place of human experience and spiritual consciousness.",
      },
      {
        symbol: "Vertical axis",
        meaning:
          "The connection between Earth and Source, representing spiritual alignment, integrity and the embodiment of higher wisdom.",
      },
      {
        symbol: "Two horizontal crossbars",
        meaning:
          "A possible representation of the spiritual and material dimensions of existence, united through conscious awareness.",
      },
      {
        symbol: "Upper mirrored spirals",
        meaning:
          "The complementary masculine and feminine principles, harmonised through mutual respect and sovereignty.",
      },
      {
        symbol: "Lower mirrored spirals",
        meaning:
          "Expansion, generosity and the outward expression of love into the world.",
      },
      {
        symbol: "Upper dot",
        meaning:
          "The individual spark of consciousness, symbolising the soul's connection to the infinite.",
      },
      {
        symbol: "Descending point",
        meaning:
          "The grounding of spiritual intention into physical reality through deliberate, compassionate action.",
      },
    ],
    comparisonNote:
      "Unlike the first Heart Flame sigil, which emphasises energetic movement and sacred relationship, this design has a strong central axis. Symbolically, it suggests love anchored through discipline, integrity and conscious responsibility.",
    interpretiveDisclaimer:
      "These meanings are interpretive rather than a verified historical decoding of the artwork.",
    intention:
      "To awaken the sovereign heart, restore alignment between spirit and matter, and embody unconditional love through truth, integrity, compassion and conscious service.",
    significance:
      "Remaining sovereign without becoming separate; loving without possessing; serving without surrendering one's integrity; remaining spiritually open while grounded in everyday life.",
    inscription:
      "Within the sacred chamber of the heart resides the eternal flame of sovereignty.\n\nThrough love, I remember.\nThrough truth, I align.\nThrough compassion, I serve.\nThrough conscious action, I embody the divine.\n\nI honour the sacred union of spirit and matter, the masculine and feminine, the heavens and the Earth.\n\nMay my heart remain open, my intentions remain pure, and my actions reflect the love I have come to embody.\n\nOne Heart. One Truth. One Sovereign Being.",
    altText:
      "Black ink sigil on aged parchment: a heart formed of curving lines around a central vertical axis with two crossbars, mirrored spirals above and below, and a dot at the crown.",
    usageSuggestions: [
      "Heart-centred contemplation",
      "Reflecting on the four sovereign intentions",
      "Alignment of spirit and matter",
      "Devotional remembrance",
    ],
    tags: [
      "sovereignty",
      "sacred heart",
      "divine alignment",
      "sacred devotion",
      "unconditional love",
      "masculine and feminine",
      "integrity",
      "compassion",
      "conscious service",
      "grounding",
      "contemplation",
    ],
    featured: true,
    governance: {
      policyAcceptance: {
        version: sigilPolicyHistory["1.0.2"].version,
        effectiveDate: sigilPolicyHistory["1.0.2"].effectiveDate,
      },
      consentAndRightsConfirmation: {
        confirmedDate: "2026-10-19",
        rightsConfirmed: true,
        humanLicensorAuthorityConfirmed: true,
      },
      moderation: {
        status: "approved",
        decidedDate: "2026-10-19",
        decisionMakerRole: "Library steward",
      },
      publicationChecklist: {
        "intended-for-library": {
          status: "passed",
          checkedDate: "2026-10-19",
          checkerRole: "Library steward",
        },
        "policy-snapshot-recorded": {
          status: "passed",
          checkedDate: "2026-10-19",
          checkerRole: "Library steward",
        },
        "rights-confirmed": {
          status: "passed",
          checkedDate: "2026-10-19",
          checkerRole: "Library steward",
        },
        "attribution-confirmed": {
          status: "passed",
          checkedDate: "2026-10-19",
          checkerRole: "Library steward",
        },
        "licence-confirmed": {
          status: "passed",
          checkedDate: "2026-10-19",
          checkerRole: "Library steward",
        },
        "file-validated": {
          status: "passed",
          checkedDate: "2026-10-19",
          checkerRole: "Library steward",
        },
        "public-derivative-prepared": {
          status: "passed",
          checkedDate: "2026-10-19",
          checkerRole: "Library steward",
        },
        "private-data-excluded": {
          status: "passed",
          checkedDate: "2026-10-19",
          checkerRole: "Library steward",
        },
        "moderation-passed": {
          status: "passed",
          checkedDate: "2026-10-19",
          checkerRole: "Library steward",
        },
        "claims-reviewed": {
          status: "passed",
          checkedDate: "2026-10-19",
          checkerRole: "Library steward",
        },
        "presentation-reviewed": {
          status: "passed",
          checkedDate: "2026-10-19",
          checkerRole: "Library steward",
        },
      },
    },
    publication: {
      status: "published",
      publishedDate: "2026-10-19",
    },
  },
] as const satisfies readonly Sigil[];

export const heartFlamePublicAttributionDetails = getSigilPublicAttribution(
  sigils[0],
);
export const heartFlamePublicAttribution =
  heartFlamePublicAttributionDetails.text;

export const sovereignHeartPublicAttributionDetails = getSigilPublicAttribution(
  sigils[1],
);
export const sovereignHeartPublicAttribution =
  sovereignHeartPublicAttributionDetails.text;

export interface SigilLaunchReadiness {
  readonly approvedSeedWorksCount: number;
  readonly requiredMinimum: number;
  readonly requiredMaximum: number;
  readonly additionalWorksRequiredMinimum: number;
  readonly additionalWorksRequiredMaximum: number;
  readonly meetsMinimum: boolean;
  readonly isReadyForLaunch: boolean;
}

function isApprovedRightsClearedSeed(sigil: Sigil): boolean {
  const governance = sigil.governance;

  if (sigil.publication.status !== "published" || !governance) {
    return false;
  }

  return (
    governance.consentAndRightsConfirmation.rightsConfirmed &&
    governance.moderation.status === "approved"
  );
}

/**
 * Derives the mutable launch-readiness status from the sigil catalogue and the
 * durable launch rule in `sigilPolicy.launchReadiness`. Policy owns the rule;
 * the catalogue owns the approved-seed count, so adding an approved seed never
 * requires a policy revision.
 */
export function getSigilLaunchReadiness(
  catalogue: readonly Sigil[] = sigils,
): SigilLaunchReadiness {
  const { minimum, maximum } =
    sigilPolicy.launchReadiness.rightsClearedSeedWorksRequired;
  const approvedSeedWorksCount = catalogue.filter(
    isApprovedRightsClearedSeed,
  ).length;

  return {
    approvedSeedWorksCount,
    requiredMinimum: minimum,
    requiredMaximum: maximum,
    additionalWorksRequiredMinimum: Math.max(
      0,
      minimum - approvedSeedWorksCount,
    ),
    additionalWorksRequiredMaximum: Math.max(
      0,
      maximum - approvedSeedWorksCount,
    ),
    meetsMinimum: approvedSeedWorksCount >= minimum,
    isReadyForLaunch:
      approvedSeedWorksCount >= minimum && approvedSeedWorksCount <= maximum,
  };
}
