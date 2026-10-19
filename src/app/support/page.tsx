"use client";

import { motion } from "framer-motion";
import SectionIntro from "@/components/SectionIntro";
import DisclaimerBox from "@/components/DisclaimerBox";
import { formatUsd, supportConfig } from "@/data/support";
import { ExternalLink, HandHeart, CalendarClock } from "lucide-react";

const focusRing =
  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#d4a853] focus-visible:ring-offset-2 focus-visible:ring-offset-[#0a0b0f]";

const buttonBase =
  "inline-flex w-full items-center justify-center gap-2 rounded-md px-5 py-3 text-xs font-medium tracking-wider uppercase text-center transition-all duration-300";

const buttonVariants = {
  primary:
    "bg-[#d4a853] text-[#0a0b0f] hover:bg-[#b8944a] hover:shadow-[0_0_20px_rgba(212,168,83,0.3)]",
  outline:
    "bg-transparent text-[#d4a853] border border-[rgba(212,168,83,0.5)] hover:bg-[rgba(212,168,83,0.08)] hover:border-[#d4a853]",
} as const;

/**
 * External contribution link. Opens on Stripe's own hosted page, in a new tab,
 * because it leaves the site. The visible label states both the action and the
 * destination ("opens Stripe").
 */
function StripeLink({
  href,
  label,
  variant,
}: {
  href: string;
  label: string;
  variant: keyof typeof buttonVariants;
}) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className={`${buttonBase} ${buttonVariants[variant]} ${focusRing}`}
    >
      <span>{label}</span>
      <ExternalLink className="h-3.5 w-3.5" aria-hidden="true" />
    </a>
  );
}

