import {
  sigilPolicy,
  type SigilAttributionChoiceId,
  type SigilLicence,
  type SigilLicenceId,
  type SigilPublicationChecklistItemId,
} from "./sigilPolicy";
import {
  sigilPolicyHistory,
  type Digit,
  type ISODateString,
  type SigilPolicyAcceptance,
} from "./sigilPolicyHistory";

/**
 * A permanent registry identifier: the prefix declared by
 * `sigilPolicy.registry.idPrefix` followed by four digits. Deriving the prefix
 * from the policy keeps the prefix and the policy in lockstep.
 *
 * The digit count is repeated literally here because TypeScript cannot derive a
 * digit count from a numeric value. `sigilPolicy.registry.idDigits` documents
 * the same count for readers; if either changes, both must change together.
 */
export type SigilRegistryId = `${typeof sigilPolicy.registry.idPrefix}${Digit}${Digit}${Digit}${Digit}`;

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
  /**
   * Permanent registry identifier assigned in order of admission to the
   * Library. Required: omitting it from a record is a compile error.
   */
  registryId: SigilRegistryId;
  title: string;
  publicAttribution: SigilPublicAttribution;
  provenance?: SigilProvenance;
  createdDate: ISODateString;
  /**
   * The work's ceremonial subtitle, as supplied by the creator. Optional —
   * never inferred from `title`.
   */
  subtitle?: string;
  series?: string;
  licenceId: SigilLicenceId;
  previewPath: string;
  downloadPath: string;
  // Creator-voice fields. Every field in this block is creator-supplied
  // content and is optional. An implementer or AI assistant must never invent,
  // infer, paraphrase, or compose these fields — including by assembling the
  // creator's own phrases into new sentences or summarising them into a new
  // statement. An omitted field is correct; a composed field is a breach. See
  // "Creator-voice content" in docs/sigil-governance.md.
  meaningSummary?: string;
  symbolInterpretations?: readonly SigilSymbolInterpretation[];
  comparisonNote?: string;
  interpretiveDisclaimer?: string;
  intention?: string;
  vow?: string;
  motto?: string;
  significance?: string;
  inscription?: string;
  usageSuggestions?: readonly string[];
  // `altText` is a factual accessibility description of the visible artwork,
  // not creator voice, so it remains required.
  altText: string;
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

/**
 * The concise licence label (e.g. "CC BY 4.0") used for compact badges.
 * Derived from the full licence label so it always mirrors the policy source.
 *
 * This is the single canonical implementation; `@/lib/sigilLicenses`
 * re-exports it rather than duplicating the logic. It lives here, in the
 * data layer, because that layer is the dependency root — the reverse
 * direction would create an import cycle.
 */
export function getSigilLicenceShortLabel(
  licenceId: SigilLicenceId,
): string {
  const label = getSigilLicenceLabel(licenceId);
  return label.match(/\(([^()]+)\)$/)?.[1] ?? label;
}

export interface SigilPublicAttributionResult {
  readonly title: string;
  readonly registryId: SigilRegistryId;
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
  | "registryId"
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
  const licenceLabel = getSigilLicenceShortLabel(sigil.licenceId);
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
  const text = `${sigil.title} (${sigil.registryId}) © ${copyrightYear} ${creatorName}. ${licenceStatement}${disclosureStatement} Source: ${sourceUrl}`;

