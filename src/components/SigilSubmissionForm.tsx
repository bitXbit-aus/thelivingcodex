"use client";

import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import SacredButton from "@/components/SacredButton";
import DisclaimerBox from "@/components/DisclaimerBox";
import {
  sigilPolicy,
  SIGIL_ACCEPTED_IMAGE_TYPES,
  SIGIL_ATTRIBUTION_CHOICES,
  SIGIL_LAUNCH_LICENCES,
} from "@/data/sigilPolicy";
import { AlertCircle, CheckCircle, Send } from "lucide-react";

type SubmissionStatus =
  | "idle"
  | "validating"
  | "uploading"
  | "submitted"
  | "validation-error"
  | "server-error";

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
} as const;

const ACCEPTED_EXTENSIONS: readonly string[] =
  SIGIL_ACCEPTED_IMAGE_TYPES.flatMap((type) => type.extensions);
const ACCEPTED_MIME_TYPES: readonly string[] = SIGIL_ACCEPTED_IMAGE_TYPES.map(
  (type) => type.mimeType
);
const ACCEPT_ATTRIBUTE = ACCEPTED_EXTENSIONS.join(",");
const MAX_UPLOAD_BYTES = sigilPolicy.uploadSecurity.maxUploadSizeBytes;
const MAX_UPLOAD_MIB = sigilPolicy.uploadSecurity.maxUploadSizeMiB;

const fieldClass =
  "w-full rounded-lg border border-[rgba(212,168,83,0.15)] bg-[#12141c]/80 px-4 py-2.5 text-xs text-[#f5f0e8] placeholder-[#7a7a8a] outline-none transition-colors focus:border-[#d4a853]";
const fieldErrorClass =
  "w-full rounded-lg border border-[rgba(220,130,130,0.6)] bg-[#12141c]/80 px-4 py-2.5 text-xs text-[#f5f0e8] placeholder-[#7a7a8a] outline-none transition-colors focus:border-[#e0a0a0]";
const labelClass =
  "mb-1.5 block text-[10px] tracking-widest uppercase text-[#d4a853]";
const helpClass = "mt-1.5 text-[10px] leading-relaxed text-[#7a7a8a]";
const errorTextClass = "mt-1.5 text-[11px] leading-relaxed text-[#e0a0a0]";
const requiredMark = <span aria-hidden="true"> *</span>;

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
  if (!ACCEPTED_MIME_TYPES.includes(reportedType)) {
    return "The browser reported a file type we cannot accept. Please upload a PNG, JPEG, or WebP image.";
  }
  if (file.size > MAX_UPLOAD_BYTES) {
    return `The image is larger than ${MAX_UPLOAD_MIB} MiB. Please compress or resize it and try again.`;
  }
  return null;
}

