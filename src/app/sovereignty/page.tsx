"use client";

import { motion } from "framer-motion";
import SectionIntro from "@/components/SectionIntro";
import DisclaimerBox from "@/components/DisclaimerBox";
import SacredButton from "@/components/SacredButton";
import { Shield, Scale, FileText, Landmark, Scroll } from "lucide-react";

const sections = [
  {
    icon: Shield,
    title: "Divine Law",
    text: `Divine Law is the unwritten code that governs creation itself. It is not legislated; it is discovered. It does not change with culture or era. It is the law of Love, of Truth, of Harmlessness, and of Reciprocity.

To align with Divine Law is to move in harmony with the fundamental architecture of existence. It requires no enforcement because it is self-evident to the awakened heart.`,
  },
  {
    icon: Scale,
    title: "Natural Law",
    text: `Natural Law is the observable order of the physical and energetic world. It can be summarized in three principles:

1. Do no harm.
2. Cause no loss.
3. Let contracts be true.

These are not suggestions. They are the operating system of a free society. Every legitimate system of governance derives its authority from the consent of those governed, and no consent can exist where there is deception, coercion, or fraud.`,
  },
  {
    icon: FileText,
    title: "Living Man / Living Woman",
    text: `A living man or living woman is a sovereign being — not a legal fiction, not a corporate entity, not a subject. The distinction between the living and the dead in law is ancient and profound.

When you declare yourself as a living being, you step outside the jurisdiction of commercial statutes and return to the jurisdiction of Natural Law. This is not rebellion. It is remembering what was always true.`,
  },
  {
    icon: Landmark,
    title: "Lex Mercatoria",
    text: `Lex Mercatoria — the Law Merchant — is the commercial law that governs trade, contracts, and maritime jurisdiction. Much of modern statutory law is derived from commercial principles applied to human beings as if they were vessels or corporations.

Understanding Lex Mercatoria is not about evading responsibility. It is about recognizing the difference between commercial obligation and living obligation, between consent and presumption.`,
  },
  {
    icon: Scroll,
    title: "Trust Reclamation",
    text: `At birth, a trust is often created in your name without your knowledge or consent. The beneficial interest in that trust belongs to you — the living being — but it is typically held by the state or other entities.

Trust reclamation is the process of recognizing, claiming, and redirecting the beneficial interest of your estate back to yourself. This is lawful, peaceful, and grounded in established trust law principles.`,
  },
];

export default function SovereigntyPage() {
  return (
    <div className="relative px-4 py-16 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-4xl">
        <SectionIntro
          title="Divine Law & Sovereignty"
          subtitle="House of lawful remedy, natural law, living declarations, and the reclamation of self-governance."
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
          className="mt-10 space-y-6"
        >
          <div className="rounded-xl border border-[rgba(212,168,83,0.1)] bg-[#12141c]/40 p-6">
            <h3 className="text-sm font-medium tracking-widest uppercase text-[#d4a853]">
              Codex of Lawful Remedy
            </h3>
            <p className="mt-3 text-sm leading-relaxed text-[#7a7a8a]">
              The Codex of Lawful Remedy is a growing collection of declarations,
              notices, affidavits, and lawful documents created by and for living men
              and women. These documents are offered as templates for personal research
              and adaptation. They are not legal advice.
            </p>
            <div className="mt-4 flex flex-wrap gap-3">
              <SacredButton href="/scrolls/" variant="outline" size="sm">
                Browse Declarations
              </SacredButton>
              <SacredButton href="/submit/" variant="ghost" size="sm">
                Submit a Remedy Scroll
              </SacredButton>
            </div>
          </div>

          <DisclaimerBox variant="legal">
            <strong>Important:</strong> This material is offered for educational,
            spiritual, and personal research purposes only. It is not legal advice.
            The Living Codex does not guarantee any specific legal, financial, or
            administrative outcome. Always consult with qualified professionals in
            your jurisdiction. The information here represents one stream of research
            into sovereignty and lawful remedy; it is your responsibility to verify
            and adapt it to your situation.
          </DisclaimerBox>
        </motion.div>
      </div>
    </div>
  );
}
