"use client";

import { useState, useMemo } from "react";
import { Metadata } from "next";
import { motion } from "framer-motion";
import ScrollCard from "@/components/ScrollCard";
import SectionIntro from "@/components/SectionIntro";
import SacredButton from "@/components/SacredButton";
import { scrolls, categories } from "@/data/scrolls";
import { Search, SlidersHorizontal, Shuffle } from "lucide-react";

export default function ScrollsPage() {
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [selectedTag, setSelectedTag] = useState<string | null>(null);

  const allTags = useMemo(() => {
    const tags = new Set<string>();
    scrolls.forEach((s) => s.tags.forEach((t) => tags.add(t)));
    return Array.from(tags).sort();
  }, []);

  const filtered = useMemo(() => {
    return scrolls.filter((scroll) => {
      const matchesSearch =
        search === "" ||
        scroll.title.toLowerCase().includes(search.toLowerCase()) ||
        scroll.excerpt.toLowerCase().includes(search.toLowerCase()) ||
        scroll.content.toLowerCase().includes(search.toLowerCase());
      const matchesCategory =
        selectedCategory === "All" || scroll.category === selectedCategory;
      const matchesTag = selectedTag === null || scroll.tags.includes(selectedTag);
      return matchesSearch && matchesCategory && matchesTag;
    });
  }, [search, selectedCategory, selectedTag]);

  const handleRandom = () => {
    const random = scrolls[Math.floor(Math.random() * scrolls.length)];
    setSearch(random.title);
  };

  return (
    <div className="relative px-4 py-16 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-6xl">
        <SectionIntro
          title="The Living Scroll Archive"
          subtitle="A repository of remembrance. Search, filter, and read the transmissions. Each scroll is a node in the greater field."
        />

        {/* Filters */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="mt-10 space-y-4"
        >
          {/* Search + Actions */}
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#7a7a8a]" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search scrolls..."
                className="w-full rounded-lg border border-[rgba(212,168,83,0.15)] bg-[#12141c]/80 py-2.5 pl-9 pr-4 text-xs text-[#f5f0e8] placeholder-[#7a7a8a] outline-none transition-colors focus:border-[#d4a853]"
              />
            </div>
            <SacredButton onClick={handleRandom} variant="outline" size="sm">
              <Shuffle className="mr-1.5 h-3 w-3" />
              Random
            </SacredButton>
          </div>

          {/* Categories */}
          <div className="flex flex-wrap items-center gap-2">
            <SlidersHorizontal className="h-3.5 w-3.5 text-[#7a7a8a]" />
            <button
              onClick={() => setSelectedCategory("All")}
              className={`rounded-full px-3 py-1 text-[10px] tracking-wider uppercase transition-colors ${
                selectedCategory === "All"
                  ? "bg-[#d4a853] text-[#0a0b0f]"
                  : "border border-[rgba(212,168,83,0.2)] text-[#7a7a8a] hover:border-[#d4a853] hover:text-[#f5f0e8]"
              }`}
            >
              All
            </button>
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`rounded-full px-3 py-1 text-[10px] tracking-wider uppercase transition-colors ${
                  selectedCategory === cat
                    ? "bg-[#d4a853] text-[#0a0b0f]"
                    : "border border-[rgba(212,168,83,0.2)] text-[#7a7a8a] hover:border-[#d4a853] hover:text-[#f5f0e8]"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Tags */}
          {selectedTag && (
            <div className="flex items-center gap-2">
              <span className="text-[10px] text-[#7a7a8a]">Active tag:</span>
              <span className="inline-flex items-center gap-1 rounded-full bg-[rgba(212,168,83,0.12)] px-2.5 py-0.5 text-[10px] text-[#d4a853]">
                {selectedTag}
                <button onClick={() => setSelectedTag(null)} className="ml-1 hover:text-[#f5f0e8]">
                  ×
                </button>
              </span>
            </div>
          )}

          {/* Tag cloud */}
          <div className="flex flex-wrap gap-1.5">
            {allTags.slice(0, 20).map((tag) => (
              <button
                key={tag}
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

        {/* Results */}
        <div className="mt-8 flex items-center justify-between">
          <p className="text-[10px] tracking-wider uppercase text-[#7a7a8a]">
            {filtered.length} scroll{filtered.length !== 1 ? "s" : ""} found
          </p>
        </div>

        <div className="mt-5 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((scroll) => (
            <ScrollCard key={scroll.id} scroll={scroll} />
          ))}
        </div>

        {filtered.length === 0 && (
          <div className="mt-12 text-center">
            <p className="text-sm text-[#7a7a8a]">No scrolls match your search.</p>
            <button
              onClick={() => {
                setSearch("");
                setSelectedCategory("All");
                setSelectedTag(null);
              }}
              className="mt-3 text-xs text-[#d4a853] underline underline-offset-2"
            >
              Clear filters
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
