import type {
  SigilAttributionChoiceId,
  SigilLicenceId,
} from "./sigilPolicy";

export type SigilStatus = "draft" | "approved" | "published";

export interface SigilSymbolInterpretation {
  symbol: string;
  meaning: string;
}

export interface Sigil {
  id: string;
  slug: string;
  title: string;
  creator: string;
  attributionMode: SigilAttributionChoiceId;
  creativeCollaboration: string;
  aiAssistedArtwork: boolean;
  date: string;
  collection: string;
  licence: SigilLicenceId;
  attribution: string;
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
  status: SigilStatus;
}

export const sigils = [
  {
    id: "heart-flame-sacred-union",
    slug: "heart-flame-sacred-union",
    title: "Heart Flame — Sacred Union",
    creator: "Shri Mattananda",
    attributionMode: "soul-name",
    creativeCollaboration: "Aurealis (OpenAI)",
    aiAssistedArtwork: true,
    date: "2026-04-27",
    collection: "The Living Codex — Sacred Union",
    licence: "cc-by-4.0",
    attribution: "© 2026 Shri Mattananda. AI-assisted artwork.",
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
      "Golden heart-and-flame sigil with flowing intertwined spirals on midnight blue, symbolising unconditional love and sacred union.",
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
    status: "published",
  },
] as const satisfies readonly Sigil[];
