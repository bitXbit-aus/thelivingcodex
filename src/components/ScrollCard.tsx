"use client";

import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Scroll } from "@/data/scrolls";
import { BookOpen, X, Tag, Feather, Gem } from "lucide-react";

interface ScrollCardProps {
  scroll: Scroll;
}

export default function ScrollCard({ scroll }: ScrollCardProps) {
  const [expanded, setExpanded] = useState(false);
  const triggerRef = useRef<HTMLDivElement>(null);
  const dialogRef = useRef<HTMLDivElement>(null);
  const titleId = `scroll-dialog-title-${scroll.id}`;
  const dialogId = `scroll-dialog-${scroll.id}`;

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
        className="group cursor-pointer rounded-lg border border-[rgba(212,168,83,0.12)] bg-[#12141c]/80 p-5 backdrop-blur-sm transition-all hover:border-[rgba(212,168,83,0.3)] hover:bg-[#1a1d2a]/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#d4a853] focus-visible:ring-offset-2 focus-visible:ring-offset-[#0a0b0f]"
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

        <h3 className="mt-3 text-base font-medium text-[#f5f0e8] transition-colors group-hover:text-[#d4a853]">
          {scroll.title}
        </h3>
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

        <div className="mt-3 flex items-center justify-between border-t border-[rgba(212,168,83,0.08)] pt-3">
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
          <span className="text-[10px] text-[#7a7a8a]">
            {new Date(scroll.date).toLocaleDateString("en-US", {
              year: "numeric",
              month: "short",
              day: "numeric",
            })}
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
                aria-label="Close scroll"
              >
                <X className="h-5 w-5" />
              </button>

              <div className="flex items-center gap-2">
                <BookOpen className="h-4 w-4 text-[#d4a853]" />
                <span className="text-[10px] tracking-widest uppercase text-[#d4a853]">
                  {scroll.category}
                </span>
              </div>

              <h3 id={titleId} className="mt-3 text-xl font-medium text-[#f5f0e8]">
                {scroll.title}
              </h3>

              <div className="mt-4 whitespace-pre-line text-sm leading-relaxed text-[#c8c4b8]">
                {scroll.content}
              </div>

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
                  {new Date(scroll.date).toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </span>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
