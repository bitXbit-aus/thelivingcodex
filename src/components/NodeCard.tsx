"use client";

import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { Node } from "@/data/nodes";
import { MapPin, Gem, Music, Flame, X, Sparkles, Calendar } from "lucide-react";

interface NodeCardProps {
  node: Node;
}

export default function NodeCard({ node }: NodeCardProps) {
  const [expanded, setExpanded] = useState(false);
  const triggerRef = useRef<HTMLDivElement>(null);
  const dialogRef = useRef<HTMLDivElement>(null);
  const titleId = `node-dialog-title-${node.id}`;
  const dialogId = `node-dialog-${node.id}`;

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
        aria-label={`View node: ${node.name}`}
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
            <Sparkles className="h-4 w-4 text-[#d4a853]" />
            <span className="text-[10px] tracking-widest uppercase text-[#d4a853]">
              {node.category}
            </span>
          </div>
        </div>

        <h3 className="mt-3 text-base font-medium text-[#f5f0e8] transition-colors group-hover:text-[#d4a853]">
          {node.name}
        </h3>

        <p className="mt-2 text-xs leading-relaxed text-[#7a7a8a]">
          {node.description}
        </p>

        <div className="mt-4 flex flex-wrap items-center gap-3 text-[10px] text-[#7a7a8a]">
          <span className="flex items-center gap-1">
            <MapPin className="h-3 w-3" />
            {node.location}
          </span>
          <span className="flex items-center gap-1">
            <Music className="h-3 w-3" />
            {node.frequency}
          </span>
          <span className="flex items-center gap-1">
            <Flame className="h-3 w-3" />
            {node.element}
          </span>
        </div>
      </motion.div>

      {/*
        The dialog is always mounted so the work's content is present in the
        prerendered HTML, not only in the client bundle. It is `display: none`
        (inert and out of the accessibility tree) until opened, so nothing
        changes visually or for assistive tech.
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
                aria-label="Close node"
              >
                <X className="h-5 w-5" />
              </button>

              <div className="flex items-center gap-2">
                <Sparkles className="h-4 w-4 text-[#d4a853]" />
                <span className="text-[10px] tracking-widest uppercase text-[#d4a853]">
                  {node.category} Node
                </span>
              </div>

              <h3 id={titleId} className="mt-3 text-xl font-medium text-[#f5f0e8]">
                {node.name}
              </h3>

              <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs text-[#7a7a8a]">
                <div className="flex items-center gap-2">
                  <MapPin className="h-3.5 w-3.5 text-[#d4a853]" />
                  {node.location}
                </div>
                <div className="flex items-center gap-2">
                  <Calendar className="h-3.5 w-3.5 text-[#d4a853]" />
                  {new Date(node.dateActivated).toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </div>
                <div className="flex items-center gap-2">
                  <Music className="h-3.5 w-3.5 text-[#d4a853]" />
                  {node.frequency}
                </div>
                <div className="flex items-center gap-2">
                  <Flame className="h-3.5 w-3.5 text-[#d4a853]" />
                  {node.element}
                </div>
              </div>

              <div className="mt-5 rounded-lg border border-[rgba(212,168,83,0.1)] bg-[#0a0b0f]/50 p-4">
                <p className="text-sm leading-relaxed text-[#c8c4b8]">
                  {node.description}
                </p>
              </div>

              <div className="mt-5">
                <h4 className="text-xs font-medium tracking-widest uppercase text-[#d4a853]">
                  Intention
                </h4>
                <p className="mt-1 text-sm text-[#c8c4b8]">{node.intention}</p>
              </div>

              <div className="mt-5">
                <h4 className="text-xs font-medium tracking-widest uppercase text-[#d4a853]">
                  Guardian Phrase
                </h4>
                <p className="mt-1 text-sm italic text-[#d4a853]">
                  “{node.guardianPhrase}”
                </p>
              </div>

              <div className="mt-5">
                <h4 className="text-xs font-medium tracking-widest uppercase text-[#d4a853]">
                  Ceremony Notes
                </h4>
                <p className="mt-1 text-sm leading-relaxed text-[#7a7a8a]">
                  {node.ceremonyNotes}
                </p>
              </div>

              <div className="mt-5">
                <h4 className="text-xs font-medium tracking-widest uppercase text-[#d4a853]">
                  Crystals
                </h4>
                <div className="mt-2 flex flex-wrap gap-2">
                  {node.crystals.map((c) => (
                    <span
                      key={c}
                      className="flex items-center gap-1 rounded-full bg-[rgba(212,168,83,0.08)] px-2.5 py-1 text-[10px] text-[#7a7a8a]"
                    >
                      <Gem className="h-3 w-3" />
                      {c}
                    </span>
                  ))}
                </div>
              </div>
        </motion.div>
      </div>
    </>
  );
}
