"use client";

import { motion } from "framer-motion";
import SectionIntro from "@/components/SectionIntro";
import SacredButton from "@/components/SacredButton";
import { Sprout, Music, Sun, Gem, Zap, Wind, Leaf, Heart, Flower2 } from "lucide-react";

const sections = [
  {
    icon: Sprout,
    title: "Organic Food Production",
    text: `Food is not fuel. It is frequency. The soil is not dirt. It is a living library. The seed is not a commodity. It is a prayer.

Organic food production honours the intelligence of nature. No synthetic chemicals. No genetic modification. Only biology, intention, and respect for the cycles of life.`,
  },
  {
    icon: Music,
    title: "Sonic Bloom",
    text: `Sonic Bloom is the practice of playing specific frequencies to plants during their growth cycles. Research and anecdotal evidence suggest increased yields, enhanced nutrient density, and greater pest resistance.

The Earth has a voice. Plants have ears. When we speak to them in frequencies they recognize, they respond with abundance.`,
  },
  {
    icon: Sun,
    title: "Colour Therapy",
    text: `Light is information. Different wavelengths carry different instructions for biological systems. Colour therapy in farming uses specific spectra to influence growth, flowering, fruiting, and resilience.

Red for rooting. Blue for leaf growth. Far-red for flowering. The rainbow is not decoration — it is a toolkit.`,
  },
  {
    icon: Gem,
    title: "Crystals in the Garden",
    text: `Crystals are not merely decorative. They are piezoelectric, coherent, and resonant. Placed in gardens, they can support soil coherence, plant vitality, and the overall energy field of the growing space.

Clear quartz for amplification. Moss agate for growth. Amethyst for protection. Each stone carries a frequency that interacts with the living world.`,
  },
  {
    icon: Zap,
    title: "Electroculture",
    text: `Electroculture is the ancient and rediscovered practice of harnessing atmospheric electricity to stimulate plant growth. Copper antennas, paramagnetic materials, and alignment with natural magnetic flows can dramatically enhance yields without synthetic inputs.`,
  },
  {
    icon: Wind,
    title: "Aether Energy",
    text: `Aether — the fifth element, prana, chi, orgone — is the subtle energy that permeates all space. In harmonic farming, aetheric practices include orgone accumulators, sacred geometry placement, and intentional blessing of the land before planting.`,
  },
  {
    icon: Leaf,
    title: "Soil Health & Plant Consciousness",
    text: `Soil is a microbiome of staggering complexity — billions of organisms in every teaspoon. Healthy soil grows healthy plants. Healthy plants grow healthy humans. The chain of life begins in darkness, with the humblest creatures doing the holiest work.`,
  },
  {
    icon: Heart,
    title: "Living Food as Medicine",
    text: `High-frequency nutrition is food that carries life force. Sprouted seeds, fermented vegetables, raw milk from grass-fed animals, and herbs harvested with intention — these are not just nutrients. They are medicines for body, mind, and soul.`,
  },
  {
    icon: Flower2,
    title: "Healing Gardens",
    text: `A healing garden is a space designed for restoration. It combines medicinal plants, sensory beauty, sacred geometry, and quiet places for contemplation. It is a pharmacy, a temple, and a sanctuary in one.`,
  },
];

export default function FarmingPage() {
  return (
    <div className="relative px-4 py-16 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-4xl">
        <SectionIntro
          title="Harmonic Farming"
          subtitle="Frequency agriculture, regenerative practices, and the restoration of food as sacred medicine."
        />

        <div className="mt-10 space-y-6">
          {sections.map((section, i) => (
            <motion.div
              key={section.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.08 }}
              className="rounded-xl border border-[rgba(212,168,83,0.08)] bg-[#12141c]/60 p-6 backdrop-blur-sm"
            >
              <div className="flex items-start gap-4">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border border-[rgba(212,168,83,0.15)] bg-[rgba(212,168,83,0.05]">
                  <section.icon className="h-5 w-5 text-[#d4a853]" />
                </div>
                <div>
                  <h3 className="text-base font-medium text-[#f5f0e8]">
                    {section.title}
                  </h3>
                  <div className="mt-2 whitespace-pre-line text-sm leading-relaxed text-[#7a7a8a]">
                    {section.text}
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="mt-12 rounded-xl border border-[rgba(212,168,83,0.1)] bg-[#12141c]/40 p-8 text-center"
        >
          <Sprout className="mx-auto h-6 w-6 text-[#d4a853]" />
          <p className="mt-4 text-sm leading-relaxed italic text-[#c8c4b8]">
            "The future of medicine is growing in your garden. The future of
            spirituality is growing in your garden. The future of community is
            growing in your garden."
          </p>
          <div className="mt-6 flex flex-wrap justify-center gap-3">
            <SacredButton href="/scrolls" variant="outline" size="md">
              Read Farming Scrolls
            </SacredButton>
            <SacredButton href="/submit" variant="ghost" size="md">
              Share Your Practices
            </SacredButton>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
