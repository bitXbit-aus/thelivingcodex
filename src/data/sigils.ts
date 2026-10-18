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
  intention: string;
  vow: string;
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
] as const satisfies readonly Sigil[];

export const heartFlamePublicAttributionDetails = getSigilPublicAttribution(
  sigils[0],
);
export const heartFlamePublicAttribution =
  heartFlamePublicAttributionDetails.text;
