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

## Initial retained snapshot

- Version: `1.0.0`
- Effective date: `2026-10-18`
- Collection: `Living Sigil Library`
- Source commit: `f2b7ccfd71468956156b935cffc4cffaee8a1718`
- Canonical module: `src/data/sigilPolicy.ts`
- Governance document: `docs/sigil-governance.md`
