import {
  sigilPolicy,
  type SigilAttributionChoiceId,
  type SigilLicence,
  type SigilLicenceId,
} from "./sigilPolicy";

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

export interface SigilGovernanceEvidence {
  policyAcceptance: {
    version: typeof sigilPolicy.policyVersion;
    effectiveDate: typeof sigilPolicy.effectiveDate;
  };
  consentAndRightsConfirmation: {
    confirmedDate: string;
    rightsConfirmed: true;
    humanLicensorAuthorityConfirmed: true;
  };
  moderation: {
    status: "approved";
    decidedDate: string;
    decisionMakerRole: "Library steward";
  };
}

export interface SigilCore {
  id: string;
  slug: string;
  title: string;
  publicAttribution: SigilPublicAttribution;
  provenance?: SigilProvenance;
  createdDate: string;
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
    publishedDate: string;
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

export function getSigilPublicAttributionStatement(
  sigil: Pick<
    SigilCore,
    "title" | "createdDate" | "publicAttribution" | "licenceId" | "provenance"
  >,
): string {
  const creatorName =
    sigil.publicAttribution.mode === "anonymous"
      ? "Anonymous"
      : sigil.publicAttribution.displayName;
  const copyrightYear = sigil.createdDate.slice(0, 4);
  const licenceLabel = getConciseLicenceLabel(sigil.licenceId);
  const aiAssistance = sigil.provenance?.aiAssistance;
  const aiDisclosure = aiAssistance
    ? ` AI-assisted artwork created with ${aiAssistance.assistantName} (${aiAssistance.provider}).`
    : "";

  return `${sigil.title} © ${copyrightYear} ${creatorName}. Licensed under ${licenceLabel}.${aiDisclosure}`;
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
        version: sigilPolicy.policyVersion,
        effectiveDate: sigilPolicy.effectiveDate,
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
    },
    publication: {
      status: "published",
      publishedDate: "2026-10-19",
    },
  },
] as const satisfies readonly Sigil[];

export const heartFlamePublicAttribution =
  getSigilPublicAttributionStatement(sigils[0]);
