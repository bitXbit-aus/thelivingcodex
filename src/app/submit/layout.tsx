import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Submit a Scroll or Sigil",
  description:
    "Choose how to contribute to The Living Codex: a written scroll for the archive, or original sigil artwork for the moderated Living Sigil Library.",
};

export default function SubmitLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
