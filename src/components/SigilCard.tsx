"use client";

import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import {
  Sigil,
  getSigilPublicAttribution,
  getSigilLicenceLabel,
  getSigilLicenceUrl,
} from "@/data/sigils";
import {
  isSigilDownloadPermitted,
  getSigilLicenceSummary,
  getSigilDownloadNote,
  getSigilLicenceShortLabel,
} from "@/lib/sigilLicenses";
import {
  X,
  Tag,
  Sparkles,
  Download,
  ExternalLink,
  Copy,
  Check,
  Flag,
} from "lucide-react";

interface SigilCardProps {
  sigil: Sigil;
}

function DialogSection({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="mt-5">
      <h4 className="text-[10px] tracking-widest uppercase text-[#d4a853]">
        {label}
      </h4>
      <div className="mt-2 text-sm leading-relaxed text-[#c8c4b8]">
        {children}
      </div>
    </div>
  );
}

export default function SigilCard({ sigil }: SigilCardProps) {
  const [expanded, setExpanded] = useState(false);
  const [copyStatus, setCopyStatus] = useState<
    "idle" | "copied" | "unavailable"
  >("idle");
  const triggerRef = useRef<HTMLDivElement>(null);
  const dialogRef = useRef<HTMLDivElement>(null);
  const titleId = `sigil-dialog-title-${sigil.id}`;
  const dialogId = `sigil-dialog-${sigil.id}`;

  const attribution = getSigilPublicAttribution(sigil);
  const licenceUrl = getSigilLicenceUrl(sigil.licenceId);
  const downloadPermitted = isSigilDownloadPermitted(sigil.licenceId);
  const shortLicenceLabel = getSigilLicenceShortLabel(sigil.licenceId);

  const closeDialog = () => {
    setExpanded(false);
    requestAnimationFrame(() => triggerRef.current?.focus());
  };

  useEffect(() => {
    if (!expanded) return;

    const dialog = dialogRef.current;
    dialog?.focus();

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        event.preventDefault();
        closeDialog();
        return;
      }

      if (event.key !== "Tab" || !dialog) return;

      const focusable = Array.from(
        dialog.querySelectorAll<HTMLElement>(
          'button:not([disabled]), [href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])'
        )
      );

      if (focusable.length === 0) {
        event.preventDefault();
        dialog.focus();
        return;
      }

      const first = focusable[0];
      const last = focusable[focusable.length - 1];

      if (
        event.shiftKey &&
        (document.activeElement === first || document.activeElement === dialog)
      ) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [expanded]);

  const openFromKeyboard = (event: React.KeyboardEvent<HTMLDivElement>) => {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      setExpanded(true);
    }
  };

  const handleCopyAttribution = async () => {
    try {
      if (!navigator.clipboard?.writeText) {
        throw new Error("clipboard-unavailable");
      }
      await navigator.clipboard.writeText(attribution.text);
      setCopyStatus("copied");
      window.setTimeout(() => setCopyStatus("idle"), 2500);
    } catch {
      setCopyStatus("unavailable");
      window.setTimeout(() => setCopyStatus("idle"), 4000);
    }
  };

  return (
    <>
      <motion.div
        ref={triggerRef}
        role="button"
        tabIndex={0}
        aria-haspopup="dialog"
        aria-controls={dialogId}
        aria-expanded={expanded}
        aria-label={`View sigil details: ${sigil.title}`}
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
        onClick={() => setExpanded(true)}
        onKeyDown={openFromKeyboard}
        className="group flex h-full cursor-pointer flex-col rounded-lg border border-[rgba(212,168,83,0.12)] bg-[#12141c]/80 p-4 backdrop-blur-sm transition-all hover:border-[rgba(212,168,83,0.3)] hover:bg-[#1a1d2a]/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#d4a853] focus-visible:ring-offset-2 focus-visible:ring-offset-[#0a0b0f]"
      >
        <div className="flex items-start justify-between gap-3">
          <span className="flex items-center gap-2 text-[10px] tracking-widest uppercase text-[#d4a853]">
            <Sparkles className="h-3.5 w-3.5" />
            Sigil
          </span>
          {sigil.featured && (
            <span className="rounded-full bg-[rgba(212,168,83,0.12)] px-2 py-0.5 text-[9px] tracking-wider uppercase text-[#d4a853]">
              Featured
            </span>
          )}
        </div>

        <div className="mt-3 overflow-hidden rounded-lg border border-[rgba(212,168,83,0.12)] bg-[#0a0b0f]">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={sigil.previewPath}
            alt={sigil.altText}
            width={1024}
            height={1024}
            loading="lazy"
            decoding="async"
            className="aspect-square w-full object-cover"
          />
        </div>

        <h3 className="mt-3 text-base font-medium text-[#f5f0e8] transition-colors group-hover:text-[#d4a853]">
          {sigil.title}
        </h3>
        {sigil.subtitle && (
          <p className="mt-1 text-xs leading-relaxed text-[#c8c4b8]">
            {sigil.subtitle}
          </p>
        )}
        {sigil.series && (
          <p className="mt-1 text-[10px] tracking-widest uppercase text-[#7a7a8a]">
            {sigil.series}
          </p>
        )}
        <p className="mt-1 text-[11px] text-[#7a7a8a]">
          by {attribution.creatorName}
        </p>
        {sigil.meaningSummary && (
          <p className="mt-2 line-clamp-3 text-xs leading-relaxed text-[#c8c4b8]">
            {sigil.meaningSummary}
          </p>
        )}

        <div className="mt-3 flex flex-wrap items-center gap-2">
          {sigil.tags.slice(0, 3).map((tag) => (
            <span
              key={tag}
              className="flex items-center gap-1 rounded-full bg-[rgba(212,168,83,0.06)] px-2 py-0.5 text-[9px] text-[#7a7a8a]"
            >
              <Tag className="h-2.5 w-2.5" />
              {tag}
            </span>
          ))}
        </div>

        <div className="mt-3 flex items-center border-t border-[rgba(212,168,83,0.08)] pt-3">
          <span className="rounded-full border border-[rgba(212,168,83,0.2)] px-2 py-0.5 text-[9px] tracking-wider uppercase text-[#d4a853]">
            {shortLicenceLabel}
          </span>
        </div>
      </motion.div>

      <AnimatePresence>
        {expanded && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center bg-[#0a0b0f]/90 p-4 backdrop-blur-md"
            onClick={closeDialog}
          >
            <motion.div
              ref={dialogRef}
              id={dialogId}
              role="dialog"
              aria-modal="true"
              aria-labelledby={titleId}
              tabIndex={-1}
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ duration: 0.3 }}
              onClick={(e) => e.stopPropagation()}
              className="relative max-h-[85vh] w-full max-w-2xl overflow-y-auto rounded-xl border border-[rgba(212,168,83,0.2)] bg-[#12141c] p-6 sm:p-8"
            >
              <button
                type="button"
                onClick={closeDialog}
                className="absolute right-4 top-4 rounded-sm text-[#7a7a8a] transition-colors hover:text-[#f5f0e8] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#d4a853]"
                aria-label="Close sigil details"
              >
                <X className="h-5 w-5" />
              </button>

              <div className="overflow-hidden rounded-lg border border-[rgba(212,168,83,0.12)] bg-[#0a0b0f]">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={sigil.previewPath}
                  alt={sigil.altText}
                  width={1024}
                  height={1024}
                  loading="lazy"
                  decoding="async"
                  className="aspect-square w-full object-contain"
                />
              </div>

              <span className="mt-4 block text-[10px] tracking-widest uppercase text-[#d4a853]">
                Sigil
              </span>
              <h3
                id={titleId}
                className="mt-1 text-xl font-medium text-[#f5f0e8]"
              >
                {sigil.title}
              </h3>
              {sigil.subtitle && (
                <p className="mt-1 text-sm leading-relaxed text-[#c8c4b8]">
                  {sigil.subtitle}
                </p>
              )}
              {sigil.series && (
                <p className="mt-1 text-[10px] tracking-widest uppercase text-[#7a7a8a]">
                  {sigil.series}
                </p>
              )}
              <p className="mt-1 text-xs text-[#7a7a8a]">
                by {attribution.creatorName}
              </p>

              {sigil.meaningSummary && (
                <DialogSection label="Meaning">
                  <p>{sigil.meaningSummary}</p>
                </DialogSection>
              )}

              {sigil.symbolInterpretations &&
                sigil.symbolInterpretations.length > 0 && (
                  <DialogSection label="Symbolism">
                    <dl className="space-y-3">
                      {sigil.symbolInterpretations.map((entry) => (
                        <div key={entry.symbol}>
                          <dt className="text-xs font-medium text-[#d4a853]">
                            {entry.symbol}
                          </dt>
                          <dd className="mt-0.5 text-sm leading-relaxed text-[#c8c4b8]">
                            {entry.meaning}
                          </dd>
                        </div>
                      ))}
                    </dl>
                  </DialogSection>
                )}

              {sigil.intention && (
                <DialogSection label="Intention">
                  <p>{sigil.intention}</p>
                </DialogSection>
              )}

              {sigil.significance && (
                <DialogSection label="Significance">
                  <p>{sigil.significance}</p>
                </DialogSection>
              )}

              {sigil.motto && (
                <DialogSection label="Motto">
                  <p className="italic text-[#f5f0e8]">{sigil.motto}</p>
                </DialogSection>
              )}

              {sigil.inscription && (
                <DialogSection label="Inscription">
                  <p className="whitespace-pre-line">{sigil.inscription}</p>
                </DialogSection>
              )}

              {sigil.vow && (
                <DialogSection label="Vow">
                  <p>{sigil.vow}</p>
                </DialogSection>
              )}

              {sigil.usageSuggestions &&
                sigil.usageSuggestions.length > 0 && (
                  <DialogSection label="Usage suggestions">
                    <ul className="list-disc space-y-1.5 pl-5">
                      {sigil.usageSuggestions.map((suggestion) => (
                        <li key={suggestion}>{suggestion}</li>
                      ))}
                    </ul>
                  </DialogSection>
                )}

              {sigil.comparisonNote && (
                <DialogSection label="Comparison note">
                  <p>{sigil.comparisonNote}</p>
                </DialogSection>
              )}

              {sigil.interpretiveDisclaimer && (
                <p className="mt-5 border-l-2 border-[rgba(212,168,83,0.2)] pl-3 text-[11px] italic leading-relaxed text-[#7a7a8a]">
                  {sigil.interpretiveDisclaimer}
                </p>
              )}

              <div className="mt-6 rounded-lg border border-[rgba(212,168,83,0.12)] bg-[#0a0b0f]/60 p-4">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <h4 className="text-[10px] tracking-widest uppercase text-[#d4a853]">
                    Attribution
                  </h4>
                  <button
                    type="button"
                    onClick={handleCopyAttribution}
                    className="inline-flex items-center gap-1.5 rounded-md border border-[rgba(212,168,83,0.3)] px-2.5 py-1 text-[10px] tracking-wider uppercase text-[#d4a853] transition-colors hover:bg-[rgba(212,168,83,0.08)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#d4a853]"
                  >
                    {copyStatus === "copied" ? (
                      <Check className="h-3 w-3" />
                    ) : (
                      <Copy className="h-3 w-3" />
                    )}
                    {copyStatus === "copied" ? "Copied" : "Copy attribution"}
                  </button>
                </div>
                <p className="mt-3 select-all text-xs leading-relaxed text-[#c8c4b8]">
                  {attribution.text}
                </p>
                <span aria-live="polite" className="sr-only">
                  {copyStatus === "copied"
                    ? "Attribution copied to clipboard."
                    : copyStatus === "unavailable"
                      ? "Copy unavailable. Select the attribution text to copy it manually."
                      : ""}
                </span>
                {copyStatus === "unavailable" && (
                  <p className="mt-2 text-[10px] text-[#7a7a8a]">
                    Copy unavailable. Select the attribution text above to copy
                    it manually.
                  </p>
                )}
              </div>

              <div className="mt-4 rounded-lg border border-[rgba(212,168,83,0.12)] bg-[#0a0b0f]/60 p-4">
                <h4 className="text-[10px] tracking-widest uppercase text-[#d4a853]">
                  Licence
                </h4>
                <p className="mt-2 text-[10px] tracking-widest uppercase text-[#7a7a8a]">
                  {getSigilLicenceLabel(sigil.licenceId)}
                </p>
                <p className="mt-2 text-xs leading-relaxed text-[#c8c4b8]">
                  {getSigilLicenceSummary(sigil.licenceId)}
                </p>
                {licenceUrl && (
                  <a
                    href={licenceUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-3 inline-flex items-center gap-1.5 text-xs text-[#d4a853] underline underline-offset-2 transition-colors hover:text-[#f5f0e8] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#d4a853]"
                  >
                    Read the official licence terms
                    <ExternalLink className="h-3 w-3" />
                  </a>
                )}
                <p className="mt-3 text-[11px] leading-relaxed text-[#7a7a8a]">
                  {getSigilDownloadNote(sigil.licenceId)}
                </p>
                {downloadPermitted && (
                  <a
                    href={sigil.downloadPath}
                    download
                    className="mt-3 inline-flex items-center gap-2 rounded-md border border-[rgba(212,168,83,0.5)] px-3 py-1.5 text-[10px] tracking-wider uppercase text-[#d4a853] transition-colors hover:bg-[rgba(212,168,83,0.08)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#d4a853]"
                  >
                    <Download className="h-3 w-3" />
                    Download full-resolution image
                  </a>
                )}
              </div>

              <div className="mt-4 flex items-center gap-2">
                <Flag className="h-3 w-3 text-[#7a7a8a]" />
                <Link
                  href="/contact/"
                  className="text-[10px] text-[#7a7a8a] underline underline-offset-2 transition-colors hover:text-[#f5f0e8]"
                >
                  Report or request a correction
                </Link>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
