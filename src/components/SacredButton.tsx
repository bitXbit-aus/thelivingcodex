"use client";

import { motion } from "framer-motion";
import Link from "next/link";

interface SacredButtonProps {
  href?: string;
  onClick?: () => void;
  children: React.ReactNode;
  variant?: "primary" | "secondary" | "outline" | "ghost";
  size?: "sm" | "md" | "lg";
  className?: string;
  type?: "button" | "submit";
  disabled?: boolean;
  /**
   * Normal-case accessible name. The visual styling is uppercase, and some
   * browsers leak `text-transform` into the accessible name.
   */
  ariaLabel?: string;
}

export default function SacredButton({
  href,
  onClick,
  children,
  variant = "primary",
  size = "md",
  className = "",
  type = "button",
  disabled = false,
  ariaLabel,
}: SacredButtonProps) {
  const baseStyles =
    "inline-flex items-center justify-center rounded-md font-medium tracking-wider uppercase transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-[#d4a853]/40";

  const variants = {
    primary:
      "bg-[#d4a853] text-[#0a0b0f] hover:bg-[#b8944a] hover:shadow-[0_0_20px_rgba(212,168,83,0.3)]",
    secondary:
      "bg-[#12141c] text-[#f5f0e8] border border-[rgba(212,168,83,0.3)] hover:border-[#d4a853] hover:bg-[#1a1d2a]",
    outline:
      "bg-transparent text-[#d4a853] border border-[rgba(212,168,83,0.5)] hover:bg-[rgba(212,168,83,0.08)] hover:border-[#d4a853]",
    ghost:
      "bg-transparent text-[#7a7a8a] hover:text-[#f5f0e8] hover:bg-[rgba(212,168,83,0.05)]",
  };

  const sizes = {
    sm: "px-3 py-1.5 text-[10px]",
    md: "px-5 py-2.5 text-xs",
    lg: "px-8 py-3.5 text-sm",
  };

  const combined = `${baseStyles} ${variants[variant]} ${sizes[size]} ${disabled ? "opacity-50 cursor-not-allowed" : ""} ${className}`;

  const content = (
    <motion.span
      whileHover={disabled ? {} : { scale: 1.02 }}
      whileTap={disabled ? {} : { scale: 0.98 }}
      className={combined}
    >
      {children}
    </motion.span>
  );

  if (href) {
    return (
      <Link href={href} aria-label={ariaLabel}>
        {content}
      </Link>
    );
  }

  return (
    <button
      onClick={onClick}
      type={type}
      disabled={disabled}
      className={combined}
      aria-label={ariaLabel}
    >
      {children}
    </button>
  );
}
