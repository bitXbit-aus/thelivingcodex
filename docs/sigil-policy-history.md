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

### Version 1.0.2

Policy 1.0.2 removes the mutable approved-seed count from the versioned policy module. The policy now stores only the durable launch rule (launch requires 3–6 approved, rights-cleared seed works); the approved count, the remaining works required to reach that range, and the readiness state are derived at runtime from the sigil catalogue by the readiness helper in `src/data/sigils.ts`. This keeps the policy immutable while the catalogue grows, so approving a new seed no longer forces a policy revision.

- Version: `1.0.2`
- Effective date: `2026-10-19`
- Collection: `Living Sigil Library`
- Source commit: `2e498eada8be1d9f2994cb65ff38f719ae0eb9b3`
- Canonical module: `src/data/sigilPolicy.ts`
- Governance document: `docs/sigil-governance.md`

### Version 1.0.3

Policy 1.0.3 makes creator-voice fidelity enforceable. It adds the `creator-voice-recorded` item to the canonical publication checklist, requiring that a record carries exactly the creator-voice content the creator supplied — verbatim — that every creator-voice field present was supplied by the creator and none was invented, inferred, paraphrased, or composed from the creator's own phrases, that omitted fields were genuinely not supplied, and that a sigil with no creator-voice content awaits the creator before publication. The creator-voice enumeration in the governance document is aligned to include the interpretive disclaimer and usage suggestions the code declares creator-supplied, and the former "should wait for the creator" advice is now a binding rule tied to this checklist item.

- Version: `1.0.3`
- Effective date: `2026-10-19`
- Collection: `Living Sigil Library`
- Source commit: `e613498bfe3bf7fc51b0722b961a357ad639d294`
- Canonical module: `src/data/sigilPolicy.ts`
- Governance document: `docs/sigil-governance.md`

### Version 1.0.4

Policy 1.0.4 establishes permanent registry identifiers for the Living Sigil Library. Registry identifiers use the form `TLC-SIG-` plus four zero-padded digits and are assigned in order of admission to the Library, not by creation date (the seed works share a single standing creation date and cannot be ordered by it). Identifiers are permanent: they are never changed, re-sorted, or reused, and a retired work keeps its identifier reserved. Uniqueness is enforced at build time, the identifier is required on every record by a compile-time-checked type, and it is included in the public attribution text. The canonical publication checklist gains a thirteenth item, `registry-id-assigned`.

- Version: `1.0.4`
- Effective date: `2026-10-19`
- Collection: `Living Sigil Library`
- Source commit: `PENDING_SOURCE_COMMIT_1_0_4`
- Canonical module: `src/data/sigilPolicy.ts`
- Governance document: `docs/sigil-governance.md`

All entries are immutable. Future revisions must append another snapshot without editing or removing any retained entry.
