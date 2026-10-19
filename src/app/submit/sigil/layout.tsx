import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Submit a Sigil",
  description:
    "Offer an original sigil and its metadata to the Living Sigil Library. Every submission is moderated, and publication is never automatic or guaranteed.",
};

export default function SubmitSigilLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
