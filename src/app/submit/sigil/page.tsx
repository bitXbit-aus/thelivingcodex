"use client";

import Link from "next/link";
import SectionIntro from "@/components/SectionIntro";
import SigilSubmissionForm from "@/components/SigilSubmissionForm";

export default function SubmitSigilPage() {
  return (
    <div className="relative px-4 py-16 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-3xl">
        <div className="mb-8">
          <Link
            href="/submit/"
            className="text-[10px] tracking-widest uppercase text-[#d4a853] transition-colors hover:text-[#f5f0e8]"
          >
            ← Back to submission options
          </Link>
        </div>

        <SectionIntro
          title="Submit a Sigil"
          subtitle="Offer an original sigil to the Living Sigil Library. Every submission is moderated, nothing is published automatically, and submission does not guarantee publication."
        />

        <SigilSubmissionForm />
      </div>
    </div>
  );
}
