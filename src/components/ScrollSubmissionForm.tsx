"use client";

import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import SacredButton from "@/components/SacredButton";
import Field from "@/components/form/Field";
import { fieldClass, fieldErrorClass } from "@/components/form/styles";
import DisclaimerBox from "@/components/DisclaimerBox";
import { categories } from "@/data/scrolls";
import {
  ImageMetadataError,
  removeImageMetadata,
} from "@/lib/imageMetadata";
import {
  UPLOAD_ACCEPT_ATTRIBUTE as ACCEPT_ATTRIBUTE,
  UPLOAD_MAX_SIZE_BYTES as MAX_UPLOAD_BYTES,
  UPLOAD_MAX_SIZE_MIB as MAX_UPLOAD_MIB,
  UPLOAD_RETENTION_DAYS_AFTER_DECISION as RETENTION_DAYS,
  validateUploadFile,
} from "@/lib/uploadRules";
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
  | { status: "ready"; file: File }
  | { status: "failed"; reason: string }
  | { status: "rejected"; reason: string };

/**
 * Free-text bounds. The written remembrance is the scroll itself, so it is
 * given a generous ceiling; every other field is bounded so a maximal
 * legitimate submission — including a 5 MiB artwork upload — stays well inside
 * Netlify's 8 MB whole-request limit.
 */
const LIMITS = {
  name: 200,
  email: 254,
  location: 200,
  title: 200,
  frequency: 100,
  content: 20_000,
  crystal: 100,
  ally: 100,
  honeypot: 256,
} as const;

/** Maps a validation-error key to the element that error message is about. */
const ERROR_TARGETS: Record<string, string> = {
  name: "scroll-name",
  email: "scroll-email",
  title: "scroll-title",
  category: "scroll-category",
  content: "scroll-content",
  consent: "scroll-consent",
  image: "scroll-artwork",
  metadata: "scroll-metadata-risk",
};

function failureMessage(
  result: Awaited<ReturnType<typeof submitNetlifyForm>>
): string {
  if (result.kind === "timeout") {
    return "The submission timed out after 35 seconds. If you attached artwork, the file may be too large for your connection, or the connection stalled. Before resubmitting, check whether the submission arrived (for example, look for the confirmation email or ask through the contact page): a retry after a timeout can create a duplicate submission.";
  }
  if (result.kind === "network") {
    return "We could not reach the server, so the submission was not confirmed. Check your connection and try again. If the connection dropped mid-send, check whether the submission arrived before resubmitting — a retry can create a duplicate submission.";
  }
  if (result.status === 413) {
    return `The server rejected this submission as too large (HTTP 413). The whole request must stay under 8 MB and any attached image under ${MAX_UPLOAD_MIB} MiB. Shorten the written remembrance or compress the image, then try again.`;
  }
  if (result.status >= 500) {
    return `The server had a problem accepting the submission (HTTP ${result.status}). Wait a moment and try again; if it keeps happening, use the contact page.`;
  }
  return `The submission was not accepted (HTTP ${result.status}). Check the form entries and try again. If it keeps happening, use the contact page — do not assume the work was received.`;
}

