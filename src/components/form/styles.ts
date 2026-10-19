/**
 * Shared field styling for the public submission forms. The visual language is
 * unchanged apart from the placeholder colour, which was raised from #7a7a8a
 * (about 4.36:1 at 12px) to #8b8b9c so it clears WCAG AA 4.5:1.
 */
export const fieldClass =
  "w-full rounded-lg border border-[rgba(212,168,83,0.15)] bg-[#12141c]/80 px-4 py-2.5 text-xs text-[#f5f0e8] placeholder-[#8b8b9c] outline-none transition-colors focus:border-[#d4a853]";

export const fieldErrorClass =
  "w-full rounded-lg border border-[rgba(220,130,130,0.6)] bg-[#12141c]/80 px-4 py-2.5 text-xs text-[#f5f0e8] placeholder-[#8b8b9c] outline-none transition-colors focus:border-[#e0a0a0]";

export const labelClass =
  "mb-1.5 block text-[10px] tracking-widest uppercase text-[#d4a853]";

export const helpClass = "mt-1.5 text-[10px] leading-relaxed text-[#7a7a8a]";
export const errorTextClass =
  "mt-1.5 text-[11px] leading-relaxed text-[#e0a0a0]";