  return {
    title: sigil.title,
    registryId: sigil.registryId,
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
    registryId: "TLC-SIG-0001",
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
        "registry-id-assigned": {
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
        "creator-voice-recorded": {
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
    registryId: "TLC-SIG-0002",
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
        "registry-id-assigned": {
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
        "creator-voice-recorded": {
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
    id: "the-mycelial-witness",
    slug: "the-mycelial-witness",
    registryId: "TLC-SIG-0003",
    title: "The Mycelial Witness",
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
          "Inscriptions",
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
    series: "The Living Codex — Earth Intelligence",
    licenceId: "cc-by-4.0",
    previewPath: "/sigils/the-mycelial-witness-preview.webp",
    downloadPath: "/sigils/the-mycelial-witness-download.png",
    meaningSummary:
      "A symbolic representation of the interconnected intelligence of nature, the unseen networks beneath our feet and humanity's relationship with the living Earth.",
    symbolInterpretations: [
      {
        symbol: "The enclosing circle",
        meaning:
          "Unity and wholeness; represents the interconnected biosphere, the cycles of life and the understanding that no living being exists entirely independently.",
      },
      {
        symbol: "The mushroom crown",
        meaning:
          "The fruiting of hidden wisdom; the mushroom symbolises the visible emergence of an extensive, usually concealed fungal network, and can represent insights emerging from unseen processes.",
      },
      {
        symbol: "The central eye or seed",
        meaning:
          "Inner awareness; the small circle within the mushroom cap suggests the seed of consciousness, intuition and the capacity to observe beneath surface appearances.",
      },
      {
        symbol: "The two watchful eyes",
        meaning:
          "Dual perception; represent the complementary ways of knowing, external observation and internal intuition, inviting discernment rather than reliance on either alone.",
      },
      {
        symbol: "The mirrored leaves",
        meaning:
          "Botanical harmony; symbolise photosynthesis, growth, reciprocity and the relationships between plants, fungi, soil microorganisms and their environment.",
      },
      {
        symbol: "The central stem",
        meaning:
          "The axis of connection; joins the mushroom, leaves and underground forms, symbolising the flow between what is visible and what remains concealed.",
      },
      {
        symbol: "The twin root spirals",
        meaning:
          "Regeneration and continuity; represent growth, decomposition, nutrient cycling and the continual renewal of life through the soil.",
      },
    ],
    interpretiveDisclaimer:
      "These are symbolic interpretations of the design, not established historical meanings or evidence that fungi possess a unified consciousness.",
    intention:
      "To honour the interconnected web of life, cultivate intuitive awareness of the natural world, and restore humanity's relationship with the intelligence and regenerative processes of the living Earth.",
    motto: "What nourishes the roots ultimately nourishes the whole.",
    inscription:
      "Beneath the soil, beyond the reach of ordinary sight, the threads of life weave their silent tapestry.\n\nI honour the roots that nourish, the fungi that transform, the leaves that receive the sunlight, and the unseen relationships that sustain creation.\n\nMay I learn to observe before I intervene, to nurture before I harvest, and to give back to the Earth that gives so freely.\n\nThrough stillness, I listen.\nThrough awareness, I recognise.\nThrough reciprocity, I restore.\n\nI am not separate from the living world. I am one participant within its extraordinary unfolding.\n\nOne Earth. Infinite Connections. A Living Web of Remembrance.",
    altText:
      "Black ink sigil in a circle on aged parchment: a mushroom crown with a central eye, two flanking eyes above mirrored veined leaves on a central stem with twin root spirals.",
    usageSuggestions: [
      "A contemplative emblem for frequency farming",
      "A symbol of reciprocity during soil regeneration practices",
      "A visual reminder that human flourishing depends upon healthy ecological relationships",
    ],
    tags: [
      "earth intelligence",
      "mycelium",
      "fungi",
      "interconnectedness",
      "earth consciousness",
      "regeneration",
      "reciprocity",
      "soil",
      "botany",
      "intuition",
      "contemplation",
      "ecological wisdom",
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
        "registry-id-assigned": {
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
        "creator-voice-recorded": {
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
    id: "the-eye-of-the-living-mycelium",
    slug: "the-eye-of-the-living-mycelium",
    registryId: "TLC-SIG-0004",
    title: "The Eye of the Living Mycelium",
    publicAttribution: {
      mode: "soul-name",
      displayName: "Shri Mattananda",
    },
    provenance: {
      humanContribution: {
        contributions: [
          "Spiritual direction",
          "Meaning",
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
    series: "The Living Codex — Earth Intelligence",
    licenceId: "cc-by-4.0",
    previewPath: "/sigils/the-eye-of-the-living-mycelium-preview.webp",
    downloadPath: "/sigils/the-eye-of-the-living-mycelium-download.png",
    meaningSummary:
      "The central eye represents conscious observation; the surrounding fungi and branching networks symbolise ecological interdependence; the descending roots represent grounding and nourishment; and the crescent moon and geometric forms suggest cycles, balance and celestial connection.",
    intention:
      "To honour the living networks of Earth, encourage deeper observation of nature and inspire reciprocal stewardship of the ecosystems that sustain us.",
    inscription:
      "Through the eye of awareness, I behold the web of life.\nThrough the roots of remembrance, I reconnect with the Earth.\nThrough the living mycelium, I contemplate the countless relationships that sustain creation.\n\nMay my vision be clear, my actions compassionate, and my presence nourishing to all living beings.\n\nOne Earth. One Living Network. Infinite Expressions of Life.",
    altText:
      "Dark blue-black ink sigil on aged parchment: a large central eye encircled by a crown of mushrooms and branching filaments, flanked by mirrored diamond marks, with a crescent moon and a crossed-diamond symbol below and a rooted stem descending through a ring.",
    tags: [
      "earth intelligence",
      "mycelium",
      "collective awareness",
      "interconnection",
      "earth wisdom",
      "observation",
      "stewardship",
      "roots",
      "celestial cycles",
      "grounding",
      "contemplation",
    ],
    featured: true,
    governance: {
      policyAcceptance: {
        version: sigilPolicyHistory["1.0.3"].version,
        effectiveDate: sigilPolicyHistory["1.0.3"].effectiveDate,
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
        "registry-id-assigned": {
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
        "creator-voice-recorded": {
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
    id: "the-radiant-trinity",
    slug: "the-radiant-trinity",
    registryId: "TLC-SIG-0005",
    title: "The Radiant Trinity",
    subtitle: "Sigil of Unconditional Love and Sacred Unity",
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
    previewPath: "/sigils/the-radiant-trinity-preview.webp",
    downloadPath: "/sigils/the-radiant-trinity-download.png",
    meaningSummary:
      "This sigil symbolises the transformative potential of love when expressed through the unity of self, others and the greater whole. At its essence, the sigil represents the movement from personal love to collective harmony.",
    symbolInterpretations: [
      {
        symbol: "The three hearts",
        meaning:
          "Represent self-love, love shared with another and universal compassion. Each expression of love supports and strengthens the others.",
      },
      {
        symbol: "The central diamond",
        meaning:
          "Symbolises the point where these expressions meet, creating balance, clarity and a shared centre of intention.",
      },
      {
        symbol: "The interwoven pathways",
        meaning:
          "Represent the interconnectedness of all beings and the understanding that love can expand through conscious relationships.",
      },
      {
        symbol: "The rising solar arc",
        meaning:
          "Symbolises awakening, renewal and the illumination of the heart through higher awareness.",
      },
      {
        symbol: "The radiating rays",
        meaning:
          "Represent love extending beyond the individual into relationships, communities and the living world.",
      },
      {
        symbol: "The descending central line",
        meaning:
          "Symbolises grounding divine inspiration into everyday human experience.",
      },
    ],
    intention:
      "To awaken the radiant heart, harmonise love within oneself and with others, and inspire the conscious expression of compassion, unity and unconditional love throughout the world. It may serve as a symbolic focal point for meditation, relationship ceremonies, forgiveness practices and heart-centred community gatherings.",
    inscription:
      "From one heart, love is born.\nThrough another, love is reflected.\nThrough the third, love becomes universal.\nAt the sacred centre, separation dissolves and unity is remembered.\nMay the light of compassion radiate through every thought, every word and every action.\nMay love be given freely, received gratefully and embodied consciously.\nFor the heart that shines does not diminish its own light by illuminating another.\n\nThree Hearts. One Light. Infinite Love. 🌹",
    altText:
      "Grey line-art sigil on a cream background: three heart outlines, one centred above and two tilted outward below, whose lower outlines interweave at a central crossing beneath a solar arc, ringed by radiating dashes, with a long vertical line descending through the centre.",
    tags: [
      "radiant trinity",
      "unconditional love",
      "sacred unity",
      "heart-centred illumination",
      "self-love",
      "universal compassion",
      "interconnection",
      "solar arc",
      "grounding",
      "forgiveness",
      "meditation",
    ],
    usageSuggestions: [
      "Meditation",
      "Relationship ceremonies",
      "Forgiveness practices",
      "Heart-centred community gatherings",
    ],
    featured: true,
    governance: {
      policyAcceptance: {
        version: sigilPolicyHistory["1.0.3"].version,
        effectiveDate: sigilPolicyHistory["1.0.3"].effectiveDate,
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
        "registry-id-assigned": {
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
        "creator-voice-recorded": {
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
    id: "the-ascendant-heart",
    slug: "the-ascendant-heart",
    registryId: "TLC-SIG-0006",
    title: "The Ascendant Heart",
    subtitle: "Sigil of Sacred Ascent, Eternal Love and Lunar Balance",
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
    previewPath: "/sigils/the-ascendant-heart-preview.webp",
    downloadPath: "/sigils/the-ascendant-heart-download.png",
    meaningSummary:
      "This sigil expresses the movement of the heart toward higher purpose while remaining held within a protective and cyclical field of consciousness. Taken together, the sigil suggests: Love that is eternal, guided, protected, and brought into balance through intuition and conscious evolution.",
    symbolInterpretations: [
      {
        symbol: "The central heart",
        meaning:
          "The seat of unconditional love, sincerity and soul truth.",
      },
      {
        symbol: "The upward arrow",
        meaning:
          "Direction, purpose, aspiration and the rise of consciousness toward higher alignment.",
      },
      {
        symbol: "The infinity loop above the heart",
        meaning:
          "Eternal love, continuity, soul remembrance and the timeless nature of true connection.",
      },
      {
        symbol: "The flanking spirals",
        meaning:
          "Balanced currents of masculine and feminine energy, or the inner and outer movements of expansion and return.",
      },
      {
        symbol: "The crescent moon below",
        meaning:
          "Receptivity, intuition, emotional wisdom, sacred stillness and the feminine mystery.",
      },
      {
        symbol: "The lower dot beneath the crescent",
        meaning:
          "A seed-point of incarnation, grounding, or the spark of consciousness anchored into the material world.",
      },
      {
        symbol: "The enclosing circle",
        meaning:
          "Protection, wholeness, consecrated space and the unity within which all these energies are held.",
      },
    ],
    intention:
      "To anchor the heart in sacred purpose, harmonise eternal love with grounded embodiment, and support the ascent of consciousness through balance, devotion and inner knowing. This sigil would be beautiful for: heart-based meditation, sacred union work, moon rituals, personal empowerment, ceremonial anchoring of purpose and devotion.",
    inscription:
      "Within the circle of wholeness, the heart remembers its path.\nLove rises.\nConsciousness ascends.\nWhat is eternal reveals itself through devotion, balance and trust.\nThe moon below teaches receptivity, the arrow above teaches direction, and the heart at centre teaches truth.\nMay I rise without losing tenderness.\nMay I love without losing sovereignty.\nMay I walk the sacred path with purpose, humility and grace.\n\nOne Heart. One Path. Infinite Becoming.",
    altText:
      "Silver line-art sigil on a black textured background: within a large thin circle, an upward arrow above an infinity loop, a central heart flanked by symmetrical curling flourishes, a crescent moon opening upward beneath it, and a small dot near the base.",
    tags: [
      "ascendant heart",
      "sacred ascent",
      "eternal love",
      "lunar balance",
      "infinity",
      "crescent moon",
      "receptivity",
      "intuition",
      "devotion",
      "sacred union",
      "grounding",
      "heart-centred",
    ],
    usageSuggestions: [
      "heart-based meditation",
      "sacred union work",
      "moon rituals",
      "personal empowerment",
      "ceremonial anchoring of purpose and devotion",
    ],
    featured: true,
    governance: {
      policyAcceptance: {
        version: sigilPolicyHistory["1.0.4"].version,
        effectiveDate: sigilPolicyHistory["1.0.4"].effectiveDate,
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
        "registry-id-assigned": {
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
        "creator-voice-recorded": {
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

/**
 * Build-failing duplicate guard. TypeScript cannot prove array-level
 * uniqueness, so this module-level check runs whenever the catalogue is
 * imported (including static generation) and aborts the build if two works
 * share a registry identifier.
 */
const registryIds = sigils.map((sigil) => sigil.registryId);
const duplicateRegistryIds = [
  ...new Set(
    registryIds.filter(
      (registryId, index) => registryIds.indexOf(registryId) !== index,
    ),
  ),
];

if (duplicateRegistryIds.length > 0) {
  throw new Error(
    `Duplicate sigil registry identifier(s) detected: ${duplicateRegistryIds.join(", ")}. Every work must have its own permanent registry identifier.`,
  );
}

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

export const mycelialWitnessPublicAttributionDetails = getSigilPublicAttribution(
  sigils[2],
);
export const mycelialWitnessPublicAttribution =
  mycelialWitnessPublicAttributionDetails.text;

export const eyeOfTheLivingMyceliumPublicAttributionDetails =
  getSigilPublicAttribution(sigils[3]);
export const eyeOfTheLivingMyceliumPublicAttribution =
  eyeOfTheLivingMyceliumPublicAttributionDetails.text;

export const radiantTrinityPublicAttributionDetails = getSigilPublicAttribution(
  sigils[4],
);
export const radiantTrinityPublicAttribution =
  radiantTrinityPublicAttributionDetails.text;

export const ascendantHeartPublicAttributionDetails = getSigilPublicAttribution(
  sigils[5],
);
export const ascendantHeartPublicAttribution =
  ascendantHeartPublicAttributionDetails.text;

export interface SigilLaunchReadiness {
  readonly approvedSeedWorksCount: number;
  readonly requiredMinimum: number;
  readonly requiredMaximum: number;
  readonly additionalWorksRequiredMinimum: number;
  readonly additionalWorksRequiredMaximum: number;
  readonly meetsMinimum: boolean;
  readonly isReadyForLaunch: boolean;
  readonly exceedsLaunchWindow: boolean;
  readonly readinessReason: string;
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
 *
 * The 3–6 range is a LAUNCH-WINDOW rule: it answers "how many approved,
 * rights-cleared seed works does launch require". Readiness is therefore a
 * FLOOR at `minimum`, not a band. The former predicate also required
 * `count <= maximum`, which re-evaluated the launch window against the live
 * catalogue forever: once the range was full, any legitimate post-launch
 * addition silently flipped readiness back to false. Post-launch growth is
 * intended, so the cap is not part of the predicate. `maximum` is retained as
 * planning metadata, and `exceedsLaunchWindow` reports the overflow
 * informationally without affecting readiness.
 */
export function getSigilLaunchReadiness(
  catalogue: readonly Sigil[] = sigils,
): SigilLaunchReadiness {
  const { minimum, maximum } =
    sigilPolicy.launchReadiness.rightsClearedSeedWorksRequired;
  const approvedSeedWorksCount = catalogue.filter(
    isApprovedRightsClearedSeed,
  ).length;
  const exceedsLaunchWindow = approvedSeedWorksCount > maximum;

  const readinessReason =
    approvedSeedWorksCount < minimum
      ? `Below the launch minimum: ${approvedSeedWorksCount} of the ${minimum} approved, rights-cleared seed works required are catalogued; ${minimum - approvedSeedWorksCount} more ${minimum - approvedSeedWorksCount === 1 ? "work is" : "works are"} required.`
      : approvedSeedWorksCount < maximum
        ? `Within the launch window: ${approvedSeedWorksCount} approved, rights-cleared seed works are catalogued; launch requires ${minimum}–${maximum}.`
        : approvedSeedWorksCount === maximum
          ? `At the launch-window maximum: ${approvedSeedWorksCount} approved, rights-cleared seed works are catalogued; launch requires ${minimum}–${maximum}.`
          : `Beyond the launch window: ${approvedSeedWorksCount} approved, rights-cleared seed works are catalogued, above the ${maximum}-work launch window; this is intended post-launch growth and does not affect readiness.`;

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
    isReadyForLaunch: approvedSeedWorksCount >= minimum,
    exceedsLaunchWindow,
    readinessReason,
  };
}
