"use client";

import { motion } from "framer-motion";

interface SectionIntroProps {
  title: string;
  subtitle?: string;
  align?: "left" | "center";
}

export default function SectionIntro({ title, subtitle, align = "center" }: SectionIntroProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.6 }}
      className={align === "center" ? "text-center" : "text-left"}
    >
      <h2 className="text-2xl sm:text-3xl font-light tracking-wide text-[#f5f0e8] text-glow-soft">
        {title}
      </h2>
      {subtitle && (
        <p className="mt-3 max-w-2xl mx-auto text-sm leading-relaxed text-[#7a7a8a]">
          {subtitle}
        </p>
      )}
      <div
        className={`mt-4 h-px w-16 bg-[#d4a853] ${align === "center" ? "mx-auto" : ""}`}
      />
    </motion.div>
  );
}
