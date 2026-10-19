"use client";

import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import SacredButton from "@/components/SacredButton";
import Field from "@/components/form/Field";
import { fieldClass, fieldErrorClass } from "@/components/form/styles";
import {
  sigilPolicy,
  SIGIL_ACCEPTED_IMAGE_TYPES,
  SIGIL_ATTRIBUTION_CHOICES,
  SIGIL_LAUNCH_LICENCES,
} from "@/data/sigilPolicy";
import {
  ImageMetadataError,
  removeImageMetadata,
} from "@/lib/imageMetadata";
import { submitNetlifyForm } from "@/lib/netlifyForms";
import { AlertCircle, CheckCircle, Send } from "lucide-react";

type SubmissionStatus =
  | "idle"
  | "validating"
  | "uploading"
  | "submitted"
  | "validation-error"
  | "server-error";

type PreparedImage =
  | { status: "processing" }
  | { status: "ready"; file: File; originalSize: number }
  | { status: "failed"; reason: string }
  | { status: "rejected"; reason: string };

/** Keep free-text bounds well inside Netlify's 8 MB whole-request limit. */
const LIMITS = {
  creator: 200,
  email: 254,
  title: 200,
  subtitle: 200,
  meaning: 2000,
  intention: 2000,
  suggestedUse: 2000,
  inscription: 2000,
  frequency: 100,
  tags: 200,
  creationLocation: 200,
  honeypot: 256,
} as const;

const ACCEPTED_EXTENSIONS: readonly string[] =
  SIGIL_ACCEPTED_IMAGE_TYPES.flatMap((type) => type.extensions);
const ACCEPTED_MIME_TYPES: readonly string[] = SIGIL_ACCEPTED_IMAGE_TYPES.map(
  (type) => type.mimeType
);
const ACCEPT_ATTRIBUTE = ACCEPTED_EXTENSIONS.join(",");
const MAX_UPLOAD_BYTES = sigilPolicy.uploadSecurity.maxUploadSizeBytes;
const MAX_UPLOAD_MIB = sigilPolicy.uploadSecurity.maxUploadSizeMiB;
const RETENTION_DAYS =
  sigilPolicy.uploadSecurity.serverSideControls
    .pendingOriginalRetentionDaysAfterDecision;

/** Maps a validation-error key to the element that error message is about. */
const ERROR_TARGETS: Record<string, string> = {
  creator: "sigil-creator",
  email: "sigil-email",
  title: "sigil-title",
  image: "sigil-image",
  metadata: "sigil-metadata-risk",
  attribution: "sigil-attribution",
  licence: "sigil-licence",
  ownership: "sigil-rights",
  consent: "sigil-rights",
};

function getExtension(filename: string): string {
  const index = filename.lastIndexOf(".");
  return index === -1 ? "" : filename.slice(index).toLowerCase();
}

function validateFile(file: File): string | null {
  const extension = getExtension(file.name);
  const reportedType = file.type.toLowerCase();

  if (extension === ".svg" || reportedType === "image/svg+xml") {
    return "SVG files cannot be accepted. Please upload a PNG, JPEG, or WebP image.";
  }
  if (!ACCEPTED_EXTENSIONS.includes(extension)) {
    return `Unsupported file extension. Accepted extensions: ${ACCEPTED_EXTENSIONS.join(
      ", "
    )}.`;
  }
  // Some browsers/OSes report an empty type for a genuine image. The extension
  // allowlist has already passed, so fall back to it; the server still inspects
  // the real file, and this remains a preliminary check only.
  if (reportedType && !ACCEPTED_MIME_TYPES.includes(reportedType)) {
    return "The browser reported a file type we cannot accept. Please upload a PNG, JPEG, or WebP image.";
  }
  if (file.size > MAX_UPLOAD_BYTES) {
    return `The image is larger than ${MAX_UPLOAD_MIB} MiB. Please compress or resize it and try again.`;
  }
  return null;
}

