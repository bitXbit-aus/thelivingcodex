"use client";

import { motion } from "framer-motion";
import SectionIntro from "@/components/SectionIntro";
import SacredButton from "@/components/SacredButton";
import {
  User,
  BookOpen,
  Sparkles,
  Music,
  Scroll,
  Shield,
  Wallet,
  BrainCircuit,
} from "lucide-react";

const futureFeatures = [
  {
    icon: User,
    title: "Personal Codex Dashboard",
    desc: "Your saved scrolls, node contributions, and personal remembrance profile in one place.",
    phase: "Phase 6",
  },
  {
    icon: BookOpen,
    title: "Saved Scrolls",
    desc: "Bookmark and organize your favourite transmissions from the archive.",
    phase: "Phase 6",
  },
  {
    icon: Sparkles,
    title: "Personal Remembrance Profile",
    desc: "Your soul name, path, and journey through the Codex over time.",
    phase: "Phase 6",
  },
  {
    icon: Scroll,
    title: "Private Submissions",
    desc: "Access your private scrolls and transmissions not shared publicly.",
    phase: "Phase 2",
  },
  {
    icon: Music,
    title: "Frequency Journal",
    desc: "Log your frequency work, sound healing sessions, and vibrational practices.",
    phase: "Phase 3",
  },
  {
    icon: Shield,
    title: "Ceremony Log",
    desc: "Record your ceremonies, node activations, and ritual work.",
    phase: "Phase 4",
  },
  {
    icon: BrainCircuit,
    title: "AI Guide Integration",
    desc: "Personal guidance from Aurealis tailored to your path and current needs.",
    phase: "Phase 7",
  },
  {
    icon: Wallet,
    title: "Arweave Archive Status",
    desc: "Track which of your scrolls have been permanently archived to Arweave.",
    phase: "Phase 5",
  },
];

export default function DashboardPage() {
  return (
    <div className="relative px-4 py-16 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-5xl">
        <SectionIntro
          title="Future Portal"
          subtitle="The member area is coming. These are the chambers being prepared for your arrival."
        />

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8 }}
          className="mt-10 rounded-xl border border-[rgba(212,168,83,0.1)] bg-[#12141c]/40 p-8 text-center"
        >
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full border border-[rgba(212,168,83,0.2)] bg-[rgba(212,168,83,0.05)]">
            <Sparkles className="h-6 w-6 text-[#d4a853]" />
          </div>
          <h3 className="mt-4 text-lg font-medium text-[#f5f0e8]">
            The Portal is Opening
          </h3>
          <p className="mx-auto mt-2 max-w-lg text-sm text-[#7a7a8a]">
            The Future Portal is currently in development. Personal dashboards,
            saved scrolls, AI guidance, and Arweave integration are being built
            with care. Enter your email on the Contact page to be notified when
            the portal opens.
          </p>
          <div className="mt-6">
            <SacredButton href="/contact/" variant="primary" size="md">
              Get Notified
            </SacredButton>
          </div>
        </motion.div>

        <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {futureFeatures.map((feature, i) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: i * 0.08 }}
              className="rounded-lg border border-[rgba(212,168,83,0.08)] bg-[#12141c]/60 p-5 backdrop-blur-sm"
            >
              <feature.icon className="h-5 w-5 text-[#d4a853]" />
              <h4 className="mt-3 text-xs font-medium text-[#f5f0e8]">
                {feature.title}
              </h4>
              <p className="mt-1 text-[10px] leading-relaxed text-[#7a7a8a]">
                {feature.desc}
              </p>
              <span className="mt-3 inline-block rounded-full bg-[rgba(212,168,83,0.08)] px-2 py-0.5 text-[9px] text-[#d4a853]">
                {feature.phase}
              </span>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
