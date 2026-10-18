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
