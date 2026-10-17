import Link from "next/link";
import { BookOpen } from "lucide-react";

export default function Footer() {
  return (
    <footer className="border-t border-[rgba(212,168,83,0.15)] bg-[#0a0b0f]">
      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <BookOpen className="h-4 w-4 text-[#d4a853]" />
              <span className="text-sm font-medium tracking-widest text-[#f5f0e8] uppercase">
                The Living Codex
              </span>
            </div>
            <p className="text-xs leading-relaxed text-[#7a7a8a]">
              A living archive of remembrance, sovereignty, sacred union, and the
              return of humanity to harmonic alignment.
            </p>
          </div>

          <div>
            <h3 className="mb-3 text-xs font-medium tracking-widest uppercase text-[#d4a853]">
              Explore
            </h3>
            <ul className="space-y-2">
              {[
                { href: "/portal/", label: "Remembrance Portal" },
                { href: "/scrolls/", label: "Scroll Archive" },
                { href: "/nodes/", label: "Node Constellation" },
                { href: "/technologies/", label: "Sacred Technologies" },
              ].map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-xs text-[#7a7a8a] transition-colors hover:text-[#f5f0e8]"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="mb-3 text-xs font-medium tracking-widest uppercase text-[#d4a853]">
              Contribute
            </h3>
            <ul className="space-y-2">
              {[
                { href: "/submit/", label: "Submit a Scroll" },
                { href: "/nodes/", label: "Offer a Node Activation" },
                { href: "/contact/", label: "Collaborate" },
                { href: "/contact/", label: "Support the Codex" },
              ].map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className="text-xs text-[#7a7a8a] transition-colors hover:text-[#f5f0e8]"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="mb-3 text-xs font-medium tracking-widest uppercase text-[#d4a853]">
              Trust
            </h3>
            <ul className="space-y-2">
              {[
                { href: "/about/", label: "About" },
                { href: "/contact/", label: "Contact" },
                { href: "/sovereignty/", label: "Disclaimers" },
                { href: "/contact/", label: "Privacy" },
              ].map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className="text-xs text-[#7a7a8a] transition-colors hover:text-[#f5f0e8]"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-8 border-t border-[rgba(212,168,83,0.1)] pt-6 text-center">
          <p className="text-[10px] tracking-widest uppercase text-[#7a7a8a]">
            The Living Codex — A Remembrance in Motion
          </p>
        </div>
      </div>
    </footer>
  );
}
