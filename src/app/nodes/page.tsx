"use client";

import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import NodeCard from "@/components/NodeCard";
import SectionIntro from "@/components/SectionIntro";
import SacredButton from "@/components/SacredButton";
import { nodes, nodeCategories } from "@/data/nodes";
import { Search, SlidersHorizontal, MapPin, ChevronRight } from "lucide-react";

export default function NodesPage() {
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [viewMode, setViewMode] = useState<"grid" | "constellation">("grid");

  const filtered = useMemo(() => {
    return nodes.filter((node) => {
      const matchesSearch =
        search === "" ||
        node.name.toLowerCase().includes(search.toLowerCase()) ||
        node.location.toLowerCase().includes(search.toLowerCase());
      const matchesCategory =
        selectedCategory === "All" || node.category === selectedCategory;
      return matchesSearch && matchesCategory;
    });
  }, [search, selectedCategory]);

  return (
    <div className="relative px-4 py-16 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-6xl">
        <SectionIntro
          title="The Node Constellation"
          subtitle="Sacred node activations across the Earth grid. Each node a beacon of remembrance, anchored with crystal, ceremony, and intention."
        />

        {/* Map CTA */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="mt-8 flex items-center justify-center"
        >
          <a
            href="/map/"
            className="group flex items-center gap-3 rounded-xl border border-[rgba(212,168,83,0.2)] bg-[#12141c]/60 px-6 py-3 backdrop-blur-sm transition-all hover:border-[#d4a853] hover:bg-[#1a1d2a]/80"
          >
            <MapPin className="h-5 w-5 text-[#d4a853] transition-transform group-hover:scale-110" />
            <div className="text-left">
              <span className="block text-xs font-medium tracking-wider uppercase text-[#f5f0e8]">
                Open the Constellation Map
              </span>
              <span className="block text-[10px] text-[#7a7a8a]">
                Interactive starfield with parallax, pulsing nodes & flowing lines
              </span>
            </div>
            <ChevronRight className="ml-2 h-4 w-4 text-[#d4a853] transition-transform group-hover:translate-x-1" />
          </a>
        </motion.div>

        {/* Filters */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="mt-10 space-y-4"
        >
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#7a7a8a]" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search nodes..."
                className="w-full rounded-lg border border-[rgba(212,168,83,0.15)] bg-[#12141c]/80 py-2.5 pl-9 pr-4 text-xs text-[#f5f0e8] placeholder-[#7a7a8a] outline-none transition-colors focus:border-[#d4a853]"
              />
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => setViewMode("grid")}
                className={`rounded-lg border px-3 py-2 text-[10px] tracking-wider uppercase transition-colors ${
                  viewMode === "grid"
                    ? "border-[#d4a853] bg-[rgba(212,168,83,0.1)] text-[#d4a853]"
                    : "border-[rgba(212,168,83,0.15)] text-[#7a7a8a] hover:text-[#f5f0e8]"
                }`}
              >
                Grid
              </button>
              <button
                onClick={() => setViewMode("constellation")}
                className={`rounded-lg border px-3 py-2 text-[10px] tracking-wider uppercase transition-colors ${
                  viewMode === "constellation"
                    ? "border-[#d4a853] bg-[rgba(212,168,83,0.1)] text-[#d4a853]"
                    : "border-[rgba(212,168,83,0.15)] text-[#7a7a8a] hover:text-[#f5f0e8]"
                }`}
              >
                Constellation
              </button>
            </div>
          </div>

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
            {nodeCategories.map((cat) => (
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
        </motion.div>

        {/* Results count */}
        <div className="mt-8 flex items-center justify-between">
          <p className="text-[10px] tracking-wider uppercase text-[#7a7a8a]">
            {filtered.length} node{filtered.length !== 1 ? "s" : ""} found
          </p>
        </div>

        {/* Grid View */}
        {viewMode === "grid" && (
          <div className="mt-5 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {filtered.map((node) => (
              <NodeCard key={node.id} node={node} />
            ))}
          </div>
        )}

        {/* Constellation View */}
        {viewMode === "constellation" && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="mt-8 relative min-h-[500px] rounded-xl border border-[rgba(212,168,83,0.1)] bg-[#0a0b0f]/60 p-8 backdrop-blur-sm"
          >
            <div className="absolute inset-0 overflow-hidden rounded-xl">
              {/* Constellation lines - simplified SVG overlay */}
              <svg className="absolute inset-0 h-full w-full opacity-20" xmlns="http://www.w3.org/2000/svg">
                {filtered.map((node, i) => {
                  const x = 10 + (i % 5) * 20 + Math.random() * 10;
                  const y = 15 + Math.floor(i / 5) * 25 + Math.random() * 10;
                  return (
                    <g key={node.id}>
                      {i > 0 && (
                        <line
                          x1={`${10 + ((i - 1) % 5) * 20 + 5}%`}
                          y1={`${15 + Math.floor((i - 1) / 5) * 25 + 5}%`}
                          x2={`${x}%`}
                          y2={`${y}%`}
                          stroke="rgba(212,168,83,0.3)"
                          strokeWidth="0.5"
                        />
                      )}
                      <circle cx={`${x}%`} cy={`${y}%`} r="4" fill="#d4a853" opacity="0.6" />
                      <text
                        x={`${x}%`}
                        y={`${y + 3}%`}
                        fill="#f5f0e8"
                        fontSize="8"
                        textAnchor="middle"
                        opacity="0.7"
                      >
                        {node.name}
                      </text>
                    </g>
                  );
                })}
              </svg>
            </div>
            <div className="relative z-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {filtered.map((node) => (
                <NodeCard key={node.id} node={node} />
              ))}
            </div>
          </motion.div>
        )}

        {filtered.length === 0 && (
          <div className="mt-12 text-center">
            <MapPin className="mx-auto h-8 w-8 text-[#7a7a8a]" />
            <p className="mt-3 text-sm text-[#7a7a8a]">No nodes match your search.</p>
            <button
              onClick={() => {
                setSearch("");
                setSelectedCategory("All");
              }}
              className="mt-3 text-xs text-[#d4a853] underline underline-offset-2"
            >
              Clear filters
            </button>
          </div>
        )}

        {/* Offer a node */}
        <div className="mt-16 rounded-xl border border-[rgba(212,168,83,0.1)] bg-[#12141c]/40 p-8 text-center backdrop-blur-sm">
          <h3 className="text-lg font-medium text-[#f5f0e8]">Activate a New Node</h3>
          <p className="mx-auto mt-2 max-w-lg text-sm text-[#7a7a8a]">
            Have you performed a node activation ceremony? Share it with the
            constellation. The grid grows stronger with each contribution.
          </p>
          <div className="mt-6">
            <SacredButton href="/submit/" variant="primary" size="md">
              Offer a Node Activation
            </SacredButton>
          </div>
        </div>
      </div>
    </div>
  );
}
