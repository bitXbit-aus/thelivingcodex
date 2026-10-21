"use client";

import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { Scroll } from "@/data/scrolls";
import { getSigilLicenceLabel, getSigilLicenceUrl } from "@/data/sigils";
import {
  isSigilDownloadPermitted,
  getSigilLicenceSummary,
  getSigilDownloadNote,
  getSigilLicenceShortLabel,
} from "@/lib/sigilLicenses";
import {
  BookOpen,
  X,
  Tag,
  Feather,
  Gem,
  Download,
  ExternalLink,
  Calendar,
} from "lucide-react";

interface ScrollCardProps {
  scroll: Scroll;
}

function formatDate(value: string, month: "short" | "long"): string {
  // Parse at local midnight so the calendar date renders identically in every
  // timezone. `new Date("2026-10-21")` is UTC midnight, which formats as the
  // previous day for visitors west of UTC — wrong for an admission date, and a
  // hydration mismatch against the prerendered HTML.
  return new Date(`${value}T00:00:00`).toLocaleDateString("en-US", {
    year: "numeric",
    month,
    day: "numeric",
  });
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

export default function ScrollCard({ scroll }: ScrollCardProps) {
  const [expanded, setExpanded] = useState(false);
  const triggerRef = useRef<HTMLDivElement>(null);
  const dialogRef = useRef<HTMLDivElement>(null);
  const titleId = `scroll-dialog-title-${scroll.id}`;
  const dialogId = `scroll-dialog-${scroll.id}`;

  // A registered work whose original creation date is unconfirmed is dated by
  // its Codex admission date, and the label must say so — never "created".
  const admissionDate = scroll.admissionDate;
  const licenceId = scroll.licenceId;
  const licenceUrl = licenceId ? getSigilLicenceUrl(licenceId) : null;
  const downloadPermitted = licenceId
    ? isSigilDownloadPermitted(licenceId)
    : false;

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

  return (
    <>
      <motion.div
        ref={triggerRef}
        role="button"
        tabIndex={0}
        aria-haspopup="dialog"
        aria-controls={dialogId}
        aria-expanded={expanded}
        aria-label={`Read scroll: ${scroll.title}`}
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
        onClick={() => setExpanded(true)}
        onKeyDown={openFromKeyboard}
        className="group flex h-full cursor-pointer flex-col rounded-lg border border-[rgba(212,168,83,0.12)] bg-[#12141c]/80 p-5 backdrop-blur-sm transition-all hover:border-[rgba(212,168,83,0.3)] hover:bg-[#1a1d2a]/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#d4a853] focus-visible:ring-offset-2 focus-visible:ring-offset-[#0a0b0f]"
      >
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-2">
            <BookOpen className="h-4 w-4 text-[#d4a853]" />
            <span className="text-[10px] tracking-widest uppercase text-[#d4a853]">
              {scroll.category}
            </span>
          </div>
          {scroll.featured && (
            <span className="rounded-full bg-[rgba(212,168,83,0.12)] px-2 py-0.5 text-[9px] tracking-wider uppercase text-[#d4a853]">
              Featured
            </span>
          )}
        </div>

        {scroll.previewPath && (
          <div className="mt-3 overflow-hidden rounded-lg border border-[rgba(212,168,83,0.12)] bg-[#0a0b0f]">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={scroll.previewPath}
              alt={scroll.altText ?? ""}
              width={1024}
              height={1536}
              loading="lazy"
              decoding="async"
              className="aspect-[2/3] w-full object-cover"
            />
          </div>
        )}

        <h3 className="mt-3 text-base font-medium text-[#f5f0e8] transition-colors group-hover:text-[#d4a853]">
          {scroll.title}
        </h3>
        {scroll.subtitle && (
          <p className="mt-1 text-xs leading-relaxed text-[#c8c4b8]">
            {scroll.subtitle}
          </p>
        )}
        {scroll.collection && (
          <p className="mt-1 text-[10px] tracking-widest uppercase text-[#7a7a8a]">
            {scroll.collection}
          </p>
        )}
        <p className="mt-2 line-clamp-3 text-xs leading-relaxed text-[#7a7a8a]">
          {scroll.excerpt}
        </p>

        <div className="mt-4 flex flex-wrap items-center gap-2">
          {scroll.tags.slice(0, 3).map((tag) => (
            <span
              key={tag}
              className="flex items-center gap-1 rounded-full bg-[rgba(212,168,83,0.06)] px-2 py-0.5 text-[9px] text-[#7a7a8a]"
            >
              <Tag className="h-2.5 w-2.5" />
              {tag}
            </span>
          ))}
        </div>

        <div className="mt-auto pt-3">
          <div className="flex items-center justify-between border-t border-[rgba(212,168,83,0.08)] pt-3">
            <div className="flex items-center gap-3 text-[10px] text-[#7a7a8a]">
              <span className="flex items-center gap-1">
                <Feather className="h-3 w-3" />
                {scroll.author}
              </span>
              {scroll.crystal && (
                <span className="flex items-center gap-1">
                  <Gem className="h-3 w-3" />
                  {scroll.crystal}
                </span>
              )}
            </div>
            <span className="flex items-center gap-1 text-[10px] text-[#7a7a8a]">
              {admissionDate && <Calendar className="h-3 w-3" />}
              {admissionDate
                ? `Admitted ${formatDate(admissionDate, "short")}`
                : formatDate(scroll.date, "short")}
            </span>
          </div>

          {(licenceId || scroll.registryId) && (
            <div className="mt-2 flex items-center justify-between">
              {licenceId ? (
                <span className="rounded-full border border-[rgba(212,168,83,0.2)] px-2 py-0.5 text-[9px] tracking-wider uppercase text-[#d4a853]">
                  {getSigilLicenceShortLabel(licenceId)}
                </span>
              ) : (
                <span />
              )}
              {scroll.registryId && (
                <span className="font-mono text-[9px] tracking-wider text-[#7a7a8a]">
                  {scroll.registryId}
                </span>
              )}
            </div>
          )}
        </div>
      </motion.div>

      {/*
        The dialog is always mounted so a registered work's content — including
        its legal note — is present in the prerendered HTML, not only in the
        client bundle. It is `display: none` (inert and out of the accessibility
        tree) until opened, so nothing changes visually or for assistive tech.
      */}
      <div
        className={
          expanded
            ? "fixed inset-0 z-[100] flex items-center justify-center bg-[#0a0b0f]/90 p-4 backdrop-blur-md"
            : "hidden"
        }
        onClick={closeDialog}
      >
        <motion.div
          ref={dialogRef}
          id={dialogId}
          role="dialog"
          aria-modal="true"
          aria-labelledby={titleId}
          tabIndex={-1}
          initial={false}
          animate={
            expanded
              ? { opacity: 1, scale: 1, y: 0 }
              : { opacity: 0, scale: 0.95, y: 20 }
          }
          transition={{ duration: 0.3 }}
          onClick={(e) => e.stopPropagation()}
          className="relative max-h-[85vh] w-full max-w-2xl overflow-y-auto rounded-xl border border-[rgba(212,168,83,0.2)] bg-[#12141c] p-6 sm:p-8"
        >
              <button
                type="button"
                onClick={closeDialog}
                className="absolute right-4 top-4 rounded-sm text-[#7a7a8a] transition-colors hover:text-[#f5f0e8] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#d4a853]"
                aria-label="Close scroll"
              >
                <X className="h-5 w-5" />
              </button>

              {scroll.previewPath && (
                <div className="mb-4 overflow-hidden rounded-lg border border-[rgba(212,168,83,0.12)] bg-[#0a0b0f]">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={scroll.previewPath}
                    alt={scroll.altText ?? ""}
                    width={1024}
                    height={1536}
                    loading="lazy"
                    decoding="async"
                    className="max-h-[60vh] w-full object-contain"
                  />
                </div>
              )}

              <div className="flex items-center gap-2">
                <BookOpen className="h-4 w-4 text-[#d4a853]" />
                <span className="text-[10px] tracking-widest uppercase text-[#d4a853]">
                  {scroll.category}
                </span>
              </div>

              <h3 id={titleId} className="mt-3 text-xl font-medium text-[#f5f0e8]">
                {scroll.title}
              </h3>
              {scroll.subtitle && (
                <p className="mt-1 text-sm leading-relaxed text-[#c8c4b8]">
                  {scroll.subtitle}
                </p>
              )}
              {scroll.collection && (
                <p className="mt-1 text-[10px] tracking-widest uppercase text-[#7a7a8a]">
                  {scroll.collection}
                </p>
              )}

              {(scroll.registryId || admissionDate) && (
                <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-1 text-[10px] text-[#7a7a8a]">
                  {scroll.registryId && (
                    <span className="font-mono tracking-wider">
                      {scroll.registryId}
                    </span>
                  )}
                  {admissionDate && (
                    <span className="flex items-center gap-1">
                      <Calendar className="h-3 w-3" />
                      Admission date: {formatDate(admissionDate, "long")}
                    </span>
                  )}
                </div>
              )}

              <div className="mt-4 whitespace-pre-line text-sm leading-relaxed text-[#c8c4b8]">
                {scroll.content}
              </div>

              {scroll.meaning && (
                <DialogSection label="Meaning">
                  <p className="whitespace-pre-line">{scroll.meaning}</p>
                </DialogSection>
              )}

              {scroll.intention && (
                <DialogSection label="Intention">
                  <p className="whitespace-pre-line">{scroll.intention}</p>
                </DialogSection>
              )}

              <div className="mt-6 flex flex-wrap items-center gap-2">
                {scroll.tags.map((tag) => (
                  <span
                    key={tag}
                    className="flex items-center gap-1 rounded-full bg-[rgba(212,168,83,0.08)] px-2.5 py-1 text-[10px] text-[#7a7a8a]"
                  >
                    <Tag className="h-3 w-3" />
                    {tag}
                  </span>
                ))}
              </div>

              {scroll.legalNote && (
                <div className="mt-6 rounded-lg border border-[rgba(212,168,83,0.2)] bg-[#0a0b0f]/60 p-4">
                  <h4 className="text-[10px] tracking-widest uppercase text-[#d4a853]">
                    Legal note
                  </h4>
                  <p className="mt-2 text-[11px] leading-relaxed text-[#c8c4b8]">
                    {scroll.legalNote}
                  </p>
                </div>
              )}

              {licenceId && (
                <div className="mt-4 rounded-lg border border-[rgba(212,168,83,0.12)] bg-[#0a0b0f]/60 p-4">
                  <h4 className="text-[10px] tracking-widest uppercase text-[#d4a853]">
                    Licence
                  </h4>
                  <p className="mt-2 text-[10px] tracking-widest uppercase text-[#7a7a8a]">
                    {getSigilLicenceLabel(licenceId)}
                  </p>
                  <p className="mt-2 text-xs leading-relaxed text-[#c8c4b8]">
                    {getSigilLicenceSummary(licenceId)}
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
                    {getSigilDownloadNote(licenceId)}
                  </p>
                  {downloadPermitted && scroll.downloadPath && (
                    <a
                      href={scroll.downloadPath}
                      download
                      className="mt-3 inline-flex items-center gap-2 rounded-md border border-[rgba(212,168,83,0.5)] px-3 py-1.5 text-[10px] tracking-wider uppercase text-[#d4a853] transition-colors hover:bg-[rgba(212,168,83,0.08)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#d4a853]"
                    >
                      <Download className="h-3 w-3" />
                      Download full-resolution image
                    </a>
                  )}
                </div>
              )}

              <div className="mt-6 flex items-center justify-between border-t border-[rgba(212,168,83,0.1)] pt-4 text-xs text-[#7a7a8a]">
                <div className="flex items-center gap-4">
                  <span className="flex items-center gap-1">
                    <Feather className="h-3.5 w-3.5" />
                    {scroll.author}
                  </span>
                  {scroll.element && (
                    <span>Element: {scroll.element}</span>
                  )}
                  {scroll.crystal && (
                    <span className="flex items-center gap-1">
                      <Gem className="h-3.5 w-3.5" />
                      {scroll.crystal}
                    </span>
                  )}
                </div>
                <span>
                  {admissionDate
                    ? `Admitted ${formatDate(admissionDate, "long")}`
                    : formatDate(scroll.date, "long")}
                </span>
              </div>
        </motion.div>
      </div>
    </>
  );
}