function failureMessage(
  result: Awaited<ReturnType<typeof submitNetlifyForm>>
): string {
  if (result.kind === "timeout") {
    return "The upload timed out after 35 seconds. The file may be too large for your connection, or the connection stalled. Try a smaller or more compressed image. Before resubmitting, check whether the submission arrived (for example, look for the confirmation email or ask through the contact page): a retry after a timeout can create a duplicate submission.";
  }
  if (result.kind === "network") {
    return "We could not reach the server, so the submission was not confirmed. Check your connection and try again. If the connection dropped mid-upload, check whether the submission arrived before resubmitting — a retry can create a duplicate submission.";
  }
  if (result.status === 413) {
    return `The server rejected the submission as too large (HTTP 413). The whole request must stay under 8 MB and the image under ${MAX_UPLOAD_MIB} MiB. Compress or resize the image, then try again.`;
  }
  if (result.status >= 500) {
    return `The server had a problem accepting the submission (HTTP ${result.status}). This is not caused by your form entries. Wait a moment and try again; if it keeps happening, use the contact page so the Library steward can look into it.`;
  }
  return `The submission was not accepted (HTTP ${result.status}). Check the form entries and try again. If it keeps happening, use the contact page — do not assume the work was received.`;
}

export default function SigilSubmissionForm() {
  const formRef = useRef<HTMLFormElement>(null);
  const errorSummaryRef = useRef<HTMLDivElement>(null);
  const serverMessageRef = useRef<HTMLDivElement>(null);
  const successHeadingRef = useRef<HTMLHeadingElement>(null);
  const prepareToken = useRef(0);

  const [status, setStatus] = useState<SubmissionStatus>("idle");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [serverMessage, setServerMessage] = useState("");
  const [fileMeta, setFileMeta] = useState<{ name: string; size: number } | null>(
    null
  );
  const [prepared, setPrepared] = useState<PreparedImage | null>(null);

  const errorList = Object.entries(errors);
  const preparing = prepared?.status === "processing";

  useEffect(() => {
    if (status === "submitted") {
      successHeadingRef.current?.focus();
    } else if (status === "validation-error") {
      errorSummaryRef.current?.focus();
    } else if (status === "server-error") {
      serverMessageRef.current?.focus();
    }
  }, [status]);

  const handleFileChange = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];
    const token = ++prepareToken.current;

    if (!file) {
      // M8: browsers do not fire `change` when the picker is cancelled, so a
      // missing file here means the selection was cleared. Drop stale state
      // rather than raising an error the user cannot act on; submit-time
      // validation still reports a missing image.
      setFileMeta(null);
      setPrepared(null);
      return;
    }

    setFileMeta({ name: file.name, size: file.size });
    const message = validateFile(file);
    if (message) {
      setPrepared(null);
      setErrors((prev) => ({ ...prev, image: message }));
      return;
    }

    setErrors((prev) => {
      const next = { ...prev };
      delete next.image;
      delete next.metadata;
      return next;
    });
    setPrepared({ status: "processing" });

    try {
      const { blob } = await removeImageMetadata(file);
      if (token !== prepareToken.current) return;

      if (blob.size > MAX_UPLOAD_BYTES) {
        const sizeMiB = (blob.size / (1024 * 1024)).toFixed(1);
        const reason = `Removing location and device metadata re-encoded this image to ${sizeMiB} MiB, which is larger than the ${MAX_UPLOAD_MIB} MiB limit (PNG output is often much larger than the source). Please resize or compress the image and choose it again.`;
        setPrepared({ status: "rejected", reason });
        setErrors((prev) => ({ ...prev, image: reason }));
        return;
      }

      setPrepared({
        status: "ready",
        file: new File([blob], file.name, {
          type: file.type || blob.type,
          lastModified: Date.now(),
        }),
        originalSize: file.size,
      });
    } catch (error) {
      if (token !== prepareToken.current) return;
      const reason =
        error instanceof ImageMetadataError
          ? error.message
          : "The image could not be re-encoded in this browser.";
      setPrepared({ status: "failed", reason });
    }
  };

  const validate = (formEl: HTMLFormElement): Record<string, string> => {
    const next: Record<string, string> = {};
    const data = new FormData(formEl);
    const value = (name: string) => String(data.get(name) ?? "").trim();

    if (!value("creator")) next.creator = "Please enter your name or soul name.";
    const email = value("email");
    if (!email) {
      next.email = "Please enter an email address for follow-up.";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      next.email = "Please enter a valid email address.";
    }
    if (!value("title")) next.title = "Please give the sigil a title.";

    const imageInput = formEl.elements.namedItem("image") as HTMLInputElement | null;
    const file = imageInput?.files?.[0];
    if (!file) {
      next.image = "Please choose an image to upload.";
    } else {
      const fileError = validateFile(file);
      if (fileError) next.image = fileError;
    }

    if (preparing) {
      next.image =
        "Please wait a moment while the image is prepared, then submit again.";
    } else if (prepared?.status === "rejected") {
      next.image = prepared.reason;
    } else if (file && prepared?.status === "failed") {
      const consented = Boolean(
        formEl.querySelector('input[name="metadata-risk-consent"]:checked')
      );
      if (!consented) {
        next.metadata =
          "Location and device metadata could not be removed in this browser. Tick the box to confirm you accept uploading the original file with its metadata, or choose a different image.";
      }
    }

    if (!formEl.querySelector('input[name="attribution"]:checked')) {
      next.attribution =
        "Please choose how you wish to be credited in the public Library.";
    }
    if (!formEl.querySelector('input[name="licence"]:checked')) {
      next.licence = "Please choose a licence for your work.";
    }
    if (!formEl.querySelector('input[name="ownership-confirmed"]:checked')) {
      next.ownership =
        "Please confirm that this is your original work or that you have permission to submit it.";
    }
    if (!formEl.querySelector('input[name="publication-consent"]:checked')) {
      next.consent =
        "Please confirm that you consent to moderation and possible publication.";
    }

    return next;
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formEl = event.currentTarget;

    setServerMessage("");
    setStatus("validating");

    const nextErrors = validate(formEl);
    if (Object.keys(nextErrors).length > 0) {
      setErrors(nextErrors);
      setStatus("validation-error");
      return;
    }

    setErrors({});
    setStatus("uploading");

    const formData = new FormData(formEl);
    // Replace the picked original with the re-encoded copy whose EXIF/GPS has
    // been dropped. Only fall back to the original when the contributor has
    // explicitly accepted the metadata risk.
    if (prepared?.status === "ready") {
      formData.set("image", prepared.file);
    }

    // submitNetlifyForm reports fetch failures as result kinds, but a throw
    // from anywhere in the submit path would otherwise leave the status stuck
    // at "uploading" with the button permanently disabled.
    let result: Awaited<ReturnType<typeof submitNetlifyForm>>;
    try {
      result = await submitNetlifyForm(formData);
    } catch {
      setServerMessage(
        "The submission stopped unexpectedly before the server confirmed it, so we cannot tell whether it arrived. Check your connection and try again. If the connection may have dropped mid-upload, check whether the submission arrived (for example, look for the confirmation email or ask through the contact page) before resubmitting — a retry can create a duplicate submission."
      );
      setStatus("server-error");
      return;
    }

    if (result.kind === "ok") {
      setStatus("submitted");
      window.scrollTo({ top: 0, behavior: "smooth" });
    } else {
      setServerMessage(failureMessage(result));
      setStatus("server-error");
    }
  };

  const announcement =
    status === "validating"
      ? "Checking your submission."
      : status === "uploading"
        ? "Uploading your submission. Please wait."
        : status === "validation-error"
          ? "Your submission has errors that need attention."
          : status === "server-error"
            ? serverMessage
            : status === "submitted"
              ? "Your sigil has been submitted successfully. It is awaiting moderation and is not published."
              : preparing
                ? "Preparing your image and removing location metadata."
                : "";

  return (
    <>
      {/* Mounted in every state, including the success view, so a screen reader
          never loses the confirmation or the reason for a failure. */}
      <p aria-live="polite" role="status" className="sr-only">
        {announcement}
      </p>

      {status === "submitted" ? (
        <div className="flex min-h-[60vh] flex-col items-center justify-center px-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6 }}
            className="max-w-lg text-center"
          >
            <CheckCircle
              className="mx-auto h-12 w-12 text-[#d4a853]"
              aria-hidden="true"
            />
            <h2
              ref={successHeadingRef}
              tabIndex={-1}
              className="mt-6 text-2xl font-light tracking-wide text-[#f5f0e8] outline-none"
            >
              Your sigil has entered the field.
            </h2>
            <p className="mt-3 text-sm leading-relaxed text-[#c8c4b8]">
              Thank you for offering your work. Your submission has been received
              and is{" "}
              <strong className="font-medium text-[#f5f0e8]">moderated</strong>.
              It is{" "}
              <strong className="font-medium text-[#f5f0e8]">
                not published automatically
              </strong>
              . A moderator will review it, and you will be contacted at the email
              address you supplied if follow-up is needed.
            </p>
            <p className="mt-3 text-sm leading-relaxed text-[#7a7a8a]">
              Submission does not guarantee publication. The Living Codex may
              decline, defer, or request changes to any work.
            </p>
            <div className="mt-8 flex flex-wrap justify-center gap-3">
              <SacredButton href="/sigils/" variant="primary" size="md">
                Explore the Library
              </SacredButton>
              <SacredButton href="/submit/" variant="outline" size="md">
                Return to Submission
              </SacredButton>
            </div>
          </motion.div>
        </div>
      ) : (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mt-10"
        >
          <form
            ref={formRef}
            onSubmit={handleSubmit}
            noValidate
            className="space-y-8"
            name="sigil-submission"
            data-netlify="true"
            data-netlify-honeypot="bot-field"
            {...({ enctype: "multipart/form-data" } as Record<string, string>)}
            method="POST"
            action="/"
          >
            <input type="hidden" name="form-name" value="sigil-submission" />
            <input
              type="hidden"
              name="policyVersion"
              value={sigilPolicy.policyVersion}
            />
            <input
              type="hidden"
              name="policyEffectiveDate"
              value={sigilPolicy.effectiveDate}
            />

            <p className="hidden" aria-hidden="true">
              <label>
                Don&apos;t fill this out if you&apos;re human:
                <input
                  name="bot-field"
                  tabIndex={-1}
                  autoComplete="off"
                  maxLength={LIMITS.honeypot}
                />
              </label>
            </p>

            {errorList.length > 0 && (
              <div
                ref={errorSummaryRef}
                tabIndex={-1}
                role="alert"
                aria-labelledby="sigil-error-summary-heading"
                className="rounded-lg border border-[rgba(220,130,130,0.45)] bg-[rgba(120,40,40,0.12)] p-4 outline-none focus:ring-2 focus:ring-[#d4a853]/40"
              >
                <h3
                  id="sigil-error-summary-heading"
                  aria-label="Please check the following"
                  className="flex items-center gap-2 text-xs tracking-widest uppercase text-[#e0a0a0]"
                >
                  <AlertCircle className="h-4 w-4" aria-hidden="true" />
                  Please check the following
                </h3>
                <ul className="mt-2 list-inside list-disc space-y-1 text-[11px] leading-relaxed text-[#c8c4b8]">
                  {errorList.map(([field, message]) => (
                    <li key={field}>
                      <a
                        href={`#${ERROR_TARGETS[field] ?? "sigil-creator"}`}
                        className="underline underline-offset-2 hover:text-[#f5f0e8]"
                      >
                        {message}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {status === "server-error" && serverMessage && (
              <div
                ref={serverMessageRef}
                tabIndex={-1}
                role="alert"
                className="rounded-lg border border-[rgba(220,130,130,0.45)] bg-[rgba(120,40,40,0.12)] p-4 text-[11px] leading-relaxed text-[#c8c4b8] outline-none focus:ring-2 focus:ring-[#d4a853]/40"
              >
                {serverMessage}
              </div>
            )}

            <fieldset className="space-y-6">
              <legend
                aria-label="The Work"
                className="mb-4 text-[11px] tracking-widest uppercase text-[#d4a853]"
              >
                The Work
              </legend>

              <div className="grid gap-6 sm:grid-cols-2">
                <Field
                  id="sigil-creator"
                  label="Creator / soul name"
                  required
                  help="This is the name you are offering with the work. Its public display is governed by your attribution choice below."
                  helpId="sigil-creator-help"
                  error={errors.creator}
                  errorId="sigil-creator-error"
                >
                  <input
                    id="sigil-creator"
                    required
                    name="creator"
                    maxLength={LIMITS.creator}
                    autoComplete="name"
                    className={errors.creator ? fieldErrorClass : fieldClass}
                    placeholder="How you wish to be known"
                  />
                </Field>

                <Field
                  id="sigil-email"
                  label="Email"
                  required
                  help="Private, and used only for submission follow-up, administration, and correction or removal requests. It is never published. It is also stored in our hosting provider's (Netlify's) form submission records and may be emailed to the Library steward so the submission can be reviewed."
                  helpId="sigil-email-help"
                  error={errors.email}
                  errorId="sigil-email-error"
                >
                  <input
                    id="sigil-email"
                    required
                    type="email"
                    name="email"
                    maxLength={LIMITS.email}
                    autoComplete="email"
                    className={errors.email ? fieldErrorClass : fieldClass}
                    placeholder="For follow-up only"
                  />
                </Field>
              </div>

              <div className="grid gap-6 sm:grid-cols-2">
                <Field
                  id="sigil-title"
                  label="Sigil title"
                  required
                  error={errors.title}
                  errorId="sigil-title-error"
                >
                  <input
                    id="sigil-title"
                    required
                    name="title"
                    maxLength={LIMITS.title}
                    className={errors.title ? fieldErrorClass : fieldClass}
                    placeholder="The title of your sigil"
                  />
                </Field>
                <Field
                  id="sigil-subtitle"
                  label="Subtitle (optional)"
                  help="Optional. Leave blank if the work carries no subtitle."
                  helpId="sigil-subtitle-help"
                >
                  <input
                    id="sigil-subtitle"
                    name="subtitle"
                    maxLength={LIMITS.subtitle}
                    className={fieldClass}
                    placeholder="A ceremonial subtitle, if the work has one"
                  />
                </Field>
              </div>

              <Field
                id="sigil-image"
                label="Sigil image"
                required
                help={`PNG, JPEG, or WebP only. Maximum ${MAX_UPLOAD_MIB} MiB, one file. Before upload, your browser re-encodes the image at the same dimensions to remove location (GPS) and device metadata — that is why an anonymous photo does not leak where it was taken. If this browser cannot do that, you will be asked to accept the risk explicitly before the original is sent. A 1024 × 1024 PNG is recommended. SVG is not accepted.`}
                helpId="sigil-image-help"
                error={errors.image}
                errorId="sigil-image-error"
              >
                <input
                  id="sigil-image"
                  required
                  type="file"
                  name="image"
                  accept={ACCEPT_ATTRIBUTE}
                  onChange={handleFileChange}
                  className={`${errors.image ? fieldErrorClass : fieldClass} file:mr-3 file:rounded-md file:border-0 file:bg-[rgba(212,168,83,0.15)] file:px-3 file:py-1.5 file:text-[10px] file:tracking-wider file:uppercase file:text-[#d4a853]`}
                />
              </Field>

              {fileMeta && (
                <p className="text-[10px] text-[#c8c4b8]" aria-live="polite">
                  Selected: {fileMeta.name} ({Math.ceil(fileMeta.size / 1024)}{" "}
                  KiB)
                  {preparing
                    ? " — removing location and device metadata…"
                    : prepared?.status === "ready"
                      ? " — metadata removed; ready to submit."
                      : ""}
                </p>
              )}

              {prepared?.status === "failed" && (
                <div className="rounded-lg border border-[rgba(220,130,130,0.45)] bg-[rgba(120,40,40,0.12)] p-4">
                  <p className="text-[11px] leading-relaxed text-[#c8c4b8]">
                    <strong className="font-medium text-[#e0a0a0]">
                      Location and device metadata could not be removed
                    </strong>{" "}
                    from this image in your browser ({prepared.reason}). If you
                    submit it anyway, the original file — including any EXIF,
                    GPS, and device information it contains — will be uploaded to
                    our hosting provider. That is especially risky if you chose
                    Anonymous. Choose a different image, or confirm below.
                  </p>
                  <label className="mt-3 flex items-start gap-3">
                    <input
                      id="sigil-metadata-risk"
                      type="checkbox"
                      name="metadata-risk-consent"
                      aria-describedby={
                        errors.metadata ? "sigil-metadata-risk-error" : undefined
                      }
                      aria-invalid={Boolean(errors.metadata)}
                      className="mt-0.5 h-4 w-4 accent-[#d4a853]"
                    />
                    <span className="text-xs leading-relaxed text-[#c8c4b8]">
                      I understand that the image&apos;s location and device
                      metadata could not be removed, and I choose to upload the
                      original anyway.
                    </span>
                  </label>
                  {errors.metadata && (
                    <p id="sigil-metadata-risk-error" className="mt-1.5 text-[11px] leading-relaxed text-[#e0a0a0]">
                      {errors.metadata}
                    </p>
                  )}
                </div>
              )}
            </fieldset>

            <fieldset className="space-y-6">
              <legend
                aria-label="Meaning and Use"
                className="mb-4 text-[11px] tracking-widest uppercase text-[#d4a853]"
              >
                Meaning and Use
              </legend>

              <Field
                id="sigil-meaning"
                label="Meaning (optional)"
                help="Only your own words will be published. Moderators will not write or rewrite creator-voice text for you."
                helpId="sigil-meaning-help"
              >
                <textarea
                  id="sigil-meaning"
                  name="meaning"
                  rows={4}
                  maxLength={LIMITS.meaning}
                  className={fieldClass}
                  placeholder="What this sigil means, in your own words."
                />
              </Field>

              <Field id="sigil-intention" label="Intention (optional)">
                <textarea
                  id="sigil-intention"
                  name="intention"
                  rows={3}
                  maxLength={LIMITS.intention}
                  className={fieldClass}
                  placeholder="The intention held while creating the work."
                />
              </Field>

              <Field
                id="sigil-suggested-use"
                label="Suggested use (optional)"
                help="Please do not promise guaranteed medical, psychological, or financial outcomes."
                helpId="sigil-suggested-use-help"
              >
                <textarea
                  id="sigil-suggested-use"
                  name="suggested-use"
                  rows={3}
                  maxLength={LIMITS.suggestedUse}
                  className={fieldClass}
                  placeholder="How the sigil might be worked with."
                />
              </Field>

              <Field id="sigil-inscription" label="Inscription (optional)">
                <textarea
                  id="sigil-inscription"
                  name="inscription"
                  rows={3}
                  maxLength={LIMITS.inscription}
                  className={fieldClass}
                  placeholder="Any words inscribed within or around the sigil."
                />
              </Field>

              <div className="grid gap-6 sm:grid-cols-3">
                <Field id="sigil-element" label="Element (optional)">
                  <select
                    id="sigil-element"
                    name="element"
                    defaultValue=""
                    className={fieldClass}
                  >
                    <option value="">Select element</option>
                    <option value="Earth">Earth</option>
                    <option value="Water">Water</option>
                    <option value="Fire">Fire</option>
                    <option value="Air">Air</option>
                    <option value="Aether">Aether</option>
                  </select>
                </Field>
                <Field id="sigil-frequency" label="Frequency (optional)">
                  <input
                    id="sigil-frequency"
                    name="frequency"
                    maxLength={LIMITS.frequency}
                    className={fieldClass}
                    placeholder="e.g. 528 Hz"
                  />
                </Field>
                <Field id="sigil-creation-date" label="Creation date (optional)">
                  <input
                    id="sigil-creation-date"
                    type="date"
                    name="creation-date"
                    className={fieldClass}
                  />
                </Field>
              </div>

              <div className="grid gap-6 sm:grid-cols-2">
                <Field
                  id="sigil-creation-location"
                  label="Creation location (optional)"
                  help="Consider leaving this blank, especially if you choose Anonymous."
                  helpId="sigil-creation-location-help"
                >
                  <input
                    id="sigil-creation-location"
                    name="creation-location"
                    maxLength={LIMITS.creationLocation}
                    className={fieldClass}
                    placeholder="City, Country"
                  />
                </Field>
                <Field
                  id="sigil-tags"
                  label="Tags (optional)"
                  help={
                    <>
                      Enter tags separated by commas, for example &ldquo;heart,
                      union, protection&rdquo;.
                    </>
                  }
                  helpId="sigil-tags-help"
                >
                  <input
                    id="sigil-tags"
                    name="tags"
                    maxLength={LIMITS.tags}
                    className={fieldClass}
                    placeholder="sacred union, heart, protection"
                  />
                </Field>
              </div>
            </fieldset>

            <fieldset
              id="sigil-attribution"
              tabIndex={-1}
              aria-label="Public attribution"
              className="space-y-3 rounded-lg border border-[rgba(212,168,83,0.1)] bg-[#12141c]/40 p-4 outline-none"
              aria-describedby={
                errors.attribution
                  ? "sigil-attribution-help sigil-attribution-error"
                  : "sigil-attribution-help"
              }
              aria-invalid={Boolean(errors.attribution)}
            >
              <legend
                aria-hidden="true"
                className="px-1 text-[10px] tracking-widest uppercase text-[#d4a853]"
              >
                Public attribution *
              </legend>
              <p id="sigil-attribution-help" className="text-[11px] leading-relaxed text-[#7a7a8a]">
                Choose how you appear beside the sigil if it is published.
                Anonymous governs public display only: a private administration
                record may be retained to review the work, document permission,
                and handle correction or removal requests.
              </p>
              {SIGIL_ATTRIBUTION_CHOICES.map((choice) => (
                <label key={choice.id} className="flex items-start gap-3">
                  <input
                    required
                    type="radio"
                    name="attribution"
                    value={choice.id}
                    className="mt-0.5 h-4 w-4 accent-[#d4a853]"
                  />
                  <span>
                    <span className="block text-xs text-[#f5f0e8]">
                      {choice.label}
                    </span>
                    <span className="mt-0.5 block text-[11px] leading-relaxed text-[#7a7a8a]">
                      {choice.description}
                    </span>
                  </span>
                </label>
              ))}
              {errors.attribution && (
                <p id="sigil-attribution-error" className="mt-1.5 text-[11px] leading-relaxed text-[#e0a0a0]">
                  {errors.attribution}
                </p>
              )}
            </fieldset>

            {/* C1: prominent, contributor-facing disclosure of the steward
                override. The required qualified review has NOT happened; the
                wording below is the canonical policy notice, rendered in full
                because the static export does not publish docs/. */}
            <section
              aria-labelledby="sigil-legal-override-heading"
              className="rounded-lg border border-[rgba(220,130,130,0.45)] bg-[rgba(120,40,40,0.12)] p-4"
            >
              <h3
                id="sigil-legal-override-heading"
                aria-label="Required legal review: not completed"
                className="text-xs tracking-widest uppercase text-[#e0a0a0]"
              >
                Required legal review: not completed
              </h3>
              <p className="mt-2 text-[11px] leading-relaxed text-[#c8c4b8]">
                {sigilPolicy.legal.publicSubmissionLaunchNotice}
              </p>
              <p className="mt-2 text-[10px] leading-relaxed text-[#7a7a8a]">
                Policy version {sigilPolicy.policyVersion}, effective{" "}
                {sigilPolicy.effectiveDate}. The requirement{" "}
                <code>qualifiedReviewRequiredBeforePublicFormLaunch</code>{" "}
                remains in force; this form&apos;s launch is an explicit steward
                override recorded in the policy, not completion of the review.
              </p>
            </section>

            <fieldset
              id="sigil-licence"
              tabIndex={-1}
              aria-label="Licence"
              className="space-y-3 rounded-lg border border-[rgba(212,168,83,0.1)] bg-[#12141c]/40 p-4 outline-none"
              aria-describedby={
                errors.licence
                  ? "sigil-licence-help sigil-licence-error"
                  : "sigil-licence-help"
              }
              aria-invalid={Boolean(errors.licence)}
            >
              <legend
                aria-hidden="true"
                className="px-1 text-[10px] tracking-widest uppercase text-[#d4a853]"
              >
                Licence *
              </legend>
              <p id="sigil-licence-help" className="text-[11px] leading-relaxed text-[#7a7a8a]">
                Choose the terms under which your work may be shared. Read each
                option before submitting. These summaries are informational, not
                legal advice.
              </p>
              {SIGIL_LAUNCH_LICENCES.map((licence) => (
                <label
                  key={licence.id}
                  className="flex items-start gap-3 rounded-md border border-[rgba(212,168,83,0.1)] p-3"
                >
                  <input
                    required
                    type="radio"
                    name="licence"
                    value={licence.id}
                    className="mt-0.5 h-4 w-4 accent-[#d4a853]"
                  />
                  <span>
                    <span className="block text-xs text-[#f5f0e8]">
                      {licence.label}
                    </span>
                    <span className="mt-1 block text-[11px] leading-relaxed text-[#c8c4b8]">
                      {licence.description}
                    </span>
                    {"irrevocabilityNotice" in licence &&
                      licence.irrevocabilityNotice && (
                        <span className="mt-1 block text-[11px] leading-relaxed text-[#d4a853]">
                          {licence.irrevocabilityNotice}
                        </span>
                      )}
                    {"licenceUrl" in licence && licence.licenceUrl && (
                      <a
                        href={licence.licenceUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label={`Read the official licence: ${licence.label}`}
                        className="mt-1 inline-block text-[10px] tracking-wider uppercase text-[#d4a853] underline underline-offset-2 hover:text-[#f5f0e8]"
                      >
                        Read the official licence
                      </a>
                    )}
                  </span>
                </label>
              ))}
              <p className="text-[10px] leading-relaxed text-[#7a7a8a]">
                {sigilPolicy.legal.notice}{" "}
                <a
                  href={sigilPolicy.legal.creativeCommonsGuidanceUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[#d4a853] underline underline-offset-2 hover:text-[#f5f0e8]"
                >
                  Creative Commons licensing guidance
                </a>
                .
              </p>
              {errors.licence && (
                <p id="sigil-licence-error" className="mt-1.5 text-[11px] leading-relaxed text-[#e0a0a0]">
                  {errors.licence}
                </p>
              )}
            </fieldset>

            <fieldset
              id="sigil-rights"
              tabIndex={-1}
              aria-label="Rights and consent"
              className="space-y-4 outline-none"
            >
              <legend
                aria-hidden="true"
                className="mb-2 text-[11px] tracking-widest uppercase text-[#d4a853]"
              >
                Rights and consent
              </legend>

              <div>
                <label className="flex items-start gap-3">
                  <input
                    required
                    type="checkbox"
                    name="ownership-confirmed"
                    aria-describedby={
                      errors.ownership ? "sigil-ownership-error" : undefined
                    }
                    aria-invalid={Boolean(errors.ownership)}
                    className="mt-0.5 h-4 w-4 accent-[#d4a853]"
                  />
                  <span className="text-xs leading-relaxed text-[#c8c4b8]">
                    I confirm that this is my own original work, or that I hold
                    permission from the rights holder to submit it and to apply
                    the licence I have selected. I understand that submitting a
                    work does not transfer copyright unless the selected licence
                    says so.
                  </span>
                </label>
                {errors.ownership && (
                  <p id="sigil-ownership-error" className="mt-1.5 text-[11px] leading-relaxed text-[#e0a0a0]">
                    {errors.ownership}
                  </p>
                )}
              </div>

              <div>
                <label className="flex items-start gap-3">
                  <input
                    required
                    type="checkbox"
                    name="publication-consent"
                    aria-describedby={
                      errors.consent ? "sigil-consent-error" : undefined
                    }
                    aria-invalid={Boolean(errors.consent)}
                    className="mt-0.5 h-4 w-4 accent-[#d4a853]"
                  />
                  <span className="text-xs leading-relaxed text-[#c8c4b8]">
                    I consent to The Living Codex moderating this submission and,
                    if it is accepted, publishing the work and the metadata I
                    supplied under the licence I have selected. I understand that
                    submission does not guarantee publication, that publication
                    may be declined or deferred, and that moderator decisions are
                    made at the Library&apos;s discretion.
                  </span>
                </label>
                {errors.consent && (
                  <p id="sigil-consent-error" className="mt-1.5 text-[11px] leading-relaxed text-[#e0a0a0]">
                    {errors.consent}
                  </p>
                )}
              </div>
            </fieldset>

            <div className="rounded-lg border border-[rgba(212,168,83,0.15)] bg-[rgba(212,168,83,0.03)] p-4 text-[11px] leading-relaxed text-[#7a7a8a]">
              <h3
                aria-label="How your submission is stored and handled"
                className="text-xs tracking-widest uppercase text-[#d4a853]"
              >
                How your submission is stored and handled
              </h3>
              <p className="mt-2">
                This form is processed by our hosting provider, Netlify. Your
                email address is stored in Netlify&apos;s form submission records
                and may be emailed to the Library steward so the submission can be
                reviewed; it is never published. The image is also stored on
                Netlify&apos;s infrastructure while the submission is pending.
                That storage is not segregated private storage and the file is
                reachable by anyone who has its direct URL, so it is protected by
                obscurity rather than access control.
              </p>
              <p className="mt-2">
                Before upload, this form re-encodes the image in your browser at
                the same dimensions to remove location and device metadata. If the
                browser cannot do that, you are told and asked to accept the risk
                explicitly. Pending originals are deleted within{" "}
                <strong className="text-[#c8c4b8]">{RETENTION_DAYS} days</strong>{" "}
                of a moderation decision; limited copies may remain in
                service-provider backups until their ordinary deletion cycles
                complete. To correct, reconsider, withdraw, or request removal of
                a submission, use the{" "}
                <a
                  href="/contact/"
                  className="text-[#d4a853] underline underline-offset-2 hover:text-[#f5f0e8]"
                >
                  contact page
                </a>
                . Nothing here is legal advice; contributors should obtain their
                own independent advice where needed.
              </p>
            </div>

            <div className="pt-2">
              <p className="mb-3 rounded-md border border-[rgba(212,168,83,0.15)] bg-[#12141c]/60 p-3 text-[10px] leading-relaxed text-[#c8c4b8]">
                <strong className="font-medium text-[#d4a853]">
                  Slow-connection warning:
                </strong>{" "}
                a 5 MiB upload needs roughly 1.4 Mbps sustained to finish inside
                the platform&apos;s 30-second limit. On a slower connection a
                large file can time out. Compress or resize before submitting. If
                an upload times out, check whether it arrived before resubmitting
                — a retry can create a duplicate submission.
              </p>
              <SacredButton
                type="submit"
                variant="primary"
                size="lg"
                ariaLabel={
                  status === "uploading" ? "Uploading" : "Offer this sigil"
                }
                className="w-full sm:w-auto"
                disabled={status === "uploading"}
              >
                <Send className="mr-2 h-4 w-4" aria-hidden="true" />
                {status === "uploading" ? "Uploading…" : "Offer This Sigil"}
              </SacredButton>
              <p className="mt-3 text-[10px] leading-relaxed text-[#7a7a8a]">
                Every submission is moderated. Publication is never automatic and
                is never guaranteed.
              </p>
            </div>
          </form>
        </motion.div>
      )}
    </>
  );
}
