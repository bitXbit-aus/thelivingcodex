interface DisclaimerBoxProps {
  children: React.ReactNode;
  variant?: "default" | "legal" | "medical";
}

export default function DisclaimerBox({ children, variant = "default" }: DisclaimerBoxProps) {
  const borders = {
    default: "border-[rgba(212,168,83,0.15)]",
    legal: "border-[rgba(184,115,51,0.3)]",
    medical: "border-[rgba(196,164,164,0.3)]",
  };

  const bg = {
    default: "bg-[rgba(212,168,83,0.03)]",
    legal: "bg-[rgba(184,115,51,0.03)]",
    medical: "bg-[rgba(196,164,164,0.03)]",
  };

  return (
    <div className={`rounded-lg border ${borders[variant]} ${bg[variant]} p-4`}>
      <p className="text-[11px] leading-relaxed text-[#7a7a8a]">{children}</p>
    </div>
  );
}