export default function SupportPage() {
  const { oneOff, monthly, provider } = supportConfig;

  return (
    <div className="relative px-4 py-16 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-4xl">
        {/* Hero */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          className="text-center"
        >
          <div className="mb-6 flex justify-center">
            <div className="rounded-full border border-[rgba(212,168,83,0.2)] bg-[rgba(212,168,83,0.05)] px-4 py-1.5">
              <span className="text-[10px] tracking-[0.3em] uppercase text-[#d4a853]">
                Optional
              </span>
            </div>
          </div>
          <h1 className="text-3xl font-light leading-tight tracking-wide text-[#f5f0e8] text-glow sm:text-4xl md:text-5xl">
            Support the Codex
          </h1>
          <p className="mx-auto mt-5 max-w-xl text-sm leading-relaxed text-[#7a7a8a]">
            Alongside everything the Codex offers freely, there are two ways to
            contribute if you would like to. Both are entirely optional, and the
            choice belongs to you.
          </p>
        </motion.div>

        {/* Both paths, side by side and equal */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.15 }}
          className="mt-16"
        >
          <SectionIntro
            title="Two ways to contribute"
            subtitle="One-off and monthly sit side by side as equal options. Neither is more expected than the other."
          />

          <div className="mt-10 grid gap-6 sm:grid-cols-2">
            {/* One-off */}
            <article className="flex flex-col rounded-xl border border-[rgba(212,168,83,0.12)] bg-[#0a0b0f]/60 p-7 backdrop-blur-sm">
              <div className="flex h-10 w-10 items-center justify-center rounded-full border border-[rgba(212,168,83,0.2)] bg-[rgba(212,168,83,0.05)]">
                <HandHeart className="h-4 w-4 text-[#d4a853]" aria-hidden="true" />
              </div>
              <h3 className="mt-5 text-xl font-medium text-[#f5f0e8]">
                One-off contribution
              </h3>
              <p className="mt-1 text-[10px] tracking-widest uppercase text-[#d4a853]">
                You choose the amount
              </p>
              <p className="mt-4 text-sm leading-relaxed text-[#7a7a8a]">
                A single contribution of any amount you wish. On {provider}&apos;s
                page a suggested amount of {formatUsd(oneOff.amount.suggestedUsd)}{" "}
                is shown, and you may set anything from{" "}
                {formatUsd(oneOff.amount.minimumUsd)} up to{" "}
                {formatUsd(oneOff.amount.maximumUsd)}.
              </p>
              <div className="mt-6 flex-1" />
              <StripeLink
                href={oneOff.url}
                label="Contribute a one-off amount (opens Stripe)"
                variant="primary"
              />
            </article>

            {/* Monthly */}
            <article className="flex flex-col rounded-xl border border-[rgba(212,168,83,0.12)] bg-[#0a0b0f]/60 p-7 backdrop-blur-sm">
              <div className="flex h-10 w-10 items-center justify-center rounded-full border border-[rgba(212,168,83,0.2)] bg-[rgba(212,168,83,0.05)]">
                <CalendarClock
                  className="h-4 w-4 text-[#d4a853]"
                  aria-hidden="true"
                />
              </div>
              <h3 className="mt-5 text-xl font-medium text-[#f5f0e8]">
                Monthly contribution
              </h3>
              <p className="mt-1 text-[10px] tracking-widest uppercase text-[#d4a853]">
                {formatUsd(monthly.amount.perMonthUsd)} per month
              </p>
              <p className="mt-4 text-sm leading-relaxed text-[#7a7a8a]">
                A recurring subscription of{" "}
                {formatUsd(monthly.amount.perMonthUsd)} per month. It renews each
                month until you cancel, and you can cancel at any time by
                contacting us through the Contact page.
              </p>
              <div className="mt-6 flex-1" />
              <StripeLink
                href={monthly.url}
                label="Set up a monthly contribution (opens Stripe)"
                variant="outline"
              />
            </article>
          </div>

          {/* Non-coercion notice */}
          <div className="mt-8">
            <DisclaimerBox>
              Support is optional. The Codex is fully usable without it, nothing
              is locked behind a contribution, and you are never obligated to
              give. At the end of the day it is up to you.
            </DisclaimerBox>
          </div>
        </motion.div>

        {/* Where support goes — the steward's own words only */}
        <section className="mt-16">
          <SectionIntro
            align="left"
            title="Where support goes"
            subtitle="Described in the steward's own words, below. Nothing is added to them here."
          />
          <blockquote className="mt-6 rounded-lg border border-[rgba(212,168,83,0.15)] bg-[rgba(212,168,83,0.03)] p-5">
            <p className="text-sm leading-relaxed text-[#c8c4b8]">
              &ldquo;Your generous donation will help support the continued
              development of{" "}
              <strong className="font-medium text-[#f5f0e8]">
                The Living Codex
              </strong>
              ,{" "}
              <strong className="font-medium text-[#f5f0e8]">
                The New Earth Healing Clinic
              </strong>
              , organic farming initiatives, community wellbeing programs, and
              personal projects dedicated to holistic healing, sustainability,
              conscious living, and the creation of a more harmonious New
              Earth. 🌱💚🙏&rdquo;
            </p>
            <footer className="mt-3 text-[11px] tracking-wider uppercase text-[#7a7a8a]">
              — The steward, 20 October 2026
            </footer>
          </blockquote>
          <p className="mt-4 text-sm leading-relaxed text-[#7a7a8a]">
            Donations can vary in amount, and that choice is yours.
          </p>
        </section>

        {/* How payment works — factual */}
        <section className="mt-16">
          <SectionIntro
            align="left"
            title="How payment works"
            subtitle="What happens when you continue to Stripe, stated plainly."
          />
          <div className="mt-6 space-y-4">
            <DisclaimerBox>
              Payment is handled entirely by {provider}. When you continue, you
              leave this site and complete the contribution on {provider}&apos;s
              own hosted page. The amount and the payment details are entered
              there, not here.
            </DisclaimerBox>
            <DisclaimerBox>
              This site stores nothing personal about a donation. It has no
              server and receives no notification, so it does not record, track
              or receipt contributions in any way.
            </DisclaimerBox>
            <DisclaimerBox>
              The monthly option is a recurring subscription. It renews each
              month until cancelled, and it can be cancelled at any time by
              contacting us through the Contact page. There is no minimum term.
            </DisclaimerBox>
          </div>
        </section>
      </div>
    </div>
  );
}
