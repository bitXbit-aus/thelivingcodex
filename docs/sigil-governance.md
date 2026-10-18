# Living Sigil Library governance

## Purpose and policy record

The Living Sigil Library is a curated public collection of contributed sigil artwork. It holds each work with care, preserves the contributor's stated attribution and licence choice, and presents spiritual expression without guaranteeing results.

The canonical implementation policy is the structured `sigilPolicy` object in `src/data/sigilPolicy.ts`. This document explains that policy in readable form. Policy version **1.0.3** is effective **2026-10-19**. Future submission records must persist the accepted policy version and effective date so the applicable terms remain identifiable. The append-only snapshot registry and revision procedure are documented in [`docs/sigil-policy-history.md`](sigil-policy-history.md); historical entries must never be edited or removed.

## Submission is not publication

A submission is an invitation to consider a work. Receipt does not mean acceptance, endorsement, or publication. Moderators decide whether a submission is published, deferred, declined, corrected, or removed, and every work must pass the structured publication checklist before entering the public collection.

Moderators may correct attribution spelling, licence display, descriptions, and other metadata when authorised and documented. They must not materially alter the artwork without separate creator approval. A contributor may withdraw a work before publication or request reconsideration through [`/contact/`](/contact/).

## Authorship and permission

Contributors must submit their own original work or have clear permission from the relevant rights holder to submit it and select the offered licence. A submission must not knowingly infringe copyright, trademark, privacy, cultural, or other rights.

Steward-directed AI-assisted work is eligible as seed content when a human licensor has authority to submit and license it, the human creative contribution and AI assistance are accurately disclosed, required rights and provenance are recorded, and the work passes the same moderation and publication checks as every other work. AI systems and tools are not represented as legal licensors or copyright owners.

The seed prohibition applies to unowned or generic generated placeholders and to third-party works without confirmed rights. It does not exclude rights-cleared, steward-directed AI-assisted work that satisfies the requirements above.

If authorship, provenance, consent, or permission is uncertain, publication pauses until the concern is resolved. Publication by The Living Codex is not independent verification of authorship, ownership, provenance, or claimed outcomes.

## Creator-voice content

Creator-voice content is any text that speaks in the creator's own voice or carries their spiritual, devotional, or interpretive meaning for a work. It includes the **vow**, **motto**, **inscription**, **intention**, **significance**, **meaning**, **symbolism**, **comparison notes**, **interpretive disclaimer**, and **usage suggestions** recorded for a sigil.

**All creator-voice content is optional and must be supplied by the creator.** Only structural, factual, and editorial fields are required — a record's identity, public attribution, dates, licence, file paths, accessibility alternative text, tags, and featured status. No creator-voice field is required, so a creator-voice omission never surfaces as a build error and must never be made to tempt an implementer to supply text in the creator's place.

An implementer, moderator, or AI assistant must never invent, infer, paraphrase, or fabricate creator-voice content, and must not present a plausible-sounding substitute as the creator's words or meaning. In particular, it is prohibited to compose creator-voice text by recombining, stitching together, or reordering the creator's own supplied phrases, or by summarising them into a new statement: assembling a new sentence out of the creator's words is composition, not transcription, and is a breach.

A record must carry exactly the creator-voice content the creator actually supplied — no more and no less. Where the creator has not supplied a given item, the record omits it. A sigil with no creator-voice content **must await the creator before publication**; this is a binding publication requirement, verified by the `creator-voice-recorded` item in the publication checklist, not merely advice. Correcting a creator's own wording requires the creator's instruction, and any such correction must be documented.

## Attribution and privacy

A contributor selects one public attribution for each accepted sigil:

- **Real name** — publish the contributor's chosen real name.
- **Soul name** — publish the contributor's chosen soul name.
- **Anonymous** — publish no contributor name.

Anonymous publication governs public display, not the private administration record. The project may retain a controlled private record only as needed to review the work, document permission, respond to concerns, or administer correction and removal requests. Original-file access must be controlled and original retention limited.

A contributor's email address is private. It may be used for submission follow-up, collection administration, and correction, reconsideration, or removal requests, but it must not be published.

Public records must exclude private email addresses, restricted identity information, private submission notes, and unnecessary embedded metadata. This protection is especially important for anonymous contributors: every public image must be decoded and re-encoded, with unnecessary EXIF and other metadata removed so the public asset does not inadvertently reveal identity, location, device, or submission details.

## Launch licence options

The contributor selects one option for an accepted work. The selected option must be displayed clearly beside the published sigil. These summaries are informational; contributors and visitors should read the official terms.

