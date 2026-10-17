"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, BookOpen } from "lucide-react";

const navLinks = [
  { href: "/", label: "Home" },
  { href: "/portal", label: "Portal" },
  { href: "/scrolls", label: "Scrolls" },
  { href: "/nodes", label: "Nodes" },
  { href: "/technologies", label: "Technologies" },
  { href: "/sovereignty", label: "Sovereignty" },
  { href: "/union", label: "Sacred Union" },
  { href: "/farming", label: "Farming" },
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" },
];

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-50 border-b border-[rgba(212,168,83,0.15)] bg-[#0a0b0f]/80 backdrop-blur-md">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6 lg:px-8">
        <Link href="/" className="flex items-center gap-2 group">
          <BookOpen className="h-5 w-5 text-[#d4a853] transition-transform group-hover:scale-110" />
          <span className="text-sm font-medium tracking-widest text-[#f5f0e8] uppercase">
            The Living Codex
          </span>
        </Link>

        {/* Desktop nav */}
        <nav className="hidden lg:flex items-center gap-1">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`relative px-3 py-1.5 text-xs tracking-wider uppercase transition-colors rounded-md ${
                pathname === link.href
                  ? "text-[#d4a853]"
                  : "text-[#7a7a8a] hover:text-[#f5f0e8]"
              }`}
            >
              {link.label}
              {pathname === link.href && (
                <motion.div
                  layoutId="header-underline"
                  className="absolute bottom-0 left-2 right-2 h-px bg-[#d4a853]"
                />
              )}
            </Link>
          ))}
        </nav>

        {/* Mobile toggle */}
        <button
          onClick={() => setMenuOpen(!menuOpen)}
          className="lg:hidden p-2 text-[#d4a853]"
          aria-label="Toggle menu"
        >
          {menuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      {/* Mobile nav */}
      <AnimatePresence>
        {menuOpen && (
          <motion.nav
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="lg:hidden border-t border-[rgba(212,168,83,0.15)] bg-[#0a0b0f]/95 backdrop-blur-md overflow-hidden"
          >
            <div className="flex flex-col px-4 py-3 gap-1">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setMenuOpen(false)}
                  className={`px-3 py-2 text-sm tracking-wider uppercase rounded-md transition-colors ${
                    pathname === link.href
                      ? "text-[#d4a853] bg-[rgba(212,168,83,0.08)]"
                      : "text-[#7a7a8a] hover:text-[#f5f0e8] hover:bg-[rgba(212,168,83,0.05)]"
                  }`}
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </motion.nav>
        )}
      </AnimatePresence>
    </header>
  );
}
