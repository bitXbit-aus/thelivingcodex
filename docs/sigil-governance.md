# Living Sigil Library governance

## Purpose and policy record

The Living Sigil Library is a curated public collection of contributed sigil artwork. It holds each work with care, preserves the contributor's stated attribution and licence choice, and presents spiritual expression without guaranteeing results.

The canonical implementation policy is the structured `sigilPolicy` object in `src/data/sigilPolicy.ts`. This document explains that policy in readable form. Policy version **1.0.7** is effective **2026-10-19**. Future submission records must persist the accepted policy version and effective date so the applicable terms remain identifiable. Policy 1.0.7 adds a concrete retention target for pending originals, documents that contributor email is also held in the hosting provider's form records, and reconciles the publication checklist below with the 13 canonical per-work items. Policy 1.0.6 recorded an explicit steward override opening public sigil submissions before the qualified legal review required by this policy had been completed; it does not record that review as done, and 1.0.7 does not change that position. The append-only snapshot registry and revision procedure are documented in [`docs/sigil-policy-history.md`](sigil-policy-history.md); historical entries must never be edited or removed.

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

A contributor's email address is private. It may be used for submission follow-up, collection administration, and correction, reconsideration, or removal requests, but it must not be published. The address is also stored in the hosting provider's (Netlify's) form submission records and may be emailed to the Library steward so the submission can be reviewed; those are processing steps, not publication.

Pending originals are not kept indefinitely. The policy sets a retention target of **30 days after the moderation decision** (publish, decline, deferral, or withdrawal), after which the pending original is to be deleted. Limited copies may remain in hosting-provider backups until their ordinary deletion cycles complete. The 30-day value is a real commitment owned by the Library steward, not a placeholder; changing it requires a policy revision recorded in the history registry.

Public records must exclude private email addresses, restricted identity information, private submission notes, and unnecessary embedded metadata. This protection is especially important for anonymous contributors: every public image must be decoded and re-encoded, with unnecessary EXIF and other metadata removed so the public asset does not inadvertently reveal identity, location, device, or submission details.

## Registry numbers

Every work admitted to the Living Sigil Library receives a permanent registry identifier. The identifier's purpose is citation: it names the work itself, independent of its title, its slug, and its position in the catalogue, so a reference remains valid even if any of those change.

The format is the prefix `TLC-SIG-` followed by four zero-padded digits, for example `TLC-SIG-0001`. The prefix is stored in `sigilPolicy.registry.idPrefix`, and the `SigilRegistryId` type in `src/data/sigils.ts` derives from it, so a malformed identifier is a compile error. The digit count is declared in `sigilPolicy.registry.idDigits` for documentation, but TypeScript cannot derive a digit count from a numeric value — the type repeats the count literally, so `idDigits` and `SigilRegistryId` must be changed together.

Identifiers are assigned in **order of admission to the Library** — the order in which works are accepted into the collection. Creation date is deliberately not used as an ordering key: the seed works currently share a single standing creation date, so creation date cannot establish an order. The current seed mapping begins `TLC-SIG-0001` Heart Flame — Sacred Union, `TLC-SIG-0002` The Sovereign Heart, `TLC-SIG-0003` The Mycelial Witness, `TLC-SIG-0004` The Eye of the Living Mycelium, and `TLC-SIG-0005` The Radiant Trinity.

An identifier is immutable. It is assigned once and is never changed, re-sorted, or reused; rearranging the catalogue does not renumber anything. Uniqueness is enforced at build time by a guard in `src/data/sigils.ts` that aborts the build if two works share an identifier, because the type system alone cannot prove array-level uniqueness. A withdrawn or removed work keeps its identifier reserved, and retired identifiers are never reissued to another work.

Because retired identifiers are never reissued, the sequence may contain legitimate gaps. A gap is not a defect and must not be backfilled to make the numbering appear contiguous. The build-time guard enforces uniqueness only; contiguity and admission order are governed by this document rather than by code.

The identifier forms part of the public attribution text, appearing in parentheses immediately after the title, so it travels with every copied attribution.

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

## Moderation runbook: handling an untrusted submitted image

The submission form tells contributors that the file is inspected again before publication. This is that procedure. Treat every file from an anonymous public submission as untrusted until it has been inspected.

1. **Do not open the file in a normal browser or image viewer first.** Download it from the Netlify form submission record into a dedicated quarantine folder on the moderation machine, not into a shared or synced folder. Do not visit the direct URL in a browser session that carries your logged-in accounts.
2. **Identify the real type from its bytes, not its name.** Run `file --mime-type` and inspect the first bytes (`xxd -l 32`) to confirm a PNG, JPEG, or WebP signature. Reject a file whose actual signature disagrees with its extension or reported MIME type, and reject truncated or polyglot files.
3. **Read dimensions and metadata without rendering.** `exiftool` (or `identify` in a sandbox) gives width, height, and embedded metadata. Reject anything beyond 10,000 px on a side or 40,000,000 total pixels. Note any GPS, device, author, or comment fields — these are exactly what must not be published.
4. **Decode inside a disposable environment.** Use a throwaway VM or container with no network and no credentials. If you have any reason to suspect the file, do not decode it at all: decline it under `malicious-or-unsafe-file` and delete it.
5. **Produce the public derivative, never publish the original.** Re-encode to the approved format with metadata stripped (for example `magick input.png -strip output.png`, or `exiftool -all= -overwrite_original` followed by a re-encode), confirm with `exiftool` that GPS and device fields are gone, and give the output a generated filename. Verify the derivative still meets the 5 MiB limit.
6. **Review the visible content** against every structured moderation reason: ownership and permission, hate or targeted abuse, personal or cultural privacy, dangerous instructions or outcome claims, copyright or trademark conflict, deception, and collection purpose.
7. **Record the decision** (publish, decline, defer, or withdraw) and the reasons. Schedule deletion of the pending original and the quarantine copy for no later than 30 days after that decision, and record that the deletion happened.
8. **Never** move the original into `public/sigils/`, never rename it into a public path, and never copy contributor email or submission notes into the public record.

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
6. Keep pending originals private and outside the public webroot, or in equivalently segregated non-public storage. Restrict access and limit retention to the policy's target of 30 days after the moderation decision. **At policy 1.0.7 the segregation and access-control part of this requirement is not met by the launch submission form** — see “Submission pipeline: real limits and privacy characteristics” below.
7. A later dynamic upload system must also enforce per-user and per-origin rate limits plus aggregate upload and storage quotas.

These controls reduce risk together; no filename, extension, MIME value, or single scanner is sufficient by itself.

## Submission pipeline: real limits and privacy characteristics

The public sigil form at `/submit/sigil/` posts to Netlify Forms. Its real behaviour is narrower and weaker than the policy's ideal, and this section records the position truthfully so neither contributors nor moderators are misled.

**Transport and limits**

- Netlify Forms does not accept JSON. The form body is sent as `multipart/form-data`; JSON or URL-encoded bodies are not recorded as submissions with files.
- The whole request is capped at **8 MB**, and the platform times out after **30 seconds**. The project therefore imposes its own **5 MiB** per-image limit, well inside the platform cap, and bounds every free-text field so that the combined body cannot approach 8 MB.
- **One file per file field.** The form accepts a single sigil image.
- Netlify detects forms **at deploy time** from the built static HTML. The detection attributes and the hidden `form-name` value must exist in the prerendered output, not only after client-side hydration. This is enforced: `scripts/verify-netlify-forms.mjs` reads `dist/` after the Next.js build and fails with a non-zero exit status if any expected form lacks `data-netlify="true"`, its hidden `form-name` input, or — for the sigil form — `enctype="multipart/form-data"` and the honeypot attribute. It runs automatically as the `postbuild` step of `npm run build`, and can be run alone with `npm run verify:forms`.

**Where pending files are actually stored**

Uploaded files are stored on Netlify's infrastructure, not in this repository and not in `public/sigils/`. Files remain reachable by direct URL even after the form is deleted from the site, subject to Netlify's caching behaviour (up to 24 hours). There is no access control on that URL.

Consequently, **pending submissions are protected by obscurity rather than by segregated private storage**. This is a known limitation against the policy's own `pendingOriginalStorage` requirement — "private and outside the public webroot, or in equivalently segregated non-public storage" — and against the related requirement that original-file access be controlled and retention limited. The limitation is accepted only as an interim launch position, not as compliance. Moving to segregated, access-controlled storage is required before the Library can claim that the upload-security policy is fully met.

Client-side extension, MIME, and size checks exist for early feedback only. They are not security controls: the client-provided filename and MIME type are untrusted, and a determined contributor can bypass them. The server-side inspection, decode, re-encode, metadata-removal, and generated-filename controls described above must still be performed during moderation before any file is published.

**Metadata removal before upload**

As a privacy mitigation, the form decodes the selected image in the contributor's browser, redraws it at the same pixel dimensions, and re-encodes it in the original format (PNG→PNG, JPEG→JPEG, WebP→WebP) before the request is sent. That drops EXIF, XMP, GPS, and device metadata from the copy that Netlify receives. It is best-effort, not a guarantee: it depends on the contributor's browser, and a modified client can bypass it. If the browser cannot re-encode the image, the form says so plainly and requires the contributor to tick an explicit risk-acceptance box before the original is uploaded; it never silently sends the original. The re-encoded copy is re-checked against the 5 MiB limit because PNG output can be much larger than the source.

**Retention of pending originals**

The policy target is deletion within **30 days of the moderation decision** (see the privacy section above). At policy 1.0.7 this deletion is a manual moderation responsibility, not an automated platform control, because Netlify Forms exposes submissions rather than a lifecycle API this static site can operate. It is therefore a real commitment that depends on the steward or a moderator acting on it, and the pipeline requirement is not fully met until deletion is automated or evidenced.

## Correction, reconsideration, withdrawal, and removal

Requests to correct publication metadata, reconsider a moderation decision, withdraw permission, or remove a work should be sent through [`/contact/`](/contact/).

A request should identify the sigil and requested action. The project should verify the requester's relationship to the work when reasonably necessary, acknowledge the request, preserve only records needed to administer it, and update or remove the public record as appropriate.

For display-only works, withdrawal operates as described above. For Creative Commons works, stopping distribution and removing the library entry does not revoke rights already granted to recipients under the applicable irrevocable CC licence. Copies outside the project's control may therefore remain lawful under those terms.

## Publication checklist

The canonical checklist is structured in `sigilPolicy.publicationChecklist` and has exactly **13 per-work items**. The list below mirrors those items one-for-one; if the two ever diverge, the structured policy is canonical and this document is wrong. Before publication, the **Library steward** must confirm all 13 for the work in question:

- [ ] `intended-for-library` — **Collection intent confirmed.** The work is explicitly intended for the Living Sigil Library.
- [ ] `policy-snapshot-recorded` — **Policy snapshot recorded.** The accepted policy version and effective date are stored with the submission.
- [ ] `registry-id-assigned` — **Registry identifier assigned.** A permanent registry identifier has been assigned in order of admission and recorded with the work. Identifiers are never re-sorted, reused, or reassigned.
- [ ] `rights-confirmed` — **Rights and permission confirmed.** Original authorship or adequate permission to submit and apply the selected licence is confirmed; any human creative contribution and AI assistance are accurately disclosed; required rights and provenance are recorded; and known third-party concerns are resolved or documented.
- [ ] `attribution-confirmed` — **Attribution confirmed.** Real name, soul name, or Anonymous is explicitly selected and the public text matches that choice.
- [ ] `licence-confirmed` — **Licence confirmed.** A launch licence is explicitly selected and its public label and official link, where applicable, are correct.
- [ ] `creator-voice-recorded` — **Creator-voice content faithful.** The record carries exactly the creator-voice content the creator supplied, verbatim: every creator-voice field present was supplied by the creator, and none was invented, inferred, paraphrased, or composed from the creator's own phrases; and omitted fields were genuinely not supplied by the creator. A sigil with no creator-voice content must await the creator before publication.
- [ ] `file-validated` — **File validated.** The upload is within 5 MiB, matches an allowed extension and server-inspected PNG, JPEG, or WebP type, and satisfies decode, dimension, pixel-count, and safety limits.
- [ ] `public-derivative-prepared` — **Safe public derivative prepared.** The approved public asset uses a generated filename, has been decoded and re-encoded, and has unnecessary EXIF and other metadata removed.
- [ ] `private-data-excluded` — **Private data excluded.** The public record contains no private email, restricted identity information, submission notes, or unnecessary embedded metadata.
- [ ] `moderation-passed` — **Moderation passed.** A moderator has reviewed the work against every structured moderation reason and recorded the decision.
- [ ] `claims-reviewed` — **Outcome claims reviewed.** The title, description, artwork context, and accompanying text do not promise guaranteed outcomes or replace qualified professional care.
- [ ] `presentation-reviewed` — **Publication presentation reviewed.** The final entry is accurate, accessible, respectful, and includes the correction, reconsideration, and removal route.

### Pipeline preconditions — **NOT currently met**

The requirements below belong to the **submission pipeline as a whole**, not to any individual work. They are preconditions for the pipeline to be trustworthy and they are **not** checkboxes a work can pass. At policy 1.0.7 they are **not met** (except where noted as partial); see [“Submission pipeline: real limits and privacy characteristics”](#submission-pipeline-real-limits-and-privacy-characteristics).

- **Segregated private pending storage.** Pending originals must sit in access-controlled, non-public storage segregated from public delivery. **Not met:** Netlify Forms stores them on shared hosting infrastructure and each file is reachable by direct URL, so they are protected by obscurity rather than access control.
- **Limited retention of pending originals.** Pending originals must be deleted on a defined schedule. **Not currently met operationally:** the policy sets a 30-day post-decision target, but deletion is manual at 1.0.7, so there is no automated control or retained deletion evidence.
- **Metadata removal before publication.** Identifying metadata must be stripped from anything delivered or retained. **Partially met:** the form now re-encodes images in the browser before upload (best-effort, bypassable), and moderation must still produce a clean public derivative. It is not enforced server-side at intake.

**Passing all 13 per-work items does NOT imply that these pipeline preconditions are satisfied.** A work can pass every per-work item while the pipeline remains below the policy's standard. Publication under policy 1.0.7 is an explicitly acknowledged interim position, not compliance.

## Launch readiness

The **Library steward** is responsible for confirming launch readiness. Policy defines only the durable rule. The **3–6 approved, rights-cleared seed works** range describes the **launch window**: how many approved, rights-cleared seed works launch requires. Its maximum is **planning metadata**, not a permanent cap. Readiness is a **floor** at the minimum: once at least 3 approved, rights-cleared seed works are catalogued, the Library is ready for launch, and later works never mark it unready again. Works beyond the launch window are intended post-launch growth; the readiness helper reports that state as informational only and does not let it affect readiness.

The mutable status is derived from the sigil catalogue rather than stored in the policy, so approving a new work never forces a policy revision. The approved rights-cleared seed count, the number of works still required to reach the minimum, whether the count exceeds the launch window, the readiness state, and a human-readable readiness reason are all computed from the catalogue by the derived readiness helper in `src/data/sigils.ts` together with this rule.

Unowned or generic generated placeholders and third-party works without confirmed rights must not be represented as approved seed contributions. Rights-cleared, steward-directed AI-assisted works may qualify under the eligibility requirements above. Every seed work must pass the same rights, attribution, licence, privacy, security, and moderation checks as later submissions.

## References and review notice

Official references:

- Creative Commons Attribution 4.0 International: https://creativecommons.org/licenses/by/4.0/
- Creative Commons Attribution-NonCommercial-ShareAlike 4.0 International: https://creativecommons.org/licenses/by-nc-sa/4.0/
- Creative Commons licensing guidance: https://creativecommons.org/share-your-work/cclicenses/
- OWASP File Upload Cheat Sheet: https://cheatsheetseries.owasp.org/cheatsheets/File_Upload_Cheat_Sheet.html

This policy language requires qualified legal review before a public submission form launches. **That review has not been completed.** Public sigil submissions were nonetheless opened on 2026-10-19 under the Library steward's direction, recorded as `legal.stewardOverrides.publicSigilSubmissionLaunch` in the canonical policy. The requirement `qualifiedReviewRequiredBeforePublicFormLaunch` therefore remains `true`; opening the form did not satisfy it. Contributors should obtain their own independent legal advice before submitting a work or relying on a licence summary. Nothing in this document is legal advice.
