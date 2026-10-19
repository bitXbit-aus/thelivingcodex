export type Digit =
  | "0"
  | "1"
  | "2"
  | "3"
  | "4"
  | "5"
  | "6"
  | "7"
  | "8"
  | "9";

export type ISOYear = `20${Digit}${Digit}`;
export type ISOMonth =
  | "01"
  | "02"
  | "03"
  | "04"
  | "05"
  | "06"
  | "07"
  | "08"
  | "09"
  | "10"
  | "11"
  | "12";
export type ISODay =
  | `0${Exclude<Digit, "0">}`
  | `${"1" | "2"}${Digit}`
  | "30"
  | "31";

export type ISODateString = `${ISOYear}-${ISOMonth}-${ISODay}`;

interface SigilPolicySnapshotDefinition {
  readonly version: string;
  readonly effectiveDate: ISODateString;
  readonly collectionName: string;
  readonly sourceCommit: string;
  readonly canonicalModule: string;
  readonly governanceDocument: string;
}

/**
 * Append-only registry of the exact policy snapshots accepted by contributors.
 * Historical entries must never be edited or removed.
 */
export const sigilPolicyHistory = {
  "1.0.0": {
    version: "1.0.0",
    effectiveDate: "2026-10-18",
    collectionName: "Living Sigil Library",
    sourceCommit: "f2b7ccfd71468956156b935cffc4cffaee8a1718",
    canonicalModule: "src/data/sigilPolicy.ts",
    governanceDocument: "docs/sigil-governance.md",
  },
  "1.0.1": {
    version: "1.0.1",
    effectiveDate: "2026-10-19",
    collectionName: "Living Sigil Library",
    sourceCommit: "a245aff2721bae9a8253c4185f32fec9d7ac9652",
    canonicalModule: "src/data/sigilPolicy.ts",
    governanceDocument: "docs/sigil-governance.md",
  },
  "1.0.2": {
    version: "1.0.2",
    effectiveDate: "2026-10-19",
    collectionName: "Living Sigil Library",
    sourceCommit: "2e498eada8be1d9f2994cb65ff38f719ae0eb9b3",
    canonicalModule: "src/data/sigilPolicy.ts",
    governanceDocument: "docs/sigil-governance.md",
  },
  "1.0.3": {
    version: "1.0.3",
    effectiveDate: "2026-10-19",
    collectionName: "Living Sigil Library",
    sourceCommit: "e613498bfe3bf7fc51b0722b961a357ad639d294",
    canonicalModule: "src/data/sigilPolicy.ts",
    governanceDocument: "docs/sigil-governance.md",
  },
  "1.0.4": {
    version: "1.0.4",
    effectiveDate: "2026-10-19",
    collectionName: "Living Sigil Library",
    sourceCommit: "6907e01b6331a2fd3c16e4573e89142dcd5698d4",
    canonicalModule: "src/data/sigilPolicy.ts",
    governanceDocument: "docs/sigil-governance.md",
  },
  "1.0.5": {
    version: "1.0.5",
    effectiveDate: "2026-10-19",
    collectionName: "Living Sigil Library",
    sourceCommit: "735bf6b4613d17396866e2b6320b524aa3d5ed68",
    canonicalModule: "src/data/sigilPolicy.ts",
    governanceDocument: "docs/sigil-governance.md",
  },
} as const satisfies Readonly<Record<string, SigilPolicySnapshotDefinition>>;

export type SigilPolicySnapshot =
  (typeof sigilPolicyHistory)[keyof typeof sigilPolicyHistory];
export type SigilPolicyVersion = SigilPolicySnapshot["version"];

export type SigilPolicyAcceptance = {
  [Version in SigilPolicyVersion]: Pick<
    Extract<SigilPolicySnapshot, { version: Version }>,
    "version" | "effectiveDate"
  >;
}[SigilPolicyVersion];
