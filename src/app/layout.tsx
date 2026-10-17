import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "The Living Codex — A Remembrance Portal",
    template: "%s — The Living Codex",
  },
  description:
    "A living archive of remembrance, sovereignty, sacred union, divine law, planetary healing, and the return of humanity to harmonic alignment.",
  openGraph: {
    title: "The Living Codex — A Remembrance Portal",
    description:
      "A living archive of remembrance, sovereignty, sacred union, divine law, planetary healing, and the return of humanity to harmonic alignment.",
    type: "website",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "The Living Codex — A Remembrance Portal",
    description:
      "A living archive of remembrance, sovereignty, sacred union, divine law, planetary healing, and the return of humanity to harmonic alignment.",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col sacred-bg starfield mycelium-bg">
        <Header />
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
