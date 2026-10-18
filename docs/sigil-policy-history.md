# Sigil policy history

`src/data/sigilPolicyHistory.ts` is the append-only registry of policy snapshots accepted by Living Sigil Library contributors. Record-level policy acceptance types derive from this registry, not from the current literals in `src/data/sigilPolicy.ts`.

## Invariant

Never edit or remove a historical registry entry. A published or submitted record remains valid while its accepted version is retained in the registry, even after the current policy advances.

## Revision procedure

1. Finalise the revised canonical policy in `src/data/sigilPolicy.ts` and its readable explanation in `docs/sigil-governance.md`.
2. Commit the exact reviewed policy and governance text.
3. Add a new immutable entry to `src/data/sigilPolicyHistory.ts` with its version, effective date, collection, full source commit hash, canonical module, and governance document.
4. Keep every earlier entry unchanged. Recover the exact historical terms from the recorded source commit when review, correction, or dispute handling requires them.
5. New records accept the new snapshot; existing records continue to reference their original retained snapshot.

## Retained snapshots

### Version 1.0.0

- Version: `1.0.0`
- Effective date: `2026-10-18`
- Collection: `Living Sigil Library`
- Source commit: `f2b7ccfd71468956156b935cffc4cffaee8a1718`
- Canonical module: `src/data/sigilPolicy.ts`
- Governance document: `docs/sigil-governance.md`

### Version 1.0.1

Policy 1.0.1 clarifies that rights-cleared, steward-directed AI-assisted works may be eligible seed contributions when a human licensor has authority, human contribution and AI assistance are accurately disclosed, rights and provenance are recorded, and normal publication checks pass. It distinguishes those works from unowned or generic generated placeholders and third-party works without confirmed rights.

- Version: `1.0.1`
- Effective date: `2026-10-19`
- Collection: `Living Sigil Library`
- Source commit: `a245aff2721bae9a8253c4185f32fec9d7ac9652`
- Canonical module: `src/data/sigilPolicy.ts`
- Governance document: `docs/sigil-governance.md`

Both entries are immutable. Future revisions must append another snapshot without editing or removing either retained entry.

### Version 1.0.2

Policy 1.0.2 removes the mutable approved-seed count from the versioned policy module. The policy now stores only the durable launch rule (launch requires 3–6 approved, rights-cleared seed works); the approved count, the remaining works required to reach that range, and the readiness state are derived at runtime from the sigil catalogue by the readiness helper in `src/data/sigils.ts`. This keeps the policy immutable while the catalogue grows, so approving a new seed no longer forces a policy revision.

- Version: `1.0.2`
- Effective date: `2026-10-19`
- Collection: `Living Sigil Library`
- Source commit: `2e498eada8be1d9f2994cb65ff38f719ae0eb9b3`
- Canonical module: `src/data/sigilPolicy.ts`
- Governance document: `docs/sigil-governance.md`

All entries are immutable. Future revisions must append another snapshot without editing or removing any retained entry.
