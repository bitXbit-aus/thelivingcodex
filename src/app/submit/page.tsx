import Link from "next/link";
import SectionIntro from "@/components/SectionIntro";
import ScrollSubmissionForm from "@/components/ScrollSubmissionForm";

export default function SubmitPage() {
  return (
    <div className="relative px-4 py-16 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-3xl">
        <SectionIntro
          title="Submit to The Living Codex"
          subtitle="Choose a submission type: a written scroll for the archive, or original sigil artwork for the Living Sigil Library."
        />

        <nav aria-label="Submission type" className="mt-8 grid gap-3 sm:grid-cols-2">
          <Link
            href="/submit/"
            aria-current="page"
            className="rounded-lg border border-[#d4a853] bg-[#12141c]/80 p-4 transition-colors"
          >
            <span className="block text-[11px] tracking-widest uppercase text-[#d4a853]">
              Submit a Scroll
            </span>
            <span className="mt-1 block text-[11px] leading-relaxed text-[#c8c4b8]">
              Written remembrance, declaration, ceremony, dream, or transmission.
            </span>
            <span className="mt-2 block text-[9px] tracking-wider uppercase text-[#7a7a8a]">
              Current selection
            </span>
          </Link>
          <Link
            href="/submit/sigil/"
            className="rounded-lg border border-[rgba(212,168,83,0.2)] bg-[#12141c]/40 p-4 transition-colors hover:border-[#d4a853]"
          >
            <span className="block text-[11px] tracking-widest uppercase text-[#d4a853]">
              Submit a Sigil
            </span>
            <span className="mt-1 block text-[11px] leading-relaxed text-[#c8c4b8]">
              Original sigil artwork and its metadata, offered to the Living Sigil
              Library.
            </span>
            <span className="mt-2 block text-[9px] tracking-wider uppercase text-[#7a7a8a]">
              Moderated submission
            </span>
          </Link>
        </nav>

        <h2 className="mt-10 text-xs tracking-widest uppercase text-[#d4a853]">
          Scroll submission
        </h2>

        <ScrollSubmissionForm />
      </div>
    </div>
  );
}
