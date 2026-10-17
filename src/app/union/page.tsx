"use client";

import { motion } from "framer-motion";
import SectionIntro from "@/components/SectionIntro";
import SacredButton from "@/components/SacredButton";
import { Heart, Flame, Flower2, Infinity, Diamond, Scroll } from "lucide-react";

const sections = [
  {
    icon: Heart,
    title: "What is Sacred Union?",
    text: `Sacred Union is the recognition that separation is illusion. It is the reunion of what was never truly divided — the divine masculine and divine feminine, the inner and outer, the human and the divine.

This is not about romantic relationships alone. It is about the architecture of creation itself, made conscious within the human heart.`,
  },
  {
    icon: Flame,
    title: "Inner Union",
    text: `Before union with another, there must be union within. The divine masculine and divine feminine are not external ideals — they are living currents within every human being.

Inner union is the alchemical marriage of these forces: the clarity and direction of the masculine, married to the wisdom and receptivity of the feminine. When they dance within you, you become a portal.`,
  },
  {
    icon: Flower2,
    title: "Beloved Union",
    text: `When two beings who have each done the inner work come together, the relationship becomes a temple. Not a prison. Not a distraction. A sacred container for mutual evolution.

Beloved union is not about completion. It is about two wholes choosing to create a greater whole. It is about love as a practice, a discipline, and a pleasure.`,
  },
  {
    icon: Diamond,
    title: "Christ-Sophia Field",
    text: `Christ-Sophia is the archetype of sacred union in its most refined form. Christ represents the penetrating clarity of truth — the sun-disc, the sword, the crown. Sophia represents the receptive wisdom that births all becoming — the womb, the grail, the rose.

Together they form the architecture of a healed world. Where they are remembered, tyranny cannot stand. Where they are embodied, love becomes law.`,
  },
  {
    icon: Infinity,
    title: "Love as Remembrance",
    text: `Love is not an emotion. It is a frequency. It is the native state of consciousness when all obstruction is removed.

To love is to remember that the other is not other. That the beloved is a mirror of the self. That every relationship is an opportunity to see God in form.`,
  },
  {
    icon: Scroll,
    title: "Relationship as Temple",
    text: `Every relationship can be a temple — a place where the sacred is honored, where truth is spoken, where presence is practiced, and where both beings are free to become more fully themselves.

This requires intention. It requires boundaries. It requires the willingness to see the other as divine, even when they are difficult — especially then.`,
  },
];

export default function UnionPage() {
  return (
    <div className="relative px-4 py-16 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-4xl">
        <SectionIntro
          title="Sacred Union"
          subtitle="Honouring the divine masculine, the divine feminine, Christ-Sophia remembrance, and relational healing."
        />

        <div className="mt-10 space-y-6">
          {sections.map((section, i) => (
            <motion.div
              key={section.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              className="rounded-xl border border-[rgba(212,168,83,0.08)] bg-[#12141c]/60 p-6 backdrop-blur-sm"
            >
              <div className="flex items-start gap-4">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border border-[rgba(212,168,83,0.15)] bg-[rgba(212,168,83,0.05)]">
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
          <Heart className="mx-auto h-6 w-6 text-[#d4a853]" />
          <p className="mt-4 text-sm leading-relaxed italic text-[#c8c4b8]">
            "You are not half of anything. You are whole. And from your wholeness,
            you choose to dance with another whole. That is sacred union."
          </p>
          <div className="mt-6 flex flex-wrap justify-center gap-3">
            <SacredButton href="/scrolls/" variant="outline" size="md">
              Read Union Scrolls
            </SacredButton>
            <SacredButton href="/submit/" variant="ghost" size="md">
              Submit a Union Transmission
            </SacredButton>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
