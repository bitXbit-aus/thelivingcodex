"use client";

import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import SigilCard from "@/components/SigilCard";
import SectionIntro from "@/components/SectionIntro";
import SacredButton from "@/components/SacredButton";
import DisclaimerBox from "@/components/DisclaimerBox";
import { sigils, getSigilPublicAttribution } from "@/data/sigils";
import type { SigilLicenceId } from "@/data/sigilPolicy";
import { getSigilLicenceShortLabel } from "@/lib/sigilLicenses";
import { Search, SlidersHorizontal, Tag as TagIcon } from "lucide-react";

const ALL = "All";

export default function SigilsPage() {
  const [search, setSearch] = useState("");
  const [selectedSeries, setSelectedSeries] = useState<string>(ALL);
  const [selectedLicence, setSelectedLicence] = useState<SigilLicenceId | typeof ALL>(
    ALL
  );
  const [selectedTag, setSelectedTag] = useState<string | null>(null);

  const seriesOptions = useMemo(() => {
    const set = new Set<string>();
    sigils.forEach((sigil) => {
      if (sigil.series) set.add(sigil.series);
    });
    return Array.from(set).sort();
  }, []);

  const licenceOptions = useMemo(() => {
    const map = new Map<SigilLicenceId, string>();
    sigils.forEach((sigil) => {
      if (!map.has(sigil.licenceId)) {
        map.set(sigil.licenceId, getSigilLicenceShortLabel(sigil.licenceId));
      }
    });
    return Array.from(map.entries());
  }, []);

  const allTags = useMemo(() => {
    const set = new Set<string>();
    sigils.forEach((sigil) => sigil.tags.forEach((tag) => set.add(tag)));
    return Array.from(set).sort();
  }, []);

  const filtered = useMemo(() => {
    const query = search.trim().toLowerCase();
    return sigils.filter((sigil) => {
      const creatorName = getSigilPublicAttribution(sigil).creatorName;
      const haystack = [
        sigil.title,
        creatorName,
        sigil.series ?? "",
        sigil.meaningSummary ?? "",
        ...sigil.tags,
      ]
        .join(" ")
        .toLowerCase();

      const matchesSearch = query === "" || haystack.includes(query);
      const matchesSeries =
        selectedSeries === ALL || sigil.series === selectedSeries;
      const matchesLicence =
        selectedLicence === ALL || sigil.licenceId === selectedLicence;
      const matchesTag =
        selectedTag === null ||
        (sigil.tags as readonly string[]).includes(selectedTag);

      return (
        matchesSearch && matchesSeries && matchesLicence && matchesTag
      );
    });
  }, [search, selectedSeries, selectedLicence, selectedTag]);

  const clearFilters = () => {
    setSearch("");
    setSelectedSeries(ALL);
    setSelectedLicence(ALL);
    setSelectedTag(null);
  };

  const chipClass = (active: boolean) =>
    `rounded-full px-3 py-1 text-[10px] tracking-wider uppercase transition-colors ${
      active
        ? "bg-[#d4a853] text-[#0a0b0f]"
        : "border border-[rgba(212,168,83,0.2)] text-[#7a7a8a] hover:border-[#d4a853] hover:text-[#f5f0e8]"
    }`;

  return (
    <div className="relative px-4 py-16 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-6xl">
        <SectionIntro
          title="The Living Sigil Library"
          subtitle="A curated, moderated archive of original sigils shared by their creators. Each work is published under a licence its creator has chosen, and its meaning is offered only in the creator's own words."
        />

        {/* Controls */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="mt-10 space-y-4"
        >
          {/* Search */}
          <div className="flex flex-col gap-2">
            <label
              htmlFor="sigil-search"
              className="text-[10px] tracking-widest uppercase text-[#7a7a8a]"
            >
              Search the Library
            </label>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#7a7a8a]" />
              <input
                id="sigil-search"
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search by title, creator, meaning, series, or tag..."
                className="w-full rounded-lg border border-[rgba(212,168,83,0.15)] bg-[#12141c]/80 py-2.5 pl-9 pr-4 text-xs text-[#f5f0e8] placeholder-[#7a7a8a] outline-none transition-colors focus:border-[#d4a853]"
              />
            </div>
          </div>

          {/* Series */}
          <div className="flex flex-wrap items-center gap-2">
            <span className="flex items-center gap-1.5 text-[10px] tracking-wider uppercase text-[#7a7a8a]">
              <SlidersHorizontal className="h-3.5 w-3.5" />
              Series
            </span>
            <button
              type="button"
              onClick={() => setSelectedSeries(ALL)}
              className={chipClass(selectedSeries === ALL)}
            >
              All
            </button>
            {seriesOptions.map((series) => (
              <button
                key={series}
                type="button"
                onClick={() => setSelectedSeries(series)}
                className={chipClass(selectedSeries === series)}
              >
                {series}
              </button>
            ))}
          </div>

          {/* Licence */}
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-[10px] tracking-wider uppercase text-[#7a7a8a]">
              Licence
            </span>
            <button
              type="button"
              onClick={() => setSelectedLicence(ALL)}
              className={chipClass(selectedLicence === ALL)}
            >
              All
            </button>
            {licenceOptions.map(([licenceId, label]) => (
              <button
                key={licenceId}
                type="button"
                onClick={() => setSelectedLicence(licenceId)}
                className={chipClass(selectedLicence === licenceId)}
              >
                {label}
              </button>
            ))}
          </div>

          {/* Tags */}
          <div className="flex flex-wrap items-center gap-1.5">
            <TagIcon className="h-3.5 w-3.5 text-[#7a7a8a]" />
            {allTags.slice(0, 24).map((tag) => (
              <button
                key={tag}
                type="button"
                aria-pressed={selectedTag === tag}
                onClick={() => setSelectedTag(tag === selectedTag ? null : tag)}
                className={`rounded-md px-2 py-0.5 text-[9px] transition-colors ${
                  selectedTag === tag
                    ? "bg-[rgba(212,168,83,0.2)] text-[#d4a853]"
                    : "text-[#7a7a8a] hover:text-[#f5f0e8]"
                }`}
              >
                {tag}
              </button>
            ))}
          </div>
        </motion.div>

        {/* Results count */}
        <p
          aria-live="polite"
          className="mt-8 text-[10px] tracking-wider uppercase text-[#7a7a8a]"
        >
          {filtered.length} sigil{filtered.length !== 1 ? "s" : ""}
        </p>

        {filtered.length > 0 ? (
          <div className="mt-5 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {filtered.map((sigil) => (
              <SigilCard key={sigil.id} sigil={sigil} />
            ))}
          </div>
        ) : (
          <div className="mt-12 text-center">
            <p className="text-sm text-[#7a7a8a]">
              No sigils match your search.
            </p>
            <button
              type="button"
              onClick={clearFilters}
              className="mt-3 text-xs text-[#d4a853] underline underline-offset-2 transition-colors hover:text-[#f5f0e8]"
            >
              Clear filters
            </button>
          </div>
        )}

        {/* Rights and respectful use */}
        <section className="mt-16">
          <SectionIntro
            align="left"
            title="Rights and respectful use"
            subtitle="A work you can see is not automatically free to reuse. Every sigil carries the licence its creator chose, and that choice governs what you may do with it."
          />
          <div className="mt-6 space-y-4">
            <DisclaimerBox variant="legal">
              Each work in the Living Sigil Library carries its own licence,
              set by its creator. Visible does not mean free: being able to view
              a sigil here does not grant you the right to copy, adapt, or
              redistribute it. Works shown under a display-only licence may be
              viewed in the Library but may not be reused. Works offered under a
              Creative Commons licence may be shared and adapted only within
              that licence&apos;s terms, including attribution, and Creative
              Commons licences cannot be revoked once applied.
            </DisclaimerBox>
            <DisclaimerBox>
              The licence summaries shown with each work are informational only
              and are not legal advice. For the exact terms, read the official
              licence, and seek qualified legal advice when you are unsure.
            </DisclaimerBox>
          </div>
        </section>

        {/* Community submissions */}
        <section className="mt-16 text-center">
          <h2 className="text-2xl font-light tracking-wide text-[#f5f0e8] sm:text-3xl">
            Offer a sigil to the Library
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-sm leading-relaxed text-[#7a7a8a]">
            Community sigil submissions are open. You may offer an original work
            and its metadata for consideration. Every submission is moderated by
            the Library steward, nothing is published automatically, and
            submission does not guarantee publication.
          </p>
          <div className="mt-8">
            <SacredButton href="/submit/sigil/" variant="primary" size="md">
              Submit a Sigil
            </SacredButton>
          </div>
        </section>
      </div>
    </div>
  );
}