export default function ScrollSubmissionForm() {
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

    // The artwork is OPTIONAL. Browsers do not fire `change` when the picker is
    // cancelled, so a missing file here means the selection was cleared: drop
    // stale state rather than raising an error the user cannot act on, and let
    // the form submit with no artwork.
    if (!file) {
      setFileMeta(null);
      setPrepared(null);
      return;
    }

    setFileMeta({ name: file.name, size: file.size });
    const message = validateUploadFile(file);
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
        const reason = `Removing location and device metadata re-encoded this image to ${sizeMiB} MiB, which is larger than the ${MAX_UPLOAD_MIB} MiB limit (PNG output is often much larger than the source). Please resize or compress the image and choose it again, or submit the scroll without artwork.`;
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

    if (!value("name")) next.name = "Please enter your name or soul name.";

    const email = value("email");
    if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      next.email = "Please enter a valid email address, or leave it blank.";
    }

    if (!value("title")) next.title = "Please give the scroll a title.";
    if (!value("category")) next.category = "Please choose a category.";

    const imageInput = formEl.elements.namedItem("artwork") as
      | HTMLInputElement
      | null;
    const file = imageInput?.files?.[0];

    // The artwork is optional: only validate a file when one was chosen.
    if (file) {
      const fileError = validateUploadFile(file);
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
          "Location and device metadata could not be removed in this browser. Tick the box to confirm you accept uploading the original file with its metadata, remove the artwork, or choose a different image.";
      }
    }

    if (!formEl.querySelector('input[name="consent"]:checked')) {
      next.consent =
        "Please confirm that this submission is your own work or that you have permission to share it.";
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
      formData.set("artwork", prepared.file);
    }

    let result: Awaited<ReturnType<typeof submitNetlifyForm>>;
    try {
      result = await submitNetlifyForm(formData);
    } catch {
      setServerMessage(
        "The submission stopped unexpectedly before the server confirmed it, so we cannot tell whether it arrived. Check your connection and try again. If the connection may have dropped mid-send, check whether the submission arrived (for example, look for the confirmation email or ask through the contact page) before resubmitting — a retry can create a duplicate submission."
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
        ? "Sending your submission. Please wait."
        : status === "validation-error"
          ? "Your submission has errors that need attention."
          : status === "server-error"
            ? serverMessage
            : status === "submitted"
              ? "Your scroll has been submitted successfully and is awaiting review."
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
            initial={{ opacity: 0, scale: 0.9 }}
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
              Your scroll has entered the field.
            </h2>
            <p className="mt-3 text-sm leading-relaxed text-[#c8c4b8]">
              Thank you for adding your remembrance to The Living Codex. Your
              words have been received and will be reviewed for the public
              archive according to your chosen settings.
            </p>
            <p className="mt-3 text-sm leading-relaxed text-[#7a7a8a]">
              Submitting a scroll does not guarantee publication. The Living
              Codex may decline, defer, or request changes to any submission.
            </p>
            <div className="mt-8 flex flex-wrap justify-center gap-3">
              <SacredButton href="/scrolls/" variant="primary" size="md">
                Explore Scrolls
              </SacredButton>
              <SacredButton href="/portal/" variant="outline" size="md">
                Return to Portal
              </SacredButton>
            </div>
          </motion.div>
        </div>
      ) : (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mt-4"
        >
          <form
            ref={formRef}
            onSubmit={handleSubmit}
            noValidate
            className="space-y-6"
            name="scroll-submission"
            data-netlify="true"
            data-netlify-honeypot="bot-field"
            {...({ enctype: "multipart/form-data" } as Record<string, string>)}
            method="POST"
            action="/"
          >
            <input type="hidden" name="form-name" value="scroll-submission" />

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
                aria-labelledby="scroll-error-summary-heading"
                className="rounded-lg border border-[rgba(220,130,130,0.45)] bg-[rgba(120,40,40,0.12)] p-4 outline-none focus:ring-2 focus:ring-[#d4a853]/40"
              >
                <h3
                  id="scroll-error-summary-heading"
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
                        href={`#${ERROR_TARGETS[field] ?? "scroll-name"}`}
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

            <div className="grid gap-6 sm:grid-cols-2">
              <Field
                id="scroll-name"
                label="Name or soul name"
                required
                error={errors.name}
                errorId="scroll-name-error"
              >
                <input
                  id="scroll-name"
                  required
                  name="name"
                  maxLength={LIMITS.name}
                  autoComplete="name"
                  className={errors.name ? fieldErrorClass : fieldClass}
                  placeholder="How you wish to be known"
                />
              </Field>
              <Field
                id="scroll-email"
                label="Email (optional)"
                help="For follow-up only. Stored in our hosting provider's (Netlify's) form submission records and may be emailed to the steward for review; it is never published."
                helpId="scroll-email-help"
                error={errors.email}
                errorId="scroll-email-error"
              >
                <input
                  id="scroll-email"
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
              <Field id="scroll-location" label="Location (optional)">
                <input
                  id="scroll-location"
                  name="location"
                  maxLength={LIMITS.location}
                  className={fieldClass}
                  placeholder="City, Country"
                />
              </Field>
              <Field
                id="scroll-title"
                label="Scroll title"
                required
                error={errors.title}
                errorId="scroll-title-error"
              >
                <input
                  id="scroll-title"
                  required
                  name="title"
                  maxLength={LIMITS.title}
                  className={errors.title ? fieldErrorClass : fieldClass}
                  placeholder="The title of your scroll"
                />
              </Field>
            </div>

            <div className="grid gap-6 sm:grid-cols-3">
              <Field
                id="scroll-category"
                label="Category"
                required
                error={errors.category}
                errorId="scroll-category-error"
              >
                <select
                  id="scroll-category"
                  name="category"
                  defaultValue={categories[0]}
                  className={errors.category ? fieldErrorClass : fieldClass}
                >
                  {categories.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                </select>
              </Field>
              <Field id="scroll-frequency" label="Frequency tag (optional)">
                <input
                  id="scroll-frequency"
                  name="frequency"
                  maxLength={LIMITS.frequency}
                  className={fieldClass}
                  placeholder="e.g. 528 Hz"
                />
              </Field>
              <Field id="scroll-element" label="Element (optional)">
                <select
                  id="scroll-element"
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
            </div>

            <Field
              id="scroll-content"
              label="Written remembrance"
              required
              help="This is your own writing. Moderators will not write or rewrite it for you."
              helpId="scroll-content-help"
              error={errors.content}
              errorId="scroll-content-error"
            >
              <textarea
                id="scroll-content"
                required
                name="content"
                rows={8}
                maxLength={LIMITS.content}
                className={errors.content ? fieldErrorClass : fieldClass}
                placeholder="Write your scroll here... invocation, declaration, ceremony report, dream, light language, healing protocol, or prayer."
              />
            </Field>

            <div className="grid gap-6 sm:grid-cols-2">
              <Field id="scroll-crystal" label="Crystal ally (optional)">
                <input
                  id="scroll-crystal"
                  name="crystal"
                  maxLength={LIMITS.crystal}
                  className={fieldClass}
                  placeholder="e.g. Clear Quartz"
                />
              </Field>
              <Field
                id="scroll-ally"
                label="Plant / animal / element ally (optional)"
              >
                <input
                  id="scroll-ally"
                  name="ally"
                  maxLength={LIMITS.ally}
                  className={fieldClass}
                  placeholder="e.g. Oak, Wolf, Rain"
                />
              </Field>
            </div>

            <fieldset className="space-y-6 rounded-lg border border-[rgba(212,168,83,0.1)] bg-[#12141c]/40 p-4">
              <legend
                aria-label="Optional artwork"
                className="px-1 text-[10px] tracking-widest uppercase text-[#d4a853]"
              >
                Artwork (optional)
              </legend>

              <Field
                id="scroll-artwork"
                label="Artwork (optional)"
                help={`Optional. PNG, JPEG, or WebP only; maximum ${MAX_UPLOAD_MIB} MiB, one file. Your scroll is complete without an image — leave this blank if you have nothing to attach. Before upload, your browser re-encodes the image at the same dimensions to remove location (GPS) and device metadata. If this browser cannot do that, you will be asked to accept the risk explicitly before the original is sent. SVG is not accepted.`}
                helpId="scroll-artwork-help"
                error={errors.image}
                errorId="scroll-artwork-error"
              >
                <input
                  id="scroll-artwork"
                  type="file"
                  name="artwork"
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
                    our hosting provider. Choose a different image, remove the
                    artwork, or confirm below.
                  </p>
                  <label className="mt-3 flex items-start gap-3">
                    <input
                      id="scroll-metadata-risk"
                      type="checkbox"
                      name="metadata-risk-consent"
                      aria-describedby={
                        errors.metadata ? "scroll-metadata-risk-error" : undefined
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
                    <p
                      id="scroll-metadata-risk-error"
                      className="mt-1.5 text-[11px] leading-relaxed text-[#e0a0a0]"
                    >
                      {errors.metadata}
                    </p>
                  )}
                </div>
              )}
            </fieldset>

            {/* Visibility options */}
            <fieldset
              aria-label="Visibility"
              className="space-y-3 rounded-lg border border-[rgba(212,168,83,0.1)] bg-[#12141c]/40 p-4"
            >
              <legend
                aria-hidden="true"
                className="px-1 text-[10px] tracking-widest uppercase text-[#d4a853]"
              >
                Visibility
              </legend>
              <label className="flex items-center gap-3">
                <input
                  type="radio"
                  name="privacy"
                  value="public"
                  defaultChecked
                  className="h-4 w-4 accent-[#d4a853]"
                />
                <span className="text-xs text-[#c8c4b8]">
                  I wish this to be considered for public archive
                </span>
              </label>
              <label className="flex items-center gap-3">
                <input
                  type="radio"
                  name="privacy"
                  value="private"
                  className="h-4 w-4 accent-[#d4a853]"
                />
                <span className="text-xs text-[#c8c4b8]">
                  I wish this to be private
                </span>
              </label>
              <label className="flex items-center gap-3">
                <input
                  type="checkbox"
                  name="futureArchive"
                  className="h-4 w-4 accent-[#d4a853]"
                />
                <span className="text-xs text-[#c8c4b8]">
                  I wish this to be permanently stored in the future archive
                  (Arweave)
                </span>
              </label>
            </fieldset>

            {/* Consent */}
            <div id="scroll-consent" tabIndex={-1} className="outline-none">
              <label className="flex items-start gap-3">
                <input
                  required
                  type="checkbox"
                  name="consent"
                  aria-describedby={
                    errors.consent ? "scroll-consent-error" : undefined
                  }
                  aria-invalid={Boolean(errors.consent)}
                  className="mt-0.5 h-4 w-4 accent-[#d4a853]"
                />
                <span className="text-xs leading-relaxed text-[#c8c4b8]">
                  I confirm that this submission is my own work or that I have
                  permission to share it. I understand that public submissions may
                  be featured in the Living Codex archive. I consent to the
                  processing of this information in accordance with the Codex
                  privacy practices.
                </span>
              </label>
              {errors.consent && (
                <p
                  id="scroll-consent-error"
                  className="mt-1.5 text-[11px] leading-relaxed text-[#e0a0a0]"
                >
                  {errors.consent}
                </p>
              )}
            </div>

            <div className="rounded-lg border border-[rgba(212,168,83,0.15)] bg-[rgba(212,168,83,0.03)] p-4 text-[11px] leading-relaxed text-[#7a7a8a]">
              <h3
                aria-label="How your submission is stored and handled"
                className="text-xs tracking-widest uppercase text-[#d4a853]"
              >
                How your submission is stored and handled
              </h3>
              <p className="mt-2">
                This form is processed by our hosting provider, Netlify. Your
                email address (if you supply one) is stored in Netlify&apos;s form
                submission records and may be emailed to the steward so the
                submission can be reviewed; it is never published.
              </p>
              <p className="mt-2">
                If you attach artwork, the file is stored on Netlify&apos;s
                infrastructure while the submission is pending. That storage is{" "}
                <strong className="font-medium text-[#c8c4b8]">
                  not private
                </strong>
                : the file is reachable by anyone who has its direct URL, and it
                can remain fetchable even after the submission record is deleted.
                It is protected by obscurity rather than access control. Do not
                attach anything you would not be willing to see made public.
              </p>
              <p className="mt-2">
                Before upload, this form re-encodes the image in your browser at
                the same dimensions to remove location and device metadata. If the
                browser cannot do that, you are told and asked to accept the risk
                explicitly — the original is never sent silently. Attached
                artwork is deleted within{" "}
                <strong className="text-[#c8c4b8]">{RETENTION_DAYS} days</strong>{" "}
                of a moderation decision. That deletion is currently carried out{" "}
                <strong className="text-[#c8c4b8]">manually</strong> by the
                steward, not automatically. Limited copies may remain in
                service-provider backups until their ordinary deletion cycles
                complete. To correct, reconsider, withdraw, or request removal of
                a submission, use the{" "}
                <a
                  href="/contact/"
                  className="text-[#d4a853] underline underline-offset-2 hover:text-[#f5f0e8]"
                >
                  contact page
                </a>
                .
              </p>
              <p className="mt-2">
                <strong className="font-medium text-[#c8c4b8]">
                  A scroll is personal by nature.
                </strong>{" "}
                Please do not attach identity documents (such as passports,
                licences, or ID cards), signatures, or anything else you do not
                wish to make public. Nothing here is legal advice; contributors
                should obtain their own independent advice where needed.
              </p>
            </div>

            <DisclaimerBox>
              Submissions are moderated before appearing in the public archive. The
              Living Codex reserves the right to decline submissions that violate
              natural law, promote harm, or do not align with the field&apos;s
              intention. Your information is not sold or used for advertising.
            </DisclaimerBox>

            <div className="pt-2">
              <p className="mb-3 rounded-md border border-[rgba(212,168,83,0.15)] bg-[#12141c]/60 p-3 text-[10px] leading-relaxed text-[#c8c4b8]">
                <strong className="font-medium text-[#d4a853]">
                  Slow-connection warning:
                </strong>{" "}
                if you attach artwork, a {MAX_UPLOAD_MIB} MiB upload needs roughly
                1.4 Mbps sustained to finish inside the platform&apos;s
                30-second limit. On a slower connection a large file can time out;
                compress or resize it, or submit the scroll without artwork. If an
                upload times out, check whether it arrived before resubmitting — a
                retry can create a duplicate submission.
              </p>
              <SacredButton
                type="submit"
                variant="primary"
                size="lg"
                ariaLabel={status === "uploading" ? "Sending" : "Cast into the field"}
                className="w-full sm:w-auto"
                disabled={status === "uploading"}
              >
                <Send className="mr-2 h-4 w-4" aria-hidden="true" />
                {status === "uploading" ? "Sending…" : "Cast Into the Field"}
              </SacredButton>
            </div>
          </form>
        </motion.div>
      )}
    </>
  );
}
