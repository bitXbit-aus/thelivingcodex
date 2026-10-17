"use client";

import { motion } from "framer-motion";
import SectionIntro from "@/components/SectionIntro";
import { technologies } from "@/data/technologies";
import {
  Music,
  Zap,
  Waves,
  Gem,
  Sprout,
  Wind,
  Droplets,
  Leaf,
  Heart,
  Brain,
  Shield,
} from "lucide-react";

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  music: Music,
  zap: Zap,
  waves: Waves,
  gem: Gem,
  sprout: Sprout,
  wind: Wind,
  droplets: Droplets,
  leaf: Leaf,
  heart: Heart,
  brain: Brain,
  shield: Shield,
};

export default function TechnologiesPage() {
  return (
    <div className="relative px-4 py-16 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-5xl">
        <SectionIntro
          title="Sacred Technologies"
          subtitle="The tools and practices that support the Codex. Ancient wisdom, grounded in practical application."
        />

        <div className="mt-12 space-y-6">
          {technologies.map((tech, i) => {
            const Icon = iconMap[tech.icon] || Zap;
            return (
              <motion.div
                key={tech.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.05 }}
                className="rounded-xl border border-[rgba(212,168,83,0.08)] bg-[#12141c]/60 p-6 backdrop-blur-sm transition-all hover:border-[rgba(212,168,83,0.2)]"
              >
                <div className="flex items-start gap-4">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border border-[rgba(212,168,83,0.15)] bg-[rgba(212,168,83,0.05)]">
                    <Icon className="h-5 w-5 text-[#d4a853]" />
                  </div>
                  <div>
                    <h3 className="text-base font-medium text-[#f5f0e8]">
                      {tech.title}
                    </h3>
                    <p className="mt-1 text-sm leading-relaxed text-[#7a7a8a]">
                      {tech.description}
                    </p>
                    <ul className="mt-3 space-y-1.5">
                      {tech.details.map((detail, idx) => (
                        <li
                          key={idx}
                          className="flex items-start gap-2 text-xs text-[#7a7a8a]"
                        >
                          <span className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-[#d4a853]" />
                          {detail}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="mt-12 rounded-lg border border-[rgba(212,168,83,0.1)] bg-[#12141c]/40 p-5"
        >
          <p className="text-[11px] leading-relaxed text-[#7a7a8a]">
            <strong className="text-[#d4a853]">Note:</strong> The technologies listed
            here are presented for educational, spiritual, and research purposes.
            They are not intended to diagnose, treat, cure, or prevent any disease.
            Always consult qualified practitioners for medical, legal, and financial
            matters. The Living Codex does not make medical claims or guarantee
            specific outcomes.
          </p>
        </motion.div>
      </div>
    </div>
  );
}