export default function SigilSubmissionForm() {
  const formRef = useRef<HTMLFormElement>(null);
  const errorSummaryRef = useRef<HTMLDivElement>(null);
  const [status, setStatus] = useState<SubmissionStatus>("idle");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [serverMessage, setServerMessage] = useState("");
  const [fileMeta, setFileMeta] = useState<{ name: string; size: number } | null>(
    null
  );

  const errorList = Object.entries(errors);

  useEffect(() => {
    if (
      (status === "validation-error" || status === "server-error") &&
      errorSummaryRef.current
    ) {
      errorSummaryRef.current.focus();
    }
  }, [status, errors]);

  const describedBy = (
    field: string,
    helpId?: string,
    errorId?: string
  ): string | undefined => {
    const ids = [helpId, errors[field] ? errorId : undefined].filter(Boolean);
    return ids.length > 0 ? ids.join(" ") : undefined;
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) {
      setFileMeta(null);
      setErrors((prev) => ({ ...prev, image: "Please choose an image to upload." }));
      return;
    }
    setFileMeta({ name: file.name, size: file.size });
    const message = validateFile(file);
    setErrors((prev) => {
      const next = { ...prev };
      if (message) next.image = message;
      else delete next.image;
      return next;
    });
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

    try {
      // No Content-Type header: the browser must set the multipart boundary.
      const response = await fetch("/", {
        method: "POST",
        body: new FormData(formEl),
      });

      if (response.ok) {
        setStatus("submitted");
        window.scrollTo({ top: 0, behavior: "smooth" });
      } else {
        setServerMessage(
          "The server did not accept the submission. Please try again in a moment."
        );
        setStatus("server-error");
      }
    } catch {
      setServerMessage(
        "We could not reach the server. Check your connection and try again."
      );
      setStatus("server-error");
    }
  };

  if (status === "submitted") {
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center px-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6 }}
          className="max-w-lg text-center"
        >
          <CheckCircle className="mx-auto h-12 w-12 text-[#d4a853]" />
          <h2 className="mt-6 text-2xl font-light tracking-wide text-[#f5f0e8]">
            Your sigil has entered the field.
          </h2>
          <p className="mt-3 text-sm leading-relaxed text-[#c8c4b8]">
            Thank you for offering your work. Your submission has been received
            and is <strong className="font-medium text-[#f5f0e8]">moderated</strong>.
            It is <strong className="font-medium text-[#f5f0e8]">not published
            automatically</strong>. A moderator will review it, and you will be
            contacted at the email address you supplied if follow-up is needed.
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
    );
  }

  return (
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
          <input name="bot-field" tabIndex={-1} autoComplete="off" />
        </label>
      </p>

      <p aria-live="polite" role="status" className="sr-only">
        {status === "validating"
          ? "Checking your submission."
          : status === "uploading"
            ? "Uploading your submission. Please wait."
            : status === "validation-error"
              ? "Your submission has errors that need attention."
              : status === "server-error"
                ? "Your submission could not be sent."
                : ""}
      </p>

      {errorList.length > 0 &&
        (status === "validation-error" || status === "server-error") && (
          <div
            ref={errorSummaryRef}
            tabIndex={-1}
            role="alert"
            aria-labelledby="sigil-error-summary-heading"
            className="rounded-lg border border-[rgba(220,130,130,0.45)] bg-[rgba(120,40,40,0.12)] p-4 outline-none focus:ring-2 focus:ring-[#d4a853]/40"
          >
            <h3
              id="sigil-error-summary-heading"
              className="flex items-center gap-2 text-xs tracking-widest uppercase text-[#e0a0a0]"
            >
              <AlertCircle className="h-4 w-4" aria-hidden="true" />
              Please check the following
            </h3>
            <ul className="mt-2 list-inside list-disc space-y-1 text-[11px] leading-relaxed text-[#c8c4b8]">
              {errorList.map(([field, message]) => (
                <li key={field}>{message}</li>
              ))}
            </ul>
          </div>
        )}

      {status === "server-error" && serverMessage && (
        <div
          role="alert"
          className="rounded-lg border border-[rgba(220,130,130,0.45)] bg-[rgba(120,40,40,0.12)] p-4 text-[11px] leading-relaxed text-[#c8c4b8]"
        >
          {serverMessage}
        </div>
      )}

      <fieldset className="space-y-6">
        <legend className="mb-4 text-[11px] tracking-widest uppercase text-[#d4a853]">
          The Work
        </legend>

        <div className="grid gap-6 sm:grid-cols-2">
          <div>
            <label htmlFor="sigil-creator" className={labelClass}>
              Creator / soul name{requiredMark}
            </label>
            <input
              id="sigil-creator"
              required
              name="creator"
              maxLength={LIMITS.creator}
              autoComplete="name"
              aria-describedby={describedBy(
                "creator",
                "sigil-creator-help",
                "sigil-creator-error"
              )}
              aria-invalid={Boolean(errors.creator)}
              className={errors.creator ? fieldErrorClass : fieldClass}
              placeholder="How you wish to be known"
            />
            <p id="sigil-creator-help" className={helpClass}>
              This is the name you are offering with the work. Its public display
              is governed by your attribution choice below.
            </p>
            {errors.creator && (
              <p id="sigil-creator-error" className={errorTextClass}>
                {errors.creator}
              </p>
            )}
          </div>

          <div>
            <label htmlFor="sigil-email" className={labelClass}>
              Email{requiredMark}
            </label>
            <input
              id="sigil-email"
              required
              type="email"
              name="email"
              maxLength={LIMITS.email}
              autoComplete="email"
              aria-describedby={describedBy(
                "email",
                "sigil-email-help",
                "sigil-email-error"
              )}
              aria-invalid={Boolean(errors.email)}
              className={errors.email ? fieldErrorClass : fieldClass}
              placeholder="For follow-up only"
            />
            <p id="sigil-email-help" className={helpClass}>
              Private. Used only for submission follow-up, administration, and
              correction or removal requests. It is never published.
            </p>
            {errors.email && (
              <p id="sigil-email-error" className={errorTextClass}>
                {errors.email}
              </p>
            )}
          </div>
        </div>

        <div className="grid gap-6 sm:grid-cols-2">
          <div>
            <label htmlFor="sigil-title" className={labelClass}>
              Sigil title{requiredMark}
            </label>
            <input
              id="sigil-title"
              required
              name="title"
              maxLength={LIMITS.title}
              aria-describedby={describedBy(
                "title",
                undefined,
                "sigil-title-error"
              )}
              aria-invalid={Boolean(errors.title)}
              className={errors.title ? fieldErrorClass : fieldClass}
              placeholder="The title of your sigil"
            />
            {errors.title && (
              <p id="sigil-title-error" className={errorTextClass}>
                {errors.title}
              </p>
            )}
          </div>
          <div>
            <label htmlFor="sigil-subtitle" className={labelClass}>
              Subtitle (optional)
            </label>
            <input
              id="sigil-subtitle"
              name="subtitle"
              maxLength={LIMITS.subtitle}
              aria-describedby="sigil-subtitle-help"
              className={fieldClass}
              placeholder="A ceremonial subtitle, if the work has one"
            />
            <p id="sigil-subtitle-help" className={helpClass}>
              Optional. Leave blank if the work carries no subtitle.
            </p>
          </div>
        </div>

        <div>
          <label htmlFor="sigil-image" className={labelClass}>
            Sigil image{requiredMark}
          </label>
          <input
            id="sigil-image"
            required
            type="file"
            name="image"
            accept={ACCEPT_ATTRIBUTE}
            onChange={handleFileChange}
            aria-describedby={describedBy(
              "image",
              "sigil-image-help",
              "sigil-image-error"
            )}
            aria-invalid={Boolean(errors.image)}
            className={`${errors.image ? fieldErrorClass : fieldClass} file:mr-3 file:rounded-md file:border-0 file:bg-[rgba(212,168,83,0.15)] file:px-3 file:py-1.5 file:text-[10px] file:tracking-wider file:uppercase file:text-[#d4a853]`}
          />
          <p id="sigil-image-help" className={helpClass}>
            PNG, JPEG, or WebP only. Maximum {MAX_UPLOAD_MIB} MiB, one file.
            This is a preliminary check only; the file is inspected again before
            publication. A 1024 × 1024 PNG is recommended, matching the
            Library&apos;s published assets. SVG is not accepted.
          </p>
          {fileMeta && !errors.image && (
            <p className="mt-1.5 text-[10px] text-[#c8c4b8]">
              Selected: {fileMeta.name} ({Math.ceil(fileMeta.size / 1024)} KiB)
            </p>
          )}
          {errors.image && (
            <p id="sigil-image-error" className={errorTextClass}>
              {errors.image}
            </p>
          )}
        </div>
      </fieldset>

      <fieldset className="space-y-6">
        <legend className="mb-4 text-[11px] tracking-widest uppercase text-[#d4a853]">
          Meaning and Use
        </legend>

        <div>
          <label htmlFor="sigil-meaning" className={labelClass}>
            Meaning (optional)
          </label>
          <textarea
            id="sigil-meaning"
            name="meaning"
            rows={4}
            maxLength={LIMITS.meaning}
            aria-describedby="sigil-meaning-help"
            className={fieldClass}
            placeholder="What this sigil means, in your own words."
          />
          <p id="sigil-meaning-help" className={helpClass}>
            Only your own words will be published. Moderators will not write or
            rewrite creator-voice text for you.
          </p>
        </div>

        <div>
          <label htmlFor="sigil-intention" className={labelClass}>
            Intention (optional)
          </label>
          <textarea
            id="sigil-intention"
            name="intention"
            rows={3}
            maxLength={LIMITS.intention}
            className={fieldClass}
            placeholder="The intention held while creating the work."
          />
        </div>

        <div>
          <label htmlFor="sigil-suggested-use" className={labelClass}>
            Suggested use (optional)
          </label>
          <textarea
            id="sigil-suggested-use"
            name="suggested-use"
            rows={3}
            maxLength={LIMITS.suggestedUse}
            aria-describedby="sigil-suggested-use-help"
            className={fieldClass}
            placeholder="How the sigil might be worked with."
          />
          <p id="sigil-suggested-use-help" className={helpClass}>
            Please do not promise guaranteed medical, psychological, or financial
            outcomes.
          </p>
        </div>

        <div>
          <label htmlFor="sigil-inscription" className={labelClass}>
            Inscription (optional)
          </label>
          <textarea
            id="sigil-inscription"
            name="inscription"
            rows={3}
            maxLength={LIMITS.inscription}
            className={fieldClass}
            placeholder="Any words inscribed within or around the sigil."
          />
        </div>

        <div className="grid gap-6 sm:grid-cols-3">
          <div>
            <label htmlFor="sigil-element" className={labelClass}>
              Element (optional)
            </label>
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
          </div>
          <div>
            <label htmlFor="sigil-frequency" className={labelClass}>
              Frequency (optional)
            </label>
            <input
              id="sigil-frequency"
              name="frequency"
              maxLength={LIMITS.frequency}
              className={fieldClass}
              placeholder="e.g. 528 Hz"
            />
          </div>
          <div>
            <label htmlFor="sigil-creation-date" className={labelClass}>
              Creation date (optional)
            </label>
            <input
              id="sigil-creation-date"
              type="date"
              name="creation-date"
              className={fieldClass}
            />
          </div>
        </div>

        <div className="grid gap-6 sm:grid-cols-2">
          <div>
            <label htmlFor="sigil-creation-location" className={labelClass}>
              Creation location (optional)
            </label>
            <input
              id="sigil-creation-location"
              name="creation-location"
              maxLength={LIMITS.creationLocation}
              aria-describedby="sigil-creation-location-help"
              className={fieldClass}
              placeholder="City, Country"
            />
            <p id="sigil-creation-location-help" className={helpClass}>
              Consider leaving this blank, especially if you choose Anonymous.
            </p>
          </div>
          <div>
            <label htmlFor="sigil-tags" className={labelClass}>
              Tags (optional)
            </label>
            <input
              id="sigil-tags"
              name="tags"
              maxLength={LIMITS.tags}
              aria-describedby="sigil-tags-help"
              className={fieldClass}
              placeholder="sacred union, heart, protection"
            />
            <p id="sigil-tags-help" className={helpClass}>
              Enter tags separated by commas, for example
              &ldquo;heart, union, protection&rdquo;.
            </p>
          </div>
        </div>
      </fieldset>

      <fieldset
        className="space-y-3 rounded-lg border border-[rgba(212,168,83,0.1)] bg-[#12141c]/40 p-4"
        aria-describedby={
          errors.attribution ? "sigil-attribution-error" : undefined
        }
        aria-invalid={Boolean(errors.attribution)}
      >
        <legend className="px-1 text-[10px] tracking-widest uppercase text-[#d4a853]">
          Public attribution{requiredMark}
        </legend>
        <p className="text-[11px] leading-relaxed text-[#7a7a8a]">
          Choose how you appear beside the sigil if it is published. Anonymous
          governs public display only: a private administration record may be
          retained to review the work, document permission, and handle
          correction or removal requests.
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
          <p id="sigil-attribution-error" className={errorTextClass}>
            {errors.attribution}
          </p>
        )}
      </fieldset>

      <fieldset
        className="space-y-3 rounded-lg border border-[rgba(212,168,83,0.1)] bg-[#12141c]/40 p-4"
        aria-describedby={
          errors.licence ? "sigil-licence-error" : "sigil-licence-help"
        }
        aria-invalid={Boolean(errors.licence)}
      >
        <legend className="px-1 text-[10px] tracking-widest uppercase text-[#d4a853]">
          Licence{requiredMark}
        </legend>
        <p id="sigil-licence-help" className="text-[11px] leading-relaxed text-[#7a7a8a]">
          Choose the terms under which your work may be shared. Read each option
          before submitting. These summaries are informational, not legal advice.
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
              {"irrevocabilityNotice" in licence && licence.irrevocabilityNotice && (
                <span className="mt-1 block text-[11px] leading-relaxed text-[#d4a853]">
                  {licence.irrevocabilityNotice}
                </span>
              )}
              {"licenceUrl" in licence && licence.licenceUrl && (
                <a
                  href={licence.licenceUrl}
                  target="_blank"
                  rel="noopener noreferrer"
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
          <p id="sigil-licence-error" className={errorTextClass}>
            {errors.licence}
          </p>
        )}
      </fieldset>

      <fieldset className="space-y-4">
        <legend className="mb-2 text-[11px] tracking-widest uppercase text-[#d4a853]">
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
              permission from the rights holder to submit it and to apply the
              licence I have selected. I understand that submitting a work does
              not transfer copyright unless the selected licence says so.
            </span>
          </label>
          {errors.ownership && (
            <p id="sigil-ownership-error" className={errorTextClass}>
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
              I consent to The Living Codex moderating this submission and, if it
              is accepted, publishing the work and the metadata I supplied under
              the licence I have selected. I understand that submission does not
              guarantee publication, that publication may be declined or
              deferred, and that moderator decisions are made at the Library&apos;s
              discretion.
            </span>
          </label>
          {errors.consent && (
            <p id="sigil-consent-error" className={errorTextClass}>
              {errors.consent}
            </p>
          )}
        </div>
      </fieldset>

      <DisclaimerBox variant="legal">
        Your email address is private and is never published. While a submission
        is pending review, the uploaded file is stored with the submission by our
        hosting provider, Netlify, and is not part of the public Library. It is
        not segregated private storage: it is protected by obscurity rather than
        by access control. To correct, reconsider, withdraw, or request removal of
        a submission, use the{" "}
        <a
          href="/contact/"
          className="text-[#d4a853] underline underline-offset-2 hover:text-[#f5f0e8]"
        >
          contact page
        </a>
        . Nothing here is legal advice; contributors should obtain their own
        independent advice where needed.
      </DisclaimerBox>

      <div className="pt-2">
        <SacredButton
          type="submit"
          variant="primary"
          size="lg"
          className="w-full sm:w-auto"
          disabled={status === "uploading"}
        >
          <Send className="mr-2 h-4 w-4" aria-hidden="true" />
          {status === "uploading" ? "Uploading…" : "Offer This Sigil"}
        </SacredButton>
        <p className="mt-3 text-[10px] leading-relaxed text-[#7a7a8a]">
          Every submission is moderated. Publication is never automatic and is
          never guaranteed.
        </p>
      </div>
    </form>
    </motion.div>
  );
}