### Display only

The contributor retains copyright and grants The Living Codex a **non-exclusive, worldwide, royalty-free, withdrawable permission** to:

- store and back up the work;
- reproduce it for its Living Sigil Library entry;
- resize or re-encode it and generate thumbnails, accessibility previews, or promotional previews without materially altering the artwork;
- deliver it through hosting, CDN, and other service providers; and
- publicly display it solely to operate and promote its Living Sigil Library entry.

Visitors receive no right to copy, adapt, distribute, or otherwise reuse a display-only work. Additional visitor use requires separate permission from the relevant rights holder. The Living Codex may not make material artwork changes without separate creator approval.

After a verified withdrawal request, The Living Codex will stop future distribution and remove public copies within a reasonable period. Limited copies may remain temporarily in controlled backups or service-provider systems until ordinary retention and deletion cycles complete.

### CC BY 4.0

Creative Commons Attribution 4.0 International permits sharing and adaptation, **including commercial use**, when its terms are followed, including attribution. The canonical licence URL is:

https://creativecommons.org/licenses/by/4.0/

### CC BY-NC-SA 4.0

Creative Commons Attribution-NonCommercial-ShareAlike 4.0 International permits **non-commercial sharing and adaptation** when its terms are followed, including attribution and licensing adaptations under the same terms. The canonical licence URL is:

https://creativecommons.org/licenses/by-nc-sa/4.0/

Creative Commons licences are irrevocable once applied. Removing a work from the Living Sigil Library or stopping its future distribution does not revoke licence rights already received by others. The Living Codex does not provide legal advice, and a selected licence may not resolve every third-party-right or jurisdiction-specific issue.

## Moderation

Moderators review each submission against stable policy reasons. A work may be declined, deferred, or removed for any of the following:

| ID | Reason | Meaning |
| --- | --- | --- |
| `ownership-or-permission` | Ownership or permission concern | Authorship, provenance, consent, or authority to submit and select the licence is missing, unclear, or disputed. |
| `hateful-or-targeted-abuse` | Hateful or targeted abuse | The submission promotes hatred, harassment, exploitation, or targeted abuse against a person or group. |
| `personal-privacy-or-cultural-concern` | Personal, privacy, or cultural concern | It exposes non-consensual personal information or raises unresolved privacy, consent, cultural, or community-rights concerns. |
| `dangerous-instructions-or-harmful-claims` | Dangerous instructions or harmful claims | It promotes dangerous or unlawful conduct, or makes misleading guarantees about medical, psychological, therapeutic, energetic, financial, or other outcomes. |
| `copyright-or-trademark-conflict` | Copyright or trademark conflict | It appears to infringe or conflict with another party's copyright, trademark, or related rights. |
| `malicious-or-unsafe-file` | Malicious or unsafe file | The file is unreadable, deceptive, malicious, technically unsafe, or cannot be processed within publication security limits. |
| `deception-or-misrepresentation` | Deception or misrepresentation | It materially misrepresents its creator, provenance, permissions, purpose, contents, or relationship to The Living Codex. |
| `collection-purpose-conflict` | Conflict with collection purpose | It materially conflicts with the purpose, care, or public presentation of the Living Sigil Library. |

Decisions should be consistent, proportionate, respectful, and privacy-conscious. Sacred or spiritual framing does not exempt a submission from review. When practical and appropriate, moderators may request clarification. Contributors may request reconsideration through [`/contact/`](/contact/).

## No guaranteed outcomes

Sigils in the library are creative and spiritual expressions. The Living Codex and its contributors do not guarantee medical, psychological, therapeutic, energetic, financial, or other outcomes from viewing, creating, sharing, or working with a sigil. The collection is not a substitute for qualified medical, mental-health, legal, financial, or other professional care.

## Accepted files and upload security

Launch uploads are limited to **5 MiB** (`5 * 1024 * 1024` bytes) per image and these raster formats:

- PNG (`.png`, `image/png`)
- JPEG (`.jpg` or `.jpeg`, `image/jpeg`)
- WebP (`.webp`, `image/webp`)

SVG remains excluded initially because it can contain scripts, external references, embedded content, and complex metadata. Accepting SVG safely would require a dedicated sanitisation and rendering process.

Upload handling must use defence in depth:

