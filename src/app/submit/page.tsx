"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import SacredButton from "@/components/SacredButton";
import SectionIntro from "@/components/SectionIntro";
import DisclaimerBox from "@/components/DisclaimerBox";
import Field from "@/components/form/Field";
import { fieldClass } from "@/components/form/styles";
import { categories } from "@/data/scrolls";
import { submitNetlifyForm } from "@/lib/netlifyForms";
import { CheckCircle, Send } from "lucide-react";

export default function SubmitPage() {
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [statusMessage, setStatusMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const successHeadingRef = useRef<HTMLHeadingElement>(null);
  const errorRef = useRef<HTMLDivElement>(null);
  const [form, setForm] = useState({
    name: "",
    email: "",
    location: "",
    title: "",
    category: categories[0],
    frequency: "",
    content: "",
    crystal: "",
    element: "",
    ally: "",
    privacy: "public",
    consent: false,
    futureArchive: false,
  });

  useEffect(() => {
    if (submitted) successHeadingRef.current?.focus();
    else if (errorMessage) errorRef.current?.focus();
  }, [submitted, errorMessage]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value, type } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]:
        type === "checkbox" ? (e.target as HTMLInputElement).checked : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formEl = e.currentTarget;
    const formData = new FormData(formEl);
    const params = new URLSearchParams();
    formData.forEach((value, key) => {
      params.append(key, String(value));
    });

    setErrorMessage("");
    setStatusMessage("Sending your scroll…");
    setSubmitting(true);

    const result = await submitNetlifyForm(params, {
      contentType: "application/x-www-form-urlencoded",
    });
    setSubmitting(false);

    if (result.kind === "ok") {
      setSubmitted(true);
      setStatusMessage(
        "Your scroll has been submitted successfully and is awaiting review."
      );
      window.scrollTo({ top: 0, behavior: "smooth" });
      return;
    }

    setStatusMessage("");
    if (result.kind === "timeout") {
      setErrorMessage(
        "The upload timed out after 35 seconds, so the submission was not confirmed. Check whether it arrived before trying again — a retry can create a duplicate submission."
      );
    } else if (result.kind === "network") {
      setErrorMessage(
        "We could not reach the server, so the submission was not confirmed. Check your connection and try again. If the connection dropped mid-send, check whether it arrived before resubmitting."
      );
    } else if (result.status === 413) {
      setErrorMessage(
        "The server rejected this submission as too large (HTTP 413). Shorten the written remembrance and try again."
      );
    } else if (result.status >= 500) {
      setErrorMessage(
        `The server had a problem accepting the submission (HTTP ${result.status}). Wait a moment and try again; if it keeps happening, use the contact page.`
      );
    } else {
      setErrorMessage(
        `The submission was not accepted (HTTP ${result.status}). Check the form entries and try again. If it keeps happening, use the contact page — do not assume the work was received.`
      );
    }
  };

  return (
    <>
      <p aria-live="polite" role="status" className="sr-only">
        {statusMessage}
      </p>

      {submitted ? (
        <div className="flex min-h-[70vh] flex-col items-center justify-center px-4">
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
            <p className="mt-3 text-sm leading-relaxed text-[#7a7a8a]">
              Thank you for adding your remembrance to The Living Codex. Your
              words have been received and will be reviewed for the public archive
              according to your chosen settings.
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
        <div className="relative px-4 py-16 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-3xl">
            <SectionIntro
              title="Submit to The Living Codex"
              subtitle="Choose a submission type: a written scroll for the archive, or original sigil artwork for the Living Sigil Library."
            />

            <nav aria-label="Submission type" className="mt-8 grid gap-3 sm:grid-cols-2">
              <Link
                href="/submit/"
                aria-current="page"
                className="rounded-lg border border-[#d4a853] bg-[#12141c]/80 p-4 transition-colors"
              >
                <span className="block text-[11px] tracking-widest uppercase text-[#d4a853]">
                  Submit a Scroll
                </span>
                <span className="mt-1 block text-[11px] leading-relaxed text-[#c8c4b8]">
                  Written remembrance, declaration, ceremony, dream, or transmission.
                </span>
                <span className="mt-2 block text-[9px] tracking-wider uppercase text-[#7a7a8a]">
                  Current selection
                </span>
              </Link>
              <Link
                href="/submit/sigil/"
                className="rounded-lg border border-[rgba(212,168,83,0.2)] bg-[#12141c]/40 p-4 transition-colors hover:border-[#d4a853]"
              >
                <span className="block text-[11px] tracking-widest uppercase text-[#d4a853]">
                  Submit a Sigil
                </span>
                <span className="mt-1 block text-[11px] leading-relaxed text-[#c8c4b8]">
                  Original sigil artwork and its metadata, offered to the Living Sigil
                  Library.
                </span>
                <span className="mt-2 block text-[9px] tracking-wider uppercase text-[#7a7a8a]">
                  Moderated submission
                </span>
              </Link>
            </nav>

            <h2 className="mt-10 text-xs tracking-widest uppercase text-[#d4a853]">
              Scroll submission
            </h2>

            <motion.form
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              onSubmit={handleSubmit}
              className="mt-4 space-y-6"
              data-netlify="true"
              name="scroll-submission"
              method="POST"
            >
              <input type="hidden" name="form-name" value="scroll-submission" />

              {errorMessage && (
                <div
                  ref={errorRef}
                  tabIndex={-1}
                  role="alert"
                  className="rounded-lg border border-[rgba(220,130,130,0.45)] bg-[rgba(120,40,40,0.12)] p-4 text-[11px] leading-relaxed text-[#c8c4b8] outline-none focus:ring-2 focus:ring-[#d4a853]/40"
                >
                  {errorMessage}
                </div>
              )}

              <div className="grid gap-6 sm:grid-cols-2">
                <Field id="scroll-name" label="Name or soul name" required>
                  <input
                    id="scroll-name"
                    required
                    name="name"
                    value={form.name}
                    onChange={handleChange}
                    className={fieldClass}
                    placeholder="How you wish to be known"
                  />
                </Field>
                <Field id="scroll-email" label="Email (optional)">
                  <input
                    id="scroll-email"
                    type="email"
                    name="email"
                    value={form.email}
                    onChange={handleChange}
                    className={fieldClass}
                    placeholder="For follow-up only"
                  />
                </Field>
              </div>

              <div className="grid gap-6 sm:grid-cols-2">
                <Field id="scroll-location" label="Location (optional)">
                  <input
                    id="scroll-location"
                    name="location"
                    value={form.location}
                    onChange={handleChange}
                    className={fieldClass}
                    placeholder="City, Country"
                  />
                </Field>
                <Field id="scroll-title" label="Scroll title" required>
                  <input
                    id="scroll-title"
                    required
                    name="title"
                    value={form.title}
                    onChange={handleChange}
                    className={fieldClass}
                    placeholder="The title of your scroll"
                  />
                </Field>
              </div>

              <div className="grid gap-6 sm:grid-cols-3">
                <Field id="scroll-category" label="Category" required>
                  <select
                    id="scroll-category"
                    name="category"
                    value={form.category}
                    onChange={handleChange}
                    className={fieldClass}
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
                    value={form.frequency}
                    onChange={handleChange}
                    className={fieldClass}
                    placeholder="e.g. 528 Hz"
                  />
                </Field>
                <Field id="scroll-element" label="Element (optional)">
                  <select
                    id="scroll-element"
                    name="element"
                    value={form.element}
                    onChange={handleChange}
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

              <Field id="scroll-content" label="Written remembrance" required>
                <textarea
                  id="scroll-content"
                  required
                  name="content"
                  value={form.content}
                  onChange={handleChange}
                  rows={8}
                  className={fieldClass}
                  placeholder="Write your scroll here... invocation, declaration, ceremony report, dream, light language, healing protocol, or prayer."
                />
              </Field>

              <div className="grid gap-6 sm:grid-cols-2">
                <Field id="scroll-crystal" label="Crystal ally (optional)">
                  <input
                    id="scroll-crystal"
                    name="crystal"
                    value={form.crystal}
                    onChange={handleChange}
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
                    value={form.ally}
                    onChange={handleChange}
                    className={fieldClass}
                    placeholder="e.g. Oak, Wolf, Rain"
                  />
                </Field>
              </div>

              {/* Privacy options */}
              <fieldset
                aria-label="Visibility"
                className="rounded-lg border border-[rgba(212,168,83,0.1)] bg-[#12141c]/40 p-4 space-y-3"
              >
                <legend
                  aria-hidden="true"
                  className="text-[10px] tracking-widest uppercase text-[#d4a853]"
                >
                  Visibility
                </legend>
                <label className="flex items-center gap-3">
                  <input
                    type="radio"
                    name="privacy"
                    value="public"
                    checked={form.privacy === "public"}
                    onChange={handleChange}
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
                    checked={form.privacy === "private"}
                    onChange={handleChange}
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
                    checked={form.futureArchive}
                    onChange={handleChange}
                    className="h-4 w-4 accent-[#d4a853]"
                  />
                  <span className="text-xs text-[#c8c4b8]">
                    I wish this to be permanently stored in the future archive (Arweave)
                  </span>
                </label>
              </fieldset>

              {/* Consent */}
              <div>
                <label className="flex items-start gap-3">
                  <input
                    required
                    type="checkbox"
                    name="consent"
                    checked={form.consent}
                    onChange={handleChange}
                    className="mt-0.5 h-4 w-4 accent-[#d4a853]"
                  />
                  <span className="text-xs leading-relaxed text-[#7a7a8a]">
                    I confirm that this submission is my own work or that I have
                    permission to share it. I understand that public submissions may
                    be featured in the Living Codex archive. I consent to the
                    processing of this information in accordance with the Codex
                    privacy practices.
                  </span>
                </label>
              </div>

              <DisclaimerBox>
                Submissions are moderated before appearing in the public archive. The
                Living Codex reserves the right to decline submissions that violate
                natural law, promote harm, or do not align with the field&apos;s
                intention. This form is processed by our hosting provider, Netlify,
                which stores the submission and may email it to the Library steward
                for review. Your information is not sold or used for advertising.
              </DisclaimerBox>

              <div className="pt-2">
                <SacredButton
                  type="submit"
                  variant="primary"
                  size="lg"
                  ariaLabel={submitting ? "Sending" : "Cast into the field"}
                  className="w-full sm:w-auto"
                  disabled={submitting}
                >
                  <Send className="mr-2 h-4 w-4" aria-hidden="true" />
                  {submitting ? "Sending…" : "Cast Into the Field"}
                </SacredButton>
              </div>
            </motion.form>
          </div>
        </div>
      )}
    </>
  );
}
