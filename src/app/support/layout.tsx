import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Support the Codex",
  description:
    "Two optional ways to support The Living Codex — a one-off contribution of your choosing, or a monthly contribution. Payment is handled entirely by Stripe, and the site itself stores nothing about a donation.",
};

export default function SupportLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