1. Treat the client-provided filename and MIME type as untrusted. An extension allowlist and reported MIME check are preliminary filters only.
2. Inspect file signatures and actual type on the server. Reject mismatches, unreadable files, polyglot or suspicious content, and anything outside the allowlist.
3. Decode images within bounded resource limits. At launch, reject images wider or taller than **10,000 pixels** or exceeding **40,000,000 total pixels**.
4. Re-encode an approved derivative for public delivery rather than serving the submitted original. Remove unnecessary EXIF and other metadata.
5. Generate storage filenames rather than using client filenames.
6. Keep pending originals private and outside the public webroot, or in equivalently segregated non-public storage. Restrict access and limit retention.
7. A later dynamic upload system must also enforce per-user and per-origin rate limits plus aggregate upload and storage quotas.

These controls reduce risk together; no filename, extension, MIME value, or single scanner is sufficient by itself.

## Correction, reconsideration, withdrawal, and removal

Requests to correct publication metadata, reconsider a moderation decision, withdraw permission, or remove a work should be sent through [`/contact/`](/contact/).

A request should identify the sigil and requested action. The project should verify the requester's relationship to the work when reasonably necessary, acknowledge the request, preserve only records needed to administer it, and update or remove the public record as appropriate.

For display-only works, withdrawal operates as described above. For Creative Commons works, stopping distribution and removing the library entry does not revoke rights already granted to recipients under the applicable irrevocable CC licence. Copies outside the project's control may therefore remain lawful under those terms.

## Publication checklist

The canonical checklist is structured in `sigilPolicy.publicationChecklist`. Before publication, the **Library steward** must confirm:

- [ ] The work is explicitly intended for the Living Sigil Library.
- [ ] The accepted policy version and effective date are stored with the submission.
- [ ] Original authorship or adequate permission to submit and apply the selected licence is confirmed.
- [ ] Any human creative contribution and AI assistance are accurately disclosed, and AI systems or tools are not listed as legal licensors or copyright owners.
- [ ] Known provenance, cultural-rights, trademark, privacy, and other third-party concerns are resolved or documented.
- [ ] Public attribution is explicitly **Real name**, **Soul name**, or **Anonymous**, and its spelling matches the contributor's choice.
- [ ] A launch licence is explicitly selected, and its public label and official link, where applicable, are correct.
- [ ] `creator-voice-recorded` — the record carries exactly the creator-voice content the creator supplied, verbatim: every creator-voice field present was supplied by the creator, none was invented, inferred, paraphrased, or composed from the creator's own phrases, omitted fields were genuinely not supplied, and a sigil with no creator-voice content awaits the creator before publication.
- [ ] The upload is within **5 MiB**, matches an allowed extension and server-inspected PNG, JPEG, or WebP type, and satisfies decode, dimension, pixel-count, and safety limits.
- [ ] The public derivative has a generated filename, has been decoded and re-encoded, and has unnecessary EXIF and other metadata removed.
- [ ] Pending originals are private, access-controlled, segregated from public delivery, and subject to limited retention.
- [ ] Private email, restricted identity information, private notes, and unnecessary metadata are absent from the public record.
- [ ] A moderator has checked every structured moderation reason and recorded the decision.
- [ ] The title, description, artwork context, and accompanying text do not promise guaranteed outcomes or replace professional care.
- [ ] The final entry is accurate, accessible, respectful, and shows the selected attribution and licence.
- [ ] The correction, reconsideration, withdrawal, and removal route is available at `/contact/`.

## Launch readiness

The **Library steward** is responsible for confirming launch readiness. Policy defines only the durable rule: launch requires **3–6 approved, rights-cleared seed works**. The mutable status is derived from the sigil catalogue rather than stored in the policy, so approving a new seed never forces a policy revision. The approved rights-cleared seed count, the number of works still required to reach the 3–6 range, and the readiness state are all computed from the catalogue by the derived readiness helper in `src/data/sigils.ts` together with this rule.

Unowned or generic generated placeholders and third-party works without confirmed rights must not be represented as approved seed contributions. Rights-cleared, steward-directed AI-assisted works may qualify under the eligibility requirements above. Every seed work must pass the same rights, attribution, licence, privacy, security, and moderation checks as later submissions.

## References and review notice

Official references:

- Creative Commons Attribution 4.0 International: https://creativecommons.org/licenses/by/4.0/
- Creative Commons Attribution-NonCommercial-ShareAlike 4.0 International: https://creativecommons.org/licenses/by-nc-sa/4.0/
- Creative Commons licensing guidance: https://creativecommons.org/share-your-work/cclicenses/
- OWASP File Upload Cheat Sheet: https://cheatsheetseries.owasp.org/cheatsheets/File_Upload_Cheat_Sheet.html

This policy language should receive qualified legal review before a public submission form launches. Nothing in this document is legal advice.
