import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Living Sigil Library",
  description:
    "A curated, moderated archive of original sigils shared by their creators, each published under a stated licence. Browse works, review attribution, and understand your reuse rights.",
};

export default function SigilsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
