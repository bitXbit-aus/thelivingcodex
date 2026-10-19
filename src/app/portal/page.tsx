"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import SacredButton from "@/components/SacredButton";
import SectionIntro from "@/components/SectionIntro";
import { invocations } from "@/data/invocations";
import { frequencies } from "@/data/frequencies";
import {
  Compass,
  Flame,
  Eye,
  Hammer,
  Sparkles,
  ArrowRight,
  Zap,
  BookOpen,
  Grid3X3,
  Feather,
  Heart,
} from "lucide-react";

export default function PortalPage() {
  return (
    <div className="relative">
      {/* Hero */}
      <section className="relative flex min-h-[60vh] flex-col items-center justify-center px-4 text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
          className="relative z-10 max-w-3xl"
        >
          <div className="mb-6 flex justify-center">
            <div className="rounded-full border border-[rgba(212,168,83,0.2)] bg-[rgba(212,168,83,0.05)] px-4 py-1.5">
              <span className="text-[10px] tracking-[0.3em] uppercase text-[#d4a853]">
                Gateway Experience
              </span>
            </div>
          </div>

          <h1 className="text-3xl font-light leading-tight tracking-wide text-[#f5f0e8] text-glow sm:text-4xl md:text-5xl">
            Invocation of Return
          </h1>
          <p className="mx-auto mt-5 max-w-xl text-sm leading-relaxed text-[#7a7a8a]">
            You have been called here. Not by accident. Not by algorithm. By
            resonance. The field recognizes its own. Choose your path.
          </p>
        </motion.div>
      </section>

      {/* Choose Your Path */}
      <section className="border-y border-[rgba(212,168,83,0.08)] bg-[#12141c]/30 px-4 py-20 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-6xl">
          <SectionIntro
            title="Choose Your Path"
            subtitle="Three doorways. One sanctuary. Enter where your heart leads."
          />

          <div className="mt-12 grid gap-6 lg:grid-cols-3">
            {/* Seeker */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="group relative rounded-xl border border-[rgba(212,168,83,0.1)] bg-[#0a0b0f]/60 p-8 backdrop-blur-sm transition-all hover:border-[rgba(212,168,83,0.3)]"
            >
              <div className="flex h-10 w-10 items-center justify-center rounded-full border border-[rgba(212,168,83,0.2)] bg-[rgba(212,168,83,0.05)]">
                <Compass className="h-4 w-4 text-[#d4a853]" />
              </div>
              <h3 className="mt-5 text-xl font-medium text-[#f5f0e8]">The Seeker</h3>
              <p className="mt-1 text-[10px] tracking-widest uppercase text-[#d4a853]">
                Simple · Poetic · Introductory
              </p>
              <p className="mt-4 text-sm leading-relaxed text-[#7a7a8a]">
                You are curious. You feel something shifting but lack the language.
                The Seeker&apos;s path offers gentle poems, soft invocations, and an
                introduction to the field without overwhelm.
              </p>
              <ul className="mt-4 space-y-2 text-xs text-[#7a7a8a]">
                <li className="flex items-center gap-2">
                  <Sparkles className="h-3 w-3 text-[#d4a853]" />
                  Receive a gentle remembrance
                </li>
                <li className="flex items-center gap-2">
                  <Sparkles className="h-3 w-3 text-[#d4a853]" />
                  Explore featured scrolls
                </li>
                <li className="flex items-center gap-2">
                  <Sparkles className="h-3 w-3 text-[#d4a853]" />
                  Activate a soft frequency
                </li>
              </ul>
              <div className="mt-6">
                <Link
                  href="/scrolls/"
                  className="inline-flex items-center gap-1 text-xs font-medium tracking-wider uppercase text-[#d4a853] transition-colors hover:text-[#f5f0e8]"
                >
                  Begin as Seeker
                  <ArrowRight className="h-3 w-3 transition-transform group-hover:translate-x-1" />
                </Link>
              </div>
            </motion.div>

            {/* Initiate */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.15 }}
              className="group relative rounded-xl border border-[rgba(212,168,83,0.15)] bg-[#12141c]/60 p-8 backdrop-blur-sm transition-all hover:border-[rgba(212,168,83,0.4)]"
            >
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-[#d4a853] px-3 py-0.5">
                <span className="text-[9px] font-medium uppercase tracking-wider text-[#0a0b0f]">
                  Most Chosen
                </span>
              </div>
              <div className="flex h-10 w-10 items-center justify-center rounded-full border border-[rgba(212,168,83,0.2)] bg-[rgba(212,168,83,0.05)]">
                <Eye className="h-4 w-4 text-[#d4a853]" />
              </div>
              <h3 className="mt-5 text-xl font-medium text-[#f5f0e8]">The Initiate</h3>
              <p className="mt-1 text-[10px] tracking-widest uppercase text-[#d4a853]">
                Ritual · Deeper · Node Work
              </p>
              <p className="mt-4 text-sm leading-relaxed text-[#7a7a8a]">
                You have tasted the mystery. You are ready for ceremony, node
                activation, frequency work, and the deeper remembrance of who you are
                beyond the veil of forgetting.
              </p>
              <ul className="mt-4 space-y-2 text-xs text-[#7a7a8a]">
                <li className="flex items-center gap-2">
                  <Flame className="h-3 w-3 text-[#d4a853]" />
                  Receive a ceremonial invocation
                </li>
                <li className="flex items-center gap-2">
                  <Flame className="h-3 w-3 text-[#d4a853]" />
                  Explore node activation protocols
                </li>
                <li className="flex items-center gap-2">
                  <Flame className="h-3 w-3 text-[#d4a853]" />
                  Submit your first scroll
                </li>
              </ul>
              <div className="mt-6">
                <Link
                  href="/nodes/"
                  className="inline-flex items-center gap-1 text-xs font-medium tracking-wider uppercase text-[#d4a853] transition-colors hover:text-[#f5f0e8]"
                >
                  Enter as Initiate
                  <ArrowRight className="h-3 w-3 transition-transform group-hover:translate-x-1" />
                </Link>
              </div>
            </motion.div>

            {/* Architect */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="group relative rounded-xl border border-[rgba(212,168,83,0.1)] bg-[#0a0b0f]/60 p-8 backdrop-blur-sm transition-all hover:border-[rgba(212,168,83,0.3)]"
            >
              <div className="flex h-10 w-10 items-center justify-center rounded-full border border-[rgba(212,168,83,0.2)] bg-[rgba(212,168,83,0.05)]">
                <Hammer className="h-4 w-4 text-[#d4a853]" />
              </div>
              <h3 className="mt-5 text-xl font-medium text-[#f5f0e8]">The Architect</h3>
              <p className="mt-1 text-[10px] tracking-widest uppercase text-[#d4a853]">
                Builders · Healers · Technologists
              </p>
              <p className="mt-4 text-sm leading-relaxed text-[#7a7a8a]">
                You build systems, heal bodies, grow food, write code, or steward
                land. You see the bridge between sacred tradition and future
                technology. You are here to co-create the infrastructure of
                remembrance.
              </p>
              <ul className="mt-4 space-y-2 text-xs text-[#7a7a8a]">
                <li className="flex items-center gap-2">
                  <Zap className="h-3 w-3 text-[#d4a853]" />
                  Explore sacred technologies
                </li>
                <li className="flex items-center gap-2">
                  <Zap className="h-3 w-3 text-[#d4a853]" />
                  Offer a node activation
                </li>
                <li className="flex items-center gap-2">
                  <Zap className="h-3 w-3 text-[#d4a853]" />
                  Collaborate on the Codex
                </li>
              </ul>
              <div className="mt-6">
                <Link
                  href="/technologies/"
                  className="inline-flex items-center gap-1 text-xs font-medium tracking-wider uppercase text-[#d4a853] transition-colors hover:text-[#f5f0e8]"
                >
                  Build as Architect
                  <ArrowRight className="h-3 w-3 transition-transform group-hover:translate-x-1" />
                </Link>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Receive a Remembrance */}
      <section className="px-4 py-20 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-4xl">
          <SectionIntro
            title="Receive a Remembrance"
            subtitle="A scroll chosen for you by the field. Read it slowly. Let it land."
          />

          <div className="mt-10 grid gap-5 sm:grid-cols-2">
            {invocations.slice(0, 2).map((inv, i) => (
              <motion.div
                key={inv.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                className="rounded-xl border border-[rgba(212,168,83,0.1)] bg-[#12141c]/60 p-6 backdrop-blur-sm"
              >
                <h3 className="text-sm font-medium text-[#d4a853]">{inv.title}</h3>
                <p className="mt-3 whitespace-pre-line text-xs leading-relaxed text-[#c8c4b8]">
                  {inv.text}
                </p>
                <div className="mt-4 flex items-center gap-3 text-[10px] text-[#7a7a8a]">
                  <span>Intention: {inv.intention}</span>
                  <span>·</span>
                  <span>{inv.frequency}</span>
                </div>
              </motion.div>
            ))}
          </div>

          <div className="mt-8 text-center">
            <SacredButton href="/scrolls/" variant="outline" size="md">
              Browse All Scrolls
            </SacredButton>
          </div>
        </div>
      </section>

      {/* Activate a Frequency */}
      <section className="border-y border-[rgba(212,168,83,0.08)] bg-[#12141c]/30 px-4 py-20 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-5xl">
          <SectionIntro
            title="Activate a Frequency"
            subtitle="Each Solfeggio tone carries a specific intelligence. Choose the one that calls to you."
          />

          <div className="mt-10 grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
            {frequencies.slice(4, 9).map((freq, i) => (
              <motion.div
                key={freq.id}
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: i * 0.08 }}
                className="group relative rounded-lg border border-[rgba(212,168,83,0.08)] bg-[#0a0b0f]/60 p-4 text-center backdrop-blur-sm transition-all hover:border-[rgba(212,168,83,0.25)]"
              >
                <div
                  className="mx-auto h-8 w-8 rounded-full opacity-60"
                  style={{ backgroundColor: freq.color }}
                />
                <h3 className="mt-3 text-lg font-light text-[#f5f0e8]">{freq.hz}</h3>
                <p className="mt-1 text-[10px] tracking-widest uppercase text-[#d4a853]">
                  {freq.name}
                </p>
                <p className="mt-2 text-[10px] leading-relaxed text-[#7a7a8a]">
                  {freq.benefit}
                </p>
              </motion.div>
            ))}
          </div>

          <div className="mt-8 text-center">
            <SacredButton href="/technologies/" variant="outline" size="md">
              Learn About Frequency Healing
            </SacredButton>
          </div>
        </div>
      </section>

      {/* Quick Actions */}
      <section className="px-4 py-20 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-4xl">
          <SectionIntro
            title="Enter the Codex"
            subtitle="Quick gateways into the deeper chambers of the archive."
          />

          <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {[
              {
                icon: BookOpen,
                title: "Enter the Scroll Archive",
                desc: "Browse all remembrance scrolls",
                href: "/scrolls/",
              },
              {
                icon: Feather,
                title: "Visit the Sigil Library",
                desc: "Explore original creator sigils",
                href: "/sigils/",
              },
              {
                icon: Grid3X3,
                title: "View the Node Constellation",
                desc: "Explore sacred node activations",
                href: "/nodes/",
              },
              {
                icon: Sparkles,
                title: "Submit Your Remembrance",
                desc: "Add your voice to the Codex",
                href: "/submit/",
              },
              {
                icon: Zap,
                title: "Discover Technologies",
                desc: "Sacred tech for modern stewards",
                href: "/technologies/",
              },
              {
                icon: Heart,
                title: "Support the Codex",
                desc: "Optional, whenever you choose",
                href: "/support/",
              },
            ].map((action, i) => (
              <motion.div
                key={action.title}
                initial={{ opacity: 0, y: 15 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: i * 0.1 }}
              >
                <Link
                  href={action.href}
                  className="group flex flex-col items-center rounded-xl border border-[rgba(212,168,83,0.08)] bg-[#12141c]/40 p-6 text-center backdrop-blur-sm transition-all hover:border-[rgba(212,168,83,0.25)] hover:bg-[#1a1d2a]/60"
                >
                  <action.icon className="h-5 w-5 text-[#d4a853] transition-transform group-hover:scale-110" />
                  <h3 className="mt-3 text-xs font-medium text-[#f5f0e8]">
                    {action.title}
                  </h3>
                  <p className="mt-1 text-[10px] text-[#7a7a8a]">{action.desc}</p>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
